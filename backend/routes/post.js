// routes/post.js - CORRECT

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const postCtrl = require('../controllers/post');
const upload = require('../middlewares/multer-config');

// --- Routes POST, PUT ---
// Créer un post avec image
router.post('/', auth, upload.single('image'), postCtrl.createPost);

// Modifier un post
router.put('/:id', auth, upload.single('image'), postCtrl.modifyPost);


// --- Routes GET (les plus spécifiques en premier) ---
// Récupérer les posts (avec pagination pour timeline)
router.get('/', auth, postCtrl.displayPosts);

// Récupérer tous les posts (sans pagination) pour l'admin/stats
// CETTE ROUTE DOIT ÊTRE AVANT /:id
router.get('/all', auth, async (req, res) => {
    try {
        const Post = require('../models/Post');
        const User = require('../models/User');
        const Group = require('../models/Group');

        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'profileImg']
                },
                {
                    model: Group,
                    as: 'group',
                    attributes: ['id', 'name', 'profileImg'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json(posts);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors du chargement des posts.' });
    }
});

// Récupérer les posts d'un utilisateur spécifique
router.get('/user/:userId', auth, postCtrl.getUserPosts);

// Récupérer un post spécifique (route dynamique)
router.get('/:id', auth, postCtrl.getPost);


// --- Route DELETE ---
// Supprimer un post
router.delete('/:id', auth, postCtrl.deletePost);


module.exports = router;