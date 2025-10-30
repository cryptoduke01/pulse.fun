'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Download, BarChart3, TrendingUp, TrendingDown, User } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../lib/analysis';

interface ShareableProfileCardProps {
  wallet: {
    address: string;
    ensName?: string;
  };
  stats: {
    total_value: number;
    value_change_24h: number;
    total_trades: number;
    active_days: number;
    trading_style: {
      type: string;
      score: number;
      confidence: number;
    };
    performance: {
      win_rate: number;
      risk_score: number;
      profit_factor: number;
    };
  };
}

export function ShareableProfileCard({ wallet, stats }: ShareableProfileCardProps) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareData = {
        title: `${wallet.ensName || wallet.address} - Pulse.fun Profile`,
        text: `Check out this crypto trader's profile on Pulse.fun`,
        url: `${window.location.origin}/profile/${wallet.address}`,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to share:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${wallet.address}`;
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy profile URL:', error);
    }
  };

  const handleDownloadCard = () => {
    // Create a canvas element to generate the card image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(1, '#2d1b69');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(wallet.ensName || `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`, canvas.width / 2, 80);

    ctx.font = '24px Inter';
    ctx.fillText(`Portfolio: ${formatCurrency(stats.total_value)}`, canvas.width / 2, 140);
    ctx.fillText(`Trades: ${stats.total_trades}`, canvas.width / 2, 180);
    ctx.fillText(`Win Rate: ${formatPercentage(stats.performance.win_rate)}`, canvas.width / 2, 220);

    ctx.font = '20px Inter';
    ctx.fillStyle = '#888888';
    ctx.fillText('pulse.fun', canvas.width / 2, 350);

    // Download the image
    const link = document.createElement('a');
    link.download = `pulse-profile-${wallet.address.slice(0, 8)}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Share Profile</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-4 h-4" />
            {isSharing ? 'Sharing...' : 'Share'}
          </motion.button>
          
          <motion.button
            onClick={handleCopyProfile}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:border-accent/50 text-text-primary rounded-lg font-medium transition-all duration-200 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </motion.button>

          <motion.button
            onClick={handleDownloadCard}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 text-purple-400 hover:bg-purple-600/20 rounded-lg font-medium transition-all duration-200 w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            Download Card
          </motion.button>
        </div>
      </div>

      {/* Profile Card Preview */}
      <div className="bg-gradient-to-br from-background to-surface border border-border rounded-xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-text-primary font-semibold">
              {wallet.ensName || `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
            </h4>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-3 h-3 text-accent" />
              <span className="text-text-secondary text-sm">
                {stats.trading_style.type.replace('_', ' ')} • {stats.trading_style.confidence}% confidence
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-text-primary text-lg font-semibold">
              {formatCurrency(stats.total_value)}
            </div>
            <div className={`text-sm flex items-center justify-center gap-1 ${
              stats.value_change_24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.value_change_24h >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {formatPercentage(stats.value_change_24h)}
            </div>
            <div className="text-text-secondary text-xs">Portfolio Value</div>
          </div>

          <div className="text-center">
            <div className="text-text-primary text-lg font-semibold">
              {stats.total_trades}
            </div>
            <div className="text-text-secondary text-sm">
              {stats.active_days} active days
            </div>
            <div className="text-text-secondary text-xs">Total Trades</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-text-secondary">Win Rate:</span>
              <span className="text-text-primary ml-2">{formatPercentage(stats.performance.win_rate)}</span>
            </div>
            <div>
              <span className="text-text-secondary">Risk Score:</span>
              <span className="text-text-primary ml-2">{stats.performance.risk_score}/100</span>
            </div>
            <div>
              <span className="text-text-secondary">Profit Factor:</span>
              <span className="text-text-primary ml-2">{stats.performance.profit_factor.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-text-secondary text-sm">
          Share this profile to showcase your trading performance
        </p>
      </div>
    </div>
  );
}
