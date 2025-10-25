import { Transaction, Position, TradingStyle, PerformanceMetrics, WalletStats } from '../types';

export function analyzeTradingStyle(transactions: Transaction[]): TradingStyle {
  if (transactions.length === 0) {
    return {
      type: 'holder',
      score: 0,
      confidence: 0,
      traits: ['No trading activity'],
    };
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentTransactions = transactions.filter(tx => tx.timestamp && tx.timestamp > thirtyDaysAgo);

  // Calculate metrics
  const totalTrades = transactions.length;
  const recentTrades = recentTransactions.length;
  const swapTransactions = transactions.filter(tx => tx.type === 'swap');
  const transferTransactions = transactions.filter(tx => tx.type === 'transfer');
  
  // Calculate average hold time
  const holdTimes: number[] = [];
  for (let i = 0; i < transactions.length - 1; i++) {
    const current = transactions[i];
    const next = transactions[i + 1];
    if (current.type === 'swap' && next.type === 'swap') {
      const holdTime = next.timestamp && current.timestamp 
        ? (next.timestamp.getTime() - current.timestamp.getTime()) / (1000 * 60 * 60 * 24)
        : 0;
      holdTimes.push(holdTime);
    }
  }
  const avgHoldTime = holdTimes.length > 0 ? holdTimes.reduce((a, b) => a + b, 0) / holdTimes.length : 0;

  // Calculate trading frequency (trades per day)
  // Handle null timestamps - use a default 30 days if no valid timestamps
  const lastTransaction = transactions[transactions.length - 1];
  const lastTimestamp = lastTransaction?.timestamp;
  const daysActive = lastTimestamp 
    ? Math.max(1, (now.getTime() - lastTimestamp.getTime()) / (1000 * 60 * 60 * 24))
    : 30; // Default to 30 days if no timestamp
  const tradingFrequency = totalTrades / daysActive;

  // Calculate risk score based on transaction patterns
  const riskScore = calculateRiskScore(transactions);

  // Determine trading style
  let style: TradingStyle['type'] = 'holder';
  let score = 0;
  let confidence = 0;
  const traits: string[] = [];

  // Degen trader: High frequency, short holds, high risk
  if (tradingFrequency > 5 && avgHoldTime < 1 && riskScore > 70) {
    style = 'degen';
    score = Math.min(100, (tradingFrequency * 10) + (riskScore * 0.3));
    confidence = Math.min(100, recentTrades * 2);
    traits.push('High frequency trading', 'Short-term holds', 'High risk tolerance');
  }
  // Day trader: Medium-high frequency, short holds
  else if (tradingFrequency > 2 && avgHoldTime < 7) {
    style = 'day_trader';
    score = Math.min(100, tradingFrequency * 8);
    confidence = Math.min(100, recentTrades * 1.5);
    traits.push('Daily trading activity', 'Short-term positions');
  }
  // Yield farmer: Many approvals, long holds, DeFi focus
  else if (transferTransactions.length > swapTransactions.length && avgHoldTime > 30) {
    style = 'yield_farmer';
    score = Math.min(100, (avgHoldTime / 10) + (transferTransactions.length * 2));
    confidence = Math.min(100, avgHoldTime);
    traits.push('Long-term holds', 'DeFi participation', 'Yield optimization');
  }
  // NFT collector: Many transfers, medium frequency
  else if (transferTransactions.length > swapTransactions.length * 2) {
    style = 'nft_collector';
    score = Math.min(100, transferTransactions.length * 3);
    confidence = Math.min(100, transferTransactions.length);
    traits.push('NFT transactions', 'Collection activity');
  }
  // Arbitrageur: Many swaps, short holds, low risk
  else if (swapTransactions.length > transferTransactions.length && avgHoldTime < 3 && riskScore < 40) {
    style = 'arbitrageur';
    score = Math.min(100, swapTransactions.length * 4);
    confidence = Math.min(100, swapTransactions.length * 1.2);
    traits.push('Arbitrage opportunities', 'Low risk', 'Efficient trading');
  }
  // Holder: Low frequency, long holds
  else {
    style = 'holder';
    score = Math.min(100, avgHoldTime * 2);
    confidence = Math.min(100, avgHoldTime / 5);
    traits.push('Long-term holding', 'Low activity', 'Conservative approach');
  }

  return {
    type: style,
    score: Math.round(score),
    confidence: Math.round(confidence),
    traits,
  };
}

function calculateRiskScore(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;

  let riskScore = 0;
  let factors = 0;

  // Factor 1: Transaction frequency
  const firstTransaction = transactions[0];
  const firstTimestamp = firstTransaction?.timestamp;
  const daysActive = firstTimestamp 
    ? (Date.now() - firstTimestamp.getTime()) / (1000 * 60 * 60 * 24)
    : 30; // Default to 30 days if no timestamp
  const frequency = transactions.length / Math.max(1, daysActive);
  riskScore += Math.min(30, frequency * 5);
  factors++;

  // Factor 2: Gas usage (higher gas = more urgent/risky trades)
  const gasValues = transactions.map(tx => tx.gas_used).filter(gas => gas && gas > 0);
  if (gasValues.length > 0) {
    const avgGasUsed = gasValues.reduce((sum, gas) => sum + gas, 0) / gasValues.length;
    riskScore += Math.min(20, avgGasUsed / 100000);
    factors++;
  }

  // Factor 3: Transaction value volatility
  const values = transactions.map(tx => tx.value_usd).filter(v => v > 0);
  if (values.length > 1) {
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avgValue, 2), 0) / values.length;
    const volatility = Math.sqrt(variance) / avgValue;
    riskScore += Math.min(25, volatility * 100);
    factors++;
  }

  // Factor 4: Failed transactions (indicates risky behavior)
  const failedTxs = transactions.filter(tx => tx.status === 'failed').length;
  riskScore += Math.min(25, (failedTxs / transactions.length) * 100);
  factors++;

  return factors > 0 ? Math.round(riskScore / factors) : 0;
}

export function calculatePerformanceMetrics(
  portfolio: { total_value: number; total_value_change_24h: number },
  transactions: Transaction[]
): PerformanceMetrics {
  if (transactions.length === 0) {
    return {
      total_trades: 0,
      win_rate: 0,
      average_hold_time: 0,
      profit_factor: 0,
      sharpe_ratio: 0,
      max_drawdown: 0,
      best_trade: 0,
      worst_trade: 0,
      risk_score: 0,
    };
  }

  const totalTrades = transactions.length;
  
  // Calculate win rate (simplified - positive value changes)
  const profitableTrades = transactions.filter(tx => tx.value_usd > 0).length;
  const winRate = (profitableTrades / totalTrades) * 100;

  // Calculate average hold time
  const holdTimes: number[] = [];
  for (let i = 0; i < transactions.length - 1; i++) {
    const current = transactions[i];
    const next = transactions[i + 1];
    if (current.type === 'swap' && next.type === 'swap') {
      const holdTime = next.timestamp && current.timestamp 
        ? (next.timestamp.getTime() - current.timestamp.getTime()) / (1000 * 60 * 60 * 24)
        : 0;
      holdTimes.push(holdTime);
    }
  }
  const avgHoldTime = holdTimes.length > 0 ? holdTimes.reduce((a, b) => a + b, 0) / holdTimes.length : 0;

  // Calculate profit factor (simplified)
  const totalProfit = transactions.filter(tx => tx.value_usd > 0).reduce((sum, tx) => sum + tx.value_usd, 0);
  const totalLoss = Math.abs(transactions.filter(tx => tx.value_usd < 0).reduce((sum, tx) => sum + tx.value_usd, 0));
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 10 : 0;

  // Calculate Sharpe ratio (simplified)
  const returns = transactions.map(tx => tx.value_usd).filter(r => r !== 0);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  const sharpeRatio = variance > 0 ? avgReturn / Math.sqrt(variance) : 0;

  // Calculate max drawdown (simplified)
  let maxDrawdown = 0;
  let peak = 0;
  let currentValue = 0;
  
  for (const tx of transactions) {
    currentValue += tx.value_usd;
    if (currentValue > peak) {
      peak = currentValue;
    }
    const drawdown = (peak - currentValue) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  // Best and worst trades
  const tradeValues = transactions.map(tx => tx.value_usd);
  const bestTrade = Math.max(...tradeValues);
  const worstTrade = Math.min(...tradeValues);

  // Risk score
  const riskScore = calculateRiskScore(transactions);

  return {
    total_trades: totalTrades,
    win_rate: Math.round(winRate * 100) / 100,
    average_hold_time: Math.round(avgHoldTime * 100) / 100,
    profit_factor: Math.round(profitFactor * 100) / 100,
    sharpe_ratio: Math.round(sharpeRatio * 100) / 100,
    max_drawdown: Math.round(maxDrawdown * 100) / 100,
    best_trade: Math.round(bestTrade * 100) / 100,
    worst_trade: Math.round(worstTrade * 100) / 100,
    risk_score: riskScore,
  };
}

export function getTopTokens(positions: Position[], limit: number = 5): Position[] {
  return positions
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function calculateWalletStats(
  portfolio: { total_value: number; total_value_change_24h: number },
  transactions: Transaction[],
  tradingStyle: TradingStyle
): WalletStats {
  const performance = calculatePerformanceMetrics(portfolio, transactions);
  
  // Calculate additional metrics
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentTransactions = transactions.filter(tx => tx.timestamp && tx.timestamp > thirtyDaysAgo);
  
  // Calculate active days
  const uniqueDays = new Set(
    transactions.map(tx => tx.timestamp ? tx.timestamp.toDateString() : 'Unknown date')
  ).size;
  
  // Get top holding
  const topHolding = transactions.length > 0 ? {
    id: 'unknown',
    name: 'Unknown',
    symbol: 'UNK',
    price: 0,
    price_change_24h: 0,
  } : {
    id: 'unknown',
    name: 'No holdings',
    symbol: 'N/A',
    price: 0,
    price_change_24h: 0,
  };

  return {
    total_value: portfolio.total_value,
    value_change_24h: portfolio.total_value_change_24h,
    value_change_7d: 0, // Would need historical data
    value_change_30d: 0, // Would need historical data
    total_trades: performance.total_trades,
    active_days: uniqueDays,
    top_holding: topHolding,
    trading_style: tradingStyle,
    performance,
  };
}

export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + 'B';
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M';
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + 'K';
  }
  return value.toFixed(2);
}

export function getTradingStyleColor(style: TradingStyle['type']): string {
  const colors = {
    degen: '#ef4444', // red
    holder: '#10b981', // green
    yield_farmer: '#3b82f6', // blue
    nft_collector: '#8b5cf6', // purple
    day_trader: '#f59e0b', // orange
    arbitrageur: '#06b6d4', // cyan
  };
  return colors[style] || '#6b7280';
}

export function getTradingStyleEmoji(style: TradingStyle['type']): string {
  const emojis = {
    degen: '🚀',
    holder: '💎',
    yield_farmer: '🌾',
    nft_collector: '🎨',
    day_trader: '📈',
    arbitrageur: '⚡',
  };
  return emojis[style] || '📊';
}
