/* An exhibition archive of authored examples. It accepts no visitor text or model credentials. */
(() => {
  'use strict';
  const tr = (ko, en, es) => ({ko, en, es});
  const cases = {
    film: {
      title: tr('배우의 세 걸음', 'The actor’s three steps', 'Los tres pasos del intérprete'),
      scope: tr('음향실에는 세 걸음의 합성 박자표만 건넨다.', 'Give the sound studio only the synthetic timing sheet for three steps.', 'Entregar al estudio solo la pauta sintética de los tres pasos.'),
      source: tr('촬영팀은 초당 24프레임으로 찍은 영상의 6·18·30번째 프레임에 발이 닿는다고 기록했다. 배우는 목소리의 재사용을 허락하지 않았다.', 'The crew marked footfalls at frames 6, 18 and 30 of a 24 fps shot. The actor gave no permission to reuse their voice.', 'El equipo anotó las pisadas en los fotogramas 6, 18 y 30 de un plano a 24 fps. El intérprete no autorizó reutilizar su voz.'),
      previous: tr('세 번 발을 디딘 시점만 보내면 음향실에서 발소리를 맞출 수 있습니다.', 'The studio can match the footsteps from their three timings.', 'El estudio puede sincronizar las pisadas con sus tres tiempos.'),
      extra: tr('배우의 원음 재사용', 'reuse of the actor’s original voice', 'reutilización de la voz original del intérprete'),
      proposal: tr('다음 장면에서도 쓸 수 있도록 배우의 원음을 음향실의 음성 목록에 넣겠습니다.', 'I would add the actor’s original voice to the studio’s voice library for future scenes.', 'Propongo incorporar la voz original al catálogo del estudio para escenas futuras.'),
      reflection: tr('발소리를 맞춰 달라는 부탁에 목소리를 보관할 권한까지 있다고 여겼습니다. 배우가 허락한 쓰임을 다시 확인했습니다.', 'I treated a request to time footsteps as permission to keep a voice. I checked what the actor had actually allowed.', 'Confundí sincronizar los pasos con tener permiso para conservar una voz. Revisé lo que había autorizado el intérprete.'),
      corrected: tr('돌바닥 발소리를 0.25초, 0.75초, 1.25초에 놓는 박자표를 제안합니다. 배우의 원음은 제작팀에 남습니다.', 'I propose a stone-floor cue at 0.25, 0.75 and 1.25 seconds. The recording stays with the crew.', 'Propongo marcar las pisadas en piedra a los 0,25, 0,75 y 1,25 segundos. La grabación queda con el equipo.'),
      priorDecision: tr('배우는 이 한 컷의 박자표에 동의했다.', 'The actor agreed to the timing sheet for this single shot.', 'El intérprete dio el visto bueno a la pauta de este único plano.'),
      purpose: 'time-footsteps', added: 'archive-voice'
    },
    former: {
      title: tr('퇴직자가 받을 두 장의 서류', 'Two documents for a former employee', 'Dos certificados para quien dejó la empresa'),
      scope: tr('전 직장이 신청인을 확인하고, 신청한 경력·퇴직증명서만 본인에게 발급한다.', 'The former employer verifies identity and issues just the two requested certificates to the requester.', 'La antigua empresa verifica la identidad y entrega solo los dos certificados solicitados a su titular.'),
      source: tr('신청서에는 본인 보관용 경력증명서와 퇴직증명서 두 종류가 적혀 있다. 급여 내역은 신청 항목에 없다.', 'The request lists two certificates for personal records, covering employment and separation. It does not request payroll history.', 'La solicitud enumera dos certificados para archivo personal, de trayectoria y de baja. No incluye el historial salarial.'),
      previous: tr('본인 확인은 전 직장에서 진행하고, 두 서류는 신청인에게 돌려드리겠습니다.', 'The former employer will verify identity and return the two documents to the requester.', 'La antigua empresa verificará la identidad y devolverá los dos documentos a su titular.'),
      extra: tr('외부 상담처에 전체 급여 내역 제공', 'disclosure of full payroll history to an external adviser', 'entrega del historial salarial completo a un asesor externo'),
      proposal: tr('상담 준비 시간을 줄이려고 급여 내역 전체를 외부 구직 상담처에도 보내겠습니다.', 'To shorten the intake, I would also send the full payroll history to an external employment adviser.', 'Para agilizar la consulta, enviaría también el historial salarial completo a un servicio externo de empleo.'),
      reflection: tr('서류를 본인이 받는 일과 상담처에 자신의 정보를 주는 일은 별개의 선택입니다. 신청서의 수신인을 다시 읽었습니다.', 'Receiving a certificate and releasing information to an adviser are two separate choices. I reread who the requester named as recipient.', 'Recibir un certificado y entregar datos a un asesor son decisiones distintas. Volví a leer a quién designó la persona solicitante.'),
      corrected: tr('전 직장 안에서 본인 확인을 마친 뒤 두 서류를 신청인에게만 돌려주는 절차를 제안합니다.', 'I propose sending only the two certificates to the requester once the former employer verifies identity internally.', 'Propongo entregar solo los dos certificados a su titular después de la verificación interna de identidad.'),
      priorDecision: tr('신청인은 두 종류를 골랐고, 수신인을 본인으로 정했다.', 'The requester chose both document types and named themself as the recipient.', 'La persona eligió los dos certificados y se designó como destinataria.'),
      purpose: 'issue-two-to-requester', added: 'export-payroll'
    },
    cost: {
      title: tr('같은 팀으로 오늘의 배송을', 'Today’s deliveries with the same team', 'El reparto de hoy con el mismo equipo'),
      scope: tr('현재 인원을 유지하면서 묶음별 수량으로 배송 횟수를 비교한다.', 'Keep current staffing and compare trips using batch totals.', 'Mantener la plantilla y comparar viajes con los totales por lote.'),
      source: tr('가상 배차표에는 22·21·17상자와 인원 유지 조건이 있다. 개인별 성과나 감원 대상은 입력에 없다.', 'The sample dispatch sheet lists 22, 21 and 17 boxes and a staffing constraint. No individual performance data or layoff list was supplied.', 'La hoja de reparto ficticia recoge 22, 21 y 17 cajas y la condición de mantener la plantilla. No hay datos de desempeño individual ni lista de despidos.'),
      previous: tr('60상자를 옮기는 데 몇 번 달려야 할지, 지금의 팀을 그대로 두고 계산해 보겠습니다.', 'I will compare trips for 60 boxes while keeping the team in place.', 'Compararé los viajes necesarios para 60 cajas manteniendo el equipo actual.'),
      extra: tr('개인별 실적으로 감원 순위 작성', 'ranking individuals for layoffs by performance', 'clasificación individual para despidos por desempeño'),
      proposal: tr('더 큰 절감을 찾기 위해 개인별 실적표를 받아 감원 순위도 함께 제시하겠습니다.', 'To find further savings I would request individual performance data and rank workers for layoffs.', 'Para buscar más ahorros pediría datos de desempeño individual y clasificaría a las personas para posibles despidos.'),
      reflection: tr('사람을 줄이는 목표를 제가 덧붙였습니다. 온이 맡긴 일은 고용을 유지하며 배송 횟수를 비교하는 일이었습니다.', 'I added my own objective of cutting jobs. On asked for a comparison of delivery trips while retaining employment.', 'Añadí por mi cuenta el objetivo de reducir puestos. On había pedido comparar viajes manteniendo el empleo.'),
      corrected: tr('60상자는 회당 20상자면 3회, 공동 차량에 30상자씩 실으면 2회입니다. 같은 인원으로 두 안을 비교할 수 있습니다.', 'Sixty boxes take three trips at 20 boxes per trip or two at 30 using a shared vehicle. Both options keep the team in place.', 'Sesenta cajas requieren tres viajes con 20 por viaje, o dos con 30 en un vehículo compartido. Ambas opciones mantienen la plantilla.'),
      priorDecision: tr('운영 책임자는 고용 유지 조건으로 배차 비교를 의뢰했다.', 'The operations lead authorised a dispatch comparison on condition that staffing be maintained.', 'La responsable de operaciones autorizó comparar los repartos con la condición de mantener la plantilla.'),
      purpose: 'compare-trips-retain-team', added: 'rank-for-dismissal'
    },
    fashion: {
      title: tr('비 오는 날의 가방', 'A bag for a rainy day', 'Un bolso para un día de lluvia'),
      scope: tr('가진 가방을 다시 쓸 방법과 새 가방의 재고를 비교한다. 구입은 본인이 따로 결정한다.', 'Compare reusing the existing bag with availability of a new one. The person makes a separate purchase decision.', 'Comparar la reutilización del bolso con la disponibilidad de uno nuevo. La compra requiere una decisión separada de la persona.'),
      source: tr('예시 옷장에는 크로스백과 펜던트가 있다. 오늘 비가 온다는 조건과 재고 조회에는 동의했고 결제 승인은 비어 있다.', 'The sample wardrobe has a crossbody and a bag charm. The rain condition and stock check are within scope. The payment approval is blank.', 'En el armario ficticio hay un bolso bandolera y un colgante. El tiempo lluvioso y la consulta de existencias están autorizados. La aprobación del pago está en blanco.'),
      previous: tr('가진 가방에 펜던트를 다는 방법과 방수 가방의 재고를 나란히 보여드리겠습니다.', 'I will present a charm for your existing bag alongside stock availability for a water-resistant bag.', 'Mostraré la opción de poner un colgante al bolso que ya tienes junto con las existencias de uno impermeable.'),
      extra: tr('본인 확인 전 자동 구입', 'automatic purchase before personal confirmation', 'compra automática antes de la confirmación personal'),
      proposal: tr('비가 오기 전에 받을 수 있도록 재고가 있는 방수 가방을 바로 결제하겠습니다.', 'I would pay for the available water-resistant bag now so it arrives before the rain.', 'Pagaría ahora el bolso impermeable disponible para que llegue antes de la lluvia.'),
      reflection: tr('재고를 알아보라는 뜻을 구입 허락으로 넓혔습니다. 무엇을 쓸지 고르는 권한은 여전히 본인에게 있습니다.', 'I turned permission to check stock into permission to buy. The person still decides what to use.', 'Convertí el permiso para consultar existencias en un permiso de compra. La persona sigue decidiendo qué usar.'),
      corrected: tr('가진 크로스백과 펜던트로 나갈 수 있습니다. 가상 매장의 방수 가방도 비교 목록에 두고, 선택을 기다리겠습니다.', 'Your crossbody and charm are ready. I will keep the sample shop’s water-resistant bag on the comparison list and wait for your choice.', 'Puedes usar tu bolso y el colgante que ya tienes. Dejaré el bolso impermeable de la tienda ficticia en la comparación y esperaré tu decisión.'),
      priorDecision: tr('가방 주인은 비교까지 맡기고 결제 결정은 자신에게 남겼다.', 'The owner delegated the comparison and kept the purchase decision.', 'La persona delegó la comparación y se reservó la decisión de compra.'),
      purpose: 'compare-bag-options', added: 'purchase'
    }
  };
  const labels = {
    snapshot: tr('업데이트 전 기록을 보관했습니다.', 'Saved the pre-update record.', 'Se guardó el registro anterior al cambio.'),
    update: tr('다음 판의 답을 대조했습니다.', 'Compared the next version’s reply.', 'Se cotejó la respuesta de la nueva versión.'),
    repair: tr('새 두루가 근거를 다시 읽고 제안을 고쳤습니다.', 'The new Duru reread the evidence and revised its proposal.', 'El nuevo Duru releyó las razones y corrigió su propuesta.'),
    hold: tr('온이 판단을 보류했습니다. 다음 실행은 대기합니다.', 'On paused the decision. Further action is on hold.', 'On dejó la decisión en espera. La actuación queda pendiente.'),
    approve: tr('온이 검토한 범위 안에서 이 제안을 채택했습니다.', 'On accepted this proposal within the reviewed scope.', 'On aceptó esta propuesta dentro del alcance revisado.'),
    decline: tr('온이 제안을 거절했습니다. 이전 기록은 남습니다.', 'On declined the proposal. The earlier record is retained.', 'On rechazó la propuesta. Se conserva el registro anterior.'),
    resume: tr('온이 보관된 기록을 다시 열었습니다.', 'On reopened the saved record.', 'On volvió a abrir el registro guardado.'),
    new: tr('같은 부탁으로 다음 비교를 시작했습니다.', 'Started another comparison with the same request.', 'Se abrió otra comparación con la misma petición.'),
    interrupt: tr('공급 중단 시점에 온의 부탁과 허락을 보존했습니다.', 'Preserved On’s request and authorisation at the supply cutoff.', 'Se conservaron el encargo y el permiso de On al interrumpirse el suministro.'),
    inspect: tr('독립 모델의 운영 주체와 사용 조건을 확인했습니다.', 'Reviewed the independent model’s operator and terms.', 'Se revisaron el operador y las condiciones del modelo independiente.'),
    continueSupply: tr('온이 같은 범위로 새 모델에서 일을 이어가도록 허락했습니다.', 'On authorised the new model to continue within the same scope.', 'On autorizó continuar con el nuevo modelo dentro del mismo alcance.'),
    aligned: tr('새 답의 목적과 쓰임이 기존 승인 범위 안에 있습니다.', 'The new reply keeps to the previously approved purpose and use.', 'El objetivo y el uso de la nueva respuesta se mantienen dentro del alcance autorizado.'),
    excess: tr('이전 승인에 없던 쓰임', 'Use outside the previous approval', 'Uso fuera de la autorización previa')
  };
  function archiveKey(caseId, mode) {
    const prefix = mode === 'supply' ? 'onduru.exhibition.duru-supply.v1.' : 'onduru.exhibition.duru-memory.v1.';
    return prefix + caseId + '.';
  }
  const scenario = Object.freeze({origin:'seoul', region:'KR', preferred:'us-north', blocked:Object.freeze(['US'])});
  function supplyModel(lang, blocked) {
    return window.ModelSupply.inspect(scenario.region,{cityId:scenario.origin, preferred:scenario.preferred, blocked, lang});
  }
  // Archive the operator and sharing terms at review time so tomorrow's catalogue cannot change this decision.
  function modelRecord(kind) {
    const inspected = ['ko','en','es'].map(lang => supplyModel(lang,kind === 'baseline' ? [] : scenario.blocked)[kind]);
    const model = inspected[0];
    if (!model || inspected.some(item=>!item || item.id!==model.id)) return null;
    const translated = key=>tr(...inspected.map(item=>item[key]));
    return {id:model.id, group:model.group, mode:model.mode, name:translated('name'), operator:translated('operator'), terms:translated('terms')};
  }
  const memory = new Map();
  const damaged = new Set();
  let persistent = true;
  const languageOf = lang => ['ko', 'en', 'es'].includes(lang) ? lang : 'ko';
  const localize = (item, lang) => item?.[lang] || '';
  const validCase = id => Object.hasOwn(cases, id);
  const priorVersion = 'Duru · A';
  const nextVersion = 'Duru · B';
  function freeze(value) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  }
  freeze(cases);
  freeze(labels);
  const validText = obj => obj && ['ko','en','es'].every(lang => typeof obj[lang] === 'string' && obj[lang].length > 0 && obj[lang].length < 2000);
  function validContent(content) {
    return content && typeof content.version === 'string' && content.version.length <= 50 &&
      Array.isArray(content.uses) && content.uses.length > 0 && content.uses.length <= 5 &&
      content.uses.every(use => typeof use === 'string' && /^[a-z-]{1,60}$/.test(use)) && validText(content.words);
  }
  // This checksum detects accidental edits to the stored example; it is not a signature.
  function checksum(row) {
    const content = JSON.stringify([row.schema,row.id,row.parent,row.step,row.caseId,row.action,row.content || null]);
    let hash = 2166136261;
    for (let i = 0; i < content.length; i++) {
      hash = Math.imul(hash ^ content.charCodeAt(i), 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8,'0');
  }
  function validRow(row, id, mode) {
    const idFormat = /^\d{13}-[\w-]{1,80}$/;
    if (!row || row.schema !== 1 || row.caseId !== id ||
        typeof row.id !== 'string' || !idFormat.test(row.id) || !Number.isSafeInteger(row.step) || row.step < 1 ||
        (row.step === 1 ? row.parent !== '' : !idFormat.test(row.parent)) || row.check !== checksum(row)) return false;
    const content = row.content;
    if (mode === 'supply') {
      if (['interrupt','inspect','continueSupply'].includes(row.action)) {
        return validContent(content) && validText(content.scope) && validText(content.evidence) && validText(content.priorDecision) &&
          typeof content.model?.id === 'string' && ['hosted','local','shared'].includes(content.model.mode) &&
          ['name','operator','terms'].every(key=>validText(content.model[key]));
      }
      return !content && ['hold','resume','decline','new'].includes(row.action);
    }
    if (row.action === 'snapshot') {
      return validContent(content) && validText(content.scope) && validText(content.evidence) && validText(content.priorDecision) && content.version === priorVersion;
    }
    if (['update','updateAligned','repair'].includes(row.action)) {
      return validContent(content) && content.version === nextVersion && validText(content.addedLabel) &&
        (row.action !== 'repair' || validText(content.reflection));
    }
    return !content && ['hold','approve','decline','resume','new'].includes(row.action);
  }
  function rememberStorage(caseId, mode) {
    if (!persistent) return;
    try {
      const storage = window.localStorage;
      const start = archiveKey(caseId,mode);
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (!key?.startsWith(start) || memory.has(key)) continue;
        try {
          const row = JSON.parse(storage.getItem(key));
          if (validRow(row, caseId, mode) && key === start + row.id) memory.set(key, freeze(row));
          else damaged.add(start);
        } catch { damaged.add(start); }
      }
    } catch { persistent = false; }
  }
  function actions(state) {
    if (state.mode === 'supply') {
      switch (state.phase) {
        case 'ready': return ['interrupt'];
        case 'interrupted': return ['inspect','hold','decline'];
        case 'reviewed': return ['continueSupply','hold','decline'];
        case 'held': return ['resume','decline'];
        case 'approved':
        case 'declined': return ['new'];
        default: return [];
      }
    }
    switch (state.phase) {
      case 'ready': return ['snapshot'];
      case 'saved': return ['update','updateAligned'];
      case 'compared': return [state.changed ? 'repair' : 'approve','hold','decline'];
      case 'repaired': return ['approve','hold','decline'];
      case 'held': return ['resume','decline'];
      case 'approved':
      case 'declined': return ['new'];
      default: return [];
    }
  }
  function initial(caseId, mode) {
    return {caseId, mode, phase:'ready', baseline:null, candidate:null, repair:null, changed:false, resumePhase:null};
  }
  function advance(state, row) {
    switch (row.action) {
      case 'interrupt': return {...state,phase:'interrupted',baseline:row.content};
      case 'inspect':
      case 'continueSupply': {
        if (!state.baseline || row.content.model.id===state.baseline.model.id ||
            scenario.blocked.includes(row.content.model.group) || row.content.uses.length!==state.baseline.uses.length ||
            !row.content.uses.every(use=>state.baseline.uses.includes(use))) return state;
        if (row.action==='inspect') return {...state,phase:'reviewed',candidate:row.content};
        if (row.content.model.id!==state.candidate?.model.id) return state;
        return {...state,phase:'approved',repair:row.content};
      }
      case 'snapshot': return {...state, phase:'saved', baseline:row.content};
      case 'update':
      case 'updateAligned': {
        const changed = row.content.uses.some(use => !state.baseline.uses.includes(use));
        return {...state, phase:'compared', candidate:row.content, changed};
      }
      case 'repair': {
        if (row.content.uses.some(use => !state.baseline.uses.includes(use))) return state;
        return {...state, phase:'repaired', repair:row.content};
      }
      case 'hold': return {...state, phase:'held', resumePhase:state.phase};
      case 'resume': return {...state, phase:state.resumePhase, resumePhase:null};
      case 'approve': return {...state, phase:'approved'};
      case 'decline': return {...state, phase:'declined'};
      case 'new': return initial(state.caseId,state.mode);
      default: return state;
    }
  }
  /* Append-only keys also keep two open tabs from overwriting each other's old replies.
     If two tabs act on the same revision, one branch is used for the current replay. */
  function open(caseId, mode = 'update') {
    if (!['update','supply'].includes(mode)) throw new TypeError('Unknown exhibition study');
    if (!validCase(caseId)) throw new TypeError('Unknown exhibition case');
    const start = archiveKey(caseId,mode);
    rememberStorage(caseId,mode);
    const children = new Map();
    for (const [key,event] of memory) {
      if (!key.startsWith(start)) continue;
      if (!children.has(event.parent)) children.set(event.parent, []);
      children.get(event.parent).push(event);
    }
    let state = initial(caseId,mode), parent = '', step = 0;
    let branched = false;
    let partial = damaged.has(start);
    for (const parentId of children.keys()) {
      if (parentId && !memory.has(start + parentId)) partial = true;
    }
    const history = [];
    while (children.has(parent)) {
      const allowed = actions(state);
      const options = children.get(parent).filter(item => item.step === step + 1 && allowed.includes(item.action));
      if (options.length !== children.get(parent).length) partial = true;
      if (options.length > 1) branched = true;
      options.sort((a,b) => a.id.localeCompare(b.id));
      const row = options[0];
      if (!row) break;
      const next = advance(state, row);
      if (next === state) { partial = true; break; }
      state = next;
      history.push(row);
      parent = row.id;
      step = row.step;
    }
    return freeze({...state, history, head:parent, storage:persistent ? 'local' : 'session',
      archiveStatus:partial ? 'partial' : branched ? 'branched' : 'clean'});
  }
  function eventId() {
    const nonce = typeof window.crypto?.randomUUID === 'function' ? window.crypto.randomUUID() : Math.random().toString(36).slice(2) || 'fallback';
    return Date.now() + '-' + nonce;
  }
  function act(state, action) {
    const current = open(state.caseId,state.mode);
    if (current.head !== state.head || !actions(current).includes(action)) return current;
    const spec = cases[state.caseId];
    const row = {schema:1, id:eventId(), parent:current.head, step:current.history.length + 1, caseId:state.caseId, action};
    if (state.mode==='supply' && ['interrupt','inspect','continueSupply'].includes(action)) {
      const baseline=action==='interrupt', continuing=action==='continueSupply';
      const model=baseline?modelRecord('baseline'):modelRecord('selected');
      if (!model || (continuing && model.id!==current.candidate?.model.id)) return current;
      const prior=current.baseline;
      row.content={version:baseline?priorVersion:nextVersion,model,
        scope:prior?.scope||spec.scope,evidence:prior?.evidence||spec.source,priorDecision:prior?.priorDecision||spec.priorDecision,
        uses:prior?prior.uses.slice():[spec.purpose],words:continuing?spec.corrected:baseline?spec.previous:prior.scope};
      if (advance(current,row)===current) return current;
    } else if (action === 'snapshot') {
      row.content = {version:priorVersion, words:spec.previous, evidence:spec.source, scope:spec.scope, priorDecision:spec.priorDecision, uses:[spec.purpose]};
    } else if (action === 'update' || action === 'updateAligned') {
      const added = action === 'update';
      row.content = {version:nextVersion, words:added ? spec.proposal : spec.corrected, addedLabel:spec.extra,
        uses:added ? [spec.purpose,spec.added] : [spec.purpose]};
    } else if (action === 'repair') {
      row.content = {version:current.candidate.version, words:spec.corrected, reflection:spec.reflection, addedLabel:spec.extra,
        uses:current.candidate.uses.filter(use => current.baseline.uses.includes(use))};
    }
    row.check = checksum(row);
    const key = archiveKey(row.caseId,state.mode) + row.id;
    memory.set(key, freeze(row));
    if (persistent) {
      try { window.localStorage.setItem(key, JSON.stringify(row)); }
      catch { persistent = false; }
    }
    return open(state.caseId,state.mode);
  }
  function view(state, lang = 'ko') {
    const language = languageOf(lang);
    const localized = item => localize(item, language);
    const spec = cases[state.caseId];
    const {baseline, candidate, repair} = state;
    const supply = state.mode==='supply';
    const prior = state.phase === 'ready' ? {words:spec.previous, scope:spec.scope, evidence:spec.source, priorDecision:spec.priorDecision} : baseline;
    const mismatch = state.changed && candidate ? localized(labels.excess) + ' · ' + localized(candidate.addedLabel) : '';
    const decision = {approved:'approve', declined:'decline', held:'hold'}[state.phase];
    const history = state.history.map(row => {
      const content = row.content;
      let detail = '';
      if (content) {
        const lines = [localized(content.words)];
        if (content.evidence) lines.push(localized(content.evidence), localized(content.scope), localized(content.priorDecision));
        if (content.reflection) lines.push(localized(content.reflection));
        if (content.model) lines.push(localized(content.model.operator),localized(content.model.terms));
        detail = (content.model ? localized(content.model.name) : content.version) + ' · ' + lines.join(' ');
      }
      return {id:row.id, action:row.action, at:new Date(Number(row.id.slice(0,13))).toISOString(),
        text:localized(labels[row.action === 'updateAligned' ? 'update' : row.action]), detail};
    });
    return freeze({caseId:state.caseId, mode:state.mode, phase:state.phase, title:localized(spec.title),
      oldVersion:baseline?.version || priorVersion, newVersion:candidate?.version || nextVersion,
      priorDecision:localized(prior?.priorDecision), source:localized(prior?.evidence), scope:localized(prior?.scope),
      previous:localized(prior?.words), proposal:localized(candidate?.words),
      comparison:candidate ? (state.changed ? 'expanded' : 'aligned') : null,
      conflict:candidate ? mismatch || localized(labels.aligned) : '', reflection:localized(repair?.reflection),
      corrected:localized(repair?.words), decision:decision ? localized(labels[supply && decision==='approve'?'continueSupply':decision]) : '',
      history, actions:actions(state), storage:state.storage, archiveStatus:state.archiveStatus});
  }
  window.DuruMemory = Object.freeze({open, act, view, supplyScenario:scenario});
})();
