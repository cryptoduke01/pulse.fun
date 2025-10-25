import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const users = [
    {
      walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      ensName: 'vitalik.eth',
    },
    {
      walletAddress: '0x1234567890123456789012345678901234567890',
      ensName: 'cryptowhale.eth',
    },
    {
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      ensName: 'defi_master.eth',
    },
    {
      walletAddress: '0x9876543210987654321098765432109876543210',
      ensName: 'nft_collector.eth',
    },
    {
      walletAddress: '0x5555555555555555555555555555555555555555',
      ensName: 'day_trader.eth',
    },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { walletAddress: userData.walletAddress },
      update: userData,
      create: userData,
    });
  }

  // Create sample wallet profiles
  const profiles = [
    {
      walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      ensName: 'vitalik.eth',
      totalValue: 1250000,
      valueChange24h: 5.2,
      totalTrades: 1247,
      activeDays: 89,
      winRate: 68.5,
      avgHoldTime: 2.3,
      riskScore: 75,
      tradingStyle: 'degen',
      confidence: 92,
      traits: ['High frequency trading', 'Short-term holds', 'High risk tolerance'],
    },
    {
      walletAddress: '0x1234567890123456789012345678901234567890',
      ensName: 'cryptowhale.eth',
      totalValue: 2500000,
      valueChange24h: -2.1,
      totalTrades: 89,
      activeDays: 156,
      winRate: 82.1,
      avgHoldTime: 45.2,
      riskScore: 25,
      tradingStyle: 'holder',
      confidence: 88,
      traits: ['Long-term holding', 'Conservative approach', 'Diamond hands'],
    },
    {
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      ensName: 'defi_master.eth',
      totalValue: 850000,
      valueChange24h: 12.8,
      totalTrades: 456,
      activeDays: 67,
      winRate: 74.2,
      avgHoldTime: 8.7,
      riskScore: 45,
      tradingStyle: 'yield farmer',
      confidence: 85,
      traits: ['Yield farming', 'DeFi protocols', 'Risk management'],
    },
  ];

  for (const profileData of profiles) {
    await prisma.walletProfile.upsert({
      where: { walletAddress: profileData.walletAddress },
      update: profileData,
      create: profileData,
    });
  }

  // Create sample trending wallets
  const trending = [
    {
      walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      rank: 1,
      score: 95.5,
      period: 'weekly',
    },
    {
      walletAddress: '0x1234567890123456789012345678901234567890',
      rank: 2,
      score: 88.2,
      period: 'weekly',
    },
    {
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      rank: 3,
      score: 82.1,
      period: 'weekly',
    },
  ];

  for (const trendingData of trending) {
    await prisma.trendingWallet.upsert({
      where: { 
        walletAddress_period: {
          walletAddress: trendingData.walletAddress,
          period: trendingData.period,
        }
      },
      update: trendingData,
      create: trendingData,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
