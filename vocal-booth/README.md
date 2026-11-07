# Vocal Booth

A small browser recorder for one job: get a clean vocal line from someone singing to an accompaniment, as a WAV.
Plain scripts, no build, no server beyond static files. It needs https (or localhost) for the microphone.

Run it locally: launch entry `vocal-booth` (port 8844). Tests use `vocal-booth-test` (8845), a separate origin.

## What it does

- Record onto a track from the playhead, with a live waveform, a level meter and a sticky Too loud light.
- Mic check: choose the microphone, level advice, room noise, a five-second listen, and a headphone-leak and timing test.
- Tracks: add, name, delete, mute, volume. Add an MP3 (or WAV, M4A and so on); it lands on an empty track.
- Clips: drag (to other tracks too), trim by the edges, split, duplicate, copy and paste, mute, delete, nudge with the arrow keys.
- Select part marks a portion of a track for copy, duplicate, mute, delete or split. Holding Shift while dragging does the same.
- Undo and redo for all of it. Saved in the browser as you go, including while recording.
- Export: 24-bit WAV, each track on its own or all together.

Keys: Space play/stop · R record · S split · D duplicate · M mute · Delete · ⌘/Ctrl C X V Z · Home back to start · arrows nudge 10 ms (Shift 100 ms) · − + zoom · Esc clear.

## Decisions (my calls, unconfirmed)

| | Decision | Why |
|---|---|---|
| D1 | Raw samples from an AudioWorklet, never MediaRecorder | MediaRecorder compresses |
| D2 | Echo, noise, auto gain and voice isolation asked off as `ideal`, then read back and reported | A constraint is a request; `exact` can leave no microphone |
| D3 | The context runs at the microphone's rate when the project is still empty (44.1 or 48 kHz; anything else 48) | No resampling on the way in |
| D4 | A take is mono: whichever input carried more, chosen when it ends | A two-input interface may have the singer on either; averaging loses 6 dB to a silent channel, and averaging two capsules can comb |
| D5 | No software boost at all | It cannot add quality; the advice is to move or use the OS input level |
| D6 | Clips may overlap; the last placed lies on top and only the top sounds | A new take simply covers the old; moving or trimming it brings the old back |
| D7 | A drag moves a clip; marking a portion needs Select part or Shift | Moving is what most singers will try first |
| D8 | The tool returns to Move after an action on a part | Like the Recording Studio's Split mode |
| D9 | Under-3 ms fade (128 samples) only at edges that cut into a recording; pieces still continuous are joined and stay bit-exact | A hard cut clicks. This is the one thing done to the audio, and only at cuts |
| D10 | Takes move earlier by the round trip: measured by the chirp test per microphone, else outputLatency + baseLatency + track latency | The singer hears the backing late and the mic delivers late |
| D11 | Recording over an added file makes no sense, so the record target skips file tracks | Protects the accompaniment |
| D12 | Every exported file starts at 0:00 and runs to the project's end | Stems line up by dropping them in |
| D13 | Export ticks voice tracks by default, not added files or muted tracks | The vocal is what is wanted |
| D14 | A file or mix that would pass full scale is turned down as a whole and says so; no limiter | Never clips, never colours |
| D15 | One project per browser, in IndexedDB; rows written every half second | A crash costs half a second at most; no files to manage |
| D16 | No live monitoring of the voice | Browser latency is distracting; the tip is to leave one ear uncovered |

Left out on purpose: effects, count-in, solo, project files, sharing.

## What the tests cover

`node tools/test.mjs` with the Bash sandbox off (about 90 s). It drives real headless Chrome, AudioWorklet and IndexedDB, and checks the WAV bytes in Node.

- A ramp fed straight to the worklet on the same clock: no sample lost, doubled or changed, also after reloading.
- A split alone changes no sample; moves, pastes, mutes, deletes, volumes and mixes are checked sample by sample.
- A 37 ms "room": the timing test reads 37 ms and a take lands 0 samples off the backing.
- Singer on input 2, a page closed mid-take, a real MP3 (encoded with lamejs), and real mouse and key events on the timeline.
- A refused microphone, an unplugged saved microphone, a permission box left waiting, and two requests at once.

**Not covered:** a real microphone or real headphones. `getUserMedia` never returns in any Chrome launched from this tooling, even plain `audio:true` with Chrome's fake device, or in the desktop app's pane. The test's microphone is a real MediaStream from an oscillator, and refusals are simulated by making `getUserMedia` reject. Only Chrome has been run; Safari and Firefox code paths are written but untested.

## Traps

- A sine accompaniment correlates with itself every cycle, so a timing test on one reads a false offset. Use noise.
- An MP3 with no gapless header decodes about 25 ms late at 44.1 kHz (a click at 1.000 s landed at 1.0251 s). Stems line up with the MP3 as this browser decoded it; a WAV accompaniment has no such offset.
- A clip shows its speaker icon only when wider than 60 px.
- A clicked button is blurred on purpose: Space would otherwise press Record again as it stopped the take.

## Going live

Folder `vocal-booth/` in tiers 2 and 3. Leave `tools/` out. The GoatCounter snippet is already in `index.html` and only counts on eagleviewmusic.com.
