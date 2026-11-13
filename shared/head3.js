/* ONDURU — 머리 · 바닥 3안(head3.js): 머리 높이를 재서 목록 띠를 그 아래에 붙이고, ◐ · Aa 를 누를 때마다 다음 바탕 · 글꼴로 */
(function () {
  var d = document, root = d.documentElement, box = d.querySelector('.pick'), last = -1;
  function headNow() { var hs = d.querySelectorAll('.site-head'), i; for (i = 0; i < hs.length; i++) if (hs[i].offsetHeight) return hs[i]; return null; }
  root.classList.add('h3-js');
  function lines(el) { var set = {}, n = 0; [].forEach.call(el.children, function (x) { if (!x.offsetHeight || getComputedStyle(x).display === 'none') return; var r = x.getBoundingClientRect(), k = Math.round((r.top + r.bottom) / 2 / 12); if (!set[k]) { set[k] = 1; n++; } }); return n; }
  function fit() {      /* 한 줄에 들어가는지 실제로 재서 정한다 — 화면 너비 · 브라우저 확대 · 언어(메뉴 길이)가 달라도 저절로 */
    var h = headNow(); if (h) {
      root.classList.remove('h3-two');
      var nav = h.querySelector('.site-nav'), c = h.querySelector('.ctl3');
      var ok = h.scrollWidth <= h.clientWidth + 1 && (!nav || nav.offsetHeight <= 56) && (!nav || !c || nav.getBoundingClientRect().right <= c.getBoundingClientRect().left + 1);
      if (!ok) root.classList.add('h3-two');
    }
    var fs = d.querySelectorAll('.site-foot'), f = null, i; for (i = 0; i < fs.length; i++) if (fs[i].offsetHeight) { f = fs[i]; break; }
    if (f) { root.classList.remove('h3-ftwo'); if (lines(f) > 1) root.classList.add('h3-ftwo'); }
  }
  function measure() {
    fit();
    var h = headNow(), hh = h ? h.offsetHeight : 0, nav = d.querySelector('nav.index');
    root.style.setProperty('--head-h', hh + 'px');
    if (nav) { nav.style.top = ''; var base = parseFloat(getComputedStyle(nav).top) || 0; nav.style.top = (base + hh) + 'px'; }
    var key = hh + (root.classList.contains('h3-two') ? 'm' : '') + (root.classList.contains('h3-ftwo') ? 'f' : '');      /* 머리 높이나 바닥 줄 수가 바뀌면 줄 맞춤을 다시 잰다 */
    if (key !== last) { last = key; try { window.dispatchEvent(new Event('onduru:head')); } catch (e) {} }
  }
  var t = 0; function soon() { clearTimeout(t); t = setTimeout(measure, 80); }
  measure(); window.addEventListener('resize', soon); window.addEventListener('load', measure);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(measure);
  function group(k) {
    var g = box && box.querySelector('[data-pick="' + k + '"]'); if (!g) return null;
    var bs = [].slice.call(g.querySelectorAll('button')).filter(function (b) { return !b.hidden; });
    return { bs: bs, i: Math.max(0, bs.indexOf(g.querySelector('button[aria-pressed="true"]'))) };
  }
  function sync() {
    [].forEach.call(d.querySelectorAll('[data-cyc]'), function (b) {
      var g = group(b.getAttribute('data-cyc')); if (!g || !g.bs.length) { b.hidden = true; return; }
      var v = b.getAttribute('data-name') + ': ' + g.bs[g.i].textContent; b.setAttribute('aria-label', v); b.title = v;
    });
  }
  d.addEventListener('click', function (e) {
    var b = e.target && e.target.closest && e.target.closest('[data-cyc]'); if (!b) return;
    var g = group(b.getAttribute('data-cyc')); if (!g || !g.bs.length) return;
    g.bs[(g.i + 1) % g.bs.length].click(); setTimeout(sync, 0);
  });
  d.addEventListener('onduru:sky', sync); sync(); setTimeout(sync, 300);
  /* 화면을 돌리면 확대를 처음 크기로(On 21:29 2안) — 확대된 채일 때만, 잠깐 최대 배율을 1로 묶었다가 푼다 */
  var vp = d.querySelector('meta[name="viewport"]'), base = vp && vp.getAttribute('content');
  function unzoom() { if (!vp || !window.visualViewport || window.visualViewport.scale <= 1.01) return; vp.setAttribute('content', base + ', maximum-scale=1'); setTimeout(function () { vp.setAttribute('content', base); }, 500); }
  window.addEventListener('orientationchange', function () { setTimeout(unzoom, 60); });
  if (screen.orientation && screen.orientation.addEventListener) screen.orientation.addEventListener('change', function () { setTimeout(unzoom, 60); });
})();
