# Hướng dẫn chuyển NEO Desktop Wallet sang TestNet

## Vấn đề:
NEO Desktop Wallet không cho phép chuyển network khi đang mở wallet.

## Giải pháp:

### Cách 1: Từ màn hình chính (Đơn giản nhất)

1. **Đóng wallet** nếu đang mở (File → Close hoặc thoát ứng dụng)
2. Mở lại NEO Desktop Wallet
3. **QUAN TRỌNG**: Ở màn hình chính (trước khi mở wallet):
   - Nhìn **góc dưới bên phải** màn hình
   - Sẽ thấy chữ "MainNet" hoặc "TestNet"
   - **Click vào đó** để chuyển đổi
4. Sau khi chọn TestNet → Mở wallet hoặc tạo wallet mới

### Cách 2: Sửa config file (Advanced)

**Windows:**
```
C:\Users\[YourUsername]\AppData\Roaming\Neo3-GUI\config.json
```

**Mở file config.json và tìm:**
```json
{
  "ApplicationConfiguration": {
    "Network": 860833102  // MainNet
  }
}
```

**Đổi thành:**
```json
{
  "ApplicationConfiguration": {
    "Network": 894710606  // TestNet
  }
}
```

### Cách 3: Tạo wallet mới trên TestNet

1. Chuyển sang TestNet ở màn hình chính (theo Cách 1)
2. Click "Create Wallet"
3. Đặt mật khẩu → Lưu file .json
4. **LƯU Ý**: Ghi lại seed phrase (nếu có) hoặc backup file wallet

## Sau khi đã ở TestNet:

### 1. Lấy thông tin wallet:
- **Address**: Tab "Accounts" → Copy address (NXxx...)
- **Private Key**: Right-click account → "View Private Key" → Nhập password

### 2. Lấy GAS TestNet miễn phí:
```
https://neowish.ngd.network/
```
Paste address → Click "Request" → Nhận 10 GAS

### 3. Cấu hình vào .env:
```env
NEO_NETWORK=testnet
NEO_RPC_URL=http://seed1t5.neo.org:20332
NEO_WALLET_ADDRESS=NXxx...xxx
NEO_WALLET_PRIVATE_KEY=Kxxx...xxx
```

### 4. Test lại:
```powershell
.\test-neo-wallet.bat
```

## Network Magic Numbers:
- **MainNet**: 860833102 (0x334F454E)
- **TestNet**: 894710606 (0x3554334E)

## Kiểm tra đang ở network nào:
- Góc dưới bên phải màn hình wallet
- Hoặc xem block height (TestNet < MainNet)
