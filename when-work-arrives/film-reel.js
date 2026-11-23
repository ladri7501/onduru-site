/* From a working script to an authorised shot shared by three independent studios. */
(() => {
  'use strict';
  const PI=Math.PI, TAU=PI*2, sin=Math.sin,cos=Math.cos,abs=Math.abs;
  const ink=['214,214,199','143,198,182','201,171,130','153,177,202','189,144,161'];
  const clamp=n=>Math.max(0,Math.min(1,n));
  const mix=(a,b,t)=>a+(b-a)*t;
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  const ramp=(x,a,b)=>ease((x-a)/(b-a));
  const interval=(p,a,b,c,d)=>ramp(p,a,b)*(1-ramp(p,c,d));
  const tint=(col,a)=>'rgba('+ink[col]+','+clamp(a)+')';
  const points=(n,fn)=>Array.from({length:n+1},(_,i)=>fn(i/n));
  const words={
    ko:['촬영 스튜디오','사운드 스튜디오','편집 스튜디오'],
    en:['Shooting studio','Sound studio','Picture edit'],
    es:['Estudio de rodaje','Estudio de sonido','Sala de montaje']
  };
  function painter(ctx,origin,scale,yaw,pitch,lineScale=1) {
    const cy=cos(yaw),sy=sin(yaw),cp=cos(pitch),sp=sin(pitch);
    function project(pt){
      const [x,y,z=0]=pt, deep=z*cy-x*sy, v=y*cp-deep*sp;
      const factor=scale*4.6/(4.6-(y*sp+deep*cp));
      return [origin[0]+(x*cy+z*sy)*factor,origin[1]+v*factor,deep];
    }
    function line(pts,col,alpha=.6,width=.9){
      if(alpha<.008||pts.length<2)return;
      ctx.strokeStyle=tint(col,alpha);ctx.lineWidth=width*lineScale;ctx.beginPath();
      for(let i=0;i<pts.length;i++){
        const q=project(pts[i]);if(i===0)ctx.moveTo(q[0],q[1]);else ctx.lineTo(q[0],q[1]);
      }
      ctx.stroke();
    }
    function eye(q,r=2,col=0,alpha=1,ring=false){
      const [x,y]=project(q);ctx.beginPath();ctx.arc(x,y,r*lineScale,0,TAU);
      if(ring){ctx.strokeStyle=tint(col,alpha);ctx.lineWidth=1.04*lineScale;ctx.stroke();}
      else{ctx.fillStyle=tint(col,alpha);ctx.fill();}
    }
    function relay(a,b,t,bow,col=1,alpha=.8){
      const at=u=>[mix(a[0],b[0],u),mix(a[1],b[1],u)-bow*sin(u*PI),mix(a[2]||0,b[2]||0,u)+.09*sin(u*PI)];
      line(points(22,at),col,alpha*.48,.82);
      if(t<0||t>1)return;
      line(points(8,u=>at(mix(Math.max(0,t-.11),t,u))),col,alpha,1.5);
      eye(at(t),2.35,col,alpha);
    }
    return {ctx,line,eye,relay,project};
  }

  function pagePoint(x,y,z,t) {
    return [-.24+x*.91+y*.15,y*.77+.10*x+.045*sin(PI*x+1.4*y+t*.33),z+.18*cos(x*2.3+y*.6)];
  }
  function script(v,t,rel,small=false) {
    const {line,eye,relay}=v;
    // Each leaf has a fixed draft sequence. The new line flows from margin to type.
    for(let k=2;k>=0;k--) {
      const depth=-.12*k;
      const leaf=(x,y)=>pagePoint(x+k*.047,y+k*.074,depth,t);
      const edge=points(26,u=>leaf(-.73+1.39*u,-.63));
      line([...edge,...points(13,u=>leaf(.66,-.63+1.24*u)),...points(26,u=>leaf(.66-1.39*u,.61)),...points(13,u=>leaf(-.73,.61-1.24*u))],k===0?3:1,k===0?.71:.29,k===0?1.1:.75);
      if(k===0) {
        for(let row=0;row<13;row++) {
          const left=row%4===0?-.24:-.60, y=-.49+row*.079;
          const len=row%4===0?.26:row===8?1.07:.62+.10*sin(row*1.73);
          const color=row===8?2:row%4===0?3:0;
          for(let n=0;n<4;n++){
            const start=left+n*len/4,end=start+len*(.16+.015*cos(n+row));
            line(points(8,u=>leaf(mix(start,end,u),y)),color,row===8?.84:.39,row===8?1.35:.8);
          }
        }
        const at=leaf(-.60+rel*.98,.14);
        eye(at,.95,2,.88);
      }
    }
    if(small)return;
    const draft=pagePoint(.43,.18,.05,t);
    for(let k=0;k<3;k++){
      const r=.089+k*.014,core=[.66,-.32+k*.28,-.11+k*.12];
      for(let j=0;j<6;j++){
        const rr=r*(.54+j*.091);
        line(points(26,u=>{
          const a=TAU*u;return [core[0]+rr*cos(a),core[1]+rr*sin(a)*.70,core[2]+.065*sin(a*2+k+t*.46)];}),[1,2,4][k],.28+j*.043,.72);
      }
      relay(draft,core,(t*.20+k*.28)%1,.12,[1,2,4][k],.70);
    }
  }

  // The brow, bridge, mouth and chin visibly alter between three test profiles.
  const profile=[[-.21,.64],[-.21,.47],[-.30,.32],[-.36,.07],[-.34,-.24],[-.19,-.46],[.03,-.54],[.24,-.50],[.34,-.37],[.32,-.20],[.37,-.13],[.45,-.03],[.34,.01],[.35,.10],[.29,.14],[.31,.21],[.23,.27],[.11,.28],[.08,.46],[.30,.60]];
  function silhouette(v,cx,cy,size,who,t,strength=1,detail=12) {
    const tone=[1,3,2][who%3];
    const turn=.10*sin(t*.69+who);
    for(let j=0;j<=detail;j++) {
      const side=j/detail, z=(side-.5)*.47;
      const pts=profile.map(([xx,yy],n)=>{
        const front=n>7&&n<18,rx=front?1-side*.69:1-side*.24;
        const x=xx*rx+(front&&n===11?.038*who:0)-.17*side;
        return [cx+size*(x*cos(turn)+z*sin(turn)),cy+size*(yy+.12*side+.025*who*sin(n*.52)),size*(z*cos(turn)-x*sin(turn))];
      });
      const outline=[];
      for(let n=0;n<pts.length-1;n++){
        const a=pts[Math.max(0,n-1)],b=pts[n],c=pts[n+1],d=pts[Math.min(pts.length-1,n+2)];
        for(let step=0;step<3;step++){
          const u=step/3;
          outline.push(b.map((v,k)=>.5*(2*v+(-a[k]+c[k])*u+(2*a[k]-5*v+4*c[k]-d[k])*u*u+(-a[k]+3*v-3*c[k]+d[k])*u*u*u)));
        }
      }
      outline.push(pts[pts.length-1]);
      v.line(outline,tone,strength*(j===0||j===detail?.94:.20+.18*side),j===0?1.32:.7);
    }
    if(who===1) {
      for(let n=0;n<7;n++){
        const u=n/6;
        v.line([[cx+size*(-.21+.04*u),cy+size*(.44+.13*u),-.05*size],
          [cx+size*(-.32+.44*u),cy+size*(.65-.05*u),.02*size],
          [cx+size*(-.42+.79*u),cy+size*(.72+.022*sin(PI*u)),.05*size]],3,strength*(n===0||n===6?.64:.30),.73);
      }
    }
    v.eye([cx+size*.28,cy-size*.19,size*-.12],1.8,tone,.84*strength);
  }
  function casting(v,t,rel) {
    const focus=ramp(rel,.15,.91), core=.73+.50*focus;
    const xs=[-.74,-.04,.65];
    for(let i=0;i<3;i++){
      const chosen=i===1, k=chosen?core:.64-focus*.16;
      const at=[xs[i]+sin(t*.48+i)*.022,chosen?-.07:-.14+i*.07];
      silhouette(v,at[0],at[1],k,i,t,chosen?1:.70,chosen?15:9);
      const wave=points(55,u=>[at[0]-.23+u*.46,at[1]+k*.81+.047*sin(u*(28+i*7)+t*3.1)*sin(u*PI),-.08+.09*u]);
      v.line(wave,[1,3,2][i],chosen?.91:.44,chosen?1.18:.8);
      v.eye(wave[Math.floor(((t*.46+i*.25)%1)*54)],1.92,[1,3,2][i],.82);
    }
    v.relay([-.65,.53,-.15],[-.11,.44,.10],(t*.33)%1,.105,1,.75);
    v.relay([.67,.52,-.12],[.14,.44,.10],(t*.34+.27)%1,.055,2,.64);
  }

  function rehearsal(v,t,rel) {
    const {line,eye,relay}=v;
    for(let j=0;j<10;j++)line(points(39,u=>{
      const a=PI*(.06+u*.88),r=.29+j*.050;
      return [.20+r*cos(a),.20+.32*r*sin(a),.51*r*sin(a)-.07];}),3,j%3===0?.45:.19,.78);
    const move=ease((sin(t*.86)+1)/2), turn=ramp(rel,.12,.70);
    const performer=[-.07+move*.36,.07-.12*move,.15],partner=[.60,-.13+.11*move,-.11];
    silhouette(v,performer[0],performer[1]-.13,.49,1,t,.9,7);
    silhouette(v,partner[0],partner[1]-.11,.36,0,-t,.76,6);
    const lineMarks=points(31,u=>[-.34+u*.91,.29-.29*u+.10*sin(u*TAU+.55),.05+.22*sin(u*PI)]);
    line(lineMarks,1,.69,1.03);eye(lineMarks[Math.floor(move*30)],3,0,.87,true);
    // The rehearsal sends its new line back to the draft: the old position
    // stays as a light dotted impression beneath the resulting cadence.
    for(let i=0;i<9;i++){
      const yy=-.37+i*.091,len=i===5?.52:.28+.07*sin(i*3);
      const to=points(22,u=>[-.98+len*u,yy-.05*u+(i===5?.06*turn*sin(u*PI*2):0),-.10+.06*u]);
      line(to,i===5?2:0,i===5?.94:.42,i===5?1.32:.73);
    }
    relay([performer[0],performer[1]+.22,.18],[-.46,.05,-.07],ramp(rel,.13,.80),.27,2,.98);
    relay([-.49,.05,-.1],partner,(t*.28+.26)%1,-.11,4,.58);
  }

  function shot(v,t,rel,mini=false,reverse=false) {
    const {line,eye}=v;
    const direction=reverse?-1:1, moment=(1+sin(t*.66))*.5;
    // Two receding set walls and shafts through a slatted window. Their
    // intersection with the shot plane changes as the virtual dolly tracks.
    for(let i=0;i<=13;i++){
      const u=i/13,x=-.73+.49*u;
      const back=[direction*x,-.43+.075*u,-.29];
      line([back,[direction*(x+.35),.33,.31]],2,i%4===0?.64:.27,i%4===0?1:.65);
      line([[direction*.67,-.47+.65*u,-.32],[direction*.85,-.28+.59*u,.31]],3,i%4===0?.55:.19,.73);
    }
    for(let i=0;i<8;i++)line(points(20,u=>[-.86+1.68*u,.31+i*.029-.045*u,-.27+i*.11]),1,i===7?.58:.18,.68);
    const person=-.22+.18*moment;
    silhouette(v,direction*person,.018,.62,1,direction*t,.97,mini?5:10);
    silhouette(v,direction*.42,-.15,.36,0,-direction*t,.69,mini?4:7);
    const pace=(t*.68)%1;
    for(let j=0;j<3;j++){
      const u=(pace+j/3)%1, x=direction*(person-.15+.39*u);
      line([[x,.379,.20],[x+.026*direction,.378-.039*(1-u),.20]],2,.28+.65*sin(PI*u),1.35);
    }
    const pan=.091*sin(t*.62)*direction, l=-.59+pan,r=.55+pan,top=-.45,bot=.37,z=.19;
    const corner=(x,y,sx,sy)=>line([[x+sx*.14,y,z],[x,y,z],[x,y+sy*.11,z]],0,.91,1.10);
    corner(l,top,1,1);corner(r,top,-1,1);corner(l,bot,1,-1);corner(r,bot,-1,-1);
    if(mini)return;
    const cam=[-.70+.18*rel+.09*sin(t*.53),.58,.48];
    const target=[direction*person,-.12,.08];
    line([cam,[l,bot,z]],3,.55,.85);line([cam,[r,bot,z]],3,.57,.85);
    line([cam,target],3,.23,.68);
    for(let i=0;i<6;i++)line(points(30,u=>[cam[0]+(.076+i*.008)*cos(TAU*u),cam[1]+(.037+i*.004)*sin(TAU*u),cam[2]+i*.015]),3,.72-i*.063,.72);
    eye(cam,2.2,3,.91);
  }
  const bodyMeshes=new Map();
  function bodyMesh(kind){
    if(bodyMeshes.has(kind))return bodyMeshes.get(kind);
    const lines=[];
    for(let j=0;j<17;j++){
      const v=(j-8)/8,edge=j===0||j===16;
      const shape=u=>{
        const a=TAU*u, r=.76+.11*v;
        if(kind===0)return [r*(1.01+.07*cos(3*a))*cos(a),r*.71*sin(a)+v*.13,.30*sin(2*a+.4)+v*.25];
        if(kind===1)return [(r+.10*cos(3*a))*cos(a),r*.60*sin(a)+.145*v,.31*sin(3*a)+.23*v];
        return [r*1.13*cos(a),(.46+.12*v)*sin(a)+v*.16,.45*sin(2*a+.20)+.16*v];
      };
      for(let part=0;part<6;part++){
        const pts=points(7,u=>shape((part+u)/6));
        lines.push({pts,z:pts[3][2],edge,tone:j%5===0?0:[1,2,3][kind]});
      }
    }
    lines.sort((a,b)=>a.z-b.z);
    bodyMeshes.set(kind,lines);return lines;
  }
  function drawAssembly(v,kind,t,level,working) {
    const {line,eye}=v;
    for(const piece of bodyMesh(kind))line(piece.pts,piece.tone,level*(piece.edge?.79:.24+clamp(piece.z+.40)*.25),piece.edge?1.18:.73);
    const r=.43, lead=[-.35,.15,.13];
    eye(lead,4.0,0,level*.95,true);eye(lead,1.13,0,level);
    for(let i=0;i<7;i++){
      const a=TAU*i/7+.16,ready=working*(.78+.14*sin(t*.87+i*.53));
      const place=[cos(a)*r*(1-ready),sin(a)*r*.57*(1-ready),.21*cos(a+.35)];
      line([place,[.07*cos(a+t*.41),.08*sin(a+t*.41),.12]],kind+1,level*(.02+.48*working),.68);
      eye(place,1.55+.63*working,kind+1,level*.92);
    }
  }
  function soundWork(v,t,progress){
    const merge=ramp(progress,.775,.838);
    for(let track=0;track<3;track++){
      const wave=points(76,u=>{
        const x=mix(-.65,.66,u), event=.64+.10*(1-merge)*(track-1);
        const impulse=Math.exp(-abs(u-event)*15)*sin((u-event)*(78+track*9)+t*.9);
        const idle=.18*sin(u*TAU*(2+track)+t*1.8);
        return [x,-.18+.17*track+(impulse+.4*idle)*(.14+.026*track),.06*track];
      });
      v.line(wave,[3,2,1][track],.92,.9+track*.14);
      const cursor=clamp(.27+.62*((t*.33)%1));v.eye(wave[Math.floor(cursor*76)],1.72,[3,2,1][track],.90);
    }
    v.line([[.18,-.30,.1],[.18,.32,.1]],0,.66,.85);
  }
  function editing(v,t,progress){
    const join=ramp(progress,.878,.954);
    // Until the editor accepts, this desk contains only its own alley cut.
    const received=ramp(progress,.875,.894);
    for(let cut=0;cut<2;cut++){
      if(cut===0&&received<.001)continue;
      const offset=cut===0?mix(-.96,mix(-.52,-.34,join),received):mix(.23,.37,received);
      const x1=offset-.30,x2=offset+.30,y1=-.22,y2=.19,z=.12;
      v.line([[x1,y1,z],[x2,y1,z],[x2,y2,z],[x1,y2,z],[x1,y1,z]],cut?3:1,.91,1.03);
      if(cut===0){
        // The first cut carries the profile and the heel strike mixed in the sound studio.
        silhouette(v,offset,-.10,.25,1,t,.86,4);
        v.line(points(30,u=>[x1+.60*u,.12+sin(u*42+t)*.052*Math.exp(-abs(u-.66)*12),.13]),2,.89,.85);
      }else{
        // The following shot looks down an empty alley, with a receding horizon.
        for(let j=0;j<6;j++){
          const sy=y2-.055*j;
          v.line([[x1,sy,.15],[offset+.045,-.09,.15],[x2,sy,.15]],3,.36+j*.06,.69);
        }
      }
    }
    const cursor=-.64+((t*.23+.14)%1)*1.28;
    v.line([[cursor,-.28,.17],[cursor,.27,.17]],0,.70,.92);
  }
  function connector(ctx,a,b,phase,color,strength,permission,accepted,still){
    const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.max(1,Math.hypot(dx,dy));
    const bow=d*.10, sideX=dy/d,sideY=-dx/d;
    const at=t=>[mix(a[0],b[0],t)+sideX*bow*sin(t*PI),mix(a[1],b[1],t)+sideY*bow*sin(t*PI)];
    function pathSegment(from,to,col,alpha,w){
      ctx.beginPath();
      points(23,u=>at(mix(from,to,u))).forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));
      ctx.strokeStyle=tint(col,alpha*strength);ctx.lineWidth=w;ctx.stroke();
    }
    function bar(pt,open,col){
      for(const sign of [-1,1]){
        const inner=open?2.9:0;
        ctx.beginPath();ctx.moveTo(pt[0]+sideX*inner*sign,pt[1]+sideY*inner*sign);
        ctx.lineTo(pt[0]+sideX*6*sign,pt[1]+sideY*6*sign);ctx.strokeStyle=tint(col,(open?.92:.45)*strength);ctx.lineWidth=1;ctx.stroke();
      }
    }
    pathSegment(0,1,color,permission?.46:.18,.85);bar(a,permission,0);bar(b,accepted,color);
    if(!permission)return;
    const t=clamp(phase);
    pathSegment(Math.max(0,t-.18),t,color,.94,1.58);
    const q=at(t), r=still?3:3.25;
    ctx.beginPath();ctx.arc(...q,r,0,TAU);ctx.strokeStyle=tint(color,.97*strength);ctx.stroke();
    ctx.beginPath();ctx.arc(...q,1.25,0,TAU);ctx.fillStyle=tint(0,strength);ctx.fill();
    if(accepted) {
      ctx.beginPath();ctx.arc(...b,7,0,TAU);ctx.strokeStyle=tint(color,.42*strength);ctx.stroke();
    }
  }
  function network(ctx,w,h,cx,cy,unit,p,t,still,lang) {
    const narrow=w/h<.84;
    const hear=interval(p,.753,.780,.831,.870), assemble=interval(p,.864,.893,.949,.988);
    const destination=narrow?[[-.61,-.48],[.30,-.14],[.26,.57]]:[[-.69,-.06],[.15,-.44],[.66,.26]];
    destination[1][0]-=assemble*(narrow?.30:.12);destination[1][1]-=.08*assemble;
    destination[2][0]-=assemble*(narrow?.24:.09);destination[2][1]+=(narrow?.025:.055)*assemble;
    const zoom=ramp(p,.650,.730), first=[cx,cy];
    const pos=destination.map(([x,y])=>[cx+unit*x,cy+unit*y]);
    const src=[mix(first[0],pos[0][0],zoom),mix(first[1],pos[0][1],zoom)];
    const rel=clamp((p-.51)/.14), shotSize=unit*mix(1,narrow?.265:.30,zoom);
    const baseAngle=mix(-.42,.36,ramp(rel,0,.89))+.115*sin(t*.33);
    const S=painter(ctx,src,shotSize,baseAngle,.13+.08*sin(t*.37),mix(1,.75,zoom));
    if(zoom<.998){
      ctx.save();ctx.globalAlpha*=1-.32*zoom;shot(S,t,rel,zoom>.79);ctx.restore();
    }
    const reveal=ramp(p,.655,.723);
    if(reveal<.001)return;
    ctx.save();ctx.globalAlpha*=reveal;
    const radius=[narrow?.39:.395,narrow?.31:.335,narrow?.37:.36].map(k=>unit*k);
    radius[0]*=1-.12*hear-.14*assemble;
    radius[1]*=1+(narrow?.43:.58)*hear-.10*assemble;
    radius[2]*=1+(narrow?.38:.60)*assemble;
    // The signed commission, acceptance and return govern who gathers for this shot.
    const activity=[
      Math.max(interval(p,.65,.687,.73,.756),ramp(p,.953,.970)),
      Math.max(interval(p,.756,.78,.855,.875),interval(p,.95,.965,.978,1)*.4),
      interval(p,.875,.893,.953,.980)
    ];
    for(let i=0;i<3;i++){
      const mv=i===0?src:pos[i], k=i===0?mix(1.48*unit,radius[0],zoom):radius[i];
      const angle=[-.26,.42,-.40][i]+.15*sin(t*.46+i*.8);
      const v=painter(ctx,mv,k,angle,.20+.08*cos(t*.38+i),.83);
      drawAssembly(v,i,t,reveal,activity[i]);
      const active=v.project([-.35,.15,.13]),accepted=[.687,.756,.875][i];
      const pulse=interval(p,accepted-.008,accepted,accepted+.011,accepted+.026);
      if(pulse>.02){
        ctx.beginPath();ctx.arc(active[0],active[1],6+(1-pulse)*6,0,TAU);ctx.strokeStyle=tint(0,pulse*.91);ctx.lineWidth=1.1;ctx.stroke();
      }
      if(i===0 && zoom>.80){
        ctx.save();ctx.globalAlpha*=ramp(p,.702,.730)*.91;shot(S,t,rel,true);ctx.restore();
      }
      if(i===1){
        if(p>=.756)soundWork(painter(ctx,mv,k*.80,angle,.10,.79),t,p);
        else v.line(points(29,u=>[-.47+.95*u,.06+.045*sin(12*u+t*.78),.1]),2,.38,.77);
      }
      if(i===2)editing(painter(ctx,mv,k*.84,angle,.15,.77),p<.875?0:t,p);
      const label=words[lang]?.[i]||words.ko[i];
      ctx.font=Math.max(10,Math.min(13,unit*.045))+'px "Exhibit Label", sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=tint(0,.84*ramp(zoom,.68,.93));
      ctx.fillText(label,mv[0],mv[1]+Math.min(k*.68,unit*.26)+7);
    }
    // Both sides have gates. Only the director's approved slice leaves the
    // shooting room; after the sound owner signs, only the mix reaches editorial.
    function bounds(a,b,indexA,indexB){
      const xx=b[0]-a[0],yy=b[1]-a[1],length=Math.max(1,Math.hypot(xx,yy));
      return [[a[0]+xx/length*radius[indexA]*.79,a[1]+yy/length*radius[indexA]*.64],
        [b[0]-xx/length*radius[indexB]*.84,b[1]-yy/length*radius[indexB]*.69]];
    }
    const [s0,s1]=bounds(pos[0],pos[1],0,1),[e0,e1]=bounds(pos[1],pos[2],1,2);
    if(zoom>.62){
      connector(ctx,s0,s1,ramp(p,.730,.756),2,ramp(p,.683,.716),p>=.687,p>=.756,still);
      connector(ctx,e0,e1,ramp(p,.855,.875),3,ramp(p,.77,.83),p>=.855,p>=.875,still);
    }
    if(p>.943){
      const [finish,owner]=bounds(pos[2],pos[0],2,0);
      connector(ctx,finish,owner,ramp(p,.953,.970),1,ramp(p,.943,.955),p>=.953,p>=.970,still);
    }
    ctx.restore();
  }
  function draw(ctx,w,h,p,t,still,origin,lang) {
    if(p<.077)return;
    const narrow=w/h<.84,unit=Math.min(w*(narrow?.437:.374),h*(narrow?.430:.382));
    const cx=w*(narrow?.516:.535),cy=h*(narrow?.401:.414);
    const view=(yaw,pitch=.16)=>painter(ctx,[cx,cy],unit,yaw,pitch);
    function phase(a,b,c,d,fn){
      const amount=interval(p,a,b,c,d);
      if(amount<.001)return;
      ctx.save();ctx.globalAlpha*=amount;fn(clamp((p-b)/(c-b)));ctx.restore();
    }
    phase(.077,.125,.255,.281,r=>{
      const v=view(-.36+.33*r+.09*sin(t*.43));
      script(v,t,r);
      if(p<.177 && origin){
        const start=origin.slice(0,2),end=v.project(pagePoint(-.59,-.10,.03,t));
        const x=ramp(p,.077,.158),dx=end[0]-start[0];
        ctx.beginPath();ctx.moveTo(...start);ctx.bezierCurveTo(start[0]+dx*.42,start[1]-18,end[0]-dx*.12,end[1]+18,end[0],end[1]);
        ctx.lineWidth=.8;ctx.strokeStyle=tint(1,.34);ctx.stroke();
        const u=1-x,y=u*u*u*start[1]+3*u*u*x*(start[1]-18)+3*u*x*x*(end[1]+18)+x*x*x*end[1],xx=u*u*u*start[0]+3*u*u*x*(start[0]+dx*.42)+3*u*x*x*(end[0]-dx*.12)+x*x*x*end[0];
        ctx.beginPath();ctx.arc(xx,y,2.65,0,TAU);ctx.fillStyle=tint(1,.91);ctx.fill();
      }
    });
    phase(.255,.277,.385,.416,r=>casting(view(-.28+.49*r+.105*sin(t*.31)),t,r));
    phase(.385,.410,.499,.524,r=>rehearsal(view(.28-.46*r+.09*sin(t*.4),.24+.1*r),t,r));
    if(p>=.498){
      ctx.save();ctx.globalAlpha*=ramp(p,.498,.522);
      network(ctx,w,h,cx,cy,unit,p,t,still,lang);
      ctx.restore();
    }
  }
  window.FilmReel={draw};
})();
