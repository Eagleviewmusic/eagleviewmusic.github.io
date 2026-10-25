# Recording Studio

A multitrack recorder that holds the Eagle View Music instruments. Pick a
track, pick an instrument — the **Virtual Keyboard**, the **Digital Accordion**
or the **Rainbow Xylophone** — and play it right here in the studio while the
other tracks play back. Songs from **Ostinato Builder 2.0** and **Song Writer
2.5** can be brought in as tracks too, so the apps can build one bigger
project together. The mix saves as an MP3 or WAV.

Built 2026-10-22 (sandbox only). Folder `Claude Apps/Recording Studio/`;
launch entry `recording-studio` (port 8830) serves the whole `Claude Apps`
folder, because the studio frames its sibling apps and must share their origin.
A spare entry, `recording-studio-test` (8831), is for testing — its saved
projects are its own.

## Opening it on this Mac

Double-click **`Open the Recording Studio.command`**. It starts a little web
server for the `Claude Apps` folder (`tools/serve.js`, a copy of
`.claude/serve.js`, this Mac only) and opens
`http://localhost:8834/Recording%20Studio/` in Chrome; leave its Terminal window
open while recording. **Opening `index.html` as a file does not record**: a
`file://` page is walled off from the instrument frames (SecurityError — they
can never join the link), the microphone recorder (an AudioWorklet) cannot load,
and Bring in cannot reach the other apps. The page says so in a red note and
refuses ●. On eagleviewmusic.com none of this applies.

Each address keeps its own projects (localhost:8834, Claude's preview on 8830,
the live site): move a project between them with a project file.

## Decisions (made while building — change any of them)

| # | Decision | Why |
|---|---|---|
| D1 | The instruments are **the real apps, in frames** (`?embed=studio`), not copies. Each tells the studio every note it plays. | They look and work exactly as they do on their own — every scale, layout, sound and setting — and there is one copy of each to keep up. The Music Stand set the pattern. |
| D2 | **Up to 16 tracks**; a new project starts with **8**. *+ Add a track* adds more; an empty track can be removed. | Eight is the classic tape portastudio and fits a laptop screen beside an instrument. Bringing in a Song Writer song takes two tracks (melody, chords), so sixteen leaves plenty of room for a big project. |
| D3 | **A track belongs to one instrument**: Keyboard, Accordion, Xylophone, Ostinato or Song (melody or chords). Pick a track and its instrument comes up. On an empty track, the instrument tabs choose what it will be. | "Track 3 · Xylophone" is how a band thinks about it, and it keeps each track's sound right. |
| D4 | A track keeps **what was played** — which note, on which beat, for how long, in which sound — not a recording of the sound. | Exactly the Virtual Keyboard recorder's idea: a new tempo re-times the whole song, a track can change its sound afterwards, and a project is a few kilobytes. |
| D5 | **Tape rules**: a take replaces the track from where it began to where it stopped (punch-in). Undo brings back what was there. | Same as the Virtual Keyboard recorder, which already works well. |
| D6 | Bringing in an ostinato or a song makes a **frozen copy** on its own track(s), starting at a bar and (an ostinato) repeating as many times as asked. Later edits in Ostinato Builder or Song Writer do not change it; the track remembers where it came from. | A project is a moment, like a Music Stand arrangement; a song that changes underneath a finished recording would be a surprise. |
| D7 | **One clock**: everything heard back is played by the studio on one audio context — the keyboard and accordion through the Digital Accordion engine (`audio.js`), the xylophone through the Rainbow Xylophone's own voices (`js/xylo.js`), ostinatos through the shared percussion engine (`lib/instruments/`). While you play, the instrument in the frame makes its own live sound. | Tracks can never drift apart, and the same engines make the MP3. |
| D8 | Saved **on this device** (a list of projects, autosaved) and as **project files**; the mix as **MP3 or WAV**. | As in the Virtual Keyboard recorder. |
| D9 | Not in this version: loops, moving notes one by one. (Zoom came 2026-10-24, D15.) | Each is a chapter of its own. |
| V1 | **Voice tracks** (added 2026-10-22, the user's ask): the fourth tab, **Voice**, records the microphone as real sound. A take is kept in this browser's **IndexedDB** as 16-bit samples; the project only says where each take sits. | Sound is far too big for localStorage; IndexedDB holds hundreds of MB. |
| V2 | The microphone comes in on **the studio's own audio clock** (an AudioWorklet, `js/voice-tap.js`), and a take is moved earlier by the **voice delay**: out of the speakers and back into the microphone. **Line up the microphone** measures it with six beeps; until then the browser's own figures stand in. | Sample-accurate, steady takes; a singer sings with what they hear. |
| V3 | A voice take **keeps its own speed**: a new tempo moves the other tracks under it (a toast says so once). | Stretching a voice changes its pitch or smears it. |
| V4 | **No live monitoring** (you do not hear yourself) — a level meter instead; **headphones** advised. Echo cancellation, noise suppression and auto gain are **off** (made for calls, they smear music); "Filter out the speakers" turns the first two on for a room without headphones. | Speakers playing the mic back would feed back. |
| V5 | Same tape rules: a take replaces from where Play began to Stop, splitting an older take around it. Something sung **in the count-in** loud beside the rest of the take is kept as a **pick-up**, as a key played in the count-in is. | Matches the keyboard tracks. |
| V6 | **Project files carry the voice takes** (lossless 16-bit, inside the JSON) — about 6 MB a minute of voice. The microphone is on only while the Voice tab shows. | A project file must open complete on another computer. |
| V7 | **The microphone is opened for music, not a call** (2026-10-23, from the user's *Recording Musical Sounds with Common Mics* notes): echo cancellation, noise suppression, auto gain and voice isolation each asked off by name as `ideal`, then **what the browser applied is read back** from the track and shown (plus a Bluetooth warning from the label). A 25 Hz high-pass takes DC and rumble. **Boost** is one static gain laid over the kept take, capped under −1 dBFS, stored with the take; nothing rides the level while recording. The **room noise** (quietest ¼ s of the last 8 s) sets "silent" and the pick-up rule. A stereo track keeps its louder channel (Safari hands a mono mic over as left-only). **Mic check** fold: settings, rates, live level, room noise, spectrum, copy-a-report. | A browser's defaults are for one talking voice: they dull overtones, warble held notes and pump the level — and a constraint is a request, not a promise. |
| V8 | **The bleed check** (2026-10-24): in a voice take's count-in only the speakers sound, so the microphone's peak there is how loud they are at it — shown after the take ("speakers at the microphone −9 dB") and in the Mic check, with "turn them down or use headphones" past −6 dBFS. Shown, not acted on. | Clipped bleed cannot be undone later; the doc's rule: fix loud bleed at the source. |
| V9 | **Backing removal** (2026-10-24, from the user's *Removing Speaker Playback* notes): a singer needs the backing out loud, so the studio takes its own sound back out afterwards. Every sound goes out through one bus (`StudioBus`) and a second worklet tap keeps the reference beside the take. "Line up the microphone" plays a 1.5 s sweep (60 Hz–20 kHz) and learns the room's 0.5 s response (its peak is the voice delay). A take's echo is predicted by convolution, fitted to the take (±15 ms lag + gain, over its first 20 s) and subtracted; the figure is ERLE in ¼ s blocks where the echo has energy, 90th percentile ("Backing taken out: 35 dB"), kept with the clip; under 6 dB, or a median below −1 dB, the take is kept as recorded. The singer need not be silent anywhere — the voice is unrelated to the echo, so the fit ignores it and the check finds its figure in the pauses. Not applied with the browser's echo cancellation on. | The one approach that leaves the singer's own sound untouched: a fixed filter cannot learn the performer. The browser's canceller, made for calls, swallows the voice while the speakers are loud at the microphone — it stays as a labelled last resort. |
| V9a | Tried and taken out the same day, after the user tried them (2026-10-24): a **beat light** (a circle a beat, lit as heard) with a **"count in, then quiet"** take — "the lights are poorly designed for keeping the beat", and a take with nothing sounding blurs the beat; and an automatic half-level **duck** of the backing after a loud bleed. | A singer needs to hear the backing; the studio's job is to take it out afterwards, not to take it away. |
| V11 | **A take lines itself up by its own sound** (2026-10-24, the user's ask after hearing a doubled rhythm: the bleed in a take sat 63 ms behind the real tracks). With the speakers heard in a take, the round trip is measured on that take — the onsets of what the microphone heard against the onsets of what was sent (1 ms envelopes, so the voice hardly counts), then the raw signals within ±2 ms — and the take is placed by it, the backing in it landing on the beat with the tracks. That figure becomes the voice delay ("from your last take") for takes that do not hear the speakers; the removal looks for its lag around it. A checkbox chooses whether the speakers' sound is then taken out or kept, lined up. | Calibration figures drift and can be wrong; the take itself carries the truth. |
| D10 | **One key for the project** (2026-10-24, the user's ask): a key + scale menu beside the tempo and time signature (the Virtual Keyboard's scales, Minor listed once). Every instrument plays in it — C minor on the keyboard is C minor on the accordion and the xylophone (its Scales window's fitting). It is saved with the project, given to each instrument as it joins and whenever it changes, and a Song Writer song brought in sets it to the song's key. | One place to say what key the band is in. |
| D11 | **The instrument's own controls sit in the studio's tab row** (2026-10-24): the app's header rows (key, view, octaves, sound, Library, gear) are hidden in the frame, and the studio shows the controls it needs beside the tabs (not Library, nor the xylophone's ? tutorial — the user's call), its settings gear at the end — each one clicking or setting the app's real control and reading back what it shows (`js/inst-controls.js`). The line of words that was there ("Track 5 is empty…") is gone. | The user asked for fewer rows of words: the instrument gets two rows' height back. |
| D13 | **Move and trim takes on the timeline** (2026-10-24, the user's ask): drag a take to move it (by whole beats; hold Option/Alt for finer), drag either end to trim it (an end snaps to a beat line within 6 px; Option/Alt for free). Trimming only narrows the take's window onto its recording (`o`, `d`) — nothing is cut from the clip, so the same end dragged back out opens it up again, as far as the recording goes; the whole recording shows faintly behind a take while it is dragged. A take moved or widened over another on its track covers it by the tape rules (`cutRegions`; the covered take keeps its recording too). A click that doesn't move still sets where Play starts. Undo / Redo cover it. | |
| D14 | **Note tracks are kept as blocks** (2026-10-24, the user's ask: the same move and trim for keyboard, accordion, xylophone and brought-in tracks). `tr.clips = [{ b, o, d, len, items }]` in beats: each take (or bring-in) is a block holding everything played (`items`, beats from the block's own 0) and a window onto it. `tr.notes` / `tr.hits` are worked out from the windows (`blockView`) — what plays, draws and goes into a song file — and are still saved as plain notes beside the blocks, so an older copy of the studio opens the file as it sounds. A file without blocks opens as one block per track, from the beat its first note starts on to the beat after its last ends. A new take covers what it overlaps (`cutBlocks`) instead of deleting it; Tidy rounds every note a block holds but never pushes a heard note out of its window; Move a bar and Duplicate carry the blocks. A note held past a block's end stops there. Undo labels say "the part". | The same idea as a voice take's window, so trimming loses nothing. |
| D15 | **Zoom the timeline** (2026-10-24, the user's ask): − / + above the track names halve or double the bars across the lanes; a trackpad pinch over the lanes (Ctrl + wheel in Chrome, Safari's gesture events) or two fingers on a touch screen zoom around the pointer; two fingers sideways slide along, and so does the thumb above the ruler. Zoomed out the lanes show the whole song, as before; zoomed in they show at least one bar, and playback pages the window along as the playhead nears its right edge. **What a drag snaps to follows the zoom**: the finest division the lanes show at 16 px or more — a beat, 8th, 16th or 32nd (a twelfth of a beat where the beat is a dotted quarter) — shown as *snap …* beside the buttons and drawn faintly on the lanes; a moved take or part moves by that grid (Option/Alt free), a trimmed end magnets to it. Zoom in all the way and every move is a 32nd note. | Lining a take up with a recorded part needs finer than a beat, and finer needs more room on screen; tying the grid to the zoom means the grid is always something you can see and hit. |
| D16 | **Split** (2026-10-25, the user's ask): a ←|→ button beside the zoom buttons lights up; over the lanes the pointer is a pair of scissors, and a line on the take or part under it shows where the cut would fall (on the drag grid, Option/Alt anywhere). A press cuts it in two and the button goes out — it is lit for one cut; only a cut, or pressing it again, turns it off (zooming, reordering tracks, anything else leaves it lit; a press on empty lane just says what to press on). A take's two halves share the recording, so either end dragged back out opens it up; a part's notes go with the half they start in (the ones before the cut left, the rest right), so nothing sounds twice at the seam. Undo / Redo cover it. | A split that stays armed would cut by accident on the next click; one cut per press is what the user asked for. |
| D17 | **A selected take or part** (2026-10-25, the user's ask): a press on a take or part that doesn't drag selects it — a yellow outline and tint show which one — and Delete or Backspace removes it (Undo brings it back; a toast says so). A press on empty lane lets it go; a moved, trimmed or split one stays selected (the left half after a split). Remembered by track and start beat, so it survives the tracks being rebuilt or undone. Keys typed into a field, or with a sheet or menu open, are left alone. | You need to see what is about to go before the key does it. |
| D18 | **Ostinato tracks are loops** (2026-10-25, the user's ask): a brought-in ostinato is a loop block — one pass of hits (`items`, `loop` beats long) that goes round for as long as its window is. Drag its end out and it keeps going, bar after bar; drag its start and the window moves over the loop with the phase kept (`o` is where in the pass the window starts, wrapped to the pass); split it and both halves loop on, in step. A notch on the block marks where each pass begins. Older projects: an ostinato block written out repeat after repeat becomes a loop on opening — the pass length is the shortest whole-beat shift that lands every hit on another of its instrument (the Rock beat is a 2-beat loop), or the whole block when there is none; a trimmed window that used to run past the written-out hits now hears the loop to its end. Saved with `loop`; the derived hits are still saved, so an older studio plays the file as it sounds. Note tracks (keyboard, songs) are not loops. | A drum pattern is a loop in every studio; nobody wants to bring it in again to make it longer. |
| D12 | **Drag a track's name up or down** to reorder the tracks (2026-10-24, the user's ask); a press that doesn't move still arms the track. Undo / Redo cover it. A track's colour goes with its place. | |

## Files

| File | What it is |
|---|---|
| `index.html`, `style.css` | The page: top bar, transport, tracks, the instrument area, sheets. |
| `js/studio.js` | The project, tracks, transport, recording, drawing. |
| `js/link.js` | The instrument link (`window.EVMStudio`, below): frames, timing, keys, the project's key handed on. |
| `js/inst-controls.js` | The showing instrument's own controls in the tab row, standing in for the app's hidden header (D11). |
| `theory.js` | Copy of `Digital Accordion/theory.js` (authoritative there; the Virtual Keyboard has one too): the scale list and key spellings. |
| `js/voices.js` | Playing tracks back on the one clock, and rendering them for a file. |
| `js/xylo.js` | The Rainbow Xylophone's vibraphone and marimba, on any audio context. |
| `js/bring-in.js` | Bringing in Ostinato Builder and Song Writer songs. |
| `js/voice.js` | Voice tracks: the microphone, the Voice panel and its meter, the takes in IndexedDB, Line up the microphone. |
| `js/voice-tap.js` | The AudioWorklet that hands the microphone's samples over with their place on the clock (two channels in, the louder kept); a second one taps the bus as the reference. |
| `js/bus.js` | `StudioBus.out(ctx)`: the one way out to the speakers, so the studio can tap exactly what it sent. Loaded first. |
| `js/backing-removal.js` | Taking the speakers' sound back out of a voice take: the sweep, the room's response (FFT), the predicted echo, ERLE. |
| `audio.js` | Copy of `Digital Accordion/audio.js` (authoritative there) differing by ONE line: the master goes through `StudioBus`. |
| `lib/evm-count-in.*` | Copies of `EVM Library/` (check-copies.sh). |
| `lib/instruments/js/virtual-instruments.js` | Copy of `Virtual Instrument Assets/js/` (authoritative there). |
| `vendor/lame.min.js` | lamejs 1.2.1 (LGPL), for MP3 — as in the Virtual Keyboard. |

## The instrument link — `window.EVMStudio` (version 1)

The studio defines `window.EVMStudio` before any frame loads. An instrument
opened with `?embed=studio` joins it once, and tells it every note it plays
live (not previews — a sound picked in a menu, an editor's test note):

```js
// in the instrument
function joinStudio(app) {
  try {
    if (new URLSearchParams(location.search).get('embed') !== 'studio') return null;
    if (window.parent === window || !window.parent.EVMStudio) return null;
    return window.parent.EVMStudio.join(window, app);
  } catch (e) { return null; }   // framed by another site: not the studio
}
const studio = joinStudio('virtual-keyboard');

studio.on(id, freqs, sound, level)   // a held note or chord starts now
studio.off(id)                       // and ends now (id: unique while held)
studio.hit(freqs, sound, level)      // a struck note that rings on its own
studio.offer({ setSound, setKey, releaseAll })   // optional: what the studio may ask
```

- `freqs` — the frequencies sounding (one for a note, several for a chord).
- `sound` — the instrument's sound id: an `Audio.PRESETS` id for the keyboard
  and accordion, `'vibraphone'` / `'marimba'` for the xylophone.
- `level` — the instrument's own level for that sound, as the engine is given
  it (the keyboard's `0.8 × volume`; the accordion side's level). 0.8 is "as
  normal".
- **When** is not passed: the studio listens to the frame's own input events
  (capture listeners it adds to the frame's window) and takes the moment of the
  key or touch that caused the call, as the Virtual Keyboard recorder does.
- `offer(api)`: `setSound(id)` puts a track's sound back on the instrument when
  that track is picked again; `setKey(pc, scaleId)` plays in the project's key
  (pitch class 0 = C, a `Theory` scale id; given shortly after `offer` and on
  every change); `releaseAll()` lets go of every held note. The keyboard and
  accordion offer `setKey` in `script.js`; the xylophone in `App.tsx` (as Minor
  for Natural Minor).

Who joins:

| App | Where it calls |
|---|---|
| Virtual Keyboard | `startNote` / `stopNote` in `script.js`; embedded, its own recorder is not loaded. |
| Digital Accordion | `startBlock` / `stopBlock` / `retriggerHeld` in `script.js`. |
| Rainbow Xylophone | the bar strike in `App.tsx` (`hit`); built into `bundle.js`. |

The studio also catches **Space** (play / stop) and **Escape** (stop) in the
frames, and hands keys pressed on the studio's own page to the instrument, so
the computer keyboard always plays whichever instrument is showing.

## Bringing songs in

- **Ostinato Builder 2.0** — opened in a hidden frame with its existing Music
  Stand bridge (`?embed=music-stand`, `window.MusicStandBridge`): `listSongs()`,
  `openLibrarySong(id)`, `timeline()`, `snapshot()`. That embed mode cannot
  write the app's storage. Nothing in Ostinato Builder changed.
  An ostinato in **sections** (2026-10-23) gets a *Which part* choice: its
  arrangement (when it is Arranged), every section in turn, or one section
  alone — `timeline({ play })` / `timeline({ section })`. It starts on how the
  piece is set to play; a Looped one, on the section it was left showing. The
  part chosen is the pass that *Plays N times* repeats.
- **Song Writer 2.5** — opened in a hidden frame with `?embed=studio`
  (`js/embed.js` swaps its storage for a read-through layer first, as Ostinato
  Builder does for the Music Stand) and `window.SongWriterStudio` (`js/studio-bridge.js`):

```js
SongWriterStudio.listSongs()  // [{ id, title, updatedAt, sandbox?, starter?, received?, book? }]
SongWriterStudio.open(id)     // -> plan | null
SongWriterStudio.load(record) // -> plan | null   ({ title, score } from a file)
plan = {
  title, meter: '3/4', bpm, beatTicks, barTicks,
  pickupTicks,                  // ticks before the first downbeat (0: none)
  totalTicks,
  melody: [{ midi, at, ticks, level }],          // ticks from the top; a tie is one note
  chords: [{ midis: [...], at, ticks, level, id, name }],   // every strike
  sounds: { melody, chords, melodyVolume, chordVolume, room }   // Song Writer's Sound choices
}
```

`level` is the engine's level for that call, as `Audio.schedule` takes it (1
for a lone note, ~0.714 in harmony, 0.75 for a chord); `ticks` is how long it
sounds, Song Writer's 0.96 / 0.95 included. The studio folds the side's volume
into each note and gives a chord's notes the engine's 1.15/√n share
(`bring-in.js`). Song Writer's Sound choices are read when its frame loads.

## How it plays

- **Arming**: the round number on a track picks it to record onto (red). An
  empty track records whichever instrument is showing; a track with notes
  brings its own instrument up (and, for the keyboard, puts its sound back on
  the keyboard). Tracks brought in from another app have a dotted ring and are
  not recorded onto — their ⋯ menu moves, tidies, duplicates or clears them.
- **The track menu (⋯)**: name, volume, sound ("As played" or any sound),
  move a bar earlier / later, tidy the timing (beat, eighth, sixteenth,
  triplet), duplicate, clear, remove. Undo (40 steps, this visit) brings any of
  them back, and takes, bring-ins and new tracks too.
- **Mute / Solo**: heard at once, even mid-play. A muted (or soloed-out) track
  is left out of the song file.
- **Keys**: Space plays and stops anywhere; Escape stops; every other key
  plays the instrument showing, whichever page has the keyboard.
- **Song files**: the heard tracks from the first note (0.1 s before) to the
  last note and its ring (2.5 s after), the Room on the keyboard / accordion /
  song tracks. The three engines render apart and are added; a mix that would
  clip is turned down as a whole.
- **Storage** (this device): `evm_studio_projects_v1` (id → project),
  `evm_studio_current_v1`, `evm_studio_prefs_v1` (playback volume, instrument,
  split, folded), `evm_studio_rec_delay_v1` (falls back to the Virtual
  Keyboard's measured `virtual_keyboard_rec_delay_v1`), `evm_studio_theme_v1`.
  A new project is listed once it has a track or a name.
- **Project file**: EVM envelope `{ format: 'evm-item', app: 'recording-studio',
  kind: 'studio-project', title, data }`. Opening one adds it as a project of
  its own; it never replaces one kept here.

## Voice tracks

- **Model**: a voice track's `regions` — `{ c (clip id), b (beat it starts on), o (seconds into the clip), d (seconds) }`.
  Clips live in IndexedDB `evm_studio_audio_v1`, store `clips`, key = clip id, value `{ rate, pcm (Int16 ArrayBuffer), at }`.
  A clip is the take from where it was kept (count-in trimmed off). Takes no project and no undo step uses are let go
  when a project is deleted and when the studio opens.
- **Timing**: sample at audio time `T` is musical time `T − voice delay`. The take's region begins at beat `from`
  (`anchor + delay` in the clip) or at a pick-up onset sung in the count-in.
- **Prefs**: `evm_studio_voice_v1` (microphone, boost, echo filter), `evm_studio_mic_delay_v1` (the measured
  round trip), `evm_studio_bleed_v1` (the last count-in's bleed, dB + when). The room's response: key `_ir` in the clips store
  `{ rate, ir, ms, erle, at, label }` (`keys()` leaves `_` keys out, so the sweep is never forgotten as an unused take).
- **With each clip** (IndexedDB record and project file alike): `gain` (the boost actually applied, absent when 1),
  `clipped` (the microphone itself hit full scale), `mic` (label, which processing was on, rates, channels, room noise),
  `removed` (dB of backing taken out, when it was).
- **Not in the reference** (so not removed): an instrument played live in its frame during a voice take (its own context),
  sound from other tabs or apps, the count-in library's inaudible wake noise.
- **The microphone's constraints** (`MUSIC` in voice.js): every processing flag `ideal: false` (echo cancellation
  `ideal: true` only with "Filter out the speakers"), one channel, 48 kHz and 10 ms asked for; `exact` only for a chosen
  `deviceId`. Flags cannot be changed on a live stream — changing one closes the microphone and opens it again.
- **Embedding**: inside another page the frame needs `allow="microphone"`; without it the panel's error offers
  "Open the studio in its own tab".
- **Project file**: `data.clips = { id: { rate, pcm16: base64 } }` beside the tracks; opening the file puts them back.
- **Song file**: voice tracks render on an offline context of their own and are added to the mix like the others.

## Tested (2026-10-22, headless pane, port 8831)

- Takes from all three instruments through their frames: keyboard keys
  (C D E F, piano, level 1), an accordion chord (four pad notes at the
  engine's chord share) plus melody notes, xylophone number keys (C E G,
  vibraphone).
- Playback lands every note exactly on its beat (0.000 ms error against the
  plan); notes, strikes and hits all play together; it stops by itself at
  the end.
- A key's moment in a frame is put on the studio's clock to within 0.2 ms
  (the frames' clocks start ~44 ms apart — uncorrected, notes would land late).
- A key pressed on the studio's page plays the instrument and moves the
  keyboard to it; Space inside a frame starts and stops the studio.
- Bring in: Ostinato Builder's starters (Rock beat ×8 = 224 hits), Song
  Writer's Twinkle (42 notes); the apps' storage untouched.
- Track menu actions and Undo; projects (name, new, reopen, list); WAV and
  MP3 (33 s, 5.6 MB / 0.8 MB); every engine is in the mix.
- 1280×800 light and dark, 768×1024, 375×812 — no sideways scrolling.

Voice (with a stand-in microphone that hears everything sent to the speakers —
the pane has no real one): Line up the microphone measured its round trip
(21 ms); a take over a keyboard part caught all 8 notes within 0.03 ms of each
other, 5.9 ms after the beat — the engine's compressor delaying the keyboard
itself, so the voice sits with what is heard, and plays back in step the same
way; playback puts a take exactly on its beat; a punch-in from bar 2 split the
older take around itself; count-in clicks leaking into the microphone were not
taken for a pick-up, a note sung on the last count-in beat was (−0.96 beat); a
WAV with only the voices; a 2 MB project file carried all 6 takes and opened
them back after they were wiped; deleting a project kept takes another project
uses; the track menu (move, undo) on a voice track.

2026-10-23, the music-mic pass (stand-in microphone again, port 8831): the
constraints go out with every flag named; the audit list shows noise
suppression / auto gain left on and a "Hands-Free" label as a Bluetooth
warning; the meter's words step Silent → Quiet → A little quiet → Good →
Loud → Too loud as a tone rises, with the clipping advice under the meter;
room noise read −65 dB on the stand-in's hiss; a 0.1-peak take with Boost
300% came out at 0.32 with `gain: 3` kept, a loud one was capped at 0.89
with `gain: 1.774`, and a take past full scale got the "it clipped" toast;
NotReadable / NotAllowed / NotFound each show their own words; Line up the
microphone still measures (21 ms); the report falls back to the console
when the clipboard is refused; 375 px light and 1280 px dark layouts.

2026-10-24, the speakers-in-the-take pass (stand-in microphone with a made-up
mono room: the speakers 30 ms away at 0.8 plus a reflection at 90 ms at 0.3;
the project the user asked for: Ostinato Builder's Rock beat and Song Writer's
Mary Had a Little Lamb brought in, voice takes over them): the sweep measured
51 ms (21 ms of stream latency + the 30 ms room) and 49 dB on itself; a take
over the backing with no voice came out at −58 dBFS against −9 dB of bleed,
"backing taken out 36 dB"; a take with a 0.1 "voice" tone starting after the
count-in kept the tone at 0.108 peak with the backing gone (35 dB). Before
the block check, the same take scored 0 dB when the tone sounded through the
count-in (the old count-in check) and was kept raw — the flaw the user's test
found. Without a line-up, the take is kept raw with a one-time hint to line
up. The user's first real try (quiet takes, the beat light, the browser's
echo filter swallowing the voice) is what V9a records.

2026-10-24, later: the user's four exported recordings (two mixes, the
echo-filtered take, the microphone alone) showed the bleed 63 ms behind the
tracks (envelope cross-correlation; the mixes' other autocorrelation peaks,
167 and 334 ms, are the rock beat's own sixteenths and eighths). With the
stored delay set wrong on purpose (20 ms), a take over the rock beat and Mary
lined itself up at the true 51 ms, placed itself right and came out 35 dB
clean; a synthetic check (clicks 77 ms late in noise and a "voice") measured
77 ms, and the same with no bleed measured nothing, as it should.

Not yet: by ear on real speakers, a real microphone (levels, the pick-up rule's
thresholds, a USB interface, whether Chrome honours the flags on the user's
laptop), the self-lining-up and the removal in a real room (ERLE, whether 6 dB is the right floor, the
duck), the timing test with real taps, a touch screen / smart board, Safari
(the left-only stereo case), a long project (64+ bars).

## Promoting

The studio needs the changes made for it in its neighbours, so they go
together: **Virtual Keyboard** (`script.js`, `recorder.js`, `styles.css`,
`index.html`), **Digital Accordion** (`script.js`, `README.md`), **Song Writer
2.5** (`js/embed.js`, `js/studio-bridge.js`, `index.html`, `js/library.js`,
`js/lessons.js`, `js/audio.js`, `js/player.js`, `README.md`) and the
**Rainbow Xylophone** (`Claude Apps/rainbow-xylophone/` — its `index.html`
carries the bundle inline; source in `App Projects/rainbow-xylophone/`).
Ostinato Builder needs nothing new. Leave `Open the Recording Studio.command` and
`tools/` out of the Eagle View Music copies (the site is served already).
