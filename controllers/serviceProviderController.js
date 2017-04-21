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

let serviceProviderController =
    {
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
                                                res.status(500).json({error:err.message});
                                                return;
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
                                            res.status(500).json({error : err.message});
                                            return;
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
