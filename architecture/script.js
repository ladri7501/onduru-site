/* 구성도 — 한 장의 동적 페이지. 마디 · 걸음 · 보는 법을 고르면 그것만 밝아지고 선이 그려지며, 곁에 풀이가 뜬다.
   스크립트가 꺼져 있어도 마디는 아래 「Layers」의 풀이로 가는 이음이고, 글은 모두 읽힌다. */
(function () {
  var root = document.querySelector('main.ax'), dataEl = document.getElementById('ax-data');
  if (!root || !dataEl) return;
  var D = JSON.parse(dataEl.textContent), map = root.querySelector('.ax-mapin'), svg = root.querySelector('.ax-edges'), panel = root.querySelector('.ax-panel');
  var walkBtn = root.querySelector('.ax-walk'), note = root.querySelector('.ax-viewnote');
  var NS = 'http://www.w3.org/2000/svg', chips = {}, S = { view: 'all', node: null, step: null, verb: null }, home = panel.innerHTML, walk = 0, rz = 0;
  function all(sel, el) { return Array.prototype.slice.call((el || root).querySelectorAll(sel)); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  all('.ax-chip').forEach(function (c) { chips[c.getAttribute('data-node')] = c; });

  /* ── 곁의 풀이 ── */
  function goBtn(id) { var b = el('button', null, D.nodes[id].l); b.type = 'button'; b.setAttribute('data-go', id); b.setAttribute('lang', 'en'); return b; }
  function linkList(items) {      /* [[화살표, 마디, 선의 이름]] */
    var ul = el('ul', 'ax-links');
    items.forEach(function (it) {
      var li = el('li'); li.appendChild(el('span', 'arr', it[0])); li.appendChild(goBtn(it[1]));
      if (it[2]) { var k = el('span', 'kind', it[2]); k.setAttribute('lang', 'en'); li.appendChild(k); }
      ul.appendChild(li);
    });
    return ul;
  }
  function head(text) { var h = el('h3', 'ax-h', text); h.setAttribute('lang', 'en'); return h; }
  function kicker(text) { var p = el('p', 'ax-kicker', text); p.setAttribute('lang', 'en'); return p; }
  function showNode(id) {
    var n = D.nodes[id], src = document.getElementById('nd-' + id), out = [], inn = [];
    panel.innerHTML = ''; panel.appendChild(kicker(n.w));
    if (src) { var dl = el('dl', 'nodes'), c = src.cloneNode(true); c.removeAttribute('id'); dl.appendChild(c); panel.appendChild(dl); }
    D.edges.forEach(function (e) { if (e[1] === id) out.push(['→', e[2], D.kinds[e[3]]]); if (e[2] === id) inn.push(['←', e[1], D.kinds[e[3]]]); });
    if (out.length || inn.length) { panel.appendChild(head(D.ui.links)); panel.appendChild(linkList(out.concat(inn))); }
    if (n.h) { panel.appendChild(head(D.ui.runs)); panel.appendChild(linkList([['·', n.h, '']])); }
    if (D.hosts[id] && D.hosts[id].length) { panel.appendChild(head(D.ui.hosts)); panel.appendChild(linkList(D.hosts[id].map(function (m) { return ['·', m, '']; }))); }
    var st = D.steps.filter(function (s) { return s.nodes.indexOf(id) >= 0; });
    if (st.length) {
      panel.appendChild(head(D.ui.round)); var ul = el('ul', 'ax-links');
      st.forEach(function (s) { var li = el('li'), b = el('button', null, s.n + '  ' + s.label); b.type = 'button'; b.setAttribute('data-step', s.n); b.setAttribute('lang', 'en'); li.appendChild(el('span', 'arr', '')); li.appendChild(b); ul.appendChild(li); });
      panel.appendChild(ul);
    }
  }
  function showStep(s) {
    panel.innerHTML = ''; panel.appendChild(kicker(D.ui.round + ' · ' + s.n + ' / ' + D.steps.length));
    var h = el('h2', null, s.label); h.setAttribute('lang', 'en'); panel.appendChild(h); panel.appendChild(el('p', null, s.text));
    panel.appendChild(linkList(s.nodes.map(function (n) { return ['·', n, '']; })));
  }
  function showList(title, text, ids) {
    panel.innerHTML = '';
    var h = el('h2', null, title + ' '); h.setAttribute('lang', 'en'); h.appendChild(el('small', null, String(ids.length))); panel.appendChild(h);
    panel.appendChild(el('p', null, text)); panel.appendChild(linkList(ids.map(function (n) { return ['·', n, '']; })));
  }

  /* ── 선: 상자의 테에서 테로, 조금 굽혀서(겹친 선이 갈리게). 선은 마디의 뒤로 지나간다 ── */
  function rectOf(e) { var a = e.getBoundingClientRect(), b = map.getBoundingClientRect(); return { cx: a.left - b.left + a.width / 2, cy: a.top - b.top + a.height / 2, w: a.width, h: a.height }; }
  function rim(r, tx, ty) {
    var dx = tx - r.cx, dy = ty - r.cy; if (!dx && !dy) return [r.cx, r.cy];
    var s = Math.min(dx ? (r.w / 2 + 3) / Math.abs(dx) : 1e9, dy ? (r.h / 2 + 3) / Math.abs(dy) : 1e9);
    return [r.cx + dx * s, r.cy + dy * s];
  }
  function path(d, cls) { var p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', cls); svg.appendChild(p); }
  function edge(a, b, kind, i) {
    var ra = rectOf(a), rb = rectOf(b), dx = rb.cx - ra.cx, dy = rb.cy - ra.cy, d = Math.sqrt(dx * dx + dy * dy) || 1;
    var bend = Math.min(44, d * 0.16) * (i % 2 ? 1 : -1), mx = (ra.cx + rb.cx) / 2 - dy / d * bend, my = (ra.cy + rb.cy) / 2 + dx / d * bend;
    var p0 = rim(ra, mx, my), p1 = rim(rb, mx, my), an = Math.atan2(p1[1] - my, p1[0] - mx), c = Math.cos(an), s = Math.sin(an), f = function (v) { return v.toFixed(1); };
    path('M' + f(p0[0]) + ' ' + f(p0[1]) + ' Q' + f(mx) + ' ' + f(my) + ' ' + f(p1[0]) + ' ' + f(p1[1]), 'e k-' + kind);
    if (kind === 'host') return;
    function pt(x, y) { return f(p1[0] + x * c - y * s) + ' ' + f(p1[1] + x * s + y * c); }      /* 끝점을 기준으로 선의 방향에 맞춘 자리 */
    if (kind === 'port') path('M' + pt(-8, -4) + ' L' + pt(0, -4) + ' L' + pt(0, 4) + ' L' + pt(-8, 4) + 'Z', 'h k-port');
    else if (kind === 'block') path('M' + pt(1, -6) + ' L' + pt(1, 6), 'h k-block');
    else path('M' + pt(0, 0) + ' L' + pt(-9, -4.2) + ' L' + pt(-9, 4.2) + 'Z', 'h k-' + kind);
  }
  function draw(list, cls) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var w = map.offsetWidth, h = map.offsetHeight;
    svg.setAttribute('class', 'ax-edges' + (cls ? ' ' + cls : '')); svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h); svg.setAttribute('width', w); svg.setAttribute('height', h);
    list.forEach(function (e, i) { if (chips[e[1]] && chips[e[2]]) edge(chips[e[1]], chips[e[2]], e[3], i); });
  }

  /* ── 지금 고른 것에 맞춰 화면을 맞춘다 ── */
  function apply() {
    var on = {}, near = {}, edges = [], focus = true, cls = '', i;
    if (S.node) {
      on[S.node] = 1;
      D.edges.forEach(function (e) { if (e[1] === S.node) { near[e[2]] = 1; edges.push(e); } else if (e[2] === S.node) { near[e[1]] = 1; edges.push(e); } });
      if (D.nodes[S.node].h) { near[D.nodes[S.node].h] = 1; edges.push(['', D.nodes[S.node].h, S.node, 'host']); }
      (D.hosts[S.node] || []).forEach(function (m) { near[m] = 1; edges.push(['', S.node, m, 'host']); });
      showNode(S.node);
    } else if (S.step) {
      var st = D.steps[S.step - 1]; st.nodes.forEach(function (n) { on[n] = 1; });
      edges = D.edges.filter(function (e) { return st.edges.indexOf(e[0]) >= 0; });
      showStep(st);
    } else if (S.verb) {
      for (i in D.nodes) if (D.nodes[i].v === S.verb) on[i] = 1;
      showList(D.verbs[S.verb].l, D.verbs[S.verb].d, Object.keys(on));
    } else if (S.view === 'live') {
      for (i in D.nodes) if (/^(operating|tested|building)$/.test(D.nodes[i].v)) on[i] = 1;
      showList(D.views.live.l, D.views.live.d, Object.keys(on));
    } else if (S.view === 'money') {
      for (i in D.nodes) if (/^(subscription|electricity|prepaid_cap)$/.test(D.nodes[i].c)) on[i] = 1;
      showList(D.views.money.l, D.views.money.d, Object.keys(on));
    } else if (S.view === 'device') {
      for (i in D.nodes) if (D.nodes[i].t === 't_devices') on[i] = 1;
      for (i in D.hosts) D.hosts[i].forEach(function (m) { on[m] = 1; edges.push(['', i, m, 'host']); });
      showList(D.views.device.l, D.views.device.d, Object.keys(D.nodes).filter(function (k) { return D.nodes[k].t === 't_devices'; }));
    } else { focus = false; if (S.view === 'links') { edges = D.edges; cls = 'all'; } panel.innerHTML = home; }
    for (i in chips) { chips[i].classList.toggle('is-on', !!on[i]); chips[i].classList.toggle('is-near', !!near[i]); chips[i].setAttribute('aria-current', S.node === i ? 'true' : 'false'); }
    root.classList.toggle('has-focus', focus); root.classList.toggle('has-sel', !!(S.node || S.step || S.verb));
    all('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', String(!S.node && !S.step && !S.verb && b.getAttribute('data-view') === S.view)); });
    all('[data-verb]').forEach(function (b) { b.setAttribute('aria-pressed', String(!S.node && !S.step && b.getAttribute('data-verb') === S.verb)); });
    all('.ax-step').forEach(function (b) { b.setAttribute('aria-pressed', String(!S.node && +b.getAttribute('data-step') === S.step)); });
    if (note) note.textContent = D.views[S.view].d;
    draw(edges, cls);
  }
  function pick(o) { S.node = o.node || null; S.step = o.step || null; S.verb = o.verb || null; apply(); }
  function stopWalk() { if (walk) { clearTimeout(walk); walk = 0; } if (walkBtn) { walkBtn.setAttribute('aria-pressed', 'false'); walkBtn.textContent = D.ui.walk; } }
  function startWalk() {
    var n = 0; walkBtn.setAttribute('aria-pressed', 'true'); walkBtn.textContent = D.ui.stop;
    (function next() { n++; if (n > D.steps.length) { stopWalk(); return; } pick({ step: n }); walk = setTimeout(next, 3400); })();
  }
  function reveal(id) {      /* 좁은 화면: 고른 마디가 아래 쪽지에 가리지 않게 */
    var c = chips[id]; if (!c || window.innerWidth >= 900) return;
    var r = c.getBoundingClientRect(); if (r.top < 70 || r.bottom > window.innerHeight * 0.34) window.scrollBy(0, r.top - window.innerHeight * 0.16);
  }

  root.addEventListener('click', function (ev) {
    var t = ev.target.closest ? ev.target.closest('.ax-chip, [data-go], [data-step], [data-view], [data-verb], .ax-walk, .ax-close') : null;
    if (!t || !root.contains(t)) return;
    if (t.classList.contains('ax-walk')) { if (walk) stopWalk(); else startWalk(); return; }
    stopWalk();
    if (t.classList.contains('ax-chip')) { ev.preventDefault(); var id = t.getAttribute('data-node'); pick({ node: S.node === id ? null : id }); if (S.node) reveal(id); }
    else if (t.hasAttribute('data-go')) { var g = t.getAttribute('data-go'); pick({ node: g }); reveal(g); }
    else if (t.hasAttribute('data-step')) { var n = +t.getAttribute('data-step'); pick({ step: (S.step === n && !S.node) ? null : n }); }
    else if (t.hasAttribute('data-view')) { S.view = t.getAttribute('data-view'); pick({}); }
    else if (t.hasAttribute('data-verb')) { var v = t.getAttribute('data-verb'); S.view = 'all'; pick({ verb: (S.verb === v && !S.node && !S.step) ? null : v }); }
    else pick({});
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && (S.node || S.step || S.verb)) { stopWalk(); pick({}); } });
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(apply, 140); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(apply);
  var q = /[?&]pick=([^&]+)/.exec(location.search);      /* 시험용: ?pick=node:duru · step:3 · view:money · verb:designed */
  if (q) { var kv = decodeURIComponent(q[1]).split(':'); if (kv[0] === 'view') S.view = kv[1]; else if (kv[0] === 'step') S.step = +kv[1]; else if (kv[0] === 'verb') S.verb = kv[1]; else S.node = kv[1]; }
  apply();
})();
