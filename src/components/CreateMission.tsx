import { useState } from 'react';
import { User, Page } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Coins, 
  Info, 
  Target,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

type CreateMissionProps = {
  user: User;
  onNavigate: (page: Page) => void;
  setUser: (user: User) => void;
};

export function CreateMission({ user, onNavigate, setUser }: CreateMissionProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stake, setStake] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [mode, setMode] = useState<'personal' | 'group' | 'public'>('personal');
  const [difficulty, setDifficulty] = useState('medium');
  const [category, setCategory] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const stakeAmount = parseInt(stake);
    
    if (stakeAmount > user.coins) {
      alert('Bạn không đủ coin để đặt cược!');
      return;
    }

    // Deduct coins
    const updatedUser = { ...user, coins: user.coins - stakeAmount };
    setUser(updatedUser);

    alert('Nhiệm vụ đã được tạo thành công! 🎉');
    onNavigate('dashboard');
  };

  const potentialReward = stake ? parseInt(stake) * 2 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h2>Tạo Nhiệm Vụ Mới</h2>
              <p className="text-sm text-gray-600">Cam kết mục tiêu và đặt cược để thành công</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Alert */}
        <Alert className="mb-6 border-indigo-200 bg-indigo-50">
          <Info className="size-4" />
          <AlertDescription>
            <strong>Cách hoạt động:</strong> Đặt cược coin vào mục tiêu của bạn. Hoàn thành nhiệm vụ sẽ nhận lại gấp đôi số coin, thất bại sẽ mất toàn bộ.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="size-5" />
                  Thông tin nhiệm vụ
                </CardTitle>
                <CardDescription>
                  Điền đầy đủ thông tin để tạo nhiệm vụ của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Tên nhiệm vụ *</Label>
                    <Input
                      id="title"
                      placeholder="VD: Chạy 5km mỗi ngày trong 30 ngày"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả chi tiết *</Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả mục tiêu, lý do và cách thực hiện..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Sức khỏe</SelectItem>
                        <SelectItem value="learning">Học tập</SelectItem>
                        <SelectItem value="finance">Tài chính</SelectItem>
                        <SelectItem value="creative">Sáng tạo</SelectItem>
                        <SelectItem value="social">Xã hội</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stake */}
                  <div className="space-y-2">
                    <Label htmlFor="stake">Số coin đặt cược *</Label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-3 size-4 text-gray-400" />
                      <Input
                        id="stake"
                        type="number"
                        min="100"
                        max={user.coins}
                        placeholder="Nhập số coin"
                        value={stake}
                        onChange={(e) => setStake(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Số dư hiện tại: {user.coins.toLocaleString()} coins
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ngày bắt đầu *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 size-4" />
                            {startDate ? format(startDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Ngày kết thúc *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 size-4" />
                            {endDate ? format(endDate, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) => !startDate || date <= startDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Độ khó</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Dễ</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="hard">Khó</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mode */}
                  <div className="space-y-2">
                    <Label>Chế độ *</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        type="button"
                        variant={mode === 'personal' ? 'default' : 'outline'}
                        onClick={() => setMode('personal')}
                        className="h-auto py-4 flex-col gap-1"
                      >
                        <span>🔒</span>
                        <span className="text-sm">Cá nhân</span>
                      </Button>
                      <Button
                        type="button"
                        variant={mode === 'group' ? 'default' : 'outline'}
                        onClick={() => setMode('group')}
                        className="h-auto py-4 flex-col gap-1"
                      >
                        <span>👥</span>
                        <span className="text-sm">Nhóm</span>
                      </Button>
                      <Button
                        type="button"
                        variant={mode === 'public' ? 'default' : 'outline'}
                        onClick={() => setMode('public')}
                        className="h-auto py-4 flex-col gap-1"
                      >
                        <span>🌍</span>
                        <span className="text-sm">Công khai</span>
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      {mode === 'personal' && 'Chỉ bạn thấy và theo dõi'}
                      {mode === 'group' && 'Chia sẻ với nhóm bạn bè'}
                      {mode === 'public' && 'Mọi người có thể xem và ủng hộ'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? 'Ẩn xem trước' : 'Xem trước'}
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                      disabled={!title || !description || !stake || !startDate || !endDate}
                    >
                      <Sparkles className="size-4 mr-2" />
                      Tạo nhiệm vụ
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-4">
            {/* Reward Card */}
            <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coins className="size-5 text-indigo-600" />
                  Phần thưởng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Đặt cược</p>
                  <p className="text-red-600">-{stake || 0} coins</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">⬇️</div>
                  <p className="text-sm text-gray-600">Hoàn thành nhiệm vụ</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Nhận về</p>
                  <p className="text-green-600">+{potentialReward.toLocaleString()} coins</p>
                </div>
                <p className="text-xs text-center text-gray-500">
                  Lợi nhuận: +{stake ? parseInt(stake).toLocaleString() : 0} coins
                </p>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Mẹo thành công</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span>✅</span>
                  <p>Đặt mục tiêu cụ thể và đo lường được</p>
                </div>
                <div className="flex gap-2">
                  <span>✅</span>
                  <p>Bắt đầu với stake nhỏ để tạo thói quen</p>
                </div>
                <div className="flex gap-2">
                  <span>✅</span>
                  <p>Nộp bằng chứng mỗi ngày để theo dõi tiến độ</p>
                </div>
                <div className="flex gap-2">
                  <span>✅</span>
                  <p>Chọn chế độ công khai để nhận sự hỗ trợ</p>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {showPreview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Xem trước</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Tiêu đề</p>
                    <p>{title || 'Chưa có tiêu đề'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mô tả</p>
                    <p className="text-sm">{description || 'Chưa có mô tả'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Stake</p>
                      <p>{stake || 0} coins</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Chế độ</p>
                      <p className="capitalize">{mode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
