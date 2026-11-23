(() => {
  'use strict';
  const plans = [
    // Monthly costs use an index with 100 as the unchanged baseline.
    {id:'contracts', setup:1.2, recurring:4, ramp:2, efficiency:0, learning:0, exits:[]},
    {id:'reviews', setup:3.8, recurring:5.2, ramp:3, efficiency:.09, learning:.12, exits:[]},
    {id:'dispatch', setup:1.8, recurring:3.4, ramp:2, efficiency:.045, learning:.04, exits:[]},
    {id:'vacancies', setup:1.5, recurring:1.2, ramp:2, efficiency:0, learning:.03, exits:[2,4]},
    {id:'phases', setup:2.4, recurring:1.8, ramp:3, efficiency:.035, learning:.06, exits:[2,2,4,4]}
  ];
  const delivery = [plans[0],plans[1],plans[2]], review = [plans[0],plans[3],plans[4]];
  const colors = ['#94c9bd','#92aeca','#d2b17e'];
  const words = {
    ko:{
      titles:['고용을 지키며 비용을 줄이는 세 가지 길','인원 변화가 비용과 납기에 미치는 영향'],
      subtitle:(branch,orders,months)=>`월 ${orders}건, ${months}개월의 주문을 가정합니다. ${branch ? '인사기획과 운영' : '구매와 운영'} 영토가 이 합성 자료를 받아 세 가지 안의 비용과 납기를 비교합니다.`,
      horizon:'검토 기간', months:['3개월','6개월','12개월'], demand:'예상 주문량', demandNames:['10% 감소','기준 주문량','15% 증가'],
      chart:'월별 추이', axes:['누적 순절감','월말 미처리 주문'], units:['비용 지수','건'], month:'개월',
      metrics:['순절감률','기말 인원','최고 업무 부하','기한 내 처리'], people:'명', choose:'자세히 볼 안을 고르세요', selected:'선택한 안',
      assumptions:'가정과 계산 기준', assumptionText:'한 달 비용을 100으로 둔 가상의 사업장입니다. 40명이 한 달에 주문 100건을 처리할 수 있고, 기준 주문은 92건입니다. 순절감률에는 준비와 전환 비용을 반영했습니다. 업무 부하는 그달 새 주문과 밀린 주문을 처리 능력으로 나눈 값입니다. 오래된 주문부터 처리합니다.',
      assumptionsSpec:'각 안의 가정', setup:'준비 비용', recurring:'월간 운영비 절감', ramp:'효과가 자리 잡는 기간', limit:'상시 인력 한 명의 월 비용을 지수 1.4로 계산합니다. 두 단계 감축 시나리오에는 줄어든 자리당 전환 비용 2를 더합니다. 인원은 팀 전체 합계로만 계산합니다.',
      detail:'다음 달까지 이어서 시험하기', tail:'다음 달 지원', choices:['현재 조건 유지','한 달간 처리 지원'], tailNote:'처리 지원은 한 달에 주문 12건을 더 처리하며 비용 지수 2가 듭니다.',
      outcome:['다음 달 순절감','다음 달 말 미처리','다음 달 기한 내 처리'], record:'이 조건으로 검토 기록', recorded:'검토 기록에 담았습니다', records:'이 장면의 검토 기록', recordTitle:'기록한 안', previous:'이전 기록', again:'이 조건 다시 보기', current:'이번 방문에 기록한 가상 시나리오입니다.',
      data:{
        contracts:['구매·구독 계약 조정','같은 자재의 발주를 모으고 쓰지 않는 구독을 정리합니다. 팀 인원과 처리 능력은 그대로입니다.'],
        reviews:['중복 검수 통합','두 번 하던 검수를 합칩니다. 첫 달은 교육으로 처리량이 줄고, 이후 같은 인원으로 더 많은 주문을 처리합니다.'],
        dispatch:['발주·출고 일정 조정','발주와 출고 날짜를 모아 긴급 배송을 줄입니다. 준비 기간을 지나면 같은 팀이 조금 더 처리할 수 있습니다.'],
        vacancies:['빈자리의 충원 유예','둘째 달과 넷째 달에 한 명씩 떠난다는 가정입니다. 두 자리를 비워 두면 남은 팀의 처리 여력이 줄어듭니다.'],
        phases:['두 단계로 네 자리 감축','둘째 달과 넷째 달에 두 자리씩 줄이는 경우입니다. 전환 비용과 업무 재배치 시간을 함께 계산합니다.']
      }
    },
    en:{
      titles:['Three ways to save while keeping the team','What changes when a team gets smaller?'],
      subtitle:(branch,orders,months)=>`The scenario assumes ${orders} orders a month for ${months} months. The ${branch ? 'workforce planning' : 'purchasing'} and operations territories use these synthetic figures to compare costs and delivery across three plans.`,
      horizon:'Time horizon', months:['3 months','6 months','12 months'], demand:'Expected orders', demandNames:['10% fewer','Baseline orders','15% more'],
      chart:'Month by month', axes:['Cumulative net savings','Orders pending at month end'], units:['cost index','orders'], month:'mo',
      metrics:['Net savings','Staff at end','Peak workload','On time'], people:'people', choose:'Choose a plan to examine', selected:'Selected plan',
      assumptions:'Assumptions and calculations', assumptionText:'Monthly costs start at 100 in this fictional workplace. A team of 40 can handle 100 orders a month, with 92 arriving under baseline demand. Net savings include setup and transition costs. Workload divides incoming and outstanding orders by available capacity. The oldest orders are filled first.',
      assumptionsSpec:'Plan assumptions', setup:'Setup cost', recurring:'Monthly operating savings', ramp:'Months to full effect', limit:'Each permanent position costs 1.4 index points a month. The two-stage reduction includes a one-off transition cost of 2 points per post removed. Staffing is calculated at team level.',
      detail:'Test one more month', tail:'Support next month', choices:['Continue as planned','Add one month of support'], tailNote:'Extra help can handle 12 more orders for 2 cost-index points that month.',
      outcome:['Net savings next month','Orders still pending','On time next month'], record:'Record this scenario', recorded:'Added to your review', records:'Reviews during this visit', recordTitle:'Recorded plan', previous:'Earlier reviews', again:'Reopen these conditions', current:'This record is a fictional scenario for this visit.',
      data:{
        contracts:['Review supply and software contracts','Pool orders for the same materials and retire unused subscriptions. Team size and processing capacity stay steady.'],
        reviews:['Combine duplicate checks','Bring two inspections together. Training slows the first month, then the same team can handle more orders.'],
        dispatch:['Coordinate orders and dispatch','Bundle purchases and shipping dates to reduce rush deliveries. After setup, the same team can handle slightly more work.'],
        vacancies:['Leave two vacancies open','One departure is assumed in month two and another in month four. Leaving the posts open reduces the capacity of the remaining team.'],
        phases:['Remove four posts in two stages','Model two fewer posts in month two and two more in month four. The simulation includes transition costs and time to reassign work.']
      }
    },
    es:{
      titles:['Tres formas de ahorrar manteniendo el empleo','¿Qué cambia cuando se reduce el equipo?'],
      subtitle:(branch,orders,months)=>`El caso supone ${orders} pedidos al mes durante ${months} meses. Los territorios de ${branch ? 'planificación de personal' : 'compras'} y operaciones comparan los costes y plazos de tres planes con estos datos sintéticos.`,
      horizon:'Periodo', months:['3 meses','6 meses','12 meses'], demand:'Pedidos previstos', demandNames:['Un 10 % menos','Pedidos de referencia','Un 15 % más'],
      chart:'Mes a mes', axes:['Ahorro neto acumulado','Pedidos pendientes al cierre'], units:['índice de coste','pedidos'], month:'mes',
      metrics:['Ahorro neto','Plantilla al cierre','Carga máxima','A tiempo'], people:'personas', choose:'Elige un plan para examinarlo', selected:'Plan elegido',
      assumptions:'Supuestos y cálculos', assumptionText:'El coste mensual de referencia es 100. En esta empresa ficticia, 40 personas pueden atender 100 pedidos al mes y reciben 92 en el caso de referencia. El ahorro incluye la preparación y la transición. La carga divide pedidos nuevos y pendientes entre la capacidad disponible. Los pedidos más antiguos se atienden primero.',
      assumptionsSpec:'Supuestos del plan', setup:'Coste inicial', recurring:'Ahorro operativo mensual', ramp:'Meses hasta el pleno efecto', limit:'Cada puesto fijo cuesta 1,4 puntos mensuales. El plan de reducción en dos fases incluye 2 puntos de transición por puesto eliminado. El cálculo solo contempla el conjunto del equipo.',
      detail:'Probar un mes más', tail:'Apoyo el mes siguiente', choices:['Mantener las condiciones','Añadir un mes de apoyo'], tailNote:'El apoyo permite atender 12 pedidos más por 2 puntos de coste ese mes.',
      outcome:['Ahorro del mes siguiente','Pedidos aún pendientes','A tiempo el mes siguiente'], record:'Registrar este escenario', recorded:'Escenario registrado', records:'Escenarios de esta visita', recordTitle:'Plan registrado', previous:'Registros anteriores', again:'Volver a estas condiciones', current:'Este escenario ficticio se conserva durante la visita.',
      data:{
        contracts:['Revisar contratos y suscripciones','Agrupar la compra de materiales y cancelar suscripciones sin uso. Se mantienen la plantilla y la capacidad.'],
        reviews:['Unificar revisiones duplicadas','Combinar dos inspecciones. La formación reduce la capacidad inicial y después el mismo equipo puede atender más pedidos.'],
        dispatch:['Coordinar pedidos y envíos','Agrupar compras y fechas de envío para reducir las entregas urgentes. Tras la preparación aumenta un poco la capacidad del equipo.'],
        vacancies:['Aplazar dos sustituciones','Se supone una salida en el segundo mes y otra en el cuarto. Dejar esas plazas vacantes reduce la capacidad del equipo restante.'],
        phases:['Reducir cuatro puestos en dos fases','Se eliminan dos puestos en el segundo mes y dos en el cuarto. Se incluyen el coste de transición y el tiempo para redistribuir el trabajo.']
      }
    }
  };
  const horizons = [3,6,12], factors = [.9,1,1.15];
  const newState = () => ({plan:-1,axis:0,help:0,records:[],methods:false});
  const studies = new WeakMap();
  function simulate(plan, months, incoming, extraMonth = 0) {
    const series = [{saved:0,backlog:0,people:40,load:0}];
    let spentLess = 0, dueOnTime = 0, peak = 0, backlog = 0;
    for (let m=1; m<=months; m++) {
      const exits = plan.exits.filter(n => n<=m).length;
      const leaving = plan.exits.filter(n => n===m).length;
      const uptake = Math.min(m/plan.ramp,1);
      const trainingLoad = plan.learning * Math.max(0,1-(m-1)/plan.ramp);
      const efficiency = 1 + plan.efficiency*uptake - trainingLoad;
      const capacity = Math.round((40-exits)*2.5*efficiency) + (m===extraMonth ? 12 : 0);
      peak = Math.max(peak,(incoming + backlog)/capacity);
      const onTime = Math.min(incoming,Math.max(0,capacity-backlog));
      dueOnTime += onTime;
      backlog = Math.max(0,backlog+incoming-capacity);
      const transition = plan.id==='phases' ? 2*leaving : 0;
      const monthly = plan.recurring*uptake + 1.4*exits - (m===1 ? plan.setup : 0) - transition - (m===extraMonth ? 2 : 0);
      spentLess += monthly;
      series.push({saved:spentLess,monthly,backlog,people:40-exits,load:100*peak,ontime:100*dueOnTime/(m*incoming),monthlyOnTime:100*onTime/incoming});
    }
    return series;
  }
  function render(host,{branch=0,lang='ko'}={}) {
    if (!host) return;
    const family = Number(branch)===1 ? 1 : 0;
    const locale = Object.hasOwn(words,lang) ? lang : 'ko';
    let exhibit = studies.get(host);
    if (!exhibit) {
      exhibit={months:6,demand:1,branches:[newState(),newState()]};
      studies.set(host,exhibit);
    }
    if (host.firstElementChild && exhibit.branch===family && exhibit.lang===locale) return;
    const methods = host.querySelector('.study-methods');
    if (methods && exhibit.branch!==undefined) exhibit.branches[exhibit.branch].methods=methods.open;
    exhibit.branch=family; exhibit.lang=locale;
    draw(host,exhibit);
  }
  function draw(host,exhibit,focusKey) {
    const {branch,lang,months,demand} = exhibit, copy=words[lang], state=exhibit.branches[branch];
    const set = branch ? review : delivery;
    const gate=window.ScopedHandoff,orders=Math.round(92*factors[demand]);
    const before=state.packet?.input;
    if(!before || before.months!==months || before.incoming!==orders){
      state.packet=gate.open('cost',{months,incoming:orders,branch},{purpose:'compare-costs'});
    }
    const scenario=gate.receive(state.packet,'operations'),incoming=scenario.incoming;
    const results=set.map(plan=>simulate(plan,scenario.months,incoming));
    const fmt = (n,d=1)=>new Intl.NumberFormat(lang,{maximumFractionDigits:d}).format(n);
    const signed = n=>(n>0?'+':'')+fmt(n);
    const percent = n=>fmt(n)+'%';
    const qty = (n,unit)=>fmt(n)+(lang==='ko'?'':' ')+unit;
    const money = n=>lang==='ko' ? '지수 '+signed(n) : signed(n)+' '+copy.units[0];
    const button = (key,value,label,pressed,extra='')=>`<button type="button" data-study="${key}" data-value="${value}" ${pressed===null?'':`aria-pressed="${pressed}"`} ${extra}>${label}</button>`;
    const controls = (label,key,items,selected)=>`<fieldset class="study-choices"><legend>${label}</legend>${items.map((item,i)=>button(key,i,item,i===selected)).join('')}</fieldset>`;
    function measures(m) {
      const values = [signed(m.saved/months)+'%',qty(m.people,copy.people),percent(m.load),percent(m.ontime)];
      return copy.metrics.map((key,i)=>`<span class="study-measure"><small>${key}</small><strong>${values[i]}</strong></span>`).join('');
    }
    function graph() {
      const key = state.axis ? 'backlog' : 'saved';
      const values = results.flatMap(points=>points.map(point=>point[key]));
      const ymin = Math.min(0,...values), ymax = Math.max(1,...values);
      const mapX=m=>48+630*m/months;
      const mapY=v=>102-85*(v-ymin)/(ymax-ymin);
      const paths = results.map((points,i)=>{
        const coordinates = points.map((p,m)=>[mapX(m).toFixed(1),mapY(p[key]).toFixed(1)].join(','));
        const path = coordinates.join(' ');
        const travel = 'M'+coordinates.join(' L');
        // Small offsets at the end leave coincident paths distinguishable.
        const last=mapY(points.at(-1)[key]);
        return `<g style="--study-color:${colors[i]};opacity:${state.plan<0 || state.plan===i ? 1 : .53}"><polyline class="study-curve" points="${path}" stroke-dasharray="${['none','5 3','2 3'][i]}" />${points.slice(1,-1).map((p,j)=>`<circle cx="${mapX(j+1)}" cy="${mapY(p[key])}" r="1.7" fill="var(--study-color)"/>`).join('')}<circle class="study-tracer" fill="var(--study-color)" r="2"><animateMotion dur=".72s" path="${travel}" fill="freeze"/></circle><circle class="study-end" cx="678" cy="${last}" r="${i===0?6:i===1?4:2}" /></g>`;
      }).join('');
      const tickValues=[0,...[ymin,ymax].filter(value=>Math.abs(mapY(value)-mapY(0))>=16)];
      const ticks=tickValues.map(n=>`<text x="38" y="${mapY(n)+3}" text-anchor="end">${fmt(n)}</text>`).join('');
      return `<figure class="study-figure"><figcaption>${copy.axes[state.axis]} <span>· ${copy.units[state.axis]}</span></figcaption><svg viewBox="0 0 716 126" role="img" aria-label="${copy.axes[state.axis]}"><path d="M48 ${mapY(0)}H688" class="study-axis"/>${paths}${ticks}<text x="48" y="121">0</text><text x="678" y="121" text-anchor="end">${months} ${copy.month}</text></svg></figure>`;
    }
    function detail() {
      if (state.plan<0) return '';
      const plan=set[state.plan], next=simulate(plan,months+1,incoming,state.help ? months+1 : 0).at(-1);
      const values=[money(next.monthly),qty(next.backlog,copy.units[1]),percent(next.monthlyOnTime)];
      return `<section class="study-follow"><p class="study-label">${copy.selected}</p><h3>${copy.data[plan.id][0]}</h3><p>${copy.data[plan.id][1]}</p><h4>${copy.detail}</h4>${controls(copy.tail,'help',copy.choices,state.help)}<p class="study-fine">${copy.tailNote}</p><div class="study-follow-values">${copy.outcome.map((key,i)=>`<div><small>${key}</small><strong>${values[i]}</strong></div>`).join('')}</div>${button('record',0,copy.record,null,'class="study-record"')}</section>`;
    }
    function recordLine(r,i) {
      const name={ko:'요청 가명',en:'Request alias',es:'Alias de la solicitud'}[lang];
      return `<div class="study-receipt"><strong>${copy.data[set[r.plan].id][0]}</strong><span>${name} ${r.alias} · ${copy.months[horizons.indexOf(r.months)]} · ${copy.demandNames[r.demand]} · ${copy.choices[r.help]}</span><span>${copy.metrics[0]} ${signed(r.net)}% · ${copy.outcome[1]} ${qty(r.backlog,copy.units[1])}</span>${button('restore',i,copy.again,null)}</div>`;
    }
    const last=state.records.length-1, choices=set.map((plan,i)=>{
      const main = `<span class="study-plan-title"><i style="--study-color:${colors[i]}"></i>${copy.data[plan.id][0]}</span><span class="study-measures">${measures(results[i].at(-1))}</span>`;
      return button('plan',i,main,state.plan===i,'class="study-plan"');
    }).join('');
    host.innerHTML=`<section class="cost-study" aria-label="${copy.titles[branch]}"><header><h2>${copy.titles[branch]}</h2><p>${copy.subtitle(branch,incoming,months)}</p></header><div class="study-options">${controls(copy.horizon,'months',copy.months,horizons.indexOf(months))}${controls(copy.demand,'demand',copy.demandNames,demand)}</div><div class="study-charts">${controls(copy.chart,'axis',copy.axes,state.axis)}${graph()}</div><fieldset class="study-plans"><legend>${copy.choose}</legend>${choices}</fieldset>${detail()}<details class="study-methods" ${state.methods?'open':''}><summary>${copy.assumptions}</summary><p>${copy.assumptionText}</p><ul>${set.map(plan=>`<li><strong>${copy.data[plan.id][0]}</strong> · ${copy.setup} ${fmt(plan.setup)}, ${copy.recurring} ${fmt(plan.recurring)}, ${copy.ramp} ${qty(plan.ramp,{ko:'개월',en:'months',es:'meses'}[lang])}</li>`).join('')}</ul><p>${copy.limit}</p></details>${last<0?'':`<section class="study-history" aria-label="${copy.records}"><h3 class="study-recorded-heading" tabindex="-1">${copy.recordTitle}</h3>${recordLine(state.records[last],last)}${last>0?`<details><summary>${copy.previous} (${last})</summary>${state.records.slice(0,-1).map(recordLine).reverse().join('')}</details>`:''}<p class="study-fine">${copy.current}</p></section>`}<p class="study-live" role="status"></p></section>`;
    host.onclick = event=>{
      const action=event.target.closest('[data-study]');
      if (!action || !host.contains(action)) return;
      const key=action.dataset.study, value=Number(action.dataset.value);
      state.methods=host.querySelector('.study-methods').open;
      if (key==='months') exhibit.months=horizons[value];
      if (key==='demand') exhibit.demand=value;
      if (key==='plan') state.plan=value;
      if (key==='axis') state.axis=value;
      if (key==='help') state.help=value;
      if (key==='restore') {
        const {plan,months,demand,help}=state.records[value];
        Object.assign(exhibit,{months,demand});
        Object.assign(state,{plan,help});
      }
      if (key==='record') {
        const {plan,help}=state;
        const future=simulate(set[plan],months+1,incoming,help ? months+1 : 0);
        const report=gate.returnTo(state.packet,'ON',{plan,net:future[months].saved/months,backlog:future[months+1].backlog});
        const snapshot={...report,months,demand,help,alias:state.packet.alias};
        const previous=state.records.at(-1);
        if (!previous || ['plan','months','demand','help'].some(field=>previous[field]!==snapshot[field])) state.records.push(snapshot);
      }
      draw(host,exhibit,{key,value});
      if (key==='record') {
        host.querySelector('.study-live').textContent=copy.recorded;
        const receipt=host.querySelector('.study-recorded-heading');
        receipt?.focus?.({preventScroll:true});
        receipt?.scrollIntoView?.({block:'nearest'});
      } else if (key==='restore') {
        const selected=host.querySelector(`[data-study="plan"][data-value="${state.plan}"]`);
        selected?.focus?.({preventScroll:true});
        selected?.scrollIntoView?.({block:'nearest'});
      }
    };
    if (focusKey) {
      const {key,value}=focusKey;
      const focused=host.querySelector(`[data-study="${key}"][data-value="${value}"]`);
      focused?.focus({preventScroll:true});
    }
  }
  window.CostStudy={render};
})();
