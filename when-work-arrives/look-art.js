/* A fitting is a folded field: garment yarn, the companion weave, then the small material accents. */
(() => {
  'use strict';

  const yarn = [
    ['#cad0c8','#82959b','#99aab2'], // grey rib knit
    ['#dfb9c4','#a3708a','#c68da5'], // plum silk
    ['#c0cbb0','#759d8b','#9bbbaa']  // sage shell
  ];
  const companions = ['#99aabb','#c397b1','#afba98'];
  const seasons = ['#91b3be','#b1c49d','#c5a28b'];
  const patterns = new Map();
  const tau = Math.PI * 2;

  function yarnPoint(base, u, v, lower) {
    let x, y, z;
    if (base === 0) {
      // Closely ribbed knit: a broad catenary with its far edge turned under.
      x = 61*u + 22*v + 6*Math.sin(2.2*u + v);
      y = 11*u + 40*v - 22*Math.cos(2.5*u + .7*v);
      z = 26*Math.sin(2.4*u + .85*v) + 9*v;
    } else if (base === 1) {
      // A silk strip twists through a half turn; the viewer sees both surfaces.
      const twist = 1.8*u + .55;
      x = 68*u + 16*v*Math.cos(twist);
      y = -21*u + 14*Math.cos(3.2*u) + 23*v*Math.cos(twist);
      z = 23*Math.sin(2.1*u) + 29*v*Math.sin(twist);
    } else {
      // The waterproof shell holds a wider, tauter fold.
      x = 64*u + 15*v;
      y = 28*v + 21*Math.abs(u+.3*v) - 25*Math.cos(1.5*v) + 9*u;
      z = 36*(1-Math.abs(u-.15*v)) + 16*v - 13;
    }
    if (lower) {
      const k=lower-1;
      x = x*.84 + 10*v - 15 + k*3;
      y = y*.48 + (k===1?18:8)*Math.sin(2.5*u+v) + 43 - 4*k;
      z = z*.7 - 15 + 7*k;
    }
    const angle = -.28;
    const projectedX = x*Math.cos(angle) + z*Math.sin(angle);
    const depth = z*Math.cos(angle) - x*Math.sin(angle);
    const scale = 355/(355-depth);
    return {x:projectedX*scale, y:(y - depth*.29)*scale,depth};
  }
  function weave(base,lower) {
    const id=base+'/'+lower;
    if(patterns.has(id))return patterns.get(id);
    const lines=[];
    const filaments=lower?14:[26,20,18][base];
    for(let j=0;j<=filaments;j++){
      const v=2*j/filaments-1,points=[];
      for(let n=0;n<=28;n++)points.push(yarnPoint(base,2*n/28-1,v,lower));
      const depth=points.reduce((sum,pt)=>sum+pt.depth,0)/points.length;
      const edge=j===0||j===filaments;
      lines.push({points,depth,edge,across:false});
    }
    const crossCount=lower?4:[12,4,8][base];
    for(let j=0;j<=crossCount;j++){
      const u=2*j/crossCount-1,points=[];
      for(let n=0;n<=18;n++)points.push(yarnPoint(base,u,2*n/18-1,lower));
      const depth=points.reduce((sum,pt)=>sum+pt.depth,0)/points.length;
      lines.push({points,depth,edge:j===0||j===crossCount,across:true});
    }
    patterns.set(id,lines);
    return lines;
  }
  function trace(c,points) {
    c.beginPath(); c.moveTo(points[0].x,points[0].y);
    for(let i=1;i<points.length;i++)c.lineTo(points[i].x,points[i].y);
    c.stroke();
  }
  function seed(c,x,y,r,tone) {
    c.fillStyle=tone;c.beginPath();c.arc(x,y,r,0,tau);c.fill();
  }
  function accents(c,look) {
    // Each accessory changes one material trace. Their routes stay inside the folded field.
    const kinds=[look.ring,look.necklace,look.bag];
    const palettes=[['','#b6ccd4','#96baab'],['','#ceb58b','#e0d9c6'],['','#b8ae93','#c1a08c','#84b3b8']];
    for(const [i,id] of kinds.entries()){
      if(!id)continue;
      const v=[-.57,-.06,.66][i],points=[];
      for(let j=0;j<=18;j++){
        const u=-.88 + j*.094;
        const point=yarnPoint(look.base,u,v + .08*Math.sin(u*(id+1)+i),0);
        points.push(point);
      }
      c.save();c.strokeStyle=palettes[i][id];c.lineWidth=i===2?1.35:.85;
      trace(c,points);
      if(i===0){
        const near=points[id===1?7:12];
        seed(c,near.x,near.y,id===1?1.6:2.1,palettes[i][id]);
      } else if(i===1){
        const step=id===1?9:3;
        for(let j=3;j<points.length;j+=step)seed(c,points[j].x,points[j].y,1.05,palettes[i][id]);
      } else {
        c.lineWidth=.6;const offset=points.map(q=>({x:q.x,y:q.y+1.6+id*.7}));
        trace(c,offset);
      }
      c.restore();
    }
  }
  function drawWorn(c,look,time=0) {
    if(!look)return;
    const base=look.base, layer=look.layer,localAlpha=c.globalAlpha;
    const primary=weave(base,0),lower=weave(layer,layer+1);
    c.save();c.lineJoin=c.lineCap='round';
    const breathing=Math.sin(time*.72+base)-Math.sin(base);
    c.rotate(breathing*.028);c.transform(1,0,breathing*.047,1,0,0);
    const surfaces = [
      {lines:lower,colours:[companions[layer],companions[layer],seasons[look.season]],alpha:.58},
      {lines:primary,colours:yarn[base],alpha:.97}
    ];
    for(const {lines,colours,alpha} of surfaces){
      for(const line of lines){
        const depth=Math.max(0,Math.min(1,(line.depth+42)/80));
        c.globalAlpha=localAlpha*alpha*(line.edge?.92:line.across?.18+.19*depth:.29+.48*depth);
        c.strokeStyle=line.edge?colours[0]:line.across?colours[2]:colours[1];
        c.lineWidth=line.edge?1.05:line.across?.54:.72;
        trace(c,line.points);
      }
    }
    c.globalAlpha=localAlpha;
    // The selected forecast changes the light running across the lower layer.
    const edge=lower[Math.floor(lower.length*.45)];
    c.globalAlpha=localAlpha*.65;c.lineWidth=.9;c.strokeStyle=seasons[look.season];trace(c,edge.points);
    c.globalAlpha=localAlpha;accents(c,look);c.restore();
  }
  function draw(canvas,look,compact=false) {
    const w=canvas.clientWidth,h=canvas.clientHeight;
    if(!w||!h)return;
    const ctx=canvas.getContext('2d');
    if(!ctx)return;
    const ratio=Math.min(2,window.devicePixelRatio||1);
    if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){
      canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
    }
    ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
    const unit=Math.min(w*(compact?.85:.87)/190,h*(compact?.82:.81)/142);
    ctx.save();ctx.translate(w*.52,h*.48);ctx.scale(unit,unit);drawWorn(ctx,look);ctx.restore();
  }
  window.LookArt={draw,drawWorn};
})();
