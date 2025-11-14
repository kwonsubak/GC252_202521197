class Evader {
  constructor(x, y, options) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = options?.r || 25;
    this.colour = options?.colour || "#00FF00";
    this.maxSpeed = options?.maxSpeed || 5;
    this.maxForce = options?.maxForce || 0.05;
    this.senseRadius = options?.senseRadius || 400;
  }

  findClosestPursuer(pursuers) {
    let closest = null;
    let minDist = Infinity;
    for (const p of pursuers) {
      const d = this.pos.dist(p.pos);
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
      if (d < this.senseRadius && d < minDist) {
        minDist = d;
        closest = p;
      }
    }
    return closest;
  }

  separate(pursuers) {
    for (const p of pursuers) {
      if (p !== this) {
        const d = this.pos.dist(p.pos);
        const sum = createVector(0, 0);
        if (d > 0 && d < this.r * 2) {
          const towardMe = p5.Vector.sub(this.pos, p.pos);
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

  seek(target) {
    const desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    const steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  flee(target) {
    const avoided = p5.Vector.sub(target, this.pos);
    avoided.setMag(this.maxSpeed * -1);
    const steering = p5.Vector.sub(avoided, this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
  }

  evade(pursuers, prediction = 100) {
    const closest = this.findClosestPursuer(pursuers);
    if (!closest) return;

    const d = this.pos.dist(closest.pos);

    if (d < this.senseRadius) {
      const predictedVel = p5.Vector.mult(closest.vel, prediction);
      const futurePos = p5.Vector.add(closest.pos, predictedVel);
      this.flee(futurePos);
    }
  }

  wrapCoordinates() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    const angle = this.vel.heading();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    //꼬리 흔들림
    let wave = sin(frameCount * 0.4 + this.pos.x * 0.05) * 8;

    noStroke();

    //몸통
    fill(255, 170, 80);
    ellipse(0, 0, 45, 25);

    //꼬리
    push();
    translate(-25, 0);
    rotate(wave * 0.1);

    beginShape();
    vertex(0, 0);
    vertex(-18, -12 + wave);
    vertex(-18, 12 - wave);
    endShape(CLOSE);
    pop();

    //지느러미
    fill(240, 130, 70);
    triangle(5, -10, -5, -20, -10, -10);

    //눈
    fill(0);
    circle(10, -5, 5);

    pop();
  }
}
