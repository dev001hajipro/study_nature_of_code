/// <reference path="../../p5.global-mode.d.ts" />
class Particle {
    constructor(pos = createVector()) {
        this.position = pos.copy();
        this.velocity = createVector(random(-0.5, 0.5), random(-0.3, 0.1));
        this.acceleration = createVector(0, 0.0);
        // TODO 角速度と加速度

        this.lifespan = 255;
        this.mass = 1;
    }
    run() {
        this.update();
        this.display();
    }
    // F=MA, A=F/M
    applyForce(force) {
        let f = force.copy();
        f.div(this.mass); //A=F/M
        this.acceleration.add(f);
    }
    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.lifespan -= 1;
        this.acceleration.mult(0);
    }
    display() {
        push();
        translate(this.position.x, this.position.y);
        fill(50, this.lifespan);
        stroke(50, this.lifespan);
        ellipse(0, 0, 8, 8);
        pop();
    }
    isDead() {
        return this.lifespan <= 0;
    }
}
class Confetti extends Particle {
    constructor(pos = createVector()) {
        super(pos);
    }
    display() {
        let theta = map(this.position.x, 0, width, 0, TWO_PI*2);
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        fill(175, this.lifespan);
        stroke(0, this.lifespan);

        rectMode(CENTER);
        rect(0, 0, 8, 8);
        pop();
    }
}
class ParticleSystem {
    constructor(pos = createVector()) {
        this.origin = pos.copy();
        this.ps = [];
    }
    addParticle() {
        if (random(1) < 0.5)
            this.ps.push(new Particle(this.origin))
        else
            this.ps.push(new Confetti(this.origin))
    }
    applyForce(force) {
        this.ps.forEach((p)=>p.applyForce(force));
    }
    run() {
        this.ps.forEach((p)=>p.run());
        this.ps = this.ps.filter((n)=>!n.isDead());
    }
}

let psys;
let gravity;
function setup() {
    createCanvas(400, 300);
    psys = new ParticleSystem(createVector(width/2, height/2));
    gravity = createVector(0, 0.01);
}
function draw() {
    background(240);
    psys.applyForce(gravity);
    psys.run();
    psys.addParticle();

    text(psys.ps.length, 10, 10);
}