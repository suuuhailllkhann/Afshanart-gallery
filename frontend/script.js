$(window).scroll(function(){
    var scroll=$(window).scrollTop();

    if(scroll >= 10){
        $(".back_to_top").addClass("show_btn");
    } else{
        $('.back_to_top').removeClass("show_btn");
    }
});

AOS.init();