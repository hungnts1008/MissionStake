// Types cho hệ thống AI đề xuất nhiệm vụ

export type TaskCategory = 
  | 'đời sống'
  | 'học tập'
  | 'thể thao'
  | 'sức khỏe'
  | 'tài chính'
  | 'sáng tạo'
  | 'công việc'
  | 'xã hội';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type UserSchedule = {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  timeSlots: {
    start: string; // "HH:MM"
    end: string; // "HH:MM"
    activity?: string;
  }[];
  preferences?: {
    preferredCategories: TaskCategory[];
    availableTime: number; // minutes per day
  };
};

export type UserProfile = {
  id: string;
  currentLevel: {
    [key in TaskCategory]?: number; // Level từ 1-100
  };
  completedTasks: {
    category: TaskCategory;
    difficulty: DifficultyLevel;
    completedAt: Date;
    points: number;
  }[];
  schedule: UserSchedule[];
  preferences: {
    favoriteCategories: TaskCategory[];
    avoidCategories: TaskCategory[];
    dailyTimeCommitment: number; // minutes
  };
  stats: {
    totalPoints: number;
    streak: number;
    lastActiveDate: Date;
  };
};

export type SuggestedTask = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  difficulty: DifficultyLevel;
  estimatedTime: number; // minutes
  requiredLevel: number;
  points: number;
  suggestedTimeSlots: {
    day: number;
    time: TimeOfDay;
    reason: string;
  }[];
  matchScore: number; // 0-100, độ phù hợp với user
  tips: string[];
  prerequisites?: string[];
};

export type TaskTemplate = {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  baseDifficulty: DifficultyLevel;
  estimatedTime: number;
  minLevel: number;
  maxLevel: number;
  basePoints: number;
  variations?: {
    level: number;
    modifier: {
      title?: string;
      description?: string;
      time?: number;
      points?: number;
    };
  }[];
  // Thông tin chi tiết để nộp bằng chứng
  evidenceRequirements?: {
    type: 'image' | 'video' | 'text' | 'mixed';
    description: string;
    examples: string[];
    minimumCount: number;
  };
  successCriteria?: string[];
  detailedSteps?: string[];
};
