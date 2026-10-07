// The 16 words on the board, in reading order (4 rows of 4).
//
//   id       file name for the picture and the two voice clips
//   en       written under the picture and spoken in English
//   zh       spoken in Mandarin (and shown when "Show Chinese" is on)
//   pinyin   for grown-ups only (the word list in the grown-ups panel)
//   picture  an ARASAAC pictogram number, or a file name in pictures/ for your own photo
//   group    row colour: needs · do · talk · feel
//
// After changing a word, run:  node tools/build.mjs
// It downloads any new picture, remakes the voice clips that changed,
// and bumps the offline cache so iPads pick up the change.
window.WORDS = [
  { "id": "bathroom", "en": "bathroom", "zh": "上厕所", "pinyin": "shàng cèsuǒ", "picture": 2430, "group": "needs" },
  { "id": "eat", "en": "eat", "zh": "吃东西", "pinyin": "chī dōngxi", "picture": 28641, "group": "needs" },
  { "id": "drink", "en": "drink", "zh": "喝水", "pinyin": "hē shuǐ", "picture": 29716, "group": "needs" },
  { "id": "hurt", "en": "hurt", "zh": "好疼", "pinyin": "hǎo téng", "picture": 28774, "group": "needs" },

  { "id": "help", "en": "help", "zh": "帮帮我", "pinyin": "bāngbang wǒ", "picture": 7171, "group": "do" },
  { "id": "more", "en": "more", "zh": "还要", "pinyin": "hái yào", "picture": 32753, "group": "do" },
  { "id": "all-done", "en": "all done", "zh": "好了", "pinyin": "hǎo le", "picture": 28429, "group": "do" },
  { "id": "play", "en": "play", "zh": "我想玩", "pinyin": "wǒ xiǎng wán", "picture": 2439, "group": "do" },

  { "id": "yes", "en": "yes", "zh": "是的", "pinyin": "shì de", "picture": 34521, "group": "talk" },
  { "id": "no", "en": "no", "zh": "不要", "pinyin": "bú yào", "picture": 34341, "group": "talk" },
  { "id": "stop", "en": "stop", "zh": "停下来", "pinyin": "tíng xiàlái", "picture": 8289, "group": "talk" },
  { "id": "my-turn", "en": "my turn", "zh": "轮到我了", "pinyin": "lúndào wǒ le", "picture": 7309, "group": "talk" },

  { "id": "happy", "en": "happy", "zh": "开心", "pinyin": "kāixīn", "picture": 28647, "group": "feel" },
  { "id": "sad", "en": "sad", "zh": "难过", "pinyin": "nánguò", "picture": 28645, "group": "feel" },
  { "id": "mad", "en": "mad", "zh": "生气", "pinyin": "shēngqì", "picture": 28671, "group": "feel" },
  { "id": "tired", "en": "tired", "zh": "累了", "pinyin": "lèi le", "picture": 28709, "group": "feel" }
];
