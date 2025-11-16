"""
MissionStake SpoonOS Backend
Simple FastAPI server với AI agents và NEO blockchain
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from neo_service import neo_service
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Initialize FastAPI
app = FastAPI(
    title="MissionStake AI API",
    description="SpoonOS-powered AI backend for MissionStake",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== Models ==========
class TaskSuggestionRequest(BaseModel):
    userId: str
    category: Optional[str] = "all"
    difficulty: Optional[str] = None
    maxResults: int = 20

class SuggestedTask(BaseModel):
    id: str
    title: str
    description: str
    category: str
    difficulty: str
    estimatedTime: int
    points: int
    matchScore: int

class PersonalizedMissionRequest(BaseModel):
    userId: str
    preferences: dict

class Mission(BaseModel):
    id: str
    title: str
    description: str
    category: str
    difficulty: str
    estimatedTime: int
    rewards: dict
    tags: List[str]
    reasoning: str

class EvidenceVerificationRequest(BaseModel):
    evidenceType: str
    description: str
    date: str
    missionTitle: str
    missionDescription: str

class EvidenceVerificationResponse(BaseModel):
    result: str  # 'approve' or 'reject'
    confidence: int
    reason: str

class MissionEvaluationRequest(BaseModel):
    missionTitle: str
    missionDescription: str
    evidences: List[dict]
    totalDays: int

class MissionEvaluationResponse(BaseModel):
    overallScore: int
    aiAssessment: str
    passedRequirements: bool

# ========== Health Check ==========
@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "MissionStake AI Backend",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "spoonos": "ready",
        "neo": "connected"
    }

# ========== AI Endpoints ==========
@app.post("/api/ai/suggest-tasks", response_model=List[SuggestedTask])
async def suggest_tasks(request: TaskSuggestionRequest):
    """
    Gợi ý nhiệm vụ dựa trên AI
    """
    try:
        # TODO: Implement SpoonOS TaskSuggestionAgent
        # Temporary mock response
        tasks = [
            {
                "id": f"task_{i}",
                "title": f"Nhiệm vụ mẫu {i}",
                "description": "Đây là nhiệm vụ được tạo bởi AI",
                "category": request.category if request.category != "all" else "thể thao",
                "difficulty": request.difficulty or "intermediate",
                "estimatedTime": 30,
                "points": 100,
                "matchScore": 85
            }
            for i in range(min(5, request.maxResults))
        ]
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/generate-missions", response_model=List[Mission])
async def generate_personalized_missions(request: PersonalizedMissionRequest):
    """
    Tạo nhiệm vụ cá nhân hóa bằng AI
    """
    try:
        # TODO: Implement SpoonOS PersonalizedMissionAgent
        missions = [
            {
                "id": f"mission_{i}",
                "title": f"Nhiệm vụ cá nhân hóa {i}",
                "description": "Nhiệm vụ được tạo riêng cho bạn dựa trên sở thích",
                "category": "học tập",
                "difficulty": "medium",
                "estimatedTime": 45,
                "rewards": {"xp": 150, "coins": 500},
                "tags": ["AI-generated", "personalized"],
                "reasoning": "Nhiệm vụ này phù hợp với bạn vì..."
            }
            for i in range(3)
        ]
        return missions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== Gemini AI Endpoints ==========
@app.post("/api/gemini/verify-evidence", response_model=EvidenceVerificationResponse)
async def verify_evidence(request: EvidenceVerificationRequest):
    """
    Xác minh bằng chứng hoàn thành nhiệm vụ bằng Gemini AI
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash-lite')
        
        prompt = f"""Bạn là một AI chuyên đánh giá bằng chứng hoàn thành nhiệm vụ.

NHIỆM VỤ:
Tiêu đề: {request.missionTitle}
Mô tả: {request.missionDescription}

BẰNG CHỨNG CẦN ĐÁNH GIÁ:
- Loại: {request.evidenceType}
- Mô tả: {request.description}
- Ngày nộp: {request.date}

YÊU CẦU:
1. Đánh giá bằng chứng này có phù hợp với nhiệm vụ không (approve hoặc reject)
2. Cho điểm độ tin cậy từ 0-100
3. Giải thích lý do ngắn gọn (1-2 câu)

Trả về JSON theo format:
{{
  "result": "approve" hoặc "reject",
  "confidence": số từ 0-100,
  "reason": "lý do ngắn gọn"
}}"""

        response = model.generate_content(prompt)
        text = response.text
        
        # Extract JSON from response
        import json
        import re
        json_match = re.search(r'\{[\s\S]*\}', text)
        if not json_match:
            raise ValueError("Invalid JSON response from AI")
        
        result = json.loads(json_match.group(0))
        
        return EvidenceVerificationResponse(
            result=result.get("result", "reject"),
            confidence=min(100, max(0, result.get("confidence", 0))),
            reason=result.get("reason", "Không có lý do cụ thể")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini API: {str(e)}")

@app.post("/api/gemini/evaluate-mission", response_model=MissionEvaluationResponse)
async def evaluate_mission(request: MissionEvaluationRequest):
    """
    Đánh giá tổng thể hoàn thành nhiệm vụ bằng Gemini AI
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash-lite')
        
        approved_evidences = [e for e in request.evidences if e.get("status") == "approved"]
        evidence_summary = "\n".join([
            f"{i+1}. [{e.get('date')}] {e.get('description')} (AI confidence: {e.get('aiVerification', {}).get('confidence', 0)}%)"
            for i, e in enumerate(approved_evidences)
        ])
        
        prompt = f"""Bạn là một AI chuyên đánh giá hoàn thành nhiệm vụ tự hoàn thiện.

NHIỆM VỤ:
Tiêu đề: {request.missionTitle}
Mô tả: {request.missionDescription}
Thời gian cam kết: {request.totalDays} ngày

BẰNG CHỨNG ĐÃ ĐƯỢC DUYỆT ({len(approved_evidences)}/{len(request.evidences)}):
{evidence_summary or 'Không có bằng chứng nào được duyệt'}

YÊU CẦU:
1. Đánh giá tổng thể mức độ hoàn thành nhiệm vụ (điểm 0-100)
2. Nhận xét chi tiết về chất lượng thực hiện
3. Quyết định PASS (≥70 điểm) hay FAIL (<70 điểm)

Tiêu chí chấm điểm:
- Số lượng bằng chứng so với thời gian cam kết
- Chất lượng bằng chứng (độ tin cậy AI)
- Tính nhất quán và kiên trì
- Mức độ đạt mục tiêu ban đầu

Trả về JSON theo format:
{{
  "overallScore": số từ 0-100,
  "aiAssessment": "nhận xét chi tiết 2-3 câu",
  "passedRequirements": true hoặc false
}}"""

        response = model.generate_content(prompt)
        text = response.text
        
        # Extract JSON from response
        import json
        import re
        json_match = re.search(r'\{[\s\S]*\}', text)
        if not json_match:
            raise ValueError("Invalid JSON response from AI")
        
        result = json.loads(json_match.group(0))
        
        return MissionEvaluationResponse(
            overallScore=min(100, max(0, result.get("overallScore", 0))),
            aiAssessment=result.get("aiAssessment", "Không có nhận xét"),
            passedRequirements=result.get("passedRequirements", False)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini API: {str(e)}")

# ========== NEO Endpoints ==========
@app.get("/api/neo/status")
async def neo_status():
    """
    Kiểm tra kết nối NEO blockchain
    """
    try:
        status = neo_service.get_blockchain_status()
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NEO connection error: {str(e)}")

@app.post("/api/neo/create-mission")
async def create_mission_on_neo(mission_data: dict):
    """
    Tạo mission trên NEO blockchain
    """
    try:
        # Extract data from request
        creator = mission_data.get("creator", "default_creator")
        title = mission_data.get("title")
        description = mission_data.get("description")
        reward_amount = mission_data.get("reward_amount", 10)
        deadline = mission_data.get("deadline", 86400)  # Default 1 day
        category = mission_data.get("category", "general")
        
        # Validate required fields
        if not title or not description:
            raise HTTPException(status_code=400, detail="Title and description are required")
        
        # Create mission on NEO
        result = neo_service.create_mission(
            creator=creator,
            title=title,
            description=description,
            reward_amount=reward_amount,
            deadline=deadline,
            category=category
        )
        
        return {
            "success": True,
            "missionId": result["mission_id"],
            "txHash": result["tx_hash"],
            "data": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create mission: {str(e)}")

@app.get("/api/missions/count")
async def get_mission_count():
    """
    Lấy tổng số missions
    """
    try:
        count = neo_service.get_mission_count()
        return {"count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/missions/{mission_id}")
async def get_mission(mission_id: int):
    """
    Lấy thông tin chi tiết của mission
    """
    try:
        mission = neo_service.get_mission(mission_id)
        if not mission:
            raise HTTPException(status_code=404, detail="Mission not found")
        return mission
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/missions/{mission_id}/accept")
async def accept_mission(mission_id: int, data: dict):
    """
    Nhận nhiệm vụ
    """
    try:
        user = data.get("user")
        if not user:
            raise HTTPException(status_code=400, detail="User address is required")
        
        result = neo_service.accept_mission(mission_id, user)
        return {
            "success": result["success"],
            "txHash": result.get("tx_hash"),
            "message": result.get("message", "Mission accepted")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/missions/{mission_id}/complete")
async def complete_mission(mission_id: int, data: dict):
    """
    Hoàn thành nhiệm vụ với bằng chứng
    """
    try:
        user = data.get("user")
        proof = data.get("proof", "")
        
        if not user:
            raise HTTPException(status_code=400, detail="User address is required")
        
        result = neo_service.complete_mission(mission_id, user, proof)
        return {
            "success": result["success"],
            "txHash": result.get("tx_hash"),
            "message": result.get("message", "Mission completed, awaiting verification")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/missions/{mission_id}/verify")
async def verify_mission(mission_id: int, data: dict):
    """
    Xác minh nhiệm vụ (chỉ creator hoặc verifier)
    """
    try:
        verifier = data.get("verifier")
        approved = data.get("approved", True)
        
        if not verifier:
            raise HTTPException(status_code=400, detail="Verifier address is required")
        
        result = neo_service.verify_mission(mission_id, verifier, approved)
        return {
            "success": result["success"],
            "txHash": result.get("tx_hash"),
            "rewardDistributed": result.get("reward_distributed", False),
            "message": result.get("message", "Mission verified")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/missions/user/{user_address}")
async def get_user_missions(user_address: str):
    """
    Lấy danh sách missions của user
    """
    try:
        mission_ids = neo_service.get_user_missions(user_address)
        
        # Get details for each mission
        missions = []
        for mission_id in mission_ids:
            mission = neo_service.get_mission(mission_id)
            if mission:
                missions.append(mission)
        
        return {
            "user": user_address,
            "missionIds": mission_ids,
            "missions": missions,
            "count": len(mission_ids)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== Run Server ==========
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
