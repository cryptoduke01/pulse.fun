import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { zerionAPI } from '../lib/zerion';
import { Portfolio, Transaction, ChartDataPoint, WalletStats } from '../types';
import { analyzeTradingStyle, calculateWalletStats } from '../lib/analysis';

export function usePortfolio(address: string) {
  return useQuery({
    queryKey: ['portfolio', address],
    queryFn: () => zerionAPI.getPortfolioWithChart(address),
    enabled: !!address,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (invalid API key) or 400 (bad request)
      if (error?.response?.status === 401 || error?.response?.status === 400) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useTransactions(address: string, pageSize: number = 100) {
  return useInfiniteQuery({
    queryKey: ['transactions', address],
    queryFn: ({ pageParam }) => 
      zerionAPI.getTransactions(address, { 
        page_size: pageSize, 
        cursor: pageParam 
      }),
    enabled: !!address,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60000, // 1 minute
    gcTime: 600000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 400) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useChart(address: string, period: '1d' | '7d' | '30d' | '90d' | '1y' = '30d') {
  return useQuery({
    queryKey: ['chart', address, period],
    queryFn: () => zerionAPI.getChart(address, period),
    enabled: !!address,
    staleTime: 300000, // 5 minutes
    gcTime: 1800000, // 30 minutes
  });
}

export function useWalletStats(address: string) {
  return useQuery({
    queryKey: ['walletStats', address],
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (invalid API key) or 400 (bad request)
      if (error?.response?.status === 401 || error?.response?.status === 400) {
        return false;
      }
      return failureCount < 2; // Reduced retries to avoid overwhelming the API
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Max 10 seconds
    queryFn: async () => {
      console.log('useWalletStats: Starting for address:', address);
      
      try {
        // Try with smaller page size first to avoid rate limits
        const [portfolio, transactionsResult] = await Promise.all([
          zerionAPI.getPortfolio(address),
          zerionAPI.getTransactions(address, { page_size: 20 }), // Even smaller to avoid API limits
        ]);

        console.log('useWalletStats: Got portfolio:', portfolio);
        console.log('useWalletStats: Got transactions:', transactionsResult);
        console.log('useWalletStats: transactionsResult.data:', transactionsResult.data);
        console.log('useWalletStats: transactionsResult.transactions:', transactionsResult.transactions);

        const tradingStyle = analyzeTradingStyle(transactionsResult.data || []);
        console.log('useWalletStats: Trading style:', tradingStyle);
        
        const stats = calculateWalletStats(portfolio, transactionsResult.data || [], tradingStyle);
        console.log('useWalletStats: Final stats:', stats);

        return stats;
      } catch (error) {
        console.error('useWalletStats: Error details:', {
          error: error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          address: address
        });
        
        // If it's a rate limit or API error, try with even smaller page size
        if (error instanceof Error && (error.message.includes('rate limit') || error.message.includes('API error'))) {
          console.log('useWalletStats: Retrying with smaller page size...');
          try {
            const [portfolio, transactionsResult] = await Promise.all([
              zerionAPI.getPortfolio(address),
              zerionAPI.getTransactions(address, { page_size: 10 }), // Minimal page size
            ]);
            
            const tradingStyle = analyzeTradingStyle(transactionsResult.data || []);
            const stats = calculateWalletStats(portfolio, transactionsResult.data || [], tradingStyle);
            return stats;
          } catch (retryError) {
            console.error('useWalletStats: Retry also failed:', retryError);
            throw retryError;
          }
        }
        
        throw error;
      }
    },
    enabled: !!address,
    staleTime: 60000, // 1 minute
    gcTime: 600000, // 10 minutes
  });
}

export function useWalletData(address: string) {
  const portfolio = usePortfolio(address);
  const transactions = useTransactions(address);
  const chart = useChart(address);
  const stats = useWalletStats(address);


  // Debug logging
  console.log('useWalletData: Status check:', {
    address,
    portfolioStatus: portfolio.status,
    portfolioData: portfolio.data,
    portfolioError: portfolio.error,
    transactionsStatus: transactions.status,
    transactionsData: transactions.data,
    transactionsError: transactions.error,
    statsStatus: stats.status,
    statsData: stats.data,
    statsError: stats.error,
    isLoading: portfolio.isLoading || transactions.isLoading || chart.isLoading || stats.isLoading,
    error: portfolio.error || transactions.error || chart.error || stats.error,
  });

  return {
    portfolio,
    transactions,
    chart,
    stats,
    isLoading: portfolio.isLoading || transactions.isLoading || chart.isLoading || stats.isLoading,
    error: portfolio.error || transactions.error || chart.error || stats.error,
  };
}

export function useAsset(fungibleId: string) {
  return useQuery({
    queryKey: ['asset', fungibleId],
    queryFn: () => zerionAPI.getAsset(fungibleId),
    enabled: !!fungibleId,
    staleTime: 300000, // 5 minutes
    gcTime: 1800000, // 30 minutes
  });
}
