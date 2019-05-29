const mongoose = require('mongoose');

const GameoppSchema = new mongoose.Schema({
    id:{
        type: String,
        required:true
    },

    name:{
            type: String,
            required: true
    },

    gametype:{
        type: String,
        required: true
    },

    
    opnion: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});

const Gameopnion = mongoose.model('Gameopnion',GameoppSchema);

module.exports = Gameopnion;