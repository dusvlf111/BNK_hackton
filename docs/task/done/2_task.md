# 케어페이 가디언 - 작업 목록 2: 데이터베이스 스키마 및 인증 시스템 구축

**작업 범위**: Supabase 프로젝트 설정, DB 스키마, 인증 시스템

---

### 관련 파일
- `supabase/migrations/` - 데이터베이스 마이그레이션 파일
- `supabase/config.toml` - 로컬 Supabase 프로젝트 설정
- `supabase/migrations/20251201150933_core_tables.sql` - 핵심 테이블 생성 스크립트
- `supabase/migrations/20251201151451_indexes_constraints.sql` - 인덱스/제약조건 설정 스크립트
- `supabase/migrations/20251201151945_rls_policies.sql` - RLS 정책 및 정책 정의
- `lib/supabase/client.ts` - Supabase 클라이언트 설정
- `lib/supabase/server.ts` - Supabase 서버 클라이언트
- `lib/supabase/health-check.ts` - Supabase 연결 헬스 체크 유틸
- `lib/validation/auth.ts` - 회원가입/로그인 Zod 스키마
- `types/database.types.ts` - 데이터베이스 타입 정의
- `middleware.ts` - 인증 미들웨어
- `app/auth/layout.tsx` - 인증 전용 페이지 레이아웃
- `app/auth/signup/actions.ts` - 회원가입 서버 액션
- `app/auth/signup/page.tsx` - 회원가입 UI 폼 (React Hook Form + Zod)
- `app/auth/login/actions.ts` - 로그인 서버 액션
- `app/auth/login/page.tsx` - 로그인 UI 폼
- `.env.example` - 환경 변수 템플릿
- `tests/supabase/connection.test.ts` - Supabase 연결 테스트
- `tests/supabase/schema.test.ts` - 테이블 스키마 가용성 테스트
- `tests/supabase/rls.test.ts` - RLS 접근 제어 시나리오 테스트
- `tests/supabase/auth.test.ts` - 이메일/비밀번호 로그인 플로우 테스트
- `tests/supabase/helpers.ts` - 테스트용 Supabase 인증 헬퍼
- `tests/types/database.types.test.ts` - DB 타입 스키마 검증 테스트
- `vitest.config.ts` - Vitest 환경 변수 로딩 설정
- `package.json` - Supabase Auth helper 및 dotenv 의존성 반영
- `package-lock.json` - 패키지 잠금 파일 업데이트

---

## 작업

- [ ] 2.0 데이터베이스 스키마 및 인증 시스템 구축 (Push 단위)
    - [x] 2.1 Supabase 프로젝트 생성 및 연결 (커밋 단위)
        - [x] 2.1.1 Supabase 대시보드에서 새 프로젝트 생성 (`project_id=BNK_hackton`)
        - [x] 2.1.2 프로젝트 URL 및 API 키를 `.env.local`에 저장 (`.env.example` 템플릿 추가)
        - [x] 2.1.3 Supabase CLI 설치 (`npx supabase --version` = 2.64.2)
        - [x] 2.1.4 `supabase init` 실행 (로컬 설정 `supabase/config.toml` 확인)
        - [x] 2.1.5 Supabase 연결 테스트
            - [x] 2.1.5.1 테스트 코드 작성 - Supabase 클라이언트 연결 확인 (`tests/supabase/connection.test.ts`)
            - [x] 2.1.5.2 테스트 실행 및 검증 (`npm run test -- tests/supabase/connection.test.ts`)
            - [x] 2.1.5.3 오류 수정 (필요 시)
    
    - [x] 2.2 핵심 데이터베이스 테이블 생성 (커밋 단위)
        - [x] 2.2.1 `users` 테이블 생성 (id, email, phone, name, role) — `20251201150933_core_tables.sql`
        - [x] 2.2.2 `transactions` 테이블 생성 (PRD 6.1 참조)
            - amount, merchant_name, merchant_category
            - risk_score, risk_level, risk_reasons (JSONB)
            - status, voice_call_sid, voice_responses (JSONB)
            - guardian_id, guardian_action
        - [x] 2.2.3 `voice_calls` 테이블 생성 (call_sid, duration, responses, recording_url)
        - [x] 2.2.4 `guardians` 테이블 생성 (user_id, guardian_id, permissions JSONB, status)
        - [x] 2.2.5 `alerts` 테이블 생성 (user_id, guardian_id, transaction_id, type, severity)
        - [x] 2.2.6 테이블 생성 확인
            - [x] 2.2.6.1 테스트 코드 작성 - 테이블 스키마 검증 (`tests/supabase/schema.test.ts`)
            - [x] 2.2.6.2 테스트 실행 및 검증 (`npm run test -- tests/supabase/connection.test.ts tests/supabase/schema.test.ts`)
            - [x] 2.2.6.3 오류 수정 (필요 시)
    
    - [x] 2.3 인덱스 및 제약조건 설정 (커밋 단위)
        - [x] 2.3.1 `transactions` 인덱스 생성 (user_id, created_at DESC)
        - [x] 2.3.2 `alerts` 인덱스 생성 (guardian_id, is_read)
        - [x] 2.3.3 외래 키 제약조건 설정 (CASCADE 옵션) — users, transactions 간 FK 적용
        - [x] 2.3.4 CHECK 제약조건 추가 (risk_score 0-100, status enum)
        - [x] 2.3.5 인덱스 및 제약조건 확인
            - [x] 2.3.5.1 테스트 코드 작성 - 제약조건 위반 테스트 (`tests/supabase/schema.test.ts` 보강)
            - [x] 2.3.5.2 테스트 실행 및 검증 (`npm run test -- tests/supabase/schema.test.ts`)
            - [x] 2.3.5.3 오류 수정 (필요 시)
    
    - [x] 2.4 Row Level Security (RLS) 정책 설정 (커밋 단위)
        - [x] 2.4.1 `users` 테이블 RLS 활성화 (`20251201151945_rls_policies.sql`)
        - [x] 2.4.2 사용자는 본인 데이터만 조회/수정 가능 정책 (self-select/update policies)
        - [x] 2.4.3 보호자는 연결된 사용자의 거래 내역 조회 가능 정책 (`guardians` 조인 정책)
        - [x] 2.4.4 `transactions`, `alerts` 테이블에 RLS 적용
        - [x] 2.4.5 RLS 정책 확인
            - [x] 2.4.5.1 테스트 코드 작성 - 권한 없는 접근 차단 확인 (`tests/supabase/rls.test.ts`)
            - [x] 2.4.5.2 테스트 실행 및 검증 (`npm run test -- tests/supabase/connection.test.ts tests/supabase/schema.test.ts tests/supabase/rls.test.ts`)
            - [x] 2.4.5.3 오류 수정 (필요 시)
    
    - [x] 2.5 Supabase Auth 설정 (커밋 단위)
        - [x] 2.5.1 이메일/비밀번호 인증 활성화 (Supabase 대시보드 설정값 `enable_signup=true` 확인)
        - [x] 2.5.2 `lib/supabase/client.ts` 생성 (브라우저용 클라이언트)
        - [x] 2.5.3 `lib/supabase/server.ts` 생성 (서버용 클라이언트 & admin 클라이언트)
        - [x] 2.5.4 인증 미들웨어 (`middleware.ts`) 생성 - 보호된 경로 설정
        - [x] 2.5.5 Auth 설정 확인
            - [x] 2.5.5.1 테스트 코드 작성 - 로그인/로그아웃 플로우 (`tests/supabase/auth.test.ts`)
            - [x] 2.5.5.2 테스트 실행 및 검증 (`npm run test -- tests/supabase/connection.test.ts tests/supabase/schema.test.ts tests/supabase/rls.test.ts tests/supabase/auth.test.ts`)
            - [x] 2.5.5.3 오류 수정 (필요 시)
    
    - [x] 2.6 회원가입/로그인 페이지 구현 (커밋 단위)
        - [x] 2.6.1 `app/auth/signup/page.tsx` 생성
            - 이메일, 비밀번호, 이름, 전화번호 입력 폼
            - React Hook Form + Zod 유효성 검사 (`@hookform/resolvers`, `lib/validation/auth.ts`)
        - [x] 2.6.2 `app/auth/login/page.tsx` 생성
        - [x] 2.6.3 회원가입 API 액션 (`app/auth/signup/actions.ts`)
            - Supabase Auth signUp 호출 후 users 테이블 upsert (추가 정보 저장)
        - [x] 2.6.4 로그인 API 액션 (`app/auth/login/actions.ts`)
        - [x] 2.6.5 회원가입/로그인 확인
            - [x] 2.6.5.1 테스트 코드 작성 - E2E 회원가입/로그인 테스트 (`tests/supabase/auth.test.ts`)
            - [x] 2.6.5.2 테스트 실행 및 검증 (`npm run test -- tests/supabase/connection.test.ts tests/supabase/schema.test.ts tests/supabase/rls.test.ts tests/supabase/auth.test.ts`)
            - [x] 2.6.5.3 오류 수정 (필요 시)
    
    - [x] 2.7 데이터베이스 타입 생성 및 마이그레이션 (커밋 단위)
        - [x] 2.7.1 Supabase CLI로 타입 생성 (`npx supabase gen types typescript --local > types/database.types.ts`)
        - [x] 2.7.2 `types/database.types.ts`에 저장 (CLI 자동 생성본 반영)
        - [x] 2.7.3 마이그레이션 파일 생성 (`supabase/migrations/` 유지 및 최신 상태 확인)
        - [x] 2.7.4 로컬 DB에 마이그레이션 적용 테스트 (`npx supabase db reset --yes`)
        - [x] 2.7.5 타입 및 마이그레이션 확인
            - [x] 2.7.5.1 테스트 코드 작성 - 타입 일치 검증 (`tests/types/database.types.test.ts`)
            - [x] 2.7.5.2 테스트 실행 및 검증 (`npm run test -- tests/supabase/connection.test.ts tests/supabase/schema.test.ts tests/supabase/rls.test.ts tests/supabase/auth.test.ts tests/types/database.types.test.ts`)
            - [x] 2.7.5.3 오류 수정 (필요 시)
