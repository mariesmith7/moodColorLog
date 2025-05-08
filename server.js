// newly add
require('dotenv').config();

// // dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// var configDB = require('./config/database.js');
// newly added
var configDB = process.env.DB_STRING;
var db


// connect to mongo
/* mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database

  require('./app/routes.js')(app, passport, db);
});
*/

//newly added
mongoose.connect(configDB, (err, database) => {
  if (err) return console.log(err);
  db = database;

  require('./app/routes.js')(app, passport, db);
});



// passport config
require('./config/passport.js')(passport);

// middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

app.set('view engine', 'ejs');


// session & passport
app.use(session({

  
  // newly added
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// start
app.listen(port);
console.log('The magic happens on port ' + port);