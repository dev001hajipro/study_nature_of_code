/// <reference path="../../p5.global-mode.d.ts" />
class Vehicle {
    constructor(x=0,y=0,m=1) {
        this.mass = m;
        this.r = 5;
        this.maxspeed = 4;
        this.maxforce = 0.1;
        this.position = createVector(x, y);
        let vx = random(-this.maxspeed, this.maxspeed);
        let vy = random(-this.maxspeed, this.maxspeed);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(vx, vy);
    }
    applyForce(force) { // F=M*A, A=F/M
        let a = p5.Vector.div(force, this.mass);
        this.acceleration.add(a);
    }
    follow(flowField) {
        let desired = flowField.lookup(this.position);
        desired.mult(this.maxspeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        this.applyForce(steer);
    }
    seek(target) {
        let desired = p5.Vector.sub(target.position, this.position);
        desired.normalize();
        desired.mult(this.maxspeed);

        let steer = p5.Vector.sub(desired, this.velocity);
        steer.mult(this.maxforce);
        this.applyForce(steer);
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
        let a = this.velocity.heading() + PI/2; // 90度傾ける
        push();
        //stroke(50);
        //strokeWeight(1/this.r);
        //fill(25);
        translate(this.position.x, this.position.y);
        rotate(a);
        scale(this.r);
        beginShape();
        vertex(-1, 2);
        vertex(0, -2);
        vertex(1, 2);
        endShape(CLOSE);
        pop();
    }
    runFollow(flowField) {
        this.follow(flowField);
        this.update();
        this.display();
    }
}
class Target {
    constructor() {
        this.position = createVector(random(0, width), random(0, height));   
        this.mass = 1;
    }
    update() {   
    }
    display() {
        push();
        //stroke(50);
        fill(75);
        translate(this.position.x ,this.position.y);
        rotate(0);
        ellipse(0, 0, this.mass*16, this.mass*16);
        pop();
    }
}
class FlowField {
    constructor() {
        this.resolution = 10;
        this.cols = width / this.resolution;
        this.rows = height / this.resolution;
        this.field = [];
        this.initFieldByNoise3(zoff);
    }
    initFieldByCenter() {
        for (let x = 0; x < this.cols; x++) {
            this.field[x] = [];
            for (let y = 0; y < this.rows; y++) {
                let c = createVector(width/2, height/2);
                let _p = createVector(this.resolution * x, this.resolution * y);
                let v = p5.Vector.sub(c, _p);
                v.normalize();
                this.field[x][y] = v;
            }
        }
    }
    initFieldBySameVector() {
        for (let x = 0; x < this.cols; x++) {
            this.field[x] = [];
            for (let y = 0; y < this.rows; y++) {
                this.field[x][y] = createVector(1, 0.5);
            }
        }
    }
    initFieldByRandom() {
        for (let x = 0; x < this.cols; x++) {
            this.field[x] = [];
            for (let y = 0; y < this.rows; y++) {
                this.field[x][y] = createVector(random(-1,1), random(-1,1));
                this.field[x][y].normalize();
            }
        }
    }
    initFieldByNoise() {
        let xoff = 0;
        for (let x = 0; x < this.cols; x++) {
            this.field[x] = [];
            let yoff = 0;
            for (let y = 0; y < this.rows; y++) {
                let theta  = map(noise(xoff, yoff), 0, 1, 0, TWO_PI);
                this.field[x][y] = createVector(cos(theta), sin(theta));
                yoff += 0.1;
            }
            xoff += 0.1;
        }        
    }
    initFieldByNoise3(zoff) {
        let xoff = 0;
        for (let x = 0; x < this.cols; x++) {
            this.field[x] = [];
            let yoff = 0;
            for (let y = 0; y < this.rows; y++) {
                let theta  = map(noise(xoff, yoff, zoff), 0, 1, 0, TWO_PI);
                this.field[x][y] = createVector(cos(theta), sin(theta));
                yoff += 0.1;
            }
            xoff += 0.1;
        }        
    }
    // 指定した位置のフィールドにあるベクトルを返す。位置は、PIXEL単位ではなく、col,row単位
    lookup(v) {
        let col = int(constrain(v.x/this.resolution, 0, this.cols-1));
        let row = int(constrain(v.y/this.resolution, 0, this.rows-1));
        return this.field[col][row].copy();
    }
    display() {
        let rs = this.resolution;
        for (let x = 0, xlen = this.cols; x < xlen; x++) {
            for (let y = 0, ylen = this.rows; y < ylen; y++) {
                let vec = this.field[x][y];
                // arrow shape. but slow.
                // let a = vec.heading() + PI/2;
                // push();
                // translate(x*this.resolution + vec.x*this.resolution, y*this.resolution + vec.y*this.resolution);
                // rotate(a);
                // scale(1);
                // beginShape();
                // vertex(-1, 2);
                // vertex(0, -2);
                // vertex(1, 2);
                // endShape(CLOSE);
                // pop();

                push();
                //stroke(240);
                //fill(200,0,0);
                //strokeWeight(2);
                translate(x*rs, y*rs);
                //point(0, 0);
                //stroke(200);
                //strokeWeight(1);
                line(0,0, vec.x*rs, vec.y*rs);
                pop();
            }
        }
        
    }
}
let vehicles;
let target;
let p;
let zoff = 0;
function setup() {
    createCanvas(720, 300);
    vehicles = new Array(1).fill(0).map(n=>new Vehicle(random(0, width), random(0, height)));
    target = new Target();
    flowField = new FlowField();
    p = createP('s');
    createP('click mouse to append the Vehicle.');
}
function draw() {
    background(255);

    flowField.display();
    flowField.initFieldByNoise3(zoff);
    zoff += 0.01;

    target.display();
    vehicles.forEach((v)=>v.runFollow(flowField));

    p.html(frameRate());

    if (vehicles.length < 200) {
        if (mouseIsPressed) {
            vehicles.push(new Vehicle(random(0, width), random(0, height)));
        }
        if (frameCount % 60 == 0)
            vehicles.push(new Vehicle(random(0, width), random(0, height)));
    }
}

