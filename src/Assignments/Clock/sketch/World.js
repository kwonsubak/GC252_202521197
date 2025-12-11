class World {
  constructor() {
    this.currentTime = 0;
    this.angle = 0;
  }

  update() {
    let s = second();
    let m = minute();
    let h = hour();
    this.currentTime = h + m / 60 + s / 3600;
    // 시간->각도 변환
    this.angle = map(this.currentTime, 0, 24, 0, 360);
  }

  timeText() {
    push();
    fill(0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("12", width / 2, height / 2 + 130);
    pop();
  }

  morning() {
    let cx = width / 2;
    let cy = height / 2;
    let r = (width * 1.5) / 2;

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
    circle(cx, cy + 600, width * 1.8);
    pop();

    //태양
    push();
    fill("#FFF2C6");
    noStroke();
    circle(cx - 150, cy - 200, 70);
    pop();

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);

    for (let i = 1; i <= 12; i++) {
      let textX = cx + cos(this.angle) * r;
      let textY = cy + sin(this.angle) * r;

      text(i, textX, textY);
    }
  }

  night() {
    let cx = width / 2;
    let cy = height / 2;
    let r = (width * 1.5) / 2;

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
  }

  render() {
    console.log(this.currentTime);

    if (this.currentTime >= 7 || this.currentTime < 18) {
      this.morning();
    } else {
      this.night();
    }
  }
}
