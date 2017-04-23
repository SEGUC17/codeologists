var Player = require('../models/Player');
var arenaController = require('./arenaController');
var serviceProviderController = require('./serviceProviderController');
var Arena = require('../models/Arena');
var serviceProvider = require('../models/ServiceProvider');
var Booking = require('../models/Booking');

var async = require("async");

createBooking = function (req, res) {
    ServiceProvider.findOne({ username: req.user.username }, function (err, player) {
        if (req.body.month && req.body.day && req.body.startIndex && req.body.endIndex) {
            if (err) {
                console.log(err);
                res.status(403).json({ error: err });
            }
            else if (!player) {
                res.status(403).json({ error: "Please log in as a Player first" });
            }
            else {
                require('./arenaController').bookHours(req.body.month, req.body.day, req.body.startIndex, req.body.endIndex, new Date(), req.params.arenaName, player._id, function (bookingErr, data) {
                    if (bookingErr) {
                        res.status(403).json({ error: bookingErr });

                    }
                    else {
                        res.json(data);
                    }
                })
            }
        }
        else {
            res.status(403).json({ error: "Incomplete input data " });
        }
    })
}
function viewBookings(req, res) {
    Arena.findOne({ name: req.params.arenaName }, function (err, foundArena) {
        if (err) {
            res.status(403).json({ error: err });
        }
        else if (!foundArena) {

            res.status(403).json({ error: "Sorry Broken Link, this arena may have been deleted, removed or is no longer existant" });

        }
        else {
            ServiceProvider.findById(foundArena.service_provider, function (errSp, serviceProvider) {
                if (errSp) {
                    res.status(403).json({ error: "Internal server Error, Sorry for the inconvenience !" });
                }
                else if (serviceProvider) {

                    if (serviceProvider.username == req.user.username) {
                        //find all pending requests where the request time is greater than today, the arena is the current arena  and have not been accepted
                        Booking.find({ accepted: false, arena: foundArena._id }).$where('(new Date(new Date().getFullYear(),this.bookMonth,this.bookDay))>(new Date())').exec(function (arenaErr, bookingArr) {
                            //TODO: render a view (will be done in Sprint 2 ISA)
                            if (arenaErr) {
                                res.status(403).json({ error: "Error finding pending requests" });
                            }
                            else {

                                res.json(bookingArr);
                            }

                        })
                    }
                    else {
                        res.status(403).json({ error: "sorry not your arena" });
                    }
                }
                else {
                    res.status(403).json({ error: "Internal Server Error sorry :'(" });
                };
            })

        }
    });
}

function getPlayersForBookings(req){
    var bookings = req;
    var acc = [];
    async.concatSeries(bookings, function(item, callback) {
        Player.findOne({_id : item.player} , function(err , pla)
        {
            if(!err){
                return [pla.name];
            }
        });
        callback();
    }, 
    function(err , res) {
        return res;
    });
 
}



var cancelBooking = function (req, res) {
    if (req.user.type != 'Player') {
        res.json(400, {error : "You are not authorized to view this page"});
        return;
    }
    var player = req.user._id;
    var arena = req.body.arena;
    var bookingID = req.params.bookingID;
    var status;
    var day, week, start, end;
    var id;
    if (!player || !arena || !bookingID) {
        res.json(400, {error: "missing parameters"});
        return;
    }
    Booking.findOne({
        _id: bookingID
    }, function (err, book) {
        if (!book || !(book.player.equals(player))) {
            res.json(400, {error: "This Action can not be done."});
            return;
        }
        if (err)
            res.json(500, {error: err.message});
        else {
            status = book.accepted;
            var obj = serviceProviderController.getScheduleIndices(book.bookMonth, book.bookDay);
            day = obj.dayIndex;
            week = obj.weekIndex;
            start = book.start_index;
            end = book.end_index;
            id = book._id;

            if (status) {
                Arena.findOne({ name: arena }, function (err, doc) {
                    for (var i = 0; i < 48; i++) {
                     console.log(week);
                     console.log(day);
                     console.log(doc.schedule[week]);


                        var currDay = doc.schedule[week][day];
                        if (i >= start && i <= end && currDay[i] == id)
                            doc.schedule[week][day][i] = 0;
                    }
                    doc.markModified('schedule');
                    doc.save(function (err) {
                        if (err)
                          res.json(500, {error: err.message});
                    });

                });
            }

             Booking.remove({
                _id: bookingID
            }, function (err) {
                if (err) {res.json(500, {error: err.message});
               }
               else {
                 res.json({message: 'success'});
               }
            });
        }
    });


};

var viewPlayerBookings = function (req, res){
   if(req.user.type != 'Player')
   {
    res.json(400, {error:"You are not authorized to view this page"});
   }
   else {

      Booking.find({player : req.user._id},function(err,arenas){
          if(err){
              return res.json({error : err.message});
          }else{
              return res.json(arenas);
          }
      });

     }
};


function getTimeFromIndex(index) {
  var hour = Math.floor(index / 2);
  var minute = '00';
  if (index % 2 == 1)
  minute = '30';
  return {hour: hour, minute: minute};
};

function getUnratedBookings(req, res) {
  var date = new Date();
  var uType = req.user.type;
  var id = req.user._id;

  if(uType == "Player")
  {
    Booking.find({arena_rating: 0, player: id, accepted:true},
      function (err, allBookings) {
        if (err) {
          return res.status(400).json({ err: err });
        }
        var remBooking = [];
        async.each(allBookings, function (currentBooking, callback) {
          var hoursMins = getTimeFromIndex(currentBooking.end_index);
          var bookDate = new Date(date.getFullYear(),
          currentBooking.bookMonth, currentBooking.bookDay, hoursMins.hour,
          hoursMins.minute, 0, 0);
          var pName = "";
          if(bookDate < date){
            remBooking.push({bookingID: currentBooking._id, bookingArena: currentBooking.arena, date: bookDate, playerID: currentBooking.player});
          }
          callback();
        }, function () {
          return res.json({remBooking: remBooking});
        });
      });
    }

    else{
      var spArenas = [];
      Arena.find({service_provider: id}, function (err, allArenas) {
        if (err) {
          return res.status(400).json({ err: err });
        }
        async.each(allArenas, function (currentArena, callback) {
          spArenas.push(currentArena.name);
          callback();
        }, function () {
          Booking.find({player_rating: 0, arena: {$in : spArenas} ,accepted: true},
            function (err, allBookings) {
              if (err) {
                return res.status(400).json({ err: err });
              }
              var remBooking = [];
              for (var i = 0; i < allBookings.length; i++) {
                var hoursMins = getTimeFromIndex(allBookings[i].end_index);
                var bookDate = new Date(date.getFullYear(),
                allBookings[i].bookMonth, allBookings[i].bookDay, hoursMins.hour,
                hoursMins.minute, 0, 0);
                if(bookDate < date){
                  remBooking.push({bookingID: allBookings[i]._id, bookingArena: allBookings[i].arena, date: bookDate, playerID: allBookings[i].player});
                }
              }
              return res.json({remBooking: remBooking});
            });
          });
        });
      }
    };

    function rateBooking (req, res) {
      if(!req.body.rating || parseInt(req.body.rating) > 5 || parseInt(req.body.rating) < 1)
      {
        res.status(400).json({error: "bad request, enter a proper rating!"});
        return;
      }

      Booking.findOne({ _id: req.params.id }, function (err, booking) {
        if (err) {
          res.status(400).json({error: err.message});
          return;
        }
        if (!booking)
        return res.status(404).json({error: "booking not found"});


        if(req.user.type == 'Player'){
          booking.arena_rating = parseInt(req.body.rating);

          //save arena rating at booking
          booking.save(function (err) {
            if (err) {
              res.status(400).json({error: err.message});
              return;
            }
          });
          Arena.findOne({ name: booking.arena }, function (err, arena) {
            var rating = parseInt(req.body.rating);
            if (err) {

              res.status(400).json({error: err.message});
              return;
            }
            if (!arena) {
              res.status(404).json({error: "arena not found!"});
              return;
            }

            if (!arena.ratings_count)
            arena.ratings_count = 0;

            if (!arena.avg_rating)
            arena.avg_rating = 0;

            // update rating

            arena.avg_rating = (arena.avg_rating * arena.ratings_count + rating) / (arena.ratings_count + 1);
            arena.ratings_count++;
            // save rating at arena
            arena.save(function (err) {

              if (err) {
                res.status(400).json({error: err.message});
                return;
              }
            });
            return res.json(arena);
          });
        }
        else{

          booking.player_rating = parseInt(req.body.rating);
          booking.save(function (err) {
            if (err) {
              res.status(400).json({error: err.message});
              return;
            }
          });
          res.json(booking);
          // find player
          Player.findOne({ _id: booking.player }, function (err, player) {
            var rating = parseInt(req.body.rating);
            if (err) {
              res.status(400).json({error: err.message});
              return;
            }
            if (!player) {
              res.status(404).json({error: "player not found!"});
              return;
            }
            // update rating
            if (!player.ratings_count)
            player.ratings_count = 0;

            if (!player.avg_rating)
            player.avg_rating = 0;

            player.avg_rating = ((player.avg_rating * player.ratings_count) + rating) / (player.ratings_count + 1);

            player.ratings_count++;
            // save rating at player
            player.save(function (err) {
              if (err) {
                res.status(400).json({error: err.message});
                return;
              }
            });
          });
        }
      });
    }


   
    function acceptBooking(booking, callbackF) {


    Arena.findOne({ name: booking.arena }, function (error2, arenaa) {
        if (error2) {
            callbackF(error2, null);
            return;
        }
        var schedule = arenaa.schedule;
        var indices = serviceProviderController.getScheduleIndices(booking.bookMonth, booking.bookDay);
        var dayIndex = indices.dayIndex;
        var weekIndex = indices.weekIndex;
        var start = booking.start_index;
        var end = booking.end_index;
       Arena.findOne({name:booking.arena},function(errArena,arena){
        if(errArena){
            callbackF(errArena,null);
        }
        else if(!arena)
        {
            return callbackF({error:"not a valid Arena any more"},null);
        }
        else{
            for(var i=start;i<=end;i++)
            {
                if(arena.schedule[weekIndex][dayIndex][i] !=0)
                {
                    callbackF({error:"You tried to override a booking"},null);
                    return;
                }
                
                arena.schedule[weekIndex][dayIndex][i]=booking._id;
            }
            arena.markModified('schedule');
            arena.save(function(arenaSaveErr,arenaObj){
                if(arenaSaveErr){
                   return callbackF(arenaSaveErr,null);
                }
                else
                {
                   return callbackF(null,arenaObj.schedule[weekIndex][dayIndex]);
                }
            })
        }
        })
    });
}


      function acceptBooking2(req, res) {
    if (req.user.type != 'ServiceProvider') {
        res.json(403,{error:'You are not authorized to do this'});
        return;
    }
    Booking.findById(req.params.bookingID, function (err, bookingObj) {
        if (err || !bookingObj)
            res.json(400, {error :"no such booking or bad request"});
        else {
            var booking = bookingObj;
            Arena.findOne({ name : booking.arena }, function (err, arenaa) {
                if (!arenaa.service_provider.equals(req.user._id)) {
                    res.json(403,{error : 'You are not authorized to do this'});
                    return;
                }
                var schedule = arenaa.schedule;
                var indices = serviceProviderController.getScheduleIndices(booking.bookMonth, booking.bookDay);
                var dayIndex = indices.dayIndex;
                var weekIndex = indices.weekIndex;
                var start = booking.start_index;
                var end = booking.end_index;
                var ok = true;
                for (var i = start; i <= end; i++) {
                    if (schedule[weekIndex][dayIndex][i] != 0) {
                        ok = false;
                        break;
                    }
                }
                if (!ok) {
                    res.json(400,{error:'This is not a free time'});
                }
                else {
                    Booking.find({ arena: arenaa.name, bookDay: booking.bookDay, bookMonth: booking.bookMonth }
                        , function (err, allBookings) {
                            if (!err && allBookings) {
                                async.each(allBookings, function (currentBooking, callback) {
                                    if (!(currentBooking.accepted) && !(currentBooking._id.equals(booking._id))) 
                                    {
                                        var start1 = currentBooking.start_index;
                                        var end1 = currentBooking.end_index;
                                        if ((start1 >= start && start1 <= end) || (end1 >= start && end1 <= end)) 
                                        {
                                            Arena.findOne({ name: currentBooking.arena }, function (err, arenaa) 
                                            {
                                                if (!err && arenaa) 
                                                {
                                                    var notification = 'Unfortunately,your booking on day ' + (currentBooking.bookDay) + ' on month ' +
                                                        (currentBooking.bookMonth) + ' for ' + (arenaa.name) + ' from '
                                                        + serviceProviderController.getTimeFromIndex(start1) + ' to ' 
                                                        + serviceProviderController.getTimeFromIndex(end1) + ' has been rejected';
                                                    Player.findOne({ _id: currentBooking.player }, function (err, playerr) 
                                                    {
                                                        if (!err && playerr) 
                                                        {
                                                            playerr.notifications.push(notification);
                                                            playerr.save();
                                                            Booking.remove({ _id: currentBooking._id }, function (err, result) 
                                                            {
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, function (err) {
                                    res.json(400,{error :'there are conflicting bookings'});
                                })
                            }
                            for (var i = start; i <= end; i++) {
                                arenaa.schedule[weekIndex][dayIndex][i] = booking._id;
                            }
 
                            bookingObj.accepted = true;
                            bookingObj.save(function (err) {
                                if (err)
                                    res.json(400,{error : 'error while booking'});
                            })
 
                            arenaa.markModified('schedule');
                            arenaa.save(function (err) {
                                if (err)
                                    res.json(400,{error : 'error while saving'});
                                else
                                    res.json(200,{success:'done'});
                            })
                        });
                }
            })
        }
    })
}
function handleBooking(id, callback) {
    Booking.findOne({ _id: id }, function (errBooking, booking2) {
        if (!(errBooking || !booking2)) {
            Arena.findOne({ name: booking2.arena }, function (errArena, arena) {
                if (!errArena && arena) {
                    ServiceProvider.findOne({ _id: arena.service_provider }, function (errSP, serviceProvider) {
                        if (!errSP && serviceProvider && serviceProvider.mode == true) {
                            acceptBooking(booking2, function (err, data) {
                               return callback(err, data);
                            });
                        }
                        else if(!serviceProvider) {
                          return  callback({ error: "bad route" }, null);
                        }
                        else if(errSP)
                        {
                           return callback({error:errSP.message},null);
                        }
                        else
                        {
                            var index = serviceProviderController.getScheduleIndices(booking2.bookMonth,booking2.bookDay);
                            return callback(null,arena.schedule[idnex.weekIndex][index.dayIndex]);
                        }
                    })
                }
                else {
                    callback({ error: "Error encountered" })
                }
            });
        }
        else if (errBooking) {
          return  callback(errBooking,null);
        }
        else {
         return   callback({ error: "booking not found" },null);
        }
    });
}

        function rejectBooking(req, res) {
    if (!(req.params.bookingID)){
        res.json (400 ,{error :'Missing field'});
        return;
    }
    if (req.user.type != 'ServiceProvider') {
        res.json(403 ,{error :'You are not authorized to do this'});
        return;
    }
    var bookingID = req.params.bookingID;
    Booking.findOne({ _id: bookingID }, function (err, curBooking) {
        if (err || !curBooking) {
            res.json(400,{error :'Not a valid Booking'});
            return;
        }
        Arena.findOne({ name: curBooking.arena }, function (err, arenaa) {
 
            var arenaName = arenaa.name;
            if (err || !arenaa) {
                res.json(400 ,{error :'Not a valid Booking'});
            }
            else {
                var indices = serviceProviderController.getScheduleIndices(curBooking.bookMonth, curBooking.bookDay);
                var dayIndex = indices.dayIndex;
                var weekIndex = indices.weekIndex;
                var start = curBooking.start_index;
                var end = curBooking.end_index;
                var notification = 'Unfortunately,your booking on day ' + (curBooking.bookDay) + ' on month ' +
                    (curBooking.bookMonth) + ' for ' + (arenaa.name) + ' from '
                    + serviceProviderController.getTimeFromIndex(start) + ' to ' + 
                    serviceProviderController.getTimeFromIndex(end) + ' has been rejected';
 
                Player.findOne({ _id: curBooking.player }, function (err, playerr) {
                    playerr.notifications.push(notification);
                    playerr.save();
                    Booking.remove({ _id: curBooking._id }, function (err, result) {
                        if (err)
                            res.json(400 ,{error : "This booking can not be rejected"});
                        else
                            res.json(200 ,{success : "The booking has been rejected successfully"});
                    });
                });
            }
        });
    });
}

        let bookingController = {
          createBooking: createBooking,
          viewBookings: viewBookings,
          cancelBooking: cancelBooking,
          acceptBooking: acceptBooking,
          acceptBooking2: acceptBooking2,
          handleBooking: handleBooking,
          rejectBooking:rejectBooking,
          rateBooking :rateBooking,
          getUnratedBookings: getUnratedBookings,
          viewPlayerBookings: viewPlayerBookings,
          getPlayersForBookings : getPlayersForBookings
        }

        module.exports = bookingController;
