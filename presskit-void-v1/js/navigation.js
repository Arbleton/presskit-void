'use strict';

(() => {
  const nav = document.getElementById('sections');
  const header = nav.closest('header');
  const trigger = header.querySelector('.menu-trigger');
  const compact = matchMedia('(max-width: 900px)');
  function setMenu(open) {
    trigger.setAttribute('aria-expanded', String(open));
    header.classList.toggle('menu-open', open);
  }
  trigger.onclick = () => setMenu(!header.classList.contains('menu-open'));
  document.addEventListener('pointerdown', event => {
    if (!header.contains(event.target) && header.classList.contains('menu-open')) setMenu(false);
  });
  header.addEventListener('focusout', event => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
  });
  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false);
      trigger.focus();
    }
  });
  compact.addEventListener('change', () => setMenu(false));
  const links = [...nav.querySelectorAll('a')];
  const sections = links.map(link => document.querySelector(link.hash));
  let sectionTops = [];
  let active = -1;
  let inspected = null;
  let destination = null;
  let layoutFrame = 0;

  function paintRail() {
    if (compact.matches) return;
    const link = inspected || destination || links[active];
    const bounds = nav.getBoundingClientRect();
    nav.classList.toggle('overflow-left', nav.scrollLeft > 2);
    nav.classList.toggle('overflow-right', nav.scrollWidth - nav.clientWidth - nav.scrollLeft > 2);
    if (link) {
      const box = link.getBoundingClientRect();
      const center = box.left + box.width / 2;
      header.classList.toggle('rail-on', center >= bounds.left && center <= bounds.right);
      header.style.setProperty('--nav-x', center + 'px');
      header.style.setProperty('--nav-span', Math.max(52, box.width + 24) + 'px');
    } else {
      header.classList.remove('rail-on');
    }
  }

  function revealLink(link) {
    if (compact.matches) return;
    if (!link || nav.scrollWidth <= nav.clientWidth) return;
    const box = link.getBoundingClientRect();
    const bounds = nav.getBoundingClientRect();
    const inset = 20;
    if (box.left < bounds.left + inset) nav.scrollLeft += box.left - bounds.left - inset;
    else if (box.right > bounds.right - inset) nav.scrollLeft += box.right - bounds.right + inset;
  }

  function followScroll() {
    const position = window.scrollY + innerHeight * .35;
    let next = sectionTops.length - 1;
    while (next >= 0 && sectionTops[next] > position) next--;
    if (next === active) return;
    links[active]?.removeAttribute('aria-current');
    active = next;
    const link = links[active];
    link?.setAttribute('aria-current', 'location');
    if (destination === link) destination = null;
    if (!destination) {
      if (link) revealLink(link);
      else nav.scrollLeft = 0;
    }
    paintRail();
  }

  // L’ouverture des archives ou un filtre peut déplacer toutes les rubriques suivantes.
  function measure() {
    layoutFrame = 0;
    sectionTops = sections.map(section => section.getBoundingClientRect().top + window.scrollY);
    followScroll();
    revealLink(destination || links[active]);
    paintRail();
  }
  function requestMeasure() {
    if (!layoutFrame) layoutFrame = requestAnimationFrame(measure);
  }
  const layout = new ResizeObserver(requestMeasure);
  for (const section of document.querySelector('main').children) layout.observe(section);
  layout.observe(nav);
  document.fonts.ready.then(requestMeasure);
  document.getElementById('lang-toggle').addEventListener('click', requestMeasure);
  window.addEventListener('resize', requestMeasure);
  window.addEventListener('scroll', followScroll, {passive: true});
  nav.addEventListener('scroll', paintRail, {passive: true});

  function clearDestination() { destination = null; }
  window.addEventListener('wheel', clearDestination, {passive: true});
  window.addEventListener('touchstart', clearDestination, {passive: true});
  window.addEventListener('keydown', clearDestination);
  for (const link of links) {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (compact.matches) {
        setMenu(false);
        const target = document.querySelector(link.hash);
        target.tabIndex = -1;
        target.focus({preventScroll:true});
      }
      destination = link === links[active] ? null : link;
      revealLink(link);
      paintRail();
    });
    link.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') { inspected = link; paintRail(); }
    });
    link.addEventListener('focus', () => {
      if (link.matches(':focus-visible')) { inspected = link; paintRail(); }
    });
  }
  function clearInspection() { inspected = null; paintRail(); }
  nav.addEventListener('pointerleave', clearInspection);
  nav.addEventListener('focusout', clearInspection);
  measure();
})();
