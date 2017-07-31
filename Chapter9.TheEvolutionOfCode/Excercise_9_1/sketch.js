/// <reference path="../../p5.global-mode.d.ts" />
function setup() {
    createCanvas(400, 400);
}

const randASCII = () => String.fromCharCode(random(65, 90));
const randascii = () => String.fromCharCode(random(97, 122));
const randstr = (n) => Array.from({length: n}, (v, k) => randascii()).join('');
const answer = 'cat';

function draw() {
    background(240);

    let str = randstr(answer.length);
    text(`random string. answer is ${answer}.if it found that program stop.`, 10, 10);
    text(str, 10, 30);
    if (str === answer) {
        text(millis() / 1000, 10, 50);
        noLoop();
    }
}