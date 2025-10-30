'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Lightbulb, BookOpen, TrendingUp } from 'lucide-react';

interface RecommendationsModalProps {
  open: boolean;
  onClose: () => void;
}

export function RecommendationsModal({ open, onClose }: RecommendationsModalProps) {
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Trading Guide</h3>
              <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-text-secondary">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div>
                  <div className="text-text-primary font-medium">Position sizing</div>
                  Use a fixed % per trade and avoid overexposure to a single asset.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <div className="text-text-primary font-medium">Momentum vs. Mean Reversion</div>
                  Identify your style and stick to clear entry/exit rules.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-text-primary font-medium">Learn from activity</div>
                  Review your recent wins/losses weekly and refine your process.
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={onClose} className="bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg font-medium">
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


