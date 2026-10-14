# app-in-hungry.github.io — 아침인사 이미지

네이버 '아침인사 이미지' 검색 실험(2026-10-14 사용자 결정) — 50·60대가 찾아 카톡으로 보내는 아침인사 그림을 날마다 한 장씩 내놓고, 토스 미니앱 '아침 인사 카드'로 잇는다.

- 카드 그림 · 목록: `docs/img/YYYYMMDD.jpg` · `data/cards.json` — 만드는 곳 `app34-morning-card/tools/shorts/imagecard.mjs`(쇼츠 장면 바탕 + 그날 인사 · 날짜 없음 · 토스 그래픽 없음).
- 공개: `node build.mjs` → `docs/`(쪽 · sitemap · rss) → main 에 push → GitHub Pages(main /docs). 카드는 한 번에 다 공개(제목에 날짜 없음) · 첫 쪽 '오늘의 그림'만 보는 사람 날짜(KST)로 고른다. 새 카드는 매달 쇼츠 묶음 때 같이.
- 설정 `site.json`: `naverVerification`(네이버 서치어드바이저 HTML 태그의 content 값) · `googleVerification` · `appLink`(토스 열기 단추).
- 로컬 미리보기: `SITE_TODAY=YYYY-MM-DD SITE_BASE=http://127.0.0.1:8791 node build.mjs` 뒤 `docs/` 를 정적 서버로(미리보기 뒤엔 SITE_BASE 없이 다시 node build.mjs).
- 이 사이트는 정보를 모으지 않는다(분석 · 쿠키 없음). 성과는 네이버 서치어드바이저 리포트와 미니앱 유입(from=web)으로 본다.
