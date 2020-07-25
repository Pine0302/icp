function aspmouseup(){
	var nowTime = new Date().getTime();
	document.getElementById("uptime").value = nowTime;
}
function aspmousedown(){
	var nowTime = new Date().getTime();
	document.getElementById("downtime").value = nowTime;
}
function redirect_sg(id){
	var nowSgUrl = document.getElementById("sg" + id).href;
	var pageSgKw = document.getElementById("page_kw").value;
	var nowSgPageUrl = window.location.href;

	glog_sg(nowSgUrl, pageSgKw, nowSgPageUrl);
}
function redirect(id){
	nowClickOrginId = id;
	
	var nowUrl = document.getElementById("asp" + id).href;
	nowClickOrginUrl = nowUrl;
	
	var downTime = document.getElementById("downtime").value
	var upTime = document.getElementById("uptime").value;
	var pageKw = document.getElementById("page_kw").value;

	
	nowUrl = nowUrl.replace('[TIME]', pageLoadTime);
	nowUrl = nowUrl.replace('[DOWN_TIME]', downTime);
	nowUrl = nowUrl.replace('[UP_TIME]', upTime);
	
	var nowPageUrl = window.location.href;

	glog(nowUrl, pageKw, nowPageUrl);
	document.getElementById("asp" + id).href = nowUrl;
	
	setTimeout(backToOrgin, 1000);
	_hmt.push(['_trackEvent', 'asp', 'click', pageKw]);
}

function backToOrgin(){
	document.getElementById("asp" + nowClickOrginId).href = nowClickOrginUrl;
}

var countimg = document.createElement('img');
var show_img = document.createElement('img');

var pageLoadTime = new Date().getTime();

var nowClickOrginId = '';
var nowClickOrginUrl = '';

function glog_sg(targeturl, kw, nowPageUrl){
	try {
		var catId = document.getElementById("pageCatId").value;
		var geoId = document.getElementById("pageGeoId").value;
		
		var url = 'http://www.edeng.cn/asp_click.php?channel=sg&k=' + encodeURIComponent(kw) + '&t='+encodeURIComponent(targeturl);
		url += '&u=' + encodeURIComponent(nowPageUrl) + "&g=" + geoId + "&c=" + catId;
		
		countimg.src = url;
	}catch(e){}
	
	return true;
}
function glog(targeturl, kw, nowPageUrl){
	try {
		var catId = document.getElementById("pageCatId").value;
		var geoId = document.getElementById("pageGeoId").value;
		
		var url = 'http://www.edeng.cn/asp_click.php?k=' + encodeURIComponent(kw) + '&t='+encodeURIComponent(targeturl);
		url += '&u=' + encodeURIComponent(nowPageUrl) + "&g=" + geoId + "&c=" + catId;
		
		countimg.src = url;
	}catch(e){}
	
	return true;
}
function showsglog(cnt, geoId, catId){
	try {
		var pageKw = document.getElementById("page_kw").value;
		var nowPageUrl = window.location.href;
		
		var url = 'http://www.edeng.cn/asp_show.php?channel=sg&k=' + encodeURIComponent(pageKw);
		url += '&n=' + cnt + "&c=" + catId + "&g=" + geoId;
		
		show_img.src = url;
	}catch(e){}
	
	return true;
}
function showasplog(cnt, geoId, catId){
	try {
		var pageKw = document.getElementById("page_kw").value;
		var nowPageUrl = window.location.href;
		
		var url = 'http://www.edeng.cn/asp_show.php?k=' + encodeURIComponent(pageKw);
		url += '&n=' + cnt + "&c=" + catId + "&g=" + geoId;
		
		countimg.src = url;
		
		if(cnt > 0){
			_hmt.push(['_trackEvent', 'asp', 'show', pageKw]);
		}
	}catch(e){}
	
	return true;
}
function showaspads(geoId, catId){
	$.ajax({
        url: "/asp_display.php",
        data: "g=" + geoId + "&c=" + catId,
        type: "GET",
        async : false,
        cache: false,
        success : function(data, textStatus) {
        	$("#topAspDiv").html(data);
		},
		error : function(data, textStatus) {
		}
    });
}