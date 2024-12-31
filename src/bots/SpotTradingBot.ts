import { PAIRS } from "../config/pairs";
import { ValrService } from "../services/ValrService";
import type { Account, Bot } from "../types";
import { logger } from "../utils/logger";

export class SpotTradingBot implements Bot {
  private running: boolean = false;
  private valrService: ValrService;

  constructor(account: Account) {
    this.valrService = new ValrService(account);

    this.valrService.on("trade", (trade) => {
      if (this.running) {
        this.handleTradeEvent(trade);
      }
    });
  }

  async start(): Promise<void> {
    if (this.running) {
      logger.bot("SPOT", "Bot is already running");
      return;
    }

    logger.bot("SPOT", "Starting...");
    await this.valrService.connect();
    this.running = true;
  }

  async stop(): Promise<void> {
    if (!this.running) {
      logger.bot("SPOT", "Bot is not running");
      return;
    }

    logger.bot("SPOT", "Stopping...");
    this.running = false;
    this.valrService.removeAllListeners("trade");
    await this.valrService.disconnect();
  }

  private async handleTradeEvent(trade: any): Promise<void> {
    const { price, quantity, side, currencyPair } = trade;

    const pairConfig = PAIRS.find((pair) => pair.symbol === currencyPair);
    if (!pairConfig) {
      logger.error(`Unknown currency pair: ${currencyPair}`);
      return;
    }

    const { profitMargin, quantityPrecision, pricePrecision } = pairConfig;

    const counterSide = side === "buy" ? "sell" : "buy";
    const rawCounterPrice =
      side === "buy"
        ? parseFloat(price) * (1 + profitMargin)
        : parseFloat(price) * (1 - profitMargin);

    logger.trade(
      side.toUpperCase() as "BUY" | "SELL",
      parseFloat(quantity),
      currencyPair,
      parseFloat(price)
    );

    try {
      const result = await this.valrService.placeOrder(
        this.valrService.getAccount(),
        currencyPair,
        counterSide,
        rawCounterPrice.toString(),
        quantity
      );
      logger.success(`Counter order placed successfully for ${currencyPair}`);
    } catch (error) {
      logger.error(
        `Error placing counter order: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  public isRunning(): boolean {
    return this.running;
  }
}
