// Music and sound effects
// ===================== SOUND =====================
// Everything is synthesized with the Web Audio API: no sound files needed.
const Sound = (() => {
  let ac = null, master, musicBus, sfxBus, noiseBuf;
  let musicOn = true, sfxOn = true;
  try { const pref = JSON.parse(localStorage.getItem('rsvz-sound') || 'null'); if (pref) { musicOn = pref.music !== false; sfxOn = pref.sfx !== false; } } catch (err) {}
  const savePref = () => { try { localStorage.setItem('rsvz-sound', JSON.stringify({ music: musicOn, sfx: sfxOn })); } catch (err) {} };
  function init() {
    if (ac) return true;
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = 0.8; master.connect(ac.destination);
      musicBus = ac.createGain(); musicBus.gain.value = musicOn ? 0.22 : 0; musicBus.connect(master);
      sfxBus = ac.createGain(); sfxBus.gain.value = sfxOn ? 0.55 : 0; sfxBus.connect(master);
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return true;
    } catch (err) { ac = null; return false; }
  }
  const resume = () => { if (init() && ac.state === 'suspended') ac.resume(); };
  // ---- building blocks
  function tone({ type = 'sine', f = 440, f2 = null, t = 0, dur = 0.2, vol = 0.3, attack = 0.005, bus = null, detune = 0 }) {
    if (!ac) return;
    const t0 = ac.currentTime + t, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0); o.detune.value = detune;
    if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(1, f2), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(bus || sfxBus); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noise({ t = 0, dur = 0.2, vol = 0.3, filter = 'lowpass', f = 1200, f2 = null, q = 1, attack = 0.005, bus = null }) {
    if (!ac) return;
    const t0 = ac.currentTime + t, src = ac.createBufferSource(), flt = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = noiseBuf; src.loop = true;
    flt.type = filter; flt.frequency.setValueAtTime(f, t0); flt.Q.value = q;
    if (f2) flt.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(flt).connect(g).connect(bus || sfxBus); src.start(t0, Math.random()); src.stop(t0 + dur + 0.05);
  }
  // ---- the sound effects
  const FX = {
    click:     () => { tone({ type: 'triangle', f: 900, f2: 1300, dur: 0.06, vol: 0.12 }); },
    place:     () => { tone({ type: 'sine', f: 520, f2: 180, dur: 0.16, vol: 0.35 }); noise({ dur: 0.12, vol: 0.12, f: 600 }); },
    upgrade:   () => { [523, 659, 784, 1047].forEach((f, i) => tone({ type: 'square', f, t: i * 0.06, dur: 0.14, vol: 0.08 })); },
    orb:       () => { tone({ type: 'sine', f: 1400, f2: 2200, dur: 0.18, vol: 0.08 }); },
    collect:   () => { [880, 1175, 1568].forEach((f, i) => tone({ type: 'triangle', f, t: i * 0.05, dur: 0.18, vol: 0.18 })); },
    throw:     () => { noise({ dur: 0.12, vol: 0.12, filter: 'bandpass', f: 900, f2: 2200, q: 2 }); },
    rockHit:   () => { tone({ type: 'square', f: 180, f2: 70, dur: 0.08, vol: 0.12 }); noise({ dur: 0.06, vol: 0.15, f: 1500 }); },
    lavaHit:   () => { noise({ dur: 0.35, vol: 0.2, filter: 'highpass', f: 2500, f2: 6000 }); tone({ type: 'sawtooth', f: 160, f2: 60, dur: 0.2, vol: 0.12 }); },
    whip:      () => { noise({ dur: 0.07, vol: 0.4, filter: 'highpass', f: 3000, attack: 0.002 }); tone({ type: 'square', f: 1800, f2: 400, dur: 0.05, vol: 0.12 }); },
    zap:       () => { tone({ type: 'sawtooth', f: 1600, f2: 220, dur: 0.22, vol: 0.14 }); tone({ type: 'square', f: 2400, f2: 600, dur: 0.12, vol: 0.06 }); },
    sting:     () => { tone({ type: 'sawtooth', f: 220, dur: 0.12, vol: 0.12, detune: 30 }); tone({ type: 'sine', f: 1400, f2: 800, t: 0.08, dur: 0.08, vol: 0.12 }); },
    spray:     () => { noise({ dur: 0.35, vol: 0.18, filter: 'highpass', f: 4000, f2: 2500 }); },
    squish:    () => { tone({ type: 'sine', f: 300, f2: 120, dur: 0.16, vol: 0.25 }); noise({ dur: 0.1, vol: 0.12, f: 500 }); },
    pinch:     () => { tone({ type: 'square', f: 1200, f2: 300, dur: 0.06, vol: 0.18 }); noise({ dur: 0.05, vol: 0.2, filter: 'highpass', f: 2000 }); },
    chomp:     () => { tone({ type: 'square', f: 160, f2: 60, dur: 0.1, vol: 0.2 }); noise({ dur: 0.08, vol: 0.25, f: 900 }); },
    bite:      () => { noise({ dur: 0.06, vol: 0.13, f: 700, q: 3 }); },
    burp:      () => { tone({ type: 'sawtooth', f: 110, f2: 70, dur: 0.45, vol: 0.2, detune: 20 }); noise({ dur: 0.4, vol: 0.08, f: 300 }); },
    fire:      () => { noise({ dur: 0.35, vol: 0.25, filter: 'bandpass', f: 600, f2: 1800, q: 0.8 }); },
    dig:       () => { noise({ dur: 0.18, vol: 0.2, f: 400 }); tone({ type: 'sine', f: 120, f2: 60, dur: 0.15, vol: 0.15 }); },
    heave:     () => { noise({ dur: 0.4, vol: 0.12, filter: 'bandpass', f: 400, f2: 1200 }); },
    crash:     () => { tone({ type: 'sine', f: 90, f2: 30, dur: 0.5, vol: 0.45 }); noise({ dur: 0.45, vol: 0.35, f: 1200, f2: 200 }); },
    thud:      () => { tone({ type: 'sine', f: 90, f2: 35, dur: 0.45, vol: 0.55, attack: 0.02 }); noise({ dur: 0.25, vol: 0.15, f: 300 }); },
    boom:      () => { tone({ type: 'sine', f: 70, f2: 25, dur: 0.9, vol: 0.6 }); noise({ dur: 0.9, vol: 0.5, f: 2000, f2: 120, attack: 0.002 }); },
    merge:     () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone({ type: 'triangle', f, t: i * 0.07, dur: 0.35, vol: 0.14 })); tone({ type: 'sine', f: 2093, t: 0.35, dur: 0.5, vol: 0.08 }); },
    woodBreak: () => { noise({ dur: 0.2, vol: 0.3, filter: 'bandpass', f: 800, q: 3 }); tone({ type: 'square', f: 300, f2: 120, dur: 0.12, vol: 0.12 }); },
    clank:     () => { tone({ type: 'square', f: 1200, dur: 0.25, vol: 0.1 }); tone({ type: 'square', f: 1710, dur: 0.2, vol: 0.06 }); },
    metal:     () => { [1300, 1850, 2470].forEach((f, i) => tone({ type: 'triangle', f, t: i * 0.03, dur: 0.4, vol: 0.09 })); noise({ dur: 0.15, vol: 0.2, filter: 'highpass', f: 3000 }); },
    paper:     () => { noise({ dur: 0.25, vol: 0.25, filter: 'highpass', f: 2500, f2: 5000, q: 2 }); },
    angry:     () => { tone({ type: 'sawtooth', f: 180, f2: 320, dur: 0.35, vol: 0.18, detune: 25 }); },
    diamond:   () => { [1568, 2093, 2637, 3136].forEach((f, i) => tone({ type: 'triangle', f, t: i * 0.06, dur: 0.3, vol: 0.12 })); },
    coin:      () => { tone({ type: 'square', f: 1320, dur: 0.07, vol: 0.12 }); tone({ type: 'square', f: 1760, t: 0.07, dur: 0.18, vol: 0.12 }); },
    flop:      () => { tone({ type: 'sine', f: 140, f2: 60, dur: 0.18, vol: 0.25 }); noise({ dur: 0.12, vol: 0.12, f: 500 }); },
    die:       () => { tone({ type: 'sawtooth', f: 260, f2: 90, dur: 0.35, vol: 0.12, detune: -20 }); noise({ dur: 0.2, vol: 0.1, f: 800 }); },
    ash:       () => { noise({ dur: 0.8, vol: 0.15, filter: 'highpass', f: 1500, f2: 400 }); },
    groan:     () => { const f = 90 + Math.random() * 40; tone({ type: 'sawtooth', f, f2: f * 0.7, dur: 0.7, vol: 0.09, attack: 0.15, detune: 15 }); },
    gear:      () => { tone({ type: 'square', f: 400, dur: 0.05, vol: 0.12 }); tone({ type: 'square', f: 600, t: 0.06, dur: 0.05, vol: 0.12 }); },
    aim:       () => { tone({ type: 'triangle', f: 660, f2: 990, dur: 0.12, vol: 0.12 }); },
    packet:    () => { tone({ type: 'sine', f: 784, f2: 1568, dur: 0.3, vol: 0.12 }); },
    horn:      () => { [0, 0.45].forEach(t => { tone({ type: 'sawtooth', f: 220, t, dur: 0.38, vol: 0.18 }); tone({ type: 'sawtooth', f: 277, t, dur: 0.38, vol: 0.12 }); }); },
    win:       () => { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone({ type: 'square', f, t: i * 0.13, dur: 0.22, vol: 0.12 })); },
    lose:      () => { [392, 370, 349, 262].forEach((f, i) => tone({ type: 'sawtooth', f, f2: i === 3 ? 196 : null, t: i * 0.32, dur: i === 3 ? 0.8 : 0.3, vol: 0.13 })); }
  };
  // stop the same sound from piling up when lots happen at once
  const last = {}, GAP = { bite: 0.14, rockHit: 0.05, zap: 0.08, die: 0.08, groan: 1.4, throw: 0.06, orb: 0.2, spray: 0.15, fire: 0.1, squish: 0.08 };
  function play(name) {
    if (!sfxOn || !ac || ac.state !== 'running' || !FX[name]) return;
    const now = ac.currentTime, gap = GAP[name] != null ? GAP[name] : 0.03;
    if (last[name] != null && now - last[name] < gap) return;
    last[name] = now;
    try { FX[name](); } catch (err) {}
  }
  // ---- music: a little procedural tune with three moods
  const MOODS = {
    menu:    { bpm: 92,  chords: [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]], drums: 0, scale: [0, 2, 4, 7, 9] },
    play:    { bpm: 116, chords: [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]], drums: 1, scale: [0, 2, 4, 7, 9] },
    intense: { bpm: 140, chords: [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 56, 59]], drums: 2, scale: [0, 3, 5, 7, 10] }
  };
  let mood = 'menu', nextTime = 0, step = 0, timer = null;
  // a short melody shape the tune keeps coming back to, varied each bar
  const MELODY = [0, 2, 4, 2, 3, 4, 1, null, 2, 4, 3, 2, 1, 0, null, null];
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  function scheduleStep(t) {
    const M = MOODS[mood], beat = 60 / M.bpm / 2; // eighth notes
    const bar = Math.floor(step / 8) % 4, pos = step % 8, chord = M.chords[bar];
    const at = t - ac.currentTime;
    // bass on the beat
    if (pos % 2 === 0) tone({ type: 'triangle', f: mtof(chord[0] - 24 + (pos === 4 ? 7 : 0)), t: at, dur: beat * 1.8, vol: 0.5, bus: musicBus });
    // soft chord stabs
    if (pos === 0 || pos === 3 || pos === 6) chord.forEach(n => tone({ type: 'square', f: mtof(n), t: at, dur: beat * 0.9, vol: 0.05, bus: musicBus }));
    // melody
    const mi = MELODY[(step + bar * 3) % MELODY.length];
    if (mi != null && (mood !== 'menu' || pos % 2 === 0)) {
      const deg = M.scale[mi % M.scale.length], oct = mood === 'intense' ? 12 : 0;
      tone({ type: 'triangle', f: mtof(chord[0] + 12 + deg + oct), t: at, dur: beat * 1.1, vol: 0.16, bus: musicBus });
    }
    // drums
    if (M.drums > 0) {
      if (pos === 0 || pos === 4 || (M.drums > 1 && pos === 6)) tone({ type: 'sine', f: 140, f2: 45, t: at, dur: 0.18, vol: 0.6, bus: musicBus });
      if (pos === 2 || pos === 6) noise({ t: at, dur: 0.12, vol: 0.18, filter: 'bandpass', f: 1800, q: 0.8, bus: musicBus });
      if (M.drums > 1 || pos % 2 === 1) noise({ t: at, dur: 0.03, vol: 0.08, filter: 'highpass', f: 7000, bus: musicBus });
    }
    step++;
    return beat;
  }
  function tick() {
    if (!ac || ac.state !== 'running') return;
    if (nextTime < ac.currentTime) nextTime = ac.currentTime + 0.05;
    while (nextTime < ac.currentTime + 0.25) nextTime += scheduleStep(nextTime);
  }
  function startMusic() { if (!timer) timer = setInterval(tick, 60); }
  return {
    resume, play, startMusic,
    setMood(m) { if (MOODS[m] && m !== mood) { mood = m; } },
    get musicOn() { return musicOn; }, get sfxOn() { return sfxOn; },
    toggleMusic() { musicOn = !musicOn; savePref(); if (musicBus) musicBus.gain.value = musicOn ? 0.22 : 0; return musicOn; },
    toggleSfx() { sfxOn = !sfxOn; savePref(); if (sfxBus) sfxBus.gain.value = sfxOn ? 0.55 : 0; return sfxOn; }
  };
})();
function playThud() { Sound.play('thud'); }
const musicBtn = document.getElementById('musicToggle'), sfxBtn = document.getElementById('sfxToggle');
musicBtn.setAttribute('aria-pressed', Sound.musicOn ? 'true' : 'false');
sfxBtn.setAttribute('aria-pressed', Sound.sfxOn ? 'true' : 'false');
musicBtn.addEventListener('click', () => musicBtn.setAttribute('aria-pressed', Sound.toggleMusic() ? 'true' : 'false'));
sfxBtn.addEventListener('click', () => sfxBtn.setAttribute('aria-pressed', Sound.toggleSfx() ? 'true' : 'false'));
// browsers only allow sound after you tap something, so wake the audio up on the first tap
const wakeAudio = () => { Sound.resume(); Sound.startMusic(); };
document.addEventListener('pointerdown', wakeAudio);
document.addEventListener('keydown', wakeAudio);
// every button gives a little click
document.addEventListener('click', e => { if (e.target && e.target.closest && e.target.closest('button')) Sound.play('click'); });
