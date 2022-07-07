const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');
const auth = require('../middlewares/auth');

router.post('/', auth, likeCtrl.likeOrDislike);

module.exports = router;