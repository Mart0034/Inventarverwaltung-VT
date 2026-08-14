const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const db = require('./db');

const app = express();
app.use(express.json());

const BACKUP_TOKEN_FILE = path.join(db.DATA_DIR, 'backup-token.txt');
function getOrCreateBackupToken() {
  if (fs.existsSync(BACKUP_TOKEN_FILE)) {
    return fs.readFileSync(BACKUP_TOKEN_FILE, 'utf8').trim();
  }
  const token = crypto.randomBytes(24).toString('hex');
  fs.writeFileSync(BACKUP_TOKEN_FILE, token);
  return token;
}
const BACKUP_TOKEN = getOrCreateBackupToken();

const STATUS_LISTE = ['Verfügbar', 'Reserviert', 'Vermietet', 'Defekt', 'In Reparatur', 'Ausgemustert', 'Verloren'];
const INVENTAR_FIELDS = ['bez', 'hersteller', 'modell', 'serien', 'standort', 'parent', 'status', 'miete', 'pruef', 'letzte', 'naechste', 'notiz', 'cat'];

function catRow(row) {
  return { id: row.id, code: row.code, name: row.name, parent: row.parent };
}
function itemRow(row) {
  return { ...row, pruef: !!row.pruef, parent: row.parent || null };
}
function rentalRow(row) {
  return { ...row, items: JSON.parse(row.items), pack: JSON.parse(row.pack) };
}

function getFullState() {
  const categories = db.prepare('SELECT * FROM categories').all().map(catRow);
  const standorte = db.prepare('SELECT name FROM standorte ORDER BY sort_order').all().map(r => r.name);
  const settingsRows = db.prepare('SELECT * FROM settings').all();
  const schwellen = {};
  settingsRows.forEach(r => { schwellen[r.key] = parseInt(r.value, 10); });
  const inventar = db.prepare('SELECT * FROM inventar').all().map(itemRow);
  const vermietungen = db.prepare('SELECT * FROM vermietungen').all().map(rentalRow);
  return { categories, standorte, statusListe: STATUS_LISTE, schwellen, inventar, vermietungen, backupToken: BACKUP_TOKEN };
}

app.get('/api/state', (req, res) => {
  res.json(getFullState());
});

/* ---- backup ---- */

app.get('/api/backup', (req, res) => {
  const auth = req.headers.authorization || '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : req.query.token;
  if (!provided || provided !== BACKUP_TOKEN) {
    return res.status(403).json({ error: 'forbidden' });
  }
  // SQLite runs in WAL mode -- recent writes may still be sitting in the
  // -wal file rather than the main database file. Checkpoint first so the
  // exported file is actually complete and self-contained.
  db.pragma('wal_checkpoint(TRUNCATE)');
  res.download(path.join(db.DATA_DIR, 'fundus.db'));
});

/* ---- categories ---- */

app.post('/api/categories', (req, res) => {
  const { parent, name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const parentId = parent || null;
  if (parentId && !db.prepare('SELECT 1 FROM categories WHERE id = ?').get(parentId)) {
    return res.status(404).json({ error: 'parent not found' });
  }
  const siblings = db.prepare('SELECT code FROM categories WHERE parent IS ?').all(parentId);
  const nums = siblings.map(s => parseInt(s.code, 10)).filter(n => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  const code = String(next).padStart(parentId ? 2 : 3, '0');
  const id = 'cat-' + crypto.randomUUID().slice(0, 8);
  db.prepare('INSERT INTO categories (id, code, name, parent) VALUES (?, ?, ?, ?)').run(id, code, name, parentId);
  res.status(201).json(catRow({ id, code, name, parent: parentId }));
});

app.patch('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'not found' });
  const name = req.body.name !== undefined ? req.body.name : row.name;
  const code = req.body.code !== undefined ? req.body.code : row.code;
  db.prepare('UPDATE categories SET name = ?, code = ? WHERE id = ?').run(name, code, id);
  res.json(catRow({ ...row, name, code }));
});

/* ---- standorte ---- */

app.post('/api/standorte', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM standorte').get().m;
  try {
    db.prepare('INSERT INTO standorte (name, sort_order) VALUES (?, ?)').run(name.trim(), maxOrder + 1);
  } catch (e) {
    return res.status(409).json({ error: 'already exists' });
  }
  res.status(201).json({ name: name.trim() });
});

app.delete('/api/standorte/:name', (req, res) => {
  db.prepare('DELETE FROM standorte WHERE name = ?').run(req.params.name);
  res.status(204).end();
});

/* ---- settings ---- */

app.patch('/api/settings', (req, res) => {
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  if (req.body.gelb !== undefined) upsert.run('gelb', String(parseInt(req.body.gelb, 10) || 0));
  if (req.body.orange !== undefined) upsert.run('orange', String(parseInt(req.body.orange, 10) || 0));
  const settingsRows = db.prepare('SELECT * FROM settings').all();
  const schwellen = {};
  settingsRows.forEach(r => { schwellen[r.key] = parseInt(r.value, 10); });
  res.json(schwellen);
});

/* ---- inventar ---- */

app.post('/api/inventar', (req, res) => {
  const b = req.body;
  if (!b.inv || !b.bez || !b.cat) return res.status(400).json({ error: 'inv, bez, cat required' });
  if (db.prepare('SELECT 1 FROM inventar WHERE inv = ?').get(b.inv)) {
    return res.status(409).json({ error: 'duplicate inventory number' });
  }
  db.prepare(`
    INSERT INTO inventar (inv, cat, bez, hersteller, modell, serien, standort, parent, status, miete, pruef, letzte, naechste, notiz)
    VALUES (@inv, @cat, @bez, @hersteller, @modell, @serien, @standort, @parent, @status, @miete, @pruef, @letzte, @naechste, @notiz)
  `).run({
    inv: b.inv, cat: b.cat, bez: b.bez, hersteller: b.hersteller || '', modell: b.modell || '',
    serien: b.serien || '', standort: b.standort || '', parent: b.parent || null,
    status: b.status || 'Verfügbar', miete: b.miete || 0, pruef: b.pruef ? 1 : 0,
    letzte: b.letzte || null, naechste: b.naechste || null, notiz: b.notiz || ''
  });
  res.status(201).json(itemRow(db.prepare('SELECT * FROM inventar WHERE inv = ?').get(b.inv)));
});

app.patch('/api/inventar/:inv', (req, res) => {
  const row = db.prepare('SELECT * FROM inventar WHERE inv = ?').get(req.params.inv);
  if (!row) return res.status(404).json({ error: 'not found' });
  const updates = {};
  for (const f of INVENTAR_FIELDS) {
    if (req.body[f] !== undefined) updates[f] = f === 'pruef' ? (req.body[f] ? 1 : 0) : req.body[f];
  }
  const keys = Object.keys(updates);
  if (keys.length === 0) return res.json(itemRow(row));
  const setClause = keys.map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE inventar SET ${setClause} WHERE inv = @inv`).run({ ...updates, inv: req.params.inv });
  res.json(itemRow(db.prepare('SELECT * FROM inventar WHERE inv = ?').get(req.params.inv)));
});

/* ---- vermietungen ---- */

const VERMIETUNG_STATUSES = ['Reserviert', 'Aktiv', 'Abgeschlossen'];

app.patch('/api/vermietungen/:id', (req, res) => {
  const v = db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(req.params.id);
  if (!v) return res.status(404).json({ error: 'not found' });
  const { status } = req.body;
  if (!status || !VERMIETUNG_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'invalid status' });
  }
  db.prepare('UPDATE vermietungen SET status = ? WHERE id = ?').run(status, v.id);
  res.json(rentalRow(db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(v.id)));
});

app.post('/api/vermietungen', (req, res) => {
  const { kunde, von, bis, items } = req.body;
  if (!kunde || !von || !bis || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'kunde, von, bis, items required' });
  }
  const existing = db.prepare("SELECT id FROM vermietungen WHERE id LIKE 'V-%'").all();
  const nums = existing.map(r => parseInt(r.id.slice(2), 10)).filter(n => !isNaN(n));
  const id = 'V-' + ((nums.length ? Math.max(...nums) : 0) + 1);
  const pack = Object.fromEntries(items.map(i => [i, false]));

  const tx = db.transaction(() => {
    db.prepare('INSERT INTO vermietungen (id, kunde, von, bis, status, items, pack) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, kunde, von, bis, 'Reserviert', JSON.stringify(items), JSON.stringify(pack));
    const setStatus = db.prepare('UPDATE inventar SET status = ? WHERE inv = ?');
    items.forEach(inv => setStatus.run('Reserviert', inv));
  });
  tx();

  res.status(201).json(rentalRow(db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(id)));
});

app.post('/api/vermietungen/:id/start', (req, res) => {
  const v = db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(req.params.id);
  if (!v) return res.status(404).json({ error: 'not found' });
  const items = JSON.parse(v.items);
  const tx = db.transaction(() => {
    db.prepare('UPDATE vermietungen SET status = ? WHERE id = ?').run('Aktiv', v.id);
    const setStatus = db.prepare('UPDATE inventar SET status = ? WHERE inv = ?');
    items.forEach(inv => setStatus.run('Vermietet', inv));
  });
  tx();
  res.json(rentalRow(db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(v.id)));
});

app.post('/api/vermietungen/:id/return', (req, res) => {
  const v = db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(req.params.id);
  if (!v) return res.status(404).json({ error: 'not found' });
  const statuses = req.body.statuses || {};
  const items = JSON.parse(v.items);
  const tx = db.transaction(() => {
    db.prepare('UPDATE vermietungen SET status = ? WHERE id = ?').run('Abgeschlossen', v.id);
    const setStatus = db.prepare('UPDATE inventar SET status = ? WHERE inv = ?');
    items.forEach(inv => setStatus.run(statuses[inv] || 'Verfügbar', inv));
  });
  tx();
  res.json(rentalRow(db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(v.id)));
});

app.patch('/api/vermietungen/:id/pack', (req, res) => {
  const v = db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(req.params.id);
  if (!v) return res.status(404).json({ error: 'not found' });
  const { inv, checked } = req.body;
  const pack = JSON.parse(v.pack);
  pack[inv] = !!checked;
  db.prepare('UPDATE vermietungen SET pack = ? WHERE id = ?').run(JSON.stringify(pack), v.id);
  res.json(rentalRow({ ...v, pack: JSON.stringify(pack) }));
});

/* ---- static frontend ---- */

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Fundus läuft auf http://localhost:${PORT}`);
});
