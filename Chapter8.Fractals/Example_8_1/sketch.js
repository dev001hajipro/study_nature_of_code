/// <reference path="../../p5.global-mode.d.ts" />
function setup() {
    createCanvas(700, 200);
    noLoop();
    text(f(10), 10, 10);
    drawCircle(width/2, height/2, 550);
}
const f=(n)=>n == 1 ? n : n + f(n-1);

function drawCircle(x,y,r) {
    ellipse(x, y, r, r);
    r > 2 && drawCircle(x, y, 0.75*r);
}
