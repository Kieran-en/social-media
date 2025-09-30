const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuration de sécurité
const { cors: corsConfig, rateLimit: rateLimitConfig } = require('./config/security');

// Routes
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const userRoutes = require('./routes/user');
const likeRoutes = require('./routes/like');
const followRoutes = require('./routes/follow');
const messageRoutes = require('./routes/message');
const conversationRoutes = require('./routes/conversation');
const userAdminRoutes = require('./routes/userAdmin');
const groupRoutes = require('./routes/group');
const groupMessageRoutes = require('./routes/groupMessage');
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Base de données
const db = require('./config');

// Modèles (pour les associations)
const User = require('./models/User');
const Post = require('./models/Post');
const Event = require('./models/Event');
const Group = require('./models/Group');
const GroupMember = require('./models/GroupMember');
const GroupMessage = require('./models/GroupMessage');

// ========================= MIDDLEWARES DE SÉCURITÉ =========================

// Headers de sécurité avec Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"],
      mediaSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Permet l'upload d'images
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting global
const globalLimiter = rateLimit({
  ...rateLimitConfig,
  message: rateLimitConfig.message
});
app.use('/api/', globalLimiter);

// Rate limiting strict pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: {
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Ne compte que les échecs
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// Configuration CORS sécurisée
app.use(cors(corsConfig));

// Headers de sécurité personnalisés
app.use((req, res, next) => {
  // Empêcher le sniffing MIME
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Protection XSS
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Empêcher l'embedding dans des iframes
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Politique de référent stricte
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
});

app.use(express.json());
//app.use(bodyParser.text());

db.authenticate()
  .then(() => console.log("Database connected sucessfully..."))
  .catch((error) => console.log('Error :' + error))

  db.sync({ alter: true })
  .then(() => {
    console.log('Synched!'); // Tu peux le garder pour confirmer que Sequelize est bien connecté à la DB
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation :', error);
  });



app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/users', userAdminRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/groups', groupRoutes);
app.use('/api/groupMessages', groupMessageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);

module.exports = app;