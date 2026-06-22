# AI Business OS — One-command setup script (Windows PowerShell)
# Run: powershell -ExecutionPolicy Bypass -File setup.ps1

$ErrorActionPreference = "Stop"
Write-Host "`n=== AI Business OS Setup ===" -ForegroundColor Cyan

# 1. Copy .env if missing
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "[1/6] .env created from .env.example — edit OPENAI_API_KEY before starting" -ForegroundColor Yellow
} else {
    Write-Host "[1/6] .env already exists" -ForegroundColor Green
}

# 2. Frontend dependencies
Write-Host "[2/6] Installing frontend dependencies..." -ForegroundColor Cyan
npm install
Write-Host "      Frontend deps OK" -ForegroundColor Green

# 3. Backend dependencies
Write-Host "[3/6] Installing backend dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
Set-Location ..
Write-Host "      Backend deps OK" -ForegroundColor Green

# 4. AI Engine dependencies
Write-Host "[4/6] Installing AI engine (Python) dependencies..." -ForegroundColor Cyan
Set-Location ai-engine
pip install -r requirements.txt --quiet
Set-Location ..
Write-Host "      AI engine deps OK" -ForegroundColor Green

# 5. Docker services (Postgres + Redis)
Write-Host "[5/6] Starting Docker services (postgres, redis, qdrant)..." -ForegroundColor Cyan
docker compose up -d postgres redis qdrant
Write-Host "      Waiting 5s for postgres to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 6. Database migrate + seed
Write-Host "[6/6] Running database migrations and seed..." -ForegroundColor Cyan
Set-Location backend
$env:DATABASE_URL = "postgresql://ai_os:ai_os_dev@localhost:5432/ai_business_os?schema=public"
npx prisma generate
npx prisma migrate deploy
npx ts-node prisma/seed.ts
Set-Location ..

Write-Host "`n=== Setup complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Start the system with 3 terminals:" -ForegroundColor Cyan
Write-Host "  Terminal 1 (AI Engine): cd ai-engine; uvicorn app.main:app --reload --port 8000" -ForegroundColor White
Write-Host "  Terminal 2 (Backend):   cd backend; npm run start:dev" -ForegroundColor White
Write-Host "  Terminal 3 (Frontend):  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Demo login: admin@ai-business-os.com / Admin@123456" -ForegroundColor Yellow
Write-Host "Swagger docs: http://localhost:8080/docs" -ForegroundColor Yellow
