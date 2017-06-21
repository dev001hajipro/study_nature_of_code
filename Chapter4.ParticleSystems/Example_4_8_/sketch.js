/// <reference path="../../p5.global-mode.d.ts" />
let img;
function setup() {
    createCanvas(400, 300);
    img = loadImage("texture.png");
}
function draw() {
    background(0);
    image(img, 0, 0);
}