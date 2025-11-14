const elem = document.querySelector("#matter-box"); //matter-box 선택
console.log(elem);

// // module aliases
// const Engine = Matter.Engine,
//   Render = Matter.Render,
//   Runner = Matter.Runner,
//   Bodies = Matter.Bodies,
//   Composite = Matter.Composite;
const { Engine, Render, Runner, Bodies, Composite } = Matter; //객체구조분할할당

// create an engine
var engine = Engine.create();

// create a renderer
const render = Render.create({
  // element: document.body,
  element: elem, //elem이 지정한 곳으로 만들어라.
  // engine: engine,
  engine,
});

// create two boxes and a ground
const boxA = Bodies.rectangle(400, 200, 100, 120);
const boxB = Bodies.rectangle(450, 50, 80, 120);
const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true }); //{isStatic: true}는 고정돼있는가를 판단.

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground]); //engine.world는 기본 문법, [boxA, boxB, ground]는 옵션.

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
