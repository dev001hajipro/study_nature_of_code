/// <reference path="../../p5.global-mode.d.ts" />
function drawCircle(x,y,r) {
    stroke(0);
    noFill();
    ellipse(x, y, r, r);
    if (r > 2) {
        drawCircle(x + r/2, y, r/2);
        drawCircle(x - r/2, y, r/2);
    }
}
function setup() {
    createCanvas(640, 360);
}
function draw() {
    background(240);
    drawCircle(width/2, height/2, 200);
}