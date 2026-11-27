(() => {
  'use strict';

  // Between the country and the way back out: the real screens of a product that was built and
  // run on synthetic data, one after another on the studio's main monitor (On, 2026-11-27 19:22 —
  // "this is a product I made, and I am showing it"). The pictures are the pages as they were
  // (side window 「로컬 거버넌스 요구사항 설계」, reply v0.1, ten files checked by sha256); nothing
  // on them is redrawn. Each comes in whole; then the eye is brought close to the place where the
  // work happened, and that place lights up. A short name above; below, what these screens are.
  const here = document.currentScript && document.currentScript.src ? new URL('.', document.currentScript.src).href : '/when-work-arrives/';
  const V = '2026112712';
  const W = 3200, H = 1800, A = W / H;
  const mint = '145,211,193', ink = '205,201,188', paper = '8,14,20';
  const said = (ko, en, es) => ({ko, en, es});
  // In the product's own order. Boxes are in the pictures' pixels, measured by the side window.
  const shots = [
    {files: ['s01'], box: [1034, 216, 846, 190], name: said('말로 의뢰', 'A request, in words', 'Una petición, en palabras')},
    {files: ['s02'], box: [1060, 1010, 794, 385], name: said('설계서 응찰', 'A design, as a bid', 'Un diseño como oferta')},
    {files: ['s03'], box: [1970, 242, 1138, 119], name: said('사람이 낙찰', 'A person chooses', 'Una persona elige')},
    {files: ['s04'], box: [1970, 686, 1138, 432], name: said('설계서와 지문', 'The design and its fingerprints', 'El diseño y sus huellas')},
    // Where the box runs the whole width, a phone looks at its beginning, where the words are.
    {files: ['s05'], box: [476, 133, 2688, 181], near: [476, 120, 1420, 200], name: said('법인 마감', 'A company closes its month', 'Una empresa cierra su mes')},
    // Before and after the last company closed the month, at the same place: the card becomes v2
    // by itself and shows what changed.
    {files: ['pair-a', 'pair-b'], box: [1970, 353, 1138, 378], also: [3020, 242, 88, 73], view: [1960, 200, 1170, 560],
      name: said('스스로 새 판', 'A new version, by itself', 'Una versión nueva, por sí sola')},
    {files: ['s06'], box: [1970, 1596, 1138, 136], name: said('판 이력', 'Its versions', 'Sus versiones')},
    {files: ['s07'], box: [476, 120, 2688, 103], near: [476, 120, 820, 103], name: said('끊김 없는 사슬', 'An unbroken chain', 'Una cadena sin cortes')},
    {files: ['s08'], box: [758, 379, 228, 86], name: said('같은 숫자', 'The same number', 'El mismo número')}
  ];
  const caption = said('실제 화면 · 합성 데이터 · 실험 환경', 'Real screens · synthetic data · a test environment',
    'Pantallas reales · datos sintéticos · un entorno de prueba');
  // On's line, as the side window wrote it for him (reply v0.1); English and Spanish by this window.
  const line = said('에이전트는 설계서를, 엔진은 숫자를, 나는 선택을 — 지어 돌렸습니다',
    'Agents write the design, the engine counts, I choose — built, and running',
    'Los agentes escriben el diseño, el motor cuenta, yo elijo: construido y en marcha');

  // Time: a moment for the monitor, then each screen, then the line.
  const LEAD = .2, ONE = 1.8, PAIR = 2.6, LINE = 1.9;
  let at = LEAD;
  const plan = shots.map(s => {
    const dur = s.files.length > 1 ? PAIR : ONE;
    const p = {...s, t0: at, dur};
    at += dur;
    return p;
  });
  const lineAt = at, length = at + LINE;

  const clamp = v => Math.max(0, Math.min(1, v));
  const mix = (a, b, u) => a + (b - a) * u;
  function fade(t, a, b) { const u = clamp((t - a) / (b - a)); return u * u * (3 - 2 * u); }
  const rgba = (c, a) => 'rgba(' + c + ',' + a + ')';

  // The pictures are asked for when the country begins; whoever is waiting hears when each arrives.
  const images = {};
  let asked = false, onReady = null;
  function load(ready) {
    if (ready) onReady = ready;
    if (asked) return;
    asked = true;
    shots.flatMap(s => s.files).forEach(f => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { img.ready = true; onReady?.(); };
      img.src = (window.RealScreensSrc && window.RealScreensSrc[f]) || here + 'real/' + f + '.webp?v=' + V;
      images[f] = img;
    });
  }
  const loaded = () => Object.values(images).filter(img => img.ready).length;

  // On paper the whole work is turned over by a CSS filter (invert, then hue-rotate). The screens
  // are turned over once more here, so they show as they were: with the canvas filter where the
  // browser draws it, otherwise with a copy turned pixel by pixel (a little smaller).
  let canFilter = null;
  function filterWorks() {
    if (canFilter !== null) return canFilter;
    try {
      const c = document.createElement('canvas'); c.width = c.height = 1;
      const x = c.getContext('2d', {willReadFrequently: true});
      x.fillStyle = '#fff'; x.fillRect(0, 0, 1, 1);
      x.filter = 'invert(1)';
      x.drawImage(c, 0, 0);
      canFilter = typeof x.filter === 'string' && x.getImageData(0, 0, 1, 1).data[0] < 128;
    } catch (e) { canFilter = false; }
    return canFilter;
  }
  const turnedCopies = new Map();
  function turnedCopy(f) {
    if (turnedCopies.has(f)) return turnedCopies.get(f);
    const img = images[f], w = 2000, h = 1125;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d', {willReadFrequently: true});
    x.drawImage(img, 0, 0, w, h);
    const d = x.getImageData(0, 0, w, h), p = d.data;
    const k = v => v < 0 ? 0 : v > 255 ? 255 : v;
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i], g = p[i + 1], b = p[i + 2];
      p[i] = 255 - k(-.574 * r + 1.43 * g + .144 * b);
      p[i + 1] = 255 - k(.426 * r + .43 * g + .144 * b);
      p[i + 2] = 255 - k(.426 * r + 1.43 * g - .856 * b);
    }
    x.putImageData(d, 0, 0);
    if (turnedCopies.size >= 3) turnedCopies.delete(turnedCopies.keys().next().value);
    turnedCopies.set(f, c);
    return c;
  }

  // The part of the picture in view: all of it, or the part around the box at the picture's shape.
  // On a phone the monitor is narrow, so the eye may come closer.
  function viewOf(p, z, zmax) {
    const [bx, by, bw, bh] = (zmax > 3 && p.near) || p.view || p.box;
    const tw = Math.min(W, Math.max(bw / .86, bh * A / .8, W / zmax)), th = tw / A;
    const tx = Math.max(0, Math.min(W - tw, bx + bw / 2 - tw / 2)), ty = Math.max(0, Math.min(H - th, by + bh / 2 - th / 2));
    const vw = Math.exp(mix(Math.log(W), Math.log(tw), z));
    const u = (W - vw) / Math.max(1, W - tw);
    return [mix(0, tx, u), mix(0, ty, u), vw, vw / A];
  }

  const shotAt = t => t >= lineAt ? plan.length : Math.max(0, plan.findLastIndex(p => t >= p.t0));

  function picture(g, f, view, R, alpha, turned) {
    const img = images[f];
    if (!img || !img.ready || alpha <= 0) return false;
    let src = img, s = img.naturalWidth / W;
    g.save();
    g.globalAlpha *= alpha;
    if (turned) {
      if (filterWorks()) g.filter = 'hue-rotate(180deg) invert(1)';
      else { src = turnedCopy(f); s = src.width / W; }
    }
    g.imageSmoothingQuality = 'high';
    g.drawImage(src, view[0] * s, view[1] * s, view[2] * s, view[3] * s, R.x, R.y, R.w, R.h);
    g.restore();
    return true;
  }
  // The place where the work happened: the rest of the screen dims a little, the place is outlined.
  function light(g, boxes, view, R, amount, turned) {
    if (amount <= 0) return;
    const at = ([x, y, w, h]) => [R.x + (x - view[0]) / view[2] * R.w, R.y + (y - view[1]) / view[3] * R.h, w / view[2] * R.w, h / view[3] * R.h];
    const rects = boxes.map(at);
    g.save();
    g.beginPath(); g.rect(R.x, R.y, R.w, R.h); g.clip();
    g.beginPath(); g.rect(R.x, R.y, R.w, R.h);
    rects.forEach(([x, y, w, h]) => g.rect(x - 3, y - 3, w + 6, h + 6));
    // (On paper the dimming is turned over with the screens, so it still darkens them.)
    g.fillStyle = rgba(turned ? '247,241,235' : paper, .42 * amount);
    g.fill('evenodd');
    g.shadowColor = rgba(mint, .7 * amount); g.shadowBlur = 14;
    g.strokeStyle = rgba(mint, .92 * amount); g.lineWidth = 1.6;
    rects.forEach(([x, y, w, h]) => {
      g.beginPath();
      if (g.roundRect) g.roundRect(x - 3, y - 3, w + 6, h + 6, 5); else g.rect(x - 3, y - 3, w + 6, h + 6);
      g.stroke();
    });
    g.restore();
  }
  // One screen at its own moment u: in whole, then closer, then lit.
  function shot(g, p, u, R, alpha, reduced, turned, zmax) {
    if (p.files.length > 1) {
      const z = reduced ? 1 : fade(u, .35, 1), view = viewOf(p, z, zmax), after = reduced ? 1 : fade(u, 1.05, 1.45);
      picture(g, p.files[0], view, R, alpha * (1 - after), turned);
      if (after > 0) picture(g, p.files[1], view, R, alpha * after, turned);
      light(g, [p.box, p.also], view, R, alpha * (reduced ? 1 : fade(u, 1.5, 1.8)), turned);
      return;
    }
    const z = reduced ? 1 : fade(u, .35, 1), view = viewOf(p, z, zmax);
    if (picture(g, p.files[0], view, R, alpha, turned)) light(g, [(zmax > 3 && p.near) || p.box], view, R, alpha * (reduced ? 1 : fade(u, .85, 1.1)), turned);
  }

  function wrap(g, text, max) {
    const words = text.split(' '), out = [];
    let row = '';
    for (const word of words) {
      const next = row ? row + ' ' + word : word;
      if (row && g.measureText(next).width > max) { out.push(row); row = word; } else row = next;
    }
    if (row) out.push(row);
    return out;
  }

  function draw(g, w, h, t, o) {
    const S = o && o.screen;
    if (!S || t < 0) return;
    const locale = Object.hasOwn(caption, o.locale) ? o.locale : 'ko', reduced = Boolean(o.reduced);
    const k = Math.min(plan.length - 1, shotAt(t)), p = plan[k], u = t - p.t0;
    const leave = reduced ? Number(t < length + .8) : 1 - fade(t, length + .2, length + 1.4);
    if (leave <= 0) return;
    // The glass, inside the monitor's frame; the screens keep their own shape within it.
    const inset = S.pen / 2 + 1, G = {x: S.x + inset, y: S.y + inset, w: S.w - 2 * inset, h: S.h - 2 * inset};
    const R = G.w / G.h > A ? {w: G.h * A, h: G.h} : {w: G.w, h: G.w / A};
    R.x = G.x + (G.w - R.w) / 2; R.y = G.y + (G.h - R.h) / 2;
    const first = reduced ? 1 : fade(t, plan[0].t0, plan[0].t0 + .35);
    g.save();
    g.beginPath(); g.rect(G.x, G.y, G.w, G.h); g.clip();
    g.globalAlpha = leave * first;
    g.fillStyle = 'rgb(' + paper + ')'; g.fillRect(G.x, G.y, G.w, G.h);
    g.globalAlpha = leave;
    const come = reduced || k === 0 ? 1 : fade(u, 0, .35);
    const zmax = w / h < .88 ? 4.5 : 3;
    if (come < 1) shot(g, plan[k - 1], plan[k - 1].dur, R, 1, reduced, o.turned, zmax);
    shot(g, p, u, R, k === 0 ? first : come, reduced, o.turned, zmax);
    g.restore();

    // Words: the screen's short name above, then On's line in its place; below, what these are.
    const fs = Math.max(12, Math.min(15.5, w * .0105));
    const spaceAbove = S.y, top = spaceAbove > fs * 2.6;
    g.save();
    g.textAlign = 'center';
    const words = reduced ? Number(t < lineAt) : fade(t, 0, .35) * (1 - fade(t, lineAt - .15, lineAt + .15));
    if (words > 0) {
      const name = p.name[locale];
      g.font = '500 ' + fs.toFixed(1) + 'px "Exhibit Label", sans-serif';
      const y = top ? S.y - fs * .9 : S.y + S.h + fs * 1.6;
      const swap = reduced || k === 0 ? 1 : fade(u, 0, .3);
      g.fillStyle = rgba(mint, .95 * words * swap * leave);
      g.fillText(name, S.x + S.w / 2, y);
      const wd = g.measureText(name).width;
      g.fillRect(S.x + S.w / 2 - wd / 2, y + fs * .28, wd, Math.max(1, fs * .07));
    }
    const said = reduced ? Number(t >= lineAt) : fade(t, lineAt, lineAt + .3) * (1 - fade(t, length - .1, length + .35));
    const ns = Math.max(10.5, fs * .82);
    let below = S.y + S.h + ns * 1.9;
    if (said > 0) {
      // Above the monitor where there is room, smaller if need be; otherwise below it, on a little
      // of the dark, and the note goes lower still.
      const max = w * .9, base = Math.max(16, Math.min(26, w * .019));
      let size = base, rows = [], over = false;
      for (; size >= 14; size -= 1) {
        g.font = '400 ' + size.toFixed(1) + 'px "Exhibit Voice", serif';
        rows = wrap(g, line[locale], max);
        if (rows.length <= 2 && spaceAbove > rows.length * size * 1.45 + size * .9) { over = true; break; }
      }
      if (!over) {
        size = Math.max(15, base - 4);
        g.font = '400 ' + size.toFixed(1) + 'px "Exhibit Voice", serif';
        rows = wrap(g, line[locale], max);
      }
      const lh = size * 1.45;
      const y0 = over ? S.y - size * .75 - (rows.length - 1) * lh : S.y + S.h + size * 1.5;
      if (!over) {
        below = y0 + (rows.length - 1) * lh + ns * 2.2;
        const bw = Math.max(...rows.map(r => g.measureText(r).width));
        g.fillStyle = 'rgba(' + paper + ',' + (.9 * said * leave) + ')';
        g.fillRect(S.x + S.w / 2 - bw / 2 - 10, y0 - size * 1.1, bw + 20, (rows.length - 1) * lh + size * 1.6);
      }
      g.fillStyle = rgba(ink, .96 * said * leave);
      rows.forEach((row, i) => g.fillText(row, S.x + S.w / 2, y0 + i * lh));
    }
    // The note sits at the monitor's right edge, clear of its stand.
    const note = reduced ? 1 : fade(t, .1, .6) * (1 - fade(t, length - .1, length + .4));
    if (note > 0) {
      g.font = '300 ' + ns.toFixed(1) + 'px "Exhibit Label", sans-serif';
      g.fillStyle = rgba(ink, .62 * note * leave);
      const nw = g.measureText(caption[locale]).width, right = nw < S.w * .44;
      const x = right ? S.x + S.w : S.x + S.w / 2, left = right ? x - nw : x - nw / 2;
      // A little of the dark behind it, so the monitor's stand does not run through the words.
      g.fillStyle = 'rgba(' + paper + ',' + (.94 * note * leave) + ')';
      g.fillRect(left - 6, below - ns * 1.05, nw + 12, ns * 1.5);
      g.textAlign = right ? 'right' : 'center';
      g.fillStyle = rgba(ink, .62 * note * leave);
      g.fillText(caption[locale], x, below);
    }
    g.restore();
  }

  // What a screen reader hears for each screen, and for the line.
  const say = (k, locale) => {
    const l = Object.hasOwn(caption, locale) ? locale : 'ko';
    if (k >= plan.length) return line[l];
    return (k === 0 ? caption[l] + ' — ' : '') + plan[k].name[l];
  };
  // For pages: where each screen begins, and the moment it is fully shown and lit (for the last,
  // the moment On's line is there too).
  const pages = plan.map((p, i) => [p.t0, i === plan.length - 1 ? lineAt + 1.1 : p.t0 + p.dur - .1]);
  const keyAt = t => t < 0 || t > length + 1.6 ? '' : 'r' + shotAt(t) + ':' + loaded();

  window.RealScreens = {length, lineAt, pages, load, loaded, draw, shotAt, say, keyAt};
})();
