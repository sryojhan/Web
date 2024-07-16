
function morphInit() {

    this.anim.push(new Morph());
    addEventListener("resize", (event) => { onWindowResize(); });
}

function onWindowResize() {

    for (let i = 0; i < this.anim.length; i++) {
        if ((this.anim[i] instanceof Morph)) {

            this.anim[i] = new Morph();
        }
    }
}

class Morph {


    constructor() {

        let canvas = document.getElementById("morphCanvas");
        this.canvas = canvas;

        canvas.style.width = '100%';
        canvas.style.height = '100%';

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        this.width = canvas.width;
        this.height = canvas.height;

        this.ctx = canvas.getContext("2d");


        this.mouseJustdown = false;
        this.mouseClicked = false;
        this.target_mouse_position = null;
        document.addEventListener('mousemove', (event) => { this.moveMouse(event) });
        document.addEventListener('mousedown', (event) => this.onMouseDown());
        document.addEventListener('mouseup', (event) => this.onMouseUp());


        /*
        
        
        TODO:  
        poner source over

        //Poner esto para la mascara
        ctx1.globalCompositeOperation = 'source-in';

        */


        this.size = 40;
        this.cluster = [];
        let clusters = document.getElementsByClassName("cluster");
        for (let i = 0; i < clusters.length; i++) {
            let c = new Cluster();
            c.SetMain(clusters[i], canvas, this);
            this.cluster.push(c);
        }



        const influenceAreaBoxSize = 40;
        const influenceWidth = Math.ceil(this.width / influenceAreaBoxSize);
        const influenceHeight = Math.ceil(this.height / influenceAreaBoxSize);


        let influenceMap = Array(influenceWidth).fill(Array(influenceHeight));

        const dummieCount = 25;
        this.dummies = [];
        for (let i = 0; i < dummieCount; i++) {
            let c = new Cluster();
            c.SetDummie(this, influenceMap, influenceAreaBoxSize);
            this.dummies.push(c)
        }

    }


    update() {

        this.cluster.forEach(element => {

            element.update();


        });

        // if (this.isMouseJustPressed()) {
        //     console.log(`${this.target_mouse_position.x - this.width * 0.5}, ${this.target_mouse_position.y}`);
        // }

    }

    render() {

        this.ctx.clearRect(0, 0, this.width, this.height);



        this.dummies.forEach(element => {

            if (this.expandingCluster) {

                if (this.expandingCluster.retract || !this.expandingCluster.expandCompleted) {
                    element.render();
                }
            } else
                element.render();

        });



        this.cluster.forEach(element => {


            if (this.expandingCluster) {

                if (this.expandingCluster !== element) {

                    if (this.expandingCluster.retract || !this.expandingCluster.expandCompleted) {
                        element.render();
                    }
                }
            }
            else {

                element.render();
            }

        });

        if (this.expandingCluster) {
            this.expandingCluster.render();
        }


        if (this.target_mouse_position) {

            let [x, y] = this.target_mouse_position.getComponents();

            this.drawCenteredCircle(x, y, this.size);
        }


        this.createGradient();

        this.createGradientDown();
        this.mouseJustdown = false;
    }


    createGradient() {

        const gradientHeight = 500;
        this.ctx.globalCompositeOperation = 'destination-over';


        const grad = this.ctx.createLinearGradient(0, this.height - gradientHeight, 0, this.height);
        grad.addColorStop(0, "#e598ab");
        grad.addColorStop(1, "white");

        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, this.height - gradientHeight, this.width, this.height);

        this.ctx.restore();

        this.ctx.globalCompositeOperation = 'source-over';

    }

    createGradientDown() {

        if (this.expandingCluster && !this.expandingCluster.retract) return;

        const downGradient = 50;

        const grad = this.ctx.createLinearGradient(0, this.height - downGradient, 0, this.height);
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        //grad.addColorStop(0, "black");
        grad.addColorStop(1, "rgba(255, 255, 255, 255)");

        this.ctx.fillStyle = grad;
        //this.ctx.fillRect(0, this.height - downGradient, this.width, this.height);
        this.ctx.fillRect(0, this.height - downGradient, this.width, this.height);

    }


    moveMouse(e) {

        let rect = this.canvas.getBoundingClientRect();

        let mouse_x = e.clientX - rect.left;
        let mouse_y = e.clientY - rect.top;

        this.target_mouse_position = new Vector(mouse_x, mouse_y);

    }

    onMouseDown() {

        this.mouseClicked = true;
        this.mouseJustdown = true;
    }

    onMouseUp() {

        this.mouseClicked = false;
    }

    drawCenteredCircle(x, y, rad = 40) {

        let ctx = this.ctx;

        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2 * Math.PI);
        ctx.fill();

        ctx.closePath();
        //ctx.lineWidth = 4;
        //ctx.stroke();

    }

    drawCenteredEllipse(x, y, radX, radY, rot = 0) {

        let ctx = this.ctx;

        ctx.beginPath();

        ctx.ellipse(x, y, radX, radY, rot, 0, Math.PI * 2)

        ctx.fill();
        ctx.closePath();

        //ctx.lineWidth = 4;
        //ctx.stroke();
    }

    beginEllipseMask(x, y, radX, radY, rot = 0) {

        let ctx = this.ctx;

        ctx.save();

        ctx.beginPath();
        ctx.ellipse(x, y, radX, radY, rot, 0, Math.PI * 2)
        ctx.closePath();
        ctx.clip();


        //ctx.lineWidth = 4;
        //ctx.stroke();
    }

    closeEllipseMask(x, y, radX, radY, rot = 0) {

        let ctx = this.ctx;

        ctx.restore();
        //ctx.lineWidth = 4;
        //ctx.stroke();
    }


    isMouseJustPressed() {
        return this.mouseJustdown;
    }


    setLineColor(col) {
        this.ctx.strokeStyle = col;
    }


    setFillColor(col) {
        this.ctx.fillStyle = col;
    }

    lerp(a, b, t) {

        return a + (b - a) * t;
    }

    vectorLerp(a, b, t) {

        return new Vector(
            this.lerp(a.x, b.x, t),
            this.lerp(a.y, b.y, t)
        );
    }

}

class Cluster {



    SetMain(element, canvas, morph) {

        this.morph = morph;
        this.dummie = false;
        this.element = element;

        let canvasRect = canvas.getBoundingClientRect();
        let rect = element.getBoundingClientRect();


        this.width = rect.right - rect.left;
        this.height = rect.bottom - rect.top;

        this.pos = new Vector(
            rect.left - canvasRect.left + this.width * 0.5,
            rect.top - canvasRect.top + this.height * 0.5
        );


        // this.pos = Vector.unitCircle();
        // this.pos.x = this.morph.width * 0.5 + this.pos.x * morph.width * 0.5;
        // this.pos.y = this.morph.height * 0.5 + this.pos.y * morph.height * 0.5;

        this.insideTimer = 0;
        this.insideTimeToExpand = 0.5;
        this.insideExpansion = 2;

        this.isInside = false;
        this.isExpanding = false;
        this.retract = false;
        this.size = Math.max(this.width, this.height);



        this.collisionPoint = 0.6;
        this.insidePoint = 0.95;
        this.maxDistance = 500;
        this.maxStretch = 1.3;
        this.maxOffset3d = 4;
        this.offsetMaxAmmount = 8 * (1 + Math.random() * 0.5);
        this.floatSpeed = 5 * (1 + Math.random() * 0.5);
        this.floatOffset = (Math.random() * this.offsetMaxAmmount);

        this.renderPosition = this.pos;

        this.imageLoaded = false;

        this.image = element.children[0];

        this.image.addEventListener("load", (e) => { this.imageLoaded = true; });

        this.expandTimer = 0;
        this.expandDuration = 0.5;


        this.minialAlpha = 0.1;
        this.maxAlpha = 0.9;

    }

    SetDummie(morph, influenceMap, influenceSize) {

        this.dummie = true;

        this.morph = morph;
        this.size = 10;


        let iterationCount = -1;
        const iterationMax = 10;
        do {

            iterationCount++;

            this.pos = Vector.unitCircle();
            this.pos.x = this.morph.width * 0.5 + this.pos.x * morph.width * 0.5;
            this.pos.y = this.morph.height * 0.5 + this.pos.y * morph.height * 0.5;


            var influenceX = Math.floor(this.pos.x / influenceSize);
            var influenceY = Math.floor(this.pos.y / influenceSize);


        } while (influenceMap[influenceX][influenceY] && iterationCount < iterationMax);

        influenceMap[influenceX][influenceY] = true;

        this.collisionPoint = 0.6;
        this.insidePoint = 0.95;
        this.maxDistance = 200;
        this.maxStretch = 1.1;
        this.maxOffset3d = 1;

        this.offsetMaxAmmount = 5 * (1 + Math.random() * 0.5);
        this.floatSpeed = 1 * (1 + Math.random() * 0.5);
        this.floatOffset = (Math.random() * this.offsetMaxAmmount);
    }

    render() {

        let pos = this.pos.clone();


        {
            function pingPong(time, length = 1) {
                let cycle = Math.floor(time / length);
                if (cycle % 2 === 0) {
                    return time % length;
                } else {
                    return length - (time % length);
                }
            }
            let a = pingPong(this.floatOffset, this.offsetMaxAmmount);
            pos.y -= a;
        }


        let size = this.size;
        let mouse = this.morph.target_mouse_position;

        let offset3d = 0;

        let rot = 0;



        if (this.isExpanding) {
            size = this.expand();
        }


        size = new Vector(size, size);

        const collisionPoint = this.collisionPoint;
        const insidePoint = this.insidePoint;
        const maxDistance = this.maxDistance;
        const maxStretch = this.maxStretch;
        const maxOffset3d = this.maxOffset3d;


        if (mouse) {
            let distance = Vector.distance(mouse, pos);


            if (distance < maxDistance) {

                let t = 1 - distance / maxDistance;

                function easeInExpo(x) {
                    return 1 - Math.sqrt(1 - Math.pow(x, 2));
                }


                let maxDistanceToCollision = t > collisionPoint ? 1 - collisionPoint : collisionPoint;

                let distanceFromCollisionPoint = 1 - (Math.abs(t - collisionPoint) / maxDistanceToCollision);

                if (!this.isExpanding || !this.expandCompleted) {
                    size.x = this.morph.lerp(size.x, size.x * maxStretch, distanceFromCollisionPoint);
                }
                pos = this.morph.vectorLerp(pos, mouse, easeInExpo(t));
                offset3d = this.morph.lerp(0, maxOffset3d, distanceFromCollisionPoint);

                rot = Vector.getAngle(mouse, pos);


                //Entran en contacto la esfera del raton con uno de los proyectos
                if (Vector.distance(pos, mouse) < size.x + this.morph.size) {

                }

                if (!this.dummie) {
                    //TODO: tener en cuenta el tamaño para saber si se encuentra completamente dentro o no
                    let isInside = t > insidePoint;

                    if (isInside && this.isInside) {

                        const insideTimeToExpand = this.insideTimeToExpand;

                        if (!this.isExpanding) {
                            if (this.insideTimer > insideTimeToExpand) {

                                if (!this.isExpanding) {
                                    this.expandCompleted = false;
                                    this.expandTimer = 0;
                                }

                                this.retract = false;
                                this.isExpanding = true;
                                this.morph.expandingCluster = this;
                            } else {

                                this.insideTimer += this.morph.dt;
                                size.multiply(this.morph.lerp(1, this.insideExpansion, this.insideTimer / insideTimeToExpand));
                            }
                        }

                    } else {

                        this.insideTimer -= this.morph.dt;

                        if (this.insideTimer <= 0)
                            this.insideTimer = 0;

                        if (isInside) this.isInside = true;
                        else {
                            this.isInside = false;


                        }
                    }
                }

            }

        }



        this.morph.setFillColor("red");
        this.morph.drawCenteredEllipse(pos.x + offset3d, pos.y, size.x, size.y, rot)

        this.morph.setFillColor("blue");
        this.morph.drawCenteredEllipse(pos.x - offset3d, pos.y, size.x, size.y, rot)



        if (this.morph.isMouseJustPressed() && !this.dummie) {
            this.morph.setFillColor("white");
        }

        else {
            this.morph.setFillColor("black");

        }



        this.renderPosition = pos;
        this.morph.drawCenteredEllipse(pos.x, pos.y, size.x, size.y, rot)

        if (this.imageLoaded) {

            this.morph.ctx.save();
            //poner source over
            //Poner esto para la mascara
            this.morph.ctx.globalCompositeOperation = 'source-atop';


            let alpha = this.minialAlpha;
            const centerAlpha = (this.minialAlpha + this.maxAlpha) * 0.5;

            if (!this.isExpanding) {


                alpha = this.morph.lerp(this.minialAlpha, centerAlpha, this.insideTimer / this.insideTimeToExpand);

                let maxSize = Math.max(this.insideExpansion, this.maxStretch);

                alpha = this.morph.lerp(this.minialAlpha, centerAlpha, ((size.x / this.size) - 1) / maxSize);

            } else {

                if (this.retract) {

                    alpha = this.morph.lerp(this.minialAlpha, this.maxAlpha, this.expandTimer / this.expandDuration);

                } else {

                    alpha = this.morph.lerp(centerAlpha, this.maxAlpha, this.expandTimer / this.expandDuration);
                }

            }



            this.morph.ctx.globalAlpha = alpha;

            let imgSize = size.x;

            let x = pos.x - imgSize;
            let y = pos.y - imgSize;

            this.morph.ctx.drawImage(this.image, x, y, imgSize * 2, imgSize * 2)

            this.morph.ctx.restore();
            this.morph.ctx.globalCompositeOperation = 'source-over';

        }

    }

    expand() {


        let cubicEaseOut = function (x) {
            return 1 - Math.pow(1 - x, 3);
        }

        if (this.morph.isMouseJustPressed() && this.expandCompleted) {
            this.retract = true;
            this.retractTimer = 0;
        }

        if (this.retract) {

            const retractDuration = 0.9;
            this.retractTimer += this.morph.dt;


            if (this.retractTimer > retractDuration) {

                this.insideTimer = 0;
                this.retract = false;
                this.isExpanding = false;
                this.morph.expandingCluster = null;
            }
            let t = cubicEaseOut(this.retractTimer / retractDuration);
            var size = this.morph.lerp(this.morph.width, this.size, t);

            this.expandTimer = this.expandDuration * (1 - t);

        } else {



            const expandDuration = this.expandDuration;

            if (this.expandTimer < expandDuration)
                this.expandTimer += this.morph.dt;
            else {
                this.expandCompleted = true;
            }



            size = this.morph.lerp(this.size, this.morph.width, cubicEaseOut(this.expandTimer / expandDuration));
        }

        this.morph.setFillColor("black");


        return size;

    }


    update() {

        if (this.dummie) return;

        this.floatOffset += this.morph.dt * this.floatSpeed;

        let centerPosition = this.morph.vectorLerp(this.renderPosition, this.pos, 0.5);

        this.element.style.left = `${centerPosition.x - this.width * 0.5}px`;
        this.element.style.top = `${centerPosition.y - this.height * 0.5}px`;

        if (this.morph.expandingCluster && !this.morph.expandingCluster.retract)
            this.element.style.display = "none";
        else
            this.element.style.display = "block";
    }
}