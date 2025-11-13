import { useState } from 'react';
import { User, Page, Mission } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Search, 
  TrendingUp, 
  Filter,
  Heart,
  ThumbsDown,
  Users,
  Target,
  Coins,
  Clock
} from 'lucide-react';

type MissionFeedProps = {
  user: User;
  onNavigate: (page: Page, missionId?: string) => void;
  missions: Mission[];
};

export function MissionFeed({ user, onNavigate, missions }: MissionFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  const publicMissions = missions.filter(m => m.mode === 'public');

  // Danh sách categories
  const categories = [
    { id: 'all', name: 'Tất cả', icon: '🌟' },
    { id: 'Sức khỏe', name: 'Sức khỏe', icon: '💪' },
    { id: 'Học tập', name: 'Học tập', icon: '📚' },
    { id: 'Thể thao', name: 'Thể thao', icon: '⚽' },
    { id: 'Tài chính', name: 'Tài chính', icon: '💰' },
    { id: 'Sáng tạo', name: 'Sáng tạo', icon: '🎨' },
    { id: 'Công việc', name: 'Công việc', icon: '💼' },
    { id: 'Xã hội', name: 'Xã hội', icon: '👥' },
  ];

  // Calculate trending score
  const calculateTrendingScore = (mission: Mission) => {
    return (mission.supporters * 2) + (mission.participants * 3) + (mission.progress / 10);
  };

  const filteredMissions = publicMissions.filter(mission => {
    const matchesSearch = mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mission.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || mission.difficulty === filterDifficulty;
    const matchesCategory = selectedCategory === 'all' || mission.category === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const sortedMissions = [...filteredMissions].sort((a, b) => {
    if (sortBy === 'trending') return calculateTrendingScore(b) - calculateTrendingScore(a);
    if (sortBy === 'stake') return b.stake - a.stake;
    if (sortBy === 'participants') return b.participants - a.participants;
    if (sortBy === 'recent') return b.id.localeCompare(a.id);
    return 0;
  });

  // Limit 20 missions per category để tránh quá tải
  const limitedMissions = sortedMissions.slice(0, 20);

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'easy') return 'bg-green-100 text-green-700';
    if (difficulty === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'active') return 'bg-blue-100 text-blue-700';
    if (status === 'failed') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex-1">
              <h2>Khám Phá Nhiệm Vụ</h2>
              <p className="text-sm text-gray-600">Tham gia hoặc ủng hộ các nhiệm vụ trong cộng đồng</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 size-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm nhiệm vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ khó</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Xu hướng (Hot nhất)</SelectItem>
                <SelectItem value="participants">Nhiều người tham gia</SelectItem>
                <SelectItem value="stake">Stake cao</SelectItem>
                <SelectItem value="recent">Mới nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => {
              const count = cat.id === 'all' 
                ? publicMissions.length 
                : publicMissions.filter(m => m.category === cat.id).length;
              
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="gap-1"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="size-8 mx-auto mb-2 text-indigo-500" />
                <p className="text-2xl font-bold">{limitedMissions.length}</p>
                <p className="text-sm text-gray-600">Nhiệm vụ {selectedCategory !== 'all' ? selectedCategory : ''}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="size-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">
                  {limitedMissions.reduce((sum, m) => sum + m.participants, 0)}
                </p>
                <p className="text-sm text-gray-600">Người tham gia</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Coins className="size-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">
                  {limitedMissions.reduce((sum, m) => sum + m.stake, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Tổng Stake</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission List */}
        <div className="space-y-4">
          {limitedMissions.length === 0 ? (
            <Card className="p-12 text-center">
              <Target className="size-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl mb-2">Không tìm thấy nhiệm vụ</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
            </Card>
          ) : (
            limitedMissions.map((mission) => (
              <Card 
                key={mission.id}
                className="hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => onNavigate('mission', mission.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={getDifficultyColor(mission.difficulty)}>
                      {mission.difficulty === 'easy' && 'Dễ'}
                      {mission.difficulty === 'medium' && 'Trung bình'}
                      {mission.difficulty === 'hard' && 'Khó'}
                    </Badge>
                    <Badge className={getStatusColor(mission.status)}>
                      {mission.status === 'active' && 'Đang hoạt động'}
                      {mission.status === 'completed' && 'Hoàn thành'}
                      {mission.status === 'failed' && 'Thất bại'}
                    </Badge>
                  </div>

                  <CardTitle className="line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {mission.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {mission.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Trending Badge */}
                  {calculateTrendingScore(mission) > 10 && (
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                        🔥 Hot
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {mission.participants + mission.supporters} hoạt động
                      </span>
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarImage src={mission.userAvatar} alt={mission.userName} />
                      <AvatarFallback>{mission.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{mission.userName}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Coins className="size-4" />
                      <span>{mission.stake} coins</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="size-4" />
                      <span>{mission.endDate}</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {mission.category}
                    </Badge>
                    {mission.status === 'active' && (
                      <Badge variant="outline" className="text-xs">
                        {mission.progress}% hoàn thành
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Đã tham gia nhiệm vụ!');
                      }}
                    >
                      <Users className="size-3 mr-1" />
                      Tham gia
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Đã ủng hộ!');
                      }}
                    >
                      <Heart className="size-3 mr-1" />
                      {mission.supporters}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Dự đoán thất bại!');
                      }}
                    >
                      <ThumbsDown className="size-3 mr-1" />
                      Dự đoán
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Trending Section */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Xu hướng trong tuần
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Nhiệm vụ phổ biến nhất</p>
                <p>💪 Tập gym 5 ngày/tuần</p>
                <p className="text-sm text-indigo-600 mt-2">+67 người tham gia</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Stake cao nhất</p>
                <p>🎓 Hoàn thành khóa học lập trình</p>
                <p className="text-sm text-indigo-600 mt-2">3,000 coins</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tỷ lệ thành công cao</p>
                <p>🧘 Thiền định 30 phút mỗi sáng</p>
                <p className="text-sm text-green-600 mt-2">92% hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
