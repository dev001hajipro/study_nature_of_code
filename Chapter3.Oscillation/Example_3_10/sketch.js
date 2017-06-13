/// <reference path="../../p5.global-mode.d.ts" />
let GRAVITY = 0.4;

class Pendulum {
    constructor(origin, r) {
        this.origin = origin;
        this.r = r;
        this.position = createVector(0, 0);
        this.angle = QUARTER_PI;
        this.aVelocity = 0.0;
        this.aAcceleration = 0.0;
        this.damping = 0.999; // 減衰
    }
    update() {
        this.aAcceleration = (-1 * GRAVITY / this.r) * sin(this.angle);

        this.aVelocity += this.aAcceleration;
        this.angle += this.aVelocity;

        this.aVelocity *= this.damping;
    }
    display() {
        this.position.set(this.r*sin(this.angle), this.r*cos(this.angle), 0);
        this.position.add(this.origin);

        stroke(0);
        line(this.origin.x, this.origin.y, this.position.x, this.position.y);
        fill(175);
        ellipse(this.position.x, this.position.y, 16, 16);
    }
    go() {
        this.update();
        this.display();
    }
}

let p;

function setup() {
    createCanvas(400, 400);
    p = new Pendulum(createVector(width/2, 0), 200);
}
function draw() {
    background(235);
    p.go();
}