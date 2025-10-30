'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Zap, BarChart3, Users } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative z-10 w-[92vw] max-w-xl bg-surface border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-text-primary">Welcome to pulse.fun</h3>
              <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-text-secondary mb-4">Your wallet tells your story. Here’s how to get started:</p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div>
                  <div className="text-text-primary font-medium">Connect wallet</div>
                  Click “Connect Wallet” in the header to enable your profile.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-4 h-4 text-accent mt-0.5" />
                <div>
                  <div className="text-text-primary font-medium">View your profile</div>
                  See portfolio value, trading style, and transactions in one place.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-text-primary font-medium">Discover & follow</div>
                  Explore trending wallets and follow to get activity in your feed.
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <a
                href="/discover"
                className="bg-surface border border-border hover:border-accent/50 px-4 py-2 rounded-lg font-medium text-text-primary"
                onClick={onClose}
              >
                Discover
              </a>
              <button
                className="bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg font-medium"
                onClick={onClose}
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


