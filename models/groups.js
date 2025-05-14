const mongoose = require('mongoose')
const groupSchema = new mongoose.Schema({
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
    },
    groupName:{
        type: String,
    }
})

const Group = mongoose.model("Group", groupSchema)
module.exports = Group