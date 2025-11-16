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
  Settings,
  CheckCircle2,
  CheckCircle
} from 'lucide-react';
import { Progress } from './ui/progress';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header with Gradient */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onNavigate('dashboard')}
                className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Hồ Sơ Cá Nhân
                </h1>
                <p className="text-sm text-gray-500">Quản lý thông tin và theo dõi thành tích của bạn</p>
              </div>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="bg-indigo-600 hover:bg-indigo-700">
                <Edit className="size-4 mr-2" />
                Chỉnh Sửa Hồ Sơ
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Compact Profile Header with Decorative Elements */}
        <div className="relative mb-8">
          {/* Decorative Background Shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 size-40 bg-indigo-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-5 -right-10 size-60 bg-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-20 size-32 bg-pink-400/20 rounded-full blur-2xl"></div>
          </div>

          {/* Compact User Card */}
          <Card className="relative border-none shadow-xl bg-white/80 backdrop-blur-lg overflow-hidden">
            <CardContent className="py-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="size-20 border-3 border-white shadow-lg ring-2 ring-indigo-200">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow">
                    ⭐ Top {Math.ceil((user.reputation / 1000) * 100)}%
                  </div>
                </div>

                {/* User Info */}
                {isEditing ? (
                  <div className="flex-1 space-y-3">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="font-semibold"
                    />
                    <Textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        Lưu
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                    <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                  </div>
                )}

                {/* Quick Stats Inline */}
                <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-indigo-600 mb-1">
                      <Coins className="size-4" />
                      <span className="text-lg font-bold">{user.coins.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase">Coins</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-orange-600 mb-1">
                      <Flame className="size-4" />
                      <span className="text-lg font-bold">{user.streak}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase">Streak</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-600 mb-1">
                      <Award className="size-4" />
                      <span className="text-lg font-bold">{user.reputation}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase">Uy Tín</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-purple-600 mb-1">
                      <Trophy className="size-4" />
                      <span className="text-lg font-bold">{userMissions.length}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase">Nhiệm Vụ</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Stats Dashboard - Card Style */}
        <div className="relative mb-8">
          {/* Decorative Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 left-1/4 size-64 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-10 right-1/4 size-48 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
          </div>

          {/* Main Stats Container */}
          <Card className="relative border-none shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8">
              {/* Stats Grid - 2x2 on Desktop, Stack on Mobile */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Stat 1 - Đang Hoạt Động */}
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-blue-100 hover:border-blue-300">
                  <div className="absolute top-0 right-0 size-32 bg-blue-400/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                          <Target className="size-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Đang Hoạt Động</p>
                          <p className="text-3xl font-black text-blue-600">{activeMissions.length}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${Math.min((activeMissions.length / 10) * 100, 100)}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">nhiệm vụ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat 2 - Đã Hoàn Thành */}
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-green-100 hover:border-green-300">
                  <div className="absolute top-0 right-0 size-32 bg-green-400/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="size-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Đã Hoàn Thành</p>
                          <p className="text-3xl font-black text-green-600">{completedMissions.length}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-green-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" style={{ width: `${Math.min((completedMissions.length / 10) * 100, 100)}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">nhiệm vụ</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat 3 - Tỷ Lệ Thành Công */}
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-purple-100 hover:border-purple-300">
                  <div className="absolute top-0 right-0 size-32 bg-purple-400/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                          <TrendingUp className="size-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Tỷ Lệ Thành Công</p>
                          <p className="text-3xl font-black text-purple-600">{successRate}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" style={{ width: `${successRate}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{successRate >= 80 ? '🎯 Xuất sắc' : successRate >= 60 ? '👍 Tốt' : '💪 Cố gắng'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat 4 - Tổng Kiếm Được */}
                <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-amber-100 hover:border-amber-300">
                  <div className="absolute top-0 right-0 size-32 bg-amber-400/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                          <Coins className="size-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Tổng Kiếm Được</p>
                          <p className="text-3xl font-black text-amber-600">{totalEarned.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-amber-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full" style={{ width: `${Math.min((totalEarned / 10000) * 100, 100)}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">coins</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Tabs */}
        <Tabs defaultValue="missions" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur p-2 rounded-2xl shadow-lg border border-gray-200/50 h-auto">
            <TabsTrigger 
              value="missions"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-xl py-3 transition-all"
            >
              <Target className="size-4 mr-2" />
              <span className="font-medium">Nhiệm Vụ</span>
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-xl py-3 transition-all"
            >
              <Trophy className="size-4 mr-2" />
              <span className="font-medium">Thành Tích</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-xl py-3 transition-all"
            >
              <TrendingUp className="size-4 mr-2" />
              <span className="font-medium">Thống Kê</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-xl py-3 transition-all"
            >
              <Settings className="size-4 mr-2" />
              <span className="font-medium">Cài Đặt</span>
            </TabsTrigger>
          </TabsList>

          {/* Missions Tab - Enhanced */}
          <TabsContent value="missions">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="size-5 text-blue-600" />
                    </div>
                    Đang Hoạt Động
                  </CardTitle>
                  <CardDescription className="text-base font-medium text-gray-600">
                    {activeMissions.length} nhiệm vụ đang thực hiện
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  {activeMissions.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="size-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Chưa có nhiệm vụ nào</p>
                    </div>
                  ) : (
                    activeMissions.map((mission) => (
                      <div
                        key={mission.id}
                        className="p-5 border-2 border-gray-100 rounded-2xl hover:border-indigo-300 hover:shadow-lg cursor-pointer transition-all bg-gradient-to-r from-white to-blue-50/30"
                        onClick={() => onNavigate('mission', mission.id)}
                      >
                        <p className="mb-3 font-semibold text-gray-800">{mission.title}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-600">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
                                style={{ width: `${mission.progress}%` }}
                              />
                            </div>
                            <span className="font-medium">{mission.progress}%</span>
                          </span>
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                            {mission.stake} coins
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-white/80 backdrop-blur overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="size-5 text-green-600" />
                    </div>
                    Đã Hoàn Thành
                  </CardTitle>
                  <CardDescription className="text-base font-medium text-gray-600">
                    {completedMissions.length} nhiệm vụ đã hoàn thành
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  {completedMissions.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="size-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Chưa hoàn thành nhiệm vụ nào</p>
                    </div>
                  ) : (
                    completedMissions.slice(0, 5).map((mission) => (
                      <div
                        key={mission.id}
                        className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="mb-2 font-semibold text-gray-800 flex items-center gap-2">
                              {mission.title}
                              <CheckCircle2 className="size-4 text-green-600" />
                            </p>
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-sm font-medium">
                              <Coins className="size-3" />
                              +{mission.stake * 2} coins
                            </span>
                          </div>
                          <Trophy className="size-6 text-green-600" />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab - Flowing Card Design */}
          <TabsContent value="achievements">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Trophy className="size-6 text-amber-600" />
                  </div>
                  Huy Hiệu & Thành Tích
                </CardTitle>
                <CardDescription className="text-base">
                  Hoàn thành thử thách để mở khóa huy hiệu mới và nâng cao uy tín
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="flex flex-wrap gap-6 justify-center">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-8 rounded-3xl transition-all transform hover:scale-105 hover:rotate-1 flex-shrink-0 w-[280px] ${
                        achievement.earned
                          ? 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 shadow-2xl border-4 border-yellow-300'
                          : 'bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg border-4 border-gray-300 opacity-50 hover:opacity-70'
                      }`}
                    >
                      <div className="text-7xl mb-5 text-center drop-shadow-lg">{achievement.icon}</div>
                      <h3 className={`mb-3 text-center font-bold text-xl ${achievement.earned ? 'text-white' : 'text-gray-700'}`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm text-center leading-relaxed mb-4 ${achievement.earned ? 'text-white/90' : 'text-gray-600'}`}>
                        {achievement.description}
                      </p>
                      {achievement.earned ? (
                        <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-full py-2 px-4 text-white font-bold text-sm">
                          <CheckCircle className="size-4" />
                          Đã Đạt Được
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 bg-gray-300/50 rounded-full py-2 px-4 text-gray-600 font-bold text-sm">
                          🔒 Chưa Mở Khóa
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab - Enhanced */}
          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <TrendingUp className="size-5 text-indigo-600" />
                    </div>
                    Hoạt Động Theo Tháng
                  </CardTitle>
                  <CardDescription className="text-base">6 tháng gần nhất</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    {activityData.map((data) => (
                      <div key={data.month} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">{data.month}</span>
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                            {data.missions} nhiệm vụ • {data.coins.toLocaleString()} coins
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all"
                            style={{ width: `${(data.missions / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Coins className="size-5 text-emerald-600" />
                    </div>
                    Tổng Quan Tài Chính
                  </CardTitle>
                  <CardDescription className="text-base">Lịch sử giao dịch coins</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Tổng Đặt Cược</p>
                      <p className="text-3xl font-bold text-red-600">-{totalStaked.toLocaleString()}</p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Tổng Kiếm Được</p>
                      <p className="text-3xl font-bold text-green-600">+{totalEarned.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Lợi Nhuận Ròng</p>
                    <p className="text-4xl font-bold text-indigo-600">
                      +{(totalEarned - totalStaked).toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-gray-100 space-y-4">
                    <h4 className="font-bold text-lg text-gray-800">Giao Dịch Gần Đây</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <span className="font-medium">Hoàn thành nhiệm vụ</span>
                        <span className="text-green-700 font-bold text-lg">+2,000</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
                        <span className="font-medium">Tạo nhiệm vụ mới</span>
                        <span className="text-red-700 font-bold text-lg">-1,000</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <span className="font-medium">Hoàn thành nhiệm vụ</span>
                        <span className="text-green-700 font-bold text-lg">+1,200</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab - Enhanced */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* AI Preferences Section */}
              <UserPreferencesEditor 
                onSave={handlePreferencesSave}
                initialPreferences={userPreferences}
              />

              {/* Account Settings Section - Enhanced */}
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Settings className="size-5 text-slate-600" />
                    </div>
                    Cài Đặt Tài Khoản
                  </CardTitle>
                  <CardDescription className="text-base">Quản lý thông tin và tùy chọn cá nhân của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 border-2 border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Thông báo email</p>
                      <p className="text-sm text-gray-600 mt-1">Nhận email khi có cập nhật quan trọng</p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" size="sm">Bật</Button>
                  </div>

                  <div className="flex items-center justify-between p-5 border-2 border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Thông báo push</p>
                      <p className="text-sm text-gray-600 mt-1">Nhận thông báo khi sắp hết hạn nhiệm vụ</p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" size="sm">Bật</Button>
                  </div>

                  <div className="flex items-center justify-between p-5 border-2 border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Hồ sơ công khai</p>
                      <p className="text-sm text-gray-600 mt-1">Cho phép người khác xem hồ sơ của bạn</p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" size="sm">Bật</Button>
                  </div>

                  <div className="flex items-center justify-between p-5 border-2 border-gray-100 rounded-2xl hover:border-indigo-200 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Ẩn danh trong bảng xếp hạng</p>
                      <p className="text-sm text-gray-600 mt-1">Không hiển thị tên trong bảng xếp hạng</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300">Tắt</Button>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-gray-100 space-y-3">
                  <Button variant="outline" className="w-full py-6 text-base font-medium border-2 hover:border-indigo-300 hover:bg-indigo-50">
                    🔒 Đổi Mật Khẩu
                  </Button>
                  <Button variant="outline" className="w-full py-6 text-base font-medium text-red-600 border-2 border-red-200 hover:bg-red-50 hover:border-red-300">
                    🗑️ Xóa Tài Khoản
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
