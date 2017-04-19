var mongoose = require('mongoose');
var RegisteredUser = require('./RegisteredUser');

var options = { discriminatorKey: 'type' };


var Player = RegisteredUser.discriminator('Player',
	new mongoose.Schema({
		birthdate: {
			type: Date,
			required: true
		},
		notifications: [String],
		avg_rating: Number,
		ratings_count: Number
	}));


module.exports = Player;