(() => {
  'use strict';

  const text = {
    ko: {
      title:'전 직장에서 내게 오는 서류',
      intro:'필요한 서류를 고르세요. 전 직장의 창구에서 본인을 확인하면 회사의 인사·급여 시스템이 선택한 서류를 발급합니다.',
      sample:'전시용 모의 창구', forms:'받을 서류', docs:['경력증명서','퇴직증명서','급여명세서 사본'], descriptions:['근무 기간과 담당 업무','퇴직일과 퇴직 사실','퇴직한 달의 지급·공제 내역'],
      purpose:'사용 목적', purposes:['본인 보관','구직 서류 준비'], recipient:'수신인', owner:'신청한 본인', issuer:'발급처', company:'가상 사업장 인사·급여 창구',
      issue:'본인 확인 후 선택한 서류 받기', issued:'본인에게 도착한 서류', sampleDoc:'전시 견본', record:'발급 내역', change:'받을 서류 다시 고르기', save:'견본 파일 받기',
      limit:'전시가 본인 확인을 모의합니다. 요청 항목과 용도는 회사 창구로, 확인된 증명서는 본인에게 전달됩니다. 인사·급여 원본은 회사에 남습니다.',
      fields:['근무 기간','담당 업무','퇴직일','재직 상태','급여 기간','지급액','공제액','실수령액'], positionName:'제품 검수', statusName:'퇴직',
      receiptNote:'본인이 고른 서류만 발급했습니다. 다른 기관으로 보내려면 본인이 별도로 전송 대상을 정합니다.',
      paths:[['나의 영토','전 직장 창구','회사 인사·급여']],
      steps:[['본인 확인','허락한 항목 전달','회사 안에서 대조·발급','본인 수신']],
      trace:[['모의 본인 확인이 끝났습니다.','요청한 서류 종류와 사용 목적이 회사 창구에 닿았습니다.','회사 안에서 예시 인사·급여 기록과 대조합니다.','선택한 서류가 본인에게 도착했습니다.']]
    },
    en: {
      title:'Documents from my former employer',
      intro:'Choose the documents you need. Once the former employer verifies you, its HR and payroll systems issue the selected records.',
      sample:'Simulated service desk', forms:'Documents to receive', docs:['Certificate of employment history','Certificate of separation','Copy of a payslip'], descriptions:['Dates of employment and duties','Leaving date and confirmation of departure','Pay and deductions in the final month'],
      purpose:'Purpose', purposes:['My own records','Preparing a job application'], recipient:'Recipient', owner:'The person requesting the record', issuer:'Issuer', company:'HR and payroll at the fictional employer',
      issue:'Verify me and issue my documents', issued:'Documents delivered to you', sampleDoc:'Exhibition sample', record:'Delivery record', change:'Choose documents again', save:'Download the sample',
      limit:'Identity verification is simulated. The employer receives the document request and its purpose. It sends the certified records back to you. Its personnel and payroll files stay in its territory.',
      fields:['Employment period','Duties','Leaving date','Status','Pay period','Gross pay','Deductions','Net pay'], positionName:'Product inspection', statusName:'Employment ended',
      receiptNote:'Only the selected records were issued. You decide whether to send a document on and who should receive it.',
      paths:[['My territory','Former employer','HR and payroll']],
      steps:[['Verify identity','Send allowed fields','Check and issue locally','Deliver to me']],
      trace:[['Simulated identity check complete.','The document types and purpose reach the employer.','The employer checks its sample personnel and payroll records.','Your selected documents have arrived.']]
    },
    es: {
      title:'Documentos de mi antigua empresa',
      intro:'Elige los documentos que necesitas. Tras comprobar tu identidad, los sistemas de personal y nóminas de la empresa emiten los documentos elegidos.',
      sample:'Ventanilla simulada', forms:'Documentos que recibirás', docs:['Certificado de trayectoria laboral','Certificado de cese','Copia de una nómina'], descriptions:['Periodo de empleo y funciones','Fecha y constancia del cese','Ingresos y deducciones del último mes'],
      purpose:'Finalidad', purposes:['Archivo personal','Preparar una candidatura'], recipient:'Destinatario', owner:'La persona que hace la solicitud', issuer:'Emisor', company:'Personal y nóminas de la empresa ficticia',
      issue:'Verificar mi identidad y recibir los documentos', issued:'Documentos que has recibido', sampleDoc:'Muestra de la exposición', record:'Constancia de entrega', change:'Volver a elegir los documentos', save:'Descargar la muestra',
      limit:'La comprobación de identidad es simulada. La empresa recibe la petición y el propósito. Los documentos se entregan a quien los pidió. Los archivos de personal y nóminas quedan en la empresa.',
      fields:['Periodo de empleo','Funciones','Fecha del cese','Situación','Periodo de la nómina','Importe bruto','Deducciones','Importe neto'], positionName:'Inspección de productos', statusName:'Relación laboral finalizada',
      receiptNote:'Solo se han emitido los documentos seleccionados. Tú decides si quieres enviarlos a alguien más y quién los recibe.',
      paths:[['Mi territorio','Antigua empresa','Personal y nóminas']],
      steps:[['Verificar identidad','Enviar lo autorizado','Comprobar y emitir','Entregarme']],
      trace:[['Verificación simulada de identidad completada.','La petición y su finalidad llegan a la empresa.','La empresa comprueba sus expedientes ficticios de personal y nóminas.','Has recibido los documentos elegidos.']]
    }
  };

  const desks = new WeakMap();
  const docFields = [[0,1],[2,3],[4,5,6,7]];
  const docNames = ['career','separation','payslip'];
  const employersRecord=Object.freeze({
    from:'2022-03-01',to:'2024-08-31',duty:'inspector',status:'separated',
    period:'2024-08',gross:2600000,deductions:240000,net:2360000
  });
  const verifiedRequests=new WeakMap();
  const forPurpose=['personal-record','job-application'];
  const scopeWords={
    ko:{alias:'이 요청의 가명',action:'허용한 일',issue:'선택 서류 발급',basis:'확인 근거',record:'회사 안의 모의 인사·급여 원장'},
    en:{alias:'Alias for this request',action:'Allowed action',issue:'Issue selected documents',basis:'Evidence',record:'The employer’s sample personnel and payroll records'},
    es:{alias:'Alias de esta solicitud',action:'Acción permitida',issue:'Expedir los documentos elegidos',basis:'Fuente',record:'Registro ficticio de personal y nóminas de la empresa'}
  };
  const eligibleIds=[['from','to','duty'],['to','status'],['period','gross','deductions','net']];
  function readVerified(packet,request) {
    const row=verifiedRequests.get(packet);
    if(!row)throw new TypeError('Local identity check required');
    return request.documents.map(kind=>{
      const fields=Object.fromEntries(eligibleIds[docNames.indexOf(kind)].map(key=>[key,row[key]]));
      return {kind,fields};
    });
  }
  function dated(value,lang,monthOnly=false) {
    if(lang==='ko')return value.replaceAll('-','.');
    return new Intl.DateTimeFormat(lang==='en'?'en-GB':'es-ES',{
      year:'numeric',month:'short',...(monthOnly?{}:{day:'numeric'}),timeZone:'UTC'
    }).format(new Date(value+(monthOnly?'-01':'')+'T12:00:00Z'));
  }
  function fieldText(key,fields,copy,lang) {
    if(key===0)return dated(fields.from,lang)+' – '+dated(fields.to,lang);
    if(key===1)return fields.duty==='inspector'?copy.positionName:'';
    if(key===2)return dated(fields.to,lang);
    if(key===3)return fields.status==='separated'?copy.statusName:'';
    if(key===4)return dated(fields.period,lang,true);
    const value=fields[['gross','deductions','net'][key-5]];
    const formatted=value.toLocaleString(lang==='ko'?'ko-KR':lang==='en'?'en-US':'es-ES');
    return lang==='ko'?formatted+'원':lang==='en'?'KRW '+formatted:formatted+' KRW';
  }
  const duration = 2900;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function make(tag, cls, value) {
    const el=document.createElement(tag);
    if(cls) el.className=cls;
    if(value!=null) el.textContent=value;
    return el;
  }
  function button(action,value,title,active) {
    const el=make('button','',title);
    el.type='button';el.dataset.desk=action;
    if(value!=null) el.dataset.value=String(value);
    if(active!=null) el.setAttribute('aria-pressed',String(active));
    return el;
  }
  function group(label,items,action,active) {
    const set=make('fieldset','desk-options');
    set.append(make('legend','',label));
    for(const [i,name] of items.entries()) set.append(button(action,i,name,active===i));
    return set;
  }
  function pair(label,value) {
    const row=make('div');
    row.append(make('dt','',label),make('dd','',value));
    return row;
  }
  function serviceFlow(host,visit,copy) {
    const branch=visit.branch, part=visit.parts[branch];
    const el=make('figure','desk-flow');
    const canvas=make('canvas','desk-field');
    canvas.setAttribute('aria-hidden','true');
    const rails=make('figcaption','desk-territories');
    const names=copy.paths[branch];
    for(const name of names) rails.append(make('span','',name));
    const steps=make('ol','desk-process');
    for(const name of copy.steps[branch]) steps.append(make('li','',name));
    const status=make('p','desk-phase');status.setAttribute('role','status');
    el.append(canvas,rails,steps,status);
    visit.visual={canvas,steps,status,part};
    return el;
  }
  function frame(host,visit) {
    const visual=visit.visual,part=visit.parts[visit.branch];
    if(!visual||visual.part!==part) return;
    const {canvas,steps,status}=visual;
    const progress=part.phase==='done' ? 1 : part.phase==='running' ? Math.min(1,(performance.now()-part.started)/duration) : 0;
    const step=part.phase==='ready' ? -1 : Math.min(3,Math.floor(progress*4));
    if(visual.step!==step) {
      visual.step=step;
      Array.from(steps.children).forEach((item,i)=>{
        if(i===step) item.setAttribute('aria-current','step');
        else item.removeAttribute('aria-current');
        item.classList.toggle('travelled',step>=i);
      });
      status.textContent=step<0?'':text[visit.lang].trace[visit.branch][step];
    }
    const rect=canvas.getBoundingClientRect(), w=rect.width||canvas.clientWidth, h=rect.height||canvas.clientHeight;
    if(w>0 && h>0 && window.TerritoryScore) {
      const context=canvas.getContext('2d'), dpr=Math.min(2,window.devicePixelRatio||1);
      const width=Math.round(w*dpr),height=Math.round(h*dpr);
      if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
      if(context) {
        context.setTransform(dpr,0,0,dpr,0,0);context.clearRect(0,0,w,h);
        const agency='employer';
        window.TerritoryScore.render(context,w,h,'former',progress,progress*4,visit.branch,null,null,reduced.matches,{compact:true,labels:false,lang:visit.lang,agency});
      }
    }
    if(part.phase==='running' && progress>=1) {deliver(host,visit);return;}
    if(part.phase==='running') visit.frame=requestAnimationFrame(()=>frame(host,visit));
  }

  function documents(part,copy) {
    const chooser=make('div','desk-body');
    const docs=make('fieldset','desk-doc-options');
    docs.append(make('legend','',copy.forms));
    copy.docs.forEach((name,i)=>{
      const b=button('doc',i,'',part.selected.has(i));
      b.append(make('strong','',name),make('small','',copy.descriptions[i]));docs.append(b);
    });
    const info=make('dl','desk-scope');info.append(pair(copy.recipient,copy.owner));
    const submit=button('issue',null,copy.issue);
    submit.className='desk-submit';submit.disabled=part.selected.size===0;
    chooser.append(docs,group(copy.purpose,copy.purposes,'purpose',part.purpose),info,make('p','desk-note',copy.limit),submit);
    return chooser;
  }
  function receipts(part,copy,lang) {
    const section=make('section','desk-receipt');
    const title=make('h3','',copy.issued);title.tabIndex=-1;section.append(title);
    const meta=make('dl','desk-scope');
    meta.append(pair(copy.issuer,copy.company),pair(copy.recipient,copy.owner),pair(copy.purpose,copy.purposes[part.purpose]));
    section.append(meta);
    const s=scopeWords[lang];
    meta.append(pair(s.alias,part.packet.alias),pair(s.action,s.issue),pair(s.basis,s.record));
    for(const document of part.reply.documents) {
      const i=docNames.indexOf(document.kind);
      const paper=make('article','desk-paper'),values=make('dl','desk-fields');
      for(const k of docFields[i]) values.append(pair(copy.fields[k],fieldText(k,document.fields,copy,lang)));
      paper.append(make('small','',copy.sampleDoc),make('h4','',copy.docs[i]),values,button('save',i,copy.save));section.append(paper);
    }
    section.append(make('p','desk-note',copy.receiptNote),button('again',null,copy.change));return section;
  }
  function draw(host,visit,focus) {
    if(visit.branch===1){window.CounselRoom.render(host,visit.lang);return;}
    if(visit.frame) cancelAnimationFrame(visit.frame);
    visit.frame=0;
    const part=visit.parts[visit.branch],copy=text[visit.lang];
    host.dataset.phase=part.phase;host.dataset.branch=String(visit.branch);
    const content=make('section','desk-room'),header=make('header','desk-heading');
    const title=make('h2','',copy.title);title.tabIndex=-1;
    header.append(make('small','',copy.sample),title,make('p','',copy.intro));
    content.append(header,serviceFlow(host,visit,copy));
    if(part.phase!=='running') {
      content.append(part.phase==='done' ? receipts(part,copy,visit.lang) : documents(part,copy));
    }
    host.replaceChildren(content);
    if(focus) {
      const target=host.querySelector(focus);
      target?.focus?.({preventScroll:true});
      if(focus.endsWith('h3'))target?.scrollIntoView?.({block:'nearest',behavior:'instant'});
    }
    frame(host,visit);
  }
  function deliver(host,visit) {
    const part=visit.parts[visit.branch],packet=part.packet,gate=window.ScopedHandoff;
    const request=gate.receive(packet,'employer');
    const documents=readVerified(packet,request);
    part.reply=gate.returnTo(packet,'ON',{documents,basis:'employer-record'});
    verifiedRequests.delete(packet);
    part.phase='done';
    draw(host,visit,'.desk-receipt h3');
  }
  function begin(host,visit) {
    const part=visit.parts[visit.branch];
    part.reply=null;
    part.packet=window.ScopedHandoff.open('documents',{documents:Array.from(part.selected).sort().map(i=>docNames[i])},{purpose:forPurpose[part.purpose]});
    verifiedRequests.set(part.packet,employersRecord);
    if(reduced.matches) {deliver(host,visit);return;}
    part.phase='running';part.started=performance.now();draw(host,visit,'h2');
  }
  function download(part,i,copy,lang) {
    const document=part.reply?.documents.find(d=>d.kind===docNames[i]);
    if(!document)return;
    const rows=[copy.sampleDoc,copy.docs[i],copy.issuer+' · '+copy.company,copy.recipient+' · '+copy.owner,copy.purpose+' · '+copy.purposes[part.purpose],'',...docFields[i].map(k=>copy.fields[k]+ ' · '+fieldText(k,document.fields,copy,lang))];
    const href=URL.createObjectURL(new Blob(['\uFEFF'+rows.join('\n')],{type:'text/plain;charset=utf-8'}));
    const link=make('a');link.href=href;link.download='ONDURU-sample-'+docNames[i]+'.txt';link.click();
    window.setTimeout(()=>URL.revokeObjectURL(href),1500);
  }
  function onClick(host,visit,event) {
    if(visit.branch===1)return;
    const target=event.target.closest('[data-desk]');
    if(!target||!host.contains(target)) return;
    const action=target.dataset.desk,i=Number(target.dataset.value),part=visit.parts[visit.branch];
    if(part.phase==='running')return;
    let focus='[data-desk="'+action+'"][data-value="'+i+'"]';
    if(action==='doc') {
      if(part.selected.has(i)) part.selected.delete(i);else part.selected.add(i);
    } else if(action==='purpose')part.purpose=i;
    else if(action==='issue'&&part.selected.size){begin(host,visit);return;}
    else if(action==='again'){part.phase='ready';focus='[data-desk="doc"]';}
    else if(action==='save'){download(part,i,text[visit.lang],visit.lang);return;}
    else return;
    draw(host,visit,focus);
  }
  function close(host) {
    const visit=desks.get(host);
    if(!visit)return;
    if(visit.frame)cancelAnimationFrame(visit.frame);
    visit.frame=0;visit.visual=null;visit.active=false;
    if(visit.branch===1)window.CounselRoom.close(host);
    const part=visit.parts[0];
    if(part.phase==='running'){verifiedRequests.delete(part.packet);part.packet=null;part.reply=null;part.phase='ready';}
    visit.observer?.disconnect();
  }
  function render(host,{branch=0,lang='ko'}={}) {
    let visit=desks.get(host);
    if(!visit) {
      visit={branch:0,lang:'ko',frame:0,active:false,parts:[
        {phase:'ready',selected:new Set([0]),purpose:0}
      ]};
      desks.set(host,visit);host.addEventListener('click',event=>onClick(host,visit,event));
      if(typeof ResizeObserver!=='undefined') visit.observer=new ResizeObserver(()=>{
        if(visit.active&&visit.branch===0&&visit.parts[0].phase!=='running')frame(host,visit);
      });
    }
    const family=Number(branch)===1?1:0;
    if(visit.active&&visit.branch!==family)close(host);
    visit.active=true;visit.branch=family;visit.lang=Object.hasOwn(text,lang)?lang:'ko';
    visit.observer?.observe(host);
    draw(host,visit);
  }
  window.ServiceDesk={render,close};
})();
