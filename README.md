# VALR Trading Bot 🤖

A hobby project for automated trading on the VALR cryptocurrency exchange. Built with TypeScript and ❤️

> **Note**: This is a personal project and should not be used for serious trading without thorough testing. Use at your own risk!

## Features

- 📈 Spot Trading Bot
- 💰 Lending Bot (coming soon)
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

- `start <bot_type>` - Start specified bot (`spot`|`lending`)
- `stop <bot_type>` - Stop specified bot (`spot`|`lending`)
- `status` - Show all bot statuses
- `help` - Show help message
- `exit` - Stop all bots and exit
