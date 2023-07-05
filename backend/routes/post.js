const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const multer = require('../middlewares/multer-config');
const auth = require('../middlewares/auth');

router.post('/', multer, postCtrl.createPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.get('/:id', auth, multer, postCtrl.getPost);
router.put('/', multer, postCtrl.modifyPost);
router.get('/', postCtrl.displayPosts);

module.exports = router;