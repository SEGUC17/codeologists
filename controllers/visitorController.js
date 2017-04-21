var Arena = require('../models/Arena');
var Player = require('../models/Player');
var ServiceProvider = require('../models/ServiceProvider');
var hasher = require('password-hash-and-salt');

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function compute(req, res, result) {
	if (result.length == 0) {
		res.send("no Arena matches your value");
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

		res.send(result);
		return;
	}
}


let visitorController = {


	createPlayer: function (req, res) {
		if(req.body.password=='')
		{

			req.checkBody('name', 'Name is required.').notEmpty();
            req.checkBody('username', 'Username is required.').notEmpty();
            req.checkBody('password', 'Password is required.').notEmpty();
            req.checkBody('email', 'Email is required.').isEmail();
            req.checkBody('email', 'Email is required.').notEmpty();
            req.checkBody('location', 'Location is required.').notEmpty();
            req.checkBody('phone_number', 'Phone number is required.').notEmpty();
            req.checkBody('birthdate', 'Birthdate is required.').notEmpty();
            var errors = req.validationErrors();

           
            return res.status(400).json(errors);
            
		}
		Player.findOne({ username: req.body.username }, function (err, user) {
			if (user)
				return res.status(400).json([{param: 'username' ,msg:'Username already used'}]);
			else {

				hasher(req.body.password).hash(function (error, hash) {
					if (error)
						return res.status(500).json({ error: error.message });


					req.checkBody('name', 'Name is required.').notEmpty();
		            req.checkBody('username', 'Username is required.').notEmpty();
		            req.checkBody('password', 'Password is required.').notEmpty();
		            req.checkBody('email', 'Email is required.').notEmpty();
		            req.checkBody('email', 'Email not in correct format').isEmail();
		            req.checkBody('location', 'Location is required.').notEmpty();
		            req.checkBody('phone_number', 'Phone number is required.').notEmpty();
		            req.checkBody('birthdate', 'Birthdate is required.').notEmpty();
		            req.checkBody('birthdate', 'Birthdate no in correct format').isDate();

		            var errors = req.validationErrors();

		            if (errors) {
		                return res.status(400).json(errors);
		            }

					var player = new Player();
					player.name = req.body.name;
					player.username = req.body.username;
					player.email = req.body.email;
					player.phone_number = req.body.phone_number;
					player.location = req.body.location;

					

					if (req.body.profile_pic.charAt(0)!='/')
						player.profile_pic.data = req.body.profile_pic;
					player.birthdate = req.body.birthdate;
					player.ratings_count = 0;

					// Store hash (incl. algorithm, iterations, and salt) 
					player.password = hash;



					player.save(function (err, player) {
						if (err)
							res.status(500).json({ error: err });
						else {

							res.json({ success: "New player created" });
						}
					});


				});

			}
		});
	},

	createServiceProvider: function (req, res) {
		if(req.body.password=='')
		{

			req.checkBody('name', 'Name is required.').notEmpty();
            req.checkBody('username', 'Username is required.').notEmpty();
            req.checkBody('password', 'Password is required.').notEmpty();
            req.checkBody('email', 'Email is required.').isEmail();
            req.checkBody('email', 'Email is required.').notEmpty();
            req.checkBody('location', 'Location is required.').notEmpty();
            req.checkBody('phone_number', 'Phone number is required.').notEmpty();
            req.checkBody('mode', 'Mode is required.').notEmpty();
            var errors = req.validationErrors();

            return res.status(400).json(errors);
            
		}
		ServiceProvider.findOne({ username: req.body.username }, function (err, user) {
			if (user)
				res.status(400).json({ error: 'Username already used' });
			else {

				hasher(req.body.password).hash(function (error, hash) {
					if (error)
						res.status(400).json({ error: error.message });



					req.checkBody('name', 'Name is required.').notEmpty();
		            req.checkBody('username', 'Username is required.').notEmpty();
		            req.checkBody('password', 'Password is required.').notEmpty();
		            req.checkBody('email', 'Email is required.').notEmpty();
		            req.checkBody('email', 'Email not in correct format').isEmail();
		            req.checkBody('location', 'Location is required.').notEmpty();
		            req.checkBody('phone_number', 'Phone number is required.').notEmpty();
		            req.checkBody('mode', 'Mode is required.').notEmpty();
		       
		            var errors = req.validationErrors();

		            if (errors) {
		                return res.status(400).json(errors);
		            }


					var service = new ServiceProvider();
					service.name = req.body.name;
					service.username = req.body.username;
					
					service.email = req.body.email;
					service.phone_number = req.body.phone_number;
					service.location = req.body.location;



					if (req.body.profile_pic.charAt(0)!='/')
						service.profile_pic.data = req.body.profile_pic;
					service.mode = req.body.mode ? true : false;

					// Store hash (incl. algorithm, iterations, and salt) 
					service.password = hash;

					

					service.save(function (err, service) {
						if (err)
							res.status(500).json({ error: err });
						else {

							res.json({ success: "New service provider created" });
						}
					});


				});
			}
		});
	},

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

	view_details_of_arena: function (req, res) {

		var blacklisted = 0;

		Arena.find({ name: req.body.name }, function (err, result) {
			if (err)
				res.json({ error: err });
			else {
				if (result.length == 0)
					res.json({ error: "No Arenas Found in That Location." });
				else {
					var id = require('mongodb').ObjectID(result[0].service_provider);
					ServiceProvider.findById(id, function (err, service) {
						var blacklist = service.blacklist;


						for (var i = 0; i < blacklist.length; i++) {

							if (req.user._id == blacklist[i]) {
								blacklisted = 1;
							}
						}

						if (blacklisted == 0)
							res.json(result);
						else
							res.json({ error: "No Arenas" });
					})

				}


			}
		})
	},

	filter: function (req, res) {
		var search_type = req.body.search_type;
		var search_value = req.body.search_value;
		if (search_type == "price") {
			Arena.find({ price: search_value }, function (err, doc) {
				if (err)
					res.send(err);
				else {
					compute(req, res, doc);
				}
			});
		} else if (search_type == "location") {
			Arena.find({ location: search_value }, function (err, doc) {
				if (err)
					res.send(err);
				else {
					compute(req, res, doc);
				}
			});
		} else {
			Arena.find({ name: search_value }, function (err, doc) {
				if (err)
					res.send(err);
				else {
					compute(req, res, doc);
				}
			});
		}
	}
};

module.exports = visitorController;
