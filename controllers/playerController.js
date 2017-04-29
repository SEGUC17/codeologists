let Player = require('../models/Player');
var fs = require('fs');
var path = require('path');
var hasher = require('password-hash-and-salt');
var serviceProviderController = require('./serviceProviderController');
var Arena = require('../models/Arena');
var Booking = require('../models/Booking');
var ServiceProvider = require('../models/ServiceProvider');
var Game = require('../models/Game');
var arenaController = require('./arenaController');
var async = require('async');



function date_calc(year, month, day) {
  if (month < 10)  //if month is one digit pad it with zero
  month = "0" + month;
  if (day < 10)    //if day is one digit pad it with zero
  day = "0" + day;
  return year + "-" + month + "-" + day;
}
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/*
playerController.compute:
takes the result from search method then compute the paging attributes and send them with *the result
*@param result : result passed from the search function
*@param req : the req passed from the search function
*@param res : the res passed from the search function
*@param count : the number of pages to be displayed
*@param start : the position in result from which the page will start to display elements
*@param end : the position in result at which the page will stop displaying elements
*@param active : the index of the active page
*/
function compute(req, res, result) {
  if (result.length == 0) {
    res.status(404).json({error:"no Arena matches your value"});
    return;
  } else {
    var tmp = 0;
    if (!req.body.index || req.bor.index == '')  // in case the page diplayed for the first time not as a result of selecting page index; index will not exit in the body
      tmp = 1;                                                                                                     // so we set it to one
    else
      tmp = req.body.index;
    var count = Math.ceil(result.length / 10);
    var start = (tmp - 1) * 10;
    var end = tmp == count ? result.length : tmp * 10;
    var active = tmp;  //to indicate the active page rightnow

    res.json({result,count,start,end,active});
    return;
  }
}


var bookWeekly = function (req, res) {
  var indicies = SpController.getScheduleIndicies(month, day);
  Arena.findById(req.params.arenaId, function (err, foundArena) {
    if (err) {
      res.send("No such Arena");

    }
    else {

    }
  })
}
//should be moved to bookingController :cancelBooking,createBooking,playerRateBooking
//should be moved to gameContwroller : createGame , requestgame , acceptrequest , rejectrequest,viewgames
//should be moved to arenaController : commentOnArena,commentOnArena

let playerController = {

 /*
playerController.search:
retrieve and view arenas matched the attribute value selected by the user after eliminating *the arenas in which the user is blacklisted
*@param search_type : the type of the search; price or name or location
*@param search_value : the required value of the search type
*@param req.user._id: the player’s id to find out if he is in blacklist of certain arena’s servic *provider
*@param result : the final array of arenas the player can see after eliminating those who is blacklisted in
*/

  search:function(req,res){
              var search_type = req.body.search_type;
              var search_value = req.body.search_value;
              var result =[];
              var limit = req.body.limit;
              req.checkBody('search_value','search_value is empty!...enter a value').notEmpty();
              if(req.validationErrors())
                  return res.status(400).json({error:"search_value is empty!...enter a value."});
              if (search_type == "price") {
                req.checkBody('search_value','price must be a number.').isNumeric();

              var errors = req.validationErrors();

            if(errors)
            return res.status(400).json({error:"price must be a number."});

                      Arena.find({ price: search_value }, function (err, doc) {
                      if (err)
                       res.status(500).json({error: err.message});

                      else {
                        async.each(doc, function (currentArena, callback){
                                  var boolean = true;
                                  ServiceProvider.findById(currentArena.service_provider,function(err,provider){
                                    if(err)
                                    res.status(500).json({error : "internal error happened"});
                                    else{
                                    for (var i = 0; i < provider.blacklist.length; i++) {
                                      if(provider.blacklist[i] == req.user._id)
                                          boolean = false;
                                    }
                                    if(boolean)
                                        result.push(currentArena);
                                    }
                                      callback();
                                  });

                               },function(){
                                 compute(req,res,result);
                               });



                 }
              });
              } else if (search_type == "location") {
                  if(limit == 0)
                  {
                    Arena.find({ location: {'$regex' : '.*' + search_value + '.*'}}, function (err, doc) {
                      if (err)
                       res.status(500).json({error: err.message});
                      else {
                        async.each(doc, function (currentArena, callback){
                                  var boolean = true;
                                  ServiceProvider.findById(currentArena.service_provider,function(err,provider){
                                    if(err)
                                    res.status(500).json({error : "internal error happened"});
                                    else{
                                    for (var i = 0; i < provider.blacklist.length; i++) {
                                      if(provider.blacklist[i] == req.user._id)
                                          boolean = false;
                                    }
                                    if(boolean)
                                        result.push(currentArena);
                                    }
                                      callback();
                                  });

                               },function(){
                                 compute(req,res,result);
                               });
                 }
                    });
                  }
                  else
                  {
                    Arena.find({ location: {'$regex' : '.*' + search_value + '.*'}}, function (err, doc) {
                      if (err)
                       res.status(500).json({error: err.message});
                      else {
                        async.each(doc, function (currentArena, callback){
                                  var boolean = true;
                                  ServiceProvider.findById(currentArena.service_provider,function(err,provider){
                                    if(err)
                                    res.status(500).json({error : "internal error happened"});
                                    else{
                                    for (var i = 0; i < provider.blacklist.length; i++) {
                                      if(provider.blacklist[i] == req.user._id)
                                          boolean = false;
                                    }
                                    if(boolean)
                                        result.push(currentArena);
                                    }
                                      callback();
                                  });

                               },function(){
                                 compute(req,res,result);
                               });



                 }
               });
                  }
              } else {
                        if(limit == 0)
                        {
                          Arena.find({ name: {'$regex' : '.*' + search_value + '.*'}}, function (err, doc) {
                            if (err)
                             res.status(500).json({error: err.message});
                            else {
                              async.each(doc, function (currentArena, callback){
                                        var boolean = true;
                                        ServiceProvider.findById(currentArena.service_provider,function(err,provider){
                                          if(err)
                                          res.status(500).json({error : "internal error happened"});
                                          else{
                                          for (var i = 0; i < provider.blacklist.length; i++) {
                                            if(provider.blacklist[i] == req.user._id)
                                                boolean = false;
                                          }
                                          if(boolean)
                                              result.push(currentArena);
                                          }
                                            callback();
                                        });

                                     },function(){
                                       compute(req,res,result);
                                     });



                       }
                          });
                        }
                        else
                        {
                          Arena.find({ name: {'$regex' : '.*' + search_value + '.*'}}, function (err, doc) {
                            if (err)
                             res.status(500).json({error: err.message});
                            else {
                              async.each(doc, function (currentArena, callback){
                                        var boolean = true;
                                        ServiceProvider.findById(currentArena.service_provider,function(err,provider){
                                          if(err)
                                          res.status(500).json({error : "internal error happened"});
                                          else{
                                          for (var i = 0; i < provider.blacklist.length; i++) {
                                            if(provider.blacklist[i] == req.user._id)
                                                boolean = false;
                                          }
                                          if(boolean)
                                              result.push(currentArena);
                                          }
                                            callback();
                                        });

                                     },function(){
                                       compute(req,res,result);
                                     });



                       }
                     }).limit(4);
                        }
              }
  },

  bookWeekly: bookWeekly,

/*
playerController.edit_profile_page:
prepare the edit profile page ,retrieve the player’s record from DB to be able to fill the *fields to be changed.
*@param req.user.username : the user’s username to fetch his record
*@param result : the user’s record from db
*@param date : the user’s birthdate after being formatted according to the html format
*/

  edit_profile_page: function (req, res) { // prepar the edit profile page
    //retrieve the players's record from DB to be able to fill the fields to be changed
    Player.findOne({ username: req.user.username }, function (err, result) {
      if (err)
        res.status(500).json({error: err.message});
      else {
        res.json({result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });

      }
    })
  },

 /* playerController.edit_profile_info:
 using the username retrieve his record from DB and then checking for exceptions using *express-validator then match the password from the user with the password from the db if it *correct we edit the record from the db with the new info from the user and save it again.
*@param req.user.username : the user’s username to fetch his record
*@param req.body.name : the user’s updated name
*@param req,body.phone_number:the user’s updated phone_number
*@param req.body.new_password : the user’s new password
*@param req.body.old_password: the user’s current password
*@param req.body.location : the user’s updated location
*@param req.body.email : the user’s updated email
*@param req.body.birthdate: the user’s updated birthdate
*@param req.body.profile_pic : the user’s new profile picture
*@param result : the user’s record after being updated
*@param date : the user’s birthdate after being updated and formatted according to the html format
*/

  edit_profile_info: function (req, res) { //accepting new info and update the DB record
    var result_err = [];
    Player.findOne({ username: req.user.username }, function (err, result) {
      if (err)
          res.status(500).json({error: err.message});
      else {

       req.checkBody('name', 'Name is required.').notEmpty();
         req.checkBody('old_password', 'Password is required.').notEmpty();
         req.checkBody('email', 'Email wrong format').isEmail();
         req.checkBody('email', 'Email is required.').notEmpty();
         req.checkBody('location', 'Location is required.').notEmpty();
         req.checkBody('phone_number', 'Phone number is required.').notEmpty();
           req.checkBody('phone_number','not a number.').isNumeric();
           if(req.body.new_password)
           req.checkBody('new_password', 'Password length is less than 8').isLength({min :8});

         var errors = req.validationErrors();

       if(errors)
       return res.status(400).json({errors,result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate())});

        hasher(req.body.old_password).verifyAgainst(result.password, function (err, verified) {
          if (!verified) {
            res.status(422).json({ errors:[{param : 'old_password',msg:'wrong password !'}], result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
            return;
          }
          else {
            result.name = req.body.name;
            if (req.body.new_password) {
              hasher(req.body.new_password).hash(function (err, hash) {
                if (err)
                    res.status(500).json({error: err.message});
                else {
                  result.password = hash;

                  result.email = req.body.email;
                  result.phone_number = req.body.phone_number;
                  if (req.files[0]) {
                    result.profile_pic.data = req.files[0].buffer;
                  }
                  result.location = req.body.location;
                  result.birthdate = req.body.birthdate;
                  result.save(function (err) {
                    if (err) {
                      if(err.code == 11000){
                        var errors = [];
                        var field = err.message.split('index: ')[1];
                         field = field.split(' dup key')[0];
                         field = field.substring(0, field.lastIndexOf('_'));
                             if(field == 'phone_number')
                               errors.push({param: 'phone_number',msg:'phone number already in use'});
                              else
                                errors.push({param: 'email',msg:'email already in use'});
                      return res.status(400).json({errors,result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate())});
                    } else
                        return res.status(500).json({error : 'internal error'});
                    } else {
                      res.json({ message: "information updated successfully", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
                      return;
                    }

                  });
                }
              });
            }
            else {
              result.email = req.body.email;
              result.phone_number = req.body.phone_number;
              if (req.files[0]) {
                result.profile_pic.data = req.files[0].buffer;
              }
              result.location = req.body.location;
              result.birthdate = req.body.birthdate;
              result.save(function (err) {
                if (err) {
                    if(err.code == 11000){
                      var errors = [];
                      var field = err.message.split('index: ')[1];
                       field = field.split(' dup key')[0];
                       field = field.substring(0, field.lastIndexOf('_'));
                           if(field == 'phone_number')
                             errors.push({param: 'phone_number',msg:'phone number already in use'});
                            else
                             errors.push({param: 'email',msg:'email already in use'});
                    return res.status(400).json({errors,result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate())});
                  } else
                      return res.status(500).json({error : 'internal error'});
                } else {
                  res.json({ message: "information updated successfully", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
                  return;
                }

              });
            }
          }
        });
      }

    });
  },

  getPlayer: function (req, res) {
    Player.findById(req.params.id, function (err, player) {
      if(err)
      return res.status(400).json({error: err.message});
      return res.json({player: player});
    })
  },
/*
playerController.myNotifications:
@param req.user.username :the current user
@return :returns the list  of   the notifications belonging to  the current user
*/

  myNotifications:function(req,res){
    var currentuser = req.user.username;
   Player.findOne({ username: currentuser }, function (err,player) {
        if (err) {
        res.status(400).json({ error: err });
        return;
        } else {
            // if(player==null){
            //     res.json([]);
            //     return;
            // }
            // console.log(player);
            res.json(player.notifications);
            return;
        }
    });
  }
}

module.exports = playerController;
