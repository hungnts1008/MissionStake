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
