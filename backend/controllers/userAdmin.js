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
  User.findAll()
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

exports.deleteUserAdmin = (req, res) => {
  User.destroy({ where: { id: req.params.id } })
    .then(() => res.status(200).json({ message: "Utilisateur supprimé" }))
    .catch(err => res.status(500).json({ error: err.message }));
};

exports.renameUser = (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  User.update({ role }, { where: { id: userId } })
    .then(() => res.status(200).json({ message: "Rôle modifié avec succès" }))
    .catch(err => res.status(500).json({ error: err.message }));
};
