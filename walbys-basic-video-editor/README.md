# Walby's Basic Video Editor

Made 2026-11-03. A desktop-only editor that makes an MP4 from pictures, text and sound. There's no video
input and nothing moves: pictures sit where you put them, for as long as you make them last.

## Opening it
Double-click **Walby's Basic Video Editor.app** in **Documents › Walby's Basic Video Editor**. It starts
a small server on this Mac (port 8841, no internet) and opens the editor in its own Chrome window.
`Open Walby's Basic Video Editor.command` in this folder does the same thing.

**The first time:** choose the folder **Documents › Walby's Basic Video Editor** as the projects folder,
then let Chrome edit it. Each project becomes its own folder in there:

    <project>/project.json     the timeline (saved as you work)
    <project>/Media/           copies of the pictures and sounds you added
    <project>/Exports/         MP4s
    <project>/Screenshots/     📷 PNGs

## What it does
- **Picture tracks** (the top track is in front) and **audio tracks** with waveforms. You can add as many
  as you like. Overlapping moments go on different tracks; one track can't stack two clips at once.
- **Canvas:** click to select, drag to move, corners to size (keeps the shape; Shift stretches). It snaps to
  the edges, the middle and other pictures (Option, or untick Snap, to place freely). Double-click or press
  **C** to crop: drag the edges, or drag inside to slide the picture. The Fit, Fill, Centre and 1:1 buttons
  and the 16:9, 4:3, 1:1 and 9:16 crops are in the right-hand panel.
- **Timeline:** drag clips in time or between tracks, drag their ends to change length (audio: trims the
  sound), and use the dots at the top corners for fade in/out. ⌘/Ctrl-scroll or pinch zooms; there's a
  slider and a Fit button too.
- **Text** boxes (font, size, colour, bold, shadow, box behind), opacity, fades, and volume per clip
  and per track. Tracks can be muted or hidden.
- **Split** (S), duplicate (⌘D), copy/paste (⌘C/⌘V), delete, and undo/redo (⌘Z / ⇧⌘Z). You can paste a
  picture from the clipboard, and drag files in from Finder.
- **📷 Screenshot** (⇧⌘S): a full-size PNG of the canvas at the playhead, saved into Screenshots and
  copied to the clipboard.
- **Export MP4** (⌘E): H.264 + AAC, 24/25/30/60 fps, at canvas size or smaller/bigger. It's made in Chrome
  (WebCodecs + Mediabunny in `lib/`), so no ffmpeg is needed.

## Code
Plain scripts with no build step: `js/model.js` (project, undo), `store.js` (folders), `media.js`,
`render.js` (one moment, used by the stage, the screenshot and the MP4), `stage.js`, `timeline.js`,
`player.js` (Web Audio; the export mixes with the same `schedule`), `inspector.js`, `export.js`, `app.js`.
`?test` in the address uses Chrome's private folder instead of Documents (launch entry
`video-editor-test`, port 8842). If this folder moves, run `bash tools/make-opener.sh` again.
