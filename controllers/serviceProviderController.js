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
            ServiceProvider.findOne({ username: req.user.username }, function (err, result) {
                if (err)
                    res.status(500).json({error: err.message});
                else {
                    if (!req.body.name) {
                        res.status(422).json( { error: "name field is empty!...enter new name", result });
                        return;
                    } if (!req.body.email) {
                        res.status(422).json( { error: "email field is empty!...enter new email", result });
                        return;
                    } if (!req.body.phone_number) {
                        res.status(422).json( { error: "phone number field is empty!...enter new phone number", result });
                        return;
                    } if (!req.body.old_password) {
                        res.status(422).json( { error: "your password is required to confirm changes", result });
                        return;
                    }

                    hasher(req.body.old_password).verifyAgainst(result.password, function (err, verified) {
                        if (err) {
                            res.status(500).json(error:err.message);
                            return;
                        }
                        else {
                            if (!verified) {
                                res.status(422).json({ error: " wrong password" });
                                return;
                            } else {
                                result.name = req.body.name;
                                if (req.body.new_password) {
                                    hasher(req.body.new_password).hash(function (err, hash) {
                                        result.password = hash;
                                        if (!validateEmail(req.body.email)) {
                                            res.status(422).json({error:"wrong email format"});
                                            return;
                                        }
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
                                    if (!validateEmail(req.body.email)) {
                                        res.status(422).json({error:"wrong email format"});
                                        return;
                                    }
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
