```python
Twillo 예제 코드
import twilio from "twilio";

export class Twilio {
private client: twilio.Twilio;
private accountSid = "AC9400af563ea46b42b3255f287abXXXXX";
private authToken = "65406c430c90d00268ef9bf0720XXXXX";
private verifyServiceSid = "VAaa47973652ccaabfc582ed8c1afXXXXX";

constructor() {
this.client = twilio(this.accountSid, this.authToken);
}

sendVerificationCode(options: { to: string }) {
return this.client.verify.v2
.services(this.verifyServiceSid)
.verifications.create({ to: [options.to](http://options.to/), channel: "sms" });
}
checkVerificationCode(options: { to: string; code: string }) {
return this.client.verify.v2
.services(this.verifyServiceSid)
.verificationChecks.create({
to: [options.to](http://options.to/),
code: options.code,
});
}
}
```

```python
import express from "express";
import phone from "phone";
import { Twilio } from "./utils/sms";

const app = express();
app.use(express.json());

app.post("/send", async (req, res) => {
  const body = req.body as { phone?: string };
  if (!body.phone) {
    throw new Error("400");
  }

  const phoneValidation = phone(body.phone, { country: "KOR" });
  if (!phoneValidation.isValid) {
    throw new Error("invalid format of the phone.");
  }

  const twilio = new Twilio();

  const result = await twilio.sendVerificationCode({
    to: phoneValidation.phoneNumber,
  });

  res.json({
    success: true,
    data: { result },
  });
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

```jsx
const handleRequestCode = () => {
    if (!phoneNumber) {
      alert("휴대폰 번호를 입력해주세요.");
      return;
    }

    axios.get(`${process.env.REACT_APP_API_URL}/api/check/phonenumber`, {
        params: { phone_number: phoneNumber },
    })
    .then((response) => {
        if (response.data.result !== "success") {
            alert("이미 사용 중인 전화번호입니다.");
            return;
        }

        axios.post(`${process.env.REACT_APP_API_URL}/api/auth/send/code`, {
            phone_number: phoneNumber
        })
        .then((response) => {
            if (response.data.result === "success") {
                alert("인증번호가 발송되었습니다.");
                setIsVerificationInputVisible(true);
            } else {
                alert("인증번호 발송에 실패했습니다.");
            }
        });
    })
    .catch((error) => console.error("전화번호 중복 확인 실패:", error));
};

```

- **전화번호 중복 확인** → 이미 가입된 번호인지 서버에서 체크
- **SMS 전송 API 호출** → 중복이 없을 경우 인증번호를 생성하고 전송 요청
- **인증번호 입력 필드 활성화** → 인증번호 입력칸을 보이도록 변경

### [**2. 인증번호 검증**](https://dud9902.tistory.com/55#2.%20%EC%9D%B8%EC%A6%9D%EB%B2%88%ED%98%B8%20%EA%B2%80%EC%A6%9D-1-2)

사용자가 인증번호를 입력하고 ‘인증번호 확인’ 버튼을 누르면, 입력값을 서버로 전송하여 검증한다.

```coffeescript
// 인증번호 검증
const handleVerifyCode = () => {
    if (!inputCode) {
        alert("인증번호를 입력해주세요.");
        return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify/code`, {
        phone_number: phoneNumber,
        code: inputCode
    })
    .then((response) => {
        if (response.data.result === "success") {
            alert("인증이 완료되었습니다!");
            setIsPhoneVerified(true);
        } else {
            alert("인증번호가 일치하지 않습니다.");
        }
    })
    .catch((error) => console.error(error));
};

```

- **입력된 인증번호를 서버로 전송**하여 검증
- **일치하면 인증 성공 상태(setIsPhoneVerified) 변경**

## [**Spring Boot: 인증번호 생성, SMS 전송 및 검증**](https://dud9902.tistory.com/55#Spring%20Boot%3A%20%EC%9D%B8%EC%A6%9D%EB%B2%88%ED%98%B8%20%EC%83%9D%EC%84%B1%2C%20SMS%20%EC%A0%84%EC%86%A1%20%EB%B0%8F%20%EA%B2%80%EC%A6%9D-1-3)

Spring Boot에서는 **Twilio API**를 사용하여 인증번호를 SMS로 전송하고, 사용자가 입력한 코드가 올바른지 확인했다.

### [**1. 인증번호 전송 API (UserController)**](https://dud9902.tistory.com/55#1.%20%EC%9D%B8%EC%A6%9D%EB%B2%88%ED%98%B8%20%EC%A0%84%EC%86%A1%20API%20(UserController)-1-4)

SmsService의 sendVerificationCode()를 호출해 인증번호 생성 및 SMS 전송을 수행한다.

```tsx
@PostMapping("/api/auth/send/code")
public JsonResult sendCode(@RequestBody JuUserVo juUserVo) {
    String phoneNumber = juUserVo.getPhone_number();
    if (phoneNumber == null || phoneNumber.isEmpty()) {
        return JsonResult.fail("휴대폰 번호를 입력해주세요.");
    }
    boolean isSent = smsService.sendVerificationCode(phoneNumber);
    return isSent ? JsonResult.success("인증번호가 전송되었습니다.") : JsonResult.fail("인증번호 전송 실패");
}

```

### [**2. 인증번호 생성 및 SMS 전송 (SmsService)**](https://dud9902.tistory.com/55#2.%20%EC%9D%B8%EC%A6%9D%EB%B2%88%ED%98%B8%20%EC%83%9D%EC%84%B1%20%EB%B0%8F%20SMS%20%EC%A0%84%EC%86%A1%20(SmsService)-1-5)

사용자에게 인증번호를 포함한 SMS를 전송한다.

![](https://blog.kakaocdn.net/dna/NHmXE/btsMzsITJtn/AAAAAAAAAAAAAAAAAAAAAJaS56QQ_HVBpgi4WwkIgNV3hsjxN82hW67zX00FpS77/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1767193199&allow_ip=&allow_referer=&signature=F5GkT%2BVKVig1FC%2B6gdHsDm6Br%2BE%3D)

```tsx
public boolean sendVerificationCode(String phoneNumber) {
    String formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    String verificationCode = generateVerificationCode();
    storeVerificationCode(formattedPhoneNumber, verificationCode);
    return sendSms(formattedPhoneNumber, "인증번호는 " + verificationCode + " 입니다.");
}

```

- 전화번호를 **국제 형식으로 변환** 후 6자리 인증번호를 생성
- **인증번호 저장** 후 Twilio API를 통해 SMS 전송

### [**3. 인증번호 검증 API (UserController)**](https://dud9902.tistory.com/55#3.%20%EC%9D%B8%EC%A6%9D%EB%B2%88%ED%98%B8%20%EA%B2%80%EC%A6%9D%20API%20(UserController)-1-6)

JuSmsService의 verifyCode()를 호출해 사용자가 입력한 코드가 올바른지 확인한다.

```tsx
@PostMapping("/api/auth/verify/code")
public JsonResult verifyCode(@RequestBody JuUserVo juUserVo) {
    String phoneNumber = juUserVo.getPhone_number();
    String inputCode = juUserVo.getCode();
    if (phoneNumber == null || inputCode == null) {
        return JsonResult.fail("휴대폰 번호와 인증번호를 입력해주세요.");
    }
    boolean isVerified = smsService.verifyCode(phoneNumber, inputCode);
    return isVerified ? JsonResult.success("인증이 완료되었습니다.") : JsonResult.fail("인증번호가 일치하지 않습니다.");
}

```

### [**4. 인증번호 검증 (SmsService)**](https://dud9902.tistory.com/55#4.%20%EC%9D%B8%EC%A6%9D%EB%B2%88%ED%98%B8%20%EA%B2%80%EC%A6%9D%20(SmsService)-1-7)

사용자가 입력한 인증번호와 저장된 코드를 비교하고 일치하면 인증 성공 및 코드 삭제한다.

```arduino
public boolean verifyCode(String phoneNumber, String inputCode) {
    String storedCode = verificationCodeStorage.get(formatPhoneNumber(phoneNumber));
    if (storedCode != null && storedCode.equals(inputCode)) {
        verificationCodeStorage.remove(phoneNumber);
        return true;
    }
    return false;
}

```

## [**마무리**](https://dud9902.tistory.com/55#%EB%A7%88%EB%AC%B4%EB%A6%AC-1-8)

이번 개발을 통해 **React와 Spring Boot를 활용한 휴대폰 인증 시스템 구축**을 경험할 수 있었다.

하지만 아직 부족한 점이 있어 몇 가지 개선이 필요하다.

### **향후 개선 방향**

- **인증번호 만료 시간 적용**: 일정 시간이 지나면 자동 만료되도록 설정
- **인증번호 요청 횟수 제한**: 과도한 요청을 방지하기 위한 제한 적용
- **다른 SMS 서비스 테스트**: Twilio 외의 서비스 비교 및 검토

https://dud9902.tistory.com/55

https://www.peterkimzz.com/phone-validation-service-twilio-in-5-minutes