const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const JSZip = require('jszip');
const bcrypt = require('bcryptjs');
const {
  generateRegistrationOptions, verifyRegistrationResponse,
  generateAuthenticationOptions, verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const db = require('./db');

const app = express();

const PHOTOS_DIR = path.join(db.DATA_DIR, 'photos');
if (!fs.existsSync(PHOTOS_DIR)) fs.mkdirSync(PHOTOS_DIR, { recursive: true });

const FILES_DIR = path.join(db.DATA_DIR, 'files');
if (!fs.existsSync(FILES_DIR)) fs.mkdirSync(FILES_DIR, { recursive: true });

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

// 2mb comfortably covers everything except file attachments (invoices,
// scans, etc, capped at 8mb decoded -- see /files routes below), which is
// why this is higher than a typical JSON API would need.
app.use(express.json({ limit: '15mb' }));

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

/* ---- auth gate ----
 * Two tiers, no user accounts:
 *  - A brand-new browser/device (no fundus_device cookie yet) can only log
 *    in with the long master password. On success it's minted a random
 *    per-device id, stored in `trusted_devices` and set as the
 *    fundus_device cookie -- separate from fundus_access, and never
 *    cleared by logout, so it survives across sessions.
 *  - Once a device holds a valid fundus_device cookie, it's "trusted" and
 *    may instead log in with the short 4-digit PIN, or with a fingerprint/
 *    biometric it has enrolled (WebAuthn platform authenticator, tied to
 *    that device row). Revoking a device (Settings) deletes its row and
 *    its credentials, forcing it back to master-password-only.
 * fundus_access itself works exactly as before: a single shared token,
 * the same for every device, that just means "this browser unlocked the
 * app." All of this is deliberately lightweight -- there are no real user
 * accounts, just a small business's shared install.
 */
const ACCESS_COOKIE = 'fundus_access';
const DEVICE_COOKIE = 'fundus_device';
const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
const FIVE_YEARS_MS = ONE_YEAR_MS * 5;
// How long an unlocked session stays unlocked with no activity. Slides
// forward on every authenticated request (see the auth gate below), so
// actively using the app never logs you out mid-task -- only genuine idle
// time does. Device trust (fundus_device) is untouched by this; a session
// timing out just drops back to the fast PIN/fingerprint prompt.
const SESSION_MAX_AGE_MS = 15 * 60 * 1000;

const ACCESS_TOKEN_FILE = path.join(db.DATA_DIR, 'access-token.txt');
function getOrCreateAccessToken() {
  if (fs.existsSync(ACCESS_TOKEN_FILE)) {
    return fs.readFileSync(ACCESS_TOKEN_FILE, 'utf8').trim();
  }
  const token = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(ACCESS_TOKEN_FILE, token);
  return token;
}
const ACCESS_TOKEN = getOrCreateAccessToken();

function getPin() {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('pin');
  return row ? row.value : '1234';
}
function getMasterPasswordHash() {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('masterPasswordHash');
  return row ? row.value : null;
}
function getSetting(key) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : '';
}

function parseCookies(req) {
  const header = req.headers.cookie;
  const out = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  });
  return out;
}
function isRequestHttps(req) {
  return req.secure || req.headers['x-forwarded-proto'] === 'https';
}
function requestOrigin(req) {
  return (isRequestHttps(req) ? 'https' : 'http') + '://' + req.get('host');
}
function trustedDeviceFor(req) {
  const id = parseCookies(req)[DEVICE_COOKIE];
  return id ? db.prepare('SELECT * FROM trusted_devices WHERE id = ?').get(id) : null;
}
function setAccessCookie(req, res) {
  res.cookie(ACCESS_COOKIE, ACCESS_TOKEN, {
    httpOnly: true, sameSite: 'lax', secure: isRequestHttps(req), maxAge: SESSION_MAX_AGE_MS,
  });
}
function touchDevice(id) {
  db.prepare("UPDATE trusted_devices SET last_seen_at = datetime('now') WHERE id = ?").run(id);
}
// A short, best-effort label so a "trusted devices" list in Settings isn't
// just a wall of random IDs. Not meant to be precise -- just recognizable.
// Pulls whatever extra detail the User-Agent string still exposes (Chrome's
// UA reduction means desktop OS versions are mostly gone, but Android UAs
// still tend to include the device model, and browser major versions are
// nearly always present) since that's the only signal available without
// wiring up Client Hints. A nickname (set by the user) is the real fix for
// telling two same-model phones apart.
function labelFromUserAgent(ua) {
  ua = ua || '';
  let os = '';
  if (/iphone/i.test(ua)) {
    const v = /OS (\d+[_.]\d+)/i.exec(ua);
    os = 'iPhone' + (v ? ` (iOS ${v[1].replace(/_/g, '.')})` : '');
  } else if (/ipad/i.test(ua)) {
    const v = /OS (\d+[_.]\d+)/i.exec(ua);
    os = 'iPad' + (v ? ` (iPadOS ${v[1].replace(/_/g, '.')})` : '');
  } else if (/android/i.test(ua)) {
    const v = /Android (\d+(?:\.\d+)?)/i.exec(ua);
    const m = /Android\s[\d.]+;\s*([^;)]+?)(?:\sBuild\/|\))/i.exec(ua);
    const model = m ? m[1].trim() : '';
    os = [model, v ? `(Android ${v[1]})` : 'Android'].filter(Boolean).join(' ');
  } else if (/windows nt/i.test(ua)) {
    const v = /Windows NT (\d+\.\d+)/i.exec(ua);
    const names = { '10.0': 'Windows 10/11', '6.3': 'Windows 8.1', '6.2': 'Windows 8', '6.1': 'Windows 7' };
    os = v ? (names[v[1]] || `Windows NT ${v[1]}`) : 'Windows';
  } else if (/mac os x/i.test(ua)) {
    const v = /Mac OS X (\d+[_.]\d+)/i.exec(ua);
    os = 'Mac' + (v ? ` (macOS ${v[1].replace(/_/g, '.')})` : '');
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
  }
  let browser = '';
  let m;
  if (m = /edg\/([\d.]+)/i.exec(ua)) browser = 'Edge ' + m[1].split('.')[0];
  else if (m = /opr\/([\d.]+)/i.exec(ua)) browser = 'Opera ' + m[1].split('.')[0];
  else if (m = /chrome\/([\d.]+)/i.exec(ua)) browser = 'Chrome ' + m[1].split('.')[0];
  else if (m = /firefox\/([\d.]+)/i.exec(ua)) browser = 'Firefox ' + m[1].split('.')[0];
  else if (m = /version\/([\d.]+).*safari/i.exec(ua)) browser = 'Safari ' + m[1].split('.')[0];
  else if (/safari/i.test(ua)) browser = 'Safari';
  return [browser, os].filter(Boolean).join(' · ') || 'Gerät';
}
function mintTrustedDevice(req, res) {
  const id = crypto.randomUUID();
  db.prepare('INSERT INTO trusted_devices (id, label) VALUES (?, ?)').run(id, labelFromUserAgent(req.headers['user-agent']));
  res.cookie(DEVICE_COOKIE, id, {
    httpOnly: true, sameSite: 'lax', secure: isRequestHttps(req), maxAge: FIVE_YEARS_MS,
  });
  return id;
}

// Pending WebAuthn ceremonies, keyed by device id -- a device only ever has
// one registration or one login attempt in flight at a time, so this is
// simpler than a DB table. Swept for anything older than 5 minutes so an
// abandoned ceremony doesn't linger forever.
const webauthnChallenges = new Map();
function setChallenge(deviceId, challenge) { webauthnChallenges.set(deviceId, { challenge, at: Date.now() }); }
function takeChallenge(deviceId) {
  const entry = webauthnChallenges.get(deviceId);
  webauthnChallenges.delete(deviceId);
  if (!entry || Date.now() - entry.at > 5 * 60 * 1000) return null;
  return entry.challenge;
}

// Slows down PIN/password guessing (10,000 PIN combinations is trivial to
// script through with no throttling at all) without needing per-IP
// infrastructure -- a global failure counter that makes each wrong guess
// progressively slower. WebAuthn ceremonies are cryptographically verified,
// not guessable, so they don't go through this.
let failedAuthAttempts = 0;
let lastFailedAuthAt = 0;
function authBackoffMs() {
  if (Date.now() - lastFailedAuthAt > 5 * 60 * 1000) failedAuthAttempts = 0;
  return Math.min(8000, failedAuthAttempts * 400);
}
function recordAuthFailure() { failedAuthAttempts += 1; lastFailedAuthAt = Date.now(); }

const LOGIN_PAGE_HTML = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fundus – Zugang</title>
<style>
  :root{color-scheme:light dark;}
  *{box-sizing:border-box;}
  body{
    margin:0;min-height:100dvh;display:flex;align-items:center;justify-content:center;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;
    background:#10131C;color:#f2f4f9;padding:20px;
  }
  .card{width:100%;max-width:320px;background:#181c28;border:1px solid #2a3040;border-radius:16px;padding:28px 24px;text-align:center;}
  .mark{width:52px;height:52px;border-radius:50%;object-fit:cover;margin-bottom:14px;}
  h1{font-size:1.05rem;margin:0 0 4px;}
  p{color:#9aa1b5;font-size:.84rem;margin:0 0 22px;}
  .field-wrap{position:relative;margin-bottom:14px;}
  input{
    width:100%;font-size:1.05rem;text-align:center;
    padding:12px 40px;border-radius:10px;border:1px solid #2a3040;background:#10131C;color:#fff;
    font-family:'SFMono-Regular',Consolas,monospace;
  }
  input#pin{font-size:1.6rem;letter-spacing:.5rem;padding:12px 10px;}
  input:focus{outline:2px solid #364786;}
  .toggle-vis{
    position:absolute;right:6px;top:50%;transform:translateY(-50%);
    background:none;border:none;color:#9aa1b5;font-size:.72rem;font-weight:600;
    padding:6px 8px;cursor:pointer;width:auto;
  }
  button.primary{
    width:100%;padding:12px;border-radius:10px;border:none;background:#364786;color:#fff;
    font-size:.92rem;font-weight:600;cursor:pointer;
  }
  button.secondary{
    width:100%;padding:12px;border-radius:10px;border:1px solid #2a3040;background:none;color:#f2f4f9;
    font-size:.88rem;font-weight:600;cursor:pointer;margin-top:10px;
  }
  button:disabled{opacity:.5;cursor:default;}
  .error{color:#e8746a;font-size:.8rem;margin:10px 0 0;min-height:1em;}
  .hidden{display:none;}
</style>
</head>
<body>
  <form class="card hidden" id="f">
    <img class="mark" src="/icons/brand-mark.png" alt="">
    <h1>Fundus</h1>
    <p id="prompt">Bitte PIN eingeben</p>

    <div class="field-wrap hidden" id="pin-wrap">
      <input id="pin" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" />
    </div>
    <div class="field-wrap hidden" id="password-wrap">
      <input id="password" type="password" autocomplete="off" placeholder="Passwort" />
      <button type="button" class="toggle-vis" id="toggle-vis">Anzeigen</button>
    </div>

    <button type="submit" class="primary">Entsperren</button>
    <button type="button" class="secondary hidden" id="biometric-btn">Mit Fingerabdruck entsperren</button>
    <p class="error" id="err"></p>
  </form>
<script>
  function b64urlToBytes(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function bytesToB64url(buf) {
    let bin = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
  }

  const f = document.getElementById('f');
  const prompt = document.getElementById('prompt');
  const pinWrap = document.getElementById('pin-wrap');
  const pinInput = document.getElementById('pin');
  const passwordWrap = document.getElementById('password-wrap');
  const passwordInput = document.getElementById('password');
  const toggleVis = document.getElementById('toggle-vis');
  const biometricBtn = document.getElementById('biometric-btn');
  const err = document.getElementById('err');
  let mode = 'password';

  toggleVis.addEventListener('click', () => {
    const showing = passwordInput.type === 'text';
    passwordInput.type = showing ? 'password' : 'text';
    toggleVis.textContent = showing ? 'Anzeigen' : 'Verbergen';
  });

  async function submitLogin(body) {
    const res = await fetch('/api/login', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body),
    });
    return res;
  }

  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    const body = mode === 'pin' ? { pin: pinInput.value.trim() } : { password: passwordInput.value };
    if (mode === 'pin' && !body.pin) return;
    if (mode === 'password' && !body.password) return;
    const btn = f.querySelector('button.primary');
    btn.disabled = true;
    try {
      const res = await submitLogin(body);
      if (res.ok) { location.reload(); return; }
      err.textContent = mode === 'pin' ? 'Falsche PIN.' : 'Falsches Passwort.';
      pinInput.value = '';
      if (mode === 'pin') pinInput.focus(); else passwordInput.focus();
    } catch (e2) {
      err.textContent = 'Verbindung fehlgeschlagen.';
    }
    btn.disabled = false;
  });

  biometricBtn.addEventListener('click', async () => {
    err.textContent = '';
    biometricBtn.disabled = true;
    try {
      const optRes = await fetch('/api/webauthn/login/options', { method: 'POST' });
      if (!optRes.ok) throw new Error('no options');
      const options = await optRes.json();
      options.challenge = b64urlToBytes(options.challenge);
      (options.allowCredentials || []).forEach(c => { c.id = b64urlToBytes(c.id); });
      const cred = await navigator.credentials.get({ publicKey: options });
      const payload = {
        id: cred.id,
        rawId: bytesToB64url(cred.rawId),
        type: cred.type,
        response: {
          clientDataJSON: bytesToB64url(cred.response.clientDataJSON),
          authenticatorData: bytesToB64url(cred.response.authenticatorData),
          signature: bytesToB64url(cred.response.signature),
          userHandle: cred.response.userHandle ? bytesToB64url(cred.response.userHandle) : undefined,
        },
        clientExtensionResults: cred.getClientExtensionResults ? cred.getClientExtensionResults() : {},
      };
      const verifyRes = await fetch('/api/webauthn/login/verify', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload),
      });
      if (!verifyRes.ok) throw new Error('verify failed');
      location.reload();
      return;
    } catch (e3) {
      err.textContent = 'Fingerabdruck fehlgeschlagen.';
    }
    biometricBtn.disabled = false;
  });

  (async () => {
    try {
      const res = await fetch('/api/auth-status');
      const status = await res.json();
      if (status.deviceTrusted) {
        mode = 'pin';
        prompt.textContent = 'Bitte PIN eingeben';
        pinWrap.classList.remove('hidden');
        if (status.hasBiometric && window.PublicKeyCredential) biometricBtn.classList.remove('hidden');
      } else {
        mode = 'password';
        prompt.textContent = 'Neues Gerät — bitte Passwort eingeben';
        passwordWrap.classList.remove('hidden');
      }
    } catch (e4) {
      mode = 'password';
      prompt.textContent = 'Neues Gerät — bitte Passwort eingeben';
      passwordWrap.classList.remove('hidden');
    }
    f.classList.remove('hidden');
    (mode === 'pin' ? pinInput : passwordInput).focus();
  })();
</script>
</body>
</html>`;

app.use((req, res, next) => {
  // manifest.json, the service worker, the icons they point to, the backup
  // endpoint (gated by its own bearer token), auth-status, and the login/
  // WebAuthn-login endpoints all have to stay reachable without the access
  // cookie -- they're either how a device gets that cookie in the first
  // place, or fetched by the OS/browser independently of any logged-in tab.
  const OPEN_PATHS = ['/api/login', '/api/backup', '/api/auth-status', '/api/webauthn/login/options', '/api/webauthn/login/verify', '/manifest.json', '/sw.js'];
  if (OPEN_PATHS.includes(req.path) || req.path.startsWith('/icons/')) {
    return next();
  }
  const cookies = parseCookies(req);
  if (cookies[ACCESS_COOKIE] === ACCESS_TOKEN) {
    // Sliding session: every authenticated request pushes the cookie's
    // expiry back out another SESSION_MAX_AGE_MS, so a session only times
    // out after genuine idle time, not on a fixed clock from login.
    setAccessCookie(req, res);
    return next();
  }
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ error: 'locked' });
  }
  res.status(401).type('html').send(LOGIN_PAGE_HTML);
});

app.get('/api/auth-status', (req, res) => {
  const device = trustedDeviceFor(req);
  const hasBiometric = device ? !!db.prepare('SELECT 1 FROM webauthn_credentials WHERE device_id = ?').get(device.id) : false;
  res.json({ deviceTrusted: !!device, hasBiometric });
});

app.post('/api/login', (req, res) => {
  const delay = authBackoffMs();
  const body = req.body || {};
  setTimeout(() => {
    if (typeof body.password === 'string') {
      const hash = getMasterPasswordHash();
      if (!hash || !bcrypt.compareSync(body.password, hash)) {
        recordAuthFailure();
        return res.status(401).json({ error: 'wrong password' });
      }
      failedAuthAttempts = 0;
      const existing = trustedDeviceFor(req);
      if (existing) touchDevice(existing.id); else mintTrustedDevice(req, res);
      setAccessCookie(req, res);
      return res.json({ ok: true });
    }
    if (typeof body.pin === 'string') {
      const device = trustedDeviceFor(req);
      if (!device) return res.status(403).json({ error: 'device not trusted' });
      if (body.pin !== getPin()) {
        recordAuthFailure();
        return res.status(401).json({ error: 'wrong pin' });
      }
      failedAuthAttempts = 0;
      touchDevice(device.id);
      setAccessCookie(req, res);
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: 'password or pin required' });
  }, delay);
});

app.post('/api/logout', (req, res) => {
  // Only clears the session cookie -- device trust (fundus_device) is
  // deliberately left alone so a quick logout still allows a fast PIN/
  // fingerprint re-unlock afterwards, instead of demanding the master
  // password again.
  res.clearCookie(ACCESS_COOKIE);
  res.json({ ok: true });
});

/* ---- WebAuthn (fingerprint/biometric) ---- */

// Enrollment only ever happens once already inside the app. An
// already-logged-in browser that predates this feature (and so has no
// fundus_device cookie yet) is auto-promoted to a trusted device right
// here -- it already proved access some other way, and enrolling a
// biometric is a stronger action than that anyway.
app.post('/api/webauthn/register/options', async (req, res) => {
  let device = trustedDeviceFor(req);
  if (!device) {
    const id = mintTrustedDevice(req, res);
    device = db.prepare('SELECT * FROM trusted_devices WHERE id = ?').get(id);
  }
  const existingCreds = db.prepare('SELECT id, transports FROM webauthn_credentials WHERE device_id = ?').all(device.id);
  const options = await generateRegistrationOptions({
    rpName: 'Fundus',
    rpID: req.hostname,
    userName: device.label || 'Fundus-Gerät',
    attestationType: 'none',
    excludeCredentials: existingCreds.map((c) => ({ id: c.id, transports: c.transports ? JSON.parse(c.transports) : undefined })),
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred', authenticatorAttachment: 'platform' },
  });
  setChallenge(device.id, options.challenge);
  res.json(options);
});

app.post('/api/webauthn/register/verify', async (req, res) => {
  const device = trustedDeviceFor(req);
  if (!device) return res.status(400).json({ error: 'no trusted device' });
  const expectedChallenge = takeChallenge(device.id);
  if (!expectedChallenge) return res.status(400).json({ error: 'no pending registration' });
  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge,
      expectedOrigin: requestOrigin(req),
      expectedRPID: req.hostname,
    });
  } catch (e) {
    return res.status(400).json({ error: 'verification failed' });
  }
  if (!verification.verified || !verification.registrationInfo) return res.status(400).json({ error: 'verification failed' });
  const { credential } = verification.registrationInfo;
  db.prepare('INSERT INTO webauthn_credentials (id, device_id, public_key, counter, transports) VALUES (?, ?, ?, ?, ?)')
    .run(credential.id, device.id, Buffer.from(credential.publicKey).toString('base64'), credential.counter, JSON.stringify(credential.transports || []));
  res.json({ ok: true });
});

app.post('/api/webauthn/login/options', async (req, res) => {
  const device = trustedDeviceFor(req);
  if (!device) return res.status(403).json({ error: 'device not trusted' });
  const creds = db.prepare('SELECT id, transports FROM webauthn_credentials WHERE device_id = ?').all(device.id);
  if (!creds.length) return res.status(404).json({ error: 'no credentials enrolled' });
  const options = await generateAuthenticationOptions({
    rpID: req.hostname,
    allowCredentials: creds.map((c) => ({ id: c.id, transports: c.transports ? JSON.parse(c.transports) : undefined })),
    userVerification: 'preferred',
  });
  setChallenge(device.id, options.challenge);
  res.json(options);
});

app.post('/api/webauthn/login/verify', async (req, res) => {
  const device = trustedDeviceFor(req);
  if (!device) return res.status(403).json({ error: 'device not trusted' });
  const expectedChallenge = takeChallenge(device.id);
  if (!expectedChallenge) return res.status(400).json({ error: 'no pending login' });
  const credRow = db.prepare('SELECT * FROM webauthn_credentials WHERE id = ? AND device_id = ?').get(req.body.id, device.id);
  if (!credRow) return res.status(404).json({ error: 'unknown credential' });
  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge,
      expectedOrigin: requestOrigin(req),
      expectedRPID: req.hostname,
      credential: {
        id: credRow.id,
        publicKey: new Uint8Array(Buffer.from(credRow.public_key, 'base64')),
        counter: credRow.counter,
        transports: credRow.transports ? JSON.parse(credRow.transports) : undefined,
      },
    });
  } catch (e) {
    return res.status(400).json({ error: 'verification failed' });
  }
  if (!verification.verified) return res.status(400).json({ error: 'verification failed' });
  db.prepare('UPDATE webauthn_credentials SET counter = ? WHERE id = ?').run(verification.authenticationInfo.newCounter, credRow.id);
  touchDevice(device.id);
  setAccessCookie(req, res);
  res.json({ ok: true });
});

/* ---- trusted devices management (Settings) ---- */

function trustedDeviceRow(row, currentDeviceId) {
  const hasBiometric = !!db.prepare('SELECT 1 FROM webauthn_credentials WHERE device_id = ?').get(row.id);
  return { id: row.id, label: row.label, nickname: row.nickname || '', createdAt: row.created_at, lastSeenAt: row.last_seen_at, hasBiometric, isThisDevice: row.id === currentDeviceId };
}

app.delete('/api/webauthn/credentials', (req, res) => {
  const device = trustedDeviceFor(req);
  if (!device) return res.status(400).json({ error: 'no trusted device' });
  db.prepare('DELETE FROM webauthn_credentials WHERE device_id = ?').run(device.id);
  res.status(204).end();
});

app.patch('/api/trusted-devices/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM trusted_devices WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  if (req.body.nickname !== undefined) {
    db.prepare('UPDATE trusted_devices SET nickname = ? WHERE id = ?').run(String(req.body.nickname).slice(0, 60), row.id);
  }
  const currentDevice = trustedDeviceFor(req);
  res.json(trustedDeviceRow(db.prepare('SELECT * FROM trusted_devices WHERE id = ?').get(row.id), currentDevice && currentDevice.id));
});

app.delete('/api/trusted-devices/:id', (req, res) => {
  const current = trustedDeviceFor(req);
  db.prepare('DELETE FROM trusted_devices WHERE id = ?').run(req.params.id);
  if (current && current.id === req.params.id) res.clearCookie(DEVICE_COOKIE);
  res.status(204).end();
});


const STATUS_LISTE = ['Verfügbar', 'Reserviert', 'Vermietet', 'Defekt', 'In Reparatur', 'Ausgemustert', 'Verloren'];
const INVENTAR_FIELDS = ['bez', 'hersteller', 'modell', 'serien', 'standort', 'parent', 'status', 'miete', 'pruef', 'letzte', 'naechste', 'notiz', 'cat', 'tag', 'intervall', 'nickname', 'gewicht', 'einkaufspreis'];
const CUSTOMER_FIELDS = ['name', 'firma', 'email', 'telefon', 'adresse', 'notiz'];

// Track-keeping for inventar field changes -- see the audit_log table
// comment in db.js. A no-op "change" (value unchanged) is skipped so
// re-saving a form without touching a field doesn't clutter the log.
function logAudit(entityType, entityId, field, oldValue, newValue, actor) {
  const oldStr = oldValue === undefined || oldValue === null ? null : String(oldValue);
  const newStr = newValue === undefined || newValue === null ? null : String(newValue);
  if (oldStr === newStr) return;
  db.prepare(`
    INSERT INTO audit_log (id, entity_type, entity_id, field, old_value, new_value, actor)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(crypto.randomUUID(), entityType, entityId, field, oldStr, newStr, String(actor || '').slice(0, 60));
}

function catRow(row) {
  return { id: row.id, code: row.code, name: row.name, parent: row.parent, sortOrder: row.sort_order };
}
function checklistForInv(inv) {
  return db.prepare('SELECT id, text, checked, alt_group FROM inventar_checklist WHERE inv = ? ORDER BY sort_order').all(inv)
    .map(c => ({ id: c.id, text: c.text, checked: !!c.checked, altGroup: c.alt_group || null }));
}
function filesForInv(inv) {
  return db.prepare('SELECT id, filename, original_name, mime, size, uploaded_at FROM inventar_files WHERE inv = ? ORDER BY uploaded_at').all(inv)
    .map(f => ({ id: f.id, name: f.original_name, mime: f.mime, size: f.size, uploadedAt: f.uploaded_at, url: `/files/${encodeURIComponent(f.filename)}` }));
}
function filesForVermietung(id) {
  return db.prepare('SELECT id, filename, original_name, mime, size, uploaded_at FROM vermietungen_files WHERE vermietung_id = ? ORDER BY uploaded_at').all(id)
    .map(f => ({ id: f.id, name: f.original_name, mime: f.mime, size: f.size, uploadedAt: f.uploaded_at, url: `/files/${encodeURIComponent(f.filename)}` }));
}
function itemRow(row) {
  return { ...row, pruef: !!row.pruef, parent: row.parent || null, tag: row.tag || null, checklist: checklistForInv(row.inv), files: filesForInv(row.inv) };
}
function rentalRow(row) {
  return { ...row, items: JSON.parse(row.items), pack: JSON.parse(row.pack), archiviert: !!row.archiviert, files: filesForVermietung(row.id) };
}
function bundleRow(row) {
  const items = db.prepare('SELECT inv, menge FROM bundle_items WHERE bundle_id = ?').all(row.id);
  return { id: row.id, name: row.name, notiz: row.notiz, suggestedPrice: row.suggested_price, items };
}
function testTypeRow(row) {
  const items = db.prepare('SELECT id, text FROM test_type_items WHERE test_type_id = ? ORDER BY sort_order').all(row.id);
  return { id: row.id, name: row.name, items };
}

function getFullState(req) {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order').all().map(catRow);
  const standorte = db.prepare('SELECT name FROM standorte ORDER BY sort_order').all().map(r => r.name);
  const hersteller = db.prepare('SELECT name FROM hersteller ORDER BY sort_order').all().map(r => r.name);
  const settingsRows = db.prepare('SELECT * FROM settings').all();
  const schwellen = {};
  let pin = '1234';
  let userName = '';
  let casesRootCatId = '';
  let githubBackupRepo = '';
  let githubBackupConfigured = false;
  settingsRows.forEach(r => {
    if (r.key === 'pin') pin = r.value;
    else if (r.key === 'userName') userName = r.value;
    else if (r.key === 'casesRootCatId') casesRootCatId = r.value;
    else if (r.key === 'masterPasswordHash') { /* never exposed to the client */ }
    else if (r.key === 'githubBackupRepo') githubBackupRepo = r.value;
    else if (r.key === 'githubBackupToken') { githubBackupConfigured = !!r.value; /* never exposed to the client */ }
    else schwellen[r.key] = parseInt(r.value, 10);
  });
  const inventar = db.prepare('SELECT * FROM inventar').all().map(itemRow);
  const vermietungen = db.prepare('SELECT * FROM vermietungen').all().map(rentalRow);
  const customers = db.prepare('SELECT * FROM customers ORDER BY name').all();
  const bundles = db.prepare('SELECT * FROM bundles ORDER BY name').all().map(bundleRow);
  const tags = db.prepare('SELECT * FROM tags').all();
  const testTypes = db.prepare('SELECT * FROM test_types ORDER BY sort_order').all().map(testTypeRow);
  const currentDevice = trustedDeviceFor(req);
  const trustedDevices = db.prepare('SELECT * FROM trusted_devices ORDER BY last_seen_at DESC').all().map(r => trustedDeviceRow(r, currentDevice && currentDevice.id));
  return { categories, standorte, hersteller, statusListe: STATUS_LISTE, schwellen, pin, userName, casesRootCatId, inventar, vermietungen, customers, bundles, tags, testTypes, backupToken: BACKUP_TOKEN, trustedDevices, githubBackupRepo, githubBackupConfigured };
}

app.get('/api/state', (req, res) => {
  res.json(getFullState(req));
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
  const stamp = new Date().toISOString().slice(0, 10);
  res.download(path.join(db.DATA_DIR, 'fundus.db'), `fundus-backup-${stamp}.db`);
});

// Pushes the database straight into a GitHub repo on demand, instead of
// waiting on the external cron Action to pull it. Overwrites a single
// fixed path each time (not one file per day) to keep the repo small --
// history lives in that file's own git log.
const GITHUB_BACKUP_PATH = 'backups/fundus.db';

app.post('/api/backup/github', async (req, res) => {
  const repo = getSetting('githubBackupRepo');
  const token = getSetting('githubBackupToken');
  if (!repo || !token) return res.status(400).json({ error: 'GitHub backup not configured' });

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'fundus-backup',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${GITHUB_BACKUP_PATH}`;

  try {
    db.pragma('wal_checkpoint(TRUNCATE)');
    const content = fs.readFileSync(path.join(db.DATA_DIR, 'fundus.db')).toString('base64');

    let sha;
    const getRes = await fetch(apiUrl, { headers });
    if (getRes.ok) {
      sha = (await getRes.json()).sha;
    } else if (getRes.status !== 404) {
      throw new Error(`GitHub lookup failed (${getRes.status})`);
    }

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Fundus backup ${new Date().toISOString()}`, content, sha }),
    });
    if (!putRes.ok) {
      const body = await putRes.json().catch(() => ({}));
      throw new Error(body.message || `GitHub push failed (${putRes.status})`);
    }
    const result = await putRes.json();
    res.json({ ok: true, url: result.content && result.content.html_url });
  } catch (e) {
    res.status(502).json({ error: e.message || 'GitHub backup failed' });
  }
});

/* ---- audit log ---- */

app.get('/api/audit-log', (req, res) => {
  const limit = Math.min(1000, Math.max(1, parseInt(req.query.limit, 10) || 200));
  const rows = req.query.entityId
    ? db.prepare('SELECT * FROM audit_log WHERE entity_id = ? ORDER BY ts DESC, rowid DESC LIMIT ?').all(req.query.entityId, limit)
    : db.prepare('SELECT * FROM audit_log ORDER BY ts DESC, rowid DESC LIMIT ?').all(limit);
  res.json(rows.map(r => ({
    id: r.id, ts: r.ts, entityType: r.entity_type, entityId: r.entity_id,
    field: r.field, oldValue: r.old_value, newValue: r.new_value, actor: r.actor,
  })));
});

/* ---- categories ---- */

app.post('/api/categories', (req, res) => {
  const { parent, name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const parentId = parent || null;
  if (parentId) {
    const parentRow = db.prepare('SELECT * FROM categories WHERE id = ?').get(parentId);
    if (!parentRow) return res.status(404).json({ error: 'parent not found' });
    // Categories are capped at two levels (Hauptgruppe/Untergruppe) -- a
    // parent that itself has a parent would make this a third level.
    if (parentRow.parent) return res.status(400).json({ error: 'categories only support two levels' });
  }
  const siblings = db.prepare('SELECT code, sort_order FROM categories WHERE parent IS ?').all(parentId);
  const nums = siblings.map(s => parseInt(s.code, 10)).filter(n => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  const code = String(next).padStart(parentId ? 2 : 3, '0');
  const nextSortOrder = (siblings.length ? Math.max(...siblings.map(s => s.sort_order)) : -1) + 1;
  const id = 'cat-' + crypto.randomUUID().slice(0, 8);
  db.prepare('INSERT INTO categories (id, code, name, parent, sort_order) VALUES (?, ?, ?, ?, ?)').run(id, code, name, parentId, nextSortOrder);
  res.status(201).json(catRow({ id, code, name, parent: parentId, sort_order: nextSortOrder }));
});

// Swaps sort_order with the previous/next sibling (same parent) so the
// category tree in Settings can be reordered freely, independent of the
// auto-assigned code numbers.
app.post('/api/categories/:id/move', (req, res) => {
  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  const direction = req.body.direction;
  if (direction !== 'up' && direction !== 'down') return res.status(400).json({ error: 'direction must be "up" or "down"' });
  const siblings = db.prepare('SELECT id, sort_order FROM categories WHERE parent IS ? ORDER BY sort_order').all(row.parent);
  const idx = siblings.findIndex(s => s.id === row.id);
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= siblings.length) return res.status(400).json({ error: 'already at the edge' });
  const other = siblings[swapIdx];
  const tx = db.transaction(() => {
    db.prepare('UPDATE categories SET sort_order = ? WHERE id = ?').run(other.sort_order, row.id);
    db.prepare('UPDATE categories SET sort_order = ? WHERE id = ?').run(row.sort_order, other.id);
  });
  tx();
  res.json({
    moved: catRow(db.prepare('SELECT * FROM categories WHERE id = ?').get(row.id)),
    swapped: catRow(db.prepare('SELECT * FROM categories WHERE id = ?').get(other.id)),
  });
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

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  if (!db.prepare('SELECT 1 FROM categories WHERE id = ?').get(id)) return res.status(404).json({ error: 'not found' });
  const hasChildren = db.prepare('SELECT 1 FROM categories WHERE parent = ?').get(id);
  const hasItems = db.prepare('SELECT 1 FROM inventar WHERE cat = ?').get(id);
  const hasTags = db.prepare('SELECT 1 FROM tags WHERE cat = ?').get(id);
  if (hasChildren) return res.status(409).json({ error: 'category has subcategories -- delete or move those first' });
  if (hasItems) return res.status(409).json({ error: 'category still has items assigned -- move or delete those first' });
  if (hasTags) return res.status(409).json({ error: 'category still has tags -- delete those first' });
  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  res.status(204).end();
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

/* ---- hersteller (manufacturer suggestions) ---- */

app.post('/api/hersteller', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM hersteller').get().m;
  try {
    db.prepare('INSERT INTO hersteller (name, sort_order) VALUES (?, ?)').run(name.trim(), maxOrder + 1);
  } catch (e) {
    return res.status(409).json({ error: 'already exists' });
  }
  res.status(201).json({ name: name.trim() });
});

app.delete('/api/hersteller/:name', (req, res) => {
  db.prepare('DELETE FROM hersteller WHERE name = ?').run(req.params.name);
  res.status(204).end();
});

/* ---- settings ---- */

app.patch('/api/settings', (req, res) => {
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  if (req.body.gelb !== undefined) upsert.run('gelb', String(parseInt(req.body.gelb, 10) || 0));
  if (req.body.orange !== undefined) upsert.run('orange', String(parseInt(req.body.orange, 10) || 0));
  if (req.body.pin !== undefined) {
    if (!/^\d{4}$/.test(req.body.pin)) return res.status(400).json({ error: 'pin must be exactly 4 digits' });
    upsert.run('pin', req.body.pin);
  }
  if (req.body.userName !== undefined) upsert.run('userName', String(req.body.userName).slice(0, 60));
  if (req.body.casesRootCatId !== undefined) {
    const id = String(req.body.casesRootCatId);
    if (id && !db.prepare('SELECT 1 FROM categories WHERE id = ? AND parent IS NULL').get(id)) {
      return res.status(400).json({ error: 'casesRootCatId must be an existing top-level category' });
    }
    upsert.run('casesRootCatId', id);
  }
  if (req.body.masterPassword !== undefined) {
    const pw = String(req.body.masterPassword);
    if (pw.length < 8) return res.status(400).json({ error: 'master password must be at least 8 characters' });
    upsert.run('masterPasswordHash', bcrypt.hashSync(pw, 10));
  }
  if (req.body.githubBackupRepo !== undefined) {
    upsert.run('githubBackupRepo', String(req.body.githubBackupRepo).trim());
  }
  if (req.body.githubBackupToken !== undefined) {
    upsert.run('githubBackupToken', String(req.body.githubBackupToken).trim());
  }
  const settingsRows = db.prepare('SELECT * FROM settings').all();
  const schwellen = {};
  let pin = '1234';
  let userName = '';
  let casesRootCatId = '';
  let githubBackupRepo = '';
  let githubBackupConfigured = false;
  settingsRows.forEach(r => {
    if (r.key === 'pin') pin = r.value;
    else if (r.key === 'userName') userName = r.value;
    else if (r.key === 'casesRootCatId') casesRootCatId = r.value;
    else if (r.key === 'masterPasswordHash') { /* never exposed to the client */ }
    else if (r.key === 'githubBackupRepo') githubBackupRepo = r.value;
    else if (r.key === 'githubBackupToken') { githubBackupConfigured = !!r.value; /* never exposed to the client */ }
    else schwellen[r.key] = parseInt(r.value, 10);
  });
  res.json({ ...schwellen, pin, userName, casesRootCatId, githubBackupRepo, githubBackupConfigured });
});

/* ---- inventar ---- */

app.post('/api/inventar', (req, res) => {
  const b = req.body;
  if (!b.inv || !b.bez || !b.cat) return res.status(400).json({ error: 'inv, bez, cat required' });
  if (db.prepare('SELECT 1 FROM inventar WHERE inv = ?').get(b.inv)) {
    return res.status(409).json({ error: 'duplicate inventory number' });
  }
  db.prepare(`
    INSERT INTO inventar (inv, cat, tag, bez, hersteller, modell, serien, standort, parent, status, miete, pruef, letzte, naechste, notiz, menge, intervall, nickname, gewicht, einkaufspreis)
    VALUES (@inv, @cat, @tag, @bez, @hersteller, @modell, @serien, @standort, @parent, @status, @miete, @pruef, @letzte, @naechste, @notiz, @menge, @intervall, @nickname, @gewicht, @einkaufspreis)
  `).run({
    inv: b.inv, cat: b.cat, tag: b.tag || null, bez: b.bez, hersteller: b.hersteller || '', modell: b.modell || '',
    serien: b.serien || '', standort: b.standort || '', parent: b.parent || null,
    status: b.status || 'Verfügbar', miete: b.miete || 0, pruef: b.pruef ? 1 : 0,
    letzte: b.letzte || null, naechste: b.naechste || null, notiz: b.notiz || '',
    menge: 1,
    intervall: b.intervall != null ? parseInt(b.intervall, 10) || null : null, nickname: b.nickname || '',
    gewicht: Math.max(0, parseInt(b.gewicht, 10) || 0),
    einkaufspreis: b.einkaufspreis != null && b.einkaufspreis !== '' ? Number(b.einkaufspreis) : null,
  });
  logAudit('inventar', b.inv, '__created__', null, b.bez, b.actor);
  if (Array.isArray(b.checklist) && b.checklist.length) {
    const insertItem = db.prepare('INSERT INTO inventar_checklist (id, inv, text, checked, sort_order) VALUES (?, ?, ?, 0, ?)');
    b.checklist.forEach((text, idx) => insertItem.run(`${b.inv}-c${idx}-${Date.now()}`, b.inv, text, idx));
  }
  res.status(201).json(itemRow(db.prepare('SELECT * FROM inventar WHERE inv = ?').get(b.inv)));
});

app.delete('/api/inventar/:inv', (req, res) => {
  const inv = req.params.inv;
  const row = db.prepare('SELECT * FROM inventar WHERE inv = ?').get(inv);
  if (!row) return res.status(404).json({ error: 'not found' });
  logAudit('inventar', inv, '__deleted__', row.bez, null, (req.body || {}).actor);
  const tx = db.transaction(() => {
    // Sets are just convenience groupings, not critical records -- drop the
    // item from any it belongs to rather than blocking deletion.
    db.prepare('DELETE FROM bundle_items WHERE inv = ?').run(inv);
    db.prepare('DELETE FROM inventar WHERE inv = ?').run(inv);
  });
  tx();
  res.status(204).end();
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
  keys.forEach(f => logAudit('inventar', req.params.inv, f, row[f], updates[f], req.body.actor));
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

/* ---- item file attachments (invoices, extra photos, manuals, ...) ---- */

app.post('/api/inventar/:inv/files', (req, res) => {
  const row = db.prepare('SELECT 1 FROM inventar WHERE inv = ?').get(req.params.inv);
  if (!row) return res.status(404).json({ error: 'not found' });
  const { dataUrl, name } = req.body;
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) return res.status(400).json({ error: 'expected a base64 data URL' });
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 8 * 1024 * 1024) return res.status(413).json({ error: 'file too large (max 8mb)' });
  const originalName = (name && String(name).trim()) || 'Datei';
  const ext = path.extname(originalName).replace(/[^a-zA-Z0-9.]/g, '').slice(0, 10);
  const id = crypto.randomUUID();
  const filename = `${req.params.inv.replace(/[^a-zA-Z0-9.-]/g, '_')}-${Date.now()}-${id.slice(0, 8)}${ext}`;
  fs.writeFileSync(path.join(FILES_DIR, filename), buffer);
  db.prepare(`
    INSERT INTO inventar_files (id, inv, filename, original_name, mime, size)
    VALUES (@id, @inv, @filename, @original_name, @mime, @size)
  `).run({ id, inv: req.params.inv, filename, original_name: originalName, mime: match[1] || 'application/octet-stream', size: buffer.length });
  res.status(201).json(itemRow(db.prepare('SELECT * FROM inventar WHERE inv = ?').get(req.params.inv)));
});

app.delete('/api/inventar/:inv/files/:id', (req, res) => {
  const fileRow = db.prepare('SELECT * FROM inventar_files WHERE id = ? AND inv = ?').get(req.params.id, req.params.inv);
  if (!fileRow) return res.status(404).json({ error: 'not found' });
  try { fs.unlinkSync(path.join(FILES_DIR, fileRow.filename)); } catch (e) { /* already gone */ }
  db.prepare('DELETE FROM inventar_files WHERE id = ?').run(req.params.id);
  res.json(itemRow(db.prepare('SELECT * FROM inventar WHERE inv = ?').get(req.params.inv)));
});

/* ---- per-item inspection checklist ---- */

// Wholesale replace -- used when creating an item (picking test type(s) +
// custom lines) or when the whole checklist is edited at once. Toggling a
// single item's checked state uses the lighter endpoint below instead.
app.put('/api/inventar/:inv/checklist', (req, res) => {
  const inv = req.params.inv;
  if (!db.prepare('SELECT 1 FROM inventar WHERE inv = ?').get(inv)) return res.status(404).json({ error: 'not found' });
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM inventar_checklist WHERE inv = ?').run(inv);
    const insert = db.prepare('INSERT INTO inventar_checklist (id, inv, text, checked, sort_order, alt_group) VALUES (?, ?, ?, ?, ?, ?)');
    items.forEach((it, idx) => {
      const text = typeof it === 'string' ? it : it.text;
      const checked = typeof it === 'object' && it.checked ? 1 : 0;
      const altGroup = (typeof it === 'object' && it.altGroup) ? it.altGroup : null;
      if (text && text.trim()) insert.run(`${inv}-c${idx}-${Date.now()}`, inv, text.trim(), checked, idx, altGroup);
    });
  });
  tx();
  res.json(itemRow(db.prepare('SELECT * FROM inventar WHERE inv = ?').get(inv)));
});

app.patch('/api/inventar/:inv/checklist/:itemId', (req, res) => {
  const row = db.prepare('SELECT * FROM inventar_checklist WHERE id = ? AND inv = ?').get(req.params.itemId, req.params.inv);
  if (!row) return res.status(404).json({ error: 'not found' });
  if (req.body.checked !== undefined) {
    db.prepare('UPDATE inventar_checklist SET checked = ? WHERE id = ?').run(req.body.checked ? 1 : 0, row.id);
  }
  if (req.body.text !== undefined) {
    db.prepare('UPDATE inventar_checklist SET text = ? WHERE id = ?').run(req.body.text, row.id);
  }
  if (req.body.altGroup !== undefined) {
    db.prepare('UPDATE inventar_checklist SET alt_group = ? WHERE id = ?').run(req.body.altGroup || null, row.id);
  }
  res.json(itemRow(db.prepare('SELECT * FROM inventar WHERE inv = ?').get(req.params.inv)));
});

app.delete('/api/inventar/:inv/checklist/:itemId', (req, res) => {
  db.prepare('DELETE FROM inventar_checklist WHERE id = ? AND inv = ?').run(req.params.itemId, req.params.inv);
  res.json(itemRow(db.prepare('SELECT * FROM inventar WHERE inv = ?').get(req.params.inv)));
});

/* ---- tags (e.g. "004.01.A" grouping several unique-coded items) ---- */

app.post('/api/tags', (req, res) => {
  const { code, name, cat } = req.body;
  if (!code || !name || !cat) return res.status(400).json({ error: 'code, name, cat required' });
  if (!db.prepare('SELECT 1 FROM categories WHERE id = ?').get(cat)) return res.status(404).json({ error: 'category not found' });
  const id = 'tag-' + crypto.randomUUID().slice(0, 8);
  db.prepare('INSERT INTO tags (id, code, name, cat) VALUES (?, ?, ?, ?)').run(id, code, name, cat);
  res.status(201).json(db.prepare('SELECT * FROM tags WHERE id = ?').get(id));
});

app.patch('/api/tags/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM tags WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  const code = req.body.code !== undefined ? req.body.code : row.code;
  const name = req.body.name !== undefined ? req.body.name : row.name;
  db.prepare('UPDATE tags SET code = ?, name = ? WHERE id = ?').run(code, name, row.id);
  res.json(db.prepare('SELECT * FROM tags WHERE id = ?').get(row.id));
});

app.delete('/api/tags/:id', (req, res) => {
  const tx = db.transaction(() => {
    db.prepare('UPDATE inventar SET tag = NULL WHERE tag = ?').run(req.params.id);
    db.prepare('DELETE FROM tags WHERE id = ?').run(req.params.id);
  });
  tx();
  res.status(204).end();
});

/* ---- test/inspection types (with a checklist template each) ---- */

app.post('/api/test-types', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'name required' });
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM test_types').get().m;
  const id = 'tt-' + crypto.randomUUID().slice(0, 8);
  const tx = db.transaction(() => {
    db.prepare('INSERT INTO test_types (id, name, sort_order) VALUES (?, ?, ?)').run(id, name.trim(), maxOrder + 1);
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const insertItem = db.prepare('INSERT INTO test_type_items (id, test_type_id, text, sort_order) VALUES (?, ?, ?, ?)');
    items.forEach((text, idx) => { if (text && text.trim()) insertItem.run(`${id}-${idx}`, id, text.trim(), idx); });
  });
  tx();
  res.status(201).json(testTypeRow(db.prepare('SELECT * FROM test_types WHERE id = ?').get(id)));
});

app.patch('/api/test-types/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM test_types WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  const tx = db.transaction(() => {
    if (req.body.name !== undefined) {
      db.prepare('UPDATE test_types SET name = ? WHERE id = ?').run(req.body.name, row.id);
    }
    if (Array.isArray(req.body.items)) {
      db.prepare('DELETE FROM test_type_items WHERE test_type_id = ?').run(row.id);
      const insertItem = db.prepare('INSERT INTO test_type_items (id, test_type_id, text, sort_order) VALUES (?, ?, ?, ?)');
      req.body.items.forEach((text, idx) => { if (text && text.trim()) insertItem.run(`${row.id}-${idx}-${Date.now()}`, row.id, text.trim(), idx); });
    }
  });
  try { tx(); } catch (e) { return res.status(400).json({ error: e.message }); }
  res.json(testTypeRow(db.prepare('SELECT * FROM test_types WHERE id = ?').get(row.id)));
});

app.delete('/api/test-types/:id', (req, res) => {
  db.prepare('DELETE FROM test_types WHERE id = ?').run(req.params.id);
  res.status(204).end();
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
  if (req.body.status !== undefined) {
    if (!VERMIETUNG_STATUSES.includes(req.body.status)) return res.status(400).json({ error: 'invalid status' });
    db.prepare('UPDATE vermietungen SET status = ? WHERE id = ?').run(req.body.status, v.id);
  }
  if (req.body.archiviert !== undefined) {
    db.prepare('UPDATE vermietungen SET archiviert = ? WHERE id = ?').run(req.body.archiviert ? 1 : 0, v.id);
  }
  if (req.body.notiz !== undefined) {
    db.prepare('UPDATE vermietungen SET notiz = ? WHERE id = ?').run(req.body.notiz, v.id);
  }
  res.json(rentalRow(db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(v.id)));
});

app.delete('/api/vermietungen/:id', (req, res) => {
  if (!db.prepare('SELECT 1 FROM vermietungen WHERE id = ?').get(req.params.id)) return res.status(404).json({ error: 'not found' });
  db.prepare('DELETE FROM vermietungen WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

/* ---- rental file attachments (delivery notes, contracts, damage photos, ...) ---- */

app.post('/api/vermietungen/:id/files', (req, res) => {
  const row = db.prepare('SELECT 1 FROM vermietungen WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  const { dataUrl, name } = req.body;
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) return res.status(400).json({ error: 'expected a base64 data URL' });
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 8 * 1024 * 1024) return res.status(413).json({ error: 'file too large (max 8mb)' });
  const originalName = (name && String(name).trim()) || 'Datei';
  const ext = path.extname(originalName).replace(/[^a-zA-Z0-9.]/g, '').slice(0, 10);
  const id = crypto.randomUUID();
  const filename = `${req.params.id.replace(/[^a-zA-Z0-9.-]/g, '_')}-${Date.now()}-${id.slice(0, 8)}${ext}`;
  fs.writeFileSync(path.join(FILES_DIR, filename), buffer);
  db.prepare(`
    INSERT INTO vermietungen_files (id, vermietung_id, filename, original_name, mime, size)
    VALUES (@id, @vermietung_id, @filename, @original_name, @mime, @size)
  `).run({ id, vermietung_id: req.params.id, filename, original_name: originalName, mime: match[1] || 'application/octet-stream', size: buffer.length });
  res.status(201).json(rentalRow(db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(req.params.id)));
});

app.delete('/api/vermietungen/:id/files/:fileId', (req, res) => {
  const fileRow = db.prepare('SELECT * FROM vermietungen_files WHERE id = ? AND vermietung_id = ?').get(req.params.fileId, req.params.id);
  if (!fileRow) return res.status(404).json({ error: 'not found' });
  try { fs.unlinkSync(path.join(FILES_DIR, fileRow.filename)); } catch (e) { /* already gone */ }
  db.prepare('DELETE FROM vermietungen_files WHERE id = ?').run(req.params.fileId);
  res.json(rentalRow(db.prepare('SELECT * FROM vermietungen WHERE id = ?').get(req.params.id)));
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
  const { kunde, customerId, von, bis, items: rawItems, notiz } = req.body;
  if (!kunde || !von || !bis || !Array.isArray(rawItems) || rawItems.length === 0) {
    return res.status(400).json({ error: 'kunde, von, bis, items required' });
  }
  const items = normalizeRentalItems(rawItems);
  const existing = db.prepare("SELECT id FROM vermietungen WHERE id LIKE 'V-%'").all();
  const nums = existing.map(r => parseInt(r.id.slice(2), 10)).filter(n => !isNaN(n));
  const id = 'V-' + ((nums.length ? Math.max(...nums) : 0) + 1);
  const pack = Object.fromEntries(items.map(i => [i.inv, false]));

  const tx = db.transaction(() => {
    db.prepare('INSERT INTO vermietungen (id, kunde, customer_id, von, bis, status, items, pack, notiz) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(id, kunde, customerId || null, von, bis, 'Reserviert', JSON.stringify(items), JSON.stringify(pack), notiz || '');
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
    columns: ['inv', 'cat', 'bez', 'hersteller', 'modell', 'serien', 'standort', 'parent', 'status', 'miete', 'pruef', 'letzte', 'naechste', 'notiz', 'menge', 'foto', 'gewicht', 'einkaufspreis'],
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
  hersteller: {
    columns: ['name', 'sort_order'],
    rows: () => db.prepare('SELECT * FROM hersteller').all(),
  },
  bundles: {
    columns: ['id', 'name', 'notiz', 'suggested_price', 'artikel'],
    rows: () => db.prepare('SELECT * FROM bundles').all()
      .map(b => ({ ...b, artikel: itemsAsText(db.prepare('SELECT inv, menge FROM bundle_items WHERE bundle_id = ?').all(b.id)) })),
  },
  tags: {
    columns: ['id', 'code', 'name', 'cat'],
    rows: () => db.prepare('SELECT * FROM tags').all(),
  },
  test_types: {
    columns: ['id', 'name', 'checkliste'],
    rows: () => db.prepare('SELECT * FROM test_types').all()
      .map(tt => ({ ...tt, checkliste: db.prepare('SELECT text FROM test_type_items WHERE test_type_id = ? ORDER BY sort_order').all(tt.id).map(i => i.text).join('; ') })),
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
app.use('/files', express.static(FILES_DIR));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Fundus läuft auf http://localhost:${PORT}`);
});
