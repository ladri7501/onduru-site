/* 첫 화면(/) — 2026-11-27 판의 틀 (On 2026-11-27 고쳐 말씀: 심플하게, 전시에 방해되지 않게).
 *  · 위: 로고 · ONDURU · 메뉴 · 한 / EN / ES. 아래: 작품(네 작품의 목록이 위로 열림) · 재생.
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
  // The frame around the picture takes the colour at the picture's edge, so no seam shows between them.
  const setEdge = colour => { root.style.setProperty('--edge', colour); };
  const work = window.Prologue.mount($('#prologue'), {onState: sync, onEdge: colour => { if (current === 'now') setEdge(colour); }});

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
  function frameEdge() {
    try {
      const doc = frame && frame.contentDocument, bg = doc && getComputedStyle(doc.body).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') setEdge(bg);
    } catch {}
  }

  function localize() {
    const copy = words[locale], index = workLinks.findIndex(a => a.dataset.work === current);
    root.lang = locale;
    d.title = copy.list[index] + ' · ONDURU';
    $('.skip').textContent = copy.skip;
    $('.mark').setAttribute('aria-label', copy.home);
    $('.home-nav').setAttribute('aria-label', copy.pages);
    $('.home-lang').setAttribute('aria-label', copy.language);
    $('.works-name').textContent = copy.works;
    stage.setAttribute('aria-label', copy.list[index]);
    for (const a of d.querySelectorAll('a[data-to]')) a.setAttribute('href', '/' + locale + '/' + a.dataset.to + '/');
    for (const b of d.querySelectorAll('.home-lang button')) b.setAttribute('aria-pressed', String(b.dataset.lang === locale));
    workLinks.forEach((a, i) => { a.textContent = copy.list[i]; });
    if (frame) frame.title = copy.list[index];
    work.setLocale(locale);
    frameLocale();
    sync();
  }
  for (const b of d.querySelectorAll('.home-lang button')) b.addEventListener('click', () => {
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
      frame.addEventListener('load', () => { frameLocale(); frameEdge(); });
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
  // Anywhere on the page but its links and buttons: the next page of the work. With the list of
  // works open, a click elsewhere only closes it.
  d.addEventListener('click', event => {
    if (event.button) return;
    const inside = event.target.closest && event.target.closest('.works');
    if (isOpen() && !inside) { openList(false); return; }
    if (current !== 'now') return;
    if (event.target.closest && event.target.closest('a,button,input,select,textarea,summary,label,iframe')) return;
    work.next();
  });
  d.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) { openList(false); worksBtn.focus(); return; }
    if (current !== 'now' || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest && event.target.closest('input,select,textarea,[contenteditable]')) return;
    if (event.key === 'PageDown') { event.preventDefault(); work.next(); }
    else if (event.key === 'PageUp') { event.preventDefault(); work.prev(); }
    else if (event.key === ' ' && !(event.target.closest && event.target.closest('button,a,summary'))) { event.preventDefault(); toggle(); }
  });

  localize();
  work.play(locale);
})();
