@echo off
echo ========================================
echo   Starting Privora Application
echo ========================================
echo.

REM Check if backend is already running
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠ Backend already running on port 5000
) else (
    echo Starting backend server...
    start "Privora Backend" cmd /k "cd backend && npm run dev"
    timeout /t 3 /nobreak >nul
)

REM Check if frontend is already running
netstat -ano | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠ Frontend already running on port 3000
) else (
    echo Starting frontend server...
    start "Privora Frontend" cmd /k "cd frontend && npm run dev"
    timeout /t 5 /nobreak >nul
)

echo.
echo ========================================
echo   Privora Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press Ctrl+C in each terminal window to stop the servers.
echo.
pause
