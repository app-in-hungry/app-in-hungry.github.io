// 유튜브 채널(@FTScm) 배너 — 2560×1440 PNG(6MB 아래). 컨테이너에서 돌려요(헤드리스 크롬 · Pretendard).
//   node youtube/banner.mjs   → youtube/banner.png · youtube/preview-{phone,pc,tv}.png
// 유튜브는 기기마다 가운데만 잘라 보여 줘요 — 폰 1546×423 · PC 2560×423 · TV 전체. 글자 · 해님이는 폰 칸(x 507~2053 · y 508~932) 안에만.
// 그림은 직접 그린 것만(토스 그래픽은 앱인토스 밖에서 안 써요). 해님이 기하는 app34 src/app/mascotGeometry.ts 와 같아요.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HOME = os.homedir();
const FONT = process.env.BANNER_FONT || path.join(HOME, 'shots-refresh/fonts/PretendardVariable.ttf');
const PW = process.env.PW_CORE || path.join(HOME, 'bird-tmp/node_modules/playwright-core/index.mjs');
const CHROME = process.env.CHROME_BIN || path.join(HOME, '.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux-arm64/chrome-headless-shell');

export const TEXT = { line1: '매일 아침 6시', line2: '새 아침 인사가 올라와요' };
const W = 2560;
const H = 1440;
const SAFE = { x: 507, y: 508, w: 1546, h: 423 };

// 해님이 — viewBox 128 · 몸 노랑 · 햇살 앰버(앱 안 색)
function sunny(cx, cy, scale) {
  const body = { cx: 64, cy: 68, r: 30 };
  const rays = [0, 45, 90, 135, 180, 225, 270, 315]
    .map((deg) => `<rect x="${body.cx + 38}" y="${body.cy - 4.5}" width="14" height="9" rx="4.5" fill="#d98e04" transform="rotate(${deg} ${body.cx} ${body.cy})"/>`)
    .join('');
  const face = [
    '<ellipse cx="53" cy="64" rx="3.4" ry="4.2" fill="#191f28"/><ellipse cx="75" cy="64" rx="3.4" ry="4.2" fill="#191f28"/>',
    '<circle cx="54.3" cy="62.5" r="1.2" fill="#fff"/><circle cx="76.3" cy="62.5" r="1.2" fill="#fff"/>',
    '<circle cx="46" cy="73" r="4.5" fill="#ff9f9f"/><circle cx="82" cy="73" r="4.5" fill="#ff9f9f"/>',
    '<path d="M57 75 Q64 82 71 75" fill="none" stroke="#191f28" stroke-width="2.6" stroke-linecap="round"/>',
  ].join('');
  return `<g transform="translate(${cx - body.cx * scale} ${cy - body.cy * scale}) scale(${scale})">${rays}<circle cx="${body.cx}" cy="${body.cy}" r="${body.r}" fill="#ffd43b"/>${face}</g>`;
}

// 뭉게구름 — 동그라미 몇 개 + 납작한 바닥
function cloud(x, y, s, o = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="#ffffff" opacity="${o}"><circle cx="0" cy="0" r="34"/><circle cx="42" cy="-14" r="44"/><circle cx="92" cy="2" r="32"/><rect x="-30" y="0" width="150" height="34" rx="17"/></g>`;
}

// 동글 나무 — 폰 칸 밖(PC · TV 에서만 보이는 양 끝)에
function tree(x, baseY, s, leaf) {
  return `<g transform="translate(${x} ${baseY}) scale(${s})"><rect x="-5" y="-34" width="10" height="36" rx="4" fill="#9A7B55"/><circle cx="0" cy="-58" r="34" fill="${leaf}"/><circle cx="-12" cy="-66" r="10" fill="#ffffff" opacity="0.18"/></g>`;
}

// 멀리 나는 새 — 두 번 꺾인 선
function bird(x, y, s) {
  return `<path d="M${x} ${y} q${8 * s} ${-9 * s} ${16 * s} 0 q${8 * s} ${-9 * s} ${16 * s} 0" fill="none" stroke="#8A7A66" stroke-width="${3 * s}" stroke-linecap="round" opacity="0.7"/>`;
}

// 물결 언덕 — 왼쪽 끝부터 오른쪽 끝까지 사인 곡선을 이어 아래를 채운다
function hill(baseY, amp, period, phase, fill) {
  let d = `M0 ${H} L0 ${baseY}`;
  for (let x = 0; x <= W; x += 20) d += ` L${x} ${(baseY - amp * Math.sin((x / period) * Math.PI * 2 + phase)).toFixed(1)}`;
  return `<path d="${d} L${W} ${H} Z" fill="${fill}"/>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFF9EF"/><stop offset="0.5" stop-color="#FFF1DC"/><stop offset="0.66" stop-color="#FFE6C2"/><stop offset="1" stop-color="#FFE6C2"/>
  </linearGradient>
  <radialGradient id="glow" cx="${(780 / W).toFixed(4)}" cy="${(715 / H).toFixed(4)}" r="0.22">
    <stop offset="0" stop-color="#FFE9A8" stop-opacity="0.9"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="field" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3CF7A"/><stop offset="1" stop-color="#E9B455"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
${cloud(260, 640, 1.1, 0.95)}${cloud(2230, 590, 1.25, 0.95)}${cloud(1180, 250, 1.4, 0.8)}${cloud(1900, 330, 0.9, 0.75)}${cloud(420, 300, 0.8, 0.7)}
${bird(2110, 700, 1.3)}${bird(2175, 668, 1)}${bird(395, 748, 1.1)}
${hill(888, 26, 1400, 0.6, '#CFD8E2')}
${tree(120, 916, 1.1, '#9CC584')}${tree(215, 922, 0.8, '#B5D49A')}${tree(2330, 914, 1.05, '#9CC584')}${tree(2440, 920, 0.85, '#B5D49A')}
${hill(912, 18, 900, 2.2, '#B9D3A2')}
${hill(938, 12, 1250, 4.1, 'url(#field)')}
${hill(1090, 16, 1700, 1.3, '#EDBF62')}
${hill(1250, 20, 2100, 3.3, '#E5AE4E')}
${sunny(780, 715, 3.0)}
</svg>`;

const fontUrl = `data:font/ttf;base64,${fs.readFileSync(FONT).toString('base64')}`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:P;src:url(${fontUrl}) format('truetype');font-weight:100 900}
html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden}
.t{position:absolute;left:1010px;top:0;height:${H}px;display:flex;flex-direction:column;justify-content:center;font-family:P;letter-spacing:-0.02em;padding-bottom:16px}
.l1{font-size:138px;font-weight:800;color:#2B2118;line-height:1.12}
.l2{font-size:92px;font-weight:700;color:#A35C00;line-height:1.25;margin-top:10px}
</style></head><body>${svg.replace('<svg ', '<svg style="position:absolute;inset:0" ')}<div class="t"><div class="l1">${TEXT.line1}</div><div class="l2">${TEXT.line2}</div></div></body></html>`;

const { chromium } = await import(PW);
const A = path.join(HOME, 'aptlocal');
const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--no-sandbox'],
  env: { ...process.env, LD_LIBRARY_PATH: [path.join(A, 'root/usr/lib/aarch64-linux-gnu'), path.join(A, 'root/lib/aarch64-linux-gnu')].join(':'), FONTCONFIG_FILE: path.join(A, 'fonts.conf') },
});
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
// 글자가 폰 칸 안에 들어가는지 잰다(넘치면 실패)
const box = await page.evaluate(() => {
  const r = (s) => document.querySelector(s).getBoundingClientRect();
  const a = r('.l1');
  const b = r('.l2');
  const range = (el) => { const g = document.createRange(); g.selectNodeContents(el); return g.getBoundingClientRect(); };
  const ta = range(document.querySelector('.l1'));
  const tb = range(document.querySelector('.l2'));
  return { left: Math.min(ta.left, tb.left), right: Math.max(ta.right, tb.right), top: a.top, bottom: b.bottom };
});
const inSafe = box.left >= SAFE.x + 40 && box.right <= SAFE.x + SAFE.w - 40 && box.top >= SAFE.y + 30 && box.bottom <= SAFE.y + SAFE.h - 60;
console.log(`글자 상자 x ${Math.round(box.left)}~${Math.round(box.right)} · y ${Math.round(box.top)}~${Math.round(box.bottom)} · 폰 칸 안 ${inSafe ? '예' : '아니요'}`);
if (!inSafe) throw new Error('글자가 폰에서 잘려요 — 크기나 자리를 줄여 주세요');
const out = path.join(HERE, 'banner.png');
await page.screenshot({ path: out });
// 기기별로 보이는 부분(검수용)
const shot = async (name, clip, scale) => {
  const p2 = await browser.newPage({ viewport: { width: Math.round(clip.width * scale), height: Math.round(clip.height * scale) } });
  await p2.setContent(`<body style="margin:0"><img src="data:image/png;base64,${fs.readFileSync(out).toString('base64')}" style="display:block;transform-origin:0 0;transform:scale(${scale}) translate(${-clip.x}px,${-clip.y}px)"></body>`);
  await p2.screenshot({ path: path.join(HERE, `preview-${name}.png`) });
  await p2.close();
};
await shot('phone', { x: SAFE.x, y: SAFE.y, width: SAFE.w, height: SAFE.h }, 0.5);
await shot('pc', { x: 0, y: SAFE.y, width: W, height: SAFE.h }, 0.5);
await shot('tv', { x: 0, y: 0, width: W, height: H }, 0.5);
await browser.close();
console.log(`banner.png ${(fs.statSync(out).size / 1024).toFixed(0)}KB · preview-phone · pc · tv`);
