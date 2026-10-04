// Card art, the game loop, and starting up
// card art
const chCtx = document.getElementById('chogArt').getContext('2d');
chCtx.scale(2, 2); drawChog(chCtx, 24, 30, 0.9, 0, 0.3);
const snCtx = document.getElementById('snapperArt').getContext('2d');
snCtx.scale(2, 2); drawSnapper(snCtx, 18, 30, 0.62, 0, { mode: 'closed', openK: 0, chew: 0 });
const dgCtx = document.getElementById('diggerArt').getContext('2d');
dgCtx.scale(2, 2); drawDigger(dgCtx, 22, 26, 0.6, 0);
const drCtx = document.getElementById('dragonArt').getContext('2d');
drCtx.scale(2, 2); drawDragon(drCtx, 28, 26, 0.62, 0, 1, 0);
const erCtx = document.getElementById('enragedArt').getContext('2d');
erCtx.scale(2, 2); drawTurtle(erCtx, 22, 30, 0.6, 0, 0, 'enraged');
const agCtx = document.getElementById('angryArt').getContext('2d');
agCtx.scale(2, 2); drawTurtle(agCtx, 22, 30, 0.6, 0, 0, 'angry');
const tCtx = document.getElementById('turtleArt').getContext('2d');
tCtx.scale(2, 2); drawTurtle(tCtx, 24, 30, 0.62, 0, 0);
const wCtx = document.getElementById('whipArt').getContext('2d');
wCtx.scale(2, 2); drawTurtle(wCtx, 24, 30, 0.62, 0, 0, 'whip');
const tsCtx = document.getElementById('teslaSeedArt').getContext('2d');
tsCtx.scale(2, 2); drawTesla(tsCtx, 26, 46, 0.42);
const usCtx = document.getElementById('ultimaSeedArt').getContext('2d');
usCtx.scale(2, 2); drawSnapper(usCtx, 16, 30, 0.6, 0, { mode: 'closed', openK: 0, chew: 0 }, true);
const csCtx = document.getElementById('cleanSeedArt').getContext('2d');
csCtx.scale(2, 2); drawSpray(csCtx, 24, 22, 0.55, 0, 0, true);
const hsCtx = document.getElementById('hyperSeedArt').getContext('2d');
hsCtx.scale(2, 2); drawTurtle(hsCtx, 26, 30, 0.5, 0, 0, 'hyper');
const jcCtx = document.getElementById('jicArt').getContext('2d');
jcCtx.scale(2, 2); drawJic(jcCtx, 26, 24, 0.7, 0);
const ltCtx = document.getElementById('lotlArt').getContext('2d');
ltCtx.scale(2, 2); drawLotl(ltCtx, 22, 26, 0.6, 0, 0);
const bgCtx = document.getElementById('badgerArt').getContext('2d');
bgCtx.scale(2, 2); drawBadger(bgCtx, 24, 22, 0.6, 0);
const skCtx = document.getElementById('sharkArt').getContext('2d');
skCtx.scale(2, 2); drawShark(skCtx, 24, 28, 0.55, 0);
const shvCtx = document.getElementById('shovelArt').getContext('2d');
shvCtx.scale(2, 2); drawShovel(shvCtx, 24, 30, 0.75);
const lbCtx = document.getElementById('lobsterArt').getContext('2d');
lbCtx.scale(2, 2); drawLobster(lbCtx, 26, 26, 0.5, 0);
const lzCtx = document.getElementById('laserArt').getContext('2d');
lzCtx.scale(2, 2); drawTurtle(lzCtx, 22, 30, 0.6, 0, 0, 'laser');
const shCtx = document.getElementById('shampooArt').getContext('2d');
shCtx.scale(2, 2); drawShampoo(shCtx, 26, 20, 0.55, 0, 0);
const spCtx = document.getElementById('sprayArt').getContext('2d');
spCtx.scale(2, 2); drawSpray(spCtx, 24, 22, 0.55, 0, 0);
const bCtx = document.getElementById('beeArt').getContext('2d');
bCtx.scale(2, 2); drawBee(bCtx, 24, 28, 0.85, 1, 0.8);
const fmCtx = document.getElementById('fortiArt').getContext('2d');
fmCtx.scale(2, 2); drawMau(fmCtx, 26, 32, 0.5, 1, false, 0); drawFortiArmor(fmCtx, 26, 32, 0.5, 1);
const mCtx = document.getElementById('mauArt').getContext('2d');
mCtx.scale(2, 2); drawMau(mCtx, 26, 28, 0.55, 1, false, 0);
const boatCtx = document.getElementById('boatArt').getContext('2d');
if (boatCtx) { boatCtx.fillStyle = '#5cc4ec'; boatCtx.fillRect(0, 60, 104, 44); boatCtx.scale(2, 2); drawBoat(boatCtx, 26, 34, 0.5); boatCtx.setTransform(1, 0, 0, 1, 0, 0); }
const looCtx = document.getElementById('looArt').getContext('2d');
looCtx.scale(2, 2); drawLoo(looCtx, 26, 26, 0.75);
const btCtx = document.getElementById('batteryArt').getContext('2d');
btCtx.scale(2, 2); drawBattery(btCtx, 26, 22, 0.55);
const hsqCtx = document.getElementById('hsquidArt').getContext('2d');
hsqCtx.scale(2, 2); drawSquid(hsqCtx, 26, 30, 0.58, 0, 0, false, true);
const muCtx = document.getElementById('multiArt').getContext('2d');
muCtx.scale(2, 2); drawTurtle(muCtx, 20, 30, 0.55, 0, 0, 'multi');
const mnCtx = document.getElementById('miniArt').getContext('2d');
mnCtx.scale(2, 2); drawTurtle(mnCtx, 22, 32, 0.4, 0, 0, 'mini');
const vsCtx = document.getElementById('vampArt').getContext('2d');
vsCtx.scale(2, 2); drawVampSquid(vsCtx, 26, 30, 0.58, 0, 0, 1);
const sCtx = document.getElementById('squidArt').getContext('2d');
sCtx.scale(2, 2); drawSquid(sCtx, 26, 30, 0.58, 0, 0);

let last = performance.now();
function loop(now) {
  // schedule the next frame first, so one bad frame can never freeze the game
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  try { if (state.running) update(dt); } catch (err) { console.error('update error', err); }
  try { draw(); } catch (err) { console.error('draw error', err); ctx.restore(); }
  cards.forEach(cd => {
    const u = cd.dataset.unit, cdEl = cd.querySelector('.cooldown');
    if (!cdEl) return;
    const left = state.recharge[u] || 0;
    cdEl.style.height = left > 0 ? (left / UNITS[u].recharge * 100) + '%' : '0';
  });
}
buildPicker();
reset();
requestAnimationFrame(loop);
