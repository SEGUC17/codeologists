let serviceProvider = require('../models/ServiceProvider');
let Booking = require('../models/Booking');
let Game = require('../models/Game');
let arena = require('../models/Arena');


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
			creator: creator,
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

	}






}

module.exports = serviceProviderController;