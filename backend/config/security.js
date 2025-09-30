require('dotenv').config();

module.exports = {
  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configuration bcrypt
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },

  // Configuration CORS
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',') : 
      ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
    optionsSuccessStatus: 200
  },

  // Configuration Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite par IP
    message: {
      error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
  },

  // Configuration upload de fichiers
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'video/mp4'
    ]
  },

  // Configuration validation
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: false
    },
    email: {
      maxLength: 254
    },
    name: {
      minLength: 2,
      maxLength: 50
    }
  }
};
