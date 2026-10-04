// Defender and zombie stats, plus a few small helpers that only use them
const COLS = 9, ROWS = 5, CELL = 100;
const TURTLE = { cost: 100, hp: 300, fireEvery: 1.5, rockDmg: 20, rockSpeed: 420 };
const SQUID  = { cost: 50, hp: 300, makeEvery: 12, firstAfter: 5, orbValue: 25 };
const WHIP   = { cost: 125, hp: 300, attackEvery: TURTLE.fireEvery / 1.5, dmg: TURTLE.rockDmg * 1.5, range: 3 * CELL };
const MAU    = { cost: 50, hp: 4500, recharge: 5 };
const FORTI  = { cost: 125, hp: 10000, recharge: 10, upgrades: 'mau' };
// can this upgrade go on what's standing there?
function canUpgrade(kind, here) {
  if (!here) return false;
  if (kind === 'forti') return here.type === 'mau' && !here.forti;
  if (kind === 'enraged') return here.type === 'angry';
  if (kind === 'hsquid') return here.type === 'squid';
  return false;
}
const BEE    = { cost: 200, hp: 300, attackEvery: 4, sting: 20, poisonDps: 30, poisonTime: 5, flySpeed: 900 };
const SPRAY  = { cost: 175, hp: 300, attackEvery: 1.5, dmg: 20, width: 3, length: 2 };
const SHAMPOO = { cost: 150, hp: 300, attackEvery: 3, dmg: 20, speed: 360, puddleLife: 10, slow: 0.5 };
const LASER  = { cost: 300, hp: 300, attackEvery: 2, dmg: 100, charge: 0.5 };
const LOBSTER = { cost: 175, hp: 300, attackEvery: 3, dmg: 105 };
// the tile in front, including zombies chewing on whatever stands there
function lobsterReach(c) { return { x0: c * CELL + CELL / 2 - 20, x1: (c + 2) * CELL + 15 }; }
const SHARK  = { cost: 250, hp: 300, attackEvery: 2, bite: 60, bleedDps: 35, bleedTime: 3, reach: 2 };
const BADGER = { cost: 100, hp: 300, dps: 62.5, underfoot: true };
const LOTL   = { cost: 125, hp: 300, fuse: 1.5, dmg: 1800, underfoot: true, recharge: 20, carDmg: 1000 };
const JIC    = { cost: 50, hp: 300, onTurtle: true };
const HYPER  = { hp: 900, attackEvery: 1.5, dmg: 150, whipDmg: 300, whipRange: 3 * CELL };
const HYPER_SEED = { cost: 0, hp: HYPER.hp, twoTile: true, seed: true };
// Ultima Snapper: 2 tiles, swallows up to 5 zombies in one gulp (even a Mutant)
const TESLA  = { cost: 0, hp: 900, seed: true, twoTile: true, shotCost: 100, dmg: 1500, splash: 750, reload: 10 };
const ULTIMA_SCALE = 1.4, ULTIMA_Y = 92 - 30 * 1.4;
const ULTIMA = { cost: 0, hp: 900, twoTile: true, seed: true, gulp: 5, chew: 10, burp: 1.0, lunge: 0.25 };
const CLEAN  = { cost: 0, hp: 600, attackEvery: 1.5, dmg: 60, seed: true };
const PACKET_LIFE = 10;
const ANGRY  = { cost: 175, hp: 300, fireEvery: 1.5, burst: 2, burstGap: 0.18 };
const ENRAGED = { cost: 200, hp: 300, fireEvery: 1.5, burst: 4, burstGap: 0.14, recharge: 10, upgrades: 'angry', rockDmg: TURTLE.rockDmg * 1.5 };
const DRAGON = { cost: 200, hp: 300, attackEvery: 1.5, dmg: 50, range: 3 * CELL };
const DIGGER = { cost: 275, hp: 300, digTime: 15, dmg: 500, splash: 250, flight: 0.9 };
const SNAPPER = { cost: 150, hp: 300, chew: 10, burp: 1.0, lunge: 0.22, mutantBite: 300, mutantEvery: 1.5, carBite: 200, carEvery: 2 };
// stages: tiny -> after 13 s bigger -> after 26 s humongous; it only does damage when it gets eaten
const CHOG = { cost: 50, hp: 300, recharge: 35, grow: [13, 26], blasts: [{ dmg: 400, r: 1 }, { dmg: 1000, r: 1 }, { dmg: 1800, r: 2 }] };
// grown-up Vampire Squids make orbs at 2/3 the rate (one every 18 s instead of 12)
const VAMP   = { cost: 25, hp: 300, recharge: 5, adultEvery: 18, makeEvery: 12, firstAfter: 5, youngValue: 10, adultValue: 25, growUp: 90 };
const MINI   = { cost: 0, hp: 300, recharge: 10, range: 3 * CELL };
const MULTI  = { cost: 250, hp: 300 };
const HSQUID = { cost: 125, hp: 300, makeEvery: 12, firstAfter: 5, orbValue: 50, upgrades: 'squid' };
const BATTERY = { cost: 125, hp: 300, shotCost: 50, dmg: 500, reload: 5, boltSpeed: 520 };
// Loo Roll: bursts into 12 sheets as soon as it's planted; each sheet hits 2 zombies (250, then 125)
const BOAT   = { cost: 25, hp: 300, recharge: 3 };
const LOO    = { cost: 150, hp: 300, fuse: 0.35, sheets: 12, dmg: [250, 125], speed: 280, size: 1.6, maxPerZombie: 4 };
// Wipes: bursts just like a Loo Roll, but every zombie a wipe hits gets a 3x3 patch of foam around it (foam slows like shampoo)
const WIPES  = { cost: 200, hp: 300, fuse: LOO.fuse };
// Magneticobra: steals soup cans and knight helmets (holds one for 10 s), and pulls in cars and rips them open (holds the parts for 20 s)
const COBRA  = { cost: 100, hp: 300, reach: 3, hold: 10, carHold: 20, pullSpeed: 420 };
const COBRA_TIP = { x: 30, y: -6 }; // the gap between the ends of his horseshoe body, from the middle of his tile
const UNITS  = { wipes: WIPES, cobra: COBRA, boat: BOAT, loo: LOO, tesla: TESLA, battery: BATTERY, hsquid: HSQUID, multi: MULTI, mini: MINI, vamp: VAMP, ultima: ULTIMA, chog: CHOG, snapper: SNAPPER, digger: DIGGER, dragon: DRAGON, enraged: ENRAGED, angry: ANGRY, clean: CLEAN, hyper: HYPER_SEED, jic: JIC, lotl: LOTL, badger: BADGER, forti: FORTI, shark: SHARK, lobster: LOBSTER, laser: LASER, turtle: TURTLE, squid: SQUID, whip: WHIP, mau: MAU, bee: BEE, spray: SPRAY, shampoo: SHAMPOO };
// lanes and x-range a spray at (r, c) covers
function sprayArea(r, c) {
  return { r0: Math.max(0, r - 1), r1: Math.min(ROWS - 1, r + 1), x0: (c + 1) * CELL - 10, x1: (c + 1 + SPRAY.length) * CELL };
}
const ORB_LIFE = 10;
const ENEMY  = { hp: 200, speed: 20, bite: 100 };
// Mutant stomps flatten a Mau Mau in 2 strikes and a Forti Mau in 5
const MUTANT = { smashDmg: 300, mauStrikes: 2, fortiStrikes: 5, smashEvery: 1.5, windup: 0.6 };
const ENERGY_TICK = 10, ENERGY_GAIN = 25;
