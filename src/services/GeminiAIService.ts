import { Evidence } from '../App';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export type AIVerificationResult = {
  result: 'approve' | 'reject';
  confidence: number; // 0-100
  reason: string;
};

export type AIFinalEvaluationResult = {
  overallScore: number; // 0-100
  aiAssessment: string;
  passedRequirements: boolean;
};

/**
 * Verify a single evidence using Gemini AI
 */
export async function verifyEvidenceWithAI(
  evidence: Evidence,
  missionTitle: string,
  missionDescription: string
): Promise<AIVerificationResult> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_api_key_here') {
    console.warn('Gemini API key not configured. Using simulated AI verification.');
    return simulateAIVerification(evidence);
  }

  try {
    const prompt = `Bạn là một AI chuyên đánh giá bằng chứng hoàn thành nhiệm vụ.

NHIỆM VỤ:
Tiêu đề: ${missionTitle}
Mô tả: ${missionDescription}

BẰNG CHỨNG CẦN ĐÁNH GIÁ:
- Loại: ${evidence.type === 'image' ? 'Có hình ảnh' : 'Chỉ có mô tả'}
- Mô tả: ${evidence.description}
- Ngày nộp: ${evidence.date}

YÊU CẦU:
1. Đánh giá bằng chứng này có phù hợp với nhiệm vụ không (approve hoặc reject)
2. Cho điểm độ tin cậy từ 0-100
3. Giải thích lý do ngắn gọn (1-2 câu)

Trả về JSON theo format:
{
  "result": "approve" hoặc "reject",
  "confidence": số từ 0-100,
  "reason": "lý do ngắn gọn"
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini');
    }

    // Extract JSON from response (might be wrapped in markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    return {
      result: result.result === 'approve' ? 'approve' : 'reject',
      confidence: Math.min(100, Math.max(0, result.confidence)),
      reason: result.reason || 'Không có lý do cụ thể'
    };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    console.warn('Falling back to simulated AI verification');
    return simulateAIVerification(evidence);
  }
}

/**
 * Evaluate all evidences for final mission completion using Gemini AI
 */
export async function evaluateMissionWithAI(
  missionTitle: string,
  missionDescription: string,
  evidences: Evidence[],
  totalDays: number
): Promise<AIFinalEvaluationResult> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_api_key_here') {
    console.warn('Gemini API key not configured. Using simulated evaluation.');
    return simulateFinalEvaluation(evidences);
  }

  try {
    const approvedEvidences = evidences.filter(e => e.status === 'approved');
    const evidenceSummary = approvedEvidences.map((e, idx) => 
      `${idx + 1}. [${e.date}] ${e.description} (AI confidence: ${e.aiVerification?.confidence || 0}%)`
    ).join('\n');

    const prompt = `Bạn là một AI chuyên đánh giá hoàn thành nhiệm vụ tự hoàn thiện.

NHIỆM VỤ:
Tiêu đề: ${missionTitle}
Mô tả: ${missionDescription}
Thời gian cam kết: ${totalDays} ngày

BẰNG CHỨNG ĐÃ ĐƯỢC DUYỆT (${approvedEvidences.length}/${evidences.length}):
${evidenceSummary || 'Không có bằng chứng nào được duyệt'}

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
{
  "overallScore": số từ 0-100,
  "aiAssessment": "nhận xét chi tiết 2-3 câu",
  "passedRequirements": true hoặc false
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 300,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini');
    }

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    return {
      overallScore: Math.min(100, Math.max(0, result.overallScore)),
      aiAssessment: result.aiAssessment || 'Không có nhận xét',
      passedRequirements: result.passedRequirements === true
    };

  } catch (error) {
    console.error('Error calling Gemini API for final evaluation:', error);
    console.warn('Falling back to simulated evaluation');
    return simulateFinalEvaluation(evidences);
  }
}

/**
 * Fallback: Simulated AI verification (when API is not configured)
 */
function simulateAIVerification(evidence: Evidence): AIVerificationResult {
  const hasImage = evidence.type === 'image' && evidence.url;
  const hasDescription = evidence.description.length > 20;
  const aiApproveChance = (hasImage ? 0.7 : 0.5) + (hasDescription ? 0.2 : 0);
  const aiApproves = Math.random() < aiApproveChance;

  return {
    result: aiApproves ? 'approve' : 'reject',
    confidence: Math.floor(60 + Math.random() * 35),
    reason: aiApproves 
      ? 'Bằng chứng có độ tin cậy cao. Phát hiện hoạt động phù hợp với mô tả nhiệm vụ.'
      : 'Bằng chứng chưa rõ ràng hoặc không khớp với yêu cầu nhiệm vụ.'
  };
}

/**
 * Fallback: Simulated final evaluation (when API is not configured)
 */
function simulateFinalEvaluation(evidences: Evidence[]): AIFinalEvaluationResult {
  const approvedEvidences = evidences.filter(e => e.status === 'approved');
  const totalEvidences = evidences.length;
  
  const approvalRate = totalEvidences > 0 ? (approvedEvidences.length / totalEvidences) * 100 : 0;
  const evidenceQualityScore = approvedEvidences.length > 0
    ? approvedEvidences.reduce((sum, e) => sum + (e.aiVerification?.confidence || 50), 0) / approvedEvidences.length
    : 0;

  const overallScore = (approvalRate * 0.5) + (evidenceQualityScore * 0.5);
  const passedRequirements = overallScore >= 70;

  return {
    overallScore: Math.round(overallScore),
    aiAssessment: passedRequirements
      ? `Xuất sắc! Bạn đã hoàn thành tốt nhiệm vụ với ${approvedEvidences.length}/${totalEvidences} bằng chứng được duyệt. Chất lượng trung bình: ${evidenceQualityScore.toFixed(1)}%.`
      : `Chưa đạt yêu cầu. Chỉ có ${approvedEvidences.length}/${totalEvidences} bằng chứng được duyệt (${approvalRate.toFixed(1)}%). Cần cải thiện chất lượng bằng chứng.`,
    passedRequirements
  };
}
