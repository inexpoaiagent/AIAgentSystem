# AI Agent System - Autonomous Multi-Agent AI Operating System

Enterprise autonomous multi-agent AI operating system for companies that want an AI workforce, not just a chatbot.

The platform is designed as an AI Business OS where companies can run SEO, CRM, sales, content, social media, accounting, website generation, workflow automation, support, analytics, and agent collaboration from one multi-tenant workspace.

## What This System Includes

- Premium landing page with AI workflow/dashboard preview.
- AI workspace, realtime voice interface, AI meeting room, CRM, SEO, social media, automation builder, billing, and company brain screens.
- Autonomous Agent OS command center with agent hierarchy, meeting visualization, execution timeline, approval queue, sandbox tools, cost monitoring, and trace concepts.
- AI CEO Command Center inspired by the Claude artifact: business health score, executive agent boardroom, risk detection, growth recommendations, autonomous workflows, and approval-gated execution.
- AI marketplace, super admin, analytics, tickets, notifications, LLM management, website designer agent, help center, and production QA audit screens.
- Multilingual landing foundation for English, Persian RTL, and Turkish.
- Frontend service shells for API access, runtime events, notification logging, and realtime WebRTC voice sessions.
- FastAPI AI engine with multi-agent registry, planner, meeting consensus, tool registry, sandbox job policy, and orchestration endpoints.
- Backend API contract, PostgreSQL schema, Docker Compose, Kubernetes, CI, security docs, and production QA docs.

Original Figma source: https://www.figma.com/design/hIlKDvjO3Jt0YeLT7PNy3U/AI-Agent-Saas

## Running Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Key Routes

- `/` - Landing page
- `/workspace` - Main AI workspace
- `/agent-os` - Autonomous multi-agent operating system command center
- `/ceo` - AI CEO command center for business diagnosis, boardroom decisions, and growth execution
- `/business-doctor` - Company website/social diagnosis and action center
- `/meeting` - AI meeting room
- `/voice` - Voice AI interface
- `/automation` - Workflow builder
- `/website-designer` - Website Designer Agent
- `/admin` - Super admin command center
- `/llm-management` - LLM provider and cost routing
- `/notifications` - Notification/event feed
- `/tickets` - Support ticket system
- `/qa-audit` - Production QA audit dashboard

## Production Blueprint

- Frontend: Vite, React, TypeScript, TailwindCSS, motion animations.
- Backend target: NestJS/Laravel-style API control plane, PostgreSQL, Redis, Stripe, WebSockets, queue workers.
- AI engine target: FastAPI with hierarchical agent registry, task planner, shared context, meeting consensus, approval policy, tool execution, and sandbox jobs.
- Memory: Redis short-term state, PostgreSQL long-term memory, Qdrant vector namespaces.
- Infrastructure: Docker Compose for local services, Kubernetes deployment starter, GitHub Actions CI.

Architecture details live in `docs/ARCHITECTURE.md` and `docs/DATABASE_SCHEMA.md`.
Security details live in `docs/SECURITY.md`.
Multi-agent design details live in `docs/MULTI_AGENT_OS.md`.
Production QA protocol lives in `docs/PRODUCTION_QA.md`.

## Verification

The current workspace was verified with:

```bash
npm.cmd run typecheck
npm.cmd run build
python -m compileall ai-engine\app
```

The app is intended to evolve into a production SaaS with real provider keys, tenant services, database migrations, queue workers, and deployment pipelines.
