var Arena = require('../models/Arena');
var Player = require('../models/Player');
var ServiceProvider = require('../models/ServiceProvider');
var RegisteredUser = require('../models/RegisteredUser');
var hasher = require('password-hash-and-salt');

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

/*
visitorController.compute:
takes the result from search method then compute the paging attributes and send them with *the result 
@param result : result passed from the search function
@param req : the req passed from the search function
@param res : the res passed from the search function
@param count : the number of pages to be displayed
@param start : the position in result from which the page will start to display elements
@param end : the position in result at which the page will stop displaying elements
@param active : the index of the active page
*/

function compute(req, res, result) {
	if (result.length == 0) {
		res.status(404).json({error:"no Arena matches your value"});
		return;
	} else {
		var tmp = 0;
		if (!req.body.index)  // in case the page diplayed for the first time not as a result of selecting page index; index will not exit in the body
			tmp = 1;                                                                                                     // so we set it to one
		else
			tmp = req.body.index;
		var count = Math.ceil(result.length / 10);
		var start = (tmp - 1) * 10;
		var end = tmp == count ? result.length : tmp * 10;
		var active = tmp;  //to indicate the active page rightnow

		res.json({result,count,start,end,active});
		return;
	}
}


let visitorController = {

	/*
visitorController.createUser

Creates and inserts a new user into the database (a player or a service provider)

@param type : Type of the account (player or service provider)
       name : Name of the user
       username : Username of the account
       password : Password of the account
       email : Email of the user
       phone_number : Phone number of the user
       location : Address of the user
       birthdate : Birthdate of the account (in case it was a player)
       mode : Whether the system should auto-accept all bookings to the arenas owned by this account (in case it was a service provider)

@return _
*/
	createUser: function (req, res) {
		if(req.body.password=='')
		{

			req.checkBody('name', 'Name is required.').notEmpty();
            req.checkBody('username', 'Username is required.').notEmpty();
            req.checkBody('password', 'Password is required.').notEmpty();
            req.checkBody('email', 'Email is required.').isEmail();
            req.checkBody('email', 'Email is required.').notEmpty();
            req.checkBody('location', 'Location is required.').notEmpty();
            req.checkBody('phone_number', 'Phone number is required.').notEmpty();
            req.checkBody('phone_number', 'Phone number is not correct.').isNumeric();
            if(req.body.type=='player'){
            	req.checkBody('birthdate', 'Birthdate is required.').notEmpty();
            	req.checkBody('birthdate', 'Birthdate no in correct format').isDate();
            }
            else
            	req.checkBody('mode', 'Mode is required.').notEmpty();
            var errors = req.validationErrors();

           
            return res.status(400).json(errors);
            
		}
		RegisteredUser.findOne({ username: req.body.username }, function (err, user) {
			if (user){
				return res.status(400).json([{param: 'username' ,msg:'Username already used'}]);
			}
			else {

				hasher(req.body.password).hash(function (error, hash) {
					if (error)
						return res.status(500).json({ error: error.message });


					console.log(req.body.mode);

					req.checkBody('name', 'Name is required.').notEmpty();
		            req.checkBody('username', 'Username is required.').notEmpty();
		            req.checkBody('password', 'Password is required.').notEmpty();
		            req.checkBody('email', 'Email is required.').notEmpty();
		            req.checkBody('email', 'Email not in correct format').isEmail();
		            req.checkBody('location', 'Location is required.').notEmpty();
		            req.checkBody('phone_number', 'Phone number is required.').notEmpty();
		            req.checkBody('phone_number', 'Phone number is not correct.').isNumeric();
		            if(req.body.type=='player'){
			            req.checkBody('birthdate', 'Birthdate is required.').notEmpty();
			            req.checkBody('birthdate', 'Birthdate no in correct format').isDate();
					}
					else
						req.checkBody('mode', 'Mode is required.').notEmpty();

		            var errors = req.validationErrors();

		            if (errors) {
		                return res.status(400).json(errors);
		            }

					var newUser;
					if(req.body.type=='player')
						newUser = new Player();
					else
						newUser = new ServiceProvider();
					newUser.name = req.body.name;
					newUser.username = req.body.username;
					newUser.email = req.body.email;
					newUser.phone_number = req.body.phone_number;
					newUser.location = req.body.location;

					

					if (req.body.profile_pic.charAt(0)!='/')
						newUser.profile_pic.data = req.body.profile_pic;
					if(req.body.type=='player'){
						newUser.ratings_count = 0;
						newUser.birthdate = req.body.birthdate;
					}
					else
						newUser.mode = req.body.mode ? true : false;
					

					// Store hash (incl. algorithm, iterations, and salt) 
					newUser.password = hash;



					newUser.save(function (err, player) {
						if (err){
							if(err.code == 11000){
		                        var errors = [];
		                        var field = err.message.split('index: ')[1];
		                        field = field.split(' dup key')[0];
		                        field = field.substring(0, field.lastIndexOf('_'));
	                            if(field == 'phone_number')
	                            	errors.push({param: 'phone_number',msg:'Phone number already in use'});
	                            else
	                            	errors.push({param: 'email',msg:'Email already in use'});
	                            res.json(400,errors);
							}
						}
						else {

							res.json({ success: "New user created" });
						}
					});


				});

			}
		});
	},

/*
visitorController.view_all

A function that searches for all arenas found in location provided by user. If the user is in the blacklist of any service provider then all arenas that belongs to that service provider won't appear.

@param location: location provided by the user to get all arenas in.

@return arenas: list of all arenas in a specific location

*/

	view_all: function (req, res) {

		if (req.body.location.length == 0) {
			res.json({ error: "Please Choose Your Location to View Arenas In." });
		} else {

			Arena.find({ location: req.body.location }, function (err, result) {
				if (err)
					res.json({ error: err });
				else {
					ServiceProvider.find(function (err, service) {
						if (err)
							res.json({ error: err });
						else {
							for (var i = 0; i < result.length; i++) { //loop searching in list of arenas
								var id = require('mongodb').ObjectID(result[i].service_provider);
								for (var j = 0; j < service.length; j++) {//loop searching in list of service_providers

									if (id.equals(service[j]._id)) {


										var blacklist = service[j].blacklist;

										for (var k = 0; k < blacklist.length; k++) {//loop searching in blacklist of service provider

											if (req.user && req.user._id == blacklist[k]) {
												result.splice(i, 1);
												break;
											}
										}
									}
								}
							}
						}

						if (result.length == 0) {
							res.json(result);
							return;
						}
						res.json(result);
					})
				}
			})

		}


	},

/*
visitorController.view_details_of_arena

A function that gets all the details of an arena chosen by the user.

@param name: name of arena chosen by the user.

@return arena: arena object that holds all the data of the arena

*/


	view_details_of_arena: function (req, res) {

		var blacklisted = 0;

		Arena.findOne({ name: req.params.arenaName }, function (err, result) {
			if (err) {
				res.status(404).json({ error: err });
			}
			else {
				if (result.length == 0)
					res.status(403).json({ error: "No Arenas Found in That Location." });
				else {
					var id = require('mongodb').ObjectID(result.service_provider);
					ServiceProvider.findById(id, function (err, service) {
						var blacklist = service.blacklist;


						for (var i = 0; i < blacklist.length; i++) {

							if (req.user._id == blacklist[i]) {
								blacklisted = 1;
							}
						}

						if (blacklisted == 0)

							res.status(200).json(result);
						else
							res.status(404).json({ error: "No Arenas" });
					})

				}


			}
		})
	},

 /* 
visitorController.search:
retrieve and view arenas matched the attribute value selected by the visitor after 
@param search_type : the type of the search; price or name or location
@param search_value : the required value of the search type
@param result : the final array of arenas the visitor can see
*/


	filter: function (req, res) {
		var search_type = req.body.search_type;
		var search_value = req.body.search_value;
		 req.checkBody('search_value','search_value is empty!...enter a value').notEmpty();
              if(req.validationErrors())
                  return res.status(400).json({error:"search_value is empty!...enter a value."});
		if (search_type == "price") {
			req.checkBody('search_value','price must be a number.').isNumeric();

              var errors = req.validationErrors();

            if(errors)
            return res.status(400).json({error:"price must be a number."});
			Arena.find({ price: search_value }, function (err, doc) {
				if (err)
					res.status(500).json({error: err.message});
				else {
					compute(req, res, doc);
				}
			});
		} else if (search_type == "location") {
			Arena.find({ location: search_value }, function (err, doc) {
				if (err)
					res.status(500).json({error: err.message});
				else {
					compute(req, res, doc);
				}
			});
		} else {
			Arena.find({ name: search_value }, function (err, doc) {
				if (err)
					res.status(500).json({error: err.message});
				else {
					compute(req, res, doc);
				}
			});
		}
	}
};

module.exports = visitorController;
