# Teacher Library

Songs published here reach every student's Eagle View Music apps as
**Shared** songs.

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

## What the files are

Each `<app>--<id>.json` is one song in the shared EVM format
(`"format": "evm-item"`). Don't edit `index.json` by hand — it is rebuilt from
the files every time something here changes.
