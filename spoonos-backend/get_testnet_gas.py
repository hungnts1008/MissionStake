"""
Tự động request GAS TestNet từ nhiều faucets
"""
import os
import requests
from dotenv import load_dotenv
import time

load_dotenv()

def check_balance(address, rpc_url):
    """Kiểm tra số dư hiện tại"""
    payload = {
        "jsonrpc": "2.0",
        "method": "getnep17balances",
        "params": [address],
        "id": 1
    }
    
    try:
        response = requests.post(rpc_url, json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "result" in data and "balance" in data["result"]:
                balances = data["result"]["balance"]
                for balance in balances:
                    asset = balance.get("assethash", "")
                    amount = int(balance.get("amount", 0)) / 100000000
                    
                    if asset == "0xd2a4cff31913016155e38e474a2c06d08be276cf":
                        return amount
        return 0
    except:
        return 0

def main():
    print("=" * 70)
    print("NEO TESTNET GAS FAUCET - TỰ ĐỘNG LẤY GAS")
    print("=" * 70)
    print()
    
    address = os.getenv("NEO_WALLET_ADDRESS", "")
    rpc_url = os.getenv("NEO_RPC_URL", "http://seed1t5.neo.org:20332")
    
    if not address:
        print("❌ Không tìm thấy NEO_WALLET_ADDRESS trong .env")
        return
    
    print(f"📍 Address: {address}")
    print()
    
    # Check current balance
    print("🔍 Đang kiểm tra số dư hiện tại...")
    current_balance = check_balance(address, rpc_url)
    print(f"💰 Số dư hiện tại: {current_balance:.8f} GAS")
    print()
    
    if current_balance > 0:
        print("✅ Wallet đã có GAS! Bạn có thể deploy smart contracts.")
        print()
        return
    
    print("=" * 70)
    print("HƯỚNG DẪN LẤY GAS TESTNET")
    print("=" * 70)
    print()
    
    print("📋 CÁC FAUCET KHẢ DỤNG:")
    print()
    
    faucets = [
        {
            "name": "NEO Wish (NGD - Khuyến nghị)",
            "url": "https://neowish.ngd.network/",
            "amount": "~10 GAS",
            "note": "Nhanh nhất, không cần đăng nhập"
        },
        {
            "name": "NEO TestNet Faucet",
            "url": "https://testnet.neo.org/faucet",
            "amount": "~5 GAS",
            "note": "Faucet chính thức"
        },
        {
            "name": "Neo Tracker",
            "url": "https://neotracker.io/testnet/faucet",
            "amount": "~1-5 GAS",
            "note": "Có thể cần đăng nhập"
        }
    ]
    
    for i, faucet in enumerate(faucets, 1):
        print(f"{i}. {faucet['name']}")
        print(f"   🔗 URL: {faucet['url']}")
        print(f"   💰 Amount: {faucet['amount']}")
        print(f"   📝 Note: {faucet['note']}")
        print()
    
    print("=" * 70)
    print("CÁCH LẤY GAS:")
    print("=" * 70)
    print()
    print("1. Mở một trong các URL trên trong browser")
    print("2. Paste địa chỉ wallet:")
    print(f"   {address}")
    print("3. Click nút 'Request' hoặc 'Claim'")
    print("4. Đợi 10-30 giây")
    print("5. Chạy lại script này để kiểm tra")
    print()
    
    print("=" * 70)
    print("KIỂM TRA TRÊN BLOCKCHAIN EXPLORER:")
    print("=" * 70)
    print()
    print(f"🔍 NeoTube: https://testnet.neotube.io/address/{address}")
    print(f"🔍 Dora: https://testnet.explorer.onegate.space/address/{address}")
    print()
    
    # Ask if user wants to wait and check
    print("=" * 70)
    print()
    input("Nhấn ENTER sau khi đã request GAS từ faucet...")
    print()
    
    print("🔄 Đang kiểm tra lại...")
    time.sleep(2)
    
    for i in range(3):
        print(f"   Attempt {i+1}/3...")
        new_balance = check_balance(address, rpc_url)
        
        if new_balance > current_balance:
            print()
            print("🎉 THÀNH CÔNG!")
            print(f"💰 Số dư mới: {new_balance:.8f} GAS")
            print(f"📈 Tăng: +{new_balance - current_balance:.8f} GAS")
            print()
            print("✅ Bạn đã sẵn sàng deploy smart contracts!")
            return
        
        if i < 2:
            print("   Chưa thấy GAS, đợi thêm 5 giây...")
            time.sleep(5)
    
    print()
    print("⚠️  Chưa thấy GAS trong wallet.")
    print()
    print("💡 Các lý do có thể:")
    print("   1. Faucet đang bận - thử lại sau 1-2 phút")
    print("   2. Địa chỉ đã nhận GAS gần đây - đợi 24h")
    print("   3. Network delay - đợi thêm vài phút")
    print()
    print("🔄 Hãy thử:")
    print("   1. Đợi 2-3 phút rồi chạy lại script này")
    print("   2. Thử faucet khác trong danh sách")
    print("   3. Kiểm tra trên blockchain explorer xem transaction đã có chưa")
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Đã hủy!")
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")
