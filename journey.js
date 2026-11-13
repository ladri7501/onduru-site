/* 당신이 상상할 수 있는 모든 것 — 둘째 판 · 시안 (On 2026-11-12 08:52의 장면 차례)
   0 문이 열린다 · 1 책상의 기기 · 2 큰 화면의 구성도와 신호 · 3 안쪽: 입구 · 출구 · 일을 나누는 Agent · 4 문이 닫히고 도시
   5 하늘에서 본 도시 · 6 지구 · 7 우주 · 8 글자
   그리는 것은 선과 점뿐이다. 스크롤이 장면을 열고, 시간은 장면 안의 숨(깜박임 · 신호 · 걸음)만 움직인다.
   신호색 한 점이 처음부터 끝까지 이어진다: 문고리 → 화면의 신호 → 나가는 Agent → 집의 불빛 → 서울 → 지구 → 마침표.
   시험용 주소 변수: ?p=3.5(장면 값) · ?t=4000(장면의 시계, ms) · ?still=1(움직임 줄이기) · ?lang=en */
(function () {
  'use strict';
  var cv = document.getElementById('stage');
  if (!cv || !cv.getContext) return;
  var cx = cv.getContext('2d'), root = document.documentElement, body = document.body;
  var Q = {}; location.search.replace(/[?&]([^=&]+)=([^&]*)/g, function (_, k, v) { Q[k] = decodeURIComponent(v); return ''; });
  var REDUCE = Q.still === '1' || !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var ARCH = {"n":[[0,0,4],[0,1,3],[0,2,0],[1,0,4],[1,1,0],[1,2,1],[2,0,0],[2,1,0],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[3,0,0],[3,1,0],[4,0,3],[4,1,3],[4,2,0],[5,0,1],[5,1,4],[5,2,2],[5,3,2],[5,4,4],[5,5,0],[6,0,0],[6,1,3],[6,2,3],[6,3,1],[6,4,1],[6,5,1],[7,0,0],[7,1,1],[8,0,3],[8,1,3],[9,0,5],[9,1,5],[9,2,5],[9,3,0],[9,4,0],[9,5,0],[10,0,3],[10,1,4],[10,2,0],[11,0,4],[11,1,4],[11,2,4],[11,3,4],[11,4,0]],"e":[[0,3,0],[3,10,0],[10,9,0],[10,32,0],[10,31,0],[32,31,0],[9,8,0],[8,7,0],[7,8,0],[10,14,0],[14,15,0],[15,0,0],[0,6,0],[0,44,0],[44,45,0],[3,20,0],[20,25,1],[20,27,1],[20,2,0],[2,0,0],[3,39,0],[39,42,0],[43,40,0],[0,41,0],[41,42,0],[1,3,0],[3,10,0],[12,42,3],[13,41,3],[20,36,0],[20,46,1],[31,23,0],[42,23,0],[21,18,0],[17,18,0],[17,19,0],[17,24,1],[17,26,0],[26,27,1],[27,28,2],[27,29,1],[25,29,1],[29,3,0],[30,31,2],[30,42,2],[30,26,2],[30,27,2],[30,23,2],[30,32,2]],"t":[[0],[3,4,21],[32,31,42,30,29],[10,9,11,12,13],[14,15,16],[0,2,1,8,7,6,44,45],[20,18,19,21,23,25,17,24,26,27]],"h":[0,3,10]}, PLACES = [[42.5,1.5],[25.3,55.3],[34.5,69.2],[17.1,-61.8],[18.2,-63.1],[41.3,19.8],[40.2,44.5],[-8.8,13.2],[-77.8,166.6],[-66.3,110.5],[-68.6,78],[-66.7,140],[-67.6,62.9],[-64.8,-64.1],[-67.6,-68.1],[-69,39.6],[-72,2.5],[-78.4,106.9],[-34.6,-58.5],[-31.4,-64.2],[-24.8,-65.4],[-24.2,-65.3],[-26.8,-65.2],[-28.5,-65.8],[-29.4,-66.8],[-31.5,-68.5],[-32.9,-68.8],[-33.3,-66.3],[-51.6,-69.2],[-54.8,-68.3],[-14.3,-170.7],[48.2,16.3],[-31.6,159.1],[-54.5,158.9],[-42.9,147.3],[-37.8,145],[-33.9,151.2],[-31.9,141.4],[-27.5,153],[-20.3,149],[-34.9,138.6],[-12.5,130.8],[-31.9,115.8],[-31.7,128.9],[12.5,-70],[60.1,19.9],[40.4,49.9],[43.9,18.4],[13.1,-59.6],[23.7,90.4],[50.8,4.3],[12.4,-1.5],[42.7,23.3],[26.4,50.6],[-3.4,29.4],[6.5,2.6],[17.9,-62.9],[32.3,-64.8],[4.9,114.9],[-16.5,-68.2],[12.2,-68.3],[-3.9,-32.4],[-1.4,-48.5],[-3.7,-38.5],[-8.1,-34.9],[-7.2,-48.2],[-9.7,-35.7],[-13,-38.5],[-23.5,-46.6],[-20.4,-54.6],[-15.6,-56.1],[-2.4,-54.9],[-8.8,-63.9],[2.8,-60.7],[-3.1,-60],[-6.7,-69.9],[-10,-67.8],[25.1,-77.3],[27.5,89.7],[-24.6,25.9],[53.9,27.6],[17.5,-88.2],[47.6,-52.7],[44.6,-63.6],[46.2,-60],[46.1,-64.8],[53.3,-60.4],[51.4,-57.1],[43.6,-79.4],[63.7,-68.5],[48.8,-91.6],[49.9,-97.2],[74.7,-94.8],[62.8,-92.1],[50.4,-104.7],[50.3,-107.8],[53.5,-113.5],[69.1,-105],[68.3,-133.7],[49.3,-123.1],[49.1,-116.5],[55.8,-120.2],[58.8,-122.7],[60.7,-135.1],[64.1,-139.4],[-12.2,96.9],[-4.3,15.3],[-11.7,27.5],[4.4,18.6],[-4.3,15.3],[47.4,8.5],[5.3,-4],[-21.2,-159.8],[-33.5,-70.7],[-45.6,-72.1],[-53.1,-70.9],[-27.1,-109.4],[4,9.7],[31.2,121.5],[43.8,87.6],[4.6,-74.1],[9.9,-84.1],[23.1,-82.4],[14.9,-23.5],[12.2,-69],[-10.4,105.7],[35.2,33.4],[35.1,34],[50.1,14.4],[52.5,13.4],[47.7,8.7],[11.6,43.1],[55.7,12.6],[15.3,-61.4],[18.5,-69.9],[36.8,3],[-2.2,-79.8],[-0.9,-89.6],[59.4,24.8],[30.1,31.3],[27.1,-13.2],[15.3,38.9],[40.4,-3.7],[35.9,-5.3],[28.1,-15.4],[9,38.7],[60.2,25],[-18.1,178.4],[-51.7,-57.9],[7.4,151.8],[7,158.2],[5.3,163],[62,-6.8],[48.9,2.3],[0.4,9.4],[51.5,-0.1],[12.1,-61.8],[41.7,44.8],[4.9,-52.3],[49.5,-2.5],[5.5,-0.2],[36.1,-5.3],[64.2,-51.7],[76.8,-18.7],[70.5,-22],[76.6,-68.8],[13.5,-16.6],[9.5,-13.7],[16.2,-61.5],[3.8,8.8],[38,23.7],[-54.3,-36.5],[14.6,-90.5],[13.5,144.8],[11.8,-15.6],[6.8,-58.2],[22.3,114.2],[14.1,-87.2],[45.8,16],[18.5,-72.3],[47.5,19.1],[-6.2,106.8],[0,109.3],[-5.1,119.4],[-2.5,140.7],[53.3,-6.3],[31.8,35.2],[54.1,-4.5],[22.5,88.4],[-7.3,72.4],[33.4,44.4],[35.7,51.4],[64.2,-21.9],[41.9,12.5],[49.2,-2.1],[18,-76.8],[31.9,35.9],[35.6,139.7],[-1.3,36.8],[42.9,74.6],[11.6,104.9],[1.4,173],[-2.8,-171.7],[1.9,-157.3],[-11.7,43.3],[17.3,-62.7],[39,125.8],[37.5,127],[29.3,48],[19.3,-81.4],[43.3,77],[44.8,65.5],[53.2,63.6],[50.3,57.2],[44.5,50.3],[47.1,51.9],[51.2,51.4],[18,102.6],[33.9,35.5],[14,-61],[47.1,9.5],[6.9,79.8],[6.3,-10.8],[-29.5,27.5],[54.7,25.3],[49.6,6.2],[57,24.1],[32.9,13.2],[33.6,-7.6],[43.7,7.4],[47,28.8],[42.4,19.3],[18.1,-63.1],[-18.9,47.5],[7.2,171.2],[9.1,167.3],[42,21.4],[12.7,-8],[16.8,96.2],[47.9,106.9],[48,91.7],[22.2,113.5],[15.2,145.8],[14.6,-61.1],[18.1,-15.9],[16.7,-62.2],[35.9,14.5],[-20.2,57.5],[4.2,73.5],[-15.8,35],[19.4,-99.2],[21.1,-86.8],[21,-89.6],[25.7,-100.3],[25.8,-97.5],[28.6,-106.1],[31.7,-106.5],[29.6,-104.4],[23.2,-106.4],[20.8,-105.3],[29.1,-111],[32.5,-117],[3.2,101.7],[1.6,110.3],[-26,32.6],[-22.6,17.1],[-22.3,166.4],[13.5,2.1],[-29.1,168],[6.5,3.4],[12.2,-86.3],[52.4,4.9],[59.9,10.8],[27.7,85.3],[-0.5,166.9],[-19,-169.9],[-36.9,174.8],[-44,-176.6],[23.6,58.6],[9,-79.5],[-12.1,-77],[-17.5,-149.6],[-9,-139.5],[-23.1,-134.9],[-9.5,147.2],[-6.2,155.6],[14.6,121],[24.9,67],[52.3,21],[47,-56.3],[-25.1,-130.1],[18.5,-66.1],[31.5,34.5],[31.5,35.1],[38.7,-9.1],[32.6,-16.9],[37.7,-25.7],[7.3,134.5],[-25.3,-57.7],[25.3,51.5],[-20.9,55.5],[44.4,26.1],[44.8,20.5],[54.7,20.5],[55.8,37.6],[45,34.1],[58.6,49.6],[48.7,44.4],[46.4,48],[51.6,46],[54.3,48.4],[53.2,50.1],[56.9,60.6],[55,73.4],[55,82.9],[53.4,83.8],[56.5,85],[53.8,87.1],[56,92.8],[52.3,104.3],[52,113.5],[62,129.7],[62.7,135.6],[43.2,131.9],[64.6,143.2],[59.6,150.8],[47,142.7],[67.5,153.7],[53,158.7],[64.8,177.5],[-1.9,30.1],[24.6,46.7],[-9.5,160.2],[-4.7,55.5],[15.6,32.5],[59.3,18.1],[1.3,103.8],[-15.9,-5.7],[46,14.5],[78,16],[48.1,17.1],[8.5,-13.3],[43.9,12.5],[14.7,-17.4],[2.1,45.4],[5.8,-55.2],[4.8,31.6],[0.3,6.7],[13.7,-89.2],[18.1,-63],[33.5,36.3],[-26.3,31.1],[21.5,-71.1],[12.1,15.1],[-49.4,70.2],[6.1,1.2],[13.8,100.5],[38.6,68.8],[-9.4,-171.2],[-8.6,125.6],[38,58.4],[36.8,10.2],[-21.1,-175.2],[41,29],[10.7,-61.5],[-8.5,179.2],[25.1,121.5],[-6.8,39.3],[50.4,30.5],[0.3,32.4],[28.2,-177.4],[19.3,166.6],[40.7,-74],[42.3,-83],[38.3,-85.8],[36.8,-84.8],[39.8,-86.2],[38.7,-87.5],[41,-86.6],[38.4,-86.3],[38.5,-87.3],[38.8,-85.1],[41.9,-87.7],[38,-86.8],[41.3,-86.6],[45.1,-87.6],[47.1,-101.3],[46.8,-101.4],[47.3,-101.8],[39.7,-105],[43.6,-116.2],[33.5,-112.1],[34,-118.2],[61.2,-149.9],[58.3,-134.4],[57.2,-135.3],[55.1,-131.6],[59.5,-139.7],[64.5,-165.4],[51.9,-176.7],[21.3,-157.9],[-34.9,-56.2],[39.7,66.8],[41.3,69.3],[41.9,12.4],[13.2,-61.2],[10.5,-66.9],[18.4,-64.6],[18.4,-64.9],[10.8,106.7],[-17.7,168.4],[-13.3,-176.2],[-13.8,-171.7],[12.8,45.2],[-12.8,45.2],[-26.3,28],[-15.4,28.3],[-17.8,31.1]];      /* build.py 가 구성도의 자료와 418곳의 자리를 넣는다 */
  var W = 1, H = 1, DPR = 1, U = 1, T = Q.t ? +Q.t : 0, HOLD = false, P = 0, LANG = 'ko';
  var INK = '207,203,194', STR = '219,215,204', SIG = '143,212,193', BG = '15,19,24';
  var TAU = Math.PI * 2, RAD = Math.PI / 180;
  var FOCUS = [], FOCUS_IN = [], WORLD = {};

  /* 맨 끝의 문장 — 한국어는 On의 말(08:52 · 띄어쓰기만 바로잡음). 영어 · 스페인어는 기본값(On이 고친다) */
  var SENT = {
    ko: { wide: ['상상할 수 있는 그 모든 것은', '현실이 된다.'], tall: ['상상할 수 있는', '그 모든 것은', '현실이 된다.'] },
    en: { wide: ['Everything you can imagine', 'is real.'], tall: ['Everything', 'you can imagine', 'is real.'] },
    es: { wide: ['Todo lo que puedes imaginar', 'es real.'], tall: ['Todo lo que', 'puedes imaginar', 'es real.'] }
  };

  /* ── 작은 연장 ── */
  function clamp(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
  function ease(u) { u = clamp(u); return u * u * (3 - 2 * u); }
  function seg(u, a, b) { return clamp((u - a) / (b - a)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function frac(v) { return v - Math.floor(v); }
  function ink(a) { return 'rgba(' + INK + ',' + clamp(a).toFixed(3) + ')'; }
  function strong(a) { return 'rgba(' + STR + ',' + clamp(a).toFixed(3) + ')'; }
  function sig(a) { return 'rgba(' + SIG + ',' + clamp(a).toFixed(3) + ')'; }
  function line(x0, y0, x1, y1) { cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y1); cx.stroke(); }
  function dot(x, y, r) { cx.beginPath(); cx.arc(x, y, r, 0, TAU); cx.fill(); }
  function ring(x, y, r) { cx.beginPath(); cx.arc(x, y, r, 0, TAU); cx.stroke(); }
  function open(x, y, r, rot) { cx.beginPath(); cx.arc(x, y, r, rot + 0.5, rot + TAU - 0.5); cx.stroke(); }      /* 열린 원 — Agent */
  function poly(p, close) { cx.beginPath(); cx.moveTo(p[0][0], p[0][1]); for (var i = 1; i < p.length; i++) cx.lineTo(p[i][0], p[i][1]); if (close) cx.closePath(); cx.stroke(); }
  function rrect(x, y, w, h, r) {
    cx.beginPath(); cx.moveTo(x + r, y); cx.lineTo(x + w - r, y); cx.quadraticCurveTo(x + w, y, x + w, y + r); cx.lineTo(x + w, y + h - r);
    cx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); cx.lineTo(x + r, y + h); cx.quadraticCurveTo(x, y + h, x, y + h - r); cx.lineTo(x, y + r); cx.quadraticCurveTo(x, y, x + r, y); cx.stroke();
  }
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function frozen() { return REDUCE || HOLD; }
  /* 깜박임 — 1.3초에 한 번(1초에 세 번의 한도 아래). 움직임 줄이기 · 멈춤에서는 켜진 채로 선다 */
  function blink(ph) { if (frozen()) return 1; var u = ((T + (ph || 0)) % 1300) / 1300; return u < 0.5 ? 1 : u < 0.6 ? 1 - (u - 0.5) * 8.5 : u < 0.9 ? 0.15 : 0.15 + (u - 0.9) * 8.5; }
  /* 처음부터 끝까지 이어지는 하나 — 신호색 */
  function hero(x, y, r, a) { cx.lineWidth = 1.4; cx.strokeStyle = sig(0.9 * a); ring(x, y, r); cx.fillStyle = sig((0.45 + 0.55 * blink()) * a); dot(x, y, r * 0.42); cx.lineWidth = 1; }
  function box(aspect, top, bot, side) { var mw = W * (1 - 2 * side), mh = H * (1 - top - bot), w = Math.min(mw, mh * aspect), h = w / aspect; return { x: (W - w) / 2, y: H * top + (mh - h) / 2, w: w, h: h }; }
  function hex(name, fb) { var v = (getComputedStyle(root).getPropertyValue(name) || '').trim(), m = /^#([0-9a-f]{6})$/i.exec(v); if (!m) return fb; var n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(','); }

  /* ── 화면 안에서 살아 있는 줄과 점 ── kind 0: 글이 한 줄씩 쓰이며 밀려 올라간다 · 1: 마디와 이음 위를 점이 오간다 */
  function life(x, y, w, h, seed, kind, a) {
    if (w < 6 || h < 6) return;
    var t = T / 1000, r = rng(seed), i;
    cx.save(); cx.beginPath(); cx.rect(x, y, w, h); cx.clip(); cx.lineWidth = 1;
    if (kind === 1) {
      var n = 9, pts = [];
      for (i = 0; i < n; i++) pts.push([x + w * (0.12 + 0.76 * r()), y + h * (0.16 + 0.68 * r())]);
      for (i = 1; i < n; i++) {
        var j = Math.floor(r() * i), f = frac(t * (0.22 + 0.2 * r()) + r());
        cx.strokeStyle = ink(0.26 * a); line(pts[i][0], pts[i][1], pts[j][0], pts[j][1]);
        cx.fillStyle = sig(0.85 * a); dot(lerp(pts[j][0], pts[i][0], f), lerp(pts[j][1], pts[i][1], f), 1.1);
      }
      cx.fillStyle = ink(0.75 * a); for (i = 0; i < n; i++) dot(pts[i][0], pts[i][1], 1.5);
    } else {
      var rows = Math.max(4, Math.min(16, Math.round(h / 7))), rh = h / (rows + 0.6), head = t * (0.5 + 0.5 * r()) + r() * 40, top = Math.floor(head), fr = head - top;
      for (i = 0; i <= rows; i++) {
        var row = top - (rows - i), q = rng(seed * 131 + row * 7919 + 11), yy = y + (i + 1.05 - fr) * rh, xx = x + w * (0.07 + (q() < 0.22 ? 0.07 : 0));
        var words = 2 + Math.floor(q() * 4), lim = (i < rows ? 1 : fr) * w * 0.86, used = 0, end = 0, k;
        cx.strokeStyle = ink((0.16 + 0.34 * i / rows) * a);
        for (k = 0; k < words; k++) {
          var len = w * (0.06 + 0.2 * q());
          if (used + len > w * 0.84) break;
          var cut = Math.min(len, lim - used); if (cut <= 0) break;
          line(xx + used, yy, xx + used + cut, yy); end = used + cut; used += len + w * 0.035;
          if (cut < len) break;
        }
        if (i === rows) { cx.fillStyle = sig(0.9 * a * blink(seed % 900)); dot(xx + end + 3, yy, 1.4); }
      }
    }
    cx.restore();
  }

  /* ── 구성도: 띠 넷 · 영토의 켜 여섯 · 마디 마흔넷과 기기 셋 · 이음 마흔아홉 (arch/platform.json 그대로) ── */
  var GAP = [0, 0.55, 0.55, 0.55, 0.55, 0.95, 0.95, 0.95, 1.35, 1.35, 1.9, 2.45];      /* 띠와 켜 사이의 틈(줄 단위) */
  function archAt(B, r, c) { return [B.x + (c + 1.15) * (B.w / 6.9), B.y + (r + GAP[r] + 0.95) * (B.h / 15.4)]; }
  function arch(B, a, full, u) {
    if (!ARCH) return;
    var ch = B.h / 15.4, cw = B.w / 6.9, N = ARCH.n, E = ARCH.e, i, t = T / 1000, rr = Math.max(0.8, Math.min(cw * 0.075, ch * 0.3));
    function band(r0, r1, al, fill) {
      var y0 = B.y + (r0 + GAP[r0] + 0.43) * ch, y1 = B.y + (r1 + GAP[r1] + 1.47) * ch, x0 = B.x + cw * 0.1, w = B.w - cw * 0.2;
      if (fill) { cx.fillStyle = ink(0.035 * a); cx.fillRect(x0, y0, w, y1 - y0); }
      cx.strokeStyle = ink(al * a); cx.strokeRect(x0, y0, w, y1 - y0); return y0;
    }
    cx.lineWidth = 1;
    var yb = [band(0, 0, 0.2), band(1, 9, 0.2), band(10, 10, 0.2), band(11, 11, 0.2)];
    band(5, 7, 0.26, true);                                                              /* 지식정보시스템 — 한가운데의 뼈대 */
    if (full && cw > 62) {
      cx.font = '500 11px "IBM Plex Sans", system-ui, sans-serif'; cx.fillStyle = ink(0.42 * a); cx.textBaseline = 'top'; cx.textAlign = 'left';
      var lab = ['People', 'Territory', 'Border', 'Outside']; for (i = 0; i < 4; i++) cx.fillText(lab[i], B.x + cw * 0.1 + 7, yb[i] + 6);
    }
    /* 한 바퀴 — 일곱 걸음이 차례로 켜진다 */
    var step = full ? Math.min(6, Math.floor(seg(u, 0.08, 0.8) * 7)) : -1, lit = {}, now = {}, j;
    if (full) for (i = 0; i <= step; i++) for (j = 0; j < ARCH.t[i].length; j++) { lit[ARCH.t[i][j]] = 1; if (i === step) now[ARCH.t[i][j]] = 1; }
    /* 이음 */
    for (i = 0; i < E.length; i++) {
      var e = E[i], p = archAt(B, N[e[0]][0], N[e[0]][1]), q = archAt(B, N[e[1]][0], N[e[1]][1]), dx = q[0] - p[0], dy = q[1] - p[1], d = Math.sqrt(dx * dx + dy * dy) || 1, k = e[2];
      var cutv = Math.min(d * 0.4, rr * 2.2), x0 = p[0] + dx / d * cutv, y0 = p[1] + dy / d * cutv, x1 = q[0] - dx / d * cutv, y1 = q[1] - dy / d * cutv;
      var al = (full ? [0.26, 0.2, 0.15, 0.2][k] : 0.15) * ((lit[e[0]] && lit[e[1]]) ? 1.9 : 1);
      if (full && k === 1) cx.setLineDash([6, 4]); else if (full && k === 2) cx.setLineDash([1.5, 4]);
      cx.strokeStyle = ink(al * a); line(x0, y0, x1, y1); cx.setLineDash([]);
      if (k === 3) { cx.strokeStyle = ink(0.5 * a); line(x1 - dy / d * rr, y1 + dx / d * rr, x1 + dy / d * rr, y1 - dx / d * rr); }      /* 막힘 — 길 끝의 빗장 */
      if (k === 0 && (full || i % 3 === 0)) { var f = frac(t * 0.17 + i * 0.283); cx.fillStyle = ink((full ? 0.75 : 0.6) * a); dot(lerp(x0, x1, f), lerp(y0, y1, f), full ? 1.5 : 0.9); }
    }
    /* 마디 — 꼴이 곧 상태다: 찬 점(돌고 있다 · 돌려 봤다) · 빈 원(글로만 있다) · 네모(기기) */
    for (i = 0; i < N.length; i++) {
      var n = N[i], c = archAt(B, n[0], n[1]), cls = n[2], up = lit[i] ? 1.25 : 1;
      if (!full) { cx.fillStyle = ink([0.3, 0.4, 0.6, 0.75, 0.95, 0.3][cls] * a); dot(c[0], c[1], rr); continue; }
      if (cls === 4) { cx.fillStyle = strong(0.95 * a); dot(c[0], c[1], rr); cx.strokeStyle = ink(0.45 * a * up); ring(c[0], c[1], rr * 1.9); }
      else if (cls === 3) { cx.fillStyle = ink(0.85 * a * up); dot(c[0], c[1], rr * 0.85); }
      else if (cls === 2) { cx.strokeStyle = ink(0.8 * a * up); ring(c[0], c[1], rr); cx.fillStyle = ink(0.8 * a); dot(c[0], c[1], rr * 0.4); }
      else if (cls === 5) { cx.strokeStyle = ink(0.4 * a); cx.strokeRect(c[0] - rr, c[1] - rr, rr * 2, rr * 2); }
      else { cx.strokeStyle = ink((cls === 1 ? 0.6 : 0.34) * a * up); ring(c[0], c[1], rr * 0.95); }
      if (now[i]) { cx.strokeStyle = sig(0.55 * a * (0.6 + 0.4 * blink(i * 97))); ring(c[0], c[1], rr * 2.7); }
    }
  }

  /* ── 책상 — 눈금 100 × 56. 모니터 넷 · 노트북 셋 · 미니 PC 둘 · 맥 스튜디오 하나(On 08:52) ── */
  var DEV = { mon: [[23, 17.5, 30, 15.5, 2], [56.5, 20.5, 24, 12.5, 0], [4.5, 16, 11.5, 16, 0], [85.5, 24.5, 12.5, 8.5, 1]],
              lap: [[11.5, 37, 15, 9.6, 0], [75.5, 37.6, 14.5, 9.2, 1], [45.8, 41.4, 12, 7.4, 0]],
              mini: [[26.5, 36.3, 3.6, 3.4], [70.6, 36.3, 3.6, 3.4]], studio: [59.5, 36.9, 5.6, 2.8] };
  function desk(B, a) {
    var u = B.w / 100, i, m;
    function X(v) { return B.x + v * u; } function Y(v) { return B.y + v * u; }
    cx.lineWidth = 1;
    cx.strokeStyle = ink(0.42 * a); line(X(2), Y(40), X(98), Y(40));                                            /* 책상의 뒤쪽 모서리 */
    cx.strokeStyle = ink(0.2 * a); poly([[X(2), Y(40)], [X(-4), Y(52.5)], [X(104), Y(52.5)], [X(98), Y(40)]]);    /* 앞쪽 모서리 */
    for (i = 0; i < 4; i++) {                                                                                    /* 모니터 넷 */
      m = DEV.mon[i]; var mx = X(m[0]), my = Y(m[1]), mw = m[2] * u, mh = m[3] * u, mc = mx + mw / 2;
      cx.strokeStyle = ink(0.62 * a); cx.strokeRect(mx, my, mw, mh);
      cx.strokeStyle = ink(0.36 * a); line(mc, my + mh, mc, Y(40)); line(mc - 2.4 * u, Y(40), mc + 2.4 * u, Y(40));
      if (m[4] === 2) arch({ x: mx + mw * 0.2, y: my + mh * 0.03, w: mw * 0.6, h: mh * 0.94 }, a, false, 0); else life(mx + 1, my + 1, mw - 2, mh - 2, 101 + i * 17, m[4], a);
    }
    for (i = 0; i < 2; i++) {                                                                                    /* 미니 PC 둘 */
      m = DEV.mini[i]; cx.strokeStyle = ink(0.55 * a); cx.strokeRect(X(m[0]), Y(m[1]), m[2] * u, m[3] * u);
      cx.fillStyle = sig(0.85 * a * blink(i * 430)); dot(X(m[0] + m[2] - 0.8), Y(m[1] + m[3] - 0.8), Math.max(1, 0.3 * u));
    }
    m = DEV.studio; cx.strokeStyle = ink(0.55 * a); rrect(X(m[0]), Y(m[1]), m[2] * u, m[3] * u, 0.8 * u);          /* 맥 스튜디오 */
    cx.fillStyle = sig(0.85 * a * blink(810)); dot(X(m[0] + 0.9), Y(m[1] + m[3] - 0.8), Math.max(1, 0.3 * u));
    var bus = Y(42.7), stops = [X(28.3), X(62.3), X(72.4), X(19), X(82.75), X(51.8)];                             /* 기기를 잇는 줄과 오가는 점 */
    cx.strokeStyle = ink(0.16 * a); line(stops[3], bus, stops[4], bus);
    for (i = 0; i < 3; i++) line(stops[i], Y(39.7), stops[i], bus);
    for (i = 0; i < 5; i++) { var f = frac(T / (5200 + i * 900) + i * 0.37), x0 = stops[(i * 2) % 6], x1 = stops[(i * 2 + 3) % 6]; cx.fillStyle = sig(0.8 * a); dot(lerp(x0, x1, f), bus, Math.max(1, 0.28 * u)); }
    for (i = 0; i < 3; i++) {                                                                                    /* 노트북 셋 — 앞에 놓여 뒤의 줄을 가린다 */
      m = DEV.lap[i]; var lx = X(m[0]), ly = Y(m[1]), lw = m[2] * u, lh = m[3] * u;
      cx.fillStyle = 'rgba(' + BG + ',' + clamp(a).toFixed(3) + ')'; cx.fillRect(lx, ly, lw, lh + 2.3 * u);
      cx.strokeStyle = ink(0.62 * a); cx.strokeRect(lx, ly, lw, lh);
      cx.strokeStyle = ink(0.45 * a); poly([[lx - 0.5 * u, ly + lh + 0.5 * u], [lx - 1.9 * u, ly + lh + 2.3 * u], [lx + lw + 1.9 * u, ly + lh + 2.3 * u], [lx + lw + 0.5 * u, ly + lh + 0.5 * u]], true);
      life(lx + 1, ly + 1, lw - 2, lh - 2, 301 + i * 29, m[4], a);
    }
    return { x: X(38), y: Y(25.25) };                                                                            /* 큰 화면의 가운데 */
  }

  /* ── 문 ── */
  function doorAt() { var portrait = H > W, dh = Math.min(H * 0.56, W * (portrait ? 1.05 : 0.5)), dw = dh * 0.46; return { dw: dw, dh: dh, x: W * (portrait ? 0.5 : 0.64) - dw / 2, yb: H * 0.8 }; }
  function leaf(x0, yb, dw, dh, o, right, a) {      /* 문짝. o: 열린 정도(0 닫힘 ~ 1) · right: 경첩이 오른쪽. 문고리는 열린 원 */
    var th = o * 80 * RAD, ex = right ? x0 + dw - dw * Math.cos(th) : x0 + dw * Math.cos(th), hx = right ? x0 + dw : x0, dz = Math.sin(th) * dh * 0.07, yt = yb - dh;
    cx.strokeStyle = ink(0.62 * a); cx.lineWidth = 1.2; poly([[hx, yt], [ex, yt + dz], [ex, yb - dz * 0.7], [hx, yb]], true); cx.lineWidth = 1;
    var kx = lerp(hx, ex, 0.84), ky = yb - dh * 0.47;
    cx.strokeStyle = sig(0.9 * a); open(kx, ky, Math.max(2.4, dw * 0.035), -0.6); cx.fillStyle = sig(0.8 * a * blink()); dot(kx, ky, Math.max(1, dw * 0.012));
    return ex;
  }

  /* 0 — 문이 열린다. 첫 화면에서는 시간이 문을 조금 열어 두고, 나머지는 스크롤이 연다 */
  function shotDoor(u) {
    var d = doorAt(), intro = frozen() ? 0.2 : 0.2 * ease(seg(T, 500, 2700)), o = Math.max(intro, ease(seg(u, 0.05, 0.7))), yt = d.yb - d.dh, i;
    cx.lineWidth = 1; cx.strokeStyle = ink(0.16); line(W * 0.03, d.yb, W * 0.97, d.yb);
    var ex = d.x + d.dw * Math.cos(o * 80 * RAD);
    if (o > 0.02) {
      cx.save(); cx.beginPath(); cx.rect(ex, yt, d.x + d.dw - ex, d.dh); cx.clip();                               /* 열린 틈으로 방이 비친다 */
      var bw = d.dw * 3.1; desk({ x: d.x + d.dw * 0.5 - bw * 0.5, y: yt + d.dh * 0.05, w: bw, h: bw * 0.56 }, clamp(o * 1.5) * 0.9);
      cx.restore();
      for (i = 0; i <= 7; i++) { var f = i / 7; cx.strokeStyle = ink(0.09 * o); line(lerp(ex, d.x + d.dw, f), d.yb, lerp(ex - d.dh * 0.34, d.x + d.dw + d.dh * 0.16, f), d.yb + d.dh * 0.26); }      /* 바닥에 떨어지는 빛 */
    }
    cx.strokeStyle = sig(0.5 * (1 - o)); line(d.x + 2, d.yb - 1, d.x + d.dw - 2, d.yb - 1);                       /* 문틈의 빛 */
    cx.strokeStyle = ink(0.5); cx.lineWidth = 1.2; poly([[d.x, d.yb], [d.x, yt], [d.x + d.dw, yt], [d.x + d.dw, d.yb]]); cx.lineWidth = 1;
    leaf(d.x, d.yb, d.dw, d.dh, o, false, 1);
    FOCUS[0] = { x: (ex + d.x + d.dw) / 2, y: d.yb - d.dh * 0.5 };
  }

  /* 1 — 책상. 화면마다 줄과 점이 산다 */
  function shotDesk(u) {
    var B;
    if (H > W * 1.05) { var bw = W * 1.95; B = { x: W / 2 - bw * 0.46, y: H * 0.15, w: bw, h: bw * 0.56 }; } else B = box(100 / 56, 0.07, 0.3, 0.04);
    var z = 1 + 0.2 * ease(u), fx = B.x + B.w * 0.38, fy = B.y + B.w * 0.2525;
    cx.save(); cx.translate(fx, fy); cx.scale(z, z); cx.translate(-fx, -fy);
    FOCUS[1] = desk(B, 1);
    cx.restore();
  }

  /* 2 — 큰 화면의 구성도. 한 바퀴가 켜지고, 신호 하나가 On → 자리 → 샌드박스의 Agent 로 간다 */
  function shotScreen(u) {
    if (!ARCH) return;
    var portrait = H > W * 1.05, B = box(portrait ? 0.7 : 1.4, 0.08, portrait ? 0.3 : 0.19, 0.05), hp = ARCH.h, N = ARCH.n;
    if (!portrait) B.x += W * 0.07;
    var a0 = archAt(B, N[hp[0]][0], N[hp[0]][1]), a1 = archAt(B, N[hp[1]][0], N[hp[1]][1]), a2 = archAt(B, N[hp[2]][0], N[hp[2]][1]), z = 1 + 0.6 * ease(seg(u, 0.66, 1));
    cx.save(); cx.translate(a2[0], a2[1]); cx.scale(z, z); cx.translate(-a2[0], -a2[1]);
    cx.strokeStyle = ink(0.5); cx.lineWidth = 1.2; rrect(B.x - 9, B.y - 9, B.w + 18, B.h + 18, 6); cx.lineWidth = 1;      /* 화면의 테 */
    arch(B, 1, true, u);
    var h = seg(u, 0.22, 0.8), hx, hy, f;
    if (h < 0.4) { f = ease(h / 0.4); hx = lerp(a0[0], a1[0], f); hy = lerp(a0[1], a1[1], f); } else { f = ease((h - 0.4) / 0.6); hx = lerp(a1[0], a2[0], f); hy = lerp(a1[1], a2[1], f); }
    hero(hx, hy, Math.max(4, U * 0.008), seg(u, 0.08, 0.22));
    cx.restore();
    FOCUS[2] = { x: a2[0], y: a2[1] };
  }

  /* 3 — 안쪽. 입구(ONDURU의 PC)와 출구 사이에서 Agent들이 일을 나눠 맡고, 건네고, 적는다 */
  var ST = [[0.27, 0.25], [0.27, 0.73], [0.47, 0.49], [0.66, 0.25], [0.66, 0.73], [0.83, 0.49]], GIN = [0.07, 0.49], GOUT = [0.95, 0.49];
  var ROUTE = [[GIN, ST[0], ST[2], ST[3], ST[5], GOUT], [GIN, ST[1], ST[2], ST[4], ST[5], GOUT]];
  function along(route, s) {      /* 길 위의 자리. 자리마다 잠깐 머문다 */
    var m = route.length - 1, v = clamp(s) * m, i = Math.min(m - 1, Math.floor(v)), q = v - i, a = route[i], b = route[i + 1], mv = (i === m - 1) ? 1 : 0.6;
    var f = ease(Math.min(1, q / mv));
    return { x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f), dwell: q > mv ? (q - mv) / (1 - mv) : 0, at: b, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  }
  function shotInside(u) {
    var portrait = H > W * 1.05, B = box(portrait ? 0.78 : 1.62, 0.09, 0.27, 0.05), r = Math.max(4.4, U * 0.0115), t = T / 1000, i, j, k;
    function X(v) { return B.x + v * B.w; } function Y(v) { return B.y + v * B.h; }
    var hp = along(ROUTE[0], seg(u, 0.12, 0.94)), hx = X(hp.x), hy = Y(hp.y), zf = ease(seg(u, 0.72, 1)), z = 1 + 0.35 * zf, tx = (W / 2 - hx) * 0.6 * zf, ty = (H * 0.45 - hy) * 0.4 * zf;
    cx.save(); cx.translate(tx + hx, ty + hy); cx.scale(z, z); cx.translate(-hx, -hy); cx.lineWidth = 1;
    cx.strokeStyle = ink(0.14); rrect(X(0.07), Y(0.01), B.w * 0.88, B.h * 0.98, 10);                             /* 방 — 영토 */
    cx.strokeStyle = ink(0.2); line(X(0.15), Y(0.925), X(0.87), Y(0.925));                                          /* 장부 — 넘길 때마다 한 눈금 */
    for (i = 0, k = Math.floor(t * 0.9) % 46; i < k; i++) { cx.strokeStyle = ink(0.45); line(X(0.15 + i * 0.0155), Y(0.925), X(0.15 + i * 0.0155), Y(0.925) - r * 0.9); }
    /* 바닥의 길 */
    cx.strokeStyle = ink(0.13);
    for (i = 0; i < 2; i++) { var pts = []; for (j = 0; j < ROUTE[i].length; j++) pts.push([X(ROUTE[i][j][0]), Y(ROUTE[i][j][1])]); poly(pts); }
    cx.setLineDash([3, 5]); cx.beginPath(); cx.moveTo(X(ST[3][0]), Y(ST[3][1]) - r * 5); cx.quadraticCurveTo(X(0.465), Y(-0.06), X(ST[0][0]), Y(ST[0][1]) - r * 6); cx.stroke(); cx.setLineDash([]);      /* 되돌려 보내는 길 */
    /* 입구 — ONDURU의 PC 에서 들어온다 · 출구 — 빛이 있는 쪽 */
    var gh = B.h * 0.2, gw = gh * 0.5, gx = X(GIN[0]), gy = Y(GIN[1]), ox = X(GOUT[0]), oy = Y(GOUT[1]);
    cx.strokeStyle = ink(0.6); poly([[gx - gw / 2, gy + gh / 2], [gx - gw / 2, gy - gh / 2], [gx + gw / 2, gy - gh / 2], [gx + gw / 2, gy + gh / 2]]);
    var mw = gw * 1.7, mh = mw * 0.6, mx = gx - mw / 2, my = gy - gh / 2 - mh * 1.75;
    cx.strokeStyle = ink(0.62); cx.strokeRect(mx, my, mw, mh); cx.strokeStyle = ink(0.36); line(gx, my + mh, gx, gy - gh / 2); line(gx - mw * 0.2, my + mh + mh * 0.32, gx + mw * 0.2, my + mh + mh * 0.32);
    life(mx + 1, my + 1, mw - 2, mh - 2, 777, 0, 1);
    cx.strokeStyle = ink(0.6); poly([[ox - gw / 2, oy + gh / 2], [ox - gw / 2, oy - gh / 2], [ox + gw / 2, oy - gh / 2], [ox + gw / 2, oy + gh / 2]]);
    for (i = -1; i <= 1; i++) { cx.strokeStyle = ink(0.22); line(ox + gw * 0.8, oy + i * gh * 0.24, ox + gw * 2.1, oy + i * gh * 0.4); }
    /* 걷는 Agent 들 — 자리에 닿으면 하던 일을 건네고, 받아서 다시 간다 */
    var n = W < 600 ? 8 : 13, act = [0, 0, 0, 0, 0, 0], who = [];
    for (i = 0; i < n; i++) { var s = frac(t / 30 + i / n + (i % 2) * 0.04), p = along(ROUTE[i % 2], s); p.a = Math.min(seg(s, 0, 0.04), 1 - seg(s, 0.96, 1)); who.push(p); }
    hp.a = seg(u, 0.1, 0.16); hp.h = 1; who.push(hp);
    for (i = 0; i < who.length; i++) { k = ST.indexOf(who[i].at); if (k >= 0 && who[i].dwell > 0) act[k] = Math.max(act[k], Math.sin(Math.PI * who[i].dwell) * who[i].a); }
    /* 자리 여섯 — 맡은 일이 다르다 */
    for (j = 0; j < 6; j++) {
      var sx = X(ST[j][0]), sy = Y(ST[j][1]), ry = sy - r * 2.7, on = act[j];
      cx.strokeStyle = ink(0.4); line(sx - r * 3.2, sy + r * 2.6, sx + r * 3.2, sy + r * 2.6);
      cx.strokeStyle = ink(0.55 + 0.4 * on); open(sx, ry, r * 1.05, t * 0.4 + j);
      if (j < 2) { cx.fillStyle = ink(0.5 + 0.4 * on); for (k = -1; k <= 1; k++) dot(sx + k * r * 1.3, ry - r * 2.3, r * 0.34); }                      /* 작은 모델들이 먼저 다듬는다 */
      else if (j === 2) { cx.strokeStyle = ink(0.3 + 0.4 * on); ring(sx, ry, r * 2.4); }                                                              /* 큰 모델은 판단을 한 번만 */
      else if (j === 3) { cx.strokeStyle = ink(0.34 + 0.4 * on); poly([[sx - r * 2.3, ry + r * 1.9], [sx - r * 2.3, ry - r * 2.1], [sx + r * 2.3, ry - r * 2.1], [sx + r * 2.3, ry + r * 1.9]]); }      /* 규칙 검사 — 문을 지난다 */
      else if (j === 4) { cx.strokeStyle = ink(0.4 + 0.4 * on); cx.beginPath(); cx.arc(sx, ry + r * 0.9, r * 2.6, 205 * RAD, 335 * RAD); cx.stroke(); }                                               /* 다른 눈 */
      else { cx.strokeStyle = ink(0.55 + 0.4 * on); open(sx + r * 2.7, ry, r * 1.05, -t * 0.4); line(sx + r * 1.2, ry, sx + r * 1.5, ry); }                                              /* 넘김과 받음 — 둘이 마주 선다 */
    }
    for (i = 0; i < who.length; i++) {
      var w = who[i], wx = X(w.x), wy = Y(w.y), paint = w.h ? sig : ink, rad = w.h ? r * 1.25 : r, bx, by;
      if (w.a <= 0) continue;
      cx.lineWidth = w.h ? 1.5 : 1; cx.strokeStyle = paint(0.9 * w.a); open(wx, wy, rad, w.ang + Math.PI); cx.lineWidth = 1;
      if (w.dwell > 0 && ST.indexOf(w.at) >= 0) { var g = 0.5 - 0.5 * Math.cos(w.dwell * TAU); bx = lerp(wx, X(w.at[0]), g); by = lerp(wy, Y(w.at[1]) - r * 2.7, g); }
      else { bx = wx - Math.cos(w.ang) * rad * 1.9; by = wy - Math.sin(w.ang) * rad * 1.9; }
      cx.fillStyle = paint(0.9 * w.a); dot(bx, by, r * 0.42);
    }
    cx.restore();
    FOCUS[3] = { x: (ox - hx) * z + hx + tx, y: (oy - hy) * z + hy + ty };
  }

  /* 4 — 나가는 Agent 를 따라간다. 문이 닫히고, 물러서면 도시가 보인다 */
  function windows(x, y, w, h, px, seed, a) {
    var g = 0.62 * px, r = rng(seed), i, j;
    if (g < 3.4) { var n = Math.min(12, Math.ceil(w * h / 260)); cx.fillStyle = ink(0.55 * a); for (i = 0; i < n; i++) dot(x + 1.5 + r() * (w - 3), y + 1.5 + r() * (h - 3), 0.8); return; }
    var cols = Math.min(10, Math.floor((w - g * 0.6) / g)), rows = Math.min(22, Math.floor((h - g * 0.6) / g)), ox = x + (w - (cols - 1) * g) / 2, rad = Math.max(0.8, px * 0.07);
    for (j = 0; j < rows; j++) for (i = 0; i < cols; i++) { var k = r(), ph = r(); if (k > 0.4) continue; cx.fillStyle = ink(a * (0.45 + 0.4 * Math.sin(T / 1400 + ph * 40))); dot(ox + i * g, y + g * 0.7 + j * g, rad); }
  }
  function shotCity(u) {
    var d = doorAt(), o = 1 - ease(seg(u, 0.05, 0.34)), zf = ease(seg(u, 0.26, 1)), portrait = H > W, t = T / 1000, i, b;
    var px = d.dw * Math.exp(lerp(0, Math.log(portrait ? 0.1 : 0.14), zf)), cm = lerp(d.x + d.dw / 2, W / 2, zf), gy = lerp(d.yb, H * 0.7, zf), kd = d.dh / d.dw, aB = seg(zf, 0.04, 0.42);
    function X(v) { return cm + v * px; } function Y(v) { return gy - v * px; }
    cx.lineWidth = 1;
    if (aB > 0) {                                                                                               /* 먼 건물들 · 언덕과 탑 */
      cx.strokeStyle = ink(0.13 * aB);
      for (i = 0; i < WORLD.far.length; i++) { b = WORLD.far[i]; var fx = X(b[0] * 0.8), fw = b[1] * 0.8 * px, fh = b[2] * 0.75 * px; if (fx > W || fx + fw < 0) continue; poly([[fx, gy], [fx, gy - fh], [fx + fw, gy - fh], [fx + fw, gy]]); }
      cx.beginPath(); cx.moveTo(X(20), gy); cx.quadraticCurveTo(X(31), Y(13), X(43), gy); cx.stroke(); line(X(31.3), Y(6.4), X(31.3), Y(10.6)); cx.fillStyle = ink(0.45 * aB); dot(X(31.3), Y(10.6), 1.2);
    }
    cx.strokeStyle = ink(0.3); line(0, gy, W, gy);                                                              /* 땅 */
    if (aB > 0) {
      for (i = 0; i < WORLD.city.length; i++) {                                                                 /* 이웃 건물들 */
        b = WORLD.city[i]; var bx = X(b[0]), bw = b[1] * px, bh = b[2] * px; if (bx > W + 4 || bx + bw < -4) continue;
        cx.strokeStyle = ink(0.4 * aB); poly([[bx, gy], [bx, gy - bh], [bx + bw, gy - bh], [bx + bw, gy]]); windows(bx, gy - bh, bw, bh, px, b[3], 0.6 * aB);
      }
      cx.strokeStyle = ink(0.5 * aB); poly([[X(-2.7), gy], [X(-2.7), Y(9.6)], [X(2.7), Y(9.6)], [X(2.7), gy]]);  /* 우리 건물 */
      windows(X(-2.7), Y(9.6), 5.4 * px, 6.6 * px, px, 4242, 0.6 * aB);
      for (i = -45; i <= 45; i += 3) { if (Math.abs(i) < 2) continue; cx.strokeStyle = ink(0.22 * aB); line(X(i + 0.5), gy, X(i + 0.5), Y(1.5)); cx.fillStyle = ink(0.6 * aB); dot(X(i + 0.5), Y(1.5), Math.max(1, px * 0.08)); }      /* 가로등 */
      for (i = 0; i < 16; i++) { var v = frac((i * 5.37 + t * (0.6 + (i % 5) * 0.22) * (i % 2 ? 1 : -1)) / 90) * 90 - 45; cx.fillStyle = ink(0.7 * aB); dot(X(v), Y(-0.2 - (i % 3) * 0.13), Math.max(1, px * 0.07)); }      /* 길을 오가는 점 */
    }
    if (o > 0.01) for (i = 0; i <= 6; i++) { var f = i / 6, ex0 = X(-0.5), ex1 = X(-0.5) + px * (1 - Math.cos(o * 80 * RAD)); cx.strokeStyle = ink(0.1 * o); line(lerp(ex0, ex1, f), gy, lerp(ex0 - px * 0.6, ex1 + px * 0.9, f), gy + px * 0.55); }      /* 문에서 쏟아지는 빛 */
    cx.strokeStyle = sig(0.4 * (1 - o) * (1 - aB * 0.6)); line(X(-0.5) + 2, gy - 1, X(0.5) - 2, gy - 1);          /* 닫힌 뒤에도 문틈에 남는 빛 */
    cx.strokeStyle = ink(0.5); cx.lineWidth = 1.2; poly([[X(-0.5), gy], [X(-0.5), Y(kd)], [X(0.5), Y(kd)], [X(0.5), gy]]); cx.lineWidth = 1;
    leaf(X(-0.5), gy, px, kd * px, o, true, 1);
    hero(X(-lerp(0.1, 7.5, ease(seg(u, 0.03, 0.9)))), Y(-0.3), Math.max(3, px * 0.1), 1);                         /* 나온 Agent — 길을 따라 간다 */
    FOCUS_IN[4] = { x: d.x + d.dw / 2, y: d.yb - d.dh * 0.5 }; FOCUS[4] = { x: W / 2, y: gy - px * 4 };
  }

  /* 5 — 하늘에서 본 도시. 길과 강, 불빛. 멀어지면 길은 스러지고 불빛만 남는다 */
  function river(x) { return 3.2 + 1.7 * Math.sin(x * 0.3) + 0.5 * Math.sin(x * 0.85 + 1); }
  function shotAerial(u) {
    var unit = U * 0.078 * Math.exp(lerp(Math.log(1.9), Math.log(0.4), ease(u))), th = (-15 + 10 * u) * RAD, cs = Math.cos(th), sn = Math.sin(th), ox = W / 2, oy = H * 0.45;
    var fl = 1 - seg(u, 0.6, 0.96), t = T / 1000, i, s, a, b, k;
    function M(x, y) { return [ox + (x * cs - y * sn) * unit, oy + (x * sn + y * cs) * unit]; }
    cx.lineWidth = 1;
    if (fl > 0) {
      for (i = 0; i < WORLD.streets.length; i++) { s = WORLD.streets[i]; a = M(s[0], s[1]); b = M(s[2], s[3]); cx.strokeStyle = ink((s[4] ? 0.3 : 0.14) * fl); line(a[0], a[1], b[0], b[1]); }
      var up = [], dn = [];
      for (k = -17; k <= 17; k += 0.5) { up.push(M(k, river(k) - 0.5)); dn.push(M(k, river(k) + 0.5)); }
      cx.strokeStyle = ink(0.42 * fl); poly(up); poly(dn);
      for (k = -14; k <= 14; k += 4.1) { a = M(k, river(k) - 0.5); b = M(k, river(k) + 0.5); cx.strokeStyle = ink(0.5 * fl); line(a[0], a[1], b[0], b[1]); }
      for (i = 0; i < WORLD.movers.length; i++) { var m = WORLD.movers[i]; s = WORLD.streets[m[0] % WORLD.streets.length]; var f = frac(m[1] + t * m[2] * m[3]); a = M(lerp(s[0], s[2], f), lerp(s[1], s[3], f)); cx.fillStyle = ink(0.8 * fl); dot(a[0], a[1], 1.2); }
    }
    for (i = 0; i < WORLD.lights.length; i++) {
      var l = WORLD.lights[i]; a = M(l[0], l[1]); if (a[0] < -5 || a[0] > W + 5 || a[1] < -5 || a[1] > H + 5) continue;
      cx.fillStyle = ink((0.3 + 0.35 * l[3]) * (0.7 + 0.3 * Math.sin((T + l[2]) / 800)) * (0.55 + 0.45 * (1 - fl))); dot(a[0], a[1], 0.8 + l[3] * 0.9);
    }
    hero(ox, oy, Math.max(3.4, unit * 0.22), 1);
    FOCUS[5] = FOCUS_IN[5] = { x: ox, y: oy };
  }

  /* 6 — 대기권에서 본 지구. 418곳의 불빛, 서울에서 뻗는 신호 */
  var SEOUL = [37.57, 126.98], FAR = [[35.7, 139.7], [1.35, 103.8], [-33.9, 151.2], [28.6, 77.2], [25.2, 55.3], [-1.3, 36.8], [51.5, -0.1], [40.4, -3.7], [40.7, -74], [37.8, -122.4], [19.4, -99.1], [-23.5, -46.6], [61.2, -149.9]];
  function shotEarth(u) {
    var e = ease(Math.pow(u, 0.85)), R1 = Math.min(W, H * 0.9) * 0.3, R = Math.exp(lerp(Math.log(Math.max(W, H) * 2.4), Math.log(R1), e));
    var gx = W / 2, gy = lerp(H * 0.58, H * 0.43 - R1, e) + R, lon0 = (121 - 12 * e + (frozen() ? 0 : T * 0.0003)) * RAD, lat0 = lerp(SEOUL[0] - 82, 22, e) * RAD, sl = Math.sin(lat0), cl = Math.cos(lat0), t = T / 1000, i, j, p, q;
    function pr(la, lo, m) { var a = la * RAD, b = lo * RAD - lon0, x = Math.cos(a) * Math.sin(b), y = Math.sin(a), z = Math.cos(a) * Math.cos(b), y2 = y * cl - z * sl; return (y * sl + z * cl) > 0 ? [gx + R * x * (m || 1), gy - R * y2 * (m || 1)] : null; }
    function seen(p) { return p && p[0] > -30 && p[0] < W + 30 && p[1] > -30 && p[1] < H + 30; }
    cx.lineWidth = 1;
    cx.strokeStyle = ink(0.22); ring(gx, gy, R + Math.max(2.5, R * 0.012));                                       /* 대기의 얇은 줄 */
    cx.strokeStyle = strong(0.72); ring(gx, gy, R);
    cx.strokeStyle = ink(0.11);                                                                                 /* 위선과 경선 */
    for (i = -60; i <= 60; i += 30) for (j = -180; j < 180; j += 5) { p = pr(i, j); q = pr(i, j + 5); if (p && q && (seen(p) || seen(q))) line(p[0], p[1], q[0], q[1]); }
    for (j = 0; j < 360; j += 30) for (i = -85; i < 85; i += 5) { p = pr(i, j); q = pr(i + 5, j); if (p && q && (seen(p) || seen(q))) line(p[0], p[1], q[0], q[1]); }
    var L = PLACES || FAR, rad = lerp(1.7, 1.05, e);
    for (i = 0; i < L.length; i++) { p = pr(L[i][0], L[i][1]); if (!seen(p)) continue; cx.fillStyle = ink(0.78 * (0.62 + 0.38 * Math.sin(t * 1.3 + i * 2.1))); dot(p[0], p[1], rad); }
    /* 서울에서 뻗는 신호 — 큰 원의 길 */
    var aA = seg(u, 0.36, 0.72), a = SEOUL[0] * RAD, b = SEOUL[1] * RAD, v0 = [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)];
    if (aA > 0) for (i = 0; i < FAR.length; i++) {
      var a2 = FAR[i][0] * RAD, b2 = FAR[i][1] * RAD, v1 = [Math.cos(a2) * Math.sin(b2), Math.sin(a2), Math.cos(a2) * Math.cos(b2)], om = Math.acos(clamp((v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2] + 1) / 2) * 2 - 1), so = Math.sin(om) || 1, prev = null, f = frac(t * 0.11 + i * 0.21);
      for (j = 0; j <= 24; j++) {
        var s = j / 24 * Math.min(1, aA * 1.4), k0 = Math.sin((1 - s) * om) / so, k1 = Math.sin(s * om) / so, x = v0[0] * k0 + v1[0] * k1, y = v0[1] * k0 + v1[1] * k1, z = v0[2] * k0 + v1[2] * k1;
        p = pr(Math.asin(clamp((y + 1) / 2) * 2 - 1) / RAD, Math.atan2(x, z) / RAD, 1 + 0.07 * Math.sin(Math.PI * s));
        if (p && prev && (seen(p) || seen(prev))) { cx.strokeStyle = sig(0.3 * aA); line(prev[0], prev[1], p[0], p[1]); }
        if (p && Math.abs(j / 24 - f) < 0.021 && aA > 0.9) { cx.fillStyle = sig(0.9); dot(p[0], p[1], 1.6); }
        prev = p;
      }
    }
    p = pr(SEOUL[0], SEOUL[1]);
    if (p) hero(p[0], p[1], Math.max(3.4, U * 0.0065), 1);
    FOCUS_IN[6] = seen(p) ? { x: p[0], y: p[1] } : { x: gx, y: H * 0.6 }; FOCUS[6] = { x: gx, y: Math.min(gy, H * 0.5) };
  }

  /* 7 — 지구 너머. 지구는 한 점이 되고 별들이 남는다. 별 하나하나가 Agent 다 */
  function stars(a, n) {
    var st = WORLD.stars, i;
    for (i = 0; i < n; i++) { var s = st[i]; cx.fillStyle = ink(a * (0.25 + 0.55 * s.z) * (0.72 + 0.28 * Math.sin((T + s.ph) / 900))); dot(s.x * W, s.y * H * 0.92, 0.5 + s.z * 0.9); }
  }
  function shotSpace(u) {
    stars(seg(u, 0, 0.3), WORLD.nstar);
    var re = Math.exp(lerp(Math.log(U * 0.1), Math.log(1.7), ease(seg(u, 0, 0.6)))), sc = Math.exp(lerp(Math.log(U * 1.1), Math.log(U * 0.075), ease(seg(u, 0.25, 1))));
    var m = ease(seg(u, 0.5, 0.92)), ex0 = W / 2, ey0 = H * 0.44, sx = lerp(ex0 + sc * 0.94, W / 2, m), sy = lerp(ey0 - sc * 0.1, H * 0.44, m), ex = sx - sc * 0.94, ey = sy + sc * 0.1;
    var ao = seg(u, 0.28, 0.5) * (1 - seg(u, 0.86, 1)), t = T / 1000, i, orb = [0.39, 0.72, 1, 1.52, 2.5, 3.6];
    cx.lineWidth = 1;
    if (ao > 0) {
      for (i = 0; i < orb.length; i++) {
        cx.strokeStyle = ink(0.16 * ao); cx.beginPath(); cx.ellipse(sx, sy, orb[i] * sc, orb[i] * sc * 0.3, -0.105, 0, TAU); cx.stroke();
        if (i === 2) continue;
        var an = i * 2.1 + t * 0.05 / orb[i], px = Math.cos(an) * orb[i] * sc, py = Math.sin(an) * orb[i] * sc * 0.3; cx.fillStyle = ink(0.7 * ao); dot(sx + px * Math.cos(-0.105) - py * Math.sin(-0.105), sy + px * Math.sin(-0.105) + py * Math.cos(-0.105), 1.3);
      }
      cx.strokeStyle = strong(0.8 * ao); ring(sx, sy, Math.max(2, sc * 0.03)); cx.fillStyle = strong(0.8 * ao); dot(sx, sy, 1.2);      /* 해 */
    }
    var ae = 1 - seg(u, 0.9, 1);
    if (re > 3.2) { cx.strokeStyle = strong(0.7 * ae); ring(ex, ey, re); if (re > 6) { cx.fillStyle = ink(0.6 * ae); dot(ex + Math.cos(t * 0.3) * re * 2.6, ey + Math.sin(t * 0.3) * re * 0.9, Math.max(0.8, re * 0.12)); } }
    cx.fillStyle = sig((0.6 + 0.4 * blink()) * ae); dot(ex, ey, Math.max(1.7, Math.min(3, re * 0.3)));
    FOCUS_IN[7] = { x: ex0, y: ey0 }; FOCUS[7] = { x: W / 2, y: H * 0.44 };
  }

  /* 8 — 별들이 모여 글자를 이룬다. 마침표는 신호색 한 점 */
  function shotWords(u) {
    var st = WORLD.stars, tg = WORLD.targets || [], n = WORLD.nstar, form = seg(u, 0.05, 0.62), rd = W < 600 ? 1.15 : 1.5, i;
    for (i = 0; i < n; i++) {
      var s = st[i], sx = s.x * W, sy = s.y * H * 0.92, a0 = (0.25 + 0.55 * s.z) * (0.72 + 0.28 * Math.sin((T + s.ph) / 900)), r0 = 0.5 + s.z * 0.9;
      if (i < tg.length) {
        var f = ease(seg(form, s.d * 2.2, 0.56 + s.d * 2.2)), g = tg[i], sw = Math.sin(Math.PI * f) * (26 + 80 * s.k) * (i % 2 ? 1 : -1), x = lerp(sx, g[0], f) + sw * 0.5, y = lerp(sy, g[1], f) + sw * 0.35;
        cx.fillStyle = strong(lerp(a0, 0.93, f)); dot(x, y, lerp(r0, rd, f));
        if (f > 0.04 && f < 0.92 && i % 11 === 0) { cx.strokeStyle = ink(0.5 * Math.sin(Math.PI * f)); open(x, y, 3.6, T / 700 + i); }
      } else { cx.fillStyle = ink(a0 * (1 - 0.6 * form)); dot(sx, sy, r0); }
    }
    var pd = WORLD.period, fp = ease(seg(form, 0.8, 1));
    if (pd && fp > 0) { cx.fillStyle = sig(fp * (0.55 + 0.45 * blink())); dot(pd.x, pd.y, pd.r); }
    FOCUS_IN[8] = FOCUS[8] = { x: W / 2, y: H * 0.44 };
  }

  /* ── 세계를 짓는다(화면 크기가 바뀔 때마다 · 씨앗이 같아 늘 같은 그림) ── */
  function buildWorld() {
    var r = rng(20261112), i, x, v, w, h;
    if (!WORLD.stars) { WORLD.stars = []; for (i = 0; i < 3400; i++) WORLD.stars.push({ x: r(), y: r(), z: 0.25 + 0.75 * r(), ph: r() * 9000, d: r() * 0.2, k: r() }); }
    WORLD.nstar = W < 600 ? 700 : 1300;
    r = rng(77); WORLD.city = []; x = -48;
    while (x < 48) { w = 1.5 + r() * 4; h = 2.2 + Math.pow(r(), 1.6) * 12; if (x + w > -3.1 && x < 3.1) { x = 3.1 + r(); continue; } WORLD.city.push([x, w, h, Math.floor(r() * 1e6)]); x += w + 0.25 + r() * 0.8; }
    WORLD.far = []; x = -62; while (x < 62) { w = 2 + r() * 5; WORLD.far.push([x, w, 4 + r() * 16]); x += w + r() * 1.2; }
    r = rng(5150); WORLD.streets = [];
    for (v = -16; v <= 16; v++) { if (r() < 0.14) continue; x = v + (r() - 0.5) * 0.3; WORLD.streets.push([x, -16, x, 16, v % 4 === 0 ? 1 : 0]); }
    for (v = -16; v <= 16; v++) { if (r() < 0.14) continue; x = v + (r() - 0.5) * 0.3; WORLD.streets.push([-16, x, 16, x, v % 4 === 0 ? 1 : 0]); }
    WORLD.lights = []; for (i = 0; i < 420; i++) { var lx = (r() - 0.5) * 30, ly = (r() - 0.5) * 30, dd = Math.sqrt(lx * lx + ly * ly), keep = r(), ph = r() * 7000, kk = r(); if (dd > 4 && keep > 1.15 - dd / 22) continue; WORLD.lights.push([lx, ly, ph, kk]); }
    WORLD.movers = []; for (i = 0; i < 40; i++) WORLD.movers.push([Math.floor(r() * 1000), r(), 0.03 + r() * 0.05, r() < 0.5 ? 1 : -1]);
  }
  /* 글자의 자리 — 문장을 보이지 않는 판에 써서 점으로 딴다 */
  function buildText() {
    var set = SENT[LANG] || SENT.ko, lines = (W < H * 0.9) ? set.tall : set.wide, k = Math.min(1, 1500 / W), ow = Math.max(8, Math.round(W * k)), oh = Math.max(8, Math.round(H * k));
    var oc = document.createElement('canvas'); oc.width = ow; oc.height = oh;
    var c = oc.getContext('2d'), fam = '"Noto Serif KR", "Gowun Batang", "AppleMyungjo", "Batang", serif', fs = 100, mw = 1, i, x, y;
    c.font = '600 ' + fs + 'px ' + fam; for (i = 0; i < lines.length; i++) mw = Math.max(mw, c.measureText(lines[i]).width);
    fs = Math.min(oh * (lines.length > 2 ? 0.105 : 0.17), fs * ow * 0.86 / mw);
    c.font = '600 ' + fs + 'px ' + fam; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillStyle = '#fff';
    var lh = fs * 1.45, y0 = oh * 0.43 - (lines.length - 1) * lh / 2 + fs * 0.35, last = lines[lines.length - 1], wl = c.measureText(last).width, wd = c.measureText('.').width;
    for (i = 0; i < lines.length; i++) c.fillText(lines[i], ow / 2, y0 + i * lh);
    var pd = { x: (ow / 2 + wl / 2 - wd / 2) / k, y: (y0 + (lines.length - 1) * lh - fs * 0.055) / k, r: Math.max(2.2, fs * 0.075 / k) };
    var step = Math.max(2, Math.round(fs / (W < 600 ? 13 : 19))), pts, d = c.getImageData(0, 0, ow, oh).data, guard = 0;
    do {
      pts = [];
      for (y = 0; y < oh; y += step) for (x = ((y / step) % 2) ? (step >> 1) : 0; x < ow; x += step) if (d[(y * ow + x) * 4 + 3] > 120) { var px = x / k, py = y / k, ddx = px - pd.x, ddy = py - pd.y; if (ddx * ddx + ddy * ddy > pd.r * pd.r * 5) pts.push([px, py]); }
      step++;
    } while (pts.length > WORLD.stars.length - 200 && ++guard < 8);
    var r = rng(909), j, tmp; for (i = pts.length - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); tmp = pts[i]; pts[i] = pts[j]; pts[j] = tmp; }
    WORLD.targets = pts; WORLD.period = pd; WORLD.nstar = Math.max(WORLD.nstar, pts.length + 160);
  }

  /* ── 장면의 차례와 넘어감 ── in: 한 점으로 들어간다 · out: 물러선다 · same: 그 자리에서 바뀐다 */
  var DRAW = [shotDoor, shotDesk, shotScreen, shotInside, shotCity, shotAerial, shotEarth, shotSpace, shotWords];
  var KIND = ['in', 'in', 'in', 'in', 'out', 'out', 'out', 'same'], XW = 0.1;
  function one(k, u, a, s, f) {
    if (a <= 0.004) return;
    cx.save(); cx.globalAlpha = a;
    if (s !== 1) { var fx = f ? f.x : W / 2, fy = f ? f.y : H * 0.45; cx.translate(fx, fy); cx.scale(s, s); cx.translate(-fx, -fy); }
    DRAW[k](clamp(u));
    cx.restore();
  }
  function cross(k, t, ua, ub) {      /* k 가 나가고 k+1 이 들어온다 — t: 0 → 1 */
    var kind = KIND[k], e = ease(t);
    if (kind === 'in') { var f = FOCUS[k]; one(k, ua, 1 - e, 1 + 2.4 * e * e, f); one(k + 1, ub, e, 0.4 + 0.6 * e, f); }
    else if (kind === 'out') { var g = FOCUS_IN[k + 1]; one(k, ua, 1 - e, 1 - 0.66 * e, g); one(k + 1, ub, e, 2.4 - 1.4 * e, g); }
    else { one(k, ua, 1 - e, 1, null); one(k + 1, ub, e, 1, null); }
  }
  function draw() {
    cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.clearRect(0, 0, W, H);
    var n = DRAW.length, k = Math.max(0, Math.min(n - 1, Math.floor(P))), u = P - k;
    if (k < n - 1 && u > 1 - XW) cross(k, (u - (1 - XW)) / (2 * XW), u, u - 1);
    else if (k > 0 && u < XW) cross(k - 1, (u + XW) / (2 * XW), 1 + u, u);
    else one(k, u, 1, 1, null);
  }

  /* ── 스크롤 → 장면 값 ── */
  var SHOTS = [].slice.call(document.querySelectorAll('.shot')), TOPS = [], HS = [], RANGE = [], titleEl = document.querySelector('.title');
  function measure() {
    TOPS = SHOTS.map(function (s) { return s.offsetTop; }); HS = SHOTS.map(function (s) { return s.offsetHeight; });
    RANGE = SHOTS.map(function (s) { var v = (s.getAttribute('data-on') || '0.2,0.84').split(','); return [+v[0], +v[1]]; });
  }
  function span(k) { return Math.max(1, HS[k] - (k === SHOTS.length - 1 ? window.innerHeight : 0)); }      /* 마지막 장면은 화면 하나만큼 덜 민다 */
  function progress() { var y = window.pageYOffset || root.scrollTop || 0, k = 0, i; for (i = 0; i < SHOTS.length; i++) if (y >= TOPS[i]) k = i; return k + clamp((y - TOPS[k]) / span(k)); }
  function marks() {
    var k = Math.min(SHOTS.length - 1, Math.floor(P)), u = P - k, any = false, i;
    for (i = 0; i < SHOTS.length; i++) { var s = SHOTS[i], on = (i === k && u >= RANGE[i][0] && u <= RANGE[i][1]); if (on !== s._on) { s._on = on; s.classList.toggle('on', on); } if (on && i > 0) any = true; }
    if (any !== body._cap) { body._cap = any; body.classList.toggle('capped', any); }
    if (titleEl) { var op = k === 0 ? 1 - seg(u, 0.1, 0.42) : 0; titleEl.style.opacity = op.toFixed(3); titleEl.style.visibility = op <= 0.01 ? 'hidden' : 'visible'; }
  }

  /* ── 돌리기 ── */
  var raf = 0, last = 0, playing = false, autoY = 0, DUR = 86000, rz = 0;
  var btnPlay = [].slice.call(document.querySelectorAll('[data-act="play"]')), btnHold = document.querySelector('[data-act="hold"]');
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick(now) {
    raf = 0; var dt = last ? Math.min(64, now - last) : 16; last = now;
    if (!frozen()) T += dt;
    if (playing) { var max = root.scrollHeight - window.innerHeight; autoY += max / DUR * dt; if (autoY >= max) { autoY = max; setPlay(false); } window.scrollTo(0, autoY); }
    P = progress(); marks(); draw();
    if (!frozen() || playing) kick(); else last = 0;
  }
  function setPlay(on) {
    playing = !!on && !REDUCE; if (playing) { if (HOLD) setHold(false); autoY = window.pageYOffset || 0; if (autoY >= root.scrollHeight - window.innerHeight - 2) { autoY = 0; window.scrollTo(0, 0); } }
    btnPlay.forEach(function (b) { b.setAttribute('aria-pressed', String(playing)); }); body.classList.toggle('playing', playing); kick();
  }
  function setHold(on) { HOLD = !!on; if (btnHold) btnHold.setAttribute('aria-pressed', String(HOLD)); if (HOLD && playing) setPlay(false); kick(); }
  function setLang(l) {
    if (!SENT[l]) l = 'ko'; LANG = l; root.setAttribute('data-lang', l); root.setAttribute('lang', l);
    try { localStorage.setItem('onduru-lang', l); } catch (e) {}
    [].forEach.call(document.querySelectorAll('[data-set]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === l)); });
    buildText(); kick();
  }
  function size() {
    W = root.clientWidth || window.innerWidth; H = window.innerHeight; DPR = Math.min(window.devicePixelRatio || 1, 2); U = Math.min(W, H);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    INK = hex('--ink', INK); STR = hex('--ink-strong', STR); SIG = hex('--signal', SIG); BG = hex('--bg', BG);
    measure(); buildWorld();
  }

  btnPlay.forEach(function (b) { b.addEventListener('click', function () { setPlay(!playing); }); });
  if (btnHold) btnHold.addEventListener('click', function () { setHold(!HOLD); });
  [].forEach.call(document.querySelectorAll('[data-set]'), function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-set')); }); });
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, function (e) { if (playing && !(e.target && e.target.closest && e.target.closest('.ctl'))) setPlay(false); }, { passive: true }); });
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { size(); buildText(); kick(); }, 160); });
  if (REDUCE) body.classList.add('still');

  var l0 = Q.lang; if (!l0) { try { l0 = localStorage.getItem('onduru-lang'); } catch (e) {} } if (!l0) l0 = (navigator.language || 'ko').slice(0, 2);
  size(); setLang(l0);
  if (Q.p != null) { var pv = +Q.p, k0 = Math.max(0, Math.min(SHOTS.length - 1, Math.floor(pv))); window.scrollTo(0, TOPS[k0] + (pv - k0) * span(k0)); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { buildText(); kick(); });
  body.classList.add('ready'); kick();
})();
