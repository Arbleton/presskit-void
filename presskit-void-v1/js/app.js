'use strict';

const byId = id => document.getElementById(id);
let lang = 'fr';
const local = (fr, en) => lang === 'fr' ? fr : en;
const translated = (item, key) => item[key + '_' + lang] ?? item[key] ?? '';
const audio = byId('audio-engine');
const modal = byId('modal');
const drawer = byId('sc-drawer');
const gallery = byId('carousel-track');
let selectedEvent = 'all';
let selectedRelease = 'all';
const playlist = releases.filter(r => r.audioFile);
const trackSelect = byId('cur-track');
for (const track of playlist) trackSelect.add(new Option(track.artist + ' - ' + track.title, track.cat));
trackSelect.onchange = () => playTrack(playlist[trackSelect.selectedIndex]);
let currentTrack = playlist.find(track => track.cat === 'VOID011') || playlist[0];
let modalTrack;
let drawerButton;
let playbackError = false;

function element(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

// Pour les captures seules, la fenêtre de l’affiche exclut le bandeau Instagram.
function artwork(item, src, alt) {
  if (item.crop) {
    const [width, height, visibleHeight] = item.crop;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + visibleHeight);
    svg.setAttribute('class', 'poster-window');
    if (alt) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', alt);
    } else svg.setAttribute('aria-hidden', 'true');
    const window = document.createElementNS(ns, 'svg');
    window.setAttribute('width', width);
    window.setAttribute('height', visibleHeight);
    window.setAttribute('overflow', 'hidden');
    const image = document.createElementNS(ns, 'image');
    image.setAttribute('href', src);
    image.setAttribute('width', width);
    image.setAttribute('height', height);
    window.append(image);
    svg.append(window);
    return svg;
  }
  const image = element('img');
  image.alt = alt;
  image.loading = alt ? 'eager' : 'lazy';
  image.decoding = 'async';
  image.src = src;
  return image;
}

function picture(item, title, className, badge, branch) {
  const frame = element('div', className);
  if (badge) frame.append(element('span', 'frame-badge ' + branch, badge));
  if (item.file) {
    frame.append(artwork(item, item.thumb || item.file, ''));
  } else {
    frame.append(element('span', 'catalogue-mark', item.cat || title));
  }
  return frame;
}

function card(grid, frame, tag, title, sub, footer, activate) {
  const button = element('button', 'card');
  const body = element('div', 'card-body');
  const heading = element('div');
  heading.append(element('div', 'card-tag', tag), element('div', 'card-title', title));
  if (sub) heading.append(element('div', 'card-sub', sub));
  body.append(heading);
  if (footer) body.append(element('div', 'card-footer-meta', footer));
  button.append(frame, body);
  button.onclick = activate;
  grid.append(button);
}

function externalLink(title, url) {
  const anchor = element('a', '', title);
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  return anchor;
}

function linkCredits(container) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    if (node.parentElement.closest('a')) continue;
    const parts = node.data.split(/(?<![\w.+-])(@[\w]+(?:\.[\w]+)*)/g);
    if (parts.length > 1) node.replaceWith(...parts.map((part, i) =>
      i % 2 ? externalLink(part, 'https://www.instagram.com/' + part.slice(1) + '/') : part));
  }
}

function releaseDescription(body) {
  const fragment = document.createDocumentFragment();
  for (const html of body.split(/<br\s*\/?><br\s*\/?>/i)) {
    const paragraph = element('p');
    paragraph.innerHTML = html;
    const text = paragraph.textContent.trim();
    if (/^tracklist\s*:/i.test(text)) {
      const tracks = text.replace(/^tracklist\s*:\s*/i, '').replace(/\.$/, '').split(' · ');
      const list = element(/^1\. /.test(tracks[0]) ? 'ol' : 'ul', 'release-tracks');
      list.setAttribute('aria-label', 'Tracklist');
      for (const track of tracks) list.append(element('li', '', track.replace(/^\d+\. /, '')));
      fragment.append(list);
    } else if (/^(Mastering|Artwork)\s*:/.test(text)) {
      const credits = element('dl', 'release-credits');
      for (const credit of text.split(' · ')) {
        const [label, value] = credit.split(/\s*:\s*/, 2);
        credits.append(element('dt', '', label), element('dd', '', value));
      }
      fragment.append(credits);
    } else fragment.append(paragraph);
  }
  return fragment;
}

function showModal(item, title, tag, body, link, label) {
  const release = releases.includes(item);
  const artist = roster.includes(item);
  if (release || artist) modal.dataset.focus = release ? 'release' : 'artist';
  else delete modal.dataset.focus;
  const byline = byId('focus-byline');
  byline.hidden = !(release || artist);
  byline.textContent = release ? item.artist : artist ? tag : '';
  byId('modal-tag').hidden = artist;
  modal.scrollTop = 0;
  modalTrack = item.audioFile ? item : null;
  byId('modal-title').textContent = title;
  byId('modal-tag').textContent = release ? [item.cat, item.format].filter(Boolean).join(' / ') : tag;
  const meta = byId('modal-meta');
  if (release) meta.replaceChildren(releaseDescription(body));
  else meta.innerHTML = body;
  linkCredits(meta);
  meta.hidden = !body;
  const frame = byId('modal-wrap');
  frame.hidden = !item.file;
  frame.replaceChildren();
  if (item.file) frame.append(artwork(item, item.file, title));
  const extra = byId('modal-extra');
  extra.replaceChildren();
  for (const [name, value, url] of [['Influences', item.influences], ['Album', item.albumTitle, item.albumUrl], ['Set', item.setTitle, item.setUrl]]) {
    if (value) {
      const row = element('div', 'focus-fact');
      row.append(element('span', 'fact-label', name), url ? externalLink(value, url) : element('span', '', value));
      extra.append(row);
    }
  }
  extra.hidden = !extra.childElementCount;
  const set = byId('modal-set-link');
  set.hidden = !link;
  if (link) { set.href = link; set.textContent = label + ' ↗'; }
  byId('modal-cue-btn').hidden = !modalTrack;
  byId('event-paging').hidden = !events.includes(item);
  if (!modal.open) {
    modal.showModal();
    byId('modal-close-btn').focus();
  }
}
byId('modal-close-btn').onclick = () => modal.close();
modal.onclick = e => { if (e.target === modal) modal.close(); };
byId('modal-cue-btn').onclick = () => {
  modal.close();
  playTrack(modalTrack);
};

let visibleEvents = [];
let previewEvent;
let openedEvent;

const programme = document.querySelector('.programme');
let traceFrame = 0;
function drawDateTrace() {
  traceFrame = 0;
  const preview = byId('event-preview');
  const row = programme.querySelector('.current .programme-arrow');
  const path = byId('date-trace');
  if (!row || !preview.offsetWidth || preview.hidden) {
    path.removeAttribute('d');
    return;
  }
  const bounds = programme.getBoundingClientRect();
  if (bounds.bottom < 0 || bounds.top > innerHeight) return;
  const anchor = row.getBoundingClientRect();
  const poster = preview.querySelector('.poster-stage').getBoundingClientRect();
  const x = anchor.right - bounds.left + 5;
  const y = anchor.top + anchor.height / 2 - bounds.top;
  const end = poster.left + poster.width / 2 - bounds.left;
  const mid = poster.left + poster.width * .10 - bounds.left;
  const target = poster.top + poster.height * .52 - bounds.top;
  path.setAttribute('d', 'M '+x+' '+y+' C '+mid+' '+y+' '+(mid-8)+' '+target+' '+(mid+24)+' '+target+
    ' q 8 0 12 -7 t 12 1 t 14 6 H '+end);
}
function scheduleDateTrace() {
  if (!traceFrame) traceFrame = requestAnimationFrame(drawDateTrace);
}
window.addEventListener('scroll', scheduleDateTrace, {passive: true});
new ResizeObserver(scheduleDateTrace).observe(programme);

function previewDate(item) {
  if (previewEvent === item) return;
  previewEvent = item;
  const title = translated(item, 'title');
  const preview = byId('event-preview');
  const stage = element('span', 'poster-stage');
  stage.append(artwork(item, item.file, ''));
  const plate = element('span', 'preview-plate');
  plate.append(stage, element('span', 'poster-note', translated(item, 'caption')));
  preview.replaceChildren(plate);
  preview.setAttribute('aria-label', local('Ouvrir la fiche', 'Open event') + ' · ' + title);
  Array.from(byId('event-grid').children).forEach((row, index) => {
    row.classList.toggle('current', visibleEvents[index] === item);
  });
  scheduleDateTrace();
}

function openDate(item) {
  openedEvent = item;
  previewDate(item);
  byId('event-position').textContent = (visibleEvents.indexOf(item) + 1) + ' / ' + visibleEvents.length;
  byId('event-prev').disabled = byId('event-next').disabled = visibleEvents.length < 2;
  showModal(item, translated(item, 'title'), item.tag + ' · ' + item.artist, translated(item, 'meta'));
}

function stepDate(direction) {
  const index = visibleEvents.indexOf(openedEvent);
  openDate(visibleEvents[(index + direction + visibleEvents.length) % visibleEvents.length]);
}
byId('event-preview').onclick = () => openDate(previewEvent);
byId('event-prev').onclick = () => stepDate(-1);
byId('event-next').onclick = () => stepDate(1);
modal.addEventListener('keydown', e => {
  if (byId('event-paging').hidden || !['ArrowLeft','ArrowRight'].includes(e.key)) return;
  e.preventDefault();
  stepDate(e.key === 'ArrowLeft' ? -1 : 1);
});

const modalArt = byId('modal-wrap');
let swipeStart;
modalArt.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'touch' || !e.isPrimary || byId('event-paging').hidden) return;
  swipeStart = {x: e.clientX, y: e.clientY};
  modalArt.setPointerCapture(e.pointerId);
});
modalArt.addEventListener('pointerup', e => {
  if (!swipeStart || !e.isPrimary) return;
  const dx = e.clientX - swipeStart.x;
  const dy = e.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) stepDate(dx < 0 ? 1 : -1);
});
modalArt.addEventListener('pointercancel', () => { swipeStart = null; });

function renderEvents() {
  const grid = byId('event-grid');
  const previous = previewEvent;
  grid.replaceChildren();
  visibleEvents = events.filter(e => selectedEvent === 'all' || e.category === selectedEvent);
  for (const item of visibleEvents) {
    const [date, venue] = item.tag.split(' · ');
    const row = element('button', 'programme-row');
    const copy = element('span', 'programme-copy');
    copy.append(element('strong', 'programme-venue', venue || translated(item, 'title')),
      element('span', 'programme-lineup', item.artist));
    const arrow = element('span', 'programme-arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    row.append(element('span', 'programme-date', date), copy, arrow);
    row.setAttribute('aria-haspopup', 'dialog');
    row.onpointermove = e => { if (e.pointerType === 'mouse') previewDate(item); };
    row.onfocus = () => previewDate(item);
    row.onclick = () => openDate(item);
    grid.append(row);
  }
  previewEvent = null;
  byId('event-preview').hidden = !visibleEvents.length;
  if (visibleEvents.length) previewDate(visibleEvents.includes(previous) ? previous : visibleEvents[0]);
}

function renderReleases() {
  const grid = byId('release-grid');
  grid.replaceChildren();
  const dateFormat = new Intl.DateTimeFormat(lang, {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'});
  for (const r of releases.filter(r => selectedRelease === 'all' || selectedRelease === r.type || (selectedRelease === 'vinyl' && r.isVinyl))) {
    const frame = picture(r, r.title, 'disc-frame', r.format, r.isVinyl ? 'vinyl' : r.type);
    const reference = r.cat || 'Void X Series';
    const date = dateFormat.format(new Date(r.date + 'T00:00:00Z'));
    card(grid, frame, reference + ' · ' + date, r.title, r.artist, i18nDict[lang].card_more_release,
      () => showModal(r, r.title, reference + ' · ' + r.artist, translated(r, 'meta'), r.link, 'Bandcamp'));
  }
}

function renderArchive() {
  const container = byId('archive-years');
  container.replaceChildren();
  const format = new Intl.DateTimeFormat(lang, {day: '2-digit', month: 'short', timeZone: 'UTC'});
  let previousYear;
  let list;
  for (const [date, name] of shotgunArchive) {
    const year = date.slice(0, 4);
    if (year !== previousYear) {
      const group = element('section', 'archive-year');
      list = element('ul');
      group.append(element('h3', '', year), list);
      container.append(group);
      previousYear = year;
    }
    const row = element('li');
    const day = element('time', '', format.format(new Date(date + 'T12:00:00Z')));
    day.dateTime = date;
    row.append(day, element('span', '', name));
    list.append(row);
  }
}
function renderRoster() {
  const grid = byId('roster-grid');
  grid.replaceChildren();
  for (const a of roster) {
    const role = translated(a, 'role');
    card(grid, picture(a, a.name, 'roster-frame', a.branch === 'VXS' ? 'Void X Series' : a.branch, a.branch.toLowerCase()), role, a.name, '', '',
      () => showModal(a, a.name, role, translated(a, 'bio')));
  }
}

function renderPodcasts() {
  const grid = byId('podcast-highlights');
  grid.replaceChildren();
  for (const p of featuredPodcasts) {
    const button = element('button', 'pod-highlight-card ' + p.cardClass);
    button.append(element('span', 'card-tag', p.tag), element('h3', '', p.title),
      element('p', '', translated(p, 'desc')), element('span', 'card-footer-meta', i18nDict[lang].card_open_sc));
    button.setAttribute('aria-controls', 'sc-drawer');
    if (p.festivalLive) button.id = 'festival-podcast';
    button.onclick = () => {
      audio.pause();
      drawerButton = button;
      const iframe = element('iframe');
      iframe.title = 'SoundCloud · ' + p.title;
      iframe.width = '100%';
      iframe.height = '166';
      iframe.allow = 'autoplay';
      iframe.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(p.scUrl) + '&color=%2338d9a9&auto_play=false&show_comments=false';
      const direct = element('a', 'btn-ghost', local('Écouter sur SoundCloud ↗', 'Listen on SoundCloud ↗'));
      direct.href = p.scUrl;
      direct.target = '_blank';
      byId('sc-drawer-title').textContent = p.title + ' · ' + p.tag;
      byId('sc-iframe-wrap').replaceChildren(iframe, direct);
      drawer.classList.add('active');
      byId('sc-drawer-close').focus();
    };
    grid.append(button);
  }
}
function closeDrawer() {
  byId('sc-iframe-wrap').replaceChildren();
  drawer.classList.remove('active');
}
byId('sc-drawer-close').onclick = () => { closeDrawer(); drawerButton?.focus(); };

function galleryIndex() {
  const left = gallery.getBoundingClientRect().left;
  return Array.from(gallery.children).reduce((best, slide, index, slides) =>
    Math.abs(slide.getBoundingClientRect().left - left) < Math.abs(slides[best].getBoundingClientRect().left - left) ? index : best, 0);
}
function updateCounter() {
  const count = gallery.children.length;
  byId('carousel-counter').textContent = [galleryIndex() + 1, count].map(n => String(n).padStart(2, '0')).join(' / ');
  byId('carousel-prev').disabled = gallery.scrollLeft < 1;
  byId('carousel-next').disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1;
}
function renderGallery() {
  gallery.replaceChildren();
  for (const item of galleryItems.filter(i => i.file)) {
    const title = translated(item, 'title');
    const slide = element('button', 'carousel-slide');
    slide.append(picture(item, title, 'carousel-img-wrap'), element('div', 'carousel-caption', title));
    slide.onclick = () => showModal(item, title, item.tag, '');
    gallery.append(slide);
  }
  byId('gallery-empty').hidden = !!gallery.childElementCount;
  document.querySelector('.carousel-controls').hidden = !gallery.childElementCount;
  updateCounter();
}
for (const [id, offset] of [['carousel-prev', -1], ['carousel-next', 1]]) {
  byId(id).onclick = () => gallery.children[galleryIndex() + offset]?.scrollIntoView({block: 'nearest', inline: 'start'});
}
gallery.addEventListener('scroll', updateCounter, {passive: true});
window.addEventListener('resize', updateCounter);

for (const selector of ['#event-filters', '#catalogue .filters']) {
  const group = document.querySelector(selector);
  const buttons = group.querySelectorAll('button');
  for (const button of buttons) {
    button.setAttribute('aria-pressed', button.classList.contains('active'));
    button.onclick = () => {
      for (const other of buttons) {
        other.classList.toggle('active', other === button);
        other.setAttribute('aria-pressed', other === button);
      }
      if (button.dataset.ev) { selectedEvent = button.dataset.ev; renderEvents(); }
      else { selectedRelease = button.id.slice(4); renderReleases(); }
    };
  }
}

function syncPlayer() {
  byId('player').hidden = !currentTrack;
  if (!currentTrack) return;
  const playing = !audio.paused && !audio.ended && !playbackError;
  byId('btn-play').textContent = playing ? '❚❚' : '▶';
  byId('btn-play').setAttribute('aria-label', playing ? 'Pause' : local('Écouter', 'Play'));
  byId('player').classList.toggle('playing', playing);
  trackSelect.value = currentTrack.cat;
  byId('btn-next').hidden = playlist.length < 2;
  byId('cur-cat').textContent = playbackError ? local('Lecture indisponible', 'Playback unavailable') : currentTrack.cat;
}
async function playTrack(track) {
  closeDrawer();
  currentTrack = track;
  playbackError = false;
  if (audio.getAttribute('src') !== track.audioFile) audio.src = track.audioFile;
  prepareAnalysis(track.spectrum);
  try { await audio.play(); }
  catch (error) { if (track === currentTrack && error.name !== 'AbortError') playbackError = true; }
  syncPlayer();
}
byId('btn-next').onclick = () => {
  const next = (playlist.indexOf(currentTrack) + 1) % playlist.length;
  playTrack(playlist[next]);
};
byId('btn-play').onclick = () => audio.paused ? playTrack(currentTrack) : audio.pause();
for (const event of ['play', 'pause', 'ended']) audio.addEventListener(event, syncPlayer);
audio.addEventListener('error', () => { playbackError = true; syncPlayer(); });
function time(seconds) {
  return Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
}
function syncTime() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  const seek = byId('seek');
  seek.disabled = !duration;
  seek.max = duration;
  seek.value = audio.currentTime;
  seek.setAttribute('aria-valuetext', time(audio.currentTime) + ' / ' + time(duration));
  byId('time-cur').textContent = time(audio.currentTime);
  byId('time-dur').textContent = time(duration);
}
for (const event of ['timeupdate', 'loadedmetadata', 'emptied']) audio.addEventListener(event, syncTime);
byId('seek').oninput = e => { audio.currentTime = Number(e.target.value); };

const menu = byId('menu-toggle');
function setMenu(open) {
  menu.setAttribute('aria-expanded', open);
  byId('sections').classList.toggle('open', open);
}
menu.onclick = () => setMenu(menu.getAttribute('aria-expanded') !== 'true');
byId('sections').onclick = () => setMenu(false);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
});
function render() {
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll('[data-i18n]')) el.innerHTML = i18nDict[lang][el.dataset.i18n];
  byId('lang-toggle').textContent = local('FR / EN', 'EN / FR');
  byId('lang-toggle').setAttribute('aria-label', local('Switch to English', 'Passer en français'));
  byId('event-prev').setAttribute('aria-label', local('Date précédente', 'Previous event'));
  byId('event-next').setAttribute('aria-label', local('Date suivante', 'Next event'));
  byId('sections').setAttribute('aria-label', local('Sections du presskit', 'Presskit sections'));
  byId('modal-close-btn').setAttribute('aria-label', local('Fermer', 'Close'));
  byId('carousel-prev').setAttribute('aria-label', local('Photo précédente', 'Previous photograph'));
  byId('carousel-next').setAttribute('aria-label', local('Photo suivante', 'Next photograph'));
  byId('seek').setAttribute('aria-label', local('Position de lecture', 'Playback position'));
  byId('nav-count-releases').textContent = releases.length;
  document.querySelectorAll('[data-i18n="bannerReleases"]').forEach(el => {
    el.textContent = releases.length + ' ' + i18nDict[lang].bannerReleases;
  });
  renderArchive(); renderEvents(); renderReleases(); renderRoster(); renderPodcasts(); renderGallery(); syncPlayer(); syncTime();
}
byId('lang-toggle').onclick = () => { closeDrawer(); lang = local('en', 'fr'); render(); };
render();

// Le sommaire suit le chapitre qui passe sous le bandeau de navigation.
const sectionLinks = Array.from(byId('sections').querySelectorAll('a'));
const sections = sectionLinks.map(link => document.querySelector(link.hash));
const nav = byId('sections');
const masthead = nav.closest('header');
let inspectedLink = null;
function positionRail() {
  const active = nav.querySelector('[aria-current]');
  const target = inspectedLink || active;
  const visible = target && target.offsetWidth && !menu.offsetWidth;
  const fraction = target ? (sectionLinks.indexOf(target) + .5) / sectionLinks.length : .09;
  const box = visible && target.getBoundingClientRect();
  const x = box ? box.left + box.width / 2 : masthead.clientWidth * fraction;
  masthead.style.setProperty('--nav-x', x + 'px');
  masthead.style.setProperty('--nav-span', (box ? box.width + 20 : 52) + 'px');
}
for (const link of sectionLinks) {
  link.addEventListener('pointerenter', e => {
    if (e.pointerType === 'mouse') { inspectedLink = link; positionRail(); }
  });
  link.addEventListener('focus', () => { inspectedLink = link; positionRail(); });
}
function releaseRail() { inspectedLink = null; positionRail(); }
nav.addEventListener('pointerleave', releaseRail);
nav.addEventListener('focusout', releaseRail);
byId('lang-toggle').addEventListener('click', positionRail);
document.fonts.ready.then(positionRail);
let navFrame = 0;
function highlightSection() {
  navFrame = 0;
  const limit = innerHeight * 0.35;
  let active = -1;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= limit) active = index;
  });
  sectionLinks.forEach((link, index) => {
    if (index === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  positionRail();
}
function scheduleHighlight() {
  if (!navFrame) navFrame = requestAnimationFrame(highlightSection);
}
window.addEventListener('scroll', scheduleHighlight, { passive: true });
window.addEventListener('resize', scheduleHighlight);
highlightSection();
