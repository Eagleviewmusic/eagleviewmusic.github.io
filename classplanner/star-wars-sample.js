// The Star Wars class: a sample class a new ClassPlanner starts with, to show off every layout
// (rows, lines, circle, tables, the garden and band), special seating rules, attendance and grades.
// app.buildStarWarsClass() (script.js) turns this into a class. The seatings below were made by the
// app's own rule-keeping Random arrangement, so every special seating rule holds in every layout.
const STAR_WARS_SAMPLE = {
  name: 'Star Wars',

  // [full name, card name, last name, episodes (I–IX) they appear in, band instrument, skill 1–4]
  students: [
    ['Luke Skywalker', 'Luke', 'Skywalker', 'IV V VI VII VIII IX', 'horn', 4],
    ['Leia Organa', 'Leia', 'Organa', 'IV V VI VII VIII IX', 'violin1', 4],
    ['Han Solo', 'Han', 'Solo', 'IV V VI VII IX', 'tenorsax', 3],
    ['Anakin Skywalker', 'Anakin', 'Skywalker', 'I II III VI IX', 'timpani', 4],
    ['Obi-Wan Kenobi', 'Obi-Wan', 'Kenobi', 'I II III IV V VI IX', 'cello', 4],
    ['Padmé Amidala', 'Padmé', 'Amidala', 'I II III', 'harp', 4],
    ['Qui-Gon Jinn', 'Qui-Gon', 'Jinn', 'I III IX', 'englishhorn', 4],
    ['Darth Maul', 'Darth Maul', '', 'I', 'snare', 2],
    ['Count Dooku', 'Count Dooku', '', 'II III', 'viola', 3],
    ['Mace Windu', 'Mace', 'Windu', 'I II III', 'trombone', 4],
    ['Jango Fett', 'Jango', 'Fett', 'II', 'bassdrum', 2],
    ['Boba Fett', 'Boba', 'Fett', 'II V VI', 'aux', 2],
    ['Lando Calrissian', 'Lando', 'Calrissian', 'V VI IX', 'trumpet', 3],
    ['Poe Dameron', 'Poe', 'Dameron', 'VII VIII IX', 'piccolo', 3],
    ['Kylo Ren', 'Kylo', 'Ren', 'VII VIII IX', 'cymbals', 1],
    ['Jyn Erso', 'Jyn', 'Erso', '', 'oboe', 3],
    ['Cassian Andor', 'Cassian', 'Andor', '', 'bassclarinet', 3],
    ['Saw Gerrera', 'Saw', 'Gerrera', '', 'tuba', 2],
    ['Orson Krennic', 'Orson', 'Krennic', '', 'glockenspiel', 2],
    ['Tobias Beckett', 'Tobias', 'Beckett', '', 'bass', 2],
    ['Wilhuff Tarkin', 'Wilhuff', 'Tarkin', 'III IV', 'bassoon', 3],
    ['Sheev Palpatine', 'Sheev', 'Palpatine', 'I II III V VI IX', 'piano', 1],
    ['Wedge Antilles', 'Wedge', 'Antilles', 'IV V VI', 'clarinet', 4],
    ['Bail Organa', 'Bail', 'Organa', 'II III', 'euphonium', 3],
    ['Owen Lars', 'Owen', 'Lars', 'II III IV', 'contrabassoon', 2],
    ['Beru Lars', 'Beru', 'Lars', 'II III IV', 'flute', 4],
    ['Shmi Skywalker', 'Shmi', 'Skywalker', 'I II', 'piano', 3],
    ['Jar Jar Binks', 'Jar Jar', 'Binks', 'I II III', 'aux', 1],
    ['Nute Gunray', 'Nute', 'Gunray', 'I II III', 'violin2', 2],
    ['Mon Mothma', 'Mon', 'Mothma', 'VI', 'piano', 3],
    ['Maz Kanata', 'Maz', 'Kanata', 'VII VIII IX', 'marimba', 4],
    ['Rose Tico', 'Rose', 'Tico', 'VIII IX', 'xylophone', 3],
    ['Armitage Hux', 'Armitage', 'Hux', 'VII VIII IX', 'trumpet', 2],
    ['Zorii Bliss', 'Zorii', 'Bliss', 'IX', 'aux', 3],
    ['Biggs Darklighter', 'Biggs', 'Darklighter', 'IV', 'flugelhorn', 3],
    ['Plo Koon', 'Plo', 'Koon', 'I II III', 'flute', 3],
    ['Amilyn Holdo', 'Amilyn', 'Holdo', 'VIII', 'chimes', 3],
    ['Bib Fortuna', 'Bib', 'Fortuna', 'VI', 'percussion', 1]
  ],

  // One class a week, one per episode: present if they are in it
  dates: [
    ['I', 2026, 8, 10], ['II', 2026, 8, 17], ['III', 2026, 8, 24], ['IV', 2026, 8, 31], ['V', 2026, 9, 7],
    ['VI', 2026, 9, 14], ['VII', 2026, 9, 21], ['VIII', 2026, 9, 28], ['IX', 2026, 10, 5]
  ],

  // Special seating rules. Windows are on the room's left, the door on its right.
  places: {
    front: ['Anakin Skywalker', 'Orson Krennic', 'Shmi Skywalker', 'Jar Jar Binks', 'Mon Mothma', 'Maz Kanata', 'Rose Tico',
      'Leia Organa', 'Padmé Amidala', 'Wilhuff Tarkin', 'Armitage Hux', 'Amilyn Holdo'],
    back: ['Han Solo', 'Obi-Wan Kenobi', 'Darth Maul', 'Count Dooku', 'Jango Fett', 'Boba Fett', 'Kylo Ren', 'Cassian Andor',
      'Saw Gerrera', 'Sheev Palpatine'],
    outside: ['Darth Maul', 'Kylo Ren', 'Sheev Palpatine', 'Boba Fett', 'Jar Jar Binks', 'Amilyn Holdo', 'Poe Dameron'],
    left: ['Plo Koon', 'Jango Fett', 'Boba Fett'],
    right: ['Cassian Andor', 'Zorii Bliss', 'Owen Lars']
  },
  with: [
    ['Biggs Darklighter', 'Luke Skywalker'], ['Luke Skywalker', 'Wedge Antilles'], ['Wedge Antilles', 'Lando Calrissian'],
    ['Bail Organa', 'Leia Organa'], ['Leia Organa', 'Mon Mothma'],
    ['Padmé Amidala', 'Jar Jar Binks'],
    ['Anakin Skywalker', 'Shmi Skywalker'],
    ['Qui-Gon Jinn', 'Obi-Wan Kenobi'], ['Mace Windu', 'Plo Koon'],
    ['Jango Fett', 'Boba Fett'],
    ['Saw Gerrera', 'Jyn Erso'], ['Jyn Erso', 'Cassian Andor'],
    ['Wilhuff Tarkin', 'Armitage Hux'],
    ['Amilyn Holdo', 'Rose Tico'], ['Rose Tico', 'Maz Kanata'],
    ['Poe Dameron', 'Zorii Bliss']
  ],
  apart: [
    ['Luke Skywalker', 'Kylo Ren'], ['Luke Skywalker', 'Sheev Palpatine'],
    ['Leia Organa', 'Wilhuff Tarkin'], ['Leia Organa', 'Armitage Hux'], ['Leia Organa', 'Bib Fortuna'],
    ['Han Solo', 'Boba Fett'], ['Han Solo', 'Bib Fortuna'], ['Han Solo', 'Kylo Ren'], ['Han Solo', 'Tobias Beckett'], ['Han Solo', 'Lando Calrissian'],
    ['Anakin Skywalker', 'Sheev Palpatine'], ['Anakin Skywalker', 'Count Dooku'], ['Anakin Skywalker', 'Jar Jar Binks'], ['Anakin Skywalker', 'Padmé Amidala'],
    ['Obi-Wan Kenobi', 'Darth Maul'], ['Obi-Wan Kenobi', 'Count Dooku'], ['Obi-Wan Kenobi', 'Jango Fett'], ['Obi-Wan Kenobi', 'Owen Lars'],
    ['Padmé Amidala', 'Nute Gunray'], ['Padmé Amidala', 'Sheev Palpatine'],
    ['Qui-Gon Jinn', 'Darth Maul'], ['Qui-Gon Jinn', 'Nute Gunray'], ['Qui-Gon Jinn', 'Sheev Palpatine'],
    ['Darth Maul', 'Sheev Palpatine'],
    ['Mace Windu', 'Sheev Palpatine'], ['Mace Windu', 'Jango Fett'], ['Mace Windu', 'Boba Fett'],
    ['Lando Calrissian', 'Tobias Beckett'],
    ['Poe Dameron', 'Armitage Hux'], ['Poe Dameron', 'Amilyn Holdo'],
    ['Kylo Ren', 'Armitage Hux'],
    ['Jyn Erso', 'Orson Krennic'], ['Cassian Andor', 'Orson Krennic'],
    ['Saw Gerrera', 'Mon Mothma'],
    ['Orson Krennic', 'Wilhuff Tarkin'], ['Orson Krennic', 'Armitage Hux'],
    ['Bail Organa', 'Sheev Palpatine'], ['Shmi Skywalker', 'Sheev Palpatine'], ['Mon Mothma', 'Sheev Palpatine'],
    ['Jar Jar Binks', 'Nute Gunray'],
    ['Rose Tico', 'Armitage Hux']
  ],

  // Graded on a class day: only those present that day are marked. Style informal (✓ ★ − ✕ from
  // skill), points out of 10, or standards 1–4.
  grades: [
    ['Duel of the Fates Rhythms', 'Theory', 'points', 'II'],
    ['Cantina Band Ensemble', 'Instruments', 'informal', 'IV'],
    ['Imperial March Playing Test', 'Instruments', 'standards', 'V'],
    ['Across the Stars', 'Singing', 'standards', 'VI'],
    ['Binary Sunset Solo', 'Effort', 'informal', 'IX']
  ],

  // Seatings made by the app's rule-keeping Random arrangement (rows, lines, circle, tables; the
  // four tables stand where a teacher dragged them). Band is set by instrument: strings, woodwinds,
  // brass, then the percussion line.
  seating: {
    rows: [
      ["Orson Krennic", "Bail Organa", "Leia Organa", "Mon Mothma", "Armitage Hux", "Wilhuff Tarkin", "Owen Lars"],
      ["Amilyn Holdo", "Rose Tico", "Maz Kanata", "Anakin Skywalker", "Shmi Skywalker", "Padmé Amidala", "Jar Jar Binks"],
      ["Bib Fortuna", "Plo Koon", "Mace Windu", "Nute Gunray", "Zorii Bliss", "Poe Dameron"],
      ["Lando Calrissian", "Wedge Antilles", "Luke Skywalker", "Biggs Darklighter", "Tobias Beckett", "Beru Lars"],
      ["Boba Fett", "Jango Fett", "Han Solo", "Qui-Gon Jinn", "Obi-Wan Kenobi", "Kylo Ren"],
      ["Darth Maul", "Count Dooku", "Saw Gerrera", "Jyn Erso", "Cassian Andor", "Sheev Palpatine"]
    ],
    lines: [
      ["Maz Kanata", "Rose Tico", "Amilyn Holdo", "Orson Krennic", "Plo Koon", "Mace Windu", "Kylo Ren", "Boba Fett", "Jango Fett", "Darth Maul"],
      ["Bail Organa", "Leia Organa", "Mon Mothma", "Biggs Darklighter", "Luke Skywalker", "Wedge Antilles", "Lando Calrissian", "Count Dooku", "Nute Gunray", "Han Solo"],
      ["Anakin Skywalker", "Shmi Skywalker", "Beru Lars", "Owen Lars", "Tobias Beckett", "Bib Fortuna", "Saw Gerrera", "Jyn Erso", "Cassian Andor"],
      ["Armitage Hux", "Wilhuff Tarkin", "Padmé Amidala", "Jar Jar Binks", "Zorii Bliss", "Poe Dameron", "Qui-Gon Jinn", "Obi-Wan Kenobi", "Sheev Palpatine"]
    ],
    circle: ["Padmé Amidala", "Wilhuff Tarkin", "Armitage Hux", "Bail Organa", "Leia Organa", "Mon Mothma", "Anakin Skywalker", "Shmi Skywalker", "Beru Lars", "Owen Lars", "Poe Dameron", "Zorii Bliss", "Saw Gerrera", "Jyn Erso", "Cassian Andor", "Count Dooku", "Nute Gunray", "Obi-Wan Kenobi", "Qui-Gon Jinn", "Tobias Beckett", "Darth Maul", "Kylo Ren", "Jango Fett", "Boba Fett", "Sheev Palpatine", "Han Solo", "Biggs Darklighter", "Luke Skywalker", "Wedge Antilles", "Lando Calrissian", "Plo Koon", "Mace Windu", "Bib Fortuna", "Orson Krennic", "Maz Kanata", "Rose Tico", "Amilyn Holdo", "Jar Jar Binks"],
    half: [
      ["Cassian Andor", "Wilhuff Tarkin", "Maz Kanata", "Sheev Palpatine", "Rose Tico", "Plo Koon", "Tobias Beckett", "Saw Gerrera", "Jango Fett", "Amilyn Holdo", "Kylo Ren", "Armitage Hux", "Obi-Wan Kenobi", "Qui-Gon Jinn", "Boba Fett", "Jyn Erso", "Padmé Amidala", "Jar Jar Binks", "Bib Fortuna"],
      ["Lando Calrissian", "Darth Maul", "Poe Dameron", "Owen Lars", "Bail Organa", "Nute Gunray", "Orson Krennic", "Shmi Skywalker", "Mon Mothma", "Zorii Bliss", "Anakin Skywalker", "Han Solo", "Mace Windu", "Biggs Darklighter", "Beru Lars", "Wedge Antilles", "Luke Skywalker", "Count Dooku", "Leia Organa"]
    ],
    third: [
      ["Biggs Darklighter", "Qui-Gon Jinn", "Mace Windu", "Wedge Antilles", "Lando Calrissian", "Amilyn Holdo", "Plo Koon", "Jar Jar Binks", "Obi-Wan Kenobi", "Luke Skywalker", "Wilhuff Tarkin", "Armitage Hux", "Padmé Amidala"],
      ["Owen Lars", "Beru Lars", "Mon Mothma", "Han Solo", "Maz Kanata", "Leia Organa", "Zorii Bliss", "Anakin Skywalker", "Poe Dameron", "Shmi Skywalker", "Rose Tico", "Orson Krennic", "Bail Organa"],
      ["Sheev Palpatine", "Bib Fortuna", "Tobias Beckett", "Boba Fett", "Jyn Erso", "Count Dooku", "Nute Gunray", "Darth Maul", "Kylo Ren", "Jango Fett", "Saw Gerrera", "Cassian Andor"]
    ],
    fourth: [
      ["Maz Kanata", "Mon Mothma", "Padmé Amidala", "Rose Tico", "Amilyn Holdo", "Tobias Beckett", "Bail Organa", "Jar Jar Binks", "Leia Organa", "Orson Krennic"],
      ["Biggs Darklighter", "Beru Lars", "Shmi Skywalker", "Armitage Hux", "Wedge Antilles", "Lando Calrissian", "Anakin Skywalker", "Luke Skywalker", "Owen Lars", "Wilhuff Tarkin"],
      ["Plo Koon", "Count Dooku", "Sheev Palpatine", "Boba Fett", "Kylo Ren", "Darth Maul", "Nute Gunray", "Jango Fett", "Bib Fortuna"],
      ["Obi-Wan Kenobi", "Poe Dameron", "Cassian Andor", "Saw Gerrera", "Jyn Erso", "Qui-Gon Jinn", "Mace Windu", "Han Solo", "Zorii Bliss"]
    ],
    fifth: [
      ["Padmé Amidala", "Maz Kanata", "Armitage Hux", "Amilyn Holdo", "Plo Koon", "Rose Tico", "Jar Jar Binks", "Wilhuff Tarkin"],
      ["Anakin Skywalker", "Orson Krennic", "Mon Mothma", "Shmi Skywalker", "Owen Lars", "Beru Lars", "Leia Organa", "Bail Organa"],
      ["Count Dooku", "Boba Fett", "Nute Gunray", "Bib Fortuna", "Tobias Beckett", "Kylo Ren", "Darth Maul", "Jango Fett"],
      ["Poe Dameron", "Zorii Bliss", "Cassian Andor", "Jyn Erso", "Saw Gerrera", "Han Solo", "Sheev Palpatine"],
      ["Biggs Darklighter", "Lando Calrissian", "Luke Skywalker", "Obi-Wan Kenobi", "Qui-Gon Jinn", "Wedge Antilles", "Mace Windu"]
    ],
    sixth: [
      ["Amilyn Holdo", "Maz Kanata", "Jar Jar Binks", "Padmé Amidala", "Rose Tico", "Armitage Hux", "Wilhuff Tarkin"],
      ["Shmi Skywalker", "Beru Lars", "Bail Organa", "Anakin Skywalker", "Mon Mothma", "Orson Krennic", "Leia Organa"],
      ["Plo Koon", "Biggs Darklighter", "Lando Calrissian", "Luke Skywalker", "Mace Windu", "Wedge Antilles"],
      ["Poe Dameron", "Zorii Bliss", "Tobias Beckett", "Bib Fortuna", "Qui-Gon Jinn", "Owen Lars"],
      ["Count Dooku", "Boba Fett", "Darth Maul", "Nute Gunray", "Kylo Ren", "Jango Fett"],
      ["Cassian Andor", "Han Solo", "Obi-Wan Kenobi", "Jyn Erso", "Saw Gerrera", "Sheev Palpatine"]
    ],
    tables: {"fourth-0": {"x": 0, "y": 0}, "fourth-1": {"x": 614, "y": 30}, "fourth-2": {"x": 94, "y": 500}, "fourth-3": {"x": 520, "y": 530}},
    band: {
      rows: [
        ["Leia Organa", "Nute Gunray", "Count Dooku", "Tobias Beckett", "Obi-Wan Kenobi", "Padmé Amidala"],
        ["Poe Dameron", "Beru Lars", "Plo Koon", "Qui-Gon Jinn", "Jyn Erso", "Cassian Andor", "Wedge Antilles", "Wilhuff Tarkin"],
        ["Owen Lars", "Han Solo", "Luke Skywalker", "Biggs Darklighter", "Lando Calrissian", "Armitage Hux", "Mace Windu", "Bail Organa", "Saw Gerrera"]
      ],
      perc: ["Anakin Skywalker", "Darth Maul", "Jango Fett", "Boba Fett", "Zorii Bliss", "Jar Jar Binks", "Kylo Ren", "Orson Krennic", "Maz Kanata", "Rose Tico", "Amilyn Holdo", "Shmi Skywalker", "Mon Mothma", "Bib Fortuna", "Sheev Palpatine"]
    }
  }
};
