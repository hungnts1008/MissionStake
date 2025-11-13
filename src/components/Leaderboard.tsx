import { User, Page } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Trophy, 
  Coins, 
  Flame, 
  Award,
  TrendingUp,
  Crown,
  Medal
} from 'lucide-react';

type LeaderboardProps = {
  user: User;
  onNavigate: (page: Page) => void;
};

const topUsers = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    coins: 15000,
    streak: 45,
    reputation: 1250,
    missions: 28,
    successRate: 92
  },
  {
    id: '2',
    name: 'Trần Thị B',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    coins: 12500,
    streak: 38,
    reputation: 1100,
    missions: 24,
    successRate: 88
  },
  {
    id: '3',
    name: 'Lê Văn C',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    coins: 11000,
    streak: 30,
    reputation: 980,
    missions: 22,
    successRate: 85
  },
  {
    id: '4',
    name: 'Phạm Minh D',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    coins: 9800,
    streak: 28,
    reputation: 920,
    missions: 20,
    successRate: 90
  },
  {
    id: '5',
    name: 'Hoàng Thị E',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    coins: 8500,
    streak: 25,
    reputation: 850,
    missions: 18,
    successRate: 87
  },
  {
    id: '6',
    name: 'Ngô Văn F',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    coins: 7200,
    streak: 20,
    reputation: 780,
    missions: 16,
    successRate: 82
  },
  {
    id: '7',
    name: 'Đặng Thị G',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    coins: 6800,
    streak: 18,
    reputation: 720,
    missions: 15,
    successRate: 80
  },
  {
    id: '8',
    name: 'Vũ Văn H',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    coins: 6200,
    streak: 17,
    reputation: 680,
    missions: 14,
    successRate: 78
  },
];

export function Leaderboard({ user, onNavigate }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="size-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="size-6 text-gray-400" />;
    if (rank === 3) return <Medal className="size-6 text-orange-600" />;
    return <span className="text-lg">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300';
    return 'bg-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex-1">
              <h2>Bảng Xếp Hạng</h2>
              <p className="text-sm text-gray-600">Cạnh tranh lành mạnh với cộng đồng</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Top 3 Podium */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Trophy className="size-6" />
                Top 3 Tuần Này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {/* 2nd Place */}
                <div className="order-1 md:order-1">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="inline-block mb-3">
                      <Medal className="size-12 text-gray-300" />
                    </div>
                    <Avatar className="size-20 mx-auto mb-3 border-4 border-white/30">
                      <AvatarImage src={topUsers[1].avatar} alt={topUsers[1].name} />
                      <AvatarFallback>{topUsers[1].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="mb-2">{topUsers[1].name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Coins className="size-4" />
                      <span>{topUsers[1].coins.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-white/80">{topUsers[1].missions} nhiệm vụ</p>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="order-first md:order-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center transform md:scale-110">
                    <div className="inline-block mb-3">
                      <Crown className="size-16 text-yellow-300" />
                    </div>
                    <Avatar className="size-24 mx-auto mb-3 border-4 border-yellow-300">
                      <AvatarImage src={topUsers[0].avatar} alt={topUsers[0].name} />
                      <AvatarFallback>{topUsers[0].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="mb-2">{topUsers[0].name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Coins className="size-5" />
                      <span className="text-xl">{topUsers[0].coins.toLocaleString()}</span>
                    </div>
                    <p className="text-white/90">{topUsers[0].missions} nhiệm vụ</p>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="order-2 md:order-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <div className="inline-block mb-3">
                      <Medal className="size-12 text-orange-400" />
                    </div>
                    <Avatar className="size-20 mx-auto mb-3 border-4 border-white/30">
                      <AvatarImage src={topUsers[2].avatar} alt={topUsers[2].name} />
                      <AvatarFallback>{topUsers[2].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="mb-2">{topUsers[2].name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Coins className="size-4" />
                      <span>{topUsers[2].coins.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-white/80">{topUsers[2].missions} nhiệm vụ</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="coins" className="space-y-6">
          <TabsList className="bg-white grid w-full grid-cols-4">
            <TabsTrigger value="coins">
              <Coins className="size-4 mr-2" />
              Coins
            </TabsTrigger>
            <TabsTrigger value="streak">
              <Flame className="size-4 mr-2" />
              Streak
            </TabsTrigger>
            <TabsTrigger value="reputation">
              <Award className="size-4 mr-2" />
              Uy tín
            </TabsTrigger>
            <TabsTrigger value="missions">
              <Trophy className="size-4 mr-2" />
              Nhiệm vụ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coins" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Xếp hạng theo Coins</CardTitle>
                <CardDescription>Người dùng có nhiều coins nhất</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topUsers.map((userData, index) => (
                  <div
                    key={userData.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all hover:shadow-md ${getRankBg(index + 1)}`}
                  >
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className="size-12">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p>{userData.name}</p>
                        {userData.id === user.id && (
                          <Badge variant="outline" className="text-xs">Bạn</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{userData.missions} nhiệm vụ</span>
                        <span>•</span>
                        <span>{userData.successRate}% thành công</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Coins className="size-5" />
                        <span className="text-xl">{userData.coins.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="streak" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Xếp hạng theo Streak</CardTitle>
                <CardDescription>Người dùng duy trì streak dài nhất</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...topUsers].sort((a, b) => b.streak - a.streak).map((userData, index) => (
                  <div
                    key={userData.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all hover:shadow-md ${getRankBg(index + 1)}`}
                  >
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className="size-12">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p>{userData.name}</p>
                        {userData.id === user.id && (
                          <Badge variant="outline" className="text-xs">Bạn</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{userData.coins.toLocaleString()} coins</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-orange-600">
                        <Flame className="size-5" />
                        <span className="text-xl">{userData.streak}</span>
                      </div>
                      <p className="text-xs text-gray-500">ngày</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reputation" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Xếp hạng theo Uy tín</CardTitle>
                <CardDescription>Người dùng có uy tín cao nhất</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...topUsers].sort((a, b) => b.reputation - a.reputation).map((userData, index) => (
                  <div
                    key={userData.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all hover:shadow-md ${getRankBg(index + 1)}`}
                  >
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className="size-12">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p>{userData.name}</p>
                        {userData.id === user.id && (
                          <Badge variant="outline" className="text-xs">Bạn</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{userData.successRate}% tỷ lệ thành công</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-600">
                        <Award className="size-5" />
                        <span className="text-xl">{userData.reputation}</span>
                      </div>
                      <p className="text-xs text-gray-500">điểm uy tín</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missions" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Xếp hạng theo Nhiệm vụ</CardTitle>
                <CardDescription>Người dùng hoàn thành nhiều nhiệm vụ nhất</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...topUsers].sort((a, b) => b.missions - a.missions).map((userData, index) => (
                  <div
                    key={userData.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg transition-all hover:shadow-md ${getRankBg(index + 1)}`}
                  >
                    <div className="w-12 flex items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className="size-12">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p>{userData.name}</p>
                        {userData.id === user.id && (
                          <Badge variant="outline" className="text-xs">Bạn</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{userData.successRate}% thành công</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-purple-600">
                        <Trophy className="size-5" />
                        <span className="text-xl">{userData.missions}</span>
                      </div>
                      <p className="text-xs text-gray-500">nhiệm vụ</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="size-5 text-green-600" />
                Vị trí của bạn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl mb-2">#15</p>
              <p className="text-sm text-gray-600">Top 15% cộng đồng</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Coins className="size-5 text-indigo-600" />
                Coins của bạn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl mb-2">{user.coins.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Cần {topUsers[0].coins - user.coins} để lên #1</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="size-5 text-orange-600" />
                Streak hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl mb-2">{user.streak} ngày</p>
              <p className="text-sm text-gray-600">Kỷ lục: 30 ngày</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
