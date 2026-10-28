/* ==========================================================================
   Song Writer 3.0 — components/syllable-review.js
   --------------------------------------------------------------------------
   Split into syllables, in the Write window (2026-10-26, the user's
   design). Words are easy to type in; a word of several syllables then
   needs several notes and rhythms, and splitting it by hand was the slow
   part. So:
     1. Split into syllables (beside Words | Words and notes) reads the
        words in the box — what is typed there now — and lights every word
        it would break, shown broken: wa-ter-mel-on.
     2. A tap on a lit word leaves it whole. A word with another way to go
        (ev-ery / ev-er-y; a dot marks it) shows that way on the next tap,
        then whole. A dotted underline: a guess (a name, a made-up word) —
        worth a look. All / None light or clear every word.
     3. Split N words puts the split words in the box with their hyphens
        and sets the words to the notes (score.js submitWords →
        wordsToScore): each syllable gets a note of its own — the word's
        own connected notes first, then copies of its last note — and the
        words after it keep theirs. On the Pitch page the word still
        reads whole on its notes; Notation and Rhythm write it in
        syllables with a hyphen between (score.js WORDS IN SYLLABLES).
   A way picked that is not the first offered is remembered for that word
   on this browser (EVMSyllables.choose).

   The splitting is lib/evm-syllables.js (the spec's rules, its tricky
   words and a 37,000-word list, loaded the first time this is opened).
   Not offered: one-syllable words, a word already split (wa-ter, or the
   old wa -ter), numbers, a lone "-".
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const SY = window.EVMSyllables;
  const $ = id => document.getElementById(id);
  const sheet = document.querySelector('#textEditorPopup .sheet');
  const box = $('textEditorText');
  const panel = $('syl-review');
  const btn = $('splitSyllablesBtn');
  if (!SY || !sheet || !box || !panel || !btn) return;
  SY.configure({ storageKey: 'song_writer_30_syllable_choices_v1' });

  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  let rows = [];          // [[{ tok, cand?: { ways: [[…]], pick: 0..ways.length (= whole), guess, note } }]]

  /* the words view only: Words and notes holds the whole song's text */
  function wordsView() { return !box.classList.contains('mono'); }
  function syncButton() {
    const ok = wordsView() && (!SW.settings || (SW.settings.can('words') && SW.settings.can('connected')));
    btn.hidden = !ok;
  }

  /* ---------------- reading the box ---------------- */
  /* the box's text, a row per line of text; an empty line (the break
     between two song lines — score.js wordParagraphs) is kept as an empty row */
  function read(text) {
    const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n').map(line => line.split(/\s+/).filter(Boolean));
    const out = [];
    lines.forEach(toks => { if (toks.length || (out.length && out[out.length - 1].length)) out.push(toks); });
    while (out.length && !out[out.length - 1].length) out.pop();
    const flat = [].concat(...out);
    let at = 0;
    return out.map(toks => toks.map(tok => {
      const w = { tok };
      const next = flat[++at];
      // already split by the writer (wa-ter, or the old wa -ter), or no word at all
      if (!/[^-]/.test(tok) || /-/.test(tok) || (next && /^-[^-]/.test(next))) return w;
      const r = SY.split(tok);
      if (!r || r.count < 2) return w;
      w.cand = { ways: [r.syllables].concat(r.alts), pick: 0, guess: r.confidence === 'low', note: r.note, source: r.source };
      return w;
    }));
  }
  function candidates() { return [].concat(...rows).filter(w => w.cand); }
  function picked(w) { return w.cand && w.cand.pick < w.cand.ways.length ? w.cand.ways[w.cand.pick] : null; }

  /* ---------------- drawing ---------------- */
  function chip(w, r, i) {
    const c = w.cand;
    const way = picked(w);
    const on = !!way;
    const label = on ? way.map(esc).join('<span class="syl-hy" aria-hidden="true">-</span>') : esc(w.tok);
    let title = on ? 'Will be split ' + way.join('-') + ' — tap to leave it whole' : 'Left whole — tap to split it';
    if (c.ways.length > 1) {
      const nx = c.pick + 1 < c.ways.length ? c.ways[c.pick + 1].join('-') : null;
      title = on ? (nx ? 'Will be split ' + way.join('-') + ' — tap for ' + nx : title) : 'Left whole — tap to split it ' + c.ways[0].join('-');
    }
    if (c.guess) title += ' (a guess — check it)';
    if (c.note) title += ' · ' + c.note;
    const cls = 'syl-chip' + (on ? ' on' : '') + (c.ways.length > 1 ? ' has-alt' : '') + (c.guess ? ' guess' : '');
    return '<button type="button" class="' + cls + '" data-r="' + r + '" data-i="' + i + '" aria-pressed="' + on + '" title="' + esc(title) + '">' +
      '<span class="syl-text">' + label + '</span></button>';
  }
  function draw() {
    panel.innerHTML = rows.map((row, r) => !row.length ? '<div class="syl-break" aria-hidden="true"></div>' : '<div class="syl-line">' + row.map((w, i) =>
      w.cand ? chip(w, r, i) : '<span class="syl-word">' + esc(w.tok) + '</span>').join(' ') + '</div>').join('');
    const all = candidates();
    const n = all.filter(picked).length;
    $('syl-review-count').textContent = all.length
      ? n + ' of ' + all.length + ' word' + (all.length === 1 ? '' : 's') + ' to split'
      : 'Nothing to split';
    const apply = $('sylApplyBtn');
    apply.textContent = n ? 'Split ' + n + ' word' + (n === 1 ? '' : 's') : 'Split';
    apply.disabled = !n;
    const alts = all.some(w => w.cand.ways.length > 1), guesses = all.some(w => w.cand.guess);
    const key = [];
    if (alts) key.push('<span class="syl-key-dot"></span> another way to split it — tap again to see it');
    if (guesses) key.push('<span class="syl-key-guess">dotted</span> a guess (a name, a new word) — check it');
    if (!all.length) key.push('Every word here is one syllable, or already split.');
    $('syl-review-key').innerHTML = key.join('<span class="syl-key-gap"></span>');
  }

  /* ---------------- open, choose, apply ---------------- */
  function open() {
    if (!wordsView()) return;
    btn.disabled = true;
    const go = () => {
      btn.disabled = false;
      rows = read(box.value);
      sheet.classList.add('reviewing');
      draw();
      const first = panel.querySelector('.syl-chip');
      if (first) first.focus({ preventScroll: true });
      else panel.focus();
    };
    // the word list, the first time (a missing list still splits: the tricky words, endings, rules)
    if (SY.ready()) go(); else SY.load().then(go, go);
  }
  function close() {
    sheet.classList.remove('reviewing');
    rows = [];
    panel.innerHTML = '';
  }
  function apply() {
    const lines = rows.map(row => row.map(w => {
      const way = picked(w);
      if (!way) return w.tok;
      // a way that is not the list's first is remembered for this word
      if (w.cand.pick > 0 || w.cand.source === 'override') SY.choose(w.tok, way);
      return way.join('-');
    }).join(' '));
    const n = candidates().filter(picked).length;
    box.value = lines.join('\n');
    close();
    SW.score.submitWords();
    if (n && SW.ui && SW.ui.toast) SW.ui.toast(n === 1 ? 'One word split into syllables — a note for each' : n + ' words split into syllables — a note for each');
  }

  btn.addEventListener('click', open);
  panel.addEventListener('click', e => {
    const b = e.target.closest('.syl-chip');
    if (!b) return;
    const w = rows[+b.dataset.r][+b.dataset.i];
    w.cand.pick = (w.cand.pick + 1) % (w.cand.ways.length + 1);
    draw();
    const again = panel.querySelector('.syl-chip[data-r="' + b.dataset.r + '"][data-i="' + b.dataset.i + '"]');
    if (again) again.focus({ preventScroll: true });
  });
  $('sylAllBtn').addEventListener('click', () => { candidates().forEach(w => { if (!picked(w)) w.cand.pick = 0; }); draw(); });
  $('sylNoneBtn').addEventListener('click', () => { candidates().forEach(w => { w.cand.pick = w.cand.ways.length; }); draw(); });
  $('sylBackBtn').addEventListener('click', () => { close(); box.focus(); });
  $('sylApplyBtn').addEventListener('click', apply);
  sheet.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sheet.classList.contains('reviewing')) { e.preventDefault(); e.stopPropagation(); close(); box.focus(); }
  }, true);
  // Words | Words and notes, and every opening of the window: the button only for the words
  const seg = $('words-view-seg');
  if (seg) seg.addEventListener('click', () => setTimeout(syncButton, 0));
  const writeBtn = $('textEditorBtn');
  if (writeBtn) writeBtn.addEventListener('click', () => { close(); setTimeout(syncButton, 0); });
  // closed by its × or the backdrop: the next opening starts at the words
  const popup = $('textEditorPopup');
  if (popup) new MutationObserver(() => { if (!popup.classList.contains('show')) close(); }).observe(popup, { attributes: true, attributeFilter: ['class'] });
  SW.bus.on('policy:changed', syncButton);

  SW.syllableReview = { open, close };
})();
