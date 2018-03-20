var fs = require('fs'),
moment = require('moment'),
httprequest= require('./httprequest'),
request = httprequest.func(),
http = httprequest.http(),
ua;



var fun = function(){
	var isEmpty = function(str){
		if(str==undefined || str==null || str.length==0)
			return true;

		return false;
	},getParam =function(url,name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		if(url.split("?").length>1){
			url = url.split("?")[1];
			var r = url.match(reg);
			if (r!=null) return unescape(r[2]); return null;
		}
		return null;
	},getClientIp=function(req){
		return req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
	},deEight = function(txt) {//解密
		if(txt && txt.split ){
			var monyer = new Array();var i;
			var s=txt.split("\\");
			for(i=1;i<s.length;i++)
				monyer+=String.fromCharCode(parseInt(s[i],8));
			return monyer;
		}else{
			return "";
		}
	},enEight =function(txt) {//加密
		var monyer = new Array();
		var i, s;
		for (i = 0; i < txt.length; i++)
			monyer += "\\" + txt.charCodeAt(i).toString(8);
		return monyer;
	},decToHex = function(str) {
		var res=[];
		for(var i=0;i < str.length;i++)
			res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
		return "\\u"+res.join("\\u");
	},hexToDec = function(str) {
		str=str.replace(/\\/g,"%");
		return unescape(str);
	},decrypt =function(str, pwd) {
		if(str == null || str.length < 8) {
			return;
		}
		if(pwd == null || pwd.length <= 0) {
			return;
		}
		var prand = "";
		for(var i=0; i<pwd.length; i++) {
			prand += pwd.charCodeAt(i).toString();
		}
		var sPos = Math.floor(prand.length / 5);
		var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
		var incr = Math.round(pwd.length / 2);
		var modu = Math.pow(2, 31) - 1;
		var salt = parseInt(str.substring(str.length - 8, str.length), 16);
		str = str.substring(0, str.length - 8);
		prand += salt;
		while(prand.length > 10) {
			prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
		}
		prand = (mult * prand + incr) % modu;
		var enc_chr = "";
		var enc_str = "";
		for(var i=0; i<str.length; i+=2) {
			enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
			enc_str += String.fromCharCode(enc_chr);
			prand = (mult * prand + incr) % modu;
		}
		return enc_str;
	},encrypt =function(str, pwd) {
		if(pwd == null || pwd.length <= 0) {
			return null;
		}
		var prand = "";
		for(var i=0; i<pwd.length; i++) {
			prand += pwd.charCodeAt(i).toString();
		}
		var sPos = Math.floor(prand.length / 5);
		var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
		var incr = Math.ceil(pwd.length / 2);
		var modu = Math.pow(2, 31) - 1;
		if(mult < 2) {
			return null;
		}
		var salt = Math.round(Math.random() * 1000000000) % 100000000;
		prand += salt;
		while(prand.length > 10) {
			prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
		}
		prand = (mult * prand + incr) % modu;
		var enc_chr = "";
		var enc_str = "";
		for(var i=0; i<str.length; i++) {
			enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
			if(enc_chr < 16) {
				enc_str += "0" + enc_chr.toString(16);
			} else enc_str += enc_chr.toString(16);
			prand = (mult * prand + incr) % modu;
		}
		salt = salt.toString(16);
		while(salt.length < 8)salt = "0" + salt;
		enc_str += salt;
		return enc_str;
	},prop = function(uri, encod){
		var encoding = encod==null?'UTF-8':encod;  //定义编码类型
		try {
			var content = fs.readFileSync(uri, encoding);
			var regexjing = /\s*(#+)/;  //去除注释行的正则
			var regexkong = /\s*=\s*/;  //去除=号前后的空格的正则
			var keyvalue = {};  //存储键值对

			var arr_case = null;
			var regexline = /.+/g;  //匹配换行符以外的所有字符的正则
			while(arr_case=regexline.exec(content)) {  //过滤掉空行
				if (!regexjing.test(arr_case)) {  //去除注释行
					keyvalue[arr_case.toString().split(regexkong)[0]] = arr_case.toString().split(regexkong)[1];  //存储键值对
				}
			}
		} catch (e) {
			return {};
		}
		return keyvalue;
	},setCookie=function(res,keyvalue,time){
		var keyvalues =[];
		for(var i=0;i<keyvalue.length;i++){
			keyvalues.push(keyvalue[i][0]+"="+(keyvalue[i][1]?encrypt(keyvalue[i][1],"maxfun"):"")+"; expires="+time.toGMTString())
		}
		res.setHaokeHeader("Set-Cookie",keyvalues);  
	},getCookie=function(req,key){
		var cookie =req.headers['cookie'];
		if(cookie){
			var reg =  new RegExp("(^| )" + key + "=([^;]*)(;|$)")
			arr = cookie.match(reg);
			if(arr && !isEmpty(arr[2])){
				return decrypt(arr[2],"maxfun");
			}
		}
		return null;
	},getCookie2=function(req,key){
		var cookie =req.headers['cookie'];
		if(cookie){
			var reg =  new RegExp("(^| )" + key + "=([^;]*)(;|$)")
			arr = cookie.match(reg);
			if(arr && !isEmpty(arr[2])){
				return arr[2];
			}
		}
		return null;
	},getMaxAge = function(){

		return 1000*60*60*24*1;
	},
	responseJSON = function(res, json) {
		res.writeHead(200, {
			"Content-Type": "application/json;charset=utf-8"
		});
		res.end(json);
	}


	;
	return {
		isEmpty:function(str){
			return isEmpty(str);
		},getParam:function(url,name){
			return getParam(url,name);
		},getClientIp:function(req){
			return getClientIp(req);
		},deEight:function(req){
			return deEight(req);
		},enEight:function(req){
			return enEight(req);
		},decToHex:function(req){
			return decToHex(req);
		},hexToDec:function(req){
			return hexToDec(req);
		},decrypt:function(s1,s2){
			return decrypt(s1,s2);
		},encrypt:function(s1,s2){
			return encrypt(s1,s2);
		},prop:function(uri, encoding){
			return prop(uri, encoding);
		},setCookie:function(res,keyvalue,time){
			setCookie(res,keyvalue,time)
		},getCookie:function(req,key){
			return getCookie(req,key);
		},getCookie2:function(req,key){
			return getCookie2(req,key);
		},getMaxAge :function(){
			return getMaxAge();
		},checkBrowser:function(req, res, func) {		
			func();
			return ;
			ua = req.headers["user-agent"].toLowerCase();
			if (ua.match(/MicroMessenger/i) != 'micromessenger') {
				res.render("info", {
					msg: "请在微信浏览器中打开！",
				}, function(xlr, html) {res.send(html);});
			} else {
				func();
			}
		},saveSession :function(TAG,session_id,req,res, session){

			res.cookie(TAG, session_id, { maxAge: getMaxAge(), path: '/', httpOnly: false});
			if (session != null) {
				var params = {
					client_id: session_id,
					session_info: JSON.stringify(session)
				}
				
				var url = "/maxfunpay/services/express/client_info";
				var options = request.setHaokeHeader("POST", url);
				request.commit(http, options, function(resdata) {
				}, JSON.stringify(params));
				
			}
		},
		checkSession: function(TAG,session,req, res, func,is_pc) {

			if (session) {
				func(session,false);
			} else {
				var session_id = getCookie2(req, TAG);
				if(isEmpty(session_id)){
					session_id  = getParam(req.url,"session_id");
				}
				if (!isEmpty(session_id)) {
					var url = "/maxfunpay/services/express/client_info?client_id=" + session_id;
					var options = request.setHaokeHeader("GET", url);
					request.commit(http, options, function(resdata) {
						try {
							var json = JSON.parse(resdata);
							if (json.status.code == 200 && json.result != null && json.result.session_info != null) {
								var p = JSON.parse(json.result.session_info);
								p.now =new Date().getTime();
								func(p,true);
							}else {
								if(is_pc){
									responseJSON(res, request.setJSON("1000", "未登录"));
								}else{
									res.render("info", {
										msg: "请从公众号菜单进入！",
									}, function(xlr, html) {res.send(html);});
								}
							}
						} catch (e) {
							if(is_pc){
								responseJSON(res, request.setJSON("1000", "未登录"));
							}else{
								res.render("info", {
									msg: "请从公众号菜单进入！",
								}, function(xlr, html) {res.send(html);});
							}
						}
					});
				}else {
					if(is_pc){
						responseJSON(res, request.setJSON("1000", "未登录"));
					}else{
						res.render("info", {
							msg: "请从公众号菜单进入！",
						}, function(xlr, html) {res.send(html);});
					}
				}
				
			}
		}


	}
}();

exports.func=function(){
	return fun;
}


exports.base_func = function(app){


	app.locals.dateformat = function(date,format){
		if(format==null)
			format = "YYYY-MM-DD HH:mm:ss";
		return moment(date).format(format);
	};


	app.locals.week = function(date){
		return "星期"+(["天","一","二","三","四","五","六"][moment(date).format("d")]);
	};


	app.locals.stringify = function(str){
		return JSON.stringify(str);
	};

	app.locals.parse = function(str){
		return JSON.parse(str);
	};


	app.locals.replacestr = function(str,len,s){
		if(str && str.length>len*2){
			var _str = "";
			for(var i=0;i<str.length ; i++){
				if(i>len-1 && i <str.length-len){
					_str+= (s|| "*");
				}else{
					_str+=str.charAt(i);
				}
			}
			return _str;
		}
		return str;
	};

	app.locals.relacepoint = function(app_id){
		return app_id=="wx46720114a79f4627"?"福分":"积分";
	};
}