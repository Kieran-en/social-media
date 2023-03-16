const express = require('express');
const router = express.Router();
const conversationCtrl = require('../controllers/conversation');
const auth = require('../middlewares/auth')

router.post('/')
router.get('/:senderId')

module.exports = router;