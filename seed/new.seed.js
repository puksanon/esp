var New =  require('../models/game_opnion');
var mongoose = require('mongoose');
var db = require('../config/keys').MongoURI;
mongoose.connect(db, { useNewUrlParser: true})
.then(() => console.log('mongoDB connect..'))
.catch(err => console.log(err));

var newpaper = [ 
    new New({
    name: 'ccc',
    id:'5ce8f4367608dd227454b53f',
    gametype: 'dota',
    opnion:'hello'
}),
new New({
    name: 'ccc',
    id:'5ce8f4367608dd227454b53f',
    gametype: 'dota',
    opnion:'hello'
}),
new New({
    name: 'ccc',
    id:'5ce8f4367608dd227454b53f',
    gametype: 'dota',
    opnion:'hello'
}),
new New({
    name: 'ccc',
    id:'5ce8f4367608dd227454b53f',
    gametype: 'dota',
    opnion:'hello'
})

];


for (var i = 0 ; i< newpaper.length ; i++ ){
    newpaper[i].save();
}

