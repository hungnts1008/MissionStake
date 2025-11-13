# Gemini AI Integration

## Cài đặt API Key

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập với Google account
3. Tạo API key mới
4. Copy API key và paste vào file `.env`:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

5. Restart dev server: `npm run dev`

## Tính năng sử dụng AI

### 1. Xác thực bằng chứng (Evidence Verification)
- **API**: Gemini 1.5 Flash
- **Input**: Evidence description, mission title, mission description
- **Output**: 
  - `result`: approve/reject
  - `confidence`: 0-100
  - `reason`: Lý do đánh giá
- **Trọng số**: 60% trong voting system

### 2. Đánh giá tổng thể (Final Evaluation)
- **API**: Gemini 1.5 Flash
- **Input**: All approved evidences, mission details
- **Output**:
  - `overallScore`: 0-100
  - `aiAssessment`: Nhận xét chi tiết
  - `passedRequirements`: true/false (≥70 điểm)
- **Logic**: Đánh giá số lượng + chất lượng + tính nhất quán

## Fallback Mode

Nếu không có API key hoặc API lỗi:
- Tự động chuyển sang "Simulated AI" mode
- Sử dụng logic random + heuristics
- Console warning để dev biết

## API Limits (Free Tier)

- **Rate limit**: 15 requests/minute
- **Daily quota**: 1,500 requests/day
- **Token limit**: 32K tokens/request

## Test

1. Nộp evidence → Sau 2s AI tự động verify
2. Nộp nhiều evidences → Click "Nộp để chấm điểm"
3. Xem kết quả AI evaluation với điểm số + nhận xét

## Troubleshooting

- Nếu thấy "Using simulated AI" trong console → Check API key
- Nếu lỗi 429 → Đã vượt rate limit, đợi 1 phút
- Nếu lỗi 400 → Check request format
