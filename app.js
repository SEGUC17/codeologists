// dependecies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var nodemon=require('nodemon');
var path=require('path');
var Arena = require('./models/Arena');
var Player = require('./models/Player');
var serviceProvider = require('./models/ServiceProvider');
var Booking = require('./models/Booking');
var schedule = require('node-schedule');
var systemController = require("./controllers/systemController");
//TODO:
//Phone Number and email in registered user model should be unique
//change bookMonth,bookDay to be required in model of Booking
// and remove bookWeek attribute 

//add .pre("save" ) to make sure that the combination of the Arena name and location is unique in arena model !

//database connection url
var db_url = "mongodb://localhost:27017/db";



// config app
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname,'views'));
mongoose.connect(db_url);
app.use(express.static(__dirname+ '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(require('./routes/router.js'));
//console.log(Math.floor((new Date(2017,3,1)-new Date())/(1000*3600)));
//start server


schedule.scheduleJob({hour:00,minute:00,dayOfWeek:5},systemController.updateSchedule);




app.listen(8080,function(){
  console.log("app listening on port 8080");
});
