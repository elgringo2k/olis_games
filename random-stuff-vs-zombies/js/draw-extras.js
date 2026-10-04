// Zombie snapshots for death animations, pool water, the Car Zombie and the knight's helm
// Draw a zombie onto its own small canvas (optionally as a charred silhouette) for death animations
const NINJA = { walk: 5, tricks: 5, speed: 2 };
const CAR = { halfLen: 75, crushTwoTile: 3, breakdown: 2 }; // 1.5 tiles long; takes 3 s to flatten a 2-tile fusion; smokes for 2 s before it blows up
const SNAP_W = 240, SNAP_H = 280, SNAP_FOOT_X = 120, SNAP_FOOT_Y = 250;
function snapshotEnemy(e, charred, noHead = false) {
  const cv = document.createElement('canvas');
  cv.width = SNAP_W; cv.height = SNAP_H;
  const g = cv.getContext('2d');
  if (!g) return null;
  const clone = Object.assign({}, e, { hp: e.maxHp, poison: 0, bleed: 0, walking: false, smashCool: null, noShadow: !charred, hurtOverride: 1, noHead });
  const baseY = e.lane * CELL + 92;
  const saved = ctx;
  try {
    ctx = g;
    g.translate(SNAP_FOOT_X - e.x, SNAP_FOOT_Y - baseY);
    drawEnemy(clone);
  } finally { ctx = saved; }
  if (charred) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = '#2a2420'; g.fillRect(0, 0, SNAP_W, SNAP_H);
    g.fillStyle = 'rgba(255,120,40,.18)'; g.fillRect(0, SNAP_FOOT_Y - 40, SNAP_W, 40);
    g.globalCompositeOperation = 'source-over';
  }
  return cv;
}
// ---------- Pool: three water lanes down the middle of the lawn (lanes 2, 3 and 4) ----------
const WATER_LANES = [1, 2, 3];
function drawPoolWater(g, cell, time = 0) {
  // a tiled pool like the one in PvZ, in the game's flat style:
  // checkered blue tiles, a stone edge on both sides, and soft light ripples
  const top = WATER_LANES[0] * cell, h = WATER_LANES.length * cell, w = COLS * cell;
  for (const r of WATER_LANES) for (let c = 0; c < COLS; c++) {
    g.fillStyle = (r + c) % 2 ? '#4fb3e3' : '#62c3ee';
    g.fillRect(c * cell, r * cell, cell, cell);
  }
  // darker water at the top under the edge, lighter in the middle
  const sh = g.createLinearGradient(0, top, 0, top + h);
  sh.addColorStop(0, 'rgba(20,80,140,.28)'); sh.addColorStop(0.12, 'rgba(20,80,140,0)');
  sh.addColorStop(0.88, 'rgba(20,80,140,0)'); sh.addColorStop(1, 'rgba(20,80,140,.18)');
  g.fillStyle = sh; g.fillRect(0, top, w, h);
  // light dancing on the water: wobbly squiggles that drift slowly
  g.strokeStyle = 'rgba(255,255,255,.32)'; g.lineWidth = Math.max(1, cell * 0.025); g.lineCap = 'round'; g.lineJoin = 'round';
  for (const r of WATER_LANES) for (let c = 0; c < COLS; c++) {
    for (let k = 0; k < 2; k++) {
      const ox = ((c * 37 + r * 19 + k * 53) % 70) / 100, oy = ((c * 23 + r * 41 + k * 29) % 60) / 100 + 0.15;
      const x = c * cell + ox * cell + Math.sin(time * 0.8 + c + k) * cell * 0.05, y = r * cell + oy * cell;
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo(x + cell * 0.07, y - cell * 0.06, x + cell * 0.14, y);
      g.quadraticCurveTo(x + cell * 0.21, y + cell * 0.06, x + cell * 0.28, y);
      g.stroke();
    }
  }
  // stone edge with tile joins, top and bottom
  const edge = Math.max(3, cell * 0.12);
  for (const [y0, flip] of [[top - edge, false], [top + h, true]]) {
    g.fillStyle = '#d8dfe2'; g.fillRect(0, y0, w, edge);
    g.fillStyle = '#b9c4c9'; g.fillRect(0, flip ? y0 + edge - Math.max(1, edge * 0.25) : y0, w, Math.max(1, edge * 0.25));
    g.fillStyle = '#eef3f5'; g.fillRect(0, flip ? y0 : y0 + edge - Math.max(1, edge * 0.3), w, Math.max(1, edge * 0.3));
    g.fillStyle = '#aab6bc';
    for (let x = 0; x < w; x += cell / 2) g.fillRect(x, y0, 1, edge);
  }
}
// Car Zombie: a beat-up little car (facing left) with a zombie at the wheel
function drawCarZombie(e, baseY) {
  const hpK = e.hurtOverride != null ? 1 - e.hurtOverride : Math.max(0, e.hp / e.maxHp);
  const rumble = e.walking ? Math.sin(e.wob * 6) * 1.2 : Math.sin(e.wob * 9) * 0.6;
  const spin = e.x / 14;
  ctx.save(); ctx.translate(e.x, baseY);
  if (!e.noShadow) { ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(0, 2, 78, 9, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.translate(0, rumble);
  // body
  ctx.fillStyle = '#c0392b';
  roundRect(ctx, -74, -40, 148, 30, 10); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-40, -40); ctx.quadraticCurveTo(-30, -70, 6, -70); ctx.lineTo(30, -70); ctx.quadraticCurveTo(50, -68, 54, -40); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#962d22'; ctx.fillRect(-74, -18, 148, 6);
  // windows
  ctx.fillStyle = '#bfe3f2';
  ctx.beginPath(); ctx.moveTo(-34, -42); ctx.quadraticCurveTo(-26, -64, 0, -64); ctx.lineTo(4, -64); ctx.lineTo(4, -42); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(10, -64); ctx.lineTo(28, -64); ctx.quadraticCurveTo(44, -62, 48, -42); ctx.lineTo(10, -42); ctx.closePath(); ctx.fill();
  // zombie driver peering over the wheel
  ctx.save(); ctx.beginPath(); ctx.moveTo(-34, -42); ctx.quadraticCurveTo(-26, -64, 0, -64); ctx.lineTo(4, -64); ctx.lineTo(4, -42); ctx.closePath(); ctx.clip();
  ctx.fillStyle = '#8fae7a'; ctx.beginPath(); ctx.ellipse(-12, -50, 11, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4d6140'; ctx.beginPath(); ctx.moveTo(-22, -56); ctx.lineTo(-14, -63); ctx.lineTo(-4, -58); ctx.lineTo(-2, -52); ctx.lineTo(-22, -52); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-18, -50, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(-19, -50, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-26, -44); ctx.lineTo(-20, -52); ctx.stroke();
  // headlight, bumper, door handle
  ctx.fillStyle = '#ffe680'; ctx.beginPath(); ctx.ellipse(-72, -30, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#9aa1a8'; roundRect(ctx, -80, -18, 12, 8, 3); ctx.fill(); roundRect(ctx, 68, -18, 12, 8, 3); ctx.fill();
  ctx.fillStyle = '#7a221a'; ctx.fillRect(-8, -36, 10, 3);
  // damage in 3 stages: shiny, then dented, then battered and smoking
  const carStage = hpK > 2 / 3 ? 1 : hpK > 1 / 3 ? 2 : 3;
  const dent = (x, y, rx, ry, rot = 0) => {
    ctx.fillStyle = 'rgba(70,15,10,.45)'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,190,180,.45)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  };
  if (carStage === 1) { ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fillRect(-60, -37, 40, 3); ctx.fillRect(-28, -66, 30, 2); }
  if (carStage >= 2) { dent(-50, -28, 7, 5, 0.2); dent(36, -24, 6, 4, -0.2); dent(-10, -26, 5, 3.5); dent(60, -30, 4, 3, 0.3); }
  if (carStage === 3) {
    dent(-30, -22, 8, 5, -0.2); dent(16, -30, 6, 4.5, 0.3); dent(-62, -24, 5, 6); dent(48, -20, 5, 3.5); dent(-20, -60, 6, 3, 0.2);
    // crumpled front bumper and a bent-up bonnet corner
    ctx.fillStyle = '#7d8389'; ctx.beginPath(); ctx.moveTo(-80, -18); ctx.lineTo(-72, -20); ctx.lineTo(-76, -14); ctx.lineTo(-68, -12); ctx.lineTo(-80, -10); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#a8331f'; ctx.beginPath(); ctx.moveTo(-74, -40); ctx.lineTo(-66, -46); ctx.lineTo(-60, -40); ctx.closePath(); ctx.fill();
    // cracked window
    ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(14, -60); ctx.lineTo(22, -52); ctx.lineTo(18, -46); ctx.moveTo(22, -52); ctx.lineTo(30, -50); ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const ph = (state.time * 0.8 + i / 3) % 1;
      ctx.fillStyle = `rgba(90,90,90,${0.45 * (1 - ph)})`;
      ctx.beginPath(); ctx.arc(-58 + ph * 12, -44 - ph * 40, 6 + ph * 10, 0, Math.PI * 2); ctx.fill();
    }
  }
  // wheels
  for (const wx of [-46, 46]) {
    ctx.save(); ctx.translate(wx, -8);
    ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b8bec4'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
    ctx.rotate(-spin); ctx.fillStyle = '#6d747b'; ctx.fillRect(-1.2, -6, 2.4, 12); ctx.fillRect(-6, -1.2, 12, 2.4);
    ctx.restore();
  }
  // exhaust puffs out the back while driving
  if (e.walking) for (let i = 0; i < 2; i++) {
    const ph = (state.time * 2 + i / 2) % 1;
    ctx.fillStyle = `rgba(160,160,160,${0.4 * (1 - ph)})`;
    ctx.beginPath(); ctx.arc(80 + ph * 22, -12 - ph * 6, 3 + ph * 6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// the Charging Knight's great helm (drawn on whatever ctx currently is)
function drawKnightHelm(armor, step) {
  // great helm with a visor slit and a red plume, in 3 stages:
  // 1 = shiny and whole, 2 = dented and cracked, 3 = battered with a chunk missing
  const helmStage = armor > 2 / 3 ? 1 : armor > 1 / 3 ? 2 : 3;
  // plume: full, then ragged, then a sad stub
  ctx.fillStyle = helmStage === 3 ? '#8e2a30' : '#b8323a';
  ctx.beginPath();
  if (helmStage === 1) { ctx.moveTo(2, -18); ctx.quadraticCurveTo(18, -34, 30, -22 + step * 2); ctx.quadraticCurveTo(18, -24, 6, -14); }
  else if (helmStage === 2) { ctx.moveTo(2, -18); ctx.quadraticCurveTo(14, -30, 24, -24 + step * 2); ctx.lineTo(20, -21); ctx.lineTo(22, -18); ctx.quadraticCurveTo(14, -20, 6, -14); }
  else { ctx.moveTo(3, -18); ctx.quadraticCurveTo(10, -24, 14, -20 + step); ctx.lineTo(11, -17); ctx.lineTo(6, -14); }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = helmStage === 1 ? '#9aa3ab' : helmStage === 2 ? '#8d959c' : '#7c838a';
  roundRect(ctx, -16, -19, 32, 34, 9); ctx.fill();
  if (helmStage === 1) { ctx.fillStyle = '#c3cad0'; ctx.fillRect(-2, -19, 4, 34); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-12, -15, 3, 10); }
  else { ctx.fillStyle = '#a9b0b6'; ctx.fillRect(-2, -19, 4, helmStage === 2 ? 34 : 20); }
  ctx.fillStyle = '#1b1f23'; ctx.fillRect(-14, -3, 22, 4);
  ctx.fillStyle = '#ff5a4a';
  ctx.beginPath(); ctx.arc(-8, -1, 1.6, 0, Math.PI * 2); ctx.arc(2, -1, 1.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1b1f23';
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-8 + i * 6, 8, 1.2, 0, Math.PI * 2); ctx.fill(); }
  // dents: a dark dimple with a light rim on its lower edge, like a hammered-in spot
  const dent = (x, y, rx, ry, rot = 0) => {
    ctx.fillStyle = 'rgba(30,34,38,.45)'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  };
  if (helmStage >= 2) { dent(8, -11, 4, 3); dent(-9, 9, 3.2, 2.4, 0.4); dent(10, 8, 2.6, 2); dent(-10, -12, 2.4, 2, -0.3); }
  if (helmStage === 3) {
    // battered all over, with the side caved in
    dent(-2, -14, 5, 3.4, 0.2); dent(4, 11, 4, 3); dent(-12, 1, 2.6, 3.4); dent(12, -2, 3, 2.4, 0.5); dent(-4, 6, 2.2, 1.8);
    ctx.fillStyle = '#5f666c';
    ctx.beginPath(); ctx.moveTo(16, -12); ctx.quadraticCurveTo(10, -6, 16, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#2b3035'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-6, -19); ctx.lineTo(-5, -15); ctx.stroke(); // just one small crack
  }
}
// the head on its own: the whole zombie with the headless one cut out of it
function snapshotHead(e) {
  const full = snapshotEnemy(e, false), body = snapshotEnemy(e, false, true);
  if (!full || !body) return null;
  // keep only the pixels that differ between the two pictures. (Simply cutting the body out
  // left faint see-through ghosts of shadows and shading behind, so compare pixel by pixel.)
  const g = full.getContext('2d'), gb = body.getContext('2d');
  try {
    const A = g.getImageData(0, 0, SNAP_W, SNAP_H), B = gb.getImageData(0, 0, SNAP_W, SNAP_H);
    const a = A.data, b = B.data;
    for (let i = 0; i < a.length; i += 4) {
      if (a[i] === b[i] && a[i + 1] === b[i + 1] && a[i + 2] === b[i + 2] && a[i + 3] === b[i + 3]) a[i + 3] = 0;
    }
    g.putImageData(A, 0, 0);
  } catch (err) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'destination-out'; g.drawImage(body, 0, 0); g.globalCompositeOperation = 'source-over';
  }
  return full;
}

// ---------- Winning ----------
// the reward seed packet: the new defender's picture on the front (or a gold star if there isn't one),
// with light rays turning behind it
function drawRewardPacket(g, x, y, s, unit, time = 0, rays = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  if (rays > 0) {
    g.save(); g.rotate(time * 0.6);
    for (let i = 0; i < 12; i++) {
      g.rotate(Math.PI / 6);
      g.fillStyle = `rgba(255,245,190,${0.35 * rays})`;
      g.beginPath(); g.moveTo(0, 0); g.lineTo(-7, -70); g.lineTo(7, -70); g.closePath(); g.fill();
    }
    g.restore();
    const gr = g.createRadialGradient(0, 0, 6, 0, 0, 52);
    gr.addColorStop(0, `rgba(255,250,210,${0.8 * rays})`); gr.addColorStop(1, 'rgba(255,250,210,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 52, 0, Math.PI * 2); g.fill();
  }
  // paper packet with a crimped top and a green stripe
  g.fillStyle = 'rgba(0,0,0,.18)'; roundRect(g, -20, -26, 44, 60, 5); g.fill();
  g.fillStyle = '#f7f1dc'; roundRect(g, -22, -30, 44, 60, 5); g.fill();
  g.strokeStyle = '#c9bf94'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#e6dcb8';
  g.beginPath(); g.moveTo(-22, -24);
  for (let i = 0; i <= 8; i++) g.lineTo(-22 + i * 5.5, i % 2 ? -30 : -26);
  g.lineTo(22, -24); g.closePath(); g.fill();
  g.fillStyle = '#4caf50'; g.fillRect(-22, 18, 44, 8);
  // the picture window
  g.fillStyle = '#dff0d0'; roundRect(g, -17, -21, 34, 36, 5); g.fill();
  const art = unit && document.querySelector(`.card[data-unit="${unit}"] canvas`);
  if (art) { try { g.drawImage(art, -17, -21, 34, 34); } catch (err) {} }
  else {
    // a gold star
    g.fillStyle = '#f2c230'; g.strokeStyle = '#b8860b'; g.lineWidth = 1.5;
    g.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 6 : 14; g.lineTo(Math.cos(a) * r, -3 + Math.sin(a) * r); }
    g.closePath(); g.fill(); g.stroke();
  }
  g.restore();
}
// a fat sack of coins, tied at the top, with coins spilling out in front
function drawCoinBag(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(0, 40, 48, 8, 0, 0, Math.PI * 2); g.fill();
  // the sack
  g.fillStyle = '#b5834a';
  g.beginPath(); g.moveTo(-14, -26); g.quadraticCurveTo(-46, -6, -42, 18); g.quadraticCurveTo(-38, 42, 0, 42);
  g.quadraticCurveTo(38, 42, 42, 18); g.quadraticCurveTo(46, -6, 14, -26); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,.15)'; g.beginPath(); g.ellipse(-18, 6, 8, 18, -0.3, 0, Math.PI * 2); g.fill();
  // the gathered neck and the rope
  g.fillStyle = '#9c6c37';
  g.beginPath(); g.moveTo(-14, -26); g.lineTo(-20, -40); g.lineTo(-6, -34); g.lineTo(0, -42); g.lineTo(6, -34); g.lineTo(20, -40); g.lineTo(14, -26); g.closePath(); g.fill();
  g.strokeStyle = '#6b4220'; g.lineWidth = 4; g.beginPath(); g.moveTo(-15, -26); g.lineTo(15, -26); g.stroke();
  // a big coin symbol on the front
  g.fillStyle = '#f2c230'; g.beginPath(); g.arc(0, 10, 15, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#b8860b'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#8a6200'; g.font = '900 18px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('C', 0, 11);
  // coins spilling out
  for (const [cx, cy] of [[-46, 36], [-34, 40], [40, 37], [50, 33], [30, 41]]) {
    g.fillStyle = '#f2c230'; g.beginPath(); g.ellipse(cx, cy, 9, 4.5, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#b8860b'; g.lineWidth = 1.2; g.stroke();
  }
  g.restore();
}
