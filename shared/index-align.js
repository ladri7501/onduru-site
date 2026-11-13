/* ONDURU — 목록의 줄 맞춤(index-align.js) · 2026-11-13
   data-tabs 가 달린 목록(발자취)은 누른 칸 하나만 보인다 — 다른 칸은 hidden(On 2026-11-13 20:15 「각 영역만 보여줘」).
   스크립트가 꺼지면 모든 칸이 그대로 보인다 */
(function () {
  var nav = document.querySelector('nav.index'); if (!nav || !window.getComputedStyle) return;
  var root = document.documentElement, tail = null, t = 0, tabs = nav.hasAttribute('data-tabs'), on = null;
  function targets() {
    var out = [];
    [].forEach.call(nav.querySelectorAll('a[href^="#"]'), function (a) { var el = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); if (el) out.push(el); });
    return out;
  }
  function head(el) { return el.querySelector('.sec-label, h2, h3') || el; }
  function lineY() {                       /* 제목이 설 높이 */
    var cs = getComputedStyle(nav), lab = nav.querySelector('.index-h');
    if (lab && getComputedStyle(lab).position !== 'absolute') return (parseFloat(cs.top) || 0) + lab.offsetTop;      /* 넓은 화면: 왼쪽에 붙은 목록의 「Contents」 줄 */
    return (parseFloat(cs.top) || 0) + nav.offsetHeight + 16;                                                    /* 휴대폰: 위에 붙은 띠(고정된 머리 아래) 바로 아래 */
  }
  function place() {
    var y = lineY(), ts = targets(); if (!ts.length) return;
    root.style.scrollPaddingTop = '0px';
    ts.forEach(function (el) { if (el.hidden) return; var off = head(el).getBoundingClientRect().top - el.getBoundingClientRect().top; el.style.scrollMarginTop = Math.round(y - off) + 'px'; });
    var end = ts[ts.length - 1], last = (tabs && on) ? on : end;      /* 칸 하나씩이면 열린 칸이 줄에 설 만큼만 */
    if (!tail) { tail = document.createElement('div'); tail.className = 'index-tail'; tail.setAttribute('aria-hidden', 'true'); end.parentNode.insertBefore(tail, end.nextSibling); }
    var sy0 = window.pageYOffset || 0;      /* 다시 재는 동안 읽던 자리가 맨 위로 튀지 않게 */
    tail.style.height = '0px';
    var sy = window.pageYOffset || 0, S = last.getBoundingClientRect().top + sy - (parseFloat(last.style.scrollMarginTop) || 0), want = S + window.innerHeight, have = root.scrollHeight;
    /* 목록이 긴 페이지(시뮬레이션 열둘)는 끝에서 목록이 밀려 올라가지 않을 만큼도 — 목록을 품은 칸의 바닥이 목록 아래에 있게(고정된 머리 아래로 목록이 내려온 뒤 2026-11-13) */
    var box = nav.parentNode, keep = (parseFloat(getComputedStyle(nav).top) || 0) + nav.offsetHeight - (box.getBoundingClientRect().bottom + sy - S);
    var th = Math.max(0, Math.ceil(want - have), Math.ceil(keep)); tail.style.height = th + 'px';
    var lack = Math.ceil(want - root.scrollHeight); if (lack > 0) tail.style.height = (th + lack) + 'px';      /* 페이지의 최소 높이가 모자람을 가린 때(짧은 칸) — 한 번 더 채운다 */
    if (Math.abs((window.pageYOffset || 0) - sy0) > 1) window.scrollTo(0, sy0);
  }
  function soon() { clearTimeout(t); t = setTimeout(place, 120); }
  function idOf(h) { h = String(h || ''); var k = h.indexOf('#'); return k < 0 ? '' : decodeURIComponent(h.slice(k + 1)); }
  function secOf(el) { var ts = targets(), i; if (!el) return null; for (i = 0; i < ts.length; i++) if (ts[i] === el || ts[i].contains(el)) return ts[i]; return null; }
  function show(sec, to) {                 /* 칸 하나를 열고 나머지는 닫는다. to: 그 칸(또는 칸 안의 자리)으로 */
    var ts = targets(); if (!ts.length) return; if (!sec) sec = ts[0];
    ts.forEach(function (s) { if (s === sec) s.removeAttribute('hidden'); else s.setAttribute('hidden', ''); });
    on = sec; nav.setAttribute('data-on', sec.id); place();
    if (to && to.scrollIntoView) to.scrollIntoView({ block: 'start' });
    try { window.dispatchEvent(new Event('scroll')); } catch (e) {}
  }
  if (tabs) {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
      var el = document.getElementById(idOf(a.getAttribute('href'))), sec = secOf(el); if (!sec) return;
      e.preventDefault(); show(sec, el);
    }, true);
    window.addEventListener('hashchange', function () { var el = document.getElementById(idOf(location.hash || window.ONDURU_AT)), sec = secOf(el); if (sec) show(sec, el); });
    var h0 = document.getElementById(idOf(location.hash)), s0 = secOf(h0);
    show(s0, null);
    if (s0) setTimeout(function () { place(); h0.scrollIntoView({ block: 'start' }); }, 150);
  }
  place();
  window.addEventListener('load', soon); window.addEventListener('resize', soon); window.addEventListener('onduru:head', soon);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
  if (window.MutationObserver) new MutationObserver(soon).observe(root, { attributes: true, attributeFilter: ['data-type', 'data-theme', 'lang'] });
  if (!tabs && location.hash) { var el = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (el && el.scrollIntoView) setTimeout(function () { place(); el.scrollIntoView({ block: 'start' }); }, 150); }
})();
