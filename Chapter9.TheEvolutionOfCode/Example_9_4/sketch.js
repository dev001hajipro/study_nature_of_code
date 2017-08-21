/// <reference path="../../p5.global-mode.d.ts" />

class DNA {
    constructor() {
        this.genes = Array.from(Array(20), (v, k) => random(0, 1));
    }
}
class Face {
    constructor(dna) {
        this.dna = dna;
        this.fitness;
    }
    display() {

    }
}
class Population {
    constructor(mutationRate) {

    }
    display() {

    }
}
let population;
let button;
function setup() {
    createCanvas(720, 200);
    const MUTATION_RATE = 0.05;
    population = new Population(MUTATION_RATE, 10);
    button = createButton('next generation');
    
}

function draw() {
    background(240);

    population.display();
    population.rollover(mouseX, mouseY);

}