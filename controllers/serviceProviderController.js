var fs = require('fs');
var path = require('path');
var SP = require('../models/ServiceProvider');
let serviceProvider = {
  edit_profile_page: function(req,res) { // prepar the edit profile page
                                            //retrieve the players's record from DB to be able to fill the fields to be changed
           SP.findOne({username : req.session.username},function(err,result){
              if(err)
                res.send(err);
              else{
                res.render('edit_provider_page',{err,result});

              }
           })
  },
  edit_profie_info : function(req,res){ //accepting new info and update the DB record
              SP.findOne({username : req.session.username},function(err,result){
                  if(err)
                   res.send(err);
                  else{
                  if(!req.body.name){
                   res.render('edit_provider_page',{err :"name field is empty!...enter new name",result});
                    return;
                 }if(!req.body.email){
                    res.render('edit_provider_page',{err :"email field is empty!...enter new email",result});
                      return;
                  }if(!req.body.phone_number){
                     res.render('edit_provider_page',{err :"phone number field is empty!...enter new phone number",result});
                      return;
                   }if(!req.body.old_password){
                      res.render('edit_provider_page',{err :"your password is required to confirm changes",result});
                      return;
                    }if(result.password != req.body.old_password){
                        res.render('edit_provider_page',{err :"wrong password !",result});
                         return;
                    }result.name = req.body.name;
                    if(req.body.new_password)
                    result.password = req.body.new_password;
                    result.email = req.body.email;
                    result.phone_number = req.body.phone_number;
                    if(req.files[0]){
                      result.profile_pic.data = fs.readFileSync(req.files[0].path);
                      fs.unlinkSync(req.files[0].path);
                    }
                    if(req.body.mode == "on")
                    result.mode = true;
                    else
                    result.mode = false;
                    result.save();
                    res.render('edit_provider_page',{err :"information updated successfully",result});
                    }

                  });
  }



}

module.exports = serviceProvider;
