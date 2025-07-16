import { create } from 'zustand';
import type { Trade } from '../types';

interface TradeState {
  trades: Trade[];
  selectedTrade: Trade | null;
  isLoading: boolean;
  error: string | null;
  setTrades: (trades: Trade[]) => void;
  addTrade: (trade: Trade) => void;
  updateTrade: (id: string, trade: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  setSelectedTrade: (trade: Trade | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  trades: [],
  selectedTrade: null,
  isLoading: false,
  error: null,
  setTrades: (trades) => set({ trades }),
  addTrade: (trade) =>
    set((state) => ({ trades: [trade, ...state.trades] })),
  updateTrade: (id, updatedTrade) =>
    set((state) => ({
      trades: state.trades.map((trade) =>
        trade.id === id ? { ...trade, ...updatedTrade } : trade
      ),
    })),
  deleteTrade: (id) =>
    set((state) => ({
      trades: state.trades.filter((trade) => trade.id !== id),
    })),
  setSelectedTrade: (trade) => set({ selectedTrade: trade }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
