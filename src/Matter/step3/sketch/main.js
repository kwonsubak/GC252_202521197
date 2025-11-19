const element = document.querySelector("#matter-box");
const width = 800;
const height = 600;

var {
  Engine,
  Render,
  Runner,
  Composite,
  Composites,
  Common,
  MouseConstraint,
  Mouse,
  Bodies,
} = Matter;

// create engine
const engine = Engine.create(),
  world = engine.world;

// create renderer
const render = Render.create({
  element,
  engine: engine,
  options: {
    width,
    height,
    showAngleIndicator: true,
  },
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
Composite.add(world, [
  Bodies.rectangle(width * 0.5, height, width * 2, 50.5, {
    isStatic: true,
    render: { fillStyle: "#060a19" },
  }),
]);

var stack = Composites.stack(100, 0, 10, 8, 10, 10, function (x, y) {
  return Bodies.circle(x, y, Common.random(15, 30), {
    restitution: 0.6,
    friction: 0.1,
  });
});

Composite.add(world, [
  stack,
  Bodies.polygon(200, 460, 3, 60),
  Bodies.polygon(400, 460, 5, 60),
  Bodies.rectangle(600, 460, 80, 80),
]);

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// wrapping using matter-wrap plugin
var allBodies = Composite.allBodies(world);

for (var i = 0; i < allBodies.length; i += 1) {
  allBodies[i].plugin.wrap = {
    min: { x: render.bounds.min.x - 100, y: render.bounds.min.y },
    max: { x: render.bounds.max.x + 100, y: render.bounds.max.y },
  };
}
