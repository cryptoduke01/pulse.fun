import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Call Zerion API directly to see the actual response structure
    const zerionResponse = await fetch(`https://api.zerion.io/v1/wallets/${address}/portfolio`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.NEXT_PUBLIC_ZERION_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!zerionResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Zerion API', status: zerionResponse.status },
        { status: zerionResponse.status }
      );
    }

    const data = await zerionResponse.json();
    
    return NextResponse.json({
      raw_response: data,
      attributes: data.data?.attributes,
      total_value_candidates: {
        total_positions: data.data?.attributes?.total?.positions,
        positions_distribution_wallet: data.data?.attributes?.positions_distribution_by_type?.wallet,
        positions_distribution_all: data.data?.attributes?.positions_distribution_by_type,
      },
      changes: data.data?.attributes?.changes,
    });
  } catch (error: any) {
    console.error('Debug portfolio API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
