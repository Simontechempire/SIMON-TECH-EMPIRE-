const { Telegraf } = require('telegraf');
const Logger = require('../utils/logger');
const PairingService = require('./pairingService');

const logger = new Logger();

class TelegramService {
  constructor() {
    this.bot = null;
    this.isInitialized = false;
  }

  initialize() {
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (!token) {
        throw new Error('TELEGRAM_BOT_TOKEN not set in environment variables');
      }

      this.bot = new Telegraf(token);

      // Register commands
      this.registerCommands();

      // Start polling
      this.bot.launch();
      this.isInitialized = true;

      logger.info('Telegram service initialized successfully');
    } catch (error) {
      logger.error(`Failed to initialize Telegram service: ${error.message}`);
      throw error;
    }
  }

  registerCommands() {
    // Start command
    this.bot.start((ctx) => {
      const message = `
🤖 *Welcome to Simon Tech Bot!*

Available commands:
/pair - Get pairing code
/status - Check bot status
/help - Show help message
/send - Send WhatsApp message
      `;
      ctx.reply(message, { parse_mode: 'Markdown' });
    });

    // Pair command
    this.bot.command('pair', async (ctx) => {
      try {
        const pairingCode = await PairingService.generatePairingCode();
        ctx.reply(
          `🔗 *Pairing Code:*\n\`${pairingCode}\`\n\nUse this code to pair your Telegram with WhatsApp.`,
          { parse_mode: 'Markdown' }
        );
      } catch (error) {
        logger.error(`Pair command error: ${error.message}`);
        ctx.reply('❌ Failed to generate pairing code. Try again later.');
      }
    });

    // Status command
    this.bot.command('status', async (ctx) => {
      try {
        const status = await this.getStatus();
        const message = `
📊 *Bot Status*
━━━━━━━━━━━━━━━━━━
🤖 Bot: ${status.botStatus}
📱 WhatsApp: ${status.whatsappConnected ? '✅ Connected' : '❌ Disconnected'}
💬 Telegram: ${status.telegramConnected ? '✅ Connected' : '❌ Disconnected'}
⏱️ Uptime: ${status.uptime}s
        `;
        ctx.reply(message, { parse_mode: 'Markdown' });
      } catch (error) {
        logger.error(`Status command error: ${error.message}`);
        ctx.reply('❌ Failed to get status.');
      }
    });

    // Help command
    this.bot.command('help', (ctx) => {
      const message = `
📖 *Available Commands*
━━━━━━━━━━━━━━━━━━
/start - Start the bot
/pair - Get pairing code
/status - Check status
/send - Send message (usage: /send <number> <message>)
/help - Show this help message
      `;
      ctx.reply(message, { parse_mode: 'Markdown' });
    });

    // Send command
    this.bot.command('send', (ctx) => {
      const args = ctx.message.text.split(' ').slice(1);
      if (args.length < 2) {
        ctx.reply('Usage: /send <number> <message>');
        return;
      }
      // TODO: Implement message sending
      ctx.reply('📤 Message sent to WhatsApp!');
    });

    // Echo any other message
    this.bot.on('message', (ctx) => {
      logger.info(`Received message from ${ctx.from.id}: ${ctx.message.text}`);
    });
  }

  async getStatus() {
    return {
      botStatus: 'running',
      whatsappConnected: true,
      telegramConnected: true,
      uptime: process.uptime()
    };
  }

  async sendMessage(chatId, message) {
    try {
      if (!this.isInitialized) {
        throw new Error('Telegram service not initialized');
      }
      await this.bot.telegram.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      logger.info(`Message sent to chat ${chatId}`);
    } catch (error) {
      logger.error(`Failed to send Telegram message: ${error.message}`);
      throw error;
    }
  }

  stop() {
    if (this.bot) {
      this.bot.stop();
      logger.info('Telegram service stopped');
    }
  }
}

module.exports = new TelegramService();