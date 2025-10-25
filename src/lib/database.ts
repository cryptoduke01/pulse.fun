import { db } from './db';

export class DatabaseService {
  // User operations
  static async createOrUpdateUser(walletAddress: string, ensName?: string) {
    return await db.user.upsert({
      where: { walletAddress },
      update: { 
        ensName,
        updatedAt: new Date(),
      },
      create: {
        walletAddress,
        ensName,
      },
    });
  }

  static async getUser(walletAddress: string) {
    return await db.user.findUnique({
      where: { walletAddress },
      include: {
        following: {
          include: {
            following: true,
          },
        },
        followers: {
          include: {
            follower: true,
          },
        },
      },
    });
  }

  // Follow operations
  static async followWallet(followerAddress: string, followingAddress: string) {
    // Ensure both users exist
    await this.createOrUpdateUser(followerAddress);
    await this.createOrUpdateUser(followingAddress);

    // Get user IDs
    const follower = await db.user.findUnique({ where: { walletAddress: followerAddress } });
    const following = await db.user.findUnique({ where: { walletAddress: followingAddress } });

    if (!follower || !following) {
      throw new Error('User not found');
    }

    return await db.follow.create({
      data: {
        followerId: follower.id,
        followingId: following.id,
      },
    });
  }

  static async unfollowWallet(followerAddress: string, followingAddress: string) {
    const follower = await db.user.findUnique({ where: { walletAddress: followerAddress } });
    const following = await db.user.findUnique({ where: { walletAddress: followingAddress } });

    if (!follower || !following) {
      throw new Error('User not found');
    }

    return await db.follow.deleteMany({
      where: {
        followerId: follower.id,
        followingId: following.id,
      },
    });
  }

  static async getFollowing(walletAddress: string) {
    const user = await db.user.findUnique({
      where: { walletAddress },
      include: {
        following: {
          include: {
            following: true,
          },
        },
      },
    });

    return user?.following.map(follow => follow.following.walletAddress) || [];
  }

  static async getFollowers(walletAddress: string) {
    const user = await db.user.findUnique({
      where: { walletAddress },
      include: {
        followers: {
          include: {
            follower: true,
          },
        },
      },
    });

    return user?.followers.map(follow => follow.follower.walletAddress) || [];
  }

  static async isFollowing(followerAddress: string, followingAddress: string) {
    const follower = await db.user.findUnique({ where: { walletAddress: followerAddress } });
    const following = await db.user.findUnique({ where: { walletAddress: followingAddress } });

    if (!follower || !following) {
      return false;
    }

    const follow = await db.follow.findFirst({
      where: {
        followerId: follower.id,
        followingId: following.id,
      },
    });

    return !!follow;
  }

  // Wallet profile operations
  static async updateWalletProfile(data: {
    walletAddress: string;
    ensName?: string;
    totalValue: number;
    valueChange24h: number;
    totalTrades: number;
    activeDays: number;
    winRate: number;
    avgHoldTime: number;
    riskScore: number;
    tradingStyle: string;
    confidence: number;
    traits: string[];
  }) {
    return await db.walletProfile.upsert({
      where: { walletAddress: data.walletAddress },
      update: {
        ...data,
        lastUpdated: new Date(),
        updatedAt: new Date(),
      },
      create: {
        ...data,
        lastUpdated: new Date(),
      },
    });
  }

  static async getWalletProfile(walletAddress: string) {
    return await db.walletProfile.findUnique({
      where: { walletAddress },
    });
  }

  static async getTrendingWallets(limit: number = 10, period: string = 'weekly') {
    return await db.trendingWallet.findMany({
      where: { period },
      orderBy: { rank: 'asc' },
      take: limit,
    });
  }

  // Activity operations
  static async logActivity(walletAddress: string, type: string, data?: any) {
    return await db.activity.create({
      data: {
        walletAddress,
        type,
        data,
      },
    });
  }

  static async getActivityFeed(walletAddress: string, limit: number = 50) {
    // Get user's following list
    const following = await this.getFollowing(walletAddress);
    
    // Get activities from followed wallets
    return await db.activity.findMany({
      where: {
        walletAddress: {
          in: following,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
