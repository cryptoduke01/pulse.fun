'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFollowing } from '../store/useStore';
import { TrendingUp, TrendingDown, RefreshCw, Eye, EyeOff, Clock, ExternalLink, User, BarChart3 } from 'lucide-react';

interface TradingSignal {
  id: string;
  walletAddress: string;
  walletName: string;
  action: 'buy' | 'sell' | 'swap';
  token: string;
  amount: string;
  valueUsd: number;
  timestamp: Date;
  txHash: string;
}

interface TradingSignalsProps {
  className?: string;
}

export function TradingSignals({ className = '' }: TradingSignalsProps) {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignals, setShowSignals] = useState(true);
  const following = useFollowing();

  // Fetch trading signals for followed wallets
  const fetchTradingSignals = async () => {
    if (following.length === 0) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/trading-signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddresses: following })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSignals(data.signals || []);
      }
    } catch (error) {
      console.error('Failed to fetch trading signals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch signals on mount and when following changes
  useEffect(() => {
    fetchTradingSignals();
    
    // Set up polling for new signals every 30 seconds
    const interval = setInterval(fetchTradingSignals, 30000);
    return () => clearInterval(interval);
  }, [following]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy': return <TrendingUp className="w-3 h-3" />;
      case 'sell': return <TrendingDown className="w-3 h-3" />;
      case 'swap': return <RefreshCw className="w-3 h-3" />;
      default: return <TrendingUp className="w-3 h-3" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-green-400';
      case 'sell': return 'text-red-400';
      case 'swap': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (following.length === 0) {
    return (
      <div className={`bg-surface border border-border rounded-xl p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Trading Signals</h3>
        <div className="text-center py-8">
          <User className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
          <p className="text-text-secondary mb-3">Follow wallets to get trading signals</p>
          <a
            href="/discover"
            className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
          >
            Discover wallets to follow &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-border rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Trading Signals</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSignals(!showSignals)}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            {showSignals ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={fetchTradingSignals}
            disabled={isLoading}
            className="text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
          >
            {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSignals && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-background/50 rounded-lg p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-background/50 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-background/50 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-background/50 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : signals.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
                <p className="text-text-secondary">No recent trading activity</p>
                <p className="text-text-secondary text-sm mt-1">Signals will appear here when followed wallets trade</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {signals.map((signal) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-background/50 border border-border rounded-lg p-4 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-text-primary font-medium text-sm">
                            {signal.walletName || `${signal.walletAddress.slice(0, 6)}...${signal.walletAddress.slice(-4)}`}
                          </span>
                          <span className={`text-xs font-medium ${getActionColor(signal.action)}`}>
                            {getActionIcon(signal.action)} {signal.action.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-text-secondary text-sm">
                          {signal.action === 'swap' ? 'Swapped' : signal.action === 'buy' ? 'Bought' : 'Sold'} {signal.amount} {signal.token}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-text-primary font-medium text-sm">
                            ${signal.valueUsd.toLocaleString()}
                          </span>
                          <span className="text-text-secondary text-xs">
                            {formatTimeAgo(signal.timestamp)}
                          </span>
                        </div>
                        <a
                          href={`https://etherscan.io/tx/${signal.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 text-xs font-medium transition-colors mt-1 block flex items-center gap-1"
                        >
                          View on Etherscan <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
