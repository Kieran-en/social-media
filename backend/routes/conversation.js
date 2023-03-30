const express = require('express');
const router = express.Router();
const conversationCtrl = require('../controllers/conversation');
const auth = require('../middlewares/auth')

router.post('/', conversationCtrl.createConversation)
router.get('/:senderId', conversationCtrl.getConversations)
router.get('/:senderId/:receiverId', conversationCtrl.getSpecificConversation)

module.exports = router;