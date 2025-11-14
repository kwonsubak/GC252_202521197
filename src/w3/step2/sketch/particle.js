class Particle {
  pos;
  w;
  h;
  colour;
  angle;
  constructo(posX, posY, area, minSize = 4) {
    //area를 변수로 만들기 위해 cunstructor로 받아옴, minSize 기본값 설
    this.pos = createVector(posX, posY); //x,y좌표를 벡터로 묶음 //particle의 변수를 건드리기 위해서 this.사용, posX,posY는 내장된 함수
    this.w = random(minSize, area);
    this.h = area / this.w;
    this.angle = random(360);
    const paletteIdx = floor(random(palette.length)); //floor는 소수점 버림
    this.colour = palette[paletteIdx];
  }

  drawRect() {
    fill(this.colour);
    noStroke();
    push();
    translate(this.pos.x, this.pos.y); //필드로 지정해준 this.pos는 .x, .y붙여주기
    rotate(radians(this.angle)); //컴퓨터는 일반적인 자연어 수학 체계와 다르게 시계 방향으로 각도가 커짐
    rect(-0.5 * this.w, -0.5 * this.h, this.w, this.h); //x위치, y위치, 가로값, 세로값이 필요함 //마우스가 직사각형 중간에 가게 하려면 가로값과 세로값의 절반 값이 x값과 y값이 되야함.
    pop();
  }
}
