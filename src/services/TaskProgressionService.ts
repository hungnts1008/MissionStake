import { TaskCategory, UserProfile } from '../types/ai-types';
import { taskTemplates } from '../data/taskTemplates';

/**
 * Service quản lý progression của tasks
 * Tự động unlock nhiệm vụ khó hơn khi hoàn thành nhiệm vụ dễ
 */
export class TaskProgressionService {
  /**
   * Lấy danh sách tasks có sẵn dựa trên level của user
   * Mỗi category trả về tối đa 3 tasks
   */
  static getAvailableTasks(userProfile: UserProfile, category?: TaskCategory): any[] {
    const userLevels = userProfile.currentLevel;
    
    // Nếu có category cụ thể, chỉ lấy tasks từ category đó
    const templates = category 
      ? taskTemplates.filter(t => t.category === category)
      : taskTemplates;

    // Nhóm tasks theo category
    const tasksByCategory: Record<string, any[]> = {};
    
    templates.forEach(template => {
      const cat = template.category;
      const userLevel = userLevels[cat] || 1;
      
      // Chỉ lấy tasks phù hợp với level hiện tại
      // Cho phép tasks từ level hiện tại đến level + 10
      if (userLevel >= template.minLevel - 2 && userLevel <= template.maxLevel + 5) {
        if (!tasksByCategory[cat]) {
          tasksByCategory[cat] = [];
        }
        
        // Tính độ ưu tiên: tasks gần level hiện tại có độ ưu tiên cao hơn
        const levelDiff = Math.abs(userLevel - template.minLevel);
        const priority = 100 - levelDiff;
        
        tasksByCategory[cat].push({
          ...template,
          priority,
          isUnlocked: userLevel >= template.minLevel,
          isRecommended: userLevel >= template.minLevel && userLevel <= template.minLevel + 5,
        });
      }
    });

    // Sắp xếp và lấy top 3 từ mỗi category
    const availableTasks: any[] = [];
    
    Object.keys(tasksByCategory).forEach(cat => {
      const tasks = tasksByCategory[cat]
        .sort((a, b) => {
          // Ưu tiên tasks đã unlock
          if (a.isUnlocked !== b.isUnlocked) {
            return a.isUnlocked ? -1 : 1;
          }
          // Sau đó sắp xếp theo priority
          return b.priority - a.priority;
        })
        .slice(0, 3); // Chỉ lấy 3 tasks mỗi category
      
      availableTasks.push(...tasks);
    });

    return availableTasks;
  }

  /**
   * Lấy task tiếp theo khi user hoàn thành một task
   */
  static getNextTask(
    completedTaskId: string, 
    category: TaskCategory, 
    userProfile: UserProfile
  ): any | null {
    const userLevel = userProfile.currentLevel[category] || 1;
    
    // Tìm tasks cùng category và level cao hơn
    const nextTasks = taskTemplates
      .filter(t => 
        t.category === category && 
        t.minLevel > userLevel &&
        t.minLevel <= userLevel + 10 // Chỉ lấy tasks không quá khó
      )
      .sort((a, b) => a.minLevel - b.minLevel);
    
    return nextTasks[0] || null;
  }

  /**
   * Kiểm tra xem có nên unlock nhiệm vụ mới sau khi hoàn thành task
   */
  static shouldUnlockNewTask(
    completedTaskCategory: TaskCategory,
    userProfile: UserProfile
  ): boolean {
    const userLevel = userProfile.currentLevel[completedTaskCategory] || 1;
    
    // Unlock task mới mỗi khi level tăng 5
    return userLevel % 5 === 0;
  }

  /**
   * Lấy danh sách tasks đã bị lock (chưa đủ level)
   */
  static getLockedTasks(userProfile: UserProfile, category?: TaskCategory): any[] {
    const userLevels = userProfile.currentLevel;
    
    const templates = category 
      ? taskTemplates.filter(t => t.category === category)
      : taskTemplates;

    return templates
      .filter(template => {
        const userLevel = userLevels[template.category] || 1;
        return userLevel < template.minLevel;
      })
      .map(template => ({
        ...template,
        levelRequired: template.minLevel,
        levelNeeded: template.minLevel - (userLevels[template.category] || 1),
      }));
  }

  /**
   * Tính số lượng tasks đã hoàn thành trong mỗi category
   */
  static getProgressByCategory(userProfile: UserProfile): Record<TaskCategory, {
    completed: number;
    total: number;
    percentage: number;
  }> {
    const progress: any = {};
    
    const categories: TaskCategory[] = [
      'đời sống', 'học tập', 'thể thao', 'sức khỏe',
      'tài chính', 'sáng tạo', 'công việc', 'xã hội'
    ];

    categories.forEach(category => {
      const totalTasks = taskTemplates.filter(t => t.category === category).length;
      const completedTasks = userProfile.completedTasks.filter(
        t => t.category === category
      ).length;
      
      progress[category] = {
        completed: completedTasks,
        total: totalTasks,
        percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      };
    });

    return progress;
  }

  /**
   * Suggest tasks cho beginner (level 1-10)
   */
  static getBeginnerTasks(category: TaskCategory): any[] {
    return taskTemplates
      .filter(t => t.category === category && t.minLevel <= 10)
      .sort((a, b) => a.minLevel - b.minLevel)
      .slice(0, 3);
  }

  /**
   * Suggest tasks cho intermediate (level 11-50)
   */
  static getIntermediateTasks(category: TaskCategory, userLevel: number): any[] {
    return taskTemplates
      .filter(t => 
        t.category === category && 
        t.minLevel >= 10 && 
        t.minLevel <= userLevel + 10 &&
        t.minLevel <= 50
      )
      .sort((a, b) => a.minLevel - b.minLevel)
      .slice(0, 3);
  }

  /**
   * Suggest tasks cho advanced (level 51+)
   */
  static getAdvancedTasks(category: TaskCategory, userLevel: number): any[] {
    return taskTemplates
      .filter(t => 
        t.category === category && 
        t.minLevel >= 50 &&
        t.minLevel <= userLevel + 15
      )
      .sort((a, b) => a.minLevel - b.minLevel)
      .slice(0, 3);
  }
}
