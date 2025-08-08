import { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TradeList from '@/components/TradeList';
import EnhancedTradeModal from '@/components/EnhancedTradeModal';
import EnhancedTradeViewModal from '@/components/EnhancedTradeViewModal';
import type { Trade } from '@/types/Trade';

const Dashboard = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  // Calculate dashboard metrics based on new structure
  const totalTrades = trades.length;
  const completedTrades = trades.filter(trade => trade.trade.exit_price).length;
  const winningTrades = trades.filter(trade => trade.trade.win_loss === 'W').length;

  function calculatePnL_USD(trade: Trade): number {
    const { entry_price, exit_price, margin, size, side = 0 } = trade.trade;
    console.log('Calculating PnL for trade:', entry_price, exit_price, margin, side);
    if (exit_price === undefined || entry_price === 0 || margin === undefined) return 0;

    // เปอร์เซ็นต์การเปลี่ยนแปลงของราคา
    const pnl = side === 'LONG'
        ? (exit_price - entry_price) * size 
        : (entry_price - exit_price) * size;

    console.log('PnL:', pnl);
    return pnl;
  }

  const totalPnL = trades.reduce((sum, trade) => {
    console.log('sum', sum, 'trade', trade);
    return sum + calculatePnL_USD(trade);
  }, 0);
  console.log('Total PnL:', totalPnL);
  const winRate = completedTrades > 0 ? (winningTrades / completedTrades) * 100 : 0;

  // Calculate average grade
  const gradesWithValues = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  const tradesWithGrades = trades.filter(trade => trade.trade.grade);
  const averageGrade = tradesWithGrades.length > 0
    ? tradesWithGrades.reduce((sum, trade) => sum + (gradesWithValues[trade.trade.grade!] || 0), 0) / tradesWithGrades.length
    : 0;

  const handleAddTrade = (trade: Omit<Trade, '_id'>) => {
    const newTrade: Trade = {
      ...trade,
      _id: Date.now().toString(),
    };
    setTrades(prev => [newTrade, ...prev]);
    setIsModalOpen(false);
  };

  const handleEditTrade = (updatedTrade: Trade) => {
    setTrades(prev => prev.map(trade =>
      trade._id === updatedTrade._id ? updatedTrade : trade
    ));
    setEditingTrade(null);
    setIsModalOpen(false);
  };

  const handleDeleteTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade._id !== id));
    setSelectedTrade(null);
  };

  const handleViewTrade = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const handleEditClick = (trade: Trade) => {
    setEditingTrade(trade);
    setSelectedTrade(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTrade(null);
  };

  const handleCloseView = () => {
    setSelectedTrade(null);
  };

  const getGradeLetter = (grade: number) => {
    if (grade >= 3.5) return 'A';
    if (grade >= 2.5) return 'B';
    if (grade >= 1.5) return 'C';
    if (grade >= 0.5) return 'D';
    return 'F';
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Trading Journal</h1>
          <p className="text-gray-600 mt-1">Advanced trade tracking with detailed analytics</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.open('https://tradingview.com', '_blank')}
            className="flex items-center gap-2"
          >
            <Target size={20} />
            Charts
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white hover:bg-white hover:text-black transition-colors duration-500"
          >
            <Plus size={20} />
            Add Trade
          </Button>
        </div>
      </div>

      {/* Enhanced Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrades}</div>
            <p className="text-xs text-muted-foreground">
              {completedTrades} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {completedTrades} trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {winningTrades} / {completedTrades} wins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getGradeLetter(averageGrade)}</div>
            <p className="text-xs text-muted-foreground">
              {tradesWithGrades.length} graded trades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trade List */}
      <TradeList
        trades={trades}
        onViewTrade={handleViewTrade}
        onEditTrade={handleEditClick}
        onDeleteTrade={handleDeleteTrade}
      />

      {/* Enhanced Add/Edit Modal */}
      <EnhancedTradeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingTrade ? handleEditTrade : handleAddTrade}
        trade={editingTrade}
      />

      {/* Enhanced View Trade Modal */}
      {selectedTrade && (
        <EnhancedTradeViewModal
          trade={selectedTrade}
          onClose={handleCloseView}
          onEdit={() => handleEditClick(selectedTrade)}
          onDelete={() => handleDeleteTrade(selectedTrade._id!)}
        />
      )}
    </div>
  );
};

export default Dashboard;
