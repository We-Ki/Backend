## 설치 및 실행

1. **프로젝트 클론**

   ```bash
   git clone https://github.com/We-Ki/Backend
   cd Backend
   ```

2. **필요한 패키지 설치**

   ```bash
   npm install
   ```

3. **환경 변수 설정**

   - `.env` 파일을 생성하고, 다음과 같은 환경 변수를 설정합니다:
     ```
     PORT=
     MONGO_DB=
     SECREAT_KEY=
     GIT_TOKEN=
     ORIGIN_URL=
     MQTT_HOST=
     MQTT_PORT=
     ```

4. **서버 실행**
   ```bash
   npm start
   ```

## API 엔드포인트

### 사용자 인증

- **회원가입**

  - `POST /signup`
  - 요청 본문: `{ username, password, passwordConfirmation, email, name, userGroup }`
  - 응답: 사용자 ID

- **로그인**
  - `POST /signin`
  - 요청 본문: `{ username, password }`
  - 응답: JWT 토큰

### 사용자 관리

- **모든 사용자 조회**

  - `GET /users`
  - 응답: 사용자 목록

- **내 정보 확인**

  - `GET /users/me`
  - 응답: 내 정보

- **사용자 검색 및 수정**

  - `GET /users/:username`
  - `PUT /users/:username`
  - 요청 본문(수정): `{ newPassword, ... }`
  - 응답: 사용자 정보

- **사용자 삭제**
  - `DELETE /users/:username`
  - 응답: 삭제 결과

### 농장 관리

- **참여한 농장 조회**

  - `GET /farms/joined`
  - 응답: 참여한 농장 목록

- **농장 생성 및 조회**

  - `POST /farms`
  - `GET /farms/:id`
  - 요청 본문(생성): `{ name }`
  - 응답: 농장 정보

- **농장 가입 및 탈퇴**

  - `POST /farms/:id/join`
  - `DELETE /farms/:id/join`
  - 응답: 가입/탈퇴 결과

- **농장 물주기**
  - `POST /farms/:id/water`
  - 응답: 물주기 결과 및 포인트 증가

## 기술 스택

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js (JWT 인증)
- MQTT (농장 물주기 알림)
