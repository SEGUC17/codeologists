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

  bookWeekly: bookWeekly,

  edit_profile_page: function (req, res) { // prepar the edit profile page
    //retrieve the players's record from DB to be able to fill the fields to be changed
    Player.findOne({ username: req.user.username }, function (err, result) {
      if (err)
        res.send(err);
      else {
        res.render('edit_player_page', { err, result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });

      }
    })
  },
  edit_profile_info: function (req, res) { //accepting new info and update the DB record
    Player.findOne({ username: req.user.username }, function (err, result) {
      if (err)
        res.send(err);
      else {
        if (!req.body.name) {
          res.render('edit_player_page', { err: "name field is empty!...enter new name", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
          return;
        } if (!req.body.email) {
          res.render('edit_player_page', { err: "email field is empty!...enter new email", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
          return;
        } if (!req.body.phone_number) {
          res.render('edit_player_page', { err: "phone number field is empty!...enter new phone number", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
          return;
        } if (!req.body.location) {
          res.render('edit_player_page', { err: "location field is empty!...enter new location", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
          return;
        } if (!req.body.old_password) {
          res.render('edit_player_page', { err: "your password is required to confirm changes", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
          return;
        }


        hasher(req.body.old_password).verifyAgainst(result.password, function (err, verified) {
          if (!verified) {
            res.render('edit_player_page', { err: "wrong password !", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
            return;
          }
          else {
            result.name = req.body.name;
            if (req.body.new_password) {
              hasher(req.body.new_password).hash(function (err, hash) {
                if (err)
                  res.send(err);
                else {
                  result.password = hash;
                  if (!validateEmail(req.body.email)) {
                    res.send("wrong email format");
                    return;
                  }
                  result.email = req.body.email;
                  result.phone_number = req.body.phone_number;
                  if (req.files[0]) {
                    result.profile_pic.data = req.files[0].buffer;
                  }
                  result.location = req.body.location;
                  result.birthdate = req.body.birthdate;
                  result.save(function (err) {
                    if (err) {
                      res.send(err);
                      return;
                    } else {
                      res.render('edit_player_page', { err: "information updated successfully", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
                      return;
                    }

                  });


                }
              });
            }
            else {
              if (!validateEmail(req.body.email)) {
                res.send("wrong email format");
                return;
              }
              result.email = req.body.email;
              result.phone_number = req.body.phone_number;
              if (req.files[0]) {
                result.profile_pic.data = req.files[0].buffer;
              }
              result.location = req.body.location;
              result.birthdate = req.body.birthdate;
              result.save(function (err) {
                if (err) {
                  res.send(err);
                  return;
                } else {
                  res.render('edit_player_page', { err: "information updated successfully", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
                  return;
                }

              });
            }
          }
        });
      }

    });
  },
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
  },


}

module.exports = playerController;
