'use client';

import { Navigation } from '../../src/components/Navigation';
import { ProfileCard } from '../../src/components/ProfileCard';
import { useConnectedWallet, useFollowing } from '../../src/store/useStore';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
// Using text icons instead of lucide-react

// Enhanced mock data for trending wallets
const mockWallets = [
  {
    id: '1',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    ensName: 'vitalik.eth',
    total_value: 1250000,
    value_change_24h: 5.2,
    total_trades: 1247,
    active_days: 89,
    trading_style: {
      type: 'degen' as const,
      score: 87,
      confidence: 92,
      traits: ['High frequency trading', 'Short-term holds', 'High risk tolerance'],
    },
    performance: {
      total_trades: 1247,
      win_rate: 68.5,
      average_hold_time: 2.3,
      profit_factor: 1.8,
      sharpe_ratio: 1.2,
      max_drawdown: -15.2,
      best_trade: 12000,
      worst_trade: -5000,
      risk_score: 75,
    },
  },
  {
    id: '2',
    address: '0x1234567890123456789012345678901234567890',
    ensName: 'cryptowhale.eth',
    total_value: 2500000,
    value_change_24h: -2.1,
    total_trades: 89,
    active_days: 156,
    trading_style: {
      type: 'holder' as const,
      score: 95,
      confidence: 88,
      traits: ['Long-term holding', 'Conservative approach', 'Diamond hands'],
    },
    performance: {
      total_trades: 89,
      win_rate: 82.1,
      average_hold_time: 45.2,
      profit_factor: 2.3,
      sharpe_ratio: 1.8,
      max_drawdown: -8.5,
      best_trade: 50000,
      worst_trade: -1000,
      risk_score: 25,
    },
  },
  {
    id: '3',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    ensName: 'defi_master.eth',
    total_value: 850000,
    value_change_24h: 12.8,
    total_trades: 456,
    active_days: 67,
    trading_style: {
      type: 'yield_farmer' as const,
      score: 78,
      confidence: 85,
      traits: ['Yield farming', 'DeFi protocols', 'Risk management'],
    },
    performance: {
      total_trades: 456,
      win_rate: 74.2,
      average_hold_time: 8.7,
      profit_factor: 1.6,
      sharpe_ratio: 1.4,
      max_drawdown: -12.3,
      best_trade: 15000,
      worst_trade: -2000,
      risk_score: 45,
    },
  },
  {
    id: '4',
    address: '0x9876543210987654321098765432109876543210',
    ensName: 'nft_collector.eth',
    total_value: 420000,
    value_change_24h: 3.4,
    total_trades: 234,
    active_days: 45,
    trading_style: {
      type: 'nft collector' as const,
      score: 65,
      confidence: 72,
      traits: ['NFT trading', 'Art collection', 'Cultural investing'],
    },
    performance: {
      total_trades: 234,
      win_rate: 58.9,
      average_hold_time: 15.3,
      profit_factor: 1.2,
      sharpe_ratio: 0.8,
      max_drawdown: -25.1,
      best_trade: 8000,
      worst_trade: -3000,
      risk_score: 60,
    },
  },
  {
    id: '5',
    address: '0x5555555555555555555555555555555555555555',
    ensName: 'day_trader.eth',
    total_value: 180000,
    value_change_24h: 8.7,
    total_trades: 2100,
    active_days: 120,
    trading_style: {
      type: 'day trader' as const,
      score: 92,
      confidence: 95,
      traits: ['Day trading', 'Technical analysis', 'Quick decisions'],
    },
    performance: {
      total_trades: 2100,
      win_rate: 55.2,
      average_hold_time: 0.8,
      profit_factor: 1.1,
      sharpe_ratio: 0.9,
      max_drawdown: -18.7,
      risk_score: 85,
    },
  },
];

type FilterType = 'all' | 'degen' | 'holder' | 'yield farmer' | 'nft collector' | 'day trader';
type SortType = 'trending' | 'value' | 'trades' | 'performance';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const connectedWallet = useConnectedWallet();
  const following = useFollowing();

  // Filter and sort wallets
  const filteredWallets = useMemo(() => {
    let filtered = mockWallets;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(wallet => 
        wallet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.ensName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Trading style filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(wallet => wallet.trading_style.type === selectedFilter);
    }

    // Sort
    switch (sortBy) {
      case 'value':
        filtered.sort((a, b) => b.total_value - a.total_value);
        break;
      case 'trades':
        filtered.sort((a, b) => b.total_trades - a.total_trades);
        break;
      case 'performance':
        filtered.sort((a, b) => b.performance.sharpe_ratio - a.performance.sharpe_ratio);
        break;
      case 'trending':
      default:
        // Sort by combination of factors for trending
        filtered.sort((a, b) => {
          const scoreA = (a.total_value / 1000000) + (a.value_change_24h / 10) + (a.trading_style.score / 100);
          const scoreB = (b.total_value / 1000000) + (b.value_change_24h / 10) + (b.trading_style.score / 100);
          return scoreB - scoreA;
        });
        break;
    }

    return filtered;
  }, [searchQuery, selectedFilter, sortBy]);

  const tradingStyleFilters = [
    { value: 'all', label: 'All Styles', icon: '👥' },
    { value: 'degen', label: 'Degen', icon: '⚡' },
    { value: 'holder', label: 'Holder', icon: '💎' },
    { value: 'yield farmer', label: 'Yield Farmer', icon: '🌾' },
    { value: 'nft collector', label: 'NFT Collector', icon: '🖼️' },
    { value: 'day trader', label: 'Day Trader', icon: '📈' },
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'value', label: 'Portfolio Value' },
    { value: 'trades', label: 'Total Trades' },
    { value: 'performance', label: 'Performance' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="h-8 bg-surface rounded w-1/3 mb-2 animate-pulse"></div>
              <div className="h-4 bg-surface rounded w-1/2 animate-pulse"></div>
            </div>
            
            {/* Search and Filters Loading */}
            <div className="bg-surface border border-border rounded-xl p-6 mb-8 animate-pulse">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 h-12 bg-background/50 rounded"></div>
                <div className="h-12 bg-background/50 rounded w-32"></div>
                <div className="h-12 bg-background/50 rounded w-40"></div>
              </div>
            </div>

            {/* Wallet Grid Loading */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-background/50 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-background/50 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-background/50 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="h-16 bg-background/50 rounded"></div>
                    <div className="h-16 bg-background/50 rounded"></div>
                    <div className="h-16 bg-background/50 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Discover Wallets</h1>
            <p className="text-text-secondary">
              Find and follow the most interesting wallets in crypto
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-lg">🔍</span>
                <input
                  type="text"
                  placeholder="Search by address or ENS name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-background border border-border rounded-lg text-text-primary hover:border-accent/50 transition-colors"
              >
                <span className="text-lg">🔧</span>
                Filters
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-border"
              >
                <h3 className="text-lg font-semibold text-text-primary mb-4">Trading Styles</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {tradingStyleFilters.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <button
                        key={filter.value}
                        onClick={() => setSelectedFilter(filter.value as FilterType)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                          selectedFilter === filter.value
                            ? 'bg-accent text-white'
                            : 'bg-background border border-border text-text-primary hover:border-accent/50'
                        }`}
                      >
                        <span className="text-lg">{filter.icon}</span>
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-text-primary">
                {filteredWallets.length} Wallets Found
              </h2>
              {searchQuery && (
                <span className="text-text-secondary">
                  for "{searchQuery}"
                </span>
              )}
            </div>
            <div className="text-text-secondary text-sm">
              {selectedFilter !== 'all' && `Filtered by ${selectedFilter}`}
            </div>
          </div>

          {/* Wallet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWallets.map((wallet, index) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProfileCard
                  wallet={{
                    id: wallet.id,
                    address: wallet.address,
                    ensName: wallet.ensName,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  stats={{
                    total_value: wallet.total_value,
                    value_change_24h: wallet.value_change_24h,
                    total_trades: wallet.total_trades,
                    active_days: wallet.active_days,
                    win_rate: wallet.performance.win_rate,
                    avg_hold_time: wallet.performance.average_hold_time,
                    trading_style: wallet.trading_style,
                    confidence: wallet.trading_style.confidence,
                    performance: wallet.performance,
                  }}
                  isFollowing={following.includes(wallet.address)}
                  showActions={true}
                />
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredWallets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">No wallets found</h3>
              <p className="text-text-secondary mb-6">
                Try adjusting your search or filters to find more wallets
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Trending Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Trending This Week</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockWallets.slice(0, 3).map((wallet, index) => (
                <motion.div
                  key={`trending-${wallet.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {wallet.address.slice(2, 4).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-text-primary font-semibold">
                        {wallet.ensName || `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                      </div>
                      <div className="text-text-secondary text-sm">
                        #{index + 1} Trending
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Portfolio Value</span>
                      <span className="text-text-primary font-medium">
                        ${(wallet.total_value / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">24h Change</span>
                      <span className={`font-medium ${wallet.value_change_24h >= 0 ? 'text-success' : 'text-danger'}`}>
                        {wallet.value_change_24h >= 0 ? '+' : ''}{wallet.value_change_24h.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Trading Style</span>
                      <span className="text-accent font-medium capitalize">
                        {wallet.trading_style.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/profile/${wallet.address}`}
                    className="block mt-4 w-full bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg font-medium transition-colors text-center"
                  >
                    View Profile
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}