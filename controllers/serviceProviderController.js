let serviceProvider = require('./ServiceProvider');
let game = require('./Game');


let serviceProviderController =
{
	turnAutoAcceptModeOn:function(req,res)
	{
		//get the data from session??
		var username = 'Mina';
		serviceProvider.findOne({username : username} , function(err , user){
			if(!err)
			{
				user.mode = true;
			}
		});
	},

	turnAutoAcceptModeOff:function(req,res)
	{
		//get the data from session??
		var username = 'Mina';
		serviceProvider.findOne({username : username} , function(err , user){
			if(!err)
			{
				user.mode = false;
			}
		});
	},
	
	
	


}