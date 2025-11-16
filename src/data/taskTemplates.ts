import { 
  TaskTemplate, 
  TaskCategory, 
  DifficultyLevel 
} from '../types/ai-types';

// Database của các template nhiệm vụ
export const taskTemplates: TaskTemplate[] = [
  // ===== ĐỜI SỐNG =====
  {
    id: 'life_1',
    title: 'Dọn dẹp phòng ngủ',
    description: 'Sắp xếp đồ đạc, lau chùi và tổ chức không gian sống của bạn',
    category: 'đời sống',
    baseDifficulty: 'beginner',
    estimatedTime: 30,
    minLevel: 1,
    maxLevel: 20,
    basePoints: 50,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh Before & After của phòng ngủ để thể hiện sự thay đổi rõ ràng',
      examples: [
        'Ảnh trước và sau khi dọn dẹp (cùng góc chụp)',
        'Ảnh tủ quần áo đã được sắp xếp gọn gàng',
        'Ảnh bàn làm việc sạch sẽ, ngăn nắp'
      ],
      minimumCount: 2
    },
    successCriteria: [
      'Phòng ngủ sạch sẽ, không còn đồ đạc lộn xộn',
      'Có ít nhất 2 ảnh chụp rõ ràng (trước/sau)',
      'Thời gian hoàn thành trong vòng 30-45 phút'
    ],
    detailedSteps: [
      '1. Chụp ảnh BEFORE của phòng ngủ (toàn cảnh)',
      '2. Thu gom đồ đạc rải rác, phân loại (giữ lại/vứt bỏ/tặng)',
      '3. Hút bụi, lau sàn nhà',
      '4. Sắp xếp quần áo vào tủ, gấp gọn gàng',
      '5. Lau bụi bàn làm việc, kệ sách',
      '6. Chụp ảnh AFTER để so sánh',
      '7. Upload cả 2 ảnh lên hệ thống'
    ],
    variations: [
      {
        level: 10,
        modifier: {
          title: 'Dọn dẹp toàn bộ nhà',
          description: 'Tổng vệ sinh toàn bộ căn nhà, sắp xếp đồ đạc khoa học',
          time: 120,
          points: 150
        }
      }
    ]
  },
  {
    id: 'life_2',
    title: 'Nấu ăn tại nhà',
    description: 'Chuẩn bị một bữa ăn dinh dưỡng tại nhà thay vì ăn ngoài',
    category: 'đời sống',
    baseDifficulty: 'beginner',
    estimatedTime: 45,
    minLevel: 1,
    maxLevel: 30,
    basePoints: 60,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh món ăn đã hoàn thành, có thể kèm ảnh nguyên liệu/quá trình nấu',
      examples: [
        'Ảnh món ăn hoàn thành được bày trí đẹp mắt',
        'Ảnh các nguyên liệu đã chuẩn bị',
        'Ảnh quá trình nấu nướng'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Hoàn thành ít nhất 1 món ăn đầy đủ dinh dưỡng',
      'Món ăn có carb, protein và rau/củ',
      'Tự tay chế biến từ nguyên liệu tươi (không dùng đồ ăn sẵn)'
    ],
    detailedSteps: [
      '1. Lên menu món ăn (ví dụ: cơm, thịt kho, canh rau)',
      '2. Chuẩn bị nguyên liệu: mua sắm hoặc kiểm tra tủ lạnh',
      '3. Chụp ảnh nguyên liệu',
      '4. Sơ chế: rửa rau, thái thịt, ướp gia vị',
      '5. Nấu nướng theo công thức',
      '6. Bày trí món ăn đẹp mắt',
      '7. Chụp ảnh món ăn hoàn thành',
      '8. Upload bằng chứng'
    ],
    variations: [
      {
        level: 15,
        modifier: {
          title: 'Nấu bữa ăn 3 món hoàn chỉnh',
          description: 'Chuẩn bị bữa ăn đầy đủ với khai vị, món chính và tráng miệng',
          time: 90,
          points: 120
        }
      }
    ]
  },
  {
    id: 'life_3',
    title: 'Lập kế hoạch tuần',
    description: 'Lên kế hoạch chi tiết cho tuần làm việc sắp tới',
    category: 'đời sống',
    baseDifficulty: 'beginner',
    estimatedTime: 20,
    minLevel: 1,
    maxLevel: 25,
    basePoints: 40,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh lịch trình/kế hoạch tuần (có thể viết tay hoặc digital)',
      examples: [
        'Ảnh sổ tay với kế hoạch từng ngày trong tuần',
        'Screenshot ứng dụng lịch (Google Calendar, Notion...)',
        'Ảnh bảng whiteboard với timeline tuần'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Lập kế hoạch đầy đủ cho 7 ngày',
      'Có ít nhất 3 mục tiêu chính trong tuần',
      'Phân bổ thời gian cụ thể cho từng hoạt động'
    ],
    detailedSteps: [
      '1. Xem lại tuần trước: đã làm được gì, còn thiếu gì',
      '2. Liệt kê các công việc/mục tiêu tuần này',
      '3. Ưu tiên theo tầm quan trọng (dùng ma trận Eisenhower)',
      '4. Phân bổ vào từng ngày (cân đối workload)',
      '5. Đặt deadline cụ thể cho từng task',
      '6. Chụp ảnh kế hoạch',
      '7. Upload bằng chứng'
    ]
  },

  // ===== HỌC TẬP =====
  {
    id: 'study_1',
    title: 'Đọc sách 30 phút',
    description: 'Dành thời gian đọc sách để mở rộng kiến thức',
    category: 'học tập',
    baseDifficulty: 'beginner',
    estimatedTime: 30,
    minLevel: 1,
    maxLevel: 50,
    basePoints: 70,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh sách đang đọc + số trang hoặc ghi chú/tóm tắt nội dung',
      examples: [
        'Ảnh bìa sách + số trang đã đọc (đánh dấu bookmark)',
        'Ảnh ghi chú về nội dung chính của các trang vừa đọc',
        'Screenshot ebook/Kindle với thời gian đọc hoặc % hoàn thành'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Đọc liên tục ít nhất 30 phút',
      'Đọc tối thiểu 15-20 trang (tùy font chữ)',
      'Có ghi chú hoặc highlight ít nhất 3 ý chính'
    ],
    detailedSteps: [
      '1. Chọn sách muốn đọc (phi hư cấu/hư cấu, tùy sở thích)',
      '2. Tìm không gian yên tĩnh, tắt thông báo điện thoại',
      '3. Chụp ảnh bìa sách + vị trí bắt đầu đọc',
      '4. Đọc tập trung 30 phút',
      '5. Ghi chú 3-5 ý chính hoặc câu trích dẫn hay',
      '6. Đánh dấu trang cuối cùng đã đọc',
      '7. Chụp ảnh ghi chú/vị trí kết thúc',
      '8. Upload bằng chứng'
    ],
    variations: [
      {
        level: 20,
        modifier: {
          title: 'Đọc và tóm tắt một chương sách',
          description: 'Đọc một chương và viết tóm tắt nội dung chính',
          time: 60,
          points: 150
        }
      }
    ]
  },
  {
    id: 'study_2',
    title: 'Học từ vựng tiếng Anh',
    description: 'Học và ghi nhớ 20 từ vựng tiếng Anh mới',
    category: 'học tập',
    baseDifficulty: 'beginner',
    estimatedTime: 25,
    minLevel: 1,
    maxLevel: 60,
    basePoints: 60,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh danh sách 20 từ vựng + nghĩa + ví dụ câu (viết tay hoặc digital)',
      examples: [
        'Ảnh notebook với 20 từ vựng, nghĩa tiếng Việt, ví dụ',
        'Screenshot app học từ vựng (Anki, Quizlet...) với 20 từ mới',
        'Ảnh flashcards đã tạo cho 20 từ'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Học đúng 20 từ vựng tiếng Anh mới',
      'Mỗi từ có: nghĩa tiếng Việt + phiên âm + ví dụ câu',
      'Làm quiz/test để kiểm tra đã nhớ ít nhất 15/20 từ'
    ],
    detailedSteps: [
      '1. Chọn chủ đề từ vựng (business, travel, daily life...)',
      '2. Liệt kê 20 từ mới từ sách/app/website',
      '3. Tra cứu: nghĩa, phiên âm, từ loại',
      '4. Tạo ví dụ câu cho mỗi từ (context)',
      '5. Đọc to từng từ 3 lần để nhớ phát âm',
      '6. Viết flashcard hoặc nhập vào app',
      '7. Làm quiz/test kiểm tra',
      '8. Chụp ảnh danh sách từ vựng',
      '9. Upload bằng chứng'
    ],
    variations: [
      {
        level: 30,
        modifier: {
          title: 'Học và áp dụng 50 từ vựng chuyên ngành',
          description: 'Học từ vựng chuyên ngành và tạo câu ví dụ thực tế',
          time: 60,
          points: 180
        }
      }
    ]
  },
  {
    id: 'study_3',
    title: 'Xem video học tập online',
    description: 'Theo dõi một khóa học online về chủ đề bạn quan tâm',
    category: 'học tập',
    baseDifficulty: 'beginner',
    estimatedTime: 45,
    minLevel: 1,
    maxLevel: 40,
    basePoints: 80,
    evidenceRequirements: {
      type: 'image',
      description: 'Screenshot video học + tiến độ hoặc ghi chú những điểm chính',
      examples: [
        'Screenshot video đang xem với timestamp (phút thứ 20/45)',
        'Ảnh ghi chú tóm tắt nội dung video',
        'Screenshot certificate/badge hoàn thành bài học (nếu có)'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Xem ít nhất 1 video/bài học dài 30-60 phút',
      'Ghi chú ít nhất 5 điểm chính từ video',
      'Hiểu và có thể tóm tắt nội dung'
    ],
    detailedSteps: [
      '1. Chọn platform (Coursera, Udemy, YouTube, edX...)',
      '2. Tìm khóa học/video về chủ đề muốn học',
      '3. Chuẩn bị notebook/app ghi chú',
      '4. Xem video, pause để ghi chú các điểm quan trọng',
      '5. Làm quiz/exercise nếu có',
      '6. Tóm tắt nội dung bằng lời của mình',
      '7. Chụp screenshot video + ghi chú',
      '8. Upload bằng chứng'
    ]
  },
  {
    id: 'study_4',
    title: 'Luyện code trên LeetCode',
    description: 'Giải 3 bài tập lập trình để cải thiện kỹ năng',
    category: 'học tập',
    baseDifficulty: 'intermediate',
    estimatedTime: 60,
    minLevel: 15,
    maxLevel: 80,
    basePoints: 150,
    variations: [
      {
        level: 50,
        modifier: {
          title: 'Giải bài tập Hard trên LeetCode',
          description: 'Thử thách bản thân với các bài tập mức độ khó',
          time: 90,
          points: 300
        }
      }
    ]
  },

  // ===== THỂ THAO =====
  {
    id: 'sport_1',
    title: 'Chạy bộ 2km',
    description: 'Chạy bộ nhẹ nhàng để khởi động ngày mới và cải thiện sức khỏe tim mạch',
    category: 'thể thao',
    baseDifficulty: 'beginner',
    estimatedTime: 20,
    minLevel: 1,
    maxLevel: 30,
    basePoints: 80,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh màn hình ứng dụng chạy bộ (Strava, Nike Run, Google Fit...) hiển thị: quãng đường (≥2km), thời gian, tốc độ trung bình',
      examples: [
        'Screenshot ứng dụng chạy bộ với route map',
        'Ảnh đồng hồ thể thao hiển thị 2km',
        'Screenshot Google Fit timeline với hoạt động chạy bộ'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Hoàn thành ít nhất 2km trong một lần chạy',
      'Có bằng chứng từ ứng dụng tracking (GPS data)',
      'Thời gian hợp lý (không quá chậm - tối thiểu 8-15 phút)'
    ],
    detailedSteps: [
      '1. Khởi động kỹ: Giãn cơ 5 phút, đi bộ nhanh 2-3 phút',
      '2. Mở ứng dụng chạy bộ (Strava, Nike Run Club, Google Fit...)',
      '3. Bắt đầu tracking GPS trước khi chạy',
      '4. Chạy với nhịp độ thoải mái, giữ nhịp thở đều',
      '5. Hoàn thành ít nhất 2km',
      '6. Chụp màn hình kết quả (distance, time, pace)',
      '7. Làm nguội: Đi bộ 3-5 phút, giãn cơ',
      '8. Upload screenshot vào hệ thống'
    ],
    variations: [
      {
        level: 10,
        modifier: {
          title: 'Chạy bộ 5km',
          description: 'Nâng cấp quãng đường lên 5km để tăng sức bền',
          time: 35,
          points: 150
        }
      },
      {
        level: 25,
        modifier: {
          title: 'Chạy bộ 10km',
          description: 'Thử thách với 10km - chuẩn bị cho các giải chạy nghiệp dư',
          time: 60,
          points: 250
        }
      }
    ]
  },
  {
    id: 'sport_2',
    title: 'Tập Yoga cơ bản',
    description: 'Thực hiện các động tác Yoga cơ bản để tăng sự dẻo dai và cân bằng',
    category: 'thể thao',
    baseDifficulty: 'beginner',
    estimatedTime: 30,
    minLevel: 1,
    maxLevel: 25,
    basePoints: 90,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh hoặc video ngắn (15-30s) thực hiện các tư thế yoga, có thể dùng gương hoặc người thân hỗ trợ chụp',
      examples: [
        'Video 20s làm tư thế Downward Dog',
        'Ảnh tư thế Tree Pose giữ trong 30 giây',
        'Screenshot ứng dụng yoga (Yoga Studio, Down Dog...) với session hoàn thành'
      ],
      minimumCount: 2
    },
    successCriteria: [
      'Thực hiện ít nhất 5 tư thế yoga khác nhau',
      'Giữ mỗi tư thế tối thiểu 30 giây',
      'Có bằng chứng rõ ràng về tư thế (ảnh/video)'
    ],
    detailedSteps: [
      '1. Chuẩn bị thảm yoga, không gian thoáng mát',
      '2. Khởi động: xoay các khớp 3-5 phút',
      '3. Thực hiện các tư thế cơ bản: Mountain Pose → Forward Fold → Downward Dog → Warrior I → Child Pose',
      '4. Giữ mỗi tư thế 30-60 giây, thở đều',
      '5. Chụp ảnh/quay video các tư thế chính',
      '6. Kết thúc với Savasana (tư thế thư giãn) 5 phút',
      '7. Upload bằng chứng lên hệ thống'
    ]
  },
  {
    id: 'sport_3',
    title: 'Tập gym',
    description: 'Một buổi tập gym đầy đủ với cardio và tạ để xây dựng cơ bắp',
    category: 'thể thao',
    baseDifficulty: 'intermediate',
    estimatedTime: 60,
    minLevel: 10,
    maxLevel: 70,
    basePoints: 120,
    evidenceRequirements: {
      type: 'mixed',
      description: 'Chụp ảnh tại phòng gym (máy tập, check-in app) + ảnh hoặc video thực hiện các động tác tập (squat, bench press, v.v.)',
      examples: [
        'Ảnh check-in tại phòng gym + thẻ thành viên',
        'Video 15s thực hiện squat với tạ',
        'Ảnh các thiết bị đã sử dụng (treadmill, dumbbells...)',
        'Screenshot ứng dụng gym tracking (Strong, JEFIT...)'
      ],
      minimumCount: 2
    },
    successCriteria: [
      'Thực hiện ít nhất 30 phút cardio HOẶC 40 phút tập tạ',
      'Hoàn thành ít nhất 5 bài tập khác nhau',
      'Check-in tại phòng gym hoặc bằng chứng tập tại nhà'
    ],
    detailedSteps: [
      '1. Khởi động 10 phút: chạy bộ nhẹ hoặc cardio',
      '2. Kéo giãn động các nhóm cơ chính',
      '3. Tập tạ: 3-4 nhóm cơ (ngực, lưng, chân, vai) - mỗi nhóm 3 sets × 8-12 reps',
      '4. Hoặc cardio: 30 phút HIIT/steady-state',
      '5. Chụp ảnh/video các động tác chính',
      '6. Hạ nhịp 5-10 phút với cardio nhẹ',
      '7. Giãn cơ sau tập 5 phút',
      '8. Upload bằng chứng'
    ],
    variations: [
      {
        level: 40,
        modifier: {
          title: 'Tập gym chuyên sâu',
          description: 'Buổi tập nâng cao với kế hoạch tập luyện phân nhóm cơ',
          time: 90,
          points: 200
        }
      }
    ]
  },
  {
    id: 'sport_4',
    title: 'Đạp xe',
    description: 'Đạp xe quanh khu vực để tăng cường sức khỏe tim mạch và khám phá',
    category: 'thể thao',
    baseDifficulty: 'beginner',
    estimatedTime: 45,
    minLevel: 1,
    maxLevel: 40,
    basePoints: 120,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh xe đạp + địa điểm hoặc screenshot ứng dụng cycling (Strava, MapMyRide...) với route và quãng đường',
      examples: [
        'Screenshot Strava với route đạp xe ≥ 5km',
        'Ảnh selfie cùng xe đạp tại điểm đến',
        'Ảnh đồng hồ GPS/xe đạp hiển thị quãng đường'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Đạp xe ít nhất 5km',
      'Thời gian hợp lý (tốc độ trung bình 12-20 km/h)',
      'Bằng chứng GPS tracking hoặc ảnh địa điểm'
    ],
    detailedSteps: [
      '1. Kiểm tra xe đạp (lốp, phanh, yên xe)',
      '2. Đội mũ bảo hiểm, chuẩn bị nước uống',
      '3. Mở app tracking (Strava, Google Fit...)',
      '4. Đạp xe với tốc độ thoải mái, an toàn',
      '5. Hoàn thành ít nhất 5km',
      '6. Chụp ảnh tại điểm đến hoặc screenshot app',
      '7. Upload bằng chứng'
    ]
  },
  {
    id: 'sport_5',
    title: 'Bơi lội',
    description: 'Bơi lội để tăng cường sức bền và sức mạnh toàn thân',
    category: 'thể thao',
    baseDifficulty: 'intermediate',
    estimatedTime: 60,
    minLevel: 10,
    maxLevel: 60,
    basePoints: 200,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh tại bể bơi (vé vào cửa, đồng hồ bơi) hoặc video bơi, ảnh sau khi hoàn thành',
      examples: [
        'Ảnh vé hoặc thẻ check-in bể bơi',
        'Video 30s thực hiện kiểu bơi (sải, ếch, bướm...)',
        'Ảnh đồng hồ bơi hiển thị quãng đường (nếu có)',
        'Selfie tại bể bơi với đồ bơi'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Bơi ít nhất 500m hoặc 30 phút liên tục',
      'Thực hiện đúng kỹ thuật ít nhất 1 kiểu bơi',
      'Có bằng chứng tại bể bơi hoặc khu vực bơi an toàn'
    ],
    detailedSteps: [
      '1. Chuẩn bị đồ bơi, kính bơi, mũ bơi',
      '2. Khởi động trên cạn 5 phút (xoay khớp, giãn cơ)',
      '3. Làm quen nước: ngâm người 2-3 phút',
      '4. Bơi khởi động 100m kiểu thoải mái',
      '5. Bơi chính: 400-500m với kiểu bơi ưa thích',
      '6. Chụp ảnh/video trong quá trình',
      '7. Bơi thư giãn 100m hạ nhịp',
      '8. Upload bằng chứng'
    ]
  },

  // ===== SỨC KHỎE =====
  {
    id: 'health_1',
    title: 'Thiền định 15 phút',
    description: 'Thực hành thiền định để giảm stress và tăng sự tập trung',
    category: 'sức khỏe',
    baseDifficulty: 'beginner',
    estimatedTime: 15,
    minLevel: 1,
    maxLevel: 50,
    basePoints: 50,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh không gian thiền hoặc screenshot app thiền định với thời gian hoàn thành',
      examples: [
        'Screenshot app thiền (Headspace, Calm, Insight Timer...) hiển thị 15 phút',
        'Ảnh không gian thiền với đệm ngồi, nến, nhang',
        'Screenshot timer 15 phút + ghi chú cảm nhận sau thiền'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Thiền liên tục 15 phút không bị gián đoạn',
      'Tập trung vào hơi thở hoặc mantra',
      'Không sử dụng điện thoại (trừ app hướng dẫn thiền)'
    ],
    detailedSteps: [
      '1. Chọn không gian yên tĩnh, thoáng mát',
      '2. Ngồi thoải mái (bàn tay úp, lưng thẳng)',
      '3. Đặt timer 15 phút hoặc mở app thiền',
      '4. Nhắm mắt, tập trung vào hơi thở',
      '5. Hít vào (đếm 4 giây) - Giữ (4 giây) - Thở ra (4 giây)',
      '6. Khi tâm trí lang thang, nhẹ nhàng đưa về hơi thở',
      '7. Kết thúc: từ từ mở mắt, giãn cơ',
      '8. Chụp ảnh app/không gian và upload'
    ],
    variations: [
      {
        level: 25,
        modifier: {
          title: 'Thiền định sâu 45 phút',
          time: 45,
          points: 150
        }
      }
    ]
  },
  {
    id: 'health_2',
    title: 'Uống đủ 2 lít nước',
    description: 'Đảm bảo cơ thể được cung cấp đủ nước trong ngày',
    category: 'sức khỏe',
    baseDifficulty: 'beginner',
    estimatedTime: 1, // Cả ngày
    minLevel: 1,
    maxLevel: 20,
    basePoints: 30,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh bình nước/chai nước đã uống hết hoặc screenshot app theo dõi nước',
      examples: [
        'Ảnh 4 chai nước 500ml đã uống (tổng 2 lít)',
        'Screenshot app theo dõi nước (Water Reminder, Plant Nanny...)',
        'Ảnh bình nước 2 lít với vạch đo đã về 0'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Uống đủ 2 lít nước lọc trong ngày (8 ly x 250ml)',
      'Phân bổ đều trong ngày (không uống cùng lúc)',
      'Ưu tiên nước lọc, tránh nước ngọt/có ga'
    ],
    detailedSteps: [
      '1. Chuẩn bị bình nước 2 lít hoặc chai 500ml',
      '2. Đặt reminder mỗi 1-2 giờ để uống nước',
      '3. Uống 1-2 ly khi thức dậy (detox)',
      '4. Uống trước mỗi bữa ăn 30 phút',
      '5. Uống trong khi làm việc, tập luyện',
      '6. Theo dõi lượng nước qua app hoặc vạch kẻ',
      '7. Cuối ngày: chụp ảnh bình nước rỗng/app',
      '8. Upload bằng chứng'
    ]
  },
  {
    id: 'health_3',
    title: 'Ngủ đủ 8 tiếng',
    description: 'Đảm bảo giấc ngủ chất lượng để phục hồi sức khỏe',
    category: 'sức khỏe',
    baseDifficulty: 'beginner',
    estimatedTime: 480,
    minLevel: 1,
    maxLevel: 25,
    basePoints: 100,
    evidenceRequirements: {
      type: 'image',
      description: 'Screenshot app theo dõi giấc ngủ hoặc ảnh đồng hồ/báo thức sáng',
      examples: [
        'Screenshot app Sleep Cycle/Fitbit với 8h ngủ',
        'Ảnh màn hình báo thức sáng (giờ thức dậy)',
        'Screenshot health app với sleep data đủ 8h'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Ngủ liên tục 7-9 tiếng (không tỉnh giữa chừng)',
      'Đi ngủ trước 12h đêm',
      'Không dùng điện thoại 30 phút trước ngủ'
    ],
    detailedSteps: [
      '1. Tắt điện thoại/laptop 30 phút trước ngủ',
      '2. Tối ưu phòng ngủ: tối, mát, yên tĩnh',
      '3. Đặt báo thức cho sáng mai (8h sau)',
      '4. Bật app theo dõi giấc ngủ (nếu có)',
      '5. Đi ngủ trước 12h đêm',
      '6. Ngủ 7-9 tiếng không gián đoạn',
      '7. Sáng: chụp screenshot app/ảnh báo thức',
      '8. Upload bằng chứng'
    ]
  },
  {
    id: 'health_4',
    title: 'Kiểm tra sức khỏe định kỳ',
    description: 'Thăm khám sức khỏe tổng quát và theo dõi các chỉ số',
    category: 'sức khỏe',
    baseDifficulty: 'intermediate',
    estimatedTime: 120,
    minLevel: 10,
    maxLevel: 30,
    basePoints: 200,
    evidenceRequirements: {
      type: 'image',
      description: 'Ảnh phiếu khám/kết quả xét nghiệm hoặc bill thanh toán phòng khám (có thể che thông tin cá nhân)',
      examples: [
        'Ảnh phiếu khám bệnh với các chỉ số: huyết áp, cân nặng, chiều cao',
        'Ảnh kết quả xét nghiệm máu (che tên nếu cần)',
        'Ảnh bill/hóa đơn phòng khám'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Thăm khám tại phòng khám/bệnh viện uy tín',
      'Kiểm tra ít nhất 3 chỉ số: huyết áp, cân nặng, mạch',
      'Tư vấn với bác sĩ về kết quả'
    ],
    detailedSteps: [
      '1. Đặt lịch khám tại phòng khám/bệnh viện',
      '2. Nhịn ăn 8-12h trước nếu có xét nghiệm máu',
      '3. Đến khám đúng giờ, mang theo CMND/BHYT',
      '4. Đo các chỉ số: huyết áp, chiều cao, cân nặng, mạch',
      '5. Xét nghiệm máu/nước tiểu (nếu cần)',
      '6. Tư vấn với bác sĩ về kết quả',
      '7. Chụp ảnh phiếu khám/kết quả (che info cá nhân)',
      '8. Upload bằng chứng'
    ]
  },

  // ===== TÀI CHÍNH =====
  {
    id: 'finance_1',
    title: 'Ghi chép chi tiêu hàng ngày',
    description: 'Theo dõi và ghi lại tất cả các khoản chi tiêu trong ngày',
    category: 'tài chính',
    baseDifficulty: 'beginner',
    estimatedTime: 10,
    minLevel: 1,
    maxLevel: 40,
    basePoints: 40,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh sổ ghi chép chi tiêu hoặc screenshot app quản lý tài chính',
      examples: [
        'Ảnh sổ tay với danh sách chi tiêu ngày hôm nay',
        'Screenshot app Misa, Money Lover, Excel với chi tiết từng khoản',
        'Ảnh bảng excel chi tiêu được cập nhật'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Ghi đầy đủ mọi khoản chi (từ ly cà phê đến hóa đơn lớn)',
      'Phân loại theo danh mục (ăn uống, di chuyển, giải trí...)',
      'Tính tổng chi tiêu trong ngày'
    ],
    detailedSteps: [
      '1. Chọn công cụ: sổ tay hoặc app (Money Lover, Misa...)',
      '2. Sau mỗi lần chi tiêu, ghi ngay lập tức',
      '3. Ghi rõ: thời gian, mục đích, số tiền, hình thức (tiền mặt/chuyển khoản)',
      '4. Phân loại vào danh mục (food, transport, entertainment...)',
      '5. Cuối ngày: tổng hợp và kiểm tra lại',
      '6. So sánh với ngân sách đã đặt',
      '7. Chụp ảnh sổ chi tiêu hoặc screenshot app',
      '8. Upload bằng chứng'
    ]
  },
  {
    id: 'finance_2',
    title: 'Lập kế hoạch tài chính tháng',
    description: 'Lên kế hoạch thu chi và tiết kiệm cho tháng tới',
    category: 'tài chính',
    baseDifficulty: 'intermediate',
    estimatedTime: 30,
    minLevel: 10,
    maxLevel: 50,
    basePoints: 100,
    evidenceRequirements: {
      type: 'image',
      description: 'Ảnh/screenshot bảng kế hoạch tài chính chi tiết theo tháng',
      examples: [
        'Screenshot Excel/Google Sheets với budget breakdown',
        'Ảnh sổ tay với kế hoạch thu/chi/tiết kiệm',
        'Screenshot app ngân sách (YNAB, EveryDollar...)'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Có bảng thu nhập dự kiến trong tháng',
      'Phân bổ chi tiêu theo danh mục (50/30/20 rule)',
      'Đặt mục tiêu tiết kiệm cụ thể (số tiền + mục đích)'
    ],
    detailedSteps: [
      '1. Tính tổng thu nhập tháng (lương, thu nhập phụ)',
      '2. Liệt kê các khoản chi cố định (nhà, điện nước, internet...)',
      '3. Ước tính chi tiêu biến đổi (ăn uống, giải trí, quần áo)',
      '4. Áp dụng quy tắc 50/30/20: 50% nhu cầu thiết yếu, 30% muốn, 20% tiết kiệm',
      '5. Đặt mục tiêu tiết kiệm cụ thể (VD: 3 triệu/tháng cho quỹ khẩn cấp)',
      '6. Tạo budget buffer (dự phòng) 5-10%',
      '7. Chụp ảnh kế hoạch tài chính',
      '8. Upload bằng chứng'
    ]
  },
  {
    id: 'finance_3',
    title: 'Tiết kiệm 10% thu nhập',
    description: 'Dành 10% thu nhập tháng này vào quỹ tiết kiệm',
    category: 'tài chính',
    baseDifficulty: 'intermediate',
    estimatedTime: 15,
    minLevel: 5,
    maxLevel: 60,
    basePoints: 150,
  },
  {
    id: 'finance_4',
    title: 'Học về đầu tư',
    description: 'Tìm hiểu về các hình thức đầu tư cơ bản (chứng khoán, quỹ...)',
    category: 'tài chính',
    baseDifficulty: 'intermediate',
    estimatedTime: 60,
    minLevel: 15,
    maxLevel: 70,
    basePoints: 120,
  },

  // ===== SÁNG TẠO =====
  {
    id: 'creative_1',
    title: 'Viết nhật ký',
    description: 'Ghi lại suy nghĩ và trải nghiệm của ngày hôm nay',
    category: 'sáng tạo',
    baseDifficulty: 'beginner',
    estimatedTime: 20,
    minLevel: 1,
    maxLevel: 35,
    basePoints: 60,
    evidenceRequirements: {
      type: 'image',
      description: 'Chụp ảnh trang nhật ký vừa viết (có thể che nội dung riêng tư nếu cần)',
      examples: [
        'Ảnh trang nhật ký viết tay với ít nhất 200 từ',
        'Screenshot app nhật ký điện tử (Day One, Journey...)',
        'Ảnh notebook với entry ngày hôm nay'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Viết ít nhất 200 từ (khoảng 1 trang A5)',
      'Ghi lại ít nhất 3 sự kiện/cảm xúc trong ngày',
      'Viết chân thành, không copy từ nguồn khác'
    ],
    detailedSteps: [
      '1. Chọn nơi yên tĩnh, thời điểm cuối ngày',
      '2. Mở sổ nhật ký hoặc app',
      '3. Ghi ngày tháng, thời tiết (nếu muốn)',
      '4. Viết về 3 điều: sự kiện nổi bật, cảm xúc, bài học',
      '5. Thêm chi tiết: người gặp, nơi đến, điều đã làm',
      '6. Kết thúc với suy nghĩ hoặc mục tiêu ngày mai',
      '7. Chụp ảnh (che info nhạy cảm nếu cần)',
      '8. Upload bằng chứng'
    ]
  },
  {
    id: 'creative_2',
    title: 'Vẽ tranh hoặc sketch',
    description: 'Thực hành kỹ năng vẽ với một bức tranh đơn giản',
    category: 'sáng tạo',
    baseDifficulty: 'beginner',
    estimatedTime: 45,
    minLevel: 1,
    maxLevel: 50,
    basePoints: 90,
  },
  {
    id: 'creative_3',
    title: 'Chụp ảnh sáng tạo',
    description: 'Thực hành nhiếp ảnh với một chủ đề cụ thể',
    category: 'sáng tạo',
    baseDifficulty: 'beginner',
    estimatedTime: 30,
    minLevel: 1,
    maxLevel: 40,
    basePoints: 70,
  },
  {
    id: 'creative_4',
    title: 'Viết blog hoặc bài viết',
    description: 'Viết một bài blog chia sẻ kiến thức hoặc kinh nghiệm',
    category: 'sáng tạo',
    baseDifficulty: 'intermediate',
    estimatedTime: 60,
    minLevel: 10,
    maxLevel: 60,
    basePoints: 130,
  },
  {
    id: 'creative_5',
    title: 'Học nhạc cụ',
    description: 'Luyện tập nhạc cụ yêu thích trong 30 phút',
    category: 'sáng tạo',
    baseDifficulty: 'intermediate',
    estimatedTime: 30,
    minLevel: 5,
    maxLevel: 70,
    basePoints: 100,
  },

  // ===== CÔNG VIỆC =====
  {
    id: 'work_1',
    title: 'Hoàn thành 3 task công việc quan trọng',
    description: 'Tập trung hoàn thành 3 nhiệm vụ ưu tiên cao nhất',
    category: 'công việc',
    baseDifficulty: 'intermediate',
    estimatedTime: 180,
    minLevel: 10,
    maxLevel: 70,
    basePoints: 150,
  },
  {
    id: 'work_2',
    title: 'Học kỹ năng mềm',
    description: 'Học một kỹ năng mềm (giao tiếp, quản lý thời gian...)',
    category: 'công việc',
    baseDifficulty: 'beginner',
    estimatedTime: 30,
    minLevel: 1,
    maxLevel: 50,
    basePoints: 80,
  },
  {
    id: 'work_3',
    title: 'Networking online',
    description: 'Kết nối với 5 người trong lĩnh vực của bạn trên LinkedIn',
    category: 'công việc',
    baseDifficulty: 'beginner',
    estimatedTime: 20,
    minLevel: 5,
    maxLevel: 40,
    basePoints: 70,
  },

  // ===== XÃ HỘI =====
  {
    id: 'social_1',
    title: 'Gọi điện cho gia đình',
    description: 'Dành thời gian nói chuyện với gia đình, người thân',
    category: 'xã hội',
    baseDifficulty: 'beginner',
    estimatedTime: 20,
    minLevel: 1,
    maxLevel: 30,
    basePoints: 50,
    evidenceRequirements: {
      type: 'image',
      description: 'Screenshot lịch sử cuộc gọi với thành viên gia đình (che số điện thoại nếu cần)',
      examples: [
        'Screenshot call log với thời gian cuộc gọi ≥ 10 phút',
        'Screenshot video call (Zalo, FaceTime...) với gia đình',
        'Ảnh màn hình cuộc gọi đang diễn ra'
      ],
      minimumCount: 1
    },
    successCriteria: [
      'Gọi điện ít nhất 10 phút',
      'Nói chuyện chân thành, hỏi thăm sức khỏe/tình hình',
      'Lắng nghe và chia sẻ'
    ],
    detailedSteps: [
      '1. Chọn thời điểm gia đình rảnh (tối sau bữa tối)',
      '2. Gọi video call (Zalo, FaceTime) nếu có thể',
      '3. Hỏi thăm sức khỏe, công việc của từng người',
      '4. Chia sẻ về cuộc sống của mình',
      '5. Trò chuyện ít nhất 10-20 phút',
      '6. Chụp screenshot cuộc gọi (thời lượng)',
      '7. Upload bằng chứng'
    ]
  },
  {
    id: 'social_2',
    title: 'Tham gia hoạt động cộng đồng',
    description: 'Đóng góp thời gian cho một hoạt động thiện nguyện',
    category: 'xã hội',
    baseDifficulty: 'intermediate',
    estimatedTime: 120,
    minLevel: 10,
    maxLevel: 60,
    basePoints: 200,
  },
  {
    id: 'social_3',
    title: 'Gặp gỡ bạn bè',
    description: 'Dành thời gian gặp gỡ và trò chuyện với bạn bè',
    category: 'xã hội',
    baseDifficulty: 'beginner',
    estimatedTime: 90,
    minLevel: 1,
    maxLevel: 25,
    basePoints: 60,
  },
];

// Helper function để lấy task theo category
export const getTasksByCategory = (category: TaskCategory): TaskTemplate[] => {
  return taskTemplates.filter(task => task.category === category);
};

// Helper function để lấy task theo level
export const getTasksByLevel = (category: TaskCategory, userLevel: number): TaskTemplate[] => {
  return taskTemplates.filter(
    task => task.category === category && 
    task.minLevel <= userLevel && 
    task.maxLevel >= userLevel
  );
};
