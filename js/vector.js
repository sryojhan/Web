class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(otro) {
        this.x += otro.x;
        this.y += otro.y;
    }

    subtract(otro) {
        this.x -= otro.x;
        this.y -= otro.y;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    normalize() {
        let mgtd = this.magnitude();
        this.x /= mgtd;
        this.y /= mgtd;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }


    print(){
        console.log(this.x + " " + this.y);
    }
    static random(v = 1, w = 1) {
        return new Vector(Math.random() * v, Math.random() * w);
    }

    static randomDir() {
        let a = new Vector(-1 + Math.random() * 2, -1 + Math.random() * 2);
        a.normalize();
        return a;
    }

    static distance(a, b) {
        let v = a.clone();
        v.subtract(b);
        return v.magnitude();
    }
}