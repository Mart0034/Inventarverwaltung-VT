const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const JSZip = require('jszip');
const db = require('./db');

const app = express();

const PHOTOS_DIR = path.join(db.DATA_DIR, 'photos');
if (!fs.existsSync(PHOTOS_DIR)) fs.mkdirSync(PHOTOS_DIR, { recursive: true });

// Requests through the Flamegrid reverse proxy arrive over plain HTTP with
// X-Forwarded-Proto: https set; the underlying port is also reachable
// directly over plain HTTP, bypassing HTTPS entirely. Redirect any request
// that looks like that raw, unencrypted path to the real HTTPS domain.
// Keyed off known production hostnames (not a generic "no forwarded-proto"
// rule) so local development is completely unaffected.
const PUBLIC_URL = 'https://fundus.lethalmc.com';
const INSECURE_HOSTS = ['162.141.166.3:25595', 'fundus.lethalmc.com'];
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (req.headers['x-forwarded-proto'] !== 'https' && INSECURE_HOSTS.includes(host)) {
    return res.redirect(301, PUBLIC_URL + req.originalUrl);
  }
  next();
});

app.use(express.json({ limit: '2mb' }));

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
const INVENTAR_FIELDS = ['bez', 'hersteller', 'modell', 'serien', 'standort', 'parent', 'status', 'miete', 'pruef', 'letzte', 'naechste', 'notiz', 'cat', 'menge'];
const CUSTOMER_FIELDS = ['name', 'firma', 'email', 'telefon', 'adresse', 'notiz'];

function catRow(row) {
  return { id: row.id, code: row.code, name: row.name, parent: row.parent };
}
function itemRow(row) {
  return { ...row, pruef: !!row.pruef, parent: row.parent || null };
}
function rentalRow(row) {
  return { ...row, items: JSON.parse(row.items), pack: JSON.parse(row.pack) };
}
function bundleRow(row) {
  const items = db.prepare('SELECT inv, menge FROM bundle_items WHERE bundle_id = ?').all(row.id);
  return { id: row.id, name: row.name, notiz: row.notiz, suggestedPrice: row.suggested_price, items };
}

function getFullState() {
  const categories = db.prepare('SELECT * FROM categories').all().map(catRow);
  const standorte = db.prepare('SELECT name FROM standorte ORDER BY sort_order').all().map(r => r.name);
  const settingsRows = db.prepare('SELECT * FROM settings').all();
  const schwellen = {};
  settingsRows.forEach(r => { schwellen[r.key] = parseInt(r.value, 10); });
  const inventar = db.prepare('SELECT * FROM inventar').all().map(itemRow);
  const vermietungen = db.prepare('SELECT * FROM vermietungen').all().map(rentalRow);
  const customers = db.prepare('SELECT * FROM customers ORDER BY name').all();
  const bundles = db.prepare('SELECT * FROM bundles ORDER BY name').all().map(bundleRow);
  return { categories, standorte, statusListe: STATUS_LISTE, schwellen, inventar, vermietungen, customers, bundles, backupToken: BACKUP_TOKEN };
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
    INSERT INTO inventar (inv, cat, bez, hersteller, modell, serien, standort, parent, status, miete, pruef, letzte, naechste, notiz, menge)
    VALUES (@inv, @cat, @bez, @hersteller, @modell, @serien, @standort, @parent, @status, @miete, @pruef, @letzte, @naechste, @notiz, @menge)
  `).run({
    inv: b.inv, cat: b.cat, bez: b.bez, hersteller: b.hersteller || '', modell: b.modell || '',
    serien: b.serien || '', standort: b.standort || '', parent: b.parent || null,
    status: b.status || 'Verfügbar', miete: b.miete || 0, pruef: b.pruef ? 1 : 0,
    letzte: b.letzte || null, naechste: b.naechste || null, notiz: b.notiz || '',
    menge: Math.max(1, parseInt(b.menge, 10) || 1)
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

// Optional small item photo. Client sends an already-downscaled data URL
// (see resizeImageDataUrl in app.js) so this never has to handle full-size
// camera uploads; the 2mb JSON body limit above is just a safety margin.
app.post('/api/inventar/:inv/photo', (req, res) => {
  const row = db.prepare('SELECT * FROM inventar WHERE inv = ?').get(req.params.inv);
  if (!row) return res.status(404).json({ error: 'not found' });
  const { dataUrl } = req.body;
  const match = /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/.exec(dataUrl || '');
  if (!match) return res.status(400).json({ error: 'expected a base64 image data URL' });
  const ext = match[1] === 'jpg' ? 'jpeg' : match[1];
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 800 * 1024) return res.status(413).json({ error: 'image too large' });
  if (row.foto) { try { fs.unlinkSync(path.join(PHOTOS_DIR, row.foto)); } catch (e) { /* already gone */ } }
  const filename = `${req.params.inv.replace(/[^a-zA-Z0-9.-]/g, '_')}-${Date.now()}.${ext}`;
  fs.writeFileSync(path.join(PHOTOS_DIR, filename), buffer);
  db.prepare('UPDATE inventar SET foto = ? WHERE inv = ?').run(filename, req.params.inv);
  res.json(itemRow(db.prepare('SELECT * FROM inventar WHERE inv = ?').get(req.params.inv)));
});

app.delete('/api/inventar/:inv/photo', (req, res) => {
  const row = db.prepare('SELECT * FROM inventar WHERE inv = ?').get(req.params.inv);
  if (!row) return res.status(404).json({ error: 'not found' });
  if (row.foto) { try { fs.unlinkSync(path.join(PHOTOS_DIR, row.foto)); } catch (e) { /* already gone */ } }
  db.prepare("UPDATE inventar SET foto = '' WHERE inv = ?").run(req.params.inv);
  res.json(itemRow(db.prepare('SELECT * FROM inventar WHERE inv = ?').get(req.params.inv)));
});

/* ---- customers ---- */

app.post('/api/customers', (req, res) => {
  const b = req.body;
  if (!b.name || !b.name.trim()) return res.status(400).json({ error: 'name required' });
  const id = 'k-' + crypto.randomUUID().slice(0, 8);
  db.prepare(`
    INSERT INTO customers (id, name, firma, email, telefon, adresse, notiz)
    VALUES (@id, @name, @firma, @email, @telefon, @adresse, @notiz)
  `).run({
    id, name: b.name.trim(), firma: b.firma || '', email: b.email || '',
    telefon: b.telefon || '', adresse: b.adresse || '', notiz: b.notiz || ''
  });
  res.status(201).json(db.prepare('SELECT * FROM customers WHERE id = ?').get(id));
});

app.patch('/api/customers/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  const updates = {};
  for (const f of CUSTOMER_FIELDS) {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  }
  const keys = Object.keys(updates);
  if (keys.length) {
    const setClause = keys.map(k => `${k} = @${k}`).join(', ');
    db.prepare(`UPDATE customers SET ${setClause} WHERE id = @id`).run({ ...updates, id: req.params.id });
  }
  res.json(db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id));
});

app.delete('/api/customers/:id', (req, res) => {
  db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  db.prepare('UPDATE vermietungen SET customer_id = NULL WHERE customer_id = ?').run(req.params.id);
  res.status(204).end();
});

/* ---- equipment bundles/sets ---- */

app.post('/api/bundles', (req, res) => {
  const b = req.body;
  if (!b.name || !b.name.trim()) return res.status(400).json({ error: 'name required' });
  if (!Array.isArray(b.items) || b.items.length === 0) return res.status(400).json({ error: 'items required' });
  const id = 'set-' + crypto.randomUUID().slice(0, 8);
  const tx = db.transaction(() => {
    db.prepare('INSERT INTO bundles (id, name, notiz, suggested_price) VALUES (?, ?, ?, ?)')
      .run(id, b.name.trim(), b.notiz || '', b.suggestedPrice != null && b.suggestedPrice !== '' ? Number(b.suggestedPrice) : null);
    const insertItem = db.prepare('INSERT INTO bundle_items (bundle_id, inv, menge) VALUES (?, ?, ?)');
    for (const it of b.items) {
      if (!db.prepare('SELECT 1 FROM inventar WHERE inv = ?').get(it.inv)) continue;
      insertItem.run(id, it.inv, Math.max(1, parseInt(it.menge, 10) || 1));
    }
  });
  tx();
  res.status(201).json(bundleRow(db.prepare('SELECT * FROM bundles WHERE id = ?').get(id)));
});

app.patch('/api/bundles/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM bundles WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  const b = req.body;
  const tx = db.transaction(() => {
    const name = b.name !== undefined ? b.name : row.name;
    const notiz = b.notiz !== undefined ? b.notiz : row.notiz;
    const suggestedPrice = b.suggestedPrice !== undefined
      ? (b.suggestedPrice != null && b.suggestedPrice !== '' ? Number(b.suggestedPrice) : null)
      : row.suggested_price;
    db.prepare('UPDATE bundles SET name = ?, notiz = ?, suggested_price = ? WHERE id = ?')
      .run(name, notiz, suggestedPrice, req.params.id);
    if (Array.isArray(b.items)) {
      db.prepare('DELETE FROM bundle_items WHERE bundle_id = ?').run(req.params.id);
      const insertItem = db.prepare('INSERT INTO bundle_items (bundle_id, inv, menge) VALUES (?, ?, ?)');
      for (const it of b.items) {
        if (!db.prepare('SELECT 1 FROM inventar WHERE inv = ?').get(it.inv)) continue;
        insertItem.run(req.params.id, it.inv, Math.max(1, parseInt(it.menge, 10) || 1));
      }
    }
  });
  tx();
  res.json(bundleRow(db.prepare('SELECT * FROM bundles WHERE id = ?').get(req.params.id)));
});

app.delete('/api/bundles/:id', (req, res) => {
  db.prepare('DELETE FROM bundles WHERE id = ?').run(req.params.id);
  res.status(204).end();
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

// Items with menge > 1 (bulk/quantity stock) don't get their inventar.status
// flipped by a single rental -- a booking might only take 2 of 12 cables, so
// the shared status field can't represent "partially out." Their real-time
// availability is instead computed client-side from overlapping rentals
// (see availabilityFor() in app.js). Only true one-off items (menge <= 1)
// still use the simple status pill.
function setStatusForNonBulkItems(items, status) {
  const setStatus = db.prepare('UPDATE inventar SET status = ? WHERE inv = ? AND menge <= 1');
  items.forEach(it => setStatus.run(status, it.inv));
}

function normalizeRentalItems(items) {
  return items
    .filter(it => it && it.inv)
    .map(it => ({ inv: it.inv, menge: Math.max(1, parseInt(it.menge, 10) || 1) }));
}

app.post('/api/vermietungen', (req, res) => {
  const { kunde, customerId, von, bis, items: rawItems } = req.body;
  if (!kunde || !von || !bis || !Array.isArray(rawItems) || rawItems.length === 0) {
    return res.status(400).json({ error: 'kunde, von, bis, items required' });
  }
  const items = normalizeRentalItems(rawItems);
  const existing = db.prepare("SELECT id FROM vermietungen WHERE id LIKE 'V-%'").all();
  const nums = existing.map(r => parseInt(r.id.slice(2), 10)).filter(n => !isNaN(n));
  const id = 'V-' + ((nums.length ? Math.max(...nums) : 0) + 1);
  const pack = Object.fromEntries(items.map(i => [i.inv, false]));

  const tx = db.transaction(() => {
    db.prepare('INSERT INTO vermietungen (id, kunde, customer_id, von, bis, status, items, pack) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, kunde, customerId || null, von, bis, 'Reserviert', JSON.stringify(items), JSON.stringify(pack));
    setStatusForNonBulkItems(items, 'Reserviert');
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
    setStatusForNonBulkItems(items, 'Vermietet');
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
    const setStatus = db.prepare('UPDATE inventar SET status = ? WHERE inv = ? AND menge <= 1');
    items.forEach(it => setStatus.run(statuses[it.inv] || 'Verfügbar', it.inv));
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

/* ---- data export (CSV / ZIP) ---- */

function csvEscape(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function toCsv(rows, columns) {
  const lines = rows.map(r => columns.map(c => csvEscape(r[c])).join(','));
  return '﻿' + [columns.join(','), ...lines].join('\r\n') + '\r\n';
}
function itemsAsText(items) {
  return items.map(it => `${it.inv} x${it.menge}`).join('; ');
}

const EXPORT_TABLES = {
  inventar: {
    columns: ['inv', 'cat', 'bez', 'hersteller', 'modell', 'serien', 'standort', 'parent', 'status', 'miete', 'pruef', 'letzte', 'naechste', 'notiz', 'menge', 'foto'],
    rows: () => db.prepare('SELECT * FROM inventar').all(),
  },
  vermietungen: {
    columns: ['id', 'kunde', 'customer_id', 'von', 'bis', 'status', 'artikel'],
    rows: () => db.prepare('SELECT * FROM vermietungen').all()
      .map(r => ({ ...r, artikel: itemsAsText(JSON.parse(r.items)) })),
  },
  customers: {
    columns: ['id', 'name', 'firma', 'email', 'telefon', 'adresse', 'notiz', 'created_at'],
    rows: () => db.prepare('SELECT * FROM customers').all(),
  },
  categories: {
    columns: ['id', 'code', 'name', 'parent'],
    rows: () => db.prepare('SELECT * FROM categories').all(),
  },
  standorte: {
    columns: ['name', 'sort_order'],
    rows: () => db.prepare('SELECT * FROM standorte').all(),
  },
  bundles: {
    columns: ['id', 'name', 'notiz', 'suggested_price', 'artikel'],
    rows: () => db.prepare('SELECT * FROM bundles').all()
      .map(b => ({ ...b, artikel: itemsAsText(db.prepare('SELECT inv, menge FROM bundle_items WHERE bundle_id = ?').all(b.id)) })),
  },
};

app.get('/api/export/csv/:table', (req, res) => {
  const def = EXPORT_TABLES[req.params.table];
  if (!def) return res.status(404).json({ error: 'unknown table' });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.table}.csv"`);
  res.send(toCsv(def.rows(), def.columns));
});

app.get('/api/export/all.zip', async (req, res) => {
  const zip = new JSZip();
  for (const [name, def] of Object.entries(EXPORT_TABLES)) {
    zip.file(`${name}.csv`, toCsv(def.rows(), def.columns));
  }
  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="fundus-export.zip"');
  res.send(buffer);
});

app.get('/api/export/vermietung/:id/csv', (req, res) => {
  const v = db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(req.params.id);
  if (!v) return res.status(404).json({ error: 'not found' });
  const items = JSON.parse(v.items);
  const pack = JSON.parse(v.pack);
  const rows = items.map(it => {
    const inv = db.prepare('SELECT * FROM inventar WHERE inv = ?').get(it.inv) || {};
    return {
      inv: it.inv, bezeichnung: inv.bez || '', menge: it.menge,
      miete_pro_tag: inv.miete || 0, gepackt: pack[it.inv] ? 'ja' : 'nein'
    };
  });
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.id}.csv"`);
  res.send(toCsv(rows, ['inv', 'bezeichnung', 'menge', 'miete_pro_tag', 'gepackt']));
});

/* ---- static frontend ---- */

app.use('/photos', express.static(PHOTOS_DIR));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Fundus läuft auf http://localhost:${PORT}`);
});
