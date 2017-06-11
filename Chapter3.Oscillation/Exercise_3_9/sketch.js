/// <reference path="../../p5.global-mode.d.ts" />
let startAngle = 0;
let aVelocity = 0.3;
function setup() {
    createCanvas(800, 200);
}
const cSize = 50;
const cHalf = cSize / 2;
function draw() {
    background(240,240,250);

    let angle = startAngle;
    for (let x = 0; x <= width; x +=cHalf) {
        //let y = map(sin(angle), -1, 1, 0, height);
        let y = map(noise(angle), 0, 1, 0, height);
        fill(0, 20);
        stroke(0, 150);
        ellipse(x, y, cSize, cSize);
        angle += aVelocity;
    }

    startAngle +=0.01;
}