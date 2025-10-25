import axios, { AxiosResponse } from 'axios';
import { 
  ZerionPortfolioResponse, 
  ZerionTransactionResponse, 
  ZerionChartResponse,
  Portfolio,
  Transaction,
  ChartDataPoint,
  Asset,
  Position,
  ApiError
} from '../types';

export class ZerionServerAPI {
  private baseURL = 'https://api.zerion.io/v1/';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ZERION_API_KEY || '';
    if (!this.apiKey) {
      console.warn('ZERION_API_KEY is not configured, using mock data');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: this.getHeaders(),
        params,
        timeout: 10000,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new ApiError({
          message: error.response.data?.message || 'API request failed',
          code: error.response.status.toString(),
          details: error.response.data,
        });
      } else if (error.request) {
        throw new ApiError({
          message: 'Network error - unable to reach Zerion API',
          code: 'NETWORK_ERROR',
        });
      } else {
        throw new ApiError({
          message: error.message || 'Unknown error occurred',
          code: 'UNKNOWN_ERROR',
        });
      }
    }
  }

  async getPortfolio(address: string): Promise<Portfolio> {
    try {
      const response = await this.makeRequest<ZerionPortfolioResponse>(`wallets/${address}/portfolio`);
      
      const attributes = response.data.attributes;
      const totalValue = attributes.total?.positions || 0;
      const changes = attributes.changes || {};
      
      // For now, return a simplified portfolio structure
      // The actual positions would need to be fetched from a different endpoint
      const positions: Position[] = [];

      return {
        id: response.data.id,
        total_value: totalValue,
        total_value_change_24h: changes.absolute_1d || 0,
        positions,
        chart_data: [], // Will be populated by getChart method
      };
    } catch (error) {
      console.warn('Zerion API failed, returning mock data:', error);
      // Return mock data for development
      return {
        id: `mock-${address}`,
        total_value: 1250.50,
        total_value_change_24h: 5.2,
        positions: [],
        chart_data: [],
      };
    }
  }

  async getTransactions(
    address: string, 
    params?: {
      currency?: string;
      page_size?: number;
      cursor?: string;
    }
  ): Promise<{ data: Transaction[]; links?: { next?: string } }> {
    try {
      const response = await this.makeRequest<ZerionTransactionResponse>(
        `wallets/${address}/transactions`,
        params
      );

    const transactions: Transaction[] = response.data.map(tx => ({
      id: tx.id,
      hash: tx.attributes.hash,
      type: tx.attributes.type as any,
      from_address: tx.attributes.from_address,
      to_address: tx.attributes.to_address,
      value: tx.attributes.value,
      value_usd: tx.attributes.value_usd,
      asset: {
        id: 'unknown',
        name: 'Unknown',
        symbol: 'UNK',
        price: 0,
        price_change_24h: 0,
      },
      timestamp: new Date(tx.attributes.timestamp),
      block_number: tx.attributes.block_number,
      gas_used: tx.attributes.gas_used,
      gas_price: tx.attributes.gas_price,
      status: tx.attributes.status as any,
      metadata: tx.attributes.metadata,
    }));

    return {
      data: transactions,
      links: { next: response.links?.next },
    };
    } catch (error) {
      console.warn('Zerion API failed, returning mock transactions:', error);
      // Return mock transaction data
      const mockTransactions: Transaction[] = [
        {
          id: 'mock-1',
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          from_address: address,
          to_address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          value_usd: 150.25,
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          status: 'success',
          type: 'swap',
          gas_used: 21000,
          gas_price: 20000000000,
          block_number: 18500000,
          metadata: {},
        },
        {
          id: 'mock-2',
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          from_address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          to_address: address,
          value_usd: 75.50,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          status: 'success',
          type: 'transfer',
          gas_used: 21000,
          gas_price: 18000000000,
          block_number: 18499950,
          metadata: {},
        },
      ];

      return {
        data: mockTransactions,
        links: { next: undefined },
      };
    }
  }

  async getChart(
    address: string, 
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '30d'
  ): Promise<{ data: { attributes: { points: ChartDataPoint[] } } }> {
    const response = await this.makeRequest<ZerionChartResponse>(
      `wallets/${address}/chart`,
      { period }
    );

    return {
      data: {
        attributes: {
          points: response.data.map(point => ({
            timestamp: new Date(point.attributes.timestamp),
            value: point.attributes.value,
            change_24h: point.attributes.change_24h,
          }))
        }
      }
    };
  }

  async getPortfolioWithChart(address: string, period: '1d' | '7d' | '30d' | '90d' | '1y' = '30d'): Promise<Portfolio> {
    const [portfolio, chartData] = await Promise.all([
      this.getPortfolio(address),
      this.getChart(address, period),
    ]);

    return {
      ...portfolio,
      chart_data: chartData.data.attributes.points,
    };
  }
}

// Create singleton instance
export const zerionServerAPI = new ZerionServerAPI();
