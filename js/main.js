

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


    const frameRate = 60;
    this.frameInterval = 1000 / frameRate;
    this.lastFrame = 0;
}


/**
 * Create dots animation
 */
function drawDots() {
    this.anim = new Dots();
    window.requestAnimationFrame(draw);
}


/**
 * Create tetris background
 */
function drawTetris() {
    this.anim = new Tetris();
    window.requestAnimationFrame(draw);
}

/**
 * Animation loop
 */
function draw() {

    let time = Date.now();
    let dif = time - this.lastFrame;

    if (dif > this.frameInterval) {
        this.lastFrame = time;

        this.anim.update();
        this.anim.render();
    }
    window.requestAnimationFrame(draw);
}

console.log("Welcome! :D");


function setupFooter() {
    document.body.innerHTML = document.body.innerHTML + 
        '<div class="footer">' +
        '<a href="http://u.gg" target="_blank">Contacto</a>' +
        '<a href="images/background/background.png" download="hola">CV</a>' +
        '<a href="curriculum.html" target="_blank">About</a>' +
        '</div>';
}

function setupGoTop() {
    document.body.innerHTML = '<button id="go_top" onclick="onGoTop()">&times;</button>' + document.body.innerHTML;
    this.goTopButton = document.getElementById("go_top");
    this.goTopButton.style.display = "none";

}