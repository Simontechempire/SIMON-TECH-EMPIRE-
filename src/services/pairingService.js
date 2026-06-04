const { v4: uuidv4 } = require('uuid');
const Logger = require('../utils/logger');

const logger = new Logger();

class PairingService {
  constructor() {
    this.pairingCodes = new Map();
  }

  generatePairingCode() {
    const code = `PAIR-${uuidv4().substring(0, 12).toUpperCase()}`;
    const expiryTime = Date.now() + (parseInt(process.env.PAIRING_CODE_EXPIRY) || 300) * 1000;

    this.pairingCodes.set(code, {
      createdAt: Date.now(),
      expiresAt: expiryTime,
      verified: false
    });

    logger.info(`Pairing code generated: ${code}`);

    // Clean up expired codes
    this.cleanupExpiredCodes();

    return code;
  }

  verifyPairingCode(code) {
    const pairingData = this.pairingCodes.get(code);

    if (!pairingData) {
      logger.warn(`Invalid pairing code attempted: ${code}`);
      return false;
    }

    if (Date.now() > pairingData.expiresAt) {
      logger.warn(`Expired pairing code used: ${code}`);
      this.pairingCodes.delete(code);
      return false;
    }

    pairingData.verified = true;
    logger.info(`Pairing code verified: ${code}`);

    return true;
  }

  cleanupExpiredCodes() {
    const now = Date.now();
    let deletedCount = 0;

    for (const [code, data] of this.pairingCodes.entries()) {
      if (now > data.expiresAt) {
        this.pairingCodes.delete(code);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      logger.info(`Cleaned up ${deletedCount} expired pairing codes`);
    }
  }

  getPairingCodeStatus(code) {
    const pairingData = this.pairingCodes.get(code);

    if (!pairingData) {
      return { valid: false, reason: 'Code not found' };
    }

    if (Date.now() > pairingData.expiresAt) {
      return { valid: false, reason: 'Code expired' };
    }

    return {
      valid: true,
      verified: pairingData.verified,
      expiresIn: Math.floor((pairingData.expiresAt - Date.now()) / 1000)
    };
  }
}

module.exports = new PairingService();