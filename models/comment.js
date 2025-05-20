const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  },
  comment: {
    type: String
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'groups'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment
