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
    loadSearch();//�ӵ�ַ������ҳ����������
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
        //ӥѧ��tab����Ч��
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
        //���չ������������
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
                        //��ֹ�¼�ð�ݴ����¼���������
                        e.stopPropagation();
                    });
                    //��ֹ�������ʱ����
                    $('.dropdown-menu').on('click',function(e){
                        e.stopPropagation()
                    })
                })(i)
            }
            $('.dropdown-menu li').on('click',function(e){
                country = $(this).children('a').attr("cid");
                search()
            });//�������������ɸѡ
            $('#normalCountry').on('click',function(){
                $('.tip-li').removeClass('active');
                $(this).addClass('active');
                $('.dropdown-menu').stop(true,false).hide(200);
                country='null';
                search();
            });//���ͨ������
        };
        //����л�ѡ���Լ�ѡ������
        function checkList(){
            var li = $('.typeslect');
            for(var i= 0,max=li.length;i<max;i++){
                (function(i){
                    li[i].addEventListener('click',function(){
                        var text = $(this).html();
                        $('#sel1').html('��������');
                        $('#sel2').html('ŷ������');
                        $('#sel3').html('��������');
                        $('#sel4').html('����������');
                        $('#sel5').html('��������');
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

    //��ҳ����
    $('#myPage').jqPaginator({
        totalPages: 100,
        visiblePages: 5,
        currentPage: 1,
        pagesize:10,
        first: '<li class="first"><a href="javascript:void(0);">��ҳ</a></li>',
        prev: '<li class="prev"><a href="javascript:void(0);">��һҳ</a></li>',
        next: '<li class="next"><a href="javascript:void(0);">��һҳ</a></li>',
        last: '<li class="last"><a href="javascript:void(0);">���һҳ</a></li>',
        page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
        onPageChange: function (num, type) {
            if(type=='change'){
                currentPage = num;
                search();
            }
        }
    });
    //ӥ������Ϣ����tab�л�
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
    //ʱ���ת��������
    function getLocalTime(nS) {
        return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
    }
    //��ȡ��ϵ��Ϣ
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
                    var pageSize = data.data.page.pageSize;//��ͬȨ��������չʾ����������
                    var myEmail = data.data.result.emails;//��������
                    var companyName = data.data.result.company_name===null?"δ֪":data.data.result.company_name;
                    var location_country = data.data.result.location_country===null?"δ֪":data.data.result.location_country;
                    var contact_phone = data.data.result.contact_phone===""?"��":data.data.result.contact_phone;
                    var Facebook = data.data.result.facebook===""?"δ֪":data.data.result.facebook;
                    var Linkedin = data.data.result.linkedin===""?"δ֪":data.data.result.linkedin;
                    var Twitter = data.data.result.twitter===""?"δ֪":data.data.result.twitter;
                    var Google = data.data.result.google===null?"δ֪":data.data.result.google;
                    var Youtobe = data.data.result.youtube===""?"δ֪":data.data.result.youtube;
                    var Pintertst = data.data.result.pintertst===""?"δ֪":data.data.result.pintertst;
                    var doTime  = data.data.result.doTime;
                    var searchDate = getLocalTime(doTime[doTime.length-1]);
                    for(var i= 0,max=10;i<max;i++){
                        var emailUrl = myEmail[i].email;
                        var emailTr = `
                        <tr>
                            <td><a href="${emailUrl}" class="info-email">${emailUrl}</a></td>
                            <td><a href="#" class="info-vertify">��֤</a></td>
                            <td><a href="#" class="info-contact">������ϵ</a></td>
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

    //�����������¼�
    function search(){
        searchTime = new Date();
        searchWord = $('#searchInput').val().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
        if($('#searchInput').val()===""){
            self.location="result.html"
        }else{
            if(localTime!=""){
                var interval = new Date() - localTime;//��ǰʱ�����һ�ε����ʱ��
                localTime = new Date();//��¼��һ�ε����ʱ��
                if(interval<4000){//�����ν���������ʱ�䲻����4�뵯����ʾ
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
                        $('#yyedtime').text('6');//��ʼ������ҳ��ĵ�����ʱ��
                    })
                }else{
                    $('.yys-loading').show();
                        noData();
                }
            }else{
                localTime = new Date();//��¼��һ�ε����ʱ��
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
                    $('.info-list-box').html('');//��ʼ��dom����Ϣ�б�
                    if(list.length>0){
                        $('.noData').hide();
                        for(var i= 0,max=list.length;i<max;i++){
                            var desc = list[i].desc;
                            var weburl = list[i].weburl;
                            var subject = list[i].subject;
                            var _id = list[i]._id;
                            //ES6ģ���ַ�������������Ϣ
                            var infoList = `
                                <div class="info-list">
                                    <div class="info-title">
                                        <input type="checkbox" class="mycheckbox"/>
                                        <a href="${weburl}" target="_blank">${subject}</a>
                                        <span class="translate-btn">
                                            <a href="http://fanyi.baidu.com/transpage?query=${weburl}&from=auto&to=zh&source=url&render=1" target="_blank">����</a>
                                        </span>
                                    </div>
                                    <div class="info-intro">
                                        ${desc}
                                    </div>
                                    <div class="info-url">
                                        <a href="${weburl}" target="_blank">${weburl}</a>
                                    </div>
                                    <div class="getInfo-box" data-id="${_id}">��ȡ��ϵ��Ϣ</div>
                                </div>`
                            infoList = infoList.replace(new RegExp(content,"igm"),"<font color='red' >"+content+"</font>");
                            $('.info-list-box').append(infoList);
                            //�ؼ��ֱ��
                            //var myHtml = $('.info-list-box').html();//д��������Ա�������������ݱ��ı䣬��֤�ǳ�ʼ����ʱ�޹ؼ�����ʽ��dom
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

    //ӥ��һ�½�������
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
//�����ͻ�������Ϣ����Ч��
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

