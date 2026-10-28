/* ==========================================================================
   EVM Syllables — lib/evm-syllables.js
   --------------------------------------------------------------------------
   Splits English lyrics into SUNG syllables, so that every syllable can
   have a note of its own. Written 2026-10-26 from "Lyric Syllabification
   Spec for Song Writer" (the user's research doc, same day): count by
   sound, split by spelling — the way published vocal music hyphenates
   (Wa-ter-mel-on, riv-er, ba-by, teach-er, run-ning, call-ing), never by
   where the consonants sound (qui-ckly), and never a one-syllable word,
   however long (strength, squeezed, world).

   WHERE AN ANSWER COMES FROM, first hit wins (reported as `source`):
     override    a split this browser was told to prefer (choose() — the
                 Write window remembers a way you picked)
     curated     TRICKY below: the spec's hand-checked tricky words, with
                 their other valid ways (ev-ery / ev-er-y). Also the
                 fixture selfTest() runs.
     dictionary  evm-syllables-words.txt, beside this file: the most common
                 English words, split as Moby Hyphenator II splits them
                 (public domain) — kept only where the CMU Pronouncing
                 Dictionary (BSD) agrees on the syllable count; inflected
                 forms Moby lacks were rebuilt from their stems and checked
                 the same way. Built by "Claude Apps/Syllable Data/build-
                 syllable-words.js". Loaded once, the first time it is needed.
     derived     a word the list lacks, rebuilt from one it has: an ending
                 taken off (-ing -ed -s -es -er -est -ly -ness -ful -less
                 -ment, 's 'll …), a beginning (un- re- dis- pre- mis-), or
                 two words run together (moon + beam)
     guess       spelling rules (the spec's rules 6–17), for names and
                 made-up words; confidence 'low', so the app can say so
   Nothing here touches the page or the network but load(); without the
   word list every word still gets an answer (curated, derived, guessed).

   A RESULT, for a token as typed ("Watermelon," → Wa · ter · mel · on,):
     { word, syllables: ['Wa','ter','mel','on,'], alts: [['…']],
       count, source, confidence: 'high'|'medium'|'low', note }
   The syllables are cut from the token itself, so its capitals and its
   punctuation (on the first and last syllable) come through untouched;
   joined, they give the token back exactly. An alternative is offered
   only when it spells the same word (ev-er-y for every — never fam-ly).
   null = nothing to split: one syllable, a number, a token already
   hyphenated (the writer has decided), a lone mark.

   API   window.EVMSyllables (and module.exports under Node, for the build)
     load([url]) → Promise<boolean>   the word list (fine to fail)
     ready()                          the word list is in
     split(token)                     the result above, or null
     choose(word, syllables|null)     remember a way for this word (null forgets)
     configure({ storageKey })        where choose() keeps its choices
     selfTest() → { pass, fail, failures }   TRICKY + invariants + song lines
   ========================================================================== */
(function (root) {
  'use strict';

  /* ================= the spec's tricky words (section 11) =================
     w: word · d: default sung split · a: other valid splits · c: the rule it
     tests · n: a note. Copied as given (the test fixture too). */
  const TRICKY = [
  {"w":"every","d":"ev-ery","a":["ev-er-y"],"c":"syncope"},
  {"w":"everything","d":"ev-ery-thing","a":["ev-er-y-thing"],"c":"syncope"},
  {"w":"everyone","d":"ev-ery-one","a":["ev-er-y-one"],"c":"syncope"},
  {"w":"everybody","d":"ev-ery-bod-y","a":["ev-er-y-bod-y"],"c":"syncope"},
  {"w":"everywhere","d":"ev-ery-where","a":["ev-er-y-where"],"c":"syncope"},
  {"w":"family","d":"fam-i-ly","a":["fam-ly"],"c":"syncope"},
  {"w":"chocolate","d":"choc-o-late","a":["choc-late"],"c":"syncope"},
  {"w":"favorite","d":"fa-vor-ite","a":["fav-rite"],"c":"syncope"},
  {"w":"different","d":"dif-fer-ent","a":["dif-frent"],"c":"syncope"},
  {"w":"interesting","d":"in-ter-est-ing","a":["in-trest-ing"],"c":"syncope"},
  {"w":"camera","d":"cam-er-a","a":["cam-ra"],"c":"syncope"},
  {"w":"history","d":"his-to-ry","a":["his-try"],"c":"syncope"},
  {"w":"mystery","d":"mys-ter-y","a":["mys-try"],"c":"syncope"},
  {"w":"memory","d":"mem-o-ry","a":["mem-ry"],"c":"syncope"},
  {"w":"comfortable","d":"com-fort-a-ble","a":["comf-ta-ble"],"c":"syncope"},
  {"w":"vegetable","d":"veg-e-ta-ble","a":["veg-ta-ble"],"c":"syncope"},
  {"w":"several","d":"sev-er-al","a":["sev-ral"],"c":"syncope"},
  {"w":"general","d":"gen-er-al","a":["gen-ral"],"c":"syncope"},
  {"w":"natural","d":"nat-u-ral","a":["nat-ral"],"c":"syncope"},
  {"w":"probably","d":"prob-a-bly","a":["prob-ly"],"c":"syncope"},
  {"w":"library","d":"li-brar-y","c":"syncope"},
  {"w":"february","d":"feb-ru-ar-y","a":["feb-u-ar-y"],"c":"syncope"},
  {"w":"restaurant","d":"res-tau-rant","a":["res-trant"],"c":"syncope"},
  {"w":"temperature","d":"tem-per-a-ture","a":["tem-pra-ture"],"c":"syncope"},
  {"w":"miserable","d":"mis-er-a-ble","a":["mis-ra-ble"],"c":"syncope"},
  {"w":"separate","d":"sep-a-rate","a":["sep-rate"],"c":"syncope"},
  {"w":"traveling","d":"trav-el-ing","a":["trav-ling"],"c":"syncope"},
  {"w":"wandering","d":"wan-der-ing","a":["wan-dring"],"c":"syncope"},
  {"w":"glittering","d":"glit-ter-ing","a":["glit-tring"],"c":"syncope"},
  {"w":"evening","d":"eve-ning","c":"syncope","n":"2 syllables (time of day); e-ven-ing (3) means making level"},
  {"w":"business","d":"busi-ness","c":"syncope","n":"always 2"},
  {"w":"wednesday","d":"wednes-day","c":"syncope","n":"2, first d silent"},
  {"w":"actually","d":"ac-tu-al-ly","a":["ac-tual-ly"],"c":"syncope"},
  {"w":"heaven","d":"heav-en","a":["heav'n"],"c":"syncope"},
  {"w":"fire","d":"fire","a":["fi-re"],"c":"r-l-colored","n":"1 by default; 2 is common in songs"},
  {"w":"tire","d":"tire","a":["ti-re"],"c":"r-l-colored"},
  {"w":"tired","d":"tired","a":["ti-red"],"c":"r-l-colored"},
  {"w":"wire","d":"wire","a":["wi-re"],"c":"r-l-colored"},
  {"w":"desire","d":"de-sire","a":["de-si-re"],"c":"r-l-colored"},
  {"w":"inspire","d":"in-spire","c":"r-l-colored","n":"keep 2; extra notes = melisma on -spire"},
  {"w":"choir","d":"choir","c":"r-l-colored","n":"1 syllable; never split"},
  {"w":"hour","d":"hour","a":["ho-ur"],"c":"r-l-colored"},
  {"w":"our","d":"our","a":["o-ur"],"c":"r-l-colored"},
  {"w":"flower","d":"flow-er","a":["flow'r"],"c":"r-l-colored"},
  {"w":"power","d":"pow-er","c":"r-l-colored"},
  {"w":"tower","d":"tow-er","c":"r-l-colored"},
  {"w":"shower","d":"show-er","c":"r-l-colored"},
  {"w":"iron","d":"i-ron","c":"r-l-colored","n":"spelled -ron, said -ern"},
  {"w":"real","d":"real","a":["re-al"],"c":"r-l-colored"},
  {"w":"really","d":"real-ly","a":["re-al-ly"],"c":"r-l-colored"},
  {"w":"cruel","d":"cru-el","a":["cruel"],"c":"r-l-colored"},
  {"w":"jewel","d":"jew-el","c":"r-l-colored"},
  {"w":"fuel","d":"fu-el","c":"r-l-colored"},
  {"w":"towel","d":"tow-el","c":"r-l-colored"},
  {"w":"squirrel","d":"squir-rel","a":["squirrel"],"c":"r-l-colored"},
  {"w":"world","d":"world","c":"r-l-colored","n":"1; never wor-ld"},
  {"w":"girl","d":"girl","c":"r-l-colored"},
  {"w":"poem","d":"po-em","c":"vowel-pair"},
  {"w":"poetry","d":"po-et-ry","c":"vowel-pair"},
  {"w":"diamond","d":"di-a-mond","a":["dia-mond"],"c":"vowel-pair"},
  {"w":"violin","d":"vi-o-lin","c":"vowel-pair"},
  {"w":"lion","d":"li-on","c":"vowel-pair"},
  {"w":"quiet","d":"qui-et","c":"vowel-pair","n":"not quite (1)"},
  {"w":"science","d":"sci-ence","c":"vowel-pair"},
  {"w":"idea","d":"i-de-a","c":"vowel-pair"},
  {"w":"piano","d":"pi-an-o","c":"vowel-pair"},
  {"w":"radio","d":"ra-di-o","c":"vowel-pair"},
  {"w":"video","d":"vid-e-o","c":"vowel-pair"},
  {"w":"area","d":"ar-e-a","c":"vowel-pair"},
  {"w":"create","d":"cre-ate","c":"vowel-pair"},
  {"w":"ruin","d":"ru-in","c":"vowel-pair"},
  {"w":"usual","d":"u-su-al","c":"vowel-pair"},
  {"w":"being","d":"be-ing","c":"vowel-pair"},
  {"w":"going","d":"go-ing","c":"vowel-pair"},
  {"w":"doing","d":"do-ing","c":"vowel-pair"},
  {"w":"seeing","d":"see-ing","c":"vowel-pair"},
  {"w":"crying","d":"cry-ing","c":"vowel-pair"},
  {"w":"flying","d":"fly-ing","c":"vowel-pair"},
  {"w":"trying","d":"try-ing","c":"vowel-pair"},
  {"w":"dying","d":"dy-ing","c":"vowel-pair"},
  {"w":"playing","d":"play-ing","c":"vowel-pair","n":"ay is one vowel; split before -ing"},
  {"w":"saying","d":"say-ing","c":"vowel-pair"},
  {"w":"raining","d":"rain-ing","c":"vowel-pair"},
  {"w":"mountain","d":"moun-tain","c":"vowel-pair"},
  {"w":"ocean","d":"o-cean","c":"vowel-pair","n":"ea is one sound here"},
  {"w":"hallelujah","d":"hal-le-lu-jah","c":"vowel-pair"},
  {"w":"alleluia","d":"al-le-lu-ia","a":["al-le-lu-i-a"],"c":"vowel-pair"},
  {"w":"strength","d":"strength","c":"one-syllable"},
  {"w":"through","d":"through","c":"one-syllable"},
  {"w":"thought","d":"thought","c":"one-syllable"},
  {"w":"brought","d":"brought","c":"one-syllable"},
  {"w":"straight","d":"straight","c":"one-syllable"},
  {"w":"stretched","d":"stretched","c":"one-syllable"},
  {"w":"scratched","d":"scratched","c":"one-syllable"},
  {"w":"squeezed","d":"squeezed","c":"one-syllable"},
  {"w":"breathed","d":"breathed","c":"one-syllable"},
  {"w":"laughed","d":"laughed","c":"one-syllable"},
  {"w":"sighed","d":"sighed","c":"one-syllable"},
  {"w":"eyes","d":"eyes","c":"one-syllable"},
  {"w":"aisle","d":"aisle","c":"one-syllable"},
  {"w":"height","d":"height","c":"one-syllable"},
  {"w":"knight","d":"knight","c":"one-syllable"},
  {"w":"night","d":"night","c":"one-syllable"},
  {"w":"school","d":"school","c":"one-syllable"},
  {"w":"ache","d":"ache","c":"one-syllable"},
  {"w":"queue","d":"queue","c":"one-syllable"},
  {"w":"running","d":"run-ning","c":"double-cons"},
  {"w":"stopping","d":"stop-ping","c":"double-cons"},
  {"w":"hopping","d":"hop-ping","c":"double-cons","n":"contrast hoping = hop-ing"},
  {"w":"happy","d":"hap-py","c":"double-cons"},
  {"w":"summer","d":"sum-mer","c":"double-cons"},
  {"w":"letter","d":"let-ter","c":"double-cons"},
  {"w":"butter","d":"but-ter","c":"double-cons"},
  {"w":"follow","d":"fol-low","c":"double-cons"},
  {"w":"yellow","d":"yel-low","c":"double-cons"},
  {"w":"hello","d":"hel-lo","c":"double-cons"},
  {"w":"little","d":"lit-tle","c":"double-cons"},
  {"w":"bottle","d":"bot-tle","c":"double-cons"},
  {"w":"apple","d":"ap-ple","c":"double-cons"},
  {"w":"bubble","d":"bub-ble","c":"double-cons"},
  {"w":"calling","d":"call-ing","c":"root-double"},
  {"w":"falling","d":"fall-ing","c":"root-double"},
  {"w":"fallen","d":"fall-en","c":"root-double"},
  {"w":"telling","d":"tell-ing","c":"root-double"},
  {"w":"spelling","d":"spell-ing","c":"root-double"},
  {"w":"kissing","d":"kiss-ing","c":"root-double"},
  {"w":"dressing","d":"dress-ing","c":"root-double"},
  {"w":"smaller","d":"small-er","c":"root-double"},
  {"w":"stillness","d":"still-ness","c":"root-double"},
  {"w":"teacher","d":"teach-er","c":"digraph"},
  {"w":"father","d":"fa-ther","c":"digraph"},
  {"w":"mother","d":"moth-er","c":"digraph"},
  {"w":"brother","d":"broth-er","c":"digraph"},
  {"w":"other","d":"oth-er","c":"digraph"},
  {"w":"nothing","d":"noth-ing","c":"digraph"},
  {"w":"together","d":"to-geth-er","c":"digraph"},
  {"w":"weather","d":"weath-er","c":"digraph"},
  {"w":"pickle","d":"pick-le","c":"digraph","n":"ck never splits"},
  {"w":"chicken","d":"chick-en","c":"digraph"},
  {"w":"rocket","d":"rock-et","c":"digraph"},
  {"w":"singer","d":"sing-er","c":"digraph","n":"ng is one sound"},
  {"w":"finger","d":"fin-ger","c":"digraph","n":"n and g are separate sounds; contrast singer"},
  {"w":"longer","d":"lon-ger","c":"digraph"},
  {"w":"younger","d":"youn-ger","c":"digraph"},
  {"w":"hunger","d":"hun-ger","c":"digraph"},
  {"w":"ringing","d":"ring-ing","c":"digraph"},
  {"w":"laughing","d":"laugh-ing","c":"digraph"},
  {"w":"telephone","d":"tel-e-phone","c":"digraph"},
  {"w":"elephant","d":"el-e-phant","c":"digraph"},
  {"w":"dolphin","d":"dol-phin","c":"digraph"},
  {"w":"nephew","d":"neph-ew","c":"digraph"},
  {"w":"whisper","d":"whis-per","c":"digraph"},
  {"w":"table","d":"ta-ble","c":"cons-le"},
  {"w":"able","d":"a-ble","c":"cons-le"},
  {"w":"purple","d":"pur-ple","c":"cons-le"},
  {"w":"candle","d":"can-dle","c":"cons-le"},
  {"w":"simple","d":"sim-ple","c":"cons-le"},
  {"w":"gentle","d":"gen-tle","c":"cons-le"},
  {"w":"circle","d":"cir-cle","c":"cons-le"},
  {"w":"twinkle","d":"twin-kle","c":"cons-le"},
  {"w":"jungle","d":"jun-gle","c":"cons-le"},
  {"w":"uncle","d":"un-cle","c":"cons-le"},
  {"w":"people","d":"peo-ple","c":"cons-le"},
  {"w":"castle","d":"cas-tle","c":"cons-le","n":"t silent"},
  {"w":"whistle","d":"whis-tle","c":"cons-le"},
  {"w":"cradle","d":"cra-dle","c":"cons-le"},
  {"w":"title","d":"ti-tle","c":"cons-le"},
  {"w":"eagle","d":"ea-gle","c":"cons-le"},
  {"w":"smile","d":"smile","c":"silent-e-ed"},
  {"w":"smiled","d":"smiled","c":"silent-e-ed"},
  {"w":"smiling","d":"smil-ing","c":"silent-e-ed"},
  {"w":"hoping","d":"hop-ing","c":"silent-e-ed"},
  {"w":"loving","d":"lov-ing","c":"silent-e-ed"},
  {"w":"loved","d":"loved","c":"silent-e-ed"},
  {"w":"played","d":"played","c":"silent-e-ed"},
  {"w":"jumped","d":"jumped","c":"silent-e-ed"},
  {"w":"danced","d":"danced","c":"silent-e-ed"},
  {"w":"wanted","d":"want-ed","c":"silent-e-ed","n":"-ed after t is a syllable"},
  {"w":"needed","d":"need-ed","c":"silent-e-ed","n":"-ed after d is a syllable"},
  {"w":"started","d":"start-ed","c":"silent-e-ed"},
  {"w":"ended","d":"end-ed","c":"silent-e-ed"},
  {"w":"lonely","d":"lone-ly","c":"silent-e-ed"},
  {"w":"lovely","d":"love-ly","c":"silent-e-ed"},
  {"w":"careful","d":"care-ful","c":"silent-e-ed"},
  {"w":"homeless","d":"home-less","c":"silent-e-ed"},
  {"w":"beloved","d":"be-lov-ed","a":["be-loved"],"c":"silent-e-ed","n":"3 as adjective/noun in hymns, 2 as verb"},
  {"w":"blessed","d":"bless-ed","a":["blessed"],"c":"silent-e-ed","n":"2 as adjective, 1 as verb"},
  {"w":"learned","d":"learned","a":["learn-ed"],"c":"silent-e-ed","n":"2 only as adjective (a learned man)"},
  {"w":"baby","d":"ba-by","c":"vcv-long"},
  {"w":"open","d":"o-pen","c":"vcv-long"},
  {"w":"opened","d":"o-pened","a":["op-ened"],"c":"vcv-long","n":"publishers differ; o-pened preferred"},
  {"w":"music","d":"mu-sic","c":"vcv-long"},
  {"w":"tiger","d":"ti-ger","c":"vcv-long"},
  {"w":"paper","d":"pa-per","c":"vcv-long"},
  {"w":"spider","d":"spi-der","c":"vcv-long"},
  {"w":"over","d":"o-ver","a":["o'er"],"c":"vcv-long"},
  {"w":"even","d":"e-ven","c":"vcv-long"},
  {"w":"lady","d":"la-dy","c":"vcv-long"},
  {"w":"pony","d":"po-ny","c":"vcv-long"},
  {"w":"tiny","d":"ti-ny","c":"vcv-long"},
  {"w":"silent","d":"si-lent","c":"vcv-long"},
  {"w":"moment","d":"mo-ment","c":"vcv-long"},
  {"w":"student","d":"stu-dent","c":"vcv-long"},
  {"w":"river","d":"riv-er","c":"vcv-short"},
  {"w":"wagon","d":"wag-on","c":"vcv-short"},
  {"w":"lemon","d":"lem-on","c":"vcv-short"},
  {"w":"seven","d":"sev-en","c":"vcv-short"},
  {"w":"visit","d":"vis-it","c":"vcv-short"},
  {"w":"never","d":"nev-er","a":["ne'er"],"c":"vcv-short"},
  {"w":"ever","d":"ev-er","a":["e'er"],"c":"vcv-short"},
  {"w":"very","d":"ver-y","c":"vcv-short"},
  {"w":"city","d":"cit-y","c":"vcv-short"},
  {"w":"body","d":"bod-y","c":"vcv-short"},
  {"w":"any","d":"an-y","c":"vcv-short"},
  {"w":"many","d":"man-y","c":"vcv-short"},
  {"w":"honey","d":"hon-ey","c":"vcv-short"},
  {"w":"money","d":"mon-ey","c":"vcv-short"},
  {"w":"planet","d":"plan-et","c":"vcv-short"},
  {"w":"robin","d":"rob-in","c":"vcv-short"},
  {"w":"travel","d":"trav-el","c":"vcv-short"},
  {"w":"second","d":"sec-ond","c":"vcv-short"},
  {"w":"magic","d":"mag-ic","c":"vcv-short"},
  {"w":"given","d":"giv-en","c":"vcv-short"},
  {"w":"often","d":"of-ten","c":"vcv-short"},
  {"w":"listen","d":"lis-ten","c":"vcv-short","n":"t silent"},
  {"w":"away","d":"a-way","c":"prefix"},
  {"w":"alone","d":"a-lone","c":"prefix"},
  {"w":"around","d":"a-round","c":"prefix"},
  {"w":"again","d":"a-gain","c":"prefix"},
  {"w":"above","d":"a-bove","c":"prefix"},
  {"w":"asleep","d":"a-sleep","c":"prefix"},
  {"w":"awake","d":"a-wake","c":"prefix"},
  {"w":"begin","d":"be-gin","c":"prefix"},
  {"w":"because","d":"be-cause","c":"prefix"},
  {"w":"return","d":"re-turn","c":"prefix"},
  {"w":"disappear","d":"dis-ap-pear","c":"prefix"},
  {"w":"unbelievable","d":"un-be-liev-a-ble","c":"prefix"},
  {"w":"tonight","d":"to-night","c":"prefix"},
  {"w":"today","d":"to-day","c":"prefix"},
  {"w":"tomorrow","d":"to-mor-row","c":"prefix"},
  {"w":"forever","d":"for-ev-er","c":"prefix"},
  {"w":"however","d":"how-ev-er","c":"compound"},
  {"w":"whenever","d":"when-ev-er","c":"compound"},
  {"w":"sunshine","d":"sun-shine","c":"compound"},
  {"w":"rainbow","d":"rain-bow","c":"compound"},
  {"w":"snowflake","d":"snow-flake","c":"compound"},
  {"w":"butterfly","d":"but-ter-fly","c":"compound"},
  {"w":"birthday","d":"birth-day","c":"compound"},
  {"w":"grandmother","d":"grand-moth-er","c":"compound"},
  {"w":"homework","d":"home-work","c":"compound","n":"silent e inside a compound"},
  {"w":"goodbye","d":"good-bye","c":"compound"},
  {"w":"cupcake","d":"cup-cake","c":"compound"},
  {"w":"football","d":"foot-ball","c":"compound"},
  {"w":"moonlight","d":"moon-light","c":"compound"},
  {"w":"heartbeat","d":"heart-beat","c":"compound"},
  {"w":"firefly","d":"fire-fly","a":["fi-re-fly"],"c":"compound"},
  {"w":"something","d":"some-thing","c":"compound"},
  {"w":"sometimes","d":"some-times","c":"compound"},
  {"w":"somebody","d":"some-bod-y","c":"compound"},
  {"w":"someone","d":"some-one","c":"compound"},
  {"w":"somewhere","d":"some-where","c":"compound"},
  {"w":"anything","d":"an-y-thing","c":"compound"},
  {"w":"anywhere","d":"an-y-where","c":"compound"},
  {"w":"nowhere","d":"no-where","c":"compound"},
  {"w":"beautiful","d":"beau-ti-ful","c":"suffix"},
  {"w":"wonderful","d":"won-der-ful","c":"suffix"},
  {"w":"nation","d":"na-tion","c":"suffix","n":"-tion is one syllable"},
  {"w":"question","d":"ques-tion","c":"suffix"},
  {"w":"special","d":"spe-cial","c":"suffix"},
  {"w":"delicious","d":"de-li-cious","c":"suffix"},
  {"w":"precious","d":"pre-cious","c":"suffix"},
  {"w":"picture","d":"pic-ture","c":"suffix"},
  {"w":"nature","d":"na-ture","c":"suffix"},
  {"w":"creature","d":"crea-ture","c":"suffix"},
  {"w":"treasure","d":"treas-ure","c":"suffix"},
  {"w":"measure","d":"meas-ure","c":"suffix"},
  {"w":"vision","d":"vi-sion","c":"suffix"},
  {"w":"imagination","d":"im-ag-i-na-tion","c":"long"},
  {"w":"celebration","d":"cel-e-bra-tion","c":"long"},
  {"w":"information","d":"in-for-ma-tion","c":"long"},
  {"w":"electricity","d":"e-lec-tric-i-ty","c":"long"},
  {"w":"dinosaur","d":"di-no-saur","c":"long"},
  {"w":"caterpillar","d":"cat-er-pil-lar","c":"long"},
  {"w":"watermelon","d":"wa-ter-mel-on","c":"long"},
  {"w":"helicopter","d":"hel-i-cop-ter","c":"long"},
  {"w":"hippopotamus","d":"hip-po-pot-a-mus","c":"long"},
  {"w":"alligator","d":"al-li-ga-tor","c":"long"},
  {"w":"kangaroo","d":"kan-ga-roo","c":"long"},
  {"w":"supercalifragilisticexpialidocious","d":"su-per-cal-i-frag-il-is-tic-ex-pi-al-i-do-cious","c":"long","n":"14 syllables"},
  {"w":"record","d":"rec-ord","a":["re-cord"],"c":"heteronym","n":"noun rec-ord / verb re-cord"},
  {"w":"present","d":"pres-ent","a":["pre-sent"],"c":"heteronym","n":"noun pres-ent / verb pre-sent"},
  {"w":"desert","d":"des-ert","a":["de-sert"],"c":"heteronym","n":"sand des-ert / abandon de-sert; dessert = des-sert"},
  {"w":"minute","d":"min-ute","a":["mi-nute"],"c":"heteronym","n":"60 seconds / tiny"},
  {"w":"project","d":"proj-ect","a":["pro-ject"],"c":"heteronym"},
  {"w":"progress","d":"prog-ress","a":["pro-gress"],"c":"heteronym"},
  {"w":"easter","d":"eas-ter","a":["east-er"],"c":"heteronym","n":"publishers differ"},
  {"w":"stranger","d":"stran-ger","a":["strang-er"],"c":"heteronym","n":"publishers differ"},
  {"w":"don't","d":"don't","c":"contraction"},
  {"w":"can't","d":"can't","c":"contraction"},
  {"w":"won't","d":"won't","c":"contraction"},
  {"w":"i'm","d":"i'm","c":"contraction"},
  {"w":"i'll","d":"i'll","c":"contraction"},
  {"w":"you're","d":"you're","c":"contraction"},
  {"w":"they're","d":"they're","c":"contraction"},
  {"w":"we're","d":"we're","c":"contraction"},
  {"w":"couldn't","d":"could-n't","c":"contraction"},
  {"w":"wouldn't","d":"would-n't","c":"contraction"},
  {"w":"shouldn't","d":"should-n't","c":"contraction"},
  {"w":"didn't","d":"did-n't","c":"contraction"},
  {"w":"isn't","d":"is-n't","c":"contraction"},
  {"w":"wasn't","d":"was-n't","c":"contraction"},
  {"w":"doesn't","d":"does-n't","c":"contraction"},
  {"w":"haven't","d":"hav-en't","c":"contraction"},
  {"w":"aren't","d":"aren't","a":["ar-en't"],"c":"contraction"},
  {"w":"should've","d":"should-'ve","c":"contraction","n":"'ve carries a schwa when sung; allowed exception to the vowel-letter test"},
  {"w":"ain't","d":"ain't","c":"slang"},
  {"w":"y'all","d":"y'all","c":"slang"},
  {"w":"gonna","d":"gon-na","c":"slang"},
  {"w":"wanna","d":"wan-na","c":"slang"},
  {"w":"gotta","d":"got-ta","c":"slang"},
  {"w":"kinda","d":"kin-da","c":"slang"},
  {"w":"lemme","d":"lem-me","c":"slang"},
  {"w":"gimme","d":"gim-me","c":"slang"},
  {"w":"'cause","d":"'cause","c":"slang"},
  {"w":"runnin'","d":"run-nin'","c":"slang"},
  {"w":"nothin'","d":"noth-in'","c":"slang"},
  {"w":"lovin'","d":"lov-in'","c":"slang"},
  {"w":"o'er","d":"o'er","c":"poetic","n":"1 syllable; writer chose short form"},
  {"w":"e'er","d":"e'er","c":"poetic"},
  {"w":"ne'er","d":"ne'er","c":"poetic"},
  {"w":"heav'n","d":"heav'n","c":"poetic"},
  {"w":"'tis","d":"'tis","c":"poetic"},
  {"w":"ooh","d":"ooh","c":"vocable","n":"collapse ooooh to ooh; extra notes = extender"},
  {"w":"oh","d":"oh","c":"vocable"},
  {"w":"whoa","d":"whoa","c":"vocable"},
  {"w":"yeah","d":"yeah","c":"vocable"},
  {"w":"alright","d":"al-right","c":"vocable"},
  {"w":"christmas","d":"christ-mas","c":"proper","n":"t silent"},
  {"w":"halloween","d":"hal-low-een","c":"proper"},
  {"w":"america","d":"a-mer-i-ca","c":"proper"},
  {"w":"hawaii","d":"ha-wai-i","c":"proper"},
  {"w":"mississippi","d":"mis-sis-sip-pi","c":"proper"},
  {"w":"jesus","d":"je-sus","c":"proper"},
  {"w":"maria","d":"ma-ri-a","c":"proper"},
  {"w":"gloria","d":"glo-ri-a","c":"proper"},
  {"w":"santa","d":"san-ta","c":"proper"},
  {"w":"valentine","d":"val-en-tine","c":"proper"},
  {"w":"saturday","d":"sat-ur-day","c":"proper"}
  ];

  /* ================= state ================= */
  const curated = new Map();
  TRICKY.forEach(e => curated.set(e.w, e));
  let dict = null;                       // Map: word → 'hy-phen-a-tion'
  let loading = null;
  let storageKey = 'evm_syllable_choices_v1';
  let choices = null;                    // word → 'ev-er-y' | '' (whole)

  const SCRIPT_URL = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || '';

  /* ================= the word list ================= */
  function useWords(text) {
    const m = new Map();
    String(text || '').split('\n').forEach(line => {
      const s = line.trim();
      if (!s || s[0] === '#') return;
      m.set(s.replace(/-/g, ''), s);
    });
    dict = m;
    return m.size;
  }
  function load(url) {
    if (dict) return Promise.resolve(true);
    if (loading) return loading;
    if (typeof fetch === 'undefined') return Promise.resolve(false);
    const at = url || (SCRIPT_URL ? new URL('evm-syllables-words.txt', SCRIPT_URL).href : 'lib/evm-syllables-words.txt');
    loading = fetch(at).then(r => (r.ok ? r.text() : Promise.reject(r.status)))
      .then(t => useWords(t) > 0)
      .catch(() => { loading = null; return false; });
    return loading;
  }

  /* ================= remembered choices ================= */
  function readChoices() {
    if (choices) return choices;
    choices = {};
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
      const o = raw ? JSON.parse(raw) : null;
      if (o && typeof o === 'object') choices = o;
    } catch (e) { /* storage blocked (a school Chromebook): choices last the visit */ }
    return choices;
  }
  function choose(word, syllables) {
    const key = keyOf(word);
    if (!key) return;
    const c = readChoices();
    if (syllables === null || syllables === undefined) delete c[key];
    else c[key] = syllables.map(s => s.toLowerCase()).join('-');
    try { if (typeof localStorage !== 'undefined') localStorage.setItem(storageKey, JSON.stringify(c)); } catch (e) { /* the visit only */ }
  }
  function configure(opts) {
    if (opts && opts.storageKey && opts.storageKey !== storageKey) { storageKey = opts.storageKey; choices = null; }
  }

  /* ================= tokens ================= */
  const straight = s => s.replace(/[‘’ʼ′]/g, "'").replace(/[“”]/g, '"');
  /* lead punctuation · the word · trail punctuation (apostrophes may belong to the word: 'cause, runnin') */
  function parts(token) {
    const t = straight(String(token || ''));
    const m = t.match(/^([^A-Za-z0-9']*)(.*?)([^A-Za-z0-9']*)$/);
    return { lead: m[1].length, core: m[2], trail: m[3].length };
  }
  function keyOf(word) {
    const p = parts(word);
    return p.core.toLowerCase().replace(/^'+|'+$/g, '');
  }
  const VOWEL_LETTER = /[aeiouy]/i;

  /* ================= looking a word up =================
     Each finder returns { pieces: ['lowercase', …], alts: [[…]], source,
     confidence, note } for a lowercase key, or null. */
  function sameLetters(pieces, key) { return pieces.join('') === key; }
  function fromSplit(str) { return String(str).split('-').filter(p => p.length); }

  function findOverride(key) {
    const c = readChoices();
    if (!Object.prototype.hasOwnProperty.call(c, key)) return null;
    const pieces = fromSplit(c[key]);
    if (!sameLetters(pieces, key)) return null;
    return { pieces, alts: [], source: 'override', confidence: 'high' };
  }
  function findCurated(key) {
    const e = curated.get(key);
    if (!e) return null;
    const pieces = fromSplit(e.d);
    const alts = (e.a || []).map(fromSplit).filter(a => sameLetters(a, key) && a.join('-') !== pieces.join('-'));
    return { pieces, alts, source: 'curated', confidence: 'high', note: e.n || '' };
  }
  function findDict(key) {
    const s = dict && dict.get(key);
    return s ? { pieces: fromSplit(s), alts: [], source: 'dictionary', confidence: 'high' } : null;
  }
  /* a word we know as it stands: a choice, the tricky list, the word list */
  function known(key) { return findCurated(key) || findDict(key); }

  /* ================= derived: endings, beginnings, compounds ================= */
  const isVowel = ch => 'aeiou'.indexOf(ch) !== -1;
  const isCons = ch => !!ch && /[a-z]/.test(ch) && !isVowel(ch) && ch !== 'y';
  // a consonant + le at the end (ta-ble, twin-kle) keeps its consonant when the e goes (twin-kling)
  const consLe = p => /[^aeiouy]le$/.test(p);
  function lastPiece(pieces) { return pieces[pieces.length - 1]; }
  function withLast(pieces, last) { return pieces.slice(0, -1).concat([last]); }

  /* stem pieces + an ending: `syll` — the ending is a syllable of its own */
  function addEnding(stemPieces, ending, syll) {
    return syll ? stemPieces.concat([ending]) : withLast(stemPieces, lastPiece(stemPieces) + ending);
  }

  /* the ways a stem can sit in front of an ending, as spelling changes it.
     find(stem) → pieces or null. Each returns pieces for the whole word. */
  function deriveEnding(key, find) {
    const n = key.length;
    const ends = (s) => key.endsWith(s) && n - s.length >= 2;

    // -ing (sing-ing, run-ning, mak-ing, twin-kling, dy-ing)
    if (ends('ing')) {
      const st = key.slice(0, -3);
      let p = find(st);
      if (p) return addEnding(p, 'ing', true);
      if (st.length >= 2 && st[st.length - 1] === st[st.length - 2] && isCons(st[st.length - 1])) {
        p = find(st.slice(0, -1));
        if (p) return p.concat([st[st.length - 1] + 'ing']);
      }
      p = find(st + 'e');
      if (p) {
        const last = lastPiece(p);
        if (consLe(last) && p.length > 1) return withLast(p, last.slice(0, -1) + 'ing');   // twin-kle → twin-kling
        return addEnding(withLast(p, last.slice(0, -1)), 'ing', true);                     // make → mak-ing
      }
      if (st.endsWith('y')) {
        p = find(st.slice(0, -1) + 'ie');                                                  // die → dy-ing
        if (p) return addEnding(withLast(p, lastPiece(p).slice(0, -2) + 'y'), 'ing', true);
      }
      return null;
    }
    // -ed: a syllable of its own only after t or d (want-ed, need-ed; jumped, played, o-pened)
    if (ends('ed')) {
      const st = key.slice(0, -2);
      const syl = s => /[td]$/.test(s);
      let p = find(st);
      if (p) return addEnding(p, 'ed', syl(st));
      if (st.length >= 2 && st[st.length - 1] === st[st.length - 2] && isCons(st[st.length - 1])) {
        const c = st[st.length - 1];
        p = find(st.slice(0, -1));
        if (p) return syl(c) ? p.concat([c + 'ed']) : withLast(p, lastPiece(p) + c + 'ed');     // pat-ted, hugged
      }
      p = find(st + 'e');                                                                    // loved, cre-at-ed, fad-ed
      if (p) {
        const last = lastPiece(p);
        if (consLe(last) && p.length > 1) return withLast(p, last + 'd');                    // twin-kled
        return syl(st) ? addEnding(withLast(p, last.slice(0, -1)), 'ed', true) : withLast(p, last + 'd');
      }
      if (st.endsWith('i')) {
        p = find(st.slice(0, -1) + 'y');                                                     // cry → cried, hur-ried
        if (p) return withLast(p, lastPiece(p).slice(0, -1) + 'ied');
      }
      return null;
    }
    // -es / -s (kiss-es, box-es, pag-es, ros-es; jumps, makes, ba-bies)
    if (ends('ies')) {
      const p = find(key.slice(0, -3) + 'y');
      if (p) return withLast(p, lastPiece(p).slice(0, -1) + 'ies');
    }
    if (ends('es')) {
      const st = key.slice(0, -2);
      if (/(s|x|z|ch|sh)$/.test(st)) { const p = find(st); if (p) return addEnding(p, 'es', true); }
      if (/o$/.test(st)) { const p = find(st); if (p) return addEnding(p, 'es', false); }  // goes, he-roes
    }
    if (ends('s') && !key.endsWith('ss')) {
      const st = key.slice(0, -1);
      const p = find(st);
      if (p) {
        const last = lastPiece(p);
        if (/[^aeiou](c|g|s|z)e$/.test(st) || /[aeiou](c|g|s|z)e$/.test(st)) {
          // page → pag-es, rose → ros-es, place → plac-es: the e is sounded again
          return addEnding(withLast(p, last.slice(0, -1)), 'es', true);
        }
        return addEnding(p, 's', false);
      }
    }
    // -er / -est (small-er, big-ger, nic-er, hap-pi-er)
    for (const e of ['est', 'er']) {
      if (!ends(e)) continue;
      const st = key.slice(0, -e.length);
      let p = find(st);
      if (p) return addEnding(p, e, true);
      if (st.length >= 2 && st[st.length - 1] === st[st.length - 2] && isCons(st[st.length - 1])) {
        p = find(st.slice(0, -1));
        if (p) return p.concat([st[st.length - 1] + e]);
      }
      p = find(st + 'e');
      if (p) {
        const last = lastPiece(p);
        if (consLe(last) && p.length > 1) return withLast(p, last.slice(0, -1) + e);         // gen-tler
        return addEnding(withLast(p, last.slice(0, -1)), e, true);
      }
      if (st.endsWith('i')) {
        p = find(st.slice(0, -1) + 'y');
        if (p) return addEnding(withLast(p, lastPiece(p).slice(0, -1) + 'i'), e, true);    // hap-pi-er
      }
    }
    // -ly -ness -ful -less -ment (slow-ly, kind-ness, hope-less, gen-tly, hap-pi-ly)
    for (const e of ['ness', 'less', 'ment', 'ful', 'ly']) {
      if (!ends(e)) continue;
      const st = key.slice(0, -e.length);
      let p = find(st);
      if (p) return addEnding(p, e, true);
      if (e === 'ly') {
        p = find(st + 'le');                                                                 // gentle → gen-tly
        if (p && consLe(lastPiece(p))) return withLast(p, lastPiece(p).slice(0, -2) + 'ly');
        p = find(st + 'e');                                                                  // true → tru-ly
        if (p) return addEnding(withLast(p, lastPiece(p).slice(0, -1)), 'ly', true);
      }
      if (st.endsWith('i')) {
        p = find(st.slice(0, -1) + 'y');                                                     // hap-pi-ness, hap-pi-ly
        if (p) return addEnding(withLast(p, lastPiece(p).slice(0, -1) + 'i'), e, true);
      }
    }
    return null;
  }

  // an apostrophe ending ('s 'll 're 'd 'm 've n't) rides on the syllable before it,
  // except n't and 've after a consonant, which are sung (could-n't, should-'ve)
  function deriveApostrophe(key, find) {
    let m = key.match(/^(.+?)(n't)$/);
    if (m) {
      const base = m[1];
      const p = find(base) || guessPieces(base);
      if (!p) return null;
      if (/[aeiouy]$/.test(base) || base === 'can' || base === 'won' || base === 'ai') return withLast(p, lastPiece(p) + "n't");
      return p.concat(["n't"]);
    }
    m = key.match(/^(.+?)('s|'ll|'re|'d|'m|'ve)$/);
    if (m) {
      const base = m[1];
      const p = find(base);
      if (!p) return null;
      if (m[2] === "'ve" && isCons(base[base.length - 1])) return p.concat(["'ve"]);
      return withLast(p, lastPiece(p) + m[2]);
    }
    return null;
  }

  const PREFIXES = ['under', 'over', 'out', 'mis', 'dis', 'pre', 'non', 'un', 're', 'up'];
  function derivePrefix(key, find) {
    for (const pre of PREFIXES) {
      if (!key.startsWith(pre) || key.length - pre.length < 3) continue;
      const p = find(key.slice(pre.length));
      const pp = known(pre);
      if (p) return (pp ? pp.pieces : [pre]).concat(p);
    }
    return null;
  }
  // two known words run together (moon-beam, rain-drop, sun-flow-er); both parts 3+ letters
  function deriveCompound(key, find) {
    for (let i = key.length - 3; i >= 3; i--) {
      const a = find(key.slice(0, i));
      if (!a) continue;
      const b = find(key.slice(i));
      if (b) return a.concat(b);
    }
    return null;
  }

  /* a word, from what is known about the words inside it (depth: how far down) */
  function derive(key, depth) {
    if (depth > 2 || key.length < 4) return null;
    const find = k => {
      const hit = known(k);
      if (hit) return hit.pieces;
      const d = derive(k, depth + 1);
      return d ? d.pieces : null;
    };
    const findWord = k => { const hit = known(k); return hit ? hit.pieces : null; };
    let pieces = null;
    if (key.indexOf("'") !== -1) pieces = deriveApostrophe(key, find);
    if (!pieces) pieces = deriveEnding(key, find);
    if (!pieces) pieces = derivePrefix(key, findWord);
    if (!pieces && depth === 0) pieces = deriveCompound(key, findWord);
    if (!pieces || !sameLetters(pieces, key)) return null;
    return { pieces: tidy(pieces), alts: [], source: 'derived', confidence: 'medium' };
  }

  /* ================= guess: the spelling rules =================
     For a word nobody has listed: a name, a made-up word. The spec's rules,
     in order of what goes wrong least:
       • nuclei: runs of vowel letters (y is a vowel after a consonant),
         split where two vowels are two sounds (li-on, di-a-mond, vi-o-lin)
       • a silent e adds nothing (make, hope-less), -ed only after t or d
         (want-ed), -es only after a hiss (kiss-es, pag-es); consonant + le
         at the end is its own syllable (ta-ble)
       • between nuclei: one consonant goes right (ba-by, Ma-ri-a: open
         syllables — names mostly are), x ck ng stay left (tax-i, pick-et,
         sing-er); two different consonants split (win-ter) unless a stop
         and l or r that begin a word (a-pron, se-cret); three or more
         keep the longest beginning a word can have (hun-dred, mon-ster)
       • digraphs (ch sh th ph wh ck ng gh qu) never split; doubled
         consonants split (hap-py); common endings stay whole (-tion -sion
         -cious -tious -cial -tial -ture -sure)
       • no piece without a vowel (stre-ngth can't happen) */
  const DIGRAPHS = ['tch', 'ch', 'sh', 'th', 'ph', 'wh', 'ck', 'ng', 'gh', 'qu'];
  const ONSETS = new Set(['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'qu', 'r', 's', 't', 'v', 'w', 'y', 'z',
    'ch', 'sh', 'th', 'ph', 'wh', 'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'tr', 'sc', 'sk', 'sl', 'sm',
    'sn', 'sp', 'st', 'sw', 'tw', 'dw', 'thr', 'shr', 'str', 'spr', 'scr', 'spl', 'squ', 'sch', 'chr', 'phr', 'kn', 'wr', 'gn']);
  const BLENDS = new Set(['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'tr', 'phr', 'chr', 'thr']);
  const TWO_SOUNDS = new Set(['ia', 'io', 'iu', 'eo', 'uo', 'ii', 'ua']);
  const WHOLE_ENDINGS = ['tion', 'sion', 'cious', 'tious', 'cial', 'tial', 'ture', 'sure', 'geous', 'cian', 'tian'];

  function letterUnits(w) {
    // consonant units (digraphs whole) and single vowels, with their start index
    const units = [];
    let i = 0;
    while (i < w.length) {
      let u = null;
      if (!isVowel(w[i])) {
        for (const d of DIGRAPHS) {
          if (w.startsWith(d, i)) {
            // qu: the u is the consonant's; ng before a vowel at a word's end is sounded with it (fin-ger) — keep whole anyway
            u = d; break;
          }
        }
      }
      if (!u) u = w[i];
      units.push({ s: u, at: i });
      i += u.length;
    }
    return units;
  }
  function vowelish(units, k) {
    const u = units[k].s;
    if (u.length > 1 || !isVowel(u)) return false;
    // the u of gu before a vowel (guess, gui-tar)
    if (u === 'u' && k > 0 && units[k - 1].s === 'g' && k + 1 < units.length && isVowel(units[k + 1].s[0])) return false;
    return true;
  }

  function guessPieces(word) {
    const w = word.toLowerCase();
    if (!/[a-z]/.test(w)) return null;
    // an ending that takes no beat of its own, or one that does
    let tail = '';
    let base = w;
    const syllabicTail = [];
    let mm;
    if ((mm = base.match(/^(.+[^aeiouy])(le)(s|d)?$/)) && VOWEL_LETTER.test(mm[1])) {
      // consonant + le: the consonant goes with it (ta-ble, ap-ple), but ck stays left (pick-le)
      const stem = mm[1];
      let cut = stem.length - 1;
      if (stem.endsWith('ck')) cut = stem.length;
      const left = guessPieces(stem.slice(0, cut));
      if (left) return left.concat([stem.slice(cut) + 'le' + (mm[3] || '')]);
    }
    if ((mm = base.match(/^(.+)(ed)$/)) && VOWEL_LETTER.test(mm[1].slice(0, -1) || mm[1])) {
      const st = mm[1];
      if (/[td]$/.test(st)) { syllabicTail.unshift('ed'); base = st; }
      else { tail = 'ed' + tail; base = st; }
    } else if ((mm = base.match(/^(.+)(es)$/)) && VOWEL_LETTER.test(mm[1])) {
      const st = mm[1];
      if (/(s|x|z|ch|sh|c|g)$/.test(st)) { syllabicTail.unshift('es'); base = st; }
      else if (/[^aeiou][^aeiouy]$/.test(st + 'e') && !/[aeiouy]$/.test(st)) { tail = 'es'; base = st; }
    }
    for (const e of ['ing', 'est', 'er', 'ly', 'ness', 'less', 'ful', 'ment']) {
      if (base.endsWith(e) && VOWEL_LETTER.test(base.slice(0, -e.length)) && base.length - e.length >= 2) {
        let st = base.slice(0, -e.length);
        let ending = e;
        // a doubled consonant before -ing/-er/-est (run-ning), but not l s f z (call-ing, kiss-ing)
        if ((e === 'ing' || e === 'er' || e === 'est') && st.length >= 3 && st[st.length - 1] === st[st.length - 2] && isCons(st[st.length - 1]) && 'lsfz'.indexOf(st[st.length - 1]) === -1) {
          ending = st[st.length - 1] + e;
          st = st.slice(0, -1);
        }
        const left = guessPieces(st);
        if (left) {
          const pieces = left.concat([ending]);
          return attachTail(pieces, syllabicTail, tail);
        }
      }
    }
    // silent e at the end (make, home) — kept, but not a nucleus
    let silentE = base.length > 2 && base.endsWith('e') && !/[aeiouy]e$/.test(base) && VOWEL_LETTER.test(base.slice(0, -1));
    const units = letterUnits(base);
    const nuc = [];          // [{ from, to }] unit indexes of each vowel group
    for (let k = 0; k < units.length; k++) {
      const v = units[k].s.length === 1 && (isVowel(units[k].s) ? vowelish(units, k) : (units[k].s === 'y' && yVowel(units, k)));
      if (!v) continue;
      if (silentE && k === units.length - 1) continue;
      const prev = nuc[nuc.length - 1];
      if (prev && prev.to === k - 1) {
        const pair = units[k - 1].s + units[k].s;
        if (TWO_SOUNDS.has(pair) && !(pair === 'ua' && k >= 2 && units[k - 2].s === 'q')) nuc.push({ from: k, to: k });
        else prev.to = k;
      } else nuc.push({ from: k, to: k });
    }
    if (nuc.length <= 1) return attachTail([base], syllabicTail, tail);
    const cuts = [];         // unit index where each new syllable starts
    for (let j = 1; j < nuc.length; j++) {
      const a = nuc[j - 1].to, b = nuc[j].from;
      const cl = units.slice(a + 1, b).map(u => u.s);       // consonant units between
      let take;                                             // how many consonant units go right
      if (cl.length === 0) take = 0;
      else if (cl.length === 1) take = /^(x|ck|ng)$/.test(cl[0]) ? 0 : 1;
      else if (cl.length === 2) take = cl[0] === cl[1] ? 1 : (BLENDS.has(cl.join('')) ? 2 : 1);
      else {
        take = 1;
        for (let t = cl.length - 1; t >= 1; t--) { if (ONSETS.has(cl.slice(cl.length - t).join(''))) { take = t; break; } }
      }
      cuts.push(b - take);
    }
    const pieces = [];
    let from = 0;
    cuts.forEach(c => { pieces.push(units.slice(from, c).map(u => u.s).join('')); from = c; });
    pieces.push(units.slice(from).map(u => u.s).join(''));
    // the whole endings (na-tion, de-li-cious, pic-ture)
    const out = keepEndings(pieces.filter(p => p.length));
    return attachTail(out, syllabicTail, tail);
  }
  // y is a vowel after a consonant (fly-ing, ba-by), a consonant first or between vowels (yes, be-yond)
  function yVowel(units, k) {
    if (k === 0) return false;
    const pv = units[k - 1].s.length === 1 && isVowel(units[k - 1].s);
    const nx = units[k + 1];
    const nv = !!nx && nx.s.length === 1 && isVowel(nx.s);
    return !(pv && nv);
  }
  function attachTail(pieces, syllabicTail, tail) {
    let out = pieces.slice();
    if (tail) out = withLast(out, lastPiece(out) + tail);
    syllabicTail.forEach(t => out.push(t));
    return out;
  }
  function keepEndings(pieces) {
    const word = pieces.join('');
    for (const e of WHOLE_ENDINGS) {
      if (!word.endsWith(e) || word.length - e.length < 2) continue;
      const cut = word.length - e.length;
      let at = 0, out = [], acc = '';
      for (const p of pieces) {
        if (at + p.length <= cut) { out.push(p); at += p.length; continue; }
        if (at < cut) acc = p.slice(0, cut - at);
        at += p.length;
      }
      if (acc) {
        // the piece the ending starts in keeps its own front (na-tion: "na" + "tion")
        if (VOWEL_LETTER.test(acc)) out.push(acc);
        else if (out.length) out = withLast(out, lastPiece(out) + acc);
        else out.push(acc);
      }
      out.push(e);
      return out;
    }
    return pieces;
  }
  /* no piece without a vowel (except the sung n't and 've); none empty */
  function tidy(pieces) {
    const out = [];
    pieces.forEach(p => {
      if (!p) return;
      const ok = VOWEL_LETTER.test(p) || p === "n't" || p === "'ve";
      if (ok || !out.length) out.push(p);
      else out[out.length - 1] += p;
    });
    if (out.length > 1 && !VOWEL_LETTER.test(out[0]) && out[0] !== "n't") { out[1] = out[0] + out[1]; out.shift(); }
    return out;
  }
  function findGuess(key) {
    const g = guessPieces(key);
    if (!g) return null;
    const pieces = tidy(g);
    if (!sameLetters(pieces, key)) return { pieces: [key], alts: [], source: 'guess', confidence: 'low' };
    return { pieces, alts: [], source: 'guess', confidence: 'low' };
  }

  /* ================= split a token ================= */
  function lookup(key) {
    return findOverride(key) || findCurated(key) || findDict(key) || derive(key, 0) || findGuess(key);
  }

  /* the pieces cut from the token as typed (its capitals, its apostrophes),
     punctuation back on the first and last */
  function cutToken(token, p, lowerCore, pieces) {
    const raw = String(token);
    const core = raw.substr(p.lead, p.core.length);
    // lowerCore may differ from core only where a run was shortened (ooooh); map back
    const map = mapBack(core.toLowerCase().replace(/[‘’ʼ′]/g, "'"), lowerCore);
    const cuts = [];
    let at = 0;
    pieces.slice(0, -1).forEach(pc => { at += pc.length; cuts.push(map ? map(at) : at); });
    const out = [];
    let from = 0;
    cuts.forEach(c => { out.push(core.slice(from, c)); from = c; });
    out.push(core.slice(from));
    out[0] = raw.slice(0, p.lead) + out[0];
    out[out.length - 1] = out[out.length - 1] + raw.slice(p.lead + p.core.length);
    return out;
  }
  // where cut k of the shortened word falls in the word as typed (null: they are the same)
  function mapBack(full, short) {
    if (full === short) return null;
    const starts = [];
    let i = 0, j = 0;
    while (i < full.length && j < short.length) {
      if (full[i] === short[j]) { starts[j] = i; j++; i++; continue; }
      i++;
    }
    starts[short.length] = full.length;
    return k => (starts[k] === undefined ? full.length : starts[k]);
  }

  function split(token) {
    const p = parts(token);
    let core = p.core;
    if (!core || !/[A-Za-z]/.test(core)) return null;
    if (/[0-9]/.test(core) || /^#|\/\/|@/.test(String(token))) return null;      // numbers, tags, links: not sung splits
    if (/[-‐‑]/.test(core)) return null;                               // already split by the writer
    let lead = p.lead, trail = p.trail;
    let key = core.toLowerCase();
    // edge apostrophes that are quote marks, not part of the word ('hello' → hello)
    if (!curated.has(key) && !(dict && dict.has(key)) && /^'|'$/.test(key) && !/in'$/.test(key)) {
      const m = core.match(/^('*)(.*?)('*)$/);
      lead += m[1].length; trail += m[3].length;
      core = m[2];
      key = core.toLowerCase();
      if (!/[a-z]/.test(key)) return null;
    }
    const q = { lead, core, trail };
    let lk = key;
    // runnin' is split as running is (in' and ing are the same length)
    if (/in'$/.test(key) && !curated.has(key)) lk = key.slice(0, -1) + 'g';
    // ooooh → ooh, yeahhh → yeahh: a held sound, not more syllables
    const shortened = lk.replace(/([a-z])\1{2,}/g, '$1$1');
    let hit = null;
    if (shortened !== lk) hit = findOverride(shortened) || findCurated(shortened) || findDict(shortened) || findGuess(shortened);
    else hit = lookup(lk);
    // a word in capitals the dictionaries do not know: its letters (U-S-A, T-V, A-B-C)
    if (/^[A-Z]{2,4}$/.test(core) && (!hit || hit.source === 'guess' || hit.source === 'derived')) {
      hit = { pieces: key.split(''), alts: [], source: 'guess', confidence: 'medium', note: 'said letter by letter' };
    }
    if (!hit || hit.pieces.length < 1) return null;
    const syllables = cutToken(token, q, shortened !== lk ? shortened : key, hit.pieces);
    const result = {
      word: String(token),
      syllables,
      alts: (hit.alts || []).map(a => cutToken(token, q, key, a)),
      count: hit.pieces.length,
      source: hit.source,
      confidence: hit.confidence,
      note: hit.note || ''
    };
    // a remembered choice keeps the list's own way as an alternative
    if (hit.source === 'override') {
      const base = findCurated(key) || findDict(key) || derive(key, 0) || findGuess(key);
      if (base) {
        [base.pieces].concat(base.alts || []).forEach(a => {
          if (a.join('-') !== hit.pieces.join('-') && !result.alts.some(x => x.join('').length && x.join('-').toLowerCase() === cutToken(token, q, key, a).join('-').toLowerCase())) {
            result.alts.push(cutToken(token, q, key, a));
          }
        });
      }
    }
    return result;
  }

  /* ================= self test (the spec's section 9) ================= */
  function selfTest() {
    const failures = [];
    let pass = 0;
    const check = (ok, what) => { if (ok) pass++; else failures.push(what); };
    // 1 · every tricky word: its default exactly, its (same-spelling) alternatives offered
    TRICKY.forEach(e => {
      const r = split(e.w);
      const got = r ? r.syllables.join('-').toLowerCase() : e.w;
      check(got === e.d, e.w + ': ' + got + ' ≠ ' + e.d);
      (e.a || []).forEach(a => {
        if (a.replace(/-/g, '') !== e.w) return;
        check(!!r && r.alts.some(x => x.join('-').toLowerCase() === a), e.w + ': alternative ' + a + ' missing');
      });
    });
    // 2 · song lines (punctuation stays on, capitals kept)
    const LINES = [
      ['Twinkle, twinkle, little star', 'Twin-kle, twin-kle, lit-tle star'],
      ["My country, 'tis of thee", "My coun-try, 'tis of thee"],
      ['Amazing grace, how sweet the sound', 'A-maz-ing grace, how sweet the sound'],
      ['Mary had a little lamb', 'Mar-y had a lit-tle lamb']
    ];
    LINES.forEach(([text, want]) => {
      const got = text.split(' ').map(t => { const r = split(t); return r ? r.syllables.join('-') : t; }).join(' ');
      check(got === want, 'line: ' + got + ' ≠ ' + want);
    });
    // 3 · invariants: the syllables give the token back; none empty; each has a vowel (or is n't / 've)
    const sample = TRICKY.map(e => e.w).concat(['Hallelujah!', '“Watermelon,”', 'ooooh', 'Isabella', 'flurbish', 'zandoline', 'USA', 'runnin\'', 'kissing', 'sparkling', 'jumped', 'opened']);
    sample.forEach(t => {
      const r = split(t);
      if (!r) return;
      check(r.syllables.join('') === t, t + ': does not join back');
      check(r.syllables.every(s => s.length), t + ': an empty syllable');
      check(r.syllables.every(s => /[aeiouy]/i.test(s) || /n't|'ve/.test(s) || r.note === 'said letter by letter'), t + ': a syllable with no vowel (' + r.syllables.join('-') + ')');
    });
    return { pass, fail: failures.length, failures };
  }

  const api = { load, ready: () => !!dict, split, choose, configure, selfTest, useWords, TRICKY, _guess: guessPieces, _derive: k => derive(k, 0), _known: known };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.EVMSyllables = api;
})(typeof window !== 'undefined' ? window : null);
