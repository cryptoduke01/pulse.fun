import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Missing walletAddress parameter' },
        { status: 400 }
      );
    }

    // Fetch real transaction data from Zerion API
    const zerionResponse = await fetch(`https://api.zerion.io/v1/wallets/${walletAddress}/transactions?page_size=${limit}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.NEXT_PUBLIC_ZERION_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!zerionResponse.ok) {
      throw new Error('Failed to fetch transactions from Zerion');
    }

    const zerionData = await zerionResponse.json();
    const transactions = zerionData.data || [];

    // Convert Zerion transactions to activity format
    const activities = transactions.map((tx: any, index: number) => ({
      id: tx.id,
      type: 'transaction',
      wallet_address: walletAddress,
      description: getTransactionDescription(tx),
      value_usd: tx.attributes.value_usd || 0,
      timestamp: tx.attributes.timestamp,
      metadata: {
        hash: tx.attributes.hash,
        type: tx.attributes.type,
        from_address: tx.attributes.from_address,
        to_address: tx.attributes.to_address,
        block_number: tx.attributes.block_number,
      },
    }));

    return NextResponse.json({
      activities: activities.slice(0, limit),
      count: activities.length,
    });
  } catch (error) {
    console.error('Activity API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  }
}

function getTransactionDescription(tx: any): string {
  const type = tx.attributes.type;
  const valueUsd = tx.attributes.value_usd;
  
  switch (type) {
    case 'swap':
      return `Swapped tokens ($${valueUsd?.toFixed(2) || '0'})`;
    case 'transfer':
      return `Transferred tokens ($${valueUsd?.toFixed(2) || '0'})`;
    case 'approval':
      return `Approved token spending`;
    case 'mint':
      return `Minted tokens ($${valueUsd?.toFixed(2) || '0'})`;
    case 'burn':
      return `Burned tokens ($${valueUsd?.toFixed(2) || '0'})`;
    default:
      return `Transaction: ${type} ($${valueUsd?.toFixed(2) || '0'})`;
  }
}