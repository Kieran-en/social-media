const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const { upload, handleMulterError } = require('../middlewares/multer-config');
const { validateUserCreation, validateUserUpdate } = require('../middlewares/validation');

// Créer un utilisateur avec validation
router.post('/signup', validateUserCreation, userCtrl.signup);

// Connexion
router.post('/login', userCtrl.login);

// Récupérer un utilisateur
router.get('/:username', auth, userCtrl.getUser);

// Liste d'amis
router.get('/friends/:username', auth, userCtrl.getFriends);

// Supprimer un utilisateur
router.delete('/:username', auth, userCtrl.deleteUser);

// Modifier un utilisateur (avec image de profil et validation)
router.put('/:userId', auth, validateUserUpdate, upload.single('image'), handleMulterError, userCtrl.modifyUserData);

// Rechercher des utilisateurs
router.get('/search/users', auth, userCtrl.searchUsers);

module.exports = router;
