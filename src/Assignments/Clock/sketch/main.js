const sketchContainer = document.querySelector(".sketch-container");

let cat;
let world;

function setup() {
  createCanvas(600, 600);
  cat = new Cat();
  world = new World();
}

function draw() {
  world.render();
  cat.render();
}
