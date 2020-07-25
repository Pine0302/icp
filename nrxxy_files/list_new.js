ED.session = ED.session || {};
var parseSessionCookie = function(){
	var a = decodeURIComponent(getCookie('edengcookie'));
	if ('' != a) {
		var b = a.split(';;;');
		for ( var i = 0; i < b.length; i++) {
			var c = b[i].split(':=:');
			ED.session[c[0]] = c[1]
		}
	}
};

var getCookie = function(a){
	var b = document.cookie;
	var c = new RegExp(a + '=([^;]+);?');
	var d = '';
	var e;
	if (e = c.exec(b)) {
		d = e[1]
	}
	return d
}

$(function(){
	var l = ED.config;
	var m = l.web_url;
	var n = ED.msg;
	var o = n.geoid;
	parseSessionCookie();
	var p = ED.session.uid ? ED.session.uid : 0;
	var user_name = decodeURIComponent(getCookie('login_id'));
	var q = l.code_dir + l.post_msg_file + '?geotrace='
			+ n.geotrace + '&cattrace=' + n.cattrace;
	var r = $('#session_info_new');
	if (r) {
		var s = '<span class="top-b1"><img src="http://img01.edeng.cn/images/2014/top_03.png">搜索<div class="top-bx"><input type="text" id="kw"><button id="search">搜索</button></div></span>';
		if (p > 0) {
			s += '<span class="top-b2">我的关注<div class="top-by"><ul class="t-guan" id="t-guan"></ul></div></span>';
			s += '<div class="t-login"><i class="st"></i><a class="t-lx">'
					+ user_name
					+ '</a><div class="t-loginx"><ul><li><a href="'
					+ m
					+ l.my_edeng_file
					+ '" target="_blank">我的易登</a></li><li><a href="'
					+ m
					+ l.my_edeng_file
					+ '?m=promotion&a=index" target="_blank">推广管理</a></li><li><a href="'
					+ m
					+ l.logout_file
					+ '">退出</a></li></ul></div></div><i class="st"></i>'
		} else {
			s += '<div class="t-login"><a href="'
					+ m
					+ l.register_user_file
					+ '" target="_blank">注册</a></div><span class="top-b2"><a href="'
					+ m
					+ '/code/bin/login/login_form.php?a=' + o + '&f='
					+ encodeURIComponent(q)
					+ '">登录</a></span><div class="help"><i class="st"></i><a href="'+m+'/company/help_core.html">帮助</a> </div>'
		}
		r.html(s);
	}
	
	$(".top-b1").hover(function() {
		$(".top-bx").css('display', 'block');
	}, function() {
		$(".top-bx").css('display', 'none');
	});
	$(".top-b1").hover(function() {
		$(".top-bx").css('display', 'block');
	}, function() {
		$(".top-bx").css('display', 'none');
	});
	$(".top-b2").hover(function() {
		if(!p){
			return false
		}
		$.get("/nf/user_favor.php?uid=" + p + '&gid=' + o + '&radom' + Math.random(),"",function(json){
			if(json.data!=""){
				$("#t-guan").html(json.data+"<button id='focus' href='http://www.edeng.cn/code/bin/register/reg_cat.php?ms=my'>修改关注</button>");
			}else{
				$("#t-guan").html(json.data+"<button id='focus' href='http://www.edeng.cn/code/bin/register/reg_cat.php?ms=my'>添加关注</button>");
			}
			$("#focus").bind("click",function(){
				var _this = $(this),f_href = _this.attr("href");
				window.open(f_href);
			});
		},"JSON")
		$(".top-by").css('display', 'block');
	}, function() {
		$(".top-by").css('display', 'none');
	});
	$(".t-login").hover(function() {
		$(".t-loginx").css('display', 'block');
		$(".t-lx").addClass("nowx");
	}, function() {
		$(".t-loginx").css('display', 'none');
		$(".t-lx").removeClass("nowx");
	});
	
	$("#search").click(function(){
		var s_keyword = $("#kw").val(),ref_id = 1;
		if(s_keyword){
			var sgid = ED.msg.geoid ? ED.msg.geoid : 1;
			var newurl = $("#newurl")?$("#newurl").val() : '/c/G';
			var scid = $("#h_cat_id")?$("#h_cat_id").val() : 0;
			var goURL =$("gourl")?$("#gourl").val() : "";
			if (!sgid)
				sgid = 1;
			if (!scid)
				scid = 0;
			if (ref_id) {
				ref_str = "R" + ref_id
			} else {
				ref_str = ""
			}
			goURL = goURL + newurl + sgid + "C" + scid + ref_str + "/"
					+ encodeURI(s_keyword);
			window.location.href = goURL ? goURL + "/" : document.location.href
		}else{
			alert("请输入关键字!");
		}
	});
	
	$("#selfType,#allType").click(function(){
		var resume_u = "";
		if((window.location.href).indexOf("resume") > 0){
			var resume_u = "resume/";
		}
		var s_keyword = $("#kw_s").val(),ref_id = 1;
		if(s_keyword){
			var sgid = ED.msg.geoid ? ED.msg.geoid : 1;
			var newurl = $("#newurl")?$("#newurl").val() : '/c/G';
			var scid_r = $("#h_cat_id")?$("#h_cat_id").val() : 0;
			var scid = $("#pageCatId")?$("#pageCatId").val() : scid_r;
			var goURL =$("gourl")?$("#gourl").val() : "";
			if (!sgid)
				sgid = 1;
			if (!scid)
				scid = 0;
			if (ref_id) {
				ref_str = "R" + ref_id
			} else {
				ref_str = ""
			}
			goURL = goURL + newurl + sgid + "C" + scid + ref_str + "/"
					+ encodeURI(s_keyword);
			window.location.href = goURL ? goURL + "/" + resume_u : document.location.href + resume_u;
		}else{
			alert("请输入关键字!");
		}
	});
});



$(".m-c ul li:first").css('marginLeft', '20px');

//显示电话
$(".ys").one("click",function(){
	$(".ysl").css('display','block');
	$(this).css('display','none')
});

$(document).ready(function() {
	// 首先将#back-to-top隐藏
	$("#back-to-top").hide();
	// 当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
	$(function() {
		$(window).scroll(function() {
			if ($(window).scrollTop() > 100) {
				$("#back-to-top").fadeIn(500);
			} else {
				$("#back-to-top").fadeOut(500);
			}
		});
		// 当点击跳转链接后，回到页面顶部位置
		$("#back-to-top").click(function() {
			$('body,html').animate( {
				scrollTop : 0
			}, 1000);
			return false;
		});
	});
});

$("#ch-t").click(function() {
	var _this = $(this), t_check = !!_this.attr("checked"), url = _this.val();
	location.href = url;
});


/*广告滚动*/
$(function(){	
	var s=$('#float_scoll');
	if(s != null && s.offset() != null){
		var s_top=s.offset().top;
		var s_left=s.offset().left;	
		$(window).scroll(function(){
			var d_top=$(document).scrollTop();
			if(d_top>s_top){
				s.css({'position':'fixed','top':'0','left':s_left,'zIndex':'999'});
			}else{
				s.css('position','');
			}
		});		
	}
});

$(".mh-list").find("span").each(function(){
	w = $(this).width();
	for(i=0;i<8;i++){
		n = 1000-w-20; $(this).siblings(".list-z").css('width',n);
	}
});

$("#onlineads_top,#onlineads_mid,#onlineads_bottom").parent().hover(function(){ $(this).css('background','#FFF');});
