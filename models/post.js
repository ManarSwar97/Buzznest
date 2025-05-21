const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  postTitle: { type: String, required: true },
  postText: { type: String, required: true },
  postImage: { type: String, required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
  likes: { 
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  comments: [{
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true 
});
const Post = mongoose.model("Post", postSchema);
module.exports = Post;