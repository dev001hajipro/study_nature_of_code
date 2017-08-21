/// <reference path="../../p5.global-mode.d.ts" />

/////////////////////////////
// 用語 
/////////////////////////////
// コネクショニズム - connectionism
// 概念や常識を最初に持たず、白紙の状態から、多数の事例で"経験"させ、"学習"していく
// 疑似ニューロンを作成する。
//
// 教育あり学習 - Supervised Learning
// ネットワークが出した答えに対して、あらかじめ用意してある正しい答えと比較し、誤差を調整
// 強化学習 - Reinforcement Learning
// 環境の観察により精度を高めていく。迷路のコストなど。
//
// パーセプトロン - Perceptron
// 最も単純なニューラルネットワークであり、単一ニューロンの計算モデル
//

/////////////////////////////
// 10.3 パーセプトロンを使った簡単なパターン認識

class Perceptron {
    constructor(n) {
        this.C_learingRate = 0.01;
        this.weights = Array.from({length:n}, (v,k)=>random(-1.0, 1.0))
        console.log('weights', this.weights)
    }
    // 単純なパーセプトロンのアルゴリズム
    // 1.入力ごとに、入力と重みをかける
    // 2.すべての入力を合計
    // 3.活性化関数(activation function)に、合計値を渡し、出力を計算(推測)
    feedforward(inputs) {
         const zipped = inputs.map((v,i,a)=> v * this.weights[i]);
         const sum = zipped.reduce((acc, c)=> acc + c)
         return this.activate(sum);
    }
    activate(n) { return n > 0 ? 1 : -1; }

    train(inputs, desired) {
        // 入力から推測結果を求める。
        let guess = this.feedforward(inputs);
        let error = desired - guess; // 希望する答えと、推測結果を比較
        // 重みの調整。推測結果(guess)が正しいとerror=0となり、重みは変化しない。
        // [重みの式]
        // 新しい重み = 重み + Δ重み
        // Δ重み = エラー * 入力
        // 新しい重み = 重み + エラー * 入力
        // さらに、定数を用意
        // 新しい重み = 重み + エラー * 入力 * 学習定数
        this.weights.forEach((v,i,a)=> a[i] = a[i] + error * inputs[i] * this.C_learingRate);
    }
}

const f = (x) => 2 * x + 1;

class Trainer {
    constructor(x, y, answer) {
        this.inputs = [x, y, BIAS];
        this.answer = answer;
    }

    static makeData(n) {
        return Array.from({length:n}, (v,k)=> {
            let x = random(-width/2, width/2);
            let y = random(-height/2, height/2);
            let answer = y < f(x) ? -1 : 1;
            return new Trainer(x, y, answer)
        });
    }
}



const BIAS = 1.0

let p;
let training;

function setup() {
    createCanvas(400, 400);
    p = new Perceptron(3); // 重み変数3,weight[3]
    training = Trainer.makeData(2000);
    console.log(training)
}

let count = 0;
function draw() {
    background(240);
    translate(width/2, height/2);

    // パーセプトロンの重みが学習されていく。
    p.train(training[count].inputs, training[count].answer)

    count = (count + 1) % training.length;

    //const f = (x) => 2 * x + 1;
    stroke(255, 0, 0)
    line(-width/2, f(-width/2), width/2, f(width/2))

    // 描画
    stroke(0);
    for (let i = 0; i < count; i++) {
        let guess = p.feedforward(training[i].inputs);
        if (guess > 0) {
            noFill();
        } else {
            fill(0);
        }
        ellipse(training[i].inputs[0], training[i].inputs[1], 8, 8);
    }
}
