class Cat {
  constructor(x, y) {
    this.x = width;
    this.y = height + 50;
    this.color = color("white");
    this.size = 0.5;
  }

  render() {
    push();
    scale(this.size);

    //앞다리 뒤쪽
    push();
    stroke("#E3E3E3");
    strokeWeight(30);
    line(this.x + 50, this.y, this.x + 50, this.y + 100);

    //뒷다리 뒤쪽
    line(this.x - 70, this.y, this.x - 70, this.y + 100);
    circle(this.x - 75, this.y + 20, 45);
    pop();

    // 몸
    fill("white");
    noStroke();
    ellipse(this.x, this.y, 200, 100);

    // 머리
    circle(this.x + 100, this.y - 20, 100);

    // 귀
    triangle(
      this.x + 50,
      this.y - 100,
      this.x + 50,
      this.y - 20,
      this.x + 150,
      this.y - 20
    );
    triangle(
      this.x + 50 * 3,
      this.y - 100,
      this.x + 50,
      this.y - 20,
      this.x + 150,
      this.y - 20
    );

    // 뒷다리
    stroke("white");
    strokeWeight(30);
    line(this.x - 90, this.y, this.x - 90, this.y + 100);
    circle(this.x - 75, this.y + 20, 45);

    // 앞다리
    line(this.x + 70, this.y, this.x + 70, this.y + 100);

    //꼬리
    strokeWeight(20);
    line(this.x - 90, this.y - 20, this.x - 200, this.y - 100);
    pop();
  }
}
