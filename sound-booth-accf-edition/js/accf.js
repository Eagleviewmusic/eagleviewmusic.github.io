/* ==========================================================================
   Sound Booth-ACCF Edition — accf.js
   The ACCF songs: the list, the window that picks one, and putting the chosen
   song on a track. A song arrives the same way an added MP3 does, so it plays,
   edits, saves and exports like one.
   ========================================================================== */
(function () {
  'use strict';
  const VB = window.VB;
  const P = VB.Project, E = VB.Engine;
  const $ = id => document.getElementById(id);

  /* name: what people see. file: in songs/. The window always shows A to Z, so a
     song added later can go anywhere in this list. */
  const SONGS = [
    { name: 'Cantar - Piano [2011]', file: 'cantar-piano-2011.mp3' },
    { name: 'El Coqui Accompaniment', file: 'el-coqui-accompaniment.mp3' },
    { name: 'El Coqui Accompaniment+voice parts', file: 'el-coqui-accompaniment-voice-parts.mp3' },
    { name: 'Fox went out on a chilly night Accompaniment 86 BPM', file: 'fox-went-out-accompaniment-86-bpm.mp3' },
    { name: 'Fox went out on a chilly night Accompaniment 96 BPM', file: 'fox-went-out-accompaniment-96-bpm.mp3' },
    { name: 'I sing because I’m happy Accompaniment', file: 'i-sing-because-im-happy-accompaniment.mp3' },
    { name: 'Lunar Lullaby - Piano [2022]', file: 'lunar-lullaby-piano-2022.mp3' },
    { name: 'Paruparong Bukid Accompaniment 120BPM', file: 'paruparong-bukid-accompaniment-120-bpm.mp3' },
    { name: 'Paruparong Bukid Accompaniment 142BPM', file: 'paruparong-bukid-accompaniment-142-bpm.mp3' },
    { name: 'Shine Accompaniment', file: 'shine-accompaniment.mp3' },
    { name: 'Shine Accompaniment+voice part', file: 'shine-accompaniment-voice-part.mp3' },
    { name: 'Sotuko In Accompaniment', file: 'sotuko-in-accompaniment.mp3' }
  ].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  const X = VB.Accf = { songs: SONGS };
  let targetId = null;

  X.mount = function () {
    const list = $('accf-list');
    for (const song of SONGS) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'accf-song';
      b.textContent = song.name;
      b.addEventListener('click', () => {
        $('dlg-accf').close();
        X.load(song, targetId);
      });
      list.append(b);
    }
    $('accf-close').addEventListener('click', () => $('dlg-accf').close());
    $('empty-accf').addEventListener('click', () => X.open(P.data.currentId));
  };

  X.open = function (trackId) {
    const t = P.track(trackId);
    if (!t || E.state === 'recording') return;
    targetId = trackId;
    $('accf-onto').textContent = t.name;
    $('dlg-accf').showModal();
  };

  /* Already fetched for this project? Then no second download, and no second copy kept. */
  function fetched(song) {
    for (const s of P.sources.values()) if (s.kind === 'file' && s.name === song.name) return s;
    return null;
  }

  async function bring(song) {
    const res = await fetch('songs/' + song.file);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const blob = await res.blob();
    return E.importFile(new File([blob], song.name + '.mp3', { type: 'audio/mpeg' }));
  }

  /* Whatever was on the track makes way for the song. Undo brings it back. */
  X.load = async function (song, trackId) {
    const A = VB.App;
    const first = P.track(trackId);
    if (!first || E.state === 'recording') return false;
    const sung = P.clipsOn(trackId).some(c => { const s = P.source(c.sourceId); return !s || s.kind !== 'file'; });
    if (sung && !confirm('“' + first.name + '” has your singing on it. Replace it with “' + song.name + '”?')) return false;
    if (E.state !== 'stopped') await E.stop();

    let src = fetched(song);
    if (!src) {
      A.cover('Loading ' + song.name + '…');
      try {
        src = await bring(song);
      } catch (err) {
        console.error(err);
        A.cover(null);
        VB.say('“' + song.name + '” couldn’t be loaded. Check your internet connection and try again.', 'warn');
        return false;
      }
      A.cover(null);
    }

    const placed = P.edit('loading an ACCF song', () => {
      const t = P.track(trackId);
      if (!t) return false;
      const reuse = /^Voice \d+$/.test(t.name) ? t.name : null;
      P.data.clips = P.data.clips.filter(c => c.trackId !== t.id);
      P.data.clips.push({
        id: VB.uid('c'), trackId: t.id, sourceId: src.id, name: src.name, muted: false,
        pos: 0, offset: 0, len: src.length
      });
      t.name = src.name;
      if (P.sel.clipId && !P.clip(P.sel.clipId)) P.sel.clipId = null;
      if (P.sel.range && P.sel.range.trackId === t.id) P.sel.range = null;
      A.keepRoomToSing(reuse);
    });
    if (placed) {
      VB.Timeline.userZoomed = false;
      VB.Timeline.layout();
      if (sung) VB.say('Your singing on that track was replaced. Undo brings it back.');
    }
    return !!placed;
  };
})();
