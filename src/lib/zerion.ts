import { 
  Portfolio,
  Transaction,
  ChartDataPoint,
  Asset,
  Position,
  ApiError
} from '../types';

export class ZerionAPI {
  private baseURL = '/api';

  private async makeRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      // Use relative URLs for API routes
      let url = `${this.baseURL}${endpoint}`;
      
      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
        if (searchParams.toString()) {
          url += `?${searchParams.toString()}`;
        }
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError({
          message: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          code: response.status.toString(),
          details: errorData,
        });
      }

      return await response.json();
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError({
        message: error.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
      });
    }
  }

  async getPortfolio(address: string): Promise<Portfolio> {
    return await this.makeRequest<Portfolio>(`/portfolio/${address}`);
  }

  async getTransactions(
    address: string, 
    params?: {
      currency?: string;
      page_size?: number;
      cursor?: string;
    }
  ): Promise<{ data: Transaction[]; links?: { next?: string } }> {
    return await this.makeRequest<{ data: Transaction[]; links?: { next?: string } }>(`/transactions/${address}`, params);
  }

  async getPositions(address: string): Promise<Position[]> {
    const portfolio = await this.getPortfolio(address);
    return portfolio.positions;
  }

  async getChart(
    address: string, 
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '30d'
  ): Promise<{ data: { attributes: { points: ChartDataPoint[] } } }> {
    return await this.makeRequest<{ data: { attributes: { points: ChartDataPoint[] } } }>(`/portfolio/${address}`, { period });
  }

  async getAsset(fungibleId: string): Promise<Asset> {
    return await this.makeRequest<Asset>(`/asset/${fungibleId}`);
  }

  async setupWebhook(webhookUrl: string, events: string[]): Promise<boolean> {
    try {
      await this.makeRequest('/webhooks', {
        url: webhookUrl,
        events,
      });
      return true;
    } catch (error) {
      console.error('Failed to setup webhook:', error);
      return false;
    }
  }

  // Helper method to get portfolio with chart data
  async getPortfolioWithChart(address: string, period: '1d' | '7d' | '30d' | '90d' | '1y' = '30d'): Promise<Portfolio> {
    const portfolio = await this.getPortfolio(address);
    return portfolio; // Chart data is included in the portfolio response
  }

  // Helper method to get comprehensive wallet data
  async getWalletData(address: string) {
    const [portfolio, transactions] = await Promise.all([
      this.getPortfolioWithChart(address),
      this.getTransactions(address, { page_size: 50 }),
    ]);

    return {
      portfolio,
      transactions: transactions.data,
    };
  }
}

// Create singleton instance
export const zerionAPI = new ZerionAPI();

// Export individual methods for convenience
export const {
  getPortfolio,
  getTransactions,
  getPositions,
  getChart,
  getAsset,
  setupWebhook,
  getPortfolioWithChart,
  getWalletData,
} = zerionAPI;
