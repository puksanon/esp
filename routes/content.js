//express req
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

//function call back
const { ensureAuthenticated } = require('../config/auth');
const { getResult , getmathod ,getopions , getgamepost,getgameposts} = require('../config/func');
const New = require('../models/newpapers');
const game_post = require('../models/game_post');
const game_opnion = require('../models/game_opnion');
const video = require('../models/video');

router.get('/about', function(req, res) {
   res.render("about",{ user : req.user }
  // ,console.log(req.user)
)
});
//home page
router.get('/home' ,function(req, res) { 
  res.render('home',{ user : req.user}
  //,console.log(req.user)
)
});  
//show new 
router.get('/news' , function(req, res) {
  const posts = getResult(function(err, posts){
      //handle err, then you can render your view
      // console.log(posts)
      res.render('news', {
        posts , 
        user : req.user
      });
  });
});
//activity
router.get('/activity' ,async function(req, res) {
 await video.findOne({ _id: "5ceaa08ee8a45949c4901c66" } , function(err,video){
    if (err) 
    return next(err);
    return res.render('activity', {
    video: video.vedio,
    user : req.user  
    })
  })
});  

router.post('/activity' ,async function(req, res) {
  await video.findOneAndUpdate({ _id: "5ceaa08ee8a45949c4901c66" } ,{$set: 
    {
      vedio: req.body.video
    }}, {new: true, useFindAndModify: false} ,function(err, result) {
      if (err) { throw err; }
       else { res.redirect('/content/activity') }
  });
    
 }); 

//show post detail
router.get('/news/:id',function(req, res,next)  {
  const id = req.params.id;
  const posts = getmathod( id, function(err, post) {
    if (err) 
      return next(err);
      return res.render('post', {
      post,
      user : req.user  
    });
  });
});

router.post('/news/:id/del' ,async function(req, res){
  let id = req.params.id
  console.log(id)
  await New.findOneAndDelete({_id: id } )
    return res.redirect(`/content/news`)
});

router.get('/news/edit/:id',ensureAuthenticated,function(req,res) {
  const id = req.params.id;
  const posts = getmathod( id, function(err, post) {
    if (err) 
      return next(err);
      return res.render('edit_news', {
      header: "Edit Post",  
      post,
      user : req.user  
    });
  });
 
});

router.post('/news/edit/:id',ensureAuthenticated,async function(req,res) {
  const id = req.params.id;
  // console.log(req.body)
  // console.log(id)
  await New.findOneAndUpdate({ _id:id },{$set: 
    {
      title:req.body.title,
      gametype: req.body.gametype,
      description: req.body.description
    }}, {new: true, useFindAndModify: false} ,function(err, result) {
      if (err) { throw err; }
       else { res.redirect('/content/news') }
  });
    
});

//community page
router.get('/community', function(req, res) {
   res.render("community",{
      user : req.user }
    )
});

router.get('/community/:gametype',function(req, res,next)  {
  const gametype = (req.params.gametype);
  // const user = req.user;
  //  console.log(user)
  const posts = getgameposts( gametype, function(err, posts) {
    if (err) 
      return next(err);
      return res.render('game_post', {
      posts,
      user : req.user ,
      header : gametype
    });
  });
});

router.get('/community/:gametype/:id',function(req, res,next)  {
  const id = (req.params.id);
  const gametype = req.params.gametype;
  const user = req.user;
    console.log(user)
  // console.log(gametype)
  const posts = getgamepost(id ,function(err,posts){
  const post = getopions(id , function(err,post){
      if(err)
      return next(err);
      return res.render('game_opnion',{
        posts,  
        post,
        user,
        gametype: gametype,
        id:id
      })
   });  
  });
});

router.get('/community/edit/:gametype/:id',ensureAuthenticated,function(req,res) {
  const id = req.params.id;
  const posts = getgamepost( id, function(err, post) {
    if (err) 
      return next(err);
      return res.render('edit_com', {
      header: "Edit Post",  
      post,
      user : req.user  
    });
  });
 
});

router.post('/community/edit/:gametype/:id',ensureAuthenticated,async function(req,res) {
  const id = req.params.id;
  const gametype = req.params.gametype
  // console.log(req.body)
  // console.log(id)
  await game_post.findOneAndUpdate({ _id:id },{$set: 
    {
      title:req.body.title,
      gametype: req.body.gametype,
      description: req.body.description
    }}, {new: true, useFindAndModify: false} ,function(err, result) {
      if (err) { throw err; }
       else { res.redirect(`/content/community/${gametype}`) }
  });
    
});

router.post('/community/del/:gametype/:id' ,async function(req, res){
  let id = req.params.id
  let gametype = req.params.gametype
  await game_post.findOneAndDelete({_id: id } ,function(err,result){
    game_opnion.find({ id: id } ,function(err,results){
      if( results){
        game_opnion.deleteMany({ id: id},function(err){
          return res.redirect(`/content/community/${gametype}`)
        })
      }
    })
  })
});

router.post('/community/:gametype/:id',ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  const gametype = req.params.gametype;
  const name = req.user.name;
  const {opnion} = req.body
  // console.log(id)
  // console.log(gametype)
  // console.log(name)
  // console.log(opnion)
  let errors = [];

  if(!opnion) {
    errors.push({ msg: 'please enter opnion'})
  }
  if (errors.length > 0) {
    res.redirect(`/content/community/${gametype}/${id}`)
  }else{
    const newOpnion = new game_opnion({
      id,
      name,
      opnion,
      gametype
    });
    newOpnion.save()
    .then(opnion => {
      req.flash(
        console.log(opnion),
      );
      res.redirect(`/content/community/${gametype}/${id}`);
    })
    .catch(err => console.log(err));
  }
});

router.post('/community/:gametype/:id_g/:id/del' ,async function(req, res){
  let id = req.params.id
  let id_g = req.params.id_g
  let gametype = req.params.gametype
  await game_opnion.findOneAndDelete({_id: id } )
    return res.redirect(`/content/community/${gametype}/${id_g}`)
});

router.get('/community/:gametype/:id_g/:id/edit',ensureAuthenticated,async function(req ,res) {
  let id = req.params.id
  await game_opnion.findOne({ _id: id} ,function(err , post){
    // console.log(post)
    if (err){
      return next(err);

    }else {
      return res.render('edit_opnion' ,{
        user: req.user,
        post,
        header: "Edit Comment"
      })
    }
  })
});

router.post('/community/:gametype/:id_g/:id/edit',ensureAuthenticated,async function(req,res) {
  let id = req.params.id;
  let gametype = req.params.gametype
  let id_g = req.params.id_g
  // console.log(req.body)
  // console.log(id)
  await game_opnion.findOneAndUpdate({ _id:id },{$set: 
    {
      opnion: req.body.title
    }}, 
    {new: true, useFindAndModify: false} ,
      function(err, result) {
      if (err) { throw err; }
       else 
       {   
        return res.redirect(`/content/community/${gametype}/${id_g}`)
        }
    });
    
});

router.post('/communitys/creategamepost',ensureAuthenticated,async function (req, res) {
  const redirectURL = "community";
  const name = req.user.name;
  const { title, gametype, description } = req.body;
  const gametypes = req.body.gametype
  let errors =[]
  console.log(name);
  console.log(req.body);

  if (req.files !== undefined){
    if (req.files.image.truncated === false){
      // when file size < fileSize limit
      if (req.files.image.size > 0){
        // when file size > 0
        let imageData = req.files.image;
        const extension = imageData.name.substring(
          imageData.name.lastIndexOf("."),
          imageData.name.length
        )
        const fileName = "upload_" + imageData.name + "_" + Date.now() + extension;
        const storePath = path.join(__dirname ,"../") +"/public/commend/" + fileName;  
        let imagepath = "/commend/"  + fileName;                    
        try {
          await imageData.mv(storePath);
        } catch (e) {
          // if an error occur, then delete temp file of uploaded image and redirect
          fs.unlink(imageData.tempFilePath, err => {
            if (err)
              console.log(err.message);
          });
          res.redirect('content/communitys/creategamepost')
        }
        //if upload success, do...
        if( !title || !gametype || !description )
        {
          errors.push({ msg: 'Please enter all fields' });
        }

        if( !title  )
        {
          errors.push({ msg: 'Please enter title fields' });
        }

        if( !gametype )
        {
          errors.push({ msg: 'Please enter gametype fields' });
        }

        if( !description )
        {
          errors.push({ msg: 'Please enter description fields' });
        }

        if ( errors.length > 0 )
        {
          res.render('gamepost', {
            user: req.user,
            errors,
            title,
            gametype,
            description,
            imagepath,
            header: "create game post"
          })
        }else{
          const newPost = new game_post({
              name,
              imagepath,
              title,
              gametype,
              description
              });
            await newPost.save()
            res.redirect(`/content/${redirectURL}/${gametypes}`);
          }
      } else {
        //when file size <= 0
        res.redirect('content/communitys/creategamepost')
            
      }
    } else {
      // when file size limit has been reached.
      res.redirect('content/communitys/creategamepost')
    }
  } else {
    // if have no file uploaded, then do...
    res.redirect('content/communitys/creategamepost')
  }
});

router.get('/communitys/creategamepost',ensureAuthenticated,function (req, res) {
  res.render("gamepost"
  ,{user : req.user,
    header: "create game post"}
  // ,console.log(req.user)
  )
});

//creat post Page
router.get('/createpost',ensureAuthenticated,function (req, res) { 
  res.render("createpost"
  ,{user : req.user,
    header: "create post"}
  // ,console.log(req.user)
  )
});

router.post('/createpost',ensureAuthenticated,async function (req, res) {
  const redirectURL = "/content";
  const Name = req.user.name;
  const { title, gametype, description } = req.body;
  let errors =[]
  // console.log(Name);
  // console.log(req.body);
  if (req.files !== undefined){
    if (req.files.image.truncated === false){
      // when file size < fileSize limit
      if (req.files.image.size > 0){
        // when file size > 0
        let imageData = req.files.image;
        const extension = imageData.name.substring(
          imageData.name.lastIndexOf("."),
          imageData.name.length
        )
        const fileName = "upload_" + imageData.name + "_" + Date.now() + extension;
        const storePath = path.join(__dirname ,"../") +"/public/uploads/" + fileName;  
        let imagepath = "/uploads/"  + fileName;                    
        try {
          await imageData.mv(storePath);
        } catch (e) {
          // if an error occur, then delete temp file of uploaded image and redirect
          fs.unlink(imageData.tempFilePath, err => {
            if (err)
              console.log(err.message);
          });
          res.redirect(`${redirectURL}/createpost?error=${e.message}`);
        }
        //if upload success, do...
        if( !title || !gametype ||!description )
        {
          errors.push({ msg: 'Please enter all fields' });
        }
        if( !title  )
        {
          errors.push({ msg: 'Please enter title fields' });
        }

        if( !gametype )
        {
          errors.push({ msg: 'Please enter gametype fields' });
        }

        if( !description )
        {
          errors.push({ msg: 'Please enter description fields' });
        }
        if ( errors.length > 0 )
        {
          res.render('gamepost', {
            user: req.user,
            errors,
            title,
            gametype,
            description,
            imagepath,
            header: "header: create post"
          })
        }else{
          const newPost = new New({
            errors,
            Name,
            imagepath,
            title,
            gametype,
            description
          });
          await newPost.save()
          res.redirect(`/content/news`);
        }
      } else {
        //when file size <= 0
        res.redirect(`${redirectURL}/createpost`);
      }
    } else {
      // when file size limit has been reached.
      res.redirect(`${redirectURL}/createpost`);
    }
  } else {
    // if have no file uploaded, then do...
    res.redirect(`${redirectURL}/createpost`);
  }
});


module.exports = router;     