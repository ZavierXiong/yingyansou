$(function(){
    var li = $(".infoBox");
    for(var i=0,max=li.length;i<max;i++){
        li[i].addEventListener('click',function(){
            li.removeClass('selected');
            $(this).addClass('selected');
        })
    }
})
function autoScroll(obj){
    $(obj).find("ul").stop(false, true).animate({
        marginTop : "-36px"
    },1000,function(){
        $(this).css({marginTop : "0px"}).find("li:first,li:nth-child(2),li:nth-child(3)").appendTo(this);
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