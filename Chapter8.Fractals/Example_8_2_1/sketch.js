/// <reference path="../../p5.global-mode.d.ts" />
function drawCircle(x,y,r) {
    stroke(230, 0, 255, 150);
    strokeWeight(2);
    fill(230, 0, 150, 50);

    //ellipse(x, y, r, r);
    rectMode(CENTER);
    rect(x, y, r, r);
    if (r > 2) {
        drawCircle(x + r/2, y, r/2);
        drawCircle(x - r/2, y, r/2);
    }
}
function setup() {
    colorMode(HSB, 255);
    createCanvas(640, 360);
}
function draw() {
    background(180, 80, 100, 100);
    drawCircle(width/2, height/2, 200);
}