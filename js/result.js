var country = "null";
var searchType = 1;
var searchWord = "";
var searchTime = "";
var currentPage = 1;
var xhr_Link;
var weburl ;
$(function(){
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
    jQuery.support.cors = true;
    var localTime = "";
    var loc = window.name;
    function loadSearch(){
        //var loc = location.href;
        var n1 = loc.indexOf('=');
        var pos = new Array();
        var n2 = loc.lastIndexOf('=');
        pos.push(n1);
        while(n1<n2){
            n1 = loc.indexOf('=',n1+1);
            pos.push(n1);
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
    loadSearch();//��window.name����ҳ���������ݻ���ˢ�µ�ʱ��ʵʱ��������
    function countryCheck(myCountry,id){
        var myCountry = countryJson[myCountry];
        var list = "";
        for(var i = 0,max=myCountry.length;i<max;i++){
            var code = myCountry[i].code;
            var typename = myCountry[i].typename;
            //var yzList = ' <li><a class="typeslect" href="javascript:void(0);" cid="'+code+'">'+typename+'</a></li>';
            var yzList = ' <li class="typeslect" cid="'+code+'">'+typename+'</li>';
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
            //$('.dropdown-menu li').on('click',function(){
            //    checkList();
            //});//�������������ɸѡ
            $('#normalCountry').on('click',function(){
                $('.tip-li').removeClass('active');
                $(this).addClass('active');
                $('.dropdown-menu').stop(true,false).hide(200);
                searchType = 1;
                currentPage = 1;
                country='null';
                noData();
            });//���ͨ������
        };
        //����л�ѡ���Լ�ѡ������
        function checkList(){
            var li = $('.typeslect');
            for(var i= 0,max=li.length;i<max;i++){
                (function(i){
                    li[i].addEventListener('click',function(){
                        currentPage = 1;
                        country = $(this).attr("cid");
                        var text = $(this).html();
                        $('#sel1').html('��������');
                        $('#sel2').html('ŷ������');
                        $('#sel3').html('��������');
                        $('#sel4').html('����������');
                        $('#sel5').html('��������');
                        $('.tip-li').removeClass('active');
                        $(this).parent().parent().addClass('active');
                        $(this).parent().siblings('.drop-title').children('.mySelect').html(text);
                        $('.dropdown-menu').stop(true,false).hide(200);
                        noData();
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
                searchType = 2;
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
                                    currentPage = num;
                                    noData();
                                    clearTimeout(reloadTime);
                                },1000)
                                clearInterval(dtInterval);
                                dT = 6;
                            }
                            $('#yyedtime').text(dT);
                        },1000);
                        $('.backResult-layer').fadeIn();
                        $(document).on('click','.backResult a',function(){
                            $('.page').removeClass('active');
                            $('[jp-role="page"][jp-data='+currentPage+']').addClass('active');//��������������ʾʱ����ҳ�벻��ת
                            $('.backResult-layer').hide();
                            window.clearInterval(dtInterval);
                            $('#yyedtime').text('6');//��ʼ������ҳ��ĵ�����ʱ��
                        })
                    }else{
                        currentPage = num;
                        noData();
                    }
                }else{
                    localTime = new Date();//��¼��һ�ε����ʱ��
                    currentPage = num;
                    noData();
                }
                this.currentPage = currentPage;
            }
        }
    });
    //��ȡ��ϵ��Ϣ
    $(document).on('click','.getInfo-box',function(){
        searchType = 4;
        var companyId = $(this).attr('data-id');
        second = "00";
        minute = "00";
        myTime=setInterval("timeAdd()",1000);
        $('.loading-layer').fadeIn();
        $('#clientUrl').html(weburl);
        xhr_Link = $.ajax({
            type:"post",
            url:url+"/yys/search",
            data:{
                "searchType":searchType,
                "searchWord":companyId
            },
            success:function(data){
                closeLoad();
                switch(data.code){
                    case 200:
                        InfoLayer(data);
                    break;
                    case 103:
                        alert(data.msg);
                        InfoLayer(data);
                    break;
                    case 105:
                        var buyEmail = confirm(data.msg+'���Ƿ������˺ţ�');
                        if(buyEmail){
                            location.href = "buy.html";
                        }
                    break;
                    case 107:
                        alert("�ף�����̫����Ŷ~")
                    break;
                    default:
                        alert(data.msg);
                    break;
                }
            }
        });
    });

    //��ȡ��Ϣ�е�������֤
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
                            alert('������δȷ��!');
                        break;
                        case 0:
                            alert('�����ڸ�����!');
                        break;
                        case 1:
                            alert('���������!');
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

    function WarnLoading(){
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
    };//������쵯����

    //����
    function search(){
        searchType = 1;
        searchTime = new Date();
        searchWord = $('#searchInput').val().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
        window.name="searchType="+searchType+"&"+"searchWord="+searchWord+"&"+"country="+country;//ÿ�����������²������浽window.name������ˢ�µ�ʱ��ʵʱ���²���
        if($('#searchInput').val()===""){
            alert("�������ݲ���Ϊ�գ�")
        }else{
            noData();
        }

    };

    //����������������Ϣ����
    function noData() {
        $('.yys-loading').show();
        $.ajax({
            type: "post",
            url: url + "/yys/search",
            data: {
                "searchType": searchType,
                "searchWord": searchWord,
                "country": country,
                "currentPage": currentPage
            },
            success: function (data) {
                var searchT = new Date() - searchTime;
                var content = $('#searchInput').val().replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');//ȥ����β���ַ���
                $('.yys-loading').hide();
                $('#searchTime').html(searchT / 1000);//������ʱ
                switch(data.code){
                    case 200:
                        var list = data.data.list;
                        $('#recordNum').html(data.data.page.totalRecord);
                        $('.info-list-box').html('');//��ʼ��dom����Ϣ�б�
                        if (list.length > 0) {
                            $('.noData').hide();
                            for (var i = 0, max = list.length; i < max; i++) {
                                var desc = list[i].desc;
                                weburl = list[i].weburl;
                                var subject = list[i].subject;
                                var _id = list[i]._id;
                                var infoList = '<div class="info-list"><div class="info-title"><input type="checkbox" class="mycheckbox"/><a href="' + weburl + '" target="blank">' + subject + '</a><span class="translate-btn"><a href="http://fanyi.baidu.com/transpage?query=' + weburl + '&from=auto&to=zh&source=url&render=1" target="_blank">����</a></span></div><div class="info-intro">' + desc + '</div><div class="info-url"><a href="' + weburl + '" target="_blank" title="'+weburl+'">' + weburl + '}</a></div><div class="getInfo-box" data-id="' + _id + '">��ȡ��ϵ��Ϣ</div></div>'
                                //�ؼ��ֱ��
                                infoList = infoList.replace(new RegExp(content, "igm"), "<font color='red' >" + content + "</font>");
                                $('.info-list-box').append(infoList);
                            }
                        } else {
                            $('.noData').show();
                        }
                    break;
                    case 107:
                        WarnLoading();
                    break;
                    default:
                        alert(data.msg);
                    break;
                }
            },
            error:function(){
                console.log("����ʧ��1")
            }
        })
    };

    //ӥ��һ�½�������
    $(document).on('click', '#searchBtn', function () {
        currentPage = 1;
        search();
    });
    $('#searchInput').on("focus", function () {
        document.onkeydown = function (e) {
            var ev = document.all ? window.event : e;
            if (ev.keyCode == 13) {
                currentPage = 1;
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

