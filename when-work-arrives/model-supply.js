(() => {
  'use strict';

  // Fictional suppliers, licences and installations for the exhibition. City ISO codes
  // locate the demonstration on the map. No registry, provider API or user data is read.
  const wording = (ko,en,es) => ({ko,en,es});
  const groupNames = {
    US:wording('미국','United States','Estados Unidos'), CN:wording('중국','China','China'),
    KR:wording('대한민국','South Korea','Corea del Sur'), KE:wording('케냐','Kenya','Kenia'),
    SN:wording('세네갈','Senegal','Senegal'), BR:wording('브라질','Brazil','Brasil'),
    ES:wording('스페인','Spain','España'), FJ:wording('피지','Fiji','Fiyi')
  };
  const localTerms = wording('공유 약정에 따라 가중치를 받아 내 거점에서 실행합니다. 원문은 그곳에 머뭅니다.',
    'The sharing agreement permits installing the weights here. The source material stays here.',
    'El acuerdo permite instalar aquí los pesos. El material original se queda aquí.');
  const retainedTerms = wording('이 거점에 이미 설치한 가중치와 계속 사용할 수 있는 약정이 있습니다. 새 다운로드나 공급자 접속 없이 여기서 실행합니다.',
    'The weights are already installed here under a continuing local-use licence. Running them needs no download or supplier connection.',
    'Los pesos ya están instalados aquí con una licencia de uso local vigente. Se ejecutan sin descargas ni conexión al proveedor.');
  const sharedTerms = wording('협약을 맺은 거점의 연산 시간을 나눕니다. 온이 허락한 합성 입력만 그 거점에서 처리할 수 있습니다.',
    'The partner offers compute time. It may process only the synthetic input On approves.',
    'El socio comparte tiempo de cómputo. Solo puede procesar la entrada sintética que autorice On.');
  const hostedTerms = wording('공급자가 운영하는 서비스에 접속합니다. 온이 허락한 합성 입력만 처리할 수 있습니다.',
    'Access is through the supplier’s hosted service. Only approved synthetic input may be processed.',
    'Se accede al servicio del proveedor. Solo se puede tratar la entrada sintética autorizada.');
  const access = {
    down:wording('이 공급권역에서 모델 공급이 중단됐습니다. 다른 도시를 거쳐도 이 모델을 호출할 수 없습니다.',
      'Supply from this jurisdiction is suspended. Routing through another city cannot call this model.',
      'El suministro de esta jurisdicción está suspendido. Pasar por otra ciudad tampoco permite usar este modelo.'),
    newWeightsStopped:wording('이 거점에 설치해 둔 사본이 없습니다. 공급 중단으로 새 가중치를 받을 수 없습니다.',
      'There is no copy installed here. New weights cannot be obtained while supply is suspended.',
      'Aquí no hay una copia instalada. No se pueden obtener pesos nuevos mientras esté suspendido el suministro.'),
    expired:wording('설치한 가중치가 남아 있어도 이 거점의 사용권은 만료됐습니다. 사용권을 갱신해야 실행할 수 있습니다.',
      'The installed weights remain here, but the local-use licence has expired. Running them requires a renewed licence.',
      'Los pesos instalados siguen aquí, pero la licencia local ha caducado. Es necesario renovarla para ejecutarlos.'),
    retained:wording('사용권이 유효한 설치본을 이 거점에서 계속 실행할 수 있습니다.',
      'A previously installed, licensed copy can continue to run here.',
      'La copia ya instalada puede seguir ejecutándose aquí con su licencia vigente.'),
    capacity:wording('이 환경의 연산 용량을 넘습니다. 경량 모델이나 협력 거점의 연산이 필요합니다.',
      'This installation exceeds the chosen device capacity. Use a compact model or a partner’s compute.',
      'Esta instalación supera la capacidad elegida. Se necesita un modelo ligero o el cómputo de un socio.'),
    licence:wording('이 사용 방식에 대한 모델 이용 약정이 없습니다.',
      'There is no model-use agreement for this mode.','No hay acuerdo de uso del modelo para esta modalidad.'),
    hosted:wording('모의 공급 계약이 유효하고 서비스에 접속할 수 있습니다.',
      'The simulated contract and service are available.','El contrato simulado y el servicio están disponibles.'),
    local:wording('가중치를 설치할 권리와 이 거점에서 실행할 연산 용량이 있습니다.',
      'Local installation is licensed and fits the selected capacity.',
      'La instalación local está autorizada y cabe en la capacidad elegida.'),
    shared:wording('협력 거점이 이 요청에 쓸 모델과 연산 시간을 함께 제공합니다.',
      'The partner offers an independently supplied model and compute time for this request.',
      'El socio ofrece un modelo de suministro independiente y tiempo de cómputo para esta solicitud.')
  };
  const catalogue = [
    ['us-north','US','newYork','hosted',false,wording('범용 모델 A','General model A','Modelo general A'),wording('뉴욕 공급자 A','New York supplier A','Proveedor A de Nueva York')],
    ['us-west','US','losAngeles','hosted',false,wording('범용 모델 B','General model B','Modelo general B'),wording('로스앤젤레스 공급자 B','Los Angeles supplier B','Proveedor B de Los Ángeles')],
    ['cn-east','CN','shanghai','hosted',false,wording('범용 모델 C','General model C','Modelo general C'),wording('상하이 공급자 C','Shanghai supplier C','Proveedor C de Shanghái')],
    ['kr-weights','KR','seoul','local',false,wording('서울 공유 모델','Seoul shared-weights model','Modelo de pesos compartidos de Seúl'),wording('서울 파운더리','Seoul foundry','Centro de modelos de Seúl')],
    ['ke-weights','KE','nairobi','local',true,wording('나이로비 경량 모델','Nairobi compact model','Modelo ligero de Nairobi'),wording('나이로비 파운더리','Nairobi foundry','Centro de modelos de Nairobi')],
    ['sn-pool','SN','dakar','shared',true,wording('다카르 협력 모델','Dakar cooperative model','Modelo cooperativo de Dakar'),wording('다카르 연산 협동조합','Dakar compute cooperative','Cooperativa de cómputo de Dakar')],
    ['br-pool','BR','recife','shared',true,wording('헤시피 협력 모델','Recife cooperative model','Modelo cooperativo de Recife'),wording('헤시피 공동 파운더리','Recife community foundry','Centro comunitario de modelos de Recife')],
    ['es-pool','ES','madrid','shared',true,wording('마드리드 협력 모델','Madrid cooperative model','Modelo cooperativo de Madrid'),wording('마드리드 공동 파운더리','Madrid community foundry','Centro comunitario de modelos de Madrid')],
    ['fj-weights','FJ','suva','local',true,wording('수바 경량 모델','Suva compact model','Modelo ligero de Suva'),wording('수바 섬 연합 파운더리','Suva island cooperative foundry','Centro insular cooperativo de modelos de Suva')]
  ].map(([id,group,cityId,mode,light,name,operator])=>({id,group,cityId,mode,light,name,operator}));

  // This is an offer order in a fictional agreement, never a claim about a
  // country's wealth, actual infrastructure, political alignment or model access.
  const partnerOffers = [
    ['sn-pool','BF BJ CI CV DZ EG EH GA GH GM GN GQ GW LR LY MA ML MR NE NG SC SL SN ST TD TG TN CM CF CG'],
    ['ke-weights','AO BI BW CD DJ ER ET KE KM LS MG MU MW MZ NA RE RW SD SO SS SZ TZ UG YT ZA ZM ZW'],
    ['br-pool','AG AI AR AW BB BL BM BO BQ BR BS BZ CA CL CO CR CU CW DM DO EC FK GD GF GL GP GS GT GY HN HT JM KN KY LC MF MQ MS MX NI PA PE PM PR PY SR SV SX TC TT US UY VC VE VG VI'],
    ['fj-weights','AS AU CC CK CX FJ FM GU KI MH MP NC NF NR NU NZ PF PG PN PW SB TK TL TO TV UM VU WF WS'],
    ['kr-weights','AF AZ BD BN BT CN GE HK ID IN IO IR JP KG KH KP KR KZ LA LK MM MN MO MV MY NP PH PK RU SG TH TJ TM TW UZ VN'],
    ['es-pool','AD AE AL AM AT AX BA BE BG BH BY CH CY CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IL IM IQ IS IT JE JO KW LB LI LT LU LV MC MD ME MK MT NL NO OM PL PS PT QA RO RS SA SE SI SJ SK SM SY TR UA VA XK YE']
  ];
  const localOffer = new Map();
  for (const [model,regions] of partnerOffers)
    for (const region of regions.split(' ')) localOffer.set(region,model);

  function groups(lang='ko'){
    const locale=['en','es'].includes(lang)?lang:'ko';
    return Object.entries(groupNames).map(([id,names])=>({id,label:names[locale]}));
  }
  function inspect(regionCode,options={}){
    const lang=['en','es'].includes(options.lang)?options.lang:'ko';
    const origin=String(regionCode||'').toUpperCase();
    const originCity=options.cityId||('region-'+origin);
    const blocked=new Set(options.blocked||[]);
    const rights=options.modes ? new Set(options.modes) : null;
    const installedIds=new Set(options.installed||[]),expiredIds=new Set(options.expired||[]);
    const candidates=catalogue.map(model=>{
      const local=model.mode==='local';
      const installed=local && installedIds.has(model.id);
      const expired=installed && expiredIds.has(model.id);
      const retained=installed && !expired;
      const upstreamClosed=blocked.has(model.group);
      const supplyBlocked=upstreamClosed && !retained;
      const exceeds=options.compact===true && local && !model.light;
      const permitted=!rights || rights.has(model.mode);
      const available=!expired && !supplyBlocked && !exceeds && permitted;
      const rule=expired?access.expired:retained?retainedTerms:local?localTerms:model.mode==='shared'?sharedTerms:hostedTerms;
      let reason=model.mode;
      if(expired)reason='expired';
      else if(supplyBlocked)reason=local?'newWeightsStopped':'down';
      else if(!permitted)reason='licence';
      else if(exceeds)reason='capacity';
      else if(retained)reason='retained';
      return {id:model.id,group:model.group,cityId:model.cityId,sourceCityId:model.cityId,
        executionCityId:model.mode==='local'?originCity:model.cityId,mode:model.mode,compact:model.light,
        name:model.name[lang],operator:model.operator[lang],terms:rule[lang],available,reason:access[reason][lang],
        installed,retained,expired,upstreamClosed,blockedBy:supplyBlocked?model.group:null};
    });
    const byId=new Map(candidates.map(option=>[option.id,option]));
    const baseline=byId.get(options.preferred)||candidates[0];
    const partner=localOffer.get(origin);
    const aligned=[...candidates.filter(c=>c.retained), byId.get(partner), ...candidates.filter(c=>c.mode!=='hosted'), ...candidates];
    const firstAvailable=aligned.find(c=>c?.available)||null;
    const choice=byId.get(options.choice);
    const selected=choice?.available ? choice : baseline.available ? baseline : firstAvailable;
    const status=!selected?'unavailable':selected.id===baseline.id?'available':'alternative';
    const title = {
      available:wording('어제 쓰던 모델을 이용할 수 있습니다.','Yesterday’s model is available.','El modelo de ayer está disponible.'),
      alternative:wording('다른 공급 기반에서 실행할 수 있습니다.','A different model supply is available.','Hay un modelo de otro origen disponible.'),
      unavailable:wording('지금 이어받을 수 있는 모델이 없습니다.','No eligible model is available now.','Ahora no hay un modelo disponible con permiso.')
    }[status][lang];
    const detail=options.held?wording('온이 보류한 요청은 여기에 머뭅니다. 다른 이들은 허락받은 일만 이어갈 수 있습니다.',
      'On’s held request stays here. Others can continue the work they have permission to do.',
      'La solicitud que On dejó en espera se queda aquí. Los demás pueden continuar sus tareas autorizadas.')[lang]:
      selected ? selected.terms : wording('공급 또는 이용 조건이 회복될 때까지 이 요청을 보류합니다.',
        'Hold the request until supply or permission is restored.','La solicitud queda en espera hasta que se restablezca el suministro o el permiso.')[lang];
    return {origin,baseline,selected,candidates,status,held:Boolean(options.held),title,detail};
  }
  window.ModelSupply=Object.freeze({inspect,groups});
})();
