/// <reference path="../../p5.global-mode.d.ts" />
// 9.10 進化する力:スマートロケット(Smart Rockets)
const myRad = () => Math.random() * Math.PI * 2;
const randVec2 = (rad) => createVector(Math.cos(rad), Math.sin(rad));
const randVec2With = (force) => randVec2(myRad()).mult(random(0, force));

class DNA {
	constructor(lifetime) {
		this.maxforce = 0.1;
		this.lifetime = lifetime;
		// 生存期間の長さのDNAを作成
		this.genes = Array.from(Array(lifetime), () => randVec2With(this.maxforce));
	}
	// 交叉
	crossover(partner) {
		let child = new DNA(this.lifetime);
		const midpoint = floor(random(this.genes.length));
		child.genes = child.genes.map((v, i) => (i > midpoint) ? this.genes[i] : partner.genes[i]);
		return child;
	}
	// 突然変異
	mutate(mutationRate) {
		this.genes.forEach((v, i, a) => a[i] = random(1) < mutationRate ? randVec2With(this.maxforce) : v);
	}
}

class Rocket {
	constructor(lifetime, _dna) {
		this.position = createVector(width / 2, height + 20);
		this.velocity = createVector(0, 0);
		this.acceleration = createVector(0, 0);

		this.dna = _dna || new DNA(lifetime);
		this.fitness = 0;
		this.r = 4;

		this.geneCounter = 0;
	}
	// カスタマイズ要素2.
	// 適応度関数
	calcFitness(targetPosition /*vec2*/ ) {
		let d = p5.Vector.dist(this.position, targetPosition);
		// 最もシンプルなのは1で割る
		//this.fitness = 1 / d;
		this.fitness = pow(1 / d, 2);
	}
	isHit(targetPosition) {
		return p5.Vector.dist(this.position, targetPosition) < 12;
	}

	applyForce(f) {
		this.acceleration.add(f);
	}
	update() {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.mult(0);
	}
	run(targetPosition) {
		if (!this.isHit(targetPosition)) {
			this.applyForce(this.dna.genes[this.geneCounter]);
			this.geneCounter = (this.geneCounter + 1) % this.dna.genes.length;
			this.update();
		}
		this.display();
	}
	display() {
		// heading
		// 90度傾ける(PI/2=90)
		let theta = Math.atan2(this.velocity.y, this.velocity.x) + PI / 2;
		let r = this.r;

		push();
		translate(this.position.x, this.position.y);
		rotate(theta);
		rectMode(CENTER);
		// Thrusters
		fill(0);
		rect(-r / 2, r * 2, r / 2, r);
		rect(r / 2, r * 2, r / 2, r);
		// body
		fill(255);
		beginShape(TRIANGLES);
		vertex(0, -r * 2);
		vertex(-r, r * 2);
		vertex(r, r * 2);
		endShape(CLOSE);

		pop();
	}
}

class Population {
	constructor(targetObject, populationCount, mutationRate = 0.01, lifetime) {
		this.targetObject = targetObject;
		this.mutationRate = mutationRate;
		this.generationCount = 1;
		this.lifetime = lifetime;

		this.create(populationCount, lifetime);
	}
	// 集団の作成
	create(populationCount, lifetime) {
		//this.population = Array.from(Array)
		this.population = Array.from(Array(populationCount), () => new Rocket(lifetime));
	}
	live() {
		this.population.forEach((rocket, i, a) => rocket.run(this.targetObject.position));
	}
	// 集団の各要素の適応度を計算
	calcFitness() {
		this.population.forEach((rocket, i, a) => rocket.calcFitness(this.targetObject.position));
		return this;
	}
	// 選択
	select() {
		// 交配プールを作成
		let maxFitness = Math.max.apply(null, this.population.map((rocket, i, a) => rocket.fitness));

		this.matingPool = [];
		this.population.forEach((rocket, i, a) => {
			let normal = map(rocket.fitness, 0, maxFitness, 0, 1); // scale 0-1.
			let n = floor(normal * 100);
			Array.prototype.push.apply(this.matingPool, Array(n).fill(this.population[i]));
		});

		return this;
	}
	// 生殖
	reproduct() {
		this.population = this.population.map((v, i) => {
			let momRocket = this.matingPool[floor(random(this.matingPool.length))];
			let dadRocket = this.matingPool[floor(random(this.matingPool.length))];

			let momDna = momRocket.dna;
			let dadDna = dadRocket.dna;
			// 交叉
			let childDna = momDna.crossover(dadDna);
			// 突然変異
			childDna.mutate(this.mutationRate);

			return new Rocket(this.lifetime, childDna);
		});
		// 世代が変わる
		this.generationCount++;
		return this;
	}
}

class Target {
	constructor(x, y) {
		this.position = createVector(x, y);
	}
	display() {
		push();
		fill(0);
		stroke(0);
		ellipse(this.position.x, this.position.y, 24, 24);
		pop();
	}
}

let population;
let lifeCounter = 0;
let lifetime = 500; // 1世代の生存期間
let target;

function setup() {
	createCanvas(720, 360);

	target = new Target(width / 2, 24);

	// カスタマイズ要素1.集団の要素数と突然変異率
	const POPULATION_COUNT = 100;
	const MUTATE_RATE = 0.01;
	population = new Population(target, POPULATION_COUNT, MUTATE_RATE, lifetime);
}

function draw() {
	background(240);
	text('Simple Smart Rockets', 10, 20);


	target.display();

	if (lifeCounter < lifetime) {
		population.live();
		lifeCounter++;
	} else {
		lifeCounter = 0;
		population.calcFitness().select().reproduct();
	}

	text(`Generation : ${population.generationCount}`, 10, 50);
	text(`Cycles left: ${lifetime - lifeCounter}`, 10, 70);
}

function mousePressed() {
	target = new Target(mouseX, mouseY);
	population.target = target;
}