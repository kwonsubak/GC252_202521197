const {
  Engine,
  Runner,
  Composites,
  MouseConstraint,
  Mouse,
  Composite,
  Bodies,
} = Matter;

// add bodies
let stack;
let walls;

// add mouse control
// var mouse = Mouse.create(render.canvas),
//   mouseConstraint = MouseConstraint.create(engine, {
//     mouse: mouse,
//     constraint: {
//       stiffness: 0.2,
//       render: {
//         visible: false,
//       },
//     },
//   });

// Composite.add(world, mouseConstraint);

//
const canvasContainer = document.getElementById("canvas-container");

function setup() {
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
    //top
    Bodies.rectangle(0.5 * width, 0, width, 50, { isStatic: true }),
    //bottom
    Bodies.rectangle(0.5 * width, height, width, 50, { isStatic: true }),
    //right
    Bodies.rectangle(width, 0.5 * height, 50, height, { isStatic: true }),
    //left
    Bodies.rectangle(0, 0.5 * height, 50, height, { isStatic: true }),
  ];
  Composite.add(world, walls);

  //elt는 html을 반환해줌.(p5.js 문법), 마우스를 캔버스 위에서 작동하는 것으로 한정
  const mouse = Mouse.create(renderer.elt);
  mouse.pixelRatio = pixelDensity();
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2 },
  });
  Composite.add(world, mouseConstraint);

  // create runner
  const runner = Runner.create();
  Runner.run(runner, engine);
}

function draw() {
  background(0);
  noStroke();
  fill("red");
  circle(width / 2, height / 2, 100);
  noFill();
  stroke("white");
  stack.bodies.forEach((aBody) => {
    beginShape();
    aBody.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y); //변수 이름 충돌 방지를 위해 aVertex 사용
    });
    endShape(CLOSE);
  });
  //walls의 구성요소는 모두 Body이므로 bodies를 사용할 필요 없음.
  walls.forEach((aBody) => {
    beginShape();
    aBody.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y);
    });
    endShape(CLOSE);
  });
}
