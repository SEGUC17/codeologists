// dependecies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var nodemon = require('nodemon');
var path = require('path');
var stripe = require("stripe")("sk_test_Ny38x1Z7YQaYzmFq0YwMPP2w");
var schedule = require('node-schedule');
var session = require('express-session');
var systemController = require('./controllers/systemController');
var passport = require('passport');
var flash = require('connect-flash');
var Booking = require('./models/Booking');
var Arena = require('./models/Arena');
var logger = require('morgan');
var validator = require('express-validator');
var serviceProviderController = require('./controllers/serviceProviderController');
schedule.scheduleJob({ hour: 07, minute: 00, dayOfWeek: 6 }, systemController.updateSchedule);
var router =    require('./routes/router');
//database connection url
var db_url = "mongodb://localhost:27017/db";
mongoose.Promise = Promise;

app.use(logger('dev'));
// config app
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
mongoose.connect(db_url);
app.use(express.static(path.resolve(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: false , limit: 300*1024}));
app.use(validator());
app.use(cookieParser());

app.use(session({
  secret: "TKR]s$s,<<MXv0#&!F!%IWw/4KiVJs=HYqrvagQV",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(logger('short'));
// stripe specific routes

app.use(router);





//router

//start server
app.listen(8080, function () {
  console.log("app listening on port 8080");
});
