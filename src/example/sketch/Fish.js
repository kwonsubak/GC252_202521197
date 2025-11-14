class Fish {
  constructor(origin, options = {}) {
    this.bodyColor = options.bodyColor || color(58, 124, 165);
    this.finColor = options.finColor || color(129, 195, 215);

    // Width of the fish at each vertebra
    this.bodyWidth = [68, 81, 84, 83, 77, 64, 51, 38, 32, 19];

    // 물리/AI
    this.pos = origin.copy();
    this.vel = p5.Vector.random2D().mult(random(1, 2.5));
    this.acc = createVector(0, 0);

    this.maxSpeed = options.maxSpeed || 4;
    this.maxForce = options.maxForce || 0.1;
    this.senseRadius = options.senseRadius || 300;

    this.spine = new Chain(this.pos.copy(), 12, 64, PI / 8);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  flee(target) {
    const desired = p5.Vector.sub(this.pos, target);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  // pursuer의 미래 위치를 예측해서 회피
  evade(pursuer, predictionFactor = 1.0) {
    const future = p5.Vector.add(
      pursuer.pos,
      p5.Vector.mult(pursuer.vel, 20 * predictionFactor)
    );
    this.flee(future);
  }

  update() {
  // 속도 업데이트
  this.vel.add(this.acc);
  this.vel.limit(this.maxSpeed);
  this.pos.add(this.vel);
  this.acc.mult(0);

  // 체인과 머리 위치를 연결
  this.spine.joints[0] = this.pos.copy();

  // 체인 물리 업데이트
  this.spine.resolve(this.spine.joints[0]);
}


  wrap() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  getPosX(i, angleOffset, lengthOffset) {
    return (
      this.spine.joints[i].x +
      cos(this.spine.angles[i] + angleOffset) *
        (this.bodyWidth[i] + lengthOffset)
    );
  }

  getPosY(i, angleOffset, lengthOffset) {
    return (
      this.spine.joints[i].y +
      sin(this.spine.angles[i] + angleOffset) *
        (this.bodyWidth[i] + lengthOffset)
    );
  }

  display() {
    strokeWeight(4);
    stroke(255);
    fill(this.finColor);

    const j = this.spine.joints;
    const a = this.spine.angles;

    const headToMid1 = relativeAngleDiff(a[0], a[6]);
    const headToMid2 = relativeAngleDiff(a[0], a[7]);
    const headToTail = headToMid1 + relativeAngleDiff(a[6], a[11]);

    // === PECTORAL FINS ===
    push();
    translate(this.getPosX(3, PI / 3, 0), this.getPosY(3, PI / 3, 0));
    rotate(a[2] - PI / 4);
    ellipse(0, 0, 160, 64);
    pop();

    push();
    translate(this.getPosX(3, -PI / 3, 0), this.getPosY(3, -PI / 3, 0));
    rotate(a[2] + PI / 4);
    ellipse(0, 0, 160, 64);
    pop();

    // === VENTRAL FINS ===
    push();
    translate(this.getPosX(7, PI / 2, 0), this.getPosY(7, PI / 2, 0));
    rotate(a[6] - PI / 4);
    ellipse(0, 0, 96, 32);
    pop();

    push();
    translate(this.getPosX(7, -PI / 2, 0), this.getPosY(7, -PI / 2, 0));
    rotate(a[6] + PI / 4);
    ellipse(0, 0, 96, 32);
    pop();

    // === CAUDAL FIN ===
    beginShape();
    for (let i = 8; i < 12; i++) {
      const tailWidth = 1.5 * headToTail * (i - 8) * (i - 8);
      curveVertex(
        j[i].x + cos(a[i] - PI / 2) * tailWidth,
        j[i].y + sin(a[i] - PI / 2) * tailWidth
      );
    }

    for (let i = 11; i >= 8; i--) {
      const tailWidth = constrain(headToTail * 6, -13, 13);
      curveVertex(
        j[i].x + cos(a[i] + PI / 2) * tailWidth,
        j[i].y + sin(a[i] + PI / 2) * tailWidth
      );
    }
    endShape(CLOSE);

    // === BODY ===
    fill(this.bodyColor);
    beginShape();

    for (let i = 0; i < 10; i++) {
      curveVertex(
        this.getPosX(i, PI / 2, 0),
        this.getPosY(i, PI / 2, 0)
      );
    }

    curveVertex(this.getPosX(9, PI, 0), this.getPosY(9, PI, 0));

    for (let i = 9; i >= 0; i--) {
      curveVertex(
        this.getPosX(i, -PI / 2, 0),
        this.getPosY(i, -PI / 2, 0)
      );
    }

    curveVertex(this.getPosX(0, -PI / 6, 0), this.getPosY(0, -PI / 6, 0));
    curveVertex(this.getPosX(0, 0, 4), this.getPosY(0, 0, 4));
    curveVertex(this.getPosX(0, PI / 6, 0), this.getPosY(0, PI / 6, 0));

    curveVertex(this.getPosX(0, PI / 2, 0), this.getPosY(0, PI / 2, 0));
    curveVertex(this.getPosX(1, PI / 2, 0), this.getPosY(1, PI / 2, 0));
    curveVertex(this.getPosX(2, PI / 2, 0), this.getPosY(2, PI / 2, 0));

    endShape(CLOSE);

    // === DORSAL FIN ===
    fill(this.finColor);
    beginShape();
    vertex(j[4].x, j[4].y);
    bezierVertex(j[5].x, j[5].y, j[6].x, j[6].y, j[7].x, j[7].y);
    bezierVertex(
      j[6].x + cos(a[6] + PI / 2) * headToMid2 * 16,
      j[6].y + sin(a[6] + PI / 2) * headToMid2 * 16,
      j[5].x + cos(a[5] + PI / 2) * headToMid1 * 16,
      j[5].y + sin(a[5] + PI / 2) * headToMid1 * 16,
      j[4].x,
      j[4].y
    );
    endShape();

    // === EYES ===
    fill(255);
    ellipse(
      this.getPosX(0, PI / 2, -18),
      this.getPosY(0, PI / 2, -18),
      24,
      24
    );
    ellipse(
      this.getPosX(0, -PI / 2, -18),
      this.getPosY(0, -PI / 2, -18),
      24,
      24
    );
  }
}