# 🏫 EVE Bathroom Pass Kiosk (HTML Edition)

A kid-friendly Hallway & Bathroom Pass kiosk web application designed specifically for elementary students (1st through 6th grade). Built with clean HTML5, modern CSS3, and vanilla JavaScript, this version runs as a traditional standalone web project ready for local use or hosting on **GitHub Pages**.

---

## ✨ Features

- **Kid-Friendly Touch UI**: Ultra-legible Google Fonts (`Lexend` & `Fredoka`), high-contrast colors, and large touch targets designed for Chromebooks and tablets.
- **Eagle Mascot Badge**: Custom vector mascot and live greeting clock (`Good morning!`, `Good afternoon!`).
- **4-Step Check-Out Flow**:
  1. Student 1 (Required) and Student 2 / Buddy (Optional) with instant 1-tap clear buttons.
  2. Grade selection (1st – 6th).
  3. Dynamic teacher selection (filtered by selected grade, allows picking 1 or 2 teachers).
  4. Bathroom Pass Color selection (Orange, Blue, Green, Purple) with grade-level color restrictions.
- **Active Pass Screen**:
  - Summarizes student names, grade, teacher(s), departure time, and pass color.
  - State persisted across accidental browser reloads via `localStorage`.
- **Return & Celebration Flow**:
  - Large pulsing **CHECK IN / I'M BACK** button.
  - Lightweight confetti particle celebration on HTML5 Canvas.
  - Return confirmation showing total elapsed time.
  - 30-second animated auto-reset countdown with a manual "Next Student" reset button.
- **Audio Feedback**: Synthesized sounds (soft tap, cheerful celebration chime, error tone) via Web Audio API.
- **⚙️ Teacher Roster & Class Management**:
  - Secure Settings menu accessible via the top-right gear icon (Default Passcode: **`4500`**).
  - Manage classes modal allows teachers to be added, edited, or deleted across all 6 grades.
  - Saved permanently to browser `localStorage`.
- **Pre-Wired for Google Forms**:
  - Ready to connect to a Google Form response URL for recording signouts and returns in Google Sheets without needing Google Apps Script web apps.

---

## 🚀 Running Locally or on GitHub Pages

### Running Locally
Simply open `index.html` in any modern web browser (double-click the file or open with Google Chrome, Safari, Edge, or Firefox). No build tools, Node.js, or server required!

### Hosting on GitHub Pages
1. Push this directory to a GitHub repository (e.g. `eve-bathroom-pass`).
2. In GitHub, navigate to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. GitHub Pages will provide a live URL for classroom kiosks and tablets.

---

## 📋 Data Collection & Google Form Integration

In this edition, pass check-outs and check-ins are logged locally in the browser console.

To connect your Google Form:
1. Open `index.html` in your editor.
2. Locate the `GOOGLE_FORM_CONFIG` section around line 2240:
   ```javascript
   const GOOGLE_FORM_CONFIG = {
     enabled: false,
     formResponseUrl: '', // e.g. 'https://docs.google.com/forms/d/e/.../formResponse'
     entries: {
       passId: '',
       student1: '',
       student2: '',
       grade: '',
       teachers: '',
       passColor: '',
       timeOut: '',
       timeIn: '',
       duration: '',
       status: ''
     }
   };
   ```
3. Set `enabled: true`, provide your form's `formResponseUrl`, and map each field to its corresponding `entry.XXXXXXX` ID from your Google Form pre-filled link.
