const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'fundus.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    parent TEXT REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS standorte (
    name TEXT PRIMARY KEY,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS inventar (
    inv TEXT PRIMARY KEY,
    cat TEXT NOT NULL REFERENCES categories(id),
    bez TEXT NOT NULL,
    hersteller TEXT DEFAULT '',
    modell TEXT DEFAULT '',
    serien TEXT DEFAULT '',
    standort TEXT DEFAULT '',
    parent TEXT,
    status TEXT NOT NULL DEFAULT 'Verfügbar',
    miete REAL NOT NULL DEFAULT 0,
    pruef INTEGER NOT NULL DEFAULT 0,
    letzte TEXT,
    naechste TEXT,
    notiz TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS vermietungen (
    id TEXT PRIMARY KEY,
    kunde TEXT NOT NULL,
    von TEXT NOT NULL,
    bis TEXT NOT NULL,
    status TEXT NOT NULL,
    items TEXT NOT NULL,
    pack TEXT NOT NULL
  );
`);

function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM categories').get().n;
  if (count > 0) return;

  const insertCat = db.prepare('INSERT INTO categories (id, code, name, parent) VALUES (@id, @code, @name, @parent)');
  const categories = [
    { id: 'c-buehne', code: '001', name: 'Bühne & Rigging', parent: null },
    { id: 'c-buehne-traversen', code: '01', name: 'Traversen & Rigging', parent: 'c-buehne' },
    { id: 'c-buehne-motoren', code: '02', name: 'Motoren & Gurte', parent: 'c-buehne' },
    { id: 'c-ton', code: '002', name: 'Tontechnik', parent: null },
    { id: 'c-ton-mischpulte', code: '01', name: 'Mischpulte', parent: 'c-ton' },
    { id: 'c-ton-mikrofone', code: '02', name: 'Mikrofone', parent: 'c-ton' },
    { id: 'c-lautsprecher', code: '003', name: 'Lautsprecher', parent: null },
    { id: 'c-lautsprecher-aktiv', code: '01', name: 'Aktivboxen', parent: 'c-lautsprecher' },
    { id: 'c-lautsprecher-passiv', code: '02', name: 'Passivboxen', parent: 'c-lautsprecher' },
    { id: 'c-lautsprecher-sub', code: '03', name: 'Subwoofer', parent: 'c-lautsprecher' },
    { id: 'c-kabel', code: '004', name: 'Kabel', parent: null },
    { id: 'c-kabel-signal', code: '01', name: 'Signalkabel', parent: 'c-kabel' },
    { id: 'c-kabel-strom', code: '02', name: 'Stromkabel', parent: 'c-kabel' },
    { id: 'c-kabel-strom-outdoor', code: 'A', name: 'Outdoor-tauglich', parent: 'c-kabel-strom' },
    { id: 'c-kabel-multicore', code: '03', name: 'Multicore', parent: 'c-kabel' },
    { id: 'c-licht', code: '005', name: 'Lichttechnik', parent: null },
    { id: 'c-licht-moving', code: '01', name: 'Moving Heads', parent: 'c-licht' },
    { id: 'c-licht-par', code: '02', name: 'PAR-Scheinwerfer', parent: 'c-licht' },
    { id: 'c-licht-dimmer', code: '03', name: 'Dimmer & DMX', parent: 'c-licht' },
    { id: 'c-cases', code: '006', name: 'Cases & Transport', parent: null },
    { id: 'c-cases-flight', code: '01', name: 'Flightcases', parent: 'c-cases' },
    { id: 'c-cases-rack', code: '02', name: 'Rackcases', parent: 'c-cases' },
    { id: 'c-strom', code: '007', name: 'Stromverteilung', parent: null },
    { id: 'c-strom-verteiler', code: '01', name: 'Stromverteiler', parent: 'c-strom' },
    { id: 'c-sonstiges', code: '008', name: 'Sonstiges', parent: null },
    { id: 'c-sonstiges-werkzeug', code: '01', name: 'Werkzeug', parent: 'c-sonstiges' },
  ];
  const insertManyCats = db.transaction((rows) => { for (const r of rows) insertCat.run(r); });
  insertManyCats(categories);

  const insertStandort = db.prepare('INSERT INTO standorte (name, sort_order) VALUES (?, ?)');
  const insertManyStandorte = db.transaction((rows) => { rows.forEach((name, i) => insertStandort.run(name, i)); });
  insertManyStandorte(['Lager 1', 'Lager 2', 'Werkstatt', 'Fahrzeug 1', 'Veranstaltung']);

  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('gelb', '90');
  insertSetting.run('orange', '30');

  const insertItem = db.prepare(`
    INSERT INTO inventar (inv, cat, bez, hersteller, modell, serien, standort, parent, status, miete, pruef, letzte, naechste, notiz)
    VALUES (@inv, @cat, @bez, @hersteller, @modell, @serien, @standort, @parent, @status, @miete, @pruef, @letzte, @naechste, @notiz)
  `);
  const items = [
    { inv: '004.02.001', cat: 'c-kabel-strom', bez: 'Stromkabel 10m Schuko', hersteller: 'Sommer Cable', modell: '-', serien: '', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 4, pruef: 0, letzte: null, naechste: null, notiz: '' },
    { inv: '004.02.002', cat: 'c-kabel-strom', bez: 'Stromkabel 20m Schuko', hersteller: 'Sommer Cable', modell: '-', serien: '', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 5, pruef: 0, letzte: null, naechste: null, notiz: '' },
    { inv: '004.01.001', cat: 'c-kabel-signal', bez: 'XLR-Kabel 5m', hersteller: 'Cordial', modell: 'CPM 5 FM', serien: '', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 2, pruef: 0, letzte: null, naechste: null, notiz: '' },
    { inv: '004.01.002', cat: 'c-kabel-signal', bez: 'XLR-Kabel 10m', hersteller: 'Cordial', modell: 'CPM 10 FM', serien: '', standort: 'Werkstatt', parent: '006.01.001', status: 'Verfügbar', miete: 3, pruef: 0, letzte: null, naechste: null, notiz: '' },
    { inv: '005.01.001', cat: 'c-licht-moving', bez: 'Moving Head Beam 230', hersteller: 'Clay Paky', modell: 'Sharpy', serien: 'CP-3391', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 35, pruef: 1, letzte: '2025-07-01', naechste: '2026-07-01', notiz: '' },
    { inv: '005.01.002', cat: 'c-licht-moving', bez: 'Moving Head Beam 230', hersteller: 'Clay Paky', modell: 'Sharpy', serien: 'CP-3392', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 35, pruef: 1, letzte: '2025-09-05', naechste: '2026-09-05', notiz: '' },
    { inv: '005.02.001', cat: 'c-licht-par', bez: 'PAR LED Scheinwerfer', hersteller: 'Chauvet', modell: 'SlimPAR Pro', serien: 'CH-1187', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 12, pruef: 1, letzte: '2025-10-20', naechste: '2026-10-20', notiz: '' },
    { inv: '003.01.001', cat: 'c-lautsprecher-aktiv', bez: 'Aktivbox 12"', hersteller: 'HK Audio', modell: 'Linear 5 112 FA', serien: 'HK-9012', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 35, pruef: 0, letzte: null, naechste: null, notiz: '' },
    { inv: '003.01.002', cat: 'c-lautsprecher-aktiv', bez: 'Aktivbox 12"', hersteller: 'HK Audio', modell: 'Linear 5 112 FA', serien: 'HK-9013', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 35, pruef: 0, letzte: null, naechste: null, notiz: '' },
    { inv: '003.03.001', cat: 'c-lautsprecher-sub', bez: 'Subwoofer 18"', hersteller: 'HK Audio', modell: 'Linear 5 118 Sub', serien: 'HK-9101', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 45, pruef: 0, letzte: null, naechste: null, notiz: '' },
    { inv: '002.01.001', cat: 'c-ton-mischpulte', bez: 'Digitalmischpult 16-Kanal', hersteller: 'Behringer', modell: 'X32 Compact', serien: 'BG-5521', standort: 'Werkstatt', parent: null, status: 'Verfügbar', miete: 60, pruef: 0, letzte: null, naechste: null, notiz: '' },
    { inv: '001.01.001', cat: 'c-buehne-traversen', bez: 'Traverse 2m (Alu Truss)', hersteller: 'Prolyte', modell: 'H30V', serien: '', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 8, pruef: 0, letzte: null, naechste: null, notiz: '' },
    { inv: '001.02.001', cat: 'c-buehne-motoren', bez: 'Kettenzug 500kg', hersteller: 'ChainMaster', modell: 'BGV-C1', serien: 'CM-771', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 22, pruef: 1, letzte: '2025-08-25', naechste: '2026-08-25', notiz: '' },
    { inv: '007.01.001', cat: 'c-strom-verteiler', bez: 'Stromverteiler 32A CEE', hersteller: 'Kübler', modell: 'V32-6x16', serien: 'KB-330', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 18, pruef: 1, letzte: '2025-11-01', naechste: '2026-11-01', notiz: '' },
    { inv: '006.01.001', cat: 'c-cases-flight', bez: 'Flightcase 19" 12HE', hersteller: 'Thon', modell: 'Rack 12U', serien: '', standort: 'Werkstatt', parent: null, status: 'Verfügbar', miete: 6, pruef: 0, letzte: null, naechste: null, notiz: 'Enthält Kabelmaterial' },
    { inv: '008.01.001', cat: 'c-sonstiges-werkzeug', bez: 'Werkzeugkoffer Bühnentechnik', hersteller: 'Wera', modell: 'Kraftform Kompakt', serien: '', standort: 'Fahrzeug 1', parent: null, status: 'Verfügbar', miete: 0, pruef: 0, letzte: null, naechste: null, notiz: '' },
  ];
  const insertManyItems = db.transaction((rows) => { for (const r of rows) insertItem.run(r); });
  insertManyItems(items);

  const insertRental = db.prepare('INSERT INTO vermietungen (id, kunde, von, bis, status, items, pack) VALUES (@id, @kunde, @von, @bis, @status, @items, @pack)');
  const rentals = [
    { id: 'V-1', kunde: 'Hochzeit Müller', von: '2026-08-20', bis: '2026-08-22', status: 'Reserviert', items: JSON.stringify(['003.01.002', '004.02.002']), pack: JSON.stringify({ '003.01.002': false, '004.02.002': false }) },
    { id: 'V-2', kunde: 'Firmenfeier ABC GmbH', von: '2026-07-01', bis: '2026-07-03', status: 'Abgeschlossen', items: JSON.stringify(['003.01.001', '004.01.001']), pack: JSON.stringify({ '003.01.001': true, '004.01.001': true }) },
  ];
  const insertManyRentals = db.transaction((rows) => { for (const r of rows) insertRental.run(r); });
  insertManyRentals(rentals);
}

seedIfEmpty();

module.exports = db;
