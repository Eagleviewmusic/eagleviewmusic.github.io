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
