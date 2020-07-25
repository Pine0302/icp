/**
 * Author  sihuan.huang
 * huangsihuan@360.cn
 */

(function(global){
    var _globals = global;

    function namespace(ns) {
        var a = ns.split("."),
            p = _globals, i;
        for (i = 0; i < a.length; i++) {
            p[a[i]] = p = p[a[i]] || {};
        }
        return p;
    }


    var  mediav = namespace("mediavnewsfeed"),_ = namespace('mediavnewsfeed.lang'),$mvUtil = namespace("mediavnewsfeed.util"),$sio = namespace("mediavnewsfeed.sio");

    //2017.9.4 add by wangguangbin
    var $j=namespace('mediavnewsfeed.jqlite');
    //=========LANG===============

    mediav.lang.isString = function(value) {
        return typeof value === 'string';
    }
    mediav.lang.isArray = function(a){
        return "[object Array]" == Object.prototype.toString.call(a)
    }  /**Array.isArray  ie8 not support**/

    mediav.lang.isFunction = function (value) {return typeof value === 'function'}

    mediav.lang.isUndefined = function(value) {return typeof value === 'undefined'}

    mediav.lang.isDefined = function(value) { return typeof value !== 'undefined'}

    mediav.lang.isObject = function(value) { return value !== null && typeof value === 'object'}
    mediav.lang.isBlankObject = function(value) {return value !== null && typeof value === 'object' && !getPrototypeOf(value)}

    mediav.lang.isNumber = function(value) {return typeof value === 'number';}
    mediav.lang.isArrayLike = function(obj) {
        if (obj == null || _.isWindow(obj)) return false;
        if (_.isArray(obj) || _.isString(obj) || (JQLite && obj instanceof JQLite)) return true;
        var length = 'length' in Object(obj) && obj.length;
        return _.isNumber(length) &&
            (length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item === 'function')
    }

    mediav.lang.isWindow = function(obj){return obj && obj.window === obj}

    mediav.lang.trim = function(value) {return _.isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value}  //ie9- not support value.trim()

    mediav.lang.lowercase = function(string) {return _.isString(string) ? string.toLowerCase() : string;}
    mediav.lang.uppercase = function(string) {return _.isString(string) ? string.toUpperCase() : string;}



    mediav.lang.slice = function(a,pos) { //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
        var b = [],
            l = a.length,
            p = pos || l,
            i;
        for (i = 0; i !== l && p > i; b.push(a[i++])) {}
        return b;
    }


    mediav.lang.concat = function(array1, array2, index) {
        return array1.concat(_.slice(array2,index) );
    }



    mediav.lang.forEach = function (obj, iterator, context) {
        var key, length;
        if (obj) {
            if (_.isFunction(obj)) {
                for (key in obj) {
                    if (key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            } else if (_.isArray(obj) || _.isArrayLike(obj)) {
                var isPrimitive = typeof obj !== 'object';
                for (key = 0, length = obj.length; key < length; key++) {
                    if (isPrimitive || key in obj) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            } else if (obj.forEach && obj.forEach !== _.forEach) {
                obj.forEach(iterator, context, obj);
            } else if (_.isObject(obj) && _.isNumber(obj.length)) {
                // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
                for (key in obj) {
                    iterator.call(context, obj[key], key, obj);
                }
            } else if (typeof obj.hasOwnProperty === 'function') {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            } else {
                for (key in obj) {
                    if (hasOwnProperty.call(obj, key)) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            }
        }
        return obj;
    }


    mediav.lang.now  = Date.now || function() {
        return   new Date().getTime();
    }
    mediav.lang.hash =  function (str) {
        var hash = 1,
            charCode = 0,
            idx;
        if(str){
            hash = 0;
            for(idx = str.length - 1; idx >= 0; idx--){
                charCode = str.charCodeAt(idx);
                hash = (hash << 6&268435455) + charCode+(charCode << 14);
                charCode = hash&266338304;
                hash = charCode != 0 ? hash ^ charCode>>21 : hash;
            }
        }
        return hash;
    }

    mediav.lang.Uid = function () {
        // var uid = mediav._uid;
        // if (uid) return uid;
        // mediav._fuid = 1; //dirty fix
        // var d = (new Date() - 0);
        // var s = window.location.href;
        // var hash = _.hash(s);
        // uid = "" + d + hash + Math.random() + Math.random() + Math.random() + Math.random();
        // uid = uid.replace(/\./g, "").substring(0, 32);
        // mediav._uid = uid;
        // return uid;

        function getHash (str) {
            var hash = 1,
                charCode = 0,
                idx;
            if(str){
                hash = 0;
                for(idx = str.length - 1; idx >= 0; idx--){
                    charCode = str.charCodeAt(idx);
                    hash = (hash << 6&268435455) + charCode+(charCode << 14);
                    charCode = hash&266338304;
                    hash = charCode != 0 ? hash ^ charCode>>21 : hash;
                }
            }
            return hash;
        }
        var currentTime = new Date();
        var timestamp = new Date(currentTime.toDateString()).getTime() + (currentTime.getHours() * 60 + parseInt(currentTime.getMinutes() / 5)) * 60 * 1000;
        return ("" + getHash(document.referrer) + timestamp + getHash(document.cookie.replace(/(?:(?:^|.*;\s*)v\s*\=\s*([^;]*).*$)|^.*$/, "$1"))).substr(0, 32);
    }

    function baseRandom(min, max) {
        return min + Math.floor( Math.random() * (max - min + 1));
    }

    mediav.lang.sample = function(collection, n) {
        var index = -1,
            result = collection,
            length = result.length,
            lastIndex = length - 1;

        n = Math.min(n < 0 ? 0 : (+n || 0), length);
        while (++index < n) {
            var rand = baseRandom(index, lastIndex),
                value = result[rand];

            result[rand] = result[index];
            result[index] = value;
        }
        result.length = n;
        return result;
    }


    mediav.lang.shuffle  = function (collection) {
        return _.sample(collection, Number.POSITIVE_INFINITY);
    }

    //===========SIO===============================

    mediav.sio._createScriptTag = function(scr, url, charset){
        scr.setAttribute('type', 'text/javascript');
        charset && scr.setAttribute('charset', charset);
        scr.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(scr);
    };

    mediav.sio._removeScriptTag = function(scr){
        if (scr.clearAttributes) {
            scr.clearAttributes();
        } else {
            for (var attr in scr) {
                if (scr.hasOwnProperty(attr)) {
                    delete scr[attr];
                }
            }
        }
        if(scr && scr.parentNode){
            scr.parentNode.removeChild(scr);
        }
        scr = null;
    };

    mediav.sio.callByBrowser = function (url, opt_callback, opt_options) {
        var scr = document.createElement("SCRIPT"),
            scriptLoaded = 0,
            options = opt_options || {},
            charset = options['charset'],
            callback = opt_callback || function(){},
            timeOut = options['timeOut'] || 0,
            timer;

        // IE和opera支持onreadystatechange
        // safari、chrome、opera支持onload
        scr.onload = scr.onreadystatechange = function () {
            // 避免opera下的多次调用
            if (scriptLoaded) {
                return;
            }

            var readyState = scr.readyState;
            if ('undefined' == typeof readyState
                || readyState == "loaded"
                || readyState == "complete") {
                scriptLoaded = 1;
                try {
                    callback();
                    clearTimeout(timer);
                } finally {
                    scr.onload = scr.onreadystatechange = null;
                    mediav.sio._removeScriptTag(scr);
                }
            }
        };

        if( timeOut ){
            timer = setTimeout(function(){
                scr.onload = scr.onreadystatechange = null;
                mediav.sio._removeScriptTag(scr);
                options.onfailure && options.onfailure();
            }, timeOut);
        }

        mediav.sio._createScriptTag(scr, url, charset);
    };

    mediav.sio.callByServer = /**@function*/function(url, callback, opt_options) {
        var scr = document.createElement('SCRIPT'),
            prefix = 'jsonp',
            callbackName,
            callbackImpl,
            options = opt_options || {},
            charset = options['charset'],
            queryField = options['queryField'] || 'callback',
            timeOut = options['timeOut'] || 0,
            timer,
            reg = new RegExp('(\\?|&)' + queryField + '=([^&]*)'),
            matches;
        if(_.isObject(queryField)){

            var result = [];
            _.forEach(queryField, function(val, key){
                result.push(key+'='+val)
            })
            queryField = result.join('&')+'&jsonp'
        }


        if (_.isFunction(callback)) {
            callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
            window[callbackName] = getCallBack(0);
        } else if(_.isString(callback)){
            callbackName = callback;
        } else {
            if (matches = reg.exec(url)) {
                callbackName = matches[2];
            }
        }

        if( timeOut ){
            timer = setTimeout(getCallBack(1), timeOut);
        }

        //如果用户在URL中已有callback，用参数传入的callback替换之
        url = url.replace(reg, '\x241' + queryField + '=' + callbackName);

        if (url.search(reg) < 0) {
            url += (url.indexOf('?') < 0 ? '?' : '&') + queryField + '=' + callbackName;
        }
        mediav.sio._createScriptTag(scr, url, charset);
        function getCallBack(onTimeOut){
            /*global callbackName, callback, scr, options;*/
            return function(){
                try {
                    if( onTimeOut ){
                        options.onfailure && options.onfailure();
                    }else{
                        clearTimeout(timer);
                        callback.apply(window, arguments);
                    }
                    window[callbackName] = null;
                    delete window[callbackName];
                } catch (exception) {
                    // ignore the exception
                } finally {
                    mediav.sio._removeScriptTag(scr);
                }
            }
        }
    };

    mediav.sio.log = function(url) {
        var img = new Image(),
            key = 'mediav_sio_log_' + Math.floor(Math.random() *
                2147483648).toString(36);
        window[key] = img;

        img.onload = img.onerror = img.onabort = function() {
            img.onload = img.onerror = img.onabort = null;

            window[key] = null;
            img = null;
        };

        img.src = url;
    }



    //=============================util================================
    mediav.util.supplant = function(template, values, pattern) {
        pattern = pattern || /\{([^\{\}]*)\}/g
        return template.replace(pattern, function(a, b) {
            var p = b.split('.'),
                r = values
            try {
                for (var s in p) {
                    if (p.hasOwnProperty(s) ) {
                        r = r[p[s]];
                    }
                }
            } catch (e) {
                r = a
            }
            return (typeof r === 'string' || typeof r === 'number') ? r : a
        })
    }

    mediav.util.isLeftClick = function (evt) {
        evt = evt || window.event;
        if ("buttons" in evt) {
            return evt.buttons == 1;
        }
        var button = evt.which || evt.button;
        return button == 1;   
    }



    //====================JQLITE=================

    //msie
    var msie = parseInt((/msie (\d+)/.exec(_.lowercase(navigator.userAgent)) || [])[1]  ,  10 );
    if (isNaN(msie)) {
        msie = parseInt( (/trident\/.*; rv:(\d+)/.exec(_.lowercase(navigator.userAgent)) || [])[1],  10);
    }

    var DASH_LOWERCASE_REGEXP = /-([a-z])/g,
        MS_HACK_REGEXP = /^-ms-/,
        NODE_TYPE_ELEMENT = 1,
        NODE_TYPE_ATTRIBUTE = 2,
        NODE_TYPE_TEXT = 3,
        NODE_TYPE_COMMENT = 8,
        NODE_TYPE_DOCUMENT = 9,
        NODE_TYPE_DOCUMENT_FRAGMENT = 11,
        BOOLEAN_ATTR = true,CLASS_ARRIBUTE = msie && msie < 8 ? 'className':'class',
        SINGLE_TAG_REGEXP = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
        HTML_REGEXP = /<|&#?\w+;/,
        TAG_NAME_REGEXP = /<([\w:-]+)/,
        XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
        wrapMap = {
            'option': [1, '<select multiple="multiple">', '</select>'],
            'thead': [1, '<table>', '</table>'],
            'col': [2, '<table><colgroup>', '</colgroup></table>'],
            'tr': [2, '<table><tbody>', '</tbody></table>'],
            'td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
            '_default': [0, '', '']
        };



    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    function cssKebabToCamel(name) {
        return kebabToCamel(name.replace(MS_HACK_REGEXP, 'ms-'));
    }
    function fnCamelCaseReplace(all, letter) {
        return letter.toUpperCase();
    }
    function kebabToCamel(name) {
        return name.replace(DASH_LOWERCASE_REGEXP, fnCamelCaseReplace);
    }


    var jqLite =  JQLite,jqCache = JQLite.cache = {},jqId = 1, jqName = JQLite.expando = 'mv-' + new Date().getTime(),

        addEventListenerFn = (window.document.addEventListener
            ? function(element, type, fn) {element.addEventListener(type, fn, false);}
            : function(element, type, fn) {element.attachEvent('on' + type, fn);}),
        removeEventListenerFn = (window.document.removeEventListener
            ? function(element, type, fn) {element.removeEventListener(type, fn, false); }
            : function(element, type, fn) {element.detachEvent('on' + type, fn); });

    function jqNextId() { return ++jqId; }

    function JQLite(element) {
        if (element instanceof JQLite) {
            return element;
        }
        var argIsString;
        if (_.isString(element)) {
            element = _.trim(element);
            argIsString = true;
        }
        if (!(this instanceof JQLite)) {
            if (argIsString && element.charAt(0) !== '<') {
                throw Error('nosel');
            }
            return new JQLite(element);
        }
        if (argIsString) {
            if(msie && msie > 8 ) jqLiteAddNodes(this, jqLiteParseHTML(element));
            else{
                var div = document.createElement('div');
                // Read about the NoScope elements here:
                // http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx
                div.innerHTML = '<div>&#160;</div>' + element; // IE insanity to make NoScope elements work!
                div.removeChild(div.firstChild); // remove the superfluous div
                jqLiteAddNodes(this, div.childNodes);
                var fragment = jqLite(document.createDocumentFragment());
                fragment.append(this); // detach the elements from the temporary DOM div.
            }
        } else if (_.isFunction(element)) {
            jqLiteReady(element);
        } else {
            jqLiteAddNodes(this, element);
        }
    }

    var JQLitePrototype = JQLite.prototype = {
        ready: jqLiteReady,
        toString: function() {
            var value = [];
            _.forEach(this, function(e) { value.push('' + e);});
            return '[' + value.join(', ') + ']';
        },
        eq: function(index) {
            return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
        },
        length: 0,
        push: [].push,
        sort: [].sort,
        splice: [].splice
    };


    function jqLiteReady(fn) {
        function trigger() {
            removeEventListenerFn(window.document,'DOMContentLoaded', trigger)
            removeEventListenerFn(window,'load', trigger)
            fn();
        }
        // check if document is already loaded
        if (window.document.readyState === 'complete') {
            window.setTimeout(fn);
        } else {
            // We can not use jqLite since we are not done loading and jQuery could be loaded later.
            // Works for modern browsers and IE9
            addEventListenerFn(window.document,'DOMContentLoaded', trigger);
            addEventListenerFn(window,'load', trigger);
        }
    }

    function jqLiteIsTextNode(html) {
        return !HTML_REGEXP.test(html);
    }

    function jqLiteBuildFragment(html, context) {
        var tmp, tag, wrap,
            fragment = context.createDocumentFragment(),
            nodes = [], i;
        if (jqLiteIsTextNode(html)) {
            // Convert non-html into a text node
            nodes.push(context.createTextNode(html));
        } else {
            // Convert html into DOM nodes
            tmp = fragment.appendChild(context.createElement('div'));
            tag = (TAG_NAME_REGEXP.exec(html) || ['', ''])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, '<$1></$2>') + wrap[2];

            // Descend through wrappers to the right content
            i = wrap[0];
            while (i--) {
                tmp = tmp.lastChild;
            }
            nodes = _.concat(nodes, tmp.childNodes);
            tmp = fragment.firstChild;
            tmp.textContent = '';
        }

        // Remove wrapper from fragment
        fragment.textContent = '';
        fragment.innerHTML = ''; // Clear inner HTML
        _.forEach(nodes, function(node) {
            fragment.appendChild(node);
        });
        return fragment;
    }


    function jqLiteParseHTML(html, context) {
        context = context || window.document;
        var parsed;

        if ((parsed = SINGLE_TAG_REGEXP.exec(html))) {
            return [context.createElement(parsed[1])];
        }
        if ((parsed = jqLiteBuildFragment(html, context))) {
            return parsed.childNodes;
        }
        return [];
    }

    function jqLiteAddNodes(root, elements) {
        if (elements) {
            // if a Node (the most common case)
            if (elements.nodeType) {
                root[root.length++] = elements;
            } else {
                var length = elements.length;
                // if an Array or NodeList and not a Window
                if (typeof length === 'number' && elements.window !== elements) {
                    if (length) {
                        for (var i = 0; i < length; i++) {
                            root[root.length++] = elements[i];
                        }
                    }
                } else {
                    root[root.length++] = elements;
                }
            }
        }
    }

    function jqLiteHasClass(element, selector) {
        if (!element.getAttribute) return false;
        return ((' ' + (element.getAttribute(CLASS_ARRIBUTE) || '') + ' ').replace(/[\n\t]/g, ' ').
        indexOf(' ' + selector + ' ') > -1);
    }

    function jqLiteRemoveClass(element, cssClasses) {
        if (cssClasses && element.setAttribute) {
            _.forEach(cssClasses.split(' '), function(cssClass) {

                element.setAttribute(CLASS_ARRIBUTE, _.trim(
                    (' ' + (element.getAttribute(CLASS_ARRIBUTE) || '') + ' ')
                        .replace(/[\n\t]/g, ' ')
                        .replace(' ' + _.trim(cssClass) + ' ', ' '))
                );
            });
        }
    }

    function jqLiteAddClass(element, cssClasses) {
        if (cssClasses && element.setAttribute) {
            var existingClasses = (' ' + (element.getAttribute(CLASS_ARRIBUTE) ||'') + ' ')
                .replace(/[\n\t]/g, ' ');

            _.forEach(cssClasses.split(' '), function(cssClass) {
                cssClass = _.trim(cssClass);
                if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
                    existingClasses += cssClass + ' ';
                }
            });
            element.setAttribute(CLASS_ARRIBUTE, _.trim(existingClasses));
        }
    }

    function jqLiteEmpty(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function jqLiteRemove(element, keepData) {
        var parent = element.parentNode;
        if (parent) parent.removeChild(element);
    }

    function jqLiteClone(element) {
        return element.cloneNode(true);
    }


    function jqLiteAttr(element, name, value) {
        var ret;
        var nodeType = element.nodeType;
        if (nodeType === NODE_TYPE_TEXT || nodeType === NODE_TYPE_ATTRIBUTE || nodeType === NODE_TYPE_COMMENT ||
            !element.getAttribute) {
            return;
        }

        var lowercasedName = _.lowercase(name);
        var isBooleanAttr = BOOLEAN_ATTR[lowercasedName];

        if (_.isDefined(value)) {
            // setter

            if (value === null || (value === false && isBooleanAttr)) {
                element.removeAttribute(name);
            } else {
                element.setAttribute(name, isBooleanAttr ? lowercasedName : value);
            }
        } else {
            // getter

            ret = element.getAttribute(name);

            if (isBooleanAttr && ret !== null) {
                ret = lowercasedName;
            }
            // Normalize non-existing attributes to undefined (as jQuery).
            return ret === null ? undefined : ret;
        }
    }


    function jqLiteData(element, key, value) {
        var data = jqLiteExpandoStore(element, 'data'),
            isSetter = _.isDefined(value),
            keyDefined = !isSetter && _.isDefined(key),
            isSimpleGetter = keyDefined && !_.isObject(key);

        if (!data && !isSimpleGetter) {
            jqLiteExpandoStore(element, 'data', data = {});
        }

        if (isSetter) {
            data[key] = value;
        } else {
            if (keyDefined) {
                if (isSimpleGetter) {
                    // don't create data in this case.
                    return data && data[key];
                } else {
                    extend(data, key);
                }
            } else {
                return data;
            }
        }
    }

    _.forEach({
        data: jqLiteData,
        removeAttr: function(element, name) {
            element.removeAttribute(name);
        },

        hasClass: jqLiteHasClass,
        css: function(element, name, value) {
            name = cssKebabToCamel(name);

            if (_.isDefined(value)) {
                element.style[name] = value;
            } else {
                var val;

                if (msie <= 8) {
                    // this is some IE specific weirdness that jQuery 1.6.4 does not sure why
                    val = element.currentStyle && element.currentStyle[name];
                    if (val === '') val = 'auto';
                }

                val = val || element.style[name];

                if (msie <= 8) {
                    val = (val === '') ? undefined : val;
                }

                return  val;
            }
        },

        attr: jqLiteAttr,

        prop: function(element, name, value) {
            if (_.isDefined(value)) {
                element[name] = value;
            } else {
                return element[name];
            }
        },

        text: (function() {

            var NODE_TYPE_TEXT_PROPERTY = [];
            if (msie < 9) {
                NODE_TYPE_TEXT_PROPERTY[1] = 'innerText';    /** Element **/
                NODE_TYPE_TEXT_PROPERTY[3] = 'nodeValue';    /** Text **/
            } else {
                NODE_TYPE_TEXT_PROPERTY[1] =                 /** Element **/
                    NODE_TYPE_TEXT_PROPERTY[3] = 'textContent';  /** Text **/
            }
            getText.$dv = '';
            return getText;

            function getText(element, value) {
                var textProp = NODE_TYPE_TEXT_PROPERTY[element.nodeType];
                if (_.isUndefined(value)) {
                    return textProp ? element[textProp] : '';
                }
                element[textProp] = value;
            }
        })(),

        val: function(element, value) {
            if (_.isUndefined(value)) {
                if (element.multiple && nodeName_(element) === 'select') {
                    var result = [];
                    _.forEach(element.options, function(option) {
                        if (option.selected) {
                            result.push(option.value || option.text);
                        }
                    });
                    return result;
                }
                return element.value;
            }
            element.value = value;
        },



        html: function(element, value) {
            if (_.isUndefined(value)) {
                return element.innerHTML;
            }
            element.innerHTML = value;
        },

        empty: jqLiteEmpty
    }, function(fn, name) {
        JQLite.prototype[name] = function(arg1, arg2) {
            var i, key;
            var nodeCount = this.length;
            if (fn !== jqLiteEmpty &&
                (_.isUndefined(   (fn.length === 2 && fn !== jqLiteHasClass) ? arg1 : arg2)  ) ){
                if (_.isObject(arg1)) {
                    for (i = 0; i < nodeCount; i++) {

                        if (fn === jqLiteData) {
                            // data() takes the whole object in jQuery
                            fn(this[i], arg1);
                        } else {
                            for (key in arg1) {
                                fn(this[i], key, arg1[key]);
                            }
                        }

                    }
                    // return self for chaining
                    return this;
                } else {
                    var value = fn.$dv;
                    // Only if we have $dv do we iterate over all, otherwise it is just the first element.
                    var jj = (_.isUndefined(value)) ? Math.min(nodeCount, 1) : nodeCount;;
                    for (var j = 0; j < jj; j++) {
                        var nodeValue = fn(this[j], arg1, arg2);
                        value = value ? value + nodeValue : nodeValue;
                    }
                    return value;
                }
            } else {
                for (i = 0; i < nodeCount; i++) {
                    fn(this[i], arg1, arg2);
                }
                return this;
            }
        };
    });

    function jqLiteWrapNode(node, wrapper) {
        var parent = node.parentNode;

        if (parent) {
            parent.replaceChild(wrapper, node);
        }

        wrapper.appendChild(node);
    }

    function createEventHandler(element, events) {
        var eventHandler = function (event, type) {
            if (!event.preventDefault) {
                event.preventDefault = function() {
                    event.returnValue = false; //ie
                };
            }
            if (!event.stopPropagation) {
                event.stopPropagation = function() {
                    event.cancelBubble = true; //ie
                };
            }
            if (!event.target) {
                event.target = event.srcElement || document;
            }

            if (_.isUndefined(event.defaultPrevented)) {
                var prevent = event.preventDefault;
                event.preventDefault = function() {
                    event.defaultPrevented = true;
                    prevent.call(event);
                };
                event.defaultPrevented = false;
            }
            event.isDefaultPrevented = function() {
                return event.defaultPrevented || event.returnValue === false;
            };

            _.forEach(events[type || event.type], function(fn) {
                fn.call(element, event);
            });
            // Remove monkey-patched methods (IE),
            // as they would cause memory leaks in IE8.
            if (msie <= 8) {
                // IE7/8 does not allow to delete property on native object
                event.preventDefault = null;
                event.stopPropagation = null;
                event.isDefaultPrevented = null;
            } else {
                // It shouldn't affect normal browsers (native methods are defined on prototype).
                delete event.preventDefault;
                delete event.stopPropagation;
                delete event.isDefaultPrevented;
            }
        };
        eventHandler.elem = element;
        return eventHandler;
    }


    function jqLiteOn(element, type, fn, unsupported){
        if (_.isDefined(unsupported)) throw Error('jqLite#on() does not support the `selector` or `eventData` parameters');
        var events = jqLiteExpandoStore(element, 'events'),
            handle = jqLiteExpandoStore(element, 'handle');
        if (!events) jqLiteExpandoStore(element, 'events', events = {});
        if (!handle) jqLiteExpandoStore(element, 'handle', handle = createEventHandler(element, events));

        _.forEach(type.split(' '), function(type){
            var eventFns = events[type];

            if (!eventFns) {
                if (type == 'mouseenter' || type == 'mouseleave') {
                    var contains = document.body.contains || document.body.compareDocumentPosition ?
                        function( a, b ) {
                            // jshint bitwise: false
                            var adown = a.nodeType === 9 ? a.documentElement : a,
                                bup = b && b.parentNode;
                            return a === bup || !!( bup && bup.nodeType === 1 && (
                                adown.contains ?
                                    adown.contains( bup ) :
                                    a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
                            ));
                        } :
                        function( a, b ) {
                            if ( b ) {
                                while ( (b = b.parentNode) ) {
                                    if ( b === a ) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };

                    events[type] = [];
                    // Refer to jQuery's implementation of mouseenter & mouseleave
                    // Read about mouseenter and mouseleave:
                    // http://www.quirksmode.org/js/events_mouse.html#link8
                    var eventmap = { mouseleave : "mouseout", mouseenter : "mouseover"};
                    jqLiteOn(element, eventmap[type], function(event) {
                        var target = this, related = event.relatedTarget;
                        // For mousenter/leave call the handler if related is outside the target.
                        // NB: No relatedTarget if the mouse left/entered the browser window
                        if ( !related || (related !== target && !contains(target, related)) ){
                            handle(event, type);
                        }
                    });

                } else {
                    addEventListenerFn(element, type, handle);
                    events[type] = [];
                }
                eventFns = events[type];
            }
            eventFns.push(fn);
        });
    }

    function jqLiteOff(element, type, fn, unsupported) {
        if (_.isDefined(unsupported)) throw Error('jqLite#off() does not support the `selector` argument');

        var events = jqLiteExpandoStore(element, 'events'),
            handle = jqLiteExpandoStore(element, 'handle');

        if (!handle) return; //no listeners registered

        if (_.isUndefined(type)) {
            _.forEach(events, function(eventHandler, type) {
                removeEventListenerFn(element, type, eventHandler);
                delete events[type];
            });
        } else {
            _.forEach(type.split(' '), function(type) {
                if (_.isUndefined(fn)) {
                    removeEventListenerFn(element, type, events[type]);
                    delete events[type];
                } else {
                    _.arrayRemove(events[type] || [], fn);
                }
            });
        }
    }

    function jqLiteExpandoStore(element, key, value) {
        var expandoId = element[jqName],
            expandoStore = jqCache[expandoId || -1];
        if (_.isDefined(value)) {
            if (!expandoStore) {
                element[jqName] = expandoId = jqNextId();
                expandoStore = jqCache[expandoId] = {};
            }
            expandoStore[key] = value;
        } else {
            return expandoStore && expandoStore[key];
        }
    }

    _.forEach({

        selector :function(element,e) {
            var elm =  element || document
            return (typeof(elm) === "undefined") ? e : (elm.querySelectorAll ? elm.querySelectorAll(e) : (e.charAt(0) === "#") ? elm.getElementById(e.substr(1)) : getByClass(e,elm)) ;
        },
        on: jqLiteOn,
        off: jqLiteOff,
        triggerHandler: function(element, eventName, eventData) {
            var eventFns = (jqLiteExpandoStore(element, 'events') || {})[eventName];
            eventData = eventData || {};
            eventData.preventDefault =  $mvUtil.noop;
            eventData.stopPropagation = $mvUtil.noop;
            var event = [eventData];
            _.forEach(eventFns, function(fn) {
                fn.apply(element, event.concat(event));
            });
        },
        replaceWith: function(element, replaceNode) {
            var index, parent = element.parentNode;
            _.forEach(new JQLite(replaceNode), function(node) {
                if (index) {
                    parent.insertBefore(node, index.nextSibling);
                } else {
                    parent.replaceChild(node, element);
                }
                index = node;
            });
        },
        children: function(element) {
            var children = [];
            _.forEach(element.childNodes, function(element) {
                if (element.nodeType === NODE_TYPE_ELEMENT) {
                    children.push(element);
                }
            });
            return children;
        },

        contents: function(element) {
            return element.contentDocument || element.childNodes || [];
        },

        append: function(element, node) {
            var nodeType = element.nodeType;
            if (nodeType !== NODE_TYPE_ELEMENT && nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT) return;

            node = new JQLite(node);

            for (var i = 0, ii = node.length; i < ii; i++) {
                var child = node[i];
                element.appendChild(child);
            }
        },
        prepend: function(element, node) {
            if (element.nodeType === NODE_TYPE_ELEMENT) {
                var index = element.firstChild;
                _.forEach(new JQLite(node), function(child) {
                    element.insertBefore(child, index);
                });
            }
        },
        wrap: function(element, wrapNode) {
            jqLiteWrapNode(element, jqLite(wrapNode).eq(0).clone()[0]);
        },
        remove: jqLiteRemove,
        detach: function(element) {
            jqLiteRemove(element, true);
        },
        after: function(element, newElement) {
            var index = element, parent = element.parentNode;

            if (parent) {
                newElement = new JQLite(newElement);

                for (var i = 0, ii = newElement.length; i < ii; i++) {
                    var node = newElement[i];
                    parent.insertBefore(node, index.nextSibling);
                    index = node;
                }
            }
        },
        addClass: jqLiteAddClass,
        removeClass: jqLiteRemoveClass,
        toggleClass: function(element, selector, condition) {
            if (selector) {
                _.forEach(selector.split(' '), function(className) {
                    var classCondition = condition;
                    if (_.isUndefined(classCondition)) {
                        classCondition = !jqLiteHasClass(element, className);
                    }
                    (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
                });
            }
        },
        parent: function(element) {
            var parent = element.parentNode;
            return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
        },
        next: function(element) {
            if (element.nextElementSibling) {
                return element.nextElementSibling;
            }
            // IE8 doesn't have nextElementSibling
            var elm = element.nextSibling;
            while (elm != null && elm.nodeType !== 1) {
                elm = elm.nextSibling;
            }
            return elm;
        },
        find: function(element, selector) {
            if (element.getElementsByTagName) {
                return element.getElementsByTagName(selector);
            } else {
                return [];
            }
        },
        clone: jqLiteClone,

        getClosest: function (el, s, type) {
            type = type || 'class';
            if (!el) return null;

            do {
                if (type === 'class' && jqLiteHasClass(el,s)) {
                    return el;
                }else if(type === 'tag' &&  el.nodeName === _.uppercase(s) ){
                    return el;
                }
            } while (el = el.parentNode);

            return null;
        },
        offset:function(el){
            var docElem, win,
                box = { top: 0, left: 0 },
                doc = el && el.ownerDocument;
            win = getWindow( doc );
            return {
                top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
                left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
            }
        }
    }, function(fn, name) {

        JQLite.prototype[name] = function(arg1, arg2, arg3) {
            var value;
            for (var i = 0, ii = this.length; i < ii; i++) {

                if (_.isUndefined(value)) {
                    value = fn(this[i], arg1, arg2, arg3);
                    if (_.isDefined(value)) {
                        value = jqLite(value);
                    }
                } else {
                    jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
                }
            }
            return _.isDefined(value) ? value : this;
        };
    });

    jqLite.fn = JQLitePrototype;

    //2017.9.4 add by wangguangbin
    mediav.jqlite.JQLite = JQLite;

})(window);


