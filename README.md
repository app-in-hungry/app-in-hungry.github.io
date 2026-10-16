# app-in-hungry.github.io — 앱 홍보 허브

에프티에스(FTS) 미니앱을 토스 밖(네이버 · 구글 검색 · 카톡)에서 찾게 하는 정적 사이트. 2026-10-14 사용자: "이 주소는 아침 인사 카드 전용이 아니라 다른 앱 홍보도 하는 중심 허브로".

## 구조
- `site.json` 허브 설정 — 이름 · 첫 쪽 문구 · 네이버/구글 소유 확인 값(첫 쪽 head 에만) · `moved`(옮긴 옛 주소 → 404.html 이 새 주소로 보냄).
- `build.mjs` 허브 — `sections/*/section.json` 이 있는 칸을 모두 찾아 칸의 `build.mjs` 를 부르고, 첫 쪽(앱 모음) · `sitemap.xml` · `rss.xml` · `robots.txt` · `404.html` 을 만든다.
- `lib/page.mjs` 쪽 틀(머리 · 꼬리 · 큰 글씨 모양 · esc · rfc822).
- `sections/<appName>/` 앱 칸 하나 — `section.json`(name · label · tagline · order · appLink) + `build.mjs` + 자기 데이터.
  `build({ hub, section, out, today })` 는 자기 쪽을 `out`(= `docs/<appName>/`)에만 쓰고 `{ urls, feed, card, log }` 를 돌려준다(아침 인사 카드 칸이 견본).
- `docs/` = GitHub Pages(main /docs) 결과물. 칸의 그림 원본도 `docs/<appName>/` 안(예: `docs/morningcard/img/`).

## 칸 더하기(다른 앱 세션)
1. 칸 이름 = appName(예 `calc-age`). `legal` · `lucky-ladybug-legal` · `card-photos` 는 다른 저장소의 Pages 라 못 쓴다.
2. `sections/<appName>/section.json` · `build.mjs` 를 만든다.
3. `git pull --rebase` → `node build.mjs` → 자기 칸 파일 + 허브 결과물(`docs/index.html` · `docs/sitemap.xml` · `docs/rss.xml` · `docs/404.html`)만 파일 이름으로 add → push. 남의 칸은 건드리지 않는다.
4. 토스 열기 단추 = `intoss://<appName>/<콘솔에 등록한 경로>?from=web` — 앱이 `from` 을 들어온 길로 센다(app34 1.0 방식 · 다른 앱은 그 앱에서 받는 코드가 있어야 한다).
5. 토스 그래픽(TDS · 3D 이모지 등)은 쓰지 않는다(앱인토스 밖). 분석 스크립트 · 쿠키 · 입력 칸 없음 — 이 사이트는 정보를 모으지 않는다.

## 네이버 · 구글
- 네이버 서치어드바이저: https://app-in-hungry.github.io 소유 확인 · 사이트맵 `/sitemap.xml` · RSS `/rss.xml` 제출 끝(2026-10-14). 칸이 늘어도 다시 낼 필요 없다(같은 주소에 다 들어간다).
- 구글 서치 콘솔: 아직(`site.json` googleVerification).

## 칸
- `morningcard` 아침 인사 카드 — 네이버 '아침인사 이미지' 실험(카드 10/1~12/31 92장). 그림 · 목록은 `app34-morning-card/tools/shorts/imagecard.mjs` 가 `docs/morningcard/img` · `sections/morningcard/cards.json` 에 넣는다(매달 쇼츠 묶음 때). 첫 공개 판(10/14)의 `/p/` `/w/` `/s/` `/img/` 는 `/morningcard/` 아래로 옮겼다.

## 유튜브 채널
- `youtube/` 채널 @FTScm 꾸미기 — 배너(`banner.mjs` → `banner.png`) · 채널 설명 · 링크 · 키워드 · 올리는 법(`youtube/README.md`). 채널 이름이 회사 이름이라 다른 앱 영상도 여기로 모은다.

## 미리보기
`SITE_TODAY=YYYY-MM-DD SITE_BASE=http://127.0.0.1:8791 node build.mjs` → `docs/` 를 정적 서버로(없는 주소는 404.html) → 보고 나서 SITE_BASE 없이 다시 `node build.mjs`.
