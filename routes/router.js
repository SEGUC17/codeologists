var express = require('express');
var flash = require('connect-flash');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var fs = require('fs');
var path = require('path');
var playerController = require('../controllers/playerController');
var bookingController = require('../controllers/bookingController');

var serviceProviderController = require('../controllers/serviceProviderController');
var visitorController = require('../controllers/visitorController');
var Player = require('../models/Player');

var passport = require('./passportConfig');
var router = express.Router();

var upload = multer(); // for profilePictures

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


router.get('/edit_profile', ensureAuthenticated, function (req, res, next) {
    if (req.user.type == "Player")
        next();
    else
        next('route');
}, playerController.edit_profile_page);
router.get('/edit_profile', ensureAuthenticated, serviceProviderController.edit_profile_page);
router.post('/edit_player_profile', ensureAuthenticated, upload.array('profile_pic'), playerController.edit_profile_info);
router.post('/edit_provider_profile', ensureAuthenticated, upload.array('profile_pic'), serviceProviderController.edit_profile_info);
router.post('/search', visitorController.filter);

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/register', function (req, res) {
    res.json({success:"choose type"});
});

router.post('/register', function (req, res) {
    if (req.body.player)
        res.json({success:"player"});
    else
        res.json({success:"service provider"});
});

router.get('/newPlayer', function (req, res) {
    res.json({success:"player"});
});

router.post('/newPlayer', upload.any(), function (req, res) {
    visitorController.createPlayer(req, res);
});

router.get('/newServiceProvider', function (req, res) {
   res.json({success:"service provider"});
});

router.post('/newServiceProvider', upload.any(), function (req, res) {
    visitorController.createServiceProvider(req, res);
});

router.get('/login', function (req, res) {
    res.json({success:"login"});
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.json({success:"User authenticated successfully"});
});

router.get('/logout', function (req, res) {
    if(req.user)
    {
        req.logout();
        res.redirect('/');
    }
    else
        res.status(400).json({error:"Cannot logout if you are not logged in"});
});

router.post('/arenas', visitorController.view_all);

router.post('/arenaDetails', ensureAuthenticated, visitorController.view_details_of_arena);

router.get('/viewgames', ensureAuthenticated, playerController.viewgames);

router.get('/editarena/:arenaid', ensureAuthenticated, serviceProviderController.editarena);

router.post('/editarenainfo/:arenaid', ensureAuthenticated, serviceProviderController.editarenainfo);

router.post('/editdefaultschedule/:arenaid', ensureAuthenticated, serviceProviderController.editdefaultschedule);

router.post('/addarenaimage/:arenaid', ensureAuthenticated, upload.any(), serviceProviderController.addimage);

router.post('/profile/blacklist', ensureAuthenticated, serviceProviderController.add_to_blacklist);

router.post('/profile/blacklist/phone', ensureAuthenticated, serviceProviderController.add_to_blacklist_phone);

router.post('/profile/removeblacklist', ensureAuthenticated, serviceProviderController.remove_from_blacklist);

router.post('/profile/whitelist', ensureAuthenticated, serviceProviderController.add_to_whitelist);

router.post('/profile/whitelist/phone', ensureAuthenticated, serviceProviderController.add_to_whitelist_phone);

router.post('/profile/removewhitelist', ensureAuthenticated, serviceProviderController.remove_from_whitelist);

router.post('/arena/:id/comment', ensureAuthenticated, playerController.commentOnArena);

router.post('/ProviderRatesBooking/:id', ensureAuthenticated, serviceProviderController.providerRateBooking);

router.post('/PlayerRatesBooking/:id', ensureAuthenticated, playerController.playerRateBooking);

router.get('/createArena', ensureAuthenticated, function (req, res) {
    res.render('createarena');
});
router.post('/createArena', ensureAuthenticated, upload.any(), serviceProviderController.createArena);
router.post('/cancelBooking/:bookingID', ensureAuthenticated, playerController.cancelBooking);

router.post('/turnAcceptModeOn', ensureAuthenticated, serviceProviderController.turnAutoAcceptModeOn);
router.post('/turnAcceptModeOff', ensureAuthenticated, serviceProviderController.turnAutoAcceptModeOff);
router.post('/acceptBooking', ensureAuthenticated, serviceProviderController.acceptBooking2);
router.post('/rejectBooking', ensureAuthenticated, serviceProviderController.rejectBooking);
router.post('/createGame', ensureAuthenticated, playerController.createGame);

router.post("/sp/arena/:arena_id", ensureAuthenticated, function (req, res) {
    if (req.body.flag == 1) {
        serviceProviderController.setUnavailable(req, res);
    }
    else
        serviceProviderController.setAvailable(req, res);
});
router.get('/arena/:arenaName/viewBookings', ensureAuthenticated, serviceProviderController.viewBookings)

router.post('/arena/:arenaName/bookWeekly', ensureAuthenticated, playerController.bookWeekly);


//book free hours
router.post('/arena/:arenaName/bookHours', ensureAuthenticated, bookingController.createBooking);


router.post('/RequestGame/:id', ensureAuthenticated, playerController.requestgame);
router.post('/AcceptRequest/:id', ensureAuthenticated, playerController.acceptrequest);
router.post('/RejectRequest/:id', ensureAuthenticated, playerController.rejectrequest);


module.exports = router;
