var multer = require('multer');
var fs = require('fs');
var path = require('path');

let Arena = require('../models/Arena');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/image/');
    },
    filename: function(req, res, cb) {
        cb(null, "_" + Date.now());
    }
});

let serviceProviderController = {

    editarena: function(req, res) {
        var arenaname = req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena) {
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if (req.user && arena.service_provider != req.user._id) { res.redirect('/'); } //handle error
            res.render('editarena', { arena: arena });
        });
    },
    editarenainfo: function(req, res) {
        var arenaname = req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena) {
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if (req.user && arena.service_provider != req.user._id) { res.redirect('/'); } //handle error
            arena.rules_and_regulations = req.body.rules_and_regulations;
            arena.address = req.body.address;
            arena.location = req.body.location;
            arena.size = req.body.size;
            arena.type = req.body.type;
            arena.price = req.body.price;
            arena.save(function(err) {
                if (err) {
                    res.redirect('/'); //handle error
                    // nxt(err);
                    // return;
                }
                res.redirect('/arenas/' + arena.name);
            });
        });
    },
    editdefaultschedule: function(req, res) {
        var arenaname = req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena) {
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if (req.user && arena.service_provider != req.user._id) { res.redirect('/'); } //handle error
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 48; j++) {
                    arena.default_weekly_schedule[i][j] = req.body.schedule[i][j].checked ? -1 : 0; //may be changed
                }
            }
        });
    },
    addimage: function(req, res, nxt) {
        var img_path = req.files[0].path;
        var newimage = { data: fs.readFileSync(img_path) };
        var arenaname = req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena) {
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if (req.user && arena.service_provider != req.user._id) { res.redirect('/'); } //handle error
            arena.photos.push(newimage);
            arena.save(nxt);
        });
    },

    add_to_blacklist: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerUsername = req.body.Bplayerusername;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {
            if (err)
                console.log(err);

            player.findOne({ username: playerUsername }, function(err2, player) {
                if (err2) {
                    res.render('SPprofile', { user: serviceProvider, mssgN: 8 });
                } else {
                    if (serviceProvider.blacklist.include(player))
                        res.render('SPprofile', { user: serviceProvider, mssgN: "0" });
                    else {
                        serviceProvider.blacklist.push(player);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "4" });
                    }
                }
            });
        });
    },

    add_to_blacklist_phone: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerNumber = req.body.BplayerNumber;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {
            if (err)
                console.log(err);

            player.findOne({ phone_number: playerNumber }, function(err2, player) {
                if (err2) {
                    res.render('SPprofile', { user: serviceProvider, mssgN: 8 });
                } else {
                    if (serviceProvider.blacklist.include(player))
                        res.render('SPprofile', { user: serviceProvider, mssgN: "0" });
                    else {
                        serviceProvider.blacklist.push(player);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "4" });
                    }
                }
            });
        });
    },

    remove_from_blacklist: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerUsername = req.prams.username;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {

            player.findOne({ username: playerUsername }, function(err2, player) {
                if (err2)
                    res.render('SPprofile', { user: serviceProvider, mssgN: "8" });
                else {
                    if (serviceProvider.blacklist.include(player)) {
                        var pos = serviceProvider.blacklist.indexOf(player);
                        serviceProvider.blacklist.splice(pos, 1);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "5" });

                    } else
                        res.render('SPprofile', { user: serviceProvider, mssgN: "1" });
                }
            });
        });
    },

    add_to_whitelist: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerUsername = req.body.Wplayerusername;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {

            player.findOne({ username: playerUsername }, function(err2, player) {
                if (err2)
                    res.render('SPprofile', { user: serviceProvider, mssgN: "8" });
                else {
                    if (serviceProvider.whitelist.include(player))
                        res.render('SPprofile', { user: serviceProvider, mssgN: "2" });
                    else {
                        serviceProvider.whitelist.push(player);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "6" });
                    }
                }
            });
        });
    },

    add_to_whitelist_phone: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerNumber = req.body.WplayerNumber;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {
            if (err)
                console.log(err);

            player.findOne({ phone_number: playerNumber }, function(err2, player) {
                if (err2) {
                    res.render('SPprofile', { user: serviceProvider, mssgN: 8 });
                } else {
                    if (serviceProvider.whitelist.include(player))
                        res.render('SPprofile', { user: serviceProvider, mssgN: "0" });
                    else {
                        serviceProvider.whitelist.push(player);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "4" });
                    }
                }
            });
        });
    },

    remove_from_whitelist: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerUsername = req.prams.username;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {

            player.findOne({ username: playerUsername }, function(err2, player) {
                if (err2)
                    res.render('SPprofile', { user: serviceProvider, mssgN: "8" });
                else {
                    if (serviceProvider.whitelist.include(player)) {
                        var pos = serviceProvider.whitelist.indexOf(player);
                        serviceProvider.whitelist.splice(pos, 1);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "7" });

                    } else
                        res.render('SPprofile', { user: serviceProvider, mssgN: "3" });
                }
            });
        });
    }

}

module.exports = serviceProviderController;