const sketchContainer = document.querySelector(".sketch-container");

let world;

const imgs = [];
function preload() {
  for (let i = 0; i <= 9; i++) {
    imgs.push(loadImage(`./assets/${i}.svg`));
  }
}

function setup() {
  createCanvas(600, 800);
  world = new World();
}

function draw() {
  world.render();

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

  if (world.hour >= 6 && world.hour < 19) {
    //sun
    push();
    image(imgs[9], mouseX - 50, mouseY - 100, 160, 160);
    pop();
  } else {
    //moon
    push();
    image(imgs[8], mouseX - 50, mouseY - 100, 160, 160);
    pop();
  }
}
