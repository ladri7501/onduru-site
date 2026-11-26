/* The close: from Seoul out to Korea and to the whole globe. From Korea, lines go out to
   nations across the world; each lights where it arrives, and the nations join one another
   into one shared network — the territory of multi-party agents, shared with many countries.
   Drawn over the opening's own globe, with dots and lines only; no city is named. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const ramp = (t, a, b) => ease((t - a) / (b - a));
  const rgba = (c, a) => 'rgba(' + c + ',' + clamp(a).toFixed(3) + ')';
  const teal = '147,214,196', ink = '230,227,219';

  // Capitals and large cities across every continent, as [longitude, latitude].
  const places = [[139.7, 35.7], [116.4, 39.9], [106.9, 47.9], [105.8, 21], [100.5, 13.8], [106.8, -6.2],
    [121, 14.6], [103.8, 1.35], [77.2, 28.6], [90.4, 23.8], [73, 33.7], [85.3, 27.7], [71.4, 51.2],
    [149.1, -35.3], [174.8, -41.3], [147.2, -9.4], [178.4, -18.1], [-157.8, 21.3], [-149.9, 61.2],
    [46.7, 24.7], [51.4, 35.7], [37.6, 55.8], [36.8, -1.3], [31.2, 30], [28, -26.2], [18.4, -33.9],
    [2.35, 48.9], [13.4, 52.5], [-0.1, 51.5], [12.5, 41.9], [-77, 38.9], [-75.7, 45.4], [-99.1, 19.4],
    [-47.9, -15.8], [-70.6, -33.4], [-58.4, -34.6]];

  let mesh = null;
  function neighbours(project) {
    if (mesh) return mesh;
    const v = places.map(([lon, lat]) => project(lon, lat));
    const links = [];
    v.forEach((a, i) => {
      v.map((b, j) => [a[0] * b[0] + a[1] * b[1] + a[2] * b[2], j]).filter(([, j]) => j !== i)
        .sort((x, y) => y[0] - x[0]).slice(0, 2)
        .forEach(([, j]) => { if (!links.some(([p, q]) => (p === j && q === i))) links.push([i, j]); });
    });
    mesh = {v, links};
    return mesh;
  }
  const slerp = (a, b, u) => {
    const d = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), ang = Math.acos(d);
    if (ang < 1e-4) return a.slice();
    const p = Math.sin((1 - u) * ang) / Math.sin(ang), q = Math.sin(u * ang) / Math.sin(ang);
    return [p * a[0] + q * b[0], p * a[1] + q * b[1], p * a[2] + q * b[2]];
  };

  // t: seconds since the spreading began; scene: the globe's moment on the opening's clock.
  function draw(g, w, h, t, scene, {alpha = 1} = {}) {
    const sky = window.ReturnSky;
    if (!sky?.globeAt || alpha <= 0) return;
    const G = sky.globeAt(w, h, scene), K = G.korea, M = neighbours(G.project);
    const S = (v, lift = 0) => [G.cx + v[0] * G.radius * (1 + lift), G.cy + v[1] * G.radius * (1 + lift)];
    const small = Math.max(.7, Math.min(1.25, Math.min(w, h) / 820));
    const dot = (x, y, r, c, a) => { if (a <= .004) return; g.fillStyle = rgba(c, a); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };
    g.save();
    g.globalAlpha = alpha;

    // Rings going out from Korea, one after another.
    const [kx, ky] = S(K);
    for (let k = 0; k < 4; k++) {
      const f = ((t - k * .6) % 2.4) / 2.4;
      if (t < k * .6) continue;
      g.strokeStyle = rgba(teal, .55 * (1 - f)); g.lineWidth = 1;
      g.beginPath(); g.arc(kx, ky, (4 + f * 46) * small, 0, TAU); g.stroke();
    }

    // The lines out to every place, lifted a little above the surface as they fly.
    M.v.forEach((v, i) => {
      const start = .4 + i * .065, p = ramp(t, start, start + 1.7);
      if (p <= 0) return;
      const ang = Math.acos(Math.max(-1, Math.min(1, K[0] * v[0] + K[1] * v[1] + K[2] * v[2])));
      const height = .1 * Math.min(1, ang / .9);
      const n = 36;
      for (let s = 0; s <= n; s++) {
        const u = s / n;
        if (u > p) break;
        const q = slerp(K, v, u);
        if (q[2] < -.04) continue;
        const [x, y] = S(q, height * Math.sin(Math.PI * u));
        dot(x, y, .95 * small, teal, (p < 1 ? .75 : .32) * (.5 + .5 * clamp(q[2] * 4 + .4)));
      }
      const head = slerp(K, v, p);
      if (p < 1 && head[2] > -.04) { const [x, y] = S(head, height * Math.sin(Math.PI * p)); dot(x, y, 2.2 * small, teal, 1); }
      if (p >= 1 && v[2] > 0) {
        const bloom = ramp(t, start + 1.7, start + 2.3), [x, y] = S(v);
        dot(x, y, 2.1 * small, ink, .95);
        g.strokeStyle = rgba(teal, .7 * bloom); g.lineWidth = 1;
        g.beginPath(); g.arc(x, y, (2 + 5 * bloom) * small, 0, TAU); g.stroke();
      }
    });

    // The nations joined to one another: one shared network, not lines from a centre alone.
    const join = ramp(t, 3.4, 5);
    if (join > 0) M.links.forEach(([i, j]) => {
      const a = M.v[i], b = M.v[j];
      g.strokeStyle = rgba(teal, .45 * join); g.lineWidth = .8; g.beginPath();
      let pen = false;
      for (let s = 0; s <= 20; s++) {
        const q = slerp(a, b, s / 20 * join);
        if (q[2] <= 0) { pen = false; continue; }
        const [x, y] = S(q);
        pen ? g.lineTo(x, y) : g.moveTo(x, y);
        pen = true;
      }
      g.stroke();
    });
    dot(kx, ky, 3 * small, ink, 1);
    g.restore();
  }
  window.WorldShare = {draw};
})();
