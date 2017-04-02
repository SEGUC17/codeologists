//var serviceProvider = require('./ServiceProvider');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var Booking = require('../models/Booking');
var Arena = require('../models/Arena');
var serviceProvider = require('../models/serviceProvider');

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'public/');
  },
  filename: function(req, file, cb){
    cb(null, req.body.name + Date.now());
  }
});

var upload = multer({
  storage: storage
});

var serviceProviderController =
{
  createArena:function(req, res)
  {
    // initializing the arena
    // ageeeb el service provider id mneen?
    var rules = req.body.rules_and_regulations;
    var name = req.body.name;
  	var address = req.body.address;
    var location = req.body.location;
    var size = req.body.size;
  	var type = req.body.type;
  	var price = req.body.price;


    // storing photos
    var photos;
    for (var i = 0; req.files && req.files[i]; i++)
    {
      var pth = req.files[i].path;
      var data = fs.readFileSync(pth);
      //var type = 'image/'+path.extname(req.files[i].originalname);

      photos.push({data})
    }
  	var ratings_count = 0;
    var avg_rating = 0;


    // testing
    var saturday = [true, false, false];
    // creating default schedule
    var default_schedule = [];
    //var day = req.body.saturday;
    var day = saturday;
    var sat = [];
    for (var i = 0; i < day.length; i++) {
      if(day[i] == true)
        sat.push(0);
      else {
        sat.push(-1);
      }
    }

    //day = req.body.sunday;
    day = [true, false, true];
    var sun = [];
    for (var i = 0; i < day.length; i++) {
      if(day[i] == true)
        sun.push(0);
      else {
        sun.push(-1);
      }
    }

    //day = req.body.monday;
    var mon = [];
    for (var i = 0; i < day.length; i++) {
      if(day[i] == true)
        mon.push(0);
      else {
        mon.push(-1);
      }
    }

    //day = req.body.tuesday;
    var tues = [];
    for (var i = 0; i < day.length; i++) {
      if(day[i] == true)
        tues.push(0);
      else {
        tues.push(-1);
      }
    }

    //day = req.body.wednesday;
    var wed = [];
    for (var i = 0; i < day.length; i++) {
      if(day[i] == true)
        wed.push(0);
      else {
        wed.push(-1);
      }
    }

    //day = req.body.thursday;
    var thurs = [];
    for (var i = 0; i < day.length; i++) {
      if(day[i] == true)
        thurs.push(0);
      else {
        thurs.push(-1);
      }
    }

    //day = req.body.friday;
    var fri = [];
    for (var i = 0; i < day.length; i++) {
      if(day[i] == true)
        fri.push(0);
      else {
        fri.push(-1);
      }
    }

    default_schedule.push(sat);
    default_schedule.push(sun);
    default_schedule.push(mon);
    default_schedule.push(tues);
    default_schedule.push(wed);
    default_schedule.push(thurs);
    default_schedule.push(fri);

    var normal_schedule = [];
    var weekNo = 4;
    var daysNo = 7;
    var slotsNo = 3;
    for (var i = 0; i < weekNo; i++)
    {
      var oneWeek = [];
      for (var j = 0; j < daysNo; j++)
      {
        var oneDay = [];
        for (var k = 0; k < slotsNo; k++)
        {
          oneDay.push(default_schedule[j][k]);
        }
        oneWeek.push(oneDay);
      }
      normal_schedule.push(oneWeek);
    }

    var user = req.user.username;
    var servProv;
    ServiceProvider.findOne({username: username}, function(err, doc){
      if(err)
      {
        console.log(err);
      }
      else {
        servProv = doc._id;
      }
    })
    // el service provider kda s7?
    var newArena = new Arena({
      service_provider: servProv;
      rules_and_regulations: rules,
      name: name,
      address: address,
      location: location,
      avg_rating: avg_rating,
      size: size,
      type: type,
      price: price,
      photos: photos,
      ratings_count: ratings_count,
      default_weekly_schedule: default_schedule,
      schedule: normal_schedule
    });

    // m7tag at2aked eno unique somehow?
    // akeed msh unique 3shan f mal3abeen f nafs el mkan
    newArena.save(function(err){
      if(err)
        console.log(err);
    });
  },

  cancelBooking:function(req, res)
  {
    var player = req.body.player;
    var arena = req.body.arena;
    var time_stamp = req.body.time_stamp;
    var status;
    var day, week, start, end;
    var id;

    Booking.findOne({player: player,
       arena: arena,
       time_stamp: time_stamp}, function(err, book){
         if(err)
          console.log(err);
        else {
          status = book.accepted;
          var obj = getScheduleIndices(book.bookMonth, book.bookDay);
          day = obj.dayIndex;
          week = obj.weekIndex;
          start = book.start_index;
          end = book.end_index;
          id = book._id;
        }
      });

    // I need the index of day in the week
    // week means week 1 2 3 4 in the month or 1 .. 52 in the year?
    if(accepted)
    {
      Arena.findOne({_id: arena}, function(err, doc){
        for (var i = 0; i < 48; i++) {
          var currDay = doc.schedule[week][day];
          if(i >= start && i <= end && currDay[i] == id)
            doc.schedule[week][day][i] = 0;
        }
      });
    }

    Booking.remove({player: player,
       arena: arena,
       time_stamp: time_stamp}, function(err){
         if(err){console.log(err);}
       })
  }
}

module.exports = serviceProviderController;
