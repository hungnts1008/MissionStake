# 🎯 MissionStake - Quick Start (Đơn giản nhất)

## ✅ Đã setup xong:

1. ✅ SpoonOS Backend structure
2. ✅ Xóa Hardhat/Sepolia cũ
3. ✅ Script tự động setup
4. ✅ Ready cho NEO TestNet

---

## 🚀 Cách chạy (3 bước)

### Bước 1: Setup Backend (Chỉ làm 1 lần)

**Cách 1: Dùng script tự động** (Đơn giản nhất)
```powershell
.\setup-backend.bat
```

**Cách 2: Manual**
```powershell
cd spoonos-backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

### Bước 2: Lấy Gemini API Key (FREE)

1. Vào: https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy key
4. Mở file `spoonos-backend\.env`
5. Dán vào dòng: `GEMINI_API_KEY=your-key-here`

### Bước 3: Chạy ứng dụng

**Option 1: Chạy Backend và Frontend riêng**

Terminal 1 - Backend:
```powershell
.\start-backend.bat
```

Terminal 2 - Frontend:
```powershell
npm run dev
```

**Option 2: Chạy cả 2 cùng lúc** (Cần cài thêm)
```powershell
npm install -g concurrently
npm run fullstack
```

---

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🔗 NEO TestNet Setup (Làm sau)

### 1. Install NeoLine Wallet
- Vào: https://neoline.io/
- Install Chrome extension
- Tạo wallet mới
- Chuyển sang **TestNet** trong settings

### 2. Lấy TestNet GAS (miễn phí)
- Copy địa chỉ wallet
- Vào: https://neowish.ngd.network/
- Claim TestNet GAS

---

## 📝 Checklist

- [ ] Python 3.11+ đã cài
- [ ] Đã chạy `setup-backend.bat`
- [ ] Đã có Gemini API Key
- [ ] Đã điền key vào `.env`
- [ ] Backend chạy được (http://localhost:8000)
- [ ] Frontend chạy được (http://localhost:5173)
- [ ] NeoLine wallet đã cài (cho NEO)
- [ ] Có TestNet GAS

---

## ❓ Lỗi thường gặp

### Backend không chạy?
```powershell
# Check Python version
python --version  # Cần >= 3.11

# Reinstall dependencies
cd spoonos-backend
.\venv\Scripts\activate
pip install --upgrade -r requirements.txt
```

### Port 8000 đang dùng?
```powershell
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend không connect được backend?
- Kiểm tra backend đang chạy: http://localhost:8000/health
- Check CORS trong `spoonos-backend/main.py`

---

## 📚 Files quan trọng

- `SETUP_GUIDE.md` - Chi tiết setup từng bước
- `NEO_SPOONOS_ARCHITECTURE.md` - Kiến trúc đầy đủ
- `spoonos-backend/README.md` - Backend docs
- `setup-backend.bat` - Script tự động setup
- `start-backend.bat` - Script chạy backend

---

## 🎯 Next Steps

1. ✅ Backend API đang chạy
2. ⏳ Test AI endpoints tại `/docs`
3. ⏳ Connect Frontend với Backend
4. ⏳ Deploy NEO Smart Contracts
5. ⏳ Test end-to-end với NEO TestNet

---

**Cần help?** Đọc `SETUP_GUIDE.md` hoặc check code trong `spoonos-backend/`
