Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth()+1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth()+3)/3), // quarter
		"S" : this.getMilliseconds() // millisecond
	}
	if(/(y+)/.test(format))
		format = format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(format))
			format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	return format;
};
(function(window, undefined) {
	var jAds = {}, document = window.document, ud = null, rvalidchars = /^[\],:{}\s]*$/, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g, rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, rvalidid = /^#([^\s]+)$/, rvalidele = /^<(\w+)>$/i;
	jAds = function(str) {
		return new jAds.fn.init(str);
	};
	jAds.error = function(msg) {
		throw new Error(msg);
	};
	jAds.XMLHttp = function() {
		var XMLHttp = false;
		if (window.XMLHttpRequest) {
			XMLHttp = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			try {
				XMLHttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
					XMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {
				}
			}
		}
		!XMLHttp && jAds.error("Can not create XMLHttpRequest.");
		return XMLHttp;
	};
	//jAds.request = jAds.XMLHttp(); //单例
	jAds.ajaxHandler = function(request, callback) {
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				if (request.status == 200 || request.status == 0) {
					callback(request.responseText);
				}
			}
		};
	};
	jAds.parseContent = function(o) {
		if (typeof (o) == 'object') {
			var str = '';
			for (a in o) {
				str += a + '=' + o[a] + '&';
			}
			str = str.substr(0, str.length - 1);
			return str;
		} else {
			return o;
		}
	};
	jAds.uuid = function (l) {
		 var x="123456789poiuytrewqasdfghjklmnbvcxzQWERTYUIPLKJHGFDSAZXCVBNM";
		 var tmp="";
		 for(var i=0;i< l;i++) {
			 tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
		 }
		 return tmp;
	}
	jAds.imgLog = function (url) {  
	    var data = window['cnconoLogData'] || (window['cnconoLogData'] = {});  
	    var img = new Image();
	    var time = new Date().getTime();
	    img.onload = img.onerror = function () {
	        img.onload = img.onerror = null;  
	        img = null;  
	        delete data[time];
	    }  
	    img.src = url + '&_=' + time;  
	};
	jAds.urlencode = function(url){
		return encodeURIComponent(url);
	};
	jAds.urldecode = function(url){
		return decodeURIComponent(url);
	};
	jAds.lp = function(url){
		var para = false;
		if(!url||url=="")url = window.location.toString();
		if(url.indexOf("?")>-1){
			url = url.split("?")[1];
			if(url.indexOf("&")>-1){
				url = url.split("&");
				var temp = "";
				for(var i=0;i<url.length;i++){
					temp += ",{'name':'"+url[i].split("=")[0]+"','val':'"+url[i].split("=")[1]+"'}"
				}
				para = eval("["+temp.substring(1)+"]");
							
			}else{
				if(url.indexOf("=")>-1){
					url = url.split("=")
					para = [{name:url[0],val:url[1]}]
					
				}
			}
		}
		return para; 
	};	
	jAds.parseJSON = function(data) {
		if (window.JSON && window.JSON.parse) {
			return window.JSON.parse(data);
		}
		if (data === null) {
			return data;
		}
		if (typeof data === "string") {
			data = jAds.trim(data);
			if (data) {
				if (rvalidchars.test(data.replace(rvalidescape, "@").replace(
						rvalidtokens, "]").replace(rvalidbraces, ""))) {

					return (new Function("return " + data))();
				}
			}
		}
		jAds.error("Invalid JSON: " + data);
	};
	jAds.get = function(url, callback) {
		var request = jAds.XMLHttp();
		request.open('get', url, true);
		request.send(null);
		jAds.ajaxHandler(request, callback);
	};
	jAds.post = function(url, content, callback) {
		var request = jAds.XMLHttp();
		request.open('post', url, true);
		request.setRequestHeader('Content-Type',
				'application/x-www-form-urlencoded');
		content = jAds.parseContent(content);
		request.send(content);
		jAds.ajaxHandler(request, callback);
	};
	jAds.detectIE = function(){
		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){
            var ieversion = new Number(RegExp.$1);
            if (ieversion >= 5.5 && ieversion <= 8) {
            	if(!ud){
	            	try{
	            		ud= document.body;
	            		var meta = document.createElement('meta');
	                    meta.name = "save";
	                    meta.content = "userdata";
	                    document.getElementsByTagName('head')[0].appendChild(meta);
		            	ud = document.createElement("input");
		    			ud.type = "hidden";
		    			ud.style.display = "none";
		    			ud.addBehavior("#default#userData");
		    			document.getElementsByTagName("head")[0].appendChild(ud);
	            	}catch (e) {
					}
            	}
                return true;
            }
        }
        return false;
	};
	jAds.setUserData = function(name, value, days){
		if(jAds.detectIE() && ud){
			try{
				!days && (days = 365);
				var exp = new Date();
				exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
				ud.expires=exp.toUTCString();
				ud.load(window.location.hostname);
				ud.setAttribute(name, value);
				ud.save(window.location.hostname);
			}catch (e) {
			}
		}
	};
	jAds.getUserData = function(name){
		if(jAds.detectIE() && ud){
			try{
				ud.load(window.location.hostname);
				return ud.getAttribute(name);
			}catch (e) {
			}
		}
		return null;
	};
	jAds.isBlank = function(str) {
		if (typeof (str) === "string") {
			return jAds.trim(str) === "";
		}
		return false;
	};
	jAds.isEmptyObject = function(o){
		for(name in o){
			return false;
		}
		return true;
	};
	jAds.isArray = function(o){
		return Object.prototype.toString.call(obj) === '[object Array]';   
	};
	jAds.trim = function(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	};
	jAds.ltrim = function(str) {
		return str.replace(/(^\s*)/g, "");
	};
	jAds.rtrim = function(str) {
		return str.replace(/(\s*$)/g, "");
	};
	jAds.setCookie = function(key, value, days) {
		!days && (days = 365);
		var exp = new Date();
		exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = key + "=" + escape(value) + ";expires="
				+ exp.toGMTString();
	};
	jAds.getCookie = function(key) {
		var arr = document.cookie.match(new RegExp("(^| )" + key
				+ "=([^;]*)(;|$)"));
		if (arr != null) {
			return unescape(arr[2]);
		}
		return null;
	};
	jAds.delCookie = function(key) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = jAds.getCookie(key);
		if (cval != null) {
			document.cookie = key + "=" + cval + ";expires="
					+ exp.toGMTString();
		}
	};
	jAds.checkLocalStorage = function() {
		return !!window.localStorage;
	}; 
	jAds.setLocalStorage = function(key, value) {
		jAds.checkLocalStorage() && window.localStorage.setItem(key, value);
	};
	jAds.getLocalStorage = function(key) {
		if (jAds.checkLocalStorage()) {
			return window.localStorage.getItem(key);
		}
		return null;
	};
	jAds.getQueryString = function(val) {
		var uri = window.location.search;
		var re = new RegExp("" + val + "=([^&?]*)", "ig");
		return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1))
				: null);
	};
	jAds.getCurrentScript = function(){
		var scripts = document.getElementsByTagName("script");
		return scripts[scripts.length -1];
	};
	jAds.getScriptString = function(val) {
		var uri = jAds.getCurrentScript().src;
		var re = new RegExp("" + val + "=([^&?]*)", "ig");
		return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1))
				: null);
	};
	jAds.phone_number = function(val){
		var reg = /(^((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8}|((^\d{3}-\d{8}|\d{4}-\d{7}|\d{4}-\d{8})((-\d{3,})?)))$/;
		return reg.test($.trim(val))
	};
	jAds.fn = jAds.prototype = {
		init : function(str) {
			if(!str){
				this.ele = document.body || document.documentElement;
			}else if(typeof(str) == 'string'){
				if(m = rvalidid.exec(str)){
					this.ele = document.getElementById(m[1]);
					!this.ele && jAds.error("Unknow id: " + str);
				}
				if(m = rvalidele.exec(str)){
					this.ele = document.createElement(m[1]);
				}
			}else if(typeof(str) == 'object'){
				this.ele = str;
			}
			this.events = {};
			return this;
		},
		css : function(name, value){
			try{
				if(typeof(name) == 'string'){
					if(!value)
						return this.ele.style.name;
					this.ele.style[name] = value;
				}else if(typeof(name) == 'object'){
					if(!jAds.isEmptyObject(name)){
						for(i in name){
							this.ele.style[i] = name[i];
						}
					}
				}
			}catch (e) {
			}
			return this;
		},
		val : function(value){
			if(!value){
				return this.ele.value;
			}
			if(typeof(value) == 'string'){
				this.ele.value = value;
			}
			return this;
		},
		addCssText : function(text){
			if(typeof(text) == 'string')
				this.ele.style.cssText += text;
			return this;
		},
		attr : function(name, value){
			try {
				if(typeof(name) == 'string'){
					if(!value)
						return this.ele.name;
					this.ele[name] = value;
				}else if(typeof(name) == 'object'){
					if(!jAds.isEmptyObject(name)){
						for(i in name){
							this.ele[i] = name[i];
						}
					}
				}
			} catch (e) {
			}
			return this;
		},
		innerHTML : function(value){
			if(!value) {
				return this.ele.innerHTML;
			}
			this.ele.innerHTML = value;
			return this;
		},
		append : function(obj) {
			if(typeof(obj) == "object" && (obj instanceof jAds)){
				this.ele.appendChild(obj.ele);
			}
			if(typeof(obj) == "string"){
				this.innerHTML(obj);
			}
			return this;
		},
		bind : function(str, fun){
			if(typeof(fun) == 'function' && !this.events[str]){
				try{
					if(!window.addEventListener){
						this.ele.attachEvent("on" + str, fun);
					}else{
						this.ele.addEventListener(str, fun, false);
					}
					this.events[str] = fun;
				}catch (e) {
					
				}
			return this;
			}
		},
		unbind : function(str){
			if(!this.events[str]){
				return;
			}
			try{
				if(!window.addEventListener){
					this.ele.detachEvent("on" + str, this.events[str]);
				}else{
					this.ele.removeEventListener(str, this.events[str], false);
				}
				this.events[str] = null;
			}
			catch (e) {
			}
			return this;
		}
	};	
	jAds.fn.init.prototype = jAds.fn;
	
	window.jAds = window.$ = jAds;
})(window);