/// <reference path="../p5.global-mode.d.ts" />
// https://github.com/shiffman/The-Nature-of-Code-Examples-p5.js/blob/master/chp03_oscillation/NOC_Exercise_3_02/mover.js
class Mover {
    constructor(m = 1, x = 0, y = 0) {
        this.mass = m;
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
    }
    input() {
        if (mouseIsPressed) {
            if (mouseButton == LEFT) {
                let acc = createVector(this.velocity.y, this.velocity.x * -1);
                acc.normalize();
                acc.mult(0.1);
                this.applyForce(acc);
            }
            if (mouseButton == RIGHT) {
                let acc = createVector(this.velocity.y, this.velocity.x);
                acc.normalize();
                acc.mult(0.1);
                this.applyForce(acc);
            }
        }
    }

    applyForce(force) {
        let f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    }

    update() {
        /*
        let mouse = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(mouse, this.position);
        dir.normalize();
        dir.mult(0.05);
        this.acceleration = dir;
        */

        this.velocity.add(this.acceleration);
        this.velocity.limit(1);
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
    let acc = createVector(0, -0.001);
    m.applyForce(acc);

    //m.input();
    m.update();
    m.display();
}

function keyPressed() {
    console.log('key');    
}

function mousePressed() {
    m.input();
}

window.addEventListener('contextmenu', e=> {
    e.preventDefault();
    e.stopPropagation();
});