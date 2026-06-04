require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import services
const TelegramService = require('./services/telegramService');
const WhatsappService = require('./services/whatsappService');
const DatabaseService = require('./services/databaseService');
const Logger = require('./utils/logger');

// Import routes
const apiRoutes = require('./routes/api');
const healthRoutes = require('./routes/health');

// Initialize app
const app = express();
const logger = new Logger();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);
app.use('/health', healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize services
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const startServer = async () => {
  try {
    // Connect to database
    logger.info('Connecting to MongoDB...');
    await DatabaseService.connect();
    logger.info('MongoDB connected successfully');

    // Initialize Telegram service
    logger.info('Initializing Telegram service...');
    TelegramService.initialize();

    // Initialize WhatsApp service
    logger.info('Initializing WhatsApp service...');
    await WhatsappService.initialize();

    // Start Express server
    app.listen(PORT, HOST, () => {
      logger.info(`🚀 Server running at http://${HOST}:${PORT}`);
      logger.info(`📱 WhatsApp Bot Control via Telegram started`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  try {
    await DatabaseService.disconnect();
    await WhatsappService.destroy();
    TelegramService.stop();
    process.exit(0);
  } catch (error) {
    logger.error(`Error during shutdown: ${error.message}`);
    process.exit(1);
  }
});

// Start the server
startServer();

module.exports = app;