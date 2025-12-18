const sketchContainer = document.querySelector(".sketch-container");

let animal;
let world;

const imgs = [];
function preload() {
  for (let i = 0; i < 2; i++) {
    imgs.push(loadImage(`./assets/${i}.svg`));
  }
}

function setup() {
  createCanvas(600, 800);
  animal = new Animal();
  world = new World();
}

function draw() {
  world.render();
  animal.render();

  image(imgs[0], width / 2 - 80, height / 2 - 280);
  image(imgs[1], width / 2 - 75, height / 2 - 230);
}
