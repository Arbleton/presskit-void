(function generateMineralGrain() {
  const gCanvas = document.createElement('canvas');
  gCanvas.width = 160; gCanvas.height = 160;
  const gCtx = gCanvas.getContext('2d');
  const imgData = gCtx.createImageData(160, 160);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = Math.random() * 255;
    data[i] = val; data[i + 1] = val; data[i + 2] = val;
    data[i + 3] = Math.random() > 0.45 ? 180 : 35;
  }
  gCtx.putImageData(imgData, 0, 0);
  document.getElementById('mineral-grain').style.backgroundImage = `url(${gCanvas.toDataURL('image/png')})`;
})();

const eqCanvas = document.getElementById('ableton-eq-bg');
const eqCtx = eqCanvas.getContext('2d');
let w, h, eqTime = 0, scrollY = 0, mouseX = 0.5, mouseY = 0.5;

const motion = matchMedia('(prefers-reduced-motion: reduce)');
const pointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 861px)');
const dawCursor = document.getElementById('daw-cursor');
const dawReadout = document.getElementById('daw-readout');
const mini = document.getElementById('player-spectrum').getContext('2d');
const media = document.getElementById('audio-engine');
let frame, lastDraw = -Infinity;
let cursorVisible = false;
let spectrum, levels, lastSpectrumTime = NaN;
function frequency(position) { return 30 * Math.pow(10000 / 30, position); }

// Bandes FFT mesurées sur les MP3 livrés au navigateur, y compris en lecture locale.
function prepareAnalysis(next) {
  if (spectrum === next) return;
  spectrum = next;
  if (next && !next.values) next.values = atob(next.encoded);
  levels = next ? new Float32Array(next.bands) : null;
  lastSpectrumTime = NaN;
}
function sampleSpectrum(time) {
  const { bands, fps, values } = spectrum;
  const last = values.length / bands - 1;
  const position = Math.min(last, Math.max(0, time * fps));
  const row = Math.floor(position);
  const mix = position - row;
  const dt = time - lastSpectrumTime;
  for (let i = 0; i < bands; i++) {
    const first = values.charCodeAt(row * bands + i);
    const second = values.charCodeAt(Math.min(last, row + 1) * bands + i);
    const target = (first + mix * (second - first)) / 255;
    const tau = target > levels[i] ? .018 : .095;
    const gain = dt >= 0 && dt < .2 ? -Math.expm1(-dt / tau) : 1;
    levels[i] += gain * (target - levels[i]);
  }
  lastSpectrumTime = time;
}
function energy(position) {
  if (!levels || media.paused) return 0;
  const bin = Math.max(0, Math.min(levels.length - 1, position * levels.length - .5));
  const left = Math.floor(bin);
  return levels[left] + (bin - left) * (levels[Math.min(left + 1, levels.length - 1)] - levels[left]);
}
media.addEventListener('seeking', () => { lastSpectrumTime = NaN; });
// Deux contours légers partagent la même enveloppe spectrale que le fond.
function drawPlayerRibbon(active) {
  const width = 96, height = 30, middle = height / 2;
  mini.clearRect(0, 0, width, height);
  const contour = new Path2D();
  const upper = new Path2D();
  const lower = [];
  contour.moveTo(2, middle);
  upper.moveTo(2, middle);
  for (let x = 2; x <= width - 2; x += 2) {
    const t = (x - 2) / (width - 4);
    const envelope = (energy(Math.max(0, t - .045)) + 2 * energy(t) + energy(Math.min(1, t + .045))) / 4;
    const taper = Math.sin(Math.PI * t);
    const depth = taper * (.6 + envelope * 14);
    const top = middle - depth;
    upper.lineTo(x, top);
    contour.lineTo(x, top);
    lower.push(middle + depth * (.25 + .25 * t));
  }
  for (let i = lower.length - 1; i >= 0; i--) contour.lineTo(2 + 2 * i, lower[i]);
  contour.closePath();
  mini.fillStyle = active ? 'rgba(217,239,154,.12)' : 'rgba(184,193,169,.07)';
  mini.fill(contour);
  mini.lineWidth = .8;
  mini.strokeStyle = active ? 'rgba(217,239,154,.43)' : '#73786a';
  mini.stroke(contour);
  mini.strokeStyle = active ? '#d9ef9a' : '#8c9284';
  mini.stroke(upper);
}
function resizeEq() {
  const bounds = eqCanvas.getBoundingClientRect();
  w = Math.max(1, bounds.width);
  h = Math.max(1, bounds.height);
  const scale = Math.min(devicePixelRatio || 1, 1.5);
  mini.canvas.width = Math.round(96 * scale);
  mini.canvas.height = Math.round(30 * scale);
  mini.setTransform(scale, 0, 0, scale, 0, 0);
  eqCanvas.width = Math.round(w * scale);
  eqCanvas.height = Math.round(h * scale);
  eqCtx.setTransform(scale, 0, 0, scale, 0, 0);
  restartDrawing();
}
window.addEventListener('resize', resizeEq);
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  if (media.paused && !pointer.matches && !motion.matches && !document.hidden && !frame)
    frame = requestAnimationFrame(() => { frame = 0; drawAbletonEqBackground(); });
}, { passive: true });
document.addEventListener('pointermove', e => {
  if (!pointer.matches || motion.matches || e.pointerType !== 'mouse') return;
  mouseX = Math.min(1, Math.max(0, e.clientX / w));
  mouseY = Math.min(1, Math.max(0, e.clientY / h));
  cursorVisible = !e.target.closest('header, button, a, input, main p, h1, h2, h3, dialog, .sticky-player, details, .about-meta');
  dawCursor.style.visibility = cursorVisible ? 'visible' : 'hidden';
  if (!cursorVisible) return;
  dawCursor.style.transform = 'translate3d(' + (e.clientX + 12) + 'px,' + (e.clientY + 12) + 'px,0)';
}, {passive: true});
document.addEventListener('pointerleave', () => { dawCursor.style.visibility = 'hidden'; });
// Repères fréquentiels logarithmiques type Ableton EQ Eight
const freqMarkers = [30, 100, 300, 1000, 3000, 10000].map(hz => ({
  pos: Math.log(hz / 30) / Math.log(10000 / 30),
  label: hz >= 1000 ? hz / 1000 + ' kHz' : hz + ' Hz'
}));

function drawAbletonEqBackground() {
  const isAudioActive = !media.paused && !!spectrum;
  if (isAudioActive) sampleSpectrum(media.currentTime);
  eqCtx.clearRect(0, 0, w, h);
  eqTime += isAudioActive ? 0.018 : 0.005;
  const amp = Math.min(1.8, h / 250) * (isAudioActive ? 1.2 : 0.9);
  const sweep = Math.sin(scrollY / Math.max(h, 1) * 1.7) * h * .09;

  // 1. Grille logarithmique verticale & lignes dB horizontales (style EQ Eight)
  eqCtx.lineWidth = 1;
  freqMarkers.forEach(m => {
    const x = w * m.pos;
    eqCtx.beginPath();
    eqCtx.strokeStyle = 'rgba(220, 231, 211, 0.14)';
    eqCtx.moveTo(x, 0);
    eqCtx.lineTo(x, h);
    eqCtx.stroke();

    eqCtx.fillStyle = 'rgba(227, 233, 222, 0.76)';
    eqCtx.font = '9px monospace';
    eqCtx.fillText(m.label, Math.min(w - 48, x + 6), h - 74);
  });

  const dbLevels = [0.25, 0.5, 0.75];
  dbLevels.forEach((lvl, idx) => {
    const y = h * lvl;
    eqCtx.beginPath();
    eqCtx.strokeStyle = idx === 1 ? 'rgba(230, 235, 218, 0.2)' : 'rgba(230, 235, 218, 0.11)';
    eqCtx.moveTo(0, y);
    eqCtx.lineTo(w, y);
    eqCtx.stroke();
  });

  if (isAudioActive) {
    // Une même enveloppe fréquentielle alimente le fond et les barres du lecteur.
    const floor = h * .91;
    const getY = position => floor - energy(position) * h * .79;
    eqCtx.beginPath();
    eqCtx.moveTo(0, getY(0));
    let prevX = 0, prevY = getY(0);
    for (let i = 0; i < spectrum.bands; i++) {
      const pos = (i + .5) / spectrum.bands;
      const x = w * pos, y = getY(pos);
      eqCtx.quadraticCurveTo(prevX, prevY, (prevX + x) / 2, (prevY + y) / 2);
      prevX = x; prevY = y;
    }
    eqCtx.quadraticCurveTo(prevX, prevY, w, getY(1));
    eqCtx.strokeStyle = '#d5f59d';
    eqCtx.lineWidth = 2;
    eqCtx.stroke();
    eqCtx.lineTo(w, floor); eqCtx.lineTo(0, floor); eqCtx.closePath();
    eqCtx.fillStyle = 'rgba(157,198,106,.12)';
    eqCtx.fill();
  } else {
    // 2. Nœuds de filtres résonants (4 bandes EQ dynamiques)
    const nodes = [
      {
        num: '1',
        x: w * (0.16 + Math.sin(eqTime * 0.7) * 0.05),
        y: h * 0.52 + Math.cos(eqTime * 0.9) * (42 * amp),
        color: '#b3c497'
      },
      {
        num: '2',
        x: w * (0.41 + Math.cos(eqTime * 0.5) * 0.06),
        y: h * 0.46 + Math.sin(eqTime * 0.8 + scrollY * 0.002) * (55 * amp),
        color: '#d8ecb3'
      },
      {
        num: '3',
        x: w * (0.66 + (mouseX - 0.5) * 0.08),
        y: h * 0.5 + (mouseY - 0.5) * 70 + Math.cos(eqTime * 1.1) * (35 * amp),
        color: '#d8ecb3'
      },
      {
        num: '4',
        x: w * (0.86 + Math.sin(eqTime * 0.6) * 0.04),
        y: h * 0.48 + Math.sin(eqTime * 1.3) * (40 * amp),
        color: '#e2e9d9'
      }
    ];

    // Fonction d'évaluation de la courbe de réponse fréquentielle globale
    function evalEqCurve(x) {
      let y = h * 0.52;
      // Harmoniques de type Spectrum
      y += Math.sin(x * 0.003 + eqTime) * (18 * amp);
      y += Math.cos(x * 0.008 - eqTime * 1.3) * (9 * amp);
      // Influence des 4 bandes résonantes (cloches gaussiennes)
      nodes.forEach(n => {
        const dist = (x - n.x) / (w * 0.13);
        const bell = Math.exp(-(dist * dist));
        y += (n.y - h * 0.52) * bell;
      });
      return y + sweep;
    }

    // 3. Tracé de l'onde secondaire (Spectrum harmonique rapide)
    eqCtx.beginPath();
    eqCtx.strokeStyle = 'rgba(197, 212, 186, .49)';
    eqCtx.lineWidth = 1;
    for (let x = 0; x <= w; x += 10) {
      const yHarm = evalEqCurve(x)
        + Math.sin(x * 0.025 - eqTime * 3.2) * (11 * amp)
        + Math.cos(x * 0.04 + eqTime * 2.1) * (6 * amp);
      if (x === 0) eqCtx.moveTo(x, yHarm);
      else eqCtx.lineTo(x, yHarm);
    }
    eqCtx.stroke();

    // 4. Courbe principale EQ Eight + remplissage dégradé sous la courbe
    eqCtx.beginPath();
    for (let x = 0; x <= w; x += 12) {
      const y = evalEqCurve(x);
      if (x === 0) eqCtx.moveTo(x, y);
      else eqCtx.lineTo(x, y);
    }
    eqCtx.strokeStyle = 'rgba(213, 245, 157, .93)';
    eqCtx.lineWidth = 2.2;
    eqCtx.stroke();

    // Remplissage sous la courbe EQ
    eqCtx.lineTo(w, h);
    eqCtx.lineTo(0, h);
    eqCtx.closePath();
    const fillGrad = eqCtx.createLinearGradient(0, h * 0.3, 0, h);
    fillGrad.addColorStop(0, 'rgba(157, 198, 106, .17)');
    fillGrad.addColorStop(0.6, 'rgba(230, 46, 61, 0.025)');
    fillGrad.addColorStop(1, 'rgba(6, 7, 9, 0)');
    eqCtx.fillStyle = fillGrad;
    eqCtx.fill();

    // 5. Dessin des poignées de filtres numérotées (1, 2, 3, 4)
    nodes.forEach(n => {
      const cy = evalEqCurve(n.x);
      // Halo externe
      eqCtx.beginPath();
      eqCtx.arc(n.x, cy, 11, 0, Math.PI * 2);
      eqCtx.fillStyle = 'rgba(6, 7, 9, 0.75)';
      eqCtx.fill();
      eqCtx.strokeStyle = n.color;
      eqCtx.lineWidth = 1.2;
      eqCtx.stroke();

      // Numéro de bande EQ
      eqCtx.fillStyle = n.color;
      eqCtx.font = 'bold 9px monospace';
      eqCtx.textAlign = 'center';
      eqCtx.textBaseline = 'middle';
      eqCtx.fillText(n.num, n.x, cy);
    });
    eqCtx.textAlign = 'start';

  }
  drawPlayerRibbon(isAudioActive);
  if (cursorVisible) {
    const hz = frequency(mouseX);
    const label = hz < 1000 ? Math.round(hz) + ' Hz' : (hz / 1000).toFixed(1) + ' kHz';
    dawReadout.textContent = label + ' / ' + (12 - mouseY * 36).toFixed(1) + ' dB';
  }
}
function tick(now) {
  const interval = media.paused ? 50 : 0;
  if (now - lastDraw >= interval) { drawAbletonEqBackground(); lastDraw = now; }
  frame = requestAnimationFrame(tick);
}
function restartDrawing() {
  cancelAnimationFrame(frame);
  frame = 0;
  if (document.hidden) return;
  drawAbletonEqBackground();
  if (!motion.matches && (pointer.matches || !media.paused)) frame = requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange', restartDrawing);
motion.addEventListener('change', restartDrawing);
pointer.addEventListener('change', restartDrawing);
media.addEventListener('playing', restartDrawing);
media.addEventListener('pause', restartDrawing);
resizeEq();
