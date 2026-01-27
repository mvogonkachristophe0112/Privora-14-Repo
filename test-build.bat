@echo off
echo ========================================
echo Testing Privora Build
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

set BUILD_FAILED=0

echo Step 1: Checking dependencies...
echo ========================================
if not exist "node_modules" (
    echo Installing root dependencies...
    call npm install
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)
echo Dependencies OK
echo.

echo Step 2: Testing Backend...
echo ========================================
cd backend

echo Checking TypeScript...
call npx tsc --noEmit
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend TypeScript check failed
    set BUILD_FAILED=1
) else (
    echo Backend TypeScript OK
)
echo.

echo Validating Prisma schema...
call npx prisma validate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Prisma schema validation failed
    set BUILD_FAILED=1
) else (
    echo Prisma schema OK
)
echo.

echo Building backend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend build failed
    set BUILD_FAILED=1
) else (
    echo Backend build OK
)
echo.

cd ..

echo Step 3: Testing Frontend...
echo ========================================
cd frontend

echo Checking TypeScript...
call npx tsc --noEmit
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend TypeScript check failed
    set BUILD_FAILED=1
) else (
    echo Frontend TypeScript OK
)
echo.

echo Linting code...
call npm run lint
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Frontend linting issues found
    REM Don't fail build on lint warnings
) else (
    echo Frontend lint OK
)
echo.

echo Building frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend build failed
    set BUILD_FAILED=1
) else (
    echo Frontend build OK
)
echo.

cd ..

echo ========================================
echo Build Test Results
echo ========================================
echo.

if %BUILD_FAILED% EQU 0 (
    echo SUCCESS: All builds passed!
    echo.
    echo The application is ready to deploy.
    echo.
    echo Next steps:
    echo   - Local network: Run START_APP.bat
    echo   - Cloud: Push to GitHub and deploy
    echo.
) else (
    echo FAILED: Some builds failed
    echo.
    echo Please fix the errors above before deploying.
    echo.
)

pause
exit /b %BUILD_FAILED%
