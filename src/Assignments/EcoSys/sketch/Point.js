class Point {
  constructor(x, y, thickness, options) {
    this.pos = createVector(x, y);
    this.r = options.r || 10;
    this.colour = options.colour || "#FFF";
    this.distConstraint = options.distConstraint || 50;
    this.heading = 0;
    this.thickness = thickness;
    //radians는 각각 최솟, 최댓 기본값
    this.angleConstraint = options.angleConstraint || [
      radians(150),
      radians(210),
    ];
  }

  setPos(pos) {
    this.pos.set(pos);
  }

  setHeading(heading) {
    this.heading = heading;
  }

  constrainedBy(other, isStrong = false) {
    const toMe = p5.Vector.sub(this.pos, other.pos);
    if (isStrong || toMe.mag() > other.distConstraint) {
      toMe.setMag(other.distConstraint);
      const newPos = p5.Vector.add(toMe, other.pos);
      this.pos.set(newPos);
      this.setHeading(toMe.mult(-1).heading());
    }
  }

  //***일정 각도 이상 꺾이면 오류가 발생할 수 있는 점의 위치를 적절히 옮겨줌(각도 보정)
  angleConstrainedBy(parent, grandParent) {
    const vecParentToMe = p5.Vector.sub(this.pos, parent.pos);
    const vecParentToGrandParent = p5.Vector.sub(grandParent.pos, parent.pos);
    //angleBetween은 내장함수. 점과 점 사이의 각도를 구해줌.
    let angle = p5.Vector.angleBetween(vecParentToMe, vecParentToGrandParent);
    angle = angle < 0 ? angle + 2 * Math.PI : angle;
    //객체구조 분해 할당(Array를 각각 분리해줄 수 있음)
    let [minAngle, maxAngle] = this.angleConstraint;
    //조정 (Math.atan2(y, x) 같은 함수는 -π ~ +π 범위의 라디안 값을 반환하기 때문에 π~2π 범위로 조정하는 과정이 필요)
    if (minAngle < 0) minAngle += 2 * Math.PI;
    if (maxAngle < 0) maxAngle += 2 * Math.PI;
    if (angle < minAngle || angle > maxAngle) {
      const rotAngle =
        //오류났던 지점
        angle < minAngle || maxAngle > angle ? -minAngle : -maxAngle;
      vecParentToGrandParent.rotate(rotAngle);
      const newPos = p5.Vector.add(vecParentToGrandParent, parent.pos);
      //newPos를 현재 위치에 환산
      this.pos.set(newPos);
      //방향 조정
      this.setHeading(vecParentToGrandParent.mult(-1).heading());
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    noStroke();
    fill(this.colour);
    beginShape();
    vertex(this.r, 0);
    vertex(0, this.r);
    vertex(-this.r, 0);
    vertex(0, -this.r);
    endShape(CLOSE);
    arc(0, 0, 2 * this.r, 2 * this.r, radians(90), radians(270));
    pop();
  }

  showDistConstraint() {
    push();
    translate(this.pos.x, this.pos.y);
    noFill();
    stroke(this.colour);
    circle(0, 0, 2 * this.distConstraint);
    pop();
  }

  showThickness() {
    push();
    translate(this.pos.x, this.pos.y);
    noFill();
    stroke("#FFF");
    circle(0, 0, this.thickness);
    pop();
  }

  //y=ax+b (a = offest, b = multiplier,)
  getPointOnThickness(angle, offset = 0, multiplier = 1) {
    const pointPos = p5.Vector.fromAngle(this.heading + angle);
    pointPos.setMag(multiplier * 0.5 * this.thickness + offset);
    pointPos.add(this.pos);
    return pointPos;
  }
}
