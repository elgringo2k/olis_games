// The game simulation: one step of everything moving, attacking and dying
function update(dt) {
  state.time += dt;
  if (debug) state.energy = 999999;
  for (const u in state.recharge) {
    if (state.recharge[u] > 0) {
      state.recharge[u] -= dt;
      if (state.recharge[u] <= 0) { state.recharge[u] = 0; syncUI(); }
    }
  }
  state.energyTimer += dt;
  if (state.energyTimer >= ENERGY_TICK) { state.energyTimer -= ENERGY_TICK; if (!level.noEnergy) { state.energy += ENERGY_GAIN; syncUI(); } }

  // the first zombie always arrives on time; slower spawn rates (like at night) kick in after that
  const planning = level.plan && !state.planStarted;
  if (!level.sandbox && !level.rounds && !planning) state.spawnTimer -= dt * (state.firstSpawned ? (level.spawnRate || 1) : 1);
  if (level.rounds && !state.spawningDone) {
    // each round: a few zombies trickle in, then that round's horde rushes in
    if (state.roundPhase == null) { state.round = 0; state.roundPhase = 'trickle'; state.rq = null; }
    const rd = level.rounds[state.round];
    if (!state.rq) {
      if (state.roundPhase === 'trickle') {
        state.rq = Array.from({ length: rd.trickle.count }, () => rd.trickle.kinds[Math.floor(Math.random() * rd.trickle.kinds.length)]);
        state.rqEvery = rd.trickle.every; state.rqTimer = state.round === 0 ? (level.prep || 12) : (level.prepRound || 8);
      } else {
        state.rq = Array(rd.horde.count).fill(rd.horde.kind);
        state.rqEvery = rd.horde.every; state.rqTimer = 3;
        state.banner = 3.2; state.bannerText = rd.horde.banner;
      }
      syncUI();
    }
    state.rqTimer -= dt;
    if (state.rqTimer <= 0 && state.rq.length) {
      spawnZombie(state.rq.pop(), Math.floor(Math.random() * ROWS));
      state.rqTimer = state.rqEvery;
    }
    if (!state.rq.length) {
      if (state.roundPhase === 'trickle') { state.roundPhase = 'horde'; state.rq = null; }
      else if (state.round < level.rounds.length - 1) { state.round++; state.roundPhase = 'trickle'; state.rq = null; syncUI(); }
      else state.spawningDone = true;
    }
  }
  if (state.banner > 0) state.banner -= dt;
  if (state.customQueue && state.customQueue.length) {
    state.customTimer -= dt;
    if (state.customTimer <= 0) {
      spawnZombie(state.customQueue.shift(), Math.floor(Math.random() * ROWS));
      state.customTimer = state.customGap || 0.7;
    }
  }
  if (state.finalQueue) {
    state.finalTimer -= dt;
    if (state.finalTimer <= 0) {
      // zombies pour in quickly, spread across the lanes
      const nextKind = state.finalQueue.pop();
      if (level.finalBoss && nextKind === level.finalBoss && !state.finalQueue.length) { state.banner = 3.2; state.bannerText = 'MUTANT!'; state.shake = 0.5; }
      spawnZombie(nextKind, Math.floor(Math.random() * ROWS));
      state.finalTimer = state.finalEvery || 0.45;
      if (!state.finalQueue.length) { state.finalQueue = null; state.spawningDone = true; }
    }
  }
  if (state.spawnTimer <= 0) {
    spawn();
    state.spawnEvery = level.spawnGap ? level.spawnGap : Math.max(2.8, state.spawnEvery * 0.95);
    state.spawnTimer = state.spawnEvery;
  }


  // Units
  const realDt = dt;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const t = state.grid[r][c]; if (!t) continue;
    // at night, day defenders do everything at 75% speed
    const dt = level.night && !NIGHT_UNITS.has(t.type) ? realDt * NIGHT_SLOWDOWN : realDt;
    if ((t.type === 'squid' || t.type === 'hsquid') && level.night) { t.asleep = true; t.glow = 0; continue; } // fast asleep: no orbs
    if (NIGHT_UNITS.has(t.type) && dayLevel()) { t.asleep = true; t.glow = 0; t.throwAnim = 0; continue; } // night defenders sleep in the sun
    if (t.type === 'battery' || t.type === 'tesla') {
      t.cool = Math.max(0, t.cool - dt);
      t.nope = Math.max(0, t.nope - dt);
      if (t.zap) { t.zap.t += dt; if (t.zap.t > 0.3) t.zap = null; }
      continue;
    }
    if (t.type === 'hsquid') {
      t.make -= dt;
      t.glow = Math.max(0, 1 - t.make / 2.5);
      if (t.make <= 0) {
        t.make = HSQUID.makeEvery;
        state.orbs.push({ x: c * CELL + 50, y: r * CELL + 40, vx: (Math.random() - 0.5) * 70, vy: -180, floor: r * CELL + 70, life: ORB_LIFE, value: HSQUID.orbValue, spin: 0, big: true });
      }
      continue;
    }
    if (t.type === 'squid') {
      t.make -= dt;
      t.glow = Math.max(0, 1 - t.make / 2.5);
      if (t.make <= 0) {
        t.make = SQUID.makeEvery;
        const cx = c * CELL + 50, cy = r * CELL + 40;
        state.orbs.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 70, vy: -180, floor: r * CELL + 70, life: ORB_LIFE, value: SQUID.orbValue, spin: 0 });
      }
      continue;
    }
    if (t.type === 'multi') {
      t.throwAnim = Math.max(0, t.throwAnim - dt * 4);
      t.cool -= dt;
      const tx = c * CELL + CELL / 2;
      const lanes = [r - 1, r, r + 1].filter(l => l >= 0 && l < ROWS);
      const target = state.enemies.some(e => lanes.includes(e.lane) && e.hp > 0 && e.x > tx - 20 && e.x < board.width + 10);
      if (target && t.cool <= 0) {
        t.cool = TURTLE.fireEvery; t.throwAnim = 1;
        for (const l of lanes) state.rocks.push({ lane: l, x: tx + 28, y: r * CELL + 42, ty: l * CELL + 42, spin: 0 });
      }
      continue;
    }
    if (t.type === 'mini') {
      t.throwAnim = Math.max(0, t.throwAnim - dt * 4);
      t.cool -= dt;
      const tx = c * CELL + CELL / 2;
      const target = state.enemies.some(e => e.lane === r && e.hp > 0 && e.x > tx - 20 && e.x <= tx + MINI.range);
      if (target && t.cool <= 0) {
        t.cool = TURTLE.fireEvery; t.throwAnim = 1;
        state.rocks.push({ lane: r, x: tx + 14, y: r * CELL + 60, spin: 0, maxX: tx + MINI.range + 20, mini: true });
      }
      continue;
    }
    if (t.type === 'vamp') {
      t.age += dt;
      const adult = t.age >= VAMP.growUp;
      if (adult && !t.wasAdult) { t.wasAdult = true; state.puffs.push({ x: c * CELL + 50, y: r * CELL + 50, t: 0, fortify: true, life: 0.6 }); }
      t.grown += ((adult ? 1 : 0) - t.grown) * Math.min(1, dt * 3);
      t.make -= dt;
      t.glow = Math.max(0, 1 - t.make / 2.5);
      if (t.make <= 0) {
        t.make = adult ? VAMP.adultEvery : VAMP.makeEvery;
        const value = adult ? VAMP.adultValue : VAMP.youngValue;
        state.orbs.push({ x: c * CELL + 50, y: r * CELL + 40, vx: (Math.random() - 0.5) * 70, vy: -180, floor: r * CELL + 70, life: ORB_LIFE, value, spin: 0, small: value < 25 });
      }
      continue;
    }
    if (t.type === 'hyperPart') continue;
    if (t.type === 'hyper') {
      t.cool -= dt; t.throwAnim = Math.max(0, t.throwAnim - dt * 4);
      if (t.lash) { t.lash.t += dt; if (t.lash.t > 0.4) t.lash = null; }
      const front = (c + 1) * CELL + CELL / 2;
      let target = null;
      for (const e of state.enemies) {
        if (e.lane !== r || e.hp <= 0 || e.x < front - 20 || e.x > board.width + 10) continue;
        if (!target || e.x < target.x) target = e;
      }
      if (target && t.cool <= 0) {
        t.cool = HYPER.attackEvery; t.throwAnim = 1;
        const close = target.x - front <= HYPER.whipRange;
        if (close) {
          // up close: one huge whip crack on the closest zombie...
          damage(target, HYPER.whipDmg);
          state.puffs.push({ x: target.x - 6, y: r * CELL + 40, t: 0, crack: true });
          state.puffs.push({ x: target.x - 6, y: r * CELL + 46, t: 0 });
          // ...and the laser still pierces on through everyone else in the lane
          for (const e of state.enemies) {
            if (e === target || e.lane !== r || e.hp <= 0 || e.x < front - 20 || e.x > board.width + 10) continue;
            damage(e, HYPER.dmg);
            state.puffs.push({ x: e.x, y: r * CELL + 40, t: 0, zap: true });
          }
        } else {
          // far away: the laser part pierces through every zombie down the lane
          for (const e of state.enemies) {
            if (e.lane !== r || e.hp <= 0 || e.x < front - 20 || e.x > board.width + 10) continue;
            damage(e, HYPER.dmg);
            state.puffs.push({ x: e.x, y: r * CELL + 40, t: 0, zap: true });
          }
        }
        t.lash = { x: target.x - 6, t: 0, close };
      }
      continue;
    }
    if (t.type === 'loo') {
      t.fuse -= dt;
      if (t.fuse <= 0) {
        // POOF: 12 sheets fly out in 12 directions
        const cx = c * CELL + 50, cy = r * CELL + 50, burst = (state.looBursts = (state.looBursts || 0) + 1);
        for (let i = 0; i < LOO.sheets; i++) {
          const a = i / LOO.sheets * Math.PI * 2;
          state.sheets.push({ x: cx, y: cy, vx: Math.cos(a) * LOO.speed, vy: Math.sin(a) * LOO.speed, spin: a, hits: 0, hit: [], burst });
        }
        removeUnit(r, c);
        state.puffs.push({ x: cx, y: cy, t: 0, paper: true, life: 0.6 });
      }
      continue;
    }
    if (t.type === 'lotl') {
      t.fuse -= dt;
      if (t.fuse <= 0) {
        // KABOOM: every zombie in the 3x3 around him
        const x0 = (c - 1) * CELL, x1 = (c + 2) * CELL;
        for (const e of state.enemies) {
          if (e.hp > 0 && Math.abs(e.lane - r) <= 1 && e.x >= x0 && e.x <= x1) {
            damage(e, e.kind === 'car' ? LOTL.carDmg : LOTL.dmg); // the car's body shields its driver a bit
            if (e.hp <= 0) e.ashed = true;
          }
        }
        removeUnit(r, c);
        state.puffs.push({ x: c * CELL + 50, y: r * CELL + 50, t: 0, boom: true, life: 0.7 });
        state.shake = 0.45;
      }
      continue;
    }
    if (t.type === 'badger') {
      // claws at every zombie standing on his tile
      let any = false;
      for (const e of state.enemies) {
        if (e.lane !== r || e.hp <= 0 || Math.floor(e.x / CELL) !== c) continue;
        damage(e, BADGER.dps * dt); any = true;
      }
      t.scratching = any ? Math.min(1, t.scratching + dt * 6) : Math.max(0, t.scratching - dt * 3);
      continue;
    }
    if (t.type === 'shark') {
      t.cool -= dt; t.lunge = Math.max(0, t.lunge - dt * 3);
      const x0 = c * CELL + CELL / 2 - 20, x1 = (c + 1 + SHARK.reach) * CELL + 15;
      let target = null;
      for (const e of state.enemies) {
        if (e.lane !== r || e.hp <= 0 || e.x < x0 || e.x > x1) continue;
        if (!target || e.x < target.x) target = e;
      }
      if (target && t.cool <= 0) {
        t.cool = SHARK.attackEvery; t.lunge = 1; t.lungeX = target.x - 10;
        damage(target, SHARK.bite);
        target.bleed = SHARK.bleedTime;
        state.puffs.push({ x: target.x - 6, y: r * CELL + 55, t: 0, chomp: true });
      }
      continue;
    }
    if (t.type === 'lobster') {
      t.cool -= dt; t.snap = Math.max(0, t.snap - dt * 3);
      const reach = lobsterReach(c);
      let target = null;
      for (const e of state.enemies) {
        if (e.lane !== r || e.hp <= 0 || e.x < reach.x0 || e.x > reach.x1) continue;
        if (!target || e.x < target.x) target = e;
      }
      if (target && t.cool <= 0) {
        t.cool = LOBSTER.attackEvery; t.snap = 1; t.snapX = target.x - 8;
        damage(target, LOBSTER.dmg);
        state.puffs.push({ x: target.x - 8, y: r * CELL + 55, t: 0, pinch: true });
      }
      continue;
    }
    if (t.type === 'laser') {
      t.cool -= dt; t.beam = Math.max(0, t.beam - dt);
      const tx = c * CELL + CELL / 2;
      const inLane = state.enemies.filter(e => e.lane === r && e.hp > 0 && e.x > tx - 20 && e.x < board.width + 10);
      if (inLane.length && t.cool <= 0) {
        t.cool = LASER.attackEvery; t.beam = 0.3;
        inLane.forEach(e => {
          damage(e, LASER.dmg);
          state.puffs.push({ x: e.x, y: r * CELL + 40, t: 0, zap: true });
        });
      } else if (!inLane.length && t.cool < LASER.charge) t.cool = LASER.charge;
      // charge glow builds only while there's something to shoot (worked out after firing)
      t.charging = inLane.length > 0 && t.cool < LASER.charge;
      continue;
    }
    if (t.type === 'ultima') {
      // like Snapper, but bigger: reaches the tile in front of its 2 tiles and gulps up to 5 zombies at once
      const front = (c + 1) * CELL + CELL / 2, headX = c * CELL + 92 + 30 * ULTIMA_SCALE;
      const eatTo = (c + 3) * CELL + 15, seeTo = (c + 3.25) * CELL + 15;
      const ok = e => e && e.hp > 0 && e.lane === r && e.x >= front - 20 && state.enemies.includes(e);
      const inRange = limit => state.enemies.filter(e => ok(e) && e.x <= limit).sort((a, b) => a.x - b.x);
      if (t.mode === 'chew') {
        t.chew -= dt;
        t.stretch += (0 - t.stretch) * Math.min(1, dt * 10);
        if (t.chew <= 0) {
          t.chew = 0; t.mode = 'burp'; t.burp = ULTIMA.burp; state.puffs.push({ x: c * CELL + 170, y: r * CELL + 20, t: 0, burp: true, life: 1.0 });
          // a car doesn't go down well: out comes a little blast and some of its pieces
          if (t.ateCar) { t.ateCar = false; burpCarParts(c * CELL + 160, r * CELL + 40, r * CELL + 88); }
        }
      } else if (t.mode === 'burp') {
        t.burp -= dt;
        if (t.burp <= 0) t.mode = 'closed';
      } else if (t.mode === 'lunge') {
        if (!ok(t.prey)) { t.mode = 'open'; t.prey = null; }
        else {
          t.lungeT += dt;
          const k = Math.min(1, t.lungeT / ULTIMA.lunge), ease = 1 - (1 - k) * (1 - k);
          t.stretch = Math.max(0, t.prey.x - 20 - headX) * ease;
          if (k >= 1) {
            // CHOMP: everything in reach, up to 5, goes down in one gulp
            let gulp = inRange(eatTo + 40).slice(0, ULTIMA.gulp);
            // a Mutant fills him right up: if one is in the gulp, he eats just that Mutant
            const mutant = gulp.find(e => e.kind === 'mutant');
            if (mutant) gulp = [mutant];
            for (const e of gulp) { e.eaten = true; e.hp = 0; state.puffs.push({ x: e.x - 10, y: r * CELL + 50, t: 0, chomp: true }); }
            state.shake = 0.2;
            t.prey = null; t.mode = 'chew'; t.chew = ULTIMA.chew; t.openK = 0; t.ate = gulp.length; t.ateCar = gulp.some(e => e.kind === 'car');
          }
        }
      } else {
        t.mode = inRange(seeTo).length ? 'open' : 'closed';
        t.stretch += (0 - t.stretch) * Math.min(1, dt * 10);
        const prey = t.openK > 0.75 ? inRange(eatTo)[0] : null;
        if (prey) { t.mode = 'lunge'; t.prey = prey; t.lungeT = 0; }
      }
      const wantOpen = t.mode === 'open' || t.mode === 'burp' || t.mode === 'lunge';
      t.openK = wantOpen ? Math.min(1, t.openK + dt * 5) : Math.max(0, t.openK - dt * 8);
      continue;
    }
    if (t.type === 'chog') {
      t.age += dt;
      const stage = t.age >= CHOG.grow[1] ? 2 : t.age >= CHOG.grow[0] ? 1 : 0;
      if (stage > t.stage) {
        t.stage = stage;
        state.puffs.push({ x: c * CELL + 50, y: r * CELL + 50, t: 0, fortify: true, life: 0.6 });
      }
      // grow smoothly towards the stage's size
      const target = [0, 0.5, 1][t.stage];
      t.size += (target - t.size) * Math.min(1, dt * 4);
      continue;
    }
    if (t.type === 'snapper') {
      // closed -> opens when a zombie is within 1.25 tiles -> stretches out and eats it within 1 tile
      // -> chews for 10 s -> opens up to burp -> closes again
      const tx = c * CELL + CELL / 2, headX = c * CELL + 40 + 30;
      const eatTo = (c + 2) * CELL + 15, seeTo = (c + 2.25) * CELL + 15;
      const tooBig = e => e.kind === 'mutant' || e.kind === 'car';
      const ok = e => e && e.hp > 0 && e.lane === r && !tooBig(e) && e.x >= tx - 20 && state.enemies.includes(e);
      const nearest = (limit) => {
        let best = null;
        for (const e of state.enemies) if (ok(e) && e.x <= limit && (!best || e.x < best.x)) best = e;
        return best;
      };
      if (t.mode === 'chew') {
        t.chew -= dt;
        t.stretch += (0 - t.stretch) * Math.min(1, dt * 10);
        if (t.chew <= 0) { t.chew = 0; t.mode = 'burp'; t.burp = SNAPPER.burp; state.puffs.push({ x: c * CELL + 80, y: r * CELL + 30, t: 0, burp: true, life: 1.0 }); }
      } else if (t.mode === 'burp') {
        t.burp -= dt;
        if (t.burp <= 0) t.mode = 'closed';
      } else if (t.mode === 'lunge') {
        if (!ok(t.prey)) { t.mode = 'open'; t.prey = null; }
        else {
          t.lungeT += dt;
          const k = Math.min(1, t.lungeT / SNAPPER.lunge), ease = 1 - (1 - k) * (1 - k);
          t.stretch = Math.max(0, t.prey.x - 14 - headX) * ease;
          if (k >= 1) {
            // CHOMP: swallowed whole
            t.prey.eaten = true; t.prey.hp = 0;
            state.puffs.push({ x: t.prey.x - 10, y: r * CELL + 50, t: 0, chomp: true });
            t.prey = null; t.mode = 'chew'; t.chew = SNAPPER.chew; t.openK = 0;
          }
        }
      } else {
        // too big to swallow, so a Mutant or a Car Zombie in reach gets bitten instead:
        // 300 every 1.5 s for the Mutant, 200 every 2 s for the car
        let mutant = null;
        for (const e of state.enemies) if (tooBig(e) && e.hp > 0 && e.lane === r && e.x >= tx - 20 && e.x <= eatTo + 30 && (!mutant || e.x < mutant.x)) mutant = e;
        t.mutantCool = Math.max(0, (t.mutantCool || 0) - dt);
        t.biteAnim = Math.max(0, (t.biteAnim || 0) - dt * 4);
        t.mode = nearest(seeTo) || mutant ? 'open' : 'closed';
        const prey = t.openK > 0.75 ? nearest(eatTo) : null;
        if (prey) { t.mode = 'lunge'; t.prey = prey; t.lungeT = 0; }
        else if (mutant && t.openK > 0.75 && t.mutantCool <= 0) {
          const car = mutant.kind === 'car';
          damage(mutant, car ? SNAPPER.carBite : SNAPPER.mutantBite);
          t.mutantCool = car ? SNAPPER.carEvery : SNAPPER.mutantEvery; t.biteAnim = 1;
          state.puffs.push({ x: mutant.x - 30, y: r * CELL + 50, t: 0, chomp: true });
        }
        // the neck snaps out for a bite and springs back
        const reachOut = mutant ? Math.max(0, mutant.x - 40 - headX) : 0;
        const target = t.biteAnim > 0 ? reachOut * Math.sin(t.biteAnim * Math.PI) : 0;
        t.stretch += (target - t.stretch) * Math.min(1, dt * (t.biteAnim > 0 ? 30 : 10));
      }
      const wantOpen = t.mode === 'open' || t.mode === 'burp' || t.mode === 'lunge';
      t.openK = wantOpen ? Math.min(1, t.openK + dt * 5) : Math.max(0, t.openK - dt * 8);
      continue;
    }
    if (t.type === 'digger') {
      t.heave = Math.max(0, (t.heave || 0) - dt * 3);
      if (!t.boulder) { t.dig -= dt; if (t.dig <= 0) { t.boulder = true; t.dig = 0; state.puffs.push({ x: c * CELL + 80, y: r * CELL + 80, t: 0, dirt: true, life: 0.5 }); } }
      continue;
    }
    if (t.type === 'dragon') {
      t.gearFlash = Math.max(0, t.gearFlash - dt);
      if (t.flame) { t.flame.t += dt; if (t.flame.t > 0.35) t.flame = null; }
      if (t.gear === 1) {
        t.cool -= dt;
        const tx = c * CELL + CELL / 2;
        let target = null;
        for (const e of state.enemies) {
          if (e.lane !== r || e.hp <= 0 || e.x < tx - 20 || e.x > tx + DRAGON.range + CELL / 2) continue;
          if (!target || e.x < target.x) target = e;
        }
        if (target && t.cool <= 0) {
          t.cool = DRAGON.attackEvery;
          damage(target, DRAGON.dmg);
          t.flame = { x: target.x - 6, t: 0 };
          state.puffs.push({ x: target.x - 6, y: r * CELL + 48, t: 0, fireHit: true, life: 0.5 });
        }
      }
      continue;
    }
    if (t.type === 'angry' || t.type === 'enraged') {
      const st = t.type === 'enraged' ? ENRAGED : ANGRY;
      t.throwAnim = Math.max(0, t.throwAnim - dt * 7);
      t.cool -= dt;
      const tx = c * CELL + CELL / 2;
      const target = state.enemies.some(e => e.lane === r && e.x > tx - 20 && e.x < board.width + 10);
      if (target && t.cool <= 0 && t.queued === 0) { t.cool = st.fireEvery; t.queued = st.burst; t.gap = 0; }
      if (t.queued > 0) {
        t.gap -= dt;
        if (t.gap <= 0) {
          t.queued--; t.gap = st.burstGap; t.throwAnim = 1;
          state.rocks.push({ lane: r, x: tx + 28, y: r * CELL + 42, spin: 0, dmg: st.rockDmg, big: t.type === 'enraged' });
        }
      }
      continue;
    }
    if (t.type === 'shampoo') {
      t.cool -= dt; t.squeeze = Math.max(0, t.squeeze - dt * 4);
      const tx = c * CELL + CELL / 2;
      const target = state.enemies.some(e => e.lane === r && e.x > tx - 20 && e.x < board.width + 10);
      if (target && t.cool <= 0) {
        t.cool = SHAMPOO.attackEvery; t.squeeze = 1;
        state.rocks.push({ kind: 'shampoo', lane: r, x: tx + 14, y: r * CELL + 30, spin: 0 });
      }
      continue;
    }
    if (t.type === 'clean') {
      t.cool -= dt;
      t.mist = Math.max(0, t.mist - dt);
      t.squeeze = Math.max(0, t.squeeze - dt * 5);
      const a = sprayArea(r, c);
      const inArea = state.enemies.filter(e => e.hp > 0 && e.lane >= a.r0 && e.lane <= a.r1 && e.x >= a.x0 && e.x <= a.x1);
      if (inArea.length && t.cool <= 0) {
        t.cool = CLEAN.attackEvery; t.mist = 0.5; t.squeeze = 1;
        Sound.play('spray');
        inArea.forEach(e => { damage(e, CLEAN.dmg); addPuddle(e.lane, Math.floor(e.x / CELL)); });
      }
      continue;
    }
    if (t.type === 'spray') {
      t.cool -= dt;
      t.mist = Math.max(0, t.mist - dt);
      t.squeeze = Math.max(0, t.squeeze - dt * 5);
      const a = sprayArea(r, c);
      const inArea = state.enemies.filter(e => e.hp > 0 && e.lane >= a.r0 && e.lane <= a.r1 && e.x >= a.x0 && e.x <= a.x1);
      if (inArea.length && t.cool <= 0) {
        t.cool = SPRAY.attackEvery; t.mist = 0.5; t.squeeze = 1;
        Sound.play('spray');
        inArea.forEach(e => damage(e, SPRAY.dmg));
      }
      continue;
    }
    if (t.type === 'bee') {
      t.cool -= dt;
      const alive = e => e && e.hp > 0 && state.enemies.includes(e);
      const closest = () => {
        let best = null, bd = Infinity;
        for (const e of state.enemies) {
          if (e.lane !== r || e.hp <= 0 || e.x > board.width) continue;
          const d = Math.abs(e.x - t.hx);
          if (d < bd) { bd = d; best = e; }
        }
        return best;
      };
      if (t.mode === 'home') {
        t.x = t.hx; t.y = t.hy;
        if (t.cool <= 0) {
          const e = closest();
          if (e) { t.target = e; t.mode = 'out'; t.cool = BEE.attackEvery; }
        }
      } else if (t.mode === 'out') {
        if (!alive(t.target)) t.target = closest();
        if (!t.target) { t.mode = 'back'; }
        else {
          const tx = t.target.x + 4, ty = r * CELL + 30;
          const dx = tx - t.x, dy = ty - t.y, d = Math.hypot(dx, dy), step = BEE.flySpeed * dt;
          t.face = dx >= 0 ? 1 : -1;
          if (d <= step + 8) {
            damage(t.target, BEE.sting);
            t.target.poison = BEE.poisonTime;
            state.puffs.push({ x: tx, y: ty + 6, t: 0, sting: true });
            t.mode = 'back'; t.target = null;
          } else { t.x += dx / d * step; t.y += dy / d * step; }
        }
      } else if (t.mode === 'back') {
        const dx = t.hx - t.x, dy = t.hy - t.y, d = Math.hypot(dx, dy), step = BEE.flySpeed * dt;
        t.face = dx >= 0 ? 1 : -1;
        if (d <= step) { t.x = t.hx; t.y = t.hy; t.mode = 'home'; t.face = 1; }
        else { t.x += dx / d * step; t.y += dy / d * step; }
      }
      continue;
    }
    if (t.type === 'mau') {
      t.blink -= dt; if (t.blink < -0.15) t.blink = 2 + Math.random() * 3;
      continue;
    }
    if (t.type === 'whip') {
      t.throwAnim = Math.max(0, t.throwAnim - dt * 5);
      if (t.lash) { t.lash.t += dt; if (t.lash.t > 0.22) t.lash = null; }
      t.cool -= dt;
      const tx = c * CELL + CELL / 2;
      let target = null;
      for (const e of state.enemies) {
        if (e.lane !== r || e.hp <= 0) continue;
        const d = e.x - tx;
        if (d > -20 && d <= WHIP.range && (!target || e.x < target.x)) target = e;
      }
      if (target && t.cool <= 0) {
        t.cool = WHIP.attackEvery; t.throwAnim = 1;
        damage(target, WHIP.dmg);
        t.lash = { x: target.x - 6, t: 0 };
        state.puffs.push({ x: target.x - 6, y: r * CELL + 40, t: 0, crack: true });
      }
      continue;
    }
    t.throwAnim = Math.max(0, t.throwAnim - dt * 4);
    t.cool -= dt;
    const tx = c * CELL + CELL / 2;
    const target = state.enemies.some(e => e.lane === r && e.x > tx - 20 && e.x < board.width + 10);
    if (target && t.cool <= 0) {
      t.cool = TURTLE.fireEvery; t.throwAnim = 1;
      state.rocks.push({ lane: r, x: tx + 28, y: r * CELL + 42, spin: 0 });
    }
  }

  // Rocks
  for (const k of state.rocks) {
    const isShampoo = k.kind === 'shampoo';
    k.x += (isShampoo ? SHAMPOO.speed : TURTLE.rockSpeed) * dt * (k.back ? -1 : 1); k.spin += dt * 12;
    if (k.back) {
      // knocked back by a Nunjaka: hits the first defender it reaches
      const col = Math.floor(k.x / CELL);
      const hitT = col >= 0 && col < COLS ? state.grid[k.lane][col] : null;
      const victim = hitT && hitT.type === 'hyperPart' ? hitT.main : hitT;
      if (victim && k.x < col * CELL + CELL * 0.7) {
        victim.hp -= isShampoo ? SHAMPOO.dmg : (k.dmg || TURTLE.rockDmg);
        state.puffs.push(isShampoo ? { x: k.x, y: k.y + 10, t: 0, splat: true } : { x: k.x, y: k.y + 6, t: 0 });
        k.dead = true;
        if (victim.hp <= 0) removeUnit(k.lane, col);
      }
      if (k.x < -40) k.dead = true;
      continue;
    }
    if (k.ty != null) k.y += (k.ty - k.y) * Math.min(1, dt * 9);
    if (!isShampoo && !k.lava) {
      const col = Math.floor(k.x / CELL);
      const under = col >= 0 && col < COLS ? state.grid[k.lane][col] : null;
      if (under && under.type === 'dragon' && under.gear === 2) {
        k.lava = true; k.dmg = (k.dmg || TURTLE.rockDmg) * 2;
        state.puffs.push({ x: k.x, y: k.y, t: 0, fireHit: true, life: 0.35 });
      }
    }
    const hit = state.enemies.find(e => e.lane === k.lane && Math.abs(e.x - k.x) < (e.kind === 'car' ? CAR.halfLen : 28) && e.hp > 0);
    if (hit && hit.kind === 'ninja' && hit.tricks) {
      // CLACK: deflected straight back the way it came
      k.back = true; k.x = hit.x - 30;
      state.puffs.push({ x: hit.x - 24, y: k.y, t: 0, crack: true });
      continue;
    }
    if (hit) {
      k.dead = true;
      if (isShampoo) {
        damage(hit, SHAMPOO.dmg);
        // the puddle covers the whole tile the zombie is standing on
        const col = Math.max(0, Math.min(COLS - 1, Math.floor(hit.x / CELL)));
        const existing = state.puddles.find(pd => pd.lane === k.lane && pd.col === col);
        if (existing) existing.life = SHAMPOO.puddleLife;
        else state.puddles.push({ lane: k.lane, col, x: col * CELL + CELL / 2, life: SHAMPOO.puddleLife, seed: Math.random() * 10 });
        state.puffs.push({ x: k.x, y: k.y + 10, t: 0, splat: true });
      } else {
        damage(hit, k.dmg || TURTLE.rockDmg);
        state.puffs.push(k.lava ? { x: k.x, y: k.y + 6, t: 0, fireHit: true, life: 0.45 } : { x: k.x, y: k.y + 6, t: 0 });
      }
    }
    if (k.x > board.width + 40 || (k.maxX && k.x > k.maxX)) k.dead = true;
  }
  state.rocks = state.rocks.filter(k => !k.dead);

  if (state.shake > 0) state.shake = Math.max(0, state.shake - dt);

  // Puddles
  for (const pd of state.puddles) pd.life -= dt;
  state.puddles = state.puddles.filter(pd => pd.life > 0);

  // Enemies
  for (const e of state.enemies) {
    const ecol = Math.floor(e.x / CELL);
    e.slowed = state.puddles.some(pd => pd.lane === e.lane && pd.col === ecol);
    e.wob += dt * 5 * (e.slowed ? 1 - SHAMPOO.slow : 1);
    if (e.poison > 0) { const pt = Math.min(dt, e.poison); e.poison -= dt; damage(e, BEE.poisonDps * pt); }
    if (e.bleed > 0) { const bt = Math.min(dt, e.bleed); e.bleed -= dt; damage(e, SHARK.bleedDps * bt); }
    if (e.kind === 'ninja') {
      e.trickTimer -= dt;
      if (e.trickTimer <= 0) { e.tricks = !e.tricks; e.trickTimer = e.tricks ? NINJA.tricks : NINJA.walk; }
      if (e.tricks) { e.spinA += dt * 22; e.walking = false; continue; } // busy showing off: no walking, no biting
    }
    const front = e.kind === 'car' ? CAR.halfLen : 30;
    const col = Math.floor((e.x - front) / CELL);
    const cell = col >= 0 && col < COLS ? state.grid[e.lane][col] : null;
    const blocker = cell && !(UNITS[cell.type] && UNITS[cell.type].underfoot) ? cell : null;
    const t = blocker && blocker.type === 'hyperPart' ? blocker.main : blocker;
    if (e.kind === 'car' && (e.bump || 0) > 0) { e.bump -= dt; e.walking = false; continue; } // rocking back after a hit
    if (t && e.kind === 'car' && e.x - front - (col * CELL + CELL / 2) < 25) {
      // the car runs defenders over. A Forti Mau's armour takes the first hit (and stops the car for a moment)
      if (t.type === 'mau' && t.forti) {
        t.forti = false; t.hp = MAU.hp; t.maxHp = MAU.hp;
        state.puffs.push({ x: col * CELL + 50, y: e.lane * CELL + 45, t: 0, splinter: true, life: 0.6 });
        state.shake = 0.25; e.bump = 0.6;
      } else if (t.twoTile && (e.crushTarget !== t || e.crushT < CAR.crushTwoTile)) {
        // a 2-tile fusion is too big to flatten in one go: the car grinds against it for 3 s
        if (e.crushTarget !== t) { e.crushTarget = t; e.crushT = 0; }
        e.crushT += dt; e.walking = false;
        t.hp = Math.min(t.hp, t.maxHp * (1 - e.crushT / CAR.crushTwoTile));
        if (Math.floor(e.crushT * 3) !== Math.floor((e.crushT - dt) * 3)) {
          state.puffs.push({ x: e.x - front, y: e.lane * CELL + 80, t: 0, stomp: true, life: 0.4 });
          state.shake = Math.max(state.shake || 0, 0.1);
        }
      } else {
        if (t.type === 'chog') chogBlast(t, e.lane, col);
        removeUnit(e.lane, col);
        state.puffs.push({ x: col * CELL + 50, y: e.lane * CELL + 80, t: 0, stomp: true, life: 0.5 });
        state.shake = 0.3;
      }
      continue;
    }
    if (t && e.x - front - (col * CELL + CELL / 2) < 25) {
      e.walking = false;
      if (e.kind === 'mutant') {
        // Mutant stomps instead of biting
        if (e.smashCool == null) e.smashCool = MUTANT.windup;
        e.smashCool -= dt;
        if (e.smashCool <= 0) {
          t.hp -= t.type !== 'mau' ? MUTANT.smashDmg : t.maxHp / (t.forti ? MUTANT.fortiStrikes : MUTANT.mauStrikes);
          e.smashCool = MUTANT.smashEvery;
          state.puffs.push({ x: col * CELL + CELL / 2, y: e.lane * CELL + 88, t: 0, stomp: true, life: 0.5 });
          state.shake = 0.25;
        }
      } else {
        // Pool Noodlers bonk defenders for triple damage
        t.hp -= ENEMY.bite * (e.angry ? 6 : e.kind === 'noodler' ? 3 : 1) * dt;
        Sound.play('bite');
      }
      if (t.hp <= 0) { if (t.type === 'chog') chogBlast(t, e.lane, col); removeUnit(e.lane, col); }
    } else {
      if (e.kind === 'mutant') e.smashCool = null;
      e.x -= ENEMY.speed * e.speedMul * (e.slowed ? 1 - SHAMPOO.slow : 1) * dt; e.walking = true;
    }
    if (e.x < -10 && !state.over) endGame();
  }
  if (state.spawningDone && !state.enemies.length && !state.over) { winLevel(); return; }
  const before = state.enemies.length;
  state.enemies.forEach(e => {
    if (e.hp > 0) return;
    maybeDropCoin(e);
    if (e.eaten) return; // swallowed by a Snapper: nothing left to show
    if (e.ashed) {
      // blown up by a Temper-lotl or Chog-chog: a charred statue that crumbles to ash
      state.puffs.push({ t: 0, life: 1.6, ash: true, snap: snapshotEnemy(e, true), x: e.x, y: e.lane * CELL + 92, h: e.kind === 'mutant' ? 170 : 105 });
    } else if (e.kind === 'car') {
      // destroyed in one hit, the car blows apart on the spot; otherwise it breaks down first:
      // it sits there sputtering and smoking, then blows apart (see the puff loop below)
      if (e.instakill) blowUpCar(e.x, e.lane * CELL + 92);
      else state.puffs.push({ t: 0, life: CAR.breakdown, carWreck: true, snap: snapshotEnemy(e, false), x: e.x, y: e.lane * CELL + 92 });
    } else if (e.kind === 'mutant') {
      // the Mutant's huge head pops off, then the body topples over with a thud
      state.puffs.push({ t: 0, life: 2.4, topple: true, delay: 0.25, snap: snapshotEnemy(e, false, true), x: e.x, y: e.lane * CELL + 92, thudded: false });
      state.puffs.push({ t: 0, life: 1.8, headPop: true, huge: true, hy: 126, floor: 98, snap: snapshotHead(e), x: e.x, y: e.lane * CELL + 92, ox: 0, oy: 0,
        vx: 60 + Math.random() * 40, vy: -380 - Math.random() * 60, spin: 0, vs: 4 + Math.random() * 3, bounced: false });
    } else {
      // POP: the head flies off first, then the body falls over
      state.puffs.push({ t: 0, life: 1.6, topple: true, small: true, delay: 0.18, snap: snapshotEnemy(e, false, true), x: e.x, y: e.lane * CELL + 92, thudded: false });
      state.puffs.push({ t: 0, life: 1.4, headPop: true, snap: snapshotHead(e), x: e.x, y: e.lane * CELL + 92, ox: 0, oy: 0,
        vx: 70 + Math.random() * 60, vy: -330 - Math.random() * 80, spin: 0, vs: 6 + Math.random() * 6, ground: 0, bounced: false });
    }
  });
  state.enemies = state.enemies.filter(e => e.hp > 0);
  if (state.enemies.length !== before) { state.kills += before - state.enemies.length; syncUI(); }

  // Loo roll sheets in flight
  for (const sh of state.sheets) {
    sh.x += sh.vx * dt; sh.y += sh.vy * dt; sh.spin += dt * 5;
    if (sh.x < -40 || sh.x > board.width + 40 || sh.y < -40 || sh.y > board.height + 40) { sh.dead = true; continue; }
    for (const e of state.enemies) {
      if (e.hp <= 0 || sh.hit.includes(e)) continue;
      const ey = e.lane * CELL + 50;
      if (Math.abs(sh.x - e.x) < (e.kind === 'car' ? CAR.halfLen + 6 : 34) && Math.abs(sh.y - ey) < 46) {
        // a single Loo Roll can only land 4 sheets on any one zombie; extra sheets sail past
        e.looHits = e.looHits || {};
        if ((e.looHits[sh.burst] || 0) >= LOO.maxPerZombie) { sh.hit.push(e); continue; }
        e.looHits[sh.burst] = (e.looHits[sh.burst] || 0) + 1;
        damage(e, LOO.dmg[sh.hits]);
        sh.hit.push(e); sh.hits++;
        if (sh.hits >= LOO.dmg.length) {
          // second zombie: the sheet pops into bits of paper
          sh.dead = true;
          state.puffs.push({ x: sh.x, y: sh.y, t: 0, paper: true, life: 0.6 });
        } else {
          state.puffs.push({ x: sh.x, y: sh.y, t: 0, splinter: false });
        }
        break;
      }
    }
  }
  state.sheets = state.sheets.filter(sh => !sh.dead);

  // Battery bolts in flight
  for (const b of state.bolts) {
    b.t += dt;
    // if the target is gone, find the next zombie closest to the house
    if (!b.target || b.target.hp <= 0 || !state.enemies.includes(b.target)) {
      b.target = null;
      for (const e of state.enemies) if (e.hp > 0 && (!b.target || e.x < b.target.x)) b.target = e;
      if (!b.target) { b.dead = true; continue; }
    }
    const tx = b.target.x, ty = b.target.lane * CELL + 45;
    const dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy), step = BATTERY.boltSpeed * dt;
    b.ang = Math.atan2(dy, dx);
    if (d <= step + 10) {
      damage(b.target, b.dmg || BATTERY.dmg);
      if (b.tesla) {
        // the Tesla bolt bursts, hitting everything in the 3x3 around its target
        const tc = Math.floor(b.target.x / CELL), tl = b.target.lane;
        for (const e of state.enemies) {
          if (e === b.target || e.hp <= 0) continue;
          if (Math.abs(e.lane - tl) <= 1 && Math.abs(Math.floor(e.x / CELL) - tc) <= 1) damage(e, TESLA.splash);
        }
      }
      state.puffs.push({ x: tx, y: ty, t: 0, zap: true });
      state.puffs.push({ x: tx, y: ty, t: 0, fireHit: true, life: 0.45 });
      state.shake = b.tesla ? 0.4 : 0.18;
      if (b.tesla) state.puffs.push({ x: tx, y: ty, t: 0, boom: true, life: 0.5, scale: 0.6 });
      b.dead = true;
    } else { b.x += dx / d * step; b.y += dy / d * step; }
  }
  state.bolts = state.bolts.filter(b => !b.dead);

  // Boulders in flight
  for (const b of state.boulders) {
    b.t += dt;
    if (b.t >= DIGGER.flight && !b.done) {
      b.done = true;
      for (const e of state.enemies) {
        if (e.hp <= 0) continue;
        const ec = Math.floor(e.x / CELL);
        if (e.lane === b.tr && ec === b.tc) damage(e, DIGGER.dmg);
        else if (Math.abs(e.lane - b.tr) <= 1 && Math.abs(ec - b.tc) <= 1) damage(e, DIGGER.splash);
      }
      state.puffs.push({ x: b.x1, y: b.y1 + 25, t: 0, stomp: true, life: 0.6 });
      state.puffs.push({ x: b.x1, y: b.y1, t: 0, crash: true, life: 0.8 });
      state.shake = 0.35;
    }
  }
  state.boulders = state.boulders.filter(b => !b.done);

  // Seed packets fade away if you don't grab them
  for (const k of state.packets) { k.life -= dt; k.bob += dt * 3; }
  state.packets = state.packets.filter(k => k.life > 0);

  // Orbs
  for (const o of state.orbs) {
    o.spin += dt * 2;
    if (o.collected) { o.ct += dt; if (o.ct > 0.45) o.dead = true; continue; }
    if (o.y < o.floor || o.vy < 0) { o.vy += 520 * dt; o.x += o.vx * dt; o.y += o.vy * dt; }
    if (o.y >= o.floor && o.vy > 0) { o.y = o.floor; o.vy = 0; o.vx = 0; }
    o.life -= dt; if (o.life <= 0) o.dead = true;
  }
  state.orbs = state.orbs.filter(o => !o.dead);
  for (const cn of state.coins) {
    cn.spin += dt * 4;
    if (cn.collected) { cn.ct += dt; if (cn.ct > 0.45) cn.dead = true; continue; }
    if (cn.y < cn.floor || cn.vy < 0) { cn.vy += 700 * dt; cn.x += cn.vx * dt; cn.y += cn.vy * dt; }
    if (cn.y >= cn.floor && cn.vy > 0) { cn.y = cn.floor; cn.vy = 0; cn.vx = 0; }
    cn.life -= dt; if (cn.life <= 0) cn.dead = true;
  }
  state.coins = state.coins.filter(cn => !cn.dead);

  for (const p of state.puffs) {
    if (!p.heard) {
      p.heard = true;
      Sound.play(p.big ? 'die' : p.crack ? 'whip' : p.splat ? 'squish' : p.sting ? 'sting' : p.zap ? 'zap' : p.pinch ? 'pinch'
        : p.chomp ? 'chomp' : p.dirt ? 'dig' : p.stomp ? 'thud' : p.canFall ? 'clank' : p.splinter ? 'woodBreak' : p.shards ? 'metal'
        : p.paper ? 'paper' : p.boom ? 'boom' : p.merge ? 'merge' : p.fortify ? 'upgrade' : p.fireHit ? 'fire' : p.crash ? 'crash'
        : p.burp ? 'burp' : p.ash ? 'ash' : p.topple ? (p.small ? 'die' : null) : p.dust ? null : p.armFall ? 'woodBreak' : p.carWreck ? 'clank' : p.carParts ? 'metal' : 'rockHit');
    }
    p.t += dt;
    if (p.carWreck && !p.blown && p.t >= p.life) {
      // the broken-down car finally blows apart
      p.blown = true;
      blowUpCar(p.x, p.y);
    }
    if (p.carParts) for (const k of p.carParts) {
      // pieces fly, fall and bounce to a stop on the grass
      if (k.landed) continue;
      k.vy += 900 * dt; k.x += k.vx * dt; k.y += k.vy * dt; k.rot += k.vr * dt;
      if (k.y > p.floor) {
        k.y = p.floor; k.vy *= -0.35; k.vx *= 0.6; k.vr *= 0.5;
        if (Math.abs(k.vy) < 40) { k.landed = true; k.rot = k.kind === 'wheel' ? k.rot : Math.round(k.rot / Math.PI) * Math.PI; }
      }
    }
  }
  // new rocks, globs, orbs and zombies
  for (const k of state.rocks) if (!k.heard) { k.heard = true; Sound.play(k.kind === 'shampoo' ? 'squish' : 'throw'); }
  for (const o of state.orbs) if (!o.heard) { o.heard = true; Sound.play('orb'); }
  for (const e of state.enemies) if (!e.heard) { e.heard = true; if (Math.random() < 0.5) Sound.play('groan'); }
  for (const k of state.rocks) if (k.lava && !k.lavaHeard) { k.lavaHeard = true; Sound.play('lavaHit'); }
  if (state.banner > 0 && !state.bannerHeard) { state.bannerHeard = true; Sound.play('horn'); }
  if (!(state.banner > 0)) state.bannerHeard = false;
  // music follows the action
  Sound.setMood(state.finalStarted || state.roundPhase === 'horde' ? 'intense' : 'play');
  state.puffs = state.puffs.filter(p => p.t < (p.life || 0.45));
}

function winLevel() {
  state.over = true; state.running = false;
  Sound.play('win');
  const key = Object.keys(LEVELS).find(k => LEVELS[k] === level);
  if (key) { progress.beaten[key] = true; saveProgress(); refreshLevelCards(); }
  document.getElementById('winTitle').textContent = `${level.name} complete!`;
  document.getElementById('winText').textContent = level.rounds
    ? `You survived all ${level.rounds.length} hordes and knocked out ${state.kills} zombies! The Jicjajic is now unlocked in Endless and Sandbox.`
    : `You held off all ${level.waves} waves and the final wave, knocking out ${state.kills} zombies.`;
  const nextBtn = document.querySelector('#winOverlay .to-levels');
  if (nextBtn) nextBtn.textContent = key === '5' ? 'On to Level 6 🌙' : 'Levels';
  winOverlay.classList.add('show');
}
function endGame() {
  Sound.play('lose');
  state.over = true; state.running = false;
  document.getElementById('endText').textContent =
    `You held out to wave ${state.wave} and knocked out ${state.kills} zombie${state.kills === 1 ? '' : 's'}.`;
  endOverlay.classList.add('show');
}
