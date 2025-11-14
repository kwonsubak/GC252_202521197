// =========================
//  Global
// =========================
let evaders = [];
let pursuers = [];

function setup() {
  createCanvas(1000, 700);
  colorMode(RGB, 255);
  noStroke();

  // Evader 5마리 (도망자)
  for (let i = 0; i < 5; i++) {
    const pos = createVector(
      random(width * 0.2, width * 0.8),
      random(height * 0.2, height * 0.8)
    );
    const f = new Fish(pos, {
      maxSpeed: 3.5,
      maxForce: 0.12,
      senseRadius: 260,
      bodyColor: color(58, 124, 165),
      finColor: color(129, 195, 215),
    });
    evaders.push(f);
  }

  // Pursuer 2마리 (추격자)
  for (let i = 0; i < 2; i++) {
    const pos = createVector(
      random(width * 0.2, width * 0.8),
      random(height * 0.2, height * 0.8)
    );
    const f = new Fish(pos, {
      maxSpeed: 4.2,
      maxForce: 0.15,
      senseRadius: 400,
      bodyColor: color(190, 80, 80),
      finColor: color(230, 140, 120),
    });
    pursuers.push(f);
  }
}

function draw() {
  background(15, 20, 35);

  // 물빛 배경 살짝
  noStroke();
  for (let r = 350; r > 0; r -= 10) {
    fill(40, 80, 120, map(r, 350, 0, 0, 120));
    ellipse(width / 2, height / 2, r * 2, r * 1.4);
  }

  // ===== AI 행동 계산 =====

  // Pursuer: 가장 가까운 evader 추격
  for (let p of pursuers) {
    const target = findClosestFish(p, evaders);
    if (target) {
      p.seek(target.pos);
    }
  }

  // Evader: 가장 가까운 pursuer 예측해서 회피
  for (let e of evaders) {
    const hunter = findClosestFish(e, pursuers);
    if (hunter) {
      const d = p5.Vector.dist(e.pos, hunter.pos);
      if (d < e.senseRadius) {
        e.evade(hunter, 0.9); // prediction 강도
      }
    }
  }

  // ===== 물리 업데이트 + 렌더링 =====

  for (let p of pursuers) {
    p.update();
    p.wrap();
    p.display();
  }

  for (let e of evaders) {
    e.update();
    e.wrap();
    e.display();
  }
}

// targetList 중에서 me와 가장 가까운 Fish 찾기
function findClosestFish(me, list) {
  let closest = null;
  let minD = Infinity;
  for (let f of list) {
    if (f === me) continue;
    const d = p5.Vector.dist(me.pos, f.pos);
    if (d < minD) {
      minD = d;
      closest = f;
    }
  }
  return closest;
}

// =========================
//  유틸 함수들 (Processing 버전 대응)
// =========================

function constrainAngleJS(angle, parentAngle, maxDiff) {
  let diff = angle - parentAngle;

  while (diff > PI) diff -= TWO_PI;
  while (diff < -PI) diff += TWO_PI;

  diff = constrain(diff, -maxDiff, maxDiff);
  return parentAngle + diff;
}

function constrainDistanceJS(p, anchor, dist) {
  let dir = p5.Vector.sub(p, anchor);
  if (dir.magSq() === 0) return anchor.copy();
  dir.setMag(dist);
  return p5.Vector.add(anchor, dir);
}

function relativeAngleDiff(a1, a2) {
  let diff = a2 - a1;
  while (diff > PI) diff -= TWO_PI;
  while (diff < -PI) diff += TWO_PI;
  return diff;
}
