

/**
 * This class draws the dots in the main menu
 */

class Dots {
    constructor() {
        let canvas = document.getElementById("canvas");
        canvas.width = document.body.scrollWidth;;

        //Store information as an attribute
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext("2d");
        this.particles = [];
        this.createParticles(5000);


        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.save();
    }

    /**
     * Creates new particles based on a density, this way, the number of particles adapt based
     * on the size of the canvas
     * @param {number} particleDensity 
     */
    createParticles(particleDensity){
        let inv_density = particleDensity;
        let space = this.width * this.height;
        let size = Math.round(space / inv_density);
        let f = () => new Particle(-100 + Math.random() * (this.width + 200), -100 + Math.random() * (this.height + 200), 2);
        for (let i = 0; i < size; i++)
            this.particles.push(f());

    }

    
    update() { 
        let width = this.width;
        let height = this.height;
        this.particles.forEach(function (value, idx) {
            value.update(width, height);
        })
    }

    render() {

        let ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);

        this.particles.forEach(function (value, idx, particleArray) {

            for(let i = idx + 1; i < particleArray.length; i++) //Draw a line from every particle to the others
            {
                let otro = particleArray[i];
                ctx.beginPath();

                const maxDistance = 100;
                let dist = Vector.distance(value.pos, otro.pos);

                if (dist < maxDistance) {  //Only draw the line passed a threshold
                    ctx.moveTo(otro.pos.x, otro.pos.y);
                    ctx.lineTo(value.pos.x, value.pos.y);

                    let t = 1 - Math.pow(dist / maxDistance, 2); //The color of the line is proportional to the distance
                    ctx.strokeStyle = "rgba(255, 255, 255," + t + ")";

                    ctx.stroke();
                }
            }

            //ctx.restore();
            value.render(ctx);
        })
    }
}

/**
 * Class storing the information of each of the dots of the animation
 */
class Particle {

    constructor(x, y, size) {
        this.pos = new Vector(x, y);
        this.dir = Vector.unitCircle();
        this.size = size;
    }

    update(width, height) {
        this.pos.add(this.dir);
        this.clampBorders(width, height);
    }

    /**
     * Check if the particle has left the border of the canvas, and move its position
     */
    clampBorders(width, height) {
        let newpos = this.pos.clone();

        if (newpos.x < -100)
            newpos.x = width + 100;
        else if (newpos.x > width + 100)
            newpos.x = -100;

        if (newpos.y < -100)
            newpos.y = height + 100;
        else if (newpos.y > height + 100)
            newpos.y = -100;

        this.pos = newpos;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2, true); //Draw a circle
        ctx.fill();
    }
}