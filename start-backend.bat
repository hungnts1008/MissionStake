@echo off
echo ========================================
echo Starting MissionStake Backend
echo ========================================
echo.

cd spoonos-backend

if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run setup-backend.bat first
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Starting FastAPI server...
echo Backend URL: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python main.py
