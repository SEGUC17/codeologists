var mongoose = require('mongoose');
var Player = require('./Player');
var Arena = require('./Arena');


var schema = mongoose.Schema({
	player : {
		type:mongoose.Schema.Types.ObjectId,
		ref:'Player',
		required: true
	},
	arena : {
		type:mongoose.Schema.Types.ObjectId,
		ref:'Arena',
		required: true
	},
	time_stamp: {
		type: Date,
		required: true
	},
	accepted : Boolean,
	player_rating: Number,
	arena_rating: Number
});



var Booking = mongoose.model('Booking',schema);

module.exports = Booking;