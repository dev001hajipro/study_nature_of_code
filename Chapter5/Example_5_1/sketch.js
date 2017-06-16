/// <reference path="../../p5.global-mode.d.ts" />
class Box {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.w = 16;
        this.h = 16;
    }
    display() {
        fill(175);
        stroke(0);
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);
    }
}
let boxes;
function setup() {
    createCanvas(400, 300);
    boxes = new Array();
}
function draw() {
    background(240);
    if (mouseIsPressed)
        boxes.push(new Box(mouseX, mouseY));
    boxes.forEach((b)=> b.display());
}