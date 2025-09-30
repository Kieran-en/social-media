const fs = require('fs');
const path = require('path');

class SecurityLogger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatLogEntry(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...metadata,
      // Masquer les données sensibles
      ...(metadata.password && { password: '[MASKED]' }),
      ...(metadata.token && { token: '[MASKED]' }),
      ...(metadata.email && { email: this.maskEmail(metadata.email) })
    };

    return JSON.stringify(logEntry) + '\n';
  }

  maskEmail(email) {
    if (!email || typeof email !== 'string') return '[MASKED]';
    const [local, domain] = email.split('@');
    if (!domain) return '[MASKED]';
    const maskedLocal = local.length > 2 ? 
      local.substring(0, 2) + '*'.repeat(local.length - 2) : 
      '*'.repeat(local.length);
    return `${maskedLocal}@${domain}`;
  }

  writeToFile(filename, content) {
    const filePath = path.join(this.logDir, filename);
    fs.appendFileSync(filePath, content, 'utf8');
  }

  // Log des tentatives de connexion
  logAuthAttempt(success, email, ip, userAgent = '', metadata = {}) {
    const logEntry = this.formatLogEntry('AUTH', 
      success ? 'Connexion réussie' : 'Tentative de connexion échouée', 
      {
        success,
        email: email,
        ip,
        userAgent,
        ...metadata
      }
    );
    
    this.writeToFile('auth.log', logEntry);
    
    // Log également dans la console en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 [AUTH] ${success ? '✅' : '❌'} ${email} depuis ${ip}`);
    }
  }

  // Log des actions sensibles
  logSecurityEvent(action, userId, details = {}, ip = '') {
    const logEntry = this.formatLogEntry('SECURITY', action, {
      userId,
      ip,
      ...details
    });
    
    this.writeToFile('security.log', logEntry);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🛡️ [SECURITY] ${action} - User: ${userId} - IP: ${ip}`);
    }
  }

  // Log des erreurs
  logError(error, context = {}) {
    const logEntry = this.formatLogEntry('ERROR', error.message, {
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      ...context
    });
    
    this.writeToFile('error.log', logEntry);
    
    // Toujours logger les erreurs en console
    console.error(`❌ [ERROR] ${error.message}`);
  }

  // Log des accès API
  logApiAccess(method, url, statusCode, userId = null, ip = '', duration = 0) {
    // Ne pas logger les routes de santé ou statiques
    if (url.includes('/health') || url.includes('/images') || url.includes('/favicon')) {
      return;
    }

    const logEntry = this.formatLogEntry('API', `${method} ${url}`, {
      statusCode,
      userId,
      ip,
      duration: `${duration}ms`
    });
    
    this.writeToFile('api.log', logEntry);
    
    // Log uniquement les erreurs et actions importantes en développement
    if (process.env.NODE_ENV === 'development' && (statusCode >= 400 || method !== 'GET')) {
      const statusEmoji = statusCode >= 500 ? '💥' : statusCode >= 400 ? '⚠️' : '✅';
      console.log(`${statusEmoji} [API] ${method} ${url} - ${statusCode} (${duration}ms)`);
    }
  }

  // Log des uploads de fichiers
  logFileUpload(filename, mimetype, size, userId, ip) {
    const logEntry = this.formatLogEntry('UPLOAD', 'Fichier uploadé', {
      filename,
      mimetype,
      size: `${Math.round(size / 1024)}KB`,
      userId,
      ip
    });
    
    this.writeToFile('upload.log', logEntry);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📁 [UPLOAD] ${filename} (${Math.round(size / 1024)}KB) par User ${userId}`);
    }
  }

  // Nettoyage des logs anciens (à exécuter périodiquement)
  cleanOldLogs(daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const logFiles = ['auth.log', 'security.log', 'error.log', 'api.log', 'upload.log'];
    
    logFiles.forEach(filename => {
      const filePath = path.join(this.logDir, filename);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.mtime < cutoffDate) {
          // Archiver le fichier au lieu de le supprimer
          const archiveName = `${filename}.${stats.mtime.toISOString().split('T')[0]}.archive`;
          fs.renameSync(filePath, path.join(this.logDir, archiveName));
          console.log(`📦 Log archivé: ${filename} -> ${archiveName}`);
        }
      }
    });
  }
}

// Instance singleton
const logger = new SecurityLogger();

// Middleware pour logger les requêtes API
const apiLoggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const duration = Date.now() - startTime;
    const userId = req.auth?.userId || null;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    
    logger.logApiAccess(req.method, req.originalUrl, res.statusCode, userId, ip, duration);
    
    return originalSend.call(this, data);
  };

  next();
};

module.exports = {
  logger,
  apiLoggingMiddleware
};

