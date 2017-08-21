/// <reference path="../../p5.global-mode.d.ts" />
// 9.13 生態系シミュレーション
const randVec2 = () => createVector(random(0, width), random(0, height));

class DNA {
    constructor() {
        this.genes = Array.from(Array(1), (v, k)=> random(0, 1));
    }
    copy() {
        let dna = new DNA();
        dna.genes = this.genes.slice(0); // 0ですべて切り出すので、コピーとなる
        return dna;
    }
    mutate(mutationRate) {
        this.genes.forEach((v, i, a) => a[i] = random(1) < mutationRate ? random(0, 1) : v);
        return this;
    }
}
// ブループ(bloop)
// パーリンノイズに従って動く。大きいものほど動きが遅く、小さいものほど速い。
class Bloop {
    constructor(pos, dna) {
        this.position = pos;
        this.xoff = random(0, 50);
        this.yoff = random(0, 50);
        this.health = 100;

        this.dna = dna;

        this.maxspeed = map(dna.genes[0], 0, 1, 15, 0);
        this.r = map(dna.genes[0], 0, 1, 0, 50);;
    }
    reproduce() {
        let ret = [];
        if (random(1) < 0.0005) { // 生殖の確率は0.05%
            let childDNA = this.dna.copy().mutate(0.01); // 突然変異
            ret.push(new Bloop(this.position, childDNA));
        }
        return ret;
    }
    update() {
        let vx = map(noise(this.xoff), 0, 1, -this.maxspeed, this.maxspeed);
        let vy = map(noise(this.yoff), 0, 1, -this.maxspeed, this.maxspeed);
        
        let velocity = createVector(vx, vy);
        this.xoff += 0.01;
        this.yoff += 0.01;

        this.position.add(velocity);

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

        this.health -= 0.2;
        return this;
    }
    display() {
        let a = map(this.health, 0, 200, 0, 255);
        push();
        fill(0, 0, 0, a);
        // TODO: healthで大きさ変更、dna.genesにも影響あり
        //ellipse(this.position.x, this.position.y, this.r * (this.health/100), this.r * (this.health/100));
        ellipse(this.position.x, this.position.y, this.r, this.r);
        point(this.position.x, this.position.y);
        pop();
        text(`Bloop: `, this.position.x + 12, this.position.y - 12);
        text(`health: ${floor(this.health)}`, this.position.x + 12, this.position.y);
        return this;
    }
    run() {
        return this.update().display();
    }
    eat(foods) {
        let len = foods.length;
        let result = foods.filter((v, i, a)=> p5.Vector.dist(this.position, v.position) >= this.r/2);
        this.health += (100 * (len - result.length));
        return result;
    }
    isDead() {
        return (this.health < 0.0)
    }
}

class Food {
    constructor(posVec2) {
        this.position = posVec2 || randVec2();
        this.w = this.h = 10;
    }
    display() {
        push();
        fill(150);
        text(`food`, this.position.x + 12, this.position.y);
        rectMode(CENTER);
        rect(this.position.x, this.position.y, this.w, this.h);
        point(this.position.x, this.position.y);
        pop();
    }
}

class World {
    constructor(n) {
        this.bloops = Array.from(Array(n), (v,k)=> new Bloop(randVec2(), new DNA()));
        this.foods = Array.from(Array(100), (v, k)=> new Food());
    }
    makeFood(vec, rate = 0.01) {
        return (random(0,1) < rate) && (this.foods.push(new Food(vec)));
    } 
    run() {
        this.makeFood();
        this.foods.forEach((v) => v.display());
        this.bloops.forEach((b)=> this.foods = b.run().eat(this.foods));
        // 無性生殖
        let newBloops = this.bloops.map((v)=> v.reproduce()).reduce((p, c, i, a) => p.concat(c), []);
        this.bloops.concat(newBloops);
        // 死亡フラグが立っていたら、そこに生物を生成
        this.bloops.filter((b)=>b.isDead()).forEach((v) => this.makeFood(v.position, 1.0));
        // 死亡フラグが立っていたら、それを除外して(Bloop死亡)に新たな配列を作成。
        this.bloops = this.bloops.filter((v)=>!v.isDead());
    }
}
let world;
function setup() {
    createCanvas(720, 360);
    world = new World(10);
}
function draw() {
    background(240);
    world.run();
    text(`9.13 生態系シミュレーション`, 10, 20);
}