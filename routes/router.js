var express = require('express');
var flash = require('connect-flash');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var fs = require('fs');
var path = require('path');
var playerController = require('../controllers/playerController');

var serviceProviderController = require('../controllers/serviceProviderController');
var visitorController = require('../controllers/visitorController');
var Player = require('../models/Player');

var passport = require('./passportConfig');
var router = express.Router();
var storage = multer.diskStorage({  // for profile Pictures
    destination: function (req, file, cb) {
        cb(null, './views')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
var upload = multer({ storage: storage }); // for profilePictures

router.use(function (req, res, nxt) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    nxt();
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('info', 'You must log in first.');
        res.redirect('/login');
    }
}

router.get('/', function (req, res) {
    // setting username and type for testing
    res.render('index');
});


router.get('/edit_profile', function (req, res, next) {
    if (req.user.type == "Player")
        next();
    else
        next('route');
}, playerController.edit_profile_page);
router.get('/edit_profile', serviceProviderController.edit_profile_page);
router.post('/edit_player_profile', upload.array('profile_pic'), playerController.edit_profie_info);
router.post('/edit_provider_profile', upload.array('profile_pic'), serviceProviderController.edit_profie_info);
router.post('/search', visitorController.filter);

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/register', function (req, res) {
    res.render('chooseType');
});

router.post('/register', function (req, res) {
    if (req.body.player)
        res.redirect('/newPlayer');
    else
        res.redirect('/newService');
});

router.get('/newPlayer', function (req, res) {
    res.render('newPlayer');
});

router.post('/newPlayer', upload.any(), function (req, res) {
    visitorController.createPlayer(req, res);
});

router.get('/newServiceProvider', function (req, res) {
    res.render('newServiceProvider');
});

router.post('/newServiceProvider', upload.any(), function (req, res) {
    visitorController.createServiceProvider(req, res);
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.send(req.user);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/arenas', visitorController.view_all);

router.post('/arenaDetails', visitorController.view_details_of_arena);

router.get('/viewgames', playerController.viewgames);

router.get('/editarena/:arenaname', serviceProviderController.editarena);

router.post('/editarenainfo/:arenaname', serviceProviderController.editarenainfo);

router.get('/editdefaultschedule/:arenaname', serviceProviderController.editdefaultschedule);

router.post('/addarenaimage/:arenaname', upload.any(), serviceProviderController.addimage);

router.post('/profile/blacklist', serviceProviderController.add_to_blacklist);

router.post('/profile/blacklist/phone', serviceProviderController.add_to_blacklist_phone);

router.get('/profile/removeblacklist/:username', serviceProviderController.remove_from_blacklist);

router.post('/profile/whitelist', serviceProviderController.add_to_whitelist);

router.post('/profile/whitelist/phone', serviceProviderController.add_to_whitelist_phone);

router.get('/profile/removewhitelist/:username', serviceProviderController.remove_from_whitelist);

router.post('/arena/:id/comment', ensureAuthenticated, playerController.commentOnArena);

router.post('ProviderRatesBooking/:id', ensureAuthenticated, serviceProviderController.providerRateBooking);

router.post('/PlayerRatesBooking/:id', ensureAuthenticated, playerController.playerRateBooking);


router.post('/createArena', serviceProviderController.createArena);
router.post('/cancelBooking', serviceProviderController.cancelBooking);

router.post("/sp/arena/:arena_id", function (req, res) {
    if (req.body.flag == 1) {
        serviceProviderController.setUnavailable(req, res);
    }
    else
        serviceProviderController.setavailable(req, res);
});
router.get('/arena/:arenaId?viewBookings', function (req, res) {
    Arena.findById(req.params.arenaId, function (err, foundArena) {
        if (err) {
            res.send("Sorry Broken Link, this arena may have been deleted, removed or is no longer existant");
        }
        else {
            ServiceProvider.findById(foundArena.service_provider, function (err, serviceProvider) {
                if (err) {
                    res.send("Internal server Error, Sorry for the inconvenience !");
                }
                else if (serviceProvider.username == req.user.username) {
                    //find all pending requests where the request time is greater than today, the arena is the current arena  and have not been accepted
                    Booking.find({ accepted: false, arena: foundArena._id }).$where('(new Date(new Date().getFullYear(),this.bookMonth,this.bookDay))>(new Date())').exec(function (err, bookingArr) {
                        //TODO: render a view (will be done in Sprint 2 ISA)
                        if (err) {
                            res.json("Error finding pending requests");
                        }
                        else {
                            res.json(bookingArr);
                        }

                    });
                }
            })

        }
    })
})
//
router.post('/arena/:arenaId?bookWeekly', playerController.bookWeekly);


//book free hours
router.post('/arena/:arenaId?bookHours', function (req, res) {

    Player.findOne({ username: req.cookies.username }, function (err, player) {

        playerController.bookHours(req.body.month, req.body.day, req.body.startIndex, req.body.endIndex, new Date(), req.params.arenaId, player._id, function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.redirect('/arena/:arenaId');
            }
        })

    })


})


router.post('/RequestGame', playerController.requestgame);
router.post('/AcceptRequest', playerController.acceptrequest);
router.post('/RejectRequest', playerController.rejectrequest);


module.exports = router;
