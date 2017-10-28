/**
 * Created by Administrator on 2017/10/18.
 */
var url = "http://115.29.230.132:86";
var serviceType;//��֤�뷽ʽ(ע�ᡢ��¼���һ�����)
$(function(){
    $.ajax({
        type:"get",
        url:url+"/yys/autoLogin",
        xhrFields: { withCredentials: true },
        success:function(data){
            if(data.code===200){
                $('.sign-btn').hide();
                $('#userName').html(data.data.userName);
                if(data.data.headImg === null){
                    $('#userImg').attr("src","img/bd_logo1.png")
                }else{
                    $('#userImg').attr("src",data.data.headImg)
                }
                $('.user-info').css({display:"inline-block"});
            }else{
                $('.user-info').hide();
                $('.sign-btn').show();
            }
        }
    });
    (function(){
        function tabChange(name,clas){
            for(var i= 0,max = name.length;i<max;i++){
                (function(i){
                    name[i].addEventListener('click',function(){
                        name.removeClass(clas);
                        $(this).addClass(clas);
                        $('.placeholder').show();
                        initLog();
                        if(i===0){
                            $('.log-in-box').show();
                            $('.sign-in-box').hide();
                        }else{
                            serviceType = 1;
                            $('.log-in-box').hide();
                            $('.sign-in-box').show();
                        }
                    })
                })(i)
            }
        }

        //�رյ�¼ע�ᵯ��
        function close(){
            $('#close-sign').on('click',function(){
                $('.register').fadeOut();
                $('.password-warn').hide();
                $('.user-warn').hide();
                $('#user-tel').val("");
                $('#user-key').val("");
            })
        }

        $(document).on('click','.fClose',function(){
            CloseForg();
        })
        function CloseForg(){
            $('.register,.reg-forg').fadeOut();
            $('.sign-in input').val('');
            $('.reg-forg-box .red').stop(true,false).hide();
            $('.reg-input').removeClass('correct');
            $('.reg-input').removeClass('error');
            $('.reg-input').removeClass('focus');
        }
        function initLog(sign,log){
            $('.user-warn').hide();
            $('.password-warn').hide();
            $('.code-warn').hide();
            $('#user-tel,#sign-user-tel').val("");
            $('#user-key,#sign-user-key').val("");
            $('#codeVal').val("");
            $('.user-name,.password,.mycode').removeClass('error');
            $('.user-name,.password,.mycode').removeClass('correct');
            $(sign).addClass('selected');
            $(log).removeClass('selected');
        }
            //������Ͻǵ�¼ע��
        function MyRegist(myId,myTitle1,myTitle2,myHide,myShow){
            $(document).on('click',myId,function(){
                serviceType = 1;
                initLog(myTitle1,myTitle2);
                $('.register,.register-tab').fadeIn();
                $(myHide).hide();
                $(myShow).show();
                $('.placeholder').show();
            })
        }
        function telWarn(myId){
            if($(myId).val().length!=11||!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($(myId).val()))){
                $(myId).siblings('.red').show(200);
                $(myId).parent().removeClass('correct');
                $(myId).parent().addClass('error');
            }else{
                $(myId).siblings('.red').hide(200);
                $(myId).parent().removeClass('error');
                $(myId).parent().addClass('correct');
            }
        }
        function keyWarn(myId){
            if($(myId).val().length<6|| $(myId).val().length>20){
                $(myId).siblings('.red').show(200);
                $(myId).parent().removeClass('correct');
                $(myId).parent().addClass('error');
            }else{
                $(myId).siblings('.red').hide(200);
                $(myId).parent().removeClass('error');
                $(myId).parent().addClass('correct');
            }
        }
        function RepKeyWarn(myId,myId2){
            if($(myId).val()!==$(myId2).val()||$(myId).val().length<6){
                $(myId).siblings('.red').show(200);
                $(myId).parent().removeClass('correct');
                $(myId).parent().addClass('error');

            }else{
                $(myId).siblings('.red').hide(200);
                $(myId).parent().removeClass('error');
                $(myId).parent().addClass('correct');
            }
        }
        function codeWarn(myId){
            if($(myId).val()===""){
                $(myId).siblings('.red').show(200);
                $(myId).siblings('.red').show(200);
                $(myId).parent().removeClass('correct');
                $(myId).parent().addClass('error');
            }else{
                $(myId).siblings('.red').hide(200);
                $(myId).parent().removeClass('error');
                $(myId).parent().addClass('correct');
            }
        }
        function blurEvent(myId){
            $(document).on('blur',myId,function(){
                telWarn(myId);
                $(this).parent().removeClass('focs');
            });
        }
        function KeyBlurEvent(myId){
            $(document).on('blur',myId,function(){
                keyWarn(myId);
                $(this).parent().removeClass('focs');
            });
        }
        function KeyConfirm(myId,myId2){
            $(document).on('blur',myId,function(){
                RepKeyWarn(myId,myId2);
            })
        }
        function codeBlur(myId){
            $(document).on('blur',myId,function(){
                codeWarn(myId);
                $(this).parent().removeClass('focs');
            });
        };
        function focusEvent(myId){
            $(document).on('focus',myId,function(){
                $(myId).parent().addClass('focs');
                $(myId).parent().addClass('focs');
                $(myId).parent().removeClass('error');
                $(myId).parent().removeClass('correct');
                $(myId).siblings('.red').hide(200);
            });
        }
        $(document).on('click','#to-log',function(){
            $('.reg-forg').hide();
            $('#log-in').click()
        })
        $(document).on('click','#free-reg',function(){
            $('.reg-forg').hide();
            $('#sign-in').click();
        })
        MyRegist('#log-in','.log-in-title','.sign-in-title','.sign-in-box','.log-in-box');//������Ͻǵ�¼
        MyRegist('#sign-in','.sign-in-title','.log-in-title','.log-in-box','.sign-in-box');//������Ͻ�ע��


        Fpassword('.p_forget','.reg0');//�����������
        Fpassword('#reg-btn3','.register-tab');//���������¼
        /**ʧȥ������֤**/
        blurEvent('#user-tel');
        blurEvent('#sign-user-tel');
        blurEvent('#f-userTel');
        KeyBlurEvent('#user-key');
        KeyBlurEvent('#sign-user-key');
        KeyBlurEvent('#f-sign-user-key');
        /*****/
        KeyConfirm('#f-sign-user-key2','#f-sign-user-key');//����������֤
        codeBlur('#codeVal');//ע����֤��ʧ��
        codeBlur('#f-codeVal');//�һ�������֤��ʧ��

        /*************�۽��߿����*****************/
        focusEvent('#user-tel');
        focusEvent('#user-key');
        focusEvent('#sign-user-tel');
        focusEvent('#sign-user-key');
        focusEvent('#codeVal');
        focusEvent('#f-userTel');
        focusEvent('#f-codeVal');//�һ�������֤��۽�
        focusEvent('#f-sign-user-key');
        focusEvent('#f-sign-user-key2');
        /**********************************/

        //enterShow('.log-in-btn');

        //��ť�س��¼�
        function enterShow(box,btn){
            $(document).keydown(function(e){
                if($(box).is(':hidden')){
                }else{
                    if(e.keyCode===13){
                        $(btn).click()
                    }
                }
            })
        }
        enterShow('.log-in-box','.log-in-btn');
        enterShow('.sign-in-box','.sign-in-btn');
        enterShow('.reg0','#reg-btn1');
        enterShow('.reg1','#reg-btn2');
        enterShow('.reg2','#reg-btn3');
        //�����������
        function Fpassword(myId,myReg){
            $(document).on('click',myId,function(){
                serviceType = 3;
                $('.sign-in input').val('');
                $('.reg-forg-box .red').stop(true,false).hide();
                $('.reg-input').removeClass('correct');
                $('.reg-input').removeClass('error');
                $('.reg-input').removeClass('focus');
                $('.register-tab,.reg-forg').hide();
                $(myReg).show();
            })
        }

        //�һ�����֮�����һ������֤���Ƿ���ȷ
        $(document).on('click','#reg-btn1',function(){
            telWarn('#f-userTel');
            codeWarn('#f-codeVal');
            var val = $('#f-userTel').val();
            var codeVal = $('#f-codeVal').val();
            if(val.length==11&&(/^1[3|4|5|8][0-9]\d{4,8}$/.test(val))&&codeVal!=""){
                $.ajax({
                    type:"get",
                    xhrFields: { withCredentials: true },
                    url:url+"/yys/code/check",
                    data:{
                        "mobile":val,
                        "serviceType":serviceType,
                        "code":codeVal
                    },
                    success:function(data){
                        if(data.code===200){
                            $('.register-tab,.reg-forg').hide();
                            $('.reg1').show();
                        }else{
                            alert(data.msg);
                        }
                    }
                })
            }
        })

        //�޸�����
        $(document).on('click','#reg-btn2',function(){
            keyWarn('#f-sign-user-key');
            RepKeyWarn('#f-sign-user-key2','#f-sign-user-key');
            var val = $('#f-sign-user-key').val();
            var val2 = $('#f-sign-user-key2').val();
            var tel = $('#f-userTel').val();
            var codeVal = $('#f-codeVal').val();
            if(val.length>5&&val2===val){
                $.ajax({
                    type:"post",
                    xhrFields: { withCredentials: true },
                    url:url+"/yys/modifyPassword",
                    data:{
                        "mobile":tel,
                        "newPassword":val2,
                        "code":codeVal
                    },
                    success:function(data){
                        if(data.code===200){
                            $('.register-tab,.reg-forg').hide();
                            $('.reg2').show();
                        }else{
                            alert(data.msg);
                        }
                    }
                })
            }else{

            }
        })
        //�����¼��ť
        $(document).on('click','.log-in-btn',function() {
            var account = $('#user-tel').val();
            var password = $('#user-key').val();
            telWarn('#user-tel');
            keyWarn('#user-key');
            if ($('#user-tel').val().length===11 && (/^1[3|4|5|8][0-9]\d{4,8}$/.test($('#user-tel').val())) && $('#user-key').val().length>=6 && $('#user-key').val().length<=20) {
                $('.loading').show();//���ּ��ؽ���
                $.ajax({
                	type:'post',
                	url:url+'/yys/login',
                    xhrFields: { withCredentials: true },
                	data:{"account":account,"password":password},
                    success:function(data){
                        $('.loading').hide();
                        if(data.code ===200){
                            var userName = data.data.userName;
                            $('.register').hide();
                            $('.sign-btn').hide();
                            $('#userName').html(userName)
                            $('.user-info').css({'display':'inline-block'});
                            //$('.user-info').html('');
                            //let userInfo =  `
                            //    <li class="menu-li user-info">
                            //        <img src="img/bd_logo1.png" alt="�û�ͷ��"/>
                            //        <div class="user-more">
                            //            <span class="user-name">${userName}</span>
                            //            <span class="welc-user">��ӭ��¼ӥ����</span>
                            //        </div>
                            //        <span class="quit-box">
                            //            <a href="javascript:void(0);" class="quit"><i class="icon iconfont icon-tuichudenglu"></i><span>�˳�</span></a>
                            //        </span>
                            //    </li>`;
                            //$('.product-list').append(userInfo);
                            //$('.sign-btn').remove()
                        }else{
                            alert(data.msg);
                        }
                    }
                })
            };
        });
        //���ע�ᰴť
        $(document).on('click','.sign-in-btn',function(){
            var account = $('#sign-user-tel').val();
            var registerValue = $('#sign-user-key').val();
            var code = $('#codeVal').val();
            telWarn('#sign-user-tel');
            keyWarn('#sign-user-key');
            codeWarn('#codeVal');
            if(account.length===11 && (/^1[3|4|5|8][0-9]\d{4,8}$/.test(account)) && account.length>=6 & account.length<=20&&code!=""){
                $('.loading').show();//���ּ��ؽ���
                $.ajax({
                    type:'post',
                    url:url+'/yys/register',
                    xhrFields: { withCredentials: true },
                    data:{
                        "account":account,
                        "registerValue":registerValue+'###no',
                        "code":code
                    },
                    success:function(data){
                        $('.loading').hide();
                        if(data.code ===200){
                            $('.register').hide();
                        }else{
                            alert(data.msg);
                        }
                    }
                })
            }
        });
        //��֤�붨ʱ��
        function sendCode(myCode,myTel,myId){
            $(myCode).on('click',function(){
                var mobile = $(this).parent().siblings(myTel).children(myId);
                if(mobile.val().length!=11||!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile.val()))){
                    mobile.siblings('.red').show();
                    mobile.parent().removeClass('correct');
                    mobile.parent().addClass('error');
                }else{
                    $.ajax({
                        type:'get',
                        url:url+'/yys/code/get?mobile='+mobile.val()+'&'+'serviceType='+serviceType,
                        xhrFields: { withCredentials: true },
                        success:function(data){
                            if(data.code ===200){
                                restCode();
                            }else{
                                alert(data.msg);
                            }
                        }
                    })
                }
            })
            function restCode(){
                $(myCode).hide();
                $(myCode).siblings('.disable-btn').show();
                $(myCode).siblings('.code-date').html('60');
                var second = 60;
                var timer = null;
                timer = setInterval(function(){
                    second -=1;
                    if(second>-1){
                        $(myCode).siblings('.disable-btn').children('.code-date').html(second);
                    }else{
                        clearInterval(timer);
                        $(myCode).show();
                        $(myCode).siblings('.disable-btn').hide();
                    }
                },1000)
            }
        }
        tabChange($('.tab-title span'),'selected');
        close();
        sendCode('#code','.user-name','#sign-user-tel');//ע���ֻ���֤
        sendCode('#get_code','.r0','#f-userTel');//�һ������ֻ���֤
    })();

    //�˳���¼
    function quit(){
        $.ajax({
            type:"post",
            url:url+"/yys/logout/",
            xhrFields: {withCredentials: true},
            success:function(data){
                if(data.code===200){
                    //$('.sign-btn').html('');
                    //let signBtn = `
                    //<li class="menu-li sign-btn">
                    //    <a href="javascript:void(0);" id="log-in"><i class="icon iconfont icon-denglu1"></i>��¼</a>
                    //    <a href="javascript:void(0);" id="sign-in"><i class="icon iconfont icon-zhuce1"></i>���ע��</a>
                    //</li>`
                    //$('.product-list').append(signBtn);
                    //$('.user-info').remove();
                    $('.user-info').hide();
                    $('.sign-btn').show();
                }else{
                    alert(data.msg);
                }
            }
        })
    }
    $(document).on('click','.quit',function(){
        quit();
    })
    //quit();

    //ӥ������Ϣ����tab�л�
    function InfoTab(){
        var li = $('#left-nav>li');
        var content = $('.info-cnt');
        for(var i = 0,max=li.length;i<max;i++){
            (function(i){
                li[i].addEventListener('click',function(){
                    li.removeClass('info-active');
                    $(this).addClass('info-active');
                    content.hide().eq(li.index(this)).show();
                });
            })(i);
        }
        $(document).on('click','.close-btn',function(){
            $('.client-info').fadeOut();
        });
    };
    InfoTab();
})
//�ȴ�ҳ��ʱ��
var second = "00";
var minute = "00";
function timeAdd(){
    second++;
    switch(true){
        case second<10:
            second="0"+second;
            break;
        case second>59:
            minute++;
            second="00";
            if(minute<10){
                minute="0"+minute;
            }
            break;
        case second>15:
            $('.yys-warn').fadeIn();
            break;
        default:
            break;
    }
    $('.time-second').text(second);
    $('.time-minute').text(minute);
}

//�رյȴ�ҳ��
function closeLoad(){
    $('.loading-layer').hide();
    window.clearInterval(myTime);//ֹͣ�ȴ�ʱ�䶨ʱ��
    second = "00";
    minute = "00";
    $('.time-second').text(second);//��ʼ����ʱ��ʱ��
    $('.time-minute').text(minute);
}

//����ȴ�ʱ��رհ�ť
$(document).on("click",".close-load",function(){
    closeLoad();
})
function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
}
$(function(){
    if(!placeholderSupport()){   // �ж�������Ƿ�֧�� placeholder
        $(document).ready(function(){
            function addPlaceholder(id){
                //Ĭ�ϱ���ѭ�����placeholder
                $(id).each(function(){
                    $(this).parent().append("<span class='placeholder'>"+$(this).attr('placeholder')+"</span>");
                })
                $(id).keyup(function(){
                    if($(this).val()!=""){  //�����ǰֵ��Ϊ�գ�����placeholder
                        $(this).parent().find('span.placeholder').hide();
                    }
                    else{
                        $(this).parent().find('span.placeholder').show();
                    }
                })
            }
            addPlaceholder('#search-text');
            addPlaceholder('#user-tel');
            addPlaceholder('#user-key');
            addPlaceholder('#sign-user-tel');
            addPlaceholder('#sign-user-key');
            addPlaceholder('#codeVal');
            addPlaceholder('#f-userTel');
            addPlaceholder('#f-codeVal');
            addPlaceholder('#f-sign-user-key');
            addPlaceholder('#f-sign-user-key2');
        });
    }
});