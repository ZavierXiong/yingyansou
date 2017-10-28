var country = "null";
var searchType = 1;
var searchWord = "";
var searchTime = "";
var currentPage = 1;
$(function(){
    var localTime = "";
    function loadSearch(){
        var loc = location.href;
        var n1 = loc.indexOf('=');
        var pos = new Array();
        var n2 = loc.lastIndexOf('=');
        pos.push(n1);
        while(n1<n2){
            n1 = loc.indexOf('=',n1+1);
            pos.push(n1)
        }
        var s1 = loc.indexOf('&searchWord');
        var s2 = loc.indexOf('&country');
        if(s1>-1) {
            searchType = loc.slice(pos[0] + 1, s1);
            searchWord = loc.slice(pos[1] + 1, s2);
            country = loc.slice(pos[2] + 1);
            $('#searchInput').val(searchWord);
            search();
        }
    }
    loadSearch();//从地址栏拿主页传来的数据
    function countryCheck(myCountry,id){
        var myCountry = countryJson[myCountry];
        var list = "";
        for(var i = 0,max=myCountry.length;i<max;i++){
            var code = myCountry[i].code;
            var typename = myCountry[i].typename;
            var yzList = `
            <li>
                <a class="typeslect" href="javascript:void(0);" cid="${code}">${typename}</a>
            </li>`;
            list+=yzList;
        }
        $(id).html(list);
    };
    countryCheck('yz','#drop-menu-yz');
    countryCheck('oz','#drop-menu-oz');
    countryCheck('mz','#drop-menu-mz');
    countryCheck('dyz','#drop-menu-dyz');
    countryCheck('fz','#drop-menu-fz');
    (function(){
        //鹰学堂tab下拉效果
        function childShow(menu,child,allChild){
            var f;
            $(menu).on('click',function(){
                f=!f;
                if(f){
                    $(child).show(200);
                }else{
                    $(child).hide(200);
                }
            })
            document.addEventListener('click', function(e) {
                var target = $(e.target);
                if(!target.is(allChild)){
                    $(child).hide(200);
                    f=false;
                }
            })
        }
        childShow('#eagle-class','.more-li','#eagle-class *')
    })();

    (function(){
        //点击展开条件下拉框
        function showList(){
            var li = $('.tip-li');
            for(var i= 0,max=li.length;i<max;i++){
                (function(i){
                    li[i].addEventListener('click',function(e){
                        var child = $(this).children('.dropdown-menu')
                        if(child.is(':hidden')){
                            child.stop(true,false).show(200);
                            $(this).siblings('.tip-li').children('.dropdown-menu').stop(true,false).hide(200);
                        }else{
                            child.stop(true,false).hide(200);
                        }
                        $(document).one('click', function() {
                            $('.dropdown-menu').stop(true,false).hide(200);
                        })
                        //阻止事件冒泡触发事件导致隐藏
                        e.stopPropagation();
                    });
                    //阻止点击内容时隐藏
                    $('.dropdown-menu').on('click',function(e){
                        e.stopPropagation()
                    })
                })(i)
            }
            $('.dropdown-menu li').on('click',function(e){
                country = $(this).children('a').attr("cid");
                search()
            });//点击国家下拉栏筛选
            $('#normalCountry').on('click',function(){
                $('.tip-li').removeClass('active');
                $(this).addClass('active');
                $('.dropdown-menu').stop(true,false).hide(200);
                country='null';
                search();
            });//点击通用引擎
        };
        //点击切换选中以及选择条件
        function checkList(){
            var li = $('.typeslect');
            for(var i= 0,max=li.length;i<max;i++){
                (function(i){
                    li[i].addEventListener('click',function(){
                        var text = $(this).html();
                        $('#sel1').html('亚洲区域');
                        $('#sel2').html('欧洲区域');
                        $('#sel3').html('美洲区域');
                        $('#sel4').html('大洋洲区域');
                        $('#sel5').html('非洲区域');
                        $('.tip-li').removeClass('active');
                        $(this).parent().parent().parent().addClass('active');
                        $(this).parent().parent().siblings('.drop-title').children('.mySelect').html(text);
                        $('.dropdown-menu').stop(true,false).hide(200);
                    })
                })(i)
            }
        }
        showList();
        checkList();
    })();

    //分页操作
    $('#myPage').jqPaginator({
        totalPages: 100,
        visiblePages: 5,
        currentPage: 1,
        pagesize:10,
        first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
        prev: '<li class="prev"><a href="javascript:void(0);">上一页</a></li>',
        next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
        last: '<li class="last"><a href="javascript:void(0);">最后一页</a></li>',
        page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
        onPageChange: function (num, type) {
            if(type=='change'){
                currentPage = num;
                search();
            }
        }
    });
    //鹰眼搜信息弹框tab切换
    //(function(){
    //    var li = $('#left-nav>li');
    //    var content = $('.info-cnt');
    //    for(var i = 0,max=li.length;i<max;i++){
    //        (function(i){
    //            li[i].addEventListener('click',function(){
    //                li.removeClass('info-active');
    //                $(this).addClass('info-active');
    //                content.hide().eq(li.index(this)).show();
    //            });
    //        })(i);
    //    }
    //    $('.close-btn').on('click',function(){
    //        $('.client-info').fadeOut();
    //    });
    //})();
    //时间戳转换成日期
    function getLocalTime(nS) {
        return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
    }
    //提取联系信息
    $(document).on('click','.getInfo-box',function(){
        var companyId = $(this).attr('data-id');
        //clearInterval(myTime);
        second = "00";
        minute = "00";
        myTime=setInterval("timeAdd()",1000);
        $('.loading-layer').fadeIn();
        $.ajax({
            type:"post",
            url:url+"/yys/extract",
            xhrFields: { withCredentials: true },
            data:{
                "companyId":companyId
            },
            success:function(data){
                closeLoad();
                if(data.code===200){
                    $('.emailBody').html('');
                    var pageSize = data.data.page.pageSize;//不同权限下所能展示的邮箱数量
                    var myEmail = data.data.result.emails;//所有邮箱
                    var companyName = data.data.result.company_name===null?"未知":data.data.result.company_name;
                    var location_country = data.data.result.location_country===null?"未知":data.data.result.location_country;
                    var contact_phone = data.data.result.contact_phone===""?"无":data.data.result.contact_phone;
                    var Facebook = data.data.result.facebook===""?"未知":data.data.result.facebook;
                    var Linkedin = data.data.result.linkedin===""?"未知":data.data.result.linkedin;
                    var Twitter = data.data.result.twitter===""?"未知":data.data.result.twitter;
                    var Google = data.data.result.google===null?"未知":data.data.result.google;
                    var Youtobe = data.data.result.youtube===""?"未知":data.data.result.youtube;
                    var Pintertst = data.data.result.pintertst===""?"未知":data.data.result.pintertst;
                    var doTime  = data.data.result.doTime;
                    var searchDate = getLocalTime(doTime[doTime.length-1]);
                    for(var i= 0,max=10;i<max;i++){
                        var emailUrl = myEmail[i].email;
                        var emailTr = `
                        <tr>
                            <td><a href="${emailUrl}" class="info-email">${emailUrl}</a></td>
                            <td><a href="#" class="info-vertify">验证</a></td>
                            <td><a href="#" class="info-contact">立刻联系</a></td>
                        </tr>
                        `
                        $('.emailBody').append(emailTr);
                    }
                    $('#lostNum').html(myEmail.length-pageSize);
                    $('#company_name').html(companyName);
                    $('#location_country').html(location_country);
                    $('#contact_phone').html(contact_phone);
                    $('#doTime').html(searchDate);
                    $('#Facebook').html(Facebook);
                    $('#Linkedin').html(Linkedin);
                    $('#Twitter').html(Twitter);
                    $('#Google').html(Google);
                    $('#Youtobe').html(Youtobe);
                    $('#Pintertst').html(Pintertst);
                    $('.client-info').fadeIn();
                }else{
                    alert(data.msg)
                }
            }
        });
    });

    //搜索触发的事件
    function search(){
        searchTime = new Date();
        searchWord = $('#searchInput').val().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
        if($('#searchInput').val()===""){
            self.location="result.html"
        }else{
            if(localTime!=""){
                var interval = new Date() - localTime;//当前时间减上一次点击的时间
                localTime = new Date();//记录这一次点击的时间
                if(interval<4000){//当两次进行搜索的时间不超过4秒弹出提示
                    var dT=6;
                    var dtInterval = setInterval(function(){
                        dT--;
                        if(dT<0){
                            $('.backResult-layer').hide();
                            $('.yys-loading').show();
                            var reloadTime = setTimeout(function(){
                                $('.yys-loading').hide();
                                search();
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
                }else{
                    $('.yys-loading').show();
                        noData();
                }
            }else{
                localTime = new Date();//记录第一次点击的时间
                $('.yys-loading').show();
                noData();

            }
        }

    };
    function noData(){
        $.ajax({
            type:"post",
            url:url+"/yys/search",
            xhrFields: { withCredentials: true },
            data:{
                searchType:searchType,
                searchWord:searchWord,
                country:country,
                currentPage:currentPage
            },
            success:function(data){
                var searchT = new Date() - searchTime;
                var content = $('#searchInput').val().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
                $('#searchTime').html(searchT/1000);
                $('.yys-loading').hide();
                if(data.code===200){
                    var list = data.data.list;
                    $('#recordNum').html(data.data.page.totalRecord);
                    $('.info-list-box').html('');//初始化dom中信息列表
                    if(list.length>0){
                        $('.noData').hide();
                        for(var i= 0,max=list.length;i<max;i++){
                            var desc = list[i].desc;
                            var weburl = list[i].weburl;
                            var subject = list[i].subject;
                            var _id = list[i]._id;
                            //ES6模板字符串生成搜索信息
                            var infoList = `
                                <div class="info-list">
                                    <div class="info-title">
                                        <input type="checkbox" class="mycheckbox"/>
                                        <a href="${weburl}" target="_blank">${subject}</a>
                                        <span class="translate-btn">
                                            <a href="http://fanyi.baidu.com/transpage?query=${weburl}&from=auto&to=zh&source=url&render=1" target="_blank">翻译</a>
                                        </span>
                                    </div>
                                    <div class="info-intro">
                                        ${desc}
                                    </div>
                                    <div class="info-url">
                                        <a href="${weburl}" target="_blank">${weburl}</a>
                                    </div>
                                    <div class="getInfo-box" data-id="${_id}">提取联系信息</div>
                                </div>`
                            infoList = infoList.replace(new RegExp(content,"igm"),"<font color='red' >"+content+"</font>");
                            $('.info-list-box').append(infoList);
                            //关键字变红
                            //var myHtml = $('.info-list-box').html();//写在外面可以避免该类名的内容被改变，保证是初始加载时无关键字样式的dom
                            //function toRed(content){
                            //    //var myHtml = $('.info-content').html();
                            //    var x = myHtml.replace(new RegExp(content,"igm"),"<font color='red' >"+content+"</font>");
                            //    $('.info-list-box').html(x);
                            //}
                        }
                    }else{
                        $('.info-list-box').hide();
                        $('.noData').show();
                    }
                }else{
                    alert(data.msg)
                }
            }
        })
        //if($('#searchInput').val()===""){
        //    $('.info-list-box').hide();
        //    $('.noData').show();
        //}else{
        //    $('.info-list-box').show();
        //    $('.noData').hide();
        //    toRed($('#searchInput').val());
        //}
    };

    //鹰眼一下进行搜索
    $(document).on('click','#searchBtn',function(){
        search()
    });
    $('#searchInput').on("focus",function(){
        document.onkeydown = function(e){
            var ev = document.all ? window.event : e;
            if(ev.keyCode==13) {
                search();
            }
        }
    })
});
//其他客户购买信息滚动效果
function autoScroll(obj){
    $(obj).find("ul").stop(false, true).animate({
        marginTop : "-50px"
    },1000,function(){
        $(this).css({marginTop : "0px"}).find("li:first").appendTo(this);
    })
}
$(function(){
    var scroll=setInterval('autoScroll("#FontScroll")',1500);
    $("#FontScroll").hover(function(){
        clearInterval(scroll);
    },function(){
        scroll=setInterval('autoScroll("#FontScroll")',1500);
    });
});


$(document).on('click','#checkAll',function(){
    if($('#checkAll').is(':checked')){
        $('.mycheckbox').prop('checked',true)
    }else{
        $('.mycheckbox').prop('checked',false)
    }
})

