/// <reference path="../../p5.global-mode.d.ts" />
// Excercise_9.6
// ok 各世代でターゲットに最も近い句を表示
// ok 世代数表示
// ok 平均適応度(fitness)
function newChar() {
	let c = floor(random(64, 122)); // ascii code.
	c = (c === 64) ? 32 : c; // @ mark to space.
	return String.fromCharCode(c);
}

class DNA {
	constructor(dnaLength) {
		this.genes = Array.from(Array(dnaLength), () => newChar());
		this.fitness = 0;
    }
    calcScore(target) {
        return this.genes.reduce((p, c, i, a) => c === target[i] ? ++p : p, 0); 
    }
	// 適応度関数
	calcFitness(target) {
		this.fitness = this.calcScore(target) / target.length;
	}
	// 交叉
	crossover(partner) {
		let child = new DNA(this.genes.length);
		const midpoint = floor(random(this.genes.length));
		child.genes = child.genes.map((v, i) => (i > midpoint) ? this.genes[i] : partner.genes[i]);
		return child;
	}
	// 突然変異
	mutate(mutationRate) {
		this.genes.forEach((v, i, a) => a[i] = random(1) < mutationRate ? newChar() : v);
	}
}

// 人口
class Population {
	constructor(target, populationCount, mutationRate = 0.01) {
		this.target = target;
		this.generationCount = 1;
		this.mutationRate = mutationRate;

		this.create(target.length, populationCount);
	}
	// ステップ1.集団の作成
	create(dnaLength, populationCount) {
		this.population = Array.from(Array(populationCount), () => new DNA(dnaLength));
	}
	// ステップ2.選択
	select() {
		// 集団の各要素の適応度を計算
		this.population.forEach((dna, i, a) => dna.calcFitness(this.target));
		// 交配プールを作成
		// TODO Exercise 9.2
		// TODO Exercise 9.3
		this.matingPool = [];
		this.population.forEach((dna, i, a) => {
			let n = floor(dna.fitness * 100);
			Array.prototype.push.apply(this.matingPool, Array(n).fill(this.population[i]));
		});
		return this;
	}
	// ステップ3. 生殖(reproduction)
	reproduct() {
		this.population = this.population.map((v, i) => {
			let parent1 = this.matingPool[floor(random(this.matingPool.length))];
			let parent2 = this.matingPool[floor(random(this.matingPool.length))];
			// 交叉
			let child = parent1.crossover(parent2);
			// 突然変異
			child.mutate(this.mutationRate);
			return child;
		});
		return this;
	}
	// 表示
	display() {
		this.population.map((dna) => dna.genes.join(''))
			.forEach((v, i, a) => {
				let x = i % 4;
				let y = int(i / 4);
				if (v === this.target) {
					fill(255, 0, 0);
				} else {
					fill(0, 0, 0);
				}
				text(`${i}:${v}`, 10 + (x * 150), 30 + (y * 15));
			});

		// status
		// best phrase
		let currentMax = -1;
		let maxDna;
		this.population.forEach((dna, i, o) => {
			if (currentMax === -1) {
				currentMax = dna.fitness;
				maxDna = dna;
			} else if (dna.genes.join('') === this.target) {
				currentMax = dna.fitness;
				maxDna = dna;
			} else if (currentMax > dna.fitness) {
				currentMax = dna.fitness;
				maxDna = dna;
			}
		});
		text(`Best phrase: ${maxDna.genes.join('')}`, 600, 50);
		// ステップ3.生殖で、DNAオブジェクトが子供になるので、まだdna.fitnessが0.0。そのためfitnessを計算する必要がある。
		text(`avarage fitness  : ${this.average()}`, 800, 310);
		text(`total generations: ${++this.generationCount}`, 800, 330);
		text(`total population : ${this.population.length}`, 800, 350);
		text(`mutation rate    : ${this.mutationRate}`, 800, 370);
		return this;
	}
	average() {
		const sumDnaLength = this.population.length * this.population[0].genes.length;
		const scores = this.population.map(dna => dna.calcScore(this.target));
		return scores.reduce((p, c, i, a) => p + c, 0) / sumDnaLength;
	}
	// TARGET文字列ができたら、プログラム停止。
	isPause() {
        return this.population.findIndex((dna, i, a) => dna.genes.join('') === this.target) !== -1 ? true : false;
	}
}
let population;

function setup() {
	let canvas = createCanvas(1280, 720);

	const TARGET = "to be or not to be";
	const POPULATION_COUNT = 150;
	const MUTATE_RATE = 0.01;
	population = new Population(TARGET, POPULATION_COUNT, MUTATE_RATE);
}

function draw() {
	background(240);
	population.select().reproduct().display();
	population.isPause() && noLoop();
}