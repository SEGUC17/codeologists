var mongoose = require('mongoose');
var Player = require('./Player');
var Arena = require('./Arena');

var schema = mongoose.Schema({
	creator: {
		type:mongoose.Schema.Types.ObjectId,
		ref:'Player',
		required: true
	},
	size: Number,
	location: {
		type: String,
		required: true
	},
	suggested_arenas: [{type:mongoose.Schema.Types.ObjectId,ref:'Arena'}],
	start_date: Date,
	end_date: Date

});


var Game = mongoose.model('Game',schema);


module.exports = Game;