const palette = ["#696FC7", "#A7AAE1", "#F5D3C4", "#F2AEBB"]; //let은 변수, const는 내가 정한 값 고정

let ps = [];

function setup() {
  createCanvas(500, 400);

  // ps = new Particle(random(width), random(height), 20);
  for (let n = 0; n < 2000; n++) {
    //반복구문
    ps.push(new Particle(0.5 * width, 0.5 * height, 30, random(1, 5), 20));
  }
}

function draw() {
  background(127);
  // for (let idx = 0; idx < ps.length; idx++) {
  //   const aParticle = ps[idx];
  //   aParticle.drawRect();

  // ps.drawRect();

  // for (const aParticle of ps) {
  // aParticle.drawRect();
  ps.forEach((aParticle, idx) => {
    aParticle.applyGravity(0.01);
    aParticle.update();
    aParticle.drawRect();
  });
  //화살표 함수}
}
