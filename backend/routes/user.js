const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer-config');  // renommé pour clarté

// Créer un utilisateur
router.post('/signup', userCtrl.signup);

// Connexion
router.post('/login', userCtrl.login);

// Récupérer un utilisateur
router.get('/:username', userCtrl.getUser);

// Liste d'amis
router.get('/friends/:username', userCtrl.getFriends);

// Supprimer un utilisateur
router.delete('/:username', auth, userCtrl.deleteUser);

// Modifier un utilisateur (avec image de profil)
router.put('/:userId', auth, upload.single('image'), userCtrl.modifyUserData);

module.exports = router;
