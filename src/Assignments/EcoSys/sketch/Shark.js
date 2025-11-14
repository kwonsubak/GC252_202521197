class Pursuer {
  constructor(x, y, options) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = options?.r || 25;
    this.colour = options?.colour || "#FF0000";
    this.maxSpeed = options?.maxSpeed || 5;
    this.maxForce = options?.maxForce || 0.05;
  }

  findClosestEvader(evaders) {
    let closest = null;
    let minDist = Infinity;
    for (const e of evaders) {
      const d = this.pos.dist(e.pos);
      if (d < minDist) {
        minDist = d;
        closest = e;
      }
    }
    return closest;
  }

  separate(evaders) {
    for (const e of evaders) {
      if (e !== this) {
        const d = this.pos.dist(e.pos);
        const sum = createVector(0, 0);
        if (d > 0 && d < this.r * 2) {
          const towardMe = p5.Vector.sub(this.pos, e.pos);
          towardMe.div(d);
          sum.add(towardMe);
        }
        if (sum.mag() > 0) {
          sum.setMag(this.maxSpeed);
          sum.add(this.pos);
          this.seek(sum);
        }
      }
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target, factor = 1) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering.mult(factor));
  }

  pursue(evaders, prediction = 30) {
    const closest = this.findClosestEvader(evaders);
    if (!closest) return;
    const predictedVel = p5.Vector.mult(closest.vel, prediction); //예측 이동속도
    const futurePos = p5.Vector.add(closest.pos, predictedVel); //현재 위치 + 예측 이동속도 = 미래위치
    this.seek(futurePos); //위에서 만든 seek을 기반으로 예측위치 추적
  }

  wrapCoordinates() {
   if (this.pos.x > width || this.pos.x < 0) {
    this.vel.x *= -1;       
  }
  if (this.pos.y > height || this.pos.y < 0) {
    this.vel.y *= -1;       
  }

  this.pos.x = constrain(this.pos.x, 0, width);
  this.pos.y = constrain(this.pos.y, 0, height);
  }

  show() {
  push();
  translate(this.pos.x, this.pos.y);

  // 속도 방향으로 회전
  if (this.vel.mag() > 0.01) {
    rotate(this.vel.heading());
  }

  noStroke();

  //몸통
  fill("darkred");
  ellipse(0, 0, 120, 45);

  //몸통 지느러미
  push();
  translate(0, 0);
  beginShape();
  vertex(10, -15);
  vertex(-20, -55);
  vertex(-40, -15);
  endShape(CLOSE);
  pop();

  //다리?
  push();
  translate(0, 0);
  beginShape();
  vertex(-80, 20);
  vertex(-80, 50);
    translate(70,0);
  vertex(-50, 10);
  endShape(CLOSE);
  pop();

  //꼬리 지느러미
  push();
  translate(-60, 0);
  beginShape();
  vertex(0, 0);
  vertex(-35, -15);
  vertex(-35, 15);
  endShape(CLOSE);
  pop();

  //눈
  fill(0);
  circle(35, -10, 8);

  pop();
}

  showTarget() {
    const closest = this.findClosestEvader(evaders);
    if (closest) {
      push();
      noFill();
      stroke(this.colour);
      line(this.pos.x, this.pos.y, closest.pos.x, closest.pos.y);
      pop();
    }
  }
}
