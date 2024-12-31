export interface Bot {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface TradingPair {
  symbol: string;
  orderAmount: number;
  profitMargin: number;
  quantityPrecision: number;
  pricePrecision: number;
}

export interface Account {
  name: string;
  API_KEY: string;
  API_SECRET: string;
}