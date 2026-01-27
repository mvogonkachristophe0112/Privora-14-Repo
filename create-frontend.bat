@echo off
echo ========================================
echo Creating Privora Frontend Files
echo ========================================
echo.

REM Create directory structure
echo Creating directories...
mkdir frontend\src\app\(auth)\login 2>nul
mkdir frontend\src\app\(auth)\signup 2>nul
mkdir frontend\src\app\(dashboard)\dashboard 2>nul
mkdir frontend\src\app\(dashboard)\online-users 2>nul
mkdir frontend\src\app\(dashboard)\send 2>nul
mkdir frontend\src\app\(dashboard)\receive 2>nul
mkdir frontend\src\app\(dashboard)\file-manager 2>nul
mkdir frontend\src\app\(dashboard)\history 2>nul
mkdir frontend\src\app\about 2>nul
mkdir frontend\src\components\ui 2>nul
mkdir frontend\src\lib 2>nul
mkdir frontend\src\store 2>nul
mkdir frontend\src\types 2>nul
mkdir frontend\public 2>nul

echo.
echo ========================================
echo Frontend structure created!
echo ========================================
echo.
echo Next steps:
echo 1. Run: cd frontend
echo 2. Run: npm install
echo 3. Create the React component files using the templates in SETUP_GUIDE.md
echo 4. Run: npm run dev
echo.
echo See SETUP_GUIDE.md for complete file templates
echo.
pause
