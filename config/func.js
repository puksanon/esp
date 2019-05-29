const collections = require('../models/game_post'); 
const collection = require('../models/newpapers');
const collection_gameopnion = require('../models/game_opnion')

exports.getResult =  function getResult(callback) {  
                    collection.find({ },function (err, result)
                    {
                        if (err) {
                            console.log(err);
                        // } else if (result.length) {
                        //     console.log("-------------RESULT--------------");
                        //     console.log(result);
                        //     console.log("----------------------------------");
                        // 
                        } else {
                            console.log('status 200!!');
                        }
                        //Close connection
                      //  db.close();
                        callback(err, result);
                    });   
};

exports.getmathod = function getmathod(id,callback) {
                  collection.findOne({ _id: id },function (err, result)
                  {
                      if (err) {
                        // console.log("---------------------------");
                        //   console.log(err);
                        //   console.log("---------------------------");
                    //   } else if (result) {
                    //       console.log("-------------RESULT--------------");
                    //       console.log(result);
                    //       console.log("----------------------------------");
                      } else {
                          console.log('status 200!!');
                      }
                      //Close connection
                     // db.close();
                      return callback(err, result);
                  });
};

exports.getgameposts = function getgameposts(gametype,callback) {
    collections.find({ gametype: gametype },function (err, result)
    {
        if (err) {
        //   console.log("---------------------------");
        //     console.log(err);
        //     console.log("---------------------------");
        // } else if (result) {
        //     console.log("-------------RESULT--------------");
        //     console.log(result);
        //     console.log("----------------------------------");
        // } else {
            console.log('status 200!!');
        }
        //Close connection
       // db.close();
        return callback(err, result);
    });
};

exports.getopions =  function getopions(id,callback) {  
    collection_gameopnion.find({ id: id , },function (err, result)
    {
        if (err) {
            console.log(err);
        // } else if (result.length) {
        //     console.log("-------------RESULT--------------");
        //     console.log(result);
        //     console.log("----------------------------------");
        // 
        } else {
            console.log('status 200!!');
        }
        //Close connection
      //  db.close();
        callback(err, result);
    });   
};

exports.getgamepost = function getgamepost(id,callback) {
    collections.findOne({ _id: id },function (err, result)
    {
        if (err) {
        //   console.log("---------------------------");
        //     console.log(err);
        //     console.log("---------------------------");
        // } else if (result) {
        //     console.log("-------------RESULT--------------");
        //     console.log(result);
        //     console.log("----------------------------------");
        // } else {
            console.log('status 200!!');
        }
        //Close connection
       // db.close();
        return callback(err, result);
    });
};
