/* Local exhibition messages. Each recipient sees only its own request and permitted fields. */
(() => {
  'use strict';

  const issued=new WeakSet();
  let serial=0;
  const kinds=['career','separation','payslip'];
  const fieldsByKind={
    career:['from','to','duty'],separation:['to','status'],payslip:['period','gross','deductions','net']
  };
  const scalar=v=>(typeof v==='string' && v.length>0 && v.length<=600) || (typeof v==='number' && Number.isFinite(v));
  const number=v=>typeof v==='number' && Number.isFinite(v);
  const integer=v=>Number.isSafeInteger(v) && v>=0;
  const sequence=v=>scalar(v)||(Array.isArray(v)&&v.length>0&&v.length<=32&&v.every(scalar));
  const oneOf=(...choices)=>v=>choices.includes(v);
  const docList=v=>Array.isArray(v)&&v.length>0&&v.length<=3&&v.every(id=>kinds.includes(id))&&new Set(v).size===v.length;
  const records=v=>Array.isArray(v)&&v.length>0&&v.every(doc=>kinds.includes(doc?.kind)&&doc?.fields);
  const adviceFacets=(...allowed)=>values=>Array.isArray(values)&&values.length<=allowed.length&&new Set(values).size===values.length&&values.every(v=>allowed.includes(v));
  const rules={
    documents:{from:'ON',to:'employer',purpose:['personal-record','job-application'],action:'issue-selected',basis:'employer-record',
      input:{documents:docList},output:{documents:records,basis:oneOf('employer-record')}},
    support:{from:'ON',to:'public-support',purpose:['find-support'],action:'find-directory',basis:'public-directory',
      input:{topic:oneOf(0,1,2),area:oneOf(0,1,2)},output:{topic:integer,area:integer,basis:oneOf('public-directory')}},
    regional:{from:'public-support',to:'regional-service',purpose:['find-local-desk'],action:'locate-service',basis:'public-directory',
      input:{topic:oneOf(0,1,2),area:oneOf(1,2)},output:{topic:integer,area:integer,basis:oneOf('public-directory')}},
    workAdvice:{from:'local-duru',to:'employment-agent',purpose:['compare-guidance'],action:'prepare-next-step',basis:'sample-referral',
      input:{region:oneOf('KR','US','ES'),facets:adviceFacets('training','jobsearch')},
      output:{service:scalar,basis:oneOf('sample-referral')}},
    livingAdvice:{from:'local-duru',to:'living-agent',purpose:['compare-guidance'],action:'prepare-next-step',basis:'sample-referral',
      input:{region:oneOf('KR','US','ES'),facets:adviceFacets('housing','food','bills','care')},
      output:{service:scalar,basis:oneOf('sample-referral')}},
    shop:{from:'wardrobe',to:'shop',purpose:['match-accessory'],action:'quote',basis:'fictional-stock',
      input:{article:oneOf('stoneRing','pearlNecklace','rainPack'),withinDays:oneOf(0,1,2)},
      output:{shop:oneOf('workshop','market','outdoor'),won:integer,days:integer,stock:integer}},
    cost:{from:'ON',to:'operations',purpose:['compare-costs'],action:'simulate',basis:'synthetic-orders',
      input:{months:oneOf(3,6,12),incoming:integer,branch:oneOf(0,1)},output:{plan:integer,net:number,backlog:integer}},
    film:{from:'ON',to:'production',purpose:['make-scene'],action:'propose',basis:'synthetic-brief',
      input:{scene:scalar,brief:scalar},output:{proposal:scalar,basis:scalar}},
    filmSound:{from:'production',to:'sound',purpose:['score-footsteps'],action:'design-footsteps',basis:'synthetic-cues',
      input:{duration:scalar,steps:sequence,surface:scalar},output:{soundCue:scalar,basis:scalar}},
    filmEdit:{from:'sound',to:'editing',purpose:['sync-next-cut'],action:'cut-to-cue',basis:'approved-cue',
      input:{duration:scalar,soundCue:scalar,cutBeat:scalar},output:{editCue:scalar,basis:scalar}}
  };
  // On can also speak directly using the same minimal fields, with the reply going to On.
  rules.directWorkAdvice={...rules.workAdvice,from:'ON',purpose:['direct-guidance']};
  rules.directLivingAdvice={...rules.livingAdvice,from:'ON',purpose:['direct-guidance']};
  function project(schema,data) {
    const result={};
    for(const [key,test] of Object.entries(schema)){
      if(!Object.hasOwn(data,key)||!test(data[key]))throw new TypeError('Invalid scope field: '+key);
      result[key]=Array.isArray(data[key])?Object.freeze([...data[key]]):data[key];
    }
    return Object.freeze(result);
  }
  function open(route,fields,grant={}) {
    const rule=Object.hasOwn(rules,route)?rules[route]:null;
    if(!rule||!rule.purpose.includes(grant.purpose))throw new TypeError('Purpose not granted');
    const input=project(rule.input,fields);
    const alias='ON·'+(++serial).toString(36).toUpperCase().padStart(3,'0');
    const next=route==='support'&&grant.next==='regional'&&input.area>0?'regional':null;
    const packet=Object.freeze({route,alias,sender:rule.from,recipient:rule.to,returnRecipient:rule.from,
      purpose:grant.purpose,action:rule.action,basis:rule.basis,next,input});
    issued.add(packet);return packet;
  }
  function receive(packet,recipient) {
    if(!issued.has(packet)||packet.recipient!==recipient)throw new TypeError('Recipient outside scope');
    return packet.input;
  }
  function returnTo(packet,recipient,data) {
    if(!issued.has(packet)||packet.returnRecipient!==recipient)throw new TypeError('Return outside scope');
    const result=project(rules[packet.route].output,data);
    if(packet.route!=='documents')return result;
    // Even inside an otherwise legitimate response, strip all fields outside the selected document.
    const ids=result.documents.map(doc=>doc.kind);
    if(!docList(ids)||ids.length!==packet.input.documents.length||!ids.every(id=>packet.input.documents.includes(id)))
      throw new TypeError('Unrequested document');
    const documents=result.documents.map(({kind,fields})=>{
      const schema=Object.fromEntries(fieldsByKind[kind].map(key=>[key,scalar]));
      return Object.freeze({kind,fields:project(schema,fields)});
    });
    return Object.freeze({documents:Object.freeze(documents),basis:result.basis});
  }
  function onward(packet,route) {
    if(!issued.has(packet)||!packet.next||packet.next!==route||packet.recipient!==rules[route]?.from)
      throw new TypeError('Onward handoff not granted');
    return open(route,packet.input,{purpose:rules[route].purpose[0]});
  }
  window.ScopedHandoff=Object.freeze({open,receive,returnTo,onward});
})();
