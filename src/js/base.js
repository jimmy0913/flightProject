define(['jQuery'], function ($) {
 
 
    var timerout = 45 * 1000,
        _config = {
            _baseUrl: "/"
        };
 
    $.api = function (type, funname, data, callback) {
        if (type == "get")
            data["t"] = new Date().getTime();
        $.ajax({
            type: type,
            url: _config._baseUrl + funname,
            data: (data != null && type == "post") ? JSON.stringify(data) : data,
            dataType: "json",
            timeout: timerout,
            contentType: "application/json;charset=utf-8",
            complete: function (xhr, status) {
                var is_ok = true,
                    ret;
                try {
                    ret = xhr.responseJSON;
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
 
 
    $.fn.scroll = function (opt) {
 
 
 
        var _self = this,
            _this = _self[0],
            dom = _self.find("ul"),
            _opt = {
                scroll_height: _this.scrollHeight,
                client_height: _this.clientHeight,
                is_load: false,
                begin: 0,
                touch: 0,
                y: 0,
                move: 0,
                load: function () {},
                done: function () {}
            };
 
        $.extend(_opt, opt);
 
 
        dom.css({
            "transform": "translateY(0px) translateZ(0px)"
        });
 
        _self.off("touchstart").on("touchstart", function (e) {
            _opt.scroll_height = _this.scrollHeight;
            _opt.client_height = _this.clientHeight;
            _opt.is_load = false;
            _opt.begin = event.targetTouches[0].pageY;
            _opt.touch = _opt.y;
            _opt.move = 0;
 
 
        })
 
 
        _self.off("touchmove").on("touchmove", function (e) {
 
            if (_opt.begin > event.targetTouches[0].pageY) {
                _opt.touch += _opt.begin - event.targetTouches[0].pageY;
            } else {
                _opt.touch -= event.targetTouches[0].pageY - _opt.begin;
            }
            _opt.begin = event.targetTouches[0].pageY;
 
 
            if (_opt.touch < 0) {
                _opt.touch = 0;
            } else if (_opt.touch > _opt.scroll_height - _opt.client_height) {
                _opt.move++;
                _opt.touch = _opt.scroll_height - _opt.client_height;
            }
 
            dom.css({
                "transition-duration": "0s",
                "transform": "translateY(-" + _opt.touch + "px) translateZ(0px)"
            });
 
            if (_opt.move > 5 && _opt.scroll_height - _opt.client_height == _opt.touch && !_opt.is_load) {
                _opt.is_load = true;
                _opt.load();
            }
 
        })
 
 
        _self.off("touchend").on("touchend", function (e) {
 
 
            _opt.y = _opt.touch;
 
            if (_opt.move > 2 && _opt.scroll_height - _opt.client_height == _opt.y && !_opt.is_load) {
                _opt.is_load = true;
                _opt.load();
            }
 
        })
 
    }
 
 
    var confirmbox, showbox, loadbox, tipbox;
    $.extend({
        'go': function (url) {
            if (url != null && url.indexOf("?") != -1) {
                url += "&_bind=" + window._config._bind;
            } else {
                url += "?_bind=" + window._config._bind;
            }
            window.location.href = url;
        },
        'load': function (msg) {
 
            $("body").append(loadboxstr.format(msg || "提交中..."));
            loadbox = $("#loadbox");
        },
        'loadhide': function () {
            if (loadbox) loadbox.remove();
        },
        'tip': function (msg, type, func) { //info 警告 success 成功 warn 错误
            if (!tipbox) {
                $("body").append(tipboxstr);
                tipbox = $("#tipbox");
            }
            var tipboxs = tipbox.find(".s");
            tipbox.addClass("ui-poptips-" + (type)).fadeToggle();
            tipboxs.html(msg);
            _.delay(function () {
                tipbox.removeClass("ui-poptips-" + (type)).fadeToggle();
                if (func && $.isFunction(func)) {
                    _.delay(func, 500);
                }
            }, 2500);
        },
        'confirm': function (opts) {
            var defun = function () {
                $.confirmhide();
            }
            var defaults = {
                title: "温馨提示",
                context: "",
                btns: [
                    ["确定", defun],
                ]
            }
            opts = $.extend({}, defaults, opts);
            $("body").append(confirmboxstr.format(opts.title, opts.context));
            confirmbox = $("#confirmbox");
            var btns = [];
            var btn = {};
            $(opts.btns).each(function (i, d) {
                if (d[1] == null || typeof d[1] == 'function') {
                    btn = $("<a class='blue_btn' href='javascript:void(0);'>").html(d[0]).on("click", d[1] == null ?
                        defun : d[1]);
                } else {
                    btn = $("<a class='blue_btn' href='tel:" + d[1] + "'>").html(d[0]).on("click", d[2] == null ? defun :
                        d[2]);
                }
                btns.push(btn);
            });
            confirmbox.find("#confirmbtns").append(btns);
            stoptouchmove();
            confirmbox.addClass("show");
            setTimeout(function () {
                $(".ui-dialog-cnt").on("touchend", function (e) {
                    e.stopPropagation();
                })
                confirmbox.on("touchend", function (e) {
                    $.confirmhide();
                    e.preventDefault();
                })
            }, 300);
        },
        'confirmhide': function () {
            starttouchmove();
            if (confirmbox) confirmbox.remove();
        },
        'showbox': function (msg) {
            $("body").append(showboxstr.format(msg));
            showbox = $("#showboxbox");
            $("#confirmcontext").on("touchend", function (e) {
                e.stopPropagation();
            });
            showbox.on("touchend", function (e) {
                $.showboxhide();
                e.preventDefault();
            });
            showbox.find(".icon-close1").on("click", function (e) {
                $.showboxhide();
                e.preventDefault();
            });
            stoptouchmove();
            showbox.addClass("show");
        },
        'showbox2': function (msg) {
            $("body").append(showboxstr2.format(msg));
            showbox = $("#showboxbox");
            $("#confirmcontext").on("touchend", function (e) {
                e.stopPropagation();
            });
            showbox.on("touchend", function (e) {
                $.showboxhide();
                e.preventDefault();
            });
            showbox.find(".icon-close1").on("click", function (e) {
                $.showboxhide();
                e.preventDefault();
            });
            stoptouchmove();
            showbox.addClass("show");
        },
        'showboxhide': function () {
            starttouchmove();
            if (showbox) showbox.remove();
        },
        'setdata': function (key, value) {
            window.localStorage.setItem(key, JSON.stringify(value));
        },
        'getdata': function (key) {
            if (window.localStorage.hasOwnProperty(key)) {
                return $.parseJSON(window.localStorage.getItem(key));
            } else {
                return null;
            }
        },
        'cleardata': function (key) {
            window.localStorage.removeItem(key);
        },
        'clearalldata': function () {
            window.localStorage.clear();
        },
        'loading': function (msg) {
            return loaddatastr.format(msg || "数据加载中...")
        },
        'nodata': function (msg) {
            return nodatastr.format(msg || "暂无数据");
        }
    });
 
    var confirmboxstr =
        "<div id='confirmbox' class='ui-dialog ui-cover ui-dialogs'>\
            <div class='ui-dialog-cnt'>\
                <div class='ui-dialog-bd'>\
                    <h4 id='confirmtitle'>{0}</h4>\
                    <div id='confirmcontext'>{1}</div>\
                </div>\
                <div id='confirmbtns' class='ui-dialog-ft ui-btn-group' ></div>\
            </div>\
        </div>";
 
    /*var confirmboxstr2 =
        "<div id='confirmbox' class='ui-dialog ui-dialogs'>\
            <div class='ui-dialog-cnt'>\
                <div class='ui-dialog-bd'>\
                    <h4 id='confirmtitle' class='gray_border'>{0}</h4>\
                    <div id='confirmcontext'>{1}</div>\
                </div>\
                <div id='confirmbtns' class='ui-dialog-ft ui-btn-group' ></div>\
            </div>\
        </div>";*/
 
    var showboxstr =
        "<div id='showboxbox' class='ui-dialog ui-dialogs'>\
<div class='ui-dialog-cnt ui-dialog-cnt2'>\
<i class='icon icon-close1' >×</i>\
<div class='ui-dialog-bd'>\
<div class='content_info' id='confirmcontext'>{0}</div>\
</div>\
</div>\
</div>";
 
    //优惠券详情弹层
    var showboxstr2 =
        "<div id='showboxbox' class='ui-dialog ui-dialogs'>\
<div class='ui-dialog-cnt ui-dialog-cnt2'>\
<div class='ui-dialog-bd'>\
<h3 class='dialog_t'>升级好礼</h3>\
<div class='content_info' id='confirmcontext'>{0}</div>\
</div>\
</div>\
</div>";
 
 
    var loadboxstr =
        "<div id='loadbox' class='ui-dialog ui-dialog-notice show'>\
            <div class='ui-dialog-cnt'>\
                <i class='ui-loading-bright'></i>\
                <p class='p'>{0}</p>\
            </div>\
        </div>";
 
    var tipboxstr =
        "<div id='tipbox' class='ui-poptips' >\
<div class='ui-poptips-cnt'>\
<i></i><span class='s'></span>\
</div>\
</div>";
 
 
    var loaddatastr =
        "<li class='load-box' >\
<i class='icon icon-load' ></i>\
<p>{0}</p>\
</li>";
 
 
    var nodatastr =
        "<li class='no-data' >\
<img src='../img/icon_shop_nodata.png' >\
<p>{0}</p>\
</li>"
 
 
 
 
 
 
 
 
 
 
});
 
function isEmpty(v) {
    if (v == undefined || v == null || v == 'null' || v == 'undefined' || v.toString().trim() == "") {
        return true;
    }
    return false;
}
 
function dataLength(fData) {
    var intLength = 0
    for (var i = 0; i < fData.length; i++) {
        if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255))
            intLength = intLength + 2
        else
            intLength = intLength + 1
    }
    return intLength
}
 
function ltos(str) {
    if (str != null && str.length > 10)
        return str.substring(0, 10)
    return str;
 
}
 
function checkMobile(mobile) {
    var myreg = /^((1)+\d{10})$/;
    if (myreg.test(mobile)) {
        return false;
    }
    return true;
}
 
function checkVerifi(ver) {
    var myreg = /^(\d{6})$/;
    if (myreg.test(ver)) {
        return false;
    }
    return true;
}
 
function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
 
function stoptouchmove() {
    document.body.addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, false);
}
 
function starttouchmove() {
    document.body.addEventListener('touchmove', function (event) {
        window.event.returnValue = true;
    }, false);
}
 
function stoptouchmoveid(id) {
    document.getElementById(id).addEventListener('touchmove', function (event) {
        event.preventDefault();
    }, false);
}
 
function starttouchmoveid(id) {
    document.getElementById(id).addEventListener('touchmove', function (event) {
        window.event.returnValue = true;
    }, false);
}
 
 
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}
 
 
function isChinese(str) {
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    return reg.test(str);
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
 
 
function getWeek(date) {
    return "星期" + (["天", "一", "二", "三", "四", "五", "六"][new Date(date).getDay()]);
};
 
 
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
}
 
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
 
//两种调用方式
// var template1="我是{0}，今年{1}了";
// var template2="我是{name}，今年{age}了";
// var result1=template1.format("loogn",22);
// var result2=template2.format({name:"loogn",age:22});
//两个结果都是"我是loogn，今年22了"
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}