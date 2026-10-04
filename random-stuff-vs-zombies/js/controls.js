// Starting a game, the hotbar and defender picker, and tapping the board
function reset() {
  state = {
    energy: ((level && level.startEnergy) || (level && level.night ? 50 : 150)) + (level && !level.sandbox && !level.plan ? (level.night ? owned('energyNight') : Math.min(1, owned('energy'))) * 50 : 0), grid: Array.from({length: ROWS}, () => Array(COLS).fill(null)),
    enemies: [], rocks: [], puffs: [], orbs: [], puddles: [], packets: [], boulders: [], bolts: [], sheets: [], coins: [], aiming: null, seeds: { hyper: 0, clean: 0, ultima: 0, tesla: 0 }, recharge: {}, selected: null, hover: null,
    time: 0, energyTimer: 0, spawnTimer: 20, spawnEvery: 16, kills: 0, wave: 1, running: false, over: false
  };
  syncUI();
}

function syncUI() {
  energyEl.textContent = debug ? '∞' : state.energy;
  const swBtn = document.getElementById('startWaves');
  if (swBtn) swBtn.hidden = !(level.plan && state.running && !state.planStarted && !picking);
  waveEl.textContent = level.sandbox ? '—' : level.plan && !state.planStarted ? 'Planning' : level.rounds ? `Round ${(state.round || 0) + 1} / ${level.rounds.length}${state.roundPhase === 'horde' ? ' · HORDE' : ''}` : state.finalStarted ? 'Final!' : isFinite(level.waves) ? `${state.wave} / ${level.waves}` : state.wave;
  killsEl.textContent = state.kills;
  const ready = u => state.energy >= UNITS[u].cost && !(state.recharge[u] > 0);
  if (state.selected && !ready(state.selected)) state.selected = null;
  const full = loadout.size >= maxSlots();
  layoutHotbar();
  pickButtons.forEach(pb => {
    const u = pb.dataset.pick, picked = loadout.has(u);
    pb.hidden = !unitAllowed(u);
    pb.classList.toggle('picked', picked);
    pb.disabled = !picked && full;
    pb.setAttribute('aria-pressed', picked ? 'true' : 'false');
  });
  cards.forEach(cd => {
    const u = cd.dataset.unit;
    cd.classList.toggle('benched', !loadout.has(u));
    if (picking) {
      cd.disabled = false;
      cd.setAttribute('aria-pressed', loadout.has(u) ? 'true' : 'false');
    } else {
      cd.disabled = !ready(u);
      cd.setAttribute('aria-pressed', state.selected === u ? 'true' : 'false');
    }
  });
  if (barEl) barEl.classList.toggle('picking', picking);
  const leave = document.getElementById('leaveLevel');
  const onMenu = ['menuOverlay', 'levelOverlay', 'bonusOverlay', 'nightOverlay', 'almanacOverlay', 'shopOverlay'].some(id => { const o = document.getElementById(id); return o && o.classList.contains('show'); });
  if (leave) leave.hidden = onMenu;
  pickCountEl.textContent = `${loadout.size} of ${maxSlots()} picked`;
  const warnEl = document.getElementById('pickWarning');
  const NAMES = { angry: 'Angry Turtle', squid: 'Sun Squid', mau: 'Mau Mau', enraged: 'Enraged Turtle', hsquid: 'Hypersquid', forti: 'Forti Mau' };
  const warnings = [];
  const an = n => (/^[AEIOU]/.test(n) ? 'an ' : 'a ') + n;
  pickButtons.forEach(pb => {
    const u = pb.dataset.pick, base = SHOP_SEEDS[u];
    const missing = base && !pb.hidden && !unitAllowed(base);
    const notPicked = base && loadout.has(u) && !loadout.has(base);
    pb.classList.toggle('warn', !!(missing || notPicked || (NIGHT_UNITS.has(u) && dayLevel())));
    if (loadout.has(u) && NIGHT_UNITS.has(u) && dayLevel()) warnings.push(`${u === 'vamp' ? 'Vampire Squid' : 'Mini Turtle'} is a night defender: it falls asleep in the daytime and won't do anything here.`);
    if (loadout.has(u) && missing) warnings.push(`${NAMES[u]} has to go on ${an(NAMES[base])}, and this level doesn't have one, so you won't be able to plant it.`);
    else if (notPicked) warnings.push(`${NAMES[u]} has to go on ${an(NAMES[base])}. Bring ${an(NAMES[base])} too, or you won't be able to plant it.`);
  });
  if (warnEl) { warnEl.hidden = !warnings.length; warnEl.textContent = warnings.length ? '⚠ ' + warnings.join(' ') : ''; }
  startBtnEl.disabled = loadout.size === 0;
  shovelBtn.setAttribute('aria-pressed', state.shovel ? 'true' : 'false');
  for (const k in seedBtns) {
    const n = state.seeds[k] || 0;
    if (state.selected === k && n <= 0) state.selected = null;
    seedBtns[k].hidden = picking || n <= 0;
    seedBtns[k].setAttribute('aria-pressed', state.selected === k ? 'true' : 'false');
    document.getElementById(k + 'SeedCount').textContent = n;
  }
}

[...cards, ...Object.values(seedBtns)].forEach(b => b.addEventListener('mousedown', e => e.preventDefault()));
cards.forEach(cd => cd.addEventListener('click', () => {
  const u = cd.dataset.unit;
  if (picking) {
    // tapping a hotbar card while picking sends it back to the unit screen
    loadout.delete(u);
    syncUI();
    return;
  }
  if (!loadout.has(u) || !unitAllowed(u)) return;
  if (state.energy < UNITS[u].cost || state.recharge[u] > 0) return;
  state.selected = state.selected === u ? null : u;
  state.shovel = false; state.aiming = null;
  syncUI();
}));
for (const k in seedBtns) seedBtns[k].addEventListener('click', () => {
  if (picking || !(state.seeds[k] > 0)) return;
  state.selected = state.selected === k ? null : k;
  state.shovel = false;
  syncUI();
});
const shovelBtn = document.getElementById('shovelBtn');
const barEl = document.querySelector('.bar');
const slotEls = [];
for (let i = 0; i < 12; i++) {
  const sl = document.createElement('div');
  sl.className = 'slot'; sl.setAttribute('aria-hidden', 'true'); sl.textContent = 'Empty';
  slotEls.push(sl);
}
// Hotbar shows picked cards in the order you picked them, then empty slots while picking
function layoutHotbar() {
  if (!barEl || !barEl.insertBefore) return;
  const byUnit = {}; cards.forEach(cd => { byUnit[cd.dataset.unit] = cd; });
  const empty = picking ? maxSlots() - loadout.size : 0;
  const want = [...[...loadout].map(u => byUnit[u]), ...Object.values(seedBtns), ...slotEls.slice(0, Math.max(0, empty))];
  // only touch the page when the order really changed: moving a button you just tapped
  // makes the browser lose its place and jump the page back to the top
  const current = [...barEl.children].filter(el => want.includes(el));
  const same = current.length === want.length && current.every((el, i) => el === want[i]) &&
    (want.length === 0 || want[want.length - 1].nextElementSibling === shovelBtn || !shovelBtn);
  if (!same) for (const el of want) barEl.insertBefore(el, shovelBtn);
  slotEls.forEach((sl, i) => { if (i >= empty && sl.parentNode) sl.parentNode.removeChild(sl); });
}
const pickerGrid = document.getElementById('pickerGrid');
const pickButtons = [];
function buildPicker() {
  cards.forEach(cd => {
    const u = cd.dataset.unit;
    const art = cd.querySelector('canvas');
    const b = document.createElement('button');
    b.className = 'pick' + (isUpgrade(u) ? ' upgrade' : u === 'jic' ? ' fusion' : ''); b.dataset.pick = u; b.setAttribute('aria-pressed', 'false');
    const img = document.createElement('img');
    img.alt = '';
    try { img.src = art.toDataURL(); } catch (e) {}
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = cd.querySelector('span:not(.cooldown)').firstChild.textContent;
    const cost = document.createElement('b'); cost.textContent = UNITS[u].cost; name.appendChild(cost);
    const desc = document.createElement('span'); desc.className = 'desc'; desc.textContent = DESCRIPTIONS[u] || '';
    b.append(img, name, desc);
    b.addEventListener('click', () => {
      if (!picking || !unitAllowed(u)) return;
      if (loadout.has(u)) loadout.delete(u);
      else if (loadout.size < maxSlots()) loadout.add(u);
      syncUI();
    });
    pickerGrid.appendChild(b);
    pickButtons.push(b);
  });
}
shovelBtn.addEventListener('click', () => {
  if (picking) return;
  state.shovel = !state.shovel;
  if (state.shovel) { state.selected = null; state.aiming = null; }
  syncUI();
});

function pointFromEvent(e) {
  const r = board.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (board.width / r.width), y: (e.clientY - r.top) * (board.height / r.height) };
}
function cellFromEvent(e) {
  const p = pointFromEvent(e);
  return { c: Math.floor(p.x / CELL), r: Math.floor(p.y / CELL) };
}
board.addEventListener('pointermove', e => { state.hover = cellFromEvent(e); });
board.addEventListener('pointerleave', () => { state.hover = null; });
board.addEventListener('pointerdown', e => {
  if (!state.running) return;
  // collecting an orb always comes first
  const p = pointFromEvent(e);
  const pk = state.packets.find(k => Math.hypot(k.x - p.x, k.y - p.y) < 44);
  if (pk) {
    state.packets.splice(state.packets.indexOf(pk), 1);
    state.seeds[pk.kind] = (state.seeds[pk.kind] || 0) + 1;
    Sound.play('packet');
    state.puffs.push({ x: pk.x, y: pk.y, t: 0, fortify: true, life: 0.6 });
    syncUI();
    return;
  }
  const coin = state.coins.find(cn => !cn.collected && Math.hypot(cn.x - p.x, cn.y - p.y) < 34);
  if (coin) { collectCoin(coin); return; }
  const orb = state.orbs.find(o => !o.collected && Math.hypot(o.x - p.x, o.y - p.y) < 36);
  if (orb) {
    orb.collected = true; orb.ct = 0; orb.sx = orb.x; orb.sy = orb.y;
    state.energy += orb.value; syncUI(); Sound.play('collect');
    return;
  }
  if (state.shovel) {
    const { c, r } = cellFromEvent(e);
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS && state.grid[r][c]) {
      // Golden Shovel: half the defender's cost back
      if (owned('shovel') && !level.sandbox) {
        const cell = state.grid[r][c], main = cell.type === 'hyperPart' ? cell.main : cell;
        const refund = Math.floor(((UNITS[main.type] && UNITS[main.type].cost) || 0) / 2);
        if (refund) { state.energy += refund; syncUI(); }
      }
      removeUnit(r, c);
      state.puffs.push({ x: c * CELL + 50, y: r * CELL + 80, t: 0, dirt: true, life: 0.5 });
      state.shovel = false; syncUI();
    }
    return;
  }
  if (!state.selected) {
    const { c, r } = cellFromEvent(e);
    const cellAt = r >= 0 && r < ROWS && c >= 0 && c < COLS ? state.grid[r][c] : null;
    const t = cellAt && cellAt.type === 'hyperPart' ? cellAt.main : cellAt;
    if (state.aiming) {
      const ai = state.aiming, dg = state.grid[ai.r][ai.c];
      state.aiming = null;
      if (t === dg) return; // tapping the Digger again cancels
      if (dg && dg.type === 'digger' && dg.boulder && r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        dg.boulder = false; dg.dig = DIGGER.digTime; dg.heave = 1;
        Sound.play('heave');
        state.boulders.push({ x0: ai.c * CELL + 72, y0: ai.r * CELL + 8, x1: c * CELL + 50, y1: r * CELL + 55, tr: r, tc: c, t: 0 });
      }
      return;
    }
    if (t && t.type === 'digger' && t.boulder) { state.aiming = { r, c }; Sound.play('aim'); return; }
    if (t && (t.type === 'battery' || t.type === 'tesla')) {
      const st = t.type === 'tesla' ? TESLA : BATTERY, tesla = t.type === 'tesla';
      // the zombie closest to your house (furthest left), in any lane
      let target = null;
      for (const e of state.enemies) if (e.hp > 0 && e.x < board.width && (!target || e.x < target.x)) target = e;
      if (t.cool > 0 || state.energy < st.shotCost || !target) { t.nope = 0.4; Sound.play('click'); return; }
      state.energy -= st.shotCost; syncUI();
      t.cool = st.reload;
      // a thick lightning bolt flies off the top and chases the target down
      const bx = tesla ? t.c * CELL + 100 : c * CELL + 50, by = tesla ? t.r * CELL + 6 : r * CELL + 18;
      state.bolts.push({ x: bx, y: by, target, t: 0, ang: 0, dmg: st.dmg, tesla });
      if (tesla) Sound.play('zap');
      state.puffs.push({ x: bx, y: by, t: 0, zap: true });
      return;
    }
    if (t && t.type === 'dragon') {
      t.gear = t.gear === 1 ? 2 : 1;
      Sound.play('gear');
      t.gearFlash = 0.6;
      t.flame = null;
    }
    return;
  }
  const { c, r } = cellFromEvent(e);
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
  const u = UNITS[state.selected];
  if (u.onTurtle) {
    if (state.energy < u.cost || !mergeRecipe(r, c)) return;
    state.energy -= u.cost;
    doMerge(r, c);
    state.selected = null; syncUI();
    return;
  }
  if (u.twoTile) {
    // two-tile fusions take the tile you tap and the one in front of it
    const kind = state.selected;
    if (!(state.seeds[kind] > 0) || c + 1 >= COLS || state.grid[r][c] || state.grid[r][c + 1]) return;
    if (level.pool && WATER_LANES.includes(r)) return; // too big for a boat
    const big = kind === 'hyper'
      ? { type: 'hyper', twoTile: true, r, c, hp: HYPER.hp, maxHp: HYPER.hp, bob: 0, cool: 0.6, throwAnim: 0, lash: null }
      : kind === 'tesla'
      ? { type: 'tesla', twoTile: true, r, c, hp: TESLA.hp, maxHp: TESLA.hp, bob: 0, cool: 0, nope: 0 }
      : { type: 'ultima', twoTile: true, r, c, hp: ULTIMA.hp, maxHp: ULTIMA.hp, bob: 0, mode: 'closed', openK: 0, chew: 0, burp: 0, stretch: 0, lungeT: 0, prey: null };
    state.grid[r][c] = big;
    state.grid[r][c + 1] = { type: 'hyperPart', main: big };
    state.seeds[kind]--;
    state.puffs.push({ x: (c + 1) * CELL, y: r * CELL + 50, t: 0, merge: true, life: 0.9 });
    state.selected = null; syncUI();
    return;
  }
  if (u.upgrades) {
    // upgrades go on top of the defender they upgrade
    const here = state.grid[r][c];
    if (!canUpgrade(state.selected, here)) return;
    if (state.energy < u.cost || state.recharge[state.selected] > 0) return;
    state.energy -= u.cost;
    if (!debug) state.recharge[state.selected] = u.recharge;
    if (state.selected === 'forti') { here.forti = true; here.hp = u.hp; here.maxHp = u.hp; }
    else if (state.selected === 'enraged') { here.type = 'enraged'; here.hp = u.hp; here.maxHp = u.hp; here.queued = 0; }
    else if (state.selected === 'hsquid') { here.type = 'hsquid'; here.hp = u.hp; here.maxHp = u.hp; here.asleep = false; }
    state.puffs.push({ x: c * CELL + 50, y: r * CELL + 30, t: 0, fortify: true, life: 0.6 });
    state.selected = null; syncUI();
    return;
  }
  const isWater = level.pool && WATER_LANES.includes(r), here = state.grid[r][c];
  let intoBoat = false;
  if (state.selected === 'boat') { if (!isWater || here) return; }
  else if (isWater) { if (!here || here.type !== 'boat') return; intoBoat = true; }
  else if (here) return;
  if (u.seed) {
    if (!(state.seeds[state.selected] > 0)) return;
    state.seeds[state.selected]--;
  }
  if (state.energy < u.cost || state.recharge[state.selected] > 0) return;
  state.energy -= u.cost;
  if (u.recharge && !debug && !level.noRecharge) state.recharge[state.selected] = u.recharge;
  Sound.play(isWater ? 'squish' : 'place');
  const bob = Math.random() * 6;
  state.grid[r][c] =
    state.selected === 'turtle' ? { type: 'turtle', hp: u.hp, maxHp: u.hp, cool: 0.4, throwAnim: 0, bob } :
    state.selected === 'boat'   ? { type: 'boat', hp: u.hp, maxHp: u.hp, bob } :
    state.selected === 'loo'    ? { type: 'loo', hp: u.hp, maxHp: u.hp, bob, fuse: u.fuse } :
    state.selected === 'battery' ? { type: 'battery', hp: u.hp, maxHp: u.hp, bob, cool: 0, zap: null, nope: 0 } :
    state.selected === 'hsquid' ? { type: 'hsquid', hp: u.hp, maxHp: u.hp, make: u.firstAfter, glow: 0, bob } :
    state.selected === 'multi'  ? { type: 'multi', hp: u.hp, maxHp: u.hp, cool: 0.4, throwAnim: 0, bob } :
    state.selected === 'mini'   ? { type: 'mini', hp: u.hp, maxHp: u.hp, cool: 0.4, throwAnim: 0, bob } :
    state.selected === 'vamp'   ? { type: 'vamp', hp: u.hp, maxHp: u.hp, bob, make: u.firstAfter, glow: 0, age: 0, grown: 0 } :
    state.selected === 'chog'   ? { type: 'chog', hp: u.hp, maxHp: u.hp, bob, age: 0, stage: 0, size: 0 } :
    state.selected === 'snapper' ? { type: 'snapper', hp: u.hp, maxHp: u.hp, bob, mode: 'closed', openK: 0, chew: 0, burp: 0, stretch: 0, lungeT: 0, prey: null } :
    state.selected === 'digger' ? { type: 'digger', hp: u.hp, maxHp: u.hp, bob, boulder: true, dig: 0 } :
    state.selected === 'dragon' ? { type: 'dragon', hp: u.hp, maxHp: u.hp, bob, cool: 0.5, gear: 1, flame: null, gearFlash: 0 } :
    state.selected === 'angry'  ? { type: 'angry', hp: u.hp, maxHp: u.hp, cool: 0.4, throwAnim: 0, queued: 0, gap: 0, bob } :
    state.selected === 'whip'   ? { type: 'whip', hp: u.hp, maxHp: u.hp, cool: 0.2, throwAnim: 0, lash: null, bob } :
    state.selected === 'mau'    ? { type: 'mau', hp: u.hp, maxHp: u.hp, bob, blink: 2 + Math.random() * 3 } :
    state.selected === 'lotl'   ? { type: 'lotl', hp: u.hp, maxHp: u.hp, bob, fuse: u.fuse } :
    state.selected === 'badger' ? { type: 'badger', hp: u.hp, maxHp: u.hp, bob, scratching: 0 } :
    state.selected === 'clean'  ? { type: 'clean', hp: u.hp, maxHp: u.hp, bob, cool: 0.4, mist: 0, squeeze: 0 } :
    state.selected === 'shark'  ? { type: 'shark', hp: u.hp, maxHp: u.hp, bob, cool: 0.4, lunge: 0, lungeX: 0 } :
    state.selected === 'lobster' ? { type: 'lobster', hp: u.hp, maxHp: u.hp, bob, cool: 0.5, snap: 0, snapX: 0 } :
    state.selected === 'laser'  ? { type: 'laser', hp: u.hp, maxHp: u.hp, bob, cool: 0.6, beam: 0, throwAnim: 0 } :
    state.selected === 'shampoo' ? { type: 'shampoo', hp: u.hp, maxHp: u.hp, bob, cool: 0.4, squeeze: 0 } :
    state.selected === 'spray'  ? { type: 'spray', hp: u.hp, maxHp: u.hp, bob, cool: 0.3, mist: 0, squeeze: 0 } :
    state.selected === 'bee'    ? { type: 'bee', hp: u.hp, maxHp: u.hp, bob, cool: 0.3, mode: 'home',
                                    hx: c * CELL + 50, hy: r * CELL + 44, x: c * CELL + 50, y: r * CELL + 44, target: null, face: 1 } :
                                  { type: 'squid', hp: u.hp, maxHp: u.hp, make: u.firstAfter, glow: 0, bob };
  if (intoBoat && state.grid[r][c]) state.grid[r][c].onBoat = true;
  state.selected = null;
  syncUI();
});
