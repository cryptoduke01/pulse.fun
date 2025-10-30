import { NextRequest, NextResponse } from 'next/server';

interface TradingSignal {
  id: string;
  walletAddress: string;
  walletName: string | null;
  action: 'buy' | 'sell' | 'swap';
  token: string;
  amount: string;
  valueUsd: number;
  timestamp: Date;
  txHash: string;
}

export async function POST(request: NextRequest) {
  try {
    const { walletAddresses } = await request.json();

    if (!walletAddresses || !Array.isArray(walletAddresses)) {
      return NextResponse.json(
        { error: 'walletAddresses array is required' },
        { status: 400 }
      );
    }

    const signals: TradingSignal[] = [];

    // Fetch recent transactions for each followed wallet
    for (const walletAddress of walletAddresses) {
      try {
        // Get recent transactions from Zerion API
        const zerionResponse = await fetch(`https://api.zerion.io/v1/wallets/${walletAddress}/transactions?page_size=5`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(process.env.NEXT_PUBLIC_ZERION_API_KEY + ':').toString('base64')}`,
            'Content-Type': 'application/json',
          },
        });

        if (zerionResponse.ok) {
          const data = await zerionResponse.json();
          const transactions = data.data || [];

          // Process transactions from the last 24 hours
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          
          for (const tx of transactions) {
            const txDate = new Date(tx.attributes.timestamp);
            if (txDate > oneDayAgo) {
              // Determine action type based on transaction data
              let action: 'buy' | 'sell' | 'swap' = 'swap';
              let token = 'Unknown';
              let amount = '0';
              let valueUsd = tx.attributes.value_usd || 0;

              // Simple logic to determine action type
              if (tx.attributes.type === 'swap') {
                action = 'swap';
                token = 'Token';
                amount = '1';
              } else if (tx.attributes.type === 'transfer') {
                if (tx.attributes.from_address.toLowerCase() === walletAddress.toLowerCase()) {
                  action = 'sell';
                } else {
                  action = 'buy';
                }
                token = 'Token';
                amount = '1';
              }

              // Only include significant transactions (>$100)
              if (valueUsd > 100) {
                signals.push({
                  id: tx.id,
                  walletAddress,
                  walletName: walletAddress === '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' ? 'vitalik.eth' : null,
                  action,
                  token,
                  amount,
                  valueUsd,
                  timestamp: txDate,
                  txHash: tx.attributes.hash,
                });
              }
            }
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch transactions for ${walletAddress}:`, error);
      }
    }

    // Sort by timestamp (newest first)
    signals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Limit to 20 most recent signals
    const recentSignals = signals.slice(0, 20);

    return NextResponse.json({
      signals: recentSignals,
      count: recentSignals.length,
    });
  } catch (error) {
    console.error('Trading signals API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
