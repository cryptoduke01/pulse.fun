import { NextRequest, NextResponse } from 'next/server';
import { zerionServerAPI } from '../../../../src/lib/zerion-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
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

    const pageSize = parseInt(searchParams.get('page_size') || '50');
    const cursor = searchParams.get('cursor') || undefined;

    const result = await zerionServerAPI.getTransactions(address, {
      page_size: pageSize,
      cursor,
    });
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Transactions API error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch transaction data',
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}
