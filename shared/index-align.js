/* ONDURU — 목록의 줄 맞춤(index-align.js) · 2026-11-13 */
(function () {
  var nav = document.querySelector('nav.index'); if (!nav || !window.getComputedStyle) return;
  var root = document.documentElement, tail = null, t = 0;
  function targets() {
    var out = [];
    [].forEach.call(nav.querySelectorAll('a[href^="#"]'), function (a) { var el = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); if (el) out.push(el); });
    return out;
  }
  function head(el) { return el.querySelector('.sec-label, h2, h3') || el; }
  function lineY() {                       /* 제목이 설 높이 */
    var cs = getComputedStyle(nav), lab = nav.querySelector('.index-h');
    if (lab && getComputedStyle(lab).position !== 'absolute') return (parseFloat(cs.top) || 0) + lab.offsetTop;      /* 넓은 화면: 왼쪽에 붙은 목록의 「Contents」 줄 */
    return nav.offsetHeight + 16;                                                                                  /* 휴대폰: 위에 붙은 띠 바로 아래 */
  }
  function place() {
    var y = lineY(), ts = targets(); if (!ts.length) return;
    root.style.scrollPaddingTop = '0px';
    ts.forEach(function (el) { var off = head(el).getBoundingClientRect().top - el.getBoundingClientRect().top; el.style.scrollMarginTop = Math.round(y - off) + 'px'; });
    var last = ts[ts.length - 1];
    if (!tail) { tail = document.createElement('div'); tail.className = 'index-tail'; tail.setAttribute('aria-hidden', 'true'); last.parentNode.insertBefore(tail, last.nextSibling); }
    tail.style.height = '0px';
    var sy = window.pageYOffset || 0, want = last.getBoundingClientRect().top + sy - (parseFloat(last.style.scrollMarginTop) || 0) + window.innerHeight, have = root.scrollHeight;
    tail.style.height = Math.max(0, Math.ceil(want - have)) + 'px';
  }
  function soon() { clearTimeout(t); t = setTimeout(place, 120); }
  place();
  window.addEventListener('load', soon); window.addEventListener('resize', soon);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
  if (window.MutationObserver) new MutationObserver(soon).observe(root, { attributes: true, attributeFilter: ['data-type', 'data-theme', 'lang'] });
  if (location.hash) { var el = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (el && el.scrollIntoView) setTimeout(function () { place(); el.scrollIntoView({ block: 'start' }); }, 150); }
})();
