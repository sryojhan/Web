
class Tetris {
    constructor() {
        let lista = document.getElementById("lista");
        this.lista = lista;
        let canvas = document.getElementById("canvas");
        console.log(canvas);
        this.ctx = canvas.getContext("2d");
        canvas.style.backgroundRepeat = "no-repeat";
        canvas.style.position = "relative";

        canvas.style.width = '100%';
        canvas.style.height = window.innerHeight;
        canvas.width = canvas.offsetWidth;
        canvas.height = window.innerHeight;

        canvas.style.display = "none";

        let dataUrl = canvas.toDataURL();
        this.cambiarFondo(dataUrl);

        this.crearTablero();

        this.canvas = canvas;
        this.timer = 0;
        this.ultimaPieza = -1;
        this.nuevaPieza();

        this.perdiste = false;
        this.gris = false;
        this.contador = 0;

        this.tickTime = 0;
        for (let i = 0; i < 80; i++) {
            this.update();
        }
        this.tickTime = 15;

        // /*Borrar esta linea ->>>*/ this.tickTime = 5;

        let input = document.querySelector("input");
        input.addEventListener('input', this.updateResults);
        input.tetris = this;
    }

    updateResults(e) {
        let tetris = e.currentTarget.tetris;

        for (let element of tetris.lista.getElementsByTagName("li")) {
            let h1 = element.getElementsByTagName("h1")[0];
            let text = e.srcElement.value;
            if (h1.innerHTML.toLowerCase().includes(text.toLowerCase())) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }

    }

    cambiarFondo(dataUrl) {
        let lista = this.lista;
        lista.style.backgroundImage = 'url(' + dataUrl + ')';
        //lista.style.backgroundPositionX = lista.offsetLeft + "px";
        lista.style.backgroundPositionX = "center";
    }
    crearTablero() {
        this.ancho = 16;
        this.tablero = new Array(this.ancho);
        this.anchoPieza = canvas.width / this.ancho;
        this.alto = Math.floor(canvas.height / this.anchoPieza);

        for (let i = 0; i < this.ancho; i++) {
            this.tablero[i] = new Array(this.alto);
            for (let c = 0; c < this.alto; c++) {
                this.tablero[i][c] = false;
            }
        }
        let str = "->";
        for (let i = 0; i < this.ancho; i++) {
            this.tablero[i][this.alto - 1] = this.alto;
            str += this.tablero[i][this.alto - 1] + " ";
        }
        console.log(str);
        this.piezasColocadas = [];
    }

    update() {
        if (!this.perdiste && ++this.timer > this.tickTime) {
            this.timer = 0;

            let detener = false;
            let tablero = this.tablero;
            let piezasColocadas = this.piezasColocadas;

            this.pieza.forEach(element => {
                if (element.update()) {
                    detener = true;
                }
            });

            if (detener) {
                this.pieza.forEach(element => {
                    if (element.pos.y == 0) {
                        this.perdiste = true;
                        this.contador = 0;
                    }
                    else {
                        piezasColocadas.push(element);
                        tablero[element.pos.x][element.pos.y] = true;


                        tablero[element.pos.x][this.alto - 1] = Math.min(tablero[element.pos.x][this.alto - 1], element.pos.y);



                    }
                });
                let str = "->";
                for (let i = 0; i < this.ancho; i++) {
                    str += this.tablero[i][this.alto - 1] + " ";
                }
                console.log(str);
                this.nuevaPieza();
            } else {
                this.pieza.forEach(element => {
                    element.avanzar();
                });
            }

        }
    }

    render() {

        if (!this.perdiste) {
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.pieza.forEach(element => {
                element.render();
            });

            this.piezasColocadas.forEach(element => {
                element.render();
            });
        } else {

            if (++this.timer > this.tickTime / 4 * 3) {

                this.ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (this.contador > 7) {
                    if (this.contador == 8)
                        this.timer = 0;
                    this.gris = true;
                    if (this.timer > this.tickTime * 2) {
                        this.crearTablero();
                        this.perdiste =
                            false;
                    }
                    this.contador++;
                    return;
                }

                this.timer = 0;
                this.contador++;


                if (!this.gris) {
                    this.piezasColocadas.forEach(element => {
                        element.render();
                    });
                }

                this.gris = !this.gris;


            }

        }

        let dataUrl = canvas.toDataURL();
        this.cambiarFondo(dataUrl);
    }


    nuevaPieza() {

        /*
            Colores:
            Rojo:       "rgb(255, 89, 94)";
            Amarillo:   "rgb(255, 202, 58)";
            Verde:      "rgb(138, 201, 38)";
            Azul:       "rgb(25, 130, 196)";
            Morado:     "rgb(106, 76, 147)";



            Colores2: 
            F6CC6B
            FF5964
            C2B6FB
            E39DF0
            333138
        */
        let colores = ["#F6CC6B", "#FF5964", "#C2B6FB", "#FFC6FF", "#ffb4a2", "#A0C4FF", "#CAFFBF"];

        this.pieza = [];
        let r = Math.floor(Math.random() * 7);
        if (r == this.ultimaPieza) {
            r = Math.floor(Math.random() * 7);
        }
        let color = colores[r];

        switch (r) {
            case 0:  //Cubo
                {

                    let pos = new Vector(Math.floor(Math.random() * (this.ancho - 1)), 0);

                    let pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, pos, color);
                    this.pieza.push(pieza);
                    pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x, pos.y - 1), color);
                    this.pieza.push(pieza);
                    pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x + 1, pos.y), color);
                    this.pieza.push(pieza);
                    pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x + 1, pos.y - 1), color);
                    this.pieza.push(pieza);

                    break;
                }
            case 1: //linea
                {
                    if (Math.random() < .5) {

                        let pos = new Vector(Math.floor(Math.random() * (this.ancho - 3)), 0);
                        let pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, pos, color);
                        this.pieza.push(pieza);

                        pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x + 1, pos.y), color);
                        this.pieza.push(pieza);
                        pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x + 2, pos.y), color);
                        this.pieza.push(pieza);
                        pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x + 3, pos.y), color);
                        this.pieza.push(pieza);
                    } else {

                        let pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, null, color);
                        this.pieza.push(pieza);
                        let pos = pieza.pos;

                        pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x, pos.y - 1), color);
                        this.pieza.push(pieza);
                        pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x, pos.y - 2), color);
                        this.pieza.push(pieza);
                        pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x, pos.y - 3), color);
                        this.pieza.push(pieza);
                    }
                    break;
                }

            case 2: //T
                {
                    let pos = new Vector(1 + Math.floor(Math.random() * (this.ancho - 2)), 0);

                    let pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, pos, color);
                    this.pieza.push(pieza);

                    pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x + 1, pos.y), color);
                    this.pieza.push(pieza);
                    pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x - 1, pos.y), color);
                    this.pieza.push(pieza);
                    pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x, pos.y + 1), color);
                    this.pieza.push(pieza);
                    pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x, pos.y - 1), color);
                    this.pieza.push(pieza);

                    this.pieza.splice(Math.ceil(Math.random() * 3), 1);

                    break;
                }

            case 3: //Z
            case 4:
                {
                    let esquema = Math.random() > 0.5 ?
                        [[0, 1, 0],
                        [1, 1, 0],
                        [1, 0, 0]] :

                        [[1, 1, 0],
                        [0, 1, 1]];

                    let tipoZ = r == 3;

                    let pos = new Vector(Math.floor(Math.random() * (this.ancho - 2)), 0);


                    for (let y = 0; y < esquema.length; y++) {
                        for (let x = 0; x < esquema[y].length; x++) {
                            let nx = x;
                            if (tipoZ) {
                                nx = 2 - nx;
                            }
                            if (esquema[y][x] == 0)
                                continue;

                            let pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x + nx, pos.y - y), color);
                            this.pieza.push(pieza);
                        }
                    }

                    break;

                }
            case 5:
            case 6:
                {
                    let rotation = Math.random();
                    let esquema = rotation < .25 ?
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

                    let tipoL = r == 5;

                    let pos = new Vector(Math.floor(Math.random() * (this.ancho - 2)), 0);


                    for (let y = 0; y < esquema.length; y++) {
                        for (let x = 0; x < esquema[y].length; x++) {
                            let nx = x;
                            if (tipoL) {
                                nx = 2 - nx;
                            }
                            if (esquema[y][x] == 0)
                                continue;

                            let pieza = new Pieza(this.canvas, this.ctx, this.anchoPieza, this, new Vector(pos.x + nx, pos.y - y), color);
                            this.pieza.push(pieza);
                        }
                    }

                    break;
                }
        }

        this.ultimaPieza = r;
        this.posicionPieza();
    }




    posicionPieza() {
        let xmin = this.pieza[0].pos.x;
        let xmax = this.pieza[0].pos.x;
        this.pieza.forEach(element => {
            if (element.pos.x < xmin && element.pos.y == 0)
                xmin = element.pos.x;

            if (element.pos.x > xmax)
                xmax = element.pos.x;
        });

        let offset = -xmin;
        let finaloffset = offset;
        let posible = false;
        let minNumeroHuecos = 10;

        let altoMax = this.alto;
        for (let i = 0; i < this.ancho; i++) {
            altoMax = Math.min(altoMax, this.tablero[i][this.alto - 1]);
        }

        for (let y = this.alto - 2; y >= altoMax; y--) {
            for (let noffset = offset; noffset < this.ancho - xmax; noffset++) {
                posible = true;
                //if(y == this.alto - 2 || this.tablero[xmin + noffset][y + 1])
                //    aunHayPiezas = true;

                for (let element of this.pieza) {
                    let nx = element.pos.x + noffset;
                    let ny = y + element.pos.y;

                    if (nx < 0 || nx >= this.ancho)
                        posible = false;
                    else if (this.tablero[nx][ny])
                        posible = false;
                    else if (ny >= this.tablero[nx][this.alto - 1]) {
                        posible = false;
                    }
                    if (!posible)
                        break;

                }

                if (posible) {
                    let agujeros = 0;
                    this.pieza.forEach(element => {
                        let nx = element.pos.x + noffset;
                        let ny = y + element.pos.y;

                        if (ny < this.alto - 2) {
                            if (!this.tablero[nx][ny + 1])
                                agujeros++;
                        }
                    });

                    if (agujeros < minNumeroHuecos) {
                        minNumeroHuecos = agujeros;
                        finaloffset = noffset;
                    }
                }
            }
        }

        if (posible) {
            this.pieza.forEach(element => {
                console.log("recolocada");
                element.pos.x += finaloffset;
            });
        }

    }

}


class Pieza {
    constructor(canvas, ctx, size, tetris, pos = null, color = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.size = size;
        this.tetris = tetris;
        if (pos == null)
            this.pos = new Vector(Math.floor(Math.random() * tetris.ancho), 0);
        else this.pos = pos;

        this.color = color;
    }


    update() {
        return this.comprobar();
    }

    avanzar() {
        this.pos.y++;
    }

    comprobar() {
        if (this.pos.y == this.tetris.alto - 2) {
            return true;
        }

        if (this.pos.y >= 0 && this.tetris.tablero[this.pos.x][this.pos.y + 1]) {
            return true;
        }

        return false;
    }

    esValido() {

        return !(this.pos.x < 0 || this.pos.x >= this.canvas.width || this.pos.y >= this.canvas.height);
    }

    render() {
        if (this.color == null)
            this.ctx.fillStyle = "rgba(255, 0, 0, 1)";
        else this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.pos.x * this.size, this.pos.y * this.size, this.size, this.size);
    }
}