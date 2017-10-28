var url = "http://115.29.230.132:86"
var searchType = 1;
var country = "null";
var myTime=setInterval("timeAdd()",1000);
$(function(){
    console.log(countryJson)
    $.ajax({
        type:"get",
        xhrFields: { withCredentials: true },
        url:url+"/yys/sightseer",
        success:function(data){
        }
    });
    //点击切换搜索内容
    function appendCountry(){
        var allCountry = countryJson.dyz.concat(countryJson.fz).concat(countryJson.mz).concat(countryJson.oz).concat(countryJson.yz);
        console.log(allCountry);
        var selectBox = "<option value='null'>通用引擎</option>"
        for(var i= 0,max=allCountry.length;i<max;i++){
            var optionName = allCountry[i].typename;
            var optionId = allCountry[i].id;
            var optionCode = allCountry[i].code;
            var countryLi = `<option value="${optionCode}">${optionName}</option>`;
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

//主页搜索
//鹰眼一下
//    $(function(){
        function searchIndex(){
            var searchWord = $('#search-text').val().replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');//去掉首尾空格
            country = $('#countryName option:selected').val();
            if(searchType===3){
                second = "00";
                minute = "00";
                window.clearInterval(myTime);
                myTime=setInterval("timeAdd()",1000);
                $('.loading-layer').fadeIn();
                $.ajax({
                    type:"post",
                    url:url+"/yys/search",
                    xhrFields: { withCredentials: true },
                    data:{
                        "searchType":searchType,
                        "searchWord":searchWord,
                        "currentPage":1
                    },
                    success:function(data){
                        $('.loading-layer').fadeOut();
                        if(data.code===200){
                            $('.client-info').fadeIn();
                        }else{
                            if(data.code===103){
                                $('.emailBody').html('');
                                var pageSize = data.data.page.pageSize;//不同权限下所能展示的邮箱数量
                                var myEmail = data.data.result.emails;//所有邮箱
                                for(var i= 0,max=pageSize;i<max;i++){
                                    var emailUrl = myEmail[i].email;
                                    var emailTr = `
                                        <tr>
                                            <td><a href="${emailUrl}" class="info-email">${emailUrl}</a></td>
                                            <td><a href="#" class="info-vertify">验证</a></td>
                                            <td><a href="#" class="info-contact">立刻联系</a></td>
                                        </tr>`
                                    $('.emailBody').append(emailTr);
                                }
                                $('#lostNum').html(myEmail.length-pageSize);
                                $('.client-info').fadeIn();
                                //var t = confirm(data.msg);
                                //if(t){
                                //    location.href="buy.html"
                                //}else{
                                //
                                //}
                            }
                        }
                    }
                });
            }else{
                $('.yys-loading').show();
                if(searchWord!=""){
                    $.ajax({
                        type:"post",
                        url:url+"/yys/search",
                        xhrFields: { withCredentials: true },
                        data: {
                            searchType: searchType,
                            searchWord: searchWord,
                            country: country,
                            currentPage: 1
                        },
                        success:function(){
                            $('.yys-loading').hide();
                            location.href = "result.html?"+"searchType="+searchType+"&"+"searchWord="+searchWord+"&"+"country="+country;
                        }
                    });
                }else{
                    location.href = "index.html"
                }
            }
        }
        $(document).on('click','#searchBtnIndex',function(){
            searchIndex();
        });
        $('#search-text').on("focus",function(){
            document.onkeydown = function(e){
                var ev = document.all ? window.event : e;
                if(ev.keyCode==13) {
                    searchIndex();
                }
            }
        })
    //});
})
