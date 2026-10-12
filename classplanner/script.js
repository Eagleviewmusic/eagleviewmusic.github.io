// The Garden layout's plants: garden/<plant>-<stage>.webp, stage 1 (empty pot) to 6 (full bloom)
const GARDEN_PLANTS = ['flytrap', 'violet', 'daisy', 'rose', 'bellflower', 'dahlia', 'sunflower', 'tulip', 'lily', 'cactus'];
const GARDEN_STAGES = 6;
// How many class sessions in a row each of stages 1-5 lasts (stage 6 lasts until the flower is
// replanted), for classes that meet once a week and classes that meet several times a week.
// The user can change these in Settings > Garden Growth.
const GARDEN_GROWTH_DEFAULTS = { weekly: [1, 1, 1, 1, 1], daily: [1, 1, 2, 2, 2] };
const GARDEN_GROWTH_MAX = 20;
// Garden sizes in px, kept in step with the .layout-garden rules in styles.css. A "pot" width
// here is the width of its picture (--garden-w); each pot stands on a shelf in a slightly
// narrower slot, so full-grown leaves may overlap a neighbour's a little.
const GARDEN = {
  minW: 56,          // narrowest pot before the garden scrolls instead
  maxW: 190,         // widest pot, so a small class doesn't get giant ones
  pitch: 0.86,       // a pot's slot on the shelf, as a share of the picture's width
  bedPadX: 28,       // a shelf's left + right padding
  bedPadY: 12,       // a shelf's top + bottom padding
  bedGap: 10,        // space between shelves (and between the window and the first shelf)
  shelfTop: 0.07,    // the top of the shelf the pots stand on, as a share of the picture's width
  potFoot: 0.0635,   // the clear strip under the pot in every picture, as a share of its width
  frameX: 8,         // the window frame around the flower bed: .garden-border's side,
  frameTop: 8,       // top
  frameBottom: 14,   // and bottom (the sill) borders
  borderShare: 0.15, // the grass border of replanted flowers: this share of the height,
  borderMinH: 84,    // but no shorter
  borderMaxH: 150,   // or taller than these
  bloomAspect: 252 / 291, // width / height of a garden/<plant>-bloom.webp
  bloomSoil: 0.064,  // share of that picture below the soil line (BLOOM_BOTTOM in make-garden.py)
  frontGrass: 0.19,  // grass strip heights, as a share of the border's height
  backGrass: 0.22,
  frontGrassBase: 14 / 60, // the solid ground at the bottom of grass-front.svg / grass-back.svg
  backGrassBase: 16 / 90
};

// A seat card's name is written as big as fits its card on one line. w = the card's room for
// the name in px (kept in step with the .seat / .seat .student-name padding in styles.css),
// max = the biggest size, two = the biggest size when a long first + last name takes two lines.
const SEAT_NAME = {
  font: "'Patrick Hand', 'Chalkboard SE', 'Comic Sans MS', cursive",  // the --font-hand stack
  faces: { w: 90, max: 26, two: 14 },    // .seat: 110 x 75, initials sticker above the name
  plain: { w: 65, max: 27, two: 15.5 },  // .seat.no-faces: 85 x 52
  grading: { faces: 22, plain: 14 },     // while grading the score buttons need the room (the sticker is hidden)
  min: 12
};

// The crayon colours of the seat cards' stripes and initials stickers
const SEAT_COLORS = ['#d2463b', '#e07a26', '#b8860b', '#3f8f4a', '#2f6db3', '#7a55a6', '#1f8a86'];

// Group Tables: the seats sit around a table in a box the teacher can resize. Sizes in px.
const TABLE = {
  pad: 14,        // floor between the cards and the box's edge, where the chairs stand
  gap: 12,        // between neighbouring cards, and between a card and the table
  freeW: 130,     // the clear middle of a table, for its tent card
  freeH: 44,
  space: 12,      // the least floor between two tables
  minScale: 0.6,  // cards shrink to fit a box sized smaller than they need, down to this much
  emptyW: 260,    // an empty table's width
  border: 2       // .group-box.table-group's border
};

const TABLE_LAYOUTS = ['half', 'third', 'fourth', 'fifth', 'sixth'];

// Special seating rules (Settings → Special Seating Rules), kept by Arrange Seating → Random.
// Left and right are as the chart shows them on screen.
const SEATING_RULE_TYPES = {
  front: { label: 'Sit near the front', short: 'Near the front', icon: '⬆', phrase: 'sits near the front' },
  back: { label: 'Sit near the back', short: 'Near the back', icon: '⬇', phrase: 'sits near the back' },
  left: { label: 'Sit on the left side', short: 'Left side', icon: '⬅', phrase: 'sits on the left side' },
  right: { label: 'Sit on the right side', short: 'Right side', icon: '➡', phrase: 'sits on the right side' },
  outside: { label: 'Sit in an outside seat (end of a row)', short: 'Outside seat', icon: '↔', phrase: 'sits in an outside seat' },
  with: { label: 'Sit with', pair: true, phrase: 'sits with' },
  apart: { label: "Don't sit with", pair: true, phrase: "doesn't sit with" }
};

// Band seating: chairs on arcs around the podium (front arc first) and a percussion line across
// the back. A chair can be given an instrument, which colours it; the chairs with the same
// instrument are that instrument's section. [id, name, abbreviation, colour]
const BAND_FAMILIES = [
  { name: 'Woodwinds', items: [
    ['piccolo', 'Piccolo', 'Picc', '#6cc5e0'],
    ['flute', 'Flute', 'Fl', '#2a9fd6'],
    ['oboe', 'Oboe', 'Ob', '#8a5cd1'],
    ['englishhorn', 'English Horn', 'EH', '#b18ae6'],
    ['bassoon', 'Bassoon', 'Bsn', '#8c5a2c'],
    ['contrabassoon', 'Contrabassoon', 'CBsn', '#5f3b1c'],
    ['ebclarinet', 'E♭ Clarinet', 'E♭Cl', '#6fcf97'],
    ['clarinet', 'Clarinet', 'Cl', '#2f9e5a'],
    ['altoclarinet', 'Alto Clarinet', 'ACl', '#48b39c'],
    ['bassclarinet', 'Bass Clarinet', 'BCl', '#1f6b47'],
    ['contrabassclarinet', 'Contrabass Clarinet', 'CBCl', '#134a31'],
    ['sopranosax', 'Soprano Saxophone', 'SSx', '#f2a7c3'],
    ['altosax', 'Alto Saxophone', 'ASx', '#e0598f'],
    ['tenorsax', 'Tenor Saxophone', 'TSx', '#c13874'],
    ['barisax', 'Baritone Saxophone', 'BSx', '#8c2556'],
    ['recorder', 'Recorder', 'Rec', '#9fd36a']
  ] },
  { name: 'Brass', items: [
    ['trumpet', 'Trumpet', 'Tpt', '#e8a317'],
    ['cornet', 'Cornet', 'Cor', '#f3c94f'],
    ['flugelhorn', 'Flugelhorn', 'Flg', '#c98a1a'],
    ['horn', 'French Horn', 'Hn', '#ec7a30'],
    ['mellophone', 'Mellophone', 'Mel', '#f4a06a'],
    ['trombone', 'Trombone', 'Tbn', '#d63d3d'],
    ['basstrombone', 'Bass Trombone', 'BTbn', '#a52a2a'],
    ['euphonium', 'Euphonium / Baritone', 'Bar', '#b8643a'],
    ['tuba', 'Tuba', 'Tuba', '#7b2020'],
    ['sousaphone', 'Sousaphone', 'Sou', '#571616']
  ] },
  { name: 'Strings', items: [
    ['violin1', 'Violin I', 'Vn1', '#4466e8'],
    ['violin2', 'Violin II', 'Vn2', '#8199f3'],
    ['viola', 'Viola', 'Va', '#5a2fb5'],
    ['cello', 'Cello', 'Vc', '#1f3fae'],
    ['bass', 'Double Bass', 'DB', '#0f2a6b'],
    ['harp', 'Harp', 'Hp', '#a3a83a'],
    ['guitar', 'Guitar', 'Gtr', '#a0703c'],
    ['bassguitar', 'Bass Guitar', 'BGtr', '#6e4a24']
  ] },
  { name: 'Percussion & Keys', items: [
    ['timpani', 'Timpani', 'Timp', '#7d6650'],
    ['snare', 'Snare Drum', 'SD', '#5f7380'],
    ['bassdrum', 'Bass Drum', 'BD', '#3d4b55'],
    ['drumkit', 'Drum Kit', 'Kit', '#2b2f36'],
    ['cymbals', 'Cymbals', 'Cym', '#b3a04a'],
    ['aux', 'Auxiliary Percussion', 'Aux', '#6e8b74'],
    ['glockenspiel', 'Glockenspiel / Bells', 'Glk', '#9aa5b1'],
    ['xylophone', 'Xylophone', 'Xyl', '#b08d6a'],
    ['marimba', 'Marimba', 'Mar', '#8a6a4b'],
    ['vibraphone', 'Vibraphone', 'Vib', '#7f97a8'],
    ['chimes', 'Chimes', 'Chm', '#a3a3a3'],
    ['piano', 'Piano / Keyboard', 'Keys', '#444b55'],
    ['percussion', 'Percussion (general)', 'Perc', '#8a8f96']
  ] }
];
const BAND_INSTRUMENTS = {};
BAND_FAMILIES.forEach(f => f.items.forEach(([id, name, abbr, color]) => {
  BAND_INSTRUMENTS[id] = { id, name, abbr, color, family: f.name, order: Object.keys(BAND_INSTRUMENTS).length };
}));

const BAND = {
  maxRows: 4,
  maxSeats: 40,     // chairs in one arc
  maxPerc: 16,
  arc: 95 * Math.PI / 180,  // each arc reaches a little past the podium's sides, as on a band chart
  frontR: 170,      // the front arc's least radius, leaving room for the podium
  gap: 10,          // between neighbouring chairs on an arc
  rowGap: 18,       // between a chair and the chairs of the arc in front of it
  percGap: 44,      // between the back arc and the percussion line
  percPerLine: 8,   // more stations than this stand in two lines
  podiumW: 130,
  podiumH: 54,
  pad: 34,
  // A new percussion station gets the first of these not already on the line
  percDefaults: ['timpani', 'aux', 'drumkit', 'glockenspiel', 'piano', 'snare', 'bassdrum', 'xylophone', 'marimba', 'vibraphone', 'chimes', 'cymbals']
};

class SeatingChartApp {
      constructor() {
        this.classes = [];
        this.currentClassId = null;
        this.isEditMode = false;
        this.isClassListEditMode = false;
        // Which sidebar list is showing: 'today' (Today's List) or 'roster' (Class Roster); a per-browser convenience
        // Pressing the open tab again folds the list away until either tab is pressed
        this.sidebarListTab = 'today';
        this.sidebarListHidden = false;
        try {
          if (localStorage.getItem('classPlanner_sidebarListTab') === 'roster') this.sidebarListTab = 'roster';
          this.sidebarListHidden = localStorage.getItem('classPlanner_sidebarListHidden') === '1';
        } catch (e) { /* storage blocked: start on Today's List, open */ }
        this.isAttendanceView = false;
        // The checked floor pattern behind the seating chart (Settings → Background Pattern); on unless
        // turned off. The Garden keeps its own wall either way.
        this.chartPattern = true;
        try { this.chartPattern = localStorage.getItem('classPlanner_chartPattern') !== 'off'; } catch (e) { /* stays on */ }
        
        this.draggedStudentName = null;
        this.sourceGroupIndex = null;
        this.draggedGroupIndex = null;
        this.isFullScreen = false;
        this.selectedAttendanceDate = new Date();
        this.calendarViewMonth = new Date().getMonth();
        this.calendarViewYear = new Date().getFullYear();
        this.activeTakeAttendanceMode = null;
        this.isAttendanceSessionActive = false;
        this.activeAttendanceDate = null;
        this.activeAttendanceStatuses = {};
        this.isGradeScoringActive = false;
        this.activeGradeSession = { title: 'Singing', date: '', scores: {} };
        this.isDraftScoringActive = false;
        this.draftGradeColumn = null;
        this.draggedGradeColIndex = null;
        this.suppressRemoveStudentWarning = localStorage.getItem('seatingApp_suppressRemoveStudentWarning') === 'true';
        this.studentPendingRemoval = null;
        this.appName = localStorage.getItem('seatingApp_appName') || 'ClassPlanner';
        this.gradingStyle = localStorage.getItem('seatingApp_gradingStyle') || 'informal';
        this.settingShowFirstName = true;
        this.settingShowLastName = false;
        this.settingShowFaces = true;
        this.settingShowGradesRatio = true;
        this.chartZoom = parseInt(localStorage.getItem('classPlanner_chartZoom') || '80', 10);
        this.gardenGrowth = this.normalizeGardenGrowth(this.readJson('classPlanner_gardenGrowth_v1'));
        // Settings > Edit Garden: the class whose garden is being fixed by hand (never saved)
        this.gardenEditClassId = null;
        // The test dial's device-only stages are gone now that plants grow from attendance
        localStorage.removeItem('classPlanner_gardenTest_v1');
        localStorage.removeItem('classPlanner_gardenTestStage');

        this.subjects = [
          {
            id: 'subj_music',
            name: 'Music',
            categories: ['Singing', 'Instruments', 'Movement', 'Culture', 'Theory', 'Effort']
          }
        ];
        this.tempSubjects = [];
        this.schedules = [
          {
            id: 'sched_regular',
            name: 'Regular Schedule',
            timeBlocks: []
          }
        ];
        this.currentScheduleId = 'sched_regular';
        this.tempSchedules = [];
        this.tempSelectedScheduleId = 'sched_regular';
        this.scheduleTimeBlocks = [];
        this.isCalendarSyncEnabled = false;
        this.calendarSyncWeekOffset = 0;

        this.init();
      }

      updateAppTitle() {
        const titleText = (this.appName && this.appName.trim()) ? this.appName.trim() : 'ClassPlanner';
        const brandEl = document.getElementById('appTitleBrandText');
        if (brandEl) brandEl.textContent = titleText;
        document.title = `${titleText} 2.0`;
      }

      init() {
        this.loadData();
        this.updateAppTitle();

        if (this.classes.length === 0) {
          this.createSampleData();
        }

        if (!this.currentClassId || !this.classes.some(c => c.id === this.currentClassId)) {
          this.currentClassId = this.classes[0] ? this.classes[0].id : null;
        }

        // The Garden sizes its pots to fit the screen, and Band and the tables fit their room to its
        // width, so refit when the window or full screen changes
        const refitGarden = () => {
          cancelAnimationFrame(this.gardenRefitFrame);
          this.gardenRefitFrame = requestAnimationFrame(() => {
            const cls = this.getCurrentClass();
            if (!cls) return;
            if (cls.layout === 'band' || TABLE_LAYOUTS.includes(cls.layout)) {
              if (this.bandPaintDown || document.querySelector('.table-moving')) return;
              if (Math.round(this.getChartContentWidth()) !== this.chartRoomW) this.renderChart(cls);
              return;
            }
            if (cls.layout !== 'garden') return;
            const space = this.getGardenSpace();
            if (space && `${space.width}x${space.height}` !== this.gardenSpaceKey) this.renderChart(cls);
          });
        };
        window.addEventListener('resize', refitGarden);
        const chartViewport = document.querySelector('#seatingAppBody .viewport');
        if (chartViewport && window.ResizeObserver) new ResizeObserver(refitGarden).observe(chartViewport);

        // Card names are sized by measuring them in the handwriting font, so size them again once it loads
        if (document.fonts && document.fonts.load) {
          document.fonts.load(`20px ${SEAT_NAME.font}`).then(() => this.render()).catch(() => {});
        }

        // Drop-between-names: show where a dragged name will land
        document.addEventListener('dragover', (e) => this.updateSeatInsertMarker(e));
        document.addEventListener('drop', () => this.hideSeatInsertMarker());
        document.addEventListener('dragend', () => this.hideSeatInsertMarker());

        // Full screen: the drop-down bars sit under the floating controls, and the page moves down by
        // their height (--fs-bars-h) so they cover neither the controls nor the chart
        const topBars = document.getElementById('topBarsContainer');
        if (topBars && window.ResizeObserver) {
          new ResizeObserver(() => {
            document.body.style.setProperty('--fs-bars-h', `${topBars.offsetHeight}px`);
          }).observe(topBars);
        }

        // Band: a paint stroke ends wherever the pointer is let go; the chair editor closes on a press
        // anywhere outside it, or on Escape (which then leaves full screen alone)
        document.addEventListener('pointerup', () => this.endBandPaint());
        document.addEventListener('pointercancel', () => this.endBandPaint());
        document.addEventListener('pointerdown', (e) => {
          if (!this.bandEditorChairId || !e.target || !e.target.closest) return;
          if (e.target.closest('#bandChairEditor, .band-tag, .band-chair-open')) return;
          this.closeBandChairEditor();
        });

        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.bandEditorChairId) {
            this.closeBandChairEditor();
            return;
          }
          if (e.key === 'Escape' && this.isFullScreen) {
            this.toggleFullScreen(false);
          }
        });

        // Close secondary layout menu when clicking outside of it
        window.addEventListener('click', (e) => {
          const layoutBar = document.getElementById('layoutBar');
          const layoutBtn = document.getElementById('headerLayoutBtn');
          const fsLayoutBtn = document.getElementById('fullscreenLayoutBtn');
          const headerEditBtn = document.getElementById('headerEditBtn');
          const fsEditBtn = document.getElementById('fullscreenEditBtn');
          const rosterEditBtn = document.getElementById('rosterEditBtn');
          const rowsSub = document.getElementById('rowsSubheader');
          const linesSub = document.getElementById('linesSubheader');
          const bandSub = document.getElementById('bandSubheader');

          if (layoutBar && layoutBar.classList.contains('open')) {
            if (
              e.target &&
              !layoutBar.contains(e.target) &&
              !(layoutBtn && layoutBtn.contains(e.target)) &&
              !(fsLayoutBtn && fsLayoutBtn.contains(e.target)) &&
              !(headerEditBtn && headerEditBtn.contains(e.target)) &&
              !(fsEditBtn && fsEditBtn.contains(e.target)) &&
              !(rosterEditBtn && rosterEditBtn.contains(e.target)) &&
              !(rowsSub && rowsSub.contains(e.target)) &&
              !(linesSub && linesSub.contains(e.target)) &&
              !(bandSub && bandSub.contains(e.target))
            ) {
              this.closeLayoutMenu();
            }
          }

          const zoomBar = document.getElementById('zoomBar');
          const zoomBtn = document.getElementById('headerZoomBtn');
          const fsZoomBtn = document.getElementById('fullscreenZoomBtn');

          if (zoomBar && zoomBar.style.display !== 'none') {
            if (
              e.target &&
              !zoomBar.contains(e.target) &&
              !(zoomBtn && zoomBtn.contains(e.target)) &&
              !(fsZoomBtn && fsZoomBtn.contains(e.target))
            ) {
              this.closeZoomMenu();
            }
          }
        });

        // Cross-tab synchronization via storage event
        window.addEventListener('storage', (event) => {
          this.handleStorageSync(event);
        });

        this.applyChartZoom();
        this.applyChartPattern();
        this.checkAndResetDailyAbsences();

        // Listen for window focus & visibility to auto-reset absences at the start of a new day
        window.addEventListener('focus', () => {
          if (this.checkAndResetDailyAbsences()) {
            this.render();
          }
        });
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            if (this.checkAndResetDailyAbsences()) {
              this.render();
            }
          }
        });

        // Periodic check every 60 seconds to auto-reset when date rolls over at midnight
        setInterval(() => {
          if (this.checkAndResetDailyAbsences()) {
            this.render();
            if (this.currentViewMode === 'attendance') this.renderAttendanceTable();
          }
        }, 60000);

        this.renderClassDropdown();
        this.renderScheduleDropdown();
        this.updateCalendarSyncUI();
        this.render();
      }

      getTodayDateString() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      }

      checkAndResetDailyAbsences() {
        const todayStr = this.getTodayDateString();
        let changed = false;

        if (Array.isArray(this.classes)) {
          this.classes.forEach(c => {
            if (!c.absentDate) {
              c.absentDate = todayStr;
            } else if (c.absentDate !== todayStr) {
              // Date has advanced to a new day: reset active absences back to present
              if (Array.isArray(c.absentStudents) && c.absentStudents.length > 0) {
                c.absentStudents = [];
                changed = true;
              }
              c.absentDate = todayStr;
            }
            if (!Array.isArray(c.absentStudents)) {
              c.absentStudents = [];
            }
          });
        }

        if (changed) {
          this.saveData();
        }
        return changed;
      }

      handleStorageSync(event) {
        // If event.key is provided and does not pertain to ClassPlanner, ignore
        if (event && event.key && 
            !event.key.startsWith('classPlanner_') && 
            !event.key.startsWith('seatingApp_') && 
            !event.key.startsWith('seatingChartApp_') &&
            event.key !== 'classPlannerData') {
          return;
        }

        // 1. Reload all state from localStorage
        this.loadData();

        // 2. Update app title & brand text
        this.updateAppTitle();

        // 3. Update calendar sync UI
        this.updateCalendarSyncUI();

        // 4. Ensure valid current class is selected
        if (!this.currentClassId || !this.classes.some(c => c.id === this.currentClassId)) {
          this.currentClassId = this.classes[0] ? this.classes[0].id : null;
        }

        // 5. Re-render all views and dropdowns
        this.renderClassDropdown();
        this.renderScheduleDropdown();
        this.renderGradeSubjectDropdown();
        this.renderScheduleTable();
        this.render();

        if (this.currentViewMode === 'attendance') {
          this.renderAttendanceTable();
        } else if (this.currentViewMode === 'grades') {
          this.renderGradesTable();
        }

        // 6. Refresh open modal lists if active
        const manageSchedModal = document.getElementById('manageScheduleModal');
        if (manageSchedModal && manageSchedModal.classList.contains('active')) {
          this.tempSchedules = JSON.parse(JSON.stringify(this.schedules || []));
          this.tempScheduleClasses = JSON.parse(JSON.stringify(this.classes || []));
          this.populateManageScheduleTopBar();
          this.renderManageScheduleList();
        }

        const manageSubjModal = document.getElementById('manageSubjectsModal');
        if (manageSubjModal && manageSubjModal.classList.contains('active')) {
          this.tempSubjects = JSON.parse(JSON.stringify(this.subjects || []));
          this.renderManageSubjectsList();
        }

        const classListModal = document.getElementById('classListModal');
        if (classListModal && classListModal.classList.contains('active')) {
          this.renderClassList();
        }

        const editClassesModal = document.getElementById('editClassesModal');
        if (editClassesModal && editClassesModal.classList.contains('active')) {
          this.renderEditClassesList();
        }
      }

      toggleLayoutMenu(e) {
        if (e) e.stopPropagation();
        const layoutBar = document.getElementById('layoutBar');
        const layoutBtn = document.getElementById('headerLayoutBtn');
        const fsLayoutBtn = document.getElementById('fullscreenLayoutBtn');
        if (!layoutBar) return;

        const isOpen = layoutBar.classList.contains('open');
        if (isOpen) {
          this.closeLayoutMenu();
        } else {
          layoutBar.classList.add('open');
          [layoutBtn, fsLayoutBtn].forEach(btn => {
            if (btn) {
              btn.classList.remove('btn-outline');
              btn.classList.add('btn-primary');
            }
          });
        }
        this.updateSubheaders();
      }

      closeLayoutMenu() {
        const layoutBar = document.getElementById('layoutBar');
        const layoutBtn = document.getElementById('headerLayoutBtn');
        const fsLayoutBtn = document.getElementById('fullscreenLayoutBtn');
        if (layoutBar) layoutBar.classList.remove('open');
        [layoutBtn, fsLayoutBtn].forEach(btn => {
          if (btn) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
          }
        });
        this.updateSubheaders();
      }

      toggleZoomMenu(e) {
        if (e) e.stopPropagation();
        const zoomBar = document.getElementById('zoomBar');
        const zoomBtn = document.getElementById('headerZoomBtn');
        const fsZoomBtn = document.getElementById('fullscreenZoomBtn');
        if (!zoomBar) return;

        const isOpen = (zoomBar.style.display !== 'none' && zoomBar.classList.contains('open'));
        if (isOpen) {
          this.closeZoomMenu();
        } else {
          zoomBar.style.display = 'flex';
          zoomBar.classList.add('open');
          [zoomBtn, fsZoomBtn].forEach(btn => {
            if (btn) {
              btn.classList.remove('btn-outline');
              btn.classList.add('btn-primary');
            }
          });
        }
      }

      closeZoomMenu() {
        const zoomBar = document.getElementById('zoomBar');
        const zoomBtn = document.getElementById('headerZoomBtn');
        const fsZoomBtn = document.getElementById('fullscreenZoomBtn');
        if (zoomBar) {
          zoomBar.style.display = 'none';
          zoomBar.classList.remove('open');
        }
        [zoomBtn, fsZoomBtn].forEach(btn => {
          if (btn) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
          }
        });
      }

      applyChartZoom() {
        if (typeof this.chartZoom !== 'number' || isNaN(this.chartZoom)) {
          this.chartZoom = 80;
        }
        document.documentElement.style.setProperty('--chart-zoom', this.chartZoom);
        const slider = document.getElementById('chartZoomSlider');
        if (slider) slider.value = this.chartZoom;
        const label = document.getElementById('chartZoomLabel');
        if (label) label.textContent = `${this.chartZoom}%`;
      }

      applyChartPattern() {
        document.body.classList.toggle('no-chart-pattern', !this.chartPattern);
      }

      setChartPattern(on) {
        this.chartPattern = on !== false;
        try { localStorage.setItem('classPlanner_chartPattern', this.chartPattern ? 'on' : 'off'); } catch (e) { /* not remembered */ }
        this.applyChartPattern();
      }

      toggleChartPatternSetting() {
        this.settingChartPattern = !this.settingChartPattern;
        this.updateChartPatternToggle();
      }

      updateChartPatternToggle() {
        const btn = document.getElementById('btnToggleChartPattern');
        if (!btn) return;
        btn.textContent = this.settingChartPattern ? 'ON' : 'OFF';
        btn.classList.toggle('is-on', this.settingChartPattern);
        btn.setAttribute('aria-pressed', this.settingChartPattern ? 'true' : 'false');
      }

      setZoom(val) {
        const num = parseInt(val, 10);
        this.chartZoom = isNaN(num) ? 80 : Math.min(100, Math.max(20, num));
        localStorage.setItem('classPlanner_chartZoom', this.chartZoom.toString());
        this.applyChartZoom();
      }

      adjustZoom(delta) {
        this.setZoom(this.chartZoom + delta);
      }

      resetZoom() {
        this.setZoom(80);
      }

      toggleFullScreen(forceState) {
        this.isFullScreen = typeof forceState === 'boolean' ? forceState : !this.isFullScreen;

        const btnResize = document.getElementById('btnResize');

        if (this.isFullScreen) {
          document.body.classList.add('fullscreen-mode');
          if (btnResize) btnResize.classList.add('btn-resize-active');
        } else {
          document.body.classList.remove('fullscreen-mode');
          if (btnResize) btnResize.classList.remove('btn-resize-active');
        }

        const fullscreenLayoutBtn = document.getElementById('fullscreenLayoutBtn');
        if (fullscreenLayoutBtn) {
          fullscreenLayoutBtn.style.display = (this.currentViewMode === 'chart' || !this.currentViewMode) ? '' : 'none';
        }
        const fullscreenZoomBtn = document.getElementById('fullscreenZoomBtn');
        if (fullscreenZoomBtn) {
          fullscreenZoomBtn.style.display = (this.currentViewMode === 'chart' || !this.currentViewMode) ? '' : 'none';
        }

        this.updateAddGradeColumnButtonsUI();
      }

      createSampleData() {
        const sampleStudents = [
          'Scooby Doo', 'Shaggy Rogers', 'Fred Jones', 'Velma Dinkley', 'Daphne Blake'
        ];

        const sortedByLast = this.sortStudentsByName(sampleStudents, 'last');
        const numRows = 4;
        const rows = this.distributeStudentsEquallyInOrder(sampleStudents, numRows, 'last');

        const rawSample = {
          id: 'class-' + Date.now(),
          name: 'Mystery Class',
          subjectId: 'subj_music',
          layout: 'rows',
          rowsCount: 4,
          linesCount: 4,
          rowAlignment: 'center',
          rowsRowAlign: {},
          showFirstName: true,
          showLastName: false,
          showFaces: true,
          showInitials: true,
          showGradesAttendanceRatio: true,
          classList: [...sampleStudents],
          studentProfiles: {
            'Scooby Doo': { firstName: 'Scooby', lastName: 'Doo' },
            'Shaggy Rogers': { firstName: 'Shaggy', lastName: 'Rogers' },
            'Fred Jones': { firstName: 'Fred', lastName: 'Jones' },
            'Velma Dinkley': { firstName: 'Velma', lastName: 'Dinkley' },
            'Daphne Blake': { firstName: 'Daphne', lastName: 'Blake' }
          },
          rows: rows,
          lines: this.autoBalanceGroups([...sampleStudents], 4, 'last'),
          circle: [...sortedByLast],
          layoutsData: {
            half: this.autoBalanceGroups([...sampleStudents], 2, 'last'),
            third: this.autoBalanceGroups([...sampleStudents], 3, 'last'),
            fourth: this.autoBalanceGroups([...sampleStudents], 4, 'last'),
            fifth: this.autoBalanceGroups([...sampleStudents], 5, 'last'),
            sixth: this.autoBalanceGroups([...sampleStudents], 6, 'last')
          },
          unplacedStudents: [],
          attendanceDates: [],
          subjectGrades: {
            'subj_music': []
          },
          scheduleTime: '',
          scheduleDays: []
        };

        const sampleClass = this.sanitizeAndMigrateClass(rawSample, 'subj_music');
        // The Star Wars class shows off every layout, the special seating rules, attendance and grades;
        // a new ClassPlanner opens on it
        const starWars = this.buildStarWarsClass();
        if (starWars) {
          const swClass = this.sanitizeAndMigrateClass(starWars, 'subj_music');
          this.classes.push(swClass, sampleClass);
          this.currentClassId = swClass.id;
        } else {
          this.classes.push(sampleClass);
          this.currentClassId = sampleClass.id;
        }
        this.saveData();
      }

      // The Star Wars sample class (star-wars-sample.js): every layout seated, special seating rules,
      // attendance by episode (which grows the garden) and grades. Null if the sample file is missing.
      buildStarWarsClass() {
        const S = (typeof STAR_WARS_SAMPLE !== 'undefined') ? STAR_WARS_SAMPLE : null;
        if (!S) return null;
        const names = S.students.map(s => s[0]);
        const byName = Object.fromEntries(S.students.map(s => [s[0], s]));
        const profiles = {};
        S.students.forEach(([full, first, last]) => { profiles[full] = { firstName: first, lastName: last, rosterName: full }; });

        // One date per episode; present if they are in it
        const dates = S.dates.map(([ep, y, m, d]) => {
          const day = new Date(y, m - 1, d);
          const statuses = {};
          names.forEach(n => { statuses[n] = byName[n][3].split(' ').includes(ep) ? 'present' : 'absent'; });
          return { id: 'date_' + day.getTime(), date: `${m}/${d}/${String(y).slice(2)}`, day: day.toLocaleDateString('en-US', { weekday: 'long' }), timestamp: day.getTime(), statuses };
        });
        const dateOf = ep => dates[S.dates.findIndex(d => d[0] === ep)];

        // Grades from each student's skill, a little different per test; only those present that day
        const wobble = (name, title) => (this.nameHash(name + title) % 3) - 1;
        const gradeColumns = S.grades.map(([title, category, style, ep], i) => {
          const day = dateOf(ep);
          const grades = {};
          names.forEach(n => {
            if (!day || day.statuses[n] !== 'present') return;
            const skill = byName[n][5];
            const w = wobble(n, title);
            if (style === 'points') grades[n] = Math.max(0, Math.min(10, 5 + skill + w));
            else if (style === 'standards') grades[n] = String(Math.max(1, Math.min(4, skill + Math.min(0, w))));
            else grades[n] = skill >= 4 ? (w >= 0 ? 'star' : 'plus') : skill === 3 ? 'plus' : skill === 2 ? (w > 0 ? 'plus' : 'minus') : (w > 0 ? 'minus' : 'x');
          });
          return { id: `g_starwars_${i + 1}`, date: day ? day.date : '', title, category, gradingStyle: style, maxPoints: 10, grades };
        });

        let n = 0;
        const rule = (student, type, other) => ({ id: `rsw${++n}`, student, type, ...(other ? { other } : {}) });
        const seatingRules = [
          ...Object.entries(S.places).flatMap(([type, list]) => list.map(s => rule(s, type))),
          ...S.with.map(([a, b]) => rule(a, 'with', b)),
          ...S.apart.map(([a, b]) => rule(a, 'apart', b))
        ];

        // Band: strings on the front arc, woodwinds in the middle, brass at the back, then percussion
        const family = id => (BAND_INSTRUMENTS[id] || {}).family;
        const percIds = new Set(BAND_FAMILIES.find(f => f.name === 'Percussion & Keys').items.map(i => i[0]));
        const seat = S.seating || {};
        const bandRows = seat.band || {
          rows: [
            names.filter(s => family(byName[s][4]) === 'Strings'),
            names.filter(s => family(byName[s][4]) === 'Woodwinds' && !['contrabassoon', 'tenorsax'].includes(byName[s][4])),
            names.filter(s => family(byName[s][4]) === 'Brass' || ['contrabassoon', 'tenorsax'].includes(byName[s][4]))
          ],
          perc: names.filter(s => percIds.has(byName[s][4]))
        };
        const chair = s => this.makeBandChair(byName[s][4], s);
        const band = { rows: bandRows.rows.map(row => row.map(chair)), perc: bandRows.perc.map(chair) };

        const groups = (count) => this.distributeStudentsEquallyInOrder(names, count, 'last');
        const rowsCount = 6;   // rows of 7 fit across the classroom
        const linesCount = 4;
        const first = dates[0];
        return {
          id: 'class-star-wars-' + Date.now(),
          name: S.name,
          subjectId: 'subj_music',
          layout: 'band',
          rowsCount,
          linesCount,
          rowAlignment: 'center',
          rowsRowAlign: {},
          showFirstName: true,
          showLastName: false,
          showFaces: true,
          showInitials: true,
          showGradesAttendanceRatio: true,
          classList: [...names],
          studentProfiles: profiles,
          rows: seat.rows || this.distributeStudentsEquallyInOrder(names, rowsCount, 'last'),
          lines: seat.lines || this.autoBalanceGroups(names, linesCount, 'last'),
          circle: seat.circle || this.sortStudentsByName(names, 'last'),
          layoutsData: {
            half: seat.half || groups(2),
            third: seat.third || groups(3),
            fourth: seat.fourth || groups(4),
            fifth: seat.fifth || groups(5),
            sixth: seat.sixth || groups(6),
            ...Object.fromEntries(TABLE_LAYOUTS.map(k => [`${k}Rows`, this.defaultTableRows(k)]))
          },
          containerSizes: seat.tables ? JSON.parse(JSON.stringify(seat.tables)) : {},
          band,
          seatingRules,
          unplacedStudents: [],
          absentStudents: [],
          attendanceDates: dates,
          attendancePace: 'weekly',
          gardenStart: new Date(first.timestamp).toISOString(),
          subjectGrades: { subj_music: gradeColumns },
          scheduleTime: '',
          scheduleDays: []
        };
      }

      parseStudentName(rawName) {
        if (!rawName || typeof rawName !== 'string') {
          return { firstName: '', lastName: '', rosterName: '' };
        }
        const rosterName = rawName.trim();
        // Remove text in parentheses for seating chart first/last name
        let cleanName = rosterName.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
        if (!cleanName) {
          // If the entire string was inside parentheses, e.g. "(Nathan)"
          cleanName = rosterName.replace(/[()]/g, '').trim();
        }

        let firstName = '';
        let lastName = '';

        if (cleanName.includes(',')) {
          const parts = cleanName.split(',');
          lastName = (parts[0] || '').trim();
          firstName = (parts.slice(1).join(',') || '').trim();
        } else {
          const parts = cleanName.split(/\s+/).filter(Boolean);
          firstName = parts[0] || '';
          lastName = parts.slice(1).join(' ') || '';
        }

        return {
          firstName: firstName,
          lastName: lastName,
          rosterName: rosterName
        };
      }

      getStudentLastName(fullName) {
        if (!fullName || typeof fullName !== 'string') return '';
        const parsed = this.parseStudentName(fullName);
        return parsed.lastName || parsed.firstName || '';
      }

      sortStudentsByName(students, sortMode = 'last') {
        const arr = [...students];
        if (sortMode === 'first') {
          arr.sort((a, b) => {
            const firstA = this.parseStudentName(a).firstName || a;
            const firstB = this.parseStudentName(b).firstName || b;
            const comp = firstA.localeCompare(firstB, undefined, { sensitivity: 'base' });
            return comp !== 0 ? comp : a.localeCompare(b, undefined, { sensitivity: 'base' });
          });
        } else if (sortMode === 'last') {
          arr.sort((a, b) => {
            const lastA = this.getStudentLastName(a);
            const lastB = this.getStudentLastName(b);
            const comp = lastA.localeCompare(lastB, undefined, { sensitivity: 'base' });
            return comp !== 0 ? comp : a.localeCompare(b, undefined, { sensitivity: 'base' });
          });
        } else if (sortMode === 'random') {
          return this.shuffleArray(arr);
        }
        return arr;
      }

      distributeStudentsEquallyInOrder(students, numBuckets, sortMode = 'last') {
        const sorted = this.sortStudentsByName(students, sortMode);
        const buckets = Array.from({ length: numBuckets }, () => []);
        if (sorted.length === 0 || numBuckets <= 0) return buckets;

        if (sortMode === 'random') {
          sorted.forEach((name, i) => {
            buckets[i % numBuckets].push(name);
          });
          return buckets;
        }

        // Sequential block distribution:
        // First chunk of students goes to Bucket 0, next chunk to Bucket 1, etc.
        const baseSize = Math.floor(sorted.length / numBuckets);
        const remainder = sorted.length % numBuckets;
        let cursor = 0;

        for (let b = 0; b < numBuckets; b++) {
          const countForThisBucket = baseSize + (b < remainder ? 1 : 0);
          for (let c = 0; c < countForThisBucket; c++) {
            if (cursor < sorted.length) {
              buckets[b].push(sorted[cursor]);
              cursor++;
            }
          }
        }

        return buckets;
      }

      autoBalanceGroups(students, numGroups, sortMode = 'last') {
        return this.distributeStudentsEquallyInOrder(students, numGroups, sortMode);
      }

      saveData() {
        // Sync active schedule time blocks before saving
        const currentSched = this.getCurrentSchedule();
        if (currentSched) {
          currentSched.timeBlocks = this.scheduleTimeBlocks || [];
        }

        localStorage.setItem('classPlanner_data_v6', JSON.stringify(this.classes));
        localStorage.setItem('classPlanner_currentId_v6', this.currentClassId || '');
        localStorage.setItem('classPlanner_appName', this.appName || 'ClassPlanner');
        localStorage.setItem('classPlanner_subjects_v1', JSON.stringify(this.subjects));
        localStorage.setItem('classPlanner_gardenGrowth_v1', JSON.stringify(this.gardenGrowth));
        localStorage.setItem('classPlanner_schedules_v1', JSON.stringify(this.schedules || []));
        localStorage.setItem('classPlanner_currentScheduleId_v1', this.currentScheduleId || '');
        localStorage.setItem('classPlanner_scheduleTimeBlocks_v1', JSON.stringify(this.scheduleTimeBlocks || []));
        localStorage.setItem('classPlanner_calendarSync_v1', this.isCalendarSyncEnabled ? 'true' : 'false');
        localStorage.setItem('seatingApp_appName', this.appName || 'ClassPlanner');
        localStorage.setItem('seatingApp_gradingStyle', this.gradingStyle || 'informal');
        localStorage.setItem('seatingApp_suppressRemoveStudentWarning', this.suppressRemoveStudentWarning.toString());
      }

      getCurrentSchedule() {
        if (!Array.isArray(this.schedules) || this.schedules.length === 0) {
          this.schedules = [
            {
              id: 'sched_regular',
              name: 'Regular Schedule',
              timeBlocks: Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : []
            }
          ];
          this.currentScheduleId = 'sched_regular';
        }
        let found = this.schedules.find(s => s.id === this.currentScheduleId);
        if (!found) {
          this.currentScheduleId = this.schedules[0].id;
          found = this.schedules[0];
        }
        if (!Array.isArray(found.timeBlocks)) found.timeBlocks = [];
        return found;
      }

      renderScheduleDropdown() {
        const scheduleSelect = document.getElementById('scheduleSelect');
        const fsScheduleSelect = document.getElementById('fullscreenScheduleSelect');
        const modalScheduleSelect = document.getElementById('modalScheduleSelect');

        const optionsHtml = (this.schedules || []).map(s => {
          const isSelected = (s.id === this.currentScheduleId);
          return `<option value="${s.id}" ${isSelected ? 'selected' : ''}>${this.escapeHtml(s.name)}</option>`;
        }).join('');

        if (scheduleSelect) {
          scheduleSelect.innerHTML = optionsHtml;
          scheduleSelect.value = this.currentScheduleId;
        }
        if (fsScheduleSelect) {
          fsScheduleSelect.innerHTML = optionsHtml;
          fsScheduleSelect.value = this.currentScheduleId;
        }
        if (modalScheduleSelect) {
          const modalOptionsHtml = (this.tempSchedules || this.schedules || []).map(s => {
            const isSelected = (s.id === (this.tempSelectedScheduleId || this.currentScheduleId));
            return `<option value="${s.id}" ${isSelected ? 'selected' : ''}>${this.escapeHtml(s.name)}</option>`;
          }).join('');
          modalScheduleSelect.innerHTML = modalOptionsHtml;
          modalScheduleSelect.value = this.tempSelectedScheduleId || this.currentScheduleId;
        }
      }

      switchSchedule(scheduleId) {
        if (!scheduleId || !this.schedules.some(s => s.id === scheduleId)) return;
        this.currentScheduleId = scheduleId;
        const activeSched = this.getCurrentSchedule();
        this.scheduleTimeBlocks = activeSched.timeBlocks || [];
        this.saveData();
        this.renderScheduleDropdown();
        this.renderScheduleTable();
      }

      getClassScheduleSlots(c, scheduleId = null) {
        if (!c) return [];
        const sId = scheduleId || this.currentScheduleId || (this.schedules[0] ? this.schedules[0].id : 'sched_regular');
        if (c.schedules && c.schedules[sId] && Array.isArray(c.schedules[sId].scheduleSlots) && c.schedules[sId].scheduleSlots.length > 0) {
          return c.schedules[sId].scheduleSlots;
        }
        if (Array.isArray(c.scheduleSlots) && c.scheduleSlots.length > 0) {
          return c.scheduleSlots;
        }
        return [{
          id: 'slot_1',
          startBlockIdx: (typeof c.scheduleStartBlockIdx === 'number') ? c.scheduleStartBlockIdx : -1,
          blockCount: (typeof c.scheduleBlockCount === 'number') ? c.scheduleBlockCount : 1,
          time: c.scheduleTime || '',
          days: Array.isArray(c.scheduleDays) ? c.scheduleDays : []
        }];
      }

      setClassScheduleSlots(slots, c, scheduleId = null) {
        if (!c) return;
        const sId = scheduleId || this.currentScheduleId || (this.schedules[0] ? this.schedules[0].id : 'sched_regular');
        if (!c.schedules || typeof c.schedules !== 'object') c.schedules = {};
        if (!c.schedules[sId]) c.schedules[sId] = {};
        c.schedules[sId].scheduleSlots = slots;
        if (sId === this.currentScheduleId) {
          c.scheduleSlots = slots;
          if (slots[0]) {
            c.scheduleTime = slots[0].time;
            c.scheduleDays = slots[0].days;
            c.scheduleStartBlockIdx = slots[0].startBlockIdx;
            c.scheduleBlockCount = slots[0].blockCount;
          }
        }
      }

      getClassScheduleNotes(c, scheduleId = null) {
        if (!c) return [];
        const sId = scheduleId || this.currentScheduleId || (this.schedules[0] ? this.schedules[0].id : 'sched_regular');
        if (c.schedules && c.schedules[sId] && Array.isArray(c.schedules[sId].scheduleNotes)) {
          return c.schedules[sId].scheduleNotes;
        }
        if (Array.isArray(c.scheduleNotes)) {
          return c.scheduleNotes;
        }
        return [];
      }

      setClassScheduleNotes(notes, c, scheduleId = null) {
        if (!c) return;
        const sId = scheduleId || this.currentScheduleId || (this.schedules[0] ? this.schedules[0].id : 'sched_regular');
        if (!c.schedules || typeof c.schedules !== 'object') c.schedules = {};
        if (!c.schedules[sId]) c.schedules[sId] = {};
        c.schedules[sId].scheduleNotes = notes;
        if (sId === this.currentScheduleId) {
          c.scheduleNotes = notes;
        }
      }

      formatNoteDateDisplay(dateStr) {
        if (!dateStr) return '';
        const parts = String(dateStr).split('-');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10);
          const d = parseInt(parts[2], 10);
          if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            const dt = new Date(y, m - 1, d);
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = dayNames[dt.getDay()] || '';
            return `${dayName ? dayName + ' ' : ''}${m}/${d}/${y}`;
          }
        }
        return dateStr;
      }

      sanitizeAndMigrateClass(c, defaultSubjId = 'subj_music') {
        if (!c || typeof c !== 'object') return null;

        if (!c.id) c.id = 'class-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        if (!c.name || typeof c.name !== 'string') c.name = 'Class';

        if (!c.subjectId) c.subjectId = defaultSubjId;

        // Subject Grades migration & sanitization
        if (!c.subjectGrades || typeof c.subjectGrades !== 'object') {
          c.subjectGrades = {};
        }
        if (Array.isArray(c.gradeColumns) && c.gradeColumns.length > 0) {
          if (!Array.isArray(c.subjectGrades[c.subjectId]) || c.subjectGrades[c.subjectId].length === 0) {
            c.subjectGrades[c.subjectId] = [...c.gradeColumns];
          }
          delete c.gradeColumns;
        }
        Object.keys(c.subjectGrades).forEach(subjKey => {
          if (!Array.isArray(c.subjectGrades[subjKey])) {
            c.subjectGrades[subjKey] = [];
          } else {
            c.subjectGrades[subjKey] = c.subjectGrades[subjKey].map(col => {
              if (!col || typeof col !== 'object') return null;
              return {
                id: col.id || ('grade_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
                date: col.date || '',
                title: col.title || 'Assessment',
                category: col.category || 'General',
                gradingStyle: col.gradingStyle || 'informal',
                maxPoints: typeof col.maxPoints === 'number' ? col.maxPoints : 10,
                grades: (col.grades && typeof col.grades === 'object') ? { ...col.grades } : {}
              };
            }).filter(Boolean);
          }
        });

        // Attendance Dates sanitization & chronological sorting
        if (!Array.isArray(c.attendanceDates)) {
          c.attendanceDates = [];
        } else {
          c.attendanceDates = c.attendanceDates.map(d => {
            if (!d || typeof d !== 'object') return null;
            return {
              id: d.id || ('date_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
              date: d.date || '',
              day: d.day || '',
              timestamp: typeof d.timestamp === 'number' ? d.timestamp : Date.now(),
              statuses: (d.statuses && typeof d.statuses === 'object') ? { ...d.statuses } : {}
            };
          }).filter(Boolean);
          c.attendanceDates.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        }

        // Layouts and Counts
        if (!c.layout) c.layout = 'rows';
        if (!c.rowsCount || typeof c.rowsCount !== 'number' || c.rowsCount < 1 || c.rowsCount > 6) c.rowsCount = 4;
        if (!c.linesCount || typeof c.linesCount !== 'number' || c.linesCount < 1 || c.linesCount > 6) c.linesCount = 4;
        if (!c.rowAlignment) c.rowAlignment = 'center';
        if (!c.rowsRowAlign || typeof c.rowsRowAlign !== 'object') c.rowsRowAlign = {};
        if (typeof c.divideRows !== 'boolean') c.divideRows = false;
        if (!Array.isArray(c.dividedRowsData)) c.dividedRowsData = [];

        // Display Flags
        if (typeof c.showFirstName !== 'boolean') c.showFirstName = true;
        if (typeof c.showLastName !== 'boolean') c.showLastName = false;
        if (typeof c.showFaces !== 'boolean') c.showFaces = true;
        if (typeof c.showInitials !== 'boolean') c.showInitials = true;
        if (typeof c.showGradesAttendanceRatio !== 'boolean') c.showGradesAttendanceRatio = true;

        // Class Rosters & Students
        const allStudents = this.getAllClassStudents(c);
        if (!Array.isArray(c.classList) || c.classList.length === 0) {
          c.classList = [...allStudents];
        } else {
          c.classList = c.classList.map(s => String(s).trim()).filter(Boolean);
        }

        if (!c.studentProfiles || typeof c.studentProfiles !== 'object') {
          c.studentProfiles = {};
        }
        c.classList.forEach(studentName => {
          if (!c.studentProfiles[studentName]) {
            const parsed = this.parseStudentName(studentName);
            c.studentProfiles[studentName] = {
              firstName: parsed.firstName || studentName,
              lastName: parsed.lastName || '',
              rosterName: parsed.rosterName || studentName
            };
          } else {
            const prof = c.studentProfiles[studentName];
            if (prof.lastName && prof.lastName.includes('(')) {
              const parsed = this.parseStudentName(prof.rosterName || studentName);
              prof.firstName = parsed.firstName;
              prof.lastName = parsed.lastName;
              prof.rosterName = parsed.rosterName;
            }
            if (!prof.rosterName) {
              if (prof.lastName && prof.lastName.trim()) {
                prof.rosterName = `${prof.firstName || studentName} ${prof.lastName.trim()}`.trim();
              } else {
                prof.rosterName = prof.firstName || studentName;
              }
            } else if (prof.lastName && prof.lastName.trim() && !prof.rosterName.toLowerCase().includes(prof.lastName.trim().toLowerCase())) {
              prof.rosterName = `${prof.rosterName} ${prof.lastName.trim()}`.trim();
            }
          }
        });

        if (!Array.isArray(c.unplacedStudents)) c.unplacedStudents = [];
        else c.unplacedStudents = c.unplacedStudents.map(s => String(s).trim()).filter(Boolean);

        // Seating arrangements
        if (!Array.isArray(c.rows)) c.rows = [[]];
        c.rows = c.rows.map(r => Array.isArray(r) ? r.map(s => String(s).trim()).filter(Boolean) : []);

        if (!Array.isArray(c.lines)) c.lines = [[]];
        c.lines = c.lines.map(l => Array.isArray(l) ? l.map(s => String(s).trim()).filter(Boolean) : []);

        if (!Array.isArray(c.circle)) c.circle = [...c.classList];
        else c.circle = c.circle.map(s => String(s).trim()).filter(Boolean);

        if (!Array.isArray(c.freeform)) c.freeform = [...c.classList];
        else c.freeform = c.freeform.map(s => String(s).trim()).filter(Boolean);
        if (!c.freeformPositions || typeof c.freeformPositions !== 'object') c.freeformPositions = {};
        if (c.seatingRules !== undefined) c.seatingRules = this.normalizeSeatingRules(c.seatingRules);
        if (c.band !== undefined) {
          const band = this.normalizeBand(c.band);
          if (band) c.band = band;
          else delete c.band;
        }

        if (!c.layoutsData || typeof c.layoutsData !== 'object') c.layoutsData = {};
        ['half', 'third', 'fourth', 'fifth', 'sixth'].forEach((layoutKey, idx) => {
          const numGroups = idx + 2;
          if (!Array.isArray(c.layoutsData[layoutKey]) || c.layoutsData[layoutKey].length < numGroups) {
            c.layoutsData[layoutKey] = this.autoBalanceGroups([...c.classList], numGroups, 'last');
          } else {
            c.layoutsData[layoutKey] = c.layoutsData[layoutKey].map(g => Array.isArray(g) ? g.map(s => String(s).trim()).filter(Boolean) : []);
          }
        });

        // Schedule information (Top-level & per-schedule)
        if (!c.schedules || typeof c.schedules !== 'object') {
          c.schedules = {};
        }

        if (typeof c.scheduleTime !== 'string') c.scheduleTime = '';
        if (!Array.isArray(c.scheduleDays)) c.scheduleDays = [];
        else c.scheduleDays = c.scheduleDays.map(d => String(d).trim()).filter(Boolean);

        if (!Array.isArray(c.scheduleNotes)) c.scheduleNotes = [];
        else {
          c.scheduleNotes = c.scheduleNotes.map(n => {
            if (!n || typeof n !== 'object') return null;
            return {
              id: n.id || ('note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
              text: typeof n.text === 'string' ? n.text.trim() : '',
              target: (n.target === 'specific') ? 'specific' : (n.target === 'once' ? 'once' : 'all'),
              days: Array.isArray(n.days) ? n.days.map(d => String(d).trim()).filter(Boolean) : [],
              date: typeof n.date === 'string' ? n.date.trim() : ''
            };
          }).filter(n => n && n.text);
        }

        if (typeof c.scheduleStartBlockIdx !== 'number') c.scheduleStartBlockIdx = -1;
        if (typeof c.scheduleBlockCount !== 'number' || c.scheduleBlockCount < 1) c.scheduleBlockCount = 1;

        if (!Array.isArray(c.scheduleSlots) || c.scheduleSlots.length === 0) {
          c.scheduleSlots = [
            {
              id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              startBlockIdx: c.scheduleStartBlockIdx,
              blockCount: c.scheduleBlockCount,
              time: c.scheduleTime,
              days: [...c.scheduleDays]
            }
          ];
        } else {
          c.scheduleSlots = c.scheduleSlots.map(s => {
            if (!s || typeof s !== 'object') return null;
            return {
              id: s.id || ('slot_' + Math.random().toString(36).substr(2, 4)),
              startBlockIdx: typeof s.startBlockIdx === 'number' ? s.startBlockIdx : -1,
              blockCount: typeof s.blockCount === 'number' && s.blockCount >= 1 ? s.blockCount : 1,
              time: typeof s.time === 'string' ? s.time.trim() : '',
              days: Array.isArray(s.days) ? s.days.map(d => String(d).trim()).filter(Boolean) : []
            };
          }).filter(Boolean);
          if (c.scheduleSlots.length === 0) {
            c.scheduleSlots = [{
              id: 'slot_1',
              startBlockIdx: -1,
              blockCount: 1,
              time: '',
              days: []
            }];
          }
        }

        if (c.scheduleSlots[0]) {
          c.scheduleTime = c.scheduleSlots[0].time;
          c.scheduleDays = c.scheduleSlots[0].days;
          c.scheduleStartBlockIdx = c.scheduleSlots[0].startBlockIdx;
          c.scheduleBlockCount = c.scheduleSlots[0].blockCount;
        }

        // Migrate or sanitize all schedule entries in c.schedules
        const primarySchedId = this.currentScheduleId || 'sched_regular';
        if (!c.schedules[primarySchedId] || !Array.isArray(c.schedules[primarySchedId].scheduleSlots) || c.schedules[primarySchedId].scheduleSlots.length === 0) {
          c.schedules[primarySchedId] = {
            scheduleSlots: JSON.parse(JSON.stringify(c.scheduleSlots)),
            scheduleNotes: JSON.parse(JSON.stringify(c.scheduleNotes))
          };
        }

        Object.keys(c.schedules).forEach(schedId => {
          const entry = c.schedules[schedId];
          if (!entry || typeof entry !== 'object') {
            c.schedules[schedId] = { scheduleSlots: [], scheduleNotes: [] };
            return;
          }
          if (!Array.isArray(entry.scheduleSlots)) entry.scheduleSlots = [];
          entry.scheduleSlots = entry.scheduleSlots.map(s => {
            if (!s || typeof s !== 'object') return null;
            return {
              id: s.id || ('slot_' + Math.random().toString(36).substr(2, 4)),
              startBlockIdx: typeof s.startBlockIdx === 'number' ? s.startBlockIdx : -1,
              blockCount: typeof s.blockCount === 'number' && s.blockCount >= 1 ? s.blockCount : 1,
              time: typeof s.time === 'string' ? s.time.trim() : '',
              days: Array.isArray(s.days) ? s.days.map(d => String(d).trim()).filter(Boolean) : []
            };
          }).filter(Boolean);
          if (entry.scheduleSlots.length === 0) {
            entry.scheduleSlots = [{
              id: 'slot_1',
              startBlockIdx: -1,
              blockCount: 1,
              time: '',
              days: []
            }];
          }

          if (!Array.isArray(entry.scheduleNotes)) entry.scheduleNotes = [];
          entry.scheduleNotes = entry.scheduleNotes.map(n => {
            if (!n || typeof n !== 'object') return null;
            return {
              id: n.id || ('note_' + Math.random().toString(36).substr(2, 4)),
              text: typeof n.text === 'string' ? n.text.trim() : '',
              target: (n.target === 'specific') ? 'specific' : (n.target === 'once' ? 'once' : 'all'),
              days: Array.isArray(n.days) ? n.days.map(d => String(d).trim()).filter(Boolean) : [],
              date: typeof n.date === 'string' ? n.date.trim() : ''
            };
          }).filter(n => n && n.text);
        });

        if (typeof c.color !== 'string' || !c.color.trim()) c.color = '#059669';

        if (c.entryType === 'text' || c.isTextOnly === true) {
          c.entryType = 'text';
          c.isTextOnly = true;
        } else {
          c.entryType = 'class';
          c.isTextOnly = false;
        }

        if (typeof c.absentDate !== 'string' || !c.absentDate.trim()) {
          c.absentDate = this.getTodayDateString();
        }
        if (!Array.isArray(c.absentStudents)) {
          c.absentStudents = [];
        }

        return c;
      }

      loadData() {
        const savedClasses = localStorage.getItem('classPlanner_data_v6') || localStorage.getItem('seatingChartApp_classes_v5') || localStorage.getItem('seatingChartApp_classes');
        const savedId = localStorage.getItem('classPlanner_currentId_v6') || localStorage.getItem('seatingChartApp_currentClassId');
        const savedAppName = localStorage.getItem('classPlanner_appName') || localStorage.getItem('seatingApp_appName');
        const savedSubjects = localStorage.getItem('classPlanner_subjects_v1');
        const savedSchedules = localStorage.getItem('classPlanner_schedules_v1');
        const savedScheduleId = localStorage.getItem('classPlanner_currentScheduleId_v1');
        const savedCalendarSync = localStorage.getItem('classPlanner_calendarSync_v1');
        const savedGradingStyle = localStorage.getItem('seatingApp_gradingStyle');
        const savedSuppressWarning = localStorage.getItem('seatingApp_suppressRemoveStudentWarning');

        if (savedAppName) {
          this.appName = savedAppName;
        }

        if (savedCalendarSync !== null) {
          this.isCalendarSyncEnabled = (savedCalendarSync === 'true');
        }

        if (savedGradingStyle) {
          this.gradingStyle = savedGradingStyle;
        }

        if (savedSuppressWarning !== null) {
          this.suppressRemoveStudentWarning = (savedSuppressWarning === 'true');
        }

        if (savedSubjects) {
          try {
            const parsedSubj = JSON.parse(savedSubjects);
            if (Array.isArray(parsedSubj) && parsedSubj.length > 0) {
              this.subjects = parsedSubj;
            }
          } catch (e) {
            console.error('Error loading saved subjects:', e);
          }
        }

        const savedTimeBlocks = localStorage.getItem('classPlanner_scheduleTimeBlocks_v1');
        if (savedTimeBlocks) {
          try {
            const parsedTB = JSON.parse(savedTimeBlocks);
            if (Array.isArray(parsedTB)) {
              this.scheduleTimeBlocks = parsedTB.map(tb => {
                if (typeof tb === 'string') return { id: 'tb_' + Math.random().toString(36).substr(2, 6), time: tb };
                if (tb && typeof tb === 'object') return { id: tb.id || ('tb_' + Math.random().toString(36).substr(2, 6)), time: typeof tb.time === 'string' ? tb.time : '' };
                return null;
              }).filter(Boolean);
            } else {
              this.scheduleTimeBlocks = [];
            }
          } catch (e) {
            console.error('Error loading schedule time blocks:', e);
            this.scheduleTimeBlocks = [];
          }
        } else {
          this.scheduleTimeBlocks = [];
        }

        if (savedSchedules) {
          try {
            const parsedSched = JSON.parse(savedSchedules);
            if (Array.isArray(parsedSched) && parsedSched.length > 0) {
              this.schedules = parsedSched.map(s => {
                if (!s || typeof s !== 'object') return null;
                return {
                  id: s.id || ('sched_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
                  name: s.name || 'Regular Schedule',
                  timeBlocks: Array.isArray(s.timeBlocks) ? s.timeBlocks : []
                };
              }).filter(Boolean);
            }
          } catch (e) {
            console.error('Error loading saved schedules:', e);
          }
        }

        if (!Array.isArray(this.schedules) || this.schedules.length === 0) {
          this.schedules = [
            {
              id: 'sched_regular',
              name: 'Regular Schedule',
              timeBlocks: Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : []
            }
          ];
          this.currentScheduleId = 'sched_regular';
        } else {
          if (savedScheduleId && this.schedules.some(s => s.id === savedScheduleId)) {
            this.currentScheduleId = savedScheduleId;
          } else {
            this.currentScheduleId = this.schedules[0].id;
          }
        }

        const activeSched = this.getCurrentSchedule();
        this.scheduleTimeBlocks = activeSched.timeBlocks || [];

        const savedCustomColors = localStorage.getItem('classPlanner_customColors_v1');
        if (savedCustomColors) {
          try {
            const parsedCC = JSON.parse(savedCustomColors);
            if (Array.isArray(parsedCC) && parsedCC.length === 4) {
              this.customPaletteColors = parsedCC;
            } else {
              this.customPaletteColors = [null, null, null, null];
            }
          } catch (e) {
            this.customPaletteColors = [null, null, null, null];
          }
        } else {
          this.customPaletteColors = [null, null, null, null];
        }

        if (!Array.isArray(this.subjects) || this.subjects.length === 0) {
          this.subjects = [
            {
              id: 'subj_music',
              name: 'Music',
              categories: ['Singing', 'Instruments', 'Movement', 'Culture', 'Theory', 'Effort']
            }
          ];
        }

        if (savedClasses) {
          try {
            const parsed = JSON.parse(savedClasses);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const defaultSubjId = this.subjects[0] ? this.subjects[0].id : 'subj_music';
              this.classes = parsed.map(c => this.sanitizeAndMigrateClass(c, defaultSubjId)).filter(Boolean);
              if (savedId && this.classes.some(c => c.id === savedId)) {
                this.currentClassId = savedId;
              } else if (this.classes[0]) {
                this.currentClassId = this.classes[0].id;
              }
            } else {
              this.classes = [];
            }
          } catch (e) {
            console.error('Error loading saved class data:', e);
            this.classes = [];
          }
        }
      }

      getAllClassStudents(c) {
        if (!c) return [];
        let set = new Set();
        if (c.classList && Array.isArray(c.classList)) {
          c.classList.forEach(s => { if (typeof s === 'string' && s.trim()) set.add(s.trim()); });
        }
        if (c.rows && Array.isArray(c.rows)) {
          c.rows.forEach(r => {
            if (Array.isArray(r)) r.forEach(s => { if (typeof s === 'string' && s.trim()) set.add(s.trim()); });
          });
        }
        if (c.circle && Array.isArray(c.circle)) {
          c.circle.forEach(s => { if (typeof s === 'string' && s.trim()) set.add(s.trim()); });
        }
        if (c.layoutsData && typeof c.layoutsData === 'object') {
          Object.values(c.layoutsData).forEach(gArr => {
            if (Array.isArray(gArr)) {
              gArr.forEach(g => {
                if (Array.isArray(g)) g.forEach(s => { if (typeof s === 'string' && s.trim()) set.add(s.trim()); });
              });
            }
          });
        }
        if (c.band && Array.isArray(c.band.rows)) {
          [...c.band.rows.flat(), ...(Array.isArray(c.band.perc) ? c.band.perc : [])].forEach(ch => {
            if (ch && typeof ch.student === 'string' && ch.student.trim()) set.add(ch.student.trim());
          });
        }
        return Array.from(set);
      }

      getCurrentClass() {
        return this.classes.find(c => c.id === this.currentClassId);
      }

      setArrangeSeatingMode(mode) {
        if (this.selectedArrangeMode === mode) {
          this.selectedArrangeMode = null;
        } else {
          this.selectedArrangeMode = mode;
        }
        this.updateArrangeSeatingUI();
      }

      updateArrangeSeatingUI() {
        const modes = ['first', 'last', 'random'];
        modes.forEach(m => {
          const btnId = 'btnArrange' + m.charAt(0).toUpperCase() + m.slice(1) + (m === 'first' ? 'Name' : m === 'last' ? 'Name' : '');
          const btn = document.getElementById(btnId);
          if (!btn) return;

          if (this.selectedArrangeMode === m) {
            btn.style.cssText = 'flex: 1; font-weight: bold; padding: 6px 4px; font-size: 0.8rem; background: var(--primary); color: white; border: 1.5px solid var(--primary-hover); border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.15); cursor: pointer;';
          } else {
            btn.style.cssText = 'flex: 1; font-weight: bold; padding: 6px 4px; font-size: 0.8rem; background: var(--line); color: var(--ink-soft); border: 1.5px solid var(--line-strong); border-radius: 6px; cursor: pointer;';
          }
        });
      }

      openSettingsModal() {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        this.selectedArrangeMode = null;
        this.updateArrangeSeatingUI();

        const appNameEl = document.getElementById('settingsAppName');
        if (appNameEl) appNameEl.value = this.appName || 'ClassPlanner';

        this.settingShowFirstName = (currentClass.showFirstName !== false);
        this.settingShowLastName = (currentClass.showLastName === true);
        this.settingShowFaces = (currentClass.showFaces !== false && currentClass.showInitials !== false);
        this.settingShowGradesRatio = (currentClass.showGradesAttendanceRatio !== false);

        this.updateDisplayToggleUI('btnToggleDisplayFirstName', this.settingShowFirstName);
        this.updateDisplayToggleUI('btnToggleDisplayLastName', this.settingShowLastName);
        this.updateDisplayToggleUI('btnToggleDisplayInitials', this.settingShowFaces);
        this.settingChartPattern = this.chartPattern;
        this.updateChartPatternToggle();
        this.updateGardenEditToggle();

        document.getElementById('settingsModal').classList.add('active');
      }

      getGradingStyle(currentClass) {
        const c = currentClass || this.getCurrentClass();
        return (c && c.gradingStyle) || this.gradingStyle || 'informal';
      }

      updateDisplayToggleUI(btnId, isActive) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        if (isActive) {
          btn.style.cssText = 'font-weight: 700; padding: 5px 9px; font-size: 0.78rem; background: var(--sky); color: white; border: 1.5px solid var(--sky); cursor: pointer; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.15s ease;';
        } else {
          btn.style.cssText = 'font-weight: 700; padding: 5px 9px; font-size: 0.78rem; background: var(--line); color: var(--ink-muted); border: 1.5px solid var(--line-strong); cursor: pointer; border-radius: 6px; box-shadow: none; transition: all 0.15s ease;';
        }
      }

      updateSettingsToggleUI(btnId, isActive) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        if (isActive) {
          btn.textContent = 'ON';
          btn.style.cssText = 'font-weight: 700; padding: 6px 16px; background: var(--sky); color: white; border: 1.5px solid var(--sky); min-width: 70px; cursor: pointer; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);';
        } else {
          btn.textContent = 'OFF';
          btn.style.cssText = 'font-weight: 700; padding: 6px 16px; background: var(--line); color: var(--ink-muted); border: 1.5px solid var(--line-strong); min-width: 70px; cursor: pointer; border-radius: 6px;';
        }
      }

      toggleDisplaySetting(type) {
        if (type === 'firstName') {
          this.settingShowFirstName = !this.settingShowFirstName;
          this.updateDisplayToggleUI('btnToggleDisplayFirstName', this.settingShowFirstName);
        } else if (type === 'lastName') {
          this.settingShowLastName = !this.settingShowLastName;
          this.updateDisplayToggleUI('btnToggleDisplayLastName', this.settingShowLastName);
        } else if (type === 'initials') {
          this.settingShowFaces = !this.settingShowFaces;
          this.updateDisplayToggleUI('btnToggleDisplayInitials', this.settingShowFaces);
        }
      }

      toggleShowFacesSetting() {
        this.toggleDisplaySetting('initials');
      }

      toggleShowGradesRatioSetting() {
        this.settingShowGradesRatio = !this.settingShowGradesRatio;
        this.updateSettingsToggleUI('btnToggleShowGradesRatio', this.settingShowGradesRatio);
      }

      toggleRemoveWarningSetting() {
        this.suppressRemoveStudentWarning = !this.suppressRemoveStudentWarning;
        const isWarningActive = !this.suppressRemoveStudentWarning;
        this.updateSettingsToggleUI('btnToggleRemoveWarning', isWarningActive);
      }

      shuffleArray(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      }

      saveSettings() {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        const appNameEl = document.getElementById('settingsAppName');
        if (appNameEl) {
          const newName = appNameEl.value.trim();
          this.appName = newName || 'ClassPlanner';
          localStorage.setItem('seatingApp_appName', this.appName);
          this.updateAppTitle();
        }

        if (typeof this.settingChartPattern === 'boolean') this.setChartPattern(this.settingChartPattern);
        currentClass.showFirstName = this.settingShowFirstName;
        currentClass.showLastName = this.settingShowLastName;
        currentClass.showFaces = this.settingShowFaces;
        currentClass.showInitials = this.settingShowFaces;
        currentClass.showGradesAttendanceRatio = this.settingShowGradesRatio;
        localStorage.setItem('seatingApp_suppressRemoveStudentWarning', this.suppressRemoveStudentWarning.toString());

        const rowCountEl = document.getElementById('settingsRowCount');
        if (rowCountEl) {
          const count = parseInt(rowCountEl.value, 10);
          if (count >= 1 && count <= 6 && count !== currentClass.rowsCount) {
            this.setRowsCount(count);
          }
        }

        const lineCountEl = document.getElementById('settingsLineCount');
        if (lineCountEl) {
          const lineCount = parseInt(lineCountEl.value, 10);
          if (lineCount >= 1 && lineCount <= 6 && lineCount !== currentClass.linesCount) {
            this.setLinesCount(lineCount);
          }
        }

        const divideRowsEl = document.getElementById('settingsDivideRows');
        if (divideRowsEl) {
          currentClass.divideRows = divideRowsEl.value === 'true';
        }

        const showFacesEl = document.getElementById('settingsShowFaces');
        if (showFacesEl) {
          currentClass.showFaces = showFacesEl.value === 'true';
        }

        const showGradesRatioEl = document.getElementById('settingsShowGradesAttendanceRatio');
        if (showGradesRatioEl) {
          currentClass.showGradesAttendanceRatio = showGradesRatioEl.value === 'true';
        }

        const suppressWarningEl = document.getElementById('settingsSuppressRemoveWarning');
        if (suppressWarningEl) {
          this.suppressRemoveStudentWarning = (suppressWarningEl.value === 'true');
          localStorage.setItem('seatingApp_suppressRemoveStudentWarning', this.suppressRemoveStudentWarning.toString());
        }

        if (this.selectedArrangeMode) {
          const mode = this.selectedArrangeMode;
          if (currentClass.arrangeSeatingMode) {
            delete currentClass.arrangeSeatingMode;
          }
          const allList = this.getAllClassStudents(currentClass);
          const seated = this.getAllStudents();
          const allStudents = (seated && seated.length > 0) ? seated : allList;
          const sortedStudents = this.sortStudentsByName(allStudents, mode);
          const layout = currentClass.layout || 'rows';

          if (mode === 'random' && this.arrangeRandomWithRules(currentClass, allStudents)) {
            // The class's special seating rules chose where everyone sits
          } else if (layout === 'circle') {
            currentClass.circle = [...sortedStudents];
          } else if (layout === 'lines') {
            const numLines = currentClass.linesCount || 4;
            currentClass.lines = this.autoBalanceGroups(allStudents, numLines, mode);
          } else if (layout === 'freeform') {
            currentClass.freeform = [...sortedStudents];
            currentClass.freeformPositions = {};
            this.initInitialFreeformPositions(currentClass);
          } else if (layout === 'band') {
            if (currentClass.band) this.arrangeBandByName(currentClass.band, mode);
          } else if (['half', 'third', 'fourth', 'fifth', 'sixth'].includes(layout)) {
            const numGroups = layout === 'half' ? 2 : layout === 'third' ? 3 : layout === 'fourth' ? 4 : layout === 'fifth' ? 5 : 6;
            currentClass.layoutsData[layout] = this.autoBalanceGroups(allStudents, numGroups, mode);
          } else {
            // Rows layout
            if (currentClass.divideRows) {
              const numSections = currentClass.rowsCount * 2;
              const balanced = this.distributeStudentsEquallyInOrder(allStudents, numSections, mode);
              currentClass.dividedRowsData = [];
              for (let r = 0; r < currentClass.rowsCount; r++) {
                currentClass.dividedRowsData.push([balanced[r * 2] || [], balanced[r * 2 + 1] || []]);
              }
            } else {
              const numRows = currentClass.rowsCount || 4;
              currentClass.rows = this.distributeStudentsEquallyInOrder(allStudents, numRows, mode);
            }
          }
        }
        this.selectedArrangeMode = null;

        this.saveData();
        this.render();
        this.closeModal('settingsModal');
      }

      downloadClassPlanner() {
        const todayStr = new Date().toISOString().slice(0, 10);
        const defaultFilename = `ClassPlanner_Backup_${todayStr}.json`;
        const userFilename = prompt('Enter a file name for your ClassPlanner backup:', defaultFilename);
        if (userFilename === null) return;

        let filename = userFilename.trim();
        if (!filename) filename = defaultFilename;
        if (!filename.toLowerCase().endsWith('.json')) {
          filename += '.json';
        }

        const defaultSubjId = this.subjects[0] ? this.subjects[0].id : 'subj_music';
        const sanitizedClasses = (this.classes || []).map(c => this.sanitizeAndMigrateClass(c, defaultSubjId)).filter(Boolean);

        const exportPayload = {
          app: 'ClassPlanner',
          version: '2.0',
          appName: this.appName || 'ClassPlanner',
          exportedAt: new Date().toISOString(),
          gradingStyle: this.gradingStyle || 'informal',
          chartPattern: this.chartPattern !== false,
          suppressRemoveStudentWarning: this.suppressRemoveStudentWarning === true,
          currentClassId: this.currentClassId || (sanitizedClasses[0] ? sanitizedClasses[0].id : null),
          subjects: this.subjects || [],
          schedules: this.schedules || [],
          currentScheduleId: this.currentScheduleId || 'sched_regular',
          calendarSync: this.isCalendarSyncEnabled === true,
          gardenGrowth: this.gardenGrowth,
          classes: sanitizedClasses
        };

        const jsonStr = JSON.stringify(exportPayload, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      triggerUploadPlanner() {
        const fileInput = document.getElementById('plannerFileInput');
        if (fileInput) {
          fileInput.value = '';
          fileInput.click();
        }
      }

      handleUploadPlanner(e) {
        const file = (e && e.target && e.target.files) ? e.target.files[0] : null;
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedData = JSON.parse(event.target.result);

            if (!importedData || (!Array.isArray(importedData.classes) && !Array.isArray(importedData))) {
              alert('Invalid ClassPlanner file. Please select a valid .json backup file.');
              return;
            }

            const confirmReplace = confirm('Are you sure you want to replace all current class data with the imported ClassPlanner file?');
            if (!confirmReplace) return;

            if (importedData.appName) {
              this.appName = importedData.appName;
              this.updateAppTitle();
            }

            if (typeof importedData.chartPattern === 'boolean') {
              this.setChartPattern(importedData.chartPattern);
            }

            if (importedData.gradingStyle) {
              this.gradingStyle = importedData.gradingStyle;
              localStorage.setItem('seatingApp_gradingStyle', this.gradingStyle);
            }

            if (typeof importedData.suppressRemoveStudentWarning === 'boolean') {
              this.suppressRemoveStudentWarning = importedData.suppressRemoveStudentWarning;
              localStorage.setItem('seatingApp_suppressRemoveStudentWarning', this.suppressRemoveStudentWarning.toString());
            }

            if (typeof importedData.calendarSync === 'boolean') {
              this.isCalendarSyncEnabled = importedData.calendarSync;
            }

            if (importedData.gardenGrowth && typeof importedData.gardenGrowth === 'object') {
              this.gardenGrowth = this.normalizeGardenGrowth(importedData.gardenGrowth);
            }

            if (Array.isArray(importedData.subjects) && importedData.subjects.length > 0) {
              this.subjects = importedData.subjects;
            } else if (!Array.isArray(this.subjects) || this.subjects.length === 0) {
              this.subjects = [
                {
                  id: 'subj_music',
                  name: 'Music',
                  categories: ['Singing', 'Instruments', 'Movement', 'Culture', 'Theory', 'Effort']
                }
              ];
            }

            if (Array.isArray(importedData.schedules) && importedData.schedules.length > 0) {
              this.schedules = importedData.schedules.map(s => {
                if (!s || typeof s !== 'object') return null;
                return {
                  id: s.id || ('sched_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
                  name: s.name || 'Regular Schedule',
                  timeBlocks: Array.isArray(s.timeBlocks) ? s.timeBlocks : []
                };
              }).filter(Boolean);
            } else {
              this.schedules = [
                {
                  id: 'sched_regular',
                  name: 'Regular Schedule',
                  timeBlocks: Array.isArray(importedData.scheduleTimeBlocks) ? importedData.scheduleTimeBlocks : []
                }
              ];
            }

            if (importedData.currentScheduleId && this.schedules.some(s => s.id === importedData.currentScheduleId)) {
              this.currentScheduleId = importedData.currentScheduleId;
            } else {
              this.currentScheduleId = this.schedules[0].id;
            }

            const activeSched = this.getCurrentSchedule();
            this.scheduleTimeBlocks = activeSched.timeBlocks || [];

            const defaultSubjId = this.subjects[0] ? this.subjects[0].id : 'subj_music';
            let rawClasses = Array.isArray(importedData.classes) ? importedData.classes : (Array.isArray(importedData) ? importedData : []);

            this.classes = rawClasses.map(c => this.sanitizeAndMigrateClass(c, defaultSubjId)).filter(Boolean);

            if (importedData.currentClassId && this.classes.some(c => c.id === importedData.currentClassId)) {
              this.currentClassId = importedData.currentClassId;
            } else if (this.classes[0]) {
              this.currentClassId = this.classes[0].id;
            } else {
              this.currentClassId = null;
            }

            this.saveData();
            this.closeModal('settingsModal');
            this.renderClassDropdown();
            this.renderScheduleDropdown();
            this.updateCalendarSyncUI();
            this.render();
            if (this.currentViewMode === 'schedule') this.renderScheduleTable();
            if (this.currentViewMode === 'attendance') this.renderAttendanceTable();
            if (this.currentViewMode === 'grades') this.renderGradesTable();

            alert('ClassPlanner data successfully restored!');
          } catch (err) {
            console.error('Error parsing JSON backup file:', err);
            alert('Failed to read the file. Please ensure it is a valid ClassPlanner .json backup.');
          }
        };

        reader.readAsText(file);
      }

      deleteClassPlanner() {
        const warningMsg = '⚠️ PERMANENT DELETION WARNING!\n\nAre you sure you want to delete all ClassPlanner data?\n\nThis will permanently delete all your classes, student rosters, seating charts, attendance records, and gradebook data. This action is IRREVERSIBLE.\n\n(Note: Downloaded ClassPlanner backup files can be uploaded at a later point to restore your data.)\n\nClick OK to confirm permanent deletion.';

        if (!confirm(warningMsg)) return;

        try {
          localStorage.clear();
        } catch (e) {
          console.error('Error clearing localStorage:', e);
        }

        this.classes = [];
        this.currentClassId = null;
        this.isEditMode = false;
        this.isGradeScoringActive = false;
        this.isDraftScoringActive = false;
        this.draftGradeColumn = null;
        this.suppressRemoveStudentWarning = false;
        this.appName = 'ClassPlanner';
        this.updateAppTitle();

        this.createSampleData();

        this.closeModal('settingsModal');
        this.render();
        if (this.currentViewMode === 'attendance') this.renderAttendanceTable();
        if (this.currentViewMode === 'grades') this.renderGradesTable();

        alert('All ClassPlanner data has been permanently deleted.');
      }

      getAllStudents() {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return [];

        const layout = currentClass.layout;
        if (layout === 'circle') return currentClass.circle || [];
        if (layout === 'freeform') return currentClass.freeform || [];
        if (layout === 'band') return this.getBandChairs(currentClass.band).map(ch => ch.student).filter(Boolean);
        if (layout === 'lines') {
          let all = [];
          if (currentClass.lines) currentClass.lines.forEach(l => { if (Array.isArray(l)) all.push(...l); });
          return all;
        }
        if (['half', 'third', 'fourth', 'fifth', 'sixth'].includes(layout)) {
          const gArr = currentClass.layoutsData ? currentClass.layoutsData[layout] : [];
          return (gArr || []).flat();
        }

        if (currentClass.divideRows && Array.isArray(currentClass.dividedRowsData)) {
          let all = [];
          currentClass.dividedRowsData.forEach(rSecs => {
            if (Array.isArray(rSecs)) {
              rSecs.forEach(sec => {
                if (Array.isArray(sec)) all.push(...sec);
              });
            }
          });
          return all;
        }

        let all = [];
        if (currentClass.rows) currentClass.rows.forEach(r => all.push(...r));
        return all;
      }

      toggleEditMode(targetState) {
        if (typeof targetState === 'boolean') {
          this.isEditMode = targetState;
        } else {
          this.isEditMode = !this.isEditMode;
        }

        const headerBtn = document.getElementById('headerEditBtn');
        const rosterBtn = document.getElementById('rosterEditBtn');
        const fsBtn = document.getElementById('fullscreenEditBtn');

        const editBtns = [headerBtn, rosterBtn, fsBtn].filter(Boolean);

        if (this.isEditMode) {
          document.body.classList.add('edit-mode');
          editBtns.forEach(btn => {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
          });
        } else {
          document.body.classList.remove('edit-mode');
          editBtns.forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
          });
        }
        this.render();
        if (this.currentViewMode === 'attendance') {
          this.renderAttendanceTable();
        } else if (this.currentViewMode === 'grades') {
          this.renderGradesTable();
        }
      }

      toggleStudentAbsent(studentName) {
        if (!studentName) return;
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        this.checkAndResetDailyAbsences();

        if (!Array.isArray(currentClass.absentStudents)) {
          currentClass.absentStudents = [];
        }
        currentClass.absentDate = this.getTodayDateString();

        const profile = this.getStudentProfile(currentClass, studentName);
        const nameCandidates = new Set([
          studentName,
          profile.rosterName,
          profile.firstName,
          (profile.lastName ? `${profile.firstName} ${profile.lastName}` : null)
        ].filter(Boolean));

        const existingIdx = currentClass.absentStudents.findIndex(s => nameCandidates.has(s));
        if (existingIdx > -1) {
          currentClass.absentStudents = currentClass.absentStudents.filter(s => !nameCandidates.has(s));
        } else {
          currentClass.absentStudents.push(studentName);
        }

        this.saveData();
        this.render();
      }

      isStudentAbsent(currentClass, studentName) {
        if (!currentClass || !Array.isArray(currentClass.absentStudents) || !studentName) return false;
        if (currentClass.absentStudents.includes(studentName)) return true;
        const profile = this.getStudentProfile(currentClass, studentName);
        if (profile.rosterName && currentClass.absentStudents.includes(profile.rosterName)) return true;
        if (profile.firstName && currentClass.absentStudents.includes(profile.firstName)) return true;
        if (profile.firstName && profile.lastName) {
          const full = `${profile.firstName} ${profile.lastName}`;
          if (currentClass.absentStudents.includes(full)) return true;
        }
        return false;
      }

      selectAttendanceToday() {
        this.activeTakeAttendanceMode = 'today';
        this.selectedAttendanceDate = new Date();

        const btnToday = document.getElementById('btnAttendanceToday');
        const btnChoose = document.getElementById('btnAttendanceChoose');

        if (btnToday) {
          btnToday.classList.add('btn-green');
          btnToday.classList.remove('btn-secondary');
        }
        if (btnChoose) {
          btnChoose.classList.remove('btn-green');
          btnChoose.classList.add('btn-secondary');
        }
      }

      openAttendanceDateModal() {
        const modal = document.getElementById('attendanceDateModal');
        if (!modal) return;

        const dateToUse = this.selectedAttendanceDate || new Date();
        this.calendarViewMonth = dateToUse.getMonth();
        this.calendarViewYear = dateToUse.getFullYear();

        const dateInput = document.getElementById('attendanceDateInput');
        if (dateInput) {
          const yyyy = dateToUse.getFullYear();
          const mm = String(dateToUse.getMonth() + 1).padStart(2, '0');
          const dd = String(dateToUse.getDate()).padStart(2, '0');
          dateInput.value = `${yyyy}-${mm}-${dd}`;
        }

        this.renderCalendarGrid();
        modal.classList.add('active');
      }

      changeCalendarMonth(delta) {
        this.calendarViewMonth += delta;
        if (this.calendarViewMonth > 11) {
          this.calendarViewMonth = 0;
          this.calendarViewYear += 1;
        } else if (this.calendarViewMonth < 0) {
          this.calendarViewMonth = 11;
          this.calendarViewYear -= 1;
        }
        this.renderCalendarGrid();
      }

      renderCalendarGrid() {
        const grid = document.getElementById('calendarDaysGrid');
        const monthYearSpan = document.getElementById('calendarMonthYear');
        if (!grid) return;

        grid.innerHTML = '';

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (monthYearSpan) {
          monthYearSpan.textContent = `${monthNames[this.calendarViewMonth]} ${this.calendarViewYear}`;
        }

        const firstDayIndex = new Date(this.calendarViewYear, this.calendarViewMonth, 1).getDay();
        const totalDays = new Date(this.calendarViewYear, this.calendarViewMonth + 1, 0).getDate();

        const today = new Date();
        const isCurrentMonthYearToday = (today.getFullYear() === this.calendarViewYear && today.getMonth() === this.calendarViewMonth);

        const selDate = this.selectedAttendanceDate || new Date();
        const isSelMonthYear = (selDate.getFullYear() === this.calendarViewYear && selDate.getMonth() === this.calendarViewMonth);

        // Empty cells before 1st of month
        for (let i = 0; i < firstDayIndex; i++) {
          const emptyDiv = document.createElement('div');
          emptyDiv.className = 'calendar-day-btn empty-cell';
          grid.appendChild(emptyDiv);
        }

        // Day cells
        for (let day = 1; day <= totalDays; day++) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'calendar-day-btn';
          btn.textContent = day;

          if (isCurrentMonthYearToday && day === today.getDate()) {
            btn.classList.add('today-cell');
          }

          if (isSelMonthYear && day === selDate.getDate()) {
            btn.classList.add('selected');
          }

          btn.onclick = () => {
            this.selectedAttendanceDate = new Date(this.calendarViewYear, this.calendarViewMonth, day);
            const dateInput = document.getElementById('attendanceDateInput');
            if (dateInput) {
              const yyyy = this.calendarViewYear;
              const mm = String(this.calendarViewMonth + 1).padStart(2, '0');
              const dd = String(day).padStart(2, '0');
              dateInput.value = `${yyyy}-${mm}-${dd}`;
            }
            this.renderCalendarGrid();
          };

          grid.appendChild(btn);
        }
      }

      onDateInputChange(valStr) {
        if (!valStr) return;
        const parts = valStr.split('-');
        if (parts.length === 3) {
          const yyyy = parseInt(parts[0], 10);
          const mm = parseInt(parts[1], 10) - 1;
          const dd = parseInt(parts[2], 10);
          this.selectedAttendanceDate = new Date(yyyy, mm, dd);
          this.calendarViewYear = yyyy;
          this.calendarViewMonth = mm;
          this.renderCalendarGrid();
        }
      }

      onAttendanceButtonClick() {
        if (!this.isAttendanceSessionActive) {
          this.openAttendanceDateModal();
        } else {
          this.completeAttendanceSession();
        }
      }

      startAttendanceSession() {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        this.isAttendanceSessionActive = true;
        this.activeAttendanceDate = this.selectedAttendanceDate || new Date();
        this.activeAttendanceStatuses = {};

        const absentSet = new Set(Array.isArray(currentClass.absentStudents) ? currentClass.absentStudents : []);
        (currentClass.classList || []).forEach(student => {
          this.activeAttendanceStatuses[student] = absentSet.has(student) ? 'absent' : 'present';
        });

        this.closeModal('attendanceDateModal');
        this.updateAttendanceButtonUI();
        this.render();
      }

      completeAttendanceSession() {
        const currentClass = this.getCurrentClass();
        if (currentClass && this.isAttendanceSessionActive) {
          this.checkAndResetDailyAbsences();
          currentClass.absentDate = this.getTodayDateString();

          // Sync currentClass.absentStudents
          const newAbsent = [];
          Object.keys(this.activeAttendanceStatuses).forEach(student => {
            if (this.activeAttendanceStatuses[student] === 'absent') {
              newAbsent.push(student);
            }
          });
          currentClass.absentStudents = newAbsent;

          this.recordAttendanceForDate(currentClass, this.activeAttendanceDate || new Date(), this.activeAttendanceStatuses);
        }

        this.isAttendanceSessionActive = false;
        this.activeAttendanceDate = null;
        this.activeAttendanceStatuses = {};

        this.updateAttendanceButtonUI();

        const refreshBtn = document.getElementById('btnAttendanceRefresh');
        if (refreshBtn) {
          refreshBtn.innerHTML = '✓';
          refreshBtn.style.color = 'var(--green-dark)';
          refreshBtn.style.borderColor = 'var(--green-line)';
          refreshBtn.style.setProperty('--btn-edge', 'var(--green-line)');
          refreshBtn.style.background = 'var(--green-soft)';
          refreshBtn.style.fontWeight = '900';
          refreshBtn.style.transform = 'scale(1.2)';
          refreshBtn.style.transition = 'all 0.2s ease';
          
          setTimeout(() => {
            refreshBtn.style.transform = 'scale(1)';
          }, 200);

          setTimeout(() => {
            refreshBtn.innerHTML = '🔄';
            refreshBtn.style.color = '';
            refreshBtn.style.borderColor = '';
            refreshBtn.style.removeProperty('--btn-edge');
            refreshBtn.style.background = '';
            refreshBtn.style.fontWeight = '';
            refreshBtn.style.transform = '';
          }, 1200);
        }

        const statusIcon = document.getElementById('attendanceStatusIcon');
        if (statusIcon) {
          statusIcon.classList.remove('unconfirmed');
          statusIcon.classList.add('confirmed');
          const dash = statusIcon.querySelector('.icon-dash');
          const check = statusIcon.querySelector('.icon-check');
          if (dash) dash.style.display = 'none';
          if (check) check.style.display = 'inline';

          statusIcon.style.transform = 'scale(1.3)';
          statusIcon.style.transition = 'transform 0.2s ease-out';
          setTimeout(() => {
            statusIcon.style.transform = 'scale(1)';
          }, 250);

          setTimeout(() => {
            statusIcon.classList.remove('confirmed');
            statusIcon.classList.add('unconfirmed');
            if (dash) dash.style.display = 'inline';
            if (check) check.style.display = 'none';
          }, 3000);
        }

        this.saveData();
        this.render();
        if (this.isAttendanceView) {
          this.renderAttendanceTable();
        }
      }

      updateAttendanceButtonUI() {
        const btn = document.getElementById('btnTakeAttendanceStart');
        if (!btn) return;

        if (this.isAttendanceSessionActive) {
          btn.textContent = 'Complete';
          btn.style.background = 'var(--orange)';
          btn.style.borderColor = 'var(--orange-dark)';
          btn.style.setProperty('--btn-edge', 'var(--orange-dark)');
          btn.style.color = '#ffffff';
        } else {
          btn.textContent = 'Attendance';
          btn.style.background = 'var(--blue)';
          btn.style.borderColor = 'var(--blue-dark)';
          btn.style.setProperty('--btn-edge', 'var(--blue-dark)');
          btn.style.color = '#ffffff';
        }
      }

      reinstateAllPresent() {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        currentClass.absentStudents = [];
        if (this.isAttendanceSessionActive) {
          (currentClass.classList || []).forEach(student => {
            this.activeAttendanceStatuses[student] = 'present';
          });
        }

        this.saveData();
        this.render();
        if (this.isAttendanceView) {
          this.renderAttendanceTable();
        }
      }

      toggleLiveAttendanceStudent(studentName) {
        if (!studentName) return;
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        this.checkAndResetDailyAbsences();
        currentClass.absentDate = this.getTodayDateString();

        if (!this.activeAttendanceStatuses) {
          this.activeAttendanceStatuses = {};
        }

        const isCurrentlyAbsent = this.isStudentAbsent(currentClass, studentName);
        const currentStatus = this.activeAttendanceStatuses[studentName] || (isCurrentlyAbsent ? 'absent' : 'present');
        const nextStatus = (currentStatus === 'present') ? 'absent' : 'present';

        this.activeAttendanceStatuses[studentName] = nextStatus;

        const profile = this.getStudentProfile(currentClass, studentName);
        const nameCandidates = new Set([
          studentName,
          profile.rosterName,
          profile.firstName,
          (profile.lastName ? `${profile.firstName} ${profile.lastName}` : null)
        ].filter(Boolean));

        if (nextStatus === 'absent') {
          if (!currentClass.absentStudents.some(s => nameCandidates.has(s))) {
            if (!Array.isArray(currentClass.absentStudents)) currentClass.absentStudents = [];
            currentClass.absentStudents.push(studentName);
          }
        } else {
          currentClass.absentStudents = (currentClass.absentStudents || []).filter(s => !nameCandidates.has(s));
        }

        this.saveData();
        this.render();
      }

      recordAttendanceForDate(currentClass, dateObj, customStatuses = null) {
        if (!currentClass) return;

        if (!Array.isArray(currentClass.attendanceDates)) {
          currentClass.attendanceDates = this.getDefaultAttendanceDates();
        }

        const yyyy = dateObj.getFullYear();
        const mm = dateObj.getMonth();
        const dd = dateObj.getDate();
        const timestamp = new Date(yyyy, mm, dd).getTime();

        const dateStr = `${mm + 1}/${dd}/${String(yyyy).slice(-2)}`;
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayStr = daysOfWeek[dateObj.getDay()];

        const absentSet = new Set(Array.isArray(currentClass.absentStudents) ? currentClass.absentStudents : []);
        const unplacedSet = new Set(Array.isArray(currentClass.unplacedStudents) ? currentClass.unplacedStudents : []);

        const statuses = {};
        (currentClass.classList || []).forEach(student => {
          if (customStatuses && customStatuses[student] !== undefined) {
            statuses[student] = customStatuses[student];
          } else if (absentSet.has(student)) {
            statuses[student] = 'absent';
          } else if (unplacedSet.has(student)) {
            statuses[student] = 'unplaced';
          } else {
            statuses[student] = 'present';
          }
        });

        const dateId = 'date_' + timestamp;
        const existingIdx = currentClass.attendanceDates.findIndex(d => d.timestamp === timestamp || d.date === dateStr);
        if (existingIdx > -1) {
          currentClass.attendanceDates[existingIdx].statuses = statuses;
        } else {
          currentClass.attendanceDates.push({
            id: dateId,
            date: dateStr,
            day: dayStr,
            timestamp: timestamp,
            statuses: statuses
          });
        }

        // Sort chronologically by timestamp
        currentClass.attendanceDates.sort((a, b) => a.timestamp - b.timestamp);

        this.saveData();
        if (this.isAttendanceView) {
          this.renderAttendanceTable();
        }
      }

      getDefaultAttendanceDates() {
        return [];
      }

      getClassSubjectId(c) {
        const currentClass = c || this.getCurrentClass();
        if (!currentClass) return 'subj_music';
        return currentClass.subjectId || (this.subjects[0] ? this.subjects[0].id : 'subj_music');
      }

      getClassGradeColumns(c, subjectId = null) {
        const currentClass = c || this.getCurrentClass();
        if (!currentClass) return [];
        if (!currentClass.subjectGrades || typeof currentClass.subjectGrades !== 'object') {
          currentClass.subjectGrades = {};
        }
        const subjId = subjectId || this.getClassSubjectId(currentClass);
        if (!Array.isArray(currentClass.subjectGrades[subjId])) {
          if ((subjId === 'subj_music' || subjId === (this.subjects[0] && this.subjects[0].id)) && Array.isArray(currentClass.gradeColumns)) {
            currentClass.subjectGrades[subjId] = [...currentClass.gradeColumns];
          } else {
            currentClass.subjectGrades[subjId] = [];
          }
        }
        return currentClass.subjectGrades[subjId];
      }

      setClassGradeColumns(columns, c, subjectId = null) {
        const currentClass = c || this.getCurrentClass();
        if (!currentClass) return;
        if (!currentClass.subjectGrades || typeof currentClass.subjectGrades !== 'object') {
          currentClass.subjectGrades = {};
        }
        const subjId = subjectId || this.getClassSubjectId(currentClass);
        currentClass.subjectGrades[subjId] = columns;
        if (subjId === 'subj_music' || subjId === (this.subjects[0] && this.subjects[0].id)) {
          currentClass.gradeColumns = columns;
        }
      }

      getDefaultGradeColumns() {
        return [];
      }

      switchViewMode(mode) {
        this.currentViewMode = mode || 'chart';
        if (this.currentViewMode !== 'chart') this.gardenEditClassId = null;
        this.isAttendanceView = (this.currentViewMode === 'attendance');
        this.updateViewMode();
      }

      toggleAttendanceView() {
        this.switchViewMode(this.currentViewMode === 'attendance' ? 'chart' : 'attendance');
      }

      toggleGradesView() {
        this.switchViewMode(this.currentViewMode === 'grades' ? 'chart' : 'grades');
      }

      updateViewMode() {
        const seatingBody = document.getElementById('seatingAppBody');
        const attendanceBody = document.getElementById('attendanceAppBody');
        const gradesBody = document.getElementById('gradesAppBody');
        const aboutBody = document.getElementById('aboutAppBody');
        const scheduleBody = document.getElementById('scheduleAppBody');

        const navSchedule = document.getElementById('navBtnSchedule');
        const navSeating = document.getElementById('navBtnSeating');
        const navAttendance = document.getElementById('navBtnAttendance');
        const navGrades = document.getElementById('navBtnGrades');

        const headerZoomBtn = document.getElementById('headerZoomBtn');
        const fullscreenZoomBtn = document.getElementById('fullscreenZoomBtn');
        const layoutBtn = document.getElementById('headerLayoutBtn');
        const editBtn = document.getElementById('headerEditBtn');
        const fsEditBtn = document.getElementById('fullscreenEditBtn');
        const resizeBtn = document.getElementById('btnResize');
        const chartCamBtn = document.getElementById('chartCameraBtn');
        const attendanceCamBtn = document.getElementById('attendanceCameraBtn');
        const gradesCamBtn = document.getElementById('gradesCameraBtn');
        const scheduleCamBtn = document.getElementById('scheduleCameraBtn');
        const headerManageScheduleBtn = document.getElementById('headerManageScheduleBtn');
        const fsManageScheduleBtn = document.getElementById('fullscreenManageScheduleBtn');
        const headerEditScheduleBtn = document.getElementById('headerEditScheduleBtn');
        const fsEditScheduleBtn = document.getElementById('fullscreenEditScheduleBtn');
        const layoutBar = document.getElementById('layoutBar');

        if (this.currentViewMode === 'attendance' || this.currentViewMode === 'grades' || this.currentViewMode === 'about' || this.currentViewMode === 'schedule') {
          if (layoutBar) layoutBar.classList.remove('open');
          this.closeZoomMenu();
        }

        [navSchedule, navSeating, navAttendance, navGrades].forEach(btn => {
          if (btn) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
          }
        });

        const fullscreenLayoutBtn = document.getElementById('fullscreenLayoutBtn');

        if (this.currentViewMode === 'schedule') {
          if (seatingBody) seatingBody.style.display = 'none';
          if (attendanceBody) attendanceBody.style.display = 'none';
          if (gradesBody) gradesBody.style.display = 'none';
          if (aboutBody) aboutBody.style.display = 'none';
          if (scheduleBody) scheduleBody.style.display = 'flex';

          if (navSchedule) {
            navSchedule.classList.remove('btn-secondary');
            navSchedule.classList.add('btn-primary');
          }

          if (headerZoomBtn) headerZoomBtn.style.display = 'none';
          if (fullscreenZoomBtn) fullscreenZoomBtn.style.display = 'none';
          if (layoutBtn) layoutBtn.style.display = 'none';
          if (editBtn) editBtn.style.display = 'none';
          if (fsEditBtn) fsEditBtn.style.display = 'none';
          if (resizeBtn) resizeBtn.style.display = '';
          if (chartCamBtn) chartCamBtn.style.display = 'none';
          if (attendanceCamBtn) attendanceCamBtn.style.display = 'none';
          if (gradesCamBtn) gradesCamBtn.style.display = 'none';
          if (scheduleCamBtn) scheduleCamBtn.style.display = 'inline-flex';
          if (headerManageScheduleBtn) headerManageScheduleBtn.style.display = 'inline-block';
          if (fsManageScheduleBtn) fsManageScheduleBtn.style.display = 'inline-block';
          if (headerEditScheduleBtn) headerEditScheduleBtn.style.display = 'inline-block';
          if (fsEditScheduleBtn) fsEditScheduleBtn.style.display = 'inline-block';

          if (fullscreenLayoutBtn) fullscreenLayoutBtn.style.display = 'none';

          this.updateScheduleEditButtonUI();
          this.renderScheduleTable();
        } else if (this.currentViewMode === 'attendance') {
          if (scheduleBody) scheduleBody.style.display = 'none';
          if (seatingBody) seatingBody.style.display = 'none';
          if (gradesBody) gradesBody.style.display = 'none';
          if (aboutBody) aboutBody.style.display = 'none';
          if (attendanceBody) attendanceBody.style.display = 'flex';

          if (navAttendance) {
            navAttendance.classList.remove('btn-secondary');
            navAttendance.classList.add('btn-primary');
          }

          if (headerZoomBtn) headerZoomBtn.style.display = 'none';
          if (fullscreenZoomBtn) fullscreenZoomBtn.style.display = 'none';
          if (layoutBtn) layoutBtn.style.display = 'none';
          if (editBtn) editBtn.style.display = '';
          if (fsEditBtn) fsEditBtn.style.display = '';
          if (resizeBtn) resizeBtn.style.display = '';
          if (chartCamBtn) chartCamBtn.style.display = 'none';
          if (attendanceCamBtn) attendanceCamBtn.style.display = 'inline-flex';
          if (gradesCamBtn) gradesCamBtn.style.display = 'none';
          if (scheduleCamBtn) scheduleCamBtn.style.display = 'none';
          if (headerManageScheduleBtn) headerManageScheduleBtn.style.display = 'none';
          if (fsManageScheduleBtn) fsManageScheduleBtn.style.display = 'none';
          if (headerEditScheduleBtn) headerEditScheduleBtn.style.display = 'none';
          if (fsEditScheduleBtn) fsEditScheduleBtn.style.display = 'none';

          if (fullscreenLayoutBtn) fullscreenLayoutBtn.style.display = 'none';

          this.renderAttendanceTable();
        } else if (this.currentViewMode === 'grades') {
          if (scheduleBody) scheduleBody.style.display = 'none';
          if (seatingBody) seatingBody.style.display = 'none';
          if (attendanceBody) attendanceBody.style.display = 'none';
          if (aboutBody) aboutBody.style.display = 'none';
          if (gradesBody) gradesBody.style.display = 'flex';

          if (navGrades) {
            navGrades.classList.remove('btn-secondary');
            navGrades.classList.add('btn-primary');
          }

          if (headerZoomBtn) headerZoomBtn.style.display = 'none';
          if (fullscreenZoomBtn) fullscreenZoomBtn.style.display = 'none';
          if (layoutBtn) layoutBtn.style.display = 'none';
          if (editBtn) editBtn.style.display = '';
          if (fsEditBtn) fsEditBtn.style.display = '';
          if (resizeBtn) resizeBtn.style.display = '';
          if (chartCamBtn) chartCamBtn.style.display = 'none';
          if (attendanceCamBtn) attendanceCamBtn.style.display = 'none';
          if (gradesCamBtn) gradesCamBtn.style.display = 'inline-flex';
          if (scheduleCamBtn) scheduleCamBtn.style.display = 'none';
          if (headerManageScheduleBtn) headerManageScheduleBtn.style.display = 'none';
          if (fsManageScheduleBtn) fsManageScheduleBtn.style.display = 'none';
          if (headerEditScheduleBtn) headerEditScheduleBtn.style.display = 'none';
          if (fsEditScheduleBtn) fsEditScheduleBtn.style.display = 'none';

          if (fullscreenLayoutBtn) fullscreenLayoutBtn.style.display = 'none';

          this.renderGradesTable();
        } else if (this.currentViewMode === 'about') {
          if (scheduleBody) scheduleBody.style.display = 'none';
          if (seatingBody) seatingBody.style.display = 'none';
          if (attendanceBody) attendanceBody.style.display = 'none';
          if (gradesBody) gradesBody.style.display = 'none';
          if (aboutBody) aboutBody.style.display = 'flex';

          if (headerZoomBtn) headerZoomBtn.style.display = 'none';
          if (fullscreenZoomBtn) fullscreenZoomBtn.style.display = 'none';
          if (layoutBtn) layoutBtn.style.display = 'none';
          if (editBtn) editBtn.style.display = 'none';
          if (fsEditBtn) fsEditBtn.style.display = 'none';
          if (resizeBtn) resizeBtn.style.display = 'none';
          if (chartCamBtn) chartCamBtn.style.display = 'none';
          if (attendanceCamBtn) attendanceCamBtn.style.display = 'none';
          if (gradesCamBtn) gradesCamBtn.style.display = 'none';
          if (scheduleCamBtn) scheduleCamBtn.style.display = 'none';
          if (headerManageScheduleBtn) headerManageScheduleBtn.style.display = 'none';
          if (fsManageScheduleBtn) fsManageScheduleBtn.style.display = 'none';
          if (headerEditScheduleBtn) headerEditScheduleBtn.style.display = 'none';
          if (fsEditScheduleBtn) fsEditScheduleBtn.style.display = 'none';

          if (fullscreenLayoutBtn) fullscreenLayoutBtn.style.display = 'none';
        } else {
          if (scheduleBody) scheduleBody.style.display = 'none';
          if (attendanceBody) attendanceBody.style.display = 'none';
          if (gradesBody) gradesBody.style.display = 'none';
          if (aboutBody) aboutBody.style.display = 'none';
          if (seatingBody) seatingBody.style.display = 'flex';

          if (navSeating) {
            navSeating.classList.remove('btn-secondary');
            navSeating.classList.add('btn-primary');
          }

          if (headerZoomBtn) headerZoomBtn.style.display = '';
          if (fullscreenZoomBtn) fullscreenZoomBtn.style.display = '';
          if (layoutBtn) layoutBtn.style.display = '';
          if (editBtn) editBtn.style.display = '';
          if (fsEditBtn) fsEditBtn.style.display = '';
          if (resizeBtn) resizeBtn.style.display = '';
          if (chartCamBtn) chartCamBtn.style.display = 'inline-flex';
          if (attendanceCamBtn) attendanceCamBtn.style.display = 'none';
          if (gradesCamBtn) gradesCamBtn.style.display = 'none';
          if (scheduleCamBtn) scheduleCamBtn.style.display = 'none';
          if (headerManageScheduleBtn) headerManageScheduleBtn.style.display = 'none';
          if (fsManageScheduleBtn) fsManageScheduleBtn.style.display = 'none';
          if (headerEditScheduleBtn) headerEditScheduleBtn.style.display = 'none';
          if (fsEditScheduleBtn) fsEditScheduleBtn.style.display = 'none';

          if (fullscreenLayoutBtn) fullscreenLayoutBtn.style.display = '';
        }

        const fsScheduleTab = document.getElementById('fullscreenScheduleTab');
        if (fsScheduleTab) {
          fsScheduleTab.style.display = (this.currentViewMode === 'schedule') ? 'inline-flex' : 'none';
        }
        const fsSubjectTab = document.getElementById('fullscreenSubjectTab');
        if (fsSubjectTab) {
          fsSubjectTab.style.display = (this.currentViewMode === 'grades') ? 'inline-flex' : 'none';
        }
        const fsClassTab = document.getElementById('fullscreenClassTab');
        if (fsClassTab) {
          fsClassTab.style.display = (this.currentViewMode === 'schedule') ? 'none' : 'inline-flex';
        }

        this.renderScheduleDropdown();
        this.updateCalendarSyncUI();
        this.updateAddGradeColumnButtonsUI();
        this.updateAddAttendanceButtonUI();
        this.updateSubheaders();
      }

      openAboutPage() {
        this.closeModal('settingsModal');
        this.switchViewMode('about');
      }

      triggerChartCameraClick(btnEl) {
        this.triggerCameraClick(btnEl);
      }

      triggerFullScreenCameraClick(btnEl) {
        if (this.currentViewMode === 'schedule') {
          this.triggerScheduleCameraClick(btnEl);
        } else if (this.currentViewMode === 'attendance') {
          this.triggerAttendanceCameraClick(btnEl);
        } else if (this.currentViewMode === 'grades') {
          this.triggerGradesCameraClick(btnEl);
        } else {
          this.triggerChartCameraClick(btnEl);
        }
      }

      getCategoryTheme(title) {
        const cat = (title || '').trim().toLowerCase();
        if (cat.includes('singing')) {
          return {
            key: 'singing',
            bgCell: '#fff7ed',
            bgHeader: '#ffedd5',
            color: '#c2410c',
            border: '#fdba74'
          };
        } else if (cat.includes('instrument')) {
          return {
            key: 'instruments',
            bgCell: '#fefce8',
            bgHeader: '#fef9c3',
            color: '#a16207',
            border: '#fde047'
          };
        } else if (cat.includes('movement')) {
          return {
            key: 'movement',
            bgCell: '#f0fdf4',
            bgHeader: '#dcfce7',
            color: '#15803d',
            border: '#86efac'
          };
        } else if (cat.includes('culture')) {
          return {
            key: 'culture',
            bgCell: '#eff6ff',
            bgHeader: '#dbeafe',
            color: '#1e40af',
            border: '#93c5fd'
          };
        } else if (cat.includes('theory')) {
          return {
            key: 'theory',
            bgCell: '#fdf2f8',
            bgHeader: '#fce7f3',
            color: '#be185d',
            border: '#fbcfe8'
          };
        } else if (cat.includes('effort') || cat.includes('behavior') || cat.includes('participation')) {
          return {
            key: 'effort',
            bgCell: '#fef2f2',
            bgHeader: '#fee2e2',
            color: '#b91c1c',
            border: '#fca5a5'
          };
        } else if (cat.includes('drawing') || cat.includes('pottery') || cat.includes('art') || cat.includes('paint') || cat.includes('craft')) {
          return {
            key: 'art',
            bgCell: '#faf5ff',
            bgHeader: '#f3e8ff',
            color: '#7e22ce',
            border: '#d8b4fe'
          };
        }

        // Palette generator for any arbitrary category name
        const palette = [
          { bgCell: '#fff7ed', bgHeader: '#ffedd5', color: '#c2410c', border: '#fdba74' }, // Orange
          { bgCell: '#f0fdf4', bgHeader: '#dcfce7', color: '#15803d', border: '#86efac' }, // Green
          { bgCell: '#eff6ff', bgHeader: '#dbeafe', color: '#1e40af', border: '#93c5fd' }, // Blue
          { bgCell: '#faf5ff', bgHeader: '#f3e8ff', color: '#7e22ce', border: '#d8b4fe' }, // Purple
          { bgCell: '#fdf2f8', bgHeader: '#fce7f3', color: '#be185d', border: '#fbcfe8' }, // Pink
          { bgCell: '#fefce8', bgHeader: '#fef9c3', color: '#a16207', border: '#fde047' }, // Yellow
          { bgCell: '#f0fdfa', bgHeader: '#ccfbf1', color: '#0f766e', border: '#5eead4' }, // Teal
          { bgCell: '#fef2f2', bgHeader: '#fee2e2', color: '#b91c1c', border: '#fca5a5' }  // Red
        ];

        let hash = 0;
        for (let i = 0; i < (title || '').length; i++) {
          hash = ((hash << 5) - hash) + title.charCodeAt(i);
          hash |= 0;
        }
        const pIndex = Math.abs(hash) % palette.length;
        return {
          key: 'custom_' + pIndex,
          ...palette[pIndex]
        };
      }

      populateAssessmentCategoriesDropdown(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = '';

        const currentClass = this.getCurrentClass();
        const subjId = this.getClassSubjectId(currentClass);
        const subjObj = this.subjects.find(s => s.id === subjId);
        let categories = (subjObj && Array.isArray(subjObj.categories) && subjObj.categories.length > 0)
          ? subjObj.categories
          : ['Singing', 'Instruments', 'Movement', 'Culture', 'Theory', 'Effort'];

        categories.forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat;
          opt.textContent = cat;
          select.appendChild(opt);
        });
      }

      formatDisplayDate(str) {
        if (!str) return 'Date';
        const s = String(str).trim();
        const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (isoMatch) {
          const y = parseInt(isoMatch[1], 10) % 100;
          const m = parseInt(isoMatch[2], 10);
          const d = parseInt(isoMatch[3], 10);
          return `${m}/${d}/${y < 10 ? '0' + y : y}`;
        }
        return s;
      }

      normalizeDateString(str) {
        if (!str) return '';
        const s = String(str).trim();
        const isoMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (isoMatch) {
          const y = parseInt(isoMatch[1], 10) % 100;
          const m = parseInt(isoMatch[2], 10);
          const d = parseInt(isoMatch[3], 10);
          return `${m}/${d}/${y < 10 ? '0' + y : y}`;
        }
        const mdyFullMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (mdyFullMatch) {
          const m = parseInt(mdyFullMatch[1], 10);
          const d = parseInt(mdyFullMatch[2], 10);
          const y = parseInt(mdyFullMatch[3], 10) % 100;
          return `${m}/${d}/${y < 10 ? '0' + y : y}`;
        }
        const mdyShortMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
        if (mdyShortMatch) {
          const m = parseInt(mdyShortMatch[1], 10);
          const d = parseInt(mdyShortMatch[2], 10);
          const y = parseInt(mdyShortMatch[3], 10);
          return `${m}/${d}/${y < 10 ? '0' + y : y}`;
        }
        return s;
      }

      getAttendanceRecordForDate(currentClass, dateStr) {
        if (!currentClass || !Array.isArray(currentClass.attendanceDates) || !dateStr) return null;
        const normTarget = this.normalizeDateString(dateStr);
        if (!normTarget) return null;
        return currentClass.attendanceDates.find(att => {
          return this.normalizeDateString(att.date) === normTarget;
        }) || null;
      }

      updateAddGradeColumnButtonsUI() {
        const headerAddBtn = document.getElementById('headerAddGradeBtn');
        const fsAddBtn = document.getElementById('fullscreenAddGradeBtn');
        const btns = [headerAddBtn, fsAddBtn].filter(Boolean);

        btns.forEach(btn => {
          if (this.isDraftScoringActive && this.draftGradeColumn) {
            btn.textContent = 'Complete';
            btn.style.background = 'var(--orange)';
            btn.style.borderColor = 'var(--orange-dark)';
            btn.style.setProperty('--btn-edge', 'var(--orange-dark)');
            btn.style.color = '#ffffff';
          } else {
            btn.textContent = 'Add Grade';
            btn.style.background = 'var(--red)';
            btn.style.borderColor = 'var(--red-dark)';
            btn.style.setProperty('--btn-edge', 'var(--red-dark)');
            btn.style.color = '#ffffff';
          }
        });

        if (headerAddBtn) {
          headerAddBtn.style.display = (this.currentViewMode === 'grades') ? 'inline-flex' : 'none';
        }
        if (fsAddBtn) {
          fsAddBtn.style.display = (this.currentViewMode === 'grades') ? 'inline-flex' : 'none';
        }
      }

      updateAddAttendanceButtonUI() {
        const headerBtn = document.getElementById('headerAddAttendanceBtn');
        const fsBtn = document.getElementById('fullscreenAddAttendanceBtn');
        const btns = [headerBtn, fsBtn].filter(Boolean);

        btns.forEach(btn => {
          if (this.isDraftAttendanceActive && this.draftAttendanceDate) {
            btn.textContent = 'Complete';
            btn.style.background = 'var(--orange)';
            btn.style.borderColor = 'var(--orange-dark)';
            btn.style.setProperty('--btn-edge', 'var(--orange-dark)');
            btn.style.color = '#ffffff';
          } else {
            btn.textContent = 'Add Date';
            btn.style.background = 'var(--blue)';
            btn.style.borderColor = 'var(--blue-dark)';
            btn.style.setProperty('--btn-edge', 'var(--blue-dark)');
            btn.style.color = '#ffffff';
          }
        });

        if (headerBtn) {
          headerBtn.style.display = (this.currentViewMode === 'attendance') ? 'inline-flex' : 'none';
        }
        if (fsBtn) {
          fsBtn.style.display = (this.currentViewMode === 'attendance') ? 'inline-flex' : 'none';
        }
      }

      onModalGradingStyleChange(modalType) {
        if (modalType === 'addGrade') {
          const select = document.getElementById('addGradeGradingStyleSelect');
          const maxCont = document.getElementById('addGradeMaxPointsContainer');
          if (select && maxCont) {
            maxCont.style.display = (select.value === 'points') ? 'block' : 'none';
          }
        } else if (modalType === 'startSession') {
          const select = document.getElementById('startGradeSessionGradingStyleSelect');
          const maxCont = document.getElementById('startGradeSessionMaxPointsContainer');
          if (select && maxCont) {
            maxCont.style.display = (select.value === 'points') ? 'block' : 'none';
          }
        }
        this.renderModalAutoFillControls(modalType);
      }

      toggleModalAutoFill(modalType) {
        if (!this.autoFillState) {
          this.autoFillState = {
            addGrade: { active: false, informal: 'plus', standards: '4', points: null },
            startSession: { active: false, informal: 'plus', standards: '4', points: null }
          };
        }
        if (!this.autoFillState[modalType]) {
          this.autoFillState[modalType] = { active: false, informal: 'plus', standards: '4', points: null };
        }
        this.autoFillState[modalType].active = !this.autoFillState[modalType].active;
        const btnId = (modalType === 'addGrade') ? 'addGradeAutoFillToggle' : 'startGradeSessionAutoFillToggle';
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.classList.toggle('active', this.autoFillState[modalType].active);
        }
      }

      setModalAutoFillValue(modalType, styleType, val) {
        if (!this.autoFillState) {
          this.autoFillState = {
            addGrade: { active: false, informal: 'plus', standards: '4', points: null },
            startSession: { active: false, informal: 'plus', standards: '4', points: null }
          };
        }
        if (!this.autoFillState[modalType]) {
          this.autoFillState[modalType] = { active: false, informal: 'plus', standards: '4', points: null };
        }
        this.autoFillState[modalType][styleType] = val;
        this.renderModalAutoFillControls(modalType);
      }

      cycleModalAutoFillPlus(modalType) {
        if (!this.autoFillState) {
          this.autoFillState = {
            addGrade: { active: false, informal: 'plus', standards: '4', points: null },
            startSession: { active: false, informal: 'plus', standards: '4', points: null }
          };
        }
        if (!this.autoFillState[modalType]) {
          this.autoFillState[modalType] = { active: false, informal: 'plus', standards: '4', points: null };
        }
        const cur = this.autoFillState[modalType].informal;
        this.autoFillState[modalType].informal = (cur === 'plus' || cur === 'check') ? 'star' : 'plus';
        this.renderModalAutoFillControls(modalType);
      }

      cycleModalAutoFillMinus(modalType) {
        if (!this.autoFillState) {
          this.autoFillState = {
            addGrade: { active: false, informal: 'plus', standards: '4', points: null },
            startSession: { active: false, informal: 'plus', standards: '4', points: null }
          };
        }
        if (!this.autoFillState[modalType]) {
          this.autoFillState[modalType] = { active: false, informal: 'plus', standards: '4', points: null };
        }
        const cur = this.autoFillState[modalType].informal;
        this.autoFillState[modalType].informal = (cur === 'minus') ? 'x' : 'minus';
        this.renderModalAutoFillControls(modalType);
      }

      onModalMaxPointsInput(modalType) {
        this.renderModalAutoFillControls(modalType);
      }

      openAutoFillPointsModal(modalType) {
        this.openPointsEntryModal('All Students (Auto Fill)', 'autofill_' + modalType, null);
      }

      renderModalAutoFillControls(modalType) {
        if (!this.autoFillState) {
          this.autoFillState = {
            addGrade: { active: false, informal: 'plus', standards: '4', points: null },
            startSession: { active: false, informal: 'plus', standards: '4', points: null }
          };
        }
        if (!this.autoFillState[modalType]) {
          this.autoFillState[modalType] = { active: false, informal: 'plus', standards: '4', points: null };
        }

        const styleSelectId = (modalType === 'addGrade') ? 'addGradeGradingStyleSelect' : 'startGradeSessionGradingStyleSelect';
        const select = document.getElementById(styleSelectId);
        const style = (select && select.value) ? select.value : 'informal';

        const maxInputId = (modalType === 'addGrade') ? 'gradeMaxPointsInput' : 'gradeSessionMaxPointsInput';
        const maxInput = document.getElementById(maxInputId);
        const maxPts = (maxInput && maxInput.value) ? (parseInt(maxInput.value, 10) || 10) : 10;

        const contId = (modalType === 'addGrade') ? 'addGradeAutoFillControls' : 'startGradeSessionAutoFillControls';
        const cont = document.getElementById(contId);
        if (!cont) return;

        if (style === 'informal') {
          const curVal = this.autoFillState[modalType].informal || 'plus';
          const isPlus = (curVal === 'plus' || curVal === 'check');
          const isStar = (curVal === 'star');
          const isMinus = (curVal === 'minus');
          const isX = (curVal === 'x');
          cont.innerHTML = `
            <div class="grade-score-controls" style="margin: 0; display: inline-flex; gap: 4px;">
              <button type="button" class="grade-score-btn grade-btn-plus ${isPlus ? 'active-check' : (isStar ? 'active-star' : '')}" style="width: 28px; height: 28px; font-size: 1rem; border-radius: 6px;" onclick="app.cycleModalAutoFillPlus('${modalType}')" title="Auto Fill Plus (+) / Gold Star (★)">${isStar ? '★' : '+'}</button>
              <button type="button" class="grade-score-btn grade-btn-minus ${isMinus ? 'active-minus' : (isX ? 'active-x' : '')}" style="width: 28px; height: 28px; font-size: 1rem; border-radius: 6px;" onclick="app.cycleModalAutoFillMinus('${modalType}')" title="Auto Fill Minus (−) / X (✕)">${isX ? '✕' : '−'}</button>
            </div>`;
        } else if (style === 'standards') {
          const curVal = String(this.autoFillState[modalType].standards || '4');
          cont.innerHTML = `
            <div class="standards-score-controls" style="margin: 0; display: inline-flex; gap: 3px;">
              <button type="button" class="standards-btn standards-btn-4 ${curVal === '4' ? 'active-4' : ''}" style="width: 26px; height: 26px; font-size: 0.8rem;" onclick="app.setModalAutoFillValue('${modalType}', 'standards', '4')" title="4 - Advanced (Yellow)">4</button>
              <button type="button" class="standards-btn standards-btn-3 ${curVal === '3' ? 'active-3' : ''}" style="width: 26px; height: 26px; font-size: 0.8rem;" onclick="app.setModalAutoFillValue('${modalType}', 'standards', '3')" title="3 - Proficient (Green)">3</button>
              <button type="button" class="standards-btn standards-btn-2 ${curVal === '2' ? 'active-2' : ''}" style="width: 26px; height: 26px; font-size: 0.8rem;" onclick="app.setModalAutoFillValue('${modalType}', 'standards', '2')" title="2 - Approaching (Orange)">2</button>
              <button type="button" class="standards-btn standards-btn-1 ${curVal === '1' ? 'active-1' : ''}" style="width: 26px; height: 26px; font-size: 0.8rem;" onclick="app.setModalAutoFillValue('${modalType}', 'standards', '1')" title="1 - Beginning (Red)">1</button>
            </div>`;
        } else if (style === 'points') {
          let curPts = this.autoFillState[modalType].points;
          if (curPts === null || curPts === undefined) curPts = maxPts;
          const isScored = (curPts !== '' && curPts !== null && curPts !== undefined && !isNaN(Number(curPts)));
          const earned = isScored ? Number(curPts) : '';
          const pct = isScored ? Math.round((earned / maxPts) * 100) : 0;
          cont.innerHTML = isScored
            ? `<button type="button" class="points-badge-btn points-badge-scored" style="font-size: 0.8rem; padding: 4px 8px;" onclick="app.openAutoFillPointsModal('${modalType}')" title="Click to edit Auto Fill score">${earned}/${maxPts} <span class="points-badge-pct">(${pct}%)</span></button>`
            : `<button type="button" class="points-badge-btn points-badge-unscored" style="font-size: 0.8rem; padding: 4px 8px;" onclick="app.openAutoFillPointsModal('${modalType}')" title="Click to edit Auto Fill score">? / ${maxPts}</button>`;
        }
      }

      openAddGradeColumnModal() {
        const currentClass = this.getCurrentClass();

        if (this.isDraftScoringActive && this.draftGradeColumn) {
          // Complete the active draft assessment column!
          if (currentClass) {
            const cols = this.getClassGradeColumns(currentClass);
            const savedCol = {
              id: this.draftGradeColumn.id || ('g_' + Date.now()),
              title: this.draftGradeColumn.title || 'Assessment',
              date: this.draftGradeColumn.date || '',
              timestamp: this.draftGradeColumn.timestamp || Date.now(),
              gradingStyle: this.draftGradeColumn.gradingStyle || this.getGradingStyle(currentClass),
              grades: { ...(this.draftGradeColumn.grades || {}) }
            };
            if (savedCol.gradingStyle === 'points') {
              savedCol.maxPoints = this.draftGradeColumn.maxPoints || 10;
            }
            cols.push(savedCol);
            this.setClassGradeColumns(cols, currentClass);
            this.saveData();
          }

          this.draftGradeColumn = null;
          this.isDraftScoringActive = false;

          this.updateAddGradeColumnButtonsUI();
          this.renderGradesTable();
          return;
        }

        this.populateAssessmentCategoriesDropdown('gradeTitleSelect');

        const style = this.getGradingStyle(currentClass);
        const styleSelect = document.getElementById('addGradeGradingStyleSelect');
        if (styleSelect) styleSelect.value = style;
        this.onModalGradingStyleChange('addGrade');

        if (!this.autoFillState) {
          this.autoFillState = {
            addGrade: { active: false, informal: 'plus', standards: '4', points: null },
            startSession: { active: false, informal: 'plus', standards: '4', points: null }
          };
        }
        if (!this.autoFillState.addGrade) {
          this.autoFillState.addGrade = { active: false, informal: 'plus', standards: '4', points: null };
        }
        this.autoFillState.addGrade.active = false;
        const autoFillBtn = document.getElementById('addGradeAutoFillToggle');
        if (autoFillBtn) autoFillBtn.classList.remove('active');
        this.renderModalAutoFillControls('addGrade');

        const titleSelect = document.getElementById('gradeTitleSelect');
        const dateInput = document.getElementById('gradeDateInput');
        if (titleSelect && titleSelect.options.length > 0) titleSelect.selectedIndex = 0;
        if (dateInput) {
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const dd = String(today.getDate()).padStart(2, '0');
          dateInput.value = `${yyyy}-${mm}-${dd}`;
        }
        const modal = document.getElementById('addGradeColumnModal');
        if (modal) modal.classList.add('active');
      }

      closeAddGradeColumnModal() {
        const modal = document.getElementById('addGradeColumnModal');
        if (modal) modal.classList.remove('active');
      }

      saveAddGradeColumn() {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        const titleSelect = document.getElementById('gradeTitleSelect');
        const dateInput = document.getElementById('gradeDateInput');

        const title = (titleSelect && titleSelect.value) ? titleSelect.value : 'Assessment';
        const rawDate = (dateInput && dateInput.value) ? dateInput.value.trim() : '';
        const date = this.formatDisplayDate(rawDate);
        const styleSelect = document.getElementById('addGradeGradingStyleSelect');
        const style = (styleSelect && styleSelect.value) ? styleSelect.value : this.getGradingStyle(currentClass);

        this.draftGradeColumn = {
          id: 'g_' + Date.now(),
          title: title,
          date: date,
          timestamp: Date.now(),
          gradingStyle: style,
          grades: {}
        };
        let maxPoints = 10;
        if (style === 'points') {
          const maxPointsInput = document.getElementById('gradeMaxPointsInput');
          maxPoints = (maxPointsInput && maxPointsInput.value) ? parseInt(maxPointsInput.value, 10) : 10;
          if (isNaN(maxPoints) || maxPoints <= 0) maxPoints = 10;
          this.draftGradeColumn.maxPoints = maxPoints;
        }

        // Apply Auto Fill if active
        if (this.autoFillState && this.autoFillState.addGrade && this.autoFillState.addGrade.active) {
          let masterScore = '';
          if (style === 'points') {
            const p = this.autoFillState.addGrade.points;
            masterScore = (p !== null && p !== undefined && p !== '' && !isNaN(Number(p))) ? Number(p) : maxPoints;
          } else if (style === 'standards') {
            masterScore = this.autoFillState.addGrade.standards || '4';
          } else {
            masterScore = this.autoFillState.addGrade.informal || 'plus';
          }
          const studentSet = new Set();
          if (Array.isArray(currentClass.classList)) {
            currentClass.classList.forEach(s => { if (typeof s === 'string' && s.trim()) studentSet.add(s.trim()); });
          }
          if (Array.isArray(currentClass.seats)) {
            currentClass.seats.forEach(st => { if (st && st.student && typeof st.student === 'string' && st.student.trim()) studentSet.add(st.student.trim()); });
          }
          if (Array.isArray(currentClass.students)) {
            currentClass.students.forEach(s => { if (typeof s === 'string' && s.trim()) studentSet.add(s.trim()); });
          }
          studentSet.forEach(student => {
            this.draftGradeColumn.grades[student] = masterScore;
          });
        }

        this.isDraftScoringActive = true;

        this.closeAddGradeColumnModal();
        this.updateAddGradeColumnButtonsUI();
        this.renderGradesTable();
      }

      recordDraftPointsScore(studentName, value) {
        if (!this.isDraftScoringActive || !this.draftGradeColumn) return;
        if (!studentName) return;

        if (!this.draftGradeColumn.grades) {
          this.draftGradeColumn.grades = {};
        }

        const trimmed = String(value).trim();
        this.draftGradeColumn.grades[studentName] = (trimmed === '') ? '' : Number(trimmed);
      }

      recordDraftGradeScore(studentName, action) {
        if (!this.isDraftScoringActive || !this.draftGradeColumn) return;
        if (!studentName) return;

        if (!this.draftGradeColumn.grades) {
          this.draftGradeColumn.grades = {};
        }

        const currentScore = this.draftGradeColumn.grades[studentName] || '';
        let nextScore = '';

        if (['4', '3', '2', '1'].includes(String(action))) {
          nextScore = (String(currentScore) === String(action)) ? '' : String(action);
        } else if (action === 'plus') {
          if (currentScore === 'check' || currentScore === 'plus') {
            nextScore = 'star'; // pressed twice -> gold star!
          } else if (currentScore === 'star') {
            nextScore = '';
          } else {
            nextScore = 'plus';
          }
        } else if (action === 'minus') {
          if (currentScore === 'minus') {
            nextScore = 'x'; // pressed twice -> turns to red X!
          } else if (currentScore === 'x') {
            nextScore = '';
          } else {
            nextScore = 'minus';
          }
        }

        this.draftGradeColumn.grades[studentName] = nextScore;
        this.renderGradesTable();
      }

      onGradeSessionButtonClick() {
        if (!this.isGradeScoringActive) {
          this.populateAssessmentCategoriesDropdown('gradeSessionTitleSelect');

          const currentClass = this.getCurrentClass();
          const style = this.getGradingStyle(currentClass);
          const styleSelect = document.getElementById('startGradeSessionGradingStyleSelect');
          if (styleSelect) styleSelect.value = style;
          this.onModalGradingStyleChange('startSession');

          if (!this.autoFillState) {
            this.autoFillState = {
              addGrade: { active: false, informal: 'plus', standards: '4', points: null },
              startSession: { active: false, informal: 'plus', standards: '4', points: null }
            };
          }
          if (!this.autoFillState.startSession) {
            this.autoFillState.startSession = { active: false, informal: 'plus', standards: '4', points: null };
          }
          this.autoFillState.startSession.active = false;
          const autoFillBtn = document.getElementById('startGradeSessionAutoFillToggle');
          if (autoFillBtn) autoFillBtn.classList.remove('active');
          this.renderModalAutoFillControls('startSession');

          const titleSelect = document.getElementById('gradeSessionTitleSelect');
          const dateInput = document.getElementById('gradeSessionDateInput');
          if (titleSelect && titleSelect.options.length > 0) titleSelect.selectedIndex = 0;
          if (dateInput) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            dateInput.value = `${yyyy}-${mm}-${dd}`;
          }
          const modal = document.getElementById('startGradeSessionModal');
          if (modal) modal.classList.add('active');
        } else {
          // Complete active live grade session!
          const currentClass = this.getCurrentClass();
          if (currentClass && this.activeGradeSession) {
            const cols = this.getClassGradeColumns(currentClass);

            const title = this.activeGradeSession.title || 'Singing';
            const date = this.activeGradeSession.date || 'Date';
            const scores = this.activeGradeSession.scores || {};
            const gradingStyle = this.activeGradeSession.gradingStyle || this.getGradingStyle(currentClass);
            const newId = 'g_' + Date.now();
            const newCol = {
              id: newId,
              title: title,
              date: date,
              timestamp: Date.now(),
              gradingStyle: gradingStyle,
              grades: { ...scores }
            };
            if (gradingStyle === 'points') {
              newCol.maxPoints = this.activeGradeSession.maxPoints || 10;
            }
            cols.push(newCol);

            this.setClassGradeColumns(cols, currentClass);
            this.saveData();
          }

          this.isGradeScoringActive = false;
          this.activeGradeSession = { title: 'Singing', date: '', scores: {} };

          const startBtn = document.getElementById('btnGradeSessionStart');
          const statusIcon = document.getElementById('gradeStatusIcon');

          if (startBtn) {
            startBtn.textContent = 'Add Grade';
            startBtn.style.background = 'var(--red)';
            startBtn.style.borderColor = 'var(--red-dark)';
            startBtn.style.setProperty('--btn-edge', 'var(--red-dark)');
            startBtn.style.color = '#ffffff';
          }

          // Green check mark confirmation flash animation
          if (statusIcon) {
            statusIcon.classList.remove('unconfirmed');
            statusIcon.classList.add('confirmed');
            const iconPlus = statusIcon.querySelector('.icon-plus');
            const iconCheck = statusIcon.querySelector('.icon-check');
            if (iconPlus) iconPlus.style.display = 'none';
            if (iconCheck) iconCheck.style.display = 'inline';

            statusIcon.style.transform = 'scale(1.3)';
            statusIcon.style.transition = 'transform 0.2s ease-out';
            setTimeout(() => {
              statusIcon.style.transform = 'scale(1)';
            }, 250);

            setTimeout(() => {
              statusIcon.classList.remove('confirmed');
              statusIcon.classList.add('unconfirmed');
              if (iconPlus) iconPlus.style.display = 'inline';
              if (iconCheck) iconCheck.style.display = 'none';
            }, 3000);
          }

          this.render();
          if (this.currentViewMode === 'grades') {
            this.renderGradesTable();
          }
        }
      }

      confirmStartGradeSession() {
        const titleSelect = document.getElementById('gradeSessionTitleSelect');
        const dateInput = document.getElementById('gradeSessionDateInput');

        const title = (titleSelect && titleSelect.value) ? titleSelect.value : 'Singing';
        const rawDate = (dateInput && dateInput.value) ? dateInput.value.trim() : '';
        const date = this.formatDisplayDate(rawDate);
        const styleSelect = document.getElementById('startGradeSessionGradingStyleSelect');
        const style = (styleSelect && styleSelect.value) ? styleSelect.value : this.getGradingStyle(this.getCurrentClass());

        this.activeGradeSession = {
          title: title,
          date: date,
          gradingStyle: style,
          scores: {}
        };
        let maxPoints = 10;
        if (style === 'points') {
          const maxPointsInput = document.getElementById('gradeSessionMaxPointsInput');
          maxPoints = (maxPointsInput && maxPointsInput.value) ? parseInt(maxPointsInput.value, 10) : 10;
          if (isNaN(maxPoints) || maxPoints <= 0) maxPoints = 10;
          this.activeGradeSession.maxPoints = maxPoints;
        }

        // Apply Auto Fill if active
        const currentClass = this.getCurrentClass();
        if (this.autoFillState && this.autoFillState.startSession && this.autoFillState.startSession.active && currentClass) {
          let masterScore = '';
          if (style === 'points') {
            const p = this.autoFillState.startSession.points;
            masterScore = (p !== null && p !== undefined && p !== '' && !isNaN(Number(p))) ? Number(p) : maxPoints;
          } else if (style === 'standards') {
            masterScore = this.autoFillState.startSession.standards || '4';
          } else {
            masterScore = this.autoFillState.startSession.informal || 'plus';
          }
          const studentSet = new Set();
          if (Array.isArray(currentClass.classList)) {
            currentClass.classList.forEach(s => { if (typeof s === 'string' && s.trim()) studentSet.add(s.trim()); });
          }
          if (Array.isArray(currentClass.seats)) {
            currentClass.seats.forEach(st => { if (st && st.student && typeof st.student === 'string' && st.student.trim()) studentSet.add(st.student.trim()); });
          }
          if (Array.isArray(currentClass.students)) {
            currentClass.students.forEach(s => { if (typeof s === 'string' && s.trim()) studentSet.add(s.trim()); });
          }
          studentSet.forEach(student => {
            this.activeGradeSession.scores[student] = masterScore;
          });
        }

        this.isGradeScoringActive = true;

        this.closeModal('startGradeSessionModal');

        const startBtn = document.getElementById('btnGradeSessionStart');

        if (startBtn) {
          startBtn.textContent = 'Complete';
          startBtn.classList.remove('btn-secondary');
          startBtn.style.background = 'var(--orange)';
          startBtn.style.borderColor = 'var(--orange-dark)';
          startBtn.style.setProperty('--btn-edge', 'var(--orange-dark)');
          startBtn.style.color = '#ffffff';
        }

        this.render();
      }

      openPointsEntryModal(studentName, context = 'live', colId = null) {
        this.pointsEntryContext = { studentName, context, colId };

        const currentClass = this.getCurrentClass();
        const profile = this.getStudentProfile(currentClass, studentName);
        const fullName = (profile.lastName && profile.lastName.trim())
          ? `${profile.firstName} ${profile.lastName}`
          : (profile.firstName || studentName);

        let maxPoints = 10;
        let currentScore = '';
        let title = 'Assessment';

        if (context === 'live') {
          maxPoints = (this.activeGradeSession && this.activeGradeSession.maxPoints) || 10;
          title = (this.activeGradeSession && this.activeGradeSession.title) || 'Assessment';
          currentScore = (this.activeGradeSession && this.activeGradeSession.scores)
            ? (this.activeGradeSession.scores[studentName] !== undefined ? this.activeGradeSession.scores[studentName] : '')
            : '';
        } else if (context === 'draft') {
          maxPoints = (this.draftGradeColumn && this.draftGradeColumn.maxPoints) || 10;
          title = (this.draftGradeColumn && this.draftGradeColumn.title) || 'Assessment';
          currentScore = (this.draftGradeColumn && this.draftGradeColumn.grades)
            ? (this.draftGradeColumn.grades[studentName] !== undefined ? this.draftGradeColumn.grades[studentName] : '')
            : '';
        } else if (context === 'saved') {
          const cols = this.getClassGradeColumns(currentClass);
          const col = cols.find(g => g.id === colId);
          if (col) {
            maxPoints = col.maxPoints || 10;
            title = col.title || 'Assessment';
            currentScore = (col.grades && col.grades[studentName] !== undefined) ? col.grades[studentName] : '';
          }
        } else if (context === 'autofill_addGrade') {
          const maxInput = document.getElementById('gradeMaxPointsInput');
          maxPoints = (maxInput && maxInput.value) ? (parseInt(maxInput.value, 10) || 10) : 10;
          title = 'Auto Fill Grade';
          currentScore = (this.autoFillState && this.autoFillState.addGrade && this.autoFillState.addGrade.points !== null)
            ? this.autoFillState.addGrade.points
            : maxPoints;
        } else if (context === 'autofill_startSession') {
          const maxInput = document.getElementById('gradeSessionMaxPointsInput');
          maxPoints = (maxInput && maxInput.value) ? (parseInt(maxInput.value, 10) || 10) : 10;
          title = 'Auto Fill Grade';
          currentScore = (this.autoFillState && this.autoFillState.startSession && this.autoFillState.startSession.points !== null)
            ? this.autoFillState.startSession.points
            : maxPoints;
        }

        const nameEl = document.getElementById('pointsEntryStudentName');
        const subEl = document.getElementById('pointsEntrySubTitle');
        const maxEl = document.getElementById('pointsEntryMaxDisplay');
        const inputEl = document.getElementById('pointsEntryInput');

        if (nameEl) nameEl.textContent = fullName;
        if (subEl) subEl.textContent = title;
        if (maxEl) maxEl.textContent = `/ ${maxPoints}`;

        if (inputEl) {
          inputEl.max = maxPoints;
          const initialVal = (currentScore !== '' && currentScore !== null && currentScore !== undefined)
            ? currentScore
            : maxPoints;
          inputEl.value = initialVal;
        }

        const modal = document.getElementById('pointsEntryModal');
        if (modal) modal.classList.add('active');

        setTimeout(() => {
          if (inputEl) {
            inputEl.focus();
            inputEl.select();
          }
        }, 50);
      }

      confirmPointsEntry() {
        if (!this.pointsEntryContext) return;
        const { studentName, context, colId } = this.pointsEntryContext;
        const inputEl = document.getElementById('pointsEntryInput');
        const rawVal = inputEl ? inputEl.value.trim() : '';
        const scoreVal = (rawVal === '') ? '' : Number(rawVal);

        if (context === 'live') {
          if (!this.activeGradeSession) this.activeGradeSession = {};
          if (!this.activeGradeSession.scores) this.activeGradeSession.scores = {};
          this.activeGradeSession.scores[studentName] = scoreVal;
          this.render();
        } else if (context === 'draft') {
          if (!this.draftGradeColumn) this.draftGradeColumn = {};
          if (!this.draftGradeColumn.grades) this.draftGradeColumn.grades = {};
          this.draftGradeColumn.grades[studentName] = scoreVal;
          this.renderGradesTable();
        } else if (context === 'saved') {
          const currentClass = this.getCurrentClass();
          if (currentClass && colId) {
            const cols = this.getClassGradeColumns(currentClass);
            const col = cols.find(g => g.id === colId);
            if (col) {
              if (!col.grades) col.grades = {};
              col.grades[studentName] = scoreVal;
              this.setClassGradeColumns(cols, currentClass);
              this.saveData();
              this.renderGradesTable();
            }
          }
        } else if (context === 'autofill_addGrade') {
          if (!this.autoFillState) this.autoFillState = {};
          if (!this.autoFillState.addGrade) this.autoFillState.addGrade = {};
          this.autoFillState.addGrade.points = (scoreVal !== '') ? scoreVal : null;
          this.renderModalAutoFillControls('addGrade');
        } else if (context === 'autofill_startSession') {
          if (!this.autoFillState) this.autoFillState = {};
          if (!this.autoFillState.startSession) this.autoFillState.startSession = {};
          this.autoFillState.startSession.points = (scoreVal !== '') ? scoreVal : null;
          this.renderModalAutoFillControls('startSession');
        }

        this.closePointsEntryModal();
      }

      removePointsEntryScore() {
        if (!this.pointsEntryContext) return;
        const { studentName, context, colId } = this.pointsEntryContext;

        if (context === 'live') {
          if (!this.activeGradeSession) this.activeGradeSession = {};
          if (!this.activeGradeSession.scores) this.activeGradeSession.scores = {};
          this.activeGradeSession.scores[studentName] = '';
          this.render();
        } else if (context === 'draft') {
          if (!this.draftGradeColumn) this.draftGradeColumn = {};
          if (!this.draftGradeColumn.grades) this.draftGradeColumn.grades = {};
          this.draftGradeColumn.grades[studentName] = '';
          this.renderGradesTable();
        } else if (context === 'saved') {
          const currentClass = this.getCurrentClass();
          if (currentClass && colId) {
            const cols = this.getClassGradeColumns(currentClass);
            const col = cols.find(g => g.id === colId);
            if (col) {
              if (!col.grades) col.grades = {};
              col.grades[studentName] = '';
              this.setClassGradeColumns(cols, currentClass);
              this.saveData();
              this.renderGradesTable();
            }
          }
        } else if (context === 'autofill_addGrade') {
          if (!this.autoFillState) this.autoFillState = {};
          if (!this.autoFillState.addGrade) this.autoFillState.addGrade = {};
          this.autoFillState.addGrade.points = null;
          this.renderModalAutoFillControls('addGrade');
        } else if (context === 'autofill_startSession') {
          if (!this.autoFillState) this.autoFillState = {};
          if (!this.autoFillState.startSession) this.autoFillState.startSession = {};
          this.autoFillState.startSession.points = null;
          this.renderModalAutoFillControls('startSession');
        }

        this.closePointsEntryModal();
      }

      closePointsEntryModal() {
        this.pointsEntryContext = null;
        const modal = document.getElementById('pointsEntryModal');
        if (modal) modal.classList.remove('active');
      }

      recordLivePointsScore(studentName, value) {
        if (!this.isGradeScoringActive || !this.activeGradeSession) return;
        if (!studentName) return;

        if (!this.activeGradeSession.scores) {
          this.activeGradeSession.scores = {};
        }

        const trimmed = String(value).trim();
        this.activeGradeSession.scores[studentName] = (trimmed === '') ? '' : Number(trimmed);
      }

      recordLiveGradeScore(studentName, action) {
        if (!this.isGradeScoringActive || !this.activeGradeSession) return;
        if (!studentName) return;

        if (!this.activeGradeSession.scores) {
          this.activeGradeSession.scores = {};
        }

        const currentScore = this.activeGradeSession.scores[studentName] || '';
        let nextScore = '';

        if (['4', '3', '2', '1'].includes(String(action))) {
          nextScore = (String(currentScore) === String(action)) ? '' : String(action);
        } else if (action === 'plus') {
          if (currentScore === 'check' || currentScore === 'plus') {
            nextScore = 'star'; // pressed twice -> gold star!
          } else if (currentScore === 'star') {
            nextScore = '';
          } else {
            nextScore = 'check';
          }
        } else if (action === 'minus') {
          if (currentScore === 'minus') {
            nextScore = 'x'; // pressed twice -> turns to red X!
          } else if (currentScore === 'x') {
            nextScore = '';
          } else {
            nextScore = 'minus';
          }
        }

        this.activeGradeSession.scores[studentName] = nextScore;
        this.render();
      }

      deleteGradeColumn(gradeId) {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        let cols = this.getClassGradeColumns(currentClass);
        cols = cols.filter(g => g.id !== gradeId);
        this.setClassGradeColumns(cols, currentClass);
        this.saveData();
        this.renderGradesTable();
      }

      moveGradeColumn(gradeId, direction) {
        if (!this.isEditMode) return;
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        const cols = this.getClassGradeColumns(currentClass);
        const index = cols.findIndex(g => g.id === gradeId);
        if (index === -1) return;

        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= cols.length) return;

        const temp = cols[index];
        cols[index] = cols[targetIndex];
        cols[targetIndex] = temp;

        this.setClassGradeColumns(cols, currentClass);
        this.saveData();
        this.renderGradesTable();
      }

      handleGradeColDragStart(e, index) {
        if (!this.isEditMode) return;
        this.draggedGradeColIndex = index;
        if (e && e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', String(index));
        }
        const th = (e && e.target && typeof e.target.closest === 'function') ? e.target.closest('th') : null;
        if (th) th.classList.add('column-dragging');
      }

      handleGradeColDragOver(e) {
        if (!this.isEditMode || this.draggedGradeColIndex === null) return;
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      }

      handleGradeColDragEnter(e) {
        if (!this.isEditMode || this.draggedGradeColIndex === null) return;
        const th = (e && e.target && typeof e.target.closest === 'function') ? e.target.closest('th') : null;
        if (th) th.classList.add('column-drag-over');
      }

      handleGradeColDragLeave(e) {
        const th = (e && e.target && typeof e.target.closest === 'function') ? e.target.closest('th') : null;
        if (th) th.classList.remove('column-drag-over');
      }

      handleGradeColDrop(e, targetIndex) {
        if (!this.isEditMode || this.draggedGradeColIndex === null) return;
        e.preventDefault();

        const fromIndex = this.draggedGradeColIndex;
        this.draggedGradeColIndex = null;

        const ths = document.querySelectorAll('th.grade-col-header');
        ths.forEach(t => t.classList.remove('column-dragging', 'column-drag-over'));

        if (fromIndex === targetIndex || fromIndex === null || targetIndex === undefined) return;

        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        const cols = this.getClassGradeColumns(currentClass);
        if (fromIndex < 0 || fromIndex >= cols.length || targetIndex < 0 || targetIndex >= cols.length) return;

        const [movedCol] = cols.splice(fromIndex, 1);
        cols.splice(targetIndex, 0, movedCol);

        this.setClassGradeColumns(cols, currentClass);
        this.saveData();
        this.renderGradesTable();
      }

      cycleStudentGrade(currentClass, gradeId, studentName) {
        if (!this.isEditMode) return;
        if (!currentClass || !gradeId || !studentName) return;

        const cols = this.getClassGradeColumns(currentClass);
        const col = cols.find(g => g.id === gradeId);
        if (!col) return;

        if (!col.grades) col.grades = {};
        const currentGrade = col.grades[studentName] !== undefined ? col.grades[studentName] : null;

        const isPoints = (col.gradingStyle === 'points') || (!col.gradingStyle && col.maxPoints !== undefined);
        if (isPoints) {
          this.openPointsEntryModal(studentName, 'saved', gradeId);
          return;
        }

        const isStandards = (col.gradingStyle === 'standards') ||
          ['4', '3', '2', '1'].includes(String(currentGrade)) ||
          (!col.gradingStyle && this.getGradingStyle(currentClass) === 'standards');

        let nextGrade = '';
        if (isStandards) {
          if (String(currentGrade) === '4') nextGrade = '3';
          else if (String(currentGrade) === '3') nextGrade = '2';
          else if (String(currentGrade) === '2') nextGrade = '1';
          else if (String(currentGrade) === '1') nextGrade = '';
          else nextGrade = '4';
        } else {
          if (currentGrade === 'check' || currentGrade === 'plus') nextGrade = 'star';
          else if (currentGrade === 'star') nextGrade = 'minus';
          else if (currentGrade === 'minus') nextGrade = 'x';
          else if (currentGrade === 'x') nextGrade = '';
          else nextGrade = 'check';
        }

        col.grades[studentName] = nextGrade;
        this.setClassGradeColumns(cols, currentClass);
        this.saveData();
        this.renderGradesTable();
      }

      getStudentAttendanceRatio(currentClass, student) {
        if (!currentClass) return '(0/0)';
        if (!Array.isArray(currentClass.attendanceDates)) {
          currentClass.attendanceDates = this.getDefaultAttendanceDates();
        }
        const dates = currentClass.attendanceDates || [];
        if (dates.length === 0) return '(0/0)';

        // Only dates with a real ✓ or ✕ for this student count (e.g. before they joined, nothing counts)
        let presentCount = 0;
        let recordedCount = 0;
        dates.forEach(d => {
          const status = d.statuses ? d.statuses[student] : null;
          if (status === 'present' || status === 'absent') recordedCount++;
          if (status === 'present') presentCount++;
        });

        return `(${presentCount}/${recordedCount})`;
      }

      // How many recorded classes in a row, counting back from the most recent,
      // the student was marked present. A missing record ends the streak.
      getAttendanceStreak(currentClass, student) {
        if (!currentClass || !student || !Array.isArray(currentClass.attendanceDates)) return 0;
        const stamp = d => (typeof d.timestamp === 'number') ? d.timestamp : (Date.parse(d.date) || 0);
        const dates = [...currentClass.attendanceDates].sort((a, b) => stamp(b) - stamp(a));
        let streak = 0;
        for (const d of dates) {
          if (!d.statuses || d.statuses[student] !== 'present') break;
          streak++;
        }
        return streak;
      }

      // Classes that meet several times a week ('daily') need longer streaks than weekly ones.
      // Classes saved before this setting existed count as weekly.
      getAttendancePace(currentClass) {
        return (currentClass && currentClass.attendancePace === 'daily') ? 'daily' : 'weekly';
      }

      toggleGradesAttendanceIndicators() {
        this.showGradesAttendanceIndicators = (this.showGradesAttendanceIndicators === false) ? true : false;
        const btn = document.getElementById('btnToggleGradesAttendance');
        if (btn) {
          btn.classList.toggle('active', this.showGradesAttendanceIndicators);
        }
        this.renderGradesTable();
      }

      renderGradesTable() {
        const table = document.getElementById('gradesTable');
        if (!table) return;

        const currentClass = this.getCurrentClass();
        if (!currentClass) {
          table.innerHTML = '<tr><td style="padding: 20px; color: var(--text-muted);">No class selected</td></tr>';
          return;
        }

        this.renderGradeSubjectDropdown();

        const btnToggle = document.getElementById('btnToggleGradesAttendance');
        if (btnToggle) {
          btnToggle.classList.toggle('active', this.showGradesAttendanceIndicators !== false);
        }

        const classList = currentClass.classList || [];
        const gradeCols = this.getClassGradeColumns(currentClass);
        const isEdit = this.isEditMode;

        const displayGradeCols = [...gradeCols];
        if (this.isDraftScoringActive && this.draftGradeColumn) {
          displayGradeCols.push({ ...this.draftGradeColumn, isDraft: true });
        }

        let html = '<thead><tr><th style="min-width: 220px; text-align: left; background-color: var(--paper-3);">Student Name</th>';
        displayGradeCols.forEach((col, idx) => {
          if (col.isDraft) {
            html += `<th style="background-color: var(--paper-2); border-bottom: 2px solid var(--line-strong); border-left: 2px dashed var(--ink-faint); border-right: 2px dashed var(--ink-faint);">
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.25; padding: 4px 2px;">
                <span style="font-weight: 800; font-size: 0.85rem; color: var(--ink-soft); background: var(--line); padding: 2px 8px; border-radius: 12px; border: 1px solid var(--line-strong); font-family: inherit;">${this.escapeHtml(col.title || 'Grade')}</span>
                <span style="font-weight: 700; font-size: 0.8rem; color: var(--ink-muted); margin-top: 3px;">${col.date}</span>
                <span style="font-weight: 800; font-size: 0.68rem; text-transform: uppercase; color: var(--orange); margin-top: 2px; letter-spacing: 0.5px;">(Drafting)</span>
              </div>
            </th>`;
          } else {
            const theme = this.getCategoryTheme(col.title);
            const isFirst = (idx === 0);
            const isLast = (idx === gradeCols.length - 1);

            const editControlsHTML = isEdit
              ? `<div style="display: flex; gap: 4px; align-items: center; justify-content: center; margin-bottom: 3px;">
                  <button class="col-move-btn" onclick="event.stopPropagation(); app.moveGradeColumn('${col.id}', 'left')" title="Move Left" ${isFirst ? 'disabled' : ''}>◀</button>
                  <button class="delete-date-col-btn" onclick="event.stopPropagation(); app.deleteGradeColumn('${col.id}')" title="Delete Column">&times;</button>
                  <button class="col-move-btn" onclick="event.stopPropagation(); app.moveGradeColumn('${col.id}', 'right')" title="Move Right" ${isLast ? 'disabled' : ''}>▶</button>
                </div>`
              : '';

            const dragAttrs = isEdit
              ? `draggable="true" ondragstart="app.handleGradeColDragStart(event, ${idx})" ondragover="app.handleGradeColDragOver(event)" ondragenter="app.handleGradeColDragEnter(event)" ondragleave="app.handleGradeColDragLeave(event)" ondrop="app.handleGradeColDrop(event, ${idx})" class="grade-col-header"`
              : '';

            const colTitleAttr = isEdit ? 'title="Drag to reorder column or use ◀ ▶ buttons"' : '';

            html += `<th style="background-color: ${theme.bgCell}; border-bottom: 2px solid ${theme.border};" ${dragAttrs} ${colTitleAttr}>
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.25; padding: 4px 2px;">
                ${editControlsHTML}
                <span style="font-weight: 800; font-size: 0.85rem; color: ${theme.color}; background: ${theme.bgHeader}; padding: 2px 8px; border-radius: 12px; border: 1px solid ${theme.border}; font-family: inherit;">${this.escapeHtml(col.title || 'Grade')}</span>
                <span style="font-weight: 700; font-size: 0.8rem; color: var(--ink); margin-top: 3px;">${col.date}</span>
              </div>
            </th>`;
          }
        });
        html += '</tr></thead>';

        html += '<tbody>';
        if (classList.length === 0) {
          html += `<tr><td colspan="${displayGradeCols.length + 1}" style="text-align: center; color: var(--text-muted); font-style: italic; padding: 24px;">No students in this class list</td></tr>`;
        } else {
          classList.forEach(student => {
            const profile = this.getStudentProfile(currentClass, student);
            const fullName = (profile.lastName && profile.lastName.trim())
              ? `${profile.firstName} ${profile.lastName}`
              : (profile.firstName || student);

            const showGradesRatio = (this.showGradesAttendanceIndicators !== false) && (currentClass ? (currentClass.showGradesAttendanceRatio !== false) : true);
            const ratioText = showGradesRatio ? this.getStudentAttendanceRatio(currentClass, student) : '';
            const ratioHTML = showGradesRatio ? `<span class="register-ratio">${ratioText}</span>` : '';
            let gradeCellsHTML = '';

            displayGradeCols.forEach(col => {
              const gradeVal = (col.grades && col.grades[student] !== undefined) ? col.grades[student] : '';
              const attRecord = this.getAttendanceRecordForDate(currentClass, col.date);
              const attStatus = attRecord ? (attRecord.statuses && attRecord.statuses[student]) : null;
              let attIndicatorHTML = '';
              let absentBgStyle = '';

              if (this.showGradesAttendanceIndicators !== false && attStatus) {
                if (attStatus === 'absent') {
                  attIndicatorHTML = `<span class="cell-att-indicator cell-att-absent" title="Absent on ${col.date}"></span>`;
                  absentBgStyle = 'background-color: #fef2f2 !important; ';
                } else if (attStatus === 'present') {
                  attIndicatorHTML = `<span class="cell-att-indicator cell-att-present" title="Present on ${col.date}"></span>`;
                }
              }

              if (col.isDraft) {
                const isStandards = (col.gradingStyle === 'standards') || (!col.gradingStyle && this.getGradingStyle(currentClass) === 'standards');
                const isPoints = (col.gradingStyle === 'points') || (!col.gradingStyle && this.getGradingStyle(currentClass) === 'points');
                if (isPoints) {
                  const maxPts = col.maxPoints || 10;
                  let cellContent = '';
                  if (gradeVal !== '' && gradeVal !== null && gradeVal !== undefined && !isNaN(Number(gradeVal))) {
                    const earned = Number(gradeVal);
                    const pct = Math.round((earned / maxPts) * 100);
                    cellContent = `<button type="button" class="points-badge-btn points-badge-scored" onclick="event.stopPropagation(); app.openPointsEntryModal('${this.escapeQuotes(student)}', 'draft')">${earned}/${maxPts} <span class="points-badge-pct">(${pct}%)</span></button>`;
                  } else {
                    cellContent = `<button type="button" class="points-badge-btn points-badge-unscored" onclick="event.stopPropagation(); app.openPointsEntryModal('${this.escapeQuotes(student)}', 'draft')">? / ${maxPts}</button>`;
                  }
                  gradeCellsHTML += `<td style="background-color: var(--paper-2); border: 1px solid var(--line-strong); text-align: center; padding: 6px 4px; border-left: 2px dashed var(--line-strong); border-right: 2px dashed var(--line-strong); position: relative; ${absentBgStyle}">
                    ${attIndicatorHTML}
                    ${cellContent}
                  </td>`;
                } else if (isStandards) {
                  const is4 = (String(gradeVal) === '4');
                  const is3 = (String(gradeVal) === '3');
                  const is2 = (String(gradeVal) === '2');
                  const is1 = (String(gradeVal) === '1');
                  gradeCellsHTML += `<td style="background-color: var(--paper-2); border: 1px solid var(--line-strong); text-align: center; padding: 6px 4px; border-left: 2px dashed var(--line-strong); border-right: 2px dashed var(--line-strong); position: relative; ${absentBgStyle}">
                    ${attIndicatorHTML}
                    <div class="standards-score-controls" style="justify-content: center; display: inline-flex; gap: 3px;">
                      <button type="button" class="standards-btn standards-btn-4 ${is4 ? 'active-4' : ''}" onclick="event.stopPropagation(); app.recordDraftGradeScore('${this.escapeQuotes(student)}', '4')" title="4 - Advanced (Yellow)">4</button>
                      <button type="button" class="standards-btn standards-btn-3 ${is3 ? 'active-3' : ''}" onclick="event.stopPropagation(); app.recordDraftGradeScore('${this.escapeQuotes(student)}', '3')" title="3 - Proficient (Green)">3</button>
                      <button type="button" class="standards-btn standards-btn-2 ${is2 ? 'active-2' : ''}" onclick="event.stopPropagation(); app.recordDraftGradeScore('${this.escapeQuotes(student)}', '2')" title="2 - Approaching (Orange)">2</button>
                      <button type="button" class="standards-btn standards-btn-1 ${is1 ? 'active-1' : ''}" onclick="event.stopPropagation(); app.recordDraftGradeScore('${this.escapeQuotes(student)}', '1')" title="1 - Beginning (Red)">1</button>
                    </div>
                  </td>`;
                } else {
                  const isCheck = (gradeVal === 'check' || gradeVal === 'plus');
                  const isStar = (gradeVal === 'star');
                  const isMinus = (gradeVal === 'minus');
                  const isX = (gradeVal === 'x');

                  gradeCellsHTML += `<td style="background-color: var(--paper-2); border: 1px solid var(--line-strong); text-align: center; padding: 6px 4px; border-left: 2px dashed var(--line-strong); border-right: 2px dashed var(--line-strong); position: relative; ${absentBgStyle}">
                    ${attIndicatorHTML}
                    <div class="grade-score-controls" style="justify-content: center;">
                      <button class="grade-score-btn grade-btn-plus ${isCheck ? 'active-check' : (isStar ? 'active-star' : '')}" onclick="event.stopPropagation(); app.recordDraftGradeScore('${this.escapeQuotes(student)}', 'plus')" title="Click for Plus (+), click again for Gold Star (★)">${isStar ? '★' : '+'}</button>
                      <button class="grade-score-btn grade-btn-minus ${isMinus ? 'active-minus' : (isX ? 'active-x' : '')}" onclick="event.stopPropagation(); app.recordDraftGradeScore('${this.escapeQuotes(student)}', 'minus')" title="Click for Minus (−), double-click for X (✕)">${isX ? '✕' : '−'}</button>
                    </div>
                  </td>`;
                }
              } else {
                const theme = this.getCategoryTheme(col.title);
                const isPoints = (col.gradingStyle === 'points') || (!col.gradingStyle && col.maxPoints !== undefined);
                let symbolHTML = '';

                if (isPoints) {
                  if (gradeVal !== '' && gradeVal !== null && gradeVal !== undefined && !isNaN(Number(gradeVal))) {
                    const earned = Number(gradeVal);
                    const maxPts = Number(col.maxPoints || 10);
                    const pct = Math.round((earned / maxPts) * 100);
                    symbolHTML = `<span style="font-weight: 700; font-size: 0.88rem; color: var(--ink); white-space: nowrap;">${earned}/${maxPts} <span style="font-size: 0.8rem; font-weight: 600; color: var(--ink-muted);">(${pct}%)</span></span>`;
                  } else {
                    symbolHTML = `<span style="color: var(--line-strong); font-weight: bold;">—</span>`;
                  }
                } else if (String(gradeVal) === '4') {
                  symbolHTML = `<span class="standards-grade-badge grade-standards-4" title="4 - Advanced">4</span>`;
                } else if (String(gradeVal) === '3') {
                  symbolHTML = `<span class="standards-grade-badge grade-standards-3" title="3 - Proficient">3</span>`;
                } else if (String(gradeVal) === '2') {
                  symbolHTML = `<span class="standards-grade-badge grade-standards-2" title="2 - Approaching">2</span>`;
                } else if (String(gradeVal) === '1') {
                  symbolHTML = `<span class="standards-grade-badge grade-standards-1" title="1 - Beginning">1</span>`;
                } else if (gradeVal === 'star') {
                  symbolHTML = `<span class="grade-status-star" title="Gold Star (★)">★</span>`;
                } else if (gradeVal === 'check' || gradeVal === 'plus') {
                  symbolHTML = `<span class="grade-status-plus" title="Exceeds / Pass (+)">+</span>`;
                } else if (gradeVal === 'minus') {
                  symbolHTML = `<span class="grade-status-minus" title="Needs Work / Minus (−)">−</span>`;
                } else if (gradeVal === 'x') {
                  symbolHTML = `<span class="grade-status-x" title="Incomplete / Unsatisfactory (✕)">✕</span>`;
                } else {
                  symbolHTML = ``;
                }

                const cellClass = isEdit ? 'grade-cell-interactive' : 'grade-cell-readonly';
                const cellOnClick = isEdit ? `onclick="app.cycleStudentGrade(app.getCurrentClass(), '${col.id}', '${app.escapeQuotes(student)}')"` : '';
                const cellTitle = isEdit ? (isPoints ? 'Click to edit points' : 'Click to change grade') : '';

                gradeCellsHTML += `<td class="${cellClass}" style="background-color: ${theme.bgCell}; border: 1px solid ${theme.border}; cursor: ${isEdit ? 'pointer' : 'default'}; position: relative; ${absentBgStyle}" ${cellOnClick} title="${cellTitle}">
                  ${attIndicatorHTML}
                  ${symbolHTML}
                </td>`;
              }
            });

            html += `<tr><td><div style="display: flex; align-items: center; gap: 8px;"><span class="register-name">${this.escapeHtml(fullName)}</span>${ratioHTML}</div></td>${gradeCellsHTML}</tr>`;
          });
        }
        html += '</tbody>';

        table.innerHTML = html;

        // Bind column hover highlighting for spreadsheet crosshair effect
        if (!table.dataset.hoverBound) {
          table.dataset.hoverBound = 'true';
          table.addEventListener('mouseover', (e) => {
            const td = e.target.closest('td, th');
            if (!td || !td.parentElement) return;
            const colIndex = td.cellIndex;
            if (colIndex === 0) return;

            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
              const cell = row.children[colIndex];
              if (cell) cell.classList.add('column-hover');
            });
          });

          table.addEventListener('mouseout', (e) => {
            const td = e.target.closest('td, th');
            if (!td) return;
            const cells = table.querySelectorAll('.column-hover');
            cells.forEach(cell => cell.classList.remove('column-hover'));
          });
        }
      }

      switchClass(classId) {
        this.gardenEditClassId = null;
        this.currentClassId = classId;
        this.saveData();
        this.renderClassDropdown();
        this.render();
        if (this.currentViewMode === 'attendance') {
          this.renderAttendanceTable();
        } else if (this.currentViewMode === 'grades') {
          this.renderGradesTable();
        }
      }

      openEditClassesModal() {
        this.tempClasses = JSON.parse(JSON.stringify(this.classes));
        document.getElementById('modalAddClassName').value = '';
        this.renderModalClassesList();
        document.getElementById('editClassesModal').classList.add('active');
      }

      renderModalClassesList() {
        const container = document.getElementById('modalClassesList');
        container.innerHTML = '';

        if (this.tempClasses.length === 0) {
          container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 8px; text-align: center;">No classes available. Add a class above.</div>';
          return;
        }

        this.tempClasses.forEach((c, idx) => {
          const item = document.createElement('div');
          item.style.display = 'flex';
          item.style.alignItems = 'center';
          item.style.gap = '8px';
          item.style.background = 'white';
          item.style.padding = '6px 10px';
          item.style.border = '1px solid var(--border-color)';
          item.style.borderRadius = '6px';

          item.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <button class="btn btn-outline" style="padding: 1px 6px; font-size: 0.75rem;" onclick="app.moveModalClass(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>▲</button>
              <button class="btn btn-outline" style="padding: 1px 6px; font-size: 0.75rem;" onclick="app.moveModalClass(${idx}, 1)" ${idx === this.tempClasses.length - 1 ? 'disabled' : ''}>▼</button>
            </div>
            <input type="text" value="${this.escapeHtml(c.name)}" style="flex: 1;" oninput="app.tempClasses[${idx}].name = this.value">
            <button class="btn" style="background: var(--danger); color: white; padding: 4px 8px;" onclick="app.deleteModalClass(${idx})" title="Delete Class">&times;</button>
          `;
          container.appendChild(item);
        });
      }

      moveModalClass(index, delta) {
        const targetIndex = index + delta;
        if (targetIndex >= 0 && targetIndex < this.tempClasses.length) {
          const item = this.tempClasses.splice(index, 1)[0];
          this.tempClasses.splice(targetIndex, 0, item);
          this.renderModalClassesList();
        }
      }

      deleteModalClass(index) {
        if (confirm(`Are you sure you want to delete "${this.tempClasses[index].name}"?`)) {
          this.tempClasses.splice(index, 1);
          this.renderModalClassesList();
        }
      }

      // + Add Class (or Enter): the new class goes at the top of the list; Confirm saves it without
      // switching to it
      addClassFromModal() {
        const nameInput = document.getElementById('modalAddClassName');
        const name = nameInput.value.trim();
        if (!name) {
          alert('Please enter a class name.');
          return;
        }

        this.tempClasses.unshift(this.makeNewModalClass(name));
        nameInput.value = '';
        this.renderModalClassesList();
      }

      makeNewModalClass(name) {
        return {
          id: 'class-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
          name: name,
          layout: 'rows',
          rowsCount: 4,
          rowAlignment: 'center',
          showFirstName: true,
          showLastName: false,
          showFaces: true,
          rows: Array.from({ length: 4 }, () => []),
          circle: [],
          layoutsData: {
            half: [[], []],
            third: [[], [], []],
            fourth: [[], [], [], []],
            fifth: [[], [], [], [], []]
          },
          containerHeights: {}
        };
      }

      saveEditedClasses() {
        // A name typed but not added yet: Confirm creates that class at the top and opens it
        const nameInput = document.getElementById('modalAddClassName');
        const pendingName = nameInput ? nameInput.value.trim() : '';

        if (this.tempClasses.length === 0 && !pendingName) {
          alert('You must have at least one class.');
          return;
        }

        if (this.tempClasses.some(c => !c.name.trim())) {
          alert('Class names cannot be empty.');
          return;
        }

        let openId = null;
        if (pendingName) {
          const newClass = this.makeNewModalClass(pendingName);
          this.tempClasses.unshift(newClass);
          openId = newClass.id;
          nameInput.value = '';
        }

        this.classes = JSON.parse(JSON.stringify(this.tempClasses));
        if (openId) this.currentClassId = openId;
        if (!this.classes.some(c => c.id === this.currentClassId)) {
          this.currentClassId = this.classes[0].id;
        }

        this.saveData();
        this.closeModal('editClassesModal');
        if (openId) {
          this.switchClass(openId);
        } else {
          this.renderClassDropdown();
          this.render();
        }
      }

      // =========================================================================
      // Schedule Section & Timetable Management
      // =========================================================================

      parseTimeSlot(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return 9999;
        const cleaned = timeStr.trim().toLowerCase();
        const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
        if (!match) return 9999;
        let hours = parseInt(match[1], 10);
        const minutes = match[2] ? parseInt(match[2], 10) : 0;
        const meridian = match[3] ? match[3].toLowerCase() : null;

        if (meridian === 'pm' && hours < 12) hours += 12;
        if (meridian === 'am' && hours === 12) hours = 0;
        if (!meridian) {
          if (hours >= 1 && hours <= 6) hours += 12;
        }
        return hours * 60 + minutes;
      }

      generateNextTimeBlock(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return '9:00-9:30';

        const parts = timeStr.split(/[-–—]/);
        let endStr = (parts.length > 1 ? parts[1] : parts[0]).trim();

        const match = endStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
        if (!match) return '9:00-9:30';

        let hours = parseInt(match[1], 10);
        let minutes = match[2] ? parseInt(match[2], 10) : 0;
        let meridian = match[3] ? match[3].toUpperCase() : '';

        const startFormatted = `${hours}:${minutes.toString().padStart(2, '0')}${meridian ? ' ' + meridian : ''}`;

        let nextMinutes = minutes + 30;
        let nextHours = hours;
        if (nextMinutes >= 60) {
          nextHours += Math.floor(nextMinutes / 60);
          nextMinutes = nextMinutes % 60;
        }

        if (nextHours > 12 && (!meridian || meridian === 'PM')) {
          if (nextHours > 12) nextHours = nextHours % 12 || 12;
        } else if (nextHours === 12 && meridian === 'AM') {
          meridian = 'PM';
        }

        const endFormatted = `${nextHours}:${nextMinutes.toString().padStart(2, '0')}${meridian ? ' ' + meridian : ''}`;
        return `${startFormatted}-${endFormatted}`;
      }

      initScheduleTimeBlocks() {
        this.scheduleTimeBlocks = [
          { id: 'tb_' + Date.now(), time: '8:30-9:00' }
        ];
        this.isScheduleEditMode = true;
        this.updateScheduleEditButtonUI();
        this.saveData();
        this.renderScheduleTable();

        setTimeout(() => {
          const firstInput = document.getElementById('timeBlockInput_0');
          if (firstInput) {
            firstInput.focus();
            firstInput.select();
          }
        }, 60);
      }

      toggleScheduleEditMode() {
        this.isScheduleEditMode = !this.isScheduleEditMode;
        this.updateScheduleEditButtonUI();
        this.renderScheduleTable();
      }

      updateScheduleEditButtonUI() {
        const headerBtn = document.getElementById('headerEditScheduleBtn');
        const fsBtn = document.getElementById('fullscreenEditScheduleBtn');
        [headerBtn, fsBtn].forEach(btn => {
          if (!btn) return;
          if (this.isScheduleEditMode) {
            btn.textContent = 'DONE';
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
          } else {
            btn.textContent = 'EDIT';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
          }
        });
      }

      formatMinutesToTimeString(totalMins, useMeridian = false) {
        let hours = Math.floor(totalMins / 60);
        const minutes = totalMins % 60;
        let meridian = '';
        if (useMeridian) {
          meridian = hours >= 12 ? ' PM' : ' AM';
        }
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${hours}:${minutes.toString().padStart(2, '0')}${meridian}`;
      }

      getTimeBlockEndStr(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return '';
        const parts = timeStr.split(/[-–—]/);
        return (parts.length > 1 ? parts[1] : parts[0]).trim();
      }

      getTimeBlockStartStr(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return '';
        const parts = timeStr.split(/[-–—]/);
        return parts[0].trim();
      }

      generateTimeBlockForGap(currentBlockTime, nextBlockTime) {
        const currentEndStr = this.getTimeBlockEndStr(currentBlockTime);
        const nextStartStr = this.getTimeBlockStartStr(nextBlockTime);

        if (!currentEndStr || !nextStartStr) return null;

        const currentEndMins = this.parseTimeSlot(currentEndStr);
        const nextStartMins = this.parseTimeSlot(nextStartStr);

        if (currentEndMins === 9999 || nextStartMins === 9999) {
          if (currentEndStr.toLowerCase() === nextStartStr.toLowerCase()) {
            return null;
          }
          return this.generateNextTimeBlock(currentBlockTime);
        }

        const diff = nextStartMins - currentEndMins;
        if (diff <= 0) return null;

        const hasMeridian = /[ap]m/i.test(currentBlockTime) || /[ap]m/i.test(nextBlockTime);

        if (diff <= 30) {
          const startFormatted = this.formatMinutesToTimeString(currentEndMins, hasMeridian);
          const endFormatted = this.formatMinutesToTimeString(nextStartMins, hasMeridian);
          return `${startFormatted}-${endFormatted}`;
        } else {
          return this.generateNextTimeBlock(currentBlockTime);
        }
      }

      confirmTimeBlockAndAddNext(idx, val) {
        if (!Array.isArray(this.scheduleTimeBlocks) || !this.scheduleTimeBlocks[idx]) return;
        const currentVal = (typeof val === 'string' && val.trim()) ? val.trim() : this.scheduleTimeBlocks[idx].time;
        this.scheduleTimeBlocks[idx].time = currentVal;

        let shouldFocusIdx = null;

        if (idx === this.scheduleTimeBlocks.length - 1) {
          // Last block: generate next 30-min block at end
          const nextTime = this.generateNextTimeBlock(currentVal);
          this.scheduleTimeBlocks.push({
            id: 'tb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            time: nextTime
          });
          shouldFocusIdx = this.scheduleTimeBlocks.length - 1;
        } else {
          // Intermediate block: check if there is a gap before the next block
          const nextBlock = this.scheduleTimeBlocks[idx + 1];
          const newBlockTime = this.generateTimeBlockForGap(currentVal, nextBlock ? nextBlock.time : '');

          if (newBlockTime) {
            // Gap found: insert new block in between at idx + 1
            this.scheduleTimeBlocks.splice(idx + 1, 0, {
              id: 'tb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              time: newBlockTime
            });
            shouldFocusIdx = idx + 1;
          } else {
            // No gap available between current end and next start
            this.saveData();
            return;
          }
        }

        this.saveData();
        this.renderScheduleTable();

        if (shouldFocusIdx !== null) {
          setTimeout(() => {
            const nextInput = document.getElementById(`timeBlockInput_${shouldFocusIdx}`);
            if (nextInput) {
              nextInput.focus();
              nextInput.select();
            }
          }, 60);
        }
      }

      updateTimeBlockValue(idx, val) {
        if (!Array.isArray(this.scheduleTimeBlocks) || !this.scheduleTimeBlocks[idx]) return;
        this.scheduleTimeBlocks[idx].time = (val || '').trim();
        this.saveData();
      }

      deleteTimeBlock(idx) {
        if (!Array.isArray(this.scheduleTimeBlocks) || !this.scheduleTimeBlocks[idx]) return;
        this.scheduleTimeBlocks.splice(idx, 1);
        this.saveData();
        this.renderScheduleTable();
      }

      addTimeBlockAtEnd() {
        if (!Array.isArray(this.scheduleTimeBlocks) || this.scheduleTimeBlocks.length === 0) {
          this.initScheduleTimeBlocks();
          return;
        }
        const lastBlock = this.scheduleTimeBlocks[this.scheduleTimeBlocks.length - 1];
        const nextTime = this.generateNextTimeBlock(lastBlock.time);
        this.scheduleTimeBlocks.push({
          id: 'tb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          time: nextTime
        });
        this.saveData();
        this.renderScheduleTable();

        setTimeout(() => {
          const nextInput = document.getElementById(`timeBlockInput_${this.scheduleTimeBlocks.length - 1}`);
          if (nextInput) {
            nextInput.focus();
            nextInput.select();
          }
        }, 60);
      }

      clearAllScheduleTimeBlocks() {
        if (confirm('Are you sure you want to clear all time blocks and reset the schedule?')) {
          this.scheduleTimeBlocks = [];
          this.isScheduleEditMode = false;
          this.updateScheduleEditButtonUI();
          this.saveData();
          this.renderScheduleTable();
        }
      }

      getClassPalette() {
        return [
          { key: 'black', name: 'Jet Black', hex: '#111827', bg: '#F3F4F6', border: '#D1D5DB', text: '#111827' },
          { key: 'electric_blue', name: 'Electric Blue', hex: '#0055FF', bg: '#EFF6FF', border: '#93C5FD', text: '#0040D0' },
          { key: 'fire_red', name: 'Fire Red', hex: '#DC2626', bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' },
          { key: 'emerald', name: 'Emerald Green', hex: '#059669', bg: '#ECFDF5', border: '#A7F3D0', text: '#059669' },
          { key: 'electric_purple', name: 'Electric Purple', hex: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', text: '#7C3AED' },
          { key: 'amber_gold', name: 'Warm Amber / Gold', hex: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: '#D97706' },
          { key: 'neon_teal', name: 'Neon Teal / Cyan', hex: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC', text: '#0891B2' },
          { key: 'hot_magenta', name: 'Hot Magenta / Fuchsia', hex: '#C026D3', bg: '#FDF4FF', border: '#F5D0FE', text: '#C026D3' },
          { key: 'tangerine', name: 'Tangerine Orange', hex: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C' },
          { key: 'olive_chartreuse', name: 'Olive / Chartreuse Green', hex: '#65A30D', bg: '#F7FEE7', border: '#D9F99D', text: '#4D7C0F' },
          { key: 'slate_gray', name: 'Medium Slate Gray', hex: '#64748B', bg: '#F8FAFC', border: '#CBD5E1', text: '#334155' },
          { key: 'burgundy', name: 'Deep Wine / Burgundy', hex: '#881337', bg: '#FFF1F2', border: '#FECDD3', text: '#881337' }
        ];
      }

      hexToRgba(hex, alpha = 1) {
        if (!hex || typeof hex !== 'string') return 'rgba(5, 150, 105, ' + alpha + ')';
        let c = hex.replace('#', '').trim();
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        if (isNaN(num)) return hex;
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }

      getClassColorTheme(colorHex) {
        const palette = this.getClassPalette();
        const found = palette.find(p => p.hex.toLowerCase() === (colorHex || '').toLowerCase() || p.key === colorHex);
        if (found) return found;
        const hex = colorHex || '#059669';
        return {
          key: 'custom',
          name: 'Custom',
          hex: hex,
          bg: this.hexToRgba(hex, 0.12),
          border: this.hexToRgba(hex, 0.38),
          text: hex
        };
      }

      getCombinedTimeRange(startBlockIdx, blockCount = 1) {
        const blocks = Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : [];
        if (startBlockIdx < 0 || startBlockIdx >= blocks.length) return '';
        const startTb = blocks[startBlockIdx];
        const startParts = (startTb.time || '').split(/[-–—]/);
        const startStr = startParts[0].trim();

        const endBlockIdx = Math.min(startBlockIdx + blockCount - 1, blocks.length - 1);
        const endTb = blocks[endBlockIdx];
        const endParts = (endTb.time || '').split(/[-–—]/);
        const endStr = endParts.length > 1 ? endParts[1].trim() : endParts[0].trim();

        return `${startStr}-${endStr}`;
      }

      findSlotStartBlockIdx(slot) {
        if (!slot) return -1;
        const blocks = Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : [];
        if (blocks.length === 0) return -1;
        if (typeof slot.startBlockIdx === 'number' && slot.startBlockIdx >= 0 && slot.startBlockIdx < blocks.length) {
          return slot.startBlockIdx;
        }
        if (!slot.time) return -1;
        const slotStart = slot.time.split(/[-–—]/)[0].trim().toLowerCase();
        return blocks.findIndex(b => {
          const bStart = (b.time || '').split(/[-–—]/)[0].trim().toLowerCase();
          return bStart === slotStart;
        });
      }

      findClassStartBlockIdx(c, scheduleId = null) {
        if (!c) return -1;
        const slots = this.getClassScheduleSlots(c, scheduleId || this.currentScheduleId);
        if (Array.isArray(slots) && slots[0]) {
          return this.findSlotStartBlockIdx(slots[0]);
        }
        const blocks = Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : [];
        if (blocks.length === 0) return -1;
        if (typeof c.scheduleStartBlockIdx === 'number' && c.scheduleStartBlockIdx >= 0 && c.scheduleStartBlockIdx < blocks.length) {
          return c.scheduleStartBlockIdx;
        }
        if (!c.scheduleTime) return -1;
        const cStart = c.scheduleTime.split(/[-–—]/)[0].trim().toLowerCase();
        return blocks.findIndex(b => {
          const bStart = (b.time || '').split(/[-–—]/)[0].trim().toLowerCase();
          return bStart === cStart;
        });
      }

      toggleCalendarSync() {
        this.isCalendarSyncEnabled = !this.isCalendarSyncEnabled;
        this.calendarSyncWeekOffset = 0; // Reset back to current week whenever toggled
        this.saveData();
        this.updateCalendarSyncUI();
        this.renderScheduleTable();
      }

      changeCalendarSyncWeek(delta) {
        this.calendarSyncWeekOffset = (this.calendarSyncWeekOffset || 0) + delta;
        this.renderScheduleTable();
      }

      updateCalendarSyncUI() {
        const btn = document.getElementById('btnToggleCalendarSync');
        const badge = document.getElementById('calendarSyncBadge');
        if (!btn) return;
        if (this.isCalendarSyncEnabled) {
          btn.classList.add('active');
          if (badge) {
            badge.textContent = 'ON';
            badge.style.background = 'var(--blue)';
            badge.style.color = '#ffffff';
          }
        } else {
          btn.classList.remove('active');
          if (badge) {
            badge.textContent = 'OFF';
            badge.style.background = 'var(--line)';
            badge.style.color = 'var(--ink-muted)';
          }
        }
      }

      getScheduleCalendarDates() {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
        
        let mondayOffset = 0;
        if (dayOfWeek === 0) { // Sunday -> next week's Monday (+1 day)
          mondayOffset = 1;
        } else if (dayOfWeek === 6) { // Saturday -> next week's Monday (+2 days)
          mondayOffset = 2;
        } else { // Monday to Friday -> current week's Monday
          mondayOffset = -(dayOfWeek - 1);
        }

        const weekOffsetDays = (this.calendarSyncWeekOffset || 0) * 7;
        const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset + weekOffsetDays);

        const DAYS = [
          { key: 'Monday', label: 'Monday', short: 'Mon' },
          { key: 'Tuesday', label: 'Tuesday', short: 'Tue' },
          { key: 'Wednesday', label: 'Wednesday', short: 'Wed' },
          { key: 'Thursday', label: 'Thursday', short: 'Thu' },
          { key: 'Friday', label: 'Friday', short: 'Fri' }
        ];

        return DAYS.map((d, idx) => {
          const dayDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + idx);
          const dateStr = `${dayDate.getMonth() + 1}/${dayDate.getDate()}`;
          const yyyy = dayDate.getFullYear();
          const mm = String(dayDate.getMonth() + 1).padStart(2, '0');
          const dd = String(dayDate.getDate()).padStart(2, '0');
          const isoDate = `${yyyy}-${mm}-${dd}`;
          const isToday = (
            dayDate.getFullYear() === now.getFullYear() &&
            dayDate.getMonth() === now.getMonth() &&
            dayDate.getDate() === now.getDate()
          );
          return {
            ...d,
            dateStr: dateStr,
            fullDate: isoDate,
            dayDate: dayDate,
            isToday: isToday
          };
        });
      }

      renderScheduleTable() {
        const table = document.getElementById('scheduleTable');
        if (!table) return;

        const DAYS = this.getScheduleCalendarDates();
        const activeSched = this.getCurrentSchedule();
        const timeBlocks = Array.isArray(activeSched.timeBlocks) ? activeSched.timeBlocks : (this.scheduleTimeBlocks || []);
        this.scheduleTimeBlocks = timeBlocks;

        let html = `
          <thead>
            <tr>
              <th style="width: 175px; min-width: 160px; text-align: center;">Time</th>
              ${DAYS.map(d => {
                if (this.isCalendarSyncEnabled) {
                  const todayThClass = d.isToday ? ' schedule-today-th' : '';
                  const badgeStyle = d.isToday ? 'background: #2563eb; color: #ffffff;' : 'background: #e2e8f0; color: #475569;';
                  
                  let headerInnerHtml = '';
                  if (d.key === 'Monday') {
                    headerInnerHtml = `
                      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 4px;">
                        <button type="button" class="btn-schedule-week-nav" onclick="event.stopPropagation(); app.changeCalendarSyncWeek(-1)" title="Previous Week">‹</button>
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; flex: 1;">
                          <span style="font-size: 0.8rem; font-weight: 800; padding: 1px 8px; border-radius: 10px; ${badgeStyle}">${d.dateStr}</span>
                          <span style="font-size: 0.95rem; font-weight: ${d.isToday ? '800' : '700'}; color: ${d.isToday ? 'var(--blue-dark)' : 'var(--ink)'};">${d.label}</span>
                        </div>
                        <div style="width: 26px; flex-shrink: 0;"></div>
                      </div>
                    `;
                  } else if (d.key === 'Friday') {
                    headerInnerHtml = `
                      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 4px;">
                        <div style="width: 26px; flex-shrink: 0;"></div>
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; flex: 1;">
                          <span style="font-size: 0.8rem; font-weight: 800; padding: 1px 8px; border-radius: 10px; ${badgeStyle}">${d.dateStr}</span>
                          <span style="font-size: 0.95rem; font-weight: ${d.isToday ? '800' : '700'}; color: ${d.isToday ? 'var(--blue-dark)' : 'var(--ink)'};">${d.label}</span>
                        </div>
                        <button type="button" class="btn-schedule-week-nav" onclick="event.stopPropagation(); app.changeCalendarSyncWeek(1)" title="Next Week">›</button>
                      </div>
                    `;
                  } else {
                    headerInnerHtml = `
                      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 100%;">
                        <span style="font-size: 0.8rem; font-weight: 800; padding: 1px 8px; border-radius: 10px; ${badgeStyle}">${d.dateStr}</span>
                        <span style="font-size: 0.95rem; font-weight: ${d.isToday ? '800' : '700'}; color: ${d.isToday ? 'var(--blue-dark)' : 'var(--ink)'};">${d.label}</span>
                      </div>
                    `;
                  }

                  return `
                    <th class="${todayThClass}" style="width: 18%; min-width: 130px; text-align: center; vertical-align: middle; padding: 8px 6px;">
                      ${headerInnerHtml}
                    </th>
                  `;
                } else {
                  return `<th style="width: 18%; min-width: 130px; text-align: center;">${d.label}</th>`;
                }
              }).join('')}
            </tr>
          </thead>
          <tbody>
        `;

        if (timeBlocks.length === 0) {
          html += `
            <tr>
              <td colspan="6" style="padding: 60px 20px; text-align: center; color: var(--ink-muted); font-size: 1rem; background: var(--paper-2);">
                <div style="font-size: 2.6rem; margin-bottom: 12px;">🗓️</div>
                <div style="font-weight: 800; font-size: 1.25rem; color: var(--ink); margin-bottom: 8px;">Welcome to Your Weekly Schedule</div>
                <div style="font-size: 0.95rem; color: var(--ink-muted); margin-bottom: 22px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.5;">
                  Start by creating your blocks of time. Click below to begin with <strong>8:30-9:00</strong> and customize your daily time slots for <strong>${this.escapeHtml(activeSched.name)}</strong>.
                </div>
                <button type="button" class="btn btn-primary" style="font-weight: 800; font-size: 1rem; padding: 12px 28px; border-radius: 8px; box-shadow: 0 2px 6px rgba(37,99,235,0.3);" onclick="app.initScheduleTimeBlocks()">
                  + Set Up Time Blocks
                </button>
              </td>
            </tr>
          `;
        } else {
          const skippedCells = {};
          DAYS.forEach(d => { skippedCells[d.key] = new Set(); });

          timeBlocks.forEach((tb, rowIdx) => {
            const timeSlot = (tb.time || '').trim();
            html += `<tr>`;
            if (this.isScheduleEditMode) {
              html += `
                <td class="schedule-time-cell">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                    <input 
                      type="text" 
                      id="timeBlockInput_${rowIdx}" 
                      value="${this.escapeHtml(timeSlot)}" 
                      class="schedule-time-input" 
                      placeholder="e.g. 8:30-9:00"
                      onchange="app.updateTimeBlockValue(${rowIdx}, this.value)"
                      onkeydown="if(event.key === 'Enter') { event.preventDefault(); app.confirmTimeBlockAndAddNext(${rowIdx}, this.value); }"
                    >
                    <button 
                      type="button" 
                      class="btn-time-enter" 
                      onclick="app.confirmTimeBlockAndAddNext(${rowIdx}, document.getElementById('timeBlockInput_${rowIdx}').value)" 
                      title="Save and create next 30-min block (Enter)"
                    >↵</button>
                    <button 
                      type="button" 
                      class="btn-time-delete" 
                      onclick="app.deleteTimeBlock(${rowIdx})" 
                      title="Delete time block"
                    >&times;</button>
                  </div>
                </td>
              `;
            } else {
              html += `
                <td class="schedule-time-cell" style="padding: 10px 14px; text-align: center; background: var(--paper);">
                  <span style="font-weight: 700; font-size: 0.95rem; color: var(--ink);">${this.escapeHtml(timeSlot)}</span>
                </td>
              `;
            }

            DAYS.forEach(day => {
              if (skippedCells[day.key].has(rowIdx)) {
                return;
              }

              const isTodayColumn = (this.isCalendarSyncEnabled && day.isToday);
              const cellHighlightClass = isTodayColumn ? ' schedule-today-cell' : '';
              const todayCellStyle = isTodayColumn ? 'border-left: 1.5px solid #bfdbfe; border-right: 1.5px solid #bfdbfe;' : '';

              const matchingSlotEntries = [];
              (this.classes || []).forEach(c => {
                const slots = this.getClassScheduleSlots(c, activeSched.id);

                slots.forEach(slot => {
                  const days = Array.isArray(slot.days) ? slot.days : [];
                  const dayMatches = days.some(d => d.toLowerCase() === day.key.toLowerCase() || d.toLowerCase() === day.short.toLowerCase());
                  if (!dayMatches) return;

                  const startIdx = (typeof slot.startBlockIdx === 'number' && slot.startBlockIdx >= 0) ? slot.startBlockIdx : this.findSlotStartBlockIdx(slot);
                  const isStart = (startIdx >= 0) ? (startIdx === rowIdx) : (slot.time && slot.time.trim() === timeSlot);
                  if (isStart) {
                    matchingSlotEntries.push({ c: c, slot: slot });
                  }
                });
              });

              if (matchingSlotEntries.length > 0) {
                const maxSpan = Math.max(...matchingSlotEntries.map(entry => Math.max(1, entry.slot.blockCount || 1)));
                const clampedSpan = Math.min(maxSpan, timeBlocks.length - rowIdx);

                for (let r = 1; r < clampedSpan; r++) {
                  skippedCells[day.key].add(rowIdx + r);
                }

                const rowspanAttr = clampedSpan > 1 ? ` rowspan="${clampedSpan}"` : '';

                html += `<td${rowspanAttr} class="${cellHighlightClass}" style="text-align: center; vertical-align: middle; padding: 8px; ${todayCellStyle}">`;
                matchingSlotEntries.forEach(entry => {
                  const c = entry.c;
                  const isText = Boolean(c.isTextOnly || c.entryType === 'text');
                  const theme = this.getClassColorTheme(c.color);
                  const classNotes = this.getClassScheduleNotes(c, activeSched.id).filter(note => {
                    if (!note || !note.text) return false;
                    if (note.target === 'all') return true;
                    if (note.target === 'once') {
                      if (!note.date) return false;
                      if (day.fullDate && note.date === day.fullDate) return true;
                      const noteParts = String(note.date).split('-');
                      if (noteParts.length === 3 && day.dayDate) {
                        const ny = parseInt(noteParts[0], 10);
                        const nm = parseInt(noteParts[1], 10) - 1;
                        const nd = parseInt(noteParts[2], 10);
                        return day.dayDate.getFullYear() === ny && day.dayDate.getMonth() === nm && day.dayDate.getDate() === nd;
                      }
                      return false;
                    }
                    const noteDays = Array.isArray(note.days) ? note.days : [];
                    return noteDays.some(d => d.toLowerCase() === day.key.toLowerCase() || d.toLowerCase() === day.short.toLowerCase());
                  });

                  const clickAttr = isText ? '' : ` onclick="app.switchToClassFromSchedule('${c.id}')"`;
                  const cursorStyle = isText ? 'cursor: default;' : 'cursor: pointer;';
                  const titleAttr = isText ? `title="${this.escapeHtml(c.name)}"` : `title="Click to open ${this.escapeHtml(c.name)} in Seating Chart"`;

                  html += `
                    <div class="schedule-class-badge" style="background-color: ${theme.bg}; border-color: ${theme.border}; color: ${theme.text}; min-height: ${clampedSpan > 1 ? (clampedSpan * 52) + 'px' : 'auto'}; ${cursorStyle}" ${clickAttr} ${titleAttr}>
                      <span class="schedule-class-title" style="color: ${theme.text}; font-size: ${clampedSpan > 1 ? '1rem' : '0.92rem'};">${this.escapeHtml(c.name)}</span>
                      ${classNotes.map(n => `<span class="schedule-note-tag">${this.escapeHtml(n.text)}</span>`).join('')}
                    </div>
                  `;
                });
                html += `</td>`;
              } else {
                html += `<td class="${cellHighlightClass}" style="text-align: center; vertical-align: middle; padding: 8px; ${todayCellStyle}"><span style="color: var(--line-strong); font-size: 0.9rem; user-select: none;">—</span></td>`;
              }
            });

            html += `</tr>`;
          });
        }

        html += `</tbody>`;

        if (timeBlocks.length > 0 && this.isScheduleEditMode) {
          html += `
            <tfoot>
              <tr>
                <td style="padding: 8px 12px; text-align: center; background: var(--paper-2); border-top: 1.5px solid var(--line-strong);">
                  <button type="button" class="btn btn-outline" style="font-size: 0.8rem; font-weight: 700; padding: 4px 10px;" onclick="app.addTimeBlockAtEnd()" title="Add another 30-min time block">+ Add Block</button>
                </td>
                <td colspan="5" style="padding: 8px 12px; text-align: right; background: var(--paper-2); border-top: 1.5px solid var(--line-strong);">
                  <button type="button" style="background: none; border: none; color: var(--ink-faint); font-size: 0.78rem; font-weight: 600; cursor: pointer; text-decoration: underline;" onclick="app.clearAllScheduleTimeBlocks()">Reset Time Blocks</button>
                </td>
              </tr>
            </tfoot>
          `;
        }

        table.innerHTML = html;
      }

      switchToClassFromSchedule(classId) {
        const target = (this.classes || []).find(c => c.id === classId);
        if (!target || target.isTextOnly || target.entryType === 'text') return;
        this.switchClass(classId);
        this.switchViewMode('chart');
      }

      setScheduleEntryType(type) {
        this.tempScheduleEntryType = (type === 'text') ? 'text' : 'class';
        const classBtn = document.getElementById('toggleScheduleTypeClass');
        const textBtn = document.getElementById('toggleScheduleTypeText');
        const nameInput = document.getElementById('modalAddScheduleClassName');
        
        if (classBtn && textBtn) {
          if (this.tempScheduleEntryType === 'text') {
            classBtn.classList.remove('active');
            textBtn.classList.add('active');
            if (nameInput) nameInput.placeholder = 'Event name (e.g. Lunch, Prep, Duty, Meeting)...';
          } else {
            classBtn.classList.add('active');
            textBtn.classList.remove('active');
            if (nameInput) nameInput.placeholder = 'Class name (e.g. 3rd Grade Music)...';
          }
        }
      }

      populateNewClassTimeSelect() {
        const select = document.getElementById('modalAddScheduleTimeSelect');
        const minusBtn = document.getElementById('btnNewClassBlockMinus');
        if (!select) return;

        const blocks = Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : [];
        if (blocks.length === 0) {
          select.innerHTML = `<option value="-1">(No time blocks)</option>`;
          if (minusBtn) minusBtn.style.display = 'none';
          return;
        }

        const startIdx = (typeof this.tempNewClassStartBlockIdx === 'number' && this.tempNewClassStartBlockIdx >= 0 && this.tempNewClassStartBlockIdx < blocks.length) 
          ? this.tempNewClassStartBlockIdx 
          : 0;
        const blockCount = Math.max(1, this.tempNewClassBlockCount || 1);

        select.innerHTML = blocks.map((b, idx) => {
          const isSelected = (idx === startIdx);
          const label = (isSelected && blockCount > 1) 
            ? `${this.getCombinedTimeRange(idx, blockCount)}` 
            : b.time;
          return `<option value="${idx}" ${isSelected ? 'selected' : ''}>${label}</option>`;
        }).join('');

        if (minusBtn) {
          minusBtn.style.display = blockCount > 1 ? 'inline-flex' : 'none';
        }
      }

      onNewClassTimeSelectChange() {
        const select = document.getElementById('modalAddScheduleTimeSelect');
        if (!select) return;
        const val = parseInt(select.value, 10);
        this.tempNewClassStartBlockIdx = val;
        this.tempNewClassBlockCount = 1;
        this.populateNewClassTimeSelect();
      }

      increaseNewClassBlockSpan() {
        const blocks = Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : [];
        if (blocks.length === 0) return;
        const startIdx = (typeof this.tempNewClassStartBlockIdx === 'number' && this.tempNewClassStartBlockIdx >= 0) 
          ? this.tempNewClassStartBlockIdx 
          : 0;
        const currentCount = Math.max(1, this.tempNewClassBlockCount || 1);
        if (startIdx + currentCount < blocks.length) {
          this.tempNewClassBlockCount = currentCount + 1;
          this.tempNewClassStartBlockIdx = startIdx;
          this.populateNewClassTimeSelect();
        }
      }

      decreaseNewClassBlockSpan() {
        const currentCount = Math.max(1, this.tempNewClassBlockCount || 1);
        if (currentCount > 1) {
          this.tempNewClassBlockCount = currentCount - 1;
          this.populateNewClassTimeSelect();
        }
      }

      openManageScheduleModal() {
        this.tempSchedules = JSON.parse(JSON.stringify(this.schedules || []));
        this.tempSelectedScheduleId = this.currentScheduleId || (this.tempSchedules[0] ? this.tempSchedules[0].id : 'sched_regular');
        this.tempScheduleClasses = JSON.parse(JSON.stringify(this.classes || []));
        this.openScheduleNotesClassIndices = new Set();
        this.manuallyExpandedScheduleClassIndices = new Set();
        this.tempNewClassColor = '#059669';
        this.tempNewClassStartBlockIdx = 0;
        this.tempNewClassBlockCount = 1;

        this.setScheduleEntryType('class');

        const curSched = this.tempSchedules.find(s => s.id === this.tempSelectedScheduleId) || this.tempSchedules[0];
        this.scheduleTimeBlocks = curSched ? (curSched.timeBlocks || []) : [];

        // Ensure every class has an entry in c.schedules for the selected schedule
        (this.tempScheduleClasses || []).forEach(c => {
          if (!c.schedules) c.schedules = {};
          if (!c.schedules[this.tempSelectedScheduleId]) {
            c.schedules[this.tempSelectedScheduleId] = {
              scheduleSlots: JSON.parse(JSON.stringify(this.getClassScheduleSlots(c, this.tempSelectedScheduleId))),
              scheduleNotes: JSON.parse(JSON.stringify(this.getClassScheduleNotes(c, this.tempSelectedScheduleId)))
            };
          }
        });

        const nameInput = document.getElementById('modalAddScheduleClassName');
        const colorBtn = document.getElementById('modalAddScheduleColorBtn');
        if (nameInput) nameInput.value = '';
        if (colorBtn) colorBtn.style.backgroundColor = '#059669';

        this.populateManageScheduleTopBar();
        this.populateNewClassTimeSelect();

        const daysContainer = document.getElementById('modalAddScheduleDaysContainer');
        if (daysContainer) {
          daysContainer.querySelectorAll('.day-pill-btn').forEach(btn => btn.classList.remove('active'));
        }

        this.renderManageScheduleList();
        const modal = document.getElementById('manageScheduleModal');
        if (modal) modal.classList.add('active');
      }

      populateManageScheduleTopBar() {
        const modalSelect = document.getElementById('modalScheduleSelect');
        const btnDelete = document.getElementById('btnDeleteScheduleFromModal');
        if (modalSelect) {
          const optionsHtml = (this.tempSchedules || []).map(s => {
            const isSelected = (s.id === this.tempSelectedScheduleId);
            return `<option value="${s.id}" ${isSelected ? 'selected' : ''}>${this.escapeHtml(s.name)}</option>`;
          }).join('');
          modalSelect.innerHTML = optionsHtml;
          modalSelect.value = this.tempSelectedScheduleId;
        }
        if (btnDelete) {
          const canDelete = (this.tempSchedules && this.tempSchedules.length > 1);
          btnDelete.style.opacity = canDelete ? '1' : '0.4';
          btnDelete.style.cursor = canDelete ? 'pointer' : 'not-allowed';
          btnDelete.title = canDelete ? 'Delete current schedule' : 'Cannot delete the only schedule';
        }
      }

      switchManageScheduleModalSchedule(scheduleId) {
        if (!scheduleId || !this.tempSchedules.some(s => s.id === scheduleId)) return;
        this.tempSelectedScheduleId = scheduleId;
        const targetSched = this.tempSchedules.find(s => s.id === scheduleId);
        this.scheduleTimeBlocks = targetSched ? (targetSched.timeBlocks || []) : [];

        (this.tempScheduleClasses || []).forEach(c => {
          if (!c.schedules) c.schedules = {};
          if (!c.schedules[scheduleId]) {
            c.schedules[scheduleId] = {
              scheduleSlots: [{ id: 'slot_1', startBlockIdx: -1, blockCount: 1, time: '', days: [] }],
              scheduleNotes: []
            };
          }
        });

        this.populateManageScheduleTopBar();
        this.populateNewClassTimeSelect();
        this.renderManageScheduleList();
      }

      openAddScheduleDialog() {
        const input = document.getElementById('newScheduleNameInput');
        const chk = document.getElementById('chkCopyCurrentScheduleTimeBlocks');
        if (input) input.value = '';
        if (chk) chk.checked = true;
        const modal = document.getElementById('addSchedulePromptModal');
        if (modal) modal.classList.add('active');
        setTimeout(() => { if (input) input.focus(); }, 60);
      }

      confirmAddScheduleDialog() {
        const input = document.getElementById('newScheduleNameInput');
        const name = input ? input.value.trim() : '';
        if (!name) {
          alert('Please enter a schedule name.');
          return;
        }

        const shouldCopy = document.getElementById('chkCopyCurrentScheduleTimeBlocks') 
          ? document.getElementById('chkCopyCurrentScheduleTimeBlocks').checked 
          : true;

        const newId = 'sched_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
        const currentSched = this.tempSchedules.find(s => s.id === this.tempSelectedScheduleId);
        const copiedTimeBlocks = (shouldCopy && currentSched && Array.isArray(currentSched.timeBlocks))
          ? JSON.parse(JSON.stringify(currentSched.timeBlocks))
          : [];

        this.tempSchedules.push({
          id: newId,
          name: name,
          timeBlocks: copiedTimeBlocks
        });

        (this.tempScheduleClasses || []).forEach(c => {
          if (!c.schedules) c.schedules = {};
          if (shouldCopy) {
            c.schedules[newId] = {
              scheduleSlots: JSON.parse(JSON.stringify(this.getClassScheduleSlots(c, this.tempSelectedScheduleId))),
              scheduleNotes: JSON.parse(JSON.stringify(this.getClassScheduleNotes(c, this.tempSelectedScheduleId)))
            };
          } else {
            c.schedules[newId] = {
              scheduleSlots: [{ id: 'slot_1', startBlockIdx: -1, blockCount: 1, time: '', days: [] }],
              scheduleNotes: []
            };
          }
        });

        this.closeModal('addSchedulePromptModal');
        this.switchManageScheduleModalSchedule(newId);
      }

      openRenameScheduleDialog() {
        const currentSched = (this.tempSchedules || []).find(s => s.id === this.tempSelectedScheduleId);
        if (!currentSched) return;
        const input = document.getElementById('renameScheduleNameInput');
        if (input) input.value = currentSched.name;
        const modal = document.getElementById('renameSchedulePromptModal');
        if (modal) modal.classList.add('active');
        setTimeout(() => { if (input) { input.focus(); input.select(); } }, 60);
      }

      confirmRenameScheduleDialog() {
        const input = document.getElementById('renameScheduleNameInput');
        const name = input ? input.value.trim() : '';
        if (!name) {
          alert('Please enter a schedule name.');
          return;
        }

        const currentSched = (this.tempSchedules || []).find(s => s.id === this.tempSelectedScheduleId);
        if (currentSched) {
          currentSched.name = name;
        }

        this.closeModal('renameSchedulePromptModal');
        this.populateManageScheduleTopBar();
        this.renderManageScheduleList();
      }

      deleteScheduleFromModal() {
        if (!Array.isArray(this.tempSchedules) || this.tempSchedules.length <= 1) {
          alert('You must have at least one schedule.');
          return;
        }

        const currentSched = this.tempSchedules.find(s => s.id === this.tempSelectedScheduleId);
        if (!currentSched) return;

        if (!confirm(`Are you sure you want to delete the schedule "${currentSched.name}"?`)) return;

        const deletedId = this.tempSelectedScheduleId;
        this.tempSchedules = this.tempSchedules.filter(s => s.id !== deletedId);
        (this.tempScheduleClasses || []).forEach(c => {
          if (c.schedules && c.schedules[deletedId]) {
            delete c.schedules[deletedId];
          }
        });

        this.tempSelectedScheduleId = this.tempSchedules[0].id;
        this.switchManageScheduleModalSchedule(this.tempSelectedScheduleId);
      }

      isClassScheduleConfigured(c, scheduleId = null) {
        if (!c) return false;
        const slots = this.getClassScheduleSlots(c, scheduleId || this.tempSelectedScheduleId || this.currentScheduleId);
        return slots.some(s => (s.startBlockIdx >= 0 || (s.time && s.time.trim())) && Array.isArray(s.days) && s.days.length > 0);
      }

      getScheduleSummaryText(c, scheduleId = null) {
        if (!c) return '';
        const slots = this.getClassScheduleSlots(c, scheduleId || this.tempSelectedScheduleId || this.currentScheduleId);
        const validSlots = slots.filter(s => (s.startBlockIdx >= 0 || (s.time && s.time.trim())) && Array.isArray(s.days) && s.days.length > 0);
        if (validSlots.length === 0) return '';
        return validSlots.map(s => {
          const daysStr = (s.days || []).map(d => d.substr(0, 3)).join('/');
          return `${daysStr} ${s.time || ''}`.trim();
        }).join(' • ');
      }

      toggleScheduleCardExpand(classIdx) {
        if (!this.manuallyExpandedScheduleClassIndices) {
          this.manuallyExpandedScheduleClassIndices = new Set();
        }
        if (this.manuallyExpandedScheduleClassIndices.has(classIdx)) {
          this.manuallyExpandedScheduleClassIndices.delete(classIdx);
        } else {
          this.manuallyExpandedScheduleClassIndices.add(classIdx);
        }
        this.renderManageScheduleList();
      }

      toggleAddScheduleNewDay(btn) {
        if (!btn) return;
        btn.classList.toggle('active');
      }

      addScheduleClassFromModal() {
        const nameInput = document.getElementById('modalAddScheduleClassName');
        const name = (nameInput ? nameInput.value : '').trim();

        if (!name) {
          alert('Please enter a name.');
          return;
        }

        const blocks = Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : [];
        const startIdx = (typeof this.tempNewClassStartBlockIdx === 'number' && this.tempNewClassStartBlockIdx >= 0) 
          ? this.tempNewClassStartBlockIdx 
          : (blocks.length > 0 ? 0 : -1);
        const blockCount = Math.max(1, this.tempNewClassBlockCount || 1);
        const time = (startIdx >= 0 && blocks.length > 0) ? this.getCombinedTimeRange(startIdx, blockCount) : '';

        const daysContainer = document.getElementById('modalAddScheduleDaysContainer');
        const selectedDays = [];
        if (daysContainer) {
          daysContainer.querySelectorAll('.day-pill-btn.active').forEach(btn => {
            selectedDays.push(btn.getAttribute('data-day'));
          });
        }

        const isText = (this.tempScheduleEntryType === 'text');
        const newColor = this.tempNewClassColor || (isText ? '#64748b' : '#059669');
        const defaultSubjId = this.subjects[0] ? this.subjects[0].id : 'subj_music';
        const slotObj = {
          id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          startBlockIdx: startIdx,
          blockCount: blockCount,
          time: time,
          days: selectedDays
        };

        const rawClass = {
          id: (isText ? 'text-' : 'class-') + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: name,
          entryType: isText ? 'text' : 'class',
          isTextOnly: isText,
          color: newColor,
          scheduleTime: time,
          scheduleStartBlockIdx: startIdx,
          scheduleBlockCount: blockCount,
          scheduleDays: selectedDays,
          scheduleSlots: [slotObj],
          scheduleNotes: [],
          schedules: {
            [this.tempSelectedScheduleId]: {
              scheduleSlots: [slotObj],
              scheduleNotes: []
            }
          },
          subjectId: defaultSubjId,
          layout: 'rows',
          rowsCount: 4,
          rowAlignment: 'center',
          showFirstName: true,
          showLastName: false,
          showFaces: true,
          showInitials: true,
          showGradesAttendanceRatio: true,
          classList: [],
          studentProfiles: {},
          rows: Array.from({ length: 4 }, () => []),
          lines: Array.from({ length: 4 }, () => []),
          circle: [],
          layoutsData: {
            half: [[], []],
            third: [[], []],
            fourth: [[], [], []],
            fifth: [[], [], [], []],
            sixth: [[], [], [], [], [], []]
          },
          unplacedStudents: [],
          attendanceDates: [],
          subjectGrades: {
            [defaultSubjId]: []
          }
        };

        const newClass = this.sanitizeAndMigrateClass(rawClass, defaultSubjId);
        this.tempScheduleClasses.unshift(newClass);

        this.tempNewClassColor = '#059669';
        this.tempNewClassStartBlockIdx = 0;
        this.tempNewClassBlockCount = 1;
        const colorBtn = document.getElementById('modalAddScheduleColorBtn');
        if (colorBtn) colorBtn.style.backgroundColor = '#059669';

        if (nameInput) nameInput.value = '';
        this.populateNewClassTimeSelect();
        if (daysContainer) {
          daysContainer.querySelectorAll('.day-pill-btn').forEach(btn => btn.classList.remove('active'));
        }

        this.renderManageScheduleList();
      }

      addClassScheduleSlot(classIdx) {
        if (!this.tempScheduleClasses[classIdx]) return;
        const c = this.tempScheduleClasses[classIdx];
        const slots = this.getClassScheduleSlots(c, this.tempSelectedScheduleId);
        slots.push({
          id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          startBlockIdx: -1,
          blockCount: 1,
          time: '',
          days: []
        });
        this.setClassScheduleSlots(slots, c, this.tempSelectedScheduleId);
        this.renderManageScheduleList();
      }

      removeClassScheduleSlot(classIdx, slotIdx) {
        if (!this.tempScheduleClasses[classIdx]) return;
        const c = this.tempScheduleClasses[classIdx];
        const slots = this.getClassScheduleSlots(c, this.tempSelectedScheduleId);
        if (slots.length > 1) {
          slots.splice(slotIdx, 1);
          this.setClassScheduleSlots(slots, c, this.tempSelectedScheduleId);
          this.renderManageScheduleList();
        }
      }

      onClassSlotTimeSelectChange(classIdx, slotIdx, val) {
        if (!this.tempScheduleClasses[classIdx]) return;
        const c = this.tempScheduleClasses[classIdx];
        const slots = this.getClassScheduleSlots(c, this.tempSelectedScheduleId);
        const slot = slots[slotIdx];
        if (!slot) return;

        const bIdx = parseInt(val, 10);
        const blocks = Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : [];
        if (bIdx >= 0 && bIdx < blocks.length) {
          slot.startBlockIdx = bIdx;
          slot.blockCount = 1;
          slot.time = blocks[bIdx].time;
        } else {
          slot.startBlockIdx = -1;
          slot.blockCount = 1;
          slot.time = '';
        }
        this.setClassScheduleSlots(slots, c, this.tempSelectedScheduleId);
        this.renderManageScheduleList();
      }

      increaseClassSlotBlockSpan(classIdx, slotIdx) {
        if (!this.tempScheduleClasses[classIdx]) return;
        const c = this.tempScheduleClasses[classIdx];
        const slots = this.getClassScheduleSlots(c, this.tempSelectedScheduleId);
        const slot = slots[slotIdx];
        if (!slot) return;
        const blocks = Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : [];
        if (blocks.length === 0) return;

        let startIdx = (typeof slot.startBlockIdx === 'number' && slot.startBlockIdx >= 0) ? slot.startBlockIdx : this.findSlotStartBlockIdx(slot);
        if (startIdx < 0) startIdx = 0;
        let count = Math.max(1, slot.blockCount || 1);

        if (startIdx + count < blocks.length) {
          count += 1;
          slot.startBlockIdx = startIdx;
          slot.blockCount = count;
          slot.time = this.getCombinedTimeRange(startIdx, count);
          this.setClassScheduleSlots(slots, c, this.tempSelectedScheduleId);
          this.renderManageScheduleList();
        }
      }

      decreaseClassSlotBlockSpan(classIdx, slotIdx) {
        if (!this.tempScheduleClasses[classIdx]) return;
        const c = this.tempScheduleClasses[classIdx];
        const slots = this.getClassScheduleSlots(c, this.tempSelectedScheduleId);
        const slot = slots[slotIdx];
        if (!slot) return;
        const blocks = Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : [];
        if (blocks.length === 0) return;

        let startIdx = (typeof slot.startBlockIdx === 'number' && slot.startBlockIdx >= 0) ? slot.startBlockIdx : this.findSlotStartBlockIdx(slot);
        if (startIdx < 0) startIdx = 0;
        let count = Math.max(1, slot.blockCount || 1);

        if (count > 1) {
          count -= 1;
          slot.startBlockIdx = startIdx;
          slot.blockCount = count;
          slot.time = this.getCombinedTimeRange(startIdx, count);
          this.setClassScheduleSlots(slots, c, this.tempSelectedScheduleId);
          this.renderManageScheduleList();
        }
      }

      toggleScheduleModalClassSlotDay(classIdx, slotIdx, dayKey) {
        if (!this.tempScheduleClasses[classIdx]) return;
        const c = this.tempScheduleClasses[classIdx];
        const slots = this.getClassScheduleSlots(c, this.tempSelectedScheduleId);
        const slot = slots[slotIdx];
        if (!slot) return;
        if (!Array.isArray(slot.days)) slot.days = [];

        const existsIdx = slot.days.findIndex(d => d.toLowerCase() === dayKey.toLowerCase());
        if (existsIdx > -1) {
          slot.days.splice(existsIdx, 1);
        } else {
          slot.days.push(dayKey);
        }
        this.setClassScheduleSlots(slots, c, this.tempSelectedScheduleId);
        this.renderManageScheduleList();
      }

      renderManageScheduleList() {
        const container = document.getElementById('modalScheduleClassesList');
        if (!container) return;
        container.innerHTML = '';

        if (!this.tempScheduleClasses || this.tempScheduleClasses.length === 0) {
          container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 12px; text-align: center;">No classes available. Add a class above.</div>';
          return;
        }

        const DAYS = [
          { key: 'Monday', label: 'Mon' },
          { key: 'Tuesday', label: 'Tue' },
          { key: 'Wednesday', label: 'Wed' },
          { key: 'Thursday', label: 'Thu' },
          { key: 'Friday', label: 'Fri' }
        ];

        const todayObj = new Date();
        const todayIso = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

        const blocks = Array.isArray(this.scheduleTimeBlocks) ? this.scheduleTimeBlocks : [];
        if (!this.openScheduleNotesClassIndices) this.openScheduleNotesClassIndices = new Set();
        if (!this.manuallyExpandedScheduleClassIndices) this.manuallyExpandedScheduleClassIndices = new Set();

        this.tempScheduleClasses.forEach((c, idx) => {
          const item = document.createElement('div');
          item.style.display = 'flex';
          item.style.flexDirection = 'column';
          item.style.gap = '8px';
          item.style.background = 'white';
          item.style.padding = '10px 12px';
          item.style.border = '1.5px solid var(--border-color)';
          item.style.borderRadius = '8px';
          item.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';

          const isText = Boolean(c.isTextOnly || c.entryType === 'text');
          const notes = this.getClassScheduleNotes(c, this.tempSelectedScheduleId);
          const hasNotes = notes.length > 0;
          const isExpandedNotes = this.openScheduleNotesClassIndices.has(idx);

          const isConfigured = this.isClassScheduleConfigured(c, this.tempSelectedScheduleId);
          const isCardExpanded = !isConfigured || this.manuallyExpandedScheduleClassIndices.has(idx);

          const slots = this.getClassScheduleSlots(c, this.tempSelectedScheduleId);

          const pace = this.getAttendancePace(c);
          const paceToggleHtml = isText ? '' : `<div class="pace-toggle" title="How often this class meets, which sets how fast its Garden grows">
                  <button type="button" class="${pace === 'weekly' ? 'active' : ''}" onclick="app.setScheduleModalClassPace(${idx}, 'weekly')">Weekly</button>
                  <button type="button" class="${pace === 'daily' ? 'active' : ''}" onclick="app.setScheduleModalClassPace(${idx}, 'daily')">Daily</button>
                </div>`;

          if (!isCardExpanded) {
            // Collapsed view for configured class
            const summaryText = this.getScheduleSummaryText(c, this.tempSelectedScheduleId);
            item.innerHTML = `
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <button type="button" class="btn btn-outline" style="padding: 1px 6px; font-size: 0.75rem;" onclick="app.moveScheduleModalClass(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>▲</button>
                  <button type="button" class="btn btn-outline" style="padding: 1px 6px; font-size: 0.75rem;" onclick="app.moveScheduleModalClass(${idx}, 1)" ${idx === this.tempScheduleClasses.length - 1 ? 'disabled' : ''}>▼</button>
                </div>
                <button type="button" class="schedule-color-circle-btn" style="background-color: ${c.color || 'var(--green)'};" onclick="app.openScheduleColorPicker(${idx})" title="Change Color"></button>
                ${isText ? `<span style="font-size: 0.72rem; font-weight: 800; background: var(--line); color: var(--ink-soft); padding: 3px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.3px; flex-shrink: 0;">Text</span>` : ''}
                <input type="text" value="${this.escapeHtml(c.name || '')}" placeholder="Name..." style="flex: 1; font-weight: 700; font-size: 0.95rem; padding: 6px 10px; border: 1px solid var(--line-strong); border-radius: 6px;" oninput="app.tempScheduleClasses[${idx}].name = this.value">
                ${paceToggleHtml}
                <button type="button" class="btn" style="background: var(--danger); color: white; padding: 5px 10px; font-size: 1.1rem; line-height: 1;" onclick="app.deleteScheduleModalClass(${idx})" title="Delete">&times;</button>
              </div>

              <div style="display: flex; justify-content: center; align-items: center; margin-top: -2px;">
                <button type="button" class="btn-schedule-card-expand" onclick="app.toggleScheduleCardExpand(${idx})" title="Click to view and edit schedule">
                  ${summaryText ? `<span style="font-size: 0.78rem; font-weight: 700; color: var(--ink-soft);">${this.escapeHtml(summaryText)}</span>` : ''}
                  <span style="font-size: 0.82rem; font-weight: 800; color: var(--blue);">⌄</span>
                </button>
              </div>
            `;
          } else {
            // Expanded view
            let slotsHtml = slots.map((slot, slotIdx) => {
              const isLastSlot = (slotIdx === slots.length - 1);
              const startIdx = (typeof slot.startBlockIdx === 'number' && slot.startBlockIdx >= 0) ? slot.startBlockIdx : this.findSlotStartBlockIdx(slot);
              const blockCount = Math.max(1, slot.blockCount || 1);
              const currentDays = Array.isArray(slot.days) ? slot.days : [];

              let timeSelectHtml = '';
              if (blocks.length === 0) {
                timeSelectHtml = `<option value="-1">(No time blocks)</option>`;
              } else {
                timeSelectHtml = `<option value="-1" ${startIdx === -1 ? 'selected' : ''}>Set Time</option>` + blocks.map((b, bIdx) => {
                  const isSelected = (bIdx === startIdx);
                  const label = (isSelected && blockCount > 1) 
                    ? `${this.getCombinedTimeRange(bIdx, blockCount)}` 
                    : b.time;
                  return `<option value="${bIdx}" ${isSelected ? 'selected' : ''}>${label}</option>`;
                }).join('');
              }

              return `
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; position: relative;">
                  ${isLastSlot ? `
                    <div style="position: absolute; left: 0; display: flex; align-items: center;">
                      <button type="button" class="btn-schedule-note-toggle ${hasNotes ? 'has-notes' : ''} ${isExpandedNotes ? 'open' : ''}" onclick="app.toggleScheduleClassNotesDrawer(${idx})" title="${isExpandedNotes ? 'Hide Notes' : 'Show / Add Notes'}">
                        ${isExpandedNotes ? '▲' : '▼'}
                      </button>
                    </div>
                  ` : ''}

                  <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <select class="schedule-modal-time-select" onchange="app.onClassSlotTimeSelectChange(${idx}, ${slotIdx}, this.value)">
                      ${timeSelectHtml}
                    </select>
                    <button type="button" class="btn-block-combine" onclick="app.increaseClassSlotBlockSpan(${idx}, ${slotIdx})" title="Combine next time block">+</button>
                    ${blockCount > 1 ? `<button type="button" class="btn-block-combine" onclick="app.decreaseClassSlotBlockSpan(${idx}, ${slotIdx})" title="Reduce time block">−</button>` : ''}

                    <div style="display: flex; align-items: center; gap: 3px; margin-left: 6px;">
                      ${DAYS.map(d => {
                        const isActive = currentDays.some(cd => cd.toLowerCase() === d.key.toLowerCase() || cd.toLowerCase() === d.label.toLowerCase());
                        return `<button type="button" class="day-pill-btn ${isActive ? 'active' : ''}" onclick="app.toggleScheduleModalClassSlotDay(${idx}, ${slotIdx}, '${d.key}')">${d.label}</button>`;
                      }).join('')}
                    </div>

                    <button type="button" class="btn-time-enter" onclick="app.addClassScheduleSlot(${idx})" title="Add another time slot for this class" style="margin-left: 4px;">↵</button>
                    ${slots.length > 1 ? `
                      <button type="button" class="btn-time-delete" onclick="app.removeClassScheduleSlot(${idx}, ${slotIdx})" title="Remove this time slot">&times;</button>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('');

            item.innerHTML = `
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <button type="button" class="btn btn-outline" style="padding: 1px 6px; font-size: 0.75rem;" onclick="app.moveScheduleModalClass(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>▲</button>
                  <button type="button" class="btn btn-outline" style="padding: 1px 6px; font-size: 0.75rem;" onclick="app.moveScheduleModalClass(${idx}, 1)" ${idx === this.tempScheduleClasses.length - 1 ? 'disabled' : ''}>▼</button>
                </div>
                <button type="button" class="schedule-color-circle-btn" style="background-color: ${c.color || 'var(--green)'};" onclick="app.openScheduleColorPicker(${idx})" title="Change Color"></button>
                ${isText ? `<span style="font-size: 0.72rem; font-weight: 800; background: var(--line); color: var(--ink-soft); padding: 3px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.3px; flex-shrink: 0;">Text</span>` : ''}
                <input type="text" value="${this.escapeHtml(c.name || '')}" placeholder="Name..." style="flex: 1; font-weight: 700; font-size: 0.95rem; padding: 6px 10px; border: 1px solid var(--line-strong); border-radius: 6px;" oninput="app.tempScheduleClasses[${idx}].name = this.value">
                ${paceToggleHtml}
                <button type="button" class="btn" style="background: var(--danger); color: white; padding: 5px 10px; font-size: 1.1rem; line-height: 1;" onclick="app.deleteScheduleModalClass(${idx})" title="Delete">&times;</button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 6px; padding-left: 28px; width: 100%; box-sizing: border-box;">
                ${slotsHtml}
              </div>

              ${isExpandedNotes ? `
                <div class="schedule-notes-drawer" style="margin-top: 4px; padding: 10px 12px; background: var(--paper-2); border-radius: 8px; border: 1.5px dashed var(--line-strong); display: flex; flex-direction: column; gap: 8px;">
                  ${hasNotes ? `
                    <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 2px;">
                      <div style="font-size: 0.75rem; font-weight: 800; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.3px;">Notes:</div>
                      ${notes.map((note, noteIdx) => {
                        let targetLabel = 'Every class';
                        if (note.target === 'specific') {
                          targetLabel = (note.days || []).join(', ') || 'Specific days';
                        } else if (note.target === 'once') {
                          targetLabel = `Only once: ${this.formatNoteDateDisplay(note.date)}`;
                        }
                        return `
                        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--paper); padding: 5px 8px; border-radius: 6px; border: 1px solid var(--line); font-size: 0.82rem;">
                          <div>
                            <span style="font-weight: 700; color: var(--ink);">${this.escapeHtml(note.text)}</span>
                            <span style="color: var(--ink-muted); font-size: 0.75rem; margin-left: 6px;">(${targetLabel})</span>
                          </div>
                          <button type="button" style="background: none; border: none; color: var(--red); font-weight: bold; cursor: pointer; padding: 0 4px; font-size: 1rem; line-height: 1;" onclick="app.deleteScheduleNote(${idx}, ${noteIdx})" title="Delete Note">&times;</button>
                        </div>
                      `;
                      }).join('')}
                    </div>
                  ` : ''}

                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    <div style="font-size: 0.75rem; font-weight: 800; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.3px;">+ Add Additional Text / Note:</div>
                    <input type="text" id="noteInput_${idx}" placeholder="Enter additional text (e.g. Choir, Recorders, etc.)..." style="width: 100%; box-sizing: border-box; padding: 6px 10px; font-size: 0.85rem; border: 1px solid var(--line-strong); border-radius: 6px;" onkeydown="if(event.key === 'Enter') app.addScheduleNoteToClass(${idx})">
                    
                    <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; color: var(--ink-soft); margin-top: 2px;">
                      <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-weight: 600;">
                          <input type="radio" name="noteTarget_${idx}" value="all" checked onchange="app.handleNoteTargetChange(${idx}, 'all')">
                          <span>Add to every class</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-weight: 600;">
                          <input type="radio" name="noteTarget_${idx}" value="specific" onchange="app.handleNoteTargetChange(${idx}, 'specific')">
                          <span>Add only to:</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-weight: 600;">
                          <input type="radio" name="noteTarget_${idx}" value="once" onchange="app.handleNoteTargetChange(${idx}, 'once')">
                          <span>Only once</span>
                        </label>
                      </div>

                      <div id="noteDaysContainer_${idx}" style="display: none; gap: 4px; margin-top: 2px; flex-wrap: wrap;">
                        ${DAYS.map(d => `
                          <button type="button" class="day-pill-btn" data-day="${d.key}" onclick="app.toggleNoteDayPill(this)">${d.label}</button>
                        `).join('')}
                      </div>

                      <div id="noteDateContainer_${idx}" style="display: none; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap;">
                        <label for="noteDateInput_${idx}" style="font-weight: 700; font-size: 0.82rem; color: var(--ink-soft);">Select Date:</label>
                        <input type="date" id="noteDateInput_${idx}" value="${todayIso}" style="padding: 5px 10px; font-size: 0.85rem; border: 1.5px solid var(--line-strong); border-radius: 6px; font-family: inherit; font-weight: 600; color: var(--ink); background: var(--paper); outline: none; cursor: pointer;">
                      </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
                      <button type="button" class="btn btn-primary" style="padding: 5px 12px; font-size: 0.82rem; font-weight: bold;" onclick="app.addScheduleNoteToClass(${idx})">Add Note</button>
                    </div>
                  </div>
                </div>
              ` : ''}

              ${isConfigured ? `
                <div style="display: flex; justify-content: center; align-items: center; margin-top: 2px;">
                  <button type="button" class="btn-schedule-card-expand" onclick="app.toggleScheduleCardExpand(${idx})" title="Collapse schedule card" style="padding: 1px 12px; font-size: 0.75rem;">
                    <span style="font-size: 0.75rem; font-weight: 800; color: var(--ink-muted);">⌃ Collapse</span>
                  </button>
                </div>
              ` : ''}
            `;
          }

          container.appendChild(item);
        });
      }

      setScheduleModalClassPace(classIdx, pace) {
        if (!this.tempScheduleClasses || !this.tempScheduleClasses[classIdx]) return;
        this.tempScheduleClasses[classIdx].attendancePace = pace;
        this.renderManageScheduleList();
      }

      toggleScheduleClassNotesDrawer(classIdx) {
        if (!this.openScheduleNotesClassIndices) this.openScheduleNotesClassIndices = new Set();
        if (this.openScheduleNotesClassIndices.has(classIdx)) {
          this.openScheduleNotesClassIndices.delete(classIdx);
        } else {
          this.openScheduleNotesClassIndices.add(classIdx);
        }
        this.renderManageScheduleList();
      }

      toggleNoteDayPill(btn) {
        if (!btn) return;
        btn.classList.toggle('active');
      }

      handleNoteTargetChange(classIdx, targetVal) {
        const daysContainer = document.getElementById(`noteDaysContainer_${classIdx}`);
        const dateContainer = document.getElementById(`noteDateContainer_${classIdx}`);
        if (daysContainer) {
          daysContainer.style.display = (targetVal === 'specific') ? 'flex' : 'none';
        }
        if (dateContainer) {
          dateContainer.style.display = (targetVal === 'once') ? 'flex' : 'none';
        }
      }

      addScheduleNoteToClass(classIdx) {
        if (!this.tempScheduleClasses[classIdx]) return;
        const input = document.getElementById(`noteInput_${classIdx}`);
        const text = input ? input.value.trim() : '';
        if (!text) {
          alert('Please enter text for the note.');
          return;
        }

        const radio = document.querySelector(`input[name="noteTarget_${classIdx}"]:checked`);
        const targetVal = radio ? radio.value : 'all';

        const selectedDays = [];
        let selectedDate = '';

        if (targetVal === 'specific') {
          const daysContainer = document.getElementById(`noteDaysContainer_${classIdx}`);
          if (daysContainer) {
            daysContainer.querySelectorAll('.day-pill-btn.active').forEach(btn => {
              selectedDays.push(btn.getAttribute('data-day'));
            });
          }
          if (selectedDays.length === 0) {
            alert('Please select at least one day for this note, or choose "Add to every class".');
            return;
          }
        } else if (targetVal === 'once') {
          const dateInput = document.getElementById(`noteDateInput_${classIdx}`);
          selectedDate = dateInput ? dateInput.value : '';
          if (!selectedDate) {
            alert('Please select a date for this note.');
            return;
          }
        }

        const c = this.tempScheduleClasses[classIdx];
        const notes = this.getClassScheduleNotes(c, this.tempSelectedScheduleId);
        notes.push({
          id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          text: text,
          target: targetVal,
          days: selectedDays,
          date: selectedDate
        });
        this.setClassScheduleNotes(notes, c, this.tempSelectedScheduleId);

        if (!this.openScheduleNotesClassIndices) this.openScheduleNotesClassIndices = new Set();
        this.openScheduleNotesClassIndices.add(classIdx);

        this.renderManageScheduleList();
      }

      deleteScheduleNote(classIdx, noteIdx) {
        if (!this.tempScheduleClasses[classIdx]) return;
        const c = this.tempScheduleClasses[classIdx];
        const notes = this.getClassScheduleNotes(c, this.tempSelectedScheduleId);
        notes.splice(noteIdx, 1);
        this.setClassScheduleNotes(notes, c, this.tempSelectedScheduleId);
        this.renderManageScheduleList();
      }

      toggleScheduleModalClassDay(classIdx, dayKey) {
        if (!this.tempScheduleClasses[classIdx]) return;
        const c = this.tempScheduleClasses[classIdx];
        const slots = this.getClassScheduleSlots(c, this.tempSelectedScheduleId);
        if (slots[0]) {
          if (!Array.isArray(slots[0].days)) slots[0].days = [];
          const existsIdx = slots[0].days.findIndex(d => d.toLowerCase() === dayKey.toLowerCase());
          if (existsIdx > -1) slots[0].days.splice(existsIdx, 1);
          else slots[0].days.push(dayKey);
          this.setClassScheduleSlots(slots, c, this.tempSelectedScheduleId);
        }
        this.renderManageScheduleList();
      }

      moveScheduleModalClass(index, delta) {
        const targetIndex = index + delta;
        if (targetIndex >= 0 && targetIndex < this.tempScheduleClasses.length) {
          const item = this.tempScheduleClasses.splice(index, 1)[0];
          this.tempScheduleClasses.splice(targetIndex, 0, item);
          this.renderManageScheduleList();
        }
      }

      deleteScheduleModalClass(index) {
        if (confirm(`Are you sure you want to delete "${this.tempScheduleClasses[index].name}"?`)) {
          this.tempScheduleClasses.splice(index, 1);
          this.renderManageScheduleList();
        }
      }

      saveCustomColors() {
        if (Array.isArray(this.customPaletteColors)) {
          localStorage.setItem('classPlanner_customColors_v1', JSON.stringify(this.customPaletteColors));
        }
      }

      renderScheduleColorSwatches() {
        const container = document.getElementById('scheduleColorPickerSwatches');
        if (!container) return;

        const currentColor = (this.selectedColorPickerHex || '#059669').toLowerCase();
        const palette = this.getClassPalette();
        const customColors = Array.isArray(this.customPaletteColors) ? this.customPaletteColors : [null, null, null, null];

        let html = '';

        // 12 Standard swatches
        palette.forEach(p => {
          const isSelected = p.hex.toLowerCase() === currentColor;
          html += `
            <div class="color-swatch-item ${isSelected ? 'selected' : ''}" style="background-color: ${p.hex};" onclick="app.selectColorSwatch('${p.hex}')" title="${p.name}">
              ${isSelected ? '✓' : ''}
            </div>
          `;
        });

        // 4 Custom swatches in row 4
        customColors.forEach((customHex, slotIdx) => {
          if (!customHex) {
            html += `
              <div class="color-swatch-item custom-swatch blank" onclick="app.onCustomSwatchClick(${slotIdx})" title="Click to choose a custom color">
                <span style="font-size: 0.95rem; color: var(--ink-faint); font-weight: 800;">+</span>
              </div>
            `;
          } else {
            const isSelected = customHex.toLowerCase() === currentColor;
            html += `
              <div class="color-swatch-item custom-swatch ${isSelected ? 'selected' : ''}" style="background-color: ${customHex};" onclick="app.onCustomSwatchClick(${slotIdx})" ondblclick="app.openCustomColorSpectrum(${slotIdx})" title="Click to select, double-click to change color">
                ${isSelected ? '✓' : ''}
              </div>
            `;
          }
        });

        container.innerHTML = html;
      }

      openScheduleColorPicker(targetIdx) {
        this.colorPickerTarget = targetIdx;
        let currentColor = '#059669';
        if (targetIdx === 'new') {
          currentColor = this.tempNewClassColor || '#059669';
        } else if (typeof targetIdx === 'number' && this.tempScheduleClasses[targetIdx]) {
          currentColor = this.tempScheduleClasses[targetIdx].color || '#059669';
        }
        this.selectedColorPickerHex = currentColor;

        this.renderScheduleColorSwatches();

        const modal = document.getElementById('scheduleColorPickerModal');
        if (modal) modal.classList.add('active');
      }

      selectColorSwatch(hex) {
        this.selectedColorPickerHex = hex;
        this.renderScheduleColorSwatches();
      }

      onCustomSwatchClick(slotIdx) {
        if (!Array.isArray(this.customPaletteColors)) {
          this.customPaletteColors = [null, null, null, null];
        }
        const customHex = this.customPaletteColors[slotIdx];
        if (!customHex) {
          this.openCustomColorSpectrum(slotIdx);
        } else {
          this.selectColorSwatch(customHex);
        }
      }

      openCustomColorSpectrum(slotIdx) {
        this.activeCustomColorSlot = slotIdx;
        const input = document.getElementById('scheduleCustomColorInput');
        if (input) {
          const currentSlotHex = (this.customPaletteColors && this.customPaletteColors[slotIdx]) 
            ? this.customPaletteColors[slotIdx] 
            : (this.selectedColorPickerHex || '#0055FF');
          input.value = currentSlotHex.startsWith('#') && currentSlotHex.length === 7 ? currentSlotHex : '#0055FF';
          input.click();
        }
      }

      onCustomColorSpectrumSelected(newHex) {
        if (!newHex) return;
        if (!Array.isArray(this.customPaletteColors)) {
          this.customPaletteColors = [null, null, null, null];
        }
        if (typeof this.activeCustomColorSlot === 'number' && this.activeCustomColorSlot >= 0 && this.activeCustomColorSlot < 4) {
          this.customPaletteColors[this.activeCustomColorSlot] = newHex;
          this.saveCustomColors();
          this.selectedColorPickerHex = newHex;
          this.renderScheduleColorSwatches();
        }
      }

      confirmScheduleColorPicker() {
        const hex = this.selectedColorPickerHex || '#059669';
        if (this.colorPickerTarget === 'new') {
          this.tempNewClassColor = hex;
          const btn = document.getElementById('modalAddScheduleColorBtn');
          if (btn) btn.style.backgroundColor = hex;
        } else if (typeof this.colorPickerTarget === 'number' && this.tempScheduleClasses[this.colorPickerTarget]) {
          this.tempScheduleClasses[this.colorPickerTarget].color = hex;
          this.renderManageScheduleList();
        }
        this.closeModal('scheduleColorPickerModal');
      }

      saveManageSchedule() {
        if (!this.tempScheduleClasses || this.tempScheduleClasses.length === 0) {
          alert('You must have at least one class.');
          return;
        }

        if (this.tempScheduleClasses.some(c => !c.name || !c.name.trim())) {
          alert('Class names cannot be empty.');
          return;
        }

        const defaultSubjId = this.subjects[0] ? this.subjects[0].id : 'subj_music';
        this.schedules = this.tempSchedules;
        this.currentScheduleId = this.tempSelectedScheduleId;

        this.classes = this.tempScheduleClasses.map(c => this.sanitizeAndMigrateClass(c, defaultSubjId)).filter(Boolean);

        if (!this.classes.some(c => c.id === this.currentClassId)) {
          this.currentClassId = this.classes[0] ? this.classes[0].id : null;
        }

        const activeSched = this.getCurrentSchedule();
        this.scheduleTimeBlocks = activeSched.timeBlocks || [];

        this.saveData();
        this.renderClassDropdown();
        this.renderScheduleDropdown();
        this.closeModal('manageScheduleModal');

        if (this.currentViewMode === 'schedule') {
          this.renderScheduleTable();
        } else if (this.currentViewMode === 'attendance') {
          this.renderAttendanceTable();
        } else if (this.currentViewMode === 'grades') {
          this.renderGradesTable();
        } else {
          this.render();
        }
      }

      triggerScheduleCameraClick(btnEl) {
        if (typeof html2canvas === 'undefined') {
          alert('Snapshot library is loading. Please try again in a moment.');
          return;
        }

        const container = document.querySelector('#scheduleAppBody .panel') || document.getElementById('scheduleTable');
        if (!container) return;

        if (btnEl) {
          btnEl.style.transform = 'scale(0.9)';
          setTimeout(() => { btnEl.style.transform = ''; }, 150);
        }

        html2canvas(container, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true
        }).then(canvas => {
          const now = new Date();
          const dateStr = now.toISOString().split('T')[0];
          const filename = `ClassSchedule_${dateStr}.png`;

          const link = document.createElement('a');
          link.download = filename;
          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }).catch(err => {
          console.error('Error generating schedule snapshot:', err);
          alert('Failed to capture snapshot of the schedule.');
        });
      }

      populateSettingsSubjectDropdown() {
        const select = document.getElementById('settingsSubjectSelect');
        if (!select) return;
        select.innerHTML = '';
        if (!Array.isArray(this.subjects) || this.subjects.length === 0) {
          this.subjects = [
            {
              id: 'subj_music',
              name: 'Music',
              categories: ['Singing', 'Instruments', 'Movement', 'Culture', 'Theory', 'Effort']
            }
          ];
        }
        const currentClass = this.getCurrentClass();
        const currentSubjId = (currentClass && currentClass.subjectId) ? currentClass.subjectId : this.subjects[0].id;

        this.subjects.forEach(s => {
          const opt = document.createElement('option');
          opt.value = s.id;
          opt.textContent = s.name;
          if (s.id === currentSubjId) opt.selected = true;
          select.appendChild(opt);
        });
        select.value = currentSubjId;
      }

      openEditSubjectsModal() {
        if (!Array.isArray(this.subjects) || this.subjects.length === 0) {
          this.subjects = [
            {
              id: 'subj_music',
              name: 'Music',
              categories: ['Singing', 'Instruments', 'Movement', 'Culture', 'Theory', 'Effort']
            }
          ];
        }
        this.tempSubjects = JSON.parse(JSON.stringify(this.subjects));
        this.tempSubjects.forEach((s, idx) => {
          if (!Array.isArray(s.categories)) s.categories = [];
          if (idx === 0) s.isExpanded = true;
        });

        const input = document.getElementById('modalAddSubjectName');
        if (input) input.value = '';
        this.renderModalSubjectsList();
        const modal = document.getElementById('editSubjectsModal');
        if (modal) modal.classList.add('active');
      }

      renderModalSubjectsList() {
        const container = document.getElementById('modalSubjectsList');
        if (!container) return;
        container.innerHTML = '';

        if (!this.tempSubjects || this.tempSubjects.length === 0) {
          container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 8px; text-align: center;">No subjects available. Add a subject above.</div>';
          return;
        }

        this.tempSubjects.forEach((s, sIdx) => {
          if (!Array.isArray(s.categories)) s.categories = [];
          const card = document.createElement('div');
          card.style.cssText = 'background: var(--paper); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';

          const catCount = s.categories.length;
          const isExpanded = s.isExpanded !== false;

          let categoriesHTML = '';
          if (s.categories.length === 0) {
            categoriesHTML = '<div style="font-size: 0.82rem; color: var(--ink-faint); font-style: italic; margin-bottom: 6px;">No subcategories yet. Add one below.</div>';
          } else {
            categoriesHTML = '<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">';
            s.categories.forEach((cat, cIdx) => {
              categoriesHTML += `
                <div style="display: inline-flex; align-items: center; background: var(--paper); border: 1.5px solid var(--line-strong); border-radius: 6px; padding: 2px 6px; gap: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
                  <input type="text" value="${this.escapeHtml(cat)}" style="border: none; padding: 2px 4px; font-size: 0.85rem; font-weight: 700; width: 105px; outline: none; background: transparent;" oninput="app.tempSubjects[${sIdx}].categories[${cIdx}] = this.value">
                  <button type="button" onclick="app.deleteModalCategory(${sIdx}, ${cIdx})" style="background: transparent; border: none; color: var(--red); font-size: 1rem; line-height: 1; cursor: pointer; font-weight: bold; padding: 0 2px;" title="Remove Category">&times;</button>
                </div>
              `;
            });
            categoriesHTML += '</div>';
          }

          card.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                <span style="font-weight: 700; font-size: 0.85rem; color: var(--primary);">Subject:</span>
                <input type="text" value="${this.escapeHtml(s.name)}" style="flex: 1; font-weight: 700; font-size: 0.95rem; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-color);" oninput="app.tempSubjects[${sIdx}].name = this.value">
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button type="button" class="btn btn-outline" onclick="app.toggleSubjectSublevel(${sIdx})" style="font-size: 0.8rem; font-weight: 600; padding: 5px 10px; background: var(--paper-2);">
                  ${isExpanded ? 'Subcategories ▴' : `Subcategories (${catCount}) ▾`}
                </button>
                <button type="button" class="btn" style="background: var(--danger); color: white; padding: 5px 10px; font-size: 0.9rem;" onclick="app.deleteModalSubject(${sIdx})" title="Delete Subject">&times;</button>
              </div>
            </div>

            ${isExpanded ? `
              <div style="background: var(--paper-2); border: 1px dashed var(--line-strong); border-radius: 6px; padding: 10px; margin-top: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-weight: 700; font-size: 0.8rem; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px;">Assessment Subcategories:</span>
                </div>
                ${categoriesHTML}
                <div style="display: flex; gap: 6px; align-items: center;">
                  <input type="text" id="modalAddCategory_${sIdx}" placeholder="New category (e.g. Drawing, Pottery)..." style="flex: 1; padding: 5px 10px; font-size: 0.85rem; background: var(--paper); border-radius: 6px; border: 1px solid var(--border-color);" onkeydown="if(event.key === 'Enter') app.addCategoryFromModal(${sIdx})">
                  <button type="button" class="btn btn-secondary" onclick="app.addCategoryFromModal(${sIdx})" style="font-size: 0.82rem; padding: 5px 12px; font-weight: 700;">+ Add</button>
                </div>
              </div>
            ` : ''}
          `;

          container.appendChild(card);
        });
      }

      toggleSubjectSublevel(sIdx) {
        if (!this.tempSubjects[sIdx]) return;
        this.tempSubjects[sIdx].isExpanded = !this.tempSubjects[sIdx].isExpanded;
        this.renderModalSubjectsList();
      }

      addCategoryFromModal(sIdx) {
        const input = document.getElementById(`modalAddCategory_${sIdx}`);
        if (!input) return;
        const name = input.value.trim();
        if (!name) {
          alert('Please enter a category name.');
          return;
        }
        if (!Array.isArray(this.tempSubjects[sIdx].categories)) {
          this.tempSubjects[sIdx].categories = [];
        }
        this.tempSubjects[sIdx].categories.push(name);
        input.value = '';
        this.renderModalSubjectsList();
      }

      deleteModalCategory(sIdx, cIdx) {
        if (!this.tempSubjects[sIdx] || !Array.isArray(this.tempSubjects[sIdx].categories)) return;
        this.tempSubjects[sIdx].categories.splice(cIdx, 1);
        this.renderModalSubjectsList();
      }

      addSubjectFromModal() {
        const input = document.getElementById('modalAddSubjectName');
        if (!input) return;
        const name = input.value.trim();
        if (!name) {
          alert('Please enter a subject name.');
          return;
        }
        const newSubject = {
          id: 'subj_' + Date.now(),
          name: name,
          categories: [],
          isExpanded: true
        };
        this.tempSubjects.push(newSubject);
        input.value = '';
        this.renderModalSubjectsList();
      }

      deleteModalSubject(index) {
        if (this.tempSubjects.length <= 1) {
          alert('You must have at least one subject.');
          return;
        }
        const subjName = this.tempSubjects[index] ? this.tempSubjects[index].name : 'this subject';
        if (confirm(`Are you sure you want to delete "${subjName}"?`)) {
          this.tempSubjects.splice(index, 1);
          this.renderModalSubjectsList();
        }
      }

      saveEditedSubjects() {
        this.tempSubjects = this.tempSubjects.filter(s => s && s.name && s.name.trim().length > 0);
        this.tempSubjects.forEach(s => {
          if (Array.isArray(s.categories)) {
            s.categories = s.categories.map(c => typeof c === 'string' ? c.trim() : '').filter(Boolean);
          } else {
            s.categories = [];
          }
        });

        if (this.tempSubjects.length === 0) {
          this.tempSubjects = [
            {
              id: 'subj_music',
              name: 'Music',
              categories: ['Singing', 'Instruments', 'Movement', 'Culture', 'Theory', 'Effort']
            }
          ];
        }

        this.subjects = JSON.parse(JSON.stringify(this.tempSubjects));
        this.saveData();
        this.closeModal('editSubjectsModal');
        this.populateSettingsSubjectDropdown();
      }

      initInitialFreeformPositions(currentClass, boxWidth = 880) {
        if (!currentClass) return;
        if (!Array.isArray(currentClass.freeform) || currentClass.freeform.length === 0) {
          const all = this.getAllClassStudents(currentClass);
          currentClass.freeform = this.sortStudentsByName(all, 'last');
        }
        if (!currentClass.freeformPositions || typeof currentClass.freeformPositions !== 'object') {
          currentClass.freeformPositions = {};
        }

        const cardWidth = 115;
        const cardHeight = 78;
        const gapX = 14;
        const gapY = 12;
        const startX = 18;
        const startY = 18;

        const maxCols = Math.max(1, Math.floor((boxWidth - startX * 2) / (cardWidth + gapX)));

        currentClass.freeform.forEach((studentName, idx) => {
          if (!currentClass.freeformPositions[studentName]) {
            const col = idx % maxCols;
            const row = Math.floor(idx / maxCols);
            currentClass.freeformPositions[studentName] = {
              x: startX + col * (cardWidth + gapX),
              y: startY + row * (cardHeight + gapY)
            };
          }
        });
      }

      setLayout(layoutType) {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;
        if (layoutType !== 'garden') this.gardenEditClassId = null;

        const all = this.getAllClassStudents(currentClass);
        const sortedByLast = this.sortStudentsByName(all, 'last');

        if (!currentClass.layoutsData) currentClass.layoutsData = {};

        if (layoutType === 'circle' && (!currentClass.circle || currentClass.circle.length === 0)) {
          currentClass.circle = [...sortedByLast];
        } else if (layoutType === 'lines') {
          const lineCount = currentClass.linesCount || 4;
          if (!currentClass.lines || !Array.isArray(currentClass.lines) || currentClass.lines.length !== lineCount || currentClass.lines.flat().length === 0) {
            currentClass.lines = this.autoBalanceGroups(all, lineCount, 'last');
          }
        } else if (layoutType === 'freeform') {
          if (!currentClass.freeform || currentClass.freeform.length === 0) {
            currentClass.freeform = [...sortedByLast];
          }
          this.initInitialFreeformPositions(currentClass);
        } else if (layoutType === 'band') {
          if (!currentClass.band) currentClass.band = this.createDefaultBand(sortedByLast);
        } else if (['half', 'third', 'fourth', 'fifth', 'sixth'].includes(layoutType)) {
          const numGroups = layoutType === 'half' ? 2 : layoutType === 'third' ? 3 : layoutType === 'fourth' ? 4 : layoutType === 'fifth' ? 5 : 6;
          const gArr = currentClass.layoutsData[layoutType];
          if (!gArr || !Array.isArray(gArr) || gArr.length < numGroups || gArr.flat().length === 0) {
            currentClass.layoutsData[layoutType] = this.autoBalanceGroups(all, numGroups, 'last');
          }
        }

        currentClass.layout = layoutType;
        this.saveData();
        this.render();
      }

      addSingleStudent() {
        const input = document.getElementById('singleStudentInput');
        const name = input.value.trim();
        if (!name) return;

        const currentClass = this.getCurrentClass();
        if (currentClass) {
          if (!currentClass.classList) currentClass.classList = [];
          if (!currentClass.classList.includes(name)) {
            currentClass.classList.push(name);
          }

          const parsed = this.parseStudentName(name);
          if (!currentClass.studentProfiles) currentClass.studentProfiles = {};
          currentClass.studentProfiles[name] = {
            firstName: parsed.firstName || name,
            lastName: parsed.lastName || '',
            rosterName: parsed.rosterName || name
          };
          if (name !== parsed.firstName) {
            currentClass.studentProfiles[parsed.firstName] = {
              firstName: parsed.firstName,
              lastName: parsed.lastName,
              rosterName: parsed.rosterName || name
            };
          }

          if (!currentClass.rows) currentClass.rows = [[]];
          if (currentClass.rows.length === 0) currentClass.rows.push([]);
          currentClass.rows[0].push(name);

          if (!currentClass.circle) currentClass.circle = [];
          currentClass.circle.push(name);

          if (!currentClass.freeform) currentClass.freeform = [];
          if (!currentClass.freeform.includes(name)) currentClass.freeform.push(name);
          this.initInitialFreeformPositions(currentClass);

          if (!Array.isArray(currentClass.lines) || currentClass.lines.length < 4) {
            currentClass.lines = Array.from({ length: 4 }, () => []);
          }
          currentClass.lines[0].push(name);

          if (!currentClass.layoutsData) currentClass.layoutsData = {};
          ['half', 'third', 'fourth', 'fifth', 'sixth'].forEach((key, idx) => {
            const count = idx + 2;
            if (!currentClass.layoutsData[key] || currentClass.layoutsData[key].length === 0) {
              currentClass.layoutsData[key] = Array.from({ length: count }, () => []);
            }
            currentClass.layoutsData[key][0].push(name);
          });

          this.saveData();
          this.render();
          input.value = '';
          input.focus();
        }
      }

      openBulkModal() {
        document.getElementById('bulkStudentsInput').value = '';
        document.getElementById('bulkModal').classList.add('active');
      }

      addBulkStudents() {
        const inputEl = document.getElementById('bulkStudentsInput');
        if (!inputEl) return;
        const text = inputEl.value;
        if (!text.trim()) return;

        const rawList = text.split(/[\n,;]+/);
        const parsedNames = [];

        rawList.forEach(item => {
          let clean = item.trim();
          // Strip leading numbering or bullets like "1.", "1)", "-", "*", "•"
          clean = clean.replace(/^[\s\d\.\)\-\*•]+/, '').trim();
          if (clean.length > 0) {
            parsedNames.push(clean);
          }
        });

        const currentClass = this.getCurrentClass();
        if (currentClass && parsedNames.length > 0) {
          if (!currentClass.classList) currentClass.classList = [];
          if (!currentClass.studentProfiles) currentClass.studentProfiles = {};

          const addedKeys = [];

          parsedNames.forEach(fullName => {
            const parsed = this.parseStudentName(fullName);
            const firstName = parsed.firstName || fullName;
            const lastName = parsed.lastName || '';
            const key = fullName;

            currentClass.studentProfiles[key] = {
              firstName: firstName,
              lastName: lastName,
              rosterName: fullName
            };
            if (fullName !== firstName) {
              currentClass.studentProfiles[firstName] = {
                firstName: firstName,
                lastName: lastName,
                rosterName: fullName
              };
            }

            if (!currentClass.classList.includes(key)) {
              currentClass.classList.push(key);
              addedKeys.push(key);
            }
          });

          if (addedKeys.length > 0) {
            if (!currentClass.rows) currentClass.rows = [[]];
            if (currentClass.rows.length === 0) currentClass.rows.push([]);
            currentClass.rows[0].push(...addedKeys);

            if (!currentClass.circle) currentClass.circle = [];
            currentClass.circle.push(...addedKeys);

            if (!currentClass.freeform) currentClass.freeform = [];
            currentClass.freeform.push(...addedKeys);
            this.initInitialFreeformPositions(currentClass);

            if (!Array.isArray(currentClass.lines) || currentClass.lines.length < 4) {
              currentClass.lines = Array.from({ length: 4 }, () => []);
            }
            currentClass.lines[0].push(...addedKeys);

            if (!currentClass.layoutsData) currentClass.layoutsData = {};
            ['half', 'third', 'fourth', 'fifth', 'sixth'].forEach((key, idx) => {
              const count = idx + 2;
              if (!currentClass.layoutsData[key] || currentClass.layoutsData[key].length === 0) {
                currentClass.layoutsData[key] = Array.from({ length: count }, () => []);
              }
              currentClass.layoutsData[key][0].push(...addedKeys);
            });
          }

          this.saveData();
          this.render();
          this.closeModal('bulkModal');
        }
      }

      removeStudent(nameToRemove) {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        currentClass.rows = currentClass.rows.map(row => Array.isArray(row) ? row.filter(name => name !== nameToRemove) : []);
        if (currentClass.circle && Array.isArray(currentClass.circle)) {
          currentClass.circle = currentClass.circle.filter(name => name !== nameToRemove);
        }
        if (currentClass.freeform && Array.isArray(currentClass.freeform)) {
          currentClass.freeform = currentClass.freeform.filter(name => name !== nameToRemove);
        }
        if (currentClass.freeformPositions && currentClass.freeformPositions[nameToRemove]) {
          delete currentClass.freeformPositions[nameToRemove];
        }
        this.getBandChairs(currentClass.band).forEach(ch => { if (ch.student === nameToRemove) ch.student = ''; });
        if (currentClass.layoutsData) {
          ['half', 'third', 'fourth', 'fifth', 'sixth'].forEach(key => {
            if (Array.isArray(currentClass.layoutsData[key])) {
              currentClass.layoutsData[key] = currentClass.layoutsData[key].map(g => Array.isArray(g) ? g.filter(n => n !== nameToRemove) : []);
            }
          });
        }
        if (Array.isArray(currentClass.lines)) {
          currentClass.lines = currentClass.lines.map(line => Array.isArray(line) ? line.filter(name => name !== nameToRemove) : []);
        }
        if (Array.isArray(currentClass.dividedRowsData)) {
          currentClass.dividedRowsData.forEach(rSecs => {
            if (Array.isArray(rSecs)) {
              rSecs.forEach((sec, idx) => {
                if (Array.isArray(sec)) rSecs[idx] = sec.filter(n => n !== nameToRemove);
              });
            }
          });
        }

        if (!Array.isArray(currentClass.unplacedStudents)) {
          currentClass.unplacedStudents = [];
        }
        if (!currentClass.unplacedStudents.includes(nameToRemove)) {
          currentClass.unplacedStudents.push(nameToRemove);
        }

        this.saveData();
        this.render();
      }

      placeUnseatedStudent(nameToPlace) {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        if (Array.isArray(currentClass.unplacedStudents)) {
          currentClass.unplacedStudents = currentClass.unplacedStudents.filter(n => n !== nameToPlace);
        }

        const layout = currentClass.layout;
        if (layout === 'circle') {
          if (!currentClass.circle) currentClass.circle = [];
          if (!currentClass.circle.includes(nameToPlace)) currentClass.circle.push(nameToPlace);
        } else if (layout === 'freeform') {
          if (!currentClass.freeform) currentClass.freeform = [];
          if (!currentClass.freeform.includes(nameToPlace)) currentClass.freeform.push(nameToPlace);
          this.initInitialFreeformPositions(currentClass);
        } else if (layout === 'band') {
          // The first open chair, front arc first; else a new chair at the end of the back arc
          const band = currentClass.band;
          if (band && !this.findBandChair(band, nameToPlace)) {
            const open = this.getBandChairs(band).find(ch => !ch.student);
            if (open) open.student = nameToPlace;
            else {
              const back = band.rows[band.rows.length - 1];
              if (back.length < BAND.maxSeats) back.push(this.makeBandChair('', nameToPlace));
            }
          }
        } else if (layout === 'lines') {
          const lineCount = currentClass.linesCount || 4;
          if (!Array.isArray(currentClass.lines) || currentClass.lines.length < lineCount) {
            currentClass.lines = Array.from({ length: lineCount }, () => []);
          }
          let minIdx = 0;
          let minLen = (currentClass.lines[0] || []).length;
          for (let i = 1; i < lineCount; i++) {
            const len = (currentClass.lines[i] || []).length;
            if (len < minLen) {
              minLen = len;
              minIdx = i;
            }
          }
          if (!currentClass.lines[minIdx]) currentClass.lines[minIdx] = [];
          currentClass.lines[minIdx].push(nameToPlace);
        } else if (['half', 'third', 'fourth', 'fifth', 'sixth'].includes(layout)) {
          if (!currentClass.layoutsData) currentClass.layoutsData = {};
          const count = layout === 'half' ? 2 : layout === 'third' ? 3 : layout === 'fourth' ? 4 : layout === 'fifth' ? 5 : 6;
          if (!Array.isArray(currentClass.layoutsData[layout]) || currentClass.layoutsData[layout].length < count) {
            currentClass.layoutsData[layout] = Array.from({ length: count }, () => []);
          }
          const gArr = currentClass.layoutsData[layout];
          let minIdx = 0;
          let minLen = gArr[0].length;
          for (let i = 1; i < gArr.length; i++) {
            if (gArr[i].length < minLen) {
              minLen = gArr[i].length;
              minIdx = i;
            }
          }
          if (!gArr[minIdx].includes(nameToPlace)) {
            gArr[minIdx].push(nameToPlace);
          }
        } else {
          // Rows layout
          if (currentClass.divideRows) {
            if (!Array.isArray(currentClass.dividedRowsData) || currentClass.dividedRowsData.length !== currentClass.rowsCount) {
              currentClass.dividedRowsData = [];
              for (let r = 0; r < currentClass.rowsCount; r++) {
                const rowStudents = currentClass.rows[r] || [];
                const halfIdx = Math.ceil(rowStudents.length / 2);
                currentClass.dividedRowsData.push([
                  rowStudents.slice(0, halfIdx),
                  rowStudents.slice(halfIdx)
                ]);
              }
            }

            let minR = 0, minSec = 0, minCount = Infinity;
            currentClass.dividedRowsData.forEach((rSecs, r) => {
              if (Array.isArray(rSecs)) {
                rSecs.forEach((sec, seci) => {
                  if (Array.isArray(sec) && sec.length < minCount) {
                    minCount = sec.length;
                    minR = r;
                    minSec = seci;
                  }
                });
              }
            });

            if (currentClass.dividedRowsData[minR] && currentClass.dividedRowsData[minR][minSec]) {
              currentClass.dividedRowsData[minR][minSec].push(nameToPlace);
            }

            for (let r = 0; r < currentClass.rowsCount; r++) {
              const rSecs = currentClass.dividedRowsData[r];
              if (rSecs) {
                currentClass.rows[r] = [...(rSecs[0] || []), ...(rSecs[1] || [])];
              }
            }
          } else {
            if (!currentClass.rows) currentClass.rows = [[]];
            if (currentClass.rows.length === 0) currentClass.rows.push([]);
            currentClass.rows[0].push(nameToPlace);
          }
        }

        this.saveData();
        this.render();
      }

      closeModal(id) {
        document.getElementById(id).classList.remove('active');
      }

      // Where a dragged name would land among the seats of a row, section, line or group:
      // its index in that container's name list (the dragged name itself not counted),
      // plus a screen rectangle for the insertion marker.
      getDropInsertIndex(zoneEl, clientX, clientY) {
        const vertical = zoneEl.classList.contains('seat-drop-vertical');
        const seats = Array.from(zoneEl.children).filter(el => el.classList.contains('seat') && el.dataset.student !== this.draggedStudentName);
        if (seats.length === 0) return { index: 0, marker: null };
        const rects = seats.map(el => el.getBoundingClientRect());

        if (zoneEl.classList.contains('seat-drop-table')) {
          // Seats go clockwise around the table: land before or after the nearest seat,
          // on the side of the neighbour the pointer is heading toward
          const centers = rects.map(r => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 }));
          let near = 0;
          centers.forEach((c, i) => {
            if (Math.hypot(c.x - clientX, c.y - clientY) < Math.hypot(centers[near].x - clientX, centers[near].y - clientY)) near = i;
          });
          const c = centers[near];
          const prev = centers[near - 1] || c;
          const next = centers[near + 1] || c;
          let dx = next.x - prev.x;
          let dy = next.y - prev.y;
          if (!dx && !dy) dx = 1;
          const after = (clientX - c.x) * dx + (clientY - c.y) * dy > 0;
          const index = after ? near + 1 : near;
          const r = rects[near];
          const other = after ? centers[near + 1] : centers[near - 1];
          const sideways = Math.abs(dx) >= Math.abs(dy);
          if (sideways) {
            const x = other ? (c.x + other.x) / 2 : (after ? r.right + 6 : r.left - 6);
            return { index, marker: { left: x - 2, top: r.top, width: 4, height: r.height } };
          }
          const y = other ? (c.y + other.y) / 2 : (after ? r.bottom + 6 : r.top - 6);
          return { index, marker: { left: r.left, top: y - 2, width: r.width, height: 4 } };
        }

        if (vertical) {
          let index = rects.findIndex(r => clientY < r.top + r.height / 2);
          if (index === -1) index = rects.length;
          const ref = rects[Math.min(index, rects.length - 1)];
          const y = index < rects.length ? ref.top - 3 : ref.bottom + 3;
          return { index, marker: { left: ref.left, top: y - 2, width: ref.width, height: 4 } };
        }

        // Seats wrap, so group them into visual lines first
        const lines = [];
        rects.forEach((r, i) => {
          const line = lines[lines.length - 1];
          if (line && Math.abs(r.top - line.top) < r.height / 2) {
            line.items.push(i);
            line.bottom = Math.max(line.bottom, r.bottom);
          } else {
            lines.push({ top: r.top, bottom: r.bottom, items: [i] });
          }
        });
        let line = lines.find(l => clientY >= l.top && clientY <= l.bottom);
        if (!line) {
          const dist = l => Math.min(Math.abs(clientY - l.top), Math.abs(clientY - l.bottom));
          line = lines.reduce((best, l) => (dist(l) < dist(best) ? l : best), lines[0]);
        }
        const before = line.items.find(i => clientX < rects[i].left + rects[i].width / 2);
        const endIdx = line.items[line.items.length - 1];
        const index = (before === undefined) ? endIdx + 1 : before;
        const ref = rects[(before === undefined) ? endIdx : before];
        const x = (before === undefined) ? ref.right + 6 : ref.left - 6;
        return { index, marker: { left: x - 2, top: ref.top, width: 4, height: ref.height } };
      }

      // Dropping on the edge of a name card inserts beside it; the middle swaps.
      getSeatDropMode(seatEl, clientX, clientY) {
        const zoneEl = seatEl.parentElement;
        if (!zoneEl || !zoneEl.classList.contains('seat-drop-zone')) return 'swap';
        const r = seatEl.getBoundingClientRect();
        // At a table's two ends the neighbours are above and below
        const vertical = zoneEl.classList.contains('seat-drop-vertical') ||
          (zoneEl.classList.contains('seat-drop-table') && (seatEl.dataset.side === 'left' || seatEl.dataset.side === 'right'));
        const frac = vertical
          ? (clientY - r.top) / r.height
          : (clientX - r.left) / r.width;
        return (frac < 0.28 || frac > 0.72) ? 'insert' : 'swap';
      }

      updateSeatInsertMarker(e) {
        if (!this.isEditMode || !this.draggedStudentName || this.draggedGroupIndex !== null || !e.target || !e.target.closest) {
          this.hideSeatInsertMarker();
          return;
        }
        const seatEl = e.target.closest('.seat');
        const zoneEl = e.target.closest('.seat-drop-zone');
        if (!zoneEl) {
          this.hideSeatInsertMarker();
          return;
        }
        if (seatEl && seatEl.parentElement === zoneEl && seatEl.dataset.student !== this.draggedStudentName) {
          const isSwap = this.getSeatDropMode(seatEl, e.clientX, e.clientY) === 'swap';
          seatEl.classList.toggle('drag-over', isSwap);
          if (isSwap) {
            this.hideSeatInsertMarker();
            return;
          }
        }
        const { marker } = this.getDropInsertIndex(zoneEl, e.clientX, e.clientY);
        if (!marker) {
          this.hideSeatInsertMarker();
          return;
        }
        let el = document.getElementById('seatInsertMarker');
        if (!el) {
          el = document.createElement('div');
          el.id = 'seatInsertMarker';
          el.className = 'seat-insert-marker';
          document.body.appendChild(el);
        }
        el.style.left = `${marker.left}px`;
        el.style.top = `${marker.top}px`;
        el.style.width = `${marker.width}px`;
        el.style.height = `${marker.height}px`;
        el.style.display = 'block';
      }

      hideSeatInsertMarker() {
        const el = document.getElementById('seatInsertMarker');
        if (el) el.style.display = 'none';
        this.hideBandDropHint();
      }

      // The drop position inside a row/section/line/group, or the end when unknown.
      getDropIndexForEvent(e) {
        const zoneEl = e && e.currentTarget;
        if (!zoneEl || !zoneEl.classList || !zoneEl.classList.contains('seat-drop-zone')) return Infinity;
        return this.getDropInsertIndex(zoneEl, e.clientX, e.clientY).index;
      }

      insertAt(list, index, name) {
        const i = Math.max(0, Math.min(index, list.length));
        list.splice(i, 0, name);
      }

      // Drag Handlers
      handleDragStart(e, studentName, groupIndex) {
        if (!this.isEditMode) return;
        this.draggedStudentName = studentName;
        this.sourceGroupIndex = groupIndex;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', studentName);

        setTimeout(() => {
          e.target.classList.add('dragging');
        }, 0);
      }

      handleDragOver(e) {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }

      handleDragEnterGroup(e, targetIndex, elementIdPrefix) {
        if (!this.isEditMode) return;
        e.preventDefault();
        const el = document.getElementById(`${elementIdPrefix}-${targetIndex}`);
        if (el) el.classList.add('drag-over');
      }

      handleDragLeaveGroup(e, targetIndex, elementIdPrefix) {
        if (!this.isEditMode) return;
        const el = document.getElementById(`${elementIdPrefix}-${targetIndex}`);
        if (el && !el.contains(e.relatedTarget)) {
          el.classList.remove('drag-over');
        }
      }

      handleDropOnGroup(e, targetGroupIndex, layoutType) {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.stopPropagation();

        const el = document.getElementById(`group-box-${targetGroupIndex}`);
        if (el) el.classList.remove('drag-over');

        if (!this.draggedStudentName) return;
        const dropIndex = this.getDropIndexForEvent(e);

        const currentClass = this.getCurrentClass();
        if (!currentClass || currentClass.layout !== layoutType) return;

        const groupArr = currentClass.layoutsData[layoutType];
        if (!groupArr) return;

        if (this.sourceGroupIndex !== null && groupArr[this.sourceGroupIndex]) {
          const sIdx = groupArr[this.sourceGroupIndex].indexOf(this.draggedStudentName);
          if (sIdx > -1) groupArr[this.sourceGroupIndex].splice(sIdx, 1);
        } else {
          groupArr.forEach(g => {
            const sIdx = g.indexOf(this.draggedStudentName);
            if (sIdx > -1) g.splice(sIdx, 1);
          });
        }

        if (!groupArr[targetGroupIndex]) groupArr[targetGroupIndex] = [];
        this.insertAt(groupArr[targetGroupIndex], dropIndex, this.draggedStudentName);

        this.resetDragState();
        this.saveData();
        this.render();
      }

      handleDropOnRow(e, targetRowIndex, sectionIndex = 0) {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.stopPropagation();

        const rowEl = document.getElementById(`seat-row-${targetRowIndex}`);
        if (rowEl) rowEl.classList.remove('drag-over');

        if (!this.draggedStudentName) return;
        const dropIndex = this.getDropIndexForEvent(e);

        const currentClass = this.getCurrentClass();
        if (!currentClass || currentClass.layout !== 'rows') return;

        if (Array.isArray(currentClass.unplacedStudents)) {
          currentClass.unplacedStudents = currentClass.unplacedStudents.filter(n => n !== this.draggedStudentName);
        }

        if (currentClass.divideRows) {
          if (!Array.isArray(currentClass.dividedRowsData) || currentClass.dividedRowsData.length !== currentClass.rowsCount) {
            currentClass.dividedRowsData = [];
            for (let r = 0; r < currentClass.rowsCount; r++) {
              const rowStudents = currentClass.rows[r] || [];
              const halfIdx = Math.ceil(rowStudents.length / 2);
              currentClass.dividedRowsData.push([
                rowStudents.slice(0, halfIdx),
                rowStudents.slice(halfIdx)
              ]);
            }
          }

          // Remove student from any existing divided row section
          currentClass.dividedRowsData.forEach(rSecs => {
            if (Array.isArray(rSecs)) {
              rSecs.forEach(sec => {
                if (Array.isArray(sec)) {
                  const idx = sec.indexOf(this.draggedStudentName);
                  if (idx > -1) sec.splice(idx, 1);
                }
              });
            }
          });

          // Add to target section
          const targetSec = currentClass.dividedRowsData[targetRowIndex][sectionIndex || 0];
          if (Array.isArray(targetSec) && !targetSec.includes(this.draggedStudentName)) {
            this.insertAt(targetSec, dropIndex, this.draggedStudentName);
          }

          // Keep rows synchronized
          for (let r = 0; r < currentClass.rowsCount; r++) {
            const rSecs = currentClass.dividedRowsData[r];
            if (rSecs) {
              currentClass.rows[r] = [...(rSecs[0] || []), ...(rSecs[1] || [])];
            }
          }
        } else {
          const sourceRow = currentClass.rows[this.sourceGroupIndex];
          const sIndex = sourceRow ? sourceRow.indexOf(this.draggedStudentName) : -1;
          if (sIndex > -1) {
            sourceRow.splice(sIndex, 1);
          } else {
            currentClass.rows.forEach(r => {
              if (Array.isArray(r)) {
                const idx = r.indexOf(this.draggedStudentName);
                if (idx > -1) r.splice(idx, 1);
              }
            });
          }

          if (!currentClass.rows[targetRowIndex]) {
            currentClass.rows[targetRowIndex] = [];
          }
          this.insertAt(currentClass.rows[targetRowIndex], dropIndex, this.draggedStudentName);
        }

        this.resetDragState();
        this.saveData();
        this.render();
      }

      handleDragEnterSeat(e) {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
      }

      handleDragLeaveSeat(e) {
        if (!this.isEditMode) return;
        if (!e.currentTarget.contains(e.relatedTarget)) {
          e.currentTarget.classList.remove('drag-over');
        }
      }

      handleDropOnSeat(e, targetStudentName, targetGroupIndex) {
        if (!this.isEditMode) return;

        const seatEl = e.currentTarget;
        if (seatEl) seatEl.classList.remove('drag-over');

        // Edge of the card: let the drop bubble to the row/line/group, which inserts it here
        if (seatEl && this.draggedStudentName && this.getSeatDropMode(seatEl, e.clientX, e.clientY) === 'insert') return;

        e.preventDefault();
        e.stopPropagation();

        if (!this.draggedStudentName || this.draggedStudentName === targetStudentName) return;

        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        const layout = currentClass.layout;

        const isDraggedUnplaced = Array.isArray(currentClass.unplacedStudents) && currentClass.unplacedStudents.includes(this.draggedStudentName);
        if (isDraggedUnplaced) {
          currentClass.unplacedStudents = currentClass.unplacedStudents.filter(n => n !== this.draggedStudentName);
        }

        if (layout === 'circle') {
          if (!currentClass.circle) currentClass.circle = [];
          const i1 = currentClass.circle.indexOf(this.draggedStudentName);
          const i2 = currentClass.circle.indexOf(targetStudentName);
          if (i1 > -1 && i2 > -1) {
            currentClass.circle[i1] = targetStudentName;
            currentClass.circle[i2] = this.draggedStudentName;
          } else if (i2 > -1) {
            currentClass.circle[i2] = this.draggedStudentName;
            if (!currentClass.unplacedStudents) currentClass.unplacedStudents = [];
            if (!currentClass.unplacedStudents.includes(targetStudentName)) {
              currentClass.unplacedStudents.push(targetStudentName);
            }
          }
        } else if (layout === 'lines') {
          if (Array.isArray(currentClass.lines)) {
            let l1 = -1, s1 = -1;
            let l2 = -1, s2 = -1;

            currentClass.lines.forEach((line, li) => {
              if (Array.isArray(line)) {
                const idx1 = line.indexOf(this.draggedStudentName);
                if (idx1 > -1) { l1 = li; s1 = idx1; }
                const idx2 = line.indexOf(targetStudentName);
                if (idx2 > -1) { l2 = li; s2 = idx2; }
              }
            });

            if (l1 > -1 && s1 > -1 && l2 > -1 && s2 > -1) {
              currentClass.lines[l1][s1] = targetStudentName;
              currentClass.lines[l2][s2] = this.draggedStudentName;
            } else if (l2 > -1 && s2 > -1) {
              currentClass.lines[l2][s2] = this.draggedStudentName;
              if (!currentClass.unplacedStudents) currentClass.unplacedStudents = [];
              if (!currentClass.unplacedStudents.includes(targetStudentName)) {
                currentClass.unplacedStudents.push(targetStudentName);
              }
            }
          }
        } else if (['half', 'third', 'fourth', 'fifth', 'sixth'].includes(layout)) {
          const groupArr = currentClass.layoutsData ? currentClass.layoutsData[layout] : null;
          if (Array.isArray(groupArr)) {
            let g1 = -1, s1 = -1;
            let g2 = -1, s2 = -1;

            groupArr.forEach((g, gi) => {
              if (Array.isArray(g)) {
                const idx1 = g.indexOf(this.draggedStudentName);
                if (idx1 > -1) { g1 = gi; s1 = idx1; }
                const idx2 = g.indexOf(targetStudentName);
                if (idx2 > -1) { g2 = gi; s2 = idx2; }
              }
            });

            if (g1 > -1 && s1 > -1 && g2 > -1 && s2 > -1) {
              groupArr[g1][s1] = targetStudentName;
              groupArr[g2][s2] = this.draggedStudentName;
            } else if (g2 > -1 && s2 > -1) {
              groupArr[g2][s2] = this.draggedStudentName;
              if (!currentClass.unplacedStudents) currentClass.unplacedStudents = [];
              if (!currentClass.unplacedStudents.includes(targetStudentName)) {
                currentClass.unplacedStudents.push(targetStudentName);
              }
            }
          }
        } else {
          // Rows layout
          if (currentClass.divideRows && Array.isArray(currentClass.dividedRowsData)) {
            let r1 = -1, sec1 = -1, s1 = -1;
            let r2 = -1, sec2 = -1, s2 = -1;

            currentClass.dividedRowsData.forEach((rowSecs, ri) => {
              if (Array.isArray(rowSecs)) {
                rowSecs.forEach((sec, seci) => {
                  if (Array.isArray(sec)) {
                    const idx1 = sec.indexOf(this.draggedStudentName);
                    if (idx1 > -1) { r1 = ri; sec1 = seci; s1 = idx1; }
                    const idx2 = sec.indexOf(targetStudentName);
                    if (idx2 > -1) { r2 = ri; sec2 = seci; s2 = idx2; }
                  }
                });
              }
            });

            if (r1 > -1 && s1 > -1 && r2 > -1 && s2 > -1) {
              currentClass.dividedRowsData[r1][sec1][s1] = targetStudentName;
              currentClass.dividedRowsData[r2][sec2][s2] = this.draggedStudentName;
            } else if (r2 > -1 && s2 > -1) {
              currentClass.dividedRowsData[r2][sec2][s2] = this.draggedStudentName;
              if (!currentClass.unplacedStudents) currentClass.unplacedStudents = [];
              if (!currentClass.unplacedStudents.includes(targetStudentName)) {
                currentClass.unplacedStudents.push(targetStudentName);
              }
            }
          } else if (Array.isArray(currentClass.rows)) {
            let r1 = -1, s1 = -1;
            let r2 = -1, s2 = -1;

            currentClass.rows.forEach((row, ri) => {
              if (Array.isArray(row)) {
                const idx1 = row.indexOf(this.draggedStudentName);
                if (idx1 > -1) { r1 = ri; s1 = idx1; }
                const idx2 = row.indexOf(targetStudentName);
                if (idx2 > -1) { r2 = ri; s2 = idx2; }
              }
            });

            if (r1 > -1 && s1 > -1 && r2 > -1 && s2 > -1) {
              currentClass.rows[r1][s1] = targetStudentName;
              currentClass.rows[r2][s2] = this.draggedStudentName;
            } else if (r2 > -1 && s2 > -1) {
              currentClass.rows[r2][s2] = this.draggedStudentName;
              if (!currentClass.unplacedStudents) currentClass.unplacedStudents = [];
              if (!currentClass.unplacedStudents.includes(targetStudentName)) {
                currentClass.unplacedStudents.push(targetStudentName);
              }
            }
          }
        }

        this.resetDragState();
        this.saveData();
        this.render();
      }

      handleDropOnCircleSeat(e, targetStudentName) {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.stopPropagation();

        const seatEl = e.currentTarget;
        seatEl.classList.remove('drag-over');

        if (!this.draggedStudentName || this.draggedStudentName === targetStudentName) return;

        const currentClass = this.getCurrentClass();
        if (!currentClass || currentClass.layout !== 'circle') return;

        if (!currentClass.circle) currentClass.circle = [];
        let circleArr = [...currentClass.circle];

        circleArr = circleArr.filter(n => n !== this.draggedStudentName);

        const targetIndex = circleArr.indexOf(targetStudentName);
        if (targetIndex > -1) {
          circleArr.splice(targetIndex, 0, this.draggedStudentName);
        } else {
          circleArr.push(this.draggedStudentName);
        }

        currentClass.circle = circleArr;
        this.resetDragState();
        this.saveData();
        this.render();
      }

      handleDropOnRosterItem(e, targetIndex) {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.stopPropagation();

        const itemEl = e.currentTarget;
        if (itemEl) itemEl.classList.remove('drag-over');

        if (!this.draggedStudentName) return;

        const currentClass = this.getCurrentClass();
        if (!currentClass) return;
        // Band chairs have no list order to change from the roster
        if (currentClass.layout === 'band') {
          this.resetDragState();
          return;
        }

        if (Array.isArray(currentClass.unplacedStudents)) {
          currentClass.unplacedStudents = currentClass.unplacedStudents.filter(n => n !== this.draggedStudentName);
        }

        const layout = currentClass.layout;

        if (layout === 'circle') {
          if (!currentClass.circle) currentClass.circle = [];
          let circleArr = [...currentClass.circle].filter(n => n !== this.draggedStudentName);

          const clampedIndex = Math.max(0, Math.min(targetIndex, circleArr.length));
          circleArr.splice(clampedIndex, 0, this.draggedStudentName);
          currentClass.circle = circleArr;
        } else if (layout === 'lines') {
          const lineCapacities = (currentClass.lines || []).map(l => Array.isArray(l) ? l.length : 0);

          let all = [];
          if (currentClass.lines) currentClass.lines.forEach(l => { if (Array.isArray(l)) all.push(...l); });
          all = all.filter(n => n !== this.draggedStudentName);

          const clampedIndex = Math.max(0, Math.min(targetIndex, all.length));
          all.splice(clampedIndex, 0, this.draggedStudentName);

          const updatedLines = [];
          let currentIdx = 0;

          lineCapacities.forEach(cap => {
            updatedLines.push(all.slice(currentIdx, currentIdx + cap));
            currentIdx += cap;
          });

          if (currentIdx < all.length) {
            if (updatedLines.length === 0) updatedLines.push([]);
            updatedLines[updatedLines.length - 1].push(...all.slice(currentIdx));
          }

          currentClass.lines = updatedLines;
        } else if (['half', 'third', 'fourth', 'fifth', 'sixth'].includes(layout)) {
          const groupArr = currentClass.layoutsData ? currentClass.layoutsData[layout] : [];
          const groupCapacities = groupArr.map(g => Array.isArray(g) ? g.length : 0);

          let all = groupArr.flat().filter(n => n !== this.draggedStudentName);
          const clampedIndex = Math.max(0, Math.min(targetIndex, all.length));
          all.splice(clampedIndex, 0, this.draggedStudentName);

          const updatedGroups = [];
          let currentIdx = 0;
          groupCapacities.forEach(cap => {
            updatedGroups.push(all.slice(currentIdx, currentIdx + cap));
            currentIdx += cap;
          });
          if (currentIdx < all.length) {
            if (updatedGroups.length === 0) updatedGroups.push([]);
            updatedGroups[updatedGroups.length - 1].push(...all.slice(currentIdx));
          }
          currentClass.layoutsData[layout] = updatedGroups;
        } else {
          // Rows layout (support divideRows and normal rows)
          if (currentClass.divideRows && Array.isArray(currentClass.dividedRowsData)) {
            const secCapacities = [];
            let all = [];
            currentClass.dividedRowsData.forEach(rSecs => {
              const cap0 = Array.isArray(rSecs[0]) ? rSecs[0].length : 0;
              const cap1 = Array.isArray(rSecs[1]) ? rSecs[1].length : 0;
              secCapacities.push([cap0, cap1]);
              if (Array.isArray(rSecs[0])) all.push(...rSecs[0]);
              if (Array.isArray(rSecs[1])) all.push(...rSecs[1]);
            });

            all = all.filter(n => n !== this.draggedStudentName);
            const clampedIndex = Math.max(0, Math.min(targetIndex, all.length));
            all.splice(clampedIndex, 0, this.draggedStudentName);

            const updatedDividedRows = [];
            let currentIdx = 0;

            secCapacities.forEach(([cap0, cap1]) => {
              const sec0 = all.slice(currentIdx, currentIdx + cap0);
              currentIdx += cap0;
              const sec1 = all.slice(currentIdx, currentIdx + cap1);
              currentIdx += cap1;
              updatedDividedRows.push([sec0, sec1]);
            });

            if (currentIdx < all.length) {
              if (updatedDividedRows.length === 0) updatedDividedRows.push([[], []]);
              updatedDividedRows[updatedDividedRows.length - 1][1].push(...all.slice(currentIdx));
            }

            currentClass.dividedRowsData = updatedDividedRows;

            // Keep currentClass.rows in sync
            for (let r = 0; r < (currentClass.rowsCount || 4); r++) {
              const rSecs = currentClass.dividedRowsData[r];
              if (rSecs) {
                currentClass.rows[r] = [...(rSecs[0] || []), ...(rSecs[1] || [])];
              }
            }
          } else {
            const rowCapacities = (currentClass.rows || []).map(r => Array.isArray(r) ? r.length : 0);

            let all = [];
            if (currentClass.rows) currentClass.rows.forEach(r => { if (Array.isArray(r)) all.push(...r); });
            all = all.filter(n => n !== this.draggedStudentName);

            const clampedIndex = Math.max(0, Math.min(targetIndex, all.length));
            all.splice(clampedIndex, 0, this.draggedStudentName);

            const updatedRows = [];
            let currentIdx = 0;

            rowCapacities.forEach(cap => {
              updatedRows.push(all.slice(currentIdx, currentIdx + cap));
              currentIdx += cap;
            });

            if (currentIdx < all.length) {
              if (updatedRows.length === 0) updatedRows.push([]);
              updatedRows[updatedRows.length - 1].push(...all.slice(currentIdx));
            }

            currentClass.rows = updatedRows;
          }
        }

        this.resetDragState();
        this.saveData();
        this.render();
      }

      handleDragEnterSeat(e) {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
      }

      handleDragLeaveSeat(e) {
        if (!this.isEditMode) return;
        e.currentTarget.classList.remove('drag-over');
      }

      handleDragEnd(e) {
        this.resetDragState();
        document.querySelectorAll('.seat.dragging, .roster-item.dragging').forEach(el => el.classList.remove('dragging'));
        document.querySelectorAll('.seat.drag-over, .roster-item.drag-over, .group-box.drag-over, .band-chair-open.drag-over, .band-drop-insert').forEach(el => el.classList.remove('drag-over', 'band-drop-insert'));
      }

      resetDragState() {
        this.hideSeatInsertMarker();
        this.draggedStudentName = null;
        this.sourceGroupIndex = null;
        this.draggedGroupIndex = null;
      }

      playCameraSound() {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!AudioContext) return;
          const ctx = new AudioContext();

          // 1. Shutter noise burst
          const bufferSize = ctx.sampleRate * 0.04;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.value = 1000;

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          noise.start();

          // 2. Mechanical click tone
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.03);

          oscGain.gain.setValueAtTime(0.4, ctx.currentTime);
          oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

          osc.connect(oscGain);
          oscGain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.03);
        } catch (e) {
          // Audio fallback
        }
      }

      triggerCameraClick(btnEl) {
        this.playCameraSound();

        if (btnEl) {
          btnEl.classList.add('camera-btn-flash');
          setTimeout(() => {
            btnEl.classList.remove('camera-btn-flash');
          }, 250);
        }

        // 1. Screen flash visual effect
        const flashOverlay = document.createElement('div');
        flashOverlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--paper); opacity: 0.6; z-index: 10000; pointer-events: none; transition: opacity 0.25s ease-out;';
        document.body.appendChild(flashOverlay);

        setTimeout(() => {
          flashOverlay.style.opacity = '0';
          setTimeout(() => {
            if (flashOverlay.parentNode) {
              flashOverlay.parentNode.removeChild(flashOverlay);
            }
          }, 250);
        }, 50);

        // 2. Full Seating Chart Snapshot & JPEG Export
        const currentClass = this.getCurrentClass();
        const className = (currentClass && currentClass.name) ? currentClass.name : 'Class Seating Chart';

        const wrapper = document.createElement('div');
        wrapper.className = 'snapshot-export-wrapper';
        wrapper.style.cssText = 'position: absolute; left: -9999px; top: -9999px; background: var(--paper); padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; box-sizing: border-box; font-family: Segoe UI, system-ui, -apple-system, sans-serif; width: 1100px; min-height: 700px;';

        // Class Name Title Banner
        const titleEl = document.createElement('div');
        titleEl.style.cssText = 'font-size: 1.8rem; font-weight: 800; color: var(--ink); text-align: center; margin-bottom: 20px; letter-spacing: 0.5px;';
        titleEl.textContent = className;
        wrapper.appendChild(titleEl);

        // Chalkboard Front Banner
        const chalkboard = document.getElementById('chalkboardFront');
        if (chalkboard && (!currentClass || (currentClass.layout !== 'circle' && currentClass.layout !== 'garden' && currentClass.layout !== 'band'))) {
          const cbClone = chalkboard.cloneNode(true);
          // html2canvas can't draw CSS zoom (it shrinks the boxes but not the text), so the picture
          // is drawn at full size and fitted to its own page instead
          cbClone.style.zoom = '1';
          cbClone.style.margin = '0 0 24px 0';
          cbClone.style.width = '550px';
          cbClone.style.maxWidth = '100%';
          wrapper.appendChild(cbClone);
        }

        // Full Seating Chart Container Clone
        const chartContainer = document.getElementById('chartContainer');
        if (chartContainer) {
          const chartClone = chartContainer.cloneNode(true);
          chartClone.querySelectorAll('.row-align-dots, .circle-dial-container, .group-drag-handle, .table-shape-btn, .resize-handle, .remove-btn, .band-tag-none').forEach(el => el.remove());
          // html2canvas draws transform but not the scale property that shrinks a crowded table's cards
          chartClone.querySelectorAll('.seat').forEach(el => {
            if (el.style.scale) {
              el.style.transform = `scale(${el.style.scale})`;
              el.style.scale = '';
            }
          });
          chartClone.style.zoom = '1';
          chartClone.style.maxWidth = '1000px';
          chartClone.style.width = '100%';
          chartClone.style.minHeight = 'auto';
          // A table floor laid out in full screen can be wider than the picture: shrink it to fit
          const cloneFloor = chartClone.querySelector('.table-floor, .band-floor');
          if (cloneFloor) {
            const floorW = parseFloat(cloneFloor.style.width) || 1000;
            const floorH = parseFloat(cloneFloor.style.height) || 0;
            const k = Math.min(1, 1000 / floorW);
            cloneFloor.style.transform = k < 1 ? `scale(${k.toFixed(4)})` : '';
            cloneFloor.style.marginBottom = k < 1 ? `${-floorH * (1 - k)}px` : '';
            if (cloneFloor.classList.contains('band-floor')) cloneFloor.style.marginLeft = `max(0px, calc((100% - ${(floorW * k).toFixed(1)}px) / 2))`;
          }
          if (currentClass && currentClass.layout === 'garden') {
            const perBed = Math.max(1, ...Array.from(chartClone.querySelectorAll('.garden-bed'), bed => bed.children.length));
            const liveW = parseFloat(chartContainer.style.getPropertyValue('--garden-w')) || 110;
            const cloneW = Math.min(liveW, this.gardenWidthFor(1000, perBed));
            chartClone.style.setProperty('--garden-w', `${cloneW}px`);
            chartClone.querySelectorAll('.garden-bed').forEach(bed => {
              bed.style.width = `${Math.ceil(perBed * cloneW * GARDEN.pitch + GARDEN.bedPadX)}px`;
            });
          }
          wrapper.appendChild(chartClone);
        }

        document.body.appendChild(wrapper);

        const performDownload = (canvas) => {
          try {
            const jpegUrl = canvas.toDataURL('image/jpeg', 0.92);
            const link = document.createElement('a');
            const rawLayout = (currentClass && currentClass.layout) ? currentClass.layout : 'rows';
            const layoutName = rawLayout.charAt(0).toUpperCase() + rawLayout.slice(1);
            const safeClassName = className.replace(/[^a-z0-9]/gi, '_');
            const safeFileName = `${safeClassName}_${layoutName}_Seating_Chart.jpeg`;
            link.download = safeFileName;
            link.href = jpegUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (e) {
            console.error("Download failed:", e);
          } finally {
            if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
          }
        };

        if (typeof window.html2canvas === 'function') {
          window.html2canvas(wrapper, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            width: wrapper.scrollWidth,
            height: wrapper.scrollHeight
          }).then(performDownload).catch(err => {
            if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
          });
        } else {
          setTimeout(() => {
            if (typeof window.html2canvas === 'function') {
              window.html2canvas(wrapper, { scale: 2, backgroundColor: '#ffffff' }).then(performDownload);
            } else if (wrapper.parentNode) {
              wrapper.parentNode.removeChild(wrapper);
            }
          }, 300);
        }
      }

      triggerAttendanceCameraClick(btnEl) {
        this.playCameraSound();

        if (btnEl) {
          btnEl.classList.add('camera-btn-flash');
          setTimeout(() => {
            btnEl.classList.remove('camera-btn-flash');
          }, 250);
        }

        // Screen flash visual effect
        const flashOverlay = document.createElement('div');
        flashOverlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--paper); opacity: 0.6; z-index: 10000; pointer-events: none; transition: opacity 0.25s ease-out;';
        document.body.appendChild(flashOverlay);

        setTimeout(() => {
          flashOverlay.style.opacity = '0';
          setTimeout(() => {
            if (flashOverlay.parentNode) {
              flashOverlay.parentNode.removeChild(flashOverlay);
            }
          }, 250);
        }, 50);

        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        const rawClassName = currentClass.name || 'Class';
        const safeClassName = rawClassName.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_');
        const classList = currentClass.classList || [];
        const dates = Array.isArray(currentClass.attendanceDates) ? currentClass.attendanceDates : this.getDefaultAttendanceDates();

        // Calculate exact required width so no names or date columns overlap
        const minWidth = Math.max(900, 260 + dates.length * 80);

        const wrapper = document.createElement('div');
        wrapper.className = 'snapshot-export-wrapper';
        wrapper.style.cssText = `position: absolute; left: -9999px; top: -9999px; background: var(--paper); padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; box-sizing: border-box; font-family: Segoe UI, system-ui, -apple-system, sans-serif; width: ${minWidth}px;`;

        // Banner Title
        const titleEl = document.createElement('div');
        titleEl.style.cssText = 'font-size: 1.75rem; font-weight: 800; color: var(--ink); text-align: center; margin-bottom: 24px; letter-spacing: 0.5px;';
        titleEl.textContent = `${rawClassName} — Attendance Register`;
        wrapper.appendChild(titleEl);

        // Build pristine export table (standard table, no position:sticky!)
        const exportTable = document.createElement('table');
        exportTable.style.cssText = 'width: 100%; border-collapse: collapse; background: var(--paper); font-size: 0.95rem; font-family: inherit; text-align: center;';

        // Table Header
        let theadHTML = '<thead><tr style="background-color: var(--paper-2);">';
        theadHTML += '<th style="padding: 12px 16px; border: 1px solid var(--line-strong); font-weight: 700; color: var(--ink); text-align: left; min-width: 220px; background-color: var(--paper-3);">Student Name</th>';
        dates.forEach(d => {
          theadHTML += `<th style="padding: 10px 12px; border: 1px solid var(--line-strong); min-width: 65px; background-color: var(--paper-2); vertical-align: middle;">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.25;">
              <span style="font-weight: 800; font-size: 0.9rem; color: var(--ink);">${d.date}</span>
              <span style="font-weight: 600; font-size: 0.75rem; color: var(--ink-muted); margin-top: 2px;">${d.day}</span>
            </div>
          </th>`;
        });
        theadHTML += '</tr></thead>';

        // Table Body
        let tbodyHTML = '<tbody>';
        if (classList.length === 0) {
          tbodyHTML += `<tr><td colspan="${dates.length + 1}" style="padding: 30px; text-align: center; color: var(--ink-faint); font-style: italic; border: 1px solid var(--line-strong);">No students in this class list</td></tr>`;
        } else {
          classList.forEach((student, rIdx) => {
            const profile = this.getStudentProfile(currentClass, student);
            const fullName = (profile.lastName && profile.lastName.trim())
              ? `${profile.firstName} ${profile.lastName}`
              : (profile.firstName || student);

            let presentCount = 0;
            let recordedCount = 0;
            let dateCells = '';

            dates.forEach(d => {
              let status = (d.statuses && d.statuses[student] !== undefined) ? d.statuses[student] : null;

              if (status === 'present' || status === 'absent') recordedCount++;
              if (status === 'present') {
                presentCount++;
                dateCells += `<td style="padding: 8px; border: 1px solid var(--line); vertical-align: middle;">
                  <span style="color: var(--green); font-weight: 800; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: var(--green-soft); border: 1px solid var(--green-line);">✓</span>
                </td>`;
              } else if (status === 'absent') {
                dateCells += `<td style="padding: 8px; border: 1px solid var(--line); vertical-align: middle;">
                  <span style="color: var(--red); font-weight: 800; font-size: 1rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: var(--red-soft); border: 1px solid var(--red-line);">✕</span>
                </td>`;
              } else {
                dateCells += `<td style="padding: 8px; border: 1px solid var(--line); vertical-align: middle;"></td>`;
              }
            });

            const ratioText = `(${presentCount}/${recordedCount})`;
            const rowBg = (rIdx % 2 === 1) ? '#f8fafc' : '#ffffff';

            tbodyHTML += `<tr style="background-color: ${rowBg};">
              <td style="padding: 10px 14px; border: 1px solid var(--line-strong); font-weight: 600; color: var(--ink); text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                  <span>${this.escapeHtml(fullName)}</span>
                  <span style="font-size: 0.8rem; font-weight: 800; color: var(--primary); background: var(--primary-soft); padding: 2px 7px; border-radius: 12px; white-space: nowrap;">${ratioText}</span>
                </div>
              </td>
              ${dateCells}
            </tr>`;
          });
        }
        tbodyHTML += '</tbody>';

        exportTable.innerHTML = theadHTML + tbodyHTML;
        wrapper.appendChild(exportTable);
        document.body.appendChild(wrapper);

        const performDownload = (canvas) => {
          if (wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
          }
          const link = document.createElement('a');
          link.download = `${safeClassName}_Attendance_Register.jpeg`;
          link.href = canvas.toDataURL('image/jpeg', 0.95);
          link.click();
        };

        if (typeof html2canvas === 'function') {
          html2canvas(wrapper, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' })
            .then(performDownload)
            .catch(err => {
              if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
              console.error('Attendance snapshot error:', err);
            });
        } else if (typeof window.html2canvas === 'function') {
          window.html2canvas(wrapper, { scale: 2, backgroundColor: '#ffffff' })
            .then(performDownload)
            .catch(err => {
              if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
              console.error('Attendance snapshot error:', err);
            });
        } else {
          if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
        }
      }

      triggerGradesCameraClick(btnEl) {
        this.playCameraSound();

        if (btnEl) {
          btnEl.classList.add('camera-btn-flash');
          setTimeout(() => {
            btnEl.classList.remove('camera-btn-flash');
          }, 250);
        }

        const flashOverlay = document.createElement('div');
        flashOverlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--paper); opacity: 0.6; z-index: 10000; pointer-events: none; transition: opacity 0.25s ease-out;';
        document.body.appendChild(flashOverlay);

        setTimeout(() => {
          flashOverlay.style.opacity = '0';
          setTimeout(() => {
            if (flashOverlay.parentNode) {
              flashOverlay.parentNode.removeChild(flashOverlay);
            }
          }, 250);
        }, 50);

        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        const rawClassName = currentClass.name || 'Class';
        const safeClassName = rawClassName.replace(/[^a-zA-Z0-9_\-]/g, '_').replace(/_+/g, '_');
        const classList = currentClass.classList || [];
        const gradeCols = this.getClassGradeColumns(currentClass);
        const subjId = this.getClassSubjectId(currentClass);
        const subjObj = this.subjects.find(s => s.id === subjId);
        const subjName = subjObj ? subjObj.name : 'Music';

        const minWidth = Math.max(900, 260 + gradeCols.length * 90);

        const wrapper = document.createElement('div');
        wrapper.className = 'snapshot-export-wrapper';
        wrapper.style.cssText = `position: absolute; left: -9999px; top: -9999px; background: var(--paper); padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; box-sizing: border-box; font-family: Segoe UI, system-ui, -apple-system, sans-serif; width: ${minWidth}px;`;

        const titleEl = document.createElement('div');
        titleEl.style.cssText = 'font-size: 1.75rem; font-weight: 800; color: var(--ink); text-align: center; margin-bottom: 24px; letter-spacing: 0.5px;';
        titleEl.textContent = `${rawClassName} — Grades Register (${subjName})`;
        wrapper.appendChild(titleEl);

        const exportTable = document.createElement('table');
        exportTable.style.cssText = 'width: 100%; border-collapse: collapse; background: var(--paper); font-size: 0.95rem; font-family: inherit; text-align: center;';

        let theadHTML = '<thead><tr style="background-color: var(--paper-2);">';
        theadHTML += '<th style="padding: 12px 16px; border: 1px solid var(--line-strong); font-weight: 700; color: var(--ink); text-align: left; min-width: 220px; background-color: var(--paper-3);">Student Name</th>';
        gradeCols.forEach(col => {
          const theme = this.getCategoryTheme(col.title);

          theadHTML += `<th style="padding: 10px 12px; border: 1px solid ${theme.border}; min-width: 80px; background-color: ${theme.bgCell}; vertical-align: middle;">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.25;">
              <span style="font-weight: 800; font-size: 0.85rem; color: ${theme.color}; background: ${theme.bgHeader}; padding: 2px 8px; border-radius: 12px; border: 1px solid ${theme.border};">${this.escapeHtml(col.title || 'Grade')}</span>
              <span style="font-weight: 700; font-size: 0.8rem; color: var(--ink); margin-top: 3px;">${col.date}</span>
            </div>
          </th>`;
        });
        theadHTML += '</tr></thead>';

        let tbodyHTML = '<tbody>';
        if (classList.length === 0) {
          tbodyHTML += `<tr><td colspan="${gradeCols.length + 1}" style="padding: 30px; text-align: center; color: var(--ink-faint); font-style: italic; border: 1px solid var(--line-strong);">No students in this class list</td></tr>`;
        } else {
          classList.forEach((student, rIdx) => {
            const profile = this.getStudentProfile(currentClass, student);
            const fullName = (profile.lastName && profile.lastName.trim())
              ? `${profile.firstName} ${profile.lastName}`
              : (profile.firstName || student);

            let gradeCells = '';

            gradeCols.forEach(col => {
              const theme = this.getCategoryTheme(col.title);
              const gradeVal = (col.grades && col.grades[student] !== undefined) ? col.grades[student] : '';
              const attRecord = this.getAttendanceRecordForDate(currentClass, col.date);
              const attStatus = attRecord ? (attRecord.statuses && attRecord.statuses[student]) : null;

              let attIndicatorHTML = '';
              let cellBg = theme.bgCell;

              if (this.showGradesAttendanceIndicators !== false && attStatus) {
                if (attStatus === 'absent') {
                  attIndicatorHTML = `<span style="position: absolute; top: 3px; right: 3px; width: 7px; height: 7px; border-radius: 50%; background-color: var(--red);"></span>`;
                  cellBg = '#fef2f2';
                } else if (attStatus === 'present') {
                  attIndicatorHTML = `<span style="position: absolute; top: 3px; right: 3px; width: 7px; height: 7px; border-radius: 50%; background-color: var(--green);"></span>`;
                }
              }

              let symbolHTML = '';
              const isPoints = (col.gradingStyle === 'points') || (!col.gradingStyle && col.maxPoints !== undefined);

              if (isPoints) {
                if (gradeVal !== '' && gradeVal !== null && gradeVal !== undefined && !isNaN(Number(gradeVal))) {
                  const earned = Number(gradeVal);
                  const maxPts = Number(col.maxPoints || 10);
                  const pct = Math.round((earned / maxPts) * 100);
                  symbolHTML = `<span style="font-weight: 700; font-size: 0.88rem; color: var(--ink); white-space: nowrap;">${earned}/${maxPts} <span style="font-size: 0.8rem; font-weight: 600; color: var(--ink-muted);">(${pct}%)</span></span>`;
                } else {
                  symbolHTML = `<span style="color: var(--line-strong); font-weight: bold;">—</span>`;
                }
              } else if (String(gradeVal) === '4') {
                symbolHTML = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; font-weight: 900; font-size: 0.95rem; background: #fef08a; color: #854d0e; border: 1px solid #fde047;">4</span>`;
              } else if (String(gradeVal) === '3') {
                symbolHTML = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; font-weight: 900; font-size: 0.95rem; background: #bbf7d0; color: var(--green-dark); border: 1px solid var(--green-line);">3</span>`;
              } else if (String(gradeVal) === '2') {
                symbolHTML = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; font-weight: 900; font-size: 0.95rem; background: #fed7aa; color: #9a3412; border: 1px solid var(--orange-line);">2</span>`;
              } else if (String(gradeVal) === '1') {
                symbolHTML = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; font-weight: 900; font-size: 0.95rem; background: var(--red-line); color: var(--red-dark); border: 1px solid var(--red-line);">1</span>`;
              } else if (gradeVal === 'star') {
                symbolHTML = `<span style="color: #b45309; font-weight: 900; font-size: 1.15rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: #fef3c7; border: 1px solid #fbbf24;">★</span>`;
              } else if (gradeVal === 'check' || gradeVal === 'plus') {
                symbolHTML = `<span style="color: var(--green); font-weight: 900; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: var(--green-soft); border: 1px solid var(--green-line);">+</span>`;
              } else if (gradeVal === 'minus') {
                symbolHTML = `<span style="color: var(--red); font-weight: 900; font-size: 1.2rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: var(--red-soft); border: 1px solid var(--red-line);">−</span>`;
              } else if (gradeVal === 'x') {
                symbolHTML = `<span style="color: var(--red); font-weight: 900; font-size: 1rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: var(--red-soft); border: 1px solid var(--red-line);">✕</span>`;
              } else {
                symbolHTML = ``;
              }

              gradeCells += `<td style="padding: 8px; border: 1px solid ${theme.border}; background-color: ${cellBg}; vertical-align: middle; position: relative;">
                ${attIndicatorHTML}
                ${symbolHTML}
              </td>`;
            });

            const showGradesRatio = (this.showGradesAttendanceIndicators !== false) && (currentClass ? (currentClass.showGradesAttendanceRatio !== false) : true);
            const ratioText = showGradesRatio ? this.getStudentAttendanceRatio(currentClass, student) : '';
            const ratioHTML = showGradesRatio ? `<span class="register-ratio">${ratioText}</span>` : '';
            const rowBg = (rIdx % 2 === 1) ? '#ffffff' : '#ffffff';
            tbodyHTML += `<tr style="background-color: ${rowBg};">
              <td style="padding: 10px 14px; border: 1px solid var(--line-strong); font-weight: 600; color: var(--ink); text-align: left; background-color: var(--paper);">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span>${this.escapeHtml(fullName)}</span>
                  ${ratioHTML}
                </div>
              </td>
              ${gradeCells}
            </tr>`;
          });
        }
        tbodyHTML += '</tbody>';

        exportTable.innerHTML = theadHTML + tbodyHTML;
        wrapper.appendChild(exportTable);
        document.body.appendChild(wrapper);

        const performDownload = (canvas) => {
          if (wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
          }
          const link = document.createElement('a');
          link.download = `${safeClassName}_Grades_Register.jpeg`;
          link.href = canvas.toDataURL('image/jpeg', 0.95);
          link.click();
        };

        if (typeof html2canvas === 'function') {
          html2canvas(wrapper, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' })
            .then(performDownload)
            .catch(err => {
              if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
              console.error('Grades snapshot error:', err);
            });
        } else if (typeof window.html2canvas === 'function') {
          window.html2canvas(wrapper, { scale: 2, backgroundColor: '#ffffff' })
            .then(performDownload)
            .catch(err => {
              if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
              console.error('Grades snapshot error:', err);
            });
        } else {
          if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
        }
      }

      makeResizable(el, sizeKey) {
        if (!el || !sizeKey) return;

        let handleBR = el.querySelector('.resize-handle-br');
        if (!handleBR) {
          handleBR = document.createElement('div');
          handleBR.className = 'resize-handle resize-handle-br';
          handleBR.title = 'Resize from Bottom-Right';
          handleBR.innerHTML = '◢';
          el.appendChild(handleBR);
        }

        let handleBL = el.querySelector('.resize-handle-bl');
        if (!handleBL) {
          handleBL = document.createElement('div');
          handleBL.className = 'resize-handle resize-handle-bl';
          handleBL.title = 'Resize from Bottom-Left';
          handleBL.innerHTML = '◣';
          el.appendChild(handleBL);
        }

        const startResize = (e, direction) => {
          if (!this.isEditMode) return;
          e.preventDefault();
          e.stopPropagation();

          const isRow = el.classList.contains('seat-row');
          const startX = e.clientX;
          const startY = e.clientY;
          const startWidth = el.offsetWidth;
          const startHeight = el.offsetHeight;

          const parentContainer = el.parentElement;
          const containerWidth = parentContainer ? parentContainer.clientWidth : 1000;
          const gap = 20;

          const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            if (!isRow) {
              let newWidth = startWidth;
              if (direction === 'br') {
                newWidth = startWidth + deltaX;
              } else if (direction === 'bl') {
                newWidth = startWidth - deltaX;
              }

              const isFreeform = el.classList.contains('freeform-canvas-box') || sizeKey === 'freeform';

              if (isFreeform) {
                // Freeform can expand freely beyond viewport width to enable horizontal scrolling
                if (newWidth >= 200 && newWidth <= 4000) {
                  el.style.width = `${newWidth}px`;
                }
              } else {
                // Calculate remaining width from sibling boxes in the same row slot
                let maxAllowedWidth = containerWidth;
                if (parentContainer) {
                  const siblings = Array.from(parentContainer.querySelectorAll('.group-box')).filter(b => b !== el);
                  if (siblings.length > 0) {
                    const totalSiblingsWidth = siblings.reduce((sum, b) => sum + b.offsetWidth, 0);
                    const totalGaps = siblings.length * gap + 40;
                    maxAllowedWidth = Math.max(150, containerWidth - totalSiblingsWidth - totalGaps);
                  } else {
                    maxAllowedWidth = Math.max(300, containerWidth - 20);
                  }
                }

                if (newWidth >= 120 && newWidth <= maxAllowedWidth) {
                  el.style.width = `${newWidth}px`;
                } else if (newWidth > maxAllowedWidth) {
                  el.style.width = `${maxAllowedWidth}px`;
                }
              }
            }

            const newHeight = startHeight + deltaY;
            if (newHeight >= 60) {
              if (isRow) {
                el.style.minHeight = `${newHeight}px`;
              } else {
                el.style.height = `${newHeight}px`;
              }
            }

            // A group table re-seats its students around the table as it changes size
            if (typeof el._relayout === 'function') {
              el._relayout(parseFloat(el.style.width) || el.offsetWidth, parseFloat(el.style.height) || el.offsetHeight);
            }
          };

          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const currentClass = this.getCurrentClass();
            if (currentClass) {
              if (!currentClass.containerSizes) currentClass.containerSizes = {};
              // Keep anything else saved with the size (a table's round/square shape)
              currentClass.containerSizes[sizeKey] = {
                ...(currentClass.containerSizes[sizeKey] || {}),
                width: el.offsetWidth,
                height: el.offsetHeight
              };
              this.saveData();
            }
          };

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        };

        handleBR.onmousedown = (e) => startResize(e, 'br');
        handleBL.onmousedown = (e) => startResize(e, 'bl');
      }

      syncUnplacedWithClassList(currentClass) {
        if (!currentClass || !Array.isArray(currentClass.classList)) return;
        
        const allowedNames = new Set(currentClass.classList.filter(Boolean));

        // 1. Clean Rows Layout
        if (currentClass.divideRows && Array.isArray(currentClass.dividedRowsData)) {
          const seen = new Set();
          currentClass.dividedRowsData = currentClass.dividedRowsData.map(rSecs => {
            if (!Array.isArray(rSecs)) return [[], []];
            return rSecs.map(sec => {
              if (!Array.isArray(sec)) return [];
              return sec.filter(name => {
                if (allowedNames.has(name) && !seen.has(name)) {
                  seen.add(name);
                  return true;
                }
                return false;
              });
            });
          });

          if (Array.isArray(currentClass.rows)) {
            for (let r = 0; r < (currentClass.rowsCount || 4); r++) {
              const rSecs = currentClass.dividedRowsData[r];
              if (rSecs) {
                currentClass.rows[r] = [...(rSecs[0] || []), ...(rSecs[1] || [])];
              }
            }
          }
        } else if (Array.isArray(currentClass.rows)) {
          const seen = new Set();
          currentClass.rows = currentClass.rows.map(row => {
            if (!Array.isArray(row)) return [];
            return row.filter(name => {
              if (allowedNames.has(name) && !seen.has(name)) {
                seen.add(name);
                return true;
              }
              return false;
            });
          });
        }

        // 2. Clean Circle Layout
        if (Array.isArray(currentClass.circle)) {
          const seen = new Set();
          currentClass.circle = currentClass.circle.filter(name => {
            if (allowedNames.has(name) && !seen.has(name)) {
              seen.add(name);
              return true;
            }
            return false;
          });
        }

        // 3. Clean Lines Layout
        if (Array.isArray(currentClass.lines)) {
          const seen = new Set();
          currentClass.lines = currentClass.lines.map(line => {
            if (!Array.isArray(line)) return [];
            return line.filter(name => {
              if (allowedNames.has(name) && !seen.has(name)) {
                seen.add(name);
                return true;
              }
              return false;
            });
          });
        }

        // 4. Clean Free Form Layout
        if (Array.isArray(currentClass.freeform)) {
          const seen = new Set();
          currentClass.freeform = currentClass.freeform.filter(name => {
            if (allowedNames.has(name) && !seen.has(name)) {
              seen.add(name);
              return true;
            }
            return false;
          });
        }
        if (currentClass.freeformPositions && typeof currentClass.freeformPositions === 'object') {
          Object.keys(currentClass.freeformPositions).forEach(name => {
            if (!allowedNames.has(name)) {
              delete currentClass.freeformPositions[name];
            }
          });
        }

        // 5. Clean Group Layouts (only target group layout keys, not row metadata keys!)
        ['half', 'third', 'fourth', 'fifth', 'sixth'].forEach(layoutKey => {
          const groups = currentClass.layoutsData ? currentClass.layoutsData[layoutKey] : null;
          if (Array.isArray(groups)) {
            const seen = new Set();
            currentClass.layoutsData[layoutKey] = groups.map(g => {
              if (!Array.isArray(g)) return [];
              return g.filter(name => {
                if (allowedNames.has(name) && !seen.has(name)) {
                  seen.add(name);
                  return true;
                }
                return false;
              });
            });
          }
        });

        // Special seating rules about a student who has left the class go with them
        if (Array.isArray(currentClass.seatingRules) && currentClass.seatingRules.some(r => !allowedNames.has(r.student) || (r.other && !allowedNames.has(r.other)))) {
          currentClass.seatingRules = currentClass.seatingRules.filter(r => allowedNames.has(r.student) && (!r.other || allowedNames.has(r.other)));
        }

        // Band chairs: a name not on the class list, or already in another chair, leaves its chair open
        if (currentClass.band) {
          const seen = new Set();
          this.getBandChairs(currentClass.band).forEach(ch => {
            if (!ch.student) return;
            if (!allowedNames.has(ch.student) || seen.has(ch.student)) ch.student = '';
            else seen.add(ch.student);
          });
        }

        // 6. Ensure active group layout is populated if empty
        const activeLayout = currentClass.layout || 'rows';
        if (activeLayout === 'band' && !currentClass.band) {
          currentClass.band = this.createDefaultBand(this.sortStudentsByName([...allowedNames], 'last'));
        }
        if (['half', 'third', 'fourth', 'fifth', 'sixth'].includes(activeLayout)) {
          const numGroups = activeLayout === 'half' ? 2 : activeLayout === 'third' ? 3 : activeLayout === 'fourth' ? 4 : activeLayout === 'fifth' ? 5 : 6;
          const gArr = currentClass.layoutsData ? currentClass.layoutsData[activeLayout] : null;
          if (!gArr || !Array.isArray(gArr) || gArr.length < numGroups || gArr.flat().length === 0) {
            if (!currentClass.layoutsData) currentClass.layoutsData = {};
            currentClass.layoutsData[activeLayout] = this.autoBalanceGroups([...allowedNames], numGroups);
          }
        } else if (activeLayout === 'freeform') {
          if (!currentClass.freeform || currentClass.freeform.length === 0) {
            currentClass.freeform = [...allowedNames];
            this.initInitialFreeformPositions(currentClass);
          }
        }

        const seatedNames = new Set(this.getAllStudents());

        // 5. Clean & populate unplaced list for the active layout
        if (!Array.isArray(currentClass.unplacedStudents)) {
          currentClass.unplacedStudents = [];
        }
        
        const seenUnplaced = new Set();
        currentClass.unplacedStudents = currentClass.unplacedStudents.filter(name => {
          if (allowedNames.has(name) && !seatedNames.has(name) && !seenUnplaced.has(name)) {
            seenUnplaced.add(name);
            return true;
          }
          return false;
        });

        // Add any missing classList students that are not seated and not in unplacedStudents
        currentClass.classList.forEach(student => {
          if (student && !seatedNames.has(student) && !seenUnplaced.has(student)) {
            currentClass.unplacedStudents.push(student);
            seenUnplaced.add(student);
          }
        });
      }

      refreshTotalStudentsFromClassList() {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;
        this.syncUnplacedWithClassList(currentClass);
        this.saveData();
        this.render();
      }

      getRowsData(currentClass) {
        if (!currentClass) return [];
        if (!currentClass.rowsData) currentClass.rowsData = {};
        const countKey = String(currentClass.rowsCount || 4);

        if (!Array.isArray(currentClass.rowsData[countKey])) {
          if (Array.isArray(currentClass.rows) && currentClass.rows.length === parseInt(countKey, 10)) {
            currentClass.rowsData[countKey] = JSON.parse(JSON.stringify(currentClass.rows));
          } else {
            const all = (currentClass.classList && currentClass.classList.length > 0)
              ? [...currentClass.classList]
              : this.getAllClassStudents(currentClass);
            currentClass.rowsData[countKey] = this.autoBalanceGroups(all, parseInt(countKey, 10));
          }
        }

        currentClass.rows = currentClass.rowsData[countKey];
        return currentClass.rowsData[countKey];
      }

      setRowsData(currentClass, rowsArr) {
        if (!currentClass) return;
        if (!currentClass.rowsData) currentClass.rowsData = {};
        const countKey = String(currentClass.rowsCount || 4);
        currentClass.rowsData[countKey] = rowsArr;
        currentClass.rows = rowsArr;
      }

      getLinesData(currentClass) {
        if (!currentClass) return [];
        if (!currentClass.linesData) currentClass.linesData = {};
        const countKey = String(currentClass.linesCount || 4);

        if (!Array.isArray(currentClass.linesData[countKey])) {
          if (Array.isArray(currentClass.lines) && currentClass.lines.length === parseInt(countKey, 10)) {
            currentClass.linesData[countKey] = JSON.parse(JSON.stringify(currentClass.lines));
          } else {
            const all = (currentClass.classList && currentClass.classList.length > 0)
              ? [...currentClass.classList]
              : this.getAllClassStudents(currentClass);
            currentClass.linesData[countKey] = this.autoBalanceGroups(all, parseInt(countKey, 10));
          }
        }

        currentClass.lines = currentClass.linesData[countKey];
        return currentClass.linesData[countKey];
      }

      setLinesData(currentClass, linesArr) {
        if (!currentClass) return;
        if (!currentClass.linesData) currentClass.linesData = {};
        const countKey = String(currentClass.linesCount || 4);
        currentClass.linesData[countKey] = linesArr;
        currentClass.lines = linesArr;
      }

      setRowsCount(count) {
        if (isNaN(count) || count < 1 || count > 6) return;
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        currentClass.rowsCount = count;
        this.getRowsData(currentClass);
      }

      setLinesCount(count) {
        if (isNaN(count) || count < 1 || count > 6) return;
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        currentClass.linesCount = count;
        this.getLinesData(currentClass);
      }

      changeSubRowsCount(val) {
        const count = parseInt(val, 10);
        this.setRowsCount(count);
        this.saveData();
        this.render();
      }

      changeSubLinesCount(val) {
        const count = parseInt(val, 10);
        this.setLinesCount(count);
        this.saveData();
        this.render();
      }

      toggleSubDivideRow() {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        currentClass.divideRows = !currentClass.divideRows;
        this.saveData();
        this.render();
      }

      updateSubheaders() {
        const rowsSub = document.getElementById('rowsSubheader');
        const linesSub = document.getElementById('linesSubheader');

        const currentClass = this.getCurrentClass();
        const isEditingMain = currentClass && this.isEditMode && (this.currentViewMode === 'chart' || !this.currentViewMode);

        if (rowsSub) {
          if (isEditingMain && currentClass.layout === 'rows') {
            rowsSub.style.display = 'flex';

            const subCountEl = document.getElementById('subRowsCount');
            if (subCountEl) subCountEl.value = currentClass.rowsCount || 4;

            const subDivideBtn = document.getElementById('subBtnDivideToggle');
            if (subDivideBtn) {
              const isDivided = currentClass.divideRows === true;
              subDivideBtn.textContent = isDivided ? 'YES' : 'NO';
              if (isDivided) {
                subDivideBtn.classList.remove('btn-secondary');
                subDivideBtn.classList.add('btn-primary');
              } else {
                subDivideBtn.classList.remove('btn-primary');
                subDivideBtn.classList.add('btn-secondary');
              }
            }
          } else {
            rowsSub.style.display = 'none';
          }
        }

        this.updateBandSubheader(currentClass);

        if (linesSub) {
          if (isEditingMain && currentClass.layout === 'lines') {
            linesSub.style.display = 'flex';

            const subLinesCountEl = document.getElementById('subLinesCount');
            if (subLinesCountEl) subLinesCountEl.value = currentClass.linesCount || 4;
          } else {
            linesSub.style.display = 'none';
          }
        }
      }

      render() {
        this.checkAndResetDailyAbsences();
        const currentClass = this.getCurrentClass();

        if (currentClass) {
          this.syncUnplacedWithClassList(currentClass);

          const layout = currentClass.layout;
          ['garden', 'rows', 'lines', 'circle', 'band', 'freeform'].forEach(l => {
            const btn = document.getElementById(`btnLayout${l.charAt(0).toUpperCase() + l.slice(1)}`);
            if (btn) btn.classList.toggle('active', layout === l);
          });
          const tablesSelect = document.getElementById('layoutTablesSelect');
          if (tablesSelect) {
            const isTables = TABLE_LAYOUTS.includes(layout);
            tablesSelect.value = isTables ? layout : '';
            tablesSelect.classList.toggle('active', isTables);
          }
          const absentSet = new Set(Array.isArray(currentClass.absentStudents) ? currentClass.absentStudents : []);
          const seatedStudents = this.getAllStudents();
          const presentSeatedCount = seatedStudents.filter(s => !absentSet.has(s)).length;
          const totalClassCount = Array.isArray(currentClass.classList) ? currentClass.classList.length : 0;
          const rosterCountEl = document.getElementById('rosterCount');
          if (rosterCountEl) rosterCountEl.innerText = `${presentSeatedCount}/${totalClassCount}`;

          const chalkboard = document.getElementById('chalkboardFront');
          if (chalkboard) {
            chalkboard.style.display = (layout === 'circle' || layout === 'garden' || layout === 'band') ? 'none' : 'block';
          }
        }

        this.renderClassDropdown();
        this.renderRoster();
        this.renderClassList();
        this.renderAttendanceTable();
        this.updateSubheaders();
        this.renderChart(currentClass);
      }

      toggleClassListEditMode(targetState) {
        if (typeof targetState === 'boolean') {
          this.isClassListEditMode = targetState;
        } else {
          this.isClassListEditMode = !this.isClassListEditMode;
        }

        const btn = document.getElementById('classListEditBtn');
        const saveBtn = document.getElementById('classListSaveBtn');

        if (btn) {
          if (this.isClassListEditMode) {
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
          } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
          }
        }

        if (saveBtn) {
          saveBtn.style.display = this.isClassListEditMode ? 'inline-block' : 'none';
        }

        this.renderClassList();
      }

      // Renames one student in every seating structure of a class: the live rows/lines, the
      // per-row-count copies getRowsData/getLinesData swap back in, divided rows, circle,
      // free form, the group layouts, the unplaced list, today's absences and the garden plant.
      // Arrays are changed in place, because rows/lines can be the same array as a count copy.
      // classList and studentProfiles stay with the callers (each rename path has its own rules).
      // Attendance statuses and grades are NOT moved: they stay under the old name.
      renameStudentSeating(currentClass, oldName, newName) {
        if (!currentClass || !oldName || !newName || oldName === newName) return;
        const renameIn = arr => {
          if (!Array.isArray(arr)) return;
          arr.forEach((item, i) => {
            if (Array.isArray(item)) renameIn(item);
            else if (item === oldName) arr[i] = newName;
          });
        };

        renameIn(currentClass.rows);
        renameIn(currentClass.lines);
        ['rowsData', 'linesData'].forEach(key => {
          const copies = currentClass[key];
          if (copies && typeof copies === 'object') Object.values(copies).forEach(renameIn);
        });
        renameIn(currentClass.dividedRowsData);
        renameIn(currentClass.circle);
        renameIn(currentClass.freeform);
        if (currentClass.freeformPositions && currentClass.freeformPositions[oldName]) {
          currentClass.freeformPositions[newName] = currentClass.freeformPositions[oldName];
          delete currentClass.freeformPositions[oldName];
        }
        if (currentClass.layoutsData) {
          ['half', 'third', 'fourth', 'fifth', 'sixth'].forEach(key => renameIn(currentClass.layoutsData[key]));
        }
        this.getBandChairs(currentClass.band).forEach(ch => { if (ch.student === oldName) ch.student = newName; });
        this.getSeatingRules(currentClass).forEach(r => {
          if (r.student === oldName) r.student = newName;
          if (r.other === oldName) r.other = newName;
        });
        renameIn(currentClass.unplacedStudents);
        renameIn(currentClass.absentStudents);
        this.renameGardenPlant(currentClass, oldName, newName);
      }

      saveClassListEdits() {
        const currentClass = this.getCurrentClass();
        if (!currentClass || !Array.isArray(currentClass.classList)) return;

        const inputs = document.querySelectorAll('#classListUL .class-list-name-input');
        if (inputs.length === 0) {
          this.isClassListEditMode = false;
          this.renderClassList();
          return;
        }

        const renames = [];
        inputs.forEach(inp => {
          const idx = parseInt(inp.getAttribute('data-index'), 10);
          const original = inp.getAttribute('data-original');
          const val = inp.value ? inp.value.trim() : '';
          if (val && val !== original) {
            renames.push({ idx, original, newName: val });
          }
        });

        renames.forEach(r => {
          // 1. Update classList (by position, so one of two same-named students can be renamed)
          currentClass.classList[r.idx] = r.newName;

          // 2. Update every seating chart
          this.renameStudentSeating(currentClass, r.original, r.newName);

          // 3. Update studentProfiles
          const parsed = this.parseStudentName(r.newName);
          if (!currentClass.studentProfiles) currentClass.studentProfiles = {};
          currentClass.studentProfiles[r.newName] = {
            firstName: parsed.firstName,
            lastName: parsed.lastName,
            rosterName: r.newName
          };
          if (r.original !== r.newName && currentClass.studentProfiles[r.original]) {
            delete currentClass.studentProfiles[r.original];
          }
        });

        this.isClassListEditMode = false;
        this.saveData();
        this.render();
      }

      confirmRemoveStudentFromClass(studentName) {
        if (!studentName) return;

        if (this.suppressRemoveStudentWarning) {
          this.removeStudentFromClass(studentName);
          return;
        }

        this.studentPendingRemoval = studentName;
        const warningText = document.getElementById('removeStudentWarningText');
        if (warningText) {
          warningText.textContent = `Are you sure you want to remove "${studentName}" from the class roster? This will remove them from all seating charts, attendance dates, and gradebook records.`;
        }
        const chk = document.getElementById('chkSuppressRemoveWarning');
        if (chk) chk.checked = false;

        const modal = document.getElementById('removeStudentConfirmModal');
        if (modal) modal.classList.add('active');
      }

      executeRemoveStudentFromClass() {
        const studentName = this.studentPendingRemoval;
        if (!studentName) {
          this.closeModal('removeStudentConfirmModal');
          return;
        }

        const chk = document.getElementById('chkSuppressRemoveWarning');
        if (chk && chk.checked) {
          this.suppressRemoveStudentWarning = true;
          localStorage.setItem('seatingApp_suppressRemoveStudentWarning', 'true');
        }

        this.removeStudentFromClass(studentName);
        this.studentPendingRemoval = null;
        this.closeModal('removeStudentConfirmModal');
      }

      removeStudentFromClass(studentName) {
        const currentClass = this.getCurrentClass();
        if (!currentClass || !studentName) return;

        if (Array.isArray(currentClass.classList)) {
          currentClass.classList = currentClass.classList.filter(name => name !== studentName);
        }
        if (Array.isArray(currentClass.rows)) {
          currentClass.rows = currentClass.rows.map(r => Array.isArray(r) ? r.filter(n => n !== studentName) : []);
        }
        if (Array.isArray(currentClass.circle)) {
          currentClass.circle = currentClass.circle.filter(name => name !== studentName);
        }
        if (Array.isArray(currentClass.freeform)) {
          currentClass.freeform = currentClass.freeform.filter(name => name !== studentName);
        }
        if (currentClass.freeformPositions && currentClass.freeformPositions[studentName]) {
          delete currentClass.freeformPositions[studentName];
        }
        if (currentClass.layoutsData) {
          ['half', 'third', 'fourth', 'fifth', 'sixth'].forEach(key => {
            if (Array.isArray(currentClass.layoutsData[key])) {
              currentClass.layoutsData[key] = currentClass.layoutsData[key].map(g => Array.isArray(g) ? g.filter(n => n !== studentName) : []);
            }
          });
        }
        if (Array.isArray(currentClass.lines)) {
          currentClass.lines = currentClass.lines.map(line => Array.isArray(line) ? line.filter(name => name !== studentName) : []);
        }
        if (Array.isArray(currentClass.dividedRowsData)) {
          currentClass.dividedRowsData.forEach(rSecs => {
            if (Array.isArray(rSecs)) {
              rSecs.forEach((sec, idx) => {
                if (Array.isArray(sec)) rSecs[idx] = sec.filter(n => n !== studentName);
              });
            }
          });
        }
        if (Array.isArray(currentClass.unplacedStudents)) {
          currentClass.unplacedStudents = currentClass.unplacedStudents.filter(n => n !== studentName);
        }
        if (currentClass.studentProfiles && currentClass.studentProfiles[studentName]) {
          delete currentClass.studentProfiles[studentName];
        }

        this.saveData();
        this.render();
        if (this.currentViewMode === 'attendance') this.renderAttendanceTable();
        if (this.currentViewMode === 'grades') this.renderGradesTable();
      }

      renderClassList() {
        const ul = document.getElementById('classListUL');
        const countSpan = document.getElementById('classListCount');
        const editBtn = document.getElementById('classListEditBtn');
        const saveBtn = document.getElementById('classListSaveBtn');
        if (!ul) return;
        ul.innerHTML = '';

        if (editBtn) {
          if (this.isClassListEditMode) {
            editBtn.classList.remove('btn-secondary');
            editBtn.classList.add('btn-primary');
          } else {
            editBtn.classList.remove('btn-primary');
            editBtn.classList.add('btn-secondary');
          }
        }

        if (saveBtn) {
          saveBtn.style.display = this.isClassListEditMode ? 'inline-block' : 'none';
        }
        // Adding names is part of editing the roster: the boxes sit at the top, the names below
        const addBox = document.getElementById('classListAddBox');
        if (addBox) addBox.style.display = this.isClassListEditMode ? '' : 'none';
        this.applySidebarListTab();

        const currentClass = this.getCurrentClass();
        const masterList = (currentClass && currentClass.classList) ? currentClass.classList : [];
        if (countSpan) countSpan.textContent = masterList.length;

        if (masterList.length === 0) {
          ul.innerHTML = '<li class="roster-item roster-empty-note">No class list created yet</li>';
          return;
        }

        masterList.forEach((student, idx) => {
          const profile = this.getStudentProfile(currentClass, student);
          let rosterName = profile.rosterName;
          if (!rosterName) {
            if (profile.lastName && profile.lastName.trim()) {
              rosterName = `${profile.firstName || student} ${profile.lastName.trim()}`.trim();
            } else {
              rosterName = profile.firstName || student;
            }
          } else if (profile.lastName && profile.lastName.trim() && !rosterName.toLowerCase().includes(profile.lastName.trim().toLowerCase())) {
            rosterName = `${rosterName} ${profile.lastName.trim()}`.trim();
          }

          const li = document.createElement('li');
          li.className = 'roster-item';

          let delBtnHTML = '';
          let nameHTML = '';

          if (this.isClassListEditMode) {
            nameHTML = `<div class="class-list-row-edit">
              <span class="class-list-num">${idx + 1}.</span>
              <input type="text" class="class-list-name-input" data-index="${idx}" data-original="${this.escapeQuotes(student)}" value="${this.escapeQuotes(rosterName)}">
            </div>`;
            delBtnHTML = `<button class="roster-del-btn class-list-del" onclick="event.stopPropagation(); app.confirmRemoveStudentFromClass('${this.escapeQuotes(student)}')" title="Remove Student from Class">&times;</button>`;
          } else {
            nameHTML = `<span>${idx + 1}. ${this.escapeHtml(rosterName)}</span>`;
          }

          li.innerHTML = `
            ${nameHTML}
            ${delBtnHTML}
          `;
          ul.appendChild(li);
        });
      }

      cycleStudentAttendance(currentClass, dateId, studentName) {
        if (!this.isEditMode) return;
        if (!currentClass || !dateId || !studentName) return;

        if (!Array.isArray(currentClass.attendanceDates)) {
          currentClass.attendanceDates = this.getDefaultAttendanceDates();
        }

        const dateRecord = currentClass.attendanceDates.find(d => d.id === dateId);
        if (!dateRecord) return;

        if (!dateRecord.statuses) dateRecord.statuses = {};
        let currentStatus = dateRecord.statuses[studentName] !== undefined ? dateRecord.statuses[studentName] : null;

        let nextStatus = 'present';
        if (currentStatus === 'present') {
          nextStatus = 'absent';
        } else if (currentStatus === 'absent') {
          nextStatus = 'unplaced';
        } else {
          nextStatus = 'present';
        }

        dateRecord.statuses[studentName] = nextStatus;
        this.saveData();
        this.renderAttendanceTable();
        if (this.currentViewMode === 'grades') {
          this.renderGradesTable();
        }
      }

      openAddAttendanceDateModal() {
        const currentClass = this.getCurrentClass();

        if (this.isDraftAttendanceActive && this.draftAttendanceDate) {
          // Complete active draft attendance session!
          if (currentClass) {
            if (!Array.isArray(currentClass.attendanceDates)) {
              currentClass.attendanceDates = this.getDefaultAttendanceDates();
            }
            const existingIdx = currentClass.attendanceDates.findIndex(d => 
              d.id === this.draftAttendanceDate.id || d.date === this.draftAttendanceDate.date
            );
            const savedRecord = {
              id: this.draftAttendanceDate.id || ('date_' + Date.now()),
              date: this.draftAttendanceDate.date,
              day: this.draftAttendanceDate.day,
              timestamp: this.draftAttendanceDate.timestamp || Date.now(),
              statuses: { ...(this.draftAttendanceDate.statuses || {}) }
            };
            if (existingIdx >= 0) {
              currentClass.attendanceDates[existingIdx] = savedRecord;
            } else {
              currentClass.attendanceDates.push(savedRecord);
            }
            currentClass.attendanceDates.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
            this.saveData();
          }

          this.draftAttendanceDate = null;
          this.isDraftAttendanceActive = false;

          this.updateAddAttendanceButtonUI();
          this.renderAttendanceTable();
          if (this.currentViewMode === 'grades') {
            this.renderGradesTable();
          }
          return;
        }

        const dateToUse = this.addAttSelectedDate || new Date();
        this.addAttCalendarMonth = dateToUse.getMonth();
        this.addAttCalendarYear = dateToUse.getFullYear();

        const dateInput = document.getElementById('addAttDateInput');
        if (dateInput) {
          const yyyy = dateToUse.getFullYear();
          const mm = String(dateToUse.getMonth() + 1).padStart(2, '0');
          const dd = String(dateToUse.getDate()).padStart(2, '0');
          dateInput.value = `${yyyy}-${mm}-${dd}`;
        }

        this.renderAddAttCalendarGrid();
        const modal = document.getElementById('addAttendanceDateModal');
        if (modal) modal.classList.add('active');
      }

      changeAddAttCalendarMonth(delta) {
        this.addAttCalendarMonth += delta;
        if (this.addAttCalendarMonth > 11) {
          this.addAttCalendarMonth = 0;
          this.addAttCalendarYear += 1;
        } else if (this.addAttCalendarMonth < 0) {
          this.addAttCalendarMonth = 11;
          this.addAttCalendarYear -= 1;
        }
        this.renderAddAttCalendarGrid();
      }

      renderAddAttCalendarGrid() {
        const grid = document.getElementById('addAttCalendarDaysGrid');
        const monthYearSpan = document.getElementById('addAttCalendarMonthYear');
        if (!grid) return;

        grid.innerHTML = '';

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        if (monthYearSpan) {
          monthYearSpan.textContent = `${monthNames[this.addAttCalendarMonth]} ${this.addAttCalendarYear}`;
        }

        const firstDayIndex = new Date(this.addAttCalendarYear, this.addAttCalendarMonth, 1).getDay();
        const totalDays = new Date(this.addAttCalendarYear, this.addAttCalendarMonth + 1, 0).getDate();

        const today = new Date();
        const isCurrentMonthYearToday = (today.getFullYear() === this.addAttCalendarYear && today.getMonth() === this.addAttCalendarMonth);

        const selDate = this.addAttSelectedDate || new Date();
        const isSelMonthYear = (selDate.getFullYear() === this.addAttCalendarYear && selDate.getMonth() === this.addAttCalendarMonth);

        for (let i = 0; i < firstDayIndex; i++) {
          const emptyDiv = document.createElement('div');
          emptyDiv.className = 'calendar-day-btn empty-cell';
          grid.appendChild(emptyDiv);
        }

        for (let day = 1; day <= totalDays; day++) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'calendar-day-btn';
          btn.textContent = day;

          if (isCurrentMonthYearToday && day === today.getDate()) {
            btn.classList.add('today-cell');
          }

          if (isSelMonthYear && day === selDate.getDate()) {
            btn.classList.add('selected');
          }

          btn.onclick = () => {
            this.addAttSelectedDate = new Date(this.addAttCalendarYear, this.addAttCalendarMonth, day);
            const dateInput = document.getElementById('addAttDateInput');
            if (dateInput) {
              const yyyy = this.addAttCalendarYear;
              const mm = String(this.addAttCalendarMonth + 1).padStart(2, '0');
              const dd = String(day).padStart(2, '0');
              dateInput.value = `${yyyy}-${mm}-${dd}`;
            }
            this.renderAddAttCalendarGrid();
          };

          grid.appendChild(btn);
        }
      }

      onAddAttDateInputChange(valStr) {
        if (!valStr) return;
        const parts = valStr.split('-');
        if (parts.length === 3) {
          const yyyy = parseInt(parts[0], 10);
          const mm = parseInt(parts[1], 10) - 1;
          const dd = parseInt(parts[2], 10);
          this.addAttSelectedDate = new Date(yyyy, mm, dd);
          this.addAttCalendarYear = yyyy;
          this.addAttCalendarMonth = mm;
          this.renderAddAttCalendarGrid();
        }
      }

      startTableAttendanceSession() {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        const dateInput = document.getElementById('addAttDateInput');
        let dateObj = this.addAttSelectedDate || new Date();
        if (dateInput && dateInput.value) {
          const parts = dateInput.value.split('-');
          if (parts.length === 3) {
            dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          }
        }

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayStr = dayNames[dateObj.getDay()];
        const y = dateObj.getFullYear() % 100;
        const yStr = y < 10 ? '0' + y : y;
        const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${yStr}`;

        this.draftAttendanceDate = {
          id: 'date_' + Date.now(),
          date: dateStr,
          day: dayStr,
          timestamp: dateObj.getTime(),
          statuses: {}
        };

        (currentClass.classList || []).forEach(student => {
          this.draftAttendanceDate.statuses[student] = 'unplaced';
        });

        this.isDraftAttendanceActive = true;
        this.closeModal('addAttendanceDateModal');
        this.updateAddAttendanceButtonUI();
        this.renderAttendanceTable();
      }

      toggleDraftAttendanceStudent(studentName) {
        if (!this.isDraftAttendanceActive || !this.draftAttendanceDate) return;
        if (!this.draftAttendanceDate.statuses) this.draftAttendanceDate.statuses = {};
        const current = this.draftAttendanceDate.statuses[studentName];
        let nextStatus = 'present';
        if (!current || current === 'unplaced' || current === '') {
          nextStatus = 'present';
        } else if (current === 'present') {
          nextStatus = 'absent';
        } else if (current === 'absent') {
          nextStatus = 'unplaced';
        } else {
          nextStatus = 'present';
        }
        this.draftAttendanceDate.statuses[studentName] = nextStatus;
        this.renderAttendanceTable();
      }

      deleteAttendanceColumn(dateId) {
        const currentClass = this.getCurrentClass();
        if (!currentClass || !Array.isArray(currentClass.attendanceDates)) return;

        currentClass.attendanceDates = currentClass.attendanceDates.filter(d => d.id !== dateId);
        this.saveData();
        this.renderAttendanceTable();
      }

      renderAttendanceTable() {
        const table = document.getElementById('attendanceTable');
        const classNameSpan = document.getElementById('attendanceClassName');
        if (!table) return;

        const currentClass = this.getCurrentClass();
        if (!currentClass) {
          table.innerHTML = '<tr><td style="padding: 20px; color: var(--text-muted);">No class selected</td></tr>';
          return;
        }

        if (classNameSpan) {
          classNameSpan.textContent = currentClass.name;
        }

        this.updateAddAttendanceButtonUI();

        if (!Array.isArray(currentClass.attendanceDates)) {
          currentClass.attendanceDates = this.getDefaultAttendanceDates();
        }

        const classList = currentClass.classList || [];
        const dates = currentClass.attendanceDates;

        const displayDates = [...dates];
        if (this.isDraftAttendanceActive && this.draftAttendanceDate) {
          displayDates.push({ ...this.draftAttendanceDate, isDraft: true });
        }

        // Header Row: Top-left cell empty + date columns with delete button if in edit mode
        let html = '<thead><tr><th></th>';
        displayDates.forEach(d => {
          if (d.isDraft) {
            html += `<th style="background-color: var(--paper-2); border-bottom: 2px solid var(--line-strong); border-left: 2px dashed var(--ink-faint); border-right: 2px dashed var(--ink-faint);">
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2; padding: 2px 0;">
                <span style="font-weight: 700; font-size: 0.85rem; color: var(--ink);">${d.date}</span>
                <span style="font-weight: 500; font-size: 0.72rem; color: var(--ink-muted); margin-top: 1px;">${d.day}</span>
                <span style="font-weight: 800; font-size: 0.68rem; text-transform: uppercase; color: var(--orange); margin-top: 2px; letter-spacing: 0.5px;">(Drafting)</span>
              </div>
            </th>`;
          } else {
            const delBtnHTML = this.isEditMode
              ? `<button class="delete-date-col-btn" onclick="event.stopPropagation(); app.deleteAttendanceColumn('${d.id}')" title="Delete Column">&times;</button>`
              : '';

            html += `<th>
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2; padding: 2px 0;">
                ${delBtnHTML}
                <span style="font-weight: 700; font-size: 0.85rem; color: var(--ink);">${d.date}</span>
                <span style="font-weight: 500; font-size: 0.72rem; color: var(--ink-muted); margin-top: 1px; text-transform: none; letter-spacing: 0;">${d.day}</span>
              </div>
            </th>`;
          }
        });
        html += '</tr></thead>';

        // Body Rows: Student Full Name on left + Green Check, Red X, or Blank per date
        html += '<tbody>';
        if (classList.length === 0) {
          html += `<tr><td colspan="${displayDates.length + 1}" style="text-align: center; color: var(--text-muted); font-style: italic; padding: 24px;">No students in this class list</td></tr>`;
        } else {
          classList.forEach(student => {
            const profile = this.getStudentProfile(currentClass, student);
            const fullName = (profile.lastName && profile.lastName.trim())
              ? `${profile.firstName} ${profile.lastName}`
              : (profile.firstName || student);

            let presentCount = 0;
            let recordedCount = 0;
            let dateCellsHTML = '';

            displayDates.forEach(d => {
              let status = (d.statuses && d.statuses[student] !== undefined) ? d.statuses[student] : null;

              if (status === 'present' || status === 'absent') recordedCount++;

              if (d.isDraft) {
                const isPresent = (status === 'present');
                const isAbsent = (status === 'absent');
                if (isPresent) presentCount++;
                let draftStatusHTML = '';
                let draftBg = 'background-color: #f8fafc;';

                if (isPresent) {
                  draftStatusHTML = `<span class="attendance-status-present" title="Present (Click for Absent ✕)">✓</span>`;
                } else if (isAbsent) {
                  draftStatusHTML = `<span class="attendance-status-absent" title="Absent (Click for Dash —)">✕</span>`;
                  draftBg = 'background-color: #fef2f2 !important;';
                } else {
                  draftStatusHTML = `<span style="color: var(--ink-faint); font-weight: 800; font-size: 1.1rem;" title="Unrecorded (Click for Present ✓)">—</span>`;
                }

                dateCellsHTML += `<td style="${draftBg} border-left: 2px dashed var(--line-strong); border-right: 2px dashed var(--line-strong); text-align: center; cursor: pointer; user-select: none;" onclick="event.stopPropagation(); app.toggleDraftAttendanceStudent('${this.escapeQuotes(student)}')" title="Click to cycle attendance (— → ✓ → ✕)">${draftStatusHTML}</td>`;
              } else {
                let statusHTML = '';
                if (status === 'present') {
                  presentCount++;
                  statusHTML = `<span class="attendance-status-present" title="Present">✓</span>`;
                } else if (status === 'absent') {
                  statusHTML = `<span class="attendance-status-absent" title="Absent">✕</span>`;
                } else {
                  statusHTML = this.isEditMode ? `<span style="color: var(--line-strong); font-weight: bold; font-size: 0.9rem;">—</span>` : ``;
                }

                const cellClass = this.isEditMode ? 'attendance-cell-interactive' : '';
                const cellOnClick = this.isEditMode ? `onclick="app.cycleStudentAttendance(app.getCurrentClass(), '${d.id}', '${this.escapeQuotes(student)}')"` : '';
                const cellTitle = this.isEditMode ? 'Click to change attendance (✓, ✕, blank)' : (status === 'present' ? 'Present' : (status === 'absent' ? 'Absent' : 'Unrecorded'));

                dateCellsHTML += `<td class="${cellClass}" style="cursor: ${this.isEditMode ? 'pointer' : 'default'}; user-select: none;" ${cellOnClick} title="${cellTitle}">${statusHTML}</td>`;
              }
            });

            const ratioText = `(${presentCount}/${recordedCount})`;
            const studentClick = (this.isDraftAttendanceActive && this.draftAttendanceDate)
              ? `style="cursor: pointer;" onclick="app.toggleDraftAttendanceStudent('${this.escapeQuotes(student)}')"`
              : '';
            const studentTitle = (this.isDraftAttendanceActive && this.draftAttendanceDate)
              ? `title="Click to toggle attendance for ${this.escapeHtml(fullName)}"`
              : '';

            html += `<tr><td ${studentClick} ${studentTitle}><div style="display: flex; align-items: center; gap: 8px;"><span class="register-name">${this.escapeHtml(fullName)}</span><span class="register-ratio">${ratioText}</span></div></td>${dateCellsHTML}</tr>`;
          });
        }
        html += '</tbody>';

        table.innerHTML = html;

        // Bind column hover highlighting for spreadsheet crosshair effect
        if (!table.dataset.hoverBound) {
          table.dataset.hoverBound = 'true';

          table.addEventListener('mouseover', (e) => {
            const cell = e.target.closest('td, th');
            if (!cell) return;
            const colIndex = cell.cellIndex;
            if (colIndex === undefined || colIndex === 0) return;

            const rows = table.querySelectorAll('tr');
            rows.forEach(r => {
              const c = r.children[colIndex];
              if (c) c.classList.add('column-hover');
            });
          });

          table.addEventListener('mouseout', (e) => {
            table.querySelectorAll('.column-hover').forEach(c => c.classList.remove('column-hover'));
          });
        }
      }

      renderGradeSubjectDropdown() {
        const select = document.getElementById('gradesSubjectSelect');
        const selectFS = document.getElementById('fullscreenSubjectSelect');
        const selectSidebar = document.getElementById('sidebarSubjectSelect');
        if (!Array.isArray(this.subjects) || this.subjects.length === 0) {
          this.subjects = [
            {
              id: 'subj_music',
              name: 'Music',
              categories: ['Singing', 'Instruments', 'Movement', 'Culture', 'Theory', 'Effort']
            }
          ];
        }
        const currentClass = this.getCurrentClass();
        const currentSubjId = this.getClassSubjectId(currentClass);

        [select, selectFS, selectSidebar].forEach(sel => {
          if (!sel) return;
          sel.innerHTML = '';
          this.subjects.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            if (s.id === currentSubjId) opt.selected = true;
            sel.appendChild(opt);
          });
          sel.value = currentSubjId;
        });
      }

      switchGradeSubject(subjectId) {
        const currentClass = this.getCurrentClass();
        if (!currentClass || !subjectId) return;
        currentClass.subjectId = subjectId;
        this.saveData();
        this.renderGradesTable();
        this.populateSettingsSubjectDropdown();
      }

      renderClassDropdown() {
        const selectHeader = document.getElementById('classSelect');
        const selectFS = document.getElementById('fullscreenClassSelect');
        const selectAtt = document.getElementById('attendanceClassSelect');
        const selectGrades = document.getElementById('gradesClassSelect');

        const actualClasses = (this.classes || []).filter(c => !c.isTextOnly && c.entryType !== 'text');

        [selectHeader, selectFS, selectAtt, selectGrades].forEach(select => {
          if (!select) return;
          select.innerHTML = '';
          actualClasses.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.name;
            if (c.id === this.currentClassId) opt.selected = true;
            select.appendChild(opt);
          });
          select.value = this.currentClassId;
        });

        this.renderGradeSubjectDropdown();
      }

      // Today's List in three parts: present (seated, in seating order), absent, and to be placed
      getTodaysListSections(currentClass) {
        const absentSet = new Set(Array.isArray(currentClass.absentStudents) ? currentClass.absentStudents : []);
        const allPlaced = this.getAllStudents();
        const unplacedMaster = Array.isArray(currentClass.unplacedStudents) ? currentClass.unplacedStudents : [];
        return {
          presentStudents: allPlaced.filter(s => !absentSet.has(s)),
          absentStudents: Array.from(absentSet),
          unplacedStudents: unplacedMaster.filter(s => !absentSet.has(s))
        };
      }

      setSidebarListTab(tab) {
        tab = tab === 'roster' ? 'roster' : 'today';
        // The open tab pressed again hides the list; any tab pressed while it is hidden shows that list
        if (tab === this.sidebarListTab && !this.sidebarListHidden) {
          this.sidebarListHidden = true;
        } else {
          this.sidebarListTab = tab;
          this.sidebarListHidden = false;
        }
        try {
          localStorage.setItem('classPlanner_sidebarListTab', this.sidebarListTab);
          localStorage.setItem('classPlanner_sidebarListHidden', this.sidebarListHidden ? '1' : '0');
        } catch (e) { /* not remembered, which is fine */ }
        const note = document.getElementById('listCopyNote');
        if (note) note.textContent = '';
        this.applySidebarListTab();
      }

      applySidebarListTab() {
        const panel = document.querySelector('.panel-lists');
        if (panel) {
          panel.dataset.listTab = this.sidebarListTab;
          panel.classList.toggle('list-hidden', this.sidebarListHidden);
        }
        [['listTabToday', 'today'], ['listTabRoster', 'roster']].forEach(([id, tab]) => {
          const btn = document.getElementById(id);
          if (!btn) return;
          const open = this.sidebarListTab === tab && !this.sidebarListHidden;
          btn.classList.toggle('active', open);
          btn.setAttribute('aria-selected', open ? 'true' : 'false');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
          btn.title = open ? 'Click again to hide the list' : 'Show this list';
        });
      }

      // Copies the list on show as plain text: a title line, then one student per line (Today's List
      // adds a tab and their status), so it pastes into a document as a list and a sheet as columns
      copySidebarList() {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;
        const nameOf = s => String(this.getStudentProfile(currentClass, s).rosterName || s).replace(/\s+/g, ' ').trim();
        const className = String(currentClass.name || 'Class').replace(/\s+/g, ' ').trim();
        let lines;
        if (this.sidebarListTab === 'roster') {
          const list = Array.isArray(currentClass.classList) ? currentClass.classList : [];
          lines = [`${className} \u2014 Class Roster (${list.length})`, ...list.map(nameOf)];
        } else {
          const { presentStudents, absentStudents, unplacedStudents } = this.getTodaysListSections(currentClass);
          const total = Array.isArray(currentClass.classList) ? currentClass.classList.length : 0;
          const day = new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
          lines = [
            `${className} \u2014 Today's List, ${day} (${presentStudents.length}/${total} present)`,
            ...presentStudents.map(s => `${nameOf(s)}\tPresent`),
            ...absentStudents.map(s => `${nameOf(s)}\tAbsent`),
            ...unplacedStudents.map(s => `${nameOf(s)}\tTo Be Placed`)
          ];
        }
        const text = lines.join('\n');
        const done = (ok) => {
          const note = document.getElementById('listCopyNote');
          const btn = document.getElementById('listCopyBtn');
          if (note) note.textContent = ok ? 'Copied!' : 'Try again';
          if (btn) btn.classList.toggle('copied', ok);
          clearTimeout(this.listCopyTimer);
          this.listCopyTimer = setTimeout(() => {
            if (note) note.textContent = '';
            if (btn) btn.classList.remove('copied');
          }, 1800);
        };
        const fallback = () => {
          const area = document.createElement('textarea');
          area.value = text;
          area.setAttribute('readonly', '');
          area.style.cssText = 'position: fixed; left: -9999px; top: 0;';
          document.body.appendChild(area);
          area.select();
          let ok = false;
          try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
          area.remove();
          done(ok);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(() => done(true), fallback);
        } else {
          fallback();
        }
        this.lastCopiedList = text;
      }

      renderRoster() {
        const list = document.getElementById('rosterList');
        if (!list) return;
        list.innerHTML = '';

        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        const { presentStudents, absentStudents, unplacedStudents } = this.getTodaysListSections(currentClass);

        if (presentStudents.length === 0 && absentStudents.length === 0 && unplacedStudents.length === 0) {
          list.innerHTML = '<li class="roster-item roster-empty-note">No students added</li>';
          return;
        }

        // --- SECTION 1: PRESENT STUDENTS ---
        const presentHeader = document.createElement('li');
        presentHeader.className = 'roster-section-head roster-section-present';
        presentHeader.innerHTML = `<span>Present (${presentStudents.length})</span>`;
        list.appendChild(presentHeader);

        if (presentStudents.length === 0) {
          const emptyLi = document.createElement('li');
          emptyLi.className = 'roster-none';
          emptyLi.textContent = 'None';
          list.appendChild(emptyLi);
        } else {
          presentStudents.forEach((student, idx) => {
            const profile = this.getStudentProfile(currentClass, student);
            const displayName = profile.rosterName || student;
            const li = document.createElement('li');
            li.className = 'roster-item';
            li.draggable = this.isEditMode;
            if (this.isEditMode) li.title = 'Single click seat to mark absent, Double click to edit card';
            li.innerHTML = `
              <span>${idx + 1}. ${this.escapeHtml(displayName)}</span>
              <button class="roster-del-btn" onclick="event.stopPropagation(); app.removeStudent('${this.escapeQuotes(student)}')" title="Remove Student">&times;</button>
            `;

            li.ondragstart = (e) => this.handleDragStart(e, student, null);
            li.ondragover = (e) => this.handleDragOver(e);
            li.ondragenter = (e) => this.handleDragEnterSeat(e);
            li.ondragleave = (e) => this.handleDragLeaveSeat(e);
            li.ondrop = (e) => this.handleDropOnRosterItem(e, idx);
            li.ondragend = (e) => this.handleDragEnd(e);
            li.ondblclick = (e) => {
              if (this.isEditMode) {
                e.stopPropagation();
                this.openNameCardModal(student);
              }
            };

            list.appendChild(li);
          });
        }

        // --- SECTION 2: ABSENT STUDENTS ---
        const absentHeader = document.createElement('li');
        absentHeader.className = 'roster-section-head roster-section-absent';
        absentHeader.innerHTML = `<span>Absent (${absentStudents.length})</span>`;
        list.appendChild(absentHeader);

        if (absentStudents.length === 0) {
          const emptyLi = document.createElement('li');
          emptyLi.className = 'roster-none';
          emptyLi.textContent = 'None';
          list.appendChild(emptyLi);
        } else {
          absentStudents.forEach((student) => {
            const profile = this.getStudentProfile(currentClass, student);
            const displayName = profile.rosterName || student;
            const li = document.createElement('li');
            li.className = 'roster-item absent-roster-item';
            li.title = 'Click to reinstate student';
            li.innerHTML = `
              <span class="absent-name">${this.escapeHtml(displayName)}</span>
              <button class="reinstate-btn" onclick="event.stopPropagation(); app.toggleStudentAbsent('${this.escapeQuotes(student)}')">Reinstate</button>
            `;

            li.onclick = () => {
              this.toggleStudentAbsent(student);
            };

            list.appendChild(li);
          });
        }

        // --- SECTION 3: TO BE PLACED STUDENTS ---
        const unplacedHeader = document.createElement('li');
        unplacedHeader.className = 'roster-section-head roster-section-unplaced';
        unplacedHeader.innerHTML = `<span>To Be Placed (${unplacedStudents.length})</span>`;
        list.appendChild(unplacedHeader);

        if (unplacedStudents.length === 0) {
          const emptyLi = document.createElement('li');
          emptyLi.className = 'roster-none';
          emptyLi.textContent = 'None';
          list.appendChild(emptyLi);
        } else {
          unplacedStudents.forEach((student) => {
            const profile = this.getStudentProfile(currentClass, student);
            const displayName = profile.rosterName || student;
            const li = document.createElement('li');
            li.className = 'roster-item unplaced-item';
            li.title = 'Click to place student on chart';
            li.innerHTML = `
              <span class="unplaced-name">+ ${this.escapeHtml(displayName)}</span>
              <span class="unplaced-tag">[Place]</span>
            `;

            li.onclick = () => {
              this.placeUnseatedStudent(student);
            };
            // In Band seating a name can be dragged straight onto the chair it belongs in
            if (this.isEditMode && currentClass.layout === 'band') {
              li.draggable = true;
              li.title = 'Click to place in the first open chair, or drag onto a chair';
              li.ondragstart = (e) => this.handleDragStart(e, student, null);
              li.ondragend = (e) => this.handleDragEnd(e);
            }

            list.appendChild(li);
          });
        }
      }

      renderChart(currentClass) {
        const container = document.getElementById('chartContainer');
        container.innerHTML = '';
        container.removeAttribute('style');
        // The Garden hangs its shelves on the classroom wall instead of standing on the floor
        const viewport = container.parentElement;
        if (viewport) viewport.classList.toggle('garden-room', Boolean(currentClass && currentClass.layout === 'garden'));

        if (!currentClass || !currentClass.classList || currentClass.classList.length === 0) {
          container.className = 'chart-container';
          container.innerHTML = '<div class="empty-state">No students in this class. Add students using the sidebar panel.</div>';
          return;
        }

        const layout = currentClass.layout;
        if (layout === 'garden') {
          this.renderGardenLayout(container, currentClass);
        } else if (layout === 'rows') {
          this.renderRowsLayout(container, currentClass);
        } else if (layout === 'lines') {
          this.renderLinesLayout(container, currentClass);
        } else if (layout === 'circle') {
          this.renderCircleLayout(container, currentClass);
        } else if (layout === 'freeform') {
          this.renderFreeformLayout(container, currentClass);
        } else if (layout === 'band') {
          this.renderBandLayout(container, currentClass);
        } else {
          this.renderGroupedLayout(container, currentClass, layout);
        }
      }

      // Garden: every seated student (in Rows order) gets a pot above their name, laid out
      // on as many beds as makes the pots biggest on screen. Each student's plant is picked
      // once and kept in currentClass.gardenPlants.
      renderGardenLayout(container, currentClass) {
        container.className = 'chart-container layout-garden';
        const isNewGarden = isNaN(Date.parse(currentClass.gardenStart));
        if (isNewGarden) currentClass.gardenStart = new Date().toISOString();
        if (this.assignGardenPlants(currentClass) || isNewGarden) this.saveData();
        this.preloadGardenImages();

        const space = this.getGardenSpace();
        this.gardenSpaceKey = `${space.width}x${space.height}`;
        const borderH = Math.round(Math.max(GARDEN.borderMinH, Math.min(GARDEN.borderMaxH, space.height * GARDEN.borderShare)));
        container.style.width = `${space.width}px`;
        const border = this.renderGardenBorder(currentClass, space.width, borderH);
        if (this.isGardenEditing()) {
          container.classList.add('garden-editing');
          const note = document.createElement('div');
          note.className = 'garden-edit-note';
          note.innerHTML = `<span>✏️ Editing this garden: click a pot to grow it one stage, or a border flower to remove it.</span>`;
          const done = document.createElement('button');
          done.type = 'button';
          done.textContent = 'Done';
          done.onclick = (e) => {
            e.stopPropagation();
            this.setGardenEditing(false);
          };
          note.appendChild(done);
          border.appendChild(note);
        }
        container.appendChild(border);

        const students = this.getAllStudents();
        if (students.length === 0) {
          const empty = document.createElement('div');
          empty.className = 'empty-state';
          empty.textContent = 'No students are seated yet. Seat them in Rows and their pots appear here, in the same order.';
          container.appendChild(empty);
          return;
        }

        const fit = this.fitGarden(students.length, space.width, space.height - borderH - GARDEN.bedGap);
        container.style.setProperty('--garden-w', `${Math.max(GARDEN.minW, Math.floor(fit.w))}px`);
        // While grading, the score buttons sit under each label, on the front of the shelf
        container.style.setProperty('--below-tag', this.isGradeScoringActive ? '27px' : '0px');

        const base = Math.floor(students.length / fit.beds);
        const extra = students.length % fit.beds;
        // Every shelf is as long as the fullest one needs, centred under the window
        const potW = Math.max(GARDEN.minW, Math.floor(fit.w));
        const shelfW = Math.ceil((base + (extra ? 1 : 0)) * potW * GARDEN.pitch + GARDEN.bedPadX);
        let next = 0;
        for (let b = 0; b < fit.beds; b++) {
          const bed = document.createElement('div');
          bed.className = 'garden-bed';
          bed.style.width = `${Math.min(space.width, shelfW)}px`;
          const size = base + (b < extra ? 1 : 0);
          students.slice(next, next + size).forEach(name => bed.appendChild(this.createSeatElement(name, null)));
          next += size;
          container.appendChild(bed);
        }
      }

      // The room the garden has on screen. Outside full screen the whole page scrolls (the
      // sidebar is tall), so the height is the window below the header, not the chart area.
      // The Layout and Zoom bars are left out: they cover the garden only while open.
      getGardenSpace() {
        const viewport = document.querySelector('#seatingAppBody .viewport');
        if (!viewport) return null;
        const vs = getComputedStyle(viewport);
        const padX = parseFloat(vs.paddingLeft) + parseFloat(vs.paddingRight);
        const padY = parseFloat(vs.paddingTop) + parseFloat(vs.paddingBottom);
        const header = document.querySelector('header');
        const top = (this.isFullScreen || !header) ? 0 : header.offsetHeight;
        const height = this.isFullScreen ? viewport.clientHeight : window.innerHeight - top;
        return {
          width: Math.floor(viewport.clientWidth - padX - 4),
          height: Math.floor(height - padY - 4)
        };
      }

      // Height of one pot on its shelf at picture width w: the picture (its clear strip under the
      // pot stands on the shelf top), the shelf top, then the name label on the shelf's front,
      // plus the score buttons under the label while grading
      gardenCardHeight(w) {
        const tag = Math.min(22, Math.max(12, w * 0.17));
        const shelf = w * GARDEN.shelfTop;
        return w * (432 / 252) - w * GARDEN.potFoot - shelf * 0.45 + shelf + 4 + tag * 1.25 + 6 + (this.isGradeScoringActive ? 27 : 0);
      }

      // Widest picture that lets perBed pots share one shelf in availW
      gardenWidthFor(availW, perBed) {
        return (availW - GARDEN.bedPadX) / (perBed * GARDEN.pitch);
      }

      // The number of beds that gives the biggest pots, and that pot width
      fitGarden(count, availW, availH) {
        const heightFor = (beds, w) => beds * (this.gardenCardHeight(w) + GARDEN.bedPadY + GARDEN.bedGap);
        let best = { beds: 1, w: 0 };
        for (let beds = 1; beds <= count; beds++) {
          const perBed = Math.ceil(count / beds);
          if (beds > 1 && Math.ceil(count / (beds - 1)) === perBed) continue;
          let w = Math.min(GARDEN.maxW, this.gardenWidthFor(availW, perBed));
          if (heightFor(beds, w) > availH) {
            let lo = 0;
            let hi = w;
            for (let i = 0; i < 24; i++) {
              const mid = (lo + hi) / 2;
              if (heightFor(beds, mid) <= availH) lo = mid; else hi = mid;
            }
            w = lo;
          }
          if (w > best.w + 0.5) best = { beds, w };
        }
        return best;
      }

      // The kind of plant in the student's pot now: their first plant, or the one they were
      // given when an absence or a replant started a new plant
      getGardenPlant(currentClass, student) {
        const { starts } = this.getGardenGrowth(currentClass, student);
        return this.getGardenKind(currentClass, student, starts[starts.length - 1]) || GARDEN_PLANTS[0];
      }

      // The kind given to the plant that began at `start`: 'first' (kept in gardenPlants), or
      // 'r'/'a' + the day of the replant or absence that started it (kept in gardenNewPlants)
      getGardenKind(currentClass, student, start) {
        const kind = start === 'first'
          ? (currentClass.gardenPlants || {})[student]
          : ((currentClass.gardenNewPlants || {})[student] || {})[start];
        return GARDEN_PLANTS.includes(kind) ? kind : null;
      }

      setGardenKind(currentClass, student, start, kind) {
        if (start === 'first') {
          if (!currentClass.gardenPlants || typeof currentClass.gardenPlants !== 'object') currentClass.gardenPlants = {};
          currentClass.gardenPlants[student] = kind;
          return;
        }
        if (!currentClass.gardenNewPlants || typeof currentClass.gardenNewPlants !== 'object') currentClass.gardenNewPlants = {};
        if (!currentClass.gardenNewPlants[student]) currentClass.gardenNewPlants[student] = {};
        currentClass.gardenNewPlants[student][start] = kind;
      }

      // Gives out plants: a first plant for each student without one (the kind the class has
      // fewest of, ties at random, so the kinds stay even), then a new kind for each plant an
      // absence or a replant has started. Returns true when any were given out.
      assignGardenPlants(currentClass) {
        if (!currentClass.gardenPlants || typeof currentClass.gardenPlants !== 'object') currentClass.gardenPlants = {};
        const plants = currentClass.gardenPlants;
        const counts = {};
        GARDEN_PLANTS.forEach(p => { counts[p] = 0; });
        const needPlant = [];
        const students = (currentClass.classList || []).filter(Boolean);
        students.forEach(student => {
          if (GARDEN_PLANTS.includes(plants[student])) counts[plants[student]]++;
          else needPlant.push(student);
        });
        for (let i = needPlant.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [needPlant[i], needPlant[j]] = [needPlant[j], needPlant[i]];
        }
        needPlant.forEach(student => {
          const plant = this.pickFewestGardenPlant(counts, GARDEN_PLANTS);
          plants[student] = plant;
          counts[plant]++;
        });

        let changed = needPlant.length > 0;
        students.forEach(student => {
          const { starts } = this.getGardenGrowth(currentClass, student);
          const start = starts[starts.length - 1];
          if (this.getGardenKind(currentClass, student, start)) return;
          this.setGardenKind(currentClass, student, start, this.pickNextGardenPlant(currentClass, student, starts));
          changed = true;
        });
        return changed;
      }

      // Of the given kinds, the one the class has fewest of (ties at random)
      pickFewestGardenPlant(counts, kinds) {
        const fewest = Math.min(...kinds.map(p => counts[p]));
        const choices = kinds.filter(p => counts[p] === fewest);
        return choices[Math.floor(Math.random() * choices.length)];
      }

      // A student's new plant is never the kind they had just before, and is one they haven't
      // grown to full bloom yet until they've had all ten. Among those, the class's fewest kind.
      pickNextGardenPlant(currentClass, student, starts) {
        const earlier = starts.slice(0, -1).map(start => this.getGardenKind(currentClass, student, start)).filter(Boolean);
        const previous = earlier[earlier.length - 1];
        const grown = new Set((currentClass.gardenBorder || []).filter(f => f && f.student === student).map(f => f.plant));
        let kinds = GARDEN_PLANTS.filter(p => !grown.has(p) && p !== previous);
        if (kinds.length === 0) kinds = GARDEN_PLANTS.filter(p => p !== previous);
        const counts = {};
        GARDEN_PLANTS.forEach(p => { counts[p] = 0; });
        (currentClass.classList || []).forEach(other => {
          if (!other || other === student) return;
          const theirStarts = this.getGardenGrowth(currentClass, other).starts;
          const plant = this.getGardenKind(currentClass, other, theirStarts[theirStarts.length - 1]);
          if (plant) counts[plant]++;
        });
        return this.pickFewestGardenPlant(counts, kinds);
      }

      renameGardenPlant(currentClass, oldName, newName) {
        if (!currentClass || oldName === newName) return;
        ['gardenPlants', 'gardenNewPlants'].forEach(key => {
          const byStudent = currentClass[key];
          if (byStudent && byStudent[oldName] !== undefined) {
            byStudent[newName] = byStudent[oldName];
            delete byStudent[oldName];
          }
        });
        ['gardenBorder', 'gardenEdits'].forEach(key => {
          if (Array.isArray(currentClass[key])) {
            currentClass[key].forEach(item => { if (item && item.student === oldName) item.student = newName; });
          }
        });
      }

      getGardenStageFor(sessions, pace) {
        const lengths = this.gardenGrowth[pace] || GARDEN_GROWTH_DEFAULTS.weekly;
        let through = 0;
        for (let stage = 1; stage < GARDEN_STAGES; stage++) {
          through += lengths[stage - 1];
          if (sessions <= through) return stage;
        }
        return GARDEN_STAGES;
      }

      // Midnight (local) of the day a time falls on
      gardenDay(time) {
        const d = new Date(time);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      }

      // Day one of the class's garden: everyone starts at stage 1 then, whatever their attendance
      // before. Set the first time the class's Garden is shown.
      getGardenStartDay(currentClass) {
        const start = Date.parse(currentClass && currentClass.gardenStart);
        return this.gardenDay(isNaN(start) ? Date.now() : start);
      }

      // The student's current plant: how many classes it has grown (`sessions`), its `stage`, and
      // every plant start so far (`starts`: 'first', then 'r<day>' for each replant, 'a<day>' for
      // each absence that ended a plant, 'e<id>' for each Edit Garden "grow something else").
      // Only classes from the garden's day one count. Marked present = one more class. A replant
      // starts a new plant that same day, which counts as its first class. An absence ends a plant
      // that has started growing, unless it is in full bloom: that waits for its replant. Classes
      // with no mark for the student are skipped. An Edit Garden change puts the plant at the start
      // of its stage. On any one day the class comes first, then replants and edits in the order made.
      getGardenGrowth(currentClass, student) {
        const pace = this.getAttendancePace(currentClass);
        const firstDay = this.getGardenStartDay(currentClass);
        const events = [];
        (Array.isArray(currentClass.attendanceDates) ? currentClass.attendanceDates : []).forEach(d => {
          if (!d || !d.statuses) return;
          const day = this.gardenDay(typeof d.timestamp === 'number' ? d.timestamp : (Date.parse(d.date) || 0));
          if (day >= firstDay) events.push({ type: 'class', day, time: 0, status: d.statuses[student] });
        });
        (Array.isArray(currentClass.gardenBorder) ? currentClass.gardenBorder : []).forEach(f => {
          const time = f && f.student === student ? Date.parse(f.date) : NaN;
          if (!isNaN(time)) events.push({ type: 'replant', day: this.gardenDay(time), time });
        });
        (Array.isArray(currentClass.gardenEdits) ? currentClass.gardenEdits : []).forEach(edit => {
          const time = edit && edit.student === student ? Date.parse(edit.date) : NaN;
          if (!isNaN(time)) events.push({ type: 'edit', day: this.gardenDay(time), time, edit });
        });
        events.sort((a, b) => a.day - b.day || (a.type === 'class' ? 0 : 1) - (b.type === 'class' ? 0 : 1) || a.time - b.time);

        let count = 0;
        const starts = ['first'];
        events.forEach(e => {
          if (e.type === 'replant') {
            count = 1;
            starts.push(`r${e.day}`);
          } else if (e.type === 'edit') {
            if (e.edit.newPlant) starts.push(`e${e.edit.id}`);
            count = this.gardenFirstClassOf(e.edit.stage, pace);
          } else if (e.status === 'present') {
            count++;
          } else if (e.status === 'absent' && count > 0 && this.getGardenStageFor(count, pace) < GARDEN_STAGES) {
            count = 0;
            starts.push(`a${e.day}`);
          }
        });
        return { sessions: count, stage: this.getGardenStageFor(count, pace), starts };
      }

      // The class count at which a stage begins (stage 1 begins at the first class)
      gardenFirstClassOf(stage, pace) {
        const lengths = this.gardenGrowth[pace] || GARDEN_GROWTH_DEFAULTS.weekly;
        const target = Math.min(GARDEN_STAGES, Math.max(1, parseInt(stage, 10) || 1));
        return 1 + lengths.slice(0, target - 1).reduce((a, b) => a + b, 0);
      }

      // ---- Edit Garden (Settings): fixing a class's garden by hand. It stays on only while that
      // class's Garden is open in the Seating Chart.
      isGardenEditing() {
        if (!this.gardenEditClassId) return false;
        const currentClass = this.getCurrentClass();
        const inGarden = currentClass && currentClass.id === this.gardenEditClassId && currentClass.layout === 'garden'
          && (this.currentViewMode === 'chart' || !this.currentViewMode);
        if (!inGarden) this.gardenEditClassId = null;
        return Boolean(inGarden);
      }

      setGardenEditing(on) {
        const currentClass = this.getCurrentClass();
        this.gardenEditClassId = (on && currentClass && currentClass.layout === 'garden') ? currentClass.id : null;
        this.updateGardenEditToggle();
        this.renderChart(currentClass);
      }

      toggleGardenEditing() {
        this.setGardenEditing(!this.isGardenEditing());
      }

      updateGardenEditToggle() {
        const btn = document.getElementById('btnToggleGardenEdit');
        if (!btn) return;
        const currentClass = this.getCurrentClass();
        const available = Boolean(currentClass && currentClass.layout === 'garden' && (this.currentViewMode === 'chart' || !this.currentViewMode));
        const on = this.isGardenEditing();
        // Filled in while on; the old note line is now the button's tooltip
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.disabled = !available;
        btn.title = !available
          ? 'Open this class in the Garden layout first'
          : on
            ? 'Editing this class\'s garden: click to stop (it also stops when you leave its garden)'
            : 'Edit this class\'s garden (this class only; turns off when you leave its garden)';
      }

      // Edit Garden click on a pot: one stage more; a full-bloom plant asks what to grow next
      advanceGardenPlant(student) {
        const currentClass = this.getCurrentClass();
        if (!currentClass || !student) return;
        const { stage } = this.getGardenGrowth(currentClass, student);
        if (stage >= GARDEN_STAGES) {
          this.openGardenRegrow(student);
          return;
        }
        this.addGardenEdit(currentClass, student, stage + 1, false);
        this.saveData();
        this.renderChart(currentClass);
      }

      // Hand edits are kept in the class data (gardenEdits) so growth keeps counting from them.
      // Clicks on one student's pot on the same day become one edit.
      addGardenEdit(currentClass, student, stage, newPlant) {
        if (!Array.isArray(currentClass.gardenEdits)) currentClass.gardenEdits = [];
        const now = new Date();
        const theirs = currentClass.gardenEdits.filter(e => e && e.student === student);
        const last = theirs[theirs.length - 1];
        const replantedSince = last && (currentClass.gardenBorder || []).some(f => f && f.student === student && Date.parse(f.date) > Date.parse(last.date));
        if (!newPlant && last && !last.newPlant && !replantedSince && this.gardenDay(Date.parse(last.date)) === this.gardenDay(now.getTime())) {
          last.stage = stage;
          last.date = now.toISOString();
          return;
        }
        const edit = { id: `edit_${now.getTime().toString(36)}_${Math.random().toString(36).slice(2, 6)}`, student, date: now.toISOString(), stage };
        if (newPlant) edit.newPlant = true;
        currentClass.gardenEdits.push(edit);
      }

      openGardenRegrow(student) {
        const currentClass = this.getCurrentClass();
        if (!currentClass) return;
        this.pendingGardenRegrow = student;
        const name = this.getStudentProfile(currentClass, student).firstName || student;
        const plant = this.getGardenPlant(currentClass, student);
        const label = this.getGardenPlantLabel(plant).toLowerCase();
        document.getElementById('gardenRegrowImg').src = this.getGardenBloomImage(plant);
        document.getElementById('gardenRegrowTitle').textContent = `${name}'s ${label} is in full bloom`;
        document.getElementById('gardenRegrowSame').textContent = `Regrow the ${label}`;
        document.getElementById('gardenRegrowModal').classList.add('active');
      }

      // Regrow: the same plant from an empty pot. Something else: a different kind from an empty pot.
      confirmGardenRegrow(newPlant) {
        const currentClass = this.getCurrentClass();
        const student = this.pendingGardenRegrow;
        this.pendingGardenRegrow = null;
        this.closeModal('gardenRegrowModal');
        if (!currentClass || !student) return;
        this.addGardenEdit(currentClass, student, 1, newPlant);
        this.assignGardenPlants(currentClass);
        this.saveData();
        this.renderChart(currentClass);
      }

      // Stage lengths for both paces: whole numbers from 1 to GARDEN_GROWTH_MAX, defaults where missing
      normalizeGardenGrowth(growth) {
        const out = {};
        Object.keys(GARDEN_GROWTH_DEFAULTS).forEach(pace => {
          const given = growth && Array.isArray(growth[pace]) ? growth[pace] : [];
          out[pace] = GARDEN_GROWTH_DEFAULTS[pace].map((def, i) => {
            const n = parseInt(given[i], 10);
            return (n >= 1 && n <= GARDEN_GROWTH_MAX) ? n : def;
          });
        });
        return out;
      }

      readJson(key) {
        try {
          return JSON.parse(localStorage.getItem(key) || 'null');
        } catch (e) {
          return null;
        }
      }

      // Replanting is for full-grown plants, and only when a click means nothing else
      // (not while arranging, taking attendance or grading)
      canReplantGarden(stage, isAbsent) {
        return stage === GARDEN_STAGES && !isAbsent && !this.isEditMode && !this.isAttendanceSessionActive && !this.isGradeScoringActive && !this.isGardenEditing();
      }

      getGardenImage(plant, stage) {
        return `garden/${plant}-${stage}.webp`;
      }

      preloadGardenImages() {
        if (this.gardenImages) return;
        this.gardenImages = [];
        GARDEN_PLANTS.forEach(plant => {
          for (let stage = 1; stage <= GARDEN_STAGES; stage++) {
            const img = new Image();
            img.src = this.getGardenImage(plant, stage);
            this.gardenImages.push(img);
          }
          const bloom = new Image();
          bloom.src = this.getGardenBloomImage(plant);
          this.gardenImages.push(bloom);
        });
      }

      // Settings > Garden Growth: how many classes each stage lasts, for Weekly and Daily classes.
      // Edits stay in a draft until Save.
      openGardenGrowthModal() {
        this.gardenGrowthDraft = JSON.parse(JSON.stringify(this.gardenGrowth));
        this.renderGardenGrowthModal();
        document.getElementById('gardenGrowthModal').classList.add('active');
      }

      renderGardenGrowthModal() {
        const draft = this.gardenGrowthDraft;
        const paces = ['weekly', 'daily'];
        const stepper = (pace, i) => `
          <div class="growth-stepper">
            <button type="button" onclick="app.stepGardenGrowth('${pace}', ${i}, -1)" ${draft[pace][i] <= 1 ? 'disabled' : ''} aria-label="Fewer classes">−</button>
            <span>${draft[pace][i]}</span>
            <button type="button" onclick="app.stepGardenGrowth('${pace}', ${i}, 1)" ${draft[pace][i] >= GARDEN_GROWTH_MAX ? 'disabled' : ''} aria-label="More classes">+</button>
          </div>`;
        let rows = '';
        for (let stage = 1; stage <= GARDEN_STAGES; stage++) {
          rows += `
            <div class="growth-stage">
              <img src="${this.getGardenImage('sunflower', stage)}" alt="">
              <span>Stage ${stage}</span>
            </div>
            ${stage < GARDEN_STAGES
              ? paces.map(pace => stepper(pace, stage - 1)).join('')
              : '<div class="growth-until">until replanted</div><div class="growth-until">until replanted</div>'}`;
        }
        const total = pace => draft[pace].reduce((a, b) => a + b, 0) + 1;
        document.getElementById('gardenGrowthGrid').innerHTML = `
          <div></div>
          <div class="growth-head">Weekly<small>meets once a week</small></div>
          <div class="growth-head">Daily<small>meets several times a week</small></div>
          ${rows}
          <div class="growth-total-label">Full bloom after</div>
          ${paces.map(pace => `<div class="growth-total">${total(pace)} classes</div>`).join('')}`;
      }

      stepGardenGrowth(pace, index, delta) {
        const lengths = this.gardenGrowthDraft[pace];
        lengths[index] = Math.min(GARDEN_GROWTH_MAX, Math.max(1, lengths[index] + delta));
        this.renderGardenGrowthModal();
      }

      resetGardenGrowthDraft() {
        this.gardenGrowthDraft = JSON.parse(JSON.stringify(GARDEN_GROWTH_DEFAULTS));
        this.renderGardenGrowthModal();
      }

      saveGardenGrowth() {
        this.gardenGrowth = this.normalizeGardenGrowth(this.gardenGrowthDraft);
        this.gardenGrowthDraft = null;
        this.closeModal('gardenGrowthModal');
        this.saveData();
        this.render();
      }

      openGardenReplant(student) {
        const currentClass = this.getCurrentClass();
        if (!currentClass || !student) return;
        this.pendingGardenReplant = student;
        const profile = this.getStudentProfile(currentClass, student);
        const name = profile.firstName || student;
        document.getElementById('gardenReplantImg').src = this.getGardenBloomImage(this.getGardenPlant(currentClass, student));
        document.getElementById('gardenReplantTitle').textContent = `Replant ${name}'s flower?`;
        document.getElementById('gardenReplantText').textContent = `The ${this.getGardenPlantLabel(this.getGardenPlant(currentClass, student)).toLowerCase()} goes into the flower bed outside the window, where it stays. Then ${name} starts a new pot with a different mystery plant.`;
        document.getElementById('gardenReplantModal').classList.add('active');
      }

      // Saves the flower in the class's border (part of the class data, so backups keep it)
      // and starts the student's pot again
      confirmGardenReplant() {
        const currentClass = this.getCurrentClass();
        const student = this.pendingGardenReplant;
        this.pendingGardenReplant = null;
        this.closeModal('gardenReplantModal');
        if (!currentClass || !student) return;

        if (!Array.isArray(currentClass.gardenBorder)) currentClass.gardenBorder = [];
        const flower = {
          id: `flower_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
          student,
          plant: this.getGardenPlant(currentClass, student),
          date: new Date().toISOString()
        };
        currentClass.gardenBorder.push(flower);
        this.gardenJustPlanted = flower.id;

        const { starts } = this.getGardenGrowth(currentClass, student);
        this.setGardenKind(currentClass, student, starts[starts.length - 1], this.pickNextGardenPlant(currentClass, student, starts));
        this.saveData();
        this.renderChart(currentClass);
      }

      removeGardenBorderFlower(flowerId) {
        const currentClass = this.getCurrentClass();
        if (!currentClass || !Array.isArray(currentClass.gardenBorder)) return;
        const flower = currentClass.gardenBorder.find(f => f && f.id === flowerId);
        if (!flower) return;
        const name = this.getStudentProfile(currentClass, flower.student).firstName || flower.student;
        const label = this.getGardenPlantLabel(flower.plant).toLowerCase();
        // Their latest flower goes back into their pot, undoing that replant
        const theirs = currentClass.gardenBorder.filter(f => f && f.student === flower.student);
        const isLatest = theirs[theirs.length - 1] === flower && (currentClass.classList || []).includes(flower.student);
        const question = isLatest
          ? `Remove ${name}'s ${label} from the flower bed outside the window? It goes back into ${name}'s pot, as if it had not been replanted.`
          : `Remove ${name}'s ${label} from the flower bed outside the window?`;
        if (!confirm(question)) return;
        currentClass.gardenBorder = currentClass.gardenBorder.filter(f => f !== flower);
        this.saveData();
        this.renderChart(currentClass);
      }

      getGardenBloomImage(plant) {
        return `garden/${plant}-bloom.webp`;
      }

      getGardenPlantLabel(plant) {
        return plant === 'flytrap' ? 'Venus flytrap' : plant.charAt(0).toUpperCase() + plant.slice(1);
      }

      // The grass border along the top: every replanted flower, oldest first. As it fills,
      // flowers crowd closer, then stand in up to three rows, each further back a little
      // smaller and higher, behind its own strip of grass.
      renderGardenBorder(currentClass, width, height) {
        const border = document.createElement('div');
        border.className = 'garden-border';
        border.style.height = `${height}px`;
        border.style.setProperty('--border-h', `${height}px`);

        // The flowers grow inside the window frame
        width = Math.max(40, width - 2 * GARDEN.frameX);
        height = Math.max(40, height - GARDEN.frameTop - GARDEN.frameBottom);

        const flowers = (Array.isArray(currentClass.gardenBorder) ? currentClass.gardenBorder : [])
          .filter(f => f && f.id && GARDEN_PLANTS.includes(f.plant));
        if (flowers.length === 0) {
          const hint = document.createElement('div');
          hint.className = 'garden-border-hint';
          hint.textContent = 'Full-grown flowers can be replanted here';
          border.appendChild(hint);
        }

        const flowerH = height * 0.9;
        const flowerW = flowerH * GARDEN.bloomAspect;
        const perRow = Math.max(1, Math.floor((width - flowerW) / (flowerW * 0.5)) + 1);
        const rows = Math.max(1, Math.min(3, Math.ceil(flowers.length / perRow)));
        const hash = str => [...str].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);

        for (let row = rows - 1; row >= 0; row--) {
          const scale = 1 - 0.16 * row;
          const lift = height * 0.14 * row;
          // Each row's grass strip; a flower's soil line sits on the strip's solid base
          const grassBottom = row ? Math.max(0, lift - height * 0.04) : 0;
          const grassH = height * (row ? GARDEN.backGrass : GARDEN.frontGrass);
          const groundTop = grassBottom + grassH * (row ? GARDEN.backGrassBase : GARDEN.frontGrassBase);
          const h = flowerH * scale;
          const w = h * GARDEN.bloomAspect;
          const inRow = flowers.filter((f, i) => i % rows === row);
          const step = inRow.length > 1 ? Math.min(w * 0.85, (width - w) / (inRow.length - 1 + (row ? 0.5 : 0))) : 0;
          const start = (width - step * (inRow.length - 1)) / 2 + (row % 2 ? step / 2 : row ? -step / 4 : 0);

          inRow.forEach((flower, i) => {
            const seed = hash(flower.id);
            const jitter = ((seed % 100) / 100 - 0.5) * step * 0.25;
            const size = h * (0.92 + ((seed >> 7) % 13) / 100);
            const x = Math.min(width - w / 2, Math.max(w / 2, start + step * i + jitter));
            const img = document.createElement('img');
            img.className = 'garden-border-flower' + (flower.id === this.gardenJustPlanted ? ' just-planted' : '');
            img.src = this.getGardenBloomImage(flower.plant);
            img.alt = '';
            img.draggable = false;
            img.style.left = `${(x / width * 100).toFixed(3)}%`;
            img.style.bottom = `${groundTop - size * GARDEN.bloomSoil}px`;
            img.style.height = `${size}px`;
            img.style.marginLeft = `${-size * GARDEN.bloomAspect / 2}px`;
            if ((seed >> 3) % 2) img.style.transform = 'scaleX(-1)';
            const name = this.getStudentProfile(currentClass, flower.student).firstName || flower.student;
            const when = new Date(flower.date);
            img.title = `${name} · ${this.getGardenPlantLabel(flower.plant)}` + (isNaN(when) ? '' : ` · ${when.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`);
            img.onclick = (e) => {
              if (!this.isGardenEditing()) return;
              e.stopPropagation();
              this.removeGardenBorderFlower(flower.id);
            };
            border.appendChild(img);
          });

          const grass = document.createElement('div');
          grass.className = 'garden-border-grass ' + (row ? 'back' : 'front');
          grass.style.bottom = `${grassBottom}px`;
          grass.style.height = `${grassH}px`;
          border.appendChild(grass);
        }
        this.gardenJustPlanted = null;
        return border;
      }

      renderFreeformLayout(container, currentClass) {
        container.className = 'chart-container layout-freeform';
        container.style.cssText = 'display: flex; justify-content: center; align-items: flex-start; width: auto; min-width: 100%; max-width: none; padding: 14px 16px 24px 16px; box-sizing: border-box;';

        const box = document.createElement('div');
        box.className = 'freeform-canvas-box';
        box.id = 'freeformCanvasBox';

        const sizeKey = 'freeform';
        const savedSize = (currentClass.containerSizes && currentClass.containerSizes[sizeKey]) || null;
        
        const defaultWidth = 880;
        const defaultHeight = 520;

        const boxWidth = (savedSize && savedSize.width) ? savedSize.width : defaultWidth;
        const boxHeight = (savedSize && savedSize.height) ? savedSize.height : defaultHeight;

        box.style.width = `${boxWidth}px`;
        box.style.height = `${boxHeight}px`;
        box.style.minWidth = '320px';
        box.style.minHeight = '240px';
        box.style.overflow = 'visible';

        this.makeResizable(box, sizeKey);

        const badge = document.createElement('div');
        badge.className = 'group-header-badge';
        const freeformStudents = currentClass.freeform || [];
        badge.textContent = `Free Form (${freeformStudents.length})`;
        box.appendChild(badge);

        box.ondragover = (e) => this.handleDragOver(e);
        box.ondragenter = (e) => {
          if (this.isEditMode) {
            e.preventDefault();
            box.classList.add('drag-over');
          }
        };
        box.ondragleave = (e) => {
          if (this.isEditMode && !box.contains(e.relatedTarget)) {
            box.classList.remove('drag-over');
          }
        };
        box.ondrop = (e) => this.handleDropOnFreeform(e, box);

        this.initInitialFreeformPositions(currentClass, boxWidth);

        if (freeformStudents.length === 0) {
          const placeholder = document.createElement('div');
          placeholder.className = 'freeform-placeholder';
          placeholder.textContent = 'Drag students anywhere in this Free Form space';
          box.appendChild(placeholder);
        } else {
          freeformStudents.forEach(studentName => {
            const pos = (currentClass.freeformPositions && currentClass.freeformPositions[studentName]) || { x: 18, y: 18 };
            const seatEl = this.createSeatElement(studentName, null);
            seatEl.style.position = 'absolute';
            seatEl.style.left = `${pos.x}px`;
            seatEl.style.top = `${pos.y}px`;
            seatEl.style.margin = '0';
            seatEl.style.zIndex = '5';

            seatEl.ondragover = (e) => this.handleDragOver(e);
            seatEl.ondrop = (e) => {
              this.handleDropOnFreeform(e, box);
            };

            box.appendChild(seatEl);
          });
        }

        container.appendChild(box);
      }

      handleDropOnFreeform(e, box) {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.stopPropagation();

        const canvasEl = box || document.getElementById('freeformCanvasBox');
        if (canvasEl) canvasEl.classList.remove('drag-over');
        if (!this.draggedStudentName) return;

        const currentClass = this.getCurrentClass();
        if (!currentClass || currentClass.layout !== 'freeform') return;

        if (!canvasEl) return;

        const rect = canvasEl.getBoundingClientRect();
        const cardWidth = 110;
        const cardHeight = 74;

        let dropX = e.clientX - rect.left - (cardWidth / 2);
        let dropY = e.clientY - rect.top - (cardHeight / 2);

        const maxX = Math.max(10, rect.width - cardWidth - 10);
        const maxY = Math.max(10, rect.height - cardHeight - 10);

        dropX = Math.max(10, Math.min(maxX, dropX));
        dropY = Math.max(10, Math.min(maxY, dropY));

        if (!currentClass.freeformPositions || typeof currentClass.freeformPositions !== 'object') {
          currentClass.freeformPositions = {};
        }

        currentClass.freeformPositions[this.draggedStudentName] = {
          x: Math.round(dropX),
          y: Math.round(dropY)
        };

        if (Array.isArray(currentClass.unplacedStudents)) {
          currentClass.unplacedStudents = currentClass.unplacedStudents.filter(n => n !== this.draggedStudentName);
        }

        if (!Array.isArray(currentClass.freeform)) {
          currentClass.freeform = [];
        }

        if (!currentClass.freeform.includes(this.draggedStudentName)) {
          currentClass.freeform.push(this.draggedStudentName);
        }

        this.resetDragState();
        this.saveData();
        this.render();
      }

      renderLinesLayout(container, currentClass) {
        container.className = 'chart-container layout-lines';
        const lineCount = currentClass.linesCount || 4;
        const gapPx = lineCount >= 6 ? 10 : (lineCount === 5 ? 14 : 20);
        container.style.cssText = `display: flex; gap: ${gapPx}px; width: 100%; justify-content: center; align-items: flex-start; padding: 0 16px; box-sizing: border-box;`;

        if (!Array.isArray(currentClass.lines)) {
          const all = this.getAllClassStudents(currentClass);
          currentClass.lines = this.autoBalanceGroups(all, lineCount);
        } else {
          while (currentClass.lines.length < lineCount) {
            currentClass.lines.push([]);
          }
        }

        const colPaddingX = lineCount >= 6 ? 6 : 10;
        for (let lIdx = 0; lIdx < lineCount; lIdx++) {
          const lineStudents = currentClass.lines[lIdx] || [];

          const lineDiv = document.createElement('div');
          lineDiv.className = 'line-column seat-drop-zone seat-drop-vertical';
          lineDiv.id = `line-col-${lIdx}`;
          lineDiv.style.cssText = `flex: 1; min-width: 105px; min-height: 400px; border-radius: 12px; padding: 24px ${colPaddingX}px 14px ${colPaddingX}px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 2px; position: relative; transition: background-color 0.2s, border-color 0.2s; box-sizing: border-box;`;

          const sizeKey = `lines-${lIdx}`;
          const savedSize = (currentClass.containerSizes && currentClass.containerSizes[sizeKey]) || null;
          if (savedSize) {
            if (savedSize.width) lineDiv.style.width = `${savedSize.width}px`;
            if (savedSize.height) lineDiv.style.minHeight = `${savedSize.height}px`;
          }

          const badge = document.createElement('div');
          badge.className = 'row-header-badge';
          badge.textContent = `Line ${lIdx + 1} (${lineStudents.length})`;
          lineDiv.appendChild(badge);

          this.makeResizable(lineDiv, sizeKey);

          lineDiv.ondragover = (e) => this.handleDragOver(e);
          lineDiv.ondragenter = (e) => this.handleDragEnterGroup(e, lIdx, 'line-col');
          lineDiv.ondragleave = (e) => this.handleDragLeaveGroup(e, lIdx, 'line-col');
          lineDiv.ondrop = (e) => this.handleDropOnLine(e, lIdx);

          if (lineStudents.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'zone-placeholder';
            placeholder.style.marginTop = '20px';
            placeholder.textContent = 'Drag students here to add to Line ' + (lIdx + 1);
            lineDiv.appendChild(placeholder);
          } else {
            lineStudents.forEach((studentName) => {
              const seatEl = this.createSeatElement(studentName, lIdx);
              lineDiv.appendChild(seatEl);
            });
          }

          container.appendChild(lineDiv);
        }
      }

      handleDropOnLine(e, targetLineIndex) {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.stopPropagation();

        const lineEl = document.getElementById(`line-col-${targetLineIndex}`);
        if (lineEl) lineEl.classList.remove('drag-over');

        if (!this.draggedStudentName) return;
        const dropIndex = this.getDropIndexForEvent(e);

        const currentClass = this.getCurrentClass();
        if (!currentClass || currentClass.layout !== 'lines') return;

        if (Array.isArray(currentClass.unplacedStudents)) {
          currentClass.unplacedStudents = currentClass.unplacedStudents.filter(n => n !== this.draggedStudentName);
        }

        if (!Array.isArray(currentClass.lines)) {
          currentClass.lines = [[], [], [], []];
        }

        currentClass.lines.forEach(l => {
          if (Array.isArray(l)) {
            const idx = l.indexOf(this.draggedStudentName);
            if (idx > -1) l.splice(idx, 1);
          }
        });

        if (!currentClass.lines[targetLineIndex]) {
          currentClass.lines[targetLineIndex] = [];
        }
        this.insertAt(currentClass.lines[targetLineIndex], dropIndex, this.draggedStudentName);

        this.resetDragState();
        this.saveData();
        this.render();
      }

      renderRowsLayout(container, currentClass) {
        container.className = 'chart-container layout-rows';

        while (currentClass.rows.length < currentClass.rowsCount) {
          currentClass.rows.push([]);
        }

        const isDivided = currentClass.divideRows === true;

        currentClass.rows.forEach((rowStudents, rIndex) => {
          if (rIndex >= currentClass.rowsCount) return;

          const rowDiv = document.createElement('div');
          rowDiv.className = 'seat-row';
          rowDiv.id = `seat-row-${rIndex}`;
          if (!currentClass.rowsRowAlign) {
            currentClass.rowsRowAlign = {};
          }
          const savedAlign = currentClass.rowsRowAlign[rIndex] || currentClass.rowAlignment || 'center';
          rowDiv.style.justifyContent = savedAlign;

          // Render 3 alignment circles at top-center in Edit Mode
          const dotsContainer = document.createElement('div');
          dotsContainer.className = 'row-align-dots';

          const alignments = [
            { val: 'flex-start', title: 'Align Row Left' },
            { val: 'center', title: 'Align Row Center' },
            { val: 'flex-end', title: 'Align Row Right' }
          ];

          alignments.forEach(a => {
            const dot = document.createElement('div');
            dot.className = 'align-dot' + (savedAlign === a.val ? ' active' : '');
            dot.title = a.title;
            dot.onclick = (e) => {
              e.stopPropagation();
              if (!currentClass.rowsRowAlign) currentClass.rowsRowAlign = {};
              currentClass.rowsRowAlign[rIndex] = a.val;
              this.saveData();
              this.render();
            };
            dotsContainer.appendChild(dot);
          });

          rowDiv.appendChild(dotsContainer);

          const sizeKey = `rows-${rIndex}`;
          const savedSize = (currentClass.containerSizes && currentClass.containerSizes[sizeKey]) || null;
          const legacyHeight = (currentClass.containerHeights && currentClass.containerHeights[sizeKey]) || null;

          if (savedSize) {
            if (savedSize.height) rowDiv.style.minHeight = `${savedSize.height}px`;
          } else if (legacyHeight) {
            rowDiv.style.minHeight = `${legacyHeight}px`;
          }

          const badge = document.createElement('div');
          badge.className = 'row-header-badge';
          badge.textContent = `Row ${rIndex + 1} (${rowStudents.length})`;
          rowDiv.appendChild(badge);

          this.makeResizable(rowDiv, sizeKey);

          if (!isDivided) {
            rowDiv.classList.add('seat-drop-zone');
            rowDiv.ondragover = (e) => this.handleDragOver(e);
            rowDiv.ondragenter = (e) => this.handleDragEnterGroup(e, rIndex, 'seat-row');
            rowDiv.ondragleave = (e) => this.handleDragLeaveGroup(e, rIndex, 'seat-row');
            rowDiv.ondrop = (e) => this.handleDropOnRow(e, rIndex, 0);

            if (rowStudents.length === 0) {
              const placeholder = document.createElement('div');
              placeholder.className = 'zone-placeholder';
              placeholder.textContent = 'Drag students here to add them to Row ' + (rIndex + 1);
              rowDiv.appendChild(placeholder);
            } else {
              rowStudents.forEach((studentName) => {
                const seatEl = this.createSeatElement(studentName, rIndex);
                rowDiv.appendChild(seatEl);
              });
            }
          } else {
            // Divided row layout (Left section & Right section)
            const leftStudents = (currentClass.dividedRowsData && currentClass.dividedRowsData[rIndex] && currentClass.dividedRowsData[rIndex][0]) || [];
            const rightStudents = (currentClass.dividedRowsData && currentClass.dividedRowsData[rIndex] && currentClass.dividedRowsData[rIndex][1]) || [];

            const leftSec = document.createElement('div');
            leftSec.id = `seat-row-${rIndex}-sec-0`;
            leftSec.className = 'seat-drop-zone row-section row-section-left';

            leftSec.ondragover = (e) => this.handleDragOver(e);
            leftSec.ondragenter = (e) => this.handleDragEnterGroup(e, `${rIndex}-sec-0`, 'seat-row');
            leftSec.ondragleave = (e) => this.handleDragLeaveGroup(e, `${rIndex}-sec-0`, 'seat-row');
            leftSec.ondrop = (e) => this.handleDropOnRow(e, rIndex, 0);

            if (leftStudents.length === 0) {
              leftSec.innerHTML = '<span class="row-section-hint">Left Section</span>';
            } else {
              leftStudents.forEach(studentName => {
                const seatEl = this.createSeatElement(studentName, rIndex);
                leftSec.appendChild(seatEl);
              });
            }

            const divider = document.createElement('div');
            divider.className = 'row-aisle';

            const rightSec = document.createElement('div');
            rightSec.id = `seat-row-${rIndex}-sec-1`;
            rightSec.className = 'seat-drop-zone row-section row-section-right';

            rightSec.ondragover = (e) => this.handleDragOver(e);
            rightSec.ondragenter = (e) => this.handleDragEnterGroup(e, `${rIndex}-sec-1`, 'seat-row');
            rightSec.ondragleave = (e) => this.handleDragLeaveGroup(e, `${rIndex}-sec-1`, 'seat-row');
            rightSec.ondrop = (e) => this.handleDropOnRow(e, rIndex, 1);

            if (rightStudents.length === 0) {
              rightSec.innerHTML = '<span class="row-section-hint">Right Section</span>';
            } else {
              rightStudents.forEach(studentName => {
                const seatEl = this.createSeatElement(studentName, rIndex);
                rightSec.appendChild(seatEl);
              });
            }

            rowDiv.appendChild(leftSec);
            rowDiv.appendChild(divider);
            rowDiv.appendChild(rightSec);
          }

          container.appendChild(rowDiv);
        });
      }

      renderCircleLayout(container, currentClass) {
        container.className = 'chart-container layout-circle';
        container.ondragover = (e) => this.handleDragOver(e);

        // Render vertical spread dial on the left of the circle
        const currentFactor = currentClass.circleSpreadFactor || 100;
        const dialContainer = document.createElement('div');
        dialContainer.className = 'circle-dial-container';
        dialContainer.innerHTML = `
          <span class="circle-dial-text">Larger</span>
          <input type="range" class="circle-dial-slider" min="65" max="130" value="${currentFactor}">
          <span class="circle-dial-text">Smaller</span>
        `;

        const slider = dialContainer.querySelector('.circle-dial-slider');

        // Real-time update on input and change
        const updateSpread = (val) => {
          const numVal = parseInt(val, 10);
          if (!isNaN(numVal) && currentClass.circleSpreadFactor !== numVal) {
            currentClass.circleSpreadFactor = numVal;
            this.saveData();
            this.render();
          }
        };

        slider.oninput = (e) => updateSpread(e.target.value);
        slider.onchange = (e) => updateSpread(e.target.value);

        // Custom mouse drag handler for smooth vertical click-and-drag
        slider.onmousedown = (e) => {
          e.stopPropagation();
          const rect = slider.getBoundingClientRect();
          const startY = e.clientY;
          const startVal = parseInt(slider.value, 10);

          const onMouseMove = (moveEvent) => {
            moveEvent.preventDefault();
            const deltaY = startY - moveEvent.clientY; // drag up = increase, drag down = decrease
            const rangePx = rect.height || 160;
            const deltaVal = Math.round((deltaY / rangePx) * 70);
            const newVal = Math.max(60, Math.min(130, startVal + deltaVal));
            slider.value = newVal;
            updateSpread(newVal);
          };

          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        };

        container.appendChild(dialContainer);

        // Click outside seats unpins any pinned circle seat
        container.onclick = (e) => {
          if (e.target === container) {
            this.pinnedCircleStudent = null;
            container.querySelectorAll('.seat.pinned').forEach(s => s.classList.remove('pinned'));
          }
        };

        const circleStudents = currentClass.circle || [];
        const total = circleStudents.length;
        const spreadMultiplier = (currentClass.circleSpreadFactor || 100) / 100;
        const radius = Math.round(Math.min(242, Math.max(137, Math.round(total * 15.75))) * spreadMultiplier);

        circleStudents.forEach((studentName, idx) => {
          const seatEl = this.createSeatElement(studentName, null);

          if (this.pinnedCircleStudent === studentName) {
            seatEl.classList.add('pinned');
          }

          seatEl.onmouseenter = () => {
            seatEl.classList.add('hover-raised');
          };

          seatEl.onmouseleave = () => {
            seatEl.classList.remove('hover-raised');
          };

          let clickTimer = null;
          seatEl.onclick = (e) => {
            if (this.isEditMode && studentName) {
              e.stopPropagation();
              if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
              }
              clickTimer = setTimeout(() => {
                this.toggleStudentAbsent(studentName);
                clickTimer = null;
              }, 220);
              return;
            }

            e.stopPropagation();
            if (this.pinnedCircleStudent === studentName) {
              this.pinnedCircleStudent = null;
              seatEl.classList.remove('pinned');
            } else {
              container.querySelectorAll('.seat.pinned').forEach(s => s.classList.remove('pinned'));
              this.pinnedCircleStudent = studentName;
              seatEl.classList.add('pinned');
            }
          };

          seatEl.ondblclick = (e) => {
            if (this.isEditMode) {
              e.stopPropagation();
              if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
              }
              this.openNameCardModal(studentName);
            }
          };

          seatEl.ondragover = (e) => this.handleDragOver(e);
          seatEl.ondragenter = (e) => this.handleDragEnterSeat(e);
          seatEl.ondragleave = (e) => this.handleDragLeaveSeat(e);
          seatEl.ondrop = (e) => this.handleDropOnCircleSeat(e, studentName);

          const angle = (idx / total) * (2 * Math.PI) - (Math.PI / 2);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          // Calculate z-index relative to 9:00 position (Math.PI angle)
          // idx=0 is at 12:00. Position at 9:00 is index at angle ~ PI, which is idx = Math.round(total * 0.75) % total.
          const nineOClockIdx = Math.round(total * 0.75) % total;
          const zIndex = ((idx - nineOClockIdx + total) % total) + 1;

          seatEl.style.position = 'absolute';
          seatEl.style.left = `calc(50% + ${x}px - 55px)`;
          seatEl.style.top = `calc(50% + ${y}px - 37px)`;
          seatEl.style.zIndex = zIndex;

          container.appendChild(seatEl);
        });
      }

      renderGroupedLayout(container, currentClass, layoutType) {
        container.className = 'chart-container table-floor-container';

        const groupTitles = {
          half: ['Group A', 'Group B'],
          third: ['Group A', 'Group B', 'Group C'],
          fourth: ['Group A', 'Group B', 'Group C', 'Group D'],
          fifth: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E'],
          sixth: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F']
        };

        const titles = groupTitles[layoutType];
        const groups = currentClass.layoutsData[layoutType] || [];

        // The old row arrangement: tables the teacher hasn't placed yet start out in these rows
        const rowKey = `${layoutType}Rows`;
        const expectedIndicesCount = titles ? titles.length : 0;
        const existingRowDef = currentClass.layoutsData[rowKey];
        const flatIndicesCount = Array.isArray(existingRowDef) ? existingRowDef.flat().length : 0;

        if (!existingRowDef || flatIndicesCount !== expectedIndicesCount) {
          currentClass.layoutsData[rowKey] = this.defaultTableRows(layoutType);
        }

        const rows = currentClass.layoutsData[rowKey];
        const alignKey = `${layoutType}RowAlign`;
        if (!currentClass.layoutsData[alignKey]) {
          currentClass.layoutsData[alignKey] = {};
        }

        // The room's width in floor px. Worked out from the classroom area, because the chart's own
        // width is still easing over from the last layout.
        const roomW = Math.max(320, this.getChartContentWidth());
        this.chartRoomW = Math.round(this.getChartContentWidth());
        const card = this.getSeatCardSize(currentClass);

        // A table with no saved size takes its share of its row (an empty table a small one, the rest
        // by group size), so the row's tables sit side by side when they can
        const shareOf = {};
        rows.forEach(rowGroupIndices => {
          const inRow = rowGroupIndices.filter(g => g < titles.length);
          const emptyCount = inRow.filter(g => !(groups[g] || []).length).length;
          const seatedTotal = inRow.reduce((sum, g) => sum + (groups[g] || []).length, 0);
          inRow.forEach(g => {
            const count = (groups[g] || []).length;
            const room = roomW - 20 - TABLE.space * (inRow.length - 1) - TABLE.emptyW * emptyCount;
            shareOf[g] = count ? Math.max(TABLE.emptyW, room * count / Math.max(1, seatedTotal)) : TABLE.emptyW;
          });
        });

        const floor = document.createElement('div');
        floor.className = 'table-floor';
        container.appendChild(floor);

        const tables = titles.map((title, gIndex) => {
          const groupStudents = groups[gIndex] || [];
          const sizeKey = `${layoutType}-${gIndex}`;
          const savedSize = (currentClass.containerSizes && currentClass.containerSizes[sizeKey]) || null;
          const legacyHeight = (currentClass.containerHeights && currentClass.containerHeights[sizeKey]) || null;
          const shape = (savedSize && savedSize.shape === 'round') ? 'round' : 'rect';
          const share = shareOf[gIndex] || roomW;

          // The size to start from: the one the teacher dragged it to, else one that suits the group
          let start;
          if (savedSize && (savedSize.width || savedSize.height)) {
            const auto = this.defaultTableSize(groupStudents.length, shape, card, share, roomW);
            start = { W: savedSize.width || auto.W, H: savedSize.height || auto.H };
          } else if (legacyHeight) {
            const auto = this.defaultTableSize(groupStudents.length, shape, card, share, roomW);
            start = { W: auto.W, H: legacyHeight };
          } else {
            start = this.defaultTableSize(groupStudents.length, shape, card, share, roomW);
          }

          const box = document.createElement('div');
          box.className = 'group-box table-group seat-drop-zone seat-drop-table';
          box.id = `group-box-${gIndex}`;

          const handHandle = document.createElement('div');
          handHandle.className = 'group-drag-handle';
          handHandle.title = 'Drag to move the table (drop it on another table to swap their students)';
          handHandle.innerHTML = '✋';
          box.appendChild(handHandle);

          const shapeBtn = document.createElement('button');
          shapeBtn.type = 'button';
          shapeBtn.className = 'table-shape-btn';
          shapeBtn.textContent = shape === 'round' ? '▭ Square' : '◯ Round';
          shapeBtn.title = shape === 'round' ? 'Make this a square table' : 'Make this a round table';
          shapeBtn.onclick = (e) => {
            e.stopPropagation();
            this.setTableShape(sizeKey, shape === 'round' ? 'rect' : 'round');
          };
          box.appendChild(shapeBtn);

          const table = document.createElement('div');
          table.className = 'group-table' + (shape === 'round' ? ' round' : '');
          box.appendChild(table);

          const badge = document.createElement('div');
          badge.className = 'group-header-badge table-tent';
          badge.style.setProperty('--tent', ['var(--red)', 'var(--blue)', 'var(--yellow)', 'var(--green)', 'var(--orange)', 'var(--purple)'][gIndex % 6]);
          badge.innerHTML = `${this.escapeHtml(title)}<span class="tent-count">(${groupStudents.length})</span>`;
          box.appendChild(badge);

          box.ondragover = (e) => this.handleDragOver(e);
          box.ondragenter = (e) => this.handleDragEnterGroup(e, gIndex, 'group-box');
          box.ondragleave = (e) => this.handleDragLeaveGroup(e, gIndex, 'group-box');
          box.ondrop = (e) => this.handleDropOnGroup(e, gIndex, layoutType);

          const seats = [];
          if (groupStudents.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'group-table-empty';
            placeholder.textContent = 'Drag students here';
            table.appendChild(placeholder);
          } else {
            groupStudents.forEach((studentName) => {
              const seatEl = this.createSeatElement(studentName, gIndex);
              seats.push(seatEl);
              box.appendChild(seatEl);
            });
          }

          const fit = this.fitTableGroup(seats.length, shape, start.W, start.H, card);
          const t = {
            gIndex, sizeKey, shape, box, table, badge, seats, fit,
            W: fit.W, H: fit.H,
            saved: savedSize && Number.isFinite(savedSize.x) && Number.isFinite(savedSize.y) ? { x: savedSize.x, y: savedSize.y } : null
          };
          // Lays the seats around the table for a box size; resizing calls it again as the box changes
          t.relayout = (W, H) => {
            t.fit = this.fitTableGroup(seats.length, shape, W, H, card);
            t.W = t.fit.W;
            t.H = t.fit.H;
            this.applyTableLayout(box, table, badge, seats, t.fit);
          };
          this.applyTableLayout(box, table, badge, seats, fit);
          floor.appendChild(box);
          return t;
        });

        // Where each table stands: where the teacher put it, else in its row as before
        const flow = this.flowTablePositions(rows, currentClass.layoutsData[alignKey], tables, roomW);
        tables.forEach(t => {
          const p = t.saved || flow[t.gIndex] || { x: 0, y: 0 };
          t.x = p.x;
          t.y = p.y;
        });
        this.settleTables(tables, roomW);

        const floorState = { container, floor, tables, roomW, layoutType, card };
        this.placeTableFloor(floorState);
        tables.forEach(t => this.makeTableMovable(t, floorState));
      }

      // How a table layout's tables stand in rows until the teacher moves them
      defaultTableRows(layoutType) {
        return {
          half: [[0, 1]],
          third: [[0, 1], [2]],
          fourth: [[0, 1], [2, 3]],
          fifth: [[0, 1], [4], [2, 3]],
          sixth: [[0, 1], [2, 3], [4, 5]]
        }[layoutType] || [[0]];
      }

      // The tables' spots in the old row arrangement: each row's tables side by side (wrapping when the
      // room is too narrow), lined up left, centre or right by the row's alignment
      flowTablePositions(rows, align, tables, roomW) {
        const out = {};
        const byIndex = {};
        tables.forEach(t => { byIndex[t.gIndex] = t; });
        const usable = roomW - 20;
        let y = 0;
        rows.forEach((rowGroupIndices, rIdx) => {
          const inRow = rowGroupIndices.map(g => byIndex[g]).filter(Boolean);
          const lines = [];
          let line = [];
          let lineW = 0;
          inRow.forEach(t => {
            const add = (line.length ? TABLE.space : 0) + t.W;
            if (line.length && lineW + add > usable) {
              lines.push(line);
              line = [];
              lineW = 0;
            }
            line.push(t);
            lineW += line.length > 1 ? TABLE.space + t.W : t.W;
          });
          if (line.length) lines.push(line);
          const a = (align && align[rIdx]) || 'center';
          lines.forEach(ln => {
            const w = ln.reduce((sum, t) => sum + t.W, 0) + TABLE.space * (ln.length - 1);
            let x = 10 + (a === 'flex-end' ? usable - w : a === 'flex-start' ? 0 : (usable - w) / 2);
            x = Math.max(0, x);
            const h = Math.max(...ln.map(t => t.H));
            ln.forEach(t => {
              out[t.gIndex] = { x, y };
              x += t.W + TABLE.space;
            });
            y += h + TABLE.space * 2;
          });
        });
        return out;
      }

      // Tables never overlap: going down the room, a table that runs into one already placed (it grew
      // with more students, say) moves to the nearest open spot. A room laid out wider than this
      // screen keeps its width; placeTableFloor shrinks it to fit.
      settleTables(tables, roomW) {
        const width = Math.max(roomW, ...tables.map(t => t.x + t.W));
        const placed = [];
        tables.slice().sort((a, b) => (a.y - b.y) || (a.x - b.x)).forEach(t => {
          let x = Math.max(0, Math.min(t.x, width - t.W));
          let y = Math.max(0, t.y);
          if (this.tableHits(x, y, t.W, t.H, placed)) {
            const spot = this.findOpenTableSpot(x, y, t.W, t.H, placed, width);
            x = spot.x;
            y = spot.y;
          }
          t.x = x;
          t.y = y;
          placed.push(t);
        });
      }

      // Does a w x h table at x, y come within TABLE.space of any of the others?
      tableHits(x, y, w, h, others) {
        const s = TABLE.space;
        return others.some(o => x < o.x + o.W + s && o.x < x + w + s && y < o.y + o.H + s && o.y < y + h + s);
      }

      // The open spot nearest to x, y for a w x h table: just clear of a neighbour's edge, or the room's
      // edge, on either axis. Below everything always works.
      findOpenTableSpot(x, y, w, h, others, roomW) {
        const s = TABLE.space;
        const maxX = Math.max(0, roomW - w);
        const xs = new Set([x, 0, maxX]);
        const ys = new Set([y, 0]);
        others.forEach(o => {
          xs.add(o.x + o.W + s);
          xs.add(o.x - w - s);
          ys.add(o.y + o.H + s);
          ys.add(o.y - h - s);
        });
        let best = null;
        xs.forEach(cx => {
          if (cx < 0 || cx > maxX + 0.5) return;
          ys.forEach(cy => {
            if (cy < 0) return;
            const d = (cx - x) * (cx - x) + (cy - y) * (cy - y);
            if (best && d >= best.d) return;
            if (!this.tableHits(cx, cy, w, h, others)) best = { x: cx, y: cy, d };
          });
        });
        if (best) return best;
        return { x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, ...others.map(o => o.y + o.H + s)) };
      }

      // Puts the tables on the floor. A room laid out wider than the screen (say in full screen, now
      // seen in the window) is shrunk to fit rather than rearranged.
      placeTableFloor(fs) {
        const { container, floor, tables } = fs;
        tables.forEach(t => {
          t.box.style.left = `${Math.round(t.x)}px`;
          t.box.style.top = `${Math.round(t.y)}px`;
        });
        const roomW = Math.max(fs.roomW, ...tables.map(t => t.x + t.W));
        const roomH = Math.max(160, ...tables.map(t => t.y + t.H)) + (this.isEditMode ? 90 : 20);
        const k = Math.min(1, fs.roomW / roomW);
        fs.floorW = roomW;
        fs.floorH = roomH;
        fs.scale = k;
        floor.style.width = `${roomW}px`;
        floor.style.height = `${roomH}px`;
        floor.style.transform = k < 0.999 ? `scale(${k.toFixed(4)})` : '';
        floor.style.marginBottom = k < 0.999 ? `${-roomH * (1 - k)}px` : '';
        container.style.minHeight = '0';
      }

      // Edit mode: drag a table by its hand or its top to anywhere it fits, drop it on another table to
      // swap their students, and size it from its bottom corners without running into its neighbours
      makeTableMovable(t, fs) {
        const others = () => fs.tables.filter(o => o !== t);
        // Pointer px to floor px (the chart's zoom and the floor's own shrink-to-fit)
        const perPx = () => fs.floorW / (fs.floor.getBoundingClientRect().width || fs.floorW);

        const startMove = (e) => {
          if (!this.isEditMode || e.button > 0) return;
          e.preventDefault();
          e.stopPropagation();
          const from = { x: t.x, y: t.y };
          const k = perPx();
          const sx = e.clientX;
          const sy = e.clientY;
          let moved = false;
          let swapWith = null;

          const onMove = (ev) => {
            const dx = (ev.clientX - sx) * k;
            const dy = (ev.clientY - sy) * k;
            if (!moved && Math.hypot(dx, dy) < 4) return;
            if (!moved) {
              moved = true;
              t.box.classList.add('table-moving');
            }
            const wantX = Math.max(0, Math.min(from.x + dx, fs.floorW - t.W));
            const wantY = Math.max(0, from.y + dy);

            // Over another table's top: swap students with it
            const fr = fs.floor.getBoundingClientRect();
            const px = (ev.clientX - fr.left) * k;
            const py = (ev.clientY - fr.top) * k;
            const target = others().find(o => {
              const tr = o.fit.plan.table;
              return px >= o.x + tr.x && px <= o.x + tr.x + tr.w && py >= o.y + tr.y && py <= o.y + tr.y + tr.h;
            }) || null;
            if (target !== swapWith) {
              if (swapWith) swapWith.box.classList.remove('table-swap-target');
              if (target) target.box.classList.add('table-swap-target');
              swapWith = target;
            }
            t.box.classList.toggle('table-swapping', !!target);

            let spot = { x: wantX, y: wantY };
            if (!target && this.tableHits(wantX, wantY, t.W, t.H, others())) {
              spot = this.findOpenTableSpot(wantX, wantY, t.W, t.H, others(), fs.floorW);
            }
            t.x = spot.x;
            t.y = spot.y;
            t.box.style.left = `${Math.round(t.x)}px`;
            t.box.style.top = `${Math.round(t.y)}px`;
            const needH = t.y + t.H + 90;
            if (needH > fs.floorH) {
              fs.floorH = needH;
              fs.floor.style.height = `${needH}px`;
            }
          };

          const onUp = () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointercancel', onUp);
            t.box.classList.remove('table-moving', 'table-swapping');
            if (swapWith) swapWith.box.classList.remove('table-swap-target');
            if (!moved) return;
            const currentClass = this.getCurrentClass();
            if (!currentClass) return;
            if (swapWith) {
              t.x = from.x;
              t.y = from.y;
              const groups = currentClass.layoutsData[fs.layoutType];
              if (groups) {
                const temp = groups[t.gIndex] || [];
                groups[t.gIndex] = groups[swapWith.gIndex] || [];
                groups[swapWith.gIndex] = temp;
              }
            }
            this.saveTablePlaces(currentClass, fs);
            this.saveData();
            this.render();
          };

          document.addEventListener('pointermove', onMove);
          document.addEventListener('pointerup', onUp);
          document.addEventListener('pointercancel', onUp);
        };

        t.box.querySelector('.group-drag-handle').addEventListener('pointerdown', startMove);
        t.table.addEventListener('pointerdown', startMove);
        t.badge.addEventListener('pointerdown', startMove);

        // Resize from the bottom corners; the left one keeps the right edge where it is
        const startResize = (e, corner) => {
          if (!this.isEditMode || e.button > 0) return;
          e.preventDefault();
          e.stopPropagation();
          const from = { x: t.x, W: t.W, H: t.H };
          const k = perPx();
          const sx = e.clientX;
          const sy = e.clientY;
          let last = { dx: 0, dy: 0 };

          const tryAt = (dx, dy) => {
            const reqW = Math.max(120, corner === 'br' ? from.W + dx : from.W - dx);
            const reqH = Math.max(60, from.H + dy);
            const fit = this.fitTableGroup(t.seats.length, t.shape, reqW, reqH, fs.card);
            const x = corner === 'br' ? from.x : from.x + from.W - fit.W;
            if (x < 0 || x + fit.W > fs.floorW + 0.5) return null;
            if (this.tableHits(x, t.y, fit.W, fit.H, others())) return null;
            return { x, fit };
          };

          const onMove = (ev) => {
            const dx = (ev.clientX - sx) * k;
            const dy = (ev.clientY - sy) * k;
            let step = { dx, dy };
            let r = tryAt(dx, dy);
            if (!r) {
              // Up against a neighbour or the room's edge: go as far as it allows on each axis
              const reach = (a, b, at) => {
                if (at(b)) return b;
                for (let i = 0; i < 10; i++) {
                  const mid = (a + b) / 2;
                  if (at(mid)) a = mid; else b = mid;
                }
                return a;
              };
              const rx = reach(last.dx, dx, v => tryAt(v, last.dy));
              const ry = reach(last.dy, dy, v => tryAt(rx, v));
              step = { dx: rx, dy: ry };
              r = tryAt(rx, ry);
            }
            if (!r) return;
            last = step;
            t.x = r.x;
            t.fit = r.fit;
            t.W = r.fit.W;
            t.H = r.fit.H;
            this.applyTableLayout(t.box, t.table, t.badge, t.seats, r.fit);
            t.box.style.left = `${Math.round(t.x)}px`;
            const needH = t.y + t.H + 90;
            if (needH > fs.floorH) {
              fs.floorH = needH;
              fs.floor.style.height = `${needH}px`;
            }
          };

          const onUp = () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointercancel', onUp);
            const currentClass = this.getCurrentClass();
            if (!currentClass) return;
            if (!currentClass.containerSizes) currentClass.containerSizes = {};
            currentClass.containerSizes[t.sizeKey] = {
              ...(currentClass.containerSizes[t.sizeKey] || {}),
              width: Math.round(t.W),
              height: Math.round(t.H)
            };
            this.saveTablePlaces(currentClass, fs);
            this.saveData();
            this.render();
          };

          document.addEventListener('pointermove', onMove);
          document.addEventListener('pointerup', onUp);
          document.addEventListener('pointercancel', onUp);
        };

        [['br', '◢', 'Resize from Bottom-Right'], ['bl', '◣', 'Resize from Bottom-Left']].forEach(([corner, mark, title]) => {
          const handle = document.createElement('div');
          handle.className = `resize-handle resize-handle-${corner}`;
          handle.title = title;
          handle.innerHTML = mark;
          handle.addEventListener('pointerdown', (e) => startResize(e, corner));
          t.box.appendChild(handle);
        });
      }

      // Once a table is moved or sized, every table in the layout keeps the spot it is in now, so
      // the room stays as the teacher left it (x and y ride along with the size in containerSizes)
      saveTablePlaces(currentClass, fs) {
        if (!currentClass.containerSizes) currentClass.containerSizes = {};
        fs.tables.forEach(o => {
          currentClass.containerSizes[o.sizeKey] = {
            ...(currentClass.containerSizes[o.sizeKey] || {}),
            x: Math.round(o.x),
            y: Math.round(o.y)
          };
        });
      }

      // ===== Special seating rules =====
      // currentClass.seatingRules = [{ id, student, type, other? }], type one of SEATING_RULE_TYPES.
      // They are only seen in the Special Seating Rules window, and Arrange Seating → Random follows them.

      getSeatingRules(cls) {
        return (cls && Array.isArray(cls.seatingRules)) ? cls.seatingRules : [];
      }

      normalizeSeatingRules(rules) {
        if (!Array.isArray(rules)) return [];
        return rules.filter(r => r && typeof r === 'object' && SEATING_RULE_TYPES[r.type] && typeof r.student === 'string' && r.student.trim()
          && (!SEATING_RULE_TYPES[r.type].pair || (typeof r.other === 'string' && r.other.trim() && r.other !== r.student)))
          .map(r => {
            const out = { id: (typeof r.id === 'string' && r.id) ? r.id : this.newSeatingRuleId(), student: r.student.trim(), type: r.type };
            if (SEATING_RULE_TYPES[r.type].pair) out.other = r.other.trim();
            return out;
          });
      }

      newSeatingRuleId() {
        return 'r' + Math.random().toString(36).slice(2, 9);
      }

      // In words, for the window and for the note after arranging
      describeSeatingRule(cls, rule, from) {
        const nameOf = s => this.getStudentProfile(cls, s).rosterName || s;
        const t = SEATING_RULE_TYPES[rule.type];
        if (!t.pair) return from ? t.label : `${nameOf(rule.student)} ${t.phrase}`;
        const other = from && rule.other === from ? rule.student : rule.other;
        if (from) return `${t.label} ${nameOf(other)}`;
        return `${nameOf(rule.student)} ${t.phrase} ${nameOf(rule.other)}`;
      }

      // --- The seats a Random arrangement fills, for the class's layout ---
      // Each slot has x (0 left .. 1 right) and y (0 front .. 1 back) on the floor (null when the layout
      // has no width or no depth, e.g. one row of tables: then left/right or front/back rules don't apply), end (an outside
      // seat), and lock (players may only trade seats with the same lock: Band sections). side(a, b)
      // says two slots are seat partners; near(a, b) that they sit close (beside, in front, behind).
      // write(order) puts the students, in slot order, into the layout.
      buildSeatSlots(cls, students) {
        const n = students.length;
        const layout = cls.layout || 'rows';
        const roundRobin = (count) => Array.from({ length: count }, (_, k) => Math.floor(n / count) + (k < n % count ? 1 : 0));
        const frac = (v, max) => max > 0 ? v / max : null;
        const slots = [];

        if (layout === 'band' && cls.band) {
          const band = cls.band;
          const lists = [...band.rows.map((row, r) => ({ row, r })), { row: band.perc, r: band.rows.length }];
          const filled = [];
          lists.forEach(({ row, r }) => {
            row.forEach((ch, i) => {
              if (!ch.student) return;
              filled.push(ch);
              slots.push({ x: frac(i, row.length - 1), y: frac(r, band.rows.length), end: i === 0 || i === row.length - 1, lock: ch.inst || '', r, i, len: row.length });
            });
          });
          return {
            slots,
            students: filled.map(ch => ch.student),
            side: (a, b) => slots[a].r === slots[b].r && Math.abs(slots[a].i - slots[b].i) === 1,
            near: (a, b) => {
              const p = slots[a];
              const q = slots[b];
              if (p.r === q.r) return Math.abs(p.i - q.i) === 1;
              return Math.abs(p.r - q.r) === 1 && Math.abs((p.x ?? 0.5) - (q.x ?? 0.5)) <= 1.2 / Math.max(p.len, q.len);
            },
            write: (order) => { filled.forEach((ch, k) => { ch.student = order[k]; }); }
          };
        }

        if (layout === 'circle') {
          for (let i = 0; i < n; i++) {
            const a = (i / n) * 2 * Math.PI - Math.PI / 2;
            slots.push({ x: 0.5 + 0.5 * Math.cos(a), y: 0.5 + 0.5 * Math.sin(a), end: true, lock: '' });
          }
          const ring = (a, b) => n > 1 && (Math.abs(a - b) === 1 || Math.abs(a - b) === n - 1);
          return { slots, students, side: ring, near: ring, write: (order) => { cls.circle = [...order]; } };
        }

        if (TABLE_LAYOUTS.includes(layout)) {
          const G = TABLE_LAYOUTS.indexOf(layout) + 2;
          const sizes = roundRobin(G);
          // Where each table stands: where the teacher put it, else its place in the row arrangement
          const sized = cls.containerSizes || {};
          const placed = Array.from({ length: G }, (_, g) => sized[`${layout}-${g}`]);
          let spots;
          if (placed.every(p => p && Number.isFinite(p.x) && Number.isFinite(p.y))) {
            spots = placed.map(p => ({ x: p.x + (p.width || 300) / 2, y: p.y + (p.height || 250) / 2 }));
          } else {
            const saved = cls.layoutsData && cls.layoutsData[`${layout}Rows`];
            const rowDef = (Array.isArray(saved) && saved.flat().length === G) ? saved : this.defaultTableRows(layout);
            spots = Array.from({ length: G }, () => ({ x: 0.5, y: 0 }));
            rowDef.forEach((row, r) => row.forEach((g, p) => { if (g < G) spots[g] = { x: (p + 0.5) / row.length, y: r }; }));
          }
          const xs = spots.map(s => s.x);
          const ys = spots.map(s => s.y);
          const nx = v => (Math.max(...xs) > Math.min(...xs)) ? (v - Math.min(...xs)) / (Math.max(...xs) - Math.min(...xs)) : null;
          const ny = v => (Math.max(...ys) > Math.min(...ys)) ? (v - Math.min(...ys)) / (Math.max(...ys) - Math.min(...ys)) : null;
          sizes.forEach((m, g) => {
            const x = nx(spots[g].x);
            for (let i = 0; i < m; i++) slots.push({ x, y: ny(spots[g].y), end: G === 1 || x === null || x <= 0.25 || x >= 0.75, lock: '', g });
          });
          const same = (a, b) => slots[a].g === slots[b].g;
          return {
            slots, students, side: same, near: same,
            write: (order) => {
              let k = 0;
              cls.layoutsData[layout] = sizes.map(m => order.slice(k, (k += m)));
            }
          };
        }

        if (layout === 'lines') {
          const L = cls.linesCount || 4;
          const sizes = roundRobin(L);
          const maxLen = Math.max(1, ...sizes);
          sizes.forEach((m, l) => {
            for (let i = 0; i < m; i++) slots.push({ x: frac(l, L - 1), y: frac(i, maxLen - 1), end: l === 0 || l === L - 1, lock: '', l, i });
          });
          return {
            slots, students,
            side: (a, b) => slots[a].l === slots[b].l && Math.abs(slots[a].i - slots[b].i) === 1,
            near: (a, b) => Math.abs(slots[a].l - slots[b].l) <= 1 && Math.abs(slots[a].i - slots[b].i) <= 1,
            write: (order) => {
              let k = 0;
              cls.lines = sizes.map(m => order.slice(k, (k += m)));
            }
          };
        }

        if (layout === 'freeform') {
          // A new random Free Form deals the cards onto a grid, 6 across (initInitialFreeformPositions)
          const cols = Math.max(1, Math.floor((880 - 36) / (115 + 14)));
          const rowsN = Math.max(1, Math.ceil(n / cols));
          for (let k = 0; k < n; k++) {
            const r = Math.floor(k / cols);
            const c = k % cols;
            const inRow = Math.min(cols, n - r * cols);
            slots.push({ x: frac(c, cols - 1), y: frac(r, rowsN - 1), end: c === 0 || c === inRow - 1, lock: '', r, c });
          }
          return {
            slots, students,
            side: (a, b) => slots[a].r === slots[b].r && Math.abs(slots[a].c - slots[b].c) === 1,
            near: (a, b) => Math.abs(slots[a].r - slots[b].r) <= 1 && Math.abs(slots[a].c - slots[b].c) <= 1,
            write: (order) => {
              cls.freeform = [...order];
              cls.freeformPositions = {};
              this.initInitialFreeformPositions(cls);
            }
          };
        }

        // Rows (and the Garden, which shows the Rows seating): rows are centred, so a seat's column is
        // counted from the middle of its row
        const R = cls.rowsCount || 4;
        if (cls.divideRows) {
          const sizes = roundRobin(R * 2);
          const W = Math.max(1, ...sizes);
          sizes.forEach((m, k) => {
            const r = Math.floor(k / 2);
            const s = k % 2;
            for (let i = 0; i < m; i++) {
              const cx = s === 0 ? i - m + 0.5 : i + 0.5;   // the aisle runs down the middle at 0
              slots.push({ x: (cx + W) / (2 * W), y: frac(r, R - 1), end: (s === 0 && i === 0) || (s === 1 && i === m - 1), lock: '', r, k, i, cx });
            }
          });
          return {
            slots, students,
            side: (a, b) => slots[a].k === slots[b].k && Math.abs(slots[a].i - slots[b].i) === 1,
            near: (a, b) => Math.abs(slots[a].r - slots[b].r) <= 1 && Math.abs(slots[a].cx - slots[b].cx) <= 1,
            write: (order) => {
              let at = 0;
              const secs = sizes.map(m => order.slice(at, (at += m)));
              cls.dividedRowsData = [];
              for (let r = 0; r < R; r++) cls.dividedRowsData.push([secs[r * 2] || [], secs[r * 2 + 1] || []]);
            }
          };
        }
        const sizes = roundRobin(R);
        const maxN = Math.max(1, ...sizes);
        sizes.forEach((m, r) => {
          for (let i = 0; i < m; i++) {
            const cx = i - (m - 1) / 2;
            slots.push({ x: maxN > 1 ? (cx + (maxN - 1) / 2) / (maxN - 1) : null, y: frac(r, R - 1), end: i === 0 || i === m - 1, lock: '', r, i, cx });
          }
        });
        return {
          slots, students,
          side: (a, b) => slots[a].r === slots[b].r && Math.abs(slots[a].i - slots[b].i) === 1,
          near: (a, b) => Math.abs(slots[a].r - slots[b].r) <= 1 && Math.abs(slots[a].cx - slots[b].cx) <= 1 && a !== b,
          write: (order) => {
            let k = 0;
            cls.rows = sizes.map(m => order.slice(k, (k += m)));
          }
        };
      }

      // How far a seating breaks a rule: 0 when it is kept
      seatingRuleCost(rule, model, pos) {
        const a = pos.get(rule.student);
        if (a === undefined) return 0;
        const p = model.slots[a];
        switch (rule.type) {
          case 'front': return (p.y === null || p.y <= 0.34) ? 0 : 1 + p.y;
          case 'back': return (p.y === null || p.y >= 0.66) ? 0 : 2 - p.y;
          case 'left': return (p.x === null || p.x <= 0.34) ? 0 : 1 + p.x;
          case 'right': return (p.x === null || p.x >= 0.66) ? 0 : 2 - p.x;
          case 'outside': return p.end ? 0 : 1;
          case 'with': {
            const b = pos.get(rule.other);
            if (b === undefined || model.side(a, b)) return 0;
            const q = model.slots[b];
            return 1 + Math.hypot((p.x ?? 0.5) - (q.x ?? 0.5), (p.y ?? 0.5) - (q.y ?? 0.5));
          }
          case 'apart': {
            const b = pos.get(rule.other);
            return (b !== undefined && model.near(a, b)) ? 1 : 0;
          }
          default: return 0;
        }
      }

      // A random seating that keeps the rules: a random deal, then seat trades (simulated annealing)
      // until no rule is broken. Returns the order to write and the rules it could not keep.
      solveSeatingRules(model, rules) {
        const n = model.slots.length;
        const names = model.students;
        // Deal each lock group (a Band section) its own players at random
        const groups = {};
        model.slots.forEach((s, i) => { (groups[s.lock] = groups[s.lock] || []).push(i); });
        const at = new Array(n);
        if (Object.keys(groups).length === 1) {
          this.shuffleArray([...names]).forEach((s, i) => { at[i] = s; });
        } else {
          Object.values(groups).forEach(idx => {
            this.shuffleArray(idx.map(i => names[i])).forEach((s, k) => { at[idx[k]] = s; });
          });
        }
        const pos = new Map(at.map((s, i) => [s, i]));
        const live = rules.filter(r => pos.has(r.student) && (!SEATING_RULE_TYPES[r.type].pair || pos.has(r.other)));
        const total = () => live.reduce((sum, r) => sum + this.seatingRuleCost(r, model, pos), 0);
        let cost = total();
        let best = { cost, at: [...at] };
        const swap = (i, j) => {
          const t = at[i];
          at[i] = at[j];
          at[j] = t;
          pos.set(at[i], i);
          pos.set(at[j], j);
        };
        const steps = 30000;
        for (let step = 0; step < steps && best.cost > 0; step++) {
          const temp = 1.2 * (1 - step / steps) + 0.02;
          // Mostly move someone whose rule is broken
          const broken = live.filter(r => this.seatingRuleCost(r, model, pos) > 0);
          let who;
          if (broken.length && Math.random() < 0.8) {
            const r = broken[Math.floor(Math.random() * broken.length)];
            who = SEATING_RULE_TYPES[r.type].pair && Math.random() < 0.5 ? r.other : r.student;
          } else {
            who = at[Math.floor(Math.random() * n)];
          }
          const i = pos.get(who);
          const pool = groups[model.slots[i].lock];
          if (pool.length < 2) continue;
          const j = pool[Math.floor(Math.random() * pool.length)];
          if (j === i) continue;
          swap(i, j);
          const next = total();
          if (next <= cost || Math.random() < Math.exp((cost - next) / temp)) {
            cost = next;
            if (cost < best.cost) best = { cost, at: [...at] };
          } else {
            swap(i, j);
          }
        }
        // The rules the best seating still breaks
        const bestPos = new Map(best.at.map((s, i) => [s, i]));
        const unmet = live.filter(r => this.seatingRuleCost(r, model, bestPos) > 0);
        return { order: best.at, unmet, kept: live.length - unmet.length, live: live.length };
      }

      // Arrange Seating → Random for a class with rules; false when it has none that apply
      arrangeRandomWithRules(cls, students) {
        const rules = this.getSeatingRules(cls);
        if (!rules.length || !students.length) return false;
        const model = this.buildSeatSlots(cls, students);
        if (!model.slots.length) return false;
        const result = this.solveSeatingRules(model, rules);
        if (!result.live) return false;
        model.write(result.order);
        if (!result.unmet.length) {
          this.showBandNotice(`Seated at random, keeping all ${result.live} special seating rule${result.live === 1 ? '' : 's'}.`);
        } else {
          const list = result.unmet.slice(0, 2).map(r => this.describeSeatingRule(cls, r)).join('; ');
          this.showBandNotice(`Seated at random. ${result.unmet.length} rule${result.unmet.length === 1 ? '' : 's'} couldn't be kept: ${list}${result.unmet.length > 2 ? '…' : ''}`);
        }
        return true;
      }

      // --- The Special Seating Rules window ---

      openSeatingRulesModal() {
        this.rulesClassId = this.currentClassId;
        this.rulesStudent = null;
        this.renderSeatingRulesModal();
        document.getElementById('seatingRulesModal').classList.add('active');
      }

      setRulesClass(id) {
        this.rulesClassId = id;
        this.rulesStudent = null;
        this.renderSeatingRulesModal();
      }

      selectRulesStudent(name) {
        this.rulesStudent = this.rulesStudent === name ? null : name;
        this.renderSeatingRulesModal();
      }

      getRulesClass() {
        return this.classes.find(c => c.id === this.rulesClassId) || this.getCurrentClass();
      }

      // Place rules: front/back are one choice, left/right another; pressing the chosen one clears it
      toggleSeatingPlaceRule(type) {
        const cls = this.getRulesClass();
        const who = this.rulesStudent;
        if (!cls || !who || !SEATING_RULE_TYPES[type]) return;
        if (!Array.isArray(cls.seatingRules)) cls.seatingRules = [];
        const had = cls.seatingRules.some(r => r.student === who && r.type === type);
        const clash = { front: 'back', back: 'front', left: 'right', right: 'left' }[type];
        cls.seatingRules = cls.seatingRules.filter(r => !(r.student === who && (r.type === type || r.type === clash)));
        if (!had) cls.seatingRules.push({ id: this.newSeatingRuleId(), student: who, type });
        this.saveData();
        this.renderSeatingRulesModal();
      }

      // Partner rules belong to the pair, whichever name they were added from
      addSeatingPairRule(type) {
        const cls = this.getRulesClass();
        const who = this.rulesStudent;
        const sel = document.getElementById(type === 'with' ? 'rulesWithSelect' : 'rulesApartSelect');
        const other = sel ? sel.value : '';
        if (!cls || !who || !other || other === who) return;
        if (!Array.isArray(cls.seatingRules)) cls.seatingRules = [];
        const samePair = r => SEATING_RULE_TYPES[r.type].pair && ((r.student === who && r.other === other) || (r.student === other && r.other === who));
        cls.seatingRules = cls.seatingRules.filter(r => !samePair(r));
        cls.seatingRules.push({ id: this.newSeatingRuleId(), student: who, type, other });
        this.saveData();
        this.renderSeatingRulesModal();
      }

      removeSeatingRule(id) {
        const cls = this.getRulesClass();
        if (!cls || !Array.isArray(cls.seatingRules)) return;
        cls.seatingRules = cls.seatingRules.filter(r => r.id !== id);
        this.saveData();
        this.renderSeatingRulesModal();
      }

      renderSeatingRulesModal() {
        const cls = this.getRulesClass();
        const classSel = document.getElementById('rulesClassSelect');
        if (classSel) {
          classSel.innerHTML = this.classes.map(c => `<option value="${this.escapeHtml(c.id)}">${this.escapeHtml(c.name)}</option>`).join('');
          if (cls) classSel.value = cls.id;
        }
        const listEl = document.getElementById('rulesStudentList');
        const editor = document.getElementById('rulesEditor');
        if (!listEl || !editor) return;
        if (!cls) {
          listEl.innerHTML = '';
          editor.innerHTML = '';
          return;
        }
        const names = Array.isArray(cls.classList) ? cls.classList : [];
        const rules = this.getSeatingRules(cls).filter(r => names.includes(r.student) && (!r.other || names.includes(r.other)));
        const nameOf = s => this.getStudentProfile(cls, s).rosterName || s;
        const countFor = s => rules.filter(r => r.student === s || r.other === s).length;
        if (this.rulesStudent && !names.includes(this.rulesStudent)) this.rulesStudent = null;

        listEl.innerHTML = names.length ? '' : '<li class="rules-empty">This class has no students yet.</li>';
        names.forEach(s => {
          const li = document.createElement('li');
          const n = countFor(s);
          li.className = 'rules-student' + (s === this.rulesStudent ? ' selected' : '') + (n ? ' has-rules' : '');
          li.innerHTML = `<span class="rules-student-name">${this.escapeHtml(nameOf(s))}</span>${n ? `<span class="rules-count">${n}</span>` : ''}`;
          li.onclick = () => this.selectRulesStudent(s);
          listEl.appendChild(li);
        });

        const summary = document.getElementById('rulesSummary');
        if (summary) summary.textContent = rules.length ? `${rules.length} rule${rules.length === 1 ? '' : 's'} in this class` : 'No rules in this class yet';

        const who = this.rulesStudent;
        if (!who) {
          editor.innerHTML = `<div class="rules-pick-hint">Pick a student to give them a special rule.</div>${rules.length ? `<div class="rules-all"><div class="rules-all-head">All rules in this class</div>${rules.map(r => `<div class="rules-all-item">${this.escapeHtml(this.describeSeatingRule(cls, r))}</div>`).join('')}</div>` : ''}`;
          return;
        }
        const mine = rules.filter(r => r.student === who || r.other === who);
        const has = type => mine.some(r => r.student === who && r.type === type);
        const others = names.filter(s => s !== who);
        const options = others.map(s => `<option value="${this.escapeHtml(s)}">${this.escapeHtml(nameOf(s))}</option>`).join('');
        const placeBtn = (type) => `<button type="button" class="btn btn-small rules-place-btn${has(type) ? ' on' : ''}" onclick="app.toggleSeatingPlaceRule('${type}')">${SEATING_RULE_TYPES[type].icon} ${SEATING_RULE_TYPES[type].short}</button>`;
        editor.innerHTML = `
          <div class="rules-editor-head">${this.escapeHtml(nameOf(who))}</div>
          <div class="rules-current">
            ${mine.length ? mine.map(r => `<span class="rules-chip rules-chip-${r.type}">${this.escapeHtml(this.describeSeatingRule(cls, r, who))}<button type="button" title="Remove this rule" onclick="app.removeSeatingRule('${r.id}')">&times;</button></span>`).join('') : '<span class="rules-none">No rules yet</span>'}
          </div>
          <div class="rules-section-label">Where they sit</div>
          <div class="rules-place-grid">
            ${placeBtn('front')}${placeBtn('back')}${placeBtn('left')}${placeBtn('right')}${placeBtn('outside')}
          </div>
          <div class="rules-section-label">Who they sit with</div>
          <div class="rules-pair-row">
            <span class="rules-pair-label rules-pair-with">Sit with</span>
            <select id="rulesWithSelect" class="subheader-select">${options}</select>
            <button type="button" class="btn btn-small btn-primary" onclick="app.addSeatingPairRule('with')" ${others.length ? '' : 'disabled'}>Add</button>
          </div>
          <div class="rules-pair-row">
            <span class="rules-pair-label rules-pair-apart">Don't sit with</span>
            <select id="rulesApartSelect" class="subheader-select">${options}</select>
            <button type="button" class="btn btn-small btn-red" onclick="app.addSeatingPairRule('apart')" ${others.length ? '' : 'disabled'}>Add</button>
          </div>`;
      }

      // ===== Band seating =====
      // currentClass.band = { rows: [[chair, ...], ...] (arcs, front first, chairs left to right as the
      // podium sees them), perc: [chair, ...] (the percussion line, left to right) }
      // chair = { id, inst: an id in BAND_INSTRUMENTS or '', student: a name or '' }

      newBandChairId() {
        return 'c' + Math.random().toString(36).slice(2, 9);
      }

      makeBandChair(inst = '', student = '') {
        return { id: this.newBandChairId(), inst, student };
      }

      // A stored band made safe to use (bad chairs mended, sizes capped); null if there is nothing usable
      normalizeBand(band) {
        if (!band || typeof band !== 'object') return null;
        const chair = ch => ({
          id: (ch && typeof ch.id === 'string' && ch.id) ? ch.id : this.newBandChairId(),
          inst: (ch && BAND_INSTRUMENTS[ch.inst]) ? ch.inst : '',
          student: (ch && typeof ch.student === 'string') ? ch.student.trim() : ''
        });
        const rows = (Array.isArray(band.rows) ? band.rows : [])
          .filter(r => Array.isArray(r) && r.length)
          .slice(0, BAND.maxRows)
          .map(r => r.slice(0, BAND.maxSeats).map(chair));
        if (!rows.length) return null;
        const perc = (Array.isArray(band.perc) ? band.perc : []).slice(0, BAND.maxPerc).map(chair);
        return { ...band, rows, perc };
      }

      // A first band for a class: enough chairs on 1 to 4 arcs (more on the back arcs, which are longer),
      // with the students seated front row first, in the order given
      createDefaultBand(students) {
        const n = Math.max(1, students.length);
        const rowCount = n <= 10 ? 1 : n <= 24 ? 2 : n <= 42 ? 3 : 4;
        const weights = Array.from({ length: rowCount }, (_, i) => i + 2);
        const total = weights.reduce((a, b) => a + b, 0);
        const counts = weights.map(w => Math.max(1, Math.min(BAND.maxSeats, Math.round(n * w / total))));
        let sum = counts.reduce((a, b) => a + b, 0);
        for (let i = rowCount - 1, guard = 0; sum < n && guard < 400; guard++, i = (i - 1 + rowCount) % rowCount) {
          if (counts[i] < BAND.maxSeats) {
            counts[i]++;
            sum++;
          }
        }
        const queue = [...students];
        return {
          rows: counts.map(c => Array.from({ length: c }, () => this.makeBandChair('', queue.shift() || ''))),
          perc: []
        };
      }

      getBandChairs(band) {
        if (!band) return [];
        return [...band.rows.flat(), ...band.perc];
      }

      findBandChair(band, student) {
        if (!student) return null;
        return this.getBandChairs(band).find(ch => ch.student === student) || null;
      }

      findBandChairById(band, id) {
        return this.getBandChairs(band).find(ch => ch.id === id) || null;
      }

      // Where a chair is: { list, index, row } with row = arc number or 'perc'
      locateBandChair(band, id) {
        for (let r = 0; r < band.rows.length; r++) {
          const index = band.rows[r].findIndex(ch => ch.id === id);
          if (index > -1) return { list: band.rows[r], index, row: r };
        }
        const index = band.perc.findIndex(ch => ch.id === id);
        return index > -1 ? { list: band.perc, index, row: 'perc' } : null;
      }

      // An instrument's section in chair order. The order snakes (front arc left to right, the next
      // arc right to left, ...) so neighbours in the list are neighbours on the floor, and a shift
      // along the section moves each player one chair over.
      getBandSection(band, inst) {
        const out = [];
        band.rows.forEach((row, r) => {
          const list = row.filter(ch => ch.inst === inst);
          out.push(...(r % 2 ? list.reverse() : list));
        });
        const perc = band.perc.filter(ch => ch.inst === inst);
        out.push(...(band.rows.length % 2 ? perc.reverse() : perc));
        return out;
      }

      // Seats a student in a chair. 'swap' trades places with whoever is there (a student coming from
      // To Be Placed sends them there); 'insert' slides the section along, toward its nearest open
      // chair, so nobody leaves the section. Returns the name pushed out of a full section, or null.
      placeInBand(band, name, target, mode) {
        const source = this.findBandChair(band, name);
        if (source === target) return null;
        if (!target.student) {
          if (source) source.student = '';
          target.student = name;
          return null;
        }
        if (mode !== 'insert' || !target.inst) {
          const other = target.student;
          target.student = name;
          if (source) source.student = other;
          return null;
        }
        if (source) source.student = '';
        const section = this.getBandSection(band, target.inst);
        const k = section.indexOf(target);
        let open = -1;
        for (let d = 1; d < section.length && open < 0; d++) {
          if (k + d < section.length && !section[k + d].student) open = k + d;
          else if (k - d >= 0 && !section[k - d].student) open = k - d;
        }
        let bumped = null;
        if (open < 0) {
          open = section.length - 1;
          bumped = section[open].student;
        }
        if (open > k) for (let j = open; j > k; j--) section[j].student = section[j - 1].student;
        else for (let j = open; j < k; j++) section[j].student = section[j + 1].student;
        target.student = name;
        return bumped;
      }

      instrumentTextColor(hex) {
        const n = parseInt(hex.slice(1), 16);
        const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
        return lum > 0.62 ? '#2b2118' : '#fffdf3';
      }

      instrumentTint(hex, alpha) {
        const n = parseInt(hex.slice(1), 16);
        return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
      }

      // Fills a <select> with every instrument, by family
      fillInstrumentOptions(select, noneLabel, value) {
        select.innerHTML = '';
        const none = document.createElement('option');
        none.value = '';
        none.textContent = noneLabel;
        select.appendChild(none);
        BAND_FAMILIES.forEach(f => {
          const group = document.createElement('optgroup');
          group.label = f.name;
          f.items.forEach(([id, name, abbr]) => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = `${name} (${abbr})`;
            group.appendChild(opt);
          });
          select.appendChild(group);
        });
        select.value = value || '';
      }

      // Where every chair goes. Chairs stay upright (names are read, not tilted) with their centres on
      // the arcs; each arc's radius grows until its chairs clear each other and the arc in front.
      // Local coordinates have the arcs' centre (the conductor) at 0, 0 and y pointing down.
      planBandSeats(band, card) {
        const w = card.w;
        const h = card.h;
        const seats = [];
        const arcs = [];
        const placed = [];
        const clearOf = (x, y, list, gx, gy) => !list.some(p => Math.abs(p.x - x) < w + gx && Math.abs(p.y - y) < h + gy);
        const gw = w + BAND.gap;
        const gh = h + BAND.gap;
        const apart = (R, a, b) => Math.abs(R * (Math.sin(b) - Math.sin(a))) >= gw || Math.abs(R * (Math.cos(b) - Math.cos(a))) >= gh;
        // The angles (right half, from the top) of n chairs packed as close as upright cards allow on
        // radius R, then spread out to an easy spacing (or the whole arc); null if they don't fit
        const arcAngles = (R, n) => {
          if (n === 1) return [0];
          const half = [];
          let t;
          if (n % 2) {
            half.push(0);
            t = 0;
          } else {
            if (gw / (2 * R) >= 1) return null;
            t = Math.asin(gw / (2 * R));
            half.push(t);
          }
          while (half.length < Math.ceil(n / 2)) {
            let dt = 0.002;
            while (!apart(R, t, t + dt) && dt < Math.PI) dt += 0.002;
            t += dt;
            if (t > BAND.arc + 1e-9) return null;
            half.push(t);
          }
          const end = half[half.length - 1];
          const target = Math.min(BAND.arc, Math.max(end, (n - 1) * (gw + 24) / (2 * R)));
          const k = end > 0 ? target / end : 1;
          const spread = half.map(a => a * k);
          const ok = spread.every((a, i) => i === 0 || apart(R, spread[i - 1], a));
          const use = ok ? spread : half;
          return [...use.slice(n % 2 ? 1 : 0).map(a => -a).reverse(), ...use];
        };
        let prevR = 0;
        band.rows.forEach((row, r) => {
          const n = row.length;
          let R = r === 0 ? BAND.frontR : prevR + h * 0.7;
          let pts = null;
          let span = 0;
          for (let i = 0; i < 800; i++, R += 4) {
            const angles = arcAngles(R, n);
            if (!angles) continue;
            const tryPts = angles.map(t => ({ x: R * Math.sin(t), y: -R * Math.cos(t) }));
            if (tryPts.every(p => clearOf(p.x, p.y, placed, BAND.rowGap, BAND.rowGap))) {
              pts = tryPts;
              span = angles[angles.length - 1];
              break;
            }
          }
          if (!pts) pts = row.map(() => ({ x: 0, y: -R }));
          pts.forEach((p, j) => {
            placed.push(p);
            seats.push({ chair: row[j], row: r, x: p.x, y: p.y });
          });
          arcs.push({ R, span: span + (w * 0.75) / R });
          prevR = R;
        });

        const top = Math.min(...placed.map(p => p.y));
        // The percussion: one line behind the arcs, or two staggered lines when there are more than
        // BAND.percPerLine stations (the first half on the nearer line), so a big section doesn't
        // stretch the whole chart
        const percLines = [];
        if (band.perc.length) {
          const n = band.perc.length;
          const outer = arcs.length ? arcs[arcs.length - 1].R : BAND.frontR;
          const perLine = n > BAND.percPerLine ? Math.ceil(n / 2) : n;
          for (let start = 0, li = 0; start < n; start += perLine, li++) {
            const chairs = band.perc.slice(start, start + perLine);
            const m = chairs.length;
            const y = top - h - BAND.percGap - li * (h + 30);
            const width = m > 1 ? (n > BAND.percPerLine ? (m - 1) * (w + 26) : Math.max((m - 1) * (w + 30), Math.min(outer * 1.5, (m - 1) * w * 2))) : 0;
            const shift = li % 2 ? (w + 26) / 2 : 0;   // the back line sits between the front line's players
            chairs.forEach((chair, j) => {
              const x = (m > 1 ? -width / 2 + j * width / (m - 1) : 0) + shift;
              seats.push({ chair, row: 'perc', x, y });
            });
            percLines.push({ y, x0: -width / 2 - w + shift, x1: width / 2 + w + shift });
          }
        }
        const perc = percLines.length ? percLines[percLines.length - 1] : null;

        const podium = { x: -BAND.podiumW / 2, y: 14, w: BAND.podiumW, h: BAND.podiumH };
        const xs = [podium.x, podium.x + podium.w];
        const ys = [podium.y + podium.h];
        seats.forEach(s => {
          xs.push(s.x - w / 2, s.x + w / 2);
          ys.push(s.y - h / 2, s.y + h / 2);
        });
        arcs.forEach(a => {
          const reach = Math.min(Math.PI, a.span);
          xs.push(-a.R * Math.sin(Math.min(Math.PI / 2, reach)), a.R * Math.sin(Math.min(Math.PI / 2, reach)));
          ys.push(-a.R * Math.cos(reach));
        });
        percLines.forEach(l => xs.push(l.x0, l.x1));
        const ox = BAND.pad - Math.min(...xs);
        const oy = BAND.pad + 10 - Math.min(...ys);
        return {
          W: Math.ceil(Math.max(...xs) - Math.min(...xs) + 2 * BAND.pad),
          H: Math.ceil(Math.max(...ys) - Math.min(...ys) + 2 * BAND.pad + 10),
          ox, oy, w, h, seats, arcs, perc, percLines, podium
        };
      }

      renderBandLayout(container, currentClass) {
        container.className = 'chart-container band-floor-container';
        if (!currentClass.band) {
          currentClass.band = this.createDefaultBand(this.sortStudentsByName(this.getAllClassStudents(currentClass), 'last'));
          this.saveData();
        }
        const band = currentClass.band;
        const card = this.getSeatCardSize(currentClass);
        const showFaces = card.w > 100;
        const plan = this.planBandSeats(band, card);
        const editing = this.isEditMode;
        const painting = editing && this.bandPaint && this.bandPaint.on;
        if (!editing) this.closeBandChairEditor();

        const roomW = Math.max(320, this.getChartContentWidth());
        this.chartRoomW = Math.round(this.getChartContentWidth());
        const k = Math.min(1, roomW / plan.W);
        const floor = document.createElement('div');
        floor.className = 'band-floor' + (painting ? ' band-painting' : '');
        floor.style.width = `${plan.W}px`;
        floor.style.height = `${plan.H}px`;
        // Centred in the room, whether shown full size or shrunk to fit (the shrink keeps the top left)
        floor.style.marginLeft = `max(0px, calc((100% - ${(plan.W * k).toFixed(1)}px) / 2))`;
        if (k < 0.999) {
          floor.style.transform = `scale(${k.toFixed(4)})`;
          floor.style.marginBottom = `${-plan.H * (1 - k)}px`;
        }
        container.appendChild(floor);

        // The arcs and the percussion line the chairs sit on
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'band-lines');
        svg.setAttribute('width', plan.W);
        svg.setAttribute('height', plan.H);
        svg.setAttribute('viewBox', `0 0 ${plan.W} ${plan.H}`);
        const line = (d) => {
          const path = document.createElementNS(svgNS, 'path');
          path.setAttribute('d', d);
          svg.appendChild(path);
        };
        plan.arcs.forEach(a => {
          const s = Math.min(Math.PI * 0.62, a.span);
          const x0 = plan.ox - a.R * Math.sin(s);
          const x1 = plan.ox + a.R * Math.sin(s);
          const y = plan.oy - a.R * Math.cos(s);
          line(`M ${x0.toFixed(1)} ${y.toFixed(1)} A ${a.R} ${a.R} 0 ${2 * s > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y.toFixed(1)}`);
        });
        plan.percLines.forEach(l => line(`M ${(plan.ox + l.x0).toFixed(1)} ${(plan.oy + l.y).toFixed(1)} H ${(plan.ox + l.x1).toFixed(1)}`));
        floor.appendChild(svg);

        const podium = document.createElement('div');
        podium.className = 'band-podium';
        podium.textContent = 'Podium';
        podium.style.left = `${plan.ox + plan.podium.x}px`;
        podium.style.top = `${plan.oy + plan.podium.y}px`;
        podium.style.width = `${plan.podium.w}px`;
        podium.style.height = `${plan.podium.h}px`;
        floor.appendChild(podium);

        if (plan.perc) {
          const label = document.createElement('div');
          label.className = 'band-perc-label';
          label.textContent = 'Percussion';
          label.style.left = `${plan.ox + plan.perc.x0}px`;
          label.style.top = `${plan.oy + plan.perc.y - plan.h / 2 - 26}px`;
          floor.appendChild(label);
        }

        plan.seats.forEach(spot => {
          const chair = spot.chair;
          const inst = BAND_INSTRUMENTS[chair.inst] || null;
          let el;
          if (chair.student) {
            el = this.createSeatElement(chair.student, null);
            el.classList.add('band-seat');
          } else {
            el = document.createElement('div');
            el.className = 'band-chair-open' + (showFaces ? '' : ' no-faces') + (editing ? ' band-chair-editable' : '');
            el.innerHTML = `<span class="band-open-label">${inst ? 'open' : (editing ? 'open chair' : '')}</span>`;
            if (editing) el.title = 'Click to choose an instrument or seat a student';
          }
          el.dataset.chair = chair.id;
          el.style.position = 'absolute';
          el.style.left = `${plan.ox + spot.x - plan.w / 2}px`;
          el.style.top = `${plan.oy + spot.y - plan.h / 2}px`;
          el.style.margin = '0';
          if (inst) {
            el.classList.add('band-has-inst');
            el.style.setProperty('--seat-color', inst.color);
            el.style.setProperty('--inst-tint', this.instrumentTint(inst.color, chair.student ? 0.13 : 0.1));
            el.style.setProperty('--inst-line', this.instrumentTint(inst.color, 0.75));
          }
          if (inst || editing) {
            const tag = document.createElement('span');
            tag.className = 'band-tag' + (inst ? '' : ' band-tag-none');
            tag.textContent = inst ? inst.abbr : '+ instrument';
            if (inst) {
              tag.style.background = inst.color;
              tag.style.color = this.instrumentTextColor(inst.color);
              tag.title = inst.name + (editing ? ' (click to change this chair)' : '');
            } else {
              tag.title = 'Choose this chair\'s instrument';
            }
            if (editing) {
              tag.onclick = (e) => {
                e.stopPropagation();
                if (!painting) this.openBandChairEditor(chair.id);
              };
            }
            el.appendChild(tag);
          }

          if (editing) {
            if (painting) {
              el.draggable = false;
              el.onpointerdown = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.bandPaintDown = true;
                this.paintBandChair(chair.id);
              };
              el.onpointerenter = () => {
                if (this.bandPaintDown) this.paintBandChair(chair.id);
              };
              el.onclick = (e) => e.stopPropagation();
              el.ondblclick = (e) => e.stopPropagation();
            } else {
              if (!chair.student) el.onclick = (e) => {
                e.stopPropagation();
                this.openBandChairEditor(chair.id);
              };
              el.ondragover = (e) => this.handleBandDragOver(e, chair.id);
              el.ondragenter = (e) => this.handleDragOver(e);
              el.ondragleave = (e) => {
                if (!el.contains(e.relatedTarget)) {
                  el.classList.remove('drag-over', 'band-drop-insert');
                  this.hideBandDropHint();
                }
              };
              el.ondrop = (e) => this.handleBandDrop(e, chair.id);
            }
          }
          floor.appendChild(el);
        });

        container.appendChild(this.renderBandLegend(band));
      }

      // Under the chart: each section's colour, name and how many of its chairs are filled
      renderBandLegend(band) {
        const legend = document.createElement('div');
        legend.className = 'band-legend';
        const counts = {};
        let open = 0;
        this.getBandChairs(band).forEach(ch => {
          if (!ch.inst) {
            if (!ch.student) open++;
            return;
          }
          if (!counts[ch.inst]) counts[ch.inst] = { chairs: 0, filled: 0 };
          counts[ch.inst].chairs++;
          if (ch.student) counts[ch.inst].filled++;
        });
        const ids = Object.keys(counts).sort((a, b) => BAND_INSTRUMENTS[a].order - BAND_INSTRUMENTS[b].order);
        if (!ids.length) {
          legend.innerHTML = `<span class="band-legend-hint">${this.isEditMode
            ? 'Give the chairs instruments: click a chair’s tag, or use 🖌 Paint chairs above.'
            : 'Press EDIT to give the chairs instruments.'}</span>`;
          return legend;
        }
        legend.innerHTML = ids.map(id => {
          const inst = BAND_INSTRUMENTS[id];
          const c = counts[id];
          return `<span class="band-legend-item" title="${this.escapeHtml(inst.name)}: ${c.filled} of ${c.chairs} chairs filled"><span class="band-legend-dot" style="background:${inst.color}"></span>${this.escapeHtml(inst.name)} <b>${c.filled}/${c.chairs}</b></span>`;
        }).join('') + (open ? `<span class="band-legend-item band-legend-open">Open chairs, no instrument <b>${open}</b></span>` : '');
        return legend;
      }

      // Middle of a filled chair swaps, its edges insert into the section; an open chair just takes the student
      getBandDropMode(el, clientX, chair) {
        if (!chair.student) return 'place';
        if (!chair.inst) return 'swap';
        const r = el.getBoundingClientRect();
        const frac = (clientX - r.left) / r.width;
        return (frac < 0.28 || frac > 0.72) ? 'insert' : 'swap';
      }

      handleBandDragOver(e, chairId) {
        if (!this.isEditMode || !this.draggedStudentName) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const currentClass = this.getCurrentClass();
        const chair = currentClass && currentClass.band ? this.findBandChairById(currentClass.band, chairId) : null;
        if (!chair || chair.student === this.draggedStudentName) {
          this.hideBandDropHint();
          return;
        }
        const el = e.currentTarget;
        const mode = this.getBandDropMode(el, e.clientX, chair);
        el.classList.toggle('drag-over', mode !== 'insert');
        el.classList.toggle('band-drop-insert', mode === 'insert');
        const inst = BAND_INSTRUMENTS[chair.inst];
        const who = this.getStudentProfile(currentClass, chair.student).firstName || chair.student;
        const text = mode === 'place'
          ? (inst ? `Sit here (${inst.name})` : 'Sit here')
          : mode === 'swap'
            ? `Swap with ${who}`
            : `Sit here: the ${inst.name} section moves over`;
        let hint = document.getElementById('bandDropHint');
        if (!hint) {
          hint = document.createElement('div');
          hint.id = 'bandDropHint';
          hint.className = 'band-drop-hint';
          document.body.appendChild(hint);
        }
        hint.textContent = text;
        const r = el.getBoundingClientRect();
        hint.style.left = `${r.left + r.width / 2}px`;
        hint.style.top = `${r.top - 8}px`;
        hint.style.display = 'block';
      }

      hideBandDropHint() {
        const hint = document.getElementById('bandDropHint');
        if (hint) hint.style.display = 'none';
      }

      handleBandDrop(e, chairId) {
        if (!this.isEditMode) return;
        e.preventDefault();
        e.stopPropagation();
        const el = e.currentTarget;
        el.classList.remove('drag-over', 'band-drop-insert');
        this.hideBandDropHint();
        const name = this.draggedStudentName;
        const currentClass = this.getCurrentClass();
        if (!name || !currentClass || currentClass.layout !== 'band' || !currentClass.band) {
          this.resetDragState();
          return;
        }
        const target = this.findBandChairById(currentClass.band, chairId);
        if (!target || target.student === name) {
          this.resetDragState();
          return;
        }
        const mode = this.getBandDropMode(el, e.clientX, target);
        const inst = BAND_INSTRUMENTS[target.inst];
        const bumped = this.placeInBand(currentClass.band, name, target, mode);
        this.resetDragState();
        this.saveData();
        this.render();
        if (bumped) {
          const who = this.getStudentProfile(currentClass, bumped).rosterName || bumped;
          this.showBandNotice(`The ${inst ? inst.name : ''} section is full, so ${who} moved to To Be Placed.`);
        }
      }

      showBandNotice(text) {
        let el = document.getElementById('bandNotice');
        if (!el) {
          el = document.createElement('div');
          el.id = 'bandNotice';
          el.className = 'band-notice';
          document.body.appendChild(el);
        }
        el.textContent = text;
        el.classList.add('show');
        clearTimeout(this.bandNoticeTimer);
        this.bandNoticeTimer = setTimeout(() => el.classList.remove('show'), 4500);
      }

      // --- Band settings (the bar under Layout while editing) ---

      updateBandSubheader(currentClass) {
        const bar = document.getElementById('bandSubheader');
        if (!bar) return;
        const show = currentClass && this.isEditMode && (this.currentViewMode === 'chart' || !this.currentViewMode) && currentClass.layout === 'band' && currentClass.band;
        if (!show) {
          bar.style.display = 'none';
          if (this.bandPaint) this.bandPaint.on = false;
          return;
        }
        bar.style.display = 'flex';
        const band = currentClass.band;
        const rowsSel = document.getElementById('bandRowsCount');
        if (rowsSel) rowsSel.value = String(band.rows.length);
        const percSel = document.getElementById('bandPercCount');
        if (percSel) percSel.value = String(band.perc.length);
        const seatFields = document.getElementById('bandSeatFields');
        if (seatFields) {
          seatFields.innerHTML = '<span>Chairs:</span>' + band.rows.map((row, i) =>
            `<label class="band-seat-count" title="Chairs on arc ${i + 1}${i === 0 ? ' (front)' : ''}">${i + 1}<input type="number" class="subheader-select band-seat-input" min="1" max="${BAND.maxSeats}" value="${row.length}" onchange="app.setBandRowSeats(${i}, this.value)"></label>`
          ).join('');
        }
        if (!this.bandPaint) this.bandPaint = { on: false, inst: 'flute' };
        const paintSel = document.getElementById('bandPaintInst');
        if (paintSel) {
          if (!paintSel.options.length) this.fillInstrumentOptions(paintSel, '✕ No instrument (clear)', this.bandPaint.inst);
          paintSel.value = this.bandPaint.inst;
        }
        const paintBtn = document.getElementById('bandPaintBtn');
        if (paintBtn) {
          paintBtn.classList.toggle('btn-primary', this.bandPaint.on);
          paintBtn.classList.toggle('btn-secondary', !this.bandPaint.on);
          paintBtn.textContent = this.bandPaint.on ? '🖌 Painting… (Done)' : '🖌 Paint chairs';
        }
      }

      getEditableBand() {
        const currentClass = this.getCurrentClass();
        return currentClass && currentClass.layout === 'band' && currentClass.band ? currentClass.band : null;
      }

      // Removes up to `count` chairs from the right end of a list, open chairs first
      trimBandChairs(list, count) {
        for (let n = 0; n < count && list.length; n++) {
          let idx = -1;
          for (let i = list.length - 1; i >= 0; i--) {
            if (!list[i].student) {
              idx = i;
              break;
            }
          }
          list.splice(idx > -1 ? idx : list.length - 1, 1);
        }
      }

      setBandRowCount(value) {
        const band = this.getEditableBand();
        if (!band) return;
        const n = Math.max(1, Math.min(BAND.maxRows, parseInt(value, 10) || 1));
        while (band.rows.length < n) {
          const last = band.rows[band.rows.length - 1];
          const count = Math.min(BAND.maxSeats, (last ? last.length : 6) + 4);
          band.rows.push(Array.from({ length: count }, () => this.makeBandChair()));
        }
        // Students on a removed arc go to To Be Placed
        if (band.rows.length > n) band.rows.length = n;
        this.saveData();
        this.render();
      }

      setBandRowSeats(rowIdx, value) {
        const band = this.getEditableBand();
        if (!band || !band.rows[rowIdx]) return;
        const row = band.rows[rowIdx];
        const n = Math.max(1, Math.min(BAND.maxSeats, parseInt(value, 10) || 1));
        // New chairs join the right end, carrying on its section
        while (row.length < n) row.push(this.makeBandChair(row.length ? row[row.length - 1].inst : ''));
        if (row.length > n) this.trimBandChairs(row, row.length - n);
        this.saveData();
        this.render();
      }

      setBandPercCount(value) {
        const band = this.getEditableBand();
        if (!band) return;
        const n = Math.max(0, Math.min(BAND.maxPerc, parseInt(value, 10) || 0));
        while (band.perc.length < n) {
          const used = new Set(band.perc.map(ch => ch.inst));
          band.perc.push(this.makeBandChair(BAND.percDefaults.find(id => !used.has(id)) || 'percussion'));
        }
        if (band.perc.length > n) this.trimBandChairs(band.perc, band.perc.length - n);
        this.saveData();
        this.render();
      }

      setBandPaintInstrument(id) {
        if (!this.bandPaint) this.bandPaint = { on: false, inst: 'flute' };
        this.bandPaint.inst = BAND_INSTRUMENTS[id] ? id : '';
        if (!this.bandPaint.on) this.toggleBandPaint();
        else this.render();
      }

      toggleBandPaint() {
        if (!this.bandPaint) this.bandPaint = { on: false, inst: 'flute' };
        this.bandPaint.on = !this.bandPaint.on;
        this.closeBandChairEditor();
        this.render();
      }

      // Paint mode: press on a chair (and drag across more) to give them the paint instrument
      paintBandChair(chairId) {
        const band = this.getEditableBand();
        const chair = band ? this.findBandChairById(band, chairId) : null;
        if (!chair || !this.bandPaint) return;
        const inst = this.bandPaint.inst;
        if (chair.inst === inst) return;
        chair.inst = inst;
        this.bandPaintDirty = true;
        this.renderChart(this.getCurrentClass());
      }

      endBandPaint() {
        if (!this.bandPaintDown) return;
        this.bandPaintDown = false;
        if (this.bandPaintDirty) {
          this.bandPaintDirty = false;
          this.saveData();
          this.render();
        }
      }

      // --- One chair's editor: its instrument, who sits in it, and adding or removing chairs ---

      openBandChairEditor(chairId) {
        const currentClass = this.getCurrentClass();
        const band = this.getEditableBand();
        const chair = band ? this.findBandChairById(band, chairId) : null;
        if (!chair) return;
        const where = this.locateBandChair(band, chairId);
        this.bandEditorChairId = chairId;

        let box = document.getElementById('bandChairEditor');
        if (!box) {
          box = document.createElement('div');
          box.id = 'bandChairEditor';
          box.className = 'band-chair-editor';
          document.body.appendChild(box);
        }
        const inst = BAND_INSTRUMENTS[chair.inst];
        const place = where.row === 'perc' ? 'Percussion line' : `Arc ${where.row + 1}${where.row === 0 ? ' (front)' : ''}`;
        box.innerHTML = `
          <div class="band-editor-head">
            <span class="band-editor-swatch" style="background:${inst ? inst.color : 'transparent'}"></span>
            <b>Chair ${where.index + 1}</b><span class="band-editor-where">${place}</span>
            <button type="button" class="band-editor-close" title="Close">&times;</button>
          </div>
          <label class="band-editor-field">Instrument<select class="subheader-select" data-field="inst"></select></label>
          <label class="band-editor-field">Student<select class="subheader-select" data-field="student"></select></label>
          <div class="band-editor-actions">
            <button type="button" class="btn btn-outline btn-small" data-act="left">+ Chair left</button>
            <button type="button" class="btn btn-outline btn-small" data-act="right">+ Chair right</button>
            <button type="button" class="btn btn-red btn-small" data-act="remove">Remove chair</button>
          </div>`;

        const instSel = box.querySelector('[data-field="inst"]');
        this.fillInstrumentOptions(instSel, '— No instrument —', chair.inst);
        instSel.onchange = () => {
          chair.inst = BAND_INSTRUMENTS[instSel.value] ? instSel.value : '';
          this.saveData();
          this.render();
          this.openBandChairEditor(chairId);
        };

        const studentSel = box.querySelector('[data-field="student"]');
        const nameOf = s => this.getStudentProfile(currentClass, s).rosterName || s;
        const opt = (value, text) => `<option value="${this.escapeHtml(value)}">${this.escapeHtml(text)}</option>`;
        const unplaced = (currentClass.unplacedStudents || []).filter(s => s !== chair.student);
        const seated = this.getBandChairs(band).filter(ch => ch.student && ch !== chair)
          .map(ch => ({ s: ch.student, abbr: BAND_INSTRUMENTS[ch.inst] ? BAND_INSTRUMENTS[ch.inst].abbr : 'no instrument' }))
          .sort((a, b) => nameOf(a.s).localeCompare(nameOf(b.s)));
        studentSel.innerHTML = opt('', '— Open chair —')
          + (chair.student ? opt(chair.student, nameOf(chair.student)) : '')
          + (unplaced.length ? `<optgroup label="To Be Placed">${unplaced.map(s => opt(s, nameOf(s))).join('')}</optgroup>` : '')
          + (seated.length ? `<optgroup label="Seated elsewhere (they swap chairs)">${seated.map(x => opt(x.s, `${nameOf(x.s)} (${x.abbr})`)).join('')}</optgroup>` : '');
        studentSel.value = chair.student;
        studentSel.onchange = () => {
          const name = studentSel.value;
          if (!name) chair.student = '';
          else this.placeInBand(band, name, chair, 'swap');
          this.saveData();
          this.render();
          this.openBandChairEditor(chairId);
        };

        box.querySelector('.band-editor-close').onclick = () => this.closeBandChairEditor();
        box.querySelectorAll('[data-act]').forEach(btn => {
          const act = btn.dataset.act;
          if (act === 'remove' && where.row !== 'perc' && where.list.length <= 1) btn.disabled = true;
          if (act !== 'remove' && where.list.length >= (where.row === 'perc' ? BAND.maxPerc : BAND.maxSeats)) btn.disabled = true;
          btn.onclick = () => {
            const pos = this.locateBandChair(band, chairId);
            if (!pos) return;
            if (act === 'remove') {
              pos.list.splice(pos.index, 1);
              this.closeBandChairEditor();
            } else {
              pos.list.splice(act === 'left' ? pos.index : pos.index + 1, 0, this.makeBandChair(chair.inst));
            }
            this.saveData();
            this.render();
            if (act !== 'remove') this.openBandChairEditor(chairId);
          };
        });

        // Beside the chair, kept on screen
        box.style.display = 'block';
        const anchor = document.querySelector(`[data-chair="${chairId}"]`);
        const r = anchor ? anchor.getBoundingClientRect() : { left: window.innerWidth / 2, right: window.innerWidth / 2, top: 120, bottom: 120 };
        const bw = box.offsetWidth;
        const bh = box.offsetHeight;
        let left = r.right + 12;
        if (left + bw > window.innerWidth - 8) left = r.left - bw - 12;
        left = Math.max(8, Math.min(left, window.innerWidth - bw - 8));
        const top = Math.max(8, Math.min(r.top - 10, window.innerHeight - bh - 8));
        box.style.left = `${left}px`;
        box.style.top = `${top}px`;
        document.querySelectorAll('.band-chair-selected').forEach(el => el.classList.remove('band-chair-selected'));
        if (anchor) anchor.classList.add('band-chair-selected');
      }

      closeBandChairEditor() {
        this.bandEditorChairId = null;
        const box = document.getElementById('bandChairEditor');
        if (box) box.style.display = 'none';
        document.querySelectorAll('.band-chair-selected').forEach(el => el.classList.remove('band-chair-selected'));
      }

      // A-Z / Z-A arranging keeps everyone in their section: each section's players are sorted
      // over that section's filled chairs (chairs without an instrument count as one group)
      arrangeBandByName(band, mode) {
        const groups = {};
        band.rows.forEach((row, r) => {
          (r % 2 ? [...row].reverse() : row).forEach(ch => {
            if (!groups[ch.inst]) groups[ch.inst] = [];
            groups[ch.inst].push(ch);
          });
        });
        band.perc.forEach(ch => {
          if (!groups[ch.inst]) groups[ch.inst] = [];
          groups[ch.inst].push(ch);
        });
        Object.values(groups).forEach(chairs => {
          const filled = chairs.filter(ch => ch.student);
          const names = this.sortStudentsByName(filled.map(ch => ch.student), mode);
          filled.forEach((ch, i) => { ch.student = names[i]; });
        });
      }

      // The chart's width in its own (zoomed) px: the classroom area's width, capped like .chart-container
      getChartContentWidth() {
        const viewport = document.querySelector('#seatingAppBody .viewport');
        if (!viewport) return 1000;
        const vs = getComputedStyle(viewport);
        const inner = viewport.clientWidth - parseFloat(vs.paddingLeft) - parseFloat(vs.paddingRight);
        const zoom = (this.chartZoom || 80) / 80;
        return Math.min(this.isFullScreen ? Infinity : 1000, inner / zoom);
      }

      // The size of a seat card for the class: .seat (with initials) or .seat.no-faces
      getSeatCardSize(currentClass) {
        const showFaces = currentClass ? (currentClass.showFaces !== false && currentClass.showInitials !== false) : true;
        return showFaces ? { w: 110, h: 75 } : { w: 85, h: 52 };
      }

      // Round or square table; kept with the table's size in containerSizes (an extra field older copies ignore)
      setTableShape(sizeKey, shape) {
        const currentClass = this.getCurrentClass();
        if (!currentClass || !sizeKey) return;
        if (!currentClass.containerSizes) currentClass.containerSizes = {};
        const saved = currentClass.containerSizes[sizeKey] || {};
        currentClass.containerSizes[sizeKey] = { ...saved, shape };
        this.saveData();
        this.render();
      }

      // Where the cards go around a table in a box of W x H (outer px), with cards scaled by s. Each
      // card sits half on the table: the table's edge runs through the middle of the cards.
      // Seats are listed clockwise from the top left, the order of the group's names.
      // Returns null when they don't fit.
      planTableSeats(n, shape, W, H, card, s) {
        const iw = W - 2 * TABLE.border;
        const ih = H - 2 * TABLE.border;
        const sw = card.w * s;
        const sh = card.h * s;
        const g = TABLE.gap * s;
        const pad = TABLE.pad;
        const seats = [];

        if (shape === 'round') {
          // The table's edge is the path of the card centres
          const a = iw / 2 - pad - sw / 2;
          const b = ih / 2 - pad - sh / 2;
          if (2 * a - sw < TABLE.freeW || 2 * b - sh < TABLE.freeH) return null;
          const cx = iw / 2;
          const cy = ih / 2;
          const steps = 720;
          const path = [];
          let length = 0;
          for (let i = 0; i <= steps; i++) {
            const t = -Math.PI / 2 + (i / steps) * Math.PI * 2;
            let nx = Math.cos(t) / a;
            let ny = Math.sin(t) / b;
            const nl = Math.hypot(nx, ny) || 1;
            nx /= nl;
            ny /= nl;
            const pt = { x: cx + a * Math.cos(t), y: cy + b * Math.sin(t), nx, ny };
            if (path.length) length += Math.hypot(pt.x - path[path.length - 1].x, pt.y - path[path.length - 1].y);
            pt.len = length;
            path.push(pt);
          }
          let j = 0;
          for (let i = 0; i < n; i++) {
            const target = (i / n) * length;
            while (j < path.length - 1 && path[j + 1].len < target) j++;
            const pt = path[j];
            const side = Math.abs(pt.ny) >= Math.SQRT1_2 ? (pt.ny < 0 ? 'top' : 'bottom') : (pt.nx > 0 ? 'right' : 'left');
            seats.push({ x: pt.x - sw / 2, y: pt.y - sh / 2, side });
          }
          // No two cards touch (across the table either), and the tent card in the middle stays clear
          for (let i = 0; i < n; i++) {
            const p1 = seats[i];
            for (let k = i + 1; k < n; k++) {
              const p2 = seats[k];
              if (Math.abs(p1.x - p2.x) < sw + g / 2 && Math.abs(p1.y - p2.y) < sh + g / 2) return null;
            }
            if (Math.abs(p1.x + sw / 2 - cx) < (sw + TABLE.freeW) / 2 && Math.abs(p1.y + sh / 2 - cy) < (sh + TABLE.freeH) / 2) return null;
          }
          return { table: { x: cx - a, y: cy - b, w: a * 2, h: b * 2 }, seats, s };
        }

        // A long table: names along the top and bottom edges (hanging a little past the corners at most),
        // and down the two ends when the table is tall enough or needs them
        const ty = pad + sh / 2;
        const th = ih - 2 * ty;
        if (th - sh < TABLE.freeH) return null;
        const band = th - sh - 2 * g;            // room down each end, between the top and bottom rows
        const capEnd = band >= sh ? Math.floor((band + g) / (sh + g)) : 0;
        const fits = (span) => Math.max(0, Math.floor((span + g) / (sw + g)));
        const capFull = fits(iw - 2 * pad);
        const twEnds = iw - 2 * pad - sw;        // the table when cards sit half on each end
        const capOver = twEnds - sw >= TABLE.freeW ? fits(Math.min(iw - 2 * pad, twEnds + 0.6 * sw)) : 0;
        let e = 0;
        if (n >= 4 && capOver > 0) {
          const eNeeded = Math.max(0, Math.ceil((n - 2 * capOver) / 2));
          if (eNeeded <= capEnd) {
            const ePref = Math.max(1, Math.round(n * band / (2 * (twEnds + band))));
            e = Math.max(eNeeded, Math.min(ePref, Math.floor((n - 2) / 2), capEnd));
          }
        }
        const rest = n - 2 * e;
        const top = Math.ceil(rest / 2);
        const bottom = rest - top;
        if (top > (e > 0 ? capOver : capFull)) return null;
        const tx = e > 0 ? pad + sw / 2 : pad;
        const tw = iw - 2 * tx;
        if (tw - (e > 0 ? sw : 0) < TABLE.freeW) return null;

        // Cards share out the table's length, or a little past its corners when they need to
        const along = (k) => {
          const span = Math.min(iw - 2 * pad, Math.max(tw, k * (sw + g)));
          const x0 = (iw - span) / 2;
          return Array.from({ length: k }, (_, i) => x0 + (i + 0.5) * span / k - sw / 2);
        };
        const bandTop = ty + sh / 2 + g;
        const down = (k) => Array.from({ length: k }, (_, i) => bandTop + (i + 0.5) * band / k - sh / 2);

        along(top).forEach(x => seats.push({ x, y: ty - sh / 2, side: 'top' }));
        down(e).forEach(y => seats.push({ x: tx + tw - sw / 2, y, side: 'right' }));
        along(bottom).reverse().forEach(x => seats.push({ x, y: ty + th - sh / 2, side: 'bottom' }));
        down(e).reverse().forEach(y => seats.push({ x: tx - sw / 2, y, side: 'left' }));
        return { table: { x: tx, y: ty, w: tw, h: th }, seats, s };
      }

      // Fits n cards around a table in a box of W x H: full-size cards if they fit, smaller cards
      // (down to TABLE.minScale) if the box is smaller than they need, and a bigger box after that.
      fitTableGroup(n, shape, W, H, card) {
        W = Math.max(W, 2 * TABLE.pad + 2 * TABLE.border + card.w * TABLE.minScale + TABLE.freeW);
        H = Math.max(H, 2 * TABLE.pad + 2 * TABLE.border + card.h * TABLE.minScale + TABLE.freeH);
        const tryAt = (w, h, s) => this.planTableSeats(n, shape, w, h, card, s);
        let plan = tryAt(W, H, 1);
        if (plan) return { W, H, plan };
        if (tryAt(W, H, TABLE.minScale)) {
          let lo = TABLE.minScale;
          let hi = 1;
          for (let i = 0; i < 14; i++) {
            const mid = (lo + hi) / 2;
            if (tryAt(W, H, mid)) lo = mid; else hi = mid;
          }
          return { W, H, plan: tryAt(W, H, lo) };
        }
        const stepW = (card.w + TABLE.gap) * TABLE.minScale / 2;
        const stepH = (card.h + TABLE.gap) * TABLE.minScale / 2;
        for (let i = 0; i < 400; i++) {
          if (shape === 'round' || W / H < 1.6) W += stepW;
          if (shape === 'round' || W / H >= 1.6 || i % 2) H += stepH;
          plan = tryAt(W, H, TABLE.minScale);
          if (plan) return { W, H, plan };
        }
        return { W, H, plan: { table: { x: 0, y: 0, w: W, h: H }, seats: [], s: 1 } };
      }

      // A good size for a table with no saved size: roughly square, and within its share of the row
      // when full-size (or slightly smaller) cards allow it, else up to the whole row
      defaultTableSize(n, shape, card, share, rowWidth) {
        if (n === 0) return { W: TABLE.emptyW, H: 170 };
        const pad = TABLE.pad;
        const g = TABLE.gap;
        const b = TABLE.border;
        const sizeAt = (s, maxW) => {
          const sw = card.w * s;
          const sh = card.h * s;
          const gg = g * s;
          if (shape === 'round') {
            let W = 2 * (pad + b) + 2 * sw + TABLE.freeW;
            let H = 2 * (pad + b) + 2 * sh + TABLE.freeH;
            for (let i = 0; i < 300 && !this.planTableSeats(n, shape, W, H, card, s); i++) {
              W += 18 * s;
              H += 12 * s;
            }
            return W <= maxW ? { W: Math.ceil(W), H: Math.ceil(H) } : null;
          }
          let best = null;
          for (let e = 0; e <= Math.max(0, Math.floor((n - 2) / 2)); e++) {
            const k = Math.max(1, Math.ceil((n - 2 * e) / 2));
            const row = k * (sw + gg);
            const tw = e ? Math.max(TABLE.freeW + sw, row) : Math.max(TABLE.freeW, row);
            const th = e ? Math.max(sh + TABLE.freeH, e * (sh + gg) - gg + sh + 2 * gg) : sh + TABLE.freeH;
            const W = Math.ceil(2 * (pad + b) + (e ? sw : 0) + tw);
            const H = Math.ceil(2 * (pad + b) + sh + th);
            if (W <= maxW && this.planTableSeats(n, shape, W, H, card, s)) {
              const score = Math.max(W, H * 1.25);
              if (!best || score < best.score) best = { W, H, score };
            }
          }
          return best;
        };
        for (const s of [1, 0.92, 0.85, 0.78, 0.7]) {
          const fit = sizeAt(s, share);
          if (fit) return fit;
        }
        return sizeAt(1, Math.max(share, rowWidth)) || sizeAt(1, Infinity) || { W: share, H: 260 };
      }

      // Puts the table, its tent card and the seats where fitTableGroup placed them
      applyTableLayout(box, table, badge, seats, fit) {
        const { W, H, plan } = fit;
        box.style.width = `${Math.round(W)}px`;
        box.style.height = `${Math.round(H)}px`;
        const t = plan.table;
        table.style.left = `${t.x}px`;
        table.style.top = `${t.y}px`;
        table.style.width = `${t.w}px`;
        table.style.height = `${t.h}px`;
        badge.style.left = `${t.x + t.w / 2}px`;
        badge.style.top = `${t.y + t.h / 2}px`;
        seats.forEach((seatEl, i) => {
          const spot = plan.seats[i];
          if (!spot) return;
          seatEl.style.position = 'absolute';
          seatEl.style.left = `${spot.x}px`;
          seatEl.style.top = `${spot.y}px`;
          seatEl.style.margin = '0';
          seatEl.style.transformOrigin = '0 0';
          seatEl.style.scale = plan.s < 0.999 ? plan.s.toFixed(3) : '';
          seatEl.dataset.side = spot.side;
        });
      }

      getStudentProfile(currentClass, studentName) {
        if (!currentClass) return this.parseStudentName(studentName);
        if (!currentClass.studentProfiles) currentClass.studentProfiles = {};
        
        if (currentClass.studentProfiles[studentName]) {
          const prof = currentClass.studentProfiles[studentName];
          if (prof.lastName && prof.lastName.includes('(')) {
            const parsed = this.parseStudentName(prof.rosterName || studentName);
            prof.firstName = parsed.firstName;
            prof.lastName = parsed.lastName;
            prof.rosterName = parsed.rosterName;
          }
          if (!prof.rosterName) {
            if (prof.lastName && prof.lastName.trim()) {
              prof.rosterName = `${prof.firstName || studentName} ${prof.lastName.trim()}`.trim();
            } else {
              prof.rosterName = prof.firstName || studentName;
            }
          } else if (prof.lastName && prof.lastName.trim() && !prof.rosterName.toLowerCase().includes(prof.lastName.trim().toLowerCase())) {
            prof.rosterName = `${prof.rosterName} ${prof.lastName.trim()}`.trim();
          }
          return prof;
        }

        const parsed = this.parseStudentName(studentName);
        const profile = {
          firstName: parsed.firstName,
          lastName: parsed.lastName,
          rosterName: parsed.rosterName
        };
        currentClass.studentProfiles[studentName] = profile;
        return profile;
      }

      getStudentInitials(profile) {
        if (!profile) return '?';
        const cleanFirst = (profile.firstName || '').replace(/[()]/g, '').trim();
        const cleanLast = (profile.lastName || '').replace(/[()]/g, '').trim();
        const fInit = cleanFirst ? cleanFirst[0].toUpperCase() : '';
        const lInit = cleanLast ? cleanLast[0].toUpperCase() : '';
        return (fInit + lInit) || '?';
      }

      openNameCardModal(studentName) {
        if (!this.isEditMode) return;
        this.editingStudentKey = studentName;
        const currentClass = this.getCurrentClass();
        const profile = this.getStudentProfile(currentClass, studentName);

        document.getElementById('nameCardFirstName').value = profile.firstName || '';
        document.getElementById('nameCardLastName').value = profile.lastName || '';

        this.updateNameCardPreview();
        document.getElementById('nameCardModal').classList.add('active');
      }

      updateNameCardPreview() {
        const fn = document.getElementById('nameCardFirstName').value || '';
        const ln = document.getElementById('nameCardLastName').value || '';
        const initials = this.getStudentInitials({ firstName: fn, lastName: ln });
        const avatarEl = document.getElementById('nameCardAvatar');
        if (avatarEl) avatarEl.textContent = initials;
      }

      saveNameCardProfile() {
        const currentClass = this.getCurrentClass();
        if (!currentClass || !this.editingStudentKey) return;

        const fnInput = document.getElementById('nameCardFirstName');
        const lnInput = document.getElementById('nameCardLastName');

        const newFirstName = fnInput.value ? fnInput.value.trim() : '';
        const newLastName = lnInput.value ? lnInput.value.trim() : '';

        if (!newFirstName) {
          alert('Please enter a first name.');
          return;
        }

        if (!currentClass.studentProfiles) currentClass.studentProfiles = {};

        const oldKey = this.editingStudentKey;
        const oldProfile = currentClass.studentProfiles[oldKey] || {};
        const oldFirstName = oldProfile.firstName || this.parseStudentName(oldKey).firstName;
        const oldLastName = oldProfile.lastName || '';
        let rosterName = oldProfile.rosterName || oldKey;
        const isFirstNameChanged = (newFirstName !== oldFirstName);

        if (isFirstNameChanged && oldFirstName && rosterName.includes(oldFirstName)) {
          rosterName = rosterName.replace(oldFirstName, newFirstName);
        }
        if (newLastName !== oldLastName) {
          if (oldLastName && rosterName.includes(oldLastName)) {
            rosterName = rosterName.replace(oldLastName, newLastName).trim();
          } else if (newLastName && !rosterName.toLowerCase().includes(newLastName.toLowerCase())) {
            rosterName = `${rosterName} ${newLastName}`.trim();
          }
        }

        currentClass.studentProfiles[oldKey] = {
          firstName: newFirstName,
          lastName: newLastName,
          rosterName: rosterName
        };

        if (isFirstNameChanged && oldKey === oldFirstName) {
          delete currentClass.studentProfiles[oldKey];
          currentClass.studentProfiles[newFirstName] = {
            firstName: newFirstName,
            lastName: newLastName,
            rosterName: newFirstName
          };

          if (Array.isArray(currentClass.classList)) {
            currentClass.classList = currentClass.classList.map(n => n === oldKey ? newFirstName : n);
          }
          this.renameStudentSeating(currentClass, oldKey, newFirstName);
        }

        this.saveData();
        this.render();
        this.closeModal('nameCardModal');
      }

      createSeatElement(name, groupIndex) {
        const safeName = (name === null || name === undefined) ? '' : String(name);
        const currentClass = this.getCurrentClass();
        const isGarden = Boolean(currentClass && currentClass.layout === 'garden');
        const showFaces = isGarden ? false : (currentClass ? (currentClass.showFaces !== false && currentClass.showInitials !== false) : true);
        const showFirstName = currentClass ? (currentClass.showFirstName !== false) : true;
        const showLastName = currentClass ? (currentClass.showLastName === true) : false;
        const isAbsent = this.isStudentAbsent(currentClass, safeName);
        let isAttAbsent = isAbsent;
        if (this.isAttendanceSessionActive && safeName) {
          const liveStatus = this.activeAttendanceStatuses[safeName];
          if (liveStatus === 'absent') isAttAbsent = true;
          else if (liveStatus === 'present') isAttAbsent = false;
        }

        const isCardAbsent = this.isAttendanceSessionActive ? isAttAbsent : isAbsent;

        const profile = this.getStudentProfile(currentClass, safeName);
        const firstName = profile.firstName || safeName;
        const lastName = profile.lastName || '';
        const initials = this.getStudentInitials(profile);

        const seat = document.createElement('div');
        seat.className = 'seat' + (isGarden ? ' seat-garden' : (showFaces ? '' : ' no-faces')) + (isCardAbsent ? ' seat-absent' : '') + (this.isGradeScoringActive ? ' seat-grading' : '');
        seat.dataset.student = safeName;
        // Each student keeps the same crayon colour for their card's stripe and initials sticker
        seat.style.setProperty('--seat-color', SEAT_COLORS[this.nameHash(safeName) % SEAT_COLORS.length]);
        seat.draggable = this.isEditMode;
        if (this.isAttendanceSessionActive || !this.isGradeScoringActive) {
          seat.style.cursor = 'pointer';
        }

        const nameSpans = [];
        if (showFirstName && firstName) {
          nameSpans.push(`<span class="student-first-name">${this.escapeHtml(firstName)}</span>`);
        }
        if (showLastName && lastName) {
          nameSpans.push(`<span class="student-last-name">${this.escapeHtml(lastName)}</span>`);
        }

        // In the Garden the name tag shrinks its text to fit long names (see .seat-garden .student-name);
        // on a card the name is written as big as the card has room for
        const shownName = [showFirstName && firstName, showLastName && lastName].filter(Boolean).join(' ');
        let nameStyle = '';
        if (isGarden) {
          nameStyle = ` style="--name-len: ${Math.max(4, shownName.length)}"`;
        } else if (shownName) {
          const fit = this.fitSeatNameSize(shownName, showFaces);
          nameStyle = ` style="font-size: ${fit.size}px;${fit.wrap ? ' white-space: normal;' : ''}"`;
        }
        const nameDisplayHTML = nameSpans.length > 0
          ? `<div class="student-name"${nameStyle}>${isGarden ? nameSpans.join(' ') : `<span class="student-name-text">${nameSpans.join(' ')}</span>`}</div>`
          : '';

        let plantHTML = '';
        if (isGarden && safeName) {
          const { sessions, stage, starts } = this.getGardenGrowth(currentClass, safeName);
          const plant = this.getGardenKind(currentClass, safeName, starts[starts.length - 1]) || GARDEN_PLANTS[0];
          plantHTML = `<img class="garden-plant" src="${this.getGardenImage(plant, stage)}" data-plant="${plant}" alt="" draggable="false">`;
          if (this.canReplantGarden(stage, isCardAbsent)) seat.classList.add('garden-ripe');
          seat.title = stage === GARDEN_STAGES
            ? 'Full bloom. Click the flower to replant it.'
            : sessions === 0
              ? 'New pot: it starts growing at the next class'
              : `Stage ${stage} of ${GARDEN_STAGES} (${sessions} ${sessions === 1 ? 'class' : 'classes'} in a row)`;
        }

        seat.innerHTML = `
          <button class="remove-btn" onclick="event.stopPropagation(); app.removeStudent('${this.escapeQuotes(safeName)}')" title="Remove">&times;</button>
          ${showFaces ? `<div class="avatar">${initials}</div>` : ''}
          ${plantHTML}
          ${nameDisplayHTML}
        `;

        const plantImg = seat.querySelector('.garden-plant');
        if (plantImg) {
          plantImg.onclick = (e) => {
            if (!seat.classList.contains('garden-ripe')) return;
            e.stopPropagation();
            this.openGardenReplant(safeName);
          };
        }

        if (this.isAttendanceSessionActive && safeName) {
          const attBtn = document.createElement('button');
          attBtn.type = 'button';
          attBtn.className = `attendance-live-check-btn ${isAttAbsent ? 'is-absent' : 'is-present'}`;
          attBtn.style.cssText = `position: absolute; top: 4px; right: 4px; z-index: 6; width: 24px; height: 24px; border-radius: 50%; border: 2px solid ${isAttAbsent ? 'var(--ink-faint)' : 'var(--green)'}; background: ${isAttAbsent ? 'var(--paper-3)' : 'var(--green-soft)'}; color: ${isAttAbsent ? 'var(--ink-faint)' : 'var(--green-dark)'}; font-size: 0.85rem; font-weight: 900; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.15s ease;`;
          attBtn.innerHTML = isAttAbsent ? '&minus;' : '✓';
          attBtn.title = isAttAbsent ? 'Marked Absent (Click to mark Present)' : 'Marked Present (Click to mark Absent)';
          attBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleLiveAttendanceStudent(safeName);
          };
          seat.appendChild(attBtn);
        }

        if (this.isGradeScoringActive && safeName) {
          const style = (this.activeGradeSession && this.activeGradeSession.gradingStyle) || this.getGradingStyle(currentClass);
          const score = (this.activeGradeSession && this.activeGradeSession.scores)
            ? (this.activeGradeSession.scores[safeName] !== undefined ? this.activeGradeSession.scores[safeName] : '')
            : '';

          const scoreControls = document.createElement('div');
          if (style === 'standards') {
            scoreControls.className = 'standards-score-controls';
            const is4 = (String(score) === '4');
            const is3 = (String(score) === '3');
            const is2 = (String(score) === '2');
            const is1 = (String(score) === '1');
            scoreControls.innerHTML = `
              <button type="button" class="standards-btn standards-btn-4 ${is4 ? 'active-4' : ''}" onclick="event.stopPropagation(); app.recordLiveGradeScore('${this.escapeQuotes(safeName)}', '4')" title="4 - Advanced (Yellow)">4</button>
              <button type="button" class="standards-btn standards-btn-3 ${is3 ? 'active-3' : ''}" onclick="event.stopPropagation(); app.recordLiveGradeScore('${this.escapeQuotes(safeName)}', '3')" title="3 - Proficient (Green)">3</button>
              <button type="button" class="standards-btn standards-btn-2 ${is2 ? 'active-2' : ''}" onclick="event.stopPropagation(); app.recordLiveGradeScore('${this.escapeQuotes(safeName)}', '2')" title="2 - Approaching (Orange)">2</button>
              <button type="button" class="standards-btn standards-btn-1 ${is1 ? 'active-1' : ''}" onclick="event.stopPropagation(); app.recordLiveGradeScore('${this.escapeQuotes(safeName)}', '1')" title="1 - Beginning (Red)">1</button>
            `;
          } else if (style === 'points') {
            const maxPts = (this.activeGradeSession && this.activeGradeSession.maxPoints) || 10;
            if (score !== '' && score !== null && score !== undefined && !isNaN(Number(score))) {
              const earned = Number(score);
              const pct = Math.round((earned / maxPts) * 100);
              scoreControls.innerHTML = `<button type="button" class="points-badge-btn points-badge-scored" onclick="event.stopPropagation(); app.openPointsEntryModal('${this.escapeQuotes(safeName)}', 'live')">${earned}/${maxPts} <span class="points-badge-pct">(${pct}%)</span></button>`;
            } else {
              scoreControls.innerHTML = `<button type="button" class="points-badge-btn points-badge-unscored" onclick="event.stopPropagation(); app.openPointsEntryModal('${this.escapeQuotes(safeName)}', 'live')">? / ${maxPts}</button>`;
            }
          } else {
            scoreControls.className = 'grade-score-controls';
            const isCheck = (score === 'check' || score === 'plus');
            const isStar = (score === 'star');
            const isMinus = (score === 'minus');
            const isX = (score === 'x');
            scoreControls.innerHTML = `
              <button class="grade-score-btn grade-btn-plus ${isCheck ? 'active-check' : (isStar ? 'active-star' : '')}" onclick="event.stopPropagation(); app.recordLiveGradeScore('${this.escapeQuotes(safeName)}', 'plus')" title="Click for Pass (✓), click again for Gold Star (★)">${isStar ? '★' : (isCheck ? '✓' : '+')}</button>
              <button class="grade-score-btn grade-btn-minus ${isMinus ? 'active-minus' : (isX ? 'active-x' : '')}" onclick="event.stopPropagation(); app.recordLiveGradeScore('${this.escapeQuotes(safeName)}', 'minus')" title="Click for Minus (−), double-click for X (✕)">${isX ? '✕' : '−'}</button>
            `;
          }
          seat.appendChild(scoreControls);
        }

        let clickTimer = null;
        seat.onclick = (e) => {
          if (isGarden && safeName && this.isGardenEditing()) {
            e.stopPropagation();
            this.advanceGardenPlant(safeName);
            return;
          }
          if (this.isAttendanceSessionActive && safeName) {
            e.stopPropagation();
            this.toggleLiveAttendanceStudent(safeName);
            return;
          }
          if (this.isGradeScoringActive && safeName) {
            const liveStyle = (this.activeGradeSession && this.activeGradeSession.gradingStyle) || this.getGradingStyle(currentClass);
            if (liveStyle === 'points') {
              e.stopPropagation();
              this.openPointsEntryModal(safeName, 'live');
              return;
            }
          }
          if (this.isEditMode && safeName) {
            e.stopPropagation();
            if (clickTimer) {
              clearTimeout(clickTimer);
              clickTimer = null;
            }
            clickTimer = setTimeout(() => {
              this.toggleStudentAbsent(safeName);
              clickTimer = null;
            }, 220);
          } else if (!this.isGradeScoringActive && safeName) {
            e.stopPropagation();
            this.toggleStudentAbsent(safeName);
          }
        };

        seat.ondragstart = (e) => this.handleDragStart(e, safeName, groupIndex);
        seat.ondragover = (e) => this.handleDragOver(e);
        seat.ondragenter = (e) => this.handleDragEnterSeat(e);
        seat.ondragleave = (e) => this.handleDragLeaveSeat(e);
        seat.ondrop = (e) => this.handleDropOnSeat(e, safeName, groupIndex);
        seat.ondragend = (e) => this.handleDragEnd(e);
        seat.ondblclick = (e) => {
          if (this.isEditMode) {
            e.stopPropagation();
            if (clickTimer) {
              clearTimeout(clickTimer);
              clickTimer = null;
            }
            this.openNameCardModal(safeName);
          }
        };

        return seat;
      }

      // The font size that makes a name fill its seat card on one line (measured in the handwriting
      // font), or two lines when a long first + last name would otherwise be tiny
      fitSeatNameSize(text, showFaces) {
        const box = showFaces ? SEAT_NAME.faces : SEAT_NAME.plain;
        const max = this.isGradeScoringActive ? SEAT_NAME.grading[showFaces ? 'faces' : 'plain'] : box.max;
        if (!this.seatNameCtx) this.seatNameCtx = document.createElement('canvas').getContext('2d');
        const ctx = this.seatNameCtx;
        ctx.font = `100px ${SEAT_NAME.font}`;
        const sizeFor = (str, cap) => Math.min(cap, box.w * 100 / Math.max(1, ctx.measureText(str).width));
        const one = sizeFor(text, max);
        const words = text.trim().split(/\s+/);
        if (one < 14 && words.length > 1) {
          let two = 0;
          for (let i = 1; i < words.length; i++) {
            const lines = [words.slice(0, i).join(' '), words.slice(i).join(' ')];
            two = Math.max(two, Math.min(...lines.map(l => sizeFor(l, Math.min(max, box.two)))));
          }
          if (two > one) return { size: Math.max(SEAT_NAME.min, Math.floor(two * 10) / 10), wrap: true };
        }
        return { size: Math.max(SEAT_NAME.min, Math.floor(one * 10) / 10), wrap: false };
      }

      nameHash(str) {
        return [...String(str || '')].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
      }

      escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/&/g, "&amp;")
                          .replace(/</g, "&lt;")
                          .replace(/>/g, "&gt;")
                          .replace(/"/g, "&quot;")
                          .replace(/'/g, "&#039;");
      }

      escapeQuotes(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
      }
    }

    const app = new SeatingChartApp();
    window.app = app;