# Rainbow Xylophone (sandbox copy of the built app)

This folder is the **built** Rainbow Xylophone, for the sandbox (the Recording
Studio frames it from here). Nothing here is source code to edit.

- The source lives in `App Projects/rainbow-xylophone/` (React + Vite).
- `index.html` + `assets/` are the published page from
  `Eagle View Music/rainbow-xylophone/` (visit counter, self-hosted wood texture).
- `bundle.js` is the new build. **The page does not load `bundle.js`** — like
  the published page, `index.html` carries the bundle inline, in its last
  `<script type="module">`. Here that inline script is the new build.

## Rebuilding

In `App Projects/rainbow-xylophone/`: `npm run build`, then copy
`dist/bundle.js` here **and** put it inside `index.html` in place of the old
inline bundle (the same splice `scripts/inline-build.js` does). From this folder:

```sh
cp "../../rainbow-xylophone/dist/bundle.js" bundle.js
node -e 'const fs=require("fs"),o="<script type=\"module\">\n",t="\n    </script>\n  </body>\n</html>\n",h=fs.readFileSync("index.html","utf8");fs.writeFileSync("index.html",h.slice(0,h.indexOf(o)+o.length)+fs.readFileSync("bundle.js","utf8")+t)'
```

## The studio link (2026-10-22)

Opened with `?embed=studio` inside the Recording Studio, the xylophone joins
the studio once (`window.parent.EVMStudio.join(window, 'rainbow-xylophone')`)
and reports every real bar strike — mouse, touch or computer key — as
`studio.hit([frequency], 'vibraphone' | 'marimba', 1)`. The tutorial's demo
tones are not reported. Without `?embed=studio`, or framed by another site, it
does nothing. Contract: `Recording Studio/README.md`, "The instrument link".

In the source, `App.tsx`: `joinStudio` near the top (after `IN_IFRAME`), and
the one `studio?.hit(...)` line right after `xylophoneAudio.playNote` in
`triggerCustomNote`. Not yet in the published copy in `Eagle View Music/`.

## The Scales window (2026-10-24)

Settings (the gear, now at the far right of the header) → **Scales** opens one
window: a key (12 chips, spelled the way the Virtual Keyboard spells them), the
Virtual Keyboard's scales by family (its Minor and Natural Minor are the same
notes, so Minor is listed once), the user's own scales, and **+ Build a scale**.
Opening the window changes nothing; a tap on a key or a scale is applied at
once: the first bar becomes the key's letter, bars take the scale's ♯/♭, bars
whose letter is not in the scale are switched off (the bolts turn them back on).
A note with no letter of its own on a 7-letter xylophone (Blues' ♭5 beside
its 5, an octatonic's eighth note) is left out and the window says so.

The window re-detects the scale on the instrument when it opens; a hand-set
or linked layout shows as "Your own scale" with nothing in the lists lit, and
a key tap then transposes it rather than replacing it. **Build a scale** starts
from whatever is on the keys (each note keeps the letter it sits on: D♯ on the
D bar stays ♯2) and applies nothing until a note is tapped; Cancel, Escape, ×
or the backdrop mid-build put the keys back exactly. An own scale that is
selected shows an **Edit** button in the brown result box; Save changes keeps
its id. Own scales are degrees only (`localStorage` key
`rainbow_xylophone_my_scales`), so they work in any key.

In the source: `utils/scales.ts` (scale list, spelling, the fit onto seven
letters, detection, `instrumentToDegrees`), `components/ScalesModal.tsx` (the
window), `utils/scaleStorage.ts` (`loadMyScales` / `saveMyScales`), and in
`App.tsx` `openScales` / `applyScale` / `restoreInstrument` plus the settings
sub-menu (now `right-0 w-max`, wrapping on a phone). The older "Custom Scale
Library" in the Save window was REMOVED the same day (it confused what the
link saved); its storage key `rainbow_xylophone_custom_scales` is unused.
The tutorial's step 8 now describes Scales + Save. Not yet in
`Eagle View Music/` (tiers 2 and 3).
