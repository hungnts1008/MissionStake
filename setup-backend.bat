@echo off
echo ========================================
echo MissionStake - SpoonOS Backend Setup
echo ========================================
echo.

cd spoonos-backend

echo [1/4] Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    echo Please install Python 3.11 or higher
    pause
    exit /b 1
)
echo ✓ Virtual environment created
echo.

echo [2/4] Activating virtual environment...
call venv\Scripts\activate.bat
echo ✓ Virtual environment activated
echo.

echo [3/4] Installing dependencies...
echo This may take a few minutes...
python.exe -m pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    echo.
    echo Common fixes:
    echo   - Make sure Python 3.11+ is installed
    echo   - Try running as Administrator
    echo   - Check your internet connection
    echo.
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [4/4] Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo ✓ .env file created
    echo.
    echo ⚠️  IMPORTANT: Edit .env and add your API keys!
    echo    - GEMINI_API_KEY: Get from https://aistudio.google.com/apikey
    echo.
) else (
    echo ✓ .env file already exists
)

echo.
echo ========================================
echo Setup Complete! 🎉
echo ========================================
echo.
echo To start the backend server:
echo   1. cd spoonos-backend
echo   2. venv\Scripts\activate
echo   3. python main.py
echo.
echo Backend will run at: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
pause
