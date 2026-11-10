/* ===========================================================================
   Stringed Instrument Tuner
   ---------------------------------------------------------------------------
   Three things in one page:
     1. Reference  — a box of strings you pluck with a tap or the number keys.
     2. Tune       — pick a string, play it, and the app says how close you are.
     3. Listen     — a plain chromatic tuner that names whatever it hears.

   No dependencies, no network, no samples. Every sound is built from
   oscillators at play time, so this runs from a file:// URL offline.
   =========================================================================== */
'use strict';

/* ─────────────────────────────────────────────────────────────────────────
   1 · PITCH MATHS
   Everything internally is a MIDI number (C4 = 60, A4 = 69). Frequencies are
   derived from the user's reference pitch, which is 440 Hz unless they change
   it, so a school that tunes to 442 gets 442 everywhere at once.
   ───────────────────────────────────────────────────────────────────────── */

const SEMI = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
const SHARP_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT_NAMES  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

/* "Eb2" / "F#3" / "A4"  →  MIDI number */
function midiOf(name){
  const m = /^([A-G])([#b]?)(-?\d+)$/.exec(name.trim());
  if (!m) throw new Error('bad note name: ' + name);
  const acc = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
  return (parseInt(m[3], 10) + 1) * 12 + SEMI[m[1]] + acc;
}
function freqOf(midi, a4){ return a4 * Math.pow(2, (midi - 69) / 12); }
function midiOfFreq(f, a4){ return 69 + 12 * Math.log2(f / a4); }
function centsBetween(f, ref){ return 1200 * Math.log2(f / ref); }

/* Display: keep the spelling the tuning was written in (Eb stays Eb). */
function splitName(name){
  const m = /^([A-G][#b]?)(-?\d+)$/.exec(name);
  return m ? { letter:m[1], octave:m[2] } : { letter:name, octave:'' };
}
function nameOfMidi(midi, preferFlats){
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  return (preferFlats ? FLAT_NAMES : SHARP_NAMES)[pc] + oct;
}

const INTERVALS = ['unison','minor 2nd','major 2nd','minor 3rd','major 3rd',
  'perfect 4th','tritone','perfect 5th','minor 6th','major 6th','minor 7th',
  'major 7th','octave'];
const INTERVALS_SHORT = ['1','m2','M2','m3','M3','P4','TT','P5','m6','M6','m7','M7','8ve'];

function ordinal(n){
  const s = ['th','st','nd','rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* ─────────────────────────────────────────────────────────────────────────
   2 · THE INSTRUMENTS
   Strings are listed in the instrument's OWN traditional order, each with the
   number a player would call it ("the 6th string"). The app sorts them by
   pitch for the on-screen box, so a re-entrant tuning — where a string is not
   where you would expect it — shows up honestly rather than being hidden.
   ───────────────────────────────────────────────────────────────────────── */

/* seq() — for the ordinary case: given notes low→high, the highest is the 1st
   string, as it is on nearly every instrument. */
function seq(...notes){
  const n = notes.length;
  return notes.map((note, i) => ({ n:note, t:n - i }));
}
/* ord() — for re-entrant tunings, written in traditional order, highest
   string number first. */
function ord(pairs){ return pairs.map(([note, t]) => ({ n:note, t })); }

const INSTRUMENTS = [
{
  id:'guitar', name:'Guitar (steel string)', family:'Plucked', voice:'pluck',
  tone:{ bright:0.58, decay:3.6 },
  blurb:'A guitar has six strings. Most of the gaps between them are the same ' +
        'size, called a fourth. But one gap is smaller: a third, between the 3rd ' +
        'and 2nd strings. That one odd step is why guitar chord shapes look the ' +
        'way they do.',
  care:'Turn the peg slowly. Even a quarter turn moves the pitch a long way. If a ' +
       'string is too high, take it down below the note first, then bring it back ' +
       'up. The string is then pulling against the peg, so it is less likely to slip.',
  tunings:[
    { id:'standard', name:'Standard — E A D G B E', strings:seq('E2','A2','D3','G3','B3','E4'),
      note:'Almost all guitar music is written for this tuning.' },
    { id:'dropd', name:'Drop D — D A D G B E', strings:seq('D2','A2','D3','G3','B3','E4'),
      note:'Only the lowest string changes. The E drops to D, one whole step ' +
           'lower. You get a deep low D, and you can play a power chord with one finger.' },
    { id:'halfstep', name:'Half step down — Eb Ab Db Gb Bb Eb',
      strings:seq('Eb2','Ab2','Db3','Gb3','Bb3','Eb4'),
      note:'Every string goes down one semitone. The strings feel looser, so they ' +
           'are easier to bend. Singers often like this tuning too, because it sits lower.' },
    { id:'dadgad', name:'DADGAD — D A D G A D', strings:seq('D2','A2','D3','G3','A3','D4'),
      note:'This tuning rings and sounds open, and Celtic players use it a lot. ' +
           'Strum it with no fingers down and you get a Dsus4 chord.' },
    { id:'openg', name:'Open G — D G D G B D', strings:seq('D2','G2','D3','G3','B3','D4'),
      note:'The open strings already make a G major chord. Lay one finger flat ' +
           'across them all and you get any major chord you want. Slide players love it.' },
    { id:'opend', name:'Open D — D A D F# A D', strings:seq('D2','A2','D3','F#3','A3','D4'),
      note:'The open strings already make a D major chord.' }
  ]
},
{
  id:'classical', name:'Classical guitar (nylon)', family:'Plucked', voice:'pluck',
  tone:{ bright:0.36, decay:2.9 },
  blurb:'A classical guitar is tuned exactly like a steel-string guitar. Its ' +
        'strings are nylon instead of steel, so they feel softer and are much ' +
        'kinder to new fingers.',
  care:'New nylon strings stretch a lot. A new set may need tuning several times a ' +
       'day for the first week, which is normal and does not mean anything is broken.',
  tunings:[
    { id:'standard', name:'Standard — E A D G B E', strings:seq('E2','A2','D3','G3','B3','E4') },
    { id:'dropd', name:'Drop D — D A D G B E', strings:seq('D2','A2','D3','G3','B3','E4') }
  ]
},
{
  id:'guitar7', name:'7-string guitar', family:'Plucked', voice:'pluck',
  tone:{ bright:0.6, decay:3.8 },
  blurb:'This guitar adds a seventh string below the low E. The extra string is a ' +
        'B, a fourth lower. It reaches down almost as far as a bass guitar.',
  tunings:[ { id:'standard', name:'Standard — B E A D G B E',
    strings:seq('B1','E2','A2','D3','G3','B3','E4') } ]
},
{
  id:'guitar12', name:'12-string guitar', family:'Plucked', voice:'pluck',
  tone:{ bright:0.66, decay:3.4 },
  blurb:'A 12-string has six pairs of strings. Each pair is called a course. On ' +
        'the four lowest courses, the second string is tuned one octave higher than ' +
        'the first. That is where the bright, shimmering sound comes from. The top ' +
        'two courses have both strings on the same note.',
  care:'Tune the thick string of a pair first. Then tune its partner to match. ' +
       'When two strings are close but not quite the same, you hear a wobble called ' +
       'beating. Keep tuning until the wobble slows down and stops.',
  tunings:[ { id:'standard', name:'Standard — six courses', strings:[
      { n:'E2', t:6, pair:'E3' }, { n:'A2', t:5, pair:'A3' }, { n:'D3', t:4, pair:'D4' },
      { n:'G3', t:3, pair:'G4' }, { n:'B3', t:2, pair:'B3' }, { n:'E4', t:1, pair:'E4' }
  ] } ]
},
{
  id:'ukulele', name:'Ukulele (soprano / concert / tenor)', family:'Plucked', voice:'pluck',
  tone:{ bright:0.44, decay:1.9 },
  blurb:'Here is the surprise: on a normal ukulele, the string nearest your face ' +
        'is not the lowest one. It is a high G, and it sounds higher than the C ' +
        'right beside it. When a tuning jumps back up like that, we call it ' +
        're-entrant. It is why a strummed ukulele sounds so bright and bouncy.',
  care:'Ukulele strings are short and not very tight, so a tiny turn of the peg ' +
       'changes the note a lot. Move the peg as little as you can.',
  tunings:[
    { id:'standard', name:'Standard, high G — G C E A',
      strings:ord([['G4',4],['C4',3],['E4',2],['A4',1]]),
      note:'Nearly every ukulele comes tuned this way. The high G is what makes a ' +
           'strummed chord sound bright and jangly instead of heavy.' },
    { id:'lowg', name:'Low G — G C E A', strings:ord([['G3',4],['C4',3],['E4',2],['A4',1]]),
      note:'The same note names, but the G drops one octave. Now the strings run ' +
           'low to high, like a guitar. Players pick this when they want a fuller sound.' },
    { id:'dtuning', name:'Old D tuning — A D F# B',
      strings:ord([['A4',4],['D4',3],['F#4',2],['B4',1]]),
      note:'One whole step above standard tuning. This was the normal ukulele ' +
           'tuning in the 1920s and 1930s, and old sheet music often expects it.' }
  ]
},
{
  id:'ukebari', name:'Baritone ukulele', family:'Plucked', voice:'pluck',
  tone:{ bright:0.42, decay:2.3 },
  blurb:'A baritone ukulele is tuned D G B E. Those are the same four notes as the ' +
        'top four strings of a guitar. If you play guitar, you already know its ' +
        'chord shapes.',
  tunings:[ { id:'standard', name:'Standard — D G B E', strings:seq('D3','G3','B3','E4') } ]
},
{
  id:'violin', name:'Violin', family:'Bowed', voice:'bow',
  tone:{ bright:0.62, decay:0 },
  blurb:'Every pair of strings on a violin is a fifth apart, so all the gaps are ' +
        'the same size. That even spacing is the pattern behind the whole violin ' +
        'family, and it lets one hand reach a lot of notes.',
  care:'Use the big pegs for large changes, and the small fine tuners near the ' +
       'tailpiece for the last little bit. Push the peg gently IN while you turn it, ' +
       'or it will slip straight back. Always tune with the bow rather than a pluck, ' +
       'because a plucked string reads a tiny bit high.',
  tunings:[
    { id:'standard', name:'Standard — G D A E', strings:seq('G3','D4','A4','E5'),
      note:'Tune the A string first. An orchestra takes its pitch from the A, and ' +
           'you check every other string against it.' } ]
},
{
  id:'violin5', name:'Five-string violin', family:'Bowed', voice:'bow',
  tone:{ bright:0.6, decay:0 },
  blurb:'This violin has a low C string added underneath, so one instrument covers ' +
        'both the violin and the viola range. Fiddle and jazz players like them.',
  tunings:[ { id:'standard', name:'Standard — C G D A E',
    strings:seq('C3','G3','D4','A4','E5') } ]
},
{
  id:'viola', name:'Viola', family:'Bowed', voice:'bow',
  tone:{ bright:0.5, decay:0 },
  blurb:'A viola is tuned in fifths, just like a violin, but the whole instrument ' +
        'sits a fifth lower. Take away the violin\'s top E, add a low C, and you have ' +
        'a viola. Viola music uses its own clef, called the alto clef.',
  care:'The same as a violin. Pegs for big changes, fine tuners for the last few ' +
       'cents, and always tune with the bow.',
  tunings:[ { id:'standard', name:'Standard — C G D A', strings:seq('C3','G3','D4','A4') } ]
},
{
  id:'cello', name:'Cello', family:'Bowed', voice:'bow',
  tone:{ bright:0.46, decay:0 },
  blurb:'A cello uses the same four note names as a viola: C G D A. It just sounds ' +
        'one whole octave lower. The strings are a fifth apart, all the way up.',
  care:'Cello pegs are stiff. Sit down and hold the cello in playing position while ' +
       'you tune. Use the fine tuners for small changes, and bow steadily near the ' +
       'bridge so the tuner hears one clear note.',
  tunings:[ { id:'standard', name:'Standard — C G D A', strings:seq('C2','G2','D3','A3') } ]
},
{
  id:'dbass', name:'Double bass', family:'Bowed', voice:'bow',
  tone:{ bright:0.34, decay:0 },
  blurb:'The double bass is the odd one out in the string family. It is tuned in ' +
        'fourths, like a guitar, not in fifths. Its strings are so long that fifths ' +
        'would spread your fingers much too far apart. It also sounds one octave ' +
        'lower than it is written.',
  care:'The lowest strings take a while to settle, so give each note a long, steady ' +
       'bow and wait for the number to stop moving before you decide.',
  tunings:[
    { id:'standard', name:'Orchestral — E A D G', strings:seq('E1','A1','D2','G2') },
    { id:'solo', name:'Solo tuning — F# B E A', strings:seq('F#1','B1','E2','A2'),
      note:'One whole step above orchestral tuning. Soloists often tune this way ' +
           'so the bass sings out over the orchestra.' }
  ]
},
{
  id:'bassguitar', name:'Bass guitar', family:'Plucked', voice:'pluck',
  tone:{ bright:0.33, decay:3.4 },
  blurb:'A bass guitar is tuned E A D G. Those are the lowest four strings of a ' +
        'guitar, one octave down. Like the double bass, it sounds one octave lower ' +
        'than it is written.',
  care:'Low strings take a moment to settle. Pluck near the neck rather than the ' +
       'bridge, and let the note ring before you read the needle.',
  tunings:[
    { id:'standard', name:'4-string — E A D G', strings:seq('E1','A1','D2','G2') },
    { id:'five', name:'5-string — B E A D G', strings:seq('B0','E1','A1','D2','G2'),
      note:'That low B is about 31 Hz. It is close to the lowest sound people can ' +
           'hear as a note at all.' },
    { id:'dropd', name:'Drop D — D A D G', strings:seq('D1','A1','D2','G2') }
  ]
},
{
  id:'banjo5', name:'Banjo (5-string)', family:'Plucked', voice:'pluck',
  tone:{ bright:0.84, decay:1.7 },
  blurb:'A 5-string banjo has a short extra string with its own peg halfway up the ' +
        'neck. It is called the 5th string, and it sits on the far left. On every ' +
        'other instrument that spot holds the lowest note. On a banjo it holds the ' +
        'HIGHEST one. It is a drone, which means it rings the same note over and ' +
        'over. Look for the thinnest string in the box, sitting right where you ' +
        'would expect the thickest.',
  care:'The peg for the 5th string is small and touchy. Banjo heads react to the ' +
       'weather too, so expect to retune when you move from a cold room to a warm one.',
  tunings:[
    { id:'openg', name:'Open G — g D G B D', strings:ord([['G4',5],['D3',4],['G3',3],['B3',2],['D4',1]]),
      note:'The four long strings make a G major chord on their own. This is the ' +
           'normal bluegrass tuning.' },
    { id:'doublec', name:'Double C — g C G C D', strings:ord([['G4',5],['C3',4],['G3',3],['C4',2],['D4',1]]),
      note:'An old-time tuning. It has two C strings, one octave apart.' }
  ]
},
{
  id:'banjotenor', name:'Tenor banjo', family:'Plucked', voice:'pluck',
  tone:{ bright:0.8, decay:1.6 },
  blurb:'This banjo has four strings and no drone, and you play it with a pick. ' +
        'Standard tenor tuning is in fifths, like a viola. Irish players tune it one ' +
        'octave below a fiddle so they can play the same tunes.',
  tunings:[
    { id:'standard', name:'Standard — C G D A', strings:seq('C3','G3','D4','A4') },
    { id:'irish', name:'Irish — G D A E', strings:seq('G2','D3','A3','E4'),
      note:'Exactly one octave below a violin, so fiddle tunes use the same fingerings.' }
  ]
},
{
  id:'banjoplectrum', name:'Plectrum banjo', family:'Plucked', voice:'pluck',
  tone:{ bright:0.8, decay:1.8 },
  blurb:'A four-string banjo with a long neck. It is tuned like a 5-string banjo ' +
        'with the drone string taken off.',
  tunings:[ { id:'standard', name:'Standard — C G B D', strings:seq('C3','G3','B3','D4') } ]
},
{
  id:'mandolin', name:'Mandolin', family:'Plucked', voice:'pluck',
  tone:{ bright:0.74, decay:1.5 },
  blurb:'A mandolin is tuned G D A E, the same as a violin. It has eight strings, ' +
        'but they are really four pairs. Both strings in a pair are tuned to exactly ' +
        'the same note. Two strings ringing together give the mandolin its sparkle.',
  care:'Tune one string of a pair, then bring its partner to match. If you hear a ' +
       'wobble between them, they are not quite the same. Keep going until the ' +
       'wobble slows down and stops.',
  tunings:[ { id:'standard', name:'Standard — G D A E', strings:seq('G3','D4','A4','E5') } ]
},
{
  id:'mandola', name:'Mandola', family:'Plucked', voice:'pluck',
  tone:{ bright:0.68, decay:1.7 },
  blurb:'A bigger mandolin, tuned a fifth lower at C G D A. Those are the same ' +
        'notes as a viola.',
  tunings:[ { id:'standard', name:'Standard — C G D A', strings:seq('C3','G3','D4','A4') } ]
},
{
  id:'octmandolin', name:'Octave mandolin', family:'Plucked', voice:'pluck',
  tone:{ bright:0.66, decay:2.0 },
  blurb:'Tuned G D A E like a mandolin, but one whole octave lower.',
  tunings:[ { id:'standard', name:'Standard — G D A E', strings:seq('G2','D3','A3','E4') } ]
},
{
  id:'mandocello', name:'Mandocello', family:'Plucked', voice:'pluck',
  tone:{ bright:0.5, decay:2.6 },
  blurb:'The biggest of the mandolin family. It is tuned C G D A, like a cello.',
  tunings:[ { id:'standard', name:'Standard — C G D A', strings:seq('C2','G2','D3','A3') } ]
},
{
  id:'tenorguitar', name:'Tenor guitar', family:'Plucked', voice:'pluck',
  tone:{ bright:0.58, decay:2.8 },
  blurb:'A small guitar with four strings. It has three common tunings, which is ' +
        'unusual. Players pick whichever one matches an instrument they already play.',
  tunings:[
    { id:'standard', name:'Standard — C G D A', strings:seq('C3','G3','D4','A4'),
      note:'Tuned in fifths, like a tenor banjo or a viola.' },
    { id:'irish', name:'Irish — G D A E', strings:seq('G2','D3','A3','E4'),
      note:'One octave below a fiddle.' },
    { id:'chicago', name:'Chicago — D G B E', strings:seq('D3','G3','B3','E4'),
      note:'These are the top four guitar strings, so guitar chord shapes work ' +
           'straight away.' }
  ]
},
{
  id:'bouzouki', name:'Irish bouzouki', family:'Plucked', voice:'pluck',
  tone:{ bright:0.64, decay:2.7 },
  blurb:'A long-necked instrument with four pairs of strings. Players use it to ' +
        'back Irish dance tunes. It came over from Greece in the 1960s, and Irish ' +
        'players soon retuned it to suit their own music.',
  tunings:[
    { id:'gdad', name:'G D A D', strings:seq('G2','D3','A3','D4'),
      note:'The most common Irish tuning. The repeated D rings like a drone behind ' +
           'the tune.' },
    { id:'gdae', name:'G D A E', strings:seq('G2','D3','A3','E4'),
      note:'Tuned in fifths, one octave below a fiddle.' }
  ]
},
{
  id:'gamba', name:'Viola da gamba (bass viol)', family:'Bowed', voice:'bow',
  tone:{ bright:0.52, decay:0 },
  blurb:'An older cousin of the cello. You hold it between your knees, and gamba ' +
        'is the Italian word for leg. It has six strings, tuned in fourths with one ' +
        'third in the middle. That is much closer to a guitar than to a cello. It ' +
        'even has frets, made of gut and tied around the neck.',
  care:'Gut strings react to the room around them. Baroque groups often tune to ' +
       'A = 415 Hz, one semitone below modern pitch. You can set that in Settings.',
  tunings:[ { id:'standard', name:'Standard — D G C E A D',
    strings:seq('D2','G2','C3','E3','A3','D4') } ]
},
{
  id:'dulcimer', name:'Mountain dulcimer', family:'Plucked', voice:'pluck',
  tone:{ bright:0.5, decay:2.4 },
  blurb:'An Appalachian instrument that you play flat on your lap. Its strings have ' +
        'names instead of numbers. You play the tune on the melody string. The drone ' +
        'strings just ring underneath the whole time.',
  tunings:[
    { id:'dad', name:'D-A-d', strings:[
        { n:'D3', t:3, label:'Bass' }, { n:'A3', t:2, label:'Middle' }, { n:'D4', t:1, label:'Melody' } ],
      note:'The usual modern tuning. The bass and melody strings are one octave apart.' },
    { id:'daa', name:'D-A-A', strings:[
        { n:'D3', t:3, label:'Bass' }, { n:'A3', t:2, label:'Middle' }, { n:'A3', t:1, label:'Melody' } ],
      note:'An older tuning. The melody string matches the middle drone.' }
  ]
},
{
  id:'balalaika', name:'Balalaika (prima)', family:'Plucked', voice:'pluck',
  tone:{ bright:0.6, decay:1.4 },
  blurb:'The triangular Russian instrument. Two of its three strings are tuned to ' +
        'the SAME note, both E. The third is an A, a fourth above. Two strings on ' +
        'one note is very unusual, and it makes the balalaika ring.',
  tunings:[ { id:'standard', name:'Standard — E E A', strings:ord([['E4',3],['E4',2],['A4',1]]),
    note:'Tune the two E strings to each other until the wobble between them stops.' } ]
},
{
  id:'erhu', name:'Erhu', family:'Bowed', voice:'bow',
  tone:{ bright:0.58, decay:0 },
  blurb:'A Chinese bowed instrument with only two strings. They are a fifth apart, ' +
        'like the middle two strings of a violin. The bow hair runs BETWEEN the ' +
        'strings and never comes off them. There is no fingerboard either, so the ' +
        'player presses the string in mid-air.',
  tunings:[ { id:'standard', name:'Standard — D A', strings:seq('D4','A4'),
    note:'Called the inner string (D) and the outer string (A).' } ]
}
];

/* ── derived helpers ───────────────────────────────────────────────────── */

/* One row per string, in the order you see them when the instrument is in front
   of you: the highest-numbered string on the left, the 1st string on the right.
   That is a guitar's E A D G B E, and it is also a ukulele's G C E A — where the
   G is a HIGHER note than the C beside it. Pitch order and playing order are
   not the same thing, and the box shows playing order.
   The number keys follow the same left-to-right run. */
function stringsOf(inst, tuning, a4){
  return tuning.strings
    .map((s, i) => {
      const midi = midiOf(s.n);
      return {
        srcIndex:i, note:s.n, midi, freq:freqOf(midi, a4),
        trad:s.t, label:s.label || null,
        pair:s.pair || null,
        pairMidi:s.pair ? midiOf(s.pair) : null,
        display:splitName(s.n)
      };
    })
    .sort((a, b) => b.trad - a.trad)
    .map((s, i) => Object.assign(s, { key:i + 1 }));
}

/* lowest- and highest-sounding string, which is now a different question from
   leftmost and rightmost */
function lowestOf(rows){ return rows.reduce((a, b) => b.midi < a.midi ? b : a); }
function highestOf(rows){ return rows.reduce((a, b) => b.midi > a.midi ? b : a); }

/* Is this tuning re-entrant — does a string sit out of pitch order? */
function isReentrant(tuning){
  const t = tuning.strings.map(s => ({ t:s.t, m:midiOf(s.n) }))
    .sort((a, b) => b.t - a.t);          /* traditional order: highest number first */
  for (let i = 1; i < t.length; i++) if (t[i].m < t[i - 1].m) return true;
  return false;
}

/* Describe the gaps between neighbouring strings in one plain sentence.
   Rows are in playing order, so a gap can be negative on a re-entrant tuning. */
function describePattern(rows){
  if (rows.length < 2) return '';
  const gaps = [];
  for (let i = 1; i < rows.length; i++) gaps.push(rows[i].midi - rows[i - 1].midi);
  if (gaps.some(g => g < 0)) return '';        /* the teach panel says it better */
  const uniq = [...new Set(gaps)];
  if (uniq.length === 1){
    const g = uniq[0];
    if (g === 7) return 'Every string is a perfect 5th above the one below it.';
    if (g === 5) return 'Every string is a perfect 4th above the one below it.';
    if (g === 0) return 'All the strings are tuned to the same note.';
    return 'Every string is a ' + INTERVALS[g] + ' above the one below it.';
  }
  const counts = {};
  gaps.forEach(g => counts[g] = (counts[g] || 0) + 1);
  const main = +Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const odd = gaps.map((g, i) => ({ g, i })).filter(x => x.g !== main);
  /* "mostly fourths with one third" only means anything when the main interval
     actually repeats — on a three-string instrument it does not. */
  if (odd.length === 1 && counts[main] >= 2){
    const o = odd[0];
    return 'Mostly ' + INTERVALS[main] + 's, with one ' + INTERVALS[o.g] +
      ' between the ' + rows[o.i].note + ' and the ' + rows[o.i + 1].note + ' string.';
  }
  const names = gaps.map(g => g === 0 ? 'the same note again' : 'a ' + INTERVALS[g]);
  return 'Going up from the lowest string: ' +
    (names.length > 1 ? names.slice(0, -1).join(', ') + ', then ' + names[names.length - 1]
                      : names[0]) + '.';
}

/* Thicker line = lower string. Wound strings get a visible winding. */
function wireWidth(midi){ return 13 * Math.pow(0.5, (midi - 24) / 14) + 1.9; }
function isWound(midi){ return midi < 56; }

/* ─────────────────────────────────────────────────────────────────────────
   3 · SOUND
   Additive synthesis: one sine oscillator per harmonic, at exact whole-number
   multiples of the fundamental. Exactness matters here in a way it does not
   in an ordinary instrument app — the whole point is that the note is right.
   The character comes from how loud each harmonic is and how fast it fades:
   a plucked string loses its high harmonics quickly, a bowed one holds them.
   ───────────────────────────────────────────────────────────────────────── */

const Audio_ = {
  ctx:null, master:null, comp:null, wet:null, dry:null,
  voices:new Map(),          /* key → live voice */
  volume:0.75,

  ensure(){
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();

    this.comp = this.ctx.createDynamicsCompressor();
    this.comp.threshold.value = -14; this.comp.knee.value = 24;
    this.comp.ratio.value = 3.2;     this.comp.attack.value = 0.006;
    this.comp.release.value = 0.22;

    this.master = this.ctx.createGain();
    this.master.gain.value = this.volume;

    /* A short, soft room. Without it the tone sounds bare and clinical; with
       too much of it you cannot hear the beating between two close pitches,
       which is exactly what a student is listening for. So: a little. */
    const conv = this.ctx.createConvolver();
    conv.buffer = this._room(1.5, 2.6);
    this.wet = this.ctx.createGain(); this.wet.gain.value = 0.17;
    this.dry = this.ctx.createGain(); this.dry.gain.value = 1;

    this.master.connect(this.dry).connect(this.comp);
    this.master.connect(conv).connect(this.wet).connect(this.comp);
    this.comp.connect(this.ctx.destination);
    return this.ctx;
  },

  _room(seconds, decay){
    const sr = this.ctx.sampleRate, len = Math.floor(sr * seconds);
    const buf = this.ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++){
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++){
        const t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) * (i < sr * 0.01 ? t * 100 : 1);
      }
    }
    return buf;
  },

  resume(){
    const c = this.ensure();
    /* Browsers hold the audio context shut until the page has been touched.
       resume() rejects if it is called too early; that is not an error worth
       showing anyone, the next tap will open it. */
    if (c.state === 'suspended'){ const p = c.resume(); if (p && p.catch) p.catch(() => {}); }
    return c;
  },
  setVolume(v){ this.volume = v; if (this.master) this.master.gain.value = v; },

  /* ---- one note ------------------------------------------------------- */
  /* freqs   : array of fundamentals (a 12-string course is two)
     opts    : { voice:'pluck'|'bow', bright, decay, hold, seconds, key }      */
  play(freqs, opts){
    const ctx = this.resume(), t0 = ctx.currentTime + 0.01;
    this.stop(opts.key, 0.04);

    const out = ctx.createGain();
    out.gain.value = 1;
    out.connect(this.master);

    const parts = [];
    const tail = freqs.map(f => this._oneString(f, out, t0, opts, parts));
    const endsAt = opts.hold ? Infinity : t0 + Math.max(...tail);

    const voice = { out, parts, endsAt, hold:!!opts.hold, key:opts.key, freqs };
    this.voices.set(opts.key, voice);

    if (!opts.hold){
      const ms = (endsAt - ctx.currentTime) * 1000 + 120;
      voice.timer = setTimeout(() => {
        if (this.voices.get(opts.key) === voice){ this.voices.delete(opts.key); this._onchange(); }
      }, ms);
    }
    this._onchange();
    return voice;
  },

  _oneString(f, out, t0, opts, parts){
    const ctx = this.ctx, bowed = opts.voice === 'bow', bright = opts.bright;
    const nyq = ctx.sampleRate / 2;
    const maxN = Math.max(1, Math.min(bowed ? 20 : 16, Math.floor(nyq * 0.92 / f)));

    /* How fast the harmonics fall away. A bowed string keeps far more of them,
       which is why a cello sounds rich held still and a guitar sounds rich
       only for the first moment. */
    const rolloff = bowed ? (0.85 + (1 - bright) * 1.0) : (1.15 + (1 - bright) * 1.5);

    /* Very low strings need their fundamental lifted: small speakers and phone
       speakers cannot reproduce 30 Hz at all, and the student would hear
       nothing. Boosting the 2nd and 3rd harmonic gives the ear enough to
       construct the missing fundamental for itself. */
    const lowLift = f < 70 ? Math.min(1, (70 - f) / 45) : 0;

    const body = ctx.createBiquadFilter();
    body.type = 'lowpass';
    body.frequency.value = Math.min(f * (bowed ? 18 : 14), 11000);
    body.Q.value = 0.6;
    body.connect(out);

    let longest = 0;

    for (let n = 1; n <= maxN; n++){
      let amp = Math.pow(n, -rolloff);
      if (lowLift){
        if (n === 1) amp *= 1 - lowLift * 0.45;
        if (n === 2) amp *= 1 + lowLift * 1.5;
        if (n === 3) amp *= 1 + lowLift * 1.1;
      }
      /* a touch of extra body on the 2nd and 3rd for plucked strings */
      if (!bowed && n === 2) amp *= 1.12;
      if (amp < 0.0016) break;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f * n;      /* exact. never detuned. */

      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t0);
      osc.connect(g).connect(body);
      osc.start(t0);                    /* start before scheduling any stop */

      const level = amp * (bowed ? 0.30 : 0.36);

      if (bowed){
        const attack = 0.055 + 0.05 * Math.min(1, 220 / f) + n * 0.004;
        g.gain.linearRampToValueAtTime(level, t0 + attack);
        if (!opts.hold){
          const dur = opts.seconds;
          g.gain.setValueAtTime(level, t0 + Math.max(attack, dur - 0.28));
          g.gain.exponentialRampToValueAtTime(level * 0.0009, t0 + dur);
          osc.stop(t0 + dur + 0.06);
          longest = Math.max(longest, dur + 0.06);
        }
      } else {
        /* higher harmonics die away sooner — this is the sound of a pluck */
        const dec = Math.max(0.09, opts.decay / (1 + 0.5 * Math.pow(n - 1, 0.92)));
        const dur = opts.hold ? 0 : Math.min(dec, opts.seconds);
        g.gain.linearRampToValueAtTime(level, t0 + 0.004 + n * 0.0006);
        if (opts.hold){
          /* held: let it settle to a steady, slightly quieter sustain */
          g.gain.exponentialRampToValueAtTime(Math.max(level * 0.34, 1e-4), t0 + dec * 0.5);
        } else {
          g.gain.exponentialRampToValueAtTime(Math.max(level * 0.0009, 1e-5), t0 + dur);
          osc.stop(t0 + dur + 0.06);
          longest = Math.max(longest, dur + 0.06);
        }
      }
      parts.push({ osc, gain:g, level });
    }

    /* the noise of the thing being played: a pick scrape, or bow hair */
    const noise = ctx.createBufferSource();
    noise.buffer = this._noise(bowed ? 1.2 : 0.09);
    noise.loop = bowed;
    const nf = ctx.createBiquadFilter();
    nf.type = 'bandpass'; nf.frequency.value = Math.min(f * (bowed ? 5 : 7), 9000);
    nf.Q.value = bowed ? 0.8 : 1.6;
    const ng = ctx.createGain();
    noise.connect(nf).connect(ng).connect(out);
    noise.start(t0);                    /* likewise: start, then schedule the stop */

    if (bowed){
      ng.gain.setValueAtTime(0, t0);
      ng.gain.linearRampToValueAtTime(0.016, t0 + 0.09);
      if (!opts.hold){
        ng.gain.setValueAtTime(0.016, t0 + Math.max(0.1, opts.seconds - 0.28));
        ng.gain.exponentialRampToValueAtTime(0.0004, t0 + opts.seconds);
        noise.stop(t0 + opts.seconds + 0.06);
      }
    } else {
      ng.gain.setValueAtTime(0.05 * (0.5 + bright), t0);
      ng.gain.exponentialRampToValueAtTime(0.0004, t0 + 0.07);
      noise.stop(t0 + 0.12);
    }
    parts.push({ osc:noise, gain:ng, level:0, isNoise:true });

    /* a bowed note is never perfectly even — a slow, shallow swell keeps it
       from sounding like a test tone, without moving the pitch at all */
    if (bowed){
      const lfo = ctx.createOscillator(); lfo.frequency.value = 4.6;
      const lg = ctx.createGain(); lg.gain.value = 0.022;
      const trem = ctx.createGain(); trem.gain.value = 1;
      lfo.connect(lg).connect(trem.gain);
      body.disconnect(); body.connect(trem); trem.connect(out);
      lfo.start(t0);
      if (!opts.hold) lfo.stop(t0 + opts.seconds + 0.1);
      parts.push({ osc:lfo, gain:lg, level:0, isLfo:true });
    }
    return longest || (opts.seconds + 0.1);
  },

  _noise(seconds){
    const sr = this.ctx.sampleRate, len = Math.max(1, Math.floor(sr * seconds));
    const b = this.ctx.createBuffer(1, len, sr);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return b;
  },

  stop(key, release){
    const v = this.voices.get(key);
    if (!v) return;
    this._release(v, release === undefined ? 0.14 : release);
    this.voices.delete(key);
    this._onchange();
  },
  stopAll(release){
    [...this.voices.keys()].forEach(k => this.stop(k, release));
  },
  _release(v, r){
    const ctx = this.ctx, t = ctx.currentTime;
    if (v.timer) clearTimeout(v.timer);
    try{
      v.out.gain.cancelScheduledValues(t);
      v.out.gain.setValueAtTime(v.out.gain.value, t);
      v.out.gain.exponentialRampToValueAtTime(0.0001, t + r);
    }catch(e){}
    v.parts.forEach(p => { try{ p.osc.stop(t + r + 0.03); }catch(e){} });
    setTimeout(() => { try{ v.out.disconnect(); }catch(e){} }, (r + 0.1) * 1000);
  },

  isSounding(key){ return this.voices.has(key); },
  anySounding(){ return this.voices.size > 0; },
  onchange:null,
  _onchange(){ if (this.onchange) this.onchange(); }
};

/* ─────────────────────────────────────────────────────────────────────────
   4 · HEARING A PITCH
   The detector is a YIN-style difference function computed through an FFT.
   Two details do most of the work:

   · The signal is decimated to about 12 kHz first. Nothing above 6 kHz helps
     you find a fundamental, and the smaller buffer makes everything fast
     enough to run many times a second on a phone.

   · Once a rough period is found, it is measured again across as many periods
     as fit in the window and divided back down. Measuring one period gives
     you a few cents of error; measuring twenty gives you a fraction of one.
     That is the difference between "about right" and a tuner you can trust.
   ───────────────────────────────────────────────────────────────────────── */

/* ---- a small radix-2 FFT, one table per size ------------------------- */
const _fftCache = new Map();
function getFFT(n){
  let f = _fftCache.get(n);
  if (f) return f;
  const levels = Math.log2(n) | 0;
  const rev = new Uint32Array(n), cos = new Float32Array(n / 2), sin = new Float32Array(n / 2);
  for (let i = 0; i < n; i++){
    let x = i, r = 0;
    for (let j = 0; j < levels; j++){ r = (r << 1) | (x & 1); x >>= 1; }
    rev[i] = r;
  }
  for (let i = 0; i < n / 2; i++){
    cos[i] = Math.cos(2 * Math.PI * i / n);
    sin[i] = Math.sin(2 * Math.PI * i / n);
  }
  f = { n, levels, rev, cos, sin,
    forward(re, im){
      const { n, rev, cos, sin } = this;
      for (let i = 0; i < n; i++){
        const j = rev[i];
        if (j > i){ let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
      }
      for (let size = 2; size <= n; size *= 2){
        const half = size / 2, step = n / size;
        for (let i = 0; i < n; i += size){
          for (let j = i, k = 0; j < i + half; j++, k += step){
            const l = j + half;
            const tre =  re[l] * cos[k] + im[l] * sin[k];
            const tim = -re[l] * sin[k] + im[l] * cos[k];
            re[l] = re[j] - tre; im[l] = im[j] - tim;
            re[j] += tre;        im[j] += tim;
          }
        }
      }
    },
    inverse(re, im){
      this.forward(im, re);                       /* swap = conjugate trick */
      const s = 1 / this.n;
      for (let i = 0; i < this.n; i++){ re[i] *= s; im[i] *= s; }
    }
  };
  _fftCache.set(n, f);
  return f;
}

/* ---- decimation --------------------------------------------------------- */
const _firCache = new Map();
function getFIR(factor){
  let h = _firCache.get(factor);
  if (h) return h;
  const taps = 33, fc = 0.45 / factor, mid = (taps - 1) / 2;
  h = new Float32Array(taps);
  let sum = 0;
  for (let i = 0; i < taps; i++){
    const x = i - mid;
    const sinc = x === 0 ? 2 * fc : Math.sin(2 * Math.PI * fc * x) / (Math.PI * x);
    const win = 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (taps - 1));
    h[i] = sinc * win; sum += h[i];
  }
  for (let i = 0; i < taps; i++) h[i] /= sum;
  _firCache.set(factor, h);
  return h;
}

const _scratch = {};
function scratch(name, n){
  const k = name + n;
  if (!_scratch[k] || _scratch[k].length !== n) _scratch[k] = new Float32Array(n);
  return _scratch[k];
}

/* buf: newest `use` samples of the time-domain signal.
   Returns { freq, clarity, rms } or { freq:0, ... } when nothing is playing. */
function detectPitch(buf, use, sr, minFreq, maxFreq){
  const start = buf.length - use;

  let sum = 0;
  for (let i = start; i < buf.length; i++) sum += buf[i] * buf[i];
  const rms = Math.sqrt(sum / use);
  if (rms < 0.0035) return { freq:0, clarity:0, rms };

  const factor = Math.max(1, Math.round(sr / 12000));
  const srd = sr / factor;
  const n = Math.floor(use / factor);
  const x = scratch('x', n);

  if (factor === 1){
    for (let i = 0; i < n; i++) x[i] = buf[start + i];
  } else {
    const h = getFIR(factor), taps = h.length;
    for (let i = 0; i < n; i++){
      const c = start + i * factor;
      let acc = 0;
      for (let t = 0; t < taps; t++){
        const s = c + t - ((taps - 1) >> 1);
        if (s >= 0 && s < buf.length) acc += buf[s] * h[t];
      }
      x[i] = acc;
    }
  }
  /* remove any DC offset — a mic with a bias would otherwise dominate lag 0 */
  let mean = 0;
  for (let i = 0; i < n; i++) mean += x[i];
  mean /= n;
  for (let i = 0; i < n; i++) x[i] -= mean;

  const W = n >> 1;
  const maxLag = Math.min(n - W, Math.ceil(srd / Math.max(8, minFreq)));
  const minLag = Math.max(2, Math.floor(srd / maxFreq));
  if (maxLag <= minLag + 3) return { freq:0, clarity:0, rms };

  /* running power, so the difference function costs nothing extra */
  const P = scratch('P', n + 1);
  P[0] = 0;
  for (let i = 0; i < n; i++) P[i + 1] = P[i] + x[i] * x[i];

  /* r[t] = sum over the first W samples of x[j] * x[j+t], via one FFT pair */
  let M = 1; while (M < n + W + 2) M *= 2;
  const fft = getFFT(M);
  const ar = scratch('ar', M), ai = scratch('ai', M),
        br = scratch('br', M), bi = scratch('bi', M);
  ar.fill(0); ai.fill(0); br.fill(0); bi.fill(0);
  for (let i = 0; i < W; i++) ar[i] = x[i];
  for (let i = 0; i < n; i++) br[i] = x[i];
  fft.forward(ar, ai);
  fft.forward(br, bi);
  for (let i = 0; i < M; i++){
    const re = ar[i] * br[i] + ai[i] * bi[i];    /* conj(A) * B */
    const im = ar[i] * bi[i] - ai[i] * br[i];
    ar[i] = re; ai[i] = im;
  }
  fft.inverse(ar, ai);
  const r = ar;

  /* YIN's difference function, then normalised so it can be thresholded */
  const d = scratch('d', maxLag + 1), dn = scratch('dn', maxLag + 1);
  const head = P[W];
  for (let t = 0; t <= maxLag; t++) d[t] = head + (P[t + W] - P[t]) - 2 * r[t];

  dn[0] = 1;
  let run = 0;
  for (let t = 1; t <= maxLag; t++){
    run += d[t];
    dn[t] = run === 0 ? 1 : d[t] * t / run;
  }

  /* first dip below the threshold beats the deepest dip: it is what stops the
     tuner reading an octave too low when a string has a strong 2nd harmonic */
  const THRESH = 0.13;
  let tau = -1;
  for (let t = minLag; t <= maxLag - 1; t++){
    if (dn[t] < THRESH){
      while (t + 1 <= maxLag && dn[t + 1] < dn[t]) t++;
      tau = t; break;
    }
  }
  if (tau < 0){
    let best = minLag;
    for (let t = minLag; t <= maxLag; t++) if (dn[t] < dn[best]) best = t;
    if (dn[best] > 0.55) return { freq:0, clarity:1 - dn[best], rms };
    tau = best;
  }
  const clarity = Math.max(0, Math.min(1, 1 - dn[tau]));

  /* sub-sample peak, first on the difference function ... */
  let period = parabolic(dn, tau, maxLag);

  /* ... then measured again over as many whole periods as the window holds */
  const span = maxLag * 0.92;
  let m = Math.floor(span / period);
  if (m > 30) m = 30;
  if (m >= 2){
    const centre = Math.round(period * m);
    const lo = Math.max(minLag, centre - Math.floor(period / 2));
    const hi = Math.min(maxLag, centre + Math.floor(period / 2));
    let peak = lo;
    for (let t = lo; t <= hi; t++) if (r[t] > r[peak]) peak = t;
    if (peak > lo && peak < hi){
      const refined = parabolicMax(r, peak);
      const candidate = refined / m;
      /* only trust it if it agrees with the coarse reading */
      if (Math.abs(1200 * Math.log2(candidate / period)) < 45) period = candidate;
    }
  }
  return { freq:srd / period, clarity, rms };
}

function parabolic(a, i, max){
  if (i <= 0 || i >= max) return i;
  const y0 = a[i - 1], y1 = a[i], y2 = a[i + 1], den = y0 + y2 - 2 * y1;
  if (den === 0) return i;
  const off = 0.5 * (y0 - y2) / den;
  return i + (Math.abs(off) < 1 ? off : 0);
}
function parabolicMax(a, i){
  const y0 = a[i - 1], y1 = a[i], y2 = a[i + 1], den = 2 * (2 * y1 - y0 - y2);
  if (den === 0) return i;
  const off = (y2 - y0) / den;
  return i + (Math.abs(off) < 1 ? off : 0);
}

/* ─────────────────────────────────────────────────────────────────────────
   5 · THE MICROPHONE
   ───────────────────────────────────────────────────────────────────────── */

const Mic = {
  stream:null, source:null, analyser:null, hp:null, buf:null,
  on:false, deviceId:null, error:null,
  devices:[],

  async start(deviceId){
    /* Chrome hides mediaDevices entirely on a file:// page, so this has to be
       checked before it is used or the student gets a TypeError instead of an
       explanation. */
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      const e = new Error('no microphone API');
      e.name = 'InsecureContextError';
      this.on = false;
      throw e;
    }
    const ctx = Audio_.resume();
    this.stop(true);
    const constraints = {
      audio:{
        /* every one of these would fight the tuner: they duck, gate and
           reshape exactly the steady tone we are trying to measure */
        echoCancellation:false, noiseSuppression:false, autoGainControl:false,
        channelCount:1
      }
    };
    if (deviceId && deviceId !== 'default') constraints.audio.deviceId = { exact:deviceId };
    try{
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    }catch(err){
      this.error = err;
      if (deviceId && deviceId !== 'default' && err.name === 'OverconstrainedError'){
        return this.start(null);                 /* that mic went away — fall back */
      }
      this.on = false;
      throw err;
    }
    this.error = null;
    this.deviceId = deviceId || null;
    this.source = ctx.createMediaStreamSource(this.stream);
    this.hp = ctx.createBiquadFilter();
    this.hp.type = 'highpass'; this.hp.frequency.value = 20; this.hp.Q.value = 0.7;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 16384;
    this.analyser.smoothingTimeConstant = 0;
    this.source.connect(this.hp).connect(this.analyser);   /* never to the speakers */
    this.buf = new Float32Array(this.analyser.fftSize);
    this.on = true;
    await this.list();
    return true;
  },

  stop(quiet){
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    try{ if (this.source) this.source.disconnect(); }catch(e){}
    this.stream = null; this.source = null; this.analyser = null;
    if (!quiet) this.on = false;
  },

  async list(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return [];
    try{
      const all = await navigator.mediaDevices.enumerateDevices();
      this.devices = all.filter(d => d.kind === 'audioinput');
    }catch(e){ this.devices = []; }
    return this.devices;
  },

  read(useSamples, minFreq, maxFreq){
    if (!this.on || !this.analyser) return null;
    this.analyser.getFloatTimeDomainData(this.buf);
    const use = Math.min(useSamples, this.buf.length);
    return detectPitch(this.buf, use, Audio_.ctx.sampleRate, minFreq, maxFreq);
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   6 · STATE
   ───────────────────────────────────────────────────────────────────────── */

const STORE = 'stringed-tuner-v1';
const State = {
  mode:'play',
  instId:'guitar', tuningId:'standard',
  a4:440, tol:5,
  volume:0.75, noteSeconds:3,
  hold:false, selected:0,
  autoAdvance:true, bigtext:false, showIntervals:true,
  theme:'auto', micId:'default',      /* 'auto' follows the device until asked otherwise */
  done:{},                                  /* instrument+tuning → set of keys */

  load(){
    try{
      const raw = localStorage.getItem(STORE);
      if (raw) Object.assign(this, JSON.parse(raw));
    }catch(e){}
    this.done = {};                         /* a fresh session starts untuned */
  },
  save(){
    try{
      const { mode, instId, tuningId, a4, tol, volume, noteSeconds, autoAdvance,
        bigtext, showIntervals, theme, micId } = this;
      localStorage.setItem(STORE, JSON.stringify({ mode, instId, tuningId, a4, tol,
        volume, noteSeconds, autoAdvance, bigtext, showIntervals, theme, micId }));
    }catch(e){}
  }
};

let INST = null, TUNING = null, ROWS = [];

function currentDoneSet(){
  const k = State.instId + '/' + State.tuningId + '/' + State.a4;
  if (!State.done[k]) State.done[k] = {};
  return State.done[k];
}

function resolve(){
  INST = INSTRUMENTS.find(i => i.id === State.instId) || INSTRUMENTS[0];
  State.instId = INST.id;
  TUNING = INST.tunings.find(t => t.id === State.tuningId) || INST.tunings[0];
  State.tuningId = TUNING.id;
  ROWS = stringsOf(INST, TUNING, State.a4);
  if (State.selected >= ROWS.length) State.selected = ROWS.length - 1;
  if (State.selected < 0) State.selected = 0;
}

/* ─────────────────────────────────────────────────────────────────────────
   7 · SMALL DOM HELPERS
   ───────────────────────────────────────────────────────────────────────── */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function el(tag, cls, text){
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
function noteSpan(name, cls){
  const p = splitName(name);
  const s = el('span', cls);
  s.appendChild(document.createTextNode(p.letter));
  if (p.octave !== '') s.appendChild(el('span', 's-oct', p.octave));
  return s;
}
let toastTimer = null;
function toast(msg, good){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.toggle('good', !!good);
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ─────────────────────────────────────────────────────────────────────────
   8 · THE DIAL
   ───────────────────────────────────────────────────────────────────────── */

const GEO = { cx:150, cy:150, r:105, band:18, tickIn:116, tickOut:123, labelR:136,
  needleIn:52, needleOut:99 };

function polar(cents, radius){
  const a = (cents / 50) * (Math.PI / 2);      /* ±50 cents fills ±90° */
  return [GEO.cx + radius * Math.sin(a), GEO.cy - radius * Math.cos(a)];
}
function arcPath(c1, c2, radius){
  const [x1, y1] = polar(c1, radius), [x2, y2] = polar(c2, radius);
  const large = Math.abs(c2 - c1) > 50 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}
const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs){
  const n = document.createElementNS(SVGNS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

function buildGauge(host){
  host.textContent = '';
  const svg = svgEl('svg', { viewBox:'0 0 300 192', role:'img' });
  const bands = svgEl('g', {});
  svg.appendChild(bands);

  const ticks = svgEl('g', {});
  for (let c = -50; c <= 50; c += 10){
    const major = c === 0 || Math.abs(c) === 50;
    const [x1, y1] = polar(c, GEO.tickIn);
    const [x2, y2] = polar(c, major ? GEO.tickOut + 4 : GEO.tickOut);
    ticks.appendChild(svgEl('line', { class:'g-tick' + (major ? ' major' : ''),
      x1:x1.toFixed(2), y1:y1.toFixed(2), x2:x2.toFixed(2), y2:y2.toFixed(2) }));
    if (major){
      const [lx, ly] = polar(c, GEO.labelR);
      const t = svgEl('text', { class:'g-ticklabel', x:lx.toFixed(2), y:(ly + 4).toFixed(2) });
      t.textContent = c > 0 ? '+' + c : String(c);
      ticks.appendChild(t);
    }
  }
  svg.appendChild(ticks);

  /* the pointer floats just inside the arc, so it never crosses the readout */
  const needle = svgEl('line', { class:'g-needle', x1:GEO.cx, y1:GEO.cy - GEO.needleIn,
    x2:GEO.cx, y2:GEO.cy - GEO.needleOut });
  svg.appendChild(needle);
  svg.appendChild(svgEl('circle', { class:'g-hub', cx:GEO.cx, cy:GEO.cy, r:5 }));

  const centsText = svgEl('text', { class:'g-cents', x:GEO.cx, y:122 });
  centsText.textContent = '\u2013';
  svg.appendChild(centsText);
  const unit = svgEl('text', { class:'g-centsunit', x:GEO.cx, y:140 });
  unit.textContent = 'cents';
  svg.appendChild(unit);

  const left = svgEl('text', { class:'g-side', x:10, y:180, 'text-anchor':'start' });
  left.textContent = 'too low \u2013 flat';
  svg.appendChild(left);
  const right = svgEl('text', { class:'g-side', x:290, y:180, 'text-anchor':'end' });
  right.textContent = 'sharp \u2013 too high';
  svg.appendChild(right);

  host.appendChild(svg);

  function drawBands(tol){
    bands.textContent = '';
    const near = Math.min(30, tol * 3);
    bands.appendChild(svgEl('path', { class:'g-band off', d:arcPath(-50, 50, GEO.r),
      'stroke-width':GEO.band }));
    bands.appendChild(svgEl('path', { class:'g-band near', d:arcPath(-near, near, GEO.r),
      'stroke-width':GEO.band }));
    bands.appendChild(svgEl('path', { class:'g-band good', d:arcPath(-tol, tol, GEO.r),
      'stroke-width':GEO.band }));
  }
  drawBands(State.tol);

  return {
    host, drawBands,
    idle(){
      host.classList.add('is-idle');
      host.classList.remove('is-good', 'is-flat', 'is-sharp');
      needle.setAttribute('transform', 'rotate(0 150 150)');
      centsText.textContent = '–';
    },
    show(cents, inTune){
      host.classList.remove('is-idle');
      const c = Math.max(-50, Math.min(50, cents));
      needle.setAttribute('transform', `rotate(${(c / 50 * 90).toFixed(2)} 150 150)`);
      const rounded = Math.round(cents);
      centsText.textContent = (rounded > 0 ? '+' : '') + rounded;
      host.classList.toggle('is-good', !!inTune);
      host.classList.toggle('is-flat', !inTune && cents < 0);
      host.classList.toggle('is-sharp', !inTune && cents > 0);
    }
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   9 · THE STRING BOX
   ───────────────────────────────────────────────────────────────────────── */

function renderBox(){
  const box = $('#stringbox');
  box.textContent = '';
  const done = currentDoneSet();

  ROWS.forEach((row, i) => {
    if (i > 0){
      const gap = row.midi - ROWS[i - 1].midi;
      const up = gap >= 0, size = Math.abs(gap);
      const short = size <= 12 ? INTERVALS_SHORT[size] : size + 'st';
      const tag = el('span', 'interval-tag' + (up ? '' : ' down'),
        gap === 0 ? '=' : (up ? short : '\u2193' + short));
      tag.title = gap === 0
        ? 'these two strings are tuned to the same note'
        : (size <= 12 ? 'a ' + INTERVALS[size] : size + ' semitones') +
          (up ? ' up' : ' DOWN') + ' from the string on the left';
      box.appendChild(tag);
    }

    const col = el('button', 'string-col');
    col.type = 'button';
    col.dataset.i = i;
    col.setAttribute('aria-label',
      `String ${row.key}: ${row.note}${row.pair ? ' with ' + row.pair : ''}, ` +
      `${row.label || ordinal(row.trad) + ' string'}, ${row.freq.toFixed(1)} hertz`);

    col.appendChild(el('span', 's-tick', '✓'));
    col.appendChild(noteSpan(row.note, 's-note'));
    col.appendChild(el('span', 's-pair', row.pair ? '+ ' + row.pair : ' '));

    const lane = el('span', 'wire-lane');
    const w = wireWidth(row.midi);
    const wound = isWound(row.midi);
    lane.style.setProperty('--w', w.toFixed(2) + 'px');
    lane.style.setProperty('--wire-col', wound ? 'var(--wire-wound)' : 'var(--wire)');
    lane.style.setProperty('--amp', (3.5 + w * 0.85).toFixed(1) + 'px');
    lane.style.setProperty('--vib', (INST.voice === 'bow' ? 0.5 : 0.45 + w * 0.06).toFixed(2) + 's');
    lane.appendChild(el('span', 'wire-ghost g1'));
    lane.appendChild(el('span', 'wire-ghost g2'));
    lane.appendChild(el('span', 'wire' + (wound ? ' wound' : '')));
    if (row.pair){
      const w2 = wireWidth(row.pairMidi);
      const lane2 = el('span', 'wire');
      lane2.style.setProperty('--w', w2.toFixed(2) + 'px');
      lane2.style.setProperty('--wire-col', isWound(row.pairMidi) ? 'var(--wire-wound)' : 'var(--wire)');
      lane2.style.left = 'calc(50% + 5px)';
      lane.querySelector('.wire').style.left = 'calc(50% - 5px)';
      if (isWound(row.pairMidi)) lane2.classList.add('wound');
      lane.appendChild(lane2);
    }
    col.appendChild(lane);

    const foot = el('span', 's-foot');
    foot.appendChild(el('span', 's-key', String(row.key)));
    foot.appendChild(el('span', 's-trad', row.label || ordinal(row.trad) + ' string'));
    col.appendChild(foot);

    if (done[row.key]) col.classList.add('is-done');
    if (i === State.selected) col.classList.add('is-sel');
    box.appendChild(col);
  });

  $('#hint-last-key').textContent = String(ROWS.length);
  syncSounding();
  renderBoxHint();
}

function renderBoxHint(){
  const h = $('#box-hint');
  if (State.mode === 'tune'){
    h.textContent = 'Tap the string you want to tune. Its number key works too.';
  } else if (State.mode === 'listen'){
    h.textContent = 'The tuner listens to any sound, not just this instrument. ' +
      'Your strings are here so you can compare.';
  } else {
    const low = lowestOf(ROWS), high = highestOf(ROWS);
    const inOrder = !isReentrant(TUNING);
    h.textContent = 'The strings are in the same order as on the real instrument: ' +
      'the ' + (ROWS[0].label || ordinal(ROWS[0].trad) + ' string') + ' on the left, ' +
      'the ' + (ROWS[ROWS.length - 1].label || ordinal(ROWS[ROWS.length - 1].trad) +
      ' string') + ' on the right. ' +
      (inOrder
        ? 'The thickest one is on the left (' + low.note + ', ' + low.freq.toFixed(1) +
          ' Hz) and the thinnest is on the right (' + high.note + ', ' +
          high.freq.toFixed(1) + ' Hz). A thicker, heavier string vibrates more ' +
          'slowly, and slower means lower.'
        : 'Look at how thick each string is. They do not just get thinner as you go ' +
          'across, because this tuning does not just get higher. The lowest string ' +
          'is ' + low.note + ' (' + low.freq.toFixed(1) + ' Hz) and the highest is ' +
          high.note + ' (' + high.freq.toFixed(1) + ' Hz).');
  }
}

function syncSounding(){
  $$('#stringbox .string-col').forEach(col => {
    const i = +col.dataset.i;
    col.classList.toggle('sounding', Audio_.isSounding('s' + ROWS[i].key));
  });
}

function selectString(i, opts){
  State.selected = Math.max(0, Math.min(ROWS.length - 1, i));
  $$('#stringbox .string-col').forEach(c => c.classList.toggle('is-sel', +c.dataset.i === State.selected));
  if (State.mode === 'tune') Tune.retarget(opts && opts.keepReadings);
}

/* ─────────────────────────────────────────────────────────────────────────
   10 · PLAYING A STRING
   ───────────────────────────────────────────────────────────────────────── */

function pluck(i){
  const row = ROWS[i];
  const key = 's' + row.key;
  if (State.hold && Audio_.isSounding(key)){ Audio_.stop(key, 0.2); return; }

  const freqs = [row.freq];
  if (row.pairMidi !== null && row.pairMidi !== row.midi) freqs.push(freqOf(row.pairMidi, State.a4));
  else if (row.pair) freqs.push(row.freq);            /* unison course */

  Audio_.play(freqs, {
    key, voice:INST.voice, bright:INST.tone.bright,
    decay:INST.tone.decay || 2.5, seconds:State.noteSeconds, hold:State.hold
  });

  const col = $(`#stringbox .string-col[data-i="${i}"]`);
  if (col){
    col.classList.remove('plucking');
    void col.offsetWidth;                              /* restart the animation */
    col.classList.add('plucking');
    setTimeout(() => col.classList.remove('plucking'), 1200);
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   11 · WHAT THIS TUNING IS TEACHING
   ───────────────────────────────────────────────────────────────────────── */

function preferFlats(){ return TUNING.strings.some(s => s.n.includes('b')); }

function renderTeach(){
  const box = $('#play-teach');
  box.textContent = '';
  box.appendChild(el('h2', null, INST.name + ' · ' + TUNING.name));

  const chips = el('p');
  ROWS.forEach(r => {
    const c = el('span', 'pattern', r.key + '  ' + r.note + (r.pair ? ' + ' + r.pair : ''));
    c.title = (r.label || ordinal(r.trad) + ' string') + ' · ' + r.freq.toFixed(2) + ' Hz';
    chips.appendChild(c);
  });
  box.appendChild(chips);

  if (isReentrant(TUNING)){
    /* name the exact place where the notes stop climbing */
    let d = 1;
    while (d < ROWS.length && ROWS[d].midi >= ROWS[d - 1].midi) d++;
    const high = ROWS[d - 1], low = ROWS[d];
    const nameOf = r => r.label ? r.label.toLowerCase() + ' string'
                                : ordinal(r.trad) + ' string';
    const p = el('p');
    p.innerHTML = '<b>This tuning is re-entrant.</b> Read the box from left to ' +
      'right and the notes do not just climb. The ' + nameOf(high) + ' (<b>' +
      high.note + '</b>) sounds <i>higher</i> than the ' + nameOf(low) + ' (<b>' +
      low.note + '</b>) right next to it. The ↓ between them shows where the pitch ' +
      'steps back down. You can see it in the string thicknesses too.';
    box.appendChild(p);
  } else {
    box.appendChild(el('p', null, describePattern(ROWS)));
  }

  if (TUNING.note) box.appendChild(el('p', null, TUNING.note));

  const hz = el('p');
  const lo = lowestOf(ROWS), hi = highestOf(ROWS);
  hz.innerHTML = 'Lowest string <b>' + lo.note + '</b> at ' + lo.freq.toFixed(1) +
    ' Hz. Highest string <b>' + hi.note + '</b> at ' + hi.freq.toFixed(1) + ' Hz. ' +
    'That is ' + (hi.freq / lo.freq).toFixed(1) + ' times as many vibrations per second.';
  box.appendChild(hz);
}

function renderAbout(){
  $('#about-title').textContent = INST.name;
  const b = $('#about-body');
  b.textContent = '';

  b.appendChild(el('p', null, INST.blurb));

  const facts = el('div', 'fact-grid');
  const addFact = (dt, dd) => {
    const f = el('dl', 'fact');
    f.appendChild(el('dt', null, dt));
    f.appendChild(el('dd', null, dd));
    facts.appendChild(f);
  };
  addFact('Family', INST.family === 'Bowed' ? 'Bowed strings' : 'Plucked strings');
  addFact('Strings', ROWS.length + (TUNING.strings.some(s => s.pair) ? ' courses' : ''));
  addFact('Lowest', lowestOf(ROWS).note + ' · ' + lowestOf(ROWS).freq.toFixed(1) + ' Hz');
  addFact('Highest', highestOf(ROWS).note + ' · ' + highestOf(ROWS).freq.toFixed(1) + ' Hz');
  b.appendChild(facts);

  const h = el('div');
  h.appendChild(el('h3', null, TUNING.name));
  const tbl = el('table', 'string-table');
  const thead = el('tr');
  ['Key', 'Note', 'Player calls it', 'Frequency'].forEach(t => {
    const th = el('th', null, t); thead.appendChild(th);
  });
  tbl.appendChild(thead);
  ROWS.forEach(r => {
    const tr = el('tr');
    tr.appendChild(el('td', null, String(r.key)));
    tr.appendChild(el('td', null, r.note + (r.pair ? ' + ' + r.pair : '')));
    tr.appendChild(el('td', null, r.label || ordinal(r.trad) + ' string'));
    tr.appendChild(el('td', null, r.freq.toFixed(2) + ' Hz'));
    tbl.appendChild(tr);
  });
  h.appendChild(tbl);
  b.appendChild(h);

  if (TUNING.note){
    const d = el('div');
    d.appendChild(el('h3', null, 'About this tuning'));
    d.appendChild(el('p', null, TUNING.note));
    b.appendChild(d);
  }
  if (INST.care){
    const d = el('div');
    d.appendChild(el('h3', null, 'Tuning it well'));
    d.appendChild(el('p', null, INST.care));
    b.appendChild(d);
  }
  const d = el('div');
  d.appendChild(el('h3', null, 'Why the strings look different'));
  d.appendChild(el('p', null,
    'A thick, heavy string is harder to get moving. It swings back and forth more ' +
    'slowly, so it sounds lower. Tightening a string pulls it back faster, which ' +
    'raises the note. Loosening it lowers the note. Only three things decide a ' +
    'string\'s note: how thick it is, how tight it is, and how long it is.'));
  b.appendChild(d);

  if (State.a4 !== 440){
    const w = el('div');
    w.appendChild(el('h3', null, 'Reference pitch'));
    w.appendChild(el('p', null, 'These numbers come from A = ' + State.a4 +
      ' Hz, which you chose in Settings. At the usual A = 440 Hz they would all be ' +
      'a little different.'));
    b.appendChild(w);
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   12 · TUNE MODE
   ───────────────────────────────────────────────────────────────────────── */

const Tune = {
  gauge:null, target:null, ema:null, hist:[], goodSince:0, lastHeard:0, celebrated:false,

  init(){ this.gauge = buildGauge($('#tune-gauge')); },

  retarget(keep){
    this.target = ROWS[State.selected] || null;
    if (!keep){ this.ema = null; this.hist = []; this.goodSince = 0; this.celebrated = false; }
    const t = this.target;
    const noteEl = $('#tune-target-note');
    noteEl.textContent = '';
    if (!t){ noteEl.textContent = '—'; return; }
    noteEl.appendChild(noteSpan(t.note, ''));
    $('#tune-target-string').textContent =
      'Key ' + t.key + ' · ' + (t.label || ordinal(t.trad) + ' string') +
      (t.pair ? ' (a pair: ' + t.note + ' and ' + t.pair + ')' : '');
    $('#tune-target-hz').textContent = t.freq.toFixed(2) + ' Hz';
    this.gauge.idle();
  },

  targets(){
    const t = this.target;
    if (!t) return [];
    const out = [{ midi:t.midi, freq:t.freq, note:t.note, which:'the thick string of the pair' }];
    if (t.pairMidi !== null && t.pairMidi !== t.midi)
      out.push({ midi:t.pairMidi, freq:freqOf(t.pairMidi, State.a4), note:t.pair,
        which:'the thin octave string of the pair' });
    return out;
  },

  say(verdict, cls, advice){
    const v = $('#tune-verdict');
    v.textContent = verdict;
    v.className = 'verdict' + (cls ? ' ' + cls : '');
    $('#tune-advice').textContent = advice || '';
  },

  tick(now){
    if (!this.target) return;

    if (Audio_.anySounding()){
      this.gauge.idle();
      this.say('That is the app playing, not you', 'warn',
        'The microphone can hear the speaker too, not just you. Wait for the note ' +
        'to finish, or use headphones, then play your string.');
      $('#level-tune').style.width = '0%';
      this.ema = null; this.goodSince = 0;
      return;
    }
    if (!Mic.on){
      this.gauge.idle();
      this.say('Turn on the microphone to check this string', '',
        'Or press ' + this.target.key + ' to hear what it should sound like and tune by ear.');
      return;
    }

    const useLow = this.target.midi < 52;
    const res = Mic.read(useLow ? 16384 : 8192, 27.5, 1400);
    if (!res) return;
    $('#level-tune').style.width = Math.min(100, res.rms * 420).toFixed(0) + '%';

    if (!res.freq || res.clarity < 0.45){
      if (now - this.lastHeard > 900){
        this.gauge.idle();
        this.ema = null; this.goodSince = 0;
        this.say('Listening for your ' + this.target.note + ' string…', '',
          res.rms > 0.02
            ? 'I can hear something, but it is not a clear note. Play one string on ' +
              'its own, and stop the others ringing with your hand.'
            : 'Play the string a little louder, or move closer to the microphone.');
      }
      return;
    }
    this.lastHeard = now;

    /* pick whichever of the course's pitches they are actually nearer to */
    const opts = this.targets();
    let best = opts[0], bestCents = centsBetween(res.freq, opts[0].freq);
    opts.forEach(o => {
      const c = centsBetween(res.freq, o.freq);
      if (Math.abs(c) < Math.abs(bestCents)){ best = o; bestCents = c; }
    });

    /* a long way off is not a tuning problem, it is the wrong string */
    if (Math.abs(bestCents) > 60){
      this.gauge.idle();
      this.ema = null; this.goodSince = 0;
      const heardMidi = Math.round(midiOfFreq(res.freq, State.a4));
      const heardName = nameOfMidi(heardMidi, preferFlats());
      const semis = heardMidi - best.midi;
      const other = ROWS.find(r => r.midi === heardMidi && r.key !== this.target.key);
      let advice;
      if (other){
        advice = 'That is your ' + other.note + ' string — key ' + other.key + ', ' +
          (other.label ? 'the ' + other.label.toLowerCase() + ' string'
                       : 'the ' + ordinal(other.trad) + ' string') +
          '. The one you picked is ' +
          (other.key < this.target.key ? 'to its right' : 'to its left') +
          ', or you can switch the tuner over to this string instead.';
      } else if (Math.abs(semis) === 12){
        advice = 'That is exactly one octave ' + (semis > 0 ? 'above' : 'below') +
          ' the note you want. Right letter, wrong string.';
      } else {
        advice = 'That is ' + Math.abs(semis) + ' semitone' + (Math.abs(semis) === 1 ? '' : 's') +
          ' ' + (semis > 0 ? 'above' : 'below') + ' ' + best.note +
          '. Check that you are playing an open string, with no finger pressing down.';
      }
      this.say('I hear ' + heardName + ', not ' + best.note, 'warn', advice);
      return;
    }

    /* smooth in cents, and treat a big jump as a new note rather than drift */
    if (this.ema === null || Math.abs(bestCents - this.ema) > 45){
      this.ema = bestCents;
      this.hist.length = 0;            /* a new note — forget the old one's wobble */
    } else {
      this.ema = this.ema * 0.72 + bestCents * 0.28;
    }

    this.hist.push({ t:now, c:bestCents });
    while (this.hist.length && now - this.hist[0].t > 700) this.hist.shift();
    let spread = 0;
    if (this.hist.length > 3){
      const cs = this.hist.map(h => h.c);
      spread = Math.max(...cs) - Math.min(...cs);
    }

    const cents = this.ema;
    const tol = State.tol;
    const inTune = Math.abs(cents) <= tol;
    this.gauge.show(cents, inTune);

    /* A pitch that is still sliding — usually because the peg is being turned —
       must not be declared in tune. But nor should the reading be hidden: the
       student needs to see which way it is moving, so the verdict stays and the
       steadying hint goes in front of the advice. */
    const settling = spread > 18;
    const v = tuneVerdict(cents, tol, best);
    this.say(v.text, v.cls, settling
      ? (INST.voice === 'bow'
          ? 'Keep the bow moving steadily and give the reading a moment to settle. '
          : 'Pluck once and let it ring, so the reading can settle. ') + v.advice
      : v.advice);
    if (settling){ this.goodSince = 0; return; }

    if (inTune){
      if (!this.goodSince) this.goodSince = now;
      if (now - this.goodSince > 850 && !this.celebrated) this.succeed(best);
    } else {
      this.goodSince = 0;
      this.celebrated = false;
    }
  },

  succeed(best){
    this.celebrated = true;
    currentDoneSet()[this.target.key] = true;
    const col = $(`#stringbox .string-col[data-i="${State.selected}"]`);
    if (col) col.classList.add('is-done');
    toast(best.note + ' is in tune', true);
    if (navigator.vibrate) try{ navigator.vibrate([18, 50, 18]); }catch(e){}
    chime();

    const done = currentDoneSet();
    if (ROWS.every(r => done[r.key])){
      setTimeout(() => toast('Every string is in tune. Well done.', true), 2700);
      return;
    }
    if (State.autoAdvance){
      let next = -1;
      for (let k = 1; k <= ROWS.length; k++){
        const i = (State.selected + k) % ROWS.length;
        if (!done[ROWS[i].key]){ next = i; break; }
      }
      if (next >= 0) setTimeout(() => selectString(next), 950);
    }
  }
};

function tuneVerdict(cents, tol, target){
  const a = Math.abs(cents);
  const flat = cents < 0;
  const dir = flat ? 'flat' : 'sharp';
  const bowed = INST.voice === 'bow';

  if (a <= tol) return {
    text:'In tune ✓', cls:'good',
    advice:'Hold it there. ' + target.note + ' is right where it should be.'
  };

  const raise = flat;
  let how;
  if (bowed && a <= 18){
    how = 'Use the fine tuner by the tailpiece: turn it ' +
      (raise ? 'clockwise to tighten and raise' : 'anticlockwise to loosen and lower') +
      ' the string.';
  } else if (bowed){
    how = 'This is too far for the fine tuner, so use the peg. Press it gently INTO ' +
      'the scroll while you turn, or it will slip back. Turn it ' +
      (raise ? 'to tighten' : 'to loosen') + ' the string.';
  } else {
    how = 'Turn the tuning peg slowly ' +
      (raise ? 'to tighten the string and raise the note' : 'to loosen the string and lower the note') +
      '.';
  }
  if (!raise) how += ' Go a little below the note, then bring it back up. A string ' +
    'that is pulling upwards against the peg stays in tune better.';

  let text;
  if (a <= tol * 2.2) text = 'So close! Just a touch ' + dir;
  else if (a <= 22)   text = 'A little ' + dir;
  else if (a <= 45)   text = 'Quite a bit ' + dir;
  else                text = 'A long way ' + dir;

  return { text, cls:flat ? 'flat' : 'sharp',
    advice:(flat ? 'The note is below ' : 'The note is above ') + target.note + '. ' + how };
}

/* a small, quiet two-note ding when a string lands */
function chime(){
  const ctx = Audio_.resume(), t = ctx.currentTime + 0.02;
  [[880, 0], [1320, 0.11]].forEach(([f, d]) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t + d);
    g.gain.linearRampToValueAtTime(0.10, t + d + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0004, t + d + 0.5);
    o.connect(g).connect(Audio_.comp);
    o.start(t + d); o.stop(t + d + 0.55);
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   13 · LISTEN MODE — the plain chromatic tuner, plus a pitch trace
   ───────────────────────────────────────────────────────────────────────── */

const Free = {
  gauge:null, ema:null, lastHeard:0, useLow:false, points:[],
  canvas:null, cctx:null,

  init(){
    this.gauge = buildGauge($('#free-gauge'));
    this.canvas = $('#trace');
    this.cctx = this.canvas.getContext('2d');
    this.sizeCanvas();
  },

  sizeCanvas(){
    const c = this.canvas, dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth || 600, h = c.clientHeight || 200;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)){
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      this.cctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    this._w = w; this._h = h;
  },

  tick(now){
    if (Audio_.anySounding()){
      $('#free-verdict').textContent = 'The app is playing a note, so that is what I can hear.';
    }
    if (!Mic.on){
      this.gauge.idle();
      $('#free-note').textContent = '—';
      $('#free-hz').textContent = '—';
      $('#free-nearest').textContent = '';
      $('#free-verdict').textContent = 'Turn on the microphone, then play, sing or whistle anything.';
      this.draw(now);
      return;
    }

    const res = Mic.read(this.useLow ? 16384 : 8192, 27.5, 2200);
    if (!res){ this.draw(now); return; }
    $('#level-free').style.width = Math.min(100, res.rms * 420).toFixed(0) + '%';

    if (!res.freq || res.clarity < 0.4){
      this.useLow = true;                    /* nothing found — look wider next time */
      if (now - this.lastHeard > 800){
        this.gauge.idle();
        $('#free-note').textContent = '—';
        $('#free-hz').textContent = '—';
        $('#free-nearest').textContent = '';
        $('#free-verdict').textContent = res.rms > 0.02
          ? 'I can hear a sound, but it has no clear pitch.'
          : 'Listening…';
        this.ema = null;
      }
      this.draw(now);
      return;
    }
    this.lastHeard = now;
    this.useLow = res.freq < 90;

    const exact = midiOfFreq(res.freq, State.a4);
    if (this.ema === null || Math.abs(exact - this.ema) > 0.6) this.ema = exact;
    else this.ema = this.ema * 0.7 + exact * 0.3;

    const near = Math.round(this.ema);
    const cents = (this.ema - near) * 100;
    const name = nameOfMidi(near, preferFlats());
    const noteEl = $('#free-note');
    noteEl.textContent = '';
    noteEl.appendChild(noteSpan(name, ''));

    $('#free-hz').textContent = res.freq.toFixed(1) + ' Hz';

    const match = ROWS.reduce((b, r) =>
      Math.abs(r.midi - this.ema) < Math.abs(b.midi - this.ema) ? r : b, ROWS[0]);
    const off = Math.round((this.ema - match.midi) * 100);
    $('#free-nearest').textContent = Math.abs(off) < 400
      ? 'nearest string: ' + match.note + ' (key ' + match.key + ')'
      : '';

    const inTune = Math.abs(cents) <= State.tol;
    this.gauge.show(cents, inTune);
    const alt = nameOfMidi(near, !preferFlats());
    $('#free-verdict').textContent = inTune
      ? 'That is ' + name + (alt !== name ? ', also written ' + alt : '') + ', exactly in tune.'
      : (cents < 0 ? Math.abs(Math.round(cents)) + ' cents below ' + name
                   : Math.round(cents) + ' cents above ' + name);

    this.points.push({ t:now, m:this.ema });
    this.draw(now);
  },

  draw(now){
    const span = 8000;
    while (this.points.length && now - this.points[0].t > span) this.points.shift();
    this.sizeCanvas();
    const g = this.cctx, w = this._w, h = this._h;
    const css = getComputedStyle(document.documentElement);
    const ink3 = css.getPropertyValue('--ink-3').trim();
    const line = css.getPropertyValue('--line').trim();
    const accent = css.getPropertyValue('--accent').trim();

    g.clearRect(0, 0, w, h);
    if (!this.points.length){
      g.fillStyle = ink3; g.font = '13px system-ui, sans-serif'; g.textAlign = 'center';
      g.fillText('Nothing yet — play a note.', w / 2, h / 2);
      return;
    }

    let lo = Infinity, hi = -Infinity;
    this.points.forEach(p => { if (p.m < lo) lo = p.m; if (p.m > hi) hi = p.m; });
    let mid = (lo + hi) / 2, range = Math.max(hi - lo + 4, 13);
    lo = mid - range / 2; hi = mid + range / 2;

    const y = m => h - ((m - lo) / (hi - lo)) * (h - 8) - 4;
    const x = t => ((t - (now - span)) / span) * w;

    /* one faint line per semitone, a brighter one with a label on each C */
    g.lineWidth = 1;
    for (let m = Math.ceil(lo); m <= hi; m++){
      const isC = ((m % 12) + 12) % 12 === 0;
      g.strokeStyle = isC ? ink3 : line;
      g.globalAlpha = isC ? 0.45 : 0.65;
      g.beginPath(); g.moveTo(0, y(m) + 0.5); g.lineTo(w, y(m) + 0.5); g.stroke();
      if (isC && hi - lo < 40){
        g.globalAlpha = 0.9; g.fillStyle = ink3;
        g.font = '600 10px ui-monospace, monospace'; g.textAlign = 'left';
        g.fillText(nameOfMidi(m, false), 4, y(m) - 3);
      }
    }
    g.globalAlpha = 1;

    g.strokeStyle = accent; g.lineWidth = 2.4;
    g.lineJoin = 'round'; g.lineCap = 'round';
    g.beginPath();
    let pen = false;
    for (let i = 0; i < this.points.length; i++){
      const p = this.points[i];
      if (i && p.t - this.points[i - 1].t > 220) pen = false;
      if (!pen){ g.moveTo(x(p.t), y(p.m)); pen = true; }
      else g.lineTo(x(p.t), y(p.m));
    }
    g.stroke();

    const last = this.points[this.points.length - 1];
    if (now - last.t < 250){
      g.fillStyle = accent;
      g.beginPath(); g.arc(x(last.t), y(last.m), 4, 0, Math.PI * 2); g.fill();
    }
  }
};

/* ─────────────────────────────────────────────────────────────────────────
   14 · MODES AND THE MAIN LOOP
   ───────────────────────────────────────────────────────────────────────── */

function setMode(mode){
  State.mode = mode;
  document.body.classList.remove('mode-play', 'mode-tune', 'mode-listen');
  document.body.classList.add('mode-' + mode);
  $$('.mode-btn').forEach(b => {
    const on = b.dataset.mode === mode;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  ['play', 'tune', 'listen'].forEach(m => { $('#panel-' + m).hidden = m !== mode; });
  if (mode === 'tune') Tune.retarget();
  if (mode === 'listen') Free.sizeCanvas();
  renderBoxHint();
  State.save();
}

let lastAnalysis = 0;
function loop(){
  const now = performance.now();
  if (now - lastAnalysis >= 38){
    lastAnalysis = now;
    if (State.mode === 'tune') Tune.tick(now);
    else if (State.mode === 'listen') Free.tick(now);
  }
  requestAnimationFrame(loop);
}

/* ─────────────────────────────────────────────────────────────────────────
   15 · MICROPHONE UI
   ───────────────────────────────────────────────────────────────────────── */

let micIndicator = null;

function micMessage(err){
  if (!err) return '';
  if (err.name === 'NotAllowedError' || err.name === 'SecurityError')
    return 'The browser blocked the microphone. Look for the padlock or camera icon ' +
      'in the address bar, allow the microphone there, then try again.';
  if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError')
    return 'No microphone found. Plug one in, or check it is switched on.';
  if (err.name === 'NotReadableError')
    return 'Another app is using the microphone. Close it and try again.';
  if (err.name === 'InsecureContextError')
    return 'This browser will not turn on the microphone for a page opened straight ' +
      'from a folder. Put the app on a web server or online, and the listening ' +
      'modes will work. The reference tones work either way.';
  return 'The microphone could not be started (' + err.name + ').';
}

async function toggleMic(){
  if (Mic.on){
    Mic.stop();
    syncMicUI('Microphone off.');
    return;
  }
  try{
    await Mic.start(State.micId);
    syncMicUI('');
    fillMicList();
  }catch(err){
    syncMicUI(micMessage(err), true);
  }
}

function syncMicUI(message, alert){
  const label = Mic.on ? 'Microphone is on — tap to stop' : 'Turn on the microphone';
  ['#btn-mic-tune', '#btn-mic-free'].forEach(sel => {
    const b = $(sel);
    b.textContent = label;
    b.classList.toggle('is-live', Mic.on);
  });
  let note = message;
  if (!note && Mic.on){
    const d = Mic.devices.find(d => d.deviceId === (Mic.deviceId || 'default'));
    const nm = d && d.label ? d.label : 'the default microphone';
    note = 'Listening through ' + nm + '. Change it in Settings if you have another one.';
  }
  if (!note && !Mic.on) note = location.protocol === 'file:'
    ? 'Tip: most browsers only turn on the microphone for a page on a web server. ' +
      'If nothing happens when you press this, that is why.'
    : '';
  ['#mic-note-tune', '#mic-note-free'].forEach(sel => {
    const n = $(sel);
    n.textContent = note || '';
    n.classList.toggle('alert', !!alert);
  });
  document.body.classList.toggle('mic-on', Mic.on);
  if (micIndicator) micIndicator.hidden = !Mic.on;
  if (!Mic.on){
    $('#level-tune').style.width = '0%';
    $('#level-free').style.width = '0%';
  }
}

async function fillMicList(){
  await Mic.list();
  const sel = $('#sel-mic');
  sel.textContent = '';
  const d0 = el('option', null, 'Default microphone');
  d0.value = 'default';
  sel.appendChild(d0);
  Mic.devices.forEach((d, i) => {
    const o = el('option', null, d.label || 'Microphone ' + (i + 1));
    o.value = d.deviceId;
    sel.appendChild(o);
  });
  sel.value = State.micId && [...sel.options].some(o => o.value === State.micId)
    ? State.micId : 'default';
  if (!Mic.devices.length || !Mic.devices[0].label){
    sel.title = 'Names appear once you have allowed microphone access.';
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   16 · SETTINGS
   ───────────────────────────────────────────────────────────────────────── */

const A4_PRESETS = [
  { hz:415, label:'415', sub:'Baroque' },
  { hz:430, label:'430', sub:'Classical' },
  { hz:432, label:'432', sub:'Low' },
  { hz:440, label:'440', sub:'Standard' },
  { hz:442, label:'442', sub:'Orchestral' },
  { hz:443, label:'443', sub:'Higher' }
];
const TOL_PRESETS = [
  { c:10, label:'Gentle', sub:'±10 cents' },
  { c:5,  label:'Normal', sub:'±5 cents' },
  { c:3,  label:'Strict', sub:'±3 cents' }
];

function buildSettings(){
  const ap = $('#a4-picker');
  ap.textContent = '';
  A4_PRESETS.forEach(p => {
    const b = el('button', 'chip');
    b.type = 'button';
    b.appendChild(document.createTextNode(p.label + ' Hz'));
    b.appendChild(el('small', null, p.sub));
    b.dataset.hz = p.hz;
    b.addEventListener('click', () => setA4(p.hz));
    ap.appendChild(b);
  });

  const tp = $('#tol-picker');
  tp.textContent = '';
  TOL_PRESETS.forEach(p => {
    const b = el('button', 'chip');
    b.type = 'button';
    b.appendChild(document.createTextNode(p.label));
    b.appendChild(el('small', null, p.sub));
    b.dataset.c = p.c;
    b.addEventListener('click', () => {
      State.tol = p.c; syncSettings(); State.save();
      Tune.gauge.drawBands(p.c); Free.gauge.drawBands(p.c);
    });
    tp.appendChild(b);
  });
}

function setA4(hz){
  State.a4 = Math.max(380, Math.min(470, Math.round(hz * 2) / 2));
  resolve();
  renderBox(); renderTeach();
  if (State.mode === 'tune') Tune.retarget();
  syncSettings(); State.save();
}

function syncSettings(){
  $$('#a4-picker .chip').forEach(b => b.classList.toggle('is-on', +b.dataset.hz === State.a4));
  $$('#tol-picker .chip').forEach(b => b.classList.toggle('is-on', +b.dataset.c === State.tol));
  $('#num-a4').value = State.a4;
  $('#rng-volume').value = Math.round(State.volume * 100);
  $('#rng-length').value = State.noteSeconds;
  $('#len-read').textContent = State.noteSeconds.toFixed(1) + ' s';
  $('#chk-bigtext').checked = State.bigtext;
  $('#chk-intervals').checked = State.showIntervals;
  $('#chk-autoadvance').checked = State.autoAdvance;
  document.body.classList.toggle('bigtext', State.bigtext);
  document.body.classList.toggle('no-intervals', !State.showIntervals);
}

/* 'auto' means: leave the page however we found it and let the device decide.
   When this page is embedded somewhere that has already stamped a theme on the
   root element — a reader who picked light or dark for themselves — that stamp
   is the answer in auto mode, so it is captured once at load and put back
   rather than wiped. Only an explicit choice here overrides it. */
const HOST_THEME = document.documentElement.getAttribute('data-theme');

function shownTheme(){
  if (State.theme === 'dark' || State.theme === 'light') return State.theme;
  if (HOST_THEME === 'dark' || HOST_THEME === 'light') return HOST_THEME;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark' : 'light';
}
function applyTheme(){
  const explicit = (State.theme === 'dark' || State.theme === 'light') ? State.theme : HOST_THEME;
  if (explicit) document.documentElement.setAttribute('data-theme', explicit);
  else document.documentElement.removeAttribute('data-theme');
  const now = shownTheme();
  $('#theme-glyph').textContent = now === 'dark' ? '☾' : '☀';
  $('#btn-theme').title = 'Switch to the ' + (now === 'dark' ? 'light' : 'dark') + ' theme';
}
function setTheme(t){ State.theme = t; applyTheme(); State.save(); }

/* ─────────────────────────────────────────────────────────────────────────
   17 · WIRING
   ───────────────────────────────────────────────────────────────────────── */

function fillInstruments(){
  const sel = $('#sel-instrument');
  sel.textContent = '';
  const groups = {};
  INSTRUMENTS.forEach(i => { (groups[i.family] = groups[i.family] || []).push(i); });
  ['Plucked', 'Bowed'].forEach(fam => {
    if (!groups[fam]) return;
    const g = document.createElement('optgroup');
    g.label = fam === 'Bowed' ? 'Bowed — played with a bow' : 'Plucked and strummed';
    groups[fam].forEach(i => {
      const o = el('option', null, i.name);
      o.value = i.id;
      g.appendChild(o);
    });
    sel.appendChild(g);
  });
  sel.value = State.instId;
}

function fillTunings(){
  const sel = $('#sel-tuning');
  sel.textContent = '';
  INST.tunings.forEach(t => {
    const o = el('option', null, t.name);
    o.value = t.id;
    sel.appendChild(o);
  });
  sel.value = TUNING.id;
  $('#field-tuning').style.display = INST.tunings.length > 1 ? '' : 'none';
}

function renderAll(){
  resolve();
  $('#sel-instrument').value = INST.id;      /* keep the picker honest */
  fillTunings();
  renderBox();
  renderTeach();
  if (State.mode === 'tune') Tune.retarget();
  State.save();
}

function wire(){
  /* --- instrument and tuning --- */
  $('#sel-instrument').addEventListener('change', e => {
    State.instId = e.target.value;
    State.tuningId = (INSTRUMENTS.find(i => i.id === State.instId) || INSTRUMENTS[0]).tunings[0].id;
    State.selected = 0;
    Audio_.stopAll(0.1);
    renderAll();
  });
  $('#sel-tuning').addEventListener('change', e => {
    State.tuningId = e.target.value;
    State.selected = 0;
    Audio_.stopAll(0.1);
    renderAll();
  });

  /* --- modes --- */
  $$('.mode-btn').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

  /* --- the strings --- */
  $('#stringbox').addEventListener('click', e => {
    const col = e.target.closest('.string-col');
    if (!col) return;
    const i = +col.dataset.i;
    selectString(i);
    if (State.mode !== 'tune') pluck(i);
  });

  /* --- reference tone controls --- */
  const drone = $('#btn-drone');
  drone.addEventListener('click', () => {
    State.hold = !State.hold;
    drone.setAttribute('aria-pressed', State.hold ? 'true' : 'false');
    if (!State.hold) Audio_.stopAll(0.25);
    State.save();
  });
  $('#btn-stop').addEventListener('click', () => Audio_.stopAll(0.12));
  $('#btn-hear').addEventListener('click', () => pluck(State.selected));

  /* --- microphone --- */
  $('#btn-mic-tune').addEventListener('click', toggleMic);
  $('#btn-mic-free').addEventListener('click', toggleMic);
  $('#sel-mic').addEventListener('change', async e => {
    State.micId = e.target.value; State.save();
    if (Mic.on){
      try{ await Mic.start(State.micId); syncMicUI(''); }
      catch(err){ syncMicUI(micMessage(err), true); }
    }
  });
  $('#btn-refresh-mics').addEventListener('click', fillMicList);
  if (navigator.mediaDevices && navigator.mediaDevices.addEventListener){
    navigator.mediaDevices.addEventListener('devicechange', () => {
      fillMicList();
      if (Mic.on) toast('The list of microphones changed.');
    });
  }

  /* --- settings sheet --- */
  $('#btn-settings').addEventListener('click', () => { fillMicList(); $('#dlg-settings').showModal(); });
  $('#btn-theme').addEventListener('click', () => setTheme(shownTheme() === 'dark' ? 'light' : 'dark'));
  if (window.matchMedia){
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemTheme = () => { if (State.theme === 'auto') applyTheme(); };
    if (mq.addEventListener) mq.addEventListener('change', onSystemTheme);
    else if (mq.addListener) mq.addListener(onSystemTheme);
  }
  $('#num-a4').addEventListener('input', e => {
    const v = parseFloat(e.target.value);
    if (!isNaN(v) && v >= 380 && v <= 470) setA4(v);
  });
  $('#rng-volume').addEventListener('input', e => {
    State.volume = e.target.value / 100; Audio_.setVolume(State.volume); State.save();
  });
  $('#rng-length').addEventListener('input', e => {
    State.noteSeconds = parseFloat(e.target.value);
    $('#len-read').textContent = State.noteSeconds.toFixed(1) + ' s';
    State.save();
  });
  $('#chk-bigtext').addEventListener('change', e => {
    State.bigtext = e.target.checked; syncSettings(); State.save(); Free.sizeCanvas();
  });
  $('#chk-intervals').addEventListener('change', e => {
    State.showIntervals = e.target.checked; syncSettings(); State.save();
  });
  $('#chk-autoadvance').addEventListener('change', e => {
    State.autoAdvance = e.target.checked; State.save();
  });

  /* --- about sheet --- */
  $('#btn-about').addEventListener('click', () => { renderAbout(); $('#dlg-about').showModal(); });
  $('#about-close').addEventListener('click', () => $('#dlg-about').close());
  $$('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

  /* --- keyboard --- */
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
    if ($$('dialog[open]').length && e.key !== 'Escape') return;

    if (/^[1-9]$/.test(e.key)){
      const i = +e.key - 1;
      if (i < ROWS.length){
        e.preventDefault();
        selectString(i);
        if (State.mode !== 'tune') pluck(i);
      }
      return;
    }
    switch (e.key){
      case 'ArrowRight': e.preventDefault(); selectString(State.selected + 1); break;
      case 'ArrowLeft':  e.preventDefault(); selectString(State.selected - 1); break;
      case ' ': case 'Enter': e.preventDefault(); pluck(State.selected); break;
      case 'Escape': Audio_.stopAll(0.1); break;
      default: return;
    }
  });

  window.addEventListener('resize', () => { Free.sizeCanvas(); });
  window.addEventListener('blur', () => { if (!State.hold) Audio_.stopAll(0.2); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) Audio_.stopAll(0.15);
  });

  Audio_.onchange = syncSounding;
}

/* ─────────────────────────────────────────────────────────────────────────
   18 · START
   ───────────────────────────────────────────────────────────────────────── */

function boot(){
  State.load();
  applyTheme();
  Audio_.volume = State.volume;

  /* a small always-visible reminder that the microphone is live */
  micIndicator = el('button', 'icon-btn mic-live');
  micIndicator.type = 'button';
  micIndicator.title = 'Microphone is on — click to turn it off';
  micIndicator.setAttribute('aria-label', 'Microphone is on. Click to turn it off.');
  micIndicator.innerHTML = '<span class="mic-dot" aria-hidden="true"></span>';
  micIndicator.hidden = true;
  micIndicator.addEventListener('click', toggleMic);
  $('.topbar-tools').prepend(micIndicator);

  resolve();
  fillInstruments();
  fillTunings();
  buildSettings();
  Tune.init();
  Free.init();
  renderBox();
  renderTeach();
  syncSettings();
  $('#btn-drone').setAttribute('aria-pressed', State.hold ? 'true' : 'false');
  setMode(State.mode === 'tune' || State.mode === 'listen' ? State.mode : 'play');
  syncMicUI('');
  fillMicList();
  wire();
  requestAnimationFrame(loop);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
