class World {
  constructor() {
    this.currentTime = 0;
    this.angle = 0;
  }

  update() {
    let s = second();
    let m = minute();
    let h = hour();
    let fakeTime = (millis() / 1000) * (24 / 72);
    this.currentTime = fakeTime % 24;
    // this.currentTime = h + m / 60 + s / 3600;
    // 시간->각도 변환
    this.angle = map(this.currentTime, 0, 24, 0, radians(-360));
  }

  morning() {
    //하늘
    push();
    fill("#C2E2FA");
    noStroke();
    rect(0, 0, width, height);
    pop();

    //땅
    push();
    fill("#A1BC98");
    noStroke();
    circle(width / 2, height / 2 + 600, width * 1.8);
    pop();

    //태양
    push();
    fill("#FFF2C6");
    noStroke();
    circle(width / 2 - 150, height / 2 - 200, 70);
    pop();
  }

  night() {
    //하늘
    push();
    fill("#1A2A4F");
    noStroke();
    rect(0, 0, width, height);
    pop();

    //땅
    push();
    fill("#427A76");
    noStroke();
    circle(width / 2, height + 210, width * 1.5);
    pop();

    //달
    push();
    fill("#FFF2C6");
    noStroke();
    circle(width / 2 - 150, height / 2 - 200, 70);
    pop();
  }

  timeText() {
    let groundR = (width * 1.8) / 2;
    let textR = groundR - 50;

    push();
    translate(width / 2, height / 2 + 600);

    rotate(this.angle);

    fill("#F8F4EC");
    textAlign(CENTER, CENTER);
    textSize(50);

    for (let i = 1; i <= 12; i++) {
      push();
      let rotationAngle = i * 30;
      rotate(radians(rotationAngle));
      translate(0, -textR);
      text(i, 0, 0);
      pop();
    }
    pop();
  }

  render() {
    this.update();

    if (this.currentTime >= 6 && this.currentTime < 18) {
      this.morning();
    } else {
      this.night();
    }

    this.timeText();
  }
}
