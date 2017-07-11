/// <reference path="../../p5.global-mode.d.ts" />
// 確率的(非決定的)フラクタル
function branch(theta, len) {   
    // 幹
    line(0, 0, 0, -len);
    translate(0, -len);

    len *= 0.66;

    if (len <= 2) return;

    // 枝
    push();
    rotate(theta);
    line(0,0,0,-len);
    branch(theta, len);
    pop();
    // 枝
    push();
    rotate(-theta);
    line(0,0,0,-len);
    branch(theta, len);
    pop();
}

function setup() {
    createCanvas(300, 200);
    stroke(0);
}
function draw() {
    background(240);
    theta = map(mouseX, 0, width, 0, PI/2);

    translate(width/2, height);
    branch(theta, 60);
}
