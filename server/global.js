/*!
 * 全局js
 * @authors supmain (mtingfeng@gmail.com)
 * @date    2015-09-10 12:28:31
 * @version $Id$
 */
define("global",["jquery","hrjia_dialog"],function(require,exports,module){
    var $ = require("jquery") ;
        hrjia_dialog = require("hrjia_dialog") ;
    var global = {
        init: function(){
            this.checkScreen();
            this.globalAjaxSettings();
            this.userNavigatorBar();
            this.jqPlugin() ;
        } ,
        // 低分辨率
        checkScreen: function(){
            var width = screen.width ;
            if( width <= 1024 ){
                $("html").addClass( "isw1000" );
            }
        } ,
        // 全局ajax错误设置
        globalAjaxSettings: function(){
            // 全局ajax错误设置
            $( document ).ajaxError(function( ev , jqxhr , ajaxSettings , thrownError) {
                if( jqxhr.status == 401 && thrownError.toLowerCase() == "unauthorized" ){
                    hrjia_dialog.warn('您尚未登录或者登录超时，请前往登录',function(){
                        location.href = "/";
                    }) ;
                }
                else{
                    var responseJSON = jqxhr.responseJSON ;
                    if( responseJSON && responseJSON.title ){           // 必须这样写，防止responJSON为空，导致获取title失败报错。
                        hrjia_dialog.warn( responseJSON.title ) ;
                    }
                }
            });
        },
        // 用户状态栏
        userNavigatorBar: function(){
            var timer = null ,
                $bar = $(".hd_bar") ;
            // 二级菜单
            $bar.on("mouseenter",".main_menu",function(){
                var $this = $(this) ;
                timer = setTimeout(function(){
                    $this.addClass( 'hover' );
                    timer = null;
                },300);
            }).on("mouseleave",".main_menu",function(){
                var $this = $(this) ;
                timer === null ? timer = setTimeout(function(){
                    $this.removeClass( 'hover' );
                },300) : clearTimeout( timer );
            }) ;
            // 通知消息
            var url_notification_count = "/v1.0/notification/count" ;
            var notification = {
                    $container: $("#unread_msg") ,
                    noMsg: function(){
                        var $container = this.$container ,
                            $icon = $container.find(".icon_msg") ,
                            $unread_num = $container.find("#unread_num") ,
                            title = '您当前没有未读的通知' ;
                        $container.attr( "title" , title ) ;
                        $icon.addClass("read") ;
                        $unread_num.hide() ;
                    } ,
                    hasMsg: function( num ){
                        num = Number( num ) ;
                        var $container = this.$container ,
                            $icon = $container.find(".icon_msg") ,
                            $unread_num = $container.find("#unread_num").removeClass("thousands") ,
                            numReg = /^[0-9]\d*$/ ,
                            text = '' ,
                            title = '' ;
                        if( !numReg.test( num ) ) { this.noMsg() ; return false ; }
                        if( num == 0 ){
                            this.noMsg() ; return false ;
                        }else if( num > 0 && num <= 999 ){
                            text = num ;
                        }else{
                            $unread_num.addClass("thousands") ;
                            text = '...';
                        }
                        title = '您当前共有' + num + '条未读的通知' ;
                        $container.attr( "title" , title ) ;
                        $icon.removeClass("read") ;
                        $unread_num.text( text ).show() ;
                    }
                } ;
            var isNotofication = (function() {
                var href = location.href ,
                    flag = true ;
                if( href.indexOf("openrecruit") >= 0 ){ flag = false ; }    // 企业注册
                if( href.indexOf("register") >= 0 ){ flag = false ; }       // 个人注册
                if( href.indexOf("forgetpassword") >= 0 ){ flag = false ; } // 忘记密码

                return flag ;
            })();
            if( isNotofication ){
                // $.ajax( {
                //     type: "get" ,
                //     url: url_notification_count ,
                //     data: null ,
                //     dataType: "json" ,
                //     success: function( data ){
                //         var unread_count = data.not_read_count ;
                //         notification.hasMsg( unread_count ) ;
                //     }
                // } ) ;
            }
        } ,
        // 帮助栏
        helpTools: {
            init: function( callback ){
                var $hrjia_tools = $( '<div class="hrjia_tools"><div class="wrap go2top_wrap"><a class="go2top" href="javascript:void(0);" title="回到顶部"><span></span><p>回到顶部</p></a></div><div class="wrap help_wrap"><a class="help" href="javascript:void(0);" title="获取帮助"><span></span><p>获取帮助</p></a><div class="hrjia_barcode"><img src="/static/images/kong.gif" /><ul><li>有问题也可直接留言哦~</li><li>我们会在一个工作日内回复~</li></ul></div></div></div>' ) ,
                    $go2top_wrap = $hrjia_tools.find( ".go2top_wrap" ),
                    $hrjia_barcode = $hrjia_tools.find(".hrjia_barcode") ;
                callback && callback.call( $hrjia_tools ) ;
                $hrjia_tools.on("click",".go2top",function( ev ){
                    $("body,html").stop().animate({scrollTop:0},100,"swing") ;
                } ).on("mouseenter",".help_wrap",function( ev ){
                    $hrjia_barcode.show() ;
                } ).on("mouseleave",".help_wrap",function( ev ){
                    $hrjia_barcode.hide() ;
                } ) ;
                var $document = $(document) ;
                $(window).on( "scroll" , function( ev ){
                    var scrollTop = $document.scrollTop() ;
                    if( scrollTop > 100 ) {
                        $go2top_wrap.show() ;
                    }else{
                        $go2top_wrap.hide() ;
                    }
                } ) ;
                $("body").append( $hrjia_tools ) ;
            }
        } ,
        // jquery小插件
        jqPlugin: function(){
            //jquery serializeJson方法
            $.fn.serializeJson=function(){
                var serializeObj={};
                var array=this.serializeArray();
                var str=this.serialize();
                $(array).each(function(){
                    if(serializeObj[this.name]){
                        if($.isArray(serializeObj[this.name])){
                            serializeObj[this.name].push(this.value);
                        }else{
                            serializeObj[this.name]=[serializeObj[this.name],this.value];
                        }
                    }else{
                        serializeObj[this.name]=this.value;
                    }
                });
                return serializeObj;
            };
            // 自动填充表单
            $.fn.autoFillData = function( data ){
                for( var name in data  ){
                    var $ele = this.find("[name='" + name + "']" ) ,
                        value = data[name] ,
                        type = $ele.attr("type") ;
                    switch( type ) {
                        case "radio":
                            $ele.each( function(){
                                var $this = $(this) ,
                                    val = $this.val() ;
                                if( value == val ){ $this.prop("checked",true); return false; }
                            } ) ;
                            break;
                        default:
                            $ele.val( value ) ;
                            break;
                    }
                } ;
                return this ;
            } ;
            // 日期格式化工具: http://blog.csdn.net/accountwcx/article/details/47446225
            window.DateUtils=function(){function b(a,b){for(var c=""+a;c.length<b;)c="0"+c;return c}var a={dayNames:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],shortDayNames:["日","一","二","三","四","五","六"],monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],shortMonthNames:["一","二","三","四","五","六","七","八","九","十","十一","十二"],am:"上午",pm:"下午",shortAm:"上",shortPm:"下"},c=function(){var a=/\d{2}/,b=/\d{4}/,c=/\d{1,2}/,d=/\d{1,3}/,e=/.{2}/,f=/.{1,2}/,g={yy:{regex:a,name:"year"},yyyy:{regex:b,name:"year"},MM:{regex:a,name:"month"},M:{regex:c,name:"month"},dd:{regex:a,name:"date"},d:{regex:c,name:"date"},HH:{regex:a,name:"hours"},H:{regex:c,name:"hours"},hh:{regex:a,name:"hours"},h:{regex:c,name:"hours"},mm:{regex:a,name:"minutes"},m:{regex:c,name:"minutes"},s:{regex:c,name:"seconds"},ss:{regex:a,name:"seconds"},tt:{regex:e,name:"t"},t:{regex:f,name:"t"},S:{regex:d,name:"millisecond"},SS:{regex:d,name:"millisecond"},SSS:{regex:d,name:"millisecond"}};return function(a,b,c){var d,e=g[a];return e&&(d=b.match(e.regex))?(c[e.name]=d[0],d[0]):null}}();return{locale:a,format:function(a,c){if("[object Date]"!==Object.prototype.toString.call(a))return"";("[object String]"!==Object.prototype.toString.call(c)||""===c)&&(c="yyyy-MM-dd HH:mm:ss");var d=a.getFullYear(),e=a.getMonth(),f=a.getDay(),g=a.getDate(),h=a.getHours(),i=a.getMinutes(),j=a.getSeconds(),k=a.getMilliseconds();return c.replace(/(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|SS?S?)/g,function(a){if("\\"===a.charAt(0))return a.replace("\\","");var c=DateUtils.locale;switch(a){case"hh":return b(13>h?0===h?12:h:h-12,2);case"h":return 13>h?0===h?12:h:h-12;case"HH":return b(h,2);case"H":return h;case"mm":return b(i,2);case"m":return i;case"ss":return b(j,2);case"s":return j;case"yyyy":return d;case"yy":return(d+"").substring(2);case"dddd":return c.dayNames[f];case"ddd":return c.shortDayNames[f];case"dd":return b(g,2);case"d":return g;case"MMMM":return c.monthNames[e];case"MMM":return c.shortMonthNames[e];case"MM":return b(e+1,2);case"M":return e+1;case"t":return 12>h?c.shortAm:c.shortPm;case"tt":return 12>h?c.am:c.pm;case"S":return k;case"SS":return b(k,2);case"SSS":return b(k,3);default:return a}})},parse:function(a,b){var d,e,f,g,h,i;if(!a)return null;if("[object Date]"===Object.prototype.toString.call(a))return a;if("[object String]"!==Object.prototype.toString.call(a))return null;if("[object String]"!==Object.prototype.toString.call(b)||""===b)return d=Date.parse(a),isNaN(d)?null:new Date(d);for(h=b.match(/(\\)?(dd?|MM?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|SS?S?|.)/g),i={year:0,month:1,date:0,hours:0,minutes:0,seconds:0,millisecond:0},e=0;e<h.length;e++)f=h[e],g=c(f,a,i),a=null!==g?a.length>g.length?a.substring(g.length):"":a.substring(f.length);return i.t&&(DateUtils.locale.pm===i.t||DateUtils.locale.shortPm===i.t)&&(i.hours=+i.hours+12),i.month-=1,new Date(i.year,i.month,i.date,i.hours,i.minutes,i.seconds,i.millisecond)}}}();
        } ,
        // 获取url参数
        getUrlParams: function( name ){
            var url = location.href ,
                value = null ,
                index = url.indexOf("?") ;
            if( index < 0 ){
                return {};
            }else{
                var paramstr = url.substring( index + 1 ) ,
                    obj = {} ;
                $.each( paramstr.split("&") , function( index , val ){
                    var tmp = val.split("=") ;
                    obj[ tmp[0] ] = tmp[1] ;
                } );
                if( name ){
                    return obj[ name ] ;
                }else{
                    return obj ;
                };
            };
        }
    };
    $(function(){
        global.init();
    });
    module.exports = global ;
});