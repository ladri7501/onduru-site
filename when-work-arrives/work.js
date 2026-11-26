/* 「온두루, 일이 닿으면」 (2026-11-27 판) — 작품을 틀고, 언어와 재생 · 일시정지를 맡는다.
 * 작품은 prologue.js 가 그린다: 우주 → 지구 → 한반도 → 작업실 → PC 안 다자간 에이전트의 나라 →
 * 서울 → 대한민국 → 지구본. 끝까지 흐르면 고른 언어의 발자취(Footsteps)로 간다 (On 2026-11-27). */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const languages = ['ko', 'en', 'es'];
  const words = {
    ko: {title: '온두루, 일이 닿으면', controls: '전시 조작', language: '언어 바꾸기. 현재 한국어', play: '재생', pause: '일시정지'},
    en: {title: 'Onduru, When Work Arrives', controls: 'Exhibition controls', language: 'Change language. Currently English', play: 'Play', pause: 'Pause'},
    es: {title: 'Onduru, cuando llega un encargo', controls: 'Controles de la exposición', language: 'Cambiar el idioma. Español seleccionado', play: 'Reproducir', pause: 'Pausar'}
  };
  // Site rule: keep the language chosen anywhere on the site; otherwise Korean for Korean browsers, English for others.
  function firstLocale() {
    let saved = null;
    try { saved = localStorage.getItem('onduru-lang'); } catch {}
    if (languages.includes(saved)) return saved;
    const nav = typeof navigator === 'object' && navigator ? navigator : null;
    const browser = nav && ((nav.languages && nav.languages[0]) || nav.language) || '';
    if (!browser) return languages.includes(root.lang) ? root.lang : 'ko';
    return /^ko\b/i.test(browser) ? 'ko' : 'en';
  }
  let locale = firstLocale();
  const transport = $('transport'), lang = $('lang');
  // When the work has run to its end, the visitor goes on to Footsteps in the chosen language.
  const work = window.Prologue.mount($('prologue'), {onFinish: () => { location.assign('/' + locale + '/footsteps/'); }});

  function sync() {
    const copy = words[locale], playing = work.isOpen() && !work.isPaused(), label = playing ? copy.pause : copy.play;
    transport.setAttribute('aria-pressed', String(playing));
    transport.setAttribute('aria-label', label); transport.title = label;
  }
  function localize() {
    const copy = words[locale];
    root.lang = locale; root.dataset.lang = locale;
    document.title = copy.title + ' · ONDURU';
    lang.setAttribute('aria-label', copy.language); lang.title = copy.language;
    document.querySelector('.ctrl').setAttribute('aria-label', copy.controls);
    work.setLocale(locale);
    sync();
  }
  // The label that was pressed is the language that opens (On, 2026-11-23). From the keyboard the button steps to the next one.
  lang.addEventListener('click', event => {
    let pick = null;
    if (event && event.detail > 0) {
      let nearest = Infinity;
      for (const mark of lang.querySelectorAll('[lang]')) {
        const box = mark.getBoundingClientRect(), gap = Math.abs(event.clientX - (box.left + box.width / 2));
        if (gap < nearest) { nearest = gap; pick = mark.lang; }
      }
    }
    if (!languages.includes(pick)) pick = languages[(languages.indexOf(locale) + 1) % languages.length];
    if (pick === locale) return;
    locale = pick;
    try { localStorage.setItem('onduru-lang', locale); } catch {}
    localize();
  });
  function toggle() { if (work.isOpen()) { work.setPaused(!work.isPaused()); sync(); } }
  transport.addEventListener('click', toggle);
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.key !== ' ') return;
    if (event.target.closest && event.target.closest('button,a,select,input,textarea,summary')) return;
    event.preventDefault(); toggle();
  });
  localize();
  work.play(locale);
  sync();
})();
