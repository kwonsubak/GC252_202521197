const sketchContainer = document.querySelector(".sketch-container");

let world;

let showStar = false;
let starTime = 0;
let starInterval = 1000;
let starX = 0;
let starY = 0;

let clouds = [];

const starArea = {
  x1: 0,
  y1: 0,
  x2: 500,
  y2: 300,
};

const imgs = [];

function preload() {
  for (let i = 0; i <= 11; i++) {
    imgs.push(loadImage(`./assets/${i}.svg`));
  }
}

function setup() {
  createCanvas(600, 800);
  world = new World();

  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: random(0, width),
      y: random(50, 250),
      speed: random(0.2, 0.6),
      size: random(150, 250),
    });
  }

  starTime = millis();
}

function draw() {
  world.render();

  if (world.hour >= 6 && world.hour < 19) {
    //sun
    push();
    clouds.forEach((cloud) => {
      cloud.x -= cloud.speed;

      if (cloud.x < -cloud.size) {
        cloud.x = width + cloud.size;
        cloud.y = random(50, 250);
      }
      image(imgs[10], cloud.x, cloud.y, cloud.size, cloud.size * 0.5);
      image(imgs[9], width / 2, height / 2 - 400, 160, 160);
    });
    pop();
  } else {
    //moon
    push();
    if (showStar) {
      image(imgs[11], starX, starY, 50, 50);
      image(imgs[11], starX2, starY2, 50, 50);
      image(imgs[11], starX3, starY3, 50, 50);
      image(imgs[11], starX4, starY4, 50, 50);
      image(imgs[11], starX5, starY5, 50, 50);
    }

    if (millis() - starTime > starInterval) {
      starTime = millis();
      starX = random(starArea.x1, starArea.x2);
      starY = random(starArea.y1, starArea.y2);
      starX2 = random(starArea.x1, starArea.x2);
      starY2 = random(starArea.y1, starArea.y2);
      starX3 = random(starArea.x1, starArea.x2);
      starY3 = random(starArea.y1, starArea.y2);
      starX4 = random(starArea.x1, starArea.x2);
      starY4 = random(starArea.y1, starArea.y2);
      starX5 = random(starArea.x1, starArea.x2);
      starY5 = random(starArea.y1, starArea.y2);

      showStar = !showStar;
    }
    image(imgs[8], width / 2, height / 2 - 450, 160, 160);
  }

  if (frameCount % 60 < 30) {
    image(imgs[0], width / 2 - 80, height / 2 - 260, 130, 130);
    image(imgs[2], width / 2 - 85, height / 2 - 230);
    image(imgs[4], width / 2 - 85, height / 2 - 115, 160, 160);
    image(imgs[7], width / 2 - 135, height / 2 - 75, 250, 250);
  } else if (frameCount % 120 < 60) {
    image(imgs[0], width / 2 - 80, height / 2 - 260, 130, 130);
    image(imgs[2], width / 2 - 85, height / 2 - 230);
    image(imgs[5], width / 2 - 85, height / 2 - 115, 160, 160);
    image(imgs[6], width / 2 - 135, height / 2 - 75, 250, 250);
  } else if (frameCount % 360 < 240) {
    image(imgs[1], width / 2 - 75, height / 2 - 260, 130, 130);
    image(imgs[3], width / 2 - 85, height / 2 - 230);
    image(imgs[4], width / 2 - 85, height / 2 - 115, 160, 160);
    image(imgs[6], width / 2 - 135, height / 2 - 75, 250, 250);
  } else {
    image(imgs[0], width / 2 - 80, height / 2 - 260, 130, 130);
    image(imgs[2], width / 2 - 85, height / 2 - 230);
    image(imgs[4], width / 2 - 85, height / 2 - 115, 160, 160);
    image(imgs[6], width / 2 - 135, height / 2 - 75, 250, 250);
  }
}
