/// <reference path="../../p5.global-mode.d.ts" />
let angle = 0;
let aVelocity = 0.05;
function setup() {
    createCanvas(400, 320);
}
function draw() {
    background(240);
    let amplitude = 100;
    let x = amplitude * cos(angle);
    angle += aVelocity;

    push();
    translate(width/2, height/2);
    ellipseMode(CENTER);
    ellipse(x, 0, 20, 20);
    pop();
}