# 🎯 MissionStake - AI-Powered Task Management on NEO Blockchain

Ứng dụng quản lý nhiệm vụ với AI (SpoonOS) và NEO Blockchain.

## ✨ Features

- 🤖 **AI Task Suggestions** - SpoonOS-powered recommendations
- 🔗 **NEO Blockchain** - Smart contracts on NEO N3 TestNet
- 💰 **Reputation System** - NEP-17 token rewards
- 🎯 **Prediction Market** - Bet on mission outcomes
- 📊 **Leaderboard** - Compete with community
- 🎨 **Modern UI** - React + TypeScript + Tailwind

## 🚀 Quick Start

### **Bước 1: Setup Backend**
```powershell
.\setup-backend.bat
```

### **Bước 2: Get Gemini API Key (FREE)**
1. Vào: https://aistudio.google.com/apikey
2. Tạo API Key
3. Paste vào `spoonos-backend\.env`

### **Bước 3: Run Application**

Terminal 1 - Backend:
```powershell
.\start-backend.bat
```

Terminal 2 - Frontend:
```powershell
npm install
npm run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📚 Documentation

- **[START_HERE.md](START_HERE.md)** - Bắt đầu ngay (3 bước)
- **[QUICKSTART.md](QUICKSTART.md)** - Hướng dẫn nhanh
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Chi tiết setup
- **[NEO_SPOONOS_ARCHITECTURE.md](NEO_SPOONOS_ARCHITECTURE.md)** - Kiến trúc đầy đủ
- **[spoonos-backend/README.md](spoonos-backend/README.md)** - Backend docs

## 🔗 NEO Blockchain Setup

1. Install **NeoLine Wallet**: https://neoline.io/
2. Switch to **TestNet** in settings
3. Get free TestNet GAS: https://neowish.ngd.network/

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Lucide Icons

### Backend (SpoonOS)
- FastAPI (Python)
- SpoonOS Core Framework
- Multiple LLM providers (Gemini, OpenAI, Claude)
- NEO blockchain integration

### Blockchain
- NEO N3 TestNet
- Smart Contracts (C#)
- NEP-17 Token Standard

## 📦 Project Structure

```
Task Management App/
├── src/                      # Frontend source
│   ├── components/          # React components
│   ├── services/            # API services
│   └── types/               # TypeScript types
├── spoonos-backend/         # SpoonOS AI backend
│   ├── main.py             # FastAPI server
│   ├── config.json         # SpoonOS config
│   └── requirements.txt    # Python deps
├── setup-backend.bat        # Auto setup script
├── start-backend.bat        # Start backend
└── docs/                    # Documentation

```

## 🎯 Current Status

✅ Frontend - Complete  
✅ SpoonOS Backend - Structure ready  
🔄 AI Agents - In progress  
⏳ NEO Smart Contracts - Pending deployment  

## 📝 Next Steps

1. ✅ Setup backend (`.\setup-backend.bat`)
2. ✅ Get Gemini API key
3. 🔄 Test AI endpoints
4. ⏳ Deploy NEO contracts
5. ⏳ Connect frontend to blockchain

## 💡 Help & Support

**Quick Issues:**
- Backend không chạy? → Check Python 3.11+
- Port 8000 bị chiếm? → Kill process: `netstat -ano | findstr :8000`
- Frontend lỗi? → `npm install` lại

**More Help:**
- Check `START_HERE.md` cho hướng dẫn nhanh
- Xem `SETUP_GUIDE.md` cho troubleshooting
- Review code trong `spoonos-backend/`

## 📄 License

MIT License - See LICENSE file for details

---

**🚀 Ready to start?** Run `.\setup-backend.bat` now!
  