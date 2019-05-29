const express = require('express');

const router = express.Router();
const New = require('../models/newpapers');
const game_post = require('../models/game_post');
const game_opnion = require('../models/game_opnion');
const User = require('../models/user');
const { ensureAuthenticated, forwardAuthenticated} = require('../config/auth');

//index
router.get('/',forwardAuthenticated, (req, res) => 
    res.render("index"
));

// Dashboard
router.get('/dashboard', ensureAuthenticated  ,async function(req, res){
    const name = req.user.name
    const permission = (req.user.permission)
    if( permission === "admin") 
    {
        await New.countDocuments({}, function( err, count){
                User.countDocuments({}, function( err, count_user){
                    game_post.countDocuments({},function(err,count_game){
                        game_opnion.countDocuments({},function(err,count_opnion){
                        //console.log(count,count_game,count_user,game_opnion,count_user);
                    
                        res.render('dashboard' ,{ 
                            user: req.user,
                            count:count,
                            count_user: count_user,
                            count_game: count_game,
                            count_opnion: count_opnion
                        })
                    })
                })
            })
        })
    }else if (  permission === "user") {
        await New.countDocuments({}, function( err, count){
                game_post.countDocuments({ name:name },function(err,count_game){
                    game_opnion.countDocuments({ name:name },function(err,count_opnion){
                    // console.log(count,count_game,game_opnion);
                    res.render('dashboard' ,{ 
                        user: req.user,
                        count:count,
                        count_game: count_game,
                        count_opnion: count_opnion
                    })
                })
            })
        })
    }
});

module.exports = router;