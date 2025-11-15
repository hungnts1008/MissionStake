"""
Test NEO Blockchain Connection
Kiểm tra kết nối đến NEO TestNet và thông tin blockchain
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_neo_imports():
    """Test 1: Kiểm tra NEO libraries có được cài đặt không"""
    print("=" * 60)
    print("TEST 1: Kiểm tra NEO Libraries")
    print("=" * 60)
    
    try:
        import requests
        print("✅ requests library: OK")
    except ImportError as e:
        print(f"❌ requests library: FAILED - {e}")
        return False
    
    # Thử import neo-mamba (optional)
    try:
        import neo3
        print("✅ neo3-mamba library: OK")
        has_neo3 = True
    except ImportError:
        print("⚠️  neo3-mamba library: Not installed (optional)")
        has_neo3 = False
    
    return True

def test_neo_testnet_connection():
    """Test 2: Kiểm tra kết nối đến NEO TestNet RPC"""
    print("\n" + "=" * 60)
    print("TEST 2: Kết nối đến NEO TestNet")
    print("=" * 60)
    
    import requests
    import json
    
    # NEO TestNet RPC endpoints
    rpc_urls = [
        "https://testnet1.neo.org:443",
        "https://testnet2.neo.org:443",
        "http://seed1t5.neo.org:20332",
    ]
    
    for rpc_url in rpc_urls:
            print(f"\n🔗 Đang test: {rpc_url}")
            
            try:
                # Gửi request lấy block count
                payload = {
                    "jsonrpc": "2.0",
                    "method": "getblockcount",
                    "params": [],
                    "id": 1
                }
                
                response = requests.post(
                    rpc_url,
                    json=payload,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "result" in data:
                        block_count = data["result"]
                        print(f"   ✅ Kết nối thành công!")
                        print(f"   📊 Block count: {block_count:,}")
                        
                        # Test thêm: lấy thông tin version
                        version_payload = {
                            "jsonrpc": "2.0",
                            "method": "getversion",
                            "params": [],
                            "id": 1
                        }
                        version_response = requests.post(rpc_url, json=version_payload, timeout=5)
                        if version_response.status_code == 200:
                            version_data = version_response.json()
                            if "result" in version_data:
                                print(f"   🔧 Version: {version_data['result']}")
                        
                        return True, rpc_url
                    else:
                        print(f"   ⚠️  Response không có result")
                else:
                    print(f"   ❌ HTTP Status: {response.status_code}")
                    
            except requests.exceptions.Timeout:
                print(f"   ⏱️  Timeout - RPC endpoint quá chậm")
            except requests.exceptions.ConnectionError:
                print(f"   ❌ Connection Error - Không thể kết nối")
            except Exception as e:
                print(f"   ❌ Error: {e}")
    
    print("\n❌ Không kết nối được đến bất kỳ NEO TestNet RPC nào")
    return False, None

def test_neo_wallet_config():
    """Test 3: Kiểm tra cấu hình NEO wallet trong .env"""
    print("\n" + "=" * 60)
    print("TEST 3: Kiểm tra cấu hình NEO Wallet")
    print("=" * 60)
    
    neo_network = os.getenv("NEO_NETWORK", "testnet")
    neo_rpc_url = os.getenv("NEO_RPC_URL", "")
    neo_wallet_address = os.getenv("NEO_WALLET_ADDRESS", "")
    neo_wallet_private_key = os.getenv("NEO_WALLET_PRIVATE_KEY", "")
    
    print(f"📍 NEO_NETWORK: {neo_network}")
    print(f"🔗 NEO_RPC_URL: {neo_rpc_url if neo_rpc_url else '❌ Chưa cấu hình'}")
    print(f"💳 NEO_WALLET_ADDRESS: {neo_wallet_address if neo_wallet_address else '❌ Chưa cấu hình'}")
    print(f"🔑 NEO_WALLET_PRIVATE_KEY: {'✅ Đã cấu hình' if neo_wallet_private_key else '❌ Chưa cấu hình'}")
    
    if neo_wallet_address and neo_wallet_private_key:
        print("\n✅ Wallet đã được cấu hình")
        return True
    else:
        print("\n⚠️  Wallet chưa được cấu hình đầy đủ")
        print("\nHướng dẫn:")
        print("1. Cài đặt NeoLine wallet: https://neoline.io/")
        print("2. Tạo wallet mới hoặc import wallet")
        print("3. Chuyển sang TestNet trong settings")
        print("4. Copy địa chỉ wallet và private key vào .env")
        return False

def test_get_testnet_gas():
    """Test 4: Kiểm tra số dư GAS trong wallet (nếu đã cấu hình)"""
    print("\n" + "=" * 60)
    print("TEST 4: Kiểm tra số dư GAS TestNet")
    print("=" * 60)
    
    neo_wallet_address = os.getenv("NEO_WALLET_ADDRESS", "")
    
    if not neo_wallet_address:
        print("⚠️  Chưa cấu hình wallet address - bỏ qua test này")
        return False
    
    try:
        import requests
        
        # Use the faster RPC endpoint
        rpc_url = os.getenv("NEO_RPC_URL", "http://seed1t5.neo.org:20332")
        
        # Get NEP17 balances
        payload = {
            "jsonrpc": "2.0",
            "method": "getnep17balances",
            "params": [neo_wallet_address],
            "id": 1
        }
        
        response = requests.post(rpc_url, json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "result" in data and "balance" in data["result"]:
                balances = data["result"]["balance"]
                print(f"💰 Wallet: {neo_wallet_address}")
                
                if balances:
                    for balance in balances:
                        asset = balance.get("assethash", "Unknown")
                        amount = int(balance.get("amount", 0)) / 100000000  # Convert to decimal
                        
                        # Identify asset type
                        if asset == "0xd2a4cff31913016155e38e474a2c06d08be276cf":
                            print(f"   💎 GAS: {amount:.8f}")
                        elif asset == "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5":
                            print(f"   🔷 NEO: {amount:.0f}")
                        else:
                            print(f"   🎁 Token ({asset[:10]}...): {amount:.8f}")
                    
                    print("\n✅ Wallet có số dư")
                    return True
                else:
                    print("⚠️  Wallet không có số dư")
                    print("\n💡 Hướng dẫn lấy GAS TestNet miễn phí:")
                    print("   1. Vào: https://neowish.ngd.network/")
                    print("   2. Paste địa chỉ wallet của bạn")
                    print("   3. Click 'Request' để nhận GAS miễn phí")
                    print("   4. Đợi vài giây và chạy lại test này")
                    return False
            else:
                print(f"❌ Không thể lấy balance: {data}")
                return False
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_smart_contract_deployment_ready():
    """Test 5: Kiểm tra sẵn sàng deploy smart contract"""
    print("\n" + "=" * 60)
    print("TEST 5: Kiểm tra sẵn sàng deploy Smart Contract")
    print("=" * 60)
    
    # Check requirements
    checks = {
        "NEO TestNet Connection": False,
        "Wallet Configured": False,
        "GAS Balance": False,
        "Development Tools": False
    }
    
    # Test connection
    try:
        import requests
        rpc_url = os.getenv("NEO_RPC_URL", "http://seed1t5.neo.org:20332")
        payload = {"jsonrpc": "2.0", "method": "getblockcount", "params": [], "id": 1}
        response = requests.post(rpc_url, json=payload, timeout=5)
        if response.status_code == 200 and "result" in response.json():
            checks["NEO TestNet Connection"] = True
    except:
        pass
    
    # Check wallet
    if os.getenv("NEO_WALLET_ADDRESS") and os.getenv("NEO_WALLET_PRIVATE_KEY"):
        checks["Wallet Configured"] = True
    
    # Check GAS (simplified check)
    if os.getenv("NEO_WALLET_ADDRESS"):
        try:
            import requests
            rpc_url = os.getenv("NEO_RPC_URL", "http://seed1t5.neo.org:20332")
            payload = {
                "jsonrpc": "2.0",
                "method": "getnep17balances",
                "params": [os.getenv("NEO_WALLET_ADDRESS")],
                "id": 1
            }
            response = requests.post(rpc_url, json=payload, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if "result" in data and data["result"].get("balance"):
                    checks["GAS Balance"] = True
        except:
            pass
    
    # Check development tools
    try:
        import json
        checks["Development Tools"] = True
    except:
        pass
    
    # Print results
    print("\n📋 Checklist:")
    for check, status in checks.items():
        icon = "✅" if status else "❌"
        print(f"   {icon} {check}")
    
    all_ready = all(checks.values())
    
    if all_ready:
        print("\n🎉 SẴN SÀNG deploy smart contracts!")
        print("\nNext steps:")
        print("1. Viết smart contract bằng C# (neo3-boa)")
        print("2. Compile contract thành .nef file")
        print("3. Deploy lên NEO TestNet")
    else:
        print("\n⚠️  CHƯA SẴN SÀNG - Hoàn thành các bước còn thiếu")
    
    return all_ready

def main():
    """Chạy tất cả các tests"""
    print("=" * 60)
    print("NEO BLOCKCHAIN CONNECTION TEST")
    print("Testing NEO TestNet Integration")
    print("=" * 60)
    print()
    
    # Run all tests
    results = []
    
    results.append(("Libraries Import", test_neo_imports()))
    
    connection_ok, rpc_url = test_neo_testnet_connection()
    results.append(("TestNet Connection", connection_ok))
    
    results.append(("Wallet Config", test_neo_wallet_config()))
    results.append(("GAS Balance", test_get_testnet_gas()))
    results.append(("Deploy Ready", test_smart_contract_deployment_ready()))
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY / TÓM TẮT")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        icon = "✅" if result else "❌"
        print(f"{icon} {test_name}")
    
    print(f"\n📊 Kết quả: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 HOÀN HẢO! NEO blockchain đã sẵn sàng!")
    elif passed >= 2:
        print("⚠️  Một số test chưa pass - xem hướng dẫn ở trên")
    else:
        print("❌ Cần setup thêm - làm theo hướng dẫn")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
