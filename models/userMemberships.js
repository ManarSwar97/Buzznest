const mongoose = require('mongoose')
const userMembershipSchema = new mongoose.Schema({
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',   
    }
    
})

const UserMembership = mongoose.model("UserMembership", userMembershipSchema)
module.exports = UserMembership