/// <reference path="../../p5.global-mode.d.ts" />
// コッホ曲線。スウェーデンの数学者ヘルゲ・フォン・コッホ(Helge von koch)が1904年に発見。

// 点Aから点Bを管理するクラス
class KochLine {
    constructor(va, vb) {
        this.start = va.copy();
        this.end = vb.copy();
    }
    display() {
        stroke(0);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
    kochA() {
        return this.start.copy();
    }
    kochB() {
        var v = p5.Vector.sub(this.end, this.start);
        v.div(3);
        v.add(this.start);
        return v;
    }
    kochC() {
        var a = this.start.copy();
        var v = p5.Vector.sub(this.end, this.start);
        v.div(3);
        a.add(v.copy()); // ここで点Bの位置、
        // 60度回転して、点Cの位置へ移動
        v.rotate(-PI/3);
        a.add(v.copy());
        return a;
    }
    kochD() {
        var v = p5.Vector.sub(this.end, this.start);
        v.mult(2/3.0);
        v.add(this.start.copy());
        return v;
    }
    kochE() {
        return this.end.copy();
    }
}

function generate(lines) {
    var next = [];
    lines.forEach(l=> {
        var a = l.kochA();
        var b = l.kochB();
        var c = l.kochC();
        var d = l.kochD();
        var e = l.kochE();
        next.push(new KochLine(a, b));
        next.push(new KochLine(b, c));
        next.push(new KochLine(c, d));
        next.push(new KochLine(d, e));
    });
    return next;
}

function initLine() {
    lines = [];
    var start = createVector(0, height-20);
    var end = createVector(width, height-20);
    lines.push(new KochLine(start, end));
}

function setup() {
    createCanvas(600, 300);
    frameRate(1);

    initLine();
}

var count = 0;
function draw() {
    background(240);
    if (count >= 5) {
        initLine();
        count = 0;
    }
    lines = generate(lines);

    lines.forEach(o=>o.display());
    count++;
}
