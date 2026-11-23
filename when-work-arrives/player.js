(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const root = document.documentElement;
  const stage = $('stage'), title = $('title'), titleBlock = title.parentElement;
  const cap = document.querySelector('.cap'), reel = $('reel');
  const paths = $('paths'), guide = $('guide'), transport = $('transport'), sound = $('sound'), enso = $('enso');
  const languages = ['ko', 'en', 'es'];
  const words = {
    ko: {
      controls:'전시 조작', language:'언어 바꾸기. 현재 한국어', on:'소리 켜기', off:'소리 끄기', play:'재생', pause:'일시정지', replay:'처음부터 다시 재생',
      top:'첫머리로', mark:'원을 다시 그리기', credit:'구상·결정 On · 작품 구성·실행 Duru', prologue:'우주에서 다시 보기',
      nav:['산업','기업','개인','연대','기록','도록'], sections:'전시 장면', record:'어제의 두루, 오늘의 두루', handoff:'다른 두루와 이 일 이어 보기',
      back:'장면으로 돌아가기', cost:['고용 유지','감축안 검토']
    },
    en: {
      controls:'Exhibition controls', language:'Change language. Currently English', on:'Turn sound on', off:'Turn sound off', play:'Play', pause:'Pause', replay:'Play again',
      top:'Back to the beginning', mark:'Redraw the circle', credit:'Concept and decisions by On · Composition and realization by Duru', prologue:'Return to the stars',
      nav:['Industry','Business','Personal','Solidarity','Record','Catalogue'], sections:'Exhibition scenes', record:'Yesterday’s Duru, today’s Duru', handoff:'Carry the work on with another Duru',
      back:'Return to the scene', cost:['Keep jobs','Review staff cuts']
    },
    es: {
      controls:'Controles de la exposición', language:'Cambiar el idioma. Español seleccionado', on:'Activar el sonido', off:'Desactivar el sonido', play:'Reproducir', pause:'Pausar', replay:'Volver a reproducir',
      top:'Volver al principio', mark:'Volver a trazar el círculo', credit:'Concepto y decisiones de On · Composición y realización de Duru', prologue:'Volver a las estrellas',
      nav:['Industria','Empresa','Personal','Solidaridad','Registro','Catálogo'], sections:'Escenas de la exposición', record:'El Duru de ayer y el de hoy', handoff:'Continuar el encargo con otro Duru',
      back:'Volver a la escena', cost:['Mantener el empleo','Estudiar los recortes']
    }
  };
  const filmStops = [0,.12,.27,.40,.51,.65,.73,.856,1];
  const filmDuration = 41000, outroDuration = 850;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.max(0,Math.min(1,n));
  function smooth(n) {const t=clamp(n); return t*t*(3-2*t);}
  function position() {return Math.max(0,window.scrollY);}
  let locale=firstLocale(), current='industry', lastBusiness='documents', detail=null, detailOpener=null, costBranch=0;
  let chosen={}, fittingDecision=null;
  let mode='idle', scene=-1, frame=0, endY=1, filmClockStart=0, startTime=0, outroStart=0, footerLift=0;
  let lastStageProgress=-1, spokenKey=null, wakeUntil=0, soundOn=false, audio=null;
  let guideReturn=null, resumeGuide=null, resumeGlobal=null;
  const art=window.TerritoryArt.mount(stage);
  const reading=window.ExhibitReading.mount(cap);
  const prologue=window.Prologue.mount($('prologue'),{getFilmOrigin:visibility=>art.getOrigin(visibility),onFinish:enterExhibition});
  const fitting=window.Fitting.mount($('fitting'));
  const theatre=window.ExhibitTheatre.mount($('story-theatre'),{
    onDetail:openDetail,
    onStory:id=>{current=id;lastBusiness=id;updateNav();setAddress(id);},
    onChoice:(id,value)=>{chosen[id]=value;}
  });
  const coalition=window.CoalitionRoom.mount($('coalition-dialog'),{onClose:closeGlobal});
  const record=window.ExhibitRecord.mount($('exhibit-record'),{onClose:closeGlobal});
  const filmLog=window.FilmHandoff.mount($('film-log'),$('film-log-open'),$('film-log-end'),{
    pauseFilm:stopFilm, resumeFilm:resume=>restoreFilm(resume)
  });
  const scopeButtons=[...paths.querySelectorAll('[data-scope]')];
  const mainButtons=[...scopeButtons,$('commons-open'),$('memory-open'),$('stage-guide')];

  // Site rule: keep the language chosen anywhere on the site; otherwise Korean for Korean browsers, English for others.
  function firstLocale() {
    let saved=null;
    try{saved=localStorage.getItem('onduru-lang');}catch{}
    if(languages.includes(saved))return saved;
    const nav=typeof navigator==='object'&&navigator?navigator:null;
    const browser=nav&&((nav.languages&&nav.languages[0])||nav.language)||'';
    if(!browser)return languages.includes(root.lang)?root.lang:'ko';
    return /^ko\b/i.test(browser)?'ko':'en';
  }
  function rememberLocale() {try{localStorage.setItem('onduru-lang',locale);}catch{}}
  function activeFilm() {return current==='industry' && !prologue.isOpen();}
  function modalOpen() {return guide.open||coalition.isOpen()||record.isOpen()||filmLog.isOpen();}
  function category() {return current==='industry'?'film':current==='personal'?'personal':'business';}
  function setAddress(id) {
    if(!window.history?.replaceState || location.protocol==='file:')return;
    const url=new URL(location.href);
    url.hash=id==='documents'?'business':id;
    if(url.href!==location.href)window.history.replaceState(window.history.state,'',url.href);
  }
  function updateNav() {
    const copy=words[locale];
    mainButtons.forEach((b,i)=>{b.textContent=copy.nav[i];});
    scopeButtons.forEach(b=>b.setAttribute('aria-pressed',String(category()===b.dataset.scope)));
    paths.setAttribute('aria-label',copy.sections);
    $('scopes').setAttribute('aria-label',copy.sections);
    $('memory-guide').textContent=copy.record;
    $('commons-guide').textContent=copy.handoff;
    paths.hidden=false;
    const film=current==='industry';
    transport.hidden=!film;
    sound.hidden=!film;
  }
  function syncControls() {
    const copy=words[locale], playing=prologue.isOpen()?!prologue.isPaused():mode!=='idle';
    const label=playing?copy.pause:activeFilm()&&position()>=endY-1?copy.replay:copy.play;
    transport.setAttribute('aria-pressed',String(playing));
    transport.setAttribute('aria-label',label);transport.title=label;
    sound.setAttribute('aria-pressed',String(soundOn));sound.setAttribute('aria-label',soundOn?copy.off:copy.on);sound.title=sound.getAttribute('aria-label');
  }
  function fitTitle() {
    const css = getComputedStyle(titleBlock), viewportW = root.clientWidth || window.innerWidth, viewportH = window.innerHeight;
    const width = titleBlock.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
    const range = document.createRange();
    title.classList.add('fit'); title.style.fontSize='100px';
    range.selectNodeContents(title);
    const measured = range.getBoundingClientRect().width;
    if (!measured) return;
    const aim = viewportW >= 900 && viewportW > viewportH ? Math.min(width,viewportW*.5) : width;
    const full = Math.min(aim / measured * 98.5,viewportH*.12);
    let size = Math.min(full,Math.max(24,.5*full));
    title.style.fontSize = size.toFixed(2)+'px';
    for (let i=0; i<8 && size>30 && title.getBoundingClientRect().bottom-titleBlock.getBoundingClientRect().top>viewportH*.96; i++) {
      size = Math.max(30, size*.88); title.style.fontSize=size.toFixed(2)+'px';
    }
  }
  function fitCaption() {
    cap.style.top = '';
    const bottom = paths.hidden ? window.innerHeight - 58 : paths.getBoundingClientRect().top - 8;
    const overflow = cap.getBoundingClientRect().bottom - bottom;
    if (overflow>0) cap.style.top=Math.max(0,cap.getBoundingClientRect().top-overflow)+'px';
  }
  function chime(index) {
    if (!soundOn || !audio || audio.state !== 'running' || document.hidden) return;
    const now = audio.currentTime;
    const pitch = [196,246.94,220,164.81,261.63,196,293.66,196][index];
    const source = audio.createOscillator(), gain = audio.createGain();
    source.frequency.value=pitch;
    gain.gain.setValueAtTime(.0001,now);
    gain.gain.exponentialRampToValueAtTime(.024,now+.025);
    gain.gain.exponentialRampToValueAtTime(.0001,now+.55);
    source.connect(gain); gain.connect(audio.destination);
    source.onended=()=>{source.disconnect();gain.disconnect();};
    source.start(now); source.stop(now+.56);
  }
  function localize() {
    const ui=words[locale], copy=window.TerritoryCopy[locale];
    root.lang=locale;root.dataset.lang=locale;
    document.title=copy.title+' · ONDURU';
    title.textContent=$('work-title').textContent=copy.title;
    $('statement').textContent=copy.statement;$('credits').textContent=ui.credit;
    $('replay').textContent=ui.top;$('replay-prologue').textContent=ui.prologue;
    enso.setAttribute('aria-label',ui.mark);enso.title=ui.mark;
    $('lang').setAttribute('aria-label',ui.language);$('lang').title=ui.language;
    document.querySelector('.ctrl').setAttribute('aria-label',ui.controls);
    $('cost-replay').textContent=$('service-replay').textContent=ui.back;
    [...$('cost-branches').querySelectorAll('[data-cost-branch]')].forEach((btn,i)=>{btn.textContent=ui.cost[i];});
    window.CaseGuide.localize(locale,copy.title); prologue.setLocale(locale);
    theatre.setLocale(locale); record.setLocale(locale); coalition.setLocale(locale);
    if(detail)renderDetail(false);
    updateNav();syncControls();scene=-1;lastStageProgress=-1;resize();
  }
  function display(p,now) {
    const stops=filmStops;
    let next=0;
    while(next<stops.length-2 && p>=stops[next+1])next++;
    const rel=clamp((p-stops[next])/(stops[next+1]-stops[next]));
    const opening=1-smooth((p-.014)/.060);
    titleBlock.style.opacity=String(reduced.matches?Number(p<.045):opening);
    titleBlock.style.visibility=opening<.001?'hidden':'';
    enso.tabIndex=opening<.01?-1:0;
    if(scene!==next){
      if(scene!==-1 && mode==='playing')chime(next);
      scene=next;cap.dataset.scene=String(next+1);
      reading.setScene(window.TerritoryCopy[locale].scenes[next],window.TerritoryGuide[locale].notes[next],null,true);
      fitCaption();
    }
    const spoken=reading.render(rel,reduced.matches);
    if(spoken!==spokenKey){spokenKey=spoken;$('spoken').textContent=spoken;}
    const extra=Math.max(0,position()-endY);
    const alpha=next===stops.length-2?1:1-smooth((rel-.967)/.033);
    cap.style.opacity=String(alpha*(1-smooth(extra/Math.max(1,innerHeight*.2))));
    stage.style.transform=extra>0?'translate3d(0,-'+Math.round(extra)+'px,0)':'';
    filmLog.update(activeFilm(),p,locale,extra>2);
    const artP=reduced.matches && p>.001 && p<.999?(stops[next]+stops[next+1])*.5:p;
    if(artP!==lastStageProgress || !reduced.matches&&(mode==='playing'||now<wakeUntil)){
      art.render(artP,reduced.matches||prologue.isOpen()?0:Math.max(0,now-filmClockStart)*.0014);
      lastStageProgress=artP;
    }
  }
  function requestFrame(){if(!frame&&!document.hidden&&activeFilm()&&!modalOpen())frame=requestAnimationFrame(tick);}
  function resize() {
    if(current!=='industry')return;
    endY=Math.max(1,reel.offsetHeight-innerHeight);
    lastStageProgress=-1;fitTitle();fitCaption();requestFrame();
  }
  function tick(now) {
    frame=0;
    if(!activeFilm()||modalOpen()||document.hidden)return;
    if(mode==='playing'){
      const p=clamp((now-startTime)/filmDuration);
      window.scrollTo(0,Math.round(p*endY));display(p,now);
      if(p>=1)finish(now);
    }else if(mode==='outro'){
      const q=reduced.matches?1:clamp((now-outroStart)/outroDuration);
      window.scrollTo(0,Math.round(endY+smooth(q)*footerLift));display(1,now);
      if(q>=1){mode='idle';syncControls();}
    }else display(clamp(position()/endY),now);
    if(mode!=='idle'||(!reduced.matches&&now<wakeUntil))requestFrame();
  }
  function finish(now) {
    mode='outro';outroStart=now;
    footerLift=Math.min($('colophon').offsetHeight,innerHeight*.82);
    root.classList.add('ended');requestFrame();
  }
  function stopFilm() {
    const previous=mode==='idle'?null:{mode,at:performance.now()};
    mode='idle';syncControls();return previous;
  }
  function restoreFilm(previous) {
    if(!previous||!activeFilm()||modalOpen()||document.hidden)return;
    const elapsed=performance.now()-previous.at;
    startTime+=elapsed;filmClockStart+=elapsed;outroStart+=elapsed;
    mode=previous.mode;syncControls();requestFrame();
  }
  function playFilm() {
    if(!activeFilm()||modalOpen())return;
    if(position()>=endY-1)rewindFilm();
    startTime=performance.now()-clamp(position()/endY)*filmDuration;
    mode='playing';syncControls();requestFrame();
  }
  function rewindFilm() {
    filmLog.reset();scene=-1;lastStageProgress=-1;spokenKey=null;
    root.classList.remove('ended');window.scrollTo(0,0);filmClockStart=performance.now();
    stage.style.transform='';resize();
  }
  function enterExhibition() {
    delete root.dataset.entering;$('work').inert=false;paths.inert=false;
    rewindFilm();display(0,performance.now());
    if(!reduced.matches)playFilm();else syncControls();
  }
  function startPrologue() {
    stopFilm();current='industry';root.dataset.mode='film';$('work').hidden=false;stage.hidden=false;
    rewindFilm();root.dataset.entering='';
    $('work').inert=true;paths.inert=true;updateNav();
    display(0,performance.now());prologue.play(locale);syncControls();
  }
  function selectScene(id,{address=true}={}) {
    if(prologue.isOpen())prologue.finish();
    stopFilm();closeDetail(false);
    current=id;root.classList.remove('ended');root.dataset.mode=id==='industry'?'film':'story';
    $('work').hidden=stage.hidden=id!=='industry';
    updateNav();if(address)setAddress(id);
    if(current==='industry'){
      theatre.hide();rewindFilm();display(0,performance.now());if(!reduced.matches)playFilm();
    }else{
      if(id!=='personal')lastBusiness=id;
      filmLog.reset();window.scrollTo(0,0);
      theatre.setPaused(false);theatre.show(id,locale);
    }
    syncControls();
  }
  function renderDetail(focus) {
    if(detail==='personal'){
      if(fitting.isOpen())fitting.setLocale(locale);
      else fitting.open({locale,allowShop:chosen.personal!=='owned',review:fittingDecision,focus,
        onReturn:()=>closeDetail(true),onCommit:decision=>{fittingDecision=decision;closeDetail(true);}});
      return;
    }
    const cost=detail==='cost', room=$(cost?'cost-room':'service-room'), content=$(cost?'cost-study':'service-desk');
    room.hidden=false;
    if(cost){
      for(const b of $('cost-branches').querySelectorAll('[data-cost-branch]'))b.setAttribute('aria-pressed',String(Number(b.dataset.costBranch)===costBranch));
      window.CostStudy.render(content,{branch:costBranch,lang:locale});
    }else window.ServiceDesk.render(content,{branch:detail==='counsel'?1:0,lang:locale});
    room.setAttribute('aria-label',window.ExhibitStories[detail].label[locale]);
    if(focus){room.scrollTop=0;content.focus({preventScroll:true});}
  }
  function openDetail(id) {
    if(!theatre.isOpen()||id!==current)return;
    detailOpener=document.activeElement;
    detail=id;costBranch=chosen.cost==='burden'?1:0;theatre.setPaused(true);$('story-theatre').inert=true;root.dataset.mode='detail';
    renderDetail(true);
  }
  function closeDetail(returnFocus) {
    if(!detail)return;
    if(detail==='personal')fitting.close();
    else if(detail!=='cost')window.ServiceDesk.close($('service-desk'));
    $('service-room').hidden=$('cost-room').hidden=true;
    detail=null;root.dataset.mode='story';$('story-theatre').inert=false;
    if(returnFocus){theatre.setPaused(false);detailOpener?.focus({preventScroll:true});}
    detailOpener=null;
  }
  function openGuide(event) {
    if(modalOpen()||prologue.isOpen())return;
    guideReturn=event.currentTarget;
    resumeGuide=stopFilm();theatre.setPaused(true);
    guide.showModal();guide.scrollTop=0;
  }
  function openGlobal(view,opener) {
    if(coalition.isOpen()||record.isOpen()||prologue.isOpen())return;
    resumeGlobal=stopFilm();theatre.setPaused(true);
    if(view==='coalition')coalition.open(locale,opener);
    else record.open(view,locale,opener);
    setAddress(view);
  }
  function closeGlobal() {
    if(!closingForNavigation)setAddress(guide.open?'catalogue':current);
    if(!guide.open&&!detail)theatre.setPaused(false);
    restoreFilm(resumeGlobal);resumeGlobal=null;requestFrame();
  }
  let routeEpoch=0, closingForNavigation=false;
  const exhibitRoutes=new Set(['industry','business','documents','counsel','cost','personal','coalition','record','handoff','catalogue']);
  function followAddress() {
    const route=location.hash.slice(1);
    if(!exhibitRoutes.has(route))return false;
    const epoch=++routeEpoch;
    function enterRoute(){
      if(epoch!==routeEpoch)return;
      closingForNavigation=false;
      if(prologue.isOpen())prologue.finish();
      if(route==='coalition'||route==='record'||route==='handoff'){
        openGlobal(route,route==='coalition'?$('commons-open'):$('memory-open'));
      }else if(route==='catalogue')$('stage-guide').click();
      else selectScene(route==='business'?'documents':route,{address:false});
    }
    // Unwind a catalogue overlay and its child before applying an in-tab link.
    const dialogs=[...document.querySelectorAll('dialog[open]')].reverse();
    if(dialogs.length){
      closingForNavigation=true;
      (async()=>{
        for(const dialog of dialogs){
          if(epoch!==routeEpoch)return;
          if(dialog.open)await new Promise(resolve=>{
            dialog.addEventListener('close',resolve,{once:true});
            dialog.close();
          });
        }
        enterRoute();
      })();
    }else enterRoute();
    return true;
  }
  $('stage-guide').addEventListener('click',event=>{openGuide(event);setAddress('catalogue');});
  $('close-guide').addEventListener('click',()=>guide.close());
  guide.addEventListener('close',()=>{
    if(!closingForNavigation)setAddress(current);guideReturn?.focus({preventScroll:true});
    if(!detail)theatre.setPaused(false);restoreFilm(resumeGuide);resumeGuide=null;requestFrame();
  });
  for(const [id,view] of [['commons-open','coalition'],['memory-open','record'],['memory-guide','record'],['commons-guide','handoff']]){
    $(id).addEventListener('click',event=>openGlobal(view,event.currentTarget));
  }
  for(const button of scopeButtons)button.addEventListener('click',()=>{
    selectScene(({film:'industry',business:lastBusiness,personal:'personal'})[button.dataset.scope]);
  });
  for(const id of ['cost-replay','service-replay'])$(id).addEventListener('click',()=>closeDetail(true));
  $('cost-branches').addEventListener('click',event=>{
    const b=event.target.closest('[data-cost-branch]');if(!b)return;
    costBranch=Number(b.dataset.costBranch);renderDetail(false);
  });
  // The label that was pressed is the language that opens (On, 2026-11-23). From the keyboard the button steps to the next one.
  $('lang').addEventListener('click',(event)=>{
    const button=$('lang');let pick=null;
    if(event&&event.detail>0&&typeof button.querySelectorAll==='function'){
      let nearest=Infinity;
      for(const mark of button.querySelectorAll('[lang]')){
        const box=mark.getBoundingClientRect(), gap=Math.abs(event.clientX-(box.left+box.width/2));
        if(gap<nearest){nearest=gap;pick=mark.lang;}
      }
    }
    if(!languages.includes(pick))pick=languages[(languages.indexOf(locale)+1)%languages.length];
    if(pick===locale)return;
    locale=pick;rememberLocale();localize();
  });
  enso.addEventListener('click',()=>{
    enso.classList.remove('again');requestAnimationFrame(()=>requestAnimationFrame(()=>enso.classList.add('again')));
  });
  $('replay').addEventListener('click',()=>{stopFilm();rewindFilm();display(0,performance.now());syncControls();transport.focus({preventScroll:true});});
  $('replay-prologue').addEventListener('click',()=>{startPrologue();transport.focus({preventScroll:true});});
  function toggle(){
    if(prologue.isOpen()){prologue.setPaused(!prologue.isPaused());syncControls();}
    else if(mode==='idle')playFilm();else stopFilm();
  }
  transport.addEventListener('click',toggle);
  sound.addEventListener('click',async()=>{
    try {
      if(soundOn) {soundOn=false;if(audio) await audio.suspend();}
      else {
        const Context = window.AudioContext || window.webkitAudioContext;
        if(!Context) {sound.disabled=true;return;}
        if(!audio) audio=new Context();
        await audio.resume(); soundOn=true;chime(Math.max(0,scene));
      }
    } catch {soundOn=false;} finally {syncControls();}
  });
  document.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||event.target.closest('select,input,textarea,summary'))return;
    if(event.target.closest('button,a')&&(event.key===' '||event.key==='Enter'))return;
    if(prologue.isOpen()){if(event.key===' '){event.preventDefault();toggle();}return;}
    if(!activeFilm()||modalOpen())return;
    if(event.key===' '){event.preventDefault();toggle();return;}
    const forward=['ArrowDown','ArrowRight','PageDown'].includes(event.key);
    if(!forward&&!['ArrowUp','ArrowLeft','PageUp','Home','End'].includes(event.key))return;
    event.preventDefault();stopFilm();const p=clamp(position()/endY);
    const beats=event.key.startsWith('Page')?[.10]:[.10,.34,.58,.80];
    const stations=[0,...filmStops.slice(0,-1).flatMap((s,i)=>beats.map(b=>s+b*(filmStops[i+1]-s))),1];
    const dest=event.key==='Home'?0:event.key==='End'?1:forward?(stations.find(s=>s>p+.002)??1):([...stations].reverse().find(s=>s<p-.002)??0);
    window.scrollTo(0,Math.round(dest*endY));display(dest,performance.now());if(dest===1)finish(performance.now());requestFrame();
  });
  function cancelManual(){if(activeFilm()&&!modalOpen()&&mode!=='idle')stopFilm();}
  window.addEventListener('wheel',cancelManual,{passive:true});window.addEventListener('touchmove',cancelManual,{passive:true});
  stage.addEventListener('pointermove',()=>{if(!reduced.matches){wakeUntil=performance.now()+800;requestFrame();}},{passive:true});
  window.addEventListener('scroll',()=>{if(mode==='idle')requestFrame();},{passive:true});
  window.addEventListener('resize',resize,{passive:true});
  reduced.addEventListener('change',()=>{stopFilm();lastStageProgress=-1;requestFrame();});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){stopFilm();cancelAnimationFrame(frame);frame=0;}
    theatre.setPaused(document.hidden||Boolean(detail)||modalOpen());
    if(!document.hidden)requestFrame();
  });
  window.addEventListener('pagehide',()=>{stopFilm();if(audio)audio.suspend().catch(()=>{});soundOn=false;syncControls();});
  window.addEventListener('pageshow',()=>{resize();requestFrame();});
  window.addEventListener('hashchange',followAddress);
  document.fonts?.ready.then(resize);
  localize();
  if(!followAddress())startPrologue();
})();
