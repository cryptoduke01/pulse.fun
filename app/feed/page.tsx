'use client';

import { Navigation } from '../../src/components/Navigation';
import { ProfileCard } from '../../src/components/ProfileCard';
import { TransactionFeed } from '../../src/components/TransactionFeed';
import { PerformanceChart } from '../../src/components/PerformanceChart';
import { WalletStats } from '../../src/components/WalletStats';
import { ActivityFeed } from '../../src/components/ActivityFeed';
import { useWalletData } from '../../src/hooks/useWalletData';
import { useConnectedWallet, useFollowing } from '../../src/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FeedPage() {
  const connectedWallet = useConnectedWallet();
  const following = useFollowing();
  const router = useRouter();

  useEffect(() => {
    if (!connectedWallet) {
      router.push('/');
    }
  }, [connectedWallet, router]);

  // Don't render wallet data hooks until we have a connected wallet
  if (!connectedWallet) {
    return null;
  }

  // Use the actual connected wallet address
  const walletAddress = connectedWallet;
  
  const { portfolio, transactions, stats, isLoading, error } = useWalletData(walletAddress);


  if (!connectedWallet) {
    return null;
  }

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
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content Loading */}
              <div className="lg:col-span-2 space-y-8">
                {/* Profile Card Loading */}
                <div className="bg-surface border border-border rounded-xl p-6 animate-pulse">
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

                {/* Chart Loading */}
                <div className="bg-surface border border-border rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-background/50 rounded w-1/4 mb-4"></div>
                  <div className="h-64 bg-background/50 rounded"></div>
                </div>

                {/* Activity Feed Loading */}
                <div className="bg-surface border border-border rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-background/50 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-16 bg-background/50 rounded"></div>
                    <div className="h-16 bg-background/50 rounded"></div>
                    <div className="h-16 bg-background/50 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Sidebar Loading */}
              <div className="space-y-8">
                <div className="bg-surface border border-border rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-background/50 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-12 bg-background/50 rounded"></div>
                    <div className="h-12 bg-background/50 rounded"></div>
                    <div className="h-12 bg-background/50 rounded"></div>
                  </div>
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
              <h2 className="text-2xl font-bold text-text-primary mb-4">Error Loading Data</h2>
              <p className="text-text-secondary mb-8">
                API request failed. This is expected until we set up live data integration.
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
            <h1 className="text-3xl font-bold text-text-primary mb-2">Your Feed</h1>
            <p className="text-text-secondary">
              Your trading activity and the wallets you follow
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Your Profile Card */}
              {stats?.data && (
                <ProfileCard
                  wallet={{
                    id: connectedWallet,
                    address: connectedWallet,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }}
                  stats={stats.data}
                  showActions={false}
                  isCurrentUser={true}
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

              {/* Activity Feed */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Live Activity</h3>
                <ActivityFeed walletAddress={connectedWallet} />
              </div>

              {/* Transaction Feed */}
              {transactions && (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Transactions</h3>
                  <TransactionFeed 
                    transactions={transactions.data?.pages.flatMap(page => page.transactions) || []}
                    isLoading={transactions.isLoading}
                    hasMore={transactions.hasNextPage}
                    onLoadMore={() => transactions.fetchNextPage()}
                  />
                </div>
              )}

              {/* Following Section */}
              {following.length > 0 ? (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Following Activity</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">👥</div>
                    <p className="text-text-secondary">
                      Activity from wallets you follow will appear here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Start Following</h3>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-text-secondary mb-4">
                      Discover and follow interesting wallets to see their activity here
                    </p>
                    <a
                      href="/discover"
                      className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors inline-block"
                    >
                      Discover Wallets
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Wallet Stats */}
              {stats?.data && (
                <WalletStats stats={stats.data} />
              )}

              {/* Following List */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Following</h3>
                {following.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-2">👥</div>
                    <p className="text-text-secondary text-sm mb-3">
                      You're not following any wallets yet
                    </p>
                    <a
                      href="/discover"
                      className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                    >
                      Discover wallets to follow →
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {following.map((address) => (
                      <a
                        key={address}
                        href={`/profile/${address}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {address.slice(2, 4).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-text-primary font-mono text-sm">
                            {address.slice(0, 6)}...{address.slice(-4)}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href="/discover"
                    className="block w-full bg-accent/10 text-accent hover:bg-accent/20 px-4 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    Discover Wallets
                  </a>
                  <a
                    href={`/profile/${connectedWallet}`}
                    className="block w-full bg-surface border border-border text-text-primary hover:border-accent/50 px-4 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    View Your Profile
                  </a>
                </div>
              </div>

              {/* Trading Tips */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Trading Tips</h3>
                <div className="space-y-3 text-sm text-text-secondary">
                  <div className="flex items-start gap-3">
                    <span className="text-accent">💡</span>
                    <span>Diversify your portfolio across different asset types</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-accent">📊</span>
                    <span>Track your performance metrics regularly</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-accent">🔍</span>
                    <span>Follow successful traders to learn new strategies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
