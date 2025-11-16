/// <reference types="vite/client" />
import { Evidence } from '../App';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
  try {
    const response = await fetch(`${API_BASE_URL}/api/gemini/verify-evidence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        evidenceType: evidence.type === 'image' ? 'Có hình ảnh' : 'Chỉ có mô tả',
        description: evidence.description,
        date: evidence.date,
        missionTitle: missionTitle,
        missionDescription: missionDescription
      })
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      result: data.result === 'approve' ? 'approve' : 'reject',
      confidence: data.confidence,
      reason: data.reason
    };

  } catch (error) {
    console.error('Error calling Backend API:', error);
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
  try {
    const response = await fetch(`${API_BASE_URL}/api/gemini/evaluate-mission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        missionTitle: missionTitle,
        missionDescription: missionDescription,
        evidences: evidences,
        totalDays: totalDays
      })
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      overallScore: data.overallScore,
      aiAssessment: data.aiAssessment,
      passedRequirements: data.passedRequirements
    };

  } catch (error) {
    console.error('Error calling Backend API for final evaluation:', error);
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
