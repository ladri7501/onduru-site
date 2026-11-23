(() => {
  'use strict';

  const durationMs = 15000;
  const artDuration = 29;
  const starts = [0, 8.8, 17.8];
  const readingEnd = 26.7;
  const dissolveRadius = .77;
  // The source holds alone for just over a second before its interpretation follows.
  const responseDelay = 2.05;
  const responseFade = 1.22;
  const copy = {
    ko: {
      region: '우주에서 온두루의 작업실까지',
      source: '유네스코 헌장 서문',
      url: 'https://www.unesco.or.kr/wp-content/uploads/2024/07/유네스코-헌장국문.pdf#page=1',
      excerpts: [
        '“서로를 이해하고 서로의 생활을 더욱 진실하고 더욱 완전하게 알도록”',
        '“인간의 존엄, 평등, 상호존중”',
        '“인류의 지적ㆍ도덕적 연대”'
      ],
      passages: [
        ['사람과 사람', '당신이 어떻게 살아왔는지 듣습니다.\n서로를 알아가며 무지와 편견이 낳은 불신을 걷어 냅니다.'],
        ['사람과 에이전트', '입구에서 나는 무엇을 맡길지 정합니다.\n에이전트는 사람의 존엄을 지키며 스스로 판단하고 배웁니다.'],
        ['에이전트와 에이전트', '서로 다른 회사의 에이전트들이 판단의 근거를 나눕니다.\n함께 일하는 기준은 인류의 지적·도덕적 연대입니다.']
      ]
    },
    en: {
      region: 'From the stars to the ONDURU studio',
      source: 'UNESCO Constitution, Preamble',
      url: 'https://www.unesco.org/en/legal-affairs/constitution',
      excerpts: [
        '“a truer and more perfect knowledge of each other’s lives”',
        '“the dignity, equality and mutual respect of men”',
        '“intellectual and moral solidarity of mankind”'
      ],
      passages: [
        ['Person and person', 'I listen to the story of your life.\nAs we come to know each other, the mistrust born of ignorance and prejudice begins to lift.'],
        ['Person and agent', 'At the entrance, I decide what to entrust to the agents.\nThey use their own judgment and learn, guided by respect for human dignity.'],
        ['Agent and agent', 'Agents from different companies share the grounds for their judgments.\nTheir work rests on intellectual and moral solidarity among people.']
      ]
    },
    es: {
      region: 'De las estrellas al estudio de ONDURU',
      source: 'Preámbulo de la Constitución de la UNESCO',
      url: 'https://www.unesco.org/es/legal-affairs/constitution',
      excerpts: [
        '«un conocimiento más preciso y verdadero de sus respectivas vidas»',
        '«la dignidad, la igualdad y el respeto mutuo»',
        '«solidaridad intelectual y moral de la humanidad»'
      ],
      passages: [
        ['Entre personas', 'Escucho la historia de tu vida.\nAl conocernos, se disipa la desconfianza que nace de la ignorancia y los prejuicios.'],
        ['Persona y agente', 'A la entrada, decido qué tarea confiar a los agentes.\nEllos juzgan y aprenden por sí mismos, con respeto por la dignidad humana.'],
        ['Entre agentes', 'Agentes de distintas empresas comparten las razones de sus decisiones.\nLa solidaridad intelectual y moral entre las personas guía su trabajo.']
      ]
    }
  };

  function fade(t, start, end) {
    const u = Math.max(0, Math.min(1, (t - start) / (end - start)));
    return u * u * (3 - 2 * u);
  }

  function mount(host, {getFilmOrigin, onFinish} = {}) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const veil = document.createElement('div');
    veil.className = 'return-veil';
    veil.setAttribute('aria-hidden', 'true');

    const captions = document.createElement('div');
    captions.className = 'return-passages';
    const cards = starts.map(() => {
      const card = document.createElement('div');
      card.className = 'return-caption';
      const relation = document.createElement('span');
      const lines = document.createElement('p');
      const source = document.createElement('figure');
      const excerpt = document.createElement('blockquote');
      const credit = document.createElement('figcaption');
      source.className = 'return-source';
      source.append(excerpt, credit);
      const response = document.createElement('div');
      response.className = 'return-response';
      response.append(relation, lines);
      card.append(source, response);
      captions.append(card);
      return {card, response, relation, lines, excerpt, credit};
    });
    // Announce the quotation and its interpretation in the same order in which they appear.
    const spoken = document.createElement('div');
    spoken.className = 'sr';
    spoken.setAttribute('role', 'status');
    spoken.setAttribute('aria-live', 'polite');
    spoken.setAttribute('aria-atomic', 'true');
    host.replaceChildren(canvas, veil, captions, spoken);

    const ctx = canvas.getContext('2d');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let locale = 'ko', active = false, paused = false;
    let elapsed = 0, last = null, frame = 0, announcement = '', stillKey = '';

    function draw(scene) {
      if (!ctx) return;
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const key = motion.matches ? [scene, w, h, dpr].join('/') : '';
      if (key && key === stillKey) return;
      stillKey = key;
      const width = Math.max(1, Math.round(w * dpr));
      const height = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (scene < 14) {
        ctx.save();
        window.ReturnSky.draw(ctx, w, h, scene);
        ctx.restore();
      }
      if (scene >= 12) {
        ctx.save();
        // Project into the visible film canvas so the returning point meets the first thread.
        const origin = scene >= 25 ? getFilmOrigin?.(scene < 28.5 ? 0 : 1) : null;
        const bounds = origin && canvas.getBoundingClientRect();
        const target = origin && {x: origin.x - bounds.left, y: origin.y - bounds.top};
        window.ReturnStudio.draw(ctx, w, h, scene, {target, reduced: motion.matches});
        ctx.restore();
      }
    }

    // Reduced motion uses stills from the same journey, with the same reading time.
    const stills = [[0, 1.2], [3.4, 4.6], [6.8, 7.8], [10, 11.4],
      [14, 16.4], [17.5, 19.4], [21.1, 22], [23.4, 24.6], [26.1, 26.2], [27.2, 29]];
    function paint() {
      const t = artDuration * elapsed / durationMs;
      const index = starts.findLastIndex(start => t >= start);
      const hasResponse = t >= starts[index] + responseDelay;
      const cue = index + (hasResponse ? '/response' : '/quote');
      if (cue !== announcement) {
        announcement = cue;
        const local = copy[locale];
        const [relation, lines] = local.passages[index];
        spoken.textContent = hasResponse ? [`${index + 1}. ${relation}`, lines].join(' ')
          : [local.excerpts[index], local.source].join(' ');
        cards.forEach(({card, response}, i) => {
          card.setAttribute('aria-hidden', String(i !== index));
          response.setAttribute('aria-hidden', String(i !== index || !hasResponse));
        });
      }
      // The quotation sits still as the author's thought emerges below it.
      cards.forEach(({card, response}, i) => {
        const start = starts[i], next = starts[i + 1];
        const entered = i === 0 ? 1 : fade(t, start - dissolveRadius, start + dissolveRadius);
        const departed = next === undefined ? fade(t, readingEnd - 1.55, readingEnd)
          : fade(t, next - dissolveRadius, next + dissolveRadius);
        const lead = start + responseDelay;
        const join = motion.matches ? Number(t >= lead) : fade(t, lead, lead + responseFade);
        const release = next === undefined || motion.matches ? 0 : fade(t, next - 1.35, next - .2);
        card.style.opacity = String(motion.matches ? Number(i === index && t < readingEnd) : entered * (1 - departed));
        response.style.opacity = String(join * (1 - release));
      });
      veil.style.opacity = String(1 - fade(t, readingEnd, 28));
      draw(motion.matches ? stills.findLast(([start]) => t >= start)[1] : t);
    }

    function tick(now) {
      frame = 0;
      if (!active || paused || document.hidden) return;
      if (last !== null) elapsed += Math.max(0, now - last);
      last = now;
      if (elapsed >= durationMs) {
        elapsed = durationMs;
        paint();
        finish();
        return;
      }
      paint();
      frame = requestAnimationFrame(tick);
    }
    function cancel() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      last = null;
    }
    function schedule() {
      if (active && !paused && !document.hidden && !frame) frame = requestAnimationFrame(tick);
    }
    function setLocale(next) {
      locale = Object.hasOwn(copy, next) ? next : 'ko';
      const local = copy[locale];
      cards.forEach(({relation, lines, excerpt, credit}, i) => {
        const [heading, body] = local.passages[i];
        relation.textContent = `${i + 1}. ${heading}`;
        lines.textContent = body;
        excerpt.textContent = local.excerpts[i];
        excerpt.setAttribute('cite', local.url);
        credit.textContent = local.source;
      });
      host.lang = locale;
      host.setAttribute('aria-label', copy[locale].region);
      announcement = '';
      if (active) paint();
    }
    function play(next = locale) {
      cancel();
      active = true;
      paused = false;
      elapsed = 0;
      stillKey = '';
      host.hidden = false;
      setLocale(next);
      schedule();
    }
    function finish() {
      if (!active) return;
      active = false;
      paused = false;
      cancel();
      host.hidden = true;
      onFinish?.();
    }
    function setPaused(value) {
      if (!active || paused === Boolean(value)) return;
      paused = Boolean(value);
      cancel();
      schedule();
    }
    document.addEventListener('visibilitychange', () => { cancel(); schedule(); });
    window.addEventListener('resize', () => { if (active) paint(); });
    motion.addEventListener?.('change', () => { if (active) paint(); });
    setLocale('ko');
    return {play, setLocale, finish, setPaused, isOpen: () => active, isPaused: () => paused};
  }
  window.Prologue = {mount, sourceUrl:locale=>(copy[locale] || copy.ko).url};
})();
