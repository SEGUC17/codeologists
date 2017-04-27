
var Game = require('../models/Game');
var Player = require('../models/Player');
/*
gameController.createGame
A function that creates a game for the player
@param : the start date, the desired start date for some game
@param : the end date, the desired end date for some game
@param : the location, the desired location for the game
@param : the size, the desired size of some game
*/
var createGame = function (req, res) {

    req.checkBody('start_date', 'Start Date is required.').notEmpty();
    req.checkBody('end_date', 'End Date is required.').notEmpty();
    req.checkBody('location', 'Location is required.').notEmpty();
    req.checkBody('size', 'Arena size is required.').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).json(errors);
    }

    var creator2 = req.user.username;
    var size2 = req.body.size;
    var location2 = req.body.location;
    var start_date2 = req.body.start_date;
    var end_date2 = req.body.end_date;
    if (start_date2 > end_date2 || end_date2 < new Date()) {
        res.status(400).json({ error: "Enter a valid date" });
    }
    else {
        let added = new Game
            ({
                creator: creator2,
                size: size2,
                location: location2,
                start_date: start_date2,
                end_date: end_date2
            });
        added.save(function (err, added) {
            if (err) {
                res.json(400, { error: "Error while creating the game" });
                return;
            }
            else {
                res.json(200, { success: 'Game created successfully' });
                return;
            }
        })
    }
}
/*
Function: gameController.viewgames

functionality: this function fetches the games 

@param: null 

@returns list of the games 
*/
function viewgames(req, res) {

    Game.find(function (err, games) {
        if (err)
            res.json({ error: err.message });
        else
            res.json(games);

    });
};

/*
gameControler.requestgame:
a function attaches the request to the game .
@param req.user.username :the current user to which the request belong
@param req.body.comment: a comment to be added to the request
@param req.params.id :the id of the game to which the request is sent
@return :whether the request was attached to the game correctly
*/

function requestgame(req, res, nxt) {

    var NewReq = { playerUsername: req.user.username, comment: req.body.comment, accepted: false };
    var id = req.params.id;
    if (id == null) {
        res.status(500).json({ error: 'can not send a game request of undefined game' });
    }
    if (NewReq.playerUsername == null) {
        res.status(401).json({ error: 'can not request a game  for unauthorized user' });
    }


    Game.findOne({ _id: id }, function (err, game) {
        if (err) {
            res.status(400).json(err);

        } else {

            var arrayLength = game.requests.length;
            if (game.creator == req.user.username) {
                res.send("Can't send a request because it's your own game");
                return;
            }
            for (var i = 0; i < arrayLength; i++) {
                var n = game.requests[i].playerUsername.localeCompare(NewReq.playerUsername);
                if (n == 0) {
                    res.send("You have already sent the same request before !");
                    return;
                }
            }
            game.requests.push(NewReq);
            game.save(nxt);
            console.log(game);
            res.send("Request sent Successfully !");

        }
    });
}

/*
gameControler.acceptrequest:
 a function accept the request and attaches the a message to the notifications of the player sending the request with the accept state 
@param req.params.id :the id of the game to which the request accepted
@param req.body.playerUsername: the username of the player whose request to be accepted 
@param req.user.username :the current accepting the request
@return :returns a message with whether the process succeeded
*/

function acceptrequest(req, res, nxt) {
    var id = req.params.id;
    var playerUsername = req.body.playerUsername;
    var currentuser = req.user.username;
    if (id == null) {
        res.status(400).json({ error: 'can not accept a game request of undefined game' });
    }
    if (playerUsername == null) {
        res.status(400).json({ error: 'can not accept a game request of undefined user' });

    }
    if (currentuser == null) {
        res.status(401).json({ error: 'can not accept a game request for unauthorized user' });

    }
    Game.findOne({ _id: id }, function (err, game) {
        if (err) {
            res.status(400).json({ error: err });
        } else {

            for (var i = 0; i < game.requests.length; i++) {
                var n = game.requests[i].playerUsername.localeCompare(playerUsername);
                if (n == 0) {
                    // game.requests[i].accepted = true;
                    game.requests.splice(i);
                    game.markModified("requests");
                    game.save();
                    Player.findOne({ username: playerUsername }, function (err, player) {
                        if (err) {
                            res.status(400).json({ error: err });
                        } else {

                            player.notifications.push(currentuser.concat(' has accepted your request to play the game on ').concat(game.start_date));

                            player.save(nxt);
                            // console.log(player);
                            res.send("Request was Accepted successfully");

                        }
                    });

                }
            }

        }
    });
};



/*
gameControler.rejectrequest:
a function accept the request and attaches the a message to the notifications of the player sending the request with the reject state
@param req.params.id :the id of the game to which the request accepted
@param req.body.playerUsername: the username of the player whose request to be rejected 
@param req.user.username :the current rejecting the request
@returns a message with whether the process succeeded
@return :returns a message with whether the process succeeded

*/

function rejectrequest(req, res, nxt) {
    var id = req.params.id;
    var playerUsername = req.body.playerUsername;
    var currentuser = req.user.username;
    if (id == null) {

        res.status(400).json({ error: 'can not reject a game request of undefined game' });

    }
    if (playerUsername == null) {
        res.status(400).json({ error: 'can not reject a game request of undefined user' });
    }
    if (currentuser == null) {

        res.status(401).json({ error: 'can not reject a game request for unauthorized user' });

    }
    Game.findOne({ _id: id }, function (err, game) {
        if (err) {
            res.status(400).json({ error: err });
        } else {

            for (var i = 0; i < game.requests.length; i++) {
                var n = game.requests[i].playerUsername.localeCompare(playerUsername);
                if (n == 0) {
                    game.requests.splice(i);
                    game.markModified("requests");
                    game.save(nxt);

                    Player.findOne({ username: playerUsername }, function (err, player) {
                        if (err) {
                            res.status(400).json(err);

                        } else {
                            player.notifications.push(currentuser.concat(' has rejected your request to play the game on ').concat(game.start_date));
                            player.save(nxt);
                            res.send("Request was rejected successfully");


                        }
                    });

                }

            }
        }
    });
}

/*
gameControler.myrequests:
@param req.user.username :the current user
@return :returns the list of requests to the game created by the current user .
*/

function myrequests(req, res) {
    var currentuser = req.user.username;
    Game.findOne({ creator: currentuser }, function (err, game) {
        if (err) {
            res.status(400).json({ error: err });
            return;
        } else {
            if (game == null) {
                res.json([]);
                return;
            }
            res.json(game.requests);
            return;
        }
    });
};
/*
gameControler.mygame:
@param req.user.username :the current user
@return:returns the id of   the game created by the current user 
*/

function mygame(req, res) {
    var currentuser = req.user.username;

    Game.findOne({ creator: currentuser }, function (err, game) {
        if (err) {
            res.status(400).json({ error: err });
            return;
        } else {
            if (game == null) {
                res.json("");
                return;
            }
            res.json(game._id);
            return;
        }
    });
};
let gameController = {
    createGame: createGame,
    viewgames: viewgames,
    acceptrequest: acceptrequest,
    rejectrequest: rejectrequest,
    requestgame: requestgame,
    myrequests: myrequests,
    mygame: mygame
}

module.exports = gameController;