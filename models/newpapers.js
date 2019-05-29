const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true
    },

    imagepath: {
        type: String,
        required: true
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

const New = mongoose.model('New',NewsSchema);

module.exports = New;