# 케어페이 가디언 - 작업 목록 2: 데이터베이스 스키마 및 인증 시스템 구축

**작업 범위**: Supabase 프로젝트 설정, DB 스키마, 인증 시스템

---

### 관련 파일
- `supabase/migrations/` - 데이터베이스 마이그레이션 파일
- `lib/supabase/client.ts` - Supabase 클라이언트 설정
- `lib/supabase/server.ts` - Supabase 서버 클라이언트
- `types/database.types.ts` - 데이터베이스 타입 정의
- `middleware.ts` - 인증 미들웨어
- `app/auth/` - 인증 관련 페이지

---

## 작업

- [ ] 2.0 데이터베이스 스키마 및 인증 시스템 구축 (Push 단위)
    - [ ] 2.1 Supabase 프로젝트 생성 및 연결 (커밋 단위)
        - [ ] 2.1.1 Supabase 대시보드에서 새 프로젝트 생성
        - [ ] 2.1.2 프로젝트 URL 및 API 키를 `.env.local`에 저장
        - [ ] 2.1.3 Supabase CLI 설치 (`npm install -g supabase`)
        - [ ] 2.1.4 `supabase init` 실행 (로컬 설정)
        - [ ] 2.1.5 Supabase 연결 테스트
            - [ ] 2.1.5.1 테스트 코드 작성 - Supabase 클라이언트 연결 확인
            - [ ] 2.1.5.2 테스트 실행 및 검증
            - [ ] 2.1.5.3 오류 수정 (필요 시)
    
    - [ ] 2.2 핵심 데이터베이스 테이블 생성 (커밋 단위)
        - [ ] 2.2.1 `users` 테이블 생성 (id, email, phone, name, role)
        - [ ] 2.2.2 `transactions` 테이블 생성 (PRD 6.1 참조)
            - amount, merchant_name, merchant_category
            - risk_score, risk_level, risk_reasons (JSONB)
            - status, voice_call_sid, voice_responses (JSONB)
            - guardian_id, guardian_action
        - [ ] 2.2.3 `voice_calls` 테이블 생성 (call_sid, duration, responses, recording_url)
        - [ ] 2.2.4 `guardians` 테이블 생성 (user_id, guardian_id, permissions JSONB, status)
        - [ ] 2.2.5 `alerts` 테이블 생성 (user_id, guardian_id, transaction_id, type, severity)
        - [ ] 2.2.6 테이블 생성 확인
            - [ ] 2.2.6.1 테스트 코드 작성 - 테이블 스키마 검증
            - [ ] 2.2.6.2 테스트 실행 및 검증
            - [ ] 2.2.6.3 오류 수정 (필요 시)
    
    - [ ] 2.3 인덱스 및 제약조건 설정 (커밋 단위)
        - [ ] 2.3.1 `transactions` 인덱스 생성 (user_id, created_at DESC)
        - [ ] 2.3.2 `alerts` 인덱스 생성 (guardian_id, is_read)
        - [ ] 2.3.3 외래 키 제약조건 설정 (CASCADE 옵션)
        - [ ] 2.3.4 CHECK 제약조건 추가 (risk_score 0-100, status enum)
        - [ ] 2.3.5 인덱스 및 제약조건 확인
            - [ ] 2.3.5.1 테스트 코드 작성 - 제약조건 위반 테스트
            - [ ] 2.3.5.2 테스트 실행 및 검증
            - [ ] 2.3.5.3 오류 수정 (필요 시)
    
    - [ ] 2.4 Row Level Security (RLS) 정책 설정 (커밋 단위)
        - [ ] 2.4.1 `users` 테이블 RLS 활성화
        - [ ] 2.4.2 사용자는 본인 데이터만 조회/수정 가능 정책
        - [ ] 2.4.3 보호자는 연결된 사용자의 거래 내역 조회 가능 정책
        - [ ] 2.4.4 `transactions`, `alerts` 테이블에 RLS 적용
        - [ ] 2.4.5 RLS 정책 확인
            - [ ] 2.4.5.1 테스트 코드 작성 - 권한 없는 접근 차단 확인
            - [ ] 2.4.5.2 테스트 실행 및 검증
            - [ ] 2.4.5.3 오류 수정 (필요 시)
    
    - [ ] 2.5 Supabase Auth 설정 (커밋 단위)
        - [ ] 2.5.1 이메일/비밀번호 인증 활성화 (Supabase 대시보드)
        - [ ] 2.5.2 `lib/supabase/client.ts` 생성 (브라우저용 클라이언트)
        - [ ] 2.5.3 `lib/supabase/server.ts` 생성 (서버용 클라이언트)
        - [ ] 2.5.4 인증 미들웨어 (`middleware.ts`) 생성 - 보호된 경로 설정
        - [ ] 2.5.5 Auth 설정 확인
            - [ ] 2.5.5.1 테스트 코드 작성 - 로그인/로그아웃 플로우
            - [ ] 2.5.5.2 테스트 실행 및 검증
            - [ ] 2.5.5.3 오류 수정 (필요 시)
    
    - [ ] 2.6 회원가입/로그인 페이지 구현 (커밋 단위)
        - [ ] 2.6.1 `app/auth/signup/page.tsx` 생성
            - 이메일, 비밀번호, 이름, 전화번호 입력 폼
            - React Hook Form + Zod 유효성 검사
        - [ ] 2.6.2 `app/auth/login/page.tsx` 생성
        - [ ] 2.6.3 회원가입 API 액션 (`app/auth/signup/actions.ts`)
            - Supabase Auth signUp 호출
            - users 테이블에 추가 정보 저장
        - [ ] 2.6.4 로그인 API 액션 (`app/auth/login/actions.ts`)
        - [ ] 2.6.5 회원가입/로그인 확인
            - [ ] 2.6.5.1 테스트 코드 작성 - E2E 회원가입/로그인 테스트
            - [ ] 2.6.5.2 테스트 실행 및 검증
            - [ ] 2.6.5.3 오류 수정 (필요 시)
    
    - [ ] 2.7 데이터베이스 타입 생성 및 마이그레이션 (커밋 단위)
        - [ ] 2.7.1 Supabase CLI로 타입 생성 (`supabase gen types typescript`)
        - [ ] 2.7.2 `types/database.types.ts`에 저장
        - [ ] 2.7.3 마이그레이션 파일 생성 (`supabase/migrations/`)
        - [ ] 2.7.4 로컬 DB에 마이그레이션 적용 테스트
        - [ ] 2.7.5 타입 및 마이그레이션 확인
            - [ ] 2.7.5.1 테스트 코드 작성 - 타입 일치 검증
            - [ ] 2.7.5.2 테스트 실행 및 검증
            - [ ] 2.7.5.3 오류 수정 (필요 시)
