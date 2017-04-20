var Arena = require('../models/Arena');
function compute(req, res, result) {
	if (result.length == 0) {
		res.status(404)json({erro:"no Arena matches your value"});
		return;
	} else {
		var tmp = 0;
		if (!req.body.index)  // in case the page diplayed for the first time not as a result of selecting page index; index will not exit in the body
			tmp = 1;                                                                                                     // so we set it to one
		else
			tmp = req.body.index;
		var count = Math.ceil(result.length / 10);
		var start = (tmp - 1) * 10;
		var end = tmp == count ? result.length : tmp * 10;
		var active = tmp;  //to indicate the active page rightnow

		res.json({result,count,start,end,active});
		return;
	}
}


let visitorController = {
	filter: function (req, res) {
		var search_type = req.body.search_type;
		var search_value = req.body.search_value;
		if (search_type == "price") {
			Arena.find({ price: search_value }, function (err, doc) {
				if (err)
					res.status(500).json({error: err.message});
				else {
					compute(req, res, doc);
				}
			});
		} else if (search_type == "location") {
			Arena.find({ location: search_value }, function (err, doc) {
				if (err)
					res.status(500).json({error: err.message});
				else {
					compute(req, res, doc);
				}
			});
		} else {
			Arena.find({ name: search_value }, function (err, doc) {
				if (err)
					res.status(500).json({error: err.message});
				else {
					compute(req, res, doc);
				}
			});
		}
	}
};

module.exports = visitorController;
