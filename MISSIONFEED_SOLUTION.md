# Giải pháp cho MissionFeed - Khám phá nhiệm vụ

## ✅ Đã xử lý các vấn đề:

### 1. **Tham gia nhiệm vụ**
- ✅ Kiểm tra user đã tham gia chưa
- ✅ Không cho tham gia nhiệm vụ của chính mình
- ✅ Yêu cầu đặt cược 50% stake gốc
- ✅ Kiểm tra đủ coins
- ✅ Lưu trạng thái vào localStorage
- ✅ Hiển thị dialog xác nhận với thông tin rõ ràng

### 2. **Like/Unlike nhiệm vụ**
- ✅ Toggle like/unlike
- ✅ Cập nhật số supporters realtime
- ✅ Hiển thị trạng thái đã like (nút màu + icon fill)
- ✅ Lưu vào localStorage

### 3. **Dự đoán (Prediction Market)**
- ✅ Chọn Success hoặc Fail
- ✅ Đặt cược coins tùy chỉnh (100 - max)
- ✅ Không cho dự đoán nhiệm vụ của mình
- ✅ Chỉ dự đoán 1 lần/nhiệm vụ
- ✅ Hiển thị dialog với:
  - Chọn kết quả (thumbs up/down)
  - Input stake amount
  - Tính toán reward nếu đúng (2x stake)
- ✅ Lưu predictions vào localStorage
- ✅ Hiển thị trạng thái đã dự đoán trên nút

### 4. **Pagination cho số lượng lớn**
- ✅ 12 missions/page (thay vì 20 cố định)
- ✅ Nút Previous/Next
- ✅ Hiển thị số trang
- ✅ Smart pagination (hiển thị trang 1, cuối, hiện tại, lân cận)
- ✅ Hiển thị tổng số missions
- ✅ Auto reset về trang 1 khi thay đổi filter

## 📝 Cần cập nhật App.tsx:

File `MissionFeed.tsx` hiện cần thêm 2 props:
- `setUser`: để cập nhật coins sau join/predict
- `setMissions`: để cập nhật supporters count

Cần sửa trong `App.tsx` chỗ gọi `<MissionFeed>`:

```tsx
<MissionFeed 
  user={user} 
  onNavigate={navigate} 
  missions={missions}
  setUser={setUser}              // ← Thêm
  setMissions={setMissions}      // ← Thêm
/>
```

## 🎮 Flow sử dụng:

### Tham gia:
1. Click nút "Tham gia"
2. Dialog hiện thông tin stake (50% gốc)
3. Xác nhận → Trừ coins → Đánh dấu đã tham gia
4. Nút đổi thành "Đã tham gia" (disabled)

### Like:
1. Click icon ❤️
2. Toggle like/unlike
3. Số supporters tăng/giảm
4. Icon fill khi đã like

### Dự đoán:
1. Click nút "Dự đoán"
2. Dialog: Chọn Success/Fail
3. Nhập số coins đặt cược
4. Xác nhận → Trừ coins → Lưu prediction
5. Nút hiển thị lựa chọn (👍 Thành công / 👎 Thất bại)

## 💾 LocalStorage Structure:

```typescript
`user_likes_${userId}`: string[]           // Danh sách missionId đã like
`user_joined_${userId}`: string[]          // Danh sách missionId đã tham gia
`user_predictions_${userId}`: Prediction[] // Danh sách predictions
```

## 🔧 Technical Details:

- **Pagination**: 12 items/page, smart page display
- **State management**: useState + useEffect + localStorage
- **Dialog components**: shadcn/ui AlertDialog
- **Icons**: lucide-react (ThumbsUp, ThumbsDown, Heart, Users, Target)
- **Type safety**: Prediction type definition

Vui lòng cập nhật App.tsx để truyền đủ props!
