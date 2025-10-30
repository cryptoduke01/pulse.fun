'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WalletConnect } from './WalletConnect';
import { useConnectedWallet } from '../store/useStore';
import { Toaster } from './Toaster';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const connectedWallet = useConnectedWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/feed', label: 'Feed', requiresWallet: true },
    { href: '/discover', label: 'Discover' },
    ...(connectedWallet ? [{ href: `/profile/${connectedWallet}`, label: 'My Profile', requiresWallet: true }] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    if (pathname === href) return;
    router.push(href);
  };

  return (
    <>
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center glow"
            >
              <span className="text-white font-heading font-bold text-sm">P</span>
            </motion.div>
            <span className="text-xl font-heading font-bold text-white">pulse.fun</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => {
              if (item.requiresWallet && !connectedWallet) {
                return null;
              }
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <motion.button
                    onClick={() => handleNavigation(item.href)}
                    className={`px-3 py-2 rounded-lg font-body font-medium transition-all duration-200 cursor-pointer ${
                      isActive(item.href)
                        ? 'text-accent bg-accent/10 glow'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Wallet Connect */}
          <div className="hidden md:block">
            <WalletConnect />
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface/50 transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </motion.svg>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-glass-border"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => {
                  if (item.requiresWallet && !connectedWallet) {
                    return null;
                  }
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <motion.button
                        onClick={() => {
                          handleNavigation(item.href);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg font-body font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? 'text-accent bg-accent/10 glow'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface/50'
                        }`}
                      >
                        {item.label}
                      </motion.button>
                    </motion.div>
                  );
                })}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="pt-4 border-t border-glass-border"
                >
                  <WalletConnect />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
    {/* Global toasts */}
    <Toaster />
    </>
  );
}
