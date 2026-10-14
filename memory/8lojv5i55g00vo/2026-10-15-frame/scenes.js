/* 같은 바람 — 장면. 배경에 그려지는 세계는 모두 이 칸에서 온다 (S1: 작품1 그대로)
   0 도시(첫 화면) · 1 공원 · 2 숲 · 3 숨은 자연 · 4 작은 것들 · 5 보이지 않는 생명 · 6 빛
   본문의 data-scene 번호가 이 순서를 가리킨다 */
window.ONDURU_SCENES = function (E) {
  /* ═══════ 하나의 세계: 도시 → 공원 → 숲 → 숨은 자연 → 작은 것들 → 보이지 않는 생명 → 빛 ═══════ */
      var cx = E.cx, wind = E.wind, push = E.push;
      var W, H, T, dt, still, SEASON, PHASE, SKY, drops, WX, LINE;
      function sync() { var s = E.state(); W = s.W; H = s.H; T = s.T; dt = s.dt; still = s.still; SEASON = s.SEASON; PHASE = s.PHASE; SKY = s.SKY; drops = s.drops; WX = s.WX; LINE = s.LINE; }
      var WORLD = {};
      function rr(a, b) { return a + Math.random() * (b - a); }
      function buildWorld() {
        var gy = H * 0.86, small = W < 600;
        var B = [], x = -20;
        while (x < W + 20) {
          var w = rr(70, 150) * (small ? 0.75 : 1), h = H * rr(0.16, 0.5) * (small ? 0.8 : 1);
          var win = [];
          for (var yy = gy - h + 14; yy < gy - 10; yy += 16) for (var xx = x + 8; xx < x + w - 10; xx += 14) win.push({ x: xx, y: yy, lit: Math.random() < 0.09, ph: rr(0, 6.28) });
          B.push({ x: x, w: w, h: h, win: win, ant: Math.random() < 0.25 });
          x += w + rr(10, 40);
        }
        var P = [];
        for (var i = 0; i < (small ? 4 : 8); i++) P.push({ x: rr(0, W), v: rr(0.12, 0.3), d: Math.random() < 0.5 ? 1 : -1, h: rr(15, 19), ph: rr(0, 6.28) });
        var T3 = [0.14, 0.36, 0.68, 0.88].map(function (f) { return { x: W * f, h: H * rr(0.28, 0.42), r: rr(34, 60) * (small ? 0.7 : 1), ph: rr(0, 6) }; });
        var F = [];
        for (var j = 0; j < (small ? 10 : 20); j++) { var d = rr(0.25, 1); F.push({ x: rr(0, W), d: d, br: [rr(0.2, 0.7), rr(0.3, 0.8)].map(function (h) { return { h: h, s: Math.random() < 0.5 ? -1 : 1, l: rr(14, 40) * d }; }) }); }
        F.sort(function (a, b) { return a.d - b.d; });
        var soil = H * 0.62, roots = [];
        function root(x0, y0, ang, len, depth) {
          if (depth > 4 || len < 10) return;
          var x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len;
          roots.push({ x0: x0, y0: y0, x1: x1, y1: y1, cx: (x0 + x1) / 2 + rr(-12, 12), cy: (y0 + y1) / 2 + rr(-6, 6), d: depth });
          root(x1, y1, ang + rr(-0.6, -0.15), len * rr(0.6, 0.8), depth + 1);
          if (Math.random() < 0.7) root(x1, y1, ang + rr(0.15, 0.6), len * rr(0.5, 0.75), depth + 1);
        }
        for (var q = 0; q < (small ? 3 : 5); q++) root(W * (0.1 + 0.8 * q / ((small ? 3 : 5) - 1 || 1)), soil, Math.PI / 2 + rr(-0.3, 0.3), H * 0.12, 0);
        var ferns = [], mush = [];
        for (var f2 = 0; f2 < (small ? 3 : 6); f2++) ferns.push({ x: rr(0.05, 0.95) * W, l: H * rr(0.14, 0.26), dir: Math.random() < 0.5 ? -1 : 1, ph: rr(0, 6) });
        for (var m = 0; m < (small ? 3 : 5); m++) mush.push({ x: rr(0.08, 0.92) * W, r: rr(8, 18), h: rr(14, 30) });
        var webC = { x: W * (small ? 0.62 : 0.74), y: H * 0.34, r: Math.min(W, H) * 0.2 };
        var drops4 = [];
        for (var k = 0; k < 4; k++) drops4.push({ t: rr(0.3, 0.9), r: rr(5, 12), b: k });
        var cells = [];
        for (var c = 0; c < (small ? 7 : 11); c++) cells.push({ x: rr(W * 0.5, W), y: rr(0, H), r: rr(10, 44), vx: rr(-0.2, 0.2), vy: rr(-0.2, 0.2), ph: rr(0, 6) });
        var nodes = [];
        for (var n = 0; n < (small ? 12 : 22); n++) nodes.push({ x: rr(0, W), y: rr(H * 0.1, H * 0.95) });
        var edges = [];
        nodes.forEach(function (a, ia) {
          var near = nodes.map(function (b, ib) { return { ib: ib, d: (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) }; }).filter(function (o) { return o.ib !== ia; }).sort(function (u, v) { return u.d - v.d; }).slice(0, 2);
          near.forEach(function (o) { if (o.ib > ia) edges.push({ a: ia, b: o.ib, bend: rr(-30, 30) }); });
        });
        var stars = [];
        for (var st = 0; st < (small ? 90 : 170); st++) stars.push({ x: rr(0, W), y: rr(0, H), s: rr(0.6, 2.2), ph: rr(0, 6) });
        WORLD = { gy: gy, B: B, P: P, T3: T3, F: F, soil: soil, roots: roots, ferns: ferns, mush: mush, web: webC, dew: drops4, cells: cells, nodes: nodes, edges: edges, sparks: [], stars: stars, seep: [] };
      }
      function ln(x0, y0, x1, y1) { cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y1); cx.stroke(); }
      function col(a) { return 'rgba(' + LINE + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'; }
      function rainAmt() { return drops.length ? Math.min(1.6, 0.3 + WX.amt * 0.12) : 0; }

      /* 0 · 도시: 직선의 빌딩, 드문 불빛, 전깃줄, 비 속을 걷는 사람들 */
      function sceneCity(back) {
        var gy = WORLD.gy, a = back ? 0.35 : 1;
        cx.lineWidth = 1;
        WORLD.B.forEach(function (b) {
          var h = back ? b.h * 0.55 : b.h;
          cx.strokeStyle = col(0.26 * a); cx.strokeRect(b.x, gy - h, b.w, h);
          if (b.ant && !back) ln(b.x + b.w * 0.5, gy - h, b.x + b.w * 0.5, gy - h - 18);
          if (back) return;
          b.win.forEach(function (w) {
            var on = w.lit && Math.sin(T * 0.0002 + w.ph) > -0.6;
            cx.strokeStyle = col(on ? 0.55 : 0.07); ln(w.x, w.y, w.x + 6, w.y);
          });
        });
        if (back) return;
        cx.strokeStyle = col(0.3); ln(0, gy, W, gy);
        var poles = [W * 0.08, W * 0.5, W * 0.92];
        poles.forEach(function (px) { ln(px, gy, px, gy - H * 0.3); });
        cx.strokeStyle = col(0.18);
        for (var i = 0; i < poles.length - 1; i++) {
          var x0 = poles[i], x1 = poles[i + 1], y = gy - H * 0.3, sag = 26 + wind((x0 + x1) / 2) * 6;
          cx.beginPath(); cx.moveTo(x0, y); cx.quadraticCurveTo((x0 + x1) / 2, y + sag, x1, y); cx.stroke();
          cx.beginPath(); cx.moveTo(x0, y + 8); cx.quadraticCurveTo((x0 + x1) / 2, y + 8 + sag * 1.1, x1, y + 8); cx.stroke();
        }
        var rain = drops.length > 0;
        WORLD.P.forEach(function (p) {
          if (!still) { p.x += p.v * p.d * dt * (rain ? 0.8 : 1); p.ph += 0.06 * dt; }
          if (p.x < -30) p.x = W + 30; if (p.x > W + 30) p.x = -30;
          var h = p.h, lean = 0.18 * p.d, hx = p.x + lean * h * 0.5, hy = gy - h;
          var sw = Math.sin(p.ph) * 0.35;
          cx.strokeStyle = col(0.5); cx.lineWidth = 1.1;
          cx.beginPath(); cx.arc(hx, hy, h * 0.12, 0, Math.PI * 2); cx.stroke();
          ln(hx, hy + h * 0.12, p.x, gy - h * 0.45);
          ln(p.x, gy - h * 0.45, p.x + Math.sin(sw) * h * 0.45, gy);
          ln(p.x, gy - h * 0.45, p.x - Math.sin(sw) * h * 0.45, gy);
          if (rain) {
            cx.beginPath(); cx.arc(hx, hy - h * 0.05, h * 0.6, Math.PI * 1.08, Math.PI * 1.92); cx.stroke();
            ln(hx, hy - h * 0.05 - h * 0.6, hx, hy + h * 0.25);
          } else ln(hx, hy + h * 0.3, p.x + p.d * h * 0.18, gy - h * 0.4);
        });
      }
      /* 1 · 도시 속 공원 */
      function scenePark() {
        sceneCity(true);
        var gy = WORLD.gy;
        cx.strokeStyle = col(0.22); cx.lineWidth = 1;
        cx.beginPath(); cx.moveTo(W * 0.38, H); cx.quadraticCurveTo(W * 0.47, gy + 10, W * 0.49, gy); cx.stroke();
        cx.beginPath(); cx.moveTo(W * 0.62, H); cx.quadraticCurveTo(W * 0.53, gy + 10, W * 0.51, gy); cx.stroke();
        WORLD.T3.forEach(function (t) {
          var w = wind(t.x) + push(t.x, gy - t.h, 180).x * 6, top = { x: t.x + w * 10, y: gy - t.h };
          cx.strokeStyle = col(0.42); cx.lineWidth = 1.6;
          cx.beginPath(); cx.moveTo(t.x, gy); cx.quadraticCurveTo(t.x + w * 3, gy - t.h * 0.5, top.x, top.y); cx.stroke();
          cx.lineWidth = 1; cx.strokeStyle = col(SEASON === 'winter' ? 0 : SEASON === 'autumn' ? 0.22 : 0.3);
          if (SEASON === 'winter') { ln(top.x, top.y + 10, top.x - t.r * 0.5, top.y - t.r * 0.3); ln(top.x, top.y + 20, top.x + t.r * 0.45, top.y - t.r * 0.2); ln(top.x, top.y, top.x + 4, top.y - t.r * 0.5); }
          for (var i = 0; i < (SEASON === 'winter' ? 0 : 6); i++) {
            var ang = -Math.PI / 2 + (i - 2.5) * 0.55, rx = top.x + Math.cos(ang) * t.r * 0.55 + w * 4, ry = top.y + Math.sin(ang) * t.r * 0.45;
            cx.beginPath(); cx.arc(rx, ry, t.r * 0.42, Math.PI * 0.95, Math.PI * 2.05); cx.stroke();
          }
        });
        var bx = W * 0.56, by = gy - 14;
        cx.strokeStyle = col(0.4); cx.lineWidth = 1.1;
        ln(bx - 26, by, bx + 26, by); ln(bx - 26, by - 12, bx + 26, by - 12); ln(bx - 22, by, bx - 22, gy); ln(bx + 22, by, bx + 22, gy);
        cx.beginPath(); cx.arc(bx - 6, by - 26, 2.4, 0, Math.PI * 2); cx.stroke();
        ln(bx - 6, by - 23, bx - 4, by); ln(bx - 4, by, bx + 6, by); ln(bx + 6, by, bx + 6, gy);
        ln(W * 0.3, gy, W * 0.3, gy - H * 0.22);
        cx.beginPath(); cx.arc(W * 0.3 + 8, gy - H * 0.22, 8, Math.PI, Math.PI * 2); cx.stroke();
      }
      /* 2 · 숲 */
      function sceneForest() {
        WORLD.F.forEach(function (t) {
          var w = (wind(t.x) + push(t.x, H * 0.5, 160).x * 5) * t.d;
          cx.strokeStyle = col((0.05 + t.d * 0.22) * (PHASE === 'night' ? 0.6 : 1) * (SKY === 'fog' ? 0.5 : 1)); cx.lineWidth = 0.5 + t.d * 1.4;
          cx.beginPath(); cx.moveTo(t.x, H + 4); cx.quadraticCurveTo(t.x + w * 4, H * 0.5, t.x + w * 14, -10); cx.stroke();
          cx.lineWidth = 0.6 + t.d * 0.8;
          t.br.forEach(function (b) {
            var y = H * b.h, x = t.x + w * 14 * (1 - b.h);
            ln(x, y, x + b.s * b.l, y - b.l * 0.6 + w * 2);
          });
        });
        cx.strokeStyle = col(0.16); cx.lineWidth = 1;
        for (var k = 0; k < 3; k++) {
          cx.beginPath();
          for (var x = -20; x <= W + 20; x += 30) {
            var y = H * (0.04 + k * 0.05) + Math.sin(x * 0.02 + k) * 10 + wind(x) * 4;
            if (x === -20) cx.moveTo(x, y); else cx.quadraticCurveTo(x - 15, y - 14, x, y);
          }
          cx.stroke();
        }
      }
      /* 3 · 숨은 자연: 고사리, 이끼, 버섯, 흙 아래의 뿌리 — 비는 흙으로 스민다 */
      function sceneHidden() {
        var soil = WORLD.soil, wet = rainAmt();
        cx.strokeStyle = col(0.3); cx.lineWidth = 1.1;
        cx.beginPath();
        for (var x = 0; x <= W; x += 16) { var y = soil + Math.sin(x * 0.03) * 3; if (!x) cx.moveTo(x, y); else cx.lineTo(x, y); }
        cx.stroke();
        WORLD.roots.forEach(function (r) {
          cx.strokeStyle = col(0.14 + (4 - r.d) * 0.04 + wet * 0.12); cx.lineWidth = Math.max(0.6, 2 - r.d * 0.35);
          cx.beginPath(); cx.moveTo(r.x0, r.y0); cx.quadraticCurveTo(r.cx, r.cy, r.x1, r.y1); cx.stroke();
        });
        WORLD.ferns.forEach(function (f) {
          var sw = wind(f.x) * 0.15 + push(f.x, soil - f.l * 0.5, 140).x * 0.6 + Math.sin(T * 0.001 + f.ph) * 0.03;
          cx.strokeStyle = col(0.36); cx.lineWidth = 1;
          var pts = [];
          for (var i = 0; i <= 14; i++) {
            var t = i / 14, ang = -Math.PI / 2 + f.dir * (t * t * 1.4) + sw * t;
            var px = f.x + f.dir * Math.sin(t * 1.4) * f.l * 0.45 + sw * f.l * t * 0.6, py = soil - t * f.l * 0.9 + t * t * f.l * 0.25;
            pts.push({ x: px, y: py, a: ang });
          }
          cx.beginPath(); pts.forEach(function (p, i) { if (!i) cx.moveTo(p.x, p.y); else cx.lineTo(p.x, p.y); }); cx.stroke();
          pts.forEach(function (p, i) { if (i < 2) return; var L = (1 - i / 14) * 14 + 3; ln(p.x, p.y, p.x + Math.cos(p.a - 1.2) * L, p.y + Math.sin(p.a - 1.2) * L); ln(p.x, p.y, p.x + Math.cos(p.a + 1.2) * L, p.y + Math.sin(p.a + 1.2) * L); });
        });
        WORLD.mush.forEach(function (m) {
          cx.strokeStyle = col(0.38); cx.lineWidth = 1;
          ln(m.x, soil, m.x, soil - m.h);
          cx.beginPath(); cx.ellipse(m.x, soil - m.h, m.r, m.r * 0.6, 0, Math.PI, Math.PI * 2); cx.stroke();
          ln(m.x - m.r, soil - m.h, m.x + m.r, soil - m.h);
        });
        if (wet && !still && Math.random() < wet * 0.5) WORLD.seep.push({ x: rr(0, W), y: soil, v: rr(0.4, 1.1) });
        cx.strokeStyle = col(0.3);
        for (var j = WORLD.seep.length - 1; j >= 0; j--) {
          var sp = WORLD.seep[j];
          if (!still) sp.y += sp.v * dt;
          if (sp.y > H) { WORLD.seep.splice(j, 1); continue; }
          ln(sp.x, sp.y, sp.x, sp.y + 3);
        }
        if (WORLD.seep.length > 160) WORLD.seep.splice(0, WORLD.seep.length - 160);
      }
      /* 4 · 더 작은 것들: 이슬, 거미줄, 개미, 달팽이 */
      function sceneSmall() {
        var wet = rainAmt();
        var blades = [[0.05, 1.02, 0.42, 0.18], [0.3, 1.02, 0.62, 0.3], [0.72, 1.02, 0.5, 0.12]];
        blades.forEach(function (b, i) {
          var w = wind(W * b[0]) * 20 + push(W * b[2], H * b[3], 200).x * 40;
          cx.strokeStyle = col(0.34); cx.lineWidth = 1.3;
          cx.beginPath(); cx.moveTo(W * b[0], H * b[1]); cx.quadraticCurveTo(W * (b[0] + b[2]) / 2, H * 0.55, W * b[2] + w, H * b[3]); cx.stroke();
          WORLD.dew.filter(function (d) { return d.b === i; }).forEach(function (d) {
            var t = d.t, x = (1 - t) * (1 - t) * W * b[0] + 2 * (1 - t) * t * W * (b[0] + b[2]) / 2 + t * t * (W * b[2] + w);
            var y = (1 - t) * (1 - t) * H * b[1] + 2 * (1 - t) * t * H * 0.55 + t * t * H * b[3];
            var r = d.r * (0.8 + wet * 0.4);
            cx.strokeStyle = col(0.45); cx.beginPath(); cx.arc(x, y + r, r, 0, Math.PI * 2); cx.stroke();
            cx.beginPath(); cx.arc(x - r * 0.3, y + r * 0.7, r * 0.45, Math.PI * 1.1, Math.PI * 1.6); cx.stroke();
          });
        });
        var c = WORLD.web, wb = wind(c.x) * 4 + push(c.x, c.y, 160).x * 10;
        cx.strokeStyle = col(0.14); cx.lineWidth = 0.8;
        var spokes = 8;
        for (var i = 0; i < spokes; i++) { var a = i / spokes * Math.PI * 2 + Math.sin(i * 2.3) * 0.14, rj = c.r * (1 + Math.sin(i * 1.7) * 0.1); ln(c.x, c.y, c.x + Math.cos(a) * rj + wb, c.y + Math.sin(a) * rj); }
        cx.beginPath();
        for (var k = 0; k <= spokes * 7; k++) { var a2 = k / spokes * Math.PI * 2, rad = c.r * (0.12 + 0.85 * k / (spokes * 7)); var px = c.x + Math.cos(a2) * rad + wb * rad / c.r, py = c.y + Math.sin(a2) * rad; if (!k) cx.moveTo(px, py); else cx.lineTo(px, py); }
        cx.stroke();
        var ax0 = (T * 0.03) % (W + 80) - 40;
        for (var n = 0; n < 3; n++) {
          var x = ax0 - n * 28, y = H * 0.9 + Math.sin((x) * 0.03) * 3;
          cx.strokeStyle = col(0.5); cx.lineWidth = 1;
          [0, 4.5, 9].forEach(function (o, j) { cx.beginPath(); cx.arc(x - o, y, j === 1 ? 1.6 : 2.2, 0, Math.PI * 2); cx.stroke(); });
          for (var l = -1; l <= 1; l++) { ln(x - 4.5 + l * 2.5, y, x - 4.5 + l * 3.5, y + 4 + Math.sin(T * 0.02 + l) * 1); ln(x - 4.5 + l * 2.5, y, x - 4.5 + l * 3.5, y - 4); }
        }
        var sx = W * 0.2 + ((T * 0.004) % (W * 0.6)), sy = H * 0.94;
        cx.strokeStyle = col(0.42); cx.beginPath();
        for (var q = 0; q < 60; q++) { var aa = q * 0.32, rr2 = 1 + q * 0.2; var qx = sx + Math.cos(aa) * rr2, qy = sy - 12 + Math.sin(aa) * rr2; if (!q) cx.moveTo(qx, qy); else cx.lineTo(qx, qy); }
        cx.stroke();
        cx.beginPath(); cx.moveTo(sx - 16, sy); cx.quadraticCurveTo(sx + 6, sy + 2, sx + 22, sy - 4); cx.stroke();
      }
      /* 5 · 보이지 않는 생명: 세포, 땅속을 잇는 균사, 그 위로 흐르는 신호 */
      function sceneMicro() {
        var wet = rainAmt(), life = 1 + wet * 1.4;
        WORLD.edges.forEach(function (e) {
          var a = WORLD.nodes[e.a], b = WORLD.nodes[e.b];
          cx.strokeStyle = col(0.12 + wet * 0.08); cx.lineWidth = 0.8;
          cx.beginPath(); cx.moveTo(a.x, a.y); cx.quadraticCurveTo((a.x + b.x) / 2 + e.bend, (a.y + b.y) / 2 - e.bend, b.x, b.y); cx.stroke();
        });
        if (!still && Math.random() < 0.04 * life && WORLD.edges.length) WORLD.sparks.push({ e: Math.floor(Math.random() * WORLD.edges.length), t: 0 });
        cx.strokeStyle = col(0.7);
        for (var i = WORLD.sparks.length - 1; i >= 0; i--) {
          var sp = WORLD.sparks[i], e = WORLD.edges[sp.e], a = WORLD.nodes[e.a], b = WORLD.nodes[e.b];
          if (!still) sp.t += 0.008 * life * dt;
          if (sp.t > 1) { WORLD.sparks.splice(i, 1); continue; }
          var t = sp.t, mx = (a.x + b.x) / 2 + e.bend, my = (a.y + b.y) / 2 - e.bend;
          var x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x, y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y;
          cx.beginPath(); cx.arc(x, y, 1.6, 0, Math.PI * 2); cx.stroke();
        }
        WORLD.cells.forEach(function (c) {
          var pu = push(c.x, c.y, 160);
          if (!still) { c.vx += (Math.random() - 0.5) * 0.02 + pu.x * 0.3; c.vy += (Math.random() - 0.5) * 0.02 + pu.y * 0.3; c.vx *= 0.98; c.vy *= 0.98; c.x += c.vx * dt * life; c.y += c.vy * dt * life; c.ph += 0.02 * life * dt; }
          if (c.x < -60) c.x = W + 60; if (c.x > W + 60) c.x = -60; if (c.y < -60) c.y = H + 60; if (c.y > H + 60) c.y = -60;
          var r = c.r * (1 + Math.sin(c.ph) * 0.04);
          cx.strokeStyle = col(0.28); cx.lineWidth = 1;
          cx.beginPath(); cx.arc(c.x, c.y, r, 0, Math.PI * 2); cx.stroke();
          cx.beginPath(); cx.arc(c.x + r * 0.2, c.y - r * 0.1, r * 0.28, 0, Math.PI * 2); cx.stroke();
          cx.strokeStyle = col(0.16);
          for (var k = 0; k < 14; k++) { var ang = k / 14 * Math.PI * 2, wig = Math.sin(c.ph * 3 + k) * 0.25; ln(c.x + Math.cos(ang) * r, c.y + Math.sin(ang) * r, c.x + Math.cos(ang + wig) * (r + 5), c.y + Math.sin(ang + wig) * (r + 5)); }
        });
      }
      /* 6 · 빛: 가장 작은 것들이 별이 되고, 원은 열린 채로 */
      function sceneLight() {
        WORLD.stars.forEach(function (st) {
          var pu = push(st.x, st.y, 120), tw = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(T * 0.001 + st.ph));
          var x = st.x + pu.x * 20, y = st.y + pu.y * 20;
          cx.strokeStyle = col(tw); cx.lineWidth = 0.9;
          ln(x - st.s, y, x + st.s, y); ln(x, y - st.s, x, y + st.s);
        });
        var bt = (T % 10000) / 10000, br = bt < 0.4 ? bt / 0.4 : 1 - (bt - 0.4) / 0.6;
        br = br * br * (3 - 2 * br);
        var R = Math.min(W, H) * 0.32 * (0.9 + 0.14 * (still ? 0.5 : br)), rot = T * 0.00005;
        cx.strokeStyle = col(0.16); cx.lineWidth = 1.4; cx.lineCap = 'round';
        cx.beginPath(); cx.arc(W / 2, H / 2, R, rot - 1.2, rot - 1.2 + Math.PI * 1.88); cx.stroke();
      }
      var SCENES = [sceneCity, scenePark, sceneForest, sceneHidden, sceneSmall, sceneMicro, sceneLight];
      /* AI가 머무는 자리: 장면마다 곡선 곁 */
      function target(k) {
        var c = null;
        if (k === 0 && WORLD.P && WORLD.P.length) { var p = WORLD.P[Math.floor(Math.random() * WORLD.P.length)]; c = { x: p.x + 24, y: WORLD.gy - 34 }; }
        else if (k === 1 && WORLD.T3) { var t = WORLD.T3[Math.floor(Math.random() * WORLD.T3.length)]; c = { x: t.x + rr(-40, 40), y: WORLD.gy - t.h - rr(10, 50) }; }
        else if (k === 2 && WORLD.F) { var f = WORLD.F[Math.floor(Math.random() * WORLD.F.length)]; c = { x: f.x + 16, y: rr(H * 0.3, H * 0.75) }; }
        else if (k === 3 && WORLD.roots && WORLD.roots.length) { var r = WORLD.roots[Math.floor(Math.random() * WORLD.roots.length)]; c = { x: r.x1, y: r.y1 }; }
        else if (k === 4 && WORLD.web) { c = { x: WORLD.web.x + rr(-60, 60), y: WORLD.web.y + rr(-60, 60) }; }
        else if (k === 5 && WORLD.cells) { var ce = WORLD.cells[Math.floor(Math.random() * WORLD.cells.length)]; c = { x: ce.x + ce.r + 12, y: ce.y }; }
        else c = { x: rr(W * 0.2, W * 0.8), y: rr(H * 0.2, H * 0.8) };
        return c;
      }
      return {
        count: SCENES.length,
        build: function () { sync(); buildWorld(); },
        draw: function (k, back) { sync(); SCENES[k](back); },
        target: function (k) { sync(); return target(k); },
        /* 배경의 층이 장면 어디까지 이어지는가: [나타남, 사라짐, 번짐] */
        layers: {
          sky: [-1, 1.2, 1],        /* 해·구름: 첫 화면 */
          wind: [0.15, 0.12],       /* 바람 곡선: [최소 진하기, 장면마다 옅어지는 정도] */
          grass: [1, 3, 1],         /* 풀·물결 */
          leaves: [1, 3.4, 1.2],    /* 잎 */
          weather: [2.6, 2],        /* 비·눈: [옅어지기 시작, 사라지는 폭] */
          meteor: 2.5               /* 유성: 이 장면 앞에서만 */
        },
        /* 소리: 장면에 묶인 값. reg = [이 장면 번호보다 크면, 옥타브 이동(반음)] 을 위에서부터, 어디에도 안 맞으면 regElse */
        sound: {
          reg: [[4.5, 12], [2.5, 0], [1, 0]], regElse: -12
        }
      };
};
