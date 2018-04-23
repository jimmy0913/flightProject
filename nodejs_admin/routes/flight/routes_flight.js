var httprequest = require('../../httprequest');
var request = httprequest.func();
var http = httprequest.http();



exports.index = function(req, res) {
    res.render("index",{
        nav:'index',
    });
}



exports.getData = function (req, res) {
    getDataFn(req, res, function (ret) {
        responseJSON(res, ret);
    });
};


exports.price = function(req,res){
    var json = req.params.price;

    res.render("price",{
        time:json,
        nav:'index',
    });
}


exports.airline = function(req,res){

    var json = req.params.time;
    console.log(json);

    res.render("airline",{
        time:json,
        nav:'index',
    });
}

exports.history = function(req,res){

    var json = req.params.history;
    console.log(json);

    res.render("history",{
        history:json,
        nav:'index',
    });
}

exports.line = function(req,res){

    var json = req.params.line;
    console.log(json);

    res.render("line",{
        markup:json,
        nav:'index',
    });
}



exports.kpi = function(req, res) {
    res.render("kpi",{
        nav:'kpi',
    });
}




var responseJSON = function(res, json) {
        res.writeHead(200, {
            "Content-Type": "application/json;charset=utf-8"
        });

        res.end(json);
};
 

//首页
var getDataFn = function(req, res, func) {
    request.commit(http, request.setHeader("GET", '/admin' + req.url), function(resdata) {
       func(resdata);
    });
};
