import {
  TaskCategory,
  UserProfile,
  SuggestedTask,
  TimeOfDay,
  DifficultyLevel,
  UserSchedule,
} from '../types/ai-types';
import { taskTemplates } from '../data/taskTemplates';

/**
 * AI Engine để đề xuất nhiệm vụ cho người dùng
 * Dựa trên: level, lịch trình, sở thích, lịch sử hoàn thành
 */
export class TaskRecommendationAI {
  /**
   * Hàm chính để lấy danh sách nhiệm vụ được đề xuất
   */
  static getSuggestedTasks(
    userProfile: UserProfile,
    limit: number = 10
  ): SuggestedTask[] {
    const suggestions: SuggestedTask[] = [];

    // Lọc các task phù hợp với level của user
    const eligibleTasks = this.filterByUserLevel(userProfile);

    // Tính điểm match cho mỗi task
    eligibleTasks.forEach((template) => {
      const matchScore = this.calculateMatchScore(template, userProfile);
      const suggestedTimeSlots = this.findOptimalTimeSlots(
        template,
        userProfile
      );

      // Apply variations dựa trên level
      const currentLevel = userProfile.currentLevel[template.category] || 1;
      const appliedTemplate = this.applyLevelVariation(
        template,
        currentLevel
      );

      const suggestedTask: SuggestedTask = {
        id: `suggested_${template.id}_${Date.now()}`,
        title: appliedTemplate.title,
        description: appliedTemplate.description,
        category: template.category,
        difficulty: this.adjustDifficulty(
          template.baseDifficulty,
          currentLevel
        ),
        estimatedTime: appliedTemplate.estimatedTime,
        requiredLevel: template.minLevel,
        points: this.calculatePoints(appliedTemplate, currentLevel),
        suggestedTimeSlots,
        matchScore,
        tips: this.generateTips(template, userProfile),
        prerequisites: this.getPrerequisites(template, userProfile),
      };

      suggestions.push(suggestedTask);
    });

    // Sắp xếp theo match score và lấy top N
    return suggestions
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  /**
   * Lọc task phù hợp với level của user
   */
  private static filterByUserLevel(userProfile: UserProfile) {
    return taskTemplates.filter((template) => {
      const userLevel = userProfile.currentLevel[template.category] || 1;
      return (
        userLevel >= template.minLevel - 5 && // Cho phép task khó hơn 5 level
        userLevel <= template.maxLevel + 5 // Cho phép task dễ hơn để ôn tập
      );
    });
  }

  /**
   * Tính điểm phù hợp (0-100) dựa trên nhiều yếu tố
   */
  private static calculateMatchScore(template: any, userProfile: UserProfile): number {
    let score = 50; // Base score

    // 1. Category preference (30 points)
    if (userProfile.preferences.favoriteCategories.includes(template.category)) {
      score += 30;
    } else if (userProfile.preferences.avoidCategories.includes(template.category)) {
      score -= 20;
    }

    // 2. Level matching (25 points)
    const userLevel = userProfile.currentLevel[template.category as TaskCategory] || 1;
    const levelDiff = Math.abs(userLevel - template.minLevel);
    if (levelDiff === 0) {
      score += 25;
    } else if (levelDiff <= 3) {
      score += 15;
    } else if (levelDiff <= 7) {
      score += 5;
    }

    // 3. Time availability (20 points)
    const dailyTime = userProfile.preferences.dailyTimeCommitment;
    if (template.estimatedTime <= dailyTime) {
      score += 20;
    } else if (template.estimatedTime <= dailyTime * 1.5) {
      score += 10;
    }

    // 4. Recent activity (15 points)
    const recentCompletions = this.getRecentCompletions(
      userProfile,
      template.category,
      7
    );
    if (recentCompletions.length === 0) {
      score += 15; // Khuyến khích thử category mới
    } else if (recentCompletions.length < 3) {
      score += 10;
    } else {
      score += 5; // Đã hoạt động nhiều trong category này
    }

    // 5. Streak bonus (10 points)
    if (userProfile.stats.streak > 7) {
      score += 10;
    } else if (userProfile.stats.streak > 3) {
      score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Tìm các khung giờ tối ưu để làm task
   */
  private static findOptimalTimeSlots(template: any, userProfile: UserProfile) {
    const slots: any[] = [];

    userProfile.schedule.forEach((daySchedule) => {
      // Tìm free time slots
      const freeSlots = this.findFreeTimeSlots(
        daySchedule,
        template.estimatedTime
      );

      freeSlots.forEach((slot) => {
        const timeOfDay = this.getTimeOfDay(slot.start);
        const reason = this.getReasonForTimeSlot(
          template.category,
          timeOfDay
        );

        slots.push({
          day: daySchedule.dayOfWeek,
          time: timeOfDay,
          reason,
        });
      });
    });

    return slots.slice(0, 5); // Top 5 time slots
  }

  /**
   * Tìm các khoảng thời gian trống
   */
  private static findFreeTimeSlots(
    schedule: UserSchedule,
    requiredMinutes: number
  ) {
    const freeSlots: { start: string; end: string }[] = [];
    const dayMinutes = 24 * 60;

    // Giả sử một ngày từ 6:00 - 23:00
    const workingStart = 6 * 60; // 6:00 AM
    const workingEnd = 23 * 60; // 11:00 PM

    let currentTime = workingStart;

    // Sắp xếp time slots theo thời gian
    const sortedSlots = [...schedule.timeSlots].sort((a, b) => {
      return this.timeToMinutes(a.start) - this.timeToMinutes(b.start);
    });

    sortedSlots.forEach((slot) => {
      const slotStart = this.timeToMinutes(slot.start);
      const slotEnd = this.timeToMinutes(slot.end);

      // Nếu có khoảng trống trước slot này
      if (slotStart - currentTime >= requiredMinutes) {
        freeSlots.push({
          start: this.minutesToTime(currentTime),
          end: this.minutesToTime(slotStart),
        });
      }

      currentTime = Math.max(currentTime, slotEnd);
    });

    // Kiểm tra khoảng trống cuối ngày
    if (workingEnd - currentTime >= requiredMinutes) {
      freeSlots.push({
        start: this.minutesToTime(currentTime),
        end: this.minutesToTime(workingEnd),
      });
    }

    return freeSlots;
  }

  /**
   * Chuyển thời gian "HH:MM" sang phút
   */
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Chuyển phút sang thời gian "HH:MM"
   */
  private static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * Xác định thời điểm trong ngày
   */
  private static getTimeOfDay(time: string): TimeOfDay {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Giải thích tại sao nên làm task vào thời điểm này
   */
  private static getReasonForTimeSlot(
    category: TaskCategory,
    timeOfDay: TimeOfDay
  ): string {
    const reasons: Record<TaskCategory, Record<TimeOfDay, string>> = {
      'thể thao': {
        morning: 'Buổi sáng là thời điểm tốt nhất để tập luyện, tăng năng lượng cả ngày',
        afternoon: 'Chiều là lúc cơ thể đạt hiệu suất cao nhất',
        evening: 'Tập buổi tối giúp giảm stress sau một ngày làm việc',
        night: 'Tập nhẹ buổi tối giúp ngủ ngon hơn',
      },
      'học tập': {
        morning: 'Buổi sáng đầu óc tỉnh táo, dễ tiếp thu kiến thức mới',
        afternoon: 'Sau giấc ngủ trưa là lúc tốt để học tập hiệu quả',
        evening: 'Buổi tối yên tĩnh, dễ tập trung vào việc học',
        night: 'Học vào buổi tối giúp củng cố kiến thức trước khi ngủ',
      },
      'đời sống': {
        morning: 'Bắt đầu ngày mới với năng lượng tích cực',
        afternoon: 'Thời điểm phù hợp để xử lý các công việc nhà',
        evening: 'Kết thúc ngày với những hoạt động thư giãn',
        night: 'Chuẩn bị cho ngày mai một cách thoải mái',
      },
      'sức khỏe': {
        morning: 'Bắt đầu ngày với thói quen tốt cho sức khỏe',
        afternoon: 'Duy trì năng lượng suốt cả ngày',
        evening: 'Thư giãn và phục hồi sau một ngày làm việc',
        night: 'Chuẩn bị cho một giấc ngủ ngon',
      },
      'tài chính': {
        morning: 'Đầu ngày là lúc tốt để lập kế hoạch tài chính',
        afternoon: 'Thời gian phù hợp để xem xét và điều chỉnh',
        evening: 'Tổng kết chi tiêu trong ngày',
        night: 'Lên kế hoạch cho ngày hôm sau',
      },
      'sáng tạo': {
        morning: 'Sáng sớm là lúc sáng tạo nhất trong ngày',
        afternoon: 'Sau khi nạp năng lượng, ý tưởng dễ đến hơn',
        evening: 'Không khí yên tĩnh kích thích sự sáng tạo',
        night: 'Đêm khuya là thời điểm của những ý tưởng độc đáo',
      },
      'công việc': {
        morning: 'Bắt đầu ngày làm việc với hiệu suất cao nhất',
        afternoon: 'Thời gian vàng để xử lý công việc quan trọng',
        evening: 'Hoàn thiện công việc còn dở dang',
        night: 'Lên kế hoạch cho ngày làm việc tiếp theo',
      },
      'xã hội': {
        morning: 'Bắt đầu ngày với kết nối tích cực',
        afternoon: 'Thời gian rảnh để gặp gỡ mọi người',
        evening: 'Buổi tối là lúc tốt nhất để giao lưu',
        night: 'Duy trì mối quan hệ qua các cuộc trò chuyện',
      },
    };

    return reasons[category]?.[timeOfDay] || 'Thời điểm phù hợp để thực hiện';
  }

  /**
   * Apply variation dựa trên level
   */
  private static applyLevelVariation(template: any, currentLevel: number) {
    if (!template.variations) {
      return template;
    }

    // Tìm variation phù hợp nhất
    const suitableVariation = template.variations
      .filter((v: any) => currentLevel >= v.level)
      .sort((a: any, b: any) => b.level - a.level)[0];

    if (suitableVariation) {
      return {
        ...template,
        title: suitableVariation.modifier.title || template.title,
        description:
          suitableVariation.modifier.description || template.description,
        estimatedTime:
          suitableVariation.modifier.time || template.estimatedTime,
        basePoints: suitableVariation.modifier.points || template.basePoints,
      };
    }

    return template;
  }

  /**
   * Điều chỉnh độ khó dựa trên level
   */
  private static adjustDifficulty(
    baseDifficulty: DifficultyLevel,
    userLevel: number
  ): DifficultyLevel {
    const difficultyLevels: DifficultyLevel[] = [
      'beginner',
      'intermediate',
      'advanced',
      'expert',
    ];
    const currentIndex = difficultyLevels.indexOf(baseDifficulty);

    if (userLevel > 50) {
      return difficultyLevels[Math.min(currentIndex + 1, 3)];
    } else if (userLevel > 30) {
      return baseDifficulty;
    } else {
      return difficultyLevels[Math.max(currentIndex - 1, 0)];
    }
  }

  /**
   * Tính điểm thưởng dựa trên level và độ khó
   */
  private static calculatePoints(template: any, userLevel: number): number {
    let points = template.basePoints;

    // Bonus theo level
    const levelBonus = Math.floor(userLevel / 10) * 10;
    points += levelBonus;

    // Bonus theo streak (giả sử có trong userProfile)
    // points += streakBonus;

    return points;
  }

  /**
   * Tạo tips cho user
   */
  private static generateTips(template: any, userProfile: UserProfile): string[] {
    const tips: string[] = [];
    const userLevel = userProfile.currentLevel[template.category as TaskCategory] || 1;

    // Tips chung
    tips.push('Hãy bắt đầu từ từ và tăng dần cường độ');

    // Tips theo category
    const categoryTips: Record<TaskCategory, string[]> = {
      'thể thao': [
        'Khởi động kỹ trước khi tập',
        'Uống đủ nước trong quá trình tập luyện',
        'Nghỉ ngơi hợp lý giữa các set',
      ],
      'học tập': [
        'Tạo môi trường yên tĩnh để học',
        'Sử dụng kỹ thuật Pomodoro (25 phút tập trung)',
        'Ghi chú lại những điểm quan trọng',
      ],
      'đời sống': [
        'Lập danh sách công việc cần làm',
        'Hoàn thành từng việc một, không làm nhiều việc cùng lúc',
        'Thưởng cho bản thân sau khi hoàn thành',
      ],
      'sức khỏe': [
        'Duy trì thói quen đều đặn',
        'Lắng nghe cơ thể của bạn',
        'Kết hợp với chế độ ăn lành mạnh',
      ],
      'tài chính': [
        'Ghi chép chi tiết mọi khoản chi',
        'Đặt mục tiêu cụ thể và rõ ràng',
        'Xem xét lại kế hoạch định kỳ',
      ],
      'sáng tạo': [
        'Đừng sợ thất bại, mọi ý tưởng đều có giá trị',
        'Tìm kiếm cảm hứng từ xung quanh',
        'Luyện tập thường xuyên để cải thiện',
      ],
      'công việc': [
        'Ưu tiên công việc quan trọng nhất',
        'Loại bỏ các yếu tố gây xao nhãng',
        'Nghỉ ngơi ngắn sau mỗi 2 giờ làm việc',
      ],
      'xã hội': [
        'Lắng nghe chân thành',
        'Thể hiện sự quan tâm thực sự',
        'Duy trì liên lạc đều đặn',
      ],
    };

    const specificTips = categoryTips[template.category as TaskCategory] || [];
    tips.push(...specificTips.slice(0, 2));

    // Tips theo level
    if (userLevel < 10) {
      tips.push('Bạn đang ở giai đoạn đầu, hãy tập trung vào việc tạo thói quen');
    } else if (userLevel < 30) {
      tips.push('Tăng dần độ khó để thử thách bản thân');
    } else {
      tips.push('Bạn đã rất giỏi! Hãy thử những thử thách nâng cao hơn');
    }

    return tips;
  }

  /**
   * Lấy prerequisites (điều kiện tiên quyết)
   */
  private static getPrerequisites(
    template: any,
    userProfile: UserProfile
  ): string[] | undefined {
    const userLevel = userProfile.currentLevel[template.category as TaskCategory] || 1;

    if (userLevel < template.minLevel) {
      return [
        `Cần đạt level ${template.minLevel} trong category ${template.category}`,
        `Bạn hiện tại đang ở level ${userLevel}`,
      ];
    }

    return undefined;
  }

  /**
   * Lấy các task đã hoàn thành gần đây
   */
  private static getRecentCompletions(
    userProfile: UserProfile,
    category: TaskCategory,
    days: number
  ) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return userProfile.completedTasks.filter(
      (task) =>
        task.category === category && task.completedAt >= cutoffDate
    );
  }

  /**
   * Cập nhật level sau khi hoàn thành task
   */
  static updateUserLevel(
    userProfile: UserProfile,
    completedTask: {
      category: TaskCategory;
      points: number;
      difficulty: DifficultyLevel;
    }
  ): UserProfile {
    const currentLevel = userProfile.currentLevel[completedTask.category] || 1;

    // Tính exp cần để lên level
    const expNeeded = this.getExpForNextLevel(currentLevel);
    const earnedExp = this.calculateExp(
      completedTask.points,
      completedTask.difficulty
    );

    // Cập nhật level
    let newLevel = currentLevel;
    let remainingExp = earnedExp;

    while (remainingExp >= expNeeded) {
      remainingExp -= expNeeded;
      newLevel++;
    }

    return {
      ...userProfile,
      currentLevel: {
        ...userProfile.currentLevel,
        [completedTask.category]: newLevel,
      },
      completedTasks: [
        ...userProfile.completedTasks,
        {
          ...completedTask,
          completedAt: new Date(),
        },
      ],
      stats: {
        ...userProfile.stats,
        totalPoints: userProfile.stats.totalPoints + completedTask.points,
      },
    };
  }

  /**
   * Tính exp cần để lên level tiếp theo
   */
  private static getExpForNextLevel(currentLevel: number): number {
    // Công thức tăng dần: baseExp * (1.1 ^ level)
    const baseExp = 100;
    return Math.floor(baseExp * Math.pow(1.1, currentLevel));
  }

  /**
   * Tính exp từ points và difficulty
   */
  private static calculateExp(points: number, difficulty: DifficultyLevel): number {
    const difficultyMultiplier: Record<DifficultyLevel, number> = {
      beginner: 1.0,
      intermediate: 1.5,
      advanced: 2.0,
      expert: 3.0,
    };

    return Math.floor(points * difficultyMultiplier[difficulty]);
  }
}
