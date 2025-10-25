'use client';

import { TransactionFeedProps } from '../types';
import { formatCurrency, formatNumber } from '../lib/analysis';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

export function TransactionFeed({ 
  transactions, 
  isLoading = false, 
  onLoadMore, 
  hasMore = false 
}: TransactionFeedProps) {
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  const getTransactionIcon = (tx: any) => {
    // Handle null/undefined transaction objects
    if (!tx) return '📋';
    
    // Determine transaction type from the transaction data
    const type = tx.type || 'unknown';
    switch (type) {
      case 'swap':
        return '🔄';
      case 'transfer':
        return '📤';
      case 'approval':
        return '✅';
      case 'mint':
        return '🪙';
      case 'burn':
        return '🔥';
      default:
        return '📋';
    }
  };

  const getTransactionColor = (tx: any) => {
    // Handle null/undefined transaction objects
    if (!tx) return 'text-text-secondary';
    
    const type = tx.type || 'unknown';
    switch (type) {
      case 'swap':
        return 'text-accent';
      case 'transfer':
        return 'text-success';
      case 'approval':
        return 'text-blue-400';
      case 'mint':
        return 'text-green-400';
      case 'burn':
        return 'text-danger';
      default:
        return 'text-text-secondary';
    }
  };

  const formatTransactionValue = (tx: any) => {
    if (!tx || tx.value_usd === 0 || tx.value_usd === undefined) return 'N/A';
    return formatCurrency(Math.abs(tx.value_usd));
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background/50 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-background/50 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-background/50 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-background/50 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-text-primary text-lg font-semibold mb-2">No transactions yet</h3>
        <p className="text-text-secondary">
          This wallet hasn't made any transactions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.filter(tx => tx).map((tx) => (
        <div
          key={tx.id}
          className="bg-surface border border-border rounded-lg p-4 hover:border-accent/50 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-background/50 rounded-full flex items-center justify-center text-lg">
              {getTransactionIcon(tx)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-medium capitalize ${getTransactionColor(tx)}`}>
                  {tx.type || 'Transaction'}
                </span>
                <span className="text-text-secondary text-sm">
                  {tx.timestamp ? formatDistanceToNow(tx.timestamp, { addSuffix: true }) : 'Unknown time'}
                </span>
              </div>
              
              <div className="text-text-secondary text-sm">
                {tx.hash ? `${tx.hash.slice(0, 8)}...${tx.hash.slice(-8)}` : 'Unknown hash'}
              </div>
              
              {tx.status === 'failed' && (
                <div className="text-danger text-xs font-medium mt-1">
                  Transaction failed
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-text-primary font-medium">
                {formatTransactionValue(tx)}
              </div>
              <div className="text-text-secondary text-sm">
                {tx.timestamp ? format(tx.timestamp, 'MMM dd, HH:mm') : 'Unknown date'}
              </div>
            </div>
          </div>

          {/* Expanded details */}
          {expandedTx === tx.id && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">From:</span>
                  <div className="font-mono text-text-primary">
                    {tx.from_address ? `${tx.from_address.slice(0, 8)}...${tx.from_address.slice(-8)}` : 'Unknown'}
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">To:</span>
                  <div className="font-mono text-text-primary">
                    {tx.to_address ? `${tx.to_address.slice(0, 8)}...${tx.to_address.slice(-8)}` : 'Unknown'}
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Gas Used:</span>
                  <div className="text-text-primary">
                    {tx.gas_used ? formatNumber(tx.gas_used) : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Block:</span>
                  <div className="text-text-primary">
                    {tx.block_number ? tx.block_number.toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
              
              {tx.metadata && (
                <div className="mt-4">
                  <span className="text-text-secondary text-sm">Metadata:</span>
                  <pre className="text-xs bg-background/50 p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(tx.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Toggle details button */}
          <button
            onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
            className="mt-3 text-accent text-sm font-medium hover:text-accent/80 transition-colors duration-200"
          >
            {expandedTx === tx.id ? 'Hide details' : 'Show details'}
          </button>
        </div>
      ))}

      {/* Load more button */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-accent/10 text-accent hover:bg-accent/20 px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
