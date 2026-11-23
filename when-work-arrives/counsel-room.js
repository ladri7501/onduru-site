(() => {
  'use strict';

  const rooms=new WeakMap();
  const routes={work:['workAdvice','employment-agent'],living:['livingAdvice','living-agent']};
  const copy={
    ko:{
      eyebrow:'기업 · 생활·구직 상담 시뮬레이션',title:'지금 어떤 도움이 필요한가요?',
      intro:'하고 싶은 일과 지금 걱정되는 일을 들려주세요. 두루가 뜻을 짚어 보면, 어느 상담을 먼저 맡길지 직접 정할 수 있습니다.',
      message:'두루에게 건네는 말',placeholder:'다음 달부터 다시 일할 수 있어요. 그런데 이번 달 방세가 먼저 걱정돼요.',
      examples:'다른 사람의 말로 시작해 보기',country:'안내를 받을 나라',read:'두루가 어떻게 이해했는지 보기',
      empty:'한 문장을 쓰거나 예시를 골라 주세요.',private:'이름이나 연락처는 적지 않아도 됩니다. 문장은 이 화면에서만 읽습니다.',
      local:'이 전시에서는 두루가 입력한 문장을 상담 예문과 대조하고 역할을 맡은 두루의 답을 모의로 보여줍니다.',
      us:'온',duru:'나의 두루',work:'구직을 살피는 두루',living:'생활을 살피는 두루',topics:{work:'구직',living:'생활 지원'},
      clarify:'무엇부터 살펴보면 좋을까요?',review:'두루가 이렇게 들었습니다',
      question:'각 두루에게 건넬 항목',allow:'이 범위로 모의 상담하기',hold:'지금은 보류',
      edit:'내 말 다시 쓰기',adjust:'뜻이나 순서 바로잡기',feedback:'온이 고른 뜻과 순서를 반영했습니다.',
      clarifyHelp:'뜻을 더 들려주거나, 먼저 알아볼 일을 골라 주세요.',
      choices:['구직만','생활 지원만','구직 먼저, 생활 지원도','생활 지원 먼저, 구직도'],
      limited:'각 두루는 선택한 나라와 자신에게 맡겨진 상담 항목만 받습니다.',
      working:'두루들이 각자 맡은 질문을 살피고 있습니다.',returned:'두루가 모아 온 다음 걸음',parallel:'두루들이 따로 살핀 답을 원하는 순서로 모았습니다.',
      choose:'이 일부터 해보기',selected:'내가 고른 다음 걸음',
      sources:'공식 안내 직접 확인하기',follow:'다시 물어보기',holdTitle:'질문을 온 곁에 두었습니다',holdNote:'다른 두루에게 맡기기 전에 범위를 다시 살펴볼 수 있습니다.',back:'질문 다시 살펴보기',
      receipt:'각 두루가 받은 항목',changeCountry:'나라 바꾸기',
    },
    en:{
      eyebrow:'Enterprise · Work and living support simulation',title:'What would help you right now?',
      intro:'Tell Duru what you hope to do and what worries you today. Read how it understood you, then choose what to ask first.',
      message:'In your own words',placeholder:'I could start a job next month, but this month’s rent is on my mind first.',
      examples:'Try someone else’s words',country:'Country for guidance',read:'See how Duru understood me',
      empty:'Write a sentence or choose an example.',private:'You can leave out names and contact details. Your words stay on this screen.',
      local:'This exhibition compares your words with example requests. Its advisers are simulated.',
      us:'On',duru:'My Duru',work:'Duru for work',living:'Duru for daily life',topics:{work:'Work',living:'Living support'},
      clarify:'What should we look at first?',review:'What Duru heard',
      question:'What each Duru would receive',allow:'Run this simulated consultation',hold:'Hold for now',
      edit:'Change my words',adjust:'Correct the meaning or order',feedback:'Duru has applied the meaning and order you chose.',
      clarifyHelp:'Tell Duru a little more, or choose what you would like it to explore first.',
      choices:['Work only','Living support only','Work first, then living support','Living support first, then work'],
      limited:'Each Duru receives the selected country and the subjects you shared with it.',
      working:'Each Duru is considering the question you shared.',returned:'The next steps Duru brought back',parallel:'Each Duru considered its part. Duru collected their replies in your preferred order.',
      choose:'Start with this step',selected:'My chosen next step',
      sources:'Check the official sources yourself',follow:'Ask again',holdTitle:'Your question stays with you',holdNote:'You can review the scope before asking another Duru to act.',back:'Review my question',
      receipt:'What each Duru received',changeCountry:'Change country',
    },
    es:{
      eyebrow:'Empresa · Simulación de orientación laboral y social',title:'¿Qué ayuda necesitas ahora?',
      intro:'Cuéntale a Duru qué te gustaría hacer y qué te preocupa hoy. Lee cómo te ha entendido y decide por dónde empezar.',
      message:'Con tus propias palabras',placeholder:'Puedo empezar a trabajar el mes que viene, pero antes me preocupa el alquiler de este mes.',
      examples:'Probar con las palabras de otra persona',country:'País para la orientación',read:'Ver cómo me ha entendido Duru',
      empty:'Escribe una frase o elige un ejemplo.',private:'Puedes omitir nombres y datos de contacto. Tus palabras se quedan en esta pantalla.',
      local:'La exposición compara tus palabras con consultas de ejemplo. Las respuestas de los Duru se simulan aquí.',
      us:'On',duru:'Mi Duru',work:'Duru de empleo',living:'Duru de apoyo social',topics:{work:'Empleo',living:'Apoyo social'},
      clarify:'¿Por dónde empezamos?',review:'Lo que ha entendido Duru',
      question:'Lo que recibiría cada Duru',allow:'Simular la consulta con este alcance',hold:'Dejar en espera',
      edit:'Cambiar mis palabras',adjust:'Corregir el sentido o el orden',feedback:'Duru ha aplicado el sentido y el orden que elegiste.',
      clarifyHelp:'Cuéntale algo más a Duru o elige qué quieres explorar primero.',
      choices:['Solo empleo','Solo apoyo social','Primero empleo, después apoyo social','Primero apoyo social, después empleo'],
      limited:'Cada Duru recibe el país elegido y solo los temas que le has encargado.',
      working:'Cada Duru estudia su parte de la consulta.',returned:'Los próximos pasos que ha reunido Duru',parallel:'Cada Duru estudió su parte. Duru reunió las respuestas en el orden que elegiste.',
      choose:'Empezar por aquí',selected:'El paso que he elegido',
      sources:'Consultar las fuentes oficiales',follow:'Volver a preguntar',holdTitle:'La consulta sigue contigo',holdNote:'Puedes revisar el alcance antes de encargar la consulta.',back:'Revisar mi consulta',
      receipt:'Lo que recibió cada Duru',changeCountry:'Cambiar de país',
    }
  };
  const cases={
    KR:{order:['living','work'],facets:['housing','jobsearch'],
      ko:['다음 달부터 다시 일할 수 있어요. 그런데 이번 달 방세가 먼저 걱정돼요.','이번 달 방세를 먼저, 다음 달 일자리를 그다음에 살펴 달라는 말씀이군요.','주거 상담에서 준비할 내용을 먼저 살피고, 다음 달에 가능한 근무 시간을 정리할 수 있어요.','방세부터 알아볼게요. 일자리 상담도 곁에 남겨 주세요.'],
      en:['I can return to work next month, but this month’s rent worries me first.','You want to look at the rent due now, then at work for next month.','We can prepare a question about rent first and note when you can start work next month.','I’ll start with rent. Keep the employment option here for me.'],
      es:['Puedo volver a trabajar el mes que viene, pero antes me preocupa el alquiler de este mes.','Quieres empezar por el alquiler de este mes y después mirar el empleo.','Podemos preparar la consulta sobre el alquiler y anotar desde cuándo podrías trabajar.','Empezaré por el alquiler. Guárdame también la opción de empleo.']},
    US:{order:['living','work'],facets:['care','jobsearch'],
      ko:['아침에는 아버지를 돌봐요. 오후에 일할 곳도 찾고 있어요.','오전 돌봄과 오후 구직이 이어져 있군요. 두 가지를 나눠 물을게요.','돌봄 상담이 가능한 시간과 오후 채용 정보를 함께 확인할 수 있어요.','오후에 상담할 수 있는 곳부터 알아볼게요.'],
      en:['I look after my father in the mornings. I am looking for afternoon work.','Morning care and afternoon work belong in the same plan. I’ll ask about each separately.','We can check when a care adviser is available and where to ask about afternoon openings.','I’ll start by finding a time in the afternoon when I can talk.'],
      es:['Por las mañanas cuido a mi padre. Busco empleo por las tardes.','Los cuidados de la mañana y el empleo de la tarde van juntos. Preguntaré por cada uno.','Podemos consultar los horarios de orientación sobre cuidados y dónde buscar empleo de tarde.','Empezaré por buscar una hora de la tarde para hablar.']},
    ES:{order:['work','living'],facets:['training','bills'],
      ko:['새 기술을 익혀 일을 바꾸고 싶어요. 그동안 전기요금도 걱정돼요.','직업 훈련을 먼저 살피면서 전기요금 상담도 함께 알아볼게요.','지역 훈련 과정의 시간표를 물어보고, 공과금에 관해 얘기할 곳도 따로 살펴볼 수 있어요.','과정 시간표부터 살펴볼게요.'],
      en:['I want to retrain for a different trade. I’m also worried about my electricity bill.','I’ll look at training first and ask separately about your electricity bill.','You can ask for local course schedules and also find a place to discuss the bill.','I’ll start with the course schedule.'],
      es:['Quiero formarme para cambiar de oficio. También me preocupa la factura de la luz.','Miraré primero la formación y preguntaré por separado por la factura de la luz.','Puedes pedir los horarios de formación en tu zona y consultar dónde hablar de la factura.','Empezaré por los horarios del curso.']}
  };
  const voices={
    ko:{demo:'예시 대화',pause:'예시 멈추기',play:'이어서 보기',replay:'처음부터 보기',custom:'내 말로 시작하기',restore:'저장해 둔 내 문장 불러오기',editIntro:'온이 두루에게 건네는 말',direct:'온이 직접 물어보기',directNote:'선택한 두루와 온이 이 화면에서 바로 주고받습니다. 보내기 전에 상대가 읽을 항목을 확인하세요.',scope:'상대가 받을 항목',send:'이 항목으로 직접 묻기',return:'앞 장면으로',again:'다시 직접 묻기',own:'온이 직접 받은 답',draft:'직접 물을 내용',preview:'전달할 항목 확인하기',explicit:'공유할 항목을 골라 주세요.',receipt:'받은 항목',synthesis:'함께 살핀 순서',next:'어디부터 시작할지 골라 주세요.',pick:'제가 고른 다음 걸음',respond:'이 안내로 시작할게요.',simulation:'전시용 예시 · 이 화면에서 재생됩니다.'},
    en:{demo:'Example conversation',pause:'Pause example',play:'Continue example',replay:'Replay example',custom:'Use my own words',restore:'Restore my saved words',editIntro:'From On to Duru',direct:'Ask a Duru directly',directNote:'On and the chosen Duru speak directly in this local simulation. Review what it will receive before asking.',scope:'What this Duru will receive',send:'Ask directly with these details',return:'Return to the previous view',again:'Ask another question directly',own:'The reply to On',draft:'My direct question',preview:'Review what I’ll share',explicit:'Choose what to share.',receipt:'Details received',synthesis:'The order we explored',next:'Choose where you would like to begin.',pick:'My next step',respond:'I’ll begin with this guidance.',simulation:'Exhibition example · played on this screen.'},
    es:{demo:'Conversación de ejemplo',pause:'Pausar el ejemplo',play:'Continuar el ejemplo',replay:'Repetir el ejemplo',custom:'Usar mis palabras',restore:'Recuperar mis palabras',editIntro:'De On a Duru',direct:'Preguntar directamente a un Duru',directNote:'On habla con el Duru que elige en esta simulación local. Revisa qué recibirá antes de preguntar.',scope:'Lo que recibirá este Duru',send:'Preguntar directamente con estos datos',return:'Volver a la vista anterior',again:'Hacer otra pregunta directa',own:'La respuesta para On',draft:'Mi pregunta directa',preview:'Revisar lo que compartiré',explicit:'Elige qué información quieres compartir.',receipt:'Datos recibidos',synthesis:'El orden que hemos seguido',next:'Elige por dónde quieres empezar.',pick:'Mi próximo paso',respond:'Empezaré por esta orientación.',simulation:'Ejemplo de la exposición · se reproduce en esta pantalla.'}
  };
  function exampleDialogue(state){
    const example=cases[state.region],lines=example[state.lang];
    const replies=E().sources(state.region,state.lang,example.order,{facets:example.facets});
    return [['us',lines[0]],['duru',lines[1]],...replies.map(r=>[r.topic,r.name+' · '+r.next]),['duru',lines[2]],['us',lines[3]]];
  }
  function voiceLine(role,message,t){
    const item=node('li','counsel-turn');item.dataset.speaker=role;
    item.append(node('strong','',t[role]),node('p','',message));
    return item;
  }
  function stopExample(state){
    window.clearTimeout(state.demoTimer);state.demoTimer=0;state.demoToken=(state.demoToken||0)+1;
  }
  function advanceExample(host,state){
    stopExample(state);
    if(!state.active||state.phase!=='compose'||!state.demonstrating)return;
    const log=host.querySelector('.counsel-dialogue');
    if(!log)return;
    const lines=exampleDialogue(state),v=voices[state.lang];
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)state.turn=lines.length;
    for(let i=log.children.length;i<state.turn;i++){
      const [role,text]=lines[i],item=voiceLine(role,text,copy[state.lang]);
      if(role==='work'||role==='living'){
        const fields=E().facetsFor([role],cases[state.region].facets);
        item.append(node('small','counsel-turn-fields',v.receipt+' · '+[countryName(state),...E().facets(fields,state.lang)].join(' · ')));
      }
      log.append(item);
    }
    const fig=host.querySelector('.counsel-flow');if(fig)fig.dataset.speaker=lines[state.turn-1][0];
    const toggle=host.querySelector('[data-counsel="demo-toggle"]');
    if(toggle){toggle.textContent=state.paused?v.play:v.pause;toggle.disabled=state.turn>=lines.length;}
    if(state.paused||state.turn>=lines.length)return;
    const token=state.demoToken;
    state.demoTimer=window.setTimeout(()=>{
      if(state.demoToken!==token)return;
      state.turn++;advanceExample(host,state);
    },state.turn===1?950:1450);
  }
  function resetExample(state){
    stopExample(state);state.demonstrating=true;state.paused=false;state.turn=1;state.example=null;
    state.draft=cases[state.region][state.lang][0];state.error=false;
  }
  function dialoguePanel(state,t){
    const v=voices[state.lang],panel=node('section','counsel-example');
    const title=node('h3','',v.demo+' · '+countryName(state));
    const log=node('ol','counsel-dialogue');log.setAttribute('aria-label',v.demo);
    log.setAttribute('aria-live','off');
    const controls=node('div','counsel-actions');
    controls.append(action('demo-toggle',state.paused?v.play:v.pause),action('demo-replay',v.replay),action('custom',v.custom));
    if(state.drafts[state.region])controls.append(action('restore',v.restore));
    panel.append(title,node('small','',v.simulation),graphics(state,t),controls,log);return panel;
  }
  function directPicker(state,t){
    const v=voices[state.lang],group=node('section','counsel-direct-options');
    group.append(node('h4','',v.direct));
    const buttons=node('div','counsel-actions');
    for(const topic of ['work','living'])buttons.append(action('direct',t[topic],topic));
    group.append(buttons);return group;
  }
  const directFacets={work:['jobsearch','training'],living:['housing','bills','food','care']};
  function directConsult(state,t){
    const v=voices[state.lang],topic=state.directTopic,box=node('section','counsel-block');
    box.append(heading(v.direct+' · '+t[topic]),node('p','desk-note',v.directNote));
    const label=node('label','counsel-label',v.draft);label.htmlFor='counsel-direct-text';
    const field=node('textarea','counsel-message counsel-direct-text');field.id=label.htmlFor;field.rows=2;field.maxLength=600;field.value=state.directText;
    box.append(label,field,node('p','desk-note',t.private),action('direct-read',v.preview));
    const group=node('fieldset','desk-options');
    group.append(node('legend','',v.scope+' · '+countryName(state)));
    for(const id of directFacets[topic])group.append(action('direct-facet',E().facets([id],state.lang)[0],id,state.directFields.includes(id)));
    const send=primary('direct-send',v.send);send.disabled=!state.directFields.length||state.directDirty;
    box.append(group);
    if(!state.directFields.length)box.append(node('p','desk-note',v.explicit));
    box.append(send,action('direct-back',v.return));return box;
  }
  function directReply(state,t){
    const v=voices[state.lang],topic=state.directTopic,box=node('section','counsel-block');
    const received=state.directReceipt,input=received.input,answer=calculate(state,topic,input);
    const log=node('ol','counsel-dialogue');
    log.append(voiceLine('us',[countryName(state),...E().facets(input.facets,state.lang)].join(' · '),t),
      voiceLine(topic,answer.name+' · '+answer.next,t));
    box.append(heading(v.own),log,node('p','desk-note',answer.role),action('direct-again',v.again),action('direct-back',v.return));
    return box;
  }
  const orders=[['work'],['living'],['work','living'],['living','work']];
  const E=()=>window.CounselEngine;
  function node(tag,cls,value){
    const element=document.createElement(tag);
    if(cls)element.className=cls;
    if(value!=null)element.textContent=value;
    return element;
  }
  function action(key,title,value,active){
    const b=node('button','',title);b.type='button';b.dataset.counsel=key;
    if(value!=null)b.dataset.value=String(value);
    if(active!=null)b.setAttribute('aria-pressed',String(active));
    return b;
  }
  function primary(key,title){
    const b=action(key,title);b.className='desk-submit';return b;
  }
  function heading(title){
    const h=node('h3','counsel-phase-title',title);h.tabIndex=-1;return h;
  }
  function graphics(state,t){
    const fig=node('figure','counsel-flow');
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 720 135');svg.setAttribute('aria-hidden','true');
    const mark=(tag,attrs,parent=svg)=>{
      const child=document.createElementNS(svg.namespaceURI||'http://www.w3.org/2000/svg',tag);
      for(const [k,v] of Object.entries(attrs))child.setAttribute(k,v);
      parent.append(child);return child;
    };
    const direct=state.phase==='direct'||state.phase==='direct-done';
    const target=state.directTopic==='work'?2:3;
    const paths=direct?[target===2?'M83 68 C237 118 460 0 609 32':'M83 68 C252 12 445 137 609 100']:[
      'M83 68 C145 18 225 101 310 67',
      'M310 67 C413 83 466 15 609 32',
      'M310 67 C399 51 489 125 609 100'
    ];
    const activated=direct||state.phase==='running'||state.phase==='done';
    for(const [i,path] of paths.entries()){
      const inScope=i===0||state.topics.includes(i===1?'work':'living');
      mark('path',{class:'counsel-thread '+(inScope&&activated?'is-granted':''),d:path});
      if(state.phase==='running'&&inScope){
        const pulse=mark('circle',{r:2.7,class:'counsel-pulse',cx:0,cy:0});
        const offset=i===1?'.18s':i===2?'.36s':'0s';
        mark('animateMotion',{path,dur:'1.7s',begin:offset,repeatCount:'indefinite',keyPoints:'0;1;0',keyTimes:'0;.5;1',calcMode:'linear'},pulse);
      }
    }
    [[83,68,49,16,-13],[310,67,65,21,6],[609,32,41,14,-13],[609,100,40,14,13]].forEach(([x,y,rx,ry,angle],i)=>{
      if(direct&&i!==0&&i!==target)return;
      const ring=mark('g',{transform:'translate('+x+' '+y+') rotate('+angle+')',class:'counsel-surface counsel-surface-'+i});
      for(let n=0;n<7;n++)mark('ellipse',{cx:n*.48,cy:n*.2,rx:rx-n*2.65,ry:ry-n*.95},ring);
      mark('circle',{r:2.7,cx:0,cy:0},ring);
    });
    const names=node('figcaption','counsel-roles');
    [t.us,t.duru,t.work,t.living].forEach((name,i)=>{
      const label=node('span','',name);label.hidden=direct&&i!==0&&i!==target;names.append(label);
    });
    fig.append(svg,names);return fig;
  }
  function countryName(state){
    return E().regions(state.lang).find(c=>c.id===state.region).label;
  }
  function setCountryControl(state,t){
    const group=node('fieldset','desk-options counsel-country');
    group.append(node('legend','',t.country));
    for(const c of E().regions(state.lang)) group.append(action('country',c.label,c.id,state.region===c.id));
    return group;
  }
  function addSourceLinks(details,advisers){
    for(const adviser of advisers){
      const link=node('a','',adviser.name);
      link.href=adviser.href;link.target='_blank';link.rel='noopener noreferrer';
      details.append(link);
    }
  }
  function independentSources(state,t){
    const details=node('details','counsel-details');
    details.append(node('summary','',t.sources));
    details.addEventListener('toggle',()=>{
      if(details.open&&!details.querySelector('a'))addSourceLinks(details,E().sources(state.region,state.lang,['work','living']));
    });
    return details;
  }
  function compose(state,t){
    const box=node('section','counsel-input');
    box.append(setCountryControl(state,t));
    if(state.demonstrating)box.append(dialoguePanel(state,t));
    else box.append(action('demo-replay',voices[state.lang].replay));
    const label=node('label','counsel-label',t.message);label.htmlFor='counsel-message';
    const field=node('textarea','counsel-message');field.id='counsel-message';field.rows=3;field.maxLength=600;
    field.placeholder=t.placeholder;field.value=state.draft;field.setAttribute('aria-describedby','counsel-privacy');
    const privacy=node('p','desk-note',t.private);privacy.id='counsel-privacy';
    const samples=node('details','counsel-details');
    samples.append(node('summary','',t.examples));
    E().examples(state.lang).forEach((item,i)=>samples.append(action('example',item,i)));
    const form=state.demonstrating?node('details','counsel-details counsel-editor'):node('div','counsel-editor');
    if(state.demonstrating)form.append(node('summary','',t.edit));
    form.append(label,field,privacy,samples);box.append(form);
    if(state.error){
      const err=node('p','counsel-validation',t.empty);err.setAttribute('role','alert');box.append(err);
    }
    box.append(primary('read',t.read),directPicker(state,t),independentSources(state,t));
    return box;
  }
  function clarify(state,t){
    const box=node('section','counsel-block');
    box.append(heading(t.clarify),node('p','desk-note',t.clarifyHelp));
    const choices=node('div','counsel-actions');
    t.choices.forEach((title,i)=>choices.append(action('order',title,i)));
    box.append(choices,action('edit',t.edit));return box;
  }
  function fieldsFor(state,topic){
    return E().facetsFor([topic],state.analysis?.facets||[]);
  }
  function scopedRows(state,t,title){
    const section=node('section','counsel-packet');
    section.append(node('h4','',title));
    const rows=node('dl','counsel-scope');
    for(const topic of state.topics){
      const row=node('div');
      const sent=state.phase==='done'?state.receipts.find(receipt=>receipt.topic===topic):null;
      const details=E().facets(sent?sent.input.facets:fieldsFor(state,topic),state.lang);
      row.append(node('dt','',t[topic]),node('dd','',[countryName(state),t.topics[topic],...details].join(' · ')));
      rows.append(row);
    }
    section.append(rows);return section;
  }
  function review(state,t){
    const box=node('section','counsel-block');
    const order=state.topics.map(k=>t.topics[k]).join(' → ');
    box.append(heading(t.review),node('p','counsel-reading',order),
      node('p','desk-note',state.corrected?t.feedback:state.analysis.reason),scopedRows(state,t,t.question),
      node('p','desk-note',t.limited));
    const actions=node('div','counsel-actions');
    actions.append(primary('approve',t.allow),action('hold',t.hold),action('adjust',t.adjust),action('edit',t.edit));
    box.append(actions,directPicker(state,t));return box;
  }
  function calculate(state,topic,input){
    const agent=E().sources(input.region,state.lang,[topic],{primary:topic,topics:[topic],facets:input.facets})[0];
    if(!agent)throw new Error('Missing local adviser');
    return agent;
  }
  function results(state,t){
    const box=node('section','counsel-block');
    const replies=state.receipts.map(({topic,input})=>calculate(state,topic,input));
    box.append(heading(t.returned));
    if(replies.length>1)box.append(node('p','desk-note',t.parallel));
    for(const adviser of replies){
      const article=node('article','counsel-response');
      article.append(node('small','',t[adviser.topic]+' · '+adviser.name),node('h4','',adviser.next),node('p','desk-note',adviser.role),node('p','desk-note',adviser.why));
      const selected=state.selected===adviser.topic;
      article.append(action('choose',selected?t.selected:t.choose,adviser.topic,selected));box.append(article);
    }
    const sources=node('details','counsel-details');
    sources.append(node('summary','',t.sources));
    addSourceLinks(sources,replies);
    const receipt=node('details','counsel-details');
    receipt.append(node('summary','',t.receipt),scopedRows(state,t,t.question));
    const actions=node('div','counsel-actions');
    actions.append(action('edit',t.follow),action('adjust',t.adjust),action('edit-country',t.changeCountry));
    const v=voices[state.lang],dialogue=node('ol','counsel-dialogue');
    const order=replies.map(r=>r.name).join(' → ');
    dialogue.append(voiceLine('duru',v.synthesis+' · '+order+'. '+v.next,t));
    if(state.selected)dialogue.append(voiceLine('us',v.respond+' · '+t.topics[state.selected],t));
    box.append(dialogue,actions,directPicker(state,t),receipt,sources);return box;
  }
  function show(host,state,focus){
    const t=copy[state.lang],room=node('section','desk-room counsel-room');
    host.dataset.branch='1';host.dataset.phase=state.phase;
    const head=node('header','desk-heading');
    const title=node('h2','',t.title);title.tabIndex=-1;head.append(node('small','',t.eyebrow),title);
    if(state.phase==='compose')head.append(node('p','',t.intro));
    room.append(head);
    if(state.phase==='compose'){
      room.append(compose(state,t));
      if(!state.demonstrating)room.append(graphics(state,t));
      room.append(node('p','desk-note counsel-disclosure',t.local));
    }else{
      room.append(graphics(state,t));
      if(state.phase==='direct')room.append(directConsult(state,t));
      else if(state.phase==='direct-done')room.append(directReply(state,t));
      else if(state.phase==='clarify')room.append(clarify(state,t));
      else if(state.phase==='review')room.append(review(state,t));
      else if(state.phase==='held'){
        const box=node('section','counsel-block');
        box.append(heading(t.holdTitle),node('p','desk-note',t.holdNote),action('resume',t.back),independentSources(state,t));room.append(box);
      }else if(state.phase==='running'){
        const status=heading(t.working);status.setAttribute('role','status');
        const exchange=node('ol','counsel-dialogue');
        exchange.append(voiceLine('us',t.allow+' · '+state.topics.map(topic=>t.topics[topic]).join(' → '),t),
          voiceLine('duru',t.limited,t));
        room.append(status,exchange,scopedRows(state,t,t.question));
      }else room.append(results(state,t));
    }
    host.replaceChildren(room);
    if(state.phase==='compose'&&state.demonstrating)advanceExample(host,state);
    if(focus){
      const target=host.querySelector(focus);
      target?.focus?.({preventScroll:true});target?.scrollIntoView?.({block:'nearest',behavior:'instant'});
    }
  }
  function start(host,state){
    state.receipts=[];state.selected=null;
    state.packets=state.topics.map(topic=>{
      const fields={region:state.region,facets:fieldsFor(state,topic)};
      return {topic,packet:window.ScopedHandoff.open(routes[topic][0],fields,{purpose:'compare-guidance'})};
    });
    const finish=()=>{
      state.timer=0;
      if(!state.active||state.phase!=='running')return;
      state.receipts=state.packets.map(({topic,packet})=>{
        const input=window.ScopedHandoff.receive(packet,routes[topic][1]);
        const adviser=calculate(state,topic,input);
        const reply=window.ScopedHandoff.returnTo(packet,'local-duru',{service:adviser.id,basis:'sample-referral'});
        return {topic,input,reply};
      });
      state.packets=[];state.phase='done';show(host,state,'.counsel-phase-title');
    };
    state.phase='running';
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
    show(host,state,'.counsel-phase-title');state.timer=window.setTimeout(finish,1850);
  }
  function interact(host,state,event){
    if(!state.active||state.phase==='running')return;
    const target=event.target.closest('[data-counsel]');if(!target||!host.contains(target))return;
    const key=target.dataset.counsel,value=target.dataset.value;
    let focus='.counsel-phase-title';
    if(key==='demo-toggle'){
      state.paused=!state.paused;advanceExample(host,state);return;
    }else if(key==='demo-replay'||key==='country'){
      if(!state.demonstrating&&state.draft.trim())state.drafts[state.region]=state.draft;
      if(key==='country')state.region=value;
      resetExample(state);focus=key==='country'?'[data-counsel="country"][data-value="'+value+'"]':'[data-counsel="demo-replay"]';
    }else if(key==='custom'||key==='restore'||key==='example'){
      stopExample(state);state.demonstrating=false;state.error=false;state.example=null;
      if(key==='example'){state.example=Number(value);state.draft=E().examples(state.lang)[state.example];}
      else state.draft=key==='restore'?state.drafts[state.region]:'';
      focus='.counsel-message';
    }else if(key==='direct'){
      stopExample(state);state.directPrevious=state.phase;state.directTopic=value;
      state.directText='';state.directDirty=false;state.directReceipt=null;
      const analysis=state.phase==='compose'?E().analyze(state.draft,state.lang):state.analysis;
      const fields=E().facetsFor([value],analysis?.facets);
      state.directFields=fields.length?fields:[directFacets[value][0]];
      state.phase='direct';
    }else if(key==='direct-facet'){
      const fields=state.directFields;
      state.directFields=fields.includes(value)?fields.filter(id=>id!==value):[...fields,value];
      focus='[data-counsel="direct-facet"][data-value="'+value+'"]';
    }else if(key==='direct-read'){
      state.directFields=E().facetsFor([state.directTopic],E().analyze(state.directText,state.lang).facets);
      state.directDirty=false;focus='[data-counsel="direct-facet"]';
    }else if(key==='direct-send'){
      if(state.directDirty||!state.directFields.length)return;
      const topic=state.directTopic,route=topic==='work'?'directWorkAdvice':'directLivingAdvice';
      const packet=window.ScopedHandoff.open(route,{region:state.region,facets:state.directFields},{purpose:'direct-guidance'});
      const input=window.ScopedHandoff.receive(packet,routes[topic][1]),adviser=calculate(state,topic,input);
      const reply=window.ScopedHandoff.returnTo(packet,'ON',{service:adviser.id,basis:'sample-referral'});
      state.directReceipt={input,reply};state.phase='direct-done';
    }else if(key==='direct-again'){
      state.directText='';state.directDirty=false;state.phase='direct';
    }else if(key==='direct-back'){
      state.phase=state.directPrevious;state.directReceipt=null;
      focus='[data-counsel="direct"][data-value="'+state.directTopic+'"]';
    }else if(key==='read'){
      stopExample(state);state.demonstrating=false;
      state.draft=host.querySelector('.counsel-message').value.slice(0,600);
      if(!state.draft.trim()){state.error=true;focus='.counsel-message';}
      else{
        state.error=false;state.corrected=false;state.analysis=E().analyze(state.draft,state.lang);
        state.topics=[...state.analysis.topics];state.phase=state.analysis.clarify||!state.topics.length?'clarify':'review';
      }
    }else if(key==='order'){
      state.topics=[...orders[Number(value)]];state.corrected=true;state.phase='review';
    }else if(key==='adjust'){
      state.phase='clarify';state.selected=null;
    }else if(key==='edit'||key==='edit-country'){
      state.phase='compose';state.demonstrating=false;state.selected=null;focus=key==='edit'?'.counsel-message':'[data-counsel="country"]';
    }else if(key==='approve'){
      start(host,state);return;
    }else if(key==='hold')state.phase='held';
    else if(key==='resume')state.phase='review';
    else if(key==='choose'){
      state.selected=value;focus='[data-counsel="choose"][data-value="'+value+'"]';
    }else return;
    show(host,state,focus);
  }
  function render(host,lang){
    let state=rooms.get(host);
    if(!state){
      state={lang,region:'KR',draft:'',drafts:{},example:null,phase:'compose',topics:[],receipts:[],timer:0};
      resetExample(state);
      rooms.set(host,state);
      host.addEventListener('click',event=>interact(host,state,event));
      host.addEventListener('input',event=>{
        if(!state.active)return;
        if(event.target.classList.contains('counsel-direct-text')){
          state.directText=event.target.value.slice(0,600);state.directDirty=true;
          const send=host.querySelector('[data-counsel="direct-send"]');if(send)send.disabled=true;
        }else if(event.target.classList.contains('counsel-message')){
          stopExample(state);state.demonstrating=false;
          const panel=host.querySelector('.counsel-example');if(panel)panel.hidden=true;
          state.draft=event.target.value.slice(0,600);state.example=null;state.error=false;
        }
      });
    }
    if(state.lang!==lang){
      if(state.demonstrating)state.draft=cases[state.region][lang][0];
      else if(state.example!=null)state.draft=E().examples(lang)[state.example];
      if(state.analysis)state.analysis={...state.analysis,reason:E().analyze(state.draft,lang).reason};
    }
    state.lang=lang;state.active=true;show(host,state);
  }
  function close(host){
    const state=rooms.get(host);if(!state)return;
    state.active=false;stopExample(state);
    if(state.phase==='running'){
      window.clearTimeout(state.timer);state.timer=0;state.packets=[];state.phase='review';
    }
  }
  window.CounselRoom=Object.freeze({render,close});
})();
