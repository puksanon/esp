var New =  require('../models/video');
var mongoose = require('mongoose');
var db = require('../config/keys').MongoURI;
mongoose.connect(db, { useNewUrlParser: true})
.then(() => console.log('mongoDB connect..'))
.catch(err => console.log(err));

var newpaper = [ 
    new New({
    name: 'test',
    vedio: 'https://youtu.be/qjbhhTEY6SE'
})


];


for (var i = 0 ; i< newpaper.length ; i++ ){
    newpaper[i].save();
}
