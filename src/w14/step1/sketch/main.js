const sketchContainer = document.querySelector(".sketch-container");

function setup() {
  const renderer = createCanvas(600, 600);
  renderer.parent(sketchContainer);

  strokeWidth = (0.5 * width) / (strokeNum - 1);
}

let strokeNum = 50;
let strokeWidth;
let seed = 200;

function draw() {
  randomSeed(seed);
  background(255);
  //선 두께
  strokeWeight(strokeWidth);
  stroke("#FFA239");
  drawPattern(strokeNum);
  stroke("#BCE4FF");
  drawPattern(strokeNum, [random(2 * strokeWidth), 0]);
}

function drawPattern(strokeNum = 2, begin = [0, 0], size = [width, height]) {
  if (strokeNum <= 1) return;
  const [bx, by] = begin;
  const [w, h] = size;
  for (let n = 0; n < strokeNum; n++) {
    // 세로로 선을 그릴 거니까 x1=x2, y1!=y2
    // 노멀라이징 0~1 사이 숫자로 모두 변환
    const t = n / (strokeNum - 1);
    const x1 = w * t + bx;
    const x2 = x1;
    const y1 = 0 + by;
    const y2 = h + by;
    line(x1, y1, x2, y2);
  }
}
