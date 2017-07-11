/// <reference path="../../p5.global-mode.d.ts" />
// 確率的(非決定的)フラクタル
function branch(len) {   
    let theta = random(0, PI/3);
    // 幹
    line(0, 0, 0, -len);
    translate(0, -len);

    len *= 0.66;

    if (len <= 2) return;

    // 枝
    push();
    rotate(theta);
    branch(len);
    pop();
    // 枝
    push();
    rotate(-theta);
    branch(len);
    pop();
}

function setup() {
    createCanvas(300, 200);
    stroke(0);
    translate(width/2, height);
    branch(60);
}

