// dependecies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var nodemon=require('nodemon');
var path=require('path');

var session = require('express-session');

var passport = require('passport');


//database connection url
var db_url = "mongodb://localhost:27017/db";
mongoose.Promise = Promise;


// config app
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname,'views'));
mongoose.connect(db_url);
app.use(express.static(__dirname+ '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());



app.use(passport.initialize());
app.use(passport.session());
app.use(require('./routes/router.js'));

schedule.scheduleJob({hour:00,minute:00,dayOfWeek:5},systemController.updateSchedule);

//start server
app.listen(8080,function(){
  console.log("app listening on port 8080");
});
