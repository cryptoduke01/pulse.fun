'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  wallet_address: string;
  type: string;
  description: string;
  value_usd: number;
  timestamp: string | Date;
  metadata: any;
}

interface ActivityFeedProps {
  walletAddress: string;
  limit?: number;
}

export function ActivityFeed({ walletAddress, limit = 50 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
    
    // Set up real-time updates (polling for now, could be WebSocket in production)
    const interval = setInterval(fetchActivities, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [walletAddress]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activity?walletAddress=${walletAddress}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      
      const data = await response.json();
      setActivities(data.activities || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return '👥';
      case 'unfollow':
        return '👋';
      case 'transaction_created':
        return '💸';
      case 'portfolio_updated':
        return '📊';
      case 'activity_detected':
        return '⚡';
      default:
        return '📋';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'follow':
        return 'text-success';
      case 'unfollow':
        return 'text-danger';
      case 'transaction_created':
        return 'text-accent';
      case 'portfolio_updated':
        return 'text-blue-400';
      case 'activity_detected':
        return 'text-yellow-400';
      default:
        return 'text-text-secondary';
    }
  };

  const formatActivityMessage = (activity: Activity) => {
    // Use the description from the API response
    return activity.description;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-background/50 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-background/50 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">⚠️</div>
        <p className="text-text-secondary mb-4">{error}</p>
        <button
          onClick={fetchActivities}
          className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">📋</div>
        <p className="text-text-secondary">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-surface border border-border rounded-lg p-4 hover:border-accent/50 transition-all duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-background/50 rounded-full flex items-center justify-center text-lg">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-medium ${getActivityColor(activity.type)}`}>
                  {formatActivityMessage(activity)}
                </span>
                <span className="text-text-secondary text-sm">
                  {(() => {
                    try {
                      const date = new Date(activity.timestamp);
                      if (isNaN(date.getTime())) {
                        return 'Unknown time';
                      }
                      return formatDistanceToNow(date, { addSuffix: true });
                    } catch (error) {
                      return 'Unknown time';
                    }
                  })()}
                </span>
              </div>
              
              <div className="text-text-secondary text-sm">
                {activity.wallet_address.slice(0, 6)}...{activity.wallet_address.slice(-4)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
