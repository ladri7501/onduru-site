(() => {
  'use strict';

  // The threshold, room and main monitor are three nested picture planes. Each
  // plane contains the drawing the visitor is about to enter.
  const paper = '#080e14';
  const ink = '205,201,188';
  const mint = '145,211,193';
  const fullTurn = Math.PI * 2;
  const mix = (a,b,u) => a+(b-a)*u;
  const clamp = v => Math.max(0,Math.min(1,v));
  const tone = (color,opacity) => 'rgba('+color+','+opacity+')';
  function ease(t,from,to) {
    const u=clamp((t-from)/(to-from));
    return u*u*(3-2*u);
  }
  function stroke(g,p,color,opacity,weight) {
    g.strokeStyle=tone(color,opacity);
    g.lineWidth=weight;
    g.beginPath();
    g.moveTo(p[0][0],p[0][1]);
    for (let i=1;i<p.length;i++) g.lineTo(p[i][0],p[i][1]);
    g.stroke();
  }
  function rect(g,x,y,w,h,color,opacity,weight) {
    g.strokeStyle=tone(color,opacity);
    g.lineWidth=weight;
    g.strokeRect(x,y,w,h);
  }
  function dot(g,x,y,r,color,opacity) {
    g.fillStyle=tone(color,opacity);
    g.beginPath(); g.arc(x,y,r,0,fullTurn); g.fill();
  }
  function arc(g,x,y,r,color,opacity,weight,start=0,end=fullTurn) {
    g.strokeStyle=tone(color,opacity);
    g.lineWidth=weight;
    g.beginPath(); g.arc(x,y,r,start,end); g.stroke();
  }
  function withAlpha(g,opacity,fn) {
    if(opacity<=0) return;
    g.save();
    g.globalAlpha*=opacity;
    fn();
    g.restore();
  }

  // Lay a partial line over an existing route and return the current position
  // of its messenger. Interpolation by distance keeps the pace at bends.
  function routePrefix(route,phase) {
    const lengths=route.slice(1).map((p,i)=>Math.hypot(p[0]-route[i][0],p[1]-route[i][1]));
    let left=lengths.reduce((a,b)=>a+b,0)*clamp(phase);
    const prefix=[route[0]];
    for(let i=0;i<lengths.length;i++) {
      const a=route[i], b=route[i+1];
      const u=lengths[i] ? Math.min(1,left/lengths[i]) : 1;
      prefix.push([mix(a[0],b[0],u),mix(a[1],b[1],u)]);
      left-=lengths[i];
      if(left<=0) break;
    }
    return prefix;
  }
  function travel(g,route,phase,color,weight,opacity,radius) {
    if (phase<=0) return;
    const prefix=routePrefix(route,phase);
    stroke(g,prefix,color,opacity,weight);
    const q=prefix[prefix.length-1];
    if(phase<1 && radius>0) dot(g,q[0],q[1],radius,color,.90);
  }

  const entrance=[-326,-5], split=[-260,-5], merge=[-13,-5], review=[183,-5], exit=[294,-5];
  const routes=[
    [entrance,split],
    [split,[-171,-83],merge], [split,[-171,78],merge],
    [merge,[77,-73],review], [merge,[77,71],review],
    [review,exit]
  ];
  const gates=[[21.35,22.12],[21.98,23.19],[22.05,23.35],[23.11,24.17],[23.25,24.31],[24.32,25]];
  const receipt=[exit,[324,23],[324,115],[202,115],[64,115],[-98,115],[-262,115],[-326,115],entrance];
  const seats=[[-171,-83],[-171,78],merge,[77,-73],[77,71],review];
  function network(g,t,scale,handoff) {
    const pen=Math.min(2.5,Math.max(.82,.88/scale));
    const stepBeforeArrival=(t*.43)%1;
    for (let i=0;i<routes.length;i++) {
      const route=routes[i];
      stroke(g,route,ink,.31,pen*.78);
      const progress=ease(t,...gates[i]);
      travel(g,route,progress,i===5?mint:ink,pen, i===5 ? .70 : .49,3.5);
      if (t<21.35) {
        const u=(stepBeforeArrival+i*.173)%1;
        travel(g,route,u,ink,pen*.63,.24,2.6);
      }
    }
    for (let i=0;i<seats.length;i++) {
      const [x,y]=seats[i];
      const accepted=ease(t,i===5?24.17:22.48+i*.29,i===5?24.56:22.8+i*.29);
      stroke(g,[[x-12,y+20],[x+13,y+20]],ink,.28,pen*.69);
      arc(g,x,y,11.6,ink,.63,pen*.95, .38,fullTurn-.24);
      arc(g,x,y-11,6.3,ink,.34,pen*.70,2.93,fullTurn+.36);
      dot(g,x,y,2.8,i===5?mint:ink,.40+accepted*.48);
      if(i===2 || i===5) arc(g,x,y,17.8,mint,.13+accepted*.32,pen*.72,3.22,fullTurn+1.74);
    }
    const approval=ease(t,24.6,25);
    [entrance,exit].forEach(([x,y],i)=>{
      stroke(g,[[x-10,y+22],[x-10,y-22],[x+12,y-22],[x+12,y+22]],ink,.59,pen);
      arc(g,x,y,5.4,i?mint:ink,.58+approval*.25,pen*.78);
      dot(g,x,y,1.8,i?mint:ink,.83);
    });
    for (const x of [-233,-208,-54,15,136,236]) {
      stroke(g,[[x,115],[x,109]],ink,.32,pen*.78);
    }
    stroke(g,receipt,ink,.22,pen*.68);
    // The accepted result leaves a second, legible route back to its author.
    travel(g,receipt,ease(t,25,26.55),mint,pen*.95,.69,handoff?0:3.75);
    for (let i=0;i<5;i++) {
      const stamp=ease(t,21.65+i*.64,21.9+i*.64);
      if(stamp) dot(g,-262+i*116,115,1.9,ink,.34+stamp*.34);
    }
    withAlpha(g,ease(t,26.32,26.62),()=>{
      arc(g,entrance[0],entrance[1],12,mint,.76,pen*.9);
      dot(g,entrance[0],entrance[1],3.9,mint,.94);
    });
  }

  const monitors=[
    {x:-440,y:-157,w:104,h:142,kind:'text'},
    {x:-280,y:-145,w:286,h:151,kind:'main'},
    {x:47,y:-124,w:215,h:117,kind:'text'},
    {x:304,y:-88,w:117,h:78,kind:'stars'}
  ];
  const main=monitors[1];
  const screenX=main.x+main.w/2, screenY=main.y+main.h/2;
  const networkScale=main.w/760;
  const laptops=[
    {x:-383,y:39,w:147,h:86,kind:'text'},
    {x:-74,y:61,w:124,h:66,kind:'text'},
    {x:216,y:48,w:145,h:85,kind:'stars'}
  ];
  function display(g,s,t,pen,roomScale,phase) {
    const {x,y,w,h,kind}=s;
    rect(g,x,y,w,h,ink,.70,pen);
    if(kind==='main') {
      g.save(); g.translate(screenX,screenY); g.scale(networkScale,networkScale);
      network(g,t,roomScale*networkScale);
      g.restore();
      return;
    }
    if(kind==='text') {
      const rows=Math.round(h/9.5);
      for(let r=0;r<rows;r++) {
        const pad=6+(r%4===0?7:0);
        let dx=pad;
        for(let j=0;j<4;j++) {
          const span=(.06+.16*(1+Math.sin(r*5.1+j*2.1+phase))*.5)*w;
          if(dx+span>w*.94) break;
          const rowY=y+6+r*(h-12)/rows;
          stroke(g,[[x+dx,rowY],[x+dx+span,rowY]],ink,.17+.11*((r+j)%3),pen*.72);
          dx+=span+4;
        }
      }
    } else {
      const points=[[.19,.68],[.32,.24],[.51,.34],[.67,.64],[.76,.27],[.86,.51]];
      const coords=points.map(([a,b])=>[x+a*w,y+b*h]);
      stroke(g,coords,ink,.44,pen*.77);
      stroke(g,[coords[1],coords[3],coords[4]],ink,.31,pen*.64);
      coords.forEach(([a,b],i)=>dot(g,a,b,1.35,i===4?mint:ink,.60+.21*Math.sin(i+t)));
    }
  }
  function room(g,t,scale) {
    const pen=Math.max(.62,Math.min(2.3,.82/scale));
    const horizon=40;
    stroke(g,[[-464,158],[-407,horizon],[399,horizon],[462,158]],ink,.38,pen);
    stroke(g,[[-403,159],[399,159]],ink,.16,pen*.7);
    for(const [i,s] of monitors.entries()) {
      const x=s.x+s.w/2, y=s.y+s.h;
      stroke(g,[[x,y],[x,horizon]],ink,.32,pen*.69);
      stroke(g,[[x-13,horizon],[x+15,horizon]],ink,.41,pen*.7);
      display(g,s,t,pen,scale,i+.24);
    }
    for(const [i,s] of laptops.entries()) {
      g.fillStyle=paper; g.fillRect(s.x,s.y,s.w,s.h);
      display(g,s,t,pen,scale,i+.84);
      const y=s.y+s.h;
      stroke(g,[[s.x,y+3],[s.x-10,y+15],[s.x+s.w+13,y+15],[s.x+s.w,y+3],[s.x,y+3]],ink,.56,pen*.87);
    }
    for(const [x,w] of [[-232,33],[104,42],[165,23]]) {
      rect(g,x,18,w,20,ink,.39,pen*.77);
      dot(g,x+w-6,32,1.9,mint,.68);
    }
    stroke(g,[[-236,59],[-236,67],[195,67]],ink,.25,pen*.66);
    for(const x of [-235,-117,75,150]) dot(g,x,67,1.8,mint,.76);
  }

  function facade(g,dx,dy,dw,dh,weight) {
    stroke(g,[[dx-5.2*dw,dy+dh],[dx+4.8*dw,dy+dh]],ink,.32,weight);
    const blocks=[[-3.6,1.22],[-2.36,1.75],[-1.43,.92],[1.48,1.58],[2.38,1.11],[3.07,1.65]];
    blocks.forEach(([offset,height],i)=>{
      const x=dx+offset*dw, bottom=dy+dh;
      const roof=bottom-dh*height;
      stroke(g,[[x,bottom],[x,roof],[x+dw*.79,roof],[x+dw*.79,bottom]],ink,.14,weight*.76);
      for(let j=0;j<3;j++) {
        const wx=x+dw*(.22+((i+j)%2)*.35), wy=bottom-dh*(.23+j*.29);
        if(wy>roof+dw*.07) dot(g,wx,wy,Math.max(1,dw*.013),ink,.21+((i+j)%3)*.08);
      }
    });
    for(const f of [-1.3,-.54,.1,.7,1.42,2.36]) {
      stroke(g,[[dx+dw*.5+(f-.5)*dw*.28,dy+dh],[dx+f*dw,dy+dh*1.35]],ink,.13,weight*.73);
    }
  }

  // Continue the last working dot through the ledger, out of the old monitor
  // and onto the live film. The end of this path is supplied by the film itself.
  function handToFilm(g,t,target,centerX,centerY,scale,reduced) {
    if(t<25 || t>=29) return;
    let x,y;
    const u=ease(t,26.55,28.5);
    if(t<26.55) {
      const q=routePrefix(receipt,ease(t,25,26.55)).at(-1);
      x=centerX+q[0]*scale; y=centerY+q[1]*scale;
    } else {
      const sx=centerX+entrance[0]*scale, sy=centerY+entrance[1]*scale;
      const bend=Math.min(38*scale,Math.hypot(target.x-sx,target.y-sy)*.27);
      // Tangent at lift-off follows the incoming vertical ledger stroke.
      const v=1-u;
      x=v*v*v*sx+3*v*v*u*sx+3*v*u*u*mix(sx,target.x,.72)+u*u*u*target.x;
      y=v*v*v*sy+3*v*v*u*(sy-bend)+3*v*u*u*(target.y-bend*.25)+u*u*u*target.y;
      if(reduced) { x=target.x; y=target.y; }
    }
    const color=[mix(145,225,u),mix(211,225,u),mix(193,211,u)].map(Math.round).join(',');
    const radius=mix(Math.max(2.15,Math.min(4.6,3.75*scale)),2.75,u);
    withAlpha(g,1-ease(t,28.5,29),()=>{
      dot(g,x,y,radius,color,.91);
      arc(g,x,y,mix(radius+2.3,4.2,u),color,.33+u*.57,.93);
    });
  }

  // While the real screens are shown, on a narrow screen the monitor comes nearer, so its glass
  // spreads across the exhibition's width and the room below fills toward its foot (On, 2026-11-28
  // 07:44 「넓게 펼쳐」). lift 0 is the journey as it was; 1 is the nearer view.
  function lifted(w,h,scale,roomX,roomY,lift) {
    if(!(lift>0)) return [scale,roomX,roomY];
    const gw=main.w*scale, gh=main.h*scale;
    const want=Math.max(1,Math.min(w*.95/gw,h*.42/gh));
    const z=Math.exp(Math.log(want)*Math.min(1,lift));
    const gx=mix(roomX+screenX*scale,w/2,lift), gy=mix(roomY+screenY*scale,h*.38,lift);
    return [scale*z,gx-screenX*scale*z,gy-screenY*scale*z];
  }
  function draw(g,w,h,t,options) {
    if(t<=12 || !w || !h) return;
    const enter=ease(t,12,14);
    const isPortrait=w/h<.88;
    const baseW=Math.min(w*(isPortrait?.36:.19),h*.236);
    const baseH=baseW*2.10;
    const ax=w*.56, ay=h*.53;
    const paneX=ax-baseW*.83, paneY=ay-baseH*.53;
    const rush=ease(t,16.05,18.55);
    const gateScale=Math.exp(rush*2.85);
    const targetX=w*.5, targetY=h*(isPortrait?.42:.46);
    const cx=mix(paneX+baseW*.53,targetX,rush);
    const cy=mix(paneY+baseH*.46,targetY,rush);
    const dw=baseW*gateScale, dh=baseH*gateScale;
    const dx=cx-dw*.53, dy=cy-dh*.46;
    const doorway=ease(t,14.03,16.85);
    const roomEnter=ease(t,15.35,19.05);
    const magnify=ease(t,20.0,23.05);
    const startScale=baseW*.85/920;
    const deskScale=Math.min(w*(isPortrait?.97:.83)/920,h*.68/372);
    const insideScale=Math.min(w*.88/730,h*.45/255)/networkScale;
    let scale=Math.exp(mix(Math.log(startScale),Math.log(deskScale),roomEnter));
    scale=Math.exp(mix(Math.log(scale),Math.log(insideScale),magnify));
    let roomX=mix(mix(paneX+baseW*.55,targetX,roomEnter),targetX-screenX*insideScale,magnify);
    let roomY=mix(mix(paneY+baseH*.50,targetY,roomEnter),targetY-screenY*insideScale,magnify);
    if(isPortrait) [scale,roomX,roomY]=lifted(w,h,scale,roomX,roomY,options?.lift);
    const wallVisibility=1-ease(t,17.94,18.56);
    const bezelFade=ease(t,22.45,23.13);
    g.save();
    const target=options?.target;
    const handoff=target && Number.isFinite(target.x) && Number.isFinite(target.y);
    g.globalAlpha*=enter*(options ? 1-ease(t,25.68,28.51) : 1);
    g.fillStyle=paper; g.fillRect(0,0,w,h);
    g.lineJoin='round'; g.lineCap='round';
    withAlpha(g,wallVisibility,()=>facade(g,dx,dy,dw,dh,.85));
    g.save();
    if(wallVisibility>.001) {
      g.beginPath(); g.rect(dx,dy,dw,dh); g.clip();
      g.fillStyle=paper; g.fillRect(dx,dy,dw,dh);
    }
    g.translate(roomX,roomY); g.scale(scale,scale);
    if(bezelFade<1) withAlpha(g,1-bezelFade,()=>room(g,t,scale));
    if(bezelFade>0) {
      g.translate(screenX,screenY); g.scale(networkScale,networkScale);
      withAlpha(g,bezelFade,()=>network(g,t,scale*networkScale,handoff));
    }
    g.restore();
    withAlpha(g,wallVisibility,()=>{
      const edge=dx+dw*mix(1,.065,doorway);
      const inset=dh*.058*doorway;
      g.beginPath(); g.moveTo(dx,dy); g.lineTo(edge,dy+inset);
      g.lineTo(edge,dy+dh-inset*.55); g.lineTo(dx,dy+dh); g.closePath();
      g.fillStyle=paper; g.fill();
      g.strokeStyle=tone(ink,.61); g.lineWidth=.94; g.stroke();
      rect(g,dx,dy,dw,dh,ink,.66,.88);
      const knobX=mix(dx,edge,.83), knobY=dy+dh*.53+inset*.12;
      arc(g,knobX,knobY,Math.max(3,Math.min(11,dw*.023)),mint,.80,.84,.23,fullTurn-.22);
      dot(g,knobX,knobY,Math.max(1.35,Math.min(3.8,dw*.009)),mint,.94);
    });
    g.restore();
    if(handoff) {
      handToFilm(g,t,target,roomX+screenX*scale,roomY+screenY*scale,scale*networkScale,options.reduced);
    }
  }
  // Where the main monitor's glass lies on the canvas at a given moment of the journey (the same
  // reckoning as draw), so another drawing can be shown on it: the real screens (real-screens.js).
  function screenAt(w,h,t,lift) {
    if(t<=12 || !w || !h) return null;
    const isPortrait=w/h<.88;
    const baseW=Math.min(w*(isPortrait?.36:.19),h*.236);
    const baseH=baseW*2.10;
    const ax=w*.56, ay=h*.53;
    const paneX=ax-baseW*.83, paneY=ay-baseH*.53;
    const targetX=w*.5, targetY=h*(isPortrait?.42:.46);
    const roomEnter=ease(t,15.35,19.05);
    const magnify=ease(t,20.0,23.05);
    const startScale=baseW*.85/920;
    const deskScale=Math.min(w*(isPortrait?.97:.83)/920,h*.68/372);
    const insideScale=Math.min(w*.88/730,h*.45/255)/networkScale;
    let scale=Math.exp(mix(Math.log(startScale),Math.log(deskScale),roomEnter));
    scale=Math.exp(mix(Math.log(scale),Math.log(insideScale),magnify));
    let roomX=mix(mix(paneX+baseW*.55,targetX,roomEnter),targetX-screenX*insideScale,magnify);
    let roomY=mix(mix(paneY+baseH*.50,targetY,roomEnter),targetY-screenY*insideScale,magnify);
    if(isPortrait) [scale,roomX,roomY]=lifted(w,h,scale,roomX,roomY,lift);
    const pen=Math.max(.62,Math.min(2.3,.82/scale))*scale;
    return {x:roomX+main.x*scale,y:roomY+main.y*scale,w:main.w*scale,h:main.h*scale,pen};
  }
  window.ReturnStudio={draw,screenAt};
})();
