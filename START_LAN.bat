@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Privora - Local Network Deployment
echo ========================================
echo.

REM Detect host IP address
echo [1/5] Detecting host IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    set IP=!IP:~1!
    goto :ip_found
)
:ip_found

if "%IP%"=="" (
    echo ✗ Could not detect IP address
    echo Please check your network connection
    pause
    exit /b 1
)

echo ✓ Host IP detected: %IP%
echo.

REM Update backend .env
echo [2/5] Configuring backend for LAN...
(
    echo PORT=5000
    echo HOST=0.0.0.0
    echo NODE_ENV=development
    echo API_URL=http://%IP%:5000
    echo FRONTEND_URL=http://%IP%:3000
    echo DATABASE_URL="file:./prisma/dev.db"
    echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
    echo JWT_EXPIRES_IN=7d
    echo REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this
    echo REFRESH_TOKEN_EXPIRES_IN=30d
    echo CORS_ORIGIN=http://%IP%:3000
    echo MAX_FILE_SIZE=104857600
    echo UPLOAD_DIR=./uploads
) > backend\.env
echo ✓ Backend configured
echo.

REM Update frontend .env.local
echo [3/5] Configuring frontend for LAN...
(
    echo NEXT_PUBLIC_API_URL=http://%IP%:5000
    echo NEXT_PUBLIC_SOCKET_URL=http://%IP%:5000
    echo NEXT_PUBLIC_HOST_IP=%IP%
) > frontend\.env.local
echo ✓ Frontend configured
echo.

REM Start backend
echo [4/5] Starting backend server...
start "Privora Backend (LAN)" cmd /k "cd backend && npm run dev"
ping 127.0.0.1 -n 5 >nul
echo ✓ Backend started
echo.

REM Start frontend
echo [5/5] Starting frontend server...
start "Privora Frontend (LAN)" cmd /k "cd frontend && npm run dev -- -H 0.0.0.0"
ping 127.0.0.1 -n 8 >nul
echo ✓ Frontend started
echo.

echo ========================================
echo   Privora Started on Local Network!
echo ========================================
echo.
echo 📱 Access from ANY device on your Wi-Fi:
echo.
echo    Frontend: http://%IP%:3000
echo    Backend:  http://%IP%:5000
echo.
echo 💡 Share this URL with others on your network:
echo    http://%IP%:3000
echo.
echo 🔥 Firewall: If you can't connect, allow ports 3000 and 5000
echo    Run: netsh advfirewall firewall add rule name="Privora" dir=in action=allow protocol=TCP localport=3000,5000
echo.
echo Press Ctrl+C in each terminal window to stop the servers.
echo.
pause
