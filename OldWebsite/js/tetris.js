/**
 * Run a tetris simulation in the canvas
 */
class Tetris {
    constructor() {
        this.list = document.getElementById("lista");
        let canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");



        this.setCanvasStyle(canvas);


        this.changeBackground(canvas.toDataURL());
        this.createBoard();

        this.canvas = canvas;
        this.timer = 0;
        this.lastPiece = -1;
        this.newPiece();

        this.lost = false;
        this.blank = false;
        this.count = 0;

        this.tickTime = 0;   //Refresh rate
        for (let i = 0; i < 80; i++) {
            this.update();
        }
        this.tickTime = 15;
    }

    setCanvasStyle(canvas) {
        canvas.style.backgroundRepeat = "no-repeat";
        canvas.style.position = "relative";

        canvas.style.width = '100%';
        canvas.style.height = window.innerHeight;
        canvas.width = canvas.offsetWidth;
        canvas.height = window.innerHeight;

        canvas.style.display = "none";
    }

    changeBackground(dataUrl) {

        this.list.style.backgroundImage = 'url(' + dataUrl + ')';
        this.list.style.backgroundPositionX = "center";
    }

    createBoard() {
        this.width = 16;
        
        this.board = new Array(this.width);
        this.pieceWidth = canvas.width / this.width;
        this.height = Math.ceil(canvas.height / this.pieceWidth) + 1;

        //Initialize the 2d array to false
        for (let i = 0; i < this.width; i++) {
            this.board[i] = new Array(this.height);
            for (let c = 0; c < this.height; c++) {
                this.board[i][c] = false;
            }
        }

        //the last line of the board will contain numbers that represent the maximun height of that line
        for (let i = 0; i < this.width; i++) {
            this.board[i][this.height - 1] = this.height;
        }

        this.placedPieces = [];
    }

    update() {
        if (!this.lost && ++this.timer > this.tickTime) {
            this.timer = 0;

            let stop = false;
            let board = this.board;
            let placedPieces = this.placedPieces;

            //try to move each piece, and check if any of them has collided
            this.currentPiece.forEach(element => {
                if (element.check()) {
                    stop = true;
                }
            });

            if (stop) {
                //If the piece has collided, check if the game has been lost
                this.currentPiece.forEach(element => {
                    if (element.pos.y == 0) {
                        this.lost = true;
                        this.count = 0;
                    }
                    else {
                        //Place the piece in the board and update the values
                        placedPieces.push(element);
                        board[element.pos.x][element.pos.y] = true;
                        board[element.pos.x][this.height - 1] = Math.min(board[element.pos.x][this.height - 1], element.pos.y);

                    }
                });

                //In any case, create a new piece
                this.newPiece();
            } else {
                //If the piece wont collide in the next update, then move the piece
                this.currentPiece.forEach(element => {
                    element.move();
                });
            }

        }
    }

    render() {
        if (!this.lost) {
            //If the game isn't lost, render as usual
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);

            this.currentPiece.forEach(element => {
                element.render();
            });

            this.placedPieces.forEach(element => {
                element.render();
            });

        } else {

            //flick the canvas when the game is lost
            if (++this.timer > this.tickTime / 4 * 3) {

                this.ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (this.count > 7) { //When the canvas has stopoed flickering, wait a bit before restarting
                    if (this.count == 8)
                        this.timer = 0;
                    this.blank = true;
                    if (this.timer > this.tickTime * 2) {
                        this.createBoard();
                        this.lost = false;
                    }
                    this.count++;
                    return;
                }

                this.timer = 0;
                this.count++;

                if (!this.blank) {
                    this.placedPieces.forEach(element => {
                        element.render();
                    });
                }

                this.blank = !this.blank;
            }

        }

        let dataUrl = canvas.toDataURL();
        this.changeBackground(dataUrl);
    }


    newPiece() {

        let colores = ["#F6CC6B", "#FF5964", "#C2B6FB", "#FFC6FF", "#ffb4a2", "#A0C4FF", "#CAFFBF"];

        this.currentPiece = [];

        let r = Math.floor(Math.random() * 7); //Select a random piece
        if (r == this.lastPiece) {
            r = Math.floor(Math.random() * 7); //If it has been already selected, try again once
        }

        let color = colores[r]; //Set the color of the selected type of piece

        switch (r) {
            case 0:  //Cube
                {
                    let pos = new Vector(Math.floor(Math.random() * (this.width - 1)), 0);

                    let piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, pos, color);
                    this.currentPiece.push(piece);
                    piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x, pos.y - 1), color);
                    this.currentPiece.push(piece);
                    piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x + 1, pos.y), color);
                    this.currentPiece.push(piece);
                    piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x + 1, pos.y - 1), color);
                    this.currentPiece.push(piece);

                    break;
                }
            case 1: //line
                {
                    if (Math.random() < .5) { //Select rotation

                        let pos = new Vector(Math.floor(Math.random() * (this.width - 3)), 0);
                        let piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, pos, color);
                        this.currentPiece.push(piece);

                        piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x + 1, pos.y), color);
                        this.currentPiece.push(piece);
                        piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x + 2, pos.y), color);
                        this.currentPiece.push(piece);
                        piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x + 3, pos.y), color);
                        this.currentPiece.push(piece);
                    } else {

                        let piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, null, color);
                        this.currentPiece.push(piece);
                        let pos = piece.pos;

                        piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x, pos.y - 1), color);
                        this.currentPiece.push(piece);
                        piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x, pos.y - 2), color);
                        this.currentPiece.push(piece);
                        piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x, pos.y - 3), color);
                        this.currentPiece.push(piece);
                    }
                    break;
                }

            case 2: //T
                {
                    let pos = new Vector(1 + Math.floor(Math.random() * (this.width - 2)), 0);

                    let piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, pos, color);
                    this.currentPiece.push(piece);

                    piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x + 1, pos.y), color);
                    this.currentPiece.push(piece);
                    piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x - 1, pos.y), color);
                    this.currentPiece.push(piece);
                    piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x, pos.y + 1), color);
                    this.currentPiece.push(piece);
                    piece = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x, pos.y - 1), color);
                    this.currentPiece.push(piece);

                    this.currentPiece.splice(Math.ceil(Math.random() * 3), 1);

                    break;
                }

            case 3: //Z
            case 4:
                {
                    let blueprint = Math.random() > 0.5 ?
                        [[0, 1, 0],
                        [1, 1, 0],
                        [1, 0, 0]] :

                        [[1, 1, 0],
                        [0, 1, 1]];

                    let zType = r == 3;  //check if the piece should be flipped (there are two different z piece)

                    let pos = new Vector(Math.floor(Math.random() * (this.width - 2)), 0);


                    for (let y = 0; y < blueprint.length; y++) {
                        for (let x = 0; x < blueprint[y].length; x++) {
                            let xoffset = x;
                            if (zType) {
                                xoffset = 2 - xoffset;
                            }
                            if (blueprint[y][x] == 0)
                                continue;

                            let pieza = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x + xoffset, pos.y - y), color);
                            this.currentPiece.push(pieza);
                        }
                    }

                    break;

                }
            case 5: //L piece
            case 6:
                {
                    let rotation = Math.random();
                    let blueprint = rotation < .25 ?
                        [[0, 0, 1],
                        [1, 1, 1]]
                        : rotation < .5 ?

                            [[1, 1],
                            [0, 1],
                            [0, 1]]
                            : rotation < .75 ?

                                [[1, 1, 1],
                                [1, 0, 0]]
                                :

                                [[1, 0],
                                [1, 0],
                                [1, 1]];

                    let lType = r == 5;

                    let pos = new Vector(Math.floor(Math.random() * (this.width - 2)), 0);


                    for (let y = 0; y < blueprint.length; y++) {
                        for (let x = 0; x < blueprint[y].length; x++) {
                            let xoffset = x;
                            if (lType) {
                                xoffset = 2 - xoffset;
                            }
                            if (blueprint[y][x] == 0)
                                continue;

                            let pieza = new Block(this.canvas, this.ctx, this.pieceWidth, this, new Vector(pos.x + xoffset, pos.y - y), color);
                            this.currentPiece.push(pieza);
                        }
                    }

                    break;
                }
        }

        this.lastPiece = r;
        this.alignPiecePosition();
    }


    /**
     * Algorithm that places the piece in the best position it can find
     * It cannot rotate the piece or move it once it has started moving
     * This is not the best tetris solver algorithm but it is good enought for its purpose
     */

    alignPiecePosition() {
        //Find the smallest and greatest piece in the x coordinate
        let xmin = this.currentPiece[0].pos.x;
        let xmax = this.currentPiece[0].pos.x;
        this.currentPiece.forEach(element => {
            if (element.pos.x < xmin && element.pos.y == 0)
                xmin = element.pos.x;

            if (element.pos.x > xmax)
                xmax = element.pos.x;
        });


        let posible = false;
        let finaloffset = -xmin;
        let smallestHoleCount = Infinity;

        let maxHeight = this.height;
        for (let i = 0; i < this.width; i++) {
            maxHeight = Math.min(maxHeight, this.board[i][this.height - 1]);
        }

        /*
        Iterate the board from bottom to top and from left to right
        offset value is the maximun we can place a piece to the left before it reaches the wall

        */
        for (let yoffset = this.height - 2; yoffset >= maxHeight; yoffset--) {
            for (let xoffset = -xmin; xoffset < this.width - xmax; xoffset++) {

                posible = true;

                for (let element of this.currentPiece) { //Check it the piece can fit inside the bounds
                    let x = element.pos.x + xoffset;
                    let y = element.pos.y + yoffset;

                    if (x < 0 || x >= this.width)
                        posible = false;
                    else if (this.board[x][y])
                        posible = false;
                    else if (y >= this.board[x][this.height - 1]) {
                        posible = false;
                    }

                    if (!posible)
                        break;
                }


                if (posible) { //If the piece can be placed in that position, check the number of holes
                    let holes = 0;
                    this.currentPiece.forEach(element => {
                        let x = element.pos.x + xoffset;
                        let y = element.pos.y + yoffset;

                        if (y < this.height - 1) { //If it is not in the ground
                            if (!this.board[x][y + 1]) //if the place just below the block is not occupied, add a hole
                                holes++;
                        }
                    });

                    //If we found the smallest hole until now, update the smallest hole
                    if (holes < smallestHoleCount) {
                        smallestHoleCount = holes;
                        finaloffset = xoffset;
                    }
                }
            }
        }

        if (posible) { //If we found a spot to place the piece, move it
            this.currentPiece.forEach(element => {
                element.pos.x += finaloffset;
            });
        }
    }
}

/**
 * Each of the blocks that makes up a piece
 */
class Block {
    constructor(canvas, ctx, size, tetris, pos = null, color = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.size = size;
        this.tetris = tetris;

        if (pos == null)
            this.pos = new Vector(Math.floor(Math.random() * tetris.width), 0);
        else this.pos = pos;

        this.color = color;
    }

    /**
     * Move the piece down
     */
    move() {
        this.pos.y++;
    }

    /**
     * Check if the piece can move this frame or if it should stop
     * @returns returns true if the place is being occupied. False otherwise
     */
    check() {
        if (this.pos.y == this.tetris.height + 2) {

            return true;
        }

        /*
            Colision con el suelo
        */

        if (this.pos.y >= 0 && this.tetris.board[this.pos.x][this.pos.y + 1]) {


            
            return true;
        }

        return false;
    }

    /**
     * is the block inside the bound of the board?
     */
    isValid() {
        return !(this.pos.x < 0 || this.pos.x >= this.canvas.width || this.pos.y >= this.canvas.height);
    }

    render() {
        if (this.color == null)
            this.ctx.fillStyle = "rgba(255, 0, 0, 1)";
        else this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.pos.x * this.size, this.pos.y * this.size, this.size, this.size);
    }
}