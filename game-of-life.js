const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

let rows = 0;
let columns = 0;

let red = 128;
let green = 128;
let blue = 128;

const cellSize = 16;

const stepRate = 50;

const fadeFactor = 8;

const aliveChance = 0.5;

let cells = [];

const gridToIndex = (x, y) => x + y * columns;

const drawCell = (p5, cell) => {
  const fillColor = `rgba(${red}, ${green}, ${blue}, ${cell.alive / fadeFactor})`;
  p5.fill(fillColor);
  p5.circle(
    (cell.x * cellSize) + (cellSize / 2),
    (cell.y * cellSize) + (cellSize / 2),
    cellSize + (cell.alive * fadeFactor) / 2
  );
};

const isAlive = (x, y) => {
  if (x < 0 || x >= columns || y < 0 || y >= rows) {
    return false;
  }
  return cells[gridToIndex(x, y)].alive === fadeFactor ? 1 : 0;
};

const step = () => {
  cells.forEach(o => {
    const numAlive =
      isAlive(o.x - 1, o.y - 1) +
      isAlive(o.x, o.y - 1) +
      isAlive(o.x + 1, o.y - 1) +
      isAlive(o.x - 1, o.y) +
      isAlive(o.x + 1, o.y) +
      isAlive(o.x - 1, o.y + 1) +
      isAlive(o.x, o.y + 1) +
      isAlive(o.x + 1, o.y + 1);

    if (numAlive == 2) {
      o.nextAlive = o.alive;
    } else if (numAlive == 3) {
      o.nextAlive = fadeFactor;
    } else {
      o.nextAlive = Math.max(0, o.alive - 1);
    }
  });

  // Apply the new state to the cells
  cells.forEach(o => (o.alive = o.nextAlive));
};

const reset = () => {
  cells = [];
  red = Math.random() > 0.5 ? 128 : 255;
  green = Math.random() > 0.5 ? 128 : 255;
  blue = Math.random() > 0.5 ? 128 : 255;

  columns = Math.floor(window.innerWidth / cellSize);
  rows = Math.floor(window.innerHeight / cellSize);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      cells.push({ x, y, alive: Math.random() > aliveChance ? fadeFactor : 0 });
    }
  }
};

canvasSketch(
  ({ p5 }) => {
    p5.noStroke();

    let ready = true;

    reset();
    document.querySelector('canvas').addEventListener('click', reset);
    window.addEventListener('resize', reset);

    return () => {
      if (ready) {
        setTimeout(() => {
          p5.clear();
          p5.background('#272727');

          step();

          cells.forEach(o => drawCell(p5, o));

          ready = true;
        }, stepRate);
        ready = false;
      }
    };
  },
  {
    p5: { p5 },
    animate: true,
  }
);
