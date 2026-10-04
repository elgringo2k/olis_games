// Board and DOM handles, game state, level definitions and saved progress
const board = document.getElementById('board');
let ctx = board.getContext('2d');
const boardCtx = ctx;
const cards = [...document.querySelectorAll('.card:not(.seed)')];
// defenders planted on top of another defender (or used on one) get gold cards
const UPGRADE_KINDS = ['forti', 'enraged', 'hsquid'];
const isUpgrade = u => UPGRADE_KINDS.includes(u);
cards.forEach(cd => cd.classList.toggle('upgrade', isUpgrade(cd.dataset.unit)));
// the Jicjajic gets the same blue-purple-green look as the fusion seed packets
cards.forEach(cd => cd.classList.toggle('fusion', cd.dataset.unit === 'jic'));
const seedBtns = { hyper: document.getElementById('hyperSeed'), clean: document.getElementById('cleanSeed'), ultima: document.getElementById('ultimaSeed'), tesla: document.getElementById('teslaSeed') };
const energyEl = document.getElementById('energy');
const pickCountEl = document.getElementById('pickCount');
const startBtnEl = document.getElementById('startBtn');
const waveEl = document.getElementById('wave');
const killsEl = document.getElementById('kills');
const startOverlay = document.getElementById('startOverlay');
const endOverlay = document.getElementById('endOverlay');

let state;
let debug = false, savedEnergy = 0;
const BASE_SLOTS = 7;
const maxSlots = () => ((level && level.slots) || BASE_SLOTS) + ((level && !level.sandbox) ? owned('slots') : 0);
const EARLY_ZOMBIES = ['basic', 'shield', 'soup'];
const LEVELS = {
  1: { name: 'Level 1', units: ['squid', 'turtle', 'whip', 'mau'], waves: 3, zombies: EARLY_ZOMBIES },
  2: { name: 'Level 2', units: ['squid', 'turtle', 'whip', 'mau', 'bee'], waves: 4, zombies: EARLY_ZOMBIES },
  3: { name: 'Level 3', units: ['squid', 'turtle', 'whip', 'mau', 'bee', 'spray'], waves: 5, zombies: ['basic', 'shield', 'soup', 'runner'] },
  4: { name: 'Level 4', units: ['squid', 'turtle', 'whip', 'mau', 'bee', 'spray', 'angry'], waves: 5, zombies: ['basic', 'shield', 'soup', 'runner', 'noodler'], finalAtLeast: { noodler: 3 } },
  challenge: { name: 'Jicjajic Challenge', units: 'challenge', startEnergy: 500, slots: BASE_SLOTS + 3, prep: 36, prepRound: 24, rounds: [
    { trickle: { kinds: ['basic'], count: 6, every: 6 }, horde: { kind: 'basic', count: 14, every: 0.75, banner: 'HORDE!' } },
    { trickle: { kinds: ['basic', 'shield'], count: 6, every: 6 }, horde: { kind: 'shield', count: 14, every: 0.75, banner: 'SHIELD HORDE!' } },
    { trickle: { kinds: ['basic', 'shield', 'soup'], count: 7, every: 5 }, horde: { kind: 'soup', count: 28, every: 0.45, banner: 'SOUP HORDE!' } },
    { trickle: { kinds: ['basic', 'shield', 'soup', 'knight'], count: 7, every: 5 }, horde: { kind: 'knight', count: 26, every: 0.45, banner: 'FINAL HORDE!' } }
  ] },
  5: { name: 'Level 5', units: ['squid', 'turtle', 'whip', 'mau', 'bee', 'spray', 'angry', 'lotl', 'snapper'], waves: 6,
       zombies: ['basic', 'shield', 'soup', 'runner', 'noodler', 'mutant'], finalBoss: 'mutant' },
  n1: { name: 'Level 6', night: true, units: ['squid', 'vamp', 'turtle', 'whip', 'mau', 'bee', 'spray', 'angry', 'lotl', 'snapper'],
        waves: 3, zombies: ['basic', 'shield'] },
  n2: { name: 'Level 7', night: true, units: ['squid', 'vamp', 'turtle', 'whip', 'mau', 'bee', 'spray', 'shampoo', 'angry', 'lotl', 'snapper'],
        waves: 3, zombies: ['basic', 'shield', 'soup'] },
  n3: { name: 'Level 8', night: true, units: ['squid', 'vamp', 'mini', 'turtle', 'whip', 'mau', 'bee', 'spray', 'shampoo', 'angry', 'lotl', 'snapper'],
        waves: 5, zombies: ['basic', 'shield', 'soup', 'runner'] },
  plan: { name: 'Plan Your Defences', units: 'owned', waves: 5, plan: true, startEnergy: 3125, banned: ['mini'], waveSize: 14, spawnGap: 1.6, noEnergy: true, noRecharge: true,
          zombies: ['basic', 'shield', 'soup', 'runner', 'knight'],
          waveAtLeast: { 5: { knight: 1 } }, finalAtLeast: { knight: 3, soup: 2, runner: 2 } },
  n4: { name: 'Level 9', night: true, units: ['squid', 'vamp', 'mini', 'turtle', 'whip', 'mau', 'bee', 'spray', 'shampoo', 'angry', 'lotl', 'snapper', 'chog'],
        waves: 5, zombies: ['basic', 'shield', 'soup', 'runner', 'mini'], finalAtLeast: { mini: 3 } },
  n5: { name: 'Level 10', night: true, units: ['squid', 'vamp', 'mini', 'turtle', 'whip', 'mau', 'bee', 'spray', 'shampoo', 'laser', 'angry', 'lotl', 'snapper', 'chog'],
        waves: 7, zombies: ['basic', 'shield', 'soup', 'runner', 'noodler', 'mini', 'knight'], noDeckKinds: ['knight'],
        finalAtLeast: { mini: 3 }, bossKnights: [3, 6] },
  p1: { name: 'Level 11', pool: true, units: ['boat', 'squid', 'vamp', 'mini', 'turtle', 'whip', 'mau', 'bee', 'spray', 'shampoo', 'laser', 'angry', 'lotl', 'snapper', 'chog'],
        waves: 5, zombies: ['basic', 'shield', 'soup', 'tube', 'shieldTube'] },
  // soup cans that end up in a water lane swim in a rubber ring here
  p2: { name: 'Level 12', pool: true, units: ['boat', 'squid', 'vamp', 'mini', 'turtle', 'whip', 'multi', 'mau', 'bee', 'spray', 'shampoo', 'laser', 'angry', 'lotl', 'snapper', 'chog'],
        waves: 5, zombies: ['basic', 'shield', 'soup', 'tube', 'shieldTube', 'soupTube'], finalAtLeast: { soup: 3 } },
  endless: { name: 'Endless', units: null, waves: Infinity },
  sandbox: { name: 'Sandbox', units: null, waves: Infinity, sandbox: true }
};
// the challenge gets every defender except the Jicjajic itself
const CHALLENGE_UNITS = Object.keys(UNITS).filter(u => !UNITS[u].seed && u !== 'jic');
for (const k in LEVELS) { if (LEVELS[k].units === 'challenge') { LEVELS[k].units = CHALLENGE_UNITS; LEVELS[k].waves = LEVELS[k].rounds.length; LEVELS[k].zombies = null; } }
let level = LEVELS.endless;
// defenders that are at home in the dark (everything else is a "day" defender)
const NIGHT_UNITS = new Set(['vamp', 'mini']);
const NIGHT_SLOWDOWN = 0.75;
// daytime levels, where night defenders doze off (Sandbox lets everything work)
const dayLevel = () => !level.night && !level.sandbox;
// which levels you've beaten, remembered in this browser
let progress = { beaten: {}, coins: 0, shop: {} };
try { const saved = JSON.parse(localStorage.getItem('lane-defense-progress') || 'null'); if (saved && saved.beaten) progress = Object.assign({ coins: 0, shop: {} }, saved); } catch (err) {}
function saveProgress() { try { localStorage.setItem('lane-defense-progress', JSON.stringify(progress)); } catch (err) {} }
function levelUnlocked(card) { const need = card.dataset.needs; if (need === 'soon') return false; return !need || !!progress.beaten[need] || !!progress.unlockAll; }
function refreshLevelCards() {
  if (typeof refreshNightButton === 'function') refreshNightButton();
  document.querySelectorAll('.level-card').forEach(card => {
    const open = levelUnlocked(card);
    card.classList.toggle('locked', !open);
    card.setAttribute('aria-disabled', open ? 'false' : 'true');
    const goal = card.querySelector('.level-goal');
    if (!goal.dataset.text) goal.dataset.text = goal.textContent;
    const need = card.dataset.needs || '';
    goal.textContent = open ? goal.dataset.text : need === 'soon' ? 'Coming soon' : need.startsWith('n') ? `Beat Level ${+need.slice(1) + 5} to unlock` : need.startsWith('c') ? `Beat Horde ${need.slice(1)} to unlock` : `Beat Level ${need} to unlock`;
  });
}
// only beating the Jicjajic Challenge unlocks it (the Unlock all button just opens levels)
const jicUnlocked = () => !!progress.beaten.challenge;
// once the Jicjajic Challenge is beaten, the Jicjajic joins every survival level (and Endless/Sandbox);
// the challenge itself never offers it
const ALL_ZOMBIES = ['basic', 'shield', 'soup', 'runner', 'noodler', 'knight', 'teacher', 'mutant'];
function levelZombies() {
  if (level.rounds) return [...new Set(level.rounds.flatMap(rd => rd.trickle.kinds.concat(rd.horde.kind)))];
  const kinds = level.zombies ? level.zombies.slice() : ALL_ZOMBIES.slice();
  if (level.finalBoss && !kinds.includes(level.finalBoss)) kinds.push(level.finalBoss);
  return kinds;
}
// Shop seed packets, and the defender each one is planted on top of
const SHOP_SEEDS = { enraged: 'angry', hsquid: 'squid', forti: 'mau' };
// Shop seed packets for defenders that stand on their own
const SHOP_UNITS = ['battery'];
const boughtInShop = u => !!(SHOP_SEEDS[u] || SHOP_UNITS.includes(u)) && !!owned(u);
const MAIN_LEVELS = ['1', '2', '3', '4', '5', 'n1', 'n2', 'n3', 'n4', 'n5', 'p1', 'p2'];
const ENERGY_MAKERS = ['squid', 'vamp', 'hsquid'];
function ownedUnits() {
  const own = new Set();
  for (const k of MAIN_LEVELS) {
    const card = document.querySelector(`.level-card[data-level="${k}"]`);
    if (card && levelUnlocked(card) && Array.isArray(LEVELS[k].units)) LEVELS[k].units.forEach(u => own.add(u));
  }
  return own;
}
const unitAllowed = u => {
  if (u === 'boat') return !!level.pool; // boats only make sense in the pool
  if (u === 'jic') return (jicUnlocked() || !!level.sandbox) && !level.rounds; // Sandbox always has it
  if (boughtInShop(u) && Array.isArray(level.units)) return true; // bought in the Shop: can be brought anywhere (with a warning if it can't be used)
  if (level.units === 'owned') return (ownedUnits().has(u) || boughtInShop(u)) && !(level.noEnergy && ENERGY_MAKERS.includes(u)) && !(level.banned || []).includes(u);
  return !level.units || level.units.includes(u);
};
const loadout = new Set();
let picking = true;
const DESCRIPTIONS = {
  multi: 'A brown-shelled turtle. Throws a rock down its lane and both lanes next to it.',
  boat: 'Floats on the water. Plant a defender in it to use the pool lanes.',
  loo: 'Bursts into 12 sheets flying in every direction. 250 to the first zombie each hits, 125 to the second.',
  wipes: 'Bursts into 12 wipes like a Loo Roll, and every zombie a wipe hits gets slippery foam on the 3×3 tiles around it.',
  battery: 'Tap it and pay 50 energy to zap the zombie closest to your house for 500. Every 5 s.',
  cobra: 'Its magnet steals soup cans and knight helmets, and pulls in cars and rips them open. Holds what it took for 10 s (car parts 20 s).',
  hsquid: 'Plant on a Sun Squid. Makes big 50-energy orbs. Falls asleep at night.',
  mini: 'A tiny night turtle. Free. Throws rocks up to 3 tiles ahead. 10 s recharge.',
  vamp: 'Makes small 10-energy orbs for 90 s, then grows up and makes normal 25-energy orbs.',
  squid: 'Makes an energy orb every 12 seconds. Tap orbs to collect them.',
  turtle: 'Throws a rock down the whole lane every 1.5 seconds.',
  chog: 'A tiny hedgehog that grows. Explodes when eaten: bigger the longer it waits.',
  snapper: 'A Venus flytrap. Opens when a zombie gets close, swallows it whole, then chews for 10 s.',
  digger: 'An excavator. Tap it, then tap anywhere to hurl a boulder: 500 damage plus 250 splash in a 3×3.',
  dragon: 'Tap him to switch gears. Gear 1 breathes fire; gear 2 sleeps and turns passing rocks into lava.',
  angry: 'Throws a burst of 2 rocks down the whole lane every 1.5 seconds.',
  enraged: 'Plant on an Angry Turtle. Throws a burst of 4 heavy rocks. 10 s recharge.',
  whip: 'Hits harder and faster than Rock Turtle, but only 3 tiles ahead.',
  mau: 'A big brick with 4500 health that soaks up bites.',
  forti: 'Upgrades a placed Mau Mau into a 10000-health fortress.',
  bee: 'Flies out to sting the closest zombie in his lane and poisons it.',
  spray: 'Mists every zombie in a 3-lane by 2-tile patch in front.',
  shampoo: 'Leaves a slippery pink tile that slows zombies by 50%.',
  laser: 'Fires a beam that hits every zombie in its lane.',
  lobster: 'Big pinch, one tile ahead. Best right behind a Mau Mau.',
  shark: 'Bites up to 2 tiles ahead and makes zombies bleed.',
  badger: 'Hides half buried and claws zombies walking over him.',
  jic: 'You can use this to fuse defenders together.',
  lotl: 'Explodes 1.5 s after planting for 1800 damage in a 3×3 area.'
};
