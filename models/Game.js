var mongoose = require('mongoose');
var Player = require('./Player');
var Arena = require('./Arena');

var schema = mongoose.Schema({
	creator: {
		type:mongoose.Schema.Types.ObjectId,
		ref:'Player',
		required: true
	},
	size: {type: Number,default:5},
	location: {
		type: String,
		required: true
	},
	suggested_arenas: [{type:mongoose.Schema.Types.ObjectId,ref:'Arena'}],
	start_date: {type:Date,required:true},
	end_date: {type:Date,required:true},
	requests:[{playerId:{type:mongoose.Schema.Types.ObjectId,ref:'Player'},comment:String}]

});


var Game = mongoose.model('Game',schema);


module.exports = Game;