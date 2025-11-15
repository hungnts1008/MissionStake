import { useState, useEffect } from 'react';
import { User, Page, Mission } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  Search, 
  TrendingUp, 
  Heart,
  ThumbsDown,
  ThumbsUp,
  Users,
  Target,
  Coins,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

type MissionFeedProps = {
  user: User;
  onNavigate: (page: Page, missionId?: string) => void;
  missions: Mission[];
  setUser: (user: User) => void;
  setMissions: (missions: Mission[]) => void;
  addMission: (mission: Mission) => void;
};

export function MissionFeed({ user, onNavigate, missions, setUser, setMissions, addMission }: MissionFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [currentPage, setCurrentPage] = useState(1);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showPredictionDialog, setShowPredictionDialog] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [predictionChoice, setPredictionChoice] = useState<'success' | 'fail'>('success');
  const [predictionStake, setPredictionStake] = useState(500);
  
  const itemsPerPage = 12;
  
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  
  const [userJoined, setUserJoined] = useState<Set<string>>(new Set());
  

  

  
  const handleLikeMission = (missionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikes = new Set(userLikes);
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;
    
    if (newLikes.has(missionId)) {
      newLikes.delete(missionId);
      mission.supporters = Math.max(0, mission.supporters - 1);
    } else {
      newLikes.add(missionId);
      mission.supporters += 1;
    }
    
    setUserLikes(newLikes);
    setMissions([...missions]);
  };
  
  const handleJoinMission = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user already has a joined copy of this mission
    const hasJoinedCopy = missions.some(m => 
      m.id.startsWith(`${mission.id}_joined_${user.id}_`) && m.userId === user.id
    );
    
    if (hasJoinedCopy || userJoined.has(mission.id)) {
      alert('Bạn đã tham gia nhiệm vụ này rồi!');
      return;
    }
    if (mission.userId === user.id) {
      alert('Bạn không thể tham gia nhiệm vụ của chính mình!');
      return;
    }
    if (mission.status === 'completed') {
      alert('Nhiệm vụ này đã hoàn thành! Không thể tham gia.');
      return;
    }
    if (mission.status === 'failed') {
      alert('Nhiệm vụ này đã thất bại! Không thể tham gia.');
      return;
    }
    setSelectedMission(mission);
    setShowJoinDialog(true);
  };
  
  const confirmJoinMission = () => {
    if (!selectedMission) return;
    const joinStake = Math.floor(selectedMission.stake * 0.5);
    
    if (user.coins < joinStake) {
      alert(`Không đủ coins! Cần ${joinStake} coins để tham gia.`);
      setShowJoinDialog(false);
      return;
    }
    
    setUser({ ...user, coins: user.coins - joinStake });
    const newJoined = new Set(userJoined);
    newJoined.add(selectedMission.id);
    setUserJoined(newJoined);
    
    // Update original mission participants count
    const mission = missions.find(m => m.id === selectedMission.id);
    if (mission) {
      mission.participants += 1;
      setMissions([...missions]);
    }
    
    // Create a copy of the mission for current user's dashboard
    const userMissionCopy: Mission = {
      ...selectedMission,
      id: `${selectedMission.id}_joined_${user.id}_${Date.now()}`, // Unique ID for user's copy
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      stake: joinStake,
      mode: 'personal', // Show as personal mission in user's dashboard
      evidences: [], // Reset evidences for user's own tracking
      progress: 0, // Reset progress
    };
    
    addMission(userMissionCopy);
    
    setShowJoinDialog(false);
    alert(`✅ Đã tham gia nhiệm vụ "${selectedMission.title}"!\n💰 Đặt cược: ${joinStake} coins\n\n📋 Nhiệm vụ đã được thêm vào Dashboard của bạn!`);
  };
  
  const handlePrediction = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation();
    if (mission.userId === user.id) {
      alert('Bạn không thể dự đoán nhiệm vụ của chính mình!');
      return;
    }
    if (mission.status === 'completed') {
      alert('Nhiệm vụ này đã hoàn thành! Không thể dự đoán.');
      return;
    }
    if (mission.status === 'failed') {
      alert('Nhiệm vụ này đã thất bại! Không thể dự đoán.');
      return;
    }
    // Check if user already made a prediction for this mission
    const existing = mission.predictions?.find(p => p.userId === user.id);
    if (existing) {
      alert(`Bạn đã dự đoán nhiệm vụ này sẽ ${existing.prediction === 'success' ? 'THÀNH CÔNG' : 'THẤT BẠI'}!\n💰 Đặt cược: ${existing.stake} coins`);
      return;
    }
    setSelectedMission(mission);
    setPredictionChoice('success');
    setPredictionStake(500);
    setShowPredictionDialog(true);
  };
  
  const confirmPrediction = () => {
    if (!selectedMission) return;
    
    if (user.coins < predictionStake) {
      alert(`Không đủ coins! Cần ${predictionStake} coins để dự đoán.`);
      setShowPredictionDialog(false);
      return;
    }
    
    setUser({ ...user, coins: user.coins - predictionStake });
    
    const newPrediction = {
      userId: user.id,
      userName: user.name,
      prediction: predictionChoice,
      stake: predictionStake,
      timestamp: Date.now(),
    };
    
    // Add prediction to the mission's predictions array
    const updatedMissions = missions.map(m => {
      if (m.id === selectedMission.id) {
        return {
          ...m,
          predictions: [...(m.predictions || []), newPrediction]
        };
      }
      return m;
    });
    
    setMissions(updatedMissions);
    setShowPredictionDialog(false);
    
    alert(`✅ Đã dự đoán nhiệm vụ "${selectedMission.title}" sẽ ${predictionChoice === 'success' ? 'THÀNH CÔNG' : 'THẤT BẠI'}!\n💰 Đặt cược: ${predictionStake} coins\n\n🎁 Nếu đúng, bạn sẽ nhận ${predictionStake * 2} coins!`);
  };
  
  const getUserPrediction = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    return mission?.predictions?.find(p => p.userId === user.id);
  };

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDifficulty, selectedCategory, sortBy]);

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      {/* Header with Gradient */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate('dashboard')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🌟 Khám Phá Nhiệm Vụ
              </h2>
              <p className="text-sm text-white/90">Tham gia hoặc ủng hộ các nhiệm vụ trong cộng đồng</p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-white">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Coins className="size-5" />
                <span className="font-semibold">{user.coins.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border border-purple-100">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 size-5 text-indigo-400" />
                <Input
                  placeholder="🔍 Tìm kiếm nhiệm vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-2 border-indigo-100 focus:border-indigo-400 rounded-xl text-base"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="h-12 border-2 border-purple-100 focus:border-purple-400 rounded-xl">
                <SelectValue placeholder="📊 Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ khó</SelectItem>
                <SelectItem value="easy">🟢 Dễ</SelectItem>
                <SelectItem value="medium">🟡 Trung bình</SelectItem>
                <SelectItem value="hard">🔴 Khó</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 border-2 border-pink-100 focus:border-pink-400 rounded-xl">
                <SelectValue placeholder="⚡ Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">🔥 Xu hướng (Hot nhất)</SelectItem>
                <SelectItem value="participants">👥 Nhiều người tham gia</SelectItem>
                <SelectItem value="stake">💰 Stake cao</SelectItem>
                <SelectItem value="recent">🆕 Mới nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
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
                  className={`gap-2 h-10 px-4 rounded-full transition-all ${
                    selectedCategory === cat.id 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105' 
                      : 'hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={`ml-1 ${selectedCategory === cat.id ? 'bg-white/20 text-white' : ''}`}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Stats Summary with Gradients */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-3 w-fit mx-auto mb-3">
                  <TrendingUp className="size-8" />
                </div>
                <p className="text-3xl font-bold mb-1">{sortedMissions.length}</p>
                <p className="text-sm text-white/90">Nhiệm vụ {selectedCategory !== 'all' ? selectedCategory : ''}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-3 w-fit mx-auto mb-3">
                  <Users className="size-8" />
                </div>
                <p className="text-3xl font-bold mb-1">
                  {sortedMissions.reduce((sum: number, m: Mission) => sum + m.participants, 0)}
                </p>
                <p className="text-sm text-white/90">Người tham gia</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-3 w-fit mx-auto mb-3">
                  <Coins className="size-8" />
                </div>
                <p className="text-3xl font-bold mb-1">
                  {sortedMissions.reduce((sum: number, m: Mission) => sum + m.stake, 0).toLocaleString()}
                </p>
                <p className="text-sm text-white/90">Tổng Stake</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-400 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-full p-3 w-fit mx-auto mb-3">
                  <Target className="size-8" />
                </div>
                <p className="text-3xl font-bold mb-1">{userJoined.size}</p>
                <p className="text-sm text-white/90">Bạn đã tham gia</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission List */}
        <div className="space-y-4">
          {sortedMissions.length === 0 ? (
            <Card className="p-12 text-center">
              <Target className="size-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl mb-2">Không tìm thấy nhiệm vụ</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
            </Card>
          ) : (
            sortedMissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((mission) => {
              const isLiked = userLikes.has(mission.id);
              // Check both userJoined Set and missions array for joined copy
              const hasJoinedCopy = missions.some(m => 
                m.id.startsWith(`${mission.id}_joined_${user.id}_`) && m.userId === user.id
              );
              const isJoined = userJoined.has(mission.id) || hasJoinedCopy;
              const prediction = getUserPrediction(mission.id);
              const isOwnMission = mission.userId === user.id;
              return (
              <Card 
                key={mission.id}
                className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group bg-white/90 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300 overflow-hidden"
                onClick={() => onNavigate('mission', mission.id)}
              >
                {/* Top Gradient Bar */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${getDifficultyColor(mission.difficulty)} px-3 py-1 font-semibold`}>
                      {mission.difficulty === 'easy' && '🟢 Dễ'}
                      {mission.difficulty === 'medium' && '🟡 Trung bình'}
                      {mission.difficulty === 'hard' && '🔴 Khó'}
                    </Badge>
                    <Badge className={`${getStatusColor(mission.status)} px-3 py-1 font-semibold`}>
                      {mission.status === 'active' && '⚡ Đang hoạt động'}
                      {mission.status === 'completed' && '✅ Hoàn thành'}
                      {mission.status === 'failed' && '❌ Thất bại'}
                    </Badge>
                  </div>

                  <CardTitle className="line-clamp-2 text-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
                    {mission.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-gray-600">
                    {mission.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Trending Badge */}
                  {calculateTrendingScore(mission) > 10 && (
                    <div className="flex items-center gap-2 mb-2 bg-gradient-to-r from-orange-50 to-red-50 p-2 rounded-lg border border-orange-200">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md">
                        🔥 Hot
                      </Badge>
                      <span className="text-xs text-orange-700 font-medium">
                        {mission.participants + mission.supporters} hoạt động
                      </span>
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl">
                    <Avatar className="size-10 ring-2 ring-purple-200">
                      <AvatarImage src={mission.userAvatar} alt={mission.userName} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-600 text-white">
                        {mission.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{mission.userName}</p>
                      <p className="text-xs text-gray-500">Người tạo</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-indigo-50 p-3 rounded-xl">
                      <div className="bg-indigo-500 p-2 rounded-lg">
                        <Coins className="size-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Stake</p>
                        <p className="font-bold text-indigo-600">{mission.stake}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-xl">
                      <div className="bg-purple-500 p-2 rounded-lg">
                        <Clock className="size-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Hạn</p>
                        <p className="font-bold text-purple-600 text-xs">{mission.endDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Category & Progress */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs border-2 border-purple-200 text-purple-700 font-semibold">
                      {mission.category}
                    </Badge>
                    {mission.status === 'active' && (
                      <Badge className="text-xs bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0">
                        📊 {mission.progress}% hoàn thành
                      </Badge>
                    )}
                  </div>

                  {/* Actions - Redesigned Buttons */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t-2 border-purple-100">
                    <Button 
                      variant={isJoined ? "default" : "outline"}
                      size="sm"
                      className={`h-11 font-semibold transition-all ${
                        isJoined 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-xl border-0' 
                          : 'border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 text-indigo-700'
                      }`}
                      onClick={(e: React.MouseEvent) => handleJoinMission(mission, e)}
                      disabled={isOwnMission || isJoined || mission.status === 'completed' || mission.status === 'failed'}
                    >
                      <Users className="size-4 mr-1" />
                      <span className="text-xs">
                        {isJoined ? '✓ Đã tham gia' : mission.status === 'completed' ? 'Đã xong' : mission.status === 'failed' ? 'Đã fail' : 'Tham gia'}
                      </span>
                    </Button>
                    <Button 
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      className={`h-11 font-semibold transition-all ${
                        isLiked 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg hover:shadow-xl border-0' 
                          : 'border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-400 text-pink-700'
                      }`}
                      onClick={(e: React.MouseEvent) => handleLikeMission(mission.id, e)}
                    >
                      <Heart className={`size-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="text-xs">{mission.supporters}</span>
                    </Button>
                    <Button 
                      variant={prediction ? "default" : "outline"}
                      size="sm"
                      className={`h-11 font-semibold transition-all ${
                        prediction 
                          ? prediction.prediction === 'success'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg border-0'
                            : 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg border-0'
                          : 'border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-400 text-amber-700'
                      }`}
                      onClick={(e: React.MouseEvent) => handlePrediction(mission, e)}
                      disabled={isOwnMission || !!prediction || mission.status === 'completed' || mission.status === 'failed'}
                    >
                      {prediction ? (
                        prediction.prediction === 'success' ? (
                          <><ThumbsUp className="size-4 mr-1" /><span className="text-xs">Thành công</span></>
                        ) : (
                          <><ThumbsDown className="size-4 mr-1" /><span className="text-xs">Thất bại</span></>
                        )
                      ) : mission.status === 'completed' || mission.status === 'failed' ? (
                        <><Target className="size-4 mr-1" /><span className="text-xs">Đã kết thúc</span></>
                      ) : (
                        <><Target className="size-4 mr-1" /><span className="text-xs">Dự đoán</span></>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              );
            })
          )}
        </div>
        
        {/* Pagination - Redesigned */}
        {Math.ceil(sortedMissions.length / itemsPerPage) > 1 && (
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border-2 border-purple-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-10 px-4 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold"
              >
                <ChevronLeft className="size-4 mr-1" />
                Trước
              </Button>
              
              <div className="flex gap-2">
                {[...Array(Math.ceil(sortedMissions.length / itemsPerPage))].map((_, i) => {
                  const page = i + 1;
                  const totalPages = Math.ceil(sortedMissions.length / itemsPerPage);
                  if (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[44px] h-10 rounded-xl font-bold transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-110 border-0'
                            : 'border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-400'
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-purple-400 font-bold">...</span>;
                  }
                  return null;
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(sortedMissions.length / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(sortedMissions.length / itemsPerPage)}
                className="h-10 px-4 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold"
              >
                Sau
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
            
            <span className="text-sm text-gray-600 bg-white/80 px-4 py-2 rounded-full shadow-sm">
              📄 Trang <span className="font-bold text-indigo-600">{currentPage}</span> / {Math.ceil(sortedMissions.length / itemsPerPage)} • Tổng <span className="font-bold text-purple-600">{sortedMissions.length}</span> nhiệm vụ
            </span>
          </div>
        )}

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
      
      {/* Join Mission Dialog - Redesigned */}
      <AlertDialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              🚀 Tham gia nhiệm vụ
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
                <p className="font-semibold text-gray-800 mb-2">📋 {selectedMission?.title}</p>
                <p className="text-xs text-gray-600">{selectedMission?.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border-2 border-indigo-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">💰 Stake cần đặt</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {selectedMission && Math.floor(selectedMission.stake * 0.5)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">coins (50% gốc)</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-green-200 shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">🎁 Phần thưởng</p>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedMission && Math.floor(selectedMission.stake * 0.5) * 2}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">coins nếu xong</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                <p className="text-sm font-medium text-yellow-800">💼 Số dư hiện tại: <span className="font-bold">{user.coins.toLocaleString()}</span> coins</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-2 hover:bg-gray-100">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmJoinMission}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl shadow-lg"
            >
              ✓ Xác nhận tham gia
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Prediction Dialog - Redesigned */}
      <AlertDialog open={showPredictionDialog} onOpenChange={setShowPredictionDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎯 Dự đoán kết quả
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
                <p className="font-semibold text-gray-800 mb-2">📋 {selectedMission?.title}</p>
                <p className="text-xs text-gray-600">{selectedMission?.description}</p>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Chọn dự đoán của bạn:</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={predictionChoice === 'success' ? 'default' : 'outline'}
                    onClick={() => setPredictionChoice('success')}
                    className={`h-24 flex-col gap-2 rounded-xl transition-all ${
                      predictionChoice === 'success'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl scale-105 border-0'
                        : 'border-2 border-green-200 hover:border-green-400 hover:bg-green-50'
                    }`}
                  >
                    <ThumbsUp className="size-8" />
                    <span className="font-bold">✓ Thành công</span>
                  </Button>
                  <Button
                    variant={predictionChoice === 'fail' ? 'default' : 'outline'}
                    onClick={() => setPredictionChoice('fail')}
                    className={`h-24 flex-col gap-2 rounded-xl transition-all ${
                      predictionChoice === 'fail'
                        ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-xl scale-105 border-0'
                        : 'border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50'
                    }`}
                  >
                    <ThumbsDown className="size-8" />
                    <span className="font-bold">✗ Thất bại</span>
                  </Button>
                </div>
              </div>
                
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">💰 Số coins đặt cược:</label>
                <Input
                  type="number"
                  min={100}
                  max={user.coins}
                  step={100}
                  value={predictionStake}
                  onChange={(e) => setPredictionStake(Number(e.target.value))}
                  className="h-12 text-lg font-bold text-center border-2 border-amber-200 focus:border-amber-400 rounded-xl"
                />
                <div className="flex gap-2">
                  {[500, 1000, 2000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setPredictionStake(amount)}
                      className="flex-1 rounded-lg border-2 hover:bg-amber-50"
                      disabled={amount > user.coins}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>
                
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border-2 border-amber-200 space-y-2">
                <p className="text-sm font-medium text-gray-700">💰 Đặt cược: <span className="font-bold text-amber-600">{predictionStake}</span> coins</p>
                <p className="text-sm font-medium text-gray-700">💼 Số dư còn lại: <span className="font-bold">{user.coins - predictionStake}</span> coins</p>
                <div className="h-px bg-amber-200 my-2" />
                <p className="text-sm font-semibold text-green-600">✓ Nếu đoán đúng: +{predictionStake * 2} coins</p>
                <p className="text-sm font-semibold text-red-600">✗ Nếu đoán sai: Mất {predictionStake} coins</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-2 hover:bg-gray-100">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmPrediction}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl shadow-lg"
            >
              🎯 Xác nhận dự đoán
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
