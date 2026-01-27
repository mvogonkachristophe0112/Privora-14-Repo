@echo off
echo ========================================
echo Installing Privora Dependencies
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
echo ========================================
cd backend
if exist package-lock.json del package-lock.json
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend installation failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed successfully!
echo.

echo Step 2: Installing Frontend Dependencies...
echo ========================================
cd frontend
if exist package-lock.json del package-lock.json
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend installation failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed successfully!
echo.

echo Step 3: Generating Prisma Client...
echo ========================================
cd backend
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Prisma generation failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo Prisma client generated successfully!
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Setup database: cd backend && npx prisma migrate dev --name init
echo 2. Start app: START_APP.bat
echo.
pause
