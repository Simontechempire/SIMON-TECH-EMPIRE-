const mongoose = require('mongoose');
const Logger = require('../utils/logger');

const logger = new Logger();

const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/simon-bot',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    logger.info('MongoDB connection established');
    return mongoose.connection;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error(`Error disconnecting from MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = {
  dbConfig,
  connectDB,
  disconnectDB
};