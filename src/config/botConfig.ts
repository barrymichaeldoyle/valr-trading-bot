export interface BotConfig {
  autoStart: {
    spot: boolean;
    // Add other bot types here as we create them
    // lending: boolean;
  };
}

export const BOT_CONFIG: BotConfig = {
  autoStart: {
    spot: true,  // Set to true to auto-start the spot trading bot
  }
}; 