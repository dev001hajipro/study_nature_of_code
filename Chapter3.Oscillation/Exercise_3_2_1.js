/// <reference path="../p5.global-mode.d.ts" />

class Mover {
    constructor(m = 1, x = 0, y = 0) {
        this.mass = m;
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass); // F=Mass*Acceleration, A=F/M
        this.acceleration.add(f);
    }
    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
    display() {
        stroke(0);
        fill(245);
        ellipse(this.position.x, this.position.y, this.mass*16, this.mass*16);
    }
}
const G = 0.4;
class Attractor {
    constructor(m = 1, x =0, y = 0) {
        this.mass = m;
        this.position = createVector(x, y);
    }

    attract(m) {
        let force = p5.Vector.sub(this.position, m.position); // unit vector.
        //let distance = force.mag(); // magnitude=length
        let distance = constrain(force.mag(), 5.0, 25.0);
        force.normalize();
        
        // 重力加速度
        let strength = G * this.mass * m.mass / (distance * distance);
        force.mult(strength);
        return force;
    }
    display() {
        stroke(0);
        fill(245);
        ellipse(this.position.x, this.position.y, this.mass*16, this.mass*16);
    }
}

let m;
let a;
function setup() {
    createCanvas(400, 400);
    a = new Attractor(202, width/2, height*5);
}
function draw() {
    background(230);

    if (mouseIsPressed) {
        m = new Mover(1, 0, height);
        let shotForce = createVector(3.1, -7.1);
        m.applyForce(shotForce);
    }
    if (m) {
        let f = a.attract(m);
        m.applyForce(f);
        m.update();
        m.display();
    }

    a.display();
}