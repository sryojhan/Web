window.onscroll = function () {

    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        if (typeof (this.goTopButton) != undefined)
            this.goTopButton.style.display = "block";
    }
    else {
        this.goTopButton.style.display = "none";
    }
}

function onGoTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0
}


function init() {
    this.goTopButton = document.getElementById("go_top");
    this.goTopButton.style.display = "none";
}


function drawDots() {
    window.requestAnimationFrame(draw);
    this.anim = new Dots();
}


function drawTetris() {
    window.requestAnimationFrame(draw);
    this.anim = new Tetris();
}

function draw() {

    this.anim.update();
    this.anim.render();

    window.requestAnimationFrame(draw);
}

