/// <reference path="../../p5.global-mode.d.ts" />
class Oscillator {
    constructor() {
        this.angle = createVector(0, 0);
        this.aVelocity = createVector(random(-0.05,0.05), random(-0.05,0.05));
        this.amplitude = createVector(random(width/2), random(height/2)); // 振幅
    }
    oscillate() {
        this.angle.add(this.aVelocity);
    }
    display() {
        let x = this.amplitude.x * cos(this.angle.x);
        let y = this.amplitude.y * sin(this.angle.y);

        push();
        stroke(0);
        fill(175);
        translate(width/2, height/2);
        line(0, 0, x, y);
        ellipse(x, y, 16, 16);
        pop();
    }
}
let o;
function setup() {
    createCanvas(400, 400);
    o = new Oscillator();
}
function draw() {
    background(240);
    o.oscillate();
    o.display();
}
