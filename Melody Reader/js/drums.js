/* ==========================================================================
   Melody Reader — drums.js
   --------------------------------------------------------------------------
   RR.Drums — the metronome's Drum beat (2026-10-13, the user's: "To help
   the players feel the beat, I'd like to add a simple drum beat as an
   alternative to the metronome. This would work just like the metronome,
   playing the assigned BPM"). The metronome's sound is Click or Drum beat
   — in Tools, in a battle's metronome pop-up and on the ✎ page's Look &
   Feel (the practice's `beat`; Practice's lessons keep it in the look,
   RR.teachLook) — and beat.js plays whichever it is.

   The beats are the user's, written in Ostinato Builder 2.0 and played on
   its kit (lib/instruments, vendored — Ostinato Builder's own sounds), one
   for each meter Melody Reader plays (RR.METERS). Each instrument's line is
   its beats, | between them, a character a slot: x a hit, - nothing — two
   to a beat are eighths, four sixteenths, three a triplet (in 6/8: three
   eighths, six sixteenths). A beat may be more than a bar long (3/4's was
   two until the user shortened it the same day): it goes round, from its
   first bar at the music's first full bar.
   An Ostinato Builder backup converts as it is (RR.Drums.fromOstinato —
   only the bars the song plays: Ostinato Builder keeps beats past its end
   that it doesn't play), and tests/drum-beats/ keeps each one's source.

     4/4   bass 1, 3 and the and of 4 · snare 2 and 4 · tom the last
           sixteenth of 1 and 2, the and of 3 and 4 · hi-hat eighths
     3/4   bass 1 and the and of 3 · snare 2 and 3 · tom the last
           sixteenth of 2 and 3 · hi-hat 1, its and, the and-a of 2, 3 e and
     2/4   bass 1 · snare 2 · tom the last sixteenth of 1, the and of 2 ·
           hi-hat 1, the and of 1, the and-a of 2
     6/8   bass 1 · snare 4 · tom 3, 5 and 6 · hi-hat every eighth
     (a meter with no beat — none now — plays the click)
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;

  RR.DRUM_BEATS = {
    '4/4': {
      title: 'Simple Drum Beat',
      lines: {
        bass: 'x-|--|x-|-x',
        snare: '--|x-|--|x-',
        tom: '---x|---x|-x|-x',
        hihat: 'xx|xx|xx|xx'
      }
    },
    '3/4': {
      title: 'Simple Drum Beat in 3/4',                // the user's shortened one (2026-10-13): one bar, was two
      lines: {
        bass: 'x-|--|--x-',
        snare: '----|x-|x-',
        tom: '----|---x|---x',
        hihat: 'x-x-|--xx|xxx-'
      }
    },
    '2/4': {
      title: 'Simple Drum Beat in 2/4',
      lines: {
        bass: 'x-|--',
        snare: '----|x-',
        tom: '---x|--x-',
        hihat: 'x-x-|--xx'
      }
    },
    '6/8': {
      title: 'Simple Drum Beat in 6/8',
      lines: {
        bass: 'x--|---',
        snare: '---|x--',
        tom: '--x|-xx',
        hihat: 'xxx|xxx'
      }
    }
  };

  const cache = {};
  /* a meter's beat, bar by bar: [bar 1's hits, bar 2's …], each hit { tick, id, gap } — tick from its bar line
     (sixteenths), gap the ticks to the same drum's next hit (round the end of the beat) for the kit's fast-repeat
     sound. Null when the meter has none (or the kit didn't load) */
  function bars(time) {
    const key = RR.meterText(time), beat = RR.DRUM_BEATS[key];
    if (!beat || !window.VirtualInstruments) return null;
    if (cache[key] && cache[key].beat === beat) return cache[key].bars;
    const M = RR.meter(time), groups = {};
    Object.keys(beat.lines).forEach(id => { groups[id] = beat.lines[id].split('|'); });
    const n = Math.max(1, Math.ceil(Math.max.apply(null, Object.keys(groups).map(id => groups[id].length)) / M.beats));
    const span = n * M.barTicks, out = Array.from({ length: n }, () => []);
    Object.keys(groups).forEach(id => {
      const at = [];                                          // this drum's hits, in ticks from the beat's start
      groups[id].slice(0, n * M.beats).forEach((cells, b) => {
        for (let k = 0; k < cells.length; k++) if (cells[k] === 'x') at.push(b * M.beatTicks + k * M.beatTicks / cells.length);
      });
      at.forEach((t, i) => {
        const b = Math.floor(t / M.barTicks + 1e-9);
        out[b].push({ tick: t - b * M.barTicks, id, gap: (i + 1 < at.length ? at[i + 1] : at[0] + span) - t });
      });
    });
    out.forEach(h => h.sort((a, b) => a.tick - b.tick));
    const ok = out.some(h => h.length) ? out.map(h => h.length ? h : [{ tick: 0, id: null, rest: true }]) : null;
    cache[key] = { beat, bars: ok };
    return ok;
  }

  /* an Ostinato Builder 2.0 song (one from its backup file) as lines — the bars it plays (it keeps beats past its
     end that it doesn't) */
  function fromOstinato(song) {
    const time = [song.timeSignatureNumerator || 4, song.timeSignatureDenominator || 4];
    const played = Math.max(1, song.measures | 0 || 1) * RR.meter(time).beats, lines = {};   // 6/8: two beats a bar
    (song.tracks || []).forEach(t => {
      if (t.muted || !t.instrument || !Array.isArray(t.beats)) return;
      lines[t.instrument] = t.beats.slice(0, played).map(b => (b.cells || []).map(c => (c ? 'x' : '-')).join('')).join('|');
    });
    return { time, title: song.title || '', lines };
  }

  RR.Drums = { bars, fromOstinato, has: time => !!bars(time) };
})();
