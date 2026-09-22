#!/usr/bin/env node
/* ==========================================================================
   build-teacher-index.js — rebuilds "Teacher Library/index.json"

   Run by .github/workflows/teacher-library-index.yml whenever anything in
   the Teacher Library folder changes (a file uploaded, replaced, deleted).
   The apps read index.json to learn what the teacher has published; GitHub
   Pages cannot list a folder, so this file is how they find out.

   Every *.json in the folder except index.json should be one EVM envelope
   (format "evm-item" — see "EVM Library/README.md" §7 in the Claude Apps
   folder), as downloaded from the Librarian. Anything else is reported
   and left out; it never stops the index being built.

   Writes the file only when the list of items actually changed, so the
   Action does not commit a new index on every run.

   Usage: node .github/scripts/build-teacher-index.js [folder]
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const folder = process.argv[2] || 'Teacher Library';
const indexPath = path.join(folder, 'index.json');

if (!fs.existsSync(folder)) {
  console.log(`No "${folder}" folder — nothing to index.`);
  process.exit(0);
}

const items = [];
const seen = new Map();          // app|id -> position in items
const problems = [];

fs.readdirSync(folder)
  .filter(name => name.toLowerCase().endsWith('.json') && name !== 'index.json')
  .sort()
  .forEach(name => {
    let env;
    try {
      env = JSON.parse(fs.readFileSync(path.join(folder, name), 'utf8'));
    } catch (e) {
      problems.push(`${name}: not readable JSON (${e.message})`);
      return;
    }
    if (!env || env.format !== 'evm-item' || !env.app || !env.id || !env.data) {
      problems.push(`${name}: not a Librarian file (needs format "evm-item", app, id and data)`);
      return;
    }
    const entry = {
      app: String(env.app),
      kind: String(env.kind || 'song'),
      id: String(env.id),
      title: String(env.title || 'Untitled'),
      updatedAt: Number(env.updatedAt || env.createdAt) || 0,
      path: name
    };
    // The book it stands in on the students' shelf (none: the apps' "More songs").
    if (env.book && String(env.book).trim()) entry.book = String(env.book).trim();
    const key = entry.app + '|' + entry.id;
    if (seen.has(key)) {
      // The same song twice under two file names: the newer one is published.
      const i = seen.get(key);
      problems.push(`${name} and ${items[i].path} are the same song; keeping the newer`);
      if (entry.updatedAt > items[i].updatedAt) items[i] = entry;
      return;
    }
    seen.set(key, items.length);
    items.push(entry);
  });

items.sort((a, b) => (a.book || '').localeCompare(b.book || '') || a.app.localeCompare(b.app) ||
  a.title.localeCompare(b.title) || a.id.localeCompare(b.id));

let previous = null;
try { previous = JSON.parse(fs.readFileSync(indexPath, 'utf8')); } catch (e) {}
const same = previous && JSON.stringify(previous.items) === JSON.stringify(items);

problems.forEach(p => console.log('warning: ' + p));
if (same) {
  console.log(`index.json already lists these ${items.length} item(s) — unchanged.`);
  process.exit(0);
}

fs.writeFileSync(indexPath, JSON.stringify({
  format: 'evm-index',
  formatVersion: 1,
  generatedAt: new Date().toISOString(),
  items
}, null, 2) + '\n');
console.log(`index.json written: ${items.length} item(s).`);
