/// <reference path="../../p5.global-mode.d.ts" />
class Bob {
    constructor(m = 24, x = 0, y = 0) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.mass = m;
        this.damping = 0.98;
    }

    applyForce(f) {
        // Force=Acceleration*Mass A = F/M
        let a = p5.Vector.div(f, this.mass);
        this.acceleration.add(a);
    }
    update() {
        this.velocity.add(this.acceleration);
        this.velocity.mult(this.damping);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
    display() {
        ellipse(this.position.x, this.position.y, this.mass*2, this.mass*2);
    }
}
// おもりの固定点と静止長
class Spring {
    constructor(len = 2, x = width/2, y = 0) {
        this.anchor = createVector(x, y);
        this.len = len; //静止長
        this.K = 0.02;
    }
    // 重りにかかるばねの力を計算
    connect(bob) {
        let force = p5.Vector.sub(bob.position, this.anchor);
        let d = force.mag();
        let stretch = d - this.len;

        force.normalize();
        force.mult(-1*this.K*stretch);

        bob.applyForce(force);
    }
    display() {
        fill(100);
        rectMode(CENTER);
        rect(this.anchor.x, this.anchor.y, 10, 10);
    }
    displayLine(bob) {
        stroke(255);
        line(bob.position.x, bob.position.y, this.anchor.x, this.anchor.y);
    }
}


let bob;
let spring;
function setup() {
    createCanvas(400, 400);
    bob = new Bob(24, width/2, height/2);
    spring = new Spring();
}
function draw() {
    background(235);

    // 重力
    let gravity = createVector(0.0, 2);
    bob.applyForce(gravity);
    // ばね
    spring.connect(bob);
    bob.update();
    bob.display();
    spring.display();
    spring.displayLine(bob);
}