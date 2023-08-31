const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: { type: String, required: true, minLength: 1, maxLength: 140 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
