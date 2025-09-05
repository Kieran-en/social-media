const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_SECRET_KEY');
    const userId = decodedToken.userId;
    const role = decodedToken.role;

    // Vérifier que l'utilisateur est uniquement diacre
    if (role !== 'diacre') {
      return res.status(403).json({ 
        message: 'Accès refusé. Seuls les diacres peuvent ajouter de nouveaux utilisateurs.' 
      });
    }

    // Attacher les données d'authentification
    req.auth = { userId, role };

    // Récupérer l'utilisateur complet
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      error: new Error('Requête non authentifiée!')
    });
  }
};
