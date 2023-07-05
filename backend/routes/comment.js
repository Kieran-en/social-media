const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middlewares/auth')

router.post('/', commentCtrl.creatComment);
router.put('/', commentCtrl.modifyComment);
router.get('/', commentCtrl.getComments);

module.exports = router;