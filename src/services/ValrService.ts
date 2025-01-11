import WebSocket from 'ws';
import * as crypto from 'crypto';
import axios from 'axios';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger';

import { Account } from '../types';
import { getAuthHeaders } from '../utils/auth';
import { roundToPrecision } from '../utils/round';
import { PAIRS } from '../config/pairs';
import { getErrorMessage } from '../utils/errorHandling';

export class ValrService extends EventEmitter {
  private ws: WebSocket | null = null;
  private account: Account;
  private isConnected: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(account: Account) {
    super();
    this.account = account;
  }

  public async connect(): Promise<void> {
    if (this.ws || this.isConnected) {
      logger.bot(this.account.name, 'Already connected or connecting');
      return;
    }

    try {
      const headers = getAuthHeaders('/ws/account', this.account);
      this.ws = new WebSocket('wss://api.valr.com/ws/account', { headers });

      this.ws.on('open', () => {
        this.isConnected = true;
        logger.websocket(this.account.name, 'Connected to VALR WebSocket');
        this.startHeartbeat();
        this.emit('connected');
      });

      this.ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        this.emit('message', message);

        if (message.type === 'NEW_ACCOUNT_TRADE') {
          this.emit('trade', message.data);
        }
      });

      this.ws.on('error', (err) => {
        logger.error(`[${this.account.name}] WebSocket error: ${err}`);
        this.emit('error', err);
      });

      this.ws.on('close', () => {
        this.isConnected = false;
        logger.websocket(this.account.name, 'WebSocket connection closed.');
        this.cleanup();
        if (!this.ws) {
          logger.websocket(this.account.name, 'Attempting to reconnect...');
          setTimeout(() => this.connect(), 5000);
        }
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      logger.error(`[${this.account.name}] Connection error: ${errorMessage}`);
      this.isConnected = false;
    }
  }

  public disconnect(): void {
    logger.websocket(this.account.name, 'Disconnecting...');
    this.cleanup();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this.isConnected = false;
  }

  public getAccountName(): string {
    return this.account.name;
  }

  public getAccount(): Account {
    return this.account;
  }

  public isActive(): boolean {
    return this.isConnected;
  }

  public async placeOrder(
    account: Account,
    currencyPair: string,
    side: string,
    price: string,
    quantity: string
  ) {
    const pairConfig = PAIRS.find((pair) => pair.symbol === currencyPair);
    if (!pairConfig) {
      logger.error(`[${account.name}] Unknown currency pair: ${currencyPair}`);
      return;
    }

    const { quantityPrecision, pricePrecision } = pairConfig;

    const roundedPrice = roundToPrecision(parseFloat(price), pricePrecision);
    const roundedQuantity = roundToPrecision(parseFloat(quantity), quantityPrecision);
    const fixedPrice = roundedPrice.toFixed(pricePrecision);
    const fixedQuantity = roundedQuantity.toFixed(quantityPrecision);

    const timestamp = Date.now();
    const path = '/v1/orders/limit';
    const body = JSON.stringify({
      side,
      quantity: fixedQuantity,
      pair: currencyPair,
      price: fixedPrice,
      postOnly: true,
    });

    const signature = crypto
      .createHmac('sha512', account.API_SECRET)
      .update(timestamp.toString())
      .update('POST')
      .update(path)
      .update(body)
      .digest('hex');

    try {
      await axios.post(`https://api.valr.com${path}`, body, {
        headers: {
          'X-VALR-API-KEY': account.API_KEY,
          'X-VALR-SIGNATURE': signature,
          'X-VALR-TIMESTAMP': timestamp.toString(),
          'Content-Type': 'application/json',
        },
      });
      logger.placedOrder(
        side.toUpperCase() as 'BUY' | 'SELL',
        Number(fixedQuantity),
        currencyPair,
        Number(fixedPrice)
      );
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      logger.error(
        `[${account.name}] Error placing ${side} order for ${quantity} ${currencyPair} at price ${price}: ${errorMessage}`
      );
    }
  }

  public async getAvailableFunds(currency: string): Promise<string> {
    const path = `/v1/account/balances`;
    const headers = getAuthHeaders(path, this.account);

    try {
      const response = await axios.get(`https://api.valr.com${path}`, { headers });
      const currencyBalance = response.data.find((balance: any) => balance.currency === currency);
      return currencyBalance?.available || '0';
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      logger.error(`[${this.account.name}] Error getting balance: ${errorMessage}`);
      return '0';
    }
  }

  public async stakeAsset(currency: string, amount: string): Promise<void> {
    // Get available funds for currency
    const availableFunds = await this.getAvailableFunds(currency);
    if (availableFunds < amount) {
      logger.error(`[${this.account.name}] Not enough funds available for staking`);
      return;
    }
  }

  public async lendAsset(currency: string, amount: string): Promise<void> {
    // TODO: Implement lending logic
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.isConnected) {
        try {
          this.ws.send(JSON.stringify({ type: 'PING' }));
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          logger.error(`[${this.account.name}] Error sending heartbeat: ${errorMessage}`);
          this.disconnect();
        }
      }
    }, 30_000);
  }
}
