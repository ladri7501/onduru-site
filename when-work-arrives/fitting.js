/* The simulated wardrobe stays in this visit. Images and choices are shared by both views. */
(() => {
  'use strict';
  const words = {
    ko:{
      title:base=>base+'에 어울리는 여섯 차림', detailTitle:'이 차림을 가까이', base:'기본 옷', season:'날씨와 약속', priority:'먼저 볼 조건',
      bases:['회색 니트','자주색 스카프','연두색 비옷'], seasons:['오늘의 전시','봄 산책','가을 저녁'], priorities:['고르게','날씨','일정','취향'],
      context:['오후엔 비, 저녁엔 전시','온화한 봄날, 긴 산책','쌀쌀한 가을 저녁, 외출 약속'],
      taste:['차분한 회색','자주색 포인트','자연스러운 연두색'], wardrobe:'전시용 가상 옷장', owned:'가진 옷과 소품', addition:'새 소품을 더한다면',
      layer:'함께 입는 옷', ring:'반지', necklace:'목걸이', bag:'가방',
      layers:['먹색 정장 바지','자주색 주름치마','짧은 올리브색 바지'], rings:['없음','은반지','원석 반지'], necklaces:['없음','펜던트','진주 목걸이'], bags:['없음','토트백','크로스백','방수 백팩'],
      noPieces:'소품 없이', back:'여섯 차림 다시 보기', refine:'이 선택을 반영해 다시 조합', change:'옷과 소품 바꾸기', compare:'조건 바꾸기',
      weaving:'날씨·일정·취향을 맞춰 보는 중', summary:n=>n+'가지 조합에서 고른 여섯 차림',
      feedback:'방금 고른 조합을 반영했습니다.', ownedNote:'모두 옷장에 있어요', extraNote:'추가 구입 제안', pick:'차림 자세히 보기',
      facts:{rainBag:'방수 백팩이 젖기 쉬운 소지품을 감싸요.',freeHands:'가방을 가로로 메면 두 손이 비어요.',catalogue:'전시 도록은 토트백에 담아요.',pearls:'저녁 조명 아래 진주가 빛을 받아요.',stone:'원석이 손끝에 색을 더해요.',short:'짧은 바짓단이 발목을 가볍게 해요.'},
      reasons:{rain:'비 오는 길에 맞췄어요.',walk:'오래 걷는 날에 맞췄어요.',evening:'저녁 약속에 어울려요.',palette:'고른 옷의 색을 살렸어요.',hands:'두 손을 가볍게 써요.',light:'가볍게 걸칠 수 있어요.',gallery:'실내 전시 약속에 맞췄어요.',feedback:'방금 고른 옷과 소품을 살렸어요.'}
    },
    en:{
      title:base=>'Six looks with '+base.toLowerCase(), detailTitle:'A closer look', base:'Base garment', season:'Weather & occasion', priority:'Give priority to',
      bases:['Grey knit','Plum scarf','Sage raincoat'],seasons:['Today’s exhibition','Spring walk','Autumn evening'],priorities:['A balance','Weather','Schedule','Taste'],
      context:['Afternoon rain, evening exhibition','A mild spring day and a long walk','A cool autumn evening out'],
      taste:['understated grey','a plum accent','soft sage tones'],wardrobe:'Imagined wardrobe',owned:'From the wardrobe',addition:'With new accessories',
      layer:'Companion garment',ring:'Ring',necklace:'Necklace',bag:'Bag',
      layers:['Charcoal trousers','Plum pleated skirt','Cropped olive trousers'],rings:['None','Silver band','Stone ring'],necklaces:['None','Pendant','Pearl necklace'],bags:['None','Tote','Crossbody','Water-resistant backpack'],
      noPieces:'No accessories',back:'Compare the six looks',refine:'Use my choices to find more looks',change:'Change clothes and accessories',compare:'Change the conditions',
      weaving:'Trying the weather, occasion and colours together',summary:n=>'Six looks shortlisted from '+n+' combinations',
      feedback:'Your last choices informed these looks.',ownedNote:'All from the wardrobe',extraNote:'Suggested purchase',pick:'View this look',
      facts:{rainBag:'The water-resistant pack shelters what you carry.',freeHands:'A crossbody bag leaves your hands free.',catalogue:'The gallery catalogue fits in the tote.',pearls:'Pearls catch the evening light.',stone:'The stone adds a small touch of colour.',short:'A cropped hem leaves your ankles free.'},
      reasons:{rain:'Suited to a rainy outing.',walk:'Suited to a longer walk.',evening:'Fits the evening occasion.',palette:'Echoes the colours you chose.',hands:'Leaves both hands free.',light:'Easy to wear on the move.',gallery:'Suited to the indoor exhibition.',feedback:'Builds on the pieces you chose.'}
    },
    es:{
      title:base=>'Seis conjuntos con '+base.toLowerCase(),detailTitle:'El conjunto de cerca',base:'Prenda principal',season:'Tiempo y ocasión',priority:'Dar prioridad a',
      bases:['Jersey gris','Pañuelo ciruela','Impermeable verde'],seasons:['Exposición de hoy','Paseo de primavera','Tarde de otoño'],priorities:['Equilibrio','Tiempo','Agenda','Gusto'],
      context:['Lluvia por la tarde, exposición al anochecer','Un día templado para pasear','Una salida al fresco de una tarde otoñal'],
      taste:['gris discreto','un toque ciruela','tonos verde salvia'],wardrobe:'Armario imaginario',owned:'Del armario',addition:'Con nuevos accesorios',
      layer:'Prenda a juego',ring:'Anillo',necklace:'Collar',bag:'Bolso',
      layers:['Pantalón gris carbón','Falda plisada ciruela','Pantalón verde al tobillo'],rings:['Ninguno','Anillo de plata','Anillo con piedra'],necklaces:['Ninguno','Colgante','Collar de perlas'],bags:['Ninguno','Bolsa de tela','Bandolera','Mochila impermeable'],
      noPieces:'Sin accesorios',back:'Comparar los seis conjuntos',refine:'Buscar más conjuntos con mi elección',change:'Cambiar prendas y accesorios',compare:'Cambiar las condiciones',
      weaving:'Probando combinaciones para el tiempo, la cita y tus colores',summary:n=>'Seis conjuntos elegidos entre '+n+' combinaciones',
      feedback:'Estos conjuntos recogen tu última elección.',ownedNote:'Todo está en el armario',extraNote:'Compra sugerida',pick:'Ver el conjunto',
      facts:{rainBag:'La mochila impermeable protege tus cosas.',freeHands:'La bandolera deja libres las dos manos.',catalogue:'El catálogo cabe en la bolsa de tela.',pearls:'Las perlas reflejan la luz de la tarde.',stone:'La piedra da un toque de color.',short:'El bajo corto deja libres los tobillos.'},
      reasons:{rain:'Para una salida con lluvia.',walk:'Para caminar más tiempo.',evening:'Para la cita de la tarde.',palette:'Recoge los colores elegidos.',hands:'Deja las manos libres.',light:'Para moverse con ligereza.',gallery:'Para visitar la exposición.',feedback:'Incorpora las piezas que elegiste.'}
    }
  };
  const catalogue = {
    ko:{
      shops:{workshop:'장신구 공방',market:'소품 가게',outdoor:'아웃도어 매장'},
      stock:'가상 매장 재고',owned:'내 옷장',addition:'가상 매장',now:'오늘 수령',days:n=>n+'일 뒤 도착',won:n=>n.toLocaleString('ko-KR')+'원',
      from:n=>'예보와 약속, 내 취향을 모아 '+n+'가지 조합을 비교했어요. 허락한 매장에는 품목과 받을 날만 전해요. 옷장 사진은 내게 남아요.',
      onStage:'앞 장면의 차림'
    },
    en:{
      shops:{workshop:'Jewellery studio',market:'Accessories shop',outdoor:'Outdoor shop'},
      stock:'Imagined shop inventory',owned:'My wardrobe',addition:'Imagined shop',now:'Pick up today',days:n=>'Arrives in '+n+(n===1?' day':' days'),won:n=>'₩'+n.toLocaleString('en-US'),
      from:n=>'The Duru used the forecast, your plans and your taste to compare '+n+' combinations. The shop you allow receives the item and deadline. Your photos stay with you.',
      onStage:'From the opening scene'
    },
    es:{
      shops:{workshop:'Taller de joyería',market:'Tienda de accesorios',outdoor:'Tienda de montaña'},
      stock:'Inventario de tiendas ficticias',owned:'Mi armario',addition:'Tienda ficticia',now:'Recogida hoy',days:n=>'Llega en '+n+(n===1?' día':' días'),won:n=>n.toLocaleString('es-ES')+' ₩',
      from:n=>'Los Duru reunieron la previsión, tu agenda y tus gustos para comparar '+n+' combinaciones. La tienda que autorizas recibe el artículo y el plazo. Tú conservas tus fotos.',
      onStage:'Del primer plano'
    }
  };
  const exchangeWords={
    ko:{
      inside:'내 영토에 보관',sky:'날씨 영토의 회신',shop:'가상 매장과 주고받은 조건',
      kept:'내 옷장 목록과 약속, 선호 색', area:'가상 도시', windows:['오후','봄 낮','가을 저녁'], bands:['비','온화함','쌀쌀함'],
      permission:'가상 매장 조회 범위', access:['내 옷장만','품목·수령 기한 허용'],another:'다른 보유품 조합',
      earlier:'앞서 고른 소품 · 매장 조회 닫힘',private:'보유품만 비교합니다. 매장에 보낼 질문은 없습니다.',reply:n=>'재고와 수령일이 맞는 소품 '+n+'종',
      question:'보낸 조건', deadline:n=>n===0?'오늘까지':n+'일 이내', back:'받은 제안',more:'질문과 회신',
      local:n=>'가진 옷을 예보와 약속에 맞춰 '+n+'가지 조합을 비교했어요. 매장 문의는 쉬어요.'
    },
    en:{
      inside:'Inside my territory',sky:'Reply from the weather territory',shop:'Exchange with imagined shops',
      kept:'Wardrobe, calendar and colour preferences',area:'Imagined city',windows:['afternoon','spring day','autumn evening'],bands:['Rain','Mild','Cool'],
      permission:'Shop query permission',access:['My wardrobe only','Share item and deadline'],another:'More wardrobe combinations',
      earlier:'Previously chosen accessory · shops offline',private:'Owned pieces only. No shop query is sent.',reply:n=>n+' accessories in stock and available in time',
      question:'Sent',deadline:n=>n===0?'by today':'within '+n+(n===1?' day':' days'),back:'Returned',more:'Query and reply',
      local:n=>'With shop inquiries on hold, your wardrobe, the forecast and your plans shaped '+n+' combinations.'
    },
    es:{
      inside:'Dentro de mi territorio',sky:'Respuesta del territorio del tiempo',shop:'Intercambio con tiendas ficticias',
      kept:'Armario, agenda y preferencias de color',area:'Ciudad ficticia',windows:['tarde','día de primavera','tarde de otoño'],bands:['Lluvia','Templado','Fresco'],
      permission:'Permiso de consulta a tiendas',access:['Solo mi armario','Compartir artículo y plazo'],another:'Más combinaciones de mi armario',
      earlier:'Accesorio elegido antes · tiendas sin consulta',private:'Solo prendas propias. No se envían consultas a tiendas.',reply:n=>n+' accesorios disponibles a tiempo',
      question:'Enviado',deadline:n=>n===0?'para hoy':'en '+n+(n===1?' día':' días'),back:'Recibido',more:'Consulta y respuesta',
      local:n=>'Con la consulta a tiendas en pausa, tu armario, la previsión y tus planes guiaron '+n+' combinaciones.'
    }
  };
  const pieceList={layer:'layers',ring:'rings',necklace:'necklaces',bag:'bags'};
  function shopMatch(look,locale,withPrice=false,allowShop=true,inquiries=null) {
    const c=catalogue[locale],w=words[locale];
    return window.LookEngine.sources(look,allowShop,inquiries).filter(match=>match.offer).map(({key,offer})=>{
      const arrival=offer.days===0?c.now:c.days(offer.days);
      const name=w[pieceList[key]][look[key]];
      return withPrice?[name,c.shops[offer.shop],c.won(offer.won),arrival].join(' · '):name+' · '+arrival;
    });
  }
  function describeStage(host,locale,comparison) {
    const c=catalogue[locale],w=words[locale];
    host.querySelectorAll('.choice-target').forEach((target,index)=>{
      const look=comparison[index],extras=window.LookEngine.additions(look);
      const piece=extras.length?w[pieceList[extras[0]]][look[extras[0]]]:w.layers[look.layer];
      const detail=make('small','fitting-stage-pieces',[extras.length?c.addition:c.owned,piece].join(' · '));
      target.firstElementChild.append(detail);
      target.setAttribute('aria-label',[w.bases[index],detail.textContent].join(' · '));
    });
  }
  const decisionWords={
    ko:{
      confirm:'이 차림으로 결정',title:'내가 고른 차림',compare:'세 약속에 입어 본다면',revise:'고른 차림 손보기',tryOn:'이 차림 입어 보기',
      compareNote:'기본 옷을 두고, 가상 옷장에서 한 품목씩 바꿔 봤어요.',keep:'고른 조합 그대로',
      byOccasion:[
        {"same":"비 오는 길과 실내 전시를 함께 고려했을 때 지금 조합이 잘 맞아요.", "bag2":"가방을 몸에 붙여 메면 빗길에서 양손을 자유롭게 쓸 수 있어요.", "layer2":"짧은 바짓단은 비에 젖은 바닥에 닿을 일이 적어요.", "ring1":"얇은 은반지가 전시장의 조명 아래 손끝에 은은한 빛을 더해요.", "necklace1":"실내에서 겉옷을 열면 목선에 펜던트가 드러나요."},
        {"same":"긴 산책에 맞춰 걸음과 옷의 무게를 살펴보니 지금 조합이 잘 맞아요.", "bag2":"오래 걸어도 가방을 손에 들지 않고 두 팔을 흔들 수 있어요.", "layer2":"발목이 드러나는 짧은 바지는 봄 산책에서 보폭을 넓히기 편해요.", "ring1":"매끈한 은반지는 산책하며 손을 움직일 때 걸리는 부분이 적어요.", "ring0":"긴 산책에서 손가락을 편하게 움직이도록 반지를 덜었어요.", "necklace0":"걸음을 옮길 때 목에서 흔들리는 소품을 덜었어요."},
        {"same":"쌀쌀한 저녁의 겉옷과 외출 약속에는 지금 조합이 잘 맞아요.", "bag2":"쌀쌀한 저녁엔 가방을 어깨에 메면 두 손을 따뜻하게 감쌀 수 있어요.", "layer1":"긴 주름치마가 쌀쌀한 저녁에 다리를 더 감싸요.", "ring1":"은반지의 은은한 빛이 저녁 차림에 작은 포인트가 돼요.", "necklace1":"서늘한 저녁에 겉옷을 여며도 작은 펜던트가 목선에 남아요."}
      ]
    },
    en:{
      confirm:'Choose this look',title:'The look you chose',compare:'Wear it on three outings',revise:'Adjust my chosen look',tryOn:'Try on this version',
      compareNote:'We kept your base garment and tried one change at a time from the imagined wardrobe.',keep:'Keep your chosen pieces',
      byOccasion:[
        {"same":"Your chosen pieces work together for the wet journey and the indoor exhibition.", "bag2":"Worn close to your body, the crossbody keeps both hands free on the wet walk.", "layer2":"A cropped hem stays clear of the wet pavement.", "ring1":"The slim silver band catches a little of the gallery light.", "necklace1":"The pendant comes into view when you open your outer layer indoors."},
        {"same":"Your chosen pieces balance weight and ease of movement for the long walk.", "bag2":"The strap carries the weight across your body, so your arms can swing freely on the long walk.", "layer2":"An ankle-length hem leaves room for a longer stride on a spring walk.", "ring1":"The smooth silver band has little to catch as you move your hands on the walk.", "ring0":"Leaving the ring off lets your fingers move freely on the long walk.", "necklace0":"Leaving the necklace off keeps it from swinging with each step."},
        {"same":"Your chosen pieces suit the cooler evening and your plans to go out.", "bag2":"Carrying the bag across your body leaves your hands free to keep warm on the cool evening.", "layer1":"The longer pleated skirt gives your legs more coverage on a chilly evening.", "ring1":"The silver band adds a soft glint to your evening look.", "necklace1":"The small pendant sits at your neckline when you draw your outer layer closed against the evening chill."}
      ]
    },
    es:{
      confirm:'Elegir este conjunto',title:'El conjunto que elegiste',compare:'El mismo conjunto para tres salidas',revise:'Ajustar mi conjunto',tryOn:'Probar esta versión',
      compareNote:'Conservamos tu prenda principal y probamos un cambio cada vez con piezas del armario imaginario.',keep:'Conservar las piezas elegidas',
      byOccasion:[
        {"same":"Tus prendas encajan tanto con el trayecto bajo la lluvia como con la visita a la exposición.", "bag2":"La bandolera queda pegada al cuerpo y deja las manos libres en el trayecto bajo la lluvia.", "layer2":"El bajo corto evita el contacto con el suelo mojado.", "ring1":"El fino anillo de plata recoge un poco de la luz de la sala.", "necklace1":"Al abrir la prenda de abrigo en la sala, se ve el colgante en el escote."},
        {"same":"Tus prendas equilibran el peso y la libertad de movimiento para el paseo largo.", "bag2":"En un paseo largo, cruzar la correa permite balancear los brazos sin llevar el bolso en la mano.", "layer2":"El pantalón al tobillo deja espacio para alargar la zancada durante el paseo primaveral.", "ring1":"El anillo liso de plata tiene poco que pueda engancharse al mover las manos.", "ring0":"Sin anillo, los dedos se mueven libremente durante el paseo largo.", "necklace0":"Sin collar, nada se balancea sobre el pecho a cada paso."},
        {"same":"Tu conjunto encaja con el fresco de la tarde y tus planes para salir.", "bag2":"La bandolera deja las manos libres para mantenerlas calientes al caer la tarde.", "layer1":"La falda plisada larga cubre más las piernas cuando refresca.", "ring1":"El anillo de plata da un brillo discreto al conjunto de la tarde.", "necklace1":"Al cerrar la prenda de abrigo contra el fresco de la tarde, el pequeño colgante queda en el escote."}
      ]
    }
  };
  const returnWords={
    ko:{back:'세 벌이 있는 장면으로',chosen:'내가 고른 차림',wear:'세 약속에 입어 보기',weather:['오후에 비가 오는 길','온화한 봄 날씨','쌀쌀한 가을 저녁'],schedule:['저녁 전시 관람','긴 산책','저녁 외출 약속']},
    en:{back:'Back to the three garments',chosen:'The look you chose',wear:'Try it on three outings',weather:['Rain in the afternoon','Mild spring weather','A cool autumn evening'],schedule:['An evening exhibition','A long walk','An evening out']},
    es:{back:'Volver a las tres prendas',chosen:'El conjunto que elegiste',wear:'Probarlo para tres salidas',weather:['Lluvia por la tarde','Tiempo templado de primavera','El fresco del otoño'],schedule:['Una exposición al anochecer','Un paseo largo','Una salida de tarde']}
  };
  function stageCopy(locale,look,priority) {
    const w=words[locale],r=returnWords[locale];
    const pieces=[w.layers[look.layer],...accessories.filter(key=>look[key]).map(key=>w[key==='necklace'?'necklaces':key+'s'][look[key]])];
    const fav=priorities.indexOf(priority), priorityLabel=fav>0?w.priorities[fav]:'';
    return {
      question:r.chosen+' · '+w.bases[look.base], review:r.wear,
      summary:[w.context[look.season],...pieces,priorityLabel?w.priority+' · '+priorityLabel:''].filter(Boolean).join(' · '),
      roles:[r.weather[look.season],r.schedule[look.season],w.taste[look.base]+' · '+pieces.join(' · ')]
    };
  }
  const priorities=['balanced','weather','schedule','taste'];
  const accessories=['ring','necklace','bag'];
  function make(tag,cls,value) {
    const el=document.createElement(tag);
    if(cls)el.className=cls;
    if(value)el.textContent=value;
    return el;
  }
  function button(cls,title,action) {
    const el=make('button',cls,title);
    el.type='button';el.addEventListener('click',action);return el;
  }
  function mount(host) {
    const shell=make('div','fitting-shell');
    const heading=make('h2','fitting-title');
    heading.id='fitting-title';heading.tabIndex=-1;host.setAttribute('aria-labelledby',heading.id);
    const topLine=make('div','fitting-top-line');
    const returnLink=button('fitting-return-stage','',()=>{if(!host.hidden)onReturn?.();});
    topLine.append(heading,returnLink);
    const info=make('p','fitting-info');
    const content=make('div','fitting-content');
    const announcer=make('p','fitting-status');
    announcer.setAttribute('role','status');announcer.setAttribute('aria-live','polite');announcer.setAttribute('aria-atomic','true');
    shell.append(topLine,info,announcer,content);host.replaceChildren(shell);
    let locale='ko',state=null,result=null,selected=null,detail=false,conditionsOpen=false,onBaseChange=null,onReturn=null,onCommit=null;
    let changePermission=null;
    let timers=[],figures=[],cards=[],openedBy=-1,generation=0,decision=null,previousDecision=null,stageLook=null;
    const vocabulary=()=>words[locale];
    function drawAll(){if(!host.hidden)for(const fig of figures)window.LookArt.draw(fig.canvas,fig.look,fig.compact);}
    const observer=typeof ResizeObserver==='function'?new ResizeObserver(drawAll):null;
    function clearFigures(){observer?.disconnect();figures=[];cards=[];}
    function drawFigure(parent,look,compact) {
      const canvas=make('canvas',compact?'fitting-thumb':'fitting-canvas');
      canvas.setAttribute('aria-hidden','true');parent.append(canvas);observer?.observe(canvas);
      const fig={canvas,look,compact};figures.push(fig);return fig;
    }
    function clearTimers(){for(const id of timers)window.clearTimeout(id);timers=[];}
    function names(look) {
      const w=vocabulary();
      return [w.layers[look.layer],...accessories.filter(k=>look[k]).map(k=>w[k==='necklace'?'necklaces':k+'s'][look[k]])];
    }
    function rationale(look) {
      const w=vocabulary();
      if(look.reason==='feedback')return w.reasons.feedback;
      // Describe a feature that is present in this particular outfit.
      let key;
      if(look.bag===3&&look.season===0)key='rainBag';
      else if((look.reason==='rain'||look.reason==='hands'||look.reason==='walk')&&look.bag===2)key='freeHands';
      else if(look.reason==='gallery'&&look.bag===1)key='catalogue';
      else if(look.reason==='evening'&&look.necklace===2)key='pearls';
      else if(look.reason==='palette'&&look.ring===2)key='stone';
      else if(look.reason==='light'&&look.layer===2)key='short';
      return key?w.facts[key]:w.reasons[look.reason];
    }
    function ownership(look) {
      const w=vocabulary();
      if(!state.allowShop && window.LookEngine.additions(look).length)return exchangeWords[locale].earlier;
      const matches=shopMatch(look,locale,false,state.allowShop,result.inquiries);
      return matches.length?catalogue[locale].addition+' · '+matches.join(' / '):w.ownedNote;
    }
    function choices(parent,key,title,labels,value,select) {
      const field=make('fieldset','fitting-group fitting-'+key);
      field.append(make('legend','',title));
      const items=make('div','fitting-options');
      labels.forEach((label,i)=>{
        const b=button('',label,()=>select(i));
        b.setAttribute('aria-pressed',String(i===value));items.append(b);
      });
      field.append(items);parent.append(field);
    }
    function refocus(key,i) {
      const option=content.querySelector('.fitting-'+key)?.querySelectorAll('button')[i];
      option?.focus({preventScroll:true});
    }
    function setCondition(key,value) {
      conditionsOpen=true;
      if(key==='priority')state.priority=priorities[value];
      else if(key==='access'){
        state.allowShop=Boolean(value);changePermission?.(state.allowShop);
      } else state[key]=value;
      if(key==='base')onBaseChange?.(value);
      simulate();refocus(key,value);
    }
    function conditions(parent) {
      const w=vocabulary();
      const controls=make('details','fitting-conditions');
      controls.open=conditionsOpen;
      const toggle=make('summary','',w.compare);controls.append(toggle);
      controls.addEventListener('toggle',()=>{if(controls.isConnected)conditionsOpen=controls.open;});
      const grid=make('div','fitting-condition-options');controls.append(grid);
      choices(grid,'base',w.base,w.bases,state.base,i=>setCondition('base',i));
      choices(grid,'season',w.season,w.seasons,state.season,i=>setCondition('season',i));
      choices(grid,'priority',w.priority,w.priorities,priorities.indexOf(state.priority),i=>setCondition('priority',i));
      const x=exchangeWords[locale];
      choices(grid,'access',x.permission,x.access,Number(state.allowShop),i=>setCondition('access',i));
      parent.append(controls);
    }
    function paintCard(i,look,duringTrial) {
      const w=vocabulary(),c=cards[i],parts=names(look);
      c.fig.look=look;
      c.title.textContent=parts[0];
      c.pieces.textContent=parts.slice(1).join(' · ')||w.noPieces;
      c.reason.textContent=duringTrial?'':rationale(look);
      c.source.textContent=duringTrial?'':ownership(look);
      c.btn.setAttribute('aria-label',[w.pick,...parts,ownership(look)].join(' · '));
      const featured=!duringTrial && stageLook && ['base','season','layer',...accessories].every(key=>stageLook[key]===look[key]);
      c.btn.dataset.stageLook=String(!!featured);
      c.origin.textContent=featured?catalogue[locale].onStage:'';
      c.origin.hidden=!featured;
      c.btn.disabled=duringTrial;
      window.LookArt.draw(c.fig.canvas,look,true);
    }
    function exchangeRow(parent,label,value) {
      const row=make('div','fitting-exchange-role');
      row.append(make('dt','',label),make('dd','',value));parent.append(row);
    }
    function addExchange(parent) {
      const x=exchangeWords[locale],f=result.forecast,rows=make('dl','fitting-exchange');
      exchangeRow(rows,x.inside,x.kept);
      exchangeRow(rows,x.sky,x.area+' · '+x.windows[state.season]+' → '+x.bands[f.band]+' · '+f.celsius+' °C');
      const keys=new Set(result.looks.flatMap(look=>window.LookEngine.additions(look)));
      const reply=state.allowShop?x.access[1]+' → '+x.reply(keys.size):x.private;
      exchangeRow(rows,x.shop,reply);parent.append(rows);
    }
    function gallery() {
      clearFigures();detail=false;decision=null;previousDecision=null;content.replaceChildren();
      const w=vocabulary();
      heading.textContent=w.title(w.bases[state.base]);
      info.textContent=[w.wardrobe,w.context[state.season],w.taste[state.base]].join(' · ');
      const toolbar=make('div','fitting-toolbar');
      const status=make('p','fitting-summary',w.summary(result.tested)+(state.reference?'　'+w.feedback:''));
      toolbar.append(status);conditions(toolbar);content.append(toolbar);addExchange(content);
      for(let family=0;family<2;family++){
        const section=make('section','fitting-family');
        const legend=make('h3','fitting-family-name',family?(state.allowShop?w.addition:exchangeWords[locale].another):w.owned);
        const grid=make('div','fitting-triptych');section.append(legend,grid);content.append(section);
        for(let j=0;j<3;j++){
          const i=family*3+j, look=result.looks[i];
          const btn=button('fitting-look','',()=>inspect(i));
          btn.dataset.ownership=look.added.length?'addition':'owned';
          const fig=drawFigure(btn,look,true);
          const labels=make('span','fitting-labels');
          const title=make('strong','fitting-look-title'),pieces=make('span','fitting-pieces');
          const reason=make('span','fitting-reason'),source=make('span','fitting-source');
          const origin=make('span','fitting-origin');
          labels.append(title,pieces,reason,source,origin);btn.append(labels);grid.append(btn);
          cards.push({btn,title,pieces,reason,source,origin,fig});
          paintCard(i,look,false);
        }
      }
      drawAll();
    }
    function simulate(animate=true) {
      clearTimers();generation++;selected=null;openedBy=-1;
      result=window.LookEngine.rank(state);
      gallery();
      const w=vocabulary(),shortMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if(!animate||shortMotion||!result.trials.length){
        announcer.textContent=w.summary(result.tested);return;
      }
      const revision=generation;
      host.classList.add('fitting-testing');
      announcer.textContent=w.weaving;
      const summary=content.querySelector('.fitting-summary');
      const trialGroups=[false,true].map(extra=>result.trials.filter(look=>Boolean(look.added.length)===extra));
      function beat(step) {
        if(revision!==generation||host.hidden||detail)return;
        const testing=step<3;
        if(testing)summary.textContent=w.weaving+'…';
        else{
          summary.textContent=w.summary(result.tested)+(state.reference?'　'+w.feedback:'');
          announcer.textContent=summary.textContent;
          host.classList.remove('fitting-testing');
        }
        cards.forEach((card,i)=>{
          const group=trialGroups[Math.floor(i/3)];
          const look=testing&&group.length?group[(step+i)%group.length]:result.looks[i];
          paintCard(i,look,testing);
        });
      }
      beat(0);
      [220,440,720].forEach((delay,index)=>timers.push(window.setTimeout(()=>beat(index+1),delay)));
    }
    function inspect(index) {
      clearTimers();host.classList.remove('fitting-testing');detail=true;openedBy=index;
      selected={...result.looks[index]};host.scrollTop=0;detailView();
      heading.focus({preventScroll:true});
    }
    function detailView() {
      clearFigures();content.replaceChildren();
      const w=vocabulary();
      heading.textContent=w.detailTitle;
      info.textContent=[w.bases[selected.base],w.context[selected.season],w.wardrobe].join(' · ');
      const back=button('fitting-back',previousDecision?decisionWords[locale].compare:w.back,()=>{
        if(previousDecision){
          decision=previousDecision;previousDecision=null;decisionView();host.scrollTop=0;
          heading.focus({preventScroll:true});return;
        }
        selected=null;gallery();host.scrollTop=0;cards[openedBy]?.btn.focus({preventScroll:true});
        announcer.textContent=w.summary(result.tested);
      });
      content.append(back);
      const grid=make('div','fitting-detail-grid'),figure=make('figure','fitting-figure');
      drawFigure(figure,selected,false);
      const desc=make('figcaption','fitting-composition',names(selected).join(' · '));
      const source=make('span','fitting-detail-source',ownership(selected));figure.append(desc,source);
      if(state.allowShop && window.LookEngine.additions(selected).length){
        const stock=make('div','fitting-shop');
        stock.append(make('strong','',catalogue[locale].stock));
        const x=exchangeWords[locale],sourceNames=shopMatch(selected,locale,true,state.allowShop,result.inquiries);
        window.LookEngine.sources(selected,state.allowShop,result.inquiries).forEach(({key,criteria,alias},i)=>{
          const name=w[pieceList[key]][selected[key]];
          stock.append(make('p','fitting-query',x.question+' · '+alias+' · '+name+' · '+x.deadline(criteria.withinDays)),
            make('p','',x.back+' · '+sourceNames[i]));
        });
        figure.append(stock);
      }
      const original=result.looks[openedBy];
      if(original&&original.season===selected.season&&['layer',...accessories].every(key=>original[key]===selected[key]))figure.append(make('p','fitting-detail-reason',rationale(original)));
      const control=make('div','fitting-controls');
      control.append(make('h3','fitting-subheading',w.change));
      const options={layer:w.layers,ring:w.rings,necklace:w.necklaces,bag:w.bags};
      for(const [key,labels] of Object.entries(options)){
        // In this wardrobe the final jewellery or bag option is sourced externally.
        const offered=!state.allowShop && key!=='layer'?labels.slice(0,-1):labels;
        choices(control,key,w[key],offered,selected[key],i=>{
          selected[key]=i;detailView();refocus(key,i);
          announcer.textContent=names(selected).join(' · ')+'. '+ownership(selected);
        });
      }
      const actions=make('div','fitting-detail-actions');
      actions.append(button('fitting-confirm',decisionWords[locale].confirm,confirmLook));
      actions.append(button('fitting-refine',w.refine,()=>{
        state.season=selected.season;
        const {layer,ring,necklace,bag}=selected;
        state.reference={layer,ring,necklace,bag};host.scrollTop=0;simulate();
        heading.focus({preventScroll:true});
      }));
      control.append(actions);grid.append(figure,control);content.append(grid);drawAll();
    }
    function confirmLook() {
      if(!detail||decision||!selected||host.hidden)return;
      const anchor={...selected};previousDecision=null;
      decision={anchor,variants:window.LookEngine.tryOccasions(anchor,state.priority)};
      if(onCommit){
        onCommit({look:anchor,variants:decision.variants,priority:state.priority,reference:state.reference?{...state.reference}:null,originSeason:state.season,openedBy});
        return;
      }
      decisionView();host.scrollTop=0;heading.focus({preventScroll:true});
    }
    function decisionView() {
      clearFigures();content.replaceChildren();
      const w=vocabulary(),d=decisionWords[locale],{anchor,variants}=decision;
      heading.textContent=d.title;
      info.textContent=[w.bases[anchor.base],w.seasons[anchor.season],w.wardrobe].join(' · ');
      const section=make('section','fitting-decision');
      const original=make('figure','fitting-anchor');
      drawFigure(original,anchor,true);
      const caption=make('figcaption','fitting-anchor-caption');
      caption.append(make('strong','fitting-look-title',w.bases[anchor.base]),make('span','fitting-composition',names(anchor).join(' · ')),make('span','fitting-detail-source',ownership(anchor)));
      caption.append(button('fitting-revise',d.revise,()=>{
        selected={...anchor};previousDecision=decision;decision=null;detailView();host.scrollTop=0;
        content.querySelector('.fitting-confirm')?.focus({preventScroll:true});announcer.textContent=w.detailTitle;
      }));
      original.append(caption);section.append(original);
      const subtitle=make('h3','fitting-family-name',d.compare);
      const description=make('p','fitting-decision-note',d.compareNote);
      const triptych=make('div','fitting-triptych fitting-variations');
      const pieceNames={layer:w.layers,ring:w.rings,necklace:w.necklaces,bag:w.bags};
      for(const {look,changed} of variants) {
        const change=changed?pieceNames[changed][anchor[changed]]+' → '+pieceNames[changed][look[changed]]:d.keep;
        const reason=d.byOccasion[look.season][changed?changed+look[changed]:'same']||rationale(look);
        const card=button('fitting-variant','',()=>{
          selected={...look};previousDecision=decision;decision=null;detailView();host.scrollTop=0;heading.focus({preventScroll:true});
          announcer.textContent=w.seasons[look.season]+' · '+change;
        });
        card.setAttribute('aria-label',[w.seasons[look.season],change,d.tryOn].join(' · '));
        card.append(make('strong','fitting-look-title',w.seasons[look.season]),make('span','fitting-variant-context',w.context[look.season]));
        drawFigure(card,look,true);
        card.append(make('span','fitting-delta',change),make('span','fitting-variant-reason',reason),make('span','fitting-try-on',d.tryOn));triptych.append(card);
      }
      section.append(subtitle,description,triptych,button('fitting-back',w.back,()=>{
        selected=null;gallery();host.scrollTop=0;cards[openedBy]?.btn.focus({preventScroll:true});
        announcer.textContent=w.summary(result.tested);
      }));
      content.append(section);drawAll();announcer.textContent=d.title+'. '+d.compare;
    }
    function open(config={}) {
      clearTimers();locale=words[config.locale]?config.locale:'ko';
      state={base:[0,1,2].includes(config.base)?config.base:0,season:[0,1,2].includes(config.season)?config.season:0,
        allowShop:config.allowShop!==false,priority:priorities.includes(config.priority)?config.priority:'balanced',reference:config.reference?{...config.reference}:null};
      changePermission=config.onPermissionChange||null;conditionsOpen=false;stageLook=config.stageLook||null;onBaseChange=config.onBaseChange||null;
      onReturn=config.onReturn||null;onCommit=config.onCommit||null;
      returnLink.hidden=!onReturn;returnLink.textContent=returnWords[locale].back;
      host.hidden=false;host.scrollTop=0;
      if(config.review){
        state.season=config.review.originSeason;
        result=window.LookEngine.rank(state);openedBy=config.review.openedBy;
        selected={...config.review.look};detail=true;
        const variants=config.review.priority===state.priority?config.review.variants:window.LookEngine.tryOccasions(selected,state.priority);
        decision={anchor:selected,variants};
        decisionView();
      } else simulate();
      if(config.focus!==false)heading.focus({preventScroll:true});
    }
    function close() {
      clearTimers();clearFigures();generation++;host.classList.remove('fitting-testing');host.hidden=true;
      state=null;result=null;selected=null;decision=null;previousDecision=null;changePermission=null;onBaseChange=null;onReturn=null;onCommit=null;announcer.textContent='';
    }
    function setLocale(lang) {
      locale=words[lang]?lang:'ko';
      if(host.hidden||!state)return;
      returnLink.textContent=returnWords[locale].back;
      clearTimers();host.classList.remove('fitting-testing');
      if(decision){decisionView();return;}
      if(detail)detailView();else gallery();
      announcer.textContent=detail?vocabulary().detailTitle:vocabulary().summary(result.tested);
    }
    window.addEventListener('resize',drawAll,{passive:true});
    return {open,close,setLocale,isOpen:()=>!host.hidden};
  }
  window.Fitting={mount,stageCopy,describeStage,comparisonNote:(locale,count,allow=true)=>allow?catalogue[locale].from(count):exchangeWords[locale].local(count)};
})();
