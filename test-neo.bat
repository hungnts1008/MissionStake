@echo off
echo ========================================
echo NEO Blockchain Connection Test
echo ========================================
echo.

cd spoonos-backend

if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run quick-setup.bat first
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Installing required test library...
pip install requests -q

echo.
echo Running NEO connection tests...
echo.
python test_neo_connection.py

echo.
pause
