/// <reference path="../../p5.global-mode.d.ts" />
class Vehicle {
    constructor(x = 0, y = 0, m = 1) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.mass = m;
        this.r = 3.0;
        this.maxspeed = 4;
        this.maxforce = 0.1;
    }
    // F=MA, A=F/M
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
    // 追及操舵力
    seek(target) {
        // 必要な(desired)速度を求める。ただし最大速度で制限を掛ける。
        let desired = p5.Vector.sub(target, this.position);
        desired.normalize();
        desired.mult(this.maxspeed);
        // 操舵力=必要な速度-現在の速度
        // steeringForce = desiredVelocity - currentVelocity
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        this.applyForce(steer);
    }
    display() {
        // 上向きに表示されるように90度回転
        let theta = this.velocity.heading() + PI / 2;
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        beginShape();
        {
            let r = this.r;
            vertex(0, -r*2); // 0, -2
            vertex(-r, r*2); // -1, 2
            vertex(r, r*2); // 1, 2
        }
        endShape(CLOSE);
        pop();
    }
}
class Target {
    constructor(x = random(0, width), y = random(0, height), m = 1) {
        this.mass = m;
        this.position = createVector(x, y);
    }
    display() {
        push();
        translate(this.position.x, this.position.y);
        stroke(75);
        fill(175);
        ellipse(0, 0, this.mass*8, this.mass*8);
        pop();
    }
}
let vehicle;
let t;
function setup() {
    createCanvas(720, 300);   

    vehicle = new Vehicle(width/2, height/2);
    t = new Target();
}
function draw() {
    background(240);
    vehicle.seek(t.position);
    vehicle.update();
    vehicle.display();

    t.display();
}