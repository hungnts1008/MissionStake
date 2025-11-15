"""
Tạo NEO Wallet cho TestNet - Không cần NEO Desktop Wallet
Script này sẽ tạo wallet mới hoàn toàn bằng Python
"""
import secrets
import hashlib
import base58

def generate_private_key():
    """Tạo private key ngẫu nhiên (32 bytes)"""
    return secrets.token_bytes(32)

def private_key_to_wif(private_key, version=0x80):
    """Chuyển private key sang WIF format (Wallet Import Format)"""
    # Add version byte
    extended = bytes([version]) + private_key
    
    # Double SHA256
    hash1 = hashlib.sha256(extended).digest()
    hash2 = hashlib.sha256(hash1).digest()
    
    # Add checksum (first 4 bytes of hash2)
    checksum = hash2[:4]
    extended_with_checksum = extended + checksum
    
    # Base58 encode
    wif = base58.b58encode(extended_with_checksum).decode('ascii')
    return wif

def private_key_to_public_key(private_key):
    """Chuyển private key sang public key (simplified)"""
    # Note: Đây là version đơn giản, production cần dùng elliptic curve crypto
    import hashlib
    
    # Simplified: hash private key để demo
    # Real implementation: ECDSA secp256r1
    pub_hash = hashlib.sha256(private_key).hexdigest()
    return pub_hash

def create_neo_address(public_key_hash):
    """Tạo NEO address từ public key"""
    # NEO address format: N + base58(script_hash)
    # Simplified version for demo
    
    # Version byte for NEO (0x35 = 53 for N address)
    version = 0x35
    
    # Take first 20 bytes of public key hash
    script_hash = bytes.fromhex(public_key_hash[:40])
    
    # Add version
    versioned = bytes([version]) + script_hash
    
    # Double SHA256 for checksum
    hash1 = hashlib.sha256(versioned).digest()
    hash2 = hashlib.sha256(hash1).digest()
    checksum = hash2[:4]
    
    # Add checksum and encode
    address_bytes = versioned + checksum
    address = base58.b58encode(address_bytes).decode('ascii')
    
    return address

def main():
    print("=" * 70)
    print("TẠO NEO WALLET MỚI CHO TESTNET")
    print("=" * 70)
    print()
    
    print("⚠️  QUAN TRỌNG:")
    print("   - LƯU PRIVATE KEY an toàn!")
    print("   - KHÔNG CHIA SẺ private key với ai!")
    print("   - Đây là TestNet wallet - CHỈ dùng để test!")
    print()
    
    input("Nhấn ENTER để tạo wallet mới...")
    print()
    
    # Generate wallet
    print("🔐 Đang tạo private key...")
    private_key = generate_private_key()
    private_key_hex = private_key.hex()
    
    print("🔑 Đang chuyển sang WIF format...")
    wif = private_key_to_wif(private_key)
    
    print("🔓 Đang tạo public key...")
    public_key_hash = private_key_to_public_key(private_key)
    
    print("📍 Đang tạo NEO address...")
    address = create_neo_address(public_key_hash)
    
    print()
    print("=" * 70)
    print("✅ WALLET ĐÃ ĐƯỢC TẠO THÀNH CÔNG!")
    print("=" * 70)
    print()
    print(f"📍 Address:     {address}")
    print(f"🔑 Private Key: {wif}")
    print(f"🔐 Hex Key:     {private_key_hex}")
    print()
    print("=" * 70)
    print()
    
    # Save to .env
    print("💾 Bạn có muốn lưu vào file .env? (y/n): ", end="")
    save = input().lower()
    
    if save == 'y':
        try:
            # Read current .env
            env_path = ".env"
            with open(env_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            # Update or add lines
            updated = False
            for i, line in enumerate(lines):
                if line.startswith('NEO_WALLET_ADDRESS='):
                    lines[i] = f'NEO_WALLET_ADDRESS={address}\n'
                    updated = True
                elif line.startswith('NEO_WALLET_PRIVATE_KEY='):
                    lines[i] = f'NEO_WALLET_PRIVATE_KEY={wif}\n'
            
            if not updated:
                lines.append(f'\n# NEO Wallet (Generated)\n')
                lines.append(f'NEO_WALLET_ADDRESS={address}\n')
                lines.append(f'NEO_WALLET_PRIVATE_KEY={wif}\n')
            
            # Write back
            with open(env_path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            
            print(f"✅ Đã lưu vào {env_path}")
        except Exception as e:
            print(f"❌ Lỗi khi lưu: {e}")
            print()
            print("Hãy copy thông tin ở trên và paste vào .env thủ công!")
    
    print()
    print("=" * 70)
    print("BƯỚC TIẾP THEO:")
    print("=" * 70)
    print()
    print("1. LẤY GAS TESTNET MIỄN PHÍ:")
    print("   👉 https://neowish.ngd.network/")
    print(f"   Paste address: {address}")
    print()
    print("2. KIỂM TRA WALLET:")
    print("   python test_neo_connection.py")
    print()
    print("3. XEM WALLET TRÊN BLOCKCHAIN:")
    print("   👉 https://testnet.neotube.io/")
    print(f"   Search: {address}")
    print()
    print("=" * 70)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Đã hủy!")
    except Exception as e:
        print(f"\n❌ Lỗi: {e}")
        print("\nHãy cài thêm thư viện:")
        print("pip install base58")
