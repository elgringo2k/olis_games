// Coins and the shop
// ===================== COINS & SHOP =====================
const SHOP = [
  { id: 'slots', name: 'Extra Slot', desc: 'One more defender slot when you pick your team.', costs: [500, 1500, 3000] },
  { id: 'energy', name: 'Head Start: Day', desc: 'Start daytime levels and Endless with +50 energy.', costs: [300] },
  { id: 'energyNight', name: 'Head Start: Night', desc: 'Start night levels with +50 energy.', costs: [750] },
  { id: 'shovel', name: 'Golden Shovel', desc: 'Digging up a defender gives you back half its cost.', costs: [1000] },
  { id: 'enraged', name: 'Enraged Turtle', desc: 'Seed packet: unlocks the Enraged Turtle in every level that has the Angry Turtle.', costs: [2500], seed: 'enraged' },
  { id: 'hsquid', name: 'Hypersquid', desc: 'Seed packet: unlocks the Hypersquid in every level that has the Sun Squid.', costs: [3000], seed: 'hsquid' },
  { id: 'forti', name: 'Forti Mau', desc: 'Seed packet: unlocks the Forti Mau in every level that has the Mau Mau.', costs: [3000], seed: 'forti' },
  { id: 'battery', name: 'Battery Tower', desc: 'Seed packet: unlocks the Battery Tower in every level.', costs: [4500], seed: 'battery' }
];
function owned(id) { return (typeof progress !== 'undefined' && progress.shop && progress.shop[id]) || 0; }
function syncCoins() {
  const n = progress.coins || 0;
  const a = document.getElementById('coinCount'); if (a) a.textContent = n;
  const b = document.getElementById('shopCoins'); if (b) b.textContent = n;
}
function drawShopIcon(g, id) {
  const W = g.canvas.width, H = g.canvas.height;
  g.clearRect(0, 0, W, H);
  g.save(); g.translate(W / 2, H / 2);
  if (SHOP_SEEDS[id] || SHOP_UNITS.includes(id)) {
    g.restore(); g.save();
    // a seed packet with the Enraged Turtle on it
    g.fillStyle = '#c9971a'; roundRect(g, 10, 6, W - 20, H - 12, 10); g.fill();
    g.fillStyle = '#fff3c4'; roundRect(g, 14, 10, W - 28, H - 20, 8); g.fill();
    const src = document.querySelector(`.card[data-unit="${id}"] canvas`);
    if (src) try { g.drawImage(src, 16, 12, W - 32, W - 32); } catch (err) {}
    g.fillStyle = id === 'hsquid' ? '#2f7de0' : id === 'forti' ? '#7a838b' : id === 'battery' ? '#3d8b4a' : '#b8323a'; g.fillRect(14, H - 22, W - 28, 10);
  } else if (id === 'slots') {
    // a defender card with a big plus
    g.fillStyle = '#c9bf94'; roundRect(g, -30, -36, 60, 72, 10); g.fill();
    g.fillStyle = '#f4efd8'; roundRect(g, -26, -32, 52, 64, 8); g.fill();
    g.strokeStyle = '#b5ab80'; g.lineWidth = 3; g.setLineDash([6, 5]); roundRect(g, -20, -26, 40, 40, 6); g.stroke(); g.setLineDash([]);
    g.fillStyle = '#4caf50'; g.fillRect(-4, -18, 8, 24); g.fillRect(-12, -10, 24, 8);
    g.fillStyle = '#8a7a50'; g.fillRect(-14, 20, 28, 5);
  } else if (id === 'energy' || id === 'energyNight') {
    // a glowing energy orb with +50
    const gr = g.createRadialGradient(0, -4, 4, 0, -4, 34);
    gr.addColorStop(0, '#fffbe0'); gr.addColorStop(0.5, '#ffd84a'); gr.addColorStop(1, 'rgba(255,200,40,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, -4, 34, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#f2c230'; g.beginPath(); g.arc(0, -4, 20, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#7a5600';
    g.beginPath(); g.moveTo(3, -18); g.lineTo(-8, -1); g.lineTo(-1, -1); g.lineTo(-3, 11); g.lineTo(8, -6); g.lineTo(1, -6); g.closePath(); g.fill();
    g.fillStyle = id === 'energyNight' ? '#1f2a4d' : '#2f5a2a'; g.font = '900 15px Nunito, sans-serif'; g.textAlign = 'center'; g.fillText('+50', 0, 34);
    if (id === 'energyNight') {
      g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(24, -28, 9, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#2c3d6b'; g.beginPath(); g.arc(28, -31, 8, 0, Math.PI * 2); g.fill();
    }
  } else if (id === 'shovel') {
    // the shovel, painted gold
    g.restore(); g.save();
    drawShovel(g, W / 2 + 4, H / 2 + 12, 1.0);
    g.globalCompositeOperation = 'source-atop';
    const gr = g.createLinearGradient(0, 0, W, H);
    gr.addColorStop(0, 'rgba(255,240,150,.85)'); gr.addColorStop(0.5, 'rgba(242,194,48,.85)'); gr.addColorStop(1, 'rgba(184,134,11,.85)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = '#fff'; for (const [sx, sy] of [[W * 0.72, H * 0.22], [W * 0.25, H * 0.7]]) { g.beginPath(); g.moveTo(sx, sy - 5); g.lineTo(sx + 1.5, sy - 1.5); g.lineTo(sx + 5, sy); g.lineTo(sx + 1.5, sy + 1.5); g.lineTo(sx, sy + 5); g.lineTo(sx - 1.5, sy + 1.5); g.lineTo(sx - 5, sy); g.lineTo(sx - 1.5, sy - 1.5); g.closePath(); g.fill(); }
  }
  g.restore();
}
function renderShop() {
  const grid = document.getElementById('shopGrid'); grid.innerHTML = '';
  for (const it of SHOP) {
    // Unlock all gives you the Shop's defenders (the upgrades you still buy)
    const lvl = owned(it.id) || (it.seed && progress.unlockAll ? it.costs.length : 0), maxed = lvl >= it.costs.length, cost = it.costs[lvl];
    const card = document.createElement('div'); card.className = 'shop-item' + (it.id === 'energyNight' ? ' night' : '');
    card.innerHTML = `<canvas class="shop-pic" width="96" height="96" aria-hidden="true"></canvas><h3>${it.name}</h3><p>${it.desc}</p><span class="owned">${it.costs.length > 1 ? `Owned: ${lvl} of ${it.costs.length}` : lvl ? 'Owned' : 'Not owned'}</span>`;
    const btn = document.createElement('button');
    btn.innerHTML = maxed ? 'Sold out' : `<span class="coin-icon" aria-hidden="true"></span>${cost}`;
    btn.disabled = maxed || (progress.coins || 0) < cost;
    btn.addEventListener('click', () => {
      if (maxed || (progress.coins || 0) < cost) return;
      progress.coins -= cost; progress.shop = progress.shop || {}; progress.shop[it.id] = lvl + 1;
      saveProgress(); syncCoins(); renderShop(); Sound.play('upgrade');
    });
    card.appendChild(btn); grid.appendChild(card);
    const pic = card.querySelector('.shop-pic'), pg = pic && pic.getContext('2d'); if (pg) try { drawShopIcon(pg, it.id); } catch (err) {}
  }
}
// coins drop from 1 in 3 zombies: 7 in 10 are silver (10), 3 in 10 are gold (100)
function maybeDropCoin(e) {
  if (level.sandbox) return;
  // 1 in 150: a diamond worth 1000 instead (rarer, 1 in 250, in Plan Your Defences)
  if (Math.random() < 1 / (level.plan ? 250 : 150)) {
    state.coins.push({ x: e.x, y: e.lane * CELL + 50, vx: (Math.random() - 0.5) * 60, vy: -300, floor: e.lane * CELL + 78, life: 20, value: 1000, diamond: true, spin: 0 });
    return;
  }
  if (Math.random() >= 1 / 3) return;
  const gold = Math.random() < 0.3;
  state.coins.push({ x: e.x, y: e.lane * CELL + 50, vx: (Math.random() - 0.5) * 80, vy: -240, floor: e.lane * CELL + 80, life: 15, value: gold ? 100 : 10, gold, spin: Math.random() * 6 });
}
function collectCoin(cn) {
  if (cn.collected) return;
  cn.collected = true; cn.ct = 0; cn.sx = cn.x; cn.sy = cn.y;
  progress.coins = (progress.coins || 0) + cn.value; saveProgress(); syncCoins();
  Sound.play(cn.diamond ? 'diamond' : 'coin');
}
function drawCoin(cn) {
  let x = cn.x, y = cn.y, a = cn.life < 3 ? (Math.floor(cn.life * 6) % 2 ? 0.45 : 1) : 1;
  if (cn.collected) { const k = Math.min(1, cn.ct / 0.45); x = cn.sx + (60 - cn.sx) * k * k; y = cn.sy + (-10 - cn.sy) * k * k; a = 1 - k * 0.4; }
  if (cn.diamond) {
    // a sparkling blue diamond that bobs and turns
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - (cn.collected ? 0 : Math.abs(Math.sin(state.time * 3)) * 4));
    if (!cn.collected) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(0, cn.floor - cn.y + 10, 14, 3, 0, 0, Math.PI * 2); ctx.fill(); }
    const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 34);
    glow.addColorStop(0, 'rgba(160,230,255,.55)'); glow.addColorStop(1, 'rgba(160,230,255,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();
    ctx.scale(Math.abs(Math.cos(cn.spin * 0.5)) * 0.6 + 0.4, 1);
    ctx.fillStyle = '#2f9ed8'; ctx.beginPath(); ctx.moveTo(-16, -5); ctx.lineTo(-9, -14); ctx.lineTo(9, -14); ctx.lineTo(16, -5); ctx.lineTo(0, 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7fd6ff'; ctx.beginPath(); ctx.moveTo(-9, -14); ctx.lineTo(9, -14); ctx.lineTo(5, -5); ctx.lineTo(-5, -5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#bff0ff'; ctx.beginPath(); ctx.moveTo(-5, -5); ctx.lineTo(5, -5); ctx.lineTo(0, 16); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#1f6f9e'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-16, -5); ctx.lineTo(16, -5); ctx.moveTo(-9, -14); ctx.lineTo(-5, -5); ctx.lineTo(0, 16); ctx.lineTo(5, -5); ctx.lineTo(9, -14); ctx.stroke();
    ctx.restore();
    // twinkles
    if (!cn.collected) {
      ctx.save(); ctx.fillStyle = '#fff';
      for (let i = 0; i < 3; i++) {
        const ph = (state.time * 1.5 + i / 3) % 1, k = Math.sin(ph * Math.PI);
        const sx = x + Math.cos(i * 2.1) * 22, sy = y - 6 + Math.sin(i * 2.1) * 16, rr = 4 * k;
        ctx.globalAlpha = k * a;
        ctx.beginPath(); ctx.moveTo(sx, sy - rr); ctx.lineTo(sx + rr * 0.3, sy - rr * 0.3); ctx.lineTo(sx + rr, sy); ctx.lineTo(sx + rr * 0.3, sy + rr * 0.3); ctx.lineTo(sx, sy + rr); ctx.lineTo(sx - rr * 0.3, sy + rr * 0.3); ctx.lineTo(sx - rr, sy); ctx.lineTo(sx - rr * 0.3, sy - rr * 0.3); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    return;
  }
  const w = Math.abs(Math.cos(cn.spin)) * 0.85 + 0.15, r = cn.gold ? 15 : 12;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.18)'; if (!cn.collected) { ctx.beginPath(); ctx.ellipse(0, cn.floor - cn.y + 8, r, 3, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.scale(w, 1);
  ctx.fillStyle = cn.gold ? '#b8860b' : '#8d969e'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = cn.gold ? '#f2c230' : '#cdd3d8'; ctx.beginPath(); ctx.arc(0, 0, r - 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = cn.gold ? '#fff2a8' : '#f2f5f7'; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = cn.gold ? '#9a6f08' : '#6d757c'; ctx.font = `900 ${r}px Nunito, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (cn.gold) {
    // a little star stamped on gold coins
    ctx.beginPath();
    for (let i = 0; i < 10; i++) { const ang = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.25 : r * 0.55; ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr); }
    ctx.closePath(); ctx.fill();
  } else ctx.fillText('$', 0, 1);
  ctx.restore();
}
const shopOverlay = document.getElementById('shopOverlay');
document.getElementById('menuShop').addEventListener('click', () => { showScreen(shopOverlay); renderShop(); syncCoins(); });
