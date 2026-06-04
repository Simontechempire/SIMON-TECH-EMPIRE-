const Logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

const logger = new Logger();

// Command definitions organized by category
const COMMANDS = {
  OWNER: {
    name: '👑 OWNER',
    commands: [
      '.restart', '.shutdown', '.reboot', '.updatebot', '.deploy',
      '.backup', '.restore', '.backupdb', '.restoredb', '.logs',
      '.clearlogs', '.broadcast', '.bcgroup', '.bcall', '.ban',
      '.unban', '.block', '.unblock', '.premium', '.unpremium',
      '.addowner', '.delowner', '.setpp', '.setnamebot', '.setstatus',
      '.setprefix', '.public', '.private', '.maintenance', '.anticall',
      '.join', '.leave', '.clearsession', '.getsession', '.pair',
      '.unpair', '.eval', '.exec', '.terminal', '.shell', '.serverrestart',
      '.serverinfo', '.getplugin', '.addplugin', '.delplugin', '.reload',
      '.saveconfig', '.resetconfig', '.ownerpanel', '.fullbackup'
    ]
  },
  SYSTEM: {
    name: '⚙️ SYSTEM',
    commands: [
      '.menu', '.help', '.ping', '.alive', '.status', '.runtime',
      '.uptime', '.speed', '.version', '.about', '.info', '.owner',
      '.support', '.script', '.report', '.bug', '.feedback', '.memory',
      '.cpu', '.ram', '.disk', '.network', '.connection', '.latency',
      '.battery', '.health', '.stats', '.dashboard', '.checkupdate',
      '.features', '.modules', '.commands', '.category', '.news',
      '.announcement', '.rules', '.privacy', '.terms', '.invite',
      '.donate', '.premiuminfo', '.ownerinfo', '.credits', '.uptimefull',
      '.system', '.diagnostics', '.processes', '.threads', '.queue', '.sysreport'
    ]
  },
  PROFILE: {
    name: '👤 PROFILE',
    commands: [
      '.profile', '.setname', '.setbio', '.setage', '.setgender',
      '.setlocation', '.setstatusmsg', '.avatar', '.rank', '.level',
      '.xp', '.badge', '.badges', '.title', '.inventory', '.settings',
      '.privacy', '.theme', '.language', '.timezone', '.wallet', '.bank',
      '.history', '.activity', '.achievements', '.missions', '.quests',
      '.reputation', '.followers', '.following', '.friends', '.friendlist',
      '.profilepic', '.banner', '.background', '.signature', '.dailyprofile',
      '.userinfo', '.id', '.mystats'
    ]
  },
  GROUP: {
    name: '👥 GROUP',
    commands: [
      '.groupinfo', '.grouplink', '.revoke', '.resetlink', '.groupname',
      '.groupdesc', '.groupicon', '.groupopen', '.groupclose', '.groupsettings',
      '.tagall', '.hidetag', '.admins', '.members', '.add', '.kick',
      '.promote', '.demote', '.mute', '.unmute', '.warn', '.warnings',
      '.resetwarn', '.banmember', '.unbanmember', '.welcome', '.goodbye',
      '.antilink', '.antispam', '.antibot', '.antifake', '.antidelete',
      '.antitoxic', '.antiraid', '.antiflood', '.autosticker', '.autoreact',
      '.autowarn', '.autokick', '.vote', '.poll', '.gstatus', '.gevent',
      '.event', '.announce', '.schedule', '.slowmode', '.lockchat', '.unlockchat',
      '.clean', '.purge', '.pin', '.unpin', '.rules', '.setrules', '.groupstats'
    ]
  },
  SECURITY: {
    name: '🔐 SECURITY',
    commands: [
      '.security', '.scan', '.fullscan', '.quickscan', '.securityreport',
      '.protection', '.firewall', '.guard', '.shield', '.lock', '.unlock',
      '.verify', '.verification', '.captcha', '.anticall', '.antidelete',
      '.antiedit', '.blacklist', '.whitelist', '.banlist', '.trusted',
      '.safemode', '.securemode', '.panicmode', '.emergency', '.checklink',
      '.checkfile', '.risk', '.threat', '.malware', '.virus', '.phishing',
      '.audit', '.auditlog', '.monitor', '.watchlist'
    ]
  },
  AI: {
    name: '🧠 AI',
    commands: [
      '.ai', '.chat', '.ask', '.gpt', '.assistant', '.brain', '.think',
      '.reason', '.answer', '.solve', '.codeai', '.fixcode', '.debug',
      '.optimize', '.generatecode', '.htmlai', '.cssai', '.jsai',
      '.pythonai', '.imageai', '.imagine', '.art', '.draw', '.logoai',
      '.avatarai', '.translateai', '.grammar', '.rewrite', '.summarize',
      '.essay', '.article', '.story', '.poem', '.lyrics', '.caption',
      '.emailai', '.teacher', '.mathai', '.physicsai', '.chemistryai',
      '.biologyai', '.historyai', '.examai', '.careerai', '.financeai',
      '.cryptoai', '.researchai', '.analyze', '.forecast', '.planner',
      '.travelai', '.fitnessai', '.recipeai', '.movieai', '.animeai',
      '.gameai', '.jokeai', '.coach', '.mentor', '.brainstorm', '.compare',
      '.explain', '.factcheck', '.knowledge', '.searchai', '.vision',
      '.voiceai', '.smartchat', '.genius'
    ]
  },
  STICKER: {
    name: '🖼️ STICKER',
    commands: [
      '.sticker', '.s', '.take', '.attp', '.ttp', '.emojimix',
      '.toimg', '.togif', '.tovideo', '.cropsticker', '.roundsticker',
      '.circle', '.trigger', '.wasted', '.rip', '.wanted', '.jail',
      '.gay', '.glass', '.burn'
    ]
  },
  MEDIA: {
    name: '🎥 MEDIA',
    commands: [
      '.image', '.video', '.audio', '.mp3', '.mp4', '.vv', '.tourl',
      '.removebg', '.enhance', '.hd', '.resize', '.compress', '.blur',
      '.invert', '.grayscale', '.gif', '.reversevideo', '.slowmo',
      '.fastvideo', '.editmedia'
    ]
  },
  VIEWONCE: {
    name: '👁️ VIEW ONCE',
    commands: [
      '.vv', '.readviewonce', '.viewonce', '.antiviewonce', '.saveviewonce',
      '.voimg', '.vovideo', '.viewonceinfo', '.extractvo', '.copyvo'
    ]
  },
  DOWNLOAD: {
    name: '📥 DOWNLOAD',
    commands: [
      '.play', '.song', '.video', '.ytmp3', '.ytmp4', '.ytaudio',
      '.ytvideo', '.tiktok', '.instagram', '.facebook', '.twitter',
      '.spotify', '.pinterest', '.mediafire', '.apk', '.playstore',
      '.githubdl', '.gdrive', '.mega', '.download'
    ]
  },
  UTILITY: {
    name: '🛠️ UTILITY',
    commands: [
      '.weather', '.time', '.date', '.calendar', '.reminder', '.alarm',
      '.timer', '.stopwatch', '.currency', '.convert', '.translate',
      '.dictionary', '.define', '.unit', '.age', '.timezone', '.schedule',
      '.planner', '.notes', '.check'
    ]
  },
  DEVELOPER: {
    name: '🚀 DEVELOPER',
    commands: [
      '.eval', '.exec', '.terminal', '.shell', '.getfile', '.savefile',
      '.delfile', '.listfiles', '.reload', '.restart', '.debug', '.console',
      '.getplugin', '.addplugin', '.delplugin', '.npm', '.gitpull',
      '.gitpush', '.commit', '.developer'
    ]
  },
  CLOUD: {
    name: '☁️ CLOUD',
    commands: [
      '.upload', '.downloadcloud', '.storage', '.backup', '.restore',
      '.cloudinfo', '.sync', '.sharefile', '.drive', '.cloudstats',
      '.bucket', '.cdn', '.deploy', '.host', '.server', '.vps',
      '.database', '.dbbackup', '.dbrestore', '.cloudpanel'
    ]
  },
  EDUCATION: {
    name: '📚 EDUCATION',
    commands: [
      '.math', '.mathsolve', '.physics', '.chemistry', '.biology',
      '.history', '.geography', '.english', '.grammar', '.essay',
      '.quiz', '.exam', '.question', '.answer', '.formula', '.periodictable',
      '.calculator', '.lesson', '.study', '.learn'
    ]
  },
  DESIGN: {
    name: '🎨 DESIGN',
    commands: [
      '.logo', '.banner', '.poster', '.flyer', '.thumbnail', '.wallpaper',
      '.avatar', '.cover', '.neon', '.glow', '.gradient', '.textpro',
      '.3dtext', '.gfx', '.mockup', '.card', '.brand', '.watermark',
      '.design', '.creator'
    ]
  },
  INTERNET: {
    name: '🌐 INTERNET',
    commands: [
      '.ip', '.iplookup', '.dns', '.whois', '.portscan', '.host',
      '.headers', '.website', '.websiteinfo', '.ssl', '.domain',
      '.subdomain', '.traceroute', '.pinghost', '.speedtest', '.internetstatus',
      '.netinfo', '.http', '.https', '.lookup'
    ]
  },
  SEARCH: {
    name: '🔍 SEARCH',
    commands: [
      '.google', '.wiki', '.youtube', '.yts', '.image', '.lyrics',
      '.movie', '.anime', '.manga', '.github', '.npm', '.pinterest',
      '.news', '.book', '.dictionary', '.recipe', '.wallpaper', '.app',
      '.search', '.find'
    ]
  },
  ANIME: {
    name: '🏮 ANIME',
    commands: [
      '.waifu', '.neko', '.megumin', '.shinobu', '.naruto', '.luffy',
      '.zoro', '.itachi', '.animequote', '.animewallpaper', '.animepic',
      '.manga', '.mangainfo', '.animeinfo', '.animeedit', '.cosplay',
      '.otaku', '.husbando', '.animegif', '.randomanime'
    ]
  },
  BANK: {
    name: '🏦 BANK',
    commands: [
      '.bank', '.bankinfo', '.deposit', '.withdraw', '.transfer', '.loan',
      '.repay', '.interest', '.savings', '.fixeddeposit', '.statement',
      '.transactions', '.credit', '.debit', '.invest', '.profit', '.balance',
      '.bankrank', '.vault', '.finance'
    ]
  },
  ECONOMY: {
    name: '💰 ECONOMY',
    commands: [
      '.wallet', '.daily', '.weekly', '.monthly', '.work', '.crime',
      '.beg', '.rob', '.shop', '.buy', '.sell', '.market', '.trade',
      '.gamble', '.bet', '.lottery', '.richlist', '.economy', '.reward',
      '.salary'
    ]
  },
  GAMES: {
    name: '🎮 GAMES',
    commands: [
      '.tictactoe', '.hangman', '.guess', '.riddle', '.mathgame', '.quizgame',
      '.trivia', '.memorygame', '.snake', '.chess', '.checkers', '.roulette',
      '.blackjack', '.slots', '.poker', '.coinflip', '.dice', '.adventure',
      '.battle', '.arena'
    ]
  },
  BANNED: {
    name: '🚫 BANNED',
    commands: [
      '.ban', '.unban', '.banlist', '.tempban', '.permban', '.globalban',
      '.unglobalban', '.banuser', '.banmember', '.bancheck', '.bannedusers',
      '.blacklist', '.unblacklist', '.strike', '.warn', '.warnings',
      '.resetwarn', '.mute', '.unmute', '.kickban'
    ]
  },
  OWNERPLUS: {
    name: '👑 OWNER PLUS',
    commands: [
      '.ownermenu', '.ownerpanel', '.ownerinfo', '.addowner', '.delowner',
      '.listowner', '.sudo', '.unsudo', '.addsudo', '.delsudo', '.listsudo',
      '.setbotname', '.setbotbio', '.setppbot', '.setthumb', '.setfooter',
      '.setprefix', '.setwelcome', '.setgoodbye', '.setmenu', '.settheme',
      '.setbanner', '.setlogo', '.setpackname', '.setauthor', '.setreply',
      '.setstatus', '.setmode', '.public', '.private', '.self', '.online',
      '.offline', '.maintenance', '.autoread', '.unautoread', '.autoreact',
      '.unautoreact', '.autotyping', '.unautotyping', '.autorecord',
      '.unautorecord', '.autobio', '.unautobio', '.anticall', '.unanticall',
      '.antidelete', '.unantidelete', '.antiviewonce', '.unantiviewonce',
      '.antibug', '.unantibug', '.antispam', '.unantispam', '.antifake',
      '.unantifake', '.antibot', '.unantibot', '.antiraid', '.unantiraid',
      '.join', '.leave', '.getjid', '.getgroup', '.getchat', '.clearchat',
      '.clearpm', '.cleargroup', '.broadcast', '.bcgroup', '.bcall',
      '.sendall', '.pushcontact', '.pushgroup', '.backup', '.restore',
      '.backupdb', '.restoredb', '.backupsession', '.restoresession',
      '.savesession', '.getsession', '.delsession', '.clearsession', '.pair',
      '.unpair', '.paircode', '.qrpair', '.restart', '.reboot', '.shutdown',
      '.update', '.deploy', '.reload', '.refresh', '.reset', '.resetconfig',
      '.saveconfig', '.logs', '.clearlogs', '.errorlog', '.crashlog',
      '.terminal', '.shell', '.exec', '.eval', '.console', '.debug',
      '.getfile', '.savefile', '.editfile', '.delfile', '.listfiles',
      '.uploadfile', '.downloadfile', '.getplugin', '.addplugin', '.delplugin',
      '.reloadplugin', '.listplugin', '.install', '.uninstall', '.npm',
      '.gitpull', '.gitpush', '.commit', '.branch', '.merge', '.serverinfo',
      '.serverstats', '.cpuusage', '.ramusage', '.diskusage', '.networkstats',
      '.uptimefull', '.botstats', '.fullbackup', '.premium', '.unpremium',
      '.addpremium', '.delpremium', '.listpremium', '.ban', '.unban',
      '.block', '.unblock', '.blacklist', '.unblacklist', '.globalban',
      '.unglobalban', '.owneronly', '.devmode', '.godmode', '.superuser',
      '.root', '.rootpanel', '.systempanel', '.dashboard', '.controlpanel',
      '.management', '.botcontrol', '.mastercontrol'
    ]
  }
};

class CommandHandler {
  constructor() {
    this.commands = COMMANDS;
    this.pairingCodes = new Map();
    this.activeCommands = new Map();
  }

  /**
   * Get all commands
   */
  getAllCommands() {
    const allCommands = [];
    Object.values(COMMANDS).forEach(category => {
      allCommands.push(...category.commands);
    });
    return allCommands;
  }

  /**
   * Get categories
   */
  getCategories() {
    return Object.keys(COMMANDS).map(key => ({
      key: key,
      name: COMMANDS[key].name,
      count: COMMANDS[key].commands.length
    }));
  }

  /**
   * Get commands by category
   */
  getCommandsByCategory(category) {
    if (!COMMANDS[category]) {
      return [];
    }
    return COMMANDS[category].commands;
  }

  /**
   * Generate pairing code
   */
  generatePairingCode() {
    const code = `PAIR-${uuidv4().substring(0, 12).toUpperCase()}`;
    const expiryTime = Date.now() + (parseInt(process.env.PAIRING_CODE_EXPIRY) || 300) * 1000;

    this.pairingCodes.set(code, {
      createdAt: Date.now(),
      expiresAt: expiryTime,
      verified: false
    });

    logger.info(`Pairing code generated: ${code}`);
    return code;
  }

  /**
   * Verify pairing code
   */
  verifyPairingCode(code) {
    const pairingData = this.pairingCodes.get(code);

    if (!pairingData) {
      return false;
    }

    if (Date.now() > pairingData.expiresAt) {
      this.pairingCodes.delete(code);
      return false;
    }

    pairingData.verified = true;
    return true;
  }

  /**
   * Send message
   */
  async sendMessage(number, message) {
    try {
      logger.info(`Sending message to ${number}: ${message}`);
      
      return {
        success: true,
        messageId: uuidv4(),
        timestamp: new Date(),
        recipient: number,
        messageLength: message.length
      };
    } catch (error) {
      logger.error(`Error sending message: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process command
   */
  async processCommand(commandString, sender, context = {}) {
    try {
      const command = commandString.toLowerCase().trim();
      
      // Find matching command
      for (const [category, categoryData] of Object.entries(COMMANDS)) {
        if (categoryData.commands.includes(command)) {
          logger.info(`Processing command: ${command} from ${sender} (${category})`);
          
          return {
            success: true,
            command: command,
            category: category,
            categoryName: categoryData.name,
            sender: sender,
            timestamp: new Date()
          };
        }
      }

      return {
        success: false,
        message: `Command not found: ${command}`
      };
    } catch (error) {
      logger.error(`Error processing command: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get bot status
   */
  async getStatus() {
    return {
      botStatus: 'running',
      botName: 'SIMON TECH BOT',
      owner: 'SIMON TECH',
      uptime: Math.floor(process.uptime()),
      commandsAvailable: this.getAllCommands().length,
      categories: this.getCategories().length,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mode: process.env.NODE_ENV || 'development',
      activeSessions: this.activeCommands.size
    };
  }

  /**
   * Get command info
   */
  getCommandInfo(command) {
    for (const [category, categoryData] of Object.entries(COMMANDS)) {
      if (categoryData.commands.includes(command)) {
        return {
          command: command,
          category: category,
          categoryName: categoryData.name,
          description: `Execute ${command} command`,
          usage: `${command} [parameters]`
        };
      }
    }
    return null;
  }
}

module.exports = new CommandHandler();
