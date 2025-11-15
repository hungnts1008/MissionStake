import { useState } from 'react';
import { User, Page, Mission } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Trophy, 
  Coins,
  Target,
  Flame,
  Award,
  Calendar,
  TrendingUp,
  Settings
} from 'lucide-react';
import { UserPreferencesEditor } from './UserPreferencesEditor';

type ProfileProps = {
  user: User;
  onNavigate: (page: Page, missionId?: string) => void;
  setUser: (user: User) => void;
  missions: Mission[];
  onPreferencesChange?: (preferences: any) => void;
  userPreferences?: any;
};

export function Profile({ user, onNavigate, setUser, missions, onPreferencesChange, userPreferences }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedBio, setEditedBio] = useState(user.bio);

  const handlePreferencesSave = (prefs: any) => {
    if (onPreferencesChange) {
      onPreferencesChange(prefs);
    }
  };

  const userMissions = missions.filter(m => m.userId === user.id);
  const activeMissions = userMissions.filter(m => m.status === 'active');
  const completedMissions = userMissions.filter(m => m.status === 'completed');
  const failedMissions = userMissions.filter(m => m.status === 'failed');

  const totalStaked = userMissions.reduce((sum, m) => sum + m.stake, 0);
  const totalEarned = completedMissions.reduce((sum, m) => sum + (m.stake * 2), 0);
  const successRate = userMissions.length > 0 
    ? Math.round((completedMissions.length / userMissions.length) * 100) 
    : 0;

  const handleSave = () => {
    setUser({
      ...user,
      name: editedName,
      bio: editedBio
    });
    setIsEditing(false);
  };

  const achievements = [
    { icon: '🔥', title: 'Chiến binh', description: 'Hoàn thành 10 nhiệm vụ', earned: true },
    { icon: '⭐', title: 'Người kiên trì', description: 'Streak 15 ngày', earned: true },
    { icon: '🎯', title: 'Đạt mục tiêu', description: 'Tỷ lệ thành công 80%', earned: true },
    { icon: '💎', title: 'Triệu phú', description: 'Sở hữu 10,000 coins', earned: false },
    { icon: '🏆', title: 'Vô địch', description: 'Top 10 bảng xếp hạng', earned: false },
    { icon: '👑', title: 'Huyền thoại', description: 'Streak 50 ngày', earned: false },
  ];

  const activityData = [
    { month: 'T1', missions: 5, coins: 2500 },
    { month: 'T2', missions: 7, coins: 3200 },
    { month: 'T3', missions: 8, coins: 4100 },
    { month: 'T4', missions: 6, coins: 3000 },
    { month: 'T5', missions: 9, coins: 4800 },
    { month: 'T6', missions: 10, coins: 5500 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onNavigate('dashboard')}
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div>
                <h2>Hồ sơ cá nhân</h2>
                <p className="text-sm text-gray-600">Quản lý thông tin và theo dõi thành tích</p>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="size-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="size-32 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Đổi ảnh đại diện
                  </Button>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input
                        id="name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Giới thiệu</Label>
                      <Textarea
                        id="bio"
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSave}>
                        Lưu thay đổi
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="mb-2">{user.name}</h2>
                    <p className="text-gray-600 mb-4">{user.bio}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                          <Coins className="size-5" />
                          <span className="text-xl">{user.coins.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-600">Coins</p>
                      </div>
                      
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
                          <Flame className="size-5" />
                          <span className="text-xl">{user.streak}</span>
                        </div>
                        <p className="text-xs text-gray-600">Streak</p>
                      </div>
                      
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                          <Award className="size-5" />
                          <span className="text-xl">{user.reputation}</span>
                        </div>
                        <p className="text-xs text-gray-600">Uy tín</p>
                      </div>
                      
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
                          <Trophy className="size-5" />
                          <span className="text-xl">{userMissions.length}</span>
                        </div>
                        <p className="text-xs text-gray-600">Nhiệm vụ</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Đang hoạt động</CardDescription>
              <CardTitle className="text-2xl text-blue-600">{activeMissions.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Hoàn thành</CardDescription>
              <CardTitle className="text-2xl text-green-600">{completedMissions.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tỷ lệ thành công</CardDescription>
              <CardTitle className="text-2xl text-purple-600">{successRate}%</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tổng kiếm được</CardDescription>
              <CardTitle className="text-2xl text-indigo-600">
                {totalEarned.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="missions" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="missions">
              <Target className="size-4 mr-2" />
              Nhiệm vụ
            </TabsTrigger>
            <TabsTrigger value="achievements">
              <Trophy className="size-4 mr-2" />
              Thành tích
            </TabsTrigger>
            <TabsTrigger value="stats">
              <TrendingUp className="size-4 mr-2" />
              Thống kê
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="size-4 mr-2" />
              Cài đặt
            </TabsTrigger>
          </TabsList>

          {/* Missions Tab */}
          <TabsContent value="missions">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Đang hoạt động</CardTitle>
                  <CardDescription>{activeMissions.length} nhiệm vụ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeMissions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Chưa có nhiệm vụ nào</p>
                  ) : (
                    activeMissions.map((mission) => (
                      <div
                        key={mission.id}
                        className="p-4 border rounded-lg hover:border-indigo-300 cursor-pointer transition-colors"
                        onClick={() => onNavigate('mission', mission.id)}
                      >
                        <p className="mb-2">{mission.title}</p>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{mission.progress}% hoàn thành</span>
                          <Badge>{mission.stake} coins</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Đã hoàn thành</CardTitle>
                  <CardDescription>{completedMissions.length} nhiệm vụ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {completedMissions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Chưa hoàn thành nhiệm vụ nào</p>
                  ) : (
                    completedMissions.slice(0, 5).map((mission) => (
                      <div
                        key={mission.id}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="mb-1">{mission.title}</p>
                            <p className="text-sm text-gray-600">
                              +{mission.stake * 2} coins
                            </p>
                          </div>
                          <Trophy className="size-5 text-green-600" />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Huy hiệu & Thành tích</CardTitle>
                <CardDescription>
                  Hoàn thành thử thách để mở khóa huy hiệu mới
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        achievement.earned
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                          : 'bg-gray-50 border-gray-200 opacity-50'
                      }`}
                    >
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="mb-1">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      {achievement.earned ? (
                        <Badge className="mt-3 bg-green-100 text-green-700">
                          <CheckCircle className="size-3 mr-1" />
                          Đã đạt
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mt-3">
                          Chưa đạt
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động theo tháng</CardTitle>
                  <CardDescription>6 tháng gần nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityData.map((data) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{data.month}</span>
                          <span className="text-gray-600">
                            {data.missions} nhiệm vụ • {data.coins.toLocaleString()} coins
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                            style={{ width: `${(data.missions / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tổng quan tài chính</CardTitle>
                  <CardDescription>Lịch sử giao dịch coins</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tổng đặt cược</p>
                      <p className="text-2xl text-red-600">-{totalStaked.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tổng kiếm được</p>
                      <p className="text-2xl text-green-600">+{totalEarned.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Lợi nhuận ròng</p>
                    <p className="text-3xl text-indigo-600">
                      +{(totalEarned - totalStaked).toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <h4>Giao dịch gần đây</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span>Hoàn thành nhiệm vụ</span>
                        <span className="text-green-600">+2,000</span>
                      </div>
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span>Tạo nhiệm vụ mới</span>
                        <span className="text-red-600">-1,000</span>
                      </div>
                      <div className="flex justify-between p-2 bg-white rounded">
                        <span>Hoàn thành nhiệm vụ</span>
                        <span className="text-green-600">+1,200</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* AI Preferences Section */}
              <UserPreferencesEditor 
                onSave={handlePreferencesSave}
                initialPreferences={userPreferences}
              />

              {/* Account Settings Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                  <CardDescription>Quản lý thông tin và tùy chọn của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p>Thông báo email</p>
                      <p className="text-sm text-gray-600">Nhận email khi có cập nhật quan trọng</p>
                    </div>
                    <Button variant="outline" size="sm">Bật</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p>Thông báo push</p>
                      <p className="text-sm text-gray-600">Nhận thông báo khi sắp hết hạn nhiệm vụ</p>
                    </div>
                    <Button variant="outline" size="sm">Bật</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p>Hồ sơ công khai</p>
                      <p className="text-sm text-gray-600">Cho phép người khác xem hồ sơ của bạn</p>
                    </div>
                    <Button variant="outline" size="sm">Bật</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p>Ẩn danh trong bảng xếp hạng</p>
                      <p className="text-sm text-gray-600">Không hiển thị tên trong bảng xếp hạng</p>
                    </div>
                    <Button variant="outline" size="sm">Tắt</Button>
                  </div>
                </div>

                <div className="pt-6 border-t space-y-3">
                  <Button variant="outline" className="w-full">
                    Đổi mật khẩu
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                    Xóa tài khoản
                  </Button>
                </div>
              </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
