const palette = ["#696FC7", "#A7AAE1", "#F5D3C4", "#F2AEBB"]; //let은 변수, const는 내가 정한 값 고정
let x, y;
let w, h;
let colour;
let angle;
const area = 20;

function setup() {
  createCanvas(500, 400);
}

function drawRect() {
  fill(colour);
  noStroke();
  push();
  translate(x, y); //원점 이동
  rotate(radians(angle)); //컴퓨터는 일반적인 자연어 수학 체계와 다르게 시계 방향으로 각도가 커짐
  rect(-0.5 * w, -0.5 * h, w, h); //x위치, y위치, 가로값, 세로값이 필요함 //마우스가 직사각형 중간에 가게 하려면 가로값과 세로값의 절반 값이 x값과 y값이 되야함.
  pop();
}

function draw() {
  randomSeed(0);
  background(127);
  for (let n = 0; n < 100; n++) {
    // fill("red");
    x = random(width); //캔버스 너비를 넘지 않게 랜덤위치 지정
    y = random(height);
    w = random(4, area); //너비는 10픽셀, 최대 캔버스 너비의 절반
    h = area / w;
    angle = random(360);
    let paletteIdx = floor(random(palette.length)); //floor는 소수점 버림
    colour = palette[paletteIdx];
    drawRect();
  }
}
