const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:username', userCtrl.getUser);
router.delete('/:username', auth, userCtrl.deleteUser);
router.put('/:userId', auth, multer, userCtrl.modifyUserData);
//router.put('/:username', auth, userCtrl.modifyEmail);

module.exports = router;

