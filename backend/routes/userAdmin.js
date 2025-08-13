const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/userAdmin'); 

// Récupérer tous les utilisateurs
router.get('/', auth, userCtrl.getAllUsers);

// Suspendre un utilisateur
router.put('/:id/suspend', auth, userCtrl.suspendUser);

// Réactiver un utilisateur
router.put('/:id/reactivate', auth, userCtrl.reactivateUser);

// Supprimer un utilisateur
router.delete('/:id', auth, userCtrl.deleteUserAdmin);

// Modifier le rôle d'un utilisateur
router.patch('/:id/role', auth, userCtrl.renameUser);

module.exports = router;
