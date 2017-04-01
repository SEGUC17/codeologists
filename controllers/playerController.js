let Game = require('../models/Game');

let playerController = {
    
    viewgames:function(req, res){
        
        Game.find(function(err, games){
            
            if(err)
                res.send(err.message);
            else
                res.render('index', {games});
        })
    }
    ,requestgame:function(req,res,nxt){

	var NewReq={playerUsername:req.user.Username,comment:req.body.comment,accepted:false};
		var id =req.params;

	Game.findOne({_id : id},function(err,user){
        if(err){
            return nxt(err);
        }else{
            Game.requests.push(NewReq);
            Game.save(nxt);
            res.redirect('/Games');
        }
    	});
		}
		,acceptrequest:function(req,res,nxt){
		var id =req.params;
		var playerUsername=req.body.playerUsername;
		var currentuser=req.user.username;
		Game.findOne({_id : id},function(err,user){
        if(err){
            return nxt(err);
        }else{
           var arrayLength=Game.requests.length;
            for (var i = 0; i < arrayLength; i++) {
            	var n = Game.requests[i].playerUsername.localeCompare(playerUsername);
            	if(n== 0){

            		Game.requests[i].accept=true;
            		Game.save(nxt);

            		Player.findOne({username:playerUsername},function(err,user){
            			if(err){
            				return nxt
            			}else{
            			Player.notifications.push(currentuser.concat('has accepted your request'));
            			Player.save(nxt);
            			res.redirect('/Game');

            			}
            		});

            			}
				}         
        }
    	});
		}
		,rejectrequest:function(req,res,nxt){
		var id =req.params;
		var playerUsername=req.body.playerUsername;
		var currentuser=req.user.username;
		Game.findOne({_id : id},function(err,user){
        if(err){
            return nxt(err);
        }else{
        	function check(request) {
        		var n = request.playerUsername.localeCompare(playerUsername);
  				  return n !=0;			
			}
            		Game.requests.filter(check);
					Game.save(nxt);
					Player.findOne({username:playerUsername},function(err,user){
            			if(err){
            				return nxt
            			}else{
            			Player.notifications.push(currentuser.concat(' has rejected your request'));
            			Player.save(nxt);
            			res.redirect('/Game');

            			}
            		});


            		}   
        }
    	});
		}
}

module.exports = playerController;