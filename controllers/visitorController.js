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
		Player.findOne({ username: req.body.username }, function (err, user) {
			if (user)
				res.status(400).json({ error: 'Username already used' });
			else {

				hasher(req.body.password).hash(function (error, hash) {
					if (error)
						res.status(400).json({ error: error.message });


					var player = new Player();
					player.name = req.body.name;
					player.username = req.body.username;
					if (!validateEmail(req.body.email)) {
						res.status(400).json({ error: "Email not in correct format" });
						return;
					}
					player.email = req.body.email;
					player.phone_number = req.body.phone_number;
					player.location = req.body.location;
					if (req.files[0])
						player.profile_pic.data = req.files[0].buffer;
					player.birthdate = req.body.birthdate;
					player.ratings_count = 0;

					// Store hash (incl. algorithm, iterations, and salt) 
					player.password = hash;

					if (!req.body.email || !req.body.name || !req.body.location || !req.body.phone_number || !req.body.username || !req.body.birthdate || !req.body.password) {
						res.status(400).json({ error: "Missing data" });
						return;
					}


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
		ServiceProvider.findOne({ username: req.body.username }, function (err, user) {
			if (user)
				res.status(400).json({ error: 'Username already used' });
			else {

				hasher(req.body.password).hash(function (error, hash) {
					if (error)
						res.status(400).json({ error: error.message });


					var service = new ServiceProvider();
					service.name = req.body.name;
					service.username = req.body.username;
					if (!validateEmail(req.body.email)) {
						res.status(400).json({ error: "Email not in correct format" });
						return;
					}
					service.email = req.body.email;
					service.phone_number = req.body.phone_number;
					service.location = req.body.location;
					if (req.files[0])
						service.profile_pic.data = req.files[0].buffer;
					service.mode = req.body.mode ? true : false;

					// Store hash (incl. algorithm, iterations, and salt) 
					service.password = hash;

					if (!req.body.email || !req.body.name || !req.body.location || !req.body.phone_number || !req.body.username || !req.body.mode || !req.body.password) {
						res.status(400).json({ error: "Missing data" });
						return;
					}

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

											if (req.user._id == blacklist[k]) {
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

		Arena.find({ name: req.params.arenaName }, function (err, result) {
			if (err) {
				res.status(404).json({ error: err });
				console.log("1");
			}
			else {
				if (result.length == 0)
					res.status(403).json({ error: "No Arenas Found in That Location." });
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

							res.status(200).json(result);
						else
							res.status(404).json({ error: "No Arenas" });
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
