var mongoose = require('mongoose');
var Player = require('./Player');
var Arena = require('./Arena');

var schema = mongoose.Schema({
	creator: {
		type: Player,   //phone
		required: true
	},
	size: number,
	location: {
		type: String,
		required: true
	},
	suggested_arenas: [Arena],
	start_date: date,
	end_date: date

});


var Game = mongoose.model('Game',schema);


module.exports = Game;