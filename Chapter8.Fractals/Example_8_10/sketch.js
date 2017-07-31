/// <reference path="../../p5.global-mode.d.ts" />
// TODO :まだ実装していない
// LSystem カントール集合
let current = "A";

function rule(src) {
    let next = '';
    for (let i = 0, len = src.length; i < len; i++) {
        switch (src[i]) {
            case 'A':
                next += 'ABA';
            break;
            case 'B':
                next += 'BBB';
            break;
        }
    }
    console.log(next);
    return next;
}
let y = 15;
function pri(current) {
    let w  = width / current.length;
    for (let i = 0, len = current.length; i < len; i++) {
        if (current[i] == 'A')
            line(w*i, y, (w*(i+1)), y);
    } 
    y += 15;
}

function setup() {
    createCanvas(400, 400);
    frameRate(1);
}
function draw() {
    background(240);
    if (current.length < 225) {
        pri(current);
        current = rule(current);
    }
}