import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || '30d') as '1d' | '7d' | '30d' | '90d' | '1y' | 'max';

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    const zerionApiKey = process.env.NEXT_PUBLIC_ZERION_API_KEY;

    if (!zerionApiKey) {
      return NextResponse.json({ error: 'Zerion API key not configured' }, { status: 500 });
    }

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

    // Fetch chart data from Zerion API
    const response = await fetch(`https://api.zerion.io/v1/wallets/${address}/charts/${zerionPeriod}?currency=usd`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(zerionApiKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Zerion Chart API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: `/api/chart/${address}`
      });
      return NextResponse.json(
        { error: errorData.error || `Failed to fetch chart data: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Map Zerion chart response to our expected format
    // Zerion returns points as arrays [timestamp, value]
    const points = data.data?.attributes?.points || [];
    const chartData = {
      data: points.map((point: [number, number]) => ({
        timestamp: new Date(point[0] * 1000).toISOString(), // Convert Unix timestamp to ISO string
        value: point[1],
        currency: 'usd'
      })),
      meta: {
        period: period,
        currency: 'usd',
        total_points: points.length,
        begin_at: data.data?.attributes?.begin_at,
        end_at: data.data?.attributes?.end_at
      }
    };

    return NextResponse.json(chartData);
  } catch (error: any) {
    console.error('Chart API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}