$(function(){
    (function(){
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
                            $(this).siblings('.tip-li').children('.dropdown-menu').hide(200);
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

    $('#myPage').jqPaginator({
        totalPages: 100,
        visiblePages: 10,
        currentPage: 1,
        pagesize:5,
        first: '<li class="first"><a href="javascript:void(0);">��ҳ</a></li>',
        prev: '<li class="prev"><a href="javascript:void(0);">��һҳ</a></li>',
        next: '<li class="next"><a href="javascript:void(0);">��һҳ</a></li>',
        last: '<li class="last"><a href="javascript:void(0);">���һҳ</a></li>',
        page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
        onPageChange: function (num, type) {
            $('#text').html('��ǰ��' + num + 'ҳ');
        }
    });
})

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
        console.log("aaa");
        clearInterval(scroll);
    },function(){
        scroll=setInterval('autoScroll("#FontScroll")',1500);
    });
});