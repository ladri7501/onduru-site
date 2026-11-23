/* ONDURU 사이트 기준에 맞추는 층 (2026-11-23) — 연대 창
 * 고르는 칸을 열면 목록이 창 안에 다 보이게 밀어 주고, 아래에 더 있으면 옅은 그늘로 알린다.
 * 전시의 글 · 장면 · 고르는 방식은 건드리지 않는다. 이 스크립트가 꺼져도 전시는 그대로 열린다. */
(() => {
  'use strict';
  const dlg = document.getElementById('coalition-dialog');
  /* 살피는 기능이 없는 곳에서는 아무것도 하지 않는다 — 전시는 그대로 */
  if (!dlg || typeof MutationObserver !== 'function' || typeof requestAnimationFrame !== 'function' || !dlg.addEventListener) return;
  const calm = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const more = () => {
    const on = dlg.open && dlg.scrollHeight - dlg.clientHeight - dlg.scrollTop > 8;
    if (on !== dlg.hasAttribute('data-more')) dlg.toggleAttribute('data-more', on);
  };
  const reveal = trigger => {
    if (!dlg.open || trigger.getAttribute('aria-expanded') !== 'true') return;
    const id = trigger.getAttribute('aria-controls');
    const list = (id && document.getElementById(id)) || trigger.nextElementSibling;
    const box = (list && list.closest('.f-popup')) || list;
    if (!box) return;
    const bar = dlg.querySelector('.coalition-bar');
    const d = dlg.getBoundingClientRect(), b = box.getBoundingClientRect(), t = trigger.getBoundingClientRect();
    const top = d.top + (bar ? bar.offsetHeight : 0) + 8, bottom = d.bottom - 10;
    let dy = b.bottom > bottom ? b.bottom - bottom : 0;
    if (t.top - dy < top) dy = t.top - top;      /* 누른 줄(고르는 칸의 머리)은 가리지 않는다 */
    if (dy > 1) dlg.scrollBy({top: dy, behavior: calm() ? 'auto' : 'smooth'});
  };
  let queued = false;
  const soon = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; more(); }); };
  new MutationObserver(records => {
    for (const r of records) {
      if (r.type === 'attributes' && r.attributeName === 'aria-expanded' && r.target.matches && r.target.matches('.f-trigger')) requestAnimationFrame(() => reveal(r.target));
    }
    soon();
  }).observe(dlg, {subtree: true, childList: true, attributes: true, attributeFilter: ['aria-expanded', 'open', 'hidden']});
  dlg.addEventListener('scroll', soon, {passive: true});
  window.addEventListener('resize', soon);
  soon();
})();

/* 아래 메뉴 — 맺음(끝의 글 덩이)이 화면에 들어오면 본문 안, 「첫머리로 · 우주에서 다시 보기」 바로 위에 선다 (On 2026-11-23 08:39).
 * 장면이 도는 동안에는 전시가 정한 대로 화면 아래에 떠 있다. 이 스크립트가 꺼져도 메뉴는 그대로 쓸 수 있다. */
(() => {
  'use strict';
  const paths = document.getElementById('paths'), dock = document.getElementById('paths-dock'), foot = document.getElementById('colophon');
  if (!paths || !dock || !foot || !paths.parentNode || typeof dock.getBoundingClientRect !== 'function' || typeof foot.getClientRects !== 'function'
      || typeof window.addEventListener !== 'function' || typeof requestAnimationFrame !== 'function' || typeof document.createComment !== 'function') return;
  const home = document.createComment('paths');
  paths.parentNode.insertBefore(home, paths);
  let docked = false, queued = false;
  const base = document.getElementById('site-foot');   /* 붙어 있는 바닥 줄 — 그만큼 위에서 판단한다 (On 2026-11-23 10:45) */
  const lift = () => (base && typeof base.getBoundingClientRect === 'function' ? base.getBoundingClientRect().height : 0);
  const wanted = () => foot.getClientRects().length > 0 && dock.getBoundingClientRect().top <= window.innerHeight - 52 - lift();
  const settle = () => {
    queued = false;
    const want = wanted();
    if (want === docked) return;
    const active = document.activeElement, had = !!active && paths.contains(active);
    if (want) dock.appendChild(paths); else home.parentNode.insertBefore(paths, home.nextSibling);
    docked = want;
    foot.classList.toggle('nav-docked', docked);
    paths.classList.remove('arriving'); void paths.offsetWidth; paths.classList.add('arriving');
    if (had && typeof active.focus === 'function') active.focus({preventScroll: true});
  };
  const ask = () => { if (!queued) { queued = true; requestAnimationFrame(settle); } };
  window.addEventListener('scroll', ask, {passive: true});
  window.addEventListener('resize', ask);
  if (typeof MutationObserver === 'function') {
    new MutationObserver(ask).observe(document.documentElement, {attributes: true, attributeFilter: ['class', 'data-mode', 'data-entering']});
    const work = document.getElementById('work');
    if (work) new MutationObserver(ask).observe(work, {attributes: true, attributeFilter: ['hidden']});
  }
  ask();
})();

/* 붙어 있는 바닥 줄의 높이를 재어 알린다 — 장면 메뉴 · 자막 · 방들이 그 위에 선다 (On 2026-11-23 10:45).
 * 이 스크립트가 꺼져도 꼴 파일의 어림값(4.6rem)으로 선다. */
(() => {
  'use strict';
  try {
    const foot = document.getElementById('site-foot'), root = document.documentElement;
    if (!foot || !root || !root.style || typeof root.style.setProperty !== 'function' || typeof foot.getBoundingClientRect !== 'function'
        || typeof window.addEventListener !== 'function' || typeof requestAnimationFrame !== 'function') return;
    let last = -1, queued = false;
    const set = () => {
      queued = false;
      try {
        const h = Math.round(foot.getBoundingClientRect().height);
        if (h === last) return;
        last = h; root.style.setProperty('--fit-foot', h + 'px');
        /* 높이가 바뀌면 전시가 자막과 제목의 자리를 다시 재게 한다 */
        if (typeof Event === 'function' && typeof window.dispatchEvent === 'function') window.dispatchEvent(new Event('resize'));
      } catch (e) { /* 전시는 그대로 */ }
    };
    const ask = () => { if (!queued) { queued = true; requestAnimationFrame(set); } };
    window.addEventListener('resize', ask);
    if (typeof MutationObserver === 'function') new MutationObserver(ask).observe(root, {attributes: true, attributeFilter: ['data-entering', 'data-lang', 'lang', 'data-mode']});
    if (typeof ResizeObserver === 'function') new ResizeObserver(ask).observe(foot);
    ask();
  } catch (e) { /* 전시는 그대로 */ }
})();

/* 산업 장면의 넘김 막대 — 기업 · 개인 장면과 같은 꼴: 컷마다 한 칸, 앞 · 멈춤 · 다음 (On 2026-11-23 10:45).
 * 영화는 전시가 정한 대로 저절로 돈다. 이 막대는 그 자리(스크롤)를 읽어 칸을 채우고, 누르면 그 컷의 첫머리로 옮긴다.
 * 재생과 멈춤은 전시의 단추(#transport)를 그대로 누른다. 이 스크립트가 꺼져도 영화는 그대로 돈다. */
(() => {
  'use strict';
  try {
    const root = document.documentElement, transport = document.getElementById('transport'), reel = document.getElementById('reel');
    const cap = document.querySelector ? document.querySelector('.cap') : null, body = document.body;
    if (!root || !transport || !reel || !cap || !body || typeof document.createElement !== 'function' || typeof document.createElementNS !== 'function'
        || typeof body.appendChild !== 'function' || typeof requestAnimationFrame !== 'function' || typeof window.scrollTo !== 'function'
        || typeof window.addEventListener !== 'function' || typeof MutationObserver !== 'function' || typeof transport.click !== 'function') return;
    const STOPS = [0, .12, .27, .40, .51, .65, .73, .856, 1];   /* 컷의 경계 — 전시의 재생 파일(player.js)의 filmStops 와 같은 값(짓는 글이 같은지 댄다) */
    const WORDS = {ko: ['장면', '앞 장면', '다음 장면'], en: ['Scene', 'Previous scene', 'Next scene'], es: ['Escena', 'Escena anterior', 'Escena siguiente']};
    const NS = 'http://www.w3.org/2000/svg';
    const icon = d => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'et-icon';
      const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
      const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'currentColor');
      p.setAttribute('stroke-width', '1.5'); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
      s.appendChild(p); b.appendChild(s); return b;
    };
    const bar = document.createElement('div'); bar.id = 'film-steps'; bar.className = 'et-controls'; bar.hidden = true;
    const strip = document.createElement('div'); strip.className = 'et-strip'; strip.setAttribute('role', 'group');
    const beats = STOPS.slice(0, -1).map((_, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'et-beat';
      b.addEventListener('click', () => seek(i)); strip.appendChild(b); return b;
    });
    const moves = document.createElement('div'); moves.className = 'et-transport';
    const back = icon('M14 6l-6 6 6 6'), toggle = icon('M9 6v12m6-12v12'), forward = icon('M10 6l6 6-6 6');
    moves.appendChild(back); moves.appendChild(toggle); moves.appendChild(forward);
    bar.appendChild(strip); bar.appendChild(moves); body.appendChild(bar);

    const endY = () => Math.max(1, reel.offsetHeight - window.innerHeight);
    const progress = () => Math.min(1, Math.max(0, window.scrollY / endY()));
    const cutAt = p => { let i = 0; while (i < STOPS.length - 2 && p >= STOPS[i + 1]) i++; return i; };
    const playing = () => transport.getAttribute('aria-pressed') === 'true';
    const shown = () => root.dataset.mode === 'film' && !root.hasAttribute('data-entering') && window.scrollY <= endY() + 2;
    function seek(i) {
      try { jump(i); } catch (e) { /* 전시는 그대로 */ }
    }
    function jump(i) {
      if (!shown()) return;
      i = Math.min(STOPS.length - 2, Math.max(0, i));
      const was = playing();
      if (was) transport.click();                                            /* 돌던 영화를 멈추고 */
      const dest = i === 0 ? 0 : STOPS[i] + (was ? .001 : .10 * (STOPS[i + 1] - STOPS[i]));   /* 그 컷의 첫머리로 — 멈춰 있을 때는 글이 보이는 자리로 */
      window.scrollTo(0, Math.round(dest * endY()));
      if (was) requestAnimationFrame(() => { if (!playing() && shown()) transport.click(); });   /* 돌던 중이었으면 거기서 이어 돈다 */
      ask();
    }
    back.addEventListener('click', () => seek(cutAt(progress()) - 1));
    forward.addEventListener('click', () => seek(cutAt(progress()) + 1));
    toggle.addEventListener('click', () => { if (shown()) transport.click(); });
    /* 멈춤 · 이어가기는 이 막대에 있다 — 오른쪽 위의 단추는 여는 글이 흐르는 동안에만 보인다(site-fit.css).
     * 전시는 「처음부터 다시」 뒤에 그 단추로 초점을 보내는데, 그때는 이 막대의 단추가 받는다 */
    if (root.classList && typeof root.classList.add === 'function') root.classList.add('fit-steps');
    const again = document.getElementById('replay');
    if (again && typeof again.addEventListener === 'function') again.addEventListener('click', () => requestAnimationFrame(() => {
      try { paint(); if (!bar.hidden && typeof toggle.focus === 'function') toggle.focus({preventScroll: true}); } catch (e) { /* 전시는 그대로 */ }
    }));

    let queued = false, wasOn = null, lang = '';
    const fitAbove = () => {            /* 자막이 막대에 닿지 않게 — 전시가 장면 메뉴 위로 맞춘 뒤에 한 번 더 본다 */
      try {
        if (bar.hidden || typeof cap.getBoundingClientRect !== 'function' || typeof bar.getBoundingClientRect !== 'function') return;
        const over = cap.getBoundingClientRect().bottom - (bar.getBoundingClientRect().top - 8);
        if (over > 0) cap.style.top = Math.max(0, cap.getBoundingClientRect().top - over) + 'px';
      } catch (e) { /* 전시는 그대로 */ }
    };
    const update = () => {
      queued = false;
      try { paint(); } catch (e) { /* 전시는 그대로 */ }
    };
    const paint = () => {
      const on = shown();
      if (bar.hidden === on) { bar.hidden = !on; if (on) requestAnimationFrame(fitAbove); }
      if (!on) return;
      const p = progress(), i = cutAt(p), rel = Math.min(1, Math.max(0, (p - STOPS[i]) / (STOPS[i + 1] - STOPS[i])));
      const now = (root.dataset.lang || root.lang || 'ko').slice(0, 2), w = WORDS[now] || WORDS.ko;
      if (now !== lang) {
        lang = now; strip.setAttribute('aria-label', w[0]);
        beats.forEach((b, k) => { b.title = w[0] + ' ' + (k + 1); b.setAttribute('aria-label', b.title); });
        back.title = w[1]; back.setAttribute('aria-label', w[1]); forward.title = w[2]; forward.setAttribute('aria-label', w[2]);
      }
      beats.forEach((b, k) => {
        b.classList.toggle('et-past', k < i); b.classList.toggle('et-current', k === i);
        if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        b.style.setProperty('--portion', k < i ? '100%' : k === i ? Math.round(rel * 100) + '%' : '0%');
      });
      back.disabled = i === 0; forward.disabled = i === STOPS.length - 2;
      const playingNow = playing();
      if (playingNow !== wasOn) { wasOn = playingNow; toggle.firstChild.firstChild.setAttribute('d', playingNow ? 'M9 6v12m6-12v12' : 'M8 5l11 7-11 7z'); }
      const label = transport.getAttribute('aria-label') || '';
      if (toggle.getAttribute('aria-label') !== label) { toggle.setAttribute('aria-label', label); toggle.title = label; }
    };
    const ask = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', ask, {passive: true});
    window.addEventListener('resize', () => { ask(); requestAnimationFrame(() => requestAnimationFrame(fitAbove)); });
    new MutationObserver(ask).observe(root, {attributes: true, attributeFilter: ['data-mode', 'data-entering', 'data-lang', 'lang', 'class']});
    new MutationObserver(ask).observe(transport, {attributes: true, attributeFilter: ['aria-pressed', 'aria-label', 'hidden']});
    new MutationObserver(() => requestAnimationFrame(fitAbove)).observe(cap, {attributes: true, attributeFilter: ['data-scene']});
    ask();
  } catch (e) { /* 전시는 그대로 */ }
})();

