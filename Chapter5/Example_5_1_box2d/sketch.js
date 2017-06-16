/// <reference path="../../p5.global-mode.d.ts" />
class Box {
    constructor(x = 0, y = 0, world) {
        this.w = 16;
        this.h = 16;

        // box2DのBodyが.positionで、x,y座標を持つ
        let bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        // processingの座標からBox2Dのワールド座標に変換
        bd.position = scaleToWorld(x, y);
        this.body = world.CreateBody(bd);

        // 見た目の作成
        // box2dは中心から端までの長さで、width,heigthを指定する。
        let fd = new box2d.b2FixtureDef();
        fd.shape = new box2d.b2PolygonShape();
        fd.shape.SetAsBox(scaleToWorld(this.w/2), scaleToWorld(this.h/2));
        
        // 各種パラメータ
        fd.density = 1.0;
        fd.friction = 0.5;
        fd.restitution = 0.2;
        this.body.CreateFixture(fd);
    }
    display() {
        let pos = scaleToPixels(this.body.GetPosition());
        let a = this.body.GetAngleRadians();

        rectMode(CENTER);
        push();
        translate(pos.x, pos.y);
        rotate(a);
        fill(127);
        stroke(200);
        strokeWeight(2);
        rect(0, 0, this.w, this.h);
        pop();
    }
    killBody() {
        box2d.destroyBody(this.body);
    }
}
let world;
let boxes;
function setup() {
    createCanvas(400, 300);
    let v = box2d.b2Vec2(0, 0);
    world = createWorld(v);
    boxes = new Array();
}
function draw() {
    background(240);
    let timeStep = 1.0/30;
    world.Step(timeStep, 10, 10);
    if (mouseIsPressed)
         boxes.push(new Box(mouseX, mouseY, world));
    boxes.forEach((b)=> b.display());
}