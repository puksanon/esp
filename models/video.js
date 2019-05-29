const mongoose = require('mongoose');

const vedioSchema = new mongoose.Schema({


    name:{
            type: String,
            required: true
    },

    vedio:{
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
});

const Vedio = mongoose.model('Vedio',vedioSchema);

module.exports = Vedio;