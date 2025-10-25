import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../src/lib/database';

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

    const activities = await DatabaseService.getActivityFeed(walletAddress, limit);

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
