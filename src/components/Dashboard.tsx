import { User, Page, Mission } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Coins, 
  Target, 
  Trophy, 
  TrendingUp, 
  Plus, 
  List, 
  Users, 
  Wallet,
  Bell,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';

type DashboardProps = {
  user: User;
  onNavigate: (page: Page) => void;
  setUser: (user: User) => void;
  // NOTE: Nhận danh sách missions từ App.tsx thay vì dùng mockMissions
  missions: Mission[];
};

export function Dashboard({ user, onNavigate, setUser, missions }: DashboardProps) {
  // NOTE: Lọc missions từ props thay vì từ mockMissions
  const activeMissions = missions.filter(m => m.userId === user.id && m.status === 'active');
  const completedMissions = missions.filter(m => m.userId === user.id && m.status === 'completed');
  
  const notifications = [
    { id: '1', text: 'Nhiệm vụ "Chạy 5km mỗi ngày" sắp hết hạn!', time: '2 giờ trước', unread: true },
    { id: '2', text: 'Bạn đã nhận được 500 coins từ nhiệm vụ hoàn thành', time: '5 giờ trước', unread: true },
    { id: '3', text: 'Nguyễn Văn B đã ủng hộ nhiệm vụ của bạn', time: '1 ngày trước', unread: false },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
                <Target className="size-6 text-white" />
              </div>
              <h1 className="text-indigo-600">MissionStake</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
                Tổng quan
              </Button>
              <Button variant="ghost" onClick={() => onNavigate('feed')}>
                <List className="size-4 mr-2" />
                Khám phá
              </Button>
              <Button variant="ghost" onClick={() => onNavigate('leaderboard')}>
                <Trophy className="size-4 mr-2" />
                Bảng xếp hạng
              </Button>
            </nav>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => onNavigate('wallet')}>
                <Coins className="size-4 mr-2" />
                {user.coins.toLocaleString()}
              </Button>
              
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="size-5" />
                </Button>
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />
                )}
              </div>
              
              <Avatar className="cursor-pointer" onClick={() => onNavigate('profile')}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2>Xin chào, {user.name}! 👋</h2>
          <p className="text-gray-600">Hãy tiếp tục hành trình chinh phục mục tiêu của bạn</p>
        </div>

        {/* Stats Cards - Redesigned */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Coins */}
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg transition-shadow duration-300">
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-yellow-50 font-medium text-xs">Tổng Coins</CardDescription>
              <CardTitle className="text-white flex items-center gap-2 text-2xl">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                  <Coins className="size-5" />
                </div>
                {user.coins.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-yellow-50 flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  +500 tuần này
                </p>
                <div className="text-xl">💰</div>
              </div>
            </CardContent>
          </Card>

          {/* Active Missions */}
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-indigo-50 font-medium text-xs">Nhiệm vụ đang hoạt động</CardDescription>
              <CardTitle className="text-white flex items-center gap-2 text-2xl">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                  <Target className="size-5" />
                </div>
                {activeMissions.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-indigo-50 flex items-center gap-1">
                  <Award className="size-3" />
                  78% hoàn thành
                </p>
                <div className="text-xl">🎯</div>
              </div>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 shadow-lg transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Flame animation dots */}
            <div className="absolute top-2 right-2 flex gap-1">
              <div className="w-1 h-1 bg-yellow-300 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-75" />
              <div className="w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-150" />
            </div>
            
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-orange-50 font-medium text-xs">Streak hiện tại</CardDescription>
              <CardTitle className="text-white flex items-center gap-2 text-2xl">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                  <Flame className="size-5" />
                </div>
                {user.streak} ngày
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-orange-50 flex items-center gap-1">
                  <Trophy className="size-3" />
                  Kỷ lục: 30 ngày
                </p>
                <div className="text-xl">🔥</div>
              </div>
            </CardContent>
          </Card>

          {/* Reputation */}
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-lg transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Star particles */}
            <div className="absolute top-4 right-4 text-yellow-200 text-xs animate-bounce">⭐</div>
            <div className="absolute bottom-4 left-4 text-yellow-300 text-xs animate-bounce delay-100">✨</div>
            
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-emerald-50 font-medium text-xs">Uy tín</CardDescription>
              <CardTitle className="text-white flex items-center gap-2 text-2xl">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                  <Award className="size-5" />
                </div>
                {user.reputation}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-emerald-50 flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  Top 15% cộng đồng
                </p>
                <div className="text-xl">🏅</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Redesigned */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* AI Suggestions - Featured */}
          <Card 
            className="relative overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600"
            onClick={() => onNavigate('ai-suggestions')}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Sparkle Effects */}
            <div className="absolute top-4 right-4 text-yellow-300 animate-pulse">✨</div>
            <div className="absolute bottom-4 left-4 text-yellow-200 animate-pulse delay-75">⭐</div>
            
            <CardContent className="pt-8 pb-8 relative z-10">
              <div className="flex flex-col items-center text-center gap-3">
                {/* Icon with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />
                  <div className="relative bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <Sparkles className="size-8 text-white" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">AI Gợi Ý Nhiệm Vụ</h3>
                  <p className="text-sm text-white/80">Cá nhân hóa dành cho bạn</p>
                </div>
                
                {/* Badge */}
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  🤖 Thông minh
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Explore Feed */}
          <Card 
            className="relative overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-2 border-indigo-200 hover:border-indigo-400"
            onClick={() => onNavigate('feed')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardContent className="pt-8 pb-8 relative z-10">
              <div className="flex flex-col items-center text-center gap-3">
                {/* Icon */}
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  <List className="size-7 text-indigo-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Khám Phá</h3>
                  <p className="text-sm text-gray-600">Nhiệm vụ từ cộng đồng</p>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                    <TrendingUp className="size-3 mr-1" />
                    Mới nhất
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card 
            className="relative overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-2 border-amber-200 hover:border-amber-400"
            onClick={() => onNavigate('leaderboard')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-yellow-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardContent className="pt-8 pb-8 relative z-10">
              <div className="flex flex-col items-center text-center gap-3">
                {/* Icon with trophy */}
                <div className="bg-gradient-to-br from-amber-100 to-yellow-100 p-4 rounded-2xl group-hover:scale-110 transition-transform relative">
                  <Trophy className="size-7 text-amber-600" />
                  <div className="absolute -top-1 -right-1 text-xl">🏆</div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Bảng Xếp Hạng</h3>
                  <p className="text-sm text-gray-600">Cạnh tranh & vinh danh</p>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    <Award className="size-3 mr-1" />
                    Top {user.reputation}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Missions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Nhiệm vụ đang hoạt động</CardTitle>
                <CardDescription>Theo dõi tiến độ các nhiệm vụ của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeMissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="size-12 mx-auto mb-3 opacity-30" />
                    <p>Chưa có nhiệm vụ nào đang hoạt động</p>
                    <Button 
                      variant="link" 
                      onClick={() => onNavigate('create')}
                      className="mt-2"
                    >
                      Tạo nhiệm vụ đầu tiên
                    </Button>
                  </div>
                ) : (
                  activeMissions.map((mission) => (
                    <div 
                      key={mission.id}
                      className="p-4 border rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                      onClick={() => onNavigate('mission', mission.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="mb-1">{mission.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">{mission.description}</p>
                        </div>
                        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                          {mission.stake} coins
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Tiến độ</span>
                          <span>{mission.progress}%</span>
                        </div>
                        <Progress value={mission.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Bắt đầu: {mission.startDate}</span>
                          <span>Kết thúc: {mission.endDate}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            {completedMissions.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Thành tích gần đây</CardTitle>
                  <CardDescription>Những nhiệm vụ bạn đã hoàn thành</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {completedMissions.slice(0, 3).map((mission) => (
                    <div 
                      key={mission.id}
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="bg-green-500 text-white p-2 rounded-full">
                        <Trophy className="size-4" />
                      </div>
                      <div className="flex-1">
                        <p>{mission.title}</p>
                        <p className="text-sm text-gray-600">+{mission.stake * 2} coins</p>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        Hoàn thành
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Huy hiệu của bạn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="text-sm py-1"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="size-5" />
                  Thông báo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-3 rounded-lg ${notif.unread ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'}`}
                  >
                    <p className="text-sm">{notif.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  Xu hướng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p>💪 Tập gym đang hot nhất tuần này</p>
                  <p>📚 Đọc sách: +25% người tham gia</p>
                  <p>🏃 Chạy bộ buổi sáng: 1,234 người</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
