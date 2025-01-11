import { Account } from '../types';

export const ACCOUNTS: Record<string, Account> = {
  spot: {
    name: 'SPOT',
    API_KEY: process.env.SPOT_TRADING_BOT_VALR_API_KEY || '',
    API_SECRET: process.env.SPOT_TRADING_BOT_VALR_API_SECRET || '',
  },
  earn: {
    name: 'EARN',
    API_KEY: process.env.EARN_BOT_VALR_API_KEY || '',
    API_SECRET: process.env.EARN_BOT_VALR_API_SECRET || '',
  },
};
