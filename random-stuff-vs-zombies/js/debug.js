// Debug bar, Sandbox wave builder, drag-to-spawn zombies and Reset world
const debugBar = document.getElementById('debugBar');
function setDebug(on) {
  on = !!on;
  if (on === debug) return;
  debug = on;
  if (on) { savedEnergy = state.energy; state.energy = 999999; state.recharge = {}; }
  else state.energy = savedEnergy;
  debugBar.classList.toggle('show', on);
  if (!on && LEVELS.sandbox.pool) setSandboxMap(false); // leaving Sandbox goes back to the lawn
  if (!on) { const wb = document.getElementById('waveBuilder'); if (wb) wb.hidden = true; }
  syncUI();
}
// Sandbox: build your own wave by choosing how many of each zombie to send
const WB_KINDS = [['basic', 'Zombie'], ['shield', 'Shield Bearer'], ['soup', 'Soup Can Head'], ['runner', 'Runnererer'], ['noodler', 'Pool Noodler'],
  ['knight', 'Charging Knight'], ['teacher', 'Teacher'], ['mini', 'Mini Teacher'], ['ninja', 'Nunjaka'], ['car', 'Car Zombie'], ['mutant', 'Mutant'], ['boatZ', 'Boat Zombie'], ['swimmer', 'Swimmer Zombie']];
// only on the pool map (in the water lanes, the other zombies turn into their swimming versions by themselves)
const WB_POOL_ONLY = ['boatZ', 'swimmer'];
const wbCounts = {};
const wbGrid = document.getElementById('wbGrid'), wbTotal = document.getElementById('wbTotal'), wbSend = document.getElementById('wbSend');
const wbPanel = document.getElementById('waveBuilder'), wbOpen = document.getElementById('openWaveBuilder');
function wbRefresh() {
  const total = WB_KINDS.reduce((n, [k]) => n + (wbCounts[k] || 0), 0);
  wbTotal.textContent = `${total} zombie${total === 1 ? '' : 's'}`;
  wbSend.disabled = total === 0;
}
WB_KINDS.forEach(([k, name]) => {
  wbCounts[k] = 0;
  const row = document.createElement('div'); row.className = 'wb-row';
  const label = document.createElement('span'); label.textContent = name;
  const ctrl = document.createElement('span'); ctrl.className = 'wb-ctrl';
  const minus = document.createElement('button'); minus.textContent = '−'; minus.setAttribute('aria-label', `Fewer ${name}`);
  const input = document.createElement('input'); input.type = 'number'; input.min = '0'; input.max = '99'; input.value = '0'; input.setAttribute('aria-label', `${name} count`);
  const plus = document.createElement('button'); plus.textContent = '+'; plus.setAttribute('aria-label', `More ${name}`);
  const set = v => { wbCounts[k] = Math.max(0, Math.min(99, v | 0)); input.value = wbCounts[k]; wbRefresh(); };
  minus.addEventListener('click', () => set(wbCounts[k] - 1));
  plus.addEventListener('click', () => set(wbCounts[k] + 1));
  input.addEventListener('input', () => set(+input.value));
  ctrl.append(minus, input, plus); row.append(label, ctrl); wbGrid.appendChild(row);
  row._set = set; row.dataset.kind = k;
  if (WB_POOL_ONLY.includes(k)) row.hidden = true;
});
wbOpen.addEventListener('click', () => {
  wbPanel.hidden = !wbPanel.hidden;
  wbOpen.setAttribute('aria-expanded', wbPanel.hidden ? 'false' : 'true');
});
document.getElementById('wbClear').addEventListener('click', () => { [...wbGrid.children].forEach(r => r._set(0)); });
wbSend.addEventListener('click', () => {
  if (!state.running) return;
  const q = [];
  WB_KINDS.forEach(([k]) => { for (let i = 0; i < (wbCounts[k] || 0); i++) q.push(k); });
  for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; }
  if (!q.length) return;
  state.customQueue = (state.customQueue || []).concat(q);
  const gap = parseFloat(document.getElementById('wbGap').value);
  state.customGap = Number.isFinite(gap) ? gap : 0.7;
  if (state.customTimer == null || state.customTimer <= 0) state.customTimer = 0.6;
  state.banner = 2.4; state.bannerText = 'INCOMING!';
});

// Sandbox map: the normal lawn, or the pool (three water lanes, boats, and the pool zombies)
const poolPresetBtn = document.getElementById('poolPreset');
function setSandboxMap(pool) {
  LEVELS.sandbox.pool = pool;
  poolPresetBtn.setAttribute('aria-pressed', pool ? 'true' : 'false');
  debugBar.querySelectorAll('.pool-only').forEach(b => { b.hidden = !pool; });
  [...wbGrid.children].forEach(row => { if (WB_POOL_ONLY.includes(row.dataset.kind)) { row.hidden = !pool; if (!pool) row._set(0); } });
  if (level !== LEVELS.sandbox) return;
  // the lanes change, so start from an empty board, and bring the Boat along only in the pool
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) state.grid[r][c] = null;
  state.enemies = []; state.divers = []; state.puddles = []; state.customQueue = [];
  loadout.clear();
  cards.forEach(cd => { if (unitAllowed(cd.dataset.unit)) loadout.add(cd.dataset.unit); });
  syncUI();
}
poolPresetBtn.addEventListener('click', () => setSandboxMap(!LEVELS.sandbox.pool));
// Drag a zombie button onto the board to drop that zombie exactly there
const dragChip = document.getElementById('dragChip');
function boardPoint(clientX, clientY) {
  const r = board.getBoundingClientRect();
  if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return null;
  const x = (clientX - r.left) * (board.width / r.width), y = (clientY - r.top) * (board.height / r.height);
  return { x: Math.max(30, Math.min(board.width - 10, x)), lane: Math.max(0, Math.min(ROWS - 1, Math.floor(y / CELL))) };
}
debugBar.querySelectorAll('[data-spawn]').forEach(b => {
  b.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (b.setPointerCapture) b.setPointerCapture(e.pointerId);
    state.dragZombie = { kind: b.dataset.spawn, at: null };
    b.classList.add('dragging');
    dragChip.textContent = b.textContent;
  });
  b.addEventListener('pointermove', e => {
    if (!state.dragZombie) return;
    state.dragZombie.at = boardPoint(e.clientX, e.clientY);
    dragChip.style.display = state.dragZombie.at ? 'none' : 'block';
    dragChip.style.left = e.clientX + 'px'; dragChip.style.top = e.clientY + 'px';
  });
  const finish = e => {
    if (!state.dragZombie) return;
    const at = e.type === 'pointerup' ? boardPoint(e.clientX, e.clientY) : null;
    if (at && state.running) spawnZombie(state.dragZombie.kind, at.lane, at.x);
    state.dragZombie = null;
    b.classList.remove('dragging');
    dragChip.style.display = 'none';
  };
  b.addEventListener('pointerup', finish);
  b.addEventListener('pointercancel', finish);
});

// Reset world: tap once to arm, tap again within 3 seconds to wipe the board and start from wave 1
const resetBtn = document.getElementById('resetWorld');
let resetArmed = null;
resetBtn.addEventListener('click', () => {
  if (!resetArmed) {
    resetBtn.textContent = 'Tap again to reset';
    resetBtn.classList.add('confirm');
    resetArmed = setTimeout(() => {
      resetArmed = null; resetBtn.textContent = 'Reset world'; resetBtn.classList.remove('confirm');
    }, 3000);
    return;
  }
  clearTimeout(resetArmed); resetArmed = null;
  resetBtn.textContent = 'Reset world'; resetBtn.classList.remove('confirm');
  // full reset: fresh board, every level locked again, back to the level select
  progress = { beaten: {}, coins: 0, shop: {} }; saveProgress(); refreshLevelCards(); syncCoins();
  showScreen(menuOverlay);
});
