(() => {
  'use strict';

  // A small, offline example-based interpreter. Only the fixed categories below can
  // enter a handoff. Input text and the temporary retrieval vectors stay in memory.
  const languages = ['ko', 'en', 'es'];
  const loc = (values, lang) => values[Math.max(0, languages.indexOf(lang))];
  const topics = ['work', 'living'];
  const examplesByLang = [
    ['일은 다시 구하고 싶어요. 그런데 이번 주에 방값 낼 돈이 모자라서 그쪽이 먼저예요.', '오래 다른 일을 했어요. 새 기술을 익혀 다시 시작하고 싶습니다.', '아침마다 아버지 곁을 지켜야 해요. 오후에 할 수 있는 일을 찾고 싶어요.'],
    ['I want to get back to work. But my rent is due this week and that comes first.', 'I spent years in another trade. I want to learn a new skill and start again.', 'I look after my father in the mornings. I want to find a job I can do in the afternoon.'],
    ['Quiero volver a trabajar. Pero esta semana vence el alquiler y eso va primero.', 'Llevo años en otro oficio. Quiero aprender algo nuevo para empezar de nuevo.', 'Por las mañanas cuido a mi padre. Quiero encontrar un empleo por las tardes.']
  ];

  const catalog = {
    housing: {
      topic: 'living', label: ['주거비', 'housing costs', 'coste de la vivienda'],
      mentions: /월세|방값|방세|집세|주거|세입자|임대료|보증금|잘 곳|묵을 곳|머물 곳|살 곳|집주인|\b(?:rent|housing|landlord|eviction|accommodation|somewhere to stay|place to sleep|place to live|alquiler|arriendo|vivienda|alojamiento|casero|desahucio)\b/,
      examples: [
        '다음 달에 살 집을 어떻게 마련할지 모르겠어요', '잠잘 곳이 마땅치 않아요', '방을 비워 달라는 연락을 받았어요', '이번 주에 방값 낼 돈이 모자라요',
        'I need somewhere to stay this weekend', 'I might lose the roof over my head', 'the landlord wants me out', 'my rent is coming due',
        'me han pedido que deje el piso', 'no tengo donde dormir', 'no puedo pagar el alquiler este mes', 'me voy a quedar sin techo'
      ],
      question: ['주거 상담을 받을 곳과 상담 전에 준비할 항목을 물어보세요.', 'Ask where to discuss housing costs and what to have ready for the conversation.', 'Pregunta dónde consultar los gastos de vivienda y qué conviene preparar.']
    },
    food: {
      topic: 'living', label: ['식사와 식료품', 'meals and groceries', 'comida y alimentos'],
      mentions: /밥 한 끼|밥 한끼|식비|식사비|먹거리|끼니|식료품|밥값|먹을 것|먹을 게|먹을게|먹지 못|\b(?:food|groceries|grocery|meals?|fridge|afford to eat|comida|alimentos|comer|nevera|despensa)\b/,
      examples: [
        '냉장고가 텅 비어서 오늘 저녁을 어떻게 할지 모르겠어요', '장 볼 돈이 남지 않았어요', '며칠째 밥을 제대로 못 먹었어요', '다음 급여일까지 먹고살 길이 막막해요',
        'there is nothing left in the fridge', 'I cannot put dinner on the table', 'I have run out of groceries',
        'tengo la nevera vacia', 'no me queda nada para la cena', 'no me alcanza para hacer la compra'
      ],
      question: ['가까운 식생활 지원 창구와 이용 가능한 시간을 물어보세요.', 'Ask which nearby service can discuss food needs and when it is available.', 'Pregunta qué servicio cercano orienta sobre alimentos y en qué horario.']
    },
    bills: {
      topic: 'living', label: ['생활비와 공과금', 'living costs and bills', 'gastos básicos y facturas'],
      mentions: /생활비|생활(?:과|이 |은 |을 |$)|생계|공과금|전기세|전기료|전기요금|전깃세|가스비|난방비|수도세|고지서|생활\s*지원|복지|\b(?:bills?|utilities|electricity|heating|expenses|benefits|welfare|living support|living costs|financial support|basic needs|facturas?|gastos|suministros|luz|calefaccion|ayuda social|ayudas sociales)\b/,
      examples: [
        '돈이 모자라 이번 달을 넘기기가 어려워요', '불이 끊긴다는 통지를 받았어요', '고정비를 감당하기 어려워요', '생활이 막막해요',
        'my power will be cut off', 'I need to make ends meet until the next pay day', 'I am falling behind on my expenses', 'I need help with everyday costs',
        'me van a cortar la luz', 'no llego a fin de mes', 'no puedo hacer frente a los gastos', 'necesito ayuda para el dia a dia'
      ],
      question: ['어떤 생활비가 급한지 정하고, 그 항목을 어디에서 상담할 수 있는지 물어보세요.', 'Pick the expense you want to discuss and ask which local office handles it.', 'Elige el gasto que te preocupa y pregunta qué servicio local puede orientarte.']
    },
    care: {
      topic: 'living', label: ['돌봄과 시간', 'care and availability', 'cuidados y horarios'],
      mentions: /돌봄|돌보|돌봐|간병|보육|아이를 봐|곁을 지켜|\b(?:childcare|child care|caregiving|caregiver|look after|looking after|care for|caring for|daycare|cuido|cuidar|cuidados|guarderia|a mi cargo)\b/,
      examples: [
        '낮에는 어머니 곁을 떠나기 어려워요', '아이를 맡길 데가 없어 시간을 내기 어려워요', '아버지가 혼자 계실 수 없어요',
        'I need someone to watch the kids', 'my mother needs me home every morning', 'I have a relative depending on me',
        'mi madre me necesita en casa por la mañana', 'no tengo con quien dejar a mis hijos', 'tengo un familiar a mi cargo'
      ],
      question: ['돌봄이 필요한 시간대를 정하고, 그 시간에 문의할 수 있는 지역 창구를 찾아보세요.', 'Note the hours when you provide care and ask about a local contact available around them.', 'Anota el horario de cuidados y pregunta qué servicio local puede atenderte en otro horario.']
    },
    training: {
      topic: 'work', label: ['새로운 기술 익히기', 'learning new skills', 'aprender un oficio'],
      mentions: /재교육|직업\s*훈련|훈련|자격증|배우고 싶|배워|기술을 익|기술을 배|직무 교육|\b(?:train(?:ing)?|retrain(?:ing)?|reskill|course|apprenticeship|qualification|new skill|learn a trade|formacion|formarme|curso|capacita\w*|aprender|reciclarme)\b/,
      examples: [
        '새로운 업종에서 처음부터 배우고 싶어요', '퇴직 후 새로운 기술을 익혀 다시 시작하고 싶어요', '해 본 적 없는 분야로 옮기려면 무엇부터 익힐까요',
        'I want to learn a different trade', 'I want to build the skills for a different career', 'I would like to retrain after leaving my industry',
        'quiero aprender otro oficio', 'me gustaria formarme para cambiar de sector', 'quiero adquirir nuevas habilidades'
      ],
      question: ['관심 있는 기술을 한 가지 정해, 해당 지역 훈련 과정의 시간표와 상담 방법을 물어보세요.', 'Name one skill you want to learn and ask about local training schedules and a first appointment.', 'Elige una habilidad y pregunta por horarios de formación y cómo pedir orientación.']
    },
    jobsearch: {
      topic: 'work', label: ['일자리 찾기', 'finding work', 'búsqueda de empleo'],
      mentions: /구직|일자리|일거리를|채용|이력서|재취업|취업|취직|일하고 싶|다시 일할|일할 곳|일을 (?:찾|구)|일은 (?:다시 )?구|직장을|\b(?:jobs?|jobseek\w*|employ(?:ment|er)|vacanc\w*|resume|back to work|find work|finding work|looking for work|return to work|empleo|trabajar|trabajo|vacantes?|curriculum|reincorporarme)\b/,
      examples: [
        '다시 출근할 곳이 있으면 좋겠어요', '전에 하던 일을 살릴 자리가 있을까요', '오후에 할 수 있는 일을 찾고 싶어요', '어디서 사람을 뽑는지 알고 싶어요',
        'who is hiring around here', 'I would like to get back on the payroll', 'I want to return to the workforce', 'I need help applying to vacancies',
        'quien esta contratando en mi zona', 'me gustaria volver al mercado laboral', 'quiero presentar mi candidatura a una empresa'
      ],
      question: ['해 보고 싶은 일과 가능한 시간을 적어, 가까운 창구에 채용 정보와 첫 상담 방법을 물어보세요.', 'Note one kind of work and the hours you can do. Ask a local adviser where to find openings and how to start.', 'Anota un trabajo que te interese y tu horario. Pregunta dónde se anuncian vacantes y cómo pedir orientación.']
    }
  };

  const regions = {
    KR: {
      label: ['대한민국', 'South Korea', 'Corea del Sur'],
      work: {name: ['고용복지플러스센터', 'Employment Welfare Plus Centers', 'Centros de empleo y bienestar'], href: 'https://www.workplus.go.kr/index.do', role: ['거주 지역에서 이용할 수 있는 고용센터를 찾습니다.', 'Find the employment center that covers your area.', 'Localiza el centro de empleo que atiende tu zona.']},
      living: {name: ['복지로', 'Bokjiro', 'Bokjiro'], href: 'https://www.bokjiro.go.kr/ssis-tbu/index.do', role: ['복지서비스 찾기에서 생활 여건에 맞는 안내와 문의처를 찾습니다.', 'Look up services and contact details by need in the Bokjiro directory.', 'Busca servicios y contactos según tu necesidad en el directorio de Bokjiro.']}
    },
    US: {
      label: ['미국', 'United States', 'Estados Unidos'],
      work: {name: ['미국 노동부 · American Job Centers', 'U.S. Department of Labor · American Job Centers', 'Departamento de Trabajo · American Job Centers'], href: 'https://www.dol.gov/general/topic/training/onestop', role: ['미국 노동부의 센터 찾기로 가까운 고용·훈련 상담 창구를 살펴봅니다.', 'Use the federal locator to find a local American Job Center for employment or training guidance.', 'Usa el localizador federal para encontrar un American Job Center de orientación laboral y formación.']},
      living: {name: ['USA.gov 생활 지원 안내', 'USA.gov · Government benefits', 'USA.gov · Ayudas públicas'], href: 'https://www.usa.gov/benefits/', role: ['해당 생활 지원 항목이나 주의 사회복지 기관을 찾습니다.', 'Look up the relevant support topic or your state social service agency.', 'Busca el tipo de ayuda o la agencia de servicios sociales de tu estado.']}
    },
    ES: {
      label: ['스페인', 'Spain', 'España'],
      work: {name: ['SEPE · 자치지역 고용서비스', 'SEPE · Regional employment services', 'SEPE · Servicios autonómicos de empleo'], href: 'https://sepe.es/HomeSepe/que-es-el-sepe/otras-webs_Lectura-Facil.html?param1=HomeSepe', role: ['SEPE의 자치지역 목록에서 관할 고용서비스를 찾습니다.', 'Find your regional public employment service in the SEPE directory.', 'Localiza el servicio público de empleo de tu comunidad en el directorio del SEPE.']},
      living: {name: ['지역 사회서비스 센터 안내', 'Local social services center map', 'Mapa de centros de servicios sociales'], href: 'https://www.dsca.gob.es/es/derechos-sociales/servicios-sociales/mapa-servicios-sociales/mapa-centros-atencion-primaria', role: ['사회권부의 지도에서 자치지역을 골라 가까운 사회서비스 창구를 찾습니다.', 'Choose an autonomous community on the ministry map to find its local social services contacts.', 'Selecciona tu comunidad autónoma en el mapa del ministerio para localizar el centro de servicios sociales.']}
    }
  };

  const messages = {
    uncertain: ['제가 어떤 도움부터 살펴야 할지 아직 모르겠습니다. 지금 바꾸고 싶은 일을 한 가지만 더 들려주세요.', 'I am unsure where to start. What would you most like to change right now?', 'Aún no sé por dónde empezar. ¿Qué te gustaría cambiar primero?'],
    work: ['일을 찾거나 배울 길을 먼저 살펴보자는 뜻으로 읽었습니다.', 'I read this as asking first about finding work or learning a skill.', 'He entendido que quieres empezar por el empleo o la formación.'],
    living: ['일상을 꾸려 가는 데 필요한 도움을 먼저 살펴보자는 뜻으로 읽었습니다.', 'I read this as asking first about support for everyday life.', 'He entendido que quieres empezar por el apoyo para la vida diaria.'],
    both: ['두 가지가 함께 얽혀 있어 두 곳의 답을 함께 살펴볼 수 있습니다.', 'Both needs appear together. You can compare what the two desks suggest.', 'Las dos necesidades se cruzan. Puedes comparar lo que propone cada servicio.'],
    laterWork: ['생활에 관한 일을 먼저 살피고, 구직·훈련은 그다음으로 두었습니다.', 'I placed everyday support first and employment or training afterwards.', 'He puesto primero el apoyo para la vida diaria y después la orientación laboral.'],
    laterLiving: ['구직·훈련을 먼저 살피고, 생활에 관한 일은 그다음으로 두었습니다.', 'I placed employment or training first and everyday support afterwards.', 'He puesto primero la orientación laboral y después el apoyo para la vida diaria.'],
    basis: ['온이 확인한 질문에 이 주제가 담겼습니다.', 'This topic is part of the question you confirmed.', 'Este tema forma parte de la consulta que has confirmado.']
  };

  const normalize = value => value.normalize('NFC').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC').replace(/[’‘]/g, "'");
  const stop = new Set('the and are for but that this would could want like need know can help please have has with from estoy quiero para puedo como que una con me esta algo tengo por del los las una estoy soy 싶어요 알려주세요 어떻게 무엇을 있는데 하고 싶습니다 있어요 어려워요 마땅치 않아요 싶어요 도움 있어요 모르겠어요 어려운데 필요한 도움이 필요해요 feeling looking unsure really something donde quien quiero algo estoy necesito dificil quisiera'.split(' '));
  function features(phrase) {
    const vector = new Set();
    for (const word of normalize(phrase).match(/[a-z가-힣]+/g) || []) {
      if (stop.has(word) || word.length < 2) continue;
      vector.add('=' + word);
      const size = /[가-힣]/.test(word) ? 2 : 3;
      for (let i = 0; i <= word.length - size; i++) vector.add(word.slice(i, i + size));
    }
    return vector;
  }

  // IDF-weighted nearest example retrieval also handles indirect descriptions
  // such as "nothing left in the fridge" or "잠잘 곳이 마땅치 않아요".
  const exemplars = [];
  const documentCounts = new Map();
  Object.entries(catalog).forEach(([facet, definition]) => {
    definition.examples.forEach(phrase => {
      const vector = features(phrase);
      vector.forEach(term => documentCounts.set(term, (documentCounts.get(term) || 0) + 1));
      exemplars.push({facet, vector});
    });
  });
  const idf = term => Math.log(1 + exemplars.length / (1 + (documentCounts.get(term) || 0)));
  function lengthSquared(vector) {
    let sum = 0;
    vector.forEach(term => { sum += idf(term) ** 2; });
    return sum;
  }
  exemplars.forEach(example => { example.norm = Math.sqrt(lengthSquared(example.vector)); });
  function nearestFacets(clause) {
    const query = features(clause);
    const norm = Math.sqrt(lengthSquared(query));
    if (!norm) return [];
    const ranked = exemplars.map(example => {
      let dot = 0, common = 0;
      query.forEach(term => {
        if (!example.vector.has(term)) return;
        common++;
        dot += idf(term) ** 2;
      });
      return {facet: example.facet, score: common < 3 ? 0 : dot / (norm * example.norm)};
    }).sort((a, b) => b.score - a.score);
    const best = ranked[0];
    const rival = ranked.find(item => item.facet !== best.facet);
    return best.score >= .34 && best.score - rival.score >= .075 ? [best.facet] : [];
  }

  // Keep the context of exclusions and sequencing close to the need it qualifies.
  // "No food left" and "cannot pay rent" express needs, not refusals of assistance.
  const rejected = /말고|제외|필요\s*없|필요하지 않|원하지 않|(?:할 |받을 |볼 |구할 |찾을 )?(?:생각|계획|걱정|문제|부담|의사|의향)(?:은|는|이|가|도)?\s*없|안\s*(?:찾|구하|알아보)|(?:찾|구하|알아보)지\s*않|원치 않|괜찮|(?:일자리|직장|직업|취업자리)(?:는|은|가|이)?\s*(?:이미\s*)?(?:있|구했)|(?:구직|일자리|취업|생활비|월세|식비)(?:은|는)?\s*됐|해결(?:됐|했|되었)|\b(?:do not need|don't need|don't want|do not want|no longer need|not looking for|not (?:a |any |the )?(?:job|jobs|housing|training|food|benefits|rent|childcare)|not (?:needed|required)|no help with|is (?:fine|sorted|covered)|already (?:have|found|sorted)|have a (?:steady )?job|no (?:necesito|quiero|busco|el empleo|la vivienda|el trabajo)|ya tengo (?:trabajo|empleo|vivienda)|(?:ya )?(?:resuelt[oa]|solucionad[oa]))\b/;
  const priority = /먼저|우선|급하|급해|급한|급합니다|당장|급해서|오늘까지|오늘 밤|내일까지|이번\s*주|\b(?:first|priority|urgent|right now|this week|tonight|due tomorrow|due today|primero|urgente|prioridad|esta semana|esta noche|vence manana)\b/;
  const deferred = /나중|다음에|그다음|후순위|미루|되면|안 되면|다음 달부터|\b(?:later|can wait|afterwards|eventually|not yet|not now|as a fallback|if that fails|next month|despues|puede esperar|mas adelante|todavia no|si eso falla|el mes que viene)\b/;
  function clauses(text) {
    return normalize(text)
      .replace(/(말고|제외하고|필요 없고|필요없고|필요 없어요|해결됐고|괜찮고|아니고|나중에(?:요)?|그다음에요|겠지만|지만|싶고|됐고|아니라|필요한데|걱정인데|고민인데|없고|하는데|있는데)\s*/g, '$1|')
      .replace(/(대신에|대신)\s*/g, ' 말고|')
      .replace(/(보다는|보다)\s*/g, ' 나중|먼저 ')
      .replace(/\b(before|antes (?:que|de))\s+/g, '|later ')
      .replace(/\b(rather than|instead of|en vez de)\s+/g, '|not looking for ')
      .split(/[.!?;|,，。！？\n]+|\s+(?:but|however|then|and then|and|instead|pero|sino|luego|y despues|y|그런데|근데|대신|그리고|다만|반면)\s+/)
      .map(part => part.trim()).filter(Boolean);
  }
  function analyze(input, lang = 'ko') {
    const order = new Map();
    const parts = clauses(String(input || '').slice(0, 1600));
    for (const part of parts) {
      const direct = Object.keys(catalog).filter(id => catalog[id].mentions.test(part))
        .sort((a, b) => part.search(catalog[a].mentions) - part.search(catalog[b].mentions));
      // In “job training”, job describes the course, not a second request.
      if (direct.includes('training') && direct.includes('jobsearch') && /\bjob training\b/.test(part) && !catalog.jobsearch.mentions.test(part.replace(/\bjob training\b/g, ''))) {
        direct.splice(direct.indexOf('jobsearch'), 1);
      }
      const found = direct.length ? direct : nearestFacets(part);
      const resolved = rejected.test(part) || /아니[고라]$/.test(part);
      const lacksWork = /\b(?:don't|do not|no longer) have a (?:steady )?job\b/.test(part);
      const denial = resolved && !lacksWork;
      const weight = deferred.test(part) ? -1 : priority.test(part) ? 1 : 0;
      found.forEach(facet => {
        if (denial) order.delete(facet);
        else order.set(facet, Math.max(order.get(facet) ?? -2, weight));
      });
    }
    const relevant = Array.from(order.entries()).sort((a, b) => b[1] - a[1]);
    const resultFacets = relevant.map(([id]) => id);
    const foundTopics = Array.from(new Set(resultFacets.map(id => catalog[id].topic)));
    const primary = foundTopics[0] || null;
    const priorityExplicit = foundTopics.length > 1 && relevant[0][1] > relevant.find(([id]) => catalog[id].topic !== primary)[1];
    let reason = primary || 'uncertain';
    if (foundTopics.length > 1) reason = !priorityExplicit ? 'both' : primary === 'work' ? 'laterLiving' : 'laterWork';
    return {primary, topics:foundTopics, facets:resultFacets, clarify:!primary, priorityExplicit, reason:loc(messages[reason], lang)};
  }

  function facetsFor(chosen, ids) {
    return [...new Set(ids || [])].filter(id => Object.hasOwn(catalog, id) && chosen.includes(catalog[id].topic));
  }
  function sources(region, lang, chosen, analysis = {}) {
    if (!Object.hasOwn(regions, region)) return [];
    return [...new Set(chosen || [])].filter(topic => topics.includes(topic)).map(topic => {
      const desk = regions[region][topic];
      const ids = facetsFor([topic], analysis.facets);
      const focus = ids.length ? ids : [topic === 'work' ? 'jobsearch' : 'bills'];
      return {
        id: region + '-' + topic, topic, href:desk.href, name:loc(desk.name, lang), role:loc(desk.role, lang),
        next:focus.map(id => loc(catalog[id].question, lang)).join(' '),
        why:loc(messages.basis, lang) + (ids.length ? ' ' + ids.map(id => loc(catalog[id].label, lang)).join(' · ') : '')
      };
    });
  }
  window.CounselEngine = Object.freeze({
    analyze, sources, facetsFor,
    regions: lang => Object.entries(regions).map(([id, region]) => ({id, label:loc(region.label, lang)})),
    examples: lang => loc(examplesByLang, lang).slice(),
    facets: (ids, lang) => facetsFor(topics, ids).map(id => loc(catalog[id].label, lang))
  });
})();
