# BOKO

독서 기록을 관리하고 공유할 수 있는 온라인 책장 서비스입니다.

## 주요 기능

* 회원가입 / 로그인
* 나만의 책장 생성
* 독서 기록 작성
* 책 제목 및 한줄평 관리
* 다른 사용자의 책장 조회
* Supabase Authentication 기반 사용자 관리

## 기술 스택

### Frontend

* HTML
* CSS
* JavaScript
* Vite

### Backend

* Supabase

  * Authentication
  * PostgreSQL Database
  * Row Level Security (RLS)

## 프로젝트 구조

```text
src
├─ pages
│  ├─ login.js
│  ├─ signup.js
│  ├─ bookshelf.js
│  └─ detail.js
├─ styles
│  └─ style.css
├─ main.js
└─ supabase.js
```

## 실행 방법

```bash
npm install
npm run dev
```

## 데이터베이스

### bookshelves

* id
* user_id
* name
* created_at

### book_records

* id
* bookshelf_id
* user_id
* title
* book_title
* book_content
* book_commentary
* created_at

## 팀원

* 조성찬
* 이유민

## 개발 기간

2026.06 ~ 2026.06
