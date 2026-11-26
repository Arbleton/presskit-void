'use strict';

const byId = id => document.getElementById(id);
let lang = 'fr';
const local = (fr, en) => lang === 'fr' ? fr : en;
const translated = (item, key) => item[key + '_' + lang] ?? item[key] ?? '';
const previewPlayer = createPreviewPlayer(releases, local, closeDrawer);
const modal = byId('modal');
const drawer = byId('sc-drawer');
const gallery = byId('carousel-track');
let selectedEvent = 'all';
let selectedRelease = 'all';
let modalTrack;
let drawerButton;

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
  button.setAttribute('aria-haspopup', 'dialog');
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
    const parts = node.data.split(/(@\w+(?:\.\w+)*)/g);
    if (parts.length > 1) node.replaceWith(...parts.map((part, i) =>
      i % 2 && !/[\w.+-]$/.test(parts[i - 1]) ? externalLink(part, 'https://www.instagram.com/' + part.slice(1) + '/') : part));
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
  if (item.file) frame.append(events.includes(item) ? posterImage(item, 'detail', title) : artwork(item, item.file, title));
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
  previewPlayer.play(modalTrack);
};

let visibleEvents = [];
let previewEvent;
let displayedDate;
let openedEvent;

const programme = document.querySelector('.programme');
const dateGrid = byId('event-grid');
const datePreview = byId('event-preview');
const posterStage = datePreview.querySelector('.poster-stage');
const posterNote = datePreview.querySelector('.poster-note');
const datePath = byId('date-trace');
const tracePulse = programme.querySelector('.trace-pulse');
const compactDates = matchMedia('(max-width: 720px), (max-width: 1024px) and (hover: none) and (pointer: coarse)');
const quietDates = matchMedia('(prefers-reduced-motion: reduce)');
const dateControls = element('div', 'date-controls');
const dateCount = element('span', 'date-count');
dateCount.setAttribute('aria-live', 'polite');
dateCount.setAttribute('aria-atomic', 'true');
const dateMeter = element('span', 'date-meter');
dateMeter.setAttribute('aria-hidden', 'true');
const previousDate = element('button', '', '←');
const nextDate = element('button', '', '→');
for (const button of [previousDate, nextDate]) {
  button.type = 'button';
  button.setAttribute('aria-controls', dateGrid.id);
}
dateControls.append(dateCount, dateMeter, previousDate, nextDate);
dateControls.hidden = true;
programme.append(dateControls);

// Les vignettes, le tirage et la fiche partagent le même choix de source selon la densité de l’écran.
function posterImage(item, view, alt = '') {
  if (!item.posterSrcset || !item.posterSize) return artwork(item, (alt ? item.file : item.thumb) || item.file, alt);
  const img = element('img');
  [img.width, img.height] = item.posterSize;
  img.alt = alt;
  img.loading = view === 'detail' || (view === 'preview' && programmeInView) ? 'eager' : 'lazy';
  img.decoding = 'async';
  if (view === 'card') return img;
  const ratio = img.width / img.height;
  const previewSize = 'min(40vw, ' + Math.round(44 * ratio) + 'vh, ' + Math.round(430 * ratio) + 'px)';
  img.sizes = view === 'detail' ? '(max-width: 720px) 92vw, min(57vw, 600px)' : previewSize;
  img.srcset = item.posterSrcset;
  img.src = item.file;
  return img;
}

function loadCardPoster(index, selected) {
  const item = visibleEvents[index];
  if (!item?.posterSrcset || !item.posterSize) return;
  const image = dateGrid.children[index].querySelector('.date-cover img');
  if (!image || image.srcset) return;
  if (selected) {
    // Le portrait occupe une fraction de la largeur du bouton, même sur un écran haute densité.
    const ratio = item.posterSize[0] / item.posterSize[1];
    image.sizes = 'min(80vw, 26rem, calc(clamp(144px, 45vw, 240px) * ' + ratio + '))';
    image.srcset = item.posterSrcset;
    image.src = item.file;
  } else if (!image.hasAttribute('src')) image.src = item.thumb || item.file;
}

function moveDateCard(index, behavior = 'instant') {
  const card = dateGrid.children[index];
  if (card) dateGrid.scrollTo({left: card.offsetLeft - dateGrid.firstElementChild.offsetLeft, behavior});
}
let currentCard = -1;
function updateDateControls(settled = false) {
  if (!compactDates.matches || !visibleEvents.length) return;
  // Les cartes ont toutes le même pas, y compris celle partiellement visible à droite.
  const cards = dateGrid.children;
  const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
  const index = Math.max(0, Math.min(cards.length - 1, Math.round(dateGrid.scrollLeft / step)));
  if (settled) loadCardPoster(index, true);
  if (index === currentCard) return;
  if (!settled) loadCardPoster(index, false);
  loadCardPoster(index - 1, false);
  loadCardPoster(index + 1, false);
  currentCard = index;
  previewEvent = visibleEvents[index];
  dateMeter.style.setProperty('--date-index', index);
  dateCount.textContent = (index + 1) + ' / ' + cards.length;
  previousDate.disabled = index === 0;
  nextDate.disabled = index === cards.length - 1;
}
function browseDateCard(direction) {
  moveDateCard(currentCard + direction, quietDates.matches ? 'instant' : 'smooth');
}
previousDate.onclick = () => browseDateCard(-1);
nextDate.onclick = () => browseDateCard(1);
let dateSettle;
dateGrid.addEventListener('scroll', () => {
  updateDateControls();
  clearTimeout(dateSettle);
  dateSettle = setTimeout(() => updateDateControls(true), 120);
}, {passive: true});
compactDates.addEventListener('change', renderEvents);
let traceFrame = 0;
let programmeInView = false;
let activeRow;
let pulseAnimation;
function drawDateTrace() {
  traceFrame = 0;
  if (!activeRow || !programmeInView || datePreview.hidden) return;
  const bounds = programme.getBoundingClientRect();
  const anchor = activeRow.querySelector('.programme-arrow').getBoundingClientRect();
  const poster = posterStage.getBoundingClientRect();
  const x = anchor.left + anchor.width / 2 - bounds.left;
  const y = anchor.top + anchor.height / 2 - bounds.top;
  const end = poster.left - bounds.left - 5;
  const target = poster.top + poster.height * .64 - bounds.top;
  const bend = (end - x) * .63;
  datePath.setAttribute('d', 'M ' + x + ' ' + y + ' C ' + (x + bend) + ' ' + y + ', ' +
    (end - bend) + ' ' + target + ', ' + end + ' ' + target);
}
function scheduleDateTrace() {
  if (programmeInView && !compactDates.matches && !traceFrame) traceFrame = requestAnimationFrame(drawDateTrace);
}
function followDateTrace() {
  window.removeEventListener('scroll', scheduleDateTrace);
  if (programmeInView && !compactDates.matches) {
    window.addEventListener('scroll', scheduleDateTrace, {passive: true});
    scheduleDateTrace();
  }
}
new IntersectionObserver(([entry]) => {
  programmeInView = entry.isIntersecting;
  followDateTrace();
}).observe(programme);
const dateSize = new ResizeObserver(scheduleDateTrace);
dateSize.observe(programme);
dateSize.observe(posterStage);

function previewDate(item) {
  if (compactDates.matches) {
    previewEvent = item;
    return;
  }
  if (previewEvent === item) return;
  previewEvent = item;
  const title = translated(item, 'title');
  const image = posterImage(item, 'preview');
  const present = () => {
    if (previewEvent !== item || datePreview.hidden) return;
    datePreview.style.setProperty('--poster-ratio', item.posterSize ? item.posterSize[0] / item.posterSize[1] : 1);
    posterStage.replaceChildren(image);
    posterNote.textContent = translated(item, 'caption');
    datePreview.setAttribute('aria-label', local('Ouvrir la fiche', 'Open event') + ' · ' + title);
    displayedDate = item;
    scheduleDateTrace();
  };
  // Une frappe rapide peut changer de date pendant le décodage du tirage précédent.
  if (programmeInView && posterStage.childElementCount && image.decode) image.decode().then(present, present);
  else present();
  activeRow?.classList.remove('current');
  activeRow = dateGrid.children[visibleEvents.indexOf(item)];
  activeRow.classList.add('current');
  pulseAnimation?.cancel();
  if (programmeInView && !quietDates.matches) {
    pulseAnimation = tracePulse.animate([{strokeDashoffset: '.18', opacity: 0}, {opacity: 1, offset: .28},
      {strokeDashoffset: '-1', opacity: 0}], {duration: 480, easing: 'ease-out'});
  }
  scheduleDateTrace();
}

function openDate(item) {
  openedEvent = item;
  previewDate(item);
  if (compactDates.matches) moveDateCard(visibleEvents.indexOf(item));
  byId('event-position').textContent = (visibleEvents.indexOf(item) + 1) + ' / ' + visibleEvents.length;
  byId('event-prev').disabled = byId('event-next').disabled = visibleEvents.length < 2;
  showModal(item, translated(item, 'title'), item.tag + ' · ' + item.artist, translated(item, 'meta'));
}

function stepDate(direction) {
  const index = visibleEvents.indexOf(openedEvent);
  openDate(visibleEvents[(index + direction + visibleEvents.length) % visibleEvents.length]);
}
datePreview.onclick = () => openDate(displayedDate || previewEvent);
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
  const compact = compactDates.matches;
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
    if (compact) {
      const frame = element('span', 'date-cover');
      frame.append(posterImage(item, 'card'));
      row.prepend(frame);
      row.append(element('span', 'date-caption', translated(item, 'caption')));
    } else {
      row.onpointerenter = e => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') previewDate(item); };
      row.onfocus = () => previewDate(item);
    }
    row.onclick = () => openDate(item);
    grid.append(row);
  }
  previewEvent = null;
  activeRow = null;
  datePreview.hidden = compact || !visibleEvents.length;
  if (datePreview.hidden) {
    datePath.removeAttribute('d');
    posterStage.replaceChildren();
  }
  followDateTrace();
  dateControls.hidden = !compact || visibleEvents.length < 2;
  previousDate.setAttribute('aria-label', local('Date précédente', 'Previous event'));
  nextDate.setAttribute('aria-label', local('Date suivante', 'Next event'));
  if (compact) {
    currentCard = -1;
    dateMeter.style.setProperty('--date-total', visibleEvents.length);
    moveDateCard(Math.max(0, visibleEvents.indexOf(previous)));
    updateDateControls(true);
  } else if (visibleEvents.length) {
    previewDate(visibleEvents.includes(previous) ? previous : visibleEvents[0]);
  }
}

const initialReleaseCount = 4;
const shortCatalogue = matchMedia('(max-width: 640px)');
let catalogueExpanded = false;
const expandCatalogue = byId('catalogue-expand');
expandCatalogue.onclick = () => {
  catalogueExpanded = true;
  renderReleases(true);
  byId('release-grid').children[initialReleaseCount]?.focus({preventScroll: true});
};
function renderReleases(append = false) {
  const grid = byId('release-grid');
  const matches = releases.filter(r => selectedRelease === 'all' || selectedRelease === r.type || (selectedRelease === 'vinyl' && r.isVinyl));
  const compact = shortCatalogue.matches && selectedRelease === 'all' && !catalogueExpanded;
  const visible = compact ? matches.slice(0, initialReleaseCount) : matches;
  const remaining = matches.length - visible.length;
  expandCatalogue.hidden = remaining === 0;
  expandCatalogue.textContent = local('Voir les ' + remaining + ' autres sorties', 'Show ' + remaining + ' more releases');
  const cards = document.createDocumentFragment();
  const dateFormat = new Intl.DateTimeFormat(lang, {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'});
  for (const r of visible.slice(append ? grid.childElementCount : 0)) {
    const frame = picture(r, r.title, 'disc-frame', r.format, r.isVinyl ? 'vinyl' : r.type);
    const reference = r.cat || 'Void X Series';
    const date = dateFormat.format(new Date(r.date + 'T00:00:00Z'));
    card(cards, frame, reference + ' · ' + date, r.title, r.artist, i18nDict[lang].card_more_release,
      () => showModal(r, r.title, reference + ' · ' + r.artist, translated(r, 'meta'), r.link, 'Bandcamp'));
  }
  if (append) grid.append(cards);
  else grid.replaceChildren(cards);
}
shortCatalogue.addEventListener('change', () => renderReleases());

const archivePanel = document.querySelector('.show-archive');
let archiveLang;
function renderArchive() {
  if (!archivePanel.open || archiveLang === lang) return;
  archiveLang = lang;
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
archivePanel.addEventListener('toggle', renderArchive);
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
    button.setAttribute('aria-expanded', 'false');
    if (p.festivalLive) button.id = 'festival-podcast';
    button.onclick = () => {
      if (drawerButton === button && drawer.classList.contains('active')) {
        closeDrawer();
        return;
      }
      drawerButton?.setAttribute('aria-expanded', 'false');
      previewPlayer.pause();
      drawerButton = button;
      button.setAttribute('aria-expanded', 'true');
      const iframe = element('iframe');
      iframe.title = 'SoundCloud · ' + p.title;
      iframe.width = '100%';
      iframe.height = '166';
      iframe.allow = 'autoplay';
      iframe.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(p.scUrl) + '&color=%23d9ef9a&auto_play=false&show_comments=false';
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
  drawerButton?.setAttribute('aria-expanded', 'false');
}
byId('sc-drawer-close').onclick = () => { closeDrawer(); drawerButton?.focus(); };

function galleryIndex() {
  const left = gallery.getBoundingClientRect().left;
  return Array.from(gallery.children).reduce((best, slide, index, slides) =>
    Math.abs(slide.getBoundingClientRect().left - left) < Math.abs(slides[best].getBoundingClientRect().left - left) ? index : best, 0);
}
function updateCounter() {
  const count = gallery.children.length;
  if (!count) return;
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

function render() {
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll('[data-i18n]')) el.innerHTML = i18nDict[lang][el.dataset.i18n];
  byId('lang-toggle').lang = local('en', 'fr');
  byId('lang-toggle').setAttribute('aria-label', local('Switch to English', 'Passer en français'));
  byId('event-prev').setAttribute('aria-label', local('Date précédente', 'Previous event'));
  byId('event-next').setAttribute('aria-label', local('Date suivante', 'Next event'));
  byId('sections').setAttribute('aria-label', local('Sections du presskit', 'Presskit sections'));
  byId('modal-close-btn').setAttribute('aria-label', local('Fermer', 'Close'));
  byId('carousel-prev').setAttribute('aria-label', local('Photo précédente', 'Previous photograph'));
  byId('carousel-next').setAttribute('aria-label', local('Photo suivante', 'Next photograph'));
  byId('nav-count-releases').textContent = releases.length;
  document.querySelectorAll('[data-i18n="bannerReleases"]').forEach(el => {
    el.textContent = releases.length + ' ' + i18nDict[lang].bannerReleases;
  });
  renderArchive(); renderEvents(); renderReleases(); renderRoster(); renderPodcasts(); renderGallery(); previewPlayer.refresh();
}
byId('lang-toggle').onclick = () => { closeDrawer(); lang = local('en', 'fr'); render(); };
render();
