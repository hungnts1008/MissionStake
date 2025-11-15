# MissionStake SpoonOS Backend

Backend đơn giản sử dụng SpoonOS và NEO blockchain.

## 🚀 Cài đặt

### 1. Tạo Python Virtual Environment

```bash
cd spoonos-backend
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```powershell
.\venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Setup Environment Variables

Copy file `.env.example` thành `.env`:
```bash
copy .env.example .env
```

Điền thông tin vào `.env`:
- `GEMINI_API_KEY`: Lấy từ https://aistudio.google.com/apikey (FREE)
- `OPENAI_API_KEY`: (Optional) Từ OpenAI
- `ANTHROPIC_API_KEY`: (Optional) Từ Anthropic

### 5. Chạy Server

```bash
python main.py
```

Server sẽ chạy tại: http://localhost:8000

## 📝 API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /api/ai/suggest-tasks` - AI task suggestions
- `POST /api/ai/generate-missions` - Personalized missions
- `GET /api/neo/status` - NEO blockchain status
- `POST /api/neo/create-mission` - Create mission on NEO

## 🧪 Test API

Mở browser: http://localhost:8000/docs (Swagger UI)

## 📚 Next Steps

1. ✅ Setup SpoonOS
2. ⏳ Implement AI Agents
3. ⏳ Setup NEO blockchain
4. ⏳ Connect Frontend
