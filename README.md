# young-01 프로젝트

## 프로젝트 구성

young-01/ # 루트 디렉토리
├── docker-compose.yml # 개발용 DB, Redis 등 인프라
├── young-01-client/ # 프론트엔드: React + Vite + TypeScript
├── young-01-server/ # 백엔드: Express.js + Prisma + TypeScript

---

## 🚀 기술 스택

- **Frontend**: React, Vite, TypeScript
- **Backend**: Express.js, Prisma ORM, TypeScript, Winston
- **Database**: MySQL
- **Infra**: Docker (Redis 등)

---

# 프론트 설정

# 백엔드 설정

## 🛠️ 개발 초기 세팅

```bash
# 0. 도커 인프라 설치
docker-compose up -d

# 1. 환경 파일 생성
cp .env.example .env

# 2. 패키지 설치
npm install

# 3. Prisma를 이용해 DB 초기화

# 3-1. prisma 스키마를 소스코드에 반영만 할 때
npx prisma generate

# 3-2. 스키마 수정 후 마이그레이션 이력을 생성할 때
npx prisma migrate dev --name [migration-name]
npx prisma migrate deploy --name [migration-name]


```

-> npm install
-> cp .env.example .env
-> npx prisma migrate dev --name init (스키마로 db 생성)
