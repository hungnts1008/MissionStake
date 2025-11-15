@echo off
echo ========================================
echo Quick Setup - Core Dependencies Only
echo ========================================
echo.

cd spoonos-backend

REM Check if venv exists
if exist venv (
    echo Virtual environment already exists, skipping creation...
) else (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create venv. Is Python installed?
        pause
        exit /b 1
    )
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Installing core dependencies (this may take 2-3 minutes)...
pip install fastapi uvicorn[standard] pydantic pydantic-settings python-dotenv python-multipart redis

echo.
echo Installing AI libraries...
pip install openai anthropic google-generativeai

echo.
echo Setting up .env file...
if not exist .env (
    copy .env.example .env
    echo ✓ .env created
) else (
    echo ✓ .env exists
)

echo.
echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Get FREE Gemini API key: https://aistudio.google.com/apikey
echo 2. Edit spoonos-backend\.env and add your GEMINI_API_KEY
echo 3. Run: .\start-backend.bat
echo.
pause
