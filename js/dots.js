class Dots {
    constructor() {
        let canvas = document.getElementById("canvas");
        canvas.width = document.body.scrollWidth;;
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        this.p = [];
        let inv_density = 5000;
        let space = this.width * this.height;
        let size = Math.round(space / inv_density);
        let f = () => new Particle(-100 + Math.random() * (this.width + 200), -100 + Math.random() * (this.height + 200), 2);
        for (let i = 0; i < size; i++)
            this.p.push(f());

        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.save();
    }

    update() {
        let width = this.width;
        let height = this.height;
        this.p.forEach(function (value, idx) {
            value.update(width, height);
        })
    }

    render() {

        let ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        this.p.forEach(function (value, idx, arr) {

            arr.forEach(function name(otro) {
                ctx.beginPath();

                const maxDistance = 100;
                let dist = Vector.distance(value.pos, otro.pos);
                if (dist < maxDistance) {
                    ctx.moveTo(otro.pos.x, otro.pos.y);
                    ctx.lineTo(value.pos.x, value.pos.y);

                    let t = 1 - Math.pow(dist / maxDistance, 2);
                    ctx.strokeStyle = "rgba(255, 255, 255," + t + ")";

                    ctx.stroke();
                }
            });

            ctx.restore();
            value.render(ctx);
        })



        // let url = this.canvas.toDataURL();
        // document.getElementById("id").style.background='url('+url+')'
    }
}


class Particle {

    constructor(x, y, size) {
        this.pos = new Vector(x, y);
        this.dir = Vector.randomDir();
        this.size = size;
    }

    update(width, height) {
        this.pos.add(this.dir);
        this.clampBorders(width, height);
    }

    clampBorders(width, height) {
        let nuevapos = this.pos.clone();

        if (nuevapos.x < -100)
            nuevapos.x = width + 100;
        else if (nuevapos.x > width + 100)
            nuevapos.x = -100;

        if (nuevapos.y < -100)
            nuevapos.y = height + 100;
        else if (nuevapos.y > height + 100)
            nuevapos.y = -100;

        this.pos = nuevapos;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2, true);
        ctx.fill();
    }
}