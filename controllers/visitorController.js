let Arena = require('../models/Arena');

let visitorController = {
    
    view_all:function(req, res){

    	Arena.find({location:req.body.location}, function(err, result){
    		if(err)
    			res.send(err.message);
    		else
    			//When integrating we will change test page to the page we want to redirect to
    			res.render('test', {result});
    			//res.send(result);
    	})
    },

    view_details_of_arena:function(req, res){

    	Arena.find({name:req.body.name}, function(err, result){
    		if(err)
    			res.send(err.message);
    		else
    			//When integrating we will change test page to the page we want to redirect to
    			res.render('test', {result});
    			//res.send(result);
    	})
    }
}

module.exports = visitorController;