import { NextRequest, NextResponse } from 'next/server';
import { zerionServerAPI } from '../../../../src/lib/zerion-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as '1d' | '7d' | '30d' | '90d' | '1y' || '30d';
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    const portfolio = await zerionServerAPI.getPortfolio(address);
    
    return NextResponse.json(portfolio);
  } catch (error: any) {
    console.error('Portfolio API error:', error);

    // Handle specific error types
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key', code: 'INVALID_API_KEY' },
        { status: 401 }
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', code: 'RATE_LIMIT' },
        { status: 429 }
      );
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Network error - unable to reach Zerion API', code: 'NETWORK_ERROR' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch portfolio data',
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}
