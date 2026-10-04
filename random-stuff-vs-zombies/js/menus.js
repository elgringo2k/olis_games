// Switching between the menu screens
const levelOverlay = document.getElementById('levelOverlay');
const winOverlay = document.getElementById('winOverlay');
const menuOverlay = document.getElementById('menuOverlay');
const bonusOverlay = document.getElementById('bonusOverlay');
const nightOverlay = document.getElementById('nightOverlay');
const menuScreens = [menuOverlay, levelOverlay, bonusOverlay, nightOverlay, document.getElementById('almanacOverlay'), document.getElementById('shopOverlay')];
function showScreen(which) {
  setDebug(false);
  reset();
  loadout.clear(); picking = true;
  [endOverlay, winOverlay, startOverlay, ...menuScreens].forEach(o => o.classList.remove('show'));
  which.classList.add('show');
  Sound.setMood('menu');
  syncUI();
  leaveBtn.hidden = true;
  if (which === levelOverlay) setTimeout(() => { refreshArrows(); updateSky(); }, 0);
}
// after a level, go back to whichever screen that level lives on
// beating Level 5 takes you on to Night
document.getElementById('startWaves').addEventListener('click', () => {
  if (!level.plan || state.planStarted) return;
  state.planStarted = true;
  state.spawnTimer = Math.min(state.spawnTimer, 4);
  state.banner = 2.4; state.bannerText = 'HERE THEY COME!';
  syncUI();
});
