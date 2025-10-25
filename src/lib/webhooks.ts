import { zerionServerAPI } from './zerion-server';

export class WebhookService {
  private static webhookUrl = process.env.NEXT_PUBLIC_APP_URL + '/api/webhooks/zerion';

  static async registerWebhooks() {
    try {
      console.log('🔗 Registering Zerion webhooks...');

      // Register portfolio update webhook
      await this.registerWebhook('wallet.portfolio.updated', [
        'portfolio_value_changed',
        'portfolio_composition_changed',
      ]);

      // Register transaction webhook
      await this.registerWebhook('wallet.transaction.created', [
        'transaction_created',
        'swap_executed',
        'transfer_completed',
      ]);

      // Register activity webhook
      await this.registerWebhook('wallet.activity.detected', [
        'new_activity',
        'significant_movement',
      ]);

      console.log('✅ Webhooks registered successfully');
    } catch (error) {
      console.error('❌ Failed to register webhooks:', error);
    }
  }

  private static async registerWebhook(eventType: string, filters: string[]) {
    try {
      // This would be the actual Zerion webhook registration
      // For now, we'll simulate the registration
      console.log(`📡 Registering webhook for ${eventType} with filters:`, filters);
      
      // In production, this would make an API call to Zerion to register the webhook
      // await zerionServerAPI.registerWebhook({
      //   event_type: eventType,
      //   webhook_url: this.webhookUrl,
      //   filters: filters,
      //   secret: process.env.ZERION_WEBHOOK_SECRET,
      // });

      return true;
    } catch (error) {
      console.error(`Failed to register webhook for ${eventType}:`, error);
      return false;
    }
  }

  static async testWebhook() {
    try {
      // Test webhook with sample data
      const testData = {
        type: 'wallet.portfolio.updated',
        data: {
          wallet_address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
          portfolio: {
            total_value: 1500000,
            value_change_24h: 8.5,
            total_trades: 1300,
            active_days: 95,
            win_rate: 72.3,
            avg_hold_time: 2.1,
            risk_score: 78,
            trading_style: 'degen',
            confidence: 94,
            traits: ['High frequency trading', 'Short-term holds'],
          },
        },
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (response.ok) {
        console.log('✅ Webhook test successful');
        return true;
      } else {
        console.error('❌ Webhook test failed:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Webhook test error:', error);
      return false;
    }
  }
}
