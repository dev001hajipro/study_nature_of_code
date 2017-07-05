/// <reference path="../../p5.global-mode.d.ts" />
var cols;
var rows;
var resolution;
var board;
function setup() {
    createCanvas(400, 400);
    frameRate(5);

    resolution = 10;
    cols = width / resolution;
    rows = height / resolution;

    board = new Array(cols);
    for (var c = 0; c < board.length; c++) {
        board[c] = new Array(rows).fill(0).map(n=>int(random(0,2)));
    }    
}

function gen(board) {
    // create next board.
    var next = new Array(cols);
    for (var c = 0; c < next.length; c++) {
        next[c] = new Array(rows).fill(0);
    }

    for (var c = 0; c < cols; c++) {
        for (var r = 0; r < rows; r++) {
            var cell = board[c][r];

            // check neighbors
            var neighobers = 0;
            if (board[(cols+c-1)%cols][(rows+r-1)%rows] == 1) neighobers++;
            if (board[(cols+c+0)%cols][(rows+r-1)%rows] == 1) neighobers++;
            if (board[(cols+c+1)%cols][(rows+r-1)%rows] == 1) neighobers++;

            if (board[(cols+c-1)%cols][(rows+r+0)%rows] == 1) neighobers++;
            if (board[(cols+c+0)%cols][(rows+r+0)%rows] == 1) neighobers++;
            if (board[(cols+c+1)%cols][(rows+r+0)%rows] == 1) neighobers++;

            if (board[(cols+c-1)%cols][(rows+r+1)%rows] == 1) neighobers++;
            if (board[(cols+c+0)%cols][(rows+r+1)%rows] == 1) neighobers++;
            if (board[(cols+c+1)%cols][(rows+r+1)%rows] == 1) neighobers++;

            neighobers -= board[c][r];

            if (cell == 1 && neighobers < 2) {
                    next[c][r] = 0;
            } else if (cell == 1 && neighobers > 3) {
                    next[c][r] = 0;
            } else if (cell == 0 && neighobers == 3) {
                    next[c][r] = 1;
            } else {
                next[c][r] = board[c][r];
            }
        }
    }
    return next;
}
function pri(board) {
    for (var c = 0; c < cols; c++) {
        for (var r = 0; r < rows; r++) {
            if (board[c][r] == 0) {
                fill(10);
            } else {
                fill(250);
            }
            rect(c*10, r*10, 10, 10);
        }        
    }
}
function draw() {
    background(240);
    pri(board);
    board = gen(board);
}