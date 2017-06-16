/// <reference path="../../p5.global-mode.d.ts" />
class Particle {
    constructor(pos = createVector(0,0)) {
        this.position = pos;
        this.velocity = createVector(random(-0.3,0.3),random(-0.3,0.3));
        this.acceleration = createVector(0, 0);
        this.lifespan = 255;
        this.mass = 1;

        this.angle = 0;
        this.aVelocity = 0;
        //this.aAcceleration = 0.1;
    }
    applyForce(f) {
        // F=MA, A=F/M
        let a = p5.Vector.div(f, this.mass);
        this.acceleration.add(a);

        this.aAcceleration = f.copy().normalize().mult(0.001).x;
    }
    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        this.aVelocity += this.aAcceleration;
        this.angle += this.aVelocity;
        this.aAcceleration = 0;

        this.lifespan -= 2.0;
    }
    display() {
        push();
        translate(this.position.x,this.position.y);
        rotate(this.angle);
        //stroke(0, this.lifespan);
        noStroke();
        fill(175, this.lifespan);
        //rectMode(CENTER);
        ellipse(0, 0, 16, 16);
        //rect(0, 0, 18, 18);
        //point(0, 0);
        pop();
    }
    run() {
        this.update();
        this.display();
    }
    isDead() { return this.lifespan < 0.0; }
}
class ParticleSystem {
    constructor(origin = createVector(width/2, 10)) {
        this.ps = [];
        this.origin = origin;
        this.mouseMode = false;
        this.f = createVector(random(-0.01,0.01), random(-0.01,0.01));
    }
    addParticle() {
        this.ps.push(new Particle(this.origin.copy()));
    }
    input() {
        this.origin = createVector(mouseX, mouseY);
    }
    run() {
        //this.input();
        this.ps.forEach((p)=>{
            p.applyForce(this.f);
            p.run();
        });
        this.ps = this.ps.filter(p=>!p.isDead());
        //text('len:' + this.ps.length, 10, 10);
    }
}

let systems;
function setup() {
    createCanvas(600, 200);
    systems = [];
}
function draw() {
    background(245);
    systems.forEach((s)=>{
        s.run();
        s.addParticle();
    });

    text(int(frameRate()), 10, 10);
}
function mousePressed() {
    systems.push(new ParticleSystem(createVector(mouseX, mouseY)));
}