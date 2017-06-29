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
    getNormalPoint(p, a, b) {
        let ap = p5.Vector.sub(p, a);
        let ab = p5.Vector.sub(b, a);
        
        ab.normalize();
        ab.mult(ap.dot(ab));
        return p5.Vector.add(a, ab);
    }
    follow(path) {
        // predict 予想
        let predict = this.velocity.copy();
        predict.normalize();
        predict.mult(25);
        let predictPos = p5.Vector.add(this.position, predict);

        // // 予想点とパスの法線を求める。
        // let a = p5.Vector.sub(predictPos, path.start);
        // let b = p5.Vector.sub(path.end, path.start);
        // // スカラー射影
        // b.normalize();
        // b.mult(a.dot(b));        
        // let normalPoint = p5.Vector.add(path.start, b);
        let a = path.start;
        let b = path.end;
        let normalPoint = this.getNormalPoint(predictPos, a, b)

        // 変更先を少し、前に設定
        let dir = p5.Vector.sub(b, a);
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
        this.radius = 20;
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
    createCanvas(700, 300);
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