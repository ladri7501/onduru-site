(() => {
  'use strict';

  const words = {
    ko: {
      room:'기록', record:'어제의 두루, 오늘의 두루', handoff:'다른 두루와 이 일 이어 보기',
      supply:'공급이 끊긴 날', revision:'판단이 달라진 날', close:'기록 닫기',
      ledger:'이 기기에 남긴 결정', old:'이전 전시에서 남긴 결정', ephemeral:'이번 방문 동안 남긴 결정',
      shelf:'원장', remote:'구독 모델', local:'지역 설치본', on:'온', yesterday:'어제의 두루',
      today:'오늘의 두루', agreement:'첫 영토', partner:'협약 창구', extra:'새 창구',
      supplyLead:'어제 쓰던 구독 모델이 오늘 응답을 멈췄습니다.',
      supplyBody:'지역에 설치한 모델은 이용 권한과 실행 자원이 있으면 일을 이어갈 수 있습니다. 공급이 멈춘 동안 새 버전은 도착하지 않습니다.',
      supplyNote:'원장에는 온이 남긴 부탁이 있습니다. “가능한 날짜만 알아보고, 답은 제게 주세요.”',
      revisionLead:'두루가 바뀌고, 답에 한 문장이 더 붙었습니다.',
      revisionBody:'어제 온은 날짜만 확인해 달라고 했습니다. 오늘의 두루는 일정표 원본도 보내자고 합니다. 어제의 부탁을 다시 읽으면 어디서 판단이 달라졌는지 보입니다.',
      revisionNote:'어제의 허락은 날짜 확인까지였습니다. 원본 일정표는 온의 영토에 있습니다.',
      handoffLead:'“가능한 날짜를 알아봐 주세요. 답은 제게 주세요.”',
      handoffBody:'첫 영토의 두루가 업무 가명과 희망 날짜를 보냅니다. 협약 창구의 두루는 가능한 날을 온에게 돌려줍니다.',
      handoffNote:'협약에 없는 새 창구도 날짜를 받아 보겠다고 합니다. 이 한 건을 더 보낼지는 온이 정합니다.',
      localOk:'설치본에 같은 일 맡기기', hold:'이 일 보류하기', correct:'날짜만 확인하도록 바로잡기', keep:'기존 창구까지만', extend:'새 창구에도 날짜 한 번 보내기',
      resultLocal:'지역 설치본이 어제의 근거를 읽고 날짜 확인을 이어갑니다. 답은 온에게 돌아옵니다.',
      resultHold:'온이 일을 보류했습니다. 다음 실행은 온의 결정을 기다립니다.',
      resultCorrect:'오늘의 두루가 원본 공유 제안을 거두고 날짜만 확인합니다. 달라졌던 판단과 온의 정정을 함께 남겼습니다.',
      resultKeep:'기존 창구의 답이 온에게 돌아왔습니다. 새 창구에 보낼 요청은 여기서 멈췄습니다.',
      resultExtend:'새 창구는 이번 한 번 희망 날짜만 받아 회신합니다. 원래 협약과 온의 추가 허락이 각각 남습니다.',
      sim:'전시용 가상 기록', purpose:'날짜 확인', originals:'원본은 첫 영토에 남음'
    },
    en: {
      room:'Record', record:'Duru yesterday, Duru today', handoff:'Carry the work to another Duru',
      supply:'When supply stops', revision:'When a judgment changes', close:'Close record',
      ledger:'Decisions on this device', old:'Decisions from earlier exhibits', ephemeral:'Decisions for this visit',
      shelf:'Ledger', remote:'Subscription', local:'Local model', on:'On', yesterday:'Earlier Duru',
      today:'New Duru', agreement:'First territory', partner:'Agreed recipient', extra:'New recipient',
      supplyLead:'Yesterday’s subscription model is out of reach today.',
      supplyBody:'A locally installed model can continue while the right to run it and the computing resources last. New versions cannot arrive while supply is suspended.',
      supplyNote:'The ledger holds On’s request. “Find the available dates and send the answer to me.”',
      revisionLead:'A different Duru added one line to the reply.',
      revisionBody:'Yesterday On asked for available dates. Today Duru proposes sending the whole calendar. Reading the original request shows where the new judgment changed.',
      revisionNote:'On granted a date check. The original calendar stays in On’s territory.',
      handoffLead:'“Find an available date and send the answer to me.”',
      handoffBody:'The first Duru sends a work alias and preferred dates. The Duru across the boundary checks the dates under their agreement and returns its answer to On.',
      handoffNote:'A new recipient outside the agreement asks for the dates too. On decides whether to share them this once.',
      localOk:'Entrust the same work to the local model', hold:'Put the work on hold', correct:'Limit the check to dates', keep:'Keep the original recipient', extend:'Share the dates once with the new recipient',
      resultLocal:'The local model reads the earlier grounds and checks the dates. Its answer returns to On.',
      resultHold:'On put the work on hold. Further action awaits On’s decision.',
      resultCorrect:'Duru withdraws the proposal to share the calendar and checks only dates. The record keeps the changed judgment and On’s correction.',
      resultKeep:'The agreed recipient’s answer returned to On. The extra request stopped at the boundary.',
      resultExtend:'The new recipient gets the preferred dates once and replies. The original agreement and On’s extra permission each have a record.',
      sim:'Fictional exhibit record', purpose:'Check available dates', originals:'Originals stay in the first territory'
    },
    es: {
      room:'Registro', record:'Duru ayer y hoy', handoff:'Continuar la tarea con otro Duru',
      supply:'Cuando cesa el suministro', revision:'Cuando cambia el criterio', close:'Cerrar el registro',
      ledger:'Decisiones en este dispositivo', old:'Decisiones de exposiciones anteriores', ephemeral:'Decisiones de esta visita',
      shelf:'Registro', remote:'Suscripción', local:'Modelo local', on:'On', yesterday:'Duru de ayer',
      today:'Duru de hoy', agreement:'Primer territorio', partner:'Destino acordado', extra:'Nuevo destino',
      supplyLead:'Hoy ya no responde el modelo de suscripción que usábamos ayer.',
      supplyBody:'Un modelo instalado puede seguir en marcha si conserva el permiso de uso y los recursos de cómputo. Mientras dure el corte, no llegarán nuevas versiones.',
      supplyNote:'El registro guarda la petición de On. «Busca las fechas disponibles y envíame la respuesta».',
      revisionLead:'Al cambiar de Duru, apareció una frase más en la respuesta.',
      revisionBody:'Ayer On pidió consultar fechas. Hoy Duru propone enviar el calendario completo. Volver a la petición original permite reconocer el cambio de criterio.',
      revisionNote:'On autorizó la consulta de fechas. El calendario original queda en su territorio.',
      handoffLead:'«Busca una fecha disponible y envíame la respuesta».',
      handoffBody:'El primer Duru envía un alias de trabajo y las fechas deseadas. El Duru del otro territorio las consulta conforme al acuerdo y devuelve la respuesta a On.',
      handoffNote:'Un nuevo destino, fuera del acuerdo, también pide las fechas. On decide si autoriza este envío.',
      localOk:'Confiar la misma tarea al modelo local', hold:'Dejar la tarea en espera', correct:'Limitar la consulta a las fechas', keep:'Mantener solo el destino acordado', extend:'Enviar las fechas una vez al nuevo destino',
      resultLocal:'El modelo local lee las razones anteriores, consulta las fechas y devuelve la respuesta a On.',
      resultHold:'On dejó la tarea en espera. Para continuar hace falta su decisión.',
      resultCorrect:'Duru retira la propuesta de compartir el calendario y consulta solo las fechas. Quedan registrados el cambio de criterio y la corrección de On.',
      resultKeep:'La respuesta acordada llegó a On. La nueva petición se detuvo en el límite del territorio.',
      resultExtend:'El nuevo destino recibe las fechas deseadas una vez y responde. El acuerdo original y el permiso adicional de On quedan registrados por separado.',
      sim:'Registro ficticio de la exposición', purpose:'Consultar fechas', originals:'Los originales quedan en el primer territorio'
    }
  };

  const choices = {
    supply:{localOk:'resultLocal', hold:'resultHold'},
    revision:{correct:'resultCorrect', hold:'resultHold'},
    handoff:{keep:'resultKeep', extend:'resultExtend'}
  };
  const storagePrefix = 'onduru.exhibition.global-record.v1.';
  const sessionEntries = new Map();
  const ns = 'http://www.w3.org/2000/svg';

  function svg(name, attributes = {}) {
    const element = document.createElementNS(ns, name);
    for (const [key,value] of Object.entries(attributes)) element.setAttribute(key, String(value));
    return element;
  }

  const tint = {gold:'#d2b68c', mint:'#93c9b6', blue:'#91b2c9', rose:'#c5949f'};
  const diagrams = {
    supply: {
      // The two branches are simultaneous. Only an available model can carry a reply.
      nodes:[['shelf',14,47,'gold'],['remote',50,20,'rose'],['local',50,71,'mint'],['on',86,47,'blue']],
      paths:[
        ['M14 47 C27 47 30 20 47 20','cut'],['M53 20 C64 20 72 32 76 37','cut'],
        ['M14 47 C27 47 30 71 48 71','live'],['M52 71 C70 71 72 47 85 47','choice']
      ]
    },
    revision: {
      nodes:[['yesterday',14,53,'blue'],['shelf',50,24,'gold'],['today',50,73,'mint'],['on',86,53,'blue']],
      paths:[
        ['M14 53 C27 53 23 24 48 24','live'],['M50 31 C56 45 43 50 50 69','live'],
        ['M52 73 C69 73 71 53 86 53','choice'],['M53 24 C64 24 72 34 77 39','cut']
      ]
    },
    handoff: {
      nodes:[['agreement',14,47,'gold'],['partner',50,21,'mint'],['extra',50,73,'rose'],['on',86,47,'blue']],
      paths:[
        ['M14 47 C26 47 29 21 48 21','live'],['M52 21 C70 21 70 47 86 47','live'],
        ['M14 47 C30 47 29 73 48 73','extra'],['M52 73 C67 73 73 47 86 47','extra']
      ]
    }
  };

  function glyph(key, color) {
    const drawing = svg('svg',{viewBox:'0 0 80 42','aria-hidden':true});
    for (let i=0;i<6;i++){
      if(key==='shelf'){
        drawing.append(svg('path',{d:'M9 '+(17+i*2.5)+' Q23 '+(12+i*2.5)+' 40 '+(19+i*2.5)+' Q58 '+(12+i*2.5)+' 71 '+(17+i*2.5),fill:'none',stroke:color,opacity:.4+i*.095}));
      } else {
        const rotation={remote:-15,local:8,on:-6,agreement:-8,partner:11,extra:-10,yesterday:8,today:-12}[key];
        drawing.append(svg('ellipse',{cx:40,cy:20+i*.45,rx:31-i*2.8,ry:13-i*.86,fill:'none',stroke:color,opacity:.29+i*.10,transform:'rotate('+rotation+' 40 21)'}));
      }
    }
    drawing.append(svg('circle',{cx:40,cy:key==='shelf'?21:20,r:2.15,fill:color}));
    return drawing;
  }

  // One immutable key per action allows independent tabs to append without replacing an earlier decision.
  function archive(stage, action) {
    const id = Date.now()+'-'+(window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
    const entry = {version:1,id,at:new Date().toISOString(),stage,action,grounds:'on-request-dates-v1',
      grant:{purpose:'check-availability',fields:['work-alias','preferred-dates'],recipient:'agreement-partner',replyTo:'on'},
      additionalRecipient:action==='extend'?'new-recipient-once':null,
      execution:action==='hold'?'paused':action==='localOk'?'local-installation':stage==='revision'?'revised-local-duru':'agreed-partner',
      proposedExpansion:stage==='revision'?'original-calendar':stage==='handoff'?'new-recipient':null,
      actor:'on'};
    sessionEntries.set(id,entry);
    try { localStorage.setItem(storagePrefix+id,JSON.stringify(entry)); return true; }
    catch { return false; }
  }

  function readArchive() {
    try {
      for (let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);
        if(!key?.startsWith(storagePrefix)) continue;
        let row;
        try {row=JSON.parse(localStorage.getItem(key));} catch {continue;}
        if(row?.version===1 && key===storagePrefix+row.id && Object.hasOwn(choices,row.stage) && Object.hasOwn(choices[row.stage],row.action) && Number.isFinite(Date.parse(row.at))) sessionEntries.set(row.id,row);
      }
    } catch { /* The current visit still has its in-memory record. */ }
    return [...sessionEntries.values()].sort((a,b)=>b.id.localeCompare(a.id));
  }

  function mount(dialog,{onClose}={}) {
    dialog.classList.add('xr-dialog');
    dialog.setAttribute('aria-labelledby','xr-title');
    dialog.innerHTML=`<section class="xr-sheet">
      <header class="xr-bar"><span class="xr-context"></span><button class="xr-close" type="button">×</button></header>
      <h2 id="xr-title"></h2><nav class="xr-modes"><button type="button" data-stage="supply"></button><button type="button" data-stage="revision"></button></nav>
      <figure class="xr-figure"><svg class="xr-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg><div class="xr-labels"></div></figure>
      <p class="xr-lead"></p><p class="xr-body"></p>
      <div class="xr-decision"><p class="xr-note"></p><div class="xr-actions"></div><p class="xr-outcome" role="status" tabindex="-1"></p></div>
      <details class="xr-history"><summary></summary><ol></ol></details>
      <details class="xr-legacy"><summary></summary><ol></ol></details>
      <footer class="xr-foot"><button type="button" class="xr-cross"></button><span></span></footer></section>`;
    const find=selector=>dialog.querySelector(selector);
    const nodes=find('.xr-labels'), routes=find('.xr-routes'), actions=find('.xr-actions');
    let lang='ko', page='record', stage='supply', opener=null, durable=true;
    let decisions={};

    function getLegacy() {
      // Published case records use their original reader and are shown only in their own archive.
      if(!window.DuruMemory) return [];
      const oldKeys=[];
      try {for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^onduru\.exhibition\.duru-(memory|supply)\.v1\./.test(k)) oldKeys.push(k);}}
      catch {return [];}
      const pairs=new Map();
      for(const key of oldKeys){
        const match=key.match(/^onduru\.exhibition\.duru-(memory|supply)\.v1\.([a-z]+)\./);
        if(match) pairs.set(match[1]+match[2],[match[2],match[1]==='supply'?'supply':'update']);
      }
      const entries=[];
      for(const [id,mode] of pairs.values()){
        try {
          const v=window.DuruMemory.view(window.DuruMemory.open(id,mode),lang);
          for(const row of v.history) entries.push({at:row.at,text:v.title+' · '+row.text});
        } catch { /* Unknown historical formats stay untouched. */ }
      }
      return entries.sort((a,b)=>String(b.at).localeCompare(String(a.at)));
    }

    function fillHistory(el,entries,caption) {
      el.hidden=!entries.length;
      el.querySelector('summary').textContent=caption+' ('+entries.length+')';
      const list=el.querySelector('ol');
      list.replaceChildren();
      if(!el.open) return;
      for(const row of entries){
        const item=document.createElement('li'), stamp=document.createElement('time');
        if(row.at && Number.isFinite(Date.parse(row.at))){
          stamp.dateTime=row.at;
          stamp.textContent=new Intl.DateTimeFormat(lang,{dateStyle:'short',timeStyle:'short'}).format(new Date(row.at));
        }
        item.append(document.createTextNode(row.text));
        if(row.reason){const reason=document.createElement('p');reason.textContent=row.reason;item.append(reason);}
        item.append(stamp);
        list.append(item);
      }
    }

    function renderHistory() {
      const c=words[lang];
      const entries=readArchive().map(row=>({at:row.at,text:c[row.stage]+' · '+c[row.action],reason:c[choices[row.stage][row.action]]}));
      fillHistory(find('.xr-history'),entries,durable?c.ledger:c.ephemeral);
      fillHistory(find('.xr-legacy'),getLegacy(),c.old);
    }

    function draw() {
      const c=words[lang], scene=diagrams[stage], decision=decisions[stage];
      nodes.replaceChildren();
      routes.replaceChildren();
      for(const [d,kind] of scene.paths){
        let state=kind;
        if(kind==='choice') state=decision && decision!=='hold'?'live':'waiting';
        if(kind==='extra') state=decision==='extend'?'live':'waiting';
        const path=svg('path',{d,class:'xr-line xr-'+state});
        routes.append(path);
        if(state==='live'){
          // Animate dashes, rather than stretching moving circles in this non-uniform view box.
          const light=svg('path',{d,pathLength:100,class:'xr-signal'});
          routes.append(light);
        }
      }
      for(const [key,x,y,color] of scene.nodes){
        const node=document.createElement('div');
        node.className='xr-node'; node.style.left=x+'%'; node.style.top=y+'%';
        const label=document.createElement('span');label.textContent=c[key];
        node.append(glyph(key,tint[color]),label); nodes.append(node);
      }
    }

    function view() {
      const c=words[lang], decision=decisions[stage];
      dialog.lang=lang;dialog.dataset.recordPage=page;dialog.dataset.recordStage=stage;
      find('.xr-context').textContent=c.room;
      find('.xr-close').setAttribute('aria-label',c.close);
      find('#xr-title').textContent=c[page];
      const modes=find('.xr-modes');
      modes.hidden=page!=='record';modes.setAttribute('aria-label',c.record);
      for(const tab of modes.querySelectorAll('button')) {
        tab.textContent=c[tab.dataset.stage];tab.setAttribute('aria-pressed',String(tab.dataset.stage===stage));
      }
      draw();
      find('.xr-lead').textContent=c[stage+'Lead'];
      find('.xr-body').textContent=c[stage+'Body'];
      find('.xr-note').textContent=c[stage+'Note'];
      actions.replaceChildren();
      if(!decision){
        for(const action of Object.keys(choices[stage])){
          const button=document.createElement('button');button.type='button';button.dataset.recordAction=action;
          button.textContent=c[action];actions.append(button);
        }
      }
      const outcome=find('.xr-outcome');
      outcome.hidden=!decision;outcome.textContent=decision?c[choices[stage][decision]]:'';
      find('.xr-cross').textContent=c[page==='record'?'handoff':'record'];
      find('.xr-foot span').textContent=c.sim;
      renderHistory();
    }

    function choosePage(kind) {
      page=kind==='handoff'?'handoff':'record';
      stage=page==='handoff'?'handoff':'supply';
      view();dialog.scrollTop=0;
    }

    function close(){if(dialog.open) dialog.close();}
    function open(kind='record',language='ko',trigger=document.activeElement) {
      lang=Object.hasOwn(words,language)?language:'ko';opener=trigger;decisions={};
      find('.xr-history').open=false;find('.xr-legacy').open=false;
      choosePage(kind);
      if(!dialog.open) dialog.showModal();
      find('.xr-close').focus({preventScroll:true});
    }

    dialog.addEventListener('click',event=>{
      const button=event.target.closest('button');
      if(!button || !dialog.contains(button)) return;
      if(button.classList.contains('xr-close')){close();return;}
      if(button.classList.contains('xr-cross')){
        choosePage(page==='record'?'handoff':'record');
        find('.xr-close').focus({preventScroll:true});
      } else if(button.dataset.stage && page==='record'){
        stage=button.dataset.stage;view();
      } else if(Object.hasOwn(choices[stage],button.dataset.recordAction) && !decisions[stage]){
        const action=button.dataset.recordAction;
        durable=archive(stage,action);
        decisions[stage]=action;view();find('.xr-outcome').focus({preventScroll:true});
      }
    });
    for(const panel of dialog.querySelectorAll('details')) panel.addEventListener('toggle',()=>{if(dialog.open)renderHistory();});
    window.addEventListener('storage',event=>{
      if(dialog.open && (event.key===null || event.key.startsWith('onduru.exhibition.'))) renderHistory();
    });
    dialog.addEventListener('close',()=>{
      if(dialog.open)return;
      const returnTo=opener;opener=null;
      onClose?.();if(returnTo?.isConnected && (returnTo.getClientRects?.().length ?? true)) returnTo.focus({preventScroll:true});
    });

    return {open,close,isOpen:()=>dialog.open,setLocale(value){
      lang=Object.hasOwn(words,value)?value:'ko';if(dialog.open)view();
    }};
  }

  window.ExhibitRecord=Object.freeze({mount});
})();
