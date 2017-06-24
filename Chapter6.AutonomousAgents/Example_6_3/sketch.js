/// <reference path="../../p5.global-mode.d.ts" />
const floor1=(n)=>floor(n*10)/10;
class Vehicle {
    constructor(x = 0, y = 0, m = 1) {
        this.maxspeed = 3;
        this.position = createVector(x, y);
        this.velocity = createVector(random(-this.maxspeed, this.maxspeed),random(-this.maxspeed, this.maxspeed));
        this.acceleration = createVector(0, 0);
        this.mass = m;
        this.r = 5;
        this.maxforce = 0.15;
    }

    applyForce(force) {
        // F=AM, A=F/M
        let a = p5.Vector.div(force, this.mass);
        this.acceleration.add(a);
    }
    seek(target) {
        // 進みたい方向の最大速度のベクトルを求める。
        let desired = p5.Vector.sub(target.position, this.position);
        desired.normalize();
        desired.mult(this.maxspeed);
        push();
        stroke(200, 0, 0, 150);
        line(this.position.x, this.position.y,
        target.position.x, target.position.y);
        stroke(0, 200, 0, 150);
        strokeWeight(5);
        line(this.position.x, this.position.y,
        this.position.x + desired.x, this.position.y + desired.y);
        pop();

        // 操舵ベクトル=進みたい速度ベクトル-現在の速度ベクトル
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        this.applyForce(steer);

    }
    bound(d = 25) {

        // 壁に距離dに入ると、最高スピードで反対に移動。
        let desired;
        if (this.position.x < d) {
            desired = createVector(this.maxspeed, this.velocity.y);
        } else if (this.position.x > width-d) {
            desired = createVector(-this.maxspeed, this.velocity.y);
        }
        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxspeed);
        } else if (this.position.y > height-d) {
            desired = createVector(this.velocity.x, -this.maxspeed);
        }
        if (desired) {
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }
    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
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
        this.position = createVector(width/5*4, height/2);
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
let target;
function setup() {
    createCanvas(700, 300);
    vehicle = new Vehicle(width/2, height/2);
    target = new Target();
}
function draw() {
    background(240);
    //vehicle.seek(target);
    vehicle.bound(50);
    vehicle.update();
    vehicle.display();

    target.display();
}