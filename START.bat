@echo off
title InexpoAI - Starting All Services
color 0A

echo.
echo  ========================================
echo   InexpoAI - Autonomous AI Business OS
echo  ========================================
echo.

:: ── Check XAMPP MariaDB ──────────────────────────────────────────────────────
echo [1/4] Checking MariaDB...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo  ERROR: MariaDB not running! Start XAMPP first.
    echo  Open XAMPP Control Panel and click Start next to MySQL.
    pause
    exit /b 1
)
echo  MariaDB OK

:: ── Start NestJS Backend ─────────────────────────────────────────────────────
echo [2/4] Starting Backend (port 8080)...
set DATABASE_URL=mysql://root@localhost:3306/ai_business_os
set JWT_SECRET=super-secret-jwt-key-2025
set JWT_REFRESH_SECRET=super-secret-refresh-key-2025
set PORT=8080
set AI_ENGINE_URL=http://localhost:8000

start "InexpoAI Backend" cmd /k "cd /d "E:\Codex\AI Agent\backend" && set DATABASE_URL=mysql://root@localhost:3306/ai_business_os && set JWT_SECRET=super-secret-jwt-key-2025 && set JWT_REFRESH_SECRET=super-secret-refresh-key-2025 && set PORT=8080 && set AI_ENGINE_URL=http://localhost:8000 && node dist/src/main.js"

:: ── Start FastAPI AI Engine ──────────────────────────────────────────────────
echo [3/4] Starting AI Engine (port 8000)...
start "InexpoAI AI Engine" cmd /k "cd /d "E:\Codex\AI Agent\ai-engine" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

:: ── Start Frontend ───────────────────────────────────────────────────────────
echo [4/4] Starting Frontend (port 5173)...
timeout /t 3 /nobreak >nul
start "InexpoAI Frontend" cmd /k "cd /d "E:\Codex\AI Agent" && npm run dev"

:: ── Wait and open browser ────────────────────────────────────────────────────
echo.
echo  Waiting for services to start...
timeout /t 8 /nobreak >nul

echo.
echo  ========================================
echo   All services started!
echo  ========================================
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:8080
echo   API Docs:  http://localhost:8080/docs
echo   AI Engine: http://localhost:8000/docs
echo.
echo   Login:  admin@ai-business-os.com
echo   Pass:   Admin@123456
echo.
echo  ========================================
echo.

start "" "http://localhost:5173"
pause
