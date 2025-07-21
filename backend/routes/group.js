const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/multer-config');
const groupCtrl = require('../controllers/groupController');

// Créer un groupe avec image
router.post('/', auth, upload.single('profileImg'), groupCtrl.createGroup);

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

module.exports = router;
