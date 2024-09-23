const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const FPS = 10;
const width = 600;
const height = 600;
const tileSize = 2;

const initDeadChance = 0.95;

var pause = false;

var generation = 0;
var population = 0;
var cells = [];

function init() {
    for (let i = 0; i < width/tileSize; i++) {
        let row = [];
        for (let j = 0; j < height/tileSize; j++) {
            if (Math.random() >= initDeadChance) {
                row.push(1);
                population++;
            }
            else {row.push(0);}
        }
        cells.push(row);
    }
}

function draw() {
    ctx.fillStyle = "rgb(242, 242, 242)";
    for (let i = 0; i < width/tileSize; i++) {
        for (let j = 0; j < height/tileSize; j++) {
            if (cells[j][i] === 1) {
                ctx.fillRect(i*tileSize, j*tileSize, tileSize, tileSize);
            }
        }
    }
}

function update() {
    let newCells = [];
    for (let row = 0; row < height/tileSize; row++) {
        let newRow = [];
        for (let col = 0; col < width/tileSize; col++) {
            let rowMinusOne = row-1 < 0 ? (height/tileSize)-1 : row-1;
            let rowPlusOne = row+1 >= (height/tileSize) ? 0 : row+1;
            let colMinusOne = col-1 < 0 ? (width/tileSize)-1 : col-1;
            let colPlusOne = col+1 >= (width/tileSize) ? 0 : col+1;

            let aliveNeighbours = cells[rowMinusOne][colMinusOne]+cells[rowMinusOne][col]+cells[rowMinusOne][colPlusOne]+cells[row][colMinusOne]+cells[row][colPlusOne]+cells[rowPlusOne][colMinusOne]+cells[rowPlusOne][col]+cells[rowPlusOne][colPlusOne];

            let cell = 0;
            if (cells[row][col] === 1) {
                cell = 1;
            }

            let moveOn = false;
            if (cell === 0 && aliveNeighbours === 3) {
                cell = 1;
                population++;
                moveOn = true;
            }
            if (!moveOn && cell === 1 && (aliveNeighbours < 2 || aliveNeighbours > 3)) {
                cell = 0;
                population--;
            }
            newRow.push(cell);
        }
        newCells.push(newRow);
    }
    cells = newCells;
    generation++;
}

function main() {
    if (!pause) {
        setTimeout(() => {
            ctx.clearRect(0, 0, 800, 600);
            draw();
            ctx.font = "14px Serif";
            ctx.fillStyle = "rgb(24, 242, 242)";
            ctx.fillText(`Generation: ${generation}`, 602, 10);
            ctx.fillText(`Population: ${population}`, 602, 26);
            update();
            window.requestAnimationFrame(main);
        }, 1000/FPS);
    }
}

init();
main();