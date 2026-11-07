# Vocal Booth

A small browser recorder for one job: get a clean vocal line from someone singing to an accompaniment, as an MP3.
Plain scripts, no build, no server beyond static files. It needs https (or localhost) for the microphone.

Run it locally: launch entry `vocal-booth` (port 8844). Tests use `vocal-booth-test` (8845), a separate origin.

## What it does

- Record onto a track from the playhead, with a live waveform, a level meter and a sticky Too loud light.
- Mic check: choose the microphone, level advice, room noise, a five-second listen, and a headphone-leak and timing test.
- Tracks: add, name, delete, mute, volume. Add an MP3 (or WAV, M4A and so on); it lands on an empty track.
- Clips: drag (to other tracks too), trim by the edges, split, duplicate, copy and paste, mute, delete, nudge with the arrow keys.
- Select part marks a portion of a track for copy, duplicate, mute, delete or split. Holding Shift while dragging does the same.
- Undo and redo for all of it. Saved in the browser as you go, including while recording.
- Export: MP3, each track on its own or all together. Delete All clears everything from the browser.

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
| D17 | Export is MP3 only, the user's call (dozens of files, size). 192 kbps CBR for a mono voice, 320 for stereo | 1.44 MB a minute, six times smaller than 24-bit WAV. The top stays: 8–18 kHz within 0.2 dB, 18–20 kHz −3.6 dB. Recordings stay uncompressed in the browser until export |
| D18 | The first 1105 samples are left off before encoding | The codec adds that much at the start and lamejs writes no gapless header. Land on time: 0 samples off in Chrome's decoder, 529 (11 ms) early in macOS's own, which skips the decoder's share by itself. Every file shifts alike, so they stay in line with each other. The first 23 ms of the project are lost, normally silence |
| D13 | Export ticks voice tracks by default, not added files or muted tracks | The vocal is what is wanted |
| D14 | A file or mix peaking above −0.5 dB is turned down as a whole and says so; no limiter | A decoded MP3 can land above what went in. Never clips, never colours |
| D15 | One project per browser, in IndexedDB; rows written every half second | A crash costs half a second at most; no files to manage |
| D16 | No live monitoring of the voice | Browser latency is distracting; the tip is to leave one ear uncovered |
| D19 | No sample rate is asked of the microphone; the context follows it (44.1 or 48 kHz, anything else 48) | An iPhone converts to an asked-for rate inside the capture, which would hide the 16 or 24 kHz of a Bluetooth call route |
| D20 | iPhone and iPad: `navigator.audioSession.type` is `play-and-record` while the microphone is open (set before it opens), `auto` otherwise, also after a refusal | Sound starts at its proper level and keeps going if the screen locks mid-take; a session left on record with no microphone plays through the earpiece |
| D21 | Bluetooth is flagged by name (`headset` alone is not enough: "Wired headset", "Headset earpiece", "Headset Microphone" are wired or built in), by a microphone under 32 kHz, and on Android by "Bluetooth headset" in the list while "Default" is in use and nothing wired or USB is plugged in | While the microphone is on, a phone moves Bluetooth headphones to call quality for voice and music alike. Android picks wired, then USB, then Bluetooth by itself |
| D22 | A take stops, and is kept, when the audio clock stops (any device) or, on a phone or tablet, when the microphone is muted (a call, an alarm, Siri). Stopping waits at most 1.5 s for the capture to answer | A frozen clock leaves a silent gap nobody hears until later; a stopped clock cannot answer the stop message |
| D23 | Phones and tablets get Share (one per file, and Share all) after an export; an iPhone or iPad downloads the MP3 as a plain file (`application/octet-stream`, still named .mp3) | Share needs a tap of its own (5 s), so it cannot follow a long encode by itself. iPhones can open some files in a tab instead of saving them |
| D24 | Phones and tablets get their own words: "Saved on this phone", no "computer's sound settings" (they have no input level), "use wired headphones" in the Mic check tip, no "drop the MP3 here" on a phone | |

Left out on purpose: effects, count-in, solo, project files, sharing.

## What the tests cover

`node tools/test.mjs` with the Bash sandbox off (about 90 s). It drives real headless Chrome, AudioWorklet and IndexedDB. Edits are checked to the sample through a WAV the test writes for itself, just before the encoder; the real MP3s are then read back by Chrome and by macOS's `afconvert`.

- A ramp fed straight to the worklet on the same clock: no sample lost, doubled or changed, also after reloading.
- A split alone changes no sample; moves, pastes, mutes, deletes, volumes and mixes are checked sample by sample.
- A 37 ms "room": the timing test reads 37 ms and a take lands 0 samples off the backing.
- Singer on input 2, a page closed mid-take, a real MP3 (encoded with lamejs), and real mouse and key events on the timeline.
- A refused microphone, an unplugged saved microphone, a permission box left waiting, and two requests at once.

`node tools/test-mobile.mjs` (about 60 s, Bash sandbox off, same server): 43 checks with Chrome posing as an iPhone, an iPad in desktop mode, an Android phone and tablet, and a computer: the words, what is asked of the microphone, the iPhone audio session, Bluetooth and call-quality readings, a take ended by a stopped clock and by a muted microphone, Share and the iPhone download, a real 192 kbps MP3 from the phone take. It cannot reach a real phone's audio.

**Phones and tablets, what a page cannot change** (researched 2026-11-07, WebKit and Chromium source): an iPhone or iPad turns off its voice processing (auto volume, noise removal, echo cancellation) when echo cancellation is asked off, from iOS 16.4; older iOS keeps it, and Mic check then says so. While recording, Safari always runs Apple's video-call audio mode, which shapes the tone a little for voice; no page can avoid it. Android Chrome (153+) records through the plain microphone input with Chrome's processing off, but a phone maker's own processing may still apply. Both phones record mono at 48 kHz. A wired or USB microphone is the only real step up from the built-in one.

**Not covered:** a real microphone or real headphones. `getUserMedia` never returns in any Chrome launched from this tooling, even plain `audio:true` with Chrome's fake device, or in the desktop app's pane. The test's microphone is a real MediaStream from an oscillator, and refusals are simulated by making `getUserMedia` reject. Only Chrome has been run; Safari and Firefox code paths are written but untested.

## Traps

- A sine accompaniment correlates with itself every cycle, so a timing test on one reads a false offset. Use noise.
- An MP3 with no gapless header decodes about 25 ms late at 44.1 kHz (a click at 1.000 s landed at 1.0251 s). Stems line up with the MP3 as this browser decoded it; a WAV accompaniment has no such offset.
- A clip shows its speaker icon only when wider than 60 px.
- A background tab slows timers to one a second, so the export pauses with a MessageChannel, not `setTimeout`.
- A clicked button is blurred on purpose: Space would otherwise press Record again as it stopped the take.

## Going live

Live, not linked from the hub, at https://eagleviewmusic.com/vocal-booth/ since 2026-11-07. Folder `vocal-booth/` in tiers 2 and 3, including `vendor/`. Leave `tools/` out. The GoatCounter snippet is already in `index.html` and only counts on eagleviewmusic.com.
