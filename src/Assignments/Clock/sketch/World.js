class World {
  constructor() {
    this.currentTime = 0;
    this.angle = 0;
    this.skyColour = null;
    this.GroundColour = null;

    this.morningColour = color("#b6e1f6");
    this.nightColour = color("#5d5da0");
    this.eveningColour = color("#f5b97d");
    this.dawnColour = color("#dfa1d4");

    this.morningGroundColour = color("#a4dda4");
    this.nightGroundColour = color("#a4dda4");
    this.morningGroundColour2 = color("#87c983");
    this.nightGroundColour2 = color("#87c983");
    this.morningGroundColour3 = color("#558e72");
    this.nightGroundColour3 = color("#558e72");

    this.change = 0;
  }

  update() {
    this.second = second();
    this.minute = minute();
    this.hour = hour();

    this.currentMinute = this.second / 60;
    this.currentHour = this.second / 3600;

    // 시간->각도 변환
    this.secondAngle = map(this.second, 0, 60, 60, 360);
    this.minuteAngle = map(this.currentMinute, 0, 60, 0, 360);
    this.hourAngle = map(this.currentHour, 0, 24, 0, -360);

    if (this.currentHour >= 0 && this.currentHour < 24) {
      this.change = map(this.currentHour, 0, 24, 0, 1);
    } else {
      this.change = map(this.currentHour + 24, 0, 24, 0, 1);
    }
  }

  ground() {
    //땅3
    push();
    this.GroundColour = lerpColor(
      this.morningGroundColour3,
      this.nightGroundColour3,
      this.change
    );
    fill(this.GroundColour);
    noStroke();
    circle(width / 2, height / 2 + 460, width * 1.8);
    pop();

    //땅2
    push();
    this.GroundColour = lerpColor(
      this.morningGroundColour2,
      this.nightGroundColour2,
      this.change
    );
    fill(this.GroundColour);
    noStroke();
    circle(width / 2, height / 2 + 580, width * 1.8);
    pop();

    //땅1
    push();
    this.GroundColour = lerpColor(
      this.morningGroundColour,
      this.nightGroundColour,
      this.change
    );
    fill(this.GroundColour);
    noStroke();
    circle(width / 2, height / 2 + 700, width * 1.8);
    pop();
  }

  secondArea() {
    push();
    translate(width / 2, height / 2 + 700);
    rotate(this.secondAngle - 90);

    let groundR = (width * 1.8) / 2;
    let lineR = groundR - 50;

    for (let i = 0; i <= 60; i++) {
      push();
      let rotationAngle = i * 6;
      rotate(radians(rotationAngle));
      translate(0, -lineR);
      stroke("#F8F4EC");
      strokeWeight(2);
      line(0, 0, 0, -10);
      pop();
    }
    pop();
  }

  minuteArea() {
    push();
    translate(width / 2, height / 2 + 600);
    rotate(radians(this.minuteAngle));

    let groundR = (width * 1.9) / 2;
    let lineR = groundR - 50;

    fill("#F8F4EC");
    textAlign(CENTER, CENTER);
    textSize(50);
    for (let i = 0; i <= 60; i++) {
      push();
      let rotationAngle = i * 6;
      rotate(radians(rotationAngle));
      translate(0, -lineR);
      stroke("#F8F4EC");
      strokeWeight(10);
      line(0, 0, 0, -10);
      pop();
    }
    pop();
  }

  hourArea() {
    push();
    translate(width / 2, height / 2 + 450);
    rotate(this.hourAngle);

    let groundR = (width * 1.8) / 2;
    let textR = groundR - 50;

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

      push();
      rotate(radians(rotationAngle));
      translate(0, -textR);
      stroke("#F8F4EC");
      strokeWeight(10);
      line(120, 0, 120, 0);
      pop();
    }
    pop();
  }

  dawn() {
    push();
    this.skyColour = lerpColor(
      this.dawnColour,
      this.morningColour,
      this.change
    );
    fill(this.skyColour);
    rect(0, 0, width, height);
    pop();
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
  }

  evening() {
    push();
    this.skyColour = lerpColor(
      this.eveningColour,
      this.nightColour,
      this.change
    );
    fill(this.skyColour);
    rect(0, 0, width, height);
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
  }

  render() {
    this.update();

    if (this.hour >= 4 && this.hour < 7) {
      this.dawn();
    } else if (this.hour >= 7 && this.hour < 17) {
      this.morning();
    } else if (this.hour >= 17 && this.hour < 19) {
      this.evening();
    } else {
      this.night();
    }

    this.ground();
    this.secondArea();
    this.minuteArea();
    this.hourArea();
  }
}
