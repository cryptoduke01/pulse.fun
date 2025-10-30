'use client';

import { Navigation } from '../../src/components/Navigation';
import { ProfileCard } from '../../src/components/ProfileCard';
import { PageLoading } from '../../src/components/Loading';
import { useConnectedWallet, useFollowing } from '../../src/store/useStore';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Removed mock wallets. Live data is fetched from /api/trending

type FilterType = 'all' | 'degen' | 'holder' | 'yield farmer' | 'nft collector' | 'day trader';
type SortType = 'trending' | 'value' | 'trades' | 'performance';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true); // Add loading state for trending
  const [realWallets, setRealWallets] = useState<any[]>([]);
  const [trendingWallets, setTrendingWallets] = useState<any[]>([]);
  const [trendingPagination, setTrendingPagination] = useState({
    offset: 0,
    limit: 10,
    total: 0,
    hasMore: false
  });
  
  const connectedWallet = useConnectedWallet();
  const following = useFollowing();

  // Fetch trending wallets on component mount
  useEffect(() => {
    fetchTrendingWallets();
  }, []);

  const fetchTrendingWallets = async (loadMore = false) => {
    if (loadMore) {
      setIsLoading(true);
    } else {
      setIsLoadingTrending(true);
    }
    
    try {
      const offset = loadMore ? trendingPagination.offset + trendingPagination.limit : 0;
      const response = await fetch(`/api/trending?limit=10&offset=${offset}`);
      if (response.ok) {
        const data = await response.json();
        if (loadMore) {
          setTrendingWallets(prev => [...prev, ...data.wallets]);
        } else {
          setTrendingWallets(data.wallets || []);
        }
        setTrendingPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch trending wallets:', error);
    } finally {
      setIsLoadingTrending(false);
      setIsLoading(false);
    }
  };

  // Function to fetch real wallet data
  const fetchRealWalletData = async (address: string) => {
    if (!address || address.length < 42) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/portfolio/${address}`);
      if (response.ok) {
        const data = await response.json();
        // Create a wallet object from the real data
        const realWallet = {
          id: address,
          address: address,
          ensName: null,
          total_value: data.total_value || 0,
          value_change_24h: data.total_value_change_24h || 0,
          total_trades: 0, // Will be fetched from transactions
          active_days: 0,
          trading_style: {
            type: 'unknown' as const,
            score: 0,
            confidence: 0,
            traits: ['Real wallet data'],
          },
          performance: {
            total_trades: 0,
            win_rate: 0,
            average_hold_time: 0,
            profit_factor: 0,
            sharpe_ratio: 0,
            max_drawdown: 0,
            best_trade: 0,
            worst_trade: 0,
            risk_score: 0,
          },
        };
        setRealWallets([realWallet]);
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort wallets
  const filteredWallets = useMemo(() => {
    // Only show trending wallets when they're loaded, don't fall back to mock data
    let filtered = trendingWallets;
    
    // If user is searching, use realWallets if available, otherwise use trending wallets
    if (searchQuery) {
      filtered = realWallets.length > 0 ? realWallets : trendingWallets;
    }

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
  }, [searchQuery, selectedFilter, sortBy, realWallets, trendingWallets]);

  // Handle search with real data fetch
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && query.length >= 42) {
      fetchRealWalletData(query);
    } else {
      setRealWallets([]);
    }
  };

  const tradingStyleFilters = [
    { value: 'all', label: 'All Styles', icon: 'users' },
    { value: 'degen', label: 'Degen', icon: 'zap' },
    { value: 'holder', label: 'Holder', icon: 'diamond' },
    { value: 'yield farmer', label: 'Yield Farmer', icon: 'sprout' },
    { value: 'nft collector', label: 'NFT Collector', icon: 'image' },
    { value: 'day trader', label: 'Day Trader', icon: 'line-chart' },
  ];

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'value', label: 'Portfolio Value' },
    { value: 'trades', label: 'Total Trades' },
    { value: 'performance', label: 'Performance' },
  ];

         if (isLoading || isLoadingTrending) {
    return <PageLoading message="Loading trending wallets..." />;
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
              <div className="flex-1">
                <input
                  type="text"
                  aria-label="Search by address or ENS"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-background border border-border rounded-lg text-text-primary hover:border-accent/50 transition-colors"
              >
              <span className="text-lg"> </span>
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
                    value_change_7d: 0,
                    value_change_30d: 0,
                    total_trades: wallet.total_trades,
                    active_days: wallet.active_days,
                    top_holding: {
                      id: 'unknown',
                      name: 'Unknown Asset',
                      symbol: 'UNK',
                      price: 0,
                      price_change_24h: 0,
                      image_url: '',
                    },
                    trading_style: wallet.trading_style,
                    performance: wallet.performance,
                  }}
                  isFollowing={following.includes(wallet.address)}
                  showActions={true}
                />
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {!searchQuery && trendingPagination.hasMore && (
            <div className="text-center pt-8">
              <button
                onClick={() => fetchTrendingWallets(true)}
                disabled={isLoading}
                className="bg-accent/10 text-accent hover:bg-accent/20 px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load More Wallets'}
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredWallets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-text-secondary text-6xl mb-4">SEARCH</div>
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
              {(trendingWallets || []).slice(0, 3).map((wallet, index) => (
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
                        {(wallet.total_value ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
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