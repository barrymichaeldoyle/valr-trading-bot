export interface BotConfig {
  /** Whether to auto-start the bots on startup */
  autoStart: {
    earn: boolean;
    spot: boolean;
  };
}

export const BOT_CONFIG: BotConfig = {
  autoStart: {
    earn: true,
    spot: true,
  },
};
