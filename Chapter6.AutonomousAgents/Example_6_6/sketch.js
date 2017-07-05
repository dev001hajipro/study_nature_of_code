/// <reference path="../../p5.global-mode.d.ts" />
class Vehicle {
    constructor(x = 0, y = 0, maxspeed = 4, maxforce = 0.1) {
        this.position = createVector(x,y);
        this.velocity = createVector(2, 0);
        this.acceleration = createVector(0, 0);
        this.mass = 1;
        this.scale = 4;
        this.maxspeed = maxspeed;
        this.maxforce = maxforce;
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
        predict.mult(50);
        let predictPos = p5.Vector.add(this.position, predict);

        let normal = null;
        let target = null;
        let worldRecord = 1000000; // distance
        for (let i = 0; i < path.points.length -1; i++) {
            // 3点から法点を作成
            let a = path.points[i+0];
            let b = path.points[i+1];
            let normalPoint = this.getNormalPoint(predictPos, a, b)
            // 法点が見つからない場合は、ひとまず終了点bを法点にする。
            if (normalPoint.x < a.x || normalPoint.x > b.x) {
                normalPoint = b.copy();
            }

            // 予想ポジションと、法点の差
            let distance = p5.Vector.dist(predictPos, normalPoint);
            // 現在一番小さい処理なので、それに法線情報を更新
            if (distance < worldRecord) {
                worldRecord = distance;
                normal = normalPoint;

                // ターゲット作成。少し先にする。
                // 変更先を少し、前に設定
                let dir = p5.Vector.sub(b, a);
                dir.normalize();
                dir.mult(10);
                target = p5.Vector.add(normalPoint, dir);
            }

        }
        // パスの領域より、距離(worldRecord)が離れていたら、
        if (worldRecord > path.radius && target) {
            this.seek(target);
        }
    }
    applyForce(force) {
        let a = p5.Vector.div(force, this.mass);
        this.acceleration.add(a);
    }
    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
    // 終了地点付近まで行ったら、開始地点に強制移動
    borders(path) {
        if (this.position.x > path.getEnd().x + this.radius) {
            this.position.x = path.getStart().x - this.radius;
            this.position.y = path.getStart().y + (this.position.y - path.getEnd().y);
        }
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
    run() {
        this.update();
        this.display();
    }
}
class Path {
    constructor() {
        this.points = new Array();
        this.radius = 20;
        this.start = createVector(100, height/3);
        this.end = createVector(width-100, 2*height/3);
    }
    addPoint(x, y) {
        this.points.push(createVector(x,y));
    }
    getStart() {
        return this.points[0];
    }
    getEnd() {
        return this.points[this.points.length-1];
    }
    display() {
        push();
        stroke(100);
        strokeWeight(this.radius*2);
        noFill();
        beginShape();
        this.points.forEach(v=>vertex(v.x, v.y));
        endShape();

        stroke(255);
        strokeWeight(1);
        noFill();
        beginShape();
        this.points.forEach(v=>vertex(v.x, v.y));
        endShape();
        pop();
    }
}
let car1;
let car2;
let path;

function newPath() {
    path = new Path();
    path.addPoint(-20, height/2);
    path.addPoint(random(0, width/2), random(0, height));
    path.addPoint(random(width/2, width), random(0, height));
    path.addPoint(width+20, height/2);   
}

function setup() {
    createCanvas(700, 300);
    newPath();
    car1 = new Vehicle(0, height/2, 2, 0.04);
    car2 = new Vehicle(0, height/2, 3, 0.1);
}

function draw() {
    background(240);
    path.display();
    //v.seek(target);
    car1.follow(path);
    car2.follow(path);

    car1.run();
    car2.run();

    car1.borders(path);
    car2.borders(path);
}