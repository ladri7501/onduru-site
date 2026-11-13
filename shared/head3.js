/* ONDURU — 머리 · 바닥 3안(head3.js): 머리 높이를 재서 목록 띠를 그 아래에 붙이고, ◐ · Aa 를 누를 때마다 다음 바탕 · 글꼴로 */
(function () {
  var d = document, root = d.documentElement, box = d.querySelector('.pick'), last = -1;
  function headNow() { var hs = d.querySelectorAll('.site-head'), i; for (i = 0; i < hs.length; i++) if (hs[i].offsetHeight) return hs[i]; return null; }
  function measure() {
    var h = headNow(), hh = h ? h.offsetHeight : 0, nav = d.querySelector('nav.index');
    root.style.setProperty('--head-h', hh + 'px');
    if (nav) { nav.style.top = ''; var base = parseFloat(getComputedStyle(nav).top) || 0; nav.style.top = (base + hh) + 'px'; }
    if (hh !== last) { last = hh; try { window.dispatchEvent(new Event('onduru:head')); } catch (e) {} }
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
})();
