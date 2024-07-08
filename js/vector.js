
/**
 * Implementation of a 2D vector
 */
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds two vectors together in place
     * @param {Vector} other 
     */
    add(other) {
        this.x += other.x;
        this.y += other.y;
    }
    /**
     * Subtracts two vectors together in place
     * @param {Vector} other 
     */
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
    }

    /**
     * Returns a new copy of the vector
     */
    clone() {
        return new Vector(this.x, this.y);
    }

    /**
     *  Normalizes the vector in place
     */
    normalize() {
        let mgtd = this.magnitude();
        this.x /= mgtd;
        this.y /= mgtd;
    }


    multiply(numb){

        this.x *= numb;
        this.y *= numb;
    }


    /**
     * Calculates the magnitude of the vector using Pithagoras threorem
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Writes the vector in the terminal
     */
    print(){
        console.log(this.x + " " + this.y);
    }

    /**
     * Creates a random vector 
     * @param {number} w width
     * @param {number} h height
     */
    static random(w = 1, h = 1) {
        return new Vector(Math.random() * w, Math.random() * h);
    }

    /**
     * Craate a random vector inside the unit circle
     */
    static unitCircle() {
        let a = new Vector(-1 + Math.random() * 2, -1 + Math.random() * 2);
        a.normalize();
        return a;
    }

    /**
     * Distance between two vectors
     */
    static distance(a, b) {
        let v = a.clone();
        v.subtract(b);
        return v.magnitude();
    }
}