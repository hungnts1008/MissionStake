# 🚀 Quick Setup Guide - MissionStake (SpoonOS + NEO)

## Bước 1: Setup SpoonOS Backend

### 1.1. Cài đặt Python Dependencies

```powershell
cd spoonos-backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 1.2. Tạo file .env

```powershell
copy .env.example .env
```

Mở `.env` và điền:
```bash
GEMINI_API_KEY=your-gemini-key-here
```

**Lấy Gemini API Key FREE tại**: https://aistudio.google.com/apikey

### 1.3. Chạy Backend

```powershell
python main.py
```

✅ Backend chạy tại: http://localhost:8000  
✅ API Docs: http://localhost:8000/docs

---

## Bước 2: Setup NEO Wallet (TestNet)

### 2.1. Install NeoLine Wallet

1. Vào: https://neoline.io/
2. Download extension cho Chrome/Edge
3. Cài đặt và tạo wallet mới
4. **Chọn TestNet** trong settings

### 2.2. Lấy TestNet GAS (miễn phí)

1. Copy địa chỉ wallet của bạn từ NeoLine
2. Vào: https://neowish.ngd.network/
3. Paste địa chỉ và claim TestNet GAS
4. Đợi vài phút để nhận GAS

---

## Bước 3: Chạy Frontend

```powershell
npm run dev
```

Frontend: http://localhost:5173

---

## ✅ Kiểm tra Setup

### Backend Health Check
```powershell
curl http://localhost:8000/health
```

Kết quả mong đợi:
```json
{
  "status": "healthy",
  "spoonos": "ready",
  "neo": "connected"
}
```

### Test AI Endpoint
Mở: http://localhost:8000/docs
- Thử endpoint `/api/ai/suggest-tasks`

---

## 🔧 Troubleshooting

### Backend không chạy được?
```powershell
# Check Python version (cần 3.11+)
python --version

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Frontend không connect được backend?
- Kiểm tra backend đang chạy tại port 8000
- Kiểm tra CORS settings trong `main.py`

---

## 📚 Next Steps

1. ✅ Backend API đang chạy
2. ⏳ Implement SpoonOS Agents
3. ⏳ Deploy NEO Smart Contracts
4. ⏳ Connect Frontend với Backend
5. ⏳ Test end-to-end

---

**Questions?** Check `spoonos-backend/README.md` hoặc `NEO_SPOONOS_ARCHITECTURE.md`
