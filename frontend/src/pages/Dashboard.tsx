import { useState, useEffect } from 'react';
import { useTradeStore } from '../stores/tradeStore';
import TradeForm from '../components/TradeForm';
import TradeList from '../components/TradeList';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

export default function Dashboard() {
  const { trades, setTrades, setLoading, setError } = useTradeStore();
  const [showTradeForm, setShowTradeForm] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/trades`);
      setTrades(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch trades');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600">Trading Daddddshboard</h1>
        <button
          onClick={() => setShowTradeForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          New Trade
        </button>
        <Button>Test Shad Button</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TradeList trades={trades} onRefresh={fetchTrades} />
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-red-900 mb-4">Portfossslio Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Trades:</span>
                <span className="font-medium">{trades.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Executed:</span>
                <span className="font-medium text-green-600">
                  {trades.filter(t => t.status === 'EXECUTED').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending:</span>
                <span className="font-medium text-yellow-600">
                  {trades.filter(t => t.status === 'PENDING').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTradeForm && (
        <TradeForm
          onClose={() => setShowTradeForm(false)}
          onSuccess={() => {
            setShowTradeForm(false);
            fetchTrades();
          }}
        />
      )}
    </div>
  );
}
