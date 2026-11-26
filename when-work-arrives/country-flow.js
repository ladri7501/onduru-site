/* Inside the PC: the country where the agents live.
   One question from a person crosses eight stations on a single line and returns to a
   person as an answer. Each station is a district built of dots and lines; agents trained on
   the LLMs of eight different companies drift along the roads like ghosts, each drawn as the
   DNA of its company, carrying other people's work as well. No station has an owner: whichever agents are nearest pick the work up. Every step
   leaves a fingerprint on the ledger chain, which can be walked back from the last step. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const human = '230,227,219', agent = '147,214,196', warm = '236,104,92';
  const line = '92,100,108', faint = '52,58,66', ground = '38,44,52';
  // Where each agent comes from: the company whose LLM it was trained on, drawn as a strand
  // of DNA with that company's colour and its own sequence of base pairs.
  const dna = [
    {name: 'Microsoft', c: '100,155,235', code: 'ATGCAT'}, {name: 'Anthropic', c: '235,170,80', code: 'GCATTA'},
    {name: 'Meta', c: '135,125,240', code: 'TTAGCG'}, {name: 'OpenAI', c: '205,205,212', code: 'CGTAAC'},
    {name: 'xAI', c: '185,120,230', code: 'AACGTG'}, {name: 'Alibaba', c: '225,215,95', code: 'GATCCA'},
    {name: 'Amazon', c: '155,215,90', code: 'TCGGAT'}, {name: 'Google', c: '230,115,190', code: 'CATGTC'}
  ];
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const ramp = (u, a, b) => ease((u - a) / (b - a));
  const mix = (a, b, t) => a + (b - a) * t;
  const lerp = (p, q, t) => [mix(p[0], q[0], t), mix(p[1], q[1], t)];
  const rgba = (c, a) => 'rgba(' + c + ',' + clamp(a).toFixed(3) + ')';
  const pulse = (u, a, b) => Math.max(0, Math.sin(Math.PI * clamp((u - a) / (b - a))));
  const tint = (a, b, t) => { const p = a.split(','), q = b.split(','); return p.map((v, i) => Math.round(mix(+v, +q[i], clamp(t)))).join(','); };

  const words = {
    ko: {stations: ['입구 ② 원장·관문', '전처리 ③ 경량 모델', '조회 ④ RAG·MAG', '판단 ① LLM·CAG', '연산 ⑦ GPU', '검수 ⑥ 테스트·검증', '출구 ② 원장·관문'],
      person: '사람', question: '질문 한마디', answer: '답', outside: '외부 AI 서비스',
      backup: '⑤ 백업 사슬', quarantine: '격리', short: ['② 원장', '⑤ 백업', '⑤ 감시'],
      translator: '번역기', standard: '정렬 기준 — 기준 한 장 · 헌법 · 지침 (지문 a91c)', standardShort: '정렬 기준 (a91c)',
      chain: '기록의 사슬 — ② 원장', watcher: '감시자 ⑤ — 백업 · 모니터링', watcherShort: '감시자 ⑤', example: '예시는 합성 자료입니다',
      jobs: {intake: '작업 접수', inCheck: '입구 검증', inTrans: '사람의 말 →\n에이전트 언어 번역',
        chunk: '청킹', summary: '요약', index: '인덱싱', vector: '벡터 DB 검색', mag: '에이전트별 작업 기억 조회',
        model: 'Qwen3.8-Flash-Next', cag: '기준 문서와 규칙 사전 적재', gpu: 'Complex 계산 분산 처리',
        synthetic: '합성 데이터 사전 테스트', rules: '정책·규칙 준수 검증',
        outCheck: '출구 검증', outTrans: '에이전트 언어 →\n사람의 말 번역', outbound: '⑧ Outbound Test PC —\n외부 AI 서비스 연동 테스트'},
      dnaTitle: 'DNA — 어느 회사의 LLM으로 학습된 에이전트인가',
      legend: '회사마다 DNA는 달라도 —\n일을 받기 전, 모두 같은 정렬 기준의 지문(a91c)을 대어 봄',
      odd: '지문이 다른 에이전트 —\n감시자가 표시해 둠',
      hopFirst: '정해진 담당 없음 —\n가장 가까이 있던 {c} 에이전트가 받아 나름', hopNext: '가장 가까운 {c} 에이전트가 이어받음',
      trace: '마지막 작업 시점부터\n지문으로 전 공정을 거슬러 추적', detect: '이상 탐지',
      heads: ['[입구] ② 원장·관문 서버', '[전처리] ③ 경량 모델 서버', '[조회] ④ RAG·MAG 서버', '[판단] ① LLM 추론 서버·CAG',
        '[연산] ⑦ GPU 연산 서버', '[검수] ⑥ 테스트·검증 서버', '[출구] ② 원장·관문 서버 · ⑧ Outbound Test PC', '[기록·사후 추적] ② 원장 기록 · ⑤ 백업·모니터링 서버'],
      cards: [
        [['사람의 말: “지난달 출장비 중에서 규정을 넘은 것만 찾아 주세요”', 0], ['→ 에이전트 언어: 과제=비용검토 · 기간=10월 · 기준=출장비 규정 · 출력=예외 목록', 2]],
        [['질문을 조각 6개로 나누고 요약: 10월 출장비 42건', 0], ['색인 6개를 만들어 기록의 사슬에 남김', 0]],
        [['벡터 DB에서: 출장비 규정 3.2조 · 지난 검토 2건', 0], ['작업 기억에서: 다른 회사 에이전트 둘이 했던 비용 검토', 0]],
        [['미리 적재된 헌법 · 기준 · 출장비 규정 위에서 판단', 0], ['→ 규정 초과 의심 5건', 2]],
        [['42건의 금액 · 한도 비교를 코어 63개에 나눠 계산', 0], ['→ 초과 확정 3건', 2]],
        [['합성 데이터 시험 5개 — 일부러 넣은 오류 1개가 막힘', 0], ['정책 · 규칙 검사 4줄 통과', 2]],
        [['답: “규정을 넘은 출장비는 3건입니다. 근거 문서를 함께 드립니다.”', 0], ['⑧ 외부 AI 서비스 연동 시험 4곳 — 이상 없음', 2]],
        [['블록마다 앞 블록의 지문을 품은 7개 블록 — 마지막 #e7b2에서 첫 #3fa1까지 거슬러 확인', 0], ['감시자: 기준 지문이 다른 에이전트 1을 찾아 격리', 3]]
      ]},
    en: {stations: ['Entrance ② ledger · gate', 'Preparation ③ light model', 'Lookup ④ RAG · MAG', 'Judgement ① LLM · CAG', 'Computation ⑦ GPU', 'Review ⑥ test · verify', 'Exit ② ledger · gate'],
      person: 'Person', question: 'One question', answer: 'Answer', outside: 'Outside AI services',
      backup: '⑤ Backup chain', quarantine: 'isolated', short: ['② Ledger', '⑤ Backup', '⑤ Watch'],
      translator: 'Translator', standard: 'Alignment standard — the one-page standard · constitution · guidelines (fingerprint a91c)', standardShort: 'Standard (a91c)',
      chain: 'Record chain — ② ledger', watcher: 'Watcher ⑤ — backup · monitoring', watcherShort: 'Watcher ⑤', example: 'The example uses synthetic data',
      jobs: {intake: 'takes in the task', inCheck: 'checks it at the entrance', inTrans: 'the person’s words →\nthe agents’ language',
        chunk: 'chunking', summary: 'summarising', index: 'indexing', vector: 'vector DB search', mag: 'each agent’s working memory',
        model: 'Qwen3.8-Flash-Next', cag: 'reference documents and rules loaded in advance', gpu: 'complex calculations spread across processors',
        synthetic: 'pre-testing on synthetic data', rules: 'checking that policies and rules are kept',
        outCheck: 'exit check', outTrans: 'the agents’ language →\nthe person’s words', outbound: '⑧ Outbound Test PC —\ntests with outside AI services'},
      dnaTitle: 'DNA — which company’s LLM each agent was trained on',
      legend: 'A different DNA for each company —\nyet before taking work, every one checks the same standard’s fingerprint (a91c)',
      odd: 'Fingerprint differs —\nthe watcher marks this agent',
      hopFirst: 'No fixed owner —\nthe nearest {c} agent picks it up', hopNext: 'The nearest {c} agent takes it on',
      trace: 'From the last step, the whole process\ntraced back by fingerprint', detect: 'Unusual — detected',
      heads: ['[Entrance] ② Ledger · gate server', '[Preparation] ③ Lightweight model server', '[Lookup] ④ RAG · MAG server', '[Judgement] ① LLM inference server · CAG',
        '[Computation] ⑦ GPU server', '[Review] ⑥ Test · verification server', '[Exit] ② Ledger · gate server · ⑧ Outbound Test PC', '[Record · tracing back] ② Ledger record · ⑤ Backup · monitoring server'],
      cards: [
        [['Human words: “Find only last month’s travel expenses that broke the rules”', 0], ['→ Agent language: task=cost review · period=October · rule=travel policy · output=exceptions', 2]],
        [['Cuts the question into 6 chunks and sums it up: 42 October trips', 0], ['Makes 6 index entries and leaves them on the record chain', 0]],
        [['From the vector DB: travel policy §3.2 · 2 past reviews', 0], ['From working memory: cost reviews done by two agents of other companies', 0]],
        [['Judges on top of the preloaded constitution · standard · travel policy', 0], ['→ 5 possible breaches', 2]],
        [['Compares amounts and limits for 42 trips across 63 cores', 0], ['→ 3 confirmed breaches', 2]],
        [['5 synthetic test cases — the 1 planted error is stopped', 0], ['4 rows of policy and rule checks passed', 2]],
        [['Answer: “Three trips broke the travel rules. The supporting documents are attached.”', 0], ['⑧ Tests with 4 outside AI services — no problems', 2]],
        [['7 blocks, each holding the fingerprint of the one before — checked back from the last #e7b2 to the first #3fa1', 0], ['Watcher: finds the agent with a different standard fingerprint and isolates it', 3]]
      ]},
    es: {stations: ['Entrada ② registro · control', 'Preparación ③ modelo ligero', 'Consulta ④ RAG · MAG', 'Juicio ① LLM · CAG', 'Cálculo ⑦ GPU', 'Revisión ⑥ prueba · verificación', 'Salida ② registro · control'],
      person: 'Persona', question: 'Una pregunta', answer: 'Respuesta', outside: 'Servicios de IA externos',
      backup: '⑤ Cadena de copia', quarantine: 'aislado', short: ['② Registro', '⑤ Copia', '⑤ Vigilancia'],
      translator: 'Traductor', standard: 'Estándar de alineación — la norma de una página · constitución · pautas (huella a91c)', standardShort: 'Estándar (a91c)',
      chain: 'Cadena de registro — ② registro', watcher: 'Vigilante ⑤ — copia · vigilancia', watcherShort: 'Vigilante ⑤', example: 'El ejemplo usa datos sintéticos',
      jobs: {intake: 'recibe la tarea', inCheck: 'la verifica a la entrada', inTrans: 'palabras de la persona →\nlenguaje de los agentes',
        chunk: 'fragmentación', summary: 'resumen', index: 'indexación', vector: 'búsqueda en la BD vectorial', mag: 'memoria de trabajo de cada agente',
        model: 'Qwen3.8-Flash-Next', cag: 'documentos de referencia y reglas cargados de antemano', gpu: 'cálculos complejos repartidos en paralelo',
        synthetic: 'pruebas previas con datos sintéticos', rules: 'verificación de políticas y reglas',
        outCheck: 'verificación de salida', outTrans: 'lenguaje de los agentes →\npalabras de la persona', outbound: '⑧ Outbound Test PC —\npruebas con servicios de IA externos'},
      dnaTitle: 'ADN — con el LLM de qué empresa se entrenó cada agente',
      legend: 'Cada empresa, un ADN distinto —\npero antes de recibir trabajo, todos comprueban la huella del mismo estándar (a91c)',
      odd: 'La huella no coincide —\nel vigilante marca a este agente',
      hopFirst: 'Sin responsable fijo —\nlo recoge el agente de {c} más cercano', hopNext: 'Lo toma el agente de {c} más cercano',
      trace: 'Desde el último paso, todo el proceso\nrastreado hacia atrás por su huella', detect: 'Anomalía detectada',
      heads: ['[Entrada] ② Servidor de registro y control', '[Preparación] ③ Servidor de modelos ligeros', '[Consulta] ④ Servidor RAG · MAG', '[Juicio] ① Servidor de inferencia LLM · CAG',
        '[Cálculo] ⑦ Servidor GPU', '[Revisión] ⑥ Servidor de pruebas y verificación', '[Salida] ② Servidor de registro y control · ⑧ Outbound Test PC', '[Registro · rastreo] ② Registro · ⑤ Servidor de copia y vigilancia'],
      cards: [
        [['Palabras humanas: “Busca solo los gastos de viaje del mes pasado que incumplieron las normas”', 0], ['→ Lenguaje de agentes: tarea=revisión de costes · periodo=octubre · norma=política de viajes · salida=excepciones', 2]],
        [['Divide la pregunta en 6 fragmentos y la resume: 42 viajes de octubre', 0], ['Crea 6 entradas de índice y las deja en la cadena de registro', 0]],
        [['De la BD vectorial: política de viajes §3.2 · 2 revisiones anteriores', 0], ['De la memoria de trabajo: revisiones de costes de dos agentes de otras empresas', 0]],
        [['Juzga sobre la constitución, el estándar y la política de viajes ya cargados', 0], ['→ 5 posibles incumplimientos', 2]],
        [['Compara importes y límites de 42 viajes en 63 núcleos', 0], ['→ 3 incumplimientos confirmados', 2]],
        [['5 casos de prueba sintéticos — se detiene el error colocado a propósito', 0], ['4 filas de control de políticas y reglas superadas', 2]],
        [['Respuesta: “Tres viajes incumplieron la norma. Se adjuntan los documentos de respaldo.”', 0], ['⑧ Pruebas con 4 servicios de IA externos — sin problemas', 2]],
        [['7 bloques, cada uno con la huella del anterior — comprobados desde el último #e7b2 hasta el primero #3fa1', 0], ['Vigilante: encuentra al agente con otra huella del estándar y lo aísla', 3]]
      ]}
  };

  // Positions along the line (X) for the people, the seven station stops, and the people again.
  const SX = [.105, .23, .365, .5, .635, .77, .895];
  const IN = .025, OUT = .975, LINE = .5;
  const hops = [{a: 0, b: 1, t0: 2, t1: 2.6}, {a: 1, b: 2, t0: 4, t1: 4.6}, {a: 2, b: 3, t0: 6, t1: 6.6},
    {a: 3, b: 4, t0: 8, t1: 8.6}, {a: 4, b: 5, t0: 10, t1: 10.6}, {a: 5, b: 6, t0: 12, t1: 12.6}];
  const work = [null, [2.6, 3.8], [4.6, 5.8], [6.6, 7.8], [8.6, 9.8], [10.6, 11.8], null];
  const ticks = [1.7, 3.8, 5.8, 7.8, 9.8, 11.8, 13.95];
  const prints = ['#3fa1', '#8c02', '#d41e', '#5b7a', '#a0c9', '#61f3', '#e7b2'];
  // When and where each station's card is read: [from, to, X, Y, anchor, align, width].
  const reads = [[.1, 2, .045, .625, 'top', 'left', .26], [2, 4, .045, .625, 'top', 'left', .26],
    [4, 6, .365, .455, 'bottom', 'center', .3], [6, 8, .5, .455, 'bottom', 'center', .3],
    [8, 10, .635, .455, 'bottom', 'center', .3], [10, 12, .735, .455, 'bottom', 'right', .3],
    [12, 14.05, .86, .455, 'bottom', 'right', .3], [14.05, 16, .045, .625, 'top', 'left', .26]];

  function seeded(seed) {
    let s = (seed * 7919 + 104729) % 233280;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }
  // The agents: seventy ghosts from eight companies' LLMs. Most travel the roads between stations
  // with other people's work; some linger in a district.
  const ghosts = Array.from({length: 70}, (_, k) => {
    const r = seeded(k + 11);
    const a = Math.floor(r() * 7), b = Math.min(6, a + 1 + Math.floor(r() * 3));
    return {co: k % dna.length, c: dna[k % dna.length].c, a: SX[a], b: SX[b], lane: (r() < .5 ? -1 : 1) * (.035 + r() * .2),
      period: 5 + r() * 7, phase: r() * TAU, linger: r() < .3, jx: .004 + r() * .01, jy: .01 + r() * .02,
      f: .6 + r() * .9, size: 1.4 + r() * .9, load: r() < .4};
  });
  const cloud = (() => {
    const r = seeded(401), pts = [];
    const centres = [[-.03, -.06], [.025, -.08], [-.02, .03], [.03, .02], [0, -.01]];
    for (let k = 0; k < 150; k++) {
      const c = centres[k % 5], a = r() * TAU, d = Math.sqrt(r()) * (.012 + r() * .016);
      pts.push([c[0] + Math.cos(a) * d * 1.3, c[1] + Math.sin(a) * d * 2.2]);
    }
    return pts;
  })();
  const nearest = [12, 47, 82, 117, 7, 52, 92, 142];
  const stray = {c: '150,156,164', code: 'ATATAT'};

  const isPortrait = (w, h) => w / h < .88 || w < 600;
  function frameOf(w, h, lay) {
    // A phone's exhibition space, between the site's header and footer, can be nearly square;
    // anything narrower than 600px still reads the country top to bottom.
    const portrait = isPortrait(w, h);
    const px = Math.max(.6, Math.min(1.25, Math.min(w / 1440, h / 900) * (portrait ? 1.5 : 1)));
    if (!portrait) {
      const x0 = w * .03, x1 = w * .97, y0 = h * .085, y1 = h * .93;
      return {portrait, px, P: (X, Y) => [x0 + X * (x1 - x0), y0 + Y * (y1 - y0)], font: Math.max(11, Math.min(13.5, w * .0094)),
        at: (x, y) => [(x - x0) / (x1 - x0), (y - y0) / (y1 - y0)]};
    }
    const x0 = w * .03, x1 = w * .97, y0 = lay ? lay.top : h * .18, y1 = lay ? lay.bottom : h * .8;
    return {portrait, px, P: (X, Y) => [x0 + Y * (x1 - x0), y0 + X * (y1 - y0)], font: 10,
      at: (x, y) => [(y - y0) / (y1 - y0), (x - x0) / (x1 - x0)]};
  }

  function natural(gh, u) {
    const s = .5 - .5 * Math.cos(TAU * u / gh.period + gh.phase);
    const X = gh.linger ? gh.a + gh.jx * 3 * Math.sin(gh.f * u + gh.phase) : mix(gh.a, gh.b, s);
    const Y = LINE + gh.lane + gh.jy * Math.sin(gh.f * 1.3 * u + gh.phase * 2);
    return [X + gh.jx * Math.sin(gh.f * 2.1 * u), Y];
  }
  // Whoever is nearest when the work is ready carries it, never the same agent twice running;
  // at each station the four nearest agents gather round to share the work.
  const plan = (() => {
    const carriers = [], crews = [];
    hops.forEach((hop, i) => {
      let best = -1, dist = Infinity;
      ghosts.forEach((gh, k) => {
        if (k === carriers[i - 1]) return;
        const p = natural(gh, hop.t0 - .5), d = Math.hypot((p[0] - SX[hop.a]) * 1.8, p[1] - LINE);
        if (d < dist) { dist = d; best = k; }
      });
      carriers.push(best);
    });
    work.forEach((win, s) => {
      if (!win) { crews.push([]); return; }
      const order = ghosts.map((gh, k) => {
        const p = natural(gh, win[0]);
        return [Math.hypot((p[0] - SX[s]) * 1.8, p[1] - LINE), k];
      }).filter(([, k]) => !carriers.includes(k)).sort((a, b) => a[0] - b[0]);
      crews.push(order.slice(0, 4).map(([, k]) => k));
    });
    // The one whose standard fingerprint differs: a free agent near the middle of the country.
    const busy = new Set([...carriers, ...crews.flat()]);
    let odd = -1, far = Infinity;
    ghosts.forEach((gh, k) => {
      if (busy.has(k) || gh.linger) return;
      const p = natural(gh, 2), d = Math.hypot(p[0] - .53, p[1] - .44);
      if (d < far) { far = d; odd = k; }
    });
    return {carriers, crews, odd};
  })();
  const QUARANTINE = [.43, .955];
  function ghostAt(k, u) {
    let p = natural(ghosts[k], u);
    if (k === plan.odd && u > 14.6) return lerp(p, QUARANTINE, ramp(u, 14.8, 15.6));
    plan.crews.forEach((crew, s) => {
      const j = crew.indexOf(k);
      if (j < 0) return;
      const [a, b] = work[s], pull = ramp(u, a - .3, a + .2) * (1 - ramp(u, b - .1, b + .5));
      const ang = TAU * j / 4 + u * 1.4;
      p = lerp(p, [SX[s] + Math.cos(ang) * .022, LINE + Math.sin(ang) * .07], pull);
    });
    hops.forEach((hop, i) => {
      if (plan.carriers[i] !== k) return;
      const A = [SX[hop.a], LINE], B = [SX[hop.b], LINE];
      if (u >= hop.t0 - .45 && u < hop.t0) p = lerp(p, A, ease((u - hop.t0 + .45) / .45));
      else if (u >= hop.t0 && u <= hop.t1) p = lerp(A, B, ease((u - hop.t0) / (hop.t1 - hop.t0)));
      else if (u > hop.t1 && u < hop.t1 + .8) p = lerp(B, p, ease((u - hop.t1) / .8));
    });
    return p;
  }

  // The question's shape: twelve dots that are words, then tokens, chunks, context,
  // a decision, a result, and words again.
  const shapes = {
    words: Array.from({length: 12}, (_, k) => [(k - 5.5) * .0062 + (k > 3 ? .004 : 0) + (k > 7 ? .004 : 0), (k % 3 - 1) * .002, k < 11 ? 1 : 0]),
    tokens: Array.from({length: 12}, (_, k) => [((k % 4) - 1.5) * .0075, (Math.floor(k / 4) - 1) * .028, k < 12 ? 1 : 0]),
    chunks: Array.from({length: 12}, (_, k) => k < 6 ? [Math.cos(TAU * k / 6) * .012, Math.sin(TAU * k / 6) * .045, 1] : k === 6 ? [0, 0, 1] : [0, 0, 0]),
    context: Array.from({length: 12}, (_, k) => k < 6 ? [Math.cos(TAU * k / 6) * .012, Math.sin(TAU * k / 6) * .045, 1]
      : [Math.cos(TAU * k / 6 + .5) * .02, Math.sin(TAU * k / 6 + .5) * .075, 1]),
    decision: Array.from({length: 12}, () => [0, 0, 1]),
    result: Array.from({length: 12}, (_, k) => k < 4 ? [Math.cos(TAU * k / 4) * .009, Math.sin(TAU * k / 4) * .034, 1] : [0, 0, 1])
  };
  const morphs = [[1, 1.5, 'words', 'tokens'], [2.8, 3.3, 'tokens', 'chunks'], [4.9, 5.4, 'chunks', 'context'],
    [7.2, 7.6, 'context', 'decision'], [9.4, 9.8, 'decision', 'result'], [12.65, 13.1, 'result', 'words']];
  function shapeAt(u) {
    let from = 'words', to = 'words', t = 0;
    for (const [a, b, s0, s1] of morphs) {
      if (u >= b) { from = s1; to = s1; t = 0; }
      else if (u >= a) { from = s0; to = s1; t = ease((u - a) / (b - a)); break; }
      else break;
    }
    return shapes[from].map((p, k) => [mix(p[0], shapes[to][k][0], t), mix(p[1], shapes[to][k][1], t), mix(p[2], shapes[to][k][2], t)]);
  }
  function centreAt(u) {
    let X = IN;
    if (u >= .3 && u < 1) X = mix(IN, SX[0], ease((u - .3) / .7));
    else if (u >= 1) X = SX[0];
    hops.forEach(hop => {
      const lag = .1;
      if (u >= hop.t0 + lag && u <= hop.t1 + lag) X = mix(SX[hop.a], SX[hop.b], ease((u - hop.t0 - lag) / (hop.t1 - hop.t0)));
      else if (u > hop.t1 + lag) X = SX[hop.b];
    });
    if (u >= 13.2) X = mix(SX[6], OUT, ease((u - 13.2) / .6));
    return [X, LINE];
  }

  // Upright, the country takes the height left between the DNA row and alignment note above it
  // and the station's card below it, measured in the letters actually used, so that on a short
  // screen nothing runs into anything else.
  const lays = new Map();
  function layOf(g, w, h, wd, locale) {
    const key = [w, h, locale].join('/');
    if (lays.has(key)) return lays.get(key);
    const font = 10, rowH = 16, left = w * .03, right = w * .97, lead = font * 1.1 * 1.32;
    const wrap = (text, maxW, css) => {
      g.font = css;
      let n = 0;
      text.split('\n').forEach(part => {
        let cur = '';
        part.split(' ').forEach(word => {
          const next = cur ? cur + ' ' + word : word;
          if (cur && g.measureText(next).width > maxW) { n++; cur = word; } else cur = next;
        });
        n++;
      });
      return n;
    };
    g.save();
    const fs = font * .9, small = fs.toFixed(1) + 'px "Exhibit Label", sans-serif';
    g.font = small;
    let rows = g.measureText(wd.dnaTitle).width > right - left ? 2 : 1, x = left;
    dna.forEach(d => {
      const need = 2.6 * 2 + 6 + g.measureText(d.name).width;
      if (x + need > right) { x = left; rows++; }
      x += need + 12;
    });
    rows++;
    const legendY = h * .034 + (rows - 1) * rowH + rowH * .5 + 4;
    const legend = wrap(wd.legend, w * .9, '500 ' + (font * 1.1).toFixed(1) + 'px "Exhibit Label", sans-serif');
    const top = Math.max(h * .18, legendY + legend * lead + 12);
    const size = font * .98, gap = size * 1.42;
    let lines = 0;
    wd.heads.forEach((head, i) => {
      let n = wrap(head, w * .92, '500 ' + size.toFixed(1) + 'px "Exhibit Label", sans-serif');
      wd.cards[i].forEach(([t, kind]) => { n += wrap(t, w * .92, (kind === 1 ? '500 ' : '') + size.toFixed(1) + 'px "Exhibit Label", sans-serif'); });
      lines = Math.max(lines, n);
    });
    g.restore();
    const drop = Math.max(18, h * .035);
    const bottom = Math.min(h * .8, h * .975 - 11 - (lines - 1) * gap - drop);
    const lay = {top, bottom, legendY, cardY: bottom + drop};
    lays.set(key, lay);
    return lay;
  }

  function draw(g, w, h, u, {locale = 'ko', alpha = 1} = {}) {
    if (!(w > 0 && h > 0) || alpha <= 0) return;
    const wd = words[locale] || words.ko;
    const F = frameOf(w, h, isPortrait(w, h) ? layOf(g, w, h, wd, locale) : null), P = F.P, px = F.px, lay = F.portrait ? layOf(g, w, h, wd, locale) : null;
    const stage = Math.max(0, Math.min(7, Math.floor(u / 2)));
    const dot = (X, Y, r, c, a) => { if (a <= .004) return; const [x, y] = P(X, Y); g.fillStyle = rgba(c, a); g.beginPath(); g.arc(x, y, r * px, 0, TAU); g.fill(); };
    const ring = (X, Y, r, c, a, from = 0, to = 1, width = .8) => {
      if (a <= .004 || to <= from) return; const [x, y] = P(X, Y);
      g.strokeStyle = rgba(c, a); g.lineWidth = width; g.beginPath();
      g.arc(x, y, r * px, -Math.PI / 2 + TAU * from, -Math.PI / 2 + TAU * to); g.stroke();
    };
    const seg = (A, B, c, a, width = .7, t = 1, dash = null) => {
      if (a <= .004 || t <= 0) return; const p = P(A[0], A[1]), q = P(B[0], B[1]), e = lerp(p, q, clamp(t));
      g.strokeStyle = rgba(c, a); g.lineWidth = width; g.setLineDash(dash || []);
      g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(e[0], e[1]); g.stroke(); g.setLineDash([]);
    };
    // A strand of DNA: two turning strands and six base pairs; G and C pairs carry a dot.
    const helix = (x, y, len, amp, phase, d, a) => {
      if (a <= .004) return;
      const r = Math.max(.75, .95 * px);
      g.lineWidth = .8;
      for (let j = 0; j < 6; j++) {
        const t = (j + .5) / 6, sn = Math.sin(phase + t * 7.4), yy = y - len / 2 + t * len;
        g.strokeStyle = rgba(d.c, a * .5); g.beginPath(); g.moveTo(x - amp * sn, yy); g.lineTo(x + amp * sn, yy); g.stroke();
        if (d.code[j] === 'G' || d.code[j] === 'C') { g.fillStyle = rgba(d.c, a); g.beginPath(); g.arc(x, yy, r * .9, 0, TAU); g.fill(); }
      }
      for (let i = 0; i < 9; i++) {
        const t = i / 8, q = phase + t * 7.4, sn = Math.sin(q), z = Math.cos(q), yy = y - len / 2 + t * len;
        g.fillStyle = rgba(d.c, a * (.55 + .45 * z)); g.beginPath(); g.arc(x + amp * sn, yy, r, 0, TAU); g.fill();
        g.fillStyle = rgba(d.c, a * (.55 - .45 * z)); g.beginPath(); g.arc(x - amp * sn, yy, r, 0, TAU); g.fill();
      }
    };
    const halo = (x, y, rad, c, a, width = .7) => { if (a <= .004) return; g.strokeStyle = rgba(c, a); g.lineWidth = width; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.stroke(); };
    const label = (s, X, Y, c, a, size = 1, align = 'center') => {
      if (a <= .004) return; const [x, y] = P(X, Y);
      g.font = (F.font * size).toFixed(1) + 'px "Exhibit Label", sans-serif';
      g.textAlign = align; g.textBaseline = 'middle';
      g.fillStyle = rgba(c, a); g.fillText(s, x, y);
    };
    const active = s => s === stage ? ramp(u, s * 2, s * 2 + .3) * (1 - ramp(u, s * 2 + 1.75, s * 2 + 2)) : 0;
    // A word lights at the moment its work happens, and stays lit until its station is done.
    const lit = (at, end) => ramp(u, at, at + .25) * (1 - ramp(u, end - .15, end + .1));
    g.save();
    g.globalAlpha = alpha;
    g.lineCap = 'round';

    // The ground of the country, its border, and the main road.
    for (let X = .06; X <= .945; X += .018) for (let Y = .06; Y <= .99; Y += .045) dot(X, Y, .55, ground, .9);
    const border = [[.055, .03], [.945, .03], [.945, 1], [.055, 1]];
    border.forEach((p, i) => seg(p, border[(i + 1) % 4], faint, .8, .8, 1, [1, 6]));
    seg([IN, LINE], [OUT, LINE], line, .5, 1);
    SX.forEach(X => { seg([X, .12], [X, .88], faint, .25, .6); });

    // People outside the border: one asks, one receives.
    [[IN, 0], [OUT, 1]].forEach(([X, side]) => {
      const lit = side === 0 ? 1 - ramp(u, .3, 1) * .6 : ramp(u, 13.7, 14.1);
      dot(X, LINE, 3.6, human, .6 + .4 * lit); ring(X, LINE, 9, human, .25 + .5 * lit);
      ring(X, LINE, 9 + 22 * ramp(u, 13.8, 14.8), human, side ? .55 * (1 - ramp(u, 14, 14.8)) : 0);
      label(wd.person, X, LINE + (F.portrait ? .03 : .07), human, .8, 1, F.portrait ? 'left' : 'center');
      label(side ? wd.answer : wd.question, X, LINE - (F.portrait ? .03 : .07), human, side ? ramp(u, 13.6, 14) : 1 - ramp(u, 1, 1.4), .9, F.portrait ? 'right' : 'center');
    });

    // ② the gate, at both ends: two pillars the question must pass between.
    [0, 6].forEach(s => {
      const X = SX[s], on = active(s);
      for (let k = 0; k < 9; k++) {
        const Y = .39 + k * .0275;
        dot(X - .011, Y, 1.4, on ? agent : line, .55 + .45 * on); dot(X + .011, Y, 1.4, on ? agent : line, .55 + .45 * on);
      }
      seg([X - .011, .39], [X + .011, .39], line, .5); seg([X - .011, .61], [X + .011, .61], line, .5);
      const check = s === 0 ? ramp(u, 1, 1.4) * (1 - ramp(u, 1.7, 2)) : ramp(u, 12.6, 13) * (1 - ramp(u, 13.3, 13.6));
      for (let k = 0; k < 9; k++) seg([X - .011, .39 + k * .0275], [X + .011, .39 + k * .0275], agent, .6 * check, .7, check);
    });

    // ③ the light model: a small net that cuts the question into chunks, sums it up, indexes it.
    {
      const X = SX[1], on = active(1), L = [[-.022, 4], [0, 6], [.022, 4]];
      const node = (l, n) => [X + L[l][0], .25 + (n + .5) * (.15 / L[l][1])];
      for (let l = 0; l < 2; l++) for (let a = 0; a < L[l][1]; a++) for (let b = 0; b < L[l + 1][1]; b++) {
        const sig = pulse(u, 2.7 + l * .3 + a * .03, 3.3 + l * .3 + a * .03);
        seg(node(l, a), node(l + 1, b), sig > .05 ? agent : faint, .35 + .45 * sig, .55);
      }
      L.forEach((lay, l) => { for (let n = 0; n < lay[1]; n++) { const [x, y] = node(l, n); dot(x, y, 1.5, on ? agent : line, .6 + .4 * on); } });
      seg([X, .4], [X, LINE], faint, .5);
      for (let k = 0; k < 8; k++) dot(X - .03 + k * .0085, .41, .9, agent, .8 * ramp(u, 3.3 + k * .05, 3.5 + k * .05));
    }

    // ④ the vector database (above) and every agent's own working memory (below).
    {
      const X = SX[2], on = active(2), C = [X, .23];
      const hit = ramp(u, 4.7, 5) * (1 - ramp(u, 5.6, 6));
      cloud.forEach((c, k) => {
        const lit = nearest.includes(k) ? hit : 0;
        if (lit > 0) seg([X, LINE], [C[0] + c[0], C[1] + c[1]], agent, .5 * lit, .6, lit);
        dot(C[0] + c[0], C[1] + c[1], .95 + 1.1 * lit, lit ? agent : line, .45 + .55 * lit);
      });
      seg([X, .34], [X, LINE], faint, .5);
      dna.forEach(({c}, j) => {
        const cx = X - .035 + j * .01, lit = j === 1 || j === 3 ? ramp(u, 5, 5.25) * (1 - ramp(u, 5.6, 5.9)) : 0;
        for (let k = 0; k < 7; k++) dot(cx, .64 + k * .022, 1.15 + .6 * lit, c, .35 + .55 * lit);
        if (lit > 0) seg([X, LINE], [cx, .64], c, .6 * lit, .7, lit);
      });
      seg([X, LINE], [X, .62], faint, .5);
    }

    // ① the reasoning model: layers of a large net, with the reference documents and rules
    // loaded beside it before any question arrives (CAG).
    {
      const X = SX[3], on = active(3), lays = 6, per = 9;
      const node = (l, n) => [X - .05 + l * .02, .1 + n * .034];
      const wave = clamp((u - 6.65) / .8) * (lays + 1), live = u > 6.65 && u < 7.7 ? 1 : 0;
      for (let l = 0; l < lays - 1; l++) for (let a = 0; a < per; a++) for (let b = 0; b < per; b++) {
        if ((a + b + l) % 2) continue;
        const sig = Math.max(0, 1 - Math.abs(wave - l - .5) / .9) * live;
        seg(node(l, a), node(l + 1, b), sig > .05 ? agent : faint, .22 + .5 * sig, .5);
      }
      for (let l = 0; l < lays; l++) for (let n = 0; n < per; n++) {
        const sig = Math.max(0, 1 - Math.abs(wave - l) / .8) * live;
        dot(...node(l, n), 1.3 + .9 * sig, sig > .05 ? agent : line, .55 + .45 * Math.max(on * .5, sig));
      }
      seg([X, .4], [X, LINE], faint, .5);
      const feed = ramp(u, 6.5, 6.8) * (1 - ramp(u, 7.5, 7.8));
      [-.03, 0, .03].forEach((dx, j) => {
        for (let k = 0; k < 6; k++) dot(X + dx, .64 + k * .02, 1.3, on ? agent : human, .45 + .45 * Math.max(on, feed));
        seg([X + dx, .64], [X + dx * .4, .52], agent, .55 * feed, .7, feed);
      });
    }

    // ⑦ the GPU district: a grid of cores lit in waves as the work is spread across them.
    {
      const X = SX[4], on = active(4), cols = 9, rows = 7;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const cx = X - .044 + c * .011, cy = .14 + r * .036;
        const d = Math.hypot(c - 4, (r - 6) * .7), sig = pulse(u, 8.7 + d * .07, 9.15 + d * .07);
        dot(cx, cy, 1.15 + 1.2 * sig, sig > .05 ? agent : line, .45 + .55 * sig);
      }
      const out = ramp(u, 8.6, 8.8) * (1 - ramp(u, 9.5, 9.8));
      for (let c = 0; c < cols; c += 2) seg([X, LINE], [X - .044 + c * .011, .14 + 6 * .036], agent, .45 * out, .6, out);
      seg([X, .38], [X, LINE], faint, .5);
    }

    // ⑥ the checks: rows of policy and rule gates, with synthetic data sent through first.
    {
      const X = SX[5], on = active(5);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) {
        if (c === 3 + (r % 2)) continue;
        const pass = ramp(u, 11 + r * .14, 11.15 + r * .14) * (1 - ramp(u, 11.8, 12.1));
        dot(X - .035 + c * .01, .2 + r * .055, 1.3 + .6 * pass, pass > .05 ? agent : line, .5 + .5 * pass);
      }
      for (let r = 0; r < 4; r++) seg([X, LINE - .03 - r * .0], [X, .2 + r * .055], agent, .5 * ramp(u, 11 + r * .14, 11.2 + r * .14) * (1 - ramp(u, 11.8, 12)), .7);
      for (let k = 0; k < 10; k++) {
        const a = TAU * k / 10;
        ring(X + Math.cos(a) * .012, .72 + Math.sin(a) * .05, 1.6, human, .4 + .3 * on, 0, 1, .7);
      }
      seg([X, .62], [X, LINE], faint, .5);
      [0, 1, 2, 3, 4].forEach(k => {
        const s = 10.3 + k * .1, go = ramp(u, s, s + .5), stop = k === 2 ? .48 : .2;
        const Y = mix(.72, stop, go), caught = k === 2 && go >= 1 ? ramp(u, s + .5, s + .65) : 0;
        const seen = ramp(u, s, s + .05) * (1 - ramp(u, s + .55, s + .85));
        ring(X + (k - 2) * .008, Y, 2.2, caught > 0 ? warm : human, .9 * seen, 0, 1, .9);
      });
    }

    // ⑧ the outbound test PC at the exit, reaching across the border to outside AI services.
    {
      const X = SX[6], O = [X, .73];
      seg([X, .61], O, faint, .6);
      dot(O[0], O[1], 2.4, line, .95); ring(O[0], O[1], 6.5, line, .5);
      [[.975, .66], [.982, .74], [.975, .82], [.968, .9]].forEach((q, k) => {
        seg(O, q, faint, .55, .7, 1, [2, 4]);
        for (let j = 0; j < 4; j++) dot(q[0] + (j % 2) * .004, q[1] + Math.floor(j / 2) * .012, 1, line, .8);
        const s = 12.6 + k * .1, go = ramp(u, s, s + .3), back = ramp(u, s + .35, s + .65);
        if (go > 0 && back < 1) { const p = back > 0 ? lerp(q, O, back) : lerp(O, q, go); dot(p[0], p[1], 1.8, agent, .95); }
      });
      label(wd.outside, .975, .96, line, .9, .8, 'right');
    }

    // The ledger: each step leaves a fingerprint block linked to the one before; the backup
    // keeps a second chain. Afterwards the chain is walked back from the last step.
    const LY = .9, BY = .955, rec = ramp(u, 14, 14.3) * (1 - ramp(u, 15.75, 16));
    if (F.portrait) {
      label(wd.short[0], .045, .93, tint(human, agent, rec), .85 + .15 * rec, .85 + .15 * rec, 'right'); label(wd.short[1], .075, 1, line, .75, .8, 'right');
    } else {
      label(wd.chain, SX[0] - .015, LY, tint(human, agent, rec), .85 + .15 * rec, .9 + .05 * rec, 'right'); label(wd.backup, SX[0] - .015, BY, line, .8, .8, 'right');
    }
    const trace = ramp(u, 14.15, 15.6), head = mix(SX[6], SX[0], trace);
    SX.forEach((X, i) => {
      const made = ramp(u, ticks[i], ticks[i] + .25);
      const walked = u > 14.1 && head <= X + .001 ? Math.max(0, 1 - Math.abs(head - X) / .03) : 0;
      if (made > 0) {
        seg([X, LINE + .11], [X, LY - .02], agent, .5 * (1 - ramp(u, ticks[i] + .3, ticks[i] + .8)) + .6 * walked, .7, made);
        for (let k = 0; k < 3; k++) dot(X + (k - 1) * .004, LY, 1.5 + walked, agent, .5 + .45 * made);
        for (let k = 0; k < 3; k++) dot(X + (k - 1) * .004, BY, 1.1, line, .4 + .4 * ramp(u, ticks[i] + .3, ticks[i] + .6));
        if (i) seg([SX[i - 1] + .006, LY], [X - .006, LY], agent, .45, .7, made);
        const fp = i ? prints[i] + ' ← ' + prints[i - 1] : prints[i];
        if (F.portrait) label(fp, X + .022, LY - .035, walked > .05 ? agent : human, (.55 + .45 * walked) * made, .78, 'right');
        else label(fp, X, LY - .032, walked > .05 ? agent : human, (.6 + .4 * walked) * made, .8);
        if (i) seg([SX[i - 1] + .006, BY], [X - .006, BY], line, .35, .6, ramp(u, ticks[i] + .3, ticks[i] + .6));
      } else for (let k = 0; k < 3; k++) dot(X + (k - 1) * .004, LY, 1, faint, .8);
    });
    if (u > 14.1) {
      const fade = 1 - ramp(u, 15.7, 16);
      seg([SX[6], LY], [head, LY], agent, .9 * fade, 1.6);
      dot(head, LY, 3.2, agent, fade); ring(head, LY, 7, agent, .5 * fade);
    }

    // ⑤ monitoring: a slow sweep across the whole country, all the time.
    {
      const W = [.5, .97], ang = -Math.PI / 2 + Math.sin(u * .55) * 1.25, look = stage === 7 ? 1 : 0;
      dot(W[0], W[1] - .01, 3.2, look ? agent : human, .95);
      for (let k = 1; k < 4; k++) ring(W[0], W[1] - .01, k * 9, look ? agent : line, .3 + .3 * look, 0, 1, .7);
      SX.forEach((X, i) => seg([W[0], W[1] - .01], [X, LY], agent, .25 * look * ramp(u, 14.15 + (6 - i) * .2, 14.4 + (6 - i) * .2), .6));
      if (u > 14.4) { const q = ghostAt(plan.odd, u); seg([W[0], W[1] - .01], q, warm, .6 * ramp(u, 14.4, 14.7), .9); }
      const [wx, wy] = P(W[0], W[1] - .01), reach = Math.min(w, h) * .7;
      g.strokeStyle = rgba(agent, .1 + .2 * (stage === 7 ? 1 : 0)); g.lineWidth = 1;
      g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + Math.cos(ang) * reach * (F.portrait ? .6 : 1), wy + Math.sin(ang) * reach); g.stroke();
      if (F.portrait) label(wd.watcherShort, W[0] + .045, W[1] - .03, tint(human, agent, rec), .85 + .15 * rec, .85 + .15 * rec);
      else label(wd.watcher, W[0] + .022, W[1] - .01, tint(human, agent, rec), .85 + .15 * rec, .9 + .15 * rec, 'left');
    }

    // Station names; the one at work brightens, and in the trace each lights again in turn.
    SX.forEach((X, i) => {
      const walked = u > 14.1 ? Math.max(0, 1 - Math.abs(head - X) / .03) : 0;
      const lit = Math.max(active(i), walked);
      dot(X, LINE, 3.4 + 1.2 * lit, lit > .05 ? agent : human, .65 + .35 * lit);
      ring(X, LINE, 9, lit > .05 ? agent : line, .35 + .55 * lit);
      label(F.portrait ? wd.stations[i].split(' ').slice(0, 2).join(' ') : wd.stations[i], X, LINE + (F.portrait ? .03 : .065), lit > .05 ? agent : human, .75 + .25 * lit, F.portrait ? .95 : 1, F.portrait ? 'left' : 'center');
    });

    // The agents, and the other people's work they carry. One load is found to be wrong
    // by the monitoring at the end and is set apart.
    ghosts.forEach((gh, k) => {
      const p = ghostAt(k, u);
      const carrying = plan.carriers.some((c, i) => c === k && u >= hops[i].t0 - .45 && u <= hops[i].t1 + .3);
      const crewing = plan.crews.some((crew, s) => crew.includes(k) && u >= work[s][0] - .2 && u <= work[s][1]);
      const [x, y] = P(p[0], p[1]), grow = carrying ? 1.45 : crewing ? 1.15 : 1;
      const len = Math.max(9, 13 * px) * grow, amp = Math.max(2.3, 3.2 * px) * grow;
      if (crewing) plan.crews.forEach((crew, s) => { if (crew.includes(k)) seg([SX[s], LINE], p, gh.c, .35, .6); });
      // The agent whose standard fingerprint differs is not shown as any one company's.
      helix(x, y, len, amp, u * 2.2 + gh.phase, k === plan.odd ? stray : dna[gh.co], carrying ? 1 : crewing ? .9 : .62);
      halo(x, y, len * .72, gh.c, carrying ? .45 : crewing ? .28 : .1);
      if (gh.load && !carrying && k !== plan.odd) { g.fillStyle = rgba(line, .55); g.beginPath(); g.arc(x + amp + 4, y + len * .3, 1.2 * Math.max(.75, px), 0, TAU); g.fill(); }
      if (k === plan.odd) {
        halo(x, y, len * .72 + 4, warm, .75 * ramp(u, 2.1, 2.4), .9);
        if (u > 14.6) halo(x, y, len * .72 + 9, warm, .65, 1.1);
      }
    });

    // The question itself, held on a thread by whichever agent carries it.
    const C = centreAt(u), show = ramp(u, .05, .3) * (1 - ramp(u, 13.75, 14.05));
    hops.forEach((hop, i) => {
      const held = ramp(u, hop.t0 - .05, hop.t0 + .05) * (1 - ramp(u, hop.t1 + .1, hop.t1 + .3));
      if (held > 0) { const p = ghostAt(plan.carriers[i], u); seg(p, C, ghosts[plan.carriers[i]].c, .85 * held, 1.1); }
    });
    const tone = ramp(u, 1.1, 1.4) * (1 - ramp(u, 12.8, 13.1));
    shapeAt(u).forEach(([dx, dy, a]) => dot(C[0] + dx, C[1] + dy, 1.9, tone > .5 ? agent : human, show * a));
    ring(C[0], C[1], 13, tone > .5 ? agent : human, .3 * show);

    // The alignment standard above the country. Before work is taken, every agent reads its
    // fingerprint; each carrier checks it again as it takes the question on.
    const SY = -.015;
    seg([.06, SY], [.94, SY], human, .55, 1);
    for (let X = .06; X <= .94; X += .03) dot(X, SY, 1.1, human, .7);
    if (F.portrait) label(wd.standardShort, ...F.at(w * .03, h * .014), human, .9, .85, 'left');
    else label(wd.standard, .06, SY - .03, human, .9, .9, 'left');
    const align = ramp(u, 1.5, 1.75) * (1 - ramp(u, 2.6, 2.95));
    ghosts.forEach((gh, k) => {
      const p = ghostAt(k, u), odd = k === plan.odd;
      if (align > 0) {
        seg(p, [p[0], SY], odd ? warm : gh.c, (odd ? .8 : .32) * align, odd ? 1 : .6, align);
        const [x, y] = P(p[0], p[1]);
        halo(x, y, Math.max(9, 13 * px) * .72 + 2, odd ? warm : gh.c, .75 * align, .8);
      }
    });
    hops.forEach((hop, i) => {
      const chk = ramp(u, hop.t0 - .35, hop.t0 - .2) * (1 - ramp(u, hop.t0, hop.t0 + .2));
      if (chk > 0) { const p = ghostAt(plan.carriers[i], u); seg(p, [p[0], SY], ghosts[plan.carriers[i]].c, .75 * chk, .9, chk); }
    });

    // The words of the work, pinned to the part of the country that does it: dim while they
    // wait (hidden on a small screen), lit and underlined while the work happens there.
    const fontOf = (on, size) => (on > .5 ? '500 ' : '') + (F.font * (size + .2 * on)).toFixed(1) + 'px "Exhibit Label", sans-serif';
    const rowsOf = (text, maxW, size, keep) => {
      g.font = fontOf(1, size);
      const out = [];
      (F.portrait || keep ? text : text.replace(/\n/g, ' ')).split('\n').forEach(part => {
        let cur = '';
        part.split(' ').forEach(word => {
          const next = cur ? cur + ' ' + word : word;
          if (cur && g.measureText(next).width > maxW) { out.push(cur); cur = word; } else cur = next;
        });
        out.push(cur);
      });
      return out;
    };
    const lead = F.font * 1.1 * 1.32;
    const stack = (items, X, Y, align, v, maxW) => {
      const blocks = items.map(it => ({show: 'dim', c: agent, size: .9, ...it}));
      blocks.forEach(b => { b.rows = rowsOf(b.text, maxW, b.size, b.keep); });
      const total = blocks.reduce((n, b) => n + b.rows.length, 0);
      const [x, y] = P(X, Y);
      let row = v === 'bottom' ? y - lead * .55 - (total - 1) * lead : v === 'top' ? y + lead * .55 : y - (total - 1) * lead / 2;
      g.save();
      g.textAlign = align; g.textBaseline = 'middle';
      blocks.forEach(b => {
        const a = b.show === 'name' ? Math.max(.65, b.on) : b.show === 'dim' && !F.portrait ? Math.max(.5, b.on) : b.on;
        if (a > .004) {
          g.font = fontOf(b.on, b.size);
          b.rows.forEach((r, i) => {
            const yy = row + i * lead;
            const xx = x;
            g.shadowColor = 'rgba(8,14,20,.95)'; g.shadowBlur = b.on > .05 ? 7 : 0;
            g.fillStyle = rgba(tint(b.show === 'name' ? human : line, b.c, b.on), a);
            g.fillText(r, xx, yy);
            if (b.on > .05) {
              const tw = g.measureText(r).width, x0 = align === 'left' ? xx : align === 'right' ? xx - tw : xx - tw / 2;
              g.shadowBlur = 0;
              g.fillStyle = rgba(b.c, .6 * b.on);
              g.fillRect(x0, yy + F.font * .74, tw * b.on, 1);
            }
          });
        }
        row += b.rows.length * lead;
      });
      g.restore();
    };
    const job = (key, at, end) => ({text: wd.jobs[key], on: lit(at, end)});
    const gate = (at, end) => ({text: wd.translator + ' ②', on: lit(at, end), show: 'name'});
    // Each station's words: [items, X, Y, align, vertical anchor, width] on a wide screen;
    // on a narrow screen one column beside the station, in the order the work happens.
    const groups = [
      [[[job('intake', .55, 2), job('inCheck', 1, 2), gate(1.1, 2), job('inTrans', 1.1, 2)], SX[0], .375, 'center', 'bottom', .16]],
      [[[job('chunk', 2.75, 4), job('summary', 3, 4), job('index', 3.3, 4)], SX[1], .235, 'center', 'bottom', .125]],
      [[[job('vector', 4.7, 6)], SX[2], .075, 'center', 'bottom', .125], [[job('mag', 5, 6)], SX[2], .8, 'center', 'top', .125]],
      [[[job('model', 6.65, 8)], SX[3], .085, 'center', 'bottom', .125], [[job('cag', 6.5, 8)], SX[3], .8, 'center', 'top', .125]],
      [[[job('gpu', 8.6, 10)], SX[4], .115, 'center', 'bottom', .125]],
      [[[job('synthetic', 10.3, 12)], SX[5], .8, 'center', 'top', .125], [[job('rules', 11, 12)], SX[5], .17, 'center', 'bottom', .125]],
      [[[job('outCheck', 12.6, 14), gate(12.75, 14), job('outTrans', 12.75, 14)], SX[6], .375, 'center', 'bottom', .16],
        [[{...job('outbound', 13, 14), keep: true}], SX[6], .655, 'center', 'top', .16]]
    ];
    groups.forEach((list, s) => {
      if (!F.portrait) { list.forEach(([items, X, Y, align, v, wide]) => stack(items, X, Y, align, v, w * wide)); return; }
      const side = list.filter(([items]) => !items.some(it => it.keep)).flatMap(([items]) => items);
      const xs = P(0, .46)[0];
      stack(side, SX[s], .46, 'right', 'middle', xs - 10);
      list.filter(([items]) => items.some(it => it.keep)).forEach(([items]) => {
        const x = P(0, .565)[0];
        stack(items, SX[s] - .05, .565, 'left', 'middle', w * .97 - x - 4);
      });
    });

    // Who carries the work: no station has an owner, so the nearest agent takes it on.
    hops.forEach((hop, i) => {
      const on = ramp(u, hop.t0 - .4, hop.t0 - .2) * (1 - ramp(u, hop.t1 + .2, hop.t1 + .45));
      if (on <= 0) return;
      const k = plan.carriers[i], p = ghostAt(k, u), item = [{text: (i ? wd.hopNext : wd.hopFirst).replace('{c}', dna[ghosts[k].co].name), on, show: 'flash', c: ghosts[k].c, size: .82}];
      if (F.portrait) { const x = P(0, .56)[0]; stack(item, (SX[hop.a] + SX[hop.b]) / 2, .56, 'left', 'middle', w * .97 - x - 4); }
      else stack(item, p[0], LINE + .04, 'center', 'middle', w * .3);
    });

    // Alignment: every agent, of whichever company, checks the same standard before it works;
    // the one that does not match is marked, and at the end it is found and set apart.
    const alignOn = ramp(u, 1.55, 1.8) * (1 - ramp(u, 2.7, 2.95));
    if (F.portrait) stack([{text: wd.legend, on: alignOn, show: 'flash'}], ...F.at(w * .03, lay.legendY), 'left', 'top', w * .9);
    else stack([{text: wd.legend, on: alignOn, show: 'flash'}], .06, .012, 'left', 'middle', w * .62);

    // The DNA row at the top: each company's strand and name. The company whose agent is
    // carrying the question at that moment is underlined.
    {
      const fs = F.font * (F.portrait ? .9 : .92), hl = F.portrait ? 11 : 15, ha = F.portrait ? 2.6 : 3.4;
      const carrying = hops.findIndex(hop => u >= hop.t0 - .4 && u <= hop.t1 + .45);
      const now = carrying < 0 ? -1 : ghosts[plan.carriers[carrying]].co;
      g.save();
      g.textBaseline = 'middle'; g.textAlign = 'left';
      g.font = fs.toFixed(1) + 'px "Exhibit Label", sans-serif';
      // The row runs the width of the space; the site's buttons are above it, outside the work.
      const left = F.portrait ? w * .03 : P(.06, 0)[0], right = w * .97, gap = F.portrait ? 12 : 18, rowH = F.portrait ? 16 : 19;
      let x = left, y = F.portrait ? h * .034 : h * .018;
      g.fillStyle = rgba(human, .85);
      if (F.portrait && g.measureText(wd.dnaTitle).width > right - left) {
        const cut = wd.dnaTitle.indexOf(' — ');
        g.fillText(wd.dnaTitle.slice(0, cut + 2), x, y); y += rowH;
        g.fillText(wd.dnaTitle.slice(cut + 3), x, y);
      } else g.fillText(wd.dnaTitle, x, y);
      if (F.portrait) y += rowH; else x += g.measureText(wd.dnaTitle).width + gap;
      const start = x;
      dna.forEach((d, i) => {
        const tw = g.measureText(d.name).width, need = ha * 2 + 6 + tw;
        if (x + need > right) { x = F.portrait ? left : start; y += rowH; }
        helix(x + ha, y, hl, ha, u * 1.6 + i * .8, d, 1);
        const on = i === now ? 1 : 0;
        g.font = (on ? '500 ' : '') + fs.toFixed(1) + 'px "Exhibit Label", sans-serif';
        g.fillStyle = rgba(d.c, .82 + .18 * on); g.fillText(d.name, x + ha * 2 + 6, y);
        if (on) { g.fillStyle = rgba(d.c, .8); g.fillRect(x + ha * 2 + 6, y + fs * .72, tw, 1); }
        g.font = fs.toFixed(1) + 'px "Exhibit Label", sans-serif';
        x += need + gap;
      });
      g.restore();
    }
    const oddAt = ghostAt(plan.odd, u);
    const oddOn = ramp(u, 1.65, 1.9) * (1 - ramp(u, 2.7, 2.95));
    if (F.portrait) stack([{text: wd.odd, on: oddOn, show: 'flash', c: warm}], oddAt[0], oddAt[1] - .03, 'right', 'middle', w * .42);
    else stack([{text: wd.odd, on: oddOn, show: 'flash', c: warm}], oddAt[0], oddAt[1] - .03, 'center', 'bottom', w * .3);
    const found = ramp(u, 14.45, 14.7) * (1 - ramp(u, 15.75, 16));
    const detect = wd.detect + (u >= 15.35 ? ' → ' + wd.quarantine : '');
    if (F.portrait) stack([{text: detect, on: found, show: 'flash', c: warm}], oddAt[0], oddAt[1] - .03, 'right', 'middle', w * .5);
    else stack([{text: detect, on: found, show: 'flash', c: warm}], oddAt[0] - .014, oddAt[1], 'right', 'middle', w * .3);
    const traced = ramp(u, 14.15, 14.4) * (1 - ramp(u, 15.75, 16));
    if (F.portrait) stack([{text: '↑ ' + wd.trace, on: traced, show: 'flash'}], .165, .8, 'right', 'middle', w * .62);
    else stack([{text: '← ' + wd.trace, on: traced, show: 'flash'}], .5, .838, 'center', 'middle', w * .6);

    // What the work actually was, with the station named above it.
    const card = (rows, [, , X, Y, anchor, align, wide], a) => {
      if (a <= .004) return;
      const size = F.font * (F.portrait ? .98 : 1.02), gap = size * 1.42;
      const maxW = F.portrait ? w * .92 : Math.min(w * wide, 520);
      g.save();
      g.textBaseline = 'middle';
      g.shadowColor = 'rgba(8,14,20,.95)'; g.shadowBlur = 8;
      const lines = [];
      rows.forEach(([textLine, kind]) => {
        g.font = (kind === 1 ? '500 ' : '') + size.toFixed(1) + 'px "Exhibit Label", sans-serif';
        let cur = '';
        textLine.split(' ').forEach(part => {
          const next = cur ? cur + ' ' + part : part;
          if (g.measureText(next).width > maxW && cur) { lines.push([cur, kind]); cur = part; } else cur = next;
        });
        lines.push([cur, kind]);
      });
      let [x, y] = P(X, Y);
      if (anchor === 'bottom') y -= (lines.length - 1) * gap;
      if (F.portrait) { x = w * .5; y = lay.cardY; align = 'center'; }
      g.textAlign = align;
      const tones = [human, agent, agent, warm];
      lines.forEach(([t, kind], row) => {
        g.font = (kind === 1 ? '500 ' : '') + size.toFixed(1) + 'px "Exhibit Label", sans-serif';
        g.fillStyle = rgba(tones[kind], a);
        g.fillText(t, x, y + row * gap);
      });
      g.restore();
    };
    reads.forEach((spec, s) => card([[wd.heads[s], 1], ...wd.cards[s]], spec, ramp(u, spec[0], spec[0] + .2) * (1 - ramp(u, spec[1] - .2, spec[1]))));
    if (F.portrait) { g.save(); g.font = (F.font * .8).toFixed(1) + 'px "Exhibit Label", sans-serif'; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillStyle = rgba(line, .8); g.fillText(wd.example, w * .97, h * .975); g.restore(); }
    else label(wd.example, .94, .995, line, .8, .8, 'right');
    g.restore();
  }
  // Where the country's people, stations and watcher stand on screen, so a picture drawn before
  // the country (the eight servers) can come to rest exactly on them.
  function anchors(g, w, h, locale = 'ko') {
    const wd = words[locale] || words.ko;
    const F = frameOf(w, h, isPortrait(w, h) ? layOf(g, w, h, wd, locale) : null);
    return {inP: F.P(IN, LINE), outP: F.P(OUT, LINE), st: SX.map(X => F.P(X, LINE)), watcher: F.P(.5, .97), portrait: F.portrait};
  }
  window.CountryFlow = {draw, anchors};
})();
