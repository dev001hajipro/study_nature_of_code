/// <reference path="../../p5.global-mode.d.ts" />
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
        f.mult(0.05);
        console.log(x,y);
        this.applyForce(f);
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
    background(245);

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