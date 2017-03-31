let Game = require('../models/Game');
let Booking = require('../models/Booking');
var moment = require('moment-timezone');
var SpController  = require('./serviceProviderController');
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
   var indicies = SpController.getScheduleIndicies(month,day);
   if(checkAvailable(indicies.weekIndex,indicies.dayIndex))
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

function checkAvailable(weekIndex,dayIndex,startIndex,endIndex,schedule){
    var pointer = 0;
    for(pointer=startIndex;pointer<=endIndex;pointer++){
        if(schedule[weekIndex][dayIndex][pointer]!=0)
            return false;
    }
    return true;


}



let playerController = {
    
    viewgames:viewgames,
    bookHours:bookHours
}

module.exports = playerController;