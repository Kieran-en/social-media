const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/message');
const auth = require('../middlewares/auth')

router.post('/', messageCtrl.createMessage)
router.get('/:conversationId', messageCtrl.getMessages)

module.exports = router;