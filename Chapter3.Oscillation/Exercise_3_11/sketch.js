/// <reference path="../../p5.global-mode.d.ts" />
// 周期 TWO_PIラジアン(360度)
let amplitude = 20; // 振幅(pixel)
let xspacing = 2;
let period = 100; // 周期(フレーム)
let dx1, dx2;
function setup() {
    createCanvas(800, 200);
    // まだdxにdeltaはない。
    dx1 = (TWO_PI / 180) * xspacing;
    dx2 = (TWO_PI / 120) * xspacing;
    dx3 = (TWO_PI / 300) * xspacing;
}
let theta = 0;
let yvalues = [];
function draw() {
    background(30);

    yvalues = new Array(width/xspacing).fill(0);
    theta += 0.02;
    let x = theta;
    for (let i = 0; i < yvalues.length; i++) {
        yvalues[i] += cos(x) * 10;
        x += dx1;
    }
    x = theta;
    for (let i = 0; i < yvalues.length; i++) {
        yvalues[i] += cos(x) * 20;
        x += dx2;
    }
    x = theta;
    for (let i = 0; i < yvalues.length; i++) {
        yvalues[i] += sin(x) * 51;
        x += dx3;
    }

    translate(0, height/2);
    for (let x = 0; x < yvalues.length; x++) {
        ellipse(x*xspacing, yvalues[x], 20, 20);
    }
    stroke(255);
    fill(255);
}