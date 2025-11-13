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
  Filter
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

type Props = {
  user: User;
  onNavigate: (page: any) => void;
  // NOTE: Callback để thêm mission mới khi người dùng nhận nhiệm vụ
  onAcceptTask: (mission: Mission) => void;
  setUser: (user: User) => void;
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

export function AITaskSuggestions({ user, onNavigate, onAcceptTask, setUser }: Props) {
  const [userProfile] = useState<UserProfile>(() => createMockUserProfile(user));
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

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
  }, [userProfile]);

  const filteredTasks = selectedCategory === 'all' 
    ? suggestedTasks 
    : suggestedTasks.filter(task => task.category === selectedCategory);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-800">
                    AI Đề xuất nhiệm vụ
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Các nhiệm vụ được cá nhân hóa dựa trên level và mục tiêu của bạn
                  </p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('dashboard')}
            >
              ← Quay lại
            </Button>
          </div>

          {/* Top 4 Categories by Level */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <TrendingUp size={16} />
              Kỹ năng hàng đầu của bạn
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {topCategories.map(({ category, level }) => {
                const progress = ((level % 10) / 10) * 100;
                const tasksInCategory = suggestedTasks.filter(t => t.category === category).length;
                
                return (
                  <Card 
                    key={category} 
                    className="border-2 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm capitalize">{category}</span>
                        <Badge variant="secondary" className="text-xs font-bold">
                          Lv {level}
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-2 mb-2" />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{tasksInCategory} nhiệm vụ</span>
                        <span className="font-medium">{Math.floor(progress)}% → {level + 1}</span>
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={20} className="text-gray-500" />
            <span className="font-medium text-gray-700">Lọc theo danh mục:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              Tất cả
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Suggested Tasks Grid */}
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card 
              key={task.id} 
              className={`border-2 hover:shadow-lg transition-all cursor-pointer ${
                expandedTask === task.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={categoryColors[task.category]}>
                        {task.category}
                      </Badge>
                      <Badge variant="secondary" className="font-semibold">
                        Lv {userProfile.currentLevel[task.category] || 1}
                      </Badge>
                      <Badge className={difficultyColors[task.difficulty]} variant="outline">
                        {difficultyLabels[task.difficulty]}
                      </Badge>
                      <Badge variant="outline" className="bg-gradient-to-r from-yellow-100 to-amber-100">
                        <Award size={12} className="mr-1" />
                        +{task.points} điểm
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{task.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {task.description}
                    </CardDescription>
                  </div>
                  <div className="ml-4">
                    <div className="bg-gradient-to-br from-yellow-400 to-amber-500 text-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold">{task.points}</span>
                      <span className="text-xs">điểm</span>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{task.estimatedTime} phút</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target size={16} />
                    <span>Level {task.requiredLevel}+</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={16} />
                    <span>Phù hợp {task.matchScore}%</span>
                  </div>
                </div>
              </CardHeader>

              {/* Expanded Content */}
              {expandedTask === task.id && (
                <CardContent className="border-t pt-4">
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

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleAcceptTask(task);
                      }}
                      disabled={!!task.prerequisites}
                    >
                      <CheckCircle2 size={16} className="mr-2" />
                      Nhận nhiệm vụ
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setExpandedTask(null);
                      }}
                    >
                      Đóng
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Sparkles size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Không có nhiệm vụ phù hợp
            </h3>
            <p className="text-gray-500">
              Hãy thử chọn danh mục khác hoặc cập nhật lịch trình của bạn
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
