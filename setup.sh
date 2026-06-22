#!/bin/bash
# AI Business OS — One-command setup (Linux/Mac/WSL)
set -e
echo "=== AI Business OS Setup ==="

# 1. .env
if [ ! -f .env ]; then
  cp .env.example .env
  echo "[1/6] .env created — add OPENAI_API_KEY before starting"
else
  echo "[1/6] .env OK"
fi

# 2. Frontend
echo "[2/6] Installing frontend deps..."
npm install

# 3. Backend
echo "[3/6] Installing backend deps..."
cd backend && npm install && cd ..

# 4. AI Engine
echo "[4/6] Installing Python deps..."
cd ai-engine && pip install -r requirements.txt --quiet && cd ..

# 5. Docker
echo "[5/6] Starting Postgres, Redis, Qdrant..."
docker compose up -d postgres redis qdrant
sleep 5

# 6. DB
echo "[6/6] Migrating and seeding database..."
cd backend
export DATABASE_URL="postgresql://ai_os:ai_os_dev@localhost:5432/ai_business_os?schema=public"
npx prisma generate
npx prisma migrate deploy
npx ts-node prisma/seed.ts
cd ..

echo ""
echo "=== Setup complete ==="
echo ""
echo "Start with 3 terminals:"
echo "  1: cd ai-engine && uvicorn app.main:app --reload --port 8000"
echo "  2: cd backend && npm run start:dev"
echo "  3: npm run dev"
echo ""
echo "Demo: admin@ai-business-os.com / Admin@123456"
