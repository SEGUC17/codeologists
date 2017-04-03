var multer = require('multer');
var fs = require('fs');
var path = require('path');
var Booking = require('../models/Booking');
var Arena = require('../models/Arena');
var serviceProvider = require('../models/serviceProvider');
var path = require('path');
let Game = require('../models/Game');


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



let serviceProviderController =
{
	turnAutoAcceptModeOn:function(req,res)
	{
		//get the data from session??
		var username = 'Mina';
		serviceProvider.findOne({username : username} , function(err , user){
			if(!err)
			{
				user.mode = true;
				user.save(function(err){
					if(err)
						console.log(err);
				});
			}
		});
	},

	turnAutoAcceptModeOff:function(req,res)
	{
		//get the data from session??
		var username = 'Mina';
		serviceProvider.findOne({username : username} , function(err , user){
			if(!err)
			{
				user.mode = false;
				user.save(function(err){
					if(err)
						console.log(err);
				});
			}
		});
	},
	
	acceptBooking:function(booking)
	{
		//find the arena of this booking
		arena.findOne({ _id : booking.arena} , function(err , arenaa){
			var schedule = arenaa.schedule;
			var indices = getScheduleIndices(booking.bookMonth , booking.bookDay);
			var dayIndex = indices.dayIndex;
			var weekIndex = indices.weekIndex;
			var start = booking.start_index;
			var end =  booking.end_index;
			var ok = true;
			for(var i=start;i<=end;i++)
			{
				if(schedule[weekIndex][dayIndex][i] != 0)
				{
					ok = false;
					break;
				}
			}
			if(!ok)
			{
				//do something in the front end
				console.log('This is not a free time');
			}
			else
			{
				//find all bookings in the same arena , same day and same month
				Booking.find({arena : arenaa._id , bookDay : booking.bookDay , bookMonth : booking.bookMonth }
					, function(err , allBookings){
					if(err)
						console.log("Error !!");
					else
					{
						for(var i=0;i<allBookings.length;i++)
							if(!(allBookings[i].accepted))
							{
								var start1 = allBookings[i].start_index;
								var end1 = allBookings[i].end;
								//check whether this booking is intersecting with the booked one
								if((start1>=start && start1<=end) || (end1>=start && end1<=end))
								{
									arena.findOne( {_id : allBookings[i].arena}, function(err ,arenaa){
										//send a notification that his booking was rejected
										var notification = 'Unfortunately,your booking for ' + (arenaa.name) + ' from ' 
										+ getTimeFromIndex(start1) + ' to ' + getTimeFromIndex(end1) 
										+ ' has been rejected';
										player.findOne({ _id  : allBookings[i].player} , function(err , playerr){
											playerr.notifications.push(notification);
											playerr.save();
											//removes this booking
											Booking.remove({_id : allBookings[i]._id} , function(err , result){
												if(err)
													console.log(err);
												else
													console.log(result);
											});

										});
									});
								}
							}
					}
					for(var i=start ; i<=end;i++)
					{
						arenaa.schedule[weekIndex][dayIndex][i] = booking._id;
					}
					arenaa.save(function(err){
						if(err)
							console.log(err);
					})
				})
			}

		})
	},

	handleBooking:function(req,res)
	{
		var id = req.body.id;
		Booking.findOne({_id : id} , function(err , booking2){
			if(err)
				console.log('ERROR in handleBooking');
			else
				arena.findOne({_id : booking2.arena} , function(err , arena){
					if(err)
						console.log('ERROR in handleBooking 2');
					else
						arena.findOne({_id : arena.service_provider} , function(err , serviceProvider){
							if(err)
								console.log('ERROR in handleBooking 3');
							else
							{
								if(serviceProvider.mode == true)
									acceptBooking(booking2);
							}
						})
				});
		});
	},
	//month1 is given as 0-index while day is not (javascript convention)
	getScheduleIndices:function(month1 , day1){
		var date = new Date();
		date.setHours(0,0,0,0);
		var year = date.getFullYear();
		var weekDay = (date.getDay()+1)%7;
		//we assumed that it is the same year, lw e7na fi a5er elsana --> to be handled ba3deen
		var curDate = new Date(year , month1 , day1);
		var firstDayInWeek = new Date(date - (weekDay*1000*60*60*24));
		var difInWeeks = Math.floor((curDate - firstDayInWeek)/1000/60/60/24/7);
		return { weekIndex : difInWeeks , dayIndex : (curDate.getDay()+1)%7 };
	},
	//the indices are 0-based
	getTimeFromIndex:function(index){
		var hour = Math.floor(index/2);
		var minute = '00';
		if(index%2==1)
			minute ='30';
		return hour+':'+minute;
	},


	rejectBooking:function(req,res){
		var bookingID = req.body.booking;
		arena.findOne({_id : booking.arena},function(err , arenaa){
			var arenaName = arenaa.name;
			Booking.findOne({_id:bookingID} , function(err , curBooking){
				if(err)
					console.log(err);
				else
				{
					var notification = 'Unfortunately,your booking for ' + (arenaName) + ' from ' 
						+ getTimeFromIndex(curBooking.start_index) + ' to ' + end1 + ' has been rejected';
					player.findOne({ _id  : curBooking.player} , function(err , playerr){
						playerr.notifications.push(notification);
						playerr.save();
						//removes this booking
						Booking.remove({_id : curBooking._id} , function(err , result){
						if(err)
							console.log(err);
						else
							console.log(result);
						});
					});
				}
			});
		});
	},


	createGame:function(req,res){
		//to get from the session
		var creator2 = 'Mina';
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
		added.save(function(err , added){
			if(err)
				console.log(err);
		})

	},
  editarena:function(req, res){
        var arenaname=req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena) {
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if (req.user && arena.service_provider != req.user._id) { res.redirect('/'); } //handle error
            res.render('editarena', { arena: arena });
        });
    },
  editarenainfo:function(req, res){
         var arenaname=req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena){
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if (req.user && arena.service_provider != req.user._id) { res.redirect('/'); } //handle error
            arena.rules_and_regulations = req.body.rules_and_regulations;
            arena.address = req.body.address;
            arena.location = req.body.location;
            arena.size = req.body.size;
            arena.type = req.body.type;
            arena.price = req.body.price;
            arena.save(function(err) {
                if (err) {
                    res.redirect('/'); //handle error
                    // nxt(err);
                    // return;
                }
                res.redirect('/arenas/' + arena.name);
            });
        });
    },
  editdefaultschedule:function(req,res){
        var arenaname=req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena){
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if (req.user && arena.service_provider != req.user._id) { res.redirect('/'); } //handle error
            for (var i = 0; i < 7; i++) {
                for (var j = 0; j < 48; j++) {
                    arena.default_weekly_schedule[i][j] = req.body.schedule[i][j].checked ? -1 : 0; //may be changed
                }
            }
        });
    },
    addimage: function(req, res, nxt) {
        var img_path = req.files[0].path;
        var newimage = { data: fs.readFileSync(img_path) };
        var arenaname = req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena) {
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if (req.user && arena.service_provider != req.user._id) { res.redirect('/'); } //handle error
            arena.photos.push(newimage);
            arena.save(nxt);
        });
    },

    add_to_blacklist: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerUsername = req.body.Bplayerusername;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {
            if (err)
                console.log(err);

            player.findOne({ username: playerUsername }, function(err2, player) {
                if (err2) {
                    res.render('SPprofile', { user: serviceProvider, mssgN: 8 });
                } else {
                    if (serviceProvider.blacklist.include(player))
                        res.render('SPprofile', { user: serviceProvider, mssgN: "0" });
                    else {
                        serviceProvider.blacklist.push(player);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "4" });
                    }
                }
            });
        });
    },

    add_to_blacklist_phone: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerNumber = req.body.BplayerNumber;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {
            if (err)
                console.log(err);

            player.findOne({ phone_number: playerNumber }, function(err2, player) {
                if (err2) {
                    res.render('SPprofile', { user: serviceProvider, mssgN: 8 });
                } else {
                    if (serviceProvider.blacklist.include(player))
                        res.render('SPprofile', { user: serviceProvider, mssgN: "0" });
                    else {
                        serviceProvider.blacklist.push(player);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "4" });
                    }
                }
            });
        });
    },

    remove_from_blacklist: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerUsername = req.prams.username;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {

            player.findOne({ username: playerUsername }, function(err2, player) {
                if (err2)
                    res.render('SPprofile', { user: serviceProvider, mssgN: "8" });
                else {
                    if (serviceProvider.blacklist.include(player)) {
                        var pos = serviceProvider.blacklist.indexOf(player);
                        serviceProvider.blacklist.splice(pos, 1);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "5" });

                    } else
                        res.render('SPprofile', { user: serviceProvider, mssgN: "1" });
                }
            });
        });
    },

    add_to_whitelist: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerUsername = req.body.Wplayerusername;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {

            player.findOne({ username: playerUsername }, function(err2, player) {
                if (err2)
                    res.render('SPprofile', { user: serviceProvider, mssgN: "8" });
                else {
                    if (serviceProvider.whitelist.include(player))
                        res.render('SPprofile', { user: serviceProvider, mssgN: "2" });
                    else {
                        serviceProvider.whitelist.push(player);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "6" });
                    }
                }
            });
        });
    },

    add_to_whitelist_phone: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerNumber = req.body.WplayerNumber;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {
            if (err)
                console.log(err);

            player.findOne({ phone_number: playerNumber }, function(err2, player) {
                if (err2) {
                    res.render('SPprofile', { user: serviceProvider, mssgN: 8 });
                } else {
                    if (serviceProvider.whitelist.include(player))
                        res.render('SPprofile', { user: serviceProvider, mssgN: "0" });
                    else {
                        serviceProvider.whitelist.push(player);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "4" });
                    }
                }
            });
        });
    },

    remove_from_whitelist: function(req, res) {

        var serviceProviderID = req.cookies.ID;
        var playerUsername = req.prams.username;

        serviceProvider.findById(serviceProviderID, function(err, serviceProvider) {

            player.findOne({ username: playerUsername }, function(err2, player) {
                if (err2)
                    res.render('SPprofile', { user: serviceProvider, mssgN: "8" });
                else {
                    if (serviceProvider.whitelist.include(player)) {
                        var pos = serviceProvider.whitelist.indexOf(player);
                        serviceProvider.whitelist.splice(pos, 1);
                        serviceProvider.save(function(err) {
                            console.log('Success!');
                        });
                        res.render('SPprofile', { user: serviceProvider, mssgN: "7" });

                    } else
                        res.render('SPprofile', { user: serviceProvider, mssgN: "3" });
                }
            });
        });
    },
  
  edit_profile_page: function(req,res) { // prepar the edit profile page
                                            //retrieve the players's record from DB to be able to fill the fields to be changed
           serviceProvider.findOne({username : req.session.username},function(err,result){
              if(err)
                res.send(err);
              else{
                res.render('edit_provider_page',{err,result});

              }
           })
  },
  edit_profie_info : function(req,res){ //accepting new info and update the DB record
              serviceProvider.findOne({username : req.session.username},function(err,result){
                  if(err)
                   res.send(err);
                  else{
                  if(!req.body.name){
                   res.render('edit_provider_page',{err :"name field is empty!...enter new name",result});
                    return;
                 }if(!req.body.email){
                    res.render('edit_provider_page',{err :"email field is empty!...enter new email",result});
                      return;
                  }if(!req.body.phone_number){
                     res.render('edit_provider_page',{err :"phone number field is empty!...enter new phone number",result});
                      return;
                   }if(!req.body.old_password){
                      res.render('edit_provider_page',{err :"your password is required to confirm changes",result});
                      return;
                    }if(result.password != req.body.old_password){
                        res.render('edit_provider_page',{err :"wrong password !",result});
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
                    if(req.body.mode == "on")
                    result.mode = true;
                    else
                    result.mode = false;
                    result.save();
                    res.render('edit_provider_page',{err :"information updated successfully",result});
                    }

                  });
  },
  setUnavailable: function(req,res){
     var startIndex = req.body.startIndex;
     var endIndex   = req.body.endIndex;
     var day = req.body.day;
     var month = req.body.month;
     var Indices = getScheduleIndices(month,day);
     var weekIndex = Indices.weekIndex;
     var dayIndex = Indices.dayIndex;
     var flag = 0;

     arenaModel.findById(req.paramas.arena_id,function(err,arena){
     	var schedule = arena.schedule;
     	var before_edit=[];
     	for (var i = 0; i < 48; i++) {
     		before_edit[i] = schedule[weekIndex][dayIndex][i];
     	};
     	for (var i = startIndex; i <= endIndex ; i++) {
     		if(schedule[weekIndex][dayIndex][i]== 0 ||schedule[weekIndex][dayIndex][i]== -1)
     	         schedule[weekIndex][dayIndex][i] = -1;
     	    else{
     	    	flag =  1;
                break;
     	    }

     	};
     	if(flag){
            for (var i = 0; i < 48; i++) {
     		      schedule[weekIndex][dayIndex][i] = before_edit[i] ;
     	};
     	res.send("error, You can not set booked slots to be unavailable");  
     	}
     	else{
     		arena.schedule = schedule;
     		arena.save(function(err){
     			if(err){
     				res.send("error in arena DB");
     			}
     		});
     	    res.redirect("/sp/arena/"+req.paramas.arena_id);
     	}

     });
	},


	setAvailable: function(req,res){
     var startIndex = req.body.startIndex;
     var endIndex   = req.body.endIndex;
     var day = req.body.day;
     var month = req.body.month;
     var Indices = getScheduleIndices(month,day);
     var weekIndex = Indices.weekIndex;
     var dayIndex = Indices.dayIndex;

     arenaModel.findById(req.paramas.arena_id,function(err,arena){
     	var schedule = arena.schedule;
     	for (var i = startIndex; i <= endIndex ; i++) {
     	schedule[weekIndex][dayIndex][i] = 0;	
     	};
     
     arena.schedule = schedule;
     		arena.save(function(err){
     			if(err){
     				res.send("error in arena DB");
     			}
     		});
     	    res.redirect("/sp/arena/"+req.paramas.arena_id);
     });
	},
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
