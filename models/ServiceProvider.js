var mongoose = require('mongoose');
var RegisteredUser = require('./RegisteredUser');
var Player = require('./Player');


var ServiceProvider = RegisteredUser.discriminator('ServiceProvider',
      new mongoose.Schema({
      	mode:{
      		type:Boolean,
      		required: true
      	},
      	blacklist:[{ type : mongoose.Schema.Types.ObjectId, ref:'Player'}],
      	whitelist:[{ type : mongoose.Schema.Types.ObjectId, ref:'Player'}]
      }));


module.exports = ServiceProvider;