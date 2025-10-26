'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <Loader2 className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-primary font-medium"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}

interface SectionLoadingProps {
  message?: string;
  height?: string;
}

export function SectionLoading({ message = "Loading...", height = "h-32" }: SectionLoadingProps) {
  return (
    <div className={`${height} flex items-center justify-center bg-surface border border-border rounded-xl`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <Loader2 className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-2 animate-spin" />
        <p className="text-text-secondary text-sm">{message}</p>
      </motion.div>
    </div>
  );
}
