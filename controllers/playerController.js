let Game = require('../models/Game');
let Booking = require('../models/Booking');
var SpController  = require('./serviceProviderController');
var Arena =  require('../models/Arena');
var viewgames = function(req, res){
        
        Game.find(function(err, games){
            
            if(err)
                res.send(err.message);
            else
                res.render('index', {games});
        })
    };

var bookHours=  function(month,day,startIndex,endIndex,timestamp,arenaID,playerID,callback){
   //TODO:handle Last three weeks of the year 
   //create Booking
   var indicies = SpController.getScheduleIndicies(month,day)
  
  Arena.findById(arenaID,function(err,foundArena){

  if(! err){
   if(checkAvailable(endIndex,foundArena.schedule [indicies.weekIndex][indicies.dayIndex],startIndex))
  {
    var newBooking = new Booking({
        player:playerID,
        arena:arenaID,
        time_stamp:timestamp,
        bookDay:day,
        bookWeek:week,
        bookMonth:month,
        accepted:autoAccept
    }).save(function(err,bookingObj){
    if(err){
        callback(err);
    }
    else
    {
 SpController.handleBooking(bookingObj._id);
    }
    });
  }
  else
  {
      callback("Time Unavailable");
  }
    }
    else{
        callback("No such Arena");
    }

} )
}

function checkAvailable(endIndex,schedule,counter){
        if(counter>endIndex)
        {
            return true;
        }
        else
        {
            if(schedule[counter]!=0)
            return false;
            else
            checkAvailable(endIndex,schedule,counter+1);
        }

}

var bookWeekly = function(req,res){
   var indicies = SpController.getScheduleIndicies(month,day);
   Arena.findById(req.params.arenaId,function(err,foundArena){
       if(err)
       {
           res.send("No such Arena");

       }
       else
       {
           
       }
   })
}

let playerController = {
    bookWeekly:bookWeekly,
    viewgames:viewgames,
    bookHours:bookHours
}

module.exports = playerController;