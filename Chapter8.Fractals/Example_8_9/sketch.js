/// <reference path="../../p5.global-mode.d.ts" />
// L-System

let current;
let next;
let count = 0;
function init() {
    current = "A";
    pri(count++, current);
    current = rule(current);
}
function setup() {
    createCanvas(400, 400);
    background(255);
    stroke(0);
    noFill();
    init();
}
function rule(src) {
    let next = '';
    for (let i = 0, len = src.length; i < len; i++) {
        switch (src[i]) {
            case 'A':
                next += 'AB';
            break;
            case 'B':
                next += 'A';
            break;
        }
    }
    return next;
}
let y = 15;
function pri(count, current) {
    text('Generation' + count + ": " + current, 10, y);
    y += 15;
    if (y > height-15) {
        background(255);
        y = 0;
    }
}

function mouseClicked() {
    pri(count++, current);
    current = rule(current);
}