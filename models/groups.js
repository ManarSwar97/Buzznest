const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  }
});

module.exports = mongoose.model('Group', groupSchema);