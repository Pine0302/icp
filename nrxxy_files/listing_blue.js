var __AutoComplete = new Array();
var __FETCHRESULTURL = '';
isIE = document.all ? true: false;
isGecko = navigator.userAgent.toLowerCase().indexOf('gecko') != -1;
isOpera = navigator.userAgent.toLowerCase().indexOf('opera') != -1;
function AutoComplete_Create(id, url) {
	__FETCHRESULTURL = url;
	__AutoComplete[id] = {
		'data': new Array(),
		'isVisible': false,
		'element': document.getElementById(id),
		'dropdown': null,
		'highlighted': null
	};
	__AutoComplete[id]['element'].setAttribute('autocomplete_city', 'off');
	__AutoComplete[id]['element'].onkeydown = function(e) {
		return AutoComplete_KeyDown(this.getAttribute('id'), e)
	};
	__AutoComplete[id]['element'].onkeyup = function(e) {
		return AutoComplete_KeyUp(this.getAttribute('id'), e)
	};
	__AutoComplete[id]['element'].onkeypress = function(e) {
		if (!e) e = window.event;
		if (e.keyCode == 13 || isOpera) return false
	};
	__AutoComplete[id]['element'].ondblclick = function() {
		AutoComplete_ShowDropdown(this.getAttribute('id'))
	};
	__AutoComplete[id]['element'].onclick = function(e) {
		checkAutoKW('city', 1, '中文/拼音', e)
	};
	__AutoComplete[id]['element'].onblur = function(e) {
		checkAutoKW('city', 0, '中文/拼音', e)
	};
	var docClick = function() {
		for (id in __AutoComplete) {
			AutoComplete_HideDropdown(id)
		}
	};
	if (document.addEventListener) {
		document.addEventListener('click', docClick, false)
	} else if (document.attachEvent) {
		document.attachEvent('onclick', docClick, false)
	}
	if (arguments[2] != null) {
		__AutoComplete[id]['maxitems'] = arguments[2];
		__AutoComplete[id]['firstItemShowing'] = 0;
		__AutoComplete[id]['lastItemShowing'] = arguments[2] - 1
	}
	AutoComplete_CreateDropdown(id);
	if (isIE) {
		__AutoComplete[id]['iframe'] = document.createElement('iframe');
		__AutoComplete[id]['iframe'].id = id + '_iframe';
		__AutoComplete[id]['iframe'].style.position = 'absolute';
		__AutoComplete[id]['iframe'].style.top = '0';
		__AutoComplete[id]['iframe'].style.left = '0px';
		__AutoComplete[id]['iframe'].style.width = '0px';
		__AutoComplete[id]['iframe'].style.height = '0px';
		__AutoComplete[id]['iframe'].style.zIndex = '98';
		__AutoComplete[id]['iframe'].style.visibility = 'hidden';
		__AutoComplete[id]['dropdown'].style.left = '418px';
		__AutoComplete[id]['element'].parentNode.insertBefore(__AutoComplete[id]['iframe'], __AutoComplete[id]['element'])
	}
};
function AutoComplete_CreateDropdown(id) {
	var left = AutoComplete_GetLeft(__AutoComplete[id]['element']);
	var top = AutoComplete_GetTop(__AutoComplete[id]['element']) + __AutoComplete[id]['element'].offsetHeight;
	var width = __AutoComplete[id]['element'].offsetWidth;
	__AutoComplete[id]['dropdown'] = document.createElement('div');
	__AutoComplete[id]['dropdown'].className = 'autocomplete_city';
	__AutoComplete[id]['element'].parentNode.insertBefore(__AutoComplete[id]['dropdown'], __AutoComplete[id]['element']);
	__AutoComplete[id]['dropdown'].style.left = left + 'px';
	__AutoComplete[id]['dropdown'].style.top = top + 'px';
	__AutoComplete[id]['dropdown'].style.width = '202px';
	__AutoComplete[id]['dropdown'].style.zIndex = '99';
	__AutoComplete[id]['dropdown'].style.visibility = 'hidden'
};
function AutoComplete_GetLeft(element) {
	var curNode = element;
	var left = 0;
	do {
		left += curNode.offsetLeft;
		if (left > 0) {
			break
		}
		if (curNode.offsetParent == null) break;
		else curNode = curNode.offsetParent
	} while ( curNode . tagName . toLowerCase () != 'body');
	return left
};
function AutoComplete_GetTop(element) {
	var curNode = element;
	var top = 0;
	do {
		top += curNode.offsetTop;
		if (top > 0) {
			break
		}
		if (curNode.offsetParent == null) break;
		else curNode = curNode.offsetParent
	} while ( curNode . tagName . toLowerCase () != 'body');
	return top
};
function AutoComplete_ShowDropdown(id) {
	AutoComplete_HideAll();
	var value = __AutoComplete[id]['element'].value;
	var toDisplay = new Array();
	var newDiv = null;
	var text = null;
	var numItems = __AutoComplete[id]['dropdown'].childNodes.length;
	while (__AutoComplete[id]['dropdown'].childNodes.length > 0) {
		__AutoComplete[id]['dropdown'].removeChild(__AutoComplete[id]['dropdown'].childNodes[0])
	}
	var url_query = value.ltrim();
	url_query = url_query.rtrim();
	if (url_query != '') {
		document.getElementById('keyvalue').value = url_query;
		var url = __FETCHRESULTURL + encodeURI(url_query);
		var context = getRemoteTextContent(url);
		__AutoComplete[id]['data'] = context.split("\n")
	} else {
		__AutoComplete[id]['data'] = ''
	}
	for (i = 0; i < __AutoComplete[id]['data'].length; ++i) {
		if (__AutoComplete[id]['data'][i] != '') {
			toDisplay[toDisplay.length] = __AutoComplete[id]['data'][i]
		}
	}
	if (toDisplay.length == 0) {
		AutoComplete_HideDropdown(id);
		return
	}
	for (i = 0; i < toDisplay.length; ++i) {
		newDiv = document.createElement('div');
		newDiv.className = 'autocomplete_item';
		newDiv.setAttribute('id', 'autocomplete_item_' + i);
		newDiv.setAttribute('index', i);
		newDiv.style.zIndex = '99';
		if (toDisplay.length > __AutoComplete[id]['maxitems'] && navigator.userAgent.indexOf('MSIE') == -1) {
			newDiv.style.width = __AutoComplete[id]['element'].offsetWidth - 22 + 'px'
		}
		newDiv.onmouseover = function() {
			AutoComplete_HighlightItem(__AutoComplete[id]['element'].getAttribute('id'), this.getAttribute('index'));
			AutoComplete_submitable()
		};
		newDiv.onclick = function() {
			AutoComplete_SetValue(__AutoComplete[id]['element'].getAttribute('id'));
			AutoComplete_HideDropdown(__AutoComplete[id]['element'].getAttribute('id'))
		};
		text = document.createTextNode(toDisplay[i]);
		newDiv.appendChild(text);
		__AutoComplete[id]['dropdown'].appendChild(newDiv)
	}
	if (toDisplay.length > __AutoComplete[id]['maxitems']) {
		__AutoComplete[id]['dropdown'].style.height = (__AutoComplete[id]['maxitems'] * 15) + 2 + 'px'
	} else {
		__AutoComplete[id]['dropdown'].style.height = ''
	}
	__AutoComplete[id]['dropdown'].style.left = AutoComplete_GetLeft(__AutoComplete[id]['element']);
	__AutoComplete[id]['dropdown'].style.top = AutoComplete_GetTop(__AutoComplete[id]['element']) + __AutoComplete[id]['element'].offsetHeight;
	if (isIE) {
		__AutoComplete[id]['iframe'].style.top = __AutoComplete[id]['dropdown'].style.top;
		__AutoComplete[id]['iframe'].style.left = __AutoComplete[id]['dropdown'].style.left;
		__AutoComplete[id]['iframe'].style.width = __AutoComplete[id]['dropdown'].offsetWidth;
		__AutoComplete[id]['iframe'].style.height = __AutoComplete[id]['dropdown'].offsetHeight;
		__AutoComplete[id]['iframe'].style.visibility = 'visible'
	}
	if (!__AutoComplete[id]['isVisible']) {
		__AutoComplete[id]['dropdown'].style.visibility = 'visible';
		__AutoComplete[id]['isVisible'] = true
	}
	if (__AutoComplete[id]['dropdown'].childNodes.length != numItems) {
		__AutoComplete[id]['highlighted'] = null
	}
};
function AutoComplete_HideDropdown(id) {
	if (__AutoComplete[id]['iframe']) {
		__AutoComplete[id]['iframe'].style.visibility = 'hidden'
	}
	__AutoComplete[id]['dropdown'].style.visibility = 'hidden';
	__AutoComplete[id]['highlighted'] = null;
	__AutoComplete[id]['isVisible'] = false
};
function AutoComplete_HideAll() {
	for (id in __AutoComplete) {
		AutoComplete_HideDropdown(id)
	}
};
function AutoComplete_HighlightItem(id, index) {
	if (index < 1) index = 1;
	if (__AutoComplete[id]['dropdown'].childNodes[index]) {
		for (var i = 0; i < __AutoComplete[id]['dropdown'].childNodes.length; ++i) {
			if (__AutoComplete[id]['dropdown'].childNodes[i].className == 'autocomplete_item_highlighted') {
				__AutoComplete[id]['dropdown'].childNodes[i].className = 'autocomplete_item'
			}
		}
		__AutoComplete[id]['dropdown'].childNodes[index].className = 'autocomplete_item_highlighted';
		__AutoComplete[id]['highlighted'] = index
	}
};
function AutoComplete_Highlight(id, index) {
	if (index == 1 && __AutoComplete[id]['highlighted'] == __AutoComplete[id]['dropdown'].childNodes.length - 1) {
		__AutoComplete[id]['dropdown'].childNodes[__AutoComplete[id]['highlighted']].className = 'autocomplete_item';
		__AutoComplete[id]['highlighted'] = null
	} else if (index == -1 && __AutoComplete[id]['highlighted'] == 1) {
		__AutoComplete[id]['dropdown'].childNodes[1].className = 'autocomplete_item';
		__AutoComplete[id]['highlighted'] = __AutoComplete[id]['dropdown'].childNodes.length
	}
	if (__AutoComplete[id]['highlighted'] == null) {
		__AutoComplete[id]['dropdown'].childNodes[1].className = 'autocomplete_item_highlighted';
		__AutoComplete[id]['highlighted'] = 1
	} else {
		if (__AutoComplete[id]['dropdown'].childNodes[__AutoComplete[id]['highlighted']]) {
			__AutoComplete[id]['dropdown'].childNodes[__AutoComplete[id]['highlighted']].className = 'autocomplete_item'
		}
		var newIndex = __AutoComplete[id]['highlighted'] + index;
		if (__AutoComplete[id]['dropdown'].childNodes[newIndex]) {
			__AutoComplete[id]['dropdown'].childNodes[newIndex].className = 'autocomplete_item_highlighted';
			__AutoComplete[id]['highlighted'] = newIndex
		}
	}
};
function AutoComplete_SetValue(id) {
	__AutoComplete[id]['element'].value = __AutoComplete[id]['dropdown'].childNodes[__AutoComplete[id]['highlighted']].innerHTML;
	if (__AutoComplete[id]['element'].value == "输入中文/拼音或 ↓ ↑ 选择 " || __AutoComplete[id]['element'].value == "对不起，找不到该地区！") {
		__AutoComplete[id]['element'].value = "";
		return false
	} else document.getElementById('geoindex').submit()
};
function AutoComplete_ScrollCheck(id) {
	if (__AutoComplete[id]['highlighted'] > __AutoComplete[id]['lastItemShowing']) {
		__AutoComplete[id]['firstItemShowing'] = __AutoComplete[id]['highlighted'] - (__AutoComplete[id]['maxitems'] - 1);
		__AutoComplete[id]['lastItemShowing'] = __AutoComplete[id]['highlighted']
	}
	if (__AutoComplete[id]['highlighted'] < __AutoComplete[id]['firstItemShowing']) {
		__AutoComplete[id]['firstItemShowing'] = __AutoComplete[id]['highlighted'];
		__AutoComplete[id]['lastItemShowing'] = __AutoComplete[id]['highlighted'] + (__AutoComplete[id]['maxitems'] - 1)
	}
	__AutoComplete[id]['dropdown'].scrollTop = __AutoComplete[id]['firstItemShowing'] * 15
};
function AutoComplete_KeyDown(id) {
	if (arguments[1] != null) {
		event = arguments[1]
	}
	var keyCode = event.keyCode;
	switch (keyCode) {
	case 13:
		if (__AutoComplete[id]['highlighted'] != null) {
			AutoComplete_SetValue(id);
			AutoComplete_HideDropdown(id)
		}
		event.returnValue = false;
		event.cancelBubble = true;
		break;
	case 27:
		AutoComplete_HideDropdown(id);
		event.returnValue = false;
		event.cancelBubble = true;
		break;
	case 38:
		if (!__AutoComplete[id]['isVisible']) {
			AutoComplete_ShowDropdown(id)
		}
		AutoComplete_Highlight(id, -1);
		AutoComplete_ScrollCheck(id, -1);
		AutoComplete_submitable();
		return false;
		break;
	case 9:
		if (__AutoComplete[id]['isVisible']) {
			AutoComplete_HideDropdown(id)
		}
		return;
	case 40:
		if (!__AutoComplete[id]['isVisible']) {
			AutoComplete_ShowDropdown(id)
		}
		AutoComplete_Highlight(id, 1);
		AutoComplete_ScrollCheck(id, 1);
		AutoComplete_submitable();
		return false;
		break
	}
};
function AutoComplete_KeyUp(id) {
	if (arguments[1] != null) {
		event = arguments[1]
	}
	var keyCode = event.keyCode;
	switch (keyCode) {
	case 13:
		event.returnValue = false;
		event.cancelBubble = true;
		break;
	case 27:
		AutoComplete_HideDropdown(id);
		event.returnValue = false;
		event.cancelBubble = true;
		break;
	case 38:
	case 40:
		return false;
		break;
	default:
		AutoComplete_ShowDropdown(id);
		break
	}
	AutoComplete_HighlightItem(id, 1)
};
function AutoComplete_isVisible(id) {
	return __AutoComplete[id]['dropdown'].style.visibility == 'visible'
};
function AutoComplete_submitable() {
	document.getElementById('autocomplete_btn').onclick = function() {
		AutoComplete_SetValue(__AutoComplete[id]['element'].getAttribute('id'));
		AutoComplete_HideDropdown(__AutoComplete[id]['element'].getAttribute('id'))
	};
	document.getElementById('geoindex').onsubmit = function() {
		return true
	}
};
function getXmlHttp() {
	var xmlhttp = null;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest()
	} else if (window.ActiveXObject) {
		var msxml = new Array('MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP');
		for (var i = 0; i < msxml.length; i++) {
			try {
				xmlhttp = new ActiveXObject(msxml[i]);
				break
			} catch(e) {}
		}
	}
	return xmlhttp
};
function getRemoteTextContent(url) {
	var xhr = getXmlHttp();
	xhr.open('GET', url, false);
	xhr.send(null);
	return xhr.responseText
};
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "")
};
String.prototype.ltrim = function() {
	return this.replace(/(^\s*)/g, "")
};
String.prototype.rtrim = function() {
	return this.replace(/(\s+$)/g, '%20')
};
var BrowserDetect = {
	init: function() {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS"
	},
	searchString: function(data) {
		for (var i = 0; i < data.length; i++) {
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1) return data[i].identity
			} else if (dataProp) return data[i].identity
		}
	},
	searchVersion: function(dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index + this.versionSearchString.length + 1))
	},
	dataBrowser: [{
		string: navigator.userAgent,
		subString: "MSIE",
		identity: "Explorer",
		versionSearch: "MSIE"
	}],
	dataOS: []
};
BrowserDetect.init();
function $(id) {
	return document.getElementById(id)
};
function login() {
	var formObj = document.all("loginForm");
	if (formObj) {
		if (formObj.login_id.value == "" || formObj.password.value == "") {
			alert("用户名或密码不能为空！");
			return false
		}
		formObj.submit()
	}
};
function changeLocation() {
	var changeLocation = $("changeLocation");
	if (changeLocation.style.display == "block") {
		changeLocation.style.display = "none"
	} else {
		changeLocation.style.display = "block"
	}
};
var link = 1;
function SetLinkVar() {
	if (link) {
		link = 0
	}
};
function ChangeListingColor_bg(s, i, j) {
	var colors = new Array("#ffffff", "#f9f9f9", "#fdfaeb");
	var color = colors[j];
	if (i) {
		s.style.backgroundColor = color
	} else {
		s.style.backgroundColor = '#f1fcff'
	}
};
function ChangeListingColor(s, i) {
	if (!i) {
		s.style.backgroundColor = ''
	} else {
		s.style.backgroundColor = '#f6ffce'
	}
};
var Class = {
	create: function() {
		return function() {
			this.initialize.apply(this, arguments)
		}
	}
};
Object.extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property]
	}
	return destination
};
var Scroller = Class.create();
Scroller.prototype = {
	initialize: function(idScroller, idScrollMid, idUl, options) {
		if (!$(idScroller) || !$(idScrollMid) || !$(idUl)) {
			return
		}
		var oScroll = this,
		oScroller = $(idScroller),
		oScrollMid = $(idScrollMid),
		ulHeight = $(idUl).offsetHeight;
		this.heightScroller = oScroller.offsetHeight;
		if (oScrollMid.offsetHeight < ulHeight) {
			oScrollMid.style.height = ulHeight + 'px'
		}
		this.heightList = oScrollMid.offsetHeight;
		if (this.heightList <= this.heightScroller) {
			return
		}
		var oUl = $(idUl);
		var lis = oUl.getElementsByTagName('li');
		var lisNum = lis.length;
		for (var i = 0; i < lisNum; i++) {
			var li = lis[i].cloneNode(true);
			oUl.appendChild(li)
		}
		this.oScroller = oScroller;
		this.timer = null;
		this.SetOptions(options);
		oScrollMid.onmouseover = function() {
			oScroll.Stop()
		};
		oScrollMid.onmouseout = function() {
			oScroll.Start()
		};
		if (this.options.PauseStep <= 0 || this.options.PauseHeight <= 0) this.options.PauseStep = this.options.PauseHeight = 0;
		this.Pause = 0;
		this.Start()
	},
	SetOptions: function(options) {
		this.options = {
			Step: 1,
			Time: 10,
			PauseHeight: 0,
			PauseStep: 2000
		};
		Object.extend(this.options, options || {})
	},
	Scroll: function() {
		var iScroll = this.oScroller.scrollTop,
		iHeight = this.heightList,
		time = this.options.Time,
		oScroll = this,
		iStep = this.options.Step;
		if (iScroll >= (iHeight * 2 - this.heightScroller)) {
			iScroll -= iHeight
		}
		if (this.options.PauseHeight > 0) {
			if (this.Pause >= this.options.PauseHeight) {
				time = this.options.PauseStep;
				this.Pause = 0
			} else {
				this.Pause += iStep;
				this.oScroller.scrollTop = iScroll + iStep
			}
		} else {
			this.oScroller.scrollTop = iScroll + iStep
		}
		this.timer = window.setTimeout(function() {
			oScroll.Scroll()
		},
		time)
	},
	Start: function() {
		this.Scroll()
	},
	Stop: function() {
		clearTimeout(this.timer)
	}
};
scrollerArray = new Array();
function newGoToPage(page, param) {
	var param = param ? param: '';
	var r = new RegExp("^[0-9]+$");
	var num = parseInt(document.getElementById("pagenum").value ? document.getElementById("pagenum").value: 1);
	if (!r.test(num) || num <= 0) {
		alert('页码必须是大于0的数字');
		document.getElementById("pagenum").value = "";
		return false
	}
	var totlenum = parseInt(document.getElementById("totlenum").value ? document.getElementById("totlenum").value: 0);
	switch (page) {
	case "listing":
		var url = document.getElementById("url").value ? document.getElementById("url").value: '';
		var ig = document.getElementById("ig").value ? document.getElementById("ig").value: '';
		var isNewUrl = document.getElementById("isNewUrl").value ? document.getElementById("isNewUrl").value: 0;
		var listingOrderNumber = document.getElementById("listingOrderNumber") != null ? document.getElementById("listingOrderNumber").value: 0;
		if (num > 1) {
			if (parseInt(isNewUrl) == 1) {
				if (num <= listingOrderNumber) {
					var pagenum = (num > totlenum) ? totlenum: num;
					url = url + '/' + pagenum + '/'
				} else {
					var pagenum = ((totlenum - num + 1) > 0) ? (totlenum - num + 1) : 1;
					url = url + '/index' + pagenum + '.html'
				}
			} else {
				var pagenum = ((totlenum - num + 1) > 0) ? (totlenum - num + 1) : 1;
				url = url + '/index' + pagenum + '.html' + ig
			}
		} else {
			url = url + '/';
			if (parseInt(isNewUrl) == 0) url = url + ig
		}
		window.location.href = url + param;
		break;
	case 'q':
		var url1 = document.getElementById("url1").value ? document.getElementById("url1").value: '';
		var url2 = document.getElementById("url2").value ? document.getElementById("url2").value: '';
		var pagenum = (num > totlenum) ? totlenum: num;
		if (pagenum == 1) {
			window.location.href = url1 + url2
		} else {
			window.location.href = url1 + pagenum + '/' + url2
		}
		break;
	case 'c':
		var url1 = document.getElementById("url1").value ? document.getElementById("url1").value: '';
		var pagenum = (num > totlenum) ? totlenum: num;
		window.location.href = url1 + pagenum + '/';
		break;
	case 'bestofedeng':
		var url1 = document.getElementById("url1").value ? document.getElementById("url1").value: '';
		var pagenum = (num > totlenum) ? totlenum: num;
		if (pagenum == 1) {
			window.location.href = url1
		} else {
			window.location.href = url1 + pagenum + '/'
		}
		break;
	case 'f':
		var url1 = document.getElementById("url1").value ? document.getElementById("url1").value: '';
		var pagenum = (num > totlenum) ? totlenum: num;
		if (pagenum == 1) {
			window.location.href = url1 + '1/'
		} else {
			window.location.href = url1 + pagenum + '/'
		}
		break;
	default:
		break
	}
};
function duo(i, flag) {
	var flag = flag ? flag: 2;
	if (i == '1') {
		document.getElementById('v' + flag + '_hotCity').className = "v" + flag + "_hotcity_class2";
		document.getElementById('gd_none').style.display = "none"
	} else {
		document.getElementById('v' + flag + '_hotCity').className = "v" + flag + "_hotcity_class1";
		document.getElementById('gd_none').style.display = "block"
	}
};
function getGeoCookie(name) {
	var start = document.cookie.indexOf(name + "=");
	var len = start + name.length + 1;
	if ((!start) && (name != document.cookie.substring(0, name.length))) {
		return null
	}
	if (start == -1) return null;
	var end = document.cookie.indexOf(';', len);
	if (end == -1) end = document.cookie.length;
	return unescape(document.cookie.substring(len, end))
};
function getUrlCookie(id) {
	return true
};
var adsxmlhttp_more = false;
try {
	adsxmlhttp_more = new ActiveXObject("Msxml2.XMLHTTP")
} catch(e) {
	try {
		adsxmlhttp_more = new ActiveXObject("Microsoft.XMLHTTP")
	} catch(e2) {
		adsxmlhttp_more = false
	}
}
if (!adsxmlhttp_more && typeof XMLHttpRequest != 'undefined') {
	adsxmlhttp_more = new XMLHttpRequest()
}
var _globalvar = null;
function tabCatMore(num, cur, catpar, catid, geoid, img, track, catpath) {
	track ? track: '';
	catpath ? catpath: '';
	var track_l = '';
	var track_flag = 0;
	if (track && catpath) {
		track_l = ' onClick="_gaq.push([\'c._trackEvent\', \'Listing Page\', \'Tabs\', \'' + catpath + '\'])"';
		track_flag = 1
	}
	if (_globalvar == null) {
		adsxmlhttp_more.open("GET", "/nf/tab_cat_more.php?geoid=" + geoid + "&catid=" + catid + "&catparid=" + catpar + "&imgtag=" + img + "&track_flag=" + track_flag + "&catpath=" + catpath, false);
		adsxmlhttp_more.send(null);
		_globalvar = adsxmlhttp_more.responseText
	}
	eval(_globalvar);
	var tabcat_num = tabcat_arr.length;
	if (cur >= tabcat_num) {
		cur = cur % tabcat_num
	}
	var rest_catnum = tabcat_num - cur;
	var tabcat_html1 = '';
	var tabcat_htmlm = '';
	var tabcat_htmlmf = '';
	var limit_num = num + cur - 1;
	var last_num = num + cur;
	if (last_num >= tabcat_num) last_num = last_num % tabcat_num;
	var j = 0,
	m = 0,
	k = 0,
	n = 0;
	if (rest_catnum >= num) {
		for (var i = cur; i <= limit_num; i++) {
			var tabcat_info = tabcat_arr[i].toString().split('::');
			if (tabcat_info[1] == catid) {
				continue
			}
			tabcat_html1 = tabcat_html1 + '<li><h2><a href="' + tabcat_info[5] + '"' + track_l + '>' + tabcat_info[3] + '</a></h2></li>';
			k++
		}
		if (k < num) {
			if (limit_num + 1 >= tabcat_num) {
				for (n = 0; n < tabcat_num; n++) {
					var tabcat_info = tabcat_arr[m].toString().split('::');
					if (tabcat_info[1] == catid) {
						continue
					} else {
						tabcat_html1 = tabcat_html1 + '<li><h2><a href="' + tabcat_info[5] + '"' + track_l + '>' + tabcat_info[3] + '</a></h2></li>';
						last_num = n + 1;
						break
					}
				}
			} else {
				for (n = limit_num + 1; n < tabcat_num; n++) {
					var tabcat_info = tabcat_arr[n].toString().split('::');
					if (tabcat_info[1] == catid) {
						continue
					} else {
						tabcat_html1 = tabcat_html1 + '<li><h2><a href="' + tabcat_info[5] + '"' + track_l + '>' + tabcat_info[3] + '</a></h2></li>';
						break
					}
				}
			}
		}
	} else {
		for (var i = cur; i <= tabcat_num; i++) {
			if (j >= num) {
				break
			}
			if (i == tabcat_num) {
				i = 0;
				last_num = num - m + 1
			} else {
				m++
			}
			var tabcat_info = tabcat_arr[i].toString().split('::');
			if (tabcat_info[1] == catid) {
				continue
			}
			tabcat_html1 = tabcat_html1 + '<li><h2><a href="' + tabcat_info[5] + '"' + track_l + '>' + tabcat_info[3] + '</a></h2></li>';
			j++
		}
	}
	tabcat_htmlm = '<li><a href="javascript:void(0);" onclick="tabCatMore(' + num + ',' + last_num + ',' + catpar + ',' + catid + ',' + geoid + ',' + img + ',' + track + ',\'' + catpath + '\');"> 更多>></a></li>';
	tabcat_htmlf = tabcat_html + tabcat_html1 + tabcat_htmlm;
	document.getElementById('tabCateName').innerHTML = tabcat_htmlf;
	tabcat_htmlf = '';
	tabcat_html1 = ''
};
function go(pageno) {
	try {
		pno = parseInt(pageno, 10)
	} catch(e) {
		pno = 1
	}
	if (pno < 1) pno = 1;
	try {
		pcount = parseInt(document.searchform.pagecount.value)
	} catch(e) {
		pcount = 0
	}
	if (pno < 1) pno = 1;
	document.searchform.pageno.value = pno;
	document.searchform.submit()
};
function goprev() {
	go(parseInt(document.searchform.pageno.value) - 1)
};
function gonext() {
	go(parseInt(document.searchform.pageno.value) + 1)
};
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "")
};
function sGo(fn, tp, ref_id) {
	var sform = document.forms[fn];
	var s_keyword = sform.key_title.value;
	var noallowchar = "";
	s_keyword = s_keyword.trim();
	if (s_keyword.indexOf("*") != -1) {
		s_keyword = s_keyword.replace(/(\**)/g, "");
		noallowchar = noallowchar + '‘*’'
	}
	if (s_keyword.indexOf("?") != -1) {
		s_keyword = s_keyword.replace(/(\?*)/g, "");
		noallowchar = noallowchar + '‘?’'
	}
	s_keyword = s_keyword.trim();
	var more_s_keyword = '';
	if (typeof(sform.more_key_title) != 'undefined' && sform.more_key_title.value != '' && sform.more_key_title.value != '输入地区或更多关键词') {
		more_s_keyword = sform.more_key_title.value;
		more_s_keyword = more_s_keyword.trim();
		if (more_s_keyword.indexOf("*") != -1) {
			more_s_keyword = more_s_keyword.replace(/(\**)/g, "");
			noallowchar = noallowchar + '‘*’'
		}
		if (more_s_keyword.indexOf("?") != -1) {
			more_s_keyword = more_s_keyword.replace(/(\?*)/g, "");
			noallowchar = noallowchar + '‘?’'
		}
		more_s_keyword = more_s_keyword.trim();
		more_s_keyword = ' AND ' + more_s_keyword
	}
	if (s_keyword && !strpos(s_keyword, '输入关键字试试')) {
		var newurl = tp ? sform.newurl.value: '/c/G';
		var sgid = tp ? sform.geo_id.value: 1;
		var scid = tp ? sform.cat_id.value: 0;
		var goURL = "";
		if (!sgid) {
			sgid = 1
		}
		if (!scid) {
			scid = 0
		}
		if (ref_id) {
			ref_str = "R" + ref_id
		} else {
			ref_str = ""
		}
		goURL = goURL + newurl + sgid + "C" + scid + ref_str + "/" + encodeURI(s_keyword + more_s_keyword);
		window.location.href = goURL ? goURL + "/": document.location.href
	} else {
		var alertmsg = "请输入搜索关键词";
		if (noallowchar != "") {
			alertmsg = alertmsg + ",且不要尝试" + noallowchar + "等非法字符。"
		}
		alert(alertmsg);
		sform.key_title.value = "";
		sform.key_title.focus()
	}
	return false
};
function checkKW(form, n, txt) {
	if (typeof(txt) == 'undefined') {
		txt = '想找什么？输入类别或关键字试试'
	}
	var kw = form;
	if (n == 0) {
		if (kw.value == '') {
			kw.value = txt
		}
	}
	if (n == 1) {
		if (kw.value == txt) {
			kw.value = ''
		}
	}
};
function more_fav(i) {
	if (i) {
		document.getElementById('more_fav').className = ' serch_lis_tit_r_m  more_fav_border';
		document.getElementById('menu_fav').style.display = 'block'
	} else {
		document.getElementById('more_fav').className = 'serch_lis_tit_r_m more_fav_border_no';
		document.getElementById('menu_fav').style.display = 'none'
	}
};
function strpos(haystack, needle, offset) {
	var i = (haystack + '').indexOf(needle, (offset ? offset: 0));
	return i === -1 ? false: i
};
function checkAutoKW(form, n, txt) {
	if (typeof(txt) == 'undefined') {
		txt = '中文/拼音'
	}
	var kw = document.getElementById(form);
	if (n == 0) {
		if (kw.value == '') {
			kw.value = txt
		}
	}
	if (n == 1) {
		document.getElementById('autogeodiv').style.display = "none";
		if (kw.value == txt) {
			kw.value = ''
		}
	}
};
function changeColor(obj, num) {
	if (num == 1) {
		obj.style.color = "#FFFFFF";
		obj.style.background = "#0A246A"
	}
	if (num == 0) {
		obj.style.color = "#000000";
		obj.style.background = "#FFFFFF"
	}
};
function getAutoGeo(id, catid) {
	var catid = catid ? catid: '';
	var query = '';
	if (catid) {
		query = '&catid=' + catid
	}
	var AXmlHttp = false;
	try {
		AXmlHttp = new ActiveXObject("Msxml2.XMLHTTP")
	} catch(e) {
		try {
			AXmlHttp = new ActiveXObject("Microsoft.XMLHTTP")
		} catch(e) {
			AXmlHttp = false
		}
	}
	if (!AXmlHttp && typeof XMLHttpRequest != 'undefined') {
		AXmlHttp = new XMLHttpRequest()
	}
	AXmlHttp.open("GET", "/nf/get_auto_geo.php?geoid=" + id + query + "&rom=" + Math.random(), true);
	AXmlHttp.send(null);
	AXmlHttp.onreadystatechange = function() {
		if (4 == AXmlHttp.readyState) {
			if (200 == AXmlHttp.status) {
				if (AXmlHttp.responseText) {
					document.getElementById("autogeodiv").innerHTML = AXmlHttp.responseText;
					document.getElementById("autogeodiv").style.display = "block"
				} else {
					document.getElementById("autogeodiv").style.display = "none"
				}
			} else {
				alert("发生错误!")
			}
		}
	}
};
function autoSetCookieSkip(urlvalue, type, geoid) {
	if (type == 2 || type == 3) {
		setGeoCookie("geo_skipurl", urlvalue, "geo_id", geoid, 30, "/", ".edeng.cn", "");
		location.href = urlvalue
	} else {
		location.href = urlvalue
	}
};
function setGeoCookie(name, value, geoname, geoval, expires, path, domain, secure) {
	var today = new Date();
	today.setTime(today.getTime());
	if (expires) {
		expires = expires * 1000 * 60 * 60 * 24
	}
	var expires_date = new Date(today.getTime() + (expires));
	document.cookie = name + '=' + escape(value) + ((expires) ? ';expires=' + expires_date.toGMTString() : '') + ((path) ? ';path=' + path: '') + ((domain) ? ';domain=' + domain: '') + ((secure) ? ';secure': '');
	document.cookie = geoname + '=' + geoval + ((expires) ? ';expires=' + expires_date.toGMTString() : '') + ((path) ? ';path=' + path: '') + ((domain) ? ';domain=' + domain: '') + ((secure) ? ';secure': '')
};
function getGeoCookie(name) {
	var start = document.cookie.indexOf(name + "=");
	var len = start + name.length + 1;
	if ((!start) && (name != document.cookie.substring(0, name.length))) {
		return null
	}
	if (start == -1) return null;
	var end = document.cookie.indexOf(';', len);
	if (end == -1) end = document.cookie.length;
	return unescape(document.cookie.substring(len, end))
};
function deleteGeoCookie(name, path, domain) {
	if (getGeoCookie(name)) document.cookie = name + '=' + ((path) ? ';path=' + path: '') + ((domain) ? ';domain=' + domain: '') + ';expires=Thu, 01-Jan-1970 00:00:01 GMT'
};
function getUrlCookie(id) {
	return true
};
var share = "<a href=\"javascript:u=location.href;t=document.title;c=%22%22+(window.getSelection?window.getSelection():document.getSelection?document.getSelection():document.selection.createRange().text);c=c.substr(0,480);var url=%22http://cang.baidu.com/do/add?it=%22+encodeURIComponent(t)+%22&iu=%22+encodeURIComponent(u)+%22&dc=%22+encodeURIComponent(c)+%22&fr=js#nw=1%22;window.open(url,'_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');void 0\"><span class=\'sc_g sc_baidu\'></span></a>  <a href=\"javascript:window.open('http:\/\/shuqian.qq.com\/post?from=3&title='+encodeURIComponent(document.title)+'&uri='+encodeURIComponent(document.location.href)+'&jumpback=2&noui=1','favit','width=930,height=470,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');void(0)\" title='收藏到QQ书签'><span class=\'sc_g sc_qq\'></span><\/a>  <a title='GOOGLe书签' href=\"javascript:window.open('http:\/\/www.google.com\/bookmarks\/mark?op=add&bkmk='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title));void(0)\" ><span class=\'sc_g sc_google\'></span><\/a>  <a href=\"javascript:window.open('http:\/\/myweb.cn.yahoo.com\/popadd.html?url='+encodeURIComponent(document.location.href)+'&title='+encodeURIComponent(document.title), 'Yahoo','scrollbars=yes,width=780,height=455,left=80,top=80,status=yes,resizable=yes');void(0)\"><span class=\'sc_g sc_yahoo\'></span><\/a>  <a href=\"javascript:d=document;t=d.selection?(d.selection.type!='None'?d.selection.createRange().text:''):(d.getSelection?d.getSelection():'');void(keyit=window.open('http:\/\/my.poco.cn\/fav\/storeIt.php?t='+escape(d.title)+'&u='+escape(d.location.href)+'&c='+escape(t)+'&img=http:\/\/www.h-strong.com\/blog\/logo.gif','keyit','scrollbars=no,width=475,height=575,status=no,resizable=yes'));keyit.focus();\" title=\"POCO网摘\"><span class=\'sc_g sc_poco\'></span><\/a> <a href=\"javascript:d=document;t=d.selection?(d.selection.type!='None'?d.selection.createRange().text:''):(d.getSelection?d.getSelection():'');void(vivi=window.open('http:\/\/vivi.sina.com.cn\/collect\/icollect.php?pid=28&title='+escape(d.title)+'&url='+escape(d.location.href)+'&desc='+escape(t),'vivi','scrollbars=no,width=480,height=480,left=75,top=20,status=no,resizable=yes'));vivi.focus();\" title=\"新浪ViVi\"><span class=\'sc_g sc_vivi\'></span><\/a> <a href=\"javascript:d=document;t=d.selection?(d.selection.type!='None'?d.selection.createRange().text:''):(d.getSelection?d.getSelection():'');void(keyit=window.open('http:\/\/www.365key.com\/storeit.aspx?t='+escape(d.title)+'&u='+escape(d.location.href)+'&c='+escape(t),'keyit','scrollbars=no,width=475,height=575,left=75,top=20,status=no,resizable=yes'));keyit.focus();\" title=\"365Key网摘\"><span class=\'sc_g sc_365key\'></span><\/a> <a href=\"javascript:d=document;t=d.selection?(d.selection.type!='None'?d.selection.createRange().text:''):(d.getSelection?d.getSelection():'');void(yesky=window.open('http:\/\/hot.yesky.com\/dp.aspx?t='+escape(d.title)+'&u='+escape(d.location.href)+'&c='+escape(t)+'&st=2','yesky','scrollbars=no,width=400,height=480,left=75,top=20,status=no,resizable=yes'));yesky.focus();\" title=\"天极网摘\"><span class=\'sc_g sc_yesky\'></span><\/a> <a href=\"javascript:t=document.title;u=location.href;e=document.selection?(document.selection.type!='None'?document.selection.createRange().text:''):(document.getSelection?document.getSelection():'');void(open('http:\/\/bookmark.hexun.com\/post.aspx?title='+escape(t)+'&url='+escape(u)+'&excerpt='+escape(e),'HexunBookmark','scrollbars=no,width=600,height=450,left=80,top=80,status=no,resizable=yes'));\" title=\"和讯网摘\"><span class=\'sc_g sc_hexun\'></span><\/a> <a href=\"javascript:d=document;t=d.selection?(d.selection.type!='None'?d.selection.createRange().text:''):(d.getSelection?d.getSelection():'');void(live=window.open('https:\/\/favorites.live.com\/quickadd.aspx?marklet=1&mkt=en-us&url='+escape(d.location.href)+'&title='+escape(d.title)+'&top=1','live','scrollbars=no,status=no,resizable=yes'));live.focus();\"><span class=\'sc_g sc_live\'></span><\/a>";
function SetSize(obj, width, height, valign) {
	myImage = new Image();
	myImage.src = obj.src;
	if (myImage.width > 0 && myImage.height > 0) {
		var rate = 1;
		if (myImage.width > width || myImage.height > height) {
			if (width / myImage.width < height / myImage.height) {
				rate = width / myImage.width
			} else {
				rate = height / myImage.height
			}
		}
		if (window.navigator.appName == "Microsoft Internet Explorer") {
			obj.style.zoom = rate
		} else {
			obj.width = myImage.width * rate;
			obj.height = myImage.height * rate
		}
	}
};
function hideError() {
	document.getElementById('searchCell-search-tooltip').style.display = "none"
};
function closePop() {
	document.getElementById('item_sek_box').style.visibility = 'hidden'
};
function getCookie(name) {
	var start = document.cookie.indexOf(name + "=");
	var len = start + name.length + 1;
	if ((!start) && (name != document.cookie.substring(0, name.length))) {
		return null
	}
	if (start == -1) return null;
	var end = document.cookie.indexOf(";", len);
	if (end == -1) end = document.cookie.length;
	return unescape(document.cookie.substring(len, end))
};
function isUserLogin() {
	var edengcookie = getCookie("edengcookie");
	if (!edengcookie) return false;
	var edengcookies = edengcookie.split(";;;");
	var _islogin = false;
	for (i = 0; i < edengcookies.length; i++) {
		var _ec = edengcookies[i].split(":=:");
		if (_ec[0] == "uid" && _ec[1] != "") {
			_islogin = true;
			break
		}
	}
	return _islogin
};
function changeCat(i) {
	for (var j = 1; j < 4; j++) {
		if (i == j) {
			document.getElementById('country' + j).style.display = "block";
			document.getElementById('table' + j).className = "selected black"
		} else {
			document.getElementById('country' + j).style.display = "none";
			document.getElementById('table' + j).className = ""
		}
	}
};
function changeTab(num, id) {
	for (var i = 1; i <= 5; i++) {
		if (i == num) {
			document.getElementById('ticketcontent' + id + '_' + num).style.display = "block";
			document.getElementById('tab' + id + '_' + num).className = "select"
		} else {
			if (document.getElementById('ticketcontent' + id + '_' + i) && document.getElementById('tab' + id + '_' + i)) {
				document.getElementById('ticketcontent' + id + '_' + i).style.display = "none";
				document.getElementById('tab' + id + '_' + i).className = ""
			}
		}
	}
};
function checkEmpty() {
	var start_city = document.getElementById('start_city').value;
	var end_city = document.getElementById('end_city').value;
	var start_date = document.getElementById('start_date').value;
	if (start_city != '' && end_city != '' && start_date != '') {
		return true
	}
	alert('请填写完整信息');
	return false
};
function checkver(form, n, txt) {
	if (typeof(txt) == 'undefined') {
		txt = '比如：12345'
	}
	var kw = form;
	if (n == 0) {
		if (kw.value == '') {
			kw.value = txt
		}
	}
	if (n == 1) {
		if (kw.value == txt) {
			kw.value = ''
		}
	}
};
function searchTicket(id) {
	var obj1 = document.getElementById('search_t1');
	var obj2 = document.getElementById('search_t2');
	var obj_t = document.getElementById('t_state');
	switch (id) {
	case 2:
		obj1.style.display = 'none';
		obj2.style.display = '';
		obj_t.value = 2;
		break;
	case 1:
	default:
		obj1.style.display = '';
		obj2.style.display = 'none';
		obj_t.value = 1;
		break
	}
};
function checkTicket(obj, num, txt) {
	if (num == 1) {
		if (obj.value == txt) {
			obj.value = ''
		}
	}
	if (num == 2) {
		if (obj.value == '') {
			obj.value = txt
		}
	}
};
function t_formcheck() {
	var t_fm = document.t_form;
	var t_state = t_fm.t_state;
	var url_str = '';
	var geoid = t_fm.t_geoid.value;
	var catid = t_fm.t_catid.value;
	var state = t_fm.t_state.value;
	var err = false;
	if (t_state.value == 1) {
		var t_to_v = t_fm.t_to.value.trim();
		var t_from_v = t_fm.t_from.value.trim();
		if (t_to_v == '' || t_from_v == '' || t_to_v == '请输入目的城市' || t_from_v == '请输入出发城市') {
			err = true;
			alert('起始站和终点站都不能为空！');
			return false
		} else {
			url_str = 'S' + state + '_C282_G' + geoid + '_F' + encodeURI(t_from_v) + '_T' + encodeURI(t_to_v) + '_M0_P0/'
		}
	} else if (t_state.value == 2) {
		var t_num_v = t_fm.t_num.value.trim();
		if (t_num_v == '' || t_num_v == '请输入车次') {
			err = true;
			alert('车次不能为空！');
			return false
		} else {
			url_str = 'S' + state + '_C282_G' + geoid + '_N' + encodeURI(t_num_v) + '_M0_P0/'
		}
	}
	if (!err) {
		window.location.href = '/nf/ticket/' + url_str;
		document.location.href
	}
	return false
};
function t_formcheck() {
	var t_fm = document.t_form;
	var t_state = t_fm.t_state;
	var url_str = '';
	var geoid = t_fm.t_geoid.value;
	var catid = t_fm.t_catid.value;
	var state = t_fm.t_state.value;
	var err = false;
	if (t_state.value == 1) {
		var t_to_v = t_fm.t_to.value.trim();
		var t_from_v = t_fm.t_from.value.trim();
		if (t_to_v == '' || t_from_v == '' || t_to_v == '请输入目的城市' || t_from_v == '请输入出发城市') {
			err = true;
			alert('起始站和终点站都不能为空！');
			return false
		} else {
			url_str = 'S' + state + '_C282_G' + geoid + '_F' + encodeURI(t_from_v) + '_T' + encodeURI(t_to_v) + '_M0_P0/'
		}
	} else if (t_state.value == 2) {
		var t_num_v = t_fm.t_num.value.trim();
		if (t_num_v == '' || t_num_v == '请输入车次') {
			err = true;
			alert('车次不能为空！');
			return false
		} else {
			url_str = 'S' + state + '_C282_G' + geoid + '_N' + encodeURI(t_num_v) + '_M0_P0/'
		}
	}
	if (!err) {
		var t_href = '/nf/ticket/' + url_str;
		window.open(t_href, '_blank')
	}
	return false
};
function c_formcheck() {
	var t_fm = document.t_form;
	var url_str = '';
	var geoid = t_fm.t_geoid.value;
	var catid = t_fm.t_catid.value;
	var err = false;
	var t_to_v = t_fm.t_to.value.trim();
	var t_from_v = t_fm.t_from.value.trim();
	if (t_to_v == '' || t_from_v == '' || t_to_v == '请输入目的城市' || t_from_v == '请输入出发城市') {
		err = true;
		alert('起始站和终点站都不能为空！');
		return false
	} else {
		url_str = 'C108_G' + geoid + '_F' + encodeURI(t_from_v) + '_T' + encodeURI(t_to_v) + '_M0_P0/'
	}
	if (!err) {
		var c_href = '/nf/carpool/' + url_str;
		window.open(c_href, '_blank')
	}
	return false
};
function addHandleEvent(obj, type, func) {
	if (obj.attachEvent) {
		obj.attachEvent('on' + type, func);
		return true
	} else if (obj.addEventListener) {
		obj.addEventListener(type, func, false);
		return true
	} else {
		return false
	}
};
function beginSelect(elem) {
	if (elem.className == "btn") {
		elem.className = "btn btnhover";
		elem.onmouseup = function() {
			this.className = "btn"
		}
	}
	var ul = elem.parentNode.parentNode;
	var li = ul.getElementsByTagName("li");
	var selectArea = li[li.length - 1];
	if (selectArea.style.display == "block") {
		selectArea.style.display = "none"
	} else {
		selectArea.style.display = "block";
		mouseoverBg(selectArea)
	}
};
function mouseoverBg(elem1) {
	var input = elem1.parentNode.getElementsByTagName("input")[0];
	var a = elem1.getElementsByTagName("a");
	var aLength = a.length;
	for (var i = 0; i < aLength; i++) {
		a[i].onmouseover = showBg;
		a[i].onmouseout = showBg;
		a[i].onclick = postText
	}
	function showBg() {
		this.className == "hover" ? this.className = " ": this.className = "hover"
	}
	function postText() {
		var selected = this.innerHTML;
		input.setAttribute("value", selected);
		elem1.style.display = "none"
	}
};
function checkSearch(form, n, txt) {
	if (typeof(txt) == 'undefined') {
		txt = '输入职位或公司名称'
	}
	var kw = form;
	if (n == 0) {
		if (kw.value == '') {
			kw.value = txt
		}
	}
	if (n == 1) {
		if (kw.value == txt) {
			kw.value = ''
		}
	}
};
function goToQpage(url) {
	var param = url ? url: '';
	var value = document.getElementById("postdata").value ? document.getElementById("postdata").value: '';
	window.location.href = url + value + '/'
};
function changeTab_rc(num, id, total) {
	var total = total ? total: 5;
	for (var i = 1; i <= total; i++) {
		if (i == num) {
			document.getElementById('rccontent' + id + '_' + num).style.display = "block";
			document.getElementById('tab' + id + '_' + num).className = "select"
		} else {
			if (document.getElementById('rccontent' + id + '_' + i) && document.getElementById('tab' + id + '_' + i)) {
				document.getElementById('rccontent' + id + '_' + i).style.display = "none";
				document.getElementById('tab' + id + '_' + i).className = ""
			}
		}
	}
};
function getMoreCat(cur, num, per) {
	var catstr = '';
	var per = per ? per: 8;
	var j = 1;
	for (k = 1; k <= num; k++) {
		document.getElementById('rccontent1_' + k).style.display = 'none'
	}
	var len = cur + per;
	for (var i = cur; i < len; i++) {
		if (i >= num) {
			len = len - num;
			i = 0
		}
		j = i + 1;
		catstr += '<li id="tab1_' + j + '" ' + (j == (cur + 1) ? 'class="select"': '') + ' onMouseOver="changeTab_rc(' + j + ',1,' + num + ')" ><a href="javascript:void(0);"><i>' + subcat_arr[i].catname + '</i></a></li>'
	}
	if ((cur + 1) >= num) cur = 0;
	catstr += '<li><a href="javascript:void(0)" onclick="getMoreCat(' + len + ',' + num + ',' + per + ')"><i>更多&raquo;</i></a></li>	';
	document.getElementById('rccontent1_' + (cur + 1)).style.display = 'block';
	document.getElementById('tabmorecat').innerHTML = catstr
};
var itemJump = {
	timer: null,
	se: null,
	needtrack: null,
	start: function(searchEngine, url, pagetype, needtrack, wait) {
		this.se = searchEngine;
		this.needtrack = needtrack;
		var searchKeyword = window.skw || '';
		var wait = wait || 10;
		var pagetype = pagetype || 'item';
		var dom = $('itemJump');
		if (dom) {
			var hint = {
				'item': '很遗憾，您访问的页面已经失效，建议您查阅关于<span class="keywordJump">' + searchKeyword + '</span>的最新信息，<span class="keywordSeconds" id="itemJumpCD">' + wait + '</span> 秒后我们为您切换到相关页面。<a href="' + url + '" onclick="itemJump.track(0)">马上查阅</a> <a href="javascript:;" onclick="itemJump.stop()">取消跳转</a>',
				'listing': '友情提示：您访问的页面已经刷新，您需要浏览最新信息吗？<span class="keywordSeconds" id="itemJumpCD">' + wait + '</span> 秒后我们将为您切换到最新页面。<a href="' + url + '" onclick="itemJump.track(0)">马上查阅</a> <a href="javascript:;" onclick="itemJump.stop()">取消跳转</a>'
			};
			var str = hint[pagetype];
			dom.innerHTML = str;
			dom.style.display = 'block';
			var me = this;
			var countdown = function() {
				var domCountdown = $('itemJumpCD');
				domCountdown.innerHTML = wait--;
				if (wait < 1) {
					addHandleEvent(window, 'unload',
					function() {
						me.track(2)
					});
					location.href = url
				}
			};
			this.timer = setInterval(countdown, 1000);
			var htmlStyle = $D.nowStyle(document.documentElement);
			var bodyStyle = $D.nowStyle(document.body);
			var ieRelative = (('relative' == htmlStyle.position.toLowerCase()) && ('relative' != bodyStyle.position.toLowerCase())) && $B.ie;
			var rect = $D.rect(dom);
			var rectBody = $D.rect(document.body);
			var originalTop = rect.top;
			var originalWidth = rect.right - rect.left;
			dom.style.position = 'absolute';
			dom.style.left = rect.left + 'px';
			dom.style.top = originalTop + 'px';
			var timerDom = null;
			var fixHint = function() {
				setTimeout(function() {
					dom.style.top = $D.getScrollTop() + originalTop + 'px';
					var bodyWidthNow = $D.getDocWidth();
					var styleLeft = (originalWidth < bodyWidthNow) ? Math.round((bodyWidthNow - originalWidth) / 2) : 0;
					if (ieRelative) {
						styleLeft = rect.left
					}
					dom.style.left = styleLeft + 'px'
				},
				100)
			};
			addHandleEvent(window, 'scroll', fixHint);
			addHandleEvent(window, 'resize', fixHint)
		}
	},
	stop: function() {
		var dom = $('itemJump');
		if (dom) {
			dom.style.display = 'none'
		}
		clearInterval(this.timer);
		this.track(1)
	},
	track: function(jump_type) {
		if (this.needtrack) {
			var param = {
				'jump_type': jump_type,
				'search_engine': this.se,
				'current_url': encodeURIComponent(location.href)
			};
			$HTTP.jsonp({
				'url': 'http://' + ED.domain + '/track_jump.php',
				'params': param
			})
		}
	}
};
var searchQFresh = function(theform) {
	if (theform.searchurl) {
		var url = theform.searchurl.value;
		var arrEle = theform.elements;
		for (var i = 1; i < arrEle.length; i++) {
			if ('B' == arrEle[i].name && arrEle[i].selectedIndex) {
				url += 'B' + arrEle[i].options[arrEle[i].selectedIndex].value
			}
			if ('I' == arrEle[i].name && arrEle[i].value) {
				url += 'I' + arrEle[i].value
			}
		}
		url += '/';
		location.href = url
	}
};
var setkeyval = function(id, num, total, nameid, val) {
	for (var i = 1; i <= total; i++) {
		if (num == i) {
			document.getElementById(id + num).className = "tsearch-tabs-active";
			document.getElementById("extsearch_keyword"+num).style.display = "inline-block";
		} else {
			document.getElementById(id + i).className = "";
			document.getElementById("extsearch_keyword"+i).style.display = "none";
		}
	}
	document.getElementById(nameid).value = val;
};
var TC = TC || {};
TC.tabToggle = function(prefix, num, total, tabClass, flag) {
	var flag = flag ? flag: '';
	tabClass = tabClass ? tabClass: 'selected';
	var total = total ? total: 5;
	for (var i = 1; i <= total; i++) {
		if (i == num) {
			$(prefix + '_con_' + num).style.display = "block";
			$(prefix + '_tab_' + num).className = tabClass;
			if (flag) {
				$('y1_' + num).style.display = 'block';
				$('y2_' + num).className = 'y2';
				$('y3_' + num).style.display = 'block'
			}
		} else {
			if ($(prefix + '_con_' + i) && $(prefix + '_tab_' + i)) {
				$(prefix + '_con_' + i).style.display = "none";
				$(prefix + '_tab_' + i).className = "";
				if (flag) {
					$('y1_' + i).style.display = 'none';
					$('y2_' + i).className = '';
					$('y3_' + i).style.display = 'none'
				}
			}
		}
	}
};
var searchGo2 = function() {
	var formObj = document.searchForm2;
	var key = formObj.search_title.value.trim();
	if (key == '' || key.indexOf('输入教育培训信息') != -1) {
		alert('请输入搜索关键词!');
		return false
	}
	var scid = formObj.cat_id.value;
	var sgid = formObj.geo_id.value;
	var ref_id = formObj.ref_id.value;
	var newurl = formObj.newurl.value;
	var goURL = "";
	if (!sgid) {
		sgid = 1
	}
	if (!scid) {
		scid = 0
	}
	if (ref_id != 0) {
		ref_str = "R" + ref_id
	} else {
		ref_str = ""
	}
	goURL = 'http://www.edeng.cn' + goURL + newurl + sgid + "C" + scid + ref_str + "/" + encodeURI(key);
	window.open(goURL ? goURL + "/": document.location.href)
};
TC.showBox = function() {
	$('category_box').style.display = 'block';
	$('category_shadow').style.display = 'block'
};
TC.closeBox = function() {
	$('category_box').style.display = 'none';
	$('category_shadow').style.display = 'none'
};
TC.delTag = function(obj) {
	obj.innerHTML = ''
};
TC.showThirdCat = function(id) {
	var third_str = '<span>二级分类</span>';
	if (all_cat.third[id]) {
		var third_cat = all_cat.third[id];
		for (var i in third_cat) {
			third_str += '<li><a href="javascript:;" ' + (third_cat[i].has_child ? 'class="choiceone" ': '') + ' onmouseover="TC.showForthCat(' + third_cat[i].id + ')"><input name="get_cat_id"  type="radio" value="' + third_cat[i].id + '" onclick="TC.setValue(this.value,\'' + third_cat[i].title + '\')" />' + third_cat[i].title + '</a></li>'
		}
	}
	$('third_cat').innerHTML = third_str
};
TC.showForthCat = function(id) {
	var forth_str = '<span style="width:212px">三级分类</span>';
	if (all_cat.forth[id]) {
		var forth_cat = all_cat.forth[id];
		for (var i in forth_cat) {
			forth_str += '<li><a href="javascript:;" ><input name="get_cat_id"  type="radio" value="' + forth_cat[i].id + '" onclick="TC.setValue(this.value,\'' + forth_cat[i].title + '\')" />' + forth_cat[i].title + '</a></li>'
		}
	}
	$('forth_cat').innerHTML = forth_str
};
TC.setValue = function(id, title) {
	$('show_cat_id').innerHTML = '<a href="javascript:;" id="show_cat_name">' + title + '</a><input type="hidden" name="show_cat_value" id="show_cat_value" value="' + id + '">'
};
TC.makeSure = function() {
	if ($('show_cat_value')) {
		$('cat_id').value = $('show_cat_value').value;
		$('cat_name').value = $('show_cat_name').innerHTML
	} else {
		$('cat_id').value = 32;
		$('cat_name').value = '教育网'
	};
	TC.closeBox()
}; (function() {
	var ie = !-[1, ];
	var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);
	var fn = [];
	var run = function() {
		for (var i = 0; i < fn.length; i++) fn[i]()
	};
	var d = document;
	d.ready = function(f) {
		if (!ie && !wk && d.addEventListener) return d.addEventListener('DOMContentLoaded', f, false);
		if (fn.push(f) > 1) return;
		if (ie)(function() {
			try {
				d.documentElement.doScroll('left');
				run()
			} catch(err) {
				setTimeout(arguments.callee, 0)
			}
		})();
		else if (wk) var t = setInterval(function() {
			if (/^(loaded|complete)$/.test(d.readyState)) clearInterval(t),
			run()
		},
		0)
	}
})();
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "")
};
var $$ = function(id) {
	return 'string' == typeof id ? document.getElementById(id) : id
};
var ED = ED || {};
ED.toggleHint = function(formitem, hintstr) {
	var active = document.activeElement;
	var defaultvalue = hintstr || formitem.defaultValue;
	var currentvalue = formitem.value;
	if ('' == currentvalue && active != formitem) {
		formitem.value = defaultvalue
	} else if (currentvalue == defaultvalue && active == formitem) {
		formitem.value = ''
	}
};
ED.getCookie = function(cookieName) {
	var allcookies = document.cookie;
	var reCookieExtract = new RegExp(cookieName + '=([^;]+);?');
	var cookieValue = '';
	var arrMatch;
	if (arrMatch = reCookieExtract.exec(allcookies)) {
		cookieValue = arrMatch[1]
	}
	return cookieValue
};
ED.session = ED.session || {};
ED.parseSessionCookie = function() {
	var sessionCookie = decodeURIComponent(ED.getCookie('edengcookie'));
	if ('' != sessionCookie) {
		var arrCookie = sessionCookie.split(';;;');
		for (var i = 0; i < arrCookie.length; i++) {
			var tmp = arrCookie[i].split(':=:');
			ED.session[tmp[0]] = tmp[1]
		}
	}
};
var HP = HP || {};
HP.popSearch = function(obj) {
	$$(obj).style.display = "block"
};
HP.setVal = function(obj) {
	$$('h_cat_id').value = obj.id;
	$$('click_btn').innerHTML = obj.innerHTML;
	$$('click_box').style.display = "none"
};
HP.strpos = function(haystack, needle, offset) {
	var i = (haystack + '').indexOf(needle, (offset ? offset: 0));
	return i === -1 ? false: i
};
HP.closePop = function(obj) {
	$$(obj).style.display = "none"
};
HP.showDiv = function(orgclass, toclass, orgobj, toobj) {
	$$(orgobj).className = $$(orgobj).className.replace(orgclass, toclass);
	$$(toobj).style.display = "block"
};
HP.closeDiv = function(orgclass, toclass, orgobj, toobj) {
	$$(orgobj).className = $$(orgobj).className.replace(toclass, orgclass);
	$$(toobj).style.display = "none"
};
HP.searchGo = function(fn, tp, ref_id) {
	var sform = document.forms[fn];
	var s_keyword = sform.key_title.value;
	var noallowchar = "";
	s_keyword = s_keyword.trim();
	if (s_keyword.indexOf("*") != -1) {
		s_keyword = s_keyword.replace(/(\**)/g, "");
		noallowchar = noallowchar + '‘*’'
	}
	if (s_keyword.indexOf("?") != -1) {
		s_keyword = s_keyword.replace(/(\?*)/g, "");
		noallowchar = noallowchar + '‘?’'
	}
	s_keyword = s_keyword.trim();
	if (s_keyword && !HP.strpos(s_keyword, '输入关键字试试')) {
		var newurl = tp ? sform.newurl.value: '/c/G';
		var sgid = tp ? sform.geo_id.value: 1;
		var scid = tp ? sform.cat_id.value: 0;
		var goURL = tp ? sform.gourl.value: "";
		if (!sgid) sgid = 1;
		if (!scid) scid = 0;
		if (ref_id) {
			ref_str = "R" + ref_id
		} else {
			ref_str = ""
		}
		goURL = goURL + newurl + sgid + "C" + scid + ref_str + "/" + encodeURI(s_keyword);
		window.location.href = goURL ? goURL + "/": document.location.href
	} else {
		var alertmsg = "请输入搜索关键词";
		if (noallowchar != "") {
			alertmsg = alertmsg + ",且不要尝试" + noallowchar + "等非法字符。"
		}
		alert(alertmsg);
		sform.key_title.value = "";
		sform.key_title.focus()
	}
	return false
};
var adsHomeValue = 0;
var adsxmlhttp = false;
try {
	adsxmlhttp = new ActiveXObject("Msxml2.XMLHTTP")
} catch(e) {
	try {
		adsxmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
	} catch(e2) {
		adsxmlhttp = false
	}
}
if (!adsxmlhttp && typeof XMLHttpRequest != 'undefined') {
	adsxmlhttp = new XMLHttpRequest()
}
function pageTurnAjax(num, action, geoid) {
	if (action == 'next') {
		adsHomeValue += num
	} else {
		adsHomeValue -= num
	}
	document.getElementById("adscode").innerHTML = '<div id="adsloading"><img src="http://img01.edeng.cn/images/blue/loading.gif" /></div>';
	adsxmlhttp.open("GET", "/nf/home_ads_2012.php?num=" + num + "&action=" + action + "&flag=" + adsHomeValue + "&geoid=" + geoid, true);
	adsxmlhttp.send(null);
	adsxmlhttp.onreadystatechange = function() {
		if (4 == adsxmlhttp.readyState) {
			if (200 == adsxmlhttp.status) {
				document.getElementById("adscode").innerHTML = adsxmlhttp.responseText
			} else {
				document.getElementById("adscode").innerHTML = '<div id="adsloading"><img src="http://img01.edeng.cn/images/blue/loading.gif" /></div>'
			}
		}
	}
};
var getFavor = function(uid, gid) {
	if ($$('menu_hover_box').style.display == 'none') {
		if ($$('myfeet').className.indexOf('hover') == -1) {
			$$('myfeet').className = $$('myfeet').className + ' hover'
		}
		$$('menu_hover_box').style.display = "block";
		if (!uid) {
			return false
		}
		document.getElementById("menu_hover").innerHTML = '加载中请稍候..';
		adsxmlhttp.open("GET", "/nf/user_favor.php?uid=" + uid + '&gid=' + gid + '&radom' + Math.random(), true);
		adsxmlhttp.send(null);
		adsxmlhttp.onreadystatechange = function() {
			if (4 == adsxmlhttp.readyState) {
				if (200 == adsxmlhttp.status) {
					if (adsxmlhttp.responseText != false) {
						var data = eval('(' + adsxmlhttp.responseText + ')');
						$$("menu_hover").innerHTML = data.data;
						if (data.state == 1) {
							$$('menu_hover_op').innerHTML = '<a class="btn_topmenu" target="_blank"  href="http://www.edeng.cn/code/bin/register/reg_cat.php?ms=my" id="menu_hover_op">修改关注</a>'
						} else if (data.state == 0) {
							$$('menu_hover_op').innerHTML = '<a class="btn_topmenu" target="_blank"  href="http://www.edeng.cn/code/bin/register/reg_cat.php?ms=my" id="menu_hover_op">添加关注</a>'
						}
					} else {
						$$("menu_hover").innerHTML = '您尚未登录'
					}
				} else {
					$$("menu_hover").innerHTML = '加载中请稍候..'
				}
			}
		}
	}
};
var getFavorOut = function(flag) {
	if (flag == 1) {
		if ($$('myfeet').className.indexOf('hover') == -1) {
			$$('myfeet').className = $$('myfeet').className + ' hover'
		}
		$$('menu_hover_box').style.display = "block"
	} else {
		$$('myfeet').className = $$('myfeet').className.replace('hover', '');
		$$('menu_hover_box').style.display = "none"
	}
};
var sUserAgent = window.navigator.userAgent;
var sUserHerf = window.location.href;
var sUserRefer = window.document.referrer;
var sUserRedirectUrl = '';
var sUserPageName = 'other';
var sMobileType = /(SymbianOS|SymbianOS|SonyEricsson|Android|Nokia|SAMSUNG|iPhone|MOT|WindowsCE|BlackBerry|SAM|WindowsMobile|softbank|KDDI|LG|SCH|MobilePhone|UTS|HTC|ZTE|SGH|philips|panasonic|alcatel|lenovo|cldc|midp|mobile|itouch|CoolPAD|Motorola|NEC)/i;
if (sUserHerf.indexOf('xinxi/') != -1) {
	sUserPageName = 'item'
} else if (sUserHerf.match(/(edeng\.cn\/?)$/)) {
	sUserPageName = 'home'
} else if (sUserHerf.match(/(edeng\.cn\/13\/|edeng\.cn\/33\/|edeng\.cn\/53\/|edeng\.cn\/63\/)/i)) {
	sUserPageName = 'listing'
} else {}
if (sUserRefer.indexOf('edeng.cn') == -1) {
	if (sUserAgent.match(sMobileType)) {
		if (sUserPageName == 'other') {
			sUserRedirectUrl = 'http://wap.edeng.cn'
		} else {
			if (sUserHerf.indexOf('www.edeng.cn') != -1) {
				sUserRedirectUrl = sUserHerf.replace('www', 'wap')
			} else if (sUserHerf.indexOf('wap.') == -1) {
				sUserRedirectUrl = sUserHerf.replace('http://', 'http://wap.')
			}
		}
	} else {}
	if (sUserRedirectUrl) {
		window.location.href = sUserRedirectUrl
	}
}
function sitebox(config) {
	var web_url = config.web_url;
	var my_edeng_file = config.my_edeng_file;
	adsxmlhttp.open("GET", my_edeng_file + '?m=sitebox&a=unread&radom' + Math.random());
	adsxmlhttp.send(null);
	adsxmlhttp.onreadystatechange = function() {
		if (4 == adsxmlhttp.readyState) {
			if (200 == adsxmlhttp.status) {
				if (adsxmlhttp.responseText != false) {
					var data = eval('(' + adsxmlhttp.responseText + ')');
					if (data.state == 100) {
						var unread = data.data.msg;
						if (unread > 0) {
							var div = document.createElement("div");
							div.className = "quickmenu left";
							var html = '<a href="' + web_url + my_edeng_file + '?m=sitebox&a=in" target="_blank">' + unread + '条未读信息</a><span class="sitebox"></span>';
							div.innerHTML = html;
							$$("session_info").insertBefore(div, $$("u_name_btn").nextSibling)
						}
					}
				}
			}
		}
	}
}
document.ready(function() {
	var makeSessionPostLink = function(link_id, user_id, config, geotrace, cattrace, title) {
		var domHousePost = $$(link_id);
		if (domHousePost) {
			var urlHousePost = config.post_msg_file + '?geotrace=' + geotrace + '&cattrace=' + cattrace;
//			var urlHousePost = config.code_dir + config.post_msg_file + '?geotrace=' + geotrace + '&cattrace=' + cattrace;
			if (0 == user_id) {
				urlHousePost = config.login_form_file + '?from=5&to=' + encodeURIComponent(urlHousePost)
			}
			urlHousePost = config.web_url + urlHousePost;
			domHousePost.href = urlHousePost;
			domHousePost.title = title
		}
	};
	var domToggle = $$('key_title');
	if (domToggle) {
		domToggle.onclick = function() {
			ED.toggleHint(this)
		};
		domToggle.onblur = function() {
			ED.toggleHint(this)
		}
	}
	if (window.ED) {
		var config = ED.config;
		var web_url = config.web_url;
		var msg = ED.msg;
		var geoid = msg.geoid;
		ED.parseSessionCookie();
		var user_id = ED.session.uid ? ED.session.uid: 0;
		var postFile = config.post_msg_file + '?geotrace=' + msg.geotrace + '&cattrace=' + msg.cattrace;
//		var postFile = config.code_dir + config.post_msg_file + '?geotrace=' + msg.geotrace + '&cattrace=' + msg.cattrace;
		var user_name = decodeURIComponent(ED.getCookie('login_id'));
		var domSession = $$('session_info');
		if (domSession) {
			var userpanel = '';
			if (user_id > 0) {
				userpanel += '<div class="quickmenu left nobg " id="myfeet"  ><a href="javascript:;" onmouseover="getFavor(' + user_id + ',' + geoid + ')">我的关注<span class="arrow"></span></a><div style="display:none;" id="menu_hover_box" class="hc" onmouseover="getFavorOut(1);" onmouseout="getFavorOut(0);"><p class="qucikmenu_title">您关注的分类：</p><ul id="menu_hover"></ul><label id="menu_hover_op"></label></div></div><div class="quickmenu left" id="myfeet"><a href="' + web_url + config.my_edeng_file + '?m=publish&a=shown" target="_blank">已发布的信息</a><span class="arrow"></span></div>';
				userpanel += '<div class="login left quickmenu spacing" id="u_name_btn" onmouseover = "HP.showDiv(\'quickmenu\',\'hover\',\'u_name_btn\',\'menu_hover_box3\')" onmouseout="HP.closeDiv(\'quickmenu\',\'hover\',\'u_name_btn\',\'menu_hover_box3\')" ><a  href="javascript:;"  >' + user_name + '</a><span class="arrow"></span><div id="menu_hover_box3" class="hc"  style="display:none;"><ul><li><a href="' + web_url + config.my_edeng_file + '" target="_blank">我的易登</a></li><li><a href="' + web_url + config.my_edeng_file + '?m=promotion&a=index" target="_blank">推广管理</a></li><li><a href="' + web_url + config.logout_file + '">退出</a></li></ul></div></div>'
			} else {
				userpanel += '<div class="quickmenu left nobg " id="myfeet" onmouseover="getFavor(' + user_id + ',' + geoid + ')" onmouseout="getFavorOut();"><a href="javascript:;" >我的关注<span class="arrow"></span></a><div style="display:none;" id="menu_hover_box" class="hc"><p class="qucikmenu_title">你还没有任何关注</p><ul id="menu_hover"><a class="btn_topmenu" target="_blank"  href="' + web_url +'/code/bin/login/login_form.php?a=' + geoid + '&f=' + encodeURIComponent(postFile) + '" id="menu_hover_op">添加关注</a></ul><label id="menu_hover_op"></label></div></div><div class="login left"><a target="_self" href="' + web_url +'/code/bin/login/login_form.php?a=' + geoid + '&f=' + encodeURIComponent(postFile) + '">登录</a></div><div class="register left"><a target="_self" href="' + web_url + config.register_user_file + '">注册</a></div>'
			}
			userpanel += '<div class="help left"><a target="_self" href="' + web_url + '/company/help_core.html"><font style="font-weight:bold;color:red">帮助</font></a></div>';
			domSession.innerHTML = userpanel;
			if (user_id > 0) {
				sitebox(config)
			}
		}
		makeSessionPostLink('COOKIE_FABU', user_id, config, msg.geotrace, msg.cattrace, msg.geotitle + '免费发布信息')
	}
});
var isIE = 0
/*@cc_on+1@*/
;
function adEffect() {
	var el = $$('fixed_ads');
	var isIE = !!window.ActiveXObject;
	var isIE6 = !-[1, ] && !window.XMLHttpRequest;
	var isIE7 = (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0") ? true: false;
	if (typeof el === "undefined" || el == null){
		return null;
	}
	var top = Math.max(el.parentNode.offsetTop, el.offsetTop);
	if (isIE6 || isIE7) {
		top = el.offsetTop + el.parentNode.parentNode.parentNode.offsetTop
	}
	function fexed() {
		var _top = Math.max(el.parentNode.offsetTop, el.offsetTop);
		if (getBodyTop() > top) {
			el.style.cssText = "position:fixed;top:0;left:50%;margin-left:291px;z-index:99;_position:absolute;_top:" + getBodyTop() + "px"
		} else {
			el.style.cssText = ""
		}
	}
	_addScroll(fexed)
}
_addLoadEvent(adEffect);
function getBodyTop() {
	return document.documentElement.scrollTop ? document.documentElement.scrollTop: document.body.scrollTop
}
function _addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func
	} else {
		window.onload = function() {
			oldonload();
			func()
		}
	}
}
function _addScroll(func) {
	var oldScroll = window.onscroll;
	if (typeof window.onscroll != 'function') {
		window.onscroll = func
	} else {
		window.onscroll = function() {
			oldScroll();
			func()
		}
	}
}