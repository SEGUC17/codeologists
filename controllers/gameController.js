var createGame = function (req, res) {

    if (!(req.body.size) || !(req.body.location) || !(req.body.start_date) ||
        !(req.body.end_date) || !(req.user._id)) {
        res.send('Missing fields');
        return;
    }

    var creator2 = req.user._id;
    var size2 = req.body.size;
    var location2 = req.body.location;
    //var arenas2 = req.body.arenas;
    var start_date2 = req.body.start_date;
    var end_date2 = req.body.end_date;
    let added = new Game
        ({
            creator: creator2,
            size: size2,
            location: location2,
            //suggested_arenas: arenas2,
            start_date: start_date2,
            end_date: end_date2
        });
    added.save(function (err, added) {
        if (err)
            res.send(err);
        else
            res.send('Success');
    })

}
function viewgames(req, res) {

    Game.find(function (err, games) {
        if (err)
            res.json({error : err.message});
        else
            res.json({games : games});
    });
};
function requestgame(req, res, nxt) {

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
                    return;
                }
            }
            game.requests.push(NewReq);
            game.save(nxt);
            res.redirect('/viewgames');
        }
    });
}
function acceptrequest(req, res, nxt) {
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
};




function rejectrequest(req, res, nxt) {
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
                    //delete game.requests[i];
                    game.requests.splice(i);
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
}

let gameController = {
    createGame: createGame,
    viewgames: viewgames,
    requestgame : requestgame,
    acceptrequest: acceptrequest,
    rejectrequest: rejectrequest,

}

module.exports = gameController;