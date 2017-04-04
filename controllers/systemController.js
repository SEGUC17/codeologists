var Arena = require('../models/Arena');
var Game = require('../models/Game');
var Booking = require('../models/Booking');
var Player = require('../models/Player');
function updateSchedule(){
    //TODO:update schedules of all arenas !    
    Arena.find(function(err,arenaArr){
       
       if(!err){
        arenaArr.forEach(function(arena,index){
        shiftArr(arena.schedule);
           for(var i=0;i<7;i++) {
            for(var j=0;i<48;j++)
            {
                arena.schedule[3][i][j]=arena.default_weekly_schedule[i][j];
            }}
            arena.save(function(err){
                if(err)
                console.log(err);
            })
        })
      }  
      else{
          console.log(err+ "Error accessing arenas from database" );
         
      }
    })
}
function shiftArr(arrayObj){
    for(var i=0;i<3;i++){
        for(var j=0;j<7;j++){
            for(var k=0;k<48;k++){
                arrayObj[i][j][k]=arrayObj[i+1][j][k];
            }
        }
    }
}


function collectGarbage(){
//delete old games
//delete old bookings
    Player.aggregate({$group:{_id:{username:"$username",}}).exec(function(err,playerArr){
        console.log(playerArr);
        })
}

let systemControlller = {
    updateSchedule:updateSchedule,
    collectGarbage:collectGarbage
}
module.exports = systemControlller;