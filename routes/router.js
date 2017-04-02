var express = require('express');
var playerController=require('../controllers/playerController');
var serviceProviderController = require('../controllers/serviceProviderController');
var router = express.Router();

router.get('/', function(req, res){
  res.render('index');
})
router.post('/createArena', serviceProviderController.createArena);
router.post('/cancelBooking', serviceProviderController.cancelBooking);

module.exports = router;
