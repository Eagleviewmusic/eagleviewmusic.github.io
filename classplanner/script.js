class SeatingChartApp {
      constructor() {
        this.classes = [];
        this.currentClassId = null;
        this.isEditMode = false;
        this.isClassListEditMode = false;
        this.isAttendanceView = false;
        
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

        // Drop-between-names: show where a dragged name will land
        document.addEventListener('dragover', (e) => this.updateSeatInsertMarker(e));
        document.addEventListener('drop', () => this.hideSeatInsertMarker());
        document.addEventListener('dragend', () => this.hideSeatInsertMarker());

        window.addEventListener('keydown', (e) => {
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
              !(linesSub && linesSub.contains(e.target))
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
        this.classes.push(sampleClass);
        this.currentClassId = sampleClass.id;
        this.saveData();
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
            btn.style.cssText = 'flex: 1; font-weight: bold; padding: 6px 4px; font-size: 0.8rem; background: #4f46e5; color: white; border: 1.5px solid #4338ca; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.15); cursor: pointer;';
          } else {
            btn.style.cssText = 'flex: 1; font-weight: bold; padding: 6px 4px; font-size: 0.8rem; background: #e2e8f0; color: #475569; border: 1.5px solid #cbd5e1; border-radius: 6px; cursor: pointer;';
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
          btn.style.cssText = 'font-weight: 700; padding: 5px 9px; font-size: 0.78rem; background: #38bdf8; color: white; border: 1.5px solid #0284c7; cursor: pointer; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.15s ease;';
        } else {
          btn.style.cssText = 'font-weight: 700; padding: 5px 9px; font-size: 0.78rem; background: #e2e8f0; color: #64748b; border: 1.5px solid #cbd5e1; cursor: pointer; border-radius: 6px; box-shadow: none; transition: all 0.15s ease;';
        }
      }

      updateSettingsToggleUI(btnId, isActive) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        if (isActive) {
          btn.textContent = 'ON';
          btn.style.cssText = 'font-weight: 700; padding: 6px 16px; background: #38bdf8; color: white; border: 1.5px solid #0284c7; min-width: 70px; cursor: pointer; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);';
        } else {
          btn.textContent = 'OFF';
          btn.style.cssText = 'font-weight: 700; padding: 6px 16px; background: #e2e8f0; color: #64748b; border: 1.5px solid #cbd5e1; min-width: 70px; cursor: pointer; border-radius: 6px;';
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

          if (layout === 'circle') {
            currentClass.circle = [...sortedStudents];
          } else if (layout === 'lines') {
            const numLines = currentClass.linesCount || 4;
            currentClass.lines = this.autoBalanceGroups(allStudents, numLines, mode);
          } else if (layout === 'freeform') {
            currentClass.freeform = [...sortedStudents];
            currentClass.freeformPositions = {};
            this.initInitialFreeformPositions(currentClass);
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
          suppressRemoveStudentWarning: this.suppressRemoveStudentWarning === true,
          currentClassId: this.currentClassId || (sanitizedClasses[0] ? sanitizedClasses[0].id : null),
          subjects: this.subjects || [],
          schedules: this.schedules || [],
          currentScheduleId: this.currentScheduleId || 'sched_regular',
          calendarSync: this.isCalendarSyncEnabled === true,
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
          refreshBtn.style.color = '#15803d';
          refreshBtn.style.borderColor = '#86efac';
          refreshBtn.style.background = '#dcfce7';
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
          btn.style.background = '#f97316';
          btn.style.borderColor = '#ea580c';
          btn.style.color = '#ffffff';
        } else {
          btn.textContent = 'Attendance';
          btn.style.background = '#2563eb';
          btn.style.borderColor = '#1d4ed8';
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
            btn.style.background = '#f97316';
            btn.style.borderColor = '#ea580c';
            btn.style.color = '#ffffff';
          } else {
            btn.textContent = 'Add Grade';
            btn.style.background = '#dc2626';
            btn.style.borderColor = '#b91c1c';
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
            btn.style.background = '#f97316';
            btn.style.borderColor = '#ea580c';
            btn.style.color = '#ffffff';
          } else {
            btn.textContent = 'Add Date';
            btn.style.background = '#2563eb';
            btn.style.borderColor = '#1d4ed8';
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
            startBtn.style.background = '#dc2626';
            startBtn.style.borderColor = '#b91c1c';
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
          startBtn.style.background = '#f97316';
          startBtn.style.borderColor = '#ea580c';
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

      getAttendanceStreakLevels(currentClass) {
        return this.getAttendancePace(currentClass) === 'daily' ? [3, 9, 18] : [3, 6, 12];
      }

      // Seat glow levels: 1 = light blue, 2 = gold, 3 = diamond blue with twinkling stars
      getAttendanceStreakTier(streak, currentClass) {
        const [blue, gold, diamond] = this.getAttendanceStreakLevels(currentClass);
        if (streak >= diamond) return 3;
        if (streak >= gold) return 2;
        if (streak >= blue) return 1;
        return 0;
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

        let html = '<thead><tr><th style="min-width: 220px; text-align: left; background-color: #f1f5f9;">Student Name</th>';
        displayGradeCols.forEach((col, idx) => {
          if (col.isDraft) {
            html += `<th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; border-left: 2px dashed #94a3b8; border-right: 2px dashed #94a3b8;">
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.25; padding: 4px 2px;">
                <span style="font-weight: 800; font-size: 0.85rem; color: #475569; background: #e2e8f0; padding: 2px 8px; border-radius: 12px; border: 1px solid #cbd5e1; font-family: inherit;">${this.escapeHtml(col.title || 'Grade')}</span>
                <span style="font-weight: 700; font-size: 0.8rem; color: #64748b; margin-top: 3px;">${col.date}</span>
                <span style="font-weight: 800; font-size: 0.68rem; text-transform: uppercase; color: #f97316; margin-top: 2px; letter-spacing: 0.5px;">(Drafting)</span>
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
                <span style="font-weight: 700; font-size: 0.8rem; color: #0f172a; margin-top: 3px;">${col.date}</span>
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
            const ratioHTML = showGradesRatio ? `<span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); background: #e0e7ff; padding: 2px 6px; border-radius: 10px;">${ratioText}</span>` : '';
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
                  gradeCellsHTML += `<td style="background-color: #f8fafc; border: 1px solid #cbd5e1; text-align: center; padding: 6px 4px; border-left: 2px dashed #cbd5e1; border-right: 2px dashed #cbd5e1; position: relative; ${absentBgStyle}">
                    ${attIndicatorHTML}
                    ${cellContent}
                  </td>`;
                } else if (isStandards) {
                  const is4 = (String(gradeVal) === '4');
                  const is3 = (String(gradeVal) === '3');
                  const is2 = (String(gradeVal) === '2');
                  const is1 = (String(gradeVal) === '1');
                  gradeCellsHTML += `<td style="background-color: #f8fafc; border: 1px solid #cbd5e1; text-align: center; padding: 6px 4px; border-left: 2px dashed #cbd5e1; border-right: 2px dashed #cbd5e1; position: relative; ${absentBgStyle}">
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

                  gradeCellsHTML += `<td style="background-color: #f8fafc; border: 1px solid #cbd5e1; text-align: center; padding: 6px 4px; border-left: 2px dashed #cbd5e1; border-right: 2px dashed #cbd5e1; position: relative; ${absentBgStyle}">
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
                    symbolHTML = `<span style="font-weight: 700; font-size: 0.88rem; color: #0f172a; white-space: nowrap;">${earned}/${maxPts} <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">(${pct}%)</span></span>`;
                  } else {
                    symbolHTML = `<span style="color: #cbd5e1; font-weight: bold;">—</span>`;
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

            html += `<tr><td><div style="display: flex; align-items: center; gap: 8px;"><span style="font-weight: 600; color: #0f172a;">${this.escapeHtml(fullName)}</span>${ratioHTML}</div></td>${gradeCellsHTML}</tr>`;
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

      addClassFromModal() {
        const nameInput = document.getElementById('modalAddClassName');
        const name = nameInput.value.trim();
        if (!name) {
          alert('Please enter a class name.');
          return;
        }

        const newClass = {
          id: 'class-' + Date.now(),
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

        this.tempClasses.push(newClass);
        nameInput.value = '';
        this.renderModalClassesList();
      }

      saveEditedClasses() {
        if (this.tempClasses.length === 0) {
          alert('You must have at least one class.');
          return;
        }

        if (this.tempClasses.some(c => !c.name.trim())) {
          alert('Class names cannot be empty.');
          return;
        }

        this.classes = JSON.parse(JSON.stringify(this.tempClasses));
        if (!this.classes.some(c => c.id === this.currentClassId)) {
          this.currentClassId = this.classes[0].id;
        }

        this.saveData();
        this.renderClassDropdown();
        this.render();
        this.closeModal('editClassesModal');
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
            badge.style.background = '#2563eb';
            badge.style.color = '#ffffff';
          }
        } else {
          btn.classList.remove('active');
          if (badge) {
            badge.textContent = 'OFF';
            badge.style.background = '#e2e8f0';
            badge.style.color = '#64748b';
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
                          <span style="font-size: 0.95rem; font-weight: ${d.isToday ? '800' : '700'}; color: ${d.isToday ? '#1e40af' : '#1e293b'};">${d.label}</span>
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
                          <span style="font-size: 0.95rem; font-weight: ${d.isToday ? '800' : '700'}; color: ${d.isToday ? '#1e40af' : '#1e293b'};">${d.label}</span>
                        </div>
                        <button type="button" class="btn-schedule-week-nav" onclick="event.stopPropagation(); app.changeCalendarSyncWeek(1)" title="Next Week">›</button>
                      </div>
                    `;
                  } else {
                    headerInnerHtml = `
                      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; width: 100%;">
                        <span style="font-size: 0.8rem; font-weight: 800; padding: 1px 8px; border-radius: 10px; ${badgeStyle}">${d.dateStr}</span>
                        <span style="font-size: 0.95rem; font-weight: ${d.isToday ? '800' : '700'}; color: ${d.isToday ? '#1e40af' : '#1e293b'};">${d.label}</span>
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
              <td colspan="6" style="padding: 60px 20px; text-align: center; color: #64748b; font-size: 1rem; background: #fafafa;">
                <div style="font-size: 2.6rem; margin-bottom: 12px;">🗓️</div>
                <div style="font-weight: 800; font-size: 1.25rem; color: #1e293b; margin-bottom: 8px;">Welcome to Your Weekly Schedule</div>
                <div style="font-size: 0.95rem; color: #64748b; margin-bottom: 22px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.5;">
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
                <td class="schedule-time-cell" style="padding: 10px 14px; text-align: center; background: #ffffff;">
                  <span style="font-weight: 700; font-size: 0.95rem; color: #1e293b;">${this.escapeHtml(timeSlot)}</span>
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
                html += `<td class="${cellHighlightClass}" style="text-align: center; vertical-align: middle; padding: 8px; ${todayCellStyle}"><span style="color: #cbd5e1; font-size: 0.9rem; user-select: none;">—</span></td>`;
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
                <td style="padding: 8px 12px; text-align: center; background: #f8fafc; border-top: 1.5px solid #cbd5e1;">
                  <button type="button" class="btn btn-outline" style="font-size: 0.8rem; font-weight: 700; padding: 4px 10px;" onclick="app.addTimeBlockAtEnd()" title="Add another 30-min time block">+ Add Block</button>
                </td>
                <td colspan="5" style="padding: 8px 12px; text-align: right; background: #f8fafc; border-top: 1.5px solid #cbd5e1;">
                  <button type="button" style="background: none; border: none; color: #94a3b8; font-size: 0.78rem; font-weight: 600; cursor: pointer; text-decoration: underline;" onclick="app.clearAllScheduleTimeBlocks()">Reset Time Blocks</button>
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
          const paceToggleHtml = isText ? '' : `<div class="pace-toggle" title="Perfect-attendance glow — Weekly: 3 / 6 / 12 classes in a row · Daily: 3 / 9 / 18">
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
                <button type="button" class="schedule-color-circle-btn" style="background-color: ${c.color || '#059669'};" onclick="app.openScheduleColorPicker(${idx})" title="Change Color"></button>
                ${isText ? `<span style="font-size: 0.72rem; font-weight: 800; background: #e2e8f0; color: #475569; padding: 3px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.3px; flex-shrink: 0;">Text</span>` : ''}
                <input type="text" value="${this.escapeHtml(c.name || '')}" placeholder="Name..." style="flex: 1; font-weight: 700; font-size: 0.95rem; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" oninput="app.tempScheduleClasses[${idx}].name = this.value">
                ${paceToggleHtml}
                <button type="button" class="btn" style="background: var(--danger); color: white; padding: 5px 10px; font-size: 1.1rem; line-height: 1;" onclick="app.deleteScheduleModalClass(${idx})" title="Delete">&times;</button>
              </div>

              <div style="display: flex; justify-content: center; align-items: center; margin-top: -2px;">
                <button type="button" class="btn-schedule-card-expand" onclick="app.toggleScheduleCardExpand(${idx})" title="Click to view and edit schedule">
                  ${summaryText ? `<span style="font-size: 0.78rem; font-weight: 700; color: #475569;">${this.escapeHtml(summaryText)}</span>` : ''}
                  <span style="font-size: 0.82rem; font-weight: 800; color: #2563eb;">⌄</span>
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
                <button type="button" class="schedule-color-circle-btn" style="background-color: ${c.color || '#059669'};" onclick="app.openScheduleColorPicker(${idx})" title="Change Color"></button>
                ${isText ? `<span style="font-size: 0.72rem; font-weight: 800; background: #e2e8f0; color: #475569; padding: 3px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.3px; flex-shrink: 0;">Text</span>` : ''}
                <input type="text" value="${this.escapeHtml(c.name || '')}" placeholder="Name..." style="flex: 1; font-weight: 700; font-size: 0.95rem; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px;" oninput="app.tempScheduleClasses[${idx}].name = this.value">
                ${paceToggleHtml}
                <button type="button" class="btn" style="background: var(--danger); color: white; padding: 5px 10px; font-size: 1.1rem; line-height: 1;" onclick="app.deleteScheduleModalClass(${idx})" title="Delete">&times;</button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 6px; padding-left: 28px; width: 100%; box-sizing: border-box;">
                ${slotsHtml}
              </div>

              ${isExpandedNotes ? `
                <div class="schedule-notes-drawer" style="margin-top: 4px; padding: 10px 12px; background: #f8fafc; border-radius: 8px; border: 1.5px dashed #cbd5e1; display: flex; flex-direction: column; gap: 8px;">
                  ${hasNotes ? `
                    <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 2px;">
                      <div style="font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.3px;">Notes:</div>
                      ${notes.map((note, noteIdx) => {
                        let targetLabel = 'Every class';
                        if (note.target === 'specific') {
                          targetLabel = (note.days || []).join(', ') || 'Specific days';
                        } else if (note.target === 'once') {
                          targetLabel = `Only once: ${this.formatNoteDateDisplay(note.date)}`;
                        }
                        return `
                        <div style="display: flex; align-items: center; justify-content: space-between; background: white; padding: 5px 8px; border-radius: 6px; border: 1px solid #e2e8f0; font-size: 0.82rem;">
                          <div>
                            <span style="font-weight: 700; color: #1e293b;">${this.escapeHtml(note.text)}</span>
                            <span style="color: #64748b; font-size: 0.75rem; margin-left: 6px;">(${targetLabel})</span>
                          </div>
                          <button type="button" style="background: none; border: none; color: #ef4444; font-weight: bold; cursor: pointer; padding: 0 4px; font-size: 1rem; line-height: 1;" onclick="app.deleteScheduleNote(${idx}, ${noteIdx})" title="Delete Note">&times;</button>
                        </div>
                      `;
                      }).join('')}
                    </div>
                  ` : ''}

                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    <div style="font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.3px;">+ Add Additional Text / Note:</div>
                    <input type="text" id="noteInput_${idx}" placeholder="Enter additional text (e.g. Choir, Recorders, etc.)..." style="width: 100%; box-sizing: border-box; padding: 6px 10px; font-size: 0.85rem; border: 1px solid #cbd5e1; border-radius: 6px;" onkeydown="if(event.key === 'Enter') app.addScheduleNoteToClass(${idx})">
                    
                    <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; color: #334155; margin-top: 2px;">
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
                        <label for="noteDateInput_${idx}" style="font-weight: 700; font-size: 0.82rem; color: #475569;">Select Date:</label>
                        <input type="date" id="noteDateInput_${idx}" value="${todayIso}" style="padding: 5px 10px; font-size: 0.85rem; border: 1.5px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-weight: 600; color: #1e293b; background: white; outline: none; cursor: pointer;">
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
                    <span style="font-size: 0.75rem; font-weight: 800; color: #64748b;">⌃ Collapse</span>
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
                <span style="font-size: 0.95rem; color: #94a3b8; font-weight: 800;">+</span>
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
          card.style.cssText = 'background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';

          const catCount = s.categories.length;
          const isExpanded = s.isExpanded !== false;

          let categoriesHTML = '';
          if (s.categories.length === 0) {
            categoriesHTML = '<div style="font-size: 0.82rem; color: #94a3b8; font-style: italic; margin-bottom: 6px;">No subcategories yet. Add one below.</div>';
          } else {
            categoriesHTML = '<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">';
            s.categories.forEach((cat, cIdx) => {
              categoriesHTML += `
                <div style="display: inline-flex; align-items: center; background: white; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 2px 6px; gap: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.04);">
                  <input type="text" value="${this.escapeHtml(cat)}" style="border: none; padding: 2px 4px; font-size: 0.85rem; font-weight: 700; width: 105px; outline: none; background: transparent;" oninput="app.tempSubjects[${sIdx}].categories[${cIdx}] = this.value">
                  <button type="button" onclick="app.deleteModalCategory(${sIdx}, ${cIdx})" style="background: transparent; border: none; color: #ef4444; font-size: 1rem; line-height: 1; cursor: pointer; font-weight: bold; padding: 0 2px;" title="Remove Category">&times;</button>
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
                <button type="button" class="btn btn-outline" onclick="app.toggleSubjectSublevel(${sIdx})" style="font-size: 0.8rem; font-weight: 600; padding: 5px 10px; background: #f8fafc;">
                  ${isExpanded ? 'Subcategories ▴' : `Subcategories (${catCount}) ▾`}
                </button>
                <button type="button" class="btn" style="background: var(--danger); color: white; padding: 5px 10px; font-size: 0.9rem;" onclick="app.deleteModalSubject(${sIdx})" title="Delete Subject">&times;</button>
              </div>
            </div>

            ${isExpanded ? `
              <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 10px; margin-top: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-weight: 700; font-size: 0.8rem; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Assessment Subcategories:</span>
                </div>
                ${categoriesHTML}
                <div style="display: flex; gap: 6px; align-items: center;">
                  <input type="text" id="modalAddCategory_${sIdx}" placeholder="New category (e.g. Drawing, Pottery)..." style="flex: 1; padding: 5px 10px; font-size: 0.85rem; background: white; border-radius: 6px; border: 1px solid var(--border-color);" onkeydown="if(event.key === 'Enter') app.addCategoryFromModal(${sIdx})">
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
        const frac = zoneEl.classList.contains('seat-drop-vertical')
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

      handleGroupDragStart(e, groupIndex) {
        if (!this.isEditMode) return;
        this.draggedGroupIndex = groupIndex;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'group-' + groupIndex);
        e.stopPropagation();

        document.body.classList.add('group-dragging-active');

        const box = document.getElementById(`group-box-${groupIndex}`);
        if (box) box.classList.add('group-dragging');
      }

      handleGroupDragOver(e, targetIndex) {
        if (!this.isEditMode || this.draggedGroupIndex === null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const box = document.getElementById(`group-box-${targetIndex}`);
        if (!box) return;

        const rect = box.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const width = rect.width;

        box.classList.remove('group-drop-target', 'group-drop-left', 'group-drop-right');

        if (mouseX < width * 0.3) {
          box.classList.add('group-drop-left');
        } else if (mouseX > width * 0.7) {
          box.classList.add('group-drop-right');
        } else {
          box.classList.add('group-drop-target');
        }
      }

      handleGroupDragEnter(e, targetIndex) {
        if (!this.isEditMode || this.draggedGroupIndex === null) return;
        e.preventDefault();
      }

      handleGroupDragLeave(e, targetIndex) {
        if (!this.isEditMode || this.draggedGroupIndex === null) return;
        const box = document.getElementById(`group-box-${targetIndex}`);
        if (box && !box.contains(e.relatedTarget)) {
          box.classList.remove('group-drop-target', 'group-drop-left', 'group-drop-right');
        }
      }

      handleGroupDrop(e, targetIndex, layoutType) {
        if (!this.isEditMode || this.draggedGroupIndex === null) return;
        e.preventDefault();
        e.stopPropagation();

        const box = document.getElementById(`group-box-${targetIndex}`);
        let mode = 'swap';
        if (box) {
          if (box.classList.contains('group-drop-left')) mode = 'left';
          else if (box.classList.contains('group-drop-right')) mode = 'right';
          box.classList.remove('group-drop-target', 'group-drop-left', 'group-drop-right');
        }

        const currentClass = this.getCurrentClass();
        if (!currentClass || !currentClass.layoutsData || !currentClass.layoutsData[layoutType]) return;

        if (mode === 'swap') {
          // Swap student arrays between tables
          const groups = currentClass.layoutsData[layoutType];
          const temp = groups[this.draggedGroupIndex];
          groups[this.draggedGroupIndex] = groups[targetIndex];
          groups[targetIndex] = temp;
        } else {
          // Reorder table position (left or right of target)
          const groups = currentClass.layoutsData[layoutType];
          const fromIdx = this.draggedGroupIndex;
          if (fromIdx !== targetIndex) {
            const movedGroup = groups.splice(fromIdx, 1)[0];
            let insertIdx = targetIndex;
            if (fromIdx < targetIndex) {
              insertIdx = mode === 'left' ? targetIndex - 1 : targetIndex;
            } else {
              insertIdx = mode === 'right' ? targetIndex + 1 : targetIndex;
            }
            insertIdx = Math.max(0, Math.min(insertIdx, groups.length));
            groups.splice(insertIdx, 0, movedGroup);
          }
        }

        this.saveData();
        this.render();
        this.resetDragState();
      }

      handleRowDrop(e, targetRowIdx, layoutType) {
        if (!this.isEditMode || this.draggedGroupIndex === null) return;
        e.preventDefault();
        e.stopPropagation();

        const currentClass = this.getCurrentClass();
        if (!currentClass || !currentClass.layoutsData) return;

        const rowKey = `${layoutType}Rows`;
        let rows = currentClass.layoutsData[rowKey];
        if (!rows) return;

        const gIdx = this.draggedGroupIndex;

        // Move groupIndex into targetRowIdx
        rows = rows.map(r => r.filter(id => id !== gIdx));
        if (!rows[targetRowIdx]) rows[targetRowIdx] = [];
        rows[targetRowIdx].push(gIdx);

        // Clean up empty rows
        currentClass.layoutsData[rowKey] = rows.filter(r => r.length > 0);

        this.saveData();
        this.render();
        this.resetDragState();
      }

      handleNewRowDrop(e, layoutType) {
        if (!this.isEditMode || this.draggedGroupIndex === null) return;
        e.preventDefault();
        e.stopPropagation();

        const currentClass = this.getCurrentClass();
        if (!currentClass || !currentClass.layoutsData) return;

        const rowKey = `${layoutType}Rows`;
        let rows = currentClass.layoutsData[rowKey];
        if (!rows) rows = [];

        const gIdx = this.draggedGroupIndex;

        // Remove from existing row
        rows = rows.map(r => r.filter(id => id !== gIdx)).filter(r => r.length > 0);

        // Create new bottom row
        rows.push([gIdx]);
        currentClass.layoutsData[rowKey] = rows;

        this.saveData();
        this.render();
        this.resetDragState();
      }

      handleDragEnd(e) {
        this.resetDragState();
        document.body.classList.remove('group-dragging-active');
        document.querySelectorAll('.seat.dragging, .roster-item.dragging').forEach(el => el.classList.remove('dragging'));
        document.querySelectorAll('.seat.drag-over, .roster-item.drag-over, .group-box.drag-over').forEach(el => el.classList.remove('drag-over'));
        document.querySelectorAll('.group-box.group-dragging').forEach(el => el.classList.remove('group-dragging'));
        document.querySelectorAll('.group-box.group-drop-target, .group-box.group-drop-left, .group-box.group-drop-right').forEach(el => {
          el.classList.remove('group-drop-target', 'group-drop-left', 'group-drop-right');
        });
        document.querySelectorAll('.group-row-slot.row-drop-target, .row-add-bottom-zone.drag-over').forEach(el => {
          el.classList.remove('row-drop-target', 'drag-over');
        });
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
        flashOverlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: white; opacity: 0.6; z-index: 10000; pointer-events: none; transition: opacity 0.25s ease-out;';
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
        wrapper.style.cssText = 'position: absolute; left: -9999px; top: -9999px; background: #ffffff; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; box-sizing: border-box; font-family: Segoe UI, system-ui, -apple-system, sans-serif; width: 1100px; min-height: 700px;';

        // Class Name Title Banner
        const titleEl = document.createElement('div');
        titleEl.style.cssText = 'font-size: 1.8rem; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 20px; letter-spacing: 0.5px;';
        titleEl.textContent = className;
        wrapper.appendChild(titleEl);

        // Chalkboard Front Banner
        const chalkboard = document.getElementById('chalkboardFront');
        if (chalkboard && (!currentClass || currentClass.layout !== 'circle')) {
          const cbClone = chalkboard.cloneNode(true);
          cbClone.style.margin = '0 0 24px 0';
          cbClone.style.width = '550px';
          cbClone.style.maxWidth = '100%';
          wrapper.appendChild(cbClone);
        }

        // Full Seating Chart Container Clone
        const chartContainer = document.getElementById('chartContainer');
        if (chartContainer) {
          const chartClone = chartContainer.cloneNode(true);
          chartClone.querySelectorAll('.row-align-dots, .circle-dial-container, .group-drag-handle, .resize-handle, .remove-btn').forEach(el => el.remove());
          chartClone.style.maxWidth = '1000px';
          chartClone.style.width = '100%';
          chartClone.style.minHeight = 'auto';
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
        flashOverlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: white; opacity: 0.6; z-index: 10000; pointer-events: none; transition: opacity 0.25s ease-out;';
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
        wrapper.style.cssText = `position: absolute; left: -9999px; top: -9999px; background: #ffffff; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; box-sizing: border-box; font-family: Segoe UI, system-ui, -apple-system, sans-serif; width: ${minWidth}px;`;

        // Banner Title
        const titleEl = document.createElement('div');
        titleEl.style.cssText = 'font-size: 1.75rem; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 24px; letter-spacing: 0.5px;';
        titleEl.textContent = `${rawClassName} — Attendance Register`;
        wrapper.appendChild(titleEl);

        // Build pristine export table (standard table, no position:sticky!)
        const exportTable = document.createElement('table');
        exportTable.style.cssText = 'width: 100%; border-collapse: collapse; background: #ffffff; font-size: 0.95rem; font-family: inherit; text-align: center;';

        // Table Header
        let theadHTML = '<thead><tr style="background-color: #f8fafc;">';
        theadHTML += '<th style="padding: 12px 16px; border: 1px solid #cbd5e1; font-weight: 700; color: #0f172a; text-align: left; min-width: 220px; background-color: #f1f5f9;">Student Name</th>';
        dates.forEach(d => {
          theadHTML += `<th style="padding: 10px 12px; border: 1px solid #cbd5e1; min-width: 65px; background-color: #f8fafc; vertical-align: middle;">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.25;">
              <span style="font-weight: 800; font-size: 0.9rem; color: #0f172a;">${d.date}</span>
              <span style="font-weight: 600; font-size: 0.75rem; color: #64748b; margin-top: 2px;">${d.day}</span>
            </div>
          </th>`;
        });
        theadHTML += '</tr></thead>';

        // Table Body
        let tbodyHTML = '<tbody>';
        if (classList.length === 0) {
          tbodyHTML += `<tr><td colspan="${dates.length + 1}" style="padding: 30px; text-align: center; color: #94a3b8; font-style: italic; border: 1px solid #cbd5e1;">No students in this class list</td></tr>`;
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
                dateCells += `<td style="padding: 8px; border: 1px solid #e2e8f0; vertical-align: middle;">
                  <span style="color: #10b981; font-weight: 800; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: #ecfdf5; border: 1px solid #a7f3d0;">✓</span>
                </td>`;
              } else if (status === 'absent') {
                dateCells += `<td style="padding: 8px; border: 1px solid #e2e8f0; vertical-align: middle;">
                  <span style="color: #ef4444; font-weight: 800; font-size: 1rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: #fef2f2; border: 1px solid #fecaca;">✕</span>
                </td>`;
              } else {
                dateCells += `<td style="padding: 8px; border: 1px solid #e2e8f0; vertical-align: middle;"></td>`;
              }
            });

            const ratioText = `(${presentCount}/${recordedCount})`;
            const rowBg = (rIdx % 2 === 1) ? '#f8fafc' : '#ffffff';

            tbodyHTML += `<tr style="background-color: ${rowBg};">
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 600; color: #0f172a; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                  <span>${this.escapeHtml(fullName)}</span>
                  <span style="font-size: 0.8rem; font-weight: 800; color: var(--primary); background: #e0e7ff; padding: 2px 7px; border-radius: 12px; white-space: nowrap;">${ratioText}</span>
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
        flashOverlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: white; opacity: 0.6; z-index: 10000; pointer-events: none; transition: opacity 0.25s ease-out;';
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
        wrapper.style.cssText = `position: absolute; left: -9999px; top: -9999px; background: #ffffff; padding: 32px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; box-sizing: border-box; font-family: Segoe UI, system-ui, -apple-system, sans-serif; width: ${minWidth}px;`;

        const titleEl = document.createElement('div');
        titleEl.style.cssText = 'font-size: 1.75rem; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 24px; letter-spacing: 0.5px;';
        titleEl.textContent = `${rawClassName} — Grades Register (${subjName})`;
        wrapper.appendChild(titleEl);

        const exportTable = document.createElement('table');
        exportTable.style.cssText = 'width: 100%; border-collapse: collapse; background: #ffffff; font-size: 0.95rem; font-family: inherit; text-align: center;';

        let theadHTML = '<thead><tr style="background-color: #f8fafc;">';
        theadHTML += '<th style="padding: 12px 16px; border: 1px solid #cbd5e1; font-weight: 700; color: #0f172a; text-align: left; min-width: 220px; background-color: #f1f5f9;">Student Name</th>';
        gradeCols.forEach(col => {
          const theme = this.getCategoryTheme(col.title);

          theadHTML += `<th style="padding: 10px 12px; border: 1px solid ${theme.border}; min-width: 80px; background-color: ${theme.bgCell}; vertical-align: middle;">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.25;">
              <span style="font-weight: 800; font-size: 0.85rem; color: ${theme.color}; background: ${theme.bgHeader}; padding: 2px 8px; border-radius: 12px; border: 1px solid ${theme.border};">${this.escapeHtml(col.title || 'Grade')}</span>
              <span style="font-weight: 700; font-size: 0.8rem; color: #0f172a; margin-top: 3px;">${col.date}</span>
            </div>
          </th>`;
        });
        theadHTML += '</tr></thead>';

        let tbodyHTML = '<tbody>';
        if (classList.length === 0) {
          tbodyHTML += `<tr><td colspan="${gradeCols.length + 1}" style="padding: 30px; text-align: center; color: #94a3b8; font-style: italic; border: 1px solid #cbd5e1;">No students in this class list</td></tr>`;
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
                  attIndicatorHTML = `<span style="position: absolute; top: 3px; right: 3px; width: 7px; height: 7px; border-radius: 50%; background-color: #ef4444;"></span>`;
                  cellBg = '#fef2f2';
                } else if (attStatus === 'present') {
                  attIndicatorHTML = `<span style="position: absolute; top: 3px; right: 3px; width: 7px; height: 7px; border-radius: 50%; background-color: #10b981;"></span>`;
                }
              }

              let symbolHTML = '';
              const isPoints = (col.gradingStyle === 'points') || (!col.gradingStyle && col.maxPoints !== undefined);

              if (isPoints) {
                if (gradeVal !== '' && gradeVal !== null && gradeVal !== undefined && !isNaN(Number(gradeVal))) {
                  const earned = Number(gradeVal);
                  const maxPts = Number(col.maxPoints || 10);
                  const pct = Math.round((earned / maxPts) * 100);
                  symbolHTML = `<span style="font-weight: 700; font-size: 0.88rem; color: #0f172a; white-space: nowrap;">${earned}/${maxPts} <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">(${pct}%)</span></span>`;
                } else {
                  symbolHTML = `<span style="color: #cbd5e1; font-weight: bold;">—</span>`;
                }
              } else if (String(gradeVal) === '4') {
                symbolHTML = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; font-weight: 900; font-size: 0.95rem; background: #fef08a; color: #854d0e; border: 1px solid #fde047;">4</span>`;
              } else if (String(gradeVal) === '3') {
                symbolHTML = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; font-weight: 900; font-size: 0.95rem; background: #bbf7d0; color: #166534; border: 1px solid #86efac;">3</span>`;
              } else if (String(gradeVal) === '2') {
                symbolHTML = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; font-weight: 900; font-size: 0.95rem; background: #fed7aa; color: #9a3412; border: 1px solid #fdba74;">2</span>`;
              } else if (String(gradeVal) === '1') {
                symbolHTML = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 6px; font-weight: 900; font-size: 0.95rem; background: #fecaca; color: #991b1b; border: 1px solid #fca5a5;">1</span>`;
              } else if (gradeVal === 'star') {
                symbolHTML = `<span style="color: #b45309; font-weight: 900; font-size: 1.15rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: #fef3c7; border: 1px solid #fbbf24;">★</span>`;
              } else if (gradeVal === 'check' || gradeVal === 'plus') {
                symbolHTML = `<span style="color: #10b981; font-weight: 900; font-size: 1.1rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: #ecfdf5; border: 1px solid #a7f3d0;">+</span>`;
              } else if (gradeVal === 'minus') {
                symbolHTML = `<span style="color: #ef4444; font-weight: 900; font-size: 1.2rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: #fef2f2; border: 1px solid #fecaca;">−</span>`;
              } else if (gradeVal === 'x') {
                symbolHTML = `<span style="color: #dc2626; font-weight: 900; font-size: 1rem; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: #fef2f2; border: 1px solid #fecaca;">✕</span>`;
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
            const ratioHTML = showGradesRatio ? `<span style="font-size: 0.8rem; font-weight: 700; color: #4f46e5; background: #e0e7ff; padding: 2px 6px; border-radius: 10px;">${ratioText}</span>` : '';
            const rowBg = (rIdx % 2 === 1) ? '#ffffff' : '#ffffff';
            tbodyHTML += `<tr style="background-color: ${rowBg};">
              <td style="padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 600; color: #0f172a; text-align: left; background-color: #ffffff;">
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
          };

          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const currentClass = this.getCurrentClass();
            if (currentClass) {
              if (!currentClass.containerSizes) currentClass.containerSizes = {};
              currentClass.containerSizes[sizeKey] = {
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

        // 6. Ensure active group layout is populated if empty
        const activeLayout = currentClass.layout || 'rows';
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
          ['rows', 'lines', 'circle', 'half', 'third', 'fourth', 'fifth', 'sixth', 'freeform'].forEach(l => {
            const btn = document.getElementById(`btnLayout${l.charAt(0).toUpperCase() + l.slice(1)}`);
            if (btn) btn.classList.toggle('active', layout === l);
          });
          const absentSet = new Set(Array.isArray(currentClass.absentStudents) ? currentClass.absentStudents : []);
          const seatedStudents = this.getAllStudents();
          const presentSeatedCount = seatedStudents.filter(s => !absentSet.has(s)).length;
          const totalClassCount = Array.isArray(currentClass.classList) ? currentClass.classList.length : 0;
          const rosterCountEl = document.getElementById('rosterCount');
          if (rosterCountEl) rosterCountEl.innerText = `${presentSeatedCount}/${totalClassCount}`;

          const chalkboard = document.getElementById('chalkboardFront');
          if (chalkboard) {
            chalkboard.style.display = (layout === 'circle') ? 'none' : 'block';
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
          // 1. Update classList
          currentClass.classList[r.idx] = r.newName;

          // 2. Update rows
          if (Array.isArray(currentClass.rows)) {
            currentClass.rows = currentClass.rows.map(row => Array.isArray(row) ? row.map(n => n === r.original ? r.newName : n) : []);
          }

          // 3. Update circle
          if (Array.isArray(currentClass.circle)) {
            currentClass.circle = currentClass.circle.map(n => n === r.original ? r.newName : n);
          }

          // 4. Update freeform
          if (Array.isArray(currentClass.freeform)) {
            currentClass.freeform = currentClass.freeform.map(n => n === r.original ? r.newName : n);
          }
          if (currentClass.freeformPositions && currentClass.freeformPositions[r.original]) {
            currentClass.freeformPositions[r.newName] = currentClass.freeformPositions[r.original];
            delete currentClass.freeformPositions[r.original];
          }

          // 5. Update group layouts
          if (currentClass.layoutsData) {
            ['half', 'third', 'fourth', 'fifth', 'sixth'].forEach(key => {
              if (Array.isArray(currentClass.layoutsData[key])) {
                currentClass.layoutsData[key] = currentClass.layoutsData[key].map(g => Array.isArray(g) ? g.map(n => n === r.original ? r.newName : n) : []);
              }
            });
          }

          // 6. Update unplacedStudents
          if (Array.isArray(currentClass.unplacedStudents)) {
            currentClass.unplacedStudents = currentClass.unplacedStudents.map(n => n === r.original ? r.newName : n);
          }

          // 7. Update studentProfiles
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

        const currentClass = this.getCurrentClass();
        const masterList = (currentClass && currentClass.classList) ? currentClass.classList : [];
        if (countSpan) countSpan.textContent = masterList.length;

        if (masterList.length === 0) {
          ul.innerHTML = '<li class="roster-item" style="color: var(--text-muted); font-style: italic;">No class list created yet</li>';
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
          li.style.cssText = 'padding: 4px 8px; font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 6px;';

          let delBtnHTML = '';
          let nameHTML = '';

          if (this.isClassListEditMode) {
            nameHTML = `<div style="display: flex; align-items: center; gap: 4px; flex: 1;">
              <span style="font-weight: 600; font-size: 0.8rem; color: #64748b;">${idx + 1}.</span>
              <input type="text" class="class-list-name-input" data-index="${idx}" data-original="${this.escapeQuotes(student)}" value="${this.escapeQuotes(rosterName)}" style="flex: 1; padding: 2px 6px; font-size: 0.85rem; border: 1px solid #cbd5e1; border-radius: 4px; background: #ffffff;">
            </div>`;
            delBtnHTML = `<button class="roster-del-btn" style="background: var(--danger); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-weight: bold; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" onclick="event.stopPropagation(); app.confirmRemoveStudentFromClass('${this.escapeQuotes(student)}')" title="Remove Student from Class">&times;</button>`;
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
            html += `<th style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; border-left: 2px dashed #94a3b8; border-right: 2px dashed #94a3b8;">
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2; padding: 2px 0;">
                <span style="font-weight: 700; font-size: 0.85rem; color: #0f172a;">${d.date}</span>
                <span style="font-weight: 500; font-size: 0.72rem; color: #64748b; margin-top: 1px;">${d.day}</span>
                <span style="font-weight: 800; font-size: 0.68rem; text-transform: uppercase; color: #f97316; margin-top: 2px; letter-spacing: 0.5px;">(Drafting)</span>
              </div>
            </th>`;
          } else {
            const delBtnHTML = this.isEditMode
              ? `<button class="delete-date-col-btn" onclick="event.stopPropagation(); app.deleteAttendanceColumn('${d.id}')" title="Delete Column">&times;</button>`
              : '';

            html += `<th>
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.2; padding: 2px 0;">
                ${delBtnHTML}
                <span style="font-weight: 700; font-size: 0.85rem; color: #0f172a;">${d.date}</span>
                <span style="font-weight: 500; font-size: 0.72rem; color: #64748b; margin-top: 1px; text-transform: none; letter-spacing: 0;">${d.day}</span>
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
                  draftStatusHTML = `<span style="color: #94a3b8; font-weight: 800; font-size: 1.1rem;" title="Unrecorded (Click for Present ✓)">—</span>`;
                }

                dateCellsHTML += `<td style="${draftBg} border-left: 2px dashed #cbd5e1; border-right: 2px dashed #cbd5e1; text-align: center; cursor: pointer; user-select: none;" onclick="event.stopPropagation(); app.toggleDraftAttendanceStudent('${this.escapeQuotes(student)}')" title="Click to cycle attendance (— → ✓ → ✕)">${draftStatusHTML}</td>`;
              } else {
                let statusHTML = '';
                if (status === 'present') {
                  presentCount++;
                  statusHTML = `<span class="attendance-status-present" title="Present">✓</span>`;
                } else if (status === 'absent') {
                  statusHTML = `<span class="attendance-status-absent" title="Absent">✕</span>`;
                } else {
                  statusHTML = this.isEditMode ? `<span style="color: #cbd5e1; font-weight: bold; font-size: 0.9rem;">—</span>` : ``;
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

            html += `<tr><td ${studentClick} ${studentTitle}><div style="display: flex; align-items: center; gap: 8px;"><span style="font-weight: 600; color: #0f172a;">${this.escapeHtml(fullName)}</span><span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); background: #e0e7ff; padding: 2px 6px; border-radius: 10px;">${ratioText}</span></div></td>${dateCellsHTML}</tr>`;
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

      renderRoster() {
        const list = document.getElementById('rosterList');
        if (!list) return;
        list.innerHTML = '';

        const currentClass = this.getCurrentClass();
        if (!currentClass) return;

        const absentSet = new Set(Array.isArray(currentClass.absentStudents) ? currentClass.absentStudents : []);
        const allPlaced = this.getAllStudents();
        const unplacedMaster = Array.isArray(currentClass.unplacedStudents) ? currentClass.unplacedStudents : [];

        // Filter into 3 lists:
        // 1. Present = placed students who are NOT in absentSet
        const presentStudents = allPlaced.filter(s => !absentSet.has(s));

        // 2. Absent = all students currently in absentSet
        const absentStudents = Array.from(absentSet);

        // 3. To Be Placed = unplaced students who are NOT in absentSet
        const unplacedStudents = unplacedMaster.filter(s => !absentSet.has(s));

        if (presentStudents.length === 0 && absentStudents.length === 0 && unplacedStudents.length === 0) {
          list.innerHTML = '<li class="roster-item" style="color: var(--text-muted); font-style: italic;">No students added</li>';
          return;
        }

        // --- SECTION 1: PRESENT STUDENTS ---
        const presentHeader = document.createElement('li');
        presentHeader.style.cssText = 'font-weight: 700; color: #059669; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; margin-bottom: 6px; padding: 4px 8px; background: #ecfdf5; border-radius: 4px; pointer-events: none; border-left: 3px solid #10b981; display: flex; justify-content: space-between; align-items: center;';
        presentHeader.innerHTML = `<span>Present (${presentStudents.length})</span>`;
        list.appendChild(presentHeader);

        if (presentStudents.length === 0) {
          const emptyLi = document.createElement('li');
          emptyLi.style.cssText = 'padding: 4px 8px; font-size: 0.8rem; color: #94a3b8; font-style: italic;';
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
        absentHeader.style.cssText = 'font-weight: 700; color: #dc2626; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 12px; margin-bottom: 6px; padding: 4px 8px; background: #fef2f2; border-radius: 4px; pointer-events: none; border-left: 3px solid #ef4444; display: flex; justify-content: space-between; align-items: center;';
        absentHeader.innerHTML = `<span>Absent (${absentStudents.length})</span>`;
        list.appendChild(absentHeader);

        if (absentStudents.length === 0) {
          const emptyLi = document.createElement('li');
          emptyLi.style.cssText = 'padding: 4px 8px; font-size: 0.8rem; color: #94a3b8; font-style: italic;';
          emptyLi.textContent = 'None';
          list.appendChild(emptyLi);
        } else {
          absentStudents.forEach((student) => {
            const profile = this.getStudentProfile(currentClass, student);
            const displayName = profile.rosterName || student;
            const li = document.createElement('li');
            li.className = 'roster-item absent-roster-item';
            li.style.cssText = 'padding: 5px 8px; font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 4px; opacity: 0.85;';
            li.title = 'Click to reinstate student';
            li.innerHTML = `
              <span style="text-decoration: line-through; color: #64748b; font-weight: 500;">${this.escapeHtml(displayName)}</span>
              <button class="reinstate-btn" onclick="event.stopPropagation(); app.toggleStudentAbsent('${this.escapeQuotes(student)}')" style="background: var(--primary); color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 0.72rem; padding: 2px 8px; cursor: pointer; transition: background 0.2s ease;">Reinstate</button>
            `;

            li.onclick = () => {
              this.toggleStudentAbsent(student);
            };

            list.appendChild(li);
          });
        }

        // --- SECTION 3: TO BE PLACED STUDENTS ---
        const unplacedHeader = document.createElement('li');
        unplacedHeader.style.cssText = 'font-weight: 700; color: #4338ca; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 12px; margin-bottom: 6px; padding: 4px 8px; background: #e0e7ff; border-radius: 4px; pointer-events: none; border-left: 3px solid #6366f1; display: flex; justify-content: space-between; align-items: center;';
        unplacedHeader.innerHTML = `<span>To Be Placed (${unplacedStudents.length})</span>`;
        list.appendChild(unplacedHeader);

        if (unplacedStudents.length === 0) {
          const emptyLi = document.createElement('li');
          emptyLi.style.cssText = 'padding: 4px 8px; font-size: 0.8rem; color: #94a3b8; font-style: italic;';
          emptyLi.textContent = 'None';
          list.appendChild(emptyLi);
        } else {
          unplacedStudents.forEach((student) => {
            const profile = this.getStudentProfile(currentClass, student);
            const displayName = profile.rosterName || student;
            const li = document.createElement('li');
            li.className = 'roster-item unplaced-item';
            li.style.cssText = 'cursor: pointer; background: #fff1f2; border: 1px dashed #fca5a5; color: #991b1b; padding: 6px 10px; border-radius: 6px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;';
            li.title = 'Click to place student on chart';
            li.innerHTML = `
              <span style="font-weight: 600;">+ ${this.escapeHtml(displayName)}</span>
              <span style="font-size: 0.75rem; color: #e11d48; font-weight: bold;">[Place]</span>
            `;

            li.onclick = () => {
              this.placeUnseatedStudent(student);
            };

            list.appendChild(li);
          });
        }
      }

      renderChart(currentClass) {
        const container = document.getElementById('chartContainer');
        container.innerHTML = '';
        container.removeAttribute('style');

        if (!currentClass || !currentClass.classList || currentClass.classList.length === 0) {
          container.className = 'chart-container';
          container.innerHTML = '<div class="empty-state">No students in this class. Add students using the sidebar panel.</div>';
          return;
        }

        const layout = currentClass.layout;
        if (layout === 'rows') {
          this.renderRowsLayout(container, currentClass);
        } else if (layout === 'lines') {
          this.renderLinesLayout(container, currentClass);
        } else if (layout === 'circle') {
          this.renderCircleLayout(container, currentClass);
        } else if (layout === 'freeform') {
          this.renderFreeformLayout(container, currentClass);
        } else {
          this.renderGroupedLayout(container, currentClass, layout);
        }
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
        box.style.background = 'rgba(226, 232, 240, 0.5)';
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
          placeholder.style.cssText = 'position: absolute; top: 45%; left: 0; right: 0; text-align: center; color: var(--text-muted); font-size: 0.95rem; font-style: italic; user-select: none; pointer-events: none;';
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
          lineDiv.style.cssText = `flex: 1; min-width: 105px; min-height: 400px; background: rgba(226, 232, 240, 0.4); border: 2px dashed #cbd5e1; border-radius: 10px; padding: 24px ${colPaddingX}px 14px ${colPaddingX}px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 2px; position: relative; transition: background-color 0.2s, border-color 0.2s; box-sizing: border-box;`;

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
            placeholder.style.color = 'var(--text-muted)';
            placeholder.style.fontSize = '0.85rem';
            placeholder.style.fontStyle = 'italic';
            placeholder.style.textAlign = 'center';
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
              placeholder.style.color = 'var(--text-muted)';
              placeholder.style.fontSize = '0.85rem';
              placeholder.style.fontStyle = 'italic';
              placeholder.style.width = '100%';
              placeholder.style.textAlign = 'center';
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
            leftSec.className = 'seat-drop-zone';
            leftSec.style.flex = '1';
            leftSec.style.display = 'flex';
            leftSec.style.flexWrap = 'wrap';
            leftSec.style.columnGap = '10px';
            leftSec.style.rowGap = '8px';
            leftSec.style.justifyContent = 'flex-end';
            leftSec.style.alignItems = 'center';
            leftSec.style.alignContent = 'center';
            leftSec.style.minHeight = '65px';
            leftSec.style.padding = '6px';
            leftSec.style.border = '1px dashed #cbd5e1';
            leftSec.style.borderRadius = '6px';
            leftSec.style.background = 'rgba(255,255,255,0.6)';

            leftSec.ondragover = (e) => this.handleDragOver(e);
            leftSec.ondragenter = (e) => this.handleDragEnterGroup(e, `${rIndex}-sec-0`, 'seat-row');
            leftSec.ondragleave = (e) => this.handleDragLeaveGroup(e, `${rIndex}-sec-0`, 'seat-row');
            leftSec.ondrop = (e) => this.handleDropOnRow(e, rIndex, 0);

            if (leftStudents.length === 0) {
              leftSec.innerHTML = '<span style="color: var(--text-muted); font-size: 0.8rem; font-style: italic;">Left Section</span>';
            } else {
              leftStudents.forEach(studentName => {
                const seatEl = this.createSeatElement(studentName, rIndex);
                leftSec.appendChild(seatEl);
              });
            }

            const divider = document.createElement('div');
            divider.style.width = '2px';
            divider.style.height = '80%';
            divider.style.background = 'var(--primary)';
            divider.style.opacity = '0.5';

            const rightSec = document.createElement('div');
            rightSec.id = `seat-row-${rIndex}-sec-1`;
            rightSec.className = 'seat-drop-zone';
            rightSec.style.flex = '1';
            rightSec.style.display = 'flex';
            rightSec.style.flexWrap = 'wrap';
            rightSec.style.columnGap = '10px';
            rightSec.style.rowGap = '8px';
            rightSec.style.justifyContent = 'flex-start';
            rightSec.style.alignItems = 'center';
            rightSec.style.alignContent = 'center';
            rightSec.style.minHeight = '65px';
            rightSec.style.padding = '6px';
            rightSec.style.border = '1px dashed #cbd5e1';
            rightSec.style.borderRadius = '6px';
            rightSec.style.background = 'rgba(255,255,255,0.6)';

            rightSec.ondragover = (e) => this.handleDragOver(e);
            rightSec.ondragenter = (e) => this.handleDragEnterGroup(e, `${rIndex}-sec-1`, 'seat-row');
            rightSec.ondragleave = (e) => this.handleDragLeaveGroup(e, `${rIndex}-sec-1`, 'seat-row');
            rightSec.ondrop = (e) => this.handleDropOnRow(e, rIndex, 1);

            if (rightStudents.length === 0) {
              rightSec.innerHTML = '<span style="color: var(--text-muted); font-size: 0.8rem; font-style: italic;">Right Section</span>';
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
        container.className = 'chart-container group-rows-container';

        const groupTitles = {
          half: ['Group A', 'Group B'],
          third: ['Group A', 'Group B', 'Group C'],
          fourth: ['Group A', 'Group B', 'Group C', 'Group D'],
          fifth: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E'],
          sixth: ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F']
        };

        const titles = groupTitles[layoutType];
        const groups = currentClass.layoutsData[layoutType] || [];

        // Initialize default row structure if not already stored or corrupted
        const rowKey = `${layoutType}Rows`;
        const expectedIndicesCount = titles ? titles.length : 0;
        const existingRowDef = currentClass.layoutsData[rowKey];
        const flatIndicesCount = Array.isArray(existingRowDef) ? existingRowDef.flat().length : 0;

        if (!existingRowDef || flatIndicesCount !== expectedIndicesCount) {
          if (layoutType === 'half') currentClass.layoutsData[rowKey] = [[0, 1]];
          else if (layoutType === 'third') currentClass.layoutsData[rowKey] = [[0, 1], [2]];
          else if (layoutType === 'fourth') currentClass.layoutsData[rowKey] = [[0, 1], [2, 3]];
          else if (layoutType === 'fifth') currentClass.layoutsData[rowKey] = [[0, 1], [4], [2, 3]];
          else if (layoutType === 'sixth') currentClass.layoutsData[rowKey] = [[0, 1], [2, 3], [4, 5]];
        }

        const rows = currentClass.layoutsData[rowKey];
        const alignKey = `${layoutType}RowAlign`;
        if (!currentClass.layoutsData[alignKey]) {
          currentClass.layoutsData[alignKey] = {};
        }

        rows.forEach((rowGroupIndices, rIdx) => {
          const rowSlot = document.createElement('div');
          rowSlot.className = 'group-row-slot';
          rowSlot.id = `group-row-slot-${rIdx}`;

          const savedAlign = currentClass.layoutsData[alignKey][rIdx] || 'center';
          rowSlot.style.justifyContent = savedAlign;

          // Alignment dots control container
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
            dot.onclick = () => {
              currentClass.layoutsData[alignKey][rIdx] = a.val;
              this.saveData();
              this.render();
            };
            dotsContainer.appendChild(dot);
          });

          rowSlot.appendChild(dotsContainer);

          rowSlot.ondragover = (e) => {
            if (this.draggedGroupIndex !== null) {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              rowSlot.classList.add('row-drop-target');
            }
          };
          rowSlot.ondragleave = (e) => {
            if (this.draggedGroupIndex !== null && !rowSlot.contains(e.relatedTarget)) {
              rowSlot.classList.remove('row-drop-target');
            }
          };
          rowSlot.ondrop = (e) => {
            if (this.draggedGroupIndex !== null) {
              rowSlot.classList.remove('row-drop-target');
              this.handleRowDrop(e, rIdx, layoutType);
            }
          };

          rowGroupIndices.forEach((gIndex) => {
            if (gIndex >= titles.length) return;

            const title = titles[gIndex];
            const groupStudents = groups[gIndex] || [];

            const box = document.createElement('div');
            box.className = 'group-box seat-drop-zone';
            box.id = `group-box-${gIndex}`;

            const sizeKey = `${layoutType}-${gIndex}`;
            const savedSize = (currentClass.containerSizes && currentClass.containerSizes[sizeKey]) || null;
            const legacyHeight = (currentClass.containerHeights && currentClass.containerHeights[sizeKey]) || null;

            if (savedSize) {
              if (savedSize.height) box.style.height = `${savedSize.height}px`;
              if (savedSize.width) box.style.width = `${savedSize.width}px`;
            } else if (legacyHeight) {
              box.style.height = `${legacyHeight}px`;
            }

            const handHandle = document.createElement('div');
            handHandle.className = 'group-drag-handle';
            handHandle.title = 'Drag to move table or swap';
            handHandle.innerHTML = '✋';
            handHandle.draggable = true;
            handHandle.ondragstart = (e) => this.handleGroupDragStart(e, gIndex);
            box.appendChild(handHandle);

            const badge = document.createElement('div');
            badge.className = 'group-header-badge';
            badge.textContent = `${title} (${groupStudents.length})`;
            box.appendChild(badge);

            box.ondragover = (e) => {
              if (this.draggedGroupIndex !== null) this.handleGroupDragOver(e, gIndex);
              else this.handleDragOver(e);
            };
            box.ondragenter = (e) => {
              if (this.draggedGroupIndex !== null) this.handleGroupDragEnter(e, gIndex);
              else this.handleDragEnterGroup(e, gIndex, 'group-box');
            };
            box.ondragleave = (e) => {
              if (this.draggedGroupIndex !== null) this.handleGroupDragLeave(e, gIndex);
              else this.handleDragLeaveGroup(e, gIndex, 'group-box');
            };
            box.ondrop = (e) => {
              if (this.draggedGroupIndex !== null) this.handleGroupDrop(e, gIndex, layoutType);
              else this.handleDropOnGroup(e, gIndex, layoutType);
            };

            this.makeResizable(box, sizeKey);

            if (groupStudents.length === 0) {
              const placeholder = document.createElement('div');
              placeholder.style.color = 'var(--text-muted)';
              placeholder.style.fontSize = '0.85rem';
              placeholder.style.fontStyle = 'italic';
              placeholder.style.width = '100%';
              placeholder.style.textAlign = 'center';
              placeholder.style.alignSelf = 'center';
              placeholder.textContent = 'Drag students here';
              box.appendChild(placeholder);
            } else {
              groupStudents.forEach((studentName) => {
                const seatEl = this.createSeatElement(studentName, gIndex);
                box.appendChild(seatEl);
              });
            }

            rowSlot.appendChild(box);
          });

          container.appendChild(rowSlot);
        });

        // Add bottom drop zone for creating new row at the bottom
        const bottomZone = document.createElement('div');
        bottomZone.className = 'row-add-bottom-zone';
        bottomZone.innerHTML = '+ Drag table here to create a new row at bottom';

        bottomZone.ondragover = (e) => {
          if (this.draggedGroupIndex !== null) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            bottomZone.classList.add('drag-over');
          }
        };
        bottomZone.ondragleave = (e) => {
          if (this.draggedGroupIndex !== null) {
            bottomZone.classList.remove('drag-over');
          }
        };
        bottomZone.ondrop = (e) => {
          if (this.draggedGroupIndex !== null) {
            bottomZone.classList.remove('drag-over');
            this.handleNewRowDrop(e, layoutType);
          }
        };

        container.appendChild(bottomZone);
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
          if (Array.isArray(currentClass.rows)) {
            currentClass.rows = currentClass.rows.map(r => Array.isArray(r) ? r.map(n => n === oldKey ? newFirstName : n) : []);
          }
          if (Array.isArray(currentClass.circle)) {
            currentClass.circle = currentClass.circle.map(n => n === oldKey ? newFirstName : n);
          }
          if (Array.isArray(currentClass.freeform)) {
            currentClass.freeform = currentClass.freeform.map(n => n === oldKey ? newFirstName : n);
          }
          if (currentClass.freeformPositions && currentClass.freeformPositions[oldKey]) {
            currentClass.freeformPositions[newFirstName] = currentClass.freeformPositions[oldKey];
            delete currentClass.freeformPositions[oldKey];
          }
          if (currentClass.layoutsData) {
            ['half', 'third', 'fourth', 'fifth', 'sixth'].forEach(key => {
              if (Array.isArray(currentClass.layoutsData[key])) {
                currentClass.layoutsData[key] = currentClass.layoutsData[key].map(g => Array.isArray(g) ? g.map(n => n === oldKey ? newFirstName : n) : []);
              }
            });
          }
          if (Array.isArray(currentClass.unplacedStudents)) {
            currentClass.unplacedStudents = currentClass.unplacedStudents.map(n => n === oldKey ? newFirstName : n);
          }
          if (Array.isArray(currentClass.dividedRowsData)) {
            currentClass.dividedRowsData.forEach(rSecs => {
              if (Array.isArray(rSecs)) {
                rSecs.forEach((sec, idx) => {
                  if (Array.isArray(sec)) rSecs[idx] = sec.map(n => n === oldKey ? newFirstName : n);
                });
              }
            });
          }
        }

        this.saveData();
        this.render();
        this.closeModal('nameCardModal');
      }

      createSeatElement(name, groupIndex) {
        const safeName = (name === null || name === undefined) ? '' : String(name);
        const currentClass = this.getCurrentClass();
        const showFaces = currentClass ? (currentClass.showFaces !== false && currentClass.showInitials !== false) : true;
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

        const streak = (safeName && !isCardAbsent) ? this.getAttendanceStreak(currentClass, safeName) : 0;
        const streakTier = this.getAttendanceStreakTier(streak, currentClass);
        // Each card twinkles on its own timing so a room full of them doesn't blink in step
        const starDelay = ([...safeName].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 5200, 7) / 1000).toFixed(2);

        const seat = document.createElement('div');
        seat.className = 'seat' + (showFaces ? '' : ' no-faces') + (isCardAbsent ? ' seat-absent' : '') + (streakTier ? ` streak-${streakTier}` : '');
        seat.dataset.student = safeName;
        if (streakTier) seat.title = `Perfect attendance: ${streak} classes in a row`;
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

        const nameDisplayHTML = nameSpans.length > 0
          ? `<div class="student-name">${nameSpans.join(' ')}</div>`
          : '';

        seat.innerHTML = `
          <button class="remove-btn" onclick="event.stopPropagation(); app.removeStudent('${this.escapeQuotes(safeName)}')" title="Remove">&times;</button>
          ${showFaces ? `<div class="avatar">${initials}</div>` : ''}
          ${nameDisplayHTML}
          ${streakTier === 3 ? `<span class="streak-badge" aria-hidden="true">★</span><span class="streak-twinkles" aria-hidden="true" style="--star-delay: -${starDelay}s"><i>✦</i><i>✦</i><i>✦</i><i>✦</i><i>✦</i><i>✦</i></span>` : ''}
        `;

        if (this.isAttendanceSessionActive && safeName) {
          const attBtn = document.createElement('button');
          attBtn.type = 'button';
          attBtn.className = `attendance-live-check-btn ${isAttAbsent ? 'is-absent' : 'is-present'}`;
          attBtn.style.cssText = `position: absolute; top: 4px; right: 4px; z-index: 6; width: 24px; height: 24px; border-radius: 50%; border: 2px solid ${isAttAbsent ? '#94a3b8' : '#10b981'}; background: ${isAttAbsent ? '#f1f5f9' : '#dcfce7'}; color: ${isAttAbsent ? '#94a3b8' : '#15803d'}; font-size: 0.85rem; font-weight: 900; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.15s ease;`;
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