import { ValrService } from '../services/ValrService';
import type { Account, Bot } from '../types';
import { logger } from '../utils/logger';

export class EarnBot implements Bot {
  private running: boolean = false;
  private valrService: ValrService;

  // Define supported currencies
  private static STAKEABLE_CURRENCIES = ['AVAX', 'SOL', 'TRX'];
  private static LENDABLE_CURRENCIES = ['ZAR', 'BTC', 'ETH', 'USDT', 'USDC'];

  constructor(account: Account) {
    this.valrService = new ValrService(account);

    // Listen for account update events
    this.valrService.on('account', (update) => {
      if (this.running) {
        this.handleAccountEvent(update);
      }
    });
  }

  async start(): Promise<void> {
    if (this.running) {
      logger.bot('EARN', 'Bot is already running');
      return;
    }

    logger.bot('EARN', 'Starting...');
    await this.valrService.connect();
    this.running = true;
  }

  async stop(): Promise<void> {
    if (!this.running) {
      logger.bot('EARN', 'Bot is not running');
      return;
    }

    logger.bot('EARN', 'Stopping...');
    this.running = false;
    this.valrService.removeAllListeners('account');
    await this.valrService.disconnect();
  }

  private async handleAccountEvent(update: any): Promise<void> {
    const { currency, available, transactionType } = update;
    console.log(update);

    // Only process new deposits or earned rewards
    if (!['DEPOSIT', 'REWARD', 'INTEREST'].includes(transactionType)) {
      return;
    }

    try {
      if (EarnBot.STAKEABLE_CURRENCIES.includes(currency)) {
        await this.handleStaking(currency, available);
      } else if (EarnBot.LENDABLE_CURRENCIES.includes(currency)) {
        await this.handleLending(currency, available);
      } else {
        logger.bot('EARN', `Currency ${currency} not supported for earn products`);
      }
    } catch (error) {
      logger.error(
        `Error processing ${currency}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async handleStaking(currency: string, amount: string): Promise<void> {
    logger.bot('EARN', `Processing staking for ${amount} ${currency}`);
    // TODO: Implement staking logic using ValrService
    // await this.valrService.stakeAsset(currency, amount);
  }

  private async handleLending(currency: string, amount: string): Promise<void> {
    logger.bot('EARN', `Processing lending for ${amount} ${currency}`);
    // TODO: Implement lending logic using ValrService
    // await this.valrService.lendAsset(currency, amount);
  }

  public isRunning(): boolean {
    return this.running;
  }
}
