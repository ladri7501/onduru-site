(() => {
  'use strict';

  const words = {
    ko: {
      history:'이 컷이 만들어진 과정',open:'이 컷의 인계 기록', close:'닫기', lead:'감독이 맡긴 한 컷을 따라갑니다. 촬영 원본과 배우의 얼굴·목소리는 제작사에 남습니다.',
      hops:['제작사에서 음향실로','음향실에서 편집실로'], purpose:['이 컷의 발소리 만들기','발소리를 다음 컷에 맞추기'],
      alias:'이번 의뢰의 가명', inputs:'건넨 자료', output:'돌아온 결과', waiting:'첫 편집본을 감독이 검토하고 있습니다.',
      status:['감독이 이 컷의 발소리 작업을 허락했습니다.','의뢰를 받은 음향실의 두루가 모여 세 걸음의 소리를 맞춥니다.','음향실이 제작사에 발소리 큐를 돌려줬습니다.','음향 책임자가 편집실에 보낼 범위를 새로 정했습니다.','믹스를 받은 편집실의 두루가 모여 다음 컷을 잇습니다.','편집실의 연결 지점이 음향실로 돌아왔습니다. 감독이 이어진 컷을 확인합니다.'],
      timing:(duration,steps)=>`합성 타이밍표 · ${duration}초, 돌바닥을 딛는 ${steps}걸음`,
      cue:(frame)=>`구두 굽 소리가 닿는 ${frame}번째 프레임`, splice:(frame)=>`다음 컷의 ${frame}번째 프레임에서 화면과 소리가 만납니다.`
    },
    en: {
      history:'How this shot was made',open:'Follow this shot',close:'Close',lead:'Follow the shot entrusted by the director. The production studio keeps the camera originals and the actor’s face and voice.',
      hops:['Production to sound','Sound to picture editing'],purpose:['Design the footsteps for this shot','Sync the footsteps to the next cut'],
      alias:'Alias for this request',inputs:'Material sent',output:'Result returned',waiting:'The director is reviewing the first cut.',
      status:['The director authorises footsteps for this shot.','The sound studio accepts. Its agents gather to time the three footsteps.','The sound studio returns a footstep cue to production.','The sound supervisor grants a fresh permission for editing.','The editor accepts the mix. Editing agents gather to join the next shot.','The edit point returns to the sound studio. The director reviews the joined cut.'],
      timing:(duration,steps)=>`Synthetic timing sheet · ${duration} seconds, ${steps} footsteps on stone`,
      cue:(frame)=>`A heel lands on frame ${frame}`,splice:(frame)=>`The picture and the footsteps meet on frame ${frame} of the next cut.`
    },
    es: {
      history:'Cómo se hizo este plano',open:'Seguir este plano',close:'Cerrar',lead:'Sigue el plano que encarga la directora. El estudio de producción conserva los originales y el rostro y la voz de la actriz.',
      hops:['De producción a sonido','De sonido a montaje'],purpose:['Crear los pasos de este plano','Sincronizar los pasos con el plano siguiente'],
      alias:'Seudónimo del encargo',inputs:'Material enviado',output:'Resultado recibido',waiting:'La directora revisa el primer montaje.',
      status:['La directora autoriza los pasos de este plano.','El estudio de sonido acepta. Sus agentes se reúnen para sincronizar los tres pasos.','Sonido devuelve a producción la señal de los pasos.','La responsable de sonido da un nuevo permiso al estudio de montaje.','La montadora acepta la mezcla. Los agentes de montaje se reúnen para enlazar el siguiente plano.','El punto de montaje vuelve al estudio de sonido. La directora revisa el corte.'],
      timing:(duration,steps)=>`Guía sintética · ${duration} segundos, ${steps} pasos sobre piedra`,
      cue:(frame)=>`El tacón pisa en el fotograma ${frame}`,splice:(frame)=>`Imagen y sonido coinciden en el fotograma ${frame} del siguiente plano.`
    }
  };

  function mount(dialog,stageButton,endButton,controls) {
    const gates=[.687,.756,.835,.855,.875,.97];
    let routes=[], phase=0, language='ko', opener=null, resume=false;
    function advance(count) {
      const exchange=window.ScopedHandoff;
      if(count>=1 && !routes[0]) {
        const packet=exchange.open('filmSound',{duration:3,steps:[6,18,30],surface:'stone'},{purpose:'score-footsteps'});
        routes[0]={packet};
      }
      const sound=routes[0];
      if(count>=2 && !sound.input) sound.input=exchange.receive(sound.packet,'sound');
      if(count>=3 && !sound.result) {
        const frame=sound.input.steps[1];
        sound.result=exchange.returnTo(sound.packet,'production',{soundCue:'heel-'+frame,basis:'timing-sheet'});
      }
      if(count>=4 && !routes[1]) {
        const packet=exchange.open('filmEdit',{duration:sound.input.duration,soundCue:sound.result.soundCue,cutBeat:Number(sound.result.soundCue.split('-').at(-1))},{purpose:'sync-next-cut'});
        routes[1]={packet};
      }
      const editing=routes[1];
      if(count>=5 && !editing.input) editing.input=exchange.receive(editing.packet,'editing');
      if(count>=6 && !editing.result) editing.result=exchange.returnTo(editing.packet,'sound',{editCue:'join-'+editing.input.cutBeat,basis:editing.input.soundCue});
    }
    function el(tag,text) {
      const node=document.createElement(tag);
      if(text!==undefined) node.textContent=text;
      return node;
    }
    const bar=el('header'), title=el('h2'), close=el('button'), content=el('div');
    title.id='film-log-title'; close.type='button';
    bar.append(title,close); dialog.append(bar,content);
    function row(list,label,value){list.append(el('dt',label),el('dd',value));}
    function paint() {
      const copy=words[language]; title.textContent=copy.open; close.textContent=copy.close;
      const lead=el('p',copy.lead); content.replaceChildren(lead);
      const history=el('details'), notes=el('ol');
      for(const [name,line] of window.TerritoryGuide[language].notes.slice(0,5)){
        const item=el('li');
        item.append(el('strong',name),document.createTextNode(' · '+line));
        notes.append(item);
      }
      history.append(el('summary',copy.history),notes);content.append(history);
      if(!phase) {content.append(el('p',copy.waiting));return;}
      const last=phase>=4?1:0;
      for(let i=0;i<=last;i++){
        const data=routes[i], packet=data.packet, status=i===0?Math.min(phase,3)-1:phase-1;
        const section=el('section'), details=el('dl');
        section.append(el('h3',copy.hops[i]),el('p',copy.purpose[i]));
        row(details,copy.alias,packet.alias);
        const fields=packet.input;
        row(details,copy.inputs,i===0?copy.timing(fields.duration,fields.steps.length):copy.cue(fields.cutBeat));
        if(i===0 && phase>=3) row(details,copy.output,copy.cue(Number(data.result.soundCue.split('-').at(-1))));
        if(i===1 && phase===6) row(details,copy.output,copy.splice(Number(data.result.editCue.split('-').at(-1))));
        section.append(details,el('p',copy.status[status])); content.append(section);
      }
    }
    function update(active,progress,locale,inFooter) {
      const seen=active && progress>=.65;
      stageButton.hidden=!seen || inFooter; endButton.hidden=!seen;
      if(language!==locale || !stageButton.textContent){
        language=locale;stageButton.textContent=endButton.textContent=words[locale].open;
      }
      const next=seen ? gates.filter(g=>progress>=g).length : 0;
      if(next!==phase) {if(next) advance(next);phase=next;if(dialog.open)paint();}
    }
    function open(event) {
      opener=event.currentTarget;resume=controls.pauseFilm();
      paint();dialog.showModal();dialog.scrollTop=0;close.focus();
    }
    stageButton.addEventListener('click',open);endButton.addEventListener('click',open);
    close.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',()=>{
      opener?.focus({preventScroll:true});
      if(resume) controls.resumeFilm(resume);
      resume=false;
    });
    function reset(){routes=[];phase=0;stageButton.hidden=true;endButton.hidden=true;}
    return {update,reset,isOpen:()=>dialog.open};
  }
  window.FilmHandoff={mount};
})();
