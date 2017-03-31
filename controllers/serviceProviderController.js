var arenaModel = require("../models/Arena");

let serviceProviderController ={
	setUnavailable: function(req,res){
     var startIndex = req.body.startIndex;
     var endIndex   = req.body.endIndex;
     var day = req.body.day;
     var month = req.body.month;
     var Indices = getScheduleIndices(month,day);
     var weekIndex = Indices.weekIndex;
     var dayIndex = Indices.dayIndex;
     var flag = 0;

     arenaModel.findById(req.paramas.arena_id,function(err,arena){
     	var schedule = arena.schedule;
     	var before_edit=[];
     	for (var i = 0; i < 48; i++) {
     		before_edit[i] = schedule[weekIndex][dayIndex][i];
     	};
     	for (var i = startIndex; i <= endIndex ; i++) {
     		if(schedule[weekIndex][dayIndex][i]== 0 ||schedule[weekIndex][dayIndex][i]== -1)
     	         schedule[weekIndex][dayIndex][i] = -1;
     	    else{
     	    	flag =  1;
                break;
     	    }

     	};
     	if(flag){
            for (var i = 0; i < 48; i++) {
     		      schedule[weekIndex][dayIndex][i] = before_edit[i] ;
     	};
     	res.send("error, You can not set booked slots to be unavailable");  
     	}
     	else{
     		arena.schedule = schedule;
     		arena.save(function(err){
     			if(err){
     				res.send("error in arena DB");
     			}
     		});
     	    res.redirect("/sp/arena/"+req.paramas.arena_id);
     	}

     });
	},


	setAvailable: function(req,res){
     var startIndex = req.body.startIndex;
     var endIndex   = req.body.endIndex;
     var day = req.body.day;
     var month = req.body.month;
     var Indices = getScheduleIndices(month,day);
     var weekIndex = Indices.weekIndex;
     var dayIndex = Indices.dayIndex;

     arenaModel.findById(req.paramas.arena_id,function(err,arena){
     	var schedule = arena.schedule;
     	for (var i = startIndex; i <= endIndex ; i++) {
     	schedule[weekIndex][dayIndex][i] = 0;	
     	};
     
     arena.schedule = schedule;
     		arena.save(function(err){
     			if(err){
     				res.send("error in arena DB");
     			}
     		});
     	    res.redirect("/sp/arena/"+req.paramas.arena_id);
     });
	}

}  
module.exports = serviceProviderController;