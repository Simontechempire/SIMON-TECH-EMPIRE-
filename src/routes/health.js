const express = require('express');
const router = express.Router();

// GET /health - Health check endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GET /health/ping - Simple ping endpoint
router.get('/ping', (req, res) => {
  res.json({ pong: true });
});

module.exports = router;