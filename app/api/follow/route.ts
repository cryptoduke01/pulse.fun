import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for development
const followData = new Map<string, string[]>();

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, targetAddress } = await request.json();

    if (!walletAddress || !targetAddress) {
      return NextResponse.json(
        { error: 'Missing walletAddress or targetAddress' },
        { status: 400 }
      );
    }

    // Get current following list
    const currentFollowing = followData.get(walletAddress) || [];
    
    // Add target to following list if not already following
    if (!currentFollowing.includes(targetAddress)) {
      currentFollowing.push(targetAddress);
      followData.set(walletAddress, currentFollowing);
    }

    return NextResponse.json({
      success: true,
      following: currentFollowing,
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

                                                                                                                                                                                                                                                                          // Get current following list
    const currentFollowing = followData.get(walletAddress) || [];
    
    // Remove target from following list
    const updatedFollowing = currentFollowing.filter(addr => addr !== targetAddress);
    followData.set(walletAddress, updatedFollowing);

    return NextResponse.json({
      success: true,
      following: updatedFollowing,
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

    const following = followData.get(walletAddress) || [];

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
