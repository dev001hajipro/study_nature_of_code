/// <reference path="../../p5.global-mode.d.ts" />

const TARGET = "to be or not to be";
const MUTATE_RATE = 0.01;
const POPULATION_COUNT = 150;

function newChar() {
    let c = floor(random(64, 122)); // ascii code.
    c = (c === 64) ? 32 : c; // @ mark to space.
    return String.fromCharCode(c);    
}

class DNA {
    constructor(n) {
        this.genes = Array.from({length: n}, (v, k)=> newChar());
        this._fitness = 0;
    }
    // 適応度関数
    fitness(target) {
        let score = this.genes.reduce((p,c,i,a)=> c === target[i] ? ++p : p, 0);
        this._fitness = score / target.length;
    }
    crossover(partner) {
        let child = new DNA(this.genes.length);
        let midpoint = floor(random(this.genes.length));
        child.genes = child.genes.map((v,i)=> (i > midpoint) ? this.genes[i] : partner.genes[i]);
        return child;
    }
    // 突然変異
    mutate(mutationRate) {
        this.genes.forEach((v,i,a)=> a[i] = random(1) < mutationRate ? newChar() : v);
    }
}
let population;
function setup() {
    createCanvas(1280, 720);
    // ステップ1.集団の作成
    let n = TARGET.length;
    population = Array.from({length: POPULATION_COUNT}, (v,k)=> new DNA(n));
}
let generationCount = 1;
function draw() {
    background(240);

    // ステップ2.選択
    // 集団の各要素の適応度を計算
    population.forEach((dna,i,a)=> dna.fitness(TARGET));
    // 交配プールを作成
    let matingPool = [];
    population.forEach((dna,i,a)=> {
        let n = floor(dna._fitness * 100);
        //for (let j = 0; j < n; j++)
        //  matingPool.push(population[i]);
        Array.prototype.push.apply(matingPool, Array(n).fill(population[i]));
    });
    
    // ステップ3. 生殖(reproduction)
    population = population.map((v,i)=> {
        let parent1 = matingPool[floor(random(matingPool.length))];
        let parent2 = matingPool[floor(random(matingPool.length))];
        // 交叉
        let child = parent1.crossover(parent2);
        // 突然変異
        child.mutate(MUTATE_RATE);
        return child;
    });

    // 表示
    population.map((dna)=> dna.genes.join(''))
        .forEach((v,i,a)=>{
            let x = i % 4;
            let y = int(i / 4);
            if (v === TARGET) {
                fill(255, 0, 0);
            } else {
                fill(0, 0, 0);
            }
            text(v, 10+(x * 150), 30+(y * 15));
        });

    text(`generation:${generationCount}`, 800, 30);
    generationCount++;

    // TARGET文字列ができたら、プログラム停止。
    let index = population.findIndex((dna,i,a)=> dna.genes.join('') === TARGET);
    if (index !== -1) {
        text(`FOUND index=${index}`, 800, 60);
        noLoop();
    }
}
