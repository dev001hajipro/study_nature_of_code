/// <reference path="../../p5.global-mode.d.ts" />

// コネクショニズム - connectionism
// 概念や常識を最初に持たず、白紙の状態から、多数の事例で"経験"させ、"学習"していく
// 疑似ニューロンを作成する。
//
// 強化学習 - Reinforcement Learning
//
// パーセプトロン - Perceptron
// 最も単純なニューラルネットワークであり、単一ニューロンの計算モデル
//

function setup() {
    createCanvas(400, 400)
    background(240)
    noLoop()

    // 380ページの以下を関数型で書いてみる
    // 単純なパーセプトロンのアルゴリズム
    // 1.入力ごとに、入力と重みをかける
    // 2.すべての入力を合計
    // 3.活性化関数(activation function)に、合計値を渡し、出力を計算

    const inputs = [12.0, 4.0]
    const weights = [0.5, -1.0]

    const sum = inputs.map((v,i,a)=> v * weights[i]).reduce((acc, c)=> acc + c) // zipWith + sum
    const activate = (sum) => sum > 0 ? 1 : -1 // sign活性化関数
    const output = activate(sum)

    text(output, 10, 20)
}
