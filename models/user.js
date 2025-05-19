const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema)
module.exports = User