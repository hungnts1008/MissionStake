import { Mission, User } from '../App';

// ============================================
// MOCK USER - 1 người dùng duy nhất cho test
// ============================================
export const MOCK_USER: User = {
  id: 'user_1',
  name: 'Test User',
  email: 'testuser@missionstake.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  coins: 15000,
  badges: ['🏆 Early Adopter', '🔥 7 Day Streak', '⭐ Top Contributor'],
  bio: 'Đam mê phát triển bản thân và công nghệ blockchain',
  streak: 7,
  reputation: 850,
  verificationStats: {
    totalVotes: 42,
    correctVotes: 38,
    accuracy: 90.5
  }
};

// NEO Wallet Info
export const MOCK_WALLET = {
  address: 'NWWkFU3dKWTHNpxjz8MRgt5eKe1Ld834xQ',
  balance: {
    neo: 0.0000005,
    gas: 50.0
  },
  network: 'NEO N3 TestNet',
  rpc: 'http://seed1t5.neo.org:20332'
};

// ============================================
// MOCK MISSIONS
// ============================================
export const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Chạy 5km mỗi ngày trong 30 ngày',
    description: 'Cam kết chạy bộ 5km mỗi ngày để cải thiện sức khỏe và tinh thần. Mục tiêu giảm cân 3kg và tăng sức bền.',
    stake: 1000,
    startDate: '01/11/2024',
    endDate: '30/11/2024',
    mode: 'public',
    userId: '1',
    userName: 'Người dùng mẫu',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    status: 'active',
    progress: 65,
    difficulty: 'medium',
    category: 'Sức khỏe',
    participants: 1,
    supporters: 23,
    evidences: [
      {
        id: 'e1',
        date: '01/11/2024',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
        description: 'Hoàn thành 5.2km trong 28 phút',
        status: 'approved',
        userVotes: [],
        aiVerification: {
          result: 'approve',
          confidence: 85,
          reason: 'Ảnh chụp GPS tracking rõ ràng, hoạt động phù hợp với mục tiêu.',
          timestamp: '01/11/2024 18:30'
        },
        finalVerdict: {
          result: 'approved',
          aiWeight: 60,
          userWeight: 40,
          penalizedUsers: [],
          timestamp: '01/11/2024 19:00'
        }
      },
      {
        id: 'e2',
        date: '02/11/2024',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400',
        description: 'Chạy 5.5km, thời tiết đẹp',
        status: 'approved',
        userVotes: [],
        aiVerification: {
          result: 'approve',
          confidence: 90,
          reason: 'Bằng chứng chất lượng cao, đúng hoạt động cam kết.',
          timestamp: '02/11/2024 18:45'
        },
        finalVerdict: {
          result: 'approved',
          aiWeight: 60,
          userWeight: 40,
          penalizedUsers: [],
          timestamp: '02/11/2024 19:15'
        }
      },
    ]
  },
  {
    id: '2',
    title: 'Đọc 1 cuốn sách mỗi tuần',
    description: 'Phát triển thói quen đọc sách, mở rộng kiến thức và tư duy. Mục tiêu đọc 12 cuốn sách trong 3 tháng.',
    stake: 500,
    startDate: '01/11/2024',
    endDate: '31/01/2025',
    mode: 'personal',
    userId: 'user_1',
    userName: 'Test User',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    status: 'active',
    progress: 75,
    difficulty: 'easy',
    category: 'Học tập',
    participants: 1,
    supporters: 12,
    evidences: [
      {
        id: 'e_demo_1',
        date: '01/11/2024',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
        description: 'Tuần 1: Hoàn thành cuốn "Đắc Nhân Tâm" - 320 trang. Ghi chú và tóm tắt 10 bài học quan trọng.',
        status: 'approved',
        userVotes: [
          {
            userId: 'user_2',
            userName: 'Nguyễn Văn A',
            vote: 'approve',
            timestamp: '01/11/2024 20:15'
          },
          {
            userId: 'user_3',
            userName: 'Trần Thị B',
            vote: 'approve',
            timestamp: '01/11/2024 21:30'
          }
        ],
        aiVerification: {
          result: 'approve',
          confidence: 92,
          reason: 'Ảnh chụp sách rõ ràng, có ghi chú chi tiết và chứng minh đã đọc kỹ. Nội dung tóm tắt phù hợp với sách.',
          timestamp: '01/11/2024 19:45'
        },
        finalVerdict: {
          result: 'approved',
          aiWeight: 60,
          userWeight: 40,
          penalizedUsers: [],
          timestamp: '01/11/2024 22:00'
        }
      },
      {
        id: 'e_demo_2',
        date: '08/11/2024',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600',
        description: 'Tuần 2: Hoàn thành "Atomic Habits" - 285 trang. Áp dụng 3 thói quen nhỏ hàng ngày.',
        status: 'approved',
        userVotes: [
          {
            userId: 'user_4',
            userName: 'Lê Minh C',
            vote: 'approve',
            timestamp: '08/11/2024 18:20'
          },
          {
            userId: 'user_5',
            userName: 'Phạm Thu D',
            vote: 'approve',
            timestamp: '08/11/2024 19:00'
          },
          {
            userId: 'user_6',
            userName: 'Hoàng Văn E',
            vote: 'approve',
            timestamp: '08/11/2024 20:15'
          }
        ],
        aiVerification: {
          result: 'approve',
          confidence: 95,
          reason: 'Bằng chứng xuất sắc với ảnh sách, ghi chú chi tiết và kế hoạch hành động cụ thể. Thể hiện sự đọc hiểu sâu sắc.',
          timestamp: '08/11/2024 17:50'
        },
        finalVerdict: {
          result: 'approved',
          aiWeight: 60,
          userWeight: 40,
          penalizedUsers: [],
          timestamp: '08/11/2024 21:00'
        }
      },
      {
        id: 'e_demo_3',
        date: '15/11/2024',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
        description: 'Tuần 3: Hoàn thành "Thinking, Fast and Slow" - 450 trang. Viết bài review dài 1000 từ về các khái niệm System 1 và System 2.',
        status: 'approved',
        userVotes: [
          {
            userId: 'user_7',
            userName: 'Đặng Văn F',
            vote: 'approve',
            timestamp: '15/11/2024 22:30'
          },
          {
            userId: 'user_8',
            userName: 'Vũ Thị G',
            vote: 'approve',
            timestamp: '15/11/2024 23:15'
          },
          {
            userId: 'user_9',
            userName: 'Bùi Thị H',
            vote: 'approve',
            timestamp: '16/11/2024 08:00'
          }
        ],
        aiVerification: {
          result: 'approve',
          confidence: 88,
          reason: 'Ảnh chụp sách và bài review chi tiết. Nội dung thể hiện hiểu biết sâu về tâm lý học nhận thức.',
          timestamp: '15/11/2024 21:45'
        },
        finalVerdict: {
          result: 'approved',
          aiWeight: 60,
          userWeight: 40,
          penalizedUsers: [],
          timestamp: '16/11/2024 10:00'
        }
      }
    ]
  },
  {
    id: '3',
    title: 'Học tiếng Anh 2 giờ mỗi ngày',
    description: 'Cải thiện kỹ năng tiếng Anh để đạt điểm IELTS 7.0. Tập trung vào listening và speaking.',
    stake: 2000,
    startDate: '15/10/2024',
    endDate: '15/12/2024',
    mode: 'public',
    userId: '2',
    userName: 'Trần Thị B',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    status: 'active',
    progress: 85,
    difficulty: 'hard',
    category: 'Học tập',
    participants: 1,
    supporters: 45,
    evidences: []
  },
  {
    id: '4',
    title: 'Thiền định 30 phút mỗi sáng',
    description: 'Rèn luyện sức khỏe tinh thần, giảm stress và tăng sự tập trung cho công việc.',
    stake: 800,
    startDate: '01/11/2024',
    endDate: '30/11/2024',
    mode: 'public',
    userId: '3',
    userName: 'Lê Văn C',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    status: 'active',
    progress: 50,
    difficulty: 'medium',
    category: 'Sức khỏe',
    participants: 1,
    supporters: 18,
    evidences: []
  },
  {
    id: '5',
    title: 'Tập gym 5 ngày/tuần',
    description: 'Tăng cơ bắp và sức mạnh, mục tiêu tăng 5kg cơ trong 2 tháng. Follow chế độ ăn high protein.',
    stake: 1500,
    startDate: '20/10/2024',
    endDate: '20/12/2024',
    mode: 'public',
    userId: '4',
    userName: 'Phạm Minh D',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    status: 'active',
    progress: 70,
    difficulty: 'hard',
    category: 'Sức khỏe',
    participants: 1,
    supporters: 67,
    evidences: []
  },
  {
    id: '6',
    title: 'Hoàn thành khóa học lập trình',
    description: 'Học React và Node.js để chuyển nghề lập trình viên. Cam kết học 3 giờ mỗi ngày.',
    stake: 3000,
    startDate: '01/10/2024',
    endDate: '31/12/2024',
    mode: 'public',
    userId: '5',
    userName: 'Hoàng Thị E',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    status: 'active',
    progress: 45,
    difficulty: 'hard',
    category: 'Học tập',
    participants: 1,
    supporters: 89,
    evidences: []
  },
  {
    id: '7',
    title: 'Tiết kiệm 10 triệu đồng',
    description: 'Dành 500k mỗi ngày, không mua đồ không cần thiết. Mục tiêu mua laptop mới.',
    stake: 1000,
    startDate: '01/11/2024',
    endDate: '20/11/2024',
    mode: 'personal',
    userId: '6',
    userName: 'Ngô Văn F',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    status: 'active',
    progress: 30,
    difficulty: 'medium',
    category: 'Tài chính',
    participants: 1,
    supporters: 15,
    evidences: []
  },
  {
    id: '8',
    title: 'Bỏ đường trong 30 ngày',
    description: 'Thử thách No Sugar để cải thiện sức khỏe, giảm mỡ bụng và tăng năng lượng.',
    stake: 600,
    startDate: '01/11/2024',
    endDate: '30/11/2024',
    mode: 'public',
    userId: '7',
    userName: 'Đặng Thị G',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    status: 'completed',
    progress: 100,
    difficulty: 'medium',
    category: 'Sức khỏe',
    participants: 1,
    supporters: 34,
    evidences: []
  },
  {
    id: '9',
    title: 'Viết blog mỗi ngày',
    description: 'Chia sẻ kiến thức và kinh nghiệm, phát triển kỹ năng viết lách. Mục tiêu 30 bài viết.',
    stake: 700,
    startDate: '01/11/2024',
    endDate: '30/11/2024',
    mode: 'public',
    userId: '8',
    userName: 'Vũ Văn H',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    status: 'active',
    progress: 20,
    difficulty: 'medium',
    category: 'Sáng tạo',
    participants: 1,
    supporters: 28,
    evidences: []
  },
  {
    id: '10',
    title: 'Vẽ tranh mỗi tuần',
    description: 'Phát triển kỹ năng nghệ thuật, hoàn thiện 1 bức tranh mỗi tuần trong 8 tuần.',
    stake: 500,
    startDate: '01/11/2024',
    endDate: '27/12/2024',
    mode: 'public',
    userId: '9',
    userName: 'Bùi Thị I',
    userAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    status: 'active',
    progress: 25,
    difficulty: 'easy',
    category: 'Sáng tạo',
    participants: 1,
    supporters: 12,
    evidences: []
  },
];
