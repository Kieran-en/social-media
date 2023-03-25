const express = require('express');
const router = express.Router();
const followCtrl = require('../controllers/follow');
const auth = require('../middlewares/auth')

router.post('/', followCtrl.followOrUnfollow)
router.get('/', followCtrl.isUserFollowed)
router.get('/:userId', followCtrl.getFriends)

module.exports = router;