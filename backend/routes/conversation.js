const express = require('express');
const router = express.Router();
const conversationCtrl = require('../controllers/conversation');
const auth = require('../middlewares/auth')

router.post('/', conversationCtrl.createConversation)
router.get('/:senderId', conversationCtrl.getConversations)

module.exports = router;