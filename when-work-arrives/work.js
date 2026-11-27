/* 첫 화면(/) — 2026-11-27 판의 틀 (On 2026-11-27 고쳐 말씀: 심플하게, 전시에 방해되지 않게).
 *  · 위 · 아래는 다른 쪽과 같은 머리 · 바닥(site.css · head3.css): 위치 · 글꼴이 같다(On 2026-11-27 17:26).
 *    위: 로고 · ONDURU · 메뉴 · 한 / EN / ES · ◑ Aa A+. 아래: 첫 줄은 작품(네 작품의 목록이 위로 열림) · 재생, 둘째 줄은 © · On × Agent.
 *  · 지금 작품 「온두루, 일이 닿으면」은 prologue.js 가 전시 자리 안에 그린다. 끝나면 마지막 쪽에 그대로 머문다.
 *  · 쪽 넘기기: 전시 자리 어디든 누르거나 PageDown 이면 다음 쪽, PageUp 이면 앞 쪽. 멈춘 채로도 넘어간다.
 *  · 지난 작품은 같은 틀 안(전시 자리의 iframe)에서 열린다. 그 작품의 로고와 언어 단추는 틀 안에서 숨긴다.
 *  · 언어는 주소를 바꾸지 않고 이 자리에서 바뀐다. 고른 언어는 사이트 전체가 함께 기억한다(onduru-lang). */
(() => {
  'use strict';
  const d = document, root = d.documentElement, $ = s => d.querySelector(s);
  const languages = ['ko', 'en', 'es'];
  const words = {
    ko: {title: '온두루, 일이 닿으면', skip: '전시로 건너뛰기', home: 'ONDURU — 첫 화면', pages: '이 자리의 글', language: '언어', works: '작품', play: '재생', pause: '일시정지',
      list: ['온두루, 일이 닿으면', '당신이 상상할 수 있는 모든 것', '지운 자리의 노래', '같은 바람']},
    en: {title: 'Onduru, When Work Arrives', skip: 'Skip to the exhibition', home: 'ONDURU — Home', pages: 'Pages', language: 'Language', works: 'Works', play: 'Play', pause: 'Pause',
      list: ['Onduru, When Work Arrives', 'Everything you can imagine', 'Where It Was Struck Out', 'The Same Wind']},
    es: {title: 'Onduru, cuando llega un encargo', skip: 'Saltar a la exposición', home: 'ONDURU — Inicio', pages: 'Páginas', language: 'Idioma', works: 'Obras', play: 'Reproducir', pause: 'Pausar',
      list: ['Onduru, cuando llega un encargo', 'Todo lo que puedes imaginar', 'La canción del lugar tachado', 'El mismo viento']}
  };
  // Site rule: keep the language chosen anywhere on the site; otherwise Korean for Korean browsers, English for others.
  function firstLocale() {
    let saved = null;
    try { saved = localStorage.getItem('onduru-lang'); } catch {}
    if (languages.includes(saved)) return saved;
    const nav = typeof navigator === 'object' && navigator ? navigator : null;
    const browser = nav && ((nav.languages && nav.languages[0]) || nav.language) || '';
    return /^ko\b/i.test(browser) ? 'ko' : 'en';
  }
  let locale = firstLocale();
  const stage = $('#main'), transport = $('#transport'), worksBtn = $('#works'), worksList = $('#works-list');
  const workLinks = [...worksList.querySelectorAll('a')];
  let current = 'now', frame = null;
  // The frame and the work follow the time of day like every other page (night · dawn · paper; no
  // rain here — On, 2026-11-27 16:32). The work is drawn in its night colours; on paper it is turned
  // over by a CSS filter. A thin layer over it (.tone) then brings the colour at the work's edge to
  // exactly the page's background, screening it lighter on the dark grounds and multiplying it on
  // paper, so no seam shows between the frame and the work.
  const tone = $('.tone');
  let edge = [15, 19, 24];
  const rgbOf = text => {
    const t = String(text || '').trim(), hex = t.match(/^#([0-9a-f]{6})$/i), fn = t.match(/rgba?\(([^)]+)\)/i);
    if (hex) return [0, 2, 4].map(i => parseInt(hex[1].slice(i, i + 2), 16));
    if (fn) return fn[1].split(/[ ,/]+/).slice(0, 3).map(Number);
    return null;
  };
  const clip = v => Math.max(0, Math.min(255, v));
  // What invert(1) hue-rotate(180deg) makes of a colour (the CSS filter matrices, clipped as browsers do).
  const turnedOver = ([r, g, b]) => {
    const [R, G, B] = [255 - r, 255 - g, 255 - b];
    return [clip(-0.574 * R + 1.43 * G + 0.144 * B), clip(0.426 * R + 0.43 * G + 0.144 * B), clip(0.426 * R + 1.43 * G - 0.856 * B)];
  };
  function retone() {
    const bg = rgbOf(getComputedStyle(root).getPropertyValue('--bg')) || [15, 19, 24];
    tone.hidden = current !== 'now';
    if (root.getAttribute('data-theme') === 'paper') {
      const x = turnedOver(edge);
      tone.style.background = 'rgb(' + bg.map((c, i) => Math.round(clip(255 * c / Math.max(1, x[i])))).join(',') + ')';
    } else {
      tone.style.background = 'rgb(' + bg.map((c, i) => Math.round(clip((c - edge[i]) / Math.max(.01, 1 - edge[i] / 255)))).join(',') + ')';
    }
  }
  const work = window.Prologue.mount($('#prologue'), {onState: sync, onEdge: colour => {
    root.style.setProperty('--edge', colour);
    edge = rgbOf(colour) || edge;
    retone();
  }});
  new MutationObserver(retone).observe(root, {attributes: true, attributeFilter: ['data-theme']});
  d.addEventListener('onduru:sky', retone);

  function sync() {
    const copy = words[locale], playing = work.isPlaying(), label = playing ? copy.pause : copy.play;
    transport.hidden = current !== 'now';
    transport.setAttribute('aria-pressed', String(playing));
    transport.setAttribute('aria-label', label); transport.title = label;
  }

  // The earlier works keep their own language button, hidden inside the frame; it steps ko → en → es.
  function frameLocale() {
    try {
      const doc = frame && frame.contentDocument, button = doc && doc.querySelector('.lng, [data-act="lang"]');
      for (let i = 0; doc && button && i < 3 && doc.documentElement.getAttribute('lang') !== locale; i++) button.click();
    } catch {}
  }

  function localize() {
    const copy = words[locale], index = workLinks.findIndex(a => a.dataset.work === current);
    root.lang = locale;
    d.title = copy.list[index] + ' · ONDURU';
    $('.skip').textContent = copy.skip;
    $('.mark').setAttribute('aria-label', copy.home);
    $('.site-nav').setAttribute('aria-label', copy.pages);
    $('.lng3').setAttribute('aria-label', copy.language);
    $('.works-name').textContent = copy.works;
    stage.setAttribute('aria-label', copy.list[index]);
    for (const a of d.querySelectorAll('a[data-to]')) a.setAttribute('href', '/' + locale + '/' + a.dataset.to + '/');
    for (const b of d.querySelectorAll('.lng3 button')) b.setAttribute('aria-pressed', String(b.dataset.lang === locale));
    workLinks.forEach((a, i) => { a.textContent = copy.list[i]; });
    if (frame) frame.title = copy.list[index];
    work.setLocale(locale);
    frameLocale();
    retone();
    sync();
  }
  for (const b of d.querySelectorAll('.lng3 button')) b.addEventListener('click', () => {
    if (b.dataset.lang === locale) return;
    locale = b.dataset.lang;
    try { localStorage.setItem('onduru-lang', locale); } catch {}
    localize();
  });

  // The list of works opens upward from the bottom line; any click elsewhere or Escape closes it.
  const isOpen = () => worksBtn.getAttribute('aria-expanded') === 'true';
  function openList(open) {
    worksBtn.setAttribute('aria-expanded', String(open));
    worksList.hidden = !open;
  }
  worksBtn.addEventListener('click', event => { openList(!isOpen()); if (event.detail) worksBtn.blur(); });

  // Choosing a work: the present one is drawn here; an earlier one opens in the same frame.
  function open(name) {
    if (!workLinks.some(a => a.dataset.work === name)) return false;
    current = name;
    workLinks.forEach(a => { if (a.dataset.work === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (frame) { frame.remove(); frame = null; }
    if (name === 'now') work.play(locale);
    else {
      work.hide();
      frame = d.createElement('iframe');
      frame.className = 'archive';
      frame.src = '/' + name + '/?lang=' + locale;
      frame.addEventListener('load', frameLocale);
      stage.append(frame);
    }
    localize();
    return true;
  }
  workLinks.forEach(a => a.addEventListener('click', event => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openList(false);
    open(a.dataset.work);
  }));
  // A link inside an earlier work to another of the works opens it here too (see the works' own pages).
  window.OnduruWorks = {go: path => open((path || '').replace(/^\/|\/$/g, '') || 'now')};

  function toggle() { if (current === 'now' && work.isOpen()) { work.setPaused(work.isPlaying()); sync(); } }
  // A pointer press leaves no focus ring behind on the button; the keyboard keeps it.
  transport.addEventListener('click', event => { toggle(); if (event.detail) transport.blur(); });
  // Hands on the work (On, 2026-11-27): a swipe up is the next page and a swipe down the one
  // before; on the last page the globe turns under the finger or the mouse instead. The mouse
  // wheel turns pages the same way. All of this works while playing or paused.
  // Two fingers on the last page bring the globe nearer or farther (On, 2026-11-27).
  let hold = null, swallow = 0, pinch = null;
  const host = $('#prologue'), fingers = new Map();
  const spread = () => { const [a, b] = [...fingers.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
  host.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') fingers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (fingers.size === 2 && current === 'now' && work.canTurn()) {
      hold = null; work.stopSpin();
      pinch = {d: Math.max(1, spread()), z: work.zoomLevel()};
      for (const id of fingers.keys()) { try { host.setPointerCapture(id); } catch {} }
      return;
    }
    if (pinch || current !== 'now' || (event.pointerType === 'mouse' && event.button !== 0) || isOpen()) return;
    const box = host.getBoundingClientRect(), x = event.clientX - box.left, y = event.clientY - box.top;
    hold = {id: event.pointerId, type: event.pointerType, x0: event.clientX, y0: event.clientY, x: event.clientX, y: event.clientY, t: performance.now(), v: [0, 0], moved: 0,
      globe: work.globeHit(x, y)};
    if (hold.globe) { work.stopSpin(); try { host.setPointerCapture(event.pointerId); } catch {} }
  });
  host.addEventListener('pointermove', event => {
    if (fingers.has(event.pointerId)) fingers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (pinch) { if (fingers.size === 2) work.setZoom(pinch.z * spread() / pinch.d); return; }
    if (!hold || event.pointerId !== hold.id) return;
    const now = performance.now(), dx = event.clientX - hold.x, dy = event.clientY - hold.y, dt = Math.max(1, now - hold.t);
    hold.moved += Math.abs(dx) + Math.abs(dy);
    if (hold.globe) {
      work.turnGlobe(dx, dy);
      hold.v = [hold.v[0] * .4 + dx / dt * .6, hold.v[1] * .4 + dy / dt * .6];
    }
    hold.x = event.clientX; hold.y = event.clientY; hold.t = now;
  });
  const letGo = event => {
    fingers.delete(event.pointerId);
    if (pinch) { if (fingers.size < 2) { pinch = null; hold = null; swallow = performance.now() + 500; } return; }
    if (!hold || event.pointerId !== hold.id) return;
    const h = hold; hold = null;
    if (h.globe) {
      if (h.moved > 6) { swallow = performance.now() + 400; if (performance.now() - h.t < 90) work.flingGlobe(h.v[0], h.v[1]); }
      return;
    }
    const dx = event.clientX - h.x0, dy = event.clientY - h.y0;
    if (h.type !== 'mouse' && Math.abs(dy) > 36 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      swallow = performance.now() + 400;
      if (dy < 0) work.next(); else work.prev();
    }
  };
  host.addEventListener('pointerup', letGo);
  host.addEventListener('pointercancel', event => {
    fingers.delete(event.pointerId);
    if (fingers.size < 2) pinch = null;
    if (hold && event.pointerId === hold.id) hold = null;
  });
  let wheel = 0, wheelAt = 0, wheelLock = 0;
  d.addEventListener('wheel', event => {
    if (current !== 'now' || event.ctrlKey || isOpen()) return;
    const now = performance.now();
    if (now - wheelAt > 250) wheel = 0;
    wheelAt = now;
    wheel += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1);
    // A trackpad keeps scrolling after the hand has stopped: wait for a pause before the next page.
    if (now < wheelLock) { wheel = 0; wheelLock = Math.max(wheelLock, now + 250); return; }
    if (Math.abs(wheel) < 40) return;
    wheelLock = now + 700;
    if (wheel > 0) work.next(); else work.prev();
    wheel = 0;
  }, {passive: true});

  // Anywhere in the exhibition but its links and buttons: the next page of the work. With the list of
  // works open, a click elsewhere only closes it.
  d.addEventListener('click', event => {
    if (event.button) return;
    if (performance.now() < swallow) { swallow = 0; return; }
    const inside = event.target.closest && event.target.closest('.workbar');
    if (isOpen() && !inside) { openList(false); return; }
    if (current !== 'now') return;
    // Only inside the exhibition: the bars above and below are the site's own and turn no pages.
    if (!(event.target.closest && event.target.closest('#main'))) return;
    if (event.target.closest('a,button,input,select,textarea,summary,label,iframe')) return;
    work.next();
  });
  d.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) { openList(false); worksBtn.focus(); return; }
    if (current !== 'now' || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest && event.target.closest('input,select,textarea,[contenteditable]')) return;
    if (event.key === '+' || event.key === '=' || event.key === 'Add') { if (work.zoomGlobe(1.25)) event.preventDefault(); return; }
    if (event.key === '-' || event.key === '_' || event.key === 'Subtract') { if (work.zoomGlobe(1 / 1.25)) event.preventDefault(); return; }
    if (event.key === 'PageDown') { event.preventDefault(); work.next(); }
    else if (event.key === 'PageUp') { event.preventDefault(); work.prev(); }
    else if (event.key === ' ' && !(event.target.closest && event.target.closest('button,a,summary'))) { event.preventDefault(); toggle(); }
  });

  localize();
  work.play(locale);
})();
