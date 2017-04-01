var mongoose = require('mongoose');
var RegisteredUser = require('./RegisteredUser');

var options = {discriminatorKey: 'type'};


var Player = RegisteredUser.discriminator('Player',
      new mongoose.Schema({
      	birthdate:{
      		type: Date,
      		required: true
      	},
      	notifications : [String],
      	avg_rating: {type:Number,default:0},
      	ratings_count: {type:Number,default:0}
      }));


module.exports = Player;