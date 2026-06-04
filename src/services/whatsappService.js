const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Logger = require('../utils/logger');

const logger = new Logger();

class WhatsappService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      const sessionName = process.env.WHATSAPP_SESSION_NAME || 'simon-bot';
      
      this.client = new Client({
        authStrategy: new LocalAuth({ clientId: sessionName }),
        headless: process.env.WHATSAPP_HEADLESS !== 'false',
        puppeteer: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      // Event listeners
      this.client.on('qr', (qr) => {
        logger.info('QR Code received. Scan with your WhatsApp app:');
        qrcode.generate(qr, { small: true });
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        logger.info('✅ WhatsApp client is ready');
      });

      this.client.on('authenticated', () => {
        logger.info('✅ WhatsApp authentication successful');
      });

      this.client.on('auth_failure', () => {
        logger.error('❌ WhatsApp authentication failed');
        this.isConnected = false;
      });

      this.client.on('disconnected', (reason) => {
        logger.warn(`WhatsApp disconnected: ${reason}`);
        this.isConnected = false;
      });

      this.client.on('message', async (msg) => {
        logger.info(`Message from ${msg.from}: ${msg.body}`);
        // Handle incoming messages
      });

      await this.client.initialize();
      this.isInitialized = true;

      logger.info('WhatsApp service initialized successfully');
    } catch (error) {
      logger.error(`Failed to initialize WhatsApp service: ${error.message}`);
      throw error;
    }
  }

  async sendMessage(number, message) {
    try {
      if (!this.isConnected) {
        throw new Error('WhatsApp client is not connected');
      }

      // Format number to WhatsApp format
      const formattedNumber = number.includes('@') ? number : `${number}@c.us`;
      
      const response = await this.client.sendMessage(formattedNumber, message);
      logger.info(`Message sent to ${number}`);
      
      return {
        success: true,
        messageId: response.id.id,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Failed to send WhatsApp message: ${error.message}`);
      throw error;
    }
  }

  async getStatus() {
    return {
      isConnected: this.isConnected,
      isInitialized: this.isInitialized,
      state: this.client?.info?.status || 'unknown'
    };
  }

  async destroy() {
    try {
      if (this.client) {
        await this.client.destroy();
        this.isConnected = false;
        logger.info('WhatsApp service destroyed');
      }
    } catch (error) {
      logger.error(`Error destroying WhatsApp service: ${error.message}`);
    }
  }
}

module.exports = new WhatsappService();