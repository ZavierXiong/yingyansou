var url = "http://115.29.230.132:86"
var searchType = 1;
var country = "null";
var myTime=setInterval("timeAdd()",1000);
var xhr_Link;
$(function(){
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
    $.ajax({
        type:"get",
        //xhrFields: { withCredentials: true },
        url:url+"/yys/sightseer",
        success:function(data){
        }
    });
    //����л���������
    function appendCountry(){
        var allCountry = countryJson.dyz.concat(countryJson.fz).concat(countryJson.mz).concat(countryJson.oz).concat(countryJson.yz);
        var selectBox = "<option value='null'>ͨ������</option>"
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
                            $('.placeholder').text('С��ʾ����ѡ���������ʱ�����뱾�����Թؼ�������Ч������');
                            myText.attr('placeholder','С��ʾ����ѡ���������ʱ�����뱾�����Թؼ�������Ч������');
                            lang.stop(true,false).fadeIn(400);
                            break;
                        case 1:
                            searchType = 3;
                            $('.placeholder').text('������Ҫ����������');
                            myText.attr('placeholder','������Ҫ����������');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        case 2:
                            $('.placeholder').text('������Ҫ��֤������');
                            myText.attr('placeholder','������Ҫ��֤������');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        case 3:
                            $('.placeholder').text('������Ҫ�������ĵ���Ϣ');
                            myText.attr('placeholder','������Ҫ�������ĵ���Ϣ');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        case 4:
                            $('.placeholder').text('������Ҫ������ͼƬ��Ϣ');
                            myText.attr('placeholder','������Ҫ������ͼƬ��Ϣ');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        default:
                            break;
                    }
                });
            })(i)
        }
    })();

//��ҳ����
//ӥ��һ��
//    $(function(){
    function searchIndex(){
        var searchWord = $('#search-text').val().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');//ȥ����β�ո�
        country = $('#countryName option:selected').val();
        if(searchType===3){
            var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            if(!reg.test(searchWord)){
                alert("��������http://https://��ͷ��������ַ��");
            }else{
                clearInterval(myTime);
                second = "00";
                minute = "00";
                $('.time-second').text(second);//��ʼ����ʱ��ʱ��
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
                        if(data.code===200){
                            $('.emailBody').html('');
                            var myEmail = data.data.emails;//��������
                            var companyName = data.data.company_name===null?"δ֪":data.data.company_name;
                            var location_country = data.data.location_country===null?"δ֪":data.data.location_country;
                            var contact_phone = data.data.contact_phone===null?"��":data.data.contact_phone;
                            var Facebook = data.data.facebook===null?"δ֪":data.data.facebook;
                            var Linkedin = data.data.linkedin===null?"δ֪":data.data.linkedin;
                            var Twitter = data.data.twitter===null?"δ֪":data.data.twitter;
                            var Google = data.data.google===null?"δ֪":data.data.google;
                            var Youtobe = data.data.youtube===null?"δ֪":data.data.youtube;
                            var Pintertst = data.data.pintertst===null?"δ֪":data.data.pintertst;
                            var doTime  = data.data.doTime;
                            var searchDate = getLocalTime(doTime[doTime.length-1]);
                            var emailT = "";
                            for(var i= 0,max=myEmail.length;i<max;i++){
                                var emailUrl = myEmail[i].email;
                                if(max>0){
                                    var emailTr = '<tr><td><a href="'+emailUrl+'" class="info-email">'+emailUrl+'</a></td><td><a href="javascript:void(0);" class="info-vertify">��֤</a></td><td><a href="javascript:void(0);" default="default" class="info-contact">������ϵ</a></td></tr>'
                                    emailT+=emailTr;
                                    $('.noData-table').hide();
                                }else{
                                    $('.noData-table').show();
                                }
                            }
                            $('.emailBody').html(emailT);
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
                        }else if(data.code ===105){
                            var buyEmail = confirm(data.msg+'���Ƿ������˺ţ�');
                            if(buyEmail){
                                location.href = "result.html";
                            }
                        }else{
                            alert(data.msg);
                        }
                    }
                });
            }
        }else{
            $('.yys-loading').show();
            if(searchWord!=""){
                $.ajax({
                    type:"post",
                    url:url+"/yys/search",
                    //xhrFields: { withCredentials: true },
                    data: {
                        searchType: searchType,
                        searchWord: searchWord,
                        country: country,
                        currentPage: 1
                    },
                    success:function(){
                        $('.yys-loading').stop(true,false).hide();
                        location.href = "result.html?"+"searchType="+searchType+"&"+"searchWord="+searchWord+"&"+"country="+country;
                    }
                });
            }else{
                location.href = "index.html"
            }
        }
    }
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
})
