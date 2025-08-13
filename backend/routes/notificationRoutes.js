const express = require('express');
const router = express.Router();
const notifCtrl = require('../controllers/notificationController');

router.get('/:userId', notifCtrl.getByUser);
router.put('/markRead/:userId', notifCtrl.markAllRead);

module.exports = router;