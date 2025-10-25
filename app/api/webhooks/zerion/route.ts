import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../../src/lib/database';
import { zerionServerAPI } from '../../../../src/lib/zerion-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook signature (in production, verify with Zerion's signature)
    // const signature = request.headers.get('x-zerion-signature');
    // if (!verifySignature(body, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const { type, data } = body;

    switch (type) {
      case 'wallet.portfolio.updated':
        await handlePortfolioUpdate(data);
        break;
      
      case 'wallet.transaction.created':
        await handleTransactionCreated(data);
        break;
      
      case 'wallet.activity.detected':
        await handleActivityDetected(data);
        break;
      
      default:
        console.log('Unknown webhook type:', type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePortfolioUpdate(data: any) {
  const { wallet_address, portfolio } = data;
  
  try {
    // Update wallet profile with new portfolio data
    await DatabaseService.updateWalletProfile({
      walletAddress: wallet_address,
      totalValue: portfolio.total_value || 0,
      valueChange24h: portfolio.value_change_24h || 0,
      totalTrades: portfolio.total_trades || 0,
      activeDays: portfolio.active_days || 0,
      winRate: portfolio.win_rate || 0,
      avgHoldTime: portfolio.avg_hold_time || 0,
      riskScore: portfolio.risk_score || 0,
      tradingStyle: portfolio.trading_style || 'unknown',
      confidence: portfolio.confidence || 0,
      traits: portfolio.traits || [],
    });

    // Log activity
    await DatabaseService.logActivity(wallet_address, 'portfolio_updated', {
      totalValue: portfolio.total_value,
      change: portfolio.value_change_24h,
    });

    console.log(`Portfolio updated for ${wallet_address}`);
  } catch (error) {
    console.error('Error updating portfolio:', error);
  }
}

async function handleTransactionCreated(data: any) {
  const { wallet_address, transaction } = data;
  
  try {
    // Log transaction activity
    await DatabaseService.logActivity(wallet_address, 'transaction_created', {
      hash: transaction.hash,
      type: transaction.type,
      value: transaction.value_usd,
      timestamp: transaction.timestamp,
    });

    console.log(`Transaction created for ${wallet_address}: ${transaction.hash}`);
  } catch (error) {
    console.error('Error logging transaction:', error);
  }
}

async function handleActivityDetected(data: any) {
  const { wallet_address, activity } = data;
  
  try {
    // Log general activity
    await DatabaseService.logActivity(wallet_address, 'activity_detected', {
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp,
    });

    console.log(`Activity detected for ${wallet_address}: ${activity.type}`);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// Helper function to verify webhook signature (implement in production)
function verifySignature(body: any, signature: string | null): boolean {
  // Implement signature verification using Zerion's webhook secret
  // This is a placeholder - implement proper signature verification
  return true;
}
