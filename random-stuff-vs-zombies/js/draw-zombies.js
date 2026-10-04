// Drawing every zombie
function drawMutantBody(e, baseY, step, chomp) {
  const skin = '#8fae7a', skinDark = '#6f8d5c';
  // 0 = foot down, 1 = foot fully raised right before the stomp
  let lift = 0;
  if (!e.walking && e.smashCool != null) lift = Math.min(1, Math.max(0, 1 - e.smashCool / 0.9));
  chomp = 0;
  // how hurt it is: 0 = fresh, 1 = nearly finished (snapshots can override this)
  const hurt = e.hurtOverride != null ? e.hurtOverride : Math.min(1, Math.max(0, 1 - e.hp / e.maxHp));
  const t = state.time;
  ctx.save(); ctx.translate(e.x, baseY);
  if (!e.noShadow) {
    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.beginPath(); ctx.ellipse(0, 0, 40, 9, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.scale(1.5, 1.5);
  ctx.rotate(-0.03 + step * 0.03 + lift * 0.12 + (hurt > 0.75 ? -0.08 + Math.abs(step) * 0.05 : 0));
  // stubby thick legs
  ctx.strokeStyle = '#3f4352'; ctx.lineWidth = 14; ctx.lineCap = 'round';
  const fx = -11 + step * 6 - lift * 10, fy = -5 - lift * 22;
  ctx.beginPath(); ctx.moveTo(-9, -26); ctx.lineTo(fx, fy);
  ctx.moveTo(10, -26); ctx.lineTo(12 - step * 6, -5); ctx.stroke();
  ctx.fillStyle = '#2b2b30';
  ctx.beginPath(); ctx.ellipse(fx - 3, fy + 2, 10, 5, -lift * 0.3, 0, Math.PI * 2);
  ctx.ellipse(9 - step * 6, -3, 10, 5, 0, 0, Math.PI * 2); ctx.fill();
  // back arm (muscular)
  const pound = lift;
  ctx.save(); ctx.translate(14, -58); ctx.rotate(0.9 - pound * 0.5 + step * 0.15);
  ctx.fillStyle = skinDark;
  ctx.beginPath(); ctx.ellipse(0, 12, 9, 15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-2, 30, 7, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-2, 42, 8, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // big round belly in a torn tank top
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(0, -44, 27, 25, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d8d2c0';
  ctx.beginPath(); ctx.moveTo(-18, -66); ctx.lineTo(-10, -66); ctx.lineTo(-4, -56); ctx.lineTo(4, -56); ctx.lineTo(10, -66); ctx.lineTo(18, -66);
  ctx.quadraticCurveTo(27, -50, 22, -34); ctx.lineTo(14, -30); ctx.lineTo(8, -35); ctx.lineTo(0, -29); ctx.lineTo(-7, -35); ctx.lineTo(-15, -30); ctx.lineTo(-22, -34);
  ctx.quadraticCurveTo(-27, -50, -18, -66); ctx.closePath(); ctx.fill();
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(-2, -26, 20, 9, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = skinDark; ctx.beginPath(); ctx.arc(-2, -24, 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(120,110,90,.35)';
  ctx.beginPath(); ctx.ellipse(8, -48, 4, 6, 0.3, 0, Math.PI * 2); ctx.fill();
  if (hurt > 0.25) {
    // first bruise and a rip in the tank top
    ctx.fillStyle = 'rgba(120,70,140,.55)';
    ctx.beginPath(); ctx.ellipse(-10, -46, 6, 4.5, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.moveTo(10, -60); ctx.lineTo(16, -52); ctx.lineTo(11, -46); ctx.lineTo(14, -40); ctx.lineTo(7, -44); ctx.closePath(); ctx.fill();
  }
  if (hurt > 0.5) {
    // more bruising and a bandage slapped on
    ctx.fillStyle = 'rgba(120,70,140,.55)';
    ctx.beginPath(); ctx.ellipse(12, -36, 5, 4, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(-4, -38); ctx.rotate(-0.5);
    ctx.fillStyle = '#efe6d2'; ctx.fillRect(-9, -3, 18, 6);
    ctx.strokeStyle = 'rgba(150,40,40,.6)'; ctx.lineWidth = 1.2; ctx.strokeRect(-3, -3, 6, 6);
    ctx.restore();
  }
  if (hurt > 0.75) {
    // the tank top is hanging in shreds
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.moveTo(-18, -62); ctx.lineTo(-10, -58); ctx.lineTo(-14, -50); ctx.lineTo(-8, -44); ctx.lineTo(-20, -42); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(160,40,40,.7)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-14, -56); ctx.lineTo(-8, -50); ctx.moveTo(-17, -53); ctx.lineTo(-11, -47); ctx.stroke();
  }
  // shoulders / traps
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(-20, -64, 11, 9, 0, 0, Math.PI * 2); ctx.ellipse(20, -64, 11, 9, 0, 0, Math.PI * 2); ctx.fill();
  if (!e.noHead) {
  // big zombie head on a thick neck (it used to be a pineapple)
  ctx.save(); ctx.translate(0, -84 - pound * 1.5);
  ctx.fillStyle = skinDark; ctx.fillRect(-9, 8, 18, 10);
  // head: wide jaw, small skull, heavy brow
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.moveTo(-13, -14); ctx.quadraticCurveTo(0, -24, 13, -14);
  ctx.quadraticCurveTo(19, -2, 17, 10); ctx.quadraticCurveTo(0, 20, -17, 10);
  ctx.quadraticCurveTo(-19, -2, -13, -14); ctx.closePath(); ctx.fill();
  // scruffy hair, thinning as it gets beaten up
  ctx.fillStyle = '#3f4a35';
  const tufts = [[-10, -15, -0.6], [-4, -19, -0.2], [3, -19, 0.2], [9, -16, 0.6]];
  tufts.filter((_, i) => !(hurt > 0.5 && i === 1) && !(hurt > 0.75 && i === 3)).forEach(([hx, hy, a]) => {
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(a);
    ctx.beginPath(); ctx.moveTo(-4, 2); ctx.lineTo(0, -7); ctx.lineTo(4, 2); ctx.closePath(); ctx.fill();
    ctx.restore();
  });
  // heavy brow ridge
  ctx.fillStyle = skinDark;
  ctx.beginPath(); ctx.ellipse(0, -7, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
  // veins on the temple (it's mutated!)
  ctx.strokeStyle = 'rgba(70,110,60,.8)'; ctx.lineWidth = 1.3;
  ctx.beginPath(); ctx.moveTo(-15, -2); ctx.lineTo(-12, 2); ctx.lineTo(-14, 6); ctx.stroke();
  if (hurt > 0.25) {
    // bruise and a scratch
    ctx.fillStyle = 'rgba(120,70,140,.55)'; ctx.beginPath(); ctx.ellipse(-9, 4, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(160,40,40,.75)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(8, -13); ctx.lineTo(13, -6); ctx.stroke();
  }
  // eyes: one swells shut at half health
  ctx.fillStyle = '#fff6cf';
  ctx.beginPath(); ctx.ellipse(-6, -2, 4, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  if (hurt <= 0.5) { ctx.beginPath(); ctx.ellipse(6, -2, 4, 3.5, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#7a1010';
  ctx.beginPath(); ctx.arc(-6.5, -1.5, 1.8, 0, Math.PI * 2); ctx.fill();
  if (hurt <= 0.5) { ctx.beginPath(); ctx.arc(5.5, -1.5, 1.8, 0, Math.PI * 2); ctx.fill(); }
  else {
    ctx.fillStyle = 'rgba(140,70,120,.6)'; ctx.beginPath(); ctx.ellipse(6, -1, 6, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(2, -1); ctx.lineTo(10, -1); ctx.stroke();
  }
  // angry brows
  ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-12, -8); ctx.lineTo(-2, -5); ctx.moveTo(12, -8); ctx.lineTo(2, -5); ctx.stroke();
  // big underbite with teeth (loses some as it gets hurt)
  const open = 3 + pound * 4;
  ctx.fillStyle = '#3a1f12';
  ctx.beginPath(); ctx.ellipse(0, 9, 9, open, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f2ead2';
  const teeth = [-6, -2, 2, 6].filter((_, i) => !(hurt > 0.5 && i === 1) && !(hurt > 0.75 && i === 2));
  for (const tx of teeth) { ctx.beginPath(); ctx.moveTo(tx - 1.8, 9 + open); ctx.lineTo(tx, 9 + open - 4); ctx.lineTo(tx + 1.8, 9 + open); ctx.closePath(); ctx.fill(); }
  if (hurt > 0.75) {
    // bandage wrapped round its head, and some drool
    ctx.fillStyle = '#efe6d2';
    ctx.save(); ctx.rotate(-0.25); ctx.fillRect(-18, -14, 36, 6); ctx.restore();
    ctx.strokeStyle = 'rgba(150,40,40,.6)'; ctx.lineWidth = 1.2; ctx.strokeRect(-4, -15, 6, 6);
    const ph = (t * 1.1) % 1;
    ctx.fillStyle = `rgba(200,240,255,${0.8 * (1 - ph)})`;
    ctx.beginPath(); ctx.ellipse(-4, 14 + open + ph * 16, 1.6, 2.4 + ph * 2, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  }
  // front arm: huge bicep and fist, pounds when eating
  ctx.save(); ctx.translate(-16, -60); ctx.rotate(e.walking ? 0.25 + step * 0.2 : -0.6 - pound * 0.9);
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(0, 12, 10, 16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(-3, 8, 4, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(-1, 31, 8, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-1, 44, 9, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = skinDark; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-6, 42); ctx.lineTo(4, 42); ctx.stroke();
  if (hurt > 0.5) {
    ctx.strokeStyle = 'rgba(160,40,40,.7)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-5, 6); ctx.lineTo(3, 14); ctx.moveTo(-6, 11); ctx.lineTo(1, 18); ctx.stroke();
  }
  if (hurt > 0.75) {
    ctx.fillStyle = '#efe6d2'; ctx.fillRect(-8, 28, 14, 6);
  }
  ctx.restore();
  ctx.restore();
}

function drawEnemy(e) {
  if (e.kind === 'tube' || e.kind === 'shieldTube' || e.kind === 'soupTube') return drawSwimmer(e);
  drawEnemyBody(e);
}
// a zombie bobbing along in a rubber ring: only the top half shows above the water
function drawSwimmer(e) {
  const baseY = e.lane * CELL + 92, bob = Math.sin((e.wob || 0) * 1.3) * 2;
  const as = Object.assign({}, e, { kind: e.kind === 'shieldTube' ? 'shield' : e.kind === 'soupTube' ? 'soup' : 'basic', noShadow: true, walking: false });
  ctx.save(); ctx.translate(0, 18 + bob);
  ctx.save(); ctx.beginPath(); ctx.rect(e.x - 90, baseY - 220, 180, 220 - 36); ctx.clip();
  drawEnemyBody(as);
  ctx.restore();
  // the ring
  const ry = baseY - 38;
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(e.x, ry + 6, 30, 7, 0, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? '#ffffff' : '#ff6b5a';
    ctx.beginPath(); ctx.ellipse(e.x, ry, 22, 9, 0, (i / 8) * Math.PI * 2, ((i + 1) / 8) * Math.PI * 2); ctx.lineTo(e.x, ry); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = 'rgba(60,150,200,.9)'; ctx.beginPath(); ctx.ellipse(e.x, ry, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function drawEnemyBody(e) {
  const baseY = e.lane * CELL + 92;
  const run = e.kind === 'runner';
  const knight = e.kind === 'knight', helm = knight && e.knightUp;
  // the Mini Teacher looks just like a Teacher (it only has less health)
  const teacher = e.kind === 'teacher' || e.kind === 'mini', mini = false, ninja = e.kind === 'ninja';
  const fury = teacher && e.angry;
  const step = e.walking ? Math.sin(e.wob * (run ? 3.6 : 1.4)) * (run ? 1.6 : 1) : 0;
  const chomp = e.walking ? 0 : Math.sin(e.wob * 3);
  if (e.kind === 'mutant') drawMutantBody(e, baseY, step, chomp);
  else if (e.kind === 'car') drawCarZombie(e, baseY);
  else {
  ctx.save(); ctx.translate(e.x + (fury ? Math.sin(state.time * 50) * 1.2 : 0), baseY);
  ctx.fillStyle = 'rgba(0,0,0,.2)';
  ctx.beginPath(); ctx.ellipse(0, 0, 24, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.rotate((run && e.walking ? -0.26 : knight && e.walking ? -0.16 : -0.06) + step * 0.03);
  // legs
  ctx.strokeStyle = '#3f4352'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-4, -30); ctx.lineTo(-6 + step * 8, -3);
  ctx.moveTo(6, -30); ctx.lineTo(8 - step * 8, -3); ctx.stroke();
  ctx.fillStyle = run ? '#f4f4f0' : ninja ? '#8a5a2e' : '#2b2b30';
  ctx.beginPath(); ctx.ellipse(-9 + step * 8, -2, 7, 4, 0, 0, Math.PI * 2);
  ctx.ellipse(5 - step * 8, -2, 7, 4, 0, 0, Math.PI * 2); ctx.fill();
  // back arm
  ctx.strokeStyle = '#7f9c6c'; ctx.lineWidth = 7;
  if (run && e.walking) { ctx.beginPath(); ctx.moveTo(4, -58); ctx.lineTo(12 - step * 8, -44); ctx.lineTo(4 - step * 6, -36); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(4, -58); ctx.lineTo(-26, -54 + chomp * 4); ctx.stroke(); }
  const swim = e.kind === 'noodler';
  // torso: torn shirt (swimmers get bare skin and striped trunks)
  ctx.fillStyle = swim ? '#8fae7a' : run ? '#d9a33a' : teacher ? '#8a5a9e' : ninja ? '#e8892a' : '#5b7085';
  ctx.beginPath(); ctx.moveTo(-14, -66); ctx.lineTo(14, -66); ctx.lineTo(13, -32);
  ctx.lineTo(7, -27); ctx.lineTo(2, -32); ctx.lineTo(-4, -26); ctx.lineTo(-9, -31); ctx.lineTo(-14, -28); ctx.closePath(); ctx.fill();
  if (ninja) {
    // monk's robe: a long saffron skirt and a darker sash over one shoulder
    ctx.fillStyle = '#e8892a';
    ctx.beginPath(); ctx.moveTo(-14, -34); ctx.lineTo(14, -34); ctx.lineTo(17, -12 + step * 2); ctx.lineTo(-17, -12 - step * 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b8561a';
    ctx.beginPath(); ctx.moveTo(8, -66); ctx.lineTo(14, -66); ctx.lineTo(-8, -32); ctx.lineTo(-14, -34); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7a3a12'; ctx.fillRect(-14, -36, 28, 4);
    // prayer beads
    ctx.fillStyle = '#5a2e14';
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-9 + i * 3.6, -62 + Math.abs(i - 2.5) * 1.6, 1.6, 0, Math.PI * 2); ctx.fill(); }
  }
  if (teacher) {
    // cardigan over a collared shirt
    ctx.fillStyle = '#f4f1e6';
    ctx.beginPath(); ctx.moveTo(-5, -66); ctx.lineTo(5, -66); ctx.lineTo(2, -46); ctx.lineTo(-2, -46); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-6, -66); ctx.lineTo(-1, -61); ctx.lineTo(-8, -58); ctx.closePath(); ctx.moveTo(6, -66); ctx.lineTo(1, -61); ctx.lineTo(8, -58); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e6c95a';
    for (const by of [-58, -50, -42]) { ctx.beginPath(); ctx.arc(-6, by, 1.6, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#ffffff'; ctx.fillRect(7, -60, 4, 6);
    ctx.fillStyle = '#d0473a'; ctx.fillRect(8, -63, 2, 6);
  }
  if (swim) {
    ctx.fillStyle = '#ff9f1c'; ctx.fillRect(-14, -36, 28, 10);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(-14, -33, 28, 3);
    ctx.fillStyle = '#6f8d5c'; ctx.beginPath(); ctx.arc(-1, -48, 1.8, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#8fae7a';
  ctx.beginPath(); ctx.moveTo(-2, -50); ctx.lineTo(5, -44); ctx.lineTo(-1, -40); ctx.closePath(); ctx.fill();
  // pictures (almanac, level preview) have no armour amount at all, so draw them with it whole
  const armor = !knight ? 0 : e.maxHp > e.base ? Math.max(0, (e.hp - e.base) / (e.maxHp - e.base)) : 1;
  if (knight) {
    // breastplate
    ctx.fillStyle = '#9aa3ab';
    ctx.beginPath(); ctx.moveTo(-16, -68); ctx.lineTo(16, -68); ctx.quadraticCurveTo(19, -46, 14, -28); ctx.lineTo(-14, -28); ctx.quadraticCurveTo(-19, -46, -16, -68); ctx.fill();
    ctx.fillStyle = '#c3cad0'; ctx.fillRect(-2, -66, 4, 36);
    ctx.fillStyle = '#7a838b';
    ctx.beginPath(); ctx.ellipse(-16, -64, 7, 5, 0, 0, Math.PI * 2); ctx.ellipse(16, -64, 7, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#b8323a'; ctx.fillRect(-14, -36, 28, 5);
    ctx.fillStyle = 'rgba(40,44,48,.55)';
    if (armor < 0.66) { ctx.beginPath(); ctx.ellipse(-8, -50, 4, 3, 0.3, 0, Math.PI * 2); ctx.fill(); }
    if (armor < 0.33) { ctx.beginPath(); ctx.ellipse(8, -40, 5, 3, -0.3, 0, Math.PI * 2); ctx.fill(); }
  }
  if (!e.noHead) {
  // head
  ctx.save(); ctx.translate(-2, -78); ctx.rotate(0.12);
  ctx.fillStyle = '#8fae7a';
  ctx.beginPath(); ctx.ellipse(0, 0, 14, 16, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4d6140';
  if (!ninja) { ctx.beginPath(); ctx.moveTo(-12, -9); ctx.lineTo(-4, -16); ctx.lineTo(4, -12); ctx.lineTo(10, -15); ctx.lineTo(13, -6); ctx.lineTo(-13, -4); ctx.closePath(); ctx.fill(); }
  else { ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.ellipse(-4, -9, 5, 3, -0.3, 0, Math.PI * 2); ctx.fill(); }
  if (teacher) {
    // hair bun with a pencil through it, and glasses
    ctx.fillStyle = '#6b4a32';
    ctx.beginPath(); ctx.arc(8, -16, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f2c230'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(1, -24); ctx.lineTo(16, -9); ctx.stroke();
    ctx.fillStyle = '#ff9fbf'; ctx.beginPath(); ctx.arc(1, -24, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6b4a32';
    ctx.beginPath(); ctx.moveTo(-13, -6); ctx.quadraticCurveTo(-6, -18, 13, -9); ctx.lineTo(12, -4); ctx.quadraticCurveTo(0, -12, -13, -2); ctx.closePath(); ctx.fill();
  }
  if (swim) {
    // swim goggles pushed up on the forehead
    ctx.strokeStyle = '#2f7fd1'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-14, -9); ctx.lineTo(14, -9); ctx.stroke();
    ctx.fillStyle = 'rgba(120,210,255,.85)'; ctx.strokeStyle = '#2f7fd1'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(-6, -10, 5, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(6, -10, 5, 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  if (run) {
    ctx.fillStyle = '#d0473a'; ctx.fillRect(-14, -8, 28, 5);
    ctx.beginPath(); ctx.moveTo(13, -7); ctx.lineTo(24, -12 + step * 3); ctx.lineTo(22, -4 + step * 3); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#f2eedc';
  ctx.beginPath(); ctx.arc(-6, -1, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, 0, 3.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(-8, -1, 2, 0, Math.PI * 2); ctx.arc(4, 0, 1.5, 0, Math.PI * 2); ctx.fill();
  if (teacher) {
    ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(-6, -1, 6, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(6, 0, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(1, -1); ctx.stroke();
  }
  if (fury) {
    ctx.fillStyle = 'rgba(220,40,30,.35)'; ctx.beginPath(); ctx.ellipse(0, 2, 14, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3a0d0d'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-12, -10); ctx.lineTo(-2, -6); ctx.moveTo(11, -9); ctx.lineTo(2, -6); ctx.stroke();
  }
  ctx.fillStyle = '#2f2a24';
  ctx.beginPath(); ctx.ellipse(-3, 9, 6, (fury ? 4.5 : 2.5) + Math.max(0, chomp) * 3, 0, 0, Math.PI * 2); ctx.fill();
  if (e.canUp) drawCan(ctx, 0, -10, (e.hp - e.base) / (e.maxHp - e.base));
  if (helm) drawKnightHelm(armor, step);
  ctx.restore();
  }
  if (e.shieldUp) {
    // front arm holds the shield up
    ctx.strokeStyle = '#8fae7a'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-8, -60); ctx.lineTo(-24, -52 + chomp * 2); ctx.stroke();
    const sh = (e.hp - e.base) / (e.maxHp - e.base); // 1 = fresh, 0 = about to break
    ctx.save(); ctx.translate(-30, -50 + chomp * 2 + step * 1.5);
    ctx.fillStyle = '#6b4a2b';
    ctx.beginPath(); ctx.ellipse(0, 0, 13, 30, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9a6b3c';
    ctx.beginPath(); ctx.ellipse(0, 0, 10, 27, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#6b4a2b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-9, -10); ctx.lineTo(9, -10); ctx.moveTo(-10, 10); ctx.lineTo(10, 10); ctx.stroke();
    ctx.fillStyle = '#c9cdd1';
    ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3d2814'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    if (sh < 0.66) { ctx.beginPath(); ctx.moveTo(-6, -24); ctx.lineTo(-1, -14); ctx.lineTo(-5, -6); ctx.stroke(); }
    if (sh < 0.33) { ctx.beginPath(); ctx.moveTo(7, 22); ctx.lineTo(2, 12); ctx.lineTo(6, 4); ctx.moveTo(2, 12); ctx.lineTo(-4, 16); ctx.stroke(); }
    ctx.restore();
  } else {
    // front arm, reaching forward (runners pump their arms)
    ctx.strokeStyle = '#8fae7a'; ctx.lineWidth = 7;
    if (ninja && !e.armless) {
      // nunchucks: held ready while walking, a whirling blur during tricks
      ctx.beginPath(); ctx.moveTo(-8, -60); ctx.lineTo(-20, -58); ctx.stroke();
      ctx.save(); ctx.translate(-22, -58);
      const a = e.tricks ? e.spinA : 0.6 + Math.sin(e.wob) * 0.2;
      if (e.tricks) {
        ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 18, a, a + 2.4); ctx.stroke();
      }
      ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a + Math.PI) * 14, Math.sin(a + Math.PI) * 14); ctx.stroke();
      ctx.strokeStyle = '#9aa0a6'; ctx.lineWidth = 1.5;
      const cx = Math.cos(a) * 6, cy = Math.sin(a) * 6;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(cx, cy); ctx.stroke();
      ctx.strokeStyle = '#8a5a2e'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = '#8fae7a'; ctx.lineWidth = 7;
    } else if (e.armless) {
      // just a stump left
      ctx.beginPath(); ctx.moveTo(-8, -60); ctx.lineTo(-15, -56); ctx.stroke();
      ctx.fillStyle = '#6f8d5c'; ctx.beginPath(); ctx.arc(-15, -56, 3.5, 0, Math.PI * 2); ctx.fill();
    } else if (swim) {
      // swinging the pool noodle overhead when bonking, held forward when walking
      const swing = e.walking ? 0.15 + step * 0.08 : -1.1 + Math.max(0, Math.sin(e.wob * 3)) * 1.4;
      ctx.beginPath(); ctx.moveTo(-8, -60); ctx.lineTo(-26, -56 - (e.walking ? 0 : 6)); ctx.stroke();
      ctx.save(); ctx.translate(-26, -56 - (e.walking ? 0 : 6)); ctx.rotate(swing);
      ctx.strokeStyle = '#ff3fa4'; ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(6, 2); ctx.quadraticCurveTo(-20, -6 - step * 3, -46, 6 + step * 4); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(4, -1); ctx.quadraticCurveTo(-20, -9 - step * 3, -44, 3 + step * 4); ctx.stroke();
      ctx.fillStyle = '#c42a7c'; ctx.beginPath(); ctx.arc(-46, 6 + step * 4, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (teacher && e.testUp) {
      // holding the test paper up in front
      ctx.beginPath(); ctx.moveTo(-8, -60); ctx.lineTo(-22, -54 + chomp * 2); ctx.stroke();
      const hp = Math.max(0, Math.min(1, (e.hp - e.testAt) / (e.maxHp - e.testAt)));
      ctx.save(); ctx.translate(-30, -62 + chomp * 2 + step * 1.5); ctx.rotate(-0.12);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-12, -16, 24, 32);
      ctx.strokeStyle = '#c9d6e8'; ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-9, -6 + i * 5); ctx.lineTo(9, -6 + i * 5); ctx.stroke(); }
      ctx.fillStyle = '#d0473a'; ctx.font = 'bold 10px Nunito, sans-serif'; ctx.fillText('A+', -10, -7);
      ctx.strokeStyle = '#d0473a'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(4, -12); ctx.lineTo(6, -9); ctx.lineTo(10, -14); ctx.stroke();
      // rips and creases as it takes damage
      ctx.strokeStyle = '#8a8a8a'; ctx.lineWidth = 1.2;
      if (hp < 0.66) { ctx.beginPath(); ctx.moveTo(-12, 2); ctx.lineTo(-4, 6); ctx.lineTo(-8, 12); ctx.stroke(); }
      if (hp < 0.33) { ctx.beginPath(); ctx.moveTo(12, -4); ctx.lineTo(4, 0); ctx.lineTo(8, 8); ctx.lineTo(2, 16); ctx.stroke(); }
      ctx.restore();
    } else if (fury) {
      // shaking an angry fist
      const shake = Math.sin(state.time * 22) * 0.35;
      ctx.save(); ctx.translate(-8, -60); ctx.rotate(-2.0 + shake);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 22); ctx.stroke();
      ctx.fillStyle = '#8fae7a'; ctx.beginPath(); ctx.arc(0, 25, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (knight) {
      // lance couched for a charge, jabbing when blocked
      const jab = e.walking ? 0 : Math.max(0, Math.sin(e.wob * 3)) * 10;
      ctx.strokeStyle = '#9aa3ab'; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(-8, -60); ctx.lineTo(-18, -50); ctx.stroke();
      ctx.save(); ctx.translate(-18 - jab, -50); ctx.rotate(-0.08);
      ctx.fillStyle = '#7a4f26'; ctx.fillRect(-4, -3, 26, 6);
      ctx.fillStyle = '#c3cad0';
      ctx.beginPath(); ctx.moveTo(2, -10); ctx.lineTo(2, 10); ctx.lineTo(-10, 4); ctx.lineTo(-10, -4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#d7dde2';
      ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(-52, 0); ctx.lineTo(-10, 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#b8323a';
      ctx.beginPath(); ctx.moveTo(-14, -3); ctx.lineTo(-24, -14 + step * 2); ctx.lineTo(-30, -3); ctx.closePath(); ctx.fill();
      ctx.restore();
    } else if (run && e.walking) { ctx.beginPath(); ctx.moveTo(-8, -60); ctx.lineTo(-14 + step * 8, -46); ctx.lineTo(-24 + step * 6, -40); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-8, -60); ctx.lineTo(-34, -60 - chomp * 4 + step * 2); ctx.stroke(); }
  }
  ctx.restore();
  }
  if (fury) {
    for (let i = 0; i < 2; i++) {
      const ph = (state.time * 1.8 + i * 0.5) % 1;
      ctx.fillStyle = `rgba(255,255,255,${0.75 * (1 - ph)})`;
      ctx.beginPath(); ctx.arc(e.x - 10 + i * 18, e.lane * CELL + 2 - ph * 22, 4 + ph * 6, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (knight && e.walking) {
    for (let i = 0; i < 3; i++) {
      const ph = (state.time * 2.4 + i / 3) % 1;
      ctx.fillStyle = `rgba(150,125,90,${0.45 * (1 - ph)})`;
      ctx.beginPath(); ctx.arc(e.x + 18 + ph * 26, e.lane * CELL + 88 - ph * 8, 4 + ph * 6, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (run && e.walking) {
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const ly = e.lane * CELL + 40 + i * 14, off = ((state.time * 90 + i * 13) % 20);
      ctx.beginPath(); ctx.moveTo(e.x + 24 + off, ly); ctx.lineTo(e.x + 40 + off, ly); ctx.stroke();
    }
  }
  if (e.bleed > 0) {
    for (let i = 0; i < 3; i++) {
      const ph = (state.time * 1.6 + i / 3) % 1;
      const dx = e.x - 10 + i * 9, dy = e.lane * CELL + 50 + ph * 34;
      ctx.fillStyle = `rgba(200,30,40,${0.85 * (1 - ph)})`;
      ctx.beginPath(); ctx.moveTo(dx, dy - 5); ctx.quadraticCurveTo(dx + 4, dy + 1, dx, dy + 3); ctx.quadraticCurveTo(dx - 4, dy + 1, dx, dy - 5); ctx.fill();
    }
  }
  if (e.poison > 0) {
    for (let i = 0; i < 3; i++) {
      const ph = (state.time * 1.2 + i / 3) % 1;
      ctx.fillStyle = `rgba(150,220,60,${0.8 * (1 - ph)})`;
      const py = e.kind === 'mutant' ? e.lane * CELL - 30 : e.lane * CELL + 24;
      ctx.beginPath(); ctx.arc(e.x - 6 + (i - 1) * 9, py - ph * 14, 3 + i, 0, Math.PI * 2); ctx.fill();
    }
  }
  // hp bar
  if (e.hp < e.maxHp) {
    const by = e.kind === 'mutant' ? e.lane * CELL - 52 : e.lane * CELL + 2;
    const bw = e.kind === 'mutant' ? 72 : 48;
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(e.x - bw / 2, by, bw, 6);
    ctx.fillStyle = e.poison > 0 ? '#8fd13a' : '#e0634a'; ctx.fillRect(e.x - bw / 2, by, bw * (Math.max(0, e.hp) / e.maxHp), 6);
  }
}
