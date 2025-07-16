const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const messageCtrl = require('../controllers/groupMessageController');

router.post('/', auth, messageCtrl.sendMessage);
router.get('/:groupId', auth, messageCtrl.getGroupMessages);

module.exports = router;
