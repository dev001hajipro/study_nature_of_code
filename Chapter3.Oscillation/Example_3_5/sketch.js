/// <reference path="../../p5.global-mode.d.ts" />
function setup() {
    createCanvas(400, 400);
    createElement('h2', '振動(Oscillation)');
    createP('振幅しんぷく(Amplitude) - 運動の中心から幅までの距離');
    createP('周期(Period) - １つの運動サイクルにかかる時間');
}
let amplitude = 100;
let period = 120;
function draw() {
    let x  = amplitude * cos(TWO_PI * frameCount / period);

    background(245);
    push();
    fill(0);
    noStroke();
    text('x:' + frameCount, 0, 10);

    translate(width/2, height/2);
    fill(255);
    stroke(10);
    ellipse(x, 0, 20, 20);
    pop();
}