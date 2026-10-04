# Teacher Library

Songs published here reach every student's Eagle View Music apps as
**Shared** songs. Music Stand **arrangements** (a poem and an ostinato kept
together) go out the same way, as `music-stand--<id>.json`: each carries its
poem and ostinato inside it — with their Layout Settings and EASY choices — so
one file is all a student needs. Melody Reader **melody sets** (melodies a
teacher wrote in My melodies) go out as `rainbow-reader--<id>.json`.

## Publishing

1. Open **eagleviewmusic.com/Librarian/** in the browser where you made the
   songs. Tick them and press **Download**.
2. In this folder on GitHub: **Add file → Upload files**, drag the files in,
   press **Commit changes**.
3. That's all. An automatic step rebuilds `index.json` (the list the apps
   read) about a minute later.

## Changing or removing a song

- **Changed a song?** Download it again from the Librarian and upload it. The
  file has the same name, so it replaces the old one, and students get the
  new version.
- **Taking a song back?** Open its file here and delete it (the ⋯ menu →
  Delete file).
- **Still working on it?** In the Librarian's *Teacher Library* tab, **Hide**
  keeps a song here but off the students' shelf (a student who already has it
  keeps that copy, and gets your new version when you **Show** it). Its
  **Download** saves the file as your own copy, to open in the app on another
  computer (Library → Restore from a backup) and keep working there. A hidden
  file has `"hidden": true` in it; the index lists it under `hidden`.

## What the files are

Each `<app>--<id>.json` is one song in the shared EVM format
(`"format": "evm-item"`). Don't edit `index.json` by hand — it is rebuilt from
the files every time something here changes.
