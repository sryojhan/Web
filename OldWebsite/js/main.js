

//Use this callback to display or hide the go top button
window.onscroll = function () {

    /*  Sometimes the onscroll method is called before the button has been created
    *   This is specially true when you refresh the page while having scrolled
    *   So before doing anything in the onscroll function, first check if the button exists
    */
    if (this.goTopButton == undefined)
        return;

    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100)
        this.goTopButton.style.display = "block";
    else
        this.goTopButton.style.display = "none";
}


function onGoTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0
}

/**
 * Initialize the main properties
 */
function init() {
    setupFooter();
    setupGoTop();

    initModal();

    //Initial target frameRate
    this.frameRate = 60;
    this.deltaTime = 1 / this.frameRate;
    this.lastFrame = Date.now();

    this.anim = [];

    anim = this.anim;
    window.requestAnimationFrame(draw);


    document.dispatchEvent(new CustomEvent('animationPrepared'));

}


/**
 * Create dots animation
 */
function drawDots() {
    this.anim.push(new Dots());
}


/**
 * Create tetris background
 */
function drawTetris() {
    this.anim.push(new Tetris());
}



/**
 * Animation loop
 */


function draw() {





    let time = Date.now();
    this.deltaTime = (time - this.lastFrame) * 0.001;

    this.lastFrame = time;

    if(this.deltaTime > 1){
        
        this.deltaTime = 1 / this.frameRate;
    }

    this.anim.forEach(element => {

        element.dt = this.deltaTime;

        element.update();
        element.render();

    });

    window.requestAnimationFrame(draw);
}


function setupFooter() {
    document.body.innerHTML = document.body.innerHTML +
        '<div class="footer">' +
        '<a href="index.html#Pagina">Sobre la página</a>' +
        '<a href="images/background/background.png" download="hola">Foto de un delfín</a>' +
        '<a href="About.html#Contacto">Contacto</a>' +
        '</div>';
}

function setupGoTop() {
    document.body.innerHTML = '<button id="go_top" onclick="onGoTop()">&#8593;</button>' + document.body.innerHTML;
    this.goTopButton = document.getElementById("go_top");
    this.goTopButton.style.display = "none";

}

function initModal(){


    modal = document.getElementById("myModal");

    if(!modal) return;

    var span = document.getElementsByClassName("close")[0];
    
    
    span.onclick = function() {
    
        modal.style.display = "none";
    }
    

    const navi = document.getElementById("contact");

    navi.addEventListener('mouseenter', () => {
        navi.style.animationPlayState = 'paused';
      });
      
      // Reanudar la animación cuando el ratón salga
      navi.addEventListener('mouseleave', () => {
        navi.style.animationPlayState = 'running';
    });

}

function ShowContact(){

    modal.style.display = "block";

}


document.addEventListener('mousedown', (event) => 
{
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
);
