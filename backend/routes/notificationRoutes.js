const express = require('express');
const router = express.Router();
const notifCtrl = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

// Récupérer les notifications d'un utilisateur
router.get('/:userId', notifCtrl.getByUser);

// Marquer toutes les notifications comme lues
router.put('/markRead/:userId', notifCtrl.markAllRead);

// Marquer une notification spécifique comme lue
router.put('/:notificationId/read', auth, notifCtrl.markAsRead);

// Compter les notifications non lues
router.get('/:userId/unread-count', notifCtrl.getUnreadCount);

// Créer une notification (pour les tests)
router.post('/', auth, notifCtrl.createNotification);

module.exports = router;