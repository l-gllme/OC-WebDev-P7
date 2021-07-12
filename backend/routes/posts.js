const express = require('express')
const router = express.Router()

const postsCtrl = require('../controllers/posts')
const commentsCtrl     = require('../controllers/comments')
const auth = require('../middleware/auth')


// posts routes
router.post('/add', postsCtrl.createPost);
router.get('/all',auth, postsCtrl.getAllPost);
router.get('/:id',auth, postsCtrl.getOnePost);
router.delete('/:id', postsCtrl.deletePost);

router.post('/:postId/comments', commentsCtrl.createComment);
router.get('/:postId/comments',auth, commentsCtrl.getAllComments);
router.get('/:postId/comments/:id',auth, commentsCtrl.getOneComment);
router.delete('/:postId/comments/:id', commentsCtrl.deleteComment);

module.exports = router