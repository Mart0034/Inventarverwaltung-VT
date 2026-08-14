
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
    delete:'Löschen',
    confirm_delete_cat:'Diese Kategorie wirklich löschen?',
    toast_cat_has_children:'Enthält noch Unterkategorien — erst verschieben oder löschen',
    toast_cat_has_items:'Enthält noch Artikel — erst verschieben oder löschen',
    toast_cat_has_tags:'Enthält noch Tags — erst löschen',
    tag_code_placeholder:'Code, z. B. A', tag_name_placeholder:'Name, z. B. XLR-Kabel 5m',
    confirm_delete_tag:'Diesen Tag wirklich löschen? Zugeordnete Artikel behalten ihre eigene Nummer.',
    field_tag:'Tag (optional)', opt_no_tag:'— Kein Tag —',
    field_test_types:'Prüfarten', field_checklist_preview:'Checkliste (Vorschau)', field_checklist:'Checkliste',
    checklist_empty:'Noch keine Checklisten-Einträge.', checklist_extra_placeholder:'Weiterer Punkt …',
    test_types_title:'Prüfarten', test_types_p:'Prüfarten mit ihrer Standard-Checkliste. Beim Anlegen eines prüfpflichtigen Artikels lassen sich passende Prüfarten auswählen — ihre Checkliste wird übernommen und lässt sich individuell ergänzen.',
    test_type_name_placeholder:'Neue Prüfart …',
    confirm_delete_test_type:'Diese Prüfart wirklich löschen? Bereits angelegte Artikel behalten ihre Checkliste.',
    btn_archive:'Archivieren', btn_unarchive:'Aus Archiv holen',
    btn_delete_rental:'Vermietung löschen', btn_delete_item:'Artikel löschen',
    nav_archive:'Archiv', nav_active_rentals:'Aktuelle',
    sort_by:'Sortieren nach', sort_date_asc:'Datum (aufsteigend)', sort_date_desc:'Datum (absteigend)',
    sort_kunde:'Kunde (A–Z)', sort_status:'Status', sort_preis:'Preis (höchster zuerst)',
    empty_archive:'Keine archivierten Vermietungen.',
    confirm_delete_rental:'Diese Vermietung wirklich löschen?', toast_rental_deleted:'Vermietung gelöscht',
    confirm_delete_item:'Diesen Artikel wirklich löschen?', toast_item_deleted:'Artikel {inv} gelöscht',
    toast_rental_archived:'Vermietung archiviert', toast_rental_unarchived:'Vermietung wiederhergestellt',
    standorte_title:'Standorte', standort_placeholder:'Neuer Standort …', add:'Hinzufügen',
    thresh_title:'Prüf-Warnschwellen', thresh_yellow:'Gelb ab (Tage vor Fälligkeit)', thresh_orange:'Orange ab (Tage vor Fälligkeit)',
    pin_title:'Zugangs-PIN', pin_p:'Diese PIN schützt die ganze Website. Einmal im Browser entsperrt, bleibt der Zugriff gespeichert.',
    pin_field:'4-stellige PIN', pin_lock_now:'Jetzt sperren (dieses Gerät)',
    toast_pin_invalid:'PIN muss genau 4 Ziffern haben', toast_pin_saved:'PIN geändert',
    lang_title:'Sprache',
    theme_title:'Design', theme_system:'System', theme_light:'Hell', theme_dark:'Dunkel',
    data_title:'Daten & Sicherheit',
    data_p:'Die Daten liegen in einer Datenbank auf dem eigenen Server, erreichbar über eine gesicherte HTTPS-Verbindung und durch eine PIN geschützt (siehe „Zugangs-PIN" unten).',
    backup_title:'Datensicherung',
    backup_p:'Tägliches automatisches Backup in ein privates GitHub-Repository, eingerichtet über eine geplante GitHub Action. Dieser Schlüssel schützt den Backup-Zugriff — nur zusammen mit der Action einrichten, nicht öffentlich teilen.',
    backup_token_label:'Backup-Schlüssel',
    backup_url_label:'Backup-Adresse',
    field_bez:'Bezeichnung', field_category:'Kategorie', change:'Ändern',
    field_hersteller:'Hersteller', field_modell:'Modell', field_serien:'Seriennummer', field_miete:'Mietpreis / Tag',
    field_status:'Status', field_standort:'Standort',
    field_flightcase:'Flightcase', opt_no_flightcase:'Kein Flightcase',
    contains_title:'Enthält ({n})', contains_empty:'Enthält keine Objekte.',
    contains_short:'{n} Objekt(e)', in_case_short:'in {inv}',
    btn_add_to_case:'Objekt einpacken', flightcase_add_item_hint:'Objekt zum Einpacken auswählen.',
    already_in_case:'Bereits eingepackt', sheet_pick_flightcase:'Flightcase wählen',
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
    belegt_range:'Belegt {von}–{bis}',
    available_of:'{n} von {m} verfügbar',
    field_menge:'Bestand (Stückzahl)',
    bulk_return_note:'Sammelartikel — Bestand wird automatisch wieder freigegeben.',
    field_photo:'Foto', add_photo:'Foto hinzufügen', remove_photo:'Foto entfernen',
    nav_timeline:'Zeitleiste', nav_customers:'Kunden', nav_bundles:'Sets', nav_stats:'Statistik',
    nav_tags:'Tags', nav_test_types:'Prüfarten',
    sheet_customers:'Kunden', sheet_new_customer:'Neuer Kunde',
    btn_new_customer:'+ Kunde hinzufügen', btn_create_customer:'Kunde anlegen', btn_delete_customer:'Kunde löschen',
    empty_customers:'Noch keine Kunden angelegt.', empty_customer_rentals:'Noch keine Vermietungen für diesen Kunden.',
    label_rental_history:'Vermietungshistorie',
    field_name:'Name', field_firma:'Firma', field_email:'E-Mail', field_telefon:'Telefon', field_adresse:'Adresse',
    field_customer_pick:'Bestehenden Kunden wählen', opt_free_text:'— Freitext —',
    toast_customer_created:'Kunde {name} angelegt', toast_customer_deleted:'Kunde gelöscht',
    sheet_bundles:'Sets', sheet_new_bundle:'Neues Set',
    bundles_hint:'Vorgefertigte Artikel-Zusammenstellungen für wiederkehrende Buchungen. Neue Sets werden im Inventar über die Mehrfachauswahl erstellt.',
    empty_bundles:'Noch keine Sets angelegt.',
    field_suggested_price:'Preisvorschlag / Tag (optional)', optional:'optional',
    suggested_price_short:'Vorschlag {price}/Tag',
    suggested_price_hint:'Nur eine Erinnerung für dich — beim Anlegen einer Vermietung wird trotzdem immer der reguläre Einzelpreis berechnet, du kannst frei abweichen.',
    bundle_name_placeholder:'z. B. Standard DJ-Setup',
    btn_create_bundle:'Set speichern', btn_delete_bundle:'Set löschen',
    field_add_bundle:'Set hinzufügen', opt_choose_bundle:'— Set wählen —',
    bundle_price_hint:'Preisvorschlag für „{name}“: {price}/Tag — nur ein Hinweis, keine feste Vorgabe.',
    toast_bundle_created:'Set „{name}“ angelegt', toast_bundle_deleted:'Set gelöscht',
    stock_label:'{n}× im Bestand',
    sheet_bundle_add_item:'Artikel hinzufügen', btn_add_bundle_item:'+ Artikel hinzufügen',
    bundle_add_item_hint:'Artikel zum Set hinzufügen.', already_in_set:'Bereits im Set',
    btn_select_items:'Auswählen', btn_cancel_select:'Abbrechen',
    btn_add_to_rental:'Zur Vermietung', btn_save_as_set:'Als Set speichern',
    sheet_stats:'Statistik', stat_total_rentals:'Vermietungen', stat_total_revenue:'Umsatz gesamt',
    stat_most_used:'Meistgenutzte Artikel', stat_revenue_generated:'erwirtschaftet',
    empty_stats:'Noch keine Vermietungen, noch keine Statistik.',
    sheet_timeline:'Zeitleiste',
    timeline_hint:'Laufende und bevorstehende Vermietungen der nächsten {n} Tage.',
    empty_timeline:'Keine laufenden oder bevorstehenden Vermietungen in diesem Zeitraum.',
    sheet_invoice:'Rechnung', btn_export_invoice:'Als Rechnung exportieren',
    invoice_no:'Rechnung {id}', invoice_qty:'Menge', invoice_rate:'Preis/Tag', invoice_sum:'Summe',
    invoice_footer:'Diese Rechnung ist ein Beispiel-Export und ersetzt keine steuerlich geprüfte Rechnungsstellung.',
    export_title:'Datenexport', export_p:'Einzelne Tabellen als CSV herunterladen oder alles gesammelt als ZIP.',
    export_all_zip:'Alles als ZIP herunterladen',
    explorer_title:'Rohdaten-Explorer', explorer_p:'Alle gespeicherten Felder aller Tabellen ansehen — für Detailsuche im Zweifelsfall.',
    explorer_open:'Rohdaten-Explorer öffnen', sheet_data_explorer:'Rohdaten-Explorer',
    explorer_intro:'Vollständiger, ungefilterter Blick auf alle Datenbanktabellen.',
    explorer_empty:'Keine Einträge.',
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
    delete:'Delete',
    confirm_delete_cat:'Delete this category?',
    toast_cat_has_children:'Still has subcategories -- move or delete those first',
    toast_cat_has_items:'Still has items -- move or delete those first',
    toast_cat_has_tags:'Still has tags -- delete those first',
    tag_code_placeholder:'Code, e.g. A', tag_name_placeholder:'Name, e.g. 5m XLR cable',
    confirm_delete_tag:'Delete this tag? Items keep their own number.',
    field_tag:'Tag (optional)', opt_no_tag:'— No tag —',
    field_test_types:'Test types', field_checklist_preview:'Checklist (preview)', field_checklist:'Checklist',
    checklist_empty:'No checklist items yet.', checklist_extra_placeholder:'Another item …',
    test_types_title:'Test types', test_types_p:'Test types with their default checklist. When creating an item that requires inspection, pick the matching type(s) -- their checklist is copied in and can be adjusted per item.',
    test_type_name_placeholder:'New test type …',
    confirm_delete_test_type:'Delete this test type? Items that already used it keep their checklist.',
    btn_archive:'Archive', btn_unarchive:'Restore from archive',
    btn_delete_rental:'Delete rental', btn_delete_item:'Delete item',
    nav_archive:'Archive', nav_active_rentals:'Current',
    sort_by:'Sort by', sort_date_asc:'Date (earliest first)', sort_date_desc:'Date (latest first)',
    sort_kunde:'Customer (A-Z)', sort_status:'Status', sort_preis:'Price (highest first)',
    empty_archive:'No archived rentals.',
    confirm_delete_rental:'Delete this rental?', toast_rental_deleted:'Rental deleted',
    confirm_delete_item:'Delete this item?', toast_item_deleted:'Item {inv} deleted',
    toast_rental_archived:'Rental archived', toast_rental_unarchived:'Rental restored',
    standorte_title:'Locations', standort_placeholder:'New location …', add:'Add',
    thresh_title:'Inspection warning thresholds', thresh_yellow:'Yellow from (days before due)', thresh_orange:'Orange from (days before due)',
    pin_title:'Access PIN', pin_p:'This PIN protects the whole site. Once unlocked in a browser, access stays remembered.',
    pin_field:'4-digit PIN', pin_lock_now:'Lock now (this device)',
    toast_pin_invalid:'PIN must be exactly 4 digits', toast_pin_saved:'PIN changed',
    lang_title:'Language',
    theme_title:'Theme', theme_system:'System', theme_light:'Light', theme_dark:'Dark',
    data_title:'Data & security',
    data_p:'Data lives in a database on your own server, reachable over a secured HTTPS connection and protected by a PIN (see "Access PIN" below).',
    backup_title:'Backups',
    backup_p:'Automatic daily backup to a private GitHub repository, set up via a scheduled GitHub Action. This key protects backup access — set it up together with the Action only, don\'t share it publicly.',
    backup_token_label:'Backup key',
    backup_url_label:'Backup address',
    field_bez:'Name', field_category:'Category', change:'Change',
    field_hersteller:'Manufacturer', field_modell:'Model', field_serien:'Serial number', field_miete:'Rental price / day',
    field_status:'Status', field_standort:'Location',
    field_flightcase:'Flightcase', opt_no_flightcase:'No flightcase',
    contains_title:'Contains ({n})', contains_empty:'Contains no objects.',
    contains_short:'{n} object(s)', in_case_short:'in {inv}',
    btn_add_to_case:'Pack object', flightcase_add_item_hint:'Select an object to pack.',
    already_in_case:'Already packed', sheet_pick_flightcase:'Select flightcase',
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
    belegt_range:'Booked {von}–{bis}',
    available_of:'{n} of {m} available',
    field_menge:'Stock (quantity)',
    bulk_return_note:'Bulk item — stock is freed automatically again.',
    field_photo:'Photo', add_photo:'Add photo', remove_photo:'Remove photo',
    nav_timeline:'Timeline', nav_customers:'Customers', nav_bundles:'Sets', nav_stats:'Stats',
    nav_tags:'Tags', nav_test_types:'Test types',
    sheet_customers:'Customers', sheet_new_customer:'New customer',
    btn_new_customer:'+ Add customer', btn_create_customer:'Create customer', btn_delete_customer:'Delete customer',
    empty_customers:'No customers yet.', empty_customer_rentals:'No rentals for this customer yet.',
    label_rental_history:'Rental history',
    field_name:'Name', field_firma:'Company', field_email:'Email', field_telefon:'Phone', field_adresse:'Address',
    field_customer_pick:'Choose an existing customer', opt_free_text:'— Free text —',
    toast_customer_created:'Customer {name} added', toast_customer_deleted:'Customer deleted',
    sheet_bundles:'Sets', sheet_new_bundle:'New set',
    bundles_hint:'Prebuilt article combos for recurring bookings. New sets are created from the Inventory tab using multi-select.',
    empty_bundles:'No sets yet.',
    field_suggested_price:'Suggested price / day (optional)', optional:'optional',
    suggested_price_short:'Suggested {price}/day',
    suggested_price_hint:'Just a reminder for you — creating a rental still always uses the regular per-item price, feel free to charge differently.',
    bundle_name_placeholder:'e.g. Standard DJ setup',
    btn_create_bundle:'Save set', btn_delete_bundle:'Delete set',
    field_add_bundle:'Add a set', opt_choose_bundle:'— Choose a set —',
    bundle_price_hint:'Suggested price for "{name}": {price}/day — just a hint, not a fixed rule.',
    toast_bundle_created:'Set "{name}" created', toast_bundle_deleted:'Set deleted',
    stock_label:'{n}× in stock',
    sheet_bundle_add_item:'Add item', btn_add_bundle_item:'+ Add item',
    bundle_add_item_hint:'Add an item to the set.', already_in_set:'Already in set',
    btn_select_items:'Select', btn_cancel_select:'Cancel',
    btn_add_to_rental:'To rental', btn_save_as_set:'Save as set',
    sheet_stats:'Stats', stat_total_rentals:'Rentals', stat_total_revenue:'Total revenue',
    stat_most_used:'Most-used items', stat_revenue_generated:'generated',
    empty_stats:'No rentals yet, no stats yet.',
    sheet_timeline:'Timeline',
    timeline_hint:'Active and upcoming rentals over the next {n} days.',
    empty_timeline:'No active or upcoming rentals in this period.',
    sheet_invoice:'Invoice', btn_export_invoice:'Export as invoice',
    invoice_no:'Invoice {id}', invoice_qty:'Qty', invoice_rate:'Price/day', invoice_sum:'Total',
    invoice_footer:'This invoice is a sample export and is not a tax-compliant document.',
    export_title:'Data export', export_p:'Download individual tables as CSV, or everything at once as a ZIP.',
    export_all_zip:'Download everything as ZIP',
    explorer_title:'Raw data explorer', explorer_p:'See every stored field in every table — for when you need a specific detail in a hurry.',
    explorer_open:'Open raw data explorer', sheet_data_explorer:'Raw data explorer',
    explorer_intro:'A complete, unfiltered look at every database table.',
    explorer_empty:'No entries.',
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
let lastRenderedTab = null;

let ui = {
  tab:'start', sheetStack:[], search:'', fStatus:null, toast:null,
  newItemDraft:null, newRentalDraft:null, returnDraft:null, newCustomerDraft:null, newBundleDraft:null,
  selectMode:false, selectedInv: new Set(), selectedQty: {},
  expandedCats: new Set(),
  expandedSettingsCats: new Set(),
  expandedTestTypes: new Set(),
  showArchived:false, rentalSort:'date', explorerSort:{},
  lang: localStorage.getItem('fundus-lang') || 'de',
  theme: localStorage.getItem('fundus-theme') || 'system',
};

function applyTheme(theme){
  if(theme==='light' || theme==='dark') document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}

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
function distinctHersteller(){
  return [...new Set(state.inventar.map(i=>i.hersteller).filter(h=>h && h.trim()))].sort((a,b)=>a.localeCompare(b));
}
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
// Conflicts are informational only -- item pickers use this to show existing
// reservation dates next to an item, never to block selecting it.
function overlappingReservationsFor(inv,von,bis,excludeId){
  const out=[];
  activeRentalsOverlapping(von,bis,excludeId).forEach(v=>{
    const line = v.items.find(it=>it.inv===inv);
    if(line) out.push({von:v.von, bis:v.bis, menge:line.menge, kunde:v.kunde});
  });
  return out;
}
function bookedQtyFor(inv,von,bis,excludeId){
  return overlappingReservationsFor(inv,von,bis,excludeId).reduce((s,r)=>s+r.menge,0);
}
function availableTodayCount(item){
  if(item.menge<=1) return null;
  const todayIso = TODAY.toISOString().slice(0,10);
  return Math.max(0, item.menge - bookedQtyFor(item.inv, todayIso, todayIso, null));
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
function closeSheets(){ ui.sheetStack = []; ui.newItemDraft=null; ui.newRentalDraft=null; ui.returnDraft=null; ui.newCustomerDraft=null; ui.newBundleDraft=null; lastSheetKey = null; render(); }
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
  // Preserve scroll position across re-renders, but only when it's genuinely
  // the same screen/sheet being redrawn (e.g. toggling a category open) --
  // not when switching tabs or opening a different sheet, which should
  // start at the top.
  const tabContinues = ui.tab === lastRenderedTab;
  const prevScreen = app.querySelector('.screen');
  const screenScroll = (tabContinues && prevScreen) ? prevScreen.scrollTop : 0;
  // .cat-tree (the category browser in Inventar, and the item picker inside
  // the new-rental sheet) is its own independently-scrollable region, capped
  // shorter than its content -- it needs the same treatment as .screen,
  // scoped separately since a screen-level and a sheet-level tree can exist
  // in the DOM at the same time.
  const prevScreenCatTree = app.querySelector('.screen .cat-tree');
  const screenCatTreeScroll = (tabContinues && prevScreenCatTree) ? prevScreenCatTree.scrollTop : 0;

  const topSheetObj = ui.sheetStack[ui.sheetStack.length-1];
  const upcomingSheetKey = topSheetObj ? (topSheetObj.type+':'+(topSheetObj.id||topSheetObj.inv||topSheetObj.for||'')) : null;
  const sheetContinues = !!upcomingSheetKey && upcomingSheetKey===lastSheetKey;
  const prevSheetBody = app.querySelector('.sheet-body');
  const sheetScroll = (sheetContinues && prevSheetBody) ? prevSheetBody.scrollTop : 0;
  const prevSheetCatTree = app.querySelector('.sheet-body .cat-tree');
  const sheetCatTreeScroll = (sheetContinues && prevSheetCatTree) ? prevSheetCatTree.scrollTop : 0;

  app.innerHTML = `
    <div class="app-shell">
      ${sidebar()}
      <div class="main-col">
        ${topbar()}
        <div class="screen">${screenBody()}</div>
        ${fab()}
      </div>
      ${ui.toast?`<div class="toast">${esc(ui.toast)}</div>`:''}
      ${tabbar()}
      ${ui.sheetStack.length?sheetOverlay():''}
    </div>
  `;

  const newScreen = app.querySelector('.screen');
  if(newScreen) newScreen.scrollTop = screenScroll;
  const newScreenCatTree = app.querySelector('.screen .cat-tree');
  if(newScreenCatTree) newScreenCatTree.scrollTop = screenCatTreeScroll;
  const newSheetBody = app.querySelector('.sheet-body');
  if(newSheetBody) newSheetBody.scrollTop = sheetScroll;
  const newSheetCatTree = app.querySelector('.sheet-body .cat-tree');
  if(newSheetCatTree) newSheetCatTree.scrollTop = sheetCatTreeScroll;
  lastRenderedTab = ui.tab;

  attachEvents();
}

function screenTitle(){
  return t('title_'+ui.tab);
}

const NAV_TABS = [
  ['start','grid','tab_start'],
  ['inventar','crate','tab_inventar'],
  ['pruefungen','shield','tab_pruefungen'],
  ['vermietungen','calendar','tab_vermietungen'],
  ['einstellungen','gear','tab_mehr'],
];

function topbar(){
  return `
  <header class="topbar">
    <button class="brand" data-action="tab" data-tab="start" aria-label="Start">
      <img class="brand-mark" src="/icons/brand-mark.png" alt="">
    </button>
    <div class="topbar-title">${screenTitle()}</div>
  </header>`;
}

function tabbar(){
  return `<nav class="tabbar">${NAV_TABS.map(([id,icon,key])=>`
    <button class="tab-btn ${ui.tab===id?'active':''}" data-action="tab" data-tab="${id}">
      ${ICONS[icon]}<span>${t(key)}</span>
    </button>`).join('')}</nav>`;
}

function sidebar(){
  return `
  <nav class="sidebar">
    <button class="sidebar-brand" data-action="tab" data-tab="start" aria-label="Start">
      <img class="brand-mark" src="/icons/brand-mark.png" alt=""><span class="sidebar-brand-name">Fundus</span>
    </button>
    <div class="sidebar-nav">
      ${NAV_TABS.map(([id,icon,key])=>`
        <button class="sidebar-nav-btn ${ui.tab===id?'active':''}" data-action="tab" data-tab="${id}">
          ${ICONS[icon]}<span>${t(key)}</span>
        </button>`).join('')}
    </div>
  </nav>`;
}

function fab(){
  if(ui.sheetStack.length) return '';
  if(ui.tab==='inventar') return `<button class="fab" data-action="open-new-item" aria-label="${t('quick_new_item')}">${ICONS.plus}<span class="fab-label">${t('quick_new_item')}</span></button>`;
  if(ui.tab==='vermietungen') return `<button class="fab" data-action="open-new-rental" aria-label="${t('quick_new_rental')}">${ICONS.plus}<span class="fab-label">${t('quick_new_rental')}</span></button>`;
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

function tagLabel(tagId){
  const tg = state.tags.find(x=>x.id===tagId);
  return tg ? catPathCodes(tg.cat)+'.'+tg.code : '';
}

function childCountOf(inv){ return state.inventar.filter(x=>x.parent===inv).length; }

function itemCard(i, showPruef, selectable){
  const ps = pruefStatus(i);
  const cls = showPruef && ps ? ps : '';
  const caseItem = i.parent ? byInv(i.parent) : null;
  const contentCount = childCountOf(i.inv);
  const metaBits = [catPathNames(i.cat), esc(i.standort)];
  if(i.tag) metaBits.push(esc(tagLabel(i.tag)));
  if(caseItem) metaBits.push(t('in_case_short',{inv:caseItem.inv}));
  const metaLine = showPruef && ps ? pruefLabel(i) : metaBits.join(' · ');
  const bulk = i.menge > 1;
  const avail = bulk ? availableTodayCount(i) : null;
  const pill = showPruef && ps
    ? `<span class="pill pill-${ps}">${pruefStatusLabel(ps)}</span>`
    : contentCount>0
      ? `<span class="pill pill-off">${t('contains_short',{n:contentCount})}</span>`
      : bulk
      ? `<span class="pill ${avail>0?'pill-ok':'pill-rented'}">${t('available_of',{n:avail,m:i.menge})}</span>`
      : `<span class="pill ${statusPillClass(i.status)}">${statusLabel(i.status)}</span>`;
  const thumb = i.foto ? `<img class="ic-thumb" src="/photos/${encodeURIComponent(i.foto)}" alt="" loading="lazy" />` : '';

  if(!selectable){
    return `
      <button class="item-card ${cls}" data-action="open-item" data-inv="${i.inv}">
        ${thumb}
        <div class="ic-body">
          <span class="inv-num mono">${i.inv}</span>
          <span class="ic-title">${esc(i.bez)}</span>
          <span class="ic-meta">${metaLine}</span>
        </div>
        ${pill}
      </button>`;
  }

  const selected = ui.selectedInv.has(i.inv);
  const qty = ui.selectedQty[i.inv] || 1;
  return `
    <div class="item-card ${cls} select-row">
      <button class="pack-check ${selected?'checked':''}" data-action="toggle-select-item" data-inv="${i.inv}" aria-label="${esc(i.bez)}">${selected?ICONS.check:''}</button>
      <button class="ic-body" style="background:none;border:none;padding:0;text-align:left;cursor:pointer;" data-action="toggle-select-item" data-inv="${i.inv}">
        <span class="inv-num mono">${i.inv}</span>
        <span class="ic-title">${esc(i.bez)}</span>
        <span class="ic-meta">${metaLine}</span>
      </button>
      ${bulk? `<span class="stock-note">${t('stock_label',{n:i.menge})}</span>` : ''}
      ${bulk && selected? `<input class="qty-input" type="number" min="1" max="${i.menge}" value="${qty}" data-action="set-select-item-qty" data-inv="${i.inv}" />` : ''}
    </div>`;
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

  const nodeTags = state.tags.filter(tg=>tg.cat===node.id);
  const untaggedItems = directItems.filter(i=>!i.tag);
  const taggedGroups = nodeTags
    .map(tg=>({tag:tg, items: directItems.filter(i=>i.tag===tg.id)}))
    .filter(g=>g.items.length);

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
          ${taggedGroups.map(g=>`
            <div class="tag-group">
              <div class="tag-group-label mono">${esc(catPathCodes(node.id))}.${esc(g.tag.code)} · ${esc(g.tag.name)}</div>
              ${g.items.map(i=>itemCard(i,false,ui.selectMode)).join('')}
            </div>
          `).join('')}
          ${untaggedItems.map(i=>itemCard(i,false,ui.selectMode)).join('')}
          ${children.map(c=>renderInventarCatNode(c,depth+1,statusFilter)).join('')}
        </div>
      ` : ''}
    </div>`;
}

function selectActionBar(){
  if(!ui.selectMode || !ui.selectedInv.size) return '';
  return `
    <div class="select-action-bar">
      <span class="field-hint" style="margin:0;">${t('n_selected',{n:ui.selectedInv.size})}</span>
      <button class="btn btn-secondary" data-action="bulk-add-to-rental">${t('btn_add_to_rental')}</button>
      <button class="btn btn-primary" data-action="bulk-save-as-set">${t('btn_save_as_set')}</button>
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
  const selectToggle = `
    <div class="tool-row">
      <button class="tool-btn" data-action="toggle-select-mode">${ui.selectMode? t('btn_cancel_select') : t('btn_select_items')}</button>
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
      ${selectToggle}
      <div class="card-list">
        ${items.length? items.map(i=>itemCard(i,false,ui.selectMode)).join('') : `<div class="empty-state">${ICONS.empty}<p>${t('empty_search')}</p></div>`}
      </div>
      ${selectActionBar()}
    `;
  }

  const filteredTotal = state.inventar.filter(i=> !ui.fStatus || i.status===ui.fStatus).length;
  return `
    <h1 class="page-title">${t('title_inventar')}</h1>
    <p class="page-sub">${t('inv_sub',{n:filteredTotal,m:state.inventar.length})}</p>
    ${searchBar}
    ${selectToggle}
    <div class="cat-tree">
      ${filteredTotal? catRoots().map(r=>renderInventarCatNode(r,0,ui.fStatus)).join('') : `<div class="empty-state">${ICONS.empty}<p>${t('empty_search')}</p></div>`}
    </div>
    ${selectActionBar()}
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
  return v.items.reduce((sum,it)=>{ const item=byInv(it.inv); return sum + (item?item.miete*days*it.menge:0); },0);
}
function rentalStatusPill(status){
  const map = {Reserviert:'pill-warn',Aktiv:'pill-rented',Abgeschlossen:'pill-off'};
  return map[status]||'pill-off';
}
function rentalStatusLabel(status){ return t('rental_status_'+status) || status; }

function sortRentals(list){
  const arr = [...list];
  const by = ui.rentalSort || 'date';
  if(by==='date') arr.sort((a,b)=> a.von<b.von?-1:a.von>b.von?1:0);
  else if(by==='date-desc') arr.sort((a,b)=> a.von>b.von?-1:a.von<b.von?1:0);
  else if(by==='kunde') arr.sort((a,b)=>a.kunde.localeCompare(b.kunde));
  else if(by==='status') arr.sort((a,b)=>a.status.localeCompare(b.status));
  else if(by==='preis') arr.sort((a,b)=>rentalTotal(b)-rentalTotal(a));
  return arr;
}

function screenVermietungen(){
  const showArchived = ui.showArchived;
  const base = state.vermietungen.filter(v=> showArchived ? v.archiviert : !v.archiviert);
  const list = sortRentals(base);
  return `
    <h1 class="page-title">${t('title_vermietungen')}</h1>
    <p class="page-sub">${t('verm_sub',{n:base.length})}</p>
    <div class="tool-row">
      <button class="tool-btn" data-action="open-timeline">${ICONS.calendar}${t('nav_timeline')}</button>
      <button class="tool-btn" data-action="open-customers">${t('nav_customers')}</button>
      <button class="tool-btn" data-action="open-bundles">${t('nav_bundles')}</button>
      <button class="tool-btn" data-action="open-stats">${t('nav_stats')}</button>
      <button class="tool-btn ${showArchived?'active':''}" data-action="toggle-show-archived">${showArchived? t('nav_active_rentals') : t('nav_archive')}</button>
    </div>
    <div class="field" style="max-width:240px;">
      <label>${t('sort_by')}</label>
      <select data-action="set-rental-sort">
        <option value="date" ${(ui.rentalSort||'date')==='date'?'selected':''}>${t('sort_date_asc')}</option>
        <option value="date-desc" ${ui.rentalSort==='date-desc'?'selected':''}>${t('sort_date_desc')}</option>
        <option value="kunde" ${ui.rentalSort==='kunde'?'selected':''}>${t('sort_kunde')}</option>
        <option value="status" ${ui.rentalSort==='status'?'selected':''}>${t('sort_status')}</option>
        <option value="preis" ${ui.rentalSort==='preis'?'selected':''}>${t('sort_preis')}</option>
      </select>
    </div>
    <div class="card-list" style="margin-top:14px;">
      ${list.length? list.map(v=>`
        <button class="item-card" data-action="open-rental" data-id="${v.id}">
          <div class="ic-body">
            <span class="inv-num mono">${fmtDate(v.von)} – ${fmtDate(v.bis)}</span>
            <span class="ic-title">${esc(v.kunde)}</span>
            <span class="ic-meta">${t('verm_meta',{n:v.items.length,price:fmtEuro(rentalTotal(v))})}</span>
          </div>
          <span class="pill ${rentalStatusPill(v.status)}">${rentalStatusLabel(v.status)}</span>
        </button>
      `).join('') : `<div class="empty-state">${ICONS.empty}<p>${showArchived? t('empty_archive') : t('empty_verm')}</p></div>`}
    </div>
  `;
}

/* ---------- category tree renderers ---------- */

function renderCatEditNode(node, depth){
  const children = catChildren(node.id);
  const hasKids = children.length>0;
  const expanded = !hasKids || ui.expandedSettingsCats.has(node.id);
  const tags = depth===1 ? state.tags.filter(tg=>tg.cat===node.id) : [];
  return `
    <div class="cat-edit-node" style="margin-left:${depth*16}px;">
      <div class="cat-edit-row">
        ${hasKids ? `<button class="cat-toggle" data-action="toggle-settings-cat-expand" data-id="${node.id}">${expanded?ICONS.chevDown:ICONS.chevRight}</button>` : `<span class="cat-toggle-spacer"></span>`}
        <input class="code mono" data-action="edit-cat-code" data-id="${node.id}" value="${esc(node.code)}" maxlength="4" />
        <input class="name" data-action="edit-cat-name" data-id="${node.id}" value="${esc(node.name)}" />
        <button class="icon-btn cat-delete-btn" data-action="delete-cat" data-id="${node.id}" aria-label="${t('delete')}">${ICONS.close}</button>
      </div>
      ${expanded ? `
        <div class="cat-edit-children">
          ${children.map(c=>renderCatEditNode(c,depth+1)).join('')}
          ${depth===0 ? `<button class="add-link" data-action="add-subcat" data-id="${node.id}">${t('add_subcat')}</button>` : ''}
          ${depth===1 ? renderTagEditor(node, tags) : ''}
        </div>
      ` : ''}
    </div>`;
}

function renderTagEditor(node, tags){
  return `
    <div class="tag-editor">
      ${tags.length ? `
        <div class="chip-edit-row">
          ${tags.map(tg=>`
            <span class="chip-edit mono">${esc(catPathCodes(node.id))}.${esc(tg.code)} — ${esc(tg.name)}<button data-action="delete-tag" data-id="${tg.id}">${ICONS.close}</button></span>
          `).join('')}
        </div>
      ` : ''}
      <div class="add-inline tag-add-inline" data-tag-cat="${node.id}">
        <input type="text" class="mono" maxlength="3" placeholder="${t('tag_code_placeholder')}" style="width:52px;flex:none;" />
        <input type="text" placeholder="${t('tag_name_placeholder')}" />
        <button data-action="add-tag" data-cat="${node.id}">${t('add')}</button>
      </div>
    </div>`;
}

function renderTestTypeEditor(tt){
  const expanded = ui.expandedTestTypes.has(tt.id);
  return `
    <div class="cat-edit-node" style="margin-bottom:4px;">
      <div class="cat-edit-row">
        <button class="cat-toggle" data-action="toggle-test-type-expand" data-id="${tt.id}">${expanded?ICONS.chevDown:ICONS.chevRight}</button>
        <input class="name" data-action="edit-test-type-name" data-id="${tt.id}" value="${esc(tt.name)}" />
        <button class="icon-btn cat-delete-btn" data-action="delete-test-type" data-id="${tt.id}" aria-label="${t('delete')}">${ICONS.close}</button>
      </div>
      ${expanded ? `
        <div class="cat-edit-children">
          ${tt.items.length? `
            <div class="checklist-preview">
              ${tt.items.map(it=>`
                <div class="checklist-preview-row">
                  <span>${esc(it.text)}</span>
                  <button data-action="delete-test-type-item" data-tt="${tt.id}" data-id="${it.id}">${ICONS.close}</button>
                </div>
              `).join('')}
            </div>
          ` : `<p class="field-hint">${t('checklist_empty')}</p>`}
          <div class="add-inline">
            <input type="text" id="new-tt-item-${tt.id}" placeholder="${t('checklist_extra_placeholder')}" />
            <button data-action="add-test-type-item" data-tt="${tt.id}">${t('add')}</button>
          </div>
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
  const entry = d.items.find(x=>x.inv===i.inv);
  const picked = !!entry;
  const bulk = i.menge > 1;
  const reservations = overlappingReservationsFor(i.inv, d.von, d.bis, null);
  const bookedQty = reservations.reduce((s,r)=>s+r.menge,0);
  const availableQty = Math.max(0, i.menge - bookedQty);
  const conflictNote = reservations.length
    ? reservations.map(r=>t('belegt_range',{von:fmtDate(r.von),bis:fmtDate(r.bis)})).join(', ')
    : '';
  return `
    <div class="item-card rental-pick-row">
      <button class="pack-check ${picked?'checked':''}" data-action="toggle-rental-item" data-inv="${i.inv}" aria-label="${esc(i.bez)}">${picked?ICONS.check:''}</button>
      <button class="ic-body" style="background:none;border:none;padding:0;text-align:left;cursor:pointer;" data-action="toggle-rental-item" data-inv="${i.inv}">
        <span class="inv-num mono">${i.inv}</span>
        <span class="ic-title">${esc(i.bez)}</span>
        <span class="ic-meta">${fmtEuro(i.miete)}${t('per_day')}${bulk?' · '+t('available_of',{n:availableQty,m:i.menge}):''}</span>
      </button>
      ${bulk && picked ? `<input class="qty-input" type="number" min="1" max="${i.menge}" value="${entry.menge}" data-action="set-rental-item-qty" data-inv="${i.inv}" />` : ''}
      ${conflictNote ? `<span class="conflict-note">${esc(conflictNote)}</span>` : ''}
    </div>`;
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
      <h3>${t('test_types_title')}</h3>
      <p class="field-hint" style="margin-bottom:10px;">${t('test_types_p')}</p>
      ${state.testTypes.map(tt=>renderTestTypeEditor(tt)).join('')}
      <div class="add-inline" style="margin-top:6px;">
        <input type="text" id="new-test-type" placeholder="${t('test_type_name_placeholder')}" />
        <button data-action="add-test-type">${t('add')}</button>
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
      <h3>${t('pin_title')}</h3>
      <p class="field-hint" style="margin-bottom:10px;">${t('pin_p')}</p>
      <div class="field">
        <label>${t('pin_field')}</label>
        <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" class="mono" value="${esc(state.pin)}" data-action="set-pin" />
      </div>
      <button class="btn btn-secondary" data-action="lock-now">${t('pin_lock_now')}</button>
    </div>

    <div class="settings-card">
      <h3>${t('lang_title')}</h3>
      <div class="lang-toggle">
        <button class="lang-btn ${ui.lang==='de'?'active':''}" data-action="set-lang" data-val="de">Deutsch</button>
        <button class="lang-btn ${ui.lang==='en'?'active':''}" data-action="set-lang" data-val="en">English</button>
      </div>
    </div>

    <div class="settings-card">
      <h3>${t('theme_title')}</h3>
      <div class="lang-toggle">
        <button class="lang-btn ${ui.theme==='system'?'active':''}" data-action="set-theme" data-val="system">${t('theme_system')}</button>
        <button class="lang-btn ${ui.theme==='light'?'active':''}" data-action="set-theme" data-val="light">${t('theme_light')}</button>
        <button class="lang-btn ${ui.theme==='dark'?'active':''}" data-action="set-theme" data-val="dark">${t('theme_dark')}</button>
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

    <div class="settings-card">
      <h3>${t('export_title')}</h3>
      <p class="field-hint" style="margin-bottom:10px;">${t('export_p')}</p>
      <div class="export-link-row">
        <a class="tool-btn" href="/api/export/csv/inventar">${t('tab_inventar')} CSV</a>
        <a class="tool-btn" href="/api/export/csv/vermietungen">${t('tab_vermietungen')} CSV</a>
        <a class="tool-btn" href="/api/export/csv/customers">${t('nav_customers')} CSV</a>
        <a class="tool-btn" href="/api/export/csv/bundles">${t('nav_bundles')} CSV</a>
        <a class="tool-btn" href="/api/export/csv/categories">${t('cat_title')} CSV</a>
        <a class="tool-btn" href="/api/export/csv/standorte">${t('standorte_title')} CSV</a>
      </div>
      <a class="btn btn-primary" style="display:block;text-align:center;text-decoration:none;margin-top:10px;" href="/api/export/all.zip">${t('export_all_zip')}</a>
    </div>

    <div class="settings-card">
      <h3>${t('explorer_title')}</h3>
      <p class="field-hint" style="margin-bottom:10px;">${t('explorer_p')}</p>
      <button class="link-btn" data-action="open-data-explorer">${t('explorer_open')}</button>
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
  else if(s.type==='pick-flightcase'){ title = t('sheet_pick_flightcase'); body = pickFlightcaseSheet(s); }
  else if(s.type==='flightcase-add-item'){ const c = byInv(s.inv); title = c.bez; body = flightcaseAddItemSheet(s); }
  else if(s.type==='customers'){ title = t('sheet_customers'); body = customersSheet(); }
  else if(s.type==='customer'){ const c = state.customers.find(x=>x.id===s.id); title = c.name; body = customerDetailSheet(c); }
  else if(s.type==='new-customer'){ title = t('sheet_new_customer'); body = newCustomerSheet(); }
  else if(s.type==='bundles'){ title = t('sheet_bundles'); body = bundlesSheet(); }
  else if(s.type==='bundle'){ const b = state.bundles.find(x=>x.id===s.id); title = b.name; body = bundleDetailSheet(b); }
  else if(s.type==='new-bundle'){ title = t('sheet_new_bundle'); body = newBundleSheet(); }
  else if(s.type==='bundle-add-item'){ title = t('sheet_bundle_add_item'); body = bundleAddItemSheet(s); }
  else if(s.type==='timeline'){ title = t('sheet_timeline'); body = timelineSheet(); }
  else if(s.type==='stats'){ title = t('sheet_stats'); body = statsSheet(); }
  else if(s.type==='data-explorer'){ title = t('sheet_data_explorer'); body = dataExplorerSheet(); }

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

    <div class="field">
      <label>${t('field_photo')}</label>
      ${i.foto ? `
        <div class="photo-row">
          <img class="photo-preview" src="/photos/${encodeURIComponent(i.foto)}" alt="" />
          <button class="link-btn" data-action="remove-item-photo" data-inv="${i.inv}">${t('remove_photo')}</button>
        </div>
      ` : `
        <label class="photo-upload-btn">
          ${t('add_photo')}
          <input type="file" accept="image/*" data-action="upload-item-photo" data-inv="${i.inv}" style="display:none;" />
        </label>
      `}
    </div>

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

    ${state.tags.filter(tg=>tg.cat===i.cat).length? `
      <div class="field">
        <label>${t('field_tag')}</label>
        <select data-action="edit-item" data-field="tag" data-inv="${i.inv}">
          <option value="">${t('opt_no_tag')}</option>
          ${state.tags.filter(tg=>tg.cat===i.cat).map(tg=>`<option value="${tg.id}" ${i.tag===tg.id?'selected':''}>${esc(catPathCodes(tg.cat))}.${esc(tg.code)} — ${esc(tg.name)}</option>`).join('')}
        </select>
      </div>
    ` : ''}

    <div class="field">
      <label>${t('field_status')}</label>
      <select data-action="edit-item" data-field="status" data-inv="${i.inv}">
        ${state.statusListe.map(s=>`<option value="${s}" ${s===i.status?'selected':''}>${statusLabel(s)}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label>${t('field_standort')}</label>
      <select data-action="edit-item" data-field="standort" data-inv="${i.inv}">
        ${state.standorte.map(s=>`<option value="${s}" ${s===i.standort?'selected':''}>${s}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label>${t('field_flightcase')}</label>
      <button type="button" class="cat-picker-btn" data-action="open-flightcase-picker" data-inv="${i.inv}">
        <span>${i.parent && byInv(i.parent) ? esc(byInv(i.parent).inv+' – '+byInv(i.parent).bez) : t('opt_no_flightcase')}</span>${ICONS.chevRight}
      </button>
    </div>
    <div class="field">
      <label>${t('field_menge')}</label>
      <input type="number" min="1" data-action="edit-item" data-field="menge" data-inv="${i.inv}" value="${i.menge}" />
    </div>

    <div class="divider"></div>
    <div class="section-head"><h2>${t('contains_title',{n:children.length})}</h2></div>
    ${children.length? `
      <div class="card-list" style="margin-bottom:10px;">
        ${children.map(c=>`
          <button class="item-card" data-action="open-item" data-inv="${c.inv}">
            <div class="ic-body">
              <span class="inv-num mono">${c.inv}</span>
              <span class="ic-title">${esc(c.bez)}</span>
              <span class="ic-meta">${esc(c.standort)}</span>
            </div>
          </button>
        `).join('')}
      </div>
    ` : `<p class="field-hint" style="margin-bottom:10px;">${t('contains_empty')}</p>`}
    <button class="btn btn-secondary" data-action="open-flightcase-add-item" data-inv="${i.inv}" style="margin-bottom:14px;">${t('btn_add_to_case')}</button>

    ${i.pruef ? `
      <div class="section-head" style="margin-top:4px;"><h2>${t('section_pruef')}</h2><span class="pill pill-${ps}">${pruefStatusLabel(ps)}</span></div>
      <div class="detail-grid">
        <div class="detail-item"><span class="dl-label">${t('field_letzte')}</span><span class="dl-value mono">${fmtDate(i.letzte)}</span></div>
        <div class="detail-item"><span class="dl-label">${t('field_naechste')}</span><span class="dl-value mono">${fmtDate(i.naechste)}</span></div>
        <div class="detail-item span2"><span class="dl-label">${t('field_status')}</span><span class="dl-value">${pruefLabel(i)}</span></div>
      </div>
      <div class="field">
        <label>${t('field_checklist')}</label>
        ${i.checklist.length? `
          <div class="checklist-preview">
            ${i.checklist.map(c=>`
              <div class="checklist-preview-row">
                <label class="checkbox-field" style="margin:0;flex:1;">
                  <input type="checkbox" data-action="toggle-checklist-item" data-inv="${i.inv}" data-id="${c.id}" ${c.checked?'checked':''} />
                  <span style="${c.checked?'text-decoration:line-through;color:var(--text-faint);':''}">${esc(c.text)}</span>
                </label>
                <button data-action="remove-checklist-item" data-inv="${i.inv}" data-id="${c.id}">${ICONS.close}</button>
              </div>
            `).join('')}
          </div>
        ` : `<p class="field-hint">${t('checklist_empty')}</p>`}
        <div class="add-inline">
          <input type="text" id="new-checklist-item-${i.inv}" placeholder="${t('checklist_extra_placeholder')}" />
          <button data-action="add-checklist-item" data-inv="${i.inv}">${t('add')}</button>
        </div>
      </div>
    ` : ''}

    <div class="field" style="margin-top:6px;">
      <label>${t('field_notiz')}</label>
      <textarea data-action="edit-item" data-field="notiz" data-inv="${i.inv}">${esc(i.notiz)}</textarea>
    </div>

    <div class="divider"></div>
    <button class="btn btn-secondary" data-action="delete-item" data-inv="${i.inv}" style="color:var(--status-crit);">${t('btn_delete_item')}</button>
  `;
}

function resolvedDraftChecklist(d){
  const fromTypes = state.testTypes.filter(tt=>d.testTypes.includes(tt.id)).flatMap(tt=>tt.items.map(it=>it.text));
  return [...fromTypes, ...d.checklistExtra];
}

function nextSuggestion(catId){
  const prefix = catPathCodes(catId) + '.';
  const nums = state.inventar.filter(i=>i.inv.startsWith(prefix)).map(i=>parseInt(i.inv.slice(prefix.length),10)).filter(n=>!isNaN(n));
  const next = (nums.length? Math.max(...nums):0) + 1;
  return prefix + String(next).padStart(3,'0');
}

function newItemSheet(){
  const d = ui.newItemDraft || (ui.newItemDraft = {
    inv:'', cat: firstLeafDefault(), tag:null,
    bez:'', hersteller:'', modell:'', serien:'', standort: state.standorte[0], status:'Verfügbar',
    miete:'', pruef:false, letzte:'', intervall:12, notiz:'', menge:1,
    testTypes:[], checklistExtra:[], fotoDataUrl:null
  });
  const availableTags = state.tags.filter(tg=>tg.cat===d.cat);
  return `
    <div class="field">
      <label>${t('field_category')}</label>
      <button type="button" class="cat-picker-btn" data-action="open-cat-picker-draft">
        <span>${catPathNames(d.cat)}</span>${ICONS.chevRight}
      </button>
    </div>
    ${availableTags.length? `
      <div class="field">
        <label>${t('field_tag')}</label>
        <select data-action="draft-item" data-field="tag">
          <option value="">${t('opt_no_tag')}</option>
          ${availableTags.map(tg=>`<option value="${tg.id}" ${d.tag===tg.id?'selected':''}>${esc(catPathCodes(tg.cat))}.${esc(tg.code)} — ${esc(tg.name)}</option>`).join('')}
        </select>
      </div>
    ` : ''}
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
    <div class="field">
      <label>${t('field_photo')}</label>
      ${d.fotoDataUrl ? `
        <div class="photo-row">
          <img class="photo-preview" src="${d.fotoDataUrl}" alt="" />
          <button class="link-btn" data-action="remove-draft-photo">${t('remove_photo')}</button>
        </div>
      ` : `
        <label class="photo-upload-btn">
          ${t('add_photo')}
          <input type="file" accept="image/*" data-action="upload-draft-photo" style="display:none;" />
        </label>
      `}
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field_hersteller')}</label>
        <input type="text" list="hersteller-list" data-action="draft-item" data-field="hersteller" value="${esc(d.hersteller)}" />
        <datalist id="hersteller-list">
          ${distinctHersteller().map(h=>`<option value="${esc(h)}"></option>`).join('')}
        </datalist>
      </div>
      <div class="field"><label>${t('field_modelltyp')}</label><input type="text" data-action="draft-item" data-field="modell" value="${esc(d.modell)}" /></div>
    </div>
    <div class="field-row">
      <div class="field"><label>${t('field_serien')}</label><input type="text" data-action="draft-item" data-field="serien" value="${esc(d.serien)}" /></div>
      <div class="field"><label>${t('field_miete_eur')}</label><input type="number" min="0" data-action="draft-item" data-field="miete" value="${esc(d.miete)}" /></div>
    </div>
    <div class="field-row">
      <div class="field">
        <label>${t('field_standort')}</label>
        <select data-action="draft-item" data-field="standort">
          ${state.standorte.map(s=>`<option ${s===d.standort?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>${t('field_menge')}</label><input type="number" min="1" data-action="draft-item" data-field="menge" value="${esc(d.menge)}" /></div>
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
      <div class="field">
        <label>${t('field_test_types')}</label>
        <div class="checkbox-list">
          ${state.testTypes.map(tt=>`
            <label class="checkbox-field">
              <input type="checkbox" data-action="toggle-draft-test-type" data-id="${tt.id}" ${d.testTypes.includes(tt.id)?'checked':''} />
              <span>${esc(tt.name)}</span>
            </label>
          `).join('')}
        </div>
      </div>
      <div class="field">
        <label>${t('field_checklist_preview')}</label>
        ${resolvedDraftChecklist(d).length? `
          <div class="checklist-preview">
            ${resolvedDraftChecklist(d).map((text,idx)=>{
              const extraIdx = idx - (resolvedDraftChecklist(d).length - d.checklistExtra.length);
              return `
              <div class="checklist-preview-row">
                <span>${esc(text)}</span>
                ${extraIdx>=0? `<button data-action="remove-draft-checklist-extra" data-idx="${extraIdx}">${ICONS.close}</button>` : ''}
              </div>`;
            }).join('')}
          </div>
        ` : `<p class="field-hint">${t('checklist_empty')}</p>`}
        <div class="add-inline">
          <input type="text" id="new-checklist-extra" placeholder="${t('checklist_extra_placeholder')}" />
          <button data-action="add-draft-checklist-extra">${t('add')}</button>
        </div>
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

function pickFlightcaseSheet(s){
  const currentInv = s.inv;
  // Guard against trivial cycles: can't pack an item into itself or into
  // something it already directly contains.
  const excluded = new Set([currentInv, ...state.inventar.filter(x=>x.parent===currentInv).map(x=>x.inv)]);
  return `
    <button class="item-card" data-action="assign-flightcase" data-inv="${currentInv}" data-case="">
      <div class="ic-body"><span class="ic-title">${t('opt_no_flightcase')}</span></div>
    </button>
    <div class="cat-tree">
      ${catRoots().map(r=>renderFlightcasePickCatNode(r,0,currentInv,excluded)).join('')}
    </div>
  `;
}

function renderFlightcasePickCatNode(node, depth, currentInv, excluded){
  const children = catChildren(node.id);
  const ids = descendantCatIds(node.id);
  const directItems = state.inventar.filter(i=>i.cat===node.id && !excluded.has(i.inv));
  const totalCount = ids.reduce((sum,id)=>sum+state.inventar.filter(i=>i.cat===id && !excluded.has(i.inv)).length,0);
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
          ${directItems.map(i=>`
            <button class="item-card" data-action="assign-flightcase" data-inv="${currentInv}" data-case="${i.inv}">
              <div class="ic-body">
                <span class="inv-num mono">${i.inv}</span>
                <span class="ic-title">${esc(i.bez)}</span>
                <span class="ic-meta">${esc(i.standort)}${childCountOf(i.inv)?' · '+esc(t('contains_short',{n:childCountOf(i.inv)})):''}</span>
              </div>
            </button>`).join('')}
          ${children.map(c=>renderFlightcasePickCatNode(c,depth+1,currentInv,excluded)).join('')}
        </div>
      ` : ''}
    </div>`;
}

function flightcaseAddItemSheet(s){
  const caseInv = s.inv;
  const existingChildren = new Set(state.inventar.filter(x=>x.parent===caseInv).map(x=>x.inv));
  return `
    <p class="field-hint" style="margin-bottom:12px;">${t('flightcase_add_item_hint')}</p>
    <div class="cat-tree">
      ${catRoots().map(r=>renderFlightcaseContentPickNode(r,0,caseInv,existingChildren)).join('')}
    </div>
  `;
}

function renderFlightcaseContentPickNode(node, depth, caseInv, existingChildren){
  const children = catChildren(node.id);
  const ids = descendantCatIds(node.id);
  const directItems = state.inventar.filter(i=>i.cat===node.id && i.inv!==caseInv);
  const totalCount = ids.reduce((sum,id)=>sum+state.inventar.filter(i=>i.cat===id && i.inv!==caseInv).length,0);
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
          ${directItems.map(i=>{
            const already = existingChildren.has(i.inv);
            return `
            <button class="item-card" data-action="add-item-to-flightcase" data-case="${caseInv}" data-inv="${i.inv}" ${already?'disabled style="opacity:.4;"':''}>
              <div class="ic-body">
                <span class="inv-num mono">${i.inv}</span>
                <span class="ic-title">${esc(i.bez)}</span>
                <span class="ic-meta">${esc(i.standort)}</span>
              </div>
              ${already?`<span class="pill pill-off">${t('already_in_case')}</span>`:''}
            </button>`; }).join('')}
          ${children.map(c=>renderFlightcaseContentPickNode(c,depth+1,caseInv,existingChildren)).join('')}
        </div>
      ` : ''}
    </div>`;
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
      ${v.items.map(({inv,menge})=>{ const it=byInv(inv); if(!it) return ''; const lineTotal = it.miete*days*menge; return `
        <div class="item-card" style="cursor:default;">
          <div class="ic-body">
            <span class="inv-num mono">${it.inv}</span>
            <span class="ic-title">${esc(it.bez)}${menge>1?` × ${menge}`:''}</span>
            <span class="ic-meta">${fmtEuro(it.miete)} × ${days}${menge>1?` × ${menge}`:''} = ${fmtEuro(lineTotal)}</span>
          </div>
        </div>`; }).join('')}
    </div>
    <div class="btn-row">
      <button class="btn btn-secondary" data-action="open-packlist" data-id="${v.id}">${t('btn_open_packlist')}</button>
      <button class="btn btn-secondary" data-action="export-invoice" data-id="${v.id}">${t('btn_export_invoice')}</button>
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
    <div class="divider"></div>
    <div class="btn-row">
      <button class="btn btn-secondary" data-action="toggle-archive-rental" data-id="${v.id}">${v.archiviert? t('btn_unarchive') : t('btn_archive')}</button>
      <button class="btn btn-secondary" data-action="delete-rental" data-id="${v.id}" style="color:var(--status-crit);">${t('btn_delete_rental')}</button>
    </div>
  `;
}

function newRentalSheet(){
  const d = ui.newRentalDraft || (ui.newRentalDraft = { kunde:'', customerId:null, von:'2026-08-20', bis:'2026-08-22', items:[] });
  const days = rentalDays(d.von,d.bis);
  const total = d.items.reduce((sum,it)=>{ const item=byInv(it.inv); return sum+(item?item.miete*days*it.menge:0); },0);
  return `
    ${state.customers.length? `
      <div class="field">
        <label>${t('field_customer_pick')}</label>
        <select data-action="pick-rental-customer">
          <option value="">${t('opt_free_text')}</option>
          ${state.customers.map(c=>`<option value="${c.id}" ${d.customerId===c.id?'selected':''}>${esc(c.name)}</option>`).join('')}
        </select>
      </div>
    ` : ''}
    <div class="field">
      <label>${t('field_kunde')}</label>
      <input type="text" data-action="draft-rental" data-field="kunde" value="${esc(d.kunde)}" placeholder="${t('kunde_placeholder')}" />
    </div>
    <div class="field-row">
      <div class="field"><label>${t('field_von')}</label><input type="date" data-action="draft-rental" data-field="von" value="${esc(d.von)}" /></div>
      <div class="field"><label>${t('field_bis')}</label><input type="date" data-action="draft-rental" data-field="bis" value="${esc(d.bis)}" /></div>
    </div>
    ${state.bundles.length? `
      <div class="field">
        <label>${t('field_add_bundle')}</label>
        <select data-action="add-bundle-to-rental">
          <option value="">${t('opt_choose_bundle')}</option>
          ${state.bundles.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('')}
        </select>
        ${d.lastBundleHint? `<span class="field-hint">${esc(d.lastBundleHint)}</span>` : ''}
      </div>
    ` : ''}
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
      ${v.items.map(({inv,menge})=>{ const it=byInv(inv); if(!it) return ''; const done = !!v.pack[inv]; return `
        <div class="pack-row ${done?'checked':''}" data-action="toggle-pack" data-id="${v.id}" data-inv="${inv}">
          <div class="pack-check ${done?'checked':''}">${done?ICONS.check:''}</div>
          <div style="flex:1;">
            <div class="pr-title">${esc(it.bez)}${menge>1?` × ${menge}`:''}</div>
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
  v.items.forEach(({inv,menge})=>{
    const it = byInv(inv);
    if(!it) return;
    const node = catNode(it.cat);
    const name = node ? node.name : '';
    if(!(name in groupIndex)){
      groupIndex[name] = groups.length;
      groups.push({ name, items: [] });
    }
    groups[groupIndex[name]].items.push({ ...it, menge });
  });

  const rows = groups.map((g,gi)=> g.items.map((it,idx)=>`
      <tr class="${idx===0?'group-start':''}">
        ${idx===0? `<td class="cat" rowspan="${g.items.length}">${esc(g.name)}</td>` : ''}
        <td class="item">${esc(it.bez)}${it.menge>1?` × ${it.menge}`:''}</td>
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
  .mark { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex: none; }
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
  <div class="letterhead"><img class="mark" src="/icons/brand-mark.png" alt=""><span class="brand">Fundus</span></div>
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

function exportInvoicePdf(v){
  const days = rentalDays(v.von,v.bis);
  const todayIso = new Date().toISOString().slice(0,10);
  const rows = v.items.map((it,idx)=>{
    const item = byInv(it.inv);
    if(!item) return '';
    const lineTotal = item.miete*days*it.menge;
    return `
      <tr>
        <td class="pos">${idx+1}</td>
        <td class="item">${esc(item.bez)}</td>
        <td class="num mono">${it.menge}</td>
        <td class="num mono">${days}</td>
        <td class="num mono">${fmtEuro(item.miete)}</td>
        <td class="num mono">${fmtEuro(lineTotal)}</td>
      </tr>`;
  }).join('');
  const total = rentalTotal(v);

  const html = `<!doctype html>
<html lang="${ui.lang}">
<head>
<meta charset="utf-8">
<title>${esc(t('sheet_invoice'))} ${esc(v.id)}</title>
<style>
  @page { margin: 20mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1c2036; margin: 0; padding: 24px; }
  .letterhead { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
  .mark { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; flex: none; }
  .brand { font-weight: 700; font-size: 14px; letter-spacing: -.01em; }
  h1 { font-size: 20px; margin: 0 0 3px; letter-spacing: -.01em; }
  .sub { color: #5c6379; font-size: 13px; margin: 0 0 20px; }
  .meta { display: flex; justify-content: space-between; gap: 36px; margin-bottom: 26px; }
  .meta div span { display:block; color:#5c6379; font-size: 10.5px; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 3px; }
  .meta div b { font-size: 13.5px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 18px; }
  th { text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: .04em; color: #5c6379; padding: 0 8px 8px 0; border-bottom: 1px solid #dadfea; }
  th.num, td.num { text-align: right; }
  td { padding: 7px 8px 7px 0; vertical-align: top; border-bottom: 1px solid #eef0f5; }
  .totals { display: flex; justify-content: flex-end; }
  .totals table { width: auto; min-width: 240px; margin: 0; }
  .totals td { border: none; padding: 4px 0; }
  .totals .total-row td { font-weight: 700; font-size: 15px; border-top: 1px solid #1c2036; padding-top: 8px; }
  footer { margin-top: 30px; font-size: 10.5px; color: #9aa1b5; }
</style>
</head>
<body>
  <div class="letterhead"><img class="mark" src="/icons/brand-mark.png" alt=""><span class="brand">Fundus</span></div>
  <h1>${esc(t('sheet_invoice'))}</h1>
  <p class="sub">${esc(t('invoice_no',{id:v.id}))} · ${fmtDate(todayIso)}</p>
  <div class="meta">
    <div><span>${esc(t('field_kunde'))}</span><b>${esc(v.kunde)}</b></div>
    <div><span>${esc(t('label_period'))}</span><b>${fmtDate(v.von)} – ${fmtDate(v.bis)} (${days} ${esc(t('pdf_days'))})</b></div>
  </div>
  <table>
    <thead><tr>
      <th>#</th><th>${esc(t('field_bez'))}</th><th class="num">${esc(t('invoice_qty'))}</th><th class="num">${esc(t('field_miettage'))}</th><th class="num">${esc(t('invoice_rate'))}</th><th class="num">${esc(t('invoice_sum'))}</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="totals">
    <table>
      <tr class="total-row"><td>${esc(t('field_total'))}</td><td class="num mono">${fmtEuro(total)}</td></tr>
    </table>
  </div>
  <footer>Fundus · ${esc(t('invoice_footer'))}</footer>
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
  const d = ui.returnDraft || (ui.returnDraft = Object.fromEntries(v.items.map(({inv})=>[inv,'Verfügbar'])));
  return `
    <p class="page-sub" style="margin-bottom:10px;">${t('return_intro')}</p>
    ${v.items.map(({inv,menge})=>{ const it=byInv(inv); if(!it) return ''; if(it.menge>1){ return `
      <div class="field">
        <label>${it.inv} — ${esc(it.bez)}${menge>1?` × ${menge}`:''}</label>
        <p class="field-hint">${t('bulk_return_note')}</p>
      </div>`; } return `
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

/* ---------- customers ---------- */

function customersSheet(){
  const list = [...state.customers].sort((a,b)=>a.name.localeCompare(b.name));
  return `
    <button class="btn btn-secondary" data-action="open-new-customer" style="margin-bottom:14px;">${t('btn_new_customer')}</button>
    <div class="card-list">
      ${list.length? list.map(c=>`
        <button class="item-card" data-action="open-customer" data-id="${c.id}">
          <div class="ic-body">
            <span class="ic-title">${esc(c.name)}</span>
            <span class="ic-meta">${esc(c.firma||c.email||c.telefon||'')}</span>
          </div>
        </button>
      `).join('') : `<div class="empty-state">${ICONS.empty}<p>${t('empty_customers')}</p></div>`}
    </div>
  `;
}

function customerDetailSheet(c){
  const rentals = state.vermietungen.filter(v=>v.customer_id===c.id).sort((a,b)=> a.von<b.von?1:-1);
  return `
    <div class="field"><label>${t('field_name')}</label><input type="text" data-action="edit-customer" data-field="name" data-id="${c.id}" value="${esc(c.name)}" /></div>
    <div class="field-row">
      <div class="field"><label>${t('field_firma')}</label><input type="text" data-action="edit-customer" data-field="firma" data-id="${c.id}" value="${esc(c.firma)}" /></div>
      <div class="field"><label>${t('field_email')}</label><input type="email" data-action="edit-customer" data-field="email" data-id="${c.id}" value="${esc(c.email)}" /></div>
    </div>
    <div class="field-row">
      <div class="field"><label>${t('field_telefon')}</label><input type="text" data-action="edit-customer" data-field="telefon" data-id="${c.id}" value="${esc(c.telefon)}" /></div>
      <div class="field"><label>${t('field_adresse')}</label><input type="text" data-action="edit-customer" data-field="adresse" data-id="${c.id}" value="${esc(c.adresse)}" /></div>
    </div>
    <div class="field"><label>${t('field_notiz')}</label><textarea data-action="edit-customer" data-field="notiz" data-id="${c.id}">${esc(c.notiz)}</textarea></div>

    <div class="divider"></div>
    <div class="section-head"><h2>${t('label_rental_history')}</h2></div>
    <div class="card-list">
      ${rentals.length? rentals.map(v=>`
        <button class="item-card" data-action="open-rental" data-id="${v.id}">
          <div class="ic-body">
            <span class="inv-num mono">${fmtDate(v.von)} – ${fmtDate(v.bis)}</span>
            <span class="ic-title">${fmtEuro(rentalTotal(v))}</span>
          </div>
          <span class="pill ${rentalStatusPill(v.status)}">${rentalStatusLabel(v.status)}</span>
        </button>
      `).join('') : `<p class="field-hint">${t('empty_customer_rentals')}</p>`}
    </div>

    <div class="divider"></div>
    <button class="btn btn-secondary" data-action="delete-customer" data-id="${c.id}" style="color:var(--status-crit);">${t('btn_delete_customer')}</button>
  `;
}

function newCustomerSheet(){
  const d = ui.newCustomerDraft || (ui.newCustomerDraft = { name:'', firma:'', email:'', telefon:'', adresse:'', notiz:'' });
  return `
    <div class="field"><label>${t('field_name')}</label><input type="text" data-action="draft-customer" data-field="name" value="${esc(d.name)}" /></div>
    <div class="field-row">
      <div class="field"><label>${t('field_firma')}</label><input type="text" data-action="draft-customer" data-field="firma" value="${esc(d.firma)}" /></div>
      <div class="field"><label>${t('field_email')}</label><input type="email" data-action="draft-customer" data-field="email" value="${esc(d.email)}" /></div>
    </div>
    <div class="field-row">
      <div class="field"><label>${t('field_telefon')}</label><input type="text" data-action="draft-customer" data-field="telefon" value="${esc(d.telefon)}" /></div>
      <div class="field"><label>${t('field_adresse')}</label><input type="text" data-action="draft-customer" data-field="adresse" value="${esc(d.adresse)}" /></div>
    </div>
    <div class="field"><label>${t('field_notiz')}</label><textarea data-action="draft-customer" data-field="notiz">${esc(d.notiz)}</textarea></div>
    <div class="btn-row">
      <button class="btn btn-primary" data-action="save-new-customer" ${!d.name?'disabled style="opacity:.5;"':''}>${t('btn_create_customer')}</button>
    </div>
  `;
}

/* ---------- equipment bundles / sets ---------- */

function bundlesSheet(){
  const list = [...state.bundles].sort((a,b)=>a.name.localeCompare(b.name));
  return `
    <p class="field-hint" style="margin-bottom:14px;">${t('bundles_hint')}</p>
    <div class="card-list">
      ${list.length? list.map(b=>`
        <button class="item-card" data-action="open-bundle" data-id="${b.id}">
          <div class="ic-body">
            <span class="ic-title">${esc(b.name)}</span>
            <span class="ic-meta">${t('n_selected',{n:b.items.length})}${b.suggestedPrice!=null?' · '+t('suggested_price_short',{price:fmtEuro(b.suggestedPrice)}):''}</span>
          </div>
        </button>
      `).join('') : `<div class="empty-state">${ICONS.empty}<p>${t('empty_bundles')}</p></div>`}
    </div>
  `;
}

function bundleDetailSheet(b){
  return `
    <div class="field"><label>${t('field_name')}</label><input type="text" data-action="edit-bundle" data-field="name" data-id="${b.id}" value="${esc(b.name)}" /></div>
    <div class="field"><label>${t('field_notiz')}</label><textarea data-action="edit-bundle" data-field="notiz" data-id="${b.id}">${esc(b.notiz)}</textarea></div>
    <div class="field">
      <label>${t('field_suggested_price')}</label>
      <input type="number" min="0" step="0.01" data-action="edit-bundle" data-field="suggestedPrice" data-id="${b.id}" value="${b.suggestedPrice!=null?b.suggestedPrice:''}" placeholder="${t('optional')}" />
      <span class="field-hint">${t('suggested_price_hint')}</span>
    </div>
    <div class="divider"></div>
    <div class="section-head"><h2>${t('label_articles')}</h2></div>
    <div class="card-list">
      ${b.items.map(it=>{ const item=byInv(it.inv); if(!item) return ''; return `
        <div class="item-card" style="cursor:default;">
          <div class="ic-body">
            <span class="inv-num mono">${item.inv}</span>
            <span class="ic-title">${esc(item.bez)}</span>
          </div>
          ${item.menge>1?`<input class="qty-input" type="number" min="1" max="${item.menge}" value="${it.menge}" data-action="set-bundle-item-qty" data-id="${b.id}" data-inv="${it.inv}" />`:''}
          <button class="icon-btn" data-action="remove-bundle-item" data-id="${b.id}" data-inv="${it.inv}">${ICONS.close}</button>
        </div>`; }).join('')}
    </div>
    <button class="btn btn-secondary" data-action="open-bundle-add-item" data-for="bundle" data-id="${b.id}" style="margin-bottom:14px;">${t('btn_add_bundle_item')}</button>
    <div class="divider"></div>
    <button class="btn btn-secondary" data-action="delete-bundle" data-id="${b.id}" style="color:var(--status-crit);">${t('btn_delete_bundle')}</button>
  `;
}

function newBundleSheet(){
  const d = ui.newBundleDraft;
  if(!d) return '';
  return `
    <div class="field"><label>${t('field_name')}</label><input type="text" data-action="draft-bundle" data-field="name" value="${esc(d.name)}" placeholder="${t('bundle_name_placeholder')}" /></div>
    <div class="field">
      <label>${t('field_suggested_price')}</label>
      <input type="number" min="0" step="0.01" data-action="draft-bundle" data-field="suggestedPrice" value="${esc(d.suggestedPrice)}" placeholder="${t('optional')}" />
      <span class="field-hint">${t('suggested_price_hint')}</span>
    </div>
    <div class="field"><label>${t('field_notiz')}</label><textarea data-action="draft-bundle" data-field="notiz">${esc(d.notiz)}</textarea></div>
    <div class="section-head"><h2>${t('label_articles')}</h2></div>
    <div class="card-list">
      ${d.items.map(it=>{ const item=byInv(it.inv); if(!item) return ''; return `
        <div class="item-card" style="cursor:default;">
          <div class="ic-body">
            <span class="inv-num mono">${item.inv}</span>
            <span class="ic-title">${esc(item.bez)}</span>
          </div>
          ${item.menge>1?`<input class="qty-input" type="number" min="1" max="${item.menge}" value="${it.menge}" data-action="set-bundle-draft-qty" data-inv="${it.inv}" />`:''}
          <button class="icon-btn" data-action="remove-bundle-draft-item" data-inv="${it.inv}">${ICONS.close}</button>
        </div>`; }).join('')}
    </div>
    <button class="btn btn-secondary" data-action="open-bundle-add-item" data-for="draft" style="margin-bottom:14px;">${t('btn_add_bundle_item')}</button>
    <div class="btn-row">
      <button class="btn btn-primary" data-action="save-new-bundle" ${(!d.name||!d.items.length)?'disabled style="opacity:.5;"':''}>${t('btn_create_bundle')}</button>
    </div>
  `;
}

function bundleAddItemSheet(s){
  const items = s.for==='draft' ? ui.newBundleDraft.items : state.bundles.find(x=>x.id===s.id).items;
  const existingInvs = new Set(items.map(it=>it.inv));
  return `
    <p class="field-hint" style="margin-bottom:12px;">${t('bundle_add_item_hint')}</p>
    <div class="cat-tree">
      ${catRoots().map(r=>renderBundleAddCatNode(r,0,s,existingInvs)).join('')}
    </div>
  `;
}

function renderBundleAddCatNode(node, depth, s, existingInvs){
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
          ${directItems.map(i=>{
            const already = existingInvs.has(i.inv);
            return `
            <button class="item-card" data-action="add-item-to-bundle" data-for="${s.for}" ${s.for==='bundle'?`data-id="${s.id}"`:''} data-inv="${i.inv}" ${already?'disabled style="opacity:.4;"':''}>
              <div class="ic-body">
                <span class="inv-num mono">${i.inv}</span>
                <span class="ic-title">${esc(i.bez)}</span>
                <span class="ic-meta">${i.menge>1?t('stock_label',{n:i.menge}):fmtEuro(i.miete)+t('per_day')}</span>
              </div>
              ${already?`<span class="pill pill-off">${t('already_in_set')}</span>`:''}
            </button>`; }).join('')}
          ${children.map(c=>renderBundleAddCatNode(c,depth+1,s,existingInvs)).join('')}
        </div>
      ` : ''}
    </div>`;
}

/* ---------- statistics ---------- */

function statsSheet(){
  const usage = {};
  state.vermietungen.forEach(v=>{
    const days = rentalDays(v.von, v.bis);
    v.items.forEach(({inv,menge})=>{
      const item = byInv(inv);
      if(!item) return;
      if(!usage[inv]) usage[inv] = { inv, bez:item.bez, count:0, totalQty:0, revenue:0 };
      usage[inv].count += 1;
      usage[inv].totalQty += menge;
      usage[inv].revenue += item.miete*days*menge;
    });
  });
  const ranked = Object.values(usage).sort((a,b)=>b.count-a.count).slice(0,20);
  const totalRevenue = state.vermietungen.reduce((sum,v)=>sum+rentalTotal(v),0);
  const maxCount = ranked.length ? ranked[0].count : 1;

  return `
    <div class="stat-grid" style="margin-bottom:20px;">
      <div class="stat-tile"><span class="stat-num">${state.vermietungen.length}</span><span class="stat-label">${t('stat_total_rentals')}</span></div>
      <div class="stat-tile"><span class="stat-num">${fmtEuro(totalRevenue)}</span><span class="stat-label">${t('stat_total_revenue')}</span></div>
      <div class="stat-tile"><span class="stat-num">${state.customers.length}</span><span class="stat-label">${t('nav_customers')}</span></div>
      <div class="stat-tile"><span class="stat-num">${state.inventar.length}</span><span class="stat-label">${t('stat_total')}</span></div>
    </div>
    <div class="section-head"><h2>${t('stat_most_used')}</h2></div>
    <div class="usage-list">
      ${ranked.length? ranked.map(u=>`
        <div class="usage-row">
          <div class="usage-row-top">
            <span class="ic-title">${esc(u.bez)}</span>
            <span class="mono">${u.count}×</span>
          </div>
          <div class="usage-bar"><div class="usage-bar-fill" style="width:${Math.round(u.count/maxCount*100)}%;"></div></div>
          <div class="field-hint">${esc(u.inv)} · ${fmtEuro(u.revenue)} ${t('stat_revenue_generated')}</div>
        </div>
      `).join('') : `<div class="empty-state">${ICONS.empty}<p>${t('empty_stats')}</p></div>`}
    </div>
  `;
}

/* ---------- availability timeline ---------- */

function timelineSheet(){
  const windowDays = 60;
  const start = new Date(TODAY);
  const rentals = state.vermietungen
    .filter(v=>v.status!=='Abgeschlossen')
    .sort((a,b)=> a.von<b.von?-1:1);

  function dayOffset(iso){
    const d = new Date(iso+'T00:00:00');
    return Math.round((d-start)/86400000);
  }

  const weekMarks = [];
  for(let i=0;i<=windowDays;i+=7){
    const d = new Date(start); d.setDate(d.getDate()+i);
    weekMarks.push({ offset:i, label: d.toLocaleDateString(ui.lang==='en'?'en-GB':'de-DE',{day:'2-digit',month:'2-digit'}) });
  }

  const rows = rentals.map(v=>{
    const from = Math.max(0, dayOffset(v.von));
    const to = Math.min(windowDays, dayOffset(v.bis)+1);
    if(to<=0 || from>=windowDays) return '';
    const leftPct = (from/windowDays)*100;
    const widthPct = Math.max(1.5, ((to-from)/windowDays)*100);
    return `
      <div class="timeline-row">
        <div class="timeline-label">
          <span class="ic-title">${esc(v.kunde)}</span>
          <span class="field-hint" style="margin:0;">${fmtDate(v.von)} – ${fmtDate(v.bis)}</span>
        </div>
        <div class="timeline-track">
          <button class="timeline-bar ${rentalStatusPill(v.status)}" style="left:${leftPct}%;width:${widthPct}%;" data-action="open-rental" data-id="${v.id}" title="${esc(v.kunde)}"></button>
        </div>
      </div>`;
  }).join('');

  return `
    <p class="field-hint" style="margin-bottom:14px;">${t('timeline_hint',{n:windowDays})}</p>
    <div class="timeline-ruler">
      ${weekMarks.map(w=>`<span class="timeline-mark" style="left:${(w.offset/windowDays)*100}%;">${esc(w.label)}</span>`).join('')}
    </div>
    <div class="timeline-body">
      ${rows.trim() ? rows : `<div class="empty-state">${ICONS.empty}<p>${t('empty_timeline')}</p></div>`}
    </div>
  `;
}

/* ---------- raw data explorer ---------- */

function itemsAsTextClient(items){ return items.map(it=>`${it.inv} x${it.menge}`).join('; '); }

function dataExplorerSheet(){
  function formatCell(v){
    if(v===null||v===undefined) return '';
    if(typeof v==='object') return JSON.stringify(v);
    if(typeof v==='boolean') return v?'true':'false';
    return String(v);
  }
  function sortRows(rows, tableKey){
    const sortState = ui.explorerSort[tableKey];
    if(!sortState) return rows;
    const { col, dir } = sortState;
    const sorted = [...rows].sort((a,b)=>{
      const av = a[col], bv = b[col];
      if(av==null && bv==null) return 0;
      if(av==null) return -1;
      if(bv==null) return 1;
      if(typeof av==='number' && typeof bv==='number') return av-bv;
      return String(av).localeCompare(String(bv), undefined, {numeric:true, sensitivity:'base'});
    });
    return dir==='desc' ? sorted.reverse() : sorted;
  }
  function rawTable(tableKey, title, rows, columns){
    const sorted = sortRows(rows, tableKey);
    const sortState = ui.explorerSort[tableKey];
    return `
      <div class="section-head"><h2>${esc(title)} (${rows.length})</h2></div>
      ${rows.length ? `
        <div class="raw-table-wrap">
          <table class="raw-table">
            <thead><tr>${columns.map(c=>{
              const active = sortState && sortState.col===c;
              const arrow = active ? (sortState.dir==='desc'?' ▾':' ▴') : '';
              return `<th class="raw-th-sort" data-action="sort-explorer" data-table="${tableKey}" data-col="${c}">${esc(c)}${arrow}</th>`;
            }).join('')}</tr></thead>
            <tbody>
              ${sorted.map(r=>`<tr>${columns.map(c=>`<td>${esc(formatCell(r[c]))}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
      ` : `<p class="field-hint">${t('explorer_empty')}</p>`}
    `;
  }

  return `
    <p class="field-hint" style="margin-bottom:16px;">${t('explorer_intro')}</p>
    ${rawTable('inventar', t('tab_inventar'), state.inventar, ['inv','cat','tag','bez','hersteller','modell','serien','standort','parent','status','miete','pruef','letzte','naechste','notiz','menge','foto'])}
    ${rawTable('vermietungen', t('tab_vermietungen'), state.vermietungen.map(v=>({...v, items:itemsAsTextClient(v.items), pack:JSON.stringify(v.pack)})), ['id','kunde','customer_id','von','bis','status','archiviert','items','pack'])}
    ${rawTable('customers', t('nav_customers'), state.customers, ['id','name','firma','email','telefon','adresse','notiz','created_at'])}
    ${rawTable('bundles', t('nav_bundles'), state.bundles.map(b=>({...b, items:itemsAsTextClient(b.items)})), ['id','name','notiz','suggestedPrice','items'])}
    ${rawTable('tags', t('nav_tags'), state.tags, ['id','code','name','cat'])}
    ${rawTable('testTypes', t('nav_test_types'), state.testTypes.map(tt=>({...tt, items:tt.items.map(i=>i.text).join('; ')})), ['id','name','items'])}
    ${rawTable('categories', t('cat_title'), state.categories, ['id','code','name','parent'])}
    ${rawTable('standorte', t('standorte_title'), state.standorte.map(name=>({name})), ['name'])}
    ${rawTable('schwellen', t('thresh_title'), Object.entries(state.schwellen).map(([key,value])=>({key,value})), ['key','value'])}
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
    case 'open-flightcase-picker':
      pushSheet({type:'pick-flightcase', inv:t2.dataset.inv}); break;
    case 'open-flightcase-add-item':
      pushSheet({type:'flightcase-add-item', inv:t2.dataset.inv}); break;
    case 'assign-flightcase': {
      const item = byInv(t2.dataset.inv);
      const caseInv = t2.dataset.case || null;
      item.parent = caseInv;
      if(caseInv){ const box = byInv(caseInv); if(box) item.standort = box.standort; }
      popSheet();
      api('PATCH', `/api/inventar/${encodeURIComponent(item.inv)}`, {parent: caseInv, standort: item.standort}).catch(()=>showToast(t('toast_sync_failed')));
      break;
    }
    case 'add-item-to-flightcase': {
      const box = byInv(t2.dataset.case);
      const item = byInv(t2.dataset.inv);
      item.parent = box.inv;
      item.standort = box.standort;
      popSheet();
      api('PATCH', `/api/inventar/${encodeURIComponent(item.inv)}`, {parent: box.inv, standort: item.standort}).catch(()=>showToast(t('toast_sync_failed')));
      break;
    }
    case 'pick-cat': {
      const top = topSheet();
      const id = t2.dataset.id;
      if(top.for==='draft'){
        ui.newItemDraft.cat = id;
        ui.newItemDraft.tag = null;
      } else {
        const item = byInv(top.inv);
        item.cat = id;
        item.tag = null;
        api('PATCH', `/api/inventar/${encodeURIComponent(top.inv)}`, {cat:id, tag:null}).catch(()=>showToast(t('toast_sync_failed')));
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
      const idx = d.items.findIndex(x=>x.inv===inv);
      if(idx>=0) d.items.splice(idx,1); else d.items.push({inv, menge:1});
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
    case 'export-invoice': {
      const v = state.vermietungen.find(x=>x.id===t2.dataset.id);
      exportInvoicePdf(v);
      break;
    }
    case 'remove-item-photo': {
      const item = byInv(t2.dataset.inv);
      if(item) item.foto = '';
      render();
      api('DELETE', `/api/inventar/${encodeURIComponent(t2.dataset.inv)}/photo`).catch(()=>showToast(t('toast_sync_failed')));
      break;
    }
    case 'remove-draft-photo':
      ui.newItemDraft.fotoDataUrl = null; render(); break;
    case 'toggle-checklist-item': {
      const item = byInv(t2.dataset.inv);
      const entry = item.checklist.find(c=>c.id===t2.dataset.id);
      if(entry){
        entry.checked = !entry.checked;
        render();
        api('PATCH', `/api/inventar/${encodeURIComponent(item.inv)}/checklist/${encodeURIComponent(entry.id)}`, {checked:entry.checked}).catch(()=>showToast(t('toast_sync_failed')));
      }
      break;
    }
    case 'remove-checklist-item': {
      const item = byInv(t2.dataset.inv);
      item.checklist = item.checklist.filter(c=>c.id!==t2.dataset.id);
      render();
      api('DELETE', `/api/inventar/${encodeURIComponent(item.inv)}/checklist/${encodeURIComponent(t2.dataset.id)}`).catch(()=>showToast(t('toast_sync_failed')));
      break;
    }
    case 'add-checklist-item': {
      const inv = t2.dataset.inv;
      const inp = document.getElementById(`new-checklist-item-${inv}`);
      if(inp && inp.value.trim()){
        doAddChecklistItem(inv, inp.value.trim());
      }
      break;
    }
    case 'toggle-draft-test-type': {
      const d = ui.newItemDraft; const id = t2.dataset.id;
      const idx = d.testTypes.indexOf(id);
      if(idx>=0) d.testTypes.splice(idx,1); else d.testTypes.push(id);
      render(); break;
    }
    case 'add-draft-checklist-extra': {
      const inp = document.getElementById('new-checklist-extra');
      if(inp && inp.value.trim()){ ui.newItemDraft.checklistExtra.push(inp.value.trim()); render(); }
      break;
    }
    case 'remove-draft-checklist-extra': {
      const idx = parseInt(t2.dataset.idx,10);
      ui.newItemDraft.checklistExtra.splice(idx,1);
      render(); break;
    }
    case 'toggle-cat-expand':
      toggleCatExpand(t2.dataset.id); render(); break;
    case 'toggle-settings-cat-expand': {
      const id = t2.dataset.id;
      if(ui.expandedSettingsCats.has(id)) ui.expandedSettingsCats.delete(id); else ui.expandedSettingsCats.add(id);
      render(); break;
    }
    case 'add-root-cat':
      doAddRootCat(); break;
    case 'add-subcat':
      doAddSubcat(t2.dataset.id); break;
    case 'delete-cat':
      doDeleteCat(t2.dataset.id); break;
    case 'add-tag': {
      const wrap = t2.closest('.tag-add-inline');
      const [codeInput, nameInput] = wrap.querySelectorAll('input');
      doAddTag(t2.dataset.cat, codeInput.value, nameInput.value);
      break;
    }
    case 'delete-tag':
      doDeleteTag(t2.dataset.id); break;
    case 'toggle-test-type-expand':
      if(ui.expandedTestTypes.has(t2.dataset.id)) ui.expandedTestTypes.delete(t2.dataset.id); else ui.expandedTestTypes.add(t2.dataset.id);
      render(); break;
    case 'delete-test-type':
      doDeleteTestType(t2.dataset.id); break;
    case 'delete-test-type-item':
      doRemoveTestTypeItem(t2.dataset.tt, t2.dataset.id); break;
    case 'add-test-type-item': {
      const ttId = t2.dataset.tt;
      const inp = document.getElementById(`new-tt-item-${ttId}`);
      if(inp && inp.value.trim()) doAddTestTypeItem(ttId, inp.value.trim());
      break;
    }
    case 'add-test-type':
      doAddTestType(); break;
    case 'toggle-show-archived':
      ui.showArchived = !ui.showArchived; render(); break;
    case 'toggle-archive-rental': {
      const v = state.vermietungen.find(x=>x.id===t2.dataset.id);
      v.archiviert = !v.archiviert;
      closeSheets();
      showToast(v.archiviert ? t('toast_rental_archived') : t('toast_rental_unarchived'));
      api('PATCH', `/api/vermietungen/${v.id}`, {archiviert:v.archiviert}).catch(()=>showToast(t('toast_sync_failed')));
      break;
    }
    case 'delete-rental':
      doDeleteRental(t2.dataset.id); break;
    case 'delete-item':
      doDeleteItem(t2.dataset.inv); break;
    case 'sort-explorer': {
      const table = t2.dataset.table, col = t2.dataset.col;
      const cur = ui.explorerSort[table];
      if(cur && cur.col===col) ui.explorerSort[table] = {col, dir: cur.dir==='asc'?'desc':'asc'};
      else ui.explorerSort[table] = {col, dir:'asc'};
      render(); break;
    }
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
    case 'set-theme':
      ui.theme = t2.dataset.val; localStorage.setItem('fundus-theme', ui.theme); applyTheme(ui.theme); render(); break;
    case 'open-customers':
      pushSheet({type:'customers'}); break;
    case 'open-customer':
      pushSheet({type:'customer', id:t2.dataset.id}); break;
    case 'open-new-customer':
      ui.newCustomerDraft=null; pushSheet({type:'new-customer'}); break;
    case 'save-new-customer':
      doSaveNewCustomer(); break;
    case 'delete-customer':
      doDeleteCustomer(t2.dataset.id); break;
    case 'open-bundles':
      pushSheet({type:'bundles'}); break;
    case 'open-timeline':
      pushSheet({type:'timeline'}); break;
    case 'open-stats':
      pushSheet({type:'stats'}); break;
    case 'toggle-select-mode':
      ui.selectMode = !ui.selectMode;
      if(!ui.selectMode){ ui.selectedInv = new Set(); ui.selectedQty = {}; }
      render(); break;
    case 'toggle-select-item': {
      const inv = t2.dataset.inv;
      if(ui.selectedInv.has(inv)){ ui.selectedInv.delete(inv); delete ui.selectedQty[inv]; }
      else { ui.selectedInv.add(inv); ui.selectedQty[inv] = 1; }
      render(); break;
    }
    case 'bulk-add-to-rental': {
      const items = [...ui.selectedInv].map(inv=>({inv, menge: ui.selectedQty[inv]||1}));
      ui.selectMode = false; ui.selectedInv = new Set(); ui.selectedQty = {};
      ui.newRentalDraft = { kunde:'', customerId:null, von:'2026-08-20', bis:'2026-08-22', items };
      openSheet({type:'new-rental'});
      break;
    }
    case 'bulk-save-as-set': {
      const items = [...ui.selectedInv].map(inv=>({inv, menge: ui.selectedQty[inv]||1}));
      ui.selectMode = false; ui.selectedInv = new Set(); ui.selectedQty = {};
      ui.newBundleDraft = { name:'', notiz:'', suggestedPrice:'', items };
      openSheet({type:'new-bundle'});
      break;
    }
    case 'open-bundle':
      pushSheet({type:'bundle', id:t2.dataset.id}); break;
    case 'remove-bundle-item': {
      const b = state.bundles.find(x=>x.id===t2.dataset.id);
      b.items = b.items.filter(it=>it.inv!==t2.dataset.inv);
      render();
      api('PATCH', `/api/bundles/${b.id}`, {items:b.items}).catch(()=>showToast(t('toast_sync_failed')));
      break;
    }
    case 'delete-bundle':
      doDeleteBundle(t2.dataset.id); break;
    case 'save-new-bundle':
      doSaveNewBundle(); break;
    case 'remove-bundle-draft-item': {
      const d = ui.newBundleDraft;
      d.items = d.items.filter(it=>it.inv!==t2.dataset.inv);
      render(); break;
    }
    case 'open-bundle-add-item':
      pushSheet({type:'bundle-add-item', for:t2.dataset.for, id:t2.dataset.id}); break;
    case 'add-item-to-bundle': {
      const inv = t2.dataset.inv;
      if(t2.dataset.for==='draft'){
        const d = ui.newBundleDraft;
        if(!d.items.some(it=>it.inv===inv)) d.items.push({inv, menge:1});
      } else {
        const b = state.bundles.find(x=>x.id===t2.dataset.id);
        if(!b.items.some(it=>it.inv===inv)){
          b.items.push({inv, menge:1});
          api('PATCH', `/api/bundles/${b.id}`, {items:b.items}).catch(()=>showToast(t('toast_sync_failed')));
        }
      }
      popSheet();
      break;
    }
    case 'open-data-explorer':
      pushSheet({type:'data-explorer'}); break;
    case 'lock-now':
      api('POST', '/api/logout').finally(()=>location.reload());
      break;
  }
}

function onChange(e){
  const t2 = e.target.closest('[data-action]');
  if(!t2) return;
  const action = t2.dataset.action;
  if(action==='edit-item'){
    const item = byInv(t2.dataset.inv);
    const field = t2.dataset.field;
    const value = t2.type==='checkbox' ? t2.checked : (field==='menge' ? Math.max(1, parseInt(t2.value,10)||1) : field==='tag' ? (t2.value||null) : t2.value);
    item[field] = value;
    if(field==='status' || field==='menge') render();
    api('PATCH', `/api/inventar/${encodeURIComponent(item.inv)}`, {[field]: value}).catch(()=>showToast(t('toast_sync_failed')));
    return;
  }
  if(action==='upload-item-photo'){
    const inv = t2.dataset.inv;
    const file = t2.files && t2.files[0];
    if(!file) return;
    resizeImageToDataUrl(file, 320, 0.72).then(dataUrl=>{
      return api('POST', `/api/inventar/${encodeURIComponent(inv)}/photo`, {dataUrl});
    }).then(updated=>{
      const item = byInv(inv);
      if(item) item.foto = updated.foto;
      render();
    }).catch(()=>showToast(t('toast_sync_failed')));
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
    if(field==='kunde') ui.newRentalDraft.customerId = null;
    render();
    return;
  }
  if(action==='pick-rental-customer'){
    const d = ui.newRentalDraft;
    const id = t2.value;
    if(id){ const c = state.customers.find(x=>x.id===id); d.customerId=id; d.kunde=c.name; }
    else { d.customerId=null; }
    render();
    return;
  }
  if(action==='draft-customer'){
    ui.newCustomerDraft[t2.dataset.field] = t2.value;
    if(t2.dataset.field==='name') render();
    return;
  }
  if(action==='edit-customer'){
    const c = state.customers.find(x=>x.id===t2.dataset.id);
    c[t2.dataset.field] = t2.value;
    api('PATCH', `/api/customers/${c.id}`, {[t2.dataset.field]: t2.value}).catch(()=>showToast(t('toast_sync_failed')));
    return;
  }
  if(action==='add-bundle-to-rental'){
    const bundleId = t2.value;
    if(!bundleId) return;
    const b = state.bundles.find(x=>x.id===bundleId);
    const d = ui.newRentalDraft;
    b.items.forEach(bi=>{
      const item = byInv(bi.inv);
      if(!item) return;
      const existing = d.items.find(x=>x.inv===bi.inv);
      if(existing) existing.menge = Math.min(item.menge, existing.menge + bi.menge);
      else d.items.push({inv:bi.inv, menge:Math.min(item.menge, bi.menge)});
    });
    d.lastBundleHint = b.suggestedPrice!=null ? t('bundle_price_hint',{name:b.name, price:fmtEuro(b.suggestedPrice)}) : '';
    render();
    return;
  }
  if(action==='edit-bundle'){
    const b = state.bundles.find(x=>x.id===t2.dataset.id);
    const field = t2.dataset.field;
    const value = field==='suggestedPrice' ? (t2.value===''?null:parseFloat(t2.value)) : t2.value;
    b[field] = value;
    api('PATCH', `/api/bundles/${b.id}`, {[field]: value}).catch(()=>showToast(t('toast_sync_failed')));
    return;
  }
  if(action==='draft-bundle'){
    const d = ui.newBundleDraft;
    d[t2.dataset.field] = t2.value;
    if(t2.dataset.field==='name') render();
    return;
  }
  if(action==='set-bundle-draft-qty'){
    const d = ui.newBundleDraft;
    const entry = d.items.find(x=>x.inv===t2.dataset.inv);
    if(entry){
      const item = byInv(t2.dataset.inv);
      entry.menge = Math.min(item.menge, Math.max(1, parseInt(t2.value,10)||1));
      render();
    }
    return;
  }
  if(action==='set-bundle-item-qty'){
    const b = state.bundles.find(x=>x.id===t2.dataset.id);
    const entry = b.items.find(x=>x.inv===t2.dataset.inv);
    if(entry){
      const item = byInv(t2.dataset.inv);
      entry.menge = Math.min(item.menge, Math.max(1, parseInt(t2.value,10)||1));
      render();
      api('PATCH', `/api/bundles/${b.id}`, {items:b.items}).catch(()=>showToast(t('toast_sync_failed')));
    }
    return;
  }
  if(action==='draft-return'){
    ui.returnDraft[t2.dataset.inv] = t2.value; return;
  }
  if(action==='upload-draft-photo'){
    const file = t2.files && t2.files[0];
    if(!file) return;
    resizeImageToDataUrl(file, 320, 0.72).then(dataUrl=>{
      ui.newItemDraft.fotoDataUrl = dataUrl;
      render();
    }).catch(()=>showToast(t('toast_sync_failed')));
    return;
  }
  if(action==='set-select-item-qty'){
    const inv = t2.dataset.inv;
    const item = byInv(inv);
    ui.selectedQty[inv] = Math.min(item.menge, Math.max(1, parseInt(t2.value,10)||1));
    render();
    return;
  }
  if(action==='set-rental-item-qty'){
    const d = ui.newRentalDraft;
    const entry = d.items.find(x=>x.inv===t2.dataset.inv);
    if(entry){
      const item = byInv(t2.dataset.inv);
      entry.menge = Math.min(item.menge, Math.max(1, parseInt(t2.value,10)||1));
      render();
    }
    return;
  }
  if(action==='edit-test-type-name'){
    const tt = state.testTypes.find(x=>x.id===t2.dataset.id);
    tt.name = t2.value;
    api('PATCH', `/api/test-types/${tt.id}`, {name: tt.name}).catch(()=>showToast(t('toast_sync_failed')));
    return;
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
  if(action==='set-pin'){
    const value = t2.value.trim();
    if(!/^\d{4}$/.test(value)){ showToast(t('toast_pin_invalid')); render(); return; }
    state.pin = value;
    api('PATCH', '/api/settings', {pin: value})
      .then(()=>showToast(t('toast_pin_saved')))
      .catch(()=>showToast(t('toast_sync_failed')));
    return;
  }
  if(action==='set-rental-sort'){
    ui.rentalSort = t2.value; render(); return;
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
  const checklistTexts = d.pruef ? resolvedDraftChecklist(d) : [];
  const item = {
    inv:d.inv, cat:d.cat, tag:d.tag||null, bez:d.bez, hersteller:d.hersteller, modell:d.modell, serien:d.serien,
    standort:d.standort, parent:null, status:d.status||'Verfügbar', miete:parseFloat(d.miete)||0,
    pruef:!!d.pruef, letzte:d.letzte||null, naechste, notiz:d.notiz||'',
    menge:Math.max(1, parseInt(d.menge,10)||1), foto:'',
    checklist: checklistTexts.map((text,idx)=>({id:`tmp-${idx}`, text, checked:false}))
  };
  const fotoDataUrl = d.fotoDataUrl;
  state.inventar.push(item);
  closeSheets();
  showToast(t('toast_item_created',{inv:item.inv}));
  try {
    await api('POST', '/api/inventar', {...item, checklist: checklistTexts});
    if(fotoDataUrl){
      const updated = await api('POST', `/api/inventar/${encodeURIComponent(item.inv)}/photo`, {dataUrl: fotoDataUrl});
      const stateItem = byInv(item.inv);
      if(stateItem) stateItem.foto = updated.foto;
      render();
    }
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

// Item photos are meant to stay tiny (a quick visual reminder, not a
// gallery), so every upload is downscaled client-side before it ever
// touches the network or disk.
function resizeImageToDataUrl(file, maxDim, quality){
  return new Promise((resolve,reject)=>{
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => { img.onerror = reject; img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width*scale));
      const h = Math.max(1, Math.round(img.height*scale));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    }; img.src = reader.result; };
    reader.readAsDataURL(file);
  });
}

async function doSaveNewRental(){
  const d = ui.newRentalDraft;
  if(!d.kunde || !d.items.length) return;
  const kunde = d.kunde;
  const customerId = d.customerId || null;
  const items = d.items.map(it=>({...it}));
  closeSheets();
  showToast(t('toast_rental_created',{kunde}));
  try {
    const v = await api('POST', '/api/vermietungen', {kunde, customerId, von:d.von, bis:d.bis, items});
    state.vermietungen.push(v);
    items.forEach(({inv})=>{ const it=byInv(inv); if(it && it.menge<=1) it.status='Reserviert'; });
    render();
  } catch(e){
    showToast(t('toast_sync_failed'));
    loadState();
  }
}

async function doRentalStart(id){
  const v = state.vermietungen.find(x=>x.id===id);
  v.status='Aktiv';
  v.items.forEach(({inv})=>{ const it=byInv(inv); if(it && it.menge<=1) it.status='Vermietet'; });
  showToast(t('toast_handed_out'));
  render();
  try { await api('POST', `/api/vermietungen/${id}/start`); }
  catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}

async function doConfirmReturn(id){
  const v = state.vermietungen.find(x=>x.id===id);
  const d = ui.returnDraft;
  v.items.forEach(({inv})=>{ const it=byInv(inv); if(it && it.menge<=1) it.status = d[inv] || 'Verfügbar'; });
  v.status='Abgeschlossen';
  ui.returnDraft=null;
  closeSheets();
  showToast(t('toast_return_done'));
  try { await api('POST', `/api/vermietungen/${id}/return`, {statuses:d}); }
  catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}

async function doSaveNewCustomer(){
  const d = ui.newCustomerDraft;
  if(!d.name || !d.name.trim()) return;
  popSheet();
  showToast(t('toast_customer_created',{name:d.name}));
  try {
    const c = await api('POST', '/api/customers', d);
    state.customers.push(c);
    ui.newCustomerDraft = null;
    render();
  } catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}

async function doDeleteCustomer(id){
  state.customers = state.customers.filter(c=>c.id!==id);
  state.vermietungen.forEach(v=>{ if(v.customer_id===id) v.customer_id=null; });
  popSheet();
  showToast(t('toast_customer_deleted'));
  try { await api('DELETE', `/api/customers/${id}`); } catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}

async function doSaveNewBundle(){
  const d = ui.newBundleDraft;
  if(!d.name || !d.name.trim() || !d.items.length) return;
  closeSheets();
  showToast(t('toast_bundle_created',{name:d.name}));
  try {
    const b = await api('POST', '/api/bundles', {
      name: d.name, notiz: d.notiz, suggestedPrice: d.suggestedPrice===''?null:parseFloat(d.suggestedPrice), items: d.items
    });
    state.bundles.push(b);
    render();
  } catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}

async function doDeleteBundle(id){
  state.bundles = state.bundles.filter(b=>b.id!==id);
  popSheet();
  showToast(t('toast_bundle_deleted'));
  try { await api('DELETE', `/api/bundles/${id}`); } catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}

async function doAddRootCat(){
  const name = ui.lang==='en' ? 'New category' : 'Neue Hauptgruppe';
  try {
    const node = await api('POST', '/api/categories', {parent:null, name});
    state.categories.push(node);
    ui.expandedSettingsCats.add(node.id);
    render();
  } catch(e){ showToast(t('toast_sync_failed')); }
}
async function doAddSubcat(parentId){
  const name = ui.lang==='en' ? 'New subcategory' : 'Neue Unterkategorie';
  try {
    const node = await api('POST', '/api/categories', {parent:parentId, name});
    state.categories.push(node);
    ui.expandedSettingsCats.add(parentId);
    ui.expandedSettingsCats.add(node.id);
    render();
  } catch(e){ showToast(t('toast_sync_failed')); }
}
async function doDeleteRental(id){
  if(!confirm(t('confirm_delete_rental'))) return;
  state.vermietungen = state.vermietungen.filter(v=>v.id!==id);
  closeSheets();
  showToast(t('toast_rental_deleted'));
  try { await api('DELETE', `/api/vermietungen/${id}`); } catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}

async function doDeleteItem(inv){
  if(!confirm(t('confirm_delete_item'))) return;
  state.inventar = state.inventar.filter(i=>i.inv!==inv);
  closeSheets();
  showToast(t('toast_item_deleted',{inv}));
  try { await api('DELETE', `/api/inventar/${encodeURIComponent(inv)}`); } catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}

async function doAddChecklistItem(inv, text){
  const item = byInv(inv);
  const items = [...item.checklist.map(c=>({text:c.text, checked:c.checked})), {text, checked:false}];
  try {
    const updated = await api('PUT', `/api/inventar/${encodeURIComponent(inv)}/checklist`, {items});
    item.checklist = updated.checklist;
    render();
  } catch(e){ showToast(t('toast_sync_failed')); }
}

async function doDeleteCat(id){
  if(!confirm(t('confirm_delete_cat'))) return;
  try {
    await api('DELETE', `/api/categories/${id}`);
    state.categories = state.categories.filter(c=>c.id!==id);
    render();
  } catch(e){
    showToast(e.message==='category has subcategories -- delete or move those first' ? t('toast_cat_has_children')
      : e.message==='category still has items assigned -- move or delete those first' ? t('toast_cat_has_items')
      : e.message==='category still has tags -- delete those first' ? t('toast_cat_has_tags')
      : t('toast_sync_failed'));
  }
}
async function doAddTag(catId, code, name){
  code = (code||'').trim(); name = (name||'').trim();
  if(!code || !name) return;
  try {
    const tag = await api('POST', '/api/tags', {code, name, cat:catId});
    state.tags.push(tag);
    render();
  } catch(e){ showToast(t('toast_sync_failed')); }
}
async function doDeleteTag(id){
  if(!confirm(t('confirm_delete_tag'))) return;
  state.tags = state.tags.filter(tg=>tg.id!==id);
  state.inventar.forEach(i=>{ if(i.tag===id) i.tag=null; });
  render();
  try { await api('DELETE', `/api/tags/${id}`); } catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}
async function doAddTestType(){
  const inp = document.getElementById('new-test-type');
  if(!inp || !inp.value.trim()) return;
  const name = inp.value.trim();
  try {
    const tt = await api('POST', '/api/test-types', {name, items:[]});
    state.testTypes.push(tt);
    ui.expandedTestTypes.add(tt.id);
    inp.value = '';
    render();
  } catch(e){ showToast(t('toast_sync_failed')); }
}
async function doDeleteTestType(id){
  if(!confirm(t('confirm_delete_test_type'))) return;
  state.testTypes = state.testTypes.filter(tt=>tt.id!==id);
  render();
  try { await api('DELETE', `/api/test-types/${id}`); } catch(e){ showToast(t('toast_sync_failed')); loadState(); }
}
async function doAddTestTypeItem(ttId, text){
  const tt = state.testTypes.find(x=>x.id===ttId);
  const items = [...tt.items.map(it=>it.text), text];
  try {
    const updated = await api('PATCH', `/api/test-types/${ttId}`, {items});
    tt.items = updated.items;
    render();
  } catch(e){ showToast(t('toast_sync_failed')); }
}
async function doRemoveTestTypeItem(ttId, itemId){
  const tt = state.testTypes.find(x=>x.id===ttId);
  const items = tt.items.filter(it=>it.id!==itemId).map(it=>it.text);
  try {
    const updated = await api('PATCH', `/api/test-types/${ttId}`, {items});
    tt.items = updated.items;
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
