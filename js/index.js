$(function(){
    //点击切换搜索内容
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
                            myText.attr('placeholder','小提示：当选择国家引擎时，输入本土语言关键词搜索效果更佳');
                            lang.stop(true,false).fadeIn(400);
                            break;
                        case 1:
                            myText.attr('placeholder','1232');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        case 2:
                            myText.attr('placeholder','请输入3');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        case 3:
                            myText.attr('placeholder','请输入4');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        case 4:
                            myText.attr('placeholder','请输入5');
                            lang.stop(true,false).fadeOut(400);
                            break;
                        default:
                            break;
                    }
                });
            })(i)
        }
    })();
    (function(){
        function tabChange(name,clas){
            for(var i= 0,max = name.length;i<max;i++){
                (function(i){
                    name[i].addEventListener('click',function(){
                        name.removeClass(clas);
                        $(this).addClass(clas);
                        if(i===0){
                            $('.sign-in-btn').hide();
                            $('.log-in-btn').show();
                            $('.code-box').hide();
                        }else{
                            $('.log-in-btn').hide();
                            $('.sign-in-btn').show();
                            $('.code-box').show();
                        }
                    })
                })(i)
            }
        }

        //关闭登录注册弹框
        function close(){
            $('#close-sign').on('click',function(){
                $('.sign-in,.dialog-mask').fadeOut(200);
                $('.password-warn').hide();
                $('.user-warn').hide();
                $('#user-tel').val("");
                $('#user-key').val("");
            })
        }

        function logIn(){
            $('#log-in').on('click',function(){
                $('.sign-in,.dialog-mask').fadeIn(200);
                $('.sign-in-btn').hide();
                $('.log-in-btn').show();
                $('.code-box').hide();
                $('.log-in-title').addClass('selected');
                $('.sign-in-title').removeClass('selected');
            })
        }
        function signIn(){
            $('#sign-in').on('click',function(){
                $('.sign-in,.dialog-mask').fadeIn(200);
                $('.log-in-btn').hide();
                $('.sign-in-btn').show();
                $('.code-box').show();
                $('.sign-in-title').addClass('selected');
                $('.log-in-title').removeClass('selected');
            })
        }

        function logInTo(){
            $('.log-in-btn').on('click',function(){
                if($('#user-tel').val().length!=11||!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($('#user-tel').val()))){
                    $('.user-warn').show();
                }else if($('#user-key').val()===""||$('#user-key').val().length<6||$('#user-key').val().length>20){
                    $('.user-warn').hide();
                    $('.password-warn').show();
                }else{
                    $('.password-warn').hide();
                    $('.user-warn').hide();
                    $('.loading').show();//出现加载界面
                }
            });
            $('#user-tel').on('blur',function(){
                if($('#user-tel').val().length!=11||!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($('#user-tel').val()))){
                    $('.user-warn').show();
                }else{
                    $('.user-warn').hide();
                }
            });
            $('#user-key').on('blur',function(){
                if($('#user-key').val().length<6||$('#user-key').val().length>20){
                    $('.password-warn').show();
                }else{
                    $('.password-warn').hide();
                }
            })
        }
        function signInTo(){
            $('.sign-in-btn').on('click',function(){
                if($('#user-tel').val().length!=11||!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($('#user-tel').val()))){
                    $('.user-warn').show();
                    $('.password-warn').hide();
                }else if($('#user-key').val()===""||$('#user-key').val().length<6||$('#user-key').val().length>20){
                    $('.user-warn').hide();
                    $('.password-warn').show();
                }else{
                    $('.password-warn').hide();
                    $('.user-warn').hide();
                    $('.loading').show();//出现加载界面
                }
            });
            $('#user-tel').on('blur',function(){
                if($('#user-tel').val().length!=11||!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($('#user-tel').val()))){
                    $('.user-warn').show();
                }else{
                    $('.user-warn').hide();
                }
            });
            $('#user-key').on('blur',function(){
                if($('#user-key').val().length<6||$('#user-key').val().length>20){
                    $('.password-warn').show();
                }else{
                    $('.password-warn').hide();
                }
            })
        }

        //验证码定时器
        function sendCode(){
            $('#code').on('click',function(){
                if($('#user-tel').val().length!=11||!(/^1[3|4|5|8][0-9]\d{4,8}$/.test($('#user-tel').val()))){
                    $('.user-warn').show();
                }else{
                    restCode();
                }
            })
            function restCode(){
                $("#code").hide();
                $("#disable-code").show();
                $("#code-date").html('5');
                var second = 5;
                var timer = null;
                timer = setInterval(function(){
                    second -=1;
                    if(second>0){
                        $('#code-date').html(second);
                    }else{
                        clearInterval(timer);
                        $("#code").show();
                        $("#disable-code").hide();
                    }
                },1000)
            }
        }
        tabChange($('.tab-title span'),'selected');
        close();
        logIn();
        signIn();
        logInTo();//点击登录按钮
        signInTo();//点击注册的按钮
        sendCode();
    })();
})