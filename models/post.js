const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postTitle: { type: String, required: true },
  postText: { type: String, required: true },
  postImage: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
}, {
  timestamps: true 
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;