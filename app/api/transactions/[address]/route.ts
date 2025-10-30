import { NextRequest, NextResponse } from 'next/server';
import { zerionServerAPI } from '../../../../src/lib/zerion-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  let address: string;
  
  try {
    const resolvedParams = await params;
    address = resolvedParams.address;
    const { searchParams } = new URL(request.url);
    
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

    const pageSize = parseInt(searchParams.get('page_size') || '100'); // Increased to get more transactions
    const cursor = searchParams.get('cursor') || undefined;

    const result = await zerionServerAPI.getTransactions(address, {
      page_size: pageSize,
      cursor,
    });
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Transactions API error:', {
      error: error,
      message: error.message,
      code: error.code,
      address: address || 'unknown',
      stack: error.stack
    });
    
    // Handle specific error types (ApiError uses string numeric HTTP code)
    if (error.code === '401') {
      return NextResponse.json(
        { error: 'Invalid Zerion API key', code: 'AUTH_ERROR' },
        { status: 401 }
      );
    } else if (error.code === '429') {
      return NextResponse.json(
        { error: 'Rate limit exceeded', code: 'RATE_LIMIT' },
        { status: 429 }
      );
    } else if (error.code === 'NETWORK_ERROR') {
      return NextResponse.json(
        { error: 'Network error', code: 'NETWORK_ERROR' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch transaction data',
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}
