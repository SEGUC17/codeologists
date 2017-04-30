var multer = require('multer');
var fs = require('fs');
var path = require('path');
var Booking = require('../models/Booking');
var Arena = require('../models/Arena');
var ServiceProvider = require('../models/ServiceProvider');
var path = require('path');
let Game = require('../models/Game');
var Player = require('../models/Player');
var hasher = require('password-hash-and-salt');
var async = require('async');

var upload = multer();

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function IndexAPI(req,res){
    res.json(getScheduleIndices(req.params.month,req.params.day));
}

/*
serviceProviderController.getScheduleIndices :
A function that gives the indices in our schedule of some specific day
@param : month1 :the month of the date
@param : day1 : the day of the date
@return : a json object contains the two indices in the schedule, the day index and the week index
*/

var getScheduleIndices = function (month1, day1) {
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var year = date.getFullYear();
    var weekDay = (date.getDay() + 1) % 7;
    var curDate = new Date(year, month1, day1);
    var firstDayInWeek = new Date(date - (weekDay * 1000 * 60 * 60 * 24));
    var difInWeeks = Math.floor((curDate - firstDayInWeek) / 1000 / 60 / 60 / 24 / 7);
    return { weekIndex: difInWeeks, dayIndex: (curDate.getDay() + 1) % 7 };
}

/*
serviceProviderController.getTimeFromIndex :
A function that gets the time from the index
@param : index : the index in the schedule
@return : a string with the time corresponding to that index
*/

var getTimeFromIndex = function (index) {
    var hour = Math.floor(index / 2);
    var minute = '00';
    if (index % 2 == 1)
        minute = '30';
    return hour + ':' + minute;
}

//to be moved to arena controller : edit_arena , createArena, editarenainfo , editdefaultschedule, setUnavailable, setAvailable
//to be moved to booking controller : acceptBooking , acceptBooking2 , handleBooking, rejectBooking,
let serviceProviderController =
    {
        IndexAPI:IndexAPI,
        getScheduleIndices: getScheduleIndices,
        getTimeFromIndex: getTimeFromIndex,
/*
serviceProviderController.getTheMode ;
A function that gets the auto-accept-mode of some service provider
@param : service provider id
@return : a boolean of whether the auto-accept-mode is on or off
*/
        getTheMode: function(req,res){
            if(!req || !req.user || !req.user.username){
                res.json(400, 'Please login');
                return;
            }
            else
            {
                var username = req.user.username;
                if(!req.user)
                {
                    res.json(400,{ error : 'You are not logged in'});
                }
                ServiceProvider.findOne({ username: username }, function (err, user)
                {
                        if (!err && user)
                            res.json(200,{ mode : user.mode});
                        else
                        {
                            res.json(400, 'Please login');
                            return;
                        }
                });
            }
                },

/*
serviceProviderController.turnAutoAcceptModeOn
A function that enables the provider to enable his auto accept mode on
@param : the service provider id
@return : a response for whether the mode has been turned on or not
*/
        turnAutoAcceptModeOn: function (req, res) {
            if (req.user.type != 'ServiceProvider') {
                res.json(403, {error :'You are not authorized to do this action'});
                return;
            }
            var username = req.user.username;
            ServiceProvider.findOne({ username: username }, function (err, user) {
                if (!user) {
                        res.json(403 ,{error :'Try again after logging in'});
                        return;
                }
                else {
                    if (!err) {
                        user.mode = true;
                        user.save(function (err) {
                            if (err)
                                res.json(400 ,{error : 'Error while saving'});
                            else
                                res.json(200 , {success : 'Mode turned on'});
                        });
                    }
                }
            });
        },
/*
serviceProviderController.turnAutoAcceptModeOff
A function that enables the provider to enable his auto accept mode on
@param : the service provider id
@return : a response for whether the mode has been turned off or not
*/
        turnAutoAcceptModeOff: function (req, res) {
            if (req.user.type != 'ServiceProvider') {
                res.json(403, {error :'You are not authorized to do this action'});
                return;
            }
            var username = req.user.username;
            ServiceProvider.findOne({ username: username }, function (err, user) {
                if (!user) {
                   res.json(403 ,{error :'Try again after logging in'});
                   return;
                }
                else {
                    if (!err) {
                        user.mode = false;
                        user.save(function (err) {
                            if (err)
                                res.json(400 ,{error : 'Error while saving'});
                            else
                                res.json(200 , {success : 'Mode turned off'});
                        });
                    }
                }
            });
        },

 /*
serviceProviderController.showblacklist:
retrieve the service provider's blacklist from the DB using his username to display it on the front-end
@param: -
@output: blacklist array
*/
    showblacklist: function(req, res) {

        var serviceProviderUsername = req.user.username;

        ServiceProvider.findOne({ username: serviceProviderUsername }, function(err, serviceProvider) {

            if (err) {
                return res.json(500, { error: err });
            }
            if (serviceProvider == null) {
                return res.json(403, { error: "Please log in as a Service Provider" });
            }
            var blacklist = serviceProvider.blacklist;
            var players = [];


            async.each(blacklist, function(currentPlayer, callback) {
                Player.findById(currentPlayer, function(err2, player) {
                    players.push(player);
                    callback();

                })
            }, function() {
                res.json({ players: players })
            })

        })
    },

/*
serviceProviderController.add_to_blacklist:
adds a certain player to a serviceprovider's blacklist using the player's username
@param: player to be blacklisted username
@output: -
*/

    add_to_blacklist: function(req, res) {

        var playerUsername = req.body.PlayerUsername;
        var serviceProviderUsername = req.user.username;

        ServiceProvider.findOne({ username: serviceProviderUsername }, function(err, serviceProvider) {

            if (err) {
                return res.json(500, { error: err });
            }
            if (serviceProvider == null) {
                return res.json(403, { error: "Please log in as a Service Provider" });
            }

            Player.findOne({ username: playerUsername }, function(err2, player) {

                if (err2) {
                    return res.json(500, { error: err2 });
                }
                if (player == null) {
                    return res.json(400, { error: "Unregistered player" });
                }

                for (var i = 0; i < serviceProvider.blacklist.length; i++) {
                    if (serviceProvider.blacklist[i].equals(player._id)) {
                        return res.json(400, { error: "This player is already black listed" });
                    }
                }
                for (var i = 0; i < serviceProvider.whitelist.length; i++) {
                    if (serviceProvider.whitelist[i].equals(player._id)) {
                        return res.json(400, { error: "This player is already white listed" });
                    }
                }

                serviceProvider.blacklist.push(player);
                serviceProvider.save(function(err3) {
                    if (err3)
                        return res.json(500, { error: "Error in operation. Try again" });
                });
                res.json({ listedPlayer: player, message: "Successfully added to Blacklist" });
            });
        });
    },

/*
serviceProviderController.add_to_blacklist_phone:
adds a certain player to a serviceprovider's blacklist using the player's phone number
@param: player to be blacklisted phone number
@output: -
*/

    add_to_blacklist_phone: function(req, res) {

        var serviceProviderUsername = req.user.username;
        var playerNumber = req.body.phoneNumber;

        ServiceProvider.findOne({ username: serviceProviderUsername }, function(err, serviceProvider) {

            if (err) {
                return res.json(500, { error: err });
            }
            if (serviceProvider == null) {
                return res.json(403, { error: "Please log in as a Service Provider" });
            }

            Player.findOne({ phone_number: playerNumber }, function(err2, player) {

                if (err2) {
                    return res.json(500, { error: err2 });
                }
                if (player == null) {
                    return res.json(400, { error: "Unregistered player" });
                }

                for (var i = 0; i < serviceProvider.blacklist.length; i++) {
                    if (serviceProvider.blacklist[i].equals(player._id)) {
                        return res.json(400, { error: "This player is already black listed" });
                    }
                }
                for (var i = 0; i < serviceProvider.whitelist.length; i++) {
                    if (serviceProvider.whitelist[i].equals(player._id)) {
                        return res.json(400, { error: "This player is already white listed" });
                    }
                }

                serviceProvider.blacklist.push(player);
                serviceProvider.save(function(err3) {
                    if (err3)
                        return res.json(500, { error: "Error in operation. Try again" });
                });
                res.json({ listedPlayer: player, message: "Successfully added to Blacklist" });
            });
        });
    },

/*
serviceProviderController.remove_from_blacklist:
removes a certain player from a serviceprovider's blacklist using the player's username
@param: player to be removed from blacklist username
@output: -
*/

    remove_from_blacklist: function(req, res) {

        var serviceProviderUsername = req.user.username;
        var playerUsername = req.body.PlayerUsername;

        ServiceProvider.findOne({ username: serviceProviderUsername }, function(err, serviceProvider) {

            if (err) {
                return res.json(500, { error: err });
            }
            if (serviceProvider == null) {
                return res.json(403, { error: "Please log in as a Service Provider" });
            }

            Player.findOne({ username: playerUsername }, function(err2, player) {

                if (err2) {
                    return res.json(500, { error: err2 });
                }
                if (player == null) {
                    return res.json(400, { error: "Unregistered player" });
                }

                for (var i = 0; i < serviceProvider.blacklist.length; i++) {

                    if (serviceProvider.blacklist[i].equals(player._id)) {

                        var pos = serviceProvider.blacklist.indexOf(player._id);
                        serviceProvider.blacklist.splice(pos, 1);
                        serviceProvider.save(function(err3) {
                            if (err3)
                                return res.json(500, { error: "Error in operation. Try again" });
                        });
                        return res.json({ message: "Successfully removed from Blacklist" });
                    }
                }
                res.json(400, { error: "This player is not black listed" });
            });
        });
    },

/*
serviceProviderController.showwhitelist:
retrieve the service provider's whitelist from the DB using his username to display it on the front-end
@param: -
@output: whitelist array
*/

    showwhitelist: function(req, res) {

        var serviceProviderUsername = req.user.username;

        ServiceProvider.findOne({ username: serviceProviderUsername }, function(err, serviceProvider) {

            if (err) {
                return res.json(500, { error: err });
            }
            if (serviceProvider == null) {
                return res.json(403, { error: "Please log in as a Service Provider" });
            }
            var whitelist = serviceProvider.whitelist;
            var players = [];


            async.each(whitelist, function(currentPlayer, callback) {
                Player.findById(currentPlayer, function(err2, player) {
                    players.push(player);
                    callback();

                })
            }, function() {
                res.json({ players: players })
            })

        })
    },
/*
serviceProviderController.add_to_whitelist:
adds a certain player to a serviceprovider's whitelist using the player's username
@param: player to be whitelisted username
@output: -
*/
    add_to_whitelist: function(req, res) {

        var serviceProviderUsername = req.user.username;
        var playerUsername = req.body.PlayerUsername;

        ServiceProvider.findOne({ username: serviceProviderUsername }, function(err, serviceProvider) {

            if (err) {
                return res.json(500, { error: err });
            }
            if (serviceProvider == null) {
                return res.json(403, { error: "Please log in as a Service Provider" });
            }

            Player.findOne({ username: playerUsername }, function(err2, player) {

                if (err2) {
                    return res.json(500, { error: err2 });
                }
                if (player == null) {
                    return res.json(400, { error: "Unregistered player" });
                }

                for (var i = 0; i < serviceProvider.whitelist.length; i++) {
                    if (serviceProvider.whitelist[i].equals(player._id)) {
                        return res.json(400, { error: "This player is already Whitelisted" });
                    }
                }
                for (var i = 0; i < serviceProvider.blacklist.length; i++) {
                    if (serviceProvider.blacklist[i].equals(player._id)) {
                        return res.json(400, { error: "This player is already black listed" });
                    }
                }

                serviceProvider.whitelist.push(player);
                serviceProvider.save(function(err3) {
                    if (err3)
                        return res.json(500, { error: "Error in operation. Try again" });
                });
                res.json({ listedPlayer: player, message: "Successfully added to Whitelist" });
            });
        });
    },

/*
serviceProviderController.add_to_whitelist_phone:
adds a certain player to a serviceprovider's whitelist using the player's phone number
@param: player to be whitelisted phonenumber
@output: -
*/
    add_to_whitelist_phone: function(req, res) {

        var serviceProviderUsername = req.user.username;
        var playerNumber = req.body.phoneNumber;

        ServiceProvider.findOne({ username: serviceProviderUsername }, function(err, serviceProvider) {

            if (err) {
                return res.json(500, { error: err });
            }
            if (serviceProvider == null) {
                return res.json(403, { error: "Please log in as a Service Provider" });
            }

            Player.findOne({ phone_number: playerNumber }, function(err2, player) {

                if (err2) {
                    return res.json(500, { error: err2 });
                }
                if (player == null) {
                    return res.json(400, { error: "Unregistered player" });
                }

                for (var i = 0; i < serviceProvider.whitelist.length; i++) {
                    if (serviceProvider.whitelist[i].equals(player._id)) {
                        return res.json(400, { error: "This player is already white listed" });
                    }
                }
                for (var i = 0; i < serviceProvider.blacklist.length; i++) {
                    if (serviceProvider.blacklist[i].equals(player._id)) {
                        return res.json(400, { error: "This player is already black listed" });
                    }
                }

                serviceProvider.whitelist.push(player);
                serviceProvider.save(function(err3) {
                    if (err3)
                        return res.json(500, { error: "Error in operation. Try again" });
                });
                res.json({ listedPlayer: player, message: "Successfully added to Whitelist" });

            });
        });
    },

/*
serviceProviderController.remove_from_whitelist:
removes a certain player from a serviceprovider's whitelist using the player's username
@param: player to be removed from whitelist username
@output: -
*/
    remove_from_whitelist: function(req, res) {

        var serviceProviderUsername = req.user.username;
        var playerUsername = req.body.PlayerUsername;

        ServiceProvider.findOne({ username: serviceProviderUsername }, function(err, serviceProvider) {

            if (err) {
                return res.json(500, { error: err });
            }
            if (serviceProvider == null) {
                return res.json(403, { error: "Please log in as a Service Provider" });
            }

            Player.findOne({ username: playerUsername }, function(err2, player) {

                if (err2) {
                    return res.json(500, { error: err2 });
                }
                if (player == null) {
                    return res.json(400, { error: "Unregistered player" });
                }

                for (var i = 0; i < serviceProvider.whitelist.length; i++) {
                    if (serviceProvider.whitelist[i].equals(player._id)) {
                        var pos = serviceProvider.whitelist.indexOf(player._id);
                        serviceProvider.whitelist.splice(pos, 1);
                        serviceProvider.save(function(err3) {
                            if (err3)
                                return res.json(500, { error: "Error in operation. Try again" });
                        });
                        return res.json({ message: "Successfully removed from Whitelist" });
                    }
                }
                res.json(400, { error: "This player is not White listed" });

            });
        });
    },

        myArenas: function (req, res) {
            Arena.find({ service_provider: req.user._id }, function (err, arenas) {
                if (err) {
                    return res.json({ error: err });
                } else {
                    return res.json(arenas);
                }
            });
        },

/*
serviceProviderController.edit_profile_page:
prepare the edit profile page ,retrieve the player’s record from DB to be able to fill the *fields to be changed.
*@param req.user.username : the user’s username to fetch his record
*@param result : the user’s record from db
*/

       edit_profile_page: function (req, res) { // prepar the edit profile page
            //retrieve the players's record from DB to be able to fill the fields to be changed
            ServiceProvider.findOne({ username: req.user.username }, function (err, result) {
                if (err)
                    res.status(500).json({error : err.message});
                else {
                    res.json({result});

                }
            })
        },

/*
serviceProviderController.edit_profile_info:
using the username retrieve his record from DB and then checking for exceptions using *express-validator then match the password from the user with the password from the db if it *correct we edit the record from the db with the new info from the user and save it again.
*@param req.user.username : the user’s username to fetch his record
*@param req.body.name : the user’s updated name
*@param req,body.phone_number:the user’s updated phone_number
*@param req.body.new_password : the user’s new password
*@param req.body.old_password: the user’s current password
*@param req.body.location : the user’s updated location
*@param req.body.email : the user’s updated email
*@param req.body.profile_pic : the user’s new profile picture
*@param result : the user’s record after being updated
*/

        edit_profile_info: function (req, res) { //accepting new info and update the DB record
            ServiceProvider.findOne({ username: req.user.username}, function (err, result) {
                if (err)
                    res.status(500).json({error: err.message});
                else {
                  req.checkBody('name', 'Name is required.').notEmpty();
                    req.checkBody('old_password', 'Password is required.').notEmpty();
                    req.checkBody('email', 'Email wrong format').isEmail();
                    req.checkBody('email', 'Email is required.').notEmpty();
                    req.checkBody('phone_number', 'Phone number is required.').notEmpty();
                    req.checkBody('phone_number','not a number.').isNumeric();
                    if(req.body.new_password)
                    req.checkBody('new_password', 'Password length is less than 8').isLength({min :8});
                    var errors = req.validationErrors();

                  if(errors)
                  return res.status(400).json({errors,result});


                    hasher(req.body.old_password).verifyAgainst(result.password, function (err, verified) {
                        if (err) {
                            res.status(500).json({error:err.message});
                            return;
                        }
                        else {
                            if (!verified) {
                                res.status(422).json({errors:[{param : 'old_password',msg:'wrong password !'}],result });
                                return;
                            } else {
                                result.name = req.body.name;
                                if (req.body.new_password) {
                                    hasher(req.body.new_password).hash(function (err, hash) {
                                        result.password = hash;
                                        result.email = req.body.email;
                                        result.phone_number = req.body.phone_number;
                                        if (req.files[0]) {
                                            result.profile_pic.data = req.files[0].buffer;
                                        }
                                        if (req.body.mode == "on")
                                            result.mode = true;
                                        else
                                            result.mode = false;
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
                                              return res.status(400).json({errors,result});
                                            } else
                                                return res.status(500).json({error : 'internal error'});
                                            } else {
                                                res.json({ message: "information updated successfully", result });
                                                return;
                                            }
                                        });

                                    });
                                }
                                else {
                                    result.email = req.body.email;
                                    result.phone_number = req.body.phone_number;
                                    if (req.files[0]) {
                                        result.profile_pic.data = req.files[0].buffer;
                                    }
                                    if (req.body.mode == "on")
                                        result.mode = true;
                                    else
                                        result.mode = false;
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
                                          return res.status(400).json({errors,result});
                                        } else
                                            return res.status(500).json({error : 'internal error'});
                                        } else {
                                            res.json({ message: "information updated successfully", result });
                                            return;
                                        }
                                    });
                                }
                            }

                        }
                    });
                }

            });
        }

    }

module.exports = serviceProviderController;
