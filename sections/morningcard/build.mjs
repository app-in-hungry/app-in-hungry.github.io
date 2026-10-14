// 아침 인사 카드 칸(/morningcard/) — 네이버 '아침인사 이미지' 검색 실험(2026-10-14). cards.json 의 카드를 docs/morningcard/ 쪽으로 만든다.
// 카드 그림 · 목록은 app34-morning-card/tools/shorts/imagecard.mjs 가 docs/morningcard/img · sections/morningcard/cards.json 에 넣는다.
// 카드는 제목에 날짜가 없어(2026-10-14 사용자 '범용성') 한 번에 다 공개한다. 칸 첫 쪽의 '오늘의 그림'만 보는 사람의 날짜(KST)로 고른다.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc, head, foot } from '../../lib/page.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const SEASONS = [['spring', '봄'], ['summer', '여름'], ['autumn', '가을'], ['winter', '겨울']];

export default function build({ hub, section, out, today }) {
  const all = JSON.parse(fs.readFileSync(path.join(HERE, 'cards.json'), 'utf8')).cards.sort((a, b) => a.iso.localeCompare(b.iso));
  const past = all.filter((c) => c.iso <= today).reverse(); // 최신 먼저
  if (past.length === 0) throw new Error(`오늘(${today})까지의 카드가 없어요`);
  for (const c of all) if (!fs.existsSync(path.join(out, 'img', `${c.id}.jpg`))) throw new Error(`그림 없음: ${c.id}`);

  const S = section.url;
  const img = (c) => `${S}/img/${c.id}.jpg`;
  const href = (c) => `${S}/p/${c.id}.html`;
  const pageTitle = (c) => `${c.title} — ${c.seasonKo} 아침인사 이미지`;
  const alt = (c) => `${c.title} 아침인사 이미지. ${c.body}`;
  const describe = (c) => `${c.weekdayKo} 아침에 보내기 좋은 ${c.seasonKo} 아침인사 이미지예요. "${c.body}" 길게 눌러 저장해 카톡으로 보내 보세요.`;
  const home = { url: section.index, label: section.label };
  const top = (o) => head({ ...o, home, hub });
  const bottom = foot({ text: `그림 · 글: ${esc(section.name)}(토스 미니앱). 글귀 출처는 카드마다 적어 두었어요. 이 사이트는 정보를 모으지 않아요.`, hub });
  const cta = `<div class="cta"><strong>매일 아침 새 카드를 받아 보세요</strong>토스 앱 검색창에 '${esc(section.name)}'를 찾으면 날마다 새 인사 카드를 저장하고 보낼 수 있어요.<a class="btn" href="${esc(section.appLink)}">토스에서 ${esc(section.name)} 열기</a></div>`;
  const grid = (list) => `<div class="grid">${list.map((c) => `<a href="${href(c)}"><img src="${img(c)}" alt="${esc(alt(c))}" loading="lazy" width="540" height="720"><span>${esc(c.title)}</span></a>`).join('')}</div>`;
  const nav = `<nav class="links">${WEEK.map((w, i) => `<a href="${S}/w/${i}.html">${w}요일 아침인사</a>`).join('')}${SEASONS.map(([k, ko]) => `<a href="${S}/s/${k}.html">${ko} 아침인사</a>`).join('')}</nav>`;

  for (const d of ['p', 'w', 's']) {
    fs.rmSync(path.join(out, d), { recursive: true, force: true });
    fs.mkdirSync(path.join(out, d), { recursive: true });
  }
  const write = (rel, html) => fs.writeFileSync(path.join(out, rel), html);

  // 카드 한 장마다 한 쪽(앞뒤는 날짜 차례)
  all.forEach((c, i) => {
    const prev = all[i - 1];
    const next = all[i + 1];
    write(`p/${c.id}.html`, `${top({ title: pageTitle(c), desc: describe(c), url: href(c), image: img(c) })}
<main><h1>${esc(c.title)}</h1>
<figure><img src="${img(c)}" alt="${esc(alt(c))}" width="1080" height="1440"></figure>
<p class="tip">그림을 길게 눌러 저장한 뒤 카톡으로 보내 보세요.</p>
<div class="text"><p><strong>${esc(c.body)}</strong></p>${c.bodySub ? `<p>${esc(c.bodySub)}</p>` : ''}${c.source ? `<p class="src">— ${esc(c.source)}</p>` : ''}</div>
${cta}
<div class="pn">${prev ? `<a href="${href(prev)}">← ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a href="${href(next)}">${esc(next.title)} →</a>` : '<span></span>'}</div>
<h2>${esc(c.weekdayKo)} 아침인사 이미지 더 보기</h2>${grid(all.filter((x) => x.weekday === c.weekday && x.id !== c.id).slice(0, 6))}
${nav}</main>${bottom}`);
  });

  // 칸 첫 쪽 — '오늘의 그림'은 보는 사람의 날짜(KST)로 바꿔 끼운다(검색 엔진은 만든 날 카드를 본다)
  const hero = past[0];
  const mini = all.map((c) => [c.iso, c.id, c.title]);
  write('index.html', `${top({ title: `아침인사 이미지 — 오늘 보내기 좋은 아침 인사 카드 | ${section.name}`, desc: '날마다 새로 그리는 아침인사 이미지예요. 요일 · 계절에 맞는 좋은 아침 인사 카드를 길게 눌러 저장해 카톡으로 보내 보세요.', url: section.index, image: img(hero) })}
<main><h1>오늘의 아침인사 이미지</h1>
<figure><a id="hero-a" href="${href(hero)}"><img id="hero-img" src="${img(hero)}" alt="${esc(alt(hero))}" width="1080" height="1440"></a></figure>
<p class="tip">그림을 길게 눌러 저장한 뒤 카톡으로 보내 보세요. 날마다 새 그림이 올라와요.</p>
${cta}${nav}<h2>최근 아침인사 이미지</h2>${grid(past.slice(1, 31))}</main>
<script>(function(){var C=${JSON.stringify(mini)};var t=new Date(Date.now()+324e5).toISOString().slice(0,10);var h=null;for(var i=0;i<C.length;i++){if(C[i][0]<=t)h=C[i];}if(!h)return;var a=document.getElementById('hero-a'),m=document.getElementById('hero-img');a.href='${S}/p/'+h[1]+'.html';m.src='${S}/img/'+h[1]+'.jpg';m.alt=h[2]+' 아침인사 이미지';})();</script>
${bottom}`);
  for (let w = 0; w < 7; w++) {
    const list = all.filter((c) => c.weekday === w);
    write(`w/${w}.html`, `${top({ title: `${WEEK[w]}요일 아침인사 이미지 모음 | ${section.name}`, desc: `${WEEK[w]}요일 아침에 보내기 좋은 아침인사 이미지 모음이에요.`, url: `${S}/w/${w}.html`, image: list[0] ? img(list[0]) : '' })}
<main><h1>${WEEK[w]}요일 아침인사 이미지</h1>${list.length ? grid(list) : '<p>곧 올라와요.</p>'}${cta}${nav}</main>${bottom}`);
  }
  for (const [k, ko] of SEASONS) {
    const list = all.filter((c) => c.season === k);
    write(`s/${k}.html`, `${top({ title: `${ko} 아침인사 이미지 모음 | ${section.name}`, desc: `${ko}에 보내기 좋은 아침인사 이미지 모음이에요.`, url: `${S}/s/${k}.html`, image: list[0] ? img(list[0]) : '' })}
<main><h1>${ko} 아침인사 이미지</h1>${list.length ? grid(list) : '<p>곧 올라와요.</p>'}${cta}${nav}</main>${bottom}`);
  }

  return {
    urls: [section.index, ...all.map(href), ...WEEK.map((_, i) => `${S}/w/${i}.html`), ...SEASONS.map(([k]) => `${S}/s/${k}.html`)],
    feed: past.slice(0, 30).map((c) => ({ title: pageTitle(c), link: href(c), iso: c.iso, html: `<img src="${img(c)}" alt="${esc(alt(c))}"><p>${esc(c.body)}</p>` })),
    card: { image: img(hero), alt: alt(hero) },
    log: `카드 ${all.length}장(${all[0].iso} ~ ${all.at(-1).iso}) · 지난 카드 ${past.length}`,
  };
}
