/* ONDURU — 언어의 기억과 이어짐 (CI 디자인 가이드 G-2 · G-3). 스크립트가 꺼져도 페이지는 그대로 열린다.
 * 페이지의 언어는 주소(폴더)가 정한다. 이 스크립트는 ① 고른 언어를 기억하고 ② 언어를 바꿀 때 읽던 자리(#이름)를 함께 넘긴다. */
(function () {
  var KEY = 'onduru-lang', d = document, root = d.documentElement, cur = root.getAttribute('lang');
  function save(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  var links = d.querySelectorAll('.langs a[hreflang]');
  function sync() {
    /* 실제 사이트는 주소줄을 「/」로 두므로(2026-11-13) 읽던 자리는 window.ONDURU_AT 에서 읽는다 */
    var at = window.ONDURU_AT || '', h = location.hash || (at.indexOf('#') >= 0 ? at.slice(at.indexOf('#')) : '');
    for (var i = 0; i < links.length; i++) { var a = links[i], base = a.getAttribute('data-href') || a.getAttribute('href'); a.setAttribute('data-href', base); a.setAttribute('href', base + h); }
  }
  for (var i = 0; i < links.length; i++) links[i].addEventListener('click', function () { save(this.getAttribute('hreflang')); });
  /* 이 페이지에 머물러 읽기 시작했다면(밀어 올렸다면) 이 언어를 고른 것으로 적는다 */
  var once = false; addEventListener('scroll', function () { if (!once && cur) { once = true; save(cur); } }, { passive: true });
  addEventListener('hashchange', sync); sync();
  window.ONDURU = window.ONDURU || {}; window.ONDURU.syncLangLinks = sync;
})();
