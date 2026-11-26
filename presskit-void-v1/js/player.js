'use strict';

// Les scripts de spectre restent chargeables en ouvrant directement index.html.
const previewSpectrumCache = new Map();

function createPreviewPlayer(releases, translate, beforePlay) {
  const player = document.getElementById('player');
  const audio = document.getElementById('audio-engine');
  const trigger = document.getElementById('cur-track');
  const picker = trigger.parentElement;
  const options = document.getElementById('track-options');
  const playButton = document.getElementById('btn-play');
  const nextButton = document.getElementById('btn-next');
  const seek = document.getElementById('seek');
  const elapsed = document.getElementById('time-cur');
  const total = document.getElementById('time-dur');
  const status = document.getElementById('player-status');
  const title = document.getElementById('cur-title');
  const catalogue = document.getElementById('cur-cat');
  const tracks = releases.filter(track => track.audioFile);
  let current = tracks.find(track => track.cat === 'VOID011') || tracks[0];
  const pendingSpectra = new Set();
  let failed = false;

  function nextTrack() {
    return tracks[(tracks.indexOf(current) + 1) % tracks.length];
  }

  function syncPlayer() {
    player.hidden = !current;
    if (!current) return;
    const playing = !audio.paused && !audio.ended && !failed;
    const label = current.artist + ' - ' + current.title;
    const errorLabel = translate('Lecture indisponible', 'Playback unavailable');
    player.classList.toggle('playing', playing);
    playButton.setAttribute('aria-label', (playing ? 'Pause' : translate('Écouter', 'Play')) + ' · ' + label);
    title.textContent = label;
    catalogue.textContent = failed ? errorLabel : current.cat;
    const announcement = failed ? errorLabel : label;
    if (status.textContent !== announcement) status.textContent = announcement;
    nextButton.hidden = tracks.length < 2;
    if (!nextButton.hidden) {
      const next = nextTrack();
      const hint = translate('Extrait suivant', 'Next preview') + ' · ' + next.artist + ' - ' + next.title;
      nextButton.title = hint;
      nextButton.setAttribute('aria-label', hint);
    }
    for (const button of options.querySelectorAll('button')) {
      if (button.dataset.cat === current.cat) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    }
  }

  function syncSpectrum() {
    const key = current.spectrumKey;
    const cached = previewSpectrumCache.get(key);
    prepareAnalysis(cached || null);
    if (!key || cached || pendingSpectra.has(key)) return;
    pendingSpectra.add(key);
    const script = document.createElement('script');
    script.src = 'assets/spectra/' + encodeURIComponent(key) + '.js';
    script.onload = script.onerror = () => {
      pendingSpectra.delete(key);
      script.remove();
      if (current.spectrumKey === key) prepareAnalysis(previewSpectrumCache.get(key) || null);
    };
    document.head.append(script);
  }

  async function play(track) {
    beforePlay();
    current = track;
    failed = false;
    if (audio.error || audio.getAttribute('src') !== track.audioFile) audio.src = track.audioFile;
    syncSpectrum();
    syncPlayer();
    try { await audio.play(); }
    catch (error) { if (track === current && error.name !== 'AbortError') failed = true; }
    syncPlayer();
  }

  function closePicker(returnFocus = false) {
    if (options.hidden) return;
    options.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) trigger.focus({preventScroll: true});
  }

  function openPicker() {
    if (!options.childElementCount) {
      for (const track of tracks) {
        const row = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.cat = track.cat;
        const cover = document.createElement('img');
        cover.alt = '';
        cover.width = cover.height = 38;
        cover.decoding = 'async';
        cover.src = track.thumb || track.file;
        const info = document.createElement('span');
        const name = document.createElement('strong');
        name.textContent = track.title;
        const artist = document.createElement('span');
        artist.textContent = track.artist;
        info.className = 'track-option-copy';
        info.append(name, artist);
        const reference = document.createElement('span');
        reference.className = 'track-reference';
        reference.textContent = track.cat;
        button.append(cover, info, reference);
        button.onclick = () => { closePicker(true); play(track); };
        row.append(button);
        options.append(row);
      }
      syncPlayer();
    }
    trigger.setAttribute('aria-expanded', 'true');
    options.hidden = false;
  }

  trigger.onclick = () => { if (options.hidden) openPicker(); else closePicker(); };
  picker.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closePicker(true); return; }
    const key = event.key;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return;
    event.preventDefault();
    openPicker();
    const buttons = Array.from(options.querySelectorAll('button'));
    let index = buttons.indexOf(document.activeElement);
    if (key === 'Home') index = 0;
    else if (key === 'End') index = buttons.length - 1;
    else if (index < 0) index = tracks.indexOf(current);
    else index = (index + (key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[index]?.focus();
  });
  document.addEventListener('pointerdown', event => {
    if (!options.hidden && !picker.contains(event.target)) closePicker();
  });
  picker.addEventListener('focusout', event => {
    if (event.relatedTarget && !picker.contains(event.relatedTarget)) closePicker();
  });
  playButton.onclick = () => { if (audio.paused) play(current); else audio.pause(); };
  nextButton.onclick = () => play(nextTrack());
  for (const event of ['play','pause','ended']) audio.addEventListener(event, syncPlayer);
  audio.addEventListener('error', () => { failed = true; syncPlayer(); });

  function clockTime(seconds) {
    return Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
  }
  function syncTime() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const position = audio.currentTime;
    seek.disabled = !duration;
    seek.max = duration;
    seek.value = position;
    seek.style.setProperty('--progress', (duration ? 100 * position / duration : 0) + '%');
    const now = clockTime(position), end = clockTime(duration);
    if (elapsed.textContent !== now || total.textContent !== end || !seek.hasAttribute('aria-valuetext')) {
      elapsed.textContent = now;
      total.textContent = end;
      seek.setAttribute('aria-valuetext', now + ' / ' + end);
    }
  }
  for (const event of ['timeupdate','loadedmetadata','emptied']) audio.addEventListener(event, syncTime);
  seek.oninput = () => { audio.currentTime = Number(seek.value); syncTime(); };
  function refresh() {
    player.setAttribute('aria-label', translate('Lecteur d’extraits', 'Audio previews'));
    options.setAttribute('aria-label', translate('Choisir un extrait', 'Choose a preview'));
    seek.setAttribute('aria-label', translate('Position de lecture', 'Playback position'));
    syncPlayer();
    syncTime();
  }
  return { play, pause: () => audio.pause(), refresh };
}
