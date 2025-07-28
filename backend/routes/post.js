const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const postCtrl = require('../controllers/post');
const upload = require('../middlewares/multer-config');

// Créer un post avec image
router.post('/', auth, upload.single('image'), postCtrl.createPost);

// Modifier un post
router.put('/:id', auth, upload.single('image'), postCtrl.modifyPost);

// Récupérer les posts (avec pagination pour timeline)
router.get('/', auth, postCtrl.displayPosts);

// Récupérer un post spécifique
router.get('/:id', auth, postCtrl.getPost);

// Supprimer un post
router.delete('/:id', auth, postCtrl.deletePost);

// Récupérer tous les posts (sans pagination) pour l’admin/stats
router.get('/all', auth, async (req, res) => {
  try {
    const Post = require('../models/Post');
    const User = require('../models/User');

    const posts = await Post.findAll({
      include: User,
      order: [['createdAt', 'DESC']],
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du chargement des posts.' });
  }
});

module.exports = router;
