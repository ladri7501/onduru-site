/* The same four-beat stage hosts a request in a company, a public service or a wardrobe. */
(() => {
  'use strict';
  const ns = 'http://www.w3.org/2000/svg';
  const TAU = Math.PI * 2;
  const business = ['documents', 'counsel', 'cost'];
  const words = {
    ko: { business: '기업', personal: '개인', scenes: '장면', pause: '잠시 멈춤', play: '계속 보기', replay: '다시 보기', next: '다음 장면', prev: '이전 장면', detail: '장면의 세부 과정', exit: '전시로 돌아가기' },
    en: { business: 'Enterprise', personal: 'Personal', scenes: 'Scenes', pause: 'Pause', play: 'Continue', replay: 'Replay', next: 'Next scene', prev: 'Previous scene', detail: 'Explore the process', exit: 'Return to the exhibition' },
    es: { business: 'Empresa', personal: 'Personal', scenes: 'Escenas', pause: 'Pausar', play: 'Continuar', replay: 'Volver a ver', next: 'Escena siguiente', prev: 'Escena anterior', detail: 'Explorar el proceso', exit: 'Volver a la exposición' }
  };
  const colors = { on: '#ddd6c7', gate: '#96cfbf', source: '#ccad7f', work: '#9bbbd2', ally: '#bd99ac' };
  const glyphs = {
    person: 'M-4-3a4 4 0 1 1 8 0a4 4 0 1 1-8 0 M-9 10q1-7 9-7t9 7',
    letter: 'M-12-8h24v16h-24z M-12-8l12 9 12-9 M-12 8l7-7m17 7-7-7',
    seal: 'M-8 7h16l-1-4-5-2v-2c2-1 3-3 3-5 0-6-10-6-10 0 0 2 1 4 3 5v2l-5 2z M-9 11H9',
    archive: 'M-10-9h20v18h-20z M-10-2h20 M-10 4h20 M-2-6h4m-4 7h4m-4 6h4',
    home: 'M-13 0l13-10 13 10 M-9-2v12h18V-2 M-2 10V3h5v7',
    work: 'M-12-5h24v15h-24z M-5-5v-4h10v4 M-12 0q12 7 24 0 M-2 2v3h4V2',
    calendar: 'M-10-8h20v18h-20z M-6-11v5m12-5v5 M-10-2h20 M-5 2h3m3 0h3m-9 4h3',
    forecast: 'M-9 3q-8-1-5-7 2-4 7-3 3-7 9-4 4 1 5 6 7-1 7 4 0 4-5 4z M-7 7l-2 4m8-4-2 4m8-4-2 4',
    wardrobe: 'M-2-6q-1-5 3-5 6 0 3 5L1-2v2l14 8q2 2-2 2h-26q-4 0-2-2L0 0',
    shop: 'M-12-3l3-7H9l3 7q0 6-6 3-3 3-6 0-3 3-6 0-5 3-6-3z M-10 1v9h20V1 M-3 10V4h6v6',
    contract: 'M-8-11h11l5 5v17H-8z M3-11v6h5 M-4 0H4m-8 4h6m-6 4h4',
    parcel: 'M-11-5l11-5 11 5v13L0 12-11 8z M-11-5L0 0l11-5M0 0v12m-6-19 12 6',
    gate: 'M-12 9v-17h9m6 0h9V9 M-8 0H7M3-4l5 4-5 4',
    foundry: 'M-13 8h26V-5l-7 5v-7l-9 6v-9h-5l-1 11h-4z M-6 5h2m3 0h2m3 0h2',
    synthesis: 'M-11-5h5l5 5h5m-15 6h5l5-6m4-1 4 3 4-7 M-3-9l3-2 3 2'
  };
  const autoArt = { on: 'person', portal: 'gate', affiliate: 'gate', hr: 'archive', public: 'gate', foundry: 'foundry', synthesis: 'synthesis', housing: 'home', work: 'work', purchasing: 'contract', operations: 'parcel', wardrobe: 'wardrobe', forecast: 'forecast', calendar: 'calendar', shop: 'shop' };
  function svg(tag, attributes = {}) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, String(value)));
    return el;
  }
  function html(tag, className) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }
  function btn(label, action, className) {
    const node = html('button', className);
    node.type = 'button';
    node.textContent = label;
    node.addEventListener('click', action);
    return node;
  }
  function iconButton(symbol, action) {
    const button = btn('', action, 'et-icon');
    const picture = svg('svg', {viewBox:'0 0 24 24','aria-hidden':true});
    picture.append(svg('path', {d:symbol,fill:'none',stroke:'currentColor','stroke-width':1.5,'stroke-linecap':'round','stroke-linejoin':'round'}));
    button.append(picture);
    return button;
  }
  function text(value,lang) { return typeof value === 'string' ? value : value?.[lang] || value?.ko || ''; }
  const round = value => Number(value.toFixed(2));
  function contour(kind, u, v, seed) {
    const a = u * TAU;
    const radius = .80 + v * .15;
    const c = Math.cos(a), s = Math.sin(a);
    switch (kind) {
      case 'on': return [(1 + v * .13) * c, (.30 + v * .10) * s + .09 * Math.sin(a * 2 + .3) - .14 * c + .18 * v];
      case 'source': return [radius * Math.sign(c) * Math.pow(Math.abs(c), .53), .48 * Math.sign(s) * Math.pow(Math.abs(s), .67) + .19 * v - .17 * c];
      case 'gate': return [(radius + .09 * Math.cos(a * 3)) * c, (.38 + v * .09) * s + .18 * Math.sin(2 * a - .5) + .26 * v];
      case 'ally': return [(radius + .18 * Math.cos(a + 1)) * c + .11 * Math.sin(2 * a), s * (.36 + .15 * Math.cos(a)) + .22 * v + .27 * c];
      default: return [(radius + .13 * Math.cos(3 * a + seed)) * c, .41 * s + .19 * Math.sin(a * 2 + seed) + .27 * v - .11 * c];
    }
  }
  function trace(n, point, close = false) {
    let result = '';
    for (let k = 0; k <= n; k++) {
      const p = point(k / n);
      result += (k ? 'L' : 'M') + round(p[0]) + ' ' + round(p[1]);
    }
    return result + (close ? 'Z' : '');
  }
  function drawSurface(parent,node,radius,index) {
    const kind = node.kind || 'work';
    const contours = svg('g',{class:'et-contours'});
    const point = (u,v) => contour(kind,u,v,index * .35).map(n=>n*radius);
    for (let j = 0; j <= 12; j++) {
      const rim = j === 0 || j === 12;
      contours.append(svg('path',{d:trace(56,u=>point(u,j/6-1),true),fill:'none',stroke:'currentColor','stroke-width':rim?1.2:.7,opacity:rim?.88:.35}));
    }
    for (let i = 0; i < 8; i++) contours.append(svg('path',{d:trace(7,t=>point(i/8,t*2-1)),fill:'none',stroke:'currentColor','stroke-width':.6,opacity:.20}));
    parent.append(contours);
    const mark = node.art && glyphs[node.art] ? node.art : autoArt[node.id];
    const scale = Math.min(1.07,Math.max(.57,radius/52));
    if (mark) parent.append(svg('path',{class:'et-etch',d:glyphs[mark],fill:'none',stroke:'currentColor','stroke-linejoin':'round','stroke-linecap':'round','stroke-width':1.27,transform:'scale('+round(scale)+')'}));
    else parent.append(svg('circle',{r:3.1,fill:'currentColor'}));
    if (kind==='source') {
      // Source stays inside the archive. The travelling reply has its own outline.
      parent.append(svg('circle',{cx:radius*.38,cy:-radius*.11,r:2.5,fill:colors.source}));
    }
  }
  function mount(host,callbacks={}) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let id=null,lang='ko',step=0,choice=null,elapsed=0,paused=false,suspended=false,lastTime=null,frame=0;
    let stageMotion=[],stageDuration=5600,visible=false;
    let activeDiagram=null;
    host.classList.add('exhibit-theatre');
    host.hidden=true;
    const shell=html('div','et-shell'), top=html('div','et-bar'), sectionName=html('span','et-section');
    const tabs=html('nav','et-tabs');
    top.append(sectionName,tabs);
    const live=html('div','et-scene'); live.setAttribute('aria-live','off');
    const title=html('h2','et-title'); title.tabIndex=-1;
    const illustration=html('div','et-figure');
    const drawing=svg('svg',{'aria-hidden':true,focusable:false,preserveAspectRatio:'none'});
    const labels=html('div','et-labels');
    illustration.append(drawing,labels);
    const mobilePayloads=html('ul','et-mobile-payloads'); mobilePayloads.hidden=true;
    const caption=html('p','et-caption'); caption.setAttribute('aria-live','polite'); caption.setAttribute('aria-atomic','true');
    const spoken=html('div','et-spoken'); spoken.append(caption);
    live.append(title,illustration,mobilePayloads,spoken);
    const choiceBar=html('div','et-choices');
    const controls=html('div','et-controls');
    const timeline=html('div','et-strip');
    const transport=html('div','et-transport');
    const back=iconButton('M14 6l-6 6 6 6',()=>move(-1));
    const toggle=iconButton('M9 6v12m6-12v12',()=>{
      if (finished()) { newStory(id,false); title.focus({preventScroll:true}); }
      else { paused=!paused; lastTime=null; refreshControls(); clock(); }
    });
    const forward=iconButton('M10 6l6 6-6 6',()=>move(1));
    const links=html('div','et-links');
    const detail=btn('',()=>callbacks.onDetail?.(id),'et-link');
    const exit=btn('',()=>callbacks.onExit?.(),'et-link');
    links.append(detail,exit);
    transport.append(back,toggle,forward);
    controls.append(timeline,transport,links);
    shell.append(top,live,choiceBar,controls);
    host.replaceChildren(shell);
    const current = () => window.ExhibitStories?.[id];
    const stages = () => current()?.stages || [];
    const finished = () => step === stages().length - 1;
    const chosen = () => current()?.choices?.find(item=>item.id===choice);
    const readStage = () => chosen()?.stage || stages()[step];
    const tr = key => words[lang]?.[key] || words.ko[key];
    function localize() {
      const personal=id==='personal';
      sectionName.textContent=tr(personal?'personal':'business');
      tabs.setAttribute('aria-label',tr('business'));
      tabs.hidden=personal;
      if (!personal) {
        // Keep the focused switch in place as the next scene starts.
        if (!tabs.childElementCount) {
          for (const key of business) {
            const tab=btn('',()=>{ newStory(key,false); callbacks.onStory?.(key); },'et-tab');
            tab.dataset.story=key; tabs.append(tab);
          }
        }
        [...tabs.children].forEach(tab=>{
          const key=tab.dataset.story;
          tab.textContent=text(window.ExhibitStories?.[key]?.label,lang);
          tab.setAttribute('aria-pressed',String(key===id));
        });
      }
      detail.textContent=tr('detail'); exit.textContent=tr('exit');
      back.title=back.ariaLabel=tr('prev'); forward.title=forward.ariaLabel=tr('next');
    }
    function refreshControls() {
      const done=finished();
      const restart=done;
      toggle.querySelector('path').setAttribute('d',restart?'M18.5 10A7 7 0 1 1 13 5M9 5h4v4':paused?'M8 5l11 7-11 7z':'M9 6v12m6-12v12');
      toggle.title=toggle.ariaLabel=tr(restart?'replay':paused?'play':'pause');
      back.disabled=step===0;
      forward.disabled=done;
      links.hidden=!done;
      detail.hidden=!callbacks.onDetail;
      exit.hidden=!callbacks.onExit;
      host.dataset.finished=String(done);
      [...timeline.children].forEach((b,i)=>{
        b.classList.toggle('et-past',i<step);
        b.classList.toggle('et-current',i===step);
        if (i===step) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current');
        b.style.setProperty('--portion',i<step||i===step&&done?'100%':i===step?Math.min(100,elapsed/stageDuration*100)+'%':'0%');
      });
    }
    function makeTimeline() {
      if (timeline.childElementCount!==stages().length) {
        timeline.replaceChildren(...stages().map((_,i)=>btn('',()=>setStep(i),'et-beat')));
      }
      [...timeline.children].forEach((b,i)=>{
        const label=text(stages()[i].title,lang);
        b.title=b.ariaLabel=label;
      });
      timeline.setAttribute('role','group'); timeline.setAttribute('aria-label',tr('scenes'));
    }
    function makeChoices() {
      const items=finished()?current()?.choices || []:[];
      const hadFocus=choiceBar.contains(document.activeElement)?document.activeElement.dataset.choice:null;
      choiceBar.replaceChildren(...items.map(item=>{
        const button=btn(text(item.label,lang),()=>{
          choice=item.id; elapsed=0; lastTime=null; updateScene(); callbacks.onChoice?.(id,choice); clock();
        },'et-choice');
        button.dataset.choice=item.id;
        button.setAttribute('aria-pressed',String(choice===item.id));
        return button;
      }));
      choiceBar.hidden=!items.length;
      if(hadFocus) [...choiceBar.children].find(button=>button.dataset.choice===hadFocus)?.focus({preventScroll:true});
    }
    function picture() {
      if (!visible || !activeDiagram) return;
      const w=illustration.clientWidth,h=illustration.clientHeight;
      if (!w || !h) return;
      const small=w<570;
      const hasObjects=finished()&&!choice&&(id==='documents'||id==='personal');
      illustration.classList.toggle('et-with-objects',hasObjects);
      const actorHeight=hasObjects?h*.59:h;
      const nodes=activeDiagram.nodes || [], edges=activeDiagram.edges || [];
      const defaultPositions=[[.15,.50],[.4,.42],[.73,.25],[.81,.70],[.48,.77]];
      const positions = nodes.map((n,i)=>{
        const fallback=defaultPositions[i%defaultPositions.length];
        let x=n.x??fallback[0], y=n.y??fallback[1];
        if (nodes.length === 2) {
          // The first and last exchanges are close shots. The camera opens out
          // to the full network as other roles join the request.
          const left = n.x <= (nodes[1-i].x ?? .75);
          x = left ? .26 : .74;
          y = left ? .54 : .40;
        } else if (small) {
          // On a narrow stage, unfold columns into an upper and a lower row.
          // Keep an aligned pair in the same column when its other coordinate separates it.
          x=.12 + .76*x;
          const hasNear=nodes.some((other,j)=>j!==i&&Math.abs((other.x??defaultPositions[j%5][0])-(n.x??fallback[0]))<.32 && Math.abs((other.y??defaultPositions[j%5][1])-(n.y??fallback[1]))<.25);
          if (hasNear && !nodes.some((_,j)=>j<i&&Math.abs((nodes[j].x??defaultPositions[j%5][0])-(n.x??fallback[0]))<.32&&Math.abs((nodes[j].y??defaultPositions[j%5][1])-(n.y??fallback[1]))<.25)) y-=.13;
          else if(hasNear) y+=.13;
        }
        const scale=nodes.length===2?1.40:1;
        const radius=Math.min(w*(small?.112:.075),actorHeight*(small?.16:.23))*scale*(n.kind==='on'?1.08:.93);
        return {x:w*x,y:actorHeight*Math.max(.14,Math.min(.76,y)),radius,node:n};
      });
      drawing.setAttribute('viewBox','0 0 '+w+' '+h);
      const byId=new Map(positions.map(p=>[p.node.id,p]));
      const labelledEdges=[];
      const obstacles=positions.map(({node,x,y,radius})=>{
        const nameWidth=Math.min(w*.27,Math.max(34,[...text(node.label,lang)].length*(lang==='ko'?12:7)));
        const half=Math.max(radius,nameWidth/2)+3;
        return {l:x-half,r:x+half,t:y-radius*.68,b:y+radius*.72+28};
      });
      labels.replaceChildren(); drawing.replaceChildren();mobilePayloads.replaceChildren(); mobilePayloads.hidden=true;stageMotion=[];
      edges.forEach((e,i)=>{
        const a=byId.get(e.from),b=byId.get(e.to);
        if(!a||!b) return;
        const dx=b.x-a.x,dy=b.y-a.y;
        const len=Math.max(1,Math.hypot(dx,dy));
        const bend=Math.min(h*.15,len*.19)*(i%2?-1:1);
        const ctrl={x:(a.x+b.x)/2-dy/len*bend,y:(a.y+b.y)/2+dx/len*bend};
        const reply=e.kind==='reply',internal=e.kind==='internal';
        const tone=reply?colors.on:internal?colors.source:colors.gate;
        const start=.09,end=.91;
        const p=t=>[(1-t)**2*a.x+2*t*(1-t)*ctrl.x+t*t*b.x,(1-t)**2*a.y+2*t*(1-t)*ctrl.y+t*t*b.y];
        if(e.label) labelledEdges.push({e,p});
        const main=svg('path',{class:'et-thread',d:trace(30,t=>p(start+t*(end-start))),fill:'none',stroke:tone,'stroke-width':reply?1.35:1,opacity:.49});
        if (internal) main.setAttribute('stroke-dasharray','3 4');
        drawing.append(main);
        // A directional arrow stays visible in the motion-reduced composition.
        const endPoint=p(.78),near=p(.76);
        const angle=Math.atan2(endPoint[1]-near[1],endPoint[0]-near[0])*180/Math.PI;
        drawing.append(svg('path',{d:'M-4-2.5L0 0l-4 2.5',fill:'none',stroke:tone,opacity:.82,transform:'translate('+endPoint.join(' ')+') rotate('+angle+')'}));
        const packet=svg('g',{fill:'none',stroke:tone,'stroke-width':1.2});
        packet.append(svg('path',{d:reply?'M-4-2.5h8v5h-8z M-4-2.5L0 0l4-2.5':internal?'M0-3l3 3-3 3-3-3z':'M-3-2l6 2-6 2z',fill:reply?'var(--bg)':tone}));
        drawing.append(packet); stageMotion.push({packet,p,start,end,index:i});
      });
      positions.forEach(({node,x,y,radius},i)=>{
        const group=svg('g',{transform:'translate('+x+' '+y+')',color:colors[node.kind]||colors.work});
        drawSurface(group,node,radius,i); drawing.append(group);
        const label=html('span','et-node-label');
        label.textContent=text(node.label,lang);
        const idealWidth=small?Math.min(w*.32,122):Math.min(w*.22,220);
        label.style.width=idealWidth+'px';
        label.style.left=Math.max(idealWidth/2,Math.min(w-idealWidth/2,x))+'px';
        label.style.top=(y+radius*.72+6)+'px';
        labels.append(label);
      });
      labelledEdges.forEach(({e,p})=>{
        const name=text(e.label,lang);
        if (!name) return;
        if (small) {
          // Keep route names and payloads adjacent on a phone even when two
          // packets pass each other. The diagram remains clear of text masks.
          const row=html('li','et-mobile-route');
          const direction=html('span','et-route-direction');
          direction.textContent=text(byId.get(e.from).node.label,lang)+' → '+text(byId.get(e.to).node.label,lang);
          const payload=html('span','et-route-payload');payload.textContent=name;
          row.append(direction,payload);mobilePayloads.append(row);mobilePayloads.hidden=false;
          return;
        }
        const width=Math.min(small?w*.34:w*.21,Math.max(33,[...name].length*(lang==='ko'?13:7.3)+12));
        const height=name.length*(lang==='ko'?13:7.3)>width?34:22;
        const at=(u,dy)=>{
          const xy=p(u);
          const x=Math.max(width/2,Math.min(w-width/2,xy[0]));
          const y=Math.max(height/2+1,Math.min(actorHeight-height/2,xy[1]+dy));
          const rect={l:x-width/2,r:x+width/2,t:y-height/2,b:y+height/2};
          const overlap=obstacles.reduce((a,b)=>a+Math.max(0,Math.min(rect.r,b.r)-Math.max(rect.l,b.l))*Math.max(0,Math.min(rect.b,b.b)-Math.max(rect.t,b.t)),0);
          return {x,y,rect,score:overlap+Math.abs(u-.50)*10+Math.abs(dy)*.1};
        };
        const spots=[.5,.36,.64,.24,.76].flatMap(u=>[-15,15,-31,31,-46,46].map(dy=>at(u,dy)));
        const spot=spots.reduce((a,b)=>a.score<=b.score?a:b);
        const label=html('span','et-payload-label');
        label.textContent=name;label.style.left=spot.x+'px';label.style.top=spot.y+'px';label.style.width=width+'px';
        label.setAttribute('aria-label',text(byId.get(e.from).node.label,lang)+' → '+text(byId.get(e.to).node.label,lang)+' · '+name);
        labels.append(label);obstacles.push(spot.rect);
      });
      if (hasObjects) {
        const target=byId.get('on');
        const names=id==='personal' ?
          [{ko:'내 비옷과 스카프',en:'My coat and scarf',es:'Mi impermeable y pañuelo'},{ko:'펜던트 더하기',en:'With a bag charm',es:'Con colgante para el bolso'}] :
          [{ko:'경력증명서',en:'Proof of employment',es:'Certificado laboral'},{ko:'퇴직증명서',en:'Separation certificate',es:'Certificado de cese'}];
        names.forEach((name,i)=>{
          const x=w*(i?.70:.30),y=h*.74;
          const size=Math.min(1,Math.max(.46,h/370));
          const thread=svg('path',{d:'M'+target.x+' '+(target.y+target.radius*.6)+' Q'+target.x+' '+(y-17)+' '+x+' '+(y-14),fill:'none',stroke:colors.gate,'stroke-width':.75,opacity:.23});
          drawing.insertBefore(thread,drawing.firstChild);
          if(id==='personal'&&window.LookArt) {
            const cloth=html('canvas','et-cloth');
            cloth.setAttribute('aria-hidden','true');
            cloth.style.width=Math.min(w*.30,h*.38)+'px';
            cloth.style.height=Math.min(h*.25,w*.26)+'px';
            cloth.style.left=x+'px';cloth.style.top=y+'px';
            labels.append(cloth);
            const look={base:1,layer:2,season:0,bag:0};
            window.LookArt.draw(cloth,look,true);
            if(i) {
              // A small pendant beside the second look is the only item from the shop.
              const cover=svg('g',{transform:'translate('+(x+Math.min(w*.12,h*.17))+' '+(y+3)+') scale('+size+')',fill:'var(--bg)',stroke:colors.gate,'stroke-width':1.15,'stroke-linejoin':'round','stroke-linecap':'round'});
              cover.append(svg('circle',{cx:0,cy:-15,r:4.2}));
              cover.append(svg('path',{d:'M0-10.8v6.2',fill:'none'}));
              cover.append(svg('path',{d:'M0-4.6l8.5 9.6-8.5 13-8.5-13z'}));
              cover.append(svg('path',{d:'M-8.5 5h17 M0-4.6v22.6',fill:'none',opacity:.6}));
              drawing.append(cover);
            }
          } else {
            const sheet=svg('g',{transform:'translate('+x+' '+y+') scale('+size+') rotate('+(i?7:-7)+')',stroke:i?colors.gate:colors.source,fill:'var(--bg)','stroke-linecap':'round','stroke-linejoin':'round'});
            sheet.append(svg('path',{d:'M-21-27h29l11 11v42h-40z M8-27v11h11','stroke-width':1.3}));
            sheet.append(svg('path',{d:'M-13-12h13m-13 8h23m-23 5H7m-20 5H4m-17 5h15','stroke-width':.85,opacity:.8}));
            sheet.append(svg('circle',{cx:10,cy:17,r:4.5,fill:'none','stroke-width':.9}));
            drawing.append(sheet);
          }
          const label=html('span','et-node-label et-output-label');
          label.textContent=text(name,lang);label.style.width=w*.39+'px';
          label.style.left=x+'px';label.style.top=(y+Math.min(h*.12,34))+'px';labels.append(label);
        });
      }
      drawMotion();
    }
    function drawMotion() {
      for (const {packet,p,start,end,index} of stageMotion) {
        let u = .60;
        if (!reduced.matches) {
          u = finished() ? Math.max(0,Math.min(1,(elapsed-index*110)/2250)) : (.1+elapsed/2800+index*.20)%1;
        }
        const [x,y]=p(start+(end-start)*u);
        packet.setAttribute('transform','translate('+round(x)+' '+round(y)+')');
      }
      const beat=timeline.children[step];
      if (beat&&!finished()) beat.style.setProperty('--portion',Math.min(100,100*elapsed/stageDuration)+'%');
    }
    function updateScene() {
      const scene=readStage();
      if(!scene) return;
      activeDiagram=scene;
      title.textContent=text(scene.title,lang);
      caption.textContent=text(chosen()?.result || scene.caption,lang);
      const chars=[...caption.textContent].length;
      stageDuration=Math.min(10800,Math.max(5100,chars*(lang==='ko'?92:58)+2200));
      makeTimeline();makeChoices();refreshControls();picture();
    }
    function tick(now) {
      frame=0;
      if (!visible||paused||suspended||document.hidden) {lastTime=null;return;}
      if (lastTime!==null) elapsed+=Math.min(150,now-lastTime);
      lastTime=now;
      if (!finished()&&elapsed>=stageDuration) {step++;elapsed=0;updateScene();}
      drawMotion();
      if (!finished() || !reduced.matches && elapsed<2800) frame=requestAnimationFrame(tick);
    }
    function clock() {
      if (frame) cancelAnimationFrame(frame);
      frame=0;lastTime=null;
      if (visible&&!paused&&!suspended&&!document.hidden) frame=requestAnimationFrame(tick);
    }
    function setStep(index) {
      step=Math.max(0,Math.min(stages().length-1,index)); choice=null;elapsed=0;
      updateScene();clock();
    }
    function move(delta) {setStep(step+delta);}
    function newStory(key,focus) {
      if(!window.ExhibitStories?.[key]) return;
      id=key;visible=true;host.hidden=false;host.dataset.story=id;
      step=0;choice=null;elapsed=0;paused=reduced.matches;host.scrollTop=0;
      localize();updateScene();clock();
      if (focus) title.focus({preventScroll:true});
    }
    new ResizeObserver(picture).observe(illustration);
    reduced.addEventListener('change',()=>{paused=reduced.matches;refreshControls();picture();clock();});
    document.addEventListener('visibilitychange',clock);
    return {
      show(key,locale='ko') {lang=words[locale]?locale:'ko'; newStory(key,true);},
      setLocale(locale) {lang=words[locale]?locale:'ko';if(visible){localize();updateScene();}},
      hide() {visible=false;host.hidden=true;activeDiagram=null;stageMotion=[];clock();},
      setPaused(value) {suspended=Boolean(value);clock();},
      isOpen() {return visible;},
      getStory() {return id;}
    };
  }
  window.ExhibitTheatre={mount};
})();
