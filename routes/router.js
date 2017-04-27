var express = require('express');
var flash = require('connect-flash');
var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var fs = require('fs');
var path = require('path');
var playerController = require('../controllers/playerController');
var bookingController = require('../controllers/bookingController');
var arenaController = require('../controllers/arenaController');
var gameController = require('../controllers/gameController');
var serviceProviderController = require('../controllers/serviceProviderController');
var visitorController = require('../controllers/visitorController');
var Player = require('../models/Player');
var RegisteredUser = require('../models/RegisteredUser');
var systemController =require('../controllers/systemController');
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
        res.status(400).json({ error: "log in first" });
    }
}

router.get('/', function (req, res) {
    return res.render('index');
});

router.get('/findUser/:user', function (req, res) {
    RegisteredUser.findOne({ username: req.params.user }, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        } else {
            res.json(data);
        }
    });
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



router.get('/panel', function (req, res) {
    res.render('serviceProviderControlPanel');
});


router.get('/register', function (req, res) {
    res.json({ success: "choose type" });
});

router.post('/register', function (req, res) {
    if (req.body.player)
        res.json({ success: "player" });
    else
        res.json({ success: "service provider" });
});
router.get('/controlpanel', function (req, res) {
    res.render('serviceProviderControlPanel');
})
router.get('/newPlayer', function (req, res) {
    res.json({ success: "player" });
});

router.post('/signup', upload.any(), function (req, res) {
    if (req.body.type == 'player') {
        visitorController.createPlayer(req, res);
    }
    else
        visitorController.createServiceProvider(req, res);

});

router.get('/newServiceProvider', function (req, res) {
    res.json({ success: "service provider" });
});

router.post('/newServiceProvider', upload.any(), function (req, res) {
    visitorController.createServiceProvider(req, res);
});

router.get('/login', function (req, res) {
    res.json({ success: "login" });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.json({ success: "User authenticated successfully", user: req.user.username, type: req.user.type, pp: req.user.profile_pic, email: req.user.email, phone: req.user.phone_number, location: req.user.location });

});

router.get('/logout', function (req, res) {
    if (req.user) {
        req.logout();
        res.json({ success: "You have been logged out successfully" });
    }
    else
        res.status(400).json({ error: "Cannot logout if you are not logged in" });
});

router.get('/myArenas', ensureAuthenticated, serviceProviderController.myArenas);
router.post('/arenas', visitorController.view_all);
router.get('/arena/:arenaName/show', ensureAuthenticated, visitorController.view_details_of_arena);
router.get('/arena/:arenaName/getSchedule', ensureAuthenticated, arenaController.getArenaSchedule);
router.get('/arena/:arenaName/schedule/:monthIndex/:dayIndex', ensureAuthenticated, arenaController.getWeekSchedule);

router.get('/getArenas', ensureAuthenticated, arenaController.getArenas);

router.get('/viewgames', ensureAuthenticated, gameController.viewgames);

router.get('/editarena/:arenaid', ensureAuthenticated, arenaController.editarena);

router.post('/editarenainfo/:arenaid', ensureAuthenticated, arenaController.editarenainfo);

router.post('/editdefaultschedule/:arenaid', ensureAuthenticated, arenaController.editdefaultschedule);

router.post('/addarenaimage/:arenaid', ensureAuthenticated, upload.any(), arenaController.addimage);

router.get('/profile/blackList', ensureAuthenticated, serviceProviderController.showblacklist);

router.post('/profile/blacklist', ensureAuthenticated, serviceProviderController.add_to_blacklist);

router.post('/profile/blacklist/phone', ensureAuthenticated, serviceProviderController.add_to_blacklist_phone);

router.post('/profile/removeblacklist', ensureAuthenticated, serviceProviderController.remove_from_blacklist);

router.get('/profile/whitelist', ensureAuthenticated, serviceProviderController.showwhitelist);

router.post('/profile/whitelist', ensureAuthenticated, serviceProviderController.add_to_whitelist);

router.post('/profile/whitelist/phone', ensureAuthenticated, serviceProviderController.add_to_whitelist_phone);

router.post('/profile/removewhitelist', ensureAuthenticated, serviceProviderController.remove_from_whitelist);

router.get('/getNameOfPlayer/:id', ensureAuthenticated, playerController.getPlayer);

router.post('/getPlayersForBookings', ensureAuthenticated, bookingController.getPlayersForBookings);

router.get('/arena/:id/getComments', ensureAuthenticated, arenaController.getComments);

router.post('/arena/:id/comment', ensureAuthenticated, arenaController.commentOnArena);

router.get('/getUnratedBookings', ensureAuthenticated, bookingController.getUnratedBookings);

router.post('/rateBooking/:id', ensureAuthenticated, bookingController.rateBooking);

router.get('/createArena', ensureAuthenticated, function (req, res) {
    res.render('createarena');
});
router.post('/createArena', ensureAuthenticated, upload.any(), arenaController.createArena);
router.post('/cancelBooking/:bookingID', ensureAuthenticated, bookingController.cancelBooking);
router.get('/viewPlayerBookings', ensureAuthenticated, bookingController.viewPlayerBookings);

router.post('/turnAcceptModeOn', ensureAuthenticated, serviceProviderController.turnAutoAcceptModeOn);
router.post('/turnAcceptModeOff', ensureAuthenticated, serviceProviderController.turnAutoAcceptModeOff);
router.post('/acceptBooking/:bookingID', ensureAuthenticated, bookingController.acceptBooking2);
router.post('/rejectBooking/:bookingID', ensureAuthenticated, bookingController.rejectBooking);
router.post('/createGame', ensureAuthenticated, gameController.createGame);
//stripe routes

/*
to do :add ensure authenticated
to do : once a paymnent has been made accept the booking 
*/
router.post('/charge', ensureAuthenticated, systemController.chargeMoney);

router.get('/arena/:arenaName/getPrice',arenaController.getPrice);
router.post("/sp/arena/:arenaName", ensureAuthenticated, function (req, res) {
    if (req.body.flag == 1) {
        arenaController.setUnavailable(req, res);
    }
    else
        arenaController.setAvailable(req, res);
});
router.get('/arena/:arenaName/viewBookings', ensureAuthenticated, bookingController.viewBookings)

router.post('/arena/:arenaName/bookWeekly', ensureAuthenticated, playerController.bookWeekly);

//book free hours
router.post('/arena/:arenaName/bookHours', ensureAuthenticated, bookingController.createBooking);


router.post('/searchPlayer', ensureAuthenticated, playerController.search);

router.get('/getArenas', ensureAuthenticated, arenaController.getArenas);

router.get('/myrequests', ensureAuthenticated, gameController.myrequests);
router.get('/mygame', ensureAuthenticated, gameController.mygame);
router.post('/RequestGame/:id', ensureAuthenticated, gameController.requestgame);
router.post('/AcceptRequest/:id', ensureAuthenticated, gameController.acceptrequest);
router.post('/RejectRequest/:id', ensureAuthenticated, gameController.rejectrequest);
router.get('/myNotifications', ensureAuthenticated, playerController.myNotifications);

router.get('/getTheMode', ensureAuthenticated, serviceProviderController.getTheMode);

module.exports = router;
