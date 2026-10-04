// Drawing the lawn
// ---------- Drawing ----------
function drawGround() {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    ctx.fillStyle = level.night ? ((r + c) % 2 ? '#3d5a6a' : '#456577') : ((r + c) % 2 ? '#79a650' : '#86b35a');
    ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
  }
  // little pebbles scattered for texture (deterministic)
  ctx.fillStyle = 'rgba(40,60,25,.18)';
  for (let i = 0; i < 70; i++) {
    const x = (i * 137.5) % 900, y = (i * 71.3) % 500;
    ctx.beginPath(); ctx.ellipse(x, y, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (level.pool) drawPoolWater(ctx, CELL, state.time); // water goes over the grass texture
  // hover preview
  const h = state.hover;
  if (state.shovel && h && h.r >= 0 && h.r < ROWS && h.c >= 0 && h.c < COLS) {
    if (state.grid[h.r][h.c]) {
      ctx.fillStyle = 'rgba(224,99,74,.4)'; ctx.fillRect(h.c * CELL, h.r * CELL, CELL, CELL);
    }
    ctx.globalAlpha = 0.9; drawShovel(ctx, h.c * CELL + 70, h.r * CELL + 40, 0.9); ctx.globalAlpha = 1;
  }
  if (state.selected === 'jic' && h && h.r >= 0 && h.r < ROWS && h.c >= 0 && h.c < COLS) {
    const recipe = mergeRecipe(h.r, h.c), line = recipe && recipe.cells;
    if (line) {
      ctx.fillStyle = 'rgba(242,194,48,.3)'; ctx.strokeStyle = 'rgba(242,194,48,.95)'; ctx.lineWidth = 3; ctx.setLineDash([8, 6]);
      for (const [fr, fc] of line) { ctx.fillRect(fc * CELL + 3, fr * CELL + 3, CELL - 6, CELL - 6); ctx.strokeRect(fc * CELL + 3, fr * CELL + 3, CELL - 6, CELL - 6); }
      ctx.setLineDash([]);
      ctx.globalAlpha = .75; drawJic(ctx, h.c * CELL + 50, h.r * CELL + 40, 0.8, 0); ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = 'rgba(224,99,74,.35)'; ctx.fillRect(h.c * CELL, h.r * CELL, CELL, CELL);
    }
  } else
  if ((state.selected === 'hyper' || state.selected === 'ultima' || state.selected === 'tesla') && h && h.r >= 0 && h.r < ROWS && h.c >= 0 && h.c < COLS) {
    const ok = h.c + 1 < COLS && !state.grid[h.r][h.c] && !state.grid[h.r][h.c + 1];
    ctx.fillStyle = ok ? 'rgba(255,255,255,.28)' : 'rgba(224,99,74,.35)';
    ctx.fillRect(h.c * CELL, h.r * CELL, Math.min(2, COLS - h.c) * CELL, CELL);
    if (ok) {
      ctx.globalAlpha = .55;
      if (state.selected === 'tesla') drawTesla(ctx, h.c * CELL + 100, h.r * CELL + 90, 1);
      else if (state.selected === 'ultima') drawSnapper(ctx, h.c * CELL + 92, h.r * CELL + ULTIMA_Y, ULTIMA_SCALE, 0, { mode: 'closed', openK: 0, chew: 0 }, true);
      else drawTurtle(ctx, h.c * CELL + 100, h.r * CELL + 60, 1.7, 0, 0, 'hyper');
      ctx.globalAlpha = 1;
    }
  } else
  if (state.selected && h && h.r >= 0 && h.r < ROWS && h.c >= 0 && h.c < COLS) {
    const here = state.grid[h.r][h.c];
    const upgrading = !!UNITS[state.selected].upgrades;
    const free = upgrading ? canUpgrade(state.selected, here) : !here;
    ctx.fillStyle = free ? 'rgba(255,255,255,.28)' : 'rgba(224,99,74,.35)';
    ctx.fillRect(h.c * CELL, h.r * CELL, CELL, CELL);
    if (upgrading) {
      if (free) {
        ctx.globalAlpha = .6;
        if (state.selected === 'forti') drawFortiArmor(ctx, h.c * CELL + 50, h.r * CELL + 58, 1, 1);
        else if (state.selected === 'hsquid') drawSquid(ctx, h.c * CELL + 50, h.r * CELL + 60, 1, 0, 0, false, true);
        else drawTurtle(ctx, h.c * CELL + 46, h.r * CELL + 62, 1, 0, 0, 'enraged');
        ctx.globalAlpha = 1;
      }
    } else if (free) {
      ctx.globalAlpha = .55;
      if (state.selected === 'turtle') drawTurtle(ctx, h.c * CELL + 50, h.r * CELL + 62, 1, 0, 0);
      else if (state.selected === 'angry') drawTurtle(ctx, h.c * CELL + 50, h.r * CELL + 62, 1, 0, 0, 'angry');
      else if (state.selected === 'chog') drawChog(ctx, h.c * CELL + 46, h.r * CELL + 66, 1, 0);
      else if (state.selected === 'snapper') {
        if (h.c + 1 < COLS) { ctx.fillStyle = 'rgba(108,192,74,.32)'; ctx.fillRect((h.c + 1) * CELL, h.r * CELL, CELL, CELL); }
        if (h.c + 2 < COLS) { ctx.fillStyle = 'rgba(108,192,74,.14)'; ctx.fillRect((h.c + 2) * CELL, h.r * CELL, CELL / 4, CELL); }
        drawSnapper(ctx, h.c * CELL + 40, h.r * CELL + 60, 1, 0, { mode: 'closed', openK: 0, chew: 0 });
      }
      else if (state.selected === 'digger') drawDigger(ctx, h.c * CELL + 46, h.r * CELL + 60, 1, 0);
      else if (state.selected === 'dragon') {
        ctx.fillStyle = 'rgba(255,140,40,.25)';
        ctx.fillRect((h.c + 1) * CELL, h.r * CELL, Math.min(3, COLS - h.c - 1) * CELL, CELL);
        drawDragon(ctx, h.c * CELL + 50, h.r * CELL + 60, 1, 0, 1, 0);
      }
      else if (state.selected === 'hyper' || state.selected === 'ultima' || state.selected === 'tesla') { /* drawn below so it can span two tiles */ }
      else if (state.selected === 'jic') { /* drawn below */ }
      else if (state.selected === 'lotl') {
        ctx.fillStyle = 'rgba(255,120,60,.25)';
        const r0 = Math.max(0, h.r - 1), r1 = Math.min(ROWS - 1, h.r + 1), c0 = Math.max(0, h.c - 1), c1 = Math.min(COLS - 1, h.c + 1);
        ctx.fillRect(c0 * CELL, r0 * CELL, (c1 - c0 + 1) * CELL, (r1 - r0 + 1) * CELL);
        drawLotl(ctx, h.c * CELL + 46, h.r * CELL + 62, 1, 0, 0);
      }
      else if (state.selected === 'badger') drawBadger(ctx, h.c * CELL + 50, h.r * CELL + 62, 1, 0);
      else if (state.selected === 'shark') {
        ctx.fillStyle = 'rgba(95,179,230,.3)';
        ctx.fillRect((h.c + 1) * CELL, h.r * CELL, Math.min(SHARK.reach, COLS - h.c - 1) * CELL, CELL);
        drawShark(ctx, h.c * CELL + 44, h.r * CELL + 60, 1, 0);
      }
      else if (state.selected === 'lobster') {
        if (h.c + 1 < COLS) { ctx.fillStyle = 'rgba(47,125,224,.3)'; ctx.fillRect((h.c + 1) * CELL, h.r * CELL, CELL, CELL); }
        drawLobster(ctx, h.c * CELL + 40, h.r * CELL + 60, 1, 0);
      }
      else if (state.selected === 'laser') drawTurtle(ctx, h.c * CELL + 50, h.r * CELL + 62, 1, 0, 0, 'laser');
      else if (state.selected === 'shampoo') drawShampoo(ctx, h.c * CELL + 50, h.r * CELL + 58, 1, 0, 0);
      else if (state.selected === 'clean') {
        const a = sprayArea(h.r, h.c);
        ctx.fillStyle = 'rgba(255,143,198,.3)';
        ctx.fillRect(a.x0 + 10, a.r0 * CELL, Math.min(a.x1, board.width) - a.x0 - 10, (a.r1 - a.r0 + 1) * CELL);
        drawSpray(ctx, h.c * CELL + 50, h.r * CELL + 58, 1, 0, 0, true);
      }
      else if (state.selected === 'spray') {
        const a = sprayArea(h.r, h.c);
        ctx.fillStyle = 'rgba(127,211,232,.35)';
        ctx.fillRect(a.x0 + 10, a.r0 * CELL, Math.min(a.x1, board.width) - a.x0 - 10, (a.r1 - a.r0 + 1) * CELL);
        drawSpray(ctx, h.c * CELL + 50, h.r * CELL + 58, 1, 0, 0);
      }
      else if (state.selected === 'bee') { drawHive(ctx, h.c * CELL + 50, h.r * CELL + 50); drawBee(ctx, h.c * CELL + 50, h.r * CELL + 44, 1, 1, 0.8); }
      else if (state.selected === 'mau') drawMau(ctx, h.c * CELL + 50, h.r * CELL + 58, 1, 1, false, 0);
      else if (state.selected === 'whip') {
        ctx.fillStyle = 'rgba(138,63,184,.35)';
        ctx.fillRect((h.c + 1) * CELL, h.r * CELL, Math.min(3, COLS - h.c - 1) * CELL, CELL);
        drawTurtle(ctx, h.c * CELL + 50, h.r * CELL + 62, 1, 0, 0, 'whip');
      }
      else if (state.selected === 'hsquid') drawSquid(ctx, h.c * CELL + 50, h.r * CELL + 60, 1, 0, 0, false, true);
      else if (state.selected === 'boat') drawBoat(ctx, h.c * CELL + 50, h.r * CELL + 82, 1);
      else if (state.selected === 'loo') drawLoo(ctx, h.c * CELL + 50, h.r * CELL + 60, 1);
      else if (state.selected === 'wipes') drawWipes(ctx, h.c * CELL + 50, h.r * CELL + 60, 1);
      else if (state.selected === 'battery') drawBattery(ctx, h.c * CELL + 50, h.r * CELL + 58, 1);
      else if (state.selected === 'cobra') {
        // its reach: its own lane and the lanes either side, up to 3 tiles ahead
        ctx.fillStyle = 'rgba(214,58,58,.14)';
        const r0 = Math.max(0, h.r - 1), r1 = Math.min(ROWS - 1, h.r + 1);
        ctx.fillRect(h.c * CELL, r0 * CELL, Math.min(COBRA.reach + 1, COLS - h.c) * CELL, (r1 - r0 + 1) * CELL);
        drawCobra(ctx, h.c * CELL + 50, h.r * CELL + 60, 1);
      }
      else if (state.selected === 'multi') {
        ctx.fillStyle = 'rgba(47,168,156,.18)';
        const r0 = Math.max(0, h.r - 1), r1 = Math.min(ROWS - 1, h.r + 1);
        ctx.fillRect((h.c + 1) * CELL, r0 * CELL, (COLS - h.c - 1) * CELL, (r1 - r0 + 1) * CELL);
        drawTurtle(ctx, h.c * CELL + 44, h.r * CELL + 64, 1, 0, 0, 'multi');
      }
      else if (state.selected === 'mini') {
        ctx.fillStyle = 'rgba(59,127,209,.22)';
        ctx.fillRect((h.c + 1) * CELL, h.r * CELL, Math.min(3, COLS - h.c - 1) * CELL, CELL);
        drawTurtle(ctx, h.c * CELL + 44, h.r * CELL + 76, 0.5, 0, 0, 'mini');
      }
      else if (state.selected === 'vamp') drawVampSquid(ctx, h.c * CELL + 50, h.r * CELL + 60, 1, 0, 0, 0);
      else drawSquid(ctx, h.c * CELL + 50, h.r * CELL + 60, 1, 0, 0);
      ctx.globalAlpha = 1;
    }
  }
}
