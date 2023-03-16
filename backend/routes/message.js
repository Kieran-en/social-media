const express = require('express');
const router = express.Router();
const messageCtrl = require('../controllers/message');
const auth = require('../middlewares/auth')

router.post('/')
router.get('/:conversationId')

module.exports = router;