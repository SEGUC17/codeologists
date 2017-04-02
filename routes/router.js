var express = require('express');
var playerController=require('../controllers/playerController');
var serviceProviderController=require('../controllers/serviceProviderController');
var router = express.Router();


router.get('/viewgames',playerController.viewgames);

router.get('/editarena/:arenaname',serviceProviderController.editarena);

router.post('/editarenainfo/:arenaname',serviceProviderController.editarenainfo);

router.get('/editdefaultschedule/:arenaname',serviceProviderController.editdefaultschedule);

router.post('/addarenaimage/:arenaname',upload.any(),serviceProviderController.addimage);


module.exports = router;
