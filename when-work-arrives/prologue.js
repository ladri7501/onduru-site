(() => {
  'use strict';

  // Four sections of two seconds, each carrying one part of the journey on the drawing's
  // own clock: space and its orbits; the orbits drawing near to Earth; the globe appearing;
  // the map of East Asia and the peninsula filling the screen. From two to eight seconds the
  // points are set every quarter second so the picture flies on at an even pace.
  // From eight to twelve seconds: down to the studio, through the door, into the PC (the
  // main monitor). Where the drawing holds still the clock passes quickly.
  const sections = [[0, 0],
    [2, 4], [2.25, 4.335], [2.5, 4.635], [2.75, 4.925], [3, 5.215], [3.25, 5.51],
    [3.5, 5.83], [3.75, 6.195], [4, 6.63], [4.25, 7.13], [4.5, 7.465], [4.75, 7.72],
    [5, 7.95], [5.25, 8.17], [5.5, 8.4], [5.75, 8.625], [6, 8.855], [6.25, 9.1],
    [6.5, 9.35], [6.75, 9.61], [7, 9.875], [7.25, 10.14], [7.5, 10.43], [7.75, 10.73],
    [8, 11], [8.95, 13.7], [9.1, 16], [10, 19], [10.1, 20], [11.4, 22.4]];
  const sceneAt = monotone(sections);
  // Inside the PC, the country: eight stations of three seconds each, from twelve seconds.
  const flowStart = 12;
  const flowStages = 8;
  const stageSec = 3;
  const flowEnd = flowStart + flowStages * stageSec;
  // When the studio's PCs come into view the drawing's story waits while the clock runs on: the
  // lights go out and the eight servers are drawn as they are set up (server-ring.js, On
  // 2026-11-27 — a picture of the configuration, not an explanation). The circle then opens and
  // lies down as the country's line, so the story resumes past the old zoom into the monitor.
  const holdAt = 10.05;
  const holdSec = 13.4;
  const resumeAt = 11.3;
  const story = c => c < holdAt ? c : c < holdAt + holdSec ? holdAt : resumeAt + c - holdAt - holdSec;
  const clockOf = s => s <= holdAt ? s : holdAt + holdSec + s - resumeAt;
  const ringStill = 6.2, ringUnroll = [holdSec - 1.8, holdSec - .2];
  // Then back out the way the journey came in, the opening run in reverse: the country shrinks
  // back into the monitor; the studio; Seoul's streets; Korea; the whole globe. From Korea, lines
  // go out to the nations and join them into one network. One line; there it stays: the last
  // page remains on screen until the visitor goes elsewhere (On, 2026-11-27).
  const spreadStart = flowEnd + 4.6;
  const finalStart = flowEnd + 8.4;
  const closeEnd = flowEnd + 13;
  const storyEnd = flowEnd + 10;
  const durationMs = clockOf(storyEnd) * 1000;
  // Pages, on the clock: where each begins when playing, and the still it shows when turned to
  // while paused. PageDown or a click moves to the next; the last page has no next.
  const pages = [[0, .6], [2, 2.6], [4, 4.6], [6, 6.6], [8, holdAt + ringStill]];
  pages.push([holdAt + ringUnroll[0], clockOf(flowStart + 2.4)]);
  for (let i = 1; i < flowStages; i++) pages.push([clockOf(flowStart + i * stageSec), clockOf(flowStart + i * stageSec + 2.4)]);
  pages.push([clockOf(flowEnd), clockOf(storyEnd)]);
  const way = [[flowEnd, 22.4], [flowEnd + 1, 22.4], [flowEnd + 2.3, 20], [flowEnd + 2.4, 19], [flowEnd + 3.3, 16],
    [flowEnd + 3.45, 13.7], [flowEnd + 4.4, 11]];
  const backWide = monotone([...way, [flowEnd + 6.4, 8.6], [flowEnd + 8.4, 7.5], [closeEnd + 1, 7.42]]);
  const backTall = monotone([...way, [flowEnd + 6.4, 8.9], [flowEnd + 8.4, 7.87], [closeEnd + 1, 7.75]]);
  // Four passages, one in each of the first four sections: the three phrases, then their source.
  // Each fades in and out within its two seconds.
  const starts = [0, 2, 4, 6];
  const ends = [2, 4, 6, 8];
  const arrival = .45;
  const departure = .5;
  const copy = {
    ko: {
      region: '우주에서 온두루의 작업실까지',
      servers: {
        title: '총 8대 — 무인 공정(Lights-\u2060out): 사람은 입구 · 출구에서만 확인',
        items: [
          ['[입구]', '② 원장 · 관문 서버', '작업 접수 · 입구 검증, 사람의 말 → 에이전트 언어 번역'],
          ['[전처리]', '③ 경량 모델 서버', 'Ollama(qwen2.5:14b · gemma2:9b · llama3.2): 청킹 · 요약 · 인덱싱'],
          ['[조회]', '④ RAG · MAG 서버', '그래프 · 벡터 DB(pgvector) 검색, 에이전트별 작업 기억 조회'],
          ['[판단]', '① LLM 추론 서버 · CAG', 'Qwen3.8-Flash-Next (llama.cpp), 기준 문서 · 규칙 사전 적재(캐시)'],
          ['[연산]', '⑦ GPU 연산 서버', 'Complex 계산(임베딩 · 추론 가속) 분산 처리'],
          ['[검수]', '⑥ 테스트 · 검증 서버', '합성 데이터 사전 테스트, 정책 · 규칙 준수 검증'],
          ['[출구]', '② 원장 · 관문 서버', '출구 검증, 에이전트 언어 → 사람의 말 번역 / ⑧ Outbound Test PC — 외부 AI 서비스 연동 테스트'],
          ['[기록 · 사후 추적]', '② 원장 기록 · ⑤ 백업 · 모니터링 서버', '마지막 작업 시점부터 지문으로 전 공정을 거슬러 추적, 이상 탐지']
        ]
      },
      final: '대한민국에서 세계로, 다자간 에이전트의 영토',
      source: '유네스코 헌장 서문',
      url: 'https://www.unesco.or.kr/wp-content/uploads/2024/07/유네스코-헌장국문.pdf#page=1',
      excerpts: [
        '서로를 이해하고\n서로의 생활을 더욱 진실하고\n더욱 완전하게 알도록',
        '인간의 존엄, 평등, 상호존중',
        '인류의 지적ㆍ도덕적 연대'
      ],
      stages: [
        '[입구] ② 원장·관문 서버 — 작업 접수, 입구 검증, 사람의 말 → 에이전트 언어 번역',
        '[전처리] ③ 경량 모델 서버 — 청킹, 요약, 인덱싱',
        '[조회] ④ RAG·MAG 서버 — 벡터 DB 검색, 에이전트별 작업 기억 조회',
        '[판단] ① LLM 추론 서버·CAG — Qwen3.8-Flash-Next, 기준 문서와 규칙 사전 적재',
        '[연산] ⑦ GPU 연산 서버 — Complex 계산 분산 처리',
        '[검수] ⑥ 테스트·검증 서버 — 합성 데이터 사전 테스트, 정책·규칙 준수 검증',
        '[출구] ② 원장·관문 서버 — 출구 검증, 에이전트 언어 → 사람의 말 번역 / ⑧ Outbound Test PC — 외부 AI 서비스 연동 테스트',
        '[기록·사후 추적] ② 원장 기록 · ⑤ 백업·모니터링 서버 — 마지막 작업 시점부터 지문으로 전 공정을 거슬러 추적, 이상 탐지'
      ]
    },
    en: {
      region: 'From the stars to the ONDURU studio',
      servers: {
        title: 'Eight servers in all — a lights-\u2060out process: people check only at the entrance and the exit',
        items: [
          ['[Entrance]', '② Ledger · gate server', 'takes in the task, checks it at the entrance, turns the person’s words into the agents’ language'],
          ['[Preparation]', '③ Lightweight model server', 'Ollama (qwen2.5:14b · gemma2:9b · llama3.2): chunking · summarising · indexing'],
          ['[Lookup]', '④ RAG · MAG server', 'graph · vector DB (pgvector) search, each agent’s working memory'],
          ['[Judgement]', '① LLM inference server · CAG', 'Qwen3.8-Flash-Next (llama.cpp), reference documents · rules loaded in advance (cache)'],
          ['[Computation]', '⑦ GPU server', 'complex calculations (embedding · inference acceleration) spread across processors'],
          ['[Review]', '⑥ Test · verification server', 'pre-testing on synthetic data, checking that policies · rules are kept'],
          ['[Exit]', '② Ledger · gate server', 'exit check, the agents’ language back into the person’s words / ⑧ Outbound Test PC — tests with outside AI services'],
          ['[Record · tracing back]', '② Ledger record · ⑤ Backup · monitoring server', 'from the last step, traces the whole process back by fingerprint, detects anything unusual']
        ]
      },
      final: 'From Korea to the world, a territory of multi-party agents',
      source: 'UNESCO Constitution, Preamble',
      url: 'https://www.unesco.org/en/legal-affairs/constitution',
      excerpts: [
        'a truer and more perfect knowledge\nof each other’s lives',
        'the dignity, equality and mutual respect of men',
        'intellectual and moral solidarity of mankind'
      ],
      stages: [
        '[Entrance] ② Ledger · gate server — takes in the task, checks it at the entrance, turns the person’s words into the agents’ language',
        '[Preparation] ③ Lightweight model server — chunking, summarising, indexing',
        '[Lookup] ④ RAG · MAG server — vector DB search, each agent’s working memory',
        '[Judgement] ① LLM inference server · CAG — Qwen3.8-Flash-Next, reference documents and rules loaded in advance',
        '[Computation] ⑦ GPU server — complex calculations spread across processors',
        '[Review] ⑥ Test · verification server — pre-testing on synthetic data, checking that policies and rules are kept',
        '[Exit] ② Ledger · gate server — exit check, the agents’ language back into the person’s words / ⑧ Outbound Test PC — tests with outside AI services',
        '[Record · tracing back] ② Ledger record · ⑤ Backup · monitoring server — from the last step, traces the whole process back by fingerprint and detects anything unusual'
      ]
    },
    es: {
      region: 'De las estrellas al estudio de ONDURU',
      servers: {
        title: 'Ocho servidores en total — un proceso sin personal (lights-\u2060out): las personas solo comprueban a la entrada y a la salida',
        items: [
          ['[Entrada]', '② Servidor de registro y control', 'recibe la tarea, la verifica a la entrada, traduce las palabras de la persona al lenguaje de los agentes'],
          ['[Preparación]', '③ Servidor de modelos ligeros', 'Ollama (qwen2.5:14b · gemma2:9b · llama3.2): fragmentación · resumen · indexación'],
          ['[Consulta]', '④ Servidor RAG · MAG', 'búsqueda en BD de grafos y vectorial (pgvector), memoria de trabajo de cada agente'],
          ['[Juicio]', '① Servidor de inferencia LLM · CAG', 'Qwen3.8-Flash-Next (llama.cpp), documentos de referencia y reglas cargados de antemano (caché)'],
          ['[Cálculo]', '⑦ Servidor GPU', 'cálculos complejos (aceleración de embeddings e inferencia) repartidos en paralelo'],
          ['[Revisión]', '⑥ Servidor de pruebas y verificación', 'pruebas previas con datos sintéticos, verificación de políticas y reglas'],
          ['[Salida]', '② Servidor de registro y control', 'verificación de salida, del lenguaje de los agentes a las palabras de la persona / ⑧ Outbound Test PC — pruebas con servicios de IA externos'],
          ['[Registro · rastreo]', '② Registro · ⑤ Servidor de copia y vigilancia', 'desde el último paso, rastrea todo el proceso hacia atrás por su huella y detecta anomalías']
        ]
      },
      final: 'De Corea al mundo, un territorio de agentes de muchas partes',
      source: 'Preámbulo de la Constitución de la UNESCO',
      url: 'https://www.unesco.org/es/legal-affairs/constitution',
      excerpts: [
        'un conocimiento más preciso y verdadero\nde sus respectivas vidas',
        'la dignidad, la igualdad y el respeto mutuo',
        'solidaridad intelectual y moral de la humanidad'
      ],
      stages: [
        '[Entrada] ② Servidor de registro y control — recibe la tarea, la verifica a la entrada, traduce las palabras de la persona al lenguaje de los agentes',
        '[Preparación] ③ Servidor de modelos ligeros — fragmentación, resumen, indexación',
        '[Consulta] ④ Servidor RAG · MAG — búsqueda en la BD vectorial, memoria de trabajo de cada agente',
        '[Juicio] ① Servidor de inferencia LLM · CAG — Qwen3.8-Flash-Next, documentos de referencia y reglas cargados de antemano',
        '[Cálculo] ⑦ Servidor GPU — cálculos complejos repartidos en paralelo',
        '[Revisión] ⑥ Servidor de pruebas y verificación — pruebas previas con datos sintéticos, verificación de políticas y reglas',
        '[Salida] ② Servidor de registro y control — verificación de salida, del lenguaje de los agentes a las palabras de la persona / ⑧ Outbound Test PC — pruebas con servicios de IA externos',
        '[Registro · rastreo] ② Registro · ⑤ Servidor de copia y vigilancia — desde el último paso, rastrea todo el proceso hacia atrás por su huella y detecta anomalías'
      ]
    }
  };

  // A smooth curve through the section points, so the drawing never jumps between sections.
  function monotone(points) {
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]), n = points.length;
    const d = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i]));
    const m = xs.map((_, i) => i === 0 ? d[0] : i === n - 1 ? d[n - 2]
      : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
    for (let i = 0; i < n - 1; i++) {
      const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
      if (h > 9) { const k = 3 / Math.sqrt(h); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
    }
    return x => {
      if (x <= xs[0]) return ys[0];
      if (x >= xs[n - 1]) return ys[n - 1];
      let i = 0;
      while (x > xs[i + 1]) i++;
      const w = xs[i + 1] - xs[i], u = (x - xs[i]) / w, u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * ys[i] + (u3 - 2 * u2 + u) * w * m[i]
        + (3 * u2 - 2 * u3) * ys[i + 1] + (u3 - u2) * w * m[i + 1];
    };
  }

  function fade(t, start, end) {
    const u = Math.max(0, Math.min(1, (t - start) / (end - start)));
    return u * u * (3 - 2 * u);
  }

  const mix = (a, b, u) => a + (b - a) * u;

  function mount(host, {onState, onEdge} = {}) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const veil = document.createElement('div');
    veil.className = 'return-veil';
    veil.setAttribute('aria-hidden', 'true');

    // Each phrase in its place, then the source they come from.
    const captions = document.createElement('figure');
    captions.className = 'return-passages';
    const cards = [1, 2, 3].map(() => document.createElement('blockquote'));
    cards.forEach(card => { card.className = 'return-caption'; });
    const credit = document.createElement('figcaption');
    credit.className = 'return-credit';
    const lines = [...cards, credit];
    captions.append(...lines);
    // The eight servers in On's own lines, for screen readers; on screen they are the picture.
    const servers = document.createElement('div');
    servers.className = 'sr';
    servers.setAttribute('aria-hidden', 'true');
    const serverTitle = document.createElement('p');
    serverTitle.className = 'sv-title';
    const serverList = document.createElement('ol');
    serverList.className = 'sv-list';
    servers.append(serverTitle, serverList);
    // Announce each line as it appears.
    const spoken = document.createElement('div');
    spoken.className = 'sr';
    spoken.setAttribute('role', 'status');
    spoken.setAttribute('aria-live', 'polite');
    spoken.setAttribute('aria-atomic', 'true');
    // The one closing line, above the globe.
    const ending = document.createElement('p');
    ending.className = 'return-final';
    host.replaceChildren(canvas, veil, captions, servers, ending, spoken);

    const ctx = canvas.getContext('2d');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let locale = 'ko', active = false, paused = false, ended = false;
    let elapsed = 0, last = null, frame = 0, announcement = '', stillKey = '', shownStage = -1, shownFinal = false, shownServers = false;
    let finalKey = '', edge = '';
    const paper = '#080e14';

    // The closing line sits in the dark above the globe as it comes to rest, whatever the
    // shape of the exhibition's space.
    function placeFinal(w, h) {
      const key = [w, h, locale].join('/');
      if (key === finalKey || !window.ReturnSky.globeAt) return;
      finalKey = key;
      const tall = w / h < .88;
      const rest = motion.matches ? (tall ? 7.75 : 7.42) : (tall ? backTall : backWide)(storyEnd);
      const g = window.ReturnSky.globeAt(w, h, rest), above = g.cy - g.radius, line = ending.offsetHeight;
      const gap = Math.max(8, h * .02);
      const top = above >= line + 2 * gap ? Math.max(gap, (above - line) / 2) : Math.max(gap, above - line - gap);
      ending.style.top = Math.round(top) + 'px';
    }

    function draw(scene, sec, clock) {
      if (!ctx) return;
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const inside = sec >= 11.1;
      const flowAt = motion.matches ? Math.min(flowStages - 1, Math.max(0, Math.floor((sec - flowStart) / stageSec))) * 2 + 1.6
        : (sec - flowStart) * 2 / stageSec;
      // The way back out has begun: the opening's own pictures, run in reverse.
      const outside = sec >= flowEnd;
      const back = !outside ? scene : motion.matches ? (sec < flowEnd + 3.45 ? 18 : sec < flowEnd + 6.4 ? 10.4 : w / h < .88 ? 7.75 : 7.42)
        : (w / h < .88 ? backTall : backWide)(Math.min(sec, closeEnd + 1));
      const key = motion.matches ? [outside ? 'back' + back + Number(sec >= finalStart) : inside ? 'flow' + flowAt : scene + '/' + Math.round(Math.min(clock - holdAt, holdSec) * 4), w, h, dpr, locale].join('/') : '';
      // The colour at the edge of the picture, for the frame around it (the sky's own ground,
      // which darkens as the journey nears Earth; everything after that lies on the same dark).
      const sky = fade(Math.min(back, 8), 4.2, 8);
      const edgeNow = 'rgb(' + [15 + (8 - 15) * sky, 19 + (14 - 19) * sky, 24 + (20 - 24) * sky].map(Math.round).join(',') + ')';
      if (edgeNow !== edge) { edge = edgeNow; onEdge?.(edge); }
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
      // The country shrinks back into the monitor it came out of.
      const shrink = motion.matches ? Number(outside) : fade(sec, flowEnd, flowEnd + 1);
      const country = inside && shrink < 1;
      if (country) {
        ctx.fillStyle = paper;
        ctx.fillRect(0, 0, w, h);
      }
      if (back < 14) window.ReturnSky.draw(ctx, w, h, back);
      const seen = outside ? (motion.matches ? 1 : fade(sec, flowEnd + .35, flowEnd + .9))
        : motion.matches ? Number(!inside) : 1 - fade(sec, 11.1, 11.6);
      // Lights out: from the hold until the country, the studio is all but dark.
      const dark = outside || clock < holdAt ? 0 : motion.matches ? 1 : fade(clock - holdAt, 0, 1);
      if (back >= 12 && seen > 0) {
        ctx.save();
        ctx.globalAlpha = seen * (1 - .9 * dark);
        window.ReturnStudio.draw(ctx, w, h, back, {target: null, reduced: motion.matches});
        ctx.restore();
      }
      // The eight servers on their circle; it opens into the country's line, which then takes over.
      const ringT = clock - holdAt, ringOn = outside || ringT < 0 ? 0 : motion.matches ? Number(sec < resumeAt + .4) : 1 - fade(sec, resumeAt, resumeAt + .7);
      if (ringOn > 0 && window.ServerRing) {
        const anchors = window.CountryFlow.anchors ? window.CountryFlow.anchors(ctx, w, h, locale) : null;
        window.ServerRing.draw(ctx, w, h, ringT, {locale, alpha: ringOn, anchors, reduced: motion.matches,
          unroll: motion.matches ? 0 : fade(ringT, ringUnroll[0], ringUnroll[1])});
      }
      if (country) {
        // The country opens out of the monitor, as if stepping through its glass, and at the
        // end goes back in the same way.
        const enter = outside ? 1 - fade(sec, flowEnd + .05, flowEnd + .6) : motion.matches ? 1 : fade(sec, 11.3, 12);
        const scale = outside ? 1 - .38 * shrink : 1;
        ctx.save();
        ctx.translate(w / 2, h / 2); ctx.scale(scale, scale); ctx.translate(-w / 2, -h / 2);
        window.CountryFlow.draw(ctx, w, h, flowAt, {locale, alpha: enter});
        ctx.restore();
      }
      if (outside) placeFinal(w, h);
      // From Korea out to the world, over the globe.
      if (outside && back < 11.5) {
        window.WorldShare.draw(ctx, w, h, motion.matches ? (back < 9 ? 20 : 0) : sec - spreadStart, back, {alpha: 1});
      }
    }

    // Reduced motion uses stills from the same journey, with the same reading time.
    const stills = [[0, 1.2], [3.4, 4.6], [6.8, 7.8], [10, 11.4],
      [14, 16.4], [17.5, 19.4], [21.1, 22], [23.4, 24.6], [26.1, 26.2], [27.2, 29]];
    function paint() {
      const clock = elapsed / 1000;
      const sec = story(clock);
      const t = sceneAt(sec);
      const index = Math.max(0, starts.findLastIndex(start => sec >= start));
      const cue = String(index);
      if (cue !== announcement) {
        announcement = cue;
        const local = copy[locale];
        spoken.textContent = index < cards.length ? local.excerpts[index].replace(/\n/g, ' ') : local.source;
        lines.forEach((line, i) => line.setAttribute('aria-hidden', String(i !== index)));
      }
      const show = (start, end) => motion.matches ? Number(sec >= start && sec < end)
        : fade(sec, start, start + arrival) * (1 - fade(sec, end - departure, end));
      lines.forEach((line, i) => {
        line.style.opacity = String(show(starts[i], ends[i]));
      });
      // While the eight servers are drawn, screen readers have On's lines for them.
      const into = clock - holdAt;
      const named = into >= 1.2 && into < holdSec;
      servers.setAttribute('aria-hidden', String(!named));
      if (into < 0) shownServers = false;
      if (named && !shownServers) {
        shownServers = true;
        spoken.textContent = copy[locale].servers.title;
      }
      // The station at work is written into the drawing itself; screen readers hear its line.
      const stage = Math.floor((sec - flowStart) / stageSec);
      if (stage >= 0 && stage < flowStages && stage !== shownStage) {
        shownStage = stage;
        spoken.textContent = copy[locale].stages[stage];
      }
      // The one closing line, once the globe has settled. It stays.
      if (sec < finalStart) shownFinal = false;
      if (sec >= finalStart && !shownFinal) {
        shownFinal = true;
        spoken.textContent = copy[locale].final;
      }
      ending.style.opacity = String(motion.matches ? Number(sec >= finalStart) : fade(sec, finalStart, finalStart + arrival));
      veil.style.opacity = String(sec < 8 ? 1 : 1 - fade(sec, 8, 10));
      draw(motion.matches && sec < 11.1 ? stills.findLast(([start]) => t >= start)[1] : t, sec, clock);
    }

    function tick(now) {
      frame = 0;
      if (!active || paused || ended || document.hidden) return;
      if (last !== null) elapsed += Math.max(0, now - last);
      last = now;
      if (elapsed >= durationMs) {
        // The end: the last page stays as it is.
        elapsed = durationMs;
        paint();
        ended = true;
        cancel();
        onState?.();
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
      if (active && !paused && !ended && !document.hidden && !frame) frame = requestAnimationFrame(tick);
    }
    function setLocale(next) {
      locale = Object.hasOwn(copy, next) ? next : 'ko';
      const local = copy[locale];
      cards.forEach((card, i) => {
        card.textContent = local.excerpts[i];
        card.setAttribute('cite', local.url);
      });
      credit.textContent = local.source;
      ending.textContent = local.final;
      serverTitle.textContent = local.servers.title;
      serverList.replaceChildren(...local.servers.items.map(([stage, name, what]) => {
        const item = document.createElement('li');
        const a = document.createElement('span'), b = document.createElement('span'), c = document.createElement('span');
        a.className = 'sv-stage'; b.className = 'sv-name'; c.className = 'sv-what';
        a.textContent = stage; b.textContent = name; c.textContent = '— ' + what;
        item.append(a, ' ', b, ' ', c);
        return item;
      }));
      finalKey = '';
      shownStage = -1;
      shownFinal = false;
      shownServers = false;
      host.lang = locale;
      host.setAttribute('aria-label', copy[locale].region);
      announcement = '';
      stillKey = '';
      if (active) paint();
    }
    function play(next = locale) {
      cancel();
      active = true;
      paused = false;
      ended = false;
      elapsed = 0;
      stillKey = '';
      host.hidden = false;
      setLocale(next);
      schedule();
      onState?.();
    }
    function hide() {
      active = false;
      paused = false;
      ended = false;
      cancel();
      host.hidden = true;
      onState?.();
    }
    function setPaused(value) {
      if (!active) return;
      // Play at the end begins the work again.
      if (!value && (ended || elapsed >= durationMs)) { play(locale); return; }
      if (paused === Boolean(value)) return;
      paused = Boolean(value);
      cancel();
      schedule();
      onState?.();
    }
    function pageIndex() {
      const clock = elapsed / 1000;
      let at = 0;
      pages.forEach(([start], i) => { if (clock >= start - 1e-6) at = i; });
      return at;
    }
    // Turn to a page: while playing it begins from the page's start; while paused it shows the
    // page's still and stays paused. At the end, turning back leaves the work paused there.
    function turn(i) {
      if (!active) return false;
      const [start, view] = pages[Math.max(0, Math.min(pages.length - 1, i))];
      if (ended) { ended = false; paused = true; }
      elapsed = (paused ? view : start) * 1000;
      cancel();
      stillKey = '';
      announcement = '';
      shownStage = -1;
      shownServers = false;
      paint();
      schedule();
      onState?.();
      return true;
    }
    const next = () => active && pageIndex() < pages.length - 1 ? turn(pageIndex() + 1) : false;
    const prev = () => turn(pageIndex() - 1);
    document.addEventListener('visibilitychange', () => { cancel(); schedule(); });
    window.addEventListener('resize', () => { if (active) { stillKey = ''; paint(); } });
    motion.addEventListener?.('change', () => { if (active) { stillKey = ''; paint(); } });
    setLocale('ko');
    return {play, hide, setLocale, setPaused, next, prev,
      isOpen: () => active, isPlaying: () => active && !paused && !ended, isLast: () => pageIndex() === pages.length - 1};
  }
  window.Prologue = {mount, sourceUrl: locale => (copy[locale] || copy.ko).url};
})();
