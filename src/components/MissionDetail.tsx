import { useState, useRef, useEffect } from 'react';
import { User, Page, Mission, Evidence, EvidenceVote } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  Coins,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Clock,
  Share2,
  Heart,
  MessageCircle,
  Trophy,
  Target,
  TrendingUp
} from 'lucide-react';
import { verifyEvidenceWithAI, evaluateMissionWithAI } from '../services/GeminiAIService';

type MissionDetailProps = {
  missionId: string;
  user: User;
  onNavigate: (page: Page) => void;
  setUser: (user: User) => void;
  missions: Mission[];
  previousPage: Page;
  onUpdateMission: (missionId: string, updates: Partial<Mission>) => void;
};

export function MissionDetail({ missionId, user, onNavigate, setUser, missions, previousPage, onUpdateMission }: MissionDetailProps) {
  const mission = missions.find(m => m.id === missionId);
  const [evidenceDescription, setEvidenceDescription] = useState('');
  const [showEvidenceDialog, setShowEvidenceDialog] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate AI verification after 2 seconds when new evidence is submitted
  useEffect(() => {
    if (!mission) return;
    
    const pendingEvidences = mission.evidences.filter(e => e.status === 'pending' && !e.aiVerification);
    if (pendingEvidences.length > 0) {
      const timer = setTimeout(() => {
        pendingEvidences.forEach(evidence => {
          runAIVerification(evidence.id);
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mission?.evidences]);

  // Auto-add 5 community votes for testing purposes
  useEffect(() => {
    if (!mission) return;
    
    const evidencesNeedingVotes = mission.evidences.filter(e => 
      e.aiVerification && 
      !e.finalVerdict && 
      e.userVotes.length < 5
    );
    
    if (evidencesNeedingVotes.length > 0) {
      const timer = setTimeout(() => {
        evidencesNeedingVotes.forEach(evidence => {
          // Add 5 auto votes (4 approve, 1 reject for testing)
          const autoVotes: EvidenceVote[] = [
            { userId: 'auto-1', userName: 'User Test 1', vote: 'approve', timestamp: new Date().toLocaleString('vi-VN') },
            { userId: 'auto-2', userName: 'User Test 2', vote: 'approve', timestamp: new Date().toLocaleString('vi-VN') },
            { userId: 'auto-3', userName: 'User Test 3', vote: 'approve', timestamp: new Date().toLocaleString('vi-VN') },
            { userId: 'auto-4', userName: 'User Test 4', vote: 'approve', timestamp: new Date().toLocaleString('vi-VN') },
            { userId: 'auto-5', userName: 'User Test 5', vote: 'reject', timestamp: new Date().toLocaleString('vi-VN') }
          ];

          const updatedEvidence = {
            ...evidence,
            userVotes: [...evidence.userVotes, ...autoVotes]
          };

          const updatedEvidences = mission.evidences.map(e =>
            e.id === evidence.id ? updatedEvidence : e
          );

          onUpdateMission(missionId, { evidences: updatedEvidences });
          
          // Finalize immediately with the updated evidence data
          setTimeout(() => {
            // Calculate final result directly here
            const MIN_VOTES = 5;
            if (updatedEvidence.userVotes.length >= MIN_VOTES && updatedEvidence.aiVerification) {
              const aiScore = updatedEvidence.aiVerification.result === 'approve' ? 60 : 0;
              const userApproves = updatedEvidence.userVotes.filter(v => v.vote === 'approve').length;
              const userRejects = updatedEvidence.userVotes.filter(v => v.vote === 'reject').length;
              const userScore = (userApproves / (userApproves + userRejects)) * 40;
              
              const totalScore = aiScore + userScore;
              const finalResult = totalScore >= 50 ? 'approved' as const : 'rejected' as const;

              const finalVerdict = {
                result: finalResult,
                aiWeight: aiScore,
                userWeight: userScore,
                penalizedUsers: [],
                timestamp: new Date().toLocaleString('vi-VN')
              };

              const finalizedEvidences = updatedEvidences.map(e =>
                e.id === evidence.id 
                  ? { ...e, status: finalResult, finalVerdict }
                  : e
              );

              onUpdateMission(missionId, { evidences: finalizedEvidences });
            }
          }, 500);
        });
      }, 3000); // 3 seconds after AI verification
      return () => clearTimeout(timer);
    }
  }, [mission?.evidences]);

  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="mb-2">Không tìm thấy nhiệm vụ</h3>
          <Button onClick={() => onNavigate(previousPage || 'dashboard')}>
            Quay lại danh sách
          </Button>
        </Card>
      </div>
    );
  }

  const isOwner = mission.userId === user.id;
  const daysRemaining = 10; // Mock calculation
  const totalDays = 30; // Mock calculation

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file upload with URL.createObjectURL
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setUploadedFileName(file.name);
    }
  };

  // AI Verification (60% weight) - Using real Gemini API
  const runAIVerification = async (evidenceId: string) => {
    const evidence = mission?.evidences.find(e => e.id === evidenceId);
    if (!evidence || evidence.aiVerification) return;

    try {
      // Call real AI API
      const aiResult = await verifyEvidenceWithAI(
        evidence,
        mission?.title || '',
        mission?.description || ''
      );

      const aiVerification = {
        result: aiResult.result,
        confidence: aiResult.confidence,
        reason: aiResult.reason,
        timestamp: new Date().toLocaleString('vi-VN')
      };

      // Update evidence with AI verification
      const updatedEvidences = (mission?.evidences || []).map(e =>
        e.id === evidenceId ? { ...e, aiVerification } : e
      );

      onUpdateMission(missionId, { evidences: updatedEvidences });
      
      // Check if we should finalize (need 3+ user votes)
      checkAndFinalizeEvidence(evidenceId);
    } catch (error) {
      console.error('AI verification failed:', error);
      alert('⚠️ Lỗi khi gọi AI. Vui lòng thử lại sau.');
    }
  };

  // User voting
  const handleUserVote = (evidenceId: string, vote: 'approve' | 'reject') => {
    const evidence = mission?.evidences.find(e => e.id === evidenceId);
    if (!evidence) return;

    // Check if user already voted
    if (evidence.userVotes.some(v => v.userId === user.id)) {
      alert('Bạn đã vote cho bằng chứng này rồi!');
      return;
    }

    const newVote: EvidenceVote = {
      userId: user.id,
      userName: user.name,
      vote,
      timestamp: new Date().toLocaleString('vi-VN')
    };

    const updatedEvidences = (mission?.evidences || []).map(e =>
      e.id === evidenceId 
        ? { ...e, userVotes: [...e.userVotes, newVote] }
        : e
    );

    onUpdateMission(missionId, { evidences: updatedEvidences });
    setShowVerificationDialog(false);

    alert(`✅ Vote của bạn đã được ghi nhận!\n\n${vote === 'approve' ? '👍 Bạn đã chấp nhận' : '👎 Bạn đã từ chối'} bằng chứng này.`);

    // Check if we have enough votes to finalize
    setTimeout(() => checkAndFinalizeEvidence(evidenceId), 500);
  };

  // Finalize evidence based on AI (60%) + User votes (40%) - but DON'T update mission progress
  const checkAndFinalizeEvidence = (evidenceId: string) => {
    const evidence = mission?.evidences.find(e => e.id === evidenceId);
    if (!evidence || !evidence.aiVerification || evidence.finalVerdict) return;

    // Need at least 5 user votes to finalize (changed from 3 for testing)
    const MIN_VOTES = 5;
    if (evidence.userVotes.length < MIN_VOTES) return;

    // Calculate weights
    const aiScore = evidence.aiVerification.result === 'approve' ? 60 : 0;
    const userApproves = evidence.userVotes.filter(v => v.vote === 'approve').length;
    const userRejects = evidence.userVotes.filter(v => v.vote === 'reject').length;
    const userScore = (userApproves / (userApproves + userRejects)) * 40;
    
    const totalScore = aiScore + userScore;
    const finalResult = totalScore >= 50 ? 'approved' as const : 'rejected' as const;

    // Find users who voted incorrectly
    const penalizedUsers = evidence.userVotes
      .filter(v => v.vote !== (finalResult === 'approved' ? 'approve' : 'reject'))
      .map(v => v.userId);

    const finalVerdict = {
      result: finalResult,
      aiWeight: aiScore,
      userWeight: userScore,
      penalizedUsers,
      timestamp: new Date().toLocaleString('vi-VN')
    };

    // Apply penalties and rewards
    penalizedUsers.forEach(userId => {
      if (userId === user.id) {
        const penalty = 50; // 50 coins penalty
        setUser({
          ...user,
          coins: user.coins - penalty,
          verificationStats: {
            totalVotes: (user.verificationStats?.totalVotes || 0) + 1,
            correctVotes: user.verificationStats?.correctVotes || 0,
            accuracy: ((user.verificationStats?.correctVotes || 0) / ((user.verificationStats?.totalVotes || 0) + 1)) * 100
          }
        });
        alert(`❌ Bạn đã vote sai!\n\n💸 Bị phạt ${penalty} coins\n📊 Độ chính xác vote: ${user.verificationStats?.accuracy.toFixed(1) || 0}%`);
      }
    });

    // Reward correct voters
    const correctVoterIds = evidence.userVotes
      .filter(v => v.vote === (finalResult === 'approved' ? 'approve' : 'reject'))
      .map(v => v.userId);
    
    if (correctVoterIds.includes(user.id)) {
      const reward = 20; // 20 coins reward
      setUser({
        ...user,
        coins: user.coins + reward,
        verificationStats: {
          totalVotes: (user.verificationStats?.totalVotes || 0) + 1,
          correctVotes: (user.verificationStats?.correctVotes || 0) + 1,
          accuracy: (((user.verificationStats?.correctVotes || 0) + 1) / ((user.verificationStats?.totalVotes || 0) + 1)) * 100
        }
      });
    }

    // Update evidence status only - DON'T update mission progress yet
    const updatedEvidences = (mission?.evidences || []).map(e =>
      e.id === evidenceId 
        ? { ...e, status: finalResult, finalVerdict }
        : e
    );

    onUpdateMission(missionId, {
      evidences: updatedEvidences
    });
  };

  const handleSubmitEvidence = () => {
    if (!evidenceDescription.trim() && !uploadedImage) {
      alert('Vui lòng thêm mô tả hoặc tải lên ảnh bằng chứng!');
      return;
    }

    // Create new evidence with pending status
    const newEvidence: Evidence = {
      id: `ev-${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
      type: uploadedImage ? 'image' : 'text',
      url: uploadedImage || undefined,
      description: evidenceDescription,
      status: 'pending',
      userVotes: []
    };

    // Add evidence to mission (AI will verify in 2 seconds via useEffect)
    const updatedEvidences = [...(mission?.evidences || []), newEvidence];
    
    onUpdateMission(missionId, {
      evidences: updatedEvidences
    });
    
    alert(`📤 Bằng chứng đã được nộp!\n\n⏳ Đang chờ AI xác thực (60%)\n👥 Tự động thêm 5 votes test (40%)\n\n💡 Bạn có thể tiếp tục nộp thêm bằng chứng.\n🎯 Khi xong hết, hãy bấm "Nộp để chấm điểm" để AI đánh giá tổng thể.`);
    
    // Reset form
    setShowEvidenceDialog(false);
    setEvidenceDescription('');
    setUploadedImage(null);
    setUploadedFileName('');
  };

  // Submit mission for final AI evaluation
  const handleSubmitForReview = async () => {
    if (!mission || mission.evidences.length === 0) {
      alert('⚠️ Bạn cần nộp ít nhất 1 bằng chứng trước khi submit!');
      return;
    }

    // Count approved evidences
    const approvedEvidences = mission.evidences.filter(e => e.status === 'approved');
    
    if (approvedEvidences.length === 0) {
      alert('⚠️ Chưa có bằng chứng nào được duyệt! Vui lòng chờ cộng đồng vote.');
      return;
    }

    try {
      // Show loading state
      alert('⏳ Đang gọi AI để đánh giá tổng thể... Vui lòng đợi.');

      // Call real AI for final evaluation
      const totalDays = 30; // Calculate from startDate - endDate
      const aiEvaluation = await evaluateMissionWithAI(
        mission.title,
        mission.description,
        mission.evidences,
        totalDays
      );

      const finalEvaluation = {
        overallScore: aiEvaluation.overallScore,
        aiAssessment: aiEvaluation.aiAssessment,
        passedRequirements: aiEvaluation.passedRequirements,
        evaluationDate: new Date().toLocaleString('vi-VN')
      };

      if (aiEvaluation.passedRequirements) {
        // Mission passed - award coins
        const reward = mission.stake * 2;
        setUser({
          ...user,
          coins: user.coins + reward,
          reputation: user.reputation + 50
        });

        onUpdateMission(missionId, {
          status: 'completed',
          progress: 100,
          submittedForReview: true,
          finalEvaluation
        });

        alert(`🎉 Chúc mừng! Nhiệm vụ hoàn thành!\n\n📊 Điểm tổng thể: ${aiEvaluation.overallScore}/100\n✅ ${approvedEvidences.length}/${mission.evidences.length} bằng chứng được duyệt\n\n💰 Bạn nhận được ${reward} coins\n🏅 +50 uy tín\n\n🤖 ${finalEvaluation.aiAssessment}`);
      } else {
        // Mission failed
        onUpdateMission(missionId, {
          status: 'failed',
          progress: aiEvaluation.overallScore,
          submittedForReview: true,
          finalEvaluation
        });

        alert(`😔 Rất tiếc! Nhiệm vụ chưa đạt yêu cầu.\n\n📊 Điểm tổng thể: ${aiEvaluation.overallScore}/100 (cần ≥70)\n❌ Chỉ có ${approvedEvidences.length}/${mission.evidences.length} bằng chứng được duyệt\n\n💸 Mất ${mission.stake} coins đã đặt cược\n\n🤖 ${finalEvaluation.aiAssessment}`);
      }
    } catch (error) {
      console.error('AI evaluation failed:', error);
      alert('⚠️ Lỗi khi gọi AI đánh giá. Vui lòng thử lại sau.');
    }
  };

  const handleShare = () => {
    alert('Đã chia sẻ lên mạng xã hội!');
  };

  const comments = [
    {
      id: '1',
      userName: 'Nguyễn Văn B',
      userAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400',
      text: 'Chúc bạn thành công! Tôi cũng đang làm tương tự 💪',
      time: '2 giờ trước'
    },
    {
      id: '2',
      userName: 'Trần Thị C',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      text: 'Hay quá! Tôi sẽ ủng hộ bạn',
      time: '5 giờ trước'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate(previousPage || 'dashboard')}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex-1">
              <h2>Chi tiết nhiệm vụ</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="size-4" />
              </Button>
              {isOwner && mission.status === 'active' && (
                <>
                  <Dialog open={showEvidenceDialog} onOpenChange={setShowEvidenceDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                        <Upload className="size-4 mr-2" />
                        Nộp bằng chứng
                      </Button>
                    </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nộp bằng chứng hoàn thành</DialogTitle>
                      <DialogDescription>
                        Tải lên ảnh hoặc mô tả hoạt động của bạn hôm nay
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div 
                        className="border-2 border-dashed rounded-lg p-8 text-center hover:border-indigo-400 cursor-pointer transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadedImage ? (
                          <div className="space-y-3">
                            <img 
                              src={uploadedImage} 
                              alt="Preview" 
                              className="max-h-48 mx-auto rounded-lg object-cover"
                            />
                            <p className="text-sm text-gray-600">{uploadedFileName}</p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedImage(null);
                                setUploadedFileName('');
                              }}
                            >
                              Thay ảnh khác
                            </Button>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="size-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm text-gray-600">Click để tải ảnh lên</p>
                            <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF (Max 5MB)</p>
                          </>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm">Mô tả</label>
                        <Textarea
                          placeholder="Mô tả chi tiết về hoạt động của bạn..."
                          value={evidenceDescription}
                          onChange={(e) => setEvidenceDescription(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowEvidenceDialog(false)}
                        >
                          Hủy
                        </Button>
                        <Button 
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                          onClick={handleSubmitEvidence}
                        >
                          Gửi bằng chứng
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {/* Submit for Review Button */}
                {mission.evidences.length > 0 && !mission.submittedForReview && (
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={handleSubmitForReview}
                  >
                    <CheckCircle className="size-4 mr-2" />
                    Nộp để chấm điểm
                  </Button>
                )}
              </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mission Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2">
                    <Badge className={mission.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                      {mission.difficulty === 'easy' && 'Dễ'}
                      {mission.difficulty === 'medium' && 'Trung bình'}
                      {mission.difficulty === 'hard' && 'Khó'}
                    </Badge>
                    <Badge variant="outline">{mission.category}</Badge>
                  </div>
                  <Badge className={mission.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                    {mission.status === 'active' && 'Đang hoạt động'}
                    {mission.status === 'completed' && 'Hoàn thành'}
                  </Badge>
                </div>

                <CardTitle className="text-2xl">{mission.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {mission.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Creator */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Avatar>
                    <AvatarImage src={mission.userAvatar} alt={mission.userName} />
                    <AvatarFallback>{mission.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p>{mission.userName}</p>
                    <p className="text-sm text-gray-600">Người tạo nhiệm vụ</p>
                  </div>
                  {!isOwner && (
                    <Button variant="outline" size="sm">
                      Theo dõi
                    </Button>
                  )}
                </div>

                {/* Progress */}
                {mission.status === 'active' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3>Tiến độ</h3>
                      <span className="text-2xl">{mission.progress}%</span>
                    </div>
                    <Progress value={mission.progress} className="h-3" />
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-gray-600">Đã hoàn thành</p>
                        <p className="text-blue-600">{Math.floor(totalDays * mission.progress / 100)} ngày</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-gray-600">Còn lại</p>
                        <p className="text-orange-600">{daysRemaining} ngày</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-gray-600">Tổng cộng</p>
                        <p className="text-purple-600">{totalDays} ngày</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Calendar className="size-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày bắt đầu</p>
                      <p>{mission.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <Calendar className="size-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ngày kết thúc</p>
                      <p>{mission.endDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final Evaluation Result */}
            {mission.finalEvaluation && (
              <Card className={`border-2 ${mission.finalEvaluation.passedRequirements ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {mission.finalEvaluation.passedRequirements ? (
                      <>
                        <CheckCircle className="size-6 text-green-600" />
                        <span className="text-green-700">Kết quả: ĐẠT YÊU CẦU</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-6 text-red-600" />
                        <span className="text-red-700">Kết quả: CHƯA ĐẠT</span>
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className={mission.finalEvaluation.passedRequirements ? 'text-green-700' : 'text-red-700'}>
                    Đánh giá vào {mission.finalEvaluation.evaluationDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Điểm tổng thể</span>
                      <span className={`text-3xl font-bold ${mission.finalEvaluation.passedRequirements ? 'text-green-600' : 'text-red-600'}`}>
                        {mission.finalEvaluation.overallScore}/100
                      </span>
                    </div>
                    <Progress 
                      value={mission.finalEvaluation.overallScore} 
                      className={`h-3 ${mission.finalEvaluation.passedRequirements ? 'bg-green-200' : 'bg-red-200'}`}
                    />
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border">
                    <p className="text-sm font-medium mb-2">🤖 Nhận xét của AI</p>
                    <p className="text-sm text-gray-700">{mission.finalEvaluation.aiAssessment}</p>
                  </div>

                  {mission.finalEvaluation.passedRequirements ? (
                    <Alert className="bg-green-100 border-green-300">
                      <Trophy className="size-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        Chúc mừng! Bạn đã nhận được <strong>{mission.stake * 2} coins</strong> và <strong>+50 uy tín</strong>!
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-red-100 border-red-300">
                      <XCircle className="size-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        Rất tiếc! Bạn đã mất <strong>{mission.stake} coins</strong> đã đặt cược. Hãy cố gắng hơn lần sau!
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Evidence History */}
            {mission.evidences && mission.evidences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử bằng chứng</CardTitle>
                  <CardDescription>
                    Các bằng chứng đã nộp và trạng thái xác nhận (AI 60% + Cộng đồng 40%)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mission.evidences.map((evidence) => {
                    const userHasVoted = evidence.userVotes.some(v => v.userId === user.id);
                    const canVote = !isOwner && !userHasVoted && evidence.status === 'pending' && evidence.aiVerification;
                    
                    return (
                      <div 
                        key={evidence.id}
                        className="p-4 border rounded-lg space-y-3"
                      >
                        <div className="flex gap-4">
                          {evidence.url && (
                            <img 
                              src={evidence.url} 
                              alt="Evidence"
                              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                              <p className="text-sm text-gray-600">{evidence.date}</p>
                              <Badge className={
                                evidence.status === 'approved' ? 'bg-green-100 text-green-700' :
                                evidence.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }>
                                {evidence.status === 'approved' && (
                                  <><CheckCircle className="size-3 mr-1" /> Đã duyệt</>
                                )}
                                {evidence.status === 'rejected' && (
                                  <><XCircle className="size-3 mr-1" /> Từ chối</>
                                )}
                                {evidence.status === 'pending' && (
                                  <><Clock className="size-3 mr-1" /> Chờ xác thực</>
                                )}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{evidence.description}</p>

                            {/* AI Verification Status */}
                            {evidence.aiVerification && (
                              <div className={`p-3 rounded-lg border-l-4 mb-3 ${
                                evidence.aiVerification.result === 'approve' 
                                  ? 'bg-blue-50 border-blue-500' 
                                  : 'bg-orange-50 border-orange-500'
                              }`}>
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs font-semibold text-gray-700">🤖 AI Xác thực (60%)</p>
                                  <Badge variant="outline" className="text-xs">
                                    {evidence.aiVerification.confidence}% tin cậy
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600">
                                  {evidence.aiVerification.result === 'approve' ? '✅ Chấp nhận' : '❌ Từ chối'}: {evidence.aiVerification.reason}
                                </p>
                              </div>
                            )}

                            {/* User Votes Status */}
                            <div className="p-3 bg-gray-50 rounded-lg mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-gray-700">👥 Votes cộng đồng (40%)</p>
                                <span className="text-xs text-gray-600">
                                  {evidence.userVotes.length}/5 votes (auto-test)
                                </span>
                              </div>
                              {evidence.userVotes.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                  {evidence.userVotes.map((vote, idx) => (
                                    <Badge 
                                      key={idx} 
                                      variant="outline"
                                      className={vote.vote === 'approve' ? 'bg-green-50' : 'bg-red-50'}
                                    >
                                      {vote.vote === 'approve' ? '👍' : '👎'} {vote.userName}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Final Verdict */}
                            {evidence.finalVerdict && (
                              <div className={`p-3 rounded-lg ${
                                evidence.finalVerdict.result === 'approved'
                                  ? 'bg-green-100 border border-green-300'
                                  : 'bg-red-100 border border-red-300'
                              }`}>
                                <p className="text-sm font-semibold mb-1">
                                  {evidence.finalVerdict.result === 'approved' ? '✅ Kết quả: Đã duyệt' : '❌ Kết quả: Từ chối'}
                                </p>
                                <p className="text-xs text-gray-700">
                                  AI: {evidence.finalVerdict.aiWeight}% + Cộng đồng: {evidence.finalVerdict.userWeight.toFixed(1)}% = {(evidence.finalVerdict.aiWeight + evidence.finalVerdict.userWeight).toFixed(1)}%
                                </p>
                                {evidence.finalVerdict.penalizedUsers.length > 0 && (
                                  <p className="text-xs text-red-600 mt-1">
                                    ⚠️ {evidence.finalVerdict.penalizedUsers.length} người vote sai bị phạt 50 coins
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Vote Buttons - Hidden in test mode */}
                            {canVote && false && (
                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                  onClick={() => handleUserVote(evidence.id, 'approve')}
                                >
                                  👍 Chấp nhận
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => handleUserVote(evidence.id, 'reject')}
                                >
                                  👎 Từ chối
                                </Button>
                              </div>
                            )}

                            {userHasVoted && !evidence.finalVerdict && (
                              <p className="text-xs text-gray-500 italic pt-2">
                                ⏳ Bạn đã vote. Chờ thêm {5 - evidence.userVotes.length} votes để có kết quả...
                              </p>
                            )}
                            
                            {/* Test mode info */}
                            {evidence.aiVerification && !evidence.finalVerdict && evidence.userVotes.length < 5 && (
                              <p className="text-xs text-blue-600 italic pt-2">
                                🤖 Test mode: Tự động thêm 5 votes sau 3 giây...
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="size-5" />
                  Bình luận ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea placeholder="Viết bình luận..." rows={2} />
                    <Button className="mt-2" size="sm">Gửi</Button>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={comment.userAvatar} alt={comment.userName} />
                        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm mb-1">{comment.userName}</p>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{comment.time}</span>
                          <button className="hover:text-indigo-600">Thích</button>
                          <button className="hover:text-indigo-600">Trả lời</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stake Info */}
            <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="size-5" />
                  Thông tin đặt cược
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Số coin đã đặt</p>
                  <p className="text-3xl text-indigo-600">{mission.stake}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Phần thưởng khi thành công</p>
                  <p className="text-3xl text-green-600">{mission.stake * 2}</p>
                </div>
                <Alert>
                  <Trophy className="size-4" />
                  <AlertDescription>
                    Hoàn thành nhiệm vụ để nhận <strong>+{mission.stake} coins</strong> lợi nhuận!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Heart className="size-4 text-red-500" />
                    <span className="text-sm">Người ủng hộ</span>
                  </div>
                  <span>{mission.supporters}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="size-4 text-blue-500" />
                    <span className="text-sm">Người tham gia</span>
                  </div>
                  <span>{mission.participants}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="size-4 text-green-500" />
                    <span className="text-sm">Bình luận</span>
                  </div>
                  <span>{comments.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {!isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle>Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Heart className="size-4 mr-2" />
                    Ủng hộ người chơi
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Target className="size-4 mr-2" />
                    Tham gia nhiệm vụ tương tự
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                    Theo dõi tiến độ
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  Nhiệm vụ tương tự
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {missions.slice(0, 3).filter(m => m.id !== mission.id && m.category === mission.category).map((m) => (
                  <div 
                    key={m.id}
                    className="p-3 border rounded-lg hover:border-indigo-300 cursor-pointer transition-colors"
                    onClick={() => onNavigate('mission', m.id)}
                  >
                    <p className="text-sm line-clamp-2 mb-2">{m.title}</p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{m.stake} coins</span>
                      <span>{m.supporters} ủng hộ</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
