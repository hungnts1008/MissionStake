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

        {/* Quick Actions - Enhanced with Animations */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* AI Suggestions - Featured with floating animation */}
          <Card 
            className="relative overflow-hidden cursor-pointer group hover:shadow-2xl hover:scale-105 transition-all duration-500 border-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 animate-pulse-slow"
            onClick={() => onNavigate('ai-suggestions')}
          >
            {/* Animated Background Waves */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Floating Sparkle Effects */}
            <div className="absolute top-6 right-6 text-yellow-300 text-2xl animate-bounce">✨</div>
            <div className="absolute bottom-6 left-6 text-yellow-200 text-xl animate-bounce delay-100">⭐</div>
            <div className="absolute top-1/2 right-1/4 text-pink-200 text-sm animate-pulse delay-200">💫</div>
            
            <CardContent className="pt-10 pb-10 relative z-10">
              <div className="flex flex-col items-center text-center gap-4">
                {/* Icon with glow effect */}
                <div className="relative group-hover:rotate-12 transition-transform duration-500">
                  <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl animate-pulse" />
                  <div className="relative bg-white/25 backdrop-blur-sm p-5 rounded-3xl shadow-2xl group-hover:scale-110 transition-transform">
                    <Sparkles className="size-10 text-white drop-shadow-lg" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">AI Gợi Ý Nhiệm Vụ</h3>
                  <p className="text-base text-white/90 font-medium">Cá nhân hóa dành cho bạn</p>
                </div>
                
                {/* Enhanced Badge */}
                <Badge className="bg-white/25 text-white border-white/40 hover:bg-white/35 px-4 py-1 text-sm font-semibold shadow-lg">
                  🤖 AI Thông minh
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Explore Feed - Enhanced */}
          <Card 
            className="relative overflow-hidden cursor-pointer group hover:shadow-2xl hover:scale-105 transition-all duration-500 border-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
            onClick={() => onNavigate('feed')}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Floating Icons */}
            <div className="absolute top-6 right-6 text-2xl animate-bounce delay-100">🎯</div>
            <div className="absolute bottom-6 left-6 text-xl animate-pulse">📋</div>
            
            <CardContent className="pt-10 pb-10 relative z-10">
              <div className="flex flex-col items-center text-center gap-4">
                {/* Icon with scale animation */}
                <div className="relative group-hover:-rotate-12 transition-transform duration-500">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse" />
                  <div className="bg-white/25 backdrop-blur-sm p-5 rounded-3xl shadow-2xl group-hover:scale-110 transition-transform">
                    <List className="size-10 text-white drop-shadow-lg" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Khám Phá</h3>
                  <p className="text-base text-white/90 font-medium">Nhiệm vụ từ cộng đồng</p>
                </div>
                
                {/* Stats Badge */}
                <Badge className="bg-white/25 text-white border-white/40 hover:bg-white/35 px-4 py-1 text-sm font-semibold shadow-lg">
                  <TrendingUp className="size-4 mr-1" />
                  Đang thịnh hành
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard - Enhanced */}
          <Card 
            className="relative overflow-hidden cursor-pointer group hover:shadow-2xl hover:scale-105 transition-all duration-500 border-0 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500"
            onClick={() => onNavigate('leaderboard')}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Floating Trophy Effects */}
            <div className="absolute top-6 right-6 text-3xl animate-bounce">🏆</div>
            <div className="absolute bottom-6 left-6 text-xl animate-pulse delay-75">🥇</div>
            <div className="absolute top-1/3 left-1/4 text-lg animate-bounce delay-150">⭐</div>
            
            <CardContent className="pt-10 pb-10 relative z-10">
              <div className="flex flex-col items-center text-center gap-4">
                {/* Icon with rotation animation */}
                <div className="relative group-hover:rotate-12 transition-transform duration-500">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse" />
                  <div className="bg-white/25 backdrop-blur-sm p-5 rounded-3xl shadow-2xl group-hover:scale-110 transition-transform">
                    <Trophy className="size-10 text-white drop-shadow-lg" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Bảng Xếp Hạng</h3>
                  <p className="text-base text-white/90 font-medium">Cạnh tranh & vinh danh</p>
                </div>
                
                {/* Rank Badge */}
                <Badge className="bg-white/25 text-white border-white/40 hover:bg-white/35 px-4 py-1 text-sm font-semibold shadow-lg">
                  <Award className="size-4 mr-1" />
                  Top {user.reputation}
                </Badge>
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
