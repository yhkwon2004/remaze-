# MAZE — 공식 브랜드 웹사이트

> "버려지는 것에 새로운 가치를 더한다"  
> 폐 키보드 키캡을 업사이클링해 굿즈로 만드는 ESG 스타트업

---

## 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 기업명 | MAZE (메이즈) |
| 대표 | 권용현 (04년생) |
| SNS | [@dydgus_.0802](https://www.instagram.com/dydgus_.0802) |
| 색상 팔레트 | `#2d7a3a` (그린) · `#0a0c0f` (다크) · `#fff` |
| 관리자 이메일 | `yhkwon2004@gmail.com` |
| 관리자 PW | `procmd0802` |

---

## 완료된 기능

### 메인 (index.html)
- 풀페이지 스크롤 (8슬라이드: Hero → About → Problem → Solution → Products → Projects → Impact → Contact)
- **네비게이션 구조**: Home·About·Problem·Solution·Products·Projects·Impact는 작은 도트(●)로 숨김 처리 / Awards·CEO·Community·Contact는 버튼 형태로 강조 표시
- 갤러리 링크는 메인 네비 및 푸터에서 제거 (관리자 직접 URL 접근)
- 파티클 캔버스 Hero 애니메이션
- 슬라이드별 진입 애니메이션 (`data-anim`, `data-delay`)
- 성과 숫자 카운터 애니메이션 (1시간 완판, 130건, 수상 5회)
- 슬라이드 인디케이터 (클릭 이동)
- 반응형 햄버거 네비게이션
- Green Cycle 현대차그룹 뉴스 링크 버튼
- 문의 폼 → RESTful Table API (`contact_inquiries`)

### 풀페이지 스크롤 동작
| 입력 | 동작 |
|---|---|
| 마우스 휠 | 슬라이드 이동 |
| 키보드 ↑↓ / PgUp·PgDn | 슬라이드 이동 |
| 터치 스와이프 | 슬라이드 이동 (모든 화면) |
| **마우스 드래그** | **비활성화** → 터치 토스트 안내 표시 |

### 로그인 (login.html) ← **최신 업데이트**
- **이메일 전용** 계정 식별 (아이디 방식 제거)
- 관리자: 이메일 `yhkwon2004@maze.kr` 또는 `yhkwon2004` / 비밀번호 `0802`
- 이메일 형식 실시간 유효성 검사 + 힌트 표시
- 비밀번호 표시/숨김 토글
- 비밀번호 강도 표시 바
- **비밀번호 찾기 3단계 플로우**:
  1. 이메일 입력 → 임시 비밀번호 발급 (15분 유효, 데모 화면 표시)
  2. 임시 코드 확인 + 새 비밀번호 입력
  3. 완료 화면 → 로그인 이동
- **드래그 입력 비활성화** → 드롭 시 터치 안내 토스트 표시
- 모바일 첫 방문 시 "터치하여 입력하세요" 자동 안내

### 커뮤니티 (community.html)
- 로그인 필수 (미로그인 시 login.html 리디렉션)
- 게시판 CRUD (작성·보기·삭제)
- 댓글 작성
- 공지사항 (관리자 전용 작성)
- 검색 및 페이지네이션

### 갤러리 (gallery.html)
- **관리자 전용 접근** — 비로그인·일반회원은 차단 안내 화면 표시
- 카테고리 필터 (제품·프로젝트·협업·행사)
- 매이슨리 레이아웃 + 라이트박스 뷰어
- 관리자 사진 업로드 (드래그&드롭 또는 클릭)
- 기본 갤러리 이미지 4종 포함

### CEO 소개 (about-ceo.html)
- 권용현 대표 프로필
- 가치관 및 비전 섹션
- CMU 글로벌 3위, Green Cycle 기부 마일스톤
- 드래그 방지 (main.js 공통 적용)

### 수상 (awards.html)
- 연도별 수상 타임라인
- 2024 LINC 3.0 최우수상
- 2025 전북권 창업경진대회 대상
- 2025 AI 지역문제 해결 경진대회 대상
- 2025 전북 청년 창업경진대회 최우수상
- 2026 CMU 글로벌 캡스톤 3위

---

## 페이지 경로

| 경로 | 설명 |
|---|---|
| `/index.html` | 메인 (풀페이지 스크롤) |
| `/login.html` | 로그인 · 회원가입 · 비밀번호 찾기 |
| `/community.html` | 커뮤니티 게시판 (로그인 필요) |
| `/gallery.html` | 사진 갤러리 |
| `/about-ceo.html` | CEO 소개 페이지 |
| `/awards.html` | 수상 내역 페이지 |

---

## 데이터 모델

### contact_inquiries (RESTful Table API)
```
id, name, phone, type, message, submitted_at
```

### maze_users_v2 (localStorage, 이메일 키)
```json
{ "user@email.com": { "nick": "...", "pw": "...", "email": "...", "createdAt": 0 } }
```

### maze_posts / maze_notices / maze_gallery (localStorage)
게시글, 공지, 갤러리 항목 임시 저장

---

## 미구현 / 향후 과제

- [ ] 실제 이메일 발송 (비밀번호 찾기 SMTP 연동)
- [ ] 회원 정보 서버 저장 (현재 localStorage)
- [ ] 갤러리 이미지 서버 업로드 (현재 base64 localStorage)
- [ ] 다국어 지원 (EN/KO)
- [ ] SEO meta 태그 보강
