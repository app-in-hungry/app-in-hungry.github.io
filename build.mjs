// 아침인사 이미지 사이트 — data/cards.json 의 카드를 docs/ 정적 쪽으로 만든다(의존성 없음). GitHub Pages = main 의 /docs.
// 카드 그림 · 목록은 app34-morning-card/tools/shorts/imagecard.mjs 가 docs/img · data/ 에 넣는다. 그다음 `node build.mjs` → git push.
// 카드는 제목에 날짜가 없어(2026-10-14 사용자 '범용성') 한 번에 다 공개한다. 첫 쪽의 '오늘의 그림'만 보는 사람의 날짜(KST)로 고른다(작은 스크립트 · 없으면 만든 날 카드).
import fs from 'node:fs';
import path from 'node:path';

const cfg = JSON.parse(fs.readFileSync('site.json', 'utf8'));
if (process.env.SITE_BASE) cfg.base = process.env.SITE_BASE; // 미리보기(로컬 서버)용
const OUT = 'docs';
const today = process.env.SITE_TODAY ?? new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const all = JSON.parse(fs.readFileSync('data/cards.json', 'utf8')).cards.sort((a, b) => a.iso.localeCompare(b.iso));
const past = all.filter((c) => c.iso <= today).reverse(); // 최신 먼저
if (past.length === 0) throw new Error(`오늘(${today})까지의 카드가 없어요`);
for (const c of all) if (!fs.existsSync(path.join(OUT, 'img', `${c.id}.jpg`))) throw new Error(`그림 없음: ${c.id}`);

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const SEASONS = [['spring', '봄'], ['summer', '여름'], ['autumn', '가을'], ['winter', '겨울']];
const img = (c) => `${cfg.base}/img/${c.id}.jpg`;
const href = (c) => `${cfg.base}/p/${c.id}.html`;
const pageTitle = (c) => `${c.title} — ${c.seasonKo} 아침인사 이미지`;
const alt = (c) => `${c.title} 아침인사 이미지. ${c.body}`;
const describe = (c) => `${c.weekdayKo} 아침에 보내기 좋은 ${c.seasonKo} 아침인사 이미지예요. "${c.body}" 길게 눌러 저장해 카톡으로 보내 보세요.`;

const css = `
:root{--bg:#fff8ec;--ink:#3a2a1a;--sub:#7a6a5a;--accent:#d98e04;--card:#ffffff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;font-size:19px;line-height:1.65;word-break:keep-all}
a{color:inherit}main{max-width:620px;margin:0 auto;padding:16px}
header.top{max-width:620px;margin:0 auto;padding:18px 16px 4px}header.top a{text-decoration:none;font-weight:800;font-size:22px}
h1{font-size:26px;line-height:1.4;margin:10px 0 14px}h2{font-size:21px;margin:28px 0 10px}
figure{margin:0}figure img{width:100%;height:auto;border-radius:18px;display:block;box-shadow:0 6px 24px rgba(90,60,20,.12)}
.text{background:var(--card);border-radius:18px;padding:18px 20px;margin:16px 0}.text p{margin:6px 0}.src{color:var(--sub);font-size:16px}
.tip{color:var(--sub);font-size:17px}
.cta{background:#fff2cc;border-radius:18px;padding:18px 20px;margin:20px 0}.cta strong{display:block;font-size:20px;margin-bottom:6px}
.btn{display:block;text-align:center;background:var(--accent);color:#fff;text-decoration:none;font-weight:800;border-radius:14px;padding:14px;margin-top:12px;font-size:19px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.grid a{text-decoration:none}.grid img{width:100%;height:auto;border-radius:12px;display:block}.grid span{display:block;font-size:15px;line-height:1.4;margin-top:6px}
nav.links{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}nav.links a{background:var(--card);border-radius:999px;padding:8px 14px;text-decoration:none;font-size:16px}
.pn{display:flex;justify-content:space-between;gap:12px;margin:18px 0;font-size:16px}
footer{max-width:620px;margin:24px auto;padding:16px;color:var(--sub);font-size:14px}`;

const head = ({ title, desc, url, image, extra = '' }) => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(url)}">${image ? `<meta property="og:image" content="${esc(image)}">` : ''}
<link rel="alternate" type="application/rss+xml" title="${esc(cfg.name)} 아침인사 이미지" href="${cfg.base}/rss.xml">${extra}
<style>${css}</style></head><body>
<header class="top"><a href="${cfg.base}/">☀️ 아침인사 이미지 · ${esc(cfg.name)}</a></header>`;
const foot = `<footer>그림 · 글: ${esc(cfg.name)}(토스 미니앱). 글귀 출처는 카드마다 적어 두었어요. 이 사이트는 정보를 모으지 않아요.</footer></body></html>\n`;
const cta = `<div class="cta"><strong>매일 아침 새 카드를 받아 보세요</strong>토스 앱 검색창에 '아침 인사 카드'를 찾으면 날마다 새 인사 카드를 저장하고 보낼 수 있어요.<a class="btn" href="${esc(cfg.appLink)}">토스에서 아침 인사 카드 열기</a></div>`;
const grid = (list) => `<div class="grid">${list.map((c) => `<a href="${href(c)}"><img src="${img(c)}" alt="${esc(alt(c))}" loading="lazy" width="540" height="720"><span>${esc(c.title)}</span></a>`).join('')}</div>`;
const nav = `<nav class="links">${WEEK.map((w, i) => `<a href="${cfg.base}/w/${i}.html">${w}요일 아침인사</a>`).join('')}${SEASONS.map(([k, ko]) => `<a href="${cfg.base}/s/${k}.html">${ko} 아침인사</a>`).join('')}</nav>`;

for (const d of ['p', 'w', 's']) {
  fs.rmSync(path.join(OUT, d), { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, d), { recursive: true });
}
const write = (rel, html) => fs.writeFileSync(path.join(OUT, rel), html);

// 카드 한 장마다 한 쪽(앞뒤는 날짜 차례)
all.forEach((c, i) => {
  const prev = all[i - 1];
  const next = all[i + 1];
  write(`p/${c.id}.html`, `${head({ title: pageTitle(c), desc: describe(c), url: href(c), image: img(c) })}
<main><h1>${esc(c.title)}</h1>
<figure><img src="${img(c)}" alt="${esc(alt(c))}" width="1080" height="1440"></figure>
<p class="tip">그림을 길게 눌러 저장한 뒤 카톡으로 보내 보세요.</p>
<div class="text"><p><strong>${esc(c.body)}</strong></p>${c.bodySub ? `<p>${esc(c.bodySub)}</p>` : ''}${c.source ? `<p class="src">— ${esc(c.source)}</p>` : ''}</div>
${cta}
<div class="pn">${prev ? `<a href="${href(prev)}">← ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a href="${href(next)}">${esc(next.title)} →</a>` : '<span></span>'}</div>
<h2>${esc(c.weekdayKo)} 아침인사 이미지 더 보기</h2>${grid(all.filter((x) => x.weekday === c.weekday && x.id !== c.id).slice(0, 6))}
${nav}</main>${foot}`);
});

// 첫 쪽 — '오늘의 그림'은 보는 사람의 날짜(KST)로 바꿔 끼운다(검색 엔진은 만든 날 카드를 본다)
const verify = `${cfg.naverVerification ? `<meta name="naver-site-verification" content="${esc(cfg.naverVerification)}">` : ''}${cfg.googleVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleVerification)}">` : ''}`;
const hero = past[0];
const mini = all.map((c) => [c.iso, c.id, c.title]);
write('index.html', `${head({ title: `아침인사 이미지 — 오늘 보내기 좋은 좋은 아침 인사 카드 | ${cfg.name}`, desc: '날마다 새로 그리는 아침인사 이미지예요. 요일 · 계절에 맞는 좋은 아침 인사 카드를 길게 눌러 저장해 카톡으로 보내 보세요.', url: `${cfg.base}/`, image: img(hero), extra: verify })}
<main><h1>오늘의 아침인사 이미지</h1>
<figure><a id="hero-a" href="${href(hero)}"><img id="hero-img" src="${img(hero)}" alt="${esc(alt(hero))}" width="1080" height="1440"></a></figure>
<p class="tip">그림을 길게 눌러 저장한 뒤 카톡으로 보내 보세요. 날마다 새 그림이 올라와요.</p>
${cta}${nav}<h2>최근 아침인사 이미지</h2>${grid(past.slice(1, 31))}</main>
<script>(function(){var C=${JSON.stringify(mini)};var t=new Date(Date.now()+324e5).toISOString().slice(0,10);var h=null;for(var i=0;i<C.length;i++){if(C[i][0]<=t)h=C[i];}if(!h)return;var a=document.getElementById('hero-a'),m=document.getElementById('hero-img');a.href='${cfg.base}/p/'+h[1]+'.html';m.src='${cfg.base}/img/'+h[1]+'.jpg';m.alt=h[2]+' 아침인사 이미지';})();</script>
${foot}`);
for (let w = 0; w < 7; w++) {
  const list = all.filter((c) => c.weekday === w);
  write(`w/${w}.html`, `${head({ title: `${WEEK[w]}요일 아침인사 이미지 모음 | ${cfg.name}`, desc: `${WEEK[w]}요일 아침에 보내기 좋은 아침인사 이미지 모음이에요.`, url: `${cfg.base}/w/${w}.html`, image: list[0] ? img(list[0]) : '' })}
<main><h1>${WEEK[w]}요일 아침인사 이미지</h1>${list.length ? grid(list) : '<p>곧 올라와요.</p>'}${cta}${nav}</main>${foot}`);
}
for (const [k, ko] of SEASONS) {
  const list = all.filter((c) => c.season === k);
  write(`s/${k}.html`, `${head({ title: `${ko} 아침인사 이미지 모음 | ${cfg.name}`, desc: `${ko}에 보내기 좋은 아침인사 이미지 모음이에요.`, url: `${cfg.base}/s/${k}.html`, image: list[0] ? img(list[0]) : '' })}
<main><h1>${ko} 아침인사 이미지</h1>${list.length ? grid(list) : '<p>곧 올라와요.</p>'}${cta}${nav}</main>${foot}`);
}

// 검색 엔진용
const urls = [`${cfg.base}/`, ...all.map(href), ...WEEK.map((_, i) => `${cfg.base}/w/${i}.html`), ...SEASONS.map(([k]) => `${cfg.base}/s/${k}.html`)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${esc(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
const rfc822 = (iso) => new Date(`${iso}T06:00:00+09:00`).toUTCString();
write('rss.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(cfg.name)} 아침인사 이미지</title><link>${cfg.base}/</link><description>날마다 새로 그리는 아침인사 이미지</description><language>ko</language>\n${past.slice(0, 30).map((c) => `<item><title>${esc(pageTitle(c))}</title><link>${href(c)}</link><guid>${href(c)}</guid><pubDate>${rfc822(c.iso)}</pubDate><description>${esc(`<img src="${img(c)}" alt="${alt(c)}"><p>${c.body}</p>`)}</description></item>`).join('\n')}\n</channel></rss>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${cfg.base}/sitemap.xml\n`);
write('.nojekyll', '');
console.log(`만든 날 ${today} · 카드 ${all.length}장(${all[0].iso} ~ ${all.at(-1).iso}) · 지난 카드 ${past.length} · docs/`);
