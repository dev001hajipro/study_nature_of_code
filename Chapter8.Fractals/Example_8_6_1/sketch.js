/// <reference path="../../p5.global-mode.d.ts" />
// 確率的(非決定的)フラクタル
function branch(len) {   
    // 幹
    line(0, 0, 0, -len);
    translate(0, -len);


    if (len <= 2) return;

    let n = int(random(1,4));
    for (let i = 0; i < n; i++) {
        _len = len * random(0.66, 0,99);

        let theta = random(-PI/2, PI/2);
        // 枝
        push();
        rotate(theta);
        branch(_len);
        pop();
    }
}

function setup() {
    createCanvas(300, 200);
    stroke(0);
    translate(width/2, height);
    branch(60);
}

