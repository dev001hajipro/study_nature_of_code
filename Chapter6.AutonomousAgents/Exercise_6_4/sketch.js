/// <reference path="../../p5.global-mode.d.ts" />
class Vehicle {
    constructor(x = 0, y = 0, m = 1) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(random(-1,1), random(-1,1));
        this.mass = m;
        this.r = 5;
        this.maxspeed = 4;
        this.maxforce = 0.1;
    }
    seek(target) {
        let tp = target.position.copy();
        tp.add(target.p);
        // targetForce = desiredVelocity - currentVelocity
        let desired = p5.Vector.sub(tp, this.position);
        push();
        stroke(170, 0, 0, 50);
        line(this.position.x, this.position.y, tp.x, tp.y);
        pop();
        let d = desired.mag();
        desired.normalize();
        if (d < 100) {
            // 近づくほど減速する
            let m = map(d, 0, 100, 0, this.maxspeed);
            desired.mult(m);
        } else {
            desired.mult(this.maxspeed);
        }
        if (d < 25) {
            target.genTheta();
        }
        
        push();
        stroke(0, 255, 0);
        strokeWeight(5);
        line(this.position.x, this.position.y,
         this.position.x + desired.x*1, this.position.y + desired.y*1);
        pop();

        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        this.applyForce(steer);
    }
    applyForce(force) {
        // F=MA, A=F/M
        let a = p5.Vector.div(force, this.mass);
        this.acceleration.add(a);
    }
    escape() {

    }
    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        if (this.position.x < 0) {
            this.position.x = width;
        } else if (this.position.x > width) {
            this.position.x = 0;
        }
        if (this.position.y < 0) {
            this.position.y = height;
        } else if (this.position.y > height) {
            this.position.y = 0;
        }
    }
    display() {

        let a = this.velocity.heading() + PI /2;
        push();
        stroke(40, 150);
        fill(255, 50);
        translate(this.position.x ,this.position.y);
        rotate(a);
        //scale(this.r);
        beginShape();
        vertex(-1*this.r, 2*this.r);        
        vertex(0*this.r, -2*this.r);
        vertex(1*this.r, 2*this.r);
        endShape(CLOSE);
        pop();
    }
}
class Target {
    constructor(x = random(0, width), y = random(0, height), m = 10) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        //this.acceleration = createVector(random(-3, 3), random(-3, 3));
        this.acceleration = createVector(0,0);
        this.mass = m;
        this.genTheta();
    }
    changePosition() {
        this.position = createVector(mouseX, mouseY);
        this.genTheta();
    }
    genTheta() {
        this.theta = radians(random(0, 360));;
        let r = 50; // pixel
        let x = cos(this.theta) * r;
        let y = sin(this.theta) * r;
        this.p = createVector(x, y);
    }
    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        if (this.position.x < 0) {
            this.position.x = width;
        } else if (this.position.x > width) {
            this.position.x = 0;
        }
        if (this.position.y < 0) {
            this.position.y = height;
        } else if (this.position.y > height) {
            this.position.y = 0;
        }
    }
    display() {
        push();        
        stroke(75);
        fill(150);
        translate(this.position.x, this.position.y);
        ellipse(0, 0, this.mass*1, this.mass*1);
        stroke(170, 0, 0, 150);
        fill(170, 0, 0, 50);
        ellipse(0, 0, this.mass*10, this.mass*10);

        // 極座標(r, theta)
        fill(0,0,255);
        stroke(0,0, 255);
        ellipse(this.p.x, this.p.y, 5, 5);

        pop();
    }
    run() {
        this.update();
        this.display();
    }
}
let vehicle;
let targetA;
function setup() {
    createCanvas(700, 300);
    vehicle = new Vehicle(width/2, height/2, 1);
    targetA = new Target();
}
function draw() {
    background(240);
    vehicle.seek(targetA);
    vehicle.update();
    vehicle.display();

    targetA.run();
}

function mousePressed(e) {
    targetA.changePosition();
}