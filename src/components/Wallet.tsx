import { useState } from 'react';
import { User, Page } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  ArrowLeft, 
  Coins,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  TrendingUp,
  Wallet as WalletIcon,
  CreditCard,
  History
} from 'lucide-react';

type WalletProps = {
  user: User;
  onNavigate: (page: Page) => void;
};

type Transaction = {
  id: string;
  type: 'deposit' | 'withdraw' | 'reward' | 'stake' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
};

export function Wallet({ user, onNavigate }: WalletProps) {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'reward',
      amount: 2000,
      description: 'Hoàn thành nhiệm vụ "Chạy 5km mỗi ngày"',
      date: '10/11/2024 14:30',
      status: 'completed'
    },
    {
      id: '2',
      type: 'stake',
      amount: -1000,
      description: 'Đặt cược cho nhiệm vụ "Đọc sách mỗi tuần"',
      date: '09/11/2024 09:15',
      status: 'completed'
    },
    {
      id: '3',
      type: 'reward',
      amount: 1200,
      description: 'Hoàn thành nhiệm vụ "Thiền định 30 phút"',
      date: '08/11/2024 18:45',
      status: 'completed'
    },
    {
      id: '4',
      type: 'deposit',
      amount: 5000,
      description: 'Nạp coins vào ví',
      date: '05/11/2024 10:00',
      status: 'completed'
    },
    {
      id: '5',
      type: 'stake',
      amount: -500,
      description: 'Đặt cược cho nhiệm vụ "Học tiếng Anh"',
      date: '04/11/2024 16:20',
      status: 'completed'
    },
    {
      id: '6',
      type: 'refund',
      amount: 800,
      description: 'Hoàn tiền từ nhiệm vụ bị hủy',
      date: '03/11/2024 11:30',
      status: 'completed'
    },
    {
      id: '7',
      type: 'reward',
      amount: 1600,
      description: 'Hoàn thành nhiệm vụ "Tập gym"',
      date: '01/11/2024 20:15',
      status: 'completed'
    },
    {
      id: '8',
      type: 'stake',
      amount: -2000,
      description: 'Đặt cược cho nhiệm vụ "Học lập trình"',
      date: '01/11/2024 08:00',
      status: 'completed'
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="size-5 text-green-600" />;
      case 'withdraw':
        return <ArrowUpCircle className="size-5 text-red-600" />;
      case 'reward':
        return <Coins className="size-5 text-green-600" />;
      case 'stake':
        return <Coins className="size-5 text-red-600" />;
      case 'refund':
        return <Coins className="size-5 text-blue-600" />;
      default:
        return <Coins className="size-5 text-gray-600" />;
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  };

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));

  const handleDeposit = () => {
    const amount = parseInt(depositAmount);
    if (amount > 0) {
      alert(`Đã nạp ${amount.toLocaleString()} coins vào ví!`);
      setDepositAmount('');
    }
  };

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (amount > 0 && amount <= user.coins) {
      alert(`Đã rút ${amount.toLocaleString()} coins!`);
      setWithdrawAmount('');
    } else {
      alert('Số dư không đủ!');
    }
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
              <h2>Quản lý Ví Coin</h2>
              <p className="text-sm text-gray-600">Theo dõi giao dịch và quản lý tài chính</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0">
          <CardHeader>
            <CardDescription className="text-indigo-100">Số dư hiện tại</CardDescription>
            <CardTitle className="text-5xl flex items-center gap-3">
              <Coins className="size-12" />
              {user.coins.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-indigo-100 mb-1">Tổng thu nhập</p>
                <p className="text-2xl">+{totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-indigo-100 mb-1">Tổng chi tiêu</p>
                <p className="text-2xl">-{totalExpense.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-indigo-100 mb-1">Lợi nhuận ròng</p>
                <p className="text-2xl">+{(totalIncome - totalExpense).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-white text-indigo-600 hover:bg-white/90">
                    <ArrowDownCircle className="size-4 mr-2" />
                    Nạp Coins
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nạp Coins vào ví</DialogTitle>
                    <DialogDescription>
                      Chọn số lượng coins bạn muốn nạp
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setDepositAmount('1000')}
                      >
                        1,000
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDepositAmount('5000')}
                      >
                        5,000
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDepositAmount('10000')}
                      >
                        10,000
                      </Button>
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Nhập số coins..."
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Phương thức thanh toán</p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <CreditCard className="size-4 mr-2" />
                          Thẻ tín dụng/ghi nợ
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <WalletIcon className="size-4 mr-2" />
                          Ví điện tử
                        </Button>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                      onClick={handleDeposit}
                    >
                      Xác nhận nạp {depositAmount ? parseInt(depositAmount).toLocaleString() : '0'} coins
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <ArrowUpCircle className="size-4 mr-2" />
                    Rút Coins
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rút Coins</DialogTitle>
                    <DialogDescription>
                      Số dư hiện tại: {user.coins.toLocaleString()} coins
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setWithdrawAmount('1000')}
                      >
                        1,000
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setWithdrawAmount('5000')}
                      >
                        5,000
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setWithdrawAmount(user.coins.toString())}
                      >
                        Tất cả
                      </Button>
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Nhập số coins..."
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        max={user.coins}
                      />
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Phí rút: 5% (tối thiểu 100 coins)
                      </p>
                    </div>
                    <Button 
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || parseInt(withdrawAmount) > user.coins}
                    >
                      Xác nhận rút {withdrawAmount ? parseInt(withdrawAmount).toLocaleString() : '0'} coins
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Giao dịch hôm nay</CardDescription>
              <CardTitle className="text-2xl">3</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Thu nhập tuần này</CardDescription>
              <CardTitle className="text-2xl text-green-600">+3,200</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Đang stake</CardDescription>
              <CardTitle className="text-2xl text-orange-600">1,500</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tăng trưởng</CardDescription>
              <CardTitle className="text-2xl text-blue-600 flex items-center gap-2">
                <TrendingUp className="size-5" />
                +12%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Transactions */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="all">
              <History className="size-4 mr-2" />
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="income">Thu nhập</TabsTrigger>
            <TabsTrigger value="expense">Chi tiêu</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
                <CardDescription>
                  Tất cả giao dịch của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="bg-gray-100 p-3 rounded-full">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate mb-1">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="size-3" />
                          <span>{transaction.date}</span>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status === 'completed' && 'Hoàn thành'}
                            {transaction.status === 'pending' && 'Đang xử lý'}
                            {transaction.status === 'failed' && 'Thất bại'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg ${getTransactionColor(transaction.amount)}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">coins</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Thu nhập</CardTitle>
                <CardDescription>
                  Các giao dịch tăng số dư
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.filter(t => t.amount > 0).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="bg-green-100 p-3 rounded-full">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <p className="mb-1">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-green-600">
                          +{transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expense">
            <Card>
              <CardHeader>
                <CardTitle>Chi tiêu</CardTitle>
                <CardDescription>
                  Các giao dịch giảm số dư
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.filter(t => t.amount < 0).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="bg-red-100 p-3 rounded-full">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <p className="mb-1">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-red-600">
                          {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
