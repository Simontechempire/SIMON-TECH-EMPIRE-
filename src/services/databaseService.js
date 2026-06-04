const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/database');
const Logger = require('../utils/logger');

const logger = new Logger();

class DatabaseService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.connection = await connectDB();
      this.isConnected = true;
      logger.info('Database service connected');
    } catch (error) {
      logger.error(`Database connection error: ${error.message}`);
      throw error;
    }
  }

  async disconnect() {
    try {
      await disconnectDB();
      this.isConnected = false;
      logger.info('Database service disconnected');
    } catch (error) {
      logger.error(`Database disconnection error: ${error.message}`);
      throw error;
    }
  }

  getConnection() {
    return this.connection;
  }

  isConnectedToDatabase() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

module.exports = new DatabaseService();