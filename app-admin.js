var flight = require('./nodejs_admin/project/flight');
var http = require('./nodejs_admin/httprequest').http();
var express = require('express');
var ejs = require('ejs');

var app = express();


app.set('port', 80);
app.set('views', __dirname + '/src' );
app.set('view engine', 'ejs');
app.set('view cache', false);


app.use(express.static('src'));


http.createServer(app).listen(app.get('port'), function () {});



flight.start(app);














