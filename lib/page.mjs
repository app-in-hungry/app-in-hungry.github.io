// 허브 · 칸이 같이 쓰는 쪽 틀 — 글자 이스케이프 · 머리 · 꼬리 · 기본 모양(50·60대 눈에 맞춘 큰 글씨). 의존성 없음.
// 칸이 색을 바꾸고 싶으면 head({ css }) 로 :root 변수만 덮어쓴다.

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

/** RSS 날짜 — 그날 아침 6시(KST)를 기본으로. */
export const rfc822 = (iso, time = '06:00') => new Date(`${iso}T${time}:00+09:00`).toUTCString();

const BASE_CSS = `
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
.apps{display:flex;flex-direction:column;gap:14px;margin:18px 0}
.app{display:flex;gap:16px;align-items:center;background:var(--card);border-radius:18px;padding:14px;text-decoration:none;box-shadow:0 4px 16px rgba(90,60,20,.08)}
.app img{width:96px;height:128px;object-fit:cover;border-radius:12px;flex:none}
.app strong{display:block;font-size:21px;margin-bottom:4px}.app span{display:block;color:var(--sub);font-size:17px;line-height:1.5}
footer{max-width:620px;margin:24px auto;padding:16px;color:var(--sub);font-size:14px}footer a{color:var(--sub)}`;

/**
 * 쪽 머리 — `<head>` + 맨 위 이름 줄.
 * home = 맨 위 이름 줄의 { url, label }(칸 쪽이면 칸 첫 쪽) · hub = { name, base }(사이트 전체 RSS 링크) · extraHead = 소유 확인 메타 등.
 */
export function head({ title, desc, url, image, home, hub, extraHead = '', css = '' }) {
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>${desc ? `<meta name="description" content="${esc(desc)}">` : ''}<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}">${desc ? `<meta property="og:description" content="${esc(desc)}">` : ''}<meta property="og:url" content="${esc(url)}">${image ? `<meta property="og:image" content="${esc(image)}">` : ''}
<link rel="alternate" type="application/rss+xml" title="${esc(hub.name)} 새 글" href="${hub.base}/rss.xml">${extraHead}
<style>${BASE_CSS}${css}</style></head><body>
<header class="top"><a href="${esc(home.url)}">${esc(home.label)}</a></header>`;
}

/** 쪽 꼬리 — 칸 쪽이면 허브로 가는 줄을 붙인다(hub 를 넘길 때). */
export function foot({ text, hub }) {
  return `<footer>${text}${hub ? `<br><a href="${hub.base}/">${esc(hub.name)} — 다른 앱 보기</a>` : ''}</footer></body></html>\n`;
}
