const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const postCtrl = require('../controllers/post');
const upload = require('../middlewares/multer-config'); // multer bien importé

// Création d’un post avec image
router.post('/', auth, upload.single('image'), postCtrl.createPost);

// Modifier un post
router.put('/:id', auth, upload.single('image'), postCtrl.modifyPost);

// Récupérer tous les posts (avec pagination)
router.get('/', auth, postCtrl.displayPosts);

// Récupérer un post spécifique
router.get('/:id', auth, postCtrl.getPost);

// Supprimer un post
router.delete('/:id', auth, postCtrl.deletePost);

module.exports = router;
