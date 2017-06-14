/// <reference path="../../p5.global-mode.d.ts" />
class Particle {
    constructor(pos = createVector(width/2,50)) {
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
        stroke(0, this.lifespan);
        fill(175, this.lifespan);
        rectMode(CENTER);
        ellipse(0, 0, 16, 16);
        //rect(0, 0, 18, 18);
        point(0, 0);
        pop();
    }
    run() {
        this.update();
        this.display();
    }
    isDead() { this.lifespan < 0.0; }
}
class ParticleSystem {
    constructor() {
        this.ps = [];
    }
    addParticle() {
        //    ps.push(new Particle(createVector(width/2, 50)));
        this.ps.push(new Particle());
    }
    run() {
        this.ps.forEach((p)=>{
            let v = createVector(0, 0.01);
            p.applyForce(v);
            p.run();
        });
        this.ps.filter(p=>p.isDead()).map(p=>p.remove());
    }
}

let ps;
function setup() {
    createCanvas(640, 360);
    ps = new ParticleSystem();
}
function draw() {
    background(245);
    ps.addParticle();
    ps.run();
    
}