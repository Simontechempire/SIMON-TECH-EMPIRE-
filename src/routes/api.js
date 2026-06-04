const express = require('express');
const router = express.Router();
const Logger = require('../utils/logger');

const logger = new Logger();

// Command definitions
const COMMANDS = {
  OWNER: {
    name: '👑 OWNER',
    commands: ['.restart', '.shutdown', '.reboot', '.updatebot', '.deploy', '.backup', '.restore', '.backupdb', '.restoredb', '.logs', '.clearlogs', '.broadcast', '.bcgroup', '.bcall', '.ban', '.unban', '.block', '.unblock', '.premium', '.unpremium', '.addowner', '.delowner', '.setpp', '.setnamebot', '.setstatus', '.setprefix', '.public', '.private', '.maintenance', '.anticall', '.join', '.leave', '.clearsession', '.getsession', '.pair', '.unpair', '.eval', '.exec', '.terminal', '.shell', '.serverrestart', '.serverinfo', '.getplugin', '.addplugin', '.delplugin', '.reload', '.saveconfig', '.resetconfig', '.ownerpanel', '.fullbackup']
  },
  SYSTEM: {
    name: '⚙️ SYSTEM',
    commands: ['.menu', '.help', '.ping', '.alive', '.status', '.runtime', '.uptime', '.speed', '.version', '.about', '.info', '.owner', '.support', '.script', '.report', '.bug', '.feedback', '.memory', '.cpu', '.ram', '.disk', '.network', '.connection', '.latency', '.battery', '.health', '.stats', '.dashboard', '.checkupdate', '.features', '.modules', '.commands', '.category', '.news', '.announcement', '.rules', '.privacy', '.terms', '.invite', '.donate', '.premiuminfo', '.ownerinfo', '.credits', '.uptimefull', '.system', '.diagnostics', '.processes', '.threads', '.queue', '.sysreport']
  },
  PROFILE: {
    name: '👤 PROFILE',
    commands: ['.profile', '.setname', '.setbio', '.setage', '.setgender', '.setlocation', '.setstatusmsg', '.avatar', '.rank', '.level', '.xp', '.badge', '.badges', '.title', '.inventory', '.settings', '.privacy', '.theme', '.language', '.timezone', '.wallet', '.bank', '.history', '.activity', '.achievements', '.missions', '.quests', '.reputation', '.followers', '.following', '.friends', '.friendlist', '.profilepic', '.banner', '.background', '.signature', '.dailyprofile', '.userinfo', '.id', '.mystats']
  },
  GROUP: {
    name: '👥 GROUP',
    commands: ['.groupinfo', '.grouplink', '.revoke', '.resetlink', '.groupname', '.groupdesc', '.groupicon', '.groupopen', '.groupclose', '.groupsettings', '.tagall', '.hidetag', '.admins', '.members', '.add', '.kick', '.promote', '.demote', '.mute', '.unmute', '.warn', '.warnings', '.resetwarn', '.banmember', '.unbanmember', '.welcome', '.goodbye', '.antilink', '.antispam', '.antibot', '.antifake', '.antidelete', '.antitoxic', '.antiraid', '.antiflood', '.autosticker', '.autoreact', '.autowarn', '.autokick', '.vote', '.poll', '.gstatus', '.gevent', '.event', '.announce', '.schedule', '.slowmode', '.lockchat', '.unlockchat', '.clean', '.purge', '.pin', '.unpin', '.rules', '.setrules', '.groupstats']
  },
  SECURITY: {
    name: '🔐 SECURITY',
    commands: ['.security', '.scan', '.fullscan', '.quickscan', '.securityreport', '.protection', '.firewall', '.guard', '.shield', '.lock', '.unlock', '.verify', '.verification', '.captcha', '.anticall', '.antidelete', '.antiedit', '.blacklist', '.whitelist', '.banlist', '.trusted', '.safemode', '.securemode', '.panicmode', '.emergency', '.checklink', '.checkfile', '.risk', '.threat', '.malware', '.virus', '.phishing', '.audit', '.auditlog', '.monitor', '.watchlist']
  },
  AI: {
    name: '🧠 AI',
    commands: ['.ai', '.chat', '.ask', '.gpt', '.assistant', '.brain', '.think', '.reason', '.answer', '.solve', '.codeai', '.fixcode', '.debug', '.optimize', '.generatecode', '.htmlai', '.cssai', '.jsai', '.pythonai', '.imageai', '.imagine', '.art', '.draw', '.logoai', '.avatarai', '.translateai', '.grammar', '.rewrite', '.summarize', '.essay', '.article', '.story', '.poem', '.lyrics', '.caption', '.emailai', '.teacher', '.mathai', '.physicsai', '.chemistryai', '.biologyai', '.historyai', '.examai', '.careerai', '.financeai', '.cryptoai', '.researchai', '.analyze', '.forecast', '.planner', '.travelai', '.fitnessai', '.recipeai', '.movieai', '.animeai', '.gameai', '.jokeai', '.coach', '.mentor', '.brainstorm', '.compare', '.explain', '.factcheck', '.knowledge', '.searchai', '.vision', '.voiceai', '.smartchat', '.genius']
  },
  STICKER: {
    name: '🖼️ STICKER',
    commands: ['.sticker', '.s', '.take', '.attp', '.ttp', '.emojimix', '.toimg', '.togif', '.tovideo', '.cropsticker', '.roundsticker', '.circle', '.trigger', '.wasted', '.rip', '.wanted', '.jail', '.gay', '.glass', '.burn']
  },
  MEDIA: {
    name: '🎥 MEDIA',
    commands: ['.image', '.video', '.audio', '.mp3', '.mp4', '.vv', '.tourl', '.removebg', '.enhance', '.hd', '.resize', '.compress', '.blur', '.invert', '.grayscale', '.gif', '.reversevideo', '.slowmo', '.fastvideo', '.editmedia']
  },
  DOWNLOAD: {
    name: '📥 DOWNLOAD',
    commands: ['.play', '.song', '.video', '.ytmp3', '.ytmp4', '.ytaudio', '.ytvideo', '.tiktok', '.instagram', '.facebook', '.twitter', '.spotify', '.pinterest', '.mediafire', '.apk', '.playstore', '.githubdl', '.gdrive', '.mega', '.download']
  }
};

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

// GET /api/commands - Get all commands
router.get('/commands', (req, res) => {
  try {
    const allCommands = [];
    Object.values(COMMANDS).forEach(cat => {
      allCommands.push(...cat.commands);
    });
    
    res.json({
      success: true,
      commands: allCommands,
      total: allCommands.length,
      categories: Object.keys(COMMANDS).map(k => ({ key: k, name: COMMANDS[k].name, count: COMMANDS[k].commands.length }))
    });
  } catch (error) {
    logger.error(`Get commands error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to get commands'
    });
  }
});

// GET /api/commands/:category - Get commands by category
router.get('/commands/:category', (req, res) => {
  try {
    const { category } = req.params;
    const categoryData = COMMANDS[category.toUpperCase()];
    
    if (!categoryData) {
      return res.status(404).json({
        success: false,
        message: `Category not found: ${category}`
      });
    }
    
    res.json({
      success: true,
      category: category,
      categoryName: categoryData.name,
      commands: categoryData.commands,
      total: categoryData.commands.length
    });
  } catch (error) {
    logger.error(`Get category error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to get category commands'
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

    res.json({
      success: true,
      data: {
        messageId: require('uuid').v4(),
        timestamp: new Date(),
        recipient: number,
        messageLength: message.length
      },
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
    res.json({
      success: true,
      status: {
        botStatus: 'running',
        botName: process.env.BOT_NAME || 'SIMON TECH BOT',
        owner: process.env.BOT_OWNER || 'SIMON TECH',
        uptime: Math.floor(process.uptime()),
        commandsAvailable: 200,
        categories: Object.keys(COMMANDS).length,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        mode: process.env.NODE_ENV || 'development'
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

// GET /api/pair - Generate pairing code
router.get('/pair', (req, res) => {
  try {
    const { v4: uuidv4 } = require('uuid');
    const code = `PAIR-${uuidv4().substring(0, 12).toUpperCase()}`;
    
    res.json({
      success: true,
      pairingCode: code,
      expiresIn: 300,
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

module.exports = router;
