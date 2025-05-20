const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
    groupName: String,
    groupImage: String,
    game: String,
    user: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    },
    
});

module.exports = mongoose.model('group', groupSchema);