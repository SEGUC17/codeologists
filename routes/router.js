var express = require('express');
var playerController=require('../controllers/playerController');
var serviceProviderController=require('../controllers/serviceProviderController');

var router = express.Router();

router.post("/sp/arena/:arena_id",function(req,res){
	if(req.body.flag==1){
		serviceProviderController.setUnavailable(req,res);
	}
	else
		serviceProviderController.setavailable(req,res);
});

module.exports = router;
