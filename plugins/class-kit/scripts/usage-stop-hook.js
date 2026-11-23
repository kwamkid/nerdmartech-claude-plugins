#!/usr/bin/env node
// Nerd MarTech Class Kit — Stop hook (Mac + Windows, Node only, no jq): after every reply, show the user
//   1) how long this chat is (context tokens vs a target), and
//   2) plan usage: 5-hour and weekly % used + reset time (same numbers as claude.ai/settings/usage).
// Output is {systemMessage}: shown to the user only, not added to the model's context.
//
// Plan usage comes from https://api.anthropic.com/api/oauth/usage — the endpoint Claude Code itself
// uses. It is NOT a published API and may change; on any failure the quota part is simply skipped.
// The login token is read locally (macOS Keychain or ~/.claude/.credentials.json) and sent only to
// api.anthropic.com. Results are cached for CACHE_SEC so we do not call the server on every reply.

const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');

const TARGET_K = 120;   // Pro plan: suggest a fresh chat well before the 200k window
const CACHE_SEC = 60;   // reuse the last usage answer for this long
const CACHE_FILE = path.join(os.tmpdir(), 'nerd-class-kit-usage.json');

function readStdin() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; }
}

// Context size = input + cache tokens of the last main-thread assistant message.
function contextTokens(file) {
  try {
    const st = fs.statSync(file);
    const len = Math.min(st.size, 2 * 1024 * 1024);
    const fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(len);
    fs.readSync(fd, buf, 0, len, st.size - len);
    fs.closeSync(fd);
    const lines = buf.toString('utf8').split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      if (!lines[i].includes('"usage"')) continue;
      try {
        const o = JSON.parse(lines[i]);
        const u = o.type === 'assistant' && !o.isSidechain && o.message && o.message.usage;
        if (u) return (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
      } catch { /* partial first line */ }
    }
  } catch { /* no transcript */ }
  return 0;
}

function readToken() {
  let raw = null;
  if (process.platform === 'darwin') {
    try { raw = execFileSync('security', ['find-generic-password', '-s', 'Claude Code-credentials', '-w'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 2000 }); } catch {}
  }
  if (!raw) {
    const dir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
    try { raw = fs.readFileSync(path.join(dir, '.credentials.json'), 'utf8'); } catch {}
  }
  try {
    const o = JSON.parse(raw).claudeAiOauth;
    if (!o || !o.accessToken) return null;
    if (o.expiresAt && o.expiresAt < Date.now()) return null; // Claude Code refreshes it on its own
    return o.accessToken;
  } catch { return null; }
}

function fetchUsage(token) {
  return new Promise((resolve) => {
    const req = https.request('https://api.anthropic.com/api/oauth/usage', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, 'anthropic-beta': 'oauth-2025-04-20' },
      timeout: 3000,
    }, (res) => {
      let s = '';
      res.on('data', (d) => (s += d));
      res.on('end', () => { try { resolve(res.statusCode === 200 ? JSON.parse(s) : null); } catch { resolve(null); } });
    });
    req.on('timeout', () => req.destroy());
    req.on('error', () => resolve(null));
    req.end();
  });
}

async function getUsage() {
  try {
    const c = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (Date.now() - c.at < CACHE_SEC * 1000) return c.data;
  } catch {}
  const token = readToken();
  if (!token) return null;
  const data = await fetchUsage(token);
  if (data) try { fs.writeFileSync(CACHE_FILE, JSON.stringify({ at: Date.now(), data })); } catch {}
  return data;
}

const DAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
function when(iso, withDay) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const sameDay = d.toDateString() === new Date().toDateString();
  return withDay && !sameDay ? `${DAYS[d.getDay()]} ${hm}` : hm;
}
function dot(p) { return p >= 90 ? '🔴' : p >= 70 ? '🟡' : '🟢'; }

(async () => {
  const input = readStdin();
  const parts = [];

  const k = Math.round(contextTokens(input.transcript_path) / 1000);
  let advice = '';
  if (k > 0) {
    const pct = Math.round((k * 100) / TARGET_K);
    let tag = '🟢';
    if (k >= TARGET_K) { tag = '🔴'; advice = 'แชตยาวแล้ว — สรุปงานแล้วเปิดแชตใหม่ (/memo → /clear)'; }
    else if (k >= TARGET_K * 0.75) { tag = '🟡'; advice = 'ใกล้เต็ม — จบเรื่องนี้แล้วสรุปงาน (/memo)'; }
    parts.push(`แชตนี้ยาว ${pct}% ${tag}`);
  }

  const u = await getUsage();
  if (u) {
    const h5 = u.five_hour;
    if (h5 && h5.utilization != null) parts.push(`โควตา 5 ชม. ใช้ไป ${Math.round(h5.utilization)}% ${dot(h5.utilization)} (รีเซ็ต ${when(h5.resets_at, false)})`);
    const w7 = u.seven_day;
    if (w7 && w7.utilization != null) parts.push(`สัปดาห์นี้ ${Math.round(w7.utilization)}%`);
    if (h5 && h5.utilization >= 90 && !advice) advice = 'โควตาใกล้หมด — ใช้แต่งานสำคัญ หรือรอรีเซ็ต';
  }

  if (advice) parts.push(advice);
  if (parts.length) process.stdout.write(JSON.stringify({ systemMessage: parts.join(' · ') }));
})();
