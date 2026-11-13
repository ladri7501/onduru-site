/* ONDURU — 바탕 · 글꼴 고르는 단추(A-8). 고른 것은 이 브라우저에만 남는다(onduru-theme · onduru-type · onduru-sky).
 * 사람이 먼저다 — 바탕을 누르면 하늘을 따르지 않는다(OnduruSky.pick). Auto 는 다시 하늘(때와 날씨)을 따른다(OnduruSky.follow). */
(function () {
  var root = document.documentElement, sky = window.OnduruSky, box = document.querySelector('.pick');
  if (!box) return;
  function get(k, d) { try { return localStorage.getItem('onduru-' + k) || d; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem('onduru-' + k, v); } catch (e) {} }
  function each(k, fn) { var bs = box.querySelectorAll('[data-pick="' + k + '"] button'); for (var i = 0; i < bs.length; i++) fn(bs[i]); }
  function press(k, test) { each(k, function (b) { b.setAttribute('aria-pressed', test(b.getAttribute('data-v')) ? 'true' : 'false'); }); }
  function type(v) { root.setAttribute('data-type', v); press('type', function (x) { return x === v; }); }
  type(get('type', root.getAttribute('data-type')));
  each('type', function (b) { b.addEventListener('click', function () { var v = this.getAttribute('data-v'); set('type', v); type(v); }); });
  function show() {
    var t = root.getAttribute('data-theme'), follows = sky ? sky.state().follows : false;
    press('theme', function (x) { return x === 'auto' ? follows : (!follows && x === t); });
    var m = document.querySelector('meta[name="theme-color"]'), c = getComputedStyle(root).getPropertyValue('--bg').trim();
    if (m && c) m.setAttribute('content', c);
  }
  if (!sky) { root.setAttribute('data-theme', get('theme', root.getAttribute('data-theme'))); each('theme', function (b) { if (b.getAttribute('data-v') === 'auto') b.hidden = true; }); }
  each('theme', function (b) { b.addEventListener('click', function () {
    var v = this.getAttribute('data-v');
    if (v === 'auto') { if (sky) sky.follow('auto', false); }
    else if (sky) sky.pick(v); else { set('theme', v); root.setAttribute('data-theme', v); }
    show();
  }); });
  document.addEventListener('onduru:sky', show);
  box.hidden = false;
  show();
})();
