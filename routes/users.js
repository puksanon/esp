const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/user');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login',{ user: req.user}));


// Register Page
router.get('/register',forwardAuthenticated, (req, res) => res.render('register' ,{ user: req.user}));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }
  

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2 
    });   
  } else {
    User.findOne({ email: email }).then(user => {
      User.findOne({ name: name}).then(users =>{
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } 
        else  if(users) {
          errors.push({ msg: 'Name already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        }
        else{
          const newUser = new User({
            name,
            email,
            password
          });
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then(user => {
                    req.flash(
                      // console.log(user),
                      'success_msg',
                      'You are now registered and can log in'
                    );
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              });
            });
        }
      });
    })
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);

  console.log(req.body)
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;