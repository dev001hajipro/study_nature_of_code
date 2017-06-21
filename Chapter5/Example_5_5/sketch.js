/// <reference path="../../p5.global-mode.d.ts" />
class Boundary {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        // box2DのBodyが.positionで、x,y座標を持つ
        let bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_staticBody;
        // processingの座標からBox2Dのワールド座標に変換
        bd.position = scaleToWorld(x, y);        
        this.body = world.CreateBody(bd);

        // 見た目の作成
        // box2dは中心から端までの長さで、width,heigthを指定する。
        let fd = new box2d.b2FixtureDef();
        fd.shape = new box2d.b2PolygonShape();
        fd.shape.SetAsBox(this.w/(scaleFactor*2), this.h/(scaleFactor*2));
        
        // 各種パラメータ
        fd.density = 1.0;
        fd.friction = 0.5;
        fd.restitution = 0.2;
        this.body.CreateFixture(fd);
    }
    display() {
        fill(127);
        stroke(0);
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);
    }
}
class Box {
    constructor(x = 0, y = 0, world) {
        this.w = random(4, 16);
        this.h = random(4, 16);

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
    done() {
        let pos = scaleToPixels(this.body.GetPosition());
        if (pos.y > height+this.w*this.h) {
            this.killBody();
            return true;
        }
        return false;
    }
}
class Circle {
    constructor(x = 0, y = 0, world) {
        this.w = random(4, 16);
        this.h = random(4, 16);

        // box2DのBodyが.positionで、x,y座標を持つ
        let bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        // processingの座標からBox2Dのワールド座標に変換
        bd.position = scaleToWorld(x, y);
        this.body = world.CreateBody(bd);

        // 見た目の作成
        // box2dは中心から端までの長さで、width,heigthを指定する。
        let fd = new box2d.b2FixtureDef();
        //fd.shape = new box2d.b2PolygonShape();        
        //fd.shape.SetAsBox(scaleToWorld(this.w/2), scaleToWorld(this.h/2));
        fd.shape = new box2d.b2CircleShape();
        this.r = 10;
        fd.shape.m_radius = scaleToWorld(this.r);
        
        // 各種パラメータ
        fd.density = 1.0;
        fd.friction = 0.1;
        fd.restitution = 0.3;

        // bodyとfixtureの関連付け
        this.body.CreateFixture(fd);
    }
    display() {
        let pos = scaleToPixels(this.body.GetPosition());
        let a = this.body.GetAngleRadians();

        push();
        rectMode(CENTER);
        translate(pos.x, pos.y);
        rotate(a);
        fill(127);
        stroke(200);
        strokeWeight(2);
        //rect(0, 0, this.w, this.h);
        ellipse(0, 0, this.r*2, this.r*2);
        line(0, 0, this.r, 0);
        pop();
    }
    killBody() {
        box2d.destroyBody(this.body);
    }
    done() {
        let pos = scaleToPixels(this.body.GetPosition());
        if (pos.y > height+this.w*this.h) {
            this.killBody();
            return true;
        }
        return false;
    }
}
class CustomShape {
    constructor(x = 0, y = 0, world) {
        // box2DのBodyが.positionで、x,y座標を持つ
        let bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        // processingの座標からBox2Dのワールド座標に変換
        bd.position = scaleToWorld(x, y);
        this.body = world.CreateBody(bd);

        // 見た目の作成
        // box2dは中心から端までの長さで、width,heigthを指定する。
        let fd = new box2d.b2FixtureDef();
        //fd.shape = new box2d.b2PolygonShape();        
        //fd.shape.SetAsBox(scaleToWorld(this.w/2), scaleToWorld(this.h/2));
        fd.shape = new box2d.b2PolygonShape();
        let vertices = [];
        // 頂点は反時計回りで定義!!!!!
        vertices[3] = scaleToWorld(-15, 25);
        vertices[2] = scaleToWorld(15, 0);
        vertices[1] = scaleToWorld(20, -15);
        vertices[0] = scaleToWorld(-10, -10);
        fd.shape.SetAsArray(vertices, vertices.length);
        
        // 各種パラメータ
        fd.density = 1.0;
        fd.friction = 0.5;
        fd.restitution = 0.2;

        // bodyとfixtureの関連付け
        this.body.CreateFixture(fd);
    }
    display() {
        let pos = scaleToPixels(this.body.GetPosition());
        let a = this.body.GetAngleRadians();
        let f = this.body.GetFixtureList();
        let ps = f.GetShape();

        rectMode(CENTER);
        push();
        translate(pos.x, pos.y);
        rotate(a);
        fill(127);
        stroke(200);
        strokeWeight(2);
        //rect(0, 0, this.w, this.h);
        //ellipse(0, 0, 20, 20);
        beginShape()
        {
            for (let i = 0; i < ps.m_count; i++) {
                let v = scaleToPixels(ps.m_vertices[i]);
                vertex(v.x, v.y);
            }
        }
        endShape(CLOSE);        
        pop();
    }
    killBody() {
        box2d.destroyBody(this.body);
    }
    done() {
        let pos = scaleToPixels(this.body.GetPosition());
        if (pos.y > height+this.w*this.h) {
            this.killBody();
            return true;
        }
        return false;
    }
}
class Lollipop {
    constructor(x = 0, y = 0, world) {
        this.w = 8;
        this.h = 24;
        this.r = 8;
        // box2DのBodyが.positionで、x,y座標を持つ
        let bd = new box2d.b2BodyDef();
        bd.type = box2d.b2BodyType.b2_dynamicBody;
        // processingの座標からBox2Dのワールド座標に変換
        bd.position = scaleToWorld(x, y);
        this.body = world.CreateBody(bd);

        // 見た目の作成
        // box2dは中心から端までの長さで、width,heigthを指定する。
        let fd1 = new box2d.b2FixtureDef();
        fd1.shape = new box2d.b2PolygonShape();
        fd1.shape.SetAsBox(scaleToWorld(this.w/2), scaleToWorld(this.h/2));
        // 各種パラメータ
        fd1.density = 1.0;
        fd1.friction = 0.5;
        fd1.restitution = 0.2;
        this.body.CreateFixture(fd1); // bodyとfixtureの関連付け

        let fd2 = new box2d.b2FixtureDef();
        fd2.shape = new box2d.b2CircleShape();
        fd2.shape.m_radius = scaleToWorld(this.r);
        let offset = scaleToWorld(new box2d.b2Vec2(0, -this.h/2))
        fd2.shape.m_p = new box2d.b2Vec2(offset.x, offset.y); // m_p変数でローカル位置を変更
        // 各種パラメータ
        fd2.density = 1.0;
        fd2.friction = 0.5;
        fd2.restitution = 0.2;
        this.body.CreateFixture(fd2); // bodyとfixtureの関連付け
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
        ellipse(0, -this.h/2, this.r*2, this.r*2);
        pop();
    }
    killBody() {
        box2d.destroyBody(this.body);
    }
    done() {
        let pos = scaleToPixels(this.body.GetPosition());
        if (pos.y > height+this.w*this.h) {
            this.killBody();
            return true;
        }
        return false;
    }
}
// 湾曲したバウンダリー
class Surface {
    constructor() {
        this.surface = [];
        // サンプル用に3つの座標をもつサーフェース
        // p5.jsの座標系
        this.surface.push(new box2d.b2Vec2(0, height/2-100));
        this.surface.push(new box2d.b2Vec2(width/2, height/2 + 50));
        this.surface.push(new box2d.b2Vec2(width, height/2 + 100));
        // Box2dの座標系に変換
        this.surface = this.surface.map((v)=>scaleToWorld(v));
        console.log(this.surface);
        
        let chain = new box2d.b2ChainShape();
        chain.CreateChain(this.surface, this.surface.length);

        let bd = new box2d.b2BodyDef();
        this.body = world.CreateBody(bd);

        // fixture作成
        let fd = new box2d.b2FixtureDef();
        fd.shape = chain;

        // 各種設定
        fd.density = 1.0;
        fd.friction = 0.1;
        fd.restitution = 0.3;
        // bodyとfixtureの関連付け
        this.body.CreateFixture(fd);
    }
    display() {
        beginShape();
        push();
        translate(0, 0);
        strokeWeight(1);
        stroke(200);
        fill(200);
        beginShape();
        {
            this.surface.forEach(v=>{
                let p = scaleToPixels(v);
                vertex(p.x, p.y);
            })
        }
        // 底辺
        vertex(width, height);
        vertex(0, height);
        endShape(CLOSE);
        pop();
    }
}

let world;
let boxes;
let boundaries;
function setup() {
    createCanvas(400, 300);
    let v = box2d.b2Vec2(0, 0);
    world = createWorld(v);
    boxes = new Array();
    boundaries = new Array();
    boundaries.push(new Boundary(width/4, height-5, width/2-50, 10));
    boundaries.push(new Boundary(3*width/4, height-50, width/2-50, 10));

    //surface = new Surface();
}
function draw() {
    background(240);
    let timeStep = 1.0/30;
    world.Step(timeStep, 10, 10);
    
    if (mouseIsPressed)
         boxes.push(new Lollipop(mouseX, mouseY, world));
        
    boundaries.forEach((b)=>b.display());
    boxes.forEach((b)=> b.display());
    // todo kill.

    //surface.display();
}