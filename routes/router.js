var express = require('express');
var passport = require("passport");
var playerController=require('../controllers/playerController');

var router = express.Router();

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.post('/comment', ensureAuthenticated, function(req, res){
  var player = req.body.username;
  var content = req.body.comment;
  req.arena.comments.push({Content: content, time_stamp: new Date(), player: player});
  res.redirect('/');
});

router.post('/ProviderRatesBooking', ensureAuthenticated, function(req, res){
  var player = req.body.booking.player;
  var rating = req.body.rating;
  req.booking.player.avg_rating += rating;
  req.booking.player.avg_rating ++;

});

// router.post('/comment', ensureAuthenticated, function(req, res){
//   var player = req.body.username;
//   var content = req.body.comment;
//   req.arena.comments.push({Content: content, time_stamp: time_stamp, player: player});
// }


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "You must be logged in to see this page.");
    //res.redirect("/login");
  }
}


module.exports = router;
