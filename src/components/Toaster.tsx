'use client';

import { useToastStore } from '../store/toastStore';
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  const variantClasses = (v?: string) => {
    switch (v) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10 text-green-300';
      case 'error':
        return 'border-red-500/30 bg-red-500/10 text-red-300';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-300';
      default:
        return 'border-border bg-surface text-text-primary';
    }
  };

  const iconFor = (v?: string) => {
    switch (v) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 w-[320px] max-w-[90vw]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 border rounded-lg px-4 py-3 shadow-lg ${variantClasses(t.variant)}`}
        >
          <div className="mt-0.5">{iconFor(t.variant)}</div>
          <div className="flex-1 min-w-0">
            {t.title && <div className="font-medium truncate">{t.title}</div>}
            {t.description && (
              <div className="text-sm opacity-80 break-words">{t.description}</div>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}


