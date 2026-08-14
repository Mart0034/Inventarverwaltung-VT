
const TODAY = new Date();
TODAY.setHours(0,0,0,0);

const ICONS = {
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.6"/><rect x="13" y="3" width="8" height="8" rx="1.6"/><rect x="3" y="13" width="8" height="8" rx="1.6"/><rect x="13" y="13" width="8" height="8" rx="1.6"/></svg>',
  crate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,8 12,3 21,8 12,13 3,8"/><polyline points="3,8 3,17 12,22 21,17 21,8"/><line x1="12" y1="13" x2="12" y2="22"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 5-3.1 7.6-7 9-3.9-1.4-7-4-7-9V6l7-3z"/><polyline points="9,12.3 11,14.3 15,9.8"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2.2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3.1"/><circle cx="12" cy="12" r="8" stroke-dasharray="2.2 3.4"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="20" y1="20" x2="15.3" y2="15.3"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,5 8,12 15,19"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,12.5 9.5,18 20,6"/></svg>',
  empty:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8l8-4 8 4-8 4-8-4z"/><path d="M4 8v9l8 4 8-4V8" stroke-dasharray="2.4 3"/></svg>',
  chevRight:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,5 16,12 9,19"/></svg>',
  chevDown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5,9 12,16 19,9"/></svg>',
};

/* ---------- i18n ---------- */

const STRINGS = {
  de: {
    tab_start:'Start', tab_inventar:'Inventar', tab_pruefungen:'Prüfungen', tab_vermietungen:'Vermietung', tab_mehr:'Mehr',
    title_start:'Start', title_inventar:'Inventar', title_pruefungen:'Prüfungen', title_vermietungen:'Vermietungen', title_einstellungen:'Einstellungen',
    concept:'Konzept',
    start_welcome:'Willkommen zurück',
    start_sub:'{date} · {n} Artikel im Fundus',
    stat_total:'Gesamt', stat_available:'Verfügbar', stat_rented:'Vermietet', stat_due:'Prüfung fällig',
    due_inspections:'Fällige Prüfungen', view_all:'Alle ansehen',
    empty_inspections:'Keine anstehenden Prüfungen.',
    quick_actions:'Schnellzugriff',
    quick_search:'Inventar durchsuchen', quick_new_item:'Neues Inventar', quick_new_rental:'Neue Vermietung', quick_settings:'Einstellungen',
    inv_sub:'{n} von {m} Artikeln',
    search_placeholder:'Suche nach Inventarnummer, Bezeichnung, Hersteller …',
    chip_all:'Alle', chip_all_groups:'Alle Gruppen',
    empty_search:'Keine Treffer für diese Suche.',
    pruef_sub:'{n} prüfpflichtige Artikel',
    legend_far:'ab {n} Tagen', legend_within:'innerhalb {n} Tagen', legend_overdue:'überfällig',
    empty_pruef:'Keine prüfpflichtigen Artikel vorhanden.',
    verm_sub:'{n} Vorgänge',
    verm_meta:'{n} Artikel · {price}',
    empty_verm:'Noch keine Vermietungen angelegt.',
    settings_sub:'Kategorien, Standorte und Sprache anpassen',
    cat_title:'Hauptgruppen & Untergruppen',
    add_subcat:'+ Unterkategorie', add_maincat:'+ Hauptgruppe hinzufügen',
    standorte_title:'Standorte', standort_placeholder:'Neuer Standort …', add:'Hinzufügen',
    thresh_title:'Prüf-Warnschwellen', thresh_yellow:'Gelb ab (Tage vor Fälligkeit)', thresh_orange:'Orange ab (Tage vor Fälligkeit)',
    lang_title:'Sprache',
    data_title:'Daten & Sicherheit',
    data_p:'Die Daten liegen in einer Datenbank auf dem eigenen Server, erreichbar über eine gesicherte HTTPS-Verbindung. Aktuell ohne Login geschützt — jeder mit dem Link hat Zugriff.',
    backup_title:'Datensicherung',
    backup_p:'Tägliches automatisches Backup in ein privates GitHub-Repository, eingerichtet über eine geplante GitHub Action. Dieser Schlüssel schützt den Backup-Zugriff — nur zusammen mit der Action einrichten, nicht öffentlich teilen.',
    backup_token_label:'Backup-Schlüssel',
    backup_url_label:'Backup-Adresse',
    field_bez:'Bezeichnung', field_category:'Kategorie', change:'Ändern',
    field_hersteller:'Hersteller', field_modell:'Modell', field_serien:'Seriennummer', field_miete:'Mietpreis / Tag',
    field_status:'Status', field_standort:'Standort', field_parent:'Übergeordnetes Objekt', opt_none:'Kein',
    contains:'Enthält {n} Objekt(e):',
    section_pruef:'Prüfung', field_letzte:'Letzte Prüfung', field_naechste:'Nächste Prüfung',
    field_notiz:'Bemerkungen',
    sheet_new_item:'Neues Inventar', sheet_new_rental:'Neue Vermietung', sheet_return:'Rücknahme', sheet_packlist:'Packliste', sheet_pick_category:'Kategorie wählen',
    field_invnum:'Inventarnummer', invnum_placeholder:'z. B. 004.02.001', suggest:'Vorschlagen',
    invnum_hint:'Bestehende Nummer übernehmen oder automatisch vorschlagen lassen — Format bleibt immer HHH.UU.LLL.',
    bez_placeholder:'z. B. Moving Head Beam 230',
    field_modelltyp:'Modell / Typ', field_miete_eur:'Mietpreis / Tag (€)',
    check_pruefpflicht:'Prüfpflichtig (z. B. VDE-Prüfung)', field_intervall:'Prüfintervall (Monate)',
    btn_create_item:'Inventar anlegen',
    field_kunde:'Kunde', kunde_placeholder:'z. B. Musterkunde', field_von:'Von', field_bis:'Bis',
    choose_items:'Artikel wählen', n_selected:'{n} ausgewählt',
    not_available_range:'im gewählten Zeitraum nicht verfügbar', per_day:' / Tag',
    field_miettage:'Miettage', field_total:'Gesamtpreis',
    btn_create_rental:'Vermietung anlegen',
    label_period:'Zeitraum', label_articles:'Artikel', btn_open_packlist:'Packliste öffnen',
    btn_mark_handed_out:'Als ausgegeben markieren', btn_record_return:'Rücknahme erfassen',
    packed_of:'{n} / {m} eingepackt',
    btn_export_pdf:'Als PDF exportieren',
    toast_popup_blocked:'Popup blockiert – bitte Popups für diese Seite erlauben',
    pdf_days:'Tage',
    field_status_manual:'Status manuell ändern',
    field_status_manual_hint:'Zum Beispiel um eine versehentlich abgeschlossene Vermietung wieder zu öffnen.',
    rental_status_Reserviert:'Reserviert',
    rental_status_Aktiv:'Aktiv',
    rental_status_Abgeschlossen:'Abgeschlossen',
    return_intro:'Zustand je Artikel bei Rückgabe festlegen.', btn_complete_return:'Rücknahme abschließen',
    toast_need_inv_bez:'Bitte Inventarnummer und Bezeichnung angeben',
    toast_dup_inv:'Inventarnummer {inv} existiert bereits',
    toast_item_created:'Inventar {inv} angelegt',
    toast_rental_created:'Vermietung für {kunde} angelegt',
    toast_handed_out:'Als ausgegeben markiert',
    toast_return_done:'Rücknahme abgeschlossen',
    toast_sync_failed:'Änderung nicht gespeichert – Verbindung prüfen',
    boot_loading:'Wird geladen …',
    boot_error:'Verbindung zum Server fehlgeschlagen.',
    retry:'Erneut versuchen',
    status_Verfügbar:'Verfügbar', status_Reserviert:'Reserviert', status_Vermietet:'Vermietet',
    status_Defekt:'Defekt', 'status_In Reparatur':'In Reparatur', status_Ausgemustert:'Ausgemustert', status_Verloren:'Verloren',
    pruef_ok:'Unauffällig', pruef_warn:'Bald fällig', pruef_soon:'Bald fällig', pruef_crit:'Überfällig',
  },
  en: {
    tab_start:'Home', tab_inventar:'Inventory', tab_pruefungen:'Checks', tab_vermietungen:'Rentals', tab_mehr:'More',
    title_start:'Home', title_inventar:'Inventory', title_pruefungen:'Inspections', title_vermietungen:'Rentals', title_einstellungen:'Settings',
    concept:'Concept',
    start_welcome:'Welcome back',
    start_sub:'{date} · {n} items in Fundus',
    stat_total:'Total', stat_available:'Available', stat_rented:'Rented', stat_due:'Checks due',
    due_inspections:'Upcoming inspections', view_all:'View all',
    empty_inspections:'No upcoming inspections.',
    quick_actions:'Quick actions',
    quick_search:'Search inventory', quick_new_item:'New item', quick_new_rental:'New rental', quick_settings:'Settings',
    inv_sub:'{n} of {m} items',
    search_placeholder:'Search by inventory number, name, manufacturer …',
    chip_all:'All', chip_all_groups:'All groups',
    empty_search:'No matches for this search.',
    pruef_sub:'{n} items requiring inspection',
    legend_far:'{n}+ days out', legend_within:'within {n} days', legend_overdue:'overdue',
    empty_pruef:'No items requiring inspection.',
    verm_sub:'{n} rentals',
    verm_meta:'{n} items · {price}',
    empty_verm:'No rentals yet.',
    settings_sub:'Adjust categories, locations and language',
    cat_title:'Categories & subcategories',
    add_subcat:'+ Subcategory', add_maincat:'+ Add category',
    standorte_title:'Locations', standort_placeholder:'New location …', add:'Add',
    thresh_title:'Inspection warning thresholds', thresh_yellow:'Yellow from (days before due)', thresh_orange:'Orange from (days before due)',
    lang_title:'Language',
    data_title:'Data & security',
    data_p:'Data lives in a database on your own server, reachable over a secured HTTPS connection. Currently unprotected by a login — anyone with the link has access.',
    backup_title:'Backups',
    backup_p:'Automatic daily backup to a private GitHub repository, set up via a scheduled GitHub Action. This key protects backup access — set it up together with the Action only, don\'t share it publicly.',
    backup_token_label:'Backup key',
    backup_url_label:'Backup address',
    field_bez:'Name', field_category:'Category', change:'Change',
    field_hersteller:'Manufacturer', field_modell:'Model', field_serien:'Serial number', field_miete:'Rental price / day',
    field_status:'Status', field_standort:'Location', field_parent:'Parent object', opt_none:'None',
    contains:'Contains {n} object(s):',
    section_pruef:'Inspection', field_letzte:'Last inspection', field_naechste:'Next inspection',
    field_notiz:'Notes',
    sheet_new_item:'New item', sheet_new_rental:'New rental', sheet_return:'Return', sheet_packlist:'Packing list', sheet_pick_category:'Select category',
    field_invnum:'Inventory number', invnum_placeholder:'e.g. 004.02.001', suggest:'Suggest',
    invnum_hint:'Reuse an existing number or auto-suggest one — the format always stays HHH.UU.LLL.',
    bez_placeholder:'e.g. Moving Head Beam 230',
    field_modelltyp:'Model / type', field_miete_eur:'Rental price / day (€)',
    check_pruefpflicht:'Requires inspection (e.g. VDE test)', field_intervall:'Inspection interval (months)',
    btn_create_item:'Add item',
    field_kunde:'Customer', kunde_placeholder:'e.g. Sample Customer', field_von:'From', field_bis:'To',
    choose_items:'Select items', n_selected:'{n} selected',
    not_available_range:'not available for the selected period', per_day:' / day',
    field_miettage:'Rental days', field_total:'Total price',
    btn_create_rental:'Create rental',
    label_period:'Period', label_articles:'Items', btn_open_packlist:'Open packing list',
    btn_mark_handed_out:'Mark as handed out', btn_record_return:'Record return',
    packed_of:'{n} / {m} packed',
    btn_export_pdf:'Export as PDF',
    toast_popup_blocked:'Popup blocked – please allow popups for this site',
    pdf_days:'days',
    field_status_manual:'Change status manually',
    field_status_manual_hint:'e.g. to reopen a rental that was closed by mistake.',
    rental_status_Reserviert:'Reserved',
    rental_status_Aktiv:'Active',
    rental_status_Abgeschlossen:'Completed',
    return_intro:'Set the condition of each item on return.', btn_complete_return:'Complete return',
    toast_need_inv_bez:'Please enter an inventory number and name',
    toast_dup_inv:'Inventory number {inv} already exists',
    toast_item_created:'Item {inv} added',
    toast_rental_created:'Rental created for {kunde}',
    toast_handed_out:'Marked as handed out',
    toast_return_done:'Return completed',
    toast_sync_failed:'Change not saved – check connection',
    boot_loading:'Loading …',
    boot_error:'Could not reach the server.',
    retry:'Retry',
    status_Verfügbar:'Available', status_Reserviert:'Reserved', status_Vermietet:'Rented',
    status_Defekt:'Broken', 'status_In Reparatur':'In repair', status_Ausgemustert:'Retired', status_Verloren:'Lost',
    pruef_ok:'On track', pruef_warn:'Due soon', pruef_soon:'Due soon', pruef_crit:'Overdue',
  }
};

function t(key, vars){
  let s = (STRINGS[ui.lang] && STRINGS[ui.lang][key]) || STRINGS.de[key] || key;
  if(vars){ Object.keys(vars).forEach(k=>{ s = s.split('{'+k+'}').join(vars[k]); }); }
  return s;
}
function statusLabel(s){ return t('status_'+s); }

/* ---------- server sync ---------- */

async function api(method, path, body){
  const res = await fetch(path, {
    method,
    headers: body !== undefined ? {'Content-Type':'application/json'} : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if(!res.ok){
    let msg = res.statusText;
    try { const j = await res.json(); if(j.error) msg = j.error; } catch(e){}
    throw new Error(msg);
  }
  if(res.status === 204) return null;
  return res.json();
}

let state = null;
let loadError = false;

async function loadState(){
  try {
    state = await api('GET', '/api/state');
    loadError = false;
    if(!ui.expandedCats.size){
      state.categories.filter(c=>c.parent===null).forEach(c=>ui.expandedCats.add(c.id));
    }
  } catch(e){
    loadError = true;
  }
  render();
}

let lastSheetKey = null;

let ui = {
  tab:'start', sheetStack:[], search:'', fStatus:null, toast:null,
  newItemDraft:null, newRentalDraft:null, returnDraft:null,
  expandedCats: new Set(),
  lang: localStorage.getItem('fundus-lang') || 'de',
};

/* ---------- category tree helpers ---------- */

function catNode(id){ return state.categories.find(c=>c.id===id); }
function catChildren(parentId){ return state.categories.filter(c=>c.parent===parentId); }
function catRoots(){ return catChildren(null); }
function catPath(id){ const path=[]; let n=catNode(id); while(n){ path.unshift(n); n = n.parent ? catNode(n.parent) : null; } return path; }
function catPathNames(id){ return catPath(id).map(n=>n.name).join(' › '); }
function catPathCodes(id){ return catPath(id).map(n=>n.code).join('.'); }
function catRootOf(id){ const p=catPath(id); return p.length ? p[0].id : null; }
function descendantCatIds(id){ const out=[id]; catChildren(id).forEach(c=>out.push(...descendantCatIds(c.id))); return out; }
function firstLeafDefault(){
  const root = catRoots()[0];
  if(!root) return null;
  const kids = catChildren(root.id);
  return kids.length ? kids[0].id : root.id;
}
function toggleCatExpand(id){
  if(ui.expandedCats.has(id)) ui.expandedCats.delete(id); else ui.expandedCats.add(id);
}
function byInv(inv){ return state.inventar.find(i=>i.inv===inv); }
function fmtDate(iso){ if(!iso) return '–'; const d=new Date(iso+'T00:00:00'); return d.toLocaleDateString(ui.lang==='en'?'en-GB':'de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}); }
function fmtDateLong(d){ return d.toLocaleDateString(ui.lang==='en'?'en-GB':'de-DE',{weekday:'long',day:'2-digit',month:'long'}); }
function fmtEuro(n){ return (Math.round(n*100)/100).toLocaleString(ui.lang==='en'?'en-GB':'de-DE',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }
function diffDays(iso){ const d=new Date(iso+'T00:00:00'); return Math.round((d-TODAY)/86400000); }
function rentalDays(von,bis){ const a=new Date(von+'T00:00:00'), b=new Date(bis+'T00:00:00'); return Math.max(1, Math.round((b-a)/86400000)+1); }

function pruefStatus(item){
  if(!item.pruef || !item.naechste) return null;
  const d = diffDays(item.naechste);
  if(d < 0) return 'crit';
  if(d <= state.schwellen.orange) return 'soon';
  if(d <= state.schwellen.gelb) return 'warn';
  return 'ok';
}
function pruefLabel(item){
  const d = diffDays(item.naechste);
  if(ui.lang==='en'){
    if(d < 0) return `overdue by ${Math.abs(d)} day${Math.abs(d)===1?'':'s'}`;
    if(d === 0) return 'due today';
    return `due in ${d} day${d===1?'':'s'}`;
  }
  if(d < 0) return `überfällig seit ${Math.abs(d)} Tagen`;
  if(d === 0) return 'heute fällig';
  return `fällig in ${d} Tagen`;
}
function pruefStatusLabel(key){ return t('pruef_'+key); }

function statusPillClass(status){
  switch(status){
    case 'Verfügbar': return 'pill-ok';
    case 'Reserviert': return 'pill-warn';
    case 'Vermietet': return 'pill-rented';
    case 'Defekt': return 'pill-crit';
    case 'In Reparatur': return 'pill-soon';
    case 'Verloren': return 'pill-crit';
    default: return 'pill-off';
  }
}

function activeRentalsOverlapping(von,bis,excludeId){
  const a1=new Date(von+'T00:00:00'), a2=new Date(bis+'T00:00:00');
  return state.vermietungen.filter(v=>{
    if(v.id===excludeId) return false;
    if(v.status==='Abgeschlossen') return false;
    const b1=new Date(v.von+'T00:00:00'), b2=new Date(v.bis+'T00:00:00');
    return a1<=b2 && b1<=a2;
  });
}
function itemBookedInRange(inv,von,bis,excludeId){
  return activeRentalsOverlapping(von,bis,excludeId).some(v=>v.items.includes(inv));
}
function selectableItems(){
  return state.inventar.filter(i=>i.status!=='Ausgemustert' && i.status!=='Verloren' && i.status!=='Defekt');
}
function countItemsUnder(id){
  const ids = new Set(descendantCatIds(id));
  return selectableItems().filter(i=>ids.has(i.cat)).length;
}

function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------- sheet stack ---------- */

function openSheet(s){ ui.sheetStack = [s]; render(); }
function pushSheet(s){ ui.sheetStack.push(s); render(); }
function popSheet(){ ui.sheetStack.pop(); render(); }
function closeSheets(){ ui.sheetStack = []; ui.newItemDraft=null; ui.newRentalDraft=null; ui.returnDraft=null; lastSheetKey = null; render(); }
function topSheet(){ return ui.sheetStack[ui.sheetStack.length-1] || null; }

/* ---------- render ---------- */

function render(){
  const app = document.getElementById('app');
  if(!state){
    app.innerHTML = `
      <div class="app-shell">
        <div class="boot-screen">
          ${loadError ? `
            <p>${t('boot_error')}</p>
            <button class="btn btn-primary" data-action="retry-load" style="width:auto;padding:10px 20px;">${t('retry')}</button>
          ` : `<p>${t('boot_loading')}</p>`}
        </div>
      </div>`;
    app.addEventListener('click', onClick);
    return;
  }
  app.innerHTML = `
    <div class="app-shell">
      ${topbar()}
      <div class="screen">${screenBody()}</div>
      ${fab()}
      ${ui.toast?`<div class="toast">${esc(ui.toast)}</div>`:''}
      ${tabbar()}
      ${ui.sheetStack.length?sheetOverlay():''}
    </div>
  `;
  attachEvents();
}

function screenTitle(){
  return t('title_'+ui.tab);
}

function topbar(){
  return `
  <header class="topbar">
    <button class="brand" data-action="tab" data-tab="start" aria-label="Start">
      <span class="brand-mark">JR</span>
    </button>
    <div class="topbar-title">${screenTitle()}</div>
  </header>`;
}

function tabbar(){
  const tabs = [
    ['start','grid','tab_start'],
    ['inventar','crate','tab_inventar'],
    ['pruefungen','shield','tab_pruefungen'],
    ['vermietungen','calendar','tab_vermietungen'],
    ['einstellungen','gear','tab_mehr'],
  ];
  return `<nav class="tabbar">${tabs.map(([id,icon,key])=>`
    <button class="tab-btn ${ui.tab===id?'active':''}" data-action="tab" data-tab="${id}">
      ${ICONS[icon]}<span>${t(key)}</span>
    </button>`).join('')}</nav>`;
}

function fab(){
  if(ui.sheetStack.length) return '';
  if(ui.tab==='inventar') return `<button class="fab" data-action="open-new-item" aria-label="${t('quick_new_item')}">${ICONS.plus}</button>`;
  if(ui.tab==='vermietungen') return `<button class="fab" data-action="open-new-rental" aria-label="${t('quick_new_rental')}">${ICONS.plus}</button>`;
  return '';
}

function screenBody(){
  if(ui.tab==='start') return screenStart();
  if(ui.tab==='inventar') return screenInventar();
  if(ui.tab==='pruefungen') return screenPruefungen();
  if(ui.tab==='vermietungen') return screenVermietungen();
  if(ui.tab==='einstellungen') return screenEinstellungen();
  return '';
}

function screenStart(){
  const total = state.inventar.length;
  const verf = state.inventar.filter(i=>i.status==='Verfügbar').length;
  const vermietet = state.inventar.filter(i=>i.status==='Vermietet').length;
  const faellig = state.inventar.filter(i=>{const s=pruefStatus(i); return s==='crit'||s==='soon';}).length;

  const pruefItems = state.inventar.filter(i=>pruefStatus(i)).sort((a,b)=>diffDays(a.naechste)-diffDays(b.naechste)).slice(0,4);

  return `
    <h1 class="page-title">${t('start_welcome')}</h1>
    <p class="page-sub">${t('start_sub',{date:fmtDateLong(TODAY),n:total})}</p>

    <div class="stat-grid">
      <div class="stat-tile"><span class="stat-num mono">${total}</span><span class="stat-label">${t('stat_total')}</span></div>
      <div class="stat-tile"><span class="stat-num mono">${verf}</span><span class="stat-label">${t('stat_available')}</span></div>
      <div class="stat-tile"><span class="stat-num mono">${vermietet}</span><span class="stat-label">${t('stat_rented')}</span></div>
      <div class="stat-tile ${faellig>0?'attn':''}"><span class="stat-num mono">${faellig}</span><span class="stat-label">${t('stat_due')}</span></div>
    </div>

    <div class="section-head"><h2>${t('due_inspections')}</h2><button class="link-btn" data-action="tab" data-tab="pruefungen">${t('view_all')}</button></div>
    <div class="card-list">
      ${pruefItems.length? pruefItems.map(i=>itemCard(i,true)).join('') : `<div class="empty-state">${ICONS.empty}<p>${t('empty_inspections')}</p></div>`}
    </div>

    <div class="section-head"><h2>${t('quick_actions')}</h2></div>
    <div class="quick-grid">
      <button class="quick-tile" data-action="tab-search" data-tab="inventar">${ICONS.search}<span>${t('quick_search')}</span></button>
      <button class="quick-tile" data-action="open-new-item">${ICONS.plus}<span>${t('quick_new_item')}</span></button>
      <button class="quick-tile" data-action="open-new-rental">${ICONS.calendar}<span>${t('quick_new_rental')}</span></button>
      <button class="quick-tile" data-action="tab" data-tab="einstellungen">${ICONS.gear}<span>${t('quick_settings')}</span></button>
    </div>
  `;
}

function itemCard(i, showPruef){
  const ps = pruefStatus(i);
  const cls = showPruef && ps ? ps : '';
  const metaLine = showPruef && ps ? pruefLabel(i) : `${catPathNames(i.cat)} · ${esc(i.standort)}`;
  const pill = showPruef && ps
    ? `<span class="pill pill-${ps}">${pruefStatusLabel(ps)}</span>`
    : `<span class="pill ${statusPillClass(i.status)}">${statusLabel(i.status)}</span>`;
  return `
    <button class="item-card ${cls}" data-action="open-item" data-inv="${i.inv}">
      <div class="ic-body">
        <span class="inv-num mono">${i.inv}</span>
        <span class="ic-title">${esc(i.bez)}</span>
        <span class="ic-meta">${metaLine}</span>
      </div>
      ${pill}
    </button>`;
}

function countItemsUnderStatus(id, statusFilter){
  const ids = new Set(descendantCatIds(id));
  return state.inventar.filter(i=>ids.has(i.cat) && (!statusFilter || i.status===statusFilter)).length;
}

function renderInventarCatNode(node, depth, statusFilter){
  const children = catChildren(node.id);
  const directItems = state.inventar.filter(i=>i.cat===node.id && (!statusFilter || i.status===statusFilter));
  const totalCount = countItemsUnderStatus(node.id, statusFilter);
  if(totalCount===0) return '';
  const expanded = ui.expandedCats.has(node.id);
  return `
    <div class="cat-node" style="margin-left:${depth*10}px;">
      <button class="cat-row-toggle" data-action="toggle-cat-expand" data-id="${node.id}">
        ${expanded?ICONS.chevDown:ICONS.chevRight}
        <span class="cat-code mono">${esc(node.code)}</span>
        <span class="cat-name">${esc(node.name)}</span>
        <span class="cat-count">${totalCount}</span>
      </button>
      ${expanded ? `
        <div class="cat-children">
          ${directItems.map(i=>itemCard(i,false)).join('')}
          ${children.map(c=>renderInventarCatNode(c,depth+1,statusFilter)).join('')}
        </div>
      ` : ''}
    </div>`;
}

function screenInventar(){
  const q = ui.search.trim().toLowerCase();
  const statuses = ['Verfügbar','Reserviert','Vermietet','Defekt','In Reparatur'];
  const searchBar = `
    <div class="search-wrap">
      ${ICONS.search}
      <input id="search-input" class="search-input" type="text" placeholder="${t('search_placeholder')}" value="${esc(ui.search)}" />
    </div>
    <div class="chip-row">
      <button class="chip ${!ui.fStatus?'active':''}" data-action="filter-status" data-val="">${t('chip_all')}</button>
      ${statuses.map(s=>`<button class="chip ${ui.fStatus===s?'active':''}" data-action="filter-status" data-val="${s}">${statusLabel(s)}</button>`).join('')}
    </div>
  `;

  if(q){
    const items = state.inventar.filter(i=>{
      if(ui.fStatus && i.status!==ui.fStatus) return false;
      return [i.inv,i.bez,i.hersteller,i.modell,i.serien,i.standort].join(' ').toLowerCase().includes(q);
    });
    return `
      <h1 class="page-title">${t('title_inventar')}</h1>
      <p class="page-sub">${t('inv_sub',{n:items.length,m:state.inventar.length})}</p>
      ${searchBar}
      <div class="card-list">
        ${items.length? items.map(i=>itemCard(i,false)).join('') : `<div class="empty-state">${ICONS.empty}<p>${t('empty_search')}</p></div>`}
      </div>
    `;
  }

  const filteredTotal = state.inventar.filter(i=> !ui.fStatus || i.status===ui.fStatus).length;
  return `
    <h1 class="page-title">${t('title_inventar')}</h1>
    <p class="page-sub">${t('inv_sub',{n:filteredTotal,m:state.inventar.length})}</p>
    ${searchBar}
    <div class="cat-tree">
      ${filteredTotal? catRoots().map(r=>renderInventarCatNode(r,0,ui.fStatus)).join('') : `<div class="empty-state">${ICONS.empty}<p>${t('empty_search')}</p></div>`}
    </div>
  `;
}

function screenPruefungen(){
  const items = state.inventar.filter(i=>i.pruef).sort((a,b)=>diffDays(a.naechste)-diffDays(b.naechste));
  return `
    <h1 class="page-title">${t('title_pruefungen')}</h1>
    <p class="page-sub">${t('pruef_sub',{n:items.length})}</p>
    <div class="legend-row">
      <span class="legend-item"><span class="legend-dot" style="background:var(--status-ok)"></span>${t('legend_far',{n:state.schwellen.gelb})}</span>
      <span class="legend-item"><span class="legend-dot" style="background:var(--status-warn)"></span>${t('legend_within',{n:state.schwellen.gelb})}</span>
      <span class="legend-item"><span class="legend-dot" style="background:var(--status-soon)"></span>${t('legend_within',{n:state.schwellen.orange})}</span>
      <span class="legend-item"><span class="legend-dot" style="background:var(--status-crit)"></span>${t('legend_overdue')}</span>
    </div>
    <div class="card-list">
      ${items.length? items.map(i=>itemCard(i,true)).join('') : `<div class="empty-state">${ICONS.empty}<p>${t('empty_pruef')}</p></div>`}
    </div>
  `;
}

function rentalTotal(v){
  const days = rentalDays(v.von,v.bis);
  return v.items.reduce((sum,inv)=>{ const it=byInv(inv); return sum + (it?it.miete*days:0); },0);
}
function rentalStatusPill(status){
  const map = {Reserviert:'pill-warn',Aktiv:'pill-rented',Abgeschlossen:'pill-off'};
  return map[status]||'pill-off';
}
function rentalStatusLabel(status){ return t('rental_status_'+status) || status; }

function screenVermietungen(){
  const list = [...state.vermietungen].sort((a,b)=> a.status==='Abgeschlossen'?1:-1);
  return `
    <h1 class="page-title">${t('title_vermietungen')}</h1>
    <p class="page-sub">${t('verm_sub',{n:state.vermietungen.length})}</p>
    <div class="card-list">
      ${list.length? list.map(v=>`
        <button class="item-card" data-action="open-rental" data-id="${v.id}">
          <div class="ic-body">
            <span class="inv-num mono">${fmtDate(v.von)} – ${fmtDate(v.bis)}</span>
            <span class="ic-title">${esc(v.kunde)}</span>
            <span class="ic-meta">${t('verm_meta',{n:v.items.length,price:fmtEuro(rentalTotal(v))})}</span>
          </div>
          <span class="pill ${rentalStatusPill(v.status)}">${rentalStatusLabel(v.status)}</span>
        </button>
      `).join('') : `<div class="empty-state">${ICONS.empty}<p>${t('empty_verm')}</p></div>`}
    </div>
  `;
}

/* ---------- category tree renderers ---------- */

function renderCatEditNode(node, depth){
  const children = catChildren(node.id);
  const hasKids = children.length>0;
  const expanded = !hasKids || ui.expandedCats.has(node.id);
  return `
    <div class="cat-edit-node" style="margin-left:${depth*16}px;">
      <div class="cat-edit-row">
        ${hasKids ? `<button class="cat-toggle" data-action="toggle-cat-expand" data-id="${node.id}">${expanded?ICONS.chevDown:ICONS.chevRight}</button>` : `<span class="cat-toggle-spacer"></span>`}
        <input class="code mono" data-action="edit-cat-code" data-id="${node.id}" value="${esc(node.code)}" maxlength="4" />
        <input class="name" data-action="edit-cat-name" data-id="${node.id}" value="${esc(node.name)}" />
      </div>
      ${expanded ? `
        <div class="cat-edit-children">
          ${children.map(c=>renderCatEditNode(c,depth+1)).join('')}
          <button class="add-link" data-action="add-subcat" data-id="${node.id}">${t('add_subcat')}</button>
        </div>
      ` : ''}
    </div>`;
}

function renderCatSelectNode(node, depth, selectedId){
  const children = catChildren(node.id);
  const hasKids = children.length>0;
  const expanded = ui.expandedCats.has(node.id);
  const isSelected = node.id===selectedId;
  return `
    <div class="cat-node" style="margin-left:${depth*16}px;">
      <div class="cat-row ${isSelected?'selected':''}">
        ${hasKids ? `<button class="cat-toggle" data-action="toggle-cat-expand" data-id="${node.id}">${expanded?ICONS.chevDown:ICONS.chevRight}</button>` : `<span class="cat-toggle-spacer"></span>`}
        <button class="cat-label" data-action="pick-cat" data-id="${node.id}">
          <span class="cat-code mono">${esc(node.code)}</span>
          <span>${esc(node.name)}</span>
          ${isSelected?`<span class="cat-check">${ICONS.check}</span>`:''}
        </button>
      </div>
      ${hasKids && expanded ? `<div class="cat-children">${children.map(c=>renderCatSelectNode(c,depth+1,selectedId)).join('')}</div>` : ''}
    </div>`;
}
function renderCatSelectTree(selectedId){
  return catRoots().map(r=>renderCatSelectNode(r,0,selectedId)).join('');
}

function rentalItemRow(i,d){
  const days = rentalDays(d.von,d.bis);
  const busy = i.status==='Vermietet' || i.status==='Reserviert' || itemBookedInRange(i.inv,d.von,d.bis,null);
  const picked = d.items.includes(i.inv);
  const disabled = busy && !picked;
  return `
    <button class="item-card" style="${disabled?'opacity:.45;':''}" data-action="toggle-rental-item" data-inv="${i.inv}" ${disabled?'disabled':''}>
      <div class="pack-check ${picked?'checked':''}">${picked?ICONS.check:''}</div>
      <div class="ic-body">
        <span class="inv-num mono">${i.inv}</span>
        <span class="ic-title">${esc(i.bez)}</span>
        <span class="ic-meta">${disabled? t('not_available_range') : fmtEuro(i.miete)+t('per_day')}</span>
      </div>
    </button>`;
}

function renderRentalCatNode(node, depth, d){
  const children = catChildren(node.id);
  const directItems = selectableItems().filter(i=>i.cat===node.id);
  const totalCount = countItemsUnder(node.id);
  if(totalCount===0) return '';
  const expanded = ui.expandedCats.has(node.id);
  return `
    <div class="cat-node" style="margin-left:${depth*10}px;">
      <button class="cat-row-toggle" data-action="toggle-cat-expand" data-id="${node.id}">
        ${expanded?ICONS.chevDown:ICONS.chevRight}
        <span class="cat-code mono">${esc(node.code)}</span>
        <span class="cat-name">${esc(node.name)}</span>
        <span class="cat-count">${totalCount}</span>
      </button>
      ${expanded ? `
        <div class="cat-children">
          ${directItems.map(i=>rentalItemRow(i,d)).join('')}
          ${children.map(c=>renderRentalCatNode(c,depth+1,d)).join('')}
        </div>
      ` : ''}
    </div>`;
}

function screenEinstellungen(){
  return `
    <h1 class="page-title">${t('title_einstellungen')}</h1>
    <p class="page-sub">${t('settings_sub')}</p>

    <div class="settings-card">
      <h3>${t('cat_title')}</h3>
      ${catRoots().map(r=>renderCatEditNode(r,0)).join('')}
      <button class="add-link top" data-action="add-root-cat">${t('add_maincat')}</button>
    </div>

    <div class="settings-card">
      <h3>${t('standorte_title')}</h3>
      <div class="chip-edit-row">
        ${state.standorte.map(s=>`
          <span class="chip-edit">${esc(s)}<button data-action="remove-standort" data-name="${esc(s)}">${ICONS.close}</button></span>
        `).join('')}
      </div>
      <div class="add-inline">
        <input type="text" id="new-standort" placeholder="${t('standort_placeholder')}" />
        <button data-action="add-standort">${t('add')}</button>
      </div>
    </div>

    <div class="settings-card">
      <h3>${t('thresh_title')}</h3>
      <div class="thresh-row">
        <label>${t('thresh_yellow')}</label>
        <input type="number" min="1" class="mono" value="${state.schwellen.gelb}" data-action="set-schwelle" data-key="gelb" />
      </div>
      <div class="thresh-row">
        <label>${t('thresh_orange')}</label>
        <input type="number" min="1" class="mono" value="${state.schwellen.orange}" data-action="set-schwelle" data-key="orange" />
      </div>
    </div>

    <div class="settings-card">
      <h3>${t('lang_title')}</h3>
      <div class="lang-toggle">
        <button class="lang-btn ${ui.lang==='de'?'active':''}" data-action="set-lang" data-val="de">Deutsch</button>
        <button class="lang-btn ${ui.lang==='en'?'active':''}" data-action="set-lang" data-val="en">English</button>
      </div>
    </div>

    <div class="settings-card">
      <h3>${t('backup_title')}</h3>
      <p class="field-hint" style="margin-bottom:10px;">${t('backup_p')}</p>
      <div class="field">
        <label>${t('backup_url_label')}</label>
        <input type="text" class="mono" readonly value="${esc(backupUrl())}" onclick="this.select()" />
      </div>
      <div class="field">
        <label>${t('backup_token_label')}</label>
        <input type="text" class="mono" readonly value="${esc(state.backupToken||'')}" onclick="this.select()" />
      </div>
    </div>

    <div class="info-card">
      <h3>${t('data_title')}</h3>
      <p>${t('data_p')}</p>
    </div>
  `;
}
function backupUrl(){ return window.location.origin + '/api/backup'; }

/* ---------- sheets ---------- */

function sheetOverlay(){
  const s = topSheet();
  let title = '', body = '';
  if(s.type==='item'){ title = s.inv; body = itemDetailSheet(byInv(s.inv)); }
  else if(s.type==='new-item'){ title = t('sheet_new_item'); body = newItemSheet(); }
  else if(s.type==='rental'){ const v = state.vermietungen.find(x=>x.id===s.id); title = v.kunde; body = rentalDetailSheet(v); }
  else if(s.type==='new-rental'){ title = t('sheet_new_rental'); body = newRentalSheet(); }
  else if(s.type==='packlist'){ const v = state.vermietungen.find(x=>x.id===s.id); title = t('sheet_packlist'); body = packlistSheet(v); }
  else if(s.type==='return'){ const v = state.vermietungen.find(x=>x.id===s.id); title = t('sheet_return'); body = returnSheet(v); }
  else if(s.type==='pick-category'){ title = t('sheet_pick_category'); body = pickCategorySheet(s); }

  const canBack = ui.sheetStack.length>1;
  const key = s.type+':'+(s.id||s.inv||s.for||'');
  const isNew = key!==lastSheetKey;
  lastSheetKey = key;
  return `
    <div class="sheet-overlay" data-action="close-sheet-bg">
      <div class="sheet ${isNew?'sheet-enter':''}" data-stop="1">
        <div class="sheet-head">
          ${canBack? `<button class="sheet-back" data-action="back-sheet">${ICONS.back}</button>` : ''}
          <div style="flex:1;min-width:0;">
            <h2 class="mono" style="font-family:'Oswald Fundus',sans-serif;">${esc(title)}</h2>
          </div>
          <button class="icon-btn" data-action="close-sheet">${ICONS.close}</button>
        </div>
        <div class="sheet-body">${body}</div>
      </div>
    </div>`;
}

function itemDetailSheet(i){
  const ps = pruefStatus(i);
  const children = state.inventar.filter(x=>x.parent===i.inv);
  return `
    <div class="field">
      <label>${t('field_bez')}</label>
      <input type="text" data-action="edit-item" data-field="bez" data-inv="${i.inv}" value="${esc(i.bez)}" />
    </div>
    <span class="pill ${statusPillClass(i.status)}" style="margin-bottom:14px;display:inline-block;">${statusLabel(i.status)}</span>

    <div class="detail-grid">
      <div class="detail-item span2">
        <span class="dl-label">${t('field_category')}</span>
        <span class="dl-value" style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span>${catPathNames(i.cat)}</span>
          <button class="link-btn" data-action="open-cat-picker-item" data-inv="${i.inv}">${t('change')}</button>
        </span>
      </div>
      <div class="detail-item"><span class="dl-label">${t('field_hersteller')}</span><span class="dl-value">${esc(i.hersteller)||'–'}</span></div>
      <div class="detail-item"><span class="dl-label">${t('field_modell')}</span><span class="dl-value">${esc(i.modell)||'–'}</span></div>
      <div class="detail-item"><span class="dl-label">${t('field_serien')}</span><span class="dl-value mono">${esc(i.serien)||'–'}</span></div>
      <div class="detail-item"><span class="dl-label">${t('field_miete')}</span><span class="dl-value mono">${i.miete? fmtEuro(i.miete):'–'}</span></div>
    </div>

    <div class="field">
      <label>${t('field_status')}</label>
      <select data-action="edit-item" data-field="status" data-inv="${i.inv}">
        ${state.statusListe.map(s=>`<option value="${s}" ${s===i.status?'selected':''}>${statusLabel(s)}</option>`).join('')}
      </select>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field_standort')}</label>
        <select data-action="edit-item" data-field="standort" data-inv="${i.inv}">
          ${state.standorte.map(s=>`<option value="${s}" ${s===i.standort?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>${t('field_parent')}</label>
        <select data-action="edit-item" data-field="parent" data-inv="${i.inv}">
          <option value="">${t('opt_none')}</option>
          ${state.inventar.filter(x=>x.inv!==i.inv).map(x=>`<option value="${x.inv}" ${x.inv===i.parent?'selected':''}>${x.inv} – ${esc(x.bez)}</option>`).join('')}
        </select>
      </div>
    </div>

    ${children.length? `
      <div class="field-hint" style="margin-bottom:6px;">${t('contains',{n:children.length})}</div>
      <div class="contains-list">
        ${children.map(c=>`<div class="contains-row"><span class="mono">${c.inv}</span><span>${esc(c.bez)}</span></div>`).join('')}
      </div>
      <div class="divider"></div>
    ` : ''}

    ${i.pruef ? `
      <div class="section-head" style="margin-top:4px;"><h2>${t('section_pruef')}</h2><span class="pill pill-${ps}">${pruefStatusLabel(ps)}</span></div>
      <div class="detail-grid">
        <div class="detail-item"><span class="dl-label">${t('field_letzte')}</span><span class="dl-value mono">${fmtDate(i.letzte)}</span></div>
        <div class="detail-item"><span class="dl-label">${t('field_naechste')}</span><span class="dl-value mono">${fmtDate(i.naechste)}</span></div>
        <div class="detail-item span2"><span class="dl-label">${t('field_status')}</span><span class="dl-value">${pruefLabel(i)}</span></div>
      </div>
    ` : ''}

    <div class="field" style="margin-top:6px;">
      <label>${t('field_notiz')}</label>
      <textarea data-action="edit-item" data-field="notiz" data-inv="${i.inv}">${esc(i.notiz)}</textarea>
    </div>
  `;
}

function nextSuggestion(catId){
  const prefix = catPathCodes(catId) + '.';
  const nums = state.inventar.filter(i=>i.inv.startsWith(prefix)).map(i=>parseInt(i.inv.slice(prefix.length),10)).filter(n=>!isNaN(n));
  const next = (nums.length? Math.max(...nums):0) + 1;
  return prefix + String(next).padStart(3,'0');
}

function newItemSheet(){
  const d = ui.newItemDraft || (ui.newItemDraft = {
    inv:'', cat: firstLeafDefault(),
    bez:'', hersteller:'', modell:'', serien:'', standort: state.standorte[0], status:'Verfügbar',
    miete:'', pruef:false, letzte:'', intervall:12, notiz:''
  });
  return `
    <div class="field">
      <label>${t('field_category')}</label>
      <button type="button" class="cat-picker-btn" data-action="open-cat-picker-draft">
        <span>${catPathNames(d.cat)}</span>${ICONS.chevRight}
      </button>
    </div>
    <div class="field">
      <label>${t('field_invnum')}</label>
      <div class="inline-suggest">
        <input type="text" class="mono" data-action="draft-item" data-field="inv" placeholder="${t('invnum_placeholder')}" value="${esc(d.inv)}" />
        <button class="btn-suggest" data-action="suggest-inv">${t('suggest')}</button>
      </div>
      <span class="field-hint">${t('invnum_hint')}</span>
    </div>
    <div class="field">
      <label>${t('field_bez')}</label>
      <input type="text" data-action="draft-item" data-field="bez" value="${esc(d.bez)}" placeholder="${t('bez_placeholder')}" />
    </div>
    <div class="field-row">
      <div class="field"><label>${t('field_hersteller')}</label><input type="text" data-action="draft-item" data-field="hersteller" value="${esc(d.hersteller)}" /></div>
      <div class="field"><label>${t('field_modelltyp')}</label><input type="text" data-action="draft-item" data-field="modell" value="${esc(d.modell)}" /></div>
    </div>
    <div class="field-row">
      <div class="field"><label>${t('field_serien')}</label><input type="text" data-action="draft-item" data-field="serien" value="${esc(d.serien)}" /></div>
      <div class="field"><label>${t('field_miete_eur')}</label><input type="number" min="0" data-action="draft-item" data-field="miete" value="${esc(d.miete)}" /></div>
    </div>
    <div class="field">
      <label>${t('field_standort')}</label>
      <select data-action="draft-item" data-field="standort">
        ${state.standorte.map(s=>`<option ${s===d.standort?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="checkbox-field">
      <input type="checkbox" id="draft-pruef" data-action="draft-item" data-field="pruef" ${d.pruef?'checked':''} />
      <label for="draft-pruef">${t('check_pruefpflicht')}</label>
    </div>
    ${d.pruef? `
      <div class="field-row">
        <div class="field"><label>${t('field_letzte')}</label><input type="date" data-action="draft-item" data-field="letzte" value="${esc(d.letzte)}" /></div>
        <div class="field"><label>${t('field_intervall')}</label><input type="number" min="1" data-action="draft-item" data-field="intervall" value="${esc(d.intervall)}" /></div>
      </div>
    ` : ''}
    <div class="field">
      <label>${t('field_notiz')}</label>
      <textarea data-action="draft-item" data-field="notiz">${esc(d.notiz)}</textarea>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" data-action="save-new-item">${t('btn_create_item')}</button>
    </div>
  `;
}

function pickCategorySheet(s){
  const selectedId = s.for==='draft' ? ui.newItemDraft.cat : byInv(s.inv).cat;
  return `<div class="cat-tree">${renderCatSelectTree(selectedId)}</div>`;
}

function rentalDetailSheet(v){
  const days = rentalDays(v.von,v.bis);
  const total = rentalTotal(v);
  return `
    <div class="detail-grid">
      <div class="detail-item"><span class="dl-label">${t('label_period')}</span><span class="dl-value mono">${fmtDate(v.von)} – ${fmtDate(v.bis)}</span></div>
      <div class="detail-item"><span class="dl-label">${t('field_miettage')}</span><span class="dl-value mono">${days}</span></div>
      <div class="detail-item"><span class="dl-label">${t('field_status')}</span><span class="dl-value"><span class="pill ${rentalStatusPill(v.status)}">${rentalStatusLabel(v.status)}</span></span></div>
      <div class="detail-item"><span class="dl-label">${t('field_total')}</span><span class="dl-value mono">${fmtEuro(total)}</span></div>
    </div>
    <div class="divider"></div>
    <div class="section-head"><h2>${t('label_articles')}</h2></div>
    <div class="card-list">
      ${v.items.map(inv=>{ const it=byInv(inv); if(!it) return ''; return `
        <div class="item-card" style="cursor:default;">
          <div class="ic-body">
            <span class="inv-num mono">${it.inv}</span>
            <span class="ic-title">${esc(it.bez)}</span>
            <span class="ic-meta">${fmtEuro(it.miete)} × ${days} = ${fmtEuro(it.miete*days)}</span>
          </div>
        </div>`; }).join('')}
    </div>
    <div class="btn-row">
      <button class="btn btn-secondary" data-action="open-packlist" data-id="${v.id}">${t('btn_open_packlist')}</button>
    </div>
    ${v.status==='Reserviert'? `<div class="btn-row"><button class="btn btn-primary" data-action="rental-start" data-id="${v.id}">${t('btn_mark_handed_out')}</button></div>`:''}
    ${v.status==='Aktiv'? `<div class="btn-row"><button class="btn btn-primary" data-action="open-return" data-id="${v.id}">${t('btn_record_return')}</button></div>`:''}
    <div class="divider"></div>
    <div class="field">
      <label>${t('field_status_manual')}</label>
      <select data-action="edit-rental-status" data-id="${v.id}">
        <option value="Reserviert" ${v.status==='Reserviert'?'selected':''}>${t('rental_status_Reserviert')}</option>
        <option value="Aktiv" ${v.status==='Aktiv'?'selected':''}>${t('rental_status_Aktiv')}</option>
        <option value="Abgeschlossen" ${v.status==='Abgeschlossen'?'selected':''}>${t('rental_status_Abgeschlossen')}</option>
      </select>
      <span class="field-hint">${t('field_status_manual_hint')}</span>
    </div>
  `;
}

function newRentalSheet(){
  const d = ui.newRentalDraft || (ui.newRentalDraft = { kunde:'', von:'2026-08-20', bis:'2026-08-22', items:[] });
  const days = rentalDays(d.von,d.bis);
  const total = d.items.reduce((sum,inv)=>{ const it=byInv(inv); return sum+(it?it.miete*days:0); },0);
  return `
    <div class="field">
      <label>${t('field_kunde')}</label>
      <input type="text" data-action="draft-rental" data-field="kunde" value="${esc(d.kunde)}" placeholder="${t('kunde_placeholder')}" />
    </div>
    <div class="field-row">
      <div class="field"><label>${t('field_von')}</label><input type="date" data-action="draft-rental" data-field="von" value="${esc(d.von)}" /></div>
      <div class="field"><label>${t('field_bis')}</label><input type="date" data-action="draft-rental" data-field="bis" value="${esc(d.bis)}" /></div>
    </div>
    <div class="section-head"><h2>${t('choose_items')}</h2><span class="field-hint">${t('n_selected',{n:d.items.length})}</span></div>
    <div class="cat-tree">
      ${catRoots().map(r=>renderRentalCatNode(r,0,d)).join('')}
    </div>
    <div class="divider"></div>
    <div class="detail-grid">
      <div class="detail-item"><span class="dl-label">${t('field_miettage')}</span><span class="dl-value mono">${days}</span></div>
      <div class="detail-item"><span class="dl-label">${t('field_total')}</span><span class="dl-value mono">${fmtEuro(total)}</span></div>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" data-action="save-new-rental" ${(!d.kunde||!d.items.length)?'disabled style="opacity:.5;"':''}>${t('btn_create_rental')}</button>
    </div>
  `;
}

function packlistSheet(v){
  const checkedCount = Object.values(v.pack).filter(Boolean).length;
  return `
    <p class="page-sub" style="margin-bottom:10px;">${esc(v.kunde)} · ${fmtDate(v.von)} – ${fmtDate(v.bis)}</p>
    <button class="btn btn-secondary" data-action="export-pdf" data-id="${v.id}" style="margin-bottom:14px;">${t('btn_export_pdf')}</button>
    <div class="card-list" style="margin-bottom:6px;">
      ${v.items.map(inv=>{ const it=byInv(inv); if(!it) return ''; const done = !!v.pack[inv]; return `
        <div class="pack-row ${done?'checked':''}" data-action="toggle-pack" data-id="${v.id}" data-inv="${inv}">
          <div class="pack-check ${done?'checked':''}">${done?ICONS.check:''}</div>
          <div style="flex:1;">
            <div class="pr-title">${esc(it.bez)}</div>
            <div class="pr-sub mono">${it.inv}${it.serien?' · '+esc(it.serien):''}</div>
          </div>
        </div>`; }).join('')}
    </div>
    <p class="field-hint">${t('packed_of',{n:checkedCount,m:v.items.length})}</p>
  `;
}

function exportPackingListPdf(v){
  const days = rentalDays(v.von,v.bis);
  const todayIso = new Date().toISOString().slice(0,10);

  // Group items by their category, preserving first-appearance order.
  const groups = [];
  const groupIndex = {};
  v.items.forEach(inv=>{
    const it = byInv(inv);
    if(!it) return;
    const node = catNode(it.cat);
    const name = node ? node.name : '';
    if(!(name in groupIndex)){
      groupIndex[name] = groups.length;
      groups.push({ name, items: [] });
    }
    groups[groupIndex[name]].items.push(it);
  });

  const rows = groups.map((g,gi)=> g.items.map((it,idx)=>`
      <tr class="${idx===0?'group-start':''}">
        ${idx===0? `<td class="cat" rowspan="${g.items.length}">${esc(g.name)}</td>` : ''}
        <td class="item">${esc(it.bez)}</td>
        <td class="code mono">${esc(it.inv)}</td>
      </tr>`).join('')
  ).join('');

  const html = `<!doctype html>
<html lang="${ui.lang}">
<head>
<meta charset="utf-8">
<title>${esc(t('sheet_packlist'))} – ${esc(v.kunde)}</title>
<style>
  @page { margin: 20mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1c2036; margin: 0; padding: 24px; }
  .letterhead { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .mark { width: 28px; height: 28px; border-radius: 50%; background: #364786; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px; }
  .brand { font-weight: 700; font-size: 14px; letter-spacing: -.01em; }
  h1 { font-size: 20px; margin: 0 0 3px; letter-spacing: -.01em; }
  .sub { color: #5c6379; font-size: 13px; margin: 0 0 20px; }
  .meta { display: flex; gap: 36px; margin-bottom: 26px; }
  .meta div span { display:block; color:#5c6379; font-size: 10.5px; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 3px; }
  .meta div b { font-size: 13.5px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  td { padding: 4px 8px 4px 0; vertical-align: top; }
  td.cat { font-weight: 700; font-size: 13.5px; width: 32%; padding-right: 18px; }
  td.item { padding-top: 5px; padding-bottom: 5px; }
  td.code { text-align: right; color: #5c6379; white-space: nowrap; padding-right: 0; padding-top: 5px; padding-bottom: 5px; }
  tr.group-start td { padding-top: 16px; border-top: 1px solid #dadfea; }
  tr.group-start:first-child td { border-top: none; padding-top: 4px; }
  footer { margin-top: 30px; font-size: 10.5px; color: #9aa1b5; }
</style>
</head>
<body>
  <div class="letterhead"><span class="mark">JR</span><span class="brand">Fundus</span></div>
  <h1>${esc(t('sheet_packlist'))}</h1>
  <p class="sub">${esc(v.kunde)}</p>
  <div class="meta">
    <div><span>${esc(t('field_kunde'))}</span><b>${esc(v.kunde)}</b></div>
    <div><span>${esc(t('label_period'))}</span><b>${fmtDate(v.von)} – ${fmtDate(v.bis)} (${days} ${esc(t('pdf_days'))})</b></div>
  </div>
  <table>
    <tbody>${rows}</tbody>
  </table>
  <footer>Fundus · ${fmtDate(todayIso)}</footer>
</body>
</html>`;

  const win = window.open('', '_blank');
  if(!win){ showToast(t('toast_popup_blocked')); return; }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(()=>{ try{ win.print(); }catch(e){} }, 300);
}

function returnSheet(v){
  const d = ui.returnDraft || (ui.returnDraft = Object.fromEntries(v.items.map(inv=>[inv,'Verfügbar'])));
  return `
    <p class="page-sub" style="margin-bottom:10px;">${t('return_intro')}</p>
    ${v.items.map(inv=>{ const it=byInv(inv); return `
      <div class="field">
        <label>${it.inv} — ${esc(it.bez)}</label>
        <select data-action="draft-return" data-inv="${inv}">
          <option value="Verfügbar" ${d[inv]==='Verfügbar'?'selected':''}>${statusLabel('Verfügbar')}</option>
          <option value="Defekt" ${d[inv]==='Defekt'?'selected':''}>${statusLabel('Defekt')}</option>
          <option value="In Reparatur" ${d[inv]==='In Reparatur'?'selected':''}>${statusLabel('In Reparatur')}</option>
        </select>
      </div>`; }).join('')}
    <div class="btn-row">
      <button class="btn btn-primary" data-action="confirm-return" data-id="${v.id}">${t('btn_complete_return')}</button>
    </div>
  `;
}

function showToast(msg){
  ui.toast = msg;
  render();
  setTimeout(()=>{ ui.toast=null; render(); }, 1800);
}

/* ---------- events ---------- */

function attachEvents(){
  const app = document.getElementById('app');

  const search = document.getElementById('search-input');
  if(search){
    search.addEventListener('input', e=>{ ui.search = e.target.value; render(); requestAnimationFrame(()=>{ const s=document.getElementById('search-input'); if(s){ s.focus(); s.setSelectionRange(s.value.length,s.value.length); } }); });
  }
  const ns = document.getElementById('new-standort');
  if(ns){ ns.addEventListener('keydown', e=>{ if(e.key==='Enter'){ doAddStandort(); } }); }

  app.addEventListener('click', onClick);
  app.addEventListener('change', onChange);
}

function onClick(e){
  const bg = e.target.closest('[data-action="close-sheet-bg"]');
  const sheetInner = e.target.closest('[data-stop]');
  if(bg && !sheetInner){ closeSheets(); return; }

  const t2 = e.target.closest('[data-action]');
  if(!t2) return;
  const action = t2.dataset.action;

  switch(action){
    case 'retry-load':
      loadState(); break;
    case 'tab':
      ui.tab = t2.dataset.tab; ui.sheetStack=[]; render(); break;
    case 'tab-search':
      ui.tab = t2.dataset.tab; ui.sheetStack=[]; render();
      requestAnimationFrame(()=>document.getElementById('search-input')?.focus());
      break;
    case 'open-item':
      openSheet({type:'item', inv:t2.dataset.inv}); break;
    case 'open-new-item':
      ui.newItemDraft=null; openSheet({type:'new-item'}); break;
    case 'open-rental':
      openSheet({type:'rental', id:t2.dataset.id}); break;
    case 'open-new-rental':
      ui.newRentalDraft=null; openSheet({type:'new-rental'}); break;
    case 'open-packlist':
      pushSheet({type:'packlist', id:t2.dataset.id}); break;
    case 'open-return':
      ui.returnDraft=null; pushSheet({type:'return', id:t2.dataset.id}); break;
    case 'open-cat-picker-draft':
      pushSheet({type:'pick-category', for:'draft'}); break;
    case 'open-cat-picker-item':
      pushSheet({type:'pick-category', for:'item', inv:t2.dataset.inv}); break;
    case 'pick-cat': {
      const top = topSheet();
      const id = t2.dataset.id;
      if(top.for==='draft'){
        ui.newItemDraft.cat = id;
      } else {
        byInv(top.inv).cat = id;
        api('PATCH', `/api/inventar/${encodeURIComponent(top.inv)}`, {cat:id}).catch(()=>showToast(t('toast_sync_failed')));
      }
      popSheet(); break;
    }
    case 'back-sheet':
      popSheet(); break;
    case 'close-sheet':
      closeSheets(); break;
    case 'filter-status':
      ui.fStatus = t2.dataset.val || null; render(); break;
    case 'suggest-inv': {
      const d = ui.newItemDraft;
      d.inv = nextSuggestion(d.cat);
      render(); break;
    }
    case 'save-new-item':
      doSaveNewItem(); break;
    case 'toggle-rental-item': {
      const d = ui.newRentalDraft; const inv = t2.dataset.inv;
      const idx = d.items.indexOf(inv);
      if(idx>=0) d.items.splice(idx,1); else d.items.push(inv);
      render(); break;
    }
    case 'save-new-rental':
      doSaveNewRental(); break;
    case 'rental-start':
      doRentalStart(t2.dataset.id); break;
    case 'confirm-return':
      doConfirmReturn(t2.dataset.id); break;
    case 'toggle-pack': {
      const v = state.vermietungen.find(x=>x.id===t2.dataset.id);
      const inv = t2.dataset.inv;
      const checked = !v.pack[inv];
      v.pack[inv] = checked;
      render();
      api('PATCH', `/api/vermietungen/${v.id}/pack`, {inv, checked}).catch(()=>showToast(t('toast_sync_failed')));
      break;
    }
    case 'export-pdf': {
      const v = state.vermietungen.find(x=>x.id===t2.dataset.id);
      exportPackingListPdf(v);
      break;
    }
    case 'toggle-cat-expand':
      toggleCatExpand(t2.dataset.id); render(); break;
    case 'add-root-cat':
      doAddRootCat(); break;
    case 'add-subcat':
      doAddSubcat(t2.dataset.id); break;
    case 'add-standort':
      doAddStandort(); break;
    case 'remove-standort': {
      const name = t2.dataset.name;
      state.standorte = state.standorte.filter(s=>s!==name);
      render();
      api('DELETE', `/api/standorte/${encodeURIComponent(name)}`).catch(()=>showToast(t('toast_sync_failed')));
      break;
    }
    case 'set-lang':
      ui.lang = t2.dataset.val; localStorage.setItem('fundus-lang', ui.lang); render(); break;
  }
}

function onChange(e){
  const t2 = e.target.closest('[data-action]');
  if(!t2) return;
  const action = t2.dataset.action;
  if(action==='edit-item'){
    const item = byInv(t2.dataset.inv);
    const field = t2.dataset.field;
    const value = t2.type==='checkbox' ? t2.checked : t2.value;
    item[field] = value;
    if(field==='status') render();
    api('PATCH', `/api/inventar/${encodeURIComponent(item.inv)}`, {[field]: value}).catch(()=>showToast(t('toast_sync_failed')));
    return;
  }
  if(action==='draft-item'){
    const d = ui.newItemDraft;
    const field = t2.dataset.field;
    d[field] = t2.type==='checkbox' ? t2.checked : t2.value;
    if(field==='pruef') render();
    return;
  }
  if(action==='draft-rental'){
    const field = t2.dataset.field;
    ui.newRentalDraft[field] = t2.value;
    if(field==='von' || field==='bis') render();
    return;
  }
  if(action==='draft-return'){
    ui.returnDraft[t2.dataset.inv] = t2.value; return;
  }
  if(action==='edit-cat-name'){
    const node = catNode(t2.dataset.id);
    node.name = t2.value;
    api('PATCH', `/api/categories/${node.id}`, {name: node.name}).catch(()=>showToast(t('toast_sync_failed')));
    return;
  }
  if(action==='edit-cat-code'){
    const node = catNode(t2.dataset.id);
    node.code = t2.value;
    api('PATCH', `/api/categories/${node.id}`, {code: node.code}).catch(()=>showToast(t('toast_sync_failed')));
    return;
  }
  if(action==='set-schwelle'){
    const key = t2.dataset.key;
    state.schwellen[key] = parseInt(t2.value,10)||0;
    api('PATCH', '/api/settings', {[key]: state.schwellen[key]}).catch(()=>showToast(t('toast_sync_failed')));
    return;
  }
  if(action==='edit-rental-status'){
    const v = state.vermietungen.find(x=>x.id===t2.dataset.id);
    v.status = t2.value;
    render();
    api('PATCH', `/api/vermietungen/${v.id}`, {status: v.status}).catch(()=>showToast(t('toast_sync_failed')));
    return;
  }
}

async function doSaveNewItem(){
  const d = ui.newItemDraft;
  if(!d.inv || !d.bez){ showToast(t('toast_need_inv_bez')); return; }
  if(byInv(d.inv)){ showToast(t('toast_dup_inv',{inv:d.inv})); return; }
  const naechste = d.pruef && d.letzte ? addMonths(d.letzte, parseInt(d.intervall,10)||12) : null;
  const item = {
    inv:d.inv, cat:d.cat, bez:d.bez, hersteller:d.hersteller, modell:d.modell, serien:d.serien,
    standort:d.standort, parent:null, status:d.status||'Verfügbar', miete:parseFloat(d.miete)||0,
    pruef:!!d.pruef, letzte:d.letzte||null, naechste, notiz:d.notiz||''
  };
  state.inventar.push(item);
  closeSheets();
  showToast(t('toast_item_created',{inv:item.inv}));
  try {
    await api('POST', '/api/inventar', item);
  } catch(e){
    state.inventar = state.inventar.filter(i=>i.inv!==item.inv);
    showToast(e.message==='duplicate inventory number' ? t('toast_dup_inv',{inv:item.inv}) : t('toast_sync_failed'));
    render();
  }
}
function addMonths(iso,months){
  const d = new Date(iso+'T00:00:00'); d.setMonth(d.getMonth()+months);
  return d.toISOString().slice(0,10);
}

async function doSaveNewRental(){
  const d = ui.newRentalDraft;
  if(!d.kunde || !d.items.length) return;
  const kunde = d.kunde;
  const items = [...d.items];
  closeSheets();
  showToast(t('toast_rental_created',{kunde}));
  try {
    const v = await api('POST', '/api/vermietungen', {kunde, von:d.von, bis:d.bis, items});
    state.vermietungen.push(v);
    items.forEach(inv=>{ const it=byInv(inv); if(it) it.status='Reserviert'; });
    render();
  } catch(e){
    showToast(t('toast_sync_failed'));
    loadState();
  }
}

async function doRentalStart(id){
  const v = state.vermietungen.find(x=>x.id===id);
  v.status='Aktiv';
  v.items.forEach(inv=>{ const it=byInv(inv); if(it) it.status='Vermietet'; });
  showToast(t('toast_handed_out'));
  render();
  try { await api('POST', `/api/vermietungen/${id}/start`); }
  catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}

async function doConfirmReturn(id){
  const v = state.vermietungen.find(x=>x.id===id);
  const d = ui.returnDraft;
  v.items.forEach(inv=>{ const it=byInv(inv); if(it) it.status = d[inv] || 'Verfügbar'; });
  v.status='Abgeschlossen';
  ui.returnDraft=null;
  closeSheets();
  showToast(t('toast_return_done'));
  try { await api('POST', `/api/vermietungen/${id}/return`, {statuses:d}); }
  catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}

async function doAddRootCat(){
  const name = ui.lang==='en' ? 'New category' : 'Neue Hauptgruppe';
  try {
    const node = await api('POST', '/api/categories', {parent:null, name});
    state.categories.push(node);
    ui.expandedCats.add(node.id);
    render();
  } catch(e){ showToast(t('toast_sync_failed')); }
}
async function doAddSubcat(parentId){
  const name = ui.lang==='en' ? 'New subcategory' : 'Neue Unterkategorie';
  try {
    const node = await api('POST', '/api/categories', {parent:parentId, name});
    state.categories.push(node);
    ui.expandedCats.add(parentId);
    ui.expandedCats.add(node.id);
    render();
  } catch(e){ showToast(t('toast_sync_failed')); }
}
async function doAddStandort(){
  const inp = document.getElementById('new-standort');
  if(!inp || !inp.value.trim()) return;
  const name = inp.value.trim();
  try {
    await api('POST', '/api/standorte', {name});
    state.standorte.push(name);
    render();
  } catch(e){ showToast(t('toast_sync_failed')); }
}

loadState();
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible' && state) loadState(); });
window.addEventListener('focus', ()=>{ if(state) loadState(); });

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('/sw.js').catch(()=>{}); });
}
