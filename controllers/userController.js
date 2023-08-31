const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');

exports.allUsers = asyncHandler(async (req, res, next) => {
    let users = await User.find().sort({ username: 1 });
    if (users.length > 0) {
        res.status(200).json(users);
    } else {
        res.status(400).json({ message: "No users found " });
    }
});

exports.getSingleUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);
    if (user === null) {
        res.status(404).json({ error: "User not found" });
    } else {
        res.status(200).json(user);
    }
})

exports.createUser = [
    body('username', 'Username is required').trim().isLength({ min: 1 }).escape(),
    body('email', 'Invalid email').trim().isEmail().escape(),
    body('password', 'Password must be at least 6 characters long').trim().isLength({ min: 6 }).escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const user = new User({
            username,
            email,
            password,
        });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    })
]