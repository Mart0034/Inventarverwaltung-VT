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
    notiz TEXT DEFAULT '',
    menge INTEGER NOT NULL DEFAULT 1,
    foto TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    firma TEXT DEFAULT '',
    email TEXT DEFAULT '',
    telefon TEXT DEFAULT '',
    adresse TEXT DEFAULT '',
    notiz TEXT DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bundles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    notiz TEXT DEFAULT '',
    suggested_price REAL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bundle_items (
    bundle_id TEXT NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
    inv TEXT NOT NULL REFERENCES inventar(inv),
    menge INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (bundle_id, inv)
  );

  CREATE TABLE IF NOT EXISTS vermietungen (
    id TEXT PRIMARY KEY,
    kunde TEXT NOT NULL,
    customer_id TEXT REFERENCES customers(id),
    von TEXT NOT NULL,
    bis TEXT NOT NULL,
    status TEXT NOT NULL,
    items TEXT NOT NULL,
    pack TEXT NOT NULL,
    archiviert INTEGER NOT NULL DEFAULT 0
  );

  -- A tag is a lightweight cross-reference for "all the identical 5m XLR
  -- cables", filed under a Untergruppe (e.g. code "A" under 004.01 reads as
  -- 004.01.A). It never touches an item's own inv code -- those are already
  -- printed on physical labels and can't change -- it's purely an optional
  -- grouping items can opt into.
  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    cat TEXT NOT NULL REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS test_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS test_type_items (
    id TEXT PRIMARY KEY,
    test_type_id TEXT NOT NULL REFERENCES test_types(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  -- Picking test type(s) for an item snapshots their checklist items here,
  -- so each item has its own independently-editable, independently
  -- checkable-off copy -- editing the shared test_types template later
  -- doesn't retroactively change items that already picked it.
  CREATE TABLE IF NOT EXISTS inventar_checklist (
    id TEXT PRIMARY KEY,
    inv TEXT NOT NULL REFERENCES inventar(inv) ON DELETE CASCADE,
    text TEXT NOT NULL,
    checked INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0
  );
`);

// --- lightweight migrations for columns added after initial release ---
function ensureColumn(table, column, ddl) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
  if (!cols.includes(column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
}
ensureColumn('inventar', 'menge', "menge INTEGER NOT NULL DEFAULT 1");
ensureColumn('inventar', 'foto', "foto TEXT DEFAULT ''");
ensureColumn('inventar', 'tag', 'tag TEXT REFERENCES tags(id)');
ensureColumn('vermietungen', 'customer_id', 'customer_id TEXT REFERENCES customers(id)');
ensureColumn('vermietungen', 'archiviert', 'archiviert INTEGER NOT NULL DEFAULT 0');

// Same idea as ensureColumn, but for a settings row -- installs that
// existed before the PIN gate was added won't have one yet.
db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('pin', '1234')").run();

// Older rows store vermietungen.items as a plain JSON array of inv strings
// (["004.02.001", ...]); newer code needs [{inv, menge}, ...] to support
// quantity items. Normalize once so every row is in the new shape.
(function migrateVermietungItems() {
  const rows = db.prepare('SELECT id, items FROM vermietungen').all();
  const update = db.prepare('UPDATE vermietungen SET items = ? WHERE id = ?');
  const tx = db.transaction(() => {
    for (const row of rows) {
      const parsed = JSON.parse(row.items);
      if (parsed.length && typeof parsed[0] === 'string') {
        update.run(JSON.stringify(parsed.map((inv) => ({ inv, menge: 1 }))), row.id);
      }
    }
  });
  tx();
})();

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

  const insertTag = db.prepare('INSERT INTO tags (id, code, name, cat) VALUES (@id, @code, @name, @cat)');
  const tags = [
    { id: 't-xlr5', code: 'A', name: 'XLR-Kabel 5m', cat: 'c-kabel-signal' },
    { id: 't-xlr10', code: 'B', name: 'XLR-Kabel 10m', cat: 'c-kabel-signal' },
    { id: 't-strom10', code: 'A', name: 'Stromkabel 10m Schuko', cat: 'c-kabel-strom' },
    { id: 't-parled', code: 'A', name: 'PAR LED Scheinwerfer', cat: 'c-licht-par' },
    { id: 't-traverse2', code: 'A', name: 'Traverse 2m', cat: 'c-buehne-traversen' },
  ];
  const insertManyTags = db.transaction((rows) => { for (const r of rows) insertTag.run(r); });
  insertManyTags(tags);

  const insertStandort = db.prepare('INSERT INTO standorte (name, sort_order) VALUES (?, ?)');
  const insertManyStandorte = db.transaction((rows) => { rows.forEach((name, i) => insertStandort.run(name, i)); });
  insertManyStandorte(['Lager 1', 'Lager 2', 'Werkstatt', 'Fahrzeug 1', 'Veranstaltung']);

  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('gelb', '90');
  insertSetting.run('orange', '30');

  const insertItem = db.prepare(`
    INSERT INTO inventar (inv, cat, tag, bez, hersteller, modell, serien, standort, parent, status, miete, pruef, letzte, naechste, notiz, menge, foto)
    VALUES (@inv, @cat, @tag, @bez, @hersteller, @modell, @serien, @standort, @parent, @status, @miete, @pruef, @letzte, @naechste, @notiz, @menge, @foto)
  `);
  // Every physical item gets its own unique, permanent inventory number --
  // never a shared code with a stock count -- since these match numbers
  // already printed on real labels. Where several identical units exist
  // (e.g. three 5m XLR cables), each still gets its own code; the `tag`
  // just cross-references "these all are 5m XLR cables" for quick lookup.
  const items = [
    { inv: '004.01.001', cat: 'c-kabel-signal', tag: 't-xlr5', bez: 'XLR-Kabel 5m', hersteller: 'Cordial', modell: 'CPM 5 FM', serien: '', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 2, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '004.01.002', cat: 'c-kabel-signal', tag: 't-xlr5', bez: 'XLR-Kabel 5m', hersteller: 'Cordial', modell: 'CPM 5 FM', serien: '', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 2, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '004.01.003', cat: 'c-kabel-signal', tag: 't-xlr5', bez: 'XLR-Kabel 5m', hersteller: 'Cordial', modell: 'CPM 5 FM', serien: '', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 2, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '004.01.004', cat: 'c-kabel-signal', tag: 't-xlr10', bez: 'XLR-Kabel 10m', hersteller: 'Cordial', modell: 'CPM 10 FM', serien: '', standort: 'Werkstatt', parent: '006.01.001', status: 'Verfügbar', miete: 3, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '004.01.005', cat: 'c-kabel-signal', tag: 't-xlr10', bez: 'XLR-Kabel 10m', hersteller: 'Cordial', modell: 'CPM 10 FM', serien: '', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 3, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '004.02.001', cat: 'c-kabel-strom', tag: 't-strom10', bez: 'Stromkabel 10m Schuko', hersteller: 'Sommer Cable', modell: '-', serien: '', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 4, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '004.02.002', cat: 'c-kabel-strom', tag: 't-strom10', bez: 'Stromkabel 10m Schuko', hersteller: 'Sommer Cable', modell: '-', serien: '', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 4, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '004.02.003', cat: 'c-kabel-strom', tag: null, bez: 'Stromkabel 20m Schuko', hersteller: 'Sommer Cable', modell: '-', serien: '', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 5, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '005.01.001', cat: 'c-licht-moving', tag: null, bez: 'Moving Head Beam 230', hersteller: 'Clay Paky', modell: 'Sharpy', serien: 'CP-3391', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 35, pruef: 1, letzte: '2025-07-01', naechste: '2026-07-01', notiz: '', menge: 1, foto: '' },
    { inv: '005.01.002', cat: 'c-licht-moving', tag: null, bez: 'Moving Head Beam 230', hersteller: 'Clay Paky', modell: 'Sharpy', serien: 'CP-3392', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 35, pruef: 1, letzte: '2025-09-05', naechste: '2026-09-05', notiz: '', menge: 1, foto: '' },
    { inv: '005.02.001', cat: 'c-licht-par', tag: 't-parled', bez: 'PAR LED Scheinwerfer', hersteller: 'Chauvet', modell: 'SlimPAR Pro', serien: 'CH-1187', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 12, pruef: 1, letzte: '2025-10-20', naechste: '2026-10-20', notiz: '', menge: 1, foto: '' },
    { inv: '005.02.002', cat: 'c-licht-par', tag: 't-parled', bez: 'PAR LED Scheinwerfer', hersteller: 'Chauvet', modell: 'SlimPAR Pro', serien: 'CH-1188', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 12, pruef: 1, letzte: '2025-10-20', naechste: '2026-10-20', notiz: '', menge: 1, foto: '' },
    { inv: '003.01.001', cat: 'c-lautsprecher-aktiv', tag: null, bez: 'Aktivbox 12"', hersteller: 'HK Audio', modell: 'Linear 5 112 FA', serien: 'HK-9012', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 35, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '003.01.002', cat: 'c-lautsprecher-aktiv', tag: null, bez: 'Aktivbox 12"', hersteller: 'HK Audio', modell: 'Linear 5 112 FA', serien: 'HK-9013', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 35, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '003.03.001', cat: 'c-lautsprecher-sub', tag: null, bez: 'Subwoofer 18"', hersteller: 'HK Audio', modell: 'Linear 5 118 Sub', serien: 'HK-9101', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 45, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '002.01.001', cat: 'c-ton-mischpulte', tag: null, bez: 'Digitalmischpult 16-Kanal', hersteller: 'Behringer', modell: 'X32 Compact', serien: 'BG-5521', standort: 'Werkstatt', parent: null, status: 'Verfügbar', miete: 60, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '001.01.001', cat: 'c-buehne-traversen', tag: 't-traverse2', bez: 'Traverse 2m (Alu Truss)', hersteller: 'Prolyte', modell: 'H30V', serien: '', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 8, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '001.01.002', cat: 'c-buehne-traversen', tag: 't-traverse2', bez: 'Traverse 2m (Alu Truss)', hersteller: 'Prolyte', modell: 'H30V', serien: '', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 8, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
    { inv: '001.02.001', cat: 'c-buehne-motoren', tag: null, bez: 'Kettenzug 500kg', hersteller: 'ChainMaster', modell: 'BGV-C1', serien: 'CM-771', standort: 'Lager 2', parent: null, status: 'Verfügbar', miete: 22, pruef: 1, letzte: '2025-08-25', naechste: '2026-08-25', notiz: '', menge: 1, foto: '' },
    { inv: '007.01.001', cat: 'c-strom-verteiler', tag: null, bez: 'Stromverteiler 32A CEE', hersteller: 'Kübler', modell: 'V32-6x16', serien: 'KB-330', standort: 'Lager 1', parent: null, status: 'Verfügbar', miete: 18, pruef: 1, letzte: '2025-11-01', naechste: '2026-11-01', notiz: '', menge: 1, foto: '' },
    { inv: '006.01.001', cat: 'c-cases-flight', tag: null, bez: 'Flightcase 19" 12HE', hersteller: 'Thon', modell: 'Rack 12U', serien: '', standort: 'Werkstatt', parent: null, status: 'Verfügbar', miete: 6, pruef: 0, letzte: null, naechste: null, notiz: 'Enthält Kabelmaterial', menge: 1, foto: '' },
    { inv: '008.01.001', cat: 'c-sonstiges-werkzeug', tag: null, bez: 'Werkzeugkoffer Bühnentechnik', hersteller: 'Wera', modell: 'Kraftform Kompakt', serien: '', standort: 'Fahrzeug 1', parent: null, status: 'Verfügbar', miete: 0, pruef: 0, letzte: null, naechste: null, notiz: '', menge: 1, foto: '' },
  ];
  const insertManyItems = db.transaction((rows) => { for (const r of rows) insertItem.run(r); });
  insertManyItems(items);

  const insertCustomer = db.prepare('INSERT INTO customers (id, name, firma, email, telefon, adresse, notiz) VALUES (@id, @name, @firma, @email, @telefon, @adresse, @notiz)');
  const customers = [
    { id: 'k-mueller', name: 'Familie Müller', firma: '', email: 'mueller@example.com', telefon: '', adresse: '', notiz: '' },
    { id: 'k-abc', name: 'ABC GmbH', firma: 'ABC GmbH', email: 'events@abc-gmbh.example', telefon: '', adresse: '', notiz: '' },
  ];
  const insertManyCustomers = db.transaction((rows) => { for (const r of rows) insertCustomer.run(r); });
  insertManyCustomers(customers);

  const insertRental = db.prepare('INSERT INTO vermietungen (id, kunde, customer_id, von, bis, status, items, pack) VALUES (@id, @kunde, @customer_id, @von, @bis, @status, @items, @pack)');
  const rentals = [
    {
      id: 'V-1', kunde: 'Hochzeit Müller', customer_id: 'k-mueller', von: '2026-08-20', bis: '2026-08-22', status: 'Reserviert',
      items: JSON.stringify([{ inv: '003.01.002', menge: 1 }, { inv: '004.02.001', menge: 1 }, { inv: '004.02.002', menge: 1 }]),
      pack: JSON.stringify({ '003.01.002': false, '004.02.001': false, '004.02.002': false }),
    },
    {
      id: 'V-2', kunde: 'Firmenfeier ABC GmbH', customer_id: 'k-abc', von: '2026-07-01', bis: '2026-07-03', status: 'Abgeschlossen',
      items: JSON.stringify([{ inv: '003.01.001', menge: 1 }, { inv: '004.01.001', menge: 1 }, { inv: '004.01.002', menge: 1 }, { inv: '004.01.003', menge: 1 }]),
      pack: JSON.stringify({ '003.01.001': true, '004.01.001': true, '004.01.002': true, '004.01.003': true }),
    },
  ];
  const insertManyRentals = db.transaction((rows) => { for (const r of rows) insertRental.run(r); });
  insertManyRentals(rentals);

  const insertBundle = db.prepare('INSERT INTO bundles (id, name, notiz, suggested_price) VALUES (@id, @name, @notiz, @suggested_price)');
  const insertBundleItem = db.prepare('INSERT INTO bundle_items (bundle_id, inv, menge) VALUES (@bundle_id, @inv, @menge)');
  const tx = db.transaction(() => {
    insertBundle.run({ id: 'set-dj', name: 'Standard DJ-Setup', notiz: 'Aktivboxen, Sub, Kabel', suggested_price: 95 });
    [
      { bundle_id: 'set-dj', inv: '003.01.001', menge: 1 },
      { bundle_id: 'set-dj', inv: '003.01.002', menge: 1 },
      { bundle_id: 'set-dj', inv: '003.03.001', menge: 1 },
      { bundle_id: 'set-dj', inv: '004.02.001', menge: 1 },
      { bundle_id: 'set-dj', inv: '004.02.002', menge: 1 },
    ].forEach((r) => insertBundleItem.run(r));
  });
  tx();

  const insertTestType = db.prepare('INSERT INTO test_types (id, name, sort_order) VALUES (@id, @name, @sort_order)');
  const insertTestItem = db.prepare('INSERT INTO test_type_items (id, test_type_id, text, sort_order) VALUES (@id, @test_type_id, @text, @sort_order)');
  const testTypes = [
    {
      id: 'tt-dguv-v3-orts-veraenderlich', name: 'DGUV V3 (ortsveränderliche Geräte)', items: [
        'Sichtprüfung auf äußere Beschädigungen (Gehäuse, Kabel, Stecker)',
        'Prüfung der Kennzeichnung/Beschriftung',
        'Schutzleiterwiderstand messen (Schutzklasse I)',
        'Isolationswiderstand messen',
        'Schutzleiterstrom / Ersatzableitstrom messen',
        'Funktionsprüfung',
        'Prüfplakette mit Prüfdatum anbringen',
        'Ergebnis im Prüfprotokoll dokumentieren',
      ],
    },
    {
      id: 'tt-dguv-v3-orts-fest', name: 'DGUV V3 (ortsfeste Anlagen)', items: [
        'Sichtprüfung der Anlage und Verkabelung',
        'Isolationswiderstand messen',
        'Schutzleiterwiderstand/Durchgängigkeit prüfen',
        'Auslösung der Schutzeinrichtungen (RCD/FI) prüfen',
        'Funktionsprüfung der Anlage',
        'Messergebnisse dokumentieren',
        'Prüfplakette anbringen',
      ],
    },
    {
      id: 'tt-vde-0701-0702', name: 'VDE 0701-0702', items: [
        'Sichtprüfung auf Beschädigungen',
        'Schutzleiterwiderstand messen',
        'Isolationswiderstand messen',
        'Schutzleiterstrom/Berührungsstrom messen',
        'Funktionsprüfung',
        'Prüfplakette mit nächstem Prüftermin anbringen',
        'Prüfprotokoll erstellen',
      ],
    },
    {
      id: 'tt-dguv-v17-v18', name: 'DGUV V17/V18 (Veranstaltungstechnik)', items: [
        'Sichtprüfung der Aufbauten und Befestigungen',
        'Prüfung der Standsicherheit',
        'Prüfung der Rigging-Punkte und Traversen',
        'Prüfung der Absturzsicherungen',
        'Funktionsprüfung sicherheitsrelevanter Systeme',
        'Dokumentation im Prüfbuch',
      ],
    },
    {
      id: 'tt-sichtpruefung', name: 'Sichtprüfung', items: [
        'Äußerlich sichtbare Beschädigungen prüfen',
        'Vollständigkeit prüfen',
        'Kennzeichnung/Beschriftung prüfen',
        'Verschleißzustand beurteilen',
      ],
    },
    {
      id: 'tt-sachkundigenpruefung', name: 'Sachkundigenprüfung', items: [
        'Sichtprüfung auf Verschleiß und Beschädigung',
        'Funktionsprüfung der Sicherheitseinrichtungen',
        'Prüfung auf Vollständigkeit der Kennzeichnung',
        'Prüfung der Tragfähigkeit/Belastungsgrenzen',
        'Dokumentation im Prüfbuch mit Sachkundigen-Unterschrift',
      ],
    },
    {
      id: 'tt-lastaufnahmemittel', name: 'Lastaufnahmemittel (BGR 500)', items: [
        'Sichtprüfung auf Verformung, Rissbildung, Korrosion',
        'Prüfung der Kennzeichnung (Tragfähigkeit, Hersteller)',
        'Funktionsprüfung beweglicher Teile',
        'Prüfung von Anschlagpunkten und Verbindungselementen',
        'Belastungsprüfung/Tragfähigkeitskontrolle',
        'Dokumentation im Prüfbuch',
      ],
    },
  ];
  const insertManyTestTypes = db.transaction(() => {
    testTypes.forEach((tt, ttIdx) => {
      insertTestType.run({ id: tt.id, name: tt.name, sort_order: ttIdx });
      tt.items.forEach((text, itemIdx) => {
        insertTestItem.run({ id: `${tt.id}-${itemIdx}`, test_type_id: tt.id, text, sort_order: itemIdx });
      });
    });
  });
  insertManyTestTypes();

  // Demo: snapshot a couple of items' checklists from the relevant test
  // type(s), the way picking a type during item creation works.
  const insertChecklistItem = db.prepare('INSERT INTO inventar_checklist (id, inv, text, checked, sort_order) VALUES (@id, @inv, @text, @checked, @sort_order)');
  const seedChecklist = db.transaction((inv, testTypeIds) => {
    let order = 0;
    testTypeIds.forEach((ttId) => {
      const rows = db.prepare('SELECT text FROM test_type_items WHERE test_type_id = ? ORDER BY sort_order').all(ttId);
      rows.forEach((r) => {
        insertChecklistItem.run({ id: `${inv}-c${order}`, inv, text: r.text, checked: 0, sort_order: order });
        order += 1;
      });
    });
  });
  seedChecklist('005.01.001', ['tt-dguv-v3-orts-veraenderlich']);
  seedChecklist('005.01.002', ['tt-dguv-v3-orts-veraenderlich']);
  seedChecklist('005.02.001', ['tt-dguv-v3-orts-veraenderlich']);
  seedChecklist('005.02.002', ['tt-dguv-v3-orts-veraenderlich']);
  seedChecklist('001.02.001', ['tt-sachkundigenpruefung', 'tt-lastaufnahmemittel']);
  seedChecklist('007.01.001', ['tt-dguv-v3-orts-veraenderlich']);
}

seedIfEmpty();

module.exports = db;
module.exports.DATA_DIR = DATA_DIR;
