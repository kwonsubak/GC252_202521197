class Animal {
  constructor(
    x,
    y,
    distConstraint,
    angleConstraint,
    thickness = [30, 20],
    options
  ) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = options?.r || 25;
    this.maxSpeed = options?.maxSpeed || 5;
    this.maxForce = options?.maxForce || 0.05;
    this.spine = [];
    this.head = null;
    this.tail = null;
    push();
    colorMode(HSB, 360, 100, 100);
    for (let idx = 0; idx < thickness.length; idx++) {
      const posX = x;
      const posY = y + distConstraint * idx;
      const hue = map(idx, 0, thickness.length - 1, 0, 240);
      const colour = color(hue, 100, 100);
      const options = {
        colour: colour,
        distConstraint: distConstraint,
        angleConstraint: angleConstraint,
      };
      const newPoint = new Point(posX, posY, thickness[idx], options);
      if (idx === 0) {
        this.head = newPoint;
      }
      this.spine.push(newPoint);
    }
    pop();
    this.tail = this.spine[this.spine.length - 1];
    this.headPoints = [];
    this.cwPoints = []; //머리 기준 오른편 점들
    this.tailPoints = [];
    this.ccwPoints = []; //머리 기준 왼편 점들
    this.bodyPoints = []; //정렬
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

  setHeadPos(pos) {
    this.head.setPos(pos);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    if (this.vel.mag() > 0.01) {
      this.head.setHeading(this.vel.heading());
    }
    this.spine.forEach((aPoint, idx) => {
      if (idx > 0) {
        aPoint.constrainedBy(this.spine[idx - 1], false);
      }
    });
    // this.head.setHeading(this.spine[1].heading);

    // constraint
    this.spine.forEach((aPoint, idx) => {
      if (idx >= 2) {
        aPoint.angleConstrainedBy(this.spine[idx - 1], this.spine[idx - 2]);
      }
    });

    this.spine.forEach((aPoint, idx) => {
      this.cwPoints[idx] = aPoint.getPointOnThickness(radians(90));
      //9~1번째까지
      this.ccwPoints[this.spine.length - 1 - idx] = aPoint.getPointOnThickness(
        radians(-90)
      );
    });

    this.headPoints[0] = this.head.getPointOnThickness(radians(-60));
    this.headPoints[1] = this.head.getPointOnThickness(radians(-30));
    this.headPoints[2] = this.head.getPointOnThickness(radians(0));
    this.headPoints[3] = this.head.getPointOnThickness(radians(30));
    this.headPoints[4] = this.head.getPointOnThickness(radians(60));

    this.tailPoints[0] = this.tail.getPointOnThickness(radians(120));
    this.tailPoints[1] = this.tail.getPointOnThickness(radians(150));
    this.tailPoints[2] = this.tail.getPointOnThickness(radians(180));
    this.tailPoints[3] = this.tail.getPointOnThickness(radians(-150));
    this.tailPoints[4] = this.tail.getPointOnThickness(radians(-120));

    //bodyPoints에 모든 윤곽 점을 순서대로 넣어서 한번에 연결
    let bodyPointsIdx = 0;
    const headCenterIdx = Math.floor(0.5 * this.headPoints.length);
    //0번째 머리부터 복사하고 머리 오른쪽 점을 bodyPoints에 넣어 윤곽 자연스럽게 닫음
    for (
      let idx = headCenterIdx - 1;
      idx <= this.headPoints.length - 1;
      idx++
    ) {
      this.bodyPoints[bodyPointsIdx] = this.headPoints[idx];
      bodyPointsIdx++;
    }
    this.cwPoints.forEach((p) => {
      this.bodyPoints[bodyPointsIdx] = p;
      bodyPointsIdx++;
    });
    this.tailPoints.forEach((p) => {
      this.bodyPoints[bodyPointsIdx] = p;
      bodyPointsIdx++;
    });
    this.ccwPoints.forEach((p) => {
      this.bodyPoints[bodyPointsIdx] = p;
      bodyPointsIdx++;
    });
    //0번째 머리부터 복사하고 머리 왼쪽 점을 bodyPoints에 넣어 윤곽 자연스럽게 닫음
    for (let idx = 0; idx <= headCenterIdx + 1; idx++) {
      this.bodyPoints[bodyPointsIdx] = this.headPoints[idx];
      bodyPointsIdx++;
    }
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

  evade(pursuers, prediction = 30) {
    const closest = this.findClosestPursuer(pursuers);
    if (!closest) return;
    const predictedVel = p5.Vector.mult(closest.vel, prediction);
    const futurePos = p5.Vector.add(closest.pos, predictedVel);
    this.flee(futurePos);
  }

  wrapCoordinates() {
    if (this.pos.x > width || this.pos.x < 0) {
      //속도 반전
      this.vel.x *= -1;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      this.vel.y *= -1;
    }

    //화면 밖으로 못나가도록 고정 constrain(변수, min, max)
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  showSpine() {
    this.spine.forEach((aPoint) => {
      aPoint.show();
    });
  }

  showDistConstraint() {
    this.spine.forEach((aPoint) => {
      aPoint.showDistConstraint();
    });
  }

  showThickness() {
    this.spine.forEach((aPoint) => {
      aPoint.showThickness();
    });
  }

  showPtOnThicknessCW() {
    this.cwPoints.forEach((point) => {
      push();
      translate(point.x, point.y);
      noStroke();
      fill("#F00");
      circle(0, 0, 8);
      pop();
    });
  }

  showPtOnThicknessCCW() {
    this.ccwPoints.forEach((point) => {
      push();
      translate(point.x, point.y);
      noStroke();
      fill("#00F");
      circle(0, 0, 8);
      pop();
    });
  }

  showBodyShape() {
    push();
    noStroke();
    fill("darkblue");
    beginShape();
    this.bodyPoints.forEach((p) => {
      curveVertex(p.x, p.y);
    });
    endShape();
    pop();
  }

  showEyes() {
    const right = this.head.getPointOnThickness(radians(90), 0, 0.5);
    const left = this.head.getPointOnThickness(radians(-90), 0, 0.5);
    push();
    translate(right.x, right.y);
    rotate(this.head.heading);
    noStroke();
    fill("#000");
    circle(0, 0, 5);
    pop();
    push();
    translate(left.x, left.y);
    rotate(this.head.heading);
    noStroke();
    fill("#000");
    circle(0, 0, 5);
    pop();
  }
}
