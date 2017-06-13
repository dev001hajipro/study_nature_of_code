/// <reference path="../../p5.global-mode.d.ts" />
class Wave {
    constructor(angle, aVelocity, 
            x = 0, w = 100, 
            size = 48, startAngle = 0) {
        this.angle = angle;
        this.aVelocity = aVelocity;
        this.x = x;
        this.w = w;
        this.size = size;
        this.startAngle = startAngle;
    }
    update() {
        this.startAngle +=0.01;
    }
    display() {
        this.angle = this.startAngle;
        console.log(this.x, this.w, this.size/2);

        for (let _x = this.x, mx = this.x + this.w; _x <= mx; _x += (this.size/2)) {
            let y = map(sin(this.angle), -1, 1, 0, height);
            //let y = map(noise(this.angle), 0, 1, 0, height);
            fill(0, 20);
            stroke(0, 150);
            ellipse(_x, y, this.size, this.size);
            this.angle += this.aVelocity;
        }
    }
    run() {
        this.update();
        this.display();
    }
}
function setup() {
    createCanvas(800, 200);
    createP('Wave class');
    w1 = new Wave(0, 0.30, 100, 400, 20);
    w2 = new Wave(10, 0.31, 100, 450, 25);
}
function draw() {
    background(240,240,250);
    w1.run();
    w2.run();
}