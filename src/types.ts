export interface Bot {
  start(): Promise<void>;
  stop(): Promise<void>;
}

/**
 * Represents a trading pair with relevant properties.
 */
export interface TradingPair {
  /** The symbol of the trading pair (e.g. `"BTCZAR"`) */
  symbol: string;

  /**
   * The profit margin percentage as a decimal (e.g. `0.01` for `1%`)
   *
   * Used to calculate buy/sell prices:
   * - Buy orders are placed at: `market_price * (1 - profitMargin)`
   * - Sell orders are placed at: `market_price * (1 + profitMargin)`
   */
  profitMargin: number;

  /** Number of decimal places allowed for order quantity */
  quantityPrecision: number;

  /** Number of decimal places allowed for order price */
  pricePrecision: number;

  /** Whether this pair is enabled for trading */
  enabled: boolean;
}

/**
 * Represents a VALR account with API keys and other relevant information.
 */
export interface Account {
  /** The name of the account, used as a prefix in logging messages */
  name: string;
  /** The API key for the account */
  API_KEY: string;
  /** The API secret for the account */
  API_SECRET: string;
}
