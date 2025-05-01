const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true, // Field is required
        trim: true, // Removes extra spaces
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate emails
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email'], // Email validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);