const User = require('../models/User');
const bcrypt = require('bcrypt');

// Créer un nouvel utilisateur (pour diacres et admins)
exports.createUserByDiacre = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validation des données
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Le nom, l\'email et le mot de passe sont requis' 
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    // Vérifier que le diacre ne peut pas créer d'admin
    if (role === 'admin') {
      return res.status(403).json({ 
        message: 'Les diacres ne peuvent pas créer de comptes administrateur' 
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true
    });

    // Retourner les informations de l'utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ 
      error: 'Erreur interne du serveur lors de la création de l\'utilisateur' 
    });
  }
};

exports.getAllUsers = (req, res) => {
  User.findAll({
    attributes: ['id', 'name', 'email', 'role', 'isActive', 'profileImg', 'followers', 'following', 'createdAt'],
    order: [['createdAt', 'DESC']]
  })
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({ error: err.message }));
};

exports.suspendUser = (req, res) => {
  User.update({ isActive: false }, { where: { id: req.params.id } })
    .then(() => res.status(200).json({ message: "Utilisateur suspendu" }))
    .catch(err => res.status(500).json({ error: err.message }));
};

exports.reactivateUser = (req, res) => {
  User.update({ isActive: true }, { where: { id: req.params.id } })
    .then(() => res.status(200).json({ message: "Utilisateur réactivé" }))
    .catch(err => res.status(500).json({ error: err.message }));
};

exports.deleteUserAdmin = async (req, res) => {
  const db = require('../config');
  
  try {
    const userId = req.params.id;
    console.log(`🗑️ Tentative de suppression de l'utilisateur ID: ${userId}`);
    
    // Vérifier que l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      console.log(`❌ Utilisateur ID ${userId} non trouvé`);
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    console.log(`✅ Utilisateur trouvé: ${user.name} (${user.email})`);

    // Désactiver les vérifications de clés étrangères
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('🔓 Vérifications de clés étrangères désactivées');
    
    // Supprimer manuellement tous les enregistrements liés
    const [postsResult] = await db.query('DELETE FROM Posts WHERE UserId = ?', { replacements: [userId] });
    console.log(`📝 ${postsResult.affectedRows} posts supprimés`);
    
    const [commentsResult] = await db.query('DELETE FROM Comments WHERE UserId = ?', { replacements: [userId] });
    console.log(`💬 ${commentsResult.affectedRows} commentaires supprimés`);
    
    const [likesResult] = await db.query('DELETE FROM Likes WHERE UserId = ?', { replacements: [userId] });
    console.log(`👍 ${likesResult.affectedRows} likes supprimés`);
    
    const [messagesResult] = await db.query('DELETE FROM Messages WHERE senderId = ?', { replacements: [userId] });
    console.log(`💌 ${messagesResult.affectedRows} messages supprimés`);
    
    const [conversationsResult] = await db.query('DELETE FROM Conversations WHERE senderId = ? OR receiverId = ?', { replacements: [userId, userId] });
    console.log(`💬 ${conversationsResult.affectedRows} conversations supprimées`);
    
    const [notificationsResult] = await db.query('DELETE FROM Notifications WHERE senderId = ? OR receiverId = ?', { replacements: [userId, userId] });
    console.log(`🔔 ${notificationsResult.affectedRows} notifications supprimées`);
    
    const [groupMessagesResult] = await db.query('DELETE FROM GroupMessages WHERE senderId = ?', { replacements: [userId] });
    console.log(`👥 ${groupMessagesResult.affectedRows} messages de groupe supprimés`);
    
    const [groupMembersResult] = await db.query('DELETE FROM GroupMembers WHERE UserId = ?', { replacements: [userId] });
    console.log(`👥 ${groupMembersResult.affectedRows} membres de groupe supprimés`);
    
    const [followsResult] = await db.query('DELETE FROM Follows WHERE following_user_id = ? OR followed_user_id = ?', { replacements: [userId, userId] });
    console.log(`👤 ${followsResult.affectedRows} relations de suivi supprimées`);
    
    // Supprimer l'utilisateur
    await User.destroy({ where: { id: userId } });
    console.log(`✅ Utilisateur ${user.name} supprimé avec succès`);
    
    // Réactiver les vérifications de clés étrangères
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🔒 Vérifications de clés étrangères réactivées');
    
    res.status(200).json({ 
      message: `Utilisateur ${user.name} supprimé avec succès`,
      deletedUser: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'utilisateur:', error);
    
    // Réactiver les vérifications de clés étrangères en cas d'erreur
    try {
      await db.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('🔒 Vérifications de clés étrangères réactivées après erreur');
    } catch (e) {
      console.error('❌ Erreur lors de la réactivation des vérifications FK:', e);
    }
    
    res.status(500).json({ 
      error: "Erreur lors de la suppression de l'utilisateur",
      details: error.message 
    });
  }
};

exports.renameUser = (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  User.update({ role }, { where: { id: userId } })
    .then(() => res.status(200).json({ message: "Rôle modifié avec succès" }))
    .catch(err => res.status(500).json({ error: err.message }));
};
