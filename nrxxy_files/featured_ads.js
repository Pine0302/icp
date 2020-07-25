(function(window, undefined) {
	var S = S || {}, K = K || ['t','g','c','p','l','pt'], SCRIPTS = SCRIPTS || {}, WEB_URL = WEB_URL || "http://www.edeng.cn", GET_URL = GET_URL || "/nf/edeng_ads.php";
	S = function (){
		this.c = S.init();
		return this;
	};
	S.init = function (){
		var C = {};C.param = {};
		try{
			C.web_url = "http://" + window.location.host;
			// t,g,c,p,l,pt
			for(var i in K){
				var k = K[i];
				var v = window.jAds.getScriptString(k);
				v = v == null?"":v;
				C.param[k] = v;
			}
		}catch(e){
			C.web_url = WEB_URL;
		}finally{
			var uuid = window.jAds.uuid(7);
			C.get_url = GET_URL;
			C.param['u'] = uuid;
			SCRIPTS[uuid] = window.jAds.getCurrentScript();
		}
		return C;
	};
	S.prototype = {
		query : function(){
			if(this.verify()){
				url = this.buildUrl();
				window.jAds.get(url, this.handler);
			}
		},
		buildUrl : function(){
			var url = this.c.web_url + this.c.get_url + "?";
			for(var k in this.c.param){
				var v = this.c.param[k];
				url += k + "=" + v + "&";
			}
			return url.substr(0, url.length - 1);
		},
		verify : function(){
			var p = this.c.param;
			if(p.t < 0 || p.t > 4 || p.p <= 0){
				return false;
			}
			return true;
		},
		handler : function(response){
			try{
				var json = window.jAds.parseJSON(response);
				var uuid = json.uuid;
				var type = json.type;
				if(uuid == 0){
					return false;
				}
				if(type != 2){
					var div = document.createElement("div");
					var html = json.data;
					div.innerHTML = html;
					SCRIPTS[uuid].parentNode.insertBefore(div, SCRIPTS[uuid].nextSibling);
				}else{
					var ul = document.createElement("ul");
					var size = json.data.length,
					timer = null,
					top = -16,
					moving = 0,
					html1 = new Array(),
					html2 = new Array();

					for(var i = 0; i < size; i++) {
						if (i < 12) { 
							html1[i+1] = '<li><a href="' + json.data[i].itemurl + '" target="_blank">' + json.data[i].title + '</a></li>';	
						}
						if (i == parseInt(size/2) && size % 2 == 1) {
							html1[0] = '<li><a href="' + json.data[i].itemurl + '" target="_blank">' + json.data[i].title + '</a></li>';	
						} 
						html2[i] = '<li><a href="' + json.data[i].itemurl + '" target="_blank">' + json.data[i].title + '</a></li>';	
					}
					if (size > 12) {
						ul.innerHTML = html2.join('') + html1.join('');
						if (size % 2 == 0) {	
							size = size / 2;
						} else {
							size = (size + 1) / 2;
						}
						timer = setInterval(function(){
							if (moving == 0) {
								top --;
								ul.style.top = top + "px";
								if (top == -36 * size -16) {
									top = -16;
									ul.style.top = top + "px";
								}
							}
						}, 50)
					} else {
						ul.innerHTML = html2.join('');
					}	
	
					SCRIPTS[uuid].parentNode.appendChild(ul);
					ul.onmouseover = function(){
						moving = 1;
					}
					ul.onmouseout = function() {
						moving = 0;
					}
				}
			}catch(e){
				// console.log(e);
			}
		}
	};
	window.S = S;
})(window);

var s = new S();
s.query();
