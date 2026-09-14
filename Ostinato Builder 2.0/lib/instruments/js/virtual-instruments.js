/*!
 * Virtual Instruments — shared percussion engine
 * ---------------------------------------------
 * 14 percussion instruments synthesised live with the Web Audio API.
 * No audio files, no samples, no network requests — every voice is built from
 * oscillators and filtered noise, so the whole kit is ~90 KB of JavaScript.
 *
 * Originally extracted from Virtual Drum Kit (index.html), and since revised —
 * this copy is the newer one, so do not re-sync from the drum kit (see
 * AI-INTEGRATION-GUIDE.md § 9 and "Sound revision" in README.md).
 *
 * Usage (browser):
 *   <script src="js/virtual-instruments.js"></script>
 *   const kit = VirtualInstruments.createKit();
 *   document.addEventListener('pointerdown', () => kit.unlock(), { once: true });
 *   kit.play('snare');
 *
 * See README.md and AI-INTEGRATION-GUIDE.md in this folder.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.VirtualInstruments = factory();
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    /* ------------------------------------------------------------------ *
     * Instrument metadata
     * ------------------------------------------------------------------ */

    var INSTRUMENTS = [
        { id: 'bass',       label: 'Bass',       alt: 'Bass Drum',       image: 'images/bass.png',       family: 'drum',       pitched: true,  repeat: false, defaultRepeat: 0, decayMs: 800,  baseFrequency: 60,   options: [] },
        { id: 'snare',      label: 'Snare',      alt: 'Snare Drum',      image: 'images/snare.png',      family: 'drum',       pitched: false, repeat: false, defaultRepeat: 0, decayMs: 600,  baseFrequency: 1800, options: [] },
        { id: 'tom',        label: 'Tom',        alt: 'Tom Drum',        image: 'images/tom.png',        family: 'drum',       pitched: true,  repeat: false, defaultRepeat: 0, decayMs: 600,  baseFrequency: 130,  options: [] },
        { id: 'conga-high', label: 'Conga (H)',  alt: 'High Conga Drum', image: 'images/conga-high.png', family: 'hand-drum',  pitched: true,  repeat: false, defaultRepeat: 0, decayMs: 600,  baseFrequency: 315,  options: [] },
        { id: 'conga-low',  label: 'Conga (L)',  alt: 'Low Conga Drum',  image: 'images/conga-low.png',  family: 'hand-drum',  pitched: true,  repeat: false, defaultRepeat: 0, decayMs: 600,  baseFrequency: 205,  options: [] },
        { id: 'clap',       label: 'Clap',       alt: 'Hand Clap',       image: 'images/clap.png',       family: 'body',       pitched: false, repeat: false, defaultRepeat: 0, decayMs: 600,  baseFrequency: 1150, options: [] },
        { id: 'claves',     label: 'Claves',     alt: 'Claves',          image: 'images/claves.png',     family: 'wood',       pitched: true,  repeat: false, defaultRepeat: 0, decayMs: 600,  baseFrequency: 2500, options: [] },
        { id: 'guiro',      label: 'Guiro',      alt: 'Guiro',           image: 'images/guiro.png',      family: 'scraped',    pitched: false, repeat: false, defaultRepeat: 0, decayMs: 250,  baseFrequency: 1200, options: ['strokeType', 'accentFirst'] },
        { id: 'cowbell',    label: 'Cowbell',    alt: 'Cowbell',         image: 'images/cowbell.png',    family: 'metal',      pitched: true,  repeat: false, defaultRepeat: 0, decayMs: 450,  baseFrequency: 580,  options: ['strikePosition'] },
        { id: 'hihat',      label: 'Hi-Hat',     alt: 'Hi-Hat',          image: 'images/hihat.png',      family: 'cymbal',     pitched: false, repeat: true,  defaultRepeat: 4, decayMs: 600,  baseFrequency: 8500, options: [] },
        { id: 'crash',      label: 'Crash',      alt: 'Crash Cymbal',    image: 'images/crash.png',      family: 'cymbal',     pitched: false, repeat: true,  defaultRepeat: 3, decayMs: 3000, baseFrequency: 5500, options: [] },
        { id: 'tambourine', label: 'Tambourine', alt: 'Tambourine',      image: 'images/tambourine.png', family: 'jingle',     pitched: false, repeat: true,  defaultRepeat: 4, decayMs: 350,  baseFrequency: 6300, options: ['gestureType'] },
        { id: 'shaker',     label: 'Shaker',     alt: 'Shaker',          image: 'images/shaker.png',     family: 'shaken',     pitched: false, repeat: true,  defaultRepeat: 5, decayMs: 600,  baseFrequency: 8500, options: [] },
        { id: 'triangle',   label: 'Triangle',   alt: 'Triangle',        image: 'images/triangle.png',   family: 'metal',      pitched: true,  repeat: false, defaultRepeat: 0, decayMs: 3500, baseFrequency: 4500, options: [] }
    ];

    var INSTRUMENT_MAP = {};
    INSTRUMENTS.forEach(function (inst, idx) {
        inst.index = idx;
        INSTRUMENT_MAP[inst.id] = inst;
    });

    var INSTRUMENT_IDS = INSTRUMENTS.map(function (inst) { return inst.id; });

    /* Note values used by the drum kit's repeat engine, in milliseconds at 120 BPM.
     * defaultRepeat above indexes into this list. Scale by (120 / bpm) for other tempos. */
    var NOTE_INTERVALS_120BPM = [0, 2000, 1000, 500, 250, 125, 62.5];
    var NOTE_LABELS = ['off', 'whole', 'half', 'quarter', 'eighth', 'sixteenth', 'thirtysecond'];

    /* ------------------------------------------------------------------ *
     * Kit factory — one independent engine per call
     * ------------------------------------------------------------------ */

    function createKit(options) {
        options = options || {};

        var audioContext = options.audioContext || null;
        var analyser = null;
        var masterGainNode = null;
        var externalDestination = options.destination || null;
        var initialVolume = (typeof options.volume === 'number') ? options.volume : 1;
        var useSoftClip = options.softClip !== false;
        var softClipNode = null;

        /* Per-kit synthesis state. The crash and shaker voices are stateful:
         * the crash accumulates plate energy across rapid hits, and the shaker
         * alternates accented / unaccented strokes. */
        var noiseBuffer = null;
        var shakerStroke = 0;
        var crashPlateEnergy = 0;
        var lastCrashTime = 0;

        /* Master soft-clip safety stage.
         * Single voices are levelled to stay under full scale, but ten pads can
         * fire at once: an unprotected 10-pad stack peaks at ~5.1. The curve is
         * exactly linear below SOFT_CLIP_KNEE, so ordinary playing passes through
         * untouched, and folds smoothly towards SOFT_CLIP_CEILING above it, so
         * stacks compress instead of hard-clipping. The ceiling sits just under
         * full scale so that even an absurd pile-up stays below 1.0.
         *
         * A WaveShaper only ever maps its input range -1..+1 across the curve,
         * so a pre-gain of 1/SOFT_CLIP_RANGE scales the master bus into that
         * window and the curve is built over +-SOFT_CLIP_RANGE; without it
         * anything above 1.0 would be clamped to the end of the curve, i.e.
         * hard-clipped again. The length is odd on purpose: index (n-1)/2 is
         * exactly x = 0, so silence maps to exactly 0 and the stage adds no DC
         * (see AI-INTEGRATION-GUIDE.md S 9). */
        var SOFT_CLIP_KNEE = 0.7;
        var SOFT_CLIP_CEILING = 0.99;
        var SOFT_CLIP_RANGE = 6;

        function createSoftClipCurve() {
            var n = 2049;
            var curve = new Float32Array(n);
            var knee = SOFT_CLIP_KNEE;
            var fold = SOFT_CLIP_CEILING - knee;
            for (var i = 0; i < n; i++) {
                var x = ((i * 2) / (n - 1) - 1) * SOFT_CLIP_RANGE;
                var a = Math.abs(x);
                var y = (a <= knee) ? a : (knee + fold * Math.tanh((a - knee) / fold));
                curve[i] = (x < 0) ? -y : y;
            }
            return curve;
        }

        function ensureAudio() {
            if (!audioContext) {
                var Ctor = window.AudioContext || window.webkitAudioContext;
                if (!Ctor) return null;
                audioContext = new Ctor();
            }
            if (!analyser) {
                analyser = audioContext.createAnalyser();
                analyser.fftSize = options.fftSize || 64;
                masterGainNode = audioContext.createGain();
                masterGainNode.gain.setValueAtTime(initialVolume, audioContext.currentTime);
                analyser.connect(masterGainNode);
                var tail = masterGainNode;
                if (useSoftClip) {
                    var softClipPreGain = audioContext.createGain();
                    softClipPreGain.gain.setValueAtTime(1 / SOFT_CLIP_RANGE, audioContext.currentTime);
                    softClipNode = audioContext.createWaveShaper();
                    softClipNode.curve = createSoftClipCurve();
                    softClipNode.oversample = 'none';
                    masterGainNode.connect(softClipPreGain);
                    softClipPreGain.connect(softClipNode);
                    tail = softClipNode;
                }
                tail.connect(externalDestination || audioContext.destination);
                getNoiseBuffer();
            }
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            return audioContext;
        }

        function getNoiseBuffer() {
            if (!noiseBuffer && audioContext) {
                var length = audioContext.sampleRate * 2;
                noiseBuffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
                var data = noiseBuffer.getChannelData(0);
                for (var i = 0; i < length; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
            }
            return noiseBuffer;
        }

        function createNoiseSource() {
            var buffer = getNoiseBuffer();
            var source = audioContext.createBufferSource();
            source.buffer = buffer;
            var maxOffset = Math.max(0, buffer.duration - 0.4);
            var startOffset = Math.random() * maxOffset;
            return { source: source, startOffset: startOffset };
        }

        /* ============================================================== *
         * SYNTHESIS — copied verbatim from Virtual Drum Kit.
         * Every voice connects to `analyser`, which feeds the master gain.
         * Do not reformat: these envelopes were tuned by ear.
         * ============================================================== */

        const sounds = {
            'bass': function(opts = {}) {
                if (!audioContext) return;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0;

                // Bass drum body
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, t);
                osc.frequency.exponentialRampToValueAtTime(48, t + 0.045);
                if (is32nd) {
                    gain.gain.setValueAtTime(0.001, t);
                    gain.gain.linearRampToValueAtTime(0.70, t + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
                } else {
                    gain.gain.setValueAtTime(0.85, t);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
                }

                // Beater click transient for attack clarity (75% lower attack for 32nd notes)
                const click = audioContext.createOscillator();
                const clickGain = audioContext.createGain();
                click.type = 'sine';
                click.frequency.setValueAtTime(450, t);
                click.frequency.exponentialRampToValueAtTime(60, t + 0.015);
                clickGain.gain.setValueAtTime(0.35 * attackScale, t);
                clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

                osc.connect(gain);
                gain.connect(analyser);
                click.connect(clickGain);
                clickGain.connect(analyser);

                osc.start(t);
                click.start(t);
                osc.stop(t + (is32nd ? 0.07 : 0.4));
                click.stop(t + 0.02);

                return { frequency: 60, volume: is32nd ? 0.75 : 1.0 };
            },
            'snare': function(opts = {}) {
                if (!audioContext) return;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0;

                // 1. Drum body / shell tone
                const osc = audioContext.createOscillator();
                const oscGain = audioContext.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(220, t);
                osc.frequency.exponentialRampToValueAtTime(125, t + 0.04);
                if (is32nd) {
                    oscGain.gain.setValueAtTime(0.001, t);
                    oscGain.gain.linearRampToValueAtTime(0.45, t + 0.01);
                    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
                } else {
                    oscGain.gain.setValueAtTime(0.65, t);
                    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
                }

                // 2. Snare wire sizzle (highpass + bandpass filtered noise)
                const { source: noise, startOffset } = createNoiseSource();
                const hp = audioContext.createBiquadFilter();
                hp.type = 'highpass';
                hp.frequency.setValueAtTime(900, t);

                const bp = audioContext.createBiquadFilter();
                bp.type = 'bandpass';
                bp.frequency.setValueAtTime(3200, t);
                bp.Q.setValueAtTime(1.6, t);

                const noiseGain = audioContext.createGain();
                if (is32nd) {
                    noiseGain.gain.setValueAtTime(0.001, t);
                    noiseGain.gain.linearRampToValueAtTime(0.60, t + 0.01);
                    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
                } else {
                    noiseGain.gain.setValueAtTime(0.85, t);
                    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
                }

                // 3. Stick attack transient (75% lower attack for 32nd notes)
                const click = audioContext.createOscillator();
                const clickGain = audioContext.createGain();
                click.type = 'triangle';
                click.frequency.setValueAtTime(600, t);
                click.frequency.exponentialRampToValueAtTime(100, t + 0.01);
                clickGain.gain.setValueAtTime(0.3 * attackScale, t);
                clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.01);

                osc.connect(oscGain);
                oscGain.connect(analyser);

                noise.connect(hp);
                hp.connect(bp);
                bp.connect(noiseGain);
                noiseGain.connect(analyser);

                click.connect(clickGain);
                clickGain.connect(analyser);

                osc.start(t);
                noise.start(t, startOffset);
                click.start(t);

                osc.stop(t + (is32nd ? 0.07 : 0.2));
                noise.stop(t + (is32nd ? 0.07 : 0.25));
                click.stop(t + 0.015);

                return { frequency: 1800, volume: is32nd ? 0.75 : 0.9 };
            },
            'tom': function(opts = {}) {
                if (!audioContext) return;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0;

                // Resonant tom shell
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(185, t);
                osc.frequency.exponentialRampToValueAtTime(85, t + 0.07);
                if (is32nd) {
                    gain.gain.setValueAtTime(0.001, t);
                    gain.gain.linearRampToValueAtTime(0.60, t + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
                } else {
                    gain.gain.setValueAtTime(0.8, t);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
                }

                // Stick attack transient (75% lower attack for 32nd notes)
                const click = audioContext.createOscillator();
                const clickGain = audioContext.createGain();
                click.type = 'triangle';
                click.frequency.setValueAtTime(400, t);
                click.frequency.exponentialRampToValueAtTime(80, t + 0.012);
                clickGain.gain.setValueAtTime(0.25 * attackScale, t);
                clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

                osc.connect(gain);
                gain.connect(analyser);
                click.connect(clickGain);
                clickGain.connect(analyser);

                osc.start(t);
                click.start(t);
                osc.stop(t + (is32nd ? 0.07 : 0.35));
                click.stop(t + 0.015);

                return { frequency: 130, volume: is32nd ? 0.75 : 0.9 };
            },
            'conga-high': function(opts = {}) {
                if (!audioContext) return;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0;

                // 1. Dual-mode membrane resonance
                // Fundamental mode: rapid downward pitch bend on skin impact (450Hz -> 315Hz)
                const osc1 = audioContext.createOscillator();
                const gain1 = audioContext.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(450, t);
                osc1.frequency.exponentialRampToValueAtTime(315, t + 0.025);
                if (is32nd) {
                    gain1.gain.setValueAtTime(0.001, t);
                    gain1.gain.linearRampToValueAtTime(0.65, t + 0.01);
                    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
                } else {
                    gain1.gain.setValueAtTime(0.85, t);
                    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
                }

                // Overtone mode (ring of the tight head ~515Hz)
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(680, t);
                osc2.frequency.exponentialRampToValueAtTime(515, t + 0.02);
                if (is32nd) {
                    gain2.gain.setValueAtTime(0.001, t);
                    gain2.gain.linearRampToValueAtTime(0.25, t + 0.01);
                    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
                } else {
                    gain2.gain.setValueAtTime(0.35, t);
                    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
                }

                // 2. Palm/finger slap attack transient (75% lower attack for 32nd notes)
                const { source: noise, startOffset } = createNoiseSource();
                const slapFilter = audioContext.createBiquadFilter();
                slapFilter.type = 'bandpass';
                slapFilter.frequency.setValueAtTime(3400, t);
                slapFilter.Q.setValueAtTime(2.2, t);

                const slapGain = audioContext.createGain();
                slapGain.gain.setValueAtTime(0.5 * attackScale, t);
                slapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.016);

                // 3. Wooden impact pop transient (75% lower attack for 32nd notes)
                const click = audioContext.createOscillator();
                const clickGain = audioContext.createGain();
                click.type = 'sine';
                click.frequency.setValueAtTime(950, t);
                click.frequency.exponentialRampToValueAtTime(120, t + 0.01);
                clickGain.gain.setValueAtTime(0.35 * attackScale, t);
                clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.01);

                // Output trim: the four layers above summed to a peak of 1.38 (max 1.48),
                // i.e. hard clipping on every hit. One bus gain scales the whole voice
                // back under full scale and leaves the balance between layers untouched.
                const out = audioContext.createGain();
                out.gain.setValueAtTime(0.58, t);
                out.connect(analyser);

                // Connect to analyser & output
                osc1.connect(gain1);
                osc2.connect(gain2);
                noise.connect(slapFilter);
                slapFilter.connect(slapGain);
                click.connect(clickGain);

                gain1.connect(out);
                gain2.connect(out);
                slapGain.connect(out);
                clickGain.connect(out);

                osc1.start(t);
                osc2.start(t);
                noise.start(t, startOffset);
                click.start(t);

                osc1.stop(t + (is32nd ? 0.07 : 0.3));
                osc2.stop(t + (is32nd ? 0.065 : 0.16));
                noise.stop(t + 0.02);
                click.stop(t + 0.012);

                return { frequency: 315, volume: is32nd ? 0.75 : 0.85 };
            },
            'conga-low': function(opts = {}) {
                if (!audioContext) return;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0;

                // 1. Deep barrel membrane resonance
                // Fundamental pitch bend on strike (310Hz -> 205Hz)
                const osc1 = audioContext.createOscillator();
                const gain1 = audioContext.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(310, t);
                osc1.frequency.exponentialRampToValueAtTime(205, t + 0.03);
                if (is32nd) {
                    gain1.gain.setValueAtTime(0.001, t);
                    gain1.gain.linearRampToValueAtTime(0.70, t + 0.01);
                    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
                } else {
                    gain1.gain.setValueAtTime(0.9, t);
                    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
                }

                // Overtone shell cavity resonance (~330Hz)
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(460, t);
                osc2.frequency.exponentialRampToValueAtTime(330, t + 0.025);
                if (is32nd) {
                    gain2.gain.setValueAtTime(0.001, t);
                    gain2.gain.linearRampToValueAtTime(0.28, t + 0.01);
                    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
                } else {
                    gain2.gain.setValueAtTime(0.38, t);
                    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.20);
                }

                // 2. Palm slap attack transient (75% lower attack for 32nd notes)
                const { source: noise, startOffset } = createNoiseSource();
                const slapFilter = audioContext.createBiquadFilter();
                slapFilter.type = 'bandpass';
                slapFilter.frequency.setValueAtTime(2400, t);
                slapFilter.Q.setValueAtTime(1.8, t);

                const slapGain = audioContext.createGain();
                slapGain.gain.setValueAtTime(0.45 * attackScale, t);
                slapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

                // 3. Wooden impact thud transient (75% lower attack for 32nd notes)
                const click = audioContext.createOscillator();
                const clickGain = audioContext.createGain();
                click.type = 'sine';
                click.frequency.setValueAtTime(650, t);
                click.frequency.exponentialRampToValueAtTime(90, t + 0.014);
                clickGain.gain.setValueAtTime(0.35 * attackScale, t);
                clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.014);

                // Output trim: the four layers above summed to a peak of 1.44 (max 1.48),
                // i.e. hard clipping on every hit. One bus gain scales the whole voice
                // back under full scale and leaves the balance between layers untouched.
                const out = audioContext.createGain();
                out.gain.setValueAtTime(0.58, t);
                out.connect(analyser);

                // Connect to analyser & output
                osc1.connect(gain1);
                osc2.connect(gain2);
                noise.connect(slapFilter);
                slapFilter.connect(slapGain);
                click.connect(clickGain);

                gain1.connect(out);
                gain2.connect(out);
                slapGain.connect(out);
                clickGain.connect(out);

                osc1.start(t);
                osc2.start(t);
                noise.start(t, startOffset);
                click.start(t);

                osc1.stop(t + (is32nd ? 0.07 : 0.4));
                osc2.stop(t + (is32nd ? 0.065 : 0.22));
                noise.stop(t + 0.025);
                click.stop(t + 0.016);

                return { frequency: 205, volume: is32nd ? 0.75 : 0.9 };
            },
            'clap': function(opts = {}) {
                if (!audioContext) return;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.10 : 1.0; // 90% attack reduction for 32nd repeating sound

                const { source: noise, startOffset } = createNoiseSource();

                // Dual filtering for warm body + snappy slap
                const hp = audioContext.createBiquadFilter();
                hp.type = 'highpass';
                hp.frequency.setValueAtTime(600, t);

                const bp = audioContext.createBiquadFilter();
                bp.type = 'bandpass';
                bp.frequency.setValueAtTime(1150, t);
                bp.Q.setValueAtTime(1.8, t);

                const envelope = audioContext.createGain();
                if (is32nd) {
                    // Smooth stream of sound: eliminate individual pre-slap bursts,
                    // ramp in gently to 90% reduced attack level (0.095), decaying across repeat step
                    envelope.gain.setValueAtTime(0.001, t);
                    envelope.gain.linearRampToValueAtTime(0.95 * attackScale, t + 0.015);
                    envelope.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
                } else {
                    // 3 rapid micro-bursts (pre-slaps of fingers/palms) followed by main strike and diffuse tail
                    // Burst 1 (0 to 11ms)
                    envelope.gain.setValueAtTime(0.75, t);
                    envelope.gain.exponentialRampToValueAtTime(0.01, t + 0.011);

                    // Burst 2 (12 to 23ms)
                    envelope.gain.setValueAtTime(0.8, t + 0.012);
                    envelope.gain.exponentialRampToValueAtTime(0.01, t + 0.023);

                    // Burst 3 (24 to 35ms)
                    envelope.gain.setValueAtTime(0.85, t + 0.024);
                    envelope.gain.exponentialRampToValueAtTime(0.01, t + 0.035);

                    // Main strike & diffuse room tail (36ms to 280ms)
                    envelope.gain.setValueAtTime(0.95, t + 0.036);
                    envelope.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
                }

                noise.connect(hp);
                hp.connect(bp);
                bp.connect(envelope);
                envelope.connect(analyser);

                noise.start(t, startOffset);
                noise.stop(t + (is32nd ? 0.07 : 0.3));

                return { frequency: 1150, volume: is32nd ? 0.35 : 0.85 };
            },
            'claves': function(opts = {}) {
                if (!audioContext) return;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0; // 75% lower attack for 32nd notes

                // Primary wood resonance (fundamental mode ~2500Hz)
                const osc1 = audioContext.createOscillator();
                const gain1 = audioContext.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(2500, t);
                if (is32nd) {
                    gain1.gain.setValueAtTime(0.001, t);
                    gain1.gain.linearRampToValueAtTime(0.35, t + 0.008);
                    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
                } else {
                    gain1.gain.setValueAtTime(0.7, t);
                    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
                }

                // Secondary inharmonic overtone mode of hardwood (~3350Hz)
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(3350, t);
                if (is32nd) {
                    gain2.gain.setValueAtTime(0.001, t);
                    gain2.gain.linearRampToValueAtTime(0.15, t + 0.006);
                    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
                } else {
                    gain2.gain.setValueAtTime(0.3, t);
                    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
                }

                // Wood impact click transient (reduced by 75% for 32nd notes)
                const { source: noise, startOffset } = createNoiseSource();
                const clickFilter = audioContext.createBiquadFilter();
                clickFilter.type = 'bandpass';
                clickFilter.frequency.setValueAtTime(2900, t);
                clickFilter.Q.setValueAtTime(2.5, t);
                const clickGain = audioContext.createGain();
                clickGain.gain.setValueAtTime(0.35 * attackScale, t);
                clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.005);

                osc1.connect(gain1);
                osc2.connect(gain2);
                noise.connect(clickFilter);
                clickFilter.connect(clickGain);

                gain1.connect(analyser);
                gain2.connect(analyser);
                clickGain.connect(analyser);

                osc1.start(t);
                osc2.start(t);
                noise.start(t, startOffset);

                osc1.stop(t + (is32nd ? 0.065 : 0.05));
                osc2.stop(t + (is32nd ? 0.045 : 0.03));
                noise.stop(t + 0.01);

                return { frequency: 2500, volume: is32nd ? 0.65 : 0.8 };
            },
            'guiro': function(opts = {}) {
                if (!audioContext) return null;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0; // 75% lower attack for 32nd notes
                const strokeType = opts.strokeType || 'short';
                const accentFirst = is32nd ? false : (opts.accentFirst || false);

                const sr = audioContext.sampleRate || 44100;
                let duration = 0.22;
                let startRate = 60;
                let endRate = 150;
                let baseGain = 0.85;

                if (is32nd) {
                    duration = 0.06;
                    startRate = 180;
                    endRate = 260;
                    baseGain = 0.70;
                } else if (strokeType === 'long') {
                    duration = 0.46;
                    startRate = 48;
                    endRate = 142;
                    baseGain = 0.90;
                } else if (strokeType === 'flick') {
                    duration = 0.11;
                    startRate = 160;
                    endRate = 240;
                    baseGain = 0.80;
                } else if (strokeType === 'part2') {
                    duration = 0.25;
                    startRate = 100;
                    endRate = 152;
                    baseGain = 0.92;
                }

                const totalSamples = Math.floor(sr * (duration + 0.04));
                const numStrokeSamples = Math.floor(sr * duration);
                const rawImpulses = new Float32Array(totalSamples);

                let phase = 0;
                let clickTimes = [];
                let prevClick = 0;

                for (let s = 0; s < numStrokeSamples; s++) {
                    const normT = s / numStrokeSamples;
                    const currentRate = startRate + (endRate - startRate) * Math.pow(normT, 1.4);
                    phase += currentRate / sr;

                    if (phase >= 1.0) {
                        phase -= 1.0;
                        const jitter = (Math.random() * 0.12 - 0.06) * (1 / currentRate);
                        const clickT = Math.max(prevClick + 0.003, (s / sr) + jitter);
                        prevClick = clickT;
                        clickTimes.push({ time: clickT, normPos: normT, rate: currentRate });
                    }
                }

                // Micro-click generation (Dirac impulse + decaying wooden grain + friction grit)
                for (let i = 0; i < clickTimes.length; i++) {
                    const { time, normPos } = clickTimes[i];
                    const startS = Math.floor(time * sr);
                    if (startS >= totalSamples) continue;

                    const isFirst = (i === 0);
                    let clickAmp = 0.35 + 0.65 * Math.pow(normPos, 1.5);
                    if (isFirst && accentFirst) {
                        clickAmp = 1.18;
                    } else if (isFirst) {
                        clickAmp = is32nd ? (0.70 * attackScale) : 0.70;
                    }
                    if (is32nd) {
                        clickAmp *= attackScale; // Soften clicks by 75% for continuous streaming roll
                    }

                    const grainSamples = Math.floor(0.0045 * sr);
                    for (let gs = 0; gs < grainSamples && (startS + gs) < totalSamples; gs++) {
                        const decay = Math.exp(-gs / (sr * 0.0011));
                        const spike = (gs === 0) ? 1.0 : (gs === 1 ? -0.65 : (gs === 2 ? 0.3 : 0));
                        const grit = (Math.random() * 2 - 1) * 0.35;
                        rawImpulses[startS + gs] += (spike + grit) * decay * clickAmp;
                    }
                }

                function createBP(freq, q) {
                    const w0 = 2 * Math.PI * freq / sr;
                    const alpha = Math.sin(w0) / (2 * q);
                    const b0 = alpha, b1 = 0, b2 = -alpha;
                    const a0 = 1 + alpha, a1 = -2 * Math.cos(w0), a2 = 1 - alpha;
                    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
                    return function(x) {
                        const y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
                        x2 = x1; x1 = x;
                        y2 = y1; y1 = y;
                        return y;
                    };
                }

                // Coupled Bandpass Resonator Bank (Cavity 620Hz/850Hz, Shell 2400Hz, Bite 5800Hz)
                const bpCavity1 = createBP(620, 5.5);
                const bpCavity2 = createBP(850, 4.5);
                const bpShell = createBP(2400, 3.8);
                const bpBite = createBP(5800, 2.2);

                const buffer = audioContext.createBuffer(1, totalSamples, sr);
                const outData = buffer.getChannelData(0);
                let maxAmp = 0;

                for (let s = 0; s < totalSamples; s++) {
                    const x = rawImpulses[s];
                    const normT = Math.min(1.0, s / numStrokeSamples);

                    const shellGain = 0.28 + 0.20 * Math.pow(normT, 1.3);
                    const cavityGain1 = 0.40;
                    const cavityGain2 = 0.25;
                    const biteGain = 0.12 + 0.08 * normT;

                    const yCav1 = bpCavity1(x);
                    const yCav2 = bpCavity2(x);
                    const yShell = bpShell(x);
                    const yBite = bpBite(x);

                    let y = (yCav1 * cavityGain1) + (yCav2 * cavityGain2) + (yShell * shellGain) + (yBite * biteGain);

                    if (s >= numStrokeSamples) {
                        const pullOff = Math.exp(-(s - numStrokeSamples) / (sr * 0.007));
                        y *= pullOff;
                    }

                    outData[s] = y;
                    if (Math.abs(y) > maxAmp) maxAmp = Math.abs(y);
                }

                const targetPeak = baseGain;
                const gainFactor = maxAmp > 0 ? (targetPeak / maxAmp) : 1.0;
                for (let s = 0; s < totalSamples; s++) {
                    outData[s] = Math.max(-1, Math.min(1, outData[s] * gainFactor));
                }

                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(analyser);
                source.start(t);

                return { frequency: 1200, volume: 0.85 };
            },
            'cowbell': function(opts = {}) {
                if (!audioContext) return null;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0; // 75% lower attack for 32nd notes

                // Strike Position: 0.0 (Mouth, open edge) to 1.0 (Shoulder / Ridge, near closed end)
                // Default: 0.2 (balanced, natural salsa/rock bell)
                const strikePosition = (typeof opts.strikePosition === 'number') 
                    ? Math.max(0, Math.min(1, opts.strikePosition)) 
                    : 0.20;

                // Mode Amplitudes & Decay crossfade based on strike position:
                // Mouth: f1 (580Hz) strongly dominates, longer decay (~320-380ms)
                // Shoulder: f2 (910Hz) dominates, sharp wooden click, dry choked decay (~120-160ms)
                const f1Amp = (1.0 - (strikePosition * 0.65)) * 0.45;
                const f2Amp = (0.35 + (strikePosition * 0.65)) * 0.45;
                const baseDecay = (0.36 - (strikePosition * 0.18));
                const mode1Decay = is32nd ? 0.06 : baseDecay;
                const mode2Decay = is32nd ? 0.055 : (baseDecay * 0.85);

                // Pitch Modulation Envelope (Micro-Drop: +20 cents drop over 20ms)
                const pitchDropRatio = 1.0116;

                // Master bell bus with asymmetric soft-clipper / diode shaper for metallic shell grit
                const bellBus = audioContext.createGain();
                bellBus.gain.setValueAtTime(is32nd ? 0.65 : 0.85, t);

                // Asymmetric soft saturation curve
                // Odd length: index 128 is exactly x = 0, so silence maps to 0. With an
                // even 256 the centre fell between curve[127] and curve[128] and silence
                // interpolated to -0.0123 of constant DC, for ever, on every hit.
                const shaper = audioContext.createWaveShaper();
                const nCurve = 257;
                const curve = new Float32Array(nCurve);
                const k = 2.2;
                for (let i = 0; i < nCurve; ++i) {
                    const x = (i * 2) / (nCurve - 1) - 1;
                    curve[i] = (1 + k) * x / (1 + k * Math.abs(x));
                }
                shaper.curve = curve;
                shaper.oversample = '2x';

                // High-shelf damping filter: rapidly attenuates high frequencies after 30-35ms
                const highShelf = audioContext.createBiquadFilter();
                highShelf.type = 'highshelf';
                highShelf.frequency.setValueAtTime(3200, t);
                highShelf.gain.setValueAtTime(0, t);
                highShelf.gain.linearRampToValueAtTime(-12, t + 0.035);

                bellBus.connect(shaper);
                shaper.connect(highShelf);
                highShelf.connect(analyser);

                // 1. Wood Attack Impulse
                // Low-mid knock (~450Hz, Q: 2, decay: 12ms)
                const { source: knockNoise, startOffset: knockOffset } = createNoiseSource();
                const knockFilter = audioContext.createBiquadFilter();
                knockFilter.type = 'bandpass';
                knockFilter.frequency.setValueAtTime(450, t);
                knockFilter.Q.setValueAtTime(2.0, t);

                const knockGain = audioContext.createGain();
                const knockPeak = (0.42 * attackScale);
                knockGain.gain.setValueAtTime(knockPeak, t);
                knockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

                knockNoise.connect(knockFilter);
                knockFilter.connect(knockGain);
                knockGain.connect(bellBus);
                knockNoise.start(t, knockOffset);
                knockNoise.stop(t + 0.015);

                // Stick click transient (Highpass ~3.5kHz, decay: 8ms)
                const { source: clickNoise, startOffset: clickOffset } = createNoiseSource();
                const clickFilter = audioContext.createBiquadFilter();
                clickFilter.type = 'highpass';
                clickFilter.frequency.setValueAtTime(3500, t);

                const clickGain = audioContext.createGain();
                const clickPeak = ((0.30 + (strikePosition * 0.15)) * attackScale);
                clickGain.gain.setValueAtTime(clickPeak, t);
                clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.008);

                clickNoise.connect(clickFilter);
                clickFilter.connect(clickGain);
                clickGain.connect(bellBus);
                clickNoise.start(t, clickOffset);
                clickNoise.stop(t + 0.012);

                // 2. Primary Dual-Mode Plate Resonators
                // Resonator 1: 580 Hz (Bandpass Q: 40)
                const osc1 = audioContext.createOscillator();
                osc1.type = 'square';
                osc1.frequency.setValueAtTime(580 * pitchDropRatio, t);
                osc1.frequency.exponentialRampToValueAtTime(580, t + 0.020);

                const bp1 = audioContext.createBiquadFilter();
                bp1.type = 'bandpass';
                bp1.frequency.setValueAtTime(580, t);
                bp1.Q.setValueAtTime(40, t);

                const gain1 = audioContext.createGain();
                if (is32nd) {
                    gain1.gain.setValueAtTime(0.001, t);
                    gain1.gain.linearRampToValueAtTime(f1Amp * 0.7, t + 0.008);
                    gain1.gain.exponentialRampToValueAtTime(0.001, t + mode1Decay);
                } else {
                    gain1.gain.setValueAtTime(f1Amp, t);
                    gain1.gain.exponentialRampToValueAtTime(0.001, t + mode1Decay);
                }

                osc1.connect(bp1);
                bp1.connect(gain1);
                gain1.connect(bellBus);
                osc1.start(t);
                osc1.stop(t + mode1Decay + 0.02);

                // Resonator 2: 910 Hz (Bandpass Q: 35)
                const osc2 = audioContext.createOscillator();
                osc2.type = 'square';
                osc2.frequency.setValueAtTime(910 * pitchDropRatio, t);
                osc2.frequency.exponentialRampToValueAtTime(910, t + 0.020);

                const bp2 = audioContext.createBiquadFilter();
                bp2.type = 'bandpass';
                bp2.frequency.setValueAtTime(910, t);
                bp2.Q.setValueAtTime(35, t);

                const gain2 = audioContext.createGain();
                if (is32nd) {
                    gain2.gain.setValueAtTime(0.001, t);
                    gain2.gain.linearRampToValueAtTime(f2Amp * 0.7, t + 0.008);
                    gain2.gain.exponentialRampToValueAtTime(0.001, t + mode2Decay);
                } else {
                    gain2.gain.setValueAtTime(f2Amp, t);
                    gain2.gain.exponentialRampToValueAtTime(0.001, t + mode2Decay);
                }

                osc2.connect(bp2);
                bp2.connect(gain2);
                gain2.connect(bellBus);
                osc2.start(t);
                osc2.stop(t + mode2Decay + 0.02);

                // Upper Inharmonic Sheen Mode (2600 Hz, Q: 15, Decay: ~60ms)
                const osc3 = audioContext.createOscillator();
                osc3.type = 'triangle';
                osc3.frequency.setValueAtTime(2600, t);

                const bp3 = audioContext.createBiquadFilter();
                bp3.type = 'bandpass';
                bp3.frequency.setValueAtTime(2600, t);
                bp3.Q.setValueAtTime(15, t);

                const gain3 = audioContext.createGain();
                const mode3Decay = is32nd ? 0.04 : 0.06;
                gain3.gain.setValueAtTime(0.18 * attackScale, t);
                gain3.gain.exponentialRampToValueAtTime(0.001, t + mode3Decay);

                osc3.connect(bp3);
                bp3.connect(gain3);
                gain3.connect(bellBus);
                osc3.start(t);
                osc3.stop(t + mode3Decay + 0.01);

                return { frequency: 580, volume: is32nd ? 0.70 : 0.85 };
            },
            'hihat': function(opts = {}) {
                if (!audioContext) return;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.10 : 1.0; // 90% attack reduction for cymbal at 32nd repeating sound

                const { source: noise, startOffset } = createNoiseSource();
                const hp = audioContext.createBiquadFilter();
                hp.type = 'highpass';
                hp.frequency.setValueAtTime(7500, t);

                const bp = audioContext.createBiquadFilter();
                bp.type = 'bandpass';
                bp.frequency.setValueAtTime(10000, t);
                bp.Q.setValueAtTime(1.5, t);

                const gain = audioContext.createGain();
                if (is32nd) {
                    // Soften attack transient by 90%: gentle 15ms ramp-in to 0.065 to create silky sizzle wash/stream
                    gain.gain.setValueAtTime(0.001, t);
                    gain.gain.linearRampToValueAtTime(0.65 * attackScale, t + 0.015);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
                } else {
                    gain.gain.setValueAtTime(0.65, t);
                    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
                }

                noise.connect(hp);
                hp.connect(bp);
                bp.connect(gain);
                gain.connect(analyser);

                noise.start(t, startOffset);
                noise.stop(t + (is32nd ? 0.065 : 0.06));

                return { frequency: 8500, volume: is32nd ? 0.35 : 0.65 };
            },
            'crash': function() {
                if (!audioContext) return null;
                const opts = arguments[0] || {};
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));

                // 1. Global Plate Energy Accumulator (Leaky Integrator)
                const dt = lastCrashTime > 0 ? (t - lastCrashTime) : 10;
                // Energy leaks exponentially with ~1.2s half-life
                crashPlateEnergy = crashPlateEnergy * Math.exp(-dt / 1.2);
                const existingEnergy = crashPlateEnergy;
                // Add new strike energy (saturating at 1.0)
                crashPlateEnergy = Math.min(1.0, crashPlateEnergy + 0.55);
                lastCrashTime = t;

                // Attack reduction based on repetition pace (dt or is32nd)
                // - 32nd note pace (~62.5ms) or is32nd: reduce attack by 90% (scale = 0.10) -> textured wave/stream
                // - 16th note pace (~125ms): reduce attack by 80% (scale = 0.20) -> soft pulse to larger reverberance
                // - 8th note pace (~250ms): reduce attack by 50% (scale = 0.50)
                // - Quarter note pace (~500ms) or isolated strike: full attack (scale = 1.00)
                let attackScale = 1.0;
                if (is32nd || dt <= 0.075) {
                    attackScale = 0.10; // 90% reduction for 32nd notes
                } else if (dt <= 0.135) {
                    attackScale = 0.20; // 80% reduction for 16th notes
                } else if (dt <= 0.26) {
                    // Smoothly transition between 16th note (0.20) and 8th note (0.50)
                    const r = (dt - 0.125) / (0.25 - 0.125);
                    attackScale = 0.20 + Math.max(0, Math.min(1, r)) * 0.30;
                } else if (dt < 0.48) {
                    // Smoothly transition between 8th note (0.50) and quarter note (1.00)
                    const r = (dt - 0.25) / (0.50 - 0.25);
                    attackScale = 0.50 + Math.max(0, Math.min(1, r)) * 0.50;
                } else {
                    attackScale = 1.0; // Quarter note or isolated hit
                }

                const clackGain = 0.40 * attackScale;
                const bloomDuration = is32nd ? 0.012 : (0.032 * Math.max(0.32, 1.0 - 0.65 * existingEnergy)); // 32ms quiescent -> 10ms rolling
                const turbulenceGain = 0.60 * (1.0 + 0.35 * existingEnergy);

                const duration = 3.2;

                // Master Crash Bus with Soft-Clipper
                const crashBus = audioContext.createGain();
                crashBus.gain.setValueAtTime(0.85, t);

                // Nonlinear Wave-Shaper / Soft-Clipper to prevent linear summing and simulate plate saturation
                // Odd length, so the centre of the curve is exactly x = 0 and silence maps
                // to 0 rather than to an interpolated constant (the cowbell's DC bug).
                const waveShaper = audioContext.createWaveShaper();
                const nCurve = 257;
                const curve = new Float32Array(nCurve);
                for (let i = 0; i < nCurve; i++) {
                    const x = (i / (nCurve - 1)) * 2 - 1;
                    curve[i] = x - 0.16 * Math.pow(x, 3); // Cubic soft saturation
                }
                waveShaper.curve = curve;
                waveShaper.oversample = '2x';

                // Air Damping EQ: Highs decay faster than lows
                const airDamping = audioContext.createBiquadFilter();
                airDamping.type = 'highshelf';
                airDamping.frequency.setValueAtTime(4500, t);
                airDamping.gain.setValueAtTime(0, t);
                airDamping.gain.linearRampToValueAtTime(0, t + 0.1);
                airDamping.gain.exponentialRampToValueAtTime(-18, t + duration);

                crashBus.connect(waveShaper);
                waveShaper.connect(airDamping);
                airDamping.connect(analyser);

                // 2. Impact Clack (0-8ms, wood-on-bronze strike shockwave)
                const { source: clackNoise, startOffset: clackOffset } = createNoiseSource();
                const hpClack = audioContext.createBiquadFilter();
                hpClack.type = 'highpass';
                hpClack.frequency.setValueAtTime(7500, t);
                hpClack.Q.setValueAtTime(1.2, t);

                const gainClack = audioContext.createGain();
                gainClack.gain.setValueAtTime(clackGain, t);
                gainClack.gain.exponentialRampToValueAtTime(0.001, t + 0.009);

                clackNoise.connect(hpClack);
                hpClack.connect(gainClack);
                gainClack.connect(crashBus);

                clackNoise.start(t, clackOffset);
                clackNoise.stop(t + 0.012);

                // 3. Low/Mid Body ("Dish & Bell") - Inharmonic Bessel modes (380Hz to 1250Hz)
                // Subdued bronze plate undertones that outlast the highs without ringing like loud bells
                const bodyModes = [
                    { freq: 415, decay: 2.2, amp: 0.16 },
                    { freq: 580, decay: 2.0, amp: 0.19 },
                    { freq: 760, decay: 1.8, amp: 0.18 },
                    { freq: 990, decay: 1.6, amp: 0.15 },
                    { freq: 1240, decay: 1.3, amp: 0.12 }
                ];

                // Fast flexural plate wobble/flutter (14.0 Hz rapid shimmer, tension fluctuation +-8 Hz)
                const wobbleOsc = audioContext.createOscillator();
                wobbleOsc.frequency.setValueAtTime(14.0, t);
                const wobbleGain = audioContext.createGain();
                wobbleGain.gain.setValueAtTime(8, t); // +-8 Hz rapid flutter
                wobbleOsc.connect(wobbleGain);
                wobbleOsc.start(t);
                wobbleOsc.stop(t + duration);

                bodyModes.forEach(m => {
                    const osc = audioContext.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(m.freq, t);
                    wobbleGain.connect(osc.frequency);

                    const gain = audioContext.createGain();
                    gain.gain.setValueAtTime(0.001, t);
                    // Bell modes balanced halfway (0.031) for clear plate warmth without loud ringing
                    gain.gain.linearRampToValueAtTime(m.amp * 0.031, t + 0.006);
                    gain.gain.exponentialRampToValueAtTime(0.0005, t + m.decay);

                    osc.connect(gain);
                    gain.connect(crashBus);

                    osc.start(t);
                    osc.stop(t + m.decay + 0.05);
                });

                // 4. Dense Mid-High Resonance ("The Wash") (2.0kHz to 5.5kHz)
                const washModes = [
                    { freq: 2150, decay: 2.2, amp: 0.17 },
                    { freq: 2780, decay: 2.0, amp: 0.18 },
                    { freq: 3450, decay: 1.8, amp: 0.20 },
                    { freq: 4200, decay: 1.6, amp: 0.18 },
                    { freq: 4950, decay: 1.4, amp: 0.16 },
                    { freq: 5650, decay: 1.2, amp: 0.14 }
                ];

                washModes.forEach(m => {
                    const osc = audioContext.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(m.freq, t);
                    wobbleGain.connect(osc.frequency);

                    const gain = audioContext.createGain();
                    // Wash modes balanced halfway (0.078) for musical metallic pitch presence
                    gain.gain.setValueAtTime(0.001, t);
                    gain.gain.linearRampToValueAtTime(m.amp * 0.078, t + 0.016);
                    gain.gain.exponentialRampToValueAtTime(0.0005, t + m.decay);

                    osc.connect(gain);
                    gain.connect(crashBus);

                    osc.start(t);
                    osc.stop(t + m.decay + 0.05);
                });

                // 5. Strong White Noise Body & Sizzle Bed (3.6kHz to 16kHz)
                // Signature Nonlinear Bloom with full mid-range white noise body
                const { source: turbNoise, startOffset: turbOffset } = createNoiseSource();
                const hpTurb = audioContext.createBiquadFilter();
                hpTurb.type = 'highpass';
                hpTurb.frequency.setValueAtTime(3600, t);
                hpTurb.Q.setValueAtTime(0.9, t);

                const bpTurb = audioContext.createBiquadFilter();
                bpTurb.type = 'bandpass';
                bpTurb.frequency.setValueAtTime(9200, t);
                bpTurb.Q.setValueAtTime(1.1, t);

                const gainTurb = audioContext.createGain();
                gainTurb.gain.setValueAtTime(0.001, t);
                gainTurb.gain.linearRampToValueAtTime(turbulenceGain * 0.58, t + bloomDuration);
                gainTurb.gain.exponentialRampToValueAtTime(0.001, t + bloomDuration + 2.4);

                turbNoise.connect(hpTurb);
                turbNoise.connect(bpTurb);
                hpTurb.connect(gainTurb);
                bpTurb.connect(gainTurb);
                gainTurb.connect(crashBus);

                turbNoise.start(t, turbOffset);
                turbNoise.stop(t + bloomDuration + 2.5);

                return { frequency: 5500, volume: 0.85 };
            },
            'tambourine': function(opts = {}) {
                if (!audioContext) return null;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0; // 75% lower attack for 32nd notes

                // Gesture: 'hit' (manual strike with frame thump) vs 'shake' (repeats/rolls with ramped jingles, no frame thud)
                const gestureType = opts.gestureType || (is32nd ? 'shake' : 'hit');
                const isShake = gestureType === 'shake';

                // Output trim: the jingle bus below summed to a peak of 1.28 (max 1.50),
                // i.e. hard clipping on every hit. Both gestures are scaled by the same
                // factor, so the hit / shake balance is unchanged.
                const tambTrim = 0.55;

                const tambBus = audioContext.createGain();
                tambBus.gain.setValueAtTime((is32nd ? 0.70 : 0.95) * tambTrim, t);
                tambBus.connect(analyser);

                // 1. Frame Body Generator (Only active on "hit" gesture - very subtle, light organic wood tap)
                if (!isShake) {
                    // Low-mid thud (Sine pitch drop: 320 Hz -> 180 Hz, decay 22ms)
                    const frameOsc = audioContext.createOscillator();
                    frameOsc.type = 'sine';
                    frameOsc.frequency.setValueAtTime(320, t);
                    frameOsc.frequency.exponentialRampToValueAtTime(180, t + 0.022);

                    const frameGain = audioContext.createGain();
                    frameGain.gain.setValueAtTime(0.05 * attackScale, t);
                    frameGain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

                    frameOsc.connect(frameGain);
                    frameGain.connect(tambBus);
                    frameOsc.start(t);
                    frameOsc.stop(t + 0.025);

                    // Frame clack (Bandpass 900 Hz, Q: 3, decay: 15ms)
                    const { source: clackNoise, startOffset: clackOffset } = createNoiseSource();
                    const clackFilter = audioContext.createBiquadFilter();
                    clackFilter.type = 'bandpass';
                    clackFilter.frequency.setValueAtTime(900, t);
                    clackFilter.Q.setValueAtTime(3.0, t);

                    const clackGain = audioContext.createGain();
                    clackGain.gain.setValueAtTime(0.035 * attackScale, t);
                    clackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

                    clackNoise.connect(clackFilter);
                    clackFilter.connect(clackGain);
                    clackGain.connect(tambBus);
                    clackNoise.start(t, clackOffset);
                    clackNoise.stop(t + 0.018);
                }

                // 2. Stochastic Collision Cascade of Jingles (Prominent, bright, loud shimmering cymbals)
                // High-Q Jingle Resonator Bank (Parallel Bandpass Filters)
                // Mode 1: 4.6 kHz (Q: 25, decay: 90ms)
                // Mode 2: 6.3 kHz (Q: 30, decay: 110ms)
                // Mode 3: 8.2 kHz (Q: 20, decay: 80ms)
                // Mode 4: 11.5 kHz (Q: 12, decay: 50ms)
                const jingleModes = [
                    { freq: 4600, q: 25, decay: 0.090, gain: 0.65 },
                    { freq: 6300, q: 30, decay: 0.110, gain: 0.80 },
                    { freq: 8200, q: 20, decay: 0.080, gain: 0.65 },
                    { freq: 11500, q: 12, decay: 0.050, gain: 0.55 }
                ];

                const jingleBus = audioContext.createGain();
                jingleBus.gain.setValueAtTime(3.8, t);
                jingleBus.connect(tambBus);

                // High-Frequency Air / Sizzle Path (> 8.5kHz with subtle saturation)
                const airFilter = audioContext.createBiquadFilter();
                airFilter.type = 'highpass';
                airFilter.frequency.setValueAtTime(9000, t);
                const airGain = audioContext.createGain();
                airGain.gain.setValueAtTime(0.75 * attackScale, t);
                airFilter.connect(airGain);
                airGain.connect(tambBus);

                // Build parallel resonators
                jingleModes.forEach(m => {
                    const bp = audioContext.createBiquadFilter();
                    bp.type = 'bandpass';
                    bp.frequency.setValueAtTime(m.freq, t);
                    bp.Q.setValueAtTime(m.q, t);

                    const g = audioContext.createGain();
                    g.gain.setValueAtTime(m.gain, t);

                    bp.connect(g);
                    g.connect(jingleBus);
                    m.node = bp;
                });

                // Generate stochastic collision impulse buffer
                const sr = audioContext.sampleRate || 44100;
                const bufferDuration = is32nd ? 0.065 : (isShake ? 0.14 : 0.22);
                const numSamples = Math.floor(sr * bufferDuration);
                const impulseBuffer = audioContext.createBuffer(1, numSamples, sr);
                const channelData = impulseBuffer.getChannelData(0);

                // Generate 12-16 micro-rebound impulses
                const numImpulses = is32nd ? 8 : 16;
                const impulseTimes = [];

                if (isShake) {
                    // Soft ramped attack: jingles slide together then chatter
                    for (let i = 0; i < numImpulses; i++) {
                        const prog = (i + 1) / numImpulses;
                        const timeMs = (Math.pow(prog, 1.4) * (bufferDuration * 1000 * 0.85)) + (Math.random() * 4);
                        impulseTimes.push({ timeMs, amp: Math.sin(prog * Math.PI) * (0.6 + Math.random() * 0.4) });
                    }
                } else {
                    // Hit: dense burst at onset (0-8ms) followed by decaying rebounds
                    impulseTimes.push({ timeMs: 0, amp: 1.0 * attackScale });
                    impulseTimes.push({ timeMs: 2.2, amp: 0.85 * attackScale });
                    impulseTimes.push({ timeMs: 4.8, amp: 0.75 * attackScale });
                    impulseTimes.push({ timeMs: 7.5, amp: 0.65 * attackScale });

                    let currentTime = 11;
                    for (let i = 4; i < numImpulses; i++) {
                        currentTime += 4.5 + (Math.random() * 8.5); // 4.5 to 13ms apart
                        if (currentTime >= bufferDuration * 1000) break;
                        const decayAmp = Math.exp(-currentTime / 48) * (0.5 + Math.random() * 0.5) * attackScale;
                        impulseTimes.push({ timeMs: currentTime, amp: decayAmp });
                    }
                }

                // Render micro-grains of shaped white noise into channelData
                impulseTimes.forEach(imp => {
                    const startSample = Math.floor((imp.timeMs / 1000) * sr);
                    const grainDuration = 0.0025 + (Math.random() * 0.0015); // 2.5 - 4ms
                    const grainSamples = Math.floor(grainDuration * sr);

                    for (let s = 0; s < grainSamples; s++) {
                        const idx = startSample + s;
                        if (idx < numSamples) {
                            const env = Math.sin((s / grainSamples) * Math.PI); // Hann micro-window
                            const noiseVal = (Math.random() * 2 - 1);
                            channelData[idx] += noiseVal * env * imp.amp;
                        }
                    }
                });

                // Normalize/protect buffer
                let peak = 0;
                for (let i = 0; i < numSamples; i++) {
                    const abs = Math.abs(channelData[i]);
                    if (abs > peak) peak = abs;
                }
                if (peak > 0.001) {
                    for (let i = 0; i < numSamples; i++) {
                        channelData[i] /= peak;
                    }
                }

                const impulseSource = audioContext.createBufferSource();
                impulseSource.buffer = impulseBuffer;

                // Drive parallel resonators and air filter
                jingleModes.forEach(m => {
                    impulseSource.connect(m.node);
                });
                impulseSource.connect(airFilter);

                impulseSource.start(t);

                return { frequency: 6300, volume: is32nd ? 0.65 : 0.85 };
            },
            'shaker': function(opts = {}) {
                if (!audioContext) return;
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0; // 75% lower attack for 32nd notes

                const { source: noise, startOffset } = createNoiseSource();

                const hp = audioContext.createBiquadFilter();
                hp.type = 'highpass';
                hp.frequency.setValueAtTime(4500, t);

                // Alternate slightly on repeated shakes for natural forward/backward groove
                shakerStroke = (shakerStroke + 1) % 2;
                const isAccent = shakerStroke === 0;
                const centerFreq = isAccent ? 8500 : 7800;

                const bp = audioContext.createBiquadFilter();
                bp.type = 'bandpass';
                bp.frequency.setValueAtTime(centerFreq, t);
                bp.Q.setValueAtTime(1.2, t);

                // Natural shaker envelope: 20ms slide-up, then natural exponential decay
                const envelope = audioContext.createGain();
                const peakGain = (isAccent ? 0.8 : 0.65) * attackScale;
                const decayDuration = is32nd ? 0.045 : (isAccent ? 0.13 : 0.10);

                envelope.gain.setValueAtTime(0.001, t);
                envelope.gain.linearRampToValueAtTime(peakGain, t + (is32nd ? 0.012 : 0.02));
                envelope.gain.exponentialRampToValueAtTime(0.001, t + (is32nd ? 0.012 : 0.02) + decayDuration);

                noise.connect(hp);
                hp.connect(bp);
                bp.connect(envelope);
                envelope.connect(analyser);

                noise.start(t, startOffset);
                noise.stop(t + (is32nd ? 0.065 : 0.16));

                return { frequency: centerFreq, volume: is32nd ? 0.45 : 0.7 };
            },
            'triangle': function() {
                if (!audioContext) return null;
                const opts = arguments[0] || {};
                const t = audioContext.currentTime;
                const is32nd = Boolean(opts && (opts.is32nd || (opts.repeatInterval > 0 && opts.repeatInterval <= 70)));
                const attackScale = is32nd ? 0.25 : 1.0; // 75% lower attack for 32nd notes

                // 1. Initial Metallic Strike Transient (Noise burst 6-12kHz, 15ms decay)
                const { source: noise, startOffset } = createNoiseSource();
                const strikeFilter = audioContext.createBiquadFilter();
                strikeFilter.type = 'bandpass';
                strikeFilter.frequency.setValueAtTime(8500, t);
                strikeFilter.Q.setValueAtTime(1.5, t);

                const strikeGain = audioContext.createGain();
                strikeGain.gain.setValueAtTime(0.35 * attackScale, t);
                strikeGain.gain.exponentialRampToValueAtTime(0.001, t + (is32nd ? 0.01 : 0.015));

                noise.connect(strikeFilter);
                strikeFilter.connect(strikeGain);
                strikeGain.connect(analyser);

                noise.start(t, startOffset);
                noise.stop(t + (is32nd ? 0.015 : 0.02));

                // 2. Inharmonic Modal Resonator Bank (Frequency vs Decay Decoupling)
                const modes = [
                    { freq: 1420, decay: 2.5, amp: 0.18 },
                    { freq: 2604, decay: 4.8, amp: 0.26 },
                    { freq: 3851, decay: 6.2, amp: 0.35 },
                    { freq: 3898, decay: 5.5, amp: 0.32 }, // ~47 Hz beating shimmer with 3851 Hz
                    { freq: 5836, decay: 7.0, amp: 0.30 }, // High-Q mid-high resonance lingering longest
                    { freq: 7980, decay: 3.5, amp: 0.20 },
                    { freq: 9420, decay: 1.8, amp: 0.14 },
                    { freq: 11600, decay: 1.2, amp: 0.09 },
                    { freq: 13800, decay: 0.8, amp: 0.05 }
                ];

                const masterGain = audioContext.createGain();
                masterGain.gain.setValueAtTime(is32nd ? 0.20 : 0.35, t);
                masterGain.connect(analyser);

                modes.forEach(mode => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(mode.freq, t);

                    if (is32nd) {
                        gain.gain.setValueAtTime(0.001, t);
                        gain.gain.linearRampToValueAtTime(mode.amp * 0.7, t + 0.01);
                        gain.gain.exponentialRampToValueAtTime(0.0005, t + mode.decay);
                    } else {
                        gain.gain.setValueAtTime(mode.amp, t);
                        gain.gain.exponentialRampToValueAtTime(0.0005, t + mode.decay);
                    }

                    osc.connect(gain);
                    gain.connect(masterGain);

                    osc.start(t);
                    osc.stop(t + mode.decay + 0.05);
                });

                return { frequency: 4500, volume: is32nd ? 0.65 : 0.85 };
            }
        };

        /* ============================================================== *
         * END SYNTHESIS
         * ============================================================== */

        /**
         * Play one instrument immediately (at audioContext.currentTime).
         * @param {string} id  instrument id, e.g. 'snare'
         * @param {object} [opts] see AI-INTEGRATION-GUIDE.md § Play options
         * @returns {{frequency:number, volume:number}|null} voice info for
         *          visualisers, or null if the instrument id is unknown.
         */
        function play(id, opts) {
            ensureAudio();
            var voice = sounds[id];
            if (!voice) return null;
            return voice(opts || {}) || null;
        }

        /**
         * Build the opts object the drum kit uses for a given repeat rate.
         * Only the guiro needs per-rate shaping; everything else just needs
         * is32nd / repeatInterval so the fast-repeat envelopes kick in.
         * @param {string} id
         * @param {number} repeatIntervalMs 0 for a single hit
         */
        function optionsForRepeat(id, repeatIntervalMs) {
            var interval = repeatIntervalMs || 0;
            var opts = {};
            if (id === 'guiro') {
                if (interval >= 500) {
                    opts.strokeType = 'long';
                    opts.accentFirst = true;
                } else if (interval === 250) {
                    opts.strokeType = 'short';
                    opts.accentFirst = false;
                } else if (interval > 0 && interval <= 125) {
                    opts.strokeType = 'flick';
                    opts.accentFirst = false;
                } else {
                    opts.strokeType = 'short';
                    opts.accentFirst = false;
                }
            }
            opts.repeatInterval = interval;
            opts.is32nd = (interval > 0 && interval <= 70);
            return opts;
        }

        /** Resume the AudioContext. Call once from a user gesture. */
        function unlock() {
            return ensureAudio();
        }

        /** Master volume, 0..1 (or higher if you want to clip). */
        function setVolume(value) {
            ensureAudio();
            if (masterGainNode) {
                masterGainNode.gain.setValueAtTime(value, audioContext.currentTime);
            }
        }

        /** Fill and return a Uint8Array of frequency data, for visualisers. */
        function getFrequencyData(target) {
            if (!analyser) return null;
            var data = target || new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(data);
            return data;
        }

        return {
            play: play,
            unlock: unlock,
            optionsForRepeat: optionsForRepeat,
            setVolume: setVolume,
            getFrequencyData: getFrequencyData,
            sounds: sounds,
            instruments: INSTRUMENTS,
            has: function (id) { return Boolean(sounds[id]); },
            get audioContext() { return audioContext; },
            get analyser() { return analyser; },
            get masterGain() { return masterGainNode; }
        };
    }

    /* ------------------------------------------------------------------ *
     * Helpers that need no kit
     * ------------------------------------------------------------------ */

    /** Repeat interval in ms for a note index (see NOTE_LABELS) at a given BPM. */
    function noteIntervalMs(noteIndex, bpm) {
        var base = NOTE_INTERVALS_120BPM[noteIndex] || 0;
        if (!base) return 0;
        return base * (120 / (bpm || 120));
    }

    /** Resolve an instrument's image path against wherever you copied this folder. */
    function imagePath(id, basePath) {
        var inst = INSTRUMENT_MAP[id];
        if (!inst) return null;
        var prefix = basePath || '';
        if (prefix && prefix.charAt(prefix.length - 1) !== '/') prefix += '/';
        return prefix + inst.image;
    }

    return {
        createKit: createKit,
        INSTRUMENTS: INSTRUMENTS,
        INSTRUMENT_MAP: INSTRUMENT_MAP,
        INSTRUMENT_IDS: INSTRUMENT_IDS,
        NOTE_INTERVALS_120BPM: NOTE_INTERVALS_120BPM,
        NOTE_LABELS: NOTE_LABELS,
        noteIntervalMs: noteIntervalMs,
        imagePath: imagePath,
        version: '1.0.0'
    };
}));
