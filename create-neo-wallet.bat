@echo off
echo ========================================
echo TAO NEO WALLET CHO TESTNET
echo ========================================
echo.
echo Script nay se tao wallet NEO moi
echo KHONG can NEO Desktop Wallet!
echo.

cd spoonos-backend

if not exist venv (
    echo ERROR: Virtual environment not found!
    echo Please run quick-setup.bat first
    pause
    exit /b 1
)

call venv\Scripts\activate.bat

echo Installing required library...
pip install base58 -q

echo.
echo ========================================
echo.

python create_neo_wallet.py

echo.
pause
