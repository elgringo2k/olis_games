// Drawing one whole frame
function draw() {
  ctx.save();
  if (state.shake > 0) {
    ctx.translate((Math.random() - 0.5) * 8 * state.shake / 0.25, (Math.random() - 0.5) * 8 * state.shake / 0.25);
  }
  drawGround();
  state.puddles.forEach(drawPuddle);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const t = state.grid[r][c]; if (!t || t.type === 'hyperPart') continue;
    t.bob += 0.03;
    if (t.type === 'boat') { drawBoat(ctx, c * CELL + 50, r * CELL + 82, 1, t.bob); continue; }
    if (t.type === 'turtle') drawTurtle(ctx, c * CELL + 46, r * CELL + 62, 1, t.throwAnim, t.bob);
    else if (t.type === 'angry') drawTurtle(ctx, c * CELL + 46, r * CELL + 62, 1, t.throwAnim, t.bob, 'angry');
    else if (t.type === 'ultima') drawSnapper(ctx, c * CELL + 92, r * CELL + ULTIMA_Y, ULTIMA_SCALE, t.bob + state.time * 2, { mode: t.mode, openK: t.openK, chew: t.chew, stretch: t.stretch / ULTIMA_SCALE }, true);
    else if (t.type === 'chog') drawChog(ctx, c * CELL + 46, r * CELL + 66, 1, t.bob + state.time, t.size, t.stage);
    else if (t.type === 'snapper') drawSnapper(ctx, c * CELL + 40, r * CELL + (t.onBoat ? 50 : 60), 1, t.bob + state.time * 2, t);
    else if (t.type === 'digger') drawDigger(ctx, c * CELL + 46, r * CELL + 60, 1, t.bob + state.time * 3, t);
    else if (t.type === 'dragon') drawDragon(ctx, c * CELL + 50, r * CELL + 60, 1, t.bob + state.time, t.gear, t.gearFlash);
    else if (t.type === 'enraged') drawTurtle(ctx, c * CELL + 46, r * CELL + 62, 1, t.throwAnim, t.bob + state.time * 2, 'enraged');
    else if (t.type === 'whip') drawTurtle(ctx, c * CELL + 46, r * CELL + 62, 1, t.throwAnim, t.bob, 'whip');
    else if (t.type === 'hyper') drawTurtle(ctx, c * CELL + 100, r * CELL + 60, 1.7, t.throwAnim, t.bob, 'hyper');
    else if (t.type === 'lotl') drawLotl(ctx, c * CELL + 46, r * CELL + 62, 1, state.time, 1 - Math.max(0, t.fuse) / LOTL.fuse);
    else if (t.type === 'badger') drawBadger(ctx, c * CELL + 50, r * CELL + 62, 1, t.bob, t.scratching, state.time);
    else if (t.type === 'shark') drawShark(ctx, c * CELL + 44, r * CELL + 60, 1, t.bob, t.lunge, Math.max(0, t.lungeX - (c * CELL + 44 + 38)));
    else if (t.type === 'lobster') drawLobster(ctx, c * CELL + 40, r * CELL + 60, 1, t.bob, t.snap, Math.max(0, t.snapX - (c * CELL + 40 + 38)));
    else if (t.type === 'laser') drawTurtle(ctx, c * CELL + 46, r * CELL + 62, 1, 0, t.bob, 'laser', t.charging ? 1 - t.cool / LASER.charge : t.beam > 0 ? 1 : 0);
    else if (t.type === 'shampoo') drawShampoo(ctx, c * CELL + 50, r * CELL + 58, 1, t.squeeze, t.bob);
    else if (t.type === 'spray') drawSpray(ctx, c * CELL + 50, r * CELL + 58, 1, t.squeeze, t.bob);
    else if (t.type === 'clean') drawSpray(ctx, c * CELL + 50, r * CELL + 58, 1, t.squeeze, t.bob + state.time, true);
    else if (t.type === 'bee') drawHive(ctx, c * CELL + 50, r * CELL + 50);
    else if (t.type === 'mau') {
      drawMau(ctx, c * CELL + 50, r * CELL + 58, 1, t.hp / t.maxHp, t.blink < 0, t.bob);
      if (t.forti) drawFortiArmor(ctx, c * CELL + 50, r * CELL + 58, 1, t.hp / t.maxHp);
    }
    else if (t.type === 'multi') drawTurtle(ctx, c * CELL + 44, r * CELL + 64, 1, t.throwAnim, t.bob, 'multi');
    else if (t.type === 'mini') { drawTurtle(ctx, c * CELL + 44, r * CELL + 76, 0.5, t.throwAnim, t.bob, 'mini'); if (t.asleep) drawSleepy(c * CELL + 66, r * CELL + 58); }
    else if (t.type === 'vamp') { drawVampSquid(ctx, c * CELL + 50, r * CELL + 60, 1, t.glow, t.bob, t.grown, !!t.asleep); if (t.asleep) drawSleepy(c * CELL + 66, r * CELL + 22); }
    else if (t.type === 'tesla') drawTesla(ctx, c * CELL + 100, r * CELL + 90, 1, t, state.time);
    else if (t.type === 'loo') drawLoo(ctx, c * CELL + 50, r * CELL + 60, 1, t, state.time);
    else if (t.type === 'battery') drawBattery(ctx, c * CELL + 50, r * CELL + 58, 1, t, state.time);
    else if (t.type === 'cobra') drawCobra(ctx, c * CELL + 50, r * CELL + 60, 1, t, state.time);
    else if (t.type === 'hsquid') drawSquid(ctx, c * CELL + 50, r * CELL + 60, 1, t.glow, t.bob + (t.asleep ? state.time : 0), !!t.asleep, true);
    else if (t.type === 'squid') drawSquid(ctx, c * CELL + 50, r * CELL + 60, 1, t.glow, t.bob + (t.asleep ? state.time : 0), !!t.asleep);
    // the boat goes on after the defender, so the defender sits down inside it
    if (t.onBoat) drawBoat(ctx, c * CELL + 50, r * CELL + 82, 1, t.bob);
    if (t.hp < t.maxHp) {
      const bw = t.twoTile ? 160 : 60;
      ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(c * CELL + 20, r * CELL + 2, bw, 6);
      ctx.fillStyle = '#6fd18a'; ctx.fillRect(c * CELL + 20, r * CELL + 2, bw * (Math.max(0, t.hp) / t.maxHp), 6);
    }
  }
  [...state.enemies].sort((a, b) => a.lane - b.lane).forEach(drawEnemy);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const t = state.grid[r][c]; if (t && t.type === 'whip') drawLash(c, r, t);
    if (t && t.type === 'spray') drawMist(r, c, t);
    if (t && t.type === 'clean') drawMist(r, c, t, true);
    if (t && t.type === 'dragon') drawFlame(r, c, t);
    if (t && t.type === 'battery') drawBatteryZap(r, c, t);
    if (t && t.type === 'hyper') drawHyperLash(r, c, t);
    if (t && t.type === 'laser') drawBeam(c, r, t);
    if (t && t.type === 'bee') drawBee(ctx, t.x, t.y + (t.mode === 'home' ? Math.sin(t.bob * 2) * 4 : 0), 1, t.face, state.time * 40);
  }
  state.rocks.forEach(k => k.kind === 'shampoo' ? drawGlob(k) : k.lava ? drawLavaRock(ctx, k.x, k.y + Math.sin(k.x / 30) * 2, k.spin, k.big ? 1.3 : k.mini ? 0.65 : 1) : drawRock(ctx, k.x, k.y + Math.sin(k.x / 30) * 2, k.spin, k.big ? 1.3 : k.mini ? 0.65 : 1));
  for (const p of state.puffs) {
    const k = p.t / 0.45;
    if (p.stomp) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x, p.y);
      ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - kk)})`; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(0, 0, 20 + kk * 60, 6 + kk * 14, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(150,125,90,${0.6 * (1 - kk)})`;
      for (let i = 0; i < 7; i++) {
        const a = Math.PI + (i / 6) * Math.PI, d = 14 + kk * 40;
        ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d * 0.5, 8 + kk * 6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore(); continue;
    }
    if (p.canFall) {
      const kk = p.t / p.life;
      ctx.save(); ctx.globalAlpha = 1 - Math.max(0, kk - 0.6) / 0.4;
      ctx.translate(p.x + kk * 40, p.y - 30 * Math.sin(kk * Math.PI) + kk * kk * 80); ctx.rotate(kk * 5);
      drawCan(ctx, 0, 13, 0); ctx.restore(); continue;
    }
    if (p.burp) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x + kk * 16, p.y - kk * 24);
      ctx.globalAlpha = 1 - Math.max(0, kk - 0.6) / 0.4;
      ctx.fillStyle = 'rgba(190,220,120,.75)';
      for (const [bx, by, br] of [[0, 0, 14], [12, -4, 11], [-10, 4, 9], [6, 8, 9]]) { ctx.beginPath(); ctx.arc(bx, by, br * (0.6 + kk * 0.6), 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#2e5214'; ctx.font = 'bold 13px Nunito, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('BURP!', 2, 1);
      ctx.restore(); continue;
    }
    if (p.crash) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x, p.y);
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI + (i / 8) * Math.PI, d = 10 + kk * 60;
        ctx.save(); ctx.translate(Math.cos(a) * d, Math.sin(a) * d * 0.7 + kk * kk * 70); ctx.rotate(i + kk * 6);
        ctx.globalAlpha = 1 - kk; ctx.fillStyle = i % 2 ? '#7d756c' : '#9d958b'; ctx.fillRect(-5, -4, 10, 8); ctx.restore();
      }
      ctx.restore(); continue;
    }
    if (p.fireHit) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x, p.y);
      const gr = ctx.createRadialGradient(0, 0, 2, 0, 0, 10 + kk * 24);
      gr.addColorStop(0, `rgba(255,230,140,${1 - kk})`); gr.addColorStop(0.6, `rgba(255,120,30,${0.8 * (1 - kk)})`); gr.addColorStop(1, 'rgba(200,50,20,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, 10 + kk * 24, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 5; i++) { ctx.fillStyle = `rgba(255,${120 + i * 20},40,${1 - kk})`; ctx.beginPath(); ctx.arc(Math.cos(i * 1.3) * kk * 20, -kk * (10 + i * 5), 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore(); continue;
    }
    if (p.paper) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x, p.y);
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI / 2 + (i - 4) * 0.4, d = 8 + kk * 36;
        ctx.save(); ctx.translate(Math.cos(a) * d + Math.sin(kk * 8 + i) * 6, Math.sin(a) * d + kk * kk * 60); ctx.rotate(i + kk * 5);
        ctx.globalAlpha = 1 - kk; ctx.fillStyle = '#ffffff'; ctx.fillRect(-5, -3.5, 10, 7);
        ctx.strokeStyle = '#c9d6e8'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(-4, 0); ctx.lineTo(4, 0); ctx.stroke();
        ctx.restore();
      }
      ctx.restore(); continue;
    }
    if (p.shards) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = `rgba(195,202,208,${1 - kk})`;
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + (i - 3.5) * 0.45, d = 10 + kk * 40;
        ctx.save(); ctx.translate(Math.cos(a) * d, Math.sin(a) * d + kk * kk * 50); ctx.rotate(a + kk * 6);
        ctx.fillRect(-6, -3, 12, 6); ctx.restore();
      }
      ctx.restore(); continue;
    }
    if (p.splinter) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = `rgba(154,107,60,${1 - k})`;
      for (let i = 0; i < 7; i++) {
        const a = i * 0.9, d = 8 + k * 30;
        ctx.save(); ctx.translate(Math.cos(a) * d, Math.sin(a) * d + k * k * 20); ctx.rotate(a + k * 4);
        ctx.fillRect(-5, -2, 10, 4); ctx.restore();
      }
      ctx.restore(); continue;
    }
    if (p.dust) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = `rgba(150,125,90,${0.5 * (1 - kk)})`;
      for (let i = 0; i < 5; i++) { const a = Math.PI + (i / 4) * Math.PI, d = 8 + kk * 26; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d * 0.4, 5 + kk * 4, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore(); continue;
    }
    if (p.armFall) {
      // the arm drops off, spins and lands on the grass, then fades
      const kk = p.t / p.life, land = Math.min(1, kk / 0.35);
      ctx.save(); ctx.globalAlpha = 1 - Math.max(0, (kk - 0.6) / 0.4);
      ctx.translate(p.x - land * 14, p.y + land * land * 46); ctx.rotate(land * 2.4);
      ctx.strokeStyle = '#8fae7a'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-24, 2); ctx.stroke();
      ctx.fillStyle = '#6f8d5c'; ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); continue;
    }
    if (p.magnetItem) {
      // a soup can or helmet whizzing off a zombie's head onto a Magneticobra's magnet
      const kk = p.t / p.life, ease = kk * kk;
      ctx.save(); ctx.translate(p.x + (p.tx - p.x) * ease, p.y + (p.ty - p.y) * ease - Math.sin(kk * Math.PI) * 20); ctx.rotate(kk * Math.PI / 2);
      if (p.magnetItem === 'can') { ctx.scale(0.8, 0.8); drawCan(ctx, 0, 13, 1); } else { ctx.scale(0.75, 0.75); drawKnightHelm(1, 0); }
      ctx.restore();
      continue;
    }
    if (p.carParts) {
      // the pieces of a blown-up car: wheels, red panels, glass and the bumper, fading out once they've landed
      const fade = 1 - Math.max(0, (p.t - (p.life - 0.5)) / 0.5);
      ctx.save(); ctx.globalAlpha = fade;
      for (const k of p.carParts) {
        ctx.save(); ctx.translate(k.x, k.y - k.h / 2); ctx.rotate(k.rot);
        if (k.kind === 'wheel') {
          ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(0, 0, k.w, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#9aa3a8'; ctx.beginPath(); ctx.arc(0, 0, k.w * 0.45, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#222'; ctx.fillRect(-1.5, -k.w * 0.45, 3, k.w * 0.9);
        } else if (k.kind === 'panel') {
          ctx.fillStyle = '#c0392b'; roundRect(ctx, -k.w / 2, -k.h / 2, k.w, k.h, 3); ctx.fill();
          ctx.fillStyle = '#962d22'; ctx.fillRect(-k.w / 2, k.h / 2 - 3, k.w, 3);
          ctx.fillStyle = 'rgba(40,30,25,.5)'; ctx.beginPath(); ctx.arc(k.w * 0.2, -k.h * 0.1, 2.5, 0, Math.PI * 2); ctx.fill();
        } else if (k.kind === 'glass') {
          ctx.fillStyle = 'rgba(191,227,242,.9)'; ctx.beginPath(); ctx.moveTo(-k.w / 2, k.h / 2); ctx.lineTo(0, -k.h / 2); ctx.lineTo(k.w / 2, k.h / 2); ctx.closePath(); ctx.fill();
        } else {
          ctx.fillStyle = '#9aa3a8'; roundRect(ctx, -k.w / 2, -k.h / 2, k.w, k.h, 2); ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();
      continue;
    }
    if (p.carWreck) {
      // a broken-down car: shudders harder and harder while smoke pours out of the bonnet
      if (p.blown) continue;
      const kk = p.t / p.life, shudder = 1 + kk * 3;
      ctx.drawImage(p.snap, p.x - SNAP_FOOT_X + Math.sin(p.t * 47) * shudder, p.y - SNAP_FOOT_Y + Math.abs(Math.sin(p.t * 31)) * -shudder);
      ctx.save();
      for (let i = 0; i < 10; i++) {
        const ph = (p.t * 0.9 + i / 10) % 1;
        if (p.t < i * 0.08) continue; // the smoke builds up at first
        const sx = p.x - 58 + Math.sin(i * 2.3 + p.t * 2) * 6 + ph * 18, sy = p.y - 42 - ph * 70;
        const dark = 110 - kk * 70;
        ctx.fillStyle = `rgba(${dark | 0},${dark | 0},${dark | 0},${(0.35 + kk * 0.35) * (1 - ph)})`;
        ctx.beginPath(); ctx.arc(sx, sy, 7 + ph * 14 + kk * 4, 0, Math.PI * 2); ctx.fill();
      }
      // sparks spitting out once it's about to go
      if (kk > 0.6 && Math.sin(p.t * 37) > 0.3) {
        ctx.fillStyle = '#ffd84a';
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(p.x - 66 + ((p.t * 900 + i * 37) % 22), p.y - 36 - ((p.t * 700 + i * 23) % 14), 2, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.restore();
      continue;
    }
    if (p.ash) {
      const kk = p.t / p.life;
      if (p.snap) {
        // crumble from the top down while dust drifts off
        const crumble = Math.max(0, (kk - 0.25) / 0.75);
        ctx.save();
        ctx.beginPath(); ctx.rect(p.x - SNAP_FOOT_X, p.y - p.h + crumble * p.h, SNAP_W, SNAP_H); ctx.clip();
        ctx.globalAlpha = 1 - Math.max(0, kk - 0.85) / 0.15;
        ctx.drawImage(p.snap, p.x - SNAP_FOOT_X, p.y - SNAP_FOOT_Y);
        ctx.restore();
      }
      ctx.save();
      for (let i = 0; i < 14; i++) {
        const ph = Math.max(0, kk * 1.4 - i * 0.05);
        if (ph <= 0 || ph >= 1) continue;
        const ax = p.x - 16 + ((i * 37) % 32) + ph * (i % 2 ? 18 : -12), ay = p.y - 90 + ((i * 23) % 70) + ph * 50;
        ctx.fillStyle = `rgba(60,52,46,${0.8 * (1 - ph)})`;
        ctx.beginPath(); ctx.arc(ax, ay, 2 + (i % 3), 0, Math.PI * 2); ctx.fill();
      }
      // little ash heap left on the grass
      ctx.fillStyle = `rgba(55,48,42,${0.85 * Math.min(1, kk * 2) * (1 - Math.max(0, kk - 0.8) / 0.2)})`;
      ctx.beginPath(); ctx.ellipse(p.x, p.y - 2, 10 + kk * 14, 3 + kk * 5, 0, Math.PI, 0); ctx.fill();
      ctx.restore();
      continue;
    }
    if (p.topple) {
      const fallTime = p.small ? 0.4 : 0.55, kk = Math.max(0, p.t - (p.delay || 0));
      const fall = Math.min(1, kk / fallTime);
      const ang = (fall * fall) * (Math.PI / 2); // speeds up as it tips backwards
      if (fall >= 1 && !p.thudded) {
        p.thudded = true;
        if (p.small) { Sound.play('flop'); state.puffs.push({ x: p.x + 40, y: p.y - 4, t: 0, dust: true, life: 0.5 }); }
        else { state.shake = 0.35; playThud(); state.puffs.push({ x: p.x + 60, y: p.y - 4, t: 0, stomp: true, life: 0.6 }); }
      }
      if (p.snap) {
        ctx.save();
        ctx.globalAlpha = p.small ? 1 - Math.max(0, (kk - 0.9) / 0.6) : 1 - Math.max(0, (kk - 1.6) / 0.6);
        ctx.translate(p.x, p.y); ctx.rotate(ang);
        ctx.drawImage(p.snap, -SNAP_FOOT_X, -SNAP_FOOT_Y);
        ctx.restore();
      }
      continue;
    }
    if (p.helmPop) {
      // the helmet clangs off, spins, bounces on the grass and fades
      if (!p.last) p.last = p.t;
      const step = Math.min(0.05, Math.max(0, p.t - p.last)); p.last = p.t;
      p.vy += 1100 * step; p.ox += p.vx * step; p.oy += p.vy * step; p.spin += p.vs * step;
      const floor = 66;
      if (p.oy > floor) { p.oy = floor; if (!p.bounced) { p.bounced = true; p.vy *= -0.4; p.vx *= 0.5; p.vs *= 0.5; Sound.play('clank'); } else { p.vy = 0; p.vx *= 0.88; p.vs *= 0.88; } }
      if (p.snap) {
        ctx.save(); ctx.globalAlpha = 1 - Math.max(0, (p.t - 1.0) / 0.4);
        ctx.translate(p.x + p.ox, p.y + p.oy); ctx.rotate(p.spin - 0.12);
        ctx.drawImage(p.snap, -40, -40);
        ctx.restore();
      }
      continue;
    }
    if (p.headPop) {
      // the head arcs up and back, bounces once and rolls to a stop
      if (!p.last) p.last = p.t;
      const step = Math.min(0.05, Math.max(0, p.t - p.last)); p.last = p.t;
      p.vy += 1100 * step; p.ox += p.vx * step; p.oy += p.vy * step; p.spin += p.vs * step;
      const floor = p.floor || 64; // the head lands when it reaches the grass
      if (p.oy > floor) { p.oy = floor; if (!p.bounced) { p.bounced = true; p.vy *= -0.35; p.vx *= 0.5; p.vs *= 0.5; Sound.play(p.huge ? 'thud' : 'flop'); if (p.huge) state.shake = Math.max(state.shake, 0.15); } else { p.vy = 0; p.vx *= 0.9; p.vs *= 0.9; } }
      if (p.snap) {
        ctx.save(); ctx.globalAlpha = 1 - Math.max(0, (p.t - 1.0) / 0.4);
        // spin around the middle of the head (about 80 px above the feet)
        const hy = p.hy || 80;
        ctx.translate(p.x + p.ox - 2, p.y + p.oy - hy); ctx.rotate(p.spin); ctx.translate(2, hy);
        ctx.drawImage(p.snap, -SNAP_FOOT_X, -SNAP_FOOT_Y);
        ctx.restore();
      }
      continue;
    }
    if (p.merge) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x, p.y);
      const R = 30 + kk * 110;
      const gr = ctx.createRadialGradient(0, 0, 2, 0, 0, R);
      gr.addColorStop(0, `rgba(255,255,255,${1 - kk})`);
      gr.addColorStop(0.5, `rgba(140,120,255,${0.6 * (1 - kk)})`);
      gr.addColorStop(1, 'rgba(76,227,90,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      (p.palette === 'tesla' ? ['#2f63c9', '#ffffff', '#d9944f'] : p.palette === 'ultima' ? ['#a5d04a', '#ffffff', '#b65ac6'] : p.palette === 'clean' ? ['#7fd3e8', '#ffffff', '#ff8fc6'] : ['#3b7fd1', '#8a3fb8', '#4ce35a']).forEach((col, i) => {
        ctx.strokeStyle = col; ctx.globalAlpha = 1 - kk; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0, 0, 20 + kk * (60 + i * 25), 0, Math.PI * 2); ctx.stroke();
      });
      ctx.restore(); continue;
    }
    if (p.boom) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x, p.y);
      const R = (40 + kk * 130) * (p.scale || 1);
      const gr = ctx.createRadialGradient(0, 0, 4, 0, 0, R);
      gr.addColorStop(0, `rgba(255,250,210,${1 - kk})`);
      gr.addColorStop(0.35, `rgba(255,170,60,${0.9 * (1 - kk)})`);
      gr.addColorStop(0.75, `rgba(230,70,40,${0.6 * (1 - kk)})`);
      gr.addColorStop(1, 'rgba(120,40,30,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${0.8 * (1 - kk)})`; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 20 + kk * 150, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(90,70,60,${0.7 * (1 - kk)})`;
      for (let i = 0; i < 10; i++) { const a = i * 0.63, d = 30 + kk * 110; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d * 0.8, 6 + kk * 10, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore(); continue;
    }
    if (p.fortify) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x, p.y); ctx.strokeStyle = `rgba(242,194,48,${1 - kk})`; ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(Math.cos(a) * (14 + kk * 10), Math.sin(a) * (14 + kk * 10)); ctx.lineTo(Math.cos(a) * (26 + kk * 26), Math.sin(a) * (26 + kk * 26)); ctx.stroke(); }
      ctx.restore(); continue;
    }
    if (p.chomp) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = `rgba(255,255,255,${1 - k})`;
      const gap = 4 + k * 10;
      for (let i = 0; i < 4; i++) {
        const tx = -12 + i * 8;
        ctx.beginPath(); ctx.moveTo(tx, -gap - 8); ctx.lineTo(tx + 4, -gap); ctx.lineTo(tx + 8, -gap - 8); ctx.fill();
        ctx.beginPath(); ctx.moveTo(tx, gap + 8); ctx.lineTo(tx + 4, gap); ctx.lineTo(tx + 8, gap + 8); ctx.fill();
      }
      ctx.restore(); continue;
    }
    if (p.dirt) {
      const kk = p.t / p.life;
      ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = `rgba(110,80,50,${0.8 * (1 - kk)})`;
      for (let i = 0; i < 8; i++) { const a = Math.PI + (i / 7) * Math.PI, d = 8 + kk * 34; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d + kk * kk * 30, 5, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore(); continue;
    }
    if (p.pinch) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.strokeStyle = `rgba(255,230,200,${1 - k})`; ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (const a of [-0.9, -0.3, 0.3, 0.9]) { ctx.beginPath(); ctx.moveTo(Math.cos(a) * 8, Math.sin(a) * 8); ctx.lineTo(Math.cos(a) * (16 + k * 12), Math.sin(a) * (16 + k * 12)); ctx.stroke(); }
      ctx.restore(); continue;
    }
    if (p.zap) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.strokeStyle = `rgba(255,200,205,${1 - k})`; ctx.lineWidth = 2.5;
      for (let i = 0; i < 5; i++) { const a = i * 1.26 + p.x; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * (10 + k * 16), Math.sin(a) * (10 + k * 16)); ctx.stroke(); }
      ctx.restore(); continue;
    }
    if (p.splat) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = `rgba(255,111,181,${1 - k})`;
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.5, d = 6 + k * 22; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d + k * k * 18, 3.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore(); continue;
    }
    if (p.sting) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.strokeStyle = `rgba(150,220,60,${1 - k})`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 6 + k * 20, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); continue;
    }
    if (p.crack) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.strokeStyle = `rgba(255,240,190,${1 - k})`; ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 6, Math.sin(a) * 6); ctx.lineTo(Math.cos(a) * (12 + k * 14), Math.sin(a) * (12 + k * 14)); ctx.stroke(); }
      ctx.restore(); continue;
    }
    const rad = (p.big ? 34 : 14) * (0.4 + k);
    ctx.fillStyle = `rgba(180,170,150,${0.6 * (1 - k)})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
  }
  for (const sh of state.sheets) {
    // a square of loo paper with perforations; after its first zombie it's torn
    ctx.save(); ctx.translate(sh.x, sh.y); ctx.rotate(sh.spin); ctx.scale(LOO.size, LOO.size);
    ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(-10, -8, 22, 20);
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#c9c2b2'; ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (sh.hits === 0) {
      ctx.rect(-11, -11, 22, 22);
    } else {
      // ripped: a jagged edge along one side
      ctx.moveTo(-11, -11); ctx.lineTo(11, -11); ctx.lineTo(11, 4);
      ctx.lineTo(7, 1); ctx.lineTo(4, 7); ctx.lineTo(0, 2); ctx.lineTo(-3, 9); ctx.lineTo(-7, 3); ctx.lineTo(-11, 8);
      ctx.closePath();
    }
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#d8d1c1';
    for (const px of [-7, -2, 3, 8]) { ctx.beginPath(); ctx.arc(px, -7, 0.9, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = 'rgba(120,180,230,.35)';
    ctx.beginPath(); ctx.arc(-3, -1, 2, 0, Math.PI * 2); ctx.arc(4, 3, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  for (const b of state.bolts) {
    // thick zig-zag bolt pointing where it's going, with a crackly glow
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.ang); ctx.scale(b.tesla ? 2 : 1.4, b.tesla ? 2.6 : 1.9); // big and chunky
    const fl = Math.sin(b.t * 60) * 2;
    const shape = [[-46, -4 + fl], [-28, 6], [-24, -2], [-6, 8 - fl], [-10, -1], [14, 0], [-4, -9 + fl], [-1, -2], [-22, -10], [-26, -3], [-46, -4 + fl]];
    const gr = ctx.createRadialGradient(0, 0, 4, 0, 0, 40);
    gr.addColorStop(0, b.tesla ? 'rgba(170,210,255,.7)' : 'rgba(170,255,170,.6)'); gr.addColorStop(1, b.tesla ? 'rgba(120,170,255,0)' : 'rgba(120,255,120,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(-10, 0, 40, 0, Math.PI * 2); ctx.fill();
    ctx.lineJoin = 'round';
    ctx.beginPath(); shape.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath();
    ctx.fillStyle = b.tesla ? '#a8d4ff' : '#9dff9d'; ctx.fill();
    ctx.strokeStyle = b.tesla ? '#2f63c9' : '#2f9e3a'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(-36, -2); ctx.lineTo(-24, 2); ctx.lineTo(-8, 2); ctx.lineTo(6, 0); ctx.lineTo(-8, -2); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  for (const b of state.boulders) {
    const k = Math.min(1, b.t / DIGGER.flight);
    const bx = b.x0 + (b.x1 - b.x0) * k, by = b.y0 + (b.y1 - b.y0) * k - Math.sin(k * Math.PI) * 140;
    ctx.fillStyle = `rgba(0,0,0,${0.12 + 0.18 * k})`;
    ctx.beginPath(); ctx.ellipse(b.x0 + (b.x1 - b.x0) * k, b.y1 + 30, 10 + 12 * k, 3 + 3 * k, 0, 0, Math.PI * 2); ctx.fill();
    drawBoulder(ctx, bx, by, 1.4, k * 8);
  }
  if (state.aiming) {
    const ai = state.aiming, h = state.hover;
    ctx.save();
    ctx.strokeStyle = 'rgba(242,194,48,.95)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ai.c * CELL + 50, ai.r * CELL + 50, 44, 0, Math.PI * 2); ctx.stroke();
    if (h && h.r >= 0 && h.r < ROWS && h.c >= 0 && h.c < COLS) {
      const r0 = Math.max(0, h.r - 1), r1 = Math.min(ROWS - 1, h.r + 1), c0 = Math.max(0, h.c - 1), c1 = Math.min(COLS - 1, h.c + 1);
      ctx.fillStyle = 'rgba(224,99,74,.18)'; ctx.fillRect(c0 * CELL, r0 * CELL, (c1 - c0 + 1) * CELL, (r1 - r0 + 1) * CELL);
      ctx.fillStyle = 'rgba(224,99,74,.3)'; ctx.fillRect(h.c * CELL, h.r * CELL, CELL, CELL);
      const cx = h.c * CELL + 50, cy = h.r * CELL + 50;
      ctx.strokeStyle = '#e0634a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.moveTo(cx - 32, cy); ctx.lineTo(cx + 32, cy); ctx.moveTo(cx, cy - 32); ctx.lineTo(cx, cy + 32); ctx.stroke();
      ctx.setLineDash([6, 8]); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
      const sx = ai.c * CELL + 72, sy = ai.r * CELL + 8;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo((sx + cx) / 2, Math.min(sy, cy) - 150, cx, cy); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  }
  state.orbs.forEach(drawOrb);
  state.coins.forEach(drawCoin);
  if (state.banner > 0) {
    const k = state.banner, a = Math.min(1, (3.2 - k) * 4, k * 2);
    const pulse = 1 + Math.sin((3.2 - k) * 9) * 0.04;
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(20,10,10,.45)'; ctx.fillRect(0, board.height / 2 - 60, board.width, 120);
    ctx.translate(board.width / 2, board.height / 2); ctx.scale(pulse, pulse);
    ctx.font = '64px "Lilita One", "Arial Black", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const bt = state.bannerText || 'FINAL WAVE!';
    ctx.lineJoin = 'round'; ctx.lineWidth = 10; ctx.strokeStyle = '#2a0a0a'; ctx.strokeText(bt, 0, 0);
    ctx.fillStyle = '#ff4d3a'; ctx.fillText(bt, 0, 0);
    ctx.restore();
  }
  state.packets.forEach(k => drawPacket(ctx, k.x, k.y, 1, k.life, k.bob, k.kind));
  const zpl = document.getElementById('zombiePreviewLabel');
  const previewing = picking && startOverlay.classList.contains('show') && !level.sandbox && window.innerWidth > 700;
  if (zpl) zpl.classList.toggle('show', previewing);
  if (previewing) {
    // like the seed-select screen: the zombies wait on the right side of the lawn, shuffling about
    const kinds = levelZombies(), tNow = performance.now() / 1000;
    const others = kinds.filter(k => k !== 'mutant');
    let spots;
    if (level.pool) {
      const swims = k => k === 'tube' || k === 'shieldTube' || k === 'soupTube';
      const wet = others.filter(swims), dry = others.filter(k => !swims(k));
      const dryLanes = [...Array(ROWS).keys()].filter(l => !WATER_LANES.includes(l));
      spots = [
        ...wet.map((k, i) => ({ k, lane: WATER_LANES[i % WATER_LANES.length], col: COLS - 1 - Math.floor(i / WATER_LANES.length) })),
        ...dry.map((k, i) => ({ k, lane: dryLanes[i % dryLanes.length], col: COLS - 1 - Math.floor(i / dryLanes.length) }))
      ];
    } else spots = others.map((k, i) => ({ k, lane: i % ROWS, col: COLS - 1 - Math.floor(i / ROWS) }));
    // the big Mutant stands in the middle lane, a little further back so it isn't cut off
    if (kinds.includes('mutant')) spots.push({ k: 'mutant', lane: 2, col: COLS - 2.7 });
    spots.sort((a, b) => a.lane - b.lane);
    for (const sp of spots) {
      const jitter = ((sp.lane * 37 + sp.col * 11) % 30) - 15;
      drawEnemy({ kind: sp.k, lane: sp.lane, x: sp.col * CELL + 55 + jitter, hp: 1, maxHp: 1, base: 1, walking: true,
        wob: tNow * 2.2 + sp.lane * 1.3 + sp.col, shieldUp: sp.k === 'shield' || sp.k === 'shieldTube', canUp: sp.k === 'soup' || sp.k === 'soupTube', knightUp: sp.k === 'knight', testUp: sp.k === 'teacher' });
    }
  }
  const dz = state.dragZombie;
  if (dz && dz.at) {
    ctx.fillStyle = 'rgba(255,77,94,.18)'; ctx.fillRect(0, dz.at.lane * CELL, board.width, CELL);
    ctx.save(); ctx.globalAlpha = 0.6;
    drawEnemy({ kind: dz.kind, lane: dz.at.lane, x: dz.at.x, hp: 1, maxHp: 1, base: 1, walking: true,
      wob: state.time * 5, shieldUp: dz.kind === 'shield', canUp: dz.kind === 'soup', knightUp: dz.kind === 'knight', testUp: dz.kind === 'teacher' || dz.kind === 'mini' });
    ctx.restore();
  }
  ctx.restore();
}
