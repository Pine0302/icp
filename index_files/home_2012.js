;;;var iterate = function (obj){var	s="遍历对象"+obj+"的属性：\n";	for(var i in obj)	s+=i+":"+obj[i]+"\n<br />";	return s;};
//document.ready() method to listen to DOMContentLoaded event
(function() {
var ie = !-[1,];
var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
var fn = [];
var run = function() {
	for (var i = 0; i < fn.length; i++)
	fn[i]();
};
var d = document;
d.ready = function(f) {
	if (!ie && !wk && d.addEventListener)
	return d.addEventListener('DOMContentLoaded', f, false);
	if (fn.push(f) > 1)
	return;
	if (ie)
	(function() {
		try {
			d.documentElement.doScroll('left');
			run();
		} catch (err) {
			setTimeout(arguments.callee, 0);
		}
	})();
	else if (wk)
		var t = setInterval(function() {
			if (/^(loaded|complete)$/.test(d.readyState))
			clearInterval(t), run();
		}, 0);
	};
})();
String.prototype.trim = function()

{

	return this.replace(/(^\s*)|(\s*$)/g, "");

};
var $$ = function (id) {
	return 'string' == typeof id ? document.getElementById(id) : id;
};
var ED = ED || {};
ED.toggleHint = function(formitem, hintstr) {
	var active = document.activeElement;
	var defaultvalue = hintstr || formitem.defaultValue;
	var currentvalue = formitem.value;
	if ('' == currentvalue && active != formitem) {
		formitem.value = defaultvalue;
	} else if (currentvalue == defaultvalue  && active == formitem) {
		formitem.value = '';
	}
};
//get cookie
ED.getCookie = function(cookieName)
{
	var allcookies = document.cookie;
	//提取形如  bbsSearch=%E8%81%94%E6%83%B3; 的 cookie 值，要在字符串里表示一个 \，就得写 \\。注意如果这是本站唯一的 cookie，取全部 cookie 字符串时会没有结尾的 ;，所以要用 ;?。
	var reCookieExtract = new RegExp(cookieName+'=([^;]+);?');
	//var arrHistory = [];
	var cookieValue = '';
	var arrMatch ;
	//alert(reCookieExtract.exec(allcookies));
	if (arrMatch = reCookieExtract.exec(allcookies))
	{
		//cookieValue = decodeURIComponent(arrMatch[1]);
		cookieValue = arrMatch[1];
	}
	return cookieValue ;
};
//parse cookie
ED.session = ED.session || {};
ED.parseSessionCookie = function()
{
		var sessionCookie = decodeURIComponent(ED.getCookie('edengcookie'));
		if (''!=sessionCookie)
		{
			var arrCookie = sessionCookie.split(';;;');
			for (var i =0; i < arrCookie.length; i++)
			{
				var tmp = arrCookie[i].split(':=:');
				ED.session[tmp[0]] = tmp[1];
			}
		}
};

var HP = HP || {};
HP.popSearch = function(obj){
	$$(obj).style.display="block";
};
HP.setVal = function(obj){
	$$('h_cat_id').value = obj.id;
	$$('click_btn').innerHTML = obj.innerHTML;
	$$('click_box').style.display="none";
};
HP.strpos = function(haystack, needle, offset){
	var i=(haystack+'').indexOf(needle,(offset ? offset : 0));

	return i === -1 ?false : i;
};
HP.closePop = function(obj){
	$$(obj).style.display="none";
};
HP.showDiv = function(orgclass,toclass,orgobj,toobj){
	$$(orgobj).className = $$(orgobj).className.replace(orgclass,toclass);
	$$(toobj).style.display = "block";
};
HP.closeDiv = function(orgclass,toclass,orgobj,toobj){
	$$(orgobj).className = $$(orgobj).className.replace(toclass,orgclass);
	$$(toobj).style.display = "none";
};
HP.searchGo = function(fn,tp,ref_id){
	var sform = document.forms[fn];

	var s_keyword = sform.key_title.value;

	var noallowchar = "";

	s_keyword = s_keyword.trim();

	if(s_keyword.indexOf("*") != -1){

		s_keyword = s_keyword.replace(/(\**)/g,"");//jira3167

		noallowchar = noallowchar + '‘*’';

	}

	if(s_keyword.indexOf("?") != -1){

		s_keyword = s_keyword.replace(/(\?*)/g,"");//jira3167 

		noallowchar = noallowchar + '‘?’';

	}

	s_keyword = s_keyword.trim();

	if(s_keyword && !HP.strpos(s_keyword, '输入关键字试试')){

		var newurl = tp ? sform.newurl.value : '/c/G';

		var sgid = tp ? sform.geo_id.value : 1;

		var scid = tp ? sform.cat_id.value : 0;

		var goURL = tp ? sform.gourl.value : "";

		if(!sgid)sgid = 1;

		if(!scid)scid = 0;

		if(ref_id){
			ref_str="R"+ref_id;
		}else{

		  	ref_str="";
		  }

		goURL = goURL + newurl + sgid + "C" + scid +ref_str+"/" + encodeURI(s_keyword);

		//window.open('http://www.sogou.com/sogou?query='+encodeURI(s_keyword)+'&pid=sogou-site-8fc687aa152e8199', '_blank', 'alwaysLowered=no,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,location=yes,status=yes');
		window.location.href = goURL? goURL+"/" : document.location.href;

	}else{

		var alertmsg = "请输入搜索关键词";

		if(noallowchar!="")

		{

			alertmsg = alertmsg + ",且不要尝试"+noallowchar+"等非法字符。";

		}

		alert(alertmsg);

		sform.key_title.value = "";

		sform.key_title.focus();

	}

	return false;
};

//AJAX for homepage.
var adsHomeValue=0;
var adsxmlhttp = false;
try {
	adsxmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
} catch (e) {
	try {
		adsxmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	} catch (e2) {
		adsxmlhttp = false;
	}
}
if (!adsxmlhttp && typeof XMLHttpRequest != 'undefined') {
	adsxmlhttp = new XMLHttpRequest();
}
function pageTurnAjax(num, action, geoid){
	if(action=='next'){
		adsHomeValue += num;
	}else{
		adsHomeValue -= num;
	}
	document.getElementById("adscode").innerHTML = '<div id="adsloading"><img src="http://img01.edeng.cn/images/blue/loading.gif" /></div>';
	adsxmlhttp.open("GET","/nf/home_ads_2012.php?num="+num+"&action="+action+"&flag="+adsHomeValue+"&geoid="+geoid, true);
	adsxmlhttp.send(null);
	adsxmlhttp.onreadystatechange=function(){
		if (4==adsxmlhttp.readyState){
			if (200==adsxmlhttp.status){
				document.getElementById("adscode").innerHTML=adsxmlhttp.responseText;
			}else{
				document.getElementById("adscode").innerHTML = '<div id="adsloading"><img src="http://img01.edeng.cn/images/blue/loading.gif" /></div>';
			}
		}
	};
};

var getFavor = function(uid,gid){
	if($$('menu_hover_box').style.display == 'none'){
		if($$('myfeet').className.indexOf('hover') == -1){
			$$('myfeet').className = $$('myfeet').className + ' hover';
		}
		$$('menu_hover_box').style.display = "block";
		if(!uid){
			return false;
		}
		document.getElementById("menu_hover").innerHTML = '加载中请稍候..';
		adsxmlhttp.open("GET","/nf/user_favor.php?uid="+uid+'&gid='+gid+'&radom'+Math.random(), true);
		adsxmlhttp.send(null);
		adsxmlhttp.onreadystatechange=function(){
			if (4==adsxmlhttp.readyState){
				if (200==adsxmlhttp.status){
					if(adsxmlhttp.responseText != false){
						var data = eval('('+adsxmlhttp.responseText+')');
						$$("menu_hover").innerHTML = data.data;
						if(data.state == 1){
							$$('menu_hover_op').innerHTML = '<a class="btn_topmenu" target="_blank"  href="http://www.edeng.cn/code/bin/register/reg_cat.php?ms=my" id="menu_hover_op">修改关注</a>';
						}else if(data.state == 0){
							$$('menu_hover_op').innerHTML = '<a class="btn_topmenu" target="_blank"  href="http://www.edeng.cn/code/bin/register/reg_cat.php?ms=my" id="menu_hover_op">添加关注</a>';
						}
					}else{
						$$("menu_hover").innerHTML = '您尚未登录';
					}
				}else{
					$$("menu_hover").innerHTML = '加载中请稍候..';
				}
			}
		};
	}
};

var getFavorOut = function(flag){
	if(flag == 1){
		if($$('myfeet').className.indexOf('hover') == -1){
			$$('myfeet').className = $$('myfeet').className + ' hover';
		}
		$$('menu_hover_box').style.display = "block";
	}else{
		$$('myfeet').className = $$('myfeet').className.replace('hover','');
		$$('menu_hover_box').style.display = "none";
	}
};

function toggleLayer(extlinks){
	if (document.getElementById){
		var e = document.getElementById(extlinks)
        	e.style.display = e.style.display == "none" ? "block":"none";
	}
}

/* for mobile site referrer*/
var sUserAgent = window.navigator.userAgent;
var sUserHerf = window.location.href;
var sUserRefer = window.document.referrer;
var sUserRedirectUrl = '';
var sUserPageName = 'other';
var sMobileType = /(SymbianOS|SymbianOS|SonyEricsson|Android|Nokia|SAMSUNG|iPhone|MOT|WindowsCE|BlackBerry|SAM|WindowsMobile|softbank|KDDI|LG|SCH|MobilePhone|UTS|HTC|ZTE|SGH|philips|panasonic|alcatel|lenovo|cldc|midp|mobile|itouch|CoolPAD|Motorola|NEC)/i;
if (sUserHerf.indexOf('xinxi/') != -1){
	sUserPageName = 'item';
}else if (sUserHerf.match(/(edeng\.cn\/?)$/)){
	sUserPageName = 'home';
}else if (sUserHerf.match(/(edeng\.cn\/13\/|edeng\.cn\/33\/|edeng\.cn\/53\/|edeng\.cn\/63\/)/i)){
	sUserPageName = 'listing';
}else{
	//others
}
if (sUserRefer.indexOf('edeng.cn') == -1){
	if (sUserAgent.match(sMobileType)){
		if (sUserPageName == 'other'){
			sUserRedirectUrl = 'http://wap.edeng.cn';
		}else{
			if(sUserHerf.indexOf('www.edeng.cn') != -1){
				sUserRedirectUrl = sUserHerf.replace('www','wap');
			}else if(sUserHerf.indexOf('wap.') == -1){
				sUserRedirectUrl = sUserHerf.replace('http://','http://wap.');
			}
		}
	}else{
		// main site
	}
	if (sUserRedirectUrl){
		window.location.href = sUserRedirectUrl;
	}
}
/*mobile referrer end*/

function sitebox(config){
	var web_url = config.web_url;
	var my_edeng_file = config.my_edeng_file;
	adsxmlhttp.open("GET", my_edeng_file + '?m=sitebox&a=unread&radom'+Math.random());
	adsxmlhttp.send(null);
	adsxmlhttp.onreadystatechange=function(){
		if (4==adsxmlhttp.readyState){
			if (200==adsxmlhttp.status){
				if(adsxmlhttp.responseText != false){
					var data = eval('('+adsxmlhttp.responseText+')');
					if(data.state == 100){
						var unread = data.data.msg;
						if(unread > 0){
							var div = document.createElement("div");
							div.className = "quickmenu left";
							var html = '<a href="'+web_url+my_edeng_file+'?m=sitebox&a=in" target="_blank">' + unread + '条未读信息</a><span class="sitebox"></span>';
							div.innerHTML = html;
							$$("session_info").insertBefore(div, $$("u_name_btn").nextSibling);
						}
					}
				}
			}
		}
	};
}

document.ready(function() {
		// Make post link according to user login status.
	// link_id: id of the link
	var makeSessionPostLink = function(link_id, user_id, config, geotrace, cattrace, title)
	{
		var domHousePost = $$(link_id);
		if (domHousePost)
		{
			var urlHousePost = config.post_msg_file;
//			var urlHousePost = config.code_dir+config.post_msg_file+'?geotrace='+geotrace+'&cattrace='+cattrace;
			if (0==user_id)
			{
				urlHousePost = config.login_form_file+'?from=5&to='+encodeURIComponent(urlHousePost);
			}
			urlHousePost = config.web_url+urlHousePost;
			domHousePost.href = urlHousePost;
			domHousePost.title = title;
		}
	};
	var domToggle = $$('key_title');
	if (domToggle)
	{
		domToggle.onclick=function() {ED.toggleHint(this);};
		domToggle.onblur=function() {ED.toggleHint(this);};
	}
	//与显示无关的请求放最后
	if (window.ED)
	{
		var config = ED.config;
		var web_url = config.web_url;
		var msg = ED.msg;
		var geoid = msg.geoid;
		ED.parseSessionCookie();
		var user_id = ED.session.uid ? ED.session.uid : 0;
		var postFile = config.post_msg_file+'?geotrace='+msg.geotrace+'&cattrace='+msg.cattrace;
		// User session panel
		var user_name = decodeURIComponent(ED.getCookie('login_id'));
		var domSession = $$('session_info');
		if (domSession)
		{
			var userpanel = '';
			if (user_id > 0)
			{
				userpanel +='<div class="quickmenu left nobg " id="myfeet"  ><a href="javascript:;" onmouseover="getFavor('+user_id+','+geoid+')">我的关注<span class="arrow"></span></a><div style="display:none;" id="menu_hover_box" class="hc" onmouseover="getFavorOut(1);" onmouseout="getFavorOut(0);"><p class="qucikmenu_title">您关注的分类：</p><ul id="menu_hover"></ul><label id="menu_hover_op"></label></div></div><div class="quickmenu left" id="myfeet"><a href="'+web_url+config.my_edeng_file+'?m=publish&a=shown" target="_blank">已发布的信息</a><span class="arrow"></span></div>';

				userpanel += '<div class="login left quickmenu spacing" id="u_name_btn" onmouseover = "HP.showDiv(\'quickmenu\',\'hover\',\'u_name_btn\',\'menu_hover_box3\')" onmouseout="HP.closeDiv(\'quickmenu\',\'hover\',\'u_name_btn\',\'menu_hover_box3\')" ><a  href="'+web_url+config.my_edeng_file+'"  >'+user_name+'</a><span class="arrow"></span><div id="menu_hover_box3" class="hc"  style="display:none;"><ul><li><a href="'+web_url+config.my_edeng_file+'" target="_blank">我的易登</a></li><li><a href="'+web_url+config.my_edeng_file+'?m=promotion&a=index" target="_blank">推广管理</a></li><li><a href="'+web_url+config.logout_file+'">退出</a></li></ul></div></div>';
			}
			else
			{
				userpanel += '<div class="quickmenu left nobg " id="myfeet" onmouseover="getFavor('+user_id+','+geoid+')" onmouseout="getFavorOut();"><a href="javascript:;" >我的关注<span class="arrow"></span></a><div style="display:none;" id="menu_hover_box" class="hc"><p class="qucikmenu_title">你还没有任何关注</p><ul id="menu_hover"><a class="btn_topmenu" target="_blank"  href="'+web_url+'/code/bin/login/login_form.php?a='+geoid+'&f='+encodeURIComponent(postFile)+'" id="menu_hover_op">添加关注</a></ul><label id="menu_hover_op"></label></div></div><div class="login left"><a target="_self" href="'+web_url+'/code/bin/login/login_form.php?a='+geoid+'&f='+encodeURIComponent(postFile)+'">登录</a></div><div class="register left"><a target="_self" href="'+web_url+config.register_user_file+'">注册</a></div>'
			}
			userpanel += '<div class="help left"><a target="_self" href="'+web_url+'/company/help_core.html"><font style="font-weight:bold;color:red">帮助</font></a></div>';
			domSession.innerHTML = userpanel;
			if(user_id > 0){
				sitebox(config);
			}
		}
		// Posting link
		makeSessionPostLink('COOKIE_FABU', user_id, config, msg.geotrace, msg.cattrace, msg.geotitle+'免费发布信息');
	}
});

