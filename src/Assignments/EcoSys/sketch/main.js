const {
  Engine,
  Runner,
  Composites,
  MouseConstraint,
  Mouse,
  Composite,
  Bodies,
} = Matter;

const evaders = [];
const numEvaders = 5;
const pursuers = [];
const numPursuers = 2;
const seed = 0;

// add bodies
let stack;
let walls;

//
const canvasContainer = document.getElementById("canvas-container");

function setup() {
  for (let n = 0; n < numEvaders; n++) {
    evaders.push(new Evader(random(width), random(height)));
  }
  for (let n = 0; n < numPursuers; n++) {
    pursuers.push(new Pursuer(random(width), random(height)));
  }

  const renderer = createCanvas(800, 600);
  renderer.parent(canvasContainer);
  // create engine
  const engine = Engine.create(),
    world = engine.world;

  stack = Composites.stack(20, 20, 10, 5, 0, 0, (x, y) => {
    if (random() < 0.8) {
      return Bodies.rectangle(x, y, random(25, 50), random(25, 50));
    } else {
      return Bodies.rectangle(x, y, random(80, 120), random(25, 30));
    }
  });

  Composite.add(world, stack);

  walls = [
    //bottom
    Bodies.rectangle(0.5 * width, height, width, 100, { isStatic: true }),
  ];
  Composite.add(world, walls);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);
}

function draw() {
  background("skyblue");
  for (const evader of evaders) {
    evader.update();
    evader.evade(pursuers);
    evader.separate(evaders);
    evader.wrapCoordinates();
    evader.show();
  }

  for (const pursuer of pursuers) {
    pursuer.update();
    pursuer.pursue(evaders);
    pursuer.separate(pursuers);
    pursuer.wrapCoordinates();
    pursuer.show();
    pursuer.showTarget();
  }
  noStroke();
  //walls의 구성요소는 모두 Body이므로 bodies를 사용할 필요 없음.
  fill("#cfa75e");
  walls.forEach((aBody) => {
    beginShape();
    aBody.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y);
    });
    endShape(CLOSE);
  });
}
