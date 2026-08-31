(function() {
  const container = document.getElementById('poem');

  const DEFAULT_SONGS = {
    'instructions': {
      id: 'instructions',
      title: 'Instructions',
      mode: 'poetry',
      poetryState: {
        words: [
          'Press', 'the', 'lyrics', 'to', 'edit.', 'Spacebar', 'moves', 'foward,', 'backspace', 'moves', 'back.', '-', '-', '-', '-', '-'
        ],
        rawLyrics: [
          'Press', 'the', 'lyrics', 'to', 'edit.', 'Spacebar', 'moves', 'foward,', 'backspace', 'moves', 'back.'
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4
      },
      rhythmState: {
        beats: [
          [true, true],
          [true, true],
          [true, true],
          [true, true],
          [true, true],
          [true, false],
          [false, false],
          [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'hickory-dickory-dock': {
      id: 'hickory-dickory-dock',
      title: 'Hickory Dickory Dock',
      mode: 'poetry',
      poetryState: {
        words: [
          'Hick-', 'o-', 'ry', 'dick-', 'o-', 'ry', 'dock,', '-', '-', '-', '-', 'The', 'mouse', '-', 'ran', 'up', '-', 'the', 'clock.', '-', '-', '-', '-', 'The', 'clock', '-', 'struck', 'one,', '-', 'The', 'mouse', '-', 'ran', 'down,', '-', '-', 'Hick-', 'o-', 'ry', 'dick-', 'o-', 'ry', 'dock.', '-', '-', '-', '-', '-'
        ],
        rawLyrics: [
          'Hick-', 'o-', 'ry', 'dick-', 'o-', 'ry', 'dock,', 'The', 'mouse', 'ran', 'up', 'the', 'clock.', 'The', 'clock', 'struck', 'one,', 'The', 'mouse', 'ran', 'down,', 'Hick-', 'o-', 'ry', 'dick-', 'o-', 'ry', 'dock.'
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 6,
        timeSignatureDenominator: 8
      },
      rhythmState: {
        beats: [
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [false, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'humpty-dumpty': {
      id: 'humpty-dumpty',
      title: 'Humpty Dumpty',
      mode: 'poetry',
      poetryState: {
        words: [
          'Hump-', '-', 'ty', 'Dump-', '-', 'ty', 'sat', 'on', 'a', 'wall,', '-', '-', 'Hump-', '-', 'ty', 'Dump-', '-', 'ty', 'had', 'a', 'great', 'fall.', '-', '-', 'All', 'the', "king's", 'hors-', 'es', 'and', 'all', 'the', "king's", 'men', '-', '-', 'Could-', "n't", 'put', 'Hump-', 'ty', 'to-', 'geth-', 'er', 'a-', 'gain.', '-', '-'
        ],
        rawLyrics: [
          'Hump-', 'ty', 'Dump-', 'ty', 'sat', 'on', 'a', 'wall,', 'Hump-', 'ty', 'Dump-', 'ty', 'had', 'a', 'great', 'fall.', 'All', 'the', "king's", 'hors-', 'es', 'and', 'all', 'the', "king's", 'men', 'Could-', "n't", 'put', 'Hump-', 'ty', 'to-', 'geth-', 'er', 'a-', 'gain.'
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 6,
        timeSignatureDenominator: 8
      },
      rhythmState: {
        beats: [
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [false, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'twinkle-twinkle-little-star': {
      id: 'twinkle-twinkle-little-star',
      title: 'Twinkle Twinkle Little Star',
      mode: 'poetry',
      poetryState: {
        words: [
          'Twin-', 'kle,', 'twin-', 'kle,', 'lit-', 'tle', 'star,', '-', 'How', 'I', 'won-', 'der', 'what', 'you', 'are!', '-', 'Up', 'a-', 'bove', 'the', 'world', 'so', 'high,', '-', 'Like', 'a', 'dia-', 'mond', 'in', 'the', 'sky.', '-'
        ],
        rawLyrics: [
          'Twin-', 'kle,', 'twin-', 'kle,', 'lit-', 'tle', 'star,', 'How', 'I', 'won-', 'der', 'what', 'you', 'are!', 'Up', 'a-', 'bove', 'the', 'world', 'so', 'high,', 'Like', 'a', 'dia-', 'mond', 'in', 'the', 'sky.'
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4
      },
      rhythmState: {
        beats: [
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [false, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'little-miss-muffet': {
      id: 'little-miss-muffet',
      title: 'Little Miss Muffet',
      mode: 'poetry',
      poetryState: {
        words: [
          'Lit-', 'tle', 'Miss', '-', 'Muf-', 'fet', 'Sat', '-', 'on', 'a', 'tuf-', 'fet,', 'Eat-', 'ing', 'her', '-', 'curds', 'and', 'whey;', '-', '-', 'There', 'came', 'a', 'big', '-', 'spi-', '-', 'der,', 'Who', 'sat', 'down', 'be-', '-', 'side', '-', 'her,', 'And', 'fright-', 'ened', 'Miss', '-', 'Muf-', '-', 'fet', 'a-', 'way.', '-', '-', '-'
        ],
        rawLyrics: [
          'Lit-', 'tle', 'Miss', 'Muf-', 'fet', 'Sat', 'on', 'a', 'tuf-', 'fet,', 'Eat-', 'ing', 'her', 'curds', 'and', 'whey;', 'There', 'came', 'a', 'big', 'spi-', 'der,', 'Who', 'sat', 'down', 'be-', 'side', 'her,', 'And', 'fright-', 'ened', 'Miss', 'Muf-', 'fet', 'a-', 'way.'
        ],
        beatSubdivisions: {
          '0': 4,
          '2': 4,
          '4': 4,
          '8': 4,
          '9': 4,
          '10': 4,
          '11': 4,
          '12': 4,
          '13': 4
        },
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4
      },
      rhythmState: {
        beats: [
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [false, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'row-row-row-your-boat': {
      id: 'row-row-row-your-boat',
      title: 'Row Row Row Your Boat',
      mode: 'poetry',
      poetryState: {
        words: [
          'Row,', '-', '-', 'row,', '-', '-', 'row', '-', 'your', 'boat,', '-', '-', 'Gent-', '-', 'ly', 'down', '-', 'the', 'stream,', '-', '-', '-', '-', '-', 'Mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'Life', '-', 'is', 'but', '-', 'a', 'dream.', '-', '-', '-', '-', '-'
        ],
        rawLyrics: [
          'Row,', 'row,', 'row', 'your', 'boat,', 'Gent-', 'ly', 'down', 'the', 'stream,', 'Mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'Life', 'is', 'but', 'a', 'dream.'
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 6,
        timeSignatureDenominator: 8
      },
      rhythmState: {
        beats: [
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, false], [false, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    }
  };

  const rhythmSystems = {
    "Simplified Kodály": {
      "2": { "B/G": ["Ta", "-"], "B/B": ["Ti", "ti"], "G/B": ["-", "ti"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Ta", "-", "-"], "B/B/B": ["Ti", "ti", "ti"], "B/B/G": ["Ti", "ti", "-"], "B/G/B": ["Ti", "-", "ti"], "G/B/G": ["-", "ti", "-"], "G/B/B": ["-", "ti", "ti"], "G/G/B": ["-", "-", "ti"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Ta", "-", "-", "-"], "B/G/B/G": ["Ti", "-", "ti", "-"], "B/B/B/B": ["Ti", "ki", "ti", "ki"], "G/B/B/B": ["-", "ki", "ti", "ki"], "B/B/B/G": ["Ti", "ki", "ti", "-"], "B/B/G/B": ["Ti", "ki", "-", "ki"], "B/G/B/B": ["Ti", "-", "ti", "ki"], "B/B/G/G": ["Ti", "ki", "-", "-"], "G/B/B/G": ["-", "ki", "ti", "-"], "G/G/B/B": ["-", "-", "ti", "ki"], "G/B/G/B": ["-", "ki", "-", "ki"], "B/G/G/B": ["Ti", "-", "-", "ki"], "G/B/G/G": ["-", "ki", "-", "-"], "G/G/B/G": ["-", "-", "ti", "-"], "G/G/G/B": ["-", "-", "-", "ki"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Beat Centered Kodály": {
      "2": { "B/G": ["Ta", "-"], "B/B": ["Ti", "ti"], "G/B": ["-", "ti"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Ta", "-", "-"], "B/B/B": ["Ti", "da", "di"], "B/B/G": ["Ti", "da", "-"], "B/G/B": ["Ti", "-", "di"], "G/B/G": ["-", "da", "-"], "G/B/B": ["-", "da", "di"], "G/G/B": ["-", "-", "di"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Ta", "-", "-", "-"], "B/G/B/G": ["Ti", "-", "ti", "-"], "B/B/B/B": ["Ti", "ri", "ti", "ri"], "G/B/B/B": ["-", "ri", "ti", "ri"], "B/B/B/G": ["Ti", "ri", "ti", "-"], "B/B/G/B": ["Ti", "ri", "-", "ri"], "B/G/B/B": ["Ti", "-", "ti", "ri"], "B/B/G/G": ["Ti", "ri", "-", "-"], "G/B/B/G": ["-", "ri", "ti", "-"], "G/G/B/B": ["-", "-", "ti", "ri"], "G/B/G/B": ["-", "ri", "-", "ri"], "B/G/G/B": ["Ti", "-", "-", "ri"], "G/B/G/G": ["-", "ri", "-", "-"], "G/G/B/G": ["-", "-", "ti", "-"], "G/G/G/B": ["-", "-", "-", "ri"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Gordon System": {
      "2": { "B/G": ["Du", "-"], "B/B": ["Du", "de"], "G/B": ["-", "de"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Du", "-", "-"], "B/B/B": ["Du", "da", "di"], "B/B/G": ["Du", "da", "-"], "B/G/B": ["Du", "-", "di"], "G/B/G": ["-", "da", "-"], "G/B/B": ["-", "da", "di"], "G/G/B": ["-", "-", "di"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Du", "-", "-", "-"], "B/G/B/G": ["Du", "-", "de", "-"], "B/B/B/B": ["Du", "ta", "de", "ta"], "G/B/B/B": ["-", "ta", "de", "ta"], "B/B/B/G": ["Du", "ta", "de", "-"], "B/B/G/B": ["Du", "ta", "-", "ta"], "B/G/B/B": ["Du", "-", "de", "ta"], "B/B/G/G": ["Du", "ta", "-", "-"], "G/B/B/G": ["-", "ta", "de", "-"], "G/G/B/B": ["-", "-", "de", "ta"], "G/B/G/B": ["-", "ta", "-", "ta"], "B/G/G/B": ["Du", "-", "-", "ta"], "G/B/G/G": ["-", "ta", "-", "-"], "G/G/B/G": ["-", "-", "de", "-"], "G/G/G/B": ["-", "-", "-", "ta"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Takadimi System": {
      "2": { "B/G": ["Ta", "-"], "B/B": ["Ta", "di"], "G/B": ["-", "di"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Ta", "-", "-"], "B/B/B": ["Ta", "ki", "da"], "B/B/G": ["Ta", "ki", "-"], "B/G/B": ["Ta", "-", "da"], "G/B/G": ["-", "ki", "-"], "G/B/B": ["-", "ki", "da"], "G/G/B": ["-", "-", "da"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Ta", "-", "-", "-"], "B/G/B/G": ["Ta", "-", "di", "-"], "B/B/B/B": ["Ta", "ka", "di", "mi"], "G/B/B/B": ["-", "ka", "di", "mi"], "B/B/B/G": ["Ta", "ka", "di", "-"], "B/B/G/B": ["Ta", "ka", "-", "mi"], "B/G/B/B": ["Ta", "-", "di", "mi"], "B/B/G/G": ["Ta", "ka", "-", "-"], "G/B/B/G": ["-", "ka", "di", "-"], "G/G/B/B": ["-", "-", "di", "mi"], "G/B/G/B": ["-", "ka", "-", "mi"], "B/G/G/B": ["Ta", "-", "-", "mi"], "G/B/G/G": ["-", "ka", "-", "-"], "G/G/B/G": ["-", "-", "di", "-"], "G/G/G/B": ["-", "-", "-", "mi"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Fruit Rhythms": {
      "2": { "B/G": ["Pie", "-"], "B/B": ["Ap", "ple"], "G/B": ["-", "Sweet"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Pie", "-", "-"], "B/B/B": ["Pine", "ap", "ple"], "B/B/G": ["Yo", "gurt", "-"], "B/G/B": ["Le", "-", "mon"], "G/B/G": ["-", "Peas", "-"], "G/B/B": ["-", "Spi", "cy"], "G/G/B": ["-", "-", "Sweet"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Pie", "-", "-", "-"], "B/G/B/G": ["Ap", "-", "ple", "-"], "B/B/B/B": ["Wa", "ter", "me", "lon"], "G/B/B/B": ["-", "To", "ma", "to"], "B/B/B/G": ["Co", "co", "nut", "-"], "B/B/G/B": ["Ba", "na", "-", "na"], "B/G/B/B": ["Blue", "-", "ber", "ry"], "B/B/G/G": ["Ki", "wi", "-", "-"], "G/B/B/G": ["-", "Fi", "let", "-"], "G/G/B/B": ["-", "-", "Ber", "ry"], "G/B/G/B": ["-", "Sal", "-", "sa"], "B/G/G/B": ["Cher", "-", "-", "ry"], "G/B/G/G": ["-", "Peas", "-", "-"], "G/G/B/G": ["-", "-", "Sweet", "-"], "G/G/G/B": ["-", "-", "-", "&"], "G/G/G/G": ["-", "-", "-", "-"] }
    }
  };

  let currentMode = 'rhythm'; // 'rhythm' (default) or 'poetry'

  const poetryState = {
    words: DEFAULT_SONGS['instructions'].poetryState.words.slice(),
    rawLyrics: DEFAULT_SONGS['instructions'].poetryState.rawLyrics.slice(),
    canonical12: [],
    beatSubdivisions: { ...DEFAULT_SONGS['instructions'].poetryState.beatSubdivisions },
    linkedBeats: { ...DEFAULT_SONGS['instructions'].poetryState.linkedBeats },
    syncopation: DEFAULT_SONGS['instructions'].poetryState.syncopation.slice(),
    syncopationStates: { ...DEFAULT_SONGS['instructions'].poetryState.syncopationStates },
    hasPickupMeasure: false,
    BPM: 82,
    timeSignatureNumerator: 4,
    timeSignatureDenominator: 4,
    selectedPlayStartPosition: null
  };

  const rhythmState = {
    beats: JSON.parse(JSON.stringify(DEFAULT_SONGS['instructions'].rhythmState.beats)),
    beatSubdivisions: { ...DEFAULT_SONGS['instructions'].rhythmState.beatSubdivisions },
    linkedBeats: { ...DEFAULT_SONGS['instructions'].rhythmState.linkedBeats },
    hasPickupMeasure: false,
    BPM: 82,
    timeSignatureNumerator: 4,
    timeSignatureDenominator: 4,
    currentRhythmSystem: 'Simplified Kodály',
    selectedPlayStartPosition: null
  };

  let editingIndex = null;
  let circleIconActive = true;
  let isFirstPlay = true;
  let isPlaying = false;
  let playTimeouts = [];
  let currentPlayPosition = 0;
  let notesBoxElements = []; // Store references to notes boxes for highlighting
  let beatEnabled = true; // Beat toggle state
  let rhythmEnabled = true; // Rhythm toggle state
  let introEnabled = true; // Intro count-in state
  let textImportMode = 'replace'; // 'add' or 'replace'
  let savedTextInput = ''; // Store the text from the modal
  let pitchMode = 'pitch'; // 'pitch' or 'drum'

  // Audio context for generating sounds
  let audioContext = null;

  function getActiveState() {
    return currentMode === 'rhythm' ? rhythmState : poetryState;
  }

  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
  }

  // Convert the current words array to clean plain text
  function wordsToText() {
    if (poetryState.rawLyrics && poetryState.rawLyrics.length > 0) {
      return poetryState.rawLyrics.join(' ');
    }
    return poetryState.words
      .filter(word => word && word !== '-' && word.trim() !== '')
      .join(' ');
  }

  // Copy text to clipboard
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (err) {
        textArea.remove();
        return false;
      }
    }
  }

  // Copy canvas to clipboard
  async function copyCanvasToClipboard(canvas) {
    try {
      // Convert canvas to blob
      return new Promise(resolve => {
        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            resolve(true);
          } catch (err) {
            console.error('Failed to copy image to clipboard:', err);
            resolve(false);
          }
        }, 'image/png');
      });
    } catch (err) {
      console.error('Clipboard API not supported:', err);
      return false;
    }
  }

  // Capture visual and save as JPEG in Downloads
  async function captureVisual() {
    const copyVisualBtn = document.getElementById("copy-visual-btn");
    if (!copyVisualBtn) return;
    const originalText = copyVisualBtn.textContent;
    
    try {
      document.body.classList.add("capturing");
      copyVisualBtn.textContent = "⏳";
      copyVisualBtn.style.backgroundColor = "#ffc107";
      
      await new Promise(resolve => setTimeout(resolve, 120));
      
      const targetElement = document.getElementById("poem") || container;
      const canvas = await html2canvas(targetElement, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        ignoreElements: (element) => {
          return element.classList && (
            element.classList.contains("delete-measure-btn") ||
            element.classList.contains("floating-panel") ||
            element.classList.contains("fab") ||
            element.classList.contains("popup-modal")
          );
        }
      });
      
      const songName = (currentSongTitle || "music-score").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const filename = `${songName || "music-score"}.jpg`;
      const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
      
      const link = document.createElement("a");
      link.download = filename;
      link.href = jpegDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      copyVisualBtn.textContent = "💾";
      copyVisualBtn.style.backgroundColor = "#28a745";
    } catch (error) {
      console.error("Failed to capture visual:", error);
      copyVisualBtn.textContent = "✗";
      copyVisualBtn.style.backgroundColor = "#dc3545";
    } finally {
      document.body.classList.remove("capturing");
      setTimeout(() => {
        copyVisualBtn.textContent = originalText;
        copyVisualBtn.style.backgroundColor = "";
      }, 2000);
    }
  }

  // Get the first circle position of the next beat after a syncopated position
  function getNextBeatFirstCircle(syncopatedPosition) {
    return syncopatedPosition + 1;
  }

  // Check if a position is affected by syncopation
  function isAffectedBySyncopation(position) {
    if (currentMode === 'rhythm') return false;
    for (const syncPos of poetryState.syncopation) {
      const nextBeatFirstCircle = getNextBeatFirstCircle(syncPos);
      const nextBeatSecondCircle = nextBeatFirstCircle + 1;
      if (position === nextBeatFirstCircle || position === nextBeatSecondCircle) {
        return true;
      }
    }
    return false;
  }

  // Check if a position can be syncopated (not on last beat of measure)
  function canSyncopate(position) {
    const config = getLayoutConfig();
    const positionInMeasure = position % (config.beatsPerMeasure * 2);
    const beatInMeasure = Math.floor(positionInMeasure / 2);
    const lastBeatOfMeasure = config.beatsPerMeasure - 1;
    return beatInMeasure !== lastBeatOfMeasure;
  }

  // Check if syncopation conditions are met for a position
  function canCreateSyncopation(position) {
    if (poetryState.timeSignatureDenominator === 8) return false;
    if (position % 2 === 0) return false;
    if (position === 0 || poetryState.words[position - 1] === '-' || poetryState.words[position - 1] === '') return false;
    return canSyncopate(position);
  }

  // Get the syncopation type for a beat (for determining which image to show)
  function getSyncopationType(beatStartPosition) {
    if (currentMode === 'rhythm') return null;
    for (const syncPos of poetryState.syncopation) {
      const nextBeatFirstCircle = getNextBeatFirstCircle(syncPos);
      if (nextBeatFirstCircle === beatStartPosition) {
        const firstActive = poetryState.syncopationStates[beatStartPosition] || false;
        const secondActive = poetryState.syncopationStates[beatStartPosition + 1] || false;
        
        if (!firstActive && secondActive) {
          return 'SyncopateB';
        } else if (!firstActive && !secondActive) {
          return 'SyncopateC';
        }
      }
    }
    return null;
  }

  function applyIsolatedRhythmChange(position) {
    if (poetryState.syncopation.length > 0) return false;

    while (poetryState.words.length <= position) {
      poetryState.words.push('-');
    }

    // Ensure rawLyrics is populated
    if (!poetryState.rawLyrics || poetryState.rawLyrics.length === 0) {
      poetryState.rawLyrics = poetryState.words.filter(w => w && w !== '-' && w.trim() !== '');
    }

    const wasActive = poetryState.words[position] !== '-' && poetryState.words[position] !== '' && poetryState.words[position] !== undefined;

    if (wasActive) {
      // Turning this note into a rest
      poetryState.words[position] = '-';
    } else {
      // Turning this rest into a note
      poetryState.words[position] = ' ';
    }

    // Distribute words from rawLyrics into all active note positions in order
    const activeIndices = [];
    for (let i = 0; i < poetryState.words.length; i++) {
      if (poetryState.words[i] !== '-' && poetryState.words[i] !== '') {
        activeIndices.push(i);
      }
    }

    for (let k = 0; k < activeIndices.length; k++) {
      const slot = activeIndices[k];
      if (k < poetryState.rawLyrics.length) {
        poetryState.words[slot] = poetryState.rawLyrics[k];
      } else {
        poetryState.words[slot] = ' ';
      }
    }

    return true;
  }

  // Check if a position should be considered active (for rhythm and display)
  function isPositionActive(position, wordArray) {
    if (isAffectedBySyncopation(position)) {
      return poetryState.syncopationStates[position] || false;
    } else {
      const word = wordArray[position];
      return word !== '-' && word !== '' && word !== undefined;
    }
  }

  // Generate brush drum sound using white noise
  function createBrushDrumSound() {
    const ctx = initAudioContext();
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.pow(0.01, i / bufferSize);
      output[i] = (Math.random() * 2 - 1) * envelope * 0.3;
    }
    return buffer;
  }

  function playBrushDrum() {
    if (!beatEnabled) return;
    const ctx = initAudioContext();
    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    source.buffer = createBrushDrumSound();
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    source.start();
    source.stop(ctx.currentTime + 0.1);
  }

  function playBassDrum() {
    if (!rhythmEnabled) return;
    const ctx = initAudioContext();
    const time = ctx.currentTime;

    const bodyOsc = ctx.createOscillator();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(150, time);
    bodyOsc.frequency.exponentialRampToValueAtTime(40, time + 0.15);

    const attackOsc = ctx.createOscillator();
    attackOsc.type = 'triangle';
    attackOsc.frequency.setValueAtTime(200, time);
    attackOsc.frequency.exponentialRampToValueAtTime(50, time + 0.03);

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    const attackGain = ctx.createGain();
    attackGain.gain.setValueAtTime(0.6, time);
    attackGain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, time);
    mainGain.gain.linearRampToValueAtTime(0.8, time + 0.005);
    mainGain.gain.exponentialRampToValueAtTime(0.3, time + 0.1);
    mainGain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
    mainGain.gain.linearRampToValueAtTime(0, time + 0.45);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.Q.setValueAtTime(1, time);

    bodyOsc.connect(filter);
    attackOsc.connect(attackGain);
    noiseSource.connect(noiseGain);
    
    attackGain.connect(mainGain);
    noiseGain.connect(mainGain);
    filter.connect(mainGain);
    mainGain.connect(ctx.destination);

    bodyOsc.start(time);
    attackOsc.start(time);
    noiseSource.start(time);
    
    bodyOsc.stop(time + 0.45);
    attackOsc.stop(time + 0.45);
    noiseSource.stop(time + 0.45);
  }

  function playTriangleTone(duration = 0.2) {
    if (!rhythmEnabled) return;
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(110, ctx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  }

  // Auto-scroll to keep highlighted element in view
  function scrollToElement(element) {
    if (!element) return;
    const elementRect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const floatingPanelHeight = 60;

    const viewCenterY = (windowHeight - floatingPanelHeight) / 2;
    const tolerance = 50;
    if (Math.abs(elementRect.top - viewCenterY) > tolerance) {
      const elementTopInDocument = elementRect.top + window.pageYOffset;
      const targetY = elementTopInDocument - viewCenterY + (elementRect.height / 2);
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }
  }

  function highlightNotesBox(position) {
    notesBoxElements.forEach(box => box.classList.remove('playing'));
    if (position < notesBoxElements.length) {
      const currentElement = notesBoxElements[position];
      currentElement.classList.add('playing');
      scrollToElement(currentElement);
    }
  }

  function clearHighlights() {
    notesBoxElements.forEach(box => box.classList.remove('playing'));
  }

  function getBeatSubdivision(beatIndex) {
    const activeState = getActiveState();
    if (activeState.timeSignatureDenominator === 8) {
      return 3;
    }
    return activeState.beatSubdivisions[beatIndex] || 2;
  }

  function setBeatSubdivision(beatIndex, subdivision) {
    const activeState = getActiveState();
    if (activeState.timeSignatureDenominator === 8) return;
    if (subdivision === 2) {
      delete activeState.beatSubdivisions[beatIndex];
    } else {
      activeState.beatSubdivisions[beatIndex] = subdivision;
    }
  }

  function getBeatStartIndex(targetBeat) {
    let idx = 0;
    for (let b = 0; b < targetBeat; b++) {
      idx += getBeatSubdivision(b);
    }
    return idx;
  }

  function getTotalBeatsFromWords(viewWords) {
    if (!viewWords || viewWords.length === 0) return 0;
    let count = 0;
    let b = 0;
    while (count < viewWords.length) {
      count += getBeatSubdivision(b);
      b++;
    }
    return b;
  }

  // Convert current poetry view to 12-grid canonical
  function toCanonical12(viewWords) {
    const totalBeats = Math.max(1, getTotalBeatsFromWords(viewWords));
    const out = new Array(totalBeats * 12).fill('-');
    let wordIdx = 0;
    for (let b = 0; b < totalBeats; b++) {
      const S = getBeatSubdivision(b);
      const win = 12 / S;
      for (let s = 0; s < S; s++) {
        const token = (viewWords[wordIdx] !== undefined) ? viewWords[wordIdx] : '-';
        wordIdx++;
        const wStart = b * 12 + s * win;
        out[wStart] = (token && token !== '-') ? token : '-';
        for (let t = 1; t < win; t++) {
          out[wStart + t] = '-';
        }
      }
    }
    return out;
  }

  // Project 12-grid canonical to current per-beat subdivision view
  function fromCanonical12(canon12) {
    const totalBeats = Math.max(1, Math.ceil((canon12.length || 0) / 12));
    const out = [];

    for (let b = 0; b < totalBeats; b++) {
      const S = getBeatSubdivision(b);
      const win = 12 / S;
      for (let s = 0; s < S; s++) {
        const wStart = b * 12 + s * win;
        const wEnd = wStart + win;
        let placed = '-';
        for (let k = wStart; k < wEnd && k < canon12.length; k++) {
          const tok = canon12[k];
          if (tok && tok !== '-') { placed = tok; break; }
        }
        out.push(placed);
      }
    }
    return out;
  }

  // Merge an edited view into canonical 12-grid, beat-by-beat
  function mergeViewIntoCanonical(canon12, viewWords) {
    const totalBeats = Math.max(Math.ceil((canon12.length || 0) / 12), getTotalBeatsFromWords(viewWords));
    const next = canon12.slice();
    while (next.length < totalBeats * 12) next.push('-');

    let wordIdx = 0;
    for (let b = 0; b < totalBeats; b++) {
      const S = getBeatSubdivision(b);
      const win = 12 / S;

      const editedBeat = [];
      for (let s = 0; s < S; s++) {
        editedBeat.push(viewWords[wordIdx++] ?? '-');
      }

      const derivedBeat = [];
      for (let s = 0; s < S; s++) {
        const wStart = b * 12 + s * win;
        const wEnd = wStart + win;
        let placed = '-';
        for (let k = wStart; k < wEnd && k < next.length; k++) {
          const tok = next[k];
          if (tok && tok !== '-') { placed = tok; break; }
        }
        derivedBeat.push(placed);
      }

      let equal = true;
      for (let s = 0; s < S; s++) {
        if ((editedBeat[s] || '-') !== (derivedBeat[s] || '-')) { equal = false; break; }
      }
      if (!equal) {
        for (let s = 0; s < S; s++) {
          const token = editedBeat[s] && editedBeat[s] !== '' ? editedBeat[s] : '-';
          const wStart = b * 12 + s * win;
          const wEnd = wStart + win;
          for (let k = wStart; k < wEnd && k < next.length; k++) next[k] = '-';
          if (token !== '-') next[wStart] = token;
        }
      }
    }
    return next;
  }

  function sanitizeWordsArray(arr) {
    return arr.map(w => (w === undefined || w === null || w === '' ? '-' : w));
  }

  function getLastWordBeat(viewWords) {
    if (!viewWords || viewWords.length === 0) return -1;
    let lastWordIndex = -1;
    for (let i = viewWords.length - 1; i >= 0; i--) {
      const w = viewWords[i];
      if (w && w !== '-' && w.trim() !== '') {
        lastWordIndex = i;
        break;
      }
    }
    if (lastWordIndex === -1) return -1;

    let count = 0;
    let b = 0;
    while (count <= lastWordIndex) {
      count += getBeatSubdivision(b);
      b++;
    }
    return Math.max(0, b - 1);
  }

  function trimExcessTrailingMeasures() {
    const config = getLayoutConfig();
    const beatsPerMeasure = config.beatsPerMeasure;
    
    // Find the last beat containing an actual word
    const lastWordBeat = getLastWordBeat(poetryState.words);
    
    if (lastWordBeat === -1) {
      // Empty piece: keep exactly 1 measure
      const minBeats = poetryState.hasPickupMeasure ? (1 + beatsPerMeasure) : beatsPerMeasure;
      if (poetryState.canonical12.length > minBeats * 12) {
        poetryState.canonical12.length = minBeats * 12;
      }
      while (poetryState.canonical12.length < minBeats * 12) {
        poetryState.canonical12.push('-');
      }
      poetryState.words = fromCanonical12(poetryState.canonical12);
      return;
    }

    let lastWordMeasure = 0;
    if (poetryState.hasPickupMeasure) {
      lastWordMeasure = (lastWordBeat === 0) ? 0 : Math.floor((lastWordBeat - 1) / beatsPerMeasure) + 1;
    } else {
      lastWordMeasure = Math.floor(lastWordBeat / beatsPerMeasure);
    }

    // Cap at no more than 1 full measure of rest after the last word's measure
    const maxAllowedMeasures = lastWordMeasure + 1 + 1;
    
    let maxAllowedBeats = 0;
    if (poetryState.hasPickupMeasure) {
      maxAllowedBeats = 1 + (maxAllowedMeasures - 1) * beatsPerMeasure;
    } else {
      maxAllowedBeats = maxAllowedMeasures * beatsPerMeasure;
    }

    const currentTotalBeats = Math.ceil((poetryState.canonical12.length || 0) / 12);
    if (currentTotalBeats > maxAllowedBeats) {
      poetryState.canonical12.length = maxAllowedBeats * 12;
      for (const k in poetryState.beatSubdivisions) {
        if (parseInt(k, 10) >= maxAllowedBeats) delete poetryState.beatSubdivisions[k];
      }
      for (const k in poetryState.linkedBeats) {
        if (parseInt(k, 10) >= maxAllowedBeats - 1) delete poetryState.linkedBeats[k];
      }
      poetryState.words = fromCanonical12(poetryState.canonical12);
    }
  }

  function syncRawLyricsFromWords() {
    const displayedWords = poetryState.words.filter(w => w && w !== '-' && w.trim() !== '');
    if (!poetryState.rawLyrics || poetryState.rawLyrics.length <= displayedWords.length) {
      poetryState.rawLyrics = displayedWords.slice();
    } else {
      const tail = poetryState.rawLyrics.slice(displayedWords.length);
      poetryState.rawLyrics = displayedWords.concat(tail);
    }
  }

  function commitAndUpdateView() {
    poetryState.words = sanitizeWordsArray(poetryState.words);
    poetryState.canonical12 = mergeViewIntoCanonical(poetryState.canonical12, poetryState.words);
    poetryState.words = fromCanonical12(poetryState.canonical12);
    trimExcessTrailingMeasures();
    render();
  }

  const SVG_DATA = {"Wordrhythms-16thicon.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjYwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCA2MCAxMDAiPgo8ZGVmcz4KPGcgaWQ9IkxheWVyMV8wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDU4LjggNDMuNApRIDU3LjYgMzUuOCA1MS43NSAyNy4yIDQ2LjEgMTguNzUgMzcuNDUgOS42NSAzNy4yIDkuMzUgMzYuOSA5LjA1IDM1LjEgNy41NSAzNC43NSA1IDMyLjc1IDYuNSAzMi42IDkuMjUKTCAzMi42IDcwLjEgMzIuNDUgNzAuMTUKUSAzMS43IDY5LjkgMzEuNDUgNjkuNzUgMjguNzUgNjguNSAyNi4xNSA2OC4wNSAyNC4yNSA2Ny44IDIyLjQgNjcuOTUgMTYuMDUgNjguNDUgMTEuMzUgNzEuMjUgNy40IDczLjcgNC45NSA3Ni40IDIuMSA3OS42IDEuMDUgODMuNjUgMC4zIDg2LjQ1IDEuNTUgODkuNTUgMi43NSA5Mi42IDUuMiA5NC4xNSA4LjI1IDk1Ljk1IDExLjY1IDk2LjQgMTQuNzUgOTYuNzUgMTguNCA5NiAyMi41NSA5NS4xNSAyNi4xNSA5My4yIDI5LjY1IDkxLjMgMzIuNTUgODguMzUgMzYuOSA4My44NSAzNi45IDc4LjQKTCAzNi45NSA0My41NQpRIDM3LjggNDQuNCAzOC45IDQ1LjQ1IDQwLjUgNDcuMDUgNDIuMyA0OC44NSA0NC4wNSA1MC43IDQ1LjU1IDU0LjMgNDYuOTUgNTcuOSA0Ni45NSA2MC4wNSA0Ni45NSA2Mi4xNSA0Ni41NSA2My44IDQ2LjIgNjUuNSA0NS41NSA2Ny4zIDQ1LjE1IDY4LjM1IDQ0LjM1IDcwLjQ1IDQ3LjA1IDY3LjEgNDguNCA2My4zNSA1MC4xIDU4LjY1IDQ5LjQ1IDU0LjA1IDQ4Ljc1IDQ5LjQ1IDQ1LjIgNDQuMiA0MS45IDM5LjM1IDM2Ljk1IDM0LjEKTCAzNi45NSAyNC44ClEgMzcuMiAyNS4wNSAzNy40NSAyNS4zIDM5LjEgMjcgNDEuNCAyOS4yIDQ0LjA1IDMxLjggNDcgMzQuODUgNDkuOTUgMzcuOSA1Mi4zNSA0My44NSA1NC43IDQ5LjcgNTQuNyA1My4yNSA1NC42NSA1Ni44IDU0LjA1IDU5LjU1IDUzLjQ1IDYyLjIgNTIuMzUgNjUuMjUgNTEuNyA2Ni45NSA1MC40IDcwLjQgNTQuODUgNjQuOSA1Ny4xIDU4Ljc1IDU5LjkgNTAuOTUgNTguOCA0My40IFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-OOO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE4MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTgwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTE5Ljg1IDczLjcKUSAxMTguMiA3MiAxMTUuOCA3MiAxMTMuNCA3MiAxMTEuNyA3My43IDExMCA3NS40IDExMCA3Ny44IDExMCA4MC4yIDExMS43IDgxLjg1IDExMy40IDgzLjYgMTE1LjggODMuNiAxMTguMiA4My42IDExOS44NSA4MS44NSAxMjEuNiA4MC4yIDEyMS42IDc3LjggMTIxLjYgNzUuNCAxMTkuODUgNzMuNyBaIi8+CjwvZz4KCjxnIGlkPSJEdXBsaWNhdGVfSXRlbXNfRm9sZGVyX05vdGVfY29weV8zXzZfTGF5ZXIzXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTE0LjMgOTAuODUKUSAxMTQuMSA4NS45IDExMC42IDgxLjU1IDk3LjEgNjMuOTUgODkuOSA1NS41NSA4MC44NSA0NS4xIDY3LjE1IDI5LjU1CkwgNDEuMTUgMApRIDQyLjc1IDYuNCA0NS41NSAxMy4yIDUyLjEgMjkuMyA1NC44NSA0MC44IDU4LjQ1IDU2LjEgNTcuMjUgNjkuODUgNTYuOTUgNzMuOCA1NiA3NS40NSA0My4xIDk4LjU1IDM2LjI1IDEwOS44NSAyOC45NSAxMjIgMTMuNzUgMTQ1LjkgMTAuNiAxNTEuMSAxMi4xIDE1OC4wNSAxMy40IDE2My45IDE2LjI1IDE3MC4zIDE4LjQgMTc1LjA1IDIyLjIgMTgxLjc1IDM4LjggMjExLjE1IDYyLjkgMjM2LjUKTCA2Ny43NSAyNDEuOQpRIDYzLjU1IDI0MyA2MS42IDI0My41IDU4LjE1IDI0NC40IDU1Ljg1IDI0NC43IDUxLjQgMjQ1LjMgNDEuNzUgMjQ2LjMgMzIuNTUgMjQ3LjI1IDI3LjcgMjQ3LjkgNy4xIDI1MC44IDIuNDUgMjcwLjEgMS44IDI3Mi44IDEuMSAyNzYuODUgMC43NSAyNzkuMSAwIDI4My42NQpMIDAgMjk0Ljc1IDAuNDUgMjk1LjUKUSAxLjk1IDMwNi4yIDkuOTUgMzE3LjI1IDE2LjE1IDMyNS45IDI1LjMgMzM0LjM1IDMyLjMgMzQwLjggNDMuMDUgMzQ4LjkgNDQuNDUgMzQ5Ljk1IDU1LjcgMzU3LjkKTCA1Ni4zIDM1Ny4zNQpRIDU0LjkgMzU0Ljc1IDU0LjEgMzUzLjU1IDQ4LjMgMzQ0LjM1IDQ1LjMgMzM5LjggMzcuNzUgMzI4LjQgNDEuMzUgMzE0LjE1IDQ4LjM1IDI4Ni41NSA3My40NSAyODAuMzUgOTAuOTUgMjc2IDExMC4zIDI4My4zNSAxMTUuMiAyODUuMjUgMTI1LjI1IDI4OS43IDExMi4xNSAyNzIuMTUgMTEyLjA1IDI3MiAxMDAuMiAyNTUuNjUgOTIuMjUgMjQzLjIgODIuMTUgMjI3LjI1IDc1LjE1IDIxMi43NSA3MC40NSAyMDMuMTUgNjkuMiAxOTYuMDUgNjguMDUgMTg5LjEgNjkuNTUgMTgxLjA1IDcwLjYgMTc1IDczLjYgMTY2LjU1IDc2Ljg1IDE1Ny4zNSA4My4wNSAxNDYuNyA4NiAxNDEuNjUgOTQuOCAxMjguMSAxMDUuMTUgMTEyLjE1IDExMS44NSAxMDAuMyAxMTQuNTUgOTUuNSAxMTQuMyA5MC44NSBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIxXzBfRklMTCIvPgo8L2c+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC4yOTc4OTczMzg4NjcxODc1LCAwLCAwLCAwLjI5Nzg5NzMzODg2NzE4NzUsIDk0Ljc1LC0yLjUpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLjA1Nzg2MTMyODEyNSwgMCwgMCwgMS4wNTc4NjEzMjgxMjUsIC03Mi4yLDE0LjYpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjg0ODI5NzExOTE0MDYyNSwgMCwgMCwgMC44NDgyOTcxMTkxNDA2MjUsIDEuMDUsMS4yNSkgIj4KPHVzZSB4bGluazpocmVmPSIjRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3RlX2NvcHlfM182X0xheWVyM18wX0ZJTEwiLz4KPC9nPgo8L2c+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-OOOO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3RlX2NvcHlfM182X0xheWVyM18wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDExNC4zIDkwLjg1ClEgMTE0LjEgODUuOSAxMTAuNiA4MS41NSA5Ny4xIDYzLjk1IDg5LjkgNTUuNTUgODAuODUgNDUuMSA2Ny4xNSAyOS41NQpMIDQxLjE1IDAKUSA0Mi43NSA2LjQgNDUuNTUgMTMuMiA1Mi4xIDI5LjMgNTQuODUgNDAuOCA1OC40NSA1Ni4xIDU3LjI1IDY5Ljg1IDU2Ljk1IDczLjggNTYgNzUuNDUgNDMuMSA5OC41NSAzNi4yNSAxMDkuODUgMjguOTUgMTIyIDEzLjc1IDE0NS45IDEwLjYgMTUxLjEgMTIuMSAxNTguMDUgMTMuNCAxNjMuOSAxNi4yNSAxNzAuMyAxOC40IDE3NS4wNSAyMi4yIDE4MS43NSAzOC44IDIxMS4xNSA2Mi45IDIzNi41CkwgNjcuNzUgMjQxLjkKUSA2My41NSAyNDMgNjEuNiAyNDMuNSA1OC4xNSAyNDQuNCA1NS44NSAyNDQuNyA1MS40IDI0NS4zIDQxLjc1IDI0Ni4zIDMyLjU1IDI0Ny4yNSAyNy43IDI0Ny45IDcuMSAyNTAuOCAyLjQ1IDI3MC4xIDEuOCAyNzIuOCAxLjEgMjc2Ljg1IDAuNzUgMjc5LjEgMCAyODMuNjUKTCAwIDI5NC43NSAwLjQ1IDI5NS41ClEgMS45NSAzMDYuMiA5Ljk1IDMxNy4yNSAxNi4xNSAzMjUuOSAyNS4zIDMzNC4zNSAzMi4zIDM0MC44IDQzLjA1IDM0OC45IDQ0LjQ1IDM0OS45NSA1NS43IDM1Ny45CkwgNTYuMyAzNTcuMzUKUSA1NC45IDM1NC43NSA1NC4xIDM1My41NSA0OC4zIDM0NC4zNSA0NS4zIDMzOS44IDM3Ljc1IDMyOC40IDQxLjM1IDMxNC4xNSA0OC4zNSAyODYuNTUgNzMuNDUgMjgwLjM1IDkwLjk1IDI3NiAxMTAuMyAyODMuMzUgMTE1LjIgMjg1LjI1IDEyNS4yNSAyODkuNyAxMTIuMTUgMjcyLjE1IDExMi4wNSAyNzIgMTAwLjIgMjU1LjY1IDkyLjI1IDI0My4yIDgyLjE1IDIyNy4yNSA3NS4xNSAyMTIuNzUgNzAuNDUgMjAzLjE1IDY5LjIgMTk2LjA1IDY4LjA1IDE4OS4xIDY5LjU1IDE4MS4wNSA3MC42IDE3NSA3My42IDE2Ni41NSA3Ni44NSAxNTcuMzUgODMuMDUgMTQ2LjcgODYgMTQxLjY1IDk0LjggMTI4LjEgMTA1LjE1IDExMi4xNSAxMTEuODUgMTAwLjMgMTE0LjU1IDk1LjUgMTE0LjMgOTAuODUgWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjI5Nzg5NzMzODg2NzE4NzUsIDAsIDAsIDAuMjk3ODk3MzM4ODY3MTg3NSwgMTMzLjY1LC0zKSAiPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMS4wNTc4NjEzMjgxMjUsIDAsIDAsIDEuMDU3ODYxMzI4MTI1LCAtNzIuMiwxNC42KSAiPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC44NDgyOTcxMTkxNDA2MjUsIDAsIDAsIDAuODQ4Mjk3MTE5MTQwNjI1LCAxLjA1LDEuMjUpICI+Cjx1c2UgeGxpbms6aHJlZj0iI0R1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZV9jb3B5XzNfNl9MYXllcjNfMF9GSUxMIi8+CjwvZz4KPC9nPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-OOOX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMjE2LjU1IDYuNApRIDIxNi4zIDYuMSAyMTYgNS44IDIxNC4xIDQuMiAyMTMuNyAxLjUgMjExLjYgMy4wNSAyMTEuNDUgNgpMIDIxMS40NSA3MC41IDIxMS4yNSA3MC41NQpRIDIxMC41IDcwLjMgMjEwLjIgNzAuMTUgMjA1LjMgNjcuOCAyMDAuNiA2OC4yIDE5My45IDY4Ljc1IDE4OC45IDcxLjcgMTg0LjcgNzQuMyAxODIuMSA3Ny4yIDE3OS4xIDgwLjYgMTc4IDg0Ljg1IDE3Ny4yIDg3Ljg1IDE3OC41IDkxLjEgMTc5LjggOTQuMzUgMTgyLjQgOTYgMTg1LjYgOTcuOSAxODkuMiA5OC40IDE5Mi41IDk4Ljc1IDE5Ni40IDk3Ljk1IDIwNS4xIDk2LjIgMjExLjQgODkuODUgMjE2IDg1LjEgMjE2IDc5LjMKTCAyMTYuMDUgNDIuMzUKUSAyMTYuOTUgNDMuMjUgMjE4LjEgNDQuMzUgMjE5LjggNDYuMDUgMjIxLjcgNDggMjIzLjYgNDkuOTUgMjI1LjE1IDUzLjc1IDIyNi42NSA1Ny41NSAyMjYuNjUgNTkuODUgMjI2LjY1IDYyLjEgMjI2LjI1IDYzLjg1IDIyNS44NSA2NS42IDIyNS4xNSA2Ny41NSAyMjQuNzUgNjguNjUgMjIzLjkgNzAuODUgMjI2Ljc1IDY3LjMgMjI4LjIgNjMuMzUgMjMwIDU4LjM1IDIyOS4zIDUzLjUgMjI4LjU1IDQ4LjYgMjI0LjggNDMuMDUgMjIxLjMgMzcuOSAyMTYuMDUgMzIuMzUKTCAyMTYuMDUgMjIuNQpRIDIxNi4zIDIyLjc1IDIxNi41NSAyMyAyMTguMyAyNC44IDIyMC43NSAyNy4xNSAyMjMuNTUgMjkuOSAyMjYuNyAzMy4xNSAyMjkuODUgMzYuMzUgMjMyLjM1IDQyLjY1IDIzNC44NSA0OC45IDIzNC44NSA1Mi42NSAyMzQuOCA1Ni40IDIzNC4yIDU5LjMgMjMzLjU1IDYyLjE1IDIzMi4zNSA2NS4zNSAyMzEuNyA2Ny4xNSAyMzAuMyA3MC44IDIzNSA2NSAyMzcuNCA1OC40NSAyNDAuNCA1MC4yIDIzOS4yIDQyLjIgMjM3Ljk1IDM0LjE1IDIzMS43NSAyNSAyMjUuNzUgMTYuMDUgMjE2LjU1IDYuNCBaIi8+CjwvZz4KCjxnIGlkPSJEdXBsaWNhdGVfSXRlbXNfRm9sZGVyX05vdGVzXzgzX0xheWVyMF8wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDI2IDE2Ni44NQpRIDIyLjY1IDE2Ni43NSAyMC41IDE2OCAxOC4xNSAxNjkuMjUgMTUuNzUgMTcyLjE1IDE0LjYgMTczLjYgMTEuOSAxNzcuNTUgMTAuMiAxODAuMSA2LjI1IDE4Ni44IDMuNzUgMTkxLjEgMS44NSAxOTQgMS4wNSAxOTUuMSAwLjQgMTk2IC01LjggMjA0LjM1IC0xNC4yIDIwOC40NSAtMjIuNDUgMjEyLjMgLTMxLjc1IDIxMS44NSAtMzEuMjUgMjAxLjUgLTMwLjkgMTk2LjQ1IC0zMC42NSAxODcuNyAtMzEuNyAxODIuMDUgLTM0Ljc1IDE2Ni42NSAtNDcuNzUgMTU2LjkgLTYwLjM1IDE0Ny40IC03NiAxNDguMSAtOTIuMDUgMTQ4LjcgLTEwMy43NSAxNTkuNSAtMTE1LjQ1IDE3MC4xIC0xMTguMSAxODYuNSAtMTIwLjUgMjAxLjUgLTExMi41IDIxNC44NSAtMTA0LjQgMjI4LjIgLTg5LjY1IDIzMy45IC02NS43IDI0My4yIC0zNy4xNSAyMzkuOSAtMjguMyAyMzguOSAtOS40NSAyMzYuMiAtOS40IDIzNi4xNSAtOS4zNSAyMzYuMTUgLTEwLjQgMjQxLjEgLTEyLjMgMjUwLjQ1IC0xMy44NSAyNTguNiAtMTUuMiAyNjMuOTUgLTE2LjggMjcwLjA1IC0yMy40NSAyOTUuMzUgLTI3LjE1IDI5OC43IC0zMS40NSAzMDAuOCAtMzguNTUgMzA0LjE1IC00Ni41NSAzMDMuNzUgLTQ2LjE1IDI5NC45IC00NS44NSAyOTAuNiAtNDUuNjUgMjgzLjA1IC00Ni41IDI3OC4yIC00OS4xNSAyNjQuOTUgLTYwLjI1IDI1Ni42IC03MS4xNSAyNDguNCAtODQuNSAyNDkuMDUgLTk4LjM1IDI0OS41NSAtMTA4LjMgMjU4LjggLTExOC40IDI2Ny45NSAtMTIwLjY1IDI4MS45NSAtMTIyLjc1IDI5NC44NSAtMTE1LjkgMzA2LjM1IC0xMDguOSAzMTcuOCAtOTYuMjUgMzIyLjcgLTc1LjcgMzMwLjYgLTUxLjE1IDMyNy44IC00NC41IDMyNy4wNSAtMzEuNDUgMzI1LjI1IC0zNy43NSAzNDkuMjUgLTQxLjcgMzY1LjcgLTQzLjQgMzcyLjMgLTQ0LjEgMzgxLjQ1IC00NC4yIDM4My4zNSAtNDQuOTUgMzk3LjU1IC00NS4yIDQwMS40IC00Mi43NSA0MDMuNzUgLTQwLjU1IDQwNS44NSAtMzYuMTUgNDA2LjIgLTI3Ljc1IDQwNy4wNSAtMjUuMDUgMzk5LjQgLTIzLjQgMzk0Ljg1IC0yMi41IDM5MS44IC03LjQgMzM2Ljc1IDAuMDUgMzA5LjEgMTMuMTUgMjYxLjEgMjIuNDUgMjI2LjMgMjguMjUgMjA0LjYgMzQuMTUgMTc3LjEgMzQuNjUgMTc0Ljg1IDMzLjg1IDE3MS44NSAzMi45IDE2OC43NSAzMS40IDE2OCAyOS4yIDE2Ni44IDI2IDE2Ni44NSBaIi8+CjwvZz4KCjxnIGlkPSJEdXBsaWNhdGVfSXRlbXNfRm9sZGVyX05vdGVzXzc0X0xheWVyMF8wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDUyLjIgLTMyLjc1ClEgMjUuNzUgLTMyLjIgNi4yIC0xNS4wNSAtMTMuMyAyIC0xOC4yNSAyOC44IC0yMi43IDUzLjM1IC0xMCA3NS41NSAyLjcgOTcuNyAyNi44NSAxMDcuNiA2NS43IDEyMy42NSAxMTIuNyAxMTkuMiAxMjcuMyAxMTcuOCAxNTguNCAxMTQgMTU2LjYgMTIyLjA1IDE1My4yNSAxMzcuMyAxNTAuMzUgMTUwLjYgMTQ3Ljg1IDE1OS40NSAxNDQuMSAxNzIuODUgMTI0LjA1IDI0Mi4zNSAxMDkuNSAyOTIuOSAxMDAuOSAzMjUuNCA5Ny45NSAzMzYuMyA5Ni40NSAzNTEuMiA5Ni4xNSAzNTQuMjUgOTQuNSAzNzcuNTUgOTQgMzgzLjkgOTcuOSAzODcuNyAxMDEuNiAzOTEuMyAxMDguNSAzOTIuMTUgMTIyLjM1IDM5My44IDEyNy4xIDM4MS4yIDEzMC4wNSAzNzMuOCAxMzEuNSAzNjguOTUgMTU4LjE1IDI3OSAxNzEuNCAyMzQgMTk0LjUgMTU1LjcgMjExIDk5IDIyMS4zNSA2My43NSAyMzEuOSAxOC42NSAyMzIuNyAxNSAyMzEuNDUgMTAuMDUgMjMwLjA1IDQuOSAyMjcuNjUgMy41NSAyMjQuMSAxLjUgMjE4Ljc1IDEuNDUgMjEzLjM1IDEuMyAyMDkuNzUgMy4yIDIwNS44NSA1LjI1IDIwMS44NSA5LjkgMTk5LjkgMTIuMyAxOTUuMyAxOC42NSAxOTIuNDUgMjIuNyAxODUuNzUgMzMuNyAxNzkuODUgNDMuMzUgMTc1LjggNDguNSAxNjUuMzUgNjEuOTUgMTUxLjQ1IDY4LjM1IDEzNy44NSA3NC41IDEyMi40NSA3My4zNSAxMjMuOCA1Ni40IDEyNC4zNSA0OC4yIDEyNS4zIDMzLjggMTIzLjY1IDI0LjU1IDExOS4xNSAtMC44NSA5OC4zIC0xNy4yIDc3Ljg1IC0zMy4zIDUyLjIgLTMyLjc1IFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjI5Nzg5NzMzODg2NzE4NzUsIDAsIDAsIDAuMjk3ODk3MzM4ODY3MTg3NSwgMTYwLjk1LC0zMC44NSkgIj4KPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc184M19MYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDAuMjk3ODk3MzM4ODY3MTg3NSwgMCwgMCwgMC4yOTc4OTczMzg4NjcxODc1LCA3Mi40NSwtMzAuODUpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjYwOTQ5NzA3MDMxMjUsIDAsIDAsIDAuNjA5NDk3MDcwMzEyNSwgLTEwMy45NSwxNjIuMSkgIj4KPHVzZSB4bGluazpocmVmPSIjRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc183NF9MYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9nPgo8L3N2Zz4K","Wordrhythms-OOX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE4MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTgwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTc3LjcgNDAuMgpRIDE3Ni40NSAzMi4xNSAxNzAuMjUgMjMgMTY0LjA1IDEzLjggMTU0LjUgMy44IDE1Mi42IDIuMiAxNTIuMiAtMC41IDE1MC4xIDEuMDUgMTQ5Ljk1IDQKTCAxNDkuOTUgNjguNSAxNDkuNzUgNjguNTUKUSAxNDkgNjguMyAxNDguNyA2OC4xNSAxNDMuOCA2NS44IDEzOS4xIDY2LjIgMTMyLjQgNjYuNzUgMTI3LjQgNjkuNyAxMjMuMiA3Mi4zIDEyMC42IDc1LjIgMTE3LjYgNzguNiAxMTYuNSA4Mi44NSAxMTUuNyA4NS44NSAxMTcgODkuMSAxMTguMyA5Mi4zNSAxMjAuOSA5NCAxMjQuMSA5NS45IDEyNy43IDk2LjQgMTMxIDk2Ljc1IDEzNC45IDk1Ljk1IDE0My42IDk0LjIgMTQ5LjkgODcuODUgMTU0LjUgODMuMSAxNTQuNSA3Ny4zCkwgMTU0LjU1IDIwLjUKUSAxNTYuNDUgMjIuNDUgMTU5LjI1IDI1LjE1IDE2Mi4wNSAyNy45IDE2NS4yIDMxLjE1IDE2OC4zNSAzNC4zNSAxNzAuODUgNDAuNjUgMTczLjM1IDQ2LjkgMTczLjM1IDUwLjY1IDE3My4zIDU0LjQgMTcyLjcgNTcuMyAxNzIuMDUgNjAuMTUgMTcwLjg1IDYzLjM1IDE3MC4yIDY1LjE1IDE2OC44IDY4LjggMTczLjUgNjMgMTc1LjkgNTYuNDUgMTc4LjkgNDguMiAxNzcuNyA0MC4yIFoiLz4KPC9nPgoKPGcgaWQ9IkR1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZV9jb3B5XzNfNl9MYXllcjNfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSAxMTQuMyA5MC44NQpRIDExNC4xIDg1LjkgMTEwLjYgODEuNTUgOTcuMSA2My45NSA4OS45IDU1LjU1IDgwLjg1IDQ1LjEgNjcuMTUgMjkuNTUKTCA0MS4xNSAwClEgNDIuNzUgNi40IDQ1LjU1IDEzLjIgNTIuMSAyOS4zIDU0Ljg1IDQwLjggNTguNDUgNTYuMSA1Ny4yNSA2OS44NSA1Ni45NSA3My44IDU2IDc1LjQ1IDQzLjEgOTguNTUgMzYuMjUgMTA5Ljg1IDI4Ljk1IDEyMiAxMy43NSAxNDUuOSAxMC42IDE1MS4xIDEyLjEgMTU4LjA1IDEzLjQgMTYzLjkgMTYuMjUgMTcwLjMgMTguNCAxNzUuMDUgMjIuMiAxODEuNzUgMzguOCAyMTEuMTUgNjIuOSAyMzYuNQpMIDY3Ljc1IDI0MS45ClEgNjMuNTUgMjQzIDYxLjYgMjQzLjUgNTguMTUgMjQ0LjQgNTUuODUgMjQ0LjcgNTEuNCAyNDUuMyA0MS43NSAyNDYuMyAzMi41NSAyNDcuMjUgMjcuNyAyNDcuOSA3LjEgMjUwLjggMi40NSAyNzAuMSAxLjggMjcyLjggMS4xIDI3Ni44NSAwLjc1IDI3OS4xIDAgMjgzLjY1CkwgMCAyOTQuNzUgMC40NSAyOTUuNQpRIDEuOTUgMzA2LjIgOS45NSAzMTcuMjUgMTYuMTUgMzI1LjkgMjUuMyAzMzQuMzUgMzIuMyAzNDAuOCA0My4wNSAzNDguOSA0NC40NSAzNDkuOTUgNTUuNyAzNTcuOQpMIDU2LjMgMzU3LjM1ClEgNTQuOSAzNTQuNzUgNTQuMSAzNTMuNTUgNDguMyAzNDQuMzUgNDUuMyAzMzkuOCAzNy43NSAzMjguNCA0MS4zNSAzMTQuMTUgNDguMzUgMjg2LjU1IDczLjQ1IDI4MC4zNSA5MC45NSAyNzYgMTEwLjMgMjgzLjM1IDExNS4yIDI4NS4yNSAxMjUuMjUgMjg5LjcgMTEyLjE1IDI3Mi4xNSAxMTIuMDUgMjcyIDEwMC4yIDI1NS42NSA5Mi4yNSAyNDMuMiA4Mi4xNSAyMjcuMjUgNzUuMTUgMjEyLjc1IDcwLjQ1IDIwMy4xNSA2OS4yIDE5Ni4wNSA2OC4wNSAxODkuMSA2OS41NSAxODEuMDUgNzAuNiAxNzUgNzMuNiAxNjYuNTUgNzYuODUgMTU3LjM1IDgzLjA1IDE0Ni43IDg2IDE0MS42NSA5NC44IDEyOC4xIDEwNS4xNSAxMTIuMTUgMTExLjg1IDEwMC4zIDExNC41NSA5NS41IDExNC4zIDkwLjg1IFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjI5Nzg5NzMzODg2NzE4NzUsIDAsIDAsIDAuMjk3ODk3MzM4ODY3MTg3NSwgNTkuNjUsLTMpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLjA1Nzg2MTMyODEyNSwgMCwgMCwgMS4wNTc4NjEzMjgxMjUsIC03Mi4yLDE0LjYpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjg0ODI5NzExOTE0MDYyNSwgMCwgMCwgMC44NDgyOTcxMTkxNDA2MjUsIDEuMDUsMS4yNSkgIj4KPHVzZSB4bGluazpocmVmPSIjRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3RlX2NvcHlfM182X0xheWVyM18wX0ZJTEwiLz4KPC9nPgo8L2c+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-OOXO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMjEyLjIgNDAuMgpRIDIxMC45NSAzMi4xNSAyMDQuNzUgMjMgMTk4LjU1IDEzLjggMTg5IDMuOCAxODcuMSAyLjIgMTg2LjcgLTAuNSAxODQuNiAxLjA1IDE4NC40NSA0CkwgMTg0LjQ1IDY4LjUgMTg0LjI1IDY4LjU1ClEgMTgzLjUgNjguMyAxODMuMiA2OC4xNSAxNzguMyA2NS44IDE3My42IDY2LjIgMTY2LjkgNjYuNzUgMTYxLjkgNjkuNyAxNTguNzUgNzEuNjUgMTU2LjUgNzMuOCAxNTUuNzUgNzQuNSAxNTUuMSA3NS4yIDE1Mi4xIDc4LjYgMTUxIDgyLjg1IDE1MC4yIDg1Ljg1IDE1MS41IDg5LjEgMTUyLjggOTIuMzUgMTU1LjQgOTQgMTU1Ljk1IDk0LjMgMTU2LjUgOTQuNiAxNTkuMiA5NiAxNjIuMiA5Ni40IDE2NS41IDk2Ljc1IDE2OS40IDk1Ljk1IDE3OC4xIDk0LjIgMTg0LjQgODcuODUgMTg5IDgzLjEgMTg5IDc3LjMKTCAxODkuMDUgMjAuNQpRIDE5MC45NSAyMi40NSAxOTMuNzUgMjUuMTUgMTk2LjU1IDI3LjkgMTk5LjcgMzEuMTUgMjAyLjg1IDM0LjM1IDIwNS4zNSA0MC42NSAyMDcuODUgNDYuOSAyMDcuODUgNTAuNjUgMjA3LjggNTQuNCAyMDcuMiA1Ny4zIDIwNi41NSA2MC4xNSAyMDUuMzUgNjMuMzUgMjA0LjcgNjUuMTUgMjAzLjMgNjguOCAyMDggNjMgMjEwLjQgNTYuNDUgMjEzLjQgNDguMiAyMTIuMiA0MC4yIFoiLz4KPC9nPgoKPGcgaWQ9IkR1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZXNfNzRfTGF5ZXIwXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gNTIuMiAtMzIuNzUKUSAyNS43NSAtMzIuMiA2LjIgLTE1LjA1IC0xMy4zIDIgLTE4LjI1IDI4LjggLTIyLjcgNTMuMzUgLTEwIDc1LjU1IDIuNyA5Ny43IDI2Ljg1IDEwNy42IDY1LjcgMTIzLjY1IDExMi43IDExOS4yIDEyNy4zIDExNy44IDE1OC40IDExNCAxNTYuNiAxMjIuMDUgMTUzLjI1IDEzNy4zIDE1MC4zNSAxNTAuNiAxNDcuODUgMTU5LjQ1IDE0NC4xIDE3Mi44NSAxMjQuMDUgMjQyLjM1IDEwOS41IDI5Mi45IDEwMC45IDMyNS40IDk3Ljk1IDMzNi4zIDk2LjQ1IDM1MS4yIDk2LjE1IDM1NC4yNSA5NC41IDM3Ny41NSA5NCAzODMuOSA5Ny45IDM4Ny43IDEwMS42IDM5MS4zIDEwOC41IDM5Mi4xNSAxMjIuMzUgMzkzLjggMTI3LjEgMzgxLjIgMTMwLjA1IDM3My44IDEzMS41IDM2OC45NSAxNTguMTUgMjc5IDE3MS40IDIzNCAxOTQuNSAxNTUuNyAyMTEgOTkgMjIxLjM1IDYzLjc1IDIzMS45IDE4LjY1IDIzMi43IDE1IDIzMS40NSAxMC4wNSAyMzAuMDUgNC45IDIyNy42NSAzLjU1IDIyNC4xIDEuNSAyMTguNzUgMS40NSAyMTMuMzUgMS4zIDIwOS43NSAzLjIgMjA1Ljg1IDUuMjUgMjAxLjg1IDkuOSAxOTkuOSAxMi4zIDE5NS4zIDE4LjY1IDE5Mi40NSAyMi43IDE4NS43NSAzMy43IDE3OS44NSA0My4zNSAxNzUuOCA0OC41IDE2NS4zNSA2MS45NSAxNTEuNDUgNjguMzUgMTM3Ljg1IDc0LjUgMTIyLjQ1IDczLjM1IDEyMy44IDU2LjQgMTI0LjM1IDQ4LjIgMTI1LjMgMzMuOCAxMjMuNjUgMjQuNTUgMTE5LjE1IC0wLjg1IDk4LjMgLTE3LjIgNzcuODUgLTMzLjMgNTIuMiAtMzIuNzUgWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDAuMjk3ODk3MzM4ODY3MTg3NSwgMCwgMCwgMC4yOTc4OTczMzg4NjcxODc1LCA3My45NSwtMzAuODUpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjYwOTQ5NzA3MDMxMjUsIDAsIDAsIDAuNjA5NDk3MDcwMzEyNSwgLTEwMy45NSwxNjIuMSkgIj4KPHVzZSB4bGluazpocmVmPSIjRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc183NF9MYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9nPgo8L3N2Zz4K","Wordrhythms-OOXX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMjMxIDMuOApMIDIyNi40IDMuOCAyMjYuNCA2OC4zIDIyNi4yIDY4LjM1ClEgMjI1LjQ1IDY4LjEgMjI1LjE1IDY3Ljk1IDIyMC4yNSA2NS42IDIxNS41NSA2NiAyMDguODUgNjYuNTUgMjAzLjg1IDY5LjUgMTk5LjY1IDcyLjEgMTk3LjA1IDc1IDE5NC4wNSA3OC40IDE5Mi45NSA4Mi42NSAxOTIuMTUgODUuNjUgMTkzLjQ1IDg4LjkgMTk0Ljc1IDkyLjE1IDE5Ny4zNSA5My44IDIwMC41NSA5NS43IDIwNC4xNSA5Ni4yIDIwNy40NSA5Ni41NSAyMTEuMzUgOTUuNzUgMjIwLjA1IDk0IDIyNi4zNSA4Ny42NSAyMzAuOTUgODIuOSAyMzAuOTUgNzcuMQpMIDIzMSAzLjgKTSAxNjQuNyA3Ny4xCkwgMTY0Ljc1IDMuOCAxNjAuMTUgMy44IDE2MC4xNSA2OC4zIDE1OS45NSA2OC4zNQpRIDE1OS4yIDY4LjEgMTU4LjkgNjcuOTUgMTU0IDY1LjYgMTQ5LjMgNjYgMTQyLjYgNjYuNTUgMTM3LjYgNjkuNSAxMzMuNCA3Mi4xIDEzMC44IDc1IDEyNy44IDc4LjQgMTI2LjcgODIuNjUgMTI1LjkgODUuNjUgMTI3LjIgODguOSAxMjguNSA5Mi4xNSAxMzEuMSA5My44IDEzNC4zIDk1LjcgMTM3LjkgOTYuMiAxNDEuMiA5Ni41NSAxNDUuMSA5NS43NSAxNTMuOCA5NCAxNjAuMSA4Ny42NSAxNjQuNyA4Mi45IDE2NC43IDc3LjEgWiIvPgo8L2c+Cgo8ZyBpZD0iRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc183NF9MYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSA1Mi4yIC0zMi43NQpRIDI1Ljc1IC0zMi4yIDYuMiAtMTUuMDUgLTEzLjMgMiAtMTguMjUgMjguOCAtMjIuNyA1My4zNSAtMTAgNzUuNTUgMi43IDk3LjcgMjYuODUgMTA3LjYgNjUuNyAxMjMuNjUgMTEyLjcgMTE5LjIgMTI3LjMgMTE3LjggMTU4LjQgMTE0IDE1Ni42IDEyMi4wNSAxNTMuMjUgMTM3LjMgMTUwLjM1IDE1MC42IDE0Ny44NSAxNTkuNDUgMTQ0LjEgMTcyLjg1IDEyNC4wNSAyNDIuMzUgMTA5LjUgMjkyLjkgMTAwLjkgMzI1LjQgOTcuOTUgMzM2LjMgOTYuNDUgMzUxLjIgOTYuMTUgMzU0LjI1IDk0LjUgMzc3LjU1IDk0IDM4My45IDk3LjkgMzg3LjcgMTAxLjYgMzkxLjMgMTA4LjUgMzkyLjE1IDEyMi4zNSAzOTMuOCAxMjcuMSAzODEuMiAxMzAuMDUgMzczLjggMTMxLjUgMzY4Ljk1IDE1OC4xNSAyNzkgMTcxLjQgMjM0IDE5NC41IDE1NS43IDIxMSA5OSAyMjEuMzUgNjMuNzUgMjMxLjkgMTguNjUgMjMyLjcgMTUgMjMxLjQ1IDEwLjA1IDIzMC4wNSA0LjkgMjI3LjY1IDMuNTUgMjI0LjEgMS41IDIxOC43NSAxLjQ1IDIxMy4zNSAxLjMgMjA5Ljc1IDMuMiAyMDUuODUgNS4yNSAyMDEuODUgOS45IDE5OS45IDEyLjMgMTk1LjMgMTguNjUgMTkyLjQ1IDIyLjcgMTg1Ljc1IDMzLjcgMTc5Ljg1IDQzLjM1IDE3NS44IDQ4LjUgMTY1LjM1IDYxLjk1IDE1MS40NSA2OC4zNSAxMzcuODUgNzQuNSAxMjIuNDUgNzMuMzUgMTIzLjggNTYuNCAxMjQuMzUgNDguMiAxMjUuMyAzMy44IDEyMy42NSAyNC41NSAxMTkuMTUgLTAuODUgOTguMyAtMTcuMiA3Ny44NSAtMzMuMyA1Mi4yIC0zMi43NSBaIi8+CjwvZz4KCjxnIGlkPSJMYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSAyMzEuMDUgMjIuNQpMIDIzMS4wNSAzLjMgMTYwLjI1IDMuMyAxNjAuMjUgMjIuNSAyMzEuMDUgMjIuNQpNIDIzMS4wNSA0OApMIDIzMS4wNSAyOC44IDE2MC4yNSAyOC44IDE2MC4yNSA0OCAyMzEuMDUgNDggWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDAuMjk3ODk3MzM4ODY3MTg3NSwgMCwgMCwgMC4yOTc4OTczMzg4NjcxODc1LCA2OC45NSwtMzAuODUpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjYwOTQ5NzA3MDMxMjUsIDAsIDAsIDAuNjA5NDk3MDcwMzEyNSwgLTEwMy45NSwxNjIuMSkgIj4KPHVzZSB4bGluazpocmVmPSIjRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc183NF9MYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIwXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-OXO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE4MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTgwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTA1IDMuOApMIDEwMC40IDMuOCAxMDAuNCA2OC4zIDEwMC4yIDY4LjM1ClEgOTkuNDUgNjguMSA5OS4xNSA2Ny45NSA5NC4yNSA2NS42IDg5LjU1IDY2IDgyLjg1IDY2LjU1IDc3Ljg1IDY5LjUgNzMuNjUgNzIuMSA3MS4wNSA3NSA2OC4wNSA3OC40IDY2Ljk1IDgyLjY1IDY2LjE1IDg1LjY1IDY3LjQ1IDg4LjkgNjguNzUgOTIuMTUgNzEuMzUgOTMuOCA3NC41NSA5NS43IDc4LjE1IDk2LjIgODEuNDUgOTYuNTUgODUuMzUgOTUuNzUgOTQuMDUgOTQgMTAwLjM1IDg3LjY1IDEwNC45NSA4Mi45IDEwNC45NSA3Ny4xCkwgMTA1IDMuOCBaIi8+CjwvZz4KCjxnIGlkPSJEdXBsaWNhdGVfSXRlbXNfRm9sZGVyX05vdGVzXzc0X0xheWVyMF8wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDUyLjIgLTMyLjc1ClEgMjUuNzUgLTMyLjIgNi4yIC0xNS4wNSAtMTMuMyAyIC0xOC4yNSAyOC44IC0yMi43IDUzLjM1IC0xMCA3NS41NSAyLjcgOTcuNyAyNi44NSAxMDcuNiA2NS43IDEyMy42NSAxMTIuNyAxMTkuMiAxMjcuMyAxMTcuOCAxNTguNCAxMTQgMTU2LjYgMTIyLjA1IDE1My4yNSAxMzcuMyAxNTAuMzUgMTUwLjYgMTQ3Ljg1IDE1OS40NSAxNDQuMSAxNzIuODUgMTI0LjA1IDI0Mi4zNSAxMDkuNSAyOTIuOSAxMDAuOSAzMjUuNCA5Ny45NSAzMzYuMyA5Ni40NSAzNTEuMiA5Ni4xNSAzNTQuMjUgOTQuNSAzNzcuNTUgOTQgMzgzLjkgOTcuOSAzODcuNyAxMDEuNiAzOTEuMyAxMDguNSAzOTIuMTUgMTIyLjM1IDM5My44IDEyNy4xIDM4MS4yIDEzMC4wNSAzNzMuOCAxMzEuNSAzNjguOTUgMTU4LjE1IDI3OSAxNzEuNCAyMzQgMTk0LjUgMTU1LjcgMjExIDk5IDIyMS4zNSA2My43NSAyMzEuOSAxOC42NSAyMzIuNyAxNSAyMzEuNDUgMTAuMDUgMjMwLjA1IDQuOSAyMjcuNjUgMy41NSAyMjQuMSAxLjUgMjE4Ljc1IDEuNDUgMjEzLjM1IDEuMyAyMDkuNzUgMy4yIDIwNS44NSA1LjI1IDIwMS44NSA5LjkgMTk5LjkgMTIuMyAxOTUuMyAxOC42NSAxOTIuNDUgMjIuNyAxODUuNzUgMzMuNyAxNzkuODUgNDMuMzUgMTc1LjggNDguNSAxNjUuMzUgNjEuOTUgMTUxLjQ1IDY4LjM1IDEzNy44NSA3NC41IDEyMi40NSA3My4zNSAxMjMuOCA1Ni40IDEyNC4zNSA0OC4yIDEyNS4zIDMzLjggMTIzLjY1IDI0LjU1IDExOS4xNSAtMC44NSA5OC4zIC0xNy4yIDc3Ljg1IC0zMy4zIDUyLjIgLTMyLjc1IFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjI5Nzg5NzMzODg2NzE4NzUsIDAsIDAsIDAuMjk3ODk3MzM4ODY3MTg3NSwgNDMuNDUsLTMwLjg1KSAiPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC42MDk0OTcwNzAzMTI1LCAwLCAwLCAwLjYwOTQ5NzA3MDMxMjUsIC0xMDMuOTUsMTYyLjEpICI+Cjx1c2UgeGxpbms6aHJlZj0iI0R1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZXNfNzRfTGF5ZXIwXzBfRklMTCIvPgo8L2c+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-OXOO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTE5Ljg1IDczLjcKUSAxMTguMiA3MiAxMTUuOCA3MiAxMTMuNCA3MiAxMTEuNyA3My43IDExMCA3NS40IDExMCA3Ny44IDExMCA4MC4yIDExMS43IDgxLjg1IDExMy40IDgzLjYgMTE1LjggODMuNiAxMTguMiA4My42IDExOS44NSA4MS44NSAxMjEuNiA4MC4yIDEyMS42IDc3LjggMTIxLjYgNzUuNCAxMTkuODUgNzMuNwpNIDEwOS4yNSAyNS4xNQpRIDExMi4wNSAyNy45IDExNS4yIDMxLjE1IDExOC4zNSAzNC4zNSAxMjAuODUgNDAuNjUgMTIzLjM1IDQ2LjkgMTIzLjM1IDUwLjY1IDEyMy4zIDU0LjQgMTIyLjcgNTcuMyAxMjIuMDUgNjAuMTUgMTIwLjg1IDYzLjM1IDEyMC4yIDY1LjE1IDExOC44IDY4LjggMTIzLjUgNjMgMTI1LjkgNTYuNDUgMTI4LjkgNDguMiAxMjcuNyA0MC4yIDEyNi40NSAzMi4xNSAxMjAuMjUgMjMgMTE0LjA1IDEzLjggMTA0LjUgMy44IDEwMi42IDIuMiAxMDIuMiAtMC41IDEwMC4xIDEuMDUgOTkuOTUgNApMIDk5Ljk1IDY4LjUgOTkuNzUgNjguNTUKUSA5OSA2OC4zIDk4LjcgNjguMTUgOTMuOCA2NS44IDg5LjEgNjYuMiA4Mi40IDY2Ljc1IDc3LjQgNjkuNyA3NC4yNSA3MS42NSA3MiA3My44IDcxLjI1IDc0LjUgNzAuNiA3NS4yIDY3LjYgNzguNiA2Ni41IDgyLjg1IDY1LjcgODUuODUgNjcgODkuMSA2OC4zIDkyLjM1IDcwLjkgOTQgNzEuNDUgOTQuMyA3MiA5NC42IDc0LjcgOTYgNzcuNyA5Ni40IDgxIDk2Ljc1IDg0LjkgOTUuOTUgOTMuNiA5NC4yIDk5LjkgODcuODUgMTA0LjUgODMuMSAxMDQuNSA3Ny4zCkwgMTA0LjU1IDIwLjUKUSAxMDYuNDUgMjIuNDUgMTA5LjI1IDI1LjE1IFoiLz4KPC9nPgoKPGcgaWQ9IkR1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZXNfODNfTGF5ZXIwXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMzEuNCAxNjgKUSAyOS4yIDE2Ni44IDI2IDE2Ni44NSAyMi42NSAxNjYuNzUgMjAuNSAxNjggMTguMTUgMTY5LjI1IDE1Ljc1IDE3Mi4xNSAxNC42IDE3My42IDExLjkgMTc3LjU1IDEwLjIgMTgwLjEgNi4yNSAxODYuOCAzLjc1IDE5MS4xIDEuODUgMTk0IDEuMDUgMTk1LjEgMC40IDE5NiAtNS44IDIwNC4zNSAtMTQuMiAyMDguNDUgLTIyLjQ1IDIxMi4zIC0zMS43NSAyMTEuODUgLTMxLjI1IDIwMS41IC0zMC45IDE5Ni40NSAtMzAuNjUgMTg3LjcgLTMxLjcgMTgyLjA1IC0zNC43NSAxNjYuNjUgLTQ3Ljc1IDE1Ni45IC02MC4zNSAxNDcuNCAtNzYgMTQ4LjEgLTkyLjA1IDE0OC43IC0xMDMuNzUgMTU5LjUgLTExNS40NSAxNzAuMSAtMTE4LjEgMTg2LjUgLTEyMC41IDIwMS41IC0xMTIuNSAyMTQuODUgLTEwNC40IDIyOC4yIC04OS42NSAyMzMuOSAtNjUuNyAyNDMuMiAtMzcuMTUgMjM5LjkgLTI4LjMgMjM4LjkgLTkuNDUgMjM2LjIgLTkuNCAyMzYuMTUgLTkuMzUgMjM2LjE1IC0xMC40IDI0MS4xIC0xMi4zIDI1MC40NSAtMTMuODUgMjU4LjYgLTE1LjIgMjYzLjk1IC0xNi44IDI3MC4wNSAtMjMuNDUgMjk1LjM1IC0yNy4xNSAyOTguNyAtMzEuNDUgMzAwLjggLTM4LjU1IDMwNC4xNSAtNDYuNTUgMzAzLjc1IC00Ni4xNSAyOTQuOSAtNDUuODUgMjkwLjYgLTQ1LjY1IDI4My4wNSAtNDYuNSAyNzguMiAtNDkuMTUgMjY0Ljk1IC02MC4yNSAyNTYuNiAtNzEuMTUgMjQ4LjQgLTg0LjUgMjQ5LjA1IC05OC4zNSAyNDkuNTUgLTEwOC4zIDI1OC44IC0xMTguNCAyNjcuOTUgLTEyMC42NSAyODEuOTUgLTEyMi43NSAyOTQuODUgLTExNS45IDMwNi4zNSAtMTA4LjkgMzE3LjggLTk2LjI1IDMyMi43IC03NS43IDMzMC42IC01MS4xNSAzMjcuOCAtNDQuNSAzMjcuMDUgLTMxLjQ1IDMyNS4yNSAtMzcuNzUgMzQ5LjI1IC00MS43IDM2NS43IC00My40IDM3Mi4zIC00NC4xIDM4MS40NSAtNDQuMiAzODMuMzUgLTQ0Ljk1IDM5Ny41NSAtNDUuMiA0MDEuNCAtNDIuNzUgNDAzLjc1IC00MC41NSA0MDUuODUgLTM2LjE1IDQwNi4yIC0yNy43NSA0MDcuMDUgLTI1LjA1IDM5OS40IC0yMy40IDM5NC44NSAtMjIuNSAzOTEuOCAtNy40IDMzNi43NSAwLjA1IDMwOS4xIDEzLjE1IDI2MS4xIDIyLjQ1IDIyNi4zIDI4LjI1IDIwNC42IDM0LjE1IDE3Ny4xIDM0LjY1IDE3NC44NSAzMy44NSAxNzEuODUgMzIuOSAxNjguNzUgMzEuNCAxNjggWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDAuMjk3ODk3MzM4ODY3MTg3NSwgMCwgMCwgMC4yOTc4OTczMzg4NjcxODc1LCA0OC45NSwtMzAuODUpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0R1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZXNfODNfTGF5ZXIwXzBfRklMTCIvPgo8L2c+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-OXOX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMjMzIDMuOApMIDIyOC40IDMuOCAyMjguNCA2OC4zIDIyOC4yIDY4LjM1ClEgMjI3LjQ1IDY4LjEgMjI3LjE1IDY3Ljk1IDIyMi4yNSA2NS42IDIxNy41NSA2NiAyMTAuODUgNjYuNTUgMjA1Ljg1IDY5LjUgMjAxLjY1IDcyLjEgMTk5LjA1IDc1IDE5Ni4wNSA3OC40IDE5NC45NSA4Mi42NSAxOTQuMTUgODUuNjUgMTk1LjQ1IDg4LjkgMTk2Ljc1IDkyLjE1IDE5OS4zNSA5My44IDIwMi41NSA5NS43IDIwNi4xNSA5Ni4yIDIwOS40NSA5Ni41NSAyMTMuMzUgOTUuNzUgMjIyLjA1IDk0IDIyOC4zNSA4Ny42NSAyMzIuOTUgODIuOSAyMzIuOTUgNzcuMQpMIDIzMyAzLjgKTSAxMDggMy44CkwgMTAzLjQgMy44IDEwMy40IDY4LjMgMTAzLjIgNjguMzUKUSAxMDIuNDUgNjguMSAxMDIuMTUgNjcuOTUgOTcuMjUgNjUuNiA5Mi41NSA2NiA4NS44NSA2Ni41NSA4MC44NSA2OS41IDc2LjY1IDcyLjEgNzQuMDUgNzUgNzIuNDU3MjI2NTYyNSA3Ni44MDUwNzgxMjUgNzEuNCA3OC44NSA3MC40NjYwMTU2MjUgODAuNjU2NDQ1MzEyNSA2OS45NSA4Mi42NSA2OS4xNSA4NS42NSA3MC40NSA4OC45IDcwLjg2MDM1MTU2MjUgODkuOTI1NTg1OTM3NSA3MS40IDkwLjggNzIuNTcwNTA3ODEyNSA5Mi42NzA3MDMxMjUgNzQuMzUgOTMuOCA3Ny41NSA5NS43IDgxLjE1IDk2LjIgODQuNDUgOTYuNTUgODguMzUgOTUuNzUgOTcuMDUgOTQgMTAzLjM1IDg3LjY1IDEwNy45NSA4Mi45IDEwNy45NSA3Ny4xCkwgMTA4IDMuOCBaIi8+CjwvZz4KCjxnIGlkPSJEdXBsaWNhdGVfSXRlbXNfRm9sZGVyX05vdGVzXzgzX0xheWVyMF8wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDI2IDE2Ni44NQpRIDIyLjY1IDE2Ni43NSAyMC41IDE2OCAxOC4xNSAxNjkuMjUgMTUuNzUgMTcyLjE1IDE0LjYgMTczLjYgMTEuOSAxNzcuNTUgMTAuMiAxODAuMSA2LjI1IDE4Ni44IDMuNzUgMTkxLjEgMS44NSAxOTQgMS4wNSAxOTUuMSAwLjQgMTk2IC01LjggMjA0LjM1IC0xNC4yIDIwOC40NSAtMjIuNDUgMjEyLjMgLTMxLjc1IDIxMS44NSAtMzEuMjUgMjAxLjUgLTMwLjkgMTk2LjQ1IC0zMC42NSAxODcuNyAtMzEuNyAxODIuMDUgLTM0Ljc1IDE2Ni42NSAtNDcuNzUgMTU2LjkgLTYwLjM1IDE0Ny40IC03NiAxNDguMSAtOTIuMDUgMTQ4LjcgLTEwMy43NSAxNTkuNSAtMTE1LjQ1IDE3MC4xIC0xMTguMSAxODYuNSAtMTIwLjUgMjAxLjUgLTExMi41IDIxNC44NSAtMTA0LjQgMjI4LjIgLTg5LjY1IDIzMy45IC02NS43IDI0My4yIC0zNy4xNSAyMzkuOSAtMjguMyAyMzguOSAtOS40NSAyMzYuMiAtOS40IDIzNi4xNSAtOS4zNSAyMzYuMTUgLTEwLjQgMjQxLjEgLTEyLjMgMjUwLjQ1IC0xMy44NSAyNTguNiAtMTUuMiAyNjMuOTUgLTE2LjggMjcwLjA1IC0yMy40NSAyOTUuMzUgLTI3LjE1IDI5OC43IC0zMS40NSAzMDAuOCAtMzguNTUgMzA0LjE1IC00Ni41NSAzMDMuNzUgLTQ2LjE1IDI5NC45IC00NS44NSAyOTAuNiAtNDUuNjUgMjgzLjA1IC00Ni41IDI3OC4yIC00OS4xNSAyNjQuOTUgLTYwLjI1IDI1Ni42IC03MS4xNSAyNDguNCAtODQuNSAyNDkuMDUgLTk4LjM1IDI0OS41NSAtMTA4LjMgMjU4LjggLTExOC40IDI2Ny45NSAtMTIwLjY1IDI4MS45NSAtMTIyLjc1IDI5NC44NSAtMTE1LjkgMzA2LjM1IC0xMDguOSAzMTcuOCAtOTYuMjUgMzIyLjcgLTc1LjcgMzMwLjYgLTUxLjE1IDMyNy44IC00NC41IDMyNy4wNSAtMzEuNDUgMzI1LjI1IC0zNy43NSAzNDkuMjUgLTQxLjcgMzY1LjcgLTQzLjQgMzcyLjMgLTQ0LjEgMzgxLjQ1IC00NC4yIDM4My4zNSAtNDQuOTUgMzk3LjU1IC00NS4yIDQwMS40IC00Mi43NSA0MDMuNzUgLTQwLjU1IDQwNS44NSAtMzYuMTUgNDA2LjIgLTI3Ljc1IDQwNy4wNSAtMjUuMDUgMzk5LjQgLTIzLjQgMzk0Ljg1IC0yMi41IDM5MS44IC03LjQgMzM2Ljc1IDAuMDUgMzA5LjEgMTMuMTUgMjYxLjEgMjIuNDUgMjI2LjMgMjguMjUgMjA0LjYgMzQuMTUgMTc3LjEgMzQuNjUgMTc0Ljg1IDMzLjg1IDE3MS44NSAzMi45IDE2OC43NSAzMS40IDE2OCAyOS4yIDE2Ni44IDI2IDE2Ni44NSBaIi8+CjwvZz4KCjxnIGlkPSJMYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSAyMjguNCAyMwpMIDIyOC40IDMuOCAxMDMuNCAzLjggMTAzLjQgMjMgMjI4LjQgMjMKTSAyMjguNiA0OApMIDIyOC42IDI4LjggMTg0LjU1IDI4LjggMTg0LjU1IDQ4IDIyOC42IDQ4IFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjI5Nzg5NzMzODg2NzE4NzUsIDAsIDAsIDAuMjk3ODk3MzM4ODY3MTg3NSwgNDguOTUsLTMwLjg1KSAiPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNEdXBsaWNhdGVfSXRlbXNfRm9sZGVyX05vdGVzXzgzX0xheWVyMF8wX0ZJTEwiLz4KPC9nPgo8L2c+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-OXX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE4MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTgwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTA1LjUgMy44CkwgMTAwLjkgMy44IDEwMC45IDY4LjMgMTAwLjcgNjguMzUKUSA5OS45NSA2OC4xIDk5LjY1IDY3Ljk1IDk0Ljc1IDY1LjYgOTAuMDUgNjYgODMuMzUgNjYuNTUgNzguMzUgNjkuNSA3NC4xNSA3Mi4xIDcxLjU1IDc1IDY4LjU1IDc4LjQgNjcuNDUgODIuNjUgNjYuNjUgODUuNjUgNjcuOTUgODguOSA2OS4yNSA5Mi4xNSA3MS44NSA5My44IDc1LjA1IDk1LjcgNzguNjUgOTYuMiA4MS45NSA5Ni41NSA4NS44NSA5NS43NSA5NC41NSA5NCAxMDAuODUgODcuNjUgMTA1LjQ1IDgyLjkgMTA1LjQ1IDc3LjEKTCAxMDUuNSAzLjgKTSAxNzIuNSAzLjgKTCAxNjcuOSAzLjggMTY3LjkgNjguMyAxNjcuNyA2OC4zNQpRIDE2Ni45NSA2OC4xIDE2Ni42NSA2Ny45NSAxNjEuNzUgNjUuNiAxNTcuMDUgNjYgMTUwLjM1IDY2LjU1IDE0NS4zNSA2OS41IDE0MS4xNSA3Mi4xIDEzOC41NSA3NSAxMzUuNTUgNzguNCAxMzQuNDUgODIuNjUgMTMzLjY1IDg1LjY1IDEzNC45NSA4OC45IDEzNi4yNSA5Mi4xNSAxMzguODUgOTMuOCAxNDIuMDUgOTUuNyAxNDUuNjUgOTYuMiAxNDguOTUgOTYuNTUgMTUyLjg1IDk1Ljc1IDE2MS41NSA5NCAxNjcuODUgODcuNjUgMTcyLjQ1IDgyLjkgMTcyLjQ1IDc3LjEKTCAxNzIuNSAzLjggWiIvPgo8L2c+Cgo8ZyBpZD0iRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc183NF9MYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSA1Mi4yIC0zMi43NQpRIDI1Ljc1IC0zMi4yIDYuMiAtMTUuMDUgLTEzLjMgMiAtMTguMjUgMjguOCAtMjIuNyA1My4zNSAtMTAgNzUuNTUgMi43IDk3LjcgMjYuODUgMTA3LjYgNjUuNyAxMjMuNjUgMTEyLjcgMTE5LjIgMTI3LjMgMTE3LjggMTU4LjQgMTE0IDE1Ni42IDEyMi4wNSAxNTMuMjUgMTM3LjMgMTUwLjM1IDE1MC42IDE0Ny44NSAxNTkuNDUgMTQ0LjEgMTcyLjg1IDEyNC4wNSAyNDIuMzUgMTA5LjUgMjkyLjkgMTAwLjkgMzI1LjQgOTcuOTUgMzM2LjMgOTYuNDUgMzUxLjIgOTYuMTUgMzU0LjI1IDk0LjUgMzc3LjU1IDk0IDM4My45IDk3LjkgMzg3LjcgMTAxLjYgMzkxLjMgMTA4LjUgMzkyLjE1IDEyMi4zNSAzOTMuOCAxMjcuMSAzODEuMiAxMzAuMDUgMzczLjggMTMxLjUgMzY4Ljk1IDE1OC4xNSAyNzkgMTcxLjQgMjM0IDE5NC41IDE1NS43IDIxMSA5OSAyMjEuMzUgNjMuNzUgMjMxLjkgMTguNjUgMjMyLjcgMTUgMjMxLjQ1IDEwLjA1IDIzMC4wNSA0LjkgMjI3LjY1IDMuNTUgMjI0LjEgMS41IDIxOC43NSAxLjQ1IDIxMy4zNSAxLjMgMjA5Ljc1IDMuMiAyMDUuODUgNS4yNSAyMDEuODUgOS45IDE5OS45IDEyLjMgMTk1LjMgMTguNjUgMTkyLjQ1IDIyLjcgMTg1Ljc1IDMzLjcgMTc5Ljg1IDQzLjM1IDE3NS44IDQ4LjUgMTY1LjM1IDYxLjk1IDE1MS40NSA2OC4zNSAxMzcuODUgNzQuNSAxMjIuNDUgNzMuMzUgMTIzLjggNTYuNCAxMjQuMzUgNDguMiAxMjUuMyAzMy44IDEyMy42NSAyNC41NSAxMTkuMTUgLTAuODUgOTguMyAtMTcuMiA3Ny44NSAtMzMuMyA1Mi4yIC0zMi43NSBaIi8+CjwvZz4KCjxnIGlkPSJMYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSAxNzIuNSAyNS41CkwgMTcyLjUgMy4zIDEwMC45IDMuMyAxMDAuOSAyNS41IDE3Mi41IDI1LjUgWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDAuMjk3ODk3MzM4ODY3MTg3NSwgMCwgMCwgMC4yOTc4OTczMzg4NjcxODc1LCA0NS45NSwtMzAuODUpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjYwOTQ5NzA3MDMxMjUsIDAsIDAsIDAuNjA5NDk3MDcwMzEyNSwgLTEwMy45NSwxNjIuMSkgIj4KPHVzZSB4bGluazpocmVmPSIjRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc183NF9MYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIwXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-OXXO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTA4IDMuOApMIDEwMy40IDMuOCAxMDMuNCA2OC4zIDEwMy4yIDY4LjM1ClEgMTAyLjQ1IDY4LjEgMTAyLjE1IDY3Ljk1IDk3LjI1IDY1LjYgOTIuNTUgNjYgODUuODUgNjYuNTUgODAuODUgNjkuNSA3Ni42NSA3Mi4xIDc0LjA1IDc1IDcxLjA1IDc4LjQgNjkuOTUgODIuNjUgNjkuMTUgODUuNjUgNzAuNDUgODguOSA3MS43NSA5Mi4xNSA3NC4zNSA5My44IDc3LjU1IDk1LjcgODEuMTUgOTYuMiA4NC40NSA5Ni41NSA4OC4zNSA5NS43NSA5Ny4wNSA5NCAxMDMuMzUgODcuNjUgMTA3Ljk1IDgyLjkgMTA3Ljk1IDc3LjEKTCAxMDggMy44Ck0gMTc1LjUgMy44CkwgMTcwLjkgMy44IDE3MC45IDY4LjMgMTcwLjcgNjguMzUKUSAxNjkuOTUgNjguMSAxNjkuNjUgNjcuOTUgMTY0Ljc1IDY1LjYgMTYwLjA1IDY2IDE1My4zNSA2Ni41NSAxNDguMzUgNjkuNSAxNDQuMTUgNzIuMSAxNDEuNTUgNzUgMTM4LjU1IDc4LjQgMTM3LjQ1IDgyLjY1IDEzNi42NSA4NS42NSAxMzcuOTUgODguOSAxMzkuMjUgOTIuMTUgMTQxLjg1IDkzLjggMTQ1LjA1IDk1LjcgMTQ4LjY1IDk2LjIgMTUxLjk1IDk2LjU1IDE1NS44NSA5NS43NSAxNjQuNTUgOTQgMTcwLjg1IDg3LjY1IDE3NS40NSA4Mi45IDE3NS40NSA3Ny4xCkwgMTc1LjUgMy44IFoiLz4KPC9nPgoKPGcgaWQ9IkR1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZXNfODNfTGF5ZXIwXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMzEuNCAxNjgKUSAyOS4yIDE2Ni44IDI2IDE2Ni44NSAyMi42NSAxNjYuNzUgMjAuNSAxNjggMTguMTUgMTY5LjI1IDE1Ljc1IDE3Mi4xNSAxNC42IDE3My42IDExLjkgMTc3LjU1IDEwLjIgMTgwLjEgNi4yNSAxODYuOCAzLjc1IDE5MS4xIDEuODUgMTk0IDEuMDUgMTk1LjEgMC40IDE5NiAtNS44IDIwNC4zNSAtMTQuMiAyMDguNDUgLTIyLjQ1IDIxMi4zIC0zMS43NSAyMTEuODUgLTMxLjI1IDIwMS41IC0zMC45IDE5Ni40NSAtMzAuNjUgMTg3LjcgLTMxLjcgMTgyLjA1IC0zNC43NSAxNjYuNjUgLTQ3Ljc1IDE1Ni45IC02MC4zNSAxNDcuNCAtNzYgMTQ4LjEgLTkyLjA1IDE0OC43IC0xMDMuNzUgMTU5LjUgLTExNS40NSAxNzAuMSAtMTE4LjEgMTg2LjUgLTEyMC41IDIwMS41IC0xMTIuNSAyMTQuODUgLTEwNC40IDIyOC4yIC04OS42NSAyMzMuOSAtNjUuNyAyNDMuMiAtMzcuMTUgMjM5LjkgLTI4LjMgMjM4LjkgLTkuNDUgMjM2LjIgLTkuNCAyMzYuMTUgLTkuMzUgMjM2LjE1IC0xMC40IDI0MS4xIC0xMi4zIDI1MC40NSAtMTMuODUgMjU4LjYgLTE1LjIgMjYzLjk1IC0xNi44IDI3MC4wNSAtMjMuNDUgMjk1LjM1IC0yNy4xNSAyOTguNyAtMzEuNDUgMzAwLjggLTM4LjU1IDMwNC4xNSAtNDYuNTUgMzAzLjc1IC00Ni4xNSAyOTQuOSAtNDUuODUgMjkwLjYgLTQ1LjY1IDI4My4wNSAtNDYuNSAyNzguMiAtNDkuMTUgMjY0Ljk1IC02MC4yNSAyNTYuNiAtNzEuMTUgMjQ4LjQgLTg0LjUgMjQ5LjA1IC05OC4zNSAyNDkuNTUgLTEwOC4zIDI1OC44IC0xMTguNCAyNjcuOTUgLTEyMC42NSAyODEuOTUgLTEyMi43NSAyOTQuODUgLTExNS45IDMwNi4zNSAtMTA4LjkgMzE3LjggLTk2LjI1IDMyMi43IC03NS43IDMzMC42IC01MS4xNSAzMjcuOCAtNDQuNSAzMjcuMDUgLTMxLjQ1IDMyNS4yNSAtMzcuNzUgMzQ5LjI1IC00MS43IDM2NS43IC00My40IDM3Mi4zIC00NC4xIDM4MS40NSAtNDQuMiAzODMuMzUgLTQ0Ljk1IDM5Ny41NSAtNDUuMiA0MDEuNCAtNDIuNzUgNDAzLjc1IC00MC41NSA0MDUuODUgLTM2LjE1IDQwNi4yIC0yNy43NSA0MDcuMDUgLTI1LjA1IDM5OS40IC0yMy40IDM5NC44NSAtMjIuNSAzOTEuOCAtNy40IDMzNi43NSAwLjA1IDMwOS4xIDEzLjE1IDI2MS4xIDIyLjQ1IDIyNi4zIDI4LjI1IDIwNC42IDM0LjE1IDE3Ny4xIDM0LjY1IDE3NC44NSAzMy44NSAxNzEuODUgMzIuOSAxNjguNzUgMzEuNCAxNjggWiIvPgo8L2c+Cgo8ZyBpZD0iTGF5ZXIwXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTMwLjA1IDQ4CkwgMTMwLjA1IDI4LjggMTAzLjQ1IDI4LjggMTAzLjQ1IDQ4IDEzMC4wNSA0OApNIDE3NS41IDIyLjUKTCAxNzUuNSAzLjMgMTAzLjQgMy4zIDEwMy40IDIyLjUgMTc1LjUgMjIuNSBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIxXzBfRklMTCIvPgo8L2c+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC4yOTc4OTczMzg4NjcxODc1LCAwLCAwLCAwLjI5Nzg5NzMzODg2NzE4NzUsIDQ4Ljk1LC0zMC44NSkgIj4KPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc184M19MYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIwXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-OXXX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTA4IDMuOApMIDEwMy40IDMuOCAxMDMuNCA2OC4zIDEwMy4yIDY4LjM1ClEgMTAyLjQ1IDY4LjEgMTAyLjE1IDY3Ljk1IDk3LjI1IDY1LjYgOTIuNTUgNjYgODUuODUgNjYuNTUgODAuODUgNjkuNSA3Ni42NSA3Mi4xIDc0LjA1IDc1IDcxLjA1IDc4LjQgNjkuOTUgODIuNjUgNjkuMTUgODUuNjUgNzAuNDUgODguOSA3MS43NSA5Mi4xNSA3NC4zNSA5My44IDc3LjU1IDk1LjcgODEuMTUgOTYuMiA4NC40NSA5Ni41NSA4OC4zNSA5NS43NSA5Ny4wNSA5NCAxMDMuMzUgODcuNjUgMTA3Ljk1IDgyLjkgMTA3Ljk1IDc3LjEKTCAxMDggMy44Ck0gMTc1LjUgMy44CkwgMTcwLjkgMy44IDE3MC45IDY4LjMgMTcwLjcgNjguMzUKUSAxNjkuOTUgNjguMSAxNjkuNjUgNjcuOTUgMTY0Ljc1IDY1LjYgMTYwLjA1IDY2IDE1My4zNSA2Ni41NSAxNDguMzUgNjkuNSAxNDQuMTUgNzIuMSAxNDEuNTUgNzUgMTM4LjU1IDc4LjQgMTM3LjQ1IDgyLjY1IDEzNi42NSA4NS42NSAxMzcuOTUgODguOSAxMzkuMjUgOTIuMTUgMTQxLjg1IDkzLjggMTQ1LjA1IDk1LjcgMTQ4LjY1IDk2LjIgMTUxLjk1IDk2LjU1IDE1NS44NSA5NS43NSAxNjQuNTUgOTQgMTcwLjg1IDg3LjY1IDE3NS40NSA4Mi45IDE3NS40NSA3Ny4xCkwgMTc1LjUgMy44Ck0gMjM3LjUgMy44CkwgMjMyLjkgMy44IDIzMi45IDY4LjMgMjMyLjcgNjguMzUKUSAyMzEuOTUgNjguMSAyMzEuNjUgNjcuOTUgMjI2Ljc1IDY1LjYgMjIyLjA1IDY2IDIxNS4zNSA2Ni41NSAyMTAuMzUgNjkuNSAyMDYuMTUgNzIuMSAyMDMuNTUgNzUgMjAwLjU1IDc4LjQgMTk5LjQ1IDgyLjY1IDE5OC42NSA4NS42NSAxOTkuOTUgODguOSAyMDEuMjUgOTIuMTUgMjAzLjg1IDkzLjggMjA3LjA1IDk1LjcgMjEwLjY1IDk2LjIgMjEzLjk1IDk2LjU1IDIxNy44NSA5NS43NSAyMjYuNTUgOTQgMjMyLjg1IDg3LjY1IDIzNy40NSA4Mi45IDIzNy40NSA3Ny4xCkwgMjM3LjUgMy44IFoiLz4KPC9nPgoKPGcgaWQ9IkR1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZXNfODNfTGF5ZXIwXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMzEuNCAxNjgKUSAyOS4yIDE2Ni44IDI2IDE2Ni44NSAyMi42NSAxNjYuNzUgMjAuNSAxNjggMTguMTUgMTY5LjI1IDE1Ljc1IDE3Mi4xNSAxNC42IDE3My42IDExLjkgMTc3LjU1IDEwLjIgMTgwLjEgNi4yNSAxODYuOCAzLjc1IDE5MS4xIDEuODUgMTk0IDEuMDUgMTk1LjEgMC40IDE5NiAtNS44IDIwNC4zNSAtMTQuMiAyMDguNDUgLTIyLjQ1IDIxMi4zIC0zMS43NSAyMTEuODUgLTMxLjI1IDIwMS41IC0zMC45IDE5Ni40NSAtMzAuNjUgMTg3LjcgLTMxLjcgMTgyLjA1IC0zNC43NSAxNjYuNjUgLTQ3Ljc1IDE1Ni45IC02MC4zNSAxNDcuNCAtNzYgMTQ4LjEgLTkyLjA1IDE0OC43IC0xMDMuNzUgMTU5LjUgLTExNS40NSAxNzAuMSAtMTE4LjEgMTg2LjUgLTEyMC41IDIwMS41IC0xMTIuNSAyMTQuODUgLTEwNC40IDIyOC4yIC04OS42NSAyMzMuOSAtNjUuNyAyNDMuMiAtMzcuMTUgMjM5LjkgLTI4LjMgMjM4LjkgLTkuNDUgMjM2LjIgLTkuNCAyMzYuMTUgLTkuMzUgMjM2LjE1IC0xMC40IDI0MS4xIC0xMi4zIDI1MC40NSAtMTMuODUgMjU4LjYgLTE1LjIgMjYzLjk1IC0xNi44IDI3MC4wNSAtMjMuNDUgMjk1LjM1IC0yNy4xNSAyOTguNyAtMzEuNDUgMzAwLjggLTM4LjU1IDMwNC4xNSAtNDYuNTUgMzAzLjc1IC00Ni4xNSAyOTQuOSAtNDUuODUgMjkwLjYgLTQ1LjY1IDI4My4wNSAtNDYuNSAyNzguMiAtNDkuMTUgMjY0Ljk1IC02MC4yNSAyNTYuNiAtNzEuMTUgMjQ4LjQgLTg0LjUgMjQ5LjA1IC05OC4zNSAyNDkuNTUgLTEwOC4zIDI1OC44IC0xMTguNCAyNjcuOTUgLTEyMC42NSAyODEuOTUgLTEyMi43NSAyOTQuODUgLTExNS45IDMwNi4zNSAtMTA4LjkgMzE3LjggLTk2LjI1IDMyMi43IC03NS43IDMzMC42IC01MS4xNSAzMjcuOCAtNDQuNSAzMjcuMDUgLTMxLjQ1IDMyNS4yNSAtMzcuNzUgMzQ5LjI1IC00MS43IDM2NS43IC00My40IDM3Mi4zIC00NC4xIDM4MS40NSAtNDQuMiAzODMuMzUgLTQ0Ljk1IDM5Ny41NSAtNDUuMiA0MDEuNCAtNDIuNzUgNDAzLjc1IC00MC41NSA0MDUuODUgLTM2LjE1IDQwNi4yIC0yNy43NSA0MDcuMDUgLTI1LjA1IDM5OS40IC0yMy40IDM5NC44NSAtMjIuNSAzOTEuOCAtNy40IDMzNi43NSAwLjA1IDMwOS4xIDEzLjE1IDI2MS4xIDIyLjQ1IDIyNi4zIDI4LjI1IDIwNC42IDM0LjE1IDE3Ny4xIDM0LjY1IDE3NC44NSAzMy44NSAxNzEuODUgMzIuOSAxNjguNzUgMzEuNCAxNjggWiIvPgo8L2c+Cgo8ZyBpZD0iTGF5ZXIwXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMjM3LjU1IDIyLjUKTCAyMzcuNTUgMy4zIDEwMy40IDMuMyAxMDMuNCAyMi41IDIzNy41NSAyMi41Ck0gMjM3LjU1IDQ4CkwgMjM3LjU1IDI4LjggMTAzLjQgMjguOCAxMDMuNCA0OCAyMzcuNTUgNDggWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDAuMjk3ODk3MzM4ODY3MTg3NSwgMCwgMCwgMC4yOTc4OTczMzg4NjcxODc1LCA0OC45NSwtMzAuODUpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0R1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZXNfODNfTGF5ZXIwXzBfRklMTCIvPgo8L2c+CjwvZz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMF8wX0ZJTEwiLz4KPC9nPgo8L3N2Zz4K","Wordrhythms-SyncopateA.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyMHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTIwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTA3LjU1IDMuMjUKTCAxMDIuOTUgMy4yNSAxMDIuOTUgNjcuNzUgMTAyLjc1IDY3LjgKUSAxMDIgNjcuNTUgMTAxLjcgNjcuNCA5Ni44IDY1LjA1IDkyLjEgNjUuNDUgODUuNCA2NiA4MC40IDY4Ljk1IDc2LjIgNzEuNTUgNzMuNiA3NC40NSA3MC42IDc3Ljg1IDY5LjUgODIuMSA2OC43IDg1LjEgNzAgODguMzUgNzEuMyA5MS42IDczLjkgOTMuMjUgNzcuMSA5NS4xNSA4MC43IDk1LjY1IDg0IDk2IDg3LjkgOTUuMiA5Ni42IDkzLjQ1IDEwMi45IDg3LjEgMTA3LjUgODIuMzUgMTA3LjUgNzYuNTUKTCAxMDcuNTUgMy4yNQpNIDYzLjQgNDAuMjUKUSA2Mi4xNSAzMi4yIDU1Ljk1IDIzLjA1IDQ5Ljc1IDEzLjg1IDQwLjIgMy44NSAzOC4zIDIuMjUgMzcuOSAtMC40NSAzNS44IDEuMSAzNS42NSA0LjA1CkwgMzUuNjUgNjguNTUgMzUuNDUgNjguNgpRIDM0LjcgNjguMzUgMzQuNCA2OC4yIDI5LjUgNjUuODUgMjQuOCA2Ni4yNSAxOC4xIDY2LjggMTMuMSA2OS43NSA4LjkgNzIuMzUgNi4zIDc1LjI1IDMuMyA3OC42NSAyLjIgODIuOSAxLjQgODUuOSAyLjcgODkuMTUgNCA5Mi40IDYuNiA5NC4wNSA5LjggOTUuOTUgMTMuNCA5Ni40NSAxNi43IDk2LjggMjAuNiA5NiAyOS4zIDk0LjI1IDM1LjYgODcuOSA0MC4yIDgzLjE1IDQwLjIgNzcuMzUKTCA0MC4yNSAyMC41NQpRIDQyLjE1IDIyLjUgNDQuOTUgMjUuMiA0Ny43NSAyNy45NSA1MC45IDMxLjIgNTQuMDUgMzQuNCA1Ni41NSA0MC43IDU5LjA1IDQ2Ljk1IDU5LjA1IDUwLjcgNTkgNTQuNDUgNTguNCA1Ny4zNSA1Ny43NSA2MC4yIDU2LjU1IDYzLjQgNTUuOSA2NS4yIDU0LjUgNjguODUgNTkuMiA2My4wNSA2MS42IDU2LjUgNjQuNiA0OC4yNSA2My40IDQwLjI1IFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-SyncopateB.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyMHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTIwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTE4LjcgNDIuMgpRIDExNy40NSAzNC4xNSAxMTEuMjUgMjUgMTA1LjA1IDE1LjggOTUuNSA1LjggOTMuNiA0LjIgOTMuMiAxLjUgOTEuMSAzLjA1IDkwLjk1IDYKTCA5MC45NSA3MC41IDkwLjc1IDcwLjU1ClEgOTAgNzAuMyA4OS43IDcwLjE1IDg0LjggNjcuOCA4MC4xIDY4LjIgNzMuNCA2OC43NSA2OC40IDcxLjcgNjQuMiA3NC4zIDYxLjYgNzcuMiA1OC42IDgwLjYgNTcuNSA4NC44NSA1Ni43IDg3Ljg1IDU4IDkxLjEgNTkuMyA5NC4zNSA2MS45IDk2IDY1LjEgOTcuOSA2OC43IDk4LjQgNzIgOTguNzUgNzUuOSA5Ny45NSA4NC42IDk2LjIgOTAuOSA4OS44NSA5NS41IDg1LjEgOTUuNSA3OS4zCkwgOTUuNTUgMjIuNQpRIDk3LjQ1IDI0LjQ1IDEwMC4yNSAyNy4xNSAxMDMuMDUgMjkuOSAxMDYuMiAzMy4xNSAxMDkuMzUgMzYuMzUgMTExLjg1IDQyLjY1IDExNC4zNSA0OC45IDExNC4zNSA1Mi42NSAxMTQuMyA1Ni40IDExMy43IDU5LjMgMTEzLjA1IDYyLjE1IDExMS44NSA2NS4zNSAxMTEuMiA2Ny4xNSAxMDkuOCA3MC44IDExNC41IDY1IDExNi45IDU4LjQ1IDExOS45IDUwLjIgMTE4LjcgNDIuMiBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIxXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-SyncopateC.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyMHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTIwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc183NF9MYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSA1Mi4yIC0zMi43NQpRIDI1Ljc1IC0zMi4yIDYuMiAtMTUuMDUgLTEzLjMgMiAtMTguMjUgMjguOCAtMjIuNyA1My4zNSAtMTAgNzUuNTUgMi43IDk3LjcgMjYuODUgMTA3LjYgNjUuNyAxMjMuNjUgMTEyLjcgMTE5LjIgMTI3LjMgMTE3LjggMTU4LjQgMTE0IDE1Ni42IDEyMi4wNSAxNTMuMjUgMTM3LjMgMTUwLjM1IDE1MC42IDE0Ny44NSAxNTkuNDUgMTQ0LjEgMTcyLjg1IDEyNC4wNSAyNDIuMzUgMTA5LjUgMjkyLjkgMTAwLjkgMzI1LjQgOTcuOTUgMzM2LjMgOTYuNDUgMzUxLjIgOTYuMTUgMzU0LjI1IDk0LjUgMzc3LjU1IDk0IDM4My45IDk3LjkgMzg3LjcgMTAxLjYgMzkxLjMgMTA4LjUgMzkyLjE1IDEyMi4zNSAzOTMuOCAxMjcuMSAzODEuMiAxMzAuMDUgMzczLjggMTMxLjUgMzY4Ljk1IDE1OC4xNSAyNzkgMTcxLjQgMjM0IDE5NC41IDE1NS43IDIxMSA5OSAyMjEuMzUgNjMuNzUgMjMxLjkgMTguNjUgMjMyLjcgMTUgMjMxLjQ1IDEwLjA1IDIzMC4wNSA0LjkgMjI3LjY1IDMuNTUgMjI0LjEgMS41IDIxOC43NSAxLjQ1IDIxMy4zNSAxLjMgMjA5Ljc1IDMuMiAyMDUuODUgNS4yNSAyMDEuODUgOS45IDE5OS45IDEyLjMgMTk1LjMgMTguNjUgMTkyLjQ1IDIyLjcgMTg1Ljc1IDMzLjcgMTc5Ljg1IDQzLjM1IDE3NS44IDQ4LjUgMTY1LjM1IDYxLjk1IDE1MS40NSA2OC4zNSAxMzcuODUgNzQuNSAxMjIuNDUgNzMuMzUgMTIzLjggNTYuNCAxMjQuMzUgNDguMiAxMjUuMyAzMy44IDEyMy42NSAyNC41NSAxMTkuMTUgLTAuODUgOTguMyAtMTcuMiA3Ny44NSAtMzMuMyA1Mi4yIC0zMi43NSBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDAuMjk3ODk3MzM4ODY3MTg3NSwgMCwgMCwgMC4yOTc4OTczMzg4NjcxODc1LCAxMDUuOTUsLTMwLjg1KSAiPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC42MDk0OTcwNzAzMTI1LCAwLCAwLCAwLjYwOTQ5NzA3MDMxMjUsIC0xMDMuOTUsMTYyLjEpICI+Cjx1c2UgeGxpbms6aHJlZj0iI0R1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZXNfNzRfTGF5ZXIwXzBfRklMTCIvPgo8L2c+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-XOO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE4MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTgwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gNTUuOCA3MgpRIDUzLjQgNzIgNTEuNyA3My43IDUwIDc1LjQgNTAgNzcuOCA1MCA4MC4yIDUxLjcgODEuODUgNTMuNCA4My42IDU1LjggODMuNiA1OC4yIDgzLjYgNTkuODUgODEuODUgNjEuNiA4MC4yIDYxLjYgNzcuOCA2MS42IDc1LjQgNTkuODUgNzMuNyA1OC4yIDcyIDU1LjggNzIKTSA0NS41IDMuOApMIDQwLjkgMy44IDQwLjkgNjguMyA0MC43IDY4LjM1ClEgMzkuOTUgNjguMSAzOS42NSA2Ny45NSAzNC43NSA2NS42IDMwLjA1IDY2IDIzLjM1IDY2LjU1IDE4LjM1IDY5LjUgMTQuMTUgNzIuMSAxMS41NSA3NSAxMS40NSA3NS4xIDExLjQgNzUuMiA4LjUgNzguNSA3LjQ1IDgyLjY1IDYuNjUgODUuNjUgNy45NSA4OC45IDkuMTUgOTEuODUgMTEuNCA5My41IDExLjYgOTMuNjUgMTEuODUgOTMuOCAxNS4wNSA5NS43IDE4LjY1IDk2LjIgMjEuOTUgOTYuNTUgMjUuODUgOTUuNzUgMzQuNTUgOTQgNDAuODUgODcuNjUgNDUuNDUgODIuOSA0NS40NSA3Ny4xCkwgNDUuNSAzLjggWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgo8L3N2Zz4K","Wordrhythms-XOOO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTQ2LjI1IDMuMwpMIDE0MS42NSAzLjMgMTQxLjY1IDY3LjggMTQxLjQ1IDY3Ljg1ClEgMTQwLjcgNjcuNiAxNDAuNCA2Ny40NSAxMzUuNSA2NS4xIDEzMC44IDY1LjUgMTI0LjEgNjYuMDUgMTE5LjEgNjkgMTE0LjkgNzEuNiAxMTIuMyA3NC41IDEwOS4zIDc3LjkgMTA4LjIgODIuMTUgMTA3LjQgODUuMTUgMTA4LjcgODguNCAxMTAgOTEuNjUgMTEyLjYgOTMuMyAxMTUuOCA5NS4yIDExOS40IDk1LjcgMTIyLjcgOTYuMDUgMTI2LjYgOTUuMjUgMTM1LjMgOTMuNSAxNDEuNiA4Ny4xNSAxNDYuMiA4Mi40IDE0Ni4yIDc2LjYKTCAxNDYuMjUgMy4zIFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-XOOX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMjMzIDMuOApMIDIyOC40IDMuOCAyMjguNCA2OC4zIDIyOC4yIDY4LjM1ClEgMjI3LjQ1IDY4LjEgMjI3LjE1IDY3Ljk1IDIyMi4yNSA2NS42IDIxNy41NSA2NiAyMTAuODUgNjYuNTUgMjA1Ljg1IDY5LjUgMjAxLjY1IDcyLjEgMTk5LjA1IDc1IDE5Ni4wNSA3OC40IDE5NC45NSA4Mi42NSAxOTQuMTUgODUuNjUgMTk1LjQ1IDg4LjkgMTk2Ljc1IDkyLjE1IDE5OS4zNSA5My44IDIwMi41NSA5NS43IDIwNi4xNSA5Ni4yIDIwOS40NSA5Ni41NSAyMTMuMzUgOTUuNzUgMjIyLjA1IDk0IDIyOC4zNSA4Ny42NSAyMzIuOTUgODIuOSAyMzIuOTUgNzcuMQpMIDIzMyAzLjgKTSA3Ni44NSA3My43ClEgNzUuMiA3MiA3Mi44IDcyIDcyLjA2NzM4MjgxMjUgNzIgNzEuNCA3Mi4xNSA2OS44ODEwNTQ2ODc1IDcyLjUxODk0NTMxMjUgNjguNyA3My43IDY3IDc1LjQgNjcgNzcuOCA2NyA4MC4yIDY4LjcgODEuODUgNjkuODgxMDU0Njg3NSA4My4wNjU4MjAzMTI1IDcxLjQgODMuNCA3Mi4wNjczODI4MTI1IDgzLjYgNzIuOCA4My42IDc1LjIgODMuNiA3Ni44NSA4MS44NSA3OC42IDgwLjIgNzguNiA3Ny44IDc4LjYgNzUuNCA3Ni44NSA3My43Ck0gNjMgMy44CkwgNTguNCAzLjggNTguNCA2OC4zIDU4LjIgNjguMzUKUSA1Ny40NSA2OC4xIDU3LjE1IDY3Ljk1IDUyLjI1IDY1LjYgNDcuNTUgNjYgNDAuODUgNjYuNTUgMzUuODUgNjkuNSAzMi44MDQxMDE1NjI1IDcxLjM4NTU0Njg3NSAzMC42IDczLjQgMjkuNzY0NDUzMTI1IDc0LjIwMzEyNSAyOS4wNSA3NSAyNi4wNSA3OC40IDI0Ljk1IDgyLjY1IDI0LjE1IDg1LjY1IDI1LjQ1IDg4LjkgMjYuNzUgOTIuMTUgMjkuMzUgOTMuOCAyOS45Njc1NzgxMjUgOTQuMTY2NjAxNTYyNSAzMC42IDk0LjQ1IDMzLjI0NDcyNjU2MjUgOTUuNzk2NDg0Mzc1IDM2LjE1IDk2LjIgMzkuNDUgOTYuNTUgNDMuMzUgOTUuNzUgNTIuMDUgOTQgNTguMzUgODcuNjUgNjAuMTEyODkwNjI1IDg1LjgyOTQ5MjE4NzUgNjEuMiA4My44NSA2MS44MDQ0OTIxODc1IDgyLjc1NDEwMTU2MjUgNjIuMiA4MS42IDYyLjk1IDc5LjQ0MTYwMTU2MjUgNjIuOTUgNzcuMQpMIDYzIDMuOCBaIi8+CjwvZz4KCjxnIGlkPSJMYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSAyMjguNCAyMwpMIDIyOC40IDMuOCA1OC41IDMuOCA1OC41IDIzIDIyOC40IDIzCk0gMjI4LjggNDgKTCAyMjguOCAyOC44IDE4My43NSAyOC44IDE4My43NSA0OCAyMjguOCA0OCBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIxXzBfRklMTCIvPgo8L2c+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-XOX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE4MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTgwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMzcuMTUgNjcuOTUKUSAzMi4yNSA2NS42IDI3LjU1IDY2IDIwLjg1IDY2LjU1IDE1Ljg1IDY5LjUgMTEuNjUgNzIuMSA5LjA1IDc1IDYuMDUgNzguNCA0Ljk1IDgyLjY1IDQuMTUgODUuNjUgNS40NSA4OC45IDYuNzUgOTIuMTUgOS4zNSA5My44IDEyLjU1IDk1LjcgMTYuMTUgOTYuMiAxOS40NSA5Ni41NSAyMy4zNSA5NS43NSAzMi4wNSA5NCAzOC4zNSA4Ny42NSA0Mi45NSA4Mi45IDQyLjk1IDc3LjEKTCA0MyAzLjggMzguNCAzLjggMzguNCA2OC4zIDM4LjIgNjguMzUKUSAzNy40NSA2OC4xIDM3LjE1IDY3Ljk1Ck0gMTYzLjkgMzEuMgpRIDE2Ny4wNSAzNC40IDE2OS41NSA0MC43IDE3Mi4wNSA0Ni45NSAxNzIuMDUgNTAuNyAxNzIgNTQuNDUgMTcxLjQgNTcuMzUgMTcwLjc1IDYwLjIgMTY5LjU1IDYzLjQgMTY4LjkgNjUuMiAxNjcuNSA2OC44NSAxNzIuMiA2My4wNSAxNzQuNiA1Ni41IDE3Ny42IDQ4LjI1IDE3Ni40IDQwLjI1IDE3NS4xNSAzMi4yIDE2OC45NSAyMy4wNSAxNjIuNzUgMTMuODUgMTUzLjIgMy44NSAxNTEuMyAyLjI1IDE1MC45IC0wLjQ1IDE0OC44IDEuMSAxNDguNjUgNC4wNQpMIDE0OC42NSA2OC41NSAxNDguNDUgNjguNgpRIDE0Ny43IDY4LjM1IDE0Ny40IDY4LjIgMTQyLjUgNjUuODUgMTM3LjggNjYuMjUgMTMxLjEgNjYuOCAxMjYuMSA2OS43NSAxMjEuOSA3Mi4zNSAxMTkuMyA3NS4yNSAxMTYuMyA3OC42NSAxMTUuMiA4Mi45IDExNC40IDg1LjkgMTE1LjcgODkuMTUgMTE3IDkyLjQgMTE5LjYgOTQuMDUgMTIyLjggOTUuOTUgMTI2LjQgOTYuNDUgMTI5LjcgOTYuOCAxMzMuNiA5NiAxNDIuMyA5NC4yNSAxNDguNiA4Ny45IDE1My4yIDgzLjE1IDE1My4yIDc3LjM1CkwgMTUzLjI1IDIwLjU1ClEgMTU1LjE1IDIyLjUgMTU3Ljk1IDI1LjIgMTYwLjc1IDI3Ljk1IDE2My45IDMxLjIgWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgo8L3N2Zz4K","Wordrhythms-XOXO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMzcuMTUgNjguMwpMIDM2Ljk1IDY4LjM1ClEgMzYuMiA2OC4xIDM1LjkgNjcuOTUgMzMuMjIwMTE3MTg3NSA2Ni42NjQ2NDg0Mzc1IDMwLjYgNjYuMiAyOC40Mjk0OTIxODc1IDY1LjgxODc1IDI2LjMgNjYgMTkuNiA2Ni41NSAxNC42IDY5LjUgMTAuNCA3Mi4xIDcuOCA3NSA0LjggNzguNCAzLjcgODIuNjUgMi45IDg1LjY1IDQuMiA4OC45IDUuNSA5Mi4xNSA4LjEgOTMuOCAxMS4zIDk1LjcgMTQuOSA5Ni4yIDE4LjIgOTYuNTUgMjIuMSA5NS43NSAyNi42ODMyMDMxMjUgOTQuODI4MTI1IDMwLjYgOTIuNiAzNC4xMTg3NSA5MC42NTQ4ODI4MTI1IDM3LjEgODcuNjUgNDEuNyA4Mi45IDQxLjcgNzcuMQpMIDQxLjc1IDMuOCAzNy4xNSAzLjggMzcuMTUgNjguMwpNIDE3NS41IDMuOApMIDE3MC45IDMuOCAxNzAuOSA2OC4zIDE3MC43IDY4LjM1ClEgMTY5Ljk1IDY4LjEgMTY5LjY1IDY3Ljk1IDE2NC43NSA2NS42IDE2MC4wNSA2NiAxNTMuMzUgNjYuNTUgMTQ4LjM1IDY5LjUgMTQ0LjE1IDcyLjEgMTQxLjU1IDc1IDEzOC41NSA3OC40IDEzNy40NSA4Mi42NSAxMzYuNjUgODUuNjUgMTM3Ljk1IDg4LjkgMTM5LjI1IDkyLjE1IDE0MS44NSA5My44IDE0NS4wNSA5NS43IDE0OC42NSA5Ni4yIDE1MS45NSA5Ni41NSAxNTUuODUgOTUuNzUgMTY0LjU1IDk0IDE3MC44NSA4Ny42NSAxNzUuNDUgODIuOSAxNzUuNDUgNzcuMQpMIDE3NS41IDMuOCBaIi8+CjwvZz4KCjxnIGlkPSJMYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSAxNzUuNSAyNgpMIDE3NS41IDMuOCAzOC4yIDMuOCAzOC4yIDI2IDE3NS41IDI2IFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMF8wX0ZJTEwiLz4KPC9nPgo8L3N2Zz4K","Wordrhythms-XOXX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTcxIDMuOApMIDE2Ni40IDMuOCAxNjYuNCA2OC4zIDE2Ni4yIDY4LjM1ClEgMTY1LjQ1IDY4LjEgMTY1LjE1IDY3Ljk1IDE2MC4yNSA2NS42IDE1NS41NSA2NiAxNDguODUgNjYuNTUgMTQzLjg1IDY5LjUgMTM5LjY1IDcyLjEgMTM3LjA1IDc1IDEzNC4wNSA3OC40IDEzMi45NSA4Mi42NSAxMzIuMTUgODUuNjUgMTMzLjQ1IDg4LjkgMTM0Ljc1IDkyLjE1IDEzNy4zNSA5My44IDE0MC41NSA5NS43IDE0NC4xNSA5Ni4yIDE0Ny40NSA5Ni41NSAxNTEuMzUgOTUuNzUgMTYwLjA1IDk0IDE2Ni4zNSA4Ny42NSAxNzAuOTUgODIuOSAxNzAuOTUgNzcuMQpMIDE3MSAzLjgKTSAzNy4xNSA2OC4zCkwgMzYuOTUgNjguMzUKUSAzNi4yIDY4LjEgMzUuOSA2Ny45NSAzMSA2NS42IDI2LjMgNjYgMTkuNiA2Ni41NSAxNC42IDY5LjUgMTAuNCA3Mi4xIDcuOCA3NSA0LjggNzguNCAzLjcgODIuNjUgMi45IDg1LjY1IDQuMiA4OC45IDUuNSA5Mi4xNSA4LjEgOTMuOCAxMS4zIDk1LjcgMTQuOSA5Ni4yIDE4LjIgOTYuNTUgMjIuMSA5NS43NSAzMC44IDk0IDM3LjEgODcuNjUgNDEuNyA4Mi45IDQxLjcgNzcuMQpMIDQxLjc1IDMuOCAzNy4xNSAzLjggMzcuMTUgNjguMwpNIDIzMy41IDMuOApMIDIyOC45IDMuOCAyMjguOSA2OC4zIDIyOC43IDY4LjM1ClEgMjI3Ljk1IDY4LjEgMjI3LjY1IDY3Ljk1IDIyMi43NSA2NS42IDIxOC4wNSA2NiAyMTEuMzUgNjYuNTUgMjA2LjM1IDY5LjUgMjAyLjE1IDcyLjEgMTk5LjU1IDc1IDE5Ni41NSA3OC40IDE5NS40NSA4Mi42NSAxOTQuNjUgODUuNjUgMTk1Ljk1IDg4LjkgMTk3LjI1IDkyLjE1IDE5OS44NSA5My44IDIwMy4wNSA5NS43IDIwNi42NSA5Ni4yIDIwOS45NSA5Ni41NSAyMTMuODUgOTUuNzUgMjIyLjU1IDk0IDIyOC44NSA4Ny42NSAyMzMuNDUgODIuOSAyMzMuNDUgNzcuMQpMIDIzMy41IDMuOCBaIi8+CjwvZz4KCjxnIGlkPSJMYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSAyMzIuNiA0OApMIDIzMi42IDI4LjggMTY2LjQ1IDI4LjggMTY2LjQ1IDQ4IDIzMi42IDQ4Ck0gMjMzLjUgMjIuNQpMIDIzMy41IDMuMyAzNy4yNSAzLjMgMzcuMjUgMjIuNSAyMzMuNSAyMi41IFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMF8wX0ZJTEwiLz4KPC9nPgo8L3N2Zz4K","Wordrhythms-XXO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE4MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTgwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gNDQuOTUgMjUuMgpRIDQ3Ljc1IDI3Ljk1IDUwLjkgMzEuMiA1NC4wNSAzNC40IDU2LjU1IDQwLjcgNTkuMDUgNDYuOTUgNTkuMDUgNTAuNyA1OSA1NC40NSA1OC40IDU3LjM1IDU3Ljc1IDYwLjIgNTYuNTUgNjMuNCA1NS45IDY1LjIgNTQuNSA2OC44NSA1OS4yIDYzLjA1IDYxLjYgNTYuNSA2NC42IDQ4LjI1IDYzLjQgNDAuMjUgNjIuMTUgMzIuMiA1NS45NSAyMy4wNSA0OS43NSAxMy44NSA0MC4yIDMuODUgMzguMyAyLjI1IDM3LjkgLTAuNDUgMzUuOCAxLjEgMzUuNjUgNC4wNQpMIDM1LjY1IDY4LjU1IDM1LjQ1IDY4LjYKUSAzNC43IDY4LjM1IDM0LjQgNjguMiAyOS41IDY1Ljg1IDI0LjggNjYuMjUgMTguMSA2Ni44IDEzLjEgNjkuNzUgOC45IDcyLjM1IDYuMyA3NS4yNSAzLjMgNzguNjUgMi4yIDgyLjkgMS40IDg1LjkgMi43IDg5LjE1IDQgOTIuNCA2LjYgOTQuMDUgOS44IDk1Ljk1IDEzLjQgOTYuNDUgMTYuNyA5Ni44IDIwLjYgOTYgMjkuMyA5NC4yNSAzNS42IDg3LjkgNDAuMiA4My4xNSA0MC4yIDc3LjM1CkwgNDAuMjUgMjAuNTUKUSA0Mi4xNSAyMi41IDQ0Ljk1IDI1LjIKTSAxMDUuNSAzLjgKTCAxMDAuOSAzLjggMTAwLjkgNjguMyAxMDAuNyA2OC4zNQpRIDk5Ljk1IDY4LjEgOTkuNjUgNjcuOTUgOTQuNzUgNjUuNiA5MC4wNSA2NiA4My4zNSA2Ni41NSA3OC4zNSA2OS41IDc0LjE1IDcyLjEgNzEuNTUgNzUgNjguNTUgNzguNCA2Ny40NSA4Mi42NSA2Ni42NSA4NS42NSA2Ny45NSA4OC45IDY5LjI1IDkyLjE1IDcxLjg1IDkzLjggNzUuMDUgOTUuNyA3OC42NSA5Ni4yIDgxLjk1IDk2LjU1IDg1Ljg1IDk1Ljc1IDk0LjU1IDk0IDEwMC44NSA4Ny42NSAxMDUuNDUgODIuOSAxMDUuNDUgNzcuMQpMIDEwNS41IDMuOCBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIxXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-XXOO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMzcuMTUgNjguMwpMIDM2Ljk1IDY4LjM1ClEgMzYuMiA2OC4xIDM1LjkgNjcuOTUgMzEgNjUuNiAyNi4zIDY2IDE5LjYgNjYuNTUgMTQuNiA2OS41IDEwLjQgNzIuMSA3LjggNzUgNC44IDc4LjQgMy43IDgyLjY1IDIuOSA4NS42NSA0LjIgODguOSA1LjUgOTIuMTUgOC4xIDkzLjggMTEuMyA5NS43IDE0LjkgOTYuMiAxOC4yIDk2LjU1IDIyLjEgOTUuNzUgMzAuOCA5NCAzNy4xIDg3LjY1IDQxLjcgODIuOSA0MS43IDc3LjEKTCA0MS43NSAzLjggMzcuMTUgMy44IDM3LjE1IDY4LjMKTSAxMDggMy44CkwgMTAzLjQgMy44IDEwMy40IDY4LjMgMTAzLjIgNjguMzUKUSAxMDIuNDUgNjguMSAxMDIuMTUgNjcuOTUgOTcuMjUgNjUuNiA5Mi41NSA2NiA4NS44NSA2Ni41NSA4MC44NSA2OS41IDc2LjY1IDcyLjEgNzQuMDUgNzUgNzEuMDUgNzguNCA2OS45NSA4Mi42NSA2OS4xNSA4NS42NSA3MC40NSA4OC45IDcxLjc1IDkyLjE1IDc0LjM1IDkzLjggNzcuNTUgOTUuNyA4MS4xNSA5Ni4yIDg0LjQ1IDk2LjU1IDg4LjM1IDk1Ljc1IDk3LjA1IDk0IDEwMy4zNSA4Ny42NSAxMDcuOTUgODIuOSAxMDcuOTUgNzcuMQpMIDEwOCAzLjggWiIvPgo8L2c+Cgo8ZyBpZD0iRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc183NF9MYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSA1Mi4yIC0zMi43NQpRIDI1Ljc1IC0zMi4yIDYuMiAtMTUuMDUgLTEzLjMgMiAtMTguMjUgMjguOCAtMjIuNyA1My4zNSAtMTAgNzUuNTUgMi43IDk3LjcgMjYuODUgMTA3LjYgNjUuNyAxMjMuNjUgMTEyLjcgMTE5LjIgMTI3LjMgMTE3LjggMTU4LjQgMTE0IDE1Ni42IDEyMi4wNSAxNTMuMjUgMTM3LjMgMTUwLjM1IDE1MC42IDE0Ny44NSAxNTkuNDUgMTQ0LjEgMTcyLjg1IDEyNC4wNSAyNDIuMzUgMTA5LjUgMjkyLjkgMTAwLjkgMzI1LjQgOTcuOTUgMzM2LjMgOTYuNDUgMzUxLjIgOTYuMTUgMzU0LjI1IDk0LjUgMzc3LjU1IDk0IDM4My45IDk3LjkgMzg3LjcgMTAxLjYgMzkxLjMgMTA4LjUgMzkyLjE1IDEyMi4zNSAzOTMuOCAxMjcuMSAzODEuMiAxMzAuMDUgMzczLjggMTMxLjUgMzY4Ljk1IDE1OC4xNSAyNzkgMTcxLjQgMjM0IDE5NC41IDE1NS43IDIxMSA5OSAyMjEuMzUgNjMuNzUgMjMxLjkgMTguNjUgMjMyLjcgMTUgMjMxLjQ1IDEwLjA1IDIzMC4wNSA0LjkgMjI3LjY1IDMuNTUgMjI0LjEgMS41IDIxOC43NSAxLjQ1IDIxMy4zNSAxLjMgMjA5Ljc1IDMuMiAyMDUuODUgNS4yNSAyMDEuODUgOS45IDE5OS45IDEyLjMgMTk1LjMgMTguNjUgMTkyLjQ1IDIyLjcgMTg1Ljc1IDMzLjcgMTc5Ljg1IDQzLjM1IDE3NS44IDQ4LjUgMTY1LjM1IDYxLjk1IDE1MS40NSA2OC4zNSAxMzcuODUgNzQuNSAxMjIuNDUgNzMuMzUgMTIzLjggNTYuNCAxMjQuMzUgNDguMiAxMjUuMyAzMy44IDEyMy42NSAyNC41NSAxMTkuMTUgLTAuODUgOTguMyAtMTcuMiA3Ny44NSAtMzMuMyA1Mi4yIC0zMi43NSBaIi8+CjwvZz4KCjxnIGlkPSJMYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSAxMDguMDUgNDgKTCAxMDguMDUgMjguOCAzNy4yNSAyOC44IDM3LjI1IDQ4IDEwOC4wNSA0OApNIDEwOC4wNSAyMi41CkwgMTA4LjA1IDMuMyAzNy4yNSAzLjMgMzcuMjUgMjIuNSAxMDguMDUgMjIuNSBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIxXzBfRklMTCIvPgo8L2c+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC4yOTc4OTczMzg4NjcxODc1LCAwLCAwLCAwLjI5Nzg5NzMzODg2NzE4NzUsIDE5MC45NSwtMzAuODUpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjYwOTQ5NzA3MDMxMjUsIDAsIDAsIDAuNjA5NDk3MDcwMzEyNSwgLTEwMy45NSwxNjIuMSkgIj4KPHVzZSB4bGluazpocmVmPSIjRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc183NF9MYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIwXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-XXOX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTE4IDMuOApMIDExMy40IDMuOCAxMTMuNCA2OC4zIDExMy4yIDY4LjM1ClEgMTEyLjQ1IDY4LjEgMTEyLjE1IDY3Ljk1IDEwNy4yNSA2NS42IDEwMi41NSA2NiA5NS44NSA2Ni41NSA5MC44NSA2OS41IDg2LjY1IDcyLjEgODQuMDUgNzUgODEuMDUgNzguNCA3OS45NSA4Mi42NSA3OS4xNSA4NS42NSA4MC40NSA4OC45IDgxLjc1IDkyLjE1IDg0LjM1IDkzLjggODcuNTUgOTUuNyA5MS4xNSA5Ni4yIDk0LjQ1IDk2LjU1IDk4LjM1IDk1Ljc1IDEwNy4wNSA5NCAxMTMuMzUgODcuNjUgMTE3Ljk1IDgyLjkgMTE3Ljk1IDc3LjEKTCAxMTggMy44Ck0gMjMzLjUgMy44CkwgMjI4LjkgMy44IDIyOC45IDY4LjMgMjI4LjcgNjguMzUKUSAyMjcuOTUgNjguMSAyMjcuNjUgNjcuOTUgMjIyLjc1IDY1LjYgMjE4LjA1IDY2IDIxMS4zNSA2Ni41NSAyMDYuMzUgNjkuNSAyMDIuMTUgNzIuMSAxOTkuNTUgNzUgMTk2LjU1IDc4LjQgMTk1LjQ1IDgyLjY1IDE5NC42NSA4NS42NSAxOTUuOTUgODguOSAxOTcuMjUgOTIuMTUgMTk5Ljg1IDkzLjggMjAzLjA1IDk1LjcgMjA2LjY1IDk2LjIgMjA5Ljk1IDk2LjU1IDIxMy44NSA5NS43NSAyMjIuNTUgOTQgMjI4Ljg1IDg3LjY1IDIzMy40NSA4Mi45IDIzMy40NSA3Ny4xCkwgMjMzLjUgMy44Ck0gMzcuMTUgNjguMwpMIDM2Ljk1IDY4LjM1ClEgMzYuMiA2OC4xIDM1LjkgNjcuOTUgMzEgNjUuNiAyNi4zIDY2IDE5LjYgNjYuNTUgMTQuNiA2OS41IDEwLjQgNzIuMSA3LjggNzUgNC44IDc4LjQgMy43IDgyLjY1IDIuOSA4NS42NSA0LjIgODguOSA1LjUgOTIuMTUgOC4xIDkzLjggMTEuMyA5NS43IDE0LjkgOTYuMiAxOC4yIDk2LjU1IDIyLjEgOTUuNzUgMzAuOCA5NCAzNy4xIDg3LjY1IDQxLjcgODIuOSA0MS43IDc3LjEKTCA0MS43NSAzLjggMzcuMTUgMy44IDM3LjE1IDY4LjMgWiIvPgo8L2c+Cgo8ZyBpZD0iTGF5ZXIwXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMjMyLjU1IDQ4CkwgMjMyLjU1IDI4LjggMTg5LjggMjguOCAxODkuOCA0OCAyMzIuNTUgNDgKTSA4MC4wNSA0OApMIDgwLjA1IDI4LjggMzcuMyAyOC44IDM3LjMgNDggODAuMDUgNDgKTSAyMzMuNSAyMi41CkwgMjMzLjUgMy4zIDM3LjI1IDMuMyAzNy4yNSAyMi41IDIzMy41IDIyLjUgWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIwXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-XXX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE4MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTgwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMzcuMTUgNjguMwpMIDM2Ljk1IDY4LjM1ClEgMzYuMiA2OC4xIDM1LjkgNjcuOTUgMzEgNjUuNiAyNi4zIDY2IDE5LjYgNjYuNTUgMTQuNiA2OS41IDEwLjQgNzIuMSA3LjggNzUgNC44IDc4LjQgMy43IDgyLjY1IDIuOSA4NS42NSA0LjIgODguOSA1LjUgOTIuMTUgOC4xIDkzLjggMTEuMyA5NS43IDE0LjkgOTYuMiAxOC4yIDk2LjU1IDIyLjEgOTUuNzUgMzAuOCA5NCAzNy4xIDg3LjY1IDQxLjcgODIuOSA0MS43IDc3LjEKTCA0MS43NSAzLjggMzcuMTUgMy44IDM3LjE1IDY4LjMKTSAxMDUuNSAzLjgKTCAxMDAuOSAzLjggMTAwLjkgNjguMyAxMDAuNyA2OC4zNQpRIDk5Ljk1IDY4LjEgOTkuNjUgNjcuOTUgOTQuNzUgNjUuNiA5MC4wNSA2NiA4My4zNSA2Ni41NSA3OC4zNSA2OS41IDc0LjE1IDcyLjEgNzEuNTUgNzUgNjguNTUgNzguNCA2Ny40NSA4Mi42NSA2Ni42NSA4NS42NSA2Ny45NSA4OC45IDY5LjI1IDkyLjE1IDcxLjg1IDkzLjggNzUuMDUgOTUuNyA3OC42NSA5Ni4yIDgxLjk1IDk2LjU1IDg1Ljg1IDk1Ljc1IDk0LjU1IDk0IDEwMC44NSA4Ny42NSAxMDUuNDUgODIuOSAxMDUuNDUgNzcuMQpMIDEwNS41IDMuOApNIDE3Mi41IDMuOApMIDE2Ny45IDMuOCAxNjcuOSA2OC4zIDE2Ny43IDY4LjM1ClEgMTY2Ljk1IDY4LjEgMTY2LjY1IDY3Ljk1IDE2MS43NSA2NS42IDE1Ny4wNSA2NiAxNTAuMzUgNjYuNTUgMTQ1LjM1IDY5LjUgMTQxLjE1IDcyLjEgMTM4LjU1IDc1IDEzNS41NSA3OC40IDEzNC40NSA4Mi42NSAxMzMuNjUgODUuNjUgMTM0Ljk1IDg4LjkgMTM2LjI1IDkyLjE1IDEzOC44NSA5My44IDE0Mi4wNSA5NS43IDE0NS42NSA5Ni4yIDE0OC45NSA5Ni41NSAxNTIuODUgOTUuNzUgMTYxLjU1IDk0IDE2Ny44NSA4Ny42NSAxNzIuNDUgODIuOSAxNzIuNDUgNzcuMQpMIDE3Mi41IDMuOCBaIi8+CjwvZz4KCjxnIGlkPSJMYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSAxNzIuNSAyNS41CkwgMTcyLjUgMy4zIDM3LjE1IDMuMyAzNy4xNSAyNS41IDE3Mi41IDI1LjUgWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIwXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-XXXO.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTgyLjUgMy44CkwgMTc3LjkgMy44IDE3Ny45IDY4LjMgMTc3LjcgNjguMzUKUSAxNzYuOTUgNjguMSAxNzYuNjUgNjcuOTUgMTcxLjc1IDY1LjYgMTY3LjA1IDY2IDE2MC4zNSA2Ni41NSAxNTUuMzUgNjkuNSAxNTEuMTUgNzIuMSAxNDguNTUgNzUgMTQ1LjU1IDc4LjQgMTQ0LjQ1IDgyLjY1IDE0My42NSA4NS42NSAxNDQuOTUgODguOSAxNDYuMjUgOTIuMTUgMTQ4Ljg1IDkzLjggMTUyLjA1IDk1LjcgMTU1LjY1IDk2LjIgMTU4Ljk1IDk2LjU1IDE2Mi44NSA5NS43NSAxNzEuNTUgOTQgMTc3Ljg1IDg3LjY1IDE4Mi40NSA4Mi45IDE4Mi40NSA3Ny4xCkwgMTgyLjUgMy44Ck0gMzcuMTUgNjguMwpMIDM2Ljk1IDY4LjM1ClEgMzYuMiA2OC4xIDM1LjkgNjcuOTUgMzEgNjUuNiAyNi4zIDY2IDE5LjYgNjYuNTUgMTQuNiA2OS41IDEwLjQgNzIuMSA3LjggNzUgNC44IDc4LjQgMy43IDgyLjY1IDIuOSA4NS42NSA0LjIgODguOSA1LjUgOTIuMTUgOC4xIDkzLjggMTEuMyA5NS43IDE0LjkgOTYuMiAxOC4yIDk2LjU1IDIyLjEgOTUuNzUgMzAuOCA5NCAzNy4xIDg3LjY1IDQxLjcgODIuOSA0MS43IDc3LjEKTCA0MS43NSAzLjggMzcuMTUgMy44IDM3LjE1IDY4LjMKTSAxMDggMy44CkwgMTAzLjQgMy44IDEwMy40IDY4LjMgMTAzLjIgNjguMzUKUSAxMDIuNDUgNjguMSAxMDIuMTUgNjcuOTUgOTcuMjUgNjUuNiA5Mi41NSA2NiA4NS44NSA2Ni41NSA4MC44NSA2OS41IDc2LjY1IDcyLjEgNzQuMDUgNzUgNzEuMDUgNzguNCA2OS45NSA4Mi42NSA2OS4xNSA4NS42NSA3MC40NSA4OC45IDcxLjc1IDkyLjE1IDc0LjM1IDkzLjggNzcuNTUgOTUuNyA4MS4xNSA5Ni4yIDg0LjQ1IDk2LjU1IDg4LjM1IDk1Ljc1IDk3LjA1IDk0IDEwMy4zNSA4Ny42NSAxMDcuOTUgODIuOSAxMDcuOTUgNzcuMQpMIDEwOCAzLjggWiIvPgo8L2c+Cgo8ZyBpZD0iTGF5ZXIwXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTgyLjU1IDIyLjUKTCAxODIuNTUgMy4zIDM3LjI1IDMuMyAzNy4yNSAyMi41IDE4Mi41NSAyMi41Ck0gMTA4LjA1IDQ4CkwgMTA4LjA1IDI4LjggMzcuMjUgMjguOCAzNy4yNSA0OCAxMDguMDUgNDggWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIwXzBfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-XXXX.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0MHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMjQwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTA4IDMuOApMIDEwMy40IDMuOCAxMDMuNCA2OC4zIDEwMy4yIDY4LjM1ClEgMTAyLjQ1IDY4LjEgMTAyLjE1IDY3Ljk1IDk3LjI1IDY1LjYgOTIuNTUgNjYgODUuODUgNjYuNTUgODAuODUgNjkuNSA3Ni42NSA3Mi4xIDc0LjA1IDc1IDcxLjA1IDc4LjQgNjkuOTUgODIuNjUgNjkuMTUgODUuNjUgNzAuNDUgODguOSA3MS43NSA5Mi4xNSA3NC4zNSA5My44IDc3LjU1IDk1LjcgODEuMTUgOTYuMiA4NC40NSA5Ni41NSA4OC4zNSA5NS43NSA5Ny4wNSA5NCAxMDMuMzUgODcuNjUgMTA3Ljk1IDgyLjkgMTA3Ljk1IDc3LjEKTCAxMDggMy44Ck0gMTc1LjUgMy44CkwgMTcwLjkgMy44IDE3MC45IDY4LjMgMTcwLjcgNjguMzUKUSAxNjkuOTUgNjguMSAxNjkuNjUgNjcuOTUgMTY0Ljc1IDY1LjYgMTYwLjA1IDY2IDE1My4zNSA2Ni41NSAxNDguMzUgNjkuNSAxNDQuMTUgNzIuMSAxNDEuNTUgNzUgMTM4LjU1IDc4LjQgMTM3LjQ1IDgyLjY1IDEzNi42NSA4NS42NSAxMzcuOTUgODguOSAxMzkuMjUgOTIuMTUgMTQxLjg1IDkzLjggMTQ1LjA1IDk1LjcgMTQ4LjY1IDk2LjIgMTUxLjk1IDk2LjU1IDE1NS44NSA5NS43NSAxNjQuNTUgOTQgMTcwLjg1IDg3LjY1IDE3NS40NSA4Mi45IDE3NS40NSA3Ny4xCkwgMTc1LjUgMy44Ck0gMjM3LjUgMy44CkwgMjMyLjkgMy44IDIzMi45IDY4LjMgMjMyLjcgNjguMzUKUSAyMzEuOTUgNjguMSAyMzEuNjUgNjcuOTUgMjI2Ljc1IDY1LjYgMjIyLjA1IDY2IDIxNS4zNSA2Ni41NSAyMTAuMzUgNjkuNSAyMDYuMTUgNzIuMSAyMDMuNTUgNzUgMjAwLjU1IDc4LjQgMTk5LjQ1IDgyLjY1IDE5OC42NSA4NS42NSAxOTkuOTUgODguOSAyMDEuMjUgOTIuMTUgMjAzLjg1IDkzLjggMjA3LjA1IDk1LjcgMjEwLjY1IDk2LjIgMjEzLjk1IDk2LjU1IDIxNy44NSA5NS43NSAyMjYuNTUgOTQgMjMyLjg1IDg3LjY1IDIzNy40NSA4Mi45IDIzNy40NSA3Ny4xCkwgMjM3LjUgMy44Ck0gMzcuMTUgNjguMwpMIDM2Ljk1IDY4LjM1ClEgMzYuMiA2OC4xIDM1LjkgNjcuOTUgMzEgNjUuNiAyNi4zIDY2IDE5LjYgNjYuNTUgMTQuNiA2OS41IDEwLjQgNzIuMSA3LjggNzUgNC44IDc4LjQgMy43IDgyLjY1IDIuOSA4NS42NSA0LjIgODguOSA1LjUgOTIuMTUgOC4xIDkzLjggMTEuMyA5NS43IDE0LjkgOTYuMiAxOC4yIDk2LjU1IDIyLjEgOTUuNzUgMzAuOCA5NCAzNy4xIDg3LjY1IDQxLjcgODIuOSA0MS43IDc3LjEKTCA0MS43NSAzLjggMzcuMTUgMy44IDM3LjE1IDY4LjMgWiIvPgo8L2c+Cgo8ZyBpZD0iTGF5ZXIwXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMjM3LjU1IDQ4CkwgMjM3LjU1IDI4LjggMzcuMiAyOC44IDM3LjIgNDggMjM3LjU1IDQ4Ck0gMjM3LjU1IDIyLjUKTCAyMzcuNTUgMy4zIDM3LjIgMy4zIDM3LjIgMjIuNSAyMzcuNTUgMjIuNSBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIxXzBfRklMTCIvPgo8L2c+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-dottedquarternote.svg":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMTIwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMjAgMTAwIj4KPGRlZnM+CjxnIGlkPSJMYXllcjFfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSA3OCA3MgpRIDc1LjYgNzIgNzMuOSA3My43IDcyLjIgNzUuNCA3Mi4yIDc3LjggNzIuMiA4MC4yIDczLjkgODEuODUgNzUuNiA4My42IDc4IDgzLjYgODAuNCA4My42IDgyLjA1IDgxLjg1IDgzLjggODAuMiA4My44IDc3LjggODMuOCA3NS40IDgyLjA1IDczLjcgODAuNCA3MiA3OCA3MgpNIDYwLjI1IDMuMwpMIDU1LjY1IDMuMyA1NS42NSA2Ny44IDU1LjQ1IDY3Ljg1ClEgNTQuNyA2Ny42IDU0LjQgNjcuNDUgNDkuNSA2NS4xIDQ0LjggNjUuNSAzOC4xIDY2LjA1IDMzLjEgNjkgMjguOSA3MS42IDI2LjMgNzQuNSAyMy4zIDc3LjkgMjIuMiA4Mi4xNSAyMS40IDg1LjE1IDIyLjcgODguNCAyNCA5MS42NSAyNi42IDkzLjMgMjkuOCA5NS4yIDMzLjQgOTUuNyAzNi43IDk2LjA1IDQwLjYgOTUuMjUgNDkuMyA5My41IDU1LjYgODcuMTUgNjAuMiA4Mi40IDYwLjIgNzYuNgpMIDYwLjI1IDMuMyBaIi8+CjwvZz4KPC9kZWZzPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-eighth-dottedquarter.svg":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMTIwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMjAgMTAwIj4KPGRlZnM+CjxnIGlkPSJMYXllcjFfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSA0NC45NSAyNS4yClEgNDcuNzUgMjcuOTUgNTAuOSAzMS4yIDU0LjA1IDM0LjQgNTYuNTUgNDAuNyA1OS4wNSA0Ni45NSA1OS4wNSA1MC43IDU5IDU0LjQ1IDU4LjQgNTcuMzUgNTcuNzUgNjAuMiA1Ni41NSA2My40IDU1LjkgNjUuMiA1NC41IDY4Ljg1IDU5LjIgNjMuMDUgNjEuNiA1Ni41IDY0LjYgNDguMjUgNjMuNCA0MC4yNSA2Mi4xNSAzMi4yIDU1Ljk1IDIzLjA1IDQ5Ljc1IDEzLjg1IDQwLjIgMy44NSAzOC4zIDIuMjUgMzcuOSAtMC40NSAzNS44IDEuMSAzNS42NSA0LjA1CkwgMzUuNjUgNjguNTUgMzUuNDUgNjguNgpRIDM0LjcgNjguMzUgMzQuNCA2OC4yIDI5LjUgNjUuODUgMjQuOCA2Ni4yNSAxOC4xIDY2LjggMTMuMSA2OS43NSA4LjkgNzIuMzUgNi4zIDc1LjI1IDMuMyA3OC42NSAyLjIgODIuOSAxLjQgODUuOSAyLjcgODkuMTUgNCA5Mi40IDYuNiA5NC4wNSA5LjggOTUuOTUgMTMuNCA5Ni40NSAxNi43IDk2LjggMjAuNiA5NiAyOS4zIDk0LjI1IDM1LjYgODcuOSA0MC4yIDgzLjE1IDQwLjIgNzcuMzUKTCA0MC4yNSAyMC41NQpRIDQyLjE1IDIyLjUgNDQuOTUgMjUuMgpNIDk1LjUgMy44CkwgOTAuOSAzLjggOTAuOSA2OC4zIDkwLjcgNjguMzUKUSA4OS45NSA2OC4xIDg5LjY1IDY3Ljk1IDg0Ljc1IDY1LjYgODAuMDUgNjYgNzMuMzUgNjYuNTUgNjguMzUgNjkuNSA2NC4xNSA3Mi4xIDYxLjU1IDc1IDU4LjU1IDc4LjQgNTcuNDUgODIuNjUgNTYuNjUgODUuNjUgNTcuOTUgODguOSA1OS4yNSA5Mi4xNSA2MS44NSA5My44IDY1LjA1IDk1LjcgNjguNjUgOTYuMiA3MS45NSA5Ni41NSA3NS44NSA5NS43NSA4NC41NSA5NCA5MC44NSA4Ny42NSA5NS40NSA4Mi45IDk1LjQ1IDc3LjEKTCA5NS41IDMuOCBaCk0gMTA4IDcyClEgMTA1LjYgNzIgMTAzLjkgNzMuNyAxMDIuMiA3NS40IDEwMi4yIDc3LjggMTAyLjIgODAuMiAxMDMuOSA4MS44NSAxMDUuNiA4My42IDEwOCA4My42IDExMC40IDgzLjYgMTEyLjA1IDgxLjg1IDExMy44IDgwLjIgMTEzLjggNzcuOCAxMTMuOCA3NS40IDExMi4wNSA3My43IDExMC40IDcyIDEwOCA3MiBaIi8+CjwvZz4KPC9kZWZzPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-eighthnotepair.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyMHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTIwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gMTE0LjU1IDMuMjUKTCAxMDkuOTUgMy4yNSAxMDkuOTUgNjcuNzUgMTA5Ljc1IDY3LjgKUSAxMDkgNjcuNTUgMTA4LjcgNjcuNCAxMDMuOCA2NS4wNSA5OS4xIDY1LjQ1IDkyLjQgNjYgODcuNCA2OC45NSA4My4yIDcxLjU1IDgwLjYgNzQuNDUgNzcuNiA3Ny44NSA3Ni41IDgyLjEgNzUuNyA4NS4xIDc3IDg4LjM1IDc4LjMgOTEuNiA4MC45IDkzLjI1IDg0LjEgOTUuMTUgODcuNyA5NS42NSA5MSA5NiA5NC45IDk1LjIgMTAzLjYgOTMuNDUgMTA5LjkgODcuMSAxMTQuNSA4Mi4zNSAxMTQuNSA3Ni41NQpMIDExNC41NSAzLjI1Ck0gMzkuMjUgMy4zCkwgMzQuNjUgMy4zIDM0LjY1IDY3LjggMzQuNDUgNjcuODUKUSAzMy43IDY3LjYgMzMuNCA2Ny40NSAyOC41IDY1LjEgMjMuOCA2NS41IDE3LjEgNjYuMDUgMTIuMSA2OSA3LjkgNzEuNiA1LjMgNzQuNSAyLjMgNzcuOSAxLjIgODIuMTUgMC40IDg1LjE1IDEuNyA4OC40IDMgOTEuNjUgNS42IDkzLjMgOC44IDk1LjIgMTIuNCA5NS43IDE1LjcgOTYuMDUgMTkuNiA5NS4yNSAyOC4zIDkzLjUgMzQuNiA4Ny4xNSAzOS4yIDgyLjQgMzkuMiA3Ni42CkwgMzkuMjUgMy4zIFoiLz4KPC9nPgoKPGcgaWQ9IkxheWVyMF8wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDEwOS45NSAyNS41CkwgMTA5Ljk1IDMuMyAzNC42NSAzLjMgMzQuNjUgMjUuNSAxMDkuOTUgMjUuNSBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIxXzBfRklMTCIvPgo8L2c+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjBfMF9GSUxMIi8+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-eighthrest-dottedquarter.svg":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMTIwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMjAgMTAwIj4KPGRlZnM+CjxnIGlkPSJMYXllcjFfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSA5NS41IDMuOApMIDkwLjkgMy44IDkwLjkgNjguMyA5MC43IDY4LjM1ClEgODkuOTUgNjguMSA4OS42NSA2Ny45NSA4NC43NSA2NS42IDgwLjA1IDY2IDczLjM1IDY2LjU1IDY4LjM1IDY5LjUgNjQuMTUgNzIuMSA2MS41NSA3NSA1OC41NSA3OC40IDU3LjQ1IDgyLjY1IDU2LjY1IDg1LjY1IDU3Ljk1IDg4LjkgNTkuMjUgOTIuMTUgNjEuODUgOTMuOCA2NS4wNSA5NS43IDY4LjY1IDk2LjIgNzEuOTUgOTYuNTUgNzUuODUgOTUuNzUgODQuNTUgOTQgOTAuODUgODcuNjUgOTUuNDUgODIuOSA5NS40NSA3Ny4xCkwgOTUuNSAzLjggWgpNIDEwOCA3MgpRIDEwNS42IDcyIDEwMy45IDczLjcgMTAyLjIgNzUuNCAxMDIuMiA3Ny44IDEwMi4yIDgwLjIgMTAzLjkgODEuODUgMTA1LjYgODMuNiAxMDggODMuNiAxMTAuNCA4My42IDExMi4wNSA4MS44NSAxMTMuOCA4MC4yIDExMy44IDc3LjggMTEzLjggNzUuNCAxMTIuMDUgNzMuNyAxMTAuNCA3MiAxMDggNzIgWiIvPgo8L2c+CjxnIGlkPSJSZXN0X0ZJTEwiPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDUyLjIgLTMyLjc1ClEgMjUuNzUgLTMyLjIgNi4yIC0xNS4wNSAtMTMuMyAyIC0xOC4yNSAyOC44IC0yMi43IDUzLjM1IC0xMCA3NS41NSAyLjcgOTcuNyAyNi44NSAxMDcuNiA2NS43IDEyMy42NSAxMTIuNyAxMTkuMiAxMjcuMyAxMTcuOCAxNTguNCAxMTQgMTU2LjYgMTIyLjA1IDE1My4yNSAxMzcuMyAxNTAuMzUgMTUwLjYgMTQ3Ljg1IDE1OS40NSAxNDQuMSAxNzIuODUgMTI0LjA1IDI0Mi4zNSAxMDkuNSAyOTIuOSAxMDAuOSAzMjUuNCA5Ny45NSAzMzYuMyA5Ni40NSAzNTEuMiA5Ni4xNSAzNTQuMjUgOTQuNSAzNzcuNTUgOTQgMzgzLjkgOTcuOSAzODcuNyAxMDEuNiAzOTEuMyAxMDguNSAzOTIuMTUgMTIyLjM1IDM5My44IDEyNy4xIDM4MS4yIDEzMC4wNSAzNzMuOCAxMzEuNSAzNjguOTUgMTU4LjE1IDI3OSAxNzEuNCAyMzQgMTk0LjUgMTU1LjcgMjExIDk5IDIyMS4zNSA2My43NSAyMzEuOSAxOC42NSAyMzIuNyAxNSAyMzEuNDUgMTAuMDUgMjMwLjA1IDQuOSAyMjcuNjUgMy41NSAyMjQuMSAxLjUgMjE4Ljc1IDEuNDUgMjEzLjM1IDEuMyAyMDkuNzUgMy4yIDIwNS44NSA1LjI1IDIwMS44NSA5LjkgMTk5LjkgMTIuMyAxOTUuMyAxOC42NSAxOTIuNDUgMjIuNyAxODUuNzUgMzMuNyAxNzkuODUgNDMuMzUgMTc1LjggNDguNSAxNjUuMzUgNjEuOTUgMTUxLjQ1IDY4LjM1IDEzNy44NSA3NC41IDEyMi40NSA3My4zNSAxMjMuOCA1Ni40IDEyNC4zNSA0OC4yIDEyNS4zIDMzLjggMTIzLjY1IDI0LjU1IDExOS4xNSAtMC44NSA5OC4zIC0xNy4yIDc3Ljg1IC0zMy4zIDUyLjIgLTMyLjc1IFoiLz4KPC9nPgo8L2RlZnM+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLCAwLCAwLCAxLCAwLDApICI+Cjx1c2UgeGxpbms6aHJlZj0iI0xheWVyMV8wX0ZJTEwiLz4KPC9nPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC4yOTc4OTczMzg4NjcxODc1LCAwLCAwLCAwLjI5Nzg5NzMzODg2NzE4NzUsIDQwLjQsLTI5LjI1KSAiPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC42MDk0OTcwNzAzMTI1LCAwLCAwLCAwLjYwOTQ5NzA3MDMxMjUsIC0xMDMuOTUsMTYyLjEpICI+Cjx1c2UgeGxpbms6aHJlZj0iI1Jlc3RfRklMTCIvPgo8L2c+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-eighthrest-syncopate.svg":"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMTIwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMjAgMTAwIj4KPGRlZnM+CjxnIGlkPSJMYXllcjFfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSAxMDcuNTUgMy4yNQpMIDEwMi45NSAzLjI1IDEwMi45NSA2Ny43NSAxMDIuNzUgNjcuOApRIDEwMiA2Ny41NSAxMDEuNyA2Ny40IDk2LjggNjUuMDUgOTIuMSA2NS40NSA4NS40IDY2IDgwLjQgNjguOTUgNzYuMiA3MS41NSA3My42IDc0LjQ1IDcwLjYgNzcuODUgNjkuNSA4Mi4xIDY4LjcgODUuMSA3MCA4OC4zNSA3MS4zIDkxLjYgNzMuOSA5My4yNSA3Ny4xIDk1LjE1IDgwLjcgOTUuNjUgODQgOTYgODcuOSA5NS4yIDk2LjYgOTMuNDUgMTAyLjkgODcuMSAxMDcuNSA4Mi4zNSAxMDcuNSA3Ni41NQpMIDEwNy41NSAzLjI1IFoiLz4KPC9nPgo8ZyBpZD0iUmVzdF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSA1Mi4yIC0zMi43NQpRIDI1Ljc1IC0zMi4yIDYuMiAtMTUuMDUgLTEzLjMgMiAtMTguMjUgMjguOCAtMjIuNyA1My4zNSAtMTAgNzUuNTUgMi43IDk3LjcgMjYuODUgMTA3LjYgNjUuNyAxMjMuNjUgMTEyLjcgMTE5LjIgMTI3LjMgMTE3LjggMTU4LjQgMTE0IDE1Ni42IDEyMi4wNSAxNTMuMjUgMTM3LjMgMTUwLjM1IDE1MC42IDE0Ny44NSAxNTkuNDUgMTQ0LjEgMTcyLjg1IDEyNC4wNSAyNDIuMzUgMTA5LjUgMjkyLjkgMTAwLjkgMzI1LjQgOTcuOTUgMzM2LjMgOTYuNDUgMzUxLjIgOTYuMTUgMzU0LjI1IDk0LjUgMzc3LjU1IDk0IDM4My45IDk3LjkgMzg3LjcgMTAxLjYgMzkxLjMgMTA4LjUgMzkyLjE1IDEyMi4zNSAzOTMuOCAxMjcuMSAzODEuMiAxMzAuMDUgMzczLjggMTMxLjUgMzY4Ljk1IDE1OC4xNSAyNzkgMTcxLjQgMjM0IDE5NC41IDE1NS43IDIxMSA5OSAyMjEuMzUgNjMuNzUgMjMxLjkgMTguNjUgMjMyLjcgMTUgMjMxLjQ1IDEwLjA1IDIzMC4wNSA0LjkgMjI3LjY1IDMuNTUgMjI0LjEgMS41IDIxOC43NSAxLjQ1IDIxMy4zNSAxLjMgMjA5Ljc1IDMuMiAyMDUuODUgNS4yNSAyMDEuODUgOS45IDE5OS45IDEyLjMgMTk1LjMgMTguNjUgMTkyLjQ1IDIyLjcgMTg1Ljc1IDMzLjcgMTc5Ljg1IDQzLjM1IDE3NS44IDQ4LjUgMTY1LjM1IDYxLjk1IDE1MS40NSA2OC4zNSAxMzcuODUgNzQuNSAxMjIuNDUgNzMuMzUgMTIzLjggNTYuNCAxMjQuMzUgNDguMiAxMjUuMyAzMy44IDEyMy42NSAyNC41NSAxMTkuMTUgLTAuODUgOTguMyAtMTcuMiA3Ny44NSAtMzMuMyA1Mi4yIC0zMi43NSBaIi8+CjwvZz4KPC9kZWZzPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDAuMjk3ODk3MzM4ODY3MTg3NSwgMCwgMCwgMC4yOTc4OTczMzg4NjcxODc1LCA0MC40LC0yOS4yNSkgIj4KPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDAuNjA5NDk3MDcwMzEyNSwgMCwgMCwgMC42MDk0OTcwNzAzMTI1LCAtMTAzLjk1LDE2Mi4xKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNSZXN0X0ZJTEwiLz4KPC9nPgo8L2c+Cjwvc3ZnPgo=","Wordrhythms-eighthrestnote.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyMHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTIwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gOTUuNSA1LjgKUSA5My42IDQuMiA5My4yIDEuNSA5MS4xIDMuMDUgOTAuOTUgNgpMIDkwLjk1IDcwLjUgOTAuNzUgNzAuNTUKUSA5MCA3MC4zIDg5LjcgNzAuMTUgODQuOCA2Ny44IDgwLjEgNjguMiA3My40IDY4Ljc1IDY4LjQgNzEuNyA2NC4yIDc0LjMgNjEuNiA3Ny4yIDU4LjYgODAuNiA1Ny41IDg0Ljg1IDU2LjcgODcuODUgNTggOTEuMSA1OS4zIDk0LjM1IDYxLjkgOTYgNjUuMSA5Ny45IDY4LjcgOTguNCA3MiA5OC43NSA3NS45IDk3Ljk1IDg0LjYgOTYuMiA5MC45IDg5Ljg1IDk1LjUgODUuMSA5NS41IDc5LjMKTCA5NS41NSAyMi41ClEgOTcuNDUgMjQuNDUgMTAwLjI1IDI3LjE1IDEwMy4wNSAyOS45IDEwNi4yIDMzLjE1IDEwOS4zNSAzNi4zNSAxMTEuODUgNDIuNjUgMTE0LjM1IDQ4LjkgMTE0LjM1IDUyLjY1IDExNC4zIDU2LjQgMTEzLjcgNTkuMyAxMTMuMDUgNjIuMTUgMTExLjg1IDY1LjM1IDExMS4yIDY3LjE1IDEwOS44IDcwLjggMTE0LjUgNjUgMTE2LjkgNTguNDUgMTE5LjkgNTAuMiAxMTguNyA0Mi4yIDExNy40NSAzNC4xNSAxMTEuMjUgMjUgMTA1LjA1IDE1LjggOTUuNSA1LjggWiIvPgo8L2c+Cgo8ZyBpZD0iRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3Rlc183NF9MYXllcjBfMF9GSUxMIj4KPHBhdGggZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJub25lIiBkPSIKTSA1Mi4yIC0zMi43NQpRIDI1Ljc1IC0zMi4yIDYuMiAtMTUuMDUgLTEzLjMgMiAtMTguMjUgMjguOCAtMjIuNyA1My4zNSAtMTAgNzUuNTUgMi43IDk3LjcgMjYuODUgMTA3LjYgNjUuNyAxMjMuNjUgMTEyLjcgMTE5LjIgMTI3LjMgMTE3LjggMTU4LjQgMTE0IDE1Ni42IDEyMi4wNSAxNTMuMjUgMTM3LjMgMTUwLjM1IDE1MC42IDE0Ny44NSAxNTkuNDUgMTQ0LjEgMTcyLjg1IDEyNC4wNSAyNDIuMzUgMTA5LjUgMjkyLjkgMTAwLjkgMzI1LjQgOTcuOTUgMzM2LjMgOTYuNDUgMzUxLjIgOTYuMTUgMzU0LjI1IDk0LjUgMzc3LjU1IDk0IDM4My45IDk3LjkgMzg3LjcgMTAxLjYgMzkxLjMgMTA4LjUgMzkyLjE1IDEyMi4zNSAzOTMuOCAxMjcuMSAzODEuMiAxMzAuMDUgMzczLjggMTMxLjUgMzY4Ljk1IDE1OC4xNSAyNzkgMTcxLjQgMjM0IDE5NC41IDE1NS43IDIxMSA5OSAyMjEuMzUgNjMuNzUgMjMxLjkgMTguNjUgMjMyLjcgMTUgMjMxLjQ1IDEwLjA1IDIzMC4wNSA0LjkgMjI3LjY1IDMuNTUgMjI0LjEgMS41IDIxOC43NSAxLjQ1IDIxMy4zNSAxLjMgMjA5Ljc1IDMuMiAyMDUuODUgNS4yNSAyMDEuODUgOS45IDE5OS45IDEyLjMgMTk1LjMgMTguNjUgMTkyLjQ1IDIyLjcgMTg1Ljc1IDMzLjcgMTc5Ljg1IDQzLjM1IDE3NS44IDQ4LjUgMTY1LjM1IDYxLjk1IDE1MS40NSA2OC4zNSAxMzcuODUgNzQuNSAxMjIuNDUgNzMuMzUgMTIzLjggNTYuNCAxMjQuMzUgNDguMiAxMjUuMyAzMy44IDEyMy42NSAyNC41NSAxMTkuMTUgLTAuODUgOTguMyAtMTcuMiA3Ny44NSAtMzMuMyA1Mi4yIC0zMi43NSBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEsIDAsIDAsIDEsIDAsMCkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIxXzBfRklMTCIvPgo8L2c+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC4yOTc4OTczMzg4NjcxODc1LCAwLCAwLCAwLjI5Nzg5NzMzODg2NzE4NzUsIDQwLjQsLTI5LjI1KSAiPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMC42MDk0OTcwNzAzMTI1LCAwLCAwLCAwLjYwOTQ5NzA3MDMxMjUsIC0xMDMuOTUsMTYyLjEpICI+Cjx1c2UgeGxpbms6aHJlZj0iI0R1cGxpY2F0ZV9JdGVtc19Gb2xkZXJfTm90ZXNfNzRfTGF5ZXIwXzBfRklMTCIvPgo8L2c+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-quarternote.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyMHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTIwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iTGF5ZXIxXzBfRklMTCI+CjxwYXRoIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSIgZD0iCk0gNzguMjUgMy4zCkwgNzMuNjUgMy4zIDczLjY1IDY3LjggNzMuNDUgNjcuODUKUSA3Mi43IDY3LjYgNzIuNCA2Ny40NSA2Ny41IDY1LjEgNjIuOCA2NS41IDU2LjEgNjYuMDUgNTEuMSA2OSA0Ni45IDcxLjYgNDQuMyA3NC41IDQxLjMgNzcuOSA0MC4yIDgyLjE1IDM5LjQgODUuMTUgNDAuNyA4OC40IDQyIDkxLjY1IDQ0LjYgOTMuMyA0Ny44IDk1LjIgNTEuNCA5NS43IDU0LjcgOTYuMDUgNTguNiA5NS4yNSA2Ny4zIDkzLjUgNzMuNiA4Ny4xNSA3OC4yIDgyLjQgNzguMiA3Ni42CkwgNzguMjUgMy4zIFoiLz4KPC9nPgo8L2RlZnM+Cgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCggMSwgMCwgMCwgMSwgMCwwKSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjFfMF9GSUxMIi8+CjwvZz4KPC9zdmc+Cg==","Wordrhythms-quarterrest.svg":"data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjEyMHB4IiBoZWlnaHQ9IjEwMHB4IiB2aWV3Qm94PSIwIDAgMTIwIDEwMCI+CjxkZWZzPgo8ZyBpZD0iRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3RlX2NvcHlfM182X0xheWVyM18wX0ZJTEwiPgo8cGF0aCBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDExNC4zIDkwLjg1ClEgMTE0LjEgODUuOSAxMTAuNiA4MS41NSA5Ny4xIDYzLjk1IDg5LjkgNTUuNTUgODAuODUgNDUuMSA2Ny4xNSAyOS41NQpMIDQxLjE1IDAKUSA0Mi43NSA2LjQgNDUuNTUgMTMuMiA1Mi4xIDI5LjMgNTQuODUgNDAuOCA1OC40NSA1Ni4xIDU3LjI1IDY5Ljg1IDU2Ljk1IDczLjggNTYgNzUuNDUgNDMuMSA5OC41NSAzNi4yNSAxMDkuODUgMjguOTUgMTIyIDEzLjc1IDE0NS45IDEwLjYgMTUxLjEgMTIuMSAxNTguMDUgMTMuNCAxNjMuOSAxNi4yNSAxNzAuMyAxOC40IDE3NS4wNSAyMi4yIDE4MS43NSAzOC44IDIxMS4xNSA2Mi45IDIzNi41CkwgNjcuNzUgMjQxLjkKUSA2My41NSAyNDMgNjEuNiAyNDMuNSA1OC4xNSAyNDQuNCA1NS44NSAyNDQuNyA1MS40IDI0NS4zIDQxLjc1IDI0Ni4zIDMyLjU1IDI0Ny4yNSAyNy43IDI0Ny45IDcuMSAyNTAuOCAyLjQ1IDI3MC4xIDEuOCAyNzIuOCAxLjEgMjc2Ljg1IDAuNzUgMjc5LjEgMCAyODMuNjUKTCAwIDI5NC43NSAwLjQ1IDI5NS41ClEgMS45NSAzMDYuMiA5Ljk1IDMxNy4yNSAxNi4xNSAzMjUuOSAyNS4zIDMzNC4zNSAzMi4zIDM0MC44IDQzLjA1IDM0OC45IDQ0LjQ1IDM0OS45NSA1NS43IDM1Ny45CkwgNTYuMyAzNTcuMzUKUSA1NC45IDM1NC43NSA1NC4xIDM1My41NSA0OC4zIDM0NC4zNSA0NS4zIDMzOS44IDM3Ljc1IDMyOC40IDQxLjM1IDMxNC4xNSA0OC4zNSAyODYuNTUgNzMuNDUgMjgwLjM1IDkwLjk1IDI3NiAxMTAuMyAyODMuMzUgMTE1LjIgMjg1LjI1IDEyNS4yNSAyODkuNyAxMTIuMTUgMjcyLjE1IDExMi4wNSAyNzIgMTAwLjIgMjU1LjY1IDkyLjI1IDI0My4yIDgyLjE1IDIyNy4yNSA3NS4xNSAyMTIuNzUgNzAuNDUgMjAzLjE1IDY5LjIgMTk2LjA1IDY4LjA1IDE4OS4xIDY5LjU1IDE4MS4wNSA3MC42IDE3NSA3My42IDE2Ni41NSA3Ni44NSAxNTcuMzUgODMuMDUgMTQ2LjcgODYgMTQxLjY1IDk0LjggMTI4LjEgMTA1LjE1IDExMi4xNSAxMTEuODUgMTAwLjMgMTE0LjU1IDk1LjUgMTE0LjMgOTAuODUgWiIvPgo8L2c+CjwvZGVmcz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjI5Nzg5NzMzODg2NzE4NzUsIDAsIDAsIDAuMjk3ODk3MzM4ODY3MTg3NSwgNjguNjUsLTMpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLjA1Nzg2MTMyODEyNSwgMCwgMCwgMS4wNTc4NjEzMjgxMjUsIC03Mi4yLDE0LjYpICI+CjxnIHRyYW5zZm9ybT0ibWF0cml4KCAwLjg0ODI5NzExOTE0MDYyNSwgMCwgMCwgMC44NDgyOTcxMTkxNDA2MjUsIDEuMDUsMS4yNSkgIj4KPHVzZSB4bGluazpocmVmPSIjRHVwbGljYXRlX0l0ZW1zX0ZvbGRlcl9Ob3RlX2NvcHlfM182X0xheWVyM18wX0ZJTEwiLz4KPC9nPgo8L2c+CjwvZz4KPC9zdmc+Cg=="};

  function createImage(url) {
    const filename = (url || "").replace(/^assets\//, "");
    const img = document.createElement("img");
    if (SVG_DATA && SVG_DATA[filename]) {
      img.src = SVG_DATA[filename];
    } else {
      img.src = url;
    }
    return img;
  }

  function getLayoutConfig() {
    const activeState = getActiveState();
    const screenWidth = window.innerWidth;
    const num = activeState.timeSignatureNumerator;
    const den = activeState.timeSignatureDenominator;
  
    const beatsPerMeasure = (den === 8) ? num / 3 : num;
  
    let measuresPerLine = 1;
    if (den === 4) { // Simple Time
      switch(num) {
        case 4: measuresPerLine = screenWidth > 750 ? 2 : 1; break;
        case 3: measuresPerLine = screenWidth > 600 ? 2 : 1; break;
        case 2:
          if (screenWidth > 900) measuresPerLine = 4;
          else if (screenWidth > 700) measuresPerLine = 3;
          else if (screenWidth > 500) measuresPerLine = 2;
          break;
        case 6: case 5: measuresPerLine = 1; break;
      }
    } else { // Compound Time
      if (num === 6) {
        measuresPerLine = screenWidth > 600 ? 2 : 1;
      } else {
        measuresPerLine = 1;
      }
    }
    
    return {
      beatsPerMeasure,
      measuresPerLine
    };
  }

  // --- UI ELEMENT SETUP ---

  // --- UI ELEMENT SETUP & SONG STORAGE SYSTEM ---
  const STORAGE_KEY = 'rhythm_poetry_song_library_v2';
  const ACTIVE_SONG_ID_KEY = 'rhythm_poetry_active_song_id_v2';
  let currentSongId = 'instructions';
  let currentSongTitle = 'Instructions';

  const panelToggleButton = document.getElementById('panel-toggle-button');
  const floatingPanel = document.getElementById('floating-panel');
  const settingsGearBtn = document.getElementById('settings-gear-btn');
  const settingsUpperRow = document.getElementById('settings-upper-row');
  const libraryUpperRow = document.getElementById('library-upper-row');
  const saveBtn = document.getElementById('save-btn');

  // Base Controls
  const timeSignatureTopBtn = document.getElementById('time-signature-top-btn');
  const timeSignatureBottomBtn = document.getElementById('time-signature-bottom-btn');
  const timeSignatureButton = timeSignatureTopBtn ? timeSignatureTopBtn.parentElement : null;
  const bpmButton = document.getElementById('bpm-button');
  const bpmValueSpan = document.getElementById('bpm-value');
  const rhythmSystemsDropdown = document.getElementById('rhythm-systems-dropdown');
  const rhythmModeBtn = document.getElementById('rhythm-mode-btn');
  const poetryModeBtn = document.getElementById('poetry-mode-btn');

  function updateTimeSignatureDisplay() {
    const activeState = getActiveState();
    if (timeSignatureTopBtn) timeSignatureTopBtn.textContent = activeState.timeSignatureNumerator;
    if (timeSignatureBottomBtn) timeSignatureBottomBtn.textContent = activeState.timeSignatureDenominator;
    if (timeSignatureButton) timeSignatureButton.classList.toggle('compound', activeState.timeSignatureDenominator === 8);
    if (bpmValueSpan) bpmValueSpan.textContent = activeState.BPM;
  }

  // Song Library & Modal Elements
  const newSongBtn = document.getElementById('newSongBtn');
  const librarySelector = document.getElementById('librarySelector');
  const manageLibraryBtn = document.getElementById('manageLibraryBtn');
  const importExportBtn = document.getElementById('importExportBtn');
  const copyVisualBtn = document.getElementById('copy-visual-btn');
  const textEditorBtn = document.getElementById('textEditorBtn');

  const newSongModal = document.getElementById('newSongModal');
  const newSongTitleInput = document.getElementById('newSongTitleInput');
  const cancelNewSongBtn = document.getElementById('cancelNewSongBtn');
  const saveCurrentSongAsBtn = document.getElementById('saveCurrentSongAsBtn');
  const confirmNewSongBtn = document.getElementById('confirmNewSongBtn');

  const manageLibraryModal = document.getElementById('manageLibraryModal');
  const closeLibraryModalBtn = document.getElementById('closeLibraryModalBtn');
  const doneLibraryBtn = document.getElementById('doneLibraryBtn');
  const libraryAddNewSongBtn = document.getElementById('libraryAddNewSongBtn');
  const librarySongList = document.getElementById('librarySongList');

  const importExportModal = document.getElementById('importExportModal');
  const closeImportExportModalBtn = document.getElementById('closeImportExportModalBtn');
  const closeImportExportBtn = document.getElementById('closeImportExportBtn');
  const generateShareLinkBtn = document.getElementById('generateShareLinkBtn');
  const shareLinkContainer = document.getElementById('shareLinkContainer');
  const shareLinkInput = document.getElementById('shareLinkInput');
  const copyShareLinkBtn = document.getElementById('copyShareLinkBtn');
  const copyShareLinkBtnText = document.getElementById('copyShareLinkBtnText');
  const shareLinkFeedback = document.getElementById('shareLinkFeedback');

  const selectAllExportBtn = document.getElementById('selectAllExportBtn');
  const deselectAllExportBtn = document.getElementById('deselectAllExportBtn');
  const exportSongList = document.getElementById('exportSongList');
  const exportFilenameInput = document.getElementById('exportFilenameInput');
  const confirmExportBtn = document.getElementById('confirmExportBtn');

  const uploadJsonBtn = document.getElementById('uploadJsonBtn');
  const jsonFileInput = document.getElementById('jsonFileInput');
  const uploadStatusMsg = document.getElementById('uploadStatusMsg');
  const resetAllDataBtn = document.getElementById('resetAllDataBtn');
  const resetStatusMsg = document.getElementById('resetStatusMsg');

  function updatePoemMargin() {
    const isPanelCollapsed = floatingPanel.classList.contains('collapsed');
    const isUpperRowOpen = (settingsUpperRow && settingsUpperRow.classList.contains('open')) ||
                           (libraryUpperRow && libraryUpperRow.classList.contains('open'));
    const isSmallScreen = window.innerWidth <= 720;
    
    if (isPanelCollapsed) {
      container.style.marginBottom = '40px';
    } else if (isUpperRowOpen) {
      container.style.marginBottom = isSmallScreen ? '200px' : '140px';
    } else {
      container.style.marginBottom = isSmallScreen ? '150px' : '80px';
    }
  }

  panelToggleButton.addEventListener('click', () => {
    floatingPanel.classList.toggle('collapsed');
    panelToggleButton.classList.toggle('collapsed');
    updatePoemMargin();
  });

  if (settingsGearBtn && settingsUpperRow) {
    settingsGearBtn.addEventListener('click', () => {
      if (libraryUpperRow && libraryUpperRow.classList.contains('open')) {
        libraryUpperRow.classList.remove('open');
        if (saveBtn) saveBtn.classList.remove('active');
      }
      const isOpen = settingsUpperRow.classList.toggle('open');
      settingsGearBtn.classList.toggle('active', isOpen);
      updatePoemMargin();
    });
  }

  if (saveBtn && libraryUpperRow) {
    saveBtn.addEventListener('click', () => {
      if (settingsUpperRow && settingsUpperRow.classList.contains('open')) {
        settingsUpperRow.classList.remove('open');
        if (settingsGearBtn) settingsGearBtn.classList.remove('active');
      }
      const isOpen = libraryUpperRow.classList.toggle('open');
      saveBtn.classList.toggle('active', isOpen);
      updatePoemMargin();
    });
  }

  // --- SONG STORAGE & LIBRARY FUNCTIONS ---
  function getStoredLibrary() {
    let library = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        library = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading library from localStorage:', e);
    }

    if (!library || typeof library !== 'object' || Object.keys(library).length === 0) {
      library = JSON.parse(JSON.stringify(DEFAULT_SONGS));
      saveStoredLibrary(library);
    }

    return library;
  }

  function saveStoredLibrary(library) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    } catch (e) {
      console.error('Error saving library to localStorage:', e);
    }
  }

  function getSortedSongIds(library) {
    if (!library) return [];
    const allIds = Object.keys(library);
    const userIds = [];
    const defaultIds = [];

    allIds.forEach(id => {
      const song = library[id];
      const isDefault = DEFAULT_SONGS[id] !== undefined && !song.isCustom;
      if (isDefault) {
        defaultIds.push(id);
      } else {
        userIds.push(id);
      }
    });

    // Sort user-created songs newest first
    userIds.sort((a, b) => {
      const timeA = (library[a] && library[a].createdAt) || 0;
      const timeB = (library[b] && library[b].createdAt) || 0;
      return timeB - timeA;
    });

    // Keep default songs in standard defined order
    const defaultOrder = Object.keys(DEFAULT_SONGS);
    defaultIds.sort((a, b) => {
      const idxA = defaultOrder.indexOf(a);
      const idxB = defaultOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return 0;
    });

    return [...userIds, ...defaultIds];
  }

  function saveCurrentSongToLibrary() {
    if (!currentSongId) return;
    const library = getStoredLibrary();
    const existing = library[currentSongId] || {};
    const songSnapshot = {
      id: currentSongId,
      title: currentSongTitle || 'Untitled Song',
      mode: currentMode,
      isCustom: existing.isCustom !== undefined ? existing.isCustom : !DEFAULT_SONGS[currentSongId],
      createdAt: existing.createdAt || Date.now(),
      poetryState: {
        words: poetryState.words.slice(),
        rawLyrics: poetryState.rawLyrics ? poetryState.rawLyrics.slice() : [],
        beatSubdivisions: { ...poetryState.beatSubdivisions },
        linkedBeats: { ...poetryState.linkedBeats },
        syncopation: poetryState.syncopation ? poetryState.syncopation.slice() : [],
        syncopationStates: poetryState.syncopationStates ? { ...poetryState.syncopationStates } : {},
        hasPickupMeasure: !!poetryState.hasPickupMeasure,
        BPM: poetryState.BPM,
        timeSignatureNumerator: poetryState.timeSignatureNumerator,
        timeSignatureDenominator: poetryState.timeSignatureDenominator
      },
      rhythmState: {
        beats: JSON.parse(JSON.stringify(rhythmState.beats)),
        beatSubdivisions: { ...rhythmState.beatSubdivisions },
        linkedBeats: { ...rhythmState.linkedBeats },
        hasPickupMeasure: !!rhythmState.hasPickupMeasure,
        BPM: rhythmState.BPM,
        timeSignatureNumerator: rhythmState.timeSignatureNumerator,
        timeSignatureDenominator: rhythmState.timeSignatureDenominator,
        currentRhythmSystem: rhythmState.currentRhythmSystem || 'Simplified Kodály'
      }
    };
    library[currentSongId] = songSnapshot;
    saveStoredLibrary(library);
  }

  function populateLibraryDropdown() {
    if (!librarySelector) return;
    const library = getStoredLibrary();
    librarySelector.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.textContent = 'Library';
    librarySelector.appendChild(defaultOption);

    const songIds = getSortedSongIds(library);
    songIds.forEach(id => {
      const song = library[id];
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = song.title || id;
      if (id === currentSongId) {
        opt.selected = true;
      }
      librarySelector.appendChild(opt);
    });

    if (currentSongId && library[currentSongId]) {
      librarySelector.value = currentSongId;
    } else if (songIds.length > 0) {
      currentSongId = songIds[0];
      librarySelector.value = currentSongId;
    }
  }

  function loadSongById(songId) {
    const library = getStoredLibrary();
    let song = library[songId];
    if (!song && DEFAULT_SONGS[songId]) {
      song = JSON.parse(JSON.stringify(DEFAULT_SONGS[songId]));
      library[songId] = song;
      saveStoredLibrary(library);
    }
    if (!song) return;

    currentSongId = songId;
    currentSongTitle = song.title;
    localStorage.setItem(ACTIVE_SONG_ID_KEY, songId);

    poetryState.selectedPlayStartPosition = null;

    if (song.poetryState) {
      poetryState.words = (song.poetryState.words && song.poetryState.words.length > 0)
        ? song.poetryState.words.slice()
        : ['Press', 'the', 'lyrics', 'to', 'edit.'];
      poetryState.rawLyrics = (song.poetryState.rawLyrics && song.poetryState.rawLyrics.length > 0)
        ? song.poetryState.rawLyrics.slice()
        : poetryState.words.filter(w => w && w !== '-' && w.trim() !== '');
      poetryState.beatSubdivisions = song.poetryState.beatSubdivisions ? { ...song.poetryState.beatSubdivisions } : {};
      poetryState.linkedBeats = song.poetryState.linkedBeats ? { ...song.poetryState.linkedBeats } : {};
      poetryState.syncopation = song.poetryState.syncopation ? song.poetryState.syncopation.slice() : [];
      poetryState.syncopationStates = song.poetryState.syncopationStates ? { ...song.poetryState.syncopationStates } : {};
      poetryState.hasPickupMeasure = !!song.poetryState.hasPickupMeasure;
      poetryState.BPM = song.poetryState.BPM || 82;
      poetryState.timeSignatureNumerator = song.poetryState.timeSignatureNumerator || 4;
      poetryState.timeSignatureDenominator = song.poetryState.timeSignatureDenominator || 4;
    } else if (song.words) {
      poetryState.words = Array.isArray(song.words) ? song.words.slice() : song.words.split(/\s+/);
      poetryState.rawLyrics = poetryState.words.filter(w => w && w !== '-' && w.trim() !== '');
      poetryState.beatSubdivisions = {};
      poetryState.linkedBeats = {};
      poetryState.syncopation = song.syncopation ? song.syncopation.slice() : [];
      poetryState.syncopationStates = song.syncopationStates ? { ...song.syncopationStates } : {};
      poetryState.hasPickupMeasure = !!song.pickup;
      poetryState.BPM = song.bpm || 82;
      poetryState.timeSignatureNumerator = song.numerator || 4;
      poetryState.timeSignatureDenominator = song.denominator || 4;
    }

    // Ensure poetryState.words fills complete measures
    const config = getLayoutConfig();
    const beatsPerMeasure = config.beatsPerMeasure;
    const defaultSub = (poetryState.timeSignatureDenominator === 8) ? 3 : 2;
    const beatsNeeded = Math.ceil(poetryState.words.length / defaultSub);
    const totalBeats = Math.max(beatsPerMeasure, Math.ceil(beatsNeeded / beatsPerMeasure) * beatsPerMeasure);
    const totalSlots = totalBeats * defaultSub;
    while (poetryState.words.length < totalSlots) {
      poetryState.words.push('-');
    }

    poetryState.canonical12 = toCanonical12(poetryState.words);
    poetryState.words = fromCanonical12(poetryState.canonical12);

    if (song.rhythmState && song.rhythmState.beats && song.rhythmState.beats.length > 0) {
      rhythmState.beats = JSON.parse(JSON.stringify(song.rhythmState.beats));
      rhythmState.beatSubdivisions = song.rhythmState.beatSubdivisions ? { ...song.rhythmState.beatSubdivisions } : {};
      rhythmState.linkedBeats = song.rhythmState.linkedBeats ? { ...song.rhythmState.linkedBeats } : {};
      rhythmState.hasPickupMeasure = !!song.rhythmState.hasPickupMeasure;
      rhythmState.BPM = song.rhythmState.BPM || 82;
      rhythmState.timeSignatureNumerator = song.rhythmState.timeSignatureNumerator || 4;
      rhythmState.timeSignatureDenominator = song.rhythmState.timeSignatureDenominator || 4;
      rhythmState.currentRhythmSystem = song.rhythmState.currentRhythmSystem || 'Simplified Kodály';
    } else {
      const sub = (poetryState.timeSignatureDenominator === 8) ? 3 : 2;
      rhythmState.beats = [];
      for (let b = 0; b < totalBeats; b++) {
        const bArr = [];
        for (let s = 0; s < sub; s++) {
          const w = poetryState.words[b * sub + s];
          bArr.push(w !== undefined && w !== '-' && w !== '');
        }
        rhythmState.beats.push(bArr);
      }
      rhythmState.beatSubdivisions = { ...poetryState.beatSubdivisions };
      rhythmState.linkedBeats = { ...poetryState.linkedBeats };
      rhythmState.hasPickupMeasure = poetryState.hasPickupMeasure;
      rhythmState.BPM = poetryState.BPM;
      rhythmState.timeSignatureNumerator = poetryState.timeSignatureNumerator;
      rhythmState.timeSignatureDenominator = poetryState.timeSignatureDenominator;
      rhythmState.currentRhythmSystem = 'Simplified Kodály';
    }

    if (rhythmSystemsDropdown) {
      rhythmSystemsDropdown.value = rhythmState.currentRhythmSystem || 'Simplified Kodály';
    }

    if (librarySelector) {
      librarySelector.value = songId;
    }

    // Switch mode based on saved song mode (opens rhythm or poetry view)
    const targetMode = song.mode || 'poetry';
    setMode(targetMode);
  }

  if (librarySelector) {
    librarySelector.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      if (selectedId) {
        saveCurrentSongToLibrary();
        loadSongById(selectedId);
      }
    });
  }

  if (rhythmSystemsDropdown) {
    rhythmSystemsDropdown.addEventListener('change', (e) => {
      rhythmState.currentRhythmSystem = e.target.value;
      saveCurrentSongToLibrary();
      render();
    });
  }

  // --- CREATE NEW SONG MODAL FUNCTIONS ---
  function updateNewSongModalTexts() {
    const isRhythm = currentMode === 'rhythm';
    const heading = document.getElementById('newSongModalHeading');
    const subtext = document.getElementById('newSongModalSubtext');
    if (heading) heading.textContent = isRhythm ? 'Create a New Rhythm' : 'Create a New Song';
    if (subtext) subtext.textContent = isRhythm ? 'Enter a title for your new rhythm:' : 'Enter a title for your new song:';
    if (newSongTitleInput) newSongTitleInput.placeholder = isRhythm ? 'e.g. My New Rhythm' : 'e.g. My New Rhythm Poem';
    if (saveCurrentSongAsBtn) saveCurrentSongAsBtn.textContent = isRhythm ? 'Save Current Rhythm as...' : 'Save Current Song as...';
    if (confirmNewSongBtn) confirmNewSongBtn.textContent = isRhythm ? 'Create New Rhythm' : 'Create New Song';
    if (newSongBtn) newSongBtn.title = isRhythm ? 'Create a new rhythm' : 'Create a new song';
    if (libraryAddNewSongBtn) libraryAddNewSongBtn.textContent = isRhythm ? '+ New Rhythm' : '+ New Song';
  }

  // --- CREATE NEW SONG MODAL FUNCTIONS ---
  function showNewSongModal() {
    if (!newSongModal) return;
    updateNewSongModalTexts();
    newSongTitleInput.value = '';
    newSongTitleInput.classList.remove('input-error');
    const modalContent = newSongModal.querySelector('.popup-content');
    if (modalContent) modalContent.classList.remove('shake');
    newSongModal.classList.add('show');
    setTimeout(() => newSongTitleInput.focus(), 60);
  }

  function hideNewSongModal() {
    if (!newSongModal) return;
    newSongModal.classList.remove('show');
    newSongTitleInput.value = '';
    newSongTitleInput.classList.remove('input-error');
    const modalContent = newSongModal.querySelector('.popup-content');
    if (modalContent) modalContent.classList.remove('shake');
  }

  function createNewSong(title) {
    const trimmed = (title && title.trim()) ? title.trim() : '';

    if (trimmed) {
      const id = 'song_' + Date.now();
      const newSongData = {
        id: id,
        title: trimmed,
        mode: currentMode,
        isCustom: true,
        createdAt: Date.now(),
        poetryState: {
          words: ['Start', 'Here'],
          rawLyrics: ['Start', 'Here'],
          beatSubdivisions: {},
          linkedBeats: {},
          syncopation: [],
          syncopationStates: {},
          hasPickupMeasure: false,
          BPM: 82,
          timeSignatureNumerator: 4,
          timeSignatureDenominator: 4
        },
        rhythmState: {
          beats: Array.from({ length: 4 }, () => [true, true]),
          beatSubdivisions: {},
          linkedBeats: {},
          hasPickupMeasure: false,
          BPM: 82,
          timeSignatureNumerator: 4,
          timeSignatureDenominator: 4,
          currentRhythmSystem: rhythmState.currentRhythmSystem || 'Simplified Kodály'
        }
      };

      saveCurrentSongToLibrary();
      const library = getStoredLibrary();
      library[id] = newSongData;
      saveStoredLibrary(library);
      populateLibraryDropdown();

      hideNewSongModal();
      hideManageLibraryModal();
      loadSongById(id);
    } else {
      saveCurrentSongToLibrary();

      currentSongId = null;
      currentSongTitle = '';
      localStorage.removeItem(ACTIVE_SONG_ID_KEY);

      poetryState.words = ['Start', 'Here', '-', '-', '-', '-', '-', '-'];
      poetryState.rawLyrics = ['Start', 'Here'];
      poetryState.beatSubdivisions = {};
      poetryState.linkedBeats = {};
      poetryState.syncopation = [];
      poetryState.syncopationStates = {};
      poetryState.hasPickupMeasure = false;
      poetryState.BPM = 82;
      poetryState.timeSignatureNumerator = 4;
      poetryState.timeSignatureDenominator = 4;
      poetryState.canonical12 = toCanonical12(poetryState.words);
      poetryState.words = fromCanonical12(poetryState.canonical12);

      rhythmState.beats = Array.from({ length: 4 }, () => [true, true]);
      rhythmState.beatSubdivisions = {};
      rhythmState.linkedBeats = {};
      rhythmState.hasPickupMeasure = false;
      rhythmState.BPM = 82;
      rhythmState.timeSignatureNumerator = 4;
      rhythmState.timeSignatureDenominator = 4;
      rhythmState.currentRhythmSystem = rhythmState.currentRhythmSystem || 'Simplified Kodály';

      if (librarySelector) {
        librarySelector.value = '';
      }

      hideNewSongModal();
      hideManageLibraryModal();
      updateTimeSignatureDisplay();
      render();
    }
  }

  function saveCurrentSongAs(title) {
    const trimmed = (title && title.trim()) ? title.trim() : '';
    if (!trimmed) {
      if (newSongTitleInput) {
        newSongTitleInput.classList.add('input-error');
        newSongTitleInput.focus();
      }
      const modalContent = newSongModal ? newSongModal.querySelector('.popup-content') : null;
      if (modalContent) {
        modalContent.classList.remove('shake');
        void modalContent.offsetWidth;
        modalContent.classList.add('shake');
        setTimeout(() => {
          modalContent.classList.remove('shake');
        }, 500);
      }
      return;
    }

    const id = 'song_' + Date.now();
    const newSongData = {
      id: id,
      title: trimmed,
      mode: currentMode,
      isCustom: true,
      createdAt: Date.now(),
      poetryState: {
        words: poetryState.words.slice(),
        rawLyrics: poetryState.rawLyrics ? poetryState.rawLyrics.slice() : [],
        beatSubdivisions: { ...poetryState.beatSubdivisions },
        linkedBeats: { ...poetryState.linkedBeats },
        syncopation: poetryState.syncopation ? poetryState.syncopation.slice() : [],
        syncopationStates: poetryState.syncopationStates ? { ...poetryState.syncopationStates } : {},
        hasPickupMeasure: !!poetryState.hasPickupMeasure,
        BPM: poetryState.BPM,
        timeSignatureNumerator: poetryState.timeSignatureNumerator,
        timeSignatureDenominator: poetryState.timeSignatureDenominator
      },
      rhythmState: {
        beats: JSON.parse(JSON.stringify(rhythmState.beats)),
        beatSubdivisions: { ...rhythmState.beatSubdivisions },
        linkedBeats: { ...rhythmState.linkedBeats },
        hasPickupMeasure: !!rhythmState.hasPickupMeasure,
        BPM: rhythmState.BPM,
        timeSignatureNumerator: rhythmState.timeSignatureNumerator,
        timeSignatureDenominator: rhythmState.timeSignatureDenominator,
        currentRhythmSystem: rhythmState.currentRhythmSystem || 'Simplified Kodály'
      }
    };

    const library = getStoredLibrary();
    library[id] = newSongData;
    saveStoredLibrary(library);

    currentSongId = id;
    currentSongTitle = trimmed;
    localStorage.setItem(ACTIVE_SONG_ID_KEY, id);

    populateLibraryDropdown();
    hideNewSongModal();
    hideManageLibraryModal();
    loadSongById(id);
  }

  // --- MANAGE LIBRARY MODAL FUNCTIONS ---
  function showManageLibraryModal() {
    saveCurrentSongToLibrary();
    renderLibrarySongList();
    if (manageLibraryModal) manageLibraryModal.classList.add('show');
  }

  function hideManageLibraryModal() {
    if (manageLibraryModal) manageLibraryModal.classList.remove('show');
  }

  function renderLibrarySongList() {
    if (!librarySongList) return;
    const library = getStoredLibrary();
    librarySongList.innerHTML = '';

    const songIds = getSortedSongIds(library);
    if (songIds.length === 0) {
      librarySongList.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">No saved songs in library.</div>';
      return;
    }

    songIds.forEach(id => {
      const song = library[id];
      const isCurrent = id === currentSongId;
      const isRhythmSong = (song.mode === 'rhythm');
      
      const targetState = isRhythmSong ? (song.rhythmState || {}) : (song.poetryState || {});
      const num = targetState.timeSignatureNumerator || 4;
      const den = targetState.timeSignatureDenominator || 4;
      const timeSig = `${num}/${den}`;

      const itemDiv = document.createElement('div');
      itemDiv.className = `library-song-item ${isCurrent ? 'active-song' : ''}`;

      const infoDiv = document.createElement('div');
      infoDiv.className = 'library-song-info';

      const badge = document.createElement('span');
      badge.className = `library-song-badge ${isRhythmSong ? 'badge-rhythm' : 'badge-poetry'}`;
      badge.textContent = timeSig;
      badge.title = isRhythmSong ? 'Rhythm Song (Saved in Rhythm mode)' : 'Poetry Song (Saved in Poetry mode)';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'library-song-title';
      titleSpan.textContent = song.title;

      infoDiv.appendChild(badge);
      infoDiv.appendChild(titleSpan);

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'library-song-actions';

      const loadBtn = document.createElement('button');
      loadBtn.className = 'lib-action-btn load-btn';
      loadBtn.textContent = isCurrent ? 'Active' : 'Load';
      if (!isCurrent) {
        loadBtn.addEventListener('click', () => {
          saveCurrentSongToLibrary();
          loadSongById(id);
          hideManageLibraryModal();
        });
      } else {
        loadBtn.style.opacity = '0.7';
        loadBtn.style.cursor = 'default';
      }

      const renameBtn = document.createElement('button');
      renameBtn.className = 'lib-action-btn';
      renameBtn.textContent = 'Rename';
      renameBtn.title = 'Rename song';
      renameBtn.addEventListener('click', () => {
        const newTitle = prompt('Enter new song title:', song.title);
        if (newTitle && newTitle.trim()) {
          library[id].title = newTitle.trim();
          saveStoredLibrary(library);
          if (id === currentSongId) {
            currentSongTitle = newTitle.trim();
          }
          populateLibraryDropdown();
          renderLibrarySongList();
        }
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'lib-action-btn delete-btn-item';
      deleteBtn.innerHTML = '✕';
      deleteBtn.title = 'Delete song';
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Delete "${song.title}" from your library?`)) {
          const currentLib = getStoredLibrary();
          delete currentLib[id];
          saveStoredLibrary(currentLib);
          const remainingIds = getSortedSongIds(currentLib);
          if (id === currentSongId) {
            currentSongId = null;
            if (remainingIds.length > 0) {
              loadSongById(remainingIds[0]);
            } else {
              createNewSong('Instructions');
            }
          }
          populateLibraryDropdown();
          renderLibrarySongList();
        }
      });

      actionsDiv.appendChild(loadBtn);
      actionsDiv.appendChild(renameBtn);
      actionsDiv.appendChild(deleteBtn);

      itemDiv.appendChild(infoDiv);
      itemDiv.appendChild(actionsDiv);
      librarySongList.appendChild(itemDiv);
    });
  }

  // --- DOWNLOAD & UPLOAD (JSON IMPORT/EXPORT) & SHARE LINK ---
  function encodeSongToUrl(songData) {
    const jsonStr = JSON.stringify(songData);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary);
  }

  function decodeSongFromUrl(base64Str) {
    try {
      const binary = atob(base64Str);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const jsonStr = new TextDecoder().decode(bytes);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Error decoding song from URL:', e);
      return null;
    }
  }

  function generateShareLink(songData) {
    const encoded = encodeSongToUrl(songData);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?song=${encodeURIComponent(encoded)}`;
  }

  function copyShareLink() {
    if (!shareLinkInput || !shareLinkInput.value) return;
    navigator.clipboard.writeText(shareLinkInput.value).then(() => {
      if (copyShareLinkBtn) copyShareLinkBtn.classList.add('copied');
      if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = 'Copied!';
      if (shareLinkFeedback) shareLinkFeedback.textContent = '✓ Link copied to clipboard!';
      setTimeout(() => {
        if (copyShareLinkBtn) copyShareLinkBtn.classList.remove('copied');
        if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = 'Copy Link';
      }, 2500);
    }).catch(err => {
      shareLinkInput.focus();
      shareLinkInput.select();
      if (shareLinkFeedback) shareLinkFeedback.textContent = 'Select and copy the link above.';
    });
  }

  function handleShareCurrentSong() {
    saveCurrentSongToLibrary();
    const songData = {
      title: currentSongTitle || 'Shared Song',
      mode: currentMode,
      poetryState: {
        words: poetryState.words.slice(),
        rawLyrics: poetryState.rawLyrics ? poetryState.rawLyrics.slice() : [],
        beatSubdivisions: { ...poetryState.beatSubdivisions },
        linkedBeats: { ...poetryState.linkedBeats },
        syncopation: poetryState.syncopation ? poetryState.syncopation.slice() : [],
        syncopationStates: poetryState.syncopationStates ? { ...poetryState.syncopationStates } : {},
        hasPickupMeasure: !!poetryState.hasPickupMeasure,
        BPM: poetryState.BPM,
        timeSignatureNumerator: poetryState.timeSignatureNumerator,
        timeSignatureDenominator: poetryState.timeSignatureDenominator
      },
      rhythmState: {
        beats: JSON.parse(JSON.stringify(rhythmState.beats)),
        beatSubdivisions: { ...rhythmState.beatSubdivisions },
        linkedBeats: { ...rhythmState.linkedBeats },
        hasPickupMeasure: !!rhythmState.hasPickupMeasure,
        BPM: rhythmState.BPM,
        timeSignatureNumerator: rhythmState.timeSignatureNumerator,
        timeSignatureDenominator: rhythmState.timeSignatureDenominator,
        currentRhythmSystem: rhythmState.currentRhythmSystem || 'Simplified Kodály'
      }
    };

    const link = generateShareLink(songData);
    if (shareLinkInput) {
      shareLinkInput.value = link;
    }
    if (shareLinkContainer) {
      shareLinkContainer.style.display = 'block';
    }

    navigator.clipboard.writeText(link).then(() => {
      if (copyShareLinkBtn) copyShareLinkBtn.classList.add('copied');
      if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = 'Copied!';
      if (shareLinkFeedback) shareLinkFeedback.textContent = '✓ Link copied to clipboard!';
      setTimeout(() => {
        if (copyShareLinkBtn) copyShareLinkBtn.classList.remove('copied');
        if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = 'Copy Link';
      }, 2500);
    }).catch(err => {
      shareLinkInput.focus();
      shareLinkInput.select();
      if (shareLinkFeedback) shareLinkFeedback.textContent = 'Select and copy the link above.';
    });
  }

  function showImportExportModal() {
    saveCurrentSongToLibrary();
    if (uploadStatusMsg) {
      uploadStatusMsg.textContent = '';
      uploadStatusMsg.className = 'upload-status-msg';
    }
    if (shareLinkContainer) {
      shareLinkContainer.style.display = 'none';
    }
    if (shareLinkFeedback) {
      shareLinkFeedback.textContent = '';
    }
    if (exportFilenameInput) {
      const cleanTitle = (currentSongTitle || 'rhythm-poetry-library').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      exportFilenameInput.value = cleanTitle ? `${cleanTitle}-backup` : 'rhythm-poetry-backup';
    }
    renderExportSongList();
    if (importExportModal) importExportModal.classList.add('show');
  }

  function hideImportExportModal() {
    if (importExportModal) importExportModal.classList.remove('show');
    if (jsonFileInput) jsonFileInput.value = '';
    if (shareLinkContainer) shareLinkContainer.style.display = 'none';
  }

  function renderExportSongList() {
    if (!exportSongList) return;
    const library = getStoredLibrary();
    exportSongList.innerHTML = '';

    const songIds = getSortedSongIds(library);
    if (songIds.length === 0) {
      exportSongList.innerHTML = '<div style="padding: 10px; color: #888; font-size: 13px; text-align: center;">No songs available to export.</div>';
      return;
    }

    songIds.forEach(id => {
      const song = library[id];
      const isRhythmSong = (song.mode === 'rhythm');
      const targetState = isRhythmSong ? (song.rhythmState || {}) : (song.poetryState || {});
      const num = targetState.timeSignatureNumerator || 4;
      const den = targetState.timeSignatureDenominator || 4;
      const timeSig = `${num}/${den}`;

      const label = document.createElement('label');
      label.className = 'export-song-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = id;
      checkbox.checked = true;

      const infoDiv = document.createElement('div');
      infoDiv.className = 'export-song-item-info';

      const badge = document.createElement('span');
      badge.className = `library-song-badge ${isRhythmSong ? 'badge-rhythm' : 'badge-poetry'}`;
      badge.textContent = timeSig;

      const title = document.createElement('span');
      title.className = 'export-song-title';
      title.textContent = song.title;

      infoDiv.appendChild(badge);
      infoDiv.appendChild(title);

      label.appendChild(checkbox);
      label.appendChild(infoDiv);
      exportSongList.appendChild(label);
    });
  }

  function setAllExportCheckboxes(checked) {
    if (!exportSongList) return;
    const checkboxes = exportSongList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = checked);
  }

  function handleExportDownload() {
    if (!exportSongList) return;
    const library = getStoredLibrary();
    const checkboxes = exportSongList.querySelectorAll('input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) {
      alert('Please select at least one song to download.');
      return;
    }

    const selectedSongs = [];
    checkboxes.forEach(cb => {
      const songId = cb.value;
      if (library[songId]) {
        selectedSongs.push(library[songId]);
      }
    });

    const exportData = {
      app: "Eagle View Music Rhythm Poetry 1.0",
      version: 1,
      exportedAt: new Date().toISOString(),
      count: selectedSongs.length,
      songs: selectedSongs
    };

    let filename = exportFilenameInput ? exportFilenameInput.value.trim() : 'rhythm-poetry-library';
    if (!filename) filename = 'rhythm-poetry-library';
    if (!filename.endsWith('.json')) filename += '.json';

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const json = JSON.parse(e.target.result);
        let importedSongs = [];

        if (Array.isArray(json)) {
          importedSongs = json;
        } else if (json && Array.isArray(json.songs)) {
          importedSongs = json.songs;
        } else if (json && typeof json === 'object') {
          Object.keys(json).forEach(k => {
            if (json[k] && typeof json[k] === 'object' && (json[k].poetryState || json[k].rhythmState || json[k].words || json[k].title)) {
              importedSongs.push(json[k]);
            }
          });
        }

        if (importedSongs.length === 0) {
          if (uploadStatusMsg) {
            uploadStatusMsg.textContent = 'No valid songs found in file.';
            uploadStatusMsg.className = 'upload-status-msg error';
          }
          return;
        }

        const library = getStoredLibrary();
        let addedCount = 0;

        importedSongs.forEach(song => {
          if (song && (song.title || song.poetryState || song.rhythmState || song.words)) {
            const title = (song.title && song.title.trim()) ? song.title.trim() : 'Imported Song';
            let id = song.id || ('song_' + Date.now() + '_' + Math.floor(Math.random() * 1000));
            if (library[id]) {
              id = 'song_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            }

            library[id] = {
              id: id,
              title: title,
              mode: song.mode || 'rhythm',
              poetryState: song.poetryState || {
                words: song.words || ['Start', 'Here'],
                rawLyrics: song.words || ['Start', 'Here'],
                BPM: song.bpm || 82,
                timeSignatureNumerator: 4,
                timeSignatureDenominator: 4
              },
              rhythmState: song.rhythmState || {
                beats: Array.from({ length: 4 }, () => [true, true]),
                BPM: song.bpm || 82,
                timeSignatureNumerator: 4,
                timeSignatureDenominator: 4
              }
            };
            addedCount++;
          }
        });

        saveStoredLibrary(library);
        populateLibraryDropdown();
        renderExportSongList();

        if (uploadStatusMsg) {
          uploadStatusMsg.textContent = `✓ Successfully imported ${addedCount} song${addedCount > 1 ? 's' : ''}!`;
          uploadStatusMsg.className = 'upload-status-msg';
        }

        jsonFileInput.value = '';
      } catch (err) {
        console.error('Error parsing JSON file:', err);
        if (uploadStatusMsg) {
          uploadStatusMsg.textContent = 'Invalid JSON file format.';
          uploadStatusMsg.className = 'upload-status-msg error';
        }
      }
    };
    reader.readAsText(file);
  }

  function handleResetAllUserData() {
    const confirmed = confirm("Are you sure you want to delete all user data and restore the app to its default settings? This will delete all custom songs and cannot be undone.");
    if (!confirmed) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_SONG_ID_KEY);

      const library = getStoredLibrary();
      currentSongId = 'instructions';
      currentSongTitle = 'Instructions';
      localStorage.setItem(ACTIVE_SONG_ID_KEY, 'instructions');

      populateLibraryDropdown();
      loadSongById('instructions');
      renderLibrarySongList();
      renderExportSongList();

      if (resetStatusMsg) {
        resetStatusMsg.textContent = '✓ All user data deleted. Restored to defaults!';
        resetStatusMsg.className = 'reset-status-msg success';
        setTimeout(() => {
          resetStatusMsg.textContent = '';
          hideImportExportModal();
        }, 1200);
      } else {
        hideImportExportModal();
      }
    } catch (err) {
      console.error('Error resetting user data:', err);
      if (resetStatusMsg) {
        resetStatusMsg.textContent = 'Failed to reset user data.';
        resetStatusMsg.className = 'reset-status-msg error';
      }
    }
  }

  function checkUrlForSharedSong() {
    let sharedSong = null;
    if (window.location.hash) {
      const hashStr = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
      const hashParams = new URLSearchParams(hashStr);
      if (hashParams.has('song')) {
        sharedSong = decodeSongFromUrl(hashParams.get('song'));
      }
    }
    if (!sharedSong) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('song')) {
        sharedSong = decodeSongFromUrl(urlParams.get('song'));
      }
    }
    return sharedSong;
  }

  // Mode Toggle: Left is Rhythm, Right is Poetry
  function setMode(mode) {
    currentMode = mode;
    const isRhythm = mode === 'rhythm';

    if (rhythmModeBtn) rhythmModeBtn.classList.toggle('active', isRhythm);
    if (poetryModeBtn) poetryModeBtn.classList.toggle('active', !isRhythm);
    if (rhythmSystemsDropdown) rhythmSystemsDropdown.classList.toggle('hidden', !isRhythm);
    if (textEditorBtn) textEditorBtn.classList.toggle('hidden', isRhythm);

    updateTimeSignatureDisplay();
    updateNewSongModalTexts();
    render();
  }

  if (rhythmModeBtn) {
    rhythmModeBtn.addEventListener('click', () => {
      if (currentMode !== 'rhythm') {
        setMode('rhythm');
      }
    });
  }

  if (poetryModeBtn) {
    poetryModeBtn.addEventListener('click', () => {
      if (currentMode !== 'poetry') {
        setMode('poetry');
      }
    });
  }

  // Circle icon button
  const circleIcon = document.getElementById('circle-icon');
  if (circleIcon) {
    circleIcon.addEventListener('click', () => {
      circleIconActive = !circleIconActive;
      circleIcon.className = `icon-button ${circleIconActive ? 'active' : 'inactive'}`;
      updateCircleVisibility();
    });
  }

  // Time Signature Controls
  if (timeSignatureTopBtn) {
    timeSignatureTopBtn.addEventListener('click', () => {
      const activeState = getActiveState();
      if (activeState.timeSignatureDenominator === 4) {
        switch(activeState.timeSignatureNumerator) {
          case 4: activeState.timeSignatureNumerator = 3; break;
          case 3: activeState.timeSignatureNumerator = 2; break;
          case 2: activeState.timeSignatureNumerator = 6; break;
          case 6: activeState.timeSignatureNumerator = 5; break;
          case 5: activeState.timeSignatureNumerator = 4; break;
          default: activeState.timeSignatureNumerator = 4;
        }
      } else {
        switch(activeState.timeSignatureNumerator) {
          case 6: activeState.timeSignatureNumerator = 9; break;
          case 9: activeState.timeSignatureNumerator = 12; break;
          case 12: activeState.timeSignatureNumerator = 6; break;
          default: activeState.timeSignatureNumerator = 6;
        }
      }
      updateTimeSignatureDisplay();
      render();
    });
  }

  if (timeSignatureBottomBtn) {
    timeSignatureBottomBtn.addEventListener('click', () => {
      const activeState = getActiveState();
      if (currentMode === 'poetry') {
        poetryState.canonical12 = mergeViewIntoCanonical(poetryState.canonical12, poetryState.words);
        if (poetryState.timeSignatureDenominator === 4) {
          poetryState.timeSignatureDenominator = 8;
          poetryState.timeSignatureNumerator = 6;
          poetryState.linkedBeats = {};
        } else {
          poetryState.timeSignatureDenominator = 4;
          poetryState.timeSignatureNumerator = 4;
          poetryState.linkedBeats = {};
        }
        poetryState.words = fromCanonical12(poetryState.canonical12);
      } else {
        if (rhythmState.timeSignatureDenominator === 4) {
          rhythmState.timeSignatureDenominator = 8;
          rhythmState.timeSignatureNumerator = 6;
          rhythmState.beatSubdivisions = {};
          rhythmState.linkedBeats = {};
          rhythmState.beats = rhythmState.beats.map(b => [b[0] ?? true, b[1] ?? true, false]);
        } else {
          rhythmState.timeSignatureDenominator = 4;
          rhythmState.timeSignatureNumerator = 4;
          rhythmState.beatSubdivisions = {};
          rhythmState.linkedBeats = {};
          rhythmState.beats = rhythmState.beats.map(b => [b[0] ?? true, b[1] ?? true]);
        }
      }

      updateTimeSignatureDisplay();
      render();
    });
  }

  // BPM Control
  if (bpmButton) {
    bpmButton.addEventListener('click', () => {
      const activeState = getActiveState();
      const currentBPM = activeState.BPM;
      const input = document.createElement('input');
      input.type = 'number';
      input.value = currentBPM;
      input.className = 'bpm-input';
      
      bpmButton.innerHTML = '';
      bpmButton.appendChild(input);
      input.focus();
      input.select();

      const onUpdate = () => {
        let newValue = parseInt(input.value, 10);
        if (isNaN(newValue) || newValue <= 20) {
          newValue = 82;
        }
        if (newValue > 600) {
          newValue = 600;
        }
        activeState.BPM = newValue;
        bpmValueSpan.textContent = activeState.BPM;
        bpmButton.innerHTML = '';
        bpmButton.appendChild(bpmValueSpan);
        bpmButton.append('\u00A0BPM');
      };

      input.addEventListener('blur', onUpdate);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        } else if (e.key === 'Escape') {
          input.value = currentBPM;
          input.blur();
        }
      });
    });
  }

  // Play button
  const playButton = document.getElementById('play-button');
  playButton.addEventListener('click', () => {
    if (isPlaying) stopPlayback(); else startPlayback();
  });

  // Sound Toggle Buttons
  const beatToggle = document.getElementById('beat-toggle');
  const rhythmToggle = document.getElementById('rhythm-toggle');
  const introToggle = document.getElementById('intro-toggle');
  const pitchToggle = document.getElementById('pitch-toggle');

  beatToggle.addEventListener('click', () => {
    beatEnabled = !beatEnabled;
    beatToggle.classList.toggle('active', beatEnabled);
  });

  rhythmToggle.addEventListener('click', () => {
    rhythmEnabled = !rhythmEnabled;
    rhythmToggle.classList.toggle('active', rhythmEnabled);
  });

  introToggle.addEventListener('click', () => {
    introEnabled = !introEnabled;
    introToggle.classList.toggle('active', introEnabled);
  });

  pitchToggle.addEventListener('click', () => {
    if (pitchMode === 'pitch') {
        pitchMode = 'drum';
        pitchToggle.textContent = 'Drum';
        pitchToggle.classList.remove('pitch');
        pitchToggle.classList.add('drum');
    } else {
        pitchMode = 'pitch';
        pitchToggle.textContent = 'Pitch';
        pitchToggle.classList.remove('drum');
        pitchToggle.classList.add('pitch');
    }
  });
  
  pitchToggle.classList.add('pitch');

  // Copy Visual button
  if (copyVisualBtn) copyVisualBtn.addEventListener('click', captureVisual);

  // Text Editor modal setup
  const textInputModal = document.getElementById('text-input-modal');
  const multiLineInput = document.getElementById('multi-line-input');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalSubmitBtn = document.getElementById('modal-submit-btn');
  const modalCopyBtn = document.getElementById('modal-copy-btn');
  const toggleAddBtn = document.getElementById('toggle-add-btn');
  const toggleReplaceBtn = document.getElementById('toggle-replace-btn');

  function openTextInputModal() {
    multiLineInput.value = wordsToText();
    textInputModal.style.display = 'flex';
  }

  function closeTextInputModal() {
    textInputModal.style.display = 'none';
  }

  if (textEditorBtn) textEditorBtn.addEventListener('click', openTextInputModal);

  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeTextInputModal);
  let modalMousedownOnBackdrop = false;
  if (textInputModal) {
    textInputModal.addEventListener('mousedown', e => {
      if (e.target === textInputModal) {
        modalMousedownOnBackdrop = true;
      }
    });

    textInputModal.addEventListener('mouseup', e => {
      if (e.target === textInputModal && modalMousedownOnBackdrop) {
        closeTextInputModal();
      }
      modalMousedownOnBackdrop = false;
    });
  }

  if (toggleAddBtn) {
    toggleAddBtn.addEventListener('click', () => {
      textImportMode = 'add';
      toggleAddBtn.classList.add('active');
      toggleReplaceBtn.classList.remove('active');
    });
  }

  if (toggleReplaceBtn) {
    toggleReplaceBtn.addEventListener('click', () => {
      textImportMode = 'replace';
      toggleReplaceBtn.classList.add('active');
      toggleAddBtn.classList.remove('active');
    });
  }

  // Copy button functionality
  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', async () => {
      const textToCopy = multiLineInput.value;
      const success = await copyToClipboard(textToCopy);
      
      const originalText = modalCopyBtn.innerHTML;
      if (success) {
        modalCopyBtn.innerHTML = '<div class="copy-icon copied">✓</div>';
        modalCopyBtn.style.backgroundColor = '#28a745';
      } else {
        modalCopyBtn.innerHTML = '<div class="copy-icon error">✗</div>';
        modalCopyBtn.style.backgroundColor = '#dc3545';
      }
      
      setTimeout(() => {
        modalCopyBtn.innerHTML = originalText;
        modalCopyBtn.style.backgroundColor = '';
      }, 1000);
    });
  }
  
  if (modalSubmitBtn) {
    modalSubmitBtn.addEventListener('click', () => {
      const text = multiLineInput.value.trim();
      if (!text) {
        closeTextInputModal();
        return;
      }

      const inputWords = text.split(/\s+/).filter(w => w.length > 0 && w !== '\\');
      if (inputWords.length === 0) {
        closeTextInputModal();
        return;
      }

      if (textImportMode === 'add') {
        let existingWords = (poetryState.rawLyrics && poetryState.rawLyrics.length > 0)
          ? poetryState.rawLyrics.slice()
          : poetryState.words.filter(w => w && w !== '-' && w.trim() !== '');
        poetryState.rawLyrics = existingWords.concat(inputWords);
      } else {
        poetryState.rawLyrics = inputWords.slice();
      }

      const targetLyrics = poetryState.rawLyrics;

      // Map text into existing rhythm note slots without resetting subdivisions/links/syncopations
      const activeWordIndices = [];
      for (let i = 0; i < poetryState.words.length; i++) {
        const w = poetryState.words[i];
        if (w && w !== '-' && w.trim() !== '') {
          activeWordIndices.push(i);
        }
      }

      if (activeWordIndices.length > 0) {
        for (let k = 0; k < activeWordIndices.length; k++) {
          const slotIdx = activeWordIndices[k];
          if (k < targetLyrics.length) {
            poetryState.words[slotIdx] = targetLyrics[k];
          } else {
            poetryState.words[slotIdx] = '-';
          }
        }
      } else {
        for (let i = 0; i < poetryState.words.length && i < targetLyrics.length; i++) {
          poetryState.words[i] = targetLyrics[i];
        }
      }

      poetryState.canonical12 = mergeViewIntoCanonical(poetryState.canonical12, poetryState.words);
      poetryState.words = fromCanonical12(poetryState.canonical12);
      saveCurrentSongToLibrary();
      render();
      closeTextInputModal();
    });
  }

  // --- MODAL EVENT LISTENERS ---
  if (newSongBtn) newSongBtn.addEventListener('click', showNewSongModal);
  if (cancelNewSongBtn) cancelNewSongBtn.addEventListener('click', hideNewSongModal);
  if (saveCurrentSongAsBtn) saveCurrentSongAsBtn.addEventListener('click', () => saveCurrentSongAs(newSongTitleInput.value));
  if (confirmNewSongBtn) confirmNewSongBtn.addEventListener('click', () => createNewSong(newSongTitleInput.value));
  if (newSongTitleInput) {
    newSongTitleInput.addEventListener('input', () => {
      if (newSongTitleInput.value.trim().length > 0) {
        newSongTitleInput.classList.remove('input-error');
      }
    });
    newSongTitleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') createNewSong(newSongTitleInput.value);
      else if (e.key === 'Escape') hideNewSongModal();
    });
  }
  if (newSongModal) {
    newSongModal.addEventListener('mousedown', (e) => {
      if (e.target === newSongModal) hideNewSongModal();
    });
  }

  if (manageLibraryBtn) manageLibraryBtn.addEventListener('click', showManageLibraryModal);
  if (closeLibraryModalBtn) closeLibraryModalBtn.addEventListener('click', hideManageLibraryModal);
  if (doneLibraryBtn) doneLibraryBtn.addEventListener('click', hideManageLibraryModal);
  if (libraryAddNewSongBtn) {
    libraryAddNewSongBtn.addEventListener('click', () => {
      hideManageLibraryModal();
      showNewSongModal();
    });
  }
  if (manageLibraryModal) {
    manageLibraryModal.addEventListener('mousedown', (e) => {
      if (e.target === manageLibraryModal) hideManageLibraryModal();
    });
  }

  if (importExportBtn) importExportBtn.addEventListener('click', showImportExportModal);
  if (closeImportExportModalBtn) closeImportExportModalBtn.addEventListener('click', hideImportExportModal);
  if (closeImportExportBtn) closeImportExportBtn.addEventListener('click', hideImportExportModal);
  if (uploadJsonBtn && jsonFileInput) {
    uploadJsonBtn.addEventListener('click', () => jsonFileInput.click());
    jsonFileInput.addEventListener('change', handleFileUpload);
  }
  if (selectAllExportBtn) selectAllExportBtn.addEventListener('click', () => setAllExportCheckboxes(true));
  if (deselectAllExportBtn) deselectAllExportBtn.addEventListener('click', () => setAllExportCheckboxes(false));
  if (confirmExportBtn) confirmExportBtn.addEventListener('click', handleExportDownload);
  if (generateShareLinkBtn) generateShareLinkBtn.addEventListener('click', handleShareCurrentSong);
  if (copyShareLinkBtn) copyShareLinkBtn.addEventListener('click', copyShareLink);
  if (resetAllDataBtn) resetAllDataBtn.addEventListener('click', handleResetAllUserData);
  if (importExportModal) {
    importExportModal.addEventListener('mousedown', (e) => {
      if (e.target === importExportModal) hideImportExportModal();
    });
  }

  // --- PLAYBACK LOGIC ---

  function startPlayback() {
    initAudioContext();
    
    const activeState = getActiveState();
    const isRhythm = currentMode === 'rhythm';
    const BPM = activeState.BPM;
    const beatInterval = 60000 / BPM;

    isPlaying = true;
    currentPlayPosition = activeState.selectedPlayStartPosition || 0;
    playButton.textContent = '■';
    playButton.classList.add('playing');

    const startPoetry = (delay = 0, startBeat = 0) => {
      const totalBeats = notesBoxElements.length;
      if (totalBeats === 0) return;

      const totalDuration = (totalBeats - startBeat) * beatInterval;

      // Schedule BEAT track
      for (let beat = startBeat; beat < totalBeats; beat++) {
        const timeDelay = delay + ((beat - startBeat) * beatInterval);
        const beatTimeout = setTimeout(() => {
          if (isPlaying) {
            highlightNotesBox(beat);
            if (beatEnabled) playBrushDrum();
          }
        }, timeDelay);
        playTimeouts.push(beatTimeout);
      }

      // Schedule RHYTHM track
      for (let beat = startBeat; beat < totalBeats; beat++) {
        const S = getBeatSubdivision(beat);
        const subInterval = beatInterval / S;
        const beatStartTime = delay + ((beat - startBeat) * beatInterval);
        const startCircle = getBeatStartIndex(beat);

        for (let s = 0; s < S; s++) {
          let hasSound = false;
          if (isRhythm) {
            hasSound = !!(rhythmState.beats[beat] && rhythmState.beats[beat][s]);
          } else {
            const circleIdx = startCircle + s;
            hasSound = isPositionActive(circleIdx, poetryState.words);
          }

          const timeDelay = beatStartTime + (s * subInterval);
          const rhythmTimeout = setTimeout(() => {
            if (isPlaying && hasSound && rhythmEnabled) {
              if (pitchMode === 'pitch') {
                playTriangleTone(subInterval * 0.8 / 1000);
              } else {
                playBassDrum();
              }
            }
          }, timeDelay);
          playTimeouts.push(rhythmTimeout);
        }
      }

      const loopTimeout = setTimeout(() => {
        if (isPlaying) {
          isFirstPlay = false;
          startPoetry(0, 0);
        }
      }, delay + totalDuration);
      playTimeouts.push(loopTimeout);
    };

    const shouldPlayCountIn = introEnabled && (isFirstPlay || activeState.selectedPlayStartPosition !== null);

    if (shouldPlayCountIn) {
      let countInBeats = 4;
      if (isFirstPlay && activeState.hasPickupMeasure && activeState.selectedPlayStartPosition === null) {
        countInBeats = 3;
      }
      
      for (let i = 0; i < countInBeats; i++) {
        const timeDelay = i * beatInterval;
        const countInTimeout = setTimeout(() => { 
          if (isPlaying) playBrushDrum(); 
        }, timeDelay);
        playTimeouts.push(countInTimeout);
      }
      
      startPoetry(countInBeats * beatInterval, currentPlayPosition);
    } else {
      startPoetry(0, currentPlayPosition);
    }
  }

  function stopPlayback() {
    isPlaying = false;
    currentPlayPosition = 0;
    isFirstPlay = true;
    playButton.textContent = '▶';
    playButton.classList.remove('playing');
    clearHighlights();
    playTimeouts.forEach(timeout => clearTimeout(timeout));
    playTimeouts = [];
    const activeState = getActiveState();
    activeState.selectedPlayStartPosition = null;
    render();
  }

  function updateCircleVisibility() {
    document.querySelectorAll('.circles').forEach(box => {
      box.classList.toggle('circles-hidden', !circleIconActive);
    });
  }

  function toggleBeat16thNotes(beatIndex) {
    const activeState = getActiveState();
    if (activeState.timeSignatureDenominator === 8) return;

    if (activeState.linkedBeats) {
      delete activeState.linkedBeats[beatIndex];
      delete activeState.linkedBeats[beatIndex - 1];
    }

    const currentSub = getBeatSubdivision(beatIndex);
    const newSub = (currentSub === 4) ? 2 : 4;
    setBeatSubdivision(beatIndex, newSub);

    if (currentMode === 'rhythm') {
      const oldBeat = rhythmState.beats[beatIndex] || [true, true];
      if (newSub === 4) {
        rhythmState.beats[beatIndex] = [oldBeat[0] ?? true, false, oldBeat[1] ?? true, false];
      } else {
        rhythmState.beats[beatIndex] = [(oldBeat[0] || oldBeat[1]) ?? true, (oldBeat[2] || oldBeat[3]) ?? true];
      }
    } else {
      poetryState.words = sanitizeWordsArray(poetryState.words);
      poetryState.canonical12 = mergeViewIntoCanonical(poetryState.canonical12, poetryState.words);
      poetryState.words = fromCanonical12(poetryState.canonical12);
    }

    render();
  }

  // --- RENDERING LOGIC ---

  function areBeatsInSameMeasure(b1, b2) {
    const activeState = getActiveState();
    const config = getLayoutConfig();
    const beatsPerMeasure = config.beatsPerMeasure;
    if (activeState.hasPickupMeasure) {
      if (b1 === 0 || b2 === 0) return b1 === b2;
      const m1 = Math.floor((b1 - 1) / beatsPerMeasure);
      const m2 = Math.floor((b2 - 1) / beatsPerMeasure);
      return m1 === m2;
    } else {
      const m1 = Math.floor(b1 / beatsPerMeasure);
      const m2 = Math.floor(b2 / beatsPerMeasure);
      return m1 === m2;
    }
  }

  function isBeatLinked(leftBeatIndex) {
    const activeState = getActiveState();
    if (!activeState.linkedBeats || !activeState.linkedBeats[leftBeatIndex]) return false;
    if (activeState.timeSignatureDenominator === 8) return false;
    if (getBeatSubdivision(leftBeatIndex) !== 2 || getBeatSubdivision(leftBeatIndex + 1) !== 2) return false;
    return areBeatsInSameMeasure(leftBeatIndex, leftBeatIndex + 1);
  }

  function isBeatInLinkedPair(beatIndex) {
    return isBeatLinked(beatIndex) || isBeatLinked(beatIndex - 1);
  }

  function toggleBeatLink(leftBeatIndex) {
    const activeState = getActiveState();
    if (!activeState.linkedBeats) activeState.linkedBeats = {};
    if (activeState.linkedBeats[leftBeatIndex]) {
      delete activeState.linkedBeats[leftBeatIndex];
    } else {
      activeState.linkedBeats[leftBeatIndex] = true;
    }
    render();
  }

  function getBeatActiveStates(beatIndex, displayWords) {
    const S = getBeatSubdivision(beatIndex);
    const states = [];
    if (currentMode === 'rhythm') {
      if (!rhythmState.beats[beatIndex]) {
        rhythmState.beats[beatIndex] = new Array(S).fill(true);
      }
      while (rhythmState.beats[beatIndex].length < S) {
        rhythmState.beats[beatIndex].push(false);
      }
      if (rhythmState.beats[beatIndex].length > S) {
        rhythmState.beats[beatIndex].length = S;
      }
      for (let s = 0; s < S; s++) {
        states.push(!!rhythmState.beats[beatIndex][s]);
      }
    } else {
      const startCircle = getBeatStartIndex(beatIndex);
      for (let s = 0; s < S; s++) {
        states.push(isPositionActive(startCircle + s, displayWords));
      }
    }
    return states;
  }

  function dismantleSyncopation(syncStartIndex) {
      if (currentMode === 'rhythm') return;
      const syncTriggerPos = syncStartIndex + 1;
      const syncopationIndex = poetryState.syncopation.indexOf(syncTriggerPos);
  
      if (syncopationIndex === -1) return;
  
      if (syncStartIndex + 3 < poetryState.words.length && poetryState.words[syncStartIndex + 2] === '-') {
          const w1 = poetryState.words[syncStartIndex];
          const w2 = poetryState.words[syncStartIndex + 1];
          const w3 = poetryState.words[syncStartIndex + 3];
  
          const replacement = [];
          if (w1 !== '-') replacement.push(w1);
          if (w2 !== '-') replacement.push(w2);
          if (w3 !== '-') replacement.push(w3);
  
          poetryState.words.splice(syncStartIndex, 4, ...replacement);
  
          const affectedBeatStart = syncStartIndex + 2;
          delete poetryState.syncopationStates[affectedBeatStart];
          delete poetryState.syncopationStates[affectedBeatStart + 1];
          poetryState.syncopation.splice(syncopationIndex, 1);
  
          const lengthChange = replacement.length - 4;
          for (let i = 0; i < poetryState.syncopation.length; i++) {
              if (poetryState.syncopation[i] > syncTriggerPos) {
                  poetryState.syncopation[i] += lengthChange;
              }
          }
      }
  }

  function getChantText(activeStates, system, circlesPerBeat) {
    const pattern = activeStates.map(a => a ? 'B' : 'G').join('/');
    const systemData = rhythmSystems[system];
    if (systemData && systemData[circlesPerBeat] && systemData[circlesPerBeat][pattern]) {
      return systemData[circlesPerBeat][pattern];
    }
    return activeStates.map(a => a ? '?' : '-');
  }

  function getCircleColor(circlesInThisBeat, activeStates, circleIndex, beatIndex, displayWords) {
    const isActive = activeStates[circleIndex];
    if (circlesInThisBeat === 2) {
      // Check if this beat is part of a linked pair
      if (beatIndex !== undefined && isBeatLinked(beatIndex)) {
        // Left beat of linked pair
        const leftStates = activeStates;
        const rightStates = getBeatActiveStates(beatIndex + 1, displayWords);
        const pat = (leftStates[0] ? 'X' : 'O') +
                    (leftStates[1] ? 'X' : 'O') +
                    (rightStates[0] ? 'X' : 'O') +
                    (rightStates[1] ? 'X' : 'O');
        const map = {
          'XXXX': ['active', 'active', 'active', 'active'],
          'OOOO': ['inactive', 'inactive', 'inactive', 'inactive'],
          'XOOX': ['active', 'sustain', 'sustain', 'active'],
          'XXOO': ['active', 'active', 'sustain', 'sustain'],
          'XXOX': ['active', 'active', 'sustain', 'active'],
          'XOXO': ['active', 'sustain', 'active', 'sustain'],
          'OXOX': ['inactive', 'active', 'sustain', 'active'],
          'OXOO': ['inactive', 'active', 'sustain', 'sustain'],
          'OOXO': ['inactive', 'inactive', 'active', 'sustain'],
          'OOXX': ['inactive', 'inactive', 'active', 'active'],
          'XOOO': ['active', 'sustain', 'sustain', 'sustain'],
          'XOXX': ['active', 'sustain', 'active', 'active'],
          'XXXO': ['active', 'active', 'active', 'sustain'],
          'OXXO': ['inactive', 'active', 'active', 'sustain'],
          'OXXX': ['inactive', 'active', 'active', 'active'],
          'OOOX': ['inactive', 'inactive', 'inactive', 'active']
        };
        if (map[pat]) return map[pat][circleIndex];
      } else if (beatIndex !== undefined && isBeatLinked(beatIndex - 1)) {
        // Right beat of linked pair
        const leftStates = getBeatActiveStates(beatIndex - 1, displayWords);
        const rightStates = activeStates;
        const pat = (leftStates[0] ? 'X' : 'O') +
                    (leftStates[1] ? 'X' : 'O') +
                    (rightStates[0] ? 'X' : 'O') +
                    (rightStates[1] ? 'X' : 'O');
        const map = {
          'XXXX': ['active', 'active', 'active', 'active'],
          'OOOO': ['inactive', 'inactive', 'inactive', 'inactive'],
          'XOOX': ['active', 'sustain', 'sustain', 'active'],
          'XXOO': ['active', 'active', 'sustain', 'sustain'],
          'XXOX': ['active', 'active', 'sustain', 'active'],
          'XOXO': ['active', 'sustain', 'active', 'sustain'],
          'OXOX': ['inactive', 'active', 'sustain', 'active'],
          'OXOO': ['inactive', 'active', 'sustain', 'sustain'],
          'OOXO': ['inactive', 'inactive', 'active', 'sustain'],
          'OOXX': ['inactive', 'inactive', 'active', 'active'],
          'XOOO': ['active', 'sustain', 'sustain', 'sustain'],
          'XOXX': ['active', 'sustain', 'active', 'active'],
          'XXXO': ['active', 'active', 'active', 'sustain'],
          'OXXO': ['inactive', 'active', 'active', 'sustain'],
          'OXXX': ['inactive', 'active', 'active', 'active'],
          'OOOX': ['inactive', 'inactive', 'inactive', 'active']
        };
        if (map[pat]) return map[pat][circleIndex + 2];
      }

      // Unlinked 2-circle simple time:
      if (activeStates[0] && !activeStates[1]) {
        if (circleIndex === 0) return 'active';
        if (circleIndex === 1) return 'sustain'; // light blue
      }
      return isActive ? 'active' : 'inactive';
    } else if (circlesInThisBeat === 3) {
      // 3-circle compound time (light blue for sustains):
      // XOO: Dotted quarter note [true, false, false]
      if (activeStates[0] && !activeStates[1] && !activeStates[2]) {
        if (circleIndex === 0) return 'active';
        return 'sustain';
      }
      // XXO: 8th note + Quarter note [true, true, false]
      if (activeStates[0] && activeStates[1] && !activeStates[2]) {
        if (circleIndex === 0) return 'active';
        if (circleIndex === 1) return 'active';
        if (circleIndex === 2) return 'sustain';
      }
      // XOX: Quarter note + 8th note [true, false, true]
      if (activeStates[0] && !activeStates[1] && activeStates[2]) {
        if (circleIndex === 0) return 'active';
        if (circleIndex === 1) return 'sustain';
        if (circleIndex === 2) return 'active';
      }
      // OXO: 8th rest + Quarter note [false, true, false]
      if (!activeStates[0] && activeStates[1] && !activeStates[2]) {
        if (circleIndex === 0) return 'inactive';
        if (circleIndex === 1) return 'active';
        if (circleIndex === 2) return 'sustain';
      }
      return isActive ? 'active' : 'inactive';
    } else if (circlesInThisBeat === 4) {
      // 16th note blocks (4 circles) -> use sustain-green for held durations
      const pat = (activeStates[0] ? 'X' : 'O') +
                  (activeStates[1] ? 'X' : 'O') +
                  (activeStates[2] ? 'X' : 'O') +
                  (activeStates[3] ? 'X' : 'O');

      const patternColorMap = {
        'XXXX': ['active', 'active', 'active', 'active'],
        'OOOO': ['inactive', 'inactive', 'inactive', 'inactive'],
        'XOOO': ['active', 'sustain-green', 'sustain-green', 'sustain-green'],
        'XOXO': ['active', 'sustain-green', 'active', 'sustain-green'],
        'XOOX': ['active', 'sustain-green', 'sustain-green', 'active'],
        'OXOX': ['inactive', 'active', 'sustain-green', 'active'],
        'OOXO': ['inactive', 'inactive', 'active', 'sustain-green'],
        'XXOO': ['active', 'active', 'inactive', 'inactive'],
        'XXOX': ['active', 'active', 'sustain-green', 'active'],
        'XXXO': ['active', 'active', 'active', 'sustain-green'],
        'XOXX': ['active', 'sustain-green', 'active', 'active'],
        'OOXX': ['inactive', 'inactive', 'active', 'active'],
        'OOOX': ['inactive', 'inactive', 'inactive', 'active'],
        'OXOO': ['inactive', 'active', 'sustain-green', 'sustain-green'],
        'OXXO': ['inactive', 'active', 'active', 'sustain-green'],
        'OXXX': ['inactive', 'active', 'active', 'active']
      };

      if (patternColorMap[pat]) {
        return patternColorMap[pat][circleIndex];
      }
      return isActive ? 'active' : 'inactive';
    }
    return isActive ? 'active' : 'inactive';
  }

  function createBeatGroup(beatIndex, beatStartPosition, config, displayWords) {
    const group = document.createElement('div');
    group.className = 'group';

    const activeState = getActiveState();
    const isRhythm = currentMode === 'rhythm';

    // Add dblclick listener only to the very first beat group of the song
    if (beatIndex === 0) {
        group.addEventListener('dblclick', (e) => {
            e.preventDefault();
            activeState.hasPickupMeasure = !activeState.hasPickupMeasure;
            render();
        });
    }

    const circlesDiv = document.createElement('div');
    circlesDiv.className = 'circles';
    if (!circleIconActive) circlesDiv.classList.add('circles-hidden');
    
    if (beatIndex === 0 && activeState.hasPickupMeasure) {
        circlesDiv.classList.add('pickup');
    }
    if (isBeatInLinkedPair(beatIndex)) {
        circlesDiv.classList.add('linked');
    }

    const circlesInThisBeat = getBeatSubdivision(beatIndex);

    // Add subdivision toggle controls (+ and - buttons) on the far left of the beat box
    if (activeState.timeSignatureDenominator !== 8) {
      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'beat-subdivision-controls';

      const plusBtn = document.createElement('button');
      plusBtn.className = 'subdivision-btn plus-btn';
      plusBtn.textContent = '+';
      plusBtn.title = 'Toggle 16th notes';
      if (circlesInThisBeat === 4) {
        plusBtn.classList.add('active');
      }

      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBeat16thNotes(beatIndex);
      });

      const minusBtn = document.createElement('button');
      minusBtn.className = 'subdivision-btn minus-btn';
      minusBtn.textContent = '-';
      minusBtn.title = 'Subdivision toggle';
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      controlsDiv.appendChild(plusBtn);
      controlsDiv.appendChild(minusBtn);
      circlesDiv.appendChild(controlsDiv);
    }

    // Add chain link button between this beat and the next beat if both are 2-circle boxes in the same measure
    if (activeState.timeSignatureDenominator !== 8 && circlesInThisBeat === 2 && areBeatsInSameMeasure(beatIndex, beatIndex + 1) && getBeatSubdivision(beatIndex + 1) === 2) {
      const linkBtn = document.createElement('button');
      linkBtn.className = 'beat-link-btn';
      if (isBeatLinked(beatIndex)) {
        linkBtn.classList.add('active');
      }
      linkBtn.title = 'Link beat boxes';
      linkBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
      </svg>`;
      linkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBeatLink(beatIndex);
      });
      circlesDiv.appendChild(linkBtn);
    }

    const activeStates = [];
    if (isRhythm) {
      if (!rhythmState.beats[beatIndex]) {
        rhythmState.beats[beatIndex] = new Array(circlesInThisBeat).fill(true);
      }
      while (rhythmState.beats[beatIndex].length < circlesInThisBeat) {
        rhythmState.beats[beatIndex].push(false);
      }
      if (rhythmState.beats[beatIndex].length > circlesInThisBeat) {
        rhythmState.beats[beatIndex].length = circlesInThisBeat;
      }
      for (let s = 0; s < circlesInThisBeat; s++) {
        activeStates.push(!!rhythmState.beats[beatIndex][s]);
      }
    } else {
      for (let s = 0; s < circlesInThisBeat; s++) {
        const idx = beatStartPosition + s;
        activeStates.push(isPositionActive(idx, displayWords));
      }
    }

    for (let circleIndex = 0; circleIndex < circlesInThisBeat; circleIndex++) {
        const circle = document.createElement('span');
        circle.className = 'circle';
        const idx = beatStartPosition + circleIndex;

        if (!isRhythm && poetryState.syncopation.includes(idx)) {
            circle.classList.add('syncopated');
        } else {
            const color = getCircleColor(circlesInThisBeat, activeStates, circleIndex, beatIndex, displayWords);
            if (color === 'active') {
                circle.classList.add('active');
            } else if (color === 'sustain' || color === 'light-blue') {
                circle.classList.add('sustain');
            } else if (color === 'sustain-green' || color === 'light-green') {
                circle.classList.add('sustain-green');
            }
        }

        circle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isRhythm) {
              rhythmState.beats[beatIndex][circleIndex] = !rhythmState.beats[beatIndex][circleIndex];
              render();
              return;
            }

            // Lyric mode behavior
            for (let i = poetryState.syncopation.length - 1; i >= 0; i--) {
                const syncTriggerPos = poetryState.syncopation[i];
                const syncStartIndex = syncTriggerPos - 1;
                if (idx === syncStartIndex - 1 || idx === syncStartIndex) {
                    dismantleSyncopation(syncStartIndex);
                }
            }

            while (poetryState.words.length <= idx) {
                poetryState.words.push('-');
            }

            if (poetryState.syncopation.includes(idx)) {
                dismantleSyncopation(idx - 1);
                commitAndUpdateView();
                return;
            }

            if (isAffectedBySyncopation(idx)) {
                poetryState.syncopationStates[idx] = !poetryState.syncopationStates[idx];
            } else {
                applyIsolatedRhythmChange(idx);
            }
            commitAndUpdateView();
        });
        circlesDiv.appendChild(circle);
    }
    group.appendChild(circlesDiv);

    const notesBox = document.createElement('div');
    notesBox.className = 'notes-box';
    if (beatIndex < notesBoxElements.length) {
        notesBoxElements[beatIndex] = notesBox;
    } else {
        notesBoxElements.push(notesBox);
    }
    
    if (beatIndex === activeState.selectedPlayStartPosition) {
        notesBox.classList.add('selected');
    }

    notesBox.addEventListener('click', () => {
        if (activeState.selectedPlayStartPosition === beatIndex) {
            activeState.selectedPlayStartPosition = null;
        } else {
            activeState.selectedPlayStartPosition = beatIndex;
        }
        render();
    });

    if (circlesInThisBeat === 4) {
        notesBox.classList.add('sixteenth');
        const pattern = (activeStates[0] ? 'X' : 'O') + (activeStates[1] ? 'X' : 'O') + (activeStates[2] ? 'X' : 'O') + (activeStates[3] ? 'X' : 'O');
        const imageUrl = `assets/Wordrhythms-${pattern}.svg`;
        notesBox.appendChild(createImage(imageUrl));
    } else if (circlesInThisBeat === 2) {
        if (isBeatLinked(beatIndex)) {
            // Left beat of linked pair
            const leftStates = activeStates;
            const rightStates = getBeatActiveStates(beatIndex + 1, displayWords);
            const pat = (leftStates[0] ? 'X' : 'O') +
                        (leftStates[1] ? 'X' : 'O') +
                        (rightStates[0] ? 'X' : 'O') +
                        (rightStates[1] ? 'X' : 'O');
            
            const leftSvgMap = {
              'XOOX': 'assets/Wordrhythms-dottedquarternote.svg',
              'XXOO': 'assets/Wordrhythms-eighth-dottedquarter.svg',
              'XXOX': 'assets/Wordrhythms-SyncopateA.svg',
              'OXOX': 'assets/Wordrhythms-eighthrest-syncopate.svg',
              'OXOO': 'assets/Wordrhythms-eighthrest-dottedquarter.svg',
              'XOXO': 'assets/Wordrhythms-quarternote.svg',
              'XXXX': 'assets/Wordrhythms-eighthnotepair.svg',
              'OOOO': 'assets/Wordrhythms-quarterrest.svg',
              'XOOO': 'assets/Wordrhythms-quarternote.svg',
              'XOXX': 'assets/Wordrhythms-quarternote.svg',
              'XXXO': 'assets/Wordrhythms-eighthnotepair.svg',
              'OOXX': 'assets/Wordrhythms-quarterrest.svg',
              'OOXO': 'assets/Wordrhythms-quarterrest.svg',
              'OOOX': 'assets/Wordrhythms-quarterrest.svg',
              'OXXO': 'assets/Wordrhythms-eighthrestnote.svg',
              'OXXX': 'assets/Wordrhythms-eighthrestnote.svg'
            };
            const imgPath = leftSvgMap[pat] || 'assets/Wordrhythms-quarternote.svg';
            if (imgPath) {
              notesBox.appendChild(createImage(imgPath));
            } else {
              const spacer = document.createElement('div');
              spacer.className = 'notes-box-spacer';
              notesBox.appendChild(spacer);
            }
        } else if (isBeatLinked(beatIndex - 1)) {
            // Right beat of linked pair
            const leftStates = getBeatActiveStates(beatIndex - 1, displayWords);
            const rightStates = activeStates;
            const pat = (leftStates[0] ? 'X' : 'O') +
                        (leftStates[1] ? 'X' : 'O') +
                        (rightStates[0] ? 'X' : 'O') +
                        (rightStates[1] ? 'X' : 'O');

            const rightSvgMap = {
              'XOOX': 'assets/Wordrhythms-SyncopateB.svg',
              'XXOO': null,
              'XXOX': 'assets/Wordrhythms-SyncopateB.svg',
              'OXOX': 'assets/Wordrhythms-SyncopateB.svg',
              'OXOO': null,
              'XOXO': 'assets/Wordrhythms-quarternote.svg',
              'XXXX': 'assets/Wordrhythms-eighthnotepair.svg',
              'OOOO': 'assets/Wordrhythms-quarterrest.svg',
              'XOOO': 'assets/Wordrhythms-quarternote.svg',
              'XOXX': 'assets/Wordrhythms-eighthnotepair.svg',
              'XXXO': 'assets/Wordrhythms-quarternote.svg',
              'OOXX': 'assets/Wordrhythms-eighthnotepair.svg',
              'OOXO': 'assets/Wordrhythms-quarternote.svg',
              'OOOX': 'assets/Wordrhythms-SyncopateB.svg',
              'OXXO': 'assets/Wordrhythms-quarternote.svg',
              'OXXX': 'assets/Wordrhythms-eighthnotepair.svg'
            };
            const imgPath = rightSvgMap[pat];
            if (imgPath) {
              notesBox.appendChild(createImage(imgPath));
            } else {
              const spacer = document.createElement('div');
              spacer.className = 'notes-box-spacer';
              notesBox.appendChild(spacer);
            }
        } else {
            const i = beatStartPosition;
            const active1 = activeStates[0];
            const active2 = activeStates[1];

            const isSyncopated = !isRhythm && poetryState.syncopation.includes(i + 1);
            const syncopationType = isRhythm ? null : getSyncopationType(i);

            if (syncopationType === 'SyncopateB') notesBox.appendChild(createImage('assets/Wordrhythms-SyncopateB.svg'));
            else if (syncopationType === 'SyncopateC') notesBox.appendChild(createImage('assets/Wordrhythms-SyncopateC.svg'));
            else if (isSyncopated) notesBox.appendChild(createImage('assets/Wordrhythms-SyncopateA.svg'));
            else if (active1 && !active2) notesBox.appendChild(createImage('assets/Wordrhythms-quarternote.svg'));
            else if (active1 && active2) notesBox.appendChild(createImage('assets/Wordrhythms-eighthnotepair.svg'));
            else if (!active1 && !active2) notesBox.appendChild(createImage('assets/Wordrhythms-quarterrest.svg'));
            else if (!active1 && active2) notesBox.appendChild(createImage('assets/Wordrhythms-eighthrestnote.svg'));
        }

    } else if (circlesInThisBeat === 3) {
        notesBox.classList.add('compound');
        const pattern = (activeStates[0] ? 'X' : 'O') + (activeStates[1] ? 'X' : 'O') + (activeStates[2] ? 'X' : 'O');

        let imageUrl = '';
        switch (pattern) {
            case 'XXX': imageUrl = 'assets/Wordrhythms-XXX.svg'; break;
            case 'OOO': imageUrl = 'assets/Wordrhythms-OOO.svg'; break;
            case 'XOO': imageUrl = 'assets/Wordrhythms-XOO.svg'; break;
            case 'XXO': imageUrl = 'assets/Wordrhythms-XXO.svg'; break;
            case 'XOX': imageUrl = 'assets/Wordrhythms-XOX.svg'; break;
            case 'OXO': imageUrl = 'assets/Wordrhythms-OXO.svg'; break;
            case 'OOX': imageUrl = 'assets/Wordrhythms-OOX.svg'; break;
            case 'OXX': imageUrl = 'assets/Wordrhythms-OXX.svg'; break;
        }
        if (imageUrl) {
            notesBox.appendChild(createImage(imageUrl));
        }
    }
    group.appendChild(notesBox);

    if (isRhythm) {
        const chantSyllables = getChantText(activeStates, rhythmState.currentRhythmSystem, circlesInThisBeat);
        const chantDiv = document.createElement('div');
        chantDiv.className = 'words';
        if (circlesInThisBeat === 4) {
            chantDiv.classList.add('sixteenth-chant');
        } else if (circlesInThisBeat === 3) {
            chantDiv.classList.add('triplet-chant');
        } else if (circlesInThisBeat === 2) {
            chantDiv.classList.add('eighth-chant');
        }

        const pattern = activeStates.map(a => a ? 'B' : 'G').join('/');

        if ((pattern === 'B/G/G/G' && circlesInThisBeat === 4) || (pattern === 'B/G/G' && circlesInThisBeat === 3)) {
            chantDiv.classList.add('single-syllable-whole');
            const wc = document.createElement('span');
            wc.className = 'word-container';

            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = chantSyllables[0];
            wc.appendChild(span);
            chantDiv.appendChild(wc);
        } else {
            chantSyllables.forEach((syllable, i) => {
                const wc = document.createElement('span');
                wc.className = 'word-container';

                const span = document.createElement('span');
                span.className = 'word';
                if (syllable === '-') {
                    span.classList.add('rest');
                }
                span.textContent = syllable;
                wc.appendChild(span);
                chantDiv.appendChild(wc);
            });
        }
        group.appendChild(chantDiv);
    } else {
        const wordsDiv = document.createElement('div');
        wordsDiv.className = 'words';
        for (let circleIndex = 0; circleIndex < circlesInThisBeat; circleIndex++) {
            const idx = beatStartPosition + circleIndex;
            const wc = document.createElement('span');
            wc.className = 'word-container';
            if (idx === editingIndex) {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = displayWords[idx];
                input.className = 'word-input';
                wc.appendChild(input);
                wordsDiv.appendChild(wc);
                setTimeout(() => { input.focus(); input.select(); });
                function cleanup() { input.removeEventListener('keydown', onKey); input.removeEventListener('blur', onBlur); }
                function onKey(e) {
                    if (e.key === 'Enter') { 
                      e.preventDefault(); 
                      poetryState.words[idx] = input.value; 
                      editingIndex = null; 
                      cleanup(); 
                      syncRawLyricsFromWords();
                      commitAndUpdateView(); 
                    }
                    else if (e.key === 'Escape') { e.preventDefault(); editingIndex = null; cleanup(); render(); }
                    else if (e.key === ' ' || e.code === 'Space') { 
                        e.preventDefault(); 
                        poetryState.words[idx] = input.value === '' ? '-' : input.value;
                        editingIndex = idx + 1; 
                        if (editingIndex >= poetryState.words.length) {
                            poetryState.words.push('-');
                        }
                        cleanup(); 
                        syncRawLyricsFromWords();
                        commitAndUpdateView();
                    }
                    else if ((e.key === 'Backspace' || e.key === 'Delete') && input.value === '') { 
                      e.preventDefault(); 
                      poetryState.words[idx] = '-'; 
                      editingIndex = Math.max(idx - 1, 0); 
                      cleanup(); 
                      syncRawLyricsFromWords();
                      commitAndUpdateView(); 
                    }
                }
                function onBlur() { 
                  poetryState.words[idx] = input.value; 
                  editingIndex = null; 
                  cleanup(); 
                  syncRawLyricsFromWords();
                  commitAndUpdateView(); 
                }
                input.addEventListener('keydown', onKey);
                input.addEventListener('blur', onBlur);
            } else {
                const span = document.createElement('span');
                const word = displayWords[idx];
                if (isAffectedBySyncopation(idx) && !isPositionActive(idx, displayWords)) {
                    span.textContent = '';
                    span.className = 'word rest';
                } else {
                    span.textContent = (word === ' ' ? '' : (word || ''));
                    span.className = 'word';
                    if (word === '-' || word === '' || word === undefined) span.classList.add('rest');
                }
                span.addEventListener('click', () => {
                    while (poetryState.words.length <= idx) {
                        poetryState.words.push('-');
                    }
                    editingIndex = idx;
                    render();
                });
                wc.appendChild(span);
                wordsDiv.appendChild(wc);
            }
        }
        group.appendChild(wordsDiv);
    }
    return group;
  }

  function createDivider(isFinal = false) {
    const divider = document.createElement('div');
    divider.className = isFinal ? 'final-measure-divider' : 'measure-divider';

    if (isFinal && notesBoxElements.length > 0) {
      const deleteBtn = document.createElement('div');
      deleteBtn.className = 'delete-measure-btn';
      deleteBtn.textContent = 'X';
      deleteBtn.title = 'Delete last measure';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const config = getLayoutConfig();
        const beatsToRemove = config.beatsPerMeasure;

        if (currentMode === 'rhythm') {
          const minBeats = config.beatsPerMeasure;
          const newLength = Math.max(minBeats, rhythmState.beats.length - beatsToRemove);
          rhythmState.beats.length = newLength;
          for (const k in rhythmState.beatSubdivisions) {
            if (parseInt(k, 10) >= newLength) delete rhythmState.beatSubdivisions[k];
          }
          for (const k in rhythmState.linkedBeats) {
            if (parseInt(k, 10) >= newLength - 1) delete rhythmState.linkedBeats[k];
          }
        } else {
          const ticksToRemove = beatsToRemove * 12;
          const newLength = Math.max(12, poetryState.canonical12.length - ticksToRemove);
          poetryState.canonical12.length = newLength;
          const newTotalBeats = Math.ceil(newLength / 12);
          for (const k in poetryState.beatSubdivisions) {
            if (parseInt(k, 10) >= newTotalBeats) delete poetryState.beatSubdivisions[k];
          }
          for (const k in poetryState.linkedBeats) {
            if (parseInt(k, 10) >= newTotalBeats - 1) delete poetryState.linkedBeats[k];
          }
          poetryState.words = fromCanonical12(poetryState.canonical12);
        }
        render();
      });
      divider.appendChild(deleteBtn);

      const addBtn = document.createElement('div');
      addBtn.className = 'add-measure-btn';
      addBtn.textContent = '+';
      addBtn.title = 'Add a new measure';
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const config = getLayoutConfig();
        const beatsToAdd = config.beatsPerMeasure;

        if (currentMode === 'rhythm') {
          const sub = rhythmState.timeSignatureDenominator === 8 ? 3 : 2;
          for (let i = 0; i < beatsToAdd; i++) {
            rhythmState.beats.push(new Array(sub).fill(true));
          }
        } else {
          const ticksToAdd = beatsToAdd * 12;
          const sub = (poetryState.timeSignatureDenominator === 8) ? 3 : 2;
          const win = 12 / sub;
          const startBeat = Math.ceil(poetryState.canonical12.length / 12);
          const endBeat = startBeat + beatsToAdd;
          
          let usedCount = poetryState.words.filter(w => w && w !== '-' && w.trim() !== '').length;

          for (let i = 0; i < ticksToAdd; i++) {
            poetryState.canonical12.push('-');
          }
          poetryState.words = fromCanonical12(poetryState.canonical12);

          if (poetryState.rawLyrics && usedCount < poetryState.rawLyrics.length) {
            for (let b = startBeat; b < endBeat; b++) {
              for (let s = 0; s < sub; s++) {
                if (usedCount < poetryState.rawLyrics.length) {
                  poetryState.canonical12[b * 12 + s * win] = poetryState.rawLyrics[usedCount++];
                }
              }
            }
            poetryState.words = fromCanonical12(poetryState.canonical12);
          }
        }
        render();
      });
      divider.appendChild(addBtn);
    }

    return divider;
  }

  function revalidateSyncopations() {
      if (poetryState.timeSignatureDenominator === 8) {
          poetryState.syncopation = [];
          poetryState.syncopationStates = {};
          return;
      }
  
      for (let i = poetryState.syncopation.length - 1; i >= 0; i--) {
          const syncTriggerPos = poetryState.syncopation[i];
          const syncStartIndex = syncTriggerPos - 1;

          const beatIndex = Math.floor(syncStartIndex / 2);
          if (getBeatSubdivision(beatIndex) !== 2 || getBeatSubdivision(beatIndex + 1) !== 2) {
              dismantleSyncopation(syncStartIndex);
              continue;
          }
  
          const isEvenPosition = syncStartIndex % 2 === 0;
          const isGroupIntact = syncStartIndex + 3 < poetryState.words.length && poetryState.words[syncStartIndex + 2] === '-';
  
          if (!isEvenPosition || !isGroupIntact) {
              dismantleSyncopation(syncStartIndex);
          }
      }
  }

  function render() {
    container.innerHTML = '';
    notesBoxElements = [];
    const config = getLayoutConfig();
    const activeState = getActiveState();
    const isRhythm = currentMode === 'rhythm';

    let totalBeatsNeeded = 0;

    if (isRhythm) {
      let numBeats = Math.max(1, rhythmState.beats.length);
      if (rhythmState.hasPickupMeasure) {
        const bodyBeats = numBeats > 1 ? numBeats - 1 : 0;
        const beatsInLastMeasure = bodyBeats % config.beatsPerMeasure;
        const paddedBodyBeats = (beatsInLastMeasure === 0 && bodyBeats > 0) ? bodyBeats : bodyBeats + (config.beatsPerMeasure - beatsInLastMeasure);
        totalBeatsNeeded = 1 + paddedBodyBeats;
      } else {
        const beatsInLastMeasure = numBeats % config.beatsPerMeasure;
        totalBeatsNeeded = (beatsInLastMeasure === 0 && numBeats > 0) ? numBeats : numBeats + (config.beatsPerMeasure - beatsInLastMeasure);
      }

      while (rhythmState.beats.length < totalBeatsNeeded) {
        const sub = rhythmState.timeSignatureDenominator === 8 ? 3 : 2;
        rhythmState.beats.push(new Array(sub).fill(true));
      }
    } else {
      revalidateSyncopations();
      trimExcessTrailingMeasures();

      let numBeats = Math.max(1, getTotalBeatsFromWords(poetryState.words));
      if (poetryState.hasPickupMeasure) {
        const bodyBeats = numBeats > 1 ? numBeats - 1 : 0;
        const beatsInLastMeasure = bodyBeats % config.beatsPerMeasure;
        const paddedBodyBeats = (beatsInLastMeasure === 0 && bodyBeats > 0) ? bodyBeats : bodyBeats + (config.beatsPerMeasure - beatsInLastMeasure);
        totalBeatsNeeded = 1 + paddedBodyBeats;
      } else {
        const beatsInLastMeasure = numBeats % config.beatsPerMeasure;
        totalBeatsNeeded = (beatsInLastMeasure === 0 && numBeats > 0) ? numBeats : numBeats + (config.beatsPerMeasure - beatsInLastMeasure);
      }

      while (poetryState.canonical12.length < totalBeatsNeeded * 12) {
        poetryState.canonical12.push('-');
      }

      poetryState.words = fromCanonical12(poetryState.canonical12);
    }

    const displayWords = isRhythm ? [] : poetryState.words;

    const allBeatGroups = [];
    let wordCursor = 0;
    for (let b = 0; b < totalBeatsNeeded; b++) {
      const beatStartPos = wordCursor;
      const S = getBeatSubdivision(b);
      allBeatGroups.push(createBeatGroup(b, beatStartPos, config, displayWords));
      wordCursor += S;
    }

    if (allBeatGroups.length === 0) return;

    let currentBeatIndex = 0;
    while(currentBeatIndex < allBeatGroups.length) {
      const line = document.createElement('div');
      line.className = 'line';
      let measuresOnThisLine = 0;

      if (currentBeatIndex === 0 && activeState.hasPickupMeasure) {
        line.appendChild(allBeatGroups[currentBeatIndex++]);
        line.appendChild(createDivider());
      }

      const measuresPerLine = (currentBeatIndex === 0 && activeState.hasPickupMeasure) ? 1 : config.measuresPerLine;

      while(measuresOnThisLine < measuresPerLine && currentBeatIndex < allBeatGroups.length) {
        const measure = document.createElement('div');
        measure.className = 'measure';
        for(let i=0; i < config.beatsPerMeasure && currentBeatIndex < allBeatGroups.length; i++) {
          measure.appendChild(allBeatGroups[currentBeatIndex++]);
        }
        line.appendChild(measure);
        measuresOnThisLine++;

        if (measuresOnThisLine < measuresPerLine && currentBeatIndex < allBeatGroups.length) {
          line.appendChild(createDivider());
        }
      }

      line.appendChild(createDivider(currentBeatIndex >= allBeatGroups.length));
      container.appendChild(line);
    }
  }

  // --- INITIALIZATION ---
  const library = getStoredLibrary();
  let songIdToLoad = null;

  const sharedSong = checkUrlForSharedSong();
  if (sharedSong && (sharedSong.poetryState || sharedSong.rhythmState || sharedSong.words || sharedSong.title)) {
    const title = (sharedSong.title && sharedSong.title.trim()) ? sharedSong.title.trim() : 'Shared Song';
    const sharedId = 'shared_' + Date.now();
    library[sharedId] = {
      id: sharedId,
      title: title,
      mode: sharedSong.mode || 'rhythm',
      poetryState: sharedSong.poetryState || {
        words: sharedSong.words || ['Start', 'Here'],
        rawLyrics: sharedSong.words || ['Start', 'Here'],
        BPM: sharedSong.bpm || 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4
      },
      rhythmState: sharedSong.rhythmState || {
        beats: Array.from({ length: 4 }, () => [true, true]),
        BPM: sharedSong.bpm || 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4
      }
    };
    saveStoredLibrary(library);
    songIdToLoad = sharedId;
    localStorage.setItem(ACTIVE_SONG_ID_KEY, sharedId);
    try {
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    } catch (e) {}
  } else {
    const savedActiveId = localStorage.getItem(ACTIVE_SONG_ID_KEY);
    songIdToLoad = (savedActiveId && library[savedActiveId]) ? savedActiveId : (library['instructions'] ? 'instructions' : Object.keys(library)[0]);
  }

  populateLibraryDropdown();
  if (songIdToLoad) {
    loadSongById(songIdToLoad);
  }

  updatePoemMargin();
  window.addEventListener('resize', updatePoemMargin);
  if (toggleReplaceBtn) toggleReplaceBtn.classList.add('active');
  if (toggleAddBtn) toggleAddBtn.classList.remove('active');

  // Zoom Controls
  const zoomFab = document.getElementById('zoom-fab');
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const poemContainer = document.getElementById('poem');

  const zoomLevels = [0.75, 1.0, 1.1, 1.25, 1.5, 1.75];
  let currentZoomIndex = 1;

  function applyZoom() {
    poemContainer.className = 'zoom-level-' + currentZoomIndex;
    zoomInBtn.disabled = currentZoomIndex === zoomLevels.length - 1;
    zoomOutBtn.disabled = currentZoomIndex === 0;
  }

  zoomFab.addEventListener('click', () => {
    zoomInBtn.classList.toggle('visible');
    zoomOutBtn.classList.toggle('visible');
  });

  zoomInBtn.addEventListener('click', () => {
    if (currentZoomIndex < zoomLevels.length - 1) {
      currentZoomIndex++;
      applyZoom();
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    if (currentZoomIndex > 0) {
      currentZoomIndex--;
      applyZoom();
    }
  });
  
  applyZoom();

  // Initialize poetry canonical timeline
  poetryState.canonical12 = toCanonical12(poetryState.words);
  poetryState.words = fromCanonical12(poetryState.canonical12);

  setMode(currentMode);

  window.addEventListener('beforeunload', saveCurrentSongToLibrary);
})();
