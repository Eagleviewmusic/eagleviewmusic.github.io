# I Can Say · 我会说

A 4 × 4 picture board for a four-year-old Mandarin speaker at an American daycare.
Tap a picture: a voice says the word in Mandarin, then in English. The English word is
written under each picture.

## The words

| Row (colour) | Words |
|---|---|
| Needs (blue) | bathroom 上厕所 · eat 吃东西 · drink 喝水 · hurt 好疼 |
| Doing (green) | help 帮帮我 · more 还要 · all done 好了 · play 我想玩 |
| Talking (pink) | yes 是的 · no 不要 · stop 停下来 · my turn 轮到我了 |
| Feelings (yellow) | happy 开心 · sad 难过 · mad 生气 · tired 累了 |

The top row holds the urgent things a teacher must understand quickly. Each row keeps one
colour, so she learns where things live. Most people in the pictures are the same girl with
long black hair.

## For grown-ups

Press and **hold** the gear in the top corner for about a second. A quick tap only shows a
hint, so small fingers can't open it. In the panel you can:

- choose the voice order: 中文 then English (the default), English then 中文, or one language only
- show the Chinese words on the board
- see every word with its pinyin

Settings are saved on the device.

## Changing a word

1. Edit `words.js`. To find a picture, search https://arasaac.org and use its number. To use
   your own photo, put it in `pictures/` and use its file name instead of a number.
2. Run `node tools/build.mjs` on the Mac. It downloads new pictures, remakes any voice clip
   whose text changed (with the Mac voices Tingting and Samantha), and updates the offline copy.

## Putting it on the iPad or phone

The board is a web page and must be hosted at an `https://` address, for example a GitHub
Pages folder. Open that address in Safari, tap Share, then **Add to Home Screen**. It then
opens full-screen like an app, and after the first visit it works without Wi-Fi.

Guided Access (Settings → Accessibility → Guided Access) keeps her inside the board.

## Preview on this Mac

`.claude/launch.json` entry `i-can-say`, port 8820. The offline cache is switched off on
localhost, so changes show up straight away.

## Credits

- Pictograms: Sergio Palao for ARASAAC (https://arasaac.org), Government of Aragón,
  CC BY-NC-SA 4.0. Personal, non-commercial use.
- Voices: Apple's Tingting (Mandarin) and Samantha (US English), recorded with macOS `say`.
- Lettering: Andika by SIL International, SIL Open Font License (`fonts/OFL.txt`).
