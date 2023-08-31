const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

router.get('/posts/all', postController.allPosts);
router.get('/posts/post/:id', postController.getSinglePost);
router.post('/posts/create', postController.createPost);
router.post('/users/create', userController.createUser);

module.exports = router;