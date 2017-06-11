/// <reference path="../../p5.global-mode.d.ts" />
let startAngle = 0;
let aVelocity = 0.3;
function setup() {
    createCanvas(800, 200);
}
function draw() {
    background(240,240,250);

    let angle = startAngle;
    for (let x = 0; x <= width; x +=24) {
        let y = map(sin(angle), -1, 1, 0, height);
        fill(0, 20);
        stroke(0, 150);
        ellipse(x, y, 48, 48);
        angle += aVelocity;
    }

    startAngle +=0.02;
}