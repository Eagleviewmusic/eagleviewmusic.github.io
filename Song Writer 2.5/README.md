# Song Writer 2.5

**Song Writer 2.5** is Song Writer 2.0 plus Rhythm Poetry's way with rhythm, built
2026-10-01 from `../SONG-WRITER-RHYTHM-PLAN.md`. It is a separate copy:
Song Writer 2.0 is untouched beside it. Preview: launch entry **song-writer-25**
(port 8812). Everything below the 2.5 section describes what it inherited from 2.0.

## What 2.5 adds

| | What it does | Where |
| --- | --- | --- |
| **Undo / Redo** | Every edit is a step (100 a song); ↶ ↷ in the Edit box's title bar, ⌘Z / ⇧⌘Z (Ctrl-Z / Ctrl-Y). A run of quick tempo or pitch edits folds into one. | `js/history.js` |
| **Bars always right on paper** | A note that crosses a bar line is drawn as tied pieces (a half on beat 4 of 4/4: quarter ⁀ quarter); a line that stops inside a bar is finished with drawn rests (faint while editing). Drawn only — nothing stored changes. | `js/staff.js` (pieces, fillers), `js/timing.js` (spell, barPieces, fillPieces) |
| **Where am I in the bar** | The Rhythm caption's second line: *Bar 3 · beat 2½ · 1½ beats left* (or *runs over the bar line*), numbered as the staff numbers bars. | `rhythm-panel.js`, `timing.placeOf` |
| **Fill bar** | The selected note runs on to the bar line (or stops at it, if it crosses); written as the fewest values, tied when it needs two. Everything after slides. | `flow.fillBar` |
| **Tap in** | Play the line from the selected note with → (or Space / Enter / the pad) to a count-in and the steady beat: key down = the note starts, key up = it stops; let go early and a rest is left. Snapped to eighths or sixteenths (*Snap to* — after a take it re-snaps the same taps); Keep · Again · Cancel (= Undo). Words and pitches are never touched. | `flow.tap`, `#tap-panel` |
| **Edit ↔ Chords** | With the Chords workspace on and the hat on, a switch takes the Edit box title's place: **Edit** (the tools, with the editable chord panel at the foot, as before) or **Chords** — the box becomes the chord panel for playing: full height, no ✎ pencils (chords or Z X C V B), the left hand's keys (F D S A G R E Q W, Z X C V B, 1–5) play chords (since the three keyboards, they do so in both panes). Still in Edit: the selection, Undo, and the chord track — select a chord, then a chord key or tap writes it there. The hat coming off resets it to Edit; without the chords out there is no switch. | `edit-box.js` pane/setPane, `chord-strip.js` editable(), `app.js` keys, `chord-lane.js` |
| **Each mark on its own (notation)** | On a written line the selection box (and Light up → Box while playing) is the selected column's own — its note or rest, and its word only when the word is its own (the syllable's first column) — never the whole syllable with its connected notes and rests; the word's orange underline likewise, and a syllable is not tinted as one on hover. Lines of blocks (bar form) keep the whole-syllable box. | `staff.js` markBox, `score.js` `.sel-own`, style.css |
| **Rest (put a rest in)** | The Edit box's Rhythm row is now **Dotted · Tie · Rest**, each picture over its word (Rest's is a quarter rest). Rest lights and waits; the value circles show rests; the next value tapped puts a rest that long in **after** the selected note or rest — Dotted lit too makes it dotted. The rest joins the selected note's word (a wordless column after it), keeps its pitch (as rests do), and is selected; a tie from that note to the next is let go. Rest again (or the hat off) cancels. Removed when Layout settings switch rests off. | `rhythm-panel.js` (restPending), `score.js` insertRestAfterCurrent |
| **Syllables onto connected notes** | A word written whole on one note, with + Note Only notes for its other syllables, moves onto them as the song is formalized: **Space inside the word** (HEL\|LO) keeps HEL on the first note and sends LO to the next connected note as a syllable of its own (later connected notes stay with LO), and typing goes on in LO with the caret at its start — beau\|ti\|ful is two Spaces. A **double-click (double tap) in the words' row under a connected note** gives it a word: it and the notes after it become a new syllable; leave it with no word (Esc, or nothing typed) and it goes back on the word it came from. One way only — nothing turns a syllable back into a connected note; melismas can stay melismas. A tie into a note that gains a syllable is let go (a new syllable is a new attack). Staff on or off. Space in a word with no connected note still types a space; at the end of a word it still moves on. | `score.js` SYLLABLES ON CONNECTED NOTES (`splitWordAtCaret`, `wordUnderColumn`, `splitSyllableAt`, `mergeBack`) |
| **Everything drawn can be picked** | On a written line a tap goes to the head, rest or piece DRAWN nearest it (`staff.hitAt`, from a map each row keeps as it is drawn) — a tied note's second head, a rest sitting on the word before it, a stem — instead of the clear block under it or its word (which used to select the word's first note); in a chord, the nearest head. The pieces only the staff draws — a note tied over a bar line, the rests that finish a line — are made real when picked (`flow.realize`: the tied notes or rest columns they are drawn as, the same look and sound), so they can be changed; an edit keeps them (Undo takes the edit and the split back together), moving on without one folds them back. ← → in Edit step onto them too. In Perform a tap on a piece just picks its note. | `staff.js` hitAt, `score.js` staffHit, `flow.js` realize / stepPiece |
| **6/8 · 9/8 · 12/8** | Compound time, Rhythm Poetry's second family. The beat is a dotted quarter (three eighths): blocks count one, the BPM counts them (♩. = 100), so do the count-in and steady beat. Eighths beam in threes; written lengths and rests are spelled in dotted values (four eighths = ♩. ⁀ ♪, a beat's rest a dotted-quarter rest, a whole 12/8 bar 𝅝. — the new **dotted whole**). The tile: the **bottom numeral** swaps families keeping the beats (4/4 ↔ 12/8, 3/4 ↔ 9/8, 2/4 ↔ 6/8), the top cycles within one (12 → 9 → 6). The caption counts thirds (*beat 1⅔ · 1 beat left*); the beat strip shows three eighths (or six sixteenths) a beat, and Easy offers RP's compound set (♩. ♪♪♪ ♩♪ 𝄽♪ 𝅗𝅥. and 𝅝. in 12/8). Text header `[Time 6/8]`. | `core.js` METERS, `timing.js` (block = a beat, `tickMs`, compound spelling), `staff.js` (two-digit numerals), `app.js` tile, `beat-strip.js` |
| **Chords bend the keyboard** | Digital Accordion's *Chords bend the scale*: while a chord is in hand — played from the panel or its keys, stepped onto in the lane, or reached by Play, and until it is cleared, exactly as long as its keys stay lit — each of its notes the scale lacks takes the place of the scale's note on the same letter. V/V in C: the melody keys' fa (`;`, `M`, `9` — or Flex's F column) play F♯, and the keyboard's F♯ keys wear F's colour, their name and a white ring (Digital Accordion's mark), and play under Focus (F stays live only if the song uses it). V in C minor bends B♭ to B; a held ♭7 on I bends ti to B♭. A letter the scale lacks is left alone (pentatonic). A held note keeps the pitch it was pressed with. A new key or scale lets the chord go. **Layout settings → Chords on the panel → Chords bend the keyboard** (`layout.chordBend`, on unless switched off; travels with lessons and links) turns it off. The notes on the page are untouched — though in Edit a bent key writes what it plays, as tapping that piano key does. | `chords.js` bend / bendDelta, `keymap.js` stepMidi, `keyboard-dock.js` readSong (palette) · `.bent` |
| **The melody before the chord** | A chord's keys on the keyboard are background — where the harmony sits while the melody moves over it: the key as usual on top, a pale wash of the note's colour on its lower half and a full-colour lip along its front (a black key: its colour, muted). The melody's keys — the selected note with its lamp, and any key being played (a finger, the mouse, a computer key) — wear their full colour over them, and a played key goes back to the chord's wash when it is let go. | `keyboard-dock.js` paint (`--chord-c`, `--chord-ink`), style.css `.kkey.chord` |
| **Held chords, trilled suspensions** | Digital Accordion's way: a chord on the panel rings for as long as its block (a finger, the mouse) or its key is held — never shorter than a tapped chord's ¾ second, so a quick tap sounds as before — and its block stays pressed. A function key (Z X C V B, or a tab under a second finger) pressed or let go while a chord is held strikes it again, changed: hold I, tap C over and over — Isus4, I, Isus4, I. A change that leaves the notes as they were keeps it ringing. The keyboard's lit keys, the bend and the corner follow each strike. In Edit, a lane slot keeps the chord as it went down (holding the function key first still writes the changed chord, V⁷). The lane's own chords and Play are unchanged. | `chords.js` holdPlace / releaseHold / restrike, `audio.js` holdChord, `chord-strip.js` trigger(place, src, holder) / release, `keymap.js` |
| **Chord progressions — the engine** (phase 1 of `../Song Writer Chord Progressions/`, 2026-10-03) | A song can hold **progressions** (chords, each lasting its beats, and a rhythm every bar plays — *q q e e q* is ta ta ti-ti ta — or a chord's own) and a **chord track**: stretches of bars where they play (*Verse 1–8, Chorus 9–16, Verse 17–60*), with changes made just there (bar 8 = IV V). Play plays every strike on the audio clock and lasts as long as the **longer** of the melody and the chords — sixty bars of chords under three of tune play all sixty; past the melody no word is lit and each bar is announced (`track:bar`). A chord already ringing where Play starts sounds at once; *This line* past the melody loops its row of four bars; `SW.player.playFrom(tick)`. **The melody never moves the chords** (a melody that breaks the pattern does it on purpose). An old song's lane chords play from the track at the same moments, as loose chords; the first track change writes them in. No windows yet — phases 2–4 add the window, the map and the chords on the page; until then a track comes from JSON (the Library, a link) or the console. Checked: `SW.track.selfTest()` (27 checks), every saved and example song reads back identically, strike times logged at 100 BPM, Undo/Redo, seven kinds of melody edit leave the track untouched. | `js/track.js`, `js/player.js`, `js/score.js` (read / normalize / render) |
| **The Chord Progression window — Build** (phase 2, 2026-10-03) | **Chord Progression** at the foot of the chord panel (wherever the panel is — the left column, the Edit box's foot, the Chords pane; not in Present; not when a lesson leaves chords out), with the number of the song's progressions. It opens the window: on the left **the song's progressions** (tap one; ▶ hears it once round; **+ New progression** — the first chord picked makes it, so looking saves nothing; **Starters** — Pop, ’50s, Sad pop, Three chords, Folk, Pachelbel, 12-bar blues, ii–V–I, Andalusian, in roman numerals); on the right its **name**, **▶ Hear it** (round and round on the audio clock, ◌ beat adds the tick; a change while it plays is heard from that moment, nothing struck twice; Space), **Each chord − 4 beats +** (*1 bar*), the **chord cards** (name, notes, length, what it plays as dots; the selected card — or the dashed + — is where the next chord goes: + adds, a card is replaced; − + on the selected card give it its own length; × or Delete; drag, or ⌥← ⌥→, to move; ← → walk), **Pick a chord** (the panel's own blocks and set, F D S A G R E Q W 1–5, Z X C V B held or a tab held; More chords… = the chord editor on that chord), and **the rhythm** every bar plays — the beat strip's pills (a tap: strike → rings on → silence; ⛓ between beats; + − sixteenths) or **Easy** circles, the rhythm in notes above, Rhythm Poetry's **Simplified Kodály** words below (*ta ta ti-ti ta*), presets for the meter, **2 bars**, and **Its own** for the selected chord (a copy of what it was playing; longer, it repeats by the bar). Footer: Duplicate, Delete (asks, in place), **Put it in the song** (from the first bar with no chords to the end of the melody, or once through past it — a toast says where; the map is phase 3), Done. ↶ ↷ and ⌘Z are the song's Undo. **Explaining notes fold into an ⓘ** (`SW.ui.note`; tap the ⓘ at a note's end, tap it again to open; remembered on this device in View `foldedNotes`). Phones: a full-height sheet, the progressions in a row across the top. | `js/components/progression-window.js`, `chord-strip.js` (the button, `openSpecEditor`, shared blocks), `core.js` (`ui.note`), `app.js` (keys to the window when it is on top) |
| **The Chord Progression window — In the song** (phase 3, 2026-10-03) | The window's second tab (**Build · In the song** in its head): a **map** of the song's bars — numbered as the staff numbers them (a pick-up is a narrow bar 0) — with the melody's lines over their bars (their names and first words; *no melody yet* after them) and the **stretches of chords** in each progression's own colour (the same colour edges its card in Build), their chords named along them, white corners where a chord is changed just there. **Tap a band** to select it: its card gives **From bar**, **to bar**, **N times through**, **to the end of the melody** (on and off), **Starts on chord**, the **changes just here** (each with ×, and Clear them), Edit, Play from its bar, **Take it out of the song** (or Delete). **Drag its ends** (orange grips) to trim it — the chords stay over their bars; **drag its middle** to move it — its changes just here go with it. **Drag along the bar numbers** to select bars (shift-tap: from the playhead), then tap a progression under **Put in** to fill exactly those bars — or *Take the chords out of these bars*; **drag a progression** onto a bar (it runs to the end of the melody, or once through past it); tapped with nothing selected, it goes in at the first bar with no chords. Stretches never overlap: one put over another takes those bars, and the other carries on afterwards on the chord it would have played. **▶ Play the song** from the playhead (tap a bar number, or ← →; Space plays and stops): the toolbar's Play, with a playhead that follows the music (`SW.player.position()`), the stretch playing lit, a tempo change carried on. Build's **Put it in the song** turns to this tab with the new stretch selected. Phones: the head on two rows, the map scrolls under a finger (the numbers row selects), grips with a finger-sized reach. | `js/components/progression-window.js` (IN THE SONG), `js/track.js` (`clearBars`, `setStretch` here:null, `shown`, `lastOf`, `cycleBeats`), `js/player.js` (`position`) |
| **The chords in the score — and Just here** (phase 4, 2026-10-03) | With the chords out (the Chords workspace), the **chord track** is drawn above every line in the row the chord lane kept (now a spacer, a little taller): each chord a bar of its root's colour from its first beat to the next chord's, its name at the left, its strikes as dots (a line while one rings); the stretch's first chord carries the progression's name (*Verse ▸*), its last an end stroke; a chord changed just here wears a white corner; a chord still sounding where a wrapped row begins is named again in brackets, *(I)*. Placed by the staff's own measurement (each column's centre — the offset walk — the pieces and rests it draws to finish a bar, and each row's end at its last word, which reaches the bar line), proportionally between them, so a chord on beat 3 of a half note sits halfway along it; lines of blocks the same (their silence before the next line gets a short tail). **Tap** a chord: Perform — hear it; Edit — select it (orange ring; a chord key or a block on the panel then puts that chord there, just here; **Delete** makes it silent; **Enter** opens Just here; **← →** walk the chords; Play starts from it). In Edit an empty bar shows a faint **+**: tap it and press a chord key (it becomes loose chords). **Double-click** (double-tap) a chord — Perform or Edit — for **Just here**: *"Verse plays vi here (2nd time through). Only bar 8 changes — Verse stays as it is."*; One chord · Two · Four (− + move the beat between them); the panel's board and keys (the next card is ready after each chord), More chords…, No chord; the progression's rhythm or **Its own** (the Build strip); **Back to Verse**; **Change it in Verse too** (one whole chord). Every change is one Undo step. **After the melody**: the bars of chords past the last line, under it, as a chord chart (4 bars a row, 8 on a wide stage), with *+ Add a line — it starts at bar N* (Edit) and ▾ to fold it (remembered). Play lights the chord sounding and the chart's bars, and follows them. The old lane's picker is gone: a tap in the row between chords is the track's; an old song's lane chords show on the track as *From the lane*. **Save picture** has the chords and the chart. Present shows them (no +, no Add a line). | `js/components/chord-track.js`, `progression-window.js` (JUST HERE), `chord-lane.js` (spacers), `chord-strip.js` / `app.js` / `player.js` / `library.js` (hooks) |
| **Chord progressions — tidied and handed over** (phase 5, 2026-10-03) | **The lane is retired**: its picker, its chosen slot and its writes are gone (`chord-lane.js` now only keeps the row's room and hands a tap there to the track); an old song's lane chords still show and play, as *From the lane*, until the first change writes them into the track. View → On the stage: **Chord track** (was *Chord lane*; same switch, `showLane`); View → On the page: **Chord rhythm** (the dots, `chordRhythm`); Sound → **Chords** = *the chord track, in its rhythm*. **A new scale** (Layout settings → Melody follows the scale on): every chord picked from the panel — in a progression, a just-here change, loose chords — becomes that key's chord in the new scale (C major → C minor: I iii V ii → i ♭III V ♭VII, as the panel shows them); chords from More chords… stay; off, nothing moves. **A new time signature**: lengths stay in beats (each chord one bar stays one bar); rhythms go over beat by beat — 4/4 ↔ 12/8 each beat to its twin (♩ ↔ ♩., ♫ ↔ ♪♪♪, ♬ ↔ ♩♪), so the round trip comes back exact; 4/4 → 3/4 drops a bar rhythm's last beat, 3/4 → 4/4 copies its last beat; a bar changed just here (or a bar of loose chords) stays a whole bar. Both are in the same Undo step as the change. **Set up for students → Chords: listen only** (`policy.task.chordsLocked`): the student hears and sees the progressions — the button, the window (marked *Listen only*: the progressions, their cards and rhythms, Hear it, the map, Play) and the track — and nothing changes them (the same window, read-only; a guard on it stops every other control; in the score no selection, no +, no Just here). A task that keeps the melody (Write the words, Read and sing) opens it the same way. The help sheet's *Chord lane* is now **Chord progressions** and **The chord track**. Checked: `SW.track.selfTest()` (now 33 checks), major → minor on and off with Undo, 4/4 → 12/8 → 4/4 exact, 4/4 → 3/4 → 4/4, an old lane song (shows, plays, first change writes the track and clears the syllables, one Undo back), a real student link opened in a new tab (every edit control tried, the song unchanged), Undo/Redo across meter + scale. | `track.js` (`followScale`, `followMeter`), `score.js` (setScale / setMeter call them), `chord-lane.js`, `progression-window.js` (LISTEN ONLY), `settings.js` (`can('chordsListen')`, the switches), `lessons.js`, `chord-strip.js`, `index.html` (help; the lane's popover gone), `style.css` |
| **Beats** | Rhythm Poetry's beat pills for the selected bar, at the foot of the stage: tap a dot to start or stop a note, ⛓ joins a beat to the next, + / − sixteenths, **Easy** = one-tap rhythms (♩ ♫ ♬ 𝅗𝅥 𝅝, the lit one again = a rest); ‹ › walk the bars. The words that start in each beat are written under it. | `js/components/beat-strip.js` |
| **Three keyboards** | The letter and number keys follow what is out. **Chord panel out** (keyboard or not): Digital Accordion's two hands — the left plays the chords as before (F D S A G R E Q W, 1–5, Z X C V B held), the right plays the melody by scale step from the tonic: **J** = do, **K L ; U I O P** up to do′, **7 8 9 0 -** on to la′, **N M , . /** = mi … ti below. **Keyboard alone**: the Virtual Keyboard's **Flex** — rows Z, A, Q, 1 each climb ten steps of the scale from do, an octave apart (Z from do an octave down, A from do). **Neither**: 1.0's solfège letters in Edit, as before. The notes follow the key and the scale menu (in F, J K L ; = F G A B♭; in a pentatonic scale each key is the next of its five notes); do is the song's own do (Digital Accordion's tonic in every key; the Virtual Keyboard's A row in every key but G, where it sits an octave higher with the blocks). ⇧ or Caps Lock: Digital Accordion's 8va (melody up an octave) / Flex's (Z row down, number row up). A melody key is the keyboard's key: it rings while held, lights a key, and in Edit sets the selected block as a tap on the key does — so with the chords or keyboard out the solfège letters give way. **Lights**: Digital Accordion's keys light their own note (the same note in the nearest octave showing when it is off screen). The Flex keys light what the Virtual Keyboard lights — by a key's PLACE in its row, not its pitch: one octave showing, every row lights the A row's note at that place (`,` lights the C above `A`'s, though both play the same C); two, the Z and Q rows light the lower run, the A and number rows the upper; three or four, each key its own note; a short scale's notes past the top light lower. That rule only holds on the Virtual Keyboard's window, so with only the keyboard out the dock shows it (`vkWindow`: the tonic's white key an octave below do — at do with one octave — to keyDisplayRanges' end note, 17 or 18 white keys for two; a black end note, F♯ in D, brings the white key above it, which never lights). A song too wide for it moves the window whole octaves, only when the selected note leaves it, and the lights move with it. The keyboard now runs C2–C8 (four octaves in G reach B7). Checked against the Virtual Keyboard's own `getNoteMapping` on 2026-10-02: 69,120 presses (12 keys × 18 scales × 1–4 octaves × Shift), every sound and every light identical. | `js/keymap.js` (flexLight), `keyboard-dock.js` keyDown/keyUp, vkWindow, chooseFlexStart, `app.js` |

**The flow** (`js/flow.js`). A line is read as TIME (onsets: where sounds start, how
long, where it is silent) and the MELODY STREAM (its pitches in order, each carrying
its word; a syllable's notes stay together). A rhythm tool changes the onsets and
pours the stream into them: adding a note pulls the next pitch-and-word in, taking
one away pushes them along; what is left over waits at the line's end as blocks;
an onset with no pitch left is a **ghost** — the pitch before, hollow and dashed,
wordless, until it is given a pitch (`cols[].ghost`). Rests with no word belong to
the rhythm and come and go; nothing with a word is ever deleted, and the flow never
leaves the line. `SW.flow.selfTest()` checks the contract: every line poured into
its own onsets comes back byte-identical (true for the three examples and the test
songs, 2026-10-01).

**Storage**: 2.5 has its own keys (`song_writer_25_*`). On its first run it copies
2.0's library, View and Layout settings and lessons across once; 2.0's keys are
only read. New View prefs: `tapDetail` (snap to sixteenths), `showBeats`.

---

# Song Writer (folder: Song Writer 2.0)

Song Writer 1.0's melody-first song writing — solfège blocks rising over the
words — rebuilt as the fourth member of the Eagle View Music family beside
**Rhythm Poetry 2.0, Ostinato Builder 2.0 and the Music Stand**: the same
frame, the same controls in the same places, the same windows and wording,
with every 1.0 and 2.0 function kept. Song Writer 1.0 stays untouched beside it.

The redesign (2026-09-25) followed `../Song Writer Redesign/` (DESIGN.md,
FEATURE-MAP.md, DECISIONS.md — every recommendation taken). The folder keeps
its name and its storage keys (`song_writer_2_*`), so saved songs carry on;
on screen the app is simply "Song Writer".

Preview: `.claude/launch.json` entry **song-writer** (port 8797), or the
`music-stand` server at `http://localhost:8795/Song%20Writer%202.0/`.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | The shell: top bar · task strip · workspace grid · toolbar, and every sheet/popover. |
| `style.css` | Rhythm Poetry 2.0's design system in Song Writer's plum; 1.0's blocks scaled by `--bs`; the edit layer in the hat's orange; phone / tablet / short-screen / smartboard / touch rules. |
| `songs.js` | 1.0's three examples and the new-song text, unchanged. |
| `js/core.js` | `SW` namespace, **event bus**, session state (incl. Sound), 1.0's music tables (verbatim), note values, meters (30–300 BPM), UI helpers (popovers, hover gauges, toolbar height). |
| `js/audio.js` | Every sound, played by Key Blocks' engine (`lib/audio.js` — the Virtual Keyboard's sounds): a Melody side and a Chords side, each with its own sound and volume, and Room (reverb); 1.0's frequencies, voicings and lengths; the count-in click; chords on the audio clock. |
| `js/chords.js` | **The chord engine** (`SW.chords`, 2026-09-27) — Digital Accordion's chord side, ported: the song's scale decides the fourteen chords of the **board** (places F D S A G R E Q W, 1–5), Z X C V B functions (sus2 add9 sus4 ♭7 maj7 and the inversions 6 6/4 6/5 4/3 4/2), Core · Full · Extended · Extreme, voicings (inversions, Digital Accordion's, or 1.0's nine), names and notes in the song's own key spelling, and the chord id every part of the app stores (`V7`, `bVI`, `V:inv64`). |
| `js/engrave.js` | Note-value pictures from the Leland glyphs. |
| `js/score.js` | The score editor — 1.0's engine, function for function — plus the JSON model, 1.0's text format, the section heads, and the functions the edit layer calls. |
| `js/timing.js` | The one reading of the song's time: ticks per column, bars, beats, beam groups — shared by the staff and the player. |
| `js/components/progression-window.js` | **The Chord Progression window** (2.5, 2026-10-03): Build — the song's progressions, chord cards, the panel's board, the rhythm (the beat strip's pills, Easy circles, counting words, presets), Hear it, Starters, Put it in the song. |
| `js/components/chord-track.js` | **The chord track in the score** (2.5, 2026-10-03): the chords drawn over every line, the faint + on an empty bar, selection and keys, play lights, the chords after the melody (`#chord-tail`). |
| `js/track.js` | **Chord progressions and the chord track** (2.5, 2026-10-03): the model (`progressions`, `track`), rhythm strings ↔ cells, the bar grid, the chords in time with every strike (`events()`), the writers the windows use, the old lane read as loose chords, `selfTest()`. Design: `../Song Writer Chord Progressions/`. |
| `js/staff.js` | **Staff notation in the score.** The engraver: spaces each written line (by note length, accidentals, words, bar lines), packs and justifies its rows, then draws one SVG per line behind the blocks: staff, clef, key and time signatures, coloured noteheads, stems, flags, beams, rests, bar lines, **bar numbers**, names, the selection ring. |
| `js/player.js` | Play: count-in, steady beat, Melody/Chords, At the end (Stop · Go round · This line), light-up, tempo changes while playing — all on the audio clock. |
| `js/library.js` | Library window, sandbox, auto-save, the name window (New · Save as · Rename), share links, backup/restore, Start over, Save picture. |
| `js/settings.js` | View preferences (the workspace switch, sizes, colours), the Sound popover, Layout settings, `can()` gates, the lesson tempo rule, the policy pass. |
| `js/lessons.js` | Set up for students: tasks, key & tempo, exercises, `#lesson=` links, preview, Start again. |
| `js/components/*.js` | Chord panel (+ the corner, the chord editor and the Z X C V B chooser), the row above the words (the old chord lane), keyboard dock, the value circles, and the Edit box (below). |
| `js/app.js` | Start-up order, the key + time tile, BPM chip, Play, step pad, Present, the keyboard map. |
| `lib/theory.js`, `lib/keyblocks-layers.js` | **Vendored** copies of `Digital Accordion/theory.js` and its `lib/keyblocks-layers.js` (the chord-modifier engine) — see `lib/README.md`. |
| `lib/notation/glyphs-leland.js` | **Vendored** copy of `notation assets/glyphs-leland.js`. |
| `lib/evm-library.js`, `lib/evm-shelf.*`, `lib/evm-count-in.*` | **Shared** EVM Library modules — byte-identical copies, checked by `../EVM Library/check-copies.sh`. |

Scripts are classic (no build step); each is an IIFE that registers on `window.SW`
and calls the others through `SW` at call time.

## Layout — one row at the top, one at the bottom

```
┌ topbar ─ ‹ Eagle View ▮▮▮ Song Writer │ ( Song | Keyboard | Chords ) │ Clear · Auto-save · Library chip ┐
├ task strip (lesson only) ─────────────────────────────────────────────────────────────────────────┤
├ workspace grid ───────────────────────────────────────────────────────────────────────────────────┤
│  chord panel  │  score: lines → [section head] [staff svg] syllables → [chord slot] [blocks] [word]   │
│  (left hand)  │  (+ Add a line, in Edit)     with the hat on, the Edit box takes the whole left column │
├───────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
│ chord in hand │  keyboard dock: rainbow keys in a black frame, the whole width  (grip on top: height)  │
│ 1 2 3 4 Focus │  (with the panel away, [1 2 3 4 · Focus] sits at the dock's left end as before)        │
├ toolbar ─ ▶ ⛑ │ C 4/4 [Major ▾]  100 BPM  Sound │ Write Names View │ Present ……………………………… ‹ › ┤
```

- **Top centre — Song · Keyboard · Chords** (Rhythm Poetry's side switch; the
  Stand's Poem · Both · Ostinato): what is on the stage. Song = the song alone
  (1.0's look); Keyboard = + a keyboard that lights the melody; Chords = + the
  chord panel, the chord track and the keyboard. View → On the stage sets the
  parts one by one (a mix that matches no tab lights none).
- **The name** opens About at every width (1.0's rule); below 720 px only the
  three-block mark shows.
- **The toolbar** is a three-column grid: an empty left column that gives way
  first, the family's centred cluster, and the step pad pinned right.
  **Play** first; **the construction hat** in the family's beat-dot place — a
  toggle, as in 1.0; while it is on the **Edit box** is out (below);
  the **key + time tile** (tap the letter for the key, tap the top numeral for
  4 → 3 → 2); **the scale menu** beside it (Digital Accordion's nineteen scales,
  grouped as its menu is — the song's, saved with it). **The scale runs the
  melody** (2026-09-29; core.js THE SCALE, score.js PITCH): Do is always the
  scale's tonic, so D Phrygian's E♭ is ra; ↑ ↓ walk the scale's notes inside
  the allowed range; a letter key writes its step as the scale has it (D is
  me in minor; a step the scale skips is written as major has it, with a
  toast); the harmony button adds two scale steps up; the keyboard dock
  writes a pitch in the scale's spelling (fi in Lydian, se in blues, si in
  whole tone); names are the block's own pitch (letter with its ♯/♭,
  chromatic solfège ra me fi se le te); the staff takes the key signature of
  the scale's seven-note frame (`signatureScale`: C minor, minor pentatonic
  and blues with three flats, D Dorian none, D Phrygian two); a key the menu
  offers under two names is spelled as the scale needs (`spelledKey`: D♭
  minor is written and offered as C♯ minor; pitch, lessons and storage keep
  the chosen key). Blocks are unchanged — a rung plus a ♯/♭ from major — so
  every scale's notes are 1.0 blocks and nothing stored changes. It also
  rebuilds the chord panel, recolours the keyboard and, with Layout settings →
  Keys → **Melody follows the scale** on (the default), moves the melody into
  the scale — `morphToScale`. **Accidentals are scale-specific** (SCALE
  MEMORY in score.js): a note is its step (the melody's rung) plus, for each
  scale where it was fine-tuned with ♯/♭, that scale's own pitch (`data-step`,
  `data-alt`; saved as `notes[].step` / `notes[].alt`, JSON-FORMAT.md). A
  scale with no fine-tuning for a note plays that scale's form of its step:
  each scale gets a frame of seven steps (major pentatonic borrows its gaps
  from major, minor pentatonic and blues from natural minor), mi → me, and a
  step the scale skips lands on its nearest note (the lower of two as near):
  fa → mi and ti → do′ into major pentatonic, re → me and le → so into minor
  pentatonic. So the Star-Spangled Banner's fi is major's only — plain fa in
  minor, fi again back in major — and each scale's own tweaks come back when
  it is chosen again. ♯ ♭ fine-tune the current scale; moving a note (↑ ↓, a
  letter key, the keyboard) rewrites it in every scale. Off, notes stay as
  they are and become the new scale's version; ↑ ↓ and the letter keys follow
  the scale either way. Loading a song never moves anything);
  the **BPM chip** (tap to type 30–300; a mouse resting on it shows
  the slider); **Sound**; **Write** (Edit only); **Names** (1.0's glasses);
  **View** (a mouse resting on it shows the Scale slider); **Present**; and at
  the right the **step arrows** (the right hand, opposite the chord strip).

Widths (checked): one row top and bottom at 1920, 1366, 1280 and 1024 in
Perform and Edit, Chords included (labels give way to icons from 1100); the
toolbar is the same in Edit, since the tools are in the Edit box. ≤ 720
(phones): the family's two-row toolbar; popovers pin above the toolbar and
windows become bottom sheets.
≤ 560 tall: smaller bars. ≥ 1500 wide (smartboards): bigger bars, and Justify
width enlarges the music (to 160%). Touch and smartboards: a bigger Edit box,
hit collars on small targets, no latched hover, section tools on the selected line,
press-and-hold for a button's name, and double-tap on a block moves it a step.

## The Edit box — no ribbon

2.0's edit ribbon is gone. With the hat on, every tool that acts on the
selected note is in **one box** (`js/components/edit-box.js`, 2026-09-25 — it
replaced the tools drawn around the note and the value drawer in the toolbar).
Since 2026-09-28 it no longer floats: it is the workspace's **left column**,
from the stage's top to the toolbar — the chord panel's place and the corner
under it, beside the keyboard when that is out. With the chords on, the chord
panel itself moves to the end of the box's scroll (`#eb-chords`, under the
Staff notation switch; `edit-box.js seatChords`) while the hat is on — 300 px
tall, small ✎ pencils so the names stay readable. Chords play a minor part in
Edit, so they wait below the tools until scrolled to, and can still be edited
there. The corner under the panel is away while editing (the
keyboard's 1–4 / Focus go back to the dock). It stays out for as long as the
hat is on; nothing is drawn around the note, so the song does not move when the
hat goes on.

```
┌─────────────────────┐
│ ⛑ Edit              │   the title
├─────────────────────┤
│ RHYTHM              │   the value circles (rhythm-panel.js) and caption
│ ▮  𝅝  𝅗𝅥             │
│ ♩  ♪  𝅘𝅥𝅯             │
│ • Dotted ‿ Tie 𝄽 Rest│   2.5: picture over word; Rest + a value = a rest after
│ ⇥ Fill bar ⋯ All    │   ⋯ writes / unwrites a line or the song
│ NOTE                │
│ ♯ Sharp   ♭ Flat    │   1.0's rules (no mi♯, no do♭ …)
│ ⧉ Harmony       −   │   a note two steps above / take the selected away
│ SYLLABLE            │
│ (  ● ● ●        − ) │   a dot per note on this word; − takes one away
│ + Note     + Note   │   the two ways to add a note, side by side: with a
│  /Syllable   Only   │   syllable of its own after this one, or connected
│ WORDS & LINES       │
│ ↰ Join up ↵ New line│   Join up on a line's first word only; New line
│                     │   starts the line AT the selected word (2026-10-01)
│ ♪| Pick-up          │   a new line here with a pick-up; lit in one:
│ 𝅘𝅥𝅯 ♪  ♩  𝅗𝅥 /  ♪. ♩. 𝅗𝅥.│   Remove pick-up. Chips: what it is worth
│ ×      Delete       │   delete takes two taps
│ Staff notation  ◯━  │   View → Staff notation, the same setting
└─────────────────────┘
```

- **Its column**: `--eb-w` wide (200 px; 204 touch, 172 phone, 228 from
  1500 px); its body scrolls when the window is short. Until 2026-09-28 it was
  dragged by its title bar and folded (`song_writer_2_edit_box_v1`, no longer
  read).
- **Still targets**: what Layout settings or a lesson take away is removed
  (a words-only lesson leaves just "Tap a word to type it"); a tool that
  cannot act on the selection just now is greyed, so no button moves. The word
  tools grey while a word is being typed (`words:typing` from score.js).
- **Staff notation** at its foot is View → Staff notation itself
  (`view.showStaff` through `setView`): off in either place is off in both,
  and every column shows as a block with its value marked underneath.
- **Focus**: the box never takes the focus, so a word being typed stays open
  and the keys keep working after a tap in it.

- **Rest** has no button: tap the lit value circle again (or the block circle
  on a block) — RP's EASY rule.
- **Section heads**: each line's name sits in its corner; in Edit it is typed
  into, with ▲ ▼ ⧉ × beside it (on the line you point at, or the selected
  one). ABA mode is gone. **Add a line** ends the song in Edit.
- **Chords in the song** (Chords tab): **Chord Progression** under the panel
  opens the progressions' window (Build · In the song); the chord track over
  the words shows them — in Edit select a chord and a chord key changes it
  there; double-click one for Just here. Otherwise the panel only sounds.
- Everything that edits is one layer under `body.editing`, hidden in Present
  and in a saved picture.

## Every 2.0 function, and where it went

The full checklist is `../Song Writer Redesign/FEATURE-MAP.md`. In short:

| 2.0 | Now |
| --- | --- |
| Perform / Edit tabs (top centre) | The hat beside Play — a toggle again |
| Ribbon → Note (rest, ♭ ♯, connected, harmony) | The Edit box's Note and Syllable sections; rest = the lit circle again |
| Ribbon → Value (circles, dot, staff card) | The Edit box's Rhythm section; the card is its caption; ⋯ writes/unwrites a line or the song |
| Ribbon → Syllables (+ ↵ trash) | The Edit box: + Note/Syllable beside + Note Only; Words & lines (New line, Delete) and the new Join up |
| Ribbon → Song (Text, ABA) | **Write** on the toolbar; section heads |
| Key button, 4/4 popover (meter, tempo 40–200) | The key + time tile; the BPM chip (30–300) |
| Names, Colours, Chords, Songs buttons | Names (glasses icon); View → Section colours; the Chords tab; the Library chip |
| ▼ minimize | **Present** (Play · ‹ › · Exit, full screen) |
| View → Workspace / Sound | Top centre / the **Sound** popover |
| Songs sheet, Copy picture | **Library** window; **Save picture** (download, and copied where allowed) |
| Song words | **Your words**: Words, or Words and notes (1.0's bracketed text) |

New from the family: Present, count-in and the shared "Get ready" card, steady
beat, At the end (Stop · Go round · This line), Melody on/off, Light up the
notes, bar numbers, the hover sliders, tap-the-numeral meter, the Library
groups (Sandbox · books · Shared with you · Your songs · Examples) with
"4/4 · 100 BPM · 3 lines" sublines, the name window for Rename, `Delete "X"?`,
a blank New for a fresh sandbox, lesson tempo rules, Sound options and Present
mode in the lesson's "What else comes with it".

Fixed: Your words keeps the meter and tempo; no empty line from ↵; Preview as
a student never writes to the teacher's songs, and Start again works in it; a
reload keeps a lesson (sessionStorage); two lessons with one title no longer
share exercises; leaving unsaved changes (auto-save off, or a shared song)
asks first; Esc closes windows; no shortcuts while the Teacher Library is
open; 1–9 pass through when the strip is hidden; About at every width; the
keyboard never slides past its ends; the toast, preview bar and popovers sit
above the toolbar's real height.

## Blocks and notes — the staff

The idea of the app is melody first: blocks carry pitch, and the rhythm is
whatever the performer's arrows make it. **Writing** a block gives it a note
value, and from then on it is drawn as a note on a treble staff, in its
place; the other blocks on the line stay blocks — standing on the staff —
until they are written too.

- A column is a **block** (no `v`) or a **note** (`v`, `'q'` included). A
  1.0 song is all blocks.
- **Dotted before or after** (2026-09-25): the dot on a written note dots it; on a
  block (or a value with no dotted form) it lights and waits, and the next value
  tapped (or `]` / `[` on a block) is written dotted — the circles show the dotted
  shapes while it waits, and a whole or sixteenth says it is written plain.
- **Tie** (the Edit box's Rhythm section, `score.js` TIES, 2026-09-25): holds the
  selected note over into a NEW eighth note (editable like any other) right after
  it on the same syllable — a note with no syllable of its own, as + Note Only
  makes — and selects it; on a bar's last beat the eighth lands over the bar line
  and the tie crosses it. The first column carries `tie` (`data-tie`); timing.js
  pairs it with the next column's matching pitches: the staff draws a crescent
  under the heads (over them for a down stem; in a chord the top one goes up),
  the words are kept clear of it, the player strikes the pitch once for the whole
  chain — and so does selecting: stepping onto, clicking or rewriting the held
  note does not sound the tied pitch again (score.js `soundColumn`; a harmony
  note added to it still sounds) — and with the staff off a small arc joins the
  two marks. Tie on a tied note
  unties it; a block or a rest cannot be tied; − on the held note drops the tie.
- **Value circles** (the Edit box): tap a circle on a block to write it, and the selection
  steps to the next column, so a phrase is written one tap per note — the
  circles never move. On a note, a tap just changes the value. The lit circle
  again makes a rest; the block circle unwrites a note. `[` `]` step the value.
- **The staff** appears behind a line as soon as one of its columns is
  written: left-aligned, clef and key signature on every wrapped row, the time
  signature on the first, **bar numbers** over the bar lines (Layout
  settings; bar 1 unnumbered, as in print). Noteheads keep their block colours
  inside an ink outline; a notehead sits exactly where its block's top was
  (`geometry()`; the staff shifts with the key).
- **Engraved spacing** (`staff.js` `planLine`, 2026-09-25): each note gets
  room by its length (quarter 3½ staff spaces head to head, ×√2 per doubling),
  widened for accidentals, dots, flags, seconds, the word under it and the
  lane's chord; bar lines get room of their own; words stay inside their bars.
  Rows break only on bar lines (a bar too wide for any row breaks between
  words, never inside a beam), the fewest rows, balanced so no bar is left
  alone; every row of a wrapped line is justified, a line's last row stretches
  at most 1.5×. The plan reaches the layout as `--sx-*` custom properties
  (style.css "ENGRAVED SPACING") — no syllable is ever moved. A row whose
  stems, beams or ledger notes reach past the usual room gets more above it
  (`--sx-rise`).
- **The words fit each row** (`--sx-drop`, 2026-09-25): while a row still
  has a block in it, its words stay under the blocks' feet, as before; a
  row of notes only brings them up to just under its lowest ink — the
  bottom staff line, the lowest head, a down stem or beam, a sharp hanging
  under a head, a name, or the clef's tail when a long first word reaches
  under it — and a low note takes them down again. Per visual row, so a
  wrapped line can have a lifted row under a row of blocks. The staff
  redraws when the bars' height transition ends (a block-size change at a
  new width used to leave it drawn on the bars' old feet).
- **Engraving:** Leland glyphs throughout, accidentals included (they were
  Noto Serif text before); accidentals hold to the bar line (a second F♯ in
  the bar gets none, a plain F after it a natural) and stack in columns in a
  chord; stems 3½ S reaching the middle line, flagged notes a little longer so
  a down flag clears its head; stems 0.16 S and beams 0.6 S thick (a little heavier than print, by request), slanted with the melody (level
  for repeats and dips/peaks), ends on quarter spaces; stubs for a lone
  sixteenth; dots in spaces, clear of an up flag; whole rest centred in its bar.
- **Time:** a block counts as one beat until it is written; each line starts a
  new bar; bar lines and beams only inside runs of written notes.
- **Pick-ups are a line's own** (2026-10-01, the user's design; score.js
  PICK-UPS, timing.js PICK-UP). A line's `data-pickup` / `lines[].pickup` is
  the value it is worth (`s e e. q q. h h.`, shorter than a bar); its bar
  lines fall that much in (bar 0 is the pick-up), beats and beams are
  counted from them. Made two ways: **Layout settings → On the page →
  Pick-up (first line)** switches the first line's; **Pick-up in the Edit
  box** (Words & lines), on a selected note, starts a new line AT that word
  (as New line does) opening with a pick-up worth the word's own length (a
  beat for a block) — or, on a line's first word, gives that line one. With
  the selection in a pick-up (a word starting inside it) value chips appear
  under the button (plain values over dotted; hidden otherwise, 2026-10-01,
  less clutter) and re-value it; the button then reads **Remove pick-up**, which joins the line back
  onto the line above (the first line just starts on the downbeat). The ×
  over a pick-up's bar line (Edit; staff.js `syncCut`) does the same. Notes
  are never rewritten: the bar line falls after that much music, even
  through a note. A line pads on (silence) until the next line's pick-up
  lands on its bar line, so every downbeat sits on one grid, a line before
  a pick-up ends without a closing bar line, and bar numbers count from the
  first whole bar. The steady beat's accent follows the grid; a count-in
  into a pick-up stops where it comes in (1 2 3 · a beat's pick-up on 4; 1 2
  3 4 · an eighth's on the "and"). Join up and Delete are ordinary on a
  pick-up now. History: 2026-09-25 a 1-beat pick-up on every line (Layout
  switch; Join up / Delete / × took one line's away), 2026-09-28 the song's
  own (`score.pickup: 1`, `[Pickup 1]`); both still read — every line that
  kept its pick-up gets a quarter (`normalizeScore`, `normalizeSong` for the
  older `layout.show.pickup`).
- View → **Staff notation** off shows every column as a block again.

Not yet: cross-staff (kneed) beams for very wide leaps. (6/8, 9/8 and 12/8 arrived in 2.5.)

## Touch screens and smart boards (tested 2026-09-27)

`../.claude/sw-touch-test.mjs` (run with the Bash sandbox off: `node .claude/sw-touch-test.mjs
http://localhost:8808/`) drives headless Chrome with **real touch events**, a strict autoplay
policy (audio needs a user activation, as on a real board) and an AnalyserNode spliced onto
the output to measure what actually sounds. Five profiles — a 1080p board, a 4K board at
150 %, iPad landscape and portrait, a phone — × 13 checks: the very first touch on a chord
sounds; a second chord; a Z X C V B tab held with one finger while another taps a chord (V⁷,
let go on the lift); no press-and-hold label while a tab is held; the names, ♪ notes and set
buttons; in Edit the pencils open the editor and the chooser and a slot tap writes a chord;
the corner's Octaves and Focus; a keyboard key sounding under a finger and releasing; a long
press (no menu, no selection, the chord still plays); a volume slider under a finger; eight
fingers at once letting go cleanly; a drag across the panel never scrolls the page; a real
two-finger pinch on the panel or the score and a double tap never zoom.

Two fixes came out of it:

- **Holding a tab popped up its label.** The family's press-and-hold labels (a title arrives
  in the toast after 450 ms on a touch screen) fired on the Z X C V B tabs, which are meant to
  be held. Anything with `data-hold` is left alone now (`core.js`).
- **A pinch zoomed the page** (the same smart-board trap Digital Accordion hit): `html` had
  `touch-action: manipulation`, which allows pinch zoom; it is `pan-x pan-y` now, as in
  Digital Accordion — scrolling and panning stay, pinch and double-tap zoom go.

Also added: the audio engine is woken on the first lift of a finger (`app.js wakeOnLift`) —
the panel's chords are scheduled and already sounded the moment audio woke, but a board's
browser may differ. (On a phone the floating Edit box used to cover the first line's
right-hand slots; since 2026-09-28 it is a column of its own.)
CDP's `Input.synthesizePinchGesture` ignores `touch-action` entirely (it zooms even over
`touch-action: none`), so the test pinches with two real touch points. Not covered: Safari on
iPad (the test drives Chrome).

## Playing

Play (or Space) plays from the selected note: notes for their length, blocks
for a beat, rests silent, lines padded to the bar, the lane's chords where
they change (Chords tab). Stop leaves the selection where the music was, so
the next Play carries on; a run that reaches the end lets the selection go,
so the next Play starts from the top. **Sound**: Melody, Chords, Steady beat
(off), Count-in (on — `EVMCountIn`: primed, one bar, two for a bar of two);
then **How it sounds** (2026-09-26) — a card for **Melody** and for **Chords**,
each a sound menu (the Virtual Keyboard's 13 sounds, grouped as it groups
them) and a volume, and **Room** (the reverb, 0–100 %, 35 % as in Key Blocks
and the Virtual Keyboard); picking a sound or letting go of a slider plays a
taste (Do, or the I chord). Then At the end (Stop · Go round from where Play
began · This line), Chord voicing (Song Writer 1.0 / Digital Accordion). The Melody
sound is every melody note — tapped blocks, the arrows, Play, the keyboard dock
(where a key now rings for as long as it is held); the Chords sound is the
strip and the lane. View prefs `melodySound` `melodyVolume` `chordSound`
`chordVolume` `room` (remembered; the Chords card follows the lesson's strip gate).
The clicks stay Song Writer's own dry triangle ticks. One AudioContext: the
engine's (`SW.audio.context()`), made on the first sound. A tempo change while playing carries on from
the exact point. Stepping with the arrows sounds each column (and its chord).

## The model

```js
score = { v: 2, key: 'C', scale: 'dorian',                   // scale omitted when major
  board: { d: { root: '5', q: 'dom7', mods: [] } },          // re-chorded places on the panel (omitted when none)
  meter: '3/4', bpm: 96,                                     // both omitted when 4/4 · 100
  lines: [ { label: 'A',
    syllables: [ { text: 'Twin', chord: 'V7',               // chord: where it changes (lane) — the engine's id
      cols: [ { v: 'h',                                     // note value; omitted = a block
                notes: [ { n: 'do', acc: 'sharp', rest: true } ] } ] } ] } ] }
```

The DOM is still the working copy (as in 1.0); `SW.score.read()` builds the model
after each edit and `SW.score.render(model)` draws one. Everything from storage,
a file or a link goes through `SW.score.normalize()`. Full formats:
`JSON-FORMAT.md`.

**Text format** (1.0 songs, links and backups, and Your words → Words and
notes): `{I}Twin[D1] kle[D1,S1:e] star[S1+M1:h] rest[D1~]` — `{…}` a lane chord
(`V7`, `bVI`, `V:inv64`; the ids written before 2026-09-27, `V/V` and the
like, still read), `:w :h. :h :q. :q :e. :e :s` a value, `,` a connected note,
`+` harmony, `~` a rest. Optional headers after `[Key of C]`: `[Scale dorian]`,
`[Time 3/4]`, `[Tempo 96]`. The board does not travel in the text.

## Storage (1.0's keys are read once, never written)

| Key | What |
| --- | --- |
| `song_writer_2_library_v1` | `{ id: record }` — the sandbox lives in it under `sandbox` but every list skips it |
| `song_writer_2_active_song_v1` | the song on screen last visit |
| `song_writer_2_view_prefs_v1` | View (and Sound's Chords, voicing, the two sounds and volumes, Room; the panel's chord set and what Z X C V B do); never travels in a link |
| `song_writer_2_layout_v1` | Layout settings (travels, locked, in student links) |
| `song_writer_2_lessons_v1`, `song_writer_2_lesson_sources_v1` | the teacher's lessons; pristine exercises for Start again |
| `song_writer_2_skip_delete_section_confirm` | 1.0's "don't show this again" |
| sessionStorage `song_writer_2_open_lesson_v1` | the lesson open in this tab (a reload keeps it) |

Rules carried over from Rhythm Poetry: the sandbox is where you land and only
**Save as…** files it; a library song opens with **auto-save off**, a new /
saved-as song with it on; `save(force)` only overrides with `force === true`;
dirtiness is a `stableStringify` fingerprint; a forbidden control is
**removed** (`.policy-off`), never greyed; a lesson link is one-way.

## Component slots — what works now, what comes next

Each file's header comment is the full contract.

- **Chord panel** (`chord-strip.js`, rebuilt 2026-09-27 on `js/chords.js`) —
  Digital Accordion's chord side, in the Panels shape: the scale's fourteen
  chords on the keys they answer to in every scale (bottom row first: **F**
  wide beside **G**; **A S D**; **Q W E R**; **1 2 3 4 5** — in major I ii /
  vi IV V / V/vi IV/IV V/V iii / ♭VI iv vii°7/V V/iii V/ii), rows sharing the
  height, names fitted to their blocks (a slash chord on two lines). Tap a
  chord, or press its key in Perform (in Edit the letters stay 1.0's solfège
  keys unless a lane slot is chosen — then the left hand takes them back);
  1–5 work in both modes. Two small buttons in the panel's top row (later on
  2026-09-27, from Digital Accordion): **names** — roman numerals (I IV V) or
  letters (C F G), one or the other; the button shows the other way, the key's
  letter while numerals are on, "I" while letters are (View pref `chordNames`;
  the lane, the corner and Layout settings follow it, and the glasses no longer
  change chord names) — and **♪ notes**, which stacks every chord's notes
  inside its block, root at the bottom, as Digital Accordion's column does:
  letters with letters, solfège with numerals (`chordTones`; the pills size
  themselves to the block, `fitLabels`). The **set button** cycles **Core** (F D
  S A) · **Full** (+ G R) · **Extended** (+ E Q W) · **Extreme** (everything);
  chords outside the set leave the panel, the lane's picker and the keys (View
  pref `chordSet`). **Z X C V B** along the bottom: hold a tab (or its key)
  and every chord relabels to what it would become; the chord played — and
  written into the lane — is that one. Each button holds a function of the
  room's choosing (View pref `modSlots`; sus2 add9 sus4 ♭7 maj7 to start,
  or the inversions 6, 6/4, 6/5, 4/3, 4/2 — the last three make a 7th chord
  first, with the scale's own 7th). **Editing** (the hat on): the pencil on a
  chord opens the **chord editor** (`#chord-sheet`: hear it, root — the twelve
  notes spelled for the scale — quality, the functions stuck to it, a name,
  *Back to the scale's chord*); the pencil after the tabs opens the **Chord
  buttons** chooser (`#mods-sheet`). Re-chorded places are the song's
  (`score.board`, a white corner on the block). Colours are the root
  letter's; out-of-scale chords are striped; a changed chord wears a white
  inner ring. Layout settings → Chords on the panel picks the *places* that
  are offered (a list saved before this named the chords; it still reads).
  *Next:* ♪ notes inside the blocks, chords bending the keyboard.
- **The corner** (`chord-strip.js` + `keyboard-dock.js`) — under the panel,
  beside the keyboard. Top: the chord in hand (the tonic chord until one is
  played), its key, its other name and quality (or "outside the scale", or
  what is being held), and its notes as coloured pills — solfège, letters with
  the glasses on. Bottom: the keyboard's own **Octaves 1–4** and **Focus**
  rows, seated here while the corner is out (`seatPanel`), so the keys take the
  dock's whole width; with the panel away they sit at the dock's left end as
  before. A container query drops the small print in a short dock.
- **Chord lane** (`chord-lane.js`) — retired 2026-10-03: the row it kept above
  the words is the chord track's (`chord-track.js`); the chord progressions
  (`track.js`, `progression-window.js`) give chords durations, rhythms and
  changes between syllables.
- **Keyboard dock** (`keyboard-dock.js`) — dressed as the Virtual Keyboard app
  (2026-09-26): a black frame, rainbow keys (a key's top half wears its letter's
  colour, the blocks' colours; a black key in the key wears its colour as a cap,
  from its top to halfway down to that line — 25% of the key height), and a panel at the left end: **Octaves 1–4** (sets the width as in
  Virtual Keyboard — 7 keys an octave plus 3, growing to fill the dock, then the keys
  thin; a key is never wider than about half its height allows) and **Focus**
  (keys outside the key go grey and silent, except any pitch the song itself uses —
  a D♮ in A♭ unlocks D). Height: drag the grip on the dock's top edge (snaps to
  Short/Medium/Tall, measured against the window; any px is kept; double-click →
  Medium). Octaves and height are no longer in View (user, 2026-09-26) — the dock's
  own panel and grip set them.
  Which keys show: the whole song if it fits, starting on the key's letter where
  it can (C…E in C, G…B in A♭); otherwise the keys stay put until the selected note
  leaves them, then move to hold its line. "In the key" is the song's scale
  (2026-09-27): in C natural minor E♭ A♭ B♭ wear their colours and E A B go
  grey under Focus; the song's own pitches still unlock their keys. The selected note's key takes its block's
  colour and a white lamp in one row along the top of the keys (no gold); a chord's keys light the same way, without the lamp, and stay lit while you step with the arrows or change a pitch — a tap on the manuscript (a line's background, not a note) or putting the chord panel away takes them off (`chord:cleared`, 2026-09-27). Tap to
  hear a key, slide across to play each, in Edit tap to set the pitch.
  Preferences `kbOctaves`, `kbFocus`, `dockHeight` (View, remembered);
  `SW.settings.setKeyboard(patch)` emits `keyboard:changed`. The old key-under-the-
  block slide and its guide line were retired with this. *Next:* play-along, MIDI,
  more of Virtual Keyboard's settings (sound, name modes, key colour modes).
- **Value circles** (`rhythm-panel.js`) and **the Edit box** (`edit-box.js`) — above.

## Settings

- **View**: On the stage (panel, chord track, keyboard) · On the page
  (staff notation, section colours, chord rhythm) · Scale (Justify width / Fixed) · Text size ·
  Lyric font · Keyboard & strip (**Key colours** — Rainbow /
  Colours when played / One colour + 10 swatches and a colour picker; `kbColors`,
  `kbColor` — Chord panel S/M/L) · While it plays (Light up: Note · Box · Both · Off — behind the note, staff.js draws it under the staff on written lines;
  Follow along) · Layout settings… · How this works. Also remembered, set from
  the panel itself: `chordSet`, `modSlots`, `chordNames` and `chordTones`.
- **Sound**: see Playing.
- **Layout settings**: On the page (section titles, the panel's letter keys,
  bar numbers, 1-beat pick-up); notes that can be written; sharps and flats,
  rests, harmony, connected notes; chords on the panel (by place); note values;
  keys, and **Melody follows the scale** (`scaleMorph`, default on — travels
  with a lesson or a locked link like the rest). (1.0's chord numbers 1–9 went
  with the panel: 1–5 are the number row.)
- **Set up for students** (Library): the task · notes, chords and values · Key &
  tempo (key stays; Chords: listen only; tempo Any / Between / Locked) · the exercises · What else
  comes with it (Sound options, View options, Chords, Keyboard,
  Section tools, Words editor, Save a picture, Present mode, Move between the
  exercises) · the link · lessons you have made.

As in Rhythm Poetry, opening a lesson link locks Layout settings on that
browser until **Share & backup → Start over**.
