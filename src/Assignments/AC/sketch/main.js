const canvasContainer = document.getElementById('canvas-container');
let renderer;

const INITIAL_W = 800;
const INITIAL_H = 600;
const INITIAL_RATIO = INITIAL_W / INITIAL_H;

let lastTime = 0;
const interval = 300;

const cellsPerRow = 100;
//한 줄당 몇개의 셀이 들어가는가?
let cellsPerColumn;
const cells = [];
let cellSize;

function getIdx(r, c) {
  return r * cellsPerRow + c;
}

function setup() {
  renderer = createCanvas(INITIAL_W, INITIAL_H);
  renderer.parent(canvasContainer);
  renderer.elt.style.aspectRatio = `${INITIAL_W} / ${INITIAL_H}`;

  new ResizeObserver(() => {
    const { width: containerWidth, height: containerHeight } = canvasContainer.getBoundingClientRect();
    renderer.elt.style.width = `${containerWidth}px`;
    renderer.elt.style.height = `${containerWidth / INITIAL_RATIO}px`;
  }).observe(canvasContainer);

  cellSize = width / cellsPerRow;
  cellsPerColumn = Math.floor(height / cellSize);

  const states = ['R', 'P', 'S'];

  //안에꺼 먼저 만들어 줘야함.
  for (let r = 0; r < cellsPerColumn; r++) {
    for (let c = 0; c < cellsPerRow; c++) {
      const x = c * cellSize;
      const y = r * cellSize;
      const randomState = random(states);
      const newCell = new Cell(x, y, cellSize, cellSize, randomState);
      cells.push(newCell);
    }
  }

  cells.forEach((cell, idx) => {
    const row = Math.floor(idx / cellsPerRow);
    const col = idx % cellsPerRow;
    const tl = row > 0 && col > 0 ? cells[getIdx(row - 1, col - 1)] : null;
    const t = row > 0 ? cells[getIdx(row - 1, col)] : null;
    const tr = row > 0 && col < cellsPerRow - 1 ? cells[getIdx(row - 1, col + 1)] : null;
    const r = col < cellsPerRow - 1 ? cells[getIdx(row, col + 1)] : null;
    const br = row < cellsPerColumn - 1 && col < cellsPerRow - 1 ? cells[getIdx(row + 1, col + 1)] : null;
    const b = row < cellsPerColumn - 1 ? cells[getIdx(row + 1, col)] : null;
    const bl = row < cellsPerColumn - 1 && col > 0 ? cells[getIdx(row + 1, col - 1)] : null;
    const l = col > 0 ? cells[getIdx(row, col - 1)] : null;
    cell.setNeighbors(tl, t, tr, r, br, b, bl, l);
  });
}

function showStats() {
  let rCount = 0;
  let pCount = 0;
  let sCount = 0;

  cells.forEach(cell => {
    if (cell.state === 'R') rCount++;
    else if (cell.state === 'P') pCount++;
    else if (cell.state === 'S') sCount++;
  });

  const total = cells.length;

  const rRatio = ((rCount / total) * 100).toFixed(3);
  const pRatio = ((pCount / total) * 100).toFixed(3);
  const sRatio = ((sCount / total) * 100).toFixed(3);

  const table = INITIAL_H - 15;

  push();
  noStroke();
  fill('#B7A3E3');
  rect(0, INITIAL_H - 40, (INITIAL_W / 3) * 3, 50);
  fill('#FFF1CB');
  rect(0, INITIAL_H - 40, (INITIAL_W / 3) * 2, 50);
  fill('#FF8F8F');
  rect(0, INITIAL_H - 40, INITIAL_W / 3, 50);
  pop();

  push();
  fill(0);
  textAlign(CENTER);
  textSize(18);
  text(`R: ${rRatio}%`, (INITIAL_W / 3) * 0.5, table);
  text(`P: ${pRatio}%`, (INITIAL_W / 3) * 1.5, table);
  text(`S: ${sRatio}%`, (INITIAL_W / 3) * 2.5, table);
  pop();
}

function draw() {
  background(250);

  cells.forEach(cell => cell.computeNextState());

  if (millis() - lastTime > interval) {
    cells.forEach(aCell => {
      aCell.updateState();
    });
    lastTime = millis();
  }

  cells.forEach(cell => cell.render());

  showStats();
}
