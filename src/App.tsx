import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { CreateMission } from './components/CreateMission';
import { MissionFeed } from './components/MissionFeed';
import { MissionDetail } from './components/MissionDetail';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Wallet } from './components/Wallet';
import { AITaskSuggestions } from './components/AITaskSuggestions';
import { mockMissions } from './components/mockData';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coins: number;
  badges: string[];
  bio: string;
  streak: number;
  reputation: number;
  verificationStats?: {
    totalVotes: number;
    correctVotes: number;
    accuracy: number; // percentage
  };
};

export type Prediction = {
  userId: string;
  userName: string;
  prediction: 'success' | 'fail';
  stake: number;
  timestamp: number;
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  stake: number;
  startDate: string;
  endDate: string;
  mode: 'personal' | 'group' | 'public';
  userId: string;
  userName: string;
  userAvatar: string;
  status: 'active' | 'completed' | 'failed' | 'pending' | 'under_review';
  progress: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  participants: number;
  supporters: number;
  evidences: Evidence[];
  predictions?: Prediction[]; // Track all predictions for this mission
  submittedForReview?: boolean;
  finalEvaluation?: {
    overallScore: number; // 0-100
    aiAssessment: string;
    passedRequirements: boolean;
    evaluationDate: string;
  };
};

export type EvidenceVote = {
  userId: string;
  userName: string;
  vote: 'approve' | 'reject';
  timestamp: string;
};

export type Evidence = {
  id: string;
  date: string;
  type: 'image' | 'video' | 'text';
  url?: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  // AI verification (60% weight)
  aiVerification?: {
    result: 'approve' | 'reject';
    confidence: number; // 0-100
    reason: string;
    timestamp: string;
  };
  // User votes (40% weight)
  userVotes: EvidenceVote[];
  // Final decision
  finalVerdict?: {
    result: 'approved' | 'rejected';
    aiWeight: number; // 60%
    userWeight: number; // 40%
    penalizedUsers: string[]; // User IDs who voted incorrectly
    timestamp: string;
  };
};

export type Page = 'login' | 'dashboard' | 'create' | 'feed' | 'mission' | 'leaderboard' | 'profile' | 'wallet' | 'ai-suggestions';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  // NOTE: State để quản lý danh sách missions, bắt đầu với mockMissions
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  // NOTE: Track trang trước đó để biết nên quay về đâu
  const [previousPage, setPreviousPage] = useState<Page>('dashboard');
  // NOTE: Track user preferences (không lưu localStorage, reset khi reload)
  const [userPreferences, setUserPreferences] = useState<any>(null);

  // NOTE: Hàm để thêm mission mới (được gọi từ AI suggestions hoặc CreateMission)
  const addMission = (mission: Mission) => {
    setMissions(prev => [...prev, mission]);
  };

  // NOTE: Hàm để cập nhật mission (được gọi từ MissionDetail khi submit evidence hoặc complete)
  const updateMission = (missionId: string, updates: Partial<Mission>) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? { ...mission, ...updates }
        : mission
    ));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const navigateTo = (page: Page, missionId?: string) => {
    // Track previous page trước khi chuyển
    if (page === 'mission') {
      setPreviousPage(currentPage);
    }
    setCurrentPage(page);
    if (missionId) {
      setSelectedMissionId(missionId);
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {currentPage === 'dashboard' && (
        <Dashboard 
          user={currentUser} 
          onNavigate={navigateTo} 
          setUser={setCurrentUser}
          missions={missions}
        />
      )}
      {currentPage === 'create' && (
        <CreateMission user={currentUser} onNavigate={navigateTo} setUser={setCurrentUser} />
      )}
      {currentPage === 'feed' && (
        <MissionFeed 
          user={currentUser} 
          onNavigate={navigateTo} 
          missions={missions}
          setUser={setCurrentUser}
          setMissions={setMissions}
          addMission={addMission}
        />
      )}
      {currentPage === 'mission' && selectedMissionId && (
        <MissionDetail 
          missionId={selectedMissionId} 
          user={currentUser} 
          onNavigate={navigateTo}
          setUser={setCurrentUser}
          missions={missions}
          previousPage={previousPage}
          onUpdateMission={updateMission}
        />
      )}
      {currentPage === 'leaderboard' && (
        <Leaderboard user={currentUser} onNavigate={navigateTo} />
      )}
      {currentPage === 'profile' && (
        <Profile 
          user={currentUser} 
          onNavigate={navigateTo} 
          setUser={setCurrentUser} 
          missions={missions}
          onPreferencesChange={setUserPreferences}
          userPreferences={userPreferences}
        />
      )}
      {currentPage === 'wallet' && (
        <Wallet user={currentUser} onNavigate={navigateTo} />
      )}
      {currentPage === 'ai-suggestions' && (
        <AITaskSuggestions 
          user={currentUser} 
          onNavigate={navigateTo}
          onAcceptTask={addMission}
          setUser={setCurrentUser}
          userPreferences={userPreferences}
        />
      )}
    </div>
  );
}

export default App;
