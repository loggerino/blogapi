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

exports.updateComment = [
    body('content', "Comment content is required",).trim().isLength({ min: 1 }).escape(),
    asyncHandler(async (req, res, next) => {
        const commentId = req.params.commentId;
        const content = req.body.content;

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        );
        if (!updatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        res.status(200).json(updatedComment);
    })
];

exports.deleteComment = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    await Comment.findByIdAndRemove(commentId);
    await Post.findByIdAndUpdate(
        comment.post,
        { $pull: { comments: commentId } }
    );

    res.status(200).json({ message: "Comment deleted successfully" });
});

exports.getSingleComment = asyncHandler(async (req, res, next) => {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId).populate('user', 'username');
    if (!comment) {
        res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(comment);
})

exports.allComments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find().populate('user', 'username');
    if (comments.length > 0) {
        res.status(200).json(comments);
    } else {
        res.status(400).json({ message: "No comments found" })
    }
})