var express = require('express');
var playerController = require('../controllers/playerController');
var serviceProviderController = require('../controllers/serviceProviderController');
var router = express.Router();


router.get('/viewgames', playerController.viewgames);

router.get('/editarena/:arenaname', serviceProviderController.editarena);

router.post('/editarenainfo/:arenaname', serviceProviderController.editarenainfo);

router.get('/editdefaultschedule/:arenaname', serviceProviderController.editdefaultschedule);

router.post('/addarenaimage/:arenaname', upload.any(), serviceProviderController.addimage);

router.post('/profile/blacklist', serviceProviderController.add_to_blacklist);

router.post('/profile/blacklist/phone', serviceProviderController.add_to_blacklist_phone);

router.get('/profile/removeblacklist/:username', serviceProviderController.remove_from_blacklist);

router.post('/profile/whitelist', serviceProviderController.add_to_whitelist);

router.post('/profile/whitelist/phone', serviceProviderController.add_to_whitelist_phone);

router.get('/profile/removewhitelist/:username', serviceProviderController.remove_from_whitelist);


module.exports = router;