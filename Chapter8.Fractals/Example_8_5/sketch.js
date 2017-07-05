/// <reference path="../../p5.global-mode.d.ts" />
// コッホ曲線。スウェーデンの数学者ヘルゲ・フォン・コッホ(Helge von koch)が1904年に発見。

class KochLine {
    constructor(va, vb) {
        this.start = va.copy();
        this.end = vb.copy();
    }
    display() {
        stroke(0);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
}

function setup() {
    createCanvas(400, 200);
    noLoop();
    background(240);
}
