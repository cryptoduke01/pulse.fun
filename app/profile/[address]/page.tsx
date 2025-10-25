'use client';

import { Navigation } from '../../../src/components/Navigation';
import { ProfileCard } from '../../../src/components/ProfileCard';
import { TransactionFeed } from '../../../src/components/TransactionFeed';
import { PerformanceChart } from '../../../src/components/PerformanceChart';
import { WalletStats } from '../../../src/components/WalletStats';
import { useWalletData } from '../../../src/hooks/useWalletData';
import { useConnectedWallet } from '../../../src/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';

export default function ProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const [address, setAddress] = useState<string>('');
  const connectedWallet = useConnectedWallet();
  const router = useRouter();

  useEffect(() => {
    params.then(({ address }) => {
      setAddress(address);
    });
  }, [params]);

  const { portfolio, transactions, stats, isLoading, error } = useWalletData(address);
  const isCurrentUser = connectedWallet?.toLowerCase() === address?.toLowerCase();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-surface rounded w-1/3 mb-8"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-surface rounded-xl"></div>
                  <div className="h-32 bg-surface rounded-xl"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-48 bg-surface rounded-xl"></div>
                  <div className="h-32 bg-surface rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">Error Loading Profile</h2>
              <p className="text-text-secondary mb-8">
                Unable to load wallet data. The address might be invalid or the wallet might not exist.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Retry
              </button>
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
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-3xl font-bold text-text-primary">
                {isCurrentUser ? 'Your Profile' : 'Wallet Profile'}
              </h1>
            </div>
            <p className="text-text-secondary">
              {isCurrentUser 
                ? 'Your trading activity and performance' 
                : `Viewing wallet ${address.slice(0, 6)}...${address.slice(-4)}`
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Card */}
              {stats?.data && (
                <ProfileCard
                  wallet={{
                    id: address,
                    address: address,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  stats={stats.data}
                  showActions={!isCurrentUser}
                  isCurrentUser={isCurrentUser}
                />
              )}

              {/* Performance Chart */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Portfolio Performance</h3>
                {portfolio?.data && portfolio.data.chart_data && portfolio.data.chart_data.length > 0 ? (
                  <PerformanceChart data={portfolio.data.chart_data} height={300} />
                ) : (
                  <div className="flex items-center justify-center bg-background/50 rounded-lg h-[300px]">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <div className="text-text-secondary">Chart data will be available soon</div>
                      <div className="text-text-secondary text-sm mt-1">Portfolio tracking in development</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transaction Feed */}
              {transactions && (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Transactions</h3>
                  <TransactionFeed
                    transactions={transactions.data?.pages?.flatMap(page => page.data) || []}
                    isLoading={transactions.isLoading}
                    isFetchingNextPage={transactions.isFetchingNextPage}
                    hasNextPage={transactions.hasNextPage}
                    onLoadMore={transactions.fetchNextPage}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Wallet Stats */}
              {stats?.data && (
                <WalletStats
                  totalValue={portfolio?.data?.total_value || 0}
                  totalValueChange24h={portfolio?.data?.total_value_change_24h || 0}
                  totalTrades={stats.data.total_trades}
                  activeDays={stats.data.active_days}
                  winRate={stats.data.win_rate}
                  avgHoldTime={stats.data.avg_hold_time}
                  tradingStyle={stats.data.trading_style}
                  confidence={stats.data.confidence}
                />
              )}

              {/* Quick Actions */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                    Share Profile
                  </button>
                  {!isCurrentUser && (
                    <button className="w-full border border-border text-text-primary px-4 py-2 rounded-lg font-medium hover:bg-surface transition-colors">
                      Follow Wallet
                    </button>
                  )}
                </div>
              </div>

              {/* Trading Tips */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Trading Tips</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Diversify your portfolio across different assets</li>
                  <li>• Set stop-losses to manage risk</li>
                  <li>• Keep track of your trading performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}