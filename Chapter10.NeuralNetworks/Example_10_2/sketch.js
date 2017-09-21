/// <reference path="../../p5.global-mode.d.ts" />

const floor1=(n)=>floor(n*10)/10;

class Vehicle {
    constructor(x = 0, y = 0, m = 1) {
        this.maxspeed = 5;        
        this.position = createVector(x, y);
        this.velocity = createVector(random(-this.maxspeed, this.maxspeed),random(-this.maxspeed, this.maxspeed));
        this.acceleration = createVector(0, 0);
        this.mass = 1;
        this.r = 5;
        this.maxforce = 0.15;
    }
    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
    applyForce(force) {
        // F=AM, A=F/M
        let a = p5.Vector.div(force, this.mass);
        this.acceleration.add(a);
    }
    seek(targets) {
        targets.forEach(target=> {
            // 操舵ベクトル=進みたい速度ベクトル-現在の速度ベクトル
            let desired = p5.Vector.sub(target.position, this.position);
            desired.normalize();
            desired.mult(this.maxspeed);
            let steer = p5.Vector.sub(desired, this.velocity);

            // 距離によって重みを付ける
            let d = p5.Vector.dist(target.position, this.position);
            let weight = map(d, 0, width, 0, 0.5);
            steer.mult(weight);

            steer.limit(this.maxforce);
            this.applyForce(steer);
        });
    }
    display() {
        let h = this.velocity.heading() + PI/2;
        push();
        translate(this.position.x, this.position.y);
        rotate(h);
        scale(this.r);
        stroke(0);
        strokeWeight(1/this.r);
        fill(255, 100);
        beginShape();
        vertex(0, -2);
        vertex(-1, 2);
        vertex(1, 2);
        endShape(CLOSE);
        // text
        fill(0);
        scale(1/this.r);
        scale(2);
        let _x = floor1(this.velocity.x);
        let _y = floor1(this.velocity.y);
        
        text(`v(${_x},${_y})`, 0, 0);
        pop();
    }
}

class Target {
    constructor() {
        this.position = createVector(random(0, width), random(0, height));
        this.mass = 1;
    }
    display() {
        push();
        translate(this.position.x, this.position.y);
        fill(50, 100);
        stroke(50);
        ellipse(0, 0, this.mass*10, this.mass*10);
        point(0, 0);
        pop();
    }
}

let vehicle;
let targets;
function setup() {
    createCanvas(700, 300);
    vehicle = new Vehicle(width/2, height/2);
    targets = Array.from({length:2}, (v,k)=> new Target());
    console.log(targets)
}
function draw() {
    background(240);
    vehicle.seek(targets);
    //vehicle.bound(50);
    vehicle.update();
    vehicle.display();

    targets.forEach(v=>v.display());
}