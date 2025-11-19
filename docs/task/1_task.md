# 케어페이 가디언 - 작업 목록 1: 프로젝트 초기 설정 및 환경 구성

**PRD 파일**: paste.txt (케어페이 가디언 PRD)
**기술 스택**: Next.js 14, PWA, Tailwind CSS, Vercel, Supabase
**작업 범위**: 프로젝트 보일러플레이트, 환경변수, PWA 설정

---

### 관련 파일
- `package.json` - 프로젝트 의존성 관리
- `.env.local` - 환경변수 (Supabase, Twilio API 키)
- `.env.example` - 환경변수 예시 파일
- `next.config.js` - Next.js 및 PWA 설정
- `tailwind.config.js` - Tailwind CSS 설정
- `tsconfig.json` - TypeScript 설정
- `public/manifest.json` - PWA 매니페스트
- `public/icons/` - PWA 아이콘 파일들
- `.gitignore` - Git 제외 파일 설정
- `README.md` - 프로젝트 문서

---
-
## 작업

- [ ] 1.0 프로젝트 초기 설정 및 환경 구성 (Push 단위)
    - [x] 1.1 Next.js 14 프로젝트 생성 및 기본 의존성 설치 (커밋 단위)
        - [x] 1.1.1 `npx create-next-app@latest` 실행 (TypeScript, App Router, Tailwind 옵션)
        - [x] 1.1.2 기본 의존성 설치 (`@supabase/supabase-js`, `twilio`, `zustand`, `react-hook-form`, `zod`)
        - [x] 1.1.3 개발 의존성 설치 (`@types/node`, `eslint`, `prettier`)
        - [x] 1.1.4 패키지 설치 확인
            - [x] 1.1.4.1 테스트 코드 작성 - package.json 의존성 존재 확인
            - [x] 1.1.4.2 테스트 실행 및 검증
            - [x] 1.1.4.3 오류 수정 (필요 시)
    
    - [x] 1.2 환경변수 설정 파일 생성 (커밋 단위)
        - [x] 1.2.1 `.env.local` 파일 생성
        - [x] 1.2.2 Supabase 환경변수 추가
            ```
            NEXT_PUBLIC_SUPABASE_URL=your-project-url
            NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
            SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
            ```
    - [x] 1.2.3 Twilio 환境변수 추가
            ```
            TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx
            TWILIO_AUTH_TOKEN=your-auth-token
            TWILIO_PHONE_NUMBER=+1234567890
            ```
        - [x] 1.2.4 기타 환경변수 추가 (BASE_URL, NODE_ENV)
        - [x] 1.2.5 `.env.example` 파일 생성 (실제 키 없이 구조만)
        - [x] 1.2.6 환경변수 설정 확인
            - [x] 1.2.6.1 테스트 코드 작성 - 환경변수 로드 테스트
            - [x] 1.2.6.2 테스트 실행 및 검증
            - [x] 1.2.6.3 오류 수정 (필요 시)
    
    - [x] 1.3 PWA 설정 (커밋 단위)
        - [x] 1.3.1 `next-pwa` 패키지 설치
        - [x] 1.3.2 `next.config.js`에 PWA 플러그인 설정
            ```
            const withPWA = require('next-pwa')({
              dest: 'public',
              register: true,
              skipWaiting: true,
              disable: process.env.NODE_ENV === 'development'
            });
            ```
        - [x] 1.3.3 `public/manifest.json` 생성 (앱 이름, 아이콘, 테마 색상)
        - [x] 1.3.4 PWA 아이콘 생성 (192x192, 512x512)
        - [x] 1.3.5 `app/layout.tsx`에 manifest 링크 추가
        - [x] 1.3.6 PWA 설정 확인
            - [x] 1.3.6.1 테스트 코드 작성 - manifest.json 유효성 검사
            - [x] 1.3.6.2 테스트 실행 및 검증 (Lighthouse PWA 점수)
            - [x] 1.3.6.3 오류 수정 (필요 시)
    
    - [x] 1.4 Tailwind CSS 및 UI 라이브러리 설정 (커밋 단위)
        - [x] 1.4.1 `tailwind.config.js` 커스터마이징 (컬러 팔레트, 폰트)
        - [x] 1.4.2 `shadcn/ui` 초기화 (`npx shadcn@latest init`)
        - [x] 1.4.3 기본 컴포넌트 설치 (Button, Card, Input, Alert)
        - [x] 1.4.4 글로벌 스타일 설정 (`app/globals.css`)
        - [x] 1.4.5 UI 설정 확인
            - [x] 1.4.5.1 테스트 코드 작성 - 기본 컴포넌트 렌더링 테스트
            - [x] 1.4.5.2 테스트 실행 및 검증
            - [x] 1.4.5.3 오류 수정 (필요 시)
    
    - [x] 1.5 프로젝트 구조 설정 및 문서화 (커밋 단위)
        - [x] 1.5.1 디렉토리 구조 생성
            ```
            /app          - Next.js 앱 라우터
            /components   - 재사용 컴포넌트
            /lib          - 유틸리티, API 클라이언트
            /types        - TypeScript 타입 정의
            /hooks        - 커스텀 훅
            /store        - Zustand 스토어
            /public       - 정적 파일
            ```
        - [x] 1.5.2 `.gitignore` 업데이트 (.env.local, node_modules, .next)
        - [x] 1.5.3 `README.md` 작성 (프로젝트 개요, 설치 방법, 환경변수 설명)
        - [x] 1.5.4 프로젝트 구조 확인
            - [x] 1.5.4.1 테스트 코드 작성 - 디렉토리 존재 확인
            - [x] 1.5.4.2 테스트 실행 및 검증
            - [x] 1.5.4.3 오류 수정 (필요 시)
    
    - [x] 1.6 개발 서버 실행 및 초기 확인 (커밋 단위)
        - [x] 1.6.1 `npm run dev` 실행 확인
        - [x] 1.6.2 기본 페이지 렌더링 확인 (localhost:3000)
        - [x] 1.6.3 환경변수 로드 확인 (console.log 테스트)
        - [ ] 1.6.4 개발 서버 확인
            - [ ] 1.6.4.1 테스트 코드 작성 - 헬스 체크 엔드포인트
            - [ ] 1.6.4.2 테스트 실행 및 검증
            - [ ] 1.6.4.3 오류 수정 (필요 시)
