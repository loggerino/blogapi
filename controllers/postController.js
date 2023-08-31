const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Post = require('../models/postModel');

exports.allPosts = asyncHandler(async (req, res, next) => {
    let posts = await Post.find().populate('user', 'username').populate('comments');

    if (posts.length > 0) {
        res.status(200).json(posts);
    } else {
        res.status(400).json({ message: "No posts found" });
    }
})