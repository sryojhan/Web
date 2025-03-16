
$(document).ready(function(){
    var owl = $(".owl-carousel").eq(1).data('owlCarousel');
    
    var background = $("#testimonial-trigger");

    var backgrounds = ["url('img/skills/coding.png')", "url('img/skills/ui.png')", "url('img/skills/debugger.png')", "url('img/skills/management.png')"];

    owl.options.afterMove = function(){

        background.css('background-image', backgrounds[owl.currentItem]);
    }

    // Navegar a la página 1
    $("#gameplayProgramming").click(function(){
        owl.goTo(0, false); // [página, tiempo de transición]
    });

    // Navegar a la página 2
    $("#UIDevelopment").click(function(){
        owl.goTo(1, false); // [página, tiempo de transición]
    });

    // Navegar a la página 3
    $("#optimization").click(function(){
        owl.goTo(2, false); // [página, tiempo de transición]
    });

    $("#collaboration").click(function(){
        owl.goTo(3, false); // [página, tiempo de transición]
    });

});