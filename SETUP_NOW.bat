@echo off
echo ========================================
echo   Privora - Complete Setup Script
echo ========================================
echo.

REM Step 1: Create backend .env file
echo [1/5] Creating backend .env file...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo ✓ Backend .env created
) else (
    echo ✓ Backend .env already exists
)
echo.

REM Step 2: Create frontend .env.local file
echo [2/5] Creating frontend .env.local file...
if not exist "frontend\.env.local" (
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000
        echo NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
    ) > "frontend\.env.local"
    echo ✓ Frontend .env.local created
) else (
    echo ✓ Frontend .env.local already exists
)
echo.

REM Step 3: Generate Prisma Client
echo [3/5] Generating Prisma Client...
cd backend
call npx prisma generate
if %errorlevel% neq 0 (
    echo ✗ Failed to generate Prisma client
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

REM Step 4: Initialize Database
echo [4/5] Initializing database...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ✗ Failed to initialize database
    pause
    exit /b 1
)
echo ✓ Database initialized
cd ..
echo.

REM Step 5: Verify setup
echo [5/5] Verifying setup...
if exist "backend\.env" (
    echo ✓ Backend .env exists
) else (
    echo ✗ Backend .env missing
)

if exist "frontend\.env.local" (
    echo ✓ Frontend .env.local exists
) else (
    echo ✗ Frontend .env.local missing
)

if exist "backend\prisma\dev.db" (
    echo ✓ Database file exists
) else (
    echo ✗ Database file missing
)

if exist "backend\node_modules\@prisma\client" (
    echo ✓ Prisma client installed
) else (
    echo ✗ Prisma client missing
)
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Review backend\.env and update if needed
echo   2. Run START_APP.bat to start the application
echo   3. Visit http://localhost:3000
echo.
pause
