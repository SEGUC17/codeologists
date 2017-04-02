 var mongoose = require('mongoose');

 var options = {discriminatorKey: 'type'};

 var schema = mongoose.Schema({
 	name : {
 		type:String,
 		required: true
 	},
 	username : {
 		type: String,
 		required: true,
 		unique: true
 	},
 	password : {
 		type: String,
 		required: true
 	},
 	email : {
 		type: String,
 		required: true
 	},
 	phone_number : {
 		type: String,
 		required: true
 	},
 	location : {
 		type: String,
 		required: true
 	},
 	profile_pic : {
 		data:Buffer
 	}
 },options);

 var RegisteredUser = mongoose.model('RegisteredUser',schema);




 module.exports = RegisteredUser;
