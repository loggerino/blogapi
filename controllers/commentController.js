const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

exports.createComment = [
    body('content', 'Comment content is required').trim().isLength({ min: 1 }).escape(),
    asyncHandler(async (req, res, next) => {
        const postId = req.params.postId;
        const content = req.body.content;
        const user = req.user._id;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const comment = new Comment({
            content,
            user,
            post: postId,
        });
        const savedComment = await comment.save();
        res.status(201).json(savedComment);

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: savedComment._id } },
            { new: true }
        );
        res.status(201).json(savedComment);
    })
];