var mongoose = require('mongoose');

var schema = mongoose.Schema({
	schedule: {
		type: [[[mongoose.Schema.Types.Mixed]]],
		required: true
	},
	default_weekly_schedule:{
		type: [[mongoose.Schema.Types.Mixed]],
		required: true
	},
	rules_and_regulations: String,
	name: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	location: String,
	avg_rating: Number,
	size: Number,
	type: String,
	photos: [{data:Buffer}],
	price: {
		type: Number,
		required: true
	},
	comments: [String],
	ratings_count: Number
});



var Arena = mongoose.model('Arena', schema);

module.exports = Arena;