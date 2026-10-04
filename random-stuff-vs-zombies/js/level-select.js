// Level select: menu buttons, level cards, scrolling sky and end-of-game buttons
function showLevels() {
  if (level.night || (level === LEVELS[5] && progress.beaten[5])) { showScreen(levelOverlay); scrollToLevel(level === LEVELS[5] ? 'n1' : null); return; }
  showScreen(level.units === null || level.rounds || level.plan ? bonusOverlay : levelOverlay);
}
// Levels 6 and 7 (night) stay hidden until Level 5 is beaten, so the row ends at sunset
const nightOpen = () => !!(progress.beaten[5] || progress.unlockAll);
function refreshNightButton() {
  document.querySelectorAll('#levelGrid .night-card').forEach(c => { c.hidden = !nightOpen(); });
  // the Pool levels only show up once Level 10 is beaten
  const poolOpen = !!(progress.beaten.n5 || progress.unlockAll);
  document.querySelectorAll('#levelGrid .pool-card').forEach(c => { c.hidden = !poolOpen; });
  if (typeof updateSky === 'function') setTimeout(updateSky, 0);
}
document.getElementById('menuLevels').addEventListener('click', () => showScreen(levelOverlay));
document.getElementById('menuBonus').addEventListener('click', () => showScreen(bonusOverlay));
document.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => showScreen(menuOverlay)));
document.querySelectorAll('.level-card[data-level]').forEach(b => b.addEventListener('click', () => {
  if (!levelUnlocked(b)) return;
  level = LEVELS[b.dataset.level];
  setDebug(false);
  reset();
  loadout.clear();
  menuScreens.forEach(o => o.classList.remove('show'));
  if (level.sandbox) {
    // every defender at once, straight into the game with the sandbox tools on
    cards.forEach(cd => { if (unitAllowed(cd.dataset.unit)) loadout.add(cd.dataset.unit); });
    picking = false;
    setDebug(true);
    state.running = true;
    syncUI();
    return;
  }
  picking = true;
  // a small level brings everything it has
  const allowedNow = cards.map(cd => cd.dataset.unit).filter(unitAllowed);
  if (level.units === 'owned') { allowedNow.forEach(u => loadout.add(u)); picking = false; state.running = true; syncUI(); return; }
  if (level.units && allowedNow.length <= maxSlots()) allowedNow.forEach(u => loadout.add(u));
  startOverlay.classList.add('show');
  syncUI();
}));
document.querySelectorAll('.to-levels').forEach(b => b.addEventListener('click', showLevels));
const leaveBtn = document.getElementById('leaveLevel');
let leaveArmed = null;
leaveBtn.addEventListener('click', () => {
  if (!leaveArmed) {
    leaveBtn.textContent = 'Tap again to leave';
    leaveBtn.classList.add('confirm');
    leaveArmed = setTimeout(() => { leaveArmed = null; leaveBtn.textContent = 'Leave level'; leaveBtn.classList.remove('confirm'); }, 3000);
    return;
  }
  clearTimeout(leaveArmed); leaveArmed = null;
  leaveBtn.textContent = 'Leave level'; leaveBtn.classList.remove('confirm');
  showLevels(); // the level isn't saved: leaving throws away this run
});
document.getElementById('unlockAll').addEventListener('click', () => { progress.unlockAll = true; saveProgress(); refreshLevelCards(); });
document.getElementById('resetProgress').addEventListener('click', () => { progress = { beaten: {}, coins: progress.coins || 0, shop: progress.shop || {} }; saveProgress(); refreshLevelCards(); });
refreshLevelCards();
setTimeout(syncCoins, 0);
const levelGrid = document.getElementById('levelGrid');
const levelsBack = document.getElementById('levelsBack'), levelsMore = document.getElementById('levelsMore');
const levelStep = () => { const c = levelGrid.querySelector('.level-card'); return c ? c.getBoundingClientRect().width + 14 : 234; };
function refreshArrows() {
  const max = levelGrid.scrollWidth - levelGrid.clientWidth;
  levelsBack.disabled = levelGrid.scrollLeft <= 2;
  levelsMore.disabled = levelGrid.scrollLeft >= max - 2;
}
levelsMore.addEventListener('click', () => { levelGrid.scrollBy({ left: levelStep(), behavior: 'smooth' }); });
levelsBack.addEventListener('click', () => { levelGrid.scrollBy({ left: -levelStep(), behavior: 'smooth' }); });
levelGrid.addEventListener('scroll', refreshArrows);
// parallax: the lawn behind the level cards drifts at a third of the scroll speed
levelGrid.addEventListener('scroll', () => {
  levelOverlay.style.setProperty('--lawn-x', `${-levelGrid.scrollLeft / 3}px`);
  updateSky();
});
// how much of a card is showing in the row (0..1)
function shown(k) {
  const c = levelGrid.querySelector(`.level-card[data-level="${k}"]`); if (!c || c.hidden) return 0;
  const g = levelGrid.getBoundingClientRect(), r = c.getBoundingClientRect();
  if (!r.width) return 0;
  return Math.max(0, Math.min(r.right, g.right) - Math.max(r.left, g.left)) / r.width;
}
// 0 = daytime, 1 = sunset (Level 5 in view), 2 = night (Level 6 in view)
function skyPhase() { return Math.min(2, shown('5') + shown('n1') + (shown('n1') >= 1 ? 0 : 0)); }
function updateSky() {
  const tint = document.getElementById('skyTint'); if (!tint) return;
  const s5 = shown('5'), s6 = Math.max(shown('n1'), shown('n2'), shown('n3'), shown('n4'), shown('n5'));
  // fade into sunset as Level 5 slides in, then into night as Level 6 slides in
  const s10 = shown('n5'), sPool = Math.max(shown('p1'), shown('p2'), shown('p3'), shown('p4'));
  const p = sPool > 0 ? 3 + sPool : s10 > 0 ? 2 + s10 : s6 > 0 ? 1 + s6 : s5;
  const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  const DAY = [255, 200, 120, 0], SUNSET = [255, 105, 55, 0.38], NIGHT = [14, 20, 60, 0.62], SUNRISE = [255, 140, 150, 0.34];
  const POOLDAY = [140, 210, 255, 0.12];
  const c = p <= 1 ? mix(DAY, SUNSET, p) : p <= 2 ? mix(SUNSET, NIGHT, p - 1) : p <= 3 ? mix(NIGHT, SUNRISE, p - 2) : mix(SUNRISE, POOLDAY, p - 3);
  tint.style.backgroundColor = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${c[3].toFixed(3)})`;
  const nightK = p <= 2 ? Math.max(0, p - 1) : Math.max(0, 1 - (p - 2) * 1.2);
  tint.querySelector('.sky-stars').style.opacity = nightK.toFixed(2);
  tint.querySelector('.sky-moon').style.opacity = nightK.toFixed(2);
  document.getElementById('poolBg').style.opacity = sPool.toFixed(2);
  // the title follows whichever part of the world you're looking at
  // the sky goes orange at sunset, but it's still the Grass world until night falls
  document.getElementById('levelsTitle').textContent = sPool >= 0.5 ? 'Pool' : s6 >= 0.5 ? 'Night' : 'Grass';
}
function scrollToLevel(k) {
  if (!k) return;
  setTimeout(() => {
    const c = levelGrid.querySelector(`.level-card[data-level="${k}"]`);
    if (c && !c.hidden && c.scrollIntoView) c.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    updateSky();
  }, 50);
}
window.addEventListener('resize', refreshArrows);
setTimeout(refreshArrows, 0);
document.getElementById('winAgainBtn').onclick = () => {
  reset(); if (debug) { savedEnergy = state.energy; state.energy = 999999; syncUI(); }
  winOverlay.classList.remove('show'); state.running = true; syncUI();
};
document.getElementById('startBtn').onclick = () => {
  if (!loadout.size) return;
  picking = false;
  startOverlay.classList.remove('show'); state.running = true;
  syncUI();
};
document.getElementById('changeBtn').onclick = () => {
  if (level.sandbox) { endOverlay.classList.remove('show'); document.querySelector('.level-card[data-level="sandbox"]').click(); return; }
  reset();
  if (debug) { savedEnergy = state.energy; state.energy = 999999; }
  picking = true;
  endOverlay.classList.remove('show'); startOverlay.classList.add('show');
  syncUI();
};
document.getElementById('restartBtn').onclick = () => { reset(); if (debug) { savedEnergy = state.energy; state.energy = 999999; syncUI(); } endOverlay.classList.remove('show'); state.running = true; };
