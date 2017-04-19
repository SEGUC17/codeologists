var mongoose = require('mongoose');
var Player = require('./Player');
var Arena = require('./Arena');

var schema = mongoose.Schema({
	creator: {
		type: String,
		required: true
	},
	size: { type: Number, default: 5 },
	location: {
		type: String,
		required: true
	},
	start_date: { type: Date, required: true },
	end_date: { type: Date, required: true },
	requests: [{ playerUsername: { type: String, required: true }, comment: String, accepted: { type: Boolean, required: true } }]

});


var Game = mongoose.model('Game', schema);


module.exports = Game;