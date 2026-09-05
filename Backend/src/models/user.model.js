// user schema

// it should have username,email,password
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "username already exists"]
    },

    email: {
        type: String,
        required: true,
        unique: [true, "email already exists"]
    },

    password: {
        type: String,
        required: true
    },

    resetPasswordToken: {
        type: String,
        default: null
    },

    resetPasswordExpires: {
        type: Date,
        default: null
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;