let Game = require('../models/Game');

let playerController = {
    
    viewgames:function(req, res){
        
        Game.find(function(err, games){ 
            if(err)
                res.send(err.message);
            else
                res.render('games', {games : games});
        });
    }
}

module.exports = playerController;