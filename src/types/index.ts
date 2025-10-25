// Core wallet and portfolio types
export interface Wallet {
  id: string;
  address: string;
  ensName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  total_value: number;
  total_value_change_24h: number;
  positions: Position[];
  chart_data: ChartDataPoint[];
}

export interface Position {
  id: string;
  asset: Asset;
  quantity: number;
  value: number;
  value_change_24h: number;
  percentage: number;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  image_url?: string;
  price: number;
  price_change_24h: number;
  market_cap?: number;
  volume_24h?: number;
}

export interface Transaction {
  id: string;
  hash: string;
  type: 'swap' | 'transfer' | 'approval' | 'mint' | 'burn';
  from_address: string;
  to_address: string;
  value: number;
  value_usd: number;
  asset: Asset;
  timestamp: Date;
  block_number: number;
  gas_used: number;
  gas_price: number;
  status: 'success' | 'failed' | 'pending';
  metadata?: TransactionMetadata;
}

export interface TransactionMetadata {
  swap?: {
    from_asset: Asset;
    to_asset: Asset;
    from_amount: number;
    to_amount: number;
    price_impact: number;
    slippage: number;
  };
  transfer?: {
    amount: number;
    asset: Asset;
  };
  approval?: {
    spender: string;
    amount: number;
    asset: Asset;
  };
}

export interface ChartDataPoint {
  timestamp: Date;
  value: number;
  change_24h: number;
}

// Trading analysis types
export interface TradingStyle {
  type: 'degen' | 'holder' | 'yield_farmer' | 'nft_collector' | 'day_trader' | 'arbitrageur';
  score: number; // 0-100
  confidence: number; // 0-100
  traits: string[];
}

export interface PerformanceMetrics {
  total_trades: number;
  win_rate: number;
  average_hold_time: number; // in days
  profit_factor: number;
  sharpe_ratio: number;
  max_drawdown: number;
  best_trade: number;
  worst_trade: number;
  risk_score: number; // 0-100
}

export interface WalletStats {
  total_value: number;
  value_change_24h: number;
  value_change_7d: number;
  value_change_30d: number;
  total_trades: number;
  active_days: number;
  top_holding: Asset;
  trading_style: TradingStyle;
  performance: PerformanceMetrics;
}

// Social features
export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: Date;
}

export interface User {
  id: string;
  wallet_address: string;
  ens_name?: string;
  bio?: string;
  avatar_url?: string;
  followers_count: number;
  following_count: number;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

// API response types
export interface ZerionPortfolioResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      total: {
        positions: number;
      };
      changes: {
        absolute_1d: number;
        percent_1d: number;
      };
      positions_distribution_by_type: Record<string, number>;
      positions_distribution_by_chain: Record<string, number>;
    };
  };
}

export interface ZerionTransactionResponse {
  data: Array<{
    id: string;
    type: string;
    attributes: {
      hash: string;
      type: string;
      from_address: string;
      to_address: string;
      value: number;
      value_usd: number;
      timestamp: string;
      block_number: number;
      gas_used: number;
      gas_price: number;
      status: string;
      metadata?: any;
    };
  }>;
  links: {
    next?: string;
    prev?: string;
  };
}

export interface ZerionChartResponse {
  data: Array<{
    id: string;
    type: string;
    attributes: {
      timestamp: string;
      value: number;
      change_24h: number;
    };
  }>;
}

// Component props types
export interface ProfileCardProps {
  wallet: Wallet;
  stats: WalletStats;
  isFollowing?: boolean;
  onFollow?: (address: string) => void;
  onUnfollow?: (address: string) => void;
  showActions?: boolean;
}

export interface TransactionFeedProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface PerformanceChartProps {
  data: ChartDataPoint[];
  height?: number;
  showTooltip?: boolean;
}

export interface WalletStatsProps {
  stats: WalletStats;
  isLoading?: boolean;
}

// API error types
export class ApiError extends Error {
  code: string;
  details?: any;

  constructor({ message, code, details }: { message: string; code: string; details?: any }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

// Store types
export interface AppState {
  user: User | null;
  connectedWallet: string | null;
  following: string[];
  isLoading: boolean;
  error: string | null;
}

export interface AppActions {
  setUser: (user: User | null) => void;
  setConnectedWallet: (address: string | null) => void;
  addFollowing: (address: string) => void;
  removeFollowing: (address: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
