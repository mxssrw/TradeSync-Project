import { TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Trade } from '@/types/Trade';

interface EnhancedTradeViewModalProps {
  trade: Trade;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EnhancedTradeViewModal = ({ 
  trade, 
  onClose, 
  onEdit, 
  onDelete 
}: EnhancedTradeViewModalProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div 
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{trade.trade.symbol}</h2>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                trade.trade.side === 'LONG' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {trade.trade.side === 'LONG' ? (
                  <><TrendingUp size={14} /> LONG</>
                ) : (
                  <><TrendingDown size={14} /> SHORT</>
                )}
              </div>
              {trade.trade.grade && (
                <div className={`px-2 py-1 rounded-full text-sm font-bold ${
                  trade.trade.grade === 'A' ? 'bg-green-100 text-green-800' :
                  trade.trade.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                  trade.trade.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                  trade.trade.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Grade {trade.trade.grade}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Trade Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {trade.setup?.entry_chart_url && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Entry Chart</h3>
                <img
                  src={trade.setup.entry_chart_url}
                  alt="Entry Chart"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
            {trade.exit?.exit_chart_url && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Exit Chart</h3>
                <img
                  src={trade.exit.exit_chart_url}
                  alt="Exit Chart"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Trade Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Trade Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trade Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{trade.trade.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Entry Price:</span>
                  <span className="font-medium">${trade.trade.entry_price}</span>
                </div>
                {trade.trade.exit_price && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exit Price:</span>
                    <span className="font-medium">${trade.trade.exit_price}</span>
                  </div>
                )}
                {trade.trade.leverage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Leverage:</span>
                    <span className="font-medium">{trade.trade.leverage}x</span>
                  </div>
                )}
                {trade.trade.pnl_usd !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">P&L:</span>
                    <span className={`font-medium ${trade.trade.pnl_usd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${trade.trade.pnl_usd.toFixed(2)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Setup Info */}
            {trade.setup && Object.keys(trade.setup).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trade.setup.name && (
                    <div>
                      <span className="text-gray-600 text-sm">Name:</span>
                      <p className="font-medium">{trade.setup.name}</p>
                    </div>
                  )}
                  {trade.setup.timeframe && (
                    <div>
                      <span className="text-gray-600 text-sm">Timeframe:</span>
                      <p className="font-medium">{trade.setup.timeframe}</p>
                    </div>
                  )}
                  {trade.setup.reason && (
                    <div>
                      <span className="text-gray-600 text-sm">Reason:</span>
                      <p className="text-sm">{trade.setup.reason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Exit Info */}
            {trade.exit && Object.keys(trade.exit).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Exit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trade.exit.type && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{trade.exit.type}</span>
                    </div>
                  )}
                  {trade.exit.rrr && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">R:R Ratio:</span>
                      <span className="font-medium">{trade.exit.rrr}</span>
                    </div>
                  )}
                  {trade.exit.exit_plan && (
                    <div>
                      <span className="text-gray-600 text-sm">Plan:</span>
                      <p className="text-sm">{trade.exit.exit_plan}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Custom Fields */}
          {trade.custom_fields && Object.keys(trade.custom_fields).length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Custom Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(trade.custom_fields).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {trade.trade.note && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{trade.trade.note}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button onClick={onEdit} variant="outline" className="flex-1">
              Edit Trade
            </Button>
            <Button className="flex-1 bg-black text-white hover:bg-white hover:text-red-600 transition-colors duration-500" onClick={onDelete}>
              Delete Trade
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTradeViewModal;
