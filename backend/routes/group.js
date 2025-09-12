const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer-config');
const groupCtrl = require('../controllers/groupController');

// Créer un groupe avec image
router.post('/', auth, upload.single('profileImg'), groupCtrl.createGroup);

// Test route pour vérifier que l'endpoint fonctionne
router.get('/search/test', auth, (req, res) => {
  res.json({ message: 'Endpoint de recherche de groupes accessible', timestamp: new Date().toISOString() });
});

// Rechercher des groupes
router.get('/search', auth, groupCtrl.searchGroups);

// Récupérer tous les groupes (admin)
router.get('/', auth, groupCtrl.getUserGroups);

// Modifier un groupe
router.put('/:id', auth, upload.single('profileImg'), groupCtrl.updateGroup);

// Suspendre un groupe
router.put('/:id/suspend', auth, groupCtrl.suspendGroup);

// **Nouvelle route réactiver groupe**
router.put('/:id/reactivate', auth, groupCtrl.reactivateGroup);

// Supprimer un groupe
router.delete('/:id', auth, groupCtrl.deleteGroup);

// Récupérer un groupe spécifique avec détails
router.get('/:id', auth, groupCtrl.getGroupById);

// Récupérer les posts d'un groupe
router.get('/:id/posts', auth, groupCtrl.getGroupPosts);

// Récupérer les membres d'un groupe
router.get('/:id/members', auth, groupCtrl.getGroupMembers);

// Vérifier le membership d'un utilisateur dans un groupe
router.get('/:id/membership/:userId', auth, groupCtrl.getUserGroupMembership);

// Rejoindre un groupe
router.post('/:id/join', auth, groupCtrl.joinGroup);

// Quitter un groupe
router.post('/:id/leave', auth, groupCtrl.leaveGroup);

// Suivre un groupe (notifications)
router.post('/:id/follow', auth, groupCtrl.followGroup);

// Ne plus suivre un groupe
router.post('/:id/unfollow', auth, groupCtrl.unfollowGroup);

router.put('/groups/:id/leader', auth, groupCtrl.setGroupLeader);


module.exports = router;
