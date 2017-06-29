/// <reference path="../../p5.global-mode.d.ts" />
function rule90(l,m,r) {
    if (l == 0 && m == 0 && r == 0) return 0;
    if (l == 0 && m == 0 && r == 1) return 1;
    if (l == 0 && m == 1 && r == 0) return 0;
    if (l == 0 && m == 1 && r == 1) return 1;
    if (l == 1 && m == 0 && r == 0) return 1;
    if (l == 1 && m == 0 && r == 1) return 0;
    if (l == 1 && m == 1 && r == 0) return 1;
    if (l == 1 && m == 1 && r == 1) return 0;
    return 0;
}
const rstr = (s)=> s.split("").reverse().join("");

function rule(n, l, m, r) {
    let num = '' + l + m + r; // make binary string. 1,0,1 -> '101'
    let i = parseInt(num, 2); // binary to dec.      '101' -> 5  
    let bin = (n>>>0).toString(2); // decimal number to binary.  
    let str = ('00000000' + bin).slice(-8);// format 8 digit
    return parseInt(rstr(str)[i]); // string to decimal. '5' -> 5
}

function gen(ary, ruleN) {
    let dest = new Array(width).fill(0);
    for (let i = 0, len = ary.length; i < len; i++) {
        let left   = ary[(len+i-1)%len];
        let middle = ary[(len+i+0)%len];
        let right  = ary[(len+i+1)%len];
        let n = rule(ruleN, left, middle, right);
        //let n = rule90(left, middle, right);
        dest[i] = n;
    }
    return dest;
}
function pri(line, y) {
    let len = line.length;
    for (let x = 0; x < len; x++)
        if (line[x]) point(x, y);
}
function setup() {
    createCanvas(400, 400);
    background(240);

    let next = new Array(width).fill(0);
    next[next.length/2] = 1;
    for (let y = 0; y < height; y++) {
        pri(next, y);
        next = gen(next, 30);
    }
}

