/// <reference path="../../p5.global-mode.d.ts" />
function vec_() {
let a;
let b;
let n;
let theta;
    a = createVector(10, 2);
    b = createVector(4, -3);
    n = a.dot(b);
    theta = acos(a.dot(b) / (a.mag() * b.mag()));
    text(n, 10, 10);
    text('ラジアン:' + theta, 10, 30);
    text('度     :' + degrees(theta), 10, 50);
    push();
    translate(width/2, height/2);
    point(0, 0);
    stroke(255, 0, 0);
    let aa = a.copy().mult(10);
    line(0, 0, aa.x, aa.y);

    stroke(0, 255, 0);
    let bb = b.copy().mult(10);
    line(0, 0, bb.x, bb.y);
    pop(); 
}

function setup() {
    createCanvas(300, 300);

}

function draw() {
    background(240);
    vec_();
}