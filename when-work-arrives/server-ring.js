/* The eight servers, drawn as they are set up (On, 2026-11-27: show the configuration as a
   picture, not as an explanation).
   When the studio's PCs come into view the lights go out. The eight machines stand on an open
   circle, the ONDURU enso: one piece of work goes round it in order and comes back to the gate.
   ② the ledger and gate sits in the opening of the circle, where the work comes in and goes out;
   people stand only there, the one lit place. ③ ④ ① ⑦ ⑥ ⑧ follow round the circle; ⑧ reaches
   out to the AI services outside. ⑤ in the middle watches every machine and, at the end, walks
   the record back from the last step. Then the circle opens at the gate and straightens into
   the line of the country that follows. Dots and lines only. */
(() => {
  'use strict';
  const TAU = Math.PI * 2, DEG = Math.PI / 180;
  const human = '230,227,219', ink = '205,201,188', mint = '147,214,196', dim = '92,100,108', faint = '52,58,66';
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const ramp = (t, a, b) => ease((t - a) / (b - a));
  const mix = (a, b, t) => a + (b - a) * t;
  const lerp = (p, q, t) => [mix(p[0], q[0], t), mix(p[1], q[1], t)];
  const rgba = (c, a) => 'rgba(' + c + ',' + clamp(a).toFixed(3) + ')';

  // Short names only; the full lines stay with screen readers (prologue.js).
  const words = {
    ko: {
      title: '총 8대 · 무인 공정 (Lights-out)', person: '사람 — 입구 · 출구에서만', outside: '외부 AI 서비스',
      gate: ['② 원장 · 관문', '사람의 말 ↔ 에이전트 언어'], watch: ['⑤ 백업 · 모니터링', '지문으로 거슬러 추적'],
      nodes: [['③ 경량 모델', 'Ollama · 청킹 · 요약 · 인덱싱'], ['④ RAG · MAG', 'pgvector · 작업 기억'],
        ['① LLM 추론 · CAG', 'Qwen3.8-Flash-Next'], ['⑦ GPU 연산', '임베딩 · 추론 가속'],
        ['⑥ 테스트 · 검증', '합성 데이터 · 규칙 준수'], ['⑧ Outbound Test PC', '외부 AI 연동 테스트']]
    },
    en: {
      title: 'Eight servers · a lights-out process', person: 'People — only at the entrance and exit', outside: 'Outside AI services',
      gate: ['② Ledger · gate', 'human words ↔ agent language'], watch: ['⑤ Backup · monitoring', 'traces back by fingerprint'],
      nodes: [['③ Light models', 'Ollama · chunk · summarise · index'], ['④ RAG · MAG', 'pgvector · working memory'],
        ['① LLM inference · CAG', 'Qwen3.8-Flash-Next'], ['⑦ GPU compute', 'embedding · inference'],
        ['⑥ Test · verify', 'synthetic data · rules'], ['⑧ Outbound Test PC', 'tests with outside AI']]
    },
    es: {
      title: 'Ocho servidores · un proceso sin personal (lights-out)', person: 'Personas — solo en la entrada y la salida', outside: 'Servicios de IA externos',
      gate: ['② Registro · control', 'palabras ↔ lenguaje de agentes'], watch: ['⑤ Copia · vigilancia', 'rastrea hacia atrás por huella'],
      nodes: [['③ Modelos ligeros', 'Ollama · fragmentar · resumir · indexar'], ['④ RAG · MAG', 'pgvector · memoria de trabajo'],
        ['① Inferencia LLM · CAG', 'Qwen3.8-Flash-Next'], ['⑦ Cálculo GPU', 'embeddings · inferencia'],
        ['⑥ Prueba · verificación', 'datos sintéticos · reglas'], ['⑧ Outbound Test PC', 'pruebas con IA externa']]
    }
  };

  // The circle opens at the bottom: the work leaves ② at the left end and comes back at the right.
  const GAP = 24 * DEG, A0 = Math.PI / 2 + GAP, A1 = Math.PI * 2.5 - GAP;
  const angles = [1, 2, 3, 4, 5, 6].map(k => A0 + (A1 - A0) * k / 7);

  function geo(w, h) {
    const portrait = w / h < .88 || w < 600;
    const px = Math.max(.7, Math.min(1.25, Math.min(w / 1440, h / 900) * (portrait ? 1.5 : 1)));
    const fs = portrait ? 11 : Math.max(12, Math.min(14, w * .0095));
    const top = Math.max(h * .14, fs * 1.36 * 4 + 16), bottom = h - (portrait ? Math.max(h * .2, 84) : h * .19);
    const ry = (bottom - top) / 2 * .92, cy = (top + bottom) / 2;
    const rx = portrait ? Math.min(w * .22, ry * .9) : Math.min(w * .24, ry * 1.5);
    const at = a => [w / 2 + rx * Math.cos(a), cy + ry * Math.sin(a)];
    const gate = [w / 2, cy + ry], person = [w / 2, cy + ry + 34 * px];
    return {portrait, px, fs, cx: w / 2, cy, rx, ry, at, gate, person, gutter: Math.max(12, w * .03)};
  }

  // The path the work takes, in units: person → ② → round the circle (one unit per 45°) → ② → person.
  const arcUnits = (A1 - A0) / (45 * DEG);
  const S = {gateIn: 1, arc0: 2, arc1: 2 + arcUnits, gateOut: 3 + arcUnits, end: 4 + arcUnits};
  const sOf = a => S.arc0 + (a - A0) / (45 * DEG);
  function pathAt(G, s) {
    const gin = [G.gate[0] - 14 * G.px, G.gate[1]], gout = [G.gate[0] + 14 * G.px, G.gate[1]];
    if (s <= S.gateIn) return lerp(G.person, gin, s);
    if (s <= S.arc0) return lerp(gin, G.at(A0), s - S.gateIn);
    if (s <= S.arc1) return G.at(A0 + (s - S.arc0) * 45 * DEG);
    if (s <= S.gateOut) return lerp(G.at(A1), gout, s - S.arc1);
    return lerp(gout, G.person, Math.min(1, s - S.gateOut));
  }
  // When the work is where: keyframes of (time, place), and for each machine the time it is busy.
  const plan = (() => {
    const keys = [[3, 0], [3.35, S.gateIn], [3.75, S.gateIn], [3.9, S.arc0]], busy = [], gateBusy = [[3.35, 3.75]];
    let t = 3.9, s = S.arc0;
    angles.forEach((a, k) => {
      const to = sOf(a), hop = .32 * (to - s);
      t += hop; keys.push([t, to]);
      const stay = k === 5 ? .8 : .3;
      busy.push([t, t + stay]);
      t += stay; keys.push([t, to]); s = to;
    });
    t += .32 * (S.arc1 - s); keys.push([t, S.arc1]);
    t += .15; keys.push([t, S.gateOut]);
    gateBusy.push([t, t + .35]); t += .35; keys.push([t, S.gateOut]);
    t += .35; keys.push([t, S.end]);
    return {keys, busy, gateBusy, done: t};
  })();
  function placeAt(t) {
    const k = plan.keys;
    if (t <= k[0][0]) return k[0][1];
    for (let i = 1; i < k.length; i++) if (t <= k[i][0]) return mix(k[i - 1][1], k[i][1], ease((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0] || 1)));
    return k[k.length - 1][1];
  }
  const timeAt = s => { const k = plan.keys; for (let i = 1; i < k.length; i++) if (s <= k[i][1] && k[i][1] > k[i - 1][1]) return mix(k[i - 1][0], k[i][0], (s - k[i - 1][1]) / (k[i][1] - k[i - 1][1])); return plan.done; };
  // Two record blocks between each pair of stops on the circle; each is stamped as the work passes.
  const stops = [A0, ...angles, A1];
  const blocks = [];
  for (let i = 0; i < stops.length - 1; i++) [1 / 3, 2 / 3].forEach(f => blocks.push(mix(stops[i], stops[i + 1], f)));
  const blockTimes = blocks.map(a => timeAt(sOf(a)));
  const TRACE = [plan.done + .35, plan.done + 1.75];

  function wrap(g, text, maxW) {
    const out = []; let cur = '';
    text.split(' ').forEach(word => {
      const next = cur ? cur + ' ' + word : word;
      if (cur && g.measureText(next).width > maxW) { out.push(cur); cur = word; } else cur = next;
    });
    out.push(cur);
    return out;
  }
  // A name and its tag as a small block of lines; align 'left' or 'right' of x, 'center' on it;
  // v: 'middle' centres the block on y, 'above' ends it at y, 'below' starts it at y.
  function caption(g, G, [name, tag], x, y, align, v, a, maxW) {
    if (a <= .004) return;
    const f = G.fs, lead = f * 1.36;
    g.font = '500 ' + f.toFixed(1) + 'px "Exhibit Label", sans-serif';
    const nameLines = wrap(g, name, maxW);
    g.font = (f * .86).toFixed(1) + 'px "Exhibit Label", sans-serif';
    const tagLines = tag ? wrap(g, tag, maxW) : [];
    const n = nameLines.length + tagLines.length;
    let row = v === 'middle' ? y - (n - 1) * lead / 2 : v === 'above' ? y - (n - 1) * lead : y;
    g.textAlign = align; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(8,14,20,.95)'; g.shadowBlur = 6;
    nameLines.forEach(t => { g.font = '500 ' + f.toFixed(1) + 'px "Exhibit Label", sans-serif'; g.fillStyle = rgba(human, .92 * a); g.fillText(t, x, row); row += lead; });
    tagLines.forEach(t => { g.font = (f * .86).toFixed(1) + 'px "Exhibit Label", sans-serif'; g.fillStyle = rgba(ink, .62 * a); g.fillText(t, x, row); row += lead; });
    g.shadowBlur = 0;
  }
  // One machine: a small box with two slots and a light that comes on while it works.
  function machine(g, G, [x, y], on, done, a, wide = 1) {
    if (a <= .004) return;
    const bw = 28 * G.px * wide, bh = 17 * G.px;
    g.fillStyle = 'rgba(8,14,20,.92)'; g.fillRect(x - bw / 2, y - bh / 2, bw, bh);
    g.strokeStyle = rgba(on > .01 ? mint : ink, (.38 + .5 * Math.max(on, done * .4)) * a); g.lineWidth = 1;
    g.strokeRect(x - bw / 2, y - bh / 2, bw, bh);
    g.strokeStyle = rgba(ink, .3 * a); g.lineWidth = .8;
    [-.18, .18].forEach(f => { g.beginPath(); g.moveTo(x - bw * .36, y + bh * f); g.lineTo(x + bw * .12, y + bh * f); g.stroke(); });
    g.fillStyle = rgba(on > .01 || done ? mint : dim, (.35 + .6 * Math.max(on, done * .5)) * a);
    g.beginPath(); g.arc(x + bw * .32, y, 1.7 * G.px, 0, TAU); g.fill();
    if (on > .01) { g.strokeStyle = rgba(mint, .38 * on * a); g.beginPath(); g.arc(x, y, bw * .9, 0, TAU); g.stroke(); }
  }
  function figure(g, G, [x, y], a) {
    if (a <= .004) return;
    g.strokeStyle = rgba(human, .85 * a); g.fillStyle = rgba(human, .85 * a); g.lineWidth = 1.1;
    g.beginPath(); g.arc(x, y - 6 * G.px, 2.6 * G.px, 0, TAU); g.fill();
    g.beginPath(); g.arc(x, y + 5 * G.px, 6 * G.px, Math.PI * 1.08, Math.PI * 1.92); g.stroke();
  }
  const busyness = (t, [a, b]) => ramp(t, a - .08, a + .06) * (1 - ramp(t, b - .05, b + .12));

  // t: seconds since the lights began to go out. unroll: 0 on the circle, 1 lying on the country's line.
  function draw(g, w, h, t, {locale = 'ko', alpha = 1, unroll = 0, anchors = null, reduced = false} = {}) {
    if (!(w > 0 && h > 0) || alpha <= .004) return;
    const wd = words[locale] || words.ko, G = geo(w, h);
    if (reduced) t = Math.max(t, TRACE[1] + .5);
    const u = anchors ? ease(unroll) : 0, keep = 1 - ramp(u, 0, .35);
    const st = anchors ? anchors.st : null;
    g.save();
    g.globalAlpha *= alpha;
    g.lineCap = 'round'; g.lineJoin = 'round';

    // The one lit place: where people stand, at the opening of the circle.
    const light = ramp(t, 1, 2) * keep;
    if (light > 0) {
      const R = 70 * G.px, glow = g.createRadialGradient(G.person[0], G.person[1], 0, G.person[0], G.person[1], R);
      glow.addColorStop(0, rgba(human, .16 * light)); glow.addColorStop(1, rgba(human, 0));
      g.fillStyle = glow; g.fillRect(G.person[0] - R, G.person[1] - R, R * 2, R * 2);
    }

    // The circle, drawn as one stroke from the gate round to the gate; on unrolling, every point
    // goes to its place on the line between the stations it lay between.
    const drawn = reduced ? 1 : ramp(t, .5, 2.5);
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
      // An enso: one brush stroke, heavier where it begins and lighter where it ends.
      g.strokeStyle = rgba(ink, .05); g.lineWidth = 6 * G.px; g.beginPath();
      for (let i = 0; i <= n; i++) { const p = placeOf(mix(A0, end, i / n)); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }
      g.stroke();
      let prev = placeOf(A0);
      for (let i = 1; i <= n; i++) {
        const f = i / n, a = mix(A0, end, f), p = placeOf(a), along = (a - A0) / (A1 - A0);
        g.strokeStyle = rgba(ink, .62 - .2 * along); g.lineWidth = (2.6 - 1.6 * along) * Math.max(.8, G.px);
        g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(p[0], p[1]); g.stroke(); prev = p;
      }
    }
    const gIn = u ? lerp(G.gate, st[0], u) : G.gate, gOut = u ? lerp(G.gate, st[6], u) : G.gate;
    const pIn = u ? lerp(G.person, anchors.inP, u) : G.person, pOut = u ? lerp(G.person, anchors.outP, u) : G.person;
    const seen = ramp(t, .4, 1.2);
    // Short joins: the gate to the ends of the circle, people to the gate.
    g.strokeStyle = rgba(ink, .4 * seen); g.lineWidth = 1;
    [[gIn, placeOf(A0)], [gOut, placeOf(A1)], [pIn, gIn], [pOut, gOut]].forEach(([p, q]) => { g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); });

    // ⑤ at the centre: it sees every machine; at the end it walks the record back.
    const centre = u ? lerp([G.cx, G.cy], anchors.watcher, u) : [G.cx, G.cy];
    const watchOn = ramp(t, 2.1, 2.8);
    const sweep = mix(A1, A0, ease((t - TRACE[0]) / (TRACE[1] - TRACE[0])));
    const tracing = t >= TRACE[0] && t <= TRACE[1] + .3 && !reduced ? 1 - ramp(t, TRACE[1], TRACE[1] + .3) : 0;
    if (watchOn > 0) {
      const spokes = [G.gate, ...angles.map(a => G.at(a))];
      spokes.forEach((p, i) => {
        const busy = i ? busyness(t, plan.busy[i - 1]) : Math.max(...plan.gateBusy.map(b => busyness(t, b)));
        g.strokeStyle = rgba(busy > .05 ? mint : faint, (busy > .05 ? .55 * busy : .9) * watchOn * keep);
        g.lineWidth = .8; g.setLineDash([2, 4]);
        g.beginPath(); g.moveTo(centre[0], centre[1]); g.lineTo(p[0], p[1]); g.stroke();
      });
      g.setLineDash([]);
      const r = 24 * G.px;
      g.strokeStyle = rgba(ink, .4 * watchOn); g.lineWidth = 1;
      g.beginPath(); g.arc(centre[0], centre[1], r, 0, TAU); g.stroke();
      const look = tracing ? sweep : t * .9;
      g.strokeStyle = rgba(mint, (.45 + .4 * tracing) * watchOn); g.lineWidth = 1.4;
      g.beginPath(); g.arc(centre[0], centre[1], r, look - .35, look + .35); g.stroke();
      machine(g, G, centre, tracing, true, watchOn);
      if (tracing) {
        const p = G.at(sweep);
        g.strokeStyle = rgba(mint, .5 * tracing * keep); g.beginPath(); g.moveTo(centre[0], centre[1]); g.lineTo(p[0], p[1]); g.stroke();
        g.strokeStyle = rgba(mint, .75 * tracing * keep); g.lineWidth = 1.6; g.beginPath();
        for (let i = 0; i <= 40; i++) { const q = G.at(mix(A1, sweep, i / 40)); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); }
        g.stroke(); g.lineWidth = 1;
      }
    }

    // The record blocks along the circle.
    blocks.forEach((a, i) => {
      const shown = ramp(drawn, (a - A0) / (A1 - A0) - .02, (a - A0) / (A1 - A0) + .02) * keep;
      if (shown <= 0) return;
      const p = G.at(a), stamped = reduced ? 1 : ramp(t, blockTimes[i], blockTimes[i] + .15);
      const flash = tracing && a >= sweep && a <= sweep + 10 * DEG ? 1 : 0;
      const b = 3.2 * G.px;
      g.fillStyle = 'rgba(8,14,20,.95)'; g.fillRect(p[0] - b, p[1] - b, b * 2, b * 2);
      g.strokeStyle = rgba(flash ? mint : ink, (.35 + .45 * stamped) * shown); g.lineWidth = .9; g.strokeRect(p[0] - b, p[1] - b, b * 2, b * 2);
      if (stamped > 0) { g.fillStyle = rgba(flash ? mint : ink, (flash ? .9 : .45) * stamped * shown); g.fillRect(p[0] - b * .45, p[1] - b * .45, b * .9, b * .9); }
    });

    // ⑧ reaches out to the AI services outside while it works.
    const n8 = G.at(angles[5]);
    const outside = [Math.min(w - G.gutter - 26 * G.px, n8[0] + 70 * G.px), n8[1] + 44 * G.px];
    const outAt = busyness(t, plan.busy[5]);
    const outSeen = ramp(t, 2.3, 2.9) * keep;
    if (outSeen > 0) {
      [[-9, 0], [0, -5], [9, 1]].forEach(([dx, dy]) => { g.strokeStyle = rgba(ink, .45 * outSeen); g.beginPath(); g.arc(outside[0] + dx * G.px, outside[1] + dy * G.px, 4.5 * G.px, 0, TAU); g.stroke(); });
      g.strokeStyle = rgba(outAt > .05 ? mint : faint, (outAt > .05 ? .7 * outAt : .8) * outSeen); g.setLineDash([3, 4]);
      g.beginPath(); g.moveTo(n8[0], n8[1]); g.lineTo(outside[0] - 12 * G.px, outside[1]); g.stroke(); g.setLineDash([]);
      if (outAt > .05 && !reduced) {
        const [a, b] = plan.busy[5], f = Math.sin(Math.PI * clamp((t - a) / (b - a))), q = lerp(n8, [outside[0] - 12 * G.px, outside[1]], f);
        g.fillStyle = rgba(mint, .9); g.beginPath(); g.arc(q[0], q[1], 2.4 * G.px, 0, TAU); g.fill();
      }
    }

    // The machines: ② at the gate (it splits in two as the circle opens), then the six round it.
    const gateOn = Math.max(...plan.gateBusy.map(b => busyness(t, b)));
    const gateAppear = ramp(t, .4, 1);
    machine(g, G, gIn, gateOn, t > plan.gateBusy[0][1], gateAppear, 1.5);
    if (u > .02) machine(g, G, gOut, 0, true, gateAppear, 1.5);
    angles.forEach((a, k) => {
      const appear = ramp(drawn, (a - A0) / (A1 - A0) - .03, (a - A0) / (A1 - A0) + .03);
      const p = u ? lerp(G.at(a), st[k + 1], u) : G.at(a);
      machine(g, G, p, reduced ? 0 : busyness(t, plan.busy[k]), reduced || t > plan.busy[k][1], appear);
    });
    figure(g, G, pIn, gateAppear * ramp(t, 1, 1.6));
    if (u > .02) figure(g, G, pOut, gateAppear);

    // The work itself, going round.
    if (!reduced && t >= 3 && t <= plan.done + .2 && keep > 0) {
      const s = placeAt(t), p = pathAt(G, s), back = pathAt(G, Math.max(0, s - .35));
      g.strokeStyle = rgba(mint, .35 * keep); g.lineWidth = 1.6; g.beginPath(); g.moveTo(back[0], back[1]); g.lineTo(p[0], p[1]); g.stroke();
      g.fillStyle = rgba(mint, .95 * keep); g.beginPath(); g.arc(p[0], p[1], 3 * G.px, 0, TAU); g.fill();
    }

    // Words: the title above, a name by each machine, people under the gate.
    const words1 = ramp(t, 1.2, 2.2) * keep;
    if (words1 > 0) {
      g.font = (G.fs * (G.portrait ? 1.18 : 1.3)).toFixed(1) + 'px "Exhibit Voice", serif';
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = rgba(human, .92 * ramp(t, 2.2, 2.8) * keep);
      const crown = G.cy - G.ry * .93 - 10 * G.px - 2 * G.fs * 1.36 - G.fs * 1.4;
      wrap(g, wd.title, w - 2 * G.gutter).forEach((line, i, all) => g.fillText(line, w / 2, Math.max(G.fs * 1.4 + (all.length - 1) * G.fs * 1.6, crown) - (all.length - 1 - i) * G.fs * 1.6));
      const gap = 16 * G.px;
      angles.forEach((a, k) => {
        const p = G.at(a), c = Math.cos(a), sN = Math.sin(a), right = c >= 0;
        const appear = ramp(drawn, (a - A0) / (A1 - A0), (a - A0) / (A1 - A0) + .08) * words1;
        const x = p[0] + (right ? gap : -gap), maxW = right ? w - G.gutter - x : x - G.gutter;
        const v = k === 5 ? 'above' : sN < -.55 ? 'above' : 'middle';
        caption(g, G, wd.nodes[k], x, v === 'above' ? p[1] - 10 * G.px : p[1], right ? 'left' : 'right', v, appear, maxW);
      });
      const gx = G.gate[0] + 24 * G.px;
      caption(g, G, wd.gate, gx, G.gate[1], 'left', 'middle', words1, w - G.gutter - gx);
      caption(g, G, wd.watch, G.cx, G.cy + 34 * G.px, 'center', 'below', words1 * watchOn, G.rx * 1.6);
      caption(g, G, [wd.person, ''], G.person[0], G.person[1] + 20 * G.px, 'center', 'below', words1, w - 2 * G.gutter);
      g.font = (G.fs * .86).toFixed(1) + 'px "Exhibit Label", sans-serif'; g.textAlign = 'center'; g.fillStyle = rgba(ink, .62 * outSeen);
      const ow = Math.min(g.measureText(wd.outside).width / 2, w - G.gutter - outside[0]);
      g.fillText(wd.outside, Math.min(outside[0], w - G.gutter - ow), outside[1] + 14 * G.px);
    }
    g.restore();
  }
  window.ServerRing = {draw, length: TRACE[1] + .6, still: TRACE[1] - .2, done: plan.done};
})();
