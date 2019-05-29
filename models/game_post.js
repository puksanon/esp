const mongoose = require('mongoose');

const GamepostSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    imagepath: {
        type: String,
    },

    gametype: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },
    
    description: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});

const Gamepost = mongoose.model('Gamepost',GamepostSchema);

module.exports = Gamepost;