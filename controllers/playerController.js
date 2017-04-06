let Player = require('../models/Player');
var fs = require('fs');
var path = require('path');
var hasher = require('password-hash-and-salt');
var serviceProviderController = require('./serviceProviderController');
var Arena = require('../models/Arena');
var Booking = require('../models/Booking');
var ServiceProvider = require('../models/ServiceProvider');
function date_calc(year, month, day) {
  if (month < 10)  //if month is one digit pad it with zero
    month = "0" + month;
  if (day < 10)    //if day is one digit pad it with zero
    day = "0" + day;
  return year + "-" + month + "-" + day;
}
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
var createBooking = function (req, res) {
  if (req.user) {
    Player.findOne({ username: req.user.username }, function (err, player) {
      if (req.body.month && req.body.month && req.body.startIndex && req.body.endIndex) {
        if (err) {
          console.log(err);
          res.send(err);
        }
        else {
          bookHours(req.body.month, req.body.day, req.body.startIndex, req.body.endIndex, new Date(), req.params.arenaId, player._id, function (err2) {
            if (err2) {
              console.log(err2);
              res.send(err2);
            }
            else {
              res.send("Saved");
            }
          })
        }
      }
      else {
        res.send("Incomplete input data ")
      }
    })
  }
  else {
    res.send("please log in");
  }


}



var bookHours = function (month, day, startIndex, endIndex, timestamp, arenaID, playerID, callback) {
  //create Booking
  var indices = serviceProviderController.getScheduleIndices(month, day);

  Arena.findById(arenaID, function (err, foundArena) {

    if (!err && foundArena) {
      if (indices.dayIndex >= 0 && indices.weekIndex >= 0 && indices.dayIndex <= 6 && indices.weekIndex <= 3) {
        if (checkAvailable(parseInt(endIndex, 10), foundArena.schedule[indices.weekIndex][indices.dayIndex], parseInt(startIndex, 10))) {
          ServiceProvider.findById(foundArena.service_provider, function (spErr, arenaCreator) {
            if (!spErr && arenaCreator) {
              var newBooking = new Booking({
                player: playerID,
                arena: arenaID,
                time_stamp: timestamp,
                bookDay: day,
                bookMonth: month,
                start_index: startIndex,
                end_index: endIndex,
                accepted: arenaCreator.mode
              }).save(function (errSave, bookingObj) {
                if (errSave) {
                  callback(errSave);
                }
                else {
                  serviceProviderController.handleBooking(bookingObj._id);
                  callback(null);
                }
              })
            }
            else {
              if (spErr) {
                callback(spErr);
              }
              else {
                callback("The Creater of the arena is no longer existant or has been removed ");
              }
            }
          });
        }
        else {
          callback("Time Unavailable");
        }
      } else {
      }
      if (err)
        callback(err);
      else if (!(indices.dayIndex >= 0 && indices.weekIndex >= 0 && indices.dayIndex <= 6 && indices.weekIndex <= 3))
        callback("Day and month ot of bound");
      else
        callback("no such booking");
    }

  })
}

function checkAvailable(endIndex, schedule, counter) {
  if (counter > endIndex) {
    return true;
  }
  else {
    if (schedule[counter] != 0)
      return false;
    else
      return checkAvailable(endIndex, schedule, counter + 1);
  }

}

var bookWeekly = function (req, res) {
  var indicies = SpController.getScheduleIndicies(month, day);
  Arena.findById(req.params.arenaId, function (err, foundArena) {
    if (err) {
      res.send("No such Arena");

    }
    else {

    }
  })
}


let playerController = {

  cancelBooking: function (req, res) {
    if (req.user.type != 'Player') {
      res.send("You are not authorized to view this page");
      return;
    }
    var player = req.user.id;
    var arena = req.body.arenaID;
    var bookingID = req.params.bookingID;
    var status;
    var day, week, start, end;
    var id;
    if (!player || !arena || !bookingID) {
      res.send("missing parameters");
      return;
    }
    Booking.findOne({
      _id: bookingID
    }, function (err, book) {
      if (!book || !(book.player.equals(player))) {
        res.send("This Action can not be done.");
        return;
      }
      if (err)
        res.send(err);
      else {
        status = book.accepted;
        var obj = getScheduleIndices(book.bookMonth, book.bookDay);
        day = obj.dayIndex;
        week = obj.weekIndex;
        start = book.start_index;
        end = book.end_index;
        id = book._id;

        if (status) {
          Arena.findOne({ _id: arena }, function (err, doc) {
            for (var i = 0; i < 48; i++) {
              var currDay = doc.schedule[week][day];
              if (i >= start && i <= end && currDay[i].equals(id))
                doc.schedule[week][day][i] = 0;
            }
            doc.markModified('schedule');
            doc.save(function (err) {
              if (err)
                res.send(err);
            });
          });
        }

        Booking.remove({
          _id: bookingID
        }, function (err) {
          if (err) { res.send(err); }
        });
      }
    });


  },



  createGame: function (req, res) {

    if (!(req.body.size) || !(req.body.location) || !(req.body.arenas) || !(req.body.start_date) ||
      !(req.body.end_date) || !(req.user.player))
      res.send('Missing fields');

    var creator2 = req.user.player;
    var size2 = req.body.size;
    var location2 = req.body.location;
    var arenas2 = req.body.arenas;
    var start_date2 = req.body.start_date;
    var end_date2 = req.body.end_date;
    let added = new Game
      ({
        creator: creator2,
        size: size2,
        location: location2,
        suggested_arenas: arenas2,
        start_date: start_date2,
        end_date: end_date2
      });
    added.save(function (err, added) {
      if (err)
        res.send(err);
      else
        res.send('Success');
    })

  },

  edit_profile_page: function (req, res) { // prepar the edit profile page
    //retrieve the players's record from DB to be able to fill the fields to be changed
    Player.findOne({ username: req.user.username }, function (err, result) {
      if (err)
        res.send(err);
      else {
        res.render('edit_player_page', { err, result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });

      }
    })
  },
  edit_profile_info: function (req, res) { //accepting new info and update the DB record
    Player.findOne({ username: req.user.username }, function (err, result) {
      if (err)
        res.send(err);
      else {
        if (!req.body.name) {
          res.render('edit_player_page', { err: "name field is empty!...enter new name", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
          return;
        } if (!req.body.email) {
          res.render('edit_player_page', { err: "email field is empty!...enter new email", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
          return;
        } if (!req.body.phone_number) {
          res.render('edit_player_page', { err: "phone number field is empty!...enter new phone number", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
          return;
        } if (!req.body.location) {
          res.render('edit_player_page', { err: "location field is empty!...enter new location", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
          return;
        } if (!req.body.old_password) {
          res.render('edit_player_page', { err: "your password is required to confirm changes", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
          return;
        }


        hasher(req.body.old_password).verifyAgainst(result.password, function (err, verified) {
          if (!verified) {
            res.render('edit_player_page', { err: "wrong password !", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
            return;
          }
          else {
            result.name = req.body.name;
            if (req.body.new_password) {
              hasher(req.body.new_password).hash(function (err, hash) {
                if (err)
                  res.send(err);
                else {
                  result.password = hash;
                  if (!validateEmail(req.body.email)) {
                    res.send("wrong email format");
                    return;
                  }
                  result.email = req.body.email;
                  result.phone_number = req.body.phone_number;
                  if (req.files[0]) {
                    result.profile_pic.data = req.files[0].buffer;
                  }
                  result.location = req.body.location;
                  result.birthdate = req.body.birthdate;
                  result.save(function (err) {
                    if (err) {
                      res.send(err);
                      return;
                    } else {
                      res.render('edit_player_page', { err: "information updated successfully", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
                      return;
                    }

                  });


                }
              });
            }
            else {
              if (!validateEmail(req.body.email)) {
                res.send("wrong email format");
                return;
              }
              result.email = req.body.email;
              result.phone_number = req.body.phone_number;
              if (req.files[0]) {
                result.profile_pic.data = req.files[0].buffer;
              }
              result.location = req.body.location;
              result.birthdate = req.body.birthdate;
              result.save(function (err) {
                if (err) {
                  res.send(err);
                  return;
                } else {
                  res.render('edit_player_page', { err: "information updated successfully", result, date: date_calc(result.birthdate.getFullYear(), result.birthdate.getMonth() + 1, result.birthdate.getDate()) });
                  return;
                }

              });
            }
          }
        });




      }

    });
  },

  viewgames: function (req, res) {

    Game.find(function (err, games) {
      if (err)
        res.send(err.message);
      else
        res.render('viewgames', { games: games });
    });
  },

  commentOnArena: function (req, res) {

    if (req.body.type == 'Player') {
      Arena.findOne({ _id: req.params.id }, function (err, arena) {
        if (err) {
          res.send(err);
          return;
        }
        var content = req.body.comment;
        arena.comments.push({ Content: content, time_stamp: new Date(), player: req.body.username });
        arena.save(function (err) {
          if (err) {
            res.send(err);
            return;
          }
          res.send("Your comment was posted");
        });

      });
    }
    else {
      res.send("not allowed to comment");
    }
  },

  playerRateBooking: function (req, res) {
    Booking.findOne({ _id: req.params.id }, function (err, booking) {
      booking.arena_rating = parseInt(req.body.rating);
      //save arena rating at booking
      booking.save(function (err) {
        if (err) {
          res.send(err);
          return;
        }
      });
      Arena.findOne({ _id: booking.arena }, function (err, arena) {
        var rating = parseInt(req.body.rating);
        if (err) {
          res.send(err);
          return;
        }
        if (!arena) {
          res.send(404);
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
            res.send(err);
            return;
          }
        });
        res.send(arena);
      });
    });

  },


  requestgame: function (req, res, nxt) {

    var NewReq = { playerUsername: req.user.username, comment: req.body.comment, accepted: false };
    var id = req.params.id;
    if (id == null) {
      res.send('can not send a game request of undefined game');
    }
    if (NewReq.playerUsername == null) {
      res.send('can not request a game  for unauthorized user');
    }

    Game.findOne({ _id: id }, function (err, game) {
      if (err) {
        return res.send(err);
      } else {
        var arrayLength = game.requests.length;
        for (var i = 0; i < arrayLength; i++) {
          var n = game.requests[i].playerUsername.localeCompare(NewReq.playerUsername);
          if (n == 0) {
            res.send("You have already sent the same request before");
          }
        }
        game.requests.push(NewReq);
        game.save(nxt);
        res.redirect('/viewgames');
      }
    });
  }
  , acceptrequest: function (req, res, nxt) {
    var id = req.params.id;
    var playerUsername = req.body.playerUsername;
    var currentuser = req.user.username;
    if (id == null) {
      res.send('can not accept a game request of undefined game');
    }
    if (playerUsername == null) {
      res.send('can not accept a game request of undefined user');
    }
    if (currentuser == null) {
      res.send('can not accept a game request for unauthorized user');
    }
    Game.findOne({ _id: id }, function (err, game) {
      if (err) {
        return res.send(err);
      } else {
        var arrayLength = game.requests.length;
        for (var i = 0; i < arrayLength; i++) {
          var n = game.requests[i].playerUsername.localeCompare(playerUsername);
          if (n == 0) {

            game.requests[i].accepted = true;
            game.save();

            Player.findOne({ username: playerUsername }, function (err, player) {
              if (err) {
                return res.send(err);
              } else {
                player.notifications.push(currentuser.concat(' has accepted your request'));
                player.save(nxt);
                res.redirect('/viewgames');

              }
            });

          }
        }

      }
    });
  },

  rejectrequest: function (req, res, nxt) {
    var id = req.params.id;
    var playerUsername = req.body.playerUsername;
    var currentuser = req.user.username;
    if (id == null) {
      res.send('can not reject a game request of undefined game');
    }
    if (playerUsername == null) {
      res.send('can not reject a game request of undefined user');
    }
    if (currentuser == null) {
      res.send('can not reject a game request for unauthorized user');
    }
    Game.findOne({ _id: id }, function (err, game) {
      if (err) {
        return nxt(err);
      } else {
        var arrayLength = game.requests.length;
        for (var i = 0; i < arrayLength; i++) {
          var n = game.requests[i].playerUsername.localeCompare(playerUsername);
          if (n == 0) {
            delete game.requests[i];
            game.save(nxt);

            Player.findOne({ username: playerUsername }, function (err, player) {
              if (err) {
                return res.send(err);
              } else {
                player.notifications.push(currentuser.concat(' has rejected your request'));
                player.save(nxt);
                res.redirect('/viewgames');

              }
            });

          }
        }
      }
    });
  },
  bookWeekly: bookWeekly,
  createBooking: createBooking
}

module.exports = playerController;
