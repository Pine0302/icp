var win = window,
doc = document,
loc = win.location,
Conf = win.performance;
if (!win.StatEdeng) {
    win.StatEdeng = !0;
    null == win.String.prototype.trim && (win.String.prototype.trim = function() {
        return this.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
    });
    var edeng_sys = {
        curURL: loc.href,
        referrer: doc.referrer,
        protocol: loc.protocol,
        window_size: doc.documentElement.clientWidth + "x" + doc.documentElement.clientHeight,
        screen_size: win.screen.width + "," + win.screen.height,
        domain: function() {
            return ".edeng.cn";
        } (),
        setCookie: function() {
            if (!doc.cookie) return ! 1;
            var now_date = new Date;
            2 < arguments.length ? now_date.setTime(now_date.getTime() + 864E5 * arguments[2]) : now_date.setTime(now_date.getTime() + 18E5);
            2 <= arguments.length && (doc.cookie = arguments[0] + "=" + escape(arguments[1]) + "; expires=" + now_date.toGMTString() + "; domain=" + edeng_sys.domain + "; path=/")
        },
        getCookie: function(value) {
            if (!doc.cookie) return "";
            var flg;
            return (flg = doc.cookie.match(RegExp("(^| )" + value + "=([^;]*)(;|$)"))) ? unescape(flg[2]) : ""
        },
        ajaxsend: function(url) { (new Image).src = url
        },
        setLocalStorage: function(key, val) {
            try {
                win.localStorage && win.localStorage.setItem(key, val)
            } catch(d) {}
        },
        getLocalStorage: function(key) {
            try {
                return win.localStorage ? win.localStorage.getItem(key) : ""
            } catch(exception) {
                return ""
            }
        },
        getUUCode: function() {
            var val = "xxx-xxxxxx-xxx3xxx-gxxxxxxxxxx-xxxxx".replace(/[xy]/g,
            function(a) {
                var b = 16 * win.Math.random() | 0;
                return ("x" == a ? b: b & 3 | 8).toString(16)
            });
            this.setCookie("uu_code", val, 365);
            this.setLocalStorage("uu_code", val);
            return val;
        },
        getUUID: function(key) {
            var val = "xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
            function(a) {
                var b = 16 * win.Math.random() | 0;
                return ("x" == a ? b: b & 3 | 8).toString(16)
            }),
            val = this.getCookie(key) || this.getLocalStorage(key) || val;
            this.setCookie(key, val, 365);
            this.setLocalStorage(key, val);
            return val;
        },
        getRandom: function() {
            return win.Math.random()
        }
    },
    tracker = {
        config: {
            trackLog: {
                server: "track.edeng.cn/track.js.gif",
                allParams: "site_name tag referrer window_size user_id trackURL rand_id ed_ver".split(" "),
                uniqParams: ["tag", "rand_id"]
            }
        },
        getBaseInfo: function() {
            var site_name = win.site_name || "edeng",
            ed_ver = win.ed_ver || "1",
            now_user_id = win.user_id || "",
            reffere = win.encodeURIComponent(edeng_sys.referrer),
            curl = edeng_sys.curURL,
            uuid = edeng_sys.getUUID("ed_uuid"),
            uu_code = edeng_sys.getUUCode(),
            win_size = edeng_sys.window_size,
            winfo = win.____json4fe ? win.____json4fe: {},
            tpt = winfo._trackPagetype || "",
            turl = winfo._trackURL || "",
            wtrul = win._trackURL || turl || "NA",
            inf = {};
            try {
                inf = "NA" === wtrul ? {}: eval("(" + wtrul + ")")
            } catch(S) {
                inf = {}
            }

            var tpt = inf.pagetype || tpt || win.page_type || "NA";
            var is_new, pv_cnt;

            "" != edeng_sys.getCookie("new_session") ? (is_new = "0") : (is_new = "1");
            pv_cnt = "" != edeng_sys.getCookie("new_uv") ? parseInt(edeng_sys.getCookie("new_uv")) + ("0" == is_new ? 0 : 1) : 1;

            edeng_sys.setCookie("new_session", is_new);
            edeng_sys.setCookie("new_uv", pv_cnt, 365);

            var arr = [],
            u_index = wtrul.indexOf("{"),
            inf_list = {
                new_session: is_new,
                new_uv: pv_cnt,
                UUID: uuid,
            },
            H;
            for (H in inf_list) inf_list.hasOwnProperty(H) && arr.push("'" + H + "':'" + inf_list[H] + "'");
            arr.join(",");
            wtrul = "NA" !== wtrul && -1 !== u_index ? wtrul.substring(0, u_index + 1) + arr + "," + wtrul.substring(u_index + 1) : "{" + arr + "}";
            return {
                site_name: site_name,
                referrer: reffere,
                UUID: uuid,
                UUCODE: uu_code,
                user_id: now_user_id,
                pagetype: tpt,
                ed_ver: ed_ver,
                curURL: curl,
                window_size: win_size,
                trackURL: wtrul
            }
        },
        sendLog: function(key, info) {
            var base = this.baseInfo,
            config = this.config[key];
            if (key && config && info && "object" === typeof info) {
                for (var n = [], h = config.allParams, l = 0, m = h.length; l < m; l++){
                    n.push(h[l] + "=" + (info[h[l]] || base[h[l]] || ""));
                }
                edeng_sys.ajaxsend(edeng_sys.protocol + "//" + config.server + "?" + n.join("&"))
            }
        },
        trackPhoneLog: function(){
        	this.sendLog("trackLog", {
                tag: "clickphonestat",
                rand_id: edeng_sys.getRandom()
            });
        },
        trackMailLog: function(){
        	this.sendLog("trackLog", {
        		tag: "clickemailstat",
        		rand_id: edeng_sys.getRandom()
        	});
        },
        trackSNSLog: function(){
        	this.sendLog("trackLog", {
        		tag: "clicksnsstat",
        		rand_id: edeng_sys.getRandom()
        	});
        },
        trackLog: function() {
            this.sendLog("trackLog", {
                tag: "pvstat",
                rand_id: edeng_sys.getRandom()
            });
        }
    };
    tracker.baseInfo = tracker.getBaseInfo();
//    tracker.trackLog();
}
