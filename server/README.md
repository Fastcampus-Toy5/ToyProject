## 1. 사용자 api

<details>
<summary>접기/펼치기</summary>

### 1-1. 사용자 전체 조회

- 요청예시
  - url: `/api/users`
  - method: `GET`
  - headers
    - Content-Type: `application/json`
- 응답 예시
  - 성공
    - status: `200`
    - body
      ```json
      {
          "status": "OK",
          "data": [
              {
                  "userId": "10001",
                  "email": "abc@abc.com",
                  "name": "test",
                  "team": "개발팀",
                  "position": "사원",
                  "withdraw": 0,
                  "isAdmin": 0
              },
          ]
      }
      ```
  - 실패
    - status: `500`
    - body:
    ```json
    {
      "status": "Error",
      "error": "error message"
    }
    ```

### 1-2. 사용자 상세 조회

- 요청
  - url: `/api/users/{사번}`
  - method: `GET`
  - headers
    - Content-Type: `application/json`
- 응답
  - 성공
    - status: `200`
    - body
      ```json
      status: 200
      data: {사용자 정보}
      ```
  - 실패
    - status: `500`

### 1-3. 사용자 등록

- 요청

  - url: `/api/users`
  - method: `POST`
  - headers
    - Content-Type: `application/json`
  - body

    ```json
    {
      "userId": "10005",
      "password": "1293859603",
      "email": "test@test.com",
      "name": "테스트사원1",
      "team": "개발 1팀",
      "position": "사원",
      "isAdmin": false
    }
    ```

- 응답
  - 성공
    - status: `200`
    - body
    ```json
    {
      "status": "Register",
      "message": "사용자가 등록되었습니다."
    }
    ```
  - 실패
    - status: `500`
    - body
    ```json
    {
      "status": "ERROR",
      "error": err.message
    }
    ```

### 1-4. 사용자 정보 수정

- 요청

  - url: `/api/users`
  - method: `PUT`
  - headers
    - Content-Type: `application/json`
  - body

    ```json
    {
      "userId": "10005",
      "password": "1293859603",
      "email": "test@test.com",
      "name": "테스트사원1",
      "team": "개발 1팀",
      "position": "사원",
      "isAdmin": false
    }
    ```

- 응답
  - 성공
    - status: `200`
    - body
    ```json
    {
      "status": "UPDATE",
      "message": "사용자가 등록되었습니다."
    }
    ```
  - 실패
    - status: `500`
    - body
    ```json
    {
      "status": "ERROR",
      "error": err.message
    }
    ```

### 1-5. 사용자 정보 삭제

- 요청

  - url: `/api/users`
  - method: `DELETE`
  - headers
    - Content-Type: `application/json`
  - body

    ```json
    {
      "userId": "10005"
    }
    ```

- 응답
  - 성공
    - status: `200`
    - body
    ```json
    {
      "status": "DELETE",
      "message": "사용자가 삭제되었습니다."
    }
    ```
  - 실패
    - status: `500`
    - body
    ```json
    {
      "status": "ERROR",
      "error": err.message
    }
    ```

### 1-6. 사용자 로그인

- 요청

  - url: `/api/users/login`
  - method: `GET`
  - headers
    - Content-Type: `application/json`
  - body

    ```json
    {
      "userId": "10005",
      "password": "1234"
    }
    ```

- 응답

  - 성공
    - status: `200`
    - body
    ```json
    {
      "status": "OK",
      "data": {사용자 정보}
    }
    ```
  - 실패1
    - status: `401`
    - body
    ```json
    {
      "status": "NO_USER",
      "error": "일치하는 사용자가 없습니다."
    }
    ```
  - 실패2
    - status: `500`
    - body
    ```json
    {
      "status": "ERROR",
      "error": err.message
    }
    ```

  </details>
