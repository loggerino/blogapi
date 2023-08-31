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
});

exports.getSinglePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('user', 'username');
    if (post === null) {
        res.status(404).json({ error: "Post not found" });
    } else {
        res.status(200).json(post);
    }
});

exports.createPost = [
    body('title', "Input Title").trim().isLength({ min: 1 }).escape(),
    body('content', "Insert content").trim().isLength({ min: 1 }).escape(),
    body('tag', "Invalid tag").trim().isLength({ min: 1 }).escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            user: userId,
            tag: req.body.tag,
        });
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    })
]