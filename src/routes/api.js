const express = require('express');
const router = express.Router();
const PairingService = require('../services/pairingService');
const WhatsappService = require('../services/whatsappService');
const Logger = require('../utils/logger');

const logger = new Logger();

// Middleware to validate API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid API key'
    });
  }

  next();
};

// GET /api/pair - Generate pairing code
router.get('/pair', (req, res) => {
  try {
    const pairingCode = PairingService.generatePairingCode();
    
    res.json({
      success: true,
      pairingCode: pairingCode,
      expiresIn: parseInt(process.env.PAIRING_CODE_EXPIRY) || 300,
      message: 'Pairing code generated successfully'
    });
  } catch (error) {
    logger.error(`Pair endpoint error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to generate pairing code'
    });
  }
});

// GET /api/pair/:code - Check pairing code status
router.get('/pair/:code', (req, res) => {
  try {
    const { code } = req.params;
    const status = PairingService.getPairingCodeStatus(code);

    res.json({
      success: status.valid,
      status: status
    });
  } catch (error) {
    logger.error(`Check pair status error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to check pairing code status'
    });
  }
});

// POST /api/send - Send WhatsApp message
router.post('/send', validateApiKey, async (req, res) => {
  try {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: number, message'
      });
    }

    const result = await WhatsappService.sendMessage(number, message);

    res.json({
      success: true,
      data: result,
      message: 'Message sent successfully'
    });
  } catch (error) {
    logger.error(`Send message error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// GET /api/status - Get bot status
router.get('/status', async (req, res) => {
  try {
    const whatsappStatus = await WhatsappService.getStatus();

    res.json({
      success: true,
      status: {
        botStatus: 'running',
        whatsappConnected: whatsappStatus.isConnected,
        whatsappInitialized: whatsappStatus.isInitialized,
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error(`Status endpoint error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to get status'
    });
  }
});

module.exports = router;