import * as dotenv from 'dotenv';
// Load env variables before any other imports
dotenv.config();

import chalk from 'chalk';

import { EarnBot } from './bots/EarnBot';
import { SpotTradingBot } from './bots/SpotTradingBot';
import { ACCOUNTS } from './config/accounts';
import { BOT_CONFIG } from './config/botConfig';
import { logger, logHelp } from './utils/logger';

interface BotManager {
  spot?: SpotTradingBot;
  earn?: EarnBot;
  // Add other bot types here as we create them
}

async function main() {
  const bots: BotManager = {};

  // Auto-start configured bots
  async function startConfiguredBots() {
    logger.system('Starting configured bots...');

    if (BOT_CONFIG.autoStart.spot) {
      logger.system('Auto-starting spot trading bot...');
      bots.spot = new SpotTradingBot(ACCOUNTS.spot);
      await bots.spot.start();
      logger.success('Spot trading bot auto-started');
    }

    // Add other bot types here as we create them
  }

  // Update error handlers
  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (data) => {
    const [command, botType] = data.toString().trim().toLowerCase().split(' ');

    switch (command) {
      case 'start':
        if (botType === 'spot') {
          if (!bots.spot) {
            bots.spot = new SpotTradingBot(ACCOUNTS.spot);
            await bots.spot.start();
            logger.bot('SPOT', 'Starting...');
          } else {
            logger.bot('SPOT', 'Already Running!');
          }
        }
        break;

      case 'stop':
        if (botType === 'spot' && bots.spot) {
          await bots.spot.stop();
          delete bots.spot;
          logger.success('Spot trading bot stopped');
        } else {
          logger.error(`No ${botType} bot is running`);
        }
        break;

      case 'status':
        logger.system('\nBot Status:');
        logger.system(`Spot Trading: ${bots.spot ? chalk.green('RUNNING') : chalk.red('STOPPED')}`);
        if (bots.spot) {
          logger.system(`Account: ${ACCOUNTS.spot.name}`);
        }
        logger.system('');
        break;

      case 'help':
        logger.help();
        break;

      case 'exit':
        await cleanup();
        process.exit(0);
    }
  });

  async function cleanup() {
    logger.system('\nStopping all bots...');
    if (bots.spot) {
      await bots.spot.stop();
      logger.success('Stopped spot trading bot');
    }
  }

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
  });

  // Start configured bots before setting up CLI
  await startConfiguredBots();

  logger.system('\nBot manager started.');
  logger.help(logHelp());
}

// Update the main execution error handler
main().catch((error) => {
  logger.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
