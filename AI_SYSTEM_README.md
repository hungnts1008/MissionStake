# Hệ thống AI Đề xuất Nhiệm vụ

## Tổng quan

Hệ thống AI đề xuất nhiệm vụ được thiết kế để cung cấp các nhiệm vụ được cá nhân hóa cho người dùng dựa trên:
- **Level hiện tại** trong từng category
- **Lịch trình** hoạt động hàng ngày
- **Sở thích** cá nhân
- **Lịch sử** hoàn thành nhiệm vụ

## Cấu trúc

### 1. Categories (Danh mục)

Hệ thống chia nhiệm vụ thành 8 danh mục chính:

- 🏠 **Đời sống**: Các công việc nhà, sinh hoạt hàng ngày
- 📚 **Học tập**: Đọc sách, học ngoại ngữ, khóa học online
- ⚽ **Thể thao**: Chạy bộ, gym, yoga, bơi lội
- 💚 **Sức khỏe**: Thiền định, uống nước, ngủ đủ giấc
- 💰 **Tài chính**: Tiết kiệm, quản lý chi tiêu, đầu tư
- 🎨 **Sáng tạo**: Vẽ tranh, viết blog, nhiếp ảnh
- 💼 **Công việc**: Hoàn thành task, học kỹ năng mềm
- 👥 **Xã hội**: Gặp gỡ bạn bè, thiện nguyện, networking

### 2. Level System

Mỗi category có hệ thống level riêng (1-100):

- **Level 1-20**: Người mới bắt đầu
- **Level 21-40**: Trung bình
- **Level 41-70**: Nâng cao  
- **Level 71-100**: Chuyên gia

**Cách tăng level**:
- Hoàn thành nhiệm vụ → Nhận điểm (points)
- Điểm được chuyển thành EXP
- Đủ EXP → Lên level
- Công thức: `EXP cần = 100 × (1.1 ^ level hiện tại)`

**Ví dụ**:
```
Level 1 → Level 2: cần 100 EXP
Level 10 → Level 11: cần 259 EXP
Level 50 → Level 51: cần 11,739 EXP
```

### 3. Difficulty Levels (Độ khó)

- **Beginner** (Mới bắt đầu): x1.0 điểm
- **Intermediate** (Trung bình): x1.5 điểm
- **Advanced** (Nâng cao): x2.0 điểm
- **Expert** (Chuyên gia): x3.0 điểm

### 4. Task Templates

Mỗi task template bao gồm:

```typescript
{
  id: string;           // ID duy nhất
  title: string;        // Tiêu đề
  description: string;  // Mô tả
  category: TaskCategory;
  baseDifficulty: DifficultyLevel;
  estimatedTime: number;  // Phút
  minLevel: number;       // Level tối thiểu
  maxLevel: number;       // Level tối đa
  basePoints: number;     // Điểm cơ bản
  variations?: [...]      // Biến thể theo level
}
```

**Variations** (Biến thể):
- Khi user đạt level cao hơn, task sẽ tự động nâng cấp
- Ví dụ: "Chạy 2km" → "Chạy 5km" → "Chạy 10km"

## Thuật toán AI

### Match Score (Điểm phù hợp 0-100)

AI tính điểm phù hợp dựa trên 5 yếu tố:

1. **Category Preference (30 điểm)**
   - +30 nếu là category yêu thích
   - -20 nếu là category tránh

2. **Level Matching (25 điểm)**
   - +25 nếu level chênh lệch 0
   - +15 nếu chênh lệch ≤ 3
   - +5 nếu chênh lệch ≤ 7

3. **Time Availability (20 điểm)**
   - +20 nếu thời gian task ≤ thời gian có sẵn
   - +10 nếu thời gian task ≤ 1.5x thời gian có sẵn

4. **Recent Activity (15 điểm)**
   - +15 nếu chưa làm category này gần đây
   - +10 nếu làm < 3 lần trong 7 ngày
   - +5 nếu làm ≥ 3 lần

5. **Streak Bonus (10 điểm)**
   - +10 nếu streak > 7 ngày
   - +5 nếu streak > 3 ngày

### Suggested Time Slots

AI tìm khung giờ tối ưu bằng cách:

1. Phân tích lịch trình hàng ngày của user
2. Tìm các khoảng thời gian trống
3. Khớp với thời gian cần thiết của task
4. Đề xuất thời điểm phù hợp nhất dựa trên:
   - **Buổi sáng**: Thể thao, học tập
   - **Buổi chiều**: Công việc, học tập
   - **Buổi tối**: Sáng tạo, xã hội
   - **Đêm**: Thư giãn, sức khỏe

### Tips Generation

AI tạo tips dựa trên:
- Category của task
- Level hiện tại của user
- Best practices chung

## Cách sử dụng

### 1. Khởi tạo User Profile

```typescript
const userProfile: UserProfile = {
  id: "user_123",
  currentLevel: {
    'thể thao': 15,
    'học tập': 25,
    // ...
  },
  schedule: [
    {
      dayOfWeek: 1,
      timeSlots: [
        { start: '09:00', end: '12:00', activity: 'Làm việc' }
      ]
    }
  ],
  preferences: {
    favoriteCategories: ['thể thao', 'học tập'],
    avoidCategories: [],
    dailyTimeCommitment: 90 // minutes
  },
  // ...
};
```

### 2. Lấy đề xuất

```typescript
import { TaskRecommendationAI } from './services/TaskRecommendationAI';

const suggestions = TaskRecommendationAI.getSuggestedTasks(
  userProfile,
  10 // Số lượng task muốn lấy
);
```

### 3. Cập nhật level sau khi hoàn thành

```typescript
const updatedProfile = TaskRecommendationAI.updateUserLevel(
  userProfile,
  {
    category: 'thể thao',
    points: 150,
    difficulty: 'intermediate'
  }
);
```

## Các tính năng nâng cao

### 1. Dynamic Difficulty Adjustment
- Task tự động điều chỉnh độ khó dựa trên level user
- User level < 30: Giảm 1 bậc độ khó
- User level > 50: Tăng 1 bậc độ khó

### 2. Progressive Variations
- Task có nhiều biến thể tùy theo level
- Tự động unlock khi đủ level

### 3. Smart Scheduling
- Phân tích lịch trình để tìm thời gian tối ưu
- Đề xuất thời điểm phù hợp nhất với loại task

### 4. Personalized Tips
- Mẹo được tùy chỉnh theo category và level
- Cập nhật dựa trên tiến độ của user

## Mở rộng trong tương lai

### 1. Machine Learning
- Học từ hành vi người dùng
- Dự đoán task user có khả năng hoàn thành cao nhất

### 2. Social Features
- Đề xuất dựa trên bạn bè
- Challenge recommendations
- Group tasks

### 3. Advanced Analytics
- Phân tích thời gian hoàn thành task hiệu quả nhất
- Tối ưu hóa lịch trình
- Predictive insights

### 4. Gamification
- Achievements khi đạt milestone
- Special tasks cho các sự kiện
- Seasonal challenges

## Technical Details

### Performance
- O(n) cho filtering
- O(n log n) cho sorting
- Có thể cache suggestions để giảm tính toán

### Scalability
- Template-based: Dễ thêm task mới
- Modular design: Dễ mở rộng categories
- Configurable scoring: Điều chỉnh weights

### Data Storage
Cần lưu trữ:
- User profiles với levels
- Task completion history
- Schedule data
- Preferences

## Example Output

```javascript
{
  id: "suggested_sport_1_1234567890",
  title: "Chạy bộ 5km",
  description: "Chạy bộ để cải thiện sức khỏe tim mạch",
  category: "thể thao",
  difficulty: "intermediate",
  estimatedTime: 35,
  requiredLevel: 10,
  points: 150,
  matchScore: 87,
  suggestedTimeSlots: [
    {
      day: 1,
      time: "morning",
      reason: "Buổi sáng là thời điểm tốt nhất để tập luyện"
    }
  ],
  tips: [
    "Khởi động kỹ trước khi tập",
    "Uống đủ nước trong quá trình tập luyện",
    "Tăng dần độ khó để thử thách bản thân"
  ]
}
```

## Contact & Support

Để góp ý hoặc báo lỗi, vui lòng liên hệ team phát triển.
