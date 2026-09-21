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

A score has a shape, and the room has a shape, and they are usually not the
same shape. A band of eight instruments over one bar is a tall, narrow thing; a
poem is a long, thin one; a screen is neither. Give a tall score a wide, short
band and most of the band stays empty however the line between the panes is
moved — which is why this is not a question about the split.

So a score is not asked how big it is. It is asked **what shapes it can be**
(`sizing().layouts`, one entry per number of bars to a line), and the stand
chooses. Ostinato Builder answers with its **Lines** layout — so many bars
across, then the same instruments again underneath, like a printed score;
Rhythm Poetry with its bars to a line. Three things are then chosen together,
because each one changes what the others are worth:

| | |
| --- | --- |
| arrangement | one above the other, or side by side |
| shape | how many bars to a line, for each score |
| split | where the line between the panes goes |

Every combination is tried and scored by **the size of the smaller of the two
scores** — the one that decides whether the back of the room can read this. It
is all worked out from the box the panes share rather than measured off the
frames, so an arrangement can be judged without first being committed to and
undone.

**Automatic** (the default for both the arrangement and the sizes) hands all
three to the stand. Choosing an arrangement yourself, naming a number of bars
in a View menu, or dragging the line takes that one back; the rest stay
automatic. Double-click the line to give the split back.

What this is worth, measured on a 1024×768 screen with a two-bar ostinato and
a two-bar poem: the two scores went from painting **31%** of the screen to
**45%**, and on a tablet at 768×1024 to **62%**, with each pane 85–87% full.
Side by side, where the ostinato's pane is tall and narrow, the stand asks for
one bar to a line and the ostinato fills **83%** of its pane instead of about
a third.

Nothing in the solver knows what a poem or an ostinato is. An app publishes a
menu of shapes and is handed a box, and that is the whole of the contract —
which is what has to hold when a third app arrives.

### A narrow screen

Below 640px the stand stops being a split view and becomes a page: each score
is drawn as large as the **width** allows, is given exactly the height that
takes, and the two of them scroll. Reading a stand on a phone means scrolling;
reading two postage stamps does not mean anything. The shape is chosen on the
same principle, against one dimension — the widest line that still comes out
big enough to read, which on a phone usually means one bar to a line.

Full screen is the opposite promise: **nothing scrolls**. Both scores fit, and
present mode simply gives the solver the whole screen to work with.

## Editing

**Edit**, in the top bar, hands both scores back to the pointer. What you
can reach is the score's own controls: the beat divisions, the joins, the
repeat marks, a word you tap and retype, and a **+** and **×** on the
closing bar line for adding and removing bars. The apps' own chrome stays
away — the tempo, the sounds and the mutes belong to the Music Stand now,
and Auto-save, the library and sharing mean nothing in a pane.

**Nothing you do here reaches the apps.** Each app, opened in a frame,
has its `localStorage` swapped for a layer that reads the real thing and
keeps every write in memory, so the poem in Rhythm Poetry and the
ostinato in Ostinato Builder cannot be touched from here — not by
editing, and not by anything else. That is what makes this safe to
offer: the score on the stand is yours to pull about.

What it does change is the pairing. A score edited here stops being the
library's copy and becomes this stand's own: the heading says **Edited
here**, and **Save pairing** keeps it, changes and all. Where the score
came from a library, the chip is also the way back — press it twice to
throw the changes away and open the saved version again.

Editing stops the music, because the plan the conductor is reading from
was built from the old score. Present mode turns editing off: showing
and working are two different jobs, and the way out of editing is in the
bar present mode hides.

## Sound

The stand owns the one AudioContext, and both panes play into it — that is in
**Timing**. Three things sit on top of it.

**The stand has its own copy of the instrument library.** `lib/instruments/`
holds the shared percussion engine, the same one Ostinato Builder plays and
Rhythm Poetry now sounds its rhythm on. It is not a second way of playing the
music — a pane plays its own score — it is for the stand's own sounds, starting
with hearing an instrument in the picker before you take it. The apps that join
this stand later bring pitched instruments with them, and they go here, which is
why the code asks the library what it holds rather than naming anything.

**The mixer can change an ostinato's instruments.** Tap the picture beside a
line — in the mixer, or on the track head in the pane, with or without Edit on —
and the stand's picker opens, showing what the app offers, narrowed the way the app would narrow it (a lesson can
lock the instruments, and then no picker opens at all). Tapping one plays it and
takes it. It is an edit like any other made in a pane: the ostinato on the stand
becomes its own copy, marked **Edited here**, and the one in the library is not
touched. A picture pressed in the pane reaches the stand through
`onInstrumentPick(voice)`; the pane's swallow guard lets `.instrument-btn:not(.fixed)`
through for it, the same way it lets the mute badge through.

**EASY mode in the panes.** Each pane's View menu has *Above the beats: None /
Dots / EASY* — the same three states each app's dots button cycles through. It is
two view keys, `showDots` and `easyMode`, both in each app's `VIEW_KEYS`, kept per
pane and never written to the app's prefs. The EASY circles show the lit rhythm
at all times and only take a tap while Edit is on; a tap writes ordinary
rhythm data and comes back through `onEdit` like any other edit. The circles
come from the app's own Layout Settings (`layout.easy`), read from its storage.

**Mutes are the stand's, not the piece's.** The button in the mixer and the badge
on the instrument in the pane are one switch seen twice, and each moves the other
(`setVoiceMuted` / `onVoiceMute`). Neither changes the song: an ostinato arrives
with its own mutes, the stand starts its mixer from them, and from then on the
mixer is the answer. So muting in a pane never marks a piece edited, and the
badges work whether or not editing is on.

**Strength** (mixer, under the poem) is how full the poem's voice is — ×1, ×2 or
×3. A tone gains the octave above it and then the one above that; a drum gains
another instrument (tom and shaker, then the snare, then the claves). It is
Rhythm Poetry's own switch, reached from here and sent with each note, because
the complaint it answers is one only a stand can hear: on its own the poem is
fine, and under an ostinato it is thin. Rhythm Poetry has the same control in its
own **Sound** popover, where it is remembered between visits.

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
| `sound(voice, opts)` | sound one voice **now** (by `ctx.currentTime`). Poem: `{ holdMs, style: 'tone'\|'drum', strength: 1\|2\|3 }`; ostinato: `{ gapMs }` |
| `setVoiceMuted(voice, muted)` | ostinato only: show that voice muted in the pane. The mute is the Music Stand's, not the piece's — the song is not changed |
| `onInstrumentPick` | ostinato only: set by the Music Stand; the frame calls it with the voice when an instrument picture in the pane is pressed |
| `onVoiceMute` | ostinato only: set by the Music Stand; the frame calls it when a mute badge in the pane is pressed. Not an edit |
| `instruments(voice)` | ostinato only: `{ editable, current, items:[{ id, label, alt, image }] }` — what this piece may be played on, lesson policy included |
| `setInstrument(voice, id)` | ostinato only: change one line's instrument; returns `info()` or `null`. **This is an edit**, and the Music Stand asked for it, so `onEdit` does not fire — the caller reports it |
| `highlight(beat)` | light a beat (and follow it on the page); `-1` clears |
| `stop()` | clear the lights and settle the page |
| `getView()` / `setView(patch)` | how the score is shown (see `VIEW_KEYS` in each app). Rhythm Poetry's include `textPct` (words 60–250 %) and `lyricFont` (`rounded`, `reader`, `clear`, `story`); the Music Stand's own View menu for the poem sets both, per pane, without touching the app's settings |
| `sizing()` | `{ w, h, padW, padH, maxScale, mode: 'page'\|'fit'\|'fixed', fixedScale, layouts? }`. `layouts` is `[{ n, w, h }]` — every shape this score could be drawn in, one per number of bars to a line. It is a list of what the score *could* look like, not of what it currently does, so it must not empty out once the stand has chosen from it |
| `refit()` | re-fit to the frame. The stand calls this straight after it changes a pane's size rather than waiting for the frame to notice, because the next answer is worked out from what the frames report |
| `editable` | `false`: all input is swallowed, save for the mute badges. Set it to `true` and the score answers the pointer — see **Editing** below |
| `onHostKey` | set by the Music Stand; the frame passes keys up so Space works everywhere |
| `onEdit` | set by the Music Stand; the frame calls it when the score has come out different. Take `snapshot()` and `info()` again on hearing it |

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
  One exception: Ostinato Builder's **mute badges**, which answer whether or not
  the score is being edited. Muting is the mixer's job, and the mixer is always
  live — see **Sound** below.
- Rhythm Poetry gains a `'page'` size (fit both ways) and chooses its own bars
  per line for the pane; Ostinato Builder shrinks past its usual 55% floor
  rather than scrolling, and centres its grid.
- Ostinato Builder's pane defaults to the **Lines** layout with the number of
  bars left to the stand. A pane that turns its own pages under a stand that
  is already turning them is one page too many, so in a pane the whole
  ostinato is on show. A session saved with the old default (Pages, four to a
  page) is moved on to it; a number anyone actually chose is left alone.
- Everything an app added for editing stays out of the pane until the Music
  Stand asks for it. Present mode hides the beat- and bar-line simile marks,
  the join and division buttons, the bar-line +/× and the top bar (which is
  where the Auto-save switch lives), so a new editing control must be added to
  that list or it will show up, and answer a hover, in the Music Stand.
- `bridge.editable = true` puts `editing` on the body as well. Each stylesheet
  then lets present mode's hiding back off again, control by control — which is
  where the answer to "what may be edited in a pane" is actually written. Left
  hidden on purpose: Ostinato Builder's track order (the Music Stand's mixer
  is already showing an answer for that) and Rhythm Poetry's line handles
  (the Music Stand chooses the bars per line itself, and would overrule a
  handle at the next re-fit). Its instrument buttons answer whether or not
  the pane is editing, and open the stand's picker, not the app's.
- Every edit in both apps ends in `render()`, so that is where the frame tells
  the Music Stand. It only speaks when the pane has been touched since it last
  spoke *and* the piece has actually come out different — `render()` is also
  the end of a re-fit and of a change of view, and Rhythm Poetry's pads the
  poem out to whole bars as it draws.
- When the poem's lyric font changes, the words are measured again once the
  face has arrived and the Music Stand works out the split again after that; a face
  measured in its fallback would leave the bars the wrong width.

Three changes also apply outside the Music Stand. Two do not change behaviour
there: Rhythm Poetry's brush and tone voices now read the clock once like every
other voice, and Ostinato Builder's `buildTimeline()` reads each track through a
new `trackOnsets()`, which the bridge shares. The third does: Ostinato Builder
has gained the **+** and **×** on its closing bar line, in the app itself as
well as in a pane, because Rhythm Poetry has had them all along and the length
of a piece should be changeable where the music is and not only in the toolbar.
They are drawn once, on the top line, since the length belongs to the piece
rather than to one instrument; the toolbar's stepper still says the same thing
in words.

## Not built yet

- Sharing the room between more than two scores. The solver tries every
  combination, which is fine for two apps and a handful of shapes each and
  will not be for five; when a third arrives it wants a proper packing rather
  than a wider net.
- Editing the time signature or adding and removing tracks in a pane. Those
  are the pieces of the apps the Music Stand deliberately keeps for itself or
  leaves to the app proper. (The instruments are no longer among them.)
- Pitched instruments in the stand's library. The engine there is the
  percussion one; the apps that bring pitched voices have not arrived yet.
- Starting from a chosen bar; a pause that resumes where it left off.
- Other apps. The protocol above is the whole of what one needs to provide.
