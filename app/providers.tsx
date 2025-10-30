'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, base, arbitrum, optimism } from 'wagmi/chains';
// import { createConfig, http } from 'wagmi';
import { useState, useEffect } from 'react';
import '@rainbow-me/rainbowkit/styles.css';

// Configure chains
const config = getDefaultConfig({
  appName: 'pulse.fun',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '37964f97ec5121be8a5d4128583dc238',
  chains: [mainnet, polygon, base, arbitrum, optimism],
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30000, // 30 seconds
        gcTime: 300000, // 5 minutes
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }));

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              modalSize="compact"
              showRecentTransactions={true}
              initialChain={mainnet}
              coolMode={true}
            >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
