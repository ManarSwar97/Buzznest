const mongoose = require('mongoose')
const gameSchema = new mongoose.Schema({
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups',
    },
    gameName:{
        type: String,
    }
})

const Game = mongoose.model("Game", gameSchema)
module.exports = Game