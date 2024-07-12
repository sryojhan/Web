
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
        return this;
    }
    /**
     * Subtracts two vectors together in place
     * @param {Vector} other 
     */
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
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

        return this;
    }


    multiply(numb){

        this.x *= numb;
        this.y *= numb;
        return this;
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
    static unitCircumference() {
        let a = new Vector(-1 + Math.random() * 2, -1 + Math.random() * 2);
        a.normalize();
        return a;
    }


    static unitCircle() {
        let a = new Vector(-1 + Math.random() * 2, -1 + Math.random() * 2);
        

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


    getComponents(){
        return [this.x, this.y];
    }


    static getAngle(a, b){

        let normalized = a.clone().subtract(b).normalize();



        return Math.atan2(normalized.y, normalized.x);

    }

}