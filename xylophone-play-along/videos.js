/* The videos, one tab each, in tab order (the first one opens when there is no link or last choice).
   To add a video: copy a line, then set
     slug    — a short name for its link (…/#dega)
     title   — the video's title (shown when you hover its tab)
     youtube — the id at the end of its YouTube link (youtu.be/Tupr8brKOGY → 'Tupr8brKOGY')
     notes   — the bars the video plays; the xylophone's other bars start switched off */
window.XB_VIDEOS = [
  { slug: 'eg', title: 'Xylophone Basics: Notes E & G', youtube: 'QZrYoYaalRE', notes: ['E', 'G'] },
  { slug: 'ega', title: 'Xylophone Basics: E G & A', youtube: 'VMBd5EeTRqA', notes: ['E', 'G', 'A'] },
  { slug: 'cde', title: 'Xylophone Basics: C D E', youtube: 'prJ4evzeoW8', notes: ['C', 'D', 'E'] },
  { slug: 'cdeg', title: 'Xylophone Basics: CDEG', youtube: 'BN0YtHwfIis', notes: ['C', 'D', 'E', 'G'] },
  { slug: 'dega', title: 'Xylophone Basics: DEGA', youtube: 'Tupr8brKOGY', notes: ['D', 'E', 'G', 'A'] },
];
