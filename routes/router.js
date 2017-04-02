var express = require('express');
var visitorController=require('../controllers/visitorController');
var playerController=require('../controllers/playerController');
var serviceProviderController=require('../controllers/serviceProviderController');
var multer = require('multer');
var upload = multer();
var passport = require('./passportConfig');
var router = express.Router();

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


module.exports = router;
