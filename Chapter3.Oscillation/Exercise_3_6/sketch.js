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
    let x = amplitude * cos(TWO_PI * frameCount / period);
    let y = amplitude * sin(TWO_PI * frameCount / period);
    background(245);
    push();
    fill(0);
    noStroke();
    text('x:' + frameCount, 0, 10);
    text('y:' + y, 0, 30);

    translate(width/2, height/2);
    fill(255);
    stroke(10);
    ellipse(x, 0, 20, 20);
    ellipse(x, map(abs(y), -100, 100, 0, 90), 20, 20);
    line(0, -height/2, x, map(abs(y), -100, 100, 0, 90));

    ellipse(0, amplitude*sin(PI*frameCount/period), 30, 30);

    line(0, 100, 0, map(y, -100, 100, 0, 90));
    pop();
}