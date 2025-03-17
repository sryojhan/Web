
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







    const videos = document.querySelectorAll('video[data-source]');
    videos.forEach(video => {
        video.addEventListener('click', () => {
            if (!video.querySelector('source')) { // Verifica si ya tiene un <source>
                const source = document.createElement('source');
                source.src = video.getAttribute('data-source');
                source.type = 'video/mp4'; // Añade el tipo de video
                video.appendChild(source);
                video.load(); // Recarga el video para aplicar el nuevo source
            }
        });
    });
    console.log("Inicializacion tardia")


});