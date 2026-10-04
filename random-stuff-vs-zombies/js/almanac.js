// The almanac of defenders and zombies
// ===================== ALMANAC =====================
// ratings: 0 none, 1 very low, 2 low, 3 normal, 4 high, 5 very high
const RATE = ['None', 'Very low', 'Low', 'Normal', 'High', 'Very high'];
const ALMANAC_DEFENDERS = {
  squid:   { name: 'Sun Squid', energy: '25 per orb', dmg: 0, tough: 3, speed: 'Every 12 s', range: '—', special: 'Makes 25-energy orbs. Sleeps at night.' },
  hsquid:  { name: 'Hypersquid', energy: '50 per orb', dmg: 0, tough: 3, speed: 'Every 12 s', range: '—', special: 'Planted on a Sun Squid. Makes 50-energy orbs. Sleeps at night.' },
  vamp:    { name: 'Vampire Squid', energy: '10 per orb then 25 per orb', dmg: 0, tough: 3, speed: 'Every 12 s then every 18 s', range: '—', special: 'Night defender. 10-energy orbs for 90 s, then 25-energy orbs.' },
  mini:    { name: 'Mini Turtle', dmg: 2, tough: 3, speed: 'Normal', range: '3 tiles ahead', special: 'Night defender. Free.' },
  turtle:  { name: 'Rock Turtle', dmg: 2, tough: 3, speed: 'Normal', range: 'Whole lane', special: '' },
  whip:    { name: 'Whip Turtle', dmg: 3, tough: 3, speed: 'Fast', range: '3 tiles ahead', special: '' },
  mau:     { name: 'Mau Mau', dmg: 0, tough: 4, speed: '—', range: '—', special: 'A wall that soaks up bites.' },
  forti:   { name: 'Forti Mau', dmg: 0, tough: 5, speed: '—', range: '—', special: 'Planted on a Mau Mau. An even bigger wall.' },
  bee:     { name: 'Benny Bee', dmg: 4, tough: 3, speed: 'Slow', range: 'Whole lane', special: 'Poisons zombies for 5 s.' },
  spray:   { name: 'Cleaning Spray', dmg: 2, tough: 3, speed: 'Normal', range: '3 lanes × 2 tiles', special: 'Hits everything in its mist.' },
  shampoo: { name: 'Shampoo', dmg: 1, tough: 3, speed: 'Slow', range: 'Whole lane', special: 'Leaves slippery puddles that slow zombies.' },
  laser:   { name: 'Laser Turtle', dmg: 4, tough: 3, speed: 'Slow', range: 'Whole lane', special: 'Pierces every zombie in the lane.' },
  lobster: { name: 'Lewis Lobster', dmg: 3, tough: 3, speed: 'Slow', range: '1 tile ahead', special: '' },
  shark:   { name: 'Sammy', dmg: 5, tough: 3, speed: 'Normal', range: '2 tiles ahead', special: 'Bites cause bleeding. Swims in the pool: water only, no boat.' },
  badger:  { name: 'Hyperbadge', dmg: 4, tough: 3, speed: 'Constant', range: 'Its own tile', special: 'Zombies walk over him and get shredded.' },
  jic:     { name: 'Jicjajic', dmg: 0, tough: 3, speed: '—', range: '—', special: 'Fuses defenders: Hyper Turtle, Squeaky Clean, Ultima Snapper, Tesla Coil.' },
  lotl:    { name: 'Temper-lotl', dmg: 5, tough: 3, speed: 'Once', range: '3×3', special: 'Explodes 1.5 s after planting.' },
  angry:   { name: 'Angry Turtle', dmg: 3, tough: 3, speed: 'Normal', range: 'Whole lane', special: 'Throws 2 rocks at a time.' },
  enraged: { name: 'Enraged Turtle', dmg: 5, tough: 3, speed: 'Normal', range: 'Whole lane', special: 'Planted on an Angry Turtle. 4 rocks at a time.' },
  dragon:  { name: 'Rusty', dmg: 4, tough: 3, speed: 'Normal', range: '3 tiles ahead', special: 'Tap to switch gears. Asleep, he turns passing rocks into lava.' },
  digger:  { name: 'Digger', dmg: 4, tough: 3, speed: 'Very slow', range: 'Anywhere you aim', special: 'Tap, aim, and throw a boulder with 3×3 splash.' },
  snapper: { name: 'Snapper', dmg: 5, tough: 3, speed: 'Very slow', range: '1 tile ahead', special: 'Swallows zombies whole, then chews for 10 s. Too small for the Mutant, a car or a Boat Zombie: it bites those instead.' },
  chog:    { name: 'Chog-chog', dmg: [2, 3, 4], tough: 3, speed: 'Once', range: '3×3 then 5×5', special: 'Explodes when eaten. Bigger the longer he waits.' },
  multi:   { name: 'Multurtle', dmg: 2, tough: 3, speed: 'Normal', range: '3 lanes', special: 'One rock in its lane and each lane next to it.' },
  boat:    { name: 'Boat', dmg: 0, tough: 3, speed: '—', range: '—', special: 'Pool only: goes on water so you can plant a defender in it.' },
  loo:     { name: 'Loo Roll', dmg: 4, tough: 0, speed: 'Once', range: '12 directions', special: 'Each sheet hits 2 zombies: 250, then 125.' },
  wipes:   { name: 'Wipes', dmg: 4, tough: 0, speed: 'Once', range: '12 directions', special: 'Like a Loo Roll, plus slippery foam in a 3×3 where it bursts and under each zombie hit.' },
  battery: { name: 'Battery Tower', dmg: 4, tough: 3, speed: 'Every 5 s', range: 'Closest zombie to your house', special: 'Tap and pay 50 energy to fire.' },
  cobra:   { name: 'Magneticobra', dmg: 0, tough: 3, speed: 'Every 10 s (20 s after a car)', range: '3 lanes, 3 tiles ahead', special: 'Steals soup cans and knight helmets. Pulls in cars and rips them open.' },
  hyper:   { name: 'Hyper Turtle', dmg: 'deathly', tough: 4, speed: 'Normal', range: 'Whole lane', special: 'Fusion. 2 tiles. 300 up close, laser pierces the lane.' },
  clean:   { name: 'Squeaky Clean', dmg: 4, tough: 4, speed: 'Normal', range: '3 lanes × 2 tiles', special: 'Fusion. Leaves shampoo puddles.' },
  ultima:  { name: 'Ultima Snapper', dmg: 5, tough: 4, speed: 'Very slow', range: '1 tile ahead', special: 'Fusion. 2 tiles. Gulps up to 5 zombies, even a Mutant, a car or a Boat Zombie.' },
  tesla:   { name: 'Tesla Coil', dmg: 5, tough: 4, speed: 'Every 10 s', range: 'Closest zombie to your house', special: 'Fusion. 2 tiles. Tap and pay 100 energy: 1500 + 750 splash.' }
};
const ALMANAC_ZOMBIES = {
  basic:   { name: 'Zombie', tough: 2, speed: 3, bite: 3, first: 'Wave 1', desc: 'A regular zombie. Shuffles toward your house and eats whatever is in the way.' },
  shield:  { name: 'Shield Bearer', tough: 3, speed: 3, bite: 3, first: 'Wave 2', desc: 'Hides behind a wooden shield that soaks up hits before it splinters.' },
  soup:    { name: 'Soup Can Head', tough: 4, speed: 3, bite: 3, first: 'Wave 3', desc: 'Wears a soup can as a helmet. Tough until it pops off.' },
  runner:  { name: 'Runnererer', tough: 3, speed: 5, bite: 3, first: 'Wave 4', desc: 'Sprints down the lane much faster than everyone else.' },
  noodler: { name: 'Pool Noodler', tough: 3, speed: 3, bite: 5, first: 'Wave 5', desc: 'Bites three times as hard as a normal zombie. In the pool he swims, with a second, blue noodle round his waist as a float.' },
  teacher: { name: 'Teacher', tough: 3, speed: [3, 4], bite: [3, 5], first: 'Wave 5', desc: 'Holds up a test. Break it and she goes furious: twice as fast and six times the bite.' },
  knight:  { name: 'Charging Knight', tough: 5, speed: 4, bite: 3, first: 'Wave 6', desc: 'Armoured and charging fast. Loses only his helmet when the armour breaks.' },
  mutant:  { name: 'Mutant', tough: 'undying', speed: 2, bite: 5, first: 'Wave 8', desc: 'A huge mutated zombie that stomps defenders flat. Only the Ultima Snapper can swallow him.' },
  tube:    { name: 'Swimming Tube Zombie', tough: 2, speed: 3, bite: 3, first: 'Level 11', desc: 'Paddles down the pool lanes in a rubber ring.' },
  shieldTube: { name: 'Shield Tube Zombie', tough: 3, speed: 3, bite: 3, first: 'Level 11', desc: 'A Shield Bearer floating in a rubber ring.' },
  soupTube: { name: 'Soup Can Tube Zombie', tough: 4, speed: 3, bite: 3, first: 'Level 12', desc: 'A Soup Can Head floating in a rubber ring. Tough until the can pops off.' },
  boatZ:   { name: 'Boat Zombie', tough: 4, speed: 4, bite: 'deathly', first: 'Level 14', desc: 'Roars down the pool lanes in a metal motorboat at 1.5x speed and rams defenders, crushing them at 2000 a second. Only ever in the water.' },
  swimmer: { name: 'Swimmer Zombie', tough: 1, speed: 4, bite: 3, first: 'Level 12', desc: 'Swims along under the water, where nothing can hit it: all you see are ripples. It only comes up to eat a defender, and that is when you can hit back. Weaker (0.75x health) but faster (1.3x) than a normal zombie.' },
  aquaMutant: { name: 'Aqua Mutant', tough: 'undying', speed: 3, bite: 5, first: 'Sandbox only', desc: 'A sea-green Mutant that wades down the pool lanes. 3000 health, walks at normal speed, and stomps defenders flat like the Mutant. Only the Ultima Snapper can swallow it.' },
  car:     { name: 'Car Zombie', tough: 4, speed: 5, bite: 'deathly', first: 'Sandbox only', desc: 'A zombie behind the wheel of a beat-up car. Takes up a tile and a half, drives at double speed and runs defenders over. A Forti Mau\'s armour can take one hit.' },
  ninja:   { name: 'Nunjaka', tough: 2, speed: [5, 0], bite: 3, first: 'Sandbox only', desc: 'A zombie monk. Dashes at double speed, then stops for 5 s of nunchuck tricks that knock flying projectiles back at your defenders.' },
  mini:    { name: 'Mini Teacher', tough: 2, speed: [3, 4], bite: [3, 5], first: 'Sandbox only', desc: 'Just like a Teacher, but with less health.' }
};
const meter = (n, green) => `<span class="alm-meter${green ? ' green' : ''}">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
// a couple of things are off the charts
const OFF_CHARTS = { undying: 'UNDYING????', deathly: 'DEATHLY' };
const rated = (n, green) => (Array.isArray(n) ? n : [n]).map(v => OFF_CHARTS[v]
  ? `<span class="alm-meter alm-max">${'<i class="on"></i>'.repeat(5)}</span><span class="alm-undying">${OFF_CHARTS[v]}</span>`
  : `${meter(v, green)}${RATE[v]}`).join(' <i class="alm-then">then</i> ');
function almanacPic(kind, isZombie, size) {
  const cv = document.createElement('canvas'); cv.width = size; cv.height = size;
  const g = cv.getContext('2d'); if (!g) return cv;
  if (isZombie) {
    const e = { kind, lane: 0, x: 0, hp: 1, maxHp: 1, base: 1, walking: false, wob: 0, hurtOverride: 0, noShadow: false,
      shieldUp: kind === 'shield' || kind === 'shieldTube', canUp: kind === 'soup' || kind === 'soupTube', knightUp: kind === 'knight', testUp: kind === 'teacher' || kind === 'mini' };
    const big = kind === 'mutant' || kind === 'aquaMutant';
    const saved = ctx;
    try {
      ctx = g;
      g.translate(size / 2, size * (kind === 'car' ? 0.8 : 0.94)); const k = size / (big ? 175 : kind === 'car' ? 175 : 138); g.scale(k, k);
      g.translate(0, -92);
      drawEnemy(e);
    } catch (err) {} finally { ctx = saved; }
  } else {
    const src = document.querySelector(`.card[data-unit="${kind}"] canvas`) || document.getElementById(`${kind}SeedArt`);
    if (src) try { g.drawImage(src, 0, 0, size, size); } catch (err) {}
  }
  return cv;
}
let almTab = 'defenders', almSel = null;
function almanacDetail(kind) {
  const el = document.getElementById('almDetail');
  almSel = kind;
  document.querySelectorAll('.alm-item').forEach(b => b.setAttribute('aria-pressed', b.dataset.kind === kind ? 'true' : 'false'));
  el.innerHTML = '';
  if (almTab === 'defenders') {
    const d = ALMANAC_DEFENDERS[kind], u = UNITS[kind] || {};
    const cost = u.seed ? 'Free (fusion seed)' : `${u.cost || 0} energy`;
    const recharge = u.recharge ? `${u.recharge} s` : 'None';
    el.innerHTML = `<h3>${d.name}</h3><div class="alm-pic"></div><p>${DESCRIPTIONS[kind] || d.special}</p>
      ${d.energy ? `<div class="alm-stat"><b>Energy</b><span>${d.energy}</span></div>` : ''}
      <div class="alm-stat"><b>Damage</b><span>${rated(d.dmg)}</span></div>
      <div class="alm-stat"><b>Toughness</b><span>${rated(d.tough, true)}</span></div>
      <div class="alm-stat"><b>Attack speed</b><span>${d.speed}</span></div>
      <div class="alm-stat"><b>Range</b><span>${d.range}</span></div>
      <div class="alm-stat"><b>Cost</b><span>${cost}</span></div>
      <div class="alm-stat"><b>Recharge</b><span>${recharge}</span></div>
      ${d.special ? `<div class="alm-stat"><b>Special</b><span>${d.special}</span></div>` : ''}`;
  } else {
    const z = ALMANAC_ZOMBIES[kind];
    el.innerHTML = `<h3>${z.name}</h3><div class="alm-pic"></div><p>${z.desc}</p>
      <div class="alm-stat"><b>Toughness</b><span>${rated(z.tough)}</span></div>
      <div class="alm-stat"><b>Speed</b><span>${rated(z.speed)}</span></div>
      <div class="alm-stat"><b>Bite</b><span>${rated(z.bite)}</span></div>
      <div class="alm-stat"><b>First seen</b><span>${z.first}</span></div>`;
  }
  el.querySelector('.alm-pic').appendChild(almanacPic(kind, almTab === 'zombies', 240));
}
function almanacGrid() {
  const grid = document.getElementById('almGrid'); grid.innerHTML = '';
  const list = almTab === 'defenders' ? ALMANAC_DEFENDERS : ALMANAC_ZOMBIES;
  let first = null;
  for (const [kind, info] of Object.entries(list)) {
    const b = document.createElement('button'); b.className = 'alm-item'; b.dataset.kind = kind; b.setAttribute('aria-pressed', 'false');
    b.appendChild(almanacPic(kind, almTab === 'zombies', 112));
    const n = document.createElement('span'); n.textContent = info.name; b.appendChild(n);
    b.addEventListener('click', () => almanacDetail(kind));
    grid.appendChild(b); if (!first) first = kind;
  }
  almanacDetail(first);
}
document.querySelectorAll('.alm-tab').forEach(t => t.addEventListener('click', () => {
  almTab = t.dataset.tab;
  document.querySelectorAll('.alm-tab').forEach(x => x.setAttribute('aria-selected', x === t ? 'true' : 'false'));
  almanacGrid();
}));
const almanacOverlay = document.getElementById('almanacOverlay');
document.getElementById('menuAlmanac').addEventListener('click', () => { showScreen(almanacOverlay); almanacGrid(); });
