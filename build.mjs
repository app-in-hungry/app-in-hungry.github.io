// 앱 홍보 허브(app-in-hungry.github.io) — 앱마다 칸(sections/<appName>/)이 자기 쪽을 docs/<appName>/ 에 만들고,
// 허브는 첫 쪽(앱 모음) · sitemap.xml · rss.xml · robots.txt · 404.html 을 만든다. 의존성 없음. GitHub Pages = main 의 /docs.
// 2026-10-14 사용자: 이 주소는 아침 인사 카드 전용이 아니라 앞으로 다른 앱 홍보도 함께 하는 중심 허브. 칸을 더하는 법은 README.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { esc, head, foot, rfc822 } from './lib/page.mjs';

const cfg = JSON.parse(fs.readFileSync('site.json', 'utf8'));
if (process.env.SITE_BASE) cfg.base = process.env.SITE_BASE; // 미리보기(로컬 서버)용
const OUT = 'docs';
const today = process.env.SITE_TODAY ?? new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const hub = { name: cfg.name, base: cfg.base };
// 같은 주소 아래 다른 저장소의 Pages — 칸 이름으로 쓰면 그쪽이 가린다.
const RESERVED = new Set(['legal', 'lucky-ladybug-legal', 'card-photos']);

const sections = [];
for (const slug of fs.readdirSync('sections').sort()) {
  const file = path.join('sections', slug, 'section.json');
  if (!fs.existsSync(file)) continue;
  if (RESERVED.has(slug) || !/^[a-z0-9-]+$/.test(slug)) throw new Error(`칸 이름으로 못 써요: ${slug}`);
  const section = { slug, ...JSON.parse(fs.readFileSync(file, 'utf8')), url: `${cfg.base}/${slug}`, index: `${cfg.base}/${slug}/` };
  const { default: build } = await import(pathToFileURL(path.resolve('sections', slug, 'build.mjs')).href);
  const out = path.join(OUT, slug);
  fs.mkdirSync(out, { recursive: true });
  const made = await build({ hub, section, out, today });
  sections.push({ ...section, ...made });
  console.log(`칸 ${slug} · 쪽 ${made.urls.length} · ${made.log ?? ''}`);
}
if (sections.length === 0) throw new Error('칸이 하나도 없어요');
sections.sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.slug.localeCompare(b.slug));

const write = (rel, text) => fs.writeFileSync(path.join(OUT, rel), text);
const home = { url: `${cfg.base}/`, label: cfg.name };

// 첫 쪽 — 앱 모음. 네이버 · 구글 소유 확인 메타는 여기 head 에만.
const verify = `${cfg.naverVerification ? `<meta name="naver-site-verification" content="${esc(cfg.naverVerification)}">` : ''}${cfg.googleVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleVerification)}">` : ''}`;
write('index.html', `${head({ title: `${cfg.name} — ${cfg.headline}`, desc: cfg.description, url: home.url, image: sections[0].card?.image, home, hub, extraHead: verify })}
<main><h1>${esc(cfg.headline)}</h1>
<div class="apps">${sections.map((s) => `<a class="app" href="${s.index}">${s.card?.image ? `<img src="${s.card.image}" alt="${esc(s.card.alt ?? s.name)}" width="96" height="128">` : ''}<div><strong>${esc(s.name)}</strong><span>${esc(s.tagline)}</span></div></a>`).join('')}</div></main>
${foot({ text: '이 사이트는 정보를 모으지 않아요.' })}`);

// 찾는 쪽이 없을 때 — 옮긴 주소(site.json moved)는 새 주소로 보낸다
write('404.html', `${head({ title: `찾는 쪽이 없어요 | ${cfg.name}`, url: home.url, home, hub, extraHead: '<meta name="robots" content="noindex">' })}
<main><h1>찾는 쪽이 없어요</h1><p><a href="${home.url}">처음으로 가기</a></p></main>
<script>(function(){var p=location.pathname,M=${JSON.stringify(cfg.moved ?? [])};for(var i=0;i<M.length;i++){var r=new RegExp(M[i][0]);if(r.test(p)){location.replace('${cfg.base}'+p.replace(r,M[i][1])+location.search);return;}}})();</script>
${foot({ text: '' })}`);

// 검색 엔진용 — 칸이 늘어도 주소는 그대로(네이버에 낸 sitemap · rss)
const urls = [home.url, ...sections.flatMap((s) => s.urls)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${esc(u)}</loc></url>`).join('\n')}\n</urlset>\n`);
const feed = sections.flatMap((s) => s.feed ?? []).sort((a, b) => b.iso.localeCompare(a.iso) || a.link.localeCompare(b.link)).slice(0, 50);
write('rss.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(cfg.name)}</title><link>${home.url}</link><description>${esc(cfg.description)}</description><language>ko</language>\n${feed.map((f) => `<item><title>${esc(f.title)}</title><link>${esc(f.link)}</link><guid>${esc(f.link)}</guid><pubDate>${rfc822(f.iso)}</pubDate><description>${esc(f.html)}</description></item>`).join('\n')}\n</channel></rss>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${cfg.base}/sitemap.xml\n`);
write('.nojekyll', '');
console.log(`만든 날 ${today} · 칸 ${sections.length} · sitemap ${urls.length} · rss ${feed.length} · docs/`);
