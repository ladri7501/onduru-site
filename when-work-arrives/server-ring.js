/* ONDURU as it is set up: the eight servers, and the governance and ecosystem around them, shown
   as a picture and not explained in words (On, 2026-11-27: the translator, pseudonyms and
   synthetic data, a structure that never depends on anyone, security, the chain of memory,
   alignment and self-healing must all be seen).
   When the studio's PCs come into view the lights go out. The eight machines stand on an open
   circle, the ONDURU enso, inside a guarded border: the territory.
   · Governance — people stand only at the gate (② in the opening of the circle), the one lit
     place. A person's key turns to let the work in and turns again to take the answer.
   · Translator — at ② the person's handwriting becomes the agents' dotted script, and back.
   · Pseudonyms — at ② the lines on the person's card are masked before the work goes in.
   · Synthetic data — at ⑥ hollow copies run the test before the real work passes.
   · Never dependent — models from many companies (DNA strands) are kept on a shelf inside.
     When the model at ① stops, another from the shelf takes its place and the work goes on.
   · Alignment — every strand points its needle at the standard in the middle before it works;
     the one that does not is marked and shut away.
   · Security — the border turns away whatever tries to come in elsewhere; ⑧ reaches the AI
     services outside only through its own checked port.
   · Chain of memory — every step stamps a block on the circle; ④ draws on earlier blocks.
   · Self-healing — ⑤ walks the chain back from the last step, finds a broken block and
     restores it from its backup.
   Then the circle opens at the gate and lies down as the line of the country that follows. */
(() => {
  'use strict';
  const TAU = Math.PI * 2, DEG = Math.PI / 180;
  const human = '230,227,219', ink = '205,201,188', mint = '147,214,196', dim = '92,100,108', faint = '52,58,66', warm = '236,104,92', odd = '118,124,130';
  // The eight companies' colours, as the country draws their agents' DNA.
  const co = {ms: '100,155,235', an: '235,170,80', meta: '135,125,240', oa: '205,205,212', xai: '185,120,230', ali: '225,215,95', amz: '155,215,90', goo: '230,115,190'};
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const ramp = (t, a, b) => ease((t - a) / (b - a));
  const mix = (a, b, t) => a + (b - a) * t;
  const lerp = (p, q, t) => [mix(p[0], q[0], t), mix(p[1], q[1], t)];
  const rgba = (c, a) => 'rgba(' + c + ',' + clamp(a).toFixed(3) + ')';
  const pulse = (t, a, b) => ramp(t, a, a + .12) * (1 - ramp(t, b - .12, b));

  // Only names; everything else is drawn.
  const words = {
    ko: {title: '총 8대 · 무인 공정 (Lights-out)', gate: '② 원장 · 관문', watch: '⑤ 백업 · 모니터링',
      nodes: ['③ 경량 모델', '④ RAG · MAG', '① LLM 추론 · CAG', '⑦ GPU 연산', '⑥ 테스트 · 검증', '⑧ Outbound Test PC']},
    en: {title: 'Eight servers · a lights-out process', gate: '② Ledger · gate', watch: '⑤ Backup · monitoring',
      nodes: ['③ Light models', '④ RAG · MAG', '① LLM inference · CAG', '⑦ GPU compute', '⑥ Test · verify', '⑧ Outbound Test PC']},
    es: {title: 'Ocho servidores · un proceso sin personal (lights-out)', gate: '② Registro · control', watch: '⑤ Copia · vigilancia',
      nodes: ['③ Modelos ligeros', '④ RAG · MAG', '① Inferencia LLM · CAG', '⑦ Cálculo GPU', '⑥ Prueba · verificación', '⑧ Outbound Test PC']}
  };

  // The circle opens at the bottom: the work leaves ② at the left end and comes back at the right.
  const GAP = 24 * DEG, A0 = Math.PI / 2 + GAP, A1 = Math.PI * 2.5 - GAP;
  const angles = [1, 2, 3, 4, 5, 6].map(k => A0 + (A1 - A0) * k / 7);
  const N3 = 0, N4 = 1, N1 = 2, N7 = 3, N6 = 4, N8 = 5;

  function geo(w, h) {
    const portrait = w / h < .88 || w < 600;
    const px = Math.max(.7, Math.min(1.25, Math.min(w / 1440, h / 900) * (portrait ? 1.5 : 1)));
    // Small things (strands, the work, the person's card and key) are drawn larger on a wide screen.
    const gx = portrait ? Math.max(.85, px * 1.15) : px * 1.7, mx = portrait ? px : px * 1.25;
    const fs = portrait ? 11 : Math.max(12, Math.min(14, w * .0095));
    const top = Math.max(h * .14, fs * 1.36 * 3 + 20), bottom = h - (portrait ? Math.max(h * .14, 64) : h * .14);
    const ry = (bottom - top) / 2 * .9, cy = (top + bottom) / 2;
    const rx = portrait ? Math.min(w * .25, ry * .9) : Math.min(w * .24, ry * 1.5);
    const at = a => [w / 2 + rx * Math.cos(a), cy + ry * Math.sin(a)];
    const bx = rx + 26 * px, by = ry + 20 * px;
    const border = a => [w / 2 + bx * Math.cos(a), cy + by * Math.sin(a)];
    const gate = [w / 2, cy + ry], person = [w / 2, cy + by + 30 * px];
    // Inside the circle, down its middle: the shelf of models, the standard, ⑤, the shut cell.
    const shelf = [w / 2, cy - ry * .5], standard = [w / 2, cy - ry * .2], watch = [w / 2, cy + ry * .1], cell = [w / 2, cy + ry * .46];
    return {portrait, px, gx, mx, fs, cx: w / 2, cy, rx, ry, at, border, gate, person, shelf, standard, watch, cell, gutter: Math.max(12, w * .03)};
  }

  // The path the work takes, in units: person → ② → round the circle (one unit per 45°) → ② → person.
  const arcUnits = (A1 - A0) / (45 * DEG);
  const S = {gateIn: 1, arc0: 2, arc1: 2 + arcUnits, gateOut: 3 + arcUnits, end: 4 + arcUnits};
  const sOf = a => S.arc0 + (a - A0) / (45 * DEG);
  function pathAt(G, s) {
    const gin = [G.gate[0] - 16 * G.px, G.gate[1]], gout = [G.gate[0] + 16 * G.px, G.gate[1]];
    if (s <= S.gateIn) return lerp(G.person, gin, s);
    if (s <= S.arc0) return lerp(gin, G.at(A0), s - S.gateIn);
    if (s <= S.arc1) return G.at(A0 + (s - S.arc0) * 45 * DEG);
    if (s <= S.gateOut) return lerp(G.at(A1), gout, s - S.arc1);
    return lerp(gout, G.person, Math.min(1, s - S.gateOut));
  }

  // The timetable of the scene, in seconds after the lights begin to go out.
  const T = {ring: [.5, 2.5], border: [1, 2.2], world: [1.8, 2.8], align: [2.8, 3.8], fail: 3.35, shut: [3.9, 4.4], keyIn: [4.25, 4.6], go: 4.6};
  const stays = [.7, .6, 1.3, .45, 1, .9];
  const plan = (() => {
    const keys = [[T.go, 0], [T.go + .35, S.gateIn]], busy = [], gateBusy = [[T.go + .35, T.go + .9]];
    keys.push([T.go + .9, S.gateIn], [T.go + 1.05, S.arc0]);
    let t = T.go + 1.05, s = S.arc0;
    angles.forEach((a, k) => {
      const to = sOf(a);
      t += .3 * (to - s); keys.push([t, to]);
      busy.push([t, t + stays[k]]);
      t += stays[k]; keys.push([t, to]); s = to;
    });
    t += .3 * (S.arc1 - s); keys.push([t, S.arc1]);
    t += .15; keys.push([t, S.gateOut]);
    gateBusy.push([t, t + .55]); t += .55; keys.push([t, S.gateOut]);
    t += .35; keys.push([t, S.end]);
    return {keys, busy, gateBusy, done: t};
  })();
  const swap = {cut: plan.busy[N1][0] + .4, fly: [plan.busy[N1][0] + .65, plan.busy[N1][0] + 1.05]};
  const probe = [plan.busy[N4][0] - .2, plan.busy[N1][0] + .5];
  const keyOut = [plan.done - .05, plan.done + .3];
  const TRACE = [plan.done + .3, plan.done + 1.6], heal = [plan.done + .85, plan.done + 1.35];
  function placeAt(t) {
    const k = plan.keys;
    if (t <= k[0][0]) return k[0][1];
    for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return mix(k[i - 1][1], k[i][1], ease((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0] || 1)));
    return k[k.length - 1][1];
  }
  const timeAt = s => { const k = plan.keys; for (let i = 1; i < k.length; i++) if (s <= k[i][1] && k[i][1] > k[i - 1][1]) return mix(k[i - 1][0], k[i][0], (s - k[i - 1][1]) / (k[i][1] - k[i - 1][1])); return plan.done; };
  // Two record blocks between each pair of stops on the circle; earlier work has already stamped
  // them faintly, and the work going round stamps them again. One will be found broken.
  const stops = [A0, ...angles, A1];
  const blocks = [];
  for (let i = 0; i < stops.length - 1; i++) [1 / 3, 2 / 3].forEach(f => blocks.push(mix(stops[i], stops[i + 1], f)));
  const blockTimes = blocks.map(a => timeAt(sOf(a)));
  const BROKEN = 7, RECALL = [9, 10, 11];

  // Strands of DNA: three kept at ③, one at ①, four on the shelf (the last of them is the one
  // whose alignment fails).
  const docked = [{k: N3, c: co.ali, dx: -1}, {k: N3, c: co.goo, dx: 0}, {k: N3, c: co.meta, dx: 1}, {k: N1, c: co.ali, dx: 0}];
  const shelfC = [co.ms, co.amz, co.xai, odd];
  const SPARE = 1;
  const dockAt = (G, d) => {
    const a = angles[d.k], p = G.at(a), inward = [Math.cos(a), Math.sin(a)];
    return [p[0] - inward[0] * 24 * G.gx + d.dx * 9 * G.gx * -inward[1], p[1] - inward[1] * 24 * G.gx + d.dx * 9 * G.gx * inward[0]];
  };

  function wrap(g, text, maxW) {
    const out = []; let cur = '';
    text.split(' ').forEach(word => {
      const next = cur ? cur + ' ' + word : word;
      if (cur && g.measureText(next).width > maxW) { out.push(cur); cur = word; } else cur = next;
    });
    out.push(cur);
    return out;
  }
  function name(g, G, text, x, y, align, a, maxW) {
    if (a <= .004) return;
    const f = G.fs;
    g.font = '500 ' + f.toFixed(1) + 'px "Exhibit Label", sans-serif';
    const lines = wrap(g, text, maxW), lead = f * 1.3;
    g.textAlign = align; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(8,14,20,.95)'; g.shadowBlur = 6;
    g.fillStyle = rgba(human, .88 * a);
    lines.forEach((t, i) => g.fillText(t, x, y + (i - (lines.length - 1) / 2) * lead));
    g.shadowBlur = 0;
  }
  function machine(g, G, [x, y], on, done, a, wide = 1) {
    if (a <= .004) return;
    const bw = 28 * G.mx * wide, bh = 17 * G.mx;
    g.fillStyle = rgba('8,14,20', .94 * a); g.fillRect(x - bw / 2, y - bh / 2, bw, bh);
    g.strokeStyle = rgba(on > .01 ? mint : ink, (.38 + .5 * Math.max(on, done * .4)) * a); g.lineWidth = 1;
    g.strokeRect(x - bw / 2, y - bh / 2, bw, bh);
    g.strokeStyle = rgba(ink, .3 * a); g.lineWidth = .8;
    [-.18, .18].forEach(f => { g.beginPath(); g.moveTo(x - bw * .36, y + bh * f); g.lineTo(x + bw * .12, y + bh * f); g.stroke(); });
    g.fillStyle = rgba(on > .01 || done ? mint : dim, (.35 + .6 * Math.max(on, done * .5)) * a);
    g.beginPath(); g.arc(x + bw * .32, y, 1.7 * G.gx, 0, TAU); g.fill();
    if (on > .01) { g.strokeStyle = rgba(mint, .38 * on * a); g.beginPath(); g.arc(x, y, bw * .9, 0, TAU); g.stroke(); }
  }
  // A strand of DNA standing upright; a cut strand has a gap in its middle.
  function strand(g, G, [x, y], c, a, phase = 0, cut = 0) {
    if (a <= .004) return;
    const len = 15 * G.gx, amp = 3 * G.gx;
    g.lineWidth = .9;
    for (let i = 0; i <= 8; i++) {
      const f = i / 8, yy = y - len / 2 + f * len, s = Math.sin(phase + f * 7), z = Math.cos(phase + f * 7);
      if (cut > 0 && Math.abs(f - .5) < .14 * cut) continue;
      g.fillStyle = rgba(c, a * (.55 + .45 * z)); g.beginPath(); g.arc(x + amp * s, yy, 1.1 * G.gx, 0, TAU); g.fill();
      g.fillStyle = rgba(c, a * (.55 - .45 * z)); g.beginPath(); g.arc(x - amp * s, yy, 1.1 * G.gx, 0, TAU); g.fill();
      if (i % 2) { g.strokeStyle = rgba(c, a * .4); g.beginPath(); g.moveTo(x - amp * s, yy); g.lineTo(x + amp * s, yy); g.stroke(); }
    }
  }
  // The person's handwriting, and the agents' dotted script.
  function handwriting(g, G, [x, y], a) {
    if (a <= .004) return;
    g.strokeStyle = rgba(human, .9 * a); g.lineWidth = 1.2; g.beginPath();
    for (let i = 0; i <= 14; i++) { const f = i / 14, xx = x - 9 * G.gx + f * 18 * G.gx, yy = y + Math.sin(f * 11) * 2.6 * G.gx * (1 - .4 * f); i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
    g.stroke();
  }
  function script(g, G, [x, y], a, scale = 1) {
    if (a <= .004) return;
    const d = 3.4 * G.gx * scale;
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      if ((i + j * 3 + 4) % 4 === 3) continue;
      g.fillStyle = rgba(mint, a * .95); g.beginPath(); g.arc(x + i * d, y + j * d, 1.15 * G.gx * scale, 0, TAU); g.fill();
    }
  }
  // The person's card: two lines of writing, masked into dots at the gate.
  function card(g, G, [x, y], masked, a) {
    if (a <= .004) return;
    const cw = 13 * G.gx, ch = 9 * G.gx;
    g.strokeStyle = rgba(human, .7 * a); g.lineWidth = .9; g.strokeRect(x - cw / 2, y - ch / 2, cw, ch);
    [-.2, .2].forEach((f, i) => {
      const yy = y + ch * f, x0 = x - cw * .34, x1 = x + cw * (i ? .1 : .34);
      if (masked < 1) { g.strokeStyle = rgba(human, .8 * a * (1 - masked)); g.beginPath(); g.moveTo(x0, yy); g.lineTo(x1, yy); g.stroke(); }
      if (masked > 0) for (let k = 0; k < 4; k++) { g.fillStyle = rgba(dim, a * masked); g.beginPath(); g.arc(mix(x0, x1, k / 3), yy, .9 * G.gx, 0, TAU); g.fill(); }
    });
  }
  function key(g, G, [x, y], turn, a) {
    if (a <= .004) return;
    g.save(); g.translate(x, y); g.rotate(-Math.PI / 2 * turn);
    g.strokeStyle = rgba(human, .85 * a); g.lineWidth = 1.1;
    g.beginPath(); g.arc(-5 * G.gx, 0, 2.8 * G.gx, 0, TAU); g.stroke();
    g.beginPath(); g.moveTo(-2.2 * G.gx, 0); g.lineTo(6 * G.gx, 0); g.moveTo(3.5 * G.gx, 0); g.lineTo(3.5 * G.gx, 2.6 * G.gx); g.moveTo(5.5 * G.gx, 0); g.lineTo(5.5 * G.gx, 2 * G.gx); g.stroke();
    g.restore();
  }
  function figure(g, G, [x, y], a) {
    if (a <= .004) return;
    g.strokeStyle = rgba(human, .85 * a); g.fillStyle = rgba(human, .85 * a); g.lineWidth = 1.1;
    g.beginPath(); g.arc(x, y - 6 * G.gx, 2.6 * G.gx, 0, TAU); g.fill();
    g.beginPath(); g.arc(x, y + 5 * G.gx, 6 * G.gx, Math.PI * 1.08, Math.PI * 1.92); g.stroke();
  }
  const busyness = (t, [a, b]) => ramp(t, a - .08, a + .06) * (1 - ramp(t, b - .05, b + .12));
  // A soft light where something happens, so the eye finds each moment without words.
  function glow(g, [x, y], c, a, R) {
    if (a <= .004) return;
    const grad = g.createRadialGradient(x, y, 0, x, y, R);
    grad.addColorStop(0, rgba(c, .22 * a)); grad.addColorStop(1, rgba(c, 0));
    g.fillStyle = grad; g.fillRect(x - R, y - R, R * 2, R * 2);
  }

  // The AI services outside: points of every company's colour scattered round the border,
  // joined among themselves. They are not inside the territory.
  function outsidePoints(G, w, h) {
    const pts = [], cols = Object.values(co);
    for (let k = 0; k < 14; k++) {
      const a = -Math.PI / 2 + (k + .5) * TAU / 14;
      if (Math.sin(a) > .62 || Math.sin(a) < -.86) continue;
      const lift = (k % 3) * 14 * G.gx + 18 * G.gx;
      const p = [G.cx + (G.rx + 26 * G.gx + lift) * Math.cos(a) * 1.08, G.cy + (G.ry + 20 * G.gx + lift) * Math.sin(a)];
      p[0] = Math.max(G.gutter * .6, Math.min(w - G.gutter * .6, p[0])); p[1] = Math.max(6, Math.min(h - 6, p[1]));
      pts.push({p, c: cols[k % cols.length]});
    }
    return pts;
  }

  // t: seconds since the lights began to go out. unroll: 0 on the circle, 1 lying on the country's line.
  function draw(g, w, h, t, {locale = 'ko', alpha = 1, unroll = 0, anchors = null, reduced = false} = {}) {
    if (!(w > 0 && h > 0) || alpha <= .004) return;
    const wd = words[locale] || words.ko, G = geo(w, h);
    if (reduced) t = Math.max(t, TRACE[1] + .5);
    const u = anchors ? ease(unroll) : 0, keep = 1 - ramp(u, 0, .35);
    const st = anchors ? anchors.st : null;
    const shown = (a, b) => (reduced ? 1 : ramp(t, a, b)) * keep;
    g.save();
    g.globalAlpha *= alpha;
    g.lineCap = 'round'; g.lineJoin = 'round';

    // The one lit place: where people stand, outside the border at the gate.
    const light = shown(1, 2);
    if (light > 0) {
      const R = 74 * G.gx, glow = g.createRadialGradient(G.person[0], G.person[1], 0, G.person[0], G.person[1], R);
      glow.addColorStop(0, rgba(human, .17 * light)); glow.addColorStop(1, rgba(human, 0));
      g.fillStyle = glow; g.fillRect(G.person[0] - R, G.person[1] - R, R * 2, R * 2);
    }

    // The moments: the gate reading the work in and out, the one shut away, the swap at ①, the
    // knock at the border, the test at ⑥, the reach outside at ⑧, the block mended.
    if (!reduced && keep > 0) {
      const R = 46 * G.gx;
      glow(g, G.gate, mint, Math.max(...plan.gateBusy.map(b => busyness(t, b))), R);
      glow(g, G.cell, warm, pulse(t, T.fail, T.shut[1] + .4), R);
      glow(g, G.at(angles[N1]), warm, pulse(t, swap.cut - .05, swap.fly[0]), R);
      glow(g, G.at(angles[N1]), mint, pulse(t, swap.fly[0], swap.fly[1] + .3), R);
      glow(g, G.border(-Math.PI * .78), warm, pulse(t, probe[0] + .4, probe[0] + 1.2), R);
      glow(g, G.at(angles[N6]), mint, busyness(t, plan.busy[N6]), R);
      glow(g, G.border(angles[N8]), mint, busyness(t, plan.busy[N8]), R);
      glow(g, G.at(blocks[BROKEN]), warm, pulse(t, TRACE[0] + .3, heal[0] + .2), R);
      glow(g, G.at(blocks[BROKEN]), mint, pulse(t, heal[0] + .1, heal[1] + .3), R);
    }

    // The AI services outside, and the border of the territory between them and the machines.
    const world = shown(...T.world), outs = outsidePoints(G, w, h);
    if (world > 0) {
      g.lineWidth = .7;
      outs.forEach((o, i) => {
        const n = outs[(i + 1) % outs.length];
        if (Math.hypot(n.p[0] - o.p[0], n.p[1] - o.p[1]) < Math.max(w, h) * .35) { g.strokeStyle = rgba(faint, .9 * world); g.beginPath(); g.moveTo(o.p[0], o.p[1]); g.lineTo(n.p[0], n.p[1]); g.stroke(); }
      });
      outs.forEach((o, i) => {
        const tw = .55 + .25 * Math.sin(t * 1.3 + i * 1.7);
        g.fillStyle = rgba(o.c, tw * world); g.beginPath(); g.arc(o.p[0], o.p[1], 2.1 * G.gx, 0, TAU); g.fill();
        g.strokeStyle = rgba(o.c, .35 * world); g.beginPath(); g.arc(o.p[0], o.p[1], 5 * G.gx, 0, TAU); g.stroke();
      });
    }
    const wall = shown(...T.border);
    const a8 = angles[N8];
    const knock = !reduced ? pulse(t, probe[0] + .55, probe[0] + 1.1) * keep : 0;
    const knockAt = -Math.PI * .78;
    if (wall > 0) {
      const grow = reduced ? 1 : ramp(t, ...T.border);
      g.setLineDash([4 * G.gx, 4 * G.gx]); g.lineWidth = 1;
      [[Math.PI / 2 + 7 * DEG, a8 - 4 * DEG], [a8 + 4 * DEG, Math.PI * 2.5 - 7 * DEG]].forEach(([s0, s1]) => {
        g.strokeStyle = rgba(ink, .32 * wall); g.beginPath();
        for (let i = 0; i <= 64; i++) { const p = G.border(mix(s0, mix(s0, s1, grow), i / 64)); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
        g.stroke();
      });
      g.setLineDash([]);
      // ⑧'s port: two short posts, lit while the work passes through.
      const portOn = busyness(t, plan.busy[N8]);
      [a8 - 4 * DEG, a8 + 4 * DEG].forEach(a => {
        const p = G.border(a), q = [p[0] + Math.cos(a) * 7 * G.gx, p[1] + Math.sin(a) * 7 * G.gx];
        g.strokeStyle = rgba(portOn > .05 ? mint : ink, (.5 + .45 * portOn) * wall); g.lineWidth = 1.4;
        g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
      });
      // The border holds: where something knocks from outside, it flares and turns it back.
      if (knock > 0) {
        const p = G.border(knockAt);
        g.strokeStyle = rgba(warm, .8 * knock); g.lineWidth = 2;
        g.beginPath(); for (let i = 0; i <= 12; i++) { const q = G.border(knockAt - 9 * DEG + i * 1.5 * DEG); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.stroke();
        g.strokeStyle = rgba(warm, .5 * knock); g.lineWidth = 1; g.beginPath(); g.arc(p[0], p[1], (6 + 10 * knock) * G.gx, 0, TAU); g.stroke();
      }
    }
    // The probe from outside: it comes at the border and is turned back.
    if (!reduced && keep > 0 && t > probe[0] && t < probe[1]) {
      const p = G.border(knockAt), out = [p[0] + Math.cos(knockAt) * 70 * G.gx, p[1] + Math.sin(knockAt) * 70 * G.gx];
      const f = (t - probe[0]) / (probe[1] - probe[0]), go = f < .5 ? ease(f / .5) : 1 - ease((f - .5) / .5) * .8;
      const q = lerp(out, p, go * .96);
      g.fillStyle = rgba(warm, .9 * (1 - ramp(f, .7, 1)) * keep); g.beginPath(); g.arc(q[0], q[1], 2.6 * G.gx, 0, TAU); g.fill();
    }

    // The circle, one brush stroke from the gate round to the gate; on unrolling, every point goes
    // to its place on the line between the stations it lay between.
    const drawn = reduced ? 1 : ramp(t, ...T.ring);
    const targets = st ? [st[0], st[1], st[2], st[3], st[4], st[5], st[6], st[6]] : null;
    const placeOf = a => {
      const p = G.at(a);
      if (!u) return p;
      let i = 0; while (i < stops.length - 2 && a > stops[i + 1]) i++;
      const f = (a - stops[i]) / (stops[i + 1] - stops[i]);
      return lerp(p, lerp(targets[i], targets[i + 1], f), u);
    };
    if (drawn > 0) {
      const end = A0 + (A1 - A0) * drawn, n = 96;
      g.strokeStyle = rgba(ink, .05); g.lineWidth = 6 * G.gx; g.beginPath();
      for (let i = 0; i <= n; i++) { const p = placeOf(mix(A0, end, i / n)); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
      g.stroke();
      let prev = placeOf(A0);
      for (let i = 1; i <= n; i++) {
        const a = mix(A0, end, i / n), p = placeOf(a), along = (a - A0) / (A1 - A0);
        g.strokeStyle = rgba(ink, .62 - .2 * along); g.lineWidth = (2.6 - 1.6 * along) * Math.max(.8, G.gx);
        g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(p[0], p[1]); g.stroke(); prev = p;
      }
    }
    const gIn = u ? lerp(G.gate, st[0], u) : G.gate, gOut = u ? lerp(G.gate, st[6], u) : G.gate;
    const pIn = u ? lerp(G.person, anchors.inP, u) : G.person, pOut = u ? lerp(G.person, anchors.outP, u) : G.person;
    const seen = reduced ? 1 : ramp(t, .4, 1.2);
    g.strokeStyle = rgba(ink, .4 * seen); g.lineWidth = 1;
    [[gIn, placeOf(A0)], [gOut, placeOf(A1)], [pIn, gIn], [pOut, gOut]].forEach(([p, q]) => { g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); });

    // The middle: ⑤ watching every machine; above it the standard every strand aligns to, and
    // the shelf of models kept inside; below it the cell where what fails is shut away.
    const centre = u ? lerp(G.watch, anchors.watcher, u) : G.watch;
    const middle = shown(2.1, 2.8);
    const sweep = mix(A1, A0, ease((t - TRACE[0]) / (TRACE[1] - TRACE[0])));
    const tracing = !reduced && t >= TRACE[0] && t <= TRACE[1] + .3 ? 1 - ramp(t, TRACE[1], TRACE[1] + .3) : 0;
    if (middle > 0) {
      [G.gate, ...angles.map(a => G.at(a))].forEach((p, i) => {
        const busy = i ? busyness(t, plan.busy[i - 1]) : Math.max(...plan.gateBusy.map(b => busyness(t, b)));
        g.strokeStyle = rgba(busy > .05 ? mint : faint, (busy > .05 ? .55 * busy : .9) * middle);
        g.lineWidth = .8; g.setLineDash([2, 4]);
        g.beginPath(); g.moveTo(centre[0], centre[1]); g.lineTo(p[0], p[1]); g.stroke();
      });
      g.setLineDash([]);
      // ⑤ also turns toward the knock at the border.
      if (knock > 0) { const p = G.border(knockAt); g.strokeStyle = rgba(warm, .5 * knock); g.lineWidth = 1; g.beginPath(); g.moveTo(centre[0], centre[1]); g.lineTo(p[0], p[1]); g.stroke(); }
      const r = 22 * G.gx, look = tracing ? sweep : t * .9;
      g.strokeStyle = rgba(ink, .35 * middle); g.lineWidth = 1; g.beginPath(); g.arc(centre[0], centre[1], r, 0, TAU); g.stroke();
      g.strokeStyle = rgba(mint, (.45 + .4 * tracing) * middle); g.lineWidth = 1.4; g.beginPath(); g.arc(centre[0], centre[1], r, look - .35, look + .35); g.stroke();
      machine(g, G, centre, tracing, true, middle);
      // The standard: a small enso of its own.
      const sd = G.standard, sr = 8 * G.gx;
      g.strokeStyle = rgba(human, .8 * middle); g.lineWidth = 1.5; g.beginPath(); g.arc(sd[0], sd[1], sr, -70 * DEG + .45, -70 * DEG + TAU - .2); g.stroke();
      g.fillStyle = rgba(mint, .85 * middle); g.beginPath(); g.arc(sd[0], sd[1], 1.8 * G.gx, 0, TAU); g.fill();
      // The cell.
      const cl = G.cell, cs = 13 * G.gx, shut = reduced ? 1 : ramp(t, ...T.shut);
      g.setLineDash([2, 3]); g.strokeStyle = rgba(warm, (.25 + .45 * shut) * middle); g.lineWidth = 1; g.strokeRect(cl[0] - cs, cl[1] - cs * .75, cs * 2, cs * 1.5); g.setLineDash([]);
    }

    // The chain of memory along the circle: faint stamps of earlier work, stamped again as the work
    // passes; ④ draws on earlier blocks; ⑤ walks the chain back and mends the broken one.
    blocks.forEach((a, i) => {
      const at = (a - A0) / (A1 - A0), appear = ramp(drawn, at - .02, at + .02) * keep;
      if (appear <= 0) return;
      const p = G.at(a), stamped = reduced ? 1 : ramp(t, blockTimes[i], blockTimes[i] + .15);
      const flash = tracing && a >= sweep && a <= sweep + 10 * DEG ? 1 : 0;
      const broken = i === BROKEN && !reduced ? pulse(t, TRACE[0] + .3, heal[1]) : 0;
      const b = 3.3 * G.gx;
      g.fillStyle = 'rgba(8,14,20,.95)'; g.fillRect(p[0] - b, p[1] - b, b * 2, b * 2);
      const edge = broken > .05 ? warm : flash ? mint : ink;
      g.strokeStyle = rgba(edge, (.38 + .45 * Math.max(stamped, broken)) * appear); g.lineWidth = .9; g.strokeRect(p[0] - b, p[1] - b, b * 2, b * 2);
      g.fillStyle = rgba(broken > .05 ? warm : flash ? mint : ink, (.22 + (flash ? .7 : .3) * stamped) * appear);
      g.fillRect(p[0] - b * .45, p[1] - b * .45, b * .9, b * .9);
      if (broken > .05) { g.strokeStyle = rgba(warm, broken * appear); g.beginPath(); g.moveTo(p[0] - b, p[1] - b * .3); g.lineTo(p[0], p[1] + b * .2); g.lineTo(p[0] + b, p[1] - b * .4); g.stroke(); }
    });
    if (!reduced && keep > 0) {
      // ④ reaches back to earlier blocks.
      const recall = busyness(t, plan.busy[N4]);
      if (recall > .02) {
        const n4 = G.at(angles[N4]);
        RECALL.forEach((bi, k) => {
          const p = G.at(blocks[bi]), f = clamp((t - plan.busy[N4][0] - k * .1) / .4);
          if (f <= 0) return;
          g.strokeStyle = rgba(mint, .35 * recall); g.lineWidth = .8; g.setLineDash([2, 3]);
          g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(n4[0], n4[1]); g.stroke(); g.setLineDash([]);
          const q = lerp(p, n4, f); g.fillStyle = rgba(mint, .9 * recall); g.beginPath(); g.arc(q[0], q[1], 2 * G.gx, 0, TAU); g.fill();
        });
      }
      // ⑤ walks back, and mends.
      if (tracing > 0) {
        g.strokeStyle = rgba(mint, .75 * tracing); g.lineWidth = 1.6; g.beginPath();
        for (let i = 0; i <= 40; i++) { const q = G.at(mix(A1, sweep, i / 40)); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }
        g.stroke(); g.lineWidth = 1;
        const mend = pulse(t, heal[0], heal[1]);
        if (mend > 0) {
          const p = G.at(blocks[BROKEN]), f = clamp((t - heal[0]) / .35);
          g.strokeStyle = rgba(mint, .7 * mend); g.beginPath(); g.moveTo(centre[0], centre[1]); g.lineTo(mix(centre[0], p[0], f), mix(centre[1], p[1], f)); g.stroke();
        }
      }
    }

    // ⑧ reaches the AI services outside, through its port only.
    const outAt = !reduced ? busyness(t, plan.busy[N8]) : 0;
    if (outAt > .02 && keep > 0 && outs.length) {
      const n8 = G.at(a8), port = G.border(a8);
      const far = outs.reduce((best, o) => (Math.hypot(o.p[0] - port[0], o.p[1] - port[1]) < Math.hypot(best.p[0] - port[0], best.p[1] - port[1]) ? o : best), outs[0]);
      const [b0, b1] = plan.busy[N8], f = Math.sin(Math.PI * clamp((t - b0) / (b1 - b0)));
      g.strokeStyle = rgba(mint, .5 * outAt); g.setLineDash([3, 3]); g.lineWidth = .9;
      g.beginPath(); g.moveTo(n8[0], n8[1]); g.lineTo(port[0], port[1]); g.lineTo(far.p[0], far.p[1]); g.stroke(); g.setLineDash([]);
      const q = f < .5 ? lerp(n8, port, f / .5) : lerp(port, far.p, (f - .5) / .5);
      script(g, G, q, outAt, .55);
    }

    // The strands: docked at ③ and ①, kept on the shelf; each aligns to the standard before working.
    const strands = shown(2.2, 2.8);
    if (strands > 0) {
      const sd = G.standard;
      const cutF = reduced ? 1 : ramp(t, swap.cut, swap.cut + .3), fly = reduced ? 1 : ramp(t, ...swap.fly);
      docked.forEach((d, i) => {
        const p0 = dockAt(G, d), n1 = d.k === N1;
        const p = n1 ? [p0[0], p0[1] + 14 * G.gx * cutF] : p0;
        const work = busyness(t, plan.busy[d.k]) * (n1 ? 1 - cutF : 1);
        // When ①'s strand stops, it is cut and fades; the spare from the shelf has come to take its place.
        strand(g, G, p, n1 && cutF > 0 ? odd : d.c, (n1 ? 1 - .9 * cutF : 1) * strands, t * (1 + 3 * work) + i, n1 ? cutF : 0);
        const needle = reduced ? 0 : pulse(t, T.align[0] + .1 * i, T.align[1] + .2);
        if (needle > 0) { g.strokeStyle = rgba(mint, .45 * needle * keep); g.lineWidth = .8; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(mix(p[0], sd[0], ease(needle)), mix(p[1], sd[1], ease(needle))); g.stroke(); }
      });
      shelfC.forEach((c0, i) => {
        const s = [G.shelf[0] + (i - 1.5) * 13 * G.gx, G.shelf[1]], failed = i === 3, spare = i === SPARE;
        let p = s, c = c0, work = 0;
        if (failed) {
          const go = reduced ? 1 : ramp(t, ...T.shut);
          p = lerp(s, G.cell, go);
          c = !reduced && t > T.fail && go < 1 ? warm : odd;
        }
        if (spare && fly > 0) { p = lerp(s, dockAt(G, docked[3]), fly); work = busyness(t, plan.busy[N1]) * fly; }
        const needle = reduced ? 0 : pulse(t, T.align[0] + .25 + .1 * i, T.align[1] + .2);
        if (needle > 0) {
          const reach = failed ? .55 : 1, bend = failed ? 14 * G.gx * Math.sin(t * 9) : 0;
          g.strokeStyle = rgba(failed && t > T.fail ? warm : mint, .5 * needle * keep); g.lineWidth = .8;
          g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(mix(p[0], sd[0] + bend, ease(needle) * reach), mix(p[1], sd[1], ease(needle) * reach)); g.stroke();
        }
        if (failed && !reduced && t > T.fail && t < T.shut[1]) { g.strokeStyle = rgba(warm, .7 * keep); g.lineWidth = 1; g.beginPath(); g.arc(p[0], p[1], 10 * G.gx, 0, TAU); g.stroke(); }
        strand(g, G, p, c, strands, t * (.8 + 3 * work) + i * 1.3);
      });
    }

    // The machines: ② at the gate (it splits in two as the circle opens), then the six round it.
    const gateOn = Math.max(...plan.gateBusy.map(b => busyness(t, b)));
    const gateAppear = reduced ? 1 : ramp(t, .4, 1);
    machine(g, G, gIn, gateOn, t > plan.gateBusy[0][1], gateAppear, 1.5);
    if (u > .02) machine(g, G, gOut, 0, true, gateAppear, 1.5);
    angles.forEach((a, k) => {
      const appear = ramp(drawn, (a - A0) / (A1 - A0) - .03, (a - A0) / (A1 - A0) + .03);
      const p = u ? lerp(G.at(a), st[k + 1], u) : G.at(a);
      const stall = k === N1 && !reduced ? pulse(t, swap.cut, swap.fly[1]) : 0;
      machine(g, G, p, reduced ? 0 : busyness(t, plan.busy[k]) * (1 - stall), reduced || t > plan.busy[k][1], appear);
    });
    // ⑦ works in parallel: short bars beating side by side.
    const gpu = !reduced ? busyness(t, plan.busy[N7]) * keep : 0;
    if (gpu > .02) {
      const p = G.at(angles[N7]);
      for (let i = 0; i < 6; i++) { const hgt = (4 + 5 * Math.abs(Math.sin(t * 14 + i * 1.9))) * G.gx; g.fillStyle = rgba(mint, .7 * gpu); g.fillRect(p[0] - 11 * G.gx + i * 4.2 * G.gx, p[1] + 12 * G.gx, 2.2 * G.gx, hgt); }
    }
    // ⑥ runs hollow copies on made-up data before the real work passes.
    const test = !reduced ? busyness(t, plan.busy[N6]) * keep : 0;
    if (test > .02) {
      const p = G.at(angles[N6]), [b0] = plan.busy[N6];
      for (let i = 0; i < 3; i++) {
        const f = clamp((t - b0 - i * .12) / .7), ang = f * TAU + i * 2.1, r = 17 * G.gx;
        if (f <= 0 || f >= 1) continue;
        const q = [p[0] + Math.cos(ang) * r, p[1] + Math.sin(ang) * r * .8];
        g.setLineDash([1.6, 1.8]); g.strokeStyle = rgba(mint, .85 * test); g.lineWidth = .9; g.beginPath(); g.arc(q[0], q[1], 3.4 * G.gx, 0, TAU); g.stroke(); g.setLineDash([]);
      }
    }

    // The person, the card and the key: the key turns as the work goes in and as the answer comes back.
    const personOn = reduced ? 1 : ramp(t, 1, 1.6);
    figure(g, G, pIn, gateAppear * personOn);
    if (u > .02) figure(g, G, pOut, gateAppear);
    if (keep > 0) {
      const kp = [G.person[0] + 18 * G.gx, G.person[1] - 1 * G.gx];
      const turn = reduced ? 1 : Math.max(ramp(t, ...T.keyIn) * (1 - ramp(t, T.go + 1.5, T.go + 1.9)), ramp(t, ...keyOut));
      key(g, G, kp, turn, personOn * keep);
      card(g, G, [G.person[0] - 19 * G.gx, G.person[1] - 1 * G.gx], 0, personOn * keep);
    }

    // The work itself, going round: handwriting until ② reads it into the agents' script (with the
    // card masked), the script all the way round, and handwriting again on the way out.
    if (!reduced && t >= T.go && t <= plan.done + .2 && keep > 0) {
      const s = placeAt(t), p = pathAt(G, s), back = pathAt(G, Math.max(0, s - .35));
      const inGate = t >= plan.gateBusy[0][0] && t <= plan.gateBusy[0][1], outGate = t >= plan.gateBusy[1][0] && t <= plan.gateBusy[1][1];
      const before = t < plan.gateBusy[0][0], after = t > plan.gateBusy[1][1];
      g.strokeStyle = rgba(mint, .35 * keep); g.lineWidth = 1.6; g.beginPath(); g.moveTo(back[0], back[1]); g.lineTo(p[0], p[1]); g.stroke();
      if (inGate || outGate) {
        const f = inGate ? ramp(t, plan.gateBusy[0][0], plan.gateBusy[0][1]) : 1 - ramp(t, plan.gateBusy[1][0], plan.gateBusy[1][1]);
        const above = [p[0], p[1] - 18 * G.gx];
        handwriting(g, G, above, 1 - f);
        script(g, G, above, f);
        card(g, G, [p[0] + 20 * G.gx, p[1] - 18 * G.gx], inGate ? f : 1 - f, keep);
      } else if (before || after) {
        handwriting(g, G, [p[0], p[1] - 10 * G.gx], keep);
      } else {
        // ③ splits the work into pieces for its three strands and puts them back together.
        const split = busyness(t, plan.busy[N3]);
        if (split > .05) {
          const [b0, b1] = plan.busy[N3], f = Math.sin(Math.PI * clamp((t - b0) / (b1 - b0)));
          docked.filter(d => d.k === N3).forEach(d => script(g, G, lerp(p, dockAt(G, d), f), keep, .5));
        } else script(g, G, p, keep, .85);
        card(g, G, [p[0] + 13 * G.gx, p[1] - 10 * G.gx], 1, .7 * keep);
      }
    }

    // Names: the title above, and the machines.
    const named = shown(1.2, 2.2);
    if (named > 0) {
      g.font = (G.fs * (G.portrait ? 1.18 : 1.3)).toFixed(1) + 'px "Exhibit Voice", serif';
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(human, .92 * (reduced ? 1 : ramp(t, 2.2, 2.8)) * keep);
      const lines = wrap(g, wd.title, w - 2 * G.gutter), crown = G.cy - G.ry - 9 * G.mx - G.fs * 3.6;
      lines.forEach((line, i) => g.fillText(line, w / 2, Math.max(G.fs * 1.2 + (lines.length - 1) * G.fs * 1.5, crown) - (lines.length - 1 - i) * G.fs * 1.5));
      const gap = 14 * G.mx + 8;
      angles.forEach((a, k) => {
        const p = G.at(a), right = Math.cos(a) >= 0;
        const appear = ramp(drawn, (a - A0) / (A1 - A0), (a - A0) / (A1 - A0) + .08) * named;
        const top = Math.sin(a) < -.55, x = top ? p[0] + (right ? 8 : -8) * G.px : p[0] + (right ? gap : -gap);
        const y = top ? p[1] - 9 * G.mx - G.fs : p[1] - (k === N8 ? 9 * G.mx + G.fs * .8 : 0);
        name(g, G, wd.nodes[k], x, y, right ? 'left' : 'right', appear, right ? w - G.gutter - x : x - G.gutter);
      });
      const gateX = G.gate[0] + 21 * G.mx + 8;
      name(g, G, wd.gate, gateX, G.gate[1], 'left', named, w - G.gutter - gateX);
      // ⑤'s name sits beside it on a wide screen, under it on a narrow one.
      if (G.portrait) name(g, G, wd.watch, G.watch[0], G.watch[1] + 22 * G.gx + G.fs, 'center', named * middle, G.rx * 1.5);
      else { const watchX = G.watch[0] + 22 * G.gx + 8; name(g, G, wd.watch, watchX, G.watch[1], 'left', named * middle, Math.min(G.rx * .9, w - G.gutter - watchX)); }
    }
    g.restore();
  }
  window.ServerRing = {draw, length: TRACE[1] + .6, still: plan.busy[N6][0] + .35, done: plan.done};
})();
