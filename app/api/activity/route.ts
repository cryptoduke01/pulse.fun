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

    // Mock activity data for now
    const activities = [
      {
        id: '1',
        type: 'transaction',
        wallet_address: walletAddress,
        description: 'Swapped 100 USDC for ETH',
        value_usd: 100.50,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        metadata: {
          from_token: 'USDC',
          to_token: 'ETH',
          amount: '100.50',
        },
      },
      {
        id: '2',
        type: 'follow',
        wallet_address: walletAddress,
        description: 'Started following 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        value_usd: 0,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        metadata: {
          followed_address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        },
      },
      {
        id: '3',
        type: 'transaction',
        wallet_address: walletAddress,
        description: 'Received 0.5 ETH from 0x1234567890123456789012345678901234567890',
        value_usd: 1250.75,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        metadata: {
          token: 'ETH',
          amount: '0.5',
        },
      },
    ].slice(0, limit);

    return NextResponse.json({
      activities,
    });
  } catch (error) {
    console.error('Activity API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
