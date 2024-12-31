import chalk from 'chalk';

export function logHelp() {
  console.log(`
Available commands:
- start <bot_type>  : Start specified bot (spot)
- stop <bot_type>   : Stop specified bot (spot)
- status           : Show all bot statuses
- help             : Show this help message
- exit             : Stop all bots and exit
        `);
}

export const logger = {
  system: (...message: any[]) => {
    console.log(chalk.blue.bold(`[SYSTEM] ${message}`));
  },

  help: (...message: any[]) => {
    console.log(chalk.cyan(`${message}`));
  },

  bot: (botName: string, ...message: any[]) => {
    console.log(chalk.green(`[${botName}] ${message}`));
  },

  trade: (action: 'BUY' | 'SELL', amount: number, pair: string, price: number) => {
    const color = action === 'BUY' ? chalk.green : chalk.red;
    console.log(
        chalk.yellow('🔄 Trade Event: ') +
        color.bold(`${action} `) +
        chalk.white(`${amount} ${pair} @ ${price}`)
    );
  },

  error: (...message: any[]) => {
    console.log(chalk.red.bold(`❌ ERROR: ${message}`));
  },

  success: (...message: any[]) => {
    console.log(chalk.green(`✅ ${message}`));
  },

  websocket: (botName: string, ...message: any[]) => {
    console.log(chalk.magenta(`[${botName}] WebSocket: ${message}`));
  }
}; 