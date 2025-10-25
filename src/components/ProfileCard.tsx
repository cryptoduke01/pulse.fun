'use client';

import { ProfileCardProps } from '../types';
import { formatCurrency, formatPercentage, getTradingStyleEmoji, getTradingStyleColor } from '../lib/analysis';
import { useIsFollowing, useWalletActions } from '../store/useStore';
import { useFollow } from '../hooks/useFollow';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function ProfileCard({ 
  wallet, 
  stats, 
  isFollowing, 
  onFollow, 
  onUnfollow, 
  showActions = true,
  isCurrentUser = false
}: ProfileCardProps & { isCurrentUser?: boolean }) {
  const { followWallet, unfollowWallet, checkIsFollowing, isLoading } = useFollow();
  const isCurrentlyFollowing = checkIsFollowing(wallet.address);

  const handleFollow = async () => {
    try {
      if (isCurrentlyFollowing) {
        await unfollowWallet(wallet.address);
      } else {
        await followWallet(wallet.address);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const displayAddress = wallet.ensName || `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;

  return (
    <Link href={`/profile/${wallet.address}`} className="block w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="glass-card p-4 lg:p-6 hover:border-accent/50 transition-all duration-300 cursor-pointer h-full w-full"
      >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {isCurrentUser && (
            <div className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
              YOU
            </div>
          )}
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-12 h-12 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center glow"
          >
            <span className="text-white font-heading font-bold text-lg">
              {wallet.address.slice(0, 2).toUpperCase()}
            </span>
          </motion.div>
          <div>
            <span className="text-text-primary font-heading font-semibold">
              {displayAddress}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-body-sm font-medium px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: getTradingStyleColor(stats.trading_style.type) + '20',
                  color: getTradingStyleColor(stats.trading_style.type)
                }}
              >
                {getTradingStyleEmoji(stats.trading_style.type)} {stats.trading_style.type.replace('_', ' ')}
              </motion.span>
              <span className="text-text-secondary text-body-sm">
                {stats.trading_style.score}% confidence
              </span>
            </div>
          </div>
        </div>
        
        {showActions && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFollow();
            }}
            disabled={isLoading}
            className={`glass-button px-4 py-2 font-body font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
              isCurrentlyFollowing
                ? 'text-danger hover:bg-danger/10'
                : 'text-accent hover:bg-accent/10'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full loading-spinner"></div>
                <span>Loading...</span>
              </div>
            ) : isCurrentlyFollowing ? 'Unfollow' : 'Follow'}
          </motion.button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass rounded-lg p-2 lg:p-3"
        >
          <div className="text-text-secondary text-caption font-medium">Portfolio Value</div>
          <div className="text-text-primary text-subtitle font-heading font-semibold glow-text">
            {formatCurrency(stats.total_value)}
          </div>
          <div className={`text-body-sm font-medium ${
            stats.value_change_24h >= 0 ? 'text-success' : 'text-danger'
          }`}>
            {formatPercentage(stats.value_change_24h)}
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass rounded-lg p-2 lg:p-3"
        >
          <div className="text-text-secondary text-caption font-medium">Total Trades</div>
          <div className="text-text-primary text-subtitle font-heading font-semibold">
            {stats.total_trades.toLocaleString()}
          </div>
          <div className="text-text-secondary text-body-sm">
            {stats.active_days} active days
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-3">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between"
        >
          <span className="text-text-secondary text-body-sm">Win Rate</span>
          <span className="text-text-primary font-heading font-medium">
            {stats.performance.win_rate.toFixed(1)}%
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <span className="text-text-secondary text-body-sm">Avg Hold Time</span>
          <span className="text-text-primary font-heading font-medium">
            {stats.performance.average_hold_time.toFixed(1)} days
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <span className="text-text-secondary text-body-sm">Risk Score</span>
          <span className="text-text-primary font-heading font-medium">
            {stats.performance.risk_score}/100
          </span>
        </motion.div>
      </div>

      {/* Trading Traits */}
      {stats.trading_style.traits.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 pt-4 border-t border-glass-border"
        >
          <div className="text-text-secondary text-body-sm font-medium mb-2">Trading Traits</div>
          <div className="flex flex-wrap gap-2">
            {stats.trading_style.traits.map((trait, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-caption glass text-text-secondary px-2 py-1 rounded-full"
              >
                {trait}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
    </Link>
  );
}
