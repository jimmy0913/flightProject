var flight = require('./nodejs_admin/project/flight');
var http = require('./nodejs_admin/httprequest').http();
var express = require('express');
var ejs = require('ejs');

var app = express();


app.set('port', 80);
app.set('views', __dirname + '/src/views' );
app.set('view engine', 'ejs');
app.set('view cache', false);


// app.use(express.static('src'));
app.use(express.static(__dirname));


http.createServer(app).listen(app.get('port'), function () {
	console.log('running server');
});



function home(req,res,next){
	/*if(req.host && req.host.indexOf("pay.maxfun.co")!=-1){
		if(req.url.indexOf("/window.html")!=-1){
			res.redirect('/project/haoke/window.html#/login');
		}else {
			res.redirect('/project/haoke/haoke.html#/login');
		}
	}else {
		res.redirect('/project/youshu/admin.html#/login');
	}*/

	res.redirect('/flight');
}

flight.start(app);

app.get('*',home);














