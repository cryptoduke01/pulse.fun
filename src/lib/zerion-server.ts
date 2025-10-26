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
      throw new Error('ZERION_API_KEY is required. Please set it in your environment variables.');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: this.getHeaders(),
        params,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        throw new ApiError({
          message: `Zerion API error: ${data?.error || 'Unknown error'}`,
          code: status.toString(),
          details: data,
        });
      } else if (error.request) {
        throw new ApiError({
          message: 'Network error - unable to reach Zerion API',
          code: 'NETWORK_ERROR',
          details: error.message,
        });
      } else {
        throw new ApiError({
          message: 'Request configuration error',
          code: 'CONFIG_ERROR',
          details: error.message,
        });
      }
    }
  }

  async getPortfolio(address: string): Promise<Portfolio> {
    const response = await this.makeRequest<ZerionPortfolioResponse>(`wallets/${address}/portfolio`);
    
    const attributes = response.data.attributes;
    // The total value is in attributes.total.positions, not positions_distribution_by_type
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
  }

  async getTransactions(
    address: string, 
    params?: {
      currency?: string;
      page_size?: number;
      cursor?: string;
    }
  ): Promise<{ data: Transaction[]; links?: { next?: string } }> {
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
  }

  async getChart(
    address: string, 
    period: '1d' | '7d' | '30d' | '90d' | '1y' | 'max' = '30d'
  ): Promise<{ data: { attributes: { points: ChartDataPoint[] } } }> {
    // Map period to Zerion's expected format
    const periodMap: Record<string, string> = {
      '1d': 'day',
      '7d': 'week', 
      '30d': 'month',
      '90d': 'month', // Zerion doesn't have 90d, use month
      '1y': 'year',
      'max': 'max'
    };

    const zerionPeriod = periodMap[period] || 'month';

    const response = await this.makeRequest<ZerionChartResponse>(
      `wallets/${address}/charts/${zerionPeriod}`,
      { currency: 'usd' }
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

  async getPortfolioWithChart(address: string, period: '1d' | '7d' | '30d' | '90d' | '1y' | 'max' = '30d'): Promise<Portfolio> {
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
