'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppStore } from '../store/useStore';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { setConnectedWallet, setUser } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      setConnectedWallet(address);
      setUser({
        id: address,
        wallet_address: address,
        ens_name: undefined,
        bio: undefined,
        avatar_url: undefined,
        followers_count: 0,
        following_count: 0,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } else {
      setConnectedWallet(null);
      setUser(null);
    }
  }, [isConnected, address, setConnectedWallet, setUser]);

  if (!mounted) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-surface border border-border rounded-lg px-6 py-3">
          <div className="animate-pulse">
            <div className="h-4 bg-border rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsConnecting(true);
                        openConnectModal();
                        setTimeout(() => setIsConnecting(false), 2000);
                      }}
                      disabled={isConnecting}
                      type="button"
                      className="bg-accent hover:bg-accent/90 text-white font-body font-medium px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full loading-spinner"></div>
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>Connect Wallet</span>
                        </>
                      )}
                    </motion.button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openChainModal}
                      type="button"
                      className="bg-danger hover:bg-danger/90 text-white font-body font-medium px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-danger/50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>Wrong Network</span>
                    </motion.button>
                  );
                }

                return (
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center gap-2 glass-button px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: 'hidden',
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 20, height: 20 }}
                            />
                          )}
                        </div>
                      )}
                      <span className="text-text-primary font-body font-medium">
                        {chain.name}
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openAccountModal}
                      type="button"
                      className="flex items-center gap-2 glass-button px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-text-primary font-body font-medium">
                        {account.displayName}
                      </span>
                    </motion.button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}