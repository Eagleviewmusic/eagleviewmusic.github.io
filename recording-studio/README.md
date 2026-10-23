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
| D9 | Not in this version: loops, zoom for long projects, moving notes one by one. | Each is a chapter of its own. |
| V1 | **Voice tracks** (added 2026-10-22, the user's ask): the fourth tab, **Voice**, records the microphone as real sound. A take is kept in this browser's **IndexedDB** as 16-bit samples; the project only says where each take sits. | Sound is far too big for localStorage; IndexedDB holds hundreds of MB. |
| V2 | The microphone comes in on **the studio's own audio clock** (an AudioWorklet, `js/voice-tap.js`), and a take is moved earlier by the **voice delay**: out of the speakers and back into the microphone. **Line up the microphone** measures it with six beeps; until then the browser's own figures stand in. | Sample-accurate, steady takes; a singer sings with what they hear. |
| V3 | A voice take **keeps its own speed**: a new tempo moves the other tracks under it (a toast says so once). | Stretching a voice changes its pitch or smears it. |
| V4 | **No live monitoring** (you do not hear yourself) — a level meter instead; **headphones** advised. Echo cancellation, noise suppression and auto gain are **off** (made for calls, they smear music); "Filter out the speakers" turns the first two on for a room without headphones. | Speakers playing the mic back would feed back. |
| V5 | Same tape rules: a take replaces from where Play began to Stop, splitting an older take around it. Something sung **in the count-in** loud beside the rest of the take is kept as a **pick-up**, as a key played in the count-in is. | Matches the keyboard tracks. |
| V6 | **Project files carry the voice takes** (lossless 16-bit, inside the JSON) — about 6 MB a minute of voice. The microphone is on only while the Voice tab shows. | A project file must open complete on another computer. |

## Files

| File | What it is |
|---|---|
| `index.html`, `style.css` | The page: top bar, transport, tracks, the instrument area, sheets. |
| `js/studio.js` | The project, tracks, transport, recording, drawing. |
| `js/link.js` | The instrument link (`window.EVMStudio`, below): frames, timing, keys. |
| `js/voices.js` | Playing tracks back on the one clock, and rendering them for a file. |
| `js/xylo.js` | The Rainbow Xylophone's vibraphone and marimba, on any audio context. |
| `js/bring-in.js` | Bringing in Ostinato Builder and Song Writer songs. |
| `js/voice.js` | Voice tracks: the microphone, the Voice panel and its meter, the takes in IndexedDB, Line up the microphone. |
| `js/voice-tap.js` | The AudioWorklet that hands the microphone's samples over with their place on the clock. |
| `audio.js` | Byte-identical copy of `Digital Accordion/audio.js` (authoritative there). |
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
studio.offer({ setSound, releaseAll })   // optional: what the studio may ask
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
  that track is picked again; `releaseAll()` lets go of every held note.

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
- **Prefs**: `evm_studio_voice_v1` (microphone, input level, echo filter), `evm_studio_mic_delay_v1` (the measured round trip).
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

Not yet: by ear on real speakers, a real microphone (levels, the pick-up rule's
thresholds, a USB interface), the timing test with real taps, a touch screen /
smart board, Safari, a long project (64+ bars).

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
