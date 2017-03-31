var express = require('express');
var playerController=require('../controllers/playerController');
var visitorController = require('../controllers/visitorController');

var router = express.Router();

router.get('/', function(req, res){
	res.render('index');
});

router.post('/arenas', visitorController.view_all);

router.post('/arenaDetails', visitorController.view_details_of_arena);

module.exports = router;
