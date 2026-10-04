// Building waves and spawning zombies
// Each batch of 8 zombies is a shuffled "deck" with a guaranteed mix,
// so every wave reliably includes the special zombies it should.
  // The Mutant shows up once in wave 8, except in Endless where it keeps coming back
function mutantsForWave(wave) {
  if (level === LEVELS.endless) {
    // Endless: a Mutant wave every other wave from 8 (8, 10, 12...): 1, 1, then one more each time
    if (wave < 8 || (wave - 8) % 2 !== 0) return 0;
    const n = (wave - 8) / 2;
    return n <= 1 ? 1 : n;
  }
  return wave === 8 ? 1 : 0;
}
function buildDeck(wave) {
  const size = (level && level.waveSize) || 8;
  const shieldChance = wave < 2 ? 0 : Math.min(0.45, 0.15 + (wave - 2) * 0.06);
  const soupChance = wave < 3 ? 0 : Math.min(0.3, 0.1 + (wave - 3) * 0.05);
  const shields = wave < 2 ? 0 : Math.max(1, Math.round(size * shieldChance));
  const soups = wave < 3 ? 0 : Math.max(1, Math.round(size * soupChance));
  const runners = wave < 4 ? 0 : wave < 6 ? 1 : 2;
  const noodlers = wave < ((level && level.noodlersFrom) || 5) ? 0 : 1;
  const knights = wave < 6 ? 0 : 1;
  const teachers = wave < 5 ? 0 : 1;
  const mutants = mutantsForWave(wave);
  const deck = [];
  for (let i = 0; i < mutants; i++) deck.push('mutant');
  for (let i = 0; i < runners; i++) deck.push('runner');
  for (let i = 0; i < noodlers; i++) deck.push('noodler');
  for (let i = 0; i < knights; i++) deck.push('knight');
  for (let i = 0; i < teachers; i++) deck.push('teacher');
  for (let i = 0; i < shields; i++) deck.push('shield');
  for (let i = 0; i < soups; i++) deck.push('soup');
  // level-specific zombies: one of each per batch from the wave they join
  for (const [kind, from] of Object.entries((level && level.joins) || {})) if (wave >= from) deck.push(kind);
  if (level.zombies) for (let i = 0; i < deck.length; i++) if (!level.zombies.includes(deck[i]) || (level.noDeckKinds || []).includes(deck[i])) deck[i] = 'basic';
  for (const [kind, n] of Object.entries((level.waveAtLeast || {})[wave] || {})) {
    let have = deck.filter(k => k === kind).length;
    for (let i = 0; i < deck.length && have < n; i++) if (deck[i] === 'basic') { deck[i] = kind; have++; }
    while (have < n) { deck.push(kind); have++; }
  }
  while (deck.length < size) deck.push('basic');
  if (level.zombieShare) {
    const keep = Math.max(1, Math.ceil(deck.length * level.zombieShare));
    while (deck.length > keep) {
      const b = deck.indexOf('basic');
      deck.splice(b >= 0 ? b : deck.length - 1, 1);
    }
  }
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return deck;
}
// Every level ends with a big final wave: a warning banner, then a rush of zombies
function startFinalWave() {
  if (state.finalStarted) return;
  state.finalStarted = true;
  state.banner = 3.2;
  if (level.bossKnights) state.bannerText = 'BOSS WAVE!';
  const rush = buildDeck(level.waves).concat(buildDeck(level.waves)).slice(0, Math.ceil((8 + level.waves * 2) * (level.zombieShare || 1)));
  // some levels guarantee a minimum of certain zombies in the final wave (swapping out basic zombies)
  for (const [kind, n] of Object.entries(level.finalAtLeast || {})) {
    let have = rush.filter(k => k === kind).length;
    for (let i = 0; i < rush.length && have < n; i++) if (rush[i] === 'basic') { rush[i] = kind; have++; }
    while (have < n) { rush.push(kind); have++; }
  }
  for (let i = rush.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [rush[i], rush[j]] = [rush[j], rush[i]]; }
  if (level.bossKnights) {
    const [lo, hi] = level.bossKnights, n = lo + Math.floor(Math.random() * (hi - lo + 1));
    for (let i = 0; i < n; i++) rush.splice(Math.floor(Math.random() * (rush.length + 1)), 0, 'knight');
    state.bossKnights = n;
  }
  // the boss (or bosses) always come out last (the queue is popped from the end)
  for (const boss of [].concat(level.finalBoss || [])) rush.unshift(boss);
  state.finalQueue = rush;
  state.finalTimer = 3;
  syncUI();
}
function spawn() {
  if (state.spawningDone || state.finalStarted) return;
  state.firstSpawned = true;
  if (!state.deck || !state.deck.length) {
    // each new batch of zombies is a new wave
    if (state.deck) {
      if (state.wave >= level.waves) { startFinalWave(); return; }
      state.wave++; syncUI();
    }
    state.deck = buildDeck(state.wave);
  }
  spawnZombie(state.deck.pop(), Math.floor(Math.random() * ROWS));
}
function spawnZombie(kind, lane, x = board.width + 30) {
  const base = ENEMY.hp + (state.wave - 1) * 20;
  if (level.pool) {
    // zombies in a water lane swim in a rubber ring (a Pool Noodler swims as he is, in a noodle float);
    // the ones that can't swim go to a grass lane instead
    const SWIMMERS = { basic: 'tube', shield: 'shieldTube' };
    if (!level.zombies || level.zombies.includes('soupTube')) SWIMMERS.soup = 'soupTube'; // (Sandbox's pool has them too)
    const swimmer = Object.values(SWIMMERS).includes(kind);
    // Boat Zombies, Swimmer Zombies and Aqua Mutants only ever come down a water lane
    const waterOnly = kind === 'boatZ' || kind === 'swimmer' || kind === 'aquaMutant';
    if (waterOnly && !WATER_LANES.includes(lane)) lane = WATER_LANES[Math.floor(Math.random() * WATER_LANES.length)];
    const wet = WATER_LANES.includes(lane);
    if (wet && SWIMMERS[kind]) kind = SWIMMERS[kind];
    else if (wet && !swimmer && !waterOnly && kind !== 'noodler') { const dry = [...Array(ROWS).keys()].filter(l => !WATER_LANES.includes(l)); lane = dry[Math.floor(Math.random() * dry.length)]; }
    else if (!wet && swimmer) kind = Object.keys(SWIMMERS).find(k => SWIMMERS[k] === kind);
  }
  if (kind === 'swimmer' && !level.pool) kind = 'basic'; // no water to swim in
  if (kind === 'aquaMutant' && !level.pool) kind = 'mutant';
  const mult = kind === 'swimmer' ? SWIMMER.hp : kind === 'shieldTube' ? 3 : kind === 'soupTube' ? 5.5 : kind === 'car' ? 7 : kind === 'mini' ? 1.75 : kind === 'teacher' ? 3.5 : kind === 'knight' ? 10 : kind === 'mutant' ? 15 : kind === 'noodler' ? 2.5 : kind === 'soup' ? 5.5 : kind === 'shield' ? 3 : kind === 'runner' ? 2 : 1;
  const hp = kind === 'boatZ' ? BOATZ.hp : kind === 'aquaMutant' ? AQUA.hp : base * mult;
  // a Swimmer Zombie starts out underwater, in its own list where no defender can see it
  (kind === 'swimmer' ? state.divers : state.enemies).push({ kind, lane, x, hp, maxHp: hp, base, swimming: !!(level.pool && WATER_LANES.includes(lane)), submerged: kind === 'swimmer',
    shieldUp: kind === 'shield', canUp: kind === 'soup' || kind === 'soupTube', speedMul: kind === 'aquaMutant' ? AQUA.speed : kind === 'swimmer' ? SWIMMER.speed : kind === 'boatZ' ? BOATZ.speed : kind === 'car' ? 2 : kind === 'ninja' ? NINJA.speed : kind === 'runner' ? 2.5 : kind === 'knight' ? 1.5 : kind === 'mutant' ? 0.75 : 1, knightUp: kind === 'knight', testUp: kind === 'teacher' || kind === 'mini', angry: false,
    testAt: kind === 'teacher' ? base * 2.5 : kind === 'mini' ? base * 1.25 : 0, wob: Math.random() * 6,
    tricks: false, trickTimer: kind === 'ninja' ? NINJA.walk : 0, spinA: 0 });
}
