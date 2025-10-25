import { useState } from 'react';
import { useAppStore } from '../store/useStore';

export function useFollow() {
  const [isLoading, setIsLoading] = useState(false);
  const { connectedWallet, toggleFollow, isFollowing } = useAppStore();

  const followWallet = async (targetAddress: string) => {
    if (!connectedWallet) {
      throw new Error('No wallet connected');
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: connectedWallet,
          targetAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to follow wallet');
      }

      const data = await response.json();
      
      // Update local state
      toggleFollow(targetAddress);
      
      return data;
    } catch (error) {
      console.error('Follow error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const unfollowWallet = async (targetAddress: string) => {
    if (!connectedWallet) {
      throw new Error('No wallet connected');
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: connectedWallet,
          targetAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow wallet');
      }

      const data = await response.json();
      
      // Update local state
      toggleFollow(targetAddress);
      
      return data;
    } catch (error) {
      console.error('Unfollow error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkIsFollowing = (targetAddress: string) => {
    return isFollowing(targetAddress);
  };

  return {
    followWallet,
    unfollowWallet,
    checkIsFollowing,
    isLoading,
  };
}
