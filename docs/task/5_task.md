# 케어페이 가디언 - 작업 목록 5: 보호자 연동 및 실시간 알림 시스템

**작업 범위**: 보호자 초대, Supabase Realtime, 알림, 액션 처리

---

### 관련 파일
- `app/user/guardians/page.tsx` - 보호자 관리 페이지
- `app/guardian/dashboard/page.tsx` - 보호자 대시보드
- `components/GuardianInvite.tsx` - 보호자 초대 컴포넌트
- `components/GuardianAlert.tsx` - 보호자 알림 컴포넌트
- `app/api/guardians/invite/route.ts` - 보호자 초대 API
- `app/api/guardians/block-transaction/route.ts` - 거래 차단 API
- `lib/notifications.ts` - 알림 발송 로직
- `hooks/useRealtimeAlerts.ts` - Realtime 구독 훅

---

## 작업

- [ ] 5.0 보호자 연동 및 실시간 알림 시스템 (Push 단위)
    - [ ] 5.1 보호자 초대 UI 구현 (커밋 단위)
        - [ ] 5.1.1 `GuardianInvite.tsx` 컴포넌트 생성
        - [ ] 5.1.2 입력 필드 (이름, 전화번호, 관계, 권한 체크박스)
        - [ ] 5.1.3 권한 옵션
            - notify (알림 받기) - 필수
            - freeze (일시 동결) - 선택
            - approve (한도 조정) - 선택
        - [ ] 5.1.4 [초대 발송] 버튼
        - [ ] 5.1.5 보호자 초대 UI 확인
            - [ ] 5.1.5.1 테스트 코드 작성 - 폼 입력 테스트
            - [ ] 5.1.5.2 테스트 실행 및 검증
            - [ ] 5.1.5.3 오류 수정 (필요 시)
    
    - [ ] 5.2 보호자 초대 API 구현 (커밋 단위)
        - [ ] 5.2.1 `app/api/guardians/invite/route.ts` 생성
        - [ ] 5.2.2 POST 핸들러 구현
            - 사용자 인증 확인
            - guardians 테이블에 INSERT (status: 'pending')
            - SMS 발송 (초대 링크 포함)
        - [ ] 5.2.3 초대 링크 생성 (`/guardian/accept?token=...`)
        - [ ] 5.2.4 보호자 초대 API 확인
            - [ ] 5.2.4.1 테스트 코드 작성 - 초대 API 테스트
            - [ ] 5.2.4.2 테스트 실행 및 검증
            - [ ] 5.2.4.3 오류 수정 (필요 시)
    
    - [ ] 5.3 보호자 수락 페이지 (커밋 단위)
        - [ ] 5.3.1 `app/guardian/accept/page.tsx` 생성
        - [ ] 5.3.2 토큰 검증 (JWT 또는 UUID)
        - [ ] 5.3.3 초대 정보 표시 (사용자 이름, 관계)
        - [ ] 5.3.4 [수락] / [거절] 버튼
        - [ ] 5.3.5 수락 시 guardians.status = 'active' 업데이트
        - [ ] 5.3.6 보호자 수락 페이지 확인
            - [ ] 5.3.6.1 테스트 코드 작성 - 수락/거절 플로우 테스트
            - [ ] 5.3.6.2 테스트 실행 및 검증
            - [ ] 5.3.6.3 오류 수정 (필요 시)
    
    - [ ] 5.4 Supabase Realtime 구독 설정 (커밋 단위)
        - [ ] 5.4.1 `hooks/useRealtimeAlerts.ts` 훅 생성
        - [ ] 5.4.2 Supabase 채널 구독
            ```
            supabase
              .channel(`guardian:${guardianId}`)
              .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'alerts',
                filter: `guardian_id=eq.${guardianId}`
              }, handleNewAlert)
              .subscribe();
            ```
        - [ ] 5.4.3 새 알림 수신 시 상태 업데이트
        - [ ] 5.4.4 Realtime 구독 확인
            - [ ] 5.4.4.1 테스트 코드 작성 - Realtime 이벤트 수신 테스트
            - [ ] 5.4.4.2 테스트 실행 및 검증
            - [ ] 5.4.4.3 오류 수정 (필요 시)
    
    - [ ] 5.5 보호자 알림 UI 구현 (커밋 단위)
        - [ ] 5.5.1 `GuardianAlert.tsx` 컴포넌트 생성
        - [ ] 5.5.2 알림 카드 디자인 (PRD 6.3 참조)
            - 사용자 이름
            - 거래 정보 (금액, 가맹점, 시간)
            - 위험도 (점수, 레벨)
            - 위험 요인 리스트
            - 음성 확인 결과
        - [ ] 5.5.3 자동 승인 타이머 (프로그레스 바)
        - [ ] 5.5.4 액션 버튼 (즉시 차단, 1회만 승인, 전화하기)
        - [ ] 5.5.5 보호자 알림 UI 확인
            - [ ] 5.5.5.1 테스트 코드 작성 - 알림 렌더링 테스트
            - [ ] 5.5.5.2 테스트 실행 및 검증
            - [ ] 5.5.5.3 오류 수정 (필요 시)
    
    - [ ] 5.6 거래 차단 API 구현 (커밋 단위)
        - [ ] 5.6.1 `app/api/guardians/block-transaction/route.ts` 생성
        - [ ] 5.6.2 POST 핸들러 구현
            - transaction_id, guardian_id 받기
            - 권한 확인 (permissions.freeze === true)
            - transactions.status = 'blocked' 업데이트
            - alerts 테이블에 사용자 알림 추가
        - [ ] 5.6.3 감사 로그 (audit_logs) 기록
        - [ ] 5.6.4 거래 차단 API 확인
            - [ ] 5.6.4.1 테스트 코드 작성 - 차단 API 및 권한 테스트
            - [ ] 5.6.4.2 테스트 실행 및 검증
            - [ ] 5.6.4.3 오류 수정 (필요 시)
    
    - [ ] 5.7 보호자 대시보드 구현 (커밋 단위)
        - [ ] 5.7.1 `app/guardian/dashboard/page.tsx` 생성
        - [ ] 5.7.2 실시간 알림 섹션 (useRealtimeAlerts 훅 사용)
        - [ ] 5.7.3 알림 리스트 (최신순 정렬, 읽음 표시)
        - [ ] 5.7.4 보호 중인 사용자 목록
        - [ ] 5.7.5 주간 리포트 요약
        - [ ] 5.7.6 보호자 대시보드 확인
            - [ ] 5.7.6.1 테스트 코드 작성 - 대시보드 통합 테스트
            - [ ] 5.7.6.2 테스트 실행 및 검증
            - [ ] 5.7.6.3 오류 수정 (필요 시)
    
    - [ ] 5.8 알림 발송 로직 통합 (커밋 단위)
        - [ ] 5.8.1 `lib/notifications.ts` 파일 생성
        - [ ] 5.8.2 `notifyGuardian()` 함수 구현
            - alerts 테이블에 INSERT
            - Supabase Realtime 자동 브로드캐스트
        - [ ] 5.8.3 Twilio 음성 확인 API에서 호출
        - [ ] 5.8.4 결제 시뮬레이션 API에서 호출
        - [ ] 5.8.5 알림 발송 통합 확인
            - [ ] 5.8.5.1 테스트 코드 작성 - E2E 알림 플로우 테스트
            - [ ] 5.8.5.2 테스트 실행 및 검증
            - [ ] 5.8.5.3 오류 수정 (필요 시)
