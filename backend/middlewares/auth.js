const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwt: jwtConfig } = require('../config/security');

module.exports = async (req, res, next) => {
  try {
    // Vérifier la présence du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token manquant ou format invalide' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier et décoder le token avec le secret sécurisé
    const decodedToken = jwt.verify(token, jwtConfig.secret);
    const { userId, role, exp } = decodedToken;

    // Vérifier l'expiration (double vérification)
    if (exp && Date.now() >= exp * 1000) {
      return res.status(401).json({ 
        error: 'Token expiré' 
      });
    }

    // Vérifier que l'utilisateur existe toujours et est actif
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'Utilisateur non trouvé' 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        error: 'Compte utilisateur désactivé' 
      });
    }

    // Attacher les données d'authentification
    req.auth = { userId, role };
    req.user = user;

    // Vérification supplémentaire pour les modifications d'utilisateur
    if (req.body.userId && 
        parseInt(req.body.userId) !== userId && 
        role !== 'admin') {
      return res.status(403).json({ 
        error: 'Accès non autorisé' 
      });
    }

    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Token invalide' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expiré' 
      });
    }

    return res.status(401).json({ 
      error: 'Erreur d\'authentification' 
    });
  }
};
