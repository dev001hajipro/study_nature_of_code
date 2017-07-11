/// <reference path="../../p5.global-mode.d.ts" />
// シェルピンスキーの三角形
class Tri {
    constructor(av, bv, cv) {
        this.a = av.copy();
        this.b = bv.copy();
        this.c = cv.copy();
    }
    pa() {
        return this.a.copy().add(p5.Vector.sub(this.b, this.a).div(2));
    }
    pb() {
        return this.b.copy().add(p5.Vector.sub(this.c, this.b).div(2));
    }
    pc() {
        return this.c.copy().add(p5.Vector.sub(this.a, this.c).div(2));
    }

    display() {
        stroke(0);
        triangle(this.a.x, this.a.y, this.b.x, this.b.y, this.c.x, this.c.y);
    }
}

function generate(tris) {
    let newTris = [];
    tris.forEach(t=> {
        //t.xx
        //newTris.push(t);
        //console.log(t.pa(), t.pb(), t.pc());
        let ta = t.a;
        let tb = t.b;
        let tc = t.c;
        let p1 = t.pa();
        let p2 = t.pb();
        let p3 = t.pc();
        //strokeWeight(3);
        //point(p1.x, p1.y);
        //point(p2.x, p2.y);
       // point(p3.x, p3.y);
        strokeWeight(1);
        fill(30);
        newTris.push(new Tri(
            ta,
            p1,
            p3));
        newTris.push(new Tri(
            p1,
            tb,
            p2));
        newTris.push(new Tri(
            p3,
            p2,
            tc));
    })
    return newTris;
}

let tris;
function setup() {
    createCanvas(400, 400);
    frameRate(1);
    initTris();
}
function initTris() {
tris = [];
    tris.push(
        new Tri(
            createVector(0, height),
            createVector(width/2, 0),
            createVector(width, height))
        );
}

let count = 0;
function draw() {
    if (count > 7) {
        count = 0;
        initTris();
    }

    background(240);
    tris.forEach(t=>t.display());
    tris = generate(tris);

    count++;
    
}


