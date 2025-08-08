import { Edit, Eye, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Trade } from '@/types/Trade';

interface TradeListProps {
  trades: Trade[];
  onViewTrade: (trade: Trade) => void;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
}

const TradeList = ({ trades, onViewTrade, onEditTrade, onDeleteTrade }: TradeListProps) => {
  if (trades.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <TrendingUp size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No trades yet</h3>
        <p className="text-gray-500">Start your enhanced trading journey by adding your first trade</p>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {trades.map((trade) => {
        const pnl = trade.trade.pnl_usd;
        const isCompleted = trade.trade.exit_price !== undefined;
        
        return (
          <div
            key={trade._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onViewTrade(trade)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Chart Preview */}
                {trade.setup?.entry_chart_url && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={trade.setup.entry_chart_url}
                      alt="Trade chart"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{trade.trade.symbol}</h3>
                    
                    {/* Side Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trade.trade.side === 'LONG' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.trade.side === 'LONG' ? (
                        <><TrendingUp size={12} className="mr-1" /> LONG</>
                      ) : (
                        <><TrendingDown size={12} className="mr-1" /> SHORT</>
                      )}
                    </span>

                    {/* Status Badge */}
                    <Badge variant={isCompleted ? "default" : "secondary"}>
                      {isCompleted ? "Completed" : "Open"}
                    </Badge>

                    {/* Grade Badge */}
                    {trade.trade.grade && (
                      <Badge 
                        variant="outline"
                        className={
                          trade.trade.grade === 'A' ? 'border-green-200 text-green-700' :
                          trade.trade.grade === 'B' ? 'border-blue-200 text-blue-700' :
                          trade.trade.grade === 'C' ? 'border-yellow-200 text-yellow-700' :
                          trade.trade.grade === 'D' ? 'border-orange-200 text-orange-700' :
                          'border-red-200 text-red-700'
                        }
                      >
                        {trade.trade.grade}
                      </Badge>
                    )}

                    {/* Leverage Badge */}
                    {trade.trade.leverage && (
                      <Badge variant="outline">
                        {trade.trade.leverage}x
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Entry: ${trade.trade.entry_price}</span>
                    {trade.trade.exit_price && <span>Exit: ${trade.trade.exit_price}</span>}
                    <span>Size: {trade.trade.size}</span>
                    <span>Margin: ${trade.trade.margin}</span>
                    <span>{formatDate(trade.trade.entry_date)}</span>
                    {trade.trade.duration_days && <span>{trade.trade.duration_days}d</span>}
                  </div>

                  {/* Setup Info */}
                  {trade.setup?.name && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-400">Setup: </span>
                      <span className="text-xs text-gray-600">{trade.setup.name}</span>
                      {trade.setup.timeframe && (
                        <span className="text-xs text-gray-400 ml-2">({trade.setup.timeframe})</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* P&L Display */}
                {pnl !== undefined && (
                  <div className={`text-right ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="font-semibold text-lg">
                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                    </div>
                    {trade.trade.pnl_percent !== undefined && (
                      <div className="text-xs">
                        {trade.trade.pnl_percent >= 0 ? '+' : ''}{trade.trade.pnl_percent.toFixed(1)}%
                      </div>
                    )}
                    {trade.exit?.rrr && (
                      <div className="text-xs text-gray-500">
                        R:R {trade.exit.rrr}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewTrade(trade)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTrade(trade)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTrade(trade._id!)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TradeList;
