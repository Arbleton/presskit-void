'use strict';

// Point d’entrée du lecteur. Le reste du moteur reste propre à ses deux canevas.
const prepareAnalysis = (() => {
  const canvas = document.getElementById('ableton-eq-bg');
  const ctx = canvas.getContext('2d');
  const ribbon = document.getElementById('player-spectrum').getContext('2d');
  if (!ctx || !ribbon) return () => {};

  const audio = document.getElementById('audio-engine');
  const cursor = document.getElementById('daw-cursor');
  const readout = document.getElementById('daw-readout');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 861px)');
  const frequencies = [30, 100, 300, 1000, 3000, 10000];
  const frequencyRange = Math.log(10000 / 30);
  let width = 0, height = 0, scale = 0;
  let phase = 0, previousTime = null;
  let scrollPosition = window.scrollY, pointerX = .5, pointerY = .5;
  let frame = 0, timer = 0, dirtyTop = 0, dirtyBottom = 0;
  let bandFill, spectrum, levels, lastAudioTime = NaN, ribbonWasPlaying = null;

  // Les axes sont une image de fond. Seules les courbes sont repeintes entre deux images.
  function makeGrid() {
    const lines = [];
    const labels = [];
    for (const hz of frequencies) {
      const x = Math.round(width * Math.log(hz / 30) / frequencyRange);
      lines.push('M' + x + ' 0v' + height);
      if (width > 640) {
        const last = hz === frequencies[frequencies.length - 1];
        const label = hz >= 1000 ? hz / 1000 + ' kHz' : hz + ' Hz';
        labels.push('<text x="' + (last ? width - 8 : x + 6) + '" y="' + (height - 78) +
          '" text-anchor="' + (last ? 'end' : 'start') + '">' + label + '</text>');
      }
    }
    for (const level of [.25, .5, .75]) {
      const y = Math.round(height * level);
      lines.push('M0 ' + y + 'h' + width);
      // Sur téléphone, la graduation reste dans la marge, hors des légendes et des contrôles.
      if (width <= 640) labels.push('<text x="' + (width - 3) + '" y="' + (y - 4) +
        '" text-anchor="end">' + (12 - level * 36) + '</text>');
    }
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
      '<path d="' + lines.join(' ') + '" stroke="#dce7d3" stroke-opacity=".14" fill="none"/>' +
      '<g font-family="monospace" font-size="' + (width <= 640 ? 8 : 9) + '" fill="#dce7d3" fill-opacity=".6">' +
      labels.join('') + '</g></svg>';
    canvas.style.backgroundImage = 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }

  // Les six points décrivent la réponse des quatre filtres. Les deux points hors cadre
  // permettent aux courbes d’entrer et de sortir sans cassure au bord de l’écran.
  const anchors = [-.11, .14, .39, .63, .85, 1.11].map(x => ({home: x, x: 0, y: 0, echo: 0}));
  function traceResponse(key) {
    const path = new Path2D();
    path.moveTo(anchors[0].x, anchors[0][key]);
    for (let i = 1; i < anchors.length; i++) {
      const a = anchors[i - 1], b = anchors[i];
      const before = anchors[Math.max(0, i - 2)], after = anchors[Math.min(anchors.length - 1, i + 1)];
      const step = (b.x - a.x) / 3;
      path.bezierCurveTo(
        a.x + step, a[key] + step * (b[key] - before[key]) / (b.x - before.x),
        b.x - step, b[key] - step * (after[key] - a[key]) / (after.x - a.x),
        b.x, b[key]);
    }
    return path;
  }
  function drawAmbient() {
    const travel = scrollPosition / height;
    const amplitude = Math.min(100, height * .113);
    const baseline = height * (.54 + .065 * Math.sin(travel * 1.14 + phase * .27));
    let top = height, bottom = 0;
    for (let i = 0; i < anchors.length; i++) {
      const node = anchors[i];
      node.x = width * (node.home + .023 * Math.sin(phase * .42 + i * 1.9));
      node.y = baseline + amplitude * (.72 * Math.sin(phase * .79 + i * 2.12 + travel * .29)
        + .33 * Math.cos(phase * .41 - i * 1.5));
      if (i === 3) {
        node.x += (pointerX - .5) * width * .07;
        node.y += (pointerY - .5) * amplitude * .6;
      }
      node.echo = node.y + amplitude * (.2 * Math.sin(phase * .93 + i * 2.5) + .105 * Math.cos(phase * .55 - i));
      top = Math.min(top, node.y, node.echo);
      bottom = Math.max(bottom, node.y, node.echo);
    }
    // Marge de l’interpolation et des repères en dehors de la ligne.
    dirtyTop = top - amplitude * .5 - 24;
    dirtyBottom = bottom + amplitude * .5 + 24;

    const primary = traceResponse('y');
    ctx.strokeStyle = 'rgba(188,213,168,.55)';
    ctx.lineWidth = .95;
    ctx.stroke(traceResponse('echo'));
    ctx.strokeStyle = '#d5f59d';
    ctx.lineWidth = 1.7;
    ctx.stroke(primary);
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    for (let i = 1; i < anchors.length - 1; i++) {
      const {x, y} = anchors[i];
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#10130e';
      ctx.fill();
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = '#d9e9c2';
      ctx.stroke();
      ctx.fillStyle = '#d6e3c9';
      ctx.fillText('0' + i, x + 6, y - 7);
    }
  }

  function sampleSpectrum() {
    const {bands, fps, values} = spectrum;
    const time = audio.currentTime;
    const last = values.length / bands - 1;
    const position = Math.min(last, Math.max(0, time * fps));
    const row = Math.floor(position), mix = position - row;
    const first = row * bands, second = Math.min(last, row + 1) * bands;
    const dt = time - lastAudioTime;
    const smoothing = dt >= 0 && dt < .2;
    const attack = smoothing ? -Math.expm1(-dt / .018) : 1;
    const release = smoothing ? -Math.expm1(-dt / .095) : 1;
    for (let i = 0; i < bands; i++) {
      const a = values.charCodeAt(first + i);
      const target = (a + mix * (values.charCodeAt(second + i) - a)) / 255;
      levels[i] += (target - levels[i]) * (target > levels[i] ? attack : release);
    }
    lastAudioTime = time;
  }
  function energy(position) {
    const bin = Math.max(0, Math.min(levels.length - 1, position * levels.length - .5));
    const left = Math.floor(bin);
    return levels[left] + (bin - left) * (levels[Math.min(left + 1, levels.length - 1)] - levels[left]);
  }
  function drawSpectrum() {
    const floor = height * .83;
    const depth = height * .68;
    let x = 0, y = floor - levels[0] * depth, top = y;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < levels.length; i++) {
      const nextX = width * (i + .5) / levels.length;
      const nextY = floor - levels[i] * depth;
      ctx.quadraticCurveTo(x, y, (x + nextX) / 2, (y + nextY) / 2);
      x = nextX; y = nextY; top = Math.min(top, y);
    }
    ctx.quadraticCurveTo(x, y, width, y);
    ctx.strokeStyle = '#d5f59d';
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.lineTo(width, floor); ctx.lineTo(0, floor); ctx.closePath();
    ctx.fillStyle = bandFill;
    ctx.fill();
    dirtyTop = top - 3; dirtyBottom = floor + 3;
  }

  const ribbonDepth = new Float32Array(47);
  const ribbonTaper = Float32Array.from(ribbonDepth, (_, i) => Math.sin(Math.PI * i / (ribbonDepth.length - 1)));
  function drawRibbon(playing) {
    if (!playing && ribbonWasPlaying === false) return;
    ribbonWasPlaying = playing;
    ribbon.clearRect(0, 0, 96, 30);
    const upper = new Path2D();
    const contour = new Path2D();
    for (let i = 0; i < ribbonDepth.length; i++) {
      const t = i / (ribbonDepth.length - 1), x = 2 + 92 * t;
      const envelope = playing ? (energy(t - .045) + 2 * energy(t) + energy(t + .045)) / 4 : 0;
      const depth = ribbonTaper[i] * (.6 + envelope * 14);
      const top = 15 - depth;
      if (i === 0) { upper.moveTo(x, top); contour.moveTo(x, top); }
      else { upper.lineTo(x, top); contour.lineTo(x, top); }
      ribbonDepth[i] = 15 + depth * (.25 + .25 * t);
    }
    for (let i = ribbonDepth.length - 1; i >= 0; i--) contour.lineTo(2 + 2 * i, ribbonDepth[i]);
    contour.closePath();
    ribbon.fillStyle = playing ? 'rgba(217,239,154,.12)' : 'rgba(184,193,169,.07)';
    ribbon.fill(contour);
    ribbon.lineWidth = .8;
    ribbon.strokeStyle = playing ? 'rgba(217,239,154,.43)' : '#73786a';
    ribbon.stroke(contour);
    ribbon.strokeStyle = playing ? '#d9ef9a' : '#8c9284';
    ribbon.stroke(upper);
  }

  function draw(now) {
    frame = 0;
    if (document.hidden) return;
    const playing = !audio.paused && !audio.ended && !!spectrum;
    if (previousTime !== null && !reduced.matches) phase += Math.min(now - previousTime, 120) * .00062;
    previousTime = now;
    ctx.clearRect(0, Math.floor(dirtyTop), width, Math.ceil(dirtyBottom) - Math.floor(dirtyTop));
    if (playing && !reduced.matches) {
      sampleSpectrum();
      drawSpectrum();
    } else drawAmbient();
    drawRibbon(playing && !reduced.matches);
    if (reduced.matches) return;
    const interval = 1000 / (playing ? 60 : 30);
    timer = setTimeout(() => { frame = requestAnimationFrame(draw); },
      Math.max(0, interval - (performance.now() - now) - 5));
  }
  function restart() {
    cancelAnimationFrame(frame);
    clearTimeout(timer);
    previousTime = null;
    if (!document.hidden) frame = requestAnimationFrame(draw);
  }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(bounds.width)), h = Math.max(1, Math.round(bounds.height));
    const density = Math.min(devicePixelRatio || 1, 2.5, Math.sqrt(3600000 / (w * h)));
    if (width === w && height === h && scale === density) return;
    width = w; height = h; scale = density;
    canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
    ctx.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0);
    ribbon.canvas.width = Math.round(96 * scale); ribbon.canvas.height = Math.round(30 * scale);
    ribbon.setTransform(ribbon.canvas.width / 96, 0, 0, ribbon.canvas.height / 30, 0, 0);
    ribbonWasPlaying = null;
    dirtyTop = 0; dirtyBottom = h;
    bandFill = ctx.createLinearGradient(0, h * .2, 0, h * .83);
    bandFill.addColorStop(0, 'rgba(157,198,106,.19)');
    bandFill.addColorStop(1, 'rgba(157,198,106,.025)');
    makeGrid();
    restart();
  }
  document.addEventListener('pointermove', e => {
    if (!finePointer.matches || reduced.matches || e.pointerType !== 'mouse') return;
    pointerX = Math.max(0, Math.min(1, e.clientX / width));
    pointerY = Math.max(0, Math.min(1, e.clientY / height));
    const visible = !e.target.closest('header,button,a,input,main p,h1,h2,h3,dialog,.sticky-player,details,.about-meta');
    cursor.style.visibility = visible ? 'visible' : 'hidden';
    if (!visible) return;
    cursor.style.transform = 'translate3d(' + (e.clientX + 12) + 'px,' + (e.clientY + 12) + 'px,0)';
    const hz = 30 * Math.exp(frequencyRange * pointerX);
    const label = hz < 1000 ? Math.round(hz) + ' Hz' : (hz / 1000).toFixed(1) + ' kHz';
    readout.textContent = label + ' / ' + (12 - pointerY * 36).toFixed(1) + ' dB';
  }, {passive: true});
  document.addEventListener('pointerleave', () => { cursor.style.visibility = 'hidden'; });
  window.addEventListener('scroll', () => { scrollPosition = window.scrollY; }, {passive: true});
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', restart);
  reduced.addEventListener('change', restart);
  audio.addEventListener('seeking', () => { lastAudioTime = NaN; });
  audio.addEventListener('playing', restart);
  audio.addEventListener('pause', restart);
  resize();

  return next => {
    if (spectrum === next) return;
    spectrum = next;
    if (next && !next.values) next.values = atob(next.encoded);
    levels = next ? new Float32Array(next.bands) : null;
    lastAudioTime = NaN;
    restart();
  };
})();
