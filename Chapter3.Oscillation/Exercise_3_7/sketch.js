/// <reference path="../../p5.global-mode.d.ts" />
class Oscillator {
    constructor(aVelocity, amplitude) {
        this.angle = createVector(0, 0);
        this.aVelocity = aVelocity;
        this.amplitude = amplitude;// 振幅
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
let os;
function setup() {
    createCanvas(400, 400);
    let yv = 0.01;
    let yv2 = 0.01;
    let c = 100;
    os = new Array(20).fill(0).map(n=>{
        let v = createVector(0.05, 0.001);
        let a = createVector(radians(c), 10);
        c += 150;
        return new Oscillator(v, a);
    });
    createP('ランダムではない速度と振幅');
}
function draw() {
    background(240);
    os.forEach(e=> {
        e.oscillate();
        e.display();
    });
}
