/// <reference path="../../p5.global-mode.d.ts" />
class Vehicle {
    constructor() {
        this.position = createVector(50,200);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(1,-2);
        this.mass = 1;
        this.scale = 4;
        this.maxspeed = 1;
        this.maxforce = 0.4;
    }
    seek(target) {
        let desired = p5.Vector.sub(target, this.position);
        push();
        stroke(255, 0, 0, 100);
        translate(this.position.x, this.position.y);
        line(0, 0, desired.x, desired.y);
        pop();
        let d = desired.mag();
        desired.normalize();
        if (d < 100) {
            let m = map(d, 0, 100, 0, this.maxspeed);
            desired.mult(m);
        } else {
            desired.mult(this.maxspeed);
        }

        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        this.applyForce(steer);
    }
    follow(path) {
        // predict 予想
        let predict = this.velocity.copy();
        predict.normalize();
        predict.mult(25);
        push();
        stroke(255, 0, 0, 100);
        translate(this.position.x, this.position.y);
        line(0, 0, predict.x, predict.y);
        pop();

        let predictPos = p5.Vector.add(this.position, predict);
        push();
        translate(predictPos.x, predictPos.y);
        text('predictPos', 0, 10);
        ellipse(0, 0, 3, 3);
        pop();

        // 予想点とパスの法線を求める。
        let a = p5.Vector.sub(predictPos, path.start);
        push();
        stroke(0, 255, 0, 200); // green
        translate(path.start.x, path.start.y);
        text('ベクトルa', a.x/2, a.y/2);
        line(0, 0, a.x, a.y);
        pop();

        push();
        noFill();
        stroke(255, 255, 0, 200); // yellow 黄色
        translate(path.start.x, path.start.y);
        // デフォルトではellipseは、直径を求めているため、
        // modeをRADIUSにして、a.mag()=lenght=r半径を設定
        ellipseMode(RADIUS);
        ellipse(0, 0, a.mag());
        pop();

        let b = p5.Vector.sub(path.end, path.start);

        //2つのベクトルa,ベクトルaがあるので、ここから角度θを内積で求められる。
        // p5.Vector.angleBetween(a,b)関数と同じことを以下でしている。
        let theta = acos(a.dot(b) / (a.mag() * b.mag()));

        // ベクトルbから、法点を求める。
        // a.mag()は半径rなのでcos(θ)でx座標を求めているのと同じ。
        let x = a.mag()*cos(theta);
        b.normalize();
        b.mult(x);
        push();
        strokeWeight(2);
        stroke(255, 0, 255);
        translate(path.start.x, path.start.y);
        text('ベクトルb', b.x/2, b.y/2);
        line(0, 0, b.x, b.y);
        pop();

        // スカラー射影
        // bを単位ベクトル、つまり1にして、
        // a dot b = |a|*1*cos(θ)
        // a dot b = |a|*cos(θ)
        // |a|*cos(θ)は、a dot bに置き換えられる。
        // このスカラー射影を使えば、わざわざθを求めなくてもよい。
        //b.normalize();
        //b.mult(a.dot(b));
        
        let normalPoint = p5.Vector.add(path.start, b);
        push();
        translate(normalPoint.x, normalPoint.y);
        text('normal point', 0, 10);
        ellipse(0, 0, 5, 5);
        pop();
        // 法線表示
        push();
        noFill();
        stroke(0, 0, 255, 255);
        translate(normalPoint.x, normalPoint.y);
        text('法線', (predictPos.x - normalPoint.x)/2,
        (predictPos.y- normalPoint.y)/2);
        line(0, 0, predictPos.x - normalPoint.x, predictPos.y- normalPoint.y)
        pop();

        // 変更先を少し、前に設定
        let dir = p5.Vector.sub(path.end, path.start);
        dir.normalize();
        dir.mult(10);
        let newTarget = p5.Vector.add(normalPoint, dir);

        let distance = p5.Vector.dist(predictPos, normalPoint);
        if (distance > path.radius) {
            this.seek(newTarget);
        }
        
    }
    applyForce(force) {
        let a = p5.Vector.div(force, this.mass);
        this.acceleration.add(a);
    }
    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
    display() {
        //let a = this.velocity.add((PI/2));
        let angle = atan2(this.velocity.y, this.velocity.x) + PI/2;
        push();
        translate(this.position.x, this.position.y);
        rotate(angle);
        scale(this.scale);

        strokeWeight(1/this.scale);
        beginShape();
        vertex(-1, 2);
        vertex(0, -2);
        vertex(1, 2);
        endShape(CLOSE);
        pop();
    }
}
class Path {
    constructor() {
        this.points = new Array();
        this.radius = 40;
        this.start = createVector(100, height/3);
        this.end = createVector(width-100, 2*height/3);
    }
    display() {
        push();
        strokeWeight(this.radius*2);
        stroke(0, 100);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
        strokeWeight(1);
        stroke(0);
        line(this.start.x, this.start.y, this.end.x, this.end.y);

        strokeWeight(0);
        text('start point', this.start.x, this.start.y -3);
        strokeWeight(0);
        text('end point', this.end.x, this.end.y -3);
        pop();
    }
}
let v;
let path;
let target;
function setup() {
    createCanvas(1280, 720);
    path = new Path();
    v = new Vehicle();
    target = createVector(400, 50);
}

function draw() {
    background(240);
    path.display();
    //v.seek(target);
    v.follow(path);
    v.update();
    v.display();

    // target
    ellipse(target.x, target.y, 10, 10);
}