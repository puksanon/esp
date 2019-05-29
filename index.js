const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express()
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const fileupload = require('express-fileupload')
app.use(flash());

//mongoose
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI;
require('./config/passport')(passport);

//Get the default connection
mongoose.connect(db, { useNewUrlParser: true})
.then(() => console.log('mongoDB connect..'))
.catch(err => console.log(err));

//body parser
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

//cors
const cors = require('cors');
app.use(cors());

//cook paser
const cookiepaser = require('cookie-parser');
app.use(cookiepaser());

var sass = require('node-sass-middleware');
//sass file
 app.use(
     sass({
         src: __dirname + '/public/sass',    // Input SASS files
         dest: __dirname + '/public/css', // Output CSS
         debug: false                
     })
 );

 app.set('view engine' , 'ejs');

// Express session
app.use(
    session({
      cookie: {age: 3000},
      secret: 'esp2019',
      resave: true,
      saveUninitialized: true
    })
  );

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash

 //ststicfile file
 app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))

// Middleware for fileupload
app.use(
  fileupload({
    limits: { filesize: 3 * 1024 * 1024 /* 3 MB */},
    abortOnLimit: true,
    limitHandler: (res) => {
      return res.json( { status: "File size limit has been reached." });
    },
    useTempFiles: true,
    tempFileDir: __dirname + "/tmp/"
  })
);

const Router = require('./routes/index');
const UserRouter = require('./routes/users');
const NewRouter = require('./routes/content');
//get pages
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
app.use('/', Router);

//sing in function 
app.use('/users', UserRouter);

//new post func
app.use('/content', NewRouter);


app.get('/', Router)
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))