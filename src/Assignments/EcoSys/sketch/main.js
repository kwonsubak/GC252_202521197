let animal;
let mouse;
let pursuers = [];
let evaders = [];
const numPursuers = 2;
const seed = 0;
const showFlags = [
  false,
  false,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
];

function setup() {
  createCanvas(800, 600);

    randomSeed(seed);

  for (let n = 0; n < numPursuers; n++) {
    pursuers.push(new Pursuer(random(width), random(height)));
  }
  
  let thickness = [30, 45, 50, 55, 55, 50, 40, 35, 30, 20, 15];
  let aScale = 0.5;
  let smallThickness = thickness.map(t => t * aScale);

  animal = new Animal(
    width / 2,
    height / 4,
    20 * aScale,
    [radians(170), radians(190)],
    thickness.map(t => t * aScale)
  );

  evaders.push(animal);

  mouse = createVector(width / 2, height / 4);
}

function draw() {
  background("skyblue");

  for (const pursuer of pursuers) {
    pursuer.pursue(evaders);
    pursuer.update();
    pursuer.separate(pursuers);
    pursuer.wrapCoordinates();
    pursuer.show();
  }

  if (mouseIsPressed) {
    mouse.set(mouseX, mouseY);
  }

  animal.evade(pursuers);
  animal.wrapCoordinates();
  animal.update();
  animal.setHeadPos(animal.pos);


  if (showFlags[4]) {
    animal.showBodyShape();
    animal.showEyes();
  }
}

function keyPressed() {
  const num = parseInt(key);
  if (!isNaN(num)) {
    showFlags[num] = !showFlags[num]; //T->F or F->T
  }
}
