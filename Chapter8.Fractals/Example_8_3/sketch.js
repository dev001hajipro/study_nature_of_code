/// <reference path="../../p5.global-mode.d.ts" />
var slider;
function drawCircle(x,y,r) {
    var v = slider.value();
    stroke(0);
    noFill();
    ellipse(x, y, r, r);
    if (r > v) {
        drawCircle(x + r/2, y, r/2);
        drawCircle(x - r/2, y, r/2);
        drawCircle(x, y + r/2, r/2);
        drawCircle(x, y - r/2, r/2);
    }
}
function setup() {
    slider = createSlider(8, 200, 8);
    slider.position(20, 20);
    createCanvas(640, 640);
}
function draw() {
    background(240);
    drawCircle(width/2, height/2, 200);
}
