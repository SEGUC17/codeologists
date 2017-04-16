var Arena = require('../models/Arena');
var Game = require('../models/Game');
var Booking = require('../models/Booking');
var Player = require('../models/Player');
var async = require('async');

/* 
updateSchedule() is supposed to update the schedule of all arenas at the start of a new week  by setting the 4th week of the  
schedule of each arena to the default_weekly_schedule of that arena.
*/
function updateSchedule() {
    //update schedules of all arenas !    
    Arena.find(function (err, arenaArr) {

        if (!err) {
            async.each(arenaArr,function(arena){
                arena.schedule.shift();
                arena.schedule.push(arena.default_weekly_schedule);
                arena.markModified('schedule');
                arena.save(function(arenaSaveErr){
                    console.log("Arena Save Error " + arenaSaveErr);
                })
            },function(asyncErr){
                console.log("Async has encountered an error "+ asyncErr);
            })
        }
        else {
            console.log(err + "Error accessing arenas from database");

        }
    })
}


//this function recieves a 3d array of length 4 and shifts all the elemenst to the left by one
function shiftArr(arrayObj) {
    if (Array.isArray(arrayObj) && (arrayObj.length == 4)) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 7; j++) {
                for (var k = 0; k < 48; k++) {
                    arrayObj[i][j][k] = arrayObj[i + 1][j][k];
                }
            }
        }
    }

}

/*
collectGarbage is scheduled to run every month to delete excess games and bookings
each user is allowed to keep last 30 booking and last 10 games created by him  
*/
function collectGarbage() {
    //delete old games
    //delete old bookings
    Booking.aggregate({ $group: { _id: "$player", count: { $sum: 1 } } }).match({ count: { $gt: 30 } }).exec(function (err, playerArr) {
        if (!err) {
            playerArr.forEach(function (player2) {
                Booking.remove({ player: player2._id }).sort({ bookMonth: "desc", bookDay: "desc" }).skip(30).exec(function (err2, playerBooking) {
                    if (err2)
                        console.log(err2);

                });
            })
        }
        else {
            console.log("Error in accessing Bookings ");
            console.log(err);
        }

    })

}

let systemControlller = {
    updateSchedule: updateSchedule,
    collectGarbage: collectGarbage
}
module.exports = systemControlller;