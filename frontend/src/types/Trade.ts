
export interface Trade {
  _id?: string;
  user_id?: string;
  trade: {
    symbol: string;
    side: 'LONG' | 'SHORT';
    leverage?: number;
    size: number;
    entry_price: number;
    exit_price?: number;
    entry_date: string;
    exit_date?: string;
    duration_days?: number;
    margin?: number;
    fee_usd?: number;
    pnl_percent?: number;
    pnl_usd?: number;
    win_loss?: 'W' | 'L';
    grade?: 'A' | 'B' | 'C' | 'D' | 'F';
    note?: string;
  };
  setup?: {
    name?: string;
    reason?: string;
    timeframe?: string;
    entry_chart_url?: string;
  };
  stop?: {
    condition?: string;
    sl_percent?: number;
    risk_usd?: number;
  };
  exit?: {
    type?: 'TP' | 'SL' | 'Manual';
    rrr?: number;
    tp_percent?: number;
    exit_chart_url?: string;
    exit_plan?: string;
    exit_execution?: string;
  };
  custom_fields?: Record<string, any>;
}
