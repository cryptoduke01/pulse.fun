'use client';

import { WalletStatsProps } from '../types';
import { formatCurrency, formatPercentage, formatNumber } from '../lib/analysis';
import { getTradingStyleColor } from '../lib/analysis';
import { Wallet as WalletIcon, LineChart, Repeat, Calendar, Target, Timer, AlertTriangle, BarChart3 } from 'lucide-react';

export function WalletStats({ stats, isLoading = false }: WalletStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-background/50 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-background/50 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Portfolio Value',
      value: formatCurrency(stats.total_value),
      change: stats.value_change_24h,
      Icon: WalletIcon,
    },
    {
      label: '24h Change',
      value: formatPercentage(stats.value_change_24h),
      change: stats.value_change_24h,
      Icon: LineChart,
    },
    {
      label: 'Total Trades',
      value: formatNumber(stats.total_trades),
      change: null,
      Icon: Repeat,
    },
    {
      label: 'Active Days',
      value: stats.active_days.toString(),
      change: null,
      Icon: Calendar,
    },
    {
      label: 'Win Rate',
      value: `${stats.performance.win_rate.toFixed(1)}%`,
      change: stats.performance.win_rate - 50, // vs 50% baseline
      Icon: Target,
    },
    {
      label: 'Avg Hold Time',
      value: `${stats.performance.average_hold_time.toFixed(1)}d`,
      change: null,
      Icon: Timer,
    },
    {
      label: 'Risk Score',
      value: `${stats.performance.risk_score}/100`,
      change: null,
      Icon: AlertTriangle,
    },
    {
      label: 'Profit Factor',
      value: stats.performance.profit_factor.toFixed(2),
      change: stats.performance.profit_factor - 1, // vs 1.0 baseline
      Icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Trading Style Badge */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <BarChart3 className="w-5 h-5 text-accent" />
          <div>
            <div className="text-text-primary font-semibold capitalize">
              {stats.trading_style.type.replace('_', ' ')} Trader
            </div>
            <div className="text-text-secondary text-sm">
              {stats.trading_style.confidence}% confidence
            </div>
          </div>
          <div 
            className="ml-auto px-3 py-1 rounded-full text-sm font-medium"
            style={{ 
              backgroundColor: getTradingStyleColor(stats.trading_style.type) + '20',
              color: getTradingStyleColor(stats.trading_style.type)
            }}
          >
            {stats.trading_style.score}%
          </div>
        </div>
        
        {stats.trading_style.traits.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stats.trading_style.traits.map((trait, index) => (
              <span
                key={index}
                className="text-xs bg-background/50 text-text-secondary px-2 py-1 rounded-full"
              >
                {trait}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-surface border border-border rounded-lg p-4 hover:border-accent/50 transition-all duration-200">
            <div className="flex items-center gap-2 mb-3">
              <stat.Icon className="w-4 h-4 text-text-secondary" />
              <span className="text-text-secondary text-sm font-medium">{stat.label}</span>
            </div>
            <div className="text-text-primary text-xl font-semibold mb-2 break-all">
              {stat.value}
            </div>
            {stat.change !== null && (
              <div className={`text-sm font-medium break-all ${
                stat.change >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)}
                {stat.label.includes('Change') || stat.label.includes('Rate') ? '%' : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-text-primary font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Best Trade</span>
              <span className="text-success font-medium">
                {formatCurrency(stats.performance.best_trade)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Worst Trade</span>
              <span className="text-danger font-medium">
                {formatCurrency(stats.performance.worst_trade)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Max Drawdown</span>
              <span className="text-text-primary font-medium">
                {formatPercentage(stats.performance.max_drawdown * 100)}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Sharpe Ratio</span>
              <span className="text-text-primary font-medium">
                {stats.performance.sharpe_ratio.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Profit Factor</span>
              <span className={`font-medium ${
                stats.performance.profit_factor > 1 ? 'text-success' : 'text-danger'
              }`}>
                {stats.performance.profit_factor.toFixed(2)}x
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Risk Level</span>
              <span className={`font-medium ${
                stats.performance.risk_score > 70 ? 'text-danger' :
                stats.performance.risk_score > 40 ? 'text-yellow-400' : 'text-success'
              }`}>
                {stats.performance.risk_score > 70 ? 'High' :
                 stats.performance.risk_score > 40 ? 'Medium' : 'Low'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
