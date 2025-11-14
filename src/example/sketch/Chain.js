class Chain {
  constructor(origin, jointCount, linkSize, angleConstraint) {
    if (angleConstraint === undefined) angleConstraint = TWO_PI;

    this.linkSize = linkSize;
    this.angleConstraint = angleConstraint;

    this.joints = []; // p5.Vector[]
    this.angles = []; // float[]

    this.joints.push(origin.copy());
    this.angles.push(0);

    for (let i = 1; i < jointCount; i++) {
      const prev = this.joints[i - 1];
      const next = createVector(prev.x, prev.y + this.linkSize);
      this.joints.push(next);
      this.angles.push(0);
    }
  }

  resolve(pos) {
    this.angles[0] = p5.Vector.sub(pos, this.joints[0]).heading();
    this.joints[0] = pos.copy();

    for (let i = 1; i < this.joints.length; i++) {
      const curAngle = p5.Vector.sub(this.joints[i - 1], this.joints[i]).heading();
      this.angles[i] = constrainAngleJS(curAngle, this.angles[i - 1], this.angleConstraint);

      const offset = p5.Vector.fromAngle(this.angles[i]).setMag(this.linkSize);
      this.joints[i] = p5.Vector.sub(this.joints[i - 1], offset);
    }
  }

  fabrikResolve(pos, anchor) {
    this.joints[0] = pos.copy();
    for (let i = 1; i < this.joints.length; i++) {
      this.joints[i] = constrainDistanceJS(this.joints[i], this.joints[i - 1], this.linkSize);
    }

    this.joints[this.joints.length - 1] = anchor.copy();
    for (let i = this.joints.length - 2; i >= 0; i--) {
      this.joints[i] = constrainDistanceJS(this.joints[i], this.joints[i + 1], this.linkSize);
    }
  }

  display() {
    strokeWeight(8);
    stroke(255);
    for (let i = 0; i < this.joints.length - 1; i++) {
      const s = this.joints[i];
      const e = this.joints[i + 1];
      line(s.x, s.y, e.x, e.y);
    }

    fill(42, 44, 53);
    noStroke();
    for (let j of this.joints) {
      circle(j.x, j.y, 32);
    }
  }
}
