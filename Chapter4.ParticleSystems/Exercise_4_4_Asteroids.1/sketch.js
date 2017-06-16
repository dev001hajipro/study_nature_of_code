/// <reference path="../../p5.global-mode.d.ts" />
// TODO スラスターの方向
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
        stroke(200, this.lifespan);
        fill(200, this.lifespan);
        rectMode(CENTER);
        ellipse(0, 0, map(this.lifespan, 0, 255, 5, 16), map(this.lifespan, 0, 255, 5, 16));
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
    }
    addParticle(f) {
        this.f = f;
        let pos = this.origin.copy().add(this.f.copy().normalize().mult(10));
        this.ps.push(new Particle(pos));
    }
    input() {
        if (mouseIsPressed) {
            this.mouseMode = !this.mouseMode;
        }
        if (this.mouseMode) {
            this.origin = createVector(mouseX, mouseY);
        } else {
            this.origin = createVector(width/2, 10);
        }
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

// Asteroids
// - 左キーで反時計回りで宇宙船が回転
// - 右キーで時計回りで宇宙船が回転
// - 上キーで、進行方向に進む
// 
class Spaceship {
    constructor(x = 0, y = 0, m = 1) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.position = createVector(x, y);
        this.mass = m;
        this.angle = 0;
        this.aAcceleration = 0;
        this.aVelocity = 0;

        this.ps = new ParticleSystem();
    }
    applyAngle(s) {
        this.aAcceleration += s;
    }
    thrust() {
        //let _angle = this.angle - TWO_PI;
        let _angle = this.angle - HALF_PI;
        // 極座標(r,θ)から、デカルト座標(x,y)に変換
        let r = 1;
        let x = r * cos(_angle);
        let y = r * sin(_angle);
        let f = createVector(x, y);
        f.mult(0.01);
        console.log(x,y);
        this.applyForce(f);

        this.ps.origin = createVector(this.position.x, this.position.y);
        this.ps.addParticle(f.mult(-0.1));
    }
    applyForce(force) {
        // F=M*A, A=F/M
        let a = p5.Vector.div(force, this.mass);
        this.acceleration.add(a);
    }
    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        this.aVelocity += this.aAcceleration;
        this.angle += this.aVelocity;
        this.aAcceleration = 0;
    }
    display() {
        this.ps.run();
        push();
        stroke(0);
        fill(175);
        translate(this.position.x, this.position.y);
        // 
        // 極座標(r,θ)から、デカルト座標(x,y)に変換
        let theta  = this.angle - HALF_PI;
        let r = 50;
        let x = r * cos(theta);
        let y = r * sin(theta);
        line(0, 0, x, y);

        rotate(this.angle);
        triangle(0, -10, 10, 10, -10, 10);
        pop();
    }
}
let s;
function setup() {
    createCanvas(400, 400);
    s = new Spaceship(width/2, height/2);
    let wind = createVector(0, 0);
    s.applyForce(wind);
}
function draw() {
    background(250);

    if (keyIsPressed) {
        //text(keyCode, 10, 10);
        if (keyCode == UP_ARROW) s.thrust();
        //if (keyCode == DOWN_ARROW) s.thrust();
        if (keyCode == LEFT_ARROW) s.applyAngle(-0.001);            
        if (keyCode == RIGHT_ARROW) s.applyAngle(0.001);                        
    }
    text('angle:' + s.angle, 10, 10);

    s.update();
    s.display();
}

window.addEventListener('contextmenu', function(e) {
    e.stopPropagation();
    e.defaultPrevented();
});