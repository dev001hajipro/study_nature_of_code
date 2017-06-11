/// <reference path="../../p5.global-mode.d.ts" />
class Oscillator {
    constructor(aVelocity, amplitude) {
        this.angle = 0;
        this.aAcceleration = 0;
        this.aVelocity = aVelocity;
        this.amplitude = amplitude;// 振幅
    }
    applyAAcceleration(a) {
        this.aAcceleration = a;
    }
    oscillate() {
        this.aVelocity += this.aAcceleration;
        this.angle += this.aVelocity;
        this.aAcceleration = 0;
    }
    display() {
        let x = this.amplitude.x * cos(this.angle);
        let y = this.amplitude.y * sin(this.angle);
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
    let amplitude = createVector(100, 100);
    o = new Oscillator(0.001, amplitude);
    createP('ランダムではない速度と振幅');
}
function draw() {
    background(240);
    o.applyAAcceleration(0.0001);
    o.oscillate();
    o.display();
}
