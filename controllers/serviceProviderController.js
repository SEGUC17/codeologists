let serviceProvider = require('../models/ServiceProvider');
let Booking = require('../models/Booking');
let Game = require('../models/Game');
let arena = require('../models/Arena');
var multer=require('multer');
var fs=require('fs');
var path=require('path');

let Arena = require('../models/Arena');

var storage=multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'public/image/');
    },
    filename : function(req,res,cb){
        cb(null,"_"+Date.now());
    }
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
		{
			creator: creator2,
			size: size2,
			location: location2,
			suggested_arenas: arenas2,
			start_date: start_date2,
			end_date: end_date2
		}
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
        if(req.user && arena.service_provider!=req.user._id){ res.redirect('/'); } //handle error
        res.render('editarena', { arena: arena });
    });
    },
  editarenainfo:function(req, res){
         var arenaname=req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena){
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
           if(req.user && arena.service_provider!=req.user._id){ res.redirect('/'); } //handle error
            arena.rules_and_regulations=req.body.rules_and_regulations;
    	    arena.address=req.body.address;
    	    arena.location=req.body.location;
    	    arena.size=req.body.size;
    	    arena.type=req.body.type;
    	    arena.price=req.body.price;
    		arena.save(function(err){
                if(err){
                    res.redirect('/'); //handle error
                   // nxt(err);
                   // return;
                }
                res.redirect('/arenas/'+arena.name);
            });
        });
    },
  editdefaultschedule:function(req,res){
        var arenaname=req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena){
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if(req.user && arena.service_provider!=req.user._id){ res.redirect('/'); } //handle error
            for(var i=0;i<7;i++){
                for(var j=0;j<48;j++){
                    arena.default_weekly_schedule[i][j]=req.body.schedule[i][j].checked? -1 : 0; //may be changed
                }
            }
        });
    },
    addimage:function(req,res,nxt){
        var img_path=req.files[0].path;
        var newimage={data : fs.readFileSync(img_path)};
        var arenaname=req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena){
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if(req.user && arena.service_provider!=req.user._id){ res.redirect('/'); } //handle error
           arena.photos.push(newimage);
           arena.save(nxt);
        });
    }
}

module.exports = serviceProviderController;