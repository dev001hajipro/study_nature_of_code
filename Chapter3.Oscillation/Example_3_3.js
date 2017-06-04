/// <reference path="../p5.global-mode.d.ts" />

class Mover {
    constructor(m = 1, x = 0, y = 0) {
        this.mass = m;
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
    }
    update() {
        let mouse = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(mouse, this.position);
        dir.normalize();
        dir.mult(0.05);
        this.acceleration = dir;

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    display() {
        let angle = atan2(this.velocity.y, this.velocity.x);
        //let angle = this.velocity.heading();
        push();
        rectMode(CENTER);
        translate(this.position.x, this.position.y);
        //console.log(this.position.x);
        rotate(angle);
        stroke(0);
        fill(240);
        rect(0, 0, this.mass*32, this.mass*16);
        pop();
    }
}
let m;
function setup() {
    createCanvas(400, 400);
    m = new Mover(1, width/2, height/2);
}
function draw() {
    background(240);
    m.update();
    m.display();
}