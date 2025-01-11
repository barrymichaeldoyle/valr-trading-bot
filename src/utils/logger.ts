import chalk from 'chalk';

const getTimestamp = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
};

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
    console.log(chalk.blue.bold(`[${getTimestamp()}][SYSTEM] ${message}`));
  },

  help: (...message: any[]) => {
    console.log(chalk.cyan(`[${getTimestamp()}] ${message}`));
  },

  bot: (botName: string, ...message: any[]) => {
    console.log(chalk.green(`[${getTimestamp()}][${botName}] ${message}`));
  },

  trade: (action: 'BUY' | 'SELL', amount: number, pair: string, price: number) => {
    const color = action === 'BUY' ? chalk.green : chalk.red;
    console.log(
      chalk.yellow(`[${getTimestamp()}] 🔄 Trade Event: `) +
        color.bold(`${action} `) +
        chalk.white(`${amount} ${pair} @ ${price}`)
    );
  },

  error: (...message: any[]) => {
    console.log(chalk.red.bold(`[${getTimestamp()}] ❌ ERROR: ${message}`));
  },

  success: (...message: any[]) => {
    console.log(chalk.green(`[${getTimestamp()}] ✅ ${message}`));
  },

  websocket: (botName: string, ...message: any[]) => {
    console.log(chalk.magenta(`[${getTimestamp()}][${botName}] WebSocket: ${message}`));
  },

  placedOrder: (action: 'BUY' | 'SELL', amount: number, pair: string, price: number) => {
    const color = action === 'BUY' ? chalk.green : chalk.red;
    console.log(
      chalk.yellow(`[${getTimestamp()}] 📝 Order Placed: `) +
        color.bold(`${action} `) +
        chalk.white(`${amount} ${pair} @ ${price}`)
    );
  },
};
