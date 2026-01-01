const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const listPath = path.join(dataDir, '_list.json');
const outDir = path.join(__dirname, '..', 'pages', 'api');
const outPath = path.join(outDir, 'list.json');

function safeTagify(item) {
  const tags = [];
  if (item.difficulty != null) tags.push(String(item.difficulty));
  if (Array.isArray(item.creators)) tags.push(...item.creators);
  return tags;
}

function makeId(name, id) {
  // deterministic-ish id for static export
  return `${name.replace(/\s+/g, '-')}-${id}`;
}

if (!fs.existsSync(listPath)) {
  console.error('Could not find', listPath);
  process.exit(1);
}

const names = JSON.parse(fs.readFileSync(listPath, 'utf8'));
const out = [];

names.forEach((filename, idx) => {
  const file = path.join(dataDir, `${filename}.json`);
  if (!fs.existsSync(file)) return;
  try {
    const item = JSON.parse(fs.readFileSync(file, 'utf8'));

    const obj = {
      id: makeId(item.name || filename, item.id || idx + 1),
      name: item.name || filename,
      position: idx + 1,
      publisher_id: null,
      points: item.difficulty != null ? item.difficulty * 1000 : null,
      legacy: false,
      level_id: item.id || null,
      two_player: false,
      tags: safeTagify(item),
      description: item.verification || '',
      song: item.song || null,
      edel_enjoyment: item.enjoyment != null ? item.enjoyment : null,
      is_edel_pending: false,
      gddl_tier: null,
      nlw_tier: null
    };

    out.push(obj);
  } catch (e) {
    // ignore parse errors
  }
});

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', outPath);
