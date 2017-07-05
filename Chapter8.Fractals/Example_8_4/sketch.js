/// <reference path="../../p5.global-mode.d.ts" />
// カントール集合 Cantor Set

function cantor(x, y, len) {
    if (len >= 1) {
        strokeWeight(3);
        line(x, y, x+len, y);
        cantor(x,         y+20, len/3);
        cantor(x+len*2/3, y+20, len/3);
    }
}

function setup() {
    createCanvas(400, 200);
    background(240);
    cantor(0, 3, width);
    noLoop();
}
