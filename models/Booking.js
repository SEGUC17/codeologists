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
	start_index:{type:Number,required:true},
	end_index:{type:Number,required:true},
	bookDay:{type:Number,required:true},
	bookMonth:{type:Number,required:true},
	accepted : {type:Boolean,required:true},
	player_rating: {type:Number,default:0},
	arena_rating: {type:Number,default:0}
});



var Booking = mongoose.model('Booking',schema);

module.exports = Booking;