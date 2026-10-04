// Removing and merging defenders, explosions, puddles and damage
// remove whatever is at (r, c); a Hyper Turtle clears both of its tiles
function removeUnit(r, c) {
  const cell = state.grid[r][c]; if (!cell) return;
  if (cell.onBoat) { state.grid[r][c] = { type: 'boat', hp: BOAT.hp, maxHp: BOAT.hp, bob: cell.bob || 0 }; return; }
  const main = cell.type === 'hyperPart' ? cell.main : cell;
  if (main.twoTile) {
    state.grid[main.r][main.c] = null;
    if (state.grid[main.r][main.c + 1] && state.grid[main.r][main.c + 1].type === 'hyperPart') state.grid[main.r][main.c + 1] = null;
  } else state.grid[r][c] = null;
}
// Jicjajic recipes:
//  - planted ON the middle turtle of a line of three (Rock, Whip and Laser in any order,
//    across a lane or up and down) -> Hyper Turtle seed packet
//  - planted ON a Shampoo or Cleaning Spray that has the other one right next to it
//    (above, below, in front or behind) -> Squeaky Clean seed packet
const TURTLE_TYPES = ['turtle', 'whip', 'laser'];
function mergeRecipe(r, c) {
  const mid = state.grid[r][c];
  if (!mid) return null;
  if (TURTLE_TYPES.includes(mid.type)) {
    for (const [[r1, c1], [r2, c2]] of [[[r, c - 1], [r, c + 1]], [[r - 1, c], [r + 1, c]]]) {
      if (r1 < 0 || r2 >= ROWS || c1 < 0 || c2 >= COLS) continue;
      const a = state.grid[r1][c1], b = state.grid[r2][c2];
      if (!a || !b) continue;
      const kinds = new Set([mid.type, a.type, b.type]);
      if (kinds.size === 3 && TURTLE_TYPES.every(k => kinds.has(k))) return { kind: 'hyper', cells: [[r1, c1], [r, c], [r2, c2]] };
    }
  }
  if (mid.type === 'battery') {
    for (const [[r1, c1], [r2, c2]] of [[[r, c - 1], [r, c + 1]], [[r - 1, c], [r + 1, c]]]) {
      if (r1 < 0 || r2 >= ROWS || c1 < 0 || c2 >= COLS) continue;
      const a = state.grid[r1][c1], b = state.grid[r2][c2];
      if (a && b && a.type === 'battery' && b.type === 'battery') return { kind: 'tesla', cells: [[r1, c1], [r, c], [r2, c2]] };
    }
  }
  if (mid.type === 'snapper') {
    for (const [[r1, c1], [r2, c2]] of [[[r, c - 1], [r, c + 1]], [[r - 1, c], [r + 1, c]]]) {
      if (r1 < 0 || r2 >= ROWS || c1 < 0 || c2 >= COLS) continue;
      const a = state.grid[r1][c1], b = state.grid[r2][c2];
      if (a && b && a.type === 'snapper' && b.type === 'snapper') return { kind: 'ultima', cells: [[r1, c1], [r, c], [r2, c2]] };
    }
  }
  if (mid.type === 'shampoo' || mid.type === 'spray') {
    const other = mid.type === 'shampoo' ? 'spray' : 'shampoo';
    for (const [dr, dc] of [[0, 1], [0, -1], [-1, 0], [1, 0]]) {
      const rr = r + dr, cc = c + dc;
      if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue;
      const n = state.grid[rr][cc];
      if (n && n.type === other) return { kind: 'clean', cells: [[r, c], [rr, cc]] };
    }
  }
  return null;
}
function doMerge(r, c) {
  const recipe = mergeRecipe(r, c); if (!recipe) return false;
  for (const [fr, fc] of recipe.cells) {
    state.grid[fr][fc] = null;
    state.puffs.push({ x: fc * CELL + 50, y: fr * CELL + 50, t: 0, fortify: true, life: 0.6 });
  }
  state.packets.push({ kind: recipe.kind, x: c * CELL + 50, y: r * CELL + 45, life: PACKET_LIFE, bob: Math.random() * 6 });
  state.puffs.push({ x: c * CELL + 50, y: r * CELL + 50, t: 0, merge: true, life: 0.9, palette: recipe.kind });
  return true;
}
// a car blowing up: a fireball, and the car bursts into pieces that bounce across the grass
function blowUpCar(x, baseY) {
  state.puffs.push({ x, y: baseY - 32, t: 0, boom: true, life: 0.7, scale: 0.8 });
  const parts = [];
  const add = (kind, w, h, ox, oy) => parts.push({ kind, w, h, x: x + ox, y: baseY + oy,
    vx: ox * 3 + (Math.random() - 0.5) * 160, vy: -220 - Math.random() * 260, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 18 });
  add('wheel', 11, 11, -46, -12); add('wheel', 11, 11, 46, -12);
  for (const [w, h, ox, oy] of [[24, 12, -50, -30], [20, 14, -10, -60], [26, 10, 30, -28], [16, 12, 52, -34], [18, 16, 10, -40]]) add('panel', w, h, ox, oy);
  for (let i = 0; i < 5; i++) add('glass', 6 + Math.random() * 5, 6, -24 + i * 14, -54);
  add('bumper', 30, 5, -70, -18);
  state.puffs.push({ t: 0, life: 1.8, carParts: parts, floor: baseY - 4 });
  state.shake = 0.3;
}
// an Ultima Snapper that ate a car burps out a small blast and a few of its pieces
function burpCarParts(mouthX, mouthY, floorY) {
  state.puffs.push({ x: mouthX, y: mouthY, t: 0, boom: true, life: 0.6, scale: 0.4 });
  const parts = [['wheel', 11, 11], ['panel', 20, 12], ['panel', 16, 12], ['glass', 9, 6], ['bumper', 30, 5]].map(([kind, w, h]) => ({ kind, w, h,
    x: mouthX, y: mouthY, vx: 120 + Math.random() * 200, vy: -150 - Math.random() * 200, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 18 }));
  state.puffs.push({ t: 0, life: 1.8, carParts: parts, floor: floorY });
  state.shake = Math.max(state.shake || 0, 0.15);
}
function chogBlast(t, r, c) {
  const b = CHOG.blasts[t.stage];
  for (const e of state.enemies) {
    if (e.hp <= 0) continue;
    const ec = Math.floor(e.x / CELL);
    if (Math.abs(e.lane - r) <= b.r && Math.abs(ec - c) <= b.r) { damage(e, b.dmg); if (e.hp <= 0) e.ashed = true; }
  }
  state.puffs.push({ x: c * CELL + 50, y: r * CELL + 50, t: 0, boom: true, life: b.r > 1 ? 1.0 : 0.7, scale: b.r > 1 ? 1.8 : t.stage ? 1.1 : 0.8 });
  state.shake = b.r > 1 ? 0.8 : 0.4;
}
function addPuddle(lane, col) {
  col = Math.max(0, Math.min(COLS - 1, col));
  const existing = state.puddles.find(pd => pd.lane === lane && pd.col === col);
  if (existing) existing.life = SHAMPOO.puddleLife;
  else state.puddles.push({ lane, col, x: col * CELL + CELL / 2, life: SHAMPOO.puddleLife, seed: Math.random() * 10 });
}

function damage(e, n) {
  e.hp -= n;
  if (e.canUp && e.hp <= e.base) {
    e.canUp = false;
    state.puffs.push({ x: e.x - 4, y: e.lane * CELL + 2, t: 0, canFall: true, life: 0.9 });
  }
  if (e.testUp && e.hp <= e.testAt) {
    // the test is ripped up... and now the teacher is FURIOUS
    e.testUp = false; e.angry = true; e.speedMul = 2;
    Sound.play('angry');
    state.puffs.push({ x: e.x - 30, y: e.lane * CELL + 45, t: 0, paper: true, life: 0.9 });
  }
  // at half of its body health (armour doesn't count) a zombie's arm falls off
  if (!e.armless && e.kind !== 'mutant' && e.kind !== 'car') {
    const body = e.kind === 'teacher' || e.kind === 'mini' ? e.testAt : e.base;
    if (e.hp <= body / 2 && e.hp > 0) {
      e.armless = true;
      state.puffs.push({ x: e.x - 30, y: e.lane * CELL + 32, t: 0, armFall: true, life: 1.1 });
    }
  }
  if (e.knightUp && e.hp <= e.base) {
    e.knightUp = false;
    const cv = document.createElement('canvas'); cv.width = 80; cv.height = 80;
    const g = cv.getContext('2d');
    if (g) { const saved = ctx; try { ctx = g; g.translate(40, 40); g.rotate(0.12); drawKnightHelm(0, 0); } catch (err) {} finally { ctx = saved; } }
    state.puffs.push({ t: 0, life: 1.4, helmPop: true, snap: g ? cv : null, x: e.x - 2, y: e.lane * CELL + 14, ox: 0, oy: 0,
      vx: 90 + Math.random() * 50, vy: -360 - Math.random() * 60, spin: 0.12, vs: 9 + Math.random() * 5, bounced: false });
    Sound.play('metal');
  }
  if (e.shieldUp && e.hp <= e.base) {
    e.shieldUp = false;
    state.puffs.push({ x: e.x - 30, y: e.lane * CELL + 55, t: 0, splinter: true });
  }
}
