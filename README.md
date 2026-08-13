# Fundus

Selbst gehostete Inventar- und Vermietungsverwaltung für Veranstaltungstechnik.

Ein einzelner Node.js-Prozess liefert sowohl die Weboberfläche als auch eine kleine
API aus, alle Daten liegen in einer SQLite-Datei. Kein separater Datenbankserver,
keine externen Konten nötig.

## Lokal testen

```bash
npm install
npm start
```

Danach ist die App unter `http://localhost:3000` erreichbar. Die Datenbankdatei
landet standardmäßig in `./data/fundus.db` (wird beim ersten Start automatisch
angelegt und mit Beispieldaten befüllt).

## Deployment auf dem eigenen VPS (Docker)

Voraussetzung: Docker + Docker Compose sind auf dem VPS installiert.

```bash
git clone <dieses-repo> fundus
cd fundus
docker compose up -d --build
```

Die App läuft danach auf Port 3000 (`http://<VPS-IP>:3000`). Die Datenbank liegt
in einem benannten Docker-Volume (`fundus-data`) und übersteht Neustarts sowie
`docker compose up --build` bei künftigen Updates.

Update auf eine neue Version:

```bash
git pull
docker compose up -d --build
```

## Deployment ohne Docker

Falls auf dem VPS kein Docker läuft, funktioniert es genauso direkt mit Node.js
(Version 20+):

```bash
git clone <dieses-repo> fundus
cd fundus
npm install --omit=dev
DATA_DIR=/var/lib/fundus PORT=3000 node server/index.js
```

Für den Dauerbetrieb sollte das über `systemd` laufen, damit es Abstürze und
Server-Neustarts übersteht. Beispiel-Unit (`/etc/systemd/system/fundus.service`):

```ini
[Unit]
Description=Fundus Inventarverwaltung
After=network.target

[Service]
WorkingDirectory=/opt/fundus
Environment=DATA_DIR=/var/lib/fundus
Environment=PORT=3000
ExecStart=/usr/bin/node server/index.js
Restart=always
User=fundus

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now fundus
```

## HTTPS und Installierbarkeit (später)

Aktuell läuft die App über einfaches HTTP auf der VPS-IP. Das funktioniert als
normale Website in jedem Browser. Für die "App"-Erfahrung (Installieren auf dem
Homescreen, Offline-Fähigkeit) verlangen Browser zwingend HTTPS.

Sobald eine Domain auf den VPS zeigt, reicht ein Reverse-Proxy mit automatischem
Zertifikat, z. B. mit [Caddy](https://caddyserver.com/):

```
# /etc/caddy/Caddyfile
fundus.deine-domain.de {
    reverse_proxy localhost:3000
}
```

Caddy holt sich das Zertifikat automatisch über Let's Encrypt. Danach kann die
App über "Zum Startbildschirm hinzufügen" auf dem Handy installiert werden.

## Backups

Die komplette Datenbank ist eine einzelne Datei:

- Docker: `docker run --rm -v fundus_fundus-data:/data -v $(pwd):/backup alpine cp /data/fundus.db /backup/fundus-backup.db`
- Ohne Docker: einfach `$DATA_DIR/fundus.db` kopieren.

Ein Cronjob, der diese Datei regelmäßig an einen Cloud-Speicher außerhalb des
VPS schickt (z. B. per `rclone`), ist die empfohlene Absicherung gegen
VPS-Ausfälle oder versehentliches Löschen. Noch nicht eingerichtet — folgt,
sobald der Rest steht.

## Projektstruktur

```
server/       Express-API + SQLite-Anbindung
public/       Frontend (statisches HTML/CSS/JS, kein Build-Schritt nötig)
data/         SQLite-Datenbankdatei (lokal, wird nicht committed)
```
