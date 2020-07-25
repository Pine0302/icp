var toshow=edeng_sys.getCookie('showads');
toshow = 1;
if(toshow != 1){
var exdate=new Date();exdate.setDate(exdate.getDate()+1);exdate.setHours(0);exdate.setMinutes(0);exdate.setSeconds(0);document.cookie="showads=1;expires="+exdate.toUTCString()+";path=/";
var now_geo=1;now_cat=0;docu_ref=encodeURI(document.referrer);
var tclick="http://www.edeng.cn/nf/async_ads.php?ch=1&click_type=1&ads=tickets&pagetype=home&g="+now_geo+"&c="+now_cat+"&docu_ref_url="+docu_ref+"&ucode="+tracker.baseInfo.UUID;
document.write("<div id=\"F_R_P_DIV\" style=\"display:none;background:#fff;width:200px; height:154px;font-size:12px;position:fixed;right:0;bottom:0;\">");
document.write("<div id=\"F_R_P_DIV_CLOSE\" style=\"line-height:32px;background:#f6f0f3;font-size:12px;padding:0 0 0 10px;\">");
document.write("<a id=\"falseRedPacket\" title=\"clise\" style=\"background:url(http://img01.edeng.cn/images/mobile/2icons.png) no-repeat -34px -3px;background-size:200px;position:absolute;right:3px;top:1px;width:24px; height:24px;color:#f00;cursor:pointer;\"></a>");
document.write("</div><div id=\"F_R_P_DIV_CONTENT\" style=\"cursor:pointer;\">");
document.write("<img src=\"http://img01.edeng.cn/images/blue/cp.png\" width=\"200px\" height=\"154px\">");
document.write("</div></div>");
function F_R_P_FARME(){this.apearTime=1000;this.hideTime=999999;this.delay=999999;this.showDiv();this.closeDiv()};
F_R_P_FARME.prototype={showDiv:function(time){if(!($.browser.msie&&($.browser.version=="6.0")&&!$.support.style)){$("#F_R_P_DIV").slideDown(this.apearTime).delay(this.delay).fadeOut(400)}else{$("#F_R_P_DIV").show();jQuery(function($j){$j("#F_R_P_DIV").positionFixed()})}},closeDiv:function(){$("#F_R_P_DIV_CONTENT").click(function(){event.preventDefault();event.stopPropagation();edeng_sys.ajaxsend(tclick);window.open('http://www.huitouzi8.com/?agent=700004');return false;});$("#falseRedPacket").click(function(){$("#F_R_P_DIV").hide();return false;})}};
var PACKET=new F_R_P_FARME();
var t="http://www.edeng.cn/nf/async_ads.php?ch=1&ads=tickets&pagetype=home&g="+now_geo+"&c="+now_cat+"&docu_ref_url="+docu_ref+"&ucode="+tracker.baseInfo.UUID;
edeng_sys.ajaxsend(t);
}
