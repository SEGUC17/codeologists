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
  req.session.username = "hosasmfawzy";
  req.session.type = "ServiceProvider";
  res.render('index');
});


router.get('/edit_profile',function(req,res,next){
      if(req.session.type == "player")
        next();
        else
        next('route');
},playerController.edit_profile_page);
router.get('/edit_profile',serviceProviderController.edit_profile_page);
router.post('/edit_player_profile',upload.array('profile_pic'),playerController.edit_profie_info);
router.post('/edit_provider_profile',upload.array('profile_pic'),serviceProviderController.edit_profie_info);
router.post('/search',visitorController.filter);



module.exports = router;
