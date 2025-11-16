import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sparkles, 
  Target, 
  Clock, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Award,
  ChevronRight,
  Filter,
  Coins,
  Check
} from 'lucide-react';
import { TaskRecommendationAI } from '../services/TaskRecommendationAI';
import { TaskProgressionService } from '../services/TaskProgressionService';
import { taskTemplates } from '../data/taskTemplates';
import { 
  UserProfile, 
  SuggestedTask, 
  TaskCategory,
  TimeOfDay 
} from '../types/ai-types';
import { User } from '../App';
import type { Mission, Page } from '../App';
import { 
  personalizedMissionService, 
  MissionSuggestion, 
  UserPreferences 
} from '../services/PersonalizedMissionService';
import { RefreshCw, AlertCircle } from 'lucide-react';

type Props = {
  user: User;
  onNavigate: (page: any) => void;
  // NOTE: Callback để thêm mission mới khi người dùng nhận nhiệm vụ
  onAcceptTask: (mission: Mission) => void;
  setUser: (user: User) => void;
  userPreferences?: UserPreferences;
  // NOTE: AI generated missions state từ App component
  aiGeneratedMissions: MissionSuggestion[];
  setAiGeneratedMissions: (missions: MissionSuggestion[]) => void;
};

// Mock user profile - Trong thực tế sẽ lấy từ database
const createMockUserProfile = (user: User): UserProfile => {
  return {
    id: user.id,
    currentLevel: {
      'thể thao': 15,
      'học tập': 25,
      'đời sống': 10,
      'sức khỏe': 20,
      'tài chính': 8,
      'sáng tạo': 12,
      'công việc': 18,
      'xã hội': 7,
    },
    completedTasks: [],
    schedule: [
      {
        dayOfWeek: 1, // Monday
        timeSlots: [
          { start: '09:00', end: '12:00', activity: 'Làm việc' },
          { start: '13:00', end: '17:00', activity: 'Làm việc' },
        ],
        preferences: {
          preferredCategories: ['học tập', 'công việc'],
          availableTime: 120,
        },
      },
      {
        dayOfWeek: 2, // Tuesday
        timeSlots: [
          { start: '09:00', end: '12:00', activity: 'Làm việc' },
          { start: '14:00', end: '18:00', activity: 'Làm việc' },
        ],
      },
      // ... other days
    ],
    preferences: {
      favoriteCategories: ['thể thao', 'học tập', 'sức khỏe'],
      avoidCategories: [],
      dailyTimeCommitment: 90, // 90 phút mỗi ngày
    },
    stats: {
      totalPoints: user.coins || 0,
      streak: user.streak || 0,
      lastActiveDate: new Date(),
    },
  };
};

const categoryColors: Record<TaskCategory, string> = {
  'đời sống': 'bg-blue-100 text-blue-700 border-blue-200',
  'học tập': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'thể thao': 'bg-green-100 text-green-700 border-green-200',
  'sức khỏe': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'tài chính': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'sáng tạo': 'bg-purple-100 text-purple-700 border-purple-200',
  'công việc': 'bg-orange-100 text-orange-700 border-orange-200',
  'xã hội': 'bg-pink-100 text-pink-700 border-pink-200',
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-orange-100 text-orange-700',
  expert: 'bg-red-100 text-red-700',
};

const difficultyLabels = {
  beginner: 'Mới bắt đầu',
  intermediate: 'Trung bình',
  advanced: 'Nâng cao',
  expert: 'Chuyên gia',
};

const timeOfDayLabels: Record<TimeOfDay, string> = {
  morning: 'Buổi sáng',
  afternoon: 'Buổi chiều',
  evening: 'Buổi tối',
  night: 'Đêm',
};

const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function AITaskSuggestions({ user, onNavigate, onAcceptTask, setUser, userPreferences, aiGeneratedMissions, setAiGeneratedMissions }: Props) {
  const [userProfile] = useState<UserProfile>(() => createMockUserProfile(user));
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  
  // Personalized missions state - dùng props từ App (không reset khi chuyển trang)
  const [loadingPersonalized, setLoadingPersonalized] = useState(false);
  const [rerollsRemaining, setRerollsRemaining] = useState(3);
  const [showPersonalized, setShowPersonalized] = useState(aiGeneratedMissions.length > 0);
  const [lastGenerateTime, setLastGenerateTime] = useState<number>(0);
  const GENERATE_COOLDOWN = 3000; // 3 seconds cooldown between generates

  useEffect(() => {
    // Sử dụng TaskProgressionService để lấy available tasks
    const availableTasks = TaskProgressionService.getAvailableTasks(userProfile);
    
    // Kết hợp với AI recommendations
    const allSuggestions = TaskRecommendationAI.getSuggestedTasks(userProfile, 50);
    
    // Lọc chỉ lấy các tasks available (đã được unlock hoặc sắp unlock)
    const filteredSuggestions = allSuggestions.filter(suggestion => {
      return availableTasks.some(available => 
        suggestion.title.includes(available.title)
      );
    });
    
    // Giới hạn mỗi category chỉ có 2-3 tasks
    const limitedByCategory: Record<string, SuggestedTask[]> = {};
    const limited: SuggestedTask[] = [];
    
    filteredSuggestions.forEach(task => {
      const category = task.category;
      if (!limitedByCategory[category]) {
        limitedByCategory[category] = [];
      }
      // Chỉ lấy tối đa 3 tasks mỗi category
      if (limitedByCategory[category].length < 3) {
        limitedByCategory[category].push(task);
        limited.push(task);
      }
    });
    
    setSuggestedTasks(limited.slice(0, 20));
    
    // NOTE: Reroll không dùng localStorage - reset khi reload trang
    setRerollsRemaining(3); // Always 3 rerolls (reset on page reload)
    
    // Hiển thị personalized missions nếu đã tạo
    setShowPersonalized(aiGeneratedMissions.length > 0);
  }, [userProfile, user.id, aiGeneratedMissions.length]);

  // Generate personalized missions
  const handleGeneratePersonalized = async () => {
    // Check cooldown
    const now = Date.now();
    const timeSinceLastGenerate = now - lastGenerateTime;
    if (timeSinceLastGenerate < GENERATE_COOLDOWN && lastGenerateTime > 0) {
      const remainingSeconds = Math.ceil((GENERATE_COOLDOWN - timeSinceLastGenerate) / 1000);
      alert(`⏳ Vui lòng đợi ${remainingSeconds} giây trước khi tạo lại!`);
      return;
    }
    
    try {
      setLoadingPersonalized(true);
      setLastGenerateTime(now);
      
      // Check if user has set preferences
      if (!userPreferences || userPreferences.interests.length === 0) {
        alert('Please set your preferences in Profile → Settings tab first!');
        onNavigate('profile');
        return;
      }
      
      const missions = await personalizedMissionService.generatePersonalizedMissions(userPreferences, 3);
      setAiGeneratedMissions(missions);
      setShowPersonalized(true);
    } catch (error) {
      console.error('Error generating personalized missions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('giới hạn')) {
        // Rate limit error - show specific message
        alert(errorMessage);
      } else {
        alert('Failed to generate personalized missions. Please try again.');
      }
    } finally {
      setLoadingPersonalized(false);
    }
  };

  // Reroll a specific mission
  const handleRerollMission = async (index: number) => {
    if (rerollsRemaining <= 0) {
      alert('You have used all your rerolls for today!');
      return;
    }
    
    // Check cooldown
    const now = Date.now();
    const timeSinceLastGenerate = now - lastGenerateTime;
    if (timeSinceLastGenerate < GENERATE_COOLDOWN && lastGenerateTime > 0) {
      const remainingSeconds = Math.ceil((GENERATE_COOLDOWN - timeSinceLastGenerate) / 1000);
      alert(`⏳ Vui lòng đợi ${remainingSeconds} giây trước khi reroll!`);
      return;
    }

    try {
      setLoadingPersonalized(true);
      setLastGenerateTime(now);
      
      if (!userPreferences || userPreferences.interests.length === 0) {
        alert('Preferences not found. Please set them in your Profile.');
        return;
      }
      
      const currentMission = aiGeneratedMissions[index];
      
      const newMission = await personalizedMissionService.rerollMission(
        currentMission,
        userPreferences,
        'User requested different mission'
      );
      
      // Update missions array
      const updatedMissions = [...aiGeneratedMissions];
      updatedMissions[index] = newMission;
      setAiGeneratedMissions(updatedMissions);
      
      // Track reroll and update counter
      personalizedMissionService.trackReroll(user.id);
      setRerollsRemaining(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error rerolling mission:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('giới hạn')) {
        // Rate limit error - show specific message
        alert(errorMessage);
      } else {
        alert('Failed to reroll mission. Please try again.');
      }
    } finally {
      setLoadingPersonalized(false);
    }
  };

  const filteredTasks = selectedCategory === 'all' 
    ? suggestedTasks 
    : suggestedTasks.filter(t => t.category === selectedCategory);

  const handleAcceptTask = (task: SuggestedTask) => {
    // Calculate stake based on task difficulty and points
    const stakeAmount = task.difficulty === 'beginner' ? 500 : 
                        task.difficulty === 'intermediate' ? 1000 : 1500;
    
    // Check if user has enough coins
    if (user.coins < stakeAmount) {
      alert(`⚠️ Không đủ coins!\n\nBạn cần: ${stakeAmount} coins\nBạn có: ${user.coins} coins\n\nHãy hoàn thành các nhiệm vụ khác để kiếm thêm coins.`);
      return;
    }

    // Deduct stake from user's coins
    setUser({
      ...user,
      coins: user.coins - stakeAmount
    });

    // NOTE: Tạo Mission object từ SuggestedTask
    const newMission: Mission = {
      id: `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: task.title,
      description: task.description,
      stake: stakeAmount,
      startDate: new Date().toLocaleDateString('vi-VN'),
      endDate: new Date(Date.now() + task.estimatedTime * 60 * 1000).toLocaleDateString('vi-VN'),
      mode: 'personal',
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      status: 'active',
      progress: 0,
      difficulty: task.difficulty === 'beginner' ? 'easy' : 
                  task.difficulty === 'intermediate' ? 'medium' : 'hard',
      category: task.category,
      participants: 1,
      supporters: 0,
      evidences: [],
    };

    // NOTE: Thêm mission vào danh sách
    onAcceptTask(newMission);
    
    // Remove from AI generated missions if it's from personalized list
    const aiMissionIndex = aiGeneratedMissions.findIndex(m => m.title === task.title);
    if (aiMissionIndex !== -1) {
      const updatedMissions = aiGeneratedMissions.filter((_, idx) => idx !== aiMissionIndex);
      setAiGeneratedMissions(updatedMissions);
      
      if (updatedMissions.length === 0) {
        setShowPersonalized(false);
      }
    }
    
    // NOTE: Hiển thị thông báo thành công
    alert(`✅ Đã nhận nhiệm vụ: ${task.title}\n\n💰 Đã đặt cược: ${stakeAmount} coins\n🎁 Phần thưởng khi hoàn thành: ${stakeAmount * 2} coins + 50 uy tín\n📊 Độ khó: ${task.difficulty}\n⏱️ Thời gian ước tính: ${task.estimatedTime} phút`);
    
    // NOTE: Quay về Dashboard để xem nhiệm vụ vừa nhận
    onNavigate('dashboard');
  };

  // Handler khi hoàn thành task - sẽ unlock task mới
  const handleCompleteTask = (task: SuggestedTask) => {
    // Cập nhật level
    const updatedProfile = TaskRecommendationAI.updateUserLevel(userProfile, {
      category: task.category,
      points: task.points,
      difficulty: task.difficulty,
    });

    // Kiểm tra unlock nhiệm vụ mới
    const shouldUnlock = TaskProgressionService.shouldUnlockNewTask(
      task.category,
      updatedProfile
    );

    if (shouldUnlock) {
      const nextTask = TaskProgressionService.getNextTask(
        task.id,
        task.category,
        updatedProfile
      );
      
      if (nextTask) {
        alert(`🎉 Mở khóa nhiệm vụ mới: ${nextTask.title}`);
      }
    }
  };

  const categories: TaskCategory[] = [
    'đời sống',
    'học tập',
    'thể thao',
    'sức khỏe',
    'tài chính',
    'sáng tạo',
    'công việc',
    'xã hội',
  ];

  // Lấy 4 category có level cao nhất
  const topCategories = categories
    .map(cat => ({
      category: cat,
      level: userProfile.currentLevel[cat] || 1
    }))
    .sort((a, b) => b.level - a.level)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-xl">
                <Sparkles className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-2">
                  🤖 AI Đề xuất nhiệm vụ
                </h1>
                <p className="text-white/90 mt-1 font-medium">
                  Các nhiệm vụ được cá nhân hóa dựa trên level và mục tiêu của bạn
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                <div className="flex items-center gap-2 text-white">
                  <Coins className="size-5" />
                  <span className="font-bold text-lg">{user.coins.toLocaleString()}</span>
                </div>
              </div>
              <Button 
                onClick={() => onNavigate('dashboard')}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/40 font-semibold px-6 h-11"
              >
                ← Quay lại
              </Button>
            </div>
          </div>

          {/* Top 4 Categories by Level */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
              <TrendingUp size={18} />
              🏆 Kỹ năng hàng đầu của bạn
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {topCategories.map(({ category, level }) => {
                const progress = ((level % 10) / 10) * 100;
                const tasksInCategory = suggestedTasks.filter(t => t.category === category).length;
                
                return (
                  <Card 
                    key={category} 
                    className="bg-white/95 backdrop-blur-sm border-2 border-white/50 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-base capitalize text-gray-800 group-hover:text-purple-600 transition-colors">{category}</span>
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs font-bold px-2.5 py-1">
                          Lv {level}
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-2.5 mb-3" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">📋 {tasksInCategory} nhiệm vụ</span>
                        <span className="font-bold text-purple-600">{Math.floor(progress)}% → {level + 1}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Filter size={20} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg">🎯 Lọc theo danh mục</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedCategory('all')}
              className={`h-11 px-6 font-semibold transition-all ${
                selectedCategory === 'all' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg scale-105' 
                  : 'border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50'
              }`}
            >
              Tất cả
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => setSelectedCategory(category)}
                className={`h-11 px-6 font-semibold capitalize transition-all ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg scale-105' 
                    : 'border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Personalized Missions Section */}
        <div className="mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-200 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2.5 rounded-xl">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  ✨ Nhiệm vụ cá nhân hóa cho bạn
                </h2>
                <p className="text-base text-gray-600 mt-2 ml-12 font-medium">
                  Được tạo dựa trên sở thích và mục tiêu của bạn bằng AI Gemini
                </p>
              </div>
              <div className="flex items-center gap-4">
                {showPersonalized && (
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-xl border-2 border-purple-300">
                    <span className="text-sm font-bold text-purple-700">🎲 Rerolls: {rerollsRemaining}/3</span>
                  </div>
                )}
                <Button
                  onClick={handleGeneratePersonalized}
                  disabled={loadingPersonalized}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white font-bold px-6 h-12 shadow-lg"
                >
                  {loadingPersonalized ? (
                    <>
                      <RefreshCw className="animate-spin mr-2" size={18} />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={18} />
                      {showPersonalized ? '🔄 Tạo lại tất cả' : '✨ Tạo nhiệm vụ cá nhân hóa'}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {showPersonalized && aiGeneratedMissions.length > 0 && (
              <div className="grid gap-5 mt-6">
                {aiGeneratedMissions.map((mission: MissionSuggestion, index: number) => {
                  // Map difficulty levels
                  const difficultyMap: Record<string, 'beginner' | 'intermediate' | 'advanced' | 'expert'> = {
                    'easy': 'beginner',
                    'medium': 'intermediate',
                    'hard': 'advanced'
                  };
                  const mappedDifficulty = difficultyMap[mission.difficulty] || 'intermediate';
                  
                  return (
                    <Card key={mission.id} className="border-2 border-purple-300 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-2xl hover:scale-[1.01] transition-all group">
                      {/* Top gradient bar */}
                      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
                      
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1 space-y-4">
                            {/* Title and badges */}
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">{mission.title}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={`${categoryColors[mission.category as TaskCategory]} border font-semibold px-3 py-1`}>
                                  {mission.category}
                                </Badge>
                                <Badge className={`${difficultyColors[mappedDifficulty]} border font-semibold px-3 py-1`}>
                                  {difficultyLabels[mappedDifficulty]}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Description */}
                            <p className="text-gray-700 leading-relaxed">{mission.description}</p>
                            
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-3">
                                <div className="flex items-center gap-2 text-blue-700">
                                  <Clock size={18} />
                                  <div>
                                    <p className="text-xs font-semibold text-blue-600">Thời gian</p>
                                    <p className="font-bold">{mission.estimatedTime} phút</p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-3">
                                <div className="flex items-center gap-2 text-purple-700">
                                  <Target size={18} />
                                  <div>
                                    <p className="text-xs font-semibold text-purple-600">Đặt cược</p>
                                    <p className="font-bold">{mission.difficulty === 'easy' ? 500 : mission.difficulty === 'medium' ? 1000 : 1500} coins</p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-3">
                                <div className="flex items-center gap-2 text-amber-700">
                                  <Coins size={18} />
                                  <div>
                                    <p className="text-xs font-semibold text-amber-600">Phần thưởng</p>
                                    <p className="font-bold">{(mission.difficulty === 'easy' ? 500 : mission.difficulty === 'medium' ? 1000 : 1500) * 2} coins</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                              {mission.tags.map((tag, i) => (
                                <span key={i} className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold px-3 py-1.5 rounded-full border border-purple-200">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Reasoning */}
                            {mission.reasoning && (
                              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  <span className="font-bold text-purple-600">💡 Tại sao phù hợp với bạn:</span>
                                  <br />
                                  <span className="mt-1 block">{mission.reasoning}</span>
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col gap-3 min-w-[140px]">
                            <Button
                              onClick={() => {
                                const task: SuggestedTask = {
                                  id: mission.id,
                                  title: mission.title,
                                  description: mission.description,
                                  category: mission.category as TaskCategory,
                                  difficulty: mappedDifficulty,
                                  estimatedTime: mission.estimatedTime,
                                  points: mission.rewards.xp,
                                  requiredLevel: 1,
                                  prerequisites: [],
                                  suggestedTimeSlots: [{
                                    day: new Date().getDay(),
                                    time: 'morning',
                                    reason: 'Personalized mission'
                                  }],
                                  matchScore: 95,
                                  tips: mission.tags,
                                };
                                handleAcceptTask(task);
                              }}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold h-11 shadow-lg"
                            >
                              <Check size={18} className="mr-2" />
                              Nhận
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => handleRerollMission(index)}
                              disabled={loadingPersonalized || rerollsRemaining <= 0}
                              className="border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 font-semibold h-11"
                            >
                              {loadingPersonalized ? (
                                <RefreshCw className="animate-spin" size={18} />
                              ) : (
                                <>
                                  <RefreshCw size={18} className="mr-2" />
                                  Reroll
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!showPersonalized && (
              <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-300">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={40} className="text-white" />
                </div>
                <p className="text-base font-semibold text-gray-700 mb-2">✨ Nhấn nút bên trên để tạo nhiệm vụ cá nhân hóa!</p>
                <p className="text-sm text-gray-600">Hãy thiết lập sở thích trong Hồ sơ cá nhân để có gợi ý tốt nhất 🎯</p>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Tasks Grid */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
              <Target size={20} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-800 text-xl">📋 Tất cả nhiệm vụ được đề xuất</h2>
          </div>
          
          <div className="grid gap-6">
            {filteredTasks.map((task) => {
              const stakeAmount = task.difficulty === 'beginner' ? 500 : task.difficulty === 'intermediate' ? 1000 : 1500;
              const rewardAmount = stakeAmount * 2;
              const profitAmount = stakeAmount;

              return (
              <Card 
                key={task.id} 
                className={`group border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white ${
                  expandedTask === task.id ? 'ring-4 ring-purple-300 shadow-2xl' : 'shadow-lg hover:scale-[1.02]'
                }`}
              >
                {/* Gradient Header Bar */}
                <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute -left-10 -bottom-10 size-40 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <CardContent className="relative h-full flex items-center justify-between p-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge className={`${categoryColors[task.category]} border-2 font-bold px-3 py-1.5 shadow-sm`}>
                          {task.category}
                        </Badge>
                        <Badge className="bg-white/90 backdrop-blur text-purple-700 border-0 font-bold px-3 py-1.5 shadow-sm">
                          Lv {userProfile.currentLevel[task.category] || 1}
                        </Badge>
                        <Badge className={`${difficultyColors[task.difficulty]} border-2 font-bold px-3 py-1.5 shadow-sm`}>
                          {difficultyLabels[task.difficulty]}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg line-clamp-2">{task.title}</h3>
                    </div>

                    {/* Floating Reward Badge */}
                    <div className="ml-6 bg-white rounded-2xl shadow-2xl p-4 min-w-[120px]">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Coins className="text-amber-500" size={24} />
                        </div>
                        <p className="text-3xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                          +{profitAmount}
                        </p>
                        <p className="text-xs text-gray-600 font-bold">coins lợi nhuận</p>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Main Content */}
                <CardContent className="p-6 space-y-5">
                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed">{task.description}</p>

                  {/* Info Stats Row */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                      <Clock className="text-blue-600" size={18} />
                      <span className="text-sm font-bold text-blue-700">{task.estimatedTime} phút</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                      <Target className="text-purple-600" size={18} />
                      <span className="text-sm font-bold text-purple-700">Level {task.requiredLevel}+</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                      <TrendingUp className="text-green-600" size={18} />
                      <span className="text-sm font-bold text-green-700">{task.matchScore}% phù hợp</span>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-200">
                      <Award className="text-indigo-600" size={18} />
                      <span className="text-sm font-bold text-indigo-700">+{task.points} XP</span>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border-2 border-gray-200">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Đặt cược</p>
                        <p className="text-2xl font-black text-red-600">-{stakeAmount}</p>
                        <p className="text-xs text-gray-500">coins</p>
                      </div>
                      <div className="text-center border-x-2 border-gray-300">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Phần thưởng</p>
                        <p className="text-2xl font-black text-emerald-600">+{rewardAmount}</p>
                        <p className="text-xs text-gray-500">coins</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Lợi nhuận</p>
                        <p className="text-2xl font-black text-green-600">+{profitAmount}</p>
                        <p className="text-xs text-gray-500">coins</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white font-bold h-12 shadow-lg"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleAcceptTask(task);
                        }}
                        disabled={!!task.prerequisites}
                      >
                        <CheckCircle2 size={20} className="mr-2" />
                        Nhận nhiệm vụ
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 font-semibold h-12 px-6"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setExpandedTask(expandedTask === task.id ? null : task.id);
                        }}
                      >
                        {expandedTask === task.id ? '▲ Thu gọn' : '▼ Chi tiết'}
                      </Button>
                    </div>
                  </div>
                </CardContent>

              {/* Expanded Content - Additional Details */}
              {expandedTask === task.id && (
                <CardContent className="border-t-2 border-purple-200 pt-6 bg-gradient-to-b from-purple-50/30 to-white">
                  <Tabs defaultValue="prerequisites" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="prerequisites" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <CheckCircle2 size={16} className="mr-2" />
                        Yêu cầu
                      </TabsTrigger>
                      <TabsTrigger value="tips" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <Lightbulb size={16} className="mr-2" />
                        Gợi ý
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="tips" className="mt-4">
                      <h4 className="font-semibold mb-3">Mẹo thực hiện:</h4>
                      <ul className="space-y-2">
                        {task.tips.map((tip, index) => (
                          <li 
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <Lightbulb size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="prerequisites" className="mt-4">
                      <div className="space-y-4">
                        {/* Tìm template tương ứng để lấy evidence requirements */}
                        {(() => {
                          const template = taskTemplates.find((t: any) => task.title.includes(t.title));
                          
                          return (
                            <>
                              {/* Success Criteria */}
                              {template?.successCriteria && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    <CheckCircle2 size={18} className="text-blue-600" />
                                    Tiêu chí hoàn thành:
                                  </h4>
                                  <ul className="space-y-1.5">
                                    {template.successCriteria.map((criteria: string, index: number) => (
                                      <li key={index} className="text-sm text-blue-800">
                                        ✓ {criteria}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Evidence Requirements */}
                              {template?.evidenceRequirements && (
                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                    <Award size={18} className="text-purple-600" />
                                    Bằng chứng cần nộp:
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <Badge variant="outline" className="mb-2">
                                        Loại: {template.evidenceRequirements.type === 'image' ? 'Hình ảnh' : 
                                               template.evidenceRequirements.type === 'video' ? 'Video' :
                                               template.evidenceRequirements.type === 'text' ? 'Văn bản' : 'Kết hợp'}
                                      </Badge>
                                      <p className="text-sm text-purple-800 mb-2">
                                        {template.evidenceRequirements.description}
                                      </p>
                                      <div className="text-xs text-purple-700 space-y-1">
                                        <p className="font-semibold">Ví dụ:</p>
                                        {template.evidenceRequirements.examples.map((ex: string, i: number) => (
                                          <p key={i}>• {ex}</p>
                                        ))}
                                      </div>
                                      <p className="text-xs text-purple-600 mt-2">
                                        Số lượng tối thiểu: {template.evidenceRequirements.minimumCount} bằng chứng
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Detailed Steps */}
                              {template?.detailedSteps && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                    <Target size={18} className="text-green-600" />
                                    Các bước thực hiện:
                                  </h4>
                                  <ol className="space-y-2">
                                    {template.detailedSteps.map((step: string, index: number) => (
                                      <li key={index} className="text-sm text-green-800">
                                        {step}
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {!template?.evidenceRequirements && !template?.successCriteria && !template?.detailedSteps && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                  <p className="text-sm text-gray-600">
                                    Yêu cầu chi tiết sẽ được cập nhật sớm.
                                  </p>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
            );
            })}
          </div>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={48} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              🔍 Không có nhiệm vụ phù hợp
            </h3>
            <p className="text-gray-600 text-base">
              Hãy thử chọn danh mục khác hoặc cập nhật lịch trình của bạn
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
