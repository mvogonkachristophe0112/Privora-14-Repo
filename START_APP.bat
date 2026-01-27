@echo off
echo ========================================
echo Starting Privora Secure File Transfer
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
    echo.
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo WARNING: .env file not found
    echo Copying .env.example to .env...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file and set your local IP address
    echo Example: API_URL=http://192.168.1.100:5000
    echo.
    pause
)

REM Setup database if needed
if not exist "backend\prisma\dev.db" (
    echo Setting up database...
    cd backend
    call npx prisma generate
    call npx prisma migrate dev --name init
    cd ..
    echo.
)

echo ========================================
echo Starting Backend Server...
echo ========================================
echo Backend will run on: http://0.0.0.0:5000
echo Accessible from network at: http://YOUR_LOCAL_IP:5000
echo.

REM Start backend in new window
start "Privora Backend" cmd /k "cd backend && set HOST=0.0.0.0 && npm run dev"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

echo ========================================
echo Starting Frontend Server...
echo ========================================
echo Frontend will run on: http://0.0.0.0:3000
echo Accessible from network at: http://YOUR_LOCAL_IP:3000
echo.

REM Start frontend in new window
start "Privora Frontend" cmd /k "cd frontend && set HOST=0.0.0.0 && npm run dev"

echo.
echo ========================================
echo Privora is starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo To access from other devices on your network:
echo 1. Find your local IP address (run: ipconfig)
echo 2. Use http://YOUR_LOCAL_IP:3000
echo.
echo Press any key to close this window...
echo (Backend and Frontend will keep running)
pause >nul
