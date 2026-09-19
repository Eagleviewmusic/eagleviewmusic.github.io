# Poetry Ostinato Player — "the POP"

A bridge between **Rhythm Poetry 2.0** and **Ostinato Builder 2.0**: a poem on
one side, an ostinato on the other, and one play button for both.

The POP does not reimplement either app. Each side of the screen is the real
app in a frame, opened in an embedded mode (`?embed=pop`). The app draws its
own score and makes its own sounds; the POP chooses the songs, sizes the
panes, keeps time and owns the mixer.

## Running it

The POP and both apps **must be served from the same website** (same origin).
That is what lets the POP reach into the frames and read each app's library.
Opened as a `file://`, or from a different site, the panes say so and stay empty.

The folder layout it expects is the one in this project — three sibling folders:

```
Claude Apps/
  Poetry Ostinato Player/
  Rhythm Poetry 2.0/
  Ostinato Builder 2.0/
```

The paths are in `APPS` at the top of `script.js`. Locally, the `pop` entry in
`.claude/launch.json` serves the whole `Claude Apps` folder on port 8795; open
`http://localhost:8795/Poetry%20Ostinato%20Player/`.

Note that each app keeps its library in `localStorage` for **its** website. The
libraries the POP lists are the ones on the site the POP is opened from — on
the deployed site, those are the songs made there.

## Getting songs in

- **From the library** — the picker lists the app's own library, read live. A
  song opened this way stays linked: edit it in the app (another tab is fine)
  and the POP opens the new version — at once, or at the next Stop.
- **From a link** — any Share link from either app. It is sorted by its shape,
  not its address (`tracks` → ostinato, `poetryState`/`rhythmState` → poem), so
  pasting on the wrong side still works. Pasting anywhere on the page works too.
- **Pairings** — a poem + ostinato + tempo/intro/mixer, saved in the POP
  (`pop_pairings_v1`), or shared as a `?pair=` link that carries both songs whole.

The last session is kept in `pop_session_v1`.

## Timing

One clock for both sides. The POP owns the only `AudioContext`; the apps are
handed a view of it (a `Proxy`) whose `currentTime` the POP sets to the moment
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
on a line; it offers every balanced choice and the POP picks the one that makes
the smaller of the two scores largest. Drag the line to choose by hand;
double-click it to give it back.

## The bridge — `window.PopBridge`, version 1

Both apps expose the same object when embedded. A third app joins by exposing
it too and adding an entry to `APPS`.

| member | what it does |
| --- | --- |
| `app`, `version` | `'rhythm-poetry'` / `'ostinato-builder'`, `1` |
| `libraryKey` | the `localStorage` key of the app's library (for live updates) |
| `listSongs()` | `[{ id, title, kind, meter, bpm, measures?, isCustom, createdAt, preview }]` — the live library |
| `openLibrarySong(id)` | open a library song; returns `info()` or `null` |
| `loadSong(record)` | open a song record (a share-link payload); returns `info()` or `null` |
| `snapshot()` | the open song as a record, the same shape the app shares |
| `info()` | `{ title, kind, meter, bpm, beatsPerMeasure, beatTicks, pickupBeats, totalBeats, voices:[{ id, label, image?, muted? }] }` |
| `timeline()` | `{ beatTicks, totalBeats, notes:[{ tick, voice, holdTicks?, gapTicks? }] }` — one pass, every voice, muted ones included |
| `attachAudio(ctx, out)` | use this context and send sound to `out` instead of the speakers |
| `sound(voice, opts)` | sound one voice **now** (by `ctx.currentTime`). Poem: `{ holdMs, style: 'tone'\|'drum' }`; ostinato: `{ gapMs }` |
| `highlight(beat)` | light a beat (and follow it on the page); `-1` clears |
| `stop()` | clear the lights and settle the page |
| `getView()` / `setView(patch)` | how the score is shown (see `VIEW_KEYS` in each app) |
| `sizing()` | `{ w, h, padW, padH, maxScale, mode: 'page'\|'fit'\|'fixed', fixedScale, layouts? }` |
| `refit()` | re-fit to the frame |
| `editable` | `false`: all input is swallowed. The switch for minimal editing later |
| `onHostKey` | set by the POP; the frame passes keys up so Space works everywhere |

## What embedded mode changes in the apps

Each app's `script.js` starts with an **EMBEDDED IN THE POP** block and has a
**THE POP BRIDGE** section; each `style.css` ends with an `EMBEDDED IN THE POP`
block. Outside the POP none of it runs. Inside it:

- `localStorage` is replaced by a layer that reads the real storage and keeps
  every write in memory — nothing the POP does can change an app's library,
  its open song or its settings.
- The body gets `embedded present-mode`: the score and nothing else.
- Lesson and share links in the frame's own address are ignored.
- All clicks and taps are swallowed (scrolling still works); keys go to the POP.
- Rhythm Poetry gains a `'page'` size (fit both ways) and chooses its own bars
  per line for the pane; Ostinato Builder shrinks past its usual 55% floor
  rather than scrolling, and centres its grid.

Two small changes also apply outside the POP and do not change behaviour there:
Rhythm Poetry's brush and tone voices now read the clock once like every other
voice, and Ostinato Builder's `buildTimeline()` reads each track through a new
`trackOnsets()`, which the bridge shares.

## Not built yet

- **Editing in the panes.** `bridge.editable` is the switch; the frames already
  hold the full apps.
- Starting from a chosen bar; a pause that resumes where it left off.
- Other apps. The protocol above is the whole of what one needs to provide.
