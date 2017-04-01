var express = require('express');
var playerController=require('../controllers/playerController');

var router = express.Router();


app.post('/RequestGame',requestgame);
app.post('/AcceptRequest',acceptrequest);
app.post('/RejectRequest',rejectrequest);

module.exports = router;
