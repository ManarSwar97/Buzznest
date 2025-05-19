const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',   
    },
    postTitle:{
        type: String,
        required: true,
    },
    postText:{
        type: String,
        required: true,
    },
    postImage:{
        type: String,
        required: true,
    }
    }, {
        
    timestamps: true

})

const Post = mongoose.model("Post", postSchema)
module.exports = Post