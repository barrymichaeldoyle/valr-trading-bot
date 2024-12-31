import { Account } from "../types";

export const ACCOUNTS: Record<string, Account> = {
 spot: {
    name: "SPOT",
    API_KEY: process.env.SPOT_TRADING_BOT_VALR_API_KEY || "",
    API_SECRET: process.env.SPOT_TRADING_BOT_VALR_API_SECRET || "",
  },
  lending: {
    name: "LENDING",
    API_KEY: process.env.LENDING_BOT_VALR_API_KEY || "",
    API_SECRET: process.env.LENDING_BOT_VALR_API_SECRET || "",
  }
};
