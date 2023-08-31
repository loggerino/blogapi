const express = require('express');
const router = express.Router();
const { allPosts } = require('../controllers/postController');

router.get('/all', allPosts);

module.exports = router;