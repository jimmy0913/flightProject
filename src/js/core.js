(function ($) {
	

	var timerout = 45 * 1000,
	_config = {
		_baseUrl: "/"
	};

	$.api = function(type, funname, data, callback) {
		if (type == "get")
			data["t"] = new Date().getTime();
		$.ajax({
			type: type,
			url: _config._baseUrl + funname,
			data: (data != null && type == "post") ? JSON.stringify(data) : data,
			dataType: "json",
			timeout: timerout,
			contentType: "application/json;charset=utf-8",
			complete: function(xhr, status) {
				var is_ok = true,ret;
				try {
					ret = JSON.parse(xhr.responseText);
				} catch (e) {
					is_ok = false;
				}
				if (is_ok && ret != undefined) {
					callback(ret);
				} else {
					callback({
						status: {
							code: -1,
							message: "网络貌似有点问题哟!"
						}
					});
				}
			}
		});
	};


	$.load = function(msg){
		$("body").append(loadboxstr);
		loadbox = $("#loadbox");
	}
	$.loadhide = function(msg){
		if (loadbox) loadbox.remove();
	}
	$.tip = function(msg, type){ //info 警告 success 成功 warn 错误

		if (!tipbox) {
			$("body").append(tipboxstr);
			tipbox = $("#tipbox");
		}
		var tipboxs = tipbox.find(".s");
		tipbox.addClass("ui-poptips-" + (type)).toggle();
		tipboxs.html(msg);
		setTimeout(function() {
			tipbox.removeClass("ui-poptips-" + (type)).toggle();
		}, 2500);
	}




	var  loadbox, tipbox,
	loadboxstr =
	"<div id='loadbox' class='ui-dialog ui-dialog-notice show'>\
	<div class='ui-dialog-cnt'>\
	<i class='ui-loading-bright'></i>\
	<p class='p'>提交中...</p>\
	</div>\
	</div>",
	tipboxstr =
	"<div id='tipbox' class='ui-poptips' >\
	<div class='ui-poptips-cnt'>\
	<i></i><span class='s'></span>\
	</div>\
	</div>";




})(Zepto);


function stoptouchmove() {
	document.body.addEventListener('touchmove', function(event) {
		event.preventDefault();
	}, false);
}

function starttouchmove() {
	document.body.addEventListener('touchmove', function(event) {
		window.event.returnValue = true;
	}, false);
}

function checkPoint(str) {
	if (!str)
		return false;
	return str.indexOf('.') == -1 ? false : true;
}

function validPrice(str) {
	var reg = /^[1-9]\d*.\d*|0.\d*[1-9]\d*|[1-9]\d*$/;
	return reg.test(str.toString()) ? true : false;
}

