// Drawing every defender and its attacks
const SHELLS = {
  rock: { dark: '#2f6db8', main: '#3b7fd1', line: '#255a9a' },
  whip: { dark: '#6f2f99', main: '#8a3fb8', line: '#56247a' },
  angry: { dark: '#0f2466', main: '#183a96', line: '#0a1a4d' },
  mini: { dark: '#5ea4d4', main: '#8ccbf0', line: '#4a8ab6' },
  multi: { dark: '#6b4423', main: '#8f5d33', line: '#4f3118' },
  enraged: { dark: '#170c4a', main: '#2a1878', line: '#0e0733' },
  hyper: { dark: '#2f3a8a', main: '#3b7fd1', line: '#1d2a5c' },
  laser: { dark: '#2fae3c', main: '#4ce35a', line: '#1f7d2a' }
};
function drawTurtle(g, x, y, s, throwAnim, bob, kind = 'rock', glow = 0) {
  glow = Math.max(0, Math.min(1, glow || 0));
  const sh = SHELLS[kind];
  g.save(); g.translate(x, y + Math.sin(bob) * 1.5); g.scale(s, s);
  // shadow
  g.fillStyle = 'rgba(0,0,0,.18)';
  g.beginPath(); g.ellipse(0, 26, 34, 8, 0, 0, Math.PI * 2); g.fill();
  // legs
  g.fillStyle = '#7fc0a0';
  [[-22, 18], [18, 18], [-26, 4], [22, 4]].forEach(([lx, ly]) => { g.beginPath(); g.ellipse(lx, ly, 9, 7, 0, 0, Math.PI * 2); g.fill(); });
  // head (faces right)
  g.beginPath(); g.ellipse(34, -2, 14, 12, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1a1a1a';
  g.beginPath(); g.arc(39, -6, 2.6, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#1a1a1a'; g.lineWidth = 1.6;
  if (kind === 'angry' || kind === 'enraged') {
    // cover the smile with a scowl and slam the eyebrow down
    g.fillStyle = '#7fc0a0'; g.beginPath(); g.arc(40, 2, 5, 0, Math.PI); g.fill();
    g.strokeStyle = '#1a1a1a'; g.lineWidth = 2.2; g.lineCap = 'round';
    g.beginPath(); g.moveTo(33, -12); g.lineTo(43, -8); g.stroke();
    g.lineWidth = 1.8; g.beginPath(); g.arc(40, 6, 4, Math.PI + 0.4, -0.4); g.stroke();
    g.fillStyle = 'rgba(230,60,50,.45)'; g.beginPath(); g.ellipse(36, 3, 4, 2.5, 0, 0, Math.PI * 2); g.fill();
  } else {
    g.beginPath(); g.arc(40, 1, 4, 0.2, 1.2); g.stroke();
  }
  // shell
  g.fillStyle = sh.dark;
  g.beginPath(); g.ellipse(0, 4, 32, 24, 0, Math.PI, 0); g.lineTo(32, 12); g.lineTo(-32, 12); g.closePath(); g.fill();
  g.fillStyle = sh.main;
  g.beginPath(); g.ellipse(0, 2, 28, 22, 0, Math.PI, 0); g.closePath(); g.fill();
  if (kind === 'hyper') {
    // one third of each turtle's shell colour
    g.save(); g.beginPath(); g.ellipse(0, 2, 28, 22, 0, Math.PI, 0); g.closePath(); g.clip();
    g.fillStyle = '#3b7fd1'; g.fillRect(-28, -22, 19, 26);
    g.fillStyle = '#8a3fb8'; g.fillRect(-9, -22, 18, 26);
    g.fillStyle = '#4ce35a'; g.fillRect(9, -22, 19, 26);
    g.restore();
  }
  // shell plates
  g.strokeStyle = sh.line; g.lineWidth = 2;
  g.beginPath(); g.moveTo(-9, -18); g.lineTo(-12, 2); g.moveTo(9, -18); g.lineTo(12, 2);
  g.moveTo(-26, -6); g.lineTo(26, -6); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.25)';
  g.beginPath(); g.ellipse(-8, -12, 9, 4, -0.4, 0, Math.PI * 2); g.fill();
  // rim
  g.fillStyle = sh.line; g.fillRect(-32, 8, 64, 6);
  // throwing arm with rock
  const a = -0.4 - throwAnim * 1.6;
  g.save(); g.translate(18, -4); g.rotate(a);
  g.fillStyle = '#7fc0a0'; g.beginPath(); g.ellipse(0, -12, 6, 13, 0, 0, Math.PI * 2); g.fill();
  if ((kind === 'rock' || kind === 'mini' || kind === 'multi' || kind === 'angry' || kind === 'enraged') && throwAnim < 0.3) drawRock(g, 0, -26, 0, 0.8);
  if (kind === 'laser') {
    // no throwing arm: cover it with a tucked flipper
    g.fillStyle = '#7fc0a0'; g.beginPath(); g.ellipse(0, -12, 6, 10, 0, 0, Math.PI * 2); g.fill();
  }
  if (kind === 'whip' || kind === 'hyper') {
    g.fillStyle = '#5a3a1c'; g.fillRect(-3, -32, 6, 10);
    if (throwAnim <= 0) {
      g.strokeStyle = kind === 'hyper' ? '#ff6b78' : '#7a4f26'; g.lineWidth = 3; g.lineCap = 'round';
      g.beginPath(); g.moveTo(0, -32);
      g.bezierCurveTo(14, -44, 22, -20, 12, -6); g.quadraticCurveTo(6, 4, 14, 10);
      g.stroke();
      if (kind === 'hyper') drawRock(g, 15, 14, 0, 0.75);
    }
  }
  g.restore();
  if (kind === 'enraged') {
    g.strokeStyle = '#ff4d5e'; g.lineWidth = 1.6; g.globalAlpha = 0.7;
    g.beginPath(); g.moveTo(-22, -4); g.lineTo(-14, -12); g.lineTo(-6, -8); g.lineTo(2, -16); g.lineTo(10, -10); g.lineTo(20, -14); g.stroke();
    g.globalAlpha = 1;
    g.strokeStyle = '#b30000'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(41, -16); g.lineTo(45, -12); g.moveTo(45, -16); g.lineTo(41, -12); g.stroke();
    g.strokeStyle = '#1a1a1a'; g.lineWidth = 2.6;
    g.beginPath(); g.moveTo(32, -13); g.lineTo(44, -7); g.stroke();
    for (let i = 0; i < 2; i++) {
      const ph = (bob * 0.8 + i * 0.5) % 1;
      g.fillStyle = `rgba(255,255,255,${0.7 * (1 - ph)})`;
      g.beginPath(); g.arc(32 + i * 9, -18 - ph * 16, 2.5 + ph * 4, 0, Math.PI * 2); g.fill();
    }
  }
  if (kind === 'hyper') {
    // little crown of power on the shell
    g.fillStyle = '#f2c230';
    g.beginPath(); g.moveTo(-8, -22); g.lineTo(-6, -32); g.lineTo(-2, -25); g.lineTo(0, -34); g.lineTo(2, -25); g.lineTo(6, -32); g.lineTo(8, -22); g.closePath(); g.fill();
  }
  if (kind === 'laser' || kind === 'hyper') {
    // shell circuit lines and a little dish
    g.strokeStyle = '#ff4d5e'; g.lineWidth = 1.5; g.globalAlpha = 0.5 + glow * 0.5;
    g.beginPath(); g.moveTo(-20, -2); g.lineTo(-12, -10); g.lineTo(0, -10); g.lineTo(6, -16); g.stroke();
    g.globalAlpha = 1;
    g.fillStyle = '#2e343a'; g.fillRect(-4, -26, 3, 8);
    g.fillStyle = '#ff4d5e'; g.beginPath(); g.arc(-2.5, -27, 3 + glow * 2, 0, Math.PI * 2); g.fill();
    // goggles
    g.fillStyle = '#2e343a'; g.fillRect(26, -10, 20, 5);
    g.fillStyle = '#1b1f23'; g.beginPath(); g.ellipse(40, -6, 7, 6, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = glow > 0 ? `rgba(255,77,94,${0.6 + glow * 0.4})` : '#c2303f';
    g.beginPath(); g.ellipse(40, -6, 5, 4.2, 0, 0, Math.PI * 2); g.fill();
    if (glow > 0) {
      const gr = g.createRadialGradient(42, -6, 1, 42, -6, 16 + glow * 8);
      gr.addColorStop(0, `rgba(255,120,130,${glow})`); gr.addColorStop(1, 'rgba(255,77,94,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(42, -6, 16 + glow * 8, 0, Math.PI * 2); g.fill();
    }
  }
  g.restore();
}

function drawSleepy(x, y) {
  ctx.save(); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.textAlign = 'center';
  for (let i = 0; i < 2; i++) {
    const ph = (state.time * 0.3 + i * 0.5) % 1;
    ctx.globalAlpha = 1 - ph; ctx.font = `bold ${9 + ph * 7}px Nunito, sans-serif`;
    ctx.fillText('z', x + ph * 12, y - ph * 22);
  }
  ctx.restore();
}
function drawVampSquid(g, x, y, s, glow, bob, grown = 1, asleep = false) {
  const sc = s * (0.72 + grown * 0.28);
  g.save(); g.translate(x, y + 4 * (1 - grown) + Math.sin(bob) * 3); g.scale(sc, sc);
  g.fillStyle = 'rgba(0,0,0,.16)'; g.beginPath(); g.ellipse(0, 30 - Math.sin(bob) * 3, 26, 7, 0, 0, Math.PI * 2); g.fill();
  if (glow > 0) {
    const gr = g.createRadialGradient(0, -6, 4, 0, -6, 52);
    gr.addColorStop(0, `rgba(255,214,90,${0.5 * glow})`); gr.addColorStop(1, 'rgba(255,214,90,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, -6, 52, 0, Math.PI * 2); g.fill();
  }
  // webbed cape between the arms
  const flap = Math.sin(bob * 1.4) * 4;
  g.fillStyle = '#3a0d1e';
  g.beginPath(); g.moveTo(-20, 6);
  g.quadraticCurveTo(-30 - flap, 22, -22, 30); g.quadraticCurveTo(-11, 22, -7, 31);
  g.quadraticCurveTo(0, 24, 7, 31); g.quadraticCurveTo(11, 22, 22, 30);
  g.quadraticCurveTo(30 + flap, 22, 20, 6); g.closePath(); g.fill();
  g.fillStyle = '#e6d6a8';
  for (const tx of [-22, -7, 7, 22]) { g.beginPath(); g.arc(tx, 30, 1.6, 0, Math.PI * 2); g.fill(); }
  // mantle: deep crimson with a pair of fins like little bat ears
  g.fillStyle = '#8e1a3c';
  g.beginPath(); g.moveTo(0, -42); g.bezierCurveTo(16, -34, 22, -10, 20, 10); g.lineTo(-20, 10); g.bezierCurveTo(-22, -10, -16, -34, 0, -42); g.fill();
  g.beginPath(); g.moveTo(-10, -32); g.lineTo(-26, -40); g.lineTo(-16, -22); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(10, -32); g.lineTo(26, -40); g.lineTo(16, -22); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.ellipse(-7, -24, 4, 9, 0.2, 0, Math.PI * 2); g.fill();
  // glowing red eyes (shut tight while it naps in the sun) and tiny fangs
  if (asleep) {
    g.strokeStyle = '#2a0812'; g.lineWidth = 2; g.lineCap = 'round';
    g.beginPath(); g.arc(-8, -5, 5, 0.2, Math.PI - 0.2); g.stroke();
    g.beginPath(); g.arc(8, -5, 5, 0.2, Math.PI - 0.2); g.stroke();
  } else {
  g.fillStyle = '#ffd1d1';
  g.beginPath(); g.ellipse(-8, -4, 6.5, 7, 0, 0, Math.PI * 2); g.ellipse(8, -4, 6.5, 7, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#d6102c';
  g.beginPath(); g.arc(-7, -3, 3.4, 0, Math.PI * 2); g.arc(9, -3, 3.4, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(-6, -5, 1.2, 0, Math.PI * 2); g.arc(10, -5, 1.2, 0, Math.PI * 2); g.fill();
  }
  g.strokeStyle = '#2a0812'; g.lineWidth = 1.8; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-5, 6); g.quadraticCurveTo(1, 9, 7, 6); g.stroke();
  g.fillStyle = '#fff';
  g.beginPath(); g.moveTo(-3, 6.5); g.lineTo(-1.5, 10); g.lineTo(0, 7); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(3, 7); g.lineTo(4.5, 10); g.lineTo(6, 6.5); g.closePath(); g.fill();
  g.restore();
}
function drawSquid(g, x, y, s, glow, bob, asleep = false, blue = false) {
  const C = blue ? { arm: '#1d5cb0', body: '#2f7de0', light: '#8cc0ff' } : { arm: '#e0358a', body: '#ff4fa3', light: '#ff9fcf' };
  g.save(); g.translate(x, y + Math.sin(bob) * 3); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.16)';
  g.beginPath(); g.ellipse(0, 30 - Math.sin(bob) * 3, 26, 7, 0, 0, Math.PI * 2); g.fill();
  if (glow > 0) {
    const gr = g.createRadialGradient(0, -6, 4, 0, -6, 52);
    gr.addColorStop(0, `rgba(255,214,90,${0.55 * glow})`); gr.addColorStop(1, 'rgba(255,214,90,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, -6, 52, 0, Math.PI * 2); g.fill();
  }
  // tentacles
  g.strokeStyle = C.arm; g.lineWidth = 6; g.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const tx = -15 + i * 6, sway = Math.sin(bob * 1.6 + i) * 5;
    g.beginPath(); g.moveTo(tx, 8);
    g.quadraticCurveTo(tx + sway, 20, tx + sway * 1.6 + (i - 2.5) * 3, 30);
    g.stroke();
  }
  // mantle
  g.fillStyle = C.body;
  g.beginPath();
  g.moveTo(0, -46);
  g.bezierCurveTo(16, -36, 22, -10, 20, 10);
  g.lineTo(-20, 10);
  g.bezierCurveTo(-22, -10, -16, -36, 0, -46);
  g.fill();
  // fins
  g.beginPath(); g.moveTo(-6, -40); g.lineTo(-22, -40); g.lineTo(-12, -28); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(6, -40); g.lineTo(22, -40); g.lineTo(12, -28); g.closePath(); g.fill();
  g.fillStyle = C.light;
  g.beginPath(); g.ellipse(-7, -26, 4, 9, 0.2, 0, Math.PI * 2); g.fill();
  [[8, -18], [-10, -6], [12, 0]].forEach(([sx, sy]) => { g.beginPath(); g.arc(sx, sy, 2.4, 0, Math.PI * 2); g.fill(); });
  // eyes
  if (asleep) {
    g.strokeStyle = '#2a1030'; g.lineWidth = 2.2; g.lineCap = 'round';
    g.beginPath(); g.arc(-8, -3, 5, 0.2, Math.PI - 0.2); g.stroke();
    g.beginPath(); g.arc(8, -3, 5, 0.2, Math.PI - 0.2); g.stroke();
    g.restore();
    // little z's floating up
    g.save(); g.fillStyle = 'rgba(255,255,255,.85)'; g.textAlign = 'center';
    for (let i = 0; i < 2; i++) {
      const ph = (bob * 0.3 + i * 0.5) % 1;
      g.globalAlpha = 1 - ph; g.font = `bold ${(9 + ph * 7) * s}px Nunito, sans-serif`;
      g.fillText('z', x + (18 + ph * 12) * s, y - (40 + ph * 24) * s);
    }
    g.restore();
    return;
  }
  g.fillStyle = '#fff';
  g.beginPath(); g.ellipse(-8, -2, 7, 8, 0, 0, Math.PI * 2); g.ellipse(8, -2, 7, 8, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#2a1030';
  g.beginPath(); g.arc(-7, -1, 3.6, 0, Math.PI * 2); g.arc(9, -1, 3.6, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(-6, -3, 1.3, 0, Math.PI * 2); g.arc(10, -3, 1.3, 0, Math.PI * 2); g.fill();
  g.restore();
}

function drawOrb(o) {
  let x = o.x, y = o.y, alpha = 1, scale = 1;
  if (o.collected) {
    const k = Math.min(1, o.ct / 0.45), e = k * k;
    x = o.sx + (20 - o.sx) * e; y = o.sy + (-30 - o.sy) * e; scale = 1 - 0.5 * k;
  } else if (o.life < 2.5) {
    alpha = 0.35 + 0.65 * Math.abs(Math.sin(o.life * 6));
  }
  if (o.small) scale *= 0.68;
  if (o.big) scale *= 1.3;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(scale, scale);
  const gr = ctx.createRadialGradient(0, 0, 4, 0, 0, 34);
  gr.addColorStop(0, 'rgba(255,226,120,.85)'); gr.addColorStop(1, 'rgba(255,226,120,0)');
  ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f2c230'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff3c2'; ctx.lineWidth = 3; ctx.stroke();
  ctx.rotate(Math.sin(o.spin) * 0.15);
  ctx.fillStyle = '#7a5a00';
  ctx.beginPath(); ctx.moveTo(3, -12); ctx.lineTo(-7, 2); ctx.lineTo(-1, 2); ctx.lineTo(-3, 12); ctx.lineTo(7, -2); ctx.lineTo(1, -2); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawMau(g, x, y, s, health, blinking, bob) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const squish = Math.sin(bob * 0.6) * 0.8;
  g.fillStyle = 'rgba(0,0,0,.2)';
  g.beginPath(); g.ellipse(0, 34, 40, 8, 0, 0, Math.PI * 2); g.fill();
  // body
  g.fillStyle = '#7e3424';
  roundRect(g, -38, -40 + squish, 76, 74 - squish, 10); g.fill();
  g.fillStyle = '#b5523a';
  roundRect(g, -36, -40 + squish, 72, 68 - squish, 9); g.fill();
  // mortar lines
  g.strokeStyle = 'rgba(240,215,190,.5)'; g.lineWidth = 2.5;
  const rows = [-20, 0];
  g.beginPath();
  rows.forEach(ry => { g.moveTo(-34, ry + squish); g.lineTo(34, ry + squish); });
  [[-12, -40, -20], [14, -40, -20], [0, -20, 0], [-22, 0, 28], [22, 0, 28]].forEach(([mx, a, b]) => { g.moveTo(mx, a + squish + 1); g.lineTo(mx, b + squish); });
  g.stroke();
  // highlight
  g.fillStyle = 'rgba(255,255,255,.18)';
  roundRect(g, -30, -36 + squish, 26, 8, 4); g.fill();
  // cracks as health drops
  g.strokeStyle = '#4a1c12'; g.lineWidth = 2.2; g.lineCap = 'round';
  if (health < 0.66) { g.beginPath(); g.moveTo(-36, -30); g.lineTo(-26, -24); g.lineTo(-28, -14); g.lineTo(-20, -8); g.stroke(); }
  if (health < 0.33) { g.beginPath(); g.moveTo(36, -6); g.lineTo(26, 0); g.lineTo(30, 10); g.lineTo(22, 18); g.moveTo(26, 0); g.lineTo(18, -4); g.stroke(); }
  // face
  const fy = -8 + squish;
  if (blinking) {
    g.strokeStyle = '#2a120c'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(-18, fy); g.lineTo(-8, fy); g.moveTo(8, fy); g.lineTo(18, fy); g.stroke();
  } else {
    g.fillStyle = '#fff';
    g.beginPath(); g.ellipse(-13, fy, 7, 8, 0, 0, Math.PI * 2); g.ellipse(13, fy, 7, 8, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#2a120c';
    g.beginPath(); g.arc(-12, fy + 1, 3.5, 0, Math.PI * 2); g.arc(14, fy + 1, 3.5, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = 'rgba(255,140,140,.45)';
  g.beginPath(); g.ellipse(-24, fy + 12, 6, 3.5, 0, 0, Math.PI * 2); g.ellipse(24, fy + 12, 6, 3.5, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#2a120c'; g.lineWidth = 2.5;
  g.beginPath();
  if (health < 0.33) { g.moveTo(-6, fy + 16); g.quadraticCurveTo(0, fy + 11, 6, fy + 16); }
  else { g.moveTo(-6, fy + 12); g.quadraticCurveTo(0, fy + 17, 6, fy + 12); }
  g.stroke();
  g.restore();
}
function drawShampoo(g, x, y, s, squeeze, bob) {
  g.save(); g.translate(x, y + Math.sin(bob) * 1); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, 34, 22, 6, 0, 0, Math.PI * 2); g.fill();
  const sq = 1 - squeeze * 0.12;
  g.scale(1 + squeeze * 0.1, sq); g.translate(0, (1 - sq) * 34);
  // bottle body
  g.fillStyle = '#ff6fb5';
  roundRect(g, -17, -20, 34, 54, 12); g.fill();
  g.fillStyle = 'rgba(255,255,255,.3)'; roundRect(g, -13, -14, 5, 40, 3); g.fill();
  // label with face
  g.fillStyle = '#fff0f7'; roundRect(g, -12, -2, 24, 24, 5); g.fill();
  g.fillStyle = '#5a1838';
  g.beginPath(); g.arc(-4, 6, 2.2, 0, Math.PI * 2); g.arc(5, 6, 2.2, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#5a1838'; g.lineWidth = 1.8;
  g.beginPath(); g.arc(0.5, 11, 3.6, 0.2, Math.PI - 0.2); g.stroke();
  g.fillStyle = 'rgba(255,111,181,.4)';
  g.beginPath(); g.ellipse(-8, 13, 3, 2, 0, 0, Math.PI * 2); g.ellipse(9, 13, 3, 2, 0, 0, Math.PI * 2); g.fill();
  // flip cap pointing right
  g.fillStyle = '#c93f86'; roundRect(g, -12, -32, 24, 13, 4); g.fill();
  g.fillStyle = '#e65aa0'; g.beginPath(); g.moveTo(8, -30); g.lineTo(20, -27); g.lineTo(20, -23); g.lineTo(8, -22); g.closePath(); g.fill();
  g.restore();
}
function drawPuddle(pd) {
  const fade = Math.min(1, pd.life / 2);
  const x0 = pd.col * CELL, y0 = pd.lane * CELL;
  ctx.save(); ctx.globalAlpha = 0.6 * fade;
  ctx.fillStyle = '#ff8fc6';
  roundRect(ctx, x0 + 3, y0 + 3, CELL - 6, CELL - 6, 14); ctx.fill();
  ctx.globalAlpha = 0.85 * fade;
  ctx.fillStyle = 'rgba(255,255,255,.4)';
  ctx.beginPath(); ctx.ellipse(x0 + 30, y0 + 22, 16, 4, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x0 + 70, y0 + 78, 10, 3, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    const ph = (state.time * 0.5 + i / 6 + pd.seed) % 1;
    ctx.globalAlpha = 0.8 * fade * (1 - ph);
    const bx = x0 + 15 + ((i * 37 + pd.seed * 10) % 70), by = y0 + 85 - ((i * 23) % 50) - ph * 18;
    ctx.beginPath(); ctx.arc(bx, by, 2.5 + (i % 3), 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}
function drawGlob(k) {
  ctx.save(); ctx.translate(k.x, k.y + Math.sin(k.x / 25) * 3);
  ctx.fillStyle = '#ff6fb5';
  ctx.beginPath(); ctx.ellipse(0, 0, 11, 8, Math.sin(k.spin) * 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-10, 1, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  ctx.beginPath(); ctx.ellipse(3, -3, 3.5, 2, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawSpray(g, x, y, s, squeeze, bob, clean = false) {
  g.save(); g.translate(x, y + Math.sin(bob) * 1); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, 34, 24, 6, 0, 0, Math.PI * 2); g.fill();
  // bottle (Squeaky Clean is half spray blue, half shampoo pink)
  if (clean) {
    const bg = g.createLinearGradient(-18, 0, 18, 0);
    bg.addColorStop(0, '#7fd3e8'); bg.addColorStop(0.5, '#c9a8f0'); bg.addColorStop(1, '#ff8fc6');
    g.fillStyle = bg;
  } else g.fillStyle = '#7fd3e8';
  g.beginPath(); g.moveTo(-18, 32); g.lineTo(-18, -4); g.quadraticCurveTo(-18, -14, -8, -16); g.lineTo(8, -16);
  g.quadraticCurveTo(18, -14, 18, -4); g.lineTo(18, 32); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-14, -6, 4, 34);
  // liquid line
  if (clean) {
    const lg = g.createLinearGradient(-18, 0, 18, 0);
    lg.addColorStop(0, '#4fb6d4'); lg.addColorStop(1, '#ff6fb5');
    g.fillStyle = lg;
  } else g.fillStyle = '#4fb6d4';
  g.fillRect(-18, 6, 36, 26);
  // label with face
  g.fillStyle = '#ffffff'; g.fillRect(-14, 0, 28, 20);
  g.fillStyle = '#1e3b4a';
  g.beginPath(); g.arc(-5, 8, 2.2, 0, Math.PI * 2); g.arc(6, 8, 2.2, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#1e3b4a'; g.lineWidth = 1.8;
  g.beginPath(); g.arc(0.5, 12, 4, 0.2, Math.PI - 0.2); g.stroke();
  // neck and trigger head
  g.fillStyle = '#e8eef0'; g.fillRect(-7, -24, 14, 9);
  g.fillStyle = '#f4f7f8';
  g.beginPath(); g.moveTo(-10, -24); g.lineTo(-10, -36); g.lineTo(20, -36); g.lineTo(24, -30); g.lineTo(10, -26); g.closePath(); g.fill();
  g.fillStyle = '#2f9bd1'; g.fillRect(20, -35, 6, 5);
  // trigger
  g.save(); g.translate(6, -26); g.rotate(-squeeze * 0.35);
  g.fillStyle = clean ? '#c93f86' : '#2f9bd1'; g.beginPath(); g.moveTo(0, 0); g.lineTo(6, 0); g.lineTo(4, 14); g.lineTo(0, 12); g.closePath(); g.fill();
  g.restore();
  if (clean) {
    // sparkles and bubbles: squeaky clean!
    const tw = (bob * 2) % (Math.PI * 2);
    g.fillStyle = '#ffffff';
    for (const [sx, sy, sz, ph] of [[-24, -20, 5, 0], [24, -6, 4, 2], [-22, 18, 3.5, 4]]) {
      const k = 0.5 + 0.5 * Math.sin(tw + ph), r = sz * (0.6 + 0.4 * k);
      g.beginPath(); g.moveTo(sx, sy - r); g.lineTo(sx + r * 0.3, sy - r * 0.3); g.lineTo(sx + r, sy); g.lineTo(sx + r * 0.3, sy + r * 0.3);
      g.lineTo(sx, sy + r); g.lineTo(sx - r * 0.3, sy + r * 0.3); g.lineTo(sx - r, sy); g.lineTo(sx - r * 0.3, sy - r * 0.3); g.closePath(); g.fill();
    }
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.4;
    for (let i = 0; i < 3; i++) { const ph = (bob * 0.4 + i / 3) % 1; g.beginPath(); g.arc(-8 + i * 9, -18 - ph * 22, 2 + i, 0, Math.PI * 2); g.stroke(); }
  }
  g.restore();
}
function drawMist(r, c, t, clean = false) {
  if (t.mist <= 0) return;
  const a = sprayArea(r, c), k = 1 - t.mist / 0.5;
  ctx.save();
  ctx.globalAlpha = 0.55 * (1 - k);
  const nx = c * CELL + 50 + 26, ny = r * CELL + 58 - 33;
  for (let lane = a.r0; lane <= a.r1; lane++) {
    for (let i = 0; i < 6; i++) {
      const fx = Math.min(1, k * 2.2) * ((i + 0.5) / 6);
      const px = nx + (a.x1 - nx) * fx, py = ny + (lane * CELL + 45 - ny) * fx + Math.sin(i * 2.1 + lane) * 10;
      const gr = ctx.createRadialGradient(px, py, 2, px, py, 30 + k * 14);
      if (clean && (i + lane) % 2) { gr.addColorStop(0, 'rgba(255,225,240,1)'); gr.addColorStop(1, 'rgba(255,143,198,0)'); }
      else { gr.addColorStop(0, 'rgba(225,248,255,1)'); gr.addColorStop(1, 'rgba(160,220,240,0)'); }
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, 30 + k * 14, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 0.9 * (1 - k);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 10; i++) {
    const lane = a.r0 + (i % (a.r1 - a.r0 + 1));
    const bx = a.x0 + 20 + ((i * 53) % (a.x1 - a.x0 - 30)), by = lane * CELL + 30 + ((i * 37) % 40) - k * 16;
    ctx.beginPath(); ctx.arc(bx, by, 3 + (i % 3), 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

function drawCan(g, x, y, health) {
  g.save(); g.translate(x, y);
  // body
  g.fillStyle = '#a9b0b6'; g.fillRect(-15, -26, 30, 26);
  g.fillStyle = '#3e8f6a'; g.fillRect(-15, -21, 30, 15);
  g.fillStyle = '#f2e6c4';
  g.beginPath(); g.ellipse(0, -13.5, 9, 5, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#d0473a';
  g.beginPath(); g.arc(0, -13.5, 3, 0, Math.PI * 2); g.fill();
  // ridges and rims
  g.strokeStyle = '#7d858c'; g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(-15, -23.5); g.lineTo(15, -23.5); g.moveTo(-15, -3); g.lineTo(15, -3); g.stroke();
  g.fillStyle = '#c4cacf';
  g.beginPath(); g.ellipse(0, -26, 15, 4, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#8b9298'; g.beginPath(); g.ellipse(0, -26, 11, 2.6, 0, 0, Math.PI * 2); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-11, -24, 3, 22);
  // dents
  g.fillStyle = 'rgba(60,66,72,.55)';
  if (health < 0.66) { g.beginPath(); g.ellipse(8, -8, 4, 3, 0.4, 0, Math.PI * 2); g.fill(); }
  if (health < 0.33) {
    g.beginPath(); g.ellipse(-7, -19, 5, 3, -0.3, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(4, -24, 3, 2, 0, 0, Math.PI * 2); g.fill();
  }
  g.restore();
}

function drawBee(g, x, y, s, face, flap) {
  g.save(); g.translate(x, y); g.scale(s * face, s);
  // wings
  const w = Math.abs(Math.sin(flap)) * 0.6 + 0.4;
  g.fillStyle = 'rgba(220,240,255,.8)'; g.strokeStyle = 'rgba(120,150,180,.8)'; g.lineWidth = 1.5;
  g.beginPath(); g.ellipse(-4, -16, 9, 13 * w, -0.4, 0, Math.PI * 2); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(6, -15, 7, 11 * w, 0.3, 0, Math.PI * 2); g.fill(); g.stroke();
  // stinger
  g.fillStyle = '#2a2016';
  g.beginPath(); g.moveTo(-18, 2); g.lineTo(-28, 4); g.lineTo(-18, 7); g.closePath(); g.fill();
  // body
  g.fillStyle = '#f5c518';
  g.beginPath(); g.ellipse(0, 3, 20, 14, 0, 0, Math.PI * 2); g.fill();
  g.save(); g.beginPath(); g.ellipse(0, 3, 20, 14, 0, 0, Math.PI * 2); g.clip();
  g.fillStyle = '#2a2016'; g.fillRect(-12, -12, 6, 30); g.fillRect(-1, -12, 6, 30);
  g.restore();
  // head
  g.fillStyle = '#2a2016';
  g.beginPath(); g.arc(18, 0, 10, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(21, -2, 4.2, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#111';
  g.beginPath(); g.arc(22.5, -2, 2, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#2a2016'; g.lineWidth = 2; g.lineCap = 'round';
  g.beginPath(); g.moveTo(17, -9); g.quadraticCurveTo(18, -18, 24, -20); g.moveTo(21, -8); g.quadraticCurveTo(25, -15, 30, -15); g.stroke();
  g.fillStyle = '#f5c518';
  g.beginPath(); g.arc(24, -20, 2.4, 0, Math.PI * 2); g.arc(30, -15, 2.4, 0, Math.PI * 2); g.fill();
  g.restore();
}
function drawHive(g, x, y) {
  g.save(); g.translate(x, y);
  g.fillStyle = 'rgba(0,0,0,.16)'; g.beginPath(); g.ellipse(0, 30, 26, 6, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#d9a02a';
  for (const [hx, hy] of [[-11, 22], [11, 22], [0, 14]]) {
    g.beginPath();
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; g.lineTo(hx + Math.cos(a) * 10, hy + Math.sin(a) * 10); }
    g.closePath(); g.fill();
  }
  g.strokeStyle = '#a8761a'; g.lineWidth = 2;
  for (const [hx, hy] of [[-11, 22], [11, 22], [0, 14]]) {
    g.beginPath();
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; g.lineTo(hx + Math.cos(a) * 6, hy + Math.sin(a) * 6); }
    g.closePath(); g.stroke();
  }
  g.restore();
}
function drawFortiArmor(g, x, y, s, health) {
  g.save(); g.translate(x, y); g.scale(s, s);
  // stone battlements on top
  g.fillStyle = '#8d949a';
  for (const bx of [-38, -14, 10]) { roundRect(g, bx, -56, 28 - (bx === 10 ? 0 : 0), 18, 3); g.fill(); }
  g.fillStyle = '#6c7378';
  g.fillRect(-38, -42, 76, 6);
  g.fillStyle = 'rgba(255,255,255,.25)';
  for (const bx of [-36, -12, 12]) g.fillRect(bx, -54, 8, 3);
  // iron bands with rivets across the brick
  g.fillStyle = '#5b6268';
  g.fillRect(-40, -14, 80, 7);
  g.fillRect(-40, 18, 80, 7);
  g.fillStyle = '#c7ccd0';
  for (let i = 0; i < 5; i++) { const rx = -32 + i * 16; g.beginPath(); g.arc(rx, -10.5, 2, 0, Math.PI * 2); g.arc(rx, 21.5, 2, 0, Math.PI * 2); g.fill(); }
  // side shields
  g.fillStyle = '#7a8288';
  g.beginPath(); g.moveTo(-44, -30); g.lineTo(-38, -34); g.lineTo(-38, 28); g.lineTo(-44, 24); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(44, -30); g.lineTo(38, -34); g.lineTo(38, 28); g.lineTo(44, 24); g.closePath(); g.fill();
  // dents in the metal as it takes damage
  g.fillStyle = 'rgba(40,44,48,.6)';
  if (health < 0.66) { g.beginPath(); g.ellipse(-18, -10, 4, 2.5, 0, 0, Math.PI * 2); g.fill(); }
  if (health < 0.33) { g.beginPath(); g.ellipse(22, 21, 5, 2.5, 0, 0, Math.PI * 2); g.fill(); g.fillRect(-14, -56, 10, 6); }
  g.restore();
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

function drawShark(g, x, y, s, bob, lunge = 0, reach = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  // little pool he pops out of
  g.fillStyle = '#2f7fb8'; g.beginPath(); g.ellipse(0, 26, 36, 10, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#5fb3e6'; g.beginPath(); g.ellipse(0, 24, 32, 8, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 1.5;
  g.beginPath(); g.ellipse(-12, 24, 8, 2, 0, 0, Math.PI * 2); g.ellipse(14, 26, 6, 1.5, 0, 0, Math.PI * 2); g.stroke();
  const ext = lunge * reach, rise = Math.sin(bob) * 2 - lunge * 6;
  g.save(); g.translate(ext * 0.5, rise); g.rotate(-lunge * 0.12);
  g.save(); g.beginPath(); g.rect(-60, -80, 200, 104 + (lunge > 0 ? 30 : 0)); g.clip();
  // body
  g.fillStyle = '#6f8ea6';
  g.beginPath(); g.moveTo(-30, 24); g.quadraticCurveTo(-30, -18, 4, -24); g.quadraticCurveTo(34, -24, 38 + ext * 0.5, 2); g.quadraticCurveTo(30, 24, 10, 24); g.closePath(); g.fill();
  // white belly
  g.fillStyle = '#f2f5f7';
  g.beginPath(); g.moveTo(-4, 24); g.quadraticCurveTo(10, 6, 36 + ext * 0.5, 4); g.quadraticCurveTo(30, 22, 10, 24); g.closePath(); g.fill();
  // dorsal fin
  g.fillStyle = '#5a7890';
  g.beginPath(); g.moveTo(-14, -18); g.lineTo(-6, -46); g.lineTo(8, -22); g.closePath(); g.fill();
  // side fin
  g.beginPath(); g.moveTo(2, 8); g.lineTo(-10, 20); g.lineTo(10, 14); g.closePath(); g.fill();
  // gills
  g.strokeStyle = '#4c667a'; g.lineWidth = 2;
  for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-2 + i * 5, -8); g.lineTo(-4 + i * 5, 2); g.stroke(); }
  // mouth: grin, opens wide when lunging
  const open = lunge > 0.4 ? 9 : 2;
  g.fillStyle = '#7a1f2b';
  g.beginPath(); g.moveTo(14, 4); g.quadraticCurveTo(26, 6 + open, 38 + ext * 0.5, 2); g.quadraticCurveTo(26, 4 - open * 0.3, 14, 4); g.fill();
  g.fillStyle = '#fff';
  for (let i = 0; i < 5; i++) { const tx = 17 + i * 4.2; g.beginPath(); g.moveTo(tx, 3.5); g.lineTo(tx + 2, 3.5 + 3 + open * 0.3); g.lineTo(tx + 4, 3.5); g.fill(); }
  // eye
  g.fillStyle = '#fff'; g.beginPath(); g.arc(20, -8, 5, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#111'; g.beginPath(); g.arc(21.5, -8, 2.6, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(22.5, -9.5, 1, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#3c5266'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(14, -15); g.lineTo(25, -13); g.stroke();
  g.restore();
  g.restore();
  // splash when lunging
  if (lunge > 0.5) {
    g.fillStyle = 'rgba(160,215,245,.85)';
    for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(-18 + i * 12, 18 - lunge * 10 - (i % 2) * 6, 3, 0, Math.PI * 2); g.fill(); }
  }
  g.restore();
}
function drawJic(g, x, y, s, bob) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, 30, 20, 5, 0, 0, Math.PI * 2); g.fill();
  // little soil mound
  g.fillStyle = '#7a5a3a'; g.beginPath(); g.ellipse(0, 28, 18, 6, 0, Math.PI, 0); g.fill();
  const sway = Math.sin(bob * 1.5) * 0.08;
  g.rotate(sway);
  // stem
  g.strokeStyle = '#3f8f3a'; g.lineWidth = 5; g.lineCap = 'round';
  g.beginPath(); g.moveTo(0, 26); g.quadraticCurveTo(-4, 8, 0, -8); g.stroke();
  // three leaves in the three turtle colours
  const leaf = (rot, color) => {
    g.save(); g.translate(0, -8); g.rotate(rot);
    g.fillStyle = color; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(10, -10, 0, -26); g.quadraticCurveTo(-10, -10, 0, 0); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -2); g.lineTo(0, -20); g.stroke();
    g.restore();
  };
  leaf(-1.0, '#3b7fd1'); leaf(1.0, '#4ce35a'); leaf(0, '#8a3fb8');
  // face on the bulb
  g.fillStyle = '#9ad06a'; g.beginPath(); g.arc(0, 6, 10, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(-3.5, 4, 1.8, 0, Math.PI * 2); g.arc(3.5, 4, 1.8, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#1a1a1a'; g.lineWidth = 1.5; g.beginPath(); g.arc(0, 8, 3, 0.2, Math.PI - 0.2); g.stroke();
  g.restore();
}
function drawPacket(g, x, y, s, life = PACKET_LIFE, bob = 0, kind = 'hyper') {
  g.save(); g.translate(x, y + Math.sin(bob) * 3); g.scale(s, s); g.rotate(Math.sin(bob * 0.7) * 0.06);
  if (life < 3) g.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(life * 6));
  const gr = g.createRadialGradient(0, 0, 6, 0, 0, 46);
  gr.addColorStop(0, 'rgba(255,240,170,.75)'); gr.addColorStop(1, 'rgba(255,240,170,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 46, 0, Math.PI * 2); g.fill();
  // paper packet
  g.fillStyle = '#f7f1dc'; roundRect(g, -22, -30, 44, 60, 5); g.fill();
  g.strokeStyle = '#c9bf94'; g.lineWidth = 2; g.stroke();
  // crimped top
  g.fillStyle = '#e6dcb8';
  g.beginPath(); g.moveTo(-22, -24);
  for (let i = 0; i <= 8; i++) g.lineTo(-22 + i * 5.5, i % 2 ? -30 : -26);
  g.lineTo(22, -24); g.closePath(); g.fill();
  // colour stripe for the fusion inside
  if (kind === 'clean') {
    g.fillStyle = '#7fd3e8'; g.fillRect(-22, 14, 22, 10);
    g.fillStyle = '#ff8fc6'; g.fillRect(0, 14, 22, 10);
  } else if (kind === 'tesla') {
    g.fillStyle = '#2f63c9'; g.fillRect(-22, 14, 22, 10);
    g.fillStyle = '#d9944f'; g.fillRect(0, 14, 22, 10);
  } else if (kind === 'ultima') {
    g.fillStyle = '#a5d04a'; g.fillRect(-22, 14, 22, 10);
    g.fillStyle = '#b65ac6'; g.fillRect(0, 14, 22, 10);
  } else {
    g.fillStyle = '#3b7fd1'; g.fillRect(-22, 14, 15, 10);
    g.fillStyle = '#8a3fb8'; g.fillRect(-7, 14, 14, 10);
    g.fillStyle = '#4ce35a'; g.fillRect(7, 14, 15, 10);
  }
  g.restore();
  // a tiny picture on the front
  if (kind === 'clean') drawSpray(g, x, y - 6 * s + Math.sin(bob) * 3, 0.42 * s, 0, 0, true);
  else if (kind === 'tesla') drawTesla(g, x, y + 16 * s + Math.sin(bob) * 3, 0.32 * s, null, 0);
  else if (kind === 'ultima') drawSnapper(g, x - 6 * s, y + Math.sin(bob) * 3, 0.45 * s, 0, { mode: 'closed', openK: 0, chew: 0 }, true);
  else drawTurtle(g, x - 2 * s, y - 4 * s + Math.sin(bob) * 3, 0.32 * s, 0, 0, 'hyper');
}
function drawHyperLash(r, c, t) {
  if (!t.lash) return;
  const hx = c * CELL + 100 + 22 * 1.7, hy = r * CELL + 60 - 40;
  const k = t.lash.t / 0.4, tx = t.lash.x, ty = r * CELL + 44;
  // the whip shoots out over the first 40%, then hangs and fades
  const reach = Math.min(1, k / 0.4);
  const ex = hx + (tx - hx) * reach, ey = hy + (ty - hy) * reach;
  const wave = Math.sin(reach * Math.PI) * 26;
  const c1x = hx + (ex - hx) * 0.3, c1y = hy - 34 - wave, c2x = hx + (ex - hx) * 0.7, c2y = ey + wave * 0.6;
  ctx.save(); ctx.globalAlpha = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4; ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,77,94,.35)'; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.moveTo(hx, hy); ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey); ctx.stroke();
  ctx.strokeStyle = '#ff6b78'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(hx, hy); ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey); ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(hx, hy); ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey); ctx.stroke();
  // big rock tied to the tip
  drawRock(ctx, ex, ey, t.lash.t * 18, 2.1);
  if (reach >= 1) {
    const fade = 1 - Math.max(0, (k - 0.4) / 0.6);
    ctx.globalAlpha = fade;
    ctx.fillStyle = 'rgba(255,77,94,.35)'; ctx.fillRect(ex, ey - 8, board.width - ex + 20, 16);
    ctx.fillStyle = 'rgba(255,140,150,.85)'; ctx.fillRect(ex, ey - 3.5, board.width - ex + 20, 7);
    ctx.fillStyle = '#fff'; ctx.fillRect(ex, ey - 1.2, board.width - ex + 20, 2.4);
  }
  ctx.restore();
}

function drawLotl(g, x, y, s, bob, anger = 0) {
  const lerp = (a, b) => Math.round(a + (b - a) * anger);
  const body = `rgb(${lerp(255, 230)},${lerp(160, 60)},${lerp(200, 60)})`;
  const gill = `rgb(${lerp(240, 200)},${lerp(90, 30)},${lerp(150, 40)})`;
  const shake = anger > 0.3 ? Math.sin(bob * 60) * anger * 2.5 : 0;
  const swell = 1 + anger * 0.22;
  g.save(); g.translate(x + shake, y); g.scale(s * swell, s * swell);
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, 26, 30, 6, 0, 0, Math.PI * 2); g.fill();
  // tail
  g.fillStyle = body;
  g.beginPath(); g.moveTo(-14, 14); g.quadraticCurveTo(-40, 6 + Math.sin(bob * 2) * 4, -42, 18); g.quadraticCurveTo(-30, 22, -12, 22); g.closePath(); g.fill();
  // body
  g.beginPath(); g.ellipse(-2, 16, 20, 11, 0, 0, Math.PI * 2); g.fill();
  // little legs
  g.beginPath(); g.ellipse(-12, 26, 5, 3, 0, 0, Math.PI * 2); g.ellipse(8, 26, 5, 3, 0, 0, Math.PI * 2); g.fill();
  // frilly gills: three each side
  g.fillStyle = gill;
  for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
    g.save(); g.translate(10 + side * 18, -6 + i * 7); g.rotate(side * (-0.5 + i * 0.4) + Math.sin(bob * 3 + i) * 0.1);
    g.beginPath(); g.ellipse(side * 7, 0, 9, 3.5, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  // head
  g.fillStyle = body;
  g.beginPath(); g.ellipse(10, -2, 20, 15, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.ellipse(4, -10, 8, 3, -0.2, 0, Math.PI * 2); g.fill();
  // eyes
  g.fillStyle = '#1a1a1a';
  g.beginPath(); g.arc(3, -3, 2.8, 0, Math.PI * 2); g.arc(19, -3, 2.8, 0, Math.PI * 2); g.fill();
  if (anger > 0.15) {
    // furrowed brows and a cross mouth
    g.strokeStyle = '#3a0d0d'; g.lineWidth = 2.4; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-2, -10); g.lineTo(6, -7); g.moveTo(24, -10); g.lineTo(16, -7); g.stroke();
    g.beginPath(); g.moveTo(6, 7); g.quadraticCurveTo(11, 3, 16, 7); g.stroke();
    // anger vein
    g.strokeStyle = '#b30000'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(22, -16); g.lineTo(26, -12); g.moveTo(26, -16); g.lineTo(22, -12); g.stroke();
  } else {
    g.strokeStyle = '#7a2a4a'; g.lineWidth = 2; g.lineCap = 'round';
    g.beginPath(); g.arc(11, 3, 5, 0.3, Math.PI - 0.3); g.stroke();
    g.fillStyle = 'rgba(255,90,140,.5)'; g.beginPath(); g.ellipse(-1, 4, 3, 2, 0, 0, Math.PI * 2); g.ellipse(23, 4, 3, 2, 0, 0, Math.PI * 2); g.fill();
  }
  g.restore();
  // steam puffs as he boils over
  if (anger > 0.4) {
    for (let i = 0; i < 2; i++) {
      const ph = (bob * 1.5 + i * 0.5) % 1;
      g.fillStyle = `rgba(255,255,255,${0.7 * (1 - ph)})`;
      g.beginPath(); g.arc(x + (i ? 26 : -4) * s, y - (22 + ph * 22) * s, (4 + ph * 5) * s, 0, Math.PI * 2); g.fill();
    }
  }
}

function drawBadger(g, x, y, s, bob, scratch = 0, time = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  // dirt mound behind
  g.fillStyle = '#6b4e33';
  g.beginPath(); g.ellipse(0, 26, 40, 13, 0, Math.PI, 0); g.fill();
  const peek = Math.sin(bob) * 1.5 - scratch * 3;
  // body and head
  g.save(); g.beginPath(); g.rect(-60, -60, 120, 82); g.clip();
  g.fillStyle = '#7d7f86';
  g.beginPath(); g.ellipse(-4, 22 + peek, 26, 18, 0, 0, Math.PI * 2); g.fill();
  g.save(); g.translate(14, 2 + peek);
  g.fillStyle = '#f2f2ee';
  g.beginPath(); g.ellipse(0, 0, 17, 14, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1e1e22';
  g.beginPath(); g.ellipse(-6, -2, 4.5, 11, -0.35, 0, Math.PI * 2); g.ellipse(7, -2, 4.5, 11, 0.35, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#7d7f86';
  g.beginPath(); g.arc(-14, -9, 5, 0, Math.PI * 2); g.arc(14, -9, 5, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(-5, -1, 2.6, 0, Math.PI * 2); g.arc(7, -1, 2.6, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#111'; g.beginPath(); g.arc(-4.5, -0.5, 1.5, 0, Math.PI * 2); g.arc(7.5, -0.5, 1.5, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1e1e22'; g.beginPath(); g.ellipse(1, 8, 4, 3, 0, 0, Math.PI * 2); g.fill();
  if (scratch > 0.3) { g.strokeStyle = '#1e1e22'; g.lineWidth = 2; g.beginPath(); g.moveTo(-5, -8); g.lineTo(-1, -6); g.moveTo(8, -8); g.lineTo(4, -6); g.stroke(); }
  g.restore();
  // claws, flailing when a zombie is on top
  const fl = scratch * Math.sin(time * 30);
  g.fillStyle = '#5d5f66';
  for (const [cx, side] of [[-10, -1], [30, 1]]) {
    g.save(); g.translate(cx, 14 + peek); g.rotate(side * (0.4 + fl * 0.6));
    g.beginPath(); g.ellipse(0, -6, 6, 9, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#f2f2ee'; g.lineWidth = 1.6; g.lineCap = 'round';
    g.beginPath(); for (let i = -1; i <= 1; i++) { g.moveTo(i * 3, -13); g.lineTo(i * 3.5, -19); } g.stroke();
    g.restore();
  }
  g.restore();
  // dirt in front so he looks half buried
  g.fillStyle = '#8a6a48';
  g.beginPath(); g.ellipse(0, 26, 44, 10, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#6b4e33';
  for (const [dx, dy, r] of [[-26, 24, 4], [-8, 30, 3], [18, 25, 4], [32, 29, 3]]) { g.beginPath(); g.arc(dx, dy, r, 0, Math.PI * 2); g.fill(); }
  if (scratch > 0.2) {
    g.fillStyle = `rgba(140,110,75,${0.7 * scratch})`;
    for (let i = 0; i < 4; i++) { const ph = (time * 3 + i / 4) % 1; g.beginPath(); g.arc(-20 + i * 14, 14 - ph * 20, 3 + ph * 3, 0, Math.PI * 2); g.fill(); }
  }
  g.restore();
}
function drawBoat(g, x, y, s, bob = 0) {
  const rock = Math.sin(bob * 1.5) * 0.05;
  g.save(); g.translate(x, y + Math.sin(bob * 1.5) * 1.5); g.rotate(rock); g.scale(s, s);
  g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.ellipse(0, 6, 46, 7, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#8a5a2e';
  g.beginPath(); g.moveTo(-44, -10); g.lineTo(44, -10); g.quadraticCurveTo(38, 8, 26, 8); g.lineTo(-26, 8); g.quadraticCurveTo(-38, 8, -44, -10); g.closePath(); g.fill();
  g.fillStyle = '#a8743f'; g.fillRect(-44, -12, 88, 5);
  g.strokeStyle = 'rgba(60,35,15,.5)'; g.lineWidth = 1.2;
  g.beginPath(); g.moveTo(-36, -2); g.lineTo(36, -2); g.moveTo(-30, 4); g.lineTo(30, 4); g.stroke();
  g.restore();
}
function drawLoo(g, x, y, s, t = null, time = 0) {
  // a fat loo roll standing up, with a little face; it puffs up just before it bursts
  const swell = t ? 1 + (1 - t.fuse / LOO.fuse) * 0.25 : 1;
  const wob = t ? Math.sin(time * 40) * (1 - t.fuse / LOO.fuse) * 3 : 0;
  g.save(); g.translate(x + wob, y); g.scale(s * swell, s * swell);
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, 26, 24, 6, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#f7f4ee'; roundRect(g, -20, -20, 40, 46, 6); g.fill();
  g.fillStyle = '#e4ddcf'; g.fillRect(-20, 6, 40, 3);
  g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(0, -20, 20, 7, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#c9a77a'; g.beginPath(); g.ellipse(0, -20, 8, 3, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#8d6e48'; g.beginPath(); g.ellipse(0, -20, 5, 1.8, 0, 0, Math.PI * 2); g.fill();
  // loose sheet hanging down the front
  g.fillStyle = '#ffffff'; g.strokeStyle = '#ddd6c6'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(8, -14); g.lineTo(18, -14); g.lineTo(19, 20); g.lineTo(9, 22); g.closePath(); g.fill(); g.stroke();
  g.setLineDash([2, 2]); g.beginPath(); g.moveTo(9, 4); g.lineTo(19, 3); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#2a2a2a'; g.beginPath(); g.arc(-8, -4, 2.4, 0, Math.PI * 2); g.arc(2, -4, 2.4, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#2a2a2a'; g.lineWidth = 1.6; g.lineCap = 'round';
  g.beginPath(); g.arc(-3, 2, 4, 0.2, Math.PI - 0.2); g.stroke();
  g.fillStyle = 'rgba(255,140,160,.45)'; g.beginPath(); g.ellipse(-13, 3, 3, 2, 0, 0, Math.PI * 2); g.ellipse(7, 3, 3, 2, 0, 0, Math.PI * 2); g.fill();
  g.restore();
}
function drawCobra(g, x, y, s, t = null, time = 0) {
  // the cobra IS the magnet: a red snake curled into a horseshoe that opens toward the zombies,
  // with a silver tail tip on the bottom end and his head (with a silver hood) on the top end
  const bob = Math.sin(time * 2 + (t ? t.bob : 0)) * 1.5, lunge = t && t.pullAnim > 0 ? Math.sin(t.pullAnim / 0.35 * Math.PI) * 5 : 0;
  const tx = COBRA_TIP.x, ty = COBRA_TIP.y, R = 20, W = 15;
  g.save(); g.translate(x, y + bob); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(-2, 32 - bob, 30, 6, 0, 0, Math.PI * 2); g.fill();
  if (t && (t.pulling || t.pullAnim > 0)) {
    // magnetic waves pouring out of the gap
    g.strokeStyle = `rgba(120,200,255,${0.5 + 0.3 * Math.sin(time * 20)})`; g.lineWidth = 2.5;
    for (let i = 0; i < 3; i++) { const rr = 10 + ((time * 40 + i * 10) % 30); g.beginPath(); g.arc(tx - 4, ty, rr, -0.8, 0.8); g.stroke(); }
  }
  // the horseshoe body: bottom arm (tail) -> round back -> top arm (neck)
  const body = () => { g.beginPath(); g.moveTo(tx - 6, ty + R); g.lineTo(-8, ty + R); g.arc(-8, ty, R, Math.PI / 2, -Math.PI / 2); g.lineTo(lunge + tx - 14, ty - R); };
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.strokeStyle = '#9e2626'; g.lineWidth = W + 3; body(); g.stroke();
  g.strokeStyle = '#d63a3a'; g.lineWidth = W; body(); g.stroke();
  // belly scales along the inside of the curve
  g.strokeStyle = '#f0b8a8'; g.lineWidth = 3; g.setLineDash([4, 4]);
  g.beginPath(); g.moveTo(tx - 10, ty + R - 5); g.lineTo(-8, ty + R - 5); g.arc(-8, ty, R - 5, Math.PI / 2, -Math.PI / 2); g.lineTo(lunge + tx - 16, ty - R + 5); g.stroke();
  g.setLineDash([]);
  // silver tail tip: the bottom pole
  g.fillStyle = '#d7dde2'; roundRect(g, tx - 13, ty + R - W / 2, 15, W, 4); g.fill();
  g.fillStyle = '#aeb5bc'; g.fillRect(tx - 13, ty + R - W / 2, 3, W);
  // head on the top end: silver hood (the top pole), red face, looking at the zombies
  g.save(); g.translate(lunge, 0);
  g.fillStyle = '#d7dde2'; g.beginPath(); g.ellipse(tx - 12, ty - R - 2, 9, 13, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#aeb5bc'; g.beginPath(); g.ellipse(tx - 12, ty - R - 2, 4, 9, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#d63a3a'; g.beginPath(); g.ellipse(tx - 4, ty - R - 3, 10, 7.5, 0.05, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(tx - 3, ty - R - 6, 3, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1d1d1d'; g.beginPath(); g.arc(tx - 2, ty - R - 6, 1.6, 0, Math.PI * 2); g.fill();
  // flicking forked tongue
  if (Math.sin(time * 3 + (t ? t.bob : 0)) > 0.4) {
    g.strokeStyle = '#7a1f3a'; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(tx + 5, ty - R - 1); g.lineTo(tx + 11, ty - R - 1); g.lineTo(tx + 14, ty - R - 4); g.moveTo(tx + 11, ty - R - 1); g.lineTo(tx + 14, ty - R + 2); g.stroke();
  }
  g.restore();
  // whatever he's holding, stuck in the gap between his two ends (blinking when he's about to drop it)
  if (t && t.holding && t.pullAnim <= 0 && !(t.hold < 1.5 && Math.sin(time * 18) < 0)) {
    g.save(); g.translate(tx - 2, ty);
    if (t.holding === 'can') { g.scale(0.8, 0.8); drawCan(g, 0, 13, 1); }
    else if (t.holding === 'helm' && g === ctx) { g.scale(0.8, 0.8); drawKnightHelm(1, 0); }
    else if (t.holding === 'car') {
      g.fillStyle = '#c0392b'; roundRect(g, -12, -12, 18, 10, 3); g.fill(); roundRect(g, -10, 4, 14, 10, 3); g.fill();
      g.fillStyle = '#222'; g.beginPath(); g.arc(6, 0, 8, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#9aa3a8'; g.beginPath(); g.arc(6, 0, 3.5, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(191,227,242,.9)'; g.beginPath(); g.moveTo(-14, 6); g.lineTo(-10, -2); g.lineTo(-6, 6); g.closePath(); g.fill();
    }
    g.restore();
  }
  g.restore();
}
function drawBattery(g, x, y, s, t = null, time = 0) {
  // a plain battery while it recharges; once charged, lightning crackles off its metal parts
  const charged = !t || t.cool <= 0;
  const shake = t && t.nope > 0 ? Math.sin(time * 60) * 2 : 0;
  g.save(); g.translate(x + shake, y); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(0, 32, 24, 6, 0, 0, Math.PI * 2); g.fill();
  if (charged) {
    const gr = g.createRadialGradient(0, -6, 4, 0, -6, 46);
    gr.addColorStop(0, `rgba(140,255,140,${0.25 + 0.12 * Math.sin(time * 6)})`); gr.addColorStop(1, 'rgba(140,255,140,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, -6, 46, 0, Math.PI * 2); g.fill();
  }
  // body: black with a copper top, metal cap and metal base
  g.fillStyle = '#26292f'; roundRect(g, -17, -30, 34, 58, 5); g.fill();
  g.fillStyle = '#c9963a'; roundRect(g, -17, -30, 34, 18, 5); g.fill();
  g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(-13, -26, 4, 50);
  g.fillStyle = '#aeb5bc'; roundRect(g, -17, 24, 34, 7, 3); g.fill();
  g.fillStyle = '#aeb5bc'; roundRect(g, -7, -39, 14, 10, 2); g.fill();
  g.fillStyle = '#d7dde2'; g.fillRect(-5, -38, 4, 8);
  g.fillStyle = '#2a1e05'; g.font = 'bold 12px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('+', 0, -21);
  // little face
  g.fillStyle = '#fff'; g.beginPath(); g.arc(-6, -2, 2.4, 0, Math.PI * 2); g.arc(6, -2, 2.4, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 1.6; g.lineCap = 'round';
  g.beginPath(); charged ? g.arc(0, 2, 4.5, 0.2, Math.PI - 0.2) : (g.moveTo(-3, 5), g.lineTo(3, 5)); g.stroke();
  if (charged) {
    // lightning jumping off the metal terminal and the metal base
    const seed = Math.floor(time * 14);
    const rnd = n => { const v = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453; return v - Math.floor(v); };
    const sources = [[0, -39, -Math.PI / 2], [-6, -38, -Math.PI * 0.75], [6, -38, -Math.PI * 0.25], [-16, 28, Math.PI * 0.85], [16, 28, Math.PI * 0.15]];
    g.lineJoin = 'round';
    sources.forEach(([sx, sy, ang], i) => {
      if (rnd(i) < 0.35) return; // they flicker on and off
      const len = 14 + rnd(i + 10) * 12, pts = [[sx, sy]];
      for (let j = 1; j <= 4; j++) {
        const f = j / 4, a2 = ang + (rnd(i * 7 + j) - 0.5) * 1.2;
        pts.push([sx + Math.cos(ang) * len * f + Math.cos(a2 + Math.PI / 2) * 4 * (rnd(j + i) - 0.5) * 2, sy + Math.sin(ang) * len * f + Math.sin(a2 + Math.PI / 2) * 4 * (rnd(j * 3 + i) - 0.5) * 2]);
      }
      for (const [w, col] of [[5, 'rgba(140,255,140,.35)'], [2, '#b6ffb6'], [0.9, '#ffffff']]) {
        g.strokeStyle = col; g.lineWidth = w; g.beginPath(); pts.forEach(([px, py], k) => k ? g.lineTo(px, py) : g.moveTo(px, py)); g.stroke();
      }
    });
  }
  g.restore();
}
function drawTesla(g, x, y, s, t = null, time = 0) {
  // a giant Tesla coil in the same simple, flat style as the other defenders
  // (x, y) is the centre of its two tiles at ground level
  const charged = !t || t.cool <= 0;
  const shake = t && t.nope > 0 ? Math.sin(time * 60) * 2 : 0;
  const bob = Math.sin(time * 2) * 1;
  g.save(); g.translate(x + shake, y); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, 0, 60, 8, 0, 0, Math.PI * 2); g.fill();
  const topY = -76 + bob;
  if (charged) {
    g.fillStyle = `rgba(150,200,255,${0.22 + 0.1 * Math.sin(time * 6)})`;
    g.beginPath(); g.ellipse(0, topY, 84, 34, 0, 0, Math.PI * 2); g.fill();
  }
  // chunky wooden base
  g.fillStyle = '#a8743f'; roundRect(g, -50, -16, 100, 14, 6); g.fill();
  g.fillStyle = '#c99256'; roundRect(g, -50, -20, 100, 10, 5); g.fill();
  // red coil column with a few stripes
  g.fillStyle = '#c62f35'; roundRect(g, -16, topY + 4, 32, -16 - topY, 6); g.fill();
  g.fillStyle = '#e8575d'; g.fillRect(-10, topY + 8, 5, -28 - topY);
  g.fillStyle = 'rgba(0,0,0,.15)';
  for (let yy = topY + 16; yy < -24; yy += 10) g.fillRect(-16, yy, 32, 3);
  // little face on the coil
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(-6, -44 + bob * 0.5, 3, 0, Math.PI * 2); g.arc(6, -44 + bob * 0.5, 3, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#2a0a0a';
  g.beginPath(); g.arc(-5.5, -43.5 + bob * 0.5, 1.5, 0, Math.PI * 2); g.arc(6.5, -43.5 + bob * 0.5, 1.5, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 1.8; g.lineCap = 'round';
  g.beginPath(); charged ? g.arc(0, -39 + bob * 0.5, 4, 0.2, Math.PI - 0.2) : (g.moveTo(-3, -36 + bob * 0.5), g.lineTo(3, -36 + bob * 0.5)); g.stroke();
  // big flat silver torus
  g.fillStyle = '#8a939b'; g.beginPath(); g.ellipse(0, topY + 3, 58, 14, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#c9d0d6'; g.beginPath(); g.ellipse(0, topY, 58, 12, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#9aa2aa'; g.beginPath(); g.ellipse(0, topY - 1, 20, 4.5, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.ellipse(-28, topY - 5, 16, 2.6, -0.05, 0, Math.PI * 2); g.fill();
  if (charged) {
    // arcs crackling off the torus
    const seed = Math.floor(time * 16);
    const rnd = n => { const v = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453; return v - Math.floor(v); };
    g.lineJoin = 'round';
    for (let i = 0; i < 6; i++) {
      if (rnd(i) < 0.35) continue;
      const side = rnd(i + 40) < 0.5 ? -1 : 1;
      const sx = side * (34 + rnd(i + 50) * 22), sy = topY + (rnd(i + 60) - 0.5) * 8;
      const ang = side < 0 ? Math.PI + (rnd(i + 20) - 0.6) * 1.4 : (rnd(i + 20) - 0.4) * -1.4;
      const len = 16 + rnd(i + 10) * 20, pts = [[sx, sy]];
      for (let j = 1; j <= 4; j++) { const f = j / 4; pts.push([sx + Math.cos(ang) * len * f + (rnd(i * 5 + j) - 0.5) * 9, sy + Math.sin(ang) * len * f + (rnd(i * 3 + j) - 0.5) * 9]); }
      for (const [w, col] of [[5, 'rgba(150,200,255,.35)'], [2, '#bcdcff'], [0.9, '#ffffff']]) {
        g.strokeStyle = col; g.lineWidth = w; g.beginPath(); pts.forEach(([px, py], k) => k ? g.lineTo(px, py) : g.moveTo(px, py)); g.stroke();
      }
    }
  }
  g.restore();
}
function drawBatteryZap(r, c, t) {
  if (!t.zap) return;
  const k = t.zap.t / 0.3, x0 = c * CELL + 50, y0 = r * CELL + 18, x1 = t.zap.x, y1 = t.zap.y;
  ctx.save(); ctx.globalAlpha = 1 - k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const pts = [[x0, y0]];
  for (let i = 1; i < 8; i++) { const f = i / 8; pts.push([x0 + (x1 - x0) * f + Math.sin(i * 7.3 + t.zap.t * 40) * 10, y0 + (y1 - y0) * f + Math.cos(i * 5.1 + t.zap.t * 40) * 12]); }
  pts.push([x1, y1]);
  for (const [w, col] of [[10, 'rgba(120,255,120,.35)'], [4, '#9dff9d'], [1.6, '#ffffff']]) {
    ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.stroke();
  }
  ctx.restore();
}
function drawShovel(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(-0.6);
  g.fillStyle = '#8a5a30'; g.fillRect(-3, -40, 6, 46);
  g.fillStyle = '#5c3a1c'; g.fillRect(-9, -46, 18, 7);
  g.fillStyle = '#b8c0c6';
  g.beginPath(); g.moveTo(-12, 6); g.lineTo(12, 6); g.lineTo(10, 26); g.quadraticCurveTo(0, 38, -10, 26); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(-7, 9, 3, 16);
  g.restore();
}

function drawLobster(g, x, y, s, bob, snap = 0, reach = 0) {
  g.save(); g.translate(x, y + Math.sin(bob) * 1.2); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, 30, 32, 7, 0, 0, Math.PI * 2); g.fill();
  const red = '#2f7de0', dark = '#1d4f9a', light = '#8cc0ff';
  // tail fan (behind, to the left)
  g.fillStyle = dark;
  g.beginPath(); g.moveTo(-26, 14); g.lineTo(-44, 4); g.lineTo(-46, 18); g.lineTo(-44, 30); g.lineTo(-26, 22); g.closePath(); g.fill();
  // legs
  g.strokeStyle = dark; g.lineWidth = 3; g.lineCap = 'round';
  for (let i = 0; i < 4; i++) { const lx = -14 + i * 9; g.beginPath(); g.moveTo(lx, 20); g.lineTo(lx - 4, 30); g.stroke(); }
  // body segments
  g.fillStyle = red;
  g.beginPath(); g.ellipse(-16, 16, 14, 10, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(4, 10, 20, 15, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = dark; g.lineWidth = 2;
  g.beginPath(); g.moveTo(-20, 8); g.lineTo(-20, 24); g.moveTo(-11, 7); g.lineTo(-11, 25); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(0, 2, 10, 4, -0.2, 0, Math.PI * 2); g.fill();
  // little bow tie
  g.fillStyle = '#e2402f';
  g.beginPath(); g.moveTo(18, 14); g.lineTo(11, 9); g.lineTo(11, 19); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(18, 14); g.lineTo(25, 9); g.lineTo(25, 19); g.closePath(); g.fill();
  g.fillStyle = '#a92a1f'; g.beginPath(); g.arc(18, 14, 2.5, 0, Math.PI * 2); g.fill();
  // eye stalks and antennae
  g.strokeStyle = dark; g.lineWidth = 3;
  g.beginPath(); g.moveTo(14, -2); g.lineTo(16, -14); g.moveTo(22, 0); g.lineTo(26, -12); g.stroke();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(16, -16, 4.5, 0, Math.PI * 2); g.arc(26, -14, 4.5, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(17.5, -16, 2.2, 0, Math.PI * 2); g.arc(27.5, -14, 2.2, 0, Math.PI * 2); g.fill();
  g.strokeStyle = light; g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(20, -2); g.quadraticCurveTo(40, -34, 58, -26); g.moveTo(24, 0); g.quadraticCurveTo(46, -22, 62, -12); g.stroke();
  // claws: back claw resting, front claw shoots forward on a pinch
  const drawClaw = (cx, cy, size, open, color) => {
    g.save(); g.translate(cx, cy); g.scale(size, size);
    g.fillStyle = color;
    g.beginPath(); g.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2); g.fill();
    g.save(); g.rotate(-open);
    g.beginPath(); g.moveTo(6, -6); g.quadraticCurveTo(22, -12, 26, -2); g.quadraticCurveTo(18, -2, 8, -1); g.closePath(); g.fill();
    g.restore();
    g.save(); g.rotate(open * 0.6);
    g.beginPath(); g.moveTo(6, 6); g.quadraticCurveTo(22, 10, 24, 2); g.quadraticCurveTo(16, 2, 8, 2); g.closePath(); g.fill();
    g.restore();
    g.restore();
  };
  g.strokeStyle = dark; g.lineWidth = 5;
  g.beginPath(); g.moveTo(16, 18); g.lineTo(30, 24); g.stroke();
  drawClaw(36, 24, 0.85, 0.25, dark);
  const ext = snap * reach;
  g.strokeStyle = red; g.lineWidth = 6;
  g.beginPath(); g.moveTo(18, 6); g.lineTo(30 + ext, 4); g.stroke();
  drawClaw(38 + ext, 4, 1.15, snap > 0.6 ? 0.05 : 0.4, red);
  g.restore();
}

function drawBeam(c, r, t) {
  if (t.beam <= 0) return;
  const k = t.beam / 0.3;
  const x0 = c * CELL + 46 + 44, y0 = r * CELL + 62 - 6;
  ctx.save();
  ctx.globalAlpha = k;
  ctx.fillStyle = 'rgba(255,77,94,.35)'; ctx.fillRect(x0, y0 - 9 * k, board.width - x0 + 20, 18 * k);
  ctx.fillStyle = 'rgba(255,140,150,.8)'; ctx.fillRect(x0, y0 - 4 * k, board.width - x0 + 20, 8 * k);
  ctx.fillStyle = '#fff'; ctx.fillRect(x0, y0 - 1.5, board.width - x0 + 20, 3);
  ctx.restore();
}

function drawLash(c, r, t) {
  if (!t.lash) return;
  const hx = c * CELL + 46 + 22, hy = r * CELL + 62 - 34;
  const k = t.lash.t / 0.22, tx = t.lash.x, ty = r * CELL + 40;
  const wave = Math.sin(k * Math.PI) * 18;
  ctx.save();
  ctx.globalAlpha = 1 - k * 0.6;
  ctx.strokeStyle = '#7a4f26'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(hx, hy);
  ctx.bezierCurveTo(hx + (tx - hx) * 0.3, hy - 30 - wave, hx + (tx - hx) * 0.7, ty + wave, tx, ty);
  ctx.stroke();
  ctx.restore();
}

function drawBoulder(g, x, y, s = 1, spin = 0) {
  g.save(); g.translate(x, y); g.rotate(spin); g.scale(s, s);
  g.fillStyle = '#7d756c';
  g.beginPath(); g.moveTo(-16, -4); g.lineTo(-10, -14); g.lineTo(4, -16); g.lineTo(15, -8); g.lineTo(17, 4); g.lineTo(9, 14); g.lineTo(-8, 15); g.lineTo(-17, 6); g.closePath(); g.fill();
  g.fillStyle = '#9d958b'; g.beginPath(); g.ellipse(-4, -7, 7, 4, -0.4, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#5b544c'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(2, -2); g.lineTo(8, 4); g.lineTo(4, 10); g.stroke();
  g.restore();
}
function drawChog(g, x, y, s, bob, size = 0, stage = 0) {
  const sc = 0.55 + size * 0.65; // tiny -> humongous
  g.save(); g.translate(x, y); g.scale(s * sc, s * sc);
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, 22, 30, 6, 0, 0, Math.PI * 2); g.fill();
  // when it's at full size it glows a warning red
  if (stage === 2) {
    const pulse = 0.35 + 0.25 * Math.sin(bob * 5);
    const gr = g.createRadialGradient(0, 0, 6, 0, 0, 52);
    gr.addColorStop(0, `rgba(255,80,40,${pulse})`); gr.addColorStop(1, 'rgba(255,80,40,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 52, 0, Math.PI * 2); g.fill();
  }
  const breathe = 1 + Math.sin(bob * 2) * 0.03;
  g.scale(breathe, 2 - breathe);
  // spikes all over the back
  g.fillStyle = '#5a3d24';
  for (let i = 0; i < 11; i++) {
    const a = Math.PI + (i / 10) * Math.PI * 0.95 + 0.05, wig = Math.sin(bob * 3 + i) * 0.04;
    g.save(); g.translate(Math.cos(a) * 20 - 3, Math.sin(a) * 15 + 6); g.rotate(a + Math.PI / 2 + wig);
    g.beginPath(); g.moveTo(-4, 2); g.lineTo(0, -15); g.lineTo(4, 2); g.closePath(); g.fill();
    g.restore();
  }
  // body
  g.fillStyle = '#7a5434';
  g.beginPath(); g.ellipse(-3, 6, 22, 16, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#c99a6b';
  g.beginPath(); g.ellipse(4, 12, 15, 9, 0, 0, Math.PI * 2); g.fill();
  // face: pointy snout to the right
  g.fillStyle = '#e8c49a';
  g.beginPath(); g.moveTo(8, -2); g.quadraticCurveTo(28, 2, 30, 8); g.quadraticCurveTo(22, 16, 8, 14); g.closePath(); g.fill();
  g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(30, 8, 2.6, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(15, 4, 2.2, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(15.7, 3.3, 0.8, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,120,140,.5)'; g.beginPath(); g.ellipse(17, 10, 3, 2, 0, 0, Math.PI * 2); g.fill();
  if (stage === 2) { g.strokeStyle = '#1a1a1a'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(11, 0); g.lineTo(18, 1.5); g.stroke(); }
  // little feet
  g.fillStyle = '#5a3d24';
  g.beginPath(); g.ellipse(-10, 21, 4, 2.5, 0, 0, Math.PI * 2); g.ellipse(8, 21, 4, 2.5, 0, 0, Math.PI * 2); g.fill();
  g.restore();
}
function drawSnapper(g, x, y, s, bob, t = null, big = false) {
  // based on the player's sketch: open = two pink-purple lobes with black bristles,
  // chewing = a flat green closed head on an L-shaped stem with two eye bumps
  const chewing = !!(t && t.mode === 'chew');
  const openK = t ? t.openK : 1;
  const lunge = 0, reach = t ? t.stretch || 0 : 0;
  // a stretchy neck from the base out to wherever the head is
  const neck = (hx, hy) => {
    g.strokeStyle = ink; g.lineWidth = 11; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-1, 28); g.quadraticCurveTo(-4, hy + 10, hx, hy); g.stroke();
    g.strokeStyle = green; g.lineWidth = 6;
    g.beginPath(); g.moveTo(-1, 28); g.quadraticCurveTo(-4, hy + 10, hx, hy); g.stroke();
  };
  const green = '#a5d04a', ink = '#111';
  g.save(); g.translate(x, y); g.scale(s, s);
  g.lineJoin = 'round'; g.lineCap = 'round';
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, 31, 22, 5, 0, 0, Math.PI * 2); g.fill();
  if (openK < 0.3) {
    // idle: slow breathing and a little look-around; chewing: big, slow, wobbly munches
    const breath = Math.sin(bob * 0.9);
    const chewPhase = bob * 1.15;                       // slower than before
    const m = chewing ? (1 - Math.cos(chewPhase * 2)) / 2 : 0; // 0..1 smooth chomp
    const tilt = chewing ? Math.sin(chewPhase) * 0.16 : Math.sin(bob * 0.55) * 0.1;
    const hop = chewing ? -m * 4 : breath * 2.2;
    const blink = !chewing && ((bob * 0.45) % 5) < 0.18;
    // L-shaped stem: up from the ground, then the head sticks out to the right
    g.fillStyle = green; g.strokeStyle = ink; g.lineWidth = 3;
    if (reach > 3) { neck(reach - 10, -6); g.translate(reach, 0); g.lineWidth = 3; g.strokeStyle = ink; g.fillStyle = green; }
    else {
      // the stem bends a little with each chew
      const bend = chewing ? Math.sin(chewPhase) * 3 : breath * 0.8;
      g.beginPath(); g.moveTo(-14, 30); g.lineTo(-14 + bend, -4 + hop); g.lineTo(-5 + bend, -4 + hop); g.lineTo(-5, 30); g.closePath(); g.fill(); g.stroke();
    }
    g.save();
    g.translate(-10, -6 + hop); g.rotate(tilt);
    // squash and stretch the whole head as it chomps
    g.scale(1 + m * 0.14, 1 - m * 0.12);
    g.translate(10, 6);
    g.fillStyle = green; g.strokeStyle = ink; g.lineWidth = 3;
    // flat closed head: upper and lower jaw with a dark seam between them
    const gape = chewing ? (1 - m) * 3 : 0;
    roundRect(g, -16, -16 - gape, 52, 13, 6); g.fill(); g.stroke();
    roundRect(g, -14, -3 + gape, 48, 8 + m * 2, 4); g.fill(); g.stroke();
    if (big) {
      // big teeth poking out over the closed mouth
      g.fillStyle = '#fffbe8'; g.strokeStyle = ink; g.lineWidth = 1.6;
      for (const tx of [0, 11, 22, 32]) { g.beginPath(); g.moveTo(tx, -4); g.lineTo(tx + 3.5, 5 + gape); g.lineTo(tx + 7, -4); g.closePath(); g.fill(); g.stroke(); }
      for (const tx of [5, 16, 27]) { g.beginPath(); g.moveTo(tx, -2 + gape); g.lineTo(tx + 3.5, -11 - gape * 0.5); g.lineTo(tx + 7, -2 + gape); g.closePath(); g.fill(); g.stroke(); }
      g.fillStyle = green; g.strokeStyle = ink; g.lineWidth = 3;
    }

    g.lineWidth = 3.5; g.beginPath(); g.moveTo(-15, -3); g.quadraticCurveTo(12, -3 + (chewing ? m * 3 : 0), 38, -3); g.stroke();
    // eye bumps: they bob, blink, and squeeze shut on each chomp
    for (const [i, ex] of [[0, 6], [1, 20]]) {
      const eyeY = -19 - gape + (chewing ? Math.sin(chewPhase * 2 + i) * 1.5 : Math.sin(bob * 0.9 + i) * 0.8);
      g.fillStyle = green; g.lineWidth = 2.5;
      g.beginPath(); g.ellipse(ex, eyeY, 5, 7, 0, Math.PI, 0); g.closePath(); g.fill(); g.stroke();
      if (blink || m > 0.65) { g.lineWidth = 2; g.beginPath(); g.moveTo(ex - 3, eyeY - 2); g.lineTo(ex + 3, eyeY - 2); g.stroke(); }
      else {
        const look = chewing ? 0 : Math.sin(bob * 0.35) * 1.2;
        g.fillStyle = ink; g.beginPath(); g.ellipse(ex + look, eyeY - 2, 1.4, 3, 0, 0, Math.PI * 2); g.fill();
      }
    }
    g.restore();
    if (chewing) {
      // crumbs flying off now and then
      for (let i = 0; i < 3; i++) {
        const q = (chewPhase / Math.PI + i / 3) % 1;
        if (q > 0.5) continue;
        g.fillStyle = `rgba(90,110,60,${1 - q * 2})`;
        g.beginPath(); g.arc(38 + q * 18 + i * 3, -2 + q * 22 - Math.sin(q * Math.PI) * 10, 2, 0, Math.PI * 2); g.fill();
      }
      // chew timer ring
      const k = 1 - t.chew / SNAPPER.chew;
      g.lineWidth = 4; g.strokeStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.arc(-24, -30, 7, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = green; g.beginPath(); g.arc(-24, -30, 7, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); g.stroke();
    }
  } else {
    // straight green stem
    const sway = reach > 3 ? 0 : Math.sin(bob * 1.1) * 3.5;
    if (reach > 3) neck(reach - 4, -12);
    else {
      g.fillStyle = green; g.strokeStyle = ink; g.lineWidth = 3;
      g.beginPath(); g.moveTo(-6, 30); g.lineTo(-5 + sway, -2); g.lineTo(3 + sway, -2); g.lineTo(4, 30); g.closePath(); g.fill(); g.stroke();
    }
    g.save(); g.translate(reach + sway - 2, -12 + Math.sin(bob * 1.6) * 1.5); g.rotate(reach > 3 ? 0 : Math.sin(bob * 1.1) * 0.06);
    const open = ((openK - 0.3) / 0.7) * (0.22 + 0.09 * Math.sin(bob * 2.4));
    // a drip of drool from the mouth
    if (reach <= 3 && openK > 0.8) {
      const dq = (bob * 0.4) % 1;
      g.fillStyle = 'rgba(200,240,255,.85)';
      g.beginPath(); g.ellipse(30, 4 + dq * 18, 2, 3 + dq * 2, 0, 0, Math.PI * 2); g.fill();
    }
    const lobe = (dir) => {
      g.save(); g.rotate(-dir * open);
      // chunky rounded lobe, like the sketch
      const path = () => {
        g.beginPath();
        g.moveTo(-6, -dir * 1);
        g.bezierCurveTo(-10, -dir * 18, 6, -dir * 26, 22, -dir * 25);
        g.bezierCurveTo(38, -dir * 24, 44, -dir * 16, 42, -dir * 6);
        g.bezierCurveTo(40, -dir * 1, 30, dir * 1, 18, dir * 0.5);
        g.closePath();
      };
      // black bristles all round the outer edge
      g.strokeStyle = ink; g.lineWidth = 3.2;
      const pts = [[-8, 10, -14, 14], [0, 21, -2, 30], [10, 25, 9, 34], [20, 26, 21, 36], [30, 25, 34, 33], [39, 20, 46, 26], [43, 11, 52, 13]];
      if (big) {
        // Ultima Snapper: big white teeth round the outside instead of thin bristles
        g.fillStyle = '#fffbe8'; g.lineWidth = 2;
        pts.forEach(([ax, ay, bx, by]) => {
          const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len * 4.5, ny = dx / len * 4.5;
          const tipX = ax + dx * 1.5, tipY = ay + dy * 1.5;
          g.beginPath(); g.moveTo(ax - nx, -dir * (ay - ny)); g.lineTo(tipX, -dir * tipY); g.lineTo(ax + nx, -dir * (ay + ny)); g.closePath();
          g.fill(); g.stroke();
        });
      } else {
        pts.forEach(([ax, ay, bx, by], i) => {
          const q = Math.sin(bob * 3 + i * 0.9) * 1.6;
          g.beginPath(); g.moveTo(ax, -dir * ay); g.lineTo(bx + q, -dir * (by + q * 0.5)); g.stroke();
        });
      }
      const gr = g.createLinearGradient(0, -dir * 25, 0, 0);
      gr.addColorStop(0, '#b65ac6'); gr.addColorStop(1, '#c8383e');
      g.fillStyle = gr; path(); g.fill();
      g.strokeStyle = ink; g.lineWidth = 3.5; path(); g.stroke();
      g.restore();
    };
    lobe(-1); lobe(1);
    g.restore();
  }
  g.restore();
}
function drawDigger(g, x, y, s, bob, t = null) {
  // a little yellow excavator: tracks, cab, and an arm with a bucket
  const has = !t || t.boulder, heave = t ? t.heave || 0 : 0;
  const yellow = '#f2b51d', yellowDark = '#c98d0b', steel = '#3d4249';
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(0, 31, 36, 6, 0, 0, Math.PI * 2); g.fill();
  // tracks
  g.fillStyle = steel; roundRect(g, -30, 16, 52, 14, 7); g.fill();
  g.fillStyle = '#6b727a';
  for (const wx of [-22, -10, 2, 14]) { g.beginPath(); g.arc(wx, 23, 4, 0, Math.PI * 2); g.fill(); }
  g.strokeStyle = '#22262b'; g.lineWidth = 1.5;
  const tread = (bob * 4) % 6;
  for (let i = -30; i < 22; i += 6) { g.beginPath(); g.moveTo(i + tread, 16); g.lineTo(i + tread, 18); g.stroke(); }
  // body with counterweight
  const rumble = has ? Math.sin(bob * 6) * 0.4 : Math.sin(bob * 12) * 0.8;
  g.save(); g.translate(0, rumble);
  g.fillStyle = yellowDark; roundRect(g, -30, 2, 18, 14, 4); g.fill();
  g.fillStyle = yellow; roundRect(g, -24, -2, 40, 18, 4); g.fill();
  g.fillStyle = '#2b2b2b'; g.fillRect(-24, 10, 40, 3);
  // cab with a window
  g.fillStyle = yellow; roundRect(g, -16, -24, 22, 24, 4); g.fill();
  g.fillStyle = '#a8dcf0'; roundRect(g, -12, -20, 14, 12, 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(-10, -19, 3, 10);
  // exhaust pipe with a puff now and then
  g.fillStyle = steel; g.fillRect(-22, -14, 3, 12);
  const ph = (bob * 0.5) % 1;
  g.fillStyle = `rgba(90,90,90,${0.45 * (1 - ph)})`; g.beginPath(); g.arc(-20, -18 - ph * 14, 2.5 + ph * 4, 0, Math.PI * 2); g.fill();
  // arm: boom from the body, stick, then the bucket
  const dig = has ? 0 : Math.sin(bob * 2.2);
  const boomA = has ? -1.05 - heave * 0.5 : -0.35 + dig * 0.15;
  const stickA = has ? 1.6 - heave * 0.9 : 1.9 + dig * 0.25;
  g.save(); g.translate(12, -4); g.rotate(boomA);
  g.fillStyle = yellow; roundRect(g, -3, -4, 34, 8, 3); g.fill();
  g.fillStyle = steel; g.beginPath(); g.arc(0, 0, 3, 0, Math.PI * 2); g.fill();
  g.translate(30, 0); g.rotate(stickA);
  g.fillStyle = yellowDark; roundRect(g, -3, -3, 26, 6, 3); g.fill();
  g.fillStyle = steel; g.beginPath(); g.arc(0, 0, 2.5, 0, Math.PI * 2); g.fill();
  g.translate(24, 0); g.rotate(has ? -1.9 : -1.2 + dig * 0.3);
  // bucket with teeth
  g.fillStyle = steel;
  g.beginPath(); g.moveTo(0, -4); g.lineTo(14, -6); g.quadraticCurveTo(16, 6, 6, 10); g.lineTo(0, 4); g.closePath(); g.fill();
  g.fillStyle = '#9aa1a8';
  for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(14, -6 + i * 4); g.lineTo(18, -5 + i * 4); g.lineTo(14, -3 + i * 4); g.fill(); }
  if (has) drawBoulder(g, 8, -12, 0.75);
  g.restore();
  g.restore();
  if (!has) {
    // dirt flying while it digs, plus a ring showing progress to the next boulder
    const k = t ? 1 - t.dig / DIGGER.digTime : 0;
    g.fillStyle = 'rgba(110,80,50,.8)';
    for (let i = 0; i < 4; i++) { const q = (bob * 0.9 + i / 4) % 1; g.beginPath(); g.arc(30 + i * 4 + q * 8, 24 - q * 22, 2.5 + (i % 2), 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#6b4e33'; g.beginPath(); g.ellipse(36, 28, 10, 4, 0, Math.PI, 0); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 4; g.beginPath(); g.arc(-28, -28, 8, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = '#f2c230'; g.beginPath(); g.arc(-28, -28, 8, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); g.stroke();
  }
  g.restore();
}
function drawLavaRock(g, x, y, spin, s = 1) {
  // glow and a little ember trail
  const gr = g.createRadialGradient(x, y, 2, x, y, 22 * s);
  gr.addColorStop(0, 'rgba(255,170,60,.7)'); gr.addColorStop(1, 'rgba(255,90,30,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, 22 * s, 0, Math.PI * 2); g.fill();
  for (let i = 1; i <= 3; i++) {
    g.fillStyle = `rgba(255,${140 - i * 25},40,${0.6 - i * 0.15})`;
    g.beginPath(); g.arc(x - i * 9 * s, y + Math.sin(spin + i) * 3, (5 - i) * s, 0, Math.PI * 2); g.fill();
  }
  g.save(); g.translate(x, y); g.rotate(spin); g.scale(s, s);
  g.fillStyle = '#3a1a10';
  g.beginPath(); g.moveTo(-9, -3); g.lineTo(-4, -9); g.lineTo(6, -8); g.lineTo(10, 0); g.lineTo(5, 8); g.lineTo(-6, 8); g.closePath(); g.fill();
  g.strokeStyle = '#ff8a1f'; g.lineWidth = 2; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-6, -2); g.lineTo(0, 1); g.lineTo(5, -4); g.moveTo(0, 1); g.lineTo(2, 6); g.stroke();
  g.fillStyle = '#ffd36b'; g.beginPath(); g.arc(0, 1, 1.8, 0, Math.PI * 2); g.fill();
  g.restore();
}
function drawDragon(g, x, y, s, bob, gear = 1, flash = 0, breathing = 0) {
  const sleeping = gear === 2;
  const rust = '#b5532a', rustDark = '#7e3417', belly = '#f0b765', wing = '#8f3f1e';
  g.save(); g.translate(x, y + (sleeping ? 4 : Math.sin(bob) * 1.5)); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, 30, 34, 7, 0, 0, Math.PI * 2); g.fill();
  // tail curling around
  g.strokeStyle = rust; g.lineWidth = 7; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-14, 22); g.quadraticCurveTo(-42, 26, -36, 6); g.stroke();
  g.fillStyle = rustDark; g.beginPath(); g.moveTo(-36, 6); g.lineTo(-44, -2); g.lineTo(-30, 0); g.closePath(); g.fill();
  // wing
  g.save(); g.translate(-6, -6); g.rotate(sleeping ? 0.5 : -0.2 + Math.sin(bob * 2) * 0.08);
  g.fillStyle = wing;
  g.beginPath(); g.moveTo(0, 0); g.lineTo(-26, -22); g.lineTo(-20, -6); g.lineTo(-30, -4); g.lineTo(-16, 6); g.closePath(); g.fill();
  g.restore();
  // body
  g.fillStyle = rust; g.beginPath(); g.ellipse(-2, 14, 22, 16, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = belly; g.beginPath(); g.ellipse(6, 18, 12, 11, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(126,52,23,.5)'; g.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-2, 12 + i * 5); g.lineTo(14, 12 + i * 5); g.stroke(); }
  // rust spots
  g.fillStyle = 'rgba(70,30,12,.45)';
  for (const [rx, ry, rr] of [[-14, 6, 3], [-8, 22, 2.5], [-18, 16, 2]]) { g.beginPath(); g.arc(rx, ry, rr, 0, Math.PI * 2); g.fill(); }
  // legs
  g.fillStyle = rustDark;
  g.beginPath(); g.ellipse(-12, 28, 7, 4, 0, 0, Math.PI * 2); g.ellipse(10, 28, 7, 4, 0, 0, Math.PI * 2); g.fill();
  // head and snout (rests low when sleeping)
  g.save(); g.translate(18, sleeping ? 10 : -6); g.rotate(sleeping ? 0.25 : -0.05);
  g.fillStyle = rust; g.beginPath(); g.ellipse(0, 0, 14, 11, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(13, 3, 10, 7, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = rustDark; g.beginPath(); g.arc(19, 1, 1.4, 0, Math.PI * 2); g.fill();
  // horns
  g.fillStyle = '#e8d8b0';
  g.beginPath(); g.moveTo(-8, -8); g.lineTo(-14, -20); g.lineTo(-3, -10); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(-1, -10); g.lineTo(-3, -22); g.lineTo(5, -10); g.closePath(); g.fill();
  if (sleeping) {
    g.strokeStyle = '#2a1408'; g.lineWidth = 2; g.lineCap = 'round';
    g.beginPath(); g.arc(3, -1, 4, 0.2, Math.PI - 0.2); g.stroke();
  } else {
    g.fillStyle = '#fff'; g.beginPath(); g.arc(3, -3, 4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#2a1408'; g.beginPath(); g.ellipse(4, -3, 1.6, 3, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#2a1408'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(10, 8); g.quadraticCurveTo(15, 10, 21, 7); g.stroke();
  }
  g.restore();
  // a warm glow under a sleeping dragon (this is what heats the rocks)
  if (sleeping) {
    const gl = g.createRadialGradient(0, 18, 4, 0, 18, 46);
    gl.addColorStop(0, `rgba(255,140,40,${0.35 + 0.15 * Math.sin(bob * 2)})`); gl.addColorStop(1, 'rgba(255,140,40,0)');
    g.fillStyle = gl; g.beginPath(); g.arc(0, 18, 46, 0, Math.PI * 2); g.fill();
  }
  // gear badge
  g.save(); g.translate(-26, -26);
  g.fillStyle = flash > 0 ? '#ffe27a' : '#c9cdd1';
  g.beginPath();
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = i % 2 ? 10 : 12.5; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  g.closePath(); g.fill();
  g.fillStyle = '#4a5056'; g.beginPath(); g.arc(0, 0, 7, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff'; g.font = 'bold 10px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(String(gear), 0, 0.5);
  g.restore();
  g.restore();
  // floating Zs while asleep
  if (sleeping) {
    g.save();
    g.fillStyle = 'rgba(255,255,255,.85)'; g.textAlign = 'center';
    for (let i = 0; i < 2; i++) {
      const ph = (bob * 0.35 + i * 0.5) % 1;
      g.globalAlpha = 1 - ph; g.font = `bold ${(9 + ph * 7) * s}px Nunito, sans-serif`;
      g.fillText('z', x + (24 + ph * 14) * s, y - (16 + ph * 26) * s);
    }
    g.restore();
  }
}
function drawFlame(r, c, t) {
  if (!t.flame) return;
  const k = t.flame.t / 0.35;
  const x0 = c * CELL + 50 + 36, y0 = r * CELL + 54, x1 = t.flame.x, y1 = r * CELL + 48;
  const reach = Math.min(1, k / 0.4), ex = x0 + (x1 - x0) * reach;
  ctx.save(); ctx.globalAlpha = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
  for (let i = 0; i < 8; i++) {
    const f = i / 7, px = x0 + (ex - x0) * f, py = y0 + (y1 - y0) * f + Math.sin(i * 1.7 + k * 10) * 4;
    const rr = 6 + f * 10;
    const gr = ctx.createRadialGradient(px, py, 1, px, py, rr);
    gr.addColorStop(0, 'rgba(255,240,170,.95)'); gr.addColorStop(0.5, 'rgba(255,150,40,.85)'); gr.addColorStop(1, 'rgba(220,60,20,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, rr, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawRock(g, x, y, spin, s = 1) {
  g.save(); g.translate(x, y); g.rotate(spin); g.scale(s, s);
  g.fillStyle = '#8f9590';
  g.beginPath(); g.moveTo(-9, -3); g.lineTo(-4, -9); g.lineTo(6, -8); g.lineTo(10, 0); g.lineTo(5, 8); g.lineTo(-6, 8); g.closePath(); g.fill();
  g.fillStyle = '#b5bab4'; g.beginPath(); g.ellipse(-2, -3, 4, 2.5, -0.5, 0, Math.PI * 2); g.fill();
  g.restore();
}
