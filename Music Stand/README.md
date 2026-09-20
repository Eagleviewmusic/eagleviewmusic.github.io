# Music Stand

A bridge between **Rhythm Poetry 2.0** and **Ostinato Builder 2.0**: a poem on
one side, an ostinato on the other, and one play button for both.

The Music Stand does not reimplement either app. Each side of the screen is the real
app in a frame, opened in an embedded mode (`?embed=music-stand`). The app draws its
own score and makes its own sounds; the Music Stand chooses the songs, sizes the
panes, keeps time and owns the mixer.

## Running it

The Music Stand and both apps **must be served from the same website** (same origin).
That is what lets the Music Stand reach into the frames and read each app's library.
Opened as a `file://`, or from a different site, the panes say so and stay empty.

The folder layout it expects is the one in this project — three sibling folders:

```
Claude Apps/
  Music Stand/
  Rhythm Poetry 2.0/
  Ostinato Builder 2.0/
```

The paths are in `APPS` at the top of `script.js`. Locally, the `music-stand` entry in
`.claude/launch.json` serves the whole `Claude Apps` folder on port 8795; open
`http://localhost:8795/Music%20Stand/`.

Note that each app keeps its library in `localStorage` for **its** website. The
libraries the Music Stand lists are the ones on the site the Music Stand is opened from — on
the deployed site, those are the songs made there.

## Getting songs in

- **From the library** — the picker lists the app's own library, read live. A
  song opened this way stays linked: edit it in the app (another tab is fine)
  and the Music Stand opens the new version — at once, or at the next Stop.
- **From a sandbox** — each app keeps scratch work in a **Sandbox** (Rhythm
  Poetry has two, one per side; Ostinato Builder has one). The picker lists it
  first, under *Sandbox — scratch work*. It is opened live, like a library song:
  edit the sandbox in the app in another tab and the Music Stand follows. The sandbox is
  not part of the library, and the Music Stand never writes to it.
- **From a link** — any Share link from either app. It is sorted by its shape,
  not its address (`tracks` → ostinato, `poetryState`/`rhythmState` → poem), so
  pasting on the wrong side still works. Pasting anywhere on the page works too.
- **Pairings** — a poem + ostinato + tempo/intro/mixer, saved in the Music Stand
  (`music_stand_pairings_v1`), or shared as a `?pair=` link that carries both songs whole.
  A pairing is a saved moment, so a sandbox in it is kept **as a copy**, not by
  id — the sandbox gets cleared and rewritten, and a pairing that pointed at it
  would open whatever it held by then. (The live session, by contrast, stays
  linked to the sandbox.)

### What the Music Stand sees of the apps' saving

The Music Stand reads what an app has **saved**. With an app's **Auto-save** off (the
default when a library song is opened there), edits made on screen in that tab
are not in the library and so are not seen here until they are saved — which is
the point of the switch. The sandbox and a song just made or saved always save
themselves.

The last session is kept in `music_stand_session_v1`. (Both keys were `pop_*` when
this app was the Poetry Ostinato Player; they are copied across once, and old
`?pair=` links, which mark themselves `pop`, still open.)

## Timing

One clock for both sides. The Music Stand owns the only `AudioContext`; the apps are
handed a view of it (a `Proxy`) whose `currentTime` the Music Stand sets to the moment
each note is due while the app sounds it. Every voice in both apps reads the
clock once and schedules from that reading, so notes land on the audio clock to
the sample — measured: every onset exactly on the tick grid, none late.

Both sides count the same **beat** (a quarter in 4/4, a dotted quarter in 6/8),
so one tempo drives both. The running order:

1. **Count-in** — one bar of clicks (optional).
2. **Intro** — the ostinato alone, 0/1/2/4 times round.
3. **The poem** — a pickup comes in on the last beat of the intro. The ostinato
   starts again at the poem's bar 1 on every pass, so their bar 1s always meet.
4. **Loop** — round again, or stop at the end.

Mismatched meters are allowed and noted in the ostinato's heading
("3 beats against 4", "4/4 against 6/8").

## Layout

Stacked or side by side, either side first, or one side alone; the split is
kept per arrangement. **Automatic** sizing asks each app for its natural size
(`sizing()`) and finds the largest scale at which both fit, so the two scores
come out with notes of about the same size. The poem may choose how many bars go
on a line; it offers every balanced choice and the Music Stand picks the one that makes
the smaller of the two scores largest. Drag the line to choose by hand;
double-click it to give it back.

## The bridge — `window.MusicStandBridge`, version 1

Both apps expose the same object when embedded. A third app joins by exposing
it too and adding an entry to `APPS`.

| member | what it does |
| --- | --- |
| `app`, `version` | `'rhythm-poetry'` / `'ostinato-builder'`, `1` |
| `libraryKey` | the `localStorage` key of the app's library (for live updates) |
| `listSongs()` | `[{ id, title, kind, meter, bpm, measures?, isCustom, createdAt, preview, sandbox? }]` — the live library, then any sandbox, flagged `sandbox: true` (a sandbox is not a library song: it is not among the app's own lists, so it is offered separately) |
| `openLibrarySong(id)` | open a library song; returns `info()` or `null` |
| `loadSong(record)` | open a song record (a share-link payload); returns `info()` or `null` |
| `snapshot()` | the open song as a record, the same shape the app shares |
| `info()` | `{ title, kind, meter, bpm, beatsPerMeasure, beatTicks, pickupBeats, totalBeats, voices:[{ id, label, image?, muted? }] }` |
| `timeline()` | `{ beatTicks, totalBeats, notes:[{ tick, voice, holdTicks?, gapTicks? }] }` — one pass, every voice, muted ones included |
| `attachAudio(ctx, out)` | use this context and send sound to `out` instead of the speakers |
| `sound(voice, opts)` | sound one voice **now** (by `ctx.currentTime`). Poem: `{ holdMs, style: 'tone'\|'drum' }`; ostinato: `{ gapMs }` |
| `highlight(beat)` | light a beat (and follow it on the page); `-1` clears |
| `stop()` | clear the lights and settle the page |
| `getView()` / `setView(patch)` | how the score is shown (see `VIEW_KEYS` in each app). Rhythm Poetry's include `textPct` (words 60–250 %) and `lyricFont` (`rounded`, `reader`, `clear`, `story`); the Music Stand's own View menu for the poem sets both, per pane, without touching the app's settings |
| `sizing()` | `{ w, h, padW, padH, maxScale, mode: 'page'\|'fit'\|'fixed', fixedScale, layouts? }` |
| `refit()` | re-fit to the frame |
| `editable` | `false`: all input is swallowed. The switch for minimal editing later |
| `onHostKey` | set by the Music Stand; the frame passes keys up so Space works everywhere |

## What embedded mode changes in the apps

Each app's `script.js` starts with an **EMBEDDED IN THE MUSIC STAND** block and has a
**THE MUSIC STAND BRIDGE** section; each `style.css` ends with an `EMBEDDED IN THE MUSIC STAND`
block. Outside the Music Stand none of it runs. Inside it:

- `localStorage` is replaced by a layer that reads the real storage and keeps
  every write in memory — nothing the Music Stand does can change an app's library,
  its open song or its settings.
- The body gets `embedded present-mode`: the score and nothing else.
- Lesson and share links in the frame's own address are ignored.
- All clicks and taps are swallowed (scrolling still works); keys go to the Music Stand.
- Rhythm Poetry gains a `'page'` size (fit both ways) and chooses its own bars
  per line for the pane; Ostinato Builder shrinks past its usual 55% floor
  rather than scrolling, and centres its grid.
- Everything an app added for editing stays out of the pane. Present mode hides
  the beat- and bar-line simile marks, the join and division buttons and the
  top bar (which is where the Auto-save switch lives), so a new editing control
  must be added to that list or it will show up, and answer a hover, in the
  Music Stand.
- When the poem's lyric font changes, the words are measured again once the
  face has arrived and the Music Stand works out the split again after that; a face
  measured in its fallback would leave the bars the wrong width.

Two small changes also apply outside the Music Stand and do not change behaviour there:
Rhythm Poetry's brush and tone voices now read the clock once like every other
voice, and Ostinato Builder's `buildTimeline()` reads each track through a new
`trackOnsets()`, which the bridge shares.

## Not built yet

- **Editing in the panes.** `bridge.editable` is the switch; the frames already
  hold the full apps.
- Starting from a chosen bar; a pause that resumes where it left off.
- Other apps. The protocol above is the whole of what one needs to provide.
