# 🎯 Task Management App - AI Task Recommendation System

## 📝 Tổng quan dự án

Ứng dụng quản lý nhiệm vụ với tính năng **AI đề xuất nhiệm vụ thông minh**, giúp người dùng:
- Đạt mục tiêu hiệu quả hơn thông qua việc tăng level từng bước
- Nhận gợi ý nhiệm vụ phù hợp dựa trên lịch trình cá nhân
- Phát triển đồng đều qua 8 lĩnh vực khác nhau

---

## 🚀 Tính năng chính

### 1. ✨ AI Task Recommendations
- **Cá nhân hóa 100%**: Đề xuất dựa trên profile, level, lịch trình
- **8 Categories**: Đời sống, Học tập, Thể thao, Sức khỏe, Tài chính, Sáng tạo, Công việc, Xã hội
- **Level System**: 1-100 cho mỗi category
- **Smart Scheduling**: Gợi ý thời điểm tối ưu trong ngày
- **Match Score**: Tính toán độ phù hợp 0-100%

### 2. 📊 Level & Progression System
- **Progressive Difficulty**: Tự động tăng độ khó theo level
- **EXP System**: Công thức `100 × (1.1 ^ level)`
- **Task Variations**: Nhiệm vụ tự nâng cấp (2km → 5km → 10km)
- **Multi-category Leveling**: Level riêng cho từng lĩnh vực

### 3. 📅 Smart Scheduling
- **Weekly Schedule Manager**: Quản lý lịch trình chi tiết
- **Free Time Detection**: Tự động tìm khung giờ trống
- **Optimal Time Suggestions**: Đề xuất thời điểm phù hợp nhất
- **Activity-based Recommendations**: Gợi ý dựa trên hoạt động

### 4. 💡 Personalized Tips
- **Category-specific**: Tips riêng cho từng danh mục
- **Level-adaptive**: Thay đổi theo trình độ
- **Best Practices**: Kinh nghiệm từ cộng đồng

---

## 🏗️ Kiến trúc hệ thống

### Frontend Structure
```
src/
├── types/
│   └── ai-types.ts              # TypeScript definitions
├── data/
│   └── taskTemplates.ts         # 40+ task templates
├── services/
│   └── TaskRecommendationAI.ts  # AI Engine
├── components/
│   ├── AITaskSuggestions.tsx    # Main UI
│   ├── ScheduleManager.tsx      # Schedule editor
│   ├── Dashboard.tsx            # Entry point
│   └── ...
└── App.tsx
```

### Core Components

#### 1. **TaskRecommendationAI** (AI Engine)
- `getSuggestedTasks()`: Main recommendation algorithm
- `calculateMatchScore()`: Scoring algorithm (0-100)
- `findOptimalTimeSlots()`: Schedule analysis
- `updateUserLevel()`: Level progression
- `generateTips()`: Personalized advice

#### 2. **Task Templates Database**
- 40+ pre-defined tasks
- 8 categories
- 4 difficulty levels
- Progressive variations

#### 3. **AITaskSuggestions** (UI Component)
- Task display & filtering
- Detailed task view with tabs
- Real-time match score calculation
- Accept/reject functionality

---

## 🧮 Thuật toán AI

### Match Score Calculation

```typescript
Match Score = Base(50)
  + Category Preference (30)
  + Level Matching (25)
  + Time Availability (20)
  + Recent Activity (15)
  + Streak Bonus (10)
```

**Chi tiết**:

1. **Category Preference** (0-30 điểm)
   - +30: Favorite category
   - -20: Avoid category
   - 0: Neutral

2. **Level Matching** (0-25 điểm)
   - +25: Perfect match (level diff = 0)
   - +15: Good match (diff ≤ 3)
   - +5: OK match (diff ≤ 7)
   - 0: Poor match

3. **Time Availability** (0-20 điểm)
   - +20: Task time ≤ available time
   - +10: Task time ≤ 1.5x available
   - 0: Task time > 1.5x available

4. **Recent Activity** (0-15 điểm)
   - +15: No recent completion (try new)
   - +10: < 3 times in 7 days
   - +5: ≥ 3 times (already active)

5. **Streak Bonus** (0-10 điểm)
   - +10: Streak > 7 days
   - +5: Streak > 3 days
   - 0: Streak ≤ 3 days

### Time Slot Recommendation

**Algorithm**:
1. Parse user's schedule for the week
2. Identify free time slots (6:00 - 23:00)
3. Match task duration with available slots
4. Rank by time-of-day suitability:
   - Morning: Sport, Study
   - Afternoon: Work, Study
   - Evening: Creative, Social
   - Night: Health, Relax

**Output**: Top 5 time slots with reasons

### Level Progression

**Formula**:
```
EXP Needed = 100 × (1.1 ^ current_level)
EXP Earned = points × difficulty_multiplier

Difficulty Multipliers:
- Beginner: 1.0x
- Intermediate: 1.5x
- Advanced: 2.0x
- Expert: 3.0x
```

**Example**:
```
Complete "Chạy 5km" (150 points, Intermediate)
→ EXP = 150 × 1.5 = 225 EXP

Level 10 → 11: needs 259 EXP
225 EXP earned → Still Level 10 (34 EXP short)
```

---

## 📊 Data Models

### UserProfile
```typescript
{
  id: string;
  currentLevel: {
    [category]: number;  // 1-100
  };
  completedTasks: Task[];
  schedule: UserSchedule[];
  preferences: {
    favoriteCategories: TaskCategory[];
    avoidCategories: TaskCategory[];
    dailyTimeCommitment: number;
  };
  stats: {
    totalPoints: number;
    streak: number;
    lastActiveDate: Date;
  };
}
```

### TaskTemplate
```typescript
{
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  baseDifficulty: DifficultyLevel;
  estimatedTime: number;  // minutes
  minLevel: number;
  maxLevel: number;
  basePoints: number;
  variations?: {
    level: number;
    modifier: {...}
  }[];
}
```

### SuggestedTask
```typescript
{
  ...TaskTemplate,
  matchScore: number;  // 0-100
  suggestedTimeSlots: {
    day: number;
    time: TimeOfDay;
    reason: string;
  }[];
  tips: string[];
  prerequisites?: string[];
}
```

---

## 🎨 UI/UX Features

### Visual Design
- **Gradient cards** với màu riêng cho mỗi category
- **Match score** hiển thị nổi bật (0-100)
- **Progress bars** cho level
- **Badge system** cho difficulty và category

### Interactions
- **Click to expand**: Xem chi tiết task
- **Tab navigation**: Schedule / Tips / Prerequisites
- **Filter by category**: Quick filtering
- **Smooth animations**: Hover effects, transitions

### Information Architecture
```
Dashboard
  └─ AI Đề Xuất Button
      └─ AI Task Suggestions Page
          ├─ Level Overview (4 categories)
          ├─ Category Filters
          └─ Task Cards
              ├─ Basic Info
              └─ Expanded View
                  ├─ Schedule Tab
                  ├─ Tips Tab
                  └─ Prerequisites Tab
```

---

## 🔧 Technical Stack

### Core Technologies
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Lucide React** icons

### Key Libraries
- `class-variance-authority`: Variant styling
- `tailwind-merge`: Utility merging
- Radix UI primitives (dialogs, tabs, etc.)

### Development
- **PostCSS** with Tailwind plugin
- **ES Modules**
- Type-safe with **TypeScript**

---

## 📈 Performance Optimizations

### Algorithm Complexity
- **Filtering**: O(n) - linear scan
- **Scoring**: O(n) - per task calculation
- **Sorting**: O(n log n) - by match score
- **Total**: O(n log n)

### Caching Strategies
- Cache user profile (avoid recalculation)
- Cache task templates (static data)
- Memoize scoring functions
- Lazy load task details

### Scalability
- Template-based: Easy to add 1000+ tasks
- Category-based filtering: Reduces search space
- Configurable scoring weights: Easy tuning

---

## 🚦 Getting Started

### Installation
```bash
cd "F:\Code\Hackathon\Thuan_Brute_Force\Task Management App"
npm install
npm run dev
```

### Usage
1. Login to app
2. Click "AI Đề Xuất" on Dashboard
3. Browse suggested tasks
4. Click to expand and see details
5. Accept task to add to your missions

### Configuration
Edit `src/services/TaskRecommendationAI.ts` to adjust:
- Scoring weights
- Time slot preferences
- Level progression formula
- Tips generation logic

---

## 🔮 Future Enhancements

### 1. Machine Learning
- **User behavior analysis**: Learn from completion patterns
- **Predictive modeling**: Forecast success probability
- **Collaborative filtering**: Recommendations based on similar users
- **A/B testing**: Optimize algorithm parameters

### 2. Advanced Features
- **Goal trees**: Break down large goals into sub-tasks
- **Habit tracking**: Long-term consistency monitoring
- **Social challenges**: Compete with friends
- **Achievement system**: Unlock badges and rewards

### 3. Analytics
- **Completion rate analysis**: By category, time, difficulty
- **Optimal schedule suggestions**: Best times for each user
- **Performance insights**: Strengths and improvement areas
- **Trend visualization**: Progress over time

### 4. Integration
- **Calendar sync**: Google/Outlook integration
- **Fitness trackers**: Auto-log exercise tasks
- **LMS integration**: Course completion tracking
- **Banking APIs**: Financial goal tracking

---

## 📚 Documentation

- **[AI_SYSTEM_README.md](./AI_SYSTEM_README.md)**: Technical documentation
- **[USER_GUIDE.md](./USER_GUIDE.md)**: User manual
- **[README.md](./README.md)**: Project overview

---

## 🤝 Contributing

### Adding New Task Templates
1. Edit `src/data/taskTemplates.ts`
2. Add new TaskTemplate object
3. Include variations for progression
4. Test with different user levels

### Adjusting AI Algorithm
1. Modify scoring weights in `TaskRecommendationAI.ts`
2. Update `calculateMatchScore()` logic
3. Test with various user profiles
4. Monitor match score distribution

---

## 📝 License

[Add your license here]

---

## 👥 Team

[Add team members here]

---

## 🎉 Conclusion

Hệ thống AI Task Recommendation mang lại:
- ✅ **Cá nhân hóa cao**: Mỗi user có đề xuất riêng
- ✅ **Phát triển toàn diện**: 8 lĩnh vực khác nhau
- ✅ **Tối ưu thời gian**: Smart scheduling
- ✅ **Động lực bền vững**: Level & streak system
- ✅ **Dễ mở rộng**: Template-based architecture

**Start using today and achieve your goals smarter! 🚀**
