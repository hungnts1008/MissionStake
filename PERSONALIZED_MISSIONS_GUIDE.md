# 🎯 Hướng dẫn sử dụng Nhiệm vụ cá nhân hóa (Personalized Missions)

## 📋 Tổng quan
Tính năng nhiệm vụ cá nhân hóa sử dụng AI Gemini để tạo ra các nhiệm vụ phù hợp với sở thích, kỹ năng và mục tiêu của người dùng.

## 🎨 Kiến trúc tính năng

### 1. **User Preferences Editor** (Hồ sơ cá nhân)
- **Vị trí**: Profile → Tab "Cài đặt"
- **Chức năng**: 
  - Thiết lập sở thích cá nhân
  - Chọn cấp độ kỹ năng (beginner/intermediate/advanced)
  - Đặt thời gian rảnh hằng ngày (15-240 phút)
  - Định nghĩa mục tiêu cá nhân
  - Đặt các chủ đề muốn tránh
- **Lưu trữ**: localStorage với key `userPreferences`

### 2. **Personalized Missions Generator** (AI đề xuất nhiệm vụ)
- **Vị trí**: AI Task Suggestions → Section đầu tiên
- **Chức năng**:
  - Nút "Tạo nhiệm vụ cá nhân hóa" - Generate 3 missions dựa trên preferences
  - Hiển thị missions với đầy đủ thông tin
  - Nút "Reroll" trên mỗi mission để tạo lại nhiệm vụ khác
  - Giới hạn 3 rerolls/ngày/user
  - Nút "Nhận nhiệm vụ" để chấp nhận mission

## 🔧 Các thành phần kỹ thuật

### PersonalizedMissionService.ts
```typescript
// Các phương thức chính:
- generatePersonalizedMissions(preferences, count): Tạo missions mới
- rerollMission(currentMission, preferences, reason): Tạo lại mission
- canReroll(userId): Kiểm tra còn reroll không
- trackReroll(userId): Ghi nhận reroll (localStorage)
- getContextualRecommendations(preferences, context): Gợi ý theo ngữ cảnh
```

### UserPreferencesEditor.tsx
Component hiển thị form nhập preferences trong Profile/Settings:
- Interests: Tag-based input
- Skill level: Select dropdown
- Available time: Slider (15-240 min)
- Goals: Tag-based input
- Avoid topics: Tag-based input
- Nút "Lưu sở thích" với feedback 3 giây

### AITaskSuggestions.tsx
Component đã được mở rộng với:
- State management cho personalized missions
- Handler `handleGeneratePersonalized()`: Load preferences từ localStorage, gọi AI
- Handler `handleRerollMission(index)`: Reroll mission cụ thể
- UI section hiển thị personalized missions với badges, tags, reasoning
- Kiểm tra preferences trước khi generate (redirect về Profile nếu chưa set)

## 📝 Flow hoạt động

### Lần đầu sử dụng:
1. User vào **Profile** → Tab **"Cài đặt"**
2. Điền thông tin vào **User Preferences Editor**
3. Nhấn **"Lưu sở thích"**
4. Quay về **AI Task Suggestions**
5. Nhấn **"Tạo nhiệm vụ cá nhân hóa"**
6. Xem 3 missions được generate

### Reroll mission:
1. Xem mission được AI suggest
2. Nếu không thích → Nhấn nút **"Reroll"** trên mission đó
3. AI sẽ tạo mission khác thay thế
4. Giới hạn: 3 rerolls/ngày

### Nhận mission:
1. Nhấn nút **"Nhận nhiệm vụ"** trên mission muốn làm
2. System sẽ:
   - Kiểm tra user có đủ coins để stake không
   - Trừ coins từ tài khoản
   - Tạo Mission object và thêm vào danh sách
   - Chuyển về Dashboard

## 🎮 Cấu trúc dữ liệu

### UserPreferences (localStorage)
```typescript
{
  interests: string[],      // ["coding", "fitness", "reading"]
  skillLevel: string,       // "beginner" | "intermediate" | "advanced"
  availableTime: number,    // 15-240 minutes
  goals: string[],          // ["learn AI", "improve health"]
  avoidTopics?: string[]    // ["politics", "religion"]
}
```

### MissionSuggestion (AI response)
```typescript
{
  id: string,
  title: string,
  description: string,
  category: string,         // "học tập", "thể thao", etc.
  difficulty: string,       // "easy" | "medium" | "hard"
  estimatedTime: number,    // minutes
  rewards: {
    xp: number,
    coins: number
  },
  tags: string[],
  reasoning: string         // AI explanation
}
```

### Reroll tracking (localStorage)
```typescript
Key: `rerolls_${userId}`
Value: {
  count: number,           // 0-3
  lastReset: string        // ISO date
}
```

## 🔑 API Key Configuration

File `.env`:
```
VITE_GEMINI_API_KEY=AIzaSyCRPHP9A68uaF5fjjssYwODTvqcEWrLrjQ
```

Model sử dụng: `gemini-2.0-flash-exp`

## 🎯 Lợi ích của kiến trúc này

1. **Separation of concerns**:
   - Profile: Input preferences
   - AI Suggestions: Generate & display missions
   - Service: Business logic

2. **Data persistence**:
   - Preferences lưu trong localStorage
   - Reroll counter reset mỗi ngày
   - User không cần nhập lại preferences

3. **User experience**:
   - Clear workflow: Set preferences → Generate → Reroll → Accept
   - Visual feedback: Loading states, reroll counter
   - Reasoning display: User hiểu tại sao mission phù hợp

4. **Rate limiting**:
   - Tránh spam AI API
   - Giới hạn 3 rerolls/ngày/user
   - Automatic reset vào đầu ngày mới

## 🐛 Troubleshooting

### "Please set your preferences in your Profile first!"
- Nghĩa: User chưa thiết lập preferences
- Giải pháp: Vào Profile → Cài đặt → Điền form preferences

### "You have used all your rerolls for today!"
- Nghĩa: Đã dùng hết 3 rerolls
- Giải pháp: Đợi đến ngày mai hoặc chấp nhận missions hiện tại

### "Failed to generate personalized missions"
- Nguyên nhân: Lỗi API Gemini
- Giải pháp: Kiểm tra API key, network connection, thử lại

## 📊 Demo Flow

```
Profile Page (Settings Tab)
└── UserPreferencesEditor
    ├── Interests: ["coding", "AI", "health"]
    ├── Skill: intermediate
    ├── Time: 60 min/day
    ├── Goals: ["Learn ML", "Stay fit"]
    └── [Save Button] → localStorage

↓

AI Task Suggestions Page
└── Personalized Missions Section
    ├── [Generate Button] → Gemini API
    ├── Mission 1: "Build a simple ML model"
    │   ├── Category: học tập
    │   ├── Difficulty: intermediate
    │   ├── Time: 60 min
    │   ├── Rewards: 50 XP, 1000 coins
    │   ├── Reasoning: "Matches your goal to learn ML..."
    │   └── [Accept] [Reroll]
    ├── Mission 2: "Morning jogging routine"
    │   └── [Accept] [Reroll]
    └── Mission 3: "Read an AI research paper"
        └── [Accept] [Reroll]
```

## ✅ Testing Checklist

- [ ] Vào Profile → Settings → Thấy User Preferences Editor
- [ ] Điền và lưu preferences → Check localStorage có data
- [ ] Vào AI Suggestions → Nhấn "Tạo nhiệm vụ cá nhân hóa"
- [ ] Xem 3 missions được generate với đầy đủ thông tin
- [ ] Nhấn Reroll trên 1 mission → Mission thay đổi
- [ ] Reroll 3 lần → Hiển thị thông báo "used all rerolls"
- [ ] Nhấn "Nhận nhiệm vụ" → Chuyển về Dashboard với mission mới
- [ ] Restart browser → Preferences vẫn còn trong localStorage
- [ ] Đợi qua ngày mới → Reroll counter reset về 3

## 🚀 Future Improvements

1. **Backend integration**: Lưu preferences trên server thay vì localStorage
2. **More AI features**: 
   - Contextual suggestions (time of day, weather, mood)
   - Learning from user behavior
   - Adaptive difficulty
3. **Social features**: Share missions, team challenges
4. **Analytics**: Track which missions have high acceptance rate
5. **Premium rerolls**: Buy extra rerolls with coins
