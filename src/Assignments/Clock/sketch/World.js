class World {
  constructor() {
    this.currentTime = 0;
    this.angle = 0;
    this.skyColour = null;
    this.GroundColour = null;
    this.morningColour = color("#C2E2FA");
    this.nightColour = color("#1A2A4F");
    this.morningGroundColour = color("#A1BC98");
    this.nightGroundColour = color("#427A76");
    this.change = 0;
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

    if (this.currentTime >= 6 && this.currentTime < 18) {
      this.change = map(this.currentTime, 6, 24, 0, 1);
    } else {
      this.change = map(this.currentTime + 24, 18, 30, 0, 1);
    }
  }

  morning() {
    //하늘
    push();
    this.skyColour = lerpColor(
      this.morningColour,
      this.nightColour,
      this.change
    );
    fill(this.skyColour);
    rect(0, 0, width, height);
    pop();

    //땅
    push();
    this.GroundColour = lerpColor(
      this.morningGroundColour,
      this.nightGroundColour,
      this.change
    );
    fill(this.GroundColour);
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
    this.skyColour = lerpColor(
      this.nightColour,
      this.morningColour,
      this.change
    );
    fill(this.skyColour);
    rect(0, 0, width, height);
    pop();

    //땅
    push();
    this.GroundColour = lerpColor(
      this.nightGroundColour,
      this.morningGroundColour,
      this.change
    );
    fill(this.GroundColour);
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

  score() {
    let groundR = (width * 1.9) / 2;
    let textR = groundR - 50;

    push();
    translate(width / 2, height / 2 + 600);

    rotate(this.angle);

    fill("#F8F4EC");

    for (let i = 1; i <= 12; i++) {
      push();
      let rotationAngle = i * 30;
      rotate(radians(rotationAngle));
      translate(0, groundR);
      noStroke();
      circle(i, 0, 30);
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
    this.score();
  }
}
