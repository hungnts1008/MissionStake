@echo off
echo ========================================
echo Test NEO Wallet Configuration
echo ========================================
echo.
echo This will test your NEO wallet setup
echo Make sure you have added wallet info to .env
echo.

cd spoonos-backend

if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run quick-setup.bat first
    pause
    exit /b 1
)

call venv\Scripts\activate.bat

echo Running wallet test...
echo.
python test_neo_connection.py

echo.
echo ========================================
echo.
echo If all tests pass, you can:
echo 1. Deploy smart contracts to NEO TestNet
echo 2. Send transactions
echo 3. Interact with blockchain
echo.
pause
