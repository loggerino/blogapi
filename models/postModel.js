const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true, minLength: 1 },
    published: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
});

modules.export = mongoose.model("Post", postSchema);