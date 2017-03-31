var express = require('express');
var playerController=require('../controllers/playerController');
var Player = require('../models/Player')
var router = express.Router();







//book free hours
router.post('/arena/:arenaId?bookHours',function(req,res){
   
Player.findOne({username:req.cookies.username},function(err,player){
      
playerController.bookHours(req.body.month,req.body.day,req.body.startIndex,req.body.endIndex,new Date(),req.params.arenaId,player._id,function(err){
    if(err)
    {
        console.log(err);
        res.send(err);
    }
    else
    {
        res.redirect('/arena/:arenaId');
    }
}) 

 })
  
   
})


module.exports = router;
