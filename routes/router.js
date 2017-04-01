var express = require('express');
var multer = require('multer');
var upload = multer();
var passport = require('./passportConfig');






var visitorController=require('../controllers/visitorController');

var router = express.Router();


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



module.exports = router;
