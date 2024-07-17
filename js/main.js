

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


    //Initial target frameRate
    const frameRate = 60;
    this.frameInterval = 1000 / frameRate;
    this.deltaTime = 1 / frameRate;
    this.lastFrame = Date.now();

    this.anim = [];
    window.requestAnimationFrame(draw);
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