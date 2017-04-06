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


var acceptBooking = function (booking) {
    Arena.findOne({ _id: booking.arena }, function (err, arenaa) {
        var schedule = arenaa.schedule;
        var indices = getScheduleIndices(booking.bookMonth, booking.bookDay);
        var dayIndex = indices.dayIndex;
        var weekIndex = indices.weekIndex;
        var start = booking.start_index;
        var end = booking.end_index;
        var ok = true;
        for (var i = start; i <= end; i++) {
            if (schedule[weekIndex][dayIndex][i] != 0) {
                ok = false;
                break;
            }
        }
        if (ok) {
            Booking.find({ arena: arenaa._id, bookDay: booking.bookDay, bookMonth: booking.bookMonth }
                , function (err, allBookings) {
                    if (!err) {
                        async.each(allBookings, function (currentBooking, callback) {
                            if (!(currentBooking.accepted) && !(currentBooking._id.equals(booking._id))) {
                                var start1 = currentBooking.start_index;
                                var end1 = currentBooking.end_index;
                                if ((start1 >= start && start1 <= end) || (end1 >= start && end1 <= end)) {
                                    Arena.findOne({ _id: currentBooking.arena }, function (err, arenaa) {
                                        var notification = 'Unfortunately,your booking on day ' + (currentBooking.bookDay) + ' on month ' +
                                            (currentBooking.bookMonth) + ' for ' + (arenaa.name) + ' from '
                                            + getTimeFromIndex(start1) + ' to ' + getTimeFromIndex(end1) + ' has been rejected';
                                        Player.findOne({ _id: currentBooking.player }, function (err, playerr) {
                                            playerr.notifications.push(notification);
                                            playerr.save();
                                            Booking.remove({ _id: currentBooking._id }, function (err, result) {

                                            });

                                        });
                                    });
                                }
                            }
                        }, function (err) {
                        })
                    }
                    for (var i = start; i <= end; i++) {
                        arenaa.schedule[weekIndex][dayIndex][i] = booking._id;
                    }
                    arenaa.accepted = true;
                    arenaa.markModified('schedule');
                    arenaa.save(function (err) {

                    })
                });
        }
    })
}

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

var getTimeFromIndex = function (index) {
    var hour = Math.floor(index / 2);
    var minute = '00';
    if (index % 2 == 1)
        minute = '30';
    return hour + ':' + minute;
}

function viewBookings(req, res) {
    Arena.findById(req.params.arenaId, function (err, foundArena) {
        if (err || !foundArena) {
            if (err)
                throw (err);
            res.send("Sorry Broken Link, this arena may have been deleted, removed or is no longer existant");

        }
        else {
            ServiceProvider.findById(foundArena.service_provider, function (errSp, serviceProvider) {
                if (errSp) {
                    res.send("Internal server Error, Sorry for the inconvenience !");
                }
                else if (serviceProvider) {

                    if (serviceProvider.username == req.user.username) {
                        //find all pending requests where the request time is greater than today, the arena is the current arena  and have not been accepted
                        Booking.find({ accepted: false, arena: foundArena._id }).$where('(new Date(new Date().getFullYear(),this.bookMonth,this.bookDay))>(new Date())').exec(function (err, bookingArr) {
                            //TODO: render a view (will be done in Sprint 2 ISA)
                            if (err) {
                                res.json("Error finding pending requests");
                            }
                            else {

                                res.json(bookingArr);
                            }

                        })
                    }
                }
                else {
                    res.send("Internal Server Error sorry :'(");
                };
            })

        }
    })
        ;

}


let serviceProviderController =
    {
        acceptBooking: acceptBooking,
        getScheduleIndices: getScheduleIndices,
        getTimeFromIndex: getTimeFromIndex,
        turnAutoAcceptModeOn: function (req, res) {
            if (req.user.type != 'ServiceProvider') {
                res.send('You are not authorized to do this action');
                return;
            }
            var username = req.user.username;
            ServiceProvider.findOne({ username: username }, function (err, user) {
                if (!user) {
                    res.send('Try again after logging in');

                }
                else {
                    if (!err) {
                        user.mode = true;
                        user.save(function (err) {
                            if (err)
                                res.send(err);
                        });
                    }
                }
            });
        },

        turnAutoAcceptModeOff: function (req, res) {
            if (req.user.type != 'ServiceProvider') {
                res.send('You are not authorized to do this action');
                return;
            }
            var username = req.user.username;
            ServiceProvider.findOne({ username: username }, function (err, user) {
                if (!user) {
                    res.send('Try again after logging in');

                }
                else {
                    if (!err) {
                        user.mode = false;
                        user.save(function (err) {
                            if (err)
                                res.send(err);
                        });
                    }
                }
            });
        },

        acceptBooking2: function (req, res) {
            if (req.user.type != 'ServiceProvider') {
                res.send('You are not authorized to do this');
                return;
            }
            Booking.findById(req.body.bookingId, function (err, bookingObj) {
                if (err || !bookingObj)
                    res.send("no such booking or bad request");
                else {
                    var booking = bookingObj;
                    Arena.findOne({ _id: booking.arena }, function (err, arenaa) {
                        if (!arenaa.service_provider.equals(req.user._id)) {
                            res.send('You are not authorized to do this');
                            return;
                        }
                        var schedule = arenaa.schedule;
                        var indices = getScheduleIndices(booking.bookMonth, booking.bookDay);
                        var dayIndex = indices.dayIndex;
                        var weekIndex = indices.weekIndex;
                        var start = booking.start_index;
                        var end = booking.end_index;
                        var ok = true;
                        for (var i = start; i <= end; i++) {
                            if (schedule[weekIndex][dayIndex][i] != 0) {
                                ok = false;
                                break;
                            }
                        }
                        if (!ok) {
                            res.send('This is not a free time');
                        }
                        else {
                            Booking.find({ arena: arenaa._id, bookDay: booking.bookDay, bookMonth: booking.bookMonth }
                                , function (err, allBookings) {
                                    if (!err && allBookings) {
                                        async.each(allBookings, function (currentBooking, callback) {
                                            if (!(currentBooking.accepted) && !(currentBooking._id.equals(booking._id))) {
                                                var start1 = currentBooking.start_index;
                                                var end1 = currentBooking.end_index;
                                                if ((start1 >= start && start1 <= end) || (end1 >= start && end1 <= end)) {
                                                    Arena.findOne({ _id: currentBooking.arena }, function (err, arenaa) {
                                                        if (!err && arenaa) {
                                                            var notification = 'Unfortunately,your booking on day ' + (currentBooking.bookDay) + ' on month ' +
                                                                (currentBooking.bookMonth) + ' for ' + (arenaa.name) + ' from '
                                                                + getTimeFromIndex(start1) + ' to ' + getTimeFromIndex(end1) + ' has been rejected';
                                                            Player.findOne({ _id: currentBooking.player }, function (err, playerr) {
                                                                if (!err && playerr) {
                                                                    playerr.notifications.push(notification);
                                                                    playerr.save();
                                                                    Booking.remove({ _id: currentBooking._id }, function (err, result) {

                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        }, function (err) {
                                            res.send('there are conflicting bookings');
                                        })
                                    }
                                    for (var i = start; i <= end; i++) {
                                        arenaa.schedule[weekIndex][dayIndex][i] = booking._id;
                                    }

                                    bookingObj.accepted = true;
                                    bookingObj.save(function (err) {
                                        if (err)
                                            res.send(err);
                                    })

                                    arenaa.markModified('schedule');
                                    arenaa.save(function (err) {
                                        if (err)
                                            res.send('error while saving');
                                        else
                                            res.send('done');
                                    })
                                });
                        }
                    })
                }
            })
        },



        handleBooking: function (id) {
            Booking.findOne({ _id: id }, function (err, booking2) {
                if (err || !booking2)
                    res.send('There is no such booking');
                else
                    Arena.findOne({ _id: booking2.arena }, function (err, arena) {
                        if (err || !arena)
                            res.send('Not a valid booking');
                        else
                            ServiceProvider.findOne({ _id: arena.service_provider }, function (err, serviceProvider) {
                                if (err || !serviceProvider)
                                    res.send('Not a valid booking');
                                else {
                                    if (serviceProvider.mode == true)
                                        acceptBooking(booking2);
                                }
                            })
                    });
            });
        },
        rejectBooking: function (req, res) {
            if (!(req.body.bookingId))
                res.send('Missing field');
            if (req.user.type != 'ServiceProvider') {
                res.send('You are not authorized to do this');
                return;
            }
            var bookingID = req.body.bookingId;
            Booking.findOne({ _id: bookingID }, function (err, curBooking) {
                if (err || !curBooking) {
                    res.send('Not a valid Booking');
                    return;
                }
                Arena.findOne({ _id: curBooking.arena }, function (err, arenaa) {

                    var arenaName = arenaa.name;
                    if (err || !arenaa) {
                        res.send('Not a valid Booking');
                    }
                    else {
                        var indices = getScheduleIndices(curBooking.bookMonth, curBooking.bookDay);
                        var dayIndex = indices.dayIndex;
                        var weekIndex = indices.weekIndex;
                        var start = curBooking.start_index;
                        var end = curBooking.end_index;
                        var notification = 'Unfortunately,your booking on day ' + (curBooking.bookDay) + ' on month ' +
                            (curBooking.bookMonth) + ' for ' + (arenaa.name) + ' from '
                            + getTimeFromIndex(start) + ' to ' + getTimeFromIndex(end) + ' has been rejected';

                        Player.findOne({ _id: curBooking.player }, function (err, playerr) {
                            playerr.notifications.push(notification);
                            playerr.save();
                            Booking.remove({ _id: curBooking._id }, function (err, result) {
                                if (err)
                                    res.send(err);
                            });
                        });
                    }
                });
            });
        },
        viewarena: function (req, res) {
            Arena.findOne({ _id: req.params.arenaid }, function (err, arena) {
                res.render('arena', { arena: arena });
            });
        },
        editarena: function (req, res) {
            var arenaid = req.params.arenaid;
            Arena.findOne({ _id: arenaid }, function (err, arena) {
                if (err) {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
                if (!arena) {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
                if (req.user && arena.service_provider == req.user._id) {
                    return res.render('editarena', { arena: arena });
                } else {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
            });
        },
        editarenainfo: function (req, res, nxt) {
            var arenaid = req.params.arenaid;
            Arena.findOne({ _id: arenaid }, function (err, arena) {
                if (err) {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
                if (!arena) {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
                if (req.user && arena.service_provider == req.user._id) {
                    arena.rules_and_regulations = req.body.rules_and_regulations;
                    arena.address = req.body.address;
                    arena.location = req.body.location;
                    arena.size = req.body.size;
                    arena.type = req.body.type;
                    arena.price = req.body.price;
                    arena.save(function (err) {
                        if (err) {
                            console.log(err);
                            return nxt(err);
                        }
                        req.flash('info', 'your arena info is updated successfully');
                        return res.redirect('/viewarena/' + arenaid);
                    });
                } else {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
            });
        },
        editdefaultschedule: function (req, res, nxt) {
            var arenaid = req.params.arenaid;
            Arena.findOne({ _id: arenaid }, function (err, arena) {
                if (err) {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
                if (!arena) {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
                if (req.user && arena.service_provider == req.user._id) {
                    var new_sch = new Array(7).fill(new Array(48).fill(0));
                    if (req.body.schedule) {
                        var ds = req.body.schedule;

                        for (var i = 0; i < ds.length; i++) {
                            var sa = ds[i].split(",");
                            var x = parseInt(sa[0]);
                            var y = parseInt(sa[1]);
                            new_sch[x][y] = -1;
                        }
                    }
                    arena.default_weekly_schedule = new_sch;
                    arena.save(function (err) {
                        if (err) {
                            console.log(err);
                            return nxt(err);
                        }
                    });
                    req.flash('info', 'your default schedule is updated successfully');
                    return res.redirect('/viewarena/' + arenaid);
                } else {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
            });
        },
        addimage: function (req, res, nxt) {
            var newimage = { data: req.files[0].buffer };
            var arenaid = req.params.arenaid;
            Arena.findOne({ _id: arenaid }, function (err, arena) {
                if (err) {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
                if (!arena) {
                    req.flash('error', 'this page is not available');
                    return res.redirect('/');
                }
                if (req.user && arena.service_provider == req.user._id) {
                    arena.photos.push(newimage);
                    arena.save(function (err) {
                        if (err) {
                            console.log(err);
                            return nxt(err);
                        }
                    });
                    req.flash('info', 'your new arena image is uploaded successfully');
                    return res.redirect('/viewarena/' + arenaid);
                } else {
                    req.flash('error', 'this page is not available');
                    res.redirect('/');
                }
            });
        },

        /**
     * adds a player to the black list using username.
     */
        add_to_blacklist: function (req, res) {

            var playerUsername = req.body.Pusername;
            var serviceProviderUsername = req.user.username;

            ServiceProvider.findOne({ username: serviceProviderUsername }, function (err, serviceProvider) {
                if (err || (serviceProvider == null)) {
                    return res.send("Error in operation.\nTry Again");
                }
                Player.findOne({ username: playerUsername }, function (err2, player) {
                    console.log(playerUsername);

                    if (err2 || (player == null)) {
                        return res.send("Error in operation.\nTry Again");
                    }

                    for (var i = 0; i < serviceProvider.blacklist.length; i++) {
                        if (serviceProvider.blacklist[i].equals(player._id)) {
                            return res.send("This player is already black listed");
                        }
                    }
                    serviceProvider.blacklist.push(player);
                    serviceProvider.save(function (err) { });
                    res.send("Successfully added to Blacklist");

                });
            });
        },

        /**
         * adds a player to the black list using phone number.
         */
        add_to_blacklist_phone: function (req, res) {

            var serviceProviderUsername = req.user.username;
            var playerNumber = req.body.phoneNumber;

            ServiceProvider.findOne({ username: serviceProviderUsername }, function (err, serviceProvider) {

                if (err || (serviceProvider == null)) {
                    return res.send("Error in operation.\nTry Again");
                }
                Player.findOne({ phone_number: playerNumber }, function (err2, player) {

                    if (err2 || (player == null)) {
                        return res.send("Error in operation.\nTry Again");
                    }

                    for (var i = 0; i < serviceProvider.blacklist.length; i++) {
                        if (serviceProvider.blacklist[i].equals(player._id)) {
                            return res.send("This player is already black listed");
                        }
                    }
                    serviceProvider.blacklist.push(player);
                    serviceProvider.save(function (err) { });
                    res.send("Successfully added to Blacklist");
                });
            });
        },

        /**
         * removes a player from the white list using username.
         */
        remove_from_blacklist: function (req, res) {

            var serviceProviderUsername = req.user.username;
            var playerUsername = req.body.Pusername;

            ServiceProvider.findOne({ username: serviceProviderUsername }, function (err, serviceProvider) {

                if (err || (serviceProvider == null)) {
                    return res.send("Error in operation.\nTry Again");
                }
                Player.findOne({ username: playerUsername }, function (err2, player) {

                    if (err2 || (player == null)) {
                        return res.send("Error in operation.\nTry Again");
                    }

                    for (var i = 0; i < serviceProvider.blacklist.length; i++) {

                        if (serviceProvider.blacklist[i].equals(player._id)) {

                            var pos = serviceProvider.blacklist.indexOf(player._id);
                            serviceProvider.blacklist.splice(pos, 1);
                            serviceProvider.save(function (err) { });
                            return res.send("Successfully removed from Blacklist");
                        }
                    }
                    res.send("This player is not black listed");
                });
            });
        },

        /**
         * adds a player to the black list using username.
         */
        add_to_whitelist: function (req, res) {

            var serviceProviderUsername = req.user.username;
            var playerUsername = req.body.Pusername;

            ServiceProvider.findOne({ username: serviceProviderUsername }, function (err, serviceProvider) {

                if (err || (serviceProvider == null)) {
                    return res.send("Error in operation.\nTry Again");
                }

                Player.findOne({ username: playerUsername }, function (err2, player) {

                    if (err2 || (player == null)) {
                        return res.send("Error in operation.\nTry Again");
                    }

                    for (var i = 0; i < serviceProvider.whitelist.length; i++) {
                        if (serviceProvider.whitelist[i].equals(player._id)) {
                            return res.send("This player is already white listed");
                        }
                    }
                    serviceProvider.whitelist.push(player);
                    serviceProvider.save(function (err) { });
                    res.send("Successfully added to WhiteList");
                });
            });
        },

        /**
         * adds a player to the white list using phone number.
         */
        add_to_whitelist_phone: function (req, res) {

            var serviceProviderUsername = req.user.username;
            var playerNumber = req.body.phoneNumber;

            ServiceProvider.findOne({ username: serviceProviderUsername }, function (err, serviceProvider) {

                if (err || (serviceProvider == null)) {
                    return res.send("Error in operation.\nTry Again");
                }

                Player.findOne({ phone_number: playerNumber }, function (err2, player) {

                    if (err2 || (player == null)) {
                        return res.send("Error in operation.\nTry Again");
                    }

                    for (var i = 0; i < serviceProvider.whitelist.length; i++) {
                        if (serviceProvider.whitelist[i].equals(player._id)) {
                            return res.send("This player is already white listed");
                        }
                    }
                    serviceProvider.whitelist.push(player);
                    serviceProvider.save(function (err) { });
                    res.send("Successfully added to WhiteList");

                });
            });
        },

        /**
         * removes a player from the white list using username.
         */
        remove_from_whitelist: function (req, res) {

            var serviceProviderUsername = req.user.username;
            var playerUsername = req.body.Pusername;

            ServiceProvider.findOne({ username: serviceProviderUsername }, function (err, serviceProvider) {

                if (err || (serviceProvider == null)) {
                    return res.send("Error in operation.\nTry Again");
                }

                Player.findOne({ username: playerUsername }, function (err2, player) {

                    if (err2 || (player == null)) {
                        return res.send("Error in operation.\nTry Again");
                    }
                    for (var i = 0; i < serviceProvider.whitelist.length; i++) {
                        if (serviceProvider.whitelist[i].equals(player._id)) {
                            var pos = serviceProvider.whitelist.indexOf(player._id);
                            serviceProvider.whitelist.splice(pos, 1);
                            serviceProvider.save(function (err) { });
                            return res.send("Successfully removed from Whitelist");
                        }
                    }
                    res.send("This player is not white listed");

                });
            });
        },

        edit_profile_page: function (req, res) { // prepar the edit profile page
            //retrieve the players's record from DB to be able to fill the fields to be changed
            ServiceProvider.findOne({ username: req.user.username }, function (err, result) {
                if (err)
                    res.send(err);
                else {
                    res.render('edit_provider_page', { err, result });

                }
            })
        },
        edit_profile_info: function (req, res) { //accepting new info and update the DB record
            ServiceProvider.findOne({ username: req.user.username }, function (err, result) {
                if (err)
                    res.send(err);
                else {
                    if (!req.body.name) {
                        res.render('edit_provider_page', { err: "name field is empty!...enter new name", result });
                        return;
                    } if (!req.body.email) {
                        res.render('edit_provider_page', { err: "email field is empty!...enter new email", result });
                        return;
                    } if (!req.body.phone_number) {
                        res.render('edit_provider_page', { err: "phone number field is empty!...enter new phone number", result });
                        return;
                    } if (!req.body.old_password) {
                        res.render('edit_provider_page', { err: "your password is required to confirm changes", result });
                        return;
                    }

                    hasher(req.body.old_password).verifyAgainst(result.password, function (err, verified) {
                        if (err) {
                            console.log("error 1");
                            res.send(err);
                            return;
                        }
                        else {
                            if (!verified) {
                                res.send({ err: " wrong pass" });
                                return;
                            } else {
                                result.name = req.body.name;
                                if (req.body.new_password) {
                                    hasher(req.body.new_password).hash(function (err, hash) {
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
                                        if (req.body.mode == "on")
                                            result.mode = true;
                                        else
                                            result.mode = false;
                                        result.save(function (err) {
                                            if (err) {
                                                res.send(err);
                                                return;
                                            } else {
                                                res.render('edit_provider_page', { err: "information updated successfully", result });
                                                return;
                                            }
                                        });

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
                                    if (req.body.mode == "on")
                                        result.mode = true;
                                    else
                                        result.mode = false;
                                    result.save(function (err) {
                                        if (err) {
                                            res.send(err);
                                            return;
                                        } else {
                                            res.render('edit_provider_page', { err: "information updated successfully", result });
                                            return;
                                        }
                                    });
                                }
                            }

                        }
                    });
                }

            });
        },
        setUnavailable: function (req, res, next) {
            if (req.user && (req.user.type == "ServiceProvider")) {
                ServiceProvider.findOne({ username: req.user.username }, function (err, sp) {
                    Arena.findOne({ _id: req.params.arena_id }, function (err2, arena) {

                        //checking if this arena belongs to that user(service provider)
                        if (arena && arena.service_provider.equals(sp._id)) {

                            var startIndex = req.body.startIndex;
                            var endIndex = req.body.endIndex;
                            var day = req.body.day;
                            var month = req.body.month;

                            //checking if all required fields are delivered
                            if (month && day && endIndex && startIndex) {

                                var Indices = getScheduleIndices(month, day);
                                var weekIndex = Indices.weekIndex;
                                var dayIndex = Indices.dayIndex;
                                var flag = 0;

                                Arena.findById(req.params.arena_id, function (err, arena) {
                                    if (arena) {

                                        //saving the day which will be modifed to restore it to the schedule later if there's an error 
                                        var before_edit = [];
                                        for (var i = 0; i < 48; i++) {
                                            before_edit[i] = arena.schedule[weekIndex][dayIndex][i];
                                        };

                                        //setting only available slots to be unavailable. if a booked slot encountered an error statement will be sent to the user (service provider). 
                                        for (var i = startIndex; i <= endIndex; i++) {
                                            if (arena.schedule[weekIndex][dayIndex][i] == 0 || arena.schedule[weekIndex][dayIndex][i] == -1)
                                                (arena.schedule)[weekIndex][dayIndex][i] = -1;

                                            else {
                                                flag = 1;
                                                break;
                                            }

                                        };
                                        //checking if the user(servvice provider) tries to set a booked slot to be unavailable.
                                        if (flag) {
                                            for (var i = 0; i < 48; i++) {
                                                arena.schedule[weekIndex][dayIndex][i] = before_edit[i];
                                            };
                                            res.send("error, You can not set booked slots to be unavailable");
                                        }
                                        else {
                                            arena.markModified("schedule");
                                            arena.save(function (err, arr) {
                                                if (err) {
                                                    res.send("error in arena DB");
                                                }
                                            });
                                            res.send(arena.schedule);
                                        }

                                    }
                                    else { res.send("error, wrong arena id") };
                                });

                            }
                            else {
                                //if one of the fields in req.body isn't delivered 
                                res.send("incorrect data");
                            }
                        }
                        else {
                            //if the arena does not belong to this service provider or there's no such arena 
                            res.send("You are not allowed to view this page or there's no such arena");
                        }
                    });
                });
            }
            else {
                //if the user(visitor) isn't logged in or he is logged in but he is not a service provider
                res.send("You are not allowed to view this page");
            }

        },


        setAvailable: function (req, res) {
            if (req.user && (req.user.type.equals("ServiceProvider"))) {
                ServiceProvider.findOne({ username: req.user.username }, function (err, sp) {
                    Arena.findOne({ _id: req.params.arena_id }, function (err2, arena) {

                        //checking if this arena belongs to that user(service provider)
                        if (arena && arena.service_provider.equals(sp._id)) {

                            var startIndex = req.body.startIndex;
                            var endIndex = req.body.endIndex;
                            var day = req.body.day;
                            var month = req.body.month;

                            //checking if all required fields are delivered
                            if (month && day && endIndex && startIndex) {

                                var Indices = getScheduleIndices(month, day);
                                var weekIndex = Indices.weekIndex;
                                var dayIndex = Indices.dayIndex;

                                Arena.findById(req.params.arena_id, function (err, arena) {
                                    var schedule = arena.schedule;

                                    //making the slots between the startIndex and the endIndex (inclusive) available 
                                    for (var i = startIndex; i <= endIndex; i++) {
                                        schedule[weekIndex][dayIndex][i] = 0;
                                    };

                                    arena.schedule = schedule;
                                    arena.markModified("schedule");
                                    arena.save(function (err) {
                                        if (err) {
                                            res.send("error in arena DB");
                                        }
                                    });
                                    res.redirect("/sp/arena/" + req.params.arena_id);
                                });

                            }
                            else {
                                //if one of the fields in req.body isn't delivered 
                                res.send("incorrect data");
                            }
                        }
                        else {
                            //if the arena does not belong to this service provider or there's no such arena
                            res.send("You are not allowed to view this page or there's no such arena");
                        }
                    });
                });
            }
            else {
                //if the user(visitor) isn't logged in or he is logged in but he is not a service provider   
                res.send("You are not allowed to view this page");
            }
        },
        createArena: function (req, res) {
            if (req.user && (req.user.type != "ServiceProvider")) {
                res.send("Not authenticated");
                return;
            }


            // initializing the arena
            var rules = req.body.rules_and_regulations;
            var name = req.body.name;
            var address = req.body.address;
            var location = req.body.location;
            var size = req.body.size;
            var type = req.body.type;
            var price = req.body.price;
            var ratings_count = 0;
            var avg_rating = 0;

            if (!name || !address || !location || !size || !type || !price) {
                res.send("missing input");
                return;
            }

            // storing photos
            var photos = [];
            for (var i = 0; req.files && req.files[i]; i++) {
                photos.push(req.files[i].buffer);
            }
            // creating default schedule
            var default_schedule = [];
            var day = req.body.saturday;
            var sat = new Array(48).fill(0);
            for (var i = 0; day && i < day.length; i++) {
                sat[day[i]] = -1;
            }

            day = req.body.sunday;
            var sun = new Array(48).fill(0);
            for (var i = 0; day && i < day.length; i++) {
                sun[day[i]] = -1;
            }

            day = req.body.monday;
            var mon = new Array(48).fill(0);
            for (var i = 0; day && i < day.length; i++) {
                mon[day[i]] = -1;
            }

            day = req.body.tuesday;
            var tues = new Array(48).fill(0);
            for (var i = 0; day && i < day.length; i++) {
                tues[day[i]] = -1;
            }

            day = req.body.wednesday;
            var wed = new Array(48).fill(0);
            for (var i = 0; day && i < day.length; i++) {
                wed[day[i]] = -1;
            }

            day = req.body.thursday;
            var thurs = new Array(48).fill(0);
            for (var i = 0; day && i < day.length; i++) {
                thurs[day[i]] = -1;
            }

            day = req.body.friday;
            var fri = new Array(48).fill(0);
            for (var i = 0; day && i < day.length; i++) {
                fri[day[i]] = -1;
            }

            default_schedule.push(sat);
            default_schedule.push(sun);
            default_schedule.push(mon);
            default_schedule.push(tues);
            default_schedule.push(wed);
            default_schedule.push(thurs);
            default_schedule.push(fri);

            var normal_schedule = [];
            var weekNo = 4;
            var daysNo = 7;
            var slotsNo = 48;
            for (var i = 0; i < weekNo; i++) {
                var oneWeek = [];
                for (var j = 0; j < daysNo; j++) {
                    var oneDay = [];
                    for (var k = 0; k < slotsNo; k++) {
                        oneDay.push(default_schedule[j][k]);
                    }
                    oneWeek.push(oneDay);
                }
                normal_schedule.push(oneWeek);
            }

            var user = req.user.username;
            var servProv;
            ServiceProvider.findOne({ username: user }, function (err, doc) {
                if (err) {
                    res.send(err);
                }
                else {
                    servProv = doc._id;

                    var newArena = new Arena({
                        service_provider: servProv,
                        rules_and_regulations: rules,
                        name: name,
                        address: address,
                        location: location,
                        avg_rating: avg_rating,
                        size: size,
                        type: type,
                        price: price,
                        photos: photos,
                        ratings_count: ratings_count,
                        default_weekly_schedule: default_schedule,
                        schedule: normal_schedule
                    });


                    newArena.save(function (err) {
                        if (err)
                            res.send(err);
                        return;
                    });
                    res.redirect('/'); // to be changed 
                }
            })
        },

        providerRateBooking: function (req, res) {
            Booking.findOne({ _id: req.params.id }, function (err, booking) {
                if (err) {
                    res.send(err);
                    return;
                }
                if (!booking)
                    res.send(404);

                booking.player_rating = parseInt(req.body.rating);
                booking.save(function (err) {
                    if (err) {
                        res.send(err);
                        return;
                    }
                });
                res.send(booking);
                // find player
                Player.findOne({ _id: booking.player }, function (err, player) {
                    var rating = parseInt(req.body.rating);
                    if (err) {
                        res.send(err);
                        return;
                    }
                    if (!player) {
                        res.send(404);
                        return;
                    }
                    // update rating
                    if (!player.ratings_count)
                        player.ratings_count = 0;

                    if (!player.avg_rating)
                        player.avg_rating = 0;

                    player.avg_rating = ((player.avg_rating * player.ratings_count) + rating) / (player.ratings_count + 1);

                    player.ratings_count++;
                    // save rating at player
                    player.save(function (err) {
                        if (err) {
                            res.send(err);
                            return;
                        }
                    });
                });

            });
        },
        viewBookings: viewBookings
    }

module.exports = serviceProviderController;
