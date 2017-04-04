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
  
  commentOnArena:function (req,res) {
    if(req.user && req.user.type == 'Player'){
      Arena.findOne({_id: req.params.id}, function (err, arena) {
        if (err) {
          next(err);
          return;
        }
        var content = req.body.comment;
        arena.comments.push({Content: content, time_stamp: new Date(), player: req.user.username});
        arena.save(function(err) {
          if (err) {
            next(err);
            return;
          }
          req.flash("info", "Your comment was posted");
          res.redirect('/');
        });
      });
    }
    else{
      req.flash("error", "You have to be a signed in player to comment");
      res.redirect('/');
    }
  },

  playerRateBooking:function (req,res) {
    Booking.findOne({_id: req.params.id}, function (err, booking) {
      booking.arena_rating = req.body.rating;
      //save arena rating at booking
      booking.save(function(err) {
        if (err) {
          next(err);
          return;
        }
        res.redirect('/');
      });

      // find arena
      Arena.findOne({ _id: req.booking.arena }, function(err, arena) {
        var rating = req.body.rating;
        if (err) { return next(err); }
        if (!arena) { return next(404); }
        // update rating
        arena.avg_rating = (arena.avg_rating*arena.ratings_count+rating)/(arena.ratings_count+1);
        arena.ratings_count ++;
        // save rating at arena
        arena.save(function(err) {
          if (err) {
            next(err);
            return;
          }
          res.redirect('/');
        });
      });
    }
  }
}

module.exports = playerController;
