/// <reference path="../../p5.global-mode.d.ts" />
// cantor set
class Cantor {
    constructor(x, y, len) {
        this.x = x;
        this.y = y;
        this.len = len;
    }
    display() {
        stroke(1);
        line(this.x, this.y, this.x + this.len, this.y);
    }
}

let objs;
function generate(objs) {
    let newObjs = [];
    objs.forEach(o=> {
        let x = o.x;
        let y = o.y;
        let len = o.len;

        newObjs.push(new Cantor(x, y + 10, len/3));
        newObjs.push(new Cantor(x+len*2/3, y + 10, len/3));
    });
    return newObjs;
}
function init() {
    objs = [];
    objs.push(new Cantor(0, height/2, width));
}
function setup() {
    createCanvas(800, 400);
    frameRate(1);
    strokeWeight(1);
    init();
}
let count = 0;
function draw() {
    if (count > 7) {
        return;
    }
    objs.forEach(o=>o.display());
    objs = generate(objs);
    count++;
}