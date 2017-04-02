var Player = require('../models/Player');
var ServiceProvider = require('../models/ServiceProvider');
var hasher = require('password-hash-and-salt');


var visitorController = {

	createPlayer:function(req,res) {
		Player.findOne({username: req.body.username},function(err,user){
			if(user)
				res.render('newPlayer',{error:'Username already used'});
			else
			{
				
				



				hasher(req.body.password).hash(function(error, hash) {
				    if(error)
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


				    player.save(function (err,player) {
				    	if(err)
				    		res.send(err);
				    	else
				    	{
				    		//console.log(player);
				    		res.redirect('/');
				    	}
				    });
				 
				    
				});






			}
		});
	},





	createServiceProvider:function(req,res) {
		ServiceProvider.findOne({username: req.body.username},function(err,user){
			if(user)
				res.render('newServiceProvider',{error:'Username already used'});
			else
			{
				
				



				hasher(req.body.password).hash(function(error, hash) {
				    if(error)
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


				    service.save(function (err,service) {
				    	if(err)
				    		res.send(err);
				    	else
				    	{
				    		//console.log(service);
				    		res.redirect('/');
				    	}
				    });
				 
				    
				});






			}
		});
	}









};



module.exports = visitorController;