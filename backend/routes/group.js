const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const groupCtrl = require('../controllers/groupController');

router.post('/', auth, groupCtrl.createGroup);
router.get('/', auth, groupCtrl.getUserGroups);

module.exports = router;
