/* Exhibition motion study. All positions are synthetic and reproducible from the playhead. */
(() => {
  'use strict';
  const TAU = Math.PI * 2;
  const PI = Math.PI;
  const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
  const lerp = (a,b,u) => a+(b-a)*u;
  const smooth = (v) => { const t=clamp(v); return t*t*(3-2*t); };
  const between = (p,a,b) => clamp((p-a)/(b-a));
  const rise = (p,a,b) => smooth(between(p,a,b));
  const blendPoint = (a,b,t) => [lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
  const c = Math.cos, s = Math.sin;
  const ink = ['164,207,198','202,180,146','188,197,217','225,225,211'];
  const tint = (index,alpha) => 'rgba('+ink[index]+','+clamp(alpha).toFixed(3)+')';
  const nodeNumber = 26;
  const origin = [-1.49,.18,.05];
  const register = [.04,.22,-.14];
  // These are the agents present when the first spoken request reaches the studio.
  const assigned=[0,3,4,5,8,10,12,14,15,17,20,22,24,25];
  const home = Array.from({length:nodeNumber},(_,i)=>{
    const angle = .27+i*2.39996323;
    const radius = 1.04+.19*s(i*9.2);
    return [c(angle)*radius, s(angle)*(.66+ .14*c(i*1.1)),.22*s(angle*2.3)];
  });
  function cinema(b,u,v) {
    const a=u*TAU + .12*b;
    const x=(.86+v*.064+.035*c(3*a))*c(a);
    const y=(.54+v*.092)*s(a)+.13*s(2*a+.52*b);
    const z=.24*s(a*2+.72*b)+.19*v*c(a+b)+.05*v;
    const rot=[-.51,.41,1.05][b];
    return [x*c(rot)-y*s(rot)+[-.16,.14,.09][b],x*s(rot)+y*c(rot)+[-.035,-.075,.01][b], z+[.12,-.11,.02][b]];
  }
  const targets=new Map(assigned.map((id,slot)=>{
    const band=slot%3;
    return [id,cinema(band,(slot*.228+.12*band+.04)%1,((slot%4)-1.5)*.43)];
  }));
  const path = (n,fn) => Array.from({length:n+1},(_,i)=>fn(i/n));
  function qPoint(a,b,t,bow=.12,side=1) {
    const v=s(PI*t);
    return [lerp(a[0],b[0],t),lerp(a[1],b[1],t)-v*bow,lerp(a[2],b[2],t)+side*v*.13];
  }
  const wires=assigned.map((id,i)=>[id,assigned[(i+3+(i%2))%assigned.length]]).filter((_,i)=>i%2===0);
  function strands() {
    const lines=[];
    function add(n,fn,colour,opacity,width) {
      const points=path(n,fn),depth=points.reduce((sum,pt)=>sum+pt[2],0)/points.length;
      lines.push({points,colour,opacity,width,depth});
    }
    for(let band=0;band<3;band++){
      for(let j=0;j<=16;j++){
        const offset=(j-8)/8,edge=j===0||j===16;
        // Short fragments interleave correctly where the surfaces cross in depth.
        for(let section=0;section<8;section++) add(9,t=>cinema(band,(section+t)/8,offset),band,edge?.79:.37,edge?1.15:.65);
      }
      for(let rib=0;rib<16;rib++) add(7,t=>cinema(band,rib/16,t*2-1),band,.10,.55);
    }
    return lines.sort((a,b)=>a.depth-b.depth);
  }
  const openingScene=strands();
  const memoryPath=path(52,t=>qPoint(origin,register,t,.33));
  function mount(canvas) {
    const ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx)return {render(){},getOrigin(){return null;},dispose(){}};
    let layout=null,ptr=null,ripple=null,lastPointer=null,projectedOrigin=null,originVisible=true,progress=0,elapsed=0;
    const motion=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
    function fit() {
      const width=canvas.clientWidth||canvas.parentElement?.clientWidth||800;
      const height=canvas.clientHeight||canvas.parentElement?.clientHeight||600;
      const dpr=Math.min(window.devicePixelRatio||1,2);
      if(layout&&layout.w===width&&layout.h===height&&layout.dpr===dpr)return;
      canvas.width=Math.round(width*dpr); canvas.height=Math.round(height*dpr);
      const narrow=width<690||width/height<.88;
      layout={w:width,h:height,dpr,cx:width*(narrow?.56:.615),cy:height*(narrow?.44:.43),scale:Math.min(width*(narrow?.32:.278),height*(narrow?.34:.42))};
    }
    function onMove(e){
      if(motion?.matches)return;
      const rect=canvas.getBoundingClientRect();
      const x=e.clientX-rect.left,y=e.clientY-rect.top, t=performance.now();
      const speed=lastPointer?Math.hypot(x-lastPointer.x,y-lastPointer.y)/Math.max(12,t-lastPointer.t):0;
      ptr={x,y,t,force:clamp(speed*8,0,14)};lastPointer={x,y,t};
    }
    function onTap(e){
      if(motion?.matches)return;
      const rect=canvas.getBoundingClientRect();
      ripple={x:e.clientX-rect.left,y:e.clientY-rect.top,t:performance.now()};
      render(progress,elapsed);
    }
    function leave(){lastPointer=null;}
    canvas.addEventListener('pointermove',onMove,{passive:true});
    canvas.addEventListener('pointerdown',onTap,{passive:true});
    canvas.addEventListener('pointerleave',leave,{passive:true});
    function render(position,seconds=0,showOrigin=true) {
      originVisible=Boolean(showOrigin);
      progress=clamp(Number(position)||0); elapsed=Number(seconds)||0;
      fit();
      const p=progress,L=layout,presence=rise(p,.055,.168),now=performance.now();
      const tiltTime=motion?.matches?0:elapsed;
      const ptrAge=ptr?(now-ptr.t)/1000:9,rippleAge=ripple?(now-ripple.t)/1000:9;
      const isMoving=ptrAge<.6, isRipple=rippleAge<.92;
      ctx.setTransform(L.dpr,0,0,L.dpr,0,0);ctx.clearRect(0,0,L.w,L.h);
      ctx.lineCap='round';ctx.lineJoin='round';
      // One projection per frame, shared by geometry, working nodes and all receipts.
      const working = motion?.matches ? 0 : presence;
      const yaw=.115+.074*s(tiltTime*.085)+working*.19*s(tiltTime*.40);
      const pitch=.125+working*.085*s(tiltTime*.32);
      const roll=-.045+.024*c(tiltTime*.079);
      const ay=c(yaw),by=s(yaw),ar=c(roll),br=s(roll);
      function project(q) {
        const px=q[0]*ay+q[2]*by,z=q[2]*ay-q[0]*by,py=q[1]*.984-z*pitch;
        const size=L.scale*3.6/(3.6-z);
        let x=L.cx+(px*ar-py*br)*size,y=L.cy+(py*ar+px*br)*size;
        if(isMoving||isRipple){
          const act=(obj,range,force,wave)=>{
            const dx=x-obj.x,dy=y-obj.y,r=Math.hypot(dx,dy);
            if(r<1||r>range)return;
            const disp=wave?force*Math.exp(-Math.pow((r-range*.63)/(10+.08*range),2)):force*Math.pow(1-r/range,2);
            x+=disp*dx/r;y+=disp*dy/r;
          };
          if(isMoving)act(ptr,67+L.scale*.13,ptr.force*(1-ptrAge/.6),false);
          if(isRipple)act(ripple,24+rippleAge*(L.scale*1.14+180),6.4*(1-rippleAge/.92),true);
        }
        return [x,y,z];
      }
      projectedOrigin=project(origin);
      const film=window.FilmReel;
      const lang=globalThis.document?.documentElement?.lang||'ko';
      if(p>=.124){
        film.draw(ctx,L.w,L.h,p,tiltTime,Boolean(motion?.matches),projectedOrigin,lang);
        return;
      }
      function drawLine(ps,col,width,limit=1,head=0) {
        if(ps.length<2||limit<=head)return;
        const low=Math.floor(head*(ps.length-1)),high=Math.floor(limit*(ps.length-1));
        ctx.strokeStyle=col;ctx.lineWidth=width;ctx.beginPath();
        for(let j=low;j<=high;j++){const k=project(ps[j]);if(j===low)ctx.moveTo(k[0],k[1]);else ctx.lineTo(k[0],k[1]);}
        ctx.stroke();
      }
      function spot(q,r,col,halo=0,ring=false) {
        const point=project(q);
        if(!originVisible && q===origin)return point;
        const [x,y]=point;
        if(halo>.01){
          for(let layer=3;layer>=1;layer--){
            ctx.fillStyle=tint(col,halo*(4-layer)*.052);
            ctx.beginPath();ctx.arc(x,y,r+layer*1.95,0,TAU);ctx.fill();
          }
        }
        ctx.beginPath();ctx.arc(x,y,r,0,TAU);
        if(ring){ctx.strokeStyle=tint(col,.92);ctx.lineWidth=1.15;ctx.stroke();}
        else{ctx.fillStyle=tint(col,.9);ctx.fill();}
        return point;
      }
      function light(a,b,t,bow,colour,size,alpha=1) {
        if(t<0||t>1||alpha<.005)return;
        const pts=path(28,q=>qPoint(a,b,q,bow));
        drawLine(pts,tint(colour,.17*alpha),.8);
        if(!originVisible && a===origin && t===0)return;
        const start=Math.max(0,t-.135),tail=path(9,q=>qPoint(a,b,lerp(start,t,q),bow));
        drawLine(tail,tint(colour,.72*alpha),1.25);
        ctx.save();ctx.globalAlpha=alpha;spot(qPoint(a,b,t,bow),size,colour,.68*alpha);ctx.restore();
      }
      const haze=(1-presence)*.40;
      if(haze>.005) {
        for(let j=0;j<14;j++){
          const v=j/13;
          const ps=path(48,t=>{
            const phase=t*4.8-.8;
            return [-1.15+2.35*t,.31*s(phase+v*.37)-.22+v*.34+.19*s(2*phase+v*.9),-.16+.11*s(phase)];
          });drawLine(ps,tint(j%5===0?1:0,haze*(.40+.52*s(PI*v))),j%4===0?.83:.61);
        }
      }
      const inkMemory=rise(p,.035,.16);
      const traced=rise(p,.015,.12);
      if(traced>.002)drawLine(memoryPath,tint(0,(.16+.18*(1-presence))*inkMemory),.92,traced);
      if(presence>.005){
        for(const strand of openingScene){
          const alpha=strand.opacity*Math.pow(presence,.66)*(.97+.17*strand.depth);
          drawLine(strand.points,tint(strand.colour,alpha),strand.width,Math.min(1,Math.max(.03,presence)*1.45));
        }
      }
      const places=home.map((point,id)=>targets.has(id)?blendPoint(point,targets.get(id),presence):point);
      if(presence>.3){
        const intensity=rise(presence,.3,.92);
        wires.forEach(([from,to],j)=>{
          const a=places[from],b=places[to],bow=.06+.035*(j%3);
          drawLine(path(26,q=>qPoint(a,b,q,bow)),tint(j%3,.19*intensity),.78);
          const local=(p-.115)*10.5-j*.18;
          if(local>0&&local<1)light(a,b,local,bow,j%3,1.75,intensity*.9);
        });
      }
      const inactive=.42*(1-rise(p,0,.12));
      for(let id=0;id<nodeNumber;id++){
        const activity=targets.has(id)?presence:0,alpha=clamp(inactive+activity*.94);
        if(alpha<.025)continue;
        const v=places[id],col=(id*7)%3,r=1.35+1.4*activity;
        ctx.save();ctx.globalAlpha=alpha;spot(v,r,col,activity*.35);
        if(activity>.4&&id%5===0)spot(v,r+2,col,0,true);
        ctx.restore();
      }
      const onIntensity=.72+.27*(1-rise(p,.04,.18));
      ctx.save();ctx.globalAlpha=onIntensity;projectedOrigin=spot(origin,4.2,3,.19,true);spot(origin,1.15,3);ctx.restore();
      if(inkMemory>.01){
        ctx.save();ctx.globalAlpha=inkMemory*(.45+.38*(1-presence));
        spot(register,2,0,.18);spot(register,4.6,0,0,true);ctx.restore();
      }
      light(origin,register,between(p,.007,.12),.33,3,2.75,1);
      if(p>=.077){
        const opacity=rise(p,.077,.124);
        ctx.globalCompositeOperation='destination-out';
        ctx.fillStyle='rgba(0,0,0,'+opacity+')';ctx.fillRect(0,0,L.w,L.h);
        ctx.globalCompositeOperation='source-over';
        film.draw(ctx,L.w,L.h,p,tiltTime,Boolean(motion?.matches),projectedOrigin,lang);
      }
    }
    // Sample the coordinates actually painted, including the current camera and
    // pointer displacement. Translate the backing canvas into viewport CSS pixels.
    function getOrigin(visible=originVisible){
      if(!layout || layout.w!==canvas.clientWidth || layout.h!==canvas.clientHeight || originVisible!==Boolean(visible)) {
        render(progress,elapsed,visible);
      }
      const bounds=canvas.getBoundingClientRect();
      if(!projectedOrigin || !bounds.width || !bounds.height)return null;
      return {x:bounds.left+projectedOrigin[0]*bounds.width/layout.w,
        y:bounds.top+projectedOrigin[1]*bounds.height/layout.h};
    }
    function dispose(){
      canvas.removeEventListener('pointermove',onMove);canvas.removeEventListener('pointerdown',onTap);canvas.removeEventListener('pointerleave',leave);
    }
    return {render,getOrigin,dispose};
  }
  window.TerritoryArt={mount};
})();
