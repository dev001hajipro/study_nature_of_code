/// <reference path="../../p5.global-mode.d.ts" />
class Particle {
    constructor(pos = createVector()) {
        this.position = pos.copy();
        //this.velocity = createVector(random(-0.5, 0.5), random(-0.3, 0.1));
        this.velocity = createVector(
                randomGaussian() * 0.3,
                randomGaussian() * 0.3 -1.0);
        this.acceleration = createVector(0, 0.0);
        // TODO 角速度と加速度

        this.lifespan = 255;
        this.mass = 1;
    }
    run() {
        this.update();
        //this.display();
        this.displayImage();
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
    displayImage() {
        push();
        translate(this.position.x, this.position.y);
        imageMode(CENTER);
        tint(255, this.lifespan);
        image(img, 0, 0);
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
        this.ps.push(new Particle(this.origin))
        // if (random(1) < 0.5)
        //     this.ps.push(new Particle(this.origin))
        // else
        //     this.ps.push(new Confetti(this.origin))
    }
    applyForce(force) {
        this.ps.forEach((p)=>p.applyForce(force));
    }
    applyRepeller(repeller) {
        this.ps.forEach((p)=> {
            let force = repeller.repel(p);
            p.applyForce(force);
        });
    }
    run() {
        this.ps.forEach((p)=>p.run());
        this.ps = this.ps.filter((n)=>!n.isDead());
    }
}

class Repeller {
    constructor(x,y) {
        this.position = createVector(x, y);
        this.r = 10;
        this.strength = 100;
    }
    display() {
        push();
        stroke(50);
        fill(150);
        ellipse(this.position.x, this.position.y, this.r*2, this.r*2);
        pop();
    }
    repel(particle) {
        let dir = p5.Vector.sub(this.position, particle.position);
        let d = dir.mag(); // length
        d = constrain(d, 5, 100); // limit
        dir.normalize();
        //let force = -1 * G / (d*d);
        let force = -1 * this.strength / (d*d);
        dir.mult(force);
        return dir;
    }
}
let G = 1;
let ps;
let repeller1;
let repeller2;
let gravity;
let wind;
let img;
function setup() {
    createCanvas(400, 300);
    img = loadImage("texture.png");

    ps = new ParticleSystem(createVector(width/2, height-50));
    //repeller1 = new Repeller(width/2-20, height/2);
    //repeller2 = new Repeller(width/2+120, height/2+100);
    gravity = createVector(0, 0.03);
}
function draw() {
    background(0);

    let windX = map(mouseX, 0, width, -0.2, 0.2);
    wind = createVector(windX, 0);


    ps.addParticle();
    //ps.applyForce(gravity);
    ps.applyForce(wind);
    //ps.applyRepeller(repeller1);
    //ps.applyRepeller(repeller2);

    ps.run();
    //repeller1.display();
    //repeller2.display();

    text(ps.ps.length, 10, 10);
}