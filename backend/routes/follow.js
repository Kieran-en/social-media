const express = require('express');
const router = express.Router();
const followCtrl = require('../controllers/follow');
const auth = require('../middlewares/auth')

router.post('/')
router.get('/:id')

module.exports = router;