# young-01 프로젝트

##  프로젝트 구성

young-01/ # 루트 디렉토리
├── docker-compose.yml # 개발용 DB, Redis 등 인프라
├── young-01-client/ # 프론트엔드: React + Vite + TypeScript
├── young-01-server/ # 백엔드: Express.js + Prisma + TypeScript

---

## 🚀 기술 스택

- **Frontend**: React, Vite, TypeScript
- **Backend**: Express.js, Prisma ORM, TypeScript
- **Database**: MySQL
- **Infra**: Docker (Redis 등)

---
# young-01-server
# 백엔드 설정

## .env 설정

| 변수명 | 설명 |
|--------|------|
| `JWT_ACCESS_EXPIRES_IN` | Access Token 만료 시간 (초 단위, 기본: 1800 = 30분) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh Token 만료 시간 (초 단위, 기본: 604800 = 7일) |


## .env.any

| 변수명 | 설명 |
|--------|------|
| `PORT` | 백엔드 서버 포트 (기본: 3000) |
| `FRONTEND_ORIGIN` | CORS 허용 프론트엔드 주소 |
| `REDIS_URL` | Redis 연결 주소 (예: `redis://localhost:6379`) |
| `REDIS_TTL` | Redis 데이터 만료 시간 (초 단위) |
| `JWT_SECRET` | JWT 서명용 비밀 키 |

---

## 🛠️ 개발 초기 세팅

```bash
# 0. 도커 인프라 설치
docker-compose up -d

# 1. 패키지 설치
npm install

# 2. 환경 파일 생성
cp .env.example .env

# 3. Prisma를 이용해 DB 초기화
npx prisma migrate dev --name init
ex) npx prisma migrate dev --name [migration-name]
```

-> npm install
-> cp .env.example .env
-> npx prisma migrate dev --name init (스키마로 db 생성)


