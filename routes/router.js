var express = require('express');
var playerController = require('../controllers/playerController');
var Player = require('../models/Player')
var router = express.Router();
var Arena = require('../models/Arena')
var ServiceProvider = require('../models/ServiceProvider');
var Booking = require('../models/Booking');
//Service Provider views pending requests
router.get('/sp/arena/:arenaId', function (req, res) {
    Arena.findById(arenaId, function (err, foundArena) {
        if (err) {
            res.send("Sorry Broken Link, this arena may have been deleted, removed or is no longer existant");
        }
        else {
            ServiceProvider.findById(foundArena.service_provider, function (err, serviceProvider) {
                if (err) {
                    res.send("Internal server Error, Sorry for the inconvenience !");
                }
                else if (serviceProvider.username == req.cookies.username) {
                    //find all pending requests where the request time is greater than today, the arena is the current arena  and have not been accepted
                    Booking.find({accepted:0,arena:foundArena._id}).$where('(new Date(new Date().getFullYear(),this.bookMonth,this.bookDay))>(new Date())').exec(function (err, bookingArr) {
                            //TODO: render a view (will be done in Sprint 2 ISA)
                            if(err)
                            {   
                                res.json("Error finding pending requests");
                            }
                            else
                            {
                            res.json(bookingArr);
                            }

                    });
                }
            })

        }
    })
})



//book free hours
router.post('/arena/:arenaId?bookHours', function (req, res) {

    Player.findOne({ username: req.cookies.username }, function (err, player) {

        playerController.bookHours(req.body.month, req.body.day, req.body.startIndex, req.body.endIndex, new Date(), req.params.arenaId, player._id, function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.redirect('/arena/:arenaId');
            }
        })

    })


})


module.exports = router;
