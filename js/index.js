var url = "http://115.29.230.132:86"
var searchType = 1;
var country = "null";
var myTime=setInterval("timeAdd()",1000);
var xhr_Link;
$(function(){
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
    jQuery.support.cors = true;
    $.ajax({
        type:"get",
        url:url+"/yys/sightseer",
        success:function(data){
            console.log(1)
        },
        error:function(){
            console.log(2)
        }
    });
    //点击切换搜索内容
    function appendCountry(){
        var allCountry = countryJson.dyz.concat(countryJson.fz).concat(countryJson.mz).concat(countryJson.oz).concat(countryJson.yz);
        var selectBox = "<option value='null'>通用引擎</option>"
        for(var i= 0,max=allCountry.length;i<max;i++){
            var optionName = allCountry[i].typename;
            var optionId = allCountry[i].id;
            var optionCode = allCountry[i].code;
            var countryLi = '<option value="'+optionCode+'">'+optionName+'</option>';
            selectBox+=countryLi;
        }
        $('#countryName').html(selectBox);
    };
    appendCountry();
    (function(){
        var li = $('.search-tip li');
        for(var i=0;i<li.length;i++){
            (function(i){
                $('.search-tip li')[i].addEventListener('click',function(){
                    li.removeClass('active');
                    $(this).addClass('active');
                    var lang = $('#yys-language');
                    var myText = $('#search-text');
                    switch(i){
                        case 0:
                            searchType = 1;
                            $('.placeholder').text('小提示：当选择国家引擎时，输入本土语言关键词搜索效果更佳');
                            myText.attr('placeholder','小提示：当选择国家引擎时，输入本土语言关键词搜索效果更佳');
                            lang.stop(true,false).fadeIn(400);
                            break;
                        case 1:
                            searchType = 3;
                            $('.placeholder').text('请输入要搜索的邮箱');
                            myText.attr('placeholder','请输入要搜索的邮箱');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        case 2:
                            $('.placeholder').text('请输入要验证的邮箱');
                            myText.attr('placeholder','请输入要验证的邮箱');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        case 3:
                            $('.placeholder').text('请输入要搜索的文档信息');
                            myText.attr('placeholder','请输入要搜索的文档信息');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        case 4:
                            $('.placeholder').text('请输入要搜索的图片信息');
                            myText.attr('placeholder','请输入要搜索的图片信息');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        default:
                            break;
                    }
                });
            })(i)
        }
    })();

    function WarnLoading(){
        var dT=6;
        var dtInterval = setInterval(function(){
            dT--;
            if(dT<0){
                $('.backResult-layer').hide();
                $('.yys-loading').show();
                var reloadTime = setTimeout(function(){
                    $('.yys-loading').hide();
                    searchIndex();
                    clearTimeout(reloadTime);
                },1000)
                clearInterval(dtInterval);
                dT = 6;
            }
            $('#yyedtime').text(dT);
        },1000);
        $('.backResult-layer').fadeIn();
        $(document).on('click','.backResult a',function(){
            $('.backResult-layer').hide();
            window.clearInterval(dtInterval);
            $('#yyedtime').text('6');//初始化返回页面的倒数总时间
        })
    };//点击过快弹出框
//主页搜索
//鹰眼一下
//    $(function(){
    function searchIndex(){
        var searchWord = $('#search-text').val().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');//去掉首尾空格
        country = $('#countryName option:selected').val();
        if(searchType===3){
            //搜索邮箱
            var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            if(!reg.test(searchWord)){
                alert("请输入以http://https://开头的邮箱网址！");
            }else{
                clearInterval(myTime);
                second = "00";
                minute = "00";
                $('.time-second').text(second);//初始化定时器时间
                $('.time-minute').text(minute);
                $('.yys-warn').hide();
                myTime=setInterval("timeAdd()",1000);
                $('.loading-layer').stop(true,false).fadeIn();
                $('#clientUrl').html(searchWord)
                xhr_Link = $.ajax({
                    type:"post",
                    url:url+"/yys/search",
                    //xhrFields: { withCredentials: true },
                    data:{
                        "searchType":searchType,
                        "searchWord":searchWord,
                        "currentPage":1
                    },
                    success:function(data){
                        closeLoad();
                        switch(data.code){
                            case 200:
                                InfoLayer(data);//客户详细信息弹框
                            break;
                            case 103://当未查询到准确数据时的其他相似信息推送
                                alert(data.msg);
                                InfoLayer(data);
                            break;
                            case 105://用户无权限看到更多信息时
                                var buyEmail = confirm(data.msg+'。是否升级账号？');
                                if(buyEmail){
                                    location.href = "buy.html";
                                }
                            break;
                            case 107://用户点击过快时提示信息
                                WarnLoading();
                            break;
                            default:
                                alert(data.msg);
                            break;
                        }
                    }
                });
            }
        }else{
            //搜索客户
            if(searchWord!=""){
                window.name="searchType="+searchType+"&"+"searchWord="+searchWord+"&"+"country="+country;
                location.href = 'result.html';
            }else{
                $(".sc-warn").show(200);
                $('#search-text').addClass('red-input');
            }
        }
    }

    //搜索框内容不能为空
    function searchWarn(){
        $(document).on('focus','#search-text',function(){
            $(".sc-warn").hide(200);
            $('#search-text').removeClass('red-input');
        })
    }
    searchWarn();
    //提取信息中的邮箱验证
    $(document).on('click','.info-vertify',function(){
        var myEmail = $(this).parent().siblings().children('.info-email').attr('href');
        $('.yys-loading').show();
        $.ajax({
            type:"post",
            url:url+"/yys/validEmail",
            //xhrFields: { withCredentials: true },
            data:{
                "email":myEmail
            },
            success:function(data){
                $('.yys-loading').hide();
                if(data.code===200){
                    switch(data.data){
                        case -1:
                            alert('该邮箱未确认!');
                            break;
                        case 0:
                            alert('不存在该邮箱!');
                            break;
                        case 1:
                            alert('该邮箱存在!');
                            break;
                        default:
                            break;
                    }
                }else{
                    alert(data.msg);
                }
            }
        })
    })
    $(document).on('click','#searchBtnIndex',function(){
        searchIndex();
    });
    function keyDownSearch(){
        document.onkeydown = function(e){
            if($('#search-text').is(":focus")){
                var ev = document.all ? window.event : e;
                if(ev.keyCode==13) {
                    searchIndex();
                }
            }
        }
    }
    keyDownSearch();
    //});
    if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<10){
        $('.yys-main').hide();
        $('.ieWarn').show();
    }else{
        $('.yys-main').show();
        $('.ieWarn').hide();
    }
    $(document).on('click','.c2r-4-btn',function(){
        $('.yys-main').show();
        $('.ieWarn').hide();
    })
})
