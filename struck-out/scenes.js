/* 지운 자리의 노래 — 장면. 배경에 그려지는 세계는 모두 이 칸에서 온다 (S3: 작업지시 §3)
   0 빈 오선(첫 화면) · 1 곧은 오선 · 2 점 하나, 솟고 떨어지는 줄, 활 · 3 떨림, 지운 자리 · 4 빗방울 하나 · 5 낮은 물결 · 6 다시 곧은 오선, 열린 원, 까만 점
   본문의 data-scene 번호가 이 순서를 가리킨다. 선은 직선과 곡선뿐, 굵기·잉크·투명도는 같은 바람의 규칙 그대로 */
window.ONDURU_SCENES = function (E) {
  /* ═══════ 하나의 오선: 비어 있다 → 곧다 → 솟는다 → 떤다 → 건드려진다 → 흐른다 → 다시 곧다 ═══════ */
      var cx = E.cx, wind = E.wind, push = E.push;
      var W, H, T, dt, still, SEASON, PHASE, SKY, drops, WX, LINE;
      function sync() { var s = E.state(); W = s.W; H = s.H; T = s.T; dt = s.dt; still = s.still; SEASON = s.SEASON; PHASE = s.PHASE; SKY = s.SKY; drops = s.drops; WX = s.WX; LINE = s.LINE; }
      var WORLD = {};
      function rr(a, b) { return a + Math.random() * (b - a); }
      function buildWorld() {
        var small = W < 600, gap = Math.max(11, Math.min(26, H * 0.04));
        var lines = [];
        for (var i = 0; i < 5; i++) lines.push(H * 0.5 + (i - 2) * gap);
        var bows = [];
        for (var b = 0; b < (small ? 26 : 54); b++) bows.push({ x: rr(-10, W + 10), y: H * rr(0.7, 0.76), l: H * rr(0.1, 0.2), lean: rr(-0.18, 0.18), a: rr(0.08, 0.2), ph: rr(0, 6.28) });
        WORLD = { gap: gap, lines: lines, bows: bows, dotX: W * (small ? 0.32 : 0.3), dropX: W * (small ? 0.66 : 0.62), ripples: [], hitKey: '', since: {}, seen: {}, endAt: 0 };
      }
      function ln(x0, y0, x1, y1) { cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y1); cx.stroke(); }
      function col(a) { return 'rgba(' + LINE + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')'; }
      function ease(u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }

      /* 장면이 화면에 들어온 뒤 흐른 시간. 움직임을 줄인 화면에서는 장면마다 한 순간을 고정한다 */
      var REST = [0, 0, 1900, 6500, 2300, 3600, 0];
      function local(k) {
        if (still) return REST[k];
        if (!WORLD.seen[k] || T - WORLD.seen[k] > 600) WORLD.since[k] = T;
        WORLD.seen[k] = T;
        return T - WORLD.since[k];
      }
      /* 오선 한 줄: 같은 바람에 숨 쉬고, 손끝이 지나가면 비켜선다. off(x)가 그 줄만의 움직임 */
      function staffLine(i, a, off) {
        var y0 = WORLD.lines[i];
        cx.strokeStyle = col(a); cx.lineWidth = 1.1;
        cx.beginPath();
        for (var x = -20; x <= W + 20; x += 8) {
          var y = y0 + wind(x + i * 40) * 1.6 + push(x, y0, 140).y * 12 + (off ? off(x) : 0);
          if (x === -20) cx.moveTo(x, y); else cx.lineTo(x, y);
        }
        cx.stroke();
      }
      function staff(a, off) { for (var i = 0; i < 5; i++) staffLine(i, a, off ? (function (j) { return function (x) { return off(x, j); }; })(i) : null); }
      function yAt(i, x, off) { return WORLD.lines[i] + wind(x + i * 40) * 1.6 + (off ? off(x, i) : 0); }

      /* 0 · 첫 화면: 빈 오선 다섯 줄, 아주 옅게 */
      function sceneBlank() { staff(0.08); }

      /* 1 · 곧은 오선 */
      function sceneStraight() { staff(0.24); }

      /* 2 · 점 하나가 찍히면 줄은 제 몸을 잊고 솟았다가, 깊은 침묵 속으로 떨어진다. 아래에는 가는 활들이 같은 바람에 */
      function sceneRise() {
        var tt = local(2) % 10000, e;
        if (tt < 400) e = 0;
        else if (tt < 1900) e = -ease((tt - 400) / 1500);
        else if (tt < 2500) e = -1;
        else if (tt < 3700) e = -1 + 1.8 * ease((tt - 2500) / 1200);
        else e = 0.8 * Math.exp(-(tt - 3700) / 1400) * Math.cos((tt - 3700) / 700);
        var A = Math.min(H * 0.16, 130), dx = WORLD.dotX, wv = W * 0.22;
        function off(x, i) { var g = (x - dx) / wv; return e * A * (1 - i * 0.06) * Math.exp(-g * g); }
        staff(0.24, off);
        var da = tt < 300 ? tt / 300 : tt < 7000 ? 1 : tt < 8000 ? 1 - (tt - 7000) / 1000 : 0;
        if (da > 0) {
          cx.fillStyle = col(0.7 * da);
          cx.beginPath(); cx.arc(dx, yAt(2, dx, off), WORLD.gap * 0.36, 0, Math.PI * 2); cx.fill();
        }
        WORLD.bows.forEach(function (b) {
          var w = wind(b.x) + push(b.x, b.y, 160).x * 6 + 0.12 * Math.sin(T * 0.0007 + b.ph);
          var x1 = b.x + (b.lean + w * 0.06) * b.l;
          cx.strokeStyle = col(b.a); cx.lineWidth = 0.7;
          cx.beginPath(); cx.moveTo(b.x, b.y + b.l); cx.quadraticCurveTo(b.x + w * 2, b.y + b.l * 0.5, x1, b.y); cx.stroke();
        });
      }

      /* 3 · 소리 없는 방에서도 줄은 떤다. 한 번 크게 흔들린 뒤, 곡선 위에 그은 자리만 오래 떤다 */
      function sceneTremble() {
        var tt = local(3) % 14000;
        var fine = tt < 2400 ? 1 : tt < 3000 ? 1 - (tt - 2400) / 600 : 0;
        var big = tt >= 2400 && tt < 4400 ? Math.min(H * 0.05, 40) * Math.exp(-(tt - 2400) / 520) * Math.sin((tt - 2400) * 0.013) : 0;
        function off(x, i) {
          return fine * (0.8 * Math.sin(x * 0.09 + T * 0.05 + i) + 0.5 * Math.sin(x * 0.23 - T * 0.07 + i * 2))
               + big * Math.sin(Math.PI * x / W) * (1 - i * 0.05);
        }
        staff(0.24, off);
        /* 곡선(이음줄)과 그 위에 그은 짧은 선 */
        var x0 = W * 0.54, x1 = W * 0.84, xm = (x0 + x1) / 2, top = WORLD.lines[0] - WORLD.gap * 1.6;
        var long = tt >= 2400 ? Math.min(1, Math.exp(-(tt - 4200) / 7000)) * Math.min(1, (tt - 2400) / 400) : 0;
        var tw = still ? 0.8 : Math.sin(T * 0.03), tw2 = still ? 0.5 : Math.sin(T * 0.071);
        var trem = 2.4 * long * tw + 1.2 * long * tw2;
        var sh = big * 0.6 + fine * 0.8 * Math.sin(T * 0.05);
        cx.strokeStyle = col(0.3); cx.lineWidth = 1.1;
        cx.beginPath(); cx.moveTo(x0, top + sh);
        cx.quadraticCurveTo(xm, top - WORLD.gap * 1.4 + sh + trem * 0.4, x1, top + sh); cx.stroke();
        var my = top - WORLD.gap * 0.7 + sh + trem * 0.4, s = WORLD.gap * 0.9;
        cx.strokeStyle = col(0.46); cx.lineWidth = 1.3;
        ln(xm - s + trem * 0.3, my + s * 0.45 + trem, xm + s - trem * 0.3, my - s * 0.45 - trem);
      }

      /* 4 · 빗방울 하나가 맨 윗줄을 건드리면, 그 줄만 떨다 잦아든다 */
      function sceneDrop() {
        var t = local(4), tt = t % 9000, x0 = WORLD.dropX, top = WORLD.lines[0], hit = 1600;
        var v = tt >= hit ? Math.min(12, WORLD.gap * 0.5) * Math.exp(-(tt - hit) / 1300) * Math.sin((tt - hit) * 0.025) : 0;
        staffLine(0, 0.24, function (x) { var g = (x - x0) / (W * 0.2); return v * Math.sin(Math.PI * Math.max(0, Math.min(W, x)) / W) * (0.5 + 0.5 * Math.exp(-g * g)); });
        for (var i = 1; i < 5; i++) staffLine(i, 0.24);
        if (tt < hit) {
          var u = tt / hit, y = -30 + (top + 30) * u * u, L = Math.min(22, WORLD.gap);
          cx.strokeStyle = col(0.45); cx.lineWidth = 1;
          ln(x0, y - L, x0, y);
        } else if (still) {
          WORLD.ripples = [{ r: 10, a: 0.25 }];
        } else {
          var key = WORLD.since[4] + ':' + Math.floor(t / 9000);
          if (WORLD.hitKey !== key) { WORLD.hitKey = key; WORLD.ripples.push({ r: 1, a: 0.4 }); if (E.note && cx.globalAlpha > 0.5) E.note(x0 / W); }   /* 이 장면이 주로 보일 때만 (전환 중 옅게 그려질 때는 소리 없이) */
        }
        for (var j = WORLD.ripples.length - 1; j >= 0; j--) {
          var r = WORLD.ripples[j];
          if (!still) { r.r += 0.5 * dt; r.a *= Math.pow(0.95, dt); }
          if (r.a < 0.02) { WORLD.ripples.splice(j, 1); continue; }
          cx.strokeStyle = col(r.a); cx.lineWidth = 0.9;
          cx.beginPath(); cx.ellipse(x0, top, r.r * 2.4, r.r * 0.6, 0, Math.PI, Math.PI * 2); cx.stroke();
        }
      }

      /* 5 · 마음이 쏟아지고 흔들림이 잦아들면, 메아리는 낮아진 몸으로 줄을 따라 흐른다 */
      function sceneFlow() {
        var tt = local(5) % 8000, c = -W * 0.2 + W * 1.4 * (tt / 7000), wv = W * 0.12;
        staff(0.24, function (x, i) {
          var p = c - i * W * 0.02, g = (x - p) / wv;
          return (3 + i * 1.6) * Math.exp(-g * g) * Math.sin((x - p) * 0.035);
        });
      }

      /* 6 · 줄은 다시 곧다. 원은 열린 채로. 맺음이 보이면 가운데 줄에 까만 점 하나 */
      function sceneAgain() {
        staff(0.24);
        var bt = (T % 10000) / 10000, br = bt < 0.4 ? bt / 0.4 : 1 - (bt - 0.4) / 0.6;
        br = br * br * (3 - 2 * br);
        var R = Math.min(W, H) * 0.32 * (0.9 + 0.14 * (still ? 0.5 : br)), rot = T * 0.00005;
        cx.strokeStyle = col(0.16); cx.lineWidth = 1.4; cx.lineCap = 'round';
        cx.beginPath(); cx.arc(W / 2, H / 2, R, rot - 1.2, rot - 1.2 + Math.PI * 1.88); cx.stroke();
        var end = document.querySelector('section.end'), r = end ? end.getBoundingClientRect() : null;
        var vis = r && r.top < H * 0.85 && r.bottom > 0;
        if (!vis) { WORLD.endAt = 0; return; }
        if (!WORLD.endAt) WORLD.endAt = T || 1;
        var a = still ? 1 : ease((T - WORLD.endAt) / 4000);
        if (a <= 0) return;
        cx.fillStyle = col(0.85 * a);
        cx.beginPath(); cx.arc(W / 2, yAt(2, W / 2), WORLD.gap * 0.36, 0, Math.PI * 2); cx.fill();
      }
      var SCENES = [sceneBlank, sceneStraight, sceneRise, sceneTremble, sceneDrop, sceneFlow, sceneAgain];
      /* AI가 머무는 자리: 장면마다 곡선 곁 */
      function target(k) {
        var i = Math.floor(Math.random() * 5);
        if (!WORLD.lines) return { x: rr(W * 0.2, W * 0.8), y: rr(H * 0.2, H * 0.8) };
        if (k === 2) return { x: WORLD.dotX + rr(-60, 60), y: WORLD.lines[0] - rr(20, 60) };
        if (k === 3) return { x: W * rr(0.56, 0.82), y: WORLD.lines[0] - WORLD.gap * rr(2, 3.4) };
        if (k === 4) return { x: WORLD.dropX + rr(-50, 50), y: WORLD.lines[0] - rr(14, 40) };
        return { x: rr(W * 0.15, W * 0.85), y: WORLD.lines[i] - rr(10, 24) };
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
          grass: [99, -99, 1],      /* 풀·아래쪽 물결선: 작품2에는 없다 (같은 바람: [1, 3, 1]) */
          leaves: [99, -99, 1],     /* 날리는 잎: 작품2에는 없다 (같은 바람: [1, 3.4, 1.2]) */
          weather: [2.6, 2],        /* 비·눈: [옅어지기 시작, 사라지는 폭] */
          meteor: 2.5               /* 유성: 이 장면 앞에서만 */
        },
        /* 소리: 장면에 묶인 값. reg = [이 장면 번호보다 크면, 옥타브 이동(반음)] 을 위에서부터, 어디에도 안 맞으면 regElse */
        sound: {
          reg: [[5.5, 0], [4.5, -12], [2.5, 0], [1, 0]], regElse: -12,   /* 5연은 한 옥타브 낮게, 6연·맺음은 기본, 나머지는 같은 바람과 같게 */
          mute: [2.5, 3.5],                                               /* 3연: 소리 없는 방 */
          motif: { notes: [67, 67, 67, 63], step: 0.18, short: 0.16, long: 2.5, vel: 0.09 }   /* 맺음: 이름 없는 작곡가의 네 음 */
        }
      };
};
