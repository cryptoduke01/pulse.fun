'use client';

import { Navigation } from '../../src/components/Navigation';
import { ProfileCard } from '../../src/components/ProfileCard';
import { TransactionFeed } from '../../src/components/TransactionFeed';
import { PerformanceChart } from '../../src/components/PerformanceChart';
import { WalletStats } from '../../src/components/WalletStats';
import { ActivityFeed } from '../../src/components/ActivityFeed';
import { TradingSignals } from '../../src/components/TradingSignals';
import { PageLoading } from '../../src/components/Loading';
import { useWalletData } from '../../src/hooks/useWalletData';
import { useConnectedWallet, useFollowing } from '../../src/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState as useReactState } from 'react';
import { AlertTriangle, Users, Search } from 'lucide-react';
import { RecommendationsModal } from '../../src/components/RecommendationsModal';

export default function FeedPage() {
  const connectedWallet = useConnectedWallet();
  const following = useFollowing();
  const router = useRouter();
  const [openGuide, setOpenGuide] = useReactState(false);

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
    return <PageLoading message="Loading your feed..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <AlertTriangle className="w-12 h-12 text-yellow-400" />
              </div>
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

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile card removed on feed to keep it concise */}

              {/* Performance Chart (compact) */}
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Portfolio Performance</h3>
                       {portfolio?.data && portfolio.data.chart_data && portfolio.data.chart_data.length > 0 ? (
                         <PerformanceChart data={portfolio.data.chart_data} height={180} isLoading={portfolio.isLoading} />
                       ) : (
                  <div className="flex items-center justify-center bg-background/50 rounded-lg h-[180px]">
                    <div className="text-center">
                      <div className="text-text-secondary">Chart data will be available soon</div>
                      <div className="text-text-secondary text-sm mt-1">Portfolio tracking in development</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Feed */}
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Live Activity</h3>
                <ActivityFeed walletAddress={connectedWallet} />
              </div>

              {/* Following Section */}
              {following.length > 0 ? (
                <div className="bg-surface border border-border rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Following Activity</h3>
                  <div className="text-center py-8">
                    <p className="text-text-secondary">
                      Activity from wallets you follow will appear here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Start Following</h3>
                  <div className="text-center py-8">
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
              {/* Trading Signals */}
              <TradingSignals />

              {/* Wallet Stats */}
                       {stats?.data && (
                         <WalletStats stats={stats.data} isLoading={stats.isLoading} />
                       )}

              {/* Following List */}
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Following</h3>
                {following.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-text-secondary text-sm mb-3">
                      You're not following any wallets yet
                    </p>
                    <a
                      href="/discover"
                      className="text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                    >
                      Discover wallets to follow &rarr;
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
              <div className="bg-surface border border-border rounded-xl p-4">
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
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Trading Guide</h3>
                <button onClick={() => setOpenGuide(true)} className="bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg font-medium w-full">
                  Open recommendations
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <RecommendationsModal open={openGuide} onClose={() => setOpenGuide(false)} />
    </div>
  );
}
