@echo off
echo ========================================
echo Updating Privora Secure File Transfer
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

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo Step 1: Checking Git status...
echo ========================================
git status
echo.

echo Step 2: Pulling latest changes...
echo ========================================
git pull origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Git pull failed
    echo Please resolve any conflicts manually
    pause
    exit /b 1
)
echo.

echo Step 3: Installing dependencies...
echo ========================================
echo Installing root dependencies...
call npm install
echo.

echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo.

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.

echo Step 4: Updating database...
echo ========================================
cd backend
call npx prisma generate
call npx prisma migrate deploy
cd ..
echo.

echo Step 5: Building application...
echo ========================================
echo Building backend...
cd backend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Backend build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo Building frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Frontend build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo.

echo ========================================
echo Update Complete!
echo ========================================
echo.
echo The application has been updated successfully.
echo.
echo To start the application, run:
echo   START_APP.bat
echo.
echo Or manually start:
echo   Backend: cd backend && npm run dev
echo   Frontend: cd frontend && npm run dev
echo.
pause
