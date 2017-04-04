let Player = require('../models/Player');
var fs = require('fs');
var path = require('path');

function date_calc(year,month,day) {
if(month < 10)  //if month is one digit pad it with zero
month = "0"+month;
if(day < 10)    //if day is one digit pad it with zero
day = "0"+day;
  return year+"-"+month+"-"+day;
}
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

edit_profile_page: function(req,res) { // prepar the edit profile page
                                          //retrieve the players's record from DB to be able to fill the fields to be changed
         Player.findOne({username : req.user.username},function(err,result){
            if(err)
              res.send(err);
            else{
              res.render('edit_player_page',{err,result, date : date_calc(result.birthdate.getFullYear(),result.birthdate.getMonth()+1 ,result.birthdate.getDate())});

            }
         })
},
edit_profie_info : function(req,res){ //accepting new info and update the DB record
            Player.findOne({username : req.user.username},function(err,result){
                if(err)
                 res.send(err);
                else{
                if(!req.body.name){
                 res.render('edit_player_page',{err :"name field is empty!...enter new name",result, date : date_calc(result.birthdate.getFullYear(),result.birthdate.getMonth()+1 ,result.birthdate.getDate())});
                  return;
               }if(!req.body.email){
                  res.render('edit_player_page',{err :"email field is empty!...enter new email",result, date : date_calc(result.birthdate.getFullYear(),result.birthdate.getMonth()+1 ,result.birthdate.getDate())});
                    return;
                }if(!req.body.phone_number){
                   res.render('edit_player_page',{err :"phone number field is empty!...enter new phone number",result, date : date_calc(result.birthdate.getFullYear(),result.birthdate.getMonth()+1 ,result.birthdate.getDate())});
                    return;
                 }if(!req.body.location){
                    res.render('edit_player_page',{err :"location field is empty!...enter new location",result, date :date_calc(result.birthdate.getFullYear(),result.birthdate.getMonth()+1 ,result.birthdate.getDate())});
                  return;
                }if(!req.body.old_password){
                    res.render('edit_player_page',{err :"your password is required to confirm changes",result, date :date_calc(result.birthdate.getFullYear(),result.birthdate.getMonth()+1 ,result.birthdate.getDate())});
                    return;
                  }if(result.password != req.body.old_password){
                      res.render('edit_player_page',{err :"wrong password !",result, date : date_calc(result.birthdate.getFullYear(),result.birthdate.getMonth()+1 ,result.birthdate.getDate())});
                       return;
                  }result.name = req.body.name;
                  if(req.body.new_password)
                  result.password = req.body.new_password;
                  result.email = req.body.email;
                  result.phone_number = req.body.phone_number;
                  if(req.files[0]){
                    result.profile_pic.data = fs.readFileSync(req.files[0].path);
                    fs.unlinkSync(req.files[0].path);
                  }
                  result.location = req.body.location;
                  result.birthdate = req.body.birthdate;
                  result.save();
                  res.render('edit_player_page',{err :"information updated successfully",result, date : date_calc(result.birthdate.getFullYear(),result.birthdate.getMonth()+1 ,result.birthdate.getDate())});
                  }

                });
},
    
    viewgames:function(req, res){
        
        Game.find(function(err, games){ 
            if(err)
                res.send(err.message);
            else
                res.render('games', {games : games});
        });
    }, 
    bookHours:bookHours,
    bookWeekly:bookWeekly
}

module.exports = playerController;
