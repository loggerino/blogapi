const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
const commentController = require('../controllers/commentController');
const protect = require('../middleware/authMiddleware');

router.get('/posts/all', postController.allPosts);
router.get('/posts/post/:id', postController.getSinglePost);
router.post('/posts/create', protect, postController.createPost);
router.put('/posts/post/update/:id', protect, postController.updatePost);
router.delete('/posts/post/delete/:id', protect, postController.deletePost);
router.post('/login', userController.authUser);
router.post('/logout', userController.logoutUser);
router.get('/users/all', userController.allUsers);
router.get('/users/user/:id', userController.getSingleUser);
router.post('/users/create', userController.signUp);
router.post('/posts/post/:postId/comment', protect, commentController.createComment);

module.exports = router;