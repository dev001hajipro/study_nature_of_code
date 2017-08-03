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

		// boost
		this.genes[0].normalize();
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
	constructor(lifetime, target, _dna) {
		this.position = createVector(width / 2, height + 20);
		this.velocity = createVector(0, 0);
		this.acceleration = createVector(0, 0);

		this.dna = _dna || new DNA(lifetime);
		this.fitness = 0;
		this.r = 4;

		this.geneCounter = 0;
		this.hitObstacle = false;
		this.hitTarget = false;
		this.recordDist = 10000.0; // 最短距離

		this.target = target;
		this.finishTime = 0;
	}
	// カスタマイズ要素2.
	// 適応度関数
	calcFitness() {
		(this.recordDist < 1) && (this.recordDist = 1);

		this.fitness = (1 / (this.finishTime * this.recordDist));
		this.fitness = pow(this.fitness, 4);

		this.hitObstacle && (this.fitness *= 0.1);
		this.hitTarget && (this.fitness *= 2);
	}

	isHit() {
		return p5.Vector.dist(this.position, this.target.position) < 12;
	}
	applyForce(f) {
		this.acceleration.add(f);
	}
	update() {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.mult(0);
	}
	checkTarget() {
		let d = p5.Vector.dist(this.position, this.target.position);
		(d < this.recordDist) && (this.recordDist = d);

		this.hitTarget = this.target.contains(this.position);
		(!this.hitTarget) && (this.finishTime++);

		return this;
	}
	run(os) {
		if (!this.hitObstacle && !this.hitTarget) {
			this.applyForce(this.dna.genes[this.geneCounter]);
			this.geneCounter = (this.geneCounter + 1) % this.dna.genes.length;
			this.update();
			this.obstacles(os);
		}

		(!this.hitObstacle) && this.display();
	}
	obstacles(os) {
		this.hitObstacle = os.some((o, i, a)=> o.contains(this.position));
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
		this.generations = 1;
		this.lifetime = lifetime;

		this.create(populationCount, lifetime);
	}
	// 集団の作成
	create(populationCount, lifetime) {
		//this.population = Array.from(Array)
		this.population = Array.from(Array(populationCount), () => new Rocket(lifetime, this.targetObject));
	}
	live(obstacles) {
		this.population.forEach((rocket, i, a) => rocket.checkTarget().run(obstacles));
	}
	targetReached() {
		return this.population.some((v, i, a) => v.hitTarget);
	}
	// 集団の各要素の適応度を計算
	calcFitness() {
		this.population.forEach((rocket, i, a) => rocket.calcFitness());
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

			return new Rocket(this.lifetime, this.targetObject, childDna);
		});
		// 世代が変わる
		this.generations++;
		return this;
	}
}

class Obstacle {
	constructor(x, y, w, h) {
		this.position = createVector(x, y);
		this.w = w;
		this.h = h;
	}
	display() {
		push();
		stroke(0);
		fill(175);
		strokeWeight(2);
		rectMode(CORNER);
		rect(this.position.x, this.position.y, this.w, this.h);
		pop();
	}
	contains(o) {
		return (this.position.x < o.x && o.x < this.position.x + this.w && this.position.y < o.y && o.y < this.position.y + this.h)
	}
}

let lifecycle;
const lifetime = 500; // 1世代の生存期間
let recordTime;

let target;
let obstacles;
let population;

function setup() {
	createCanvas(720, 360);

	recordTime = lifetime;
	lifecycle = 0;

	target = new Obstacle(width / 2-12, 24, 24, 24);
	obstacles = [];
	obstacles.push(new Obstacle(width/2-100, height/2, 200, 10));
	obstacles.push(new Obstacle(width/3-100, height/3, 200, 10));
	obstacles.push(new Obstacle(width/3*2-100, height/3, 200, 10));

	// カスタマイズ要素1.集団の要素数と突然変異率
	const POPULATION_COUNT = 100;
	const MUTATE_RATE = 0.01;
	population = new Population(target, POPULATION_COUNT, MUTATE_RATE, lifetime);
}

function draw() {
	background(240);
	text('Simple Smart Rockets', 10, 20);

	target.display();
	obstacles.forEach((v, i, a)=> v.display());

	if (lifecycle < lifetime) {
		population.live(obstacles);
		// 最短記録を更新
		if (population.targetReached() && (lifecycle < recordTime)) {
			recordTime = lifecycle;
		}
		lifecycle++;
	} else {
		lifecycle = 0;
		population.calcFitness().select().reproduct();
	}

	text(`Generation   : ${population.generations}`, 10, 50);
	text(`Cycles left  : ${lifetime - lifecycle}`, 10, 70);
	text(`Record cycles: ${recordTime}`, 10, 90);
}

function mousePressed() {
	target = new Target(mouseX, mouseY);
	population.target = target;
	recordTime = lifetime;
}