# VALR Trading Bot 🤖

A hobby project for automated trading on the VALR cryptocurrency exchange. Built with TypeScript and ❤️

> **Note**: This is a personal project and should not be used for serious trading without thorough testing. Use at your own risk!

## Features

- 📈 Spot Trading Bot
- 💰 Earn Bot (for automatic reinvesting of lending and staking profits)
- 🖥️ Simple CLI interface
- 📝 Detailed logging
- ⚡ Real-time WebSocket connection

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm
- A VALR account with API keys (Sign up with referral code [VAVCTUC7](https://www.valr.com/invite/VAVCTUC7) to support this project and get your own sweet juicy rebates!)

### Installation

1. Clone the repo
2. Install dependencies: `npm install`
3. Create a `.env` file with your VALR API keys (use `.env.example` as a reference)
4. Run the bot: `npm run start`

## CLI Commands

By default, the bots will start automatically. Unless you specify otherwise by updating the [bot configuration file](src/config/botConfig.ts).

- `start <bot_type>` - Start specified bot (`spot`|`earn`)
- `stop <bot_type>` - Stop specified bot (`spot`|`earn`)
- `status` - Show all bot statuses
- `help` - Show help message
- `exit` - Stop all bots and exit

## Bot Types

- `spot` - Spot trading bot
- `earn` - Earn bot

### Spot Trading Bot

The spot trading bot is a simple market maker bot that trades on the spot market.

It works by listening for new orders on the market and placing a counter-order to buy at a slightly higher price or sell at a slightly lower price depending on your configured profit margin.

### Earn Bot

The earn bot is a bot that automatically reinvests your earnings from staking and lending.

It currently only works if you have existing positions in the staking or lending products.
