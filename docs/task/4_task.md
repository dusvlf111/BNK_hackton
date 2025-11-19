# 케어페이 가디언 - 작업 목록 4: Twilio 음성 확인 시스템 통합

**작업 범위**: Twilio Voice API, TwiML 생성, 음성 통화 플로우

---

### 관련 파일
- `lib/twilio/client.ts` - Twilio 클라이언트 설정
- `app/api/twilio/voice/initiate/route.ts` - 통화 발신 API
- `app/api/twilio/voice/twiml/route.ts` - TwiML 생성 API
- `app/api/twilio/voice/question1/route.ts` - 질문 1 처리
- `app/api/twilio/voice/question2/route.ts` - 질문 2 처리
- `app/api/twilio/voice/question3/route.ts` - 질문 3 처리
- `app/api/twilio/voice/callback/route.ts` - 통화 상태 콜백
- `types/voice-call.types.ts` - 음성 통화 타입

---

## 작업

- [ ] 4.0 Twilio 음성 확인 시스템 통합 (Push 단위)
    - [ ] 4.1 Twilio 계정 설정 및 클라이언트 생성 (커밋 단위)
        - [ ] 4.1.1 Twilio 계정 생성 (trial 계정)
        - [ ] 4.1.2 전화번호 구매 (한국 +82 또는 미국 +1)
        - [ ] 4.1.3 Account SID, Auth Token을 `.env.local`에 저장
        - [ ] 4.1.4 `lib/twilio/client.ts` 생성
            ```
            import twilio from 'twilio';
            export const twilioClient = twilio(
              process.env.TWILIO_ACCOUNT_SID,
              process.env.TWILIO_AUTH_TOKEN
            );
            ```
        - [ ] 4.1.5 Twilio 클라이언트 확인
            - [ ] 4.1.5.1 테스트 코드 작성 - Twilio 연결 테스트
            - [ ] 4.1.5.2 테스트 실행 및 검증
            - [ ] 4.1.5.3 오류 수정 (필요 시)
    
    - [ ] 4.2 통화 발신 API 구현 (커밋 단위)
        - [ ] 4.2.1 `app/api/twilio/voice/initiate/route.ts` 생성
        - [ ] 4.2.2 POST 핸들러 구현
            - transaction_id, user_phone 받기
            - twilioClient.calls.create() 호출
            - to: userPhone, from: twilioPhone
            - url: TwiML 엔드포인트
            - statusCallback 설정
        - [ ] 4.2.3 call_sid 반환 및 voice_calls 테이블에 저장
        - [ ] 4.2.4 통화 발신 API 확인
            - [ ] 4.2.4.1 테스트 코드 작성 - API 호출 테스트 (Mock)
            - [ ] 4.2.4.2 테스트 실행 및 검증
            - [ ] 4.2.4.3 오류 수정 (필요 시)
    
    - [ ] 4.3 TwiML 인사 및 첫 질문 생성 (커밋 단위)
        - [ ] 4.3.1 `app/api/twilio/voice/twiml/route.ts` 생성
        - [ ] 4.3.2 GET 핸들러 구현 (transaction_id 쿼리 파라미터)
        - [ ] 4.3.3 거래 정보 조회 (merchant_name, amount)
        - [ ] 4.3.4 TwiML XML 생성 (PRD 6.2 참조)
            - `<Say voice="Polly.Seoyeon" language="ko-KR">` 인사
            - `<Gather>` 첫 질문 (결제 맞나요?)
            - action: /api/twilio/voice/question1
        - [ ] 4.3.5 TwiML 생성 확인
            - [ ] 4.3.5.1 테스트 코드 작성 - TwiML XML 유효성 검사
            - [ ] 4.3.5.2 테스트 실행 및 검증
            - [ ] 4.3.5.3 오류 수정 (필요 시)
    
    - [ ] 4.4 질문 1 답변 처리 API (커밋 단위)
        - [ ] 4.4.1 `app/api/twilio/voice/question1/route.ts` 생성
        - [ ] 4.4.2 POST 핸들러 구현
            - CallSid, Digits (1 or 2) 받기
            - voice_calls 테이블에 답변 저장
            - Digits === '1' → 질문 2 TwiML 반환
            - Digits === '2' → 보류 메시지 + Hangup
        - [ ] 4.4.3 질문 1 처리 확인
            - [ ] 4.4.3.1 테스트 코드 작성 - 답변 처리 로직 테스트
            - [ ] 4.4.3.2 테스트 실행 및 검증
            - [ ] 4.4.3.3 오류 수정 (필요 시)
    
    - [ ] 4.5 질문 2 답변 처리 API (커밋 단위)
        - [ ] 4.5.1 `app/api/twilio/voice/question2/route.ts` 생성
        - [ ] 4.5.2 질문: "누군가에게 안내받으셨나요?"
        - [ ] 4.5.3 Digits === '1' → 질문 3 TwiML 반환
        - [ ] 4.5.4 Digits === '2' → 승인 메시지 + Hangup
        - [ ] 4.5.5 질문 2 처리 확인
            - [ ] 4.5.5.1 테스트 코드 작성 - 분기 로직 테스트
            - [ ] 4.5.5.2 테스트 실행 및 검증
            - [ ] 4.5.5.3 오류 수정 (필요 시)
    
    - [ ] 4.6 질문 3 답변 처리 및 최종 판정 (커밋 단위)
        - [ ] 4.6.1 `app/api/twilio/voice/question3/route.ts` 생성
        - [ ] 4.6.2 질문: "은행/경찰이라고 했나요?"
        - [ ] 4.6.3 Digits === '1' (보이스피싱 의심)
            - 경고 메시지 TTS
            - transaction.status = 'blocked'
            - 보호자 긴급 알림 트리거
        - [ ] 4.6.4 Digits === '2' → 승인 + 보호자 일반 알림
        - [ ] 4.6.5 최종 판정 확인
            - [ ] 4.6.5.1 테스트 코드 작성 - 보이스피싱 감지 테스트
            - [ ] 4.6.5.2 테스트 실행 및 검증
            - [ ] 4.6.5.3 오류 수정 (필요 시)
    
    - [ ] 4.7 통화 상태 콜백 처리 (커밋 단위)
        - [ ] 4.7.1 `app/api/twilio/voice/callback/route.ts` 생성
        - [ ] 4.7.2 POST 핸들러 구현
            - CallSid, CallStatus, CallDuration 받기
            - voice_calls 테이블 업데이트
        - [ ] 4.7.3 에러 상태 처리 (busy, no-answer, failed)
            - SMS 백업 발송
            - 보호자 알림
        - [ ] 4.7.4 통화 상태 콜백 확인
            - [ ] 4.7.4.1 테스트 코드 작성 - 콜백 처리 테스트
            - [ ] 4.7.4.2 테스트 실행 및 검증
            - [ ] 4.7.4.3 오류 수정 (필요 시)
    
    - [ ] 4.8 결제 시뮬레이터와 Twilio 통합 (커밋 단위)
        - [ ] 4.8.1 결제 시뮬레이션 API에서 high/critical 판정 시 Twilio 호출
        - [ ] 4.8.2 `/api/twilio/voice/initiate` 호출
        - [ ] 4.8.3 twilio_call_sid를 transactions 테이블에 저장
        - [ ] 4.8.4 프론트엔드에 "전화 발신 중" 상태 표시
        - [ ] 4.8.5 Twilio 통합 확인
            - [ ] 4.8.5.1 테스트 코드 작성 - E2E 음성 확인 플로우 테스트
            - [ ] 4.8.5.2 테스트 실행 및 검증
            - [ ] 4.8.5.3 오류 수정 (필요 시)
