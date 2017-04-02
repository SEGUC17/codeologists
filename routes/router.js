var express = require('express');
var multer  = require('multer');
var crypto = require('crypto');
var mime = require('mime');
var fs = require('fs');
var path = require('path');
var playerController=require('../controllers/playerController');

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

router.get('/', function(req,res){
  // setting username and type for testing
  res.render('index');
});


router.get('/edit_profile',function(req,res,next){
      if(req.user.type == "Player")
        next();
        else
        next('route');
},playerController.edit_profile_page);
router.get('/edit_profile',serviceProviderController.edit_profile_page);
router.post('/edit_player_profile',upload.array('profile_pic'),playerController.edit_profie_info);
router.post('/edit_provider_profile',upload.array('profile_pic'),serviceProviderController.edit_profie_info);
router.post('/search',visitorController.filter);

router.get('/', function(req, res){
	res.render('index');
});

router.get('/register',function(req,res) {
	res.render('chooseType');
});

router.post('/register',function(req,res){
	if(req.body.player)
		res.redirect('/newPlayer');
	else
		res.redirect('/newService');
});

router.get('/newPlayer',function(req,res) {
	res.render('newPlayer');
});

router.post('/newPlayer',upload.any(),function (req,res) {
	visitorController.createPlayer(req,res);
});

router.get('/newServiceProvider',function(req,res) {
	res.render('newServiceProvider');
});

router.post('/newServiceProvider',upload.any(),function (req,res) {
	visitorController.createServiceProvider(req,res);
});

router.post('/login',passport.authenticate('local'),function (req,res) {
	res.send(req.user);
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.post('/arenas', visitorController.view_all);

router.post('/arenaDetails', visitorController.view_details_of_arena);

router.get('/viewgames',playerController.viewgames);

router.get('/editarena/:arenaname',serviceProviderController.editarena);

router.post('/editarenainfo/:arenaname',serviceProviderController.editarenainfo);

router.get('/editdefaultschedule/:arenaname',serviceProviderController.editdefaultschedule);

router.post('/addarenaimage/:arenaname',upload.any(),serviceProviderController.addimage);

router.post("/sp/arena/:arena_id",function(req,res){
	if(req.body.flag==1){
		serviceProviderController.setUnavailable(req,res);
	}
	else
		serviceProviderController.setavailable(req,res);
});


module.exports = router;
