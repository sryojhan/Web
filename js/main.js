window.onscroll = function () {
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


function init() {
    this.goTopButton = document.getElementById("go_top");
    this.goTopButton.style.display = "none";


    let frameRate = 60;
    this.frameInterval = 1000 / frameRate;
    this.lastFrame = 0;
}


function drawDots() {

    this.anim = new Dots();
    window.requestAnimationFrame(draw);
}


function drawTetris() {
    window.requestAnimationFrame(draw);
    this.anim = new Tetris();
}

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

