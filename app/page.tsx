'use client';

import Link from 'next/link';
import { Navigation } from '../src/components/Navigation';
import { WalletConnect } from '../src/components/WalletConnect';
import { motion } from 'framer-motion';

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-600/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-hero font-heading font-bold text-text-primary mb-6"
              >
                Your wallet tells your{' '}
                <span className="gradient-text">
                  story
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-body-lg text-text-secondary mb-8 max-w-3xl mx-auto"
              >
                The social network for crypto traders. Connect your wallet and let your transactions become your social content.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <WalletConnect />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/discover"
                    className="glass-button text-text-primary hover:border-accent/50 px-8 py-3 font-body font-medium transition-all duration-200"
                  >
                    Explore Wallets
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                How pulse.fun Works
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Transform your wallet activity into a living social profile
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-surface border border-border rounded-xl p-8 hover:border-accent/50 transition-all duration-200 hover:scale-105">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  Connect Your Wallet
                </h3>
                <p className="text-text-secondary">
                  Link your wallet securely and watch as your trading history automatically generates your profile.
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-8 hover:border-accent/50 transition-all duration-200 hover:scale-105">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  Auto-Generated Profile
                </h3>
                <p className="text-text-secondary">
                  Your portfolio value, trading style, and performance metrics create a unique social identity.
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-8 hover:border-accent/50 transition-all duration-200 hover:scale-105">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  Follow & Discover
                </h3>
                <p className="text-text-secondary">
                  Follow successful traders, discover new strategies, and build your crypto network.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trading Styles Section */}
        <section className="py-20 lg:py-32 bg-surface/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                Discover Your Trading Style
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Our AI analyzes your trading patterns to identify your unique style
          </p>
        </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: '⚡', name: 'Degen', desc: 'High frequency, high risk trading' },
                { emoji: '💎', name: 'Diamond Hands', desc: 'Long-term holding strategy' },
                { emoji: '🌾', name: 'Yield Farmer', desc: 'Optimizing for passive income' },
                { emoji: '🎨', name: 'NFT Collector', desc: 'Curating digital art and assets' },
                { emoji: '📈', name: 'Day Trader', desc: 'Active daily trading strategies' },
                { emoji: '🔄', name: 'Arbitrageur', desc: 'Capitalizing on price differences' },
              ].map((style, index) => (
                <div key={index} className="bg-background border border-border rounded-lg p-6 hover:border-accent/50 transition-all duration-200">
                  <div className="text-3xl mb-3">{style.emoji}</div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{style.name}</h3>
                  <p className="text-text-secondary text-sm">{style.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
              Ready to share your trading journey?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Join the community of traders who are building the future of crypto social networking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WalletConnect />
              <Link
                href="/discover"
                className="bg-surface border border-border text-text-primary hover:border-accent/50 px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              >
                Browse Community
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold text-text-primary">pulse.fun</span>
              </div>
              <div className="text-text-secondary text-sm">
                Built for Cypherpunk Hackathon • Powered by Zerion API
              </div>
            </div>
        </div>
        </footer>
      </main>
    </div>
  );
}
