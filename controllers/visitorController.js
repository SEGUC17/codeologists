var Arena = require('../models/Arena');
var Player = require('../models/Player');
var ServiceProvider = require('../models/ServiceProvider');
var hasher = require('password-hash-and-salt');

function compute(req, res, result) {
	if (result.length == 0) {
		res.render('search', { err: "no Arena matches your value" });
		return;
	}
	var tmp = 0;
	if (!req.body.index)  // in case the page diplayed for the first time not as a result of selecting page index; index will not exit in the body
		tmp = 1;                                                                                                     // so we set it to one
	else
		tmp = req.body.index;
	var count = Math.ceil(result.length / 10);
	var start = (tmp - 1) * 10;
	var end = tmp == count ? result.length : tmp * 10;
	var active = tmp;  //to indicate the active page rightnow

	res.render('search', { err: "", result, start, end, count, active });
	return;
}


let visitorController = {

	createPlayer: function (req, res) {
		Player.findOne({ username: req.body.username }, function (err, user) {
			if (user)
				res.render('newPlayer', { error: 'Username already used' });
			else {

				hasher(req.body.password).hash(function (error, hash) {
					if (error)
						throw new Error(error.message);


					var player = new Player();
					player.name = req.body.name;
					player.username = req.body.username;
					player.email = req.body.email;
					player.phone_number = req.body.phone_number;
					player.location = req.body.location;
					player.profile_pic.data = req.files[0].buffer;
					player.birthdate = req.body.birthdate;
					player.ratings_count = 0;

					// Store hash (incl. algorithm, iterations, and salt) 
					player.password = hash;


					player.save(function (err, player) {
						if (err)
							res.send(err);
						else {
							//console.log(player);
							res.redirect('/');
						}
					});


				});

			}
		});
	},

	createServiceProvider: function (req, res) {
		ServiceProvider.findOne({ username: req.body.username }, function (err, user) {
			if (user)
				res.render('newServiceProvider', { error: 'Username already used' });
			else {

				hasher(req.body.password).hash(function (error, hash) {
					if (error)
						throw new Error(error.message);


					var service = new ServiceProvider();
					service.name = req.body.name;
					service.username = req.body.username;
					service.email = req.body.email;
					service.phone_number = req.body.phone_number;
					service.location = req.body.location;
					service.profile_pic.data = req.files[0].buffer;
					service.mode = req.body.mode;

					// Store hash (incl. algorithm, iterations, and salt) 
					service.password = hash;


					service.save(function (err, service) {
						if (err)
							res.send(err);
						else {
							//console.log(service);
							res.redirect('/');
						}
					});


				});
			}
		});
	},

	view_all: function (req, res) {

		Arena.find({ location: req.body.location }, function (err, result) {
			if (err)
				res.send(err.message);
			else
				//When integrating we will change test page to the page we want to redirect to
				res.render('test', { result });
			//res.send(result);
		})
	},
	view_details_of_arena: function (req, res) {

		Arena.find({ name: req.body.name }, function (err, result) {
			if (err)
				res.send(err.message);
			else
				//When integrating we will change test page to the page we want to redirect to
				res.render('test', { result });
			//res.send(result);
		});
	},
	filter: function (req, res) {
		var search_type = req.body.search_type;
		var search_value = req.body.search_value;
		if (search_type == "price") {
			Arena.find({ price: search_value }, function (err, result) {
				if (err)
					res.send(err);
				else {
					compute(req, res, result);
				}
			});
		} else if (search_type == "location") {
			Arena.find({ location: search_value }, function (err, doc) {
				if (err)
					res.send(err);
				else {
					compute(req, res, result);
				}
			});
		} else {
			Arena.find({ name: search_value }, function (err, doc) {
				if (err)
					res.send(err);
				else {
					compute(req, res, result);
				}
			});
		}
	}
};

module.exports = visitorController;
