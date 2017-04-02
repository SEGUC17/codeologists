var multer=require('multer');
var fs=require('fs');
var path=require('path');

let Arena = require('../models/Arena');

var storage=multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'public/image/');
    },
    filename : function(req,res,cb){
        cb(null,"_"+Date.now());
    }
});

let serviceProviderController = {
    
    editarena:function(req, res){
        var arenaname=req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena) {
        if (err) { res.redirect('/'); } //handle error
        if (!arena) { res.redirect('/'); } //handle error
        if(req.user && arena.service_provider!=req.user._id){ res.redirect('/'); } //handle error
        res.render('editarena', { arena: arena });
    });
    },
    editarenainfo:function(req, res){
         var arenaname=req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena){
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
           if(req.user && arena.service_provider!=req.user._id){ res.redirect('/'); } //handle error
            arena.rules_and_regulations=req.body.rules_and_regulations;
    	    arena.address=req.body.address;
    	    arena.location=req.body.location;
    	    arena.size=req.body.size;
    	    arena.type=req.body.type;
    	    arena.price=req.body.price;
    		arena.save(function(err){
                if(err){
                    res.redirect('/'); //handle error
                   // nxt(err);
                   // return;
                }
                res.redirect('/arenas/'+arena.name);
            });
        });
    },
    editdefaultschedule:function(req,res){
        var arenaname=req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena){
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if(req.user && arena.service_provider!=req.user._id){ res.redirect('/'); } //handle error
            for(var i=0;i<7;i++){
                for(var j=0;j<48;j++){
                    arena.default_weekly_schedule[i][j]=req.body.schedule[i][j].checked? -1 : 0; //may be changed
                }
            }
        });
    },
    addimage:function(req,res,nxt){
        var img_path=req.files[0].path;
        var newimage={data : fs.readFileSync(img_path)};
        var arenaname=req.params.arenaname;
        Arena.findOne({ name: arenaname }, function(err, arena){
            if (err) { res.redirect('/'); } //handle error
            if (!arena) { res.redirect('/'); } //handle error
            if(req.user && arena.service_provider!=req.user._id){ res.redirect('/'); } //handle error
           arena.photos.push(newimage);
           arena.save(nxt);
        });
    }
}

module.exports = serviceProviderController;