/// <reference path="../../p5.global-mode.d.ts" />
let angle = 0;
let startAngle = 0;
let angleVelocity = 0.2;
let amplitude = 100; // 振幅(しんぷく)
function setup() {
    createCanvas(400, 200);
    createP('波');

    background(240);

    // 円
    fill(175, 50);
    for (let x = 0; x <= width; x += 24) {
        let y = amplitude * sin(angle);
        ellipse(x, y+height/2, 48, 48);
        angle += angleVelocity;
    }
    // 実線
    noFill();
    angle = 0;
    beginShape();
    for (let x = 0; x <= width; x+=5) {
        let y = map(sin(angle), -1, 1, 0, height);
        vertex(x, y);
        angle += angleVelocity;
    }
    endShape();
}
