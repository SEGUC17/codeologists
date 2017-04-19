var express = require("express");
var stripe = require("stripe")("sk_test_Ny38x1Z7YQaYzmFq0YwMPP2w");
var bodyParser = require("body-parser");

var app = express();

app.set('view engine', 'ejs');
app.set('views',__dirname+'/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',function(req,res){
res.render('index');
});


app.get('/paysuccess',function(req,res){
res.render('paysuccess');
});

app.post('/charge',function(req,res){
var token = req.body.stripeToken;
var chargeAmount = req.body.chargeAmount;
var charge = stripe.charges.create({
	amount : chargeAmount,
	currency : "usd",
	source:token,
},function(err,charge){
	if(err){
		console.log(StripeCardError);
	}
	if(err && err.type ==="StripeCardError"){
		console.log("Your cad was declined");
	}

});
res.redirect("/paysuccess");
console.log("Your payment was successful");
});

app.listen(3000,function(){
	console.log("Stripe is running");
});