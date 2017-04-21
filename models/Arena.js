var mongoose = require('mongoose');
var ServiceProvider = require('./ServiceProvider');
//The schedule is represented as an array of weeks
//each of week is and array of days and each day is an array of half hours (i.e: 48 elements each represents a distinct half hour for example the fifth element reprents the half our form 2:30 AM to 3:00 AM)
//note that if a certain half hour is free it will contain the value ZERO if it is unavailable due to maintance or some other reason it will be Negative one otherwise if it is booked it will conatin the ID of the booking !
//If you do not understand please ask any member of the team responsible namely (Omar,Abdel-ghafar,Hatem,Mina,Abdel-zaher,Eladdad,Elmenebawy)
var schema = mongoose.Schema({
	service_provider: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ServiceProvider',
		required: true
	},
	schedule: {
		type: [[[mongoose.Schema.Types.Mixed]]],
		required: true
	},
	default_weekly_schedule: {
		type: [[mongoose.Schema.Types.Mixed]],
		required: true
	},
	rules_and_regulations: String,
	name: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	address: {
		type: String,
		required: true
	},
	location: String,
	avg_rating: Number,
	size: Number,
	type: String,
	photos: [{ data: Buffer }],
	price: {
		type: Number,
		required: true
	},
	comments: [{ Content: String, time_stamp: Date, player: String }],
	ratings_count: Number
});


var Arena = mongoose.model('Arena', schema);

module.exports = Arena;
