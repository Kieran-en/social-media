const User = require('../models/User');

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
