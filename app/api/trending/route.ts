import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../src/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const period = searchParams.get('period') || 'weekly';

    const trendingWallets = await DatabaseService.getTrendingWallets(limit, period);

    return NextResponse.json({
      trending: trendingWallets,
    });
  } catch (error) {
    console.error('Trending API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}