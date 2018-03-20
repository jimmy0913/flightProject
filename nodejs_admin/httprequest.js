var http = null, 
fs = require('fs');


exports.http=function(){
	if(http){
		return http;
	}
	return http=require('http');
}

var fun = function(){
	var config = null,hostname = null ,port = null,
	getData = function(req,func){
		var postData = "";
		req.setEncoding("utf-8");
		req.addListener("data", function (postDataChunk) {
			postData += postDataChunk;
		});
		req.addListener("end", function () {
			func && func(postData);
		});
	},
	setHeader = function(type,url,headers,port){
		config  = prop("config_flight.properties");
		if(port){
			config.port = port;
		}
		return headerCore(type,url,headers);
	},
	




	headerCore= function(type,url,headers){
		hostname = config.host;
		port = config.port || 80;

		return {
			hostname: hostname,
			port:port,
			path: url,
			method: type,
			headers: headers || { 'Content-Type':'application/json;charset=UTF-8'}
		}
	},
	commit = function(http,options,func,params){

		var req = http.request(options, function (res) {
			res.setEncoding('utf-8');
			var resdata  = "" ;
			res.on('data', function (ret) {
				resdata+=ret;
			});
			res.on('end', function () {
				func && func(resdata);
			});
		});
		req.on('error', function (e) {
			func && func(setJSON());
		});
		params && req.write(params); 
		req.end();

	},setJSON = function (code,msg){
		var res = {  
			"status": 
			{
				"code": code || "500", 
				"message": msg || "服务器错误"
			} 
		}; 
		return JSON.stringify(res);
	};
	return {
		getData:function(){
			getData(arguments[0],arguments[1]);
		},
		setHeader:function(){
			return setHeader(arguments[0],arguments[1],arguments[2]);
		},
		
		commit:function(){
			commit(arguments[0],arguments[1],arguments[2],arguments[3]);
		},
		setJSON:function(){
			return setJSON(arguments[0],arguments[1]);
		}
	}
}()
,
prop = function(uri, encod){
	var encoding = encod==null?'UTF-8':encod;  
	try {
		var content = fs.readFileSync(uri, encoding);
		var regexjing = /\s*(#+)/;  
		var regexkong = /\s*=\s*/;  
		var keyvalue = {};  
		var arr_case = null;
		var regexline = /.+/g;  
		while(arr_case=regexline.exec(content)) {  
			if (!regexjing.test(arr_case)) {  
				keyvalue[arr_case.toString().split(regexkong)[0]] = arr_case.toString().split(regexkong)[1];  
			}
		}
	} catch (e) {
		return {};
	}
	return keyvalue;
}
;

exports.func=function(){
	return fun;
}

