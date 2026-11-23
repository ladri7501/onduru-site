/* Each bounded surface has a human owner, a request-specific assembly and its own gate.
   Only the small derived constellation travels. Its source stays inside. */
(() => {
  'use strict';
  const TAU=Math.PI*2, sin=Math.sin, cos=Math.cos;
  const clamp=(x,lo=0,hi=1)=>Math.max(lo,Math.min(hi,x));
  const mix=(a,b,t)=>a+(b-a)*t;
  const ease=t=>{const u=clamp(t);return u*u*(3-2*u);};
  const colors={pearl:'224,219,204',mint:'141,198,183',blue:'153,183,206',gold:'208,179,134',plum:'188,144,169',sage:'166,191,149'};
  // Names and verbs are shared with the accessible account of the stage.
  const vocabulary={
    ko:{
      requester:['온','받을 서류 선택'],employer:['전 직장','선택한 서류 발급'],archive:['인사·급여 기록','원본과 대조'],
      support:['공공 지원','생활·구직 안내 대조'],employment:['고용센터','구직 상담 연결'],welfare:['복지 창구','생활 지원 안내'],both:['지역 상담 창구','지역별 안내 확인'],
      planning:['회사','대안 비교'],buying:['구매 협력사','계약 비용 계산'],operations:['운영 협력사','업무량·납기 검토'],
      wardrobe:['내 옷장','가진 옷 조합'],weather:['날씨','강수 예보 확인'],calendar:['일정','약속 조건 대조'],shop:['가상 매장','소품 재고 회신'],shopClosed:['가상 매장','문의 보류'],
      sender:['나의 두루','맡은 범위 확인']
    },
    en:{
      requester:['On','Choose documents'],employer:['Former employer','Issue documents'],archive:['HR and payroll','Check records'],
      support:['Public support','Find local services'],employment:['Job centre','Find job advice'],welfare:['Welfare desk','Find support'],both:['Local services','Check local guidance'],
      planning:['Company','Compare plans'],buying:['Purchasing partner','Cost the contracts'],operations:['Operations partner','Check load and timing'],
      wardrobe:['My wardrobe','Match owned pieces'],weather:['Weather','Check the forecast'],calendar:['My calendar','Check the occasion'],shop:['Sample shop','Check stock'],shopClosed:['Sample shop','No inquiry'],
      sender:['My Duru','Check the scope']
    },
    es:{
      requester:['On','Elige documentos'],employer:['Antigua empresa','Emite documentos'],archive:['Personal y nóminas','Coteja registros'],
      support:['Apoyo público','Busca servicios'],employment:['Oficina de empleo','Orienta sobre empleo'],welfare:['Atención social','Busca apoyo'],both:['Servicios locales','Consulta la guía'],
      planning:['Planificación','Compara planes'],buying:['Compras','Calcula costes'],operations:['Operaciones','Evalúa carga y plazos'],
      wardrobe:['Mi armario','Combina prendas'],weather:['Tiempo','Consulta el pronóstico'],calendar:['Agenda','Revisa la cita'],shop:['Tienda ficticia','Consulta existencias'],shopClosed:['Tienda ficticia','Sin consulta'],
      sender:['Mi Duru','Revisa el encargo']
    }
  };
  const priorityRole={weather:'weather',schedule:'calendar',taste:'wardrobe'};
  const focusAction={
    weather:{ko:'날씨부터 대조',en:'Check weather first',es:'Prioriza el tiempo'},
    calendar:{ko:'일정부터 대조',en:'Check plans first',es:'Prioriza la cita'},
    wardrobe:{ko:'취향부터 대조',en:'Check taste first',es:'Prioriza los gustos'}
  };
  function roleIds(kind,options) {
    if(options.compact) {
      if(options.branch!==1)return ['requester','employer','archive'];
      const local=options.agency==='welfare'?'welfare':options.agency==='employment'?'employment':'both';
      return ['sender','support',local];
    }
    if(kind==='fashion')return ['wardrobe','weather','calendar',options.allowShop===false?'shopClosed':'shop'];
    if(kind==='cost')return ['planning','buying','operations'];
    if(kind==='request')return ['sender','employer','planning'];
    return ['requester','employer','support'];
  }
  function roles(kind,lang,options={}) {
    const words=vocabulary[lang]||vocabulary.ko;
    const focus=kind==='fashion' ? priorityRole[options.priority] : null;
    return roleIds(kind,options).map(id=>{
      const [title,action]=words[id];
      return {title,action:id===focus ? focusAction[id][lang] || focusAction[id].ko : action};
    });
  }
  const ink=(tone,alpha)=>'rgba('+colors[tone]+','+clamp(alpha)+')';

  // Surfaces have different topologies: a coiled pocket, folded archive sheets,
  // a rosette, a pleated shuttle, a twisted strip, a seasonal wave and a chronograph.
  function surface(kind,u,v) {
    const a=u*TAU, v2=v*v;
    switch(kind) {
      case 'pocket': {
        const r=.72+.17*v+.09*cos(2*a-.6)+.06*cos(3*a+.45);
        return [1.12*r*cos(a),.79*r*sin(a)+.14*v,.39*sin(a-.6)+.33*v+.12*cos(2*a)];
      }
      case 'folio': {
        const s=sin(a),c=cos(a);
        return [Math.sign(c)*Math.pow(Math.abs(c),.66)*(.79+.12*v)+.14*sin(2*a),.52*Math.sign(s)*Math.pow(Math.abs(s),.77)+.30*v-.10*c,.41*v+.31*sin(a+.35)-.16*cos(2*a)];
      }
      case 'petals': {
        const r=.71+.17*cos(3*a+.7)+.11*v+.12*v*sin(3*a);
        return [r*cos(a),.82*r*sin(a)+v*.12,.38*sin(3*a+.2)+.24*v*cos(a)];
      }
      case 'shuttle': {
        const r=.68+.14*v;
        return [1.3*r*cos(a),r*sin(a)*(.54+.16*cos(a*2))+.24*v,.41*sin(2*a+.6)+v*.26];
      }
      case 'ribbon': {
        const r=.67+.22*v*cos(a*.5);
        return [r*cos(a)*1.22,r*sin(a)*.81+.2*v*sin(a*.5),.32*sin(2*a)+.37*v*sin(a*.5)];
      }
      case 'weather': return [(1+.12*v)*cos(a),.42*sin(a)+.19*v+.13*sin(3*a),.35*sin(2*a+.7)+.3*v];
      case 'calendar': return [(.62+.18*v)*cos(a),(.66+.18*v)*sin(a),.23*cos(a*2)+v*.32];
      default: return [(.62+.22*v)*cos(a),.49*sin(a)+v*.19,.3*cos(3*a)+.3*v2];
    }
  }

  const geometry=new Map();
  function mesh(kind) {
    if(geometry.has(kind))return geometry.get(kind);
    const lines=[],segments=48;
    function trace(n,point,accent=false,edge=false) {
      const points=Array.from({length:n+1},(_,i)=>point(i/n));
      for(let i=0;i<n;i+=8)lines.push({points:points.slice(i,Math.min(i+9,n+1)),accent,edge});
    }
    for(let j=0;j<14;j++) {
      const v=j/13*2-1;
      trace(segments,t=>surface(kind,t,v),j===4||j===10,j===0||j===13);
    }
    const ribs=kind==='folio'?13:kind==='calendar'?12:9;
    for(let j=0;j<ribs;j++)trace(8,t=>surface(kind,j/ribs,t*2-1),true,false);
    geometry.set(kind,lines);
    return lines;
  }
  function path(ctx,points,color,width) {
    if(points.length<2)return;
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();
    ctx.moveTo(points[0][0],points[0][1]);
    for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
    ctx.stroke();
  }
  function circle(ctx,x,y,r,color,ring=false,width=1) {
    ctx.beginPath();ctx.arc(x,y,Math.max(.4,r),0,TAU);
    if(ring){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
    else{ctx.fillStyle=color;ctx.fill();}
  }
  function text(ctx,value,x,y,color,size,maxWidth) {
    ctx.save();ctx.fillStyle=color;ctx.font=size+'px "Exhibit Label", system-ui, sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(value,x,y,maxWidth);ctx.restore();
  }
  function domain(x,y,r,kind,tone,turn) {return {x,y,r,kind,tone,turn};}
  function view(d,time) {
    const {x,y,r,turn}=d;
    const tilt=turn+.20*sin(time*.47+turn), roll=turn*.37+.11*sin(time*.36+turn);
    const cy=cos(tilt),sy=sin(tilt),cr=cos(roll),sr=sin(roll);
    return ([a,b,c])=>{
      const px=a*cy+c*sy, z=c*cy-a*sy, py=b*.956-z*.29;
      const scale=r*3.9/(3.9-z);
      return [x+scale*(px*cr-py*sr),y+scale*(py*cr+px*sr),z];
    };
  }
  function inside(ctx,d,time,activity,small) {
    const {x,y,r,kind,tone}=d;
    const project=view(d,time);
    const parcels=mesh(kind).map(part=>{
      const pts=part.points.map(project);
      return {pts,z:pts[Math.floor(pts.length*.5)][2],edge:part.edge,accent:part.accent};
    });
    const note=small?.84:1;
    // The source and its archive marks occupy fixed local coordinates.
    const source=[x+r*.04,y-r*.02];
    const members=6;
    // Agents converge around the active request and drift apart as their work ends.
    const cycle=time*.54+d.turn*2.7;
    const centers=[[.26*cos(cycle),.23*sin(cycle),.18],[-.27*cos(cycle),-.23*sin(cycle),-.16]];
    const agents=[];
    for(let j=0;j<members;j++){
      const a=TAU*j/members+.4;
      const home=[.72*cos(a),.54*sin(a),.23*sin(2*a)];
      const cohort=j%2,center=centers[cohort],orbit=a+cycle*.56;
      const work=[center[0]+.24*cos(orbit),center[1]+.18*sin(orbit),center[2]+.12*sin(orbit)];
      const gather=activity*(.88+.10*sin(cycle+j*.43));
      agents.push(project(home.map((v,k)=>mix(v,work[k],gather))));
    }
    agents.forEach((agent,j)=>parcels.push({z:agent[2],agent,peer:agents[(j+2)%members]}));
    parcels.sort((a,b)=>a.z-b.z);
    for(const item of parcels){
      if(item.agent) {
        if(activity>.04)path(ctx,[item.agent,item.peer],ink(tone,.43*activity),.67);
        circle(ctx,item.agent[0],item.agent[1],Math.max(1,r*.022)*(1+item.z*.24),ink(tone,.64+activity*.25));
        continue;
      }
      const front=clamp((item.z+.64)/1.26);
      const weight=(item.edge?.42:item.accent?.11:.18)+front*(item.edge?.42:item.accent?.13:.13);
      path(ctx,item.pts,ink(item.accent&&!item.edge?'pearl':tone,weight*note),item.edge?1.08:item.accent?.54:.68);
    }
    // A pearl open ring is a human steward. The warm stationary cluster belongs
    // to this territory. An outgoing derived constellation has a different form.
    const steward=project([-.35,.16,.16]);
    ctx.strokeStyle=ink('pearl',.88);ctx.lineWidth=.94;ctx.beginPath();ctx.arc(steward[0],steward[1],clamp(r*.078,2.7,6.5),.22,TAU-.18);ctx.stroke();
    circle(ctx,...source,clamp(r*.065,2,4.4),ink('gold',.96));
    circle(ctx,...source,clamp(r*.121,4.2,8.5),ink('gold',.46),true,.77);
    [[.145,-.08],[.20,.045],[-.04,-.18]].forEach(([dx,dy])=>circle(ctx,source[0]+r*dx,source[1]+r*dy,Math.max(1,r*.018),ink('gold',.75)));
  }
  function anchors(kind,w,h) {
    const narrow=w/h<.87,short=h<480;
    const xs=kind==='fashion'?(narrow?[.18,.50,.82]:[.30,.53,.76]):(narrow?[.29,.71]:[.36,.67]);
    const radius=Math.min(w*(narrow?.118:.074),h*.077);
    let y=short?.55:.54, hitHeight=radius*1.8+25;
    if(kind==='fashion') {
      const lastRoleEdge=Math.max(...fashionRoles(w,h).map(a=>(a.hitY+a.hitHeight*.5)*h));
      y=Math.max(y,(lastRoleEdge+26)/h);
      hitHeight=Math.min(hitHeight,Math.max(44,(y*h-lastRoleEdge-3)*2));
    }
    return xs.map(x=>({x,y,width:Math.min(kind==='fashion'?.26:.29,(radius*2.8+20)/w),
      height:hitHeight/h,labelX:x,labelY:y+(radius*.76+6)/h}));
  }
  function fashionPlacement(w,h) {
    const narrow=w/h<.87;
    if(narrow)return [[.23,.373,.107],[.21,.219,.078],[.73,.230,.078],[.77,.382,.098]];
    if(h<500)return [[.145,.30,.085],[.385,.255,.064],[.605,.29,.064],[.845,.26,.081]];
    return [[.17,.303,.096],[.39,.231,.068],[.61,.27,.068],[.83,.305,.083]];
  }
  function fashionRoles(w,h) {
    const points=fashionPlacement(w,h);
    const unit=Math.min(w,h*1.32),narrow=w/h<.87;
    return [1,2,0].map(i=>{
      const [x,y,r]=points[i],radius=unit*r;
      const top=h*y-Math.min(18,radius*.50);
      const bottom=h*y+radius*.91+6+roleLineHeight(w,h)+8;
      const hitWidth=Math.min(w*(narrow?.43:.20),Math.max(125,radius*2))/w;
      return {x,y,hitY:(top+bottom)/(2*h),hitHeight:(bottom-top)/h,hitWidth};
    });
  }
  function phraseLayout(w,h,kind,opts) {
    const narrow=w/h<.87, compact=Boolean(opts.compact);
    const unit=Math.min(w,h*1.32);
    const at=(x,y,r,shape,tone,turn)=>domain(w*x,h*y,unit*r,shape,tone,turn);
    if(compact){
      const basis=Math.min(w,h*2.12);
      const size=(ratio)=>Math.max(8,basis*ratio);
      const branch=opts.branch;
      return [
        domain(w*.16,h*.49,size(.135),'pocket','mint',-.2),
        domain(w*.50,h*.34,size(.135),branch===1?'petals':'folio',branch===1?'sage':'blue',.62),
        domain(w*.83,h*.56,size(.10),branch===1?'ribbon':'shuttle',branch===1?'plum':'gold',-.68)
      ];
    }
    if(kind==='fashion') {
      const points=fashionPlacement(w,h);
      return [
        at(...points[0],'pocket','mint',-.22),
        at(...points[1],'weather','blue',.28),
        at(...points[2],'calendar','gold',-.24),
        at(...points[3],'ribbon','plum',.56)
      ];
    }
    if(kind==='request') {
      const short=h<480;
      const targets=opts.targets||(narrow?[.265,.735]:[.35,.65]).map(x=>({x,y:short?.52:.48}));
      return [
        at(.50,short?.26:.278,narrow?.09:.062,'pocket','mint',-.24),
        at(targets[0].x,targets[0].y,narrow?.142:.109,'folio','blue',.6),
        at(targets[1].x,targets[1].y,narrow?.137:.108,'shuttle','gold',-.53)
      ];
    }
    return [at(narrow?.18:.215,.325,narrow?.14:.092,'pocket','mint',-.24),
      at(narrow?.51:.50,.238,narrow?.134:.10,kind==='cost'?'shuttle':'folio',kind==='cost'?'gold':'blue',.53),
      at(narrow?.805:.785,.341,narrow?.12:.087,kind==='cost'?'ribbon':'petals',kind==='cost'?'blue':'sage',-.62)];
  }
  function along(a,b,t,bow) {
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.max(1,Math.hypot(dx,dy));
    return [mix(a.x,b.x,t)-dy/len*sin(Math.PI*t)*bow,mix(a.y,b.y,t)+dx/len*sin(Math.PI*t)*bow];
  }
  function rim(a,b,scale) {
    const angle=Math.atan2(b.y-a.y,b.x-a.x);
    return {x:a.x+cos(angle)*a.r*scale,y:a.y+sin(angle)*a.r*scale*.70};
  }
  function trace(ctx,a,b,tone,alpha,bow,from=0,to=1,width=.85) {
    const steps=Math.max(2,Math.ceil(22*(to-from)));
    path(ctx,Array.from({length:steps+1},(_,i)=>along(a,b,mix(from,to,i/steps),bow)),ink(tone,alpha),width);
  }
  function cluster(ctx,pt,size,tone,phase,alpha=1) {
    const points=Array.from({length:3},(_,i)=>{
      const a=i*TAU/3+phase;return [pt[0]+cos(a)*size,pt[1]+sin(a)*size*.68];});
    path(ctx,[...points,points[0]],ink(tone,alpha*.67),.65);
    for(const p of points)circle(ctx,...p,clamp(size*.31,.8,1.7),ink(tone,alpha));
  }
  function gate(ctx,at,dx,dy,tone,open) {
    const length=Math.max(1,Math.hypot(dx,dy));const vx=-dy/length,vy=dx/length;
    const span=open?3:0,extent=open?8:6;
    for(const side of [-1,1])path(ctx,[[at.x+vx*span*side,at.y+vy*span*side],
      [at.x+vx*extent*side,at.y+vy*extent*side]],ink(tone,open?.78:.42),open?1.06:.83);
  }
  function exchange(ctx,from,to,phase,passing,time,index,small=false) {
    const start=rim(from,to,.91),finish=rim(to,from,.89);
    const dx=finish.x-start.x,dy=finish.y-start.y;
    const span=Math.hypot(dx,dy),bow=(index%2?1:-1)*span*.15;
    trace(ctx,start,finish,to.tone,passing?.40:.13,bow);
    if(passing)trace(ctx,finish,start,from.tone,.24,bow*.83);
    gate(ctx,start,dx,dy,from.tone,passing);
    gate(ctx,finish,dx,dy,to.tone,passing);
    if(!passing)return;
    // A separate, temporary group is formed on the interior side of the gate.
    const seed=along(from,start,.64,0);
    trace(ctx,{x:seed[0],y:seed[1]},start,'mint',.43,4);
    const size=clamp((small?2:2.7)+span*.009,2.1,5);
    const serial=clamp(phase,0,.999);
    if(serial<.20){
      const k=ease(serial/.20);
      const pt=[mix(seed[0],start.x,k),mix(seed[1],start.y,k)];
      // Independently filtered features combine inside the sender's gate.
      const project=view(from,time);
      for(const feature of [[-.15,-.38,-.18],[.28,.17,.14],[.04,.34,-.03]]){
        const at=project(feature),u=ease(k*2.3);
        const point=[mix(at[0],pt[0],u),mix(at[1],pt[1],u)];
        path(ctx,[at,pt],ink('mint',.32*(1-u)),.7);
        circle(ctx,...point,size*.4,ink('mint',.83*(1-u)));
      }
      cluster(ctx,pt,size*(.35+.65*k),'mint',time*.23,.92);
    }else if(serial<.53){
      const k=ease((serial-.20)/.33),pt=along(start,finish,k,bow);
      trace(ctx,start,finish,to.tone,.82,bow,Math.max(0,k-.14),k,1.03);
      cluster(ctx,pt,size,'mint',time*.45);
    }else if(serial<.70){
      const k=(serial-.53)/.17;
      const pt=along(finish,to,.14+.45*sin(Math.PI*k),3);
      cluster(ctx,pt,size*.83,to.tone,time*.36,.77);
    }else{
      let pt;
      if(serial<.925){
        const k=ease((serial-.70)/.225);
        pt=along(finish,start,k,bow*.83);
        trace(ctx,finish,start,'pearl',.82,bow*.83,Math.max(0,k-.14),k,1.17);
      }else{
        const owner=view(from,time)([-.35,.16,.16]),to={x:owner[0],y:owner[1]};
        const k=ease((serial-.925)/.075);
        pt=along(start,to,k,-from.r*.07);
        trace(ctx,start,to,'pearl',.69,-from.r*.07,0,k);
      }
      circle(ctx,...pt,size*.61,ink('pearl',.94));circle(ctx,...pt,size*1.2,ink(from.tone,.72),true,.75);
    }
  }

  function outputs(ctx,domains,kind,w,h,p,time,choice,confirmed,trial,reduced) {
    const points=anchors(kind,w,h);
    const level=ease((p-.28)/.36);
    if(level<.005 && !confirmed)return;
    const local=domains[0];
    for(let i=0;i<points.length;i++){
      const a=points[i],place={x:w*a.x,y:h*a.y},selected=confirmed?confirmed.base===i:choice===i;
      const radius=Math.min(w*(w/h<.87?.12:.073),h*.075);
      const agent=kind==='fashion'?local:domains[i+1];
      const from=rim(agent,place,.72),to={x:place.x,y:place.y-radius*.40};
      const bow=(i%2?-1:1)*Math.min(w*.034,27);
      const strength=level*(choice===null||selected?1:.60);
      trace(ctx,from,to,agent.tone,strength*.42,bow);
      const t=reduced?.71:(time*.39+i*.24)%1,packet=along(from,to,t,bow);
      cluster(ctx,packet,Math.max(2,radius*.055),agent.tone,time*.35,strength*.83);
      ctx.save();ctx.globalAlpha*=strength;ctx.translate(place.x,place.y);
      if(kind==='fashion'){
        const frame=trial?.results?.[i];
        const index=frame?Math.floor(ease(p/.64)*(frame.trials.length-1)):0;
        const look=(confirmed?.base===i && confirmed) || (p<.60 && frame?.trials[index]) ||
          trial?.comparison?.[i] || {base:i,layer:i,season:0,ring:0,necklace:0,bag:0};
        const k=radius/86;ctx.scale(k,k);
        window.LookArt.drawWorn(ctx,look,time);
      }else{
        // The result is a trace of work, visually smaller than either territory.
        // Documents leave ordered rows; simulation results retain diverging bands.
        const strands=kind==='former'&&i===0?8:7;
        for(let j=0;j<strands;j++) {
          const v=j/(strands-1),tone=i?'plum':agent.tone;
          const pts=Array.from({length:28},(_,n)=>{
            const u=n/27,edge=sin(Math.PI*u),r=radius;
            if(kind==='former'&&i===0)return [r*(u*1.35-.68+v*.18),r*((v-.5)*.42+.14*sin(u*4+v)+.12*u)];
            const wave=sin(u*(kind==='cost'?5:6)+v*1.8+time*.5);
            return [r*(u*1.6-.80),r*(wave*.16+edge*(v-.5)*(.48+.19*i)+u*(i?.22:-.17))];
          });
          path(ctx,pts,ink(tone,j===0||j===strands-1?.88:.43),j===0||j===strands-1?.95:.6);
        }
      }
      ctx.restore();
    }
  }
  const roleSize=(w,h)=>clamp(Math.min(w,h)*.020,12.5,16);
  const roleLineHeight=(w,h)=>Math.max(13,roleSize(w,h)*1.25);
  function drawRole(ctx,role,where,w,h,kind,compact) {
    const size=roleSize(w,h);
    const actionSize=clamp(size*.90,11.5,14);
    const narrow=w/h<.87;
    const column=compact?w*.30:kind==='fashion'?(narrow?w*.43:w*.20):w*.305;
    // Keep labels inside the viewport and in their knot's column. Portrait
    // fashion uses two shallow rows so the four roles and three results fit.
    const x=clamp(where.x,column*.5+3,w-column*.5-3);
    const y=where.y+where.r*(compact?.82:.91)+6;
    text(ctx,role.title,x,y,ink('pearl',.96),size,column);
    text(ctx,role.action,x,y+roleLineHeight(w,h),ink(where.tone,.94),actionSize,column);
  }
  function render(ctx,w,h,kind,p,seconds,choice=null,confirmed=null,trial=null,reduced=false,options={}) {
    if(!w||!h)return;
    const time=reduced?0:seconds,compact=Boolean(options.compact);
    const lang=options.lang||globalThis.document?.documentElement?.lang||'ko';
    const roleOptions={...options,branch:choice,allowShop:trial?.allowShop,priority:trial?.priority};
    const titles=roles(kind,lang,roleOptions);
    const names=roleIds(kind,roleOptions);
    const focus=kind==='fashion' ? priorityRole[trial?.priority] : null;
    const d=phraseLayout(w,h,kind,{...options,branch:choice});
    ctx.save();ctx.lineCap=ctx.lineJoin='round';
    const visible=(reduced?.48:(seconds*.153))%1;
    const beat=compact?clamp(p):reduced?.44:p<.71?p/.71:visible;
    const packets=[];
    if(kind==='request'){
      packets.push([0,1,true],[0,2,true]);
    }else if(kind==='fashion'){
      packets.push([0,1,true],[0,2,true],[0,3,trial?.allowShop!==false]);
    }else if(compact){
      packets.push([0,1,p>0],[1,2,p>.17]);
    }else if(kind==='former'){
      // The overview offers the public directory. A personal inquiry begins
      // only when the visitor submits a scope in the service room.
      packets.push([0,1,true],[0,2,false]);
    }else{
      packets.push([0,1,true],[0,2,true]);
    }
    for(let i=0;i<packets.length;i++){
      const [a,b,passing]=packets[i];
      let phase=(beat+((kind==='fashion'||kind==='cost')?.31*i:.10*i))%1;
      if(compact){
        // The employer obtains the reply from its own archive before answering
        // the visitor. A public office follows the same sequence with its peer.
        if(i===0){
          if(beat<.26)phase=mix(0,.53,beat/.26);
          else if(beat<.75)phase=mix(.53,.69,(beat-.26)/.49);
          else phase=mix(.70,1,(beat-.75)/.25);
        }else phase=clamp((beat-.17)/.63);
      }
      if(reduced && !compact)phase=i%2===0?.38:.84;
      exchange(ctx,d[a],d[b],phase,passing,time,i,compact);
    }
    if(kind!=='request'&&!compact)outputs(ctx,d,kind,w,h,p,time,choice,confirmed,trial,reduced);
    for(let i=0;i<d.length;i++) {
      const territory=d[i];
      const invited=i===0||packets.some(([a,b,open])=>open&&(a===i||b===i));
      const activeBranch=kind==='cost' && choice!==null && i===choice+1;
      const wave=.5+.5*sin((beat-i*.17)*TAU);
      const emphasis=focus && names[i]===focus;
      const effort=invited?clamp(.32+.51*wave+((activeBranch || emphasis) ? .31 : 0)):0;
      inside(ctx,territory,time,effort,compact);
      if(options.labels!==false && !(kind==='request'&&i>0))drawRole(ctx,titles[i],territory,w,h,kind,compact);
    }
    ctx.restore();
  }
  window.TerritoryScore={render,anchors,fashionRoles,roles};
})();
