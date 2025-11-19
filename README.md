# BNK Hackton — Next + Tailwind + PWA starter

이 레포는 Next.js(App Router) 기반의 PWA 템플릿입니다. Tailwind CSS와 next-pwa 설정이 포함되어 있으며 Vercel에 배포하기 쉽게 구성되어 있습니다.

빠른 시작

1. 의존성 설치

```bash
npm install
```

2. 개발 서버 실행

```bash
npm run dev
```

3. 빌드

```bash
npm run build
```

PWA 관련

- 매니페스트: `/public/manifest.json`
- 서비스 워커: `next-pwa`가 빌드 시 `public` 폴더에 서비스 워커를 생성합니다.


## 환경 변수

- `.env.local`: 로컬 개발용 (이 파일은 gitignore 대상이며 실제 키를 채워야 합니다)
- `.env.example`: 배포 및 협업용 템플릿
- 필요한 값:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
	- `SUPABASE_SERVICE_ROLE_KEY`
	- `TWILIO_ACCOUNT_SID`
	- `TWILIO_AUTH_TOKEN`
	- `TWILIO_PHONE_NUMBER`
	- `BASE_URL`
	- `NODE_ENV`

## 디렉토리 구조

```
/app     - Next.js App Router 페이지
/components - 재사용 UI 컴포넌트
/lib     - API 클라이언트, 헬퍼 함수
/types   - 공통 타입 정의
/hooks   - 커스텀 훅
/store   - Zustand 상태 저장소
/public  - 정적 자산 (광고 아이콘, manifest 등)
```

Vercel 배포

1. Vercel에 로그인 후 프로젝트 추가 -> Git 레포 선택
2. 빌드 커맨드: `npm run build`
3. 출력 디렉터리: (비워두기)
4. 환경변수: 개발 환경과 동일하면 별도 설정 불필요

참고: 개발 모드에서는 next-pwa가 비활성화되어 있어 서비스 워커가 생성되지 않습니다. 실제 PWA 동작 확인은 빌드 후 `npm run start` 로 확인하세요.

