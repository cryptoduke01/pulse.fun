import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, AppActions, User, Wallet } from '../types';

interface AppStore extends AppState, AppActions {
  toggleFollow: (address: string) => void;
  isFollowing: (address: string) => boolean;
  clearError: () => void;
  reset: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      connectedWallet: null,
      following: [],
      isLoading: false,
      error: null,

      // Actions
      setUser: (user: User | null) => set({ user }),
      
      setConnectedWallet: (address: string | null) => set({ connectedWallet: address }),
      
      addFollowing: (address: string) => {
        const { following } = get();
        if (!following.includes(address)) {
          set({ following: [...following, address] });
        }
      },
      
      removeFollowing: (address: string) => {
        const { following } = get();
        set({ following: following.filter(addr => addr !== address) });
      },
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setError: (error: string | null) => set({ error }),
      
      // Helper methods
      isFollowing: (address: string) => {
        const { following } = get();
        return following.includes(address);
      },
      
      toggleFollow: (address: string) => {
        const { following, addFollowing, removeFollowing } = get();
        if (following.includes(address)) {
          removeFollowing(address);
        } else {
          addFollowing(address);
        }
      },
      
      clearError: () => set({ error: null }),
      
      reset: () => set({
        user: null,
        connectedWallet: null,
        following: [],
        isLoading: false,
        error: null,
      }),
    }),
    {
      name: 'pulse-fun-store',
      partialize: (state) => ({
        user: state.user,
        connectedWallet: state.connectedWallet,
        following: state.following,
      }),
    }
  )
);

// Selectors for better performance
export const useUser = () => useAppStore(state => state.user);
export const useConnectedWallet = () => useAppStore(state => state.connectedWallet);
export const useFollowing = () => useAppStore(state => state.following);
export const useIsLoading = () => useAppStore(state => state.isLoading);
export const useError = () => useAppStore(state => state.error);

export const useIsFollowing = (address: string) => 
  useAppStore(state => state.following.includes(address));

export const useWalletActions = () => {
  const setUser = useAppStore(state => state.setUser);
  const setConnectedWallet = useAppStore(state => state.setConnectedWallet);
  const addFollowing = useAppStore(state => state.addFollowing);
  const removeFollowing = useAppStore(state => state.removeFollowing);
  const toggleFollow = useAppStore(state => state.toggleFollow);

  return {
    setUser,
    setConnectedWallet,
    addFollowing,
    removeFollowing,
    toggleFollow,
  };
};

export const useAppActions = () => {
  const setLoading = useAppStore(state => state.setLoading);
  const setError = useAppStore(state => state.setError);
  const clearError = useAppStore(state => state.clearError);
  const reset = useAppStore(state => state.reset);

  return {
    setLoading,
    setError,
    clearError,
    reset,
  };
};
