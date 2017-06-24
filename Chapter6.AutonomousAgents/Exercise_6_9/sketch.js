/// <reference path="../../p5.global-mode.d.ts" />
let a;
let b;
function setup() {
    createCanvas(200, 200);
    createP('内積(dot product)');

    a = createVector(10, 0);
    b = createVector(10/sqrt(2), -10/sqrt(2));
}
function ANGLEBetween(v1, v2) {
    let dot = v1.dot(v2);
    let theta = Math.acos(dot / (v1.mag() * v2.mag()));
    return theta;
}
let r = 2;
let _s = 3;
function draw() {
    background(240);

    push();
    translate(width/2, height/2);
    scale(_s);
    point(0, 0);
    line(0, 0, a.x, a.y);
    line(0, 0, b.x, b.y);
    pop();

    let theta = ANGLEBetween(a, b);
    text(floor(degrees(theta)*100)/100 + ' degrees', 10, height-30);
    text(floor(theta*100)/100 + ' radians', 10, height-15);
}

