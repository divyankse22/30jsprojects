let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize*columns;
let boardHeight = tileSize*rows;
let context;

let shipWidth = 2*tileSize;
let shipHeight = tileSize;
let shipX = tileSize*columns/2-tileSize;
let shipY = tileSize*rows-2*tileSize;


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
}