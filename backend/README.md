# AI Business OS — Backend (NestJS Control Plane)

## Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js 22 / NestJS 10 |
| ORM | Prisma 6 + PostgreSQL 16 |
| Auth | JWT access (15m) + refresh (7d) |
| Realtime | Socket.IO WebSocket gateway |
| Docs | Swagger → http://localhost:8080/docs |

## Quick Start

```bash
# 1. Start PostgreSQL + Redis
docker compose up postgres redis -d

# 2. Install & migrate
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npx ts-node prisma/seed.ts

# 3. Dev server
npm run start:dev
```

API → http://localhost:8080/v1  
Swagger → http://localhost:8080/docs

## Seed credentials

| | |
|-|-|
| Email | admin@ai-business-os.com |
| Password | Admin@123456 |

## Key endpoints

| Method | Path | |
|--------|------|-|
| POST | /v1/auth/register | Register company |
| POST | /v1/auth/login | Login |
| GET | /v1/workspace | TenantContext for frontend |
| POST | /v1/agent-tasks | Dispatch to AI engine |
| POST | /v1/voice/sessions | WebRTC provider token |
| GET | /v1/agents | List agents |
| GET | /v1/workflows | Workflows |
| GET | /v1/memories | Company brain |
| GET | /v1/subscriptions | Plan + limits |
| GET | /v1/usage/summary | Usage this period |
| GET | /v1/audit-logs | Audit trail |

## WebSocket events (ws://localhost:8080/events)

Auth: `{ auth: { token: '<accessToken>' } }`

- `task:created` / `task:planned` / `task:approved` / `task:rejected`
- `workflow:run:started` / `workflow:run:completed`

## Production

```bash
docker compose up --build
```

Starts: PostgreSQL → Redis → Backend (auto-migrate + seed) → AI Engine → Frontend
