import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../src/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, targetAddress } = await request.json();

    if (!walletAddress || !targetAddress) {
      return NextResponse.json(
        { error: 'Missing walletAddress or targetAddress' },
        { status: 400 }
      );
    }

    await DatabaseService.followWallet(walletAddress, targetAddress);
    
    // Log activity
    await DatabaseService.logActivity(walletAddress, 'follow', { targetAddress });

    const following = await DatabaseService.getFollowing(walletAddress);

    return NextResponse.json({
      success: true,
      following,
    });
  } catch (error) {
    console.error('Follow API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { walletAddress, targetAddress } = await request.json();

    if (!walletAddress || !targetAddress) {
      return NextResponse.json(
        { error: 'Missing walletAddress or targetAddress' },
        { status: 400 }
      );
    }

    await DatabaseService.unfollowWallet(walletAddress, targetAddress);
    
    // Log activity
    await DatabaseService.logActivity(walletAddress, 'unfollow', { targetAddress });

    const following = await DatabaseService.getFollowing(walletAddress);

    return NextResponse.json({
      success: true,
      following,
    });
  } catch (error) {
    console.error('Unfollow API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Missing walletAddress parameter' },
        { status: 400 }
      );
    }

    const following = await DatabaseService.getFollowing(walletAddress);

    return NextResponse.json({
      following,
    });
  } catch (error) {
    console.error('Get following API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
